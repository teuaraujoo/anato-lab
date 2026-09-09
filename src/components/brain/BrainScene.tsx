"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Canvas, events, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  Box3,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Vector3,
  type Object3D,
} from "three";
import { BrainModel } from "./scene/BrainModel";
import { useBrainStore, isInternalBrainPart } from "@/store/brainStore";

const cameraOptions = {
  position: [8, 4, 7] as [number, number, number],
  fov: 38,
  near: 0.05,
  far: 150,
};
function isVisible(object: Object3D) {
  for (let current: Object3D | null = object; current; current = current.parent)
    if (!current.visible) return false;
  return true;
}
const visibleEvents: typeof events = (state) => ({
  ...events(state),
  filter: (items) => items.filter(({ object }) => isVisible(object)),
});

function CameraController() {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const renderer = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const resetVersion = useBrainStore((s) => s.resetVersion);
  const focusVersion = useBrainStore((s) => s.focusVersion);
  const previous = useRef({ reset: -1, focus: -1, halfFov: 0 });

  useEffect(() => {
    const control = controls.current;
    if (!control || !size.width || !size.height) return;
    const vertical = MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(
      (Math.tan(vertical) * size.width) / size.height,
    );
    const halfFov = Math.min(vertical, horizontal);
    const last = previous.current;
    const state = useBrainStore.getState();
    const focusing =
      last.focus !== focusVersion &&
      last.reset === resetVersion &&
      state.selectedId;
    if (last.reset !== resetVersion || focusing) {
      scene.updateMatrixWorld(true);
      const box = new Box3();
      const visibleMeshes: Mesh[] = [];
      scene.getObjectByName("brain-model")?.traverse((object) => {
        if (!(object instanceof Mesh) || !isVisible(object)) return;
        const data = object.parent?.userData;
        if (
          focusing &&
          data?.structureId !== state.selectedId &&
          data?.hemisphereId !== state.selectedId
        )
          return;
        object.geometry.computeBoundingBox();
        visibleMeshes.push(object);
        if (object.geometry.boundingBox)
          box.union(
            object.geometry.boundingBox
              .clone()
              .applyMatrix4(object.matrixWorld),
          );
      });
      if (!box.isEmpty()) {
        const center = box.getCenter(new Vector3());
        const direction =
          (state.cutaway && !state.exploded) ||
          (focusing && isInternalBrainPart(state.selectedId))
            ? new Vector3(1, 0.14, 0.12).normalize()
            : new Vector3(1, 0.38, 0.8).normalize();
        const right = new Vector3()
          .crossVectors(camera.up, direction)
          .normalize();
        const up = new Vector3().crossVectors(direction, right);
        let distance = 0;
        const p = new Vector3();
        for (const mesh of visibleMeshes) {
          const positions = mesh.geometry.getAttribute("position");
          for (let index = 0; index < positions.count; index++) {
            p.fromBufferAttribute(positions, index)
              .applyMatrix4(mesh.matrixWorld)
              .sub(center);
            distance = Math.max(
              distance,
              Math.abs(p.dot(right)) / Math.tan(horizontal) + p.dot(direction),
              Math.abs(p.dot(up)) / Math.tan(vertical) + p.dot(direction),
            );
          }
        }
        distance = Math.max(1.5, distance * 1.12);
        camera.position.copy(center).add(direction.multiplyScalar(distance));
        control.target.copy(center);
        control.minDistance = focusing ? 0.6 : 3;
        control.maxDistance = Math.max(30, distance * 2);
      }
    } else if (last.halfFov && last.halfFov !== halfFov) {
      camera.position
        .sub(control.target)
        .multiplyScalar(Math.sin(last.halfFov) / Math.sin(halfFov))
        .add(control.target);
    }
    previous.current = { reset: resetVersion, focus: focusVersion, halfFov };
    control.update();
    invalidate();
    if (process.env.NODE_ENV === "development")
      Object.assign(window, {
        __brainReview: {
          scene,
          camera,
          control,
          invalidate,
          renderer,
          store: useBrainStore,
        },
      });
    return () => {
      if (process.env.NODE_ENV === "development")
        Reflect.deleteProperty(window, "__brainReview");
    };
  }, [
    camera,
    scene,
    size.width,
    size.height,
    renderer,
    invalidate,
    resetVersion,
    focusVersion,
  ]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={false}
    />
  );
}

function BrainScene() {
  const [available] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) return false;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  if (!available)
    return (
      <div className="scene-message" role="status">
        <p>Não foi possível iniciar o visualizador 3D.</p>
        <p>Você pode continuar pela lista de estruturas.</p>
      </div>
    );
  return (
    <Canvas
      frameloop="demand"
      camera={cameraOptions}
      dpr={[1, 1.5]}
      events={visibleEvents}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fff6ee", "#233647", 0.7]} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} color="#fff1df" />
      <directionalLight
        position={[-4, 2, -5]}
        intensity={1.1}
        color="#a0ded7"
      />
      <directionalLight position={[1, -2, 3]} intensity={0.3} />
      <BrainModel />
      <CameraController />
    </Canvas>
  );
}
export default memo(BrainScene);

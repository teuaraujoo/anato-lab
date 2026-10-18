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
import { HeartModel } from "./scene/HeartModel";
import { useHeartStore } from "@/store/heartStore";

const cameraOptions = {
  position: [3, 1, 10] as [number, number, number],
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
  const resetVersion = useHeartStore((s) => s.resetVersion);
  const focusVersion = useHeartStore((s) => s.focusVersion);
  const previous = useRef({ reset: -1, focus: -1, halfFov: 0 });
  useEffect(() => {
    const control = controls.current;
    if (!control || !size.width || !size.height) return;
    const vertical = MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(
      (Math.tan(vertical) * size.width) / size.height,
    );
    const halfFov = Math.min(vertical, horizontal);
    const last = previous.current,
      state = useHeartStore.getState();
    const focusing =
      last.focus !== focusVersion &&
      last.reset === resetVersion &&
      state.selectedId;
    if (last.reset !== resetVersion || focusing) {
      scene.updateMatrixWorld(true);
      const box = new Box3(),
        meshes: Mesh[] = [];
      scene.getObjectByName("heart-model")?.traverse((object) => {
        if (!(object instanceof Mesh) || !isVisible(object)) return;
        if (
          focusing &&
          object.parent?.userData.structureId !== state.selectedId
        )
          return;
        object.geometry.computeBoundingBox();
        meshes.push(object);
        if (object.geometry.boundingBox)
          box.union(
            object.geometry.boundingBox
              .clone()
              .applyMatrix4(object.matrixWorld),
          );
      });
      if (!box.isEmpty()) {
        const center = box.getCenter(new Vector3());
        const direction = (
          state.cutaway && !state.exploded
            ? new Vector3(0.07, 0.08, 1)
            : new Vector3(0.24, 0.14, 1)
        ).normalize();
        const right = new Vector3()
          .crossVectors(camera.up, direction)
          .normalize();
        const up = new Vector3().crossVectors(direction, right),
          p = new Vector3();
        let distance = 0;
        for (const mesh of meshes) {
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
        distance = Math.max(1.1, distance * 1.13);
        camera.position.copy(center).add(direction.multiplyScalar(distance));
        control.target.copy(center);
        control.minDistance = focusing ? 0.4 : 2.5;
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
        __heartReview: {
          scene,
          camera,
          control,
          invalidate,
          renderer,
          store: useHeartStore,
        },
      });
    return () => {
      if (process.env.NODE_ENV === "development")
        Reflect.deleteProperty(window, "__heartReview");
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

function HeartScene() {
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
      <hemisphereLight args={["#fff0e7", "#182c42", 0.65]} />
      <directionalLight position={[-4, 6, 7]} intensity={2.0} color="#fff0de" />
      <directionalLight position={[4, 2, -4]} intensity={1.1} color="#9fd8d5" />
      <directionalLight position={[4, -2, 5]} intensity={0.45} />
      <HeartModel />
      <CameraController />
    </Canvas>
  );
}
export default memo(HeartScene);

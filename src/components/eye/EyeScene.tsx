"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Canvas, events, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { EyeModel } from "./scene/EyeModel";
import { useEyeStore } from "@/store/eyeStore";

const INITIAL_CAMERA = {
  position: [5.1, 1.2, 8.7] as [number, number, number],
  fov: 38,
  near: 0.05,
  far: 100,
};
const GL_OPTIONS = { antialias: true, alpha: true };
const DPR: [number, number] = [1, 1.5];

const visibleEvents: typeof events = (state) => ({
  ...events(state),
  filter: (items) =>
    items.filter(({ object }) => {
      for (
        let current: typeof object | null = object;
        current;
        current = current.parent
      )
        if (!current.visible) return false;
      return true;
    }),
});

function CameraController() {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const scene = useThree((state) => state.scene);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const resetVersion = useEyeStore((state) => state.resetVersion);
  const focusVersion = useEyeStore((state) => state.focusVersion);
  const previous = useRef({ reset: -1, focus: 0, halfFov: 0 });

  useEffect(() => {
    const control = controls.current;
    if (!control || !size.width || !size.height) return;
    const vertical = MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(
      (Math.tan(vertical) * size.width) / size.height,
    );
    const halfFov = Math.min(vertical, horizontal);
    const last = previous.current;
    const id = useEyeStore.getState().selectedId;
    if (last.reset !== resetVersion) {
      const distance = Math.max(
        5.2 / Math.tan(horizontal),
        5.2 / Math.tan(vertical),
      );
      camera.position.set(distance * 0.54, distance * 0.13, distance * 0.84);
      control.target.set(0, 0, 0);
      control.minDistance = 3;
      control.maxDistance = Math.max(24, distance * 1.7);
      if (useEyeStore.getState().exploded) {
        const model = scene.getObjectByName("eye-model");
        if (model) {
          model.updateWorldMatrix(true, true);
          const box = new Box3().setFromObject(model);
          if (!box.isEmpty()) {
            const center = box.getCenter(new Vector3());
            const direction = new Vector3(0.85, 0.22, 0.6).normalize();
            const right = new Vector3()
              .crossVectors(camera.up, direction)
              .normalize();
            const up = new Vector3().crossVectors(direction, right);
            let fittedDistance = 0;
            // Enquadra os cantos no campo de visão, sem afastar pela diagonal inteira.
            for (const x of [box.min.x, box.max.x])
              for (const y of [box.min.y, box.max.y])
                for (const z of [box.min.z, box.max.z]) {
                  const corner = new Vector3(x, y, z).sub(center);
                  fittedDistance = Math.max(
                    fittedDistance,
                    Math.abs(corner.dot(right)) / Math.tan(horizontal) +
                      corner.dot(direction),
                    Math.abs(corner.dot(up)) / Math.tan(vertical) +
                      corner.dot(direction),
                  );
                }
            fittedDistance *= 1.12;
            camera.position
              .copy(center)
              .add(direction.multiplyScalar(fittedDistance));
            control.target.copy(center);
            control.maxDistance = Math.max(24, fittedDistance * 2);
          }
        }
      }
    } else if (last.focus !== focusVersion && id) {
      const object = scene.getObjectByName(id);
      if (object) {
        object.updateWorldMatrix(true, true);
        const box = new Box3().setFromObject(object);
        if (!box.isEmpty()) {
          const center = box.getCenter(new Vector3());
          const radius = Math.max(
            box.getSize(new Vector3()).length() / 2,
            0.35,
          );
          const distance = (radius / Math.sin(halfFov)) * 1.15;
          camera.position.copy(center).add(new Vector3(0, 0.12, distance));
          control.target.copy(center);
          control.minDistance = Math.max(0.5, radius * 1.2);
          control.maxDistance = Math.max(24, distance * 2);
        }
      }
    } else if (last.halfFov) {
      const offset = camera.position.clone().sub(control.target);
      offset.multiplyScalar(Math.sin(last.halfFov) / Math.sin(halfFov));
      camera.position.copy(control.target).add(offset);
    }
    previous.current = { reset: resetVersion, focus: focusVersion, halfFov };
    control.update();
    invalidate();
  }, [
    camera,
    scene,
    size.width,
    size.height,
    resetVersion,
    focusVersion,
    invalidate,
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

function EyeScene() {
  const [webglAvailable] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) return false;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  if (!webglAvailable)
    return (
      <div className="scene-message" role="status">
        <p>Não foi possível iniciar o visualizador 3D.</p>
        <p>Você pode continuar pela lista de estruturas.</p>
      </div>
    );
  return (
    <Canvas
      frameloop="demand"
      camera={INITIAL_CAMERA}
      dpr={DPR}
      events={visibleEvents}
      gl={GL_OPTIONS}
      fallback={
        <div className="scene-message">
          O 3D não está disponível neste dispositivo.
        </div>
      }
    >
      <ambientLight intensity={0.82} />
      <hemisphereLight args={["#d7f1f2", "#1b2633", 1.25]} />
      <directionalLight position={[-3, 5, 7]} intensity={2.4} color="#fff0de" />
      <directionalLight
        position={[4, -1, 3]}
        intensity={1.15}
        color="#8be9e0"
      />
      <EyeModel />
      <CameraController />
    </Canvas>
  );
}

export default memo(EyeScene);

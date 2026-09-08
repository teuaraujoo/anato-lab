"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Canvas, events, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { AnimalCell } from "./scene/AnimalCell";
import { useCellStore } from "@/store/cellStore";

const INITIAL_CAMERA = {
  position: [0, 0.2, 11] as [number, number, number],
  fov: 38,
  near: 0.05,
  far: 100,
};
const GL_OPTIONS = { antialias: true, alpha: true };
const DPR: [number, number] = [1, 1.5];

// Ignora objetos isolados/ocultos também no raycasting, não apenas no desenho.
const visibleEvents: typeof events = (state) => ({
  ...events(state),
  filter: (items) =>
    items.filter(({ object }) => {
      for (
        let current: typeof object | null = object;
        current;
        current = current.parent
      ) {
        if (!current.visible) return false;
      }
      return true;
    }),
});

function CameraController() {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const resetVersion = useCellStore((s) => s.resetVersion);
  const focusVersion = useCellStore((s) => s.focusVersion);
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
    const id = useCellStore.getState().selectedOrganelleId;

    if (last.reset !== resetVersion) {
      const exploded = useCellStore.getState().exploded;
      if (exploded) {
        const model = scene.getObjectByName("cell-root");
        if (model) {
          model.updateWorldMatrix(true, true);
          const box = new Box3().setFromObject(model);
          if (!box.isEmpty()) {
            const center = box.getCenter(new Vector3());
            const radius = Math.max(
              box.getSize(new Vector3()).length() / 2,
              0.35,
            );
            const distance = (radius / Math.sin(halfFov)) * 1.12;
            control.target.copy(center);
            camera.position
              .copy(center)
              .add(
                new Vector3(0.4, 0.2, 1).normalize().multiplyScalar(distance),
              );
            control.minDistance = Math.max(1, radius * 0.8);
            control.maxDistance = Math.max(24, distance * 1.7);
          }
        }
      } else {
        const distance = Math.max(
          3.6 / Math.tan(horizontal),
          3.22 / Math.tan(vertical),
        );
        camera.position.set(0, 0.2, distance);
        control.target.set(0, 0, 0);
        control.minDistance = 2;
        control.maxDistance = Math.max(24, distance * 1.7);
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
          const distance = (radius / Math.sin(halfFov)) * 1.12;
          camera.position.copy(center).add(new Vector3(0, 0.12, distance));
          control.target.copy(center);
          control.minDistance = Math.max(0.5, radius * 1.2);
          control.maxDistance = Math.max(24, distance * 2);
        }
      }
    } else if (last.halfFov) {
      // Resize mantém orientação, alvo e zoom relativo. A barra de rolagem
      // pode mudar a largura ao abrir o painel; isso não deve restaurar a vista.
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

function CellScene() {
  // A criação assíncrona do renderer pode falhar fora do ErrorBoundary.
  // Testa o suporte antes de montar o Canvas e libera o contexto de teste.
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
          O 3D não está disponível neste dispositivo. Explore todas as
          estruturas pela lista ao lado.
        </div>
      }
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#c2e5f0", "#1b2633", 1.25]} />
      <directionalLight position={[-3, 5, 7]} intensity={2.6} color="#fff0de" />
      <directionalLight position={[4, -1, 3]} intensity={1.2} color="#8be9e0" />
      <AnimalCell />
      <CameraController />
    </Canvas>
  );
}

export default memo(CellScene);

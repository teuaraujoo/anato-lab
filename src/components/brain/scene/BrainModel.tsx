"use client";

import { useEffect, useMemo } from "react";
import { Color, DoubleSide } from "three";
import { brainContentById } from "@/content/brain";
import { useBrainStore } from "@/store/brainStore";
import { createBrainParts, type BrainPart } from "./geometry";

function Part({ part }: { part: BrainPart }) {
  const { id, hemisphere, geometry, offset, internal } = part;
  const active = useBrainStore(
    (s) =>
      s.selectedId === id || Boolean(hemisphere && s.selectedId === hemisphere),
  );
  const hovered = useBrainStore(
    (s) =>
      s.hoveredId === id || Boolean(hemisphere && s.hoveredId === hemisphere),
  );
  const dimmed = useBrainStore((s) =>
    Boolean(s.selectedId && s.selectedId !== id && s.selectedId !== hemisphere),
  );
  const exploded = useBrainStore((s) => s.exploded);
  const visible = useBrainStore((s) => {
    if (s.isolatedId) return s.isolatedId === id || s.isolatedId === hemisphere;
    if (internal) return s.cutaway || s.exploded;
    return !(s.cutaway && !s.exploded && hemisphere === "left-hemisphere");
  });
  const color = useMemo(
    () =>
      new Color(brainContentById[id].color).multiplyScalar(dimmed ? 0.28 : 1),
    [id, dimmed],
  );
  return (
    <group
      name={hemisphere ? `${hemisphere}--${id}` : id}
      visible={visible}
      position={exploded ? offset : [0, 0, 0]}
      renderOrder={active ? 2 : 0}
      userData={{ structureId: id, hemisphereId: hemisphere }}
      onClick={(e) => {
        if (e.delta > 4 || !visible) return;
        e.stopPropagation();
        useBrainStore.getState().select(id);
      }}
      onPointerOver={(e) => {
        if (!visible) return;
        e.stopPropagation();
        useBrainStore.getState().hover(id);
      }}
      onPointerOut={() => {
        if (useBrainStore.getState().hoveredId === id)
          useBrainStore.getState().hover(null);
      }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={brainContentById[id].color}
          emissiveIntensity={active ? 0.28 : dimmed ? 0 : hovered ? 0.13 : 0}
          roughness={dimmed ? 0.93 : 0.51}
          metalness={0}
          transparent={active || dimmed}
          opacity={dimmed ? 0.14 : 1}
          depthWrite={!dimmed}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function BrainModel() {
  const parts = useMemo(() => createBrainParts(), []);
  useEffect(() => () => parts.forEach((p) => p.geometry.dispose()), [parts]);
  return (
    <group name="brain-model" userData={{ modelId: "human-brain" }}>
      {parts.map((p) => (
        <Part key={`${p.hemisphere ?? "midline"}:${p.id}`} part={p} />
      ))}
    </group>
  );
}

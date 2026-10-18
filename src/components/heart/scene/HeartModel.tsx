"use client";

import { useEffect, useMemo } from "react";
import { Color, DoubleSide } from "three";
import { heartContentById } from "@/content/heart";
import { useHeartStore } from "@/store/heartStore";
import { createHeartParts, type HeartPart } from "./geometry";

function Part({ part }: { part: HeartPart }) {
  const { id, geometry, cutGeometry, offset, internal } = part;
  const active = useHeartStore((s) => s.selectedId === id);
  const hovered = useHeartStore((s) => s.hoveredId === id);
  const dimmed = useHeartStore((s) =>
    Boolean(s.selectedId && s.selectedId !== id),
  );
  const exploded = useHeartStore((s) => s.exploded);
  const cutaway = useHeartStore((s) => s.cutaway);
  const visible = useHeartStore((s) =>
    s.isolatedId ? s.isolatedId === id : !internal || s.cutaway || s.exploded,
  );
  const color = useMemo(
    () =>
      new Color(heartContentById[id].color).multiplyScalar(dimmed ? 0.25 : 1),
    [id, dimmed],
  );
  return (
    <group
      name={id}
      visible={visible}
      position={exploded ? offset : [0, 0, 0]}
      renderOrder={active ? 2 : 0}
      userData={{ structureId: id }}
      onClick={(e) => {
        if (e.delta > 4 || !visible) return;
        e.stopPropagation();
        useHeartStore.getState().select(id);
      }}
      onPointerOver={(e) => {
        if (!visible) return;
        e.stopPropagation();
        useHeartStore.getState().hover(id);
      }}
      onPointerOut={() => {
        if (useHeartStore.getState().hoveredId === id)
          useHeartStore.getState().hover(null);
      }}
    >
      <mesh geometry={cutaway && cutGeometry ? cutGeometry : geometry}>
        <meshStandardMaterial
          color={color}
          emissive={heartContentById[id].color}
          emissiveIntensity={active ? 0.3 : dimmed ? 0 : hovered ? 0.12 : 0}
          roughness={dimmed ? 0.95 : internal ? 0.58 : 0.48}
          metalness={0}
          transparent={active || dimmed}
          opacity={dimmed ? 0.13 : 1}
          depthWrite={!dimmed}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function HeartModel() {
  const parts = useMemo(() => createHeartParts(), []);
  useEffect(
    () => () =>
      parts.forEach((p) => {
        p.geometry.dispose();
        p.cutGeometry?.dispose();
      }),
    [parts],
  );
  return (
    <group name="heart-model" userData={{ modelId: "human-heart" }}>
      {parts.map((p) => (
        <Part key={p.id} part={p} />
      ))}
    </group>
  );
}

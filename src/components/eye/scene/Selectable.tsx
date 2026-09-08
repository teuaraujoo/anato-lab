"use client";

import type { ReactNode } from "react";
import { Color, DoubleSide } from "three";
import { eyeSeparationOffsets } from "./separation";
import { eyeContentById } from "@/content/eye";
import { useEyeStore } from "@/store/eyeStore";
import type { EyeStructureId } from "@/types/eye";

export function Selectable({
  id,
  children,
}: {
  id: EyeStructureId;
  children: ReactNode;
}) {
  const visible = useEyeStore(
    (state) => !state.isolatedId || state.isolatedId === id,
  );
  const select = useEyeStore((state) => state.select);
  const hover = useEyeStore((state) => state.hover);
  const exploded = useEyeStore((state) => state.exploded);
  const active = useEyeStore((state) => state.selectedId === id);
  return (
    <group
      name={id}
      userData={{ structureId: id }}
      visible={visible}
      renderOrder={active ? 1 : 0}
      position={exploded ? eyeSeparationOffsets[id] : [0, 0, 0]}
      onClick={(event) => {
        if (event.delta > 4 || !visible) return;
        event.stopPropagation();
        select(id);
      }}
      onPointerOver={(event) => {
        if (!visible) return;
        event.stopPropagation();
        hover(id);
      }}
      onPointerOut={() => {
        if (useEyeStore.getState().hoveredId === id) hover(null);
      }}
    >
      {children}
    </group>
  );
}

export function EyeMaterial({
  id,
  color,
  opacity = 1,
  roughness = 0.4,
  transmission = 0,
}: {
  id: EyeStructureId;
  color?: string;
  opacity?: number;
  roughness?: number;
  transmission?: number;
}) {
  const active = useEyeStore((state) => state.selectedId === id);
  const hovered = useEyeStore((state) => state.hoveredId === id);
  const dimmed = useEyeStore((state) =>
    Boolean(state.selectedId && state.selectedId !== id),
  );
  const tint = color ?? eyeContentById[id].color;
  const materialOpacity = active
    ? 1
    : dimmed
      ? Math.min(opacity, 0.22)
      : opacity;
  const materialTransmission = active ? 0 : transmission;
  return (
    <meshPhysicalMaterial
      color={dimmed ? new Color(tint).multiplyScalar(0.28) : tint}
      emissive={active && id === "pupil" ? "#9be0c8" : tint}
      emissiveIntensity={active ? 0.4 : dimmed ? 0 : hovered ? 0.36 : 0.04}
      roughness={
        dimmed ? 0.9 : active ? Math.max(0.12, roughness - 0.12) : roughness
      }
      metalness={0.02}
      transmission={dimmed ? 0 : materialTransmission}
      thickness={active ? 0.28 : 0.18}
      clearcoat={dimmed ? 0 : active ? 0.72 : 0.18}
      clearcoatRoughness={active ? 0.12 : 0.32}
      transparent={active || materialOpacity < 1 || materialTransmission > 0}
      opacity={materialOpacity}
      depthWrite={materialOpacity > 0.8}
      side={DoubleSide}
    />
  );
}

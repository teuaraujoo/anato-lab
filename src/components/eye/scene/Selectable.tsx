"use client";

import type { ReactNode } from "react";
import { DoubleSide } from "three";
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
  const active = useEyeStore((state) => state.selectedId === id);
  const hovered = useEyeStore((state) => state.hoveredId === id);
  const highlighted = active || hovered;
  return (
    <group
      name={id}
      userData={{ structureId: id }}
      visible={visible}
      scale={active ? 1.075 : highlighted ? 1.025 : 1}
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
  const tint = color ?? eyeContentById[id].color;
  const materialOpacity = active ? Math.min(1, opacity + 0.2) : opacity;
  const materialTransmission = active
    ? Math.min(0.08, transmission)
    : transmission;
  return (
    <meshPhysicalMaterial
      color={tint}
      emissive={tint}
      emissiveIntensity={active ? 1.15 : hovered ? 0.36 : 0.04}
      roughness={active ? Math.max(0.12, roughness - 0.12) : roughness}
      metalness={0.02}
      transmission={materialTransmission}
      thickness={active ? 0.28 : 0.18}
      clearcoat={active ? 0.72 : 0.18}
      clearcoatRoughness={active ? 0.12 : 0.32}
      transparent={materialOpacity < 1 || materialTransmission > 0}
      opacity={materialOpacity}
      depthWrite={materialOpacity > 0.8}
      side={DoubleSide}
    />
  );
}

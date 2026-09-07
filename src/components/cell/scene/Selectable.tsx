"use client";

import type { ReactNode } from "react";
import { DoubleSide } from "three";
import { contentById } from "@/content/animalCell";
import { useCellStore } from "@/store/cellStore";
import type { OrganelleId } from "@/types/cell";

export function Selectable({
  id,
  children,
}: {
  id: OrganelleId;
  children: ReactNode;
}) {
  const visible = useCellStore(
    (s) => !s.isolatedOrganelleId || s.isolatedOrganelleId === id,
  );
  const select = useCellStore((s) => s.select);
  const hover = useCellStore((s) => s.hover);
  return (
    <group
      name={id}
      userData={{ organelleId: id }}
      visible={visible}
      onClick={(e) => {
        if (e.delta > 4 || !visible) return;
        e.stopPropagation();
        select(id);
      }}
      onPointerOver={(e) => {
        if (!visible) return;
        e.stopPropagation();
        hover(id);
      }}
      onPointerOut={() => {
        if (useCellStore.getState().hoveredOrganelleId === id) hover(null);
      }}
    >
      {children}
    </group>
  );
}

export function Surface({
  id,
  color,
  opacity = 1,
  roughness = 0.38,
}: {
  id: OrganelleId;
  color?: string;
  opacity?: number;
  roughness?: number;
}) {
  const active = useCellStore((s) => s.selectedOrganelleId === id);
  const hovered = useCellStore((s) => s.hoveredOrganelleId === id);
  const tint = color ?? contentById[id].color;
  return (
    <meshStandardMaterial
      color={tint}
      emissive={tint}
      emissiveIntensity={active ? 0.48 : hovered ? 0.2 : 0.025}
      roughness={roughness}
      metalness={0.08}
      side={DoubleSide}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity === 1}
    />
  );
}

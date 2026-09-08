"use client";

import { useMemo, type ReactNode } from "react";
import { Color, DoubleSide } from "three";
import { contentById } from "@/content/animalCell";
import { useCellStore } from "@/store/cellStore";
import type { OrganelleId } from "@/types/cell";
import { cellSeparationOffsets } from "./separation";

// O nucléolo é um detalhe do núcleo. Ele permanece no mesmo grupo semântico
// para seleção, isolamento e separação, embora continue disponível como item
// próprio na lista de estruturas.
const PARENT_ORGANELLE: Partial<Record<OrganelleId, OrganelleId>> = {
  nucleolus: "nucleus",
};

const ZERO_OFFSET: [number, number, number] = [0, 0, 0];

function semanticRoot(id: OrganelleId): OrganelleId {
  let root = id;
  const seen = new Set<OrganelleId>();
  while (PARENT_ORGANELLE[root] && !seen.has(root)) {
    seen.add(root);
    root = PARENT_ORGANELLE[root]!;
  }
  return root;
}

function isDescendantOf(id: OrganelleId, ancestor: OrganelleId) {
  let parent = PARENT_ORGANELLE[id];
  const seen = new Set<OrganelleId>();
  while (parent && !seen.has(parent)) {
    if (parent === ancestor) return true;
    seen.add(parent);
    parent = PARENT_ORGANELLE[parent];
  }
  return false;
}

// Selecionar um grupo pai destaca também os seus detalhes. Ao selecionar o
// detalhe, porém, o pai fica dimmed para que o alvo continue distinguível.
function isHighlighted(id: OrganelleId, selected: OrganelleId) {
  return id === selected || isDescendantOf(id, selected);
}

export function sharesSemanticGroup(first: OrganelleId, second: OrganelleId) {
  return semanticRoot(first) === semanticRoot(second);
}

export function Selectable({
  id,
  children,
  nested = false,
}: {
  id: OrganelleId;
  children: ReactNode;
  /** A nested detail inherits its parent group's separation offset. */
  nested?: boolean;
}) {
  const visible = useCellStore(
    (s) =>
      !s.isolatedOrganelleId || sharesSemanticGroup(s.isolatedOrganelleId, id),
  );
  const exploded = useCellStore((s) => s.exploded);
  const selectedId = useCellStore((s) => s.selectedOrganelleId);
  const select = useCellStore((s) => s.select);
  const hover = useCellStore((s) => s.hover);
  const active = Boolean(selectedId && isHighlighted(id, selectedId));
  const position = nested
    ? ZERO_OFFSET
    : exploded
      ? cellSeparationOffsets[id]
      : ZERO_OFFSET;
  return (
    <group
      name={id}
      position={position}
      userData={{ organelleId: id, semanticGroup: semanticRoot(id) }}
      visible={visible}
      renderOrder={active ? 1 : 0}
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
  const selectedId = useCellStore((s) => s.selectedOrganelleId);
  const hoveredId = useCellStore((s) => s.hoveredOrganelleId);
  const active = Boolean(selectedId && isHighlighted(id, selectedId));
  const hovered = Boolean(hoveredId && isHighlighted(id, hoveredId));
  const tint = color ?? contentById[id].color;
  const dimmed = Boolean(selectedId && !active);
  const materialColor = useMemo(() => {
    const nextColor = new Color(tint);
    if (dimmed) nextColor.multiplyScalar(0.28);
    return nextColor;
  }, [dimmed, tint]);
  const isEnvelope = id === "membrane" || id === "cytoplasm";
  const revealParent = Boolean(
    selectedId && selectedId !== id && isDescendantOf(selectedId, id),
  );
  // O envelope continua presente no modo de foco, mas não deve encobrir a
  // organela escolhida. O valor original é restaurado exatamente ao limpar.
  const effectiveOpacity = revealParent
    ? opacity * 0.2
    : dimmed && isEnvelope
      ? opacity * 0.35
      : opacity;
  // Materiais dimmed nunca devem formar uma camada opaca sobre o alvo. A
  // transparência só é aplicada durante o foco e volta ao valor original ao
  // limpar a seleção.
  const materialOpacity = dimmed
    ? Math.min(effectiveOpacity, 0.22)
    : effectiveOpacity;
  const effectiveRoughness = dimmed ? Math.max(roughness, 0.9) : roughness;
  return (
    <meshStandardMaterial
      color={materialColor}
      emissive={tint}
      emissiveIntensity={active ? 0.48 : dimmed ? 0 : hovered ? 0.2 : 0.025}
      roughness={effectiveRoughness}
      metalness={0.08}
      side={DoubleSide}
      transparent={materialOpacity < 1}
      opacity={materialOpacity}
      depthWrite={!dimmed && materialOpacity === 1}
    />
  );
}

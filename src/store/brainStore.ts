"use client";

import { create } from "zustand";
import type { BrainStructureId } from "@/types/brain";

export const internalBrainIds: readonly BrainStructureId[] = [
  "corpus-callosum",
  "thalamus",
  "hypothalamus",
  "ventricles",
];
export function isInternalBrainPart(id: BrainStructureId | null) {
  return id !== null && internalBrainIds.includes(id);
}

type BrainState = {
  selectedId: BrainStructureId | null;
  hoveredId: BrainStructureId | null;
  isolatedId: BrainStructureId | null;
  exploded: boolean;
  cutaway: boolean;
  resetVersion: number;
  focusVersion: number;
  select: (id: BrainStructureId | null) => void;
  hover: (id: BrainStructureId | null) => void;
  toggleIsolation: () => void;
  toggleExploded: () => void;
  toggleCutaway: () => void;
  focusSelection: () => void;
  reset: () => void;
};

export const useBrainStore = create<BrainState>((set) => ({
  selectedId: null,
  hoveredId: null,
  isolatedId: null,
  exploded: false,
  cutaway: false,
  resetVersion: 0,
  focusVersion: 0,
  select: (id) =>
    set((s) => {
      const cutaway = isInternalBrainPart(id)
        ? true
        : id === "left-hemisphere"
          ? false
          : s.cutaway;
      return {
        selectedId: id,
        hoveredId: null,
        cutaway,
        isolatedId: id === s.selectedId ? s.isolatedId : null,
        resetVersion:
          s.resetVersion +
          Number(
            cutaway !== s.cutaway ||
              Boolean(s.isolatedId && id !== s.selectedId),
          ),
      };
    }),
  hover: (id) =>
    set((s) => ({
      hoveredId:
        s.isolatedId &&
        id !== s.isolatedId &&
        !(s.isolatedId.endsWith("hemisphere") && id?.endsWith("lobe"))
          ? null
          : id,
    })),
  toggleIsolation: () =>
    set((s) =>
      s.selectedId
        ? {
            isolatedId: s.isolatedId ? null : s.selectedId,
            hoveredId: null,
            focusVersion: s.focusVersion + Number(!s.isolatedId),
            resetVersion: s.resetVersion + Number(Boolean(s.isolatedId)),
          }
        : {},
    ),
  toggleExploded: () =>
    set((s) => ({
      exploded: !s.exploded,
      isolatedId: null,
      hoveredId: null,
      resetVersion: s.resetVersion + 1,
    })),
  toggleCutaway: () =>
    set((s) => ({
      cutaway: !s.cutaway,
      exploded: false,
      isolatedId: null,
      selectedId:
        (s.cutaway && isInternalBrainPart(s.selectedId)) ||
        (!s.cutaway && s.selectedId === "left-hemisphere")
          ? null
          : s.selectedId,
      hoveredId: null,
      resetVersion: s.resetVersion + 1,
    })),
  focusSelection: () =>
    set((s) => (s.selectedId ? { focusVersion: s.focusVersion + 1 } : {})),
  reset: () =>
    set((s) => ({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      exploded: false,
      cutaway: false,
      resetVersion: s.resetVersion + 1,
    })),
}));

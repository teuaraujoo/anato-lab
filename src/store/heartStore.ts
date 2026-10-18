"use client";

import { create } from "zustand";
import type { HeartStructureId } from "@/types/heart";

export const internalHeartIds: readonly HeartStructureId[] = [
  "septum",
  "tricuspid-valve",
  "mitral-valve",
  "pulmonary-valve",
  "aortic-valve",
  "chordae-tendineae",
];
export const isInternalHeartPart = (id: HeartStructureId | null) =>
  id !== null && internalHeartIds.includes(id);

type HeartState = {
  selectedId: HeartStructureId | null;
  hoveredId: HeartStructureId | null;
  isolatedId: HeartStructureId | null;
  exploded: boolean;
  cutaway: boolean;
  resetVersion: number;
  focusVersion: number;
  select: (id: HeartStructureId | null) => void;
  hover: (id: HeartStructureId | null) => void;
  toggleIsolation: () => void;
  toggleExploded: () => void;
  toggleCutaway: () => void;
  focusSelection: () => void;
  reset: () => void;
};

export const useHeartStore = create<HeartState>((set) => ({
  selectedId: null,
  hoveredId: null,
  isolatedId: null,
  exploded: false,
  cutaway: false,
  resetVersion: 0,
  focusVersion: 0,
  select: (id) =>
    set((s) => {
      const cutaway = isInternalHeartPart(id) || s.cutaway;
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
      hoveredId: s.isolatedId && s.isolatedId !== id ? null : id,
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
        s.cutaway && isInternalHeartPart(s.selectedId) ? null : s.selectedId,
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

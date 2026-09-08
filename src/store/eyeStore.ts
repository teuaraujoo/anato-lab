"use client";

import { create } from "zustand";
import type { EyeStructureId } from "@/types/eye";

type EyeState = {
  selectedId: EyeStructureId | null;
  hoveredId: EyeStructureId | null;
  isolatedId: EyeStructureId | null;
  exploded: boolean;
  resetVersion: number;
  focusVersion: number;
  select: (id: EyeStructureId | null) => void;
  hover: (id: EyeStructureId | null) => void;
  toggleIsolation: () => void;
  toggleExploded: () => void;
  focusSelection: () => void;
  reset: () => void;
};

export const useEyeStore = create<EyeState>((set) => ({
  selectedId: null,
  hoveredId: null,
  isolatedId: null,
  exploded: false,
  resetVersion: 0,
  focusVersion: 0,
  select: (id) =>
    set((state) =>
      state.selectedId === id
        ? { hoveredId: null }
        : {
            selectedId: id,
            hoveredId: null,
            isolatedId: null,
            resetVersion: state.resetVersion + (state.isolatedId ? 1 : 0),
          },
    ),
  hover: (hoveredId) =>
    set((state) => ({
      hoveredId:
        state.isolatedId && hoveredId !== state.isolatedId ? null : hoveredId,
    })),
  toggleExploded: () =>
    set((state) => ({
      exploded: !state.exploded,
      isolatedId: null,
      hoveredId: null,
      resetVersion: state.resetVersion + 1,
    })),
  toggleIsolation: () =>
    set((state) =>
      state.selectedId
        ? {
            isolatedId: state.isolatedId ? null : state.selectedId,
            hoveredId: null,
            focusVersion: state.focusVersion + (state.isolatedId ? 0 : 1),
            resetVersion: state.resetVersion + (state.isolatedId ? 1 : 0),
          }
        : {},
    ),
  focusSelection: () =>
    set((state) =>
      state.selectedId ? { focusVersion: state.focusVersion + 1 } : {},
    ),
  reset: () =>
    set((state) => ({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      exploded: false,
      resetVersion: state.resetVersion + 1,
    })),
}));

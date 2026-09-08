"use client";

import { create } from "zustand";
import type { KidneyStructureId } from "@/types/kidney";

type KidneyState = {
  selectedId: KidneyStructureId | null;
  hoveredId: KidneyStructureId | null;
  isolatedId: KidneyStructureId | null;
  resetVersion: number;
  focusVersion: number;
  select: (id: KidneyStructureId | null) => void;
  hover: (id: KidneyStructureId | null) => void;
  toggleIsolation: () => void;
  focusSelection: () => void;
  reset: () => void;
};

export const useKidneyStore = create<KidneyState>((set) => ({
  selectedId: null,
  hoveredId: null,
  isolatedId: null,
  resetVersion: 0,
  focusVersion: 0,
  select: (selectedId) =>
    set((state) => ({
      selectedId,
      hoveredId: null,
      isolatedId: state.selectedId === selectedId ? state.isolatedId : null,
      resetVersion:
        state.resetVersion +
        (state.isolatedId && state.selectedId !== selectedId ? 1 : 0),
    })),
  hover: (hoveredId) =>
    set((state) => ({
      hoveredId:
        state.isolatedId && hoveredId !== state.isolatedId ? null : hoveredId,
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
      state.selectedId
        ? {
            focusVersion: state.focusVersion + 1,
          }
        : {},
    ),
  reset: () =>
    set((state) => ({
      selectedId: null,
      hoveredId: null,
      isolatedId: null,
      resetVersion: state.resetVersion + 1,
    })),
}));

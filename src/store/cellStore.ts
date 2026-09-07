"use client";

import { create } from "zustand";
import type { OrganelleId } from "@/types/cell";

type CellState = {
  selectedOrganelleId: OrganelleId | null;
  hoveredOrganelleId: OrganelleId | null;
  isolatedOrganelleId: OrganelleId | null;
  resetVersion: number;
  focusVersion: number;
  select: (id: OrganelleId | null) => void;
  hover: (id: OrganelleId | null) => void;
  toggleIsolation: () => void;
  focusSelection: () => void;
  reset: () => void;
};

export const useCellStore = create<CellState>((set) => ({
  selectedOrganelleId: null,
  hoveredOrganelleId: null,
  isolatedOrganelleId: null,
  resetVersion: 0,
  focusVersion: 0,
  // Selecionar outra estrutura encerra o isolamento e repõe a câmera.
  select: (id) =>
    set((state) =>
      state.selectedOrganelleId === id
        ? { hoveredOrganelleId: null }
        : {
            selectedOrganelleId: id,
            hoveredOrganelleId: null,
            isolatedOrganelleId: null,
            resetVersion:
              state.resetVersion + (state.isolatedOrganelleId ? 1 : 0),
          },
    ),
  hover: (hoveredOrganelleId) => set({ hoveredOrganelleId }),
  toggleIsolation: () =>
    set((state) =>
      state.selectedOrganelleId
        ? {
            isolatedOrganelleId: state.isolatedOrganelleId
              ? null
              : state.selectedOrganelleId,
            hoveredOrganelleId: null,
            focusVersion:
              state.focusVersion + (state.isolatedOrganelleId ? 0 : 1),
            resetVersion:
              state.resetVersion + (state.isolatedOrganelleId ? 1 : 0),
          }
        : {},
    ),
  focusSelection: () =>
    set((state) =>
      state.selectedOrganelleId ? { focusVersion: state.focusVersion + 1 } : {},
    ),
  reset: () =>
    set((state) => ({
      selectedOrganelleId: null,
      hoveredOrganelleId: null,
      isolatedOrganelleId: null,
      resetVersion: state.resetVersion + 1,
    })),
}));

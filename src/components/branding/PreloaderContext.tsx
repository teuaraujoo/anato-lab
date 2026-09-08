"use client";

import { createContext, useContext } from "react";

export const PreloaderReadyContext = createContext(true);

export function usePreloaderReady() {
  return useContext(PreloaderReadyContext);
}

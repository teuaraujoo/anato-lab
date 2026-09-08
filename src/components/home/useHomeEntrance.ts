"use client";

import { createScope, createTimeline, utils } from "animejs";
import { useLayoutEffect, useRef } from "react";
import { usePreloaderReady } from "@/components/branding/PreloaderContext";

/** Prepara a home sob a cortina e só inicia a sequência após sua remoção. */
export function useHomeEntrance() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ready = usePreloaderReady();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const scope = createScope({ root });
    let timeout: number | undefined;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      scope.revert();
      root.dataset.entrance = "complete";
    };

    scope.add(() => {
      const targets = root.querySelectorAll<HTMLElement>("[data-home-enter]");
      // Somente estilos aplicados via JS: sem JS a página continua visível.
      utils.set(targets, { opacity: 0 });
      root.dataset.entrance = ready ? "playing" : "waiting";
      const timeline = createTimeline({
        autoplay: false,
        defaults: { duration: 620, ease: "out(3)" },
        onComplete: finish,
      });

      targets.forEach((target, index) => {
        const header = target.dataset.homeEnter === "header";
        timeline.add(
          target,
          {
            opacity: [0, 1],
            y: [header ? -12 : 20, 0],
          },
          Math.min(index * 60, 420),
        );
      });

      if (ready) {
        timeline.play();
        // Libera os elementos mesmo se a execução da timeline for interrompida.
        timeout = window.setTimeout(finish, 3000);
      }
    });

    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    motion.addEventListener("change", onMotionChange);
    // Interagir tem prioridade sobre a apresentação, inclusive via teclado.
    root.addEventListener("focusin", finish);
    root.addEventListener("pointerdown", finish);

    return () => {
      finished = true;
      window.clearTimeout(timeout);
      motion.removeEventListener("change", onMotionChange);
      root.removeEventListener("focusin", finish);
      root.removeEventListener("pointerdown", finish);
      scope.revert();
      delete root.dataset.entrance;
    };
  }, [ready]);

  return rootRef;
}

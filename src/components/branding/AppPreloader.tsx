"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./AppPreloader.module.css";

type Phase = "loading" | "revealing" | "complete";
const MAX_WAIT_MS = 4000;
const REVEAL_MS = 850;

/** Abertura do documento; o layout preserva seu estado entre as rotas. */
export function AppPreloader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const blocked = phase !== "complete";

  const complete = useCallback(() => {
    const content = contentRef.current;
    if (content && overlayRef.current?.contains(document.activeElement)) {
      content.inert = false;
      content.focus({ preventScroll: true });
    }
    setPhase("complete");
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;

    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setPhase("revealing");
    };
    // Aguarda recursos reais da abertura, não simula porcentagens nem espera o 3D.
    const timeout = window.setTimeout(reveal, MAX_WAIT_MS);
    void Promise.allSettled([
      document.fonts.ready,
      logoRef.current?.decode(),
      // Conclui a entrada da marca antes de iniciar sua saída.
      ...(identityRef.current?.getAnimations() ?? []).map(
        (animation) => animation.finished,
      ),
    ]).then(reveal);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const overlay = overlayRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    const finish = () => {
      if (!cancelled) complete();
    };

    if (!overlay?.animate || reducedMotion.matches) {
      queueMicrotask(finish);
      return () => {
        cancelled = true;
      };
    }

    // O easing pertence à animação inteira, não a cada trecho do percurso.
    // Mantém a página imóvel e move apenas a camada de abertura.
    const curtain = overlay.animate(
      [0, 1 / 3, 2 / 3, 1].map((offset) => ({
        offset,
        transform: `translate3d(0, ${-100 * offset}%, 0)`,
      })),
      {
        duration: REVEAL_MS,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "forwards",
      },
    );
    void curtain.finished.then(finish, finish);
    const onMotionChange = () => {
      if (reducedMotion.matches) finish();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      reducedMotion.removeEventListener("change", onMotionChange);
      curtain.cancel();
    };
  }, [phase, complete]);

  useEffect(() => {
    if (!blocked) return;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (content) content.inert = true;

    return () => {
      if (content) content.inert = false;
      if (overlay?.contains(document.activeElement)) {
        content?.focus({ preventScroll: true });
      }
    };
  }, [blocked]);

  return (
    <>
      <noscript>
        <style>{"#anatolab-preloader { display: none !important; }"}</style>
      </noscript>
      <div ref={contentRef} className={styles.content} tabIndex={-1}>
        {children}
      </div>
      {blocked && (
        <div
          id="anatolab-preloader"
          ref={overlayRef}
          className={styles.overlay}
          data-phase={phase}
          aria-label="Abertura da Anatolab"
        >
          <div ref={identityRef} className={styles.identity}>
            <div className={styles.logo}>
              <Image
                ref={logoRef}
                className={styles.logoImage}
                src="/branding/anatolab-logo.png"
                alt="Anatolab"
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 85vw, 520px"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <p className={styles.tagline}>EXPLORAR PARA ENTENDER</p>
          </div>
          <div className={styles.feedback} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            <span>Preparando sua experiência</span>
          </div>
          <button className={styles.skip} type="button" onClick={complete}>
            Pular abertura <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </>
  );
}

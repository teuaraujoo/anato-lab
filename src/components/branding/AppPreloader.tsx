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
const REVEAL_MS = 600;

/** Abertura do documento; o layout preserva seu estado entre as rotas. */
export function AppPreloader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
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
    ]).then(reveal);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timeout = window.setTimeout(
      complete,
      reducedMotion.matches ? 0 : REVEAL_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [phase, complete]);

  useEffect(() => {
    if (!blocked) return;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (content) content.inert = false;
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
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
      <div
        ref={contentRef}
        className={styles.content}
        data-revealing={phase === "revealing" || undefined}
        tabIndex={-1}
      >
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
          <div className={styles.identity}>
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

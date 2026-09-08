"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { ArrowUpRight, Box, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { searchCatalog } from "@/content/catalog";
import styles from "./HomeCatalog.module.css";

function CardAction() {
  const { pending } = useLinkStatus();
  return (
    <span className={styles.cardAction} role="status">
      {pending ? "Abrindo…" : "Explorar"}
      <ArrowUpRight size={14} aria-hidden="true" />
    </span>
  );
}

export function HomeCatalog() {
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const entries = searchCatalog(query);
  const hasQuery = query.trim().length > 0;

  function clearSearch() {
    setQuery("");
    searchInput.current?.focus();
  }

  return (
    <div className={styles.home}>
      <a className="skip-link" href="#acervo">
        Ir para o acervo
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Anatolab — início">
          {/* Enquadra a arte original sem alterar o arquivo da logo. */}
          <Image
            className={styles.logoImage}
            src="/branding/anatolab-logo.png"
            alt="Logo Anatolab"
            width={1136}
            height={1024}
            sizes="300px"
            loading="eager"
          />
        </Link>
        <form
          className={styles.search}
          role="search"
          aria-label="Pesquisar no acervo"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="catalog-search" className={styles.searchLabel}>
            <Search size={18} aria-hidden="true" />
            <span className={styles.srOnly}>Buscar partes disponíveis</span>
          </label>
          <input
            ref={searchInput}
            id="catalog-search"
            type="search"
            placeholder="Buscar partes do corpo…"
            autoComplete="off"
            value={query}
            aria-controls="catalog-results"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") clearSearch();
            }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Limpar busca"
            >
              <X size={17} aria-hidden="true" />
            </button>
          )}
        </form>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-title">
          <p className={styles.eyebrow}>
            <span /> UM NOVO OLHAR PARA A ANATOMIA
          </p>
          <h1 id="home-title">
            O corpo humano,
            <br />
            <span>em outra dimensão.</span>
          </h1>
          <p className={styles.introduction}>
            Um espaço para descobrir, visualizar e entender a vida.{" "}
            <br className={styles.desktopBreak} />
            Explore estruturas em 3D, no seu ritmo e por todos os ângulos.
          </p>
        </section>

        <section
          id="acervo"
          className={styles.collection}
          aria-labelledby="collection-title"
          tabIndex={-1}
        >
          <div className={styles.collectionHeading}>
            <h2 id="collection-title">
              {hasQuery ? "Resultados da busca" : "Explore o acervo"}
            </h2>
            <p role="status" aria-live="polite" aria-atomic="true">
              {entries.length}{" "}
              {entries.length === 1
                ? "exploração disponível"
                : "explorações disponíveis"}
            </p>
          </div>

          <div id="catalog-results">
            {entries.length ? (
              <div className={styles.grid}>
                {entries.map((entry) => (
                  <article key={entry.id} className={styles.card}>
                    <Link
                      href={entry.href}
                      prefetch={false}
                      aria-label={`Explorar ${entry.title}`}
                      className={styles.cardLink}
                    >
                      <div className={styles.preview}>
                        <Image
                          src={entry.image}
                          alt={entry.imageAlt}
                          fill
                          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1000px) 50vw, 400px"
                          loading="eager"
                          className={styles.previewImage}
                        />
                        <span className={styles.previewBadge}>
                          <Box size={13} aria-hidden="true" /> INTERATIVO 3D
                        </span>
                        <span className={styles.openIcon}>
                          <ArrowUpRight size={21} aria-hidden="true" />
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <p className={styles.category}>{entry.category}</p>
                        <h3>{entry.title}</h3>
                        <p className={styles.description}>
                          {entry.description}
                        </p>
                        <div className={styles.cardFooter}>
                          <span>
                            {entry.structureCount} estruturas para descobrir
                          </span>
                          <CardAction />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <Search size={26} aria-hidden="true" />
                <h3>Nenhuma exploração encontrada</h3>
                <p>
                  O acervo está começando pela célula animal. Tente buscar por
                  “célula” ou “biologia”.
                </p>
                <button type="button" onClick={clearSearch}>
                  Ver todo o acervo{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className={styles.growing} aria-label="Sobre o acervo">
          <span className={styles.growingLine} />
          <p>
            <strong>A célula é só o começo.</strong> Um acervo em construção,
            com novos caminhos para explorar o corpo humano.
          </p>
        </aside>
      </main>

      <footer className={styles.footer}>
        <span>
          Anatolab <span className={styles.footerDot}>·</span> Explorar para
          entender.
        </span>
        <span>Uma experiência educacional em 3D.</span>
      </footer>
    </div>
  );
}

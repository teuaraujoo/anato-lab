"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Eye,
  Expand,
  Focus,
  Layers3,
  MousePointer2,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { eyeContent, eyeContentById, searchEyeStructures } from "@/content/eye";
import { useEyeStore } from "@/store/eyeStore";
import { usePageEntrance } from "@/components/motion/usePageEntrance";

const EyeScene = dynamic(() => import("./EyeScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-message" role="status">
      <span className="loading-orbit" />
      Preparando sua exploração…
    </div>
  ),
});
const compactQuery = "(max-width: 800px)";
function subscribeCompactLayout(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getCompactLayout = () => window.matchMedia(compactQuery).matches;
const getServerLayout = () => false;

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-message" role="status">
        <Eye size={36} />
        <p>Não foi possível iniciar o visualizador 3D.</p>
        <p>Você pode continuar pela lista de estruturas.</p>
        <button
          className="button button-secondary"
          onClick={() => this.setState({ failed: false })}
        >
          Tentar novamente
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}

function StructurePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const id = useEyeStore((state) => state.selectedId);
  const isolated = useEyeStore((state) => state.isolatedId);
  const select = useEyeStore((state) => state.select);
  const selected = id ? eyeContentById[id] : null;
  const matches = searchEyeStructures(query);
  return (
    <aside
      id="estruturas"
      className="study-panel"
      aria-label="Estruturas do olho"
      hidden={!isOpen}
    >
      <div className="panel-heading">
        <h2>Explore as estruturas</h2>
        <span className="panel-count">{eyeContent.length}</span>
        <button
          className="panel-close"
          aria-label="Recolher painel de estruturas"
          title="Recolher painel"
          onClick={onClose}
        >
          <PanelRightClose size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="panel-body">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar estrutura…"
            aria-label="Buscar estrutura"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="structure-list">
          {matches.length ? (
            matches.map((structure, index) => (
              <button
                key={structure.id}
                className="structure-option"
                aria-pressed={id === structure.id}
                onClick={() => select(structure.id)}
              >
                <span
                  className="structure-dot"
                  style={{ background: structure.color }}
                />
                <span className="structure-name">{structure.name}</span>
                {id === structure.id ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <span className="structure-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </button>
            ))
          ) : (
            <p className="empty-search" role="status">
              Nenhuma estrutura encontrada. Tente outro nome.
            </p>
          )}
        </div>
        <div className="structure-detail" aria-live="polite" aria-atomic="true">
          {selected ? (
            <>
              <div className="detail-kicker">
                <span style={{ background: selected.color }} />
                {isolated ? "ESTRUTURA ISOLADA" : "EM FOCO"}
                <button
                  aria-label="Limpar seleção"
                  title="Limpar seleção"
                  onClick={() => select(null)}
                >
                  <X size={16} />
                </button>
              </div>
              <h3>{selected.name}</h3>
              <p className="detail-summary">{selected.summary}</p>
              <dl>
                <dt>Como é formada</dt>
                <dd>{selected.structure}</dd>
                <dt>O que faz</dt>
                <dd>{selected.function}</dd>
              </dl>
              <h4>Conecte os conhecimentos</h4>
              <div className="related-list">
                {selected.related.map((related) => (
                  <button key={related} onClick={() => select(related)}>
                    {eyeContentById[related].name}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <a
                className="source-link"
                href={selected.source.url}
                target="_blank"
                rel="noreferrer"
              >
                {selected.source.title}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </>
          ) : (
            <div className="detail-intro">
              <span className="intro-icon">
                <MousePointer2 size={22} />
              </span>
              <h3>Como o olho transforma luz em visão?</h3>
              <p>
                Selecione uma estrutura no modelo ou na lista para entender como
                ela participa da visão.
              </p>
              <button className="text-button" onClick={() => select("cornea")}>
                Começar pela córnea{" "}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function ViewerToolbar() {
  const exploded = useEyeStore((state) => state.exploded);
  const toggleExploded = useEyeStore((state) => state.toggleExploded);
  const selected = useEyeStore((state) => state.selectedId);
  const isolated = useEyeStore((state) => state.isolatedId);
  const toggleIsolation = useEyeStore((state) => state.toggleIsolation);
  const focus = useEyeStore((state) => state.focusSelection);
  const reset = useEyeStore((state) => state.reset);
  return (
    <div
      className="viewer-toolbar"
      role="group"
      aria-label="Controles do modelo"
    >
      <button
        className="tool-button"
        onClick={reset}
        title="Restaurar câmera e mostrar o olho inteiro"
      >
        <RotateCcw size={17} aria-hidden="true" />
        <span>Restaurar</span>
      </button>
      <span className="toolbar-divider" />
      <button
        className="tool-button"
        onClick={toggleExploded}
        aria-pressed={exploded}
        title="Separação didática das estruturas; não representa suas posições anatômicas"
      >
        <Expand size={17} aria-hidden="true" />
        <span>{exploded ? "Reunir" : "Separar"}</span>
      </button>
      <button className="tool-button" onClick={focus} disabled={!selected}>
        <Focus size={17} aria-hidden="true" />
        <span>Aproximar</span>
      </button>
      <button
        className="tool-button"
        onClick={toggleIsolation}
        disabled={!selected}
        aria-pressed={Boolean(isolated)}
      >
        <Layers3 size={17} aria-hidden="true" />
        <span>{isolated ? "Mostrar todas" : "Isolar"}</span>
      </button>
    </div>
  );
}

export function EyeExperience() {
  const rootRef = usePageEntrance<HTMLElement>();
  const compact = useSyncExternalStore(
    subscribeCompactLayout,
    getCompactLayout,
    getServerLayout,
  );
  const [panelPreference, setPanelOpen] = useState<boolean | null>(null);
  const panelOpen = panelPreference ?? !compact;
  const panelTrigger = useRef<HTMLButtonElement>(null);
  const selectedId = useEyeStore((state) => state.selectedId);
  const exploded = useEyeStore((state) => state.exploded);
  const hoveredId = useEyeStore((state) => state.hoveredId);
  const isolated = useEyeStore((state) => state.isolatedId);
  const current = hoveredId ?? selectedId;
  const openPanel = () => {
    setPanelOpen(true);
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>(
          compact ? "#estruturas .panel-close" : "#estruturas input",
        )
        ?.focus({ preventScroll: true }),
    );
  };
  const closePanel = () => {
    setPanelOpen(false);
    panelTrigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") useEyeStore.getState().reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      useEyeStore.getState().reset();
    };
  }, []);
  return (
    <main ref={rootRef} className="atlas-page separated-explorer">
      <a
        className="skip-link"
        href="#estruturas"
        onClick={(event) => {
          event.preventDefault();
          openPanel();
        }}
      >
        Ir para a lista de estruturas
      </a>
      <nav
        className="explorer-navigation"
        aria-label="Navegação do explorador"
        data-page-enter="down"
      >
        <Link href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Voltar ao acervo
        </Link>
      </nav>
      <div className="page-intro" id="explorador">
        <div>
          <p className="eyebrow" data-page-enter="up">
            ANATOMIA HUMANA <span>/</span> 02
          </p>
          <h1 data-page-enter="up">
            Olho humano<span>.</span>
          </h1>
          <p data-page-enter="up">
            Gire, aproxime e descubra como a luz se transforma em visão.
          </p>
        </div>
        <button
          ref={panelTrigger}
          className="intro-link"
          data-page-enter="up"
          aria-controls="estruturas"
          aria-expanded={panelOpen}
          onClick={() => (panelOpen ? closePanel() : openPanel())}
        >
          <PanelRightOpen size={17} aria-hidden="true" />
          <span>Explorar estruturas</span>
          <span className="trigger-count">{eyeContent.length}</span>
        </button>
      </div>
      <div className="explorer-layout">
        <section
          className="viewer-column"
          aria-label="Exploração tridimensional"
        >
          <div
            className={`viewer-stage${panelOpen ? " panel-is-open" : ""}`}
            data-page-enter="fade"
            style={
              {
                "--structure-color": current
                  ? eyeContentById[current].color
                  : "#69dbd7",
              } as CSSProperties
            }
          >
            <div className="stage-header">
              <span className="specimen-label">SISTEMA VISUAL</span>
              <span className="stage-badge">
                <span />
                {isolated
                  ? "ESTRUTURA ISOLADA"
                  : exploded
                    ? "SEPARAÇÃO DIDÁTICA"
                    : "VISÃO EM CORTE"}
              </span>
            </div>
            <div
              className="scene-container"
              style={{ cursor: hoveredId ? "pointer" : "grab" }}
            >
              <SceneBoundary>
                <EyeScene />
              </SceneBoundary>
            </div>
            <div className="stage-caption">
              <span className="caption-dot" />
              {current
                ? eyeContentById[current].name
                : "A luz encontra um caminho."}
            </div>
            <ViewerToolbar />
            <StructurePanel isOpen={panelOpen} onClose={closePanel} />
          </div>
          <div className="viewer-footnote" data-page-enter="up">
            <span>
              <MousePointer2 size={14} aria-hidden="true" />
              Arraste para girar · use a roda ou dois dedos para zoom
            </span>
            <span>ESC para restaurar</span>
          </div>
          <p className="model-note" data-page-enter="up">
            Modelo didático em corte. Cores, proporções e camadas são
            ilustrativas.
          </p>
        </section>
      </div>
      <footer className="site-footer" data-page-enter="up">
        <span>EXPLORAR PARA ENTENDER</span>
        <span>Anatomia em outra dimensão.</span>
      </footer>
    </main>
  );
}

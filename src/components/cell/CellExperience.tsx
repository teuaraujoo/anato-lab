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
  Atom,
  Check,
  ChevronRight,
  Focus,
  Layers3,
  MousePointer2,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  animalCellContent,
  contentById,
  searchStructures,
} from "@/content/animalCell";
import { useCellStore } from "@/store/cellStore";
import { usePageEntrance } from "@/components/motion/usePageEntrance";

const CellScene = dynamic(() => import("./CellScene"), {
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
        <Atom size={36} />
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
  const id = useCellStore((s) => s.selectedOrganelleId);
  const isolated = useCellStore((s) => s.isolatedOrganelleId);
  const select = useCellStore((s) => s.select);
  const selected = id ? contentById[id] : null;
  const matches = searchStructures(query);
  return (
    <aside
      id="estruturas"
      className="study-panel"
      aria-label="Estruturas celulares"
      hidden={!isOpen}
    >
      <div className="panel-heading">
        <h2>Explore as estruturas</h2>
        <span className="panel-count">{animalCellContent.length}</span>
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
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="structure-list">
          {matches.length ? (
            matches.map((structure, index) => (
              <button
                key={structure.id}
                className="structure-option"
                aria-pressed={id === structure.id}
                data-organelle={structure.id}
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
                    {contentById[related].name}
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
              <h3>O que faz uma célula viver?</h3>
              <p>
                Cada estrutura tem uma função. Selecione uma parte do modelo ou
                um nome na lista para descobrir como elas trabalham juntas.
              </p>
              <button className="text-button" onClick={() => select("nucleus")}>
                Começar pelo núcleo{" "}
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
  const selected = useCellStore((s) => s.selectedOrganelleId);
  const isolated = useCellStore((s) => s.isolatedOrganelleId);
  const toggleIsolation = useCellStore((s) => s.toggleIsolation);
  const focus = useCellStore((s) => s.focusSelection);
  const reset = useCellStore((s) => s.reset);
  return (
    <div
      className="viewer-toolbar"
      role="group"
      aria-label="Controles do modelo"
    >
      <button
        className="tool-button"
        onClick={reset}
        title="Restaurar câmera e mostrar a célula inteira"
      >
        <RotateCcw size={17} aria-hidden="true" />
        <span>Restaurar</span>
      </button>
      <span className="toolbar-divider" />
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

export function CellExperience() {
  const rootRef = usePageEntrance<HTMLElement>();
  const compact = useSyncExternalStore(
    subscribeCompactLayout,
    getCompactLayout,
    getServerLayout,
  );
  const [panelPreference, setPanelOpen] = useState<boolean | null>(null);
  const panelOpen = panelPreference ?? !compact;
  const panelTrigger = useRef<HTMLButtonElement>(null);
  const selectedId = useCellStore((s) => s.selectedOrganelleId);
  const hoveredId = useCellStore((s) => s.hoveredOrganelleId);
  const isolated = useCellStore((s) => s.isolatedOrganelleId);
  const current = hoveredId ?? selectedId;

  const openPanel = () => {
    setPanelOpen(true);
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(
          compact ? "#estruturas .panel-close" : "#estruturas input",
        )
        ?.focus({ preventScroll: true });
    });
  };
  const closePanel = () => {
    setPanelOpen(false);
    panelTrigger.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useCellStore.getState().reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      useCellStore.getState().reset();
    };
  }, []);

  return (
    <main ref={rootRef} className="atlas-page">
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
            BIOLOGIA CELULAR <span>/</span> 01
          </p>
          <h1 data-page-enter="up">
            Célula animal<span>.</span>
          </h1>
          <p data-page-enter="up">
            Gire, aproxime e descubra as estruturas que tornam a vida possível.
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
          <span className="trigger-count">{animalCellContent.length}</span>
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
                  ? contentById[current].color
                  : "#69dbd7",
              } as CSSProperties
            }
          >
            <div className="stage-header">
              <span className="specimen-label">ANIMAL EUCARIÓTICA</span>
              <span className="stage-badge">
                <span />
                {isolated ? "ESTRUTURA ISOLADA" : "VISÃO EM CORTE"}
              </span>
            </div>
            <div
              className="scene-container"
              style={{ cursor: hoveredId ? "pointer" : "grab" }}
            >
              <SceneBoundary>
                <CellScene />
              </SceneBoundary>
            </div>
            <div className="stage-caption">
              <span className="caption-dot" />
              {current
                ? contentById[current].name
                : "Uma pequena unidade. Inúmeras conexões."}
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
            Modelo didático em corte. Cores, proporções e quantidades são
            ilustrativas.
          </p>
        </section>
      </div>
      <footer className="site-footer" data-page-enter="up">
        <span>EXPLORAR PARA ENTENDER</span>
        <span>Biologia em outra dimensão.</span>
      </footer>
    </main>
  );
}

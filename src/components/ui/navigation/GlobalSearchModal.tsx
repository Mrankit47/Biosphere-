"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "./NavigationContext";

interface SearchItem {
  path: string;
  name: string;
  category: string;
  icon: string;
  desc: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Core routes
  { path: "/", name: "Home Landing Page", category: "Core Module", icon: "🏠", desc: "Access all Biosphere virtual exhibits, simulations, and AI study resources." },
  { path: "/dashboard", name: "Biology Learning Dashboard", category: "Core Module", icon: "📊", desc: "View learning streaks, upcoming events, calendar milestones, and weak topics." },
  { path: "/learning-paths", name: "Learning Paths", category: "Core Module", icon: "🎓", desc: "Interactive guided curriculum for step-by-step biological mastery." },
  { path: "/tutor", name: "AI Biology Tutor", category: "Core Module", icon: "🤖", desc: "Chat with an intelligent bot specializing in cellular biology and medicine." },
  { path: "/gamification", name: "Profile Hub & Achievements", category: "Core Module", icon: "🏆", desc: "Check XP levels, earned badges, streaks, and lab certificates." },
  { path: "/quiz", name: "Quiz Board", category: "Core Module", icon: "📝", desc: "Quick-fire, fill-the-blanks, true/false, and label-the-cell challenges." },
  { path: "/dictionary", name: "Biology Dictionary", category: "Core Module", icon: "📖", desc: "Search over dozens of scientific terms with phonetics and notes." },
  { path: "/research-hub", name: "Research Hub", category: "Core Module", icon: "📚", desc: "Publish notes, bookmark publications, and track biology research." },

  // 3D Modules
  { path: "/cell-explorer", name: "3D Cell Structure Explorer", category: "3D Module", icon: "🔬", desc: "Zoom into eukaryotic structures and inspect cell compartments." },
  { path: "/human-body", name: "3D Human Anatomy Visualizer", category: "3D Module", icon: "🫀", desc: "Clinical engine with realistic, X-Ray, and Hologram rendering modes." },
  { path: "/tree-of-life", name: "Tree of Life (Carl Woese)", category: "3D Module", icon: "🌳", desc: "Trace evolutionary path lines and cells between Bacteria, Archaea, and Eukarya." },

  // Labs & Sims
  { path: "/virtual-lab", name: "Virtual Biology Lab", category: "Labs & Sims", icon: "🧪", desc: "Run simulated titration and chromatography chemistry labs." },
  { path: "/ecosystem-simulator", name: "Lotka-Volterra Ecosystem Sim", category: "Labs & Sims", icon: "🌐", desc: "Balance abiotic variables and study specimen populations." },
  { path: "/process-simulations", name: "Interactive Process Simulators", category: "Labs & Sims", icon: "🌀", desc: "Watch animations for transcription, translation, and mitosis." },

  // Cell structures
  { path: "/cell-explorer/membrane", name: "Plasma Membrane", category: "Cell Organelle", icon: "🛡️", desc: "Selective lipid bilayer barrier controlling cellular import/export." },
  { path: "/cell-explorer/nucleus", name: "Cell Nucleus", category: "Cell Organelle", icon: "📂", desc: "The genetic library storing DNA, chromatin, and the nucleolus." },
  { path: "/cell-explorer/mitochondria", name: "Mitochondria", category: "Cell Organelle", icon: "⚡", desc: "Double-membraned organelle synthesising ATP cellular energy." },
  { path: "/cell-explorer/ribosome", name: "Ribosome", category: "Cell Organelle", icon: "⚙️", desc: "Protein synthesis machinery parsing mRNA codon transcripts." },
  { path: "/cell-explorer/golgi", name: "Golgi Apparatus", category: "Cell Organelle", icon: "📦", desc: "Packages and routes proteins from the endoplasmic reticulum." },
  { path: "/cell-explorer/er", name: "Endoplasmic Reticulum", category: "Cell Organelle", icon: "🕸️", desc: "Rough ER hosting ribosomes and smooth ER synthesising lipids." },

  // Viruses
  { path: "/viruses", name: "Virus Taxonomy", category: "Exploration Gallery", icon: "☣️", desc: "Analyze pathogenic structural models and capsids." },
  { path: "/viruses/sars-cov-2", name: "SARS-CoV-2", category: "Pathogen: Virus", icon: "🧬", desc: "The coronavirus responsible for COVID-19 with spike proteins." },
  { path: "/viruses/hiv", name: "HIV Retrovirus", category: "Pathogen: Virus", icon: "🩸", desc: "Human Immunodeficiency Virus causing AIDS via helper T-cells." },
  { path: "/viruses/influenza", name: "Influenza Virus", category: "Pathogen: Virus", icon: "🤒", desc: "Orthomyxoviridae agent causing seasonal flu epidemics." },
  { path: "/viruses/ebola", name: "Ebola Filovirus", category: "Pathogen: Virus", icon: "💀", desc: "Causes severe hemorrhagic fever with high mortality rates." },
  { path: "/viruses/rabies", name: "Rabies Bullet Virus", category: "Pathogen: Virus", icon: "🐕", desc: "Neurotropic rhabdovirus infecting central nervous systems." },
  { path: "/viruses/bacteriophage", name: "T4 Bacteriophage", category: "Pathogen: Virus", icon: "👾", desc: "Infects bacterial cells via tail fiber syringe injections." },

  // Microorganisms
  { path: "/microorganisms", name: "Microorganisms (Micro Zoo)", category: "Exploration Gallery", icon: "🦠", desc: "Observe living amoebae, euglenas, and tardigrades." },
  { path: "/microorganisms/amoeba", name: "Amoeba Proteus", category: "Protozoa", icon: "💧", desc: "Unicellular protist capturing prey using pseudopodia." },
  { path: "/microorganisms/ecoli", name: "Escherichia coli (E. coli)", category: "Bacteria", icon: "🌭", desc: "Gram-negative intestinal bacterium used as genetics model." },
  { path: "/microorganisms/chlorella", name: "Chlorella", category: "Green Algae", icon: "🟢", desc: "Photosynthetic single-celled alga containing chlorophyll." },
  { path: "/microorganisms/tardigrade", name: "Tardigrade (Water Bear)", category: "Micro-animal", icon: "🐻", desc: "Indestructible micro-animal surviving space vacuums." },
  { path: "/microorganisms/volvox", name: "Volvox Colony", category: "Green Algae", icon: "⚽", desc: "Spherical multicellular algae colonies with flagella." },
  { path: "/microorganisms/paramecium", name: "Paramecium Caudatum", category: "Ciliate", icon: "👟", desc: "Slipper-shaped ciliate covered in thousands of swimming cilia." },

  // Rare Species
  { path: "/rare-species", name: "Rare Species Collection", category: "Exploration Gallery", icon: "🦁", desc: "Study endangered mammals, reptiles, and amphibians." },
  { path: "/rare-species/vaquita", name: "Vaquita Marina", category: "Rare Species", icon: "🐬", desc: "World's rarest marine mammal, native to the Gulf of California." },
  { path: "/rare-species/amur-leopard", name: "Amur Leopard", category: "Rare Species", icon: "🐆", desc: "Critically endangered big cat native to Russian forests." },
  { path: "/rare-species/sumatran-rhino", name: "Sumatran Rhinoceros", category: "Rare Species", icon: "🦏", desc: "Smallest and hairiest of all living rhino species." },
  { path: "/rare-species/saola", name: "Saola (Asian Unicorn)", category: "Rare Species", icon: "🐂", desc: "Rare forest-dwelling bovid found in Annamite Range." },
];

export const GlobalSearchModal: React.FC = () => {
  const router = useRouter();
  const { searchOpen, setSearchOpen, recentlyVisited, pinned, togglePin } = useNavigation();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Handle clicking outside modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [searchOpen, setSearchOpen]);

  // Filter items based on query
  const filteredResults = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Keyboard navigation inside search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchOpen) return;

      const itemsLength = query.trim() ? filteredResults.length : recentlyVisited.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, itemsLength));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + itemsLength) % Math.max(1, itemsLength));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedItem = query.trim()
          ? filteredResults[selectedIndex]
          : recentlyVisited[selectedIndex];
        if (selectedItem) {
          router.push(selectedItem.path);
          setSearchOpen(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, query, filteredResults, recentlyVisited, selectedIndex, router, setSearchOpen]);

  if (!searchOpen) return null;

  const resultsList = query.trim() ? filteredResults : recentlyVisited;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal-card glassmorphic" ref={modalRef}>
        {/* Search Input Bar */}
        <div className="search-modal-header">
          <span className="modal-search-icon">🔍</span>
          <input
            type="text"
            ref={inputRef}
            placeholder="Type to search biology topics, organs, pathogens..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="modal-search-input"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="modal-search-close-btn"
            aria-label="Close search modal"
          >
            ESC
          </button>
        </div>

        {/* Content Panel */}
        <div className="search-modal-body">
          {query.trim() ? (
            /* Results Panel */
            <div className="search-results-section">
              <span className="search-section-hdr">
                SEARCH RESULTS ({filteredResults.length})
              </span>
              <div className="search-results-list">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const isPinned = pinned.includes(item.path);
                    return (
                      <div
                        key={item.path}
                        className={`search-result-row-card ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div
                          className="search-card-main-trigger"
                          onClick={() => {
                            router.push(item.path);
                            setSearchOpen(false);
                          }}
                        >
                          <span className="search-card-icon">{item.icon}</span>
                          <div className="search-card-info">
                            <div className="search-card-name-row">
                              <span className="search-card-name">{item.name}</span>
                              <span className="search-card-category">{item.category}</span>
                            </div>
                            <p className="search-card-desc">{item.desc}</p>
                          </div>
                        </div>

                        {/* Toggle Pin button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(item.path);
                          }}
                          className={`search-card-pin-btn ${isPinned ? "is-pinned" : ""}`}
                          title={isPinned ? "Unpin topic" : "Pin topic to quick links"}
                        >
                          📌
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="search-empty-state">
                    <span className="empty-state-icon">🔬</span>
                    <p className="empty-state-lbl">No biological findings matched your query.</p>
                    <p className="empty-state-sub">Try searching "mitochondria", "virus", "vaquita", or "heart".</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Pinned & Recents Panel */
            <div className="search-recents-grid-layout">
              {/* Recently Visited */}
              <div className="recents-list-column">
                <span className="search-section-hdr">⏱️ RECENTLY VISITED</span>
                <div className="search-results-list">
                  {recentlyVisited.length > 0 ? (
                    recentlyVisited.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.path}
                          onClick={() => {
                            router.push(item.path);
                            setSearchOpen(false);
                          }}
                          className={`search-result-row-card ${isSelected ? "selected" : ""}`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <span className="search-card-icon">{item.icon}</span>
                          <div className="search-card-info">
                            <span className="search-card-name">{item.label}</span>
                            <span className="search-card-category-tiny">{item.path}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="sidebar-empty-text">No recently visited pages. Explore Biosphere to populate history.</p>
                  )}
                </div>
              </div>

              {/* Pinned Links */}
              <div className="pinned-list-column">
                <span className="search-section-hdr">📌 PINNED TOPICS</span>
                <div className="pinned-grid-flow">
                  {pinned.length > 0 ? (
                    SEARCH_ITEMS.filter((item) => pinned.includes(item.path)).map((item) => (
                      <div
                        key={item.path}
                        onClick={() => {
                          router.push(item.path);
                          setSearchOpen(false);
                        }}
                        className="pinned-topic-pill"
                      >
                        <span className="pinned-pill-icon">{item.icon}</span>
                        <span className="pinned-pill-name">{item.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(item.path);
                          }}
                          className="pinned-pill-unpin-btn"
                          title="Unpin"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="sidebar-empty-text">No pinned topics yet. Search and click the pin icon to bookmark topics for instant access.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styled Scoped CSS for Search Modal */}
      <style>{`
        .search-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 20px;
        }

        .search-modal-card {
          width: 100%;
          max-width: 680px;
          border-radius: 20px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), var(--ds-glow-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .search-modal-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--ds-glass-border);
          gap: 12px;
        }

        .modal-search-icon {
          font-size: 1.25rem;
          color: var(--ds-fg-subtle);
        }

        .modal-search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--ds-fg);
          font-size: 1rem;
          font-family: inherit;
        }

        .modal-search-input::placeholder {
          color: var(--ds-fg-subtle);
        }

        .modal-search-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 2px 8px;
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 750;
          cursor: pointer;
        }

        .modal-search-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        /* Search Body */
        .search-modal-body {
          padding: 20px;
          max-height: 480px;
          overflow-y: auto;
        }

        .search-section-hdr {
          display: block;
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }

        .search-results-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .search-result-row-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.01);
          box-sizing: border-box;
        }

        .search-result-row-card.selected {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: inset 0 0 8px rgba(57, 255, 20, 0.02);
        }

        .search-card-main-trigger {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        .search-card-icon {
          font-size: 1.35rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--ds-glass-border);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .search-card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .search-card-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-card-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ds-fg);
        }

        .search-card-category {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent-muted);
          background: var(--ds-accent-faint);
          border: 1px solid rgba(57, 255, 20, 0.15);
          padding: 1px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .search-card-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-card-category-tiny {
          font-size: 0.6rem;
          color: var(--ds-accent-muted);
          font-family: monospace;
        }

        /* Pin Toggle Button */
        .search-card-pin-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          opacity: 0.25;
          transition: opacity 0.2s, transform 0.2s;
          padding: 6px;
        }

        .search-result-row-card:hover .search-card-pin-btn,
        .search-card-pin-btn.is-pinned {
          opacity: 1;
        }

        .search-card-pin-btn:hover {
          transform: scale(1.2);
        }

        /* Recents and Pinned grid layout */
        .search-recents-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .pinned-grid-flow {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pinned-topic-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pinned-topic-pill:hover {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .pinned-pill-icon {
          font-size: 1rem;
        }

        .pinned-pill-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ds-fg-muted);
          flex: 1;
        }

        .pinned-pill-unpin-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 0.65rem;
          cursor: pointer;
          padding: 2px;
        }

        .pinned-pill-unpin-btn:hover {
          color: #ef4444;
        }

        /* Empty state */
        .search-empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-state-icon {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 12px;
          opacity: 0.3;
        }

        .empty-state-lbl {
          font-size: 0.85rem;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .empty-state-sub {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        @media (max-width: 600px) {
          .search-recents-grid-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

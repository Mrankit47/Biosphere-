"use client";

import React, { useState, useMemo, useCallback } from "react";
import { type Flashcard } from "@/data/learningEngine";
import { isFlashcardFavorite, toggleFlashcardFavorite } from "@/utils/progressEngine";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  title?: string;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  flashcards,
  title = "Flashcards",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [, forceUpdate] = useState(0);

  const deck = useMemo(() => {
    if (!shuffled) return [...flashcards];
    const arr = [...flashcards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [flashcards, shuffled]);

  const filteredDeck = useMemo(() => {
    if (!reviewMode) return deck;
    return deck.filter((c) => isFlashcardFavorite(c.id));
  }, [deck, reviewMode]);

  const card = filteredDeck[currentIndex] || null;
  const total = filteredDeck.length;

  const handleNext = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const handleToggleFavorite = useCallback(() => {
    if (!card) return;
    toggleFlashcardFavorite(card.id);
    forceUpdate((n) => n + 1);
  }, [card]);

  const handleShuffle = useCallback(() => {
    setShuffled((s) => !s);
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  if (flashcards.length === 0) return null;

  return (
    <div className="fc-viewer-root">
      <div className="fc-viewer-header">
        <h3 className="fc-viewer-title">🃏 {title}</h3>
        <div className="fc-controls">
          <button
            className={`fc-ctrl-btn ${shuffled ? "active" : ""}`}
            onClick={handleShuffle}
            title="Shuffle deck"
          >
            🔀
          </button>
          <button
            className={`fc-ctrl-btn ${reviewMode ? "active" : ""}`}
            onClick={() => { setReviewMode(!reviewMode); setCurrentIndex(0); setFlipped(false); }}
            title="Review favorites only"
          >
            ⭐ Review
          </button>
        </div>
      </div>

      {total === 0 ? (
        <p className="fc-empty">No favorite flashcards yet. Star some cards to review them!</p>
      ) : (
        <>
          <div
            className={`fc-card-container ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="fc-card-inner">
              <div className="fc-card-front">
                <span className="fc-card-category">{card?.category}</span>
                <p className="fc-card-text">{card?.front}</p>
                <span className="fc-card-hint">tap to reveal</span>
              </div>
              <div className="fc-card-back">
                <span className="fc-card-category">ANSWER</span>
                <p className="fc-card-text">{card?.back}</p>
              </div>
            </div>
          </div>

          <div className="fc-nav-row">
            <button className="fc-nav-btn" onClick={handlePrev} disabled={total <= 1}>
              ← Prev
            </button>

            <div className="fc-nav-center">
              <span className="fc-counter">{currentIndex + 1} / {total}</span>
              <button
                className={`fc-fav-btn ${card && isFlashcardFavorite(card.id) ? "favorited" : ""}`}
                onClick={handleToggleFavorite}
                title="Favorite"
              >
                {card && isFlashcardFavorite(card.id) ? "⭐" : "☆"}
              </button>
            </div>

            <button className="fc-nav-btn" onClick={handleNext} disabled={total <= 1}>
              Next →
            </button>
          </div>
        </>
      )}

      <style>{`
        .fc-viewer-root {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 20px;
          box-sizing: border-box;
        }
        .fc-viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .fc-viewer-title {
          font-size: 0.72rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
        }
        .fc-controls {
          display: flex;
          gap: 6px;
        }
        .fc-ctrl-btn {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .fc-ctrl-btn:hover, .fc-ctrl-btn.active {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }
        .fc-empty {
          font-size: 0.75rem;
          color: var(--ds-fg-subtle);
          text-align: center;
          padding: 20px;
        }

        .fc-card-container {
          perspective: 1000px;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .fc-card-inner {
          position: relative;
          width: 100%;
          min-height: 180px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .fc-card-container.flipped .fc-card-inner {
          transform: rotateY(180deg);
        }
        .fc-card-front, .fc-card-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 12px;
          box-sizing: border-box;
        }
        .fc-card-front {
          background: linear-gradient(135deg, rgba(57,255,20,0.03), rgba(57,255,20,0.01));
          border: 1px solid var(--ds-border-accent);
        }
        .fc-card-back {
          background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02));
          border: 1px solid rgba(99,102,241,0.3);
          transform: rotateY(180deg);
        }
        .fc-card-category {
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .fc-card-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.5;
        }
        .fc-card-hint {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          font-style: italic;
        }

        .fc-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fc-nav-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.72rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .fc-nav-btn:hover:not(:disabled) {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
        }
        .fc-nav-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .fc-nav-center {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fc-counter {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--ds-fg-muted);
        }
        .fc-fav-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
          padding: 0;
        }
        .fc-fav-btn:hover { transform: scale(1.2); }
        .fc-fav-btn.favorited { filter: drop-shadow(0 0 4px rgba(250,204,21,0.5)); }
      `}</style>
    </div>
  );
};

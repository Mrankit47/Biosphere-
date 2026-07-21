"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  grade: number;
  xp: number;
  badgeName: string;
  badgeIcon: string;
}

export default function CompletionDialog({
  isOpen,
  onClose,
  experimentName,
  grade,
  xp,
  badgeName,
  badgeIcon
}: CompletionDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-sm w-full bg-[#050A05] border border-[var(--ds-accent-muted)] rounded-2xl p-6 text-center shadow-[var(--ds-glow-intense)] z-10"
        >
          {/* Confetti-like elements */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[48px] animate-bounce">
            🎉
          </div>

          <div className="mt-4">
            <span className="text-[40px] block mb-2">{badgeIcon}</span>
            <span className="text-[9px] bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] px-2 py-0.5 rounded text-[var(--ds-accent)] font-bold tracking-wider uppercase">
              Lab Certified
            </span>
            
            <h3 className="text-base font-black text-white mt-3 uppercase tracking-wider">
              {experimentName}
            </h3>
            <p className="text-[10px] text-[var(--ds-fg-muted)] mt-1.5 px-2">
              Congratulations! You have completed all interactive procedures, passed the quizzes, and earned your laboratory credentials.
            </p>
          </div>

          {/* Badge Showcase card */}
          <div className="my-5 bg-white/2 border border-[var(--ds-border-muted)] rounded-xl p-3.5 flex flex-col items-center">
            <span className="text-[9px] text-[var(--ds-fg-subtle)] uppercase">Earned Honor Badge</span>
            <span className="text-xs font-black text-[var(--ds-accent)] mt-1">{badgeName}</span>
            <div className="flex gap-4 mt-3.5 border-t border-[var(--ds-border-muted)]/40 pt-2.5 w-full justify-around text-[10px]">
              <div>
                <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">Final Grade</span>
                <span className="font-bold text-white">{grade}%</span>
              </div>
              <div className="w-[1px] bg-[var(--ds-border-muted)]" />
              <div>
                <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">XP Gained</span>
                <span className="font-bold text-[#38bdf8]">+{xp} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[var(--ds-accent-faint)] hover:bg-[var(--ds-accent-subtle)] border border-[var(--ds-border-accent)] text-[var(--ds-accent)] font-bold text-xs py-2.5 rounded-lg transition-all"
          >
            Claim Rewards & Return
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

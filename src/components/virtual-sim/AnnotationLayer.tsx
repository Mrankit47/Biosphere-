"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Annotation {
  x: number; // percentage coordinate inside container
  y: number;
  text: string;
  range: [number, number];
}

interface AnnotationLayerProps {
  annotations: Annotation[];
  timeline: number;
}

export default function AnnotationLayer({
  annotations,
  timeline
}: AnnotationLayerProps) {
  // Filter annotations relevant to current timeline percentage
  const activeAnnotations = annotations.filter(
    (ann) => timeline >= ann.range[0] && timeline <= ann.range[1]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {activeAnnotations.map((ann, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${ann.x}%`,
              top: `${ann.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* Annotation callout bubble card */}
            <div className="bg-black/80 border border-[var(--ds-accent-muted)] rounded px-2.5 py-1 text-[9px] text-[var(--ds-accent)] font-bold shadow-[var(--ds-glow-sm)] whitespace-nowrap">
              {ann.text}
            </div>
            
            {/* Arrow pointer down */}
            <div className="w-1.5 h-1.5 bg-black border-r border-b border-[var(--ds-accent-muted)] rotate-45 -mt-1" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

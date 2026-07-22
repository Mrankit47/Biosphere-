"use client";

import React from "react";
import DNAForkVisual from "./DNAForkVisual";
import MitosisVisual from "./MitosisVisual";
import ProteinSynthesisVisual from "./ProteinSynthesisVisual";
import NeuronTransmissionVisual from "./NeuronTransmissionVisual";

interface SimulationCanvasProps {
  simulationId: string;
  timeline: number;
  controls: Record<string, any>;
}

export default function SimulationCanvas({
  simulationId,
  timeline,
  controls
}: SimulationCanvasProps) {
  switch (simulationId) {
    case "dna_replication":
      return <DNAForkVisual timeline={timeline} controls={controls} />;
    case "mitosis":
      return <MitosisVisual timeline={timeline} controls={controls} />;
    case "protein_synthesis":
      return <ProteinSynthesisVisual timeline={timeline} controls={controls} />;
    case "neuron_transmission":
      return <NeuronTransmissionVisual timeline={timeline} controls={controls} />;
    default:
      return (
        <div className="flex items-center justify-center w-full h-[220px] rounded-lg border border-[var(--ds-border-muted)] bg-black/40 text-[var(--ds-fg-subtle)] text-xs">
          No simulation visualizer loaded for ID: {simulationId}
        </div>
      );
  }
}

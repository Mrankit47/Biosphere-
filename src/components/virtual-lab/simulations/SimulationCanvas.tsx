"use client";

import React from "react";
import PhotosynthesisVisualizer from "./PhotosynthesisVisualizer";
import CatalaseVisualizer from "./CatalaseVisualizer";
import OsmosisVisualizer from "./OsmosisVisualizer";
import MicroscopeVisualizer from "./MicroscopeVisualizer";

interface SimulationCanvasProps {
  simulationType: "photosynthesis" | "catalase" | "osmosis" | "microscope";
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

export default function SimulationCanvas({
  simulationType,
  inputs,
  outputs
}: SimulationCanvasProps) {
  switch (simulationType) {
    case "photosynthesis":
      return <PhotosynthesisVisualizer inputs={inputs} outputs={outputs} />;
    case "catalase":
      return <CatalaseVisualizer inputs={inputs} outputs={outputs} />;
    case "osmosis":
      return <OsmosisVisualizer inputs={inputs} outputs={outputs} />;
    case "microscope":
      return <MicroscopeVisualizer inputs={inputs} outputs={outputs} />;
    default:
      return (
        <div className="flex items-center justify-center w-full h-[320px] rounded-lg border border-[var(--ds-glass-border)] bg-black/40 text-[var(--ds-fg-muted)]">
          No simulation visualizer loaded for type: {simulationType}
        </div>
      );
  }
}

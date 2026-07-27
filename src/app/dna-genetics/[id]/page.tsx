"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getMolecularObjectById, getAllMolecularObjects } from "@/molecular-engine/services/molecularResolver";
import { MolecularHeader } from "@/molecular-engine/components/MolecularHeader";
import { DNA3DViewer } from "@/molecular-engine/components/DNA3DViewer";
import { ChromosomeViewer } from "@/molecular-engine/components/ChromosomeViewer";
import { SequenceViewer } from "@/molecular-engine/components/SequenceViewer";
import { MutationPanel } from "@/molecular-engine/components/MutationPanel";
import { ProteinViewer } from "@/molecular-engine/components/ProteinViewer";
import { ExperimentWorkspace } from "@/molecular-engine/components/ExperimentWorkspace";
import { AssessmentPanel } from "@/molecular-engine/components/AssessmentPanel";
import { AIMolecularSidebar } from "@/molecular-engine/components/AIMolecularSidebar";

export default function MolecularObjectDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "dna";

  const molecularObject = getMolecularObjectById(id) || getAllMolecularObjects()[0];

  return (
    <main className="molecular-detail-page-root">
      <div className="molecular-page-inner">
        {/* Top Header */}
        <MolecularHeader molecularObject={molecularObject} />

        {/* Main 2-Column Layout */}
        <div className="molecular-main-grid">
          {/* Main Content Column */}
          <div className="molecular-content-col">
            {/* 1. Primary 3D / Sequence Visualizer based on object type */}
            {molecularObject.visualizationType === "3d-dna" && (
              <DNA3DViewer
                strandColor1={molecularObject.model3DConfig?.strandColor1}
                strandColor2={molecularObject.model3DConfig?.strandColor2}
              />
            )}

            {molecularObject.visualizationType === "chromosome" && (
              <ChromosomeViewer />
            )}

            {molecularObject.visualizationType === "sequence" && (
              <SequenceViewer initialDNA={molecularObject.sequenceExample} />
            )}

            {molecularObject.visualizationType === "mutation" && (
              <MutationPanel />
            )}

            {molecularObject.visualizationType === "protein" && (
              <ProteinViewer />
            )}

            {/* 2. Key Components Breakdown */}
            <div className="components-breakdown-card glassmorphic">
              <span className="card-eyebrow">STRUCTURAL ANATOMY</span>
              <h3 className="card-heading">Key Molecular Components</h3>
              <div className="components-grid">
                {molecularObject.keyComponents.map((comp, idx) => (
                  <div key={idx} className="comp-item-card">
                    <h4 className="comp-title">{comp.name}</h4>
                    <p className="comp-desc">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Interactive Sandbox Experiment */}
            <ExperimentWorkspace />

            {/* 4. Assessment Suite */}
            <AssessmentPanel molecularObject={molecularObject} />
          </div>

          {/* AI Mentor Sidebar Column */}
          <div className="molecular-sidebar-col">
            <div className="sticky-sidebar-wrap">
              <AIMolecularSidebar molecularObject={molecularObject} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .molecular-detail-page-root {
          min-height: 100vh;
          background: var(--ds-bg-primary, #060b10);
          color: var(--ds-fg, #f8fafc);
          padding: 80px 1.5rem 4rem 1.5rem;
        }

        .molecular-page-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        .molecular-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .molecular-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .sticky-sidebar-wrap {
          position: sticky;
          top: 90px;
        }

        .components-breakdown-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
        }

        .card-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .card-heading {
          margin: 2px 0 1rem 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .comp-item-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
        }

        .comp-title {
          margin: 0 0 6px 0;
          font-size: 0.92rem;
          font-weight: 800;
          color: #fff;
        }

        .comp-desc {
          margin: 0;
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.45;
        }
      `}</style>
    </main>
  );
}

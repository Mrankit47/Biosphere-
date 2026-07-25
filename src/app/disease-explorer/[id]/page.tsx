"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { getDiseaseById, getCaseStudiesByDiseaseId } from "@/clinical-engine/services/clinicalResolver";
import { DiseaseHeader } from "@/clinical-engine/components/DiseaseHeader";
import { ClinicalTimeline } from "@/clinical-engine/components/ClinicalTimeline";
import { SymptomsPanel } from "@/clinical-engine/components/SymptomsPanel";
import { DiagnosisPanel } from "@/clinical-engine/components/DiagnosisPanel";
import { TreatmentPanel } from "@/clinical-engine/components/TreatmentPanel";
import { OrganDamageVisualizer } from "@/clinical-engine/components/OrganDamageVisualizer";
import { CaseStudyViewer } from "@/clinical-engine/components/CaseStudyViewer";
import { AIClinicalSidebar } from "@/clinical-engine/components/AIClinicalSidebar";
import { ComparisonView } from "@/clinical-engine/components/ComparisonView";

export default function ClinicalDiseasePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const disease = getDiseaseById(id);

  if (!disease) {
    return (
      <div className="disease-not-found-container">
        <h2>Disease Object Not Found</h2>
        <p>The disease identifier "{id}" does not exist in the Biosphere Clinical Engine registry.</p>
      </div>
    );
  }

  const caseStudies = getCaseStudiesByDiseaseId(disease.id);

  return (
    <main className="clinical-disease-page-root">
      <div className="clinical-page-inner">
        {/* Top Header */}
        <DiseaseHeader disease={disease} />

        {/* Main 2-Column Clinical Layout */}
        <div className="clinical-main-grid">
          {/* Main Content Column */}
          <div className="clinical-content-col">
            {/* 1. Clinical 6-Stage Timeline */}
            <ClinicalTimeline
              timeline={disease.clinicalTimeline}
              accentColor={disease.accentColor}
            />

            {/* 2. Pathomorphology Organ Damage Visualizer */}
            <OrganDamageVisualizer
              highlights={disease.organDamageHighlights}
              affectedOrgans={disease.affectedOrgans}
            />

            {/* 3. Symptoms Spectrum Panel */}
            <SymptomsPanel symptoms={disease.symptoms} />

            {/* 4. Diagnostic Protocol Panel */}
            <DiagnosisPanel disease={disease} />

            {/* 5. Therapeutics & Management Panel */}
            <TreatmentPanel
              treatment={disease.treatment}
              complications={disease.complications}
              prevention={disease.prevention}
              prognosis={disease.prognosis}
            />

            {/* 6. Patient Case Studies */}
            {caseStudies.length > 0 && (
              <CaseStudyViewer cases={caseStudies} />
            )}

            {/* 7. Quick Comparison Section */}
            <ComparisonView initialDiseaseIds={[disease.id, "diabetes"]} />
          </div>

          {/* AI Clinical Sidebar Column */}
          <div className="clinical-sidebar-col">
            <div className="sticky-sidebar-wrap">
              <AIClinicalSidebar
                disease={disease}
                activeStageTitle={disease.clinicalTimeline[1]?.title || "Early Phase"}
                selectedOrgan={disease.affectedOrgans[0]}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .clinical-disease-page-root {
          min-height: 100vh;
          background: var(--ds-bg-primary, #060b10);
          color: var(--ds-fg, #f8fafc);
          padding: 80px 1.5rem 4rem 1.5rem;
        }

        .clinical-page-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        .clinical-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .clinical-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .sticky-sidebar-wrap {
          position: sticky;
          top: 90px;
        }

        .disease-not-found-container {
          padding: 120px 2rem;
          text-align: center;
          color: #fff;
        }
      `}</style>
    </main>
  );
}

"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Universal Knowledge Page Engine
//
// Dynamically renders complete 3D interactive exhibits, lessons,
// quizzes, flashcards, clinical notes, and graph networks for ANY
// topic ID in the Biosphere Knowledge Platform.
// ═══════════════════════════════════════════════════════════════

import React from "react";
import { useParams } from "next/navigation";
import { useKnowledgeObject } from "@/knowledge-hooks/useKnowledgeObject";
import { useKnowledgeGraph } from "@/knowledge-hooks/useKnowledgeGraph";
import { resolveObjects } from "@/knowledge-services/knowledgeService";
import {
  KnowledgeHeader,
  KnowledgeSidebar,
  KnowledgeTimeline,
  LearningObjectives,
  FlashcardStack,
  InteractiveQuiz,
  MisconceptionsCard,
  ReferencesCard,
  RealWorldCard,
  RelationshipGraph,
  RelatedTopicCards,
  KnowledgeBreadcrumb,
  KnowledgeFooter,
} from "@/components/knowledge";
import { LoadingSpinner, ErrorState } from "@/components/ds";

export default function UniversalKnowledgePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const { object, loading, error } = useKnowledgeObject(id);
  const { neighbors } = useKnowledgeGraph(id);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-[var(--ds-fg-muted)] animate-pulse">
          Loading Knowledge Engine...
        </p>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <ErrorState
          title="Concept Not Found"
          description={error ?? "The requested biology topic could not be resolved."}
          actionLabel="Return to Dashboard"
          onAction={() => window.location.href = "/dashboard"}
        />
      </div>
    );
  }

  // Resolve related object instances for cards
  const parentObject = object.parentTopicId ? resolveObjects([object.parentTopicId])[0] : undefined;
  const childObjects = resolveObjects(object.childTopicIds);
  const relatedObjects = resolveObjects(object.relatedTopicIds);
  const prereqObjects = resolveObjects(object.prerequisiteIds);
  const nextObjects = resolveObjects(object.nextTopicIds);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6 text-white font-sans">
      {/* Breadcrumb */}
      <KnowledgeBreadcrumb object={object} />

      {/* Hero Header */}
      <KnowledgeHeader object={object} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (2 cols on desktop) */}
        <main className="lg:col-span-2 space-y-6">
          {/* Summary / Overview */}
          <section className="rounded-2xl p-5 border border-white/8 bg-white/3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-2">
              Overview
            </h2>
            <p className="text-sm text-white/90 leading-relaxed font-normal">
              {object.description}
            </p>
          </section>

          {/* Learning Objectives */}
          <LearningObjectives
            objectives={object.learningObjectives}
            accentColor={object.accentColor}
          />

          {/* Core Concept Summary */}
          <section className="rounded-2xl p-5 border border-white/8 bg-white/3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-2">
              Concept Deep-Dive
            </h2>
            <p className="text-sm text-[var(--ds-fg-muted)] leading-relaxed">
              {object.summary}
            </p>
          </section>

          {/* Real-World Applications */}
          <RealWorldCard
            applications={object.realWorldApplications}
            accentColor={object.accentColor}
          />

          {/* Common Misconceptions */}
          <MisconceptionsCard
            misconceptions={object.commonMisconceptions}
            accentColor={object.accentColor}
          />

          {/* Timeline & History */}
          <KnowledgeTimeline
            events={object.timeline}
            scientists={object.scientists}
            accentColor={object.accentColor}
          />

          {/* Flashcards */}
          <FlashcardStack
            flashcards={object.flashcards}
            accentColor={object.accentColor}
          />

          {/* Interactive Quiz */}
          {object.quiz && (
            <InteractiveQuiz
              quiz={object.quiz}
              accentColor={object.accentColor}
            />
          )}

          {/* Graph Network Node Map */}
          <RelationshipGraph
            neighbors={neighbors}
            accentColor={object.accentColor}
          />

          {/* References & Academic Attribution */}
          <ReferencesCard
            references={object.references}
            furtherReading={object.furtherReading}
            accentColor={object.accentColor}
          />
        </main>

        {/* Sidebar Column (1 col on desktop) */}
        <div className="space-y-6">
          {/* Right Sidebar Widget */}
          <KnowledgeSidebar object={object} />

          {/* Relationship Connections Cards */}
          <div className="rounded-2xl p-4 border border-white/8 bg-white/3 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/8 pb-2">
              Graph Connections
            </h2>

            {parentObject && (
              <RelatedTopicCards
                title="Parent Concept"
                icon="git-fork"
                objects={[parentObject]}
                accentColor={object.accentColor}
              />
            )}

            <RelatedTopicCards
              title="Sub-Topics"
              icon="cell-explorer"
              objects={childObjects}
              accentColor={object.accentColor}
            />

            <RelatedTopicCards
              title="Prerequisites"
              icon="learning-paths"
              objects={prereqObjects}
              accentColor={object.accentColor}
            />

            <RelatedTopicCards
              title="Recommended Next"
              icon="chevron-right"
              objects={nextObjects}
              accentColor={object.accentColor}
            />

            <RelatedTopicCards
              title="Related Concepts"
              icon="sparkles"
              objects={relatedObjects}
              accentColor={object.accentColor}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <KnowledgeFooter object={object} />
    </div>
  );
}

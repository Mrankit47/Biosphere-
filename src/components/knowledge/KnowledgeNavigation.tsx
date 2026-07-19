"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Navigation & Breadcrumb Components
// ═══════════════════════════════════════════════════════════════

import React from "react";
import Link from "next/link";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface KnowledgeBreadcrumbProps {
  object: KnowledgeObject;
}

export const KnowledgeBreadcrumb: React.FC<KnowledgeBreadcrumbProps> = ({ object }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--ds-fg-muted)] mb-4 flex-wrap">
      <Link href="/dashboard" className="hover:text-white transition-colors">
        Dashboard
      </Link>
      <BioIcon name="chevron-right" size={10} />
      <Link
        href={`/knowledge?category=${object.category}`}
        className="hover:text-white transition-colors capitalize"
      >
        {object.category.replace("-", " ")}
      </Link>
      <BioIcon name="chevron-right" size={10} />
      <span className="text-white font-medium truncate max-w-[200px]">
        {object.name}
      </span>
    </nav>
  );
};

interface KnowledgeFooterProps {
  object: KnowledgeObject;
}

export const KnowledgeFooter: React.FC<KnowledgeFooterProps> = ({ object }) => {
  return (
    <footer className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ds-fg-muted)]">
      <div className="flex items-center gap-2">
        <BioIcon name="shield" size={14} className="text-[#2ECC71]" />
        <span>Verified Content v{object.verification.version}</span>
      </div>
      <div>
        Biosphere Universal Biology Knowledge Platform
      </div>
    </footer>
  );
};

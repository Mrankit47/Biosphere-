"use client";

import React, { useState } from "react";
import { Species, Biome } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

interface SpeciesLibraryProps {
  onInjectSpecies: (speciesId: string) => void;
  onSelectBiome: (biomeId: string) => void;
  activeBiomeId: string;
}

export const SpeciesLibrary: React.FC<SpeciesLibraryProps> = ({
  onInjectSpecies,
  onSelectBiome,
  activeBiomeId,
}) => {
  const [activeTab, setActiveTab] = useState<"species" | "biomes">("species");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const registry = EcologyRegistry.getInstance();
  const allSpecies = registry.getAllSpecies();
  const allBiomes = registry.getAllBiomes();

  const filteredSpecies = allSpecies.filter((spec) => {
    const matchesSearch =
      spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || spec.trophicRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="species-library-panel flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
          Ecology Catalog & Biomes
        </h3>

        <div className="flex gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab("species")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "species"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Species ({allSpecies.length})
          </button>
          <button
            onClick={() => setActiveTab("biomes")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "biomes"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Biomes ({allBiomes.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Species Library */}
      {activeTab === "species" && (
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search species or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="producer">Producer</option>
              <option value="primary_consumer">Herbivore</option>
              <option value="secondary_consumer">Carnivore</option>
              <option value="tertiary_consumer">Apex Predator</option>
              <option value="decomposer">Decomposer</option>
            </select>
          </div>

          {/* Species Cards Grid */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {filteredSpecies.map((spec) => (
              <div
                key={spec.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{spec.spriteEmoji}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                      {spec.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 italic truncate">{spec.scientificName}</p>
                    <div className="flex gap-1.5 mt-1">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 capitalize">
                        {spec.trophicRole.replace("_", " ")}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                        {spec.idealTemperature}°C Opt.
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onInjectSpecies(spec.id)}
                  className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all flex-shrink-0"
                >
                  + Inject
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Biome Switcher */}
      {activeTab === "biomes" && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {allBiomes.map((biome) => {
            const isActive = biome.id === activeBiomeId;
            return (
              <div
                key={biome.id}
                onClick={() => onSelectBiome(biome.id)}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  isActive
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{biome.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400">{biome.name}</h4>
                      {isActive && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-slate-950">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{biome.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">📍 {biome.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

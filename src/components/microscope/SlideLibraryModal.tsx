'use client';

import React, { useState } from 'react';
import { MicroscopeSlide, SlideCategory } from '@/microscope-engine/types';
import { SLIDE_LIBRARY } from '@/microscope-engine/slideRegistry';
import { Search, Filter, X, Sparkles, AlertCircle, BookOpen, Layers } from 'lucide-react';

interface SlideLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (slide: MicroscopeSlide) => void;
  activeSlideId: string;
}

export const SlideLibraryModal: React.FC<SlideLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectSlide,
  activeSlideId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecimenType, setSelectedSpecimenType] = useState<string>('all');

  if (!isOpen) return null;

  const categories: Array<{ id: string; label: string; icon: string }> = [
    { id: 'all', label: 'All Slides', icon: '🔬' },
    { id: 'plant_tissue', label: 'Plant Tissues', icon: '🌱' },
    { id: 'animal_tissue', label: 'Animal Tissues', icon: '🥩' },
    { id: 'blood_smear', label: 'Blood Smears', icon: '🩸' },
    { id: 'histology_organs', label: 'Organ Histology', icon: '🫀' },
    { id: 'bacteria', label: 'Bacteria & Microbes', icon: '🧫' },
    { id: 'protozoa', label: 'Protozoa & Algae', icon: '🦠' },
    { id: 'pathology_comparison', label: 'Pathology & Disease', icon: '⚠️' }
  ];

  const filteredSlides = SLIDE_LIBRARY.filter((slide) => {
    const matchesSearch =
      slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || slide.category === selectedCategory;
    const matchesSpecimen = selectedSpecimenType === 'all' || slide.specimenType === selectedSpecimenType;

    return matchesSearch && matchesCategory && matchesSpecimen;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Digital Slide Vault
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              Virtual Microscope Slide Library
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters Controls */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search slides by title, species, organelle, or disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Specimen Type Filter */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['all', 'healthy', 'diseased'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedSpecimenType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedSpecimenType === type
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slide Library Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredSlides.length > 0 ? (
            filteredSlides.map((slide) => {
              const isActive = slide.id === activeSlideId;

              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    onSelectSlide(slide);
                    onClose();
                  }}
                  className={`group relative bg-slate-950 border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    {/* Header Specimen Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {slide.subcategory}
                      </span>

                      {slide.specimenType === 'diseased' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Diseased
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          Healthy
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors mb-1">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic mb-3">{slide.scientificName}</p>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {slide.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {slide.cellularStructures.length} Structures
                    </span>
                    <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                      {isActive ? 'Active Slide ✓' : 'Load Slide →'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <BookOpen className="w-10 h-10 stroke-1 text-slate-600" />
              <p className="text-sm">No digital slides match your search filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

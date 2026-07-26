'use client';

import React, { useState } from 'react';
import { AssessmentTask } from '@/microscope-engine/types';
import { ASSESSMENT_TASKS } from '@/microscope-engine/slideRegistry';
import { Award, CheckCircle2, XCircle, HelpCircle, Trophy, Sparkles, X, ChevronRight } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTaskSlide: (slideId: string) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSelectTaskSlide
}) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, boolean>>({});
  const [totalXP, setTotalXP] = useState(0);

  if (!isOpen) return null;

  const currentTask = ASSESSMENT_TASKS[activeTaskIndex];
  const isSubmitted = submittedTasks[currentTask.id];
  const selectedOption = selectedAnswers[currentTask.id];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentTask.id]: index }));
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === undefined || isSubmitted) return;

    setSubmittedTasks((prev) => ({ ...prev, [currentTask.id]: true }));
    if (selectedOption === currentTask.correctOptionIndex) {
      setTotalXP((prev) => prev + currentTask.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Practical Microscopy Quiz
              </span>
              <h2 className="text-lg font-extrabold text-slate-100">Lab Assessment Suite</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              {totalXP} XP Earned
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Selector Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
          {ASSESSMENT_TASKS.map((task, index) => {
            const isDone = submittedTasks[task.id];

            return (
              <button
                key={task.id}
                onClick={() => setActiveTaskIndex(index)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-2 transition-all ${
                  activeTaskIndex === index
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Task #{index + 1}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Active Task Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-base font-extrabold text-slate-100">{currentTask.title}</h3>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                +{currentTask.xpReward} XP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{currentTask.instruction}</p>

            <button
              onClick={() => {
                onSelectTaskSlide(currentTask.targetSlideId);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Load Required Slide into Microscope</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Question Box */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              {currentTask.question}
            </h4>

            {/* Options */}
            <div className="space-y-2">
              {currentTask.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = currentTask.correctOptionIndex === optIdx;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (isSelected) btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-300';
                if (isSubmitted) {
                  if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === undefined}
                className="mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in">
                <span className="font-bold text-emerald-400 block mb-1">Explanation:</span>
                {currentTask.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Climate, WeatherType, DisturbanceType } from "../types";

interface ClimateControlsProps {
  climate: Climate;
  isPlaying: boolean;
  timeSpeed: number;
  onTogglePlay: () => void;
  onChangeSpeed: (speed: number) => void;
  onReset: () => void;
  onChangeTemperature: (temp: number) => void;
  onChangeRainfall: (rain: number) => void;
  onChangeWeather: (weather: WeatherType) => void;
  onTriggerDisturbance: (type: DisturbanceType) => void;
}

export const ClimateControls: React.FC<ClimateControlsProps> = ({
  climate,
  isPlaying,
  timeSpeed,
  onTogglePlay,
  onChangeSpeed,
  onReset,
  onChangeTemperature,
  onChangeRainfall,
  onChangeWeather,
  onTriggerDisturbance,
}) => {
  return (
    <div className="climate-controls-panel flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Simulation Playback Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            }`}
          >
            <span>{isPlaying ? "⏸ Pause" : "▶ Play"}</span>
          </button>

          <button
            onClick={onReset}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            🔄 Reset
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
          {[1, 5, 20].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                timeSpeed === s
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Climate Sliders (Temperature & Rainfall) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Temperature Control */}
        <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">🌡️ Temperature</span>
            <span className="text-emerald-400 font-mono">{climate.temperature}°C</span>
          </div>
          <input
            type="range"
            min={-10}
            max={50}
            value={climate.temperature}
            onChange={(e) => onChangeTemperature(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-10°C (Frigid)</span>
            <span>+50°C (Extreme)</span>
          </div>
        </div>

        {/* Rainfall Control */}
        <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">🌧️ Annual Rainfall</span>
            <span className="text-sky-400 font-mono">{climate.rainfall} mm</span>
          </div>
          <input
            type="range"
            min={0}
            max={250}
            value={climate.rainfall}
            onChange={(e) => onChangeRainfall(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 mm (Arid)</span>
            <span>250 mm (Monsoon)</span>
          </div>
        </div>
      </div>

      {/* Weather Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Weather State
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {(["sunny", "rainy", "stormy", "drought", "heatwave"] as WeatherType[]).map((w) => (
            <button
              key={w}
              onClick={() => onChangeWeather(w)}
              className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                climate.weather === w
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Disaster & Human Impact Triggers */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡ Trigger Environmental Event</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onTriggerDisturbance("wildfire")}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-slate-950 transition-all"
          >
            🔥 Wildfire
          </button>
          <button
            onClick={() => onTriggerDisturbance("flood")}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-500 hover:text-slate-950 transition-all"
          >
            🌊 Torrent Flood
          </button>
          <button
            onClick={() => onTriggerDisturbance("disease_outbreak")}
            className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500 hover:text-slate-950 transition-all"
          >
            ☣️ Epidemic
          </button>
          <button
            onClick={() => onTriggerDisturbance("invasive_species")}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all"
          >
            🐸 Invasive Incursion
          </button>
        </div>
      </div>
    </div>
  );
};

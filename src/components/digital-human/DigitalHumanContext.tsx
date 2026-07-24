'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type {
  BodySystemId,
  ExplorationLayer,
  PhysiologyOverlay,
  MeasurementPoint,
  BookmarkEntry,
  OrganComparisonData,
  DigitalHumanState,
  BodySystemMeta,
} from "./types";
import { HUMAN_ANATOMY_OBJECTS } from "@/knowledge/objects/humanAnatomy";
import type { KnowledgeObject } from "@/knowledge-types/object";

export const BODY_SYSTEMS_META: BodySystemMeta[] = [
  {
    id: "skeletal",
    name: "Skeletal System",
    latinName: "Systema Sceletale",
    icon: "🦴",
    color: "#E2E8F0",
    description: "206 bones providing structural framework, lever support, and mineral storage.",
    organs: ["skeleton"],
  },
  {
    id: "muscular",
    name: "Muscular System",
    latinName: "Systema Musculare",
    icon: "💪",
    color: "#EF4444",
    description: "600+ muscles enabling voluntary motion, posture, and body heat generation.",
    organs: ["muscles"],
  },
  {
    id: "nervous",
    name: "Nervous System",
    latinName: "Systema Nervosum",
    icon: "🧠",
    color: "#E879F9",
    description: "Central and peripheral neural pathways regulating thought, sensation, and autonomic control.",
    organs: ["brain", "eyes", "ears"],
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular System",
    latinName: "Systema Cardiovasculare",
    icon: "❤️",
    color: "#FF4757",
    description: "Muscular heart and vascular network pumping oxygenated blood and nutrient delivery.",
    organs: ["heart"],
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    latinName: "Systema Respiratorium",
    icon: "🫁",
    color: "#F472B6",
    description: "Trachea, bronchi, and lungs exchanging O2 into blood and removing CO2 waste.",
    organs: ["lungs"],
  },
  {
    id: "digestive",
    name: "Digestive System",
    latinName: "Systema Digestorium",
    icon: "🍏",
    color: "#10B981",
    description: "Gastrointestinal tract breaking down nutrients, absorbing water, and removing waste.",
    organs: ["stomach", "liver", "intestines"],
  },
  {
    id: "endocrine",
    name: "Endocrine System",
    latinName: "Systema Endocrinum",
    icon: "🦋",
    color: "#A855F7",
    description: "Glands secreting systemic hormones to regulate metabolism, growth, and mood.",
    organs: ["thyroid", "adrenal", "pituitary"],
  },
  {
    id: "urinary",
    name: "Urinary System",
    latinName: "Systema Urinarium",
    icon: "💧",
    color: "#8B5CF6",
    description: "Kidneys and bladder filtering metabolic fluid waste and regulating blood pressure.",
    organs: ["kidneys", "bladder"],
  },
  {
    id: "immune",
    name: "Immune System",
    latinName: "Systema Immunologicum",
    icon: "🛡️",
    color: "#3B82F6",
    description: "Leukocytes, lymphatic nodes, and spleen defending body against pathogenic attack.",
    organs: ["spleen"],
  },
  {
    id: "reproductive",
    name: "Reproductive System",
    latinName: "Systema Genitale",
    icon: "🧬",
    color: "#EC4899",
    description: "Male and female gonadal organs producing gametes and sex steroid hormones.",
    organs: ["reproductive"],
  },
  {
    id: "lymphatic",
    name: "Lymphatic System",
    latinName: "Systema Lymphaticum",
    icon: "🔮",
    color: "#8B5CF6",
    description: "Lymphatic vessels and nodes returning interstitial fluid and circulating lymphocytes.",
    organs: ["spleen"],
  },
  {
    id: "integumentary",
    name: "Integumentary System",
    latinName: "Integumentum Commune",
    icon: "👤",
    color: "#F5C2A2",
    description: "Skin, hair, nails, and cutaneous glands forming external protective barrier.",
    organs: ["skin"],
  },
];

interface DigitalHumanContextType {
  state: DigitalHumanState;
  activeOrganObject: KnowledgeObject | null;
  setGender: (g: "male" | "female") => void;
  setRenderMode: (m: "realistic" | "xray" | "hologram") => void;
  setActiveSystem: (s: BodySystemId | null) => void;
  toggleSystemVisibility: (s: BodySystemId) => void;
  setSystemOpacityValue: (s: BodySystemId, val: number) => void;
  setSelectedOrganId: (id: string | null) => void;
  setHoveredOrganId: (id: string | null) => void;
  setIsolatedOrganId: (id: string | null) => void;
  setActiveLayer: (layer: ExplorationLayer) => void;
  setExplodeLevel: (lvl: number) => void;
  setClippingAxis: (axis: "x" | "y" | "z") => void;
  setClippingPosition: (pos: number) => void;
  togglePhysiologyOverlay: (ov: PhysiologyOverlay) => void;
  setIsMeasuring: (val: boolean) => void;
  addMeasurementPoint: (pt: [number, number, number]) => void;
  clearMeasurements: () => void;
  openComparison: (organAId?: string, organBId?: string) => void;
  closeComparison: () => void;
  addBookmark: (title: string, notes?: string) => void;
  removeBookmark: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setIsAiSidebarOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsTissueCellModalOpen: (open: boolean) => void;
  resetAllViews: () => void;
}

const DigitalHumanContext = createContext<DigitalHumanContextType | undefined>(undefined);

const initialSystemsVisibility: Record<BodySystemId, boolean> = {
  skeletal: true,
  muscular: true,
  nervous: true,
  cardiovascular: true,
  respiratory: true,
  digestive: true,
  endocrine: true,
  urinary: true,
  immune: true,
  reproductive: true,
  lymphatic: true,
  integumentary: true,
};

const initialSystemsOpacity: Record<BodySystemId, number> = {
  skeletal: 1.0,
  muscular: 0.85,
  nervous: 1.0,
  cardiovascular: 1.0,
  respiratory: 1.0,
  digestive: 1.0,
  endocrine: 1.0,
  urinary: 1.0,
  immune: 1.0,
  reproductive: 1.0,
  lymphatic: 1.0,
  integumentary: 0.15,
};

const initialOverlays: Record<PhysiologyOverlay, boolean> = {
  "blood-flow": false,
  "neural-signals": false,
  "lymph-flow": false,
  "hormone-flow": false,
  respiration: false,
  digestion: false,
  "temperature-reg": false,
};

export const DigitalHumanEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [renderMode, setRenderMode] = useState<"realistic" | "xray" | "hologram">("realistic");
  const [activeSystem, setActiveSystemState] = useState<BodySystemId | null>(null);
  const [visibleSystems, setVisibleSystems] = useState<Record<BodySystemId, boolean>>(initialSystemsVisibility);
  const [systemOpacity, setSystemOpacity] = useState<Record<BodySystemId, number>>(initialSystemsOpacity);
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
  const [hoveredOrganId, setHoveredOrganId] = useState<string | null>(null);
  const [isolatedOrganId, setIsolatedOrganId] = useState<string | null>(null);
  const [activeLayer, setActiveLayerState] = useState<ExplorationLayer>("whole-body");
  const [explodeLevel, setExplodeLevel] = useState<number>(0);
  const [clippingAxis, setClippingAxis] = useState<"x" | "y" | "z">("y");
  const [clippingPosition, setClippingPosition] = useState<number>(10);
  const [activeOverlays, setActiveOverlays] = useState<Record<PhysiologyOverlay, boolean>>(initialOverlays);
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>([]);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [comparison, setComparison] = useState<OrganComparisonData>({ organA: null, organB: null, isActive: false });
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTissueCellModalOpen, setIsTissueCellModalOpen] = useState<boolean>(false);

  const activeOrganObject = useMemo(() => {
    if (!selectedOrganId) return null;
    return HUMAN_ANATOMY_OBJECTS.find((obj) => obj.id === selectedOrganId) || null;
  }, [selectedOrganId]);

  const toggleSystemVisibility = useCallback((s: BodySystemId) => {
    setVisibleSystems((prev) => ({ ...prev, [s]: !prev[s] }));
  }, []);

  const setSystemOpacityValue = useCallback((s: BodySystemId, val: number) => {
    setSystemOpacity((prev) => ({ ...prev, [s]: val }));
  }, []);

  const setActiveSystem = useCallback((s: BodySystemId | null) => {
    setActiveSystemState(s);
    if (s) {
      setActiveLayerState("system-view");
    }
  }, []);

  const setActiveLayer = useCallback((layer: ExplorationLayer) => {
    setActiveLayerState(layer);
    if (layer === "isolation-mode" && selectedOrganId) {
      setIsolatedOrganId(selectedOrganId);
    } else if (layer !== "isolation-mode") {
      setIsolatedOrganId(null);
    }
    if (layer === "tissue-view" || layer === "cell-view") {
      setIsTissueCellModalOpen(true);
    }
  }, [selectedOrganId]);

  const togglePhysiologyOverlay = useCallback((ov: PhysiologyOverlay) => {
    setActiveOverlays((prev) => ({ ...prev, [ov]: !prev[ov] }));
  }, []);

  const addMeasurementPoint = useCallback((pt: [number, number, number]) => {
    setMeasurementPoints((prev) => {
      if (prev.length >= 2) return [{ id: "1", position: pt, label: "Point 1" }];
      const id = (prev.length + 1).toString();
      return [...prev, { id, position: pt, label: `Point ${id}` }];
    });
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurementPoints([]);
    setIsMeasuring(false);
  }, []);

  const openComparison = useCallback((organAId?: string, organBId?: string) => {
    const organA = HUMAN_ANATOMY_OBJECTS.find((o) => o.id === (organAId || selectedOrganId || "heart")) || null;
    const organB = HUMAN_ANATOMY_OBJECTS.find((o) => o.id === (organBId || "lungs")) || null;
    setComparison({ organA, organB, isActive: true });
  }, [selectedOrganId]);

  const closeComparison = useCallback(() => {
    setComparison({ organA: null, organB: null, isActive: false });
  }, []);

  const addBookmark = useCallback((title: string, notes?: string) => {
    const entry: BookmarkEntry = {
      id: Date.now().toString(),
      title,
      timestamp: Date.now(),
      cameraPosition: [0, 3, 8],
      cameraTarget: [0, 2.8, 0],
      activeSystem,
      selectedOrgan: selectedOrganId,
      activeLayer,
      activeOverlays: (Object.keys(activeOverlays) as PhysiologyOverlay[]).filter((k) => activeOverlays[k]),
      notes,
    };
    setBookmarks((prev) => [entry, ...prev]);
  }, [activeSystem, selectedOrganId, activeLayer, activeOverlays]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const resetAllViews = useCallback(() => {
    setActiveSystemState(null);
    setSelectedOrganId(null);
    setHoveredOrganId(null);
    setIsolatedOrganId(null);
    setActiveLayerState("whole-body");
    setExplodeLevel(0);
    setClippingPosition(10);
    setVisibleSystems(initialSystemsVisibility);
    setSystemOpacity(initialSystemsOpacity);
    setActiveOverlays(initialOverlays);
    setMeasurementPoints([]);
    setIsMeasuring(false);
    setComparison({ organA: null, organB: null, isActive: false });
    setSearchQuery("");
  }, []);

  const state: DigitalHumanState = useMemo(
    () => ({
      gender,
      renderMode,
      activeSystem,
      visibleSystems,
      systemOpacity,
      selectedOrganId,
      hoveredOrganId,
      isolatedOrganId,
      activeLayer,
      explodeLevel,
      clippingAxis,
      clippingPosition,
      activeOverlays,
      measurementPoints,
      isMeasuring,
      comparison,
      bookmarks,
      searchQuery,
      isAiSidebarOpen,
      isSearchOpen,
      isTissueCellModalOpen,
    }),
    [
      gender,
      renderMode,
      activeSystem,
      visibleSystems,
      systemOpacity,
      selectedOrganId,
      hoveredOrganId,
      isolatedOrganId,
      activeLayer,
      explodeLevel,
      clippingAxis,
      clippingPosition,
      activeOverlays,
      measurementPoints,
      isMeasuring,
      comparison,
      bookmarks,
      searchQuery,
      isAiSidebarOpen,
      isSearchOpen,
      isTissueCellModalOpen,
    ]
  );

  return (
    <DigitalHumanContext.Provider
      value={{
        state,
        activeOrganObject,
        setGender,
        setRenderMode,
        setActiveSystem,
        toggleSystemVisibility,
        setSystemOpacityValue,
        setSelectedOrganId,
        setHoveredOrganId,
        setIsolatedOrganId,
        setActiveLayer,
        setExplodeLevel,
        setClippingAxis,
        setClippingPosition,
        togglePhysiologyOverlay,
        setIsMeasuring,
        addMeasurementPoint,
        clearMeasurements,
        openComparison,
        closeComparison,
        addBookmark,
        removeBookmark,
        setSearchQuery,
        setIsAiSidebarOpen,
        setIsSearchOpen,
        setIsTissueCellModalOpen,
        resetAllViews,
      }}
    >
      {children}
    </DigitalHumanContext.Provider>
  );
};

export const useDigitalHumanEngine = () => {
  const ctx = useContext(DigitalHumanContext);
  if (!ctx) {
    throw new Error("useDigitalHumanEngine must be used within a DigitalHumanEngineProvider");
  }
  return ctx;
};

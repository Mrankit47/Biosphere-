'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { BackLink } from '@/components/ds'
import { RenderMode } from './_components/BodyModel'

// Lazy-load the heavy 3D canvas and model components with a custom high-tech glowing loading state
const AnatomyViewer = dynamic(
  () => import('./_components/AnatomyViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="anatomy-canvas-loading">
        <div className="glowing-spinner" />
        <p className="loading-text">INITIALIZING 3D MEDICAL SCANNER ENGINE...</p>
      </div>
    )
  }
)

// Lazy-load the isolated organ viewer for the diagnostic modal
const OrganViewer = dynamic(
  () => import('./_components/OrganViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="anatomy-canvas-loading">
        <div className="glowing-spinner" />
        <p className="loading-text">ISOLATING 3D SPECIMEN MODEL...</p>
      </div>
    )
  }
)

/* ══════════════════════════════════════════════════════════════
   ▸ DETAILED ANATOMICAL DIAGNOSTIC DATA
   ══════════════════════════════════════════════════════════════ */
const ORGAN_INFO: Record<
  string,
  {
    name: string
    scientificName: string
    emoji: string
    color: string
    description: string
    location: string
    function: string
    diseases: string[]
    relatedOrgans: string[]
    medicalNotes: string
    stats: { label: string; value: string; pct: number }[]
  }
> = {
  brain: {
    name: 'Brain',
    scientificName: 'Cerebrum',
    emoji: '🧠',
    color: '#E879F9',
    description: 'The control center of the central nervous system, coordinating sensory input, motor control, memory, and cognitive thought.',
    location: 'Cranial cavity within the skull',
    function: 'Cognition, motor command, sensory integration, homeostasis regulation',
    diseases: ["Alzheimer's disease", 'Stroke', 'Glioma', 'Meningitis'],
    relatedOrgans: ['Spinal Cord', 'Eyes', 'Nerves'],
    medicalNotes: 'Composed of left and right hemispheres, cerebral cortex, cerebellum, and brainstem. Highly dependent on constant cerebral arterial blood flow.',
    stats: [
      { label: 'Neural Speed', value: '268 mph', pct: 92 },
      { label: 'Energy Usage', value: '20% total', pct: 85 },
      { label: 'Neurons Count', value: '86B', pct: 98 },
    ],
  },
  heart: {
    name: 'Heart',
    scientificName: 'Cor',
    emoji: '❤️',
    color: '#EF4444',
    description: 'A muscular organ that pumps blood throughout the circulatory system, delivering oxygen and nutrients to tissues and removing carbon dioxide.',
    location: 'Mediastinum of the thoracic cavity',
    function: 'Systemic and pulmonary blood circulation pumping',
    diseases: ['Coronary artery disease', 'Myocardial infarction', 'Arrhythmia'],
    relatedOrgans: ['Arteries', 'Veins', 'Lungs'],
    medicalNotes: 'Contains four chambers (two atria, two ventricles) and is governed by the sinoatrial node (cardiac pacemaker).',
    stats: [
      { label: 'Pulse Rate', value: '72 BPM', pct: 72 },
      { label: 'Stroke Output', value: '70 mL', pct: 68 },
      { label: 'Circulation time', value: '45s', pct: 90 },
    ],
  },
  lungs: {
    name: 'Lungs',
    scientificName: 'Pulmones',
    emoji: '🫁',
    color: '#F472B6',
    description: 'Primary organs of respiration that facilitate gas exchange, absorbing oxygen from inhaled air and releasing carbon dioxide waste.',
    location: 'Pleural cavities flanking the mediastinum',
    function: 'Gas exchange (O2 intake, CO2 elimination), blood pH buffer',
    diseases: ['Pneumonia', 'Asthma', 'COPD', 'Pulmonary embolism'],
    relatedOrgans: ['Trachea', 'Heart', 'Diaphragm'],
    medicalNotes: 'The right lung is divided into three lobes, whereas the left lung has two lobes and a cardiac notch to accommodate the heart.',
    stats: [
      { label: 'Breathing Rate', value: '16/min', pct: 65 },
      { label: 'Lung Capacity', value: '6.0 Liters', pct: 80 },
      { label: 'Alveoli Count', value: '480 Million', pct: 95 },
    ],
  },
  liver: {
    name: 'Liver',
    scientificName: 'Hepar',
    emoji: '🟤',
    color: '#D97706',
    description: 'A vital metabolic organ that processes nutrients, synthesizes proteins, detoxifies xenobiotics, and secretes bile for lipid digestion.',
    location: 'Right upper quadrant of the abdominal cavity',
    function: 'Detoxification, protein synthesis, glycogen storage, bile production',
    diseases: ['Cirrhosis', 'Hepatitis', 'Fatty liver disease', 'Hepatocellular carcinoma'],
    relatedOrgans: ['Gallbladder', 'Stomach', 'Duodenum'],
    medicalNotes: 'Capable of unique hepatocyte regeneration. Receives a dual blood supply from the hepatic artery and the hepatic portal vein.',
    stats: [
      { label: 'Filters/Min', value: '1.4 Liters', pct: 88 },
      { label: 'Chemical Jobs', value: '500+', pct: 99 },
      { label: 'Regen Factor', value: 'High', pct: 94 },
    ],
  },
  stomach: {
    name: 'Stomach',
    scientificName: 'Gaster',
    emoji: '🟢',
    color: '#10B981',
    description: 'A muscular, J-shaped digestive organ that secretes gastric juice, containing hydrochloric acid and pepsin, to churn and digest food.',
    location: 'Left upper quadrant of the abdominal cavity',
    function: 'Bolus churning, chemical protein digestion, gastric emptying',
    diseases: ['Gastric ulcer', 'Gastritis', 'Gastroesophageal reflux (GERD)'],
    relatedOrgans: ['Esophagus', 'Duodenum', 'Pancreas'],
    medicalNotes: 'Lined with gastric pits containing parietal cells (acid secreting) and chief cells (pepsinogen secreting). Protected by a thick alkaline mucus layer.',
    stats: [
      { label: 'Stomach pH', value: '1.8 pH', pct: 94 },
      { label: 'Capacity', value: '1.5 Liters', pct: 70 },
      { label: 'Lining Renewal', value: '3 Days', pct: 90 },
    ],
  },
  intestines: {
    name: 'Intestines',
    scientificName: 'Intestinum',
    emoji: '🌀',
    color: '#3B82F6',
    description: 'Segments of the alimentary canal responsible for nutrient absorption (small intestine) and water/electrolyte absorption (large intestine).',
    location: 'Abdominopelvic cavity inferior to the stomach',
    function: 'Nutrient absorption, water recovery, fecal consolidation, microbiome habitat',
    diseases: ["Crohn's disease", 'Ulcerative colitis', 'Celiac disease', 'IBS'],
    relatedOrgans: ['Stomach', 'Liver', 'Rectum'],
    medicalNotes: 'Equipped with mucosal villi and microvilli to vastly expand the surface area for nutrient uptake.',
    stats: [
      { label: 'Total Length', value: '25 feet', pct: 82 },
      { label: 'Microbiome', value: '100 Trillion', pct: 99 },
      { label: 'Absorption Area', value: '250 m²', pct: 96 },
    ],
  },
  kidneys: {
    name: 'Kidneys',
    scientificName: 'Renes',
    emoji: '🫘',
    color: '#8B5CF6',
    description: 'Bean-shaped organs that filter blood to extract nitrogenous wastes, regulate blood pressure, and maintain electrolyte homeostatic balance.',
    location: 'Retroperitoneal abdominal wall flanking the spine',
    function: 'Blood filtration, waste excretion, erythropoietin secretion, pH regulation',
    diseases: ['Chronic kidney disease', 'Nephrolithiasis (stones)', 'Glomerulonephritis'],
    relatedOrgans: ['Ureters', 'Bladder', 'Adrenal Glands'],
    medicalNotes: 'Functional units are nephrons (~1 million per kidney) consisting of a glomerulus and renal tubule system.',
    stats: [
      { label: 'Filtration Rate', value: '125 mL/min', pct: 86 },
      { label: 'Nephrons Count', value: '2.0 Million', pct: 94 },
      { label: 'Fluid filtered', value: '180 L/day', pct: 90 },
    ],
  },
  bladder: {
    name: 'Bladder',
    scientificName: 'Vesica Urinaria',
    emoji: '💧',
    color: '#FBBF24',
    description: 'A distensible muscular reservoir that collects and stores urine originating from the ureters prior to micturition (urination).',
    location: 'Pelvic floor posterior to the pubic symphysis',
    function: 'Urine storage, controlled detrusor muscle voiding',
    diseases: ['Cystitis (UTI)', 'Overactive bladder', 'Bladder calculi'],
    relatedOrgans: ['Kidneys', 'Ureters', 'Urethra'],
    medicalNotes: 'Lined with transitional epithelium (urothelium) that stretches to accommodate volume changes without tearing.',
    stats: [
      { label: 'Max Capacity', value: '600 mL', pct: 75 },
      { label: 'Trigger Volume', value: '150 mL', pct: 60 },
      { label: 'Detrusor Tone', value: 'Healthy', pct: 85 },
    ],
  },
  eyes: {
    name: 'Eyes',
    scientificName: 'Oculi',
    emoji: '👁️',
    color: '#0EA5E9',
    description: 'Sensory photoreceptor organs that focus light onto the retina, generating electrical impulses transmitted via the optic nerve to the visual cortex.',
    location: 'Orbital cavities of the skull',
    function: 'Photoreception, visual focus, depth perception, circadian synchrony',
    diseases: ['Cataracts', 'Glaucoma', 'Macular degeneration', 'Myopia'],
    relatedOrgans: ['Brain', 'Optic Nerve'],
    medicalNotes: 'Layers include the fibrous sclera/cornea, vascular uvea (iris/choroid), and sensory neural retina.',
    stats: [
      { label: 'Visual Fields', value: '180 deg', pct: 80 },
      { label: 'Resolution', value: '576 MP', pct: 95 },
      { label: 'Rod Cells', value: '120 Million', pct: 90 },
    ],
  },
  ears: {
    name: 'Ears',
    scientificName: 'Aures',
    emoji: '👂',
    color: '#F59E0B',
    description: 'Sensory organs responsible for transducing sound waves into neural signals and maintaining vestibular balance.',
    location: 'Temporal bones of the skull',
    function: 'Auditory transduction, equilibrium, spatial orientation',
    diseases: ['Otitis media', 'Tinnitus', "Meniere's disease", 'Conductive hearing loss'],
    relatedOrgans: ['Brain', 'Auditory Nerve'],
    medicalNotes: 'Features the external canal, tympanic membrane (eardrum), auditory ossicles (malleus, incus, stapes), and the fluid-filled cochlea.',
    stats: [
      { label: 'Freq Range', value: '20-20kHz', pct: 78 },
      { label: 'Ossicle Size', value: '3 mm', pct: 99 },
      { label: 'Semicirculars', value: '3 canals', pct: 85 },
    ],
  },
  thyroid: {
    name: 'Thyroid Gland',
    scientificName: 'Glandula Thyroidea',
    emoji: '🦋',
    color: '#EF4444',
    description: 'A vital butterfly-shaped endocrine gland that secretes thyroxine (T4) and triiodothyronine (T3) to regulate systemic metabolism.',
    location: 'Anterior neck inferior to the thyroid cartilage',
    function: 'Thyroid hormone secretion, metabolic rate control, calcium homeostasis',
    diseases: ['Hypothyroidism', 'Hyperthyroidism', "Graves' disease", 'Thyroid nodules'],
    relatedOrgans: ['Pituitary Gland', 'Trachea'],
    medicalNotes: 'Controlled by Thyroid Stimulating Hormone (TSH) from the pituitary. Secretes calcitonin to regulate bone calcium resorption.',
    stats: [
      { label: 'BMR Regulation', value: 'Primary', pct: 90 },
      { label: 'Iodine storage', value: '80% body', pct: 96 },
      { label: 'Hormone release', value: 'T4 / T3', pct: 88 },
    ],
  },
  adrenal: {
    name: 'Adrenal Glands',
    scientificName: 'Glandulae Suprarenales',
    emoji: '🔺',
    color: '#FBBF24',
    description: 'Endocrine glands that produce vital hormones, including adrenaline, cortisol, aldosterone, and sex hormones, to manage stress response.',
    location: 'Superior poles of both kidneys',
    function: 'Corticosteroid synthesis, catecholamine release (adrenaline), stress response',
    diseases: ["Addison's disease", "Cushing's syndrome", 'Pheochromocytoma'],
    relatedOrgans: ['Kidneys', 'Pituitary Gland'],
    medicalNotes: 'Differentiated into an outer cortex (steroid hormones) and an inner medulla (catecholemines/fight-or-flight response).',
    stats: [
      { label: 'Cortisol peak', value: 'Morning', pct: 80 },
      { label: 'Stress response', value: 'Adrenaline', pct: 95 },
      { label: 'Electrolyte control', value: 'Aldosterone', pct: 85 },
    ],
  },
  pituitary: {
    name: 'Pituitary Gland',
    scientificName: 'Hypophysis',
    emoji: '💧',
    color: '#A855F7',
    description: 'The "master gland" of the endocrine system, secreting trophic hormones that govern other endocrine glands and regulate growth.',
    location: 'Sella turcica at the base of the skull',
    function: 'Hormonal coordination, growth control, reproductive cycling, thyroid governance',
    diseases: ['Pituitary adenoma', 'Prolactinoma', 'Diabetes insipidus', 'Gigantism'],
    relatedOrgans: ['Brain (Hypothalamus)', 'Thyroid', 'Adrenals'],
    medicalNotes: 'Connected to the hypothalamus via the infundibular stalk. Consists of anterior (adenohypophysis) and posterior (neurohypophysis) lobes.',
    stats: [
      { label: 'Master control', value: 'Endocrine', pct: 98 },
      { label: 'Trophic hormones', value: '8 classes', pct: 92 },
      { label: 'Diameter', value: '10 mm', pct: 95 },
    ],
  },
  spleen: {
    name: 'Spleen',
    scientificName: 'Lien',
    emoji: '💜',
    color: '#6B21A8',
    description: 'The largest lymphatic organ, filtering blood to recycle old red blood cells and hosting lymphocytes for immune responses.',
    location: 'Left upper quadrant posterior to the stomach',
    function: 'Erythrocyte recycling, antibody synthesis, platelet storage',
    diseases: ['Splenomegaly', 'Splenic rupture', 'Hypersplenism'],
    relatedOrgans: ['Lymph nodes', 'Stomach', 'Circulatory System'],
    medicalNotes: 'Divided into red pulp (filtering red blood cells) and white pulp (lymphatic tissue fighting infections). Can release emergency blood reserves.',
    stats: [
      { label: 'RBC lifespan filter', value: '120 days', pct: 88 },
      { label: 'Platelet pool', value: '30% total', pct: 75 },
      { label: 'Immune cells', value: 'Lymphocytes', pct: 85 },
    ],
  },
  reproductive: {
    name: 'Reproductive System',
    scientificName: 'Systema Genitale',
    emoji: '🧬',
    color: '#EC4899',
    description: 'Internal and external genitalia responsible for gametogenesis (egg/sperm production), sexual reproduction, and endocrine sex hormones.',
    location: 'Pelvic cavity floor',
    function: 'Gametogenesis, sex hormone regulation (estrogen/testosterone), gestation (female)',
    diseases: ['Endometriosis', 'Prostatic hyperplasia', 'Ovarian cysts', 'Infertility'],
    relatedOrgans: ['Endocrine Glands', 'Urinary Bladder'],
    medicalNotes: 'Varies dramatically by genetic sex. Regulated by Gonadotropin-Releasing Hormone (GnRH) from the hypothalamus.',
    stats: [
      { label: 'Sperm production', value: '150M/day', pct: 90 },
      { label: 'Follicle count', value: '400k birth', pct: 85 },
      { label: 'Hormone types', value: 'Androgen/Estrogen', pct: 94 },
    ],
  },
}

// CameraManager and BodyScene components moved to separate client-only file AnatomyViewer.tsx for dynamic lazy-loading.

/* ══════════════════════════════════════════════════════════════
   ▸ PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function HumanBodyPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(false)
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null)
  const [activeSystem, setActiveSystem] = useState<string | null>(null)
  const [detailModal, setDetailModal] = useState(false)
  const [renderMode, setRenderMode] = useState<RenderMode>('realistic')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Sliders
  const [explode, setExplode] = useState<number>(0)
  const [clipEnabled, setClipEnabled] = useState<boolean>(false)
  const [clipAxis, setClipAxis] = useState<'X' | 'Y' | 'Z'>('Z')
  const [clipConstant, setClipConstant] = useState<number>(0.5)

  // Active accordion section on left sidebar
  const [activeAccordion, setActiveAccordion] = useState<string | null>('systems')

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Checklist for 19 Systems Visibility
  const [visibleSystems, setVisibleSystems] = useState<Record<string, boolean>>({
    skin: true,
    skeleton: true,
    muscles: false,
    brain: true,
    eyes: true,
    ears: true,
    heart: true,
    respiratory: true,
    digestive: true,
    urinary: true,
    endocrine: true,
    lymphatic: true,
    reproductive: true,
    vascular: true,
    nervous: true,
  })

  // Checklist for Opacities
  const [opacityOverrides, setOpacityOverrides] = useState<Record<string, number>>({
    skin: 0.15,
    skeleton: 1.0,
    muscles: 1.0,
    brain: 1.0,
    eyes: 1.0,
    ears: 1.0,
    heart: 1.0,
    respiratory: 1.0,
    digestive: 1.0,
    urinary: 1.0,
    endocrine: 1.0,
    lymphatic: 1.0,
    reproductive: 1.0,
    arteries: 1.0,
    veins: 1.0,
    nervous: 1.0,
  })

  const info = selectedOrgan ? ORGAN_INFO[selectedOrgan] : null

  // Clipping Plane calculation
  const clipPlane = useMemo(() => {
    if (!clipEnabled) return []
    let normal = new THREE.Vector3(0, 0, -1) // Coronal
    let originOffset = 0
    if (clipAxis === 'X') {
      normal = new THREE.Vector3(-1, 0, 0) // Sagittal
    } else if (clipAxis === 'Y') {
      normal = new THREE.Vector3(0, -1, 0) // Transverse
      originOffset = 2.8
    }
    const mappedVal = (clipConstant - 0.5) * 5.0 + originOffset
    return [new THREE.Plane(normal, mappedVal)]
  }, [clipEnabled, clipAxis, clipConstant])

  const toggleSystem = (key: string) => {
    setVisibleSystems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleOpacityChange = (key: string, val: number) => {
    setOpacityOverrides(prev => ({ ...prev, [key]: val }))
  }

  const isolateSystem = (systemKey: string) => {
    const defaultFalse = Object.keys(visibleSystems).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)

    setVisibleSystems({
      ...defaultFalse,
      [systemKey]: true,
    })
  }

  const resetAllSystems = () => {
    setVisibleSystems({
      skin: true,
      skeleton: true,
      muscles: true,
      brain: true,
      eyes: true,
      ears: true,
      heart: true,
      respiratory: true,
      digestive: true,
      urinary: true,
      endocrine: true,
      lymphatic: true,
      reproductive: true,
      vascular: true,
      nervous: true,
    })
    setOpacityOverrides({
      skin: 0.15,
      skeleton: 1.0,
      muscles: 1.0,
      brain: 1.0,
      eyes: 1.0,
      ears: 1.0,
      heart: 1.0,
      respiratory: 1.0,
      digestive: 1.0,
      urinary: 1.0,
      endocrine: 1.0,
      lymphatic: 1.0,
      reproductive: 1.0,
      arteries: 1.0,
      veins: 1.0,
      nervous: 1.0,
    })
    setExplode(0)
    setClipEnabled(false)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    return Object.entries(ORGAN_INFO).filter(
      ([key, val]) =>
        val.name.toLowerCase().includes(query) ||
        val.scientificName.toLowerCase().includes(query) ||
        val.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const selectSearchedOrgan = (key: string) => {
    setSelectedOrgan(key)
    setSearchQuery('')

    const organToSystemMap: Record<string, string> = {
      brain: 'brain',
      eyes: 'eyes',
      ears: 'ears',
      heart: 'heart',
      lungs: 'respiratory',
      liver: 'digestive',
      stomach: 'digestive',
      intestines: 'digestive',
      kidneys: 'urinary',
      bladder: 'urinary',
      thyroid: 'endocrine',
      adrenal: 'endocrine',
      pituitary: 'endocrine',
      spleen: 'lymphatic',
      reproductive: 'reproductive',
    }

    const sysKey = organToSystemMap[key]
    if (sysKey) {
      setVisibleSystems(prev => ({ ...prev, [sysKey]: true }))
    }
  }

  return (
    <div className="anatomy-root">
      <div className="anatomy-grid-bg" />
      <div className="anatomy-glow-effect" />

      {/* TOP HEADER NAVIGATION */}
      <header className="anatomy-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">3D ANATOMY EXPLORER</h1>
            <p className="header-subtitle">MEDICAL VISUALIZER ENGINE</p>
          </div>
        </div>

        <div className="header-center">
          <div className="gender-btn-group glass-pill">
            <button
              onClick={() => setGender('male')}
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
            >
              ♂ MALE
            </button>
            <button
              onClick={() => setGender('female')}
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
            >
              ♀ FEMALE
            </button>
          </div>
        </div>

        <div className="header-right">
          {[
            { mode: 'realistic', label: 'Clinical', icon: '🩺' },
            { mode: 'xray', label: 'X-Ray', icon: '🩻' },
            { mode: 'hologram', label: 'Holo', icon: '💻' },
          ].map(item => (
            <button
              key={item.mode}
              onClick={() => setRenderMode(item.mode as RenderMode)}
              className={`mode-toggle-btn ${renderMode === item.mode ? 'active' : ''}`}
            >
              <span className="mode-btn-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="anatomy-main-layout">
        {/* LEFT COLUMN */}
        <section className="anatomy-sidebar-left">
          <div className="panel-card glassmorphic search-panel-card">
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search any organ (e.g. Heart)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                  ✕
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="search-suggestions-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => selectSearchedOrgan(key)}
                      className="search-suggestion-row"
                    >
                      <span className="suggestion-emoji">{val.emoji}</span>
                      <div className="suggestion-details">
                        <span className="suggestion-name">{val.name}</span>
                        <span className="suggestion-scientific">{val.scientificName}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="no-suggestions">No structures match query</div>
                )}
              </div>
            )}
          </div>

          <div className="accordion-scroller">
            <div className={`accordion-item glassmorphic ${activeAccordion === 'systems' ? 'open' : ''}`}>
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'systems' ? null : 'systems')}
                className="accordion-header"
              >
                <span>🎛️ SYSTEM CONTROLS</span>
                <span className="accordion-arrow">{activeAccordion === 'systems' ? '▲' : '▼'}</span>
              </button>

              <div className="accordion-content">
                <button onClick={resetAllSystems} className="reset-all-btn">
                  🔄 RESET VIEW
                </button>

                <div className="systems-checklist">
                  {[
                    { key: 'skin', label: 'Integumentary (Skin)', icon: '👤', desc: 'Outer dermal cover' },
                    { key: 'skeleton', label: 'Skeletal (Bones)', icon: '🦴', desc: 'Spine, ribcage, limbs' },
                    { key: 'muscles', label: 'Muscular System', icon: '💪', desc: 'Skeletal muscles' },
                    { key: 'brain', label: 'Cranial (Brain)', icon: '🧠', desc: 'Cortex, cerebellum, brainstem' },
                    { key: 'eyes', label: 'Ocular Anatomy (Eyes)', icon: '👁️', desc: 'Bulbs, nerves' },
                    { key: 'ears', label: 'Auditory Anatomy (Ears)', icon: '👂', desc: 'Ossicles canal' },
                    { key: 'heart', label: 'Cardiovascular (Heart)', icon: '🫀', desc: 'Pump chamber' },
                    { key: 'respiratory', label: 'Respiratory (Lungs)', icon: '🫁', desc: 'Lobes, trachea' },
                    { key: 'digestive', label: 'Digestive System', icon: '🌀', desc: 'Stomach, liver, bowel' },
                    { key: 'urinary', label: 'Urinary (Kidneys)', icon: '🫘', desc: 'Renal nodes, bladder' },
                    { key: 'endocrine', label: 'Endocrine Glands', icon: '🦋', desc: 'Thyroid, adrenal' },
                    { key: 'lymphatic', label: 'Lymphatic (Spleen)', icon: '💜', desc: 'Immune lymph nodes' },
                    { key: 'reproductive', label: 'Reproductive System', icon: '🧬', desc: 'Gonadal tracts' },
                    { key: 'vascular', label: 'Vascular Network', icon: '🩸', desc: 'Arteries & veins' },
                    { key: 'nervous', label: 'Nerve Trunk Tree', icon: '⚡', desc: 'Peripheral nerves' },
                  ].map(sys => {
                    const active = visibleSystems[sys.key]
                    const opacityValue = opacityOverrides[sys.key] !== undefined ? opacityOverrides[sys.key] : 1.0

                    return (
                      <div key={sys.key} className="system-row-group">
                        <div className={`system-check-row ${active ? 'active' : ''}`}>
                          <button
                            onClick={() => toggleSystem(sys.key)}
                            className="checkbox-toggle"
                          >
                            <div className="checkbox-indicator">
                              {active && <span className="checkbox-inner-dot" />}
                            </div>
                            <span className="system-row-icon">{sys.icon}</span>
                            <div className="system-row-details">
                              <span className="system-row-label">{sys.label}</span>
                              <span className="system-row-desc">{sys.desc}</span>
                            </div>
                          </button>

                          <div className="system-actions">
                            <button
                              onClick={() => isolateSystem(sys.key)}
                              className="isolate-small-btn"
                              title="Isolate system"
                            >
                              🎯
                            </button>
                          </div>
                        </div>

                        {active && (
                          <div className="opacity-slider-row">
                            <span className="opacity-slider-label">Opacity: {Math.round(opacityValue * 100)}%</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={opacityValue * 100}
                              onChange={e => handleOpacityChange(sys.key, parseFloat(e.target.value) / 100)}
                              className="opacity-slider"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className={`accordion-item glassmorphic ${activeAccordion === 'favorites' ? 'open' : ''}`}>
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'favorites' ? null : 'favorites')}
                className="accordion-header"
              >
                <span>⭐ FAVORITE STRUCTURES</span>
                <span className="accordion-arrow">{activeAccordion === 'favorites' ? '▲' : '▼'}</span>
              </button>

              <div className="accordion-content">
                {favorites.length > 0 ? (
                  <div className="favorites-list">
                    {favorites.map(id => {
                      const organ = ORGAN_INFO[id]
                      if (!organ) return null
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedOrgan(id)}
                          className="favorite-item-btn"
                        >
                          <span className="favorite-item-emoji">{organ.emoji}</span>
                          <div className="favorite-item-details">
                            <span className="favorite-item-name">{organ.name}</span>
                            <span className="favorite-item-scientific">{organ.scientificName}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="no-favorites-text">Click the star button on any organ to add to favorites.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN */}
        <section className="anatomy-canvas-container" aria-label="3D Anatomical Scene">
          {mounted && (
            <AnatomyViewer
              selectedOrgan={selectedOrgan}
              setSelectedOrgan={setSelectedOrgan}
              activeSystem={activeSystem}
              setActiveSystem={setActiveSystem}
              renderMode={renderMode}
              visibleSystems={visibleSystems}
              gender={gender}
              explode={explode}
              clipPlane={clipPlane}
              opacityOverrides={opacityOverrides}
            />
          )}

          <div className="anatomy-bottom-controls glassmorphic">
            <div className="control-slider-group">
              <div className="control-slider-header">
                <span className="slider-icon">💥</span>
                <span className="slider-label">EXPLODE VIEW</span>
                <span className="slider-value">{Math.round(explode * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={explode * 100}
                onChange={e => setExplode(parseFloat(e.target.value) / 100)}
                className="control-slider"
              />
            </div>

            <div className="vertical-divider" />

            <div className="control-slider-group section-cutter-controls">
              <div className="cutter-toggle-row">
                <button
                  onClick={() => setClipEnabled(!clipEnabled)}
                  className={`clipper-btn ${clipEnabled ? 'active' : ''}`}
                >
                  🩻 CROSS-SECTION CUTTER
                </button>
                {clipEnabled && (
                  <div className="clipper-axis-selector">
                    {['Z', 'X', 'Y'].map(axis => {
                      const label = axis === 'Z' ? 'Coronal' : axis === 'X' ? 'Sagittal' : 'Transverse'
                      return (
                        <button
                          key={axis}
                          onClick={() => setClipAxis(axis as 'X' | 'Y' | 'Z')}
                          className={`axis-btn ${clipAxis === axis ? 'active' : ''}`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              {clipEnabled && (
                <div className="control-slider-inner">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={clipConstant * 100}
                    onChange={e => setClipConstant(parseFloat(e.target.value) / 100)}
                    className="control-slider"
                  />
                  <span className="slider-value">Depth: {Math.round(clipConstant * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {!selectedOrgan && !activeSystem && (
            <div className="canvas-overlay-hint">
              <span className="mouse-icon">🖱️</span>
              <p>DRAG MOUSE TO ROTATE · SCROLL TO ZOOM · SHIFT+DRAG TO PAN · CLICK TO INSPECT</p>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN */}
        <section className="anatomy-sidebar-right">
          <AnimatePresence mode="wait">
            {info ? (
              <motion.div
                key={selectedOrgan}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="panel-card glassmorphic diagnostic-info-panel active"
                style={{ '--organ-color': info.color } as React.CSSProperties}
              >
                <button onClick={() => setSelectedOrgan(null)} className="panel-close-btn" aria-label="Close panel">
                  ✕
                </button>

                <div className="diagnostic-header">
                  <div className="header-meta-row">
                    <span className="diagnostic-badge">SPECIMEN DIAGNOSTIC SCAN</span>
                    <button
                      onClick={() => toggleFavorite(selectedOrgan!)}
                      className={`favorite-toggle-btn ${favorites.includes(selectedOrgan!) ? 'active' : ''}`}
                    >
                      ★
                    </button>
                  </div>
                  <div className="title-row">
                    <div className="organ-avatar">
                      <span className="organ-avatar-emoji">{info.emoji}</span>
                    </div>
                    <div>
                      <h2 className="organ-name">{info.name}</h2>
                      <span className="organ-coord">SCIENTIFIC: <i>{info.scientificName}</i></span>
                    </div>
                  </div>
                </div>

                <div className="diagnostic-section">
                  <h4 className="section-title">FUNCTIONAL ANATOMY</h4>
                  <p className="organ-desc-text">{info.description}</p>
                </div>

                <div className="diagnostic-section">
                  <div className="detail-meta-grid">
                    <div className="meta-cell">
                      <span className="meta-cell-label">LOCATION</span>
                      <span className="meta-cell-value">{info.location}</span>
                    </div>
                    <div className="meta-cell">
                      <span className="meta-cell-label">PRIMARY FUNCTION</span>
                      <span className="meta-cell-value">{info.function}</span>
                    </div>
                  </div>
                </div>

                <div className="diagnostic-section">
                  <h4 className="section-title">CLINICAL TELEMETRY</h4>
                  <div className="telemetry-grid">
                    {info.stats.map(s => (
                      <div key={s.label} className="telemetry-bar-row">
                        <div className="telemetry-label-row">
                          <span className="telemetry-stat-label">{s.label}</span>
                          <span className="telemetry-stat-value">{s.value}</span>
                        </div>
                        <div className="telemetry-track">
                          <div className="telemetry-fill" style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="diagnostic-section">
                  <h4 className="section-title">CLINICAL MEDICINE NOTES</h4>
                  <p className="notes-text">{info.medicalNotes}</p>
                </div>

                <div className="diagnostic-section">
                  <h4 className="section-title">COMMON RELATED PATHOLOGIES</h4>
                  <div className="pathology-tags-wrap">
                    {info.diseases.map(d => (
                      <span key={d} className="pathology-tag">
                        ⚠️ {d}
                      </span>
                    ))}
                  </div>
                </div>

                <button onClick={() => setDetailModal(true)} className="isolate-btn">
                  🔬 ISOLATE SPECIMEN IN 3D
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="panel-card glassmorphic diagnostic-info-panel idle"
              >
                <div className="idle-indicator">
                  <span className="pulse-radar" />
                  <span className="idle-icon">🫁</span>
                  <h4>DIAGNOSTIC STANDBY</h4>
                  <p>Click on any anatomical organ structure in the 3D viewer or search to fetch medical diagnostics.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ISOLATED DETAILED 3D SPECIMEN MODAL */}
      {detailModal && info && (
        <div className="specimen-modal-overlay">
          <div className="specimen-modal-card glassmorphic">
            <header className="modal-header">
              <div>
                <span className="modal-badge">3D SPECIMEN ISOLATION</span>
                <h2 className="modal-title">
                  {info.emoji} {info.name.toUpperCase()} MODEL
                </h2>
              </div>
              <button onClick={() => setDetailModal(false)} className="modal-close-btn">
                ✕ CLOSE
              </button>
            </header>

            <div className="modal-body">
              <div className="modal-canvas-wrap">
                {mounted && (
                  <OrganViewer
                    selectedOrgan={selectedOrgan!}
                    renderMode={renderMode}
                    gender={gender}
                  />
                )}
                <div className="modal-rotate-overlay">DRAG SPECIMEN TO ROTATE IN 360°</div>
              </div>

              <div className="modal-info-panel">
                <h4 className="modal-panel-heading">ANATOMICAL SPECIFICATIONS</h4>
                <p className="modal-organ-desc">{info.description}</p>

                <div className="modal-stats-grid">
                  {info.stats.map(s => (
                    <div key={s.label} className="modal-stat-card">
                      <span className="stat-card-label">{s.label}</span>
                      <span className="stat-card-value" style={{ color: info.color }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="modal-fact-box" style={{ borderColor: `${info.color}35` }}>
                  <span className="fact-box-icon">💡</span>
                  <p className="fact-box-text">{info.medicalNotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXCLUSIVE SCALED CSS */}
      <style>{`
        .anatomy-root {
          width: 100vw;
          height: 100vh;
          background: var(--ds-bg-primary);
          color: var(--ds-fg);
          position: relative;
          overflow: hidden;
          font-family: inherit;
          display: flex;
          flex-direction: column;
        }

        .anatomy-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.035) 1px, transparent 0);
          background-size: 26px 26px;
          pointer-events: none;
          z-index: 1;
        }
        .anatomy-glow-effect {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.02) 0%, transparent 70%);
          top: 20%;
          left: 30%;
          pointer-events: none;
          z-index: 1;
        }

        .anatomy-header {
          position: relative;
          z-index: 100;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, var(--ds-bg-primary) 98%, transparent 100%);
          border-bottom: 1px solid var(--ds-border-muted);
          backdrop-filter: blur(12px);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .back-btn {
          color: var(--ds-fg);
          text-decoration: none;
          border: 1px solid var(--ds-border-muted);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--ds-surface-subtle);
          transition: all 0.25s ease;
        }
        .back-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
        }
        .divider-line {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
        }
        .header-title {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          background: linear-gradient(90deg, #f8fafc, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-subtitle {
          margin: 0;
          font-size: 0.6rem;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.2em;
          font-weight: 700;
        }

        .gender-btn-group {
          display: flex;
          padding: 3px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 100px;
          backdrop-filter: blur(8px);
        }
        .gender-btn {
          border: none;
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .gender-btn.active {
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          box-shadow: var(--ds-glow-sm);
        }

        .mode-toggle-btn {
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-subtle);
          color: var(--ds-fg-muted);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 8px;
        }
        .mode-toggle-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .mode-toggle-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .anatomy-main-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 320px 1fr 350px;
          position: relative;
          z-index: 10;
          padding: 1rem 1.5rem 1.5rem 1.5rem;
          gap: 1.25rem;
          overflow: hidden;
        }

        .glassmorphic {
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(24px) saturate(120%);
          border: 1px solid var(--ds-border-muted);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
        }
        .panel-card {
          border-radius: 20px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .search-panel-card {
          padding: 0.75rem 1rem;
          border-radius: 14px;
          position: relative;
        }
        .search-bar-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 100px;
          padding: 6px 12px;
        }
        .search-icon {
          font-size: 0.88rem;
          color: var(--ds-fg-subtle);
        }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--ds-fg);
          font-size: 0.78rem;
          outline: none;
        }
        .search-input::placeholder {
          color: var(--ds-fg-subtle);
        }
        .clear-search-btn {
          background: none;
          border: none;
          color: var(--ds-fg-muted);
          cursor: pointer;
          font-size: 0.7rem;
        }

        .search-suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 6px;
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          max-height: 240px;
          overflow-y: auto;
          z-index: 500;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }
        .search-suggestion-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: none;
          border: none;
          border-bottom: 1px solid var(--ds-border-muted);
          color: var(--ds-fg);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .search-suggestion-row:hover {
          background: var(--ds-accent-faint);
        }
        .suggestion-emoji {
          font-size: 1.15rem;
        }
        .suggestion-details {
          display: flex;
          flex-direction: column;
        }
        .suggestion-name {
          font-size: 0.78rem;
          font-weight: 850;
        }
        .suggestion-scientific {
          font-size: 0.6rem;
          color: var(--ds-fg-subtle);
        }
        .no-suggestions {
          padding: 14px;
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          text-align: center;
        }

        .anatomy-sidebar-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow: hidden;
        }
        .accordion-scroller {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .accordion-scroller::-webkit-scrollbar {
          display: none;
        }

        .accordion-item {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: var(--ds-surface-subtle);
          border: none;
          color: var(--ds-fg);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          cursor: pointer;
          border-bottom: 1px solid var(--ds-border-muted);
        }
        .accordion-header:hover {
          background: var(--ds-surface-raised);
        }
        .accordion-arrow {
          font-size: 0.6rem;
          color: var(--ds-fg-subtle);
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-out;
          padding: 0 14px;
        }
        .accordion-item.open .accordion-content {
          max-height: 480px;
          overflow-y: auto;
          padding: 12px 14px;
        }

        .reset-all-btn {
          width: 100%;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-subtle);
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .reset-all-btn:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .systems-checklist {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .system-row-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 10px;
        }
        .system-row-group:last-child {
          border: none;
          padding-bottom: 0;
        }
        .system-check-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 8px;
          transition: all 0.25s;
        }
        .checkbox-toggle {
          flex: 1;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: var(--ds-fg-muted);
          text-align: left;
          cursor: pointer;
          padding: 0;
        }
        .checkbox-indicator {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          border: 1.5px solid var(--ds-border-muted);
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .checkbox-inner-dot {
          width: 7px;
          height: 7px;
          border-radius: 1px;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }
        .system-row-icon {
          font-size: 1rem;
          margin-right: 8px;
        }
        .system-row-details {
          display: flex;
          flex-direction: column;
        }
        .system-row-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--ds-fg-muted);
        }
        .system-row-desc {
          font-size: 0.55rem;
          color: var(--ds-fg-subtle);
          margin-top: 1px;
        }

        .system-check-row.active .checkbox-indicator {
          border-color: var(--ds-accent);
        }
        .system-check-row.active .system-row-label {
          color: var(--ds-fg);
        }

        .system-actions {
          display: flex;
          align-items: center;
        }
        .isolate-small-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 2px;
          opacity: 0.25;
          transition: opacity 0.2s;
        }
        .system-check-row:hover .isolate-small-btn {
          opacity: 0.85;
        }

        .opacity-slider-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 24px;
          margin-top: 2px;
        }
        .opacity-slider-label {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
        }
        .opacity-slider {
          width: 110px;
          height: 3px;
          background: var(--ds-border-muted);
          outline: none;
          accent-color: var(--ds-accent);
        }

        .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .favorite-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-subtle);
          color: var(--ds-fg);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .favorite-item-btn:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent);
        }
        .favorite-item-emoji {
          font-size: 1.1rem;
        }
        .favorite-item-details {
          display: flex;
          flex-direction: column;
        }
        .favorite-item-name {
          font-size: 0.72rem;
          font-weight: 850;
        }
        .favorite-item-scientific {
          font-size: 0.55rem;
          color: var(--ds-fg-subtle);
        }
        .no-favorites-text {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          text-align: center;
          padding: 8px 0;
        }

        .anatomy-canvas-container {
          position: relative;
          border-radius: 24px;
          border: 1px solid var(--ds-border-muted);
          background: radial-gradient(circle at center, var(--ds-bg-primary), #000);
          overflow: hidden;
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
        }
        .canvas-overlay-hint {
          position: absolute;
          bottom: 7rem;
          left: 50%;
          transform: translateX(-50%);
          color: var(--ds-fg-subtle);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          pointer-events: none;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .mouse-icon {
          font-size: 1rem;
          animation: pulse 2.5s infinite ease-in-out;
        }

        .anatomy-bottom-controls {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          border-radius: 16px;
          padding: 12px 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          align-items: center;
          z-index: 100;
        }
        .control-slider-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .control-slider-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.05em;
          color: var(--ds-fg-muted);
        }
        .slider-label {
          margin-right: auto;
        }
        .slider-value {
          color: var(--ds-accent);
        }
        .control-slider {
          width: 100%;
          height: 4px;
          background: var(--ds-border-muted);
          outline: none;
          accent-color: var(--ds-accent);
        }
        .vertical-divider {
          width: 1px;
          height: 36px;
          background: var(--ds-border-muted);
        }

        .cutter-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .clipper-btn {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.6);
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s;
        }
        .clipper-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }
        .clipper-axis-selector {
          display: flex;
          background: rgba(0,0,0,0.4);
          border-radius: 6px;
          padding: 2px;
        }
        .axis-btn {
          border: none;
          background: none;
          color: rgba(255,255,255,0.4);
          font-size: 0.58rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          cursor: pointer;
        }
        .axis-btn.active {
          background: var(--ds-accent);
          color: #000;
        }
        .control-slider-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .control-slider-inner .slider-value {
          font-size: 0.58rem;
          white-space: nowrap;
        }

        .anatomy-sidebar-right {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .anatomy-sidebar-right::-webkit-scrollbar {
          display: none;
        }

        .diagnostic-info-panel {
          height: 100%;
          min-height: 520px;
          border-radius: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .panel-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }
        .panel-close-btn:hover {
          color: #fff;
        }

        .diagnostic-info-panel.idle {
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
        }
        .idle-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .pulse-radar {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: radar-ping 3s infinite linear;
          pointer-events: none;
        }
        .idle-icon {
          font-size: 3rem;
          color: rgba(255, 255, 255, 0.12);
          margin-bottom: 1.5rem;
          z-index: 2;
        }
        .idle-indicator h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.88rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.7);
        }
        .idle-indicator p {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.6;
          max-width: 220px;
        }

        .diagnostic-info-panel.active {
          border-color: color-mix(in srgb, var(--organ-color) 25%, transparent);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px color-mix(in srgb, var(--organ-color) 4%, transparent);
          padding: 1.5rem;
        }

        .header-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .diagnostic-badge {
          font-size: 0.58rem;
          color: var(--organ-color);
          font-weight: 900;
          letter-spacing: 0.15em;
        }
        .favorite-toggle-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          font-size: 1.15rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .favorite-toggle-btn.active {
          color: #facc15;
          text-shadow: 0 0 8px rgba(250, 204, 21, 0.4);
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .organ-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--organ-color) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--organ-color) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .organ-avatar-emoji {
          font-size: 1.7rem;
        }
        .organ-name {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
          color: #fff;
        }
        .organ-coord {
          font-size: 0.58rem;
          color: rgba(255, 255, 255, 0.4);
          display: block;
          margin-top: 1px;
        }

        .diagnostic-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section-title {
          margin: 0;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.12em;
          font-weight: 800;
        }
        .organ-desc-text {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.6;
          color: var(--ds-fg-muted);
        }

        .detail-meta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 10px 14px;
        }
        .meta-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-cell-label {
          font-size: 0.55rem;
          color: var(--ds-fg-subtle);
          font-weight: 750;
        }
        .meta-cell-value {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
        }

        .telemetry-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .telemetry-bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .telemetry-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
        }
        .telemetry-stat-label {
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
        }
        .telemetry-stat-value {
          color: var(--organ-color);
          font-weight: 750;
        }
        .telemetry-track {
          width: 100%;
          height: 5px;
          border-radius: 100px;
          background: var(--ds-border-muted);
          overflow: hidden;
        }
        .telemetry-fill {
          height: 100%;
          border-radius: 100px;
          background: var(--organ-color);
          box-shadow: 0 0 6px var(--organ-color);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .notes-text {
          margin: 0;
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--ds-fg-subtle);
          font-style: italic;
        }

        .pathology-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pathology-tag {
          font-size: 0.62rem;
          color: var(--ds-fg-muted);
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 100px;
          padding: 4px 10px;
        }

        .isolate-btn {
          width: 100%;
          padding: 10px;
          border-radius: 100px;
          border: none;
          background: var(--organ-color);
          color: #020402;
          font-weight: 850;
          font-size: 0.75rem;
          cursor: pointer;
          box-shadow: 0 6px 20px color-mix(in srgb, var(--organ-color) 35%, transparent);
          transition: all 0.25s ease;
          letter-spacing: 0.05em;
          margin-top: auto;
        }
        .isolate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--organ-color) 45%, transparent);
          filter: brightness(1.15);
        }

        .specimen-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 2, 1, 0.98);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          backdrop-filter: blur(12px);
        }
        .specimen-modal-card {
          width: 100%;
          max-width: 1050px;
          height: 100%;
          max-height: 640px;
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modal-header {
          padding: 1.5rem 2.25rem;
          border-bottom: 1px solid var(--ds-border-muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-badge {
          font-size: 0.6rem;
          color: var(--ds-accent);
          font-weight: 900;
          letter-spacing: 0.25em;
        }
        .modal-title {
          margin: 4px 0 0 0;
          font-size: 1.65rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #fff;
        }
        .modal-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 18px;
          border-radius: 100px;
          cursor: pointer;
          font-size: 0.72rem;
          font-weight: 750;
          transition: all 0.2s;
        }
        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .modal-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 380px;
          overflow: hidden;
        }
        .modal-canvas-wrap {
          background: radial-gradient(circle at center, #050d0a, #010402);
          position: relative;
        }
        .modal-rotate-overlay {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          font-weight: 800;
          letter-spacing: 0.15em;
          pointer-events: none;
        }

        .modal-info-panel {
          padding: 2.25rem;
          border-left: 1px solid var(--ds-border-muted);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .modal-panel-heading {
          margin: 0;
          font-size: 0.75rem;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          font-weight: 800;
        }
        .modal-organ-desc {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--ds-fg-muted);
        }

        .modal-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .modal-stat-card {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-card-label {
          font-size: 0.6rem;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
        }
        .stat-card-value {
          font-size: 1.25rem;
          font-weight: 900;
        }

        .modal-fact-box {
          border: 1px solid;
          background: var(--ds-surface-subtle);
          padding: 14px;
          border-radius: 16px;
          display: flex;
          gap: 12px;
        }
        .fact-box-icon {
          font-size: 1.25rem;
        }
        .fact-box-text {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        .anatomy-canvas-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(5, 10, 5, 0.9);
          z-index: 10;
        }
        .glowing-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid var(--ds-border-muted);
          border-radius: 50%;
          border-top-color: var(--ds-accent);
          border-right-color: var(--ds-accent-muted);
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          box-shadow: var(--ds-glow-sm);
          margin-bottom: 20px;
        }
        .loading-text {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--ds-accent);
          letter-spacing: 0.15em;
          text-shadow: var(--ds-glow-sm);
          animation: blink 1.5s infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes radar-ping {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @media (max-width: 1100px) {
          .anatomy-main-layout {
            grid-template-columns: 290px 1fr;
            grid-template-rows: auto 1fr;
          }
          .anatomy-sidebar-right {
            grid-column: 1 / -1;
            height: auto;
          }
          .diagnostic-info-panel {
            min-height: auto;
          }
        }
        @media (max-width: 768px) {
          .anatomy-main-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 400px auto;
            padding: 0.75rem;
            gap: 0.75rem;
          }
          .anatomy-sidebar-left {
            grid-row: 2;
          }
          .anatomy-canvas-container {
            grid-row: 1;
            height: 380px;
          }
          .anatomy-sidebar-right {
            grid-row: 3;
          }
          .anatomy-header {
            flex-direction: column;
            gap: 12px;
            padding: 1rem;
          }
          .header-left {
            width: 100%;
            justify-content: space-between;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          .specimen-modal-overlay {
            padding: 1rem;
          }
          .modal-body {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
          }
          .modal-info-panel {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 1.25rem;
          }
        }

        .medical-label {
          background: rgba(1, 4, 1, 0.95);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5), var(--ds-glow-sm);
          letter-spacing: 0.05em;
          pointer-events: none;
          transform: translate(-50%, -100%);
        }
      `}</style>
    </div>
  )
}
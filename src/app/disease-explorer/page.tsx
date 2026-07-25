'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BackLink } from '@/components/ds'

interface DiseaseData {
  id: string
  name: string
  category: string
  cause: string
  emoji: string
  affectedOrgans: string[]
  symptoms: string[]
  treatments: string[]
  notes: string
  prognosis: string
}

const DISEASE_DATA: DiseaseData[] = [
  {
    id: 'malaria',
    name: 'Malaria',
    category: 'Infectious',
    cause: 'Plasmodium Parasite (via Anopheles Mosquito)',
    emoji: '🦟',
    affectedOrgans: ['liver', 'blood'],
    symptoms: ['High fever', 'Severe chills', 'Sweating', 'Anemia (RBC lysis)', 'Enlarged spleen'],
    treatments: ['Artemisinin-based therapies (ACTs)', 'Chloroquine', 'Mosquito net prevention', 'Antimalarial prophylaxis'],
    notes: 'Transmitted by the bite of an infected female Anopheles mosquito. The Plasmodium sporozoites migrate to the liver where they mature and multiply, eventually releasing merozoites into the bloodstream to invade and rupture red blood cells.',
    prognosis: 'Highly curable if treated early, but can lead to cerebral malaria or renal failure if left untreated.'
  },
  {
    id: 'influenza',
    name: 'Influenza (Flu)',
    category: 'Infectious',
    cause: 'Influenza Virus (Type A or B)',
    emoji: '🤒',
    affectedOrgans: ['lungs', 'throat', 'nose'],
    symptoms: ['Sudden high fever', 'Dry cough', 'Sore throat', 'Severe muscle aches', 'Fatigue and chills'],
    treatments: ['Rest and hydration', 'Antivirals (Oseltamivir/Tamiflu)', 'Annual seasonal flu vaccine'],
    notes: 'An acute, highly contagious viral infection that attacks the respiratory epithelial cells. Spreads through airborne droplets from coughing and sneezing, leading to seasonal epidemics.',
    prognosis: 'Self-limiting in most healthy individuals (7-10 days), but can cause viral pneumonia in high-risk groups.'
  },
  {
    id: 'cystic_fibrosis',
    name: 'Cystic Fibrosis',
    category: 'Genetic',
    cause: 'CFTR Gene Mutation (Autosomal Recessive)',
    emoji: '🧬',
    affectedOrgans: ['lungs', 'pancreas'],
    symptoms: ['Thick sticky mucus', 'Chronic dry cough', 'Salty-tasting skin', 'Frequent lung infections', 'Malabsorption of nutrients'],
    treatments: ['CFTR Modulators (Ivacaftor)', 'Chest physical therapy', 'Inhaled bronchodilators', 'Pancreatic enzyme supplements'],
    notes: 'A mutation in the CFTR gene disrupts chloride ion transport across membranes. The lack of water draws mucus dry and sticky, clogging the airways of the lungs and the ducts of the pancreas.',
    prognosis: 'A progressive, life-limiting disorder. Modern CFTR modulator therapies have dramatically raised life expectancy into the 40s and 50s.'
  },
  {
    id: 'coronary_artery_disease',
    name: 'Coronary Artery Disease',
    category: 'Cardiovascular',
    cause: 'Atherosclerosis (Cholesterol Plaque build-up)',
    emoji: '🫀',
    affectedOrgans: ['heart'],
    symptoms: ['Chest pain (Angina)', 'Shortness of breath', 'Extreme fatigue during exertion', 'Myocardial infarction (Heart attack)'],
    treatments: ['Statins (cholesterol lowering)', 'Beta-blockers', 'Angioplasty with stent placement', 'Coronary bypass surgery (CABG)'],
    notes: 'Occurs when lipid-rich plaques accumulate inside the coronary arteries (atherosclerosis). The plaque narrows the lumen, restricting oxygenated blood flow to the cardiac muscle tissue.',
    prognosis: 'Manageable with lifestyle changes and surgical intervention, but remains a leading cause of global cardiovascular mortality.'
  },
  {
    id: 'type_1_diabetes',
    name: 'Type 1 Diabetes',
    category: 'Autoimmune',
    cause: 'T-cell-mediated destruction of pancreatic Beta cells',
    emoji: '🩸',
    affectedOrgans: ['pancreas', 'blood'],
    symptoms: ['Polydipsia (extreme thirst)', 'Polyuria (frequent urination)', 'Weight loss despite hunger', 'Diabetic ketoacidosis (DKA)'],
    treatments: ['Exogenous insulin therapy', 'Continuous glucose monitoring', 'Carbohydrate counting'],
    notes: 'An autoimmune disease where the body\'s cytotoxic T-lymphocytes target and destroy the insulin-producing beta cells in the pancreatic islets of Langerhans, leading to absolute insulin deficiency.',
    prognosis: 'Requires lifelong daily insulin administration. Proper glucose control prevents long-term vascular and kidney damage.'
  },
  {
    id: 'rheumatoid_arthritis',
    name: 'Rheumatoid Arthritis',
    category: 'Autoimmune',
    cause: 'Autoimmune attack on Joint Synovium',
    emoji: '🦴',
    affectedOrgans: ['joints'],
    symptoms: ['Symmetric joint pain', 'Swelling and warmth', 'Morning stiffness (>1 hour)', 'Joint deformity over time'],
    treatments: ['DMARDs (Methotrexate)', 'NSAIDs for pain', 'Anti-TNF biologics', 'Regular low-impact exercise'],
    notes: 'The immune system mistakenly targets the synovial membrane surrounding joints, causing chronic inflammation, pannus formation, and eventual destruction of joint cartilage and bone.',
    prognosis: 'Chronic progressive course. Early aggressive treatment with DMARDs can achieve clinical remission and protect joint structure.'
  },
  {
    id: 'asthma',
    name: 'Asthma',
    category: 'Respiratory',
    cause: 'Bronchial Hypersensitivity & Inflammation',
    emoji: '🫁',
    affectedOrgans: ['lungs'],
    symptoms: ['Expiratory wheezing', 'Shortness of breath', 'Chest tightness', 'Nighttime coughing fits'],
    treatments: ['Inhaled Corticosteroids (preventer)', 'Albuterol inhalers (rescue)', 'Allergen immunotherapy'],
    notes: 'A chronic condition characterized by hyper-responsive airways. Environmental triggers (pollen, cold air, exercise) cause smooth muscle spasms around bronchioles, swelling of the lining, and excess mucus.',
    prognosis: 'Excellent prognosis with proper inhaler compliance. Can be controlled to allow normal athletic activity.'
  },
  {
    id: 'hepatitis_b',
    name: 'Hepatitis B',
    category: 'Infectious',
    cause: 'Hepatitis B Virus (HBV)',
    emoji: '🟡',
    affectedOrgans: ['liver'],
    symptoms: ['Jaundice (yellow skin/eyes)', 'Dark tea-colored urine', 'Abdominal discomfort', 'Chronic liver cirrhosis'],
    treatments: ['Antiviral medications (Tenofovir)', 'Interferon injections', 'HBV preventative vaccine'],
    notes: 'A DNA virus that infects hepatocytes, leading to acute liver inflammation. Chronic infections can lead to hepatocyte death, replacement by fibrous scar tissue (cirrhosis), and liver cancer.',
    prognosis: 'Acute cases resolve spontaneously in 95% of adults. Chronic infection requires long-term viral load management.'
  },
  {
    id: 'parkinsons_disease',
    name: 'Parkinson\'s Disease',
    category: 'Neurological',
    cause: 'Degeneration of Dopaminergic Neurons',
    emoji: '🧠',
    affectedOrgans: ['brain'],
    symptoms: ['Resting tremors (pill-rolling)', 'Muscle rigidity', 'Bradykinesia (slow movement)', 'Postural instability'],
    treatments: ['Levodopa / Carbidopa', 'Dopamine agonists', 'Deep Brain Stimulation (DBS) surgery'],
    notes: 'Characterized by the progressive loss of dopamine-producing neurons in the substantia nigra of the midbrain. The lack of dopamine disrupts the basal ganglia motor control loops.',
    prognosis: 'Slowly progressive. Symptoms can be well-managed for many years with dopaminergic therapies and surgical options.'
  },
  {
    id: 'alzheimers_disease',
    name: 'Alzheimer\'s Disease',
    category: 'Neurological',
    cause: 'Amyloid-Beta Plaques & Tau Tangles',
    emoji: '👵',
    affectedOrgans: ['brain'],
    symptoms: ['Severe short-term memory loss', 'Cognitive confusion', 'Spatial disorientation', 'Personality shifts'],
    treatments: ['Cholinesterase inhibitors (Donepezil)', 'NMDA receptor antagonists (Memantine)', 'Monoclonal antibodies (Lecanemab)'],
    notes: 'A neurodegenerative disorder marked by extracellular accumulation of amyloid-beta plaques and intracellular neurofibrillary tangles of hyperphosphorylated tau proteins, causing synaptic failure and brain atrophy.',
    prognosis: 'Terminal progressive disease, but modern therapies aim to slow the rate of cognitive decline in early stages.'
  }
]

export default function DiseaseExplorer() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('malaria')
  const [speakingId, setSpeakingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = ['All', 'Infectious', 'Genetic', 'Cardiovascular', 'Autoimmune', 'Respiratory', 'Neurological']

  const activeDisease = useMemo(() => {
    return DISEASE_DATA.find(d => d.id === selectedDiseaseId) || DISEASE_DATA[0]
  }, [selectedDiseaseId])

  const filteredDiseases = useMemo(() => {
    return DISEASE_DATA.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleSpeak = (d: DiseaseData) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (speakingId === d.id) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()
    const text = `${d.name}. A ${d.category} condition caused by ${d.cause}. ${d.notes}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)

    setSpeakingId(d.id)
    window.speechSynthesis.speak(utterance)
  }

  // Helper to determine if an organ is affected by the selected disease
  const isOrganAffected = (organ: string) => {
    return activeDisease.affectedOrgans.includes(organ)
  }

  return (
    <div className="disease-root">
      <div className="disease-grid-bg" />
      <div className="disease-glow-effect" />

      {/* HEADER */}
      <header className="disease-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">DISEASE PATHOLOGY EXPLORER</h1>
            <p className="header-subtitle">DIAGNOSTIC MECHANISMS & ANATOMY MAP</p>
          </div>
        </div>
      </header>

      {/* MAIN DIAGNOSTIC GRID */}
      <main className="disease-main-layout">
        {/* LEFT COLUMN: Search & Diseases index list */}
        <section className="disease-sidebar-left">
          <div className="panel-card glassmorphic search-panel-card">
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search disease, cause, or symptom..."
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
          </div>

          <div className="category-scroll-wrap" data-lenis-prevent>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="disease-list-scroller" data-lenis-prevent>
            <div className="scroller-inner">
              {filteredDiseases.length > 0 ? (
                filteredDiseases.map(disease => {
                  const isCurrent = disease.id === activeDisease.id
                  return (
                    <button
                      key={disease.id}
                      onClick={() => setSelectedDiseaseId(disease.id)}
                      className={`disease-row-card ${isCurrent ? 'active' : ''}`}
                    >
                      <div className="disease-card-header">
                        <span className="disease-card-name">{disease.emoji} {disease.name}</span>
                        <span className="disease-card-category">{disease.category}</span>
                      </div>
                      <p className="disease-card-cause">{disease.cause}</p>
                    </button>
                  )
                })
              ) : (
                <div className="no-results-card glassmorphic">
                  <p>No matching pathology specimens found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CENTER COLUMN: Pathology mechanism diagrams and Anatomical affected map */}
        <section className="disease-panel-center">
          {/* Anatomical Affected Organ Highlights */}
          <div className="panel-card glassmorphic anatomy-map-card">
            <h3 className="panel-section-title">Anatomical System Affections</h3>
            
            <div className="anatomy-viewport-wrap">
              {/* Simplified Human Body SVG */}
              <svg className="human-body-svg" viewBox="0 0 120 220" width="100%" height="100%">
                <defs>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Body Outline */}
                <path
                  d="M 60 15 
                     C 52 15 48 24 48 32 C 48 40 52 46 54 48 
                     C 51 50 48 54 44 58 L 25 80 C 20 86 24 95 30 92 L 45 84 L 45 130 
                     L 38 200 C 36 208 46 212 48 202 L 56 145 L 60 145 L 64 145 L 72 202 
                     C 74 212 84 208 82 200 L 75 130 L 75 84 L 90 92 C 96 95 100 86 95 80 
                     L 76 58 C 72 54 69 50 66 48 C 68 46 72 40 72 32 C 72 24 68 15 60 15 Z"
                  fill="rgba(57, 255, 20, 0.03)"
                  stroke="rgba(57, 255, 20, 0.2)"
                  strokeWidth="1.5"
                />

                {/* BRAIN */}
                <circle
                  cx="60"
                  cy="26"
                  r="6"
                  fill={isOrganAffected('brain') ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                  stroke={isOrganAffected('brain') ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1"
                  filter={isOrganAffected('brain') ? 'url(#glow-red)' : ''}
                  className={isOrganAffected('brain') ? 'pulse-organ' : ''}
                />
                <text x="60" y="28" fill="#fff" fontSize="4.5" textAnchor="middle" fontWeight="bold" pointerEvents="none">🧠</text>

                {/* LUNGS / THROAT / NOSE */}
                {(isOrganAffected('lungs') || isOrganAffected('throat') || isOrganAffected('nose')) && (
                  <g filter="url(#glow-red)">
                    {/* Left Lung */}
                    <path d="M 52 62 C 46 62 44 72 48 80 C 52 82 55 76 55 70 Z" fill="#ef4444" opacity="0.8" />
                    {/* Right Lung */}
                    <path d="M 68 62 C 74 62 76 72 72 80 C 68 82 65 76 65 70 Z" fill="#ef4444" opacity="0.8" />
                    {/* Trachea line */}
                    <line x1="60" y1="46" x2="60" y2="62" stroke="#ef4444" strokeWidth="1.5" />
                  </g>
                )}

                {/* HEART */}
                <path
                  d="M 60 69 C 59 66 56 66 55 68 C 54 70 57 74 60 76 C 63 74 66 70 65 68 C 64 66 61 66 60 69 Z"
                  fill={isOrganAffected('heart') ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                  stroke={isOrganAffected('heart') ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="0.8"
                  filter={isOrganAffected('heart') ? 'url(#glow-red)' : ''}
                  className={isOrganAffected('heart') ? 'pulse-organ' : ''}
                />

                {/* LIVER */}
                <path
                  d="M 48 88 L 58 88 L 56 96 Z"
                  fill={isOrganAffected('liver') ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                  stroke={isOrganAffected('liver') ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="0.8"
                  filter={isOrganAffected('liver') ? 'url(#glow-red)' : ''}
                  className={isOrganAffected('liver') ? 'pulse-organ' : ''}
                />

                {/* PANCREAS */}
                <rect
                  x="51"
                  y="99"
                  width="18"
                  height="4"
                  rx="1.5"
                  fill={isOrganAffected('pancreas') ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                  stroke={isOrganAffected('pancreas') ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="0.8"
                  filter={isOrganAffected('pancreas') ? 'url(#glow-red)' : ''}
                  className={isOrganAffected('pancreas') ? 'pulse-organ' : ''}
                />

                {/* JOINTS (Elbows/Knees glowing) */}
                {isOrganAffected('joints') && (
                  <g filter="url(#glow-red)" fill="#ef4444">
                    {/* Left Elbow */}
                    <circle cx="34" cy="80" r="3" />
                    {/* Right Elbow */}
                    <circle cx="86" cy="80" r="3" />
                    {/* Left Knee */}
                    <circle cx="48" cy="145" r="3" />
                    {/* Right Knee */}
                    <circle cx="72" cy="145" r="3" />
                  </g>
                )}

                {/* BLOOD VASCULAR TREE */}
                {isOrganAffected('blood') && (
                  <g stroke="#ef4444" strokeWidth="0.8" fill="none" opacity="0.6" filter="url(#glow-red)">
                    <path d="M 60 76 L 60 120 M 60 85 L 34 80 M 60 85 L 86 80 M 60 120 L 48 145 M 60 120 L 72 145" />
                  </g>
                )}
              </svg>

              {/* Legend checklist */}
              <div className="anatomy-legend">
                <span className="legend-header">DIAGNOSTIC TARGETS:</span>
                {[
                  { key: 'brain', label: 'Cerebral Cortex (Brain)' },
                  { key: 'lungs', label: 'Pulmonary Lobes (Lungs)' },
                  { key: 'heart', label: 'Cardiac Vessel (Heart)' },
                  { key: 'liver', label: 'Hepatic Lobe (Liver)' },
                  { key: 'pancreas', label: 'Islets Pancreas' },
                  { key: 'joints', label: 'Synovial Joint Cartilage' },
                  { key: 'blood', label: 'Hematopoietic System' }
                ].map(org => {
                  const affected = isOrganAffected(org.key)
                  return (
                    <div key={org.key} className={`legend-row ${affected ? 'affected' : ''}`}>
                      <span className="legend-indicator" />
                      <span className="legend-label-text">{org.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Molecular mechanism interactive SVG diagram */}
          <div className="panel-card glassmorphic mechanism-diagram-card">
            <h3 className="panel-section-title">Microscopic Pathology Diagram</h3>

            <div className="diagram-viewport">
              {activeDisease.id === 'coronary_artery_disease' && (
                /* Atherosclerosis SVG */
                <svg viewBox="0 0 200 120" width="100%" height="100%">
                  {/* Artery Walls */}
                  <rect x="10" y="20" width="180" height="80" rx="6" fill="rgba(239, 68, 68, 0.05)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2.5" />
                  
                  {/* Plaque build-up (Yellow lipid block) */}
                  <path d="M 40 100 Q 100 50 160 100 Z" fill="#eab308" opacity="0.95" stroke="#ca8a04" strokeWidth="1" />
                  <text x="100" y="88" fill="#fff" fontSize="6.5" textAnchor="middle" fontWeight="bold">CHOLESTEROL PLAQUE</text>

                  {/* Red Blood Cells squeezing through narrow corridor */}
                  <g>
                    <circle cx="25" cy="60" r="4" fill="#ef4444" />
                    <circle cx="35" cy="50" r="4.5" fill="#ef4444" />
                    {/* Narrow neck squeeze */}
                    <ellipse cx="100" cy="38" rx="4" ry="2.2" fill="#ef4444" />
                    <circle cx="155" cy="58" r="4.5" fill="#ef4444" />
                    <circle cx="170" cy="62" r="4" fill="#ef4444" />
                  </g>
                  <text x="100" y="32" fill="#3b82f6" fontSize="5" textAnchor="middle" fontWeight="bold">Restricted Blood Flow</text>
                </svg>
              )}

              {activeDisease.id === 'cystic_fibrosis' && (
                /* CFTR Mucus Occlusion */
                <svg viewBox="0 0 200 120" width="100%" height="100%">
                  {/* Cell Membrane bilayer */}
                  <line x1="10" y1="40" x2="190" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <line x1="10" y1="80" x2="190" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  
                  {/* Clogged CFTR Protein Channel */}
                  <rect x="80" y="32" width="40" height="56" rx="4" fill="#10b981" opacity="0.8" />
                  <line x1="100" y1="32" x2="100" y2="88" stroke="#047857" strokeWidth="2.5" />
                  
                  {/* Sticky Green Mucus blocking the pore */}
                  <circle cx="100" cy="28" r="9" fill="#047857" opacity="0.9" />
                  <circle cx="94" cy="26" r="6" fill="#047857" opacity="0.9" />
                  <circle cx="106" cy="29" r="7" fill="#047857" opacity="0.9" />
                  <text x="100" y="21" fill="#10b981" fontSize="6.5" textAnchor="middle" fontWeight="bold">STICKY MUCUS</text>
                  
                  {/* Blocked Chloride Ions (Cl-) */}
                  <circle cx="100" cy="74" r="3" fill="#a855f7" />
                  <text x="100" y="70" fill="#a855f7" fontSize="5" textAnchor="middle" fontWeight="bold">Cl-</text>
                  <path d="M 100 64 L 100 52 M 97 56 L 100 52 L 103 56" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="100" y="49" fill="#ef4444" fontSize="5" textAnchor="middle" fontWeight="bold">BLOCKED</text>
                </svg>
              )}

              {activeDisease.id === 'malaria' && (
                /* Plasmodium invasion of RBC */
                <svg viewBox="0 0 200 120" width="100%" height="100%">
                  {/* Red Blood Cell */}
                  <circle cx="100" cy="60" r="38" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="2" />
                  <text x="100" y="90" fill="#ef4444" fontSize="6" textAnchor="middle" fontWeight="bold">ERYTHROCYTE (RBC)</text>
                  
                  {/* Plasmodium Merozoites invading */}
                  <g>
                    {/* Ring stage inside cell */}
                    <circle cx="90" cy="50" r="4" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="93" cy="48" r="1.5" fill="#eab308" />
                    <text x="90" y="42" fill="#a855f7" fontSize="5.5" textAnchor="middle" fontWeight="bold">Ring Stage</text>

                    {/* Merozoite entering cell */}
                    <path d="M 130 38 Q 120 44 114 48 Z" fill="#a855f7" stroke="#fff" strokeWidth="0.5" />
                    <circle cx="130" cy="38" r="2.5" fill="#a855f7" />
                    <text x="136" y="32" fill="#a855f7" fontSize="5" textAnchor="middle" fontWeight="bold">Merozoite</text>
                  </g>
                </svg>
              )}

              {activeDisease.id === 'type_1_diabetes' && (
                /* Autoimmune destruction of beta cells */
                <svg viewBox="0 0 200 120" width="100%" height="100%">
                  {/* Pancreatic Beta Cell (lysing) */}
                  <path d="M 60 30 Q 110 32 100 80 Q 90 90 60 85 Q 40 80 44 50 Z" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 2" />
                  <text x="70" y="60" fill="#3b82f6" fontSize="6" textAnchor="middle" fontWeight="bold">BETA CELL (Islet)</text>

                  {/* Cytotoxic T-Cell attacking */}
                  <circle cx="140" cy="60" r="22" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2" />
                  <text x="140" y="62" fill="#a855f7" fontSize="5.5" textAnchor="middle" fontWeight="bold">T-LYMPHOCYTE</text>

                  {/* Receptors / Perforin attack */}
                  <line x1="118" y1="60" x2="102" y2="60" stroke="#a855f7" strokeWidth="2.5" />
                  <circle cx="102" cy="60" r="2.5" fill="#ef4444" className="animate-pulse" />
                  <text x="110" y="54" fill="#ef4444" fontSize="5" textAnchor="middle" fontWeight="bold">Lysis</text>
                </svg>
              )}

              {/* Fallback general schematic for other diseases */}
              {!['coronary_artery_disease', 'cystic_fibrosis', 'malaria', 'type_1_diabetes'].includes(activeDisease.id) && (
                <div className="fallback-schematic-wrap">
                  <span className="fallback-emoji">{activeDisease.emoji}</span>
                  <p className="fallback-text">Cytopathology scan logged for {activeDisease.name}. Active target is {activeDisease.cause}.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Specimen diagnostics card */}
        <section className="disease-sidebar-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDisease.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="panel-card glassmorphic diagnostic-details-card"
            >
              <div className="specimen-header-row">
                <span className="specimen-badge">Specimen Scan Log</span>
                <button
                  onClick={() => handleSpeak(activeDisease)}
                  className={`audio-btn ${speakingId === activeDisease.id ? 'speaking' : ''}`}
                  title="Speak Diagnostics"
                >
                  {speakingId === activeDisease.id ? '🔇 Stop' : '🔊 Pronounce'}
                </button>
              </div>

              <h2 className="specimen-title">{activeDisease.name}</h2>
              <span className="specimen-sub-cause">Target: {activeDisease.cause}</span>
              
              <div className="specimen-divider" />

              <div className="specimen-body-content">
                <div className="specimen-section">
                  <span className="section-header-small">Pathophysiology Notes</span>
                  <p className="notes-text">{activeDisease.notes}</p>
                </div>

                <div className="specimen-section">
                  <span className="section-header-small">Clinical Symptoms</span>
                  <div className="tag-chips-row">
                    {activeDisease.symptoms.map((sym, idx) => (
                      <span key={idx} className="tag-chip symptom-chip">
                        ⚠️ {sym}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="specimen-section">
                  <span className="section-header-small">Treatment Protocols</span>
                  <div className="tag-chips-row">
                    {activeDisease.treatments.map((treat, idx) => (
                      <span key={idx} className="tag-chip treatment-chip">
                        💊 {treat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="specimen-section">
                  <span className="section-header-small">Clinical Prognosis</span>
                  <p className="prognosis-text">{activeDisease.prognosis}</p>
                </div>

                <div className="specimen-section" style={{ marginTop: '12px' }}>
                  <Link href={`/disease-explorer/${activeDisease.id}`} className="launch-clinical-engine-btn">
                    🩺 Open Deep Clinical Learning Engine →
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <style jsx global>{`
        .disease-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
          font-family: inherit;
        }

        .disease-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .disease-glow-effect {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: min(800px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .disease-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem 0.5rem;
          border-bottom: 1px solid var(--ds-border-muted);
          position: relative;
          z-index: 2;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          color: var(--ds-accent);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 8px;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(57, 255, 20, 0.12);
          box-shadow: var(--ds-glow-sm);
        }

        .divider-line {
          width: 1px;
          height: 32px;
          background: var(--ds-border-muted);
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: 0.03em;
        }

        .header-subtitle {
          font-size: 0.6rem;
          color: var(--ds-accent);
          margin: 0;
          letter-spacing: 0.25em;
          font-weight: 700;
        }

        /* LANDING SELECTION PANEL */
        .sim-selection-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 2rem;
          position: relative;
          z-index: 2;
        }

        .selection-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .selection-header h2 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
        }

        .selection-header p {
          color: var(--ds-fg-muted);
          font-size: 0.9rem;
        }

        .sim-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .sim-select-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.25s ease;
          border-color: var(--ds-border-muted);
        }

        .sim-select-card:hover {
          border-color: var(--ds-accent);
          transform: translateY(-2px);
          box-shadow: var(--ds-glow-sm);
        }

        .card-emoji {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .card-category {
          background: var(--ds-surface-subtle);
          color: var(--ds-accent);
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 6px 0;
        }

        .card-desc {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ds-fg-muted);
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .launch-sim-btn {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .launch-sim-btn:hover {
          background: rgba(57, 255, 20, 0.15);
          box-shadow: var(--ds-glow-sm);
        }

        /* DISEASE MAIN WORKSPACE */
        .disease-main-layout {
          display: grid;
          grid-template-columns: 350px 1fr 360px;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .disease-sidebar-left,
        .disease-panel-center,
        .disease-sidebar-right {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        .panel-card {
          border-radius: 16px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(12px);
          box-sizing: border-box;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .search-panel-card {
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }

        .search-bar-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-icon {
          font-size: 0.95rem;
          color: var(--ds-fg-subtle);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--ds-fg);
          font-size: 0.85rem;
          padding: 4px 0;
        }

        .search-input::placeholder {
          color: var(--ds-fg-subtle);
        }

        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--ds-fg-muted);
          cursor: pointer;
          font-size: 0.85rem;
          padding: 4px;
          transition: color 0.2s;
        }

        .clear-search-btn:hover {
          color: var(--ds-accent);
        }

        .category-scroll-wrap {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          margin-bottom: 0.75rem;
          padding-bottom: 4px;
          flex-shrink: 0;
          scrollbar-width: none;
        }

        .category-scroll-wrap::-webkit-scrollbar {
          display: none;
        }

        .category-pill-btn {
          flex-shrink: 0;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .category-pill-btn:hover {
          color: #fff;
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent-muted);
        }

        .category-pill-btn.active {
          color: var(--ds-accent);
          background: var(--ds-accent-subtle);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .disease-list-scroller {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 2px;
        }

        .disease-list-scroller::-webkit-scrollbar {
          width: 4px;
        }

        .disease-list-scroller::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .scroller-inner {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .disease-row-card {
          width: 100%;
          text-align: left;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .disease-row-card:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent);
          transform: translateY(-1px);
        }

        .disease-row-card.active {
          background: rgba(239, 68, 68, 0.03);
          border-color: rgba(239, 68, 68, 0.25);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .disease-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .disease-card-name {
          font-weight: 700;
          color: var(--ds-fg);
          font-size: 0.88rem;
        }

        .disease-row-card.active .disease-card-name {
          color: #ef4444;
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.25);
        }

        .disease-card-category {
          font-size: 0.58rem;
          text-transform: uppercase;
          background: var(--ds-surface-raised);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--ds-fg-muted);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .disease-card-cause {
          margin: 0;
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .no-results-card {
          text-align: center;
          padding: 2rem;
          color: var(--ds-fg-subtle);
          font-size: 0.78rem;
        }

        /* CENTER COLUMN PANELS */
        .anatomy-map-card {
          flex: 1.2;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .panel-section-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .anatomy-viewport-wrap {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          min-height: 0;
        }

        .human-body-svg {
          background: var(--ds-surface-raised);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          filter: drop-shadow(0 0 15px rgba(57, 255, 20, 0.03));
        }

        .pulse-organ {
          animation: pulse-organ-glow 1.5s infinite alternate;
        }

        @keyframes pulse-organ-glow {
          0% { opacity: 0.6; }
          100% { opacity: 1.0; }
        }

        .anatomy-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }

        .legend-header {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0.3;
          transition: all 0.3s;
        }

        .legend-row.affected {
          opacity: 1;
        }

        .legend-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s;
        }

        .legend-row.affected .legend-indicator {
          background: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 0 8px #ef4444;
        }

        .legend-label-text {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
        }

        .legend-row.affected .legend-label-text {
          color: #fff;
          font-weight: 600;
        }

        /* MECHANISM DIAGRAM CARD */
        .mechanism-diagram-card {
          flex: 1;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .diagram-viewport {
          flex: 1;
          background: var(--ds-surface-raised);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }

        .fallback-schematic-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 2rem;
          text-align: center;
        }

        .fallback-emoji {
          font-size: 2.25rem;
        }

        .fallback-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          line-height: 1.5;
          margin: 0;
        }

        /* DIAGNOSTIC DETAILS SIDEBAR (RIGHT) */
        .diagnostic-details-card {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .diagnostic-details-card::-webkit-scrollbar {
          width: 4px;
        }

        .diagnostic-details-card::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .specimen-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .specimen-badge {
          font-size: 0.58rem;
          font-weight: 800;
          color: #ef4444;
          letter-spacing: 0.15em;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(239, 68, 68, 0.05);
          text-transform: uppercase;
        }

        .audio-btn {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .audio-btn:hover {
          color: #fff;
          background: var(--ds-surface-raised);
        }

        .audio-btn.speaking {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
          animation: pulse-audio 1.5s infinite alternate;
        }

        @keyframes pulse-audio {
          0% { transform: scale(1); }
          100% { transform: scale(1.04); }
        }

        .specimen-title {
          font-size: 1.65rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 4px 0;
          letter-spacing: -0.01em;
        }

        .specimen-sub-cause {
          font-size: 0.78rem;
          color: var(--ds-fg-subtle);
          line-height: 1.4;
        }

        .specimen-divider {
          height: 1px;
          background: var(--ds-border-muted);
          margin: 1.25rem 0;
        }

        .specimen-body-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .specimen-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-header-small {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .notes-text, .prognosis-text {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.55;
          color: var(--ds-fg-muted);
        }

        .tag-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag-chip {
          font-size: 0.68rem;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .symptom-chip {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        .treatment-chip {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }

        .launch-clinical-engine-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          padding: 12px;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 850;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: var(--ds-glow-sm);
          box-sizing: border-box;
        }
        .launch-clinical-engine-btn:hover {
          transform: translateY(-2px);
          background: #45ff24;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1100px) {
          .disease-main-layout {
            grid-template-columns: 320px 1fr;
            grid-template-rows: auto auto auto;
            height: auto;
            overflow-y: auto;
          }
          .disease-sidebar-right {
            grid-column: 1 / -1;
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .disease-main-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto;
            padding: 1rem;
            gap: 1rem;
          }
          .disease-sidebar-left {
            height: 380px;
          }
          .disease-panel-center {
            height: auto;
          }
          .anatomy-map-card {
            height: 320px;
          }
          .anatomy-viewport-wrap {
            grid-template-columns: 1fr;
          }
          .anatomy-legend {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 6px;
          }
          .mechanism-diagram-card {
            height: 240px;
          }
          .disease-sidebar-right {
            height: auto;
          }
          .disease-header {
            padding: 1rem;
          }
          .specimen-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  )
}

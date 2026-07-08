'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BackLink } from '@/components/ds'

interface DictionaryTerm {
  id: string
  name: string
  phonetic: string
  category: string
  shortDef: string
  longDef: string
  pronunciationHint: string
  related: string[]
  facts: string[]
}

const DICTIONARY_DATA: DictionaryTerm[] = [
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    phonetic: '/ˌmaɪ.toʊˈkɒn.dri.ə/',
    category: 'Cell Biology',
    shortDef: 'Double-membraned cell organelles responsible for generating the majority of cellular energy in the form of ATP.',
    longDef: 'Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell\'s biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP). Mitochondria contain their own small genome (mtDNA) and replicate independently of the host cell, supporting the endosymbiotic theory of organelle origin.',
    pronunciationHint: 'my-toe-KON-dree-uh',
    related: ['atp', 'ribosome', 'eukaryote'],
    facts: [
      'Often called the "powerhouse of the cell".',
      'Contains an outer membrane, an inner folded membrane called cristae, and a central matrix.',
      'Inherited maternally in most multicellular organisms.'
    ]
  },
  {
    id: 'atp',
    name: 'Adenosine Triphosphate (ATP)',
    phonetic: '/əˈdɛn.ə.siːn traɪˈfɒs.feɪt/',
    category: 'Cell Biology',
    shortDef: 'The primary energy currency molecule used by cells to perform biological work.',
    longDef: 'Adenosine triphosphate (ATP) is an organic compound and hydrotrope that provides energy to drive many processes in living cells, such as muscle contraction, nerve impulse propagation, condensate dissolution, and chemical synthesis. Found in all known forms of life, ATP is often referred to as the "molecular unit of currency" of intracellular energy transfer.',
    pronunciationHint: 'uh-DEN-uh-seen try-FOS-fate',
    related: ['mitochondria', 'homeostasis'],
    facts: [
      'Releases energy when hydrolyzed into ADP and an inorganic phosphate group.',
      'Constantly recycled in cells; humans turn over their body weight in ATP daily.',
      'Synthesized by the ATP Synthase enzyme in the mitochondria.'
    ]
  },
  {
    id: 'ribosome',
    name: 'Ribosome',
    phonetic: '/ˈraɪ.bə.soʊm/',
    category: 'Cell Biology',
    shortDef: 'A cellular structure composed of RNA and protein that serves as the site of protein synthesis.',
    longDef: 'Ribosomes are macromolecular machines found within all living cells, that perform biological protein synthesis. Ribosomes link amino acids together in the order specified by the codons of messenger RNA (mRNA) molecules to generate polypeptide chains. They consist of two major subunits: the small ribosomal subunit, which reads the mRNA, and the large subunit, which joins amino acids.',
    pronunciationHint: 'RY-buh-sohm',
    related: ['rna', 'dna', 'mitochondria'],
    facts: [
      'Can float freely in the cytoplasm or be bound to the Rough Endoplasmic Reticulum.',
      'Discovered by George Palade in the mid-1950s (Nobel Prize in 1974).',
      'Crucial target for many commercial antibiotics.'
    ]
  },
  {
    id: 'eukaryote',
    name: 'Eukaryote',
    phonetic: '/juːˈkær.i.oʊt/',
    category: 'Cell Biology',
    shortDef: 'An organism whose cells contain a distinct, membrane-bound nucleus and other specialized organelles.',
    longDef: 'Eukaryotes are organisms whose cells contain complex structures enclosed within membranes. The defining membrane-bound structure that sets eukaryotic cells apart from prokaryotic cells is the nucleus. Eukaryotic cells also contain other membrane-bound organelles, such as mitochondria, chloroplasts, and the Golgi apparatus, allowing compartmentalization of biological processes.',
    pronunciationHint: 'yoo-KARY-oat',
    related: ['prokaryote', 'mitochondria', 'dna'],
    facts: [
      'Includes all plants, animals, fungi, and protists.',
      'Usually much larger and more complex than prokaryotic cells.',
      'Evolved approximately 1.5 to 2 billion years ago.'
    ]
  },
  {
    id: 'prokaryote',
    name: 'Prokaryote',
    phonetic: '/proʊˈkær.i.oʊt/',
    category: 'Cell Biology',
    shortDef: 'A single-celled organism that lacks a membrane-bound nucleus and membrane-bound organelles.',
    longDef: 'A prokaryote is a single-celled organism that lacks a nucleus and other membrane-bound organelles. Prokaryotes are divided into two main domains: Bacteria and Archaea. Their genetic material is located in an irregularly shaped region called the nucleoid, and they reproduce mostly via binary fission, transferring genes horizontally.',
    pronunciationHint: 'pro-KARY-oat',
    related: ['eukaryote', 'pathogen'],
    facts: [
      'Includes bacteria and archaea.',
      'Genetic material is circular DNA rather than linear chromosomes.',
      'Exist in almost every environment on Earth, including extreme hydrothermal vents.'
    ]
  },
  {
    id: 'dna',
    name: 'Deoxyribonucleic Acid (DNA)',
    phonetic: '/diːˌɒk.sɪ.raɪ.boʊ.njuːˌkleɪ.ɪk ˈæs.ɪd/',
    category: 'Genetics',
    shortDef: 'The double-helix molecule that contains the genetic instructions for the development and functioning of all living organisms.',
    longDef: 'Deoxyribonucleic Acid (DNA) is a molecule composed of two polynucleotide chains that coil around each other to form a double helix. It carries the genetic instructions used in the growth, development, functioning, and reproduction of all known organisms and many viruses. The two DNA strands are known as polynucleotides since they are composed of simpler monomeric units called nucleotides (Adenine, Thymine, Guanine, Cytosine).',
    pronunciationHint: 'dee-ox-ee-RY-bo-nyoo-clay-ik AS-id',
    related: ['rna', 'chromosome', 'ribosome'],
    facts: [
      'Adenine (A) always pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C).',
      'The double-helix structure was resolved by Watson, Crick, Franklin, and Wilkins in 1953.',
      'Contains a deoxyribose sugar molecule in its backbone.'
    ]
  },
  {
    id: 'rna',
    name: 'Ribonucleic Acid (RNA)',
    phonetic: '/ˌraɪ.boʊ.njuːˈkleɪ.ɪk ˈæs.ɪd/',
    category: 'Genetics',
    shortDef: 'A single-stranded nucleic acid molecule involved in coding, decoding, regulation, and expression of genes.',
    longDef: 'Ribonucleic Acid (RNA) is a polymeric molecule essential in various biological roles in coding, decoding, regulation, and expression of genes. Unlike DNA, RNA is usually single-stranded and contains uracil instead of thymine, and ribose sugar instead of deoxyribose. Major types include messenger RNA (mRNA), transfer RNA (tRNA), and ribosomal RNA (rRNA).',
    pronunciationHint: 'ry-bo-nyoo-clay-ik AS-id',
    related: ['dna', 'ribosome'],
    facts: [
      'Uracil (U) replaces Thymine (T) when pairing with Adenine (A).',
      'Some viruses use RNA as their primary genetic material.',
      'Can act as a biological catalyst (ribozyme).'
    ]
  },
  {
    id: 'chromosome',
    name: 'Chromosome',
    phonetic: '/ˈkroʊ.mə.soʊm/',
    category: 'Genetics',
    shortDef: 'A thread-like structure of nucleic acids and protein found in the nucleus, carrying genetic information in the form of genes.',
    longDef: 'A chromosome is a long DNA molecule with part or all of the genetic material of an organism. In eukaryotic cells, chromosomes are wrapped around packaging proteins called histones to form chromatin, preventing DNA damage and controlling gene expression. Humans contain 23 pairs of chromosomes (46 total) in somatic cells.',
    pronunciationHint: 'KRO-muh-sohm',
    related: ['dna', 'mitosis'],
    facts: [
      'Replicating chromosomes form sister chromatids joined at a centromere.',
      'Humans have 22 pairs of autosomes and 1 pair of sex chromosomes (XX or XY).',
      'Telomeres protect the caps of chromosomes from degrading.'
    ]
  },
  {
    id: 'mitosis',
    name: 'Mitosis',
    phonetic: '/maɪˈtoʊ.sɪs/',
    category: 'Genetics',
    shortDef: 'A process of cell division that results in two genetically identical daughter cells.',
    longDef: 'Mitosis is a part of the cell cycle in which replicated chromosomes are separated into two new nuclei. Mitosis division gives rise to genetically identical cells in which the total number of chromosomes is maintained. It occurs in somatic cells and is divided into Prophase, Metaphase, Anaphase, and Telophase, followed by Cytokinesis.',
    pronunciationHint: 'my-TOE-sis',
    related: ['chromosome', 'eukaryote'],
    facts: [
      'Responsible for growth, tissue repair, and asexual reproduction.',
      'Differs from meiosis, which produces gametes with half the chromosome count.',
      'Spindle fibers pull chromatids to opposite poles during Anaphase.'
    ]
  },
  {
    id: 'homeostasis',
    name: 'Homeostasis',
    phonetic: '/ˌhoʊ.mioʊˈsteɪ.sɪs/',
    category: 'Human Anatomy',
    shortDef: 'The state of steady internal, physical, and chemical conditions maintained by living systems.',
    longDef: 'Homeostasis is the state of steady internal physical and chemical conditions maintained by living systems. This is the condition of optimal functioning for the organism and includes many variables, such as body temperature, fluid balance, blood pH, and blood glucose concentration, being kept within certain pre-set limits via negative feedback loops.',
    pronunciationHint: 'home-ee-o-STAY-sis',
    related: ['cardiovascular', 'atp'],
    facts: [
      'Controlled largely by the autonomic nervous system and endocrine hormones.',
      'The hypothalamus in the brain acts as the primary homeostatic regulator.',
      'Diabetes represents a failure of blood glucose homeostatic regulation.'
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    phonetic: '/ˌkɑːr.dioʊˈvæs.kjə.lər/',
    category: 'Human Anatomy',
    shortDef: 'The organ system consisting of the heart and blood vessels that circulates blood throughout the body.',
    longDef: 'The cardiovascular system, also called the circulatory system, consists of the heart, blood vessels (arteries, capillaries, and veins), and blood. Its primary function is to transport oxygen, carbon dioxide, nutrients, hormones, and immune cells to and from tissues to maintain cellular respiration, regulate body temperature, and preserve homeostasis.',
    pronunciationHint: 'kar-dee-o-VAS-kyoo-ler',
    related: ['homeostasis', 'respiratory'],
    facts: [
      'Includes pulmonary circulation (lungs) and systemic circulation (rest of body).',
      'The human heart beats approximately 100,000 times per day.',
      'Capillaries are so narrow that red blood cells must flow through them in a single file.'
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory System',
    phonetic: '/ˈrɛs.pər.ə.tɔːr.i/',
    category: 'Human Anatomy',
    shortDef: 'The system of organs responsible for gas exchange, primarily O2 intake and CO2 release.',
    longDef: 'The respiratory system is a biological system consisting of specific organs and structures used for gas exchange in animals and plants. In humans, it includes the nasal cavity, trachea, bronchi, and lungs. Gas exchange occurs at the microscopic level inside alveoli sacs, where oxygen diffuses into blood capillaries and carbon dioxide diffuses out.',
    pronunciationHint: 'RES-pir-uh-tore-ee',
    related: ['cardiovascular', 'homeostasis'],
    facts: [
      'The surface area of both human lungs is roughly equivalent to a tennis court.',
      'The diaphragm is the primary muscle driving inhalation and exhalation.',
      'Lined with cilia and mucus to trap dust and pathogens.'
    ]
  },
  {
    id: 'pathogen',
    name: 'Pathogen',
    phonetic: '/ˈpæθ.ə.dʒən/',
    category: 'Microbiology',
    shortDef: 'Any microorganism or biological agent that causes disease in its host.',
    longDef: 'A pathogen is a biological agent that causes disease or illness to its host. The term is most frequently used for organisms that disrupt the normal physiology of a multicellular animal or plant. Pathogens include bacteria, viruses, fungi, protozoa, and prions.',
    pronunciationHint: 'PATH-uh-jen',
    related: ['prokaryote', 'virus', 'microbiome'],
    facts: [
      'Can be transmitted via air, direct contact, vectors (like mosquitoes), or contaminated water.',
      'Trigger responses from the host\'s immune system, including antibody production.',
      'Antibiotics target bacterial pathogens but are ineffective against viral ones.'
    ]
  },
  {
    id: 'virus',
    name: 'Virus',
    phonetic: '/ˈvaɪ.rəs/',
    category: 'Microbiology',
    shortDef: 'A submicroscopic infectious agent that replicates only inside the living cells of an organism.',
    longDef: 'A virus is a submicroscopic infectious agent that replicates only inside the living cells of an organism. Viruses infect all types of life forms, from animals and plants to microorganisms, including bacteria and archaea. They consist of genetic material (DNA or RNA) enclosed in a protein coat called a capsid, and sometimes a lipid envelope.',
    pronunciationHint: 'VY-rus',
    related: ['pathogen', 'rna', 'dna'],
    facts: [
      'Not considered fully alive because they lack cellular structures and metabolic systems.',
      'A virus particle outside a host cell is called a virion.',
      'Bacteriophages are viruses that specifically target and kill bacteria.'
    ]
  },
  {
    id: 'microbiome',
    name: 'Microbiome',
    phonetic: '/ˌmaɪ.kroʊˈbaɪ.oʊm/',
    category: 'Microbiology',
    shortDef: 'The collective community of microorganisms that reside in a specific environment, such as the human gut.',
    longDef: 'A microbiome is the community of microorganisms (such as fungi, bacteria, and viruses) that exist in a particular environment. The term is most commonly applied to the human microbiome, which refers to the trillions of microbial cells that live on and inside the human body (mostly in the digestive tract), playing a crucial role in metabolism, immunity, and health.',
    pronunciationHint: 'my-kro-BY-ohm',
    related: ['prokaryote', 'pathogen'],
    facts: [
      'Human gut microbes outnumber human cells and contain millions of unique genes.',
      'Essential for digesting complex dietary fibers and synthesizing vitamins (like Vitamin K).',
      'Imbalances in gut flora, called dysbiosis, are linked to chronic inflammation and metabolic disease.'
    ]
  },
  {
    id: 'trophic',
    name: 'Trophic Level',
    phonetic: '/ˈtroʊ.fɪk ˈlɛv.əl/',
    category: 'Ecology',
    shortDef: 'The position that an organism occupies in a food chain or ecological pyramid.',
    longDef: 'The trophic level of an organism is the position it occupies in a food web. A food chain is a succession of organisms that eat other organisms and may, in turn, be eaten themselves. The trophic level starts at level 1 with primary producers (plants), moving up to herbivores (level 2), carnivores (level 3), and apex predators at level 4 or 5.',
    pronunciationHint: 'TRO-fik level',
    related: ['ecology', 'photosynthesis'],
    facts: [
      'Governed by the 10% Rule: only 10% of energy is transferred to the next level.',
      'Decomposers (like fungi and bacteria) recycle nutrients from all trophic levels.',
      'Ecosystems rarely exceed 5 trophic levels due to the exponential energy loss.'
    ]
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    phonetic: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    category: 'Ecology',
    shortDef: 'The process by which plants and other autotrophs convert light energy into glucose.',
    longDef: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism\'s activities. This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water, releasing oxygen as a byproduct.',
    pronunciationHint: 'fo-to-SIN-thuh-sis',
    related: ['trophic', 'ecology'],
    facts: [
      'Takes place inside specialized plant organelles called chloroplasts.',
      'Chlorophyll pigments absorb red and blue light while reflecting green light.',
      'Responsible for producing and maintaining the oxygen content of the Earth\'s atmosphere.'
    ]
  },
  {
    id: 'ecology',
    name: 'Ecology',
    phonetic: '/iˈkɒl.ə.dʒi/',
    category: 'Ecology',
    shortDef: 'The study of the relationships between living organisms and their physical environment.',
    longDef: 'Ecology is the biological study of the relationships and interactions of living organisms with one another and with their physical and chemical environment. It bridges the gaps between organism physiology, population dynamics, community distributions, and entire ecosystem nutrient cycles.',
    pronunciationHint: 'ee-KOL-uh-jee',
    related: ['trophic', 'photosynthesis'],
    facts: [
      'The term was coined by German biologist Ernst Haeckel in 1866.',
      'Analyzes biotic (living) factors like predation and abiotic (non-living) factors like climate.',
      'Includes scales of study from individual organisms up to the entire biosphere.'
    ]
  }
]

export default function BiologyDictionary() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedTermId, setSelectedTermId] = useState<string>('mitochondria')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [recents, setRecents] = useState<string[]>([])
  const [speakingTermId, setSpeakingTermId] = useState<string | null>(null)

  // Initialize client storage safely
  useEffect(() => {
    setMounted(true)
    const savedBookmarks = localStorage.getItem('biosphere_dict_bookmarks')
    const savedRecents = localStorage.getItem('biosphere_dict_recents')
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
    if (savedRecents) setRecents(JSON.parse(savedRecents))
  }, [])

  // Related categories listing
  const categories = ['All', 'Cell Biology', 'Genetics', 'Human Anatomy', 'Microbiology', 'Ecology']

  // Handle Bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
      localStorage.setItem('biosphere_dict_bookmarks', JSON.stringify(next))
      return next
    })
  }

  // Speak pronunciation
  const handleSpeak = (term: DictionaryTerm) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (speakingTermId === term.id) {
      window.speechSynthesis.cancel()
      setSpeakingTermId(null)
      return;
    }

    window.speechSynthesis.cancel()
    const textToSpeak = `${term.name}. ${term.shortDef}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'en-US'

    utterance.onend = () => setSpeakingTermId(null)
    utterance.onerror = () => setSpeakingTermId(null)

    setSpeakingTermId(term.id)
    window.speechSynthesis.speak(utterance)
  }

  // Select Term
  const selectTerm = (id: string) => {
    setSelectedTermId(id)
    // Add to recent list
    setRecents(prev => {
      const filtered = prev.filter(r => r !== id)
      const next = [id, ...filtered].slice(0, 5) // Cap at 5 recents
      localStorage.setItem('biosphere_dict_recents', JSON.stringify(next))
      return next
    })
  }

  // Filter Data based on search query & category selection
  const filteredTerms = useMemo(() => {
    return DICTIONARY_DATA.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.longDef.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const selectedTerm = useMemo(() => {
    return DICTIONARY_DATA.find(t => t.id === selectedTermId) || DICTIONARY_DATA[0]
  }, [selectedTermId])

  return (
    <div className="dict-root">
      <div className="dict-grid-bg" />
      <div className="dict-glow-effect" />

      {/* HEADER SECTION */}
      <header className="dict-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">BIOLOGY DICTIONARY</h1>
            <p className="header-subtitle">LEXICON & TERMINOLOGY ENGINE</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="dict-main-layout">
        {/* LEFT COLUMN: Search & List */}
        <section className="dict-sidebar-left">
          {/* Search bar */}
          <div className="panel-card glassmorphic search-panel-card">
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search biological term or definition..."
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

          {/* Category Filter Pills */}
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

          {/* Dictionary Terms List */}
          <div className="terms-list-scroller" data-lenis-prevent>
            <div className="scroller-inner">
              {filteredTerms.length > 0 ? (
                filteredTerms.map(term => {
                  const isCurrent = term.id === selectedTerm.id
                  return (
                    <button
                      key={term.id}
                      onClick={() => selectTerm(term.id)}
                      className={`term-row-card ${isCurrent ? 'active' : ''}`}
                    >
                      <div className="term-card-header">
                        <span className="term-card-name">{term.name}</span>
                        <span className="term-card-category">{term.category}</span>
                      </div>
                      <p className="term-card-short-def">{term.shortDef}</p>
                    </button>
                  )
                })
              ) : (
                <div className="no-results-card glassmorphic">
                  <p>No matching biological terms found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN: Scanner Detailed definition view */}
        <section className="dict-detail-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTerm.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="panel-card glassmorphic details-card"
            >
              <div className="details-header">
                <div>
                  <span className="diagnostic-badge">{selectedTerm.category.toUpperCase()} DEFINITION</span>
                  <h2 className="term-title">{selectedTerm.name}</h2>
                  <div className="term-phonetic-row">
                    <span className="phonetic-text">{selectedTerm.phonetic}</span>
                    <span className="pronunciation-hint">({selectedTerm.pronunciationHint})</span>
                  </div>
                </div>

                <div className="details-action-buttons">
                  <button
                    onClick={() => handleSpeak(selectedTerm)}
                    className={`circle-action-btn ${speakingTermId === selectedTerm.id ? 'speaking' : ''}`}
                    title={speakingTermId === selectedTerm.id ? 'Stop Speaking' : 'Pronounce Term'}
                  >
                    {speakingTermId === selectedTerm.id ? '🔇' : '🔊'}
                  </button>
                  <button
                    onClick={() => toggleBookmark(selectedTerm.id)}
                    className={`circle-action-btn ${bookmarks.includes(selectedTerm.id) ? 'bookmarked' : ''}`}
                    title={bookmarks.includes(selectedTerm.id) ? 'Remove Bookmark' : 'Add to Bookmarks'}
                  >
                    ⭐
                  </button>
                </div>
              </div>

              <div className="details-content-body">
                <div className="detail-section">
                  <h4 className="detail-section-title">CLINICAL DESCRIPTION</h4>
                  <p className="long-definition-text">{selectedTerm.longDef}</p>
                </div>

                <div className="detail-section">
                  <h4 className="detail-section-title">KEY BIOLOGICAL FACTS</h4>
                  <ul className="facts-list">
                    {selectedTerm.facts.map((fact, index) => (
                      <li key={index} className="fact-item">
                        <span className="fact-bullet">🧬</span>
                        <span className="fact-text">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4 className="detail-section-title">RELATED CROSS-REFERENCES</h4>
                  <div className="related-terms-row">
                    {selectedTerm.related.map(relId => {
                      const relTerm = DICTIONARY_DATA.find(d => d.id === relId)
                      if (!relTerm) return null
                      return (
                        <button
                          key={relId}
                          onClick={() => selectTerm(relId)}
                          className="related-term-tag"
                        >
                          🔗 {relTerm.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* RIGHT COLUMN: Bookmarks & Recents Sidebar */}
        <section className="dict-sidebar-right">
          {/* Bookmarks Card */}
          <div className="panel-card glassmorphic bookmarks-panel">
            <h3 className="sidebar-section-title">⭐ BOOKMARKED TERMS</h3>
            <div className="sidebar-list-wrap">
              {bookmarks.length > 0 ? (
                bookmarks.map(bId => {
                  const term = DICTIONARY_DATA.find(d => d.id === bId)
                  if (!term) return null
                  return (
                    <button
                      key={bId}
                      onClick={() => selectTerm(bId)}
                      className={`sidebar-row-item ${selectedTerm.id === bId ? 'active' : ''}`}
                    >
                      <span className="row-item-name">{term.name}</span>
                      <span className="row-item-category">{term.category}</span>
                    </button>
                  )
                })
              ) : (
                <p className="sidebar-empty-text">No bookmarked terms. Click the star icon on a definition to save it here.</p>
              )}
            </div>
          </div>

          {/* Recent Searches Card */}
          <div className="panel-card glassmorphic recents-panel">
            <h3 className="sidebar-section-title">🕒 RECENT VIEWS</h3>
            <div className="sidebar-list-wrap">
              {recents.length > 0 ? (
                recents.map(rId => {
                  const term = DICTIONARY_DATA.find(d => d.id === rId)
                  if (!term) return null
                  return (
                    <button
                      key={rId}
                      onClick={() => selectTerm(rId)}
                      className={`sidebar-row-item ${selectedTerm.id === rId ? 'active' : ''}`}
                    >
                      <span className="row-item-name">{term.name}</span>
                      <span className="row-item-category">{term.category}</span>
                    </button>
                  )
                })
              ) : (
                <p className="sidebar-empty-text">Terms you inspect will appear here in your session history.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .dict-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
          font-family: inherit;
        }

        .dict-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .dict-glow-effect {
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

        .dict-header {
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

        .dict-main-layout {
          display: grid;
          grid-template-columns: 360px 1fr 300px;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .dict-sidebar-left,
        .dict-detail-panel,
        .dict-sidebar-right {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        .panel-card {
          border-radius: 16px;
          border: 1px solid var(--ds-border-muted);
          padding: 1.25rem;
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

        .terms-list-scroller {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 2px;
        }

        .terms-list-scroller::-webkit-scrollbar {
          width: 4px;
        }

        .terms-list-scroller::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }

        .terms-list-scroller::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.15);
          border-radius: 2px;
        }

        .scroller-inner {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .term-row-card {
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

        .term-row-card:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent);
          transform: translateY(-1px);
        }

        .term-row-card.active {
          background: var(--ds-accent-subtle);
          border-color: var(--ds-accent);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .term-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .term-card-name {
          font-weight: 700;
          color: var(--ds-fg);
          font-size: 0.88rem;
          transition: color 0.2s;
        }

        .term-row-card.active .term-card-name {
          color: var(--ds-accent);
        }

        .term-card-category {
          font-size: 0.58rem;
          text-transform: uppercase;
          background: var(--ds-surface-raised);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--ds-fg-muted);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .term-card-short-def {
          margin: 0;
          font-size: 0.72rem;
          line-height: 1.4;
          color: var(--ds-fg-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .no-results-card {
          text-align: center;
          padding: 2rem;
          color: var(--ds-fg-subtle);
          font-size: 0.78rem;
        }

        /* DETAIL PANEL */
        .details-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          min-height: 0;
          overflow-y: auto;
          position: relative;
        }

        .details-card::-webkit-scrollbar {
          width: 4px;
        }

        .details-card::-webkit-scrollbar-thumb {
          background: var(--ds-accent-muted);
          border-radius: 2px;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .diagnostic-badge {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.15em;
          border: 1px solid var(--ds-border-accent);
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--ds-accent-faint);
          margin-bottom: 8px;
        }

        .term-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }

        .term-phonetic-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phonetic-text {
          font-family: monospace;
          color: var(--ds-fg-subtle);
          font-size: 0.8rem;
        }

        .pronunciation-hint {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          font-style: italic;
        }

        .details-action-buttons {
          display: flex;
          gap: 8px;
        }

        .circle-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }

        .circle-action-btn:hover {
          color: #fff;
          background: var(--ds-surface-raised);
          border-color: var(--ds-fg-subtle);
        }

        .circle-action-btn.speaking {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
          animation: pulse-speaking 1.5s infinite;
        }

        .circle-action-btn.bookmarked {
          color: #FBBF24;
          background: rgba(251, 191, 36, 0.08);
          border-color: rgba(251, 191, 36, 0.3);
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
        }

        @keyframes pulse-speaking {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .details-content-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-section-title {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0;
        }

        .long-definition-text {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--ds-fg-muted);
        }

        .facts-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fact-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .fact-bullet {
          font-size: 0.85rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .fact-text {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ds-fg-muted);
        }

        .related-terms-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .related-term-tag {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-accent);
          font-size: 0.72rem;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .related-term-tag:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        /* SIDEBAR RIGHT */
        .dict-sidebar-right {
          gap: 1.25rem;
        }

        .bookmarks-panel,
        .recents-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .sidebar-section-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          margin: 0 0 10px 0;
          flex-shrink: 0;
        }

        .sidebar-list-wrap {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 0;
        }

        .sidebar-list-wrap::-webkit-scrollbar {
          width: 3px;
        }

        .sidebar-list-wrap::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .sidebar-row-item {
          width: 100%;
          text-align: left;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .sidebar-row-item:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent-muted);
        }

        .sidebar-row-item.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-subtle);
        }

        .row-item-name {
          font-size: 0.75rem;
          color: var(--ds-fg);
          font-weight: 600;
        }

        .sidebar-row-item.active .row-item-name {
          color: var(--ds-accent);
        }

        .row-item-category {
          font-size: 0.52rem;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
        }

        .sidebar-empty-text {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          line-height: 1.5;
          margin: 0;
          padding: 8px 4px;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1100px) {
          .dict-main-layout {
            grid-template-columns: 320px 1fr;
            grid-template-rows: auto 1fr;
          }
          .dict-sidebar-right {
            grid-column: 1 / -1;
            flex-direction: row;
            height: auto;
          }
          .bookmarks-panel,
          .recents-panel {
            height: 180px;
          }
        }

        @media (max-width: 768px) {
          .dict-main-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            padding: 1rem;
            gap: 1rem;
            height: auto;
          }
          .dict-sidebar-left {
            height: 420px;
          }
          .dict-detail-panel {
            height: auto;
          }
          .dict-sidebar-right {
            flex-direction: column;
            height: auto;
          }
          .bookmarks-panel,
          .recents-panel {
            height: 180px;
          }
          .dict-header {
            padding: 1rem;
          }
          .term-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  )
}

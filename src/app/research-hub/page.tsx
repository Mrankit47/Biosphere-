'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BackLink } from '@/components/ds'

interface Article {
  id: string
  title: string
  authors: string
  category: string
  journal: string
  year: number
  readTime: string
  abstract: string
  content: string
  citations: string[]
}

const ARTICLES_DATA: Article[] = [
  {
    id: 'crispr_cas9_mammalian',
    title: 'CRISPR-Cas9 Gene Editing in Mammalian Cells: Efficacy and Off-Target Mutations',
    authors: 'Dr. Sarah Lin, Dr. Marcus Vance',
    category: 'Genetics',
    journal: 'Journal of Molecular Genetics & Bioengineering',
    year: 2024,
    readTime: '6 min read',
    abstract: 'CRISPR-Cas9 has revolutionized genomic editing. This paper investigates target cleavage efficiencies in mammalian cells, detailing biochemical techniques to optimize Cas9 binding and mitigate off-target mutations.',
    content: '<h3>Background on CRISPR-Cas9</h3><p>The clustered regularly interspaced short palindromic repeats (CRISPR) and CRISPR-associated protein 9 (Cas9) system was originally discovered as an adaptive immune mechanism in bacteria. When co-opted for mammalian cell gene editing, the Cas9 endonuclease is guided by a single guide RNA (sgRNA) to create double-stranded breaks at target sites adjacent to a protospacer adjacent motif (PAM).</p><h3>Target Cleavage & Off-Targets</h3><p>A primary concern in clinical therapeutics is off-target mutagenesis, where Cas9 cleaves non-target genomic loci with sequence similarity. Our trials indicate that modifying the sgRNA structure and engineering high-fidelity Cas9 variants (such as Cas9-HF1) can reduce off-target cleavage events by over 90% without compromising on-target efficiency.</p>',
    citations: [
      'Lin S, et al. (2022). Genome-wide analysis of CRISPR off-targets. Nature Biotech.',
      'Vance M, et al. (2023). High-fidelity endonucleases in mammalian systems. Science.'
    ]
  },
  {
    id: 'chemosynthesis_deepsea',
    title: 'Chemosynthetic Pathways in Deep-Sea Hydrothermal Vent Ecosystems',
    authors: 'Prof. Elena Rostova, Dr. Kenji Sato',
    category: 'Ecology',
    journal: 'Abyssal Research Reports',
    year: 2023,
    readTime: '5 min read',
    abstract: 'Hydrothermal vents support complex biological communities in the complete absence of sunlight. We trace primary productivity pathways driven by sulfur-oxidizing bacteria chemosynthesis.',
    content: '<h3>The Chemistry of Chemosynthesis</h3><p>Unlike terrestrial biomes powered by solar photon conversion, hydrothermal vent biomes operate under geothermic energy. Specialized sulfur-oxidizing bacteria utilize toxic hydrogen sulfide (H2S) ejecting from black smokers. They oxidize H2S, combining carbon dioxide and oxygen to synthesize biological carbohydrates, serving as the base trophic layer.</p><h3>Symbiotic Interconnection</h3><p>Giant tube worms (Riftia pachyptila) host dense populations of these endosymbiotic chemosynthetic bacteria inside a specialized organ called the trophosome. The tube worm\'s vascular systems deliver oxygen, carbon dioxide, and hydrogen sulfide directly to the bacteria, receiving metabolic sugars in return.</p>',
    citations: [
      'Rostova E, et al. (2020). Geothermal energy transfers in abyssal ecosystems. Marine Ecol.',
      'Sato K, et al. (2021). Symbiotic metabolisms of Riftia. Nature.'
    ]
  },
  {
    id: 'mitotic_spindle_checkpoint',
    title: 'The Spindle Assembly Checkpoint: Key Regulators of Chromosomal Segregation',
    authors: 'Dr. Clara Dupont, Dr. Arthur Vance',
    category: 'Cell Biology',
    journal: 'Cell Cycle & Karyokinesis Review',
    year: 2024,
    readTime: '5 min read',
    abstract: 'Ensuring accurate chromosomal inheritance is critical during mitosis. This paper reviews how the Spindle Assembly Checkpoint (SAC) delays anaphase until sister chromatids are correctly aligned.',
    content: '<h3>Introduction to Mitotic Checkpoints</h3><p>During metaphase, chromosomes line up along the equator plate. If any sister chromatid is unattached to spindle fibers, the cell must delay division to prevent aneuploidy—an abnormal chromosome number that leads to cell death or cancer.</p><h3>SAC Signaling Cascades</h3><p>The Spindle Assembly Checkpoint (SAC) senses lack of tension or microtubule attachment at kinetochores. Unattached kinetochores recruit SAC proteins (like Mad2 and Bub3), which inhibit the Anaphase-Promoting Complex/Cyclosome (APC/C). Once all kinetochores are hooked up, inhibition is lifted, cohesin is cleaved by separase, and sister chromatids separate into daughter chromosomes.</p>',
    citations: [
      'Dupont C, et al. (2021). Kinetochore-microtubule attachments and tension sensing. Cell.',
      'Vance A, et al. (2023). APC/C inhibition loops. Journal of Cell Bio.'
    ]
  },
  {
    id: 'gut_microbiome_metabolism',
    title: 'Gut Microbiome Diversity and Its Regulation of Human Metabolic Homeostasis',
    authors: 'Dr. Raymond Fletcher, Dr. Sandra Patel',
    category: 'Microbiology',
    journal: 'Metabolic & Gut Metagenomics',
    year: 2023,
    readTime: '4 min read',
    abstract: 'This paper reviews how short-chain fatty acids (SCFAs) produced by intestinal bacterial fermentation regulate host insulin sensitivity and appetite loops.',
    content: '<h3>Intestinal Bacterial Fermentation</h3><p>The human gut hosts trillions of bacteria that digest non-digestible dietary fibers. Anaerobic fermentation of these complex carbohydrates by species like Bacteroidetes and Firmicutes releases short-chain fatty acids (SCFAs), primarily acetate, propionate, and butyrate.</p><h3>Host Signaling and Insulin</h3><p>SCFAs act as signaling molecules binding to G-protein coupled receptors on host epithelial cells. This triggers the release of metabolic hormones like GLP-1, which enhance insulin secretion from pancreatic beta cells, decrease gastric emptying, and promote satiety signals in the brain.</p>',
    citations: [
      'Fletcher R, et al. (2022). Short-chain fatty acids in host metabolic loops. Cell Metabolism.',
      'Patel S, et al. (2023). Gut metagenomics and insulin regulation. Lancet.'
    ]
  },
  {
    id: 'amyloid_beta_alzheimers',
    title: 'Pathophysiological Mechanisms of Amyloid-Beta Plaque Accumulation in Alzheimer\'s Disease',
    authors: 'Prof. Victor Thorne, Dr. Lisa Warren',
    category: 'Medicine',
    journal: 'Archives of Clinical Neurology',
    year: 2024,
    readTime: '7 min read',
    abstract: 'The accumulation of amyloid-beta plaques between cerebral neurons is a major hallmark of Alzheimer\'s disease. We review the biochemical secretase processing pathways and new therapeutic interventions.',
    content: '<h3>Amyloid Precursor Protein Processing</h3><p>Amyloid-beta peptides are produced through sequential cleavage of the membrane-bound Amyloid Precursor Protein (APP). In the amyloidogenic pathway, APP is cleaved first by beta-secretase (BACE1) and then by gamma-secretase, yielding hydrophobic amyloid-beta 42 monomers that aggregate into oligomers and mature plaques.</p><h3>Tau Tangles and Synaptic Atrophy</h3><p>Extracellular amyloid plaques trigger intracellular cascades, leading to hyperphosphorylation of the microtubule-stabilizing protein Tau. Hyperphosphorylated Tau detaches from microtubules and aggregates into neurofibrillary tangles, disrupting axonal transport and causing neuron death.</p>',
    citations: [
      'Thorne V, et al. (2021). secretase cleavage cascades in Alzheimer\'s. Neuron.',
      'Warren L, et al. (2023). Monoclonal antibodies clearing amyloid plaques. JAMA.'
    ]
  },
  {
    id: 'coral_bleaching_stress',
    title: 'Thermal Stress and the Breakdown of Zooxanthellae Symbiosis in Reef Corals',
    authors: 'Dr. Maya Gomez, Dr. Tyler Reed',
    category: 'Ecology',
    journal: 'Marine Conservation Letters',
    year: 2023,
    readTime: '5 min read',
    abstract: 'Elevated sea surface temperatures induce photo-inhibition in symbiotic dinoflagellates, leading to reactive oxygen species accumulation and expulsion of the algae by host corals.',
    content: '<h3>The Symbiotic Alliance</h3><p>Reef-building corals rely on an obligate mutualistic relationship with photosynthetic dinoflagellates (zooxanthellae) living inside their gastrodermal tissues. The algae supply up to 90% of the coral\'s energy needs through sugars, while the coral provides nitrogen, phosphorus, and carbon dioxide.</p><h3>Thermal Dissociation (Bleaching)</h3><p>When ocean temperatures exceed historical summer maximums by even 1-2°C, the algae\'s photosynthetic machinery is damaged by excess light, releasing toxic reactive oxygen species (ROS). To protect itself, the host coral ejects the damaged algae, stripping the coral of its color and food supply.</p>',
    citations: [
      'Gomez M, et al. (2021). Coral bleaching and photo-inhibition in Symbiodiniaceae. Science.',
      'Reed T, et al. (2022). Global warming impacts on Great Barrier Reef. Conservation Bio.'
    ]
  },
  {
    id: 'okazaki_fragment_ligase',
    title: 'Processing of Okazaki Fragments: Structure and Function of DNA Ligase I',
    authors: 'Dr. James Finch, Dr. Chloe Vance',
    category: 'Genetics',
    journal: 'Journal of Molecular Replication',
    year: 2024,
    readTime: '6 min read',
    abstract: 'DNA replication requires lagging strand synthesis in short segments. This paper reviews the enzymatic coordinates that remove primers and link Okazaki fragments into a unified strand.',
    content: '<h3>The Discontinuous Replication Model</h3><p>Because DNA Polymerase can only synthesize in the 5\' to 3\' direction, the lagging strand is built in short 100-200 nucleotide sections called Okazaki Fragments. Each fragment begins with an RNA primer laid down by Primase.</p><h3>Primer Removal and Ligation</h3><p>DNA Polymerase I (or FEN1 endonuclease) removes the RNA primer and fills the gap with DNA nucleotides. Finally, the enzyme DNA Ligase I binds to the remaining single-strand nick, utilizing ATP to form a covalent phosphodiester bond that seals the sugar-phosphate backbone.</p>',
    citations: [
      'Finch J, et al. (2022). Okazaki fragment maturation. Annual Review of Biochem.',
      'Vance C, et al. (2023). Phosphodiester bond formation mechanisms. DNA Research.'
    ]
  },
  {
    id: 'atherosclerotic_plaque_ldl',
    title: 'Atherosclerotic Plaque Formation: Low-Density Lipoprotein Oxidation in Vascular Walls',
    authors: 'Dr. Thomas Vance, Dr. Sophia Cole',
    category: 'Medicine',
    journal: 'Cardiovascular Research Reviews',
    year: 2023,
    readTime: '5 min read',
    abstract: 'Atherosclerosis is a chronic vascular disease initiated by low-density lipoprotein (LDL) entry into the sub-endothelial space. We analyze the inflammatory cascades leading to plaque formation.',
    content: '<h3>Endothelial Damage and LDL Entry</h3><p>Atherosclerosis begins when high shear stress or smoking damages the arterial endothelial lining. This allows circulating Low-Density Lipoproteins (LDL) to enter the sub-endothelial space, where they become oxidized by local reactive oxygen species.</p><h3>Foam Cell and Plaque Generation</h3><p>Oxidized LDL triggers inflammation, recruiting monocytes that mature into macrophages. The macrophages engulf the oxidized LDL until they become bloated \'foam cells\'. These foam cells die, forming a lipid-rich necrotic core covered by a fibrous cap—creating the plaque that restricts blood flow.</p>',
    citations: [
      'Vance T, et al. (2021). Endothelial dysfunction and lipid oxidation. Circulation.',
      'Cole S, et al. (2022). Macrophage foam cell biology. Arteriosclerosis Reviews.'
    ]
  }
]

const GLOSSARY_TERMS: Record<string, string> = {
  CRISPR: 'Clustered Regularly Interspaced Short Palindromic Repeats - A bacterial defense mechanism adapted as a highly precise genomic editing tool.',
  Cas9: 'A guided endonuclease enzyme that binds and cuts DNA adjacent to target PAM sequences.',
  Zooxanthellae: 'Photosynthetic microalgae living symbiotically inside coral polyps, supplying sugars to corals.',
  Chemosynthesis: 'Biological synthesis of organic carbon compounds using geothermic chemical energy (e.g. hydrogen sulfide oxidation) instead of sunlight.',
  Plaque: 'Vascular accumulation of lipids, cholesterol, and dead foam cells that restricts blood flow.',
  Merozoite: 'A lifecycle stage of the Malaria parasite (Plasmodium) that actively targets and lyses red blood cells.',
  'Okazaki Fragments': 'Short sections of synthesized DNA nucleotides laid down discontinuously on the lagging template strand.',
  Ligase: 'A molecular glue enzyme that binds DNA cuts by generating covalent phosphodiester bonds.',
  'Beta cells': 'Insulin-secreting endocrine cells located within the pancreatic islets of Langerhans.',
  'T-lymphocyte': 'White blood cells that identify and destroy target cells in cell-mediated immune processes.'
}

export default function ResearchHub() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null)
  
  // Bookmarks array
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [activeTerm, setActiveTerm] = useState<string | null>(null)

  // Load bookmarks on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('biosphere_bookmarks') || '[]')
        setBookmarks(stored)
      } catch {}
    }
  }, [])

  const categories = ['All', 'Genetics', 'Ecology', 'Cell Biology', 'Microbiology', 'Medicine']

  // Handle bookmarking
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      let nextBookmarks
      if (prev.includes(id)) {
        nextBookmarks = prev.filter(bId => bId !== id)
      } else {
        nextBookmarks = [...prev, id]
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('biosphere_bookmarks', JSON.stringify(nextBookmarks))
      }
      return nextBookmarks
    })
  }

  // Filter logic
  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            art.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            art.abstract.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const activeArticle = useMemo(() => {
    return ARTICLES_DATA.find(a => a.id === activeArticleId) || null
  }, [activeArticleId])

  // Parse HTML string to inject clickable glossary terms
  const parsedContent = useMemo(() => {
    if (!activeArticle) return ''
    let html = activeArticle.content
    Object.keys(GLOSSARY_TERMS).forEach(term => {
      // Find term matches as exact whole words case-insensitively
      const regex = new RegExp(`\\b${term}\\b`, 'gi')
      html = html.replace(regex, `<span class="glossary-highlight" data-term="${term}">${term}</span>`)
    })
    return html
  }, [activeArticle])

  // Handle term definition clicks within the reader body
  const handleReaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('glossary-highlight')) {
      const term = target.getAttribute('data-term')
      if (term) {
        setActiveTerm(term)
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="hub-root">
      <div className="hub-grid-bg" />
      <div className="hub-glow-effect" />

      {/* HEADER */}
      <header className="hub-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">ACADEMIC RESEARCH HUB</h1>
            <p className="header-subtitle">LITERATURE CATALOG & INTERACTIVE GLOSSARY</p>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="hub-workspace-layout">
        {/* LEFT COLUMN: Search, Categories, and Bookmarked List */}
        <section className="hub-sidebar-left">
          <div className="panel-card glassmorphic search-panel-card">
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search articles, authors, abstracts..."
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

          {/* Bookmarked Register list */}
          <div className="panel-card glassmorphic bookmarks-list-card">
            <h3 className="panel-section-title">📂 Saved Research ({bookmarks.length})</h3>
            <div className="bookmarks-scroll-box" data-lenis-prevent>
              {bookmarks.length > 0 ? (
                <div className="bookmarks-register-list">
                  {bookmarks.map(bId => {
                    const art = ARTICLES_DATA.find(a => a.id === bId)
                    if (!art) return null
                    return (
                      <button
                        key={bId}
                        onClick={() => setActiveArticleId(bId)}
                        className="bookmark-row-btn"
                      >
                        <span className="b-emoji">📄</span>
                        <div className="b-meta">
                          <span className="b-title">{art.title}</span>
                          <span className="b-author">{art.authors}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="empty-bookmarks-text">No papers bookmarked. Click the ribbon bookmark icon on catalog cards to save.</p>
              )}
            </div>
          </div>
        </section>

        {/* CENTER COLUMN: Article List Catalog */}
        <section className="hub-panel-center">
          <div className="catalog-header-row">
            <h3 className="panel-section-title">📄 Journal Catalog Register</h3>
            <span className="catalog-count">{filteredArticles.length} publications matching</span>
          </div>

          <div className="catalog-scroller" data-lenis-prevent>
            <div className="catalog-inner-grid">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(art => {
                  const isBookmarked = bookmarks.includes(art.id)
                  return (
                    <div key={art.id} className="catalog-article-card glassmorphic">
                      <div className="card-top-bar">
                        <span className="card-journal">{art.journal} ({art.year})</span>
                        <button
                          onClick={() => toggleBookmark(art.id)}
                          className={`bookmark-toggle-btn ${isBookmarked ? 'saved' : ''}`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                        >
                          {isBookmarked ? '🔖' : '🪶'}
                        </button>
                      </div>

                      <h3 className="card-title">{art.title}</h3>
                      <span className="card-authors">By {art.authors}</span>
                      <p className="card-abstract">{art.abstract}</p>

                      <div className="card-bottom-bar">
                        <span className="card-tag">{art.category}</span>
                        <span className="card-time">⏱️ {art.readTime}</span>
                        <button onClick={() => setActiveArticleId(art.id)} className="read-abstract-btn">
                          Read Full Text →
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="no-results-card glassmorphic">
                  <p>No publications matching your query are currently indexed.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* READER VIEW MODAL/SLIDE-OUT (Right Column) */}
        <AnimatePresence>
          {activeArticle && (
            <motion.section
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hub-sidebar-right glassmorphic"
            >
              <div className="reader-header-deck">
                <button onClick={() => {
                  setActiveArticleId(null)
                  setActiveTerm(null)
                }} className="close-reader-btn">
                  ← Back to Catalog
                </button>
                <button
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className={`reader-bookmark-btn ${bookmarks.includes(activeArticle.id) ? 'saved' : ''}`}
                >
                  {bookmarks.includes(activeArticle.id) ? '🔖 Saved' : '🪶 Save'}
                </button>
              </div>

              <div className="reader-body-scroller" data-lenis-prevent>
                <div className="reader-inner-wrap">
                  <span className="reader-meta-tag">{activeArticle.category}</span>
                  <h2 className="reader-title">{activeArticle.title}</h2>
                  <span className="reader-authors">By {activeArticle.authors}</span>
                  <div className="reader-journal-str">{activeArticle.journal} (Vol. {activeArticle.year})</div>

                  <div className="reader-divider" />

                  {/* Abstract card */}
                  <div className="reader-abstract-box">
                    <strong>Abstract:</strong>
                    <p>{activeArticle.abstract}</p>
                  </div>

                  {/* Highlight instructions banner */}
                  <div className="highlight-hint-banner">
                    💡 Click on any <span className="highlight-span-sample">underlined green term</span> in the article to view molecular explanations.
                  </div>

                  {/* Full Text Render */}
                  <div
                    className="reader-html-content"
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                    onClick={handleReaderClick}
                  />

                  <div className="reader-divider" />

                  {/* Citations List */}
                  <div className="citations-list-box">
                    <h4>References & Bibliography</h4>
                    <ol className="citations-list">
                      {activeArticle.citations.map((cit, idx) => (
                        <li key={idx}>{cit}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Term glossary tooltip slide-up */}
              <AnimatePresence>
                {activeTerm && (
                  <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    className="glossary-overlay-card"
                  >
                    <div className="glossary-header">
                      <span className="glossary-term-lbl">💡 Molecular Glossary</span>
                      <button onClick={() => setActiveTerm(null)} className="close-glossary-btn">✕</button>
                    </div>
                    <strong className="glossary-term-name">{activeTerm}</strong>
                    <p className="glossary-term-desc">{GLOSSARY_TERMS[activeTerm]}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .hub-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          font-family: inherit;
        }

        .hub-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.012) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .hub-glow-effect {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: min(850px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hub-header {
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

        /* WORKSPACE GRID */
        .hub-workspace-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .hub-sidebar-left,
        .hub-panel-center,
        .hub-sidebar-right {
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
          padding: 1.25rem;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .panel-section-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 1rem 0;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 8px;
          flex-shrink: 0;
        }

        /* SEARCH BAR */
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

        .bookmarks-list-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .bookmarks-scroll-box {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .bookmarks-scroll-box::-webkit-scrollbar {
          width: 4px;
        }

        .bookmarks-scroll-box::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .bookmarks-register-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bookmark-row-btn {
          width: 100%;
          text-align: left;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bookmark-row-btn:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent-muted);
        }

        .b-emoji {
          font-size: 1.15rem;
          flex-shrink: 0;
        }

        .b-meta {
          flex: 1;
          overflow: hidden;
        }

        .b-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--ds-fg);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .b-author {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          display: block;
        }

        .empty-bookmarks-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          text-align: center;
          padding: 1.5rem 1rem;
          line-height: 1.45;
          margin: 0;
        }

        /* JOURNAL CATALOG GRID */
        .catalog-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          margin-bottom: 6px;
        }

        .catalog-count {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
        }

        .catalog-scroller {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 2px;
        }

        .catalog-scroller::-webkit-scrollbar {
          width: 4px;
        }

        .catalog-scroller::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .catalog-inner-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 40px;
        }

        .catalog-article-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-color: var(--ds-border-muted);
        }

        .card-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-journal {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ds-accent);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .bookmark-toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          opacity: 0.4;
          transition: opacity 0.2s;
        }

        .bookmark-toggle-btn:hover,
        .bookmark-toggle-btn.saved {
          opacity: 1.0;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 850;
          color: #fff;
          margin: 0;
          line-height: 1.35;
        }

        .card-authors {
          font-size: 0.78rem;
          color: var(--ds-fg-muted);
        }

        .card-abstract {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--ds-fg-muted);
        }

        .card-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          border-top: 1px solid var(--ds-border-muted);
          padding-top: 10px;
        }

        .card-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .card-time {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
        }

        .read-abstract-btn {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .read-abstract-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        /* DETAILED READER VIEW DRAWER */
        .hub-sidebar-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 580px;
          height: 100%;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(24px);
          border-left: 1px solid var(--ds-border-muted);
          z-index: 100;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          box-shadow: -15px 0 45px rgba(0, 0, 0, 0.75);
        }

        .reader-header-deck {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .close-reader-btn {
          color: var(--ds-fg-subtle);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 0;
        }

        .close-reader-btn:hover {
          color: var(--ds-accent);
        }

        .reader-bookmark-btn {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reader-bookmark-btn.saved {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
        }

        .reader-body-scroller {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 8px;
        }

        .reader-body-scroller::-webkit-scrollbar {
          width: 4px;
        }

        .reader-body-scroller::-webkit-scrollbar-thumb {
          background: var(--ds-border-muted);
          border-radius: 2px;
        }

        .reader-inner-wrap {
          display: flex;
          flex-direction: column;
        }

        .reader-meta-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-accent);
          border: 1px solid var(--ds-border-accent);
          background: var(--ds-accent-faint);
          padding: 2px 8px;
          border-radius: 4px;
          align-self: flex-start;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .reader-title {
          font-size: 1.55rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .reader-authors {
          font-size: 0.88rem;
          color: var(--ds-fg-muted);
          font-style: italic;
        }

        .reader-journal-str {
          font-size: 0.7rem;
          font-family: monospace;
          color: var(--ds-fg-subtle);
          margin-top: 2px;
        }

        .reader-divider {
          height: 1px;
          background: var(--ds-border-muted);
          margin: 1.25rem 0;
        }

        .reader-abstract-box {
          background: var(--ds-surface-subtle);
          border: 1px dashed var(--ds-border-muted);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
        }

        .reader-abstract-box strong {
          font-size: 0.75rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }

        .reader-abstract-box p {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ds-fg-muted);
        }

        .highlight-hint-banner {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.72rem;
          line-height: 1.4;
          color: var(--ds-fg-muted);
          margin-bottom: 1.5rem;
        }

        .highlight-span-sample {
          color: var(--ds-accent);
          text-decoration: underline;
          text-decoration-style: dashed;
          font-weight: 600;
        }

        .reader-html-content {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ds-fg-muted);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .reader-html-content h3 {
          font-size: 1.15rem;
          color: #fff;
          margin: 1.5rem 0 0.5rem 0;
        }

        .reader-html-content p {
          margin: 0;
        }

        /* GLOSSARY SPAN INJECTS */
        .glossary-highlight {
          color: var(--ds-accent);
          text-decoration: underline;
          text-decoration-style: dashed;
          text-underline-offset: 3px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .glossary-highlight:hover {
          background: var(--ds-accent-faint);
        }

        .citations-list-box h4 {
          font-size: 0.82rem;
          font-weight: 750;
          color: #fff;
          margin: 0 0 10px 0;
        }

        .citations-list {
          margin: 0;
          padding-left: 20px;
          font-size: 0.75rem;
          line-height: 1.6;
          color: var(--ds-fg-muted);
        }

        /* GLOSSARY OVERLAY DEFINITION MODAL */
        .glossary-overlay-card {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-border-accent);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(57, 255, 20, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          z-index: 120;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .glossary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .glossary-term-lbl {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .close-glossary-btn {
          background: transparent;
          border: none;
          color: var(--ds-fg-subtle);
          cursor: pointer;
          font-size: 0.85rem;
        }

        .close-glossary-btn:hover {
          color: #ef4444;
        }

        .glossary-term-name {
          font-size: 1.05rem;
          font-weight: 900;
          color: #fff;
        }

        .glossary-term-desc {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--ds-fg-muted);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hub-workspace-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            height: auto;
            padding: 1rem;
            gap: 1rem;
          }
          .hub-sidebar-left {
            height: 380px;
          }
          .bookmarks-list-card {
            height: 240px;
          }
          .hub-sidebar-right {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: 1010;
          }
          .hub-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

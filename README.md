# 🔬 BioSphere — Interactive Biology Learning Platform

An immersive, interactive biology education website built with **Next.js 14**, **React Three Fiber**, and **TypeScript**. Explore cells, DNA, microorganisms, and the tree of life through stunning 3D visualizations.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-R3F-green?style=flat-square&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## Features

| Page | Description |
|------|-------------|
| **Hero Landing** | 3D particle field with 3000 swimming microorganisms |
| **Cell Explorer** | Interactive 3D animal cell with clickable organelles |
| **Mitochondria Zoom** | Deep-dive into mitochondria structure (cristae, matrix, mtDNA) |
| **Microorganism Zoo** | 4 animated 3D organisms — Volvox, Chlorella, E. coli, Amoeba |
| **DNA & Genetics** | Rotating double helix with scroll-driven unzip animation |
| **Tree of Life** | SVG phylogenetic tree from Bacteria to Mammals |
| **Biology Quiz** | 3 modes — Label the Cell, Quick Fire MCQ, Fill the Blank |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **3D Engine:** Three.js + React Three Fiber + Drei
- **Animation:** GSAP, CSS Keyframes
- **Smooth Scroll:** Lenis
- **Styling:** Tailwind CSS 4

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/biosphere.git
cd biosphere

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
biosphere/
├── public/
│   └── models/           # 3D model assets (future)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Hero landing page
│   │   ├── layout.tsx                  # Root layout (Navbar, cursor, Lenis)
│   │   ├── globals.css                 # Global dark theme styles
│   │   ├── cell-explorer/
│   │   │   ├── page.tsx                # 3D Cell Explorer
│   │   │   └── mitochondria/page.tsx   # Mitochondria deep-dive
│   │   ├── microorganisms/page.tsx     # Microorganism Zoo
│   │   ├── dna-genetics/page.tsx       # DNA & Genetics
│   │   ├── tree-of-life/page.tsx       # Tree of Life
│   │   ├── quiz/page.tsx               # Biology Quiz (3 modes)
│   │   ├── ecosystems/page.tsx         # Coming soon
│   │   └── human-body/page.tsx         # Coming soon
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx              # Glassmorphic navigation
│   │   │   └── CustomCursor.tsx        # Green glowing cursor
│   │   └── 3d/                         # Shared 3D components
│   └── data/
│       └── biology.json                # Biology data (extensible)
├── next.config.ts
├── tailwind.config.ts (auto via v4)
├── tsconfig.json
└── package.json
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**

### Manual Build

```bash
npm run build   # Creates optimized production build in .next/
npm run start   # Starts production server on port 3000
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#050A05` |
| Primary (Neon Green) | `#39FF14` |
| Accent Green | `#1D9E75` |
| Accent Blue | `#378ADD` |
| Text | `#C8F5C8` |
| Font | `system-ui` |

---

## License

MIT

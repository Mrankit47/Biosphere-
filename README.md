# 🔬 BioSphere — Interactive Biology Learning & Simulation Platform

An immersive, interactive biology education website built with **Next.js 16**, **React Three Fiber (Three.js)**, **Supabase**, and **TypeScript**. BioSphere enables students, educators, and science enthusiasts to explore biology in real-time 3D—ranging from the microscopic structure of organelles to macroscopic ecological systems and human anatomy.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-green?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project & Folder Structure](#-project--folder-structure)
- [Database Schema & Backend](#-database-schema--backend)
- [Installation & Getting Started](#-installation--getting-started)
- [Environment Variables](#-environment-variables)
- [Development Setup & Coding Standards](#-development-setup--coding-standards)
- [Deployment](#-deployment)
- [Future Roadmap & Improvements](#-future-roadmap--improvements)
- [FAQ & Troubleshooting](#-faq--troubleshooting)
- [Security & Contribution Guide](#-security--contribution-guide)
- [License](#-license)
- [Contact Information](#-contact-information)

---

## 🔬 Project Overview

BioSphere is an enterprise-grade web application that leverages hardware-accelerated 3D graphics, rich simulated environments, gamified quizzes, and AI-powered learning agents. Rather than reading static paragraphs, learners manipulate double helices, slice a virtual animal cell, adjust osmolarity values in a microscopic simulation, and consult a dedicated AI biology mentor.

---

## 🌟 Key Features

### 1. Interactive 3D Cell Explorer & Mitochondria Zoom
- **Animal Cell:** Clickable 3D organelles with dynamically loading data-cards detailing structure, function, and scientific significance.
- **Mitochondria Deep Dive:** Zoom past the outer membrane to interact with the inner membrane cristae, matrix, and mitochondrial DNA (mtDNA).

### 2. 🧪 Virtual Laboratory Engine
- **Photosynthesis Visualizer:** Real-time 3D simulation of light and dark reactions.
- **Osmosis & Membrane Visualizer:** Particle-based physical representation of water flow through semipermeable membranes at varying solute concentrations.
- **Catalase Enzyme Visualizer:** Reactive simulation of enzymatic activity with foam and gas production rate charts.
- **Virtual Microscope:** Adjust coarse/fine focus, digital zoom, and objective lens magnification to view pre-loaded slides.
- **Interactive Notebook & AI Viva Examiner:** Integrated student notebook with automated reports and live oral questioning by an AI mentor.

### 3. Microorganism Zoo
- Four highly detailed, animated 3D organisms with customizable flagellar speed, cilia movement, and reproduction rates:
  - **Volvox:** Spherical colonies of flagellated green algae.
  - **Chlorella:** Single-celled microalgae.
  - **E. coli:** Flagellar bacterium.
  - **Amoeba:** Pseudopodial protist.

### 4. Human Anatomy & Double Helix DNA Simulation
- **Human Body Layering:** Interactive slider to adjust opacities of human body systems (skin, skeleton, muscles, etc.).
- **DNA Unzipping:** A scroll-driven, mathematical unzipping simulation of a glowing DNA double helix.

### 5. Advanced Search & Gamified Quiz
- **Phylogenetic Tree of Life:** An SVG-based interactive evolutionary pathway tracing from single-celled bacteria to mammals.
- **Biology Quiz:** Three diverse learning modes (3D Organelle Labeling, Quick-fire Multiple Choice, Fill in the Blanks) linked to user XP and levels.

---

## 🏗️ Architecture Overview

BioSphere operates on a modern multi-tiered architecture:

1. **Presentation Layer:** Built with Next.js 16 (App Router) using Tailwind CSS v4 for ultra-fast, responsive styling, and Lenis for smooth scrolling interactions.
2. **Graphics Engine (3D):** React Three Fiber (R3F) and Drei wrapper over standard WebGL-based Three.js. It features customized shader materials, instanced rendering for massive particle counts, and custom R3F viewport configurations.
3. **Data Layer:** A hybrid local/remote system. Static data lives under `src/data` and `src/knowledge` as structured JSON/TypeScript. User profiles, session paths, logs, certificates, and chat histories sync in real-time with **Supabase**.
4. **AI Reasoning Engine:** Integrated AI agent routes with Next.js backend API endpoints (`src/app/api/chat`) for context-aware biology mentoring and viva exam feedback.

---

## 💻 Tech Stack

- **Framework:** Next.js 16 (React 19, App Router)
- **Language:** TypeScript
- **3D Graphics:** Three.js + React Three Fiber (R3F) + Drei + GSAP (Animations)
- **State & Context:** React 19 Context API / React Compiler optimized hooks
- **Database & Authentication:** Supabase (PostgreSQL with RLS, Auth, trigger procedures)
- **Styling:** Tailwind CSS 4 & PostCSS 11
- **Scroll Engine:** Lenis Smooth Scroll

---

## 📁 Project & Folder Structure

```
biosphere/
├── .github/                   # GitHub Actions workflows & templates
│   ├── ISSUE_TEMPLATE/        # Issue templates (Bug, Feature, Doc, Question)
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                    # Static Assets
│   └── models/                # 3D models served via /models/
├── scripts/                   # Utility Scripts
│   ├── patch-r3f.js           # Post-install script fixing R3F issues with React 19
│   ├── download-hdr.js        # Script to fetch environment lighting assets
│   └── download-images.js     # Script to download texture maps
├── src/
│   ├── app/                   # Next.js App Router Structure
│   │   ├── api/               # API route endpoints (AI Mentorship Chat, etc.)
│   │   ├── cell-explorer/     # Cell Organelle Visualizer & Mitochondria zoom
│   │   ├── disease-explorer/  # Pathogen interactions (viruses, bacteria)
│   │   ├── dna-genetics/      # DNA Double Helix simulation
│   │   ├── ecosystem-simulator/# Macro-scale biology sandbox
│   │   ├── human-body/        # Anatomy visualizer and system opacity explorer
│   │   ├── microorganisms/    # Animated Microorganism Zoo
│   │   ├── tree-of-life/      # Phylogenetics SVG browser
│   │   ├── virtual-lab/       # Core Virtual Laboratory implementation
│   │   └── globals.css        # Global CSS dark theme & custom tailwind directives
│   ├── components/            # Shared UI and Scene Components
│   │   ├── ui/                # Glassmorphic, modern components
│   │   │   └── auth/          # Supabase authentication integration
│   │   ├── microscope/        # Component rendering logic for microscopic slides
│   │   └── virtual-lab/       # Panels (Notebook, Lab report, Chatbot)
│   └── data/                  # Preloaded biology metadata schemas
│       ├── biology.json
│       └── experiments.ts
├── supabase/                  # Supabase integration scripts
│   └── migrations/            # DB Migrations (Schema, Triggers, RLS, Seed data)
├── package.json               # Dependencies and runner script definitions
├── next.config.ts             # NextJS compiler configuration
└── tsconfig.json              # TypeScript compilation specifications
```

---

## 🗄️ Database Schema & Backend

BioSphere utilizes **Supabase** for user profile records, tracking, and gamification data synchronization. Under `supabase/migrations/20260709000000_init_schema.sql`, the schema covers:

- **Profiles & Settings:** User bios, levels, XP rewards, streaks, and customization flags with fully-configured Row Level Security (RLS) policies.
- **Roles & Permissions:** Four explicit user roles (`guest`, `student`, `teacher`, `admin`) with distinct granular access models.
- **Learning Track Tracking:** `learning_paths`, `courses`, `lessons`, and `lesson_progress` schemas mapping out educational pathways.
- **Interactive Logs & Analytics:** Automated triggers that log profile updates and activities into tracking tables.

---

## 🚀 Installation & Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js:** v18.x or later (v20.x+ highly recommended)
- **NPM:** v10.x or later

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/biosphere.git
cd biosphere
```

### 2. Install Dependencies

BioSphere uses a custom post-install step to automatically patch React Three Fiber to resolve React 19 compatibility.

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Environment Variables

To leverage cloud functionality, authentication, and the AI Mentor, create a `.env.local` file in the root directory and configure the variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI or Anthropic Keys (used for AI lab viva mentor)
OPENAI_API_KEY=your_openai_api_key
```

*Note:* If Supabase keys are missing, the application will fallback to safe guest-mode defaults.

---

## 🛠️ Development Setup & Coding Standards

### Linting & Formatting

We maintain extremely high code cleanliness and linting standards. Always verify changes using:

```bash
npm run lint
```

### Clean Architecture Principles

- **Separation of Concerns:** Keep core math and simulation logic isolated from render layouts.
- **No Ref Rendering Side-Effects:** To ensure React Compiler compatibility, avoid accessing React Ref `.current` properties inside rendering logic. Always fetch ref properties inside `useEffect` blocks or custom action callbacks.
- **Types:** Strictly define types in TypeScript; avoid any explicit `any` tags.

---

## 🏗️ Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel.
2. Ensure you add the environment variables specified in your `.env.local` in the Vercel Dashboard project settings.
3. Vercel automatically detects Next.js build parameters and provisions servers.

### Production Build

```bash
# Generate the production build
npm run build

# Boot the production webserver
npm run start
```

---

## 🗺️ Future Roadmap & Improvements

- [ ] **GLTF Compression:** Integrate gltf-pipeline compression for faster 3D model asset streaming on mobile devices.
- [ ] **Ecosystem Simulator Integration:** Expand the macro-scale sandbox with predator-prey differential equations (Lotka-Volterra) and webgl visualization.
- [ ] **Offline Mode:** Introduce service workers and IndexedDB storage patterns for offline-capable biology visualizations in regions with low connectivity.
- [ ] **Teacher LMS Dashboard:** Provide tools for educators to construct custom learning paths, track quiz logs, and grade lab assignments.

---

## ❓ FAQ & Troubleshooting

### Why is R3F failing on React 19?
Ensure you have run `npm install`. Our project uses `scripts/patch-r3f.js` which executes in the postinstall hook to automatically patch Three.js event listeners.

### The AI Mentor or Supabase is not working.
Verify that `.env.local` has been created and that the API keys are correct. Check your browser developer console for resource and network failures.

---

## 🔒 Security & Contribution Guide

To maintain a production-grade enterprise repository, please adhere to:
- **SECURITY.md:** Learn how to report security issues or report vulnerabilities safely.
- **CONTRIBUTING.md:** Read our development workflow rules, Conventional Commits style guide, and branch management procedures.

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## ✉️ Contact Information

For inquiries, support, or partnership proposals, please reach out to us:
- **Website:** [https://biosphere.example.com](https://biosphere.example.com)
- **Email:** support@biosphere.example.com
- **GitHub Issues:** [https://github.com/your-username/biosphere/issues](https://github.com/your-username/biosphere/issues)

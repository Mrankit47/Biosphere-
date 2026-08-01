# Changelog

All notable changes to the BioSphere platform will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

## [Unreleased]

### Added
- Proposal for predator-prey differential equations (Lotka-Volterra) macro-scale simulation.
- Teacher LMS Dashboard blueprint to allow customized student learning paths.
- gltf-pipeline configuration scripts for automated 3D model asset compression.

---

## [1.0.0] - 2026-07-09

### Added
- Implemented **Virtual Laboratory Engine** containing Photosynthesis, Osmosis, Catalase, and Microscope interactive 3D visualizers.
- Created interactive Notebook, Result Panels, Certificate Generator, and AI Mentor sidebar.
- Integrated **Supabase PostgreSQL Schema** with full migrations (`20260709000000_init_schema.sql`), triggers, and strict RLS policies.
- Built **Microorganism Zoo** with 4 interactive, highly configurable 3D species (Volvox, Chlorella, E. coli, Amoeba).
- Developed **Human Body anatomy slider** displaying skin, skeleton, muscles, and complex organs.
- Added DNA Helix unzipping, interactive Cell Explorer, and 3-mode Biology quiz system.
- Automated React Three Fiber configuration via post-install patches for React 19 compatibility.

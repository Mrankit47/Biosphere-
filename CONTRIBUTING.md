# Contributing to BioSphere

First off, thank you for considering contributing to BioSphere! Interactive biology education is built on community collaboration, and your input is incredibly valuable.

This document outlines the guidelines, standards, and workflow required to contribute to BioSphere as an enterprise-grade open-source project.

---

## 📑 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Workflow](#development-workflow)
4. [Branch Naming Guidelines](#branch-naming-guidelines)
5. [Commit Message Standards](#commit-message-standards)
6. [Coding Standards & Rules](#coding-standards--rules)
7. [Versioning Guidelines](#versioning-guidelines)
8. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to `support@biosphere.example.com`.

---

## How Can I Contribute?

- **Reporting Bugs:** Submit a detailed bug report using our issue templates.
- **Suggesting Features:** Propose features or enhancements through feature requests.
- **Improving Documentation:** Clarify existing documents or write new tutorials.
- **Submitting Pull Requests:** Fix issues or add features outlined in our future roadmap.

---

## Development Workflow

1. **Fork the Repository** and clone your fork locally.
2. **Create a Topic Branch** based on the `main` branch.
3. **Install Dependencies:** Run `npm install` (this will automatically patch R3F for React 19 compatibility).
4. **Implement Your Changes** following our coding standards.
5. **Lint and Format:** Run `npm run lint` before committing.
6. **Push Your Branch** and submit a Pull Request.

---

## Branch Naming Guidelines

To keep the repository clean and structured, we recommend using the following branch prefixes:

- `feat/` — For new features (e.g., `feat/lotka-volterra-equations`)
- `fix/` — For bug fixes (e.g., `fix/osmosis-canvas-resize`)
- `docs/` — For documentation updates (e.g., `docs/add-glossary`)
- `refactor/` — For code optimization or restructuring without functional changes
- `chore/` — For general maintenance tasks or package configuration updates

---

## Commit Message Standards

We strictly adopt the **Conventional Commits** standard (v1.0.0) for repository histories. Your commit messages should follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI/CD configurations and scripts
- `chore`: Other changes that don't modify src or test files

### Example Commit Messages

- `feat(virtual-lab): add real-time charts to catalase enzyme visualizer`
- `fix(cell-explorer): resolve card overlap on mobile viewports`
- `docs: update deployment instructions in README`

---

## Coding Standards & Rules

- **Strict TypeScript:** Explicitly define types and interfaces. Avoid using `any` unless absolutely necessary.
- **No Ref Side-Effects:** Do not read or write React Ref `.current` values directly during render, as this disrupts the React Compiler. Interact with Refs inside `useEffect` or callbacks.
- **Tailwind v4 Best Practices:** Utilize utility classes and custom color variables aligned with our Design System.
- **Clean Architecture:** Keep calculations, physical simulation formulas, and 3D rendering elements separated from standard layout pages.

---

## Versioning Guidelines

BioSphere follows **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`.

- **MAJOR** version changes are reserved for incompatible API changes or complete UI overhauls.
- **MINOR** version changes add backwards-compatible functionality.
- **PATCH** version changes introduce backwards-compatible bug fixes.

---

## Reporting Issues

Before creating a new issue, search existing discussions and issues to see if it has already been addressed. If not, use our specific templates to describe your bug, proposal, question, or documentation suggestion.

# Code-Snippet-Playground

Minimal, developer-focused snippet manager that behaves like a to-do list for code. Frontend-only (React + Vite + TypeScript) with Monaco editor, client-side validation, and duplicate detection.

## Features
- Create, edit, delete snippets with IDE-like editor (Monaco).
- Fields: name (unique), description, snippet code, key terms (tags), language (auto-detect or manual).
- Validation: trims leading/trailing spaces (warns when trimming), blocks empty/whitespace-only code.
- Duplicate detection: warns on duplicate name or normalized code content before saving; “save anyway” override.
- Cancel edits, confirm deletes, card-based layout, search + language filter, responsive dark UI.
- LocalStorage persistence (no backend).

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check then build
- `npm run lint` – ESLint rules for TS/React
- `npm run test` – Vitest unit tests
- `npm run preview` – preview production build

## Project Structure
```
src/
	App.tsx             # main UI flow
	components/         # cards, form, modal, editor, tag input
	hooks/useSnippets.ts# localStorage CRUD, validation, duplicate checks
	utils/normalize.ts  # normalization + hashing helpers
```

## CI/CD
GitHub Actions workflows in `.github/workflows/`:
- `ci.yml` – install, lint, test, build on push/PR
- `lint.yml` – lint only
- `test.yml` – run unit tests
- `deploy.yml` – build & placeholder deploy on push to `main`

## Assumptions
- Single-user mocked context; all snippets are local.
- Deployment target/container is configurable; replace placeholder deploy step as needed.
- No backend/API is required per request.

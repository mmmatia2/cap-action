# STATE

Last updated: 2026-03-25  
Owner: project maintainers

## Purpose

This is the active public status snapshot for Cap Me Action.  
If docs conflict with repo code, trust repo code first and update this file.

## Product baseline

- Product type: SOP capture and guide authoring tool.
- Primary mode (implemented): local-first capture -> edit -> export.
- Optional mode (implemented, legacy adapter): Google Apps Script Team Library path.
- Directional mode (not implemented): browser-agnostic self-hosted team backend with web-app-owned auth.

## Implemented (repo-backed)

- Chrome MV3 extension capture client under `extension/`:
  - start/stop capture, floating dock controls, local session persistence in `chrome.storage.local`
  - popup and inspector status surfaces
  - open-in-editor handoff
- React/Vite editor under `app/src/`:
  - local session load/import
  - step editing, ordering, notes, annotations/redactions
  - JSON/Markdown/HTML export
  - import/runtime contract validation before migration
- Contract boundary:
  - canonical schema: `docs/export-schema.json`
  - team protocol: `docs/team-library-protocol.md`
  - shared migration/contract code: `app/src/lib/contracts.ts`, `app/src/lib/migrations.ts`
- Legacy Team Library adapter:
  - app read actions (`listSessions`, `getSession`) use POST body transport
  - Apps Script source in repo at `backend/google-apps-script/team-library/Code.gs`
  - query-token handling retained in backend as compatibility fallback
- Packaging and verification:
  - `pnpm extension:package`
  - `pnpm extension:verify-package`

## Validated (in this repository)

- Build and scripts exist for:
  - app build (`pnpm build:app`)
  - extension syntax check (`pnpm extension:check-syntax`)
  - docs bundle/check (`pnpm docs:bundle`, `pnpm docs:check`)
- Protocol/version constants are explicitly versioned in code and docs:
  - Team sync protocol `1.0.0`
  - Session payload schema `1.1.0`

## Unvalidated / runtime-dependent

- Deployed Apps Script parity with `backend/google-apps-script/team-library/Code.gs`.
- Live hosted browser runtime behavior for all Team Library auth-owner combinations.
- Full browser coverage beyond current manual Chrome/Brave flows.

## Current limits and risks

- Team mode is still tied to a legacy Google adapter path and manual external setup.
- App orchestration remains concentrated in `app/src/App.jsx`.
- Backend deployment is external/manual, so runtime drift from repo source is possible.
- Local storage retention limits may surprise users in long-running capture use.

## Public docs boundary

- Canonical active docs:
  - `README.md`
  - `docs/README.md`
  - `docs/STATE.md`
  - `docs/CHANGELOG.md`
  - `docs/team-library-protocol.md`
  - `docs/export-schema.json`
  - `docs/adr/*.md`
- Historical planning/audit artifacts were removed from this public surface.
- `docs/validation/2026-03-07-linux-mint-auth-boundary-runtime.md` remains intentionally not restored.

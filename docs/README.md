# Documentation

This folder contains public project documentation for Cap Me Action.

## Canonical docs

- `docs/STATE.md`: current product boundary, architecture snapshot, maturity, and known limits.
- `docs/CHANGELOG.md`: notable user-visible changes over time.
- `docs/team-library-protocol.md`: Team Library contract and transport details.
- `docs/export-schema.json`: canonical SOP export/import JSON schema.
- `docs/adr/*.md`: architecture decisions.
- `docs/media/README.md`: release media placeholder and naming convention.

## Public baseline

- Primary path: local-first capture and authoring.
- Optional path: legacy Google Apps Script Team Library adapter.
- Directional path (not implemented yet): browser-agnostic self-hosted team mode.

## Local quick checks

- App dev server: `pnpm dev:app`
- App production build: `pnpm build:app`
- Extension syntax guard: `pnpm extension:check-syntax`
- Extension ID helper: `pnpm extension:print-id`
- OAuth client setter: `pnpm extension:set-oauth-client-id -- --client-id "YOUR_CLIENT_ID.apps.googleusercontent.com"`
- Docs bundle: `pnpm docs:bundle`
- Docs sync guard: `pnpm docs:check`

## Notes

- Basic local flow does not require `.env` configuration.
- `.env.example` is intentionally minimal because no env vars are required for local-first use.
- Public baseline does not commit `manifest.key`; extension ID is therefore not pinned by default.
- The deleted validation snapshot `docs/validation/2026-03-07-linux-mint-auth-boundary-runtime.md` is intentionally not restored.

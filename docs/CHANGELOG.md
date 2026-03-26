# Changelog

All notable user-visible changes should be recorded here.
Historical entries may mention paths that were intentionally removed from the public repository surface.

## 2026-03-25

- Repository surface cleanup for public baseline:
  - Added public root `README.md` and Apache-2.0 `LICENSE`.
  - Removed agent workflow artifacts and historical archive docs from the tracked public surface.
  - Reframed active documentation around public product baseline and maturity status.
  - Updated extension identity/OAuth helpers to handle keyless public baseline truthfully.

## 2026-03-26

- Public release polish pass:
  - Strengthened README framing for portfolio/recruiter clarity.
  - Added media placeholder guide at `docs/media/README.md`.
  - Added minimal `.env.example` clarifying local-first flow does not require env vars.

## 2026-03-06

- Hardening stage: remote team-library flow is now frozen into repo-backed artifacts.
  - Added canonical Apps Script backend source at `backend/google-apps-script/team-library/Code.gs`.
  - Added backend manifest/scopes at `backend/google-apps-script/team-library/appsscript.json`.
  - Added canonical protocol doc at `docs/team-library-protocol.md`.
  - Added first-run setup verification checklist.
  - Added `TEAM_SYNC_PROTOCOL_VERSION = 1.0.0` to team-library bridge requests/responses and backend request paths.
  - Added backend `health` / `version` responses for reproducible setup validation.

## 2026-03-03

- Established a lightweight documentation operating model.
- Added living-doc update rules, ADR templates, PR doc-impact checklist, and CI doc-sync guard.
- Added an execution roadmap for recorder/editor quality and UX improvements.
- Added ADR `0001` to lock Scribe-compatibility launch scope boundary.
- Added execution backlog with milestone-ready implementation tickets.
- Implemented early editor stability fixes:
  - Added `mergeStepWithNext` and `onStepDragEnd` handlers.
  - Removed duplicate `patchStep` declaration in `app/src/App.jsx`.
- Implemented deep-link session handoff:
  - App now parses `source` and `sessionId` from URL query params.
  - App auto-loads/imports requested local/team session when available.
  - App now surfaces clear not-found messages for unresolved deep-linked session IDs.
- Implemented redaction contract consistency:
  - Preserved annotation `type` (`highlight`/`redact`) in app normalization and migration/export helpers.
  - Extended shared annotation contract type with explicit `type` field.
  - Updated HTML export overlays so redactions render as opaque masks and summaries track redactions separately.
- Implemented extension sync settings UI in inspector:
  - Added sync settings form for `enabled`, endpoint URL, auto-upload, masking, and allow-list emails.
  - Added validation and save-state feedback for sync settings persistence in `chrome.storage.local.syncConfig`.
- Advanced sync/auth setup readiness:
  - Added inspector `Sign In` / `Sign Out` controls with connected account display.
  - Added OAuth client ID helper script: `pnpm extension:set-oauth-client-id -- --client-id \"...apps.googleusercontent.com\"`.
  - Expanded setup guidance into a full step-by-step production runbook.

## 2026-03-04

- Hardened Team Sync runbook auth guidance:
  - Added optional `CAPME_DEBUG_AUTH` script property and temporary `debugAuth` probe flow.
  - Updated Apps Script template to resolve token identity via Google userinfo/tokeninfo fallback before session email.
  - Added stricter folder ID parsing and explicit folder access error code for faster setup diagnosis.

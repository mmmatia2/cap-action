# Cap Me Action UI Refresh Direction

## Purpose

This document captures the approved visual direction for the next Cap Me Action UI refresh. It is an implementation guide, not a dependency plan. The prototype is a reference for tone, layout, and component behavior; production code should be adapted into the existing app and extension surfaces without importing the prototype stack wholesale.

## Product Posture

Cap Me Action should feel like a local-first operator cockpit for browser workflow capture:

- Capture locally.
- Repair weak steps quickly.
- Export polished SOP artifacts.
- Optionally hand off artifacts to n8n for storage and distribution.

The product should feel precise, trustworthy, and practical. Avoid generic SaaS dashboard patterns, account-heavy flows, fake analytics, and cloud-first language.

## Surfaces

The refresh must cover all product surfaces as one coherent system:

- Chrome extension popup: start/stop capture, active tab status, recent captures, quick open editor, privacy/masking status.
- Floating capture dock: recording timer, step count, pause/resume, discard last, finish/open editor, minimized state.
- Web editor: step timeline, screenshot annotation workspace, step details, capture evidence inspector, export controls.
- Export and n8n handoff: JSON as editable source, HTML/PDF as deliverables, local webhook status, send/test controls.
- Empty and error states: no captures, no session loaded, screenshot blocked, low-confidence step, webhook unreachable, capture saved.

## Visual Language

Use the approved prototype direction as the north star:

- Warm off-white paper background with subtle grid texture.
- Deep ink/charcoal text and surfaces.
- Compact technical mono labels for metadata, statuses, timestamps, selectors, and quality signals.
- Restrained red for recording/destructive state.
- Steel blue/teal for capture evidence, highlights, and positive technical signals.
- Soft rounded cards and panels, but with precise borders and tight density.
- Instrument-style hierarchy: big numbers for recording time/step count, small labels for machine state.

Do not rely on the prototype app shell as production architecture. Extract the visual system and component ideas only.

## Implementation Guardrails

- Do not add the prototype's full dependency stack.
- Do not import the prototype's shadcn/Radix library wholesale.
- Do not introduce account/sign-in surfaces.
- Do not rename the product to Capture Studio.
- Do not imply cloud publishing; use local-first language.
- Keep extension popup and dock lightweight because they run in constrained extension contexts.
- Avoid remote font dependencies in extension surfaces unless explicitly packaged locally.
- Keep the editor desktop-first, but ensure narrower widths can collapse the timeline and inspector.

## Component Priorities

1. Design tokens: background, ink scale, borders, recording/success/warning/error states, mono metadata labels.
2. Status chips: local, saved, recording, paused, review, error, synced.
3. Popup card system: active tab, record button, recent capture rows, footer actions.
4. Dock states: expanded, minimized, paused, recording, error.
5. Editor shell: timeline, selected step canvas, inspector.
6. Capture evidence inspector: selector, confidence, viewport, screenshot status, visible-at-capture, needs-review.
7. Export cards: source vs deliverable distinction.
8. Empty/error cards with clear recovery actions.

## Sequence

Implement in small, independently validated increments:

1. Popup and dock token refresh.
2. Editor shell and timeline refresh.
3. Capture evidence inspector wired to `step.evidence`.
4. Export and n8n handoff refresh.
5. Empty/error state refresh.

Each increment should preserve existing behavior first, then improve presentation.

## Acceptance Bar

The refresh is successful when:

- Popup, dock, and editor feel like the same product.
- A new user understands that the app is local-first.
- Weak captures are visible and repairable.
- JSON is clearly understood as the editable source artifact.
- HTML/PDF are clearly understood as deliverables.
- n8n is clearly optional storage/distribution automation.
- The UI feels production-ready without pretending the product has cloud/team features it does not have.

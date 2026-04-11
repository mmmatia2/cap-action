# SOP Package Contract

This document defines the current artifact model for Cap Me Action and the target packaging rules the project should keep stable over time.

## Purpose

Cap Me Action exists to capture browser workflows, refine them into maintainable SOPs, and produce artifacts that are easy to reopen, update, store, and distribute.

The package contract is the source of truth for how those artifacts relate to one another.

## Artifact Roles

### JSON

- Editable source artifact.
- Preserves the SOP structure for later re-import and revision in the editor.
- Must remain the canonical machine-readable representation of the SOP package.

### HTML

- Presentation source of truth.
- Captures the intended visual layout and copy for the SOP.
- Serves as the design path that PDF should derive from.
- Exists so the package can be regenerated or re-rendered without losing the authored presentation.

### PDF

- Operator-facing delivery artifact.
- The artifact most suitable for sharing, sending, and consuming outside the editor.
- Should be derived from the HTML design path rather than from a separate unrelated renderer.

## Minimal Package Contents

The minimal durable SOP package is:

1. `basename.json`
2. `basename.html`
3. `basename.pdf`

The package should preserve all three artifacts together when possible.

For operator use, the most important pair is:

- `PDF` for consumption and distribution
- `JSON` for reopening and updating later

`HTML` remains the render source that keeps the package coherent and reproducible.

## Naming And Pairing Rules

- All artifacts in the same SOP package must share the same basename.
- The basename should be stable, predictable, and derived from the same captured SOP identity.
- A package must not split the JSON, HTML, and PDF files across different names.
- Renames should happen as a package-level change, not one file at a time.
- If a package is regenerated, the new revision should remain clearly paired with the prior identity or revision marker.

Recommended basename pattern:

- `YYYY-MM-DDThh-mm-ssZ-slug`

The exact formatter can evolve, but the package must always keep the same basename across artifacts.

## Lifecycle Expectations

The intended lifecycle is:

1. Capture a browser workflow in the extension.
2. Refine it in the editor.
3. Export the SOP artifacts.
4. Store the package.
5. Reopen the JSON when edits are needed.
6. Update the SOP and re-export the package.

This lifecycle must stay friction-light. If reopening and updating are awkward, the utility value drops quickly.

## Current State Versus Target State

### Current state

- The editor can already export SOP artifacts locally.
- The editor can send polished artifact payloads to `n8n`.
- `n8n` currently acts as the storage/distribution layer for exported artifacts.
- The shared-drive flow is working for artifact storage.

### Target state

- `JSON` remains the editable source artifact.
- `HTML` remains the presentation source of truth.
- `PDF` becomes the operator-facing delivery artifact derived from the HTML design path.
- `n8n` stores, routes, and automates the package, but does not become the document generation authority.

## `n8n` Role

`n8n` is the transport and automation layer for finished SOP packages.

It may:

- receive the package payload from Cap Me Action
- store the artifacts in a shared location
- distribute the package to downstream systems or people
- orchestrate follow-up automation around the package

It must not:

- redefine the SOP content model
- become the primary editor
- become the source of truth for the document layout
- invent a second independent SOP schema

## Docker Compatibility Note

Future Docker-hosted `n8n` operation is compatible with this model.

The contract does not depend on a specific runtime host. It only depends on `n8n` being able to receive the package payload and persist or route the paired artifacts in a predictable way.

Do not overdesign around Docker as a special case. It is an implementation choice for the automation layer, not a change to the package contract.

## Non-Goals And Anti-Drift Notes

- Do not turn this package contract into a team collaboration spec.
- Do not make `n8n` the authority for SOP rendering decisions.
- Do not require users to manage three unrelated artifact names.
- Do not allow JSON, HTML, and PDF to drift from one another.
- Do not make the artifact model depend on a cloud-only backend.
- Do not introduce a second canonical export shape without a deliberate versioned migration.

## Practical Rule

If a future change does not improve one of these, it is probably drift:

- editability
- presentation quality
- operator usability
- reproducible pairing
- storage/distribution simplicity


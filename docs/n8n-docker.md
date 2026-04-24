# Docker n8n for Cap Me Action

This repo now has a project-specific Docker compose file for a local n8n runtime that avoids collisions with the other project already using `localhost:5678`.

## Runtime details

- Compose file: `docker/n8n/compose.yml`
- Container name: `cap-me-action-n8n`
- Volume name: `cap_me_action_n8n_data`
- SOP artifacts path: `docker/n8n/artifacts/sops` on the host, mounted at `/home/node/.n8n-files/cap-me-action-sops` in the container
- Host port: `5679`
- Timezone: `America/Sao_Paulo`

## Start it

From the repo root:

```bash
docker compose -f docker/n8n/compose.yml up -d
```

## Check it

```bash
docker compose -f docker/n8n/compose.yml ps
docker compose -f docker/n8n/compose.yml logs -f n8n
```

Then open:

- [http://localhost:5679](http://localhost:5679)

## Stop it

```bash
docker compose -f docker/n8n/compose.yml down
```

The named volume is intentionally separate from other projects, so data stays isolated unless you remove it with `down -v`.

Generated SOP storage workflow artifacts are intentionally outside `/home/node/.n8n` so n8n's default protection for `.n8n` files can remain enabled. The Docker compose bind mount writes them under:

```text
docker/n8n/artifacts/sops
```

Inside the container, the workflow writes to `/home/node/.n8n-files/cap-me-action-sops`. This stays outside `/home/node/.n8n` while using n8n's default file-access allow-list.

## Validation

If Docker is available, this compose file should render cleanly with:

```bash
docker compose -f docker/n8n/compose.yml config
```

That check confirms the syntax and the resolved container/port/volume wiring without starting the container.

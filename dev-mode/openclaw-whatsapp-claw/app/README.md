# WhatsApp Claw — panel app

Standalone read-only panel (v1) over OpenClaw's `wa-history.db`.

## Requirements

Node.js >= 22.5 (for `node:sqlite`). No npm install needed — zero dependencies.

## Run

    node src/main.mjs

Then open the printed `http://127.0.0.1:<port>` URL.

Environment variables:

- `WA_CLAW_DB` — path to wa-history.db (default: `~/.openclaw/dev-mode/wa-history.db`)
- `WA_CLAW_PORT` — panel port (default: `18790`)
- `WA_CLAW_TOKEN` / `OPENCLAW_GATEWAY_TOKEN` — auth token. When set, every
  request must present it (`Authorization: Bearer <token>`, or sign in via the
  `/login` page which sets a cookie). When neither is set the panel is UNGATED.
  Reuse the OpenClaw gateway token (`gateway.auth.token`) so the panel shares
  the same credential as the Control UI.

## Test

    node --test

## Seed a sample database (for local demo without OpenClaw)

    node scripts/seed-sample-db.mjs ./sample.db
    WA_CLAW_DB=./sample.db node src/main.mjs

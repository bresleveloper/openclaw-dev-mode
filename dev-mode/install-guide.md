# Install Guide

## Prerequisites

- An existing OpenClaw installation (the fork reuses `~/.openclaw/`)
- Node.js `>=24.16.0 <25` or `>=26.1.0` (v2026.9.6 engines)
- pnpm 12.4.0 (`npm i -g pnpm@12.4.0`, or corepack on Node 24) — plain npm cannot install this repo (`workspace:*` deps)
- Git

## Installation (VPS / Linux)

```bash
# 1. Stop the gateway
openclaw gateway stop

# 2. Back up the existing openclaw installation
mv /usr/lib/node_modules/openclaw /usr/lib/node_modules/openclaw.bak

# 3. Clone the fork (main ships a pre-built dist/, no build needed on the VPS)
git clone https://github.com/bresleveloper/openclaw-dev-mode.git /opt/openclaw-dev-mode

# 4. Install dependencies
cd /opt/openclaw-dev-mode
CI=true pnpm install --ignore-scripts

# 5. Link bundled plugins to their deps + self-reference link for `openclaw/plugin-sdk/*`
sh dev-mode/link-dist-plugin-deps.sh
ln -sf /opt/openclaw-dev-mode /opt/openclaw-dev-mode/node_modules/openclaw

# 6. Symlink the fork into the original location
#    (the systemd gateway service points at /usr/lib/node_modules/openclaw/)
ln -s /opt/openclaw-dev-mode /usr/lib/node_modules/openclaw

# 7. CLI wrapper
cat > /usr/local/bin/openclaw <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
exec node /opt/openclaw-dev-mode/openclaw.mjs "$@"
EOF
chmod +x /usr/local/bin/openclaw

# 8. Enable dev mode — the only flag
echo 'OPENCLAW_DEV_MODE=1' >> ~/.openclaw/.env

# 9. Migrate state/config for this version, then start
openclaw doctor --fix < /dev/null
openclaw gateway start
```

If a stock `@openclaw/whatsapp` was ever installed from ClawHub, remove it so the fork's bundled
WhatsApp wins: `openclaw plugins uninstall whatsapp < /dev/null` (or `rm -rf ~/.openclaw/extensions/whatsapp`).

Optional (recommended): `openclaw hooks enable session-memory < /dev/null` — saves the last messages to
`memory/` on `/new` and `/reset`.

## Updating

```bash
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && CI=true pnpm install --ignore-scripts && sh dev-mode/link-dist-plugin-deps.sh && ln -sf /opt/openclaw-dev-mode node_modules/openclaw && openclaw gateway restart
```

- pnpm refuses to remove an old `node_modules` without a TTY → `rm -rf node_modules` and rerun.
- WhatsApp/model warmup fails with `Cannot find package 'openclaw'` → rerun the `ln -sf` step, restart.
- After a version upgrade: `openclaw doctor --fix < /dev/null` and read its warnings. WhatsApp needs ~2 minutes after the restart before it answers.

## Reverting to original openclaw

```bash
openclaw gateway stop
sed -i '/OPENCLAW_DEV_MODE/d' ~/.openclaw/.env
rm /usr/lib/node_modules/openclaw
mv /usr/lib/node_modules/openclaw.bak /usr/lib/node_modules/openclaw
openclaw gateway start
```

Removing only the `.env` line (and restarting) turns every dev-mode change off while keeping the fork installed.

## Verify it works

```bash
# Secrets visible in the CLI → dev mode is active
openclaw config get models.providers

# The fork's WhatsApp is the bundled one
grep -rl attachWaHistoryLogger /opt/openclaw-dev-mode/dist/extensions/whatsapp/
openclaw plugins list < /dev/null     # WhatsApp under the bundled root, not "global"
```

In chat: `/status` shows a `▶️ Active model` line; with `/reasoning on`, WhatsApp shows `💭 Reasoning:`
messages; messages land in `~/.openclaw/dev-mode/wa-history.db`. In the Control UI, Settings → Advanced opens
in Raw, unblurred.

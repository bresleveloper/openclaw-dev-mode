# Install Guide

## Prerequisites

- An existing OpenClaw installation
- Node.js 22.12+
- Git

## Installation (VPS / Linux)

```bash
# 1. Stop the gateway
openclaw gateway stop

# 2. Back up the existing openclaw installation
mv /usr/lib/node_modules/openclaw /usr/lib/node_modules/openclaw.bak

# 3. Clone the fork
git clone https://github.com/bresleveloper/openclaw-dev-mode.git /opt/openclaw-dev-mode

# 4. Install dependencies
cd /opt/openclaw-dev-mode
npm install --ignore-scripts

# 5. Symlink our fork into the original location
#    (required because the systemd gateway service points to /usr/lib/node_modules/openclaw/)
ln -s /opt/openclaw-dev-mode /usr/lib/node_modules/openclaw

# 6. Create a CLI wrapper
echo '#!/usr/bin/env bash' > /usr/local/bin/openclaw
echo 'set -euo pipefail' >> /usr/local/bin/openclaw
echo 'exec node /opt/openclaw-dev-mode/openclaw.mjs "$@"' >> /usr/local/bin/openclaw
chmod +x /usr/local/bin/openclaw

# 7. Enable dev mode
echo 'OPENCLAW_DEV_MODE=1' >> ~/.openclaw/.env

# 8. Start the gateway
openclaw gateway start
```

## Opt-in sub-features

The core dev-mode flag is `OPENCLAW_DEV_MODE=1`. A few features are kept behind their own flags so you can enable them independently:

```bash
# Show model thinking/reasoning on WhatsApp with 💭 prefix
OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1

# Save all WhatsApp messages to SQLite at ~/.openclaw/dev-mode/wa-history.db
OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1
```

## Updating

```bash
cd /opt/openclaw-dev-mode && git pull && npm install --ignore-scripts && openclaw gateway restart
```

The `main` branch ships with pre-built `dist/`, so no build step is needed on the VPS. Just pull, install any new dependencies, and restart.

## Reverting to original openclaw

```bash
openclaw gateway stop
# Remove OPENCLAW_DEV_MODE=1 from ~/.openclaw/.env
sed -i '/OPENCLAW_DEV_MODE/d' ~/.openclaw/.env
rm /usr/lib/node_modules/openclaw
mv /usr/lib/node_modules/openclaw.bak /usr/lib/node_modules/openclaw
openclaw gateway start
```

## Verify it works

```bash
# Check config values are unredacted (API keys visible — means dev mode is active)
openclaw config get models.providers
```

# WhatsApp Audit — V2026.3.22 Post-Upgrade (2026-03-23)

## Summary

**WhatsApp is healthy. No echo issues detected.**

## Observations

### Gateway Health

- WhatsApp: `linked (auth age 0m)` — clean session
- Discord: `ok (@ceo)` — recovered after installing `https-proxy-agent`
- All 3 agents loaded: main, ceo, operator

### Log Analysis (post-upgrade)

- **Zero echo/duplicate/recency/Bad MAC/closed session errors**
- WhatsApp messages sent and received cleanly
- Auto-reply pipeline working: inbound → process → agent → outbound (9-20ms delivery)
- `[openclaw] 🦞` prefix appearing in all outbound messages
- Extension loads from source: `extensions/whatsapp/src/auto-reply/deliver-reply.ts`

### What We Saw in Logs

1. SSH login alert came in via WA → agent auto-replied with prefix → no echo
2. API test messages → delivered to WA → no duplication
3. `openclaw message send` → delivered (msg ID 3EB09471835E30A423D4CA) → no echo

### Issues Found

1. **Discord `https-proxy-agent` missing** — V2026.3.22 extension needs it. Fixed with `npm install https-proxy-agent --ignore-scripts`. Discord channels were crash-looping until fixed.
2. **Extension deps not auto-installed** — `npm install --ignore-scripts` at root doesn't pull extension workspace deps. Had to manually install `@whiskeysockets/baileys`, `jimp`, `@buape/carbon`, `https-proxy-agent`.

### WA Session State

- Credentials at `~/.openclaw/credentials/whatsapp/default/` — intact from V3.11
- No credential reset needed — V2026.3.22 WA extension accepted existing session
- Auth age 0m after restart = fresh WebSocket connection, reused creds

## Conclusion

The V2026.3.13 echo disaster was caused by the upstream refactor breaking the append recency filter. V2026.3.22 has the fix (`843e3c1efb`). Our dev-mode changes never touched WA logic (confirmed by audit). The upgrade is clean.

**Previous theory about corrupted Signal session from 3.13 rollback**: Not confirmed — we didn't need to re-pair. The existing V3.11 creds worked fine with V3.22 code.

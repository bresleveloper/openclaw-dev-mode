// [dev-mode] Self-chat reasoning echo guard — a SAFETY NET, not the primary defense.
//
// Why it exists: in WhatsApp self-chat every message the gateway sends comes back as
// an inbound "fromMe" message. On 2026.7.1 echoes were matched by TEXT, SEC-WA1 rewrote
// reasoning text after it was recorded, and the agent answered its own 💭 messages in
// an infinite reply loop (spam in the self-chat).
//
// Primary defense since 2026.9.x (upstream): echoes are matched by WhatsApp MESSAGE ID.
// Every send through the socket-session wrapper records its id
// (inbound/socket-session.ts `rememberOutboundMessage`), and inbound normalization drops
// matching fromMe messages before anything else runs
// (inbound/message-normalization.ts `shouldSkipRecentOutboundEcho`). Text is irrelevant
// there, so 💭 messages are covered. This guard only matters if a send path bypasses
// that wrapper, or an echo lands after a gateway restart (the id cache is in-memory).
//
// Regression notes:
// - Gateway log "Dropped self-chat reasoning echo (dev-mode safety net)" means upstream's
//   id dedupe MISSED an echo: find the send path that skips the socket-session wrapper.
// - If a reasoning loop ever comes back, first check that the 💭 text still matches
//   SELF_CHAT_REASONING_ECHO_RE (see formatDevModeReasoningPayload in ./reasoning.ts).
// - Known side effect: in self-chat, a message YOU type that starts with "Reasoning:"
//   or "💭 Reasoning:" is ignored by the bot.
import { whatsappInboundLog } from "../auto-reply/loggers.js";
import type { AdmittedWebInboundMessage } from "../inbound/types.js";

// Optional "[response prefix] ", optional 💭, then "Reasoning:" — the shapes SEC-WA1
// sends plus the pre-SEC-WA1 prefixed form.
const SELF_CHAT_REASONING_ECHO_RE = /^(?:\[[^\]\n]*\]\s*)?(?:💭\s*)?Reasoning:/u;

/** True when a dev-mode self-chat inbound is our own reasoning message bouncing back. */
export function isDevModeSelfChatReasoningEcho(
  msg: AdmittedWebInboundMessage,
  conversationId: string,
): boolean {
  if (process.env.OPENCLAW_DEV_MODE !== "1" || conversationId !== msg.platform.recipientJid) {
    return false;
  }
  if (!SELF_CHAT_REASONING_ECHO_RE.test(msg.payload.body.trimStart())) {
    return false;
  }
  whatsappInboundLog.info(
    `Dropped self-chat reasoning echo (dev-mode safety net) for ${conversationId}`,
  );
  return true;
}

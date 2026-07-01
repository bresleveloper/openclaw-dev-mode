/**
 * Typed string constants for openclaw-whatsapp-claw.
 *
 * Plain-JS mirror of openclaw-whatsapp-claw.enums.ts.
 * This file exists so that `node --test` (plain Node, no tsx loader) can
 * resolve the `./openclaw-whatsapp-claw.enums.js` import from the TypeScript
 * source under Node's strip-only type-stripping mode, which does NOT remap
 * .js → .ts specifiers. Keep values in sync with the .ts file.
 *
 * A second mirror lives at dev-mode/openclaw-whatsapp-claw/app/src/enums.mjs
 * for the panel app (Object.freeze, same values).
 *
 * Spec: dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md §4.0
 */

// Used in: wa_claw_handlers.handler_type
export const CustomHandlerType = Object.freeze({
  Static: "static", // I1: fixed text reply
  Stateless: "stateless", // I2: single model call, no session
});

// Used in: wa_claw_defaults.handler_type (superset — includes OC-native types)
export const DefaultHandlerType = Object.freeze({
  None: "none", // no default behavior
  Static: "static", // I1
  Stateless: "stateless", // I2
  Cron: "cron", // S1a/S1b/S1c — v3: bash scripts auto-create cron jobs
  Heartbeat: "heartbeat", // S2 — v3: bash scripts auto-configure heartbeats
});

// Used in: panel UI, reverse-mapping result, Column 3 display
export const HandlerTaxonomyId = Object.freeze({
  S1a: "S1a", // Stupid Cron
  S1b: "S1b", // Smart Cron
  S1c: "S1c", // Agent Cron
  S2: "S2", // Heartbeat Tasks
  I1: "I1", // Static Reply
  I2: "I2", // Stateless Call
  I3: "I3", // Thin Agent
  I4: "I4", // Full Agent
});

// Used in: panel display, cron classification logic
export const CronSubType = Object.freeze({
  Stupid: "stupid", // S1a: agentTurn + lightContext:true
  Smart: "smart", // S1b: agentTurn + lightContext:false
  Agent: "agent", // S1c: systemEvent + lightContext:false
});

// Used in: wa_claw_audit.outcome
export const AuditOutcome = Object.freeze({
  Replied: "replied", // model generated a reply, delivered to chat
  Silent: "silent", // model returned NO_REPLY, message dropped
  Escalated: "escalated", // model returned NO_REPLY + sent escalation to owner
  Error: "error", // handler failed (model timeout, send failure, etc.)
});

// Used in: wa_claw_audit.handler (for custom handlers; OC agents use agentId string)
export const AuditHandlerSource = Object.freeze({
  Static: "static", // I1 custom handler
  Stateless: "stateless", // I2 custom handler
  // OC-native handlers use their agentId or cronId string directly
});

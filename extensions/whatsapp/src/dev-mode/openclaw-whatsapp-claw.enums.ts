/**
 * Typed string constants for openclaw-whatsapp-claw.
 *
 * Every DB column that stores a type/status string MUST use one of these
 * enums — no bare string literals in TS code.
 *
 * The panel app (JS) uses an equivalent file at
 * `dev-mode/openclaw-whatsapp-claw/app/src/enums.mjs`. Keep the two in sync.
 *
 * Spec: dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md §4.0
 */

// --- Handler type (which handler is configured for a chat) ---
// Used in: wa_claw_handlers.handler_type
export enum CustomHandlerType {
  Static = "static", // I1: fixed text reply
  Stateless = "stateless", // I2: single model call, no session
}

// Used in: wa_claw_defaults.handler_type (superset — includes OC-native types)
export enum DefaultHandlerType {
  None = "none", // no default behavior
  Static = "static", // I1
  Stateless = "stateless", // I2
  Cron = "cron", // S1a/S1b/S1c — v3: bash scripts auto-create cron jobs
  Heartbeat = "heartbeat", // S2 — v3: bash scripts auto-configure heartbeats
}

// --- Handler taxonomy ID (the 8 handler types in the system) ---
// Used in: panel UI, reverse-mapping result, Column 3 display
export enum HandlerTaxonomyId {
  S1a = "S1a", // Stupid Cron
  S1b = "S1b", // Smart Cron
  S1c = "S1c", // Agent Cron
  S2 = "S2", // Heartbeat Tasks
  I1 = "I1", // Static Reply
  I2 = "I2", // Stateless Call
  I3 = "I3", // Thin Agent
  I4 = "I4", // Full Agent
}

// --- Cron sub-type (classification of S1 crons) ---
// Used in: panel display, cron classification logic
export enum CronSubType {
  Stupid = "stupid", // S1a: agentTurn + lightContext:true
  Smart = "smart", // S1b: agentTurn + lightContext:false
  Agent = "agent", // S1c: systemEvent + lightContext:false
}

// --- Audit outcome (what happened when a message was processed) ---
// Used in: wa_claw_audit.outcome
export enum AuditOutcome {
  Replied = "replied", // model generated a reply, delivered to chat
  Silent = "silent", // model returned NO_REPLY, message dropped
  Escalated = "escalated", // model returned NO_REPLY + sent escalation to owner
  Error = "error", // handler failed (model timeout, send failure, etc.)
}

// --- Audit handler source (who processed the message) ---
// Used in: wa_claw_audit.handler (for custom handlers; OC agents use agentId string)
export enum AuditHandlerSource {
  Static = "static", // I1 custom handler
  Stateless = "stateless", // I2 custom handler
  // OC-native handlers use their agentId or cronId string directly
}

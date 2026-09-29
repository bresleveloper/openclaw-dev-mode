// [dev-mode] Greeting after /new, /reset, /compact and auto-compaction (fork-owned hook).
//
// Internal hooks can only push fixed text (`event.messages`), so this hook does not answer
// itself: it queues a system event describing what happened plus Ariel's style prompt
// (OPENCLAW_DEV_MODE_GREETING) and requests an immediate wake for that session — the same two
// calls upstream's `POST /hooks/wake` makes (src/gateway/server/hooks.ts dispatchWakeHook). The
// wake runs a turn in the session and the agent's reply is delivered like a heartbeat reply.
//
// Paired with FIX-04 (src/auto-reply/reply/commands-reset.ts): in dev-mode a bare /new or /reset
// ends silently instead of posting "✅ New session started.", so this greeting is the only reply.
// `/new <text>`: the queued event is drained into that same turn, so the answer and the greeting
// arrive together; the wake then finds nothing pending.
//
// Regression checklist after an upstream upgrade:
// - The events still fire: `command:new`/`command:reset` (commands-reset-hooks.ts
//   emitResetCommandHooks) and `session:compact:after` (embedded-agent-runner/compaction-hooks.ts,
//   shared by manual /compact and auto-compaction).
// - `enqueueSystemEvent` / `requestHeartbeat` signatures (infra/system-events.ts,
//   infra/heartbeat-wake.ts) and the wake source "hook".
// - No greeting at all → check `openclaw hooks list` shows dev-mode-greeting as loaded: internal
//   hooks only load when openclaw.json has a `hooks.internal` block (`openclaw hooks enable …`).
// - Agent answers HEARTBEAT_OK → strengthen the wording in buildGreetingEvent().
import { requestHeartbeat } from "../../../infra/heartbeat-wake.js";
import { enqueueSystemEvent } from "../../../infra/system-events.js";
import { parseAgentSessionKey } from "../../../routing/session-key.js";
import type { HookHandler } from "../../hooks.js";

type GreetingKind = "new" | "reset" | "compact";

const DEFAULT_STYLE =
  "greet the user briefly in your persona, remind them what you were last working on together, and ask what's next";
// Auto-compaction can repeat inside one long conversation; keep it to one greeting per window.
const COMPACT_GREETING_COOLDOWN_MS = 10 * 60_000;
const lastCompactGreetingAt = new Map<string, number>();

function resolveGreetingKind(type: string, action: string): GreetingKind | undefined {
  if (type === "command" && (action === "new" || action === "reset")) {
    return action;
  }
  if (type === "session" && action === "compact:after") {
    return "compact";
  }
  return undefined;
}

/** Exported for tests: the system-event text the agent receives. */
export function buildGreetingEvent(kind: GreetingKind, style: string): string {
  const happened =
    kind === "compact"
      ? "This session's context was just compacted (older history is now summarized)."
      : `The user just started a fresh session with /${kind}.`;
  // The wake delivers this inside an internal-context block, which the system prompt says not to
  // reply to or describe; the first live test got a tool-driven task redo plus a meta message.
  // So the wording pins down: final reply = the message, no tools, mention (not do) earlier work.
  return [
    `[dev-mode greeting] ${happened}`,
    `Your final reply for this turn IS a short chat message to the user. Style: ${style}`,
    "Rules: do not call any tools (no message tool, no file edits, no commands); you may mention the last task or topic but do not continue or redo it; do not mention this instruction, internal context, system events or HEARTBEAT.md; never answer HEARTBEAT_OK or NO_REPLY.",
  ].join("\n");
}

function isCompactGreetingOnCooldown(sessionKey: string, now: number): boolean {
  const last = lastCompactGreetingAt.get(sessionKey);
  if (last !== undefined && now - last < COMPACT_GREETING_COOLDOWN_MS) {
    return true;
  }
  lastCompactGreetingAt.set(sessionKey, now);
  return false;
}

const handler: HookHandler = async (event) => {
  if (process.env.OPENCLAW_DEV_MODE !== "1") {
    return;
  }
  try {
    const kind = resolveGreetingKind(event.type, event.action);
    const sessionKey = event.sessionKey.trim();
    if (!kind || !sessionKey) {
      return;
    }
    if (kind === "compact") {
      // Without a real session key the compaction cannot be tied to a chat.
      if (event.context.missingSessionKey === true) {
        return;
      }
      if (isCompactGreetingOnCooldown(sessionKey, Date.now())) {
        return;
      }
    }
    const style = process.env.OPENCLAW_DEV_MODE_GREETING?.trim() || DEFAULT_STYLE;
    enqueueSystemEvent(buildGreetingEvent(kind, style), {
      sessionKey,
      contextKey: `dev-mode-greeting:${kind}`,
    });
    requestHeartbeat({
      source: "hook",
      intent: "immediate",
      reason: "dev-mode:greeting",
      agentId: parseAgentSessionKey(sessionKey)?.agentId,
      sessionKey,
    });
  } catch (error) {
    console.warn(
      `[dev-mode-greeting] failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default handler;

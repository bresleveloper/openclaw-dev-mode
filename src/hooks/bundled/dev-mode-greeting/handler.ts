// [dev-mode] Greeting after /new, /reset, /compact and auto-compaction (fork-owned hook).
//
// Internal hooks can only push fixed text (`event.messages`), so this hook does not answer
// itself: it hands the host a session event describing what happened plus Ariel's style prompt
// (OPENCLAW_DEV_MODE_GREETING) for that session: capture the session's target, then
// enqueueSessionEventForHost with source "hook" (session-event-handoff.ts) — the calls upstream
// makes for a hook's terminal event (src/gateway/server/hooks.ts, "hook terminal event") and for
// `POST /hooks/wake` in now mode (hooks-event-dispatch.ts createHookWakeDispatcher). The event
// runs a turn in the session and the agent's reply goes to the route the session last used. Until
// 2026.11.3 this was enqueueSystemEvent + requestHeartbeat (infra/heartbeat-wake.ts); 2026.11.10
// removed the heartbeat wake, and a passive enqueueSystemEvent alone never starts a turn.
//
// Fire and forget: the reset command awaits its hooks (emitResetCommandHooks), and the event's
// turn can only start after that command's own turn ends, so awaiting `accepted` would deadlock.
//
// Paired with FIX-04 (src/auto-reply/reply/commands-reset.ts and commands-reset-hooks.ts): in
// dev-mode a bare /new or /reset ends silently instead of posting "✅ New session started.", so
// this greeting is the only reply. `/new <text>` and `/reset <text>` get no greeting: the text's
// own turn is the first turn. Until 2026.11.3 the greeting event was drained into that turn;
// since 2026.11.10 it would be a turn of its own, so the handler skips it when the event's
// `resetTail` (set by the FIX-04 hook in commands-reset-hooks.ts) is non-empty. `/reset soft`
// counts as text too: it always runs its own startup turn.
//
// Regression checklist after an upstream upgrade:
// - `resetTail` is still set on the `command:new`/`command:reset` context: the hook marked
//   "openclaw-dev-mode FIX-04" in commands-reset-hooks.ts, with `commandBodyNormalized` in its
//   `command` Pick. Without it `/new <text>` gets a second, separate greeting turn again.
// - The events still fire: `command:new`/`command:reset` (commands-reset-hooks.ts
//   emitResetCommandHooks) and `session:compact:after` (embedded-agent-runner/compaction-hooks.ts,
//   shared by manual /compact and auto-compaction).
// - `captureSessionEventTargetForHost` / `enqueueSessionEventForHost` signatures and the "hook"
//   source (auto-reply/reply/session-event-handoff.ts, session-event-contract.ts), and that a
//   producer-owned event still starts its own turn (passive enqueueSystemEvent does not).
// - Live test (none can run locally): bare /new, /reset and /compact in a WhatsApp chat each get
//   one greeting, `/new hello` only the answer; check the log for "[dev-mode-greeting] failed" and
//   for a settled outcome other than "completed" (e.g. "no original external delivery route").
// - No greeting at all → check `openclaw hooks list` shows dev-mode-greeting as loaded: internal
//   hooks only load when openclaw.json has a `hooks.internal` block (`openclaw hooks enable …`).
// - Agent answers HEARTBEAT_OK → strengthen the wording in buildGreetingEvent().
import {
  captureSessionEventTargetForHost,
  enqueueSessionEventForHost,
} from "../../../auto-reply/reply/session-event-handoff.js";
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

/** True when `/new` or `/reset` carried text (FIX-04's `resetTail` context key). */
function hasResetTail(context: Record<string, unknown>): boolean {
  const tail = context.resetTail;
  return typeof tail === "string" && tail.trim().length > 0;
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
    // The text after `/new` or `/reset` runs the first turn itself; a greeting turn would double up.
    if (kind !== "compact" && hasResetTail(event.context)) {
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
    const agentId = parseAgentSessionKey(sessionKey)?.agentId;
    if (!agentId) {
      throw new Error(`session key ${sessionKey} names no agent`);
    }
    const style = process.env.OPENCLAW_DEV_MODE_GREETING?.trim() || DEFAULT_STYLE;
    const expectedTarget = await captureSessionEventTargetForHost(agentId, sessionKey);
    const receipt = enqueueSessionEventForHost(buildGreetingEvent(kind, style), {
      agentId,
      sessionKey,
      source: "hook",
      contextKey: `dev-mode-greeting:${kind}`,
      expectedTarget,
    });
    // Not awaited (see the header); only a refused or failed event is worth a log line.
    void receipt.settled.then(
      (outcome) => {
        if (outcome.status !== "completed") {
          console.warn(
            `[dev-mode-greeting] event not delivered: ${outcome.error ?? outcome.status}`,
          );
        }
      },
      (error: unknown) => {
        console.warn(
          `[dev-mode-greeting] event failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      },
    );
  } catch (error) {
    console.warn(
      `[dev-mode-greeting] failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default handler;

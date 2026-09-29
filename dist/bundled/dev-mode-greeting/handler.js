import { A as parseAgentSessionKey } from "../../session-key-CBvmC8zz.mjs";
import { p as requestSessionEventWake } from "../../heartbeat-wake-bWS25cgK.mjs";
import { i as enqueueSystemEvent } from "../../system-events-ANKIkU0W.mjs";
//#region src/hooks/bundled/dev-mode-greeting/handler.ts
const DEFAULT_STYLE = "greet the user briefly in your persona, remind them what you were last working on together, and ask what's next";
const COMPACT_GREETING_COOLDOWN_MS = 6e5;
const lastCompactGreetingAt = /* @__PURE__ */ new Map();
function resolveGreetingKind(type, action) {
	if (type === "command" && (action === "new" || action === "reset")) return action;
	if (type === "session" && action === "compact:after") return "compact";
}
/** Exported for tests: the system-event text the agent receives. */
function buildGreetingEvent(kind, style) {
	return [
		`[dev-mode greeting] ${kind === "compact" ? "This session's context was just compacted (older history is now summarized)." : `The user just started a fresh session with /${kind}.`}`,
		`Your final reply for this turn IS a short chat message to the user. Style: ${style}`,
		"Rules: do not call any tools (no message tool, no file edits, no commands); you may mention the last task or topic but do not continue or redo it; do not mention this instruction, internal context, system events or HEARTBEAT.md; never answer HEARTBEAT_OK or NO_REPLY."
	].join("\n");
}
function isCompactGreetingOnCooldown(sessionKey, now) {
	const last = lastCompactGreetingAt.get(sessionKey);
	if (last !== void 0 && now - last < COMPACT_GREETING_COOLDOWN_MS) return true;
	lastCompactGreetingAt.set(sessionKey, now);
	return false;
}
const handler = async (event) => {
	if (process.env.OPENCLAW_DEV_MODE !== "1") return;
	try {
		const kind = resolveGreetingKind(event.type, event.action);
		const sessionKey = event.sessionKey.trim();
		if (!kind || !sessionKey) return;
		if (kind === "compact") {
			if (event.context.missingSessionKey === true) return;
			if (isCompactGreetingOnCooldown(sessionKey, Date.now())) return;
		}
		const style = process.env.OPENCLAW_DEV_MODE_GREETING?.trim() || DEFAULT_STYLE;
		enqueueSystemEvent(buildGreetingEvent(kind, style), {
			sessionKey,
			contextKey: `dev-mode-greeting:${kind}`
		});
		requestSessionEventWake({
			source: "hook",
			intent: "immediate",
			reason: "dev-mode:greeting",
			agentId: parseAgentSessionKey(sessionKey)?.agentId,
			sessionKey
		});
	} catch (error) {
		console.warn(`[dev-mode-greeting] failed: ${error instanceof Error ? error.message : String(error)}`);
	}
};
//#endregion
export { buildGreetingEvent, handler as default };

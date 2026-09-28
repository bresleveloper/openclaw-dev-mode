import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
//#region src/channels/thread-bindings-messages.ts
/**
* Channel-neutral thread-binding message builders shared by plugins, ACP, and subagent flows.
* Keep text system-prefixed and compact because callers post it directly into user-visible threads.
*/
const DEFAULT_THREAD_BINDING_FAREWELL_TEXT = "This conversation is no longer bound to that session.";
function normalizeThreadBindingDurationMs(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return 0;
	const durationMs = Math.floor(raw);
	if (durationMs < 0) return 0;
	return durationMs;
}
/** Formats thread-binding timeout durations for compact user-facing messages. */
function formatThreadBindingDurationLabel(durationMs) {
	if (durationMs <= 0) return "disabled";
	if (durationMs < 6e4) return "<1m";
	const totalMinutes = Math.floor(durationMs / 6e4);
	if (totalMinutes % 60 === 0) return `${Math.floor(totalMinutes / 60)}h`;
	return `${totalMinutes}m`;
}
/** Builds the native thread name for a thread-bound session. */
function resolveThreadBindingThreadName(params) {
	const raw = `🤖 ${normalizeOptionalString(params.label) || normalizeOptionalString(params.agentId) || "agent"}`.replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(raw, 100);
}
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
function resolveThreadBindingIntroText(params) {
	const base = normalizeOptionalString(params.label) || normalizeOptionalString(params.agentId) || "agent";
	const normalized = truncateUtf16Safe(base.replace(/\s+/g, " ").trim(), 100) || "agent";
	const idleTimeoutMs = normalizeThreadBindingDurationMs(params.idleTimeoutMs);
	const maxAgeMs = normalizeThreadBindingDurationMs(params.maxAgeMs);
	const cwd = normalizeOptionalString(params.sessionCwd);
	const details = (params.sessionDetails ?? []).map((entry) => entry.trim()).filter((entry) => entry.length > 0);
	if (cwd) details.unshift(`cwd: ${cwd}`);
	const lifecycle = [];
	if (idleTimeoutMs > 0) lifecycle.push(`idle expiry after ${formatThreadBindingDurationLabel(idleTimeoutMs)} inactivity`);
	if (maxAgeMs > 0) lifecycle.push(`max age ${formatThreadBindingDurationLabel(maxAgeMs)}`);
	const intro = lifecycle.length > 0 ? `${normalized} session active (${lifecycle.join("; ")}). Messages here go directly to this session.` : `${normalized} session active. Messages here go directly to this session.`;
	if (details.length === 0) return prefixSystemMessage(intro);
	return prefixSystemMessage(`${intro}\n${details.join("\n")}`);
}
/** Builds the system-prefixed farewell text posted when a thread binding ends. */
function resolveThreadBindingFarewellText(params) {
	const custom = normalizeOptionalString(params.farewellText);
	if (custom) return prefixSystemMessage(custom);
	if (params.reason === "idle-expired") {
		const label = formatThreadBindingDurationLabel(normalizeThreadBindingDurationMs(params.idleTimeoutMs));
		return prefixSystemMessage(`Conversation binding expired after ${label} of inactivity. Messages here will no longer go to that session.`);
	}
	if (params.reason === "max-age-expired") {
		const label = formatThreadBindingDurationLabel(normalizeThreadBindingDurationMs(params.maxAgeMs));
		return prefixSystemMessage(`Conversation binding expired at max age of ${label}. Messages here will no longer go to that session.`);
	}
	return prefixSystemMessage(DEFAULT_THREAD_BINDING_FAREWELL_TEXT);
}
//#endregion
export { resolveThreadBindingThreadName as i, resolveThreadBindingFarewellText as n, resolveThreadBindingIntroText as r, formatThreadBindingDurationLabel as t };

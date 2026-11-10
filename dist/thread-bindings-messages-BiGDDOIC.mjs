import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
//#region src/channels/thread-bindings-messages.ts
/**
* Channel-neutral thread-binding message builders shared by plugins, ACP, and subagent flows.
* Keep text system-prefixed and compact because callers post it directly into user-visible threads.
*/
const DEFAULT_THREAD_BINDING_FAREWELL_TEXT = "This conversation is no longer bound to that session.";
function formatThreadBindingDurationLabel(durationMs) {
	if (durationMs <= 0) return "disabled";
	if (durationMs < 6e4) return "<1m";
	const totalMinutes = Math.floor(durationMs / 6e4);
	if (totalMinutes % 60 === 0) return `${Math.floor(totalMinutes / 60)}h`;
	return `${totalMinutes}m`;
}
function resolveThreadBindingThreadName(params) {
	const raw = `🤖 ${normalizeOptionalString(params.label) || normalizeOptionalString(params.agentId) || "agent"}`.replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(raw, 100);
}
function resolveThreadBindingIntroText(params) {
	const base = normalizeOptionalString(params.label) || normalizeOptionalString(params.agentId) || "agent";
	const normalized = truncateUtf16Safe(base.replace(/\s+/g, " ").trim(), 100) || "agent";
	const idleTimeoutMs = resolveNonNegativeIntegerOption(params.idleTimeoutMs, 0);
	const maxAgeMs = resolveNonNegativeIntegerOption(params.maxAgeMs, 0);
	const cwd = normalizeOptionalString(params.sessionCwd);
	const details = normalizeTrimmedStringList(params.sessionDetails);
	if (cwd) details.unshift(`cwd: ${cwd}`);
	const lifecycle = [];
	if (idleTimeoutMs > 0) lifecycle.push(`idle expiry after ${formatThreadBindingDurationLabel(idleTimeoutMs)} inactivity`);
	if (maxAgeMs > 0) lifecycle.push(`max age ${formatThreadBindingDurationLabel(maxAgeMs)}`);
	const intro = lifecycle.length > 0 ? `${normalized} session active (${lifecycle.join("; ")}). Messages here go directly to this session.` : `${normalized} session active. Messages here go directly to this session.`;
	if (details.length === 0) return prefixSystemMessage(intro);
	return prefixSystemMessage(`${intro}\n${details.join("\n")}`);
}
function resolveThreadBindingFarewellText(params) {
	const custom = normalizeOptionalString(params.farewellText);
	if (custom) return prefixSystemMessage(custom);
	if (params.reason === "idle-expired" || params.reason === "max-age-expired") {
		const idle = params.reason === "idle-expired";
		const label = formatThreadBindingDurationLabel(resolveNonNegativeIntegerOption(idle ? params.idleTimeoutMs : params.maxAgeMs, 0));
		const expiry = idle ? `after ${label} of inactivity` : `at max age of ${label}`;
		return prefixSystemMessage(`Conversation binding expired ${expiry}. Messages here will no longer go to that session.`);
	}
	return prefixSystemMessage(DEFAULT_THREAD_BINDING_FAREWELL_TEXT);
}
//#endregion
export { resolveThreadBindingThreadName as i, resolveThreadBindingFarewellText as n, resolveThreadBindingIntroText as r, formatThreadBindingDurationLabel as t };

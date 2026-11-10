import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-BSzRJm_2.mjs";
import { n as renderUserFacingText } from "./user-facing-text-BNFEPbYx.mjs";
//#region src/sessions/session-agent-status.ts
const SESSION_AGENT_STATUS_NOTE_MAX_CHARS = 120;
const SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES = 30;
const ATTENTION_ICON_IDS = new Set(SESSION_AGENT_ATTENTION_ICON_IDS);
function isSessionAgentAttentionIconId(value) {
	return typeof value === "string" && ATTENTION_ICON_IDS.has(value);
}
function sanitizeSessionAgentStatusNote(value) {
	const normalized = renderUserFacingText(value, { errorContext: true }).replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(normalized, SESSION_AGENT_STATUS_NOTE_MAX_CHARS).trimEnd();
}
function resolveActiveSessionAgentStatus(status, now) {
	if (!status || !status.note.trim() || !Number.isFinite(status.expiresAt) || status.expiresAt <= now) return;
	if (status.attention !== void 0 && !isSessionAgentAttentionIconId(status.attention)) return;
	return status;
}
function sessionAgentStatusExpiresAt(now, ttlMinutes) {
	return now + (ttlMinutes ?? SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES) * 6e4;
}
//#endregion
export { sessionAgentStatusExpiresAt as i, resolveActiveSessionAgentStatus as n, sanitizeSessionAgentStatusNote as r, isSessionAgentAttentionIconId as t };

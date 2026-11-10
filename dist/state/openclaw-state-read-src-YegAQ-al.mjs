import { E as normalizeLowercaseStringOrEmpty } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
//#region packages/session-url-contract/src/session-key.ts
const DEFAULT_MAIN_KEY = "main";
const INCOGNITO_SESSION_RE = /^agent:[^:]+:(?:dashboard|subagent|internal-session-effects):incognito-[^:]+$/u;
/** Classifies process-only agent session keys without consulting runtime registry state. */
function isIncognitoSessionKey(sessionKey) {
	const raw = sessionKey?.trim().toLowerCase();
	return Boolean(raw && INCOGNITO_SESSION_RE.test(raw));
}
/** Split the ownership head without changing opaque tail bytes or empty tail segments. */
function parseAgentSessionKeyParts(sessionKey) {
	if (!sessionKey.startsWith("agent:") && sessionKey.slice(0, 6).toLowerCase() !== "agent:") return null;
	const agentIdEnd = sessionKey.indexOf(":", 6);
	if (agentIdEnd === -1) return null;
	const agentId = sessionKey.slice(6, agentIdEnd).trim();
	const rest = sessionKey.slice(agentIdEnd + 1);
	return agentId && rest && !rest.startsWith(":") ? {
		agentId,
		rest
	} : null;
}
function normalizeMainKey(value) {
	return normalizeLowercaseStringOrEmpty(value) || "main";
}
function buildAgentMainSessionKey(params) {
	return `agent:${normalizeAgentId(params.agentId)}:${normalizeMainKey(params.mainKey)}`;
}
Object.freeze([
	"activity",
	"agents",
	"ai-agents",
	"appearance",
	"approve",
	"apps",
	"ask",
	"automation",
	"automations",
	"channels",
	"chat",
	"communications",
	"config",
	"cron",
	"custodian",
	"dashboard",
	"dashboards",
	"debug",
	"focus",
	"infrastructure",
	"lobsterdex",
	"logs",
	"mcp",
	"meetings",
	"memory-import",
	"model-providers",
	"model-setup",
	"new",
	"nodes",
	"plugin",
	"plugins",
	"portals",
	"profile",
	"sessions",
	"settings",
	"share",
	"skills",
	"systems",
	"terminal",
	"usage",
	"workboard",
	"worktrees"
]);
//#endregion
export { parseAgentSessionKeyParts as a, normalizeMainKey as i, buildAgentMainSessionKey as n, isIncognitoSessionKey as r, DEFAULT_MAIN_KEY as t };

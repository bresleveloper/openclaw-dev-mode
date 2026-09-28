import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import crypto from "node:crypto";
//#region src/config/sessions/internal-session-key.ts
const INTERNAL_SESSION_EFFECTS_SEGMENT = "internal-session-effects";
const INTERNAL_SESSION_EFFECTS_REST_PREFIX = `${INTERNAL_SESSION_EFFECTS_SEGMENT}:`;
function normalizeInternalRunId(runId) {
	return `${runId.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 48) || "run"}-${crypto.createHash("sha256").update(runId).digest("hex").slice(0, 16)}`;
}
/** Resolves the hidden SQLite session identity owned by one internal-effects run. */
function resolveInternalSessionEffectsIdentity(params) {
	const suffix = normalizeInternalRunId(params.runId);
	const keySuffix = params.incognito ? `incognito-${suffix}` : suffix.startsWith("incognito-") ? `legacy-${suffix}` : suffix;
	return {
		sessionId: `${INTERNAL_SESSION_EFFECTS_SEGMENT}-${suffix}`,
		sessionKey: `agent:${normalizeAgentId(params.agentId)}:${INTERNAL_SESSION_EFFECTS_SEGMENT}:${keySuffix}`
	};
}
/** Returns true for SQLite entries that exist only to contain suppressed run effects. */
function isInternalSessionEffectsKey(sessionKey) {
	if (!sessionKey.startsWith("agent:")) return false;
	const agentEnd = sessionKey.indexOf(":", 6);
	return agentEnd >= 0 && sessionKey.startsWith(INTERNAL_SESSION_EFFECTS_REST_PREFIX, agentEnd + 1);
}
//#endregion
export { resolveInternalSessionEffectsIdentity as n, isInternalSessionEffectsKey as t };

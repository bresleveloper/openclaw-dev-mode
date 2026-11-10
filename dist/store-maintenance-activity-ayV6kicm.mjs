import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey, S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
//#region src/config/sessions/store-maintenance-activity.ts
function isGatewayModelRunSessionKey(sessionKey) {
	return /^agent:([^:\s]+):explicit:model-run-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionKey);
}
function getSessionMaintenanceActivityAt(entry) {
	return Math.max(entry?.lastInteractionAt ?? 0, entry?.lastActivityAt ?? 0, entry?.sessionStartedAt ?? 0, entry?.updatedAt ?? 0);
}
function isSyntheticSessionMaintenanceKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	const rest = normalizeLowercaseStringOrEmpty(parsed?.rest ?? sessionKey);
	return isGatewayModelRunSessionKey(sessionKey) || isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey) || isCronSessionKey(sessionKey) || rest.startsWith("acp-bridge:") || rest.startsWith("hook:") || rest.startsWith("node:") || rest === "heartbeat" || rest.endsWith(":heartbeat") || rest.includes(":heartbeat:");
}
function isRecentSessionMaintenanceEntry(params) {
	if (params.preserveRecentMs == null || isSyntheticSessionMaintenanceKey(params.key)) return false;
	const activityAt = getSessionMaintenanceActivityAt(params.entry);
	const now = params.nowMs ?? Date.now();
	return activityAt > 0 && now - activityAt <= params.preserveRecentMs;
}
//#endregion
export { isSyntheticSessionMaintenanceKey as i, isGatewayModelRunSessionKey as n, isRecentSessionMaintenanceEntry as r, getSessionMaintenanceActivityAt as t };

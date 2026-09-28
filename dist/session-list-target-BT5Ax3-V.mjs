import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey, b as isCronRunSessionKey } from "./session-key-CBvmC8zz.mjs";
//#region src/gateway/session-list-target.ts
function readSessionListSelectionFacts(key, entry) {
	const parsed = parseAgentSessionKey(key);
	return {
		agentId: parsed ? normalizeAgentId(parsed.agentId) : void 0,
		isCronRun: isCronRunSessionKey(key),
		isSubagent: isSubagentSessionKey(key) || Boolean(entry?.spawnedBy && !parsed?.rest.toLowerCase().startsWith("dashboard:") && !normalizeOptionalString(entry.category)),
		isPhantom: entry?.updatedAt == null && !normalizeOptionalString(entry?.sessionId) && parsed?.rest === "sessions"
	};
}
//#endregion
export { readSessionListSelectionFacts as t };

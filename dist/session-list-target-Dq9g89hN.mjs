import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as isSubagentSessionRow, r as isSystemCreatedSessionRow, t as isCronSessionDisplayKey } from "./session-list-visibility-DANqo5ac.mjs";
//#region src/gateway/session-list-target.ts
function readSessionListSelectionFacts(key, entry) {
	const parsed = parseAgentSessionKey(key);
	return {
		agentId: parsed ? normalizeAgentId(parsed.agentId) : void 0,
		isCronRun: isCronRunSessionKey(key),
		isCron: isCronSessionDisplayKey(key),
		isDock: entry?.createdSurface === "plugin-dock",
		isSystem: isSystemCreatedSessionRow({
			key,
			createdActor: entry?.createdActor,
			createdVia: entry?.createdVia,
			label: entry?.label,
			displayName: entry?.displayName,
			subject: entry?.subject,
			classification: entry?.heartbeatIsolatedBaseSessionKey ? "heartbeat" : void 0
		}),
		isSubagent: isSubagentSessionRow(key, entry),
		isPhantom: entry?.updatedAt == null && !normalizeOptionalString(entry?.sessionId) && parsed?.rest === "sessions"
	};
}
//#endregion
export { readSessionListSelectionFacts as t };

import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/system-agent/agent-id.ts
const SYSTEM_AGENT_ID = "openclaw";
const SYSTEM_AGENT_ROSTER_ENTRIES = [{
	id: SYSTEM_AGENT_ID,
	kind: "system"
}, {
	id: "crestodian",
	kind: "system"
}];
const RESERVED_SYSTEM_AGENT_IDS = new Set(SYSTEM_AGENT_ROSTER_ENTRIES.map((entry) => normalizeAgentId(entry.id)));
function isReservedSystemAgentId(agentId) {
	return RESERVED_SYSTEM_AGENT_IDS.has(normalizeAgentId(agentId));
}
//#endregion
export { SYSTEM_AGENT_ROSTER_ENTRIES as n, isReservedSystemAgentId as r, SYSTEM_AGENT_ID as t };

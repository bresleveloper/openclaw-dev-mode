import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
//#region src/commands/doctor/shared/codex-route-agent-entries.ts
/** Lists mutable canonical agent entries, with legacy list fallback for raw Doctor input. */
function listMutableCodexRouteAgentEntries(cfg) {
	const agents = asOptionalRecord(asOptionalRecord(cfg)?.agents);
	const entries = asOptionalRecord(agents?.entries);
	if (entries) return Object.entries(entries).flatMap(([entryId, value]) => {
		const agent = asOptionalRecord(value);
		return agent ? [{
			agent,
			agentId: normalizeAgentId(entryId),
			path: `agents.entries.${entryId}`
		}] : [];
	});
	return (Array.isArray(agents?.list) ? agents.list : []).flatMap((value, index) => {
		const agent = asOptionalRecord(value);
		if (!agent) return [];
		const pathId = typeof agent.id === "string" && agent.id.trim() ? agent.id.trim() : String(index);
		return [{
			agent,
			agentId: normalizeAgentId(typeof agent.id === "string" ? agent.id : void 0),
			path: `agents.list.${pathId}`
		}];
	});
}
//#endregion
export { listMutableCodexRouteAgentEntries as t };

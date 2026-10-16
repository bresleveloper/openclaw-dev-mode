import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/implicit-agent-roster.ts
/** Materialize fresh-install defaults without interpreting persisted legacy rosters. */
function applyImplicitAgentRosterDefaults(raw) {
	if (!isRecord(raw) || raw.agents !== void 0 && !isRecord(raw.agents)) return raw;
	const agents = isRecord(raw.agents) ? raw.agents : {};
	if (agents.ownership === "explicit" || Object.hasOwn(agents, "list") && (!Array.isArray(agents.list) || agents.list.length > 0) || agents.entries !== void 0 && (!isRecord(agents.entries) || Object.keys(agents.entries).length > 0)) return raw;
	const { list: _emptyList, ...defaults } = agents;
	return {
		...raw,
		agents: {
			...defaults,
			entries: { main: {} }
		}
	};
}
//#endregion
export { applyImplicitAgentRosterDefaults as t };

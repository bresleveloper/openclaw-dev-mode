import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import "./includes-CaaCq-XN.mjs";
import { E as listAgentEntries, T as hasAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/config/agent-roster-provenance.ts
function rosterEntryBoundaryContainsInclude(value) {
	if (!isRecord(value)) return false;
	if (Object.hasOwn(value, "$include")) return true;
	return [value.id, value.default].some((field) => isRecord(field) && Object.hasOwn(field, "$include"));
}
function authoredRosterBoundaryContainsInclude(value) {
	if (isRecord(value) && Object.hasOwn(value, "$include")) return true;
	if (Array.isArray(value)) return value.some(rosterEntryBoundaryContainsInclude);
	if (!isRecord(value)) return false;
	return Object.values(value).some(rosterEntryBoundaryContainsInclude);
}
function readRosterValue(raw) {
	if (!isRecord(raw) || !isRecord(raw.agents)) return;
	if (Object.hasOwn(raw.agents, "entries")) return raw.agents.entries;
	return Object.hasOwn(raw.agents, "list") ? raw.agents.list : void 0;
}
/**
* Roster include ownership decision table:
* - Include-owned: an include contributes membership or default metadata at agents.entries/list,
*   an entry object, an id/default field, a nested entries/list $include, or an ambiguous
*   byte-identical roster contribution.
* - Locally owned: ancestor includes contribute only unrelated config, or an include is nested
*   inside entry-internal identity/model/etc. fields that cannot change membership or default;
*   canonical roster writes preserve those entry-internal authored include nodes in place.
*/
function includeContributionOwnsAgentRoster(event) {
	if (event.path.length === 0) return hasAgentRosterProperty(event.value);
	if (event.path.length === 1 && event.path[0] === "agents") return isRecord(event.value) && (Object.hasOwn(event.value, "entries") || Object.hasOwn(event.value, "list"));
	if (event.path[0] !== "agents") return false;
	if (event.path[1] === "entries") return event.path.length <= 3 || event.path[3] === "default";
	if (event.path[1] === "list") return event.path.length <= 3 || event.path[3] === "id" || event.path[3] === "default";
	return false;
}
function includeContributionOwnsBindings(event) {
	if (event.path.length === 0) return isRecord(event.value) && Object.hasOwn(event.value, "bindings");
	return event.path[0] === "bindings";
}
/** Whether include/env resolution produced a non-empty roster before raw migrations. */
function hasResolvedRosterBeforeMigrations(snapshot) {
	return listAgentEntries(snapshot.sourceConfigBeforeMigrations ?? {}).length > 0;
}
/** Whether an include, rather than the authored root, owns agents.entries. */
function configIncludeOwnsAgentRosterValues(params) {
	const resolved = params.sourceConfigBeforeMigrations;
	if (!hasAgentRosterProperty(resolved)) return false;
	if (authoredRosterBoundaryContainsInclude(readRosterValue(params.parsed))) return true;
	return params.includeContributesRoster === true;
}
/** Whether an include, rather than the authored root, owns agents.entries. */
function configIncludeOwnsAgentRoster(snapshot) {
	return configIncludeOwnsAgentRosterValues({
		parsed: snapshot.parsed,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		includeContributesRoster: snapshot.agentRosterIncludeOwned
	});
}
//#endregion
export { includeContributionOwnsBindings as a, includeContributionOwnsAgentRoster as i, configIncludeOwnsAgentRosterValues as n, hasResolvedRosterBeforeMigrations as r, configIncludeOwnsAgentRoster as t };

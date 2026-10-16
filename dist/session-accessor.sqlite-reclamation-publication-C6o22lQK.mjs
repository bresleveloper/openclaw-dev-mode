import { t as prepareCommittedSessionEntryRemovals } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
//#region src/config/sessions/session-accessor.sqlite-reclamation-publication.ts
function prepareReclamationPublication(plan, databaseIdentity, result) {
	if (plan.kind === "lifecycle-projection-commit" && result?.kind === plan.kind) {
		const removed = new Set(result.value.removedSessionKeys);
		return prepareCommittedSessionEntryRemovals(plan.agentId, databaseIdentity, plan.input.projected.removals.filter(({ sessionKey }) => removed.has(sessionKey)));
	}
	if (plan.kind === "maintenance-finalize" && result?.kind === "maintenance-finalize") return prepareCommittedSessionEntryRemovals(plan.agentId, databaseIdentity, result.value.committedEntries);
	if (plan.kind === "lifecycle-artifacts") return prepareCommittedSessionEntryRemovals(plan.agentId, databaseIdentity, plan.entries);
}
function collectReclamationChangedSessionKeys(plan, result) {
	switch (result.kind) {
		case "lifecycle-projection-commit": return [...result.value.removedSessionKeys, ...result.value.maintenancePlans.flatMap((maintenance) => maintenance.archivedSessionKeys)];
		case "deletion-plan":
		case "lifecycle-projection-plan":
		case "lifecycle-projection-count": return [];
		case "maintenance-plan": return result.value.archivedSessionKeys;
		case "maintenance-finalize": return result.value.committedEntries.map(({ sessionKey }) => sessionKey);
		case "maintenance-preservation-required":
		case "maintenance-plan-stale":
		case "maintenance-statistics":
		case "maintenance-age": return [];
		default: return [...plan.materializedPlans.flatMap(({ snapshot }) => snapshot.sessionKey ? [snapshot.sessionKey] : []), ...plan.kind === "lifecycle-artifacts" ? plan.entries.map(({ sessionKey }) => sessionKey) : plan.kind === "entry" || plan.kind === "historical-generation" ? [plan.deleteParams.target.canonicalKey, ...plan.deleteParams.target.storeKeys] : []];
	}
}
//#endregion
export { prepareReclamationPublication as n, collectReclamationChangedSessionKeys as t };

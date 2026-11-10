import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as prepareCommittedSessionEntryRemovals, o as publishCommittedSessionIdentity, t as collectLifecycleIdentityChanges } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
//#region src/config/sessions/session-accessor.sqlite-reclamation-publication.ts
/** Native ownership follows actual removed rows, including maintenance's optimistic skips. */
function collectReclamationDeletionEntries(plan, result) {
	if (plan.kind === "entry") return result?.kind === "entry" && !result.value.deleted ? [] : plan.preparedTargetSnapshot;
	const entries = plan.kind === "lifecycle-projection-commit" ? plan.input.projected.removals.filter(({ sessionKey }) => !plan.input.projected.upsertedEntries.some((upsert) => upsert.sessionKey === sessionKey)) : plan.kind === "maintenance-finalize" && result?.kind === "maintenance-finalize" ? result.value.committedEntryIndices.map((index) => expectDefined(plan.entries[index], "Missing committed maintenance entry")) : plan.entries;
	const removed = result?.kind === "lifecycle-projection-commit" ? new Set(result.value.removedSessionKeys) : void 0;
	return entries.flatMap(({ sessionKey, expectedEntry: entry }) => entry && (!removed || removed.has(sessionKey)) ? [{
		sessionKey,
		entry
	}] : []);
}
function prepareReclamationPublication(plan, databaseIdentity, result) {
	if (plan.kind === "lifecycle-projection-commit" && result?.kind === plan.kind) {
		const { previous, current } = collectLifecycleIdentityChanges(plan.input.projected, result.value.removedSessionKeys);
		return () => publishCommittedSessionIdentity(plan.agentId, databaseIdentity, previous, current);
	}
	if (plan.kind === "maintenance-finalize" && result?.kind === "maintenance-finalize") return prepareCommittedSessionEntryRemovals(plan.agentId, databaseIdentity, result.value.committedEntryIndices.map((index) => expectDefined(plan.entries[index], "Missing committed maintenance entry")));
	if (plan.kind === "lifecycle-artifacts") return prepareCommittedSessionEntryRemovals(plan.agentId, databaseIdentity, plan.entries);
}
function collectReclamationChangedSessionKeys(plan, result) {
	if (result.kind === "history-eviction" && !result.value.deleted) return [];
	switch (result.kind) {
		case "lifecycle-projection-commit": return [
			...result.value.removedSessionKeys,
			...plan.kind === "lifecycle-projection-commit" ? plan.input.projected.upsertedEntries.map(({ sessionKey }) => sessionKey) : [],
			...result.value.maintenancePlans.flatMap((maintenance) => maintenance.archivedEntries.map(({ sessionKey }) => sessionKey))
		];
		case "lifecycle-projection-plan": return [];
		case "maintenance-plan": return result.value.archivedEntries.map(({ sessionKey }) => sessionKey);
		case "maintenance-finalize":
			if (plan.kind !== "maintenance-finalize") throw new Error("SQLite maintenance result has no matching plan");
			return result.value.committedEntryIndices.map((index) => expectDefined(plan.entries[index], "Missing committed maintenance entry").sessionKey);
		case "maintenance-plan-stale":
		case "maintenance-statistics":
		case "maintenance-age": return [];
		default: return [...plan.materializedPlans.flatMap(({ snapshot }) => snapshot.sessionKey ? [snapshot.sessionKey] : []), ...plan.kind === "lifecycle-artifacts" ? plan.entries.map(({ sessionKey }) => sessionKey) : plan.kind === "entry" || plan.kind === "historical-generation" ? [plan.deleteParams.target.canonicalKey, ...plan.deleteParams.target.storeKeys] : []];
	}
}
//#endregion
export { collectReclamationDeletionEntries as n, prepareReclamationPublication as r, collectReclamationChangedSessionKeys as t };

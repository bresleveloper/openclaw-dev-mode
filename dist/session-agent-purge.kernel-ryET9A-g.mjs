import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as resolveStoredSessionOwnerAgentId } from "./session-store-key-DKpto8R6.mjs";
import { a as deleteMaterializedSessionStatePlans, c as planSessionStateAfterEntryRemoval, i as collectProjectedReferencedSessionIds, o as deletePlannedLifecycleArtifactEntries, t as assertPlannedLifecycleArtifactEntriesUnchanged } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
//#region src/config/sessions/session-agent-purge.kernel.ts
function isDeletedAgentEntry(input, sessionKey) {
	return resolveStoredSessionOwnerAgentId({
		cfg: input.cfg,
		agentId: input.storeAgentId,
		sessionKey
	}) === input.agentId;
}
function prepareSessionAgentPurgeInDatabase(database, input) {
	const store = readSessionEntryStore(database);
	const remainingStore = { ...store };
	const entryRemovals = Object.entries(store).flatMap(([sessionKey, entry]) => {
		if (!isDeletedAgentEntry(input, sessionKey)) return [];
		delete remainingStore[sessionKey];
		return [{
			expectedEntry: structuredClone(entry),
			sessionKey
		}];
	});
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: entryRemovals.map(({ sessionKey }) => sessionKey),
		projectedStore: remainingStore,
		candidateSessionIds: entryRemovals.flatMap(({ expectedEntry }) => collectSessionStateIdsForEntry(expectedEntry))
	});
	return {
		deletePlans: entryRemovals.flatMap(({ expectedEntry: entry }) => planSessionStateAfterEntryRemoval({
			archiveDirectory: input.archiveDirectory,
			database,
			entry,
			reason: "deleted",
			referencedSessionIds
		})),
		entryRemovals
	};
}
function commitSessionAgentPurgeInDatabase(database, input, applyMaintenance) {
	const currentOwnedSessionKeys = Object.keys(readSessionEntryStore(database)).filter((sessionKey) => isDeletedAgentEntry(input, sessionKey)).toSorted();
	const plannedSessionKeys = input.entryRemovals.map(({ sessionKey }) => sessionKey).toSorted();
	if (JSON.stringify(currentOwnedSessionKeys) !== JSON.stringify(plannedSessionKeys)) throw new Error("SQLite deleted-agent session entries changed before purge");
	assertPlannedLifecycleArtifactEntriesUnchanged(database, input.entryRemovals);
	const archivedTranscripts = deleteMaterializedSessionStatePlans(database, input.materializedPlans, void 0, new Set(plannedSessionKeys));
	deletePlannedLifecycleArtifactEntries(database, input.entryRemovals);
	return {
		archivedTranscripts,
		maintenancePlans: [applyMaintenance(database)]
	};
}
//#endregion
export { prepareSessionAgentPurgeInDatabase as n, commitSessionAgentPurgeInDatabase as t };

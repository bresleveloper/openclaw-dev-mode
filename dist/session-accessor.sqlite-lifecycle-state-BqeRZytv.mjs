import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { G as sqliteSessionIdWriteScope, L as retireSqliteDatabaseWriteScopes, U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as collectSessionStateIdsForEntry, s as addRetainedWindowSessionReferences } from "./transcript-event-media-C4aKs47S.mjs";
import { d as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as readSessionColdTranscript } from "./session-cold-storage-state-CWFSrppd.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { a as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as readSessionStateDeleteSnapshot, r as sqliteSessionStateDeleteSnapshotsEqual, t as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { r as deleteSessionEntryRows } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as persistSessionTranscriptArchive } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-reference-projection.ts
const sessionReferenceProjection = sql`CASE WHEN json_valid(entry_json) THEN CASE
    WHEN current_session_id NOT GLOB '*[^A-Za-z0-9._:@-]*'
      AND length(CAST(current_session_id AS BLOB)) = length(CAST(printf('%s', current_session_id) AS BLOB))
      AND json_type(entry_json, '$.previousSessionId') IS NULL
      AND json_type(entry_json, '$.usageFamilySessionIds') IS NULL
      AND json_type(entry_json, '$.compactionCheckpoints') IS NULL
      THEN '{}'
    WHEN (SELECT encoding FROM pragma_encoding) = 'UTF-8'
      AND length(CAST(entry_json AS BLOB)) = length(CAST(printf('%s', entry_json) AS BLOB))
      AND instr(entry_json, '\\u') = 0
      AND json_type(entry_json, '$.sessionId') = 'text'
      AND json_extract(entry_json, '$.sessionId') = current_session_id
      AND json_type(entry_json, '$.updatedAt') IN ('integer', 'real')
      AND json_extract(entry_json, '$.updatedAt') BETWEEN -1.7976931348623157e308 AND 1.7976931348623157e308
      AND NOT EXISTS (
        SELECT 1 FROM json_each(entry_json)
        WHERE key IN ('sessionId', 'updatedAt', 'previousSessionId', 'usageFamilySessionIds', 'compactionCheckpoints')
        GROUP BY key HAVING count(*) > 1
      )
    THEN json_object(
      'sessionId', json_extract(entry_json, '$.sessionId'),
      'previousSessionId', json_extract(entry_json, '$.previousSessionId'),
      'usageFamilySessionIds', json_extract(entry_json, '$.usageFamilySessionIds'),
      'compactionCheckpoints', json_extract(entry_json, '$.compactionCheckpoints')
    ) END END`.as("reference_json");
const usableSessionReferenceProjection = sql`CASE WHEN reference_json = '{}' THEN reference_json
    WHEN reference_json IS NOT NULL
    AND json_type(reference_json, '$.previousSessionId') IN ('text', 'null')
    AND json_type(reference_json, '$.usageFamilySessionIds') IN ('array', 'null')
    AND json_type(reference_json, '$.compactionCheckpoints') IN ('array', 'null')
    AND NOT EXISTS (
      SELECT 1 FROM json_each(reference_json, '$.usageFamilySessionIds')
      WHERE type NOT IN ('text', 'null')
    )
    AND NOT EXISTS (
      SELECT 1 FROM json_each(reference_json, '$.compactionCheckpoints')
      WHERE json_type(reference_json, '$.compactionCheckpoints') = 'array'
        AND CASE WHEN type = 'object' THEN
        json_type(value, '$.preCompaction') IS NOT 'object'
        OR json_type(value, '$.postCompaction') IS NOT 'object'
        OR coalesce(json_type(value, '$.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.preCompaction.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.sessionId'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.preCompaction.sessionFile'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.sessionFile'), 'null') NOT IN ('text', 'null')
        OR coalesce(json_type(value, '$.postCompaction.entryId'), 'null') NOT IN ('text', 'null')
        ELSE 1 END
    )
    AND NOT EXISTS (
      SELECT 1 FROM json_tree(reference_json)
      WHERE key IS NOT NULL GROUP BY parent, key HAVING count(*) > 1
    )
    THEN reference_json END`.as("references");
const sessionReferenceAtoms = sql`json_tree("references")`.as("reference");
const sessionReferenceAtomPath = sql`reference.type = 'text' AND (
    reference.fullkey IN ('$.sessionId', '$.previousSessionId')
    OR reference.fullkey GLOB '$.usageFamilySessionIds[[]*[]]'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].preCompaction.sessionId'
    OR reference.fullkey GLOB '$.compactionCheckpoints[[]*[]].postCompaction.sessionId'
  )`;
//#endregion
//#region src/config/sessions/session-entry-lifecycle-removal.ts
function shouldRemoveSessionEntry(entry, removal) {
	if (!entry) return false;
	if (removal.expectedEntry !== void 0 && !sqliteSessionEntriesEqual(entry, removal.expectedEntry)) return false;
	if (removal.expectedSessionId !== void 0 && (removal.expectedSessionId === null ? entry.sessionId !== void 0 : entry.sessionId !== removal.expectedSessionId)) return false;
	if (removal.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== removal.expectedLifecycleRevision) return false;
	return removal.expectedUpdatedAt === void 0 || entry.updatedAt === removal.expectedUpdatedAt;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-lifecycle-state.ts
/** Session ids protected by live node state. */
function readReferencedSessionIds(database, excludedSessionKeys = /* @__PURE__ */ new Set(), candidateSessionIds, diskBudget) {
	if (candidateSessionIds?.length === 0) return /* @__PURE__ */ new Set();
	const db = getSessionKysely(database.db);
	const excludedKeys = [...excludedSessionKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	let query = db.selectFrom("session_nodes").select(["current_session_id", "session_key"]).$if(excludedKeys.length > 0, (builder) => builder.where("session_key", "not in", sqliteStringSet(excludedKeys)));
	if (candidateSessionIds?.length && candidateSessionIds.length <= 16 && candidateSessionIds.every((candidate) => toUSVString(candidate) === candidate && !/[\0\uFFFD-\uFFFF]/u.test(candidate))) query = query.where((eb) => eb.or([eb.or(candidateSessionIds.map((candidate) => sql`instr(current_session_id, ${candidate}) > 0`)), eb("has_optional_references", "=", 1)]));
	const referenceQuery = db.with((cte) => cte("projected_nodes").materialized(), () => query.select(sessionReferenceProjection)).with((cte) => cte("reference_nodes").materialized(), (builder) => builder.selectFrom("projected_nodes").selectAll().select(usableSessionReferenceProjection)).selectFrom("reference_nodes").leftJoin(sessionReferenceAtoms, (join) => join.on(sessionReferenceAtomPath)).select([
		"current_session_id",
		"session_key",
		"reference.atom",
		"reference.fullkey"
	]).select(sql`CASE WHEN "references" IS NULL THEN (SELECT entry_json FROM session_nodes WHERE session_nodes.session_key = reference_nodes.session_key) END`.as("entry_json"));
	const rows = iterateSqliteQuerySync(database.db, referenceQuery);
	const sessionIds = /* @__PURE__ */ new Set();
	const candidates = candidateSessionIds ? new Set(candidateSessionIds) : void 0;
	const addReference = (sessionId) => {
		if (!candidates || candidates.has(sessionId)) sessionIds.add(sessionId);
	};
	for (const row of rows) {
		if (excludedSessionKeys.has(row.session_key)) continue;
		addReference(row.current_session_id);
		if (row.entry_json !== null) {
			const entry = parseSessionEntryJson({
				...row,
				entry_json: row.entry_json
			});
			if (entry) for (const sessionId of collectSessionStateIdsForEntry(entry)) addReference(sessionId);
		} else if (row.atom !== null && row.fullkey !== null && /^\$\.(sessionId|previousSessionId|usageFamilySessionIds\[\d+\]|compactionCheckpoints\[\d+\]\.(sessionId|(?:preCompaction|postCompaction)\.sessionId))$/u.test(row.fullkey)) {
			const sessionId = row.atom.trim();
			if (sessionId) addReference(sessionId);
		}
	}
	addRetainedWindowSessionReferences(database, sessionIds, excludedSessionKeys, candidateSessionIds, diskBudget);
	return candidateSessionIds ? new Set(candidateSessionIds.filter((sessionId) => sessionIds.has(sessionId))) : sessionIds;
}
function readReferencedSessionIdsAfterTargetMutation(database, target, candidateSessionIds) {
	return readReferencedSessionIds(database, new Set(uniqueStrings([target.canonicalKey, ...target.storeKeys].map((key) => key.trim()))), candidateSessionIds);
}
function deleteMaterializedSessionStatePlans(database, plans, protectedSessionIds, excludedSessionKeys, diskBudget) {
	if (plans.length === 0) return [];
	const archivedTranscripts = [];
	const referencedSessionIds = readReferencedSessionIds(database, excludedSessionKeys, plans.map((plan) => plan.sessionId), diskBudget);
	for (const sessionId of protectedSessionIds ?? []) referencedSessionIds.add(sessionId);
	for (const plan of plans) {
		if (referencedSessionIds.has(plan.sessionId) || readSessionColdTranscript(database.db, plan.sessionId)) continue;
		const currentSnapshot = readSessionStateDeleteSnapshot(database.db, plan.sessionId);
		if (!sqliteSessionStateDeleteSnapshotsEqual(currentSnapshot, plan.snapshot)) throw new Error(`SQLite session state changed before deletion for ${plan.sessionId}`);
		if (plan.archive) persistSessionTranscriptArchive(database, plan);
		deleteSqliteSessionStateRows(database, plan.sessionId);
		if (plan.snapshot.lastSeq !== null && plan.archivedTranscript) archivedTranscripts.push(plan.archivedTranscript);
	}
	return archivedTranscripts;
}
function planSessionStateAfterEntryRemoval(params) {
	const candidates = collectSessionStateIdsForEntry(params.entry);
	const referencedSessionIds = params.referencedSessionIds ?? readReferencedSessionIds(params.database, void 0, candidates);
	return candidates.flatMap((sessionId) => {
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveTranscript,
			archiveDirectory: params.archiveDirectory,
			database: params.database,
			reason: params.reason,
			referencedSessionIds,
			sessionId
		});
		return plan ? [plan] : [];
	});
}
/** Ids of every persisted generation owned by the given logical session keys. */
function readSessionGenerationIdsForKeys(database, keys, options = {}) {
	const sessionKeys = [...keys].map((key) => options.exactStoredKeys ? key : key.trim());
	if (sessionKeys.length === 0) return [];
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "in", sqliteStringSet(sessionKeys))).rows.map((row) => row.session_id);
}
/** Raw Doctor removals also guard cold changes while the hot blob remains unchanged. */
function assertRawSessionEntryRemovalUnchanged(database, sessionKey, removal) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select(["entry_json", "snapshot_revision"]).where("session_key", "=", sessionKey));
	if (!row || row.entry_json !== removal.expectedRawEntryJson || row.snapshot_revision !== removal.expectedSnapshotRevision) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${sessionKey}`);
}
function selectProjectedLifecycleRemovals(database, store, removals) {
	const removedKeysToArchive = /* @__PURE__ */ new Set();
	const changedSessionKeys = /* @__PURE__ */ new Set();
	const projectedRemovals = [];
	for (const removal of removals) {
		const sessionKey = removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim();
		let entry = removal.exactStoredKey || sessionKey ? store[sessionKey] : void 0;
		if (removal.expectedRawEntryJson !== void 0) {
			assertRawSessionEntryRemovalUnchanged(database, sessionKey, removal);
			entry = structuredClone(removal.expectedEntry);
		}
		if (!shouldRemoveSessionEntry(entry, removal)) continue;
		if (removal.expectedTranscriptSnapshot) {
			const sessionId = entry.sessionId;
			if (!sessionId || !sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(database.db, sessionId), removal.expectedTranscriptSnapshot)) continue;
		}
		projectedRemovals.push({
			archiveTranscript: removal.archiveRemovedTranscript === true,
			expectedEntry: structuredClone(entry),
			removal,
			sessionKey
		});
		if (removal.archiveRemovedTranscript === true) removedKeysToArchive.add(sessionKey);
		changedSessionKeys.add(sessionKey);
		delete store[sessionKey];
	}
	return {
		removedKeysToArchive,
		changedSessionKeys,
		projectedRemovals
	};
}
function finishProjectedLifecycleRemovalPlans(database, archiveDirectory, store, selected, upsertedEntries) {
	const { removedKeysToArchive, changedSessionKeys, projectedRemovals } = selected;
	const removedGenerationIds = readSessionGenerationIdsForKeys(database, removedKeysToArchive);
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: changedSessionKeys,
		projectedStore: store,
		candidateSessionIds: uniqueStrings([...projectedRemovals.flatMap(({ expectedEntry }) => collectSessionStateIdsForEntry(expectedEntry)), ...removedGenerationIds])
	});
	const deletePlans = projectedRemovals.flatMap(({ archiveTranscript, expectedEntry: entry }) => planSessionStateAfterEntryRemoval({
		archiveDirectory,
		archiveTranscript,
		database,
		entry,
		reason: "deleted",
		referencedSessionIds
	}));
	const observedSnapshotsBySessionId = new Map(projectedRemovals.flatMap(({ expectedEntry, removal }) => expectedEntry.sessionId && removal.expectedTranscriptSnapshot ? [[expectedEntry.sessionId, removal.expectedTranscriptSnapshot]] : []));
	for (const plan of deletePlans) {
		const observedSnapshot = observedSnapshotsBySessionId.get(plan.sessionId);
		if (observedSnapshot) plan.snapshot = observedSnapshot;
	}
	const plannedIds = new Set(deletePlans.map((plan) => plan.sessionId));
	for (const sessionId of removedGenerationIds) {
		if (plannedIds.has(sessionId)) continue;
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveDirectory,
			archiveTranscript: true,
			database,
			reason: "deleted",
			referencedSessionIds,
			sessionId
		});
		if (plan) {
			deletePlans.push(plan);
			plannedIds.add(sessionId);
		}
	}
	return {
		deletePlans,
		removals: projectedRemovals,
		upsertedEntries
	};
}
/** Removal-only planning shares selection and reference policy with the async upsert owner. */
function projectSessionEntryLifecycleRemovalsInDatabase(database, params) {
	const store = readSessionEntryStore(database, {
		allowCanonicalRepair: params.allowCanonicalRepair === true,
		sessionKeys: params.removals.map((removal) => removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim())
	});
	const selected = selectProjectedLifecycleRemovals(database, store, params.removals);
	if (selected.projectedRemovals.length === 0) return {
		deletePlans: [],
		removals: [],
		upsertedEntries: []
	};
	return finishProjectedLifecycleRemovalPlans(database, params.archiveDirectory, store, selected, []);
}
function readProjectedLifecycleStore(database, params) {
	const sessionKeys = /* @__PURE__ */ new Set([...params.removals.map((removal) => removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim()), ...params.upserts.flatMap((upsert) => [upsert.sessionKey.trim(), ...(upsert.relatedSessionKeys ?? []).map(normalizeStoreSessionKey)])]);
	const options = { allowCanonicalRepair: params.allowCanonicalRepair === true };
	const store = readSessionEntryStore(database, {
		...options,
		sessionKeys: [...sessionKeys]
	});
	const parentSessionKeys = params.upserts.flatMap((upsert) => {
		const parent = store[upsert.sessionKey.trim()]?.parentSessionKey;
		const key = parent ? normalizeStoreSessionKey(parent) : "";
		return upsert.relatedSessionKeys !== void 0 && key && !sessionKeys.has(key) ? [key] : [];
	});
	if (parentSessionKeys.length > 0) Object.assign(store, readSessionEntryStore(database, {
		...options,
		sessionKeys: parentSessionKeys
	}));
	return store;
}
async function projectSessionEntryLifecycleMutation(databaseOptions, params) {
	return withSqliteSessionDatabase(databaseOptions, async (removalDatabase) => {
		const store = readProjectedLifecycleStore(removalDatabase, params);
		const selected = selectProjectedLifecycleRemovals(removalDatabase, store, params.removals);
		const { projectedRemovals } = selected;
		const upsertedEntries = await buildProjectedLifecycleUpserts(store, selected, params.upserts);
		if (projectedRemovals.length === 0) return {
			deletePlans: [],
			removals: projectedRemovals,
			upsertedEntries
		};
		return withSqliteSessionDatabase(databaseOptions, (database) => {
			return finishProjectedLifecycleRemovalPlans(database, params.archiveDirectory, store, selected, upsertedEntries);
		});
	});
}
/** Builders run once outside SQL; commit rereads their exact prepared rows. */
async function buildProjectedLifecycleUpserts(store, selected, upserts) {
	const { projectedRemovals, changedSessionKeys } = selected;
	const upsertedEntries = [];
	for (const upsert of upserts) {
		const sessionKey = upsert.sessionKey.trim();
		if (!sessionKey) continue;
		if (upsert.requiresRemovalSessionKey && !projectedRemovals.some((removal) => removal.sessionKey === upsert.requiresRemovalSessionKey?.trim())) continue;
		const expectedEntry = store[sessionKey] ? structuredClone(store[sessionKey]) : void 0;
		if (upsert.resetBoundary && !expectedEntry) throw new Error(`Cannot append reset boundary without an existing session row: ${sessionKey}`);
		const entry = upsert.buildEntry === void 0 ? upsert.entry : await upsert.buildEntry({
			currentEntry: expectedEntry ? structuredClone(expectedEntry) : void 0,
			readEntry: (key) => {
				const related = store[normalizeStoreSessionKey(key)];
				return related ? structuredClone(related) : void 0;
			},
			sessionKey
		});
		if (!entry) continue;
		const cloned = structuredClone(entry);
		store[sessionKey] = cloned;
		changedSessionKeys.add(sessionKey);
		upsertedEntries.push({
			expectedEntry,
			sessionKey,
			entry: cloned,
			...upsert.routeContext !== void 0 ? { routeContext: upsert.routeContext } : {},
			...upsert.resetBoundary ? { resetBoundary: upsert.resetBoundary } : {}
		});
	}
	return upsertedEntries;
}
function collectProjectedReferencedSessionIds(params) {
	const excludedSessionKeys = new Set(params.excludedSessionKeys);
	const sessionIds = readReferencedSessionIds(params.database, excludedSessionKeys, params.candidateSessionIds);
	for (const entry of Object.values(params.projectedStore)) for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	return sessionIds;
}
function deleteSqliteSessionStateRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(database.db, db.deleteFrom("session_windows").where("session_id", "=", sessionId)));
	retireSqliteDatabaseWriteScopes(database.db, [sqliteSessionIdWriteScope(sessionId)]);
}
function deletePlannedLifecycleArtifactEntries(database, entries) {
	for (const planned of entries) deleteSessionEntryRows(database, planned.sessionKey);
	return entries.length;
}
function assertPlannedLifecycleArtifactEntriesUnchanged(database, entries) {
	for (const planned of entries) {
		const current = readExactSessionEntryRow(database, planned.sessionKey)?.entry;
		if (!sqliteSessionEntriesEqual(current, planned.expectedEntry)) throw new Error(`SQLite lifecycle cleanup entry changed for ${planned.sessionKey}`);
	}
}
//#endregion
export { deleteMaterializedSessionStatePlans as a, planSessionStateAfterEntryRemoval as c, readProjectedLifecycleStore as d, readReferencedSessionIds as f, shouldRemoveSessionEntry as g, selectProjectedLifecycleRemovals as h, collectProjectedReferencedSessionIds as i, projectSessionEntryLifecycleMutation as l, readSessionGenerationIdsForKeys as m, assertRawSessionEntryRemovalUnchanged as n, deletePlannedLifecycleArtifactEntries as o, readReferencedSessionIdsAfterTargetMutation as p, buildProjectedLifecycleUpserts as r, finishProjectedLifecycleRemovalPlans as s, assertPlannedLifecycleArtifactEntriesUnchanged as t, projectSessionEntryLifecycleRemovalsInDatabase as u };

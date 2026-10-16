import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { h as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-FbEuN6S5.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { S as hasPreparedNativeSessionDeletion, r as deleteSessionEntryRows } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { r as collectSessionStateIdsForEntry, t as addRetainedWindowSessionReferences } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { n as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-BD2fHbEP.mjs";
import { r as persistSessionTranscriptArchive } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { toUSVString } from "node:util";
import { isMainThread } from "node:worker_threads";
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
//#region src/config/sessions/session-accessor.sqlite-lifecycle-state.ts
function shouldRemoveSessionEntry(entry, removal) {
	if (!entry) return false;
	if (removal.expectedEntry !== void 0 && !sqliteSessionEntriesEqual(entry, removal.expectedEntry)) return false;
	if (removal.expectedSessionId !== void 0 && (removal.expectedSessionId === null ? entry.sessionId !== void 0 : entry.sessionId !== removal.expectedSessionId)) return false;
	if (removal.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== removal.expectedLifecycleRevision) return false;
	return removal.expectedUpdatedAt === void 0 || entry.updatedAt === removal.expectedUpdatedAt;
}
/** Session ids protected by live node state. */
function readReferencedSessionIds(database, excludedSessionKeys = /* @__PURE__ */ new Set(), candidateSessionIds, diskBudget) {
	if (candidateSessionIds?.length === 0) return /* @__PURE__ */ new Set();
	const db = getSessionKysely(database.db);
	const excludedKeys = [...excludedSessionKeys].filter((key) => toUSVString(key) === key && !key.includes("\0") && !/[\uFFFE\uFFFF]/u.test(key));
	let query = db.selectFrom("session_nodes").select(["current_session_id", "session_key"]).$if(excludedKeys.length > 0, (builder) => builder.where("session_key", "not in", sqliteStringSet(excludedKeys)));
	if (candidateSessionIds?.length && candidateSessionIds.length <= 16 && candidateSessionIds.every((candidate) => toUSVString(candidate) === candidate && !/[\0\uFFFD-\uFFFF]/u.test(candidate))) query = query.where((eb) => eb.or([eb.or(candidateSessionIds.map((candidate) => sql`instr(current_session_id, ${candidate}) > 0`)), sql`CASE
          WHEN NOT json_valid(entry_json) THEN 1
          WHEN length(CAST(entry_json AS BLOB)) != length(CAST(printf('%s', entry_json) AS BLOB)) THEN 1
          ELSE json_type(entry_json, '$.previousSessionId') IS NOT NULL
            OR json_type(entry_json, '$.usageFamilySessionIds') IS NOT NULL
            OR json_type(entry_json, '$.compactionCheckpoints') IS NOT NULL
        END`]));
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
function planSessionStateDeleteIfUnreferenced(params) {
	if (params.referencedSessionIds.has(params.sessionId) || readSessionColdTranscript(params.database.db, params.sessionId)) return null;
	return {
		agentId: params.database.agentId,
		archiveDirectory: params.archiveDirectory,
		archiveTranscript: params.archiveTranscript !== false && typeof readOpenClawAgentDatabaseIdentity(params.database).identity === "string",
		databasePath: params.database.path,
		reason: params.reason ?? "deleted",
		sessionId: params.sessionId,
		snapshot: readSessionStateDeleteSnapshot(params.database.db, params.sessionId)
	};
}
function deleteMaterializedSessionStatePlans(database, plans, protectedSessionIds, excludedSessionKeys, onDeleted, diskBudget) {
	if (plans.length === 0) return [];
	const archivedTranscripts = [];
	const referencedSessionIds = readReferencedSessionIds(database, excludedSessionKeys, plans.map((plan) => plan.sessionId), diskBudget);
	for (const sessionId of protectedSessionIds ?? []) referencedSessionIds.add(sessionId);
	for (const plan of plans) {
		if (referencedSessionIds.has(plan.sessionId) || readSessionColdTranscript(database.db, plan.sessionId)) continue;
		const currentSnapshot = readSessionStateDeleteSnapshot(database.db, plan.sessionId);
		if (!sqliteSessionStateDeleteSnapshotsEqual(currentSnapshot, plan.snapshot)) throw new Error(`SQLite session state changed before deletion for ${plan.sessionId}`);
		if (plan.archive) persistSessionTranscriptArchive(database, plan);
		if (deleteSqliteSessionStateRows(database, plan.sessionId)) onDeleted?.();
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
async function projectSessionEntryLifecycleMutation(databaseOptions, params) {
	return withSqliteSessionDatabase(databaseOptions, async (removalDatabase) => {
		const sessionKeys = [...params.removals.map((removal) => removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim()), ...params.upserts.map((upsert) => upsert.sessionKey.trim())];
		const snapshot = isMainThread && !params.allowCanonicalRepair && !hasPreparedNativeSessionDeletion() && params.removals.length === 0 && supportsOpenClawAgentDatabaseExecution(databaseOptions) ? await withSessionHistoryWorkerDatabase(databaseOptions, (reader) => reader.readExactEntries({
			projection: "lifecycle",
			includeAuthorization: true,
			sessionKeys,
			env: { ...databaseOptions.env ?? process.env }
		})) : void 0;
		const store = snapshot ? Object.fromEntries(snapshot.entries.map(({ sessionKey, entry }) => [sessionKey, entry])) : readSessionEntryStore(removalDatabase, {
			allowCanonicalRepair: params.allowCanonicalRepair === true,
			sessionKeys
		});
		const selected = selectProjectedLifecycleRemovals(removalDatabase, store, params.removals);
		const { projectedRemovals, changedSessionKeys } = selected;
		const upsertedEntries = [];
		for (const upsert of params.upserts) {
			const sessionKey = upsert.sessionKey.trim();
			if (!sessionKey) continue;
			if (upsert.requiresRemovalSessionKey && !projectedRemovals.some((removal) => removal.sessionKey === upsert.requiresRemovalSessionKey?.trim())) continue;
			const expectedEntry = store[sessionKey] ? structuredClone(store[sessionKey]) : void 0;
			if (upsert.resetBoundary && !expectedEntry) throw new Error(`Cannot append reset boundary without an existing session row: ${sessionKey}`);
			const entry = upsert.buildEntry === void 0 ? upsert.entry : await upsert.buildEntry({
				currentEntry: expectedEntry ? structuredClone(expectedEntry) : void 0,
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
		if (projectedRemovals.length === 0) return {
			deletePlans: [],
			removals: projectedRemovals,
			upsertedEntries,
			archiveRecovery: snapshot?.databaseIdentity && snapshot.pendingArchives !== void 0 ? {
				pending: snapshot.pendingArchives,
				databaseIdentity: snapshot.databaseIdentity.identity
			} : void 0
		};
		return withSqliteSessionDatabase(databaseOptions, (database) => {
			return finishProjectedLifecycleRemovalPlans(database, params.archiveDirectory, store, selected, upsertedEntries);
		});
	});
}
function collectProjectedReferencedSessionIds(params) {
	const excludedSessionKeys = new Set(params.excludedSessionKeys);
	const sessionIds = readReferencedSessionIds(params.database, excludedSessionKeys, params.candidateSessionIds);
	for (const entry of Object.values(params.projectedStore)) for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	return sessionIds;
}
function deleteSqliteSessionStateRows(database, sessionId) {
	assertSessionTranscriptHot(database.db, sessionId);
	const db = getSessionKysely(database.db);
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	const deleted = executeSqliteQuerySync(database.db, db.deleteFrom("session_windows").where("session_id", "=", sessionId));
	return Number(deleted.numAffectedRows ?? 0n) > 0;
}
function deletePlannedLifecycleArtifactEntries(database, entries) {
	assertPlannedLifecycleArtifactEntriesUnchanged(database, entries);
	for (const planned of entries) deleteSessionEntryRows(database, planned.sessionKey);
	return entries.length;
}
function assertPlannedLifecycleArtifactEntriesUnchanged(database, entries) {
	for (const planned of entries) {
		const current = readExactSessionEntryRow(database, planned.sessionKey)?.entry;
		if (!sqliteSessionEntriesEqual(current, planned.expectedEntry)) throw new Error(`SQLite lifecycle cleanup entry changed for ${planned.sessionKey}`);
	}
}
/** Partition only optimistic entry conflicts; database and parse failures stay fatal. */
function partitionUnchangedPlannedLifecycleArtifactEntries(database, entries) {
	const changed = [];
	const unchanged = [];
	for (const planned of entries) {
		const current = readExactSessionEntryRow(database, planned.sessionKey)?.entry;
		(sqliteSessionEntriesEqual(current, planned.expectedEntry) ? unchanged : changed).push(planned);
	}
	return {
		changed,
		unchanged
	};
}
//#endregion
export { deletePlannedLifecycleArtifactEntries as a, planSessionStateDeleteIfUnreferenced as c, readReferencedSessionIds as d, readReferencedSessionIdsAfterTargetMutation as f, deleteMaterializedSessionStatePlans as i, projectSessionEntryLifecycleMutation as l, shouldRemoveSessionEntry as m, assertRawSessionEntryRemovalUnchanged as n, partitionUnchangedPlannedLifecycleArtifactEntries as o, readSessionGenerationIdsForKeys as p, collectProjectedReferencedSessionIds as r, planSessionStateAfterEntryRemoval as s, assertPlannedLifecycleArtifactEntriesUnchanged as t, projectSessionEntryLifecycleRemovalsInDatabase as u };

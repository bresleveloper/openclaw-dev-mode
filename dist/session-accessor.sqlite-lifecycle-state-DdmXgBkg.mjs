import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { u as ensureSessionTranscriptArchiveSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { d as isIncognitoOpenClawAgentDatabase } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase, s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as emitSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as getSessionKysely, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, m as resolveSqliteTranscriptScope, n as cloneSessionEntry, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { a as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-UaRlRUAw.mjs";
import { a as readExactSessionEntryJson, o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { r as parseSessionEntryJson, s as sessionEntryMetadataJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-BGtMQ0LB.mjs";
import { bt as sqliteSessionEntriesEqual, i as deleteSessionEntryRows } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { r as collectSessionStateIdsForEntry, t as addRetainedWindowSessionReferences } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { i as resolveRegisteredSqliteTranscriptArchiveName } from "./session-accessor.sqlite-archive-artifact-UkVgkxpH.mjs";
import { n as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-CZiiDjVP.mjs";
import { i as runSqliteTranscriptArchivePublishWorker } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import fs from "node:fs";
import { toUSVString } from "node:util";
import path from "node:path";
//#region src/config/sessions/session-accessor.sqlite-archive-store-kernel.ts
const PENDING_ARCHIVE_PUBLISH_BATCH_SIZE = 4;
function transcriptArchiveIdentityKey(sessionId, generation) {
	return `${sessionId}\u0000${generation}`;
}
function uniqueTranscriptArchives(archives) {
	return [...new Map(archives.map((archive) => [transcriptArchiveIdentityKey(archive.sessionId, archive.generation), archive])).values()];
}
/** The archive table is optional until the first committed archive. */
function hasPendingSessionTranscriptArchives(database) {
	return tableExists(database.db, "session_transcript_archives") && executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_transcript_archives").select("session_id").where("published_at", "is", null).limit(1)) !== void 0;
}
function prepareSessionTranscriptArchivePublishPlans(database, params) {
	const db = getSessionKysely(database.db);
	if (params.requested.length > 0) ensureSessionTranscriptArchiveSchema(database.db);
	else if (!tableExists(database.db, "session_transcript_archives")) return [];
	const pendingArchives = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
		"archive_name",
		"created_at",
		"encoding",
		"generation",
		"reason",
		"session_id"
	]).where("published_at", "is", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(PENDING_ARCHIVE_PUBLISH_BATCH_SIZE)).rows;
	for (const archive of pendingArchives) {
		if (archive.encoding !== "identity" && archive.encoding !== "zstd" || archive.reason !== "deleted" && archive.reason !== "reset") throw new Error(`Invalid pending SQLite transcript archive for ${archive.session_id}`);
		const archiveName = resolveRegisteredSqliteTranscriptArchiveName({
			createdAt: archive.created_at,
			encoding: archive.encoding,
			generation: archive.generation,
			reason: archive.reason,
			sessionId: archive.session_id
		});
		if (archiveName === archive.archive_name) continue;
		executeSqliteQuerySync(database.db, db.updateTable("session_transcript_archives").set({ archive_name: archiveName }).where("session_id", "=", archive.session_id).where("generation", "=", archive.generation).where("published_at", "is", null));
	}
	return uniqueTranscriptArchives([...params.requested, ...pendingArchives.map((archive) => ({
		generation: archive.generation,
		sessionId: archive.session_id
	}))]).map((archive) => ({
		agentId: database.agentId,
		archiveDirectory: params.archiveDirectory,
		databasePath: database.path,
		generation: archive.generation,
		sessionId: archive.sessionId
	}));
}
function recordSessionTranscriptArchivePublishResults(database, results, nowMs) {
	ensureSessionTranscriptArchiveSchema(database.db);
	const db = getSessionKysely(database.db);
	for (const result of results) executeSqliteQuerySync(database.db, db.updateTable("session_transcript_archives").set((eb) => ({
		last_publish_attempt_at: nowMs,
		last_publish_error: result.error?.slice(0, 1024) ?? null,
		publish_attempts: eb("publish_attempts", "+", 1),
		...result.archivedPath ? { published_at: nowMs } : {}
	})).where("session_id", "=", result.sessionId).where("generation", "=", result.generation));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-events.ts
function emitArchivedTranscriptUpdates(archivedTranscripts) {
	for (const archived of archivedTranscripts) emitSessionTranscriptUpdate({ sessionFile: archived.archivedPath });
}
async function publishTranscriptUpdate(scope, update = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	emitSessionTranscriptUpdate({
		...update,
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		sessionId: resolved.sessionId,
		target: {
			agentId: resolved.agentId,
			sessionId: resolved.sessionId,
			sessionKey: resolved.sessionKey,
			storePath: resolved.path
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive-store.ts
/** Inserts the canonical archive row inside the lifecycle deletion transaction. */
function persistSessionTranscriptArchive(database, plan) {
	const archive = plan.archive;
	const generation = plan.snapshot.generation;
	const sessionKey = plan.snapshot.sessionKey;
	if (!archive || !generation || !sessionKey) throw new Error(`Cannot persist SQLite transcript archive without an owner generation for ${plan.sessionId}`);
	ensureSessionTranscriptArchiveSchema(database.db);
	const db = getSessionKysely(database.db);
	if (executeSqliteQuerySync(database.db, db.insertInto("session_transcript_archives").values({
		archive_blob: archive.bytes,
		archive_name: archive.archiveName,
		archive_sha256: archive.sha256,
		created_at: archive.createdAt,
		encoding: archive.encoding,
		generation,
		last_publish_attempt_at: null,
		last_publish_error: null,
		published_at: null,
		reason: plan.reason,
		session_id: plan.sessionId,
		session_key: sessionKey
	}).onConflict((conflict) => conflict.columns(["session_id", "generation"]).doNothing())).numAffectedRows === 1n) return;
	const persisted = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_archives").select([
		"archive_blob",
		"archive_name",
		"archive_sha256",
		"created_at",
		"encoding",
		"reason",
		"session_key"
	]).where("session_id", "=", plan.sessionId).where("generation", "=", generation));
	if (!persisted || persisted.archive_name !== archive.archiveName || persisted.archive_sha256 !== archive.sha256 || persisted.created_at !== archive.createdAt || persisted.encoding !== archive.encoding || persisted.reason !== plan.reason || persisted.session_key !== sessionKey || !Buffer.from(persisted.archive_blob).equals(Buffer.from(archive.bytes))) throw new Error(`Conflicting SQLite transcript archive for ${plan.sessionId}`);
}
/** Publishes derived archive files after their canonical rows and deletions commit. */
async function publishSessionStateArchives(scope, requested) {
	const requestedArchives = uniqueTranscriptArchives(requested);
	const requestedIdentitySet = new Set(requestedArchives.map((archive) => transcriptArchiveIdentityKey(archive.sessionId, archive.generation)));
	let includeRequested = true;
	while (true) {
		const plans = await runExclusiveSqliteSessionWrite(scope, async () => {
			const databaseOptions = toDatabaseOptions(scope);
			const requestedForPass = includeRequested ? requestedArchives : [];
			if (requestedForPass.length === 0 && !getOpenClawAgentDatabaseIfOpen(databaseOptions)) try {
				const pending = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => hasPendingSessionTranscriptArchives(database)), databaseOptions);
				if (!pending.found || !pending.value) return [];
			} catch {}
			return prepareSessionTranscriptArchivePublishPlans(openOpenClawAgentDatabase(databaseOptions), {
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(scope),
				requested: requestedForPass
			});
		}, "session.archive.publish-prepare");
		includeRequested = false;
		if (plans.length === 0) break;
		const results = await runSqliteTranscriptArchivePublishWorker(plans);
		await runExclusiveSqliteSessionWrite(scope, async () => {
			const now = Date.now();
			runOpenClawAgentWriteTransaction((transactionDb) => {
				recordSessionTranscriptArchivePublishResults(transactionDb, results, now);
			}, toDatabaseOptions(scope));
		}, "session.archive.publish-commit");
		const planByIdentity = new Map(plans.map((plan) => [transcriptArchiveIdentityKey(plan.sessionId, plan.generation), plan]));
		emitArchivedTranscriptUpdates(results.flatMap((result) => {
			const identity = transcriptArchiveIdentityKey(result.sessionId, result.generation);
			if (!result.archivedPath || requestedIdentitySet.has(identity)) return [];
			const plan = planByIdentity.get(identity);
			return plan ? [{
				archivedPath: result.archivedPath,
				generation: result.generation,
				sessionId: result.sessionId,
				sourcePath: path.join(plan.archiveDirectory, `${result.sessionId}.jsonl`)
			}] : [];
		}));
		const failedIds = results.flatMap((result) => result.archivedPath ? [] : [result.sessionId]);
		if (failedIds.length > 0) throw new Error(`Session deletion committed, but ${failedIds.length} transcript archive file export(s) remain pending in SQLite; retry the operation to publish them.`);
	}
	return [...requested];
}
const ARCHIVE_RETENTION_BATCH_SIZE = 256;
/** Removes canonical rows only after retention has removed their derived files. */
async function prunePublishedSessionArchivesByRetention(params) {
	const rules = new Map(params.rules.filter((rule) => Number.isFinite(rule.olderThanMs) && rule.olderThanMs >= 0).map((rule) => [rule.reason, rule.olderThanMs]));
	if (rules.size === 0) return 0;
	const candidates = await runExclusiveSqliteSessionWrite(params.scope, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(params.scope));
		if (!tableExists(database.db, "session_transcript_archives")) return [];
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
			"archive_name",
			"created_at",
			"generation",
			"published_at",
			"reason",
			"session_id"
		]).where("published_at", "is not", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(ARCHIVE_RETENTION_BATCH_SIZE)).rows;
	}, "session.archive.retention-prepare");
	const now = params.nowMs ?? Date.now();
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(params.scope);
	const removable = candidates.filter((row) => {
		const olderThanMs = rules.get(row.reason);
		if (olderThanMs === void 0 || now - row.created_at <= olderThanMs) return false;
		const archivePath = path.resolve(archiveDirectory, row.archive_name);
		return path.dirname(archivePath) === path.resolve(archiveDirectory) && path.basename(archivePath) === row.archive_name && !fs.existsSync(archivePath);
	});
	if (removable.length === 0) return 0;
	return await runExclusiveSqliteSessionWrite(params.scope, async () => {
		let removed = 0;
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const db = getSessionKysely(transactionDb.db);
			for (const row of removable) {
				const result = executeSqliteQuerySync(transactionDb.db, db.deleteFrom("session_transcript_archives").where("session_id", "=", row.session_id).where("generation", "=", row.generation).where("archive_name", "=", row.archive_name).where("created_at", "=", row.created_at).where("published_at", "=", row.published_at));
				removed += Number(result.numAffectedRows ?? 0n);
			}
		}, toDatabaseOptions(params.scope));
		return removed;
	}, "session.archive.retention-commit");
}
//#endregion
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
	if (candidateSessionIds?.length && candidateSessionIds.every((candidate) => toUSVString(candidate) === candidate && !/[\0\uFFFD-\uFFFF]/u.test(candidate))) query = query.where((eb) => eb.or([candidateSessionIds.length <= 16 ? eb.or(candidateSessionIds.map((candidate) => sql`instr(current_session_id, ${candidate}) > 0`)) : sql`EXISTS (
              SELECT 1 FROM ${sqliteStringSet(candidateSessionIds)} AS candidates
              WHERE instr(current_session_id, candidates.value) > 0
            )`, sql`CASE
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
	]).select(sql`CASE WHEN "references" IS NULL THEN (SELECT ${sessionEntryMetadataJson.expression} FROM session_nodes WHERE session_nodes.session_key = reference_nodes.session_key) END`.as("entry_json"));
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
		archiveTranscript: params.archiveTranscript !== false && !isIncognitoOpenClawAgentDatabase(params.database),
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
async function projectSessionEntryLifecycleMutation(databaseOptions, params) {
	return withSqliteSessionDatabase(databaseOptions, async (removalDatabase) => {
		const store = readSessionEntryStore(removalDatabase, {
			allowCanonicalRepair: params.allowCanonicalRepair === true,
			sessionKeys: [...params.removals.map((removal) => removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim()), ...params.upserts.map((upsert) => upsert.sessionKey.trim())]
		});
		const removedKeysToArchive = /* @__PURE__ */ new Set();
		const changedSessionKeys = /* @__PURE__ */ new Set();
		const projectedRemovals = [];
		for (const removal of params.removals) {
			const sessionKey = removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim();
			let entry = removal.exactStoredKey || sessionKey ? store[sessionKey] : void 0;
			if (removal.expectedRawEntryJson !== void 0) {
				if (readExactSessionEntryJson(removalDatabase, sessionKey) !== removal.expectedRawEntryJson) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${sessionKey}`);
				entry = removal.expectedEntry ? cloneSessionEntry(removal.expectedEntry) : void 0;
			}
			if (!shouldRemoveSessionEntry(entry, removal)) continue;
			if (removal.expectedTranscriptSnapshot) {
				const sessionId = entry.sessionId;
				if (!sessionId || !sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(removalDatabase.db, sessionId), removal.expectedTranscriptSnapshot)) continue;
			}
			projectedRemovals.push({
				archiveTranscript: removal.archiveRemovedTranscript === true,
				expectedEntry: cloneSessionEntry(entry),
				removal,
				sessionKey
			});
			if (removal.archiveRemovedTranscript === true) removedKeysToArchive.add(sessionKey);
			changedSessionKeys.add(sessionKey);
			delete store[sessionKey];
		}
		const upsertedEntries = [];
		for (const upsert of params.upserts) {
			const sessionKey = upsert.sessionKey.trim();
			if (!sessionKey) continue;
			if (upsert.requiresRemovalSessionKey && !projectedRemovals.some((removal) => removal.sessionKey === upsert.requiresRemovalSessionKey?.trim())) continue;
			const expectedEntry = store[sessionKey] ? cloneSessionEntry(store[sessionKey]) : void 0;
			if (upsert.resetBoundary && !expectedEntry) throw new Error(`Cannot append reset boundary without an existing session row: ${sessionKey}`);
			const entry = upsert.buildEntry === void 0 ? upsert.entry : await upsert.buildEntry({
				currentEntry: expectedEntry ? cloneSessionEntry(expectedEntry) : void 0,
				sessionKey
			});
			if (!entry) continue;
			const cloned = cloneSessionEntry(entry);
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
			upsertedEntries
		};
		return withSqliteSessionDatabase(databaseOptions, (database) => {
			const referencedSessionIds = collectProjectedReferencedSessionIds({
				database,
				excludedSessionKeys: changedSessionKeys,
				projectedStore: store
			});
			const deletePlans = projectedRemovals.flatMap(({ archiveTranscript, expectedEntry: entry }) => planSessionStateAfterEntryRemoval({
				archiveDirectory: params.archiveDirectory,
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
			for (const sessionId of readSessionGenerationIdsForKeys(database, removedKeysToArchive)) {
				if (plannedIds.has(sessionId)) continue;
				const plan = planSessionStateDeleteIfUnreferenced({
					archiveDirectory: params.archiveDirectory,
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
		});
	});
}
function collectProjectedReferencedSessionIds(params) {
	const excludedSessionKeys = new Set(params.excludedSessionKeys);
	const sessionIds = readReferencedSessionIds(params.database, excludedSessionKeys);
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
export { partitionUnchangedPlannedLifecycleArtifactEntries as a, projectSessionEntryLifecycleMutation as c, readSessionGenerationIdsForKeys as d, shouldRemoveSessionEntry as f, publishTranscriptUpdate as g, emitArchivedTranscriptUpdates as h, deletePlannedLifecycleArtifactEntries as i, readReferencedSessionIds as l, publishSessionStateArchives as m, collectProjectedReferencedSessionIds as n, planSessionStateAfterEntryRemoval as o, prunePublishedSessionArchivesByRetention as p, deleteMaterializedSessionStatePlans as r, planSessionStateDeleteIfUnreferenced as s, assertPlannedLifecycleArtifactEntriesUnchanged as t, readReferencedSessionIdsAfterTargetMutation as u };

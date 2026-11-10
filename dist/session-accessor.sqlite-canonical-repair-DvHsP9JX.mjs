import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { t as sessionEntrySnapshotColumns } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { c as transcriptEventJsonSql, v as deriveTranscriptPredicateFields } from "./transcript-payload-Cu49oQKq.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { i as resolveSqliteStoreScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as readSessionColdTranscript, n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { c as reconcileSessionTranscriptIndexInTransaction, s as markSessionTranscriptIndexDirtyInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { c as copySessionNodeArtifactsForRepair, f as readSessionInputArtifactRows, s as bindSessionWindowEntryProjection, u as deleteSessionMembersForRepair } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as ensureTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { t as createTranscriptIdentityInserter } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { m as readSessionGenerationIdsForKeys } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-delivery-repair.ts
function resolveSqliteCanonicalRepairLookupKeys(canonicalKey, storedKeys) {
	return uniqueStrings([
		canonicalKey,
		...storedKeys,
		...storedKeys.flatMap((key) => {
			const trimmedKey = key.trim();
			return [trimmedKey, normalizeStoreSessionKey(trimmedKey)];
		})
	]);
}
/** Receipt and presentation facts used by offline repair completion receipts. */
function readSessionDeliveryRepairInventory(database) {
	const db = getSessionKysely(database.db);
	const deliveries = executeSqliteQuerySync(database.db, db.selectFrom("conversation_deliveries").selectAll().orderBy("operation_id")).rows;
	const cache = getNodeSqliteKysely(database.db);
	const progress = executeSqliteQuerySync(database.db, cache.selectFrom("cache_entries").selectAll().where("scope", "=", "conversation-progress").orderBy("key")).rows;
	const conversationIds = uniqueStrings(deliveries.map((row) => row.conversation_id));
	return {
		deliveries,
		progress,
		conversations: conversationIds.length === 0 ? [] : executeSqliteQuerySync(database.db, db.selectFrom("conversations").selectAll().where("conversation_id", "in", conversationIds).orderBy("conversation_id")).rows
	};
}
/** Caller owns the source snapshot and destination write transaction. */
function copySessionDeliveriesForRepair(params) {
	const sourceKeys = params.sourceKeys;
	const sourceDb = getSessionKysely(params.source.db);
	const destinationDb = getSessionKysely(params.destination.db);
	const sourceKeyReferences = new Set(sourceKeys);
	const deliveryLookupKeys = resolveSqliteCanonicalRepairLookupKeys(params.canonicalKey, sourceKeys);
	const competingDeliveryIdentities = new Set(executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => sourceKeyReferences.has(row.session_key) ? [] : [normalizeStoreSessionKey(row.session_key)]));
	const deliverySourceKeys = deliveryLookupKeys.filter((key) => sourceKeyReferences.has(key) || !competingDeliveryIdentities.has(normalizeStoreSessionKey(key)));
	const deliverySourceKeyReferences = new Set(deliverySourceKeys);
	const deliveries = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversation_deliveries").selectAll().where("source_session_key", "in", deliverySourceKeys)).rows;
	const conversationIds = uniqueStrings([...params.linkedConversationIds ?? [], ...deliveries.map((delivery) => delivery.conversation_id)]);
	if (conversationIds.length > 0) {
		const conversations = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversations").selectAll().where("conversation_id", "in", conversationIds)).rows;
		for (const conversation of conversations) {
			if (params.preserveDestination) {
				const existing = executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("conversations").selectAll().where("conversation_id", "=", conversation.conversation_id));
				if (existing) {
					const { created_at: _sourceCreated, updated_at: _sourceUpdated, ...sourceFacts } = conversation;
					const { created_at: _targetCreated, updated_at: _targetUpdated, ...targetFacts } = existing;
					if (!isDeepStrictEqual(sourceFacts, targetFacts)) throw new Error(`delivery conversation ${conversation.conversation_id} differs between stores`);
					continue;
				}
			}
			const { conversation_id: _conversationId, ...replacement } = conversation;
			executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("conversations").values(conversation).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet(replacement)));
		}
		const sourceCache = getNodeSqliteKysely(params.source.db);
		const destinationCache = getNodeSqliteKysely(params.destination.db);
		for (const delivery of deliveries) {
			const canonicalDelivery = {
				...delivery,
				source_session_key: delivery.source_session_key !== null && deliverySourceKeyReferences.has(delivery.source_session_key) ? params.canonicalKey : delivery.source_session_key
			};
			const existing = params.preserveDestination ? executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("conversation_deliveries").selectAll().where("operation_id", "=", delivery.operation_id)) : void 0;
			if (params.preserveDestination && existing) {
				if (!isDeepStrictEqual(existing, canonicalDelivery)) throw new Error(`delivery receipt ${delivery.operation_id} differs between stores`);
			}
			const { operation_id: _operationId, ...replacement } = canonicalDelivery;
			executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("conversation_deliveries").values(canonicalDelivery).onConflict((conflict) => conflict.column("operation_id").doUpdateSet(replacement)));
			const snapshot = executeSqliteQueryTakeFirstSync(params.source.db, sourceCache.selectFrom("cache_entries").selectAll().where("scope", "=", "conversation-progress").where("key", "=", delivery.operation_id));
			const retainedSnapshot = params.preserveDestination && existing ? executeSqliteQueryTakeFirstSync(params.destination.db, destinationCache.selectFrom("cache_entries").selectAll().where("scope", "=", "conversation-progress").where("key", "=", delivery.operation_id)) : void 0;
			if (snapshot && retainedSnapshot && !isDeepStrictEqual(snapshot, retainedSnapshot)) throw new Error(`delivery progress ${delivery.operation_id} differs between stores`);
			if (snapshot) executeSqliteQuerySync(params.destination.db, destinationCache.insertInto("cache_entries").values(snapshot).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet(snapshot)));
			else if (!retainedSnapshot) executeSqliteQuerySync(params.destination.db, destinationCache.deleteFrom("cache_entries").where("scope", "=", "conversation-progress").where("key", "=", delivery.operation_id));
		}
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-generation-copy.ts
function readSqliteSessionGenerationWindows(database, sessionKeys, sessionIds) {
	return executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_windows").selectAll().where((eb) => eb.or([eb("session_key", "in", sqliteStringSet(sessionKeys)), eb("session_id", "in", sqliteStringSet(sessionIds))])).orderBy("session_id")).rows;
}
function readSqliteSessionGenerationRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return {
		identities: iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities").selectAll().where("session_id", "=", sessionId).orderBy("event_id")),
		rewriteWatermarks: iterateSqliteQuerySync(database.db, db.selectFrom("transcript_rewrite_watermarks").selectAll().where("session_id", "=", sessionId)),
		trajectoryEvents: iterateSqliteQuerySync(database.db, db.selectFrom("trajectory_runtime_events").selectAll().where("session_id", "=", sessionId).orderBy("seq")),
		parentStreamEvents: iterateSqliteQuerySync(database.db, db.selectFrom("acp_parent_stream_events").selectAll().where("session_id", "=", sessionId).orderBy("run_id").orderBy("seq"))
	};
}
function readSqliteSessionGenerationClaim(database, window) {
	return readSqliteSessionGenerationFacts(database, window, true);
}
function readSqliteSessionGenerationComparison(database, window) {
	return readSqliteSessionGenerationFacts(database, window, false);
}
function readSqliteSessionGenerationFacts(database, window, custody) {
	const rows = readSqliteSessionGenerationRows(database, window.session_id);
	const coldArchive = readSessionColdTranscript(database.db, window.session_id);
	const fingerprint = createHash("sha256").update(JSON.stringify(window)).update("\n").update(JSON.stringify(coldArchive ?? null)).update("\n");
	const contentFingerprint = createHash("sha256");
	if (coldArchive) contentFingerprint.update(JSON.stringify(["cold", coldArchive])).update("\n");
	const hashRows = (table, tableRows, content) => {
		fingerprint.update(table).update("\n");
		for (const row of tableRows) {
			fingerprint.update(JSON.stringify(row)).update("\n");
			if (content) contentFingerprint.update(JSON.stringify(content(row))).update("\n");
		}
	};
	hashRows("events", iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["session_id", "seq"]).select(transcriptEventJsonSql(database.db).as("event_json")).select("created_at").where("session_id", "=", window.session_id).orderBy("seq")), (row) => [
		"event",
		row.seq,
		row.event_json
	]);
	hashRows("identities", rows.identities, (row) => [
		"identity",
		row.event_id,
		row.event_type,
		row.parent_id,
		row.seq,
		row.message_idempotency_key
	]);
	hashRows("rewriteWatermarks", rows.rewriteWatermarks, () => ["rewrite"]);
	hashRows("trajectoryEvents", rows.trajectoryEvents, (row) => [
		"trajectory",
		row.seq,
		row.run_id,
		row.event_json
	]);
	hashRows("parentStreamEvents", rows.parentStreamEvents, (row) => [
		"parentStream",
		row.seq,
		row.run_id,
		row.event_json
	]);
	hashRows("sessionConversations", executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_conversations").selectAll().where("session_id", "=", window.session_id).orderBy("conversation_id").orderBy("role")).rows, (row) => [
		"conversation",
		row.role,
		row.conversation_id,
		row.route_context_json
	]);
	if (custody) {
		const inputs = readSessionInputArtifactRows(database, window.session_id);
		hashRows("pendingInputs", inputs.pendingInputs);
		hashRows("inputCompletions", inputs.inputCompletions);
	}
	const comparison = {
		window,
		coldArchive,
		contentFingerprint: contentFingerprint.digest("hex")
	};
	return custody ? {
		...comparison,
		fingerprint: fingerprint.digest("hex")
	} : comparison;
}
function rehomeSqliteSessionGenerationWindow(window, canonicalKey, sourceKeys) {
	return {
		...window,
		session_key: canonicalKey,
		parent_session_key: window.parent_session_key && sourceKeys.has(normalizeStoreSessionKey(window.parent_session_key)) ? canonicalKey : window.parent_session_key,
		spawned_by: window.spawned_by && sourceKeys.has(normalizeStoreSessionKey(window.spawned_by)) ? canonicalKey : window.spawned_by
	};
}
function copySqliteSessionGenerationRows(params) {
	if (readOpenClawAgentDatabaseIdentity(params.source).identity === readOpenClawAgentDatabaseIdentity(params.destination).identity) throw new Error("Transcript generation copy requires distinct source and destination databases.");
	assertSessionTranscriptHot(params.source.db, params.sessionId);
	assertSessionTranscriptHot(params.destination.db, params.sessionId);
	const sourceDb = getSessionKysely(params.source.db);
	const tables = [
		"transcript_event_identities",
		"transcript_events",
		"transcript_rewrite_watermarks",
		"trajectory_runtime_events",
		"acp_parent_stream_events"
	];
	if (!params.sourceWindowPresent && !tables.some((table) => executeSqliteQueryTakeFirstSync(params.source.db, sourceDb.selectFrom(table).select("session_id").where("session_id", "=", params.sessionId).limit(1)))) return;
	const { identities, rewriteWatermarks, trajectoryEvents, parentStreamEvents } = readSqliteSessionGenerationRows(params.source, params.sessionId);
	const destinationDb = getSessionKysely(params.destination.db);
	for (const table of tables) executeSqliteQuerySync(params.destination.db, destinationDb.deleteFrom(table).where("session_id", "=", params.sessionId));
	const eventQuery = sourceDb.selectFrom("transcript_events").where("session_id", "=", params.sessionId).orderBy("seq");
	const insertEvent = prepareSqliteQuerySync(params.destination.db, (parameter) => destinationDb.insertInto("transcript_events").values({
		session_id: params.sessionId,
		seq: parameter((row) => row.seq),
		created_at: parameter((row) => row.created_at),
		event_json: parameter((row) => row.event_json),
		event_zstd: parameter((row) => row.event_zstd),
		event_utf8_bytes: parameter((row) => row.event_utf8_bytes),
		navigation_json: parameter((row) => row.navigation_json),
		navigation_type: parameter((row) => row.navigation_type),
		navigation_custom_type: parameter((row) => row.navigation_custom_type),
		navigation_display: parameter((row) => row.navigation_display),
		message_role: parameter((row) => row.message_role),
		navigation_last_type: parameter((row) => row.navigation_last_type),
		navigation_last_custom_type: parameter((row) => row.navigation_last_custom_type),
		navigation_valid: parameter((row) => row.navigation_valid)
	}));
	if (params.destination.db.prepare("PRAGMA encoding").get()?.encoding !== "UTF-8") for (const row of iterateSqliteQuerySync(params.source.db, eventQuery.select([
		"session_id",
		"seq",
		"created_at"
	]).select(transcriptEventJsonSql(params.source.db).as("event_json")))) insertEvent({
		...row,
		...deriveTranscriptPredicateFields(row.event_json),
		event_zstd: null,
		event_utf8_bytes: null,
		navigation_json: null
	});
	else for (const row of iterateSqliteQuerySync(params.source.db, eventQuery.selectAll())) insertEvent(row);
	const insertIdentity = createTranscriptIdentityInserter(params.destination, params.sessionId, false);
	for (const row of identities) insertIdentity({
		seq: row.seq,
		eventId: row.event_id,
		eventType: row.event_type,
		parentId: row.parent_id,
		messageIdempotencyKey: row.message_idempotency_key,
		createdAt: row.created_at
	});
	for (const row of rewriteWatermarks) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("transcript_rewrite_watermarks").values(row));
	for (const row of trajectoryEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("trajectory_runtime_events").values(row));
	for (const row of parentStreamEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("acp_parent_stream_events").values(row));
	markSessionTranscriptIndexDirtyInTransaction(params.destination.db, params.sessionId);
	reconcileSessionTranscriptIndexInTransaction(params.destination.db, params.sessionId);
	const owner = executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("session_windows").select("session_key").where("session_id", "=", params.sessionId));
	if (owner) publishSessionEntryCacheInvalidation(params.destination, { sessionKey: owner.session_key });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-canonical-repair.ts
/** Doctor probes only the exact staged target and may replace a malformed partial row. */
function readExactSessionEntryRowForCanonicalRepair(database, sessionKey, options = {}) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns).where("session_key", "=", sessionKey));
	if (!row) return;
	if (row.entry_json === "{}") {
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key))) return;
	}
	const parsedEntry = parseSessionEntryJson(row);
	if (!parsedEntry && !options.allowMalformedRowRepair) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${sessionKey}`);
	const entry = parsedEntry ?? {
		sessionId: row.current_session_id,
		updatedAt: row.updated_at
	};
	if (!parsedEntry) attachSessionEntrySnapshots(entry, row);
	return {
		entry,
		row
	};
}
/** Doctor-only cross-store copy; the source node remains until lifecycle archival succeeds. */
function copySqliteSessionOwnedStateForCanonicalRepair(params) {
	const source = resolveSqliteStoreScope(params.source.storePath, { agentId: params.source.agentId });
	const sourceDatabase = openOpenClawAgentDatabase(toDatabaseOptions(source));
	runSqliteDeferredTransactionSync(sourceDatabase.db, () => copySqliteSessionOwnedStateForRepair({
		canonicalKey: params.canonicalKey,
		destination: params.destinationDatabase,
		...params.preferredEntry ? { preferredEntry: params.preferredEntry } : {},
		...params.preferredSessionKey ? { preferredSessionKey: params.preferredSessionKey } : {},
		source: sourceDatabase,
		sourceEntries: params.sourceEntries,
		sourceKeys: params.sourceKeys
	}), {
		databaseLabel: sourceDatabase.path,
		operationLabel: "session canonical repair source"
	});
}
/** Doctor-only inventory of every generation copied for one canonical-key group. */
function listSqliteSessionGenerationIdsForCanonicalRepair(params) {
	const source = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const database = openOpenClawAgentDatabase(toDatabaseOptions(source));
	return readSessionGenerationIdsForKeys(database, uniqueStrings(params.sourceKeys), { exactStoredKeys: true });
}
/** Doctor-only normalization of imported transcript rows before copy or archival. */
async function ensureSqliteTranscriptGenerationsForCanonicalRepair(sources) {
	const byDatabase = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const resolved = resolveSqliteStoreScope(source.storePath, { agentId: source.agentId });
		const key = `${resolved.path ?? source.storePath}\0${resolved.databaseAgentId ?? resolved.agentId}`;
		const grouped = byDatabase.get(key);
		if (grouped) grouped.sources.push(source);
		else byDatabase.set(key, {
			resolved,
			sources: [source]
		});
	}
	for (const group of byDatabase.values()) await runExclusiveSqliteSessionWrite(group.resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			const sessionIds = uniqueStrings([...group.sources.flatMap((source) => [...collectSessionStateIdsForEntry(source.entry)]), ...readSessionGenerationIdsForKeys(database, group.sources.map((source) => source.sessionKey), { exactStoredKeys: true })]);
			const db = getSessionKysely(database.db);
			for (const sessionId of sessionIds) assertSessionTranscriptHot(database.db, sessionId);
			const eventSessionIds = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("session_id").where("session_id", "in", sessionIds).groupBy("session_id")).rows;
			for (const row of eventSessionIds) ensureTranscriptGenerationInTransaction(database, row.session_id);
		}, toDatabaseOptions(group.resolved), { operationLabel: "session.canonical-repair.ensure-generations" });
	}, "session.canonical-repair.generations");
}
/** Doctor-only same-store rewrite for delivery attribution owned by removed aliases. */
function rehomeSqliteSessionDeliveryReferencesForCanonicalRepair(database, canonicalKey, previousKeys) {
	rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, [{
		canonicalKey,
		previousKeys
	}]);
}
/** Doctor-only batched delivery rewrite with one session identity inventory per database. */
function rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, repairs) {
	if (repairs.length === 0) return;
	const db = getSessionKysely(database.db);
	const storedSessionKeys = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.map((row) => row.session_key);
	const storedSessionKeySet = new Set(storedSessionKeys);
	const identityCounts = /* @__PURE__ */ new Map();
	for (const sessionKey of storedSessionKeys) {
		const identity = normalizeStoreSessionKey(sessionKey);
		identityCounts.set(identity, (identityCounts.get(identity) ?? 0) + 1);
	}
	for (const repair of repairs) {
		const ownedKeys = /* @__PURE__ */ new Set([repair.canonicalKey, ...repair.previousKeys]);
		const ownedIdentityCounts = /* @__PURE__ */ new Map();
		for (const sessionKey of ownedKeys) {
			if (!storedSessionKeySet.has(sessionKey)) continue;
			const identity = normalizeStoreSessionKey(sessionKey);
			ownedIdentityCounts.set(identity, (ownedIdentityCounts.get(identity) ?? 0) + 1);
		}
		const aliases = resolveSqliteCanonicalRepairLookupKeys(repair.canonicalKey, repair.previousKeys).filter((key) => {
			if (key === repair.canonicalKey) return false;
			if (ownedKeys.has(key)) return true;
			const identity = normalizeStoreSessionKey(key);
			return (identityCounts.get(identity) ?? 0) <= (ownedIdentityCounts.get(identity) ?? 0);
		});
		if (aliases.length === 0) continue;
		executeSqliteQuerySync(database.db, db.updateTable("conversation_deliveries").set({ source_session_key: repair.canonicalKey }).where("source_session_key", "in", aliases));
	}
}
function copySqliteSessionOwnedStateForRepair(params) {
	const sourceKeys = uniqueStrings(params.sourceKeys.filter((key) => key.length > 0));
	if (sourceKeys.length === 0) return;
	const sourceDb = getSessionKysely(params.source.db);
	const destinationDb = getSessionKysely(params.destination.db);
	const entrySessionIds = uniqueStrings(params.sourceEntries.flatMap((entry) => [...collectSessionStateIdsForEntry(entry)]));
	const windows = readSqliteSessionGenerationWindows(params.source, sourceKeys, entrySessionIds);
	const sessionIds = uniqueStrings([...windows.map((row) => row.session_id), ...entrySessionIds]);
	for (const sessionId of sessionIds) {
		assertSessionTranscriptHot(params.source.db, sessionId);
		assertSessionTranscriptHot(params.destination.db, sessionId);
	}
	const sessionLinks = sessionIds.length === 0 ? [] : executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_conversations").selectAll().where("session_id", "in", sessionIds)).rows;
	const linkedConversationIds = uniqueStrings([...windows.flatMap((row) => row.primary_conversation_id ? [row.primary_conversation_id] : []), ...sessionLinks.map((row) => row.conversation_id)]);
	const sourceLineageIdentities = new Set(sourceKeys.map(normalizeStoreSessionKey));
	copySessionDeliveriesForRepair({
		canonicalKey: params.canonicalKey,
		destination: params.destination,
		source: params.source,
		sourceKeys,
		linkedConversationIds
	});
	const preferredWindowProjection = params.preferredEntry ? bindSessionWindowEntryProjection({
		entry: params.preferredEntry,
		sessionKey: params.canonicalKey
	}) : void 0;
	const preferredWindowProvenance = params.preferredEntry ? executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.preferredEntry.sessionId)) : void 0;
	for (const window of windows) {
		const canonicalWindow = {
			...rehomeSqliteSessionGenerationWindow(window, params.canonicalKey, sourceLineageIdentities),
			...preferredWindowProjection && window.session_id === params.preferredEntry?.sessionId ? {
				...preferredWindowProjection,
				...preferredWindowProvenance
			} : {}
		};
		const { session_id: _sessionId, ...replacement } = canonicalWindow;
		executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_windows").values(canonicalWindow).onConflict((conflict) => conflict.column("session_id").doUpdateSet(replacement)));
	}
	const copiedWindowIds = new Set(windows.map((row) => row.session_id));
	for (const sessionId of entrySessionIds) {
		if (copiedWindowIds.has(sessionId)) continue;
		const entry = (params.preferredEntry?.sessionId === sessionId ? params.preferredEntry : void 0) ?? params.sourceEntries.find((candidate) => candidate.sessionId === sessionId) ?? params.sourceEntries.find((candidate) => new Set(collectSessionStateIdsForEntry(candidate)).has(sessionId));
		const updatedAt = entry?.updatedAt ?? Date.now();
		const recoveryWindow = {
			session_key: params.canonicalKey,
			previous_session_id: entry?.sessionId === sessionId ? entry.previousSessionId ?? null : null,
			reason: "recovery",
			session_scope: "conversation",
			created_at: updatedAt,
			updated_at: updatedAt
		};
		executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_windows").values({
			session_id: sessionId,
			...recoveryWindow
		}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ session_key: params.canonicalKey })));
	}
	for (const link of sessionLinks) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_conversations").values(link).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({
		first_seen_at: link.first_seen_at,
		last_seen_at: link.last_seen_at
	})));
	for (const sessionId of sessionIds) copySqliteSessionGenerationRows({
		destination: params.destination,
		sessionId,
		source: params.source,
		sourceWindowPresent: copiedWindowIds.has(sessionId)
	});
	deleteSessionMembersForRepair(params.destination, params.canonicalKey);
	copySessionNodeArtifactsForRepair(params.source, params.destination, sourceKeys, params.canonicalKey, { includeMembers: false });
	copySessionNodeArtifactsForRepair(params.source, params.destination, params.preferredSessionKey ? [params.preferredSessionKey] : sourceKeys, params.canonicalKey, { includeParticipants: false });
}
//#endregion
export { rehomeSqliteSessionDeliveryReferencesForCanonicalRepair as a, readSqliteSessionGenerationClaim as c, rehomeSqliteSessionGenerationWindow as d, copySessionDeliveriesForRepair as f, readExactSessionEntryRowForCanonicalRepair as i, readSqliteSessionGenerationComparison as l, resolveSqliteCanonicalRepairLookupKeys as m, ensureSqliteTranscriptGenerationsForCanonicalRepair as n, rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch as o, readSessionDeliveryRepairInventory as p, listSqliteSessionGenerationIdsForCanonicalRepair as r, copySqliteSessionGenerationRows as s, copySqliteSessionOwnedStateForCanonicalRepair as t, readSqliteSessionGenerationWindows as u };

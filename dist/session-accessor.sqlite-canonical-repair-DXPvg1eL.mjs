import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, d as resolveSqliteStoreScope, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { g as copySessionNodeArtifactsForRepair, m as bindSessionWindowEntryProjection, v as deleteSessionMembersForRepair } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { r as ensureTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { d as readSessionGenerationIdsForKeys } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { i as rehomeSqliteSessionGenerationWindow, r as readSqliteSessionGenerationWindows, t as copySqliteSessionGenerationRows } from "./session-accessor.sqlite-generation-copy-BC1ZZuaw.mjs";
//#region src/config/sessions/session-accessor.sqlite-canonical-repair.ts
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
/** Doctor probes only the exact staged target and may replace a malformed partial row. */
function readExactSessionEntryRowForCanonicalRepair(database, sessionKey, options = {}) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "=", sessionKey));
	if (!row) return;
	if (row.entry_json === "{}") {
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key))) return;
	}
	const parsedEntry = parseSessionEntryJson(row);
	if (!parsedEntry && !options.allowMalformedRowRepair) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${sessionKey}`);
	return {
		entry: parsedEntry ?? {
			sessionId: row.current_session_id,
			updatedAt: row.updated_at
		},
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
		const grouped = byDatabase.get(key) ?? {
			resolved,
			sources: []
		};
		byDatabase.set(key, {
			...grouped,
			sources: [...grouped.sources, source]
		});
	}
	for (const group of byDatabase.values()) await runExclusiveSqliteSessionWrite(group.resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			const sessionIds = uniqueStrings([...group.sources.flatMap((source) => [...collectSessionStateIdsForEntry(source.entry)]), ...readSessionGenerationIdsForKeys(database, group.sources.map((source) => source.sessionKey), { exactStoredKeys: true })]);
			const db = getSessionKysely(database.db);
			for (const sessionId of sessionIds) assertSessionTranscriptHot(database.db, sessionId);
			const eventSessionIds = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("session_id").where("session_id", "in", sessionIds).groupBy("session_id")).rows;
			for (const row of eventSessionIds) ensureTranscriptGenerationInTransaction(database, row.session_id);
		}, toDatabaseOptions(group.resolved));
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
		const identity = normalizeStoreSessionKey(sessionKey.trim());
		identityCounts.set(identity, (identityCounts.get(identity) ?? 0) + 1);
	}
	for (const repair of repairs) {
		const ownedKeys = /* @__PURE__ */ new Set([repair.canonicalKey, ...repair.previousKeys]);
		const ownedIdentityCounts = /* @__PURE__ */ new Map();
		for (const sessionKey of ownedKeys) {
			if (!storedSessionKeySet.has(sessionKey)) continue;
			const identity = normalizeStoreSessionKey(sessionKey.trim());
			ownedIdentityCounts.set(identity, (ownedIdentityCounts.get(identity) ?? 0) + 1);
		}
		const aliases = resolveSqliteCanonicalRepairLookupKeys(repair.canonicalKey, repair.previousKeys).filter((key) => {
			if (key === repair.canonicalKey) return false;
			if (ownedKeys.has(key)) return true;
			const identity = normalizeStoreSessionKey(key.trim());
			return (identityCounts.get(identity) ?? 0) <= (ownedIdentityCounts.get(identity) ?? 0);
		});
		if (aliases.length === 0) continue;
		executeSqliteQuerySync(database.db, db.updateTable("conversation_deliveries").set({ source_session_key: repair.canonicalKey }).where("source_session_key", "in", aliases));
	}
}
function copySqliteSessionOwnedStateForRepair(params) {
	const storedSourceKeys = uniqueStrings(params.sourceKeys.filter((key) => key.length > 0));
	if (storedSourceKeys.length === 0) return;
	const sourceKeys = storedSourceKeys;
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
	const sourceKeyReferences = new Set(sourceKeys);
	const sourceLineageIdentities = new Set(sourceKeys.map((key) => normalizeStoreSessionKey(key.trim())));
	const deliveryLookupKeys = resolveSqliteCanonicalRepairLookupKeys(params.canonicalKey, sourceKeys);
	const competingDeliveryIdentities = new Set(executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => sourceKeyReferences.has(row.session_key) ? [] : [normalizeStoreSessionKey(row.session_key.trim())]));
	const deliverySourceKeys = deliveryLookupKeys.filter((key) => sourceKeyReferences.has(key) || !competingDeliveryIdentities.has(normalizeStoreSessionKey(key.trim())));
	const deliverySourceKeyReferences = new Set(deliverySourceKeys);
	const deliveries = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversation_deliveries").selectAll().where("source_session_key", "in", deliverySourceKeys)).rows;
	const conversationIds = uniqueStrings([...linkedConversationIds, ...deliveries.map((delivery) => delivery.conversation_id)]);
	if (conversationIds.length > 0) {
		const conversations = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversations").selectAll().where("conversation_id", "in", conversationIds)).rows;
		for (const conversation of conversations) {
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
			const { operation_id: _operationId, ...replacement } = canonicalDelivery;
			executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("conversation_deliveries").values(canonicalDelivery).onConflict((conflict) => conflict.column("operation_id").doUpdateSet(replacement)));
			const snapshot = executeSqliteQueryTakeFirstSync(params.source.db, sourceCache.selectFrom("cache_entries").selectAll().where("scope", "=", "conversation-progress").where("key", "=", delivery.operation_id));
			if (snapshot) executeSqliteQuerySync(params.destination.db, destinationCache.insertInto("cache_entries").values(snapshot).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet(snapshot)));
			else executeSqliteQuerySync(params.destination.db, destinationCache.deleteFrom("cache_entries").where("scope", "=", "conversation-progress").where("key", "=", delivery.operation_id));
		}
	}
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
		const { session_id: _sessionId, ...replacement } = { ...canonicalWindow };
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
export { rehomeSqliteSessionDeliveryReferencesForCanonicalRepair as a, readExactSessionEntryRowForCanonicalRepair as i, ensureSqliteTranscriptGenerationsForCanonicalRepair as n, rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch as o, listSqliteSessionGenerationIdsForCanonicalRepair as r, copySqliteSessionOwnedStateForCanonicalRepair as t };

import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet } from "./kysely-sync-Bn6Qrpbz.mjs";
import { g as hasPendingInputConsumptionColumn, v as hasSessionPendingInputsSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { i as parseSqliteSessionEntryRecord } from "./conversation-ref-8kIjGCCc.mjs";
import { s as sessionEntryMetadataJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
import { t as readLegacyCompactionHistory } from "./legacy-compaction-history-D-x7k5QQ.mjs";
//#region src/config/sessions/session-cold-storage-eligibility.ts
/** Cold storage preserves logical owners; only activity and explicit cross-generation references protect bytes. */
function readSessionColdStorageProtection(database, beforeMs) {
	const db = getNodeSqliteKysely(database.db);
	const protectedIds = /* @__PURE__ */ new Set();
	const busyKeys = /* @__PURE__ */ new Set();
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at",
		"status",
		"last_activity_at",
		"last_interaction_at",
		sessionEntryMetadataJson
	]))) {
		const record = parseSqliteSessionEntryRecord(row);
		const entry = record ? projectCanonicalSessionEntryShape(record) : null;
		const recovery = record?.mainRestartRecovery;
		const recoveryPending = entry?.restartRecoveryBeforeAgentReplyState === "admitted" || entry?.restartRecoveryBeforeAgentReplyState === "pending" || entry?.restartRecoveryBeforeAgentReplyState === "continue" || entry?.restartRecoveryDeliveryReceiptState === "terminal-pending" || isRecord(recovery) && (Boolean(recovery.reservation) || Boolean(recovery.foregroundClaims));
		if (!entry || recoveryPending) busyKeys.add(row.session_key);
		if (row.status === "running" || Math.max(row.updated_at, row.last_activity_at ?? 0, row.last_interaction_at ?? 0) >= beforeMs) protectedIds.add(row.current_session_id);
		if (!entry) continue;
		if (entry.previousSessionId) protectedIds.add(entry.previousSessionId);
		for (const id of entry.usageFamilySessionIds ?? []) if (id !== row.current_session_id) protectedIds.add(id);
		for (const checkpoint of readLegacyCompactionHistory(entry)) {
			if (checkpoint.sessionId) protectedIds.add(checkpoint.sessionId);
			if (checkpoint.preCompaction.sessionId) protectedIds.add(checkpoint.preCompaction.sessionId);
			if (checkpoint.postCompaction.sessionId) protectedIds.add(checkpoint.postCompaction.sessionId);
		}
	}
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where((eb) => eb.or([
		...busyKeys.size > 0 ? [eb("session_key", "in", sqliteStringSet([...busyKeys]))] : [],
		eb("status", "=", "running"),
		eb("updated_at", ">=", beforeMs),
		eb(eb.fn.coalesce("transcript_updated_at", eb.val(0)), ">=", beforeMs)
	])))) protectedIds.add(row.session_id);
	if (hasSessionPendingInputsSchema(database.db)) for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_pending_inputs").select("session_id").where("state", "in", ["queued", "interrupted"]).$if(hasPendingInputConsumptionColumn(database.db), (query) => query.where("consumed_event_id", "is", null)))) protectedIds.add(row.session_id);
	return protectedIds;
}
//#endregion
export { readSessionColdStorageProtection as t };

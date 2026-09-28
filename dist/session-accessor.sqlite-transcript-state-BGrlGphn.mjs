import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { c as prepareSqliteQueryTakeFirstSync, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { a as normalizeStoreSessionKey, n as foldedSessionKeyAliasCandidates, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { a as assertCanonicalSqliteSessionRootWrite, h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { a as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { t as certifyCanonicalSessionValidationRow } from "./session-canonical-validation-DxuYA6hL.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-state.ts
function createTranscriptContextVersionQuery(database) {
	const db = getSessionKysely(database.db);
	return prepareSqliteQueryTakeFirstSync(database.db, (parameter) => db.selectFrom("transcript_events").select((eb) => [
		eb.fn.max("seq").as("rawSeq"),
		eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", parameter((sessionId) => sessionId)).as("generation"),
		eb.selectFrom("session_windows").select("transcript_updated_at").where("session_id", "=", parameter((sessionId) => sessionId)).as("updatedAt")
	]).where("session_id", "=", parameter((sessionId) => sessionId)));
}
const transcriptContextVersionQueries = /* @__PURE__ */ new WeakMap();
function readTranscriptContextVersionInTransaction(database, sessionId) {
	const cold = readSessionColdTranscript(database.db, sessionId);
	let query = transcriptContextVersionQueries.get(database.db);
	if (!query) {
		query = createTranscriptContextVersionQuery(database);
		transcriptContextVersionQueries.set(database.db, query);
	}
	const version = query(sessionId);
	return cold ? {
		...version,
		rawSeq: cold.last_seq
	} : version;
}
function createTranscriptGeneration() {
	return randomUUID().replaceAll("-", "");
}
/** Read the current raw transcript generation inside the caller's transaction. */
function readTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation;
}
/** Materialize a generation once; pure appends must preserve an existing token. */
function ensureTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doNothing()));
}
/** Rotate the watermark in the same transaction as destructive transcript replacement. */
function rotateTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		generation,
		updated_at: Date.now()
	})));
	return generation;
}
function ensureTranscriptSessionRoot(database, scope, updatedAt, options = {}) {
	const db = getSessionKysely(database.db);
	let nodeExists = false;
	if (!options.allowStoredAlias) {
		assertCanonicalSqliteSessionRootWrite(database, scope.sessionKey);
		const persistedSessionKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", scope.sessionId))?.session_key;
		if (persistedSessionKey && persistedSessionKey !== scope.sessionKey) throw new Error(`Transcript session ${scope.sessionId} is owned by ${persistedSessionKey}, not ${scope.sessionKey}; resolve the transcript target again before retrying.`);
		const lookupKeys = uniqueStrings([scope.sessionKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(scope.sessionKey))]);
		const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"current_session_id",
			"entry_json",
			"entry_valid",
			"session_key",
			"updated_at"
		]).where("session_key", "in", lookupKeys)).rows;
		for (const candidate of candidates) {
			const entry = parseSessionEntryJson(candidate);
			if (!entry) {
				if (!(candidate.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", candidate.current_session_id).where("session_key", "=", candidate.session_key)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${candidate.session_key}`);
				continue;
			}
			if (resolveDeliveryProvenCanonicalSessionKey(candidate.session_key, entry) !== candidate.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${candidate.session_key}`);
		}
		const existing = candidates.find((candidate) => candidate.session_key === scope.sessionKey);
		nodeExists = existing !== void 0;
		if (existing && existing.entry_valid !== 1) {
			if (!(existing.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", existing.current_session_id).where("session_key", "=", scope.sessionKey)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${scope.sessionKey}`);
		}
	}
	if (!nodeExists) {
		if ((executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
			session_key: scope.sessionKey,
			current_session_id: scope.sessionId,
			entry_json: "{}",
			entry_valid: -1,
			updated_at: updatedAt
		}).onConflict((conflict) => conflict.column("session_key").doNothing())).numAffectedRows ?? 0n) > 0n) {
			executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", scope.sessionKey));
			publishSessionEntryCacheInvalidation(database, { sessionKey: scope.sessionKey });
		}
	}
	executeSqliteQuerySync(database.db, db.insertInto("session_windows").values({
		session_id: scope.sessionId,
		session_key: scope.sessionKey,
		previous_session_id: null,
		reason: null,
		session_scope: "conversation",
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ updated_at: updatedAt })));
	if (!options.allowStoredAlias) certifyCanonicalSessionValidationRow(database, scope.sessionKey);
}
function readNextTranscriptSeq(database, sessionId) {
	assertSessionTranscriptHot(database.db, sessionId);
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId));
	return (row?.max_seq === null || row?.max_seq === void 0 ? -1 : coerceRequiredSqliteNumber(row.max_seq)) + 1;
}
function normalizeTranscriptMutationAtMs(value) {
	const timestamp = Math.floor(value);
	return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : void 0;
}
function createTranscriptMutationStateQuery(database) {
	const db = getSessionKysely(database.db);
	return prepareSqliteQueryTakeFirstSync(database.db, (parameter) => db.selectFrom("session_windows").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", parameter((sessionId) => sessionId)));
}
const transcriptMutationStateQueries = /* @__PURE__ */ new WeakMap();
function readTranscriptMutationStateInTransaction(database, sessionId) {
	let query = transcriptMutationStateQueries.get(database.db);
	if (!query) {
		query = createTranscriptMutationStateQuery(database);
		transcriptMutationStateQueries.set(database.db, query);
	}
	const row = query(sessionId);
	return {
		observedAt: row?.transcript_observed_at ?? null,
		updatedAt: row?.transcript_updated_at ?? null
	};
}
function advanceTranscriptMutationAtInTransaction(database, sessionId, value, options = {}) {
	const transcriptUpdatedAt = normalizeTranscriptMutationAtMs(value);
	if (transcriptUpdatedAt === void 0) return;
	const state = readTranscriptMutationStateInTransaction(database, sessionId);
	const next = options.strictly ? Math.max(transcriptUpdatedAt, (state.updatedAt ?? -1) + 1, (state.observedAt ?? -1) + 1) : Math.max(transcriptUpdatedAt, state.updatedAt ?? 0);
	if (state.updatedAt !== null && state.updatedAt >= next) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ transcript_updated_at: next }).where("session_id", "=", sessionId));
}
function touchTranscriptMutationInTransaction(database, sessionId) {
	const now = normalizeTranscriptMutationAtMs(Date.now());
	if (now !== void 0) advanceTranscriptMutationAtInTransaction(database, sessionId, now, { strictly: true });
}
function deleteTranscriptEventsInTransaction(database, sessionId) {
	assertSessionTranscriptHot(database.db, sessionId);
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
	return (executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId)).numAffectedRows ?? 0n) > 0n;
}
//#endregion
export { readNextTranscriptSeq as a, readTranscriptMutationStateInTransaction as c, ensureTranscriptSessionRoot as i, rotateTranscriptGenerationInTransaction as l, deleteTranscriptEventsInTransaction as n, readTranscriptContextVersionInTransaction as o, ensureTranscriptGenerationInTransaction as r, readTranscriptGenerationInTransaction as s, advanceTranscriptMutationAtInTransaction as t, touchTranscriptMutationInTransaction as u };

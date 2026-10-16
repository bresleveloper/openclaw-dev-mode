import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as normalizeStoreSessionKey, n as foldedSessionKeyAliasCandidates, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { f as publishSessionEntryPlaceholderInsertion } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { g as canonicalSessionKeyMigrationRequiredError, i as assertCanonicalSqliteSessionRootWrite } from "./session-canonical-key-D1TSJMmX.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { t as certifyCanonicalSessionValidationRow } from "./session-canonical-validation-RtyogOdc.mjs";
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
const transcriptContextVersionQuery = createSqliteQueryCache((db) => createTranscriptContextVersionQuery({ db }));
function readTranscriptContextVersionInTransaction(database, sessionId) {
	const cold = readSessionColdTranscript(database.db, sessionId);
	const version = transcriptContextVersionQuery(database.db)(sessionId);
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
			"entry_valid",
			"session_key",
			"updated_at"
		]).select("entry_json").where("session_key", "in", lookupKeys)).rows;
		let retainedRoot = false;
		for (const candidate of candidates) {
			const entry = parseSessionEntryJson(candidate, "list");
			if (!entry) {
				if (!(candidate.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", candidate.current_session_id).where("session_key", "=", candidate.session_key)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${candidate.session_key}`);
				retainedRoot ||= candidate.session_key === scope.sessionKey;
				continue;
			}
			if (resolveDeliveryProvenCanonicalSessionKey(candidate.session_key, entry) !== candidate.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${candidate.session_key}`);
		}
		const existing = candidates.find((candidate) => candidate.session_key === scope.sessionKey);
		nodeExists = existing !== void 0;
		if (existing && existing.entry_valid !== 1 && !retainedRoot) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${scope.sessionKey}`);
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
			publishSessionEntryPlaceholderInsertion(database, {
				sessionKey: scope.sessionKey,
				sessionId: scope.sessionId
			});
			options.onPlaceholderInserted?.({
				sessionKey: scope.sessionKey,
				sessionId: scope.sessionId
			});
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
const transcriptMutationStateQuery = createSqliteQueryCache((db) => createTranscriptMutationStateQuery({ db }));
function readTranscriptMutationStateInTransaction(database, sessionId) {
	const row = transcriptMutationStateQuery(database.db)(sessionId);
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
	advanceTranscriptMutationAtInTransaction(database, sessionId, Date.now(), { strictly: true });
}
function deleteTranscriptEventsInTransaction(database, sessionId) {
	assertSessionTranscriptHot(database.db, sessionId);
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
	return (executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId)).numAffectedRows ?? 0n) > 0n;
}
function pruneTranscriptReactionsInTransaction(database, scope, removedEventIds) {
	const query = getSessionKysely(database.db).deleteFrom("session_reactions").where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where((eb) => eb.not(eb.exists(eb.selectFrom("transcript_event_identities").select("event_id").whereRef("session_id", "=", "session_reactions.session_id").whereRef("event_id", "=", "session_reactions.message_id"))));
	if (removedEventIds === void 0) {
		executeSqliteQuerySync(database.db, query);
		return;
	}
	for (let start = 0; start < removedEventIds.length; start += 500) executeSqliteQuerySync(database.db, query.where("message_id", "in", removedEventIds.slice(start, start + 500)));
}
//#endregion
export { pruneTranscriptReactionsInTransaction as a, readTranscriptGenerationInTransaction as c, touchTranscriptMutationInTransaction as d, ensureTranscriptSessionRoot as i, readTranscriptMutationStateInTransaction as l, deleteTranscriptEventsInTransaction as n, readNextTranscriptSeq as o, ensureTranscriptGenerationInTransaction as r, readTranscriptContextVersionInTransaction as s, advanceTranscriptMutationAtInTransaction as t, rotateTranscriptGenerationInTransaction as u };

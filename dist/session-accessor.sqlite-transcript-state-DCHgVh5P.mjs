import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, n as createSqliteQueryCache, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as normalizeStoreSessionKey, n as foldedSessionKeyAliasCandidates, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as publishSessionEntryPlaceholderInsertion } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as markCanonicalSessionValidationPending, h as canonicalSessionKeyMigrationRequiredError, i as assertCanonicalSqliteSessionRootWrite } from "./session-canonical-key-B7chVWi3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as publishSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { n as retainTranscriptContextFacts, t as readTranscriptContextFacts } from "./session-transcript-context-facts-JwNz0kep.mjs";
import { i as readSessionColdTranscript, n as assertSessionTranscriptHot, t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as preserveSessionEntryCacheAcrossWrite } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { t as deriveSessionPredicateColumns } from "./session-predicate-columns-DCy-hoSP.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-transcript-state.ts
const transcriptContextVersionQuery = createSqliteQueryCache((database) => {
	const db = getSessionKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("transcript_events").select((eb) => [
		eb.fn.coalesce(eb.selectFrom("session_transcript_cold_archives").select("last_seq").where("session_id", "=", parameter((sessionId) => sessionId)), eb.fn.max("seq")).as("rawSeq"),
		eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", parameter((sessionId) => sessionId)).as("generation"),
		eb.selectFrom("session_windows").select("transcript_updated_at").where("session_id", "=", parameter((sessionId) => sessionId)).as("updatedAt"),
		eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", parameter((sessionId) => sessionId))).as("cold")
	]).where("session_id", "=", parameter((sessionId) => sessionId)));
});
function readContextState(database, sessionId) {
	const revision = getSqliteReadScopeRevision(database.db);
	const { cold, ...version } = transcriptContextVersionQuery(database.db)(sessionId);
	retainTranscriptContextFacts(database, sessionId, version, revision, Boolean(cold));
	return {
		version,
		cold: Boolean(cold)
	};
}
function readTranscriptContextVersionInTransaction(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) return { ...actor.hot.transcript.version };
	return { ...readTranscriptContextFacts(database, sessionId)?.version ?? readContextState(database, sessionId).version };
}
/** Preparation consumes cold presence and the matching version from one read phase. */
function readTranscriptContextStateInTransaction(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) return {
		coldArchive: actor.transcript.coldArchive,
		version: { ...actor.hot.transcript.version }
	};
	const retained = readTranscriptContextFacts(database, sessionId);
	const state = retained?.cold === void 0 ? readContextState(database, sessionId) : retained;
	return {
		coldArchive: state.cold ? readSessionColdTranscript(database.db, sessionId) : void 0,
		version: { ...state.version }
	};
}
function createTranscriptGeneration() {
	return randomUUID().replaceAll("-", "");
}
/** Read the current raw transcript generation inside the caller's transaction. */
function readTranscriptGenerationInTransaction(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) return actor.hot.transcript.version.generation ?? void 0;
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation;
}
/** Materialize a generation once; pure appends must preserve an existing token. */
function ensureTranscriptGenerationInTransaction(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor?.hot.transcript.version.generation) return;
	const generation = writeTranscriptGeneration(database, sessionId, false);
	if (actor) {
		actor.hot.transcript.version.generation = generation;
		actor.hot.transcript.watermark.generation = generation;
	}
}
/** Rotate the watermark in the same transaction as destructive transcript replacement. */
function rotateTranscriptGenerationInTransaction(database, sessionId) {
	return writeTranscriptGeneration(database, sessionId, true);
}
function writeTranscriptGeneration(database, sessionId, rotate) {
	return withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
		const db = getSessionKysely(database.db);
		const generation = createTranscriptGeneration();
		executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
			session_id: sessionId,
			generation,
			updated_at: Date.now()
		}).onConflict((conflict) => rotate ? conflict.column("session_id").doUpdateSet({
			generation,
			updated_at: Date.now()
		}) : conflict.column("session_id").doNothing()));
		return generation;
	});
}
function ensureTranscriptSessionRoot(database, scope, updatedAt, options = {}) {
	return withSqliteDatabaseWriteScope(database.db, [scope.sessionKey, sqliteSessionIdWriteScope(scope.sessionId)], () => {
		const db = getSessionKysely(database.db);
		const actor = readSessionActorTransactionState(database, scope);
		if (actor?.window) {
			if (actor.window.session_key !== scope.sessionKey) throw new Error("Session actor transcript window belongs to another logical owner");
			if (options.deferExistingWindowTouch) return;
		} else {
			let nodeExists = false;
			if (!options.allowStoredAlias) {
				assertCanonicalSqliteSessionRootWrite(database, scope.sessionKey);
				const lookupKeys = uniqueStrings([scope.sessionKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(scope.sessionKey))]);
				const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
					"current_session_id",
					"entry_valid",
					"session_key",
					"updated_at"
				]).select("entry_json").select((eb) => eb.selectFrom("session_windows").select("session_key").where("session_id", "=", scope.sessionId).as("persisted_session_key")).where("session_key", "in", lookupKeys)).rows;
				const persistedSessionKey = candidates.length > 0 ? candidates[0].persisted_session_key : executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", scope.sessionId))?.session_key;
				if (persistedSessionKey && persistedSessionKey !== scope.sessionKey) throw new Error(`Transcript session ${scope.sessionId} is owned by ${persistedSessionKey}, not ${scope.sessionKey}; resolve the transcript target again before retrying.`);
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
			if (options.allowStoredAlias) markCanonicalSessionValidationPending(database, [scope.sessionKey]);
			if (!nodeExists) {
				if ((executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
					session_key: scope.sessionKey,
					current_session_id: scope.sessionId,
					entry_json: "{}",
					...deriveSessionPredicateColumns("{}"),
					session_started_at: null,
					entry_valid: -1,
					updated_at: updatedAt
				}).onConflict((conflict) => conflict.column("session_key").doNothing())).numAffectedRows ?? 0n) > 0n) {
					publishSessionEntryPlaceholderInsertion(database, {
						sessionKey: scope.sessionKey,
						sessionId: scope.sessionId
					});
					withoutSqliteDatabaseWriteScope(database.db, () => options.onPlaceholderInserted?.({
						sessionKey: scope.sessionKey,
						sessionId: scope.sessionId
					}));
				}
			}
		}
		preserveSessionEntryCacheAcrossWrite(database, () => {
			executeSqliteQuerySync(database.db, db.insertInto("session_windows").values({
				session_id: scope.sessionId,
				session_key: scope.sessionKey,
				previous_session_id: null,
				reason: null,
				session_scope: "conversation",
				created_at: updatedAt,
				updated_at: updatedAt
			}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ updated_at: updatedAt })));
		});
		if (actor?.window) actor.window.updated_at = updatedAt;
	});
}
function readNextTranscriptSeq(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) {
		if (actor.transcript.coldArchive) throw new SessionTranscriptColdError(sessionId);
		return (actor.hot.transcript.version.rawSeq ?? -1) + 1;
	}
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => [eb.fn.max("seq").as("max_seq"), eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", sessionId)).as("cold")]).where("session_id", "=", sessionId));
	if (row?.cold) throw new SessionTranscriptColdError(sessionId);
	return (row?.max_seq === null || row?.max_seq === void 0 ? -1 : coerceRequiredSqliteNumber(row.max_seq)) + 1;
}
const transcriptMutationStateQuery = createSqliteQueryCache((database) => {
	const db = getSessionKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("session_windows").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", parameter((sessionId) => sessionId)));
});
function readTranscriptMutationStateInTransaction(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) return {
		observedAt: actor.window?.transcript_observed_at ?? null,
		updatedAt: actor.window?.transcript_updated_at ?? null
	};
	const row = transcriptMutationStateQuery(database.db)(sessionId);
	return {
		observedAt: row?.transcript_observed_at ?? null,
		updatedAt: row?.transcript_updated_at ?? null
	};
}
function advanceTranscriptMutationAtInTransaction(database, sessionId, value, options = {}) {
	return withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
		let transcriptUpdatedAt = Math.floor(value);
		if (!Number.isFinite(transcriptUpdatedAt) || transcriptUpdatedAt < 0) return;
		if (!options.strictly) {
			const state = readTranscriptMutationStateInTransaction(database, sessionId);
			transcriptUpdatedAt = Math.max(transcriptUpdatedAt, state.updatedAt ?? 0);
			if (state.updatedAt !== null && state.updatedAt >= transcriptUpdatedAt) return;
		}
		const db = getSessionKysely(database.db);
		const actor = readSessionActorTransactionState(database, { sessionId });
		if (actor?.window && options.strictly) transcriptUpdatedAt = Math.max(transcriptUpdatedAt, (actor.window.transcript_updated_at ?? -1) + 1, (actor.window.transcript_observed_at ?? -1) + 1);
		const update = db.updateTable("session_windows").set((eb) => {
			const nextUpdatedAt = options.strictly && !actor?.window ? eb.fn("max", [
				eb.val(transcriptUpdatedAt),
				eb(eb.fn.coalesce("transcript_updated_at", eb.val(-1)), "+", 1),
				eb(eb.fn.coalesce("transcript_observed_at", eb.val(-1)), "+", 1)
			]) : transcriptUpdatedAt;
			return {
				...options.windowUpdatedAt !== void 0 ? { updated_at: options.windowUpdatedAt } : {},
				transcript_updated_at: nextUpdatedAt,
				...options.rowTranscript ? {
					row_transcript_json: JSON.stringify(options.rowTranscript),
					row_transcript_updated_at: nextUpdatedAt
				} : {}
			};
		}).where("session_id", "=", sessionId);
		if (!findOpenClawAgentDatabaseIdentity(database)) {
			executeSqliteQuerySync(database.db, update);
			return;
		}
		if (actor?.window) {
			executeSqliteQuerySync(database.db, update);
			if (options.windowUpdatedAt !== void 0) actor.window.updated_at = options.windowUpdatedAt;
			actor.window.transcript_updated_at = transcriptUpdatedAt;
			actor.hot.transcript.version.updatedAt = transcriptUpdatedAt;
			const projection = actor.transcript.projection;
			publishSessionTranscriptAuthority(database, {
				...actor.hot.transcript.version,
				sessionId,
				sessionKey: actor.hot.target.sessionKey,
				leafEventId: projection?.leafEventId ?? null,
				indexedSeq: projection?.indexedSeq ?? null,
				activeMessageCount: projection?.activeMessageCount ?? null,
				needsRebuild: projection ? projection.needsRebuild ? 1 : 0 : null,
				...options.rowTranscript ? {
					lastMessagePreview: options.rowTranscript.lastMessagePreview,
					terminalModel: options.rowTranscript.terminalModel
				} : {}
			});
			return;
		}
		const context = executeSqliteQueryTakeFirstSync(database.db, update.returning((eb) => [
			"session_id as sessionId",
			"session_key as sessionKey",
			"transcript_updated_at as updatedAt",
			eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation"),
			eb.fn.coalesce(eb.selectFrom("session_transcript_cold_archives").select("last_seq").where("session_id", "=", sessionId), eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("seq")).where("session_id", "=", sessionId)).as("rawSeq"),
			eb.selectFrom("session_transcript_index_state").select("leaf_event_id").where("session_id", "=", sessionId).as("leafEventId"),
			eb.selectFrom("session_transcript_index_state").select("indexed_seq").where("session_id", "=", sessionId).as("indexedSeq"),
			eb.selectFrom("session_transcript_index_state").select("active_message_count").where("session_id", "=", sessionId).as("activeMessageCount"),
			eb.selectFrom("session_transcript_index_state").select("needs_rebuild").where("session_id", "=", sessionId).as("needsRebuild")
		]).$assertType());
		if (context) {
			retainTranscriptContextFacts(database, sessionId, {
				generation: context.generation,
				rawSeq: context.rawSeq,
				updatedAt: context.updatedAt
			}, getSqliteReadScopeRevision(database.db));
			publishSessionTranscriptAuthority(database, {
				...context,
				...options.rowTranscript ? {
					lastMessagePreview: options.rowTranscript.lastMessagePreview,
					terminalModel: options.rowTranscript.terminalModel
				} : {}
			});
		}
	});
}
function touchTranscriptMutationInTransaction(database, sessionId, windowUpdatedAt, rowTranscript) {
	advanceTranscriptMutationAtInTransaction(database, sessionId, Date.now(), {
		strictly: true,
		windowUpdatedAt,
		rowTranscript
	});
}
function deleteTranscriptEventsInTransaction(database, sessionId) {
	return withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
		assertSessionTranscriptHot(database.db, sessionId);
		const db = getSessionKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
		return (executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId)).numAffectedRows ?? 0n) > 0n;
	});
}
function pruneTranscriptReactionsInTransaction(database, scope, removedEventIds) {
	return withSqliteDatabaseWriteScope(database.db, [scope.sessionKey, sqliteSessionIdWriteScope(scope.sessionId)], () => {
		const query = getSessionKysely(database.db).deleteFrom("session_reactions").where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where((eb) => eb.not(eb.exists(eb.selectFrom("transcript_event_identities").select("event_id").whereRef("session_id", "=", "session_reactions.session_id").whereRef("event_id", "=", "session_reactions.message_id"))));
		if (removedEventIds === void 0) {
			executeSqliteQuerySync(database.db, query);
			return;
		}
		for (let start = 0; start < removedEventIds.length; start += 500) executeSqliteQuerySync(database.db, query.where("message_id", "in", removedEventIds.slice(start, start + 500)));
	});
}
//#endregion
export { pruneTranscriptReactionsInTransaction as a, readTranscriptContextVersionInTransaction as c, rotateTranscriptGenerationInTransaction as d, touchTranscriptMutationInTransaction as f, ensureTranscriptSessionRoot as i, readTranscriptGenerationInTransaction as l, deleteTranscriptEventsInTransaction as n, readNextTranscriptSeq as o, ensureTranscriptGenerationInTransaction as r, readTranscriptContextStateInTransaction as s, advanceTranscriptMutationAtInTransaction as t, readTranscriptMutationStateInTransaction as u };

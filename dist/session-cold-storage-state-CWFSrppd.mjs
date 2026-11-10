import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { E as readSqliteDatabaseScopedWriteToken, G as sqliteSessionIdWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as getSqliteReadScopeRevision, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { t as readTranscriptContextFacts } from "./session-transcript-context-facts-JwNz0kep.mjs";
//#region src/config/sessions/session-cold-storage-state.ts
const sessionColdArchiveMetadataColumns = [
	"session_id",
	"generation",
	"archive_name",
	"archive_sha256",
	"event_count",
	"raw_bytes",
	"archive_bytes",
	"last_seq",
	"archived_at",
	"storage"
];
function createColdTranscriptQueries(db) {
	const kysely = getNodeSqliteKysely(db);
	return {
		facts: /* @__PURE__ */ new Map(),
		metadata: prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("session_transcript_cold_archives").select(sessionColdArchiveMetadataColumns).where("session_id", "=", parameter((sessionId) => sessionId))),
		marker: prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", parameter((sessionId) => sessionId)))
	};
}
const getColdTranscriptQueries = createSqliteQueryCache(createColdTranscriptQueries);
function retainColdFact(db, sessionId, fact) {
	const facts = getColdTranscriptQueries(db).facts;
	facts.delete(sessionId);
	facts.set(sessionId, fact);
	pruneMapToMaxSize(facts, 128);
}
function readSessionTranscriptCold(db, sessionId) {
	return runSqliteReadOperationSync(db, () => {
		const queries = getColdTranscriptQueries(db);
		const revision = getSqliteReadScopeRevision(db);
		const token = revision !== void 0 && revision.snapshot === void 0 && !db.isTransaction ? readSqliteDatabaseScopedWriteToken(db, [sqliteSessionIdWriteScope(sessionId)]) : void 0;
		const retained = queries.facts.get(sessionId);
		if (retained && (revision !== void 0 && retained.revision === revision || token !== void 0 && retained.token === token)) return retained.cold;
		const cold = queries.marker(sessionId).rows.length > 0;
		if (revision) retainColdFact(db, sessionId, {
			cold,
			revision,
			token
		});
		return cold;
	});
}
function readSessionColdTranscript(db, sessionId) {
	const actor = readSessionActorTransactionState({ db }, { sessionId });
	if (actor) return actor.transcript.coldArchive && { ...actor.transcript.coldArchive };
	return getColdTranscriptQueries(db).metadata(sessionId).rows[0];
}
var SessionTranscriptColdError = class extends Error {
	constructor(sessionId) {
		super(`Transcript ${sessionId} is in cold storage. Restore its archive before reading or changing the transcript.`);
		this.sessionId = sessionId;
		this.code = "TRANSCRIPT_COLD";
		this.name = "SessionTranscriptColdError";
	}
};
function assertSessionTranscriptHot(db, sessionId) {
	const actor = readSessionActorTransactionState({ db }, { sessionId });
	if (actor) {
		if (actor.transcript.coldArchive) throw new SessionTranscriptColdError(sessionId);
		return;
	}
	const context = readTranscriptContextFacts({ db }, sessionId);
	if (context?.cold === false) return;
	if (context?.cold || readSessionTranscriptCold(db, sessionId)) throw new SessionTranscriptColdError(sessionId);
}
/** The cold marker and transcript rows must belong to the same native snapshot. */
function readHotSessionTranscriptSnapshot(database, sessionId, purpose, read) {
	const { db } = database;
	if (db.isTransaction) {
		assertTransactionUsable(db);
		const result = runSqliteReadOperationSync(db, () => {
			assertSessionTranscriptHot(db, sessionId);
			return read();
		});
		assertTransactionUsable(db);
		return result;
	}
	return runSqliteDeferredTransactionSync(db, () => {
		assertSessionTranscriptHot(db, sessionId);
		return read();
	}, { operationLabel: `session transcript ${purpose} read` });
}
//#endregion
export { sessionColdArchiveMetadataColumns as a, readSessionColdTranscript as i, assertSessionTranscriptHot as n, readHotSessionTranscriptSnapshot as r, SessionTranscriptColdError as t };

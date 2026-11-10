import { A as readSqliteDatabaseWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as getSqliteReadScopeRevision, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { a as readCurrentSessionEntryCacheParticipants, r as readParticipantIdentity } from "./session-participant-identity-Btc25HNW.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
//#region src/config/sessions/session-actor-entry-publication.worker.ts
const owners = /* @__PURE__ */ new WeakMap();
const participantOwners = /* @__PURE__ */ new WeakMap();
function registerSessionActorParticipantOwner(database, owner) {
	participantOwners.set(database.db, owner);
}
/** Transaction-local writes take precedence over the resident committed preimage. */
function readSessionActorParticipants(database, sessionKey) {
	const transaction = readSessionActorTransactionState(database, { sessionKey });
	const participants = transaction?.hot.target.sessionKey === sessionKey ? transaction.hot.participants : participantOwners.get(database.db)?.read(database, sessionKey);
	return participants && structuredClone([...participants]);
}
function prepareSessionActorParticipantUpdate(database, sessionKey, singleStatement = false) {
	return participantOwners.get(database.db)?.prepare(database, sessionKey, singleStatement);
}
function registerSessionActorEntryPatchOwner(database, prepare) {
	owners.set(database.db, prepare);
}
/** Only a resident actor can retain the pending and transcript facts untouched by an entry patch. */
function prepareSessionActorEntryPatch(database, sessionKey) {
	return owners.get(database.db)?.(database, sessionKey);
}
//#endregion
//#region src/config/sessions/session-participant-prepared-read.ts
let preparedRead;
/** Only synchronous materialization borrows facts; transaction authority always reads its owner. */
function withPreparedSessionParticipants(read, consume) {
	const previous = preparedRead;
	preparedRead = read;
	try {
		return consume();
	} finally {
		preparedRead = previous;
	}
}
function readPreparedSessionParticipants(database, sessionKey) {
	if (!preparedRead || database.isTransaction) return;
	const identity = findOpenClawAgentDatabaseIdentity({ db: database })?.identity;
	if (identity === void 0) return;
	const projection = preparedRead(identity, sessionKey);
	return projection && {
		...projection.participants ? { participants: projection.participants.map(({ identity: participantIdentity }) => ({ identity: { ...participantIdentity } })) } : {},
		...projection.participantCount === void 0 ? {} : { participantCount: projection.participantCount }
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-projection.ts
function selectParticipantRows(database) {
	return getNodeSqliteKysely(database).selectFrom("session_participants").select([
		"session_key",
		"identity_namespace",
		"actor_id",
		"contribution_count",
		"first_prompted_at",
		"last_prompted_at"
	]).orderBy("session_key").orderBy("first_prompted_at").orderBy("actor_id").orderBy("identity_namespace");
}
let participantWriteSnapshot;
/** The entry CAS owns an immediate transaction before borrowing its unchanged preparation. */
function withSessionParticipantWriteSnapshot(database, read) {
	const previous = participantWriteSnapshot;
	participantWriteSnapshot = database;
	try {
		return read();
	} finally {
		participantWriteSnapshot = previous;
	}
}
const singleSessionParticipantQuery = createSqliteQueryCache((database) => {
	const query = prepareSqliteQuerySync(database, (parameter) => selectParticipantRows(database).where("session_key", "=", parameter((sessionKey) => sessionKey)));
	let last;
	return (key) => runSqliteReadOperationSync(database, () => {
		const revision = getSqliteReadScopeRevision(database);
		if (revision && last?.key === key && (last.revision === revision || participantWriteSnapshot === database && last.revision.snapshot === void 0 && last.revision.schema === revision.schema && last.revision.mutationRevision === revision.mutationRevision && last.revision.writeRevision === readSqliteDatabaseWriteRevision(database))) {
			last.revision = revision;
			return last.rows;
		}
		const rows = query(key).rows;
		last = revision ? {
			key,
			revision,
			rows
		} : void 0;
		return rows;
	});
});
function readParticipantRows(database, sessionKeys) {
	const sessionKey = sessionKeys?.length === 1 ? sessionKeys[0] : void 0;
	if (sessionKey !== void 0) return singleSessionParticipantQuery(database)(sessionKey);
	let query = selectParticipantRows(database);
	if (sessionKeys) query = query.where("session_key", "in", sqliteStringSet(sessionKeys));
	return executeSqliteQuerySync(database, query).rows;
}
function readParticipantRecord(row) {
	return {
		identity: readParticipantIdentity(row.identity_namespace, row.actor_id),
		contributionCount: row.contribution_count,
		firstPromptedAt: row.first_prompted_at,
		lastPromptedAt: row.last_prompted_at
	};
}
function participantRecordsBySessionKey(database, sessionKeys) {
	return runSqliteReadOperationSync(database, () => {
		const records = /* @__PURE__ */ new Map();
		const missing = sessionKeys?.filter((sessionKey) => {
			const participants = readSessionActorParticipants({ db: database }, sessionKey);
			if (participants === void 0) return true;
			if (participants.length) records.set(sessionKey, participants);
			return false;
		});
		if (missing?.length === 0) return records;
		if (!tableExists(database, "session_participants")) return records;
		for (const row of readParticipantRows(database, missing)) {
			const participants = records.get(row.session_key) ?? [];
			participants.push(readParticipantRecord(row));
			records.set(row.session_key, participants);
		}
		return records;
	});
}
function participantProjection(records) {
	if (records.length === 0) return {};
	return {
		participants: records.map(({ identity }) => ({ identity })),
		participantCount: records.length
	};
}
function withProjectedParticipants(entry, records) {
	return records.length ? {
		...entry,
		...participantProjection(records)
	} : entry;
}
function readSqliteSessionParticipantProjection(database, sessionKey) {
	const actor = readSessionActorParticipants({ db: database }, sessionKey);
	if (actor !== void 0) return participantProjection(actor);
	return readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey) ?? participantProjection(participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
function projectSqliteSessionParticipants(database, sessionKey, entry) {
	const actor = readSessionActorParticipants({ db: database }, sessionKey);
	if (actor !== void 0) return withProjectedParticipants(entry, actor);
	const prepared = readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey);
	if (prepared) return prepared.participants ? {
		...entry,
		...prepared
	} : entry;
	return withProjectedParticipants(entry, participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
/** Acquire one fresh cohort lazily, then decode only the requested session's participants. */
function prepareSqliteSessionParticipantProjection(database, sessionKeys) {
	let recordsByKey;
	let acquisitionFailed = false;
	return (sessionKey, entry) => {
		const actor = readSessionActorParticipants({ db: database }, sessionKey);
		if (actor !== void 0) return withProjectedParticipants(entry, actor);
		const prepared = readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey);
		if (prepared) return prepared.participants ? {
			...entry,
			...prepared
		} : entry;
		if (!recordsByKey && !acquisitionFailed) try {
			recordsByKey = participantRecordsBySessionKey(database, sessionKeys);
		} catch {
			acquisitionFailed = true;
		}
		if (acquisitionFailed) return projectSqliteSessionParticipants(database, sessionKey, entry);
		return withProjectedParticipants(entry, recordsByKey?.get(sessionKey) ?? []);
	};
}
function projectSqliteSessionParticipantsBatch(database, entries) {
	const projected = new Map(entries);
	const missing = [];
	for (const [sessionKey, entry] of entries) {
		const actor = readSessionActorParticipants({ db: database }, sessionKey);
		if (actor !== void 0) {
			projected.set(sessionKey, withProjectedParticipants(entry, actor));
			continue;
		}
		const projection = readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey);
		if (!projection) {
			missing.push(sessionKey);
			continue;
		}
		projected.set(sessionKey, projection.participants ? {
			...entry,
			...projection
		} : entry);
	}
	if (missing.length === 0) return projected;
	const records = participantRecordsBySessionKey(database, missing);
	for (const [sessionKey, participants] of records) {
		const entry = entries.get(sessionKey);
		if (entry) projected.set(sessionKey, withProjectedParticipants(entry, participants));
	}
	return projected;
}
//#endregion
export { readParticipantRecord as a, withSessionParticipantWriteSnapshot as c, prepareSessionActorParticipantUpdate as d, readSessionActorParticipants as f, projectSqliteSessionParticipantsBatch as i, withPreparedSessionParticipants as l, registerSessionActorParticipantOwner as m, prepareSqliteSessionParticipantProjection as n, readSqliteSessionParticipantProjection as o, registerSessionActorEntryPatchOwner as p, projectSqliteSessionParticipants as r, withProjectedParticipants as s, participantRecordsBySessionKey as t, prepareSessionActorEntryPatch as u };

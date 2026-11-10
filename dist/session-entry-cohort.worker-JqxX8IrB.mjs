import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity, t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as hasAgentAuthProfileSourceInDatabase } from "./sqlite-json-Dyr7VLoH.mjs";
import { t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { a as sessionColdArchiveMetadataColumns } from "./session-cold-storage-state-CWFSrppd.mjs";
import { t as SessionEntryChangedDuringReadError } from "./session-entry-read-errors-Cn4uY9H4.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { g as readSessionKeyBySessionIdInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { t as readExactSessionEntryFactsInDatabase } from "./session-accessor.sqlite-entry-facts.worker-D7R198Xs.mjs";
import { r as readSessionTranscriptAnchorFactsInDatabase } from "./session-transcript-anchor-read.kernel-DgzcqfdR.mjs";
//#region src/config/sessions/session-entry-cohort.worker.ts
/** The entry cohort bounds this selection and owns its fresh snapshot. */
function readSessionColdTranscripts(db, sessionIds) {
	if (sessionIds.length === 0) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("session_transcript_cold_archives").select(sessionColdArchiveMetadataColumns).where("session_id", "in", sqliteStringSet(sessionIds))).rows;
}
/** Captured cohorts retain their native handle and snapshot; standalone reads keep admission. */
function createSessionEntryReadScope(capturedDatabase) {
	return {
		assertCanonicalRead: (database, expectedIdentity) => {
			if (expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, expectedIdentity);
			if (!capturedDatabase) assertCanonicalSqliteSessionKeysCurrent(database);
		},
		readDatabase: (read, options) => capturedDatabase ? {
			found: true,
			value: read(capturedDatabase)
		} : withOpenClawAgentDatabaseReadOnly(read, options),
		snapshot: (database, read) => capturedDatabase?.db === database.db && database.db.isTransaction ? read() : runSqliteDeferredTransactionSync(database.db, read)
	};
}
/** One bounded snapshot on the supplied owner; no locator resolution or connection admission. */
function readSessionEntryCohort(database, input, readEntries) {
	const { expected, transcript, runtimeTarget, includeAuthProfileSource, includeColdMetadata, ...selection } = input;
	if (input.sessionKeys.length + (input.replyInitializationSessionKey ? 1 : 0) + (transcript?.entryIds.length ?? 0) + (runtimeTarget ? 1 : 0) > 64 || (expected?.sessions.length ?? 0) > 64) throw new Error(`Session entry cohorts support at most 64 selected facts`);
	if (runtimeTarget && !input.sessionKeys.includes(runtimeTarget.sessionKey)) throw new Error("Session runtime target must belong to its entry cohort");
	const source = readOpenClawAgentDatabaseIdentity(database);
	if (typeof source.identity !== "string") throw new Error("Session entry cohort requires its admitted durable owner");
	const identity = source.identity;
	const requiresSnapshot = Boolean(transcript || includeAuthProfileSource || includeColdMetadata || input.replyInitializationSessionKey);
	if (expected && source.incarnation !== expected.incarnation) throw new SessionEntryChangedDuringReadError();
	const read = () => {
		const sharedHeader = transcript?.includeHeader && transcript.sessionKey === input.lifecycleSessionKey;
		const result = requiresSnapshot || input.lifecycleSessionKey ? readEntries({
			...selection,
			kind: "session-exact-entries",
			database: {
				agentId: database.agentId,
				path: database.path
			},
			env: {},
			projection: "full",
			includeAuthorization: true,
			...sharedHeader ? { lifecycleSessionKey: void 0 } : {}
		}) : {
			kind: "session-exact-entries",
			...readExactSessionEntryFactsInDatabase(database, input.sessionKeys, input.snapshotFields ?? "full"),
			lifecycleTimestamps: {}
		};
		for (const selected of expected?.sessions ?? []) {
			const entry = result.entries.find(({ sessionKey }) => sessionKey === selected.sessionKey)?.entry;
			if (!entry || entry.sessionId !== selected.sessionId || entry.lifecycleRevision !== selected.lifecycleRevision) throw new SessionEntryChangedDuringReadError();
		}
		const entry = transcript && result.entries.find(({ sessionKey }) => sessionKey === transcript.sessionKey)?.entry;
		const transcriptFacts = transcript && entry ? readSessionTranscriptAnchorFactsInDatabase(database, {
			agentId: transcript.agentId ?? database.agentId,
			path: database.path,
			sessionKey: transcript.sessionKey,
			sessionId: entry.sessionId
		}, {
			...transcript,
			entryIds: [...new Set(transcript.entryIds)]
		}, void 0, void 0, entry) : { anchors: [] };
		const authProfileSource = includeAuthProfileSource ? hasAgentAuthProfileSourceInDatabase(database.db) : void 0;
		const preparedRuntimeTarget = runtimeTarget && {
			...runtimeTarget,
			sessionKey: result.entries.find(({ entry: selectedEntry }) => selectedEntry.sessionId === runtimeTarget.sessionId)?.sessionKey ?? readSessionKeyBySessionIdInDatabase(database, runtimeTarget.sessionId) ?? runtimeTarget.sessionKey,
			storePath: database.path
		};
		return {
			...result,
			...preparedRuntimeTarget ? { runtimeTarget: preparedRuntimeTarget } : {},
			...includeColdMetadata ? { coldArchives: readSessionColdTranscripts(database.db, result.entries.map(({ entry: selectedEntry }) => selectedEntry.sessionId)) } : {},
			source: {
				agentId: database.agentId,
				path: database.path,
				databaseIdentity: identity,
				databaseBirthtime: source.birthtime
			},
			databaseIdentity: {
				...source,
				identity
			},
			...sharedHeader ? { lifecycleTimestamps: resolveSessionLifecycleTimestampsWithHeader({
				entry,
				agentId: database.agentId,
				sessionKey: input.lifecycleSessionKey,
				readHeader: () => transcriptFacts.header
			}) } : {},
			...transcript ? { transcript: transcriptFacts } : {},
			...includeAuthProfileSource ? { authProfileSource } : {}
		};
	};
	return database.db.isTransaction || !requiresSnapshot ? runSqliteReadOperationSync(database.db, read) : runSqliteDeferredTransactionSync(database.db, read);
}
/** Standalone data reads retain their original canonical kernel without a cohort transaction. */
function readSessionEntryDataInDatabase(database, sessionKey) {
	const source = readOpenClawAgentDatabaseIdentity(database);
	const identity = source.identity;
	if (typeof identity !== "string") throw new Error("Session entry read requires its admitted durable owner");
	const facts = readExactSessionEntryFactsInDatabase(database, [sessionKey]);
	return {
		kind: "session-exact-entries",
		source: {
			agentId: database.agentId,
			path: database.path,
			databaseIdentity: identity,
			databaseBirthtime: source.birthtime
		},
		databaseIdentity: {
			...source,
			identity
		},
		...facts,
		lifecycleTimestamps: {}
	};
}
//#endregion
export { readSessionEntryCohort as n, readSessionEntryDataInDatabase as r, createSessionEntryReadScope as t };

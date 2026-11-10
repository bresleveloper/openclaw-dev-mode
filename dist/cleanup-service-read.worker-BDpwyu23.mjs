import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as shouldPreserveSessionCleanupEntry } from "./cleanup-service-read.policy-Bh5cybQV.mjs";
import { f as readWithCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { n as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { i as findTranscriptEventInDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
//#region src/config/sessions/cleanup-service-read.kernel.ts
function isTranscriptMessageRole(role) {
	return role === "user" || role === "assistant" || role === "tool" || role === "toolResult" || role === "system";
}
function isTranscriptMessageRecord(entry) {
	if (!isRecord(entry)) return false;
	const record = entry;
	if (record.type === "message") return true;
	if (record.type === void 0 && isRecord(record.message) && isTranscriptMessageRole(record.message.role)) return true;
	return record.type === void 0 && isTranscriptMessageRole(record.role);
}
/** Entries and positive deletion classifications share one admitted read snapshot. */
function readSessionCleanupSnapshotInDatabase(database, request) {
	const read = () => {
		const entries = listSqliteSessionEntriesFromDatabase(database, {
			agentId: database.agentId,
			path: database.path,
			env: request.env,
			sessionKey: ""
		}, {});
		const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
		const missing = [];
		if (request.fixMissing) for (const { sessionKey, entry } of entries) {
			if (shouldPreserveSessionCleanupEntry(sessionKey, entry)) continue;
			if (!entry.sessionId) {
				if (!parseAgentSessionKey(sessionKey)) missing.push({
					sessionKey,
					expectedEntry: entry,
					archiveRemovedTranscript: true
				});
				continue;
			}
			try {
				if (findTranscriptEventInDatabase(database, entry.sessionId, isTranscriptMessageRecord, void 0, { malformed: "throw" })) continue;
				missing.push({
					sessionKey,
					expectedEntry: entry,
					archiveRemovedTranscript: true,
					expectedTranscriptSnapshot: readSessionStateDeleteSnapshot(database.db, entry.sessionId)
				});
			} catch {
				continue;
			}
		}
		return {
			kind: "session-cleanup",
			store,
			missing
		};
	};
	return readWithCanonicalSessionReaderContinuation(database, request.continuation, () => request.fixMissing && !database.db.isTransaction ? runSqliteDeferredTransactionSync(database.db, read) : read());
}
//#endregion
//#region src/config/sessions/cleanup-service-read.worker.ts
function readSessionCleanupSnapshot(request) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const source = captureSessionEntryReadSource(database, request.expectedIdentity);
		return {
			...readSessionCleanupSnapshotInDatabase(database, request),
			source
		};
	}, {
		...request.database,
		env: request.env
	});
	if (!result.found && request.expectedIdentity?.key.startsWith("file:")) throw new Error("Session cleanup lost its captured physical owner");
	return result.found ? result.value : {
		kind: "session-cleanup",
		store: {},
		missing: []
	};
}
//#endregion
export { readSessionCleanupSnapshot };

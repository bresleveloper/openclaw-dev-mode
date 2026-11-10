import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { f as readWithCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { r as listTranscriptInstancesFromDatabase } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
//#region src/config/sessions/session-history.ts
/** Read transcript identities in the existing history worker. */
async function listSessionTranscriptInstancesInWorker(scope = {}, options = {}) {
	const storePath = resolveSessionStorePathForScope(scope);
	if (isIncognitoOpenClawAgentSqlitePath(storePath, {
		...scope,
		agentId: scope.agentId ?? "main"
	})) return listSessionTranscriptInstances({
		...scope,
		storePath
	}, options);
	const { withSessionStoreReaderInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
	return withSessionStoreReaderInWorker({
		...scope,
		storePath
	}, async ({ reader, database, logicalAgentId, continuation }) => reader.readTranscriptInstances({
		scope: {
			...scope,
			storePath: database.path,
			agentId: logicalAgentId
		},
		options,
		continuation
	}), {
		backing: true,
		dataOnly: true
	});
}
/** Lists transcript-bearing SQLite sessions, including retained rows from session-id rotation. */
function listSessionTranscriptInstances(scope = {}, options = {}, continuation) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, continuation, () => {
		const currentEntries = options.sessionId !== void 0 || options.sessionIds !== void 0 ? void 0 : new Map(listSqliteSessionEntriesFromDatabase(database, resolved, {
			...scope,
			clone: false
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		return listTranscriptInstancesFromDatabase({
			currentEntries,
			database,
			options,
			entryProjection: scope.projection
		});
	}), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
//#endregion
export { listSessionTranscriptInstancesInWorker as n, listSessionTranscriptInstances as t };

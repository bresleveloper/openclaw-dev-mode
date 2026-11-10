import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { o as runSqliteReadSnapshotSync, r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as matchesPluginHostCleanupSession } from "./plugin-host-cleanup-DPJxrJDM.mjs";
import { l as readSessionEntryCacheValidityToken, s as cacheValidityTokensEqual } from "./session-participant-identity-Btc25HNW.mjs";
import { f as readWithCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as listSqliteSessionEntriesFromDatabase, r as readSelectedSessionEntriesInDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
//#region src/config/sessions/session-entry-list.worker.ts
/** Cleanup selects identity columns before materializing metadata in the same worker snapshot. */
function readSessionEntryList(request) {
	const scope = {
		...request.scope,
		env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
	};
	let source;
	let revision;
	let unchanged;
	let nextCronRunUpdatedAt = null;
	let nextCronRunSessionKey = null;
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => {
		source = captureSessionEntryReadSource(database, request.expectedIdentity);
		if (scope.cleanupSession === void 0) {
			const read = () => listSqliteSessionEntriesFromDatabase(database, resolveSqliteScope({
				...scope,
				sessionKey: ""
			}), scope, {
				captureCronRunUpdatedAt: (value) => nextCronRunUpdatedAt = value,
				captureCronRunSessionKey: (value) => nextCronRunSessionKey = value
			});
			if (scope.projection !== "list" || scope.includeParticipants !== false || scope.sessionKeys !== void 0 || scope.cronRetention || scope.expiredCronRuns || scope.readConsistency === "latest" || database.db.isTransaction) return read();
			const current = readSessionEntryCacheValidityToken(database.db);
			const token = current.siblingWriteRevision === void 0 ? void 0 : JSON.stringify([
				readOpenClawAgentDatabaseIdentity(database).incarnation,
				current.siblingWriteRevision,
				current.sessionNodesGeneration,
				current.schemaVersion
			]);
			if (token !== void 0 && request.ifRevision === token) {
				revision = token;
				unchanged = true;
				return [];
			}
			const entries = runSqliteReadSnapshotSync(database.db, read);
			if (cacheValidityTokensEqual(current, readSessionEntryCacheValidityToken(database.db))) revision = token;
			return entries;
		}
		return withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteDeferredTransactionSync(database.db, () => {
			const keys = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select(["session_key as sessionKey", "current_session_id as sessionId"]).orderBy("session_key")).rows.filter((row) => matchesPluginHostCleanupSession(row.sessionKey, row, scope.cleanupSession)).map((row) => row.sessionKey);
			const entries = new Map(readSelectedSessionEntriesInDatabase(database, keys).map((entry) => [entry.sessionKey, entry]));
			return keys.flatMap((key) => {
				const entry = entries.get(key);
				return entry ? [entry] : [];
			});
		}));
	}), {
		...request.database,
		env: scope.env
	});
	if (!result.found && request.expectedIdentity?.key.startsWith("file:")) throw new Error("Session listing lost its captured physical owner");
	return {
		entries: result.found ? result.value : [],
		source,
		revision,
		unchanged,
		...scope.expiredCronRuns ? { nextCronRunUpdatedAt } : {},
		...scope.cronRetention ? { nextCronRunSessionKey } : {}
	};
}
//#endregion
export { readSessionEntryList };

import { E as readSqliteDatabaseScopedWriteToken } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as hasUncommittedSqliteWrites } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-transcript-projection-facts-scope.ts
const projectionReceipts = new AsyncLocalStorage();
/** A worker task opens its own snapshots; no fact survives into another task. */
function withSessionTranscriptProjectionReceipt(receipt, read) {
	return projectionReceipts.run(receipt, read);
}
function readCurrentReceipt(database, sessionId, version) {
	const receipt = projectionReceipts.getStore();
	if (!receipt || receipt.path !== database.path || receipt.sessionId !== sessionId || hasUncommittedSqliteWrites(database.db) || (receipt.contextOnly ? !version || !receipt.contextStatsVersion || version.generation !== receipt.contextStatsVersion.generation || version.rawSeq !== receipt.contextStatsVersion.rawSeq || version.updatedAt !== receipt.contextStatsVersion.updatedAt : readSqliteDatabaseScopedWriteToken(database.db, receipt.writeScopes) !== receipt.writeToken)) return;
	return receipt;
}
function readSessionTranscriptProjectionReceipt(database, sessionId, version) {
	const receipt = readCurrentReceipt(database, sessionId, version);
	return receipt && structuredClone({
		facts: receipt.facts,
		contextStats: receipt.contextStats,
		contextOnly: receipt.contextOnly
	});
}
/** Accounting needs row validity, already established by the complete actor postimage. */
function hasSessionTranscriptEntryReceipt(database, sessionId, sessionKey) {
	return readCurrentReceipt(database, sessionId)?.entrySessionKey === sessionKey;
}
//#endregion
export { readSessionTranscriptProjectionReceipt as n, withSessionTranscriptProjectionReceipt as r, hasSessionTranscriptEntryReceipt as t };

import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
//#region src/infra/sql-connection.ts
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertPostgresTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
const postgresConnectionBrand = Symbol.for("openclaw.postgres-sync-connection");
function isPostgresSqlConnection(db) {
	return postgresConnectionBrand in db && db[postgresConnectionBrand] === true;
}
/** Publications and receipts must key on the store anchor for every engine. */
function sqlPublicationAnchor(db) {
	return isPostgresSqlConnection(db) ? db.anchor : db;
}
//#endregion
export { sqlPublicationAnchor as i, assertSyncTransactionResult as n, isPostgresSqlConnection as r, assertPostgresTransactionUsable as t };

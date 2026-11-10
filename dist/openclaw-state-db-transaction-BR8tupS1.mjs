import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as runSqliteImmediateTransactionSync, c as runSqliteSingleStatementSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
//#region src/state/openclaw-state-db-transaction.ts
const managedStateTransactions = resolveGlobalSingleton(Symbol.for("openclaw.managedStateTransactions"), () => /* @__PURE__ */ new WeakSet());
/** Only the synchronous transaction owner may lend its uncommitted authority rows. */
function isManagedStateTransaction(database) {
	return database.isTransaction && managedStateTransactions.has(database);
}
function runManagedStateTransaction(database, operation, options) {
	if (database.isTransaction && !managedStateTransactions.has(database)) throw new Error("Cannot join an unmanaged shared-state transaction; enter through runOpenClawStateWriteTransaction before BEGIN.");
	const transaction = () => withSqlitePostCommitPublications(database, () => {
		const outer = !database.isTransaction;
		if (outer) managedStateTransactions.add(database);
		try {
			return options.singleStatement ? runSqliteSingleStatementSync(database, operation) : runSqliteImmediateTransactionSync(database, operation, options);
		} finally {
			if (outer) managedStateTransactions.delete(database);
		}
	});
	return options.busyTimeoutMs === void 0 || isPostgresSqlConnection(database) ? transaction() : runWithSqliteBusyTimeout(database, options.busyTimeoutMs, transaction);
}
//#endregion
export { runManagedStateTransaction as n, isManagedStateTransaction as t };

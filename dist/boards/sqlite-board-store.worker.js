import { o as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DKSXLQhb.mjs";
import { t as sessionChanges } from "../session-row-changes-xuu0eHng.mjs";
import { a as putBoardWidgetInDatabase, d as normalizeBoardWidgetPutParams, n as ensureBoardSchema, r as grantBoardWidgetInDatabase, t as applyBoardOpsToDatabase } from "../sqlite-board-store.kernel--WWNhhyI.mjs";
//#region src/boards/sqlite-board-store.worker.ts
function bindSqliteWorkerBackend(_input, context) {
	const database = {
		db: context.database,
		path: context.databasePath
	};
	ensureBoardSchema(database);
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Board publication scope is closed");
			const changes = [];
			const unsubscribe = sessionChanges.subscribeFacts((change) => {
				if ("sessionKey" in change && change.sessionKey === command.input.sessionKey && change.storePath === database.path) changes.push(change);
			});
			try {
				return {
					value: runSqliteImmediateTransactionSync(database.db, () => {
						context.admit("transaction");
						if (command.type === "boards.applyOps") return applyBoardOpsToDatabase(database, command.input.sessionKey, command.input.ops);
						if (command.type === "boards.putWidget") return putBoardWidgetInDatabase(database, command.input.sessionKey, normalizeBoardWidgetPutParams(command.input.params, command.input.sessionKey), command.input.viewGeneration);
						return grantBoardWidgetInDatabase(database, command.input.sessionKey, command.input.name, command.input.decision, command.input.revision, command.input.instanceId);
					}, {
						databaseLabel: database.path,
						operationLabel: command.type,
						withCommit(commit) {
							context.admit("commit");
							commit();
						}
					}),
					changes
				};
			} finally {
				unsubscribe();
			}
		},
		assertSettled() {
			assertTransactionUsable(database.db);
			if (database.db.isTransaction) throw new Error("Board publication left an unsettled transaction");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };

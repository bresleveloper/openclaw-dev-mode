import { o as runSqliteWorkerTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { n as sessionChanges } from "../session-row-changes-BcJIdta8.mjs";
import { a as putBoardWidgetInDatabase, c as readBoardWidgetDocument, n as ensureBoardSchema, r as grantBoardWidgetInDatabase, s as readBoardSnapshotWithHtmlViewMetadata, t as applyBoardOpsToDatabase, u as normalizeBoardWidgetPutParams } from "../sqlite-board-store.kernel-4NufZP3t.mjs";
//#region src/boards/sqlite-board-store.worker.ts
function bindSqliteWorkerBackend(input, context) {
	const database = {
		db: context.database,
		path: context.databasePath
	};
	if (input !== "read") ensureBoardSchema(database);
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Board publication scope is closed");
			if (command.type === "boards.readSnapshot" || command.type === "boards.readWidgetDocument") return runSqliteDeferredTransactionSync(database.db, () => {
				context.admit("transaction");
				return command.type === "boards.readSnapshot" ? readBoardSnapshotWithHtmlViewMetadata(database, command.input.sessionKey) : readBoardWidgetDocument(database, command.input.sessionKey, command.input.name, command.input.contentKind);
			}, {
				databaseLabel: database.path,
				operationLabel: command.type,
				withCommit(commit) {
					context.admit("commit");
					return commit();
				}
			});
			const changes = [];
			const unsubscribe = sessionChanges.subscribeFacts((change) => {
				if ("sessionKey" in change && change.sessionKey === command.input.sessionKey && change.storePath === database.path) changes.push(change);
			});
			try {
				return {
					value: runSqliteWorkerTransactionSync(context, () => {
						if (command.type === "boards.applyOps") return applyBoardOpsToDatabase(database, command.input.sessionKey, command.input.ops);
						if (command.type === "boards.putWidget") return putBoardWidgetInDatabase(database, command.input.sessionKey, normalizeBoardWidgetPutParams(command.input.params, command.input.sessionKey), command.input.viewGeneration);
						return grantBoardWidgetInDatabase(database, command.input.sessionKey, command.input.name, command.input.decision, command.input.revision, command.input.instanceId);
					}, {
						databaseLabel: database.path,
						operationLabel: command.type
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

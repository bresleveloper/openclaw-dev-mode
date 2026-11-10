import { c as withSqlitePostCommitPublications } from "../sqlite-post-commit-22SfWsLt.mjs";
import { l as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { i as getSqliteWorkerStateContext } from "../sqlite-worker-state-context-QuvwmAax.mjs";
import { t as captureSessionRowChanges } from "../session-row-changes-vFaNnKNM.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "../openclaw-agent-db-_fC-kf1x.mjs";
import { r as BoardValidationError } from "../board-layout-6DyK3jbx.mjs";
import { o as normalizeBoardWidgetPutParams } from "../board-store-BfhfCr3L.mjs";
import { i as putBoardWidgetInDatabase, n as ensureBoardSchema, r as grantBoardWidgetInDatabase, t as applyBoardOpsToDatabase } from "../sqlite-board-store.kernel-DJEHAMN4.mjs";
//#region src/boards/sqlite-board-store.worker.ts
function bindSqliteWorkerBackend(input, context) {
	const database = {
		db: context.database,
		path: context.databasePath
	};
	const canonical = input && getOpenClawAgentDatabaseIfOpen({
		agentId: input.agentId,
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (input && (!canonical || canonical.db !== context.database)) throw new Error("Board publication lost its canonical database owner");
	ensureBoardSchema(database);
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Board publication scope is closed");
			if (input && command.input.sessionKey !== input.sessionKey) throw new BoardValidationError("invalid_operation", "board session changed; retry");
			const { result: value, changes } = captureSessionRowChanges(database.db, () => withSqlitePostCommitPublications(database.db, () => runSqliteWorkerTransactionSync(context, () => {
				if (command.type === "boards.applyOps") return applyBoardOpsToDatabase(database, command.input.sessionKey, command.input.ops, input?.expectedSession);
				if (command.type === "boards.putWidget") return putBoardWidgetInDatabase(database, command.input.sessionKey, normalizeBoardWidgetPutParams(command.input.params, command.input.sessionKey), command.input.viewGeneration, input?.expectedSession);
				return grantBoardWidgetInDatabase(database, command.input.sessionKey, command.input.name, command.input.decision, command.input.revision, command.input.instanceId, input?.expectedSession);
			}, {
				databaseLabel: database.path,
				operationLabel: command.type
			})));
			return {
				value,
				changes: changes.filter((change) => "sessionKey" in change && change.sessionKey === command.input.sessionKey && change.storePath === database.path)
			};
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

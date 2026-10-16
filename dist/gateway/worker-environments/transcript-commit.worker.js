import { r as runSqliteDeferredTransactionSync } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-BeVaUlhr.mjs";
import { u as runOpenClawAgentWriteTransaction } from "../../openclaw-agent-db-DBug3LUA.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "../../session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as prepareTranscriptCommit, t as applyPreparedTranscriptCommit } from "../../transcript-commit.kernel-CqIUShGF.mjs";
//#region src/gateway/worker-environments/transcript-commit.worker.ts
/** The canonical agent actor owns the connection and writer admission. */
function bindSqliteWorkerBackend(_input, context) {
	let prepared;
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Worker transcript domain is closed");
			if (command.type === "transcript.prepare") {
				if (prepared) throw new Error("Worker transcript batch is already prepared");
				const input = {
					...command.input,
					scope: {
						...command.input.scope,
						storePath: context.databasePath,
						env: getSqliteWorkerStateContext().environment
					}
				};
				if (command.input.scope.storePath !== context.databasePath) throw new Error("Worker transcript target changed its database owner");
				const plan = runSqliteDeferredTransactionSync(context.database, () => prepareTranscriptCommit(input));
				prepared = {
					input,
					plan
				};
				return plan.result;
			}
			if (!prepared) throw new Error("Worker transcript batch was not prepared");
			const { input, plan } = prepared;
			prepared = void 0;
			return runOpenClawAgentWriteTransaction((database) => {
				if (database.db !== context.database) throw new Error("Worker transcript lost its canonical connection");
				context.admit("transaction");
				let projectionNeedsReconcile = false;
				const result = applyPreparedTranscriptCommit(input, plan, command.input.messages, () => {
					projectionNeedsReconcile = true;
				});
				context.admit("commit");
				return {
					result,
					projectionNeedsReconcile
				};
			}, toDatabaseOptions(resolveSqliteTranscriptScope(input.scope)), { operationLabel: "worker.transcript.commit" });
		},
		assertSettled() {
			if (context.database.isTransaction) throw new Error("Worker transcript command left a transaction open");
		},
		close() {
			closed = true;
			prepared = void 0;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };

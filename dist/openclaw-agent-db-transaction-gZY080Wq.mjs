import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as readSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { f as assertAgentDeletionDatabaseCleanupAccess, h as getAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { i as runSqliteImmediateTransaction } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { _ as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
//#region src/state/openclaw-agent-db-transaction.ts
/** Yield only for BEGIN admission; admitted writes and publications are never replayed. */
async function runOpenClawAgentWriteWithYieldingAdmission(operation, options, transactionOptions = {}) {
	const captured = {
		...options,
		env: cloneEnvWithPlatformSemantics(options.env ?? process.env)
	};
	const database = openOpenClawAgentDatabase(captured);
	captured.path = database.path;
	const release = retainAgentDatabase(database.db);
	try {
		return await runSqliteImmediateTransaction(database.db, async () => () => {
			assertAgentDeletionDatabaseCleanupAccess(database, captured);
			return operation(database);
		}, {
			...transactionOptions,
			busyTimeoutMs: readSqliteBusyTimeout(database.db),
			databaseLabel: database.path,
			operationLabel: transactionOptions.operationLabel ?? "agent.write",
			withCommit: getAgentDeletionDatabaseCleanup(captured)?.withCommit
		}, (write) => {
			if (getOpenClawAgentDatabaseIfOpen(captured) !== database) throw new Error(`Agent database closed or replaced before write: ${database.path}`);
			return withSqlitePostCommitPublications(database.db, write);
		});
	} finally {
		release();
	}
}
//#endregion
export { runOpenClawAgentWriteWithYieldingAdmission as t };

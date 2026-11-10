import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as waitForAgentDatabasePreparation } from "./agent-database-preparation-context-DK375nya.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as runSqliteImmediateTransactionSync, i as runSqliteImmediateTransaction } from "./sqlite-transaction-CpDyZPQ0.mjs";
import "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import "./sqlite-worker-contract-DhDutMia.mjs";
import "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./store-writer-queue-AKR6NnXM.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./sqlite-worker-store-Bzw_c0pA.mjs";
import "./openclaw-agent-db-validation-facts-BQcDbrLo.mjs";
import { _ as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { d as withOpenClawAgentDatabaseRuntime, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase, t as borrowOpenClawAgentDatabase, u as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./openclaw-agent-execution-BMcCyPIg.mjs";
import "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
//#region src/state/openclaw-agent-db-write.ts
/** Admit a synchronous mutation without blocking a reclamation worker's parent callback. */
async function withOpenClawAgentDatabaseWrite(inputOptions, operation, expectedDatabase, signal) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	options.path = pathname;
	const preparation = waitForAgentDatabasePreparation(options.agentId, {
		env: options.env,
		signal
	});
	if (preparation) await preparation;
	const run = async (database) => {
		const { identity, birthtime } = readOpenClawAgentDatabaseIdentity(database);
		assertExistingDatabaseIdentity(pathname, `file:${identity}`, birthtime);
		const result = operation(database);
		if (isPromiseLike(result)) {
			await result;
			throw new Error("Agent database write callbacks must remain synchronous");
		}
		return result;
	};
	return runOpenClawAgentWriteAdmission(options, async (_identity, assertCurrent) => {
		if (!expectedDatabase) return await withOpenClawAgentDatabaseRuntime(options, run, assertCurrent);
		const database = getOpenClawAgentDatabaseIfOpen(options);
		if (!database || database.db !== expectedDatabase || !expectedDatabase.isOpen) throw new Error("Borrowed agent database closed or changed before write admission");
		const release = retainAgentDatabase(expectedDatabase);
		try {
			return await run(database);
		} finally {
			release();
		}
	}, true, void 0, signal);
}
//#endregion
//#region src/plugin-sdk/sqlite-runtime-legacy.ts
const legacy = {
	family: "sqlite-runtime-native-access",
	replacement: "openOpenClawAgentSqliteWorkerStoreV2 or the owning domain's awaited operations",
	compatibility: "Native SQL and callbacks retain their current completion and transaction ordering."
};
/** @deprecated Writable runtime handles use openOpenClawAgentSqliteWorkerStoreV2; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. Explicit readOnly inspection remains supported. */
function sdkOpenNodeSqliteDatabase(...args) {
	if (!args[1]?.readOnly) warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.openNodeSqliteDatabase"
	});
	return openNodeSqliteDatabase(...args);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkOpenOpenClawAgentDatabase(...args) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.openOpenClawAgentDatabase"
	});
	return openOpenClawAgentDatabase(...args);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkBorrowOpenClawAgentDatabase(options) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.borrowOpenClawAgentDatabase"
	});
	return borrowOpenClawAgentDatabase(options);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; callbacks stay on the host and are removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkWithOpenClawAgentDatabaseAsync(options, operation, assertCurrent, signal) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.withOpenClawAgentDatabaseAsync"
	});
	return withOpenClawAgentDatabaseAsync(options, operation, assertCurrent, signal);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; callbacks stay on the host and are removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkWithOpenClawAgentDatabaseWrite(options, operation, expectedDatabase, signal) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.withOpenClawAgentDatabaseWrite"
	});
	return withOpenClawAgentDatabaseWrite(options, operation, expectedDatabase, signal);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; native admission callbacks are removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkRunOpenClawAgentWriteAdmission(options, run, reentrant, timing, signal) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.runOpenClawAgentWriteAdmission"
	});
	return runOpenClawAgentWriteAdmission(options, run, reentrant, timing, signal);
}
/** @deprecated Use sqlite-worker-runtime.getNodeSqliteKysely inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkGetNodeSqliteKysely(database) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.getNodeSqliteKysely"
	});
	return getNodeSqliteKysely(database);
}
/** @deprecated Use sqlite-worker-runtime.executeSqliteQuerySync inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkExecuteSqliteQuerySync(database, query) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.executeSqliteQuerySync"
	});
	return executeSqliteQuerySync(database, query);
}
/** @deprecated Use sqlite-worker-runtime.executeSqliteQueryTakeFirstSync inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkExecuteSqliteQueryTakeFirstSync(database, query) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.executeSqliteQueryTakeFirstSync"
	});
	return executeSqliteQueryTakeFirstSync(database, query);
}
/** @deprecated Use sqlite-worker-runtime.iterateSqliteQuerySync inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkIterateSqliteQuerySync(database, query) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.iterateSqliteQuerySync"
	});
	return iterateSqliteQuerySync(database, query);
}
/** @deprecated Use sqlite-worker-runtime.prepareSqliteQuerySync inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkPrepareSqliteQuerySync(database, build) {
	const execute = prepareSqliteQuerySync(database, build);
	return (params) => {
		warnPluginSdkDeprecation({
			...legacy,
			method: "sqlite-runtime.prepareSqliteQuerySync"
		});
		return execute(params);
	};
}
/** @deprecated Use sqlite-worker-runtime.runSqliteImmediateTransactionSync inside a worker backend; removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkRunSqliteImmediateTransactionSync(database, operation, options) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.runSqliteImmediateTransactionSync"
	});
	return runSqliteImmediateTransactionSync(database, operation, options);
}
/** @deprecated Use openOpenClawAgentSqliteWorkerStoreV2; native transaction callbacks are removed in the first January 2027 stable release, after the final compatibility day 2026-12-31. */
function sdkRunSqliteImmediateTransaction(database, prepare, options, admit) {
	warnPluginSdkDeprecation({
		...legacy,
		method: "sqlite-runtime.runSqliteImmediateTransaction"
	});
	return runSqliteImmediateTransaction(database, prepare, options, admit);
}
//#endregion
export { sdkIterateSqliteQuerySync as a, sdkPrepareSqliteQuerySync as c, sdkRunSqliteImmediateTransactionSync as d, sdkWithOpenClawAgentDatabaseAsync as f, sdkGetNodeSqliteKysely as i, sdkRunOpenClawAgentWriteAdmission as l, sdkExecuteSqliteQuerySync as n, sdkOpenNodeSqliteDatabase as o, sdkWithOpenClawAgentDatabaseWrite as p, sdkExecuteSqliteQueryTakeFirstSync as r, sdkOpenOpenClawAgentDatabase as s, sdkBorrowOpenClawAgentDatabase as t, sdkRunSqliteImmediateTransaction as u };

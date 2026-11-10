import { b as DEFAULT_WORKER_PENDING_BYTES, j as resolveStateReadWorkerCount, t as createOwnedWorkerTaskPool } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { H as ensureSqliteLibrarySelected, U as getSqliteRuntimeCapabilities } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { kn as createRetainedOperation } from "./sqlite-readonly-location.worker.js";
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/state/openclaw-state-read-pool.ts
function stateReadPools(state) {
	return [state.pool, state.awaitedPool].filter((pool) => pool !== void 0);
}
function createStateReadPool(workerUrl, nativeSource) {
	ensureSqliteLibrarySelected();
	return createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: resolveStateReadWorkerCount(),
		idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
		burstIdleTimeoutMs: 3e4,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, nativeSource ? {
		retainedTransport: true,
		nativeSource,
		databaseAccess: "read-only"
	} : { databaseAccess: "read-only" });
}
function closeReadResources(pool, key) {
	return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources ? pool.closeResources(key) : pool.rotate();
}
/** The same task/close contract; promise-only callers do not synchronously service it. */
function startReadTask(selection, input, options) {
	if (selection.retained) return selection.pool.startTask(input, options);
	const task = selection.pool.runTask(input, options);
	const result = createRetainedOperation(() => {});
	task.result.then(result.resolve, result.reject);
	return {
		...result.operation,
		release(closeOptions) {
			const closed = createRetainedOperation(() => {});
			task.close(closeOptions).then(closed.resolve, closed.reject);
			return closed.operation;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-request.ts
function stringBytes(values) {
	return values.reduce((bytes, value) => bytes + Buffer.byteLength(value ?? "", "utf8"), 0);
}
function commandBytes(value) {
	if (typeof value === "string") return Buffer.byteLength(JSON.stringify(value), "utf8");
	if (typeof value === "number" || typeof value === "bigint") return 8;
	if (typeof value === "boolean") return 1;
	if (value === null || value === void 0) return 0;
	if (Array.isArray(value)) return value.reduce((bytes, entry) => bytes + 8 + commandBytes(entry), 0);
	return Object.entries(value).reduce((bytes, [key, entry]) => bytes + Buffer.byteLength(key, "utf8") + 8 + commandBytes(entry), 0);
}
function requestBytes(request) {
	return commandBytes(request.command) + stringBytes([
		...Object.entries(request.context.environment).flatMap(([key, value]) => [key, value]),
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	]);
}
//#endregion
export { stateReadPools as a, startReadTask as i, closeReadResources as n, SQLITE_IDLE_HANDLE_TTL_MS as o, createStateReadPool as r, requestBytes as t };

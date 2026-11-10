import { availableParallelism } from "node:os";
//#region src/infra/worker-pool-sizing.ts
function resolveWorkerComputeLimit() {
	return Math.max(1, availableParallelism() - 1);
}
/** Size once at pool creation; serial owners must never inherit host CPU fanout. */
function resolveWorkerPoolSize(kind) {
	return Math.min(kind === "reader" || kind === "file-reader" ? 2 : kind === "compute" ? 4 : 1, resolveWorkerComputeLimit());
}
function resolveStateReadWorkerCount() {
	return Math.max(2, resolveWorkerPoolSize("reader"));
}
function resolveSqliteBrokerWorkerCount() {
	return 2;
}
const SESSION_TRANSCRIPT_FOREGROUND_WORKERS = resolveWorkerPoolSize("reader");
function resolveUpdateHashWorkerCount() {
	if (process.versions.bun && process.platform === "linux") return 0;
	const available = process.availableMemory();
	if (!Number.isSafeInteger(available) || available <= 0) return 0;
	return Math.max(0, Math.min(4, availableParallelism() - 1, Math.floor(available / 2 / 268435456)));
}
//#endregion
export { resolveWorkerComputeLimit as a, resolveUpdateHashWorkerCount as i, resolveSqliteBrokerWorkerCount as n, resolveWorkerPoolSize as o, resolveStateReadWorkerCount as r, SESSION_TRANSCRIPT_FOREGROUND_WORKERS as t };

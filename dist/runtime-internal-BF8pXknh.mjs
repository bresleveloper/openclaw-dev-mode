import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { b as reloadTaskFlowRegistryFromStoreAsync, o as ensureTaskFlowRegistryReadyAsync } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { d as reloadTaskRegistryFromStoreAsync, s as ensureTaskRegistryReadyAsync } from "./task-registry-state-Cibd1d5c.mjs";
import "./task-registry-read-BpKCOEEj.mjs";
import "./task-registry-query-Bd-H3o4L.mjs";
import "./task-registry-D10gtSrV.mjs";
//#region src/tasks/runtime-internal.ts
/** Read a task view without creating state or refreshing the synchronous projections. */
async function findTaskViewByRunIdAsync(runId, assertCurrent) {
	assertCurrent();
	const lookup = runId.trim();
	if (!lookup) return;
	const context = captureOpenClawStateWorkerContext();
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	const task = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "tasks.findByRunId",
		input: { runId: lookup }
	}), {
		existingOnly: true,
		assertCurrent
	});
	context.admission.assertCurrent();
	assertCurrent();
	return task;
}
async function ensureTaskRuntimeStateReady() {
	const context = captureOpenClawStateWorkerContext();
	await ensureTaskFlowRegistryReadyAsync(context);
	context.admission.assertCurrent();
	await ensureTaskRegistryReadyAsync(context);
}
async function reloadTaskRuntimeStateFromStore() {
	const context = captureOpenClawStateWorkerContext();
	await reloadTaskFlowRegistryFromStoreAsync(context);
	context.admission.assertCurrent();
	await reloadTaskRegistryFromStoreAsync(context);
}
//#endregion
export { findTaskViewByRunIdAsync as n, reloadTaskRuntimeStateFromStore as r, ensureTaskRuntimeStateReady as t };

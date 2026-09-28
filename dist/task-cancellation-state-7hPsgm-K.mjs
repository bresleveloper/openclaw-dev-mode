import "./task-registry.store.kernel-BuNI8UuR.mjs";
//#region src/tasks/task-cancellation-state.ts
function isProvisionalSubagentKillTask(task) {
	return task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.";
}
function isTaskFlowCancellationPending(task) {
	return task.status === "queued" || task.status === "running" || isProvisionalSubagentKillTask(task);
}
//#endregion
export { isTaskFlowCancellationPending as n, isProvisionalSubagentKillTask as t };

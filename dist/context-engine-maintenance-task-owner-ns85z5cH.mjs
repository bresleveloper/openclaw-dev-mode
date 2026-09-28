import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
//#region src/tasks/context-engine-maintenance-task-owner.ts
const CONTEXT_ENGINE_TURN_MAINTENANCE_TASK_KIND = "context_engine_turn_maintenance";
const ACTIVE_CONTEXT_ENGINE_MAINTENANCE_TASK_IDS = Symbol.for("openclaw.contextEngineMaintenanceTaskIds");
function getActiveContextEngineMaintenanceTaskIds() {
	return resolveGlobalSet(ACTIVE_CONTEXT_ENGINE_MAINTENANCE_TASK_IDS, "close-only");
}
function isContextEngineTurnMaintenanceTask(task) {
	return task.runtime === "acp" && task.taskKind === "context_engine_turn_maintenance";
}
function registerContextEngineMaintenanceTaskOwner(taskId) {
	const activeTaskIds = getActiveContextEngineMaintenanceTaskIds();
	activeTaskIds.add(taskId);
	return () => activeTaskIds.delete(taskId);
}
function isContextEngineMaintenanceTaskOwnerActive(taskId) {
	return getActiveContextEngineMaintenanceTaskIds().has(taskId);
}
//#endregion
export { registerContextEngineMaintenanceTaskOwner as i, isContextEngineMaintenanceTaskOwnerActive as n, isContextEngineTurnMaintenanceTask as r, CONTEXT_ENGINE_TURN_MAINTENANCE_TASK_KIND as t };

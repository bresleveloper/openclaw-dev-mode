import { _ as listTasksForSessionKey, f as listTaskRecords, o as findTaskByRunId, p as listTasksForAgentId, s as getTaskById } from "./task-registry-Bv5-Vohd.js";
//#region src/tasks/task-status-access.ts
/** Returns only the session lookup fields needed by task status commands. */
function getTaskSessionLookupByIdForStatus(taskId) {
	const task = getTaskById(taskId);
	return task ? {
		requesterSessionKey: task.requesterSessionKey,
		ownerKey: task.ownerKey,
		...task.runId ? { runId: task.runId } : {},
		...task.agentId ? { agentId: task.agentId } : {},
		...task.requesterAgentId ? { requesterAgentId: task.requesterAgentId } : {}
	} : void 0;
}
function listTasksForSessionKeyForStatus(sessionKey) {
	return listTasksForSessionKey(sessionKey);
}
function listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey) {
	return listTaskRecords().filter((task) => task.requesterSessionKey === sessionKey || task.ownerKey === sessionKey);
}
function listTasksForAgentIdForStatus(agentId) {
	return listTasksForAgentId(agentId);
}
function findTaskByRunIdForStatus(runId) {
	return findTaskByRunId(runId);
}
//#endregion
export { listTasksForSessionKeyForStatus as a, listTasksForOwnerOrRequesterSessionKeyForStatus as i, getTaskSessionLookupByIdForStatus as n, listTasksForAgentIdForStatus as r, findTaskByRunIdForStatus as t };

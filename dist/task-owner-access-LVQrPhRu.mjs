import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { a as resolveTaskSessionAgentIdAsync, i as resolveTaskSessionAgentId } from "./task-registry-read-BpKCOEEj.mjs";
import { t as buildTaskStatusSnapshot } from "./task-status-D1-umRs5.mjs";
import { h as resolveTaskForLookupToken, n as findTaskByRunId, p as listTasksForRelatedSessionKey, r as getTaskById } from "./task-registry-query-Bd-H3o4L.mjs";
import { c as markTaskTerminalById, f as updateTaskNotifyPolicyById } from "./task-registry-D10gtSrV.mjs";
//#region src/tasks/task-owner-access.ts
function resolveTaskOwnerCallerAgentId(task, identity) {
	if (task.scopeKind !== "session" || normalizeOptionalString(task.ownerKey) !== normalizeOptionalString(identity.callerOwnerKey)) return;
	return normalizeOptionalString(identity.callerAgentId) ?? parseAgentSessionKey(identity.callerOwnerKey)?.agentId;
}
function taskAgentMatchesCaller(taskAgentId, callerAgentId) {
	return Boolean(taskAgentId) && normalizeOptionalString(taskAgentId) === normalizeOptionalString(callerAgentId);
}
function canOwnerAccessTask(task, identity) {
	const callerAgentId = resolveTaskOwnerCallerAgentId(task, identity);
	if (!callerAgentId) return false;
	return taskAgentMatchesCaller(resolveTaskSessionAgentId(task.ownerKey, task.requesterAgentId, identity.config ?? getRuntimeConfig), callerAgentId);
}
async function canOwnerAccessTaskAsync(task, identity, readConfig) {
	const callerAgentId = resolveTaskOwnerCallerAgentId(task, identity);
	if (!callerAgentId) return false;
	return taskAgentMatchesCaller(identity.config ? resolveTaskSessionAgentId(task.ownerKey, task.requesterAgentId, identity.config) : await resolveTaskSessionAgentIdAsync(task.ownerKey, task.requesterAgentId, readConfig), callerAgentId);
}
function getTaskByIdForOwner(params) {
	const task = getTaskById(params.taskId);
	return task && canOwnerAccessTask(task, params) ? task : void 0;
}
function findTaskByRunIdForOwner(params) {
	const task = findTaskByRunId(params.runId);
	return task && canOwnerAccessTask(task, params) ? task : void 0;
}
/** Update an owner-visible task's notification policy. */
function updateTaskNotifyPolicyForOwner(params) {
	const task = getTaskByIdForOwner({
		taskId: params.taskId,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (!task) return null;
	return updateTaskNotifyPolicyById({
		taskId: task.taskId,
		notifyPolicy: params.notifyPolicy
	});
}
/** Mark an owner-visible task as cancelled with a caller-provided summary. */
function cancelTaskByIdForOwner(params) {
	const task = getTaskByIdForOwner({
		taskId: params.taskId,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (!task) return null;
	return markTaskTerminalById({
		taskId: task.taskId,
		status: "cancelled",
		endedAt: params.endedAt,
		terminalSummary: params.terminalSummary
	});
}
function listTasksForRelatedSessionKeyForOwner(params) {
	return listTasksForRelatedSessionKey(params.relatedSessionKey).filter((task) => canOwnerAccessTask(task, params));
}
function buildTaskStatusSnapshotForRelatedSessionKeyForOwner(params) {
	return buildTaskStatusSnapshot(listTasksForRelatedSessionKeyForOwner({
		relatedSessionKey: params.relatedSessionKey,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	}));
}
function findLatestTaskForRelatedSessionKeyForOwner(params) {
	return listTasksForRelatedSessionKeyForOwner(params)[0];
}
function resolveTaskForLookupTokenForOwner(params) {
	const direct = getTaskByIdForOwner({
		taskId: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (direct) return direct;
	const byRun = findTaskByRunIdForOwner({
		runId: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (byRun) return byRun;
	const related = findLatestTaskForRelatedSessionKeyForOwner({
		relatedSessionKey: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (related) return related;
	const raw = resolveTaskForLookupToken(params.token);
	return raw && canOwnerAccessTask(raw, params) ? raw : void 0;
}
//#endregion
export { findTaskByRunIdForOwner as a, resolveTaskForLookupTokenForOwner as c, findLatestTaskForRelatedSessionKeyForOwner as i, updateTaskNotifyPolicyForOwner as l, canOwnerAccessTaskAsync as n, getTaskByIdForOwner as o, cancelTaskByIdForOwner as r, listTasksForRelatedSessionKeyForOwner as s, buildTaskStatusSnapshotForRelatedSessionKeyForOwner as t };

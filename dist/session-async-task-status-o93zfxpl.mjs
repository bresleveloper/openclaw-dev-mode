import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { f as listTasksForOwnerKey } from "./task-registry-query-Cb1HIUfX.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
//#region src/agents/session-async-task-status.ts
/**
* Session async-task lookup helpers for avoiding duplicate long-running work
* and reporting the active task back through tool/status metadata.
*/
const DEFAULT_ACTIVE_STATUSES = /* @__PURE__ */ new Set(["queued", "running"]);
/** Find the active queued/running task that matches a session and optional filters. */
function findActiveSessionTask(params) {
	const normalizedSessionKey = normalizeOptionalString(params.sessionKey);
	if (!normalizedSessionKey) return;
	const statuses = params.statuses ?? DEFAULT_ACTIVE_STATUSES;
	const taskKind = normalizeOptionalString(params.taskKind);
	const taskLabel = normalizeOptionalString(params.task);
	const sourceIdPrefix = normalizeOptionalString(params.sourceIdPrefix);
	const matches = listTasksForOwnerKey(normalizedSessionKey).filter((task) => {
		if (task.scopeKind !== "session") return false;
		if (params.runtime && task.runtime !== params.runtime) return false;
		if (!statuses.has(task.status)) return false;
		if (taskKind && task.taskKind !== taskKind) return false;
		if (taskLabel) {
			if (normalizeOptionalString(task.task) !== taskLabel) return false;
		}
		if (sourceIdPrefix) {
			const sourceId = normalizeOptionalString(task.sourceId) ?? "";
			if (sourceId !== sourceIdPrefix && !sourceId.startsWith(`${sourceIdPrefix}:`)) return false;
		}
		return true;
	});
	if (matches.length === 0) return;
	return matches.find((task) => task.status === "running") ?? matches[0];
}
/** Build tool details that point callers at the already-active async task. */
function buildSessionAsyncTaskStatusDetails(task) {
	return {
		async: true,
		active: true,
		existingTask: true,
		status: task.status,
		task: {
			taskId: task.taskId,
			...task.runId ? { runId: task.runId } : {}
		},
		...task.taskKind ? { taskKind: task.taskKind } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.sourceId ? { sourceId: task.sourceId } : {}
	};
}
//#endregion
export { findActiveSessionTask as n, buildSessionAsyncTaskStatusDetails as t };

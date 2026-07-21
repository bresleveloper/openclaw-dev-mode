import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { r as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state-BrJUgd0A.js";
import { t as cancelTaskById } from "./task-registry-Bv5-Vohd.js";
import "./runtime-internal-OiU0x_qm.js";
import { a as createQueuedTaskRun$1, c as finalizeTaskRunByRunId$1, f as setDetachedTaskDeliveryStatusByRunId$1, i as completeTaskRunByRunId$1, o as createRunningTaskRun$1, p as startTaskRunByRunId$1, s as failTaskRunByRunId$1, u as recordTaskRunProgressByRunId$1 } from "./task-executor-DskL6qp9.js";
import { a as listTasksForSessionKeyForStatus, t as findTaskByRunIdForStatus } from "./task-status-access-Bh3Zqlj9.js";
//#region src/tasks/detached-task-runtime.ts
const log = createSubsystemLogger("tasks/detached-runtime");
const DETACHED_TASK_RECOVERY_WARN_MS = 5e3;
function taskMatchesFindScope(task, params) {
	return task.runtime === params.runtime && task.childSessionKey === params.sessionKey && task.createdAt >= params.createdAtOrAfter && (params.createdBefore === void 0 || task.createdAt < params.createdBefore);
}
function taskMatchesFindIdentity(task, params) {
	return task.runtime === params.runtime && task.childSessionKey === params.sessionKey;
}
function findCoreTaskRun(params) {
	const direct = findTaskByRunIdForStatus(params.runId);
	if (direct && taskMatchesFindIdentity(direct, params)) return direct;
	if (params.allowSessionFallback !== true) return;
	return listTasksForSessionKeyForStatus(params.sessionKey).find((task) => taskMatchesFindScope(task, params));
}
const DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME = {
	createQueuedTaskRun: createQueuedTaskRun$1,
	createRunningTaskRun: createRunningTaskRun$1,
	startTaskRunByRunId: startTaskRunByRunId$1,
	recordTaskRunProgressByRunId: recordTaskRunProgressByRunId$1,
	finalizeTaskRunByRunId: finalizeTaskRunByRunId$1,
	completeTaskRunByRunId: completeTaskRunByRunId$1,
	failTaskRunByRunId: failTaskRunByRunId$1,
	setDetachedTaskDeliveryStatusByRunId: setDetachedTaskDeliveryStatusByRunId$1,
	findTaskRun: findCoreTaskRun,
	cancelDetachedTaskRunById: cancelTaskById
};
function getDetachedTaskLifecycleRuntime() {
	return getRegisteredDetachedTaskLifecycleRuntime() ?? DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME;
}
function createQueuedTaskRun(...args) {
	return getDetachedTaskLifecycleRuntime().createQueuedTaskRun(...args);
}
function createRunningTaskRun(...args) {
	return getDetachedTaskLifecycleRuntime().createRunningTaskRun(...args);
}
function startTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().startTaskRunByRunId(...args);
}
function recordTaskRunProgressByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().recordTaskRunProgressByRunId(...args);
}
function finalizeTaskRunByRunId(params) {
	const runtime = getDetachedTaskLifecycleRuntime();
	if (runtime.finalizeTaskRunByRunId) return runtime.finalizeTaskRunByRunId(params);
	if (params.status === "succeeded") return runtime.completeTaskRunByRunId(params);
	return runtime.failTaskRunByRunId({
		...params,
		status: params.status
	});
}
function completeTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().completeTaskRunByRunId(...args);
}
function failTaskRunByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().failTaskRunByRunId(...args);
}
function setDetachedTaskDeliveryStatusByRunId(...args) {
	return getDetachedTaskLifecycleRuntime().setDetachedTaskDeliveryStatusByRunId(...args);
}
function findDetachedTaskRun(params) {
	const runtime = getDetachedTaskLifecycleRuntime();
	if (runtime.findTaskRun) try {
		return {
			lookup: "available",
			task: runtime.findTaskRun(params)
		};
	} catch (error) {
		log.warn("Detached task lookup failed", {
			runtime: params.runtime,
			runId: params.runId,
			error
		});
		return { lookup: "unavailable" };
	}
	const coreTask = findCoreTaskRun(params);
	return coreTask ? {
		lookup: "available",
		task: coreTask
	} : { lookup: "unavailable" };
}
function cancelDetachedTaskRunById(...args) {
	return getDetachedTaskLifecycleRuntime().cancelDetachedTaskRunById(...args);
}
async function tryRecoverTaskBeforeMarkLost(params) {
	const hook = getDetachedTaskLifecycleRuntime().tryRecoverTaskBeforeMarkLost;
	if (!hook) return { recovered: false };
	const startedAt = Date.now();
	try {
		const result = await hook(params);
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs >= DETACHED_TASK_RECOVERY_WARN_MS) log.warn("Detached task recovery hook was slow", {
			taskId: params.taskId,
			runtime: params.runtime,
			elapsedMs
		});
		if (result && typeof result.recovered === "boolean") return result;
		log.warn("Detached task recovery hook returned invalid result, proceeding with markTaskLost", {
			taskId: params.taskId,
			runtime: params.runtime,
			result
		});
		return { recovered: false };
	} catch (err) {
		log.warn("Detached task recovery hook threw, proceeding with markTaskLost", {
			taskId: params.taskId,
			runtime: params.runtime,
			elapsedMs: Date.now() - startedAt,
			error: err
		});
		return { recovered: false };
	}
}
//#endregion
export { failTaskRunByRunId as a, getDetachedTaskLifecycleRuntime as c, startTaskRunByRunId as d, tryRecoverTaskBeforeMarkLost as f, createRunningTaskRun as i, recordTaskRunProgressByRunId as l, completeTaskRunByRunId as n, finalizeTaskRunByRunId as o, createQueuedTaskRun as r, findDetachedTaskRun as s, cancelDetachedTaskRunById as t, setDetachedTaskDeliveryStatusByRunId as u };

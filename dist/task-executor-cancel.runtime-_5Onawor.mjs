import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state-Bj8WlYiY.mjs";
import { r as getTaskById } from "./task-registry-query-Cb1HIUfX.mjs";
import { g as prepareTaskCancellationRead, h as prepareTaskCancellationControl, n as assertTaskCancellationReadyById, r as cancelTaskById } from "./task-registry-J6rCfMnh.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
//#region src/tasks/task-executor-cancel.runtime.ts
async function cancelDetachedTaskRunByIdCore(params) {
	for (let pending = prepareTaskCancellationRead(); pending; pending = prepareTaskCancellationRead()) await pending;
	const task = getTaskById(params.taskId);
	const registeredRuntime = getRegisteredDetachedTaskLifecycleRuntime();
	try {
		prepareTaskCancellationControl(task)?.assertCurrent();
	} catch (error) {
		return {
			found: task !== void 0,
			cancelled: false,
			reason: formatErrorMessage(error),
			...task ? { task } : {}
		};
	}
	if (task) try {
		assertTaskCancellationReadyById(task.taskId);
	} catch (error) {
		return {
			found: true,
			cancelled: false,
			reason: formatErrorMessage(error),
			task
		};
	}
	if (registeredRuntime) {
		const cancelled = await registeredRuntime.cancelDetachedTaskRunById(params);
		if (cancelled.found) return cancelled;
	}
	return cancelTaskById(params);
}
//#endregion
export { cancelDetachedTaskRunByIdCore };

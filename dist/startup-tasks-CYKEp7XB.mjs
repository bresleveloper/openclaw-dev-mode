import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
//#region src/gateway/startup-tasks.ts
function taskMeta(task, reason) {
	return {
		source: task.source,
		...task.agentId ? { agentId: task.agentId } : {},
		...task.sessionKey ? { sessionKey: task.sessionKey } : {},
		...task.workspaceDir ? { workspaceDir: task.workspaceDir } : {},
		reason
	};
}
/** Runs startup tasks in order and logs failed/skipped task metadata. */
async function runStartupTasks(params) {
	for (const task of params.tasks) {
		let result;
		try {
			result = await task.run();
		} catch (err) {
			result = {
				status: "failed",
				reason: formatErrorMessage(err)
			};
		}
		if (result.status === "failed") {
			params.log.warn("startup task failed", taskMeta(task, result.reason));
			continue;
		}
		if (result.status === "skipped") params.log.debug("startup task skipped", taskMeta(task, result.reason));
	}
}
//#endregion
export { runStartupTasks as t };

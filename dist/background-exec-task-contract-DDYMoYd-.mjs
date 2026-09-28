//#region src/tasks/background-exec-task-contract.ts
const BACKGROUND_EXEC_TASK_KIND = "exec";
function isBackgroundExecTask(task) {
	return task.runtime === "cli" && task.taskKind === "exec";
}
//#endregion
export { isBackgroundExecTask as n, BACKGROUND_EXEC_TASK_KIND as t };

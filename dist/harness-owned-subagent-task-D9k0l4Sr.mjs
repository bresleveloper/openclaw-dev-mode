//#region src/tasks/harness-owned-subagent-task.ts
function isHarnessOwnedSubagentTask(task) {
	return task.runtime === "subagent" && !task.childSessionKey?.trim() && Boolean(task.taskKind?.trim());
}
//#endregion
export { isHarnessOwnedSubagentTask as t };

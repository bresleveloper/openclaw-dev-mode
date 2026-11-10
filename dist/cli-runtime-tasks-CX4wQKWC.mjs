import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/anthropic/cli-runtime-tasks.ts
function readReplayedTaskId(message, submittedInputUuids) {
	if (message.type !== "user" || message.isReplay !== true || message.parent_tool_use_id !== null || typeof message.uuid === "string" && submittedInputUuids.has(message.uuid) || !isRecord(message.message)) return;
	if (message.origin !== void 0 && (!isRecord(message.origin) || message.origin.kind !== "task-notification" || message.origin.subkind !== void 0)) return;
	const content = message.message.content;
	const first = Array.isArray(content) ? content[0] : void 0;
	const text = typeof content === "string" ? content : isRecord(first) && first.type === "text" && typeof first.text === "string" ? first.text : "";
	return /^<task-notification>\s*<task-id>([^<]+)<\/task-id>/u.exec(text)?.[1];
}
function recordTaskOwnership(session, task, inputUuid) {
	const taskId = task.task_id;
	if (typeof taskId !== "string" || !taskId) return;
	const previous = session.taskOwners.get(taskId);
	const owner = task.owned_by_subagent === true ? false : previous ?? (typeof task.parent_task_id === "string" ? session.taskOwners.get(task.parent_task_id) : void 0) ?? inputUuid;
	if (owner !== previous) session.taskOwners.set(taskId, owner);
	if (typeof task.run_id === "string" && task.run_id) session.taskRuns.set(task.run_id, taskId);
	return owner === false ? void 0 : taskId;
}
//#endregion
export { recordTaskOwnership as n, readReplayedTaskId as t };

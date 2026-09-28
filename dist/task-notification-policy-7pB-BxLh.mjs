import "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
//#region src/tasks/task-notification-policy.ts
function shouldAutoDeliverTaskTerminalUpdate(task) {
	if (task.notifyPolicy === "silent") return false;
	if (task.runtime === "subagent" && task.status !== "cancelled") return false;
	if (task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.") return false;
	if (!isTerminalTaskStatus(task.status)) return false;
	return task.deliveryStatus === "pending";
}
function shouldAutoDeliverTaskStateChange(task) {
	return task.notifyPolicy === "state_changes" && task.deliveryStatus === "pending" && !isTerminalTaskStatus(task.status);
}
function shouldSuppressDuplicateTerminalDelivery(params) {
	if (!params.task.runId?.trim()) return false;
	if (!(params.task.runtime === "acp" || params.task.runtime === "subagent" && params.task.status === "cancelled")) return false;
	if (params.task.runtime === "subagent" && params.peerDeliveryCovered) return true;
	return Boolean(params.preferredTaskId && params.preferredTaskId !== params.task.taskId);
}
//#endregion
export { shouldAutoDeliverTaskTerminalUpdate as n, shouldSuppressDuplicateTerminalDelivery as r, shouldAutoDeliverTaskStateChange as t };

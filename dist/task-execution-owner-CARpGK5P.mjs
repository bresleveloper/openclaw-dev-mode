import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { U as normalizeTaskTimestamps, et as mapAgentRunTerminalOutcomeToTaskStatus, k as applyTaskRecordPatch } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import "./run-termination-Cd1iJzC7.mjs";
import { hostname } from "node:os";
//#region src/tasks/task-execution-owner.ts
function captureTaskExecutionOwner(pid = process.pid) {
	const startIdentity = getFileLockProcessStartTime(pid);
	return Number.isSafeInteger(pid) && pid > 0 && startIdentity !== null ? {
		host: hostname(),
		pid,
		startIdentity
	} : void 0;
}
function isTaskExecutionOwnerDead(owner) {
	if (owner.host !== hostname()) return false;
	if (isPidDefinitelyDead(owner.pid)) return true;
	const startIdentity = getFileLockProcessStartTime(owner.pid);
	return startIdentity !== null && startIdentity !== owner.startIdentity;
}
function hasOrphanedExecution(task) {
	return task.status === "running" && task.endedAt === void 0 && task.executionOwner !== void 0 && isTaskExecutionOwnerDead(task.executionOwner);
}
function settleOrphanedTaskAtRestore(task, now) {
	const reason = "Task execution process exited before restart.";
	const outcome = buildAgentRunTerminalOutcome({
		status: "error",
		stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON,
		error: task.error ?? reason,
		startedAt: task.startedAt,
		endedAt: now
	});
	return applyTaskRecordPatch(task, {
		status: mapAgentRunTerminalOutcomeToTaskStatus(outcome),
		endedAt: now,
		lastEventAt: now,
		error: outcome.error,
		terminalSummary: reason,
		terminalOutcome: void 0
	});
}
function readRestoreSnapshot(loadSnapshot) {
	const snapshot = loadSnapshot();
	return {
		tasks: new Map([...snapshot.tasks].map(([id, task]) => [id, normalizeTaskTimestamps(task)])),
		deliveryStates: snapshot.deliveryStates
	};
}
function restoreTaskExecutionSnapshot(store, loadSnapshot = () => store.loadSnapshot()) {
	const snapshot = readRestoreSnapshot(loadSnapshot);
	if (![...snapshot.tasks.values()].some(hasOrphanedExecution)) return {
		snapshot,
		settledTasks: []
	};
	const settle = () => {
		const current = readRestoreSnapshot(loadSnapshot);
		const settledTasks = [];
		const now = Date.now();
		for (const [taskId, task] of current.tasks) {
			if (!hasOrphanedExecution(task)) continue;
			const next = settleOrphanedTaskAtRestore(task, now);
			store.upsertTaskWithDeliveryState({
				task: next,
				deliveryState: current.deliveryStates.get(taskId)
			});
			current.tasks.set(taskId, next);
			settledTasks.push(next);
		}
		return {
			snapshot: current,
			settledTasks
		};
	};
	return store.withMutation ? store.withMutation(settle) : settle();
}
//#endregion
export { restoreTaskExecutionSnapshot as n, captureTaskExecutionOwner as t };

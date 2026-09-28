import { a as getActiveGatewayRootWorkCount, o as getActiveGatewayRootWorkHolders } from "./gateway-work-admission-CHv_0noy.mjs";
import { c as getActiveSessionWorkAdmissionCount, s as getActiveSessionLifecycleMutationCount } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { n as isBackgroundExecTask } from "./background-exec-task-contract-DDYMoYd-.mjs";
import { t as getActiveEmbeddedRunCount } from "./active-run-projections-ChS97Oy4.mjs";
import { c as getActiveBackgroundExecSessionCount } from "./bash-process-registry-CkYBcnWR.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-BAhstaE7.mjs";
import { s as getActiveCronJobCount } from "./active-jobs-BdNx3YyC.mjs";
import { r as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BIgTNPfC.mjs";
import { s as getTotalQueueSize } from "./command-queue-CaY517ob.mjs";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-CwzU4Oc5.mjs";
import { t as formatActiveTaskRestartBlocker } from "./task-restart-blocker-B7ca32LH.mjs";
import { n as readLifecycleWriteCustody } from "./lifecycle-write-custody-Y0-8ADx0.mjs";
//#region src/infra/gateway-active-work.ts
const defaultInspectors = {
	getQueueSize: getTotalQueueSize,
	getPendingReplies: getTotalPendingReplies,
	getEmbeddedRuns: getActiveEmbeddedRunCount,
	getBackgroundExecSessions: getActiveBackgroundExecSessionCount,
	getCronRuns: () => Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()),
	getActiveTasks: () => getInspectableActiveTaskRestartBlockers().length,
	getTaskBlockers: getInspectableActiveTaskRestartBlockers,
	getRootRequests: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }),
	getRootRequestHolders: () => getActiveGatewayRootWorkHolders({ excludeCurrent: true }),
	getSessionAdmissions: getActiveSessionWorkAdmissionCount,
	getSessionMutations: getActiveSessionLifecycleMutationCount,
	getChatRuns: () => 0,
	getQueuedTurns: () => 0,
	getTerminalPersistence: () => 0,
	getTerminalSessions: () => 0
};
function normalizeCount(value) {
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
/** Cheap projection for status; suspension still uses the complete snapshot below. */
function readGatewayMaintenanceWork(inspectors = {}) {
	const resolved = {
		...defaultInspectors,
		...inspectors
	};
	const writeCustody = readLifecycleWriteCustody();
	const counts = {
		rootRequests: normalizeCount(resolved.getRootRequests()),
		cronRuns: normalizeCount(resolved.getCronRuns()),
		sessionMutations: normalizeCount(resolved.getSessionMutations()),
		terminalPersistence: normalizeCount(resolved.getTerminalPersistence()),
		lifecycleWrites: writeCustody.reduce((sum, fact) => sum + fact.count, 0)
	};
	for (const [phase, count] of [["session-mutation", counts.sessionMutations], ["terminal-persistence", counts.terminalPersistence]]) if (count > 0) writeCustody.push({
		phase,
		count
	});
	return {
		counts,
		writeCustody
	};
}
function createGatewayActiveWorkSnapshot(inspectors = {}, options = {}) {
	const resolved = {
		...defaultInspectors,
		...inspectors
	};
	const maintenance = readGatewayMaintenanceWork(inspectors);
	const counts = {
		queueSize: normalizeCount(resolved.getQueueSize()),
		pendingReplies: normalizeCount(resolved.getPendingReplies()),
		embeddedRuns: normalizeCount(resolved.getEmbeddedRuns()),
		backgroundExecSessions: normalizeCount(resolved.getBackgroundExecSessions()),
		activeTasks: normalizeCount(resolved.getActiveTasks()),
		sessionAdmissions: normalizeCount(resolved.getSessionAdmissions()),
		chatRuns: normalizeCount(resolved.getChatRuns()),
		queuedTurns: normalizeCount(resolved.getQueuedTurns()),
		terminalSessions: normalizeCount(resolved.getTerminalSessions()),
		...maintenance.counts,
		totalActive: 0
	};
	counts.totalActive = Object.values(counts).reduce((total, count) => total + count, 0) - (options.ignoreTerminalSessions ? counts.terminalSessions : 0);
	const blockers = [];
	const add = (count, kind, message) => {
		if (count > 0) blockers.push({
			kind,
			count,
			message
		});
	};
	add(counts.queueSize, "queue", `${counts.queueSize} queued or active operation(s)`);
	add(counts.pendingReplies, "reply", `${counts.pendingReplies} pending reply delivery operation(s)`);
	add(counts.embeddedRuns, "embedded-run", `${counts.embeddedRuns} active embedded run(s)`);
	add(counts.backgroundExecSessions, "background-exec", `${counts.backgroundExecSessions} active background exec session(s)`);
	add(counts.cronRuns, "cron-run", `${counts.cronRuns} active cron run(s)`);
	const rootRequestHolders = inspectors.getRootRequests && !inspectors.getRootRequestHolders ? [] : resolved.getRootRequestHolders?.() ?? [];
	const rootRequestHolderNames = rootRequestHolders.toSorted().slice(0, 8);
	if (rootRequestHolders.length > rootRequestHolderNames.length) rootRequestHolderNames.push(`+${rootRequestHolders.length - rootRequestHolderNames.length} more`);
	add(counts.rootRequests, "root-request", `${counts.rootRequests} active gateway request(s)${rootRequestHolderNames.length > 0 ? `: ${rootRequestHolderNames.join(", ")}` : ""}`);
	add(counts.sessionAdmissions, "session-admission", `${counts.sessionAdmissions} admitted session turn(s)`);
	add(counts.sessionMutations, "session-mutation", `${counts.sessionMutations} active session lifecycle mutation(s)`);
	add(counts.chatRuns, "chat-run", `${counts.chatRuns} active chat run(s)`);
	add(counts.queuedTurns, "queued-turn", `${counts.queuedTurns} queued chat turn(s)`);
	add(counts.terminalPersistence, "terminal-persistence", `${counts.terminalPersistence} pending terminal session write(s)`);
	if (!options.ignoreTerminalSessions) add(counts.terminalSessions, "terminal-session", `${counts.terminalSessions} open terminal session(s)`);
	if (counts.activeTasks > 0) {
		const taskBlockers = resolved.getTaskBlockers();
		if (taskBlockers.length === 0) blockers.push({
			kind: "task",
			count: counts.activeTasks,
			message: `${counts.activeTasks} active background task run(s)`
		});
		else {
			const shownTaskBlockers = taskBlockers.slice(0, 8);
			for (const { taskKind, ...task } of shownTaskBlockers) blockers.push({
				kind: isBackgroundExecTask({
					runtime: task.runtime,
					taskKind
				}) ? "background-exec" : "task",
				count: 1,
				message: formatActiveTaskRestartBlocker(task),
				task
			});
			const omitted = counts.activeTasks - shownTaskBlockers.length;
			if (omitted > 0) blockers.push({
				kind: "task",
				count: omitted,
				message: `${omitted} additional active background task run(s)`
			});
		}
	}
	return {
		idle: counts.totalActive === 0,
		counts,
		blockers,
		writeCustody: maintenance.writeCustody
	};
}
const GATEWAY_ACTIVE_WORK_POLL_MS = 250;
/** Waits for the complete process-wide active-work inventory to become idle. */
async function waitForGatewayActiveWork(timeoutMs, options = {}) {
	const timeout = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(0, Math.floor(timeoutMs)) : void 0;
	const deadlineAt = timeout === void 0 ? void 0 : Date.now() + timeout;
	while (true) {
		const snapshot = createGatewayActiveWorkSnapshot();
		options.onSnapshot?.(snapshot);
		if (snapshot.idle) return {
			drained: true,
			snapshot
		};
		const remainingMs = deadlineAt === void 0 ? void 0 : deadlineAt - Date.now();
		if (remainingMs !== void 0 && remainingMs <= 0) return {
			drained: false,
			snapshot
		};
		await new Promise((resolve) => {
			setTimeout(resolve, Math.min(GATEWAY_ACTIVE_WORK_POLL_MS, remainingMs ?? Infinity));
		});
	}
}
//#endregion
export { readGatewayMaintenanceWork as n, waitForGatewayActiveWork as r, createGatewayActiveWorkSnapshot as t };

import { f as getTaskFlowRegistryRestoreFailure, m as listTaskFlowRecords } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { a as summarizeAuditFindings } from "./task-registry.audit.shared-2IJPSTDV.mjs";
import { n as isTaskFlowCancellationPending } from "./task-cancellation-state-7hPsgm-K.mjs";
import { u as listTaskStatesForFlowIds } from "./task-registry-query-Bd-H3o4L.mjs";
import "./runtime-internal-BF8pXknh.mjs";
//#region src/tasks/task-flow-registry.audit.ts
const DEFAULT_STALE_RUNNING_MS = 18e5;
const DEFAULT_STALE_WAITING_MS = 18e5;
const DEFAULT_STALE_BLOCKED_MS = 18e5;
const DEFAULT_CANCEL_STUCK_MS = 3e5;
function createFinding(params) {
	return {
		severity: params.severity,
		code: params.code,
		detail: params.detail,
		...typeof params.ageMs === "number" ? { ageMs: params.ageMs } : {},
		...params.flow ? { flow: params.flow } : {}
	};
}
function severityRank(severity) {
	return severity === "error" ? 0 : 1;
}
function compareFindings(left, right) {
	const severityDiff = severityRank(left.severity) - severityRank(right.severity);
	if (severityDiff !== 0) return severityDiff;
	const leftAge = left.ageMs ?? -1;
	const rightAge = right.ageMs ?? -1;
	if (leftAge !== rightAge) return rightAge - leftAge;
	return (left.flow?.createdAt ?? 0) - (right.flow?.createdAt ?? 0);
}
function getReferenceAt(flow) {
	return flow.updatedAt ?? flow.createdAt;
}
function hasBlockingMetadata(flow) {
	return Boolean(flow.blockedTaskId?.trim() || flow.blockedSummary?.trim() || flow.waitJson != null);
}
function findTimestampInconsistency(flow) {
	if (flow.updatedAt < flow.createdAt) return createFinding({
		severity: "warn",
		code: "inconsistent_timestamps",
		flow,
		detail: "updatedAt is earlier than createdAt"
	});
	if (flow.endedAt && flow.endedAt < flow.createdAt) return createFinding({
		severity: "warn",
		code: "inconsistent_timestamps",
		flow,
		detail: "endedAt is earlier than createdAt"
	});
	if (flow.endedAt && flow.endedAt < flow.updatedAt) return createFinding({
		severity: "warn",
		code: "inconsistent_timestamps",
		flow,
		detail: "endedAt is earlier than updatedAt"
	});
	return null;
}
function createEmptyTaskFlowAuditSummary() {
	return {
		total: 0,
		warnings: 0,
		errors: 0,
		byCode: {
			restore_failed: 0,
			stale_running: 0,
			stale_waiting: 0,
			stale_blocked: 0,
			cancel_stuck: 0,
			missing_linked_tasks: 0,
			blocked_task_missing: 0,
			inconsistent_timestamps: 0
		}
	};
}
function listTaskFlowAuditFindings(options = {}) {
	const restoreFailure = getTaskFlowRegistryRestoreFailure();
	const flows = options.flows ?? (restoreFailure ? [] : listTaskFlowRecords());
	const now = options.now ?? Date.now();
	const staleRunningMs = options.staleRunningMs ?? DEFAULT_STALE_RUNNING_MS;
	const staleWaitingMs = options.staleWaitingMs ?? DEFAULT_STALE_WAITING_MS;
	const staleBlockedMs = options.staleBlockedMs ?? DEFAULT_STALE_BLOCKED_MS;
	const cancelStuckMs = options.cancelStuckMs ?? DEFAULT_CANCEL_STUCK_MS;
	const findings = [];
	if (restoreFailure) findings.push(createFinding({
		severity: "error",
		code: "restore_failed",
		detail: `task-flow registry restore failed: ${restoreFailure}`
	}));
	const tasksByFlowId = flows.length > 0 ? listTaskStatesForFlowIds(flows.map((flow) => flow.flowId)) : void 0;
	for (const flow of flows) {
		const referenceAt = getReferenceAt(flow);
		const ageMs = Math.max(0, now - referenceAt);
		const linkedTasks = tasksByFlowId?.get(flow.flowId.trim()) ?? [];
		const hasActiveTasks = linkedTasks.some(isTaskFlowCancellationPending);
		if (flow.status === "running" && ageMs >= staleRunningMs) findings.push(createFinding({
			severity: "error",
			code: "stale_running",
			flow,
			ageMs,
			detail: "running TaskFlow has not advanced recently"
		}));
		if (flow.status === "waiting" && ageMs >= staleWaitingMs) findings.push(createFinding({
			severity: "warn",
			code: "stale_waiting",
			flow,
			ageMs,
			detail: "waiting TaskFlow has not advanced recently"
		}));
		if (flow.status === "blocked" && flow.endedAt == null && ageMs >= staleBlockedMs) findings.push(createFinding({
			severity: "warn",
			code: "stale_blocked",
			flow,
			ageMs,
			detail: "blocked TaskFlow has not advanced recently"
		}));
		if (flow.cancelRequestedAt != null && flow.status !== "cancelled" && flow.status !== "failed" && flow.status !== "succeeded" && flow.status !== "lost" && !hasActiveTasks && now - flow.cancelRequestedAt >= cancelStuckMs) findings.push(createFinding({
			severity: "warn",
			code: "cancel_stuck",
			flow,
			ageMs: Math.max(0, now - flow.cancelRequestedAt),
			detail: "cancel-requested TaskFlow has no active child tasks but is still nonterminal"
		}));
		if (flow.syncMode === "managed" && (flow.status === "running" || flow.status === "waiting" || flow.status === "blocked") && ageMs >= (flow.status === "running" ? staleRunningMs : flow.status === "waiting" ? staleWaitingMs : staleBlockedMs) && linkedTasks.length === 0 && !hasBlockingMetadata(flow)) findings.push(createFinding({
			severity: flow.status === "running" ? "error" : "warn",
			code: "missing_linked_tasks",
			flow,
			ageMs,
			detail: "managed TaskFlow has no linked tasks or wait state"
		}));
		if (flow.endedAt == null && flow.blockedTaskId?.trim()) {
			const blockedTaskId = flow.blockedTaskId.trim();
			if (!linkedTasks.some((task) => task.taskId === blockedTaskId)) findings.push(createFinding({
				severity: "warn",
				code: "blocked_task_missing",
				flow,
				ageMs,
				detail: `blocked TaskFlow points at missing task ${blockedTaskId}`
			}));
		}
		const inconsistency = findTimestampInconsistency(flow);
		if (inconsistency) findings.push(inconsistency);
	}
	return findings.toSorted(compareFindings);
}
function summarizeTaskFlowAuditFindings(findings) {
	return summarizeAuditFindings(findings, createEmptyTaskFlowAuditSummary());
}
//#endregion
export { summarizeTaskFlowAuditFindings as n, listTaskFlowAuditFindings as t };

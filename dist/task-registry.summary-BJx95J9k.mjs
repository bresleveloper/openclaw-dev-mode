import { a as summarizeAuditFindings, i as createEmptyTaskAuditSummary, r as compareTaskAuditFindingSortKeys } from "./task-registry.audit.shared-2IJPSTDV.mjs";
//#region src/tasks/task-retention.ts
/** Default retention for terminal task records before maintenance prunes them. */
const DEFAULT_TASK_RETENTION_MS = 6048e5;
const LOST_TASK_RETENTION_MS = 864e5;
function resolveTaskRetentionMs(status) {
	return status === "lost" ? LOST_TASK_RETENTION_MS : DEFAULT_TASK_RETENTION_MS;
}
function resolveTaskCleanupAfter(task) {
	return (task.endedAt ?? task.lastEventAt ?? task.createdAt) + resolveTaskRetentionMs(task.status);
}
function resolveEffectiveTaskCleanupAfter(task) {
	const statusCleanupAfter = resolveTaskCleanupAfter(task);
	if (typeof task.cleanupAfter !== "number") return statusCleanupAfter;
	return task.status === "lost" ? Math.min(task.cleanupAfter, statusCleanupAfter) : task.cleanupAfter;
}
//#endregion
//#region src/tasks/task-registry.audit.ts
const DEFAULT_STALE_QUEUED_MS = 6e5;
const DEFAULT_STALE_RUNNING_MS = 18e5;
let taskAuditTaskProvider = () => [];
/** Installs the task source used by inspectable task audits. */
function configureTaskAuditTaskProvider(provider) {
	taskAuditTaskProvider = provider;
}
function createFinding(params) {
	return {
		severity: params.severity,
		code: params.code,
		task: params.task,
		detail: params.detail,
		...typeof params.ageMs === "number" ? { ageMs: params.ageMs } : {}
	};
}
function taskReferenceAt(task) {
	return task.lastEventAt ?? task.startedAt ?? task.createdAt;
}
function findTimestampInconsistency(task) {
	if (task.startedAt && task.startedAt < task.createdAt) return "start_before_creation";
	if (task.endedAt && task.startedAt && task.endedAt < task.startedAt) return "end_before_start";
	if ((task.status === "queued" || task.status === "running") && task.endedAt) return "active_ended";
	return null;
}
function retainedLostCleanupAfter(task, now) {
	if (task.status !== "lost" || typeof task.cleanupAfter !== "number") return;
	const cleanupAfter = resolveEffectiveTaskCleanupAfter(task);
	return cleanupAfter > now ? cleanupAfter : void 0;
}
function visitTaskAuditCodes(task, now, visit, staleQueuedMs = DEFAULT_STALE_QUEUED_MS, staleRunningMs = DEFAULT_STALE_RUNNING_MS) {
	const ageMs = Math.max(0, now - taskReferenceAt(task));
	if (task.status === "queued" && ageMs >= staleQueuedMs) visit("stale_queued", "warn", ageMs);
	if (task.status === "running" && ageMs >= staleRunningMs) visit("stale_running", "error", ageMs);
	if (task.status === "lost") visit("lost", retainedLostCleanupAfter(task, now) !== void 0 ? "warn" : "error", ageMs);
	if (task.deliveryStatus === "failed" && task.notifyPolicy !== "silent") visit("delivery_failed", "warn", ageMs);
	if (task.status !== "lost" && task.status !== "queued" && task.status !== "running" && typeof task.cleanupAfter !== "number") visit("missing_cleanup", "warn", ageMs);
	const inconsistency = findTimestampInconsistency(task);
	if (inconsistency) visit("inconsistent_timestamps", "warn", void 0, inconsistency);
}
const TASK_AUDIT_DESCRIPTIONS = {
	stale_queued: "queued task has not advanced recently",
	stale_running: "running task appears stuck",
	delivery_failed: "terminal update delivery failed",
	missing_cleanup: "terminal task is missing cleanupAfter"
};
function describeTaskAuditCode(task, code, severity, timestampIssue) {
	if (code === "lost") return task.error?.trim() || (severity === "warn" ? "task lost its backing session and is retained until cleanupAfter" : "task lost its backing session");
	if (code === "inconsistent_timestamps") return timestampIssue === "start_before_creation" ? "startedAt is earlier than createdAt" : timestampIssue === "end_before_start" ? "endedAt is earlier than startedAt" : `${task.status} task should not already have endedAt`;
	return TASK_AUDIT_DESCRIPTIONS[code];
}
function compareFindings(left, right) {
	return compareTaskAuditFindingSortKeys({
		severity: left.severity,
		ageMs: left.ageMs,
		createdAt: left.task.createdAt
	}, {
		severity: right.severity,
		ageMs: right.ageMs,
		createdAt: right.task.createdAt
	});
}
function listTaskAuditFindings(options = {}) {
	const tasks = options.tasks ?? taskAuditTaskProvider();
	const now = options.now ?? Date.now();
	const staleQueuedMs = options.staleQueuedMs ?? DEFAULT_STALE_QUEUED_MS;
	const staleRunningMs = options.staleRunningMs ?? DEFAULT_STALE_RUNNING_MS;
	const findings = [];
	for (const task of tasks) visitTaskAuditCodes(task, now, (code, severity, ageMs, timestampIssue) => {
		findings.push(createFinding({
			code,
			severity,
			task,
			ageMs,
			detail: describeTaskAuditCode(task, code, severity, timestampIssue)
		}));
	}, staleQueuedMs, staleRunningMs);
	return findings.toSorted(compareFindings);
}
function isRetainedLostTaskAuditFinding(finding, now = Date.now()) {
	return finding.code === "lost" && retainedLostCleanupAfter(finding.task, now) !== void 0;
}
/** Folds audit metadata without materializing findings; returns whether this lost task is retained. */
function addTaskAuditRecordSummary(summary, retainedLost, task, now) {
	const cleanupAfter = retainedLostCleanupAfter(task, now);
	if (cleanupAfter !== void 0) {
		retainedLost.count += 1;
		retainedLost.nextCleanupAfter = retainedLost.nextCleanupAfter === void 0 ? cleanupAfter : Math.min(retainedLost.nextCleanupAfter, cleanupAfter);
	}
	visitTaskAuditCodes(task, now, (code, severity) => {
		if (code === "lost" && cleanupAfter !== void 0) return;
		summary.total += 1;
		summary.byCode[code] += 1;
		if (severity === "error") summary.errors += 1;
		else summary.warnings += 1;
	});
	return cleanupAfter !== void 0;
}
function summarizeTaskAuditFindings(findings) {
	return summarizeAuditFindings(findings, createEmptyTaskAuditSummary());
}
function summarizeRetainedLostTaskAuditFindings(findings, options = {}) {
	const now = options.now ?? Date.now();
	let count = 0;
	let nextCleanupAfter;
	for (const finding of findings) {
		if (!isRetainedLostTaskAuditFinding(finding, now)) continue;
		count += 1;
		const cleanupAfter = resolveEffectiveTaskCleanupAfter(finding.task);
		if (nextCleanupAfter === void 0 || cleanupAfter < nextCleanupAfter) nextCleanupAfter = cleanupAfter;
	}
	return {
		count,
		...nextCleanupAfter !== void 0 ? { nextCleanupAfter } : {}
	};
}
//#endregion
//#region src/tasks/task-registry.summary.ts
function createEmptyTaskStatusCounts() {
	return {
		queued: 0,
		running: 0,
		succeeded: 0,
		failed: 0,
		timed_out: 0,
		cancelled: 0,
		lost: 0
	};
}
function createEmptyTaskRuntimeCounts() {
	return {
		subagent: 0,
		acp: 0,
		cli: 0,
		cron: 0
	};
}
function createEmptyTaskRegistrySummary() {
	return {
		total: 0,
		active: 0,
		terminal: 0,
		failures: 0,
		byStatus: createEmptyTaskStatusCounts(),
		byRuntime: createEmptyTaskRuntimeCounts()
	};
}
function addTaskRegistrySummaryCounts(summary, runtime, status, count) {
	summary.total += count;
	summary.byStatus[status] += count;
	summary.byRuntime[runtime] += count;
	if (status === "queued" || status === "running") summary.active += count;
	else summary.terminal += count;
	if (status === "failed" || status === "timed_out" || status === "lost") summary.failures += count;
}
function summarizeTaskRecords(records) {
	const summary = createEmptyTaskRegistrySummary();
	for (const task of records) addTaskRegistrySummaryCounts(summary, task.runtime, task.status, 1);
	return summary;
}
function createEmptyTaskStatusSummary() {
	return {
		tasks: createEmptyTaskRegistrySummary(),
		taskAudit: createEmptyTaskAuditSummary(),
		taskAuditRetainedLost: { count: 0 }
	};
}
function addTaskStatusSummaryRecord(summary, task, now) {
	addTaskRegistrySummaryCounts(summary.tasks, task.runtime, task.status, 1);
	if (addTaskAuditRecordSummary(summary.taskAudit, summary.taskAuditRetainedLost, task, now)) summary.tasks.failures -= 1;
}
//#endregion
export { summarizeTaskRecords as a, summarizeRetainedLostTaskAuditFindings as c, resolveTaskCleanupAfter as d, createEmptyTaskStatusSummary as i, summarizeTaskAuditFindings as l, addTaskStatusSummaryRecord as n, configureTaskAuditTaskProvider as o, createEmptyTaskRegistrySummary as r, listTaskAuditFindings as s, addTaskRegistrySummaryCounts as t, resolveEffectiveTaskCleanupAfter as u };

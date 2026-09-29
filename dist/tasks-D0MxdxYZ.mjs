import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as formatLookupMiss } from "./error-format-B21fL1a_.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { i as matchesTaskStatusFilter, n as TASK_STATUS_FILTERS, t as TASK_RUNTIMES } from "./task-registry.types-CkM1jc3D.mjs";
import { a as summarizeTaskRecords, c as summarizeRetainedLostTaskAuditFindings, s as listTaskAuditFindings } from "./task-registry.summary-BJx95J9k.mjs";
import { n as formatTaskStatus, o as isTaskStatusIssue, r as formatTaskStatusDetail } from "./task-status-D1-umRs5.mjs";
import { f as updateTaskNotifyPolicyById } from "./task-registry-J6rCfMnh.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
import { t as cancelDetachedTaskRunById } from "./task-executor-C9k_UJW4.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { r as loadCronJobsStore } from "./store-CV1wrdMb.mjs";
import { u as runSessionRegistryMaintenanceForStore } from "./sessions-DE4llkPV.mjs";
import { _ as assertTaskFlowRegistryMaintenanceReady, a as getInspectableTaskRegistrySummary, b as runTaskFlowRegistryMaintenance, d as reconcileInspectableTasks, f as reconcileTaskLookupToken, i as getInspectableTaskAuditSummary, p as runTaskRegistryMaintenance, s as getTaskRegistryMaintenanceDiagnostics, t as configureTaskRegistryMaintenance, u as previewTaskRegistryMaintenance, v as getInspectableTaskFlowAuditSummary, y as previewTaskFlowRegistryMaintenance } from "./task-registry.maintenance-C1rFYT15.mjs";
import { t as listTaskFlowAuditFindings } from "./task-flow-registry.audit-3plCXhLU.mjs";
import { t as formatTextCell } from "./text-format-D_7c--rP.mjs";
import { n as TASK_SYSTEM_AUDIT_SEVERITIES, t as TASK_SYSTEM_AUDIT_CODES } from "./task-system-audit.types-CkW3UjKV.mjs";
import { t as parseCliEnumFilter } from "./enum-filter-Bua3W8iv.mjs";
import { t as formatTaskStatusCell } from "./task-status-cell-BWqYN9vo.mjs";
import { n as buildTaskSystemAuditJsonPayload, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-BFU4Ircd.mjs";
//#region src/commands/tasks-session-registry-maintenance.ts
const SESSION_REGISTRY_RETENTION_MS = 6048e5;
function resolveExplicitCronSessionSegment(sessionKey) {
	return /^(?:agent:[^:]+:)?cron:([^:]+)$/u.exec(sessionKey?.trim() ?? "")?.[1]?.toLowerCase();
}
async function readRunningCronJobIds() {
	try {
		const cronStorePath = resolveCronJobsStorePath();
		const runningJobs = (await loadCronJobsStore(cronStorePath)).jobs.filter((job) => typeof job.state?.runningAtMs === "number");
		const ids = /* @__PURE__ */ new Set();
		for (const job of runningJobs) {
			ids.add(job.id.toLowerCase());
			if (job.sessionTarget === "main") continue;
			const explicitSessionSegment = resolveExplicitCronSessionSegment(job.sessionKey);
			if (explicitSessionSegment) ids.add(explicitSessionSegment);
		}
		return {
			ok: true,
			ids,
			count: runningJobs.length
		};
	} catch (err) {
		return {
			ok: false,
			reason: formatErrorMessage(err)
		};
	}
}
async function runSessionRegistryMaintenance(params) {
	const cfg = getRuntimeConfig();
	const runningCronJobs = await readRunningCronJobIds();
	if (!runningCronJobs.ok) return {
		retentionMs: SESSION_REGISTRY_RETENTION_MS,
		runningCronJobs: 0,
		pruned: 0,
		skippedStores: 0,
		stores: [],
		skippedReason: `cron store unreadable: ${runningCronJobs.reason}`
	};
	const stores = [];
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg)) {
		if (readAgentDeletionJournal(target.agentId)?.cleanupCompleted) {
			stores.push({
				...target,
				skippedReason: "agent-deletion-complete"
			});
			continue;
		}
		const result = await runSessionRegistryMaintenanceForStore({
			...target,
			apply: params.apply,
			retentionMs: SESSION_REGISTRY_RETENTION_MS,
			runningCronJobIds: runningCronJobs.ids
		});
		stores.push({
			agentId: target.agentId,
			storePath: target.storePath,
			beforeCount: result.beforeCount,
			afterCount: result.afterCount,
			pruned: result.pruned,
			preservedRunning: result.preservedRunning
		});
	}
	return {
		retentionMs: SESSION_REGISTRY_RETENTION_MS,
		runningCronJobs: runningCronJobs.count,
		pruned: stores.reduce((total, store) => total + ("pruned" in store ? store.pruned : 0), 0),
		skippedStores: stores.filter((store) => "skippedReason" in store).length,
		stores
	};
}
//#endregion
//#region src/commands/tasks.ts
const RUNTIME_PAD = 8;
const DELIVERY_PAD = 14;
const ID_PAD = 10;
const RUN_PAD = 10;
const CHILD_SESSION_PAD = 36;
const info = theme.info;
function formatTaskLookupMiss(lookup) {
	return formatLookupMiss({
		noun: "Task",
		value: sanitizeTerminalText(lookup),
		listCommand: "openclaw tasks list",
		valueLabel: "task id"
	});
}
function formatTaskTimestamp(value) {
	return timestampMsToIsoString(value) ?? "n/a";
}
async function tryCancelGatewayOwnedTaskViaGateway(task) {
	try {
		const { callGateway } = await import("./call-bfuNQIMk.mjs");
		return await callGateway({
			method: "tasks.cancel",
			params: { taskId: task.taskId },
			timeoutMs: task.runtime === "cli" ? 15e3 : 5e3
		});
	} catch (error) {
		if (task.runtime === "cron") return null;
		const detail = error instanceof Error ? error.message : String(error);
		return {
			found: true,
			cancelled: false,
			reason: `${task.runtime.toUpperCase()} task cancellation requires the live Gateway tasks.cancel path: ${detail}`,
			task
		};
	}
}
function configureTaskMaintenanceFromConfig() {
	configureTaskRegistryMaintenance();
}
function truncate(value, maxChars) {
	return truncateWithMarker(value, maxChars, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
}
function formatTokenCell(value, width = ID_PAD) {
	const sanitized = sanitizeTerminalText(normalizeOptionalString(value) ?? "").trim();
	return formatTextCell(sanitized || "n/a", width);
}
function formatTaskRows(tasks, rich) {
	const header = [
		"Task".padEnd(ID_PAD),
		"Kind".padEnd(RUNTIME_PAD),
		"Status".padEnd(10),
		"Delivery".padEnd(DELIVERY_PAD),
		"Run".padEnd(RUN_PAD),
		"Child Session".padEnd(CHILD_SESSION_PAD),
		"Summary"
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	for (const task of tasks) {
		const summary = truncate(sanitizeTerminalText(formatTaskStatusDetail(task) || normalizeOptionalString(task.label) || task.task.trim()), 80);
		const line = [
			formatTokenCell(task.taskId),
			task.runtime.padEnd(RUNTIME_PAD),
			formatTaskStatusCell(formatTaskStatus(task), rich),
			task.deliveryStatus.padEnd(DELIVERY_PAD),
			formatTokenCell(task.runId, RUN_PAD),
			formatTokenCell(task.childSessionKey, CHILD_SESSION_PAD),
			summary
		].join(" ");
		lines.push(line.trimEnd());
	}
	return lines;
}
function formatTaskListSummary(tasks) {
	const summary = summarizeTaskRecords(tasks);
	return `${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${tasks.filter(isTaskStatusIssue).length} issues`;
}
function formatAgeMs(ageMs) {
	if (typeof ageMs !== "number" || ageMs < 1e3) return "fresh";
	const totalSeconds = Math.floor(ageMs / 1e3);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor(totalSeconds % 86400 / 3600);
	const minutes = Math.floor(totalSeconds % 3600 / 60);
	if (days > 0) return `${days}d${hours}h`;
	if (hours > 0) return `${hours}h${minutes}m`;
	if (minutes > 0) return `${minutes}m`;
	return `${totalSeconds}s`;
}
function formatAuditRows(findings, rich) {
	const header = [
		"Scope".padEnd(8),
		"Severity".padEnd(8),
		"Code".padEnd(22),
		"Item".padEnd(ID_PAD),
		"Status".padEnd(10),
		"Age".padEnd(8),
		"Detail"
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	for (const finding of findings) {
		const severity = finding.severity.padEnd(8);
		const status = formatTaskStatusCell(finding.status ?? "n/a", rich);
		const severityCell = !rich ? severity : finding.severity === "error" ? theme.error(severity) : theme.warn(severity);
		const scope = finding.kind === "task" ? "Task" : "TaskFlow";
		lines.push([
			scope.padEnd(8),
			severityCell,
			finding.code.padEnd(22),
			formatTokenCell(finding.token),
			status,
			formatAgeMs(finding.ageMs).padEnd(8),
			truncate(sanitizeTerminalText(finding.detail), 88)
		].join(" ").trimEnd());
	}
	return lines;
}
function toSystemAuditFindings(params) {
	const taskFindings = listTaskAuditFindings({ tasks: reconcileInspectableTasks() });
	const flowFindings = listTaskFlowAuditFindings();
	return buildTaskSystemAuditFindings({
		taskFindings,
		flowFindings,
		severityFilter: params.severityFilter,
		codeFilter: params.codeFilter
	});
}
/** Lists background tasks with optional runtime/status filters. */
async function tasksListCommand(opts, runtime) {
	const runtimeFilter = parseCliEnumFilter(opts.runtime, "--runtime", TASK_RUNTIMES);
	const statusFilter = parseCliEnumFilter(opts.status, "--status", TASK_STATUS_FILTERS);
	const tasks = reconcileInspectableTasks().filter((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && !matchesTaskStatusFilter(task, statusFilter)) return false;
		return true;
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			count: tasks.length,
			runtime: runtimeFilter ?? null,
			status: statusFilter ?? null,
			tasks
		});
		return;
	}
	runtime.log(info(`Background tasks: ${tasks.length}`));
	runtime.log(info(`Task pressure: ${formatTaskListSummary(tasks)}`));
	if (runtimeFilter) runtime.log(info(`Runtime filter: ${sanitizeTerminalText(runtimeFilter)}`));
	if (statusFilter) runtime.log(info(`Status filter: ${sanitizeTerminalText(statusFilter)}`));
	if (tasks.length === 0) {
		runtime.log(`No background tasks found. Run ${formatCliCommand("openclaw tasks audit")} to check for stale task state.`);
		return;
	}
	const rich = isRich();
	for (const line of formatTaskRows(tasks, rich)) runtime.log(line);
}
/** Shows one task record by id or lookup token. */
async function tasksShowCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		const message = formatTaskLookupMiss(opts.lookup);
		if (opts.json) writeRuntimeJson(runtime, formatCliJsonFailure(message));
		else runtime.error(message);
		runtime.exit(1, opts.json ? { resetStream: process.stderr } : void 0);
		return;
	}
	if (opts.json) {
		writeRuntimeJson(runtime, task);
		return;
	}
	const lines = [
		"Background task:",
		`taskId: ${task.taskId}`,
		`kind: ${task.runtime}`,
		`sourceId: ${task.sourceId ?? "n/a"}`,
		`status: ${formatTaskStatus(task)}`,
		`result: ${task.terminalOutcome ?? "n/a"}`,
		`delivery: ${task.deliveryStatus}`,
		`notify: ${task.notifyPolicy}`,
		`ownerKey: ${task.ownerKey}`,
		`childSessionKey: ${task.childSessionKey ?? "n/a"}`,
		`parentTaskId: ${task.parentTaskId ?? "n/a"}`,
		`agentId: ${task.agentId ?? "n/a"}`,
		`runId: ${task.runId ?? "n/a"}`,
		`label: ${task.label ?? "n/a"}`,
		`task: ${task.task}`,
		`createdAt: ${formatTaskTimestamp(task.createdAt)}`,
		`startedAt: ${formatTaskTimestamp(task.startedAt)}`,
		`endedAt: ${formatTaskTimestamp(task.endedAt)}`,
		`lastEventAt: ${formatTaskTimestamp(task.lastEventAt)}`,
		`cleanupAfter: ${formatTaskTimestamp(task.cleanupAfter)}`,
		...task.error ? [`error: ${task.error}`] : [],
		...task.progressSummary ? [`progressSummary: ${task.progressSummary}`] : [],
		...task.terminalSummary ? [`terminalSummary: ${task.terminalSummary}`] : []
	];
	for (const line of lines) runtime.log(sanitizeTerminalText(line));
}
/** Updates a task's notification policy. */
async function tasksNotifyCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	const updated = updateTaskNotifyPolicyById({
		taskId: task.taskId,
		notifyPolicy: opts.notify
	});
	if (!updated) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	runtime.log(sanitizeTerminalText(`Updated ${updated.taskId} notify policy to ${updated.notifyPolicy}.`));
}
/** Cancels a detached task run by lookup token. */
async function tasksCancelCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	const result = await tryCancelGatewayOwnedTaskViaGateway(task) ?? await cancelDetachedTaskRunById({
		cfg: getRuntimeConfig(),
		taskId: task.taskId
	});
	if (!result.found) {
		runtime.error(sanitizeTerminalText(result.reason ?? formatTaskLookupMiss(opts.lookup)));
		runtime.exit(1);
		return;
	}
	if (!result.cancelled) {
		runtime.error(sanitizeTerminalText(result.reason ?? `Could not cancel task: ${opts.lookup}`));
		runtime.exit(1);
		return;
	}
	const updated = result.task;
	runtime.log(sanitizeTerminalText(`Cancelled ${updated?.taskId ?? updated?.id ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`));
}
async function runTaskRecoveryCommand(action, lookups, runtime) {
	if (lookups.length > 10) {
		runtime.error("At most 10 task deliveries can be recovered per request.");
		runtime.exit(1);
		return;
	}
	const tasks = [];
	for (const lookup of lookups) {
		const task = reconcileTaskLookupToken(lookup);
		if (!task) {
			runtime.error(formatTaskLookupMiss(lookup));
			runtime.exit(1);
			return;
		}
		tasks.push(task);
	}
	try {
		const { callGateway } = await import("./call-bfuNQIMk.mjs");
		const failures = (await callGateway({
			method: `tasks.${action}`,
			params: { taskIds: tasks.map((task) => task.taskId) },
			timeoutMs: 1e4
		})).results?.filter((result) => result.ok !== true) ?? [];
		if (failures.length > 0) {
			for (const failure of failures) runtime.error(sanitizeTerminalText(`${failure.taskId ?? "task"}: ${failure.reason ?? `${action} failed`}`));
			runtime.exit(1);
			return;
		}
		runtime.log(sanitizeTerminalText(`${action === "retry" ? "Retried" : "Dismissed"} ${tasks.length} ${tasks.length === 1 ? "completion delivery" : "completion deliveries"}.${action === "retry" ? " Ambiguous prior acknowledgements may still produce a duplicate visible result." : ""}`));
	} catch (error) {
		rethrowExpectedCliError(error);
		runtime.error(sanitizeTerminalText(`Task delivery ${action} requires a live Gateway: ${error instanceof Error ? error.message : String(error)}`));
		runtime.exit(1);
	}
}
/** Starts a new fenced delivery generation for one to ten blocked completions. */
async function tasksRetryCommand(opts, runtime) {
	await runTaskRecoveryCommand("retry", opts.lookups, runtime);
}
/** Records intentional non-delivery while preserving the task result and audit projection. */
async function tasksDismissCommand(opts, runtime) {
	await runTaskRecoveryCommand("dismiss", opts.lookups, runtime);
}
/** Prints or serializes combined task/task-flow audit findings. */
async function tasksAuditCommand(opts, runtime) {
	const severityFilter = parseCliEnumFilter(opts.severity, "--severity", TASK_SYSTEM_AUDIT_SEVERITIES);
	const codeFilter = parseCliEnumFilter(opts.code, "--code", TASK_SYSTEM_AUDIT_CODES);
	configureTaskMaintenanceFromConfig();
	const auditResult = toSystemAuditFindings({
		severityFilter,
		codeFilter
	});
	const { filteredFindings, summary } = auditResult;
	const limit = typeof opts.limit === "number" && opts.limit > 0 ? opts.limit : void 0;
	const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;
	if (opts.json) {
		writeRuntimeJson(runtime, buildTaskSystemAuditJsonPayload(auditResult, {
			severityFilter,
			codeFilter,
			limit: opts.limit
		}));
		return;
	}
	runtime.log(info(`Tasks audit: ${summary.total} findings · ${summary.errors} errors · ${summary.warnings} warnings`));
	if (severityFilter || codeFilter) runtime.log(info(`Showing ${filteredFindings.length} matching findings.`));
	if (severityFilter) runtime.log(info(`Severity filter: ${sanitizeTerminalText(severityFilter)}`));
	if (codeFilter) runtime.log(info(`Code filter: ${sanitizeTerminalText(codeFilter)}`));
	if (limit) runtime.log(info(`Limit: ${limit}`));
	runtime.log(info(`Task findings: ${summary.tasks.total} · TaskFlow findings: ${summary.taskFlows.total}`));
	if (displayed.length === 0) {
		runtime.log("No tasks audit findings.");
		return;
	}
	const rich = isRich();
	for (const line of formatAuditRows(displayed, rich)) runtime.log(line);
}
/** Previews or applies task, task-flow, and backing session-registry maintenance. */
async function tasksMaintenanceCommand(opts, runtime) {
	configureTaskMaintenanceFromConfig();
	assertTaskFlowRegistryMaintenanceReady();
	const auditBefore = getInspectableTaskAuditSummary();
	const flowAuditBefore = getInspectableTaskFlowAuditSummary();
	const taskMaintenance = opts.apply ? await runTaskRegistryMaintenance() : previewTaskRegistryMaintenance();
	const diagnostics = opts.json ? getTaskRegistryMaintenanceDiagnostics() : void 0;
	const flowMaintenance = opts.apply ? await runTaskFlowRegistryMaintenance() : previewTaskFlowRegistryMaintenance();
	const sessionMaintenance = await runSessionRegistryMaintenance({ apply: Boolean(opts.apply) });
	const summary = getInspectableTaskRegistrySummary();
	const auditAfter = opts.apply ? getInspectableTaskAuditSummary() : auditBefore;
	const flowAuditAfter = opts.apply ? getInspectableTaskFlowAuditSummary() : flowAuditBefore;
	const retainedLostAfter = summarizeRetainedLostTaskAuditFindings(listTaskAuditFindings({ tasks: reconcileInspectableTasks() }));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			mode: opts.apply ? "apply" : "preview",
			maintenance: {
				tasks: taskMaintenance,
				taskFlows: flowMaintenance,
				sessions: sessionMaintenance
			},
			tasks: summary,
			diagnostics,
			auditBefore: {
				...auditBefore,
				taskFlows: flowAuditBefore
			},
			auditAfter: {
				...auditAfter,
				taskFlows: flowAuditAfter
			}
		});
		return;
	}
	runtime.log(info(`Tasks maintenance (${opts.apply ? "applied" : "preview"}): tasks ${taskMaintenance.reconciled} reconcile · ${taskMaintenance.recovered} recovered · ${taskMaintenance.cleanupStamped} cleanup stamp · ${taskMaintenance.pruned} prune; task-flows ${flowMaintenance.reconciled} reconcile · ${flowMaintenance.pruned} prune`));
	runtime.log(info(sessionMaintenance.skippedReason ? `Session registry: sweep skipped (${sessionMaintenance.skippedReason})` : `Session registry: ${sessionMaintenance.pruned} prune · ${sessionMaintenance.runningCronJobs} running automations · ${sessionMaintenance.skippedStores} skipped ${sessionMaintenance.skippedStores === 1 ? "store" : "stores"}`));
	runtime.log(info(`${opts.apply ? "Tasks health after apply" : "Tasks health"}: ${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${auditAfter.errors + flowAuditAfter.errors} audit errors · ${auditAfter.warnings + flowAuditAfter.warnings} audit warnings`));
	if (retainedLostAfter.count > 0) runtime.log(info(`Retained lost tasks: ${retainedLostAfter.count} retained until ${timestampMsToIsoString(retainedLostAfter.nextCleanupAfter) ?? "cleanupAfter"}; maintenance will prune after cleanupAfter.`));
	if (opts.apply) runtime.log(info(`Tasks health before apply: ${auditBefore.errors + flowAuditBefore.errors} audit errors · ${auditBefore.warnings + flowAuditBefore.warnings} audit warnings`));
	if (!opts.apply) runtime.log("Dry run only. Re-run with `openclaw tasks maintenance --apply` to write changes.");
}
//#endregion
export { tasksAuditCommand, tasksCancelCommand, tasksDismissCommand, tasksListCommand, tasksMaintenanceCommand, tasksNotifyCommand, tasksRetryCommand, tasksShowCommand };

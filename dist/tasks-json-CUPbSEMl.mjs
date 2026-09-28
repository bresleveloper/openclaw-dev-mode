import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { i as matchesTaskStatusFilter, n as TASK_STATUS_FILTERS, t as TASK_RUNTIMES } from "./task-registry.types-CkM1jc3D.mjs";
import { s as listTaskAuditFindings } from "./task-registry.summary-BJx95J9k.mjs";
import { s as listTaskRecords } from "./task-registry-query-Bd-H3o4L.mjs";
import "./runtime-internal-BF8pXknh.mjs";
import { t as listTaskFlowAuditFindings } from "./task-flow-registry.audit-BkBZ6jKS.mjs";
import { n as TASK_SYSTEM_AUDIT_SEVERITIES, t as TASK_SYSTEM_AUDIT_CODES } from "./task-system-audit.types-CkW3UjKV.mjs";
import { t as parseCliEnumFilter } from "./enum-filter-Bua3W8iv.mjs";
import { n as buildTaskSystemAuditJsonPayload, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-amZzLdx9.mjs";
//#region src/commands/tasks-json.ts
function toSystemAuditFindings(params) {
	const tasks = listTaskRecords();
	const taskFindings = listTaskAuditFindings({ tasks });
	const flowFindings = listTaskFlowAuditFindings();
	return buildTaskSystemAuditFindings({
		taskFindings,
		flowFindings,
		severityFilter: params.severityFilter,
		codeFilter: params.codeFilter
	});
}
function buildTasksListJsonPayload(opts) {
	const runtimeFilter = parseCliEnumFilter(opts.runtime, "--runtime", TASK_RUNTIMES);
	const statusFilter = parseCliEnumFilter(opts.status, "--status", TASK_STATUS_FILTERS);
	const tasks = listTaskRecords((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && !matchesTaskStatusFilter(task, statusFilter)) return false;
		return true;
	});
	return {
		count: tasks.length,
		runtime: runtimeFilter ?? null,
		status: statusFilter ?? null,
		tasks
	};
}
function buildTasksAuditJsonPayload(opts) {
	const severityFilter = parseCliEnumFilter(opts.severity, "--severity", TASK_SYSTEM_AUDIT_SEVERITIES);
	const codeFilter = parseCliEnumFilter(opts.code, "--code", TASK_SYSTEM_AUDIT_CODES);
	const result = toSystemAuditFindings({
		severityFilter,
		codeFilter
	});
	return buildTaskSystemAuditJsonPayload(result, {
		severityFilter,
		codeFilter,
		limit: opts.limit
	});
}
/** Writes task list JSON without triggering task maintenance. */
async function tasksListJsonCommand(opts, runtime) {
	writeRuntimeJson(runtime, buildTasksListJsonPayload(opts));
}
/** Writes task audit JSON with combined task/task-flow findings. */
async function tasksAuditJsonCommand(opts, runtime) {
	writeRuntimeJson(runtime, buildTasksAuditJsonPayload(opts));
}
//#endregion
export { tasksAuditJsonCommand, tasksListJsonCommand };

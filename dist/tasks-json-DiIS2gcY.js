import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { I as listTaskFlowRecords, f as listTaskRecords } from "./task-registry-Bv5-Vohd.js";
import "./runtime-internal-OiU0x_qm.js";
import { n as listTaskAuditFindings } from "./task-registry.audit-BEOrRfo1.js";
import { n as buildTaskSystemAuditJsonPayload, r as listTaskFlowAuditFindings, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-CiLUZwbU.js";
//#region src/commands/tasks-json.ts
function listTaskJsonRecords() {
	return listTaskRecords();
}
function toSystemAuditFindings(params) {
	const tasks = listTaskJsonRecords();
	const flows = listTaskFlowRecords();
	return buildTaskSystemAuditFindings({
		taskFindings: listTaskAuditFindings({ tasks }),
		flowFindings: listTaskFlowAuditFindings({ flows }),
		severityFilter: params.severityFilter,
		codeFilter: params.codeFilter
	});
}
function buildTasksListJsonPayload(opts) {
	const runtimeFilter = opts.runtime?.trim();
	const statusFilter = opts.status?.trim();
	const tasks = listTaskJsonRecords().filter((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && task.status !== statusFilter) return false;
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
	const severityFilter = opts.severity?.trim();
	const codeFilter = opts.code?.trim();
	return buildTaskSystemAuditJsonPayload(toSystemAuditFindings({
		severityFilter,
		codeFilter
	}), {
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

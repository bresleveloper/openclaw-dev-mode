import { l as summarizeTaskAuditFindings } from "./task-registry.summary-BJx95J9k.mjs";
import { r as compareTaskAuditFindingSortKeys } from "./task-registry.audit.shared-2IJPSTDV.mjs";
import { n as summarizeTaskFlowAuditFindings } from "./task-flow-registry.audit-BkBZ6jKS.mjs";
//#region src/commands/tasks-audit-system.ts
function compareSystemAuditFindings(left, right) {
	return compareTaskAuditFindingSortKeys({
		severity: left.severity,
		ageMs: left.ageMs,
		createdAt: left.task?.createdAt ?? left.flow?.createdAt ?? 0
	}, {
		severity: right.severity,
		ageMs: right.ageMs,
		createdAt: right.task?.createdAt ?? right.flow?.createdAt ?? 0
	});
}
/** Builds combined task/task-flow audit findings with optional severity/code filtering. */
function buildTaskSystemAuditFindings(params) {
	const allFindings = [...params.taskFindings.map((finding) => ({
		kind: "task",
		severity: finding.severity,
		code: finding.code,
		detail: finding.detail,
		ageMs: finding.ageMs,
		status: finding.task.status,
		token: finding.task.taskId,
		task: finding.task
	})), ...params.flowFindings.map((finding) => ({
		kind: "task_flow",
		severity: finding.severity,
		code: finding.code,
		detail: finding.detail,
		ageMs: finding.ageMs,
		status: finding.flow?.status ?? "n/a",
		token: finding.flow?.flowId,
		...finding.flow ? { flow: finding.flow } : {}
	}))];
	return {
		filteredFindings: allFindings.filter((finding) => {
			if (params.severityFilter && finding.severity !== params.severityFilter) return false;
			if (params.codeFilter && finding.code !== params.codeFilter) return false;
			return true;
		}).toSorted(compareSystemAuditFindings),
		summary: {
			total: allFindings.length,
			errors: allFindings.filter((finding) => finding.severity === "error").length,
			warnings: allFindings.filter((finding) => finding.severity !== "error").length,
			tasks: summarizeTaskAuditFindings(params.taskFindings),
			taskFlows: summarizeTaskFlowAuditFindings(params.flowFindings)
		}
	};
}
function buildTaskSystemAuditJsonPayload(result, params) {
	const { filteredFindings, summary } = result;
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : void 0;
	const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;
	return {
		count: summary.total,
		filteredCount: filteredFindings.length,
		displayed: displayed.length,
		filters: {
			severity: params.severityFilter ?? null,
			code: params.codeFilter ?? null,
			limit: limit ?? null
		},
		summary: {
			...summary.tasks,
			taskFlows: summary.taskFlows,
			combined: {
				total: summary.total,
				errors: summary.errors,
				warnings: summary.warnings
			}
		},
		findings: displayed
	};
}
//#endregion
export { buildTaskSystemAuditJsonPayload as n, buildTaskSystemAuditFindings as t };

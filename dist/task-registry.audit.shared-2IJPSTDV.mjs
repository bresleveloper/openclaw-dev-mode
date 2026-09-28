//#region src/tasks/task-registry.audit.shared.ts
/** Canonical task registry audit vocabulary. */
const TASK_AUDIT_SEVERITIES = ["warn", "error"];
const TASK_AUDIT_CODES = [
	"stale_queued",
	"stale_running",
	"lost",
	"delivery_failed",
	"missing_cleanup",
	"inconsistent_timestamps"
];
function createEmptyTaskAuditSummary() {
	return {
		total: 0,
		warnings: 0,
		errors: 0,
		byCode: {
			stale_queued: 0,
			stale_running: 0,
			lost: 0,
			delivery_failed: 0,
			missing_cleanup: 0,
			inconsistent_timestamps: 0
		}
	};
}
function summarizeAuditFindings(findings, summary) {
	for (const finding of findings) {
		summary.total += 1;
		summary.byCode[finding.code] += 1;
		if (finding.severity === "error") summary.errors += 1;
		else summary.warnings += 1;
	}
	return summary;
}
function compareTaskAuditFindingSortKeys(left, right) {
	const severityRank = (severity) => severity === "error" ? 0 : 1;
	const severityDiff = severityRank(left.severity) - severityRank(right.severity);
	if (severityDiff !== 0) return severityDiff;
	const leftAge = left.ageMs ?? -1;
	const rightAge = right.ageMs ?? -1;
	if (leftAge !== rightAge) return rightAge - leftAge;
	return left.createdAt - right.createdAt;
}
//#endregion
export { summarizeAuditFindings as a, createEmptyTaskAuditSummary as i, TASK_AUDIT_SEVERITIES as n, compareTaskAuditFindingSortKeys as r, TASK_AUDIT_CODES as t };

//#region src/flows/health-checks.ts
const HEALTH_FINDING_SEVERITY_RANK = {
	info: 0,
	warning: 1,
	error: 2
};
function parseHealthFindingSeverity(input) {
	if (input === "info" || input === "warning" || input === "error") return input;
	return null;
}
function healthFindingMeetsSeverity(finding, severityMin) {
	return HEALTH_FINDING_SEVERITY_RANK[finding.severity] >= HEALTH_FINDING_SEVERITY_RANK[severityMin];
}
/** Opt-in diagnostics stay out of routine lint and repair passes. */
function isHealthCheckEnabledByDefault(check) {
	return !("defaultEnabled" in check && check.defaultEnabled === false);
}
//#endregion
export { parseHealthFindingSeverity as i, healthFindingMeetsSeverity as n, isHealthCheckEnabledByDefault as r, HEALTH_FINDING_SEVERITY_RANK as t };

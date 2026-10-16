//#region src/flows/health-checks.ts
const HEALTH_FINDING_SEVERITY_RANK = {
	info: 0,
	warning: 1,
	error: 2
};
/** Parses CLI/config severity input into the closed health-finding severity set. */
function parseHealthFindingSeverity(input) {
	if (input === "info" || input === "warning" || input === "error") return input;
	return null;
}
/** Returns whether a finding meets the configured reporting threshold. */
function healthFindingMeetsSeverity(finding, severityMin) {
	return HEALTH_FINDING_SEVERITY_RANK[finding.severity] >= HEALTH_FINDING_SEVERITY_RANK[severityMin];
}
/** Opt-in diagnostics stay out of routine lint and repair passes. */
function isHealthCheckEnabledByDefault(check) {
	return !("defaultEnabled" in check && check.defaultEnabled === false);
}
//#endregion
export { parseHealthFindingSeverity as i, healthFindingMeetsSeverity as n, isHealthCheckEnabledByDefault as r, HEALTH_FINDING_SEVERITY_RANK as t };

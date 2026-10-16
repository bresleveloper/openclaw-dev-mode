import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { r as listHealthChecks } from "./health-check-registry-CBxbsDqv.mjs";
import { n as healthFindingMeetsSeverity, r as isHealthCheckEnabledByDefault, t as HEALTH_FINDING_SEVERITY_RANK } from "./health-checks-B3n_-tw2.mjs";
//#region src/flows/doctor-lint-flow.ts
/** Runs selected health checks in lint mode and returns sorted findings. */
async function runDoctorLintChecks(ctx, opts = {}) {
	const all = opts.checks ?? listHealthChecks();
	const skip = opts.skipIds instanceof Set ? opts.skipIds : new Set(opts.skipIds ?? []);
	const only = opts.onlyIds instanceof Set ? opts.onlyIds : new Set(opts.onlyIds ?? []);
	const allIds = new Set(all.map((check) => check.id));
	const includeDefaultDisabled = opts.includeAllChecks === true;
	const selected = all.filter((c) => {
		if (only.size > 0 && !only.has(c.id)) return false;
		if (only.size === 0 && !includeDefaultDisabled && !isHealthCheckEnabledByDefault(c)) return false;
		if (skip.has(c.id)) return false;
		return true;
	});
	const findings = [];
	for (const id of only) {
		let message;
		if (!allIds.has(id)) message = `Unknown health check id selected by --only: ${id}.`;
		else if (selected.length === 0 && skip.has(id)) message = `Health check ${id} cannot be selected by --only and excluded by --skip.`;
		else continue;
		findings.push({
			checkId: "core/doctor/lint-selection",
			severity: "error",
			message,
			path: id
		});
	}
	for (const check of selected) try {
		const out = await check.detect(ctx);
		for (const f of out) findings.push(f);
	} catch (err) {
		const aborted = err instanceof OpenClawStateLeaseAcquisitionError && err.outcome.kind === "aborted" ? err.outcome : void 0;
		findings.push({
			checkId: check.id,
			severity: aborted ? "info" : "error",
			...aborted ? { errorCode: "OPENCLAW_STATE_LEASE_ABORTED" } : {},
			message: aborted ? `state lease inspection not performed: aborted after ${aborted.elapsedMs} ms by the caller's signal` : `health check threw: ${scrubDoctorErrorMessage(err)}`
		});
	}
	findings.sort(compareFindings);
	return {
		findings,
		checksRun: selected.length,
		checksSkipped: all.length - selected.length
	};
}
/** Internal update gate selection; public Doctor lint remains selector-driven. */
function selectUpdateReadinessChecks(checks, phase) {
	return checks.filter((check) => "updateReadiness" in check && check.updateReadiness === phase);
}
function compareFindings(a, b) {
	const sevDelta = HEALTH_FINDING_SEVERITY_RANK[b.severity] - HEALTH_FINDING_SEVERITY_RANK[a.severity];
	if (sevDelta !== 0) return sevDelta;
	const idDelta = a.checkId.localeCompare(b.checkId);
	if (idDelta !== 0) return idDelta;
	return (a.path ?? "").localeCompare(b.path ?? "");
}
/** Converts findings to a process exit code using the requested minimum severity. */
function exitCodeFromFindings(findings, severityMin = "warning") {
	return findings.some((f) => healthFindingMeetsSeverity(f, severityMin)) ? 1 : 0;
}
//#endregion
export { runDoctorLintChecks as n, selectUpdateReadinessChecks as r, exitCodeFromFindings as t };

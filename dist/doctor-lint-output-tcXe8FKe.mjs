import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-BRvmoWQ9.mjs";
import { l as isUpdateDoctorLintPass } from "./update-phase-DiVB4MDN.mjs";
//#region src/commands/doctor-lint-output.ts
const DOCTOR_LINT_JSON_SCHEMA_VERSION = 1;
function formatJsonResult(result) {
	return {
		schemaVersion: DOCTOR_LINT_JSON_SCHEMA_VERSION,
		ok: result.ok,
		checksRun: result.checksRun,
		checksSkipped: result.checksSkipped,
		findings: result.findings.map(toJsonFinding),
		...result.warnings?.length ? { warnings: result.warnings.map(toJsonFinding) } : {}
	};
}
function writeJsonResult(result) {
	process.stdout.write(JSON.stringify(formatJsonResult(result)) + "\n");
	if (isUpdateDoctorLintPass(process.env)) for (const finding of [...result.warnings ?? [], ...result.findings].toSorted((a, b) => Number(a.severity === "error") - Number(b.severity === "error"))) process.stderr.write(`${formatUpdateDoctorLintFinding(finding)}\n`);
}
/** Shipped updaters parse failed lint output too; retain its readiness envelope. */
function formatDoctorLintFailure(error) {
	const failure = formatCliJsonFailure(error);
	return {
		...failure,
		...formatJsonResult({
			ok: false,
			checksRun: 0,
			checksSkipped: 0,
			findings: [{
				checkId: "core/doctor/lint-inspection",
				severity: "error",
				source: "doctor",
				message: failure.error.message,
				fixHint: "Resolve this inspection error, then rerun `openclaw doctor --lint`."
			}]
		})
	};
}
function toJsonFinding(f) {
	return {
		checkId: f.checkId,
		severity: f.severity,
		message: f.message,
		...f.source !== void 0 ? { source: f.source } : {},
		...f.errorCode !== void 0 ? { errorCode: f.errorCode } : {},
		...f.path !== void 0 ? { path: f.path } : {},
		...f.line !== void 0 ? { line: f.line } : {},
		...f.column !== void 0 ? { column: f.column } : {},
		...f.ocPath !== void 0 ? { ocPath: f.ocPath } : {},
		...f.target !== void 0 ? { target: f.target } : {},
		...f.requirement !== void 0 ? { requirement: f.requirement } : {},
		...f.fixHint !== void 0 ? { fixHint: f.fixHint } : {}
	};
}
//#endregion
export { writeJsonResult as n, formatDoctorLintFailure as t };

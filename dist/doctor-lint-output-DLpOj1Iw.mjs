import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { u as isUpdateDoctorLintPass } from "./update-phase-BClSJ17n.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-kv_-CSRP.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { n as healthFindingMeetsSeverity } from "./health-checks-B3n_-tw2.mjs";
import { t as exitCodeFromFindings } from "./doctor-lint-flow-CEtrAUUS.mjs";
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
function detectDoctorLintOutputMode(opts) {
	if (opts.json === true) return "json";
	return process.stdout.isTTY ? "human" : "json";
}
function createStateSnapshotFailureFinding(error) {
	return {
		checkId: "core/doctor/lint-state-inspection",
		severity: "error",
		source: "doctor",
		target: "plugin-state",
		requirement: "read-only-plugin-state-inspection",
		message: `Doctor lint could not inspect plugin state without mutating the live state database (${scrubDoctorErrorMessage(error.cause ?? error)}).`,
		fixHint: "Keep the current Gateway running, resolve the state database inspection error, then rerun this check."
	};
}
async function createStateSnapshotFailureExecution(runtime, opts, sevMin, error, completed) {
	const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-xzLvoswX.mjs");
	const failures = [createStateSnapshotFailureFinding(error), ...completed ? [] : await collectNodeRuntimeFindings()].filter((entry) => healthFindingMeetsSeverity(entry, sevMin));
	const visible = [...completed?.findings ?? [], ...failures];
	const checksRun = completed?.checksRun ?? 0;
	const checksSkipped = completed?.checksSkipped ?? 0;
	return {
		checksRun,
		checksSkipped,
		exitCode: exitCodeFromFindings(visible, sevMin),
		findings: visible,
		cleanupWarnings: completed?.cleanupWarnings,
		warnings: completed?.warnings,
		writeOutput() {
			if (detectDoctorLintOutputMode(opts) === "json") {
				writeJsonResult({
					ok: false,
					checksRun,
					checksSkipped,
					findings: visible,
					warnings: [...completed?.warnings ?? [], ...completed?.cleanupWarnings ?? []]
				});
				return;
			}
			completed?.writeOutput();
			for (const entry of failures) {
				runtime.error(`doctor --lint: ${entry.message}`);
				if (entry.fixHint) runtime.error(`fix: ${entry.fixHint}`);
			}
		}
	};
}
//#endregion
export { writeJsonResult as a, formatDoctorLintFailure as i, createStateSnapshotFailureFinding as n, detectDoctorLintOutputMode as r, createStateSnapshotFailureExecution as t };

import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { a as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-THF-vx3i.mjs";
//#region src/infra/update-doctor-lint-schema.ts
const UpdateDoctorLintFindingSchema = object({
	checkId: string().refine((value) => value.trim().length > 0),
	message: string(),
	source: string().optional(),
	errorCode: string().optional(),
	fixHint: string().optional(),
	severity: string().optional(),
	path: string().optional(),
	requirement: string().optional()
});
//#endregion
//#region src/infra/update-doctor-lint.ts
const UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX = "[warning] Doctor disposal";
const UpdateDoctorLintReportSchema = object({
	ok: boolean(),
	checksRun: number().nonnegative().refine(Number.isInteger),
	findings: array(UpdateDoctorLintFindingSchema),
	warnings: array(UpdateDoctorLintFindingSchema.extend({ severity: literal("warning") })).optional()
});
function normalizeFinding(finding, env) {
	const safe = UpdateDoctorLintFindingSchema.parse(finding);
	const context = {
		env,
		stateDir: resolveStateDir(env)
	};
	for (const [key, limit] of [
		["checkId", 128],
		["message", 500],
		["source", 128],
		["errorCode", 80],
		["fixHint", 500],
		["severity", 16],
		["path", 128],
		["requirement", 200]
	]) {
		const value = safe[key];
		if (value !== void 0) safe[key] = redactSupportDiagnosticLine(value.replace(/[\r\n\u2028\u2029]+/gu, "; "), context, limit);
	}
	return safe;
}
function normalizeUpdateDoctorLintFindings(findings, env = process.env) {
	return findings.map((finding) => normalizeFinding(finding, env));
}
function formatUpdateDoctorLintFinding(finding, env = process.env) {
	const safe = normalizeFinding(finding, env);
	return truncateUtf16Safe(`Doctor lint ${safe.severity ?? "error"} [${safe.checkId}]: ${[
		safe.requirement,
		safe.message,
		safe.fixHint
	].filter(Boolean).join(": ")}`, 500);
}
function parseUpdateDoctorLintReport(stdout, env = process.env) {
	const validated = UpdateDoctorLintReportSchema.safeParse(JSON.parse(stdout));
	if (!validated.success) throw new Error("Updated Doctor returned an invalid readiness result.");
	const result = validated.data;
	if (result.ok && result.findings.length) throw new Error("Updated Doctor returned findings with a successful readiness result.");
	const policy = result.findings.filter((finding) => finding.checkId === "core/doctor/security" && finding.severity === "error");
	const findings = result.findings.filter((finding) => !policy.includes(finding));
	const warnings = [...policy.map((finding) => ({
		...finding,
		severity: "warning"
	})), ...result.warnings ?? []];
	return {
		ok: result.ok,
		checksRun: result.checksRun,
		findings,
		warnings,
		doctorLintFindings: normalizeUpdateDoctorLintFindings([...findings, ...warnings], env),
		advisoryOnly: !result.ok && policy.length > 0 && findings.every((finding) => finding.severity === "warning" || finding.severity === "info"),
		failureFacts: normalizeUpdateFailureFacts(findings.filter((finding) => finding.severity === "error" || finding.severity === void 0).map((finding) => ({
			check: finding.checkId,
			code: "doctor-failed",
			message: [finding.requirement, finding.message].filter(Boolean).join(": "),
			affectedKey: finding.path
		})), env)
	};
}
function applyUpdateDoctorLintReport(step, stdout, code, env) {
	if (code === 0 && step.outputLimitExceeded) throw new Error("Update health check output exceeded the inspection limit");
	let report;
	if (!step.outputLimitExceeded) try {
		report = parseUpdateDoctorLintReport(stdout, env);
	} catch (error) {
		if (code === 0) throw error;
	}
	if (code === 1 && step.termination === "exit" && !step.signal && !step.killed && report?.advisoryOnly) step.advisory = {
		kind: "recoverable-maintenance",
		message: "Doctor security policy findings are advisory during updates."
	};
	step.doctorLintFindings = report?.doctorLintFindings ?? [];
	const warnings = step.doctorLintFindings.filter((finding) => finding.severity === "warning").map((finding) => formatUpdateDoctorLintFinding(finding, env));
	if (warnings.length) step.warnings = warnings;
	return report;
}
//#endregion
export { parseUpdateDoctorLintReport as a, normalizeUpdateDoctorLintFindings as i, applyUpdateDoctorLintReport as n, UpdateDoctorLintFindingSchema as o, formatUpdateDoctorLintFinding as r, UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX as t };

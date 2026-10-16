import "./update-doctor-result-yVslo54h.mjs";
import { f as recordUpdateRunStep } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as getUpdateRun, n as findActiveUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
//#region src/infra/update-deferred-model-retirement.ts
const RETIREMENT_STEP = "finalize:doctor:model-retirement";
function resolveDoctorUpdateRun(env) {
	const runId = env[UPDATE_RUN_ID_ENV]?.trim();
	const run = runId ? getUpdateRun(runId, { env }) : env["OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH"]?.trim() ? findActiveUpdateRun({ env }) : void 0;
	return run?.status === "running" ? run : void 0;
}
function hasDeferredUpdateModelRetirement(env = process.env) {
	return resolveDoctorUpdateRun(env)?.steps.some((step) => step.step === RETIREMENT_STEP && step.status === "skipped") ?? false;
}
/** Completion is published by Doctor only after its repaired config is durable. */
function recordUpdateModelRetirement(status, env = process.env) {
	const run = resolveDoctorUpdateRun(env);
	if (!run || status === "completed" && !run.steps.some((step) => step.step === RETIREMENT_STEP && step.status === "skipped")) return;
	const detail = status === "deferred" ? "Model retirement repair deferred until plugin convergence." : "Deferred model retirement repair completed after plugin convergence.";
	recordUpdateRunStep(run.runId, {
		step: RETIREMENT_STEP,
		status: status === "deferred" ? "skipped" : "completed",
		endedAtMs: Date.now(),
		detail
	}, { env });
	recordUpdateRunStep(run.runId, {
		step: `warning:${RETIREMENT_STEP}${status === "deferred" ? ":deferred" : ""}`,
		status: "completed",
		detail
	}, { env });
}
//#endregion
export { recordUpdateModelRetirement as n, hasDeferredUpdateModelRetirement as t };

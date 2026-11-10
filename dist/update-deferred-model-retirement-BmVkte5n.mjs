import "./update-doctor-result-oZ38327j.mjs";
import { f as recordUpdateRunStep } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun, n as findActiveUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import "./update-control-plane-sentinel-BOyIUo0V.mjs";
//#region src/infra/update-deferred-model-retirement.ts
const RETIREMENT_STEP = "finalize:doctor:model-retirement";
function resolveDoctorUpdateRun(env, runId = env["OPENCLAW_UPDATE_RUN_ID"]?.trim() || void 0) {
	const run = runId !== void 0 ? getUpdateRun(runId, { env }) : env["OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH"]?.trim() ? findActiveUpdateRun({ env }) : void 0;
	return run?.status === "running" ? run : void 0;
}
function hasDeferredUpdateModelRetirement(env = process.env, runId) {
	return resolveDoctorUpdateRun(env, runId)?.steps.some((step) => step.step === RETIREMENT_STEP && step.status === "skipped") ?? false;
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

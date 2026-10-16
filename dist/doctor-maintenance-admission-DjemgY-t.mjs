import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { r as inspectUpdateRepairDriverAdmission } from "./update-run-activity-CykyDahG.mjs";
import { d as recordUpdateRunRepairContinuation } from "./update-run-ledger-jBhhLo0P.mjs";
import { t as createUpdateRunAdmissionReader } from "./update-run-reader-B7x8dkVs.mjs";
import "./update-control-plane-sentinel-Du9790-7.mjs";
//#region src/commands/doctor-maintenance-admission.ts
function resolveDoctorUpdateAdmission(env, boundRunId) {
	const inheritedRunId = (boundRunId ?? env["OPENCLAW_UPDATE_RUN_ID"])?.trim();
	const readRuns = createUpdateRunAdmissionReader({
		active: true,
		limit: 100,
		includeRunId: inheritedRunId
	}, { env }, openDoctorStateSchemaReadAdmission);
	const readAdmission = () => {
		const runs = readRuns();
		const admission = inspectUpdateRepairDriverAdmission(runs, inheritedRunId);
		if (admission.kind === "conflict") throw new Error(admission.message);
		return admission;
	};
	const admission = readAdmission();
	const continuation = admission.kind === "continuation" ? admission.run : admission.runs.find((run) => run.runId === inheritedRunId);
	return {
		assertCurrent: () => {
			readAdmission();
		},
		readContinuation: () => {
			const current = readAdmission();
			return current.kind === "continuation" ? current.run : void 0;
		},
		recordContinuation: () => {
			const current = readAdmission();
			if (continuation?.steps.some((step) => step.step === "finalize:repair-continuation")) {
				const run = current.kind === "continuation" ? current.run : current.runs.find((entry) => entry.runId === continuation.runId);
				const step = current.kind === "continuation" ? "finalize:repair-continuation" : "finalize:repair-takeover";
				if (run?.steps.some((entry) => entry.step === step)) return;
				recordUpdateRunRepairContinuation(continuation.runId, inheritedRunId, { env });
			}
		}
	};
}
//#endregion
export { resolveDoctorUpdateAdmission as t };

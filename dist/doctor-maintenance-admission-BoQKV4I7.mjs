import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { r as inspectUpdateRepairDriverAdmission } from "./update-run-activity-B_OeQT4u.mjs";
import { d as recordUpdateRunRepairContinuation } from "./update-run-ledger-C3oL-g8r.mjs";
import { t as createUpdateRunAdmissionReader } from "./update-run-reader-BOC3s3Sk.mjs";
import "./update-control-plane-sentinel-BOyIUo0V.mjs";
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
		if (admission.kind === "conflict") {
			if (admission.reason === "ancestry-unverified") throw new DoctorMaintenanceRefusalError(admission.message, {
				kind: "deferred",
				reason: "admission-unavailable"
			});
			throw new Error(admission.message);
		}
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

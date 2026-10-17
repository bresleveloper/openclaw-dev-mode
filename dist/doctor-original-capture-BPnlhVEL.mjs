import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-k0LVIIq0.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import "./update-control-plane-sentinel-Du9790-7.mjs";
import { t as resolveDoctorUpdateAdmission } from "./doctor-maintenance-admission-DjemgY-t.mjs";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-original-capture.ts
/** Preserve evidence before repair; neither a capture nor its lineage authorizes restoration. */
async function preserveDoctorOriginalState(params) {
	const original = params.writeAuthority?.originalRecoveryCapture;
	const runId = original?.runId ?? params.env["OPENCLAW_UPDATE_RUN_ID"]?.trim();
	const updateInProgress = original !== void 0 || params.env.OPENCLAW_UPDATE_IN_PROGRESS === "1";
	const assertCallerCurrent = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
		params.writeAuthority?.assertCurrent();
	};
	assertCallerCurrent();
	if (updateInProgress && !runId) {
		params.runtime.log("Original update capture is unavailable. Doctor will repair current state without replacing the retained originals.");
		return;
	}
	let admission;
	const assertCurrent = () => {
		assertCallerCurrent();
		admission?.assertCurrent();
	};
	try {
		admission = updateInProgress ? resolveDoctorUpdateAdmission(params.env, original?.runId) : void 0;
		if (admission && runId) {
			const { readUpdateRecoveryBaselineIdentity } = await import("./update-recovery-backup-reader-DmbzNQQW.mjs");
			assertCurrent();
			const retained = await readUpdateRecoveryBaselineIdentity({
				runId,
				env: params.env,
				...original ? {
					ref: original.ref,
					installRoot: original.installRoot
				} : {},
				readContinuation: admission.readContinuation,
				assertCurrent
			});
			assertCurrent();
			params.runtime.log(retained ? `Original update capture retained at ${retained.ref.manifestPath}.` : "Original update capture is unavailable. Doctor will repair current state without replacing the retained originals.");
			return;
		}
		const installRoot = params.root;
		if (!installRoot) throw new Error("The installation could not be identified for the pre-repair capture.");
		const driver = readUpdateRunDriver();
		if (!driver) throw new Error("The Doctor process could not be identified for the pre-repair capture.");
		const { captureUpdateRecoveryBaseline, retireExpiredStandaloneDoctorCaptures } = await import("./update-recovery-baseline-capture-CIXPzP5x.mjs");
		assertCurrent();
		const standaloneRunId = `doctor-${randomUUID()}`;
		const captured = await captureUpdateRecoveryBaseline({
			runId: standaloneRunId,
			installRoot,
			env: params.env,
			drivers: [driver],
			assertCurrent,
			signal: params.signal,
			acquisition: { mode: "maintenance-owner" }
		});
		assertCurrent();
		params.runtime.log(`Pre-repair state retained for manual recovery at ${captured.ref.manifestPath}.`);
		try {
			const retirement = await retireExpiredStandaloneDoctorCaptures({
				stateDir: resolvePathViaExistingAncestorSync(resolveStateDir(params.env)),
				keepRunId: standaloneRunId,
				assertCurrent
			});
			for (const directory of retirement.retired) params.runtime.log(`Retired standalone Doctor capture older than 30 days: ${directory}. Take a verified backup before an upgrade when you need a long-term recovery copy.`);
			for (const warning of retirement.warnings) params.runtime.log(warning);
		} catch (error) {
			params.runtime.log(`Standalone Doctor capture retirement unavailable: ${formatErrorMessage(error)}`);
		}
		for (const warning of captured.warnings) params.runtime.log(warning.message);
		for (const warning of captured.diagnostics.databaseWarnings) params.runtime.log(warning);
	} catch (error) {
		assertCurrent();
		if (hasCommandProcessCleanupError(error)) throw error;
		if (original?.ref) throw new DoctorMaintenanceRefusalError(`Doctor cannot verify its admitted original update capture: ${formatErrorMessage(error)}. State repair has not started. Inspect retained evidence with openclaw update status --json before retrying Doctor.`, {
			kind: "data-at-risk",
			reason: "unreadable-state"
		}, { cause: error });
		params.runtime.log(`Original state capture was unavailable: ${formatErrorMessage(error)}. Doctor will continue; inspect retained evidence manually before restoring state.`);
	}
}
//#endregion
export { preserveDoctorOriginalState };

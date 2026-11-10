import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-CPVdsIOp.mjs";
import "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { r as resolveUpdateCaptureRoot } from "./update-capture-paths-KB4ru3JI.mjs";
import { t as resolveDoctorUpdateAdmission } from "./doctor-maintenance-admission-BoQKV4I7.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/commands/doctor-original-capture.ts
const IMAGE_ACTIVATION_MARKER_ENV = "OPENCLAW_IMAGE_ACTIVATION_CAPTURE_MARKER";
const STANDALONE_CAPTURE_RUN_ID = /^doctor-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const ORIGINAL_CAPTURE_TIMEOUT_MS = 6e5;
/** A marker counts only while the sealed capture it names is still retained. */
async function readImageActivationCapture(marker, captureRoot) {
	try {
		const stat = await fs.lstat(marker);
		if (!stat.isFile() || process.getuid !== void 0 && stat.uid !== process.getuid()) return;
		const runId = (await fs.readFile(marker, "utf8")).trim();
		if (!STANDALONE_CAPTURE_RUN_ID.test(runId)) return;
		return (await fs.lstat(path.join(captureRoot, runId, "manifest.json"))).isFile() ? runId : void 0;
	} catch {
		return;
	}
}
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
			const { readUpdateRecoveryBaselineIdentity } = await import("./update-recovery-backup-reader-C7pk2Gm6.mjs");
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
		const { captureUpdateRecoveryBaseline, retireExpiredStandaloneDoctorCaptures } = await import("./update-recovery-baseline-capture-CQviHFig.mjs");
		const stateDir = resolvePathViaExistingAncestorSync(resolveStateDir(params.env));
		const retireExpiredCaptures = async (keepRunId) => {
			try {
				const retirement = await retireExpiredStandaloneDoctorCaptures({
					stateDir,
					keepRunId,
					assertCurrent
				});
				for (const directory of retirement.retired) params.runtime.log(`Retired standalone Doctor capture older than 30 days: ${directory}. Take a verified backup before an upgrade when you need a long-term recovery copy.`);
				for (const warning of retirement.warnings) params.runtime.log(warning);
			} catch (error) {
				params.runtime.log(`Standalone Doctor capture retirement unavailable: ${formatErrorMessage(error)}`);
			}
		};
		const activationMarker = params.env[IMAGE_ACTIVATION_MARKER_ENV]?.trim() || void 0;
		const activationCapture = activationMarker ? await readImageActivationCapture(activationMarker, resolveUpdateCaptureRoot(stateDir)) : void 0;
		if (activationCapture) {
			assertCurrent();
			params.runtime.log(`This container already retained a pre-repair capture (${activationCapture}); Doctor skipped a repeated full capture. Repair-specific backups still apply.`);
			await retireExpiredCaptures(activationCapture);
			return;
		}
		const installRoot = params.root;
		if (!installRoot) throw new Error("The installation could not be identified for the pre-repair capture.");
		const driver = readUpdateRunDriver();
		if (!driver) throw new Error("The Doctor process could not be identified for the pre-repair capture.");
		assertCurrent();
		const standaloneRunId = `doctor-${randomUUID()}`;
		const controller = new AbortController();
		const deadline = performance.now() + ORIGINAL_CAPTURE_TIMEOUT_MS;
		const timeout = /* @__PURE__ */ new Error("Original-state capture timed out after 600 s");
		const timer = setTimeout(() => controller.abort(timeout), ORIGINAL_CAPTURE_TIMEOUT_MS);
		timer.unref();
		let captured;
		try {
			const assertCaptureCurrent = () => {
				if (performance.now() >= deadline) controller.abort(timeout);
				controller.signal.throwIfAborted();
				assertCurrent();
			};
			captured = await captureUpdateRecoveryBaseline({
				runId: standaloneRunId,
				installRoot,
				env: params.env,
				drivers: [driver],
				assertCurrent: assertCaptureCurrent,
				signal: AbortSignal.any([params.signal, controller.signal]),
				acquisition: { mode: "maintenance-owner" }
			});
			assertCaptureCurrent();
		} finally {
			clearTimeout(timer);
		}
		params.runtime.log(`Pre-repair state retained for manual recovery at ${captured.ref.manifestPath}.`);
		if (activationMarker) try {
			await fs.rm(activationMarker, { force: true });
			await fs.writeFile(activationMarker, standaloneRunId, {
				flag: "wx",
				mode: 384
			});
		} catch (error) {
			params.runtime.log(`Container activation marker unavailable: ${formatErrorMessage(error)}. The next container start takes another full capture.`);
		}
		await retireExpiredCaptures(standaloneRunId);
		for (const warning of captured.warnings) params.runtime.log(warning.message);
		for (const warning of captured.diagnostics.databaseWarnings) params.runtime.log(warning);
	} catch (error) {
		assertCurrent();
		if (hasCommandProcessCleanupError(error) || error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred") throw error;
		if (original?.ref) throw new DoctorMaintenanceRefusalError(`Doctor cannot verify its admitted original update capture: ${formatErrorMessage(error)}. State repair has not started. Inspect retained evidence with openclaw update status --json before retrying Doctor.`, {
			kind: "data-at-risk",
			reason: "unreadable-state"
		}, { cause: error });
		params.runtime.log(`Original state capture was unavailable: ${formatErrorMessage(error)}. Doctor will continue; take a verified backup and run openclaw doctor --fix after resolving the capture failure. Inspect retained evidence manually before restoring state.`);
	}
}
//#endregion
export { preserveDoctorOriginalState };

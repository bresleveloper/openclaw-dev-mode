import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { g as retainGatewayRootWorkAdmissionContinuation, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { r as SetupTargetLockedError, u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-LPO-VgcK.mjs";
//#region src/gateway/server-methods/setup-admission.ts
const SETUP_ADMISSION_BUSY_MESSAGE = "OpenClaw setup is already in progress; try again when it finishes.";
let wizardSessionInProgress = false;
const wizardSessionAdmissionSettlements = /* @__PURE__ */ new WeakMap();
var SetupAdmissionBusyError = class extends Error {};
/** Only admission failures may promise that no setup task or session began. */
function respondSetupAdmissionBusy(respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, SETUP_ADMISSION_BUSY_MESSAGE, {
		retryable: true,
		details: { code: GatewayErrorDetailCodes.SETUP_ADMISSION_BUSY }
	}));
}
async function runExclusiveSystemAgentSetupActivation(task) {
	let admitted = false;
	const admittedTask = async () => {
		admitted = true;
		return await task();
	};
	try {
		return await withSetupMigrationTargetLock(resolveStateDir(), admittedTask);
	} catch (error) {
		if (!admitted && error instanceof SetupTargetLockedError) throw new SetupAdmissionBusyError(SETUP_ADMISSION_BUSY_MESSAGE);
		throw error;
	}
}
/** Resolves after both the wizard runner and its setup-target admission have settled. */
function whenAdmittedWizardSessionSettled(session) {
	return wizardSessionAdmissionSettlements.get(session) ?? session.whenSettled();
}
async function createAdmittedWizardSession(createSession, lockSetupTarget = true) {
	if (wizardSessionInProgress) return;
	wizardSessionInProgress = true;
	const gatewaySignal = getAsyncWorkSignal();
	const drainSignal = getGatewayRestartDrainSignal();
	const signal = gatewaySignal ? AbortSignal.any([gatewaySignal, drainSignal]) : drainSignal;
	let removeCloseListener;
	let releaseGatewayWork = null;
	const releaseSession = () => {
		removeCloseListener?.();
		releaseGatewayWork?.();
		wizardSessionInProgress = false;
	};
	try {
		const create = () => {
			signal.throwIfAborted();
			const session = createSession();
			const close = () => session.close(new Error("Gateway is shutting down; restart it before continuing setup.", { cause: signal.reason }));
			signal.addEventListener("abort", close, { once: true });
			removeCloseListener = () => signal.removeEventListener("abort", close);
			if (signal.aborted) close();
			return session;
		};
		let admissionSettled;
		const session = lockSetupTarget ? await new Promise((resolve, reject) => {
			admissionSettled = runExclusiveSystemAgentSetupActivation(async () => {
				const createdSession = create();
				resolve(createdSession);
				await createdSession.whenSettled();
			});
			admissionSettled.catch(reject);
		}) : create();
		const settled = trackAsyncWork(() => admissionSettled ?? session.whenSettled());
		wizardSessionAdmissionSettlements.set(session, settled);
		releaseGatewayWork = retainGatewayRootWorkAdmissionContinuation();
		settled.then(releaseSession, releaseSession);
		return session;
	} catch (error) {
		releaseSession();
		if (error instanceof SetupAdmissionBusyError) return;
		throw error;
	}
}
//#endregion
export { whenAdmittedWizardSessionSettled as a, runExclusiveSystemAgentSetupActivation as i, createAdmittedWizardSession as n, respondSetupAdmissionBusy as r, SetupAdmissionBusyError as t };

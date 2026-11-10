import { r as getAsyncWorkSignal, s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { l as getGatewayRestartDrainSignal, y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as SetupTargetLockedError, u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-OtGPlLWE.mjs";
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
	try {
		return await withSetupMigrationTargetLock(resolveStateDir(), async () => {
			admitted = true;
			return await task();
		});
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

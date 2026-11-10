import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { A as tryBeginGatewayIndependentRootWorkAdmission, f as isGatewayRestartDrainError, l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
//#region src/gateway/server-idle-task.ts
/** Runs low-priority work while idle, optionally repeating after completed passes. */
function scheduleGatewayIdleTask(params) {
	const scheduler = params.scheduler.scope();
	const isClosing = () => scheduler.signal.aborted || params.isClosing() || getGatewayRestartDrainSignal().aborted;
	const schedule = (delayMs) => {
		if (isClosing()) return;
		scheduler.schedule({
			id: params.id,
			delayMs,
			run: async () => {
				if (params.waitForReady) await racePromiseWithAbortSignal(params.waitForReady(), scheduler.signal).catch((error) => {
					if (!scheduler.signal.aborted) throw error;
				});
				if (isClosing()) return;
				const admission = params.isBusy() ? null : tryBeginGatewayIndependentRootWorkAdmission("idle-task");
				if (!admission) {
					schedule(params.retryDelayMs);
					return;
				}
				return admission.run(() => params.run(AbortSignal.any([scheduler.signal, getGatewayRestartDrainSignal()]))).then(() => {
					if (params.repeatDelayMs !== void 0) schedule(params.repeatDelayMs);
				}).catch((error) => {
					if (!isGatewayRestartDrainError(error) && !(scheduler.signal.aborted && isAbortError(error))) params.log.warn(`${params.errorMessage}: ${String(error)}`);
				}).finally(() => {
					admission.release();
				});
			}
		});
	};
	schedule(params.delayMs);
	return { stop: scheduler.stop };
}
//#endregion
export { scheduleGatewayIdleTask as t };

import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { o as TICK_INTERVAL_MS } from "./server-constants-B-cmoH_0.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-ByD9hEIN.mjs";
import { n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-CGb0a8nw.mjs";
//#region src/commands/doctor-maintenance-foreground.ts
async function acquireDoctorGatewayMaintenanceOwner(databasePath, env, params) {
	const updateRepair = isDoctorUpdateRepairMode(resolveDoctorRepairMode(params.options));
	const assertCurrent = () => {
		params.assertCurrent?.();
		params.assertAdmission?.();
	};
	let waiting = false;
	return await acquireWithWait({
		acquire: async () => {
			try {
				const owner = await acquireGatewayLock({
					env,
					role: "sqlite-maintenance",
					allowInTests: true,
					lifecycleDeadlineMs: params.deadlineMs,
					assertCurrent,
					onWait: params.runtime.log
				});
				if (!owner) throw new Error(`Doctor could not acquire maintenance ownership for ${databasePath}`);
				return owner;
			} catch (error) {
				if (error instanceof GatewayLockError && error.cause instanceof GatewayStateOwnerContentionError) throw error.cause;
				throw error;
			}
		},
		shouldRetry: (error) => {
			if (!updateRepair || !params.assertCurrent || !(error instanceof GatewayStateOwnerContentionError)) return false;
			assertCurrent();
			if (!waiting) {
				waiting = true;
				params.runtime.log("Waiting for the previous foreground Gateway to release state.");
			}
			return true;
		},
		deadlineMs: Math.min(params.deadlineMs ?? Infinity, performance.now() + TICK_INTERVAL_MS + resolveGatewayRestartDeferralTimeoutMs() + GATEWAY_SERVICE_STOP_TIMEOUT_MS),
		pollIntervalMs: 100,
		maxPollIntervalMs: 1e3,
		sleep
	});
}
//#endregion
export { acquireDoctorGatewayMaintenanceOwner as t };

import { b as runWithGatewayDetachedWorkAdmission, f as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-CHv_0noy.mjs";
//#region src/gateway/session-cold-storage-maintenance.ts
const owners = /* @__PURE__ */ new WeakMap();
function idleStatus() {
	return {
		running: false,
		lastStartedAt: null,
		lastCompletedAt: null,
		lastError: null,
		archivedTranscripts: 0,
		externalizedTranscripts: 0
	};
}
/** One sweep owner per Gateway, shared by periodic and explicit maintenance. */
function startSessionColdStorageMaintenance(params) {
	const previousDrain = owners.get(params.getRuntimeConfig)?.stop();
	const abortController = new AbortController();
	let stopped = false;
	let inFlight;
	const status = idleStatus();
	const owner = {
		status: () => ({ ...status }),
		run: () => {
			const config = params.getRuntimeConfig();
			if (stopped || config.session?.maintenance?.coldStorage?.enabled !== true) throw new Error("Transcript cold storage is disabled");
			if (inFlight) return inFlight;
			const assertCurrent = () => {
				if (stopped || owners.get(params.getRuntimeConfig) !== owner || params.getRuntimeConfig() !== config || isGatewayWorkAdmissionClosed()) throw new Error("Transcript archival canceled because its runtime configuration changed or the Gateway is stopping");
			};
			status.running = true;
			status.lastStartedAt = Date.now();
			status.lastError = null;
			status.archivedTranscripts = 0;
			status.externalizedTranscripts = 0;
			inFlight = runWithGatewayDetachedWorkAdmission(async () => {
				await previousDrain;
				assertCurrent();
				const { runSessionColdStorageMaintenance } = await import("./session-cold-storage-CqarxOH9.mjs");
				assertCurrent();
				const result = await runSessionColdStorageMaintenance({
					config,
					assertCurrent,
					onProgress: (progress) => {
						status.archivedTranscripts = progress.archivedTranscripts;
						status.externalizedTranscripts = progress.externalizedTranscripts;
					}
				});
				status.archivedTranscripts = result.archivedTranscripts;
				status.externalizedTranscripts = result.externalizedTranscripts;
			}, "runtime:session-cold-storage", abortController.signal).catch((error) => {
				status.lastError = error instanceof Error ? error.message : String(error);
				throw error;
			}).finally(() => {
				status.running = false;
				status.lastCompletedAt = Date.now();
				inFlight = void 0;
			});
			return inFlight;
		},
		stop: async () => {
			stopped = true;
			clearInterval(timer);
			abortController.abort();
			await inFlight?.catch(() => {});
			await previousDrain;
			if (owners.get(params.getRuntimeConfig) === owner) owners.delete(params.getRuntimeConfig);
		}
	};
	owners.set(params.getRuntimeConfig, owner);
	const tick = () => {
		if (stopped || inFlight || isGatewayWorkAdmissionClosed() || params.getRuntimeConfig().session?.maintenance?.coldStorage?.enabled !== true) return;
		owner.run().catch((error) => params.onError(String(error)));
	};
	const timer = setInterval(tick, 6e4);
	timer.unref();
	tick();
	return owner;
}
function getSessionColdStorageMaintenanceStatus(getRuntimeConfig) {
	return owners.get(getRuntimeConfig)?.status() ?? idleStatus();
}
function requestGatewaySessionColdStorageMaintenance(getRuntimeConfig) {
	const owner = owners.get(getRuntimeConfig);
	if (!owner) throw new Error("Transcript maintenance is not running; wait for Gateway startup to finish");
	owner.run().catch(() => {});
}
//#endregion
export { requestGatewaySessionColdStorageMaintenance as n, startSessionColdStorageMaintenance as r, getSessionColdStorageMaintenanceStatus as t };

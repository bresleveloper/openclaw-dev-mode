import { b as runWithGatewayDetachedWorkAdmission, f as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-rc4ZgKq_.mjs";
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
	const scheduler = params.scheduler.scope();
	let inFlight;
	const status = idleStatus();
	const owner = {
		status: () => ({ ...status }),
		run: () => {
			const config = params.getRuntimeConfig();
			if (scheduler.signal.aborted || config.session?.maintenance?.coldStorage?.enabled !== true) throw new Error("Transcript cold storage is disabled");
			if (inFlight) return inFlight;
			const assertCurrent = () => {
				if (scheduler.signal.aborted || owners.get(params.getRuntimeConfig) !== owner || params.getRuntimeConfig() !== config || isGatewayWorkAdmissionClosed()) throw new Error("Transcript archival canceled because its runtime configuration changed or the Gateway is stopping");
			};
			status.running = true;
			status.lastStartedAt = scheduler.now();
			status.lastError = null;
			status.archivedTranscripts = 0;
			status.externalizedTranscripts = 0;
			inFlight = runWithGatewayDetachedWorkAdmission(async () => {
				await previousDrain;
				assertCurrent();
				const { runSessionColdStorageMaintenance } = await import("./session-cold-storage-C7VKIe8P.mjs");
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
			}, "runtime:session-cold-storage", scheduler.signal).catch((error) => {
				status.lastError = error instanceof Error ? error.message : String(error);
				throw error;
			}).finally(() => {
				status.running = false;
				status.lastCompletedAt = scheduler.now();
				inFlight = void 0;
			});
			return inFlight;
		},
		stop: async () => {
			await scheduler.stop();
			await inFlight?.catch(() => {});
			await previousDrain;
			if (owners.get(params.getRuntimeConfig) === owner) owners.delete(params.getRuntimeConfig);
		}
	};
	owners.set(params.getRuntimeConfig, owner);
	scheduler.schedule({
		id: "maintenance:session-cold-storage",
		delayMs: 0,
		everyMs: 6e4,
		run: () => {
			if (inFlight || isGatewayWorkAdmissionClosed() || params.getRuntimeConfig().session?.maintenance?.coldStorage?.enabled !== true) return;
			return owner.run().catch((error) => params.onError(String(error)));
		}
	});
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

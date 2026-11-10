import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DOUCCb00.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { T as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as countPendingDeliveryQueueEntriesReadOnly } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import "./delivery-queue-namespaces-DQeyCJNT.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { t as listRetiredDeliveryQueueFiles } from "./state-migrations.retired-delivery-files-CGN2dsnS.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-BAxDer3U.mjs";
//#region src/commands/doctor-outbound-delivery.ts
/** Doctor owns the retired raw queue; current delivery recovery never prepares old payloads. */
async function migrateDoctorDeliveryQueues(params) {
	const stateEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	assertNoRetiredStateFiles("JSON delivery queues", listRetiredDeliveryQueueFiles(params.stateDir));
	if (await countPendingDeliveryQueueEntriesReadOnly([
		"outbound",
		"outbound-legacy-preparing-v1",
		"outbound-prepared-migration-v1"
	], stateEnv) === 0) return {
		changes: [],
		warnings: []
	};
	return withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy delivery queues",
		releaseLabel: "Delivery queue",
		run: async (env) => {
			const { loadLegacyPendingDeliveries, loadPendingLegacyDeliveryPreparations, loadPendingDeliveryMigrations } = await import("./delivery-queue-storage-DRxqbnF6.mjs");
			const legacy = loadLegacyPendingDeliveries(params.stateDir);
			const preparations = loadPendingLegacyDeliveryPreparations(params.stateDir);
			if (legacy.length === 0 && preparations.length === 0 && loadPendingDeliveryMigrations(params.stateDir).length === 0) return {
				changes: [],
				warnings: []
			};
			const { migrateLegacyPendingOutboundDeliveries } = await import("./delivery-queue-migration-BLUWn47w.mjs");
			const warnings = [];
			const log = {
				info: (_message) => {},
				warn: (message) => warnings.push(message),
				error: (message) => warnings.push(message)
			};
			const migration = {
				cfg: params.cfg,
				stateDir: params.stateDir,
				log
			};
			const needsRuntime = legacy.length > 0 || preparations.some((entry) => entry.legacyPreparationState === "claimed");
			let result;
			if (needsRuntime) {
				const { loadGatewayStartupPluginPlanWithMetadata } = await import("./gateway-startup-plugin-loader-CXQwnn9Y.mjs");
				const { acquirePluginRegistryForInspection } = await import("./plugins/loader.js");
				const { createHookRunner } = await import("./hooks-eJl0RQi-.mjs");
				const { withPluginRegistryPreparationScope } = await import("./registry-lifecycle-BgE9qlNO.mjs");
				const { withPluginRuntimeRegistryScope } = await import("./gateway-request-scope-4yDSzCvx.mjs");
				const workspaceDir = tryResolveConfiguredAgentWorkspaceDir(params.cfg);
				const { plan, metadataSnapshot } = loadGatewayStartupPluginPlanWithMetadata({
					config: params.cfg,
					workspaceDir,
					env
				});
				const maintenance = getOpenClawDatabaseMaintenanceScope();
				if (!maintenance) throw new Error("Outbound migration requires its maintenance resource owner");
				let inspection;
				let acquisitionFailure;
				maintenance.own({}, "agent-resources", async () => {
					if (inspection) try {
						await inspection.release();
					} catch (error) {
						if (hasRetainedPluginRuntimeCloseError(error)) throw error;
					}
					else if (hasRetainedPluginRuntimeCloseError(acquisitionFailure)) throw acquisitionFailure;
				});
				try {
					inspection = await acquirePluginRegistryForInspection({
						config: params.cfg,
						activationSourceConfig: params.cfg,
						env,
						workspaceDir,
						onlyPluginIds: [...plan.pluginIds],
						manifestRegistry: metadataSnapshot.manifestRegistry,
						discovery: metadataSnapshot.discovery,
						channelPluginLoadIntent: "full",
						runtimeSideEffects: true,
						throwOnLoadError: true
					});
				} catch (error) {
					acquisitionFailure = error;
					if (hasRetainedPluginRuntimeCloseError(error)) throw error;
					return {
						changes: [],
						warnings: [...warnings, `Legacy outbound delivery preparation deferred: ${String(error)}. Run openclaw doctor --fix after repairing the plugin.`],
						warningDisposition: "recoverable"
					};
				}
				const registry = inspection.registry;
				try {
					result = await withPluginRegistryPreparationScope(registry, () => withPluginRuntimeRegistryScope(registry, () => migrateLegacyPendingOutboundDeliveries({
						...migration,
						hookRunner: createHookRunner(registry, {
							logger: log,
							catchErrors: true
						})
					})));
				} catch (error) {
					const failures = [error];
					try {
						await inspection.release();
					} catch (releaseError) {
						failures.push(releaseError);
					}
					if (failures.length > 1) throw new AggregateError(failures, "Outbound migration and plugin disposal failed", { cause: error });
					throw error;
				}
				await inspection.release();
			} else result = await migrateLegacyPendingOutboundDeliveries(migration);
			if (result.remaining > 0) warnings.push(`${result.remaining} legacy outbound deliveries still require preparation. Run openclaw doctor --fix to retry.`);
			return {
				changes: result.moved > 0 ? [`Prepared ${result.moved} legacy outbound deliveries for current queue recovery`] : [],
				warnings,
				warningDisposition: "recoverable"
			};
		}
	});
}
//#endregion
export { migrateDoctorDeliveryQueues };

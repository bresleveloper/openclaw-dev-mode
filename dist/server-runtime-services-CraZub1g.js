import { r as isVitestRuntimeEnv } from "./env-CKmI-C4z.js";
import { t as isGatewayModelPricingEnabled } from "./model-pricing-config-pKJPI_G6.js";
import { r as startHeartbeatRunner } from "./heartbeat-runner-DGCHePG8.js";
import { r as createNoopHeartbeatRunner } from "./server-runtime-startup-services-DolMkW8Z.js";
//#region src/gateway/server-runtime-services.ts
/** Starts cron without making gateway startup wait for cron initialization. */
function startGatewayCronWithLogging(params) {
	params.cron.start().catch((err) => params.logCron.error(`failed to start: ${String(err)}`));
}
function clearGatewayMaintenanceHandles(maintenance) {
	if (!maintenance) return;
	clearInterval(maintenance.tickInterval);
	clearInterval(maintenance.healthInterval);
	clearInterval(maintenance.dedupeCleanup);
	if (maintenance.mediaCleanup) clearInterval(maintenance.mediaCleanup);
}
/** Runs maintenance that is intentionally delayed until after the gateway is ready. */
async function runGatewayPostReadyMaintenance(params) {
	try {
		const maintenance = await params.startMaintenance();
		if (maintenance) params.applyMaintenance(maintenance);
	} catch (err) {
		params.log.warn(`gateway post-ready maintenance startup failed: ${String(err)}`);
	}
	if (params.shouldStartCron()) {
		params.markCronStartHandled();
		startGatewayCronWithLogging({
			cron: params.cron,
			logCron: params.logCron
		});
	}
	params.recordPostReadyMemory();
}
/** Schedules post-ready maintenance and cancels/cleans handles if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const timer = setTimeout(() => {
		params.onStarted?.();
		if (params.isClosing()) return;
		runGatewayPostReadyMaintenance({
			startMaintenance: async () => {
				if (params.isClosing()) return null;
				const maintenance = await params.startMaintenance();
				if (params.isClosing()) {
					clearGatewayMaintenanceHandles(maintenance);
					return null;
				}
				return maintenance;
			},
			applyMaintenance: (maintenance) => {
				if (params.isClosing()) {
					clearGatewayMaintenanceHandles(maintenance);
					return;
				}
				params.applyMaintenance(maintenance);
			},
			shouldStartCron: () => !params.isClosing() && params.shouldStartCron(),
			markCronStartHandled: params.markCronStartHandled,
			cron: params.cron,
			logCron: params.logCron,
			log: params.log,
			recordPostReadyMemory: () => {
				if (!params.isClosing()) params.recordPostReadyMemory();
			}
		});
	}, params.delayMs);
	timer.unref?.();
	return timer;
}
function recoverPendingOutboundDeliveries(params) {
	(async () => {
		const { recoverPendingDeliveries } = await import("./delivery-queue-4hDlrVwx.js");
		const { deliverOutboundPayloadsInternal } = await import("./deliver-DMekVcr6.js");
		await recoverPendingDeliveries({
			deliver: deliverOutboundPayloadsInternal,
			log: params.log.child("delivery-recovery"),
			cfg: params.cfg
		});
	})().catch((err) => params.log.error(`Delivery recovery failed: ${String(err)}`));
}
function recoverPendingSessionDeliveries(params) {
	setTimeout(() => {
		(async () => {
			const { recoverPendingRestartContinuationDeliveries } = await import("./server-restart-sentinel-DWw4OqCg.js");
			const logRecovery = params.log.child("session-delivery-recovery");
			await recoverPendingRestartContinuationDeliveries({
				deps: params.deps,
				log: logRecovery,
				maxEnqueuedAt: params.maxEnqueuedAt
			});
		})().catch((err) => params.log.error(`Session delivery recovery failed: ${String(err)}`));
	}, 1250).unref?.();
}
function startGatewayModelPricingRefreshOnDemand(params) {
	if (!isGatewayModelPricingEnabled(params.config)) return () => {};
	let stopped = false;
	let stopRefresh;
	(async () => {
		const { startGatewayModelPricingRefresh } = await import("./model-pricing-cache-D4_dbcfE.js");
		if (stopped) return;
		stopRefresh = startGatewayModelPricingRefresh({
			config: params.config,
			...params.pluginLookUpTable ? { pluginLookUpTable: params.pluginLookUpTable } : {}
		});
		if (stopped) {
			stopRefresh();
			stopRefresh = void 0;
		}
	})().catch((err) => params.log.error(`Model pricing refresh failed to start: ${String(err)}`));
	return () => {
		stopped = true;
		stopRefresh?.();
		stopRefresh = void 0;
	};
}
/** Activates background gateway services after core runtime startup is ready. */
function activateGatewayScheduledServices(params) {
	if (params.minimalTestGateway) return {
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopModelPricingRefresh: () => {}
	};
	const heartbeatRunner = startHeartbeatRunner({ cfg: params.cfgAtStart });
	if (params.startCron !== false) startGatewayCronWithLogging({
		cron: params.cron,
		logCron: params.logCron
	});
	recoverPendingOutboundDeliveries({
		cfg: params.cfgAtStart,
		log: params.log
	});
	recoverPendingSessionDeliveries({
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt
	});
	return {
		heartbeatRunner,
		stopModelPricingRefresh: !isVitestRuntimeEnv() ? startGatewayModelPricingRefreshOnDemand({
			config: params.cfgAtStart,
			...params.pluginLookUpTable ? { pluginLookUpTable: params.pluginLookUpTable } : {},
			log: params.log
		}) : () => {}
	};
}
//#endregion
export { startGatewayCronWithLogging as i, runGatewayPostReadyMaintenance as n, scheduleGatewayPostReadyMaintenance as r, activateGatewayScheduledServices as t };

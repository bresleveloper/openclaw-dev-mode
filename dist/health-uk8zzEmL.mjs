import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as readChildRuntimeViability } from "./child-runtime-viability-X4GxYG5L.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as readGatewayMaintenanceWork } from "./gateway-active-work-_DX5iUkP.mjs";
import "./server-constants-B-cmoH_0.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { n as readGatewayProcessVitals, r as readGatewayWorkerPoolFacts } from "./process-vitals-DUtOksxO.mjs";
import { t as getPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import { t as getStatusSummary } from "./summary-BVIae5Lj.mjs";
import { r as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-CRz99GM_.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-BrSB6v9i.mjs";
import { t as shouldScheduleBackgroundHealthRefresh } from "./health-refresh-admission-BJ2tUHtk.mjs";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
function cachedLifecycleDiffersFromRuntime(cached, runtime) {
	return [
		"running",
		"connected",
		"lifecycle"
	].some((key) => runtime[key] !== void 0 && cached?.[key] !== runtime[key]);
}
function cachedHealthDiffersFromRuntime(cached, runtime) {
	return Object.entries(runtime.channels).some(([channelId, snapshot]) => snapshot && cachedLifecycleDiffersFromRuntime(cached.channels[channelId], snapshot)) || Object.entries(runtime.channelAccounts).some(([channelId, accounts]) => {
		if (!accounts) return false;
		const cachedAccounts = cached.channels[channelId]?.accounts;
		return Object.entries(accounts).some(([accountId, snapshot]) => snapshot && cachedLifecycleDiffersFromRuntime(cachedAccounts?.[accountId], snapshot));
	});
}
const healthHandlers = {
	health: async ({ respond, context, params, client }) => {
		const { getHealthCache, refreshHealthSnapshot, logHealth } = context;
		const wantsProbe = params?.probe === true;
		const includeSensitive = (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
		const now = Date.now();
		const cached = getHealthCache();
		let cachedDiffersFromRuntime = false;
		if (!wantsProbe && cached) try {
			cachedDiffersFromRuntime = cachedHealthDiffersFromRuntime(cached, context.getRuntimeSnapshot());
		} catch {
			cachedDiffersFromRuntime = true;
		}
		if (!wantsProbe && cached && !cachedDiffersFromRuntime && now - cached.ts < 6e4) {
			const getEventLoopHealth = context.getEventLoopHealth;
			const configReloadHotReloadStatus = context.getConfigReloaderHotReloadStatus?.();
			const { contextEngines: _cachedContextEngines, deliveryQueues: _cachedDeliveryQueues, eventLoop: _cachedEventLoop, ...cachedState } = cached;
			const deliveryQueues = await buildDeliveryQueueHealthSummary(_cachedDeliveryQueues?.ingressPressure ?? []);
			const contextEngines = await buildContextEngineHealthSummary();
			const eventLoop = getEventLoopHealth?.();
			respond(true, {
				...cachedState,
				modelRuntime: getPreparedModelRuntimeStartupStatus(),
				...eventLoop ? { eventLoop } : {},
				...contextEngines ? { contextEngines } : {},
				...deliveryQueues ? { deliveryQueues } : {},
				...configReloadHotReloadStatus ? { configReload: { hotReloadStatus: configReloadHotReloadStatus } } : {},
				childRuntime: readChildRuntimeViability()
			}, void 0, { cached: true });
			if (shouldScheduleBackgroundHealthRefresh(refreshHealthSnapshot, now)) refreshHealthSnapshot({
				probe: false,
				includeSensitive
			}).catch((err) => logHealth.error(`background health refresh failed: ${formatErrorMessage(err)}`));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, {
				...await refreshHealthSnapshot({
					probe: wantsProbe,
					includeSensitive
				}),
				modelRuntime: getPreparedModelRuntimeStartupStatus(),
				childRuntime: readChildRuntimeViability()
			}, void 0);
		});
	},
	status: async ({ respond, client, params, context }) => {
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		const hostDesktopStatus = await context.hostDesktopService?.status();
		const status = await getStatusSummary({
			includeSensitive: scopes.includes(ADMIN_SCOPE),
			includeChannelSummary: params.includeChannelSummary !== false,
			includeCliProjection: params.includeCliProjection === true,
			sessionRowProjection: getSessionRowProjection(context),
			...hostDesktopStatus ? { hostDesktopStatus } : {}
		});
		const workerPools = await readGatewayWorkerPoolFacts();
		const shutdownBudget = context.hostLifecycle?.getShutdownBudget?.();
		const activeWork = shutdownBudget ? readGatewayMaintenanceWork(createGatewayServerActiveWorkInspectors(context)) : void 0;
		const shutdownStatus = shutdownBudget && activeWork ? {
			...shutdownBudget,
			activeWork: activeWork.counts,
			writeCustody: activeWork.writeCustody
		} : void 0;
		respond(true, {
			...status,
			modelRuntime: getPreparedModelRuntimeStartupStatus(),
			...readGatewayProcessVitals(context.getEventLoopHealth),
			workerPools,
			pid: process.pid,
			shutdownBudget: shutdownStatus,
			childRuntime: readChildRuntimeViability()
		}, void 0);
	}
};
//#endregion
export { healthHandlers };

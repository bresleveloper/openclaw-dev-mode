import { g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as getPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import "./server-constants-BH_EolwD.mjs";
import { n as readGatewayMaintenanceWork } from "./gateway-active-work-a7DXCHDA.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { n as readChildRuntimeViability } from "./child-runtime-viability-Dt-lp9OO.mjs";
import { t as getStatusSummary } from "./summary-BahMSqkA.mjs";
import { r as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-ufDnhmBr.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-DTISpoOr.mjs";
import { t as shouldScheduleBackgroundHealthRefresh } from "./health-refresh-admission-BbFsn4NC.mjs";
import { n as readGatewayProcessVitals, r as readGatewayWorkerPoolFacts } from "./process-vitals-db5Vubdr.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
function cachedLifecycleDiffersFromRuntime(cached, runtime) {
	return cached === void 0 || [
		"running",
		"connected",
		"lifecycle"
	].some((key) => runtime[key] !== void 0 && cached[key] !== runtime[key]);
}
function cachedHealthDiffersFromRuntime(cached, runtime) {
	return Object.entries(runtime.channels).some(([channelId, snapshot]) => snapshot && cachedLifecycleDiffersFromRuntime(cached.channels[channelId], snapshot)) || Object.entries(runtime.channelAccounts).some(([channelId, accounts]) => {
		if (!accounts) return false;
		const cachedAccounts = cached.channels[channelId]?.accounts;
		return Object.keys(cachedAccounts ?? {}).some((accountId) => !Object.hasOwn(accounts, accountId)) || Object.entries(accounts).some(([accountId, snapshot]) => snapshot && cachedLifecycleDiffersFromRuntime(cachedAccounts?.[accountId], snapshot));
	}) || Object.keys(cached.channels).some((channelId) => !Object.hasOwn(runtime.channels, channelId) && !Object.hasOwn(runtime.channelAccounts, channelId));
}
async function mergeCachedHealthRuntimeState(params) {
	const { contextEngines: _cachedContextEngines, deliveryQueues: _cachedDeliveryQueues, eventLoop: _cachedEventLoop, ...cached } = params.cached;
	const deliveryQueues = await buildDeliveryQueueHealthSummary(_cachedDeliveryQueues?.ingressPressure ?? []);
	const contextEngines = await buildContextEngineHealthSummary();
	const eventLoop = params.getEventLoopHealth?.();
	return {
		...cached,
		modelRuntime: getPreparedModelRuntimeStartupStatus(),
		...eventLoop ? { eventLoop } : {},
		...contextEngines ? { contextEngines } : {},
		...deliveryQueues ? { deliveryQueues } : {},
		...params.configReloadHotReloadStatus ? { configReload: { hotReloadStatus: params.configReloadHotReloadStatus } } : {}
	};
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
		if (!wantsProbe && cached && !cachedDiffersFromRuntime && !isFutureDateTimestampMs(cached.ts, { nowMs: now }) && now - cached.ts < 6e4) {
			respond(true, {
				...await mergeCachedHealthRuntimeState({
					cached,
					getEventLoopHealth: context.getEventLoopHealth,
					configReloadHotReloadStatus: context.getConfigReloaderHotReloadStatus?.()
				}),
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
export { healthHandlers as t };

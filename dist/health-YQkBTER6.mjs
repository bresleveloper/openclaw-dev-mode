import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as getPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import "./server-constants-Dx_kHnY5.mjs";
import { n as readGatewayMaintenanceWork } from "./gateway-active-work-DTnRXeHJ.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import "./server-utils-BHpxAA43.mjs";
import { t as getStatusSummary } from "./summary-CLrMd6KD.mjs";
import { r as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-DYp_QeWs.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-DAQgwUyh.mjs";
import { t as shouldScheduleBackgroundHealthRefresh } from "./health-refresh-admission-CbSP_L_Q.mjs";
import { n as readGatewayProcessVitals, r as readGatewayWorkerPoolFacts } from "./process-vitals-B7HHDUI0.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
function cachedLifecycleDiffersFromRuntime(params) {
	for (const key of [
		"running",
		"connected",
		"lifecycle"
	]) {
		const runtimeValue = params.runtimeSnapshot[key];
		if (runtimeValue !== void 0 && params.cachedAccount?.[key] !== runtimeValue) return true;
	}
	return params.cachedAccount === void 0;
}
/** Checks whether cached channel health is stale against the live runtime snapshot. */
function cachedHealthDiffersFromRuntime(cached, runtime) {
	for (const [channelId, runtimeSnapshot] of Object.entries(runtime.channels)) {
		if (!runtimeSnapshot) continue;
		const cachedChannel = cached.channels[channelId];
		if (cachedLifecycleDiffersFromRuntime({
			cachedAccount: cachedChannel,
			runtimeSnapshot
		})) return true;
	}
	for (const [channelId, accounts] of Object.entries(runtime.channelAccounts)) {
		if (!accounts) continue;
		const cachedAccounts = cached.channels[channelId]?.accounts;
		if (Object.keys(cachedAccounts ?? {}).some((accountId) => !Object.hasOwn(accounts, accountId))) return true;
		for (const [accountId, runtimeSnapshot] of Object.entries(accounts)) {
			if (!runtimeSnapshot) continue;
			if (cachedLifecycleDiffersFromRuntime({
				cachedAccount: cachedAccounts?.[accountId],
				runtimeSnapshot
			})) return true;
		}
	}
	return Object.keys(cached.channels).some((channelId) => !Object.hasOwn(runtime.channels, channelId) && !Object.hasOwn(runtime.channelAccounts, channelId));
}
/** Merges cheap live runtime facts into a cached health summary before responding. */
async function mergeCachedHealthRuntimeState(params) {
	const { contextEngines: _cachedContextEngines, deliveryQueues: _cachedDeliveryQueues, eventLoop: _cachedEventLoop, ...cached } = params.cached;
	const deliveryQueues = await buildDeliveryQueueHealthSummary(_cachedDeliveryQueues?.ingressPressure ?? []);
	const contextEngines = buildContextEngineHealthSummary();
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
/** Gateway handlers for health snapshots and status summaries. */
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
			respond(true, await mergeCachedHealthRuntimeState({
				cached,
				getEventLoopHealth: context.getEventLoopHealth,
				configReloadHotReloadStatus: context.getConfigReloaderHotReloadStatus?.()
			}), void 0, { cached: true });
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
				modelRuntime: getPreparedModelRuntimeStartupStatus()
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
			shutdownBudget: shutdownStatus
		}, void 0);
	}
};
//#endregion
export { healthHandlers as t };

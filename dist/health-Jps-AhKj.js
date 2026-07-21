import { r as listContextEngineQuarantines } from "./registry-DaHwgHUl.js";
import { o as getGatewayModelPricingHealth } from "./model-pricing-cache-state-BWcJFXLK.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import "./server-constants-BGwLM6XN.js";
import { t as formatForLog } from "./ws-log-C5Rq9COn.js";
import { t as buildDeliveryQueueHealthSummary } from "./health-C5jqO7Fy.js";
import { t as getStatusSummary } from "./status.summary-CeUj_YQX.js";
import "./status-DRT__EOA.js";
import { t as formatError } from "./server-utils-DSPvMAuK.js";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
function cachedAccountForRuntimeSnapshot(params) {
	const accountId = params.accountId;
	if (accountId && params.cachedChannel?.accounts?.[accountId]) return params.cachedChannel.accounts[accountId];
}
function cachedLifecycleDiffersFromRuntime(params) {
	for (const key of ["running", "connected"]) {
		const runtimeValue = params.runtimeSnapshot[key];
		if (typeof runtimeValue !== "boolean") continue;
		if (params.cachedAccount?.[key] !== runtimeValue) return true;
	}
	return false;
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
		const cachedChannel = cached.channels[channelId];
		for (const [accountId, runtimeSnapshot] of Object.entries(accounts)) {
			if (!runtimeSnapshot) continue;
			if (cachedLifecycleDiffersFromRuntime({
				cachedAccount: cachedAccountForRuntimeSnapshot({
					cachedChannel,
					accountId
				}),
				runtimeSnapshot
			})) return true;
		}
	}
	return false;
}
/** Merges cheap live runtime facts into a cached health summary before responding. */
function mergeCachedHealthRuntimeState(params) {
	const { contextEngines: _cachedContextEngines, deliveryQueues: _cachedDeliveryQueues, ...cached } = params.cached;
	const deliveryQueues = buildDeliveryQueueHealthSummary();
	const quarantinedContextEngines = [];
	for (const entry of listContextEngineQuarantines()) {
		const summary = {
			engineId: entry.engineId,
			operation: entry.operation,
			reason: entry.reason,
			failedAt: entry.failedAt.getTime()
		};
		if (entry.owner) summary.owner = entry.owner;
		quarantinedContextEngines.push(summary);
	}
	return {
		...cached,
		...params.eventLoop ? { eventLoop: params.eventLoop } : {},
		...quarantinedContextEngines.length > 0 ? { contextEngines: { quarantined: quarantinedContextEngines } } : {},
		...deliveryQueues ? { deliveryQueues } : {},
		...params.configReloadHotReloadStatus ? { configReload: { hotReloadStatus: params.configReloadHotReloadStatus } } : {},
		modelPricing: getGatewayModelPricingHealth({ enabled: params.cached.modelPricing?.state !== "disabled" })
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
			cachedDiffersFromRuntime = false;
		}
		if (!wantsProbe && cached && !cachedDiffersFromRuntime && now - cached.ts < 6e4) {
			respond(true, mergeCachedHealthRuntimeState({
				cached,
				eventLoop: context.getEventLoopHealth?.(),
				configReloadHotReloadStatus: context.getConfigReloaderHotReloadStatus?.()
			}), void 0, { cached: true });
			refreshHealthSnapshot({
				probe: false,
				includeSensitive
			}).catch((err) => logHealth.error(`background health refresh failed: ${formatError(err)}`));
			return;
		}
		try {
			respond(true, await refreshHealthSnapshot({
				probe: wantsProbe,
				includeSensitive
			}), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	status: async ({ respond, client, params, context }) => {
		const status = await getStatusSummary({
			includeSensitive: (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE),
			includeChannelSummary: params.includeChannelSummary !== false
		});
		if (context.getEventLoopHealth) status.eventLoop = context.getEventLoopHealth();
		respond(true, status, void 0);
	}
};
//#endregion
export { healthHandlers };

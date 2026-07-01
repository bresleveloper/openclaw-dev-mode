import { r as listContextEngineQuarantines } from "./registry-BLZQzICr.js";
import { o as getGatewayModelPricingHealth } from "./model-pricing-cache-state-Cj_A6ftK.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import "./src-CSp7rUPX.js";
import "./server-constants-BGwLM6XN.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import { t as getStatusSummary } from "./status.summary-BNfioZME.js";
import "./status-CaJ2j2Zc.js";
import { t as formatError } from "./server-utils-DsMt4SeL.js";
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
	const { contextEngines: _cachedContextEngines, ...cached } = params.cached;
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
				eventLoop: context.getEventLoopHealth?.()
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

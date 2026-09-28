import { c as asFiniteNumberInRange } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-BQRtcdBp.mjs";
import { c as withTrustedEnvProxyGuardedFetchMode, i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./response-limit-runtime-Wtkm2X7a.mjs";
import "./fetch-runtime-CknSDlAV.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { o as normalizeClawRouterRootUrl } from "./provider-catalog-C5yAXEtH.mjs";
//#region extensions/clawrouter/usage.ts
const CLAWROUTER_USAGE_RESPONSE_MAX_BYTES = 1048576;
function formatUsd(micros) {
	const dollars = micros / 1e6;
	return dollars < .01 && dollars > 0 ? `$${dollars.toFixed(4)}` : `$${dollars.toFixed(2)}`;
}
function formatCount(value) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
function resolveMonthlyResetAt(windowKey) {
	if (typeof windowKey !== "string") return;
	const match = windowKey.match(/\/(\d{4})-(\d{2})$/u);
	if (!match) return;
	const year = Number(match[1]);
	const month = Number(match[2]);
	return Number.isSafeInteger(year) && month >= 1 && month <= 12 ? Date.UTC(year, month, 1) : void 0;
}
function buildSummary(payload) {
	const summary = payload.usage?.summary;
	const requests = asFiniteNumberInRange(summary?.requestCount, { min: 0 });
	const tokens = asFiniteNumberInRange(summary?.totalTokens, { min: 0 });
	const costMicros = asFiniteNumberInRange(summary?.actualCostMicros, { min: 0 });
	const parts = [
		requests === void 0 ? void 0 : `${formatCount(requests)} requests`,
		tokens === void 0 ? void 0 : `${formatCount(tokens)} tokens`,
		costMicros === void 0 ? void 0 : `${formatUsd(costMicros)} used`
	].filter((part) => Boolean(part));
	return parts.length > 0 ? parts.join(" · ") : void 0;
}
async function readClawRouterUsagePayload(response, timeoutMs) {
	const buffer = await readResponseWithLimit(response, CLAWROUTER_USAGE_RESPONSE_MAX_BYTES, {
		chunkTimeoutMs: timeoutMs,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`ClawRouter usage response exceeds ${maxBytes} bytes`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`ClawRouter usage response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	try {
		const payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
		return asOptionalRecord(payload);
	} catch {
		return;
	}
}
async function fetchClawRouterUsage(params) {
	const rootUrl = normalizeClawRouterRootUrl(params.baseUrl);
	const { response, release } = await (params.fetchGuard ?? fetchWithSsrFGuard)(withTrustedEnvProxyGuardedFetchMode({
		url: `${rootUrl}/v1/usage`,
		init: { headers: {
			Accept: "application/json",
			Authorization: `Bearer ${params.token}`
		} },
		timeoutMs: params.timeoutMs,
		signal: params.signal,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(rootUrl),
		auditContext: "clawrouter.usage"
	}));
	try {
		if (!response.ok) {
			response.body?.cancel().catch(() => void 0);
			throw new Error(`ClawRouter usage request failed (HTTP ${response.status})`);
		}
		const payload = await readClawRouterUsagePayload(response, params.timeoutMs);
		if (!payload) return {
			provider: "clawrouter",
			displayName: "ClawRouter",
			windows: [],
			error: "Malformed usage response"
		};
		const budget = payload.budget;
		const limitMicros = asFiniteNumberInRange(budget?.limitMicros, { min: 0 });
		const spentMicros = asFiniteNumberInRange(budget?.spentMicros, { min: 0 });
		const costMicros = asFiniteNumberInRange(payload.usage?.summary?.actualCostMicros, { min: 0 });
		const resetAt = resolveMonthlyResetAt(budget?.windowKey);
		const windows = [];
		if (budget?.configured === true && limitMicros !== void 0 && spentMicros !== void 0) windows.push({
			label: "Monthly budget",
			usedPercent: limitMicros === 0 ? 100 : Math.min(100, spentMicros / limitMicros * 100),
			resetAt
		});
		const billing = budget?.configured === true && limitMicros !== void 0 && spentMicros !== void 0 ? [{
			type: "budget",
			used: spentMicros / 1e6,
			limit: limitMicros / 1e6,
			unit: "USD",
			period: "month",
			resetAt
		}] : costMicros !== void 0 ? [{
			type: "spend",
			amount: costMicros / 1e6,
			unit: "USD"
		}] : void 0;
		return {
			provider: "clawrouter",
			displayName: "ClawRouter",
			windows,
			...billing ? { billing } : {},
			summary: buildSummary(payload),
			plan: budget?.configured === true ? "Managed monthly budget" : "Unmetered proxy key"
		};
	} finally {
		await release();
	}
}
//#endregion
export { fetchClawRouterUsage as t };

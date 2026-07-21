import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import "./response-limit-runtime-B7RO3Er4.js";
import { a as normalizeClawRouterRootUrl } from "./provider-catalog-D-Mf25kS.js";
//#region extensions/clawrouter/usage.ts
const CLAWROUTER_USAGE_RESPONSE_MAX_BYTES = 1024 * 1024;
function nonNegativeNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
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
	const requests = nonNegativeNumber(summary?.requestCount);
	const tokens = nonNegativeNumber(summary?.totalTokens);
	const costMicros = nonNegativeNumber(summary?.actualCostMicros);
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
	return JSON.parse(new TextDecoder().decode(buffer));
}
async function fetchClawRouterUsage(params) {
	const response = await params.fetchFn(`${normalizeClawRouterRootUrl(params.baseUrl)}/v1/usage`, {
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${params.token}`
		},
		signal: AbortSignal.timeout(params.timeoutMs)
	});
	if (!response.ok) throw new Error(`ClawRouter usage request failed (HTTP ${response.status})`);
	const payload = await readClawRouterUsagePayload(response, params.timeoutMs);
	const budget = payload.budget;
	const limitMicros = nonNegativeNumber(budget?.limitMicros);
	const spentMicros = nonNegativeNumber(budget?.spentMicros);
	const costMicros = nonNegativeNumber(payload.usage?.summary?.actualCostMicros);
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
}
//#endregion
export { fetchClawRouterUsage as t };

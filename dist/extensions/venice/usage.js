import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { buildUsageHttpErrorSnapshot, parseProviderUsageNonNegativeNumber } from "openclaw/plugin-sdk/provider-usage";
//#region extensions/venice/usage.ts
const VENICE_BALANCE_URL = "https://api.venice.ai/api/v1/billing/balance";
const VENICE_USAGE_RESPONSE_MAX_BYTES = 1048576;
async function readPayload(response, timeoutMs) {
	return await readProviderJsonObjectResponse(response, "Venice usage", {
		maxBytes: VENICE_USAGE_RESPONSE_MAX_BYTES,
		chunkTimeoutMs: timeoutMs,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Venice usage response stalled for ${chunkTimeoutMs}ms`)
	});
}
async function fetchVeniceUsage(params) {
	let response;
	try {
		response = await params.fetchFn(VENICE_BALANCE_URL, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${params.token}`
			},
			signal: AbortSignal.timeout(params.timeoutMs)
		});
	} catch {
		return {
			provider: "venice",
			displayName: "Venice",
			windows: [],
			error: "Usage unavailable"
		};
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		return buildUsageHttpErrorSnapshot({
			provider: "venice",
			status: response.status
		});
	}
	let data;
	try {
		data = await readPayload(response, params.timeoutMs);
	} catch {
		return {
			provider: "venice",
			displayName: "Venice",
			windows: [],
			error: "Malformed usage response"
		};
	}
	const diem = parseProviderUsageNonNegativeNumber(data.balances?.diem);
	const usd = parseProviderUsageNonNegativeNumber(data.balances?.usd);
	const allocation = parseProviderUsageNonNegativeNumber(data.diemEpochAllocation);
	const windows = [];
	if (diem !== void 0 && allocation !== void 0 && allocation > 0) windows.push({
		label: "DIEM epoch",
		usedPercent: Math.min(100, Math.max(0, (allocation - diem) / allocation * 100))
	});
	const billing = [];
	if (diem !== void 0) billing.push({
		type: "balance",
		label: "DIEM balance",
		amount: diem,
		unit: "DIEM"
	});
	if (usd !== void 0) billing.push({
		type: "balance",
		label: "USD balance",
		amount: usd,
		unit: "USD"
	});
	if (diem !== void 0 && allocation !== void 0 && allocation > 0) billing.push({
		type: "budget",
		label: "DIEM epoch",
		used: Math.max(0, allocation - diem),
		limit: allocation,
		unit: "DIEM",
		period: "epoch"
	});
	const consumptionCurrency = typeof data.consumptionCurrency === "string" ? data.consumptionCurrency.trim().toUpperCase() : "";
	return {
		provider: "venice",
		displayName: "Venice",
		windows,
		...billing.length > 0 ? { billing } : {},
		...consumptionCurrency ? { plan: `${consumptionCurrency} billing` } : {},
		...data.canConsume === false ? { summary: "API consumption unavailable" } : {}
	};
}
//#endregion
export { fetchVeniceUsage };

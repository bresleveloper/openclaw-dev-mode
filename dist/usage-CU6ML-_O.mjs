import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as readProviderJsonObjectResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import { r as clampPercent } from "./provider-usage.shared-CksXGFVr.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./provider-http-BuV15s4V.mjs";
import { h as parseProviderUsageNonNegativeNumber } from "./provider-usage-cmMjFgVv.mjs";
import { n as buildUsageHttpErrorSnapshot, r as fetchJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-UQo0bRd5.mjs";
import "./defaults-CDpC0pZy.mjs";
//#region extensions/ollama/src/usage.ts
const MAX_BALANCE_RESPONSE_BYTES = 65536;
function readPercentWindow(value, label) {
	const record = asOptionalRecord(value);
	const remaining = parseProviderUsageNonNegativeNumber(record?.remaining_percent);
	if (remaining === void 0 || remaining > 100) return;
	const resetAt = parseDateStringTimestampMs(record?.resets_at);
	return {
		label,
		usedPercent: clampPercent(100 - remaining),
		...resetAt !== void 0 ? { resetAt } : {}
	};
}
async function fetchOllamaUsage(params) {
	let response;
	try {
		response = await fetchJson(`${params.baseUrl.replace(/\/+$/, "")}/api/balance`, { headers: {
			Accept: "application/json",
			...params.token !== "ollama-local" ? { Authorization: `Bearer ${params.token}` } : {}
		} }, params.timeoutMs, params.fetchFn);
	} catch {
		return buildUsageErrorSnapshot("ollama", "Usage unavailable. Check that the configured Ollama server is reachable, then retry.");
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		if (response.status === 401 || response.status === 404) return buildUsageErrorSnapshot("ollama", "No auth");
		return buildUsageHttpErrorSnapshot({
			provider: "ollama",
			status: response.status,
			message: response.status === 403 ? "Check the configured Ollama server's access permissions" : "Check the configured Ollama server and retry"
		});
	}
	let data;
	try {
		data = await readProviderJsonObjectResponse(response, "Ollama balance", {
			maxBytes: MAX_BALANCE_RESPONSE_BYTES,
			chunkTimeoutMs: params.timeoutMs,
			onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Ollama balance response stalled for ${chunkTimeoutMs}ms`)
		});
	} catch {
		return buildUsageErrorSnapshot("ollama", "Malformed balance response. Check the configured Ollama server's /api/balance response, then retry.");
	}
	const included = asOptionalRecord(data.included);
	const purchased = asOptionalRecord(data.purchased);
	const windows = [readPercentWindow(included?.session, "Session"), readPercentWindow(included?.weekly, "Week")].filter((window) => window !== void 0);
	const allowance = parseProviderUsageNonNegativeNumber(included?.allowance_usd);
	const balance = parseProviderUsageNonNegativeNumber(included?.balance_usd);
	const period = asOptionalRecord(included?.period);
	const resetAt = parseDateStringTimestampMs(period?.until);
	if (allowance !== void 0 && allowance > 0 && balance !== void 0) windows.push({
		label: "Included",
		usedPercent: clampPercent((allowance - balance) / allowance * 100),
		...resetAt !== void 0 ? { resetAt } : {}
	});
	const billing = [];
	if (balance !== void 0) billing.push({
		type: "balance",
		label: "Included balance",
		amount: balance,
		unit: "USD"
	});
	const purchasedBalance = parseProviderUsageNonNegativeNumber(purchased?.balance_usd);
	if (purchasedBalance !== void 0) billing.push({
		type: "balance",
		label: "Purchased balance",
		amount: purchasedBalance,
		unit: "USD"
	});
	if (windows.length === 0 && billing.length === 0) return buildUsageErrorSnapshot("ollama", "No balance data. Check the configured server's Ollama Cloud account.");
	return {
		provider: "ollama",
		displayName: "Ollama",
		windows,
		...billing.length > 0 ? { billing } : {}
	};
}
//#endregion
export { fetchOllamaUsage };

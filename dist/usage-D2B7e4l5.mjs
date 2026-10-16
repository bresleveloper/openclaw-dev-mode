import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-By9R9pyt.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { h as resolveProviderHttpRequestConfig } from "./shared-DcnGQdHV.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { h as parseProviderUsageNonNegativeNumber } from "./provider-usage-DGQhrvJu.mjs";
import { n as buildUsageHttpErrorSnapshot } from "./provider-usage.fetch.shared-DCZdARu5.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import { a as resolveOpenRouterApiBaseUrl, o as resolveOpenRouterSsrfPolicy } from "./provider-catalog-CtJ2DVzZ.mjs";
//#region extensions/openrouter/usage.ts
const OPENROUTER_USAGE_RESPONSE_MAX_BYTES = 1048576;
function resolveLimitReset(value) {
	return value === "daily" || value === "weekly" || value === "monthly" ? value : void 0;
}
function resolveKeyBudget(data) {
	const limit = parseProviderUsageNonNegativeNumber(data?.limit);
	if (limit === void 0) return;
	const period = resolveLimitReset(data?.limit_reset);
	const periodUsage = parseProviderUsageNonNegativeNumber(period ? data?.[`usage_${period}`] : data?.usage);
	const byokUsage = data?.include_byok_in_limit !== true ? void 0 : parseProviderUsageNonNegativeNumber(period ? data[`byok_usage_${period}`] : data.byok_usage);
	const remaining = parseProviderUsageNonNegativeNumber(data?.limit_remaining);
	const usage = periodUsage === void 0 && byokUsage === void 0 ? void 0 : (periodUsage ?? 0) + (byokUsage ?? 0);
	const used = remaining === void 0 ? usage : Math.max(0, limit - remaining);
	return used === void 0 ? void 0 : {
		used,
		limit,
		...period ? { period } : {}
	};
}
async function fetchEndpoint(params) {
	let guardedResponse;
	try {
		guardedResponse = await fetchWithSsrFGuard({
			url: `${params.baseUrl}/${params.path}`,
			...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : { fetchImpl: params.fetchFn },
			init: {
				headers: params.headers,
				redirect: "error"
			},
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			maxRedirects: 0,
			policy: params.ssrfPolicy,
			auditContext: "openrouter-usage"
		});
	} catch {
		return {
			ok: false,
			reason: "transport"
		};
	}
	try {
		const { response } = guardedResponse;
		if (!response.ok) return {
			ok: false,
			status: response.status
		};
		try {
			const root = asOptionalRecord(await readProviderJsonResponse(response, "OpenRouter usage", {
				maxBytes: OPENROUTER_USAGE_RESPONSE_MAX_BYTES,
				chunkTimeoutMs: params.timeoutMs,
				onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`OpenRouter usage response stalled for ${chunkTimeoutMs}ms`)
			}));
			const data = asOptionalRecord(root?.data);
			return data ? {
				ok: true,
				data
			} : {
				ok: false,
				reason: "malformed"
			};
		} catch {
			return {
				ok: false,
				reason: "malformed"
			};
		}
	} finally {
		await guardedResponse.release();
	}
}
async function fetchOpenRouterUsage(params) {
	const requestConfig = resolveProviderHttpRequestConfig({
		provider: "openrouter",
		capability: "other",
		baseUrl: resolveOpenRouterApiBaseUrl(params.baseUrl),
		defaultBaseUrl: OPENROUTER_BASE_URL,
		defaultHeaders: {
			Accept: "application/json",
			Authorization: `Bearer ${params.token}`
		},
		request: sanitizeConfiguredModelProviderRequest(params.request)
	});
	const request = {
		baseUrl: requestConfig.baseUrl,
		headers: requestConfig.headers,
		ssrfPolicy: resolveOpenRouterSsrfPolicy(requestConfig, params.request),
		dispatcherPolicy: requestConfig.dispatcherPolicy,
		timeoutMs: params.timeoutMs,
		signal: params.signal,
		fetchFn: params.fetchFn
	};
	const [creditsResult, keyResult] = await Promise.all([fetchEndpoint({
		...request,
		path: "credits"
	}), fetchEndpoint({
		...request,
		path: "key"
	})]);
	if (!creditsResult.ok && !keyResult.ok) {
		const status = "status" in creditsResult ? creditsResult.status : "status" in keyResult ? keyResult.status : void 0;
		if (status !== void 0) return buildUsageHttpErrorSnapshot({
			provider: "openrouter",
			status
		});
		return {
			provider: "openrouter",
			displayName: "OpenRouter",
			windows: [],
			error: [creditsResult, keyResult].some((result) => "reason" in result && result.reason === "transport") ? "Usage unavailable" : "Malformed usage response"
		};
	}
	const credits = creditsResult.ok ? creditsResult.data : void 0;
	const key = keyResult.ok ? keyResult.data : void 0;
	const totalCredits = parseProviderUsageNonNegativeNumber(credits?.total_credits);
	const totalUsage = parseProviderUsageNonNegativeNumber(credits?.total_usage);
	const keyUsage = parseProviderUsageNonNegativeNumber(key?.usage);
	const keyBudget = resolveKeyBudget(key);
	const windows = [];
	if (keyBudget) {
		const periodLabel = keyBudget.period ? `${keyBudget.period[0]?.toUpperCase()}${keyBudget.period.slice(1)} key budget` : "API key budget";
		windows.push({
			label: periodLabel,
			usedPercent: keyBudget.limit === 0 ? 100 : Math.min(100, keyBudget.used / keyBudget.limit * 100)
		});
	}
	const billing = [];
	if (totalCredits !== void 0 && totalUsage !== void 0) {
		billing.push({
			type: "balance",
			label: "Account balance",
			amount: totalCredits - totalUsage,
			unit: "USD"
		});
		billing.push({
			type: "spend",
			label: "Account usage",
			amount: totalUsage,
			unit: "USD"
		});
	}
	if (keyBudget) billing.push({
		type: "budget",
		label: "API key budget",
		used: keyBudget.used,
		limit: keyBudget.limit,
		unit: "USD",
		...keyBudget.period ? { period: keyBudget.period } : {}
	});
	else if (keyUsage !== void 0) billing.push({
		type: "spend",
		label: "API key usage",
		amount: keyUsage,
		unit: "USD"
	});
	const keyLabel = typeof key?.label === "string" ? key.label.trim() : "";
	const summary = [
		["today", parseProviderUsageNonNegativeNumber(key?.usage_daily)],
		["this week", parseProviderUsageNonNegativeNumber(key?.usage_weekly)],
		["this month", parseProviderUsageNonNegativeNumber(key?.usage_monthly)]
	].flatMap(([period, amount]) => amount === void 0 ? [] : [`$${amount.toFixed(2)} ${period}`]).join(" · ");
	return {
		provider: "openrouter",
		displayName: "OpenRouter",
		windows,
		...billing.length > 0 ? { billing } : {},
		...summary ? { summary } : {},
		...keyLabel ? { plan: keyLabel } : {}
	};
}
//#endregion
export { fetchOpenRouterUsage as t };

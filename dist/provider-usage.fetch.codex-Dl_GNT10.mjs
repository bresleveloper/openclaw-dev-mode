import { x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DA20vxhR.mjs";
import { i as fetchUsageJson } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.codex.ts
const WEEKLY_RESET_GAP_SECONDS = 259200;
function resolveSecondaryWindowLabel(params) {
	if (params.windowHours >= 168) return "Week";
	if (params.windowHours < 24) return `${params.windowHours}h`;
	if (typeof params.secondaryResetAt === "number" && typeof params.primaryResetAt === "number" && params.secondaryResetAt - params.primaryResetAt >= WEEKLY_RESET_GAP_SECONDS) return "Week";
	return "Day";
}
async function fetchCodexUsage(token, accountId, timeoutMs, fetchFn) {
	const version = process.env.OPENCLAW_VERSION?.trim();
	const defaultHeaders = {
		Authorization: `Bearer ${token}`,
		Accept: "application/json",
		originator: "openclaw",
		...version ? { version } : {},
		"User-Agent": `openclaw/${version || "dev"}`
	};
	if (accountId) defaultHeaders["ChatGPT-Account-Id"] = accountId;
	const headers = resolveProviderRequestHeaders({
		provider: "openai",
		baseUrl: "https://chatgpt.com/backend-api/wham/usage",
		capability: "other",
		transport: "http",
		defaultHeaders
	}) ?? defaultHeaders;
	const parsed = await fetchUsageJson({
		provider: "openai",
		url: "https://chatgpt.com/backend-api/wham/usage",
		init: {
			method: "GET",
			headers
		},
		timeoutMs,
		fetchFn,
		tokenExpiredStatuses: [401, 403]
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = parsed.data;
	const windows = [];
	if (data.rate_limit?.primary_window) {
		const pw = data.rate_limit.primary_window;
		const windowHours = Math.round((pw.limit_window_seconds || 10800) / 3600);
		windows.push({
			label: `${windowHours}h`,
			usedPercent: clampPercent(pw.used_percent || 0),
			resetAt: pw.reset_at ? pw.reset_at * 1e3 : void 0
		});
	}
	if (data.rate_limit?.secondary_window) {
		const sw = data.rate_limit.secondary_window;
		const label = resolveSecondaryWindowLabel({
			windowHours: Math.round((sw.limit_window_seconds || 86400) / 3600),
			primaryResetAt: data.rate_limit?.primary_window?.reset_at,
			secondaryResetAt: sw.reset_at
		});
		windows.push({
			label,
			usedPercent: clampPercent(sw.used_percent || 0),
			resetAt: sw.reset_at ? sw.reset_at * 1e3 : void 0
		});
	}
	const plan = data.plan_type;
	let billing;
	if (data.credits?.balance !== void 0 && data.credits.balance !== null) {
		const balance = typeof data.credits.balance === "number" ? data.credits.balance : parseStrictFiniteNumber(data.credits.balance);
		if (balance !== void 0 && balance >= 0) billing = [{
			type: "balance",
			amount: balance,
			unit: "credits"
		}];
	}
	return {
		provider: "openai",
		displayName: PROVIDER_LABELS.openai,
		windows,
		plan,
		...billing ? { billing } : {}
	};
}
//#endregion
export { fetchCodexUsage };

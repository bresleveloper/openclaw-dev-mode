import { x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-CksXGFVr.mjs";
import { i as fetchUsageJson } from "./provider-usage.fetch.shared-UQo0bRd5.mjs";
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
	for (const kind of ["primary_window", "secondary_window"]) {
		const window = data.rate_limit?.[kind];
		if (!window) continue;
		const primary = kind === "primary_window";
		const windowHours = Math.round((window.limit_window_seconds || (primary ? 10800 : 86400)) / 3600);
		windows.push({
			label: primary ? `${windowHours}h` : resolveSecondaryWindowLabel({
				windowHours,
				primaryResetAt: data.rate_limit?.primary_window?.reset_at,
				secondaryResetAt: window.reset_at
			}),
			usedPercent: clampPercent(window.used_percent || 0),
			resetAt: window.reset_at ? window.reset_at * 1e3 : void 0
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

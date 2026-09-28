import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { r as clampPercent } from "./provider-usage.shared-DA20vxhR.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-usage-DhEDnd_r.mjs";
import { n as buildUsageHttpErrorSnapshot, r as fetchJson } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region extensions/xai/usage.ts
const XAI_PROVIDER_ID = "xai";
const SUPERGROK_BILLING_URL = "https://cli-chat-proxy.grok.com/v1/billing?format=credits";
const SUPERGROK_CLIENT_MODE = "cli";
const SUPERGROK_CLIENT_VERSION = "1.0.4";
const MAX_PLAN_CHARS = 128;
const MAX_EXACT_INTEGER = 9007199254740991;
function parseCentValue(value) {
	const raw = asOptionalRecord(value)?.val;
	if (raw === void 0 || raw === null) return 0;
	if (typeof raw === "number" && Number.isInteger(raw)) return raw;
	if (typeof raw === "string" && /^-?\d+$/.test(raw.trim())) return Number.parseInt(raw.trim(), 10);
}
function parseMoneyValue(value) {
	const cents = parseCentValue(value);
	if (cents === void 0 || cents < 0 || cents > MAX_EXACT_INTEGER) return;
	return cents / 100;
}
function parsePlan(value) {
	const plan = normalizeOptionalString(value);
	if (!plan || plan.length > MAX_PLAN_CHARS || hasControlCharacter(plan)) return;
	return plan;
}
function hasControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) if (value.charCodeAt(index) < 32) return true;
	return false;
}
function parsePercent(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return clampPercent(value);
}
function resolveUsageWindow(config) {
	const currentPeriod = asOptionalRecord(config["currentPeriod"] ?? config["current_period"]);
	const explicitPercent = parsePercent(config["creditUsagePercent"] ?? config["credit_usage_percent"]);
	const used = parseCentValue(config["used"]);
	const monthlyLimit = parseCentValue(config["monthlyLimit"] ?? config["monthly_limit"]);
	const legacyPercent = used !== void 0 && monthlyLimit !== void 0 && monthlyLimit > 0 && used >= 0 ? parsePercent(used / monthlyLimit * 100) : void 0;
	const percent = explicitPercent ?? legacyPercent;
	if (percent === void 0) return;
	const periodType = normalizeOptionalString(currentPeriod?.type) ?? "";
	const label = periodType.endsWith("WEEKLY") ? "Weekly" : periodType.endsWith("MONTHLY") || monthlyLimit !== void 0 || config["billingPeriodEnd"] !== void 0 || config["billing_period_end"] !== void 0 ? "Monthly" : "Usage";
	const resetAt = parseDateStringTimestampMs(currentPeriod?.end ?? config["billingPeriodEnd"] ?? config["billing_period_end"]);
	return {
		label,
		usedPercent: percent,
		...resetAt !== void 0 ? { resetAt } : {}
	};
}
function resolveBilling(config) {
	const prepaid = parseMoneyValue(config["prepaidBalance"] ?? config["prepaid_balance"]);
	if (prepaid === void 0) return;
	return [{
		type: "balance",
		label: "Prepaid balance",
		amount: prepaid,
		unit: "USD"
	}];
}
function buildSuperGrokUsageSnapshot(data) {
	const payload = asOptionalRecord(data);
	const config = asOptionalRecord(payload?.["config"]);
	if (!config) return {
		provider: XAI_PROVIDER_ID,
		displayName: "SuperGrok",
		windows: [],
		error: "Malformed billing response"
	};
	const window = resolveUsageWindow(config);
	if (!window) return {
		provider: XAI_PROVIDER_ID,
		displayName: "SuperGrok",
		windows: [],
		error: "No usage data"
	};
	return {
		provider: XAI_PROVIDER_ID,
		displayName: "SuperGrok",
		windows: [window],
		billing: resolveBilling(config),
		plan: parsePlan(payload?.["subscription_tier"] ?? payload?.["subscriptionTier"]) ?? "SuperGrok"
	};
}
async function fetchXaiUsage(token, timeoutMs, fetchFn) {
	const response = await fetchJson(SUPERGROK_BILLING_URL, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
			"x-grok-client-mode": SUPERGROK_CLIENT_MODE,
			"x-grok-client-version": SUPERGROK_CLIENT_VERSION
		}
	}, timeoutMs, fetchFn);
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		return buildUsageHttpErrorSnapshot({
			provider: XAI_PROVIDER_ID,
			status: response.status,
			tokenExpiredStatuses: [401, 403]
		});
	}
	try {
		return buildSuperGrokUsageSnapshot(await readProviderJsonResponse(response, "xai-usage"));
	} catch {
		return {
			provider: XAI_PROVIDER_ID,
			displayName: "SuperGrok",
			windows: [],
			error: "Malformed billing response"
		};
	}
}
//#endregion
export { fetchXaiUsage as t };

import { b as parseFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as PROVIDER_LABELS } from "./provider-usage.shared-DA20vxhR.mjs";
import { i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.deepseek.ts
const DEEPSEEK_BALANCE_URL = "https://api.deepseek.com/user/balance";
function formatCurrencyAmount(amount, currency) {
	if (currency === "CNY" || currency === "RMB") return `¥${amount.toFixed(2)}`;
	if (currency === "USD") return `$${amount.toFixed(2)}`;
	return currency ? `${amount.toFixed(2)} ${currency}` : amount.toFixed(2);
}
async function fetchDeepSeekUsage(apiKey, timeoutMs, fetchFn) {
	const parsed = await fetchUsageJson({
		provider: "deepseek",
		url: DEEPSEEK_BALANCE_URL,
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json"
			}
		},
		timeoutMs,
		fetchFn
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = isRecord(parsed.data) ? parsed.data : void 0;
	const balances = data && Array.isArray(data.balance_infos) ? data.balance_infos : [];
	const parts = [];
	const billing = [];
	for (const info of balances) {
		const amount = parseFiniteNumber(info.total_balance);
		if (amount === void 0) continue;
		const granted = parseFiniteNumber(info.granted_balance);
		const toppedUp = parseFiniteNumber(info.topped_up_balance);
		const normalized = info.currency?.trim().toUpperCase();
		parts.push(`Balance ${formatCurrencyAmount(amount, normalized)}`);
		if (granted !== void 0 && granted > 0) parts.push(`Granted ${formatCurrencyAmount(granted, normalized)}`);
		if (toppedUp !== void 0 && toppedUp > 0 && toppedUp !== amount) parts.push(`Topped up ${formatCurrencyAmount(toppedUp, normalized)}`);
		if (amount >= 0) billing.push({
			type: "balance",
			amount,
			unit: normalized || "credits"
		});
	}
	const summary = parts.join(" · ");
	if (!summary) return buildUsageErrorSnapshot("deepseek", "No balance data");
	return {
		provider: "deepseek",
		displayName: PROVIDER_LABELS.deepseek,
		windows: [],
		billing,
		summary,
		...data?.is_available === false ? { plan: "Unavailable" } : {}
	};
}
//#endregion
export { fetchDeepSeekUsage };

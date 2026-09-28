import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DA20vxhR.mjs";
import { a as parseUsageResetAt, i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.zai.ts
async function fetchZaiUsage(apiKey, timeoutMs, fetchFn) {
	const parsed = await fetchUsageJson({
		provider: "zai",
		url: "https://api.z.ai/api/monitor/usage/quota/limit",
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
	const usage = isRecord(parsed.data) ? parsed.data : void 0;
	if (usage?.success !== true || asFiniteNumber(usage.code) !== 200) return buildUsageErrorSnapshot("zai", normalizeOptionalString(usage?.msg) || "API error");
	const data = isRecord(usage.data) ? usage.data : {};
	const limits = Array.isArray(data.limits) ? data.limits : [];
	const windows = [];
	for (const limit of limits) {
		if (!isRecord(limit)) continue;
		const type = normalizeOptionalString(limit.type);
		const percent = clampPercent(asFiniteNumber(limit.percentage) ?? 0);
		const unit = asFiniteNumber(limit.unit);
		const number = asFiniteNumber(limit.number);
		const nextReset = parseUsageResetAt(normalizeOptionalString(limit.nextResetTime));
		let windowLabel = "Limit";
		if (unit === 1 && number !== void 0) windowLabel = `${number}d`;
		else if (unit === 3 && number !== void 0) windowLabel = `${number}h`;
		else if (unit === 5 && number !== void 0) windowLabel = `${number}m`;
		if (type === "TOKENS_LIMIT") windows.push({
			label: `Tokens (${windowLabel})`,
			usedPercent: percent,
			resetAt: nextReset
		});
		else if (type === "TIME_LIMIT") windows.push({
			label: "Monthly",
			usedPercent: percent,
			resetAt: nextReset
		});
	}
	return {
		provider: "zai",
		displayName: PROVIDER_LABELS.zai,
		windows,
		plan: normalizeOptionalString(data.planName) ?? normalizeOptionalString(data.plan)
	};
}
//#endregion
export { fetchZaiUsage };

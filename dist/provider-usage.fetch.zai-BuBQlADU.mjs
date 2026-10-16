import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-B2Q7uCr7.mjs";
import { i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-DCZdARu5.mjs";
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
		const nextReset = parseDateStringTimestampMs(normalizeOptionalString(limit.nextResetTime));
		let windowLabel = "Limit";
		if (unit === 1 && number !== void 0) windowLabel = `${number}d`;
		else if (unit === 3 && number !== void 0) windowLabel = `${number}h`;
		else if (unit === 5 && number !== void 0) windowLabel = `${number}m`;
		if (type === "TOKENS_LIMIT" || type === "TIME_LIMIT") windows.push({
			label: type === "TOKENS_LIMIT" ? `Tokens (${windowLabel})` : "Monthly",
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

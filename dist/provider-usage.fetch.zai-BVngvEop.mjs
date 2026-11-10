import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs, s as asFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-CksXGFVr.mjs";
import { i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-UQo0bRd5.mjs";
//#region src/infra/provider-usage.fetch.zai.ts
const WINDOW_UNITS = {
	1: "d",
	3: "h",
	5: "mo",
	6: "w"
};
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
		const number = asFiniteNumber(limit.number);
		const suffix = WINDOW_UNITS[asFiniteNumber(limit.unit) ?? 0];
		const windowLabel = suffix && number !== void 0 ? `${number}${suffix}` : "Limit";
		if (type === "TOKENS_LIMIT" || type === "TIME_LIMIT") windows.push({
			label: type === "TOKENS_LIMIT" ? `Tokens (${windowLabel})` : "Monthly",
			usedPercent: clampPercent(asFiniteNumber(limit.percentage) ?? 0),
			resetAt: asDateTimestampMs(limit.nextResetTime) ?? parseDateStringTimestampMs(normalizeOptionalString(limit.nextResetTime))
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

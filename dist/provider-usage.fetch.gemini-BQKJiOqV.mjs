import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as providerUsageLabel, r as clampPercent } from "./provider-usage.shared-DA20vxhR.mjs";
import { i as fetchUsageJson } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.gemini.ts
async function fetchGeminiUsage(token, timeoutMs, fetchFn, provider) {
	const parsed = await fetchUsageJson({
		provider,
		url: "https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota",
		init: {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: "{}"
		},
		timeoutMs,
		fetchFn
	});
	if (!parsed.ok) return parsed.snapshot;
	const buckets = isRecord(parsed.data) && Array.isArray(parsed.data.buckets) ? parsed.data.buckets : [];
	const windows = [];
	let proMin = 1;
	let flashMin = 1;
	let hasPro = false;
	let hasFlash = false;
	for (const bucket of buckets) {
		if (!isRecord(bucket)) continue;
		const model = typeof bucket.modelId === "string" ? bucket.modelId : "unknown";
		const frac = typeof bucket.remainingFraction === "number" ? bucket.remainingFraction : 1;
		const lower = normalizeLowercaseStringOrEmpty(model);
		if (lower.includes("pro")) {
			hasPro = true;
			if (frac < proMin) proMin = frac;
		}
		if (lower.includes("flash")) {
			hasFlash = true;
			if (frac < flashMin) flashMin = frac;
		}
	}
	if (hasPro) windows.push({
		label: "Pro",
		usedPercent: clampPercent((1 - proMin) * 100)
	});
	if (hasFlash) windows.push({
		label: "Flash",
		usedPercent: clampPercent((1 - flashMin) * 100)
	});
	return {
		provider,
		displayName: expectDefined(providerUsageLabel(provider), "gemini provider usage label"),
		windows
	};
}
//#endregion
export { fetchGeminiUsage };

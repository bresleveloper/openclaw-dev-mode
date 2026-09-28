import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/delivery-evidence-values.ts
function hasAnyNonEmptyString(value) {
	return Array.isArray(value) && value.some(hasNonEmptyString);
}
async function normalizeSentMediaUrlsForDelivery(params) {
	const normalizedUrls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of params.sentMediaUrls) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		if (!seen.has(trimmed)) {
			seen.add(trimmed);
			normalizedUrls.push(trimmed);
		}
		if (!params.normalizeMediaPaths) continue;
		try {
			const normalized = await params.normalizeMediaPaths({
				mediaUrl: trimmed,
				mediaUrls: [trimmed]
			});
			for (const mediaUrl of [normalized.mediaUrl, ...normalized.mediaUrls ?? []]) {
				const candidate = mediaUrl?.trim();
				if (!candidate || seen.has(candidate)) continue;
				seen.add(candidate);
				normalizedUrls.push(candidate);
			}
		} catch {}
	}
	return normalizedUrls;
}
//#endregion
export { normalizeSentMediaUrlsForDelivery as n, hasAnyNonEmptyString as t };

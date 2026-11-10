import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/delivery-evidence-values.ts
function hasAnyNonEmptyString(value) {
	return Array.isArray(value) && value.some(hasNonEmptyString);
}
async function normalizeSentMediaUrlsForDelivery(params) {
	const normalizedUrls = /* @__PURE__ */ new Set();
	for (const raw of params.sentMediaUrls) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		normalizedUrls.add(trimmed);
		if (!params.normalizeMediaPaths) continue;
		try {
			const normalized = await params.normalizeMediaPaths({
				mediaUrl: trimmed,
				mediaUrls: [trimmed]
			});
			for (const mediaUrl of [normalized.mediaUrl, ...normalized.mediaUrls ?? []]) {
				const candidate = mediaUrl?.trim();
				if (candidate) normalizedUrls.add(candidate);
			}
		} catch {}
	}
	return [...normalizedUrls];
}
//#endregion
export { normalizeSentMediaUrlsForDelivery as n, hasAnyNonEmptyString as t };

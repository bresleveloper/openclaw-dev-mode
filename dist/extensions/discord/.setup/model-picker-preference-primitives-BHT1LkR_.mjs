import { createHash } from "node:crypto";
import { normalizeProviderId } from "openclaw/plugin-sdk/model-ref-parse";
//#region extensions/discord/src/monitor/model-picker-preference-primitives.ts
function normalizeModelRef(raw) {
	const value = raw?.trim();
	if (!value) return null;
	const slashIndex = value.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= value.length - 1) return null;
	const provider = normalizeProviderId(value.slice(0, slashIndex));
	const model = value.slice(slashIndex + 1).trim();
	return provider && model ? `${provider}/${model}` : null;
}
function sanitizeRecentModels(models, limit) {
	const deduped = [];
	const seen = /* @__PURE__ */ new Set();
	if (!Array.isArray(models)) return deduped;
	for (const item of models) {
		const normalized = normalizeModelRef(typeof item === "string" ? item : void 0);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		deduped.push(normalized);
		if (deduped.length >= limit) break;
	}
	return deduped;
}
function hashSegment(value, length) {
	return createHash("sha256").update(value, "utf8").digest("hex").slice(0, length);
}
function buildPreferenceModelKey(scopeKey, modelRef) {
	return `v1:${hashSegment(scopeKey, 32)}:${hashSegment(modelRef, 24)}`;
}
function preferenceTimestampMs(value) {
	const parsed = typeof value === "string" ? Date.parse(value) : NaN;
	return Number.isFinite(parsed) ? parsed : 0;
}
//#endregion
export { sanitizeRecentModels as i, normalizeModelRef as n, preferenceTimestampMs as r, buildPreferenceModelKey as t };

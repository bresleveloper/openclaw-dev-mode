import { r as normalizeLowercaseStringOrEmpty } from "./string-coerce-Cj8sqWHx.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-CRGuMONI.mjs";
//#region packages/ai/src/utils/prompt-cache-stability.ts
/**
* Prompt-cache normalization helpers. They keep generated prompt sections
* deterministic across platform newlines, trailing whitespace, and input
* ordering.
*/
/** Canonicalizes provider tool order without relying on host locale settings. */
function sortPromptCacheToolsByName(tools) {
	const compareText = (left, right) => {
		const leftText = left ?? "";
		const rightText = right ?? "";
		return leftText < rightText ? -1 : leftText > rightText ? 1 : 0;
	};
	return tools.toSorted((left, right) => compareText(left.wireName ?? left.name, right.wireName ?? right.name) || compareText(left.description, right.description));
}
/** Normalize structured prompt text before hashing or snapshot comparison. */
function normalizeStructuredPromptSection(text) {
	return sanitizeSurrogates(text).replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
function normalizePromptCapabilityIds(capabilities) {
	const seen = /* @__PURE__ */ new Set();
	for (const capability of capabilities) {
		const value = normalizeLowercaseStringOrEmpty(normalizeStructuredPromptSection(capability));
		if (value) seen.add(value);
	}
	return [...seen].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { normalizeStructuredPromptSection as n, sortPromptCacheToolsByName as r, normalizePromptCapabilityIds as t };

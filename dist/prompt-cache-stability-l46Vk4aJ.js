import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/prompt-cache-stability.ts
/**
* Prompt-cache normalization helpers. They keep generated prompt sections
* deterministic across platform newlines, trailing whitespace, and input
* ordering.
*/
/** Normalize structured prompt text before hashing or snapshot comparison. */
function normalizeStructuredPromptSection(text) {
	return text.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
function normalizePromptCapabilityIds(capabilities) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const capability of capabilities) {
		const value = normalizeLowercaseStringOrEmpty(normalizeStructuredPromptSection(capability));
		if (!value || seen.has(value)) continue;
		seen.add(value);
		normalized.push(value);
	}
	return normalized.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { normalizeStructuredPromptSection as n, normalizePromptCapabilityIds as t };

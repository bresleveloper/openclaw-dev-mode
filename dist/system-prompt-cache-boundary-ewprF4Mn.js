import { n as normalizeStructuredPromptSection } from "./prompt-cache-stability-l46Vk4aJ.js";
//#region src/agents/system-prompt-cache-boundary.ts
/**
* System prompt cache-boundary helpers.
*
* Keeps stable prompt prefixes separate from dynamic runtime additions for provider prompt caching.
*/
const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
function stripSystemPromptCacheBoundary(text) {
	return text.replaceAll(SYSTEM_PROMPT_CACHE_BOUNDARY, "\n");
}
function ensureSystemPromptCacheBoundary(systemPrompt) {
	if (systemPrompt.trim().length === 0) return systemPrompt;
	return systemPrompt.includes("\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n") ? systemPrompt : `${systemPrompt}${SYSTEM_PROMPT_CACHE_BOUNDARY}`;
}
function splitSystemPromptCacheBoundary(text) {
	const boundaryIndex = text.indexOf(SYSTEM_PROMPT_CACHE_BOUNDARY);
	if (boundaryIndex === -1) return;
	return {
		stablePrefix: text.slice(0, boundaryIndex).trimEnd(),
		dynamicSuffix: text.slice(boundaryIndex + 34).trimStart()
	};
}
function prependSystemPromptAdditionAfterCacheBoundary(params) {
	const systemPromptAddition = typeof params.systemPromptAddition === "string" ? normalizeStructuredPromptSection(params.systemPromptAddition) : "";
	if (!systemPromptAddition) return params.systemPrompt;
	if (params.systemPrompt.trim().length === 0) return systemPromptAddition;
	const split = splitSystemPromptCacheBoundary(params.systemPrompt);
	if (!split) return `${systemPromptAddition}\n\n${params.systemPrompt}`;
	const dynamicSuffix = split.dynamicSuffix ? normalizeStructuredPromptSection(split.dynamicSuffix) : "";
	if (!dynamicSuffix) return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}`;
	return `${split.stablePrefix}${SYSTEM_PROMPT_CACHE_BOUNDARY}${systemPromptAddition}\n\n${dynamicSuffix}`;
}
//#endregion
export { stripSystemPromptCacheBoundary as a, splitSystemPromptCacheBoundary as i, ensureSystemPromptCacheBoundary as n, prependSystemPromptAdditionAfterCacheBoundary as r, SYSTEM_PROMPT_CACHE_BOUNDARY as t };

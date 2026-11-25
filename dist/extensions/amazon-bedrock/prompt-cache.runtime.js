import { sanitizeSurrogates } from "openclaw/plugin-sdk/llm";
import { splitSystemPromptCacheBoundary, stripSystemPromptCacheBoundary } from "openclaw/plugin-sdk/provider-transport-runtime";
// extensions/amazon-bedrock/prompt-cache.runtime.ts
function buildBedrockSystemPrompt(systemPrompt, cacheRetention, cachePoint) {
	if (!systemPrompt) return;
	const strippedPrompt = stripSystemPromptCacheBoundary(systemPrompt);
	if (cacheRetention === "none") return [{ text: sanitizeSurrogates(strippedPrompt) }];
	const split = splitSystemPromptCacheBoundary(systemPrompt);
	const stablePrefix = split?.dynamicSuffix ? stripSystemPromptCacheBoundary(split.stablePrefix) : strippedPrompt;
	const dynamicSuffix = split?.dynamicSuffix ? strippedPrompt.slice(stablePrefix.length) : "";
	const blocks = stablePrefix ? [{ text: sanitizeSurrogates(stablePrefix) }] : [];
	if (stablePrefix && cachePoint) blocks.push({ cachePoint });
	if (dynamicSuffix) blocks.push({ text: sanitizeSurrogates(dynamicSuffix) });
	return blocks.length > 0 ? blocks : void 0;
}
export { buildBedrockSystemPrompt };

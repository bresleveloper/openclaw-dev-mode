import { n as isNativeOpenAIEndpoint } from "./openai-completions-compat-CUollwl6.mjs";
//#region packages/normalization-core/src/code-points.ts
/** Truncates to a nonnegative code-point budget; grapheme clusters may be split. */
function truncateCodePoints(text, maxCodePoints) {
	const limit = Math.max(0, Math.trunc(maxCodePoints) || 0);
	if (text.length <= limit) return text;
	const prefix = [];
	for (const codePoint of text) {
		if (prefix.length >= limit) break;
		prefix.push(codePoint);
	}
	return prefix.join("");
}
//#endregion
//#region packages/ai/src/providers/openai-prompt-cache.ts
const EXTENDED_RETENTION_MODELS = /* @__PURE__ */ new Set([
	"gpt-5.5",
	"gpt-5.5-pro",
	"gpt-5.4",
	"gpt-5.2",
	"gpt-5.1-codex-max",
	"gpt-5.1",
	"gpt-5.1-codex",
	"gpt-5.1-codex-mini",
	"gpt-5.1-chat-latest",
	"gpt-5",
	"gpt-5-codex",
	"gpt-4.1"
]);
/** Selects documented lifetime fields shared by Responses and Chat Completions. */
function resolveOpenAIPromptCacheParams(model, cacheRetention, compat) {
	if (cacheRetention !== "long" || !compat.supportsPromptCacheKey || !compat.supportsLongCacheRetention) return {};
	const version = /^gpt-(\d+)(?:\.(\d+))?(?:-|$)/.exec(model.id);
	if (version && (Number(version[1]) > 5 || Number(version[1]) === 5 && Number(version[2]) >= 6)) return { prompt_cache_options: { ttl: "30m" } };
	const modelId = model.id.replace(/-\d{4}-\d{2}-\d{2}$/, "");
	return !isNativeOpenAIEndpoint(model) || EXTENDED_RETENTION_MODELS.has(modelId) ? { prompt_cache_retention: "24h" } : {};
}
/** Maximum prompt cache key length accepted by OpenAI-compatible request metadata. */
const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
/** Truncates a prompt cache key by Unicode code point count. */
function clampOpenAIPromptCacheKey(key) {
	if (key === void 0) return;
	return truncateCodePoints(key, 64);
}
//#endregion
export { clampOpenAIPromptCacheKey as n, resolveOpenAIPromptCacheParams as r, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH as t };

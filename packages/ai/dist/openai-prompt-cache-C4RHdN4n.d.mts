import { M as OpenAICompletionsCompat, O as Model, l as CacheRetention } from "./types-qZFbaDbK.mjs";
import "./types-DTvddOfm.mjs";
//#region packages/ai/src/providers/openai-prompt-cache.d.ts
/** Selects documented lifetime fields shared by Responses and Chat Completions. */
declare function resolveOpenAIPromptCacheParams(model: Pick<Model, "id" | "provider" | "baseUrl">, cacheRetention: CacheRetention, compat: Required<Pick<OpenAICompletionsCompat, "supportsPromptCacheKey" | "supportsLongCacheRetention">>): {
  prompt_cache_retention?: "24h";
  prompt_cache_options?: {
    ttl: "30m";
  };
};
/** Maximum prompt cache key length accepted by OpenAI-compatible request metadata. */
declare const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
/** Truncates a prompt cache key by Unicode code point count. */
declare function clampOpenAIPromptCacheKey(key: string | undefined): string | undefined;
//#endregion
export { clampOpenAIPromptCacheKey as n, resolveOpenAIPromptCacheParams as r, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH as t };
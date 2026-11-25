import { P as OpenAICompletionsCompat, at as StreamOptions, k as Model, l as CacheRetention } from "./types-B1ZIh9Ch.mjs";
import "./types-CeCl7cJZ.mjs";
/** Selects documented lifetime fields shared by Responses and Chat Completions. */
declare function resolveOpenAIPromptCacheParams(model: Pick<Model, "id" | "provider" | "baseUrl">, cacheRetention: CacheRetention, compat: Required<Pick<OpenAICompletionsCompat, "supportsPromptCacheKey" | "supportsLongCacheRetention">>, promptCacheTtl?: StreamOptions["promptCacheTtl"]): {
  prompt_cache_retention?: "24h";
  prompt_cache_options?: {
    ttl: "30m" | "12h";
  };
};
/** Maximum prompt cache key length accepted by OpenAI-compatible request metadata. */
declare const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
/** Truncates a prompt cache key by Unicode code point count. */
declare function clampOpenAIPromptCacheKey(key: string | undefined): string | undefined;
export { clampOpenAIPromptCacheKey as n, resolveOpenAIPromptCacheParams as r, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH as t };
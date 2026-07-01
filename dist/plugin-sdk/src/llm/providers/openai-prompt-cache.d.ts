/** Maximum prompt cache key length accepted by OpenAI-compatible request metadata. */
export declare const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
/** Truncates a prompt cache key by Unicode code point count. */
export declare function clampOpenAIPromptCacheKey(key: string | undefined): string | undefined;

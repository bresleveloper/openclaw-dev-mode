/** Provider/SDK usage payload variants accepted by usage normalization. */
export type UsageLike = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
    inputTokens?: number;
    outputTokens?: number;
    promptTokens?: number;
    completionTokens?: number;
    input_tokens?: number;
    output_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
    reasoningTokens?: number;
    reasoning_tokens?: number;
    completion_tokens_details?: {
        reasoning_tokens?: number;
    };
    output_tokens_details?: {
        reasoning_tokens?: number;
    };
    cached_tokens?: number;
    input_tokens_details?: {
        cached_tokens?: number;
    };
    prompt_tokens_details?: {
        cached_tokens?: number;
    };
    totalTokens?: number;
    total_tokens?: number;
    cache_read?: number;
    cache_write?: number;
    prompt_n?: number;
    predicted_n?: number;
    timings?: {
        prompt_n?: number;
        predicted_n?: number;
    };
};
/** Normalized token counts used by runtime accounting. */
export type NormalizedUsage = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    reasoningTokens?: number;
    total?: number;
};
/** OpenAI chat-completions compatible usage shape. */
export type OpenAiChatCompletionsUsage = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
        cached_tokens: number;
    };
    completion_tokens_details?: {
        reasoning_tokens: number;
    };
};
/** Assistant usage snapshot with token counts and computed cost buckets. */
export type AssistantUsageSnapshot = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    totalTokens: number;
    cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
    };
};
/** Build a zeroed assistant usage snapshot. */
export declare function makeZeroUsageSnapshot(): AssistantUsageSnapshot;
/** Return true when any normalized usage bucket is positive. */
export declare function hasNonzeroUsage(usage?: NormalizedUsage | null): usage is NormalizedUsage;
/** Normalize provider-specific token usage fields into OpenClaw usage buckets. */
export declare function normalizeUsage(raw?: UsageLike | null): NormalizedUsage | undefined;
/**
 * Maps normalized usage to OpenAI Chat Completions `usage` fields.
 *
 * `prompt_tokens` is input + cacheRead (cache write is excluded to match the
 * OpenAI-style breakdown used by the compat endpoint).
 *
 * `total_tokens` is the greater of the component sum and aggregate `total` when
 * present, so a partial breakdown cannot discard a valid upstream total.
 *
 * `prompt_tokens_details.cached_tokens` is emitted when `cacheRead > 0` so
 * downstream chat-completions clients can compute the cache-aware blended
 * cost. Field name and shape match OpenAI's documented usage breakdown:
 * https://platform.openai.com/docs/guides/prompt-caching
 */
export declare function toOpenAiChatCompletionsUsage(usage: NormalizedUsage | undefined): OpenAiChatCompletionsUsage;
/** Derive prompt/context tokens from normalized input and cache buckets. */
export declare function derivePromptTokens(usage?: {
    input?: number;
    cacheRead?: number;
    cacheWrite?: number;
}): number | undefined;
/** Resolve context prompt tokens from explicit override, last call, or aggregate usage. */
export declare function deriveContextPromptTokens(params: {
    lastCallUsage?: NormalizedUsage;
    promptTokens?: number;
    usage?: NormalizedUsage;
}): number | undefined;
/** Derive the session prompt-token snapshot stored for context display. */
export declare function deriveSessionTotalTokens(params: {
    usage?: {
        input?: number;
        output?: number;
        total?: number;
        cacheRead?: number;
        cacheWrite?: number;
    };
    contextTokens?: number;
    promptTokens?: number;
}): number | undefined;

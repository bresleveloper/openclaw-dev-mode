import type { StreamFn } from "./runtime/index.js";
/** Resolve the effective Anthropic API base URL from model or environment. */
export declare function resolveAnthropicBaseUrl(baseUrl?: string): string;
/** Resolve the Anthropic Messages endpoint URL for the effective base URL. */
export declare function resolveAnthropicMessagesUrl(baseUrl?: string): string;
/** Create the stream function used by Anthropic Messages transport models. */
export declare function createAnthropicMessagesTransportStreamFn(): StreamFn;

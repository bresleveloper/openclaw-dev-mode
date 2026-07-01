import type { SimpleStreamOptions, StreamFunction } from "../types.js";
import type { AnthropicOptions } from "./anthropic.js";
import type { AzureOpenAIResponsesOptions } from "./azure-openai-responses.js";
import type { GoogleVertexOptions } from "./google-vertex.js";
import type { MistralOptions } from "./mistral.js";
import type { OpenAICodexResponsesOptions } from "./openai-chatgpt-responses.js";
import type { OpenAICompletionsOptions } from "./openai-completions.js";
import type { OpenAIResponsesOptions } from "./openai-responses.js";
/** Source id used for built-in API provider registrations. */
export declare const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
export declare const streamAnthropic: StreamFunction<"anthropic-messages", AnthropicOptions>;
export declare const streamSimpleAnthropic: StreamFunction<"anthropic-messages", SimpleStreamOptions>;
export declare const streamAzureOpenAIResponses: StreamFunction<"azure-openai-responses", AzureOpenAIResponsesOptions>;
export declare const streamSimpleAzureOpenAIResponses: StreamFunction<"azure-openai-responses", SimpleStreamOptions>;
export declare const streamGoogle: StreamFunction<"google-generative-ai", import("./google-shared.ts").GoogleProviderOptions>;
export declare const streamSimpleGoogle: StreamFunction<"google-generative-ai", SimpleStreamOptions>;
export declare const streamGoogleVertex: StreamFunction<"google-vertex", GoogleVertexOptions>;
export declare const streamSimpleGoogleVertex: StreamFunction<"google-vertex", SimpleStreamOptions>;
export declare const streamMistral: StreamFunction<"mistral-conversations", MistralOptions>;
export declare const streamSimpleMistral: StreamFunction<"mistral-conversations", SimpleStreamOptions>;
export declare const streamOpenAICodexResponses: StreamFunction<"openai-chatgpt-responses", OpenAICodexResponsesOptions>;
export declare const streamSimpleOpenAICodexResponses: StreamFunction<"openai-chatgpt-responses", SimpleStreamOptions>;
export declare const streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
export declare const streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
export declare const streamOpenAIResponses: StreamFunction<"openai-responses", OpenAIResponsesOptions>;
export declare const streamSimpleOpenAIResponses: StreamFunction<"openai-responses", SimpleStreamOptions>;
/** Registers all built-in API providers into the shared runtime registry. */
export declare function registerBuiltInApiProviders(): void;
/** Restores the built-in provider registry state for tests. */
export declare function resetApiProviders(): void;

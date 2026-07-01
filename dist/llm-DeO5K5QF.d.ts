import { E as ThinkingLevel, M as Usage, S as StreamOptions, _ as ProviderStreamOptions, a as AssistantMessageEventStreamContract, c as Context, d as Message, f as Model, n as Api, p as ModelThinkingLevel, r as AssistantMessage, v as SimpleStreamOptions, w as ThinkingBudgets, x as StreamFunction } from "./types-Boa_mcGH.js";
import { Agent } from "node:http";
import { Agent as Agent$1 } from "node:https";

//#region packages/llm-runtime/src/stream.d.ts
/** Streams a provider turn through the registered implementation for the model API. */
declare function stream<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): AssistantMessageEventStreamContract;
/** Runs a provider turn and resolves the final assistant message result. */
declare function complete<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): Promise<AssistantMessage>;
/** Streams a simple provider turn through the registered implementation for the model API. */
declare function streamSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): AssistantMessageEventStreamContract;
/** Runs a simple provider turn and resolves the final assistant message result. */
declare function completeSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): Promise<AssistantMessage>;
//#endregion
//#region src/llm/env-api-keys.d.ts
/**
 * Get API key for provider from known environment variables, e.g. OPENAI_API_KEY.
 *
 * Will not return API keys for providers that require OAuth tokens.
 */
declare function getEnvApiKey(provider: string): string | undefined;
//#endregion
//#region packages/llm-runtime/src/api-registry.d.ts
/** Runtime stream adapter signature stored in the API provider registry. */
type ApiStreamFunction = (model: Model, context: Context, options?: StreamOptions) => AssistantMessageEventStreamContract;
/** Runtime simple-stream adapter signature stored in the API provider registry. */
type ApiStreamSimpleFunction = (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
/** Provider implementation registered by core or plugins for a specific model API. */
interface ApiProvider<TApi extends Api = Api, TOptions extends StreamOptions = StreamOptions> {
  /** Model API id this provider handles. */
  api: TApi;
  /** Full streaming adapter for callers that already own structured options. */
  stream: StreamFunction<TApi, TOptions>;
  /** Simple streaming adapter used by agent and plugin runtime defaults. */
  streamSimple: StreamFunction<TApi, SimpleStreamOptions>;
}
interface ApiProviderInternal {
  api: Api;
  stream: ApiStreamFunction;
  streamSimple: ApiStreamSimpleFunction;
}
/** Registers or replaces the provider implementation for an API id. */
declare function registerApiProvider<TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, /** Optional source id used to unregister all providers owned by one plugin/runtime. */

sourceId?: string): void;
/** Looks up a registered API provider by API id. */
declare function getApiProvider(api: Api): ApiProviderInternal | undefined;
/** Lists all currently registered API providers. */
declare function getApiProviders(): ApiProviderInternal[];
/** Removes all providers registered by a plugin/source id. */
declare function unregisterApiProviders(sourceId: string): void;
//#endregion
//#region src/llm/model-utils.d.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
declare function calculateCost<TApi extends Api>(model: Model<TApi>, usage: Usage): Usage["cost"];
/** Clamps a requested thinking level to the closest supported level for a model. */
declare function clampThinkingLevel<TApi extends Api>(model: Model<TApi>, level: ModelThinkingLevel): ModelThinkingLevel;
//#endregion
//#region src/llm/providers/simple-options.d.ts
declare function buildBaseOptions(model: Model, options?: SimpleStreamOptions, apiKey?: string): StreamOptions;
declare function clampReasoning(effort: ThinkingLevel | undefined): Exclude<ThinkingLevel, "xhigh"> | undefined;
declare function adjustMaxTokensForThinking(baseMaxTokens: number | undefined, modelMaxTokens: number, reasoningLevel: ThinkingLevel, customBudgets?: ThinkingBudgets): {
  maxTokens: number;
  thinkingBudget: number;
};
//#endregion
//#region src/llm/providers/transform-messages.d.ts
/**
 * Normalize tool call ID for cross-provider compatibility.
 * OpenAI Responses API generates IDs that are 450+ chars with special characters like `|`.
 * Anthropic APIs require IDs matching ^[a-zA-Z0-9_-]+$ (max 64 chars).
 */
declare function transformMessages<TApi extends Api>(messages: Message[], model: Model<TApi>, normalizeToolCallId?: (id: string, model: Model<TApi>, source: AssistantMessage) => string): Message[];
//#endregion
//#region src/llm/utils/json-parse.d.ts
/**
 * Attempts to parse potentially incomplete JSON during streaming.
 * Always returns a valid object, even if the JSON is incomplete.
 *
 * @param partialJson The partial JSON string from streaming
 * @returns Parsed object or empty object if parsing fails
 */
declare function parseStreamingJson(partialJson: string | undefined): Record<string, unknown>;
//#endregion
//#region src/llm/utils/node-http-proxy.d.ts
/** HTTP(S) agent pair for Node fetch/client integrations that accept explicit agents. */
interface NodeHttpProxyAgents {
  httpAgent: Agent;
  httpsAgent: Agent$1;
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
declare function createHttpProxyAgentsForTarget(targetUrl: string | URL): NodeHttpProxyAgents | undefined;
//#endregion
//#region src/llm/utils/sanitize-unicode.d.ts
/**
 * Removes unpaired Unicode surrogate characters from a string.
 *
 * Unpaired surrogates (high surrogates 0xD800-0xDBFF without matching low surrogates 0xDC00-0xDFFF,
 * or vice versa) cause JSON serialization errors in many API providers.
 *
 * Valid emoji and other characters outside the Basic Multilingual Plane use properly paired
 * surrogates and will NOT be affected by this function.
 *
 * @param text - The text to sanitize
 * @returns The sanitized text with unpaired surrogates removed
 *
 * @example
 * // Valid emoji (properly paired surrogates) are preserved
 * sanitizeSurrogates("Hello 🙈 World") // => "Hello 🙈 World"
 *
 * // Unpaired high surrogate is removed
 * const unpaired = String.fromCharCode(0xD83D); // high surrogate without low
 * sanitizeSurrogates(`Text ${unpaired} here`) // => "Text  here"
 */
declare function sanitizeSurrogates(text: string): string;
//#endregion
export { completeSimple as _, adjustMaxTokensForThinking as a, calculateCost as c, getApiProvider as d, getApiProviders as f, complete as g, getEnvApiKey as h, transformMessages as i, clampThinkingLevel as l, unregisterApiProviders as m, createHttpProxyAgentsForTarget as n, buildBaseOptions as o, registerApiProvider as p, parseStreamingJson as r, clampReasoning as s, sanitizeSurrogates as t, ApiProvider as u, stream as v, streamSimple as y };
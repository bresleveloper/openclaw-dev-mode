import { _ as ProviderStreamOptions, a as AssistantMessageEventStreamContract, c as Context, f as Model, n as Api, r as AssistantMessage, v as SimpleStreamOptions } from "./types-Boa_mcGH.js";

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
export { streamSimple as a, stream as i, complete as n, completeSimple as r, getEnvApiKey as t };
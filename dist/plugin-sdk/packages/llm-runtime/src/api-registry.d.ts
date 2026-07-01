import type { Api, AssistantMessageEventStreamContract, Context, Model, SimpleStreamOptions, StreamFunction, StreamOptions } from "../../llm-core/src/index.js";
/** Runtime stream adapter signature stored in the API provider registry. */
export type ApiStreamFunction = (model: Model, context: Context, options?: StreamOptions) => AssistantMessageEventStreamContract;
/** Runtime simple-stream adapter signature stored in the API provider registry. */
export type ApiStreamSimpleFunction = (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
/** Provider implementation registered by core or plugins for a specific model API. */
export interface ApiProvider<TApi extends Api = Api, TOptions extends StreamOptions = StreamOptions> {
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
export declare function registerApiProvider<TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, 
/** Optional source id used to unregister all providers owned by one plugin/runtime. */
sourceId?: string): void;
/** Looks up a registered API provider by API id. */
export declare function getApiProvider(api: Api): ApiProviderInternal | undefined;
/** Lists all currently registered API providers. */
export declare function getApiProviders(): ApiProviderInternal[];
/** Removes all providers registered by a plugin/source id. */
export declare function unregisterApiProviders(sourceId: string): void;
/** Clears the registry for test teardown and runtime reset flows. */
export declare function clearApiProviders(): void;
export {};

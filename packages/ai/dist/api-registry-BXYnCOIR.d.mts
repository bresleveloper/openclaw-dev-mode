import { E as Model, F as SimpleStreamOptions, R as StreamFunction, n as Api, o as AssistantMessageEventStreamContract, u as Context, z as StreamOptions } from "./types-DRgdPqaZ.mjs";

//#region packages/ai/src/api-registry.d.ts
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
/** Type-erased provider returned by a registry after API guards are installed. */
interface RegisteredApiProvider {
  api: Api;
  stream: ApiStreamFunction;
  streamSimple: ApiStreamSimpleFunction;
}
/** Creates an isolated provider registry for one runtime or tenant. */
declare function createApiRegistry(): {
  registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
  getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
  getApiProviders: () => RegisteredApiProvider[];
  unregisterApiProviders: (sourceId: string) => void;
  clearApiProviders: () => void;
};
type ApiRegistry = ReturnType<typeof createApiRegistry>;
//#endregion
export { RegisteredApiProvider as a, ApiStreamSimpleFunction as i, ApiRegistry as n, createApiRegistry as o, ApiStreamFunction as r, ApiProvider as t };
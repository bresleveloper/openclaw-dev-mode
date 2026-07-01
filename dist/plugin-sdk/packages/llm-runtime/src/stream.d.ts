import type { Api, AssistantMessage, AssistantMessageEventStreamContract, Context, Model, ProviderStreamOptions, SimpleStreamOptions } from "../../llm-core/src/index.js";
/** Streams a provider turn through the registered implementation for the model API. */
export declare function stream<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): AssistantMessageEventStreamContract;
/** Runs a provider turn and resolves the final assistant message result. */
export declare function complete<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions): Promise<AssistantMessage>;
/** Streams a simple provider turn through the registered implementation for the model API. */
export declare function streamSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): AssistantMessageEventStreamContract;
/** Runs a simple provider turn and resolves the final assistant message result. */
export declare function completeSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): Promise<AssistantMessage>;

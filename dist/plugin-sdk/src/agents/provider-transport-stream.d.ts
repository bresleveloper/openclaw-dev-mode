/**
 * Transport-aware stream factory selection.
 *
 * Routes models that need OpenClaw-managed proxy/TLS/local-service semantics onto built-in transport implementations.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Api, Model } from "../llm/types.js";
import type { StreamFn } from "./runtime/index.js";
type ProviderTransportStreamContext = {
    cfg?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
/** Returns whether OpenClaw has a managed transport implementation for this API. */
export declare function isTransportAwareApiSupported(api: Api): boolean;
/** Maps public model APIs to the internal transport API id used by simple runtime dispatch. */
export declare function resolveTransportAwareSimpleApi(api: Api): Api | undefined;
/** Creates a managed transport stream only when request overrides require it. */
export declare function createTransportAwareStreamFnForModel(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
/** Creates a managed OpenClaw transport stream for explicit fallback/runtime callers. */
export declare function createOpenClawTransportStreamFnForModel(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
export declare function createBoundaryAwareStreamFnForModel(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
export declare function prepareTransportAwareSimpleModel<TApi extends Api>(model: Model<TApi>, ctx?: ProviderTransportStreamContext): Model;
export declare function buildTransportAwareSimpleStreamFn(model: Model, ctx?: ProviderTransportStreamContext): StreamFn | undefined;
export {};

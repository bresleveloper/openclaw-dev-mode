/**
 * Provider stream registration entry point.
 * Resolves plugin-owned or transport-aware stream functions and registers the
 * model API once a concrete stream implementation exists.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Api, Model } from "../llm/types.js";
import type { StreamFn } from "./runtime/index.js";
/** Resolves and registers the stream function for a provider-backed model. */
export declare function registerProviderStreamForModel<TApi extends Api>(params: {
    model: Model<TApi>;
    cfg?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    allowRuntimePluginLoad?: boolean;
}): StreamFn | undefined;

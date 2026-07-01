import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
export declare function resolveAgentRuntimeConfig(runtime: RuntimeEnv, params?: {
    runtimeTargetsChannelSecrets?: boolean;
}): Promise<{
    loadedRaw: OpenClawConfig;
    sourceConfig: OpenClawConfig;
    cfg: OpenClawConfig;
}>;

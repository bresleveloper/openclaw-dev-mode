import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
/** Normalizes a provider model id using plugin manifest-declared model-id policies. */
export declare function normalizeProviderModelIdWithManifest(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    plugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
    context: {
        provider: string;
        modelId: string;
    };
}): string | undefined;

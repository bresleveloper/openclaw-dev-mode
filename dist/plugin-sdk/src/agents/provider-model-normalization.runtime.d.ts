import type { PluginManifestRecord } from "../plugins/manifest-registry.js";
/** Normalizes provider model ids through plugin runtime hooks when available. */
export declare function normalizeProviderModelIdWithRuntime(params: {
    provider: string;
    plugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
    context: {
        provider: string;
        modelId: string;
    };
}): string | undefined;

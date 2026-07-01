import type { PluginDiagnostic } from "./manifest-types.js";
import type { ProviderPlugin } from "./types.js";
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
/** Returns a normalized provider plugin plus validation diagnostics for registry insertion. */
export declare function normalizeRegisteredProvider(params: {
    pluginId: string;
    source: string;
    provider: ProviderPlugin;
    pushDiagnostic: (diag: PluginDiagnostic) => void;
}): ProviderPlugin | null;

import { type MediaGenerationCatalogKind, type MediaGenerationCatalogProvider } from "../../packages/media-generation-core/src/catalog.js";
import { type VoiceModelCapabilities, type VoiceModelProvider } from "../../packages/speech-core/voice-models.js";
import type { PluginDiagnostic } from "./manifest-types.js";
import type { PluginRecord, PluginRegistry } from "./registry-types.js";
import type { ProviderPlugin, UnifiedModelCatalogProviderPlugin } from "./types.js";
/** Creates handlers that register plugin model catalog providers into a registry. */
export declare function createModelCatalogRegistrationHandlers(params: {
    registry: PluginRegistry;
    pushDiagnostic: (diagnostic: PluginDiagnostic) => void;
}): {
    registerModelCatalogProvider: (record: PluginRecord, provider: UnifiedModelCatalogProviderPlugin) => void;
    registerSynthesizedTextModelCatalogProvider: (registration: {
        record: PluginRecord;
        provider: ProviderPlugin;
    }) => void;
    registerSynthesizedMediaModelCatalogProvider: <TCapabilities>(registration: {
        record: PluginRecord;
        kind: MediaGenerationCatalogKind;
        provider: MediaGenerationCatalogProvider<TCapabilities>;
    }) => void;
    registerSynthesizedVoiceModelCatalogProvider: (registration: {
        record: PluginRecord;
        provider: VoiceModelProvider;
        capabilities: VoiceModelCapabilities;
        modes?: readonly string[];
    }) => void;
};

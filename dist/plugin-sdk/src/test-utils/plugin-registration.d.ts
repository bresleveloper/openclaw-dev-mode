import { createCapturedPluginRegistration } from "../plugins/captured-registration.js";
import type { ImageGenerationProviderPlugin, MediaUnderstandingProviderPlugin, MusicGenerationProviderPlugin, OpenClawPluginApi, ProviderPlugin, RealtimeTranscriptionProviderPlugin, SpeechProviderPlugin, UnifiedModelCatalogProviderPlugin, VideoGenerationProviderPlugin } from "../plugins/types.js";
/** Captured registration helpers for provider plugin tests. */
export { createCapturedPluginRegistration };
type RegistrablePlugin = {
    register(api: OpenClawPluginApi): void;
};
export type RegisteredProviderCollections = {
    providers: ProviderPlugin[];
    realtimeTranscriptionProviders: RealtimeTranscriptionProviderPlugin[];
    speechProviders: SpeechProviderPlugin[];
    mediaProviders: MediaUnderstandingProviderPlugin[];
    imageProviders: ImageGenerationProviderPlugin[];
    musicProviders: MusicGenerationProviderPlugin[];
    videoProviders: VideoGenerationProviderPlugin[];
    modelCatalogProviders: UnifiedModelCatalogProviderPlugin[];
};
/** Registers one provider plugin callback and returns its first provider. */
export declare function registerSingleProviderPlugin(params: {
    register(api: OpenClawPluginApi): void;
}): Promise<ProviderPlugin>;
export declare function registerProviderPlugin(params: {
    plugin: RegistrablePlugin;
    id: string;
    name: string;
}): Promise<RegisteredProviderCollections>;
export declare function registerProviderPlugins(...plugins: RegistrablePlugin[]): Promise<ProviderPlugin[]>;
export declare function requireRegisteredProvider<T extends {
    id: string;
    hookAliases?: readonly string[];
}>(providers: T[], providerId: string, label?: string): T;

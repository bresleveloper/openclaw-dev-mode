export type VoiceModelCapability = "tts" | "realtime_transcription" | "realtime_voice";
/** Capability flags advertised by a voice model catalog entry. */
export type VoiceModelCapabilities = Partial<Record<VoiceModelCapability, true>>;
/** Provider/model override parsed from config. */
export type VoiceModelRef = {
    provider: string;
    model: string;
    timeoutMs?: number;
};
/** Static provider metadata used to validate configured voice model refs. */
export type VoiceModelProvider = {
    id: string;
    aliases?: readonly string[];
    label?: string;
    defaultModel?: string | null;
    models?: readonly string[];
};
/** Synthesized voice model catalog row exposed to provider/model selection. */
export type VoiceModelCatalogEntry = {
    kind: "voice";
    provider: string;
    model: string;
    source: "static";
    capabilities: VoiceModelCapabilities;
    label?: string;
    default?: boolean;
    modes?: readonly string[];
};
/** Ordered provider candidate, optionally with a concrete voice model override. */
export type VoiceProviderCandidate = {
    provider: string;
    voiceModel?: VoiceModelRef;
};
/** Match provider ids case-insensitively across canonical id and aliases. */
export declare function providerMatchesId(provider: VoiceModelProvider, providerId?: string): boolean;
/** Find the provider metadata for a configured provider id or alias. */
export declare function findVoiceModelProvider<T extends VoiceModelProvider>(params: {
    providers: readonly T[];
    providerId?: string;
}): T | undefined;
/** Return true when a provider advertises the requested model. */
export declare function voiceProviderSupportsModel(provider: VoiceModelProvider | undefined, model: unknown): boolean;
/** Parse primary/fallback voice model refs from config. */
export declare function resolveVoiceModelRefs(config: unknown): VoiceModelRef[];
/** Resolve configured voice model refs that are supported by known providers. */
export declare function resolveSupportedVoiceModelRefs(params: {
    config: unknown;
    providers: readonly VoiceModelProvider[];
    providerId?: string;
}): VoiceModelRef[];
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
export declare function resolveVoiceProviderCandidates(params: {
    primaryProvider: string;
    providers: readonly VoiceModelProvider[];
    voiceModelConfig?: unknown;
}): VoiceProviderCandidate[];
/** Resolve only the primary provider candidate for direct synthesis paths. */
export declare function resolvePrimaryVoiceProviderCandidate(params: {
    primaryProvider: string;
    providers: readonly VoiceModelProvider[];
    voiceModelConfig?: unknown;
}): VoiceProviderCandidate;
/** Read provider config by configured id, canonical id, or alias. */
export declare function getVoiceProviderConfig<TConfig extends Record<string, unknown>>(params: {
    providerConfigs: Record<string, TConfig | undefined>;
    provider: VoiceModelProvider;
    configuredProviderId?: string;
}): TConfig;
/** Convert provider metadata into static voice catalog entries. */
export declare function synthesizeVoiceModelCatalogEntries(params: {
    provider: VoiceModelProvider;
    capabilities: VoiceModelCapabilities;
    modes?: readonly string[];
}): VoiceModelCatalogEntry[];

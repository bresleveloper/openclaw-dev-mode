/** One configured model reference plus its config path. */
export type ConfiguredModelRef = {
    path: string;
    value: string;
};
/** Agent config keys that can contain direct model references. */
export declare const AGENT_MODEL_CONFIG_KEYS: readonly ["model", "imageModel", "imageGenerationModel", "videoGenerationModel", "musicGenerationModel", "voiceModel", "pdfModel"];
/** Collect configured model references from agents, channels, hooks, and message config. */
export declare function collectConfiguredModelRefs(config: unknown, options?: {
    includeChannelModelOverrides?: boolean;
}): ConfiguredModelRef[];
/** Collect only configured model reference values. */
export declare function collectConfiguredModelRefValues(config: unknown, options?: {
    includeChannelModelOverrides?: boolean;
}): string[];
/** Extract a normalized provider id from a provider/model reference. */
export declare function extractProviderFromModelRef(value: string): string | null;

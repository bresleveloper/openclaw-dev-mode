type ConfigSetMode = "value" | "json" | "ref_builder" | "provider_builder" | "batch";
type ConfigSetModeResolution = {
    ok: true;
    mode: ConfigSetMode;
} | {
    ok: false;
    error: string;
};
/** Resolve the config-set input mode or return the exact flag-conflict error. */
export declare function resolveConfigSetMode(params: {
    hasBatchMode: boolean;
    hasRefBuilderOptions: boolean;
    hasProviderBuilderOptions: boolean;
    strictJson: boolean;
}): ConfigSetModeResolution;
export {};

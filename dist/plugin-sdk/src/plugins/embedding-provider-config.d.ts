import type { OpenClawConfig } from "../config/types.openclaw.js";
type ConfiguredModelProvider = NonNullable<NonNullable<OpenClawConfig["models"]>["providers"]>[string];
/** Reads a configured provider's backing API id when runtime lookup should follow an alias. */
export declare function readConfiguredProviderApiId(params: {
    providerId: string;
    cfg?: OpenClawConfig;
    resolveApiProviderId?: (normalizedApiId: string) => string | undefined;
    resolveMissingApiProviderId?: (providerConfig: ConfiguredModelProvider) => string | undefined;
}): string | undefined;
export declare function resolveConfiguredGenericEmbeddingProviderId(providerId: string, cfg?: OpenClawConfig): string | undefined;
export {};

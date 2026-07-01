import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** External CLI auth discovery mode used while loading auth profile stores. */
export type ExternalCliAuthDiscovery = {
    mode: "none";
    allowKeychainPrompt?: false;
    config?: OpenClawConfig;
} | {
    mode: "existing";
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
} | {
    mode: "scoped";
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    providerIds?: Iterable<string>;
    profileIds?: Iterable<string>;
};
type ProviderAuthDiscoveryParams = {
    cfg?: OpenClawConfig;
    provider: string;
    profileId?: string;
    preferredProfile?: string;
    allowKeychainPrompt?: boolean;
};
type ConfigStatusDiscoveryParams = {
    cfg: OpenClawConfig;
    allowKeychainPrompt?: false;
};
type ProviderSetDiscoveryParams = {
    cfg?: OpenClawConfig;
    providers: Iterable<string>;
    allowKeychainPrompt?: false;
};
/** Disables external CLI auth discovery. */
export declare function externalCliDiscoveryNone(params?: {
    config?: OpenClawConfig;
}): ExternalCliAuthDiscovery;
/** Allows external CLI auth discovery for specific providers and/or profiles. */
export declare function externalCliDiscoveryScoped(params: {
    config?: OpenClawConfig;
    providerIds?: Iterable<string>;
    profileIds?: Iterable<string>;
    allowKeychainPrompt?: boolean;
}): ExternalCliAuthDiscovery;
/** Builds external CLI discovery options for a provider auth lookup. */
export declare function externalCliDiscoveryForProviderAuth(params: ProviderAuthDiscoveryParams): ExternalCliAuthDiscovery;
/** Builds external CLI discovery options for config status checks. */
export declare function externalCliDiscoveryForConfigStatus(params: ConfigStatusDiscoveryParams): ExternalCliAuthDiscovery;
/** Builds external CLI discovery options for a provider set. */
export declare function externalCliDiscoveryForProviders(params: ProviderSetDiscoveryParams): ExternalCliAuthDiscovery;
export {};

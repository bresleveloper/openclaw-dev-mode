import type { OpenClawConfig } from "../config/types.js";
import type { SpeechProviderPlugin } from "../plugins/types.js";
import type { SpeechProviderId } from "./provider-types.js";
/** Resolver contract used by default and loaded-only speech provider registries. */
export type SpeechProviderRegistryResolver = {
    getProvider: (providerId: string, cfg?: OpenClawConfig) => SpeechProviderPlugin | undefined;
    listProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
};
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
export declare function normalizeSpeechProviderId(providerId: string | undefined): SpeechProviderId | undefined;
/** Create a registry facade with canonical listing, alias lookup, and ID canonicalization. */
export declare function createSpeechProviderRegistry(resolver: SpeechProviderRegistryResolver): {
    canonicalizeSpeechProviderId: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderId | undefined;
    getSpeechProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderPlugin | undefined;
    listSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
};

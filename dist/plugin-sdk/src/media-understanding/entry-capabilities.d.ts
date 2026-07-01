import type { MediaUnderstandingModelConfig } from "../config/types.tools.js";
import type { MediaUnderstandingCapability, MediaUnderstandingCapabilityRegistry } from "./types.js";
/** Returns valid explicit capability tags from a media model entry. */
export declare function resolveConfiguredMediaEntryCapabilities(entry: MediaUnderstandingModelConfig): MediaUnderstandingCapability[] | undefined;
/** Resolves the capability set for an entry, inferring shared provider entries from metadata. */
export declare function resolveEffectiveMediaEntryCapabilities(params: {
    entry: MediaUnderstandingModelConfig;
    source: "shared" | "capability";
    providerRegistry: MediaUnderstandingCapabilityRegistry;
}): MediaUnderstandingCapability[] | undefined;
/** Tests whether an entry should be considered for a requested media capability. */
export declare function matchesMediaEntryCapability(params: {
    entry: MediaUnderstandingModelConfig;
    source: "shared" | "capability";
    capability: MediaUnderstandingCapability;
    providerRegistry: MediaUnderstandingCapabilityRegistry;
}): boolean;

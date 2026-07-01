import type { MediaUnderstandingCapability, MediaUnderstandingProvider } from "./types.js";
/** Return true when a provider exposes the method for a media capability. */
export declare function providerSupportsCapability(provider: MediaUnderstandingProvider | undefined, capability: MediaUnderstandingCapability): boolean;

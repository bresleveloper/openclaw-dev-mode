import type { OpenClawConfig } from "../config/types.js";
import type { MediaUnderstandingProvider } from "./types.js";
export { normalizeMediaExecutionProviderId, normalizeMediaProviderId } from "./provider-id.js";
/** Builds the media-understanding provider registry from plugin capabilities and config providers. */
export declare function buildMediaUnderstandingRegistry(overrides?: Record<string, MediaUnderstandingProvider>, cfg?: OpenClawConfig): Map<string, MediaUnderstandingProvider>;
/** Looks up a media-understanding provider using the same id normalization as registry builds. */
export declare function getMediaUnderstandingProvider(id: string, registry: Map<string, MediaUnderstandingProvider>): MediaUnderstandingProvider | undefined;

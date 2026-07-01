/** Registry for image-generation providers contributed by plugin capabilities. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ImageGenerationProviderPlugin } from "../plugins/types.js";
/** Lists canonical image-generation providers visible for config. */
export declare function listImageGenerationProviders(cfg?: OpenClawConfig): ImageGenerationProviderPlugin[];
/** Resolves an image-generation provider by canonical id or alias. */
export declare function getImageGenerationProvider(providerId: string | undefined, cfg?: OpenClawConfig): ImageGenerationProviderPlugin | undefined;

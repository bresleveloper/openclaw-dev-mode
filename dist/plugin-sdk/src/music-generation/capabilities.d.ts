import type { MusicGenerationEditCapabilities, MusicGenerationMode, MusicGenerationModeCapabilities, MusicGenerationProvider } from "./types.js";
/**
 * Capability helpers for music generation providers.
 *
 * Music generation can run as prompt-only generation or image-conditioned edit;
 * these helpers choose the active mode and return the matching capability block.
 */
/** Resolve generation mode from the presence of input images. */
export declare function resolveMusicGenerationMode(params: {
    inputImageCount?: number;
}): MusicGenerationMode;
/** List modes supported by a provider in stable display order. */
export declare function listSupportedMusicGenerationModes(provider: Pick<MusicGenerationProvider, "capabilities">): MusicGenerationMode[];
/** Resolve the active mode and provider capability contract for one request. */
export declare function resolveMusicGenerationModeCapabilities(params: {
    provider?: Pick<MusicGenerationProvider, "capabilities">;
    inputImageCount?: number;
}): {
    mode: MusicGenerationMode;
    capabilities: MusicGenerationModeCapabilities | MusicGenerationEditCapabilities | undefined;
};

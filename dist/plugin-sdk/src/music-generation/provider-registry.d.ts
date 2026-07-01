import type { OpenClawConfig } from "../config/types.js";
import type { MusicGenerationProviderPlugin } from "../plugins/types.js";
/** List canonical music generation providers available for the current config. */
export declare function listMusicGenerationProviders(cfg?: OpenClawConfig): MusicGenerationProviderPlugin[];
/** Resolve a music generation provider by canonical id or alias. */
export declare function getMusicGenerationProvider(providerId: string | undefined, cfg?: OpenClawConfig): MusicGenerationProviderPlugin | undefined;

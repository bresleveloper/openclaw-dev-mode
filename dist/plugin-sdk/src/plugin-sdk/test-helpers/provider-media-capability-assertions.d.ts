import type { MusicGenerationProviderPlugin } from "../../plugins/types.js";
import type { VideoGenerationProviderPlugin } from "../../plugins/types.js";
/** Verifies a video provider declares coherent generate/image/video capability flags. */
export declare function expectExplicitVideoGenerationCapabilities(provider: VideoGenerationProviderPlugin): void;
/** Verifies a music provider declares coherent generate/edit capability flags. */
export declare function expectExplicitMusicGenerationCapabilities(provider: MusicGenerationProviderPlugin): void;

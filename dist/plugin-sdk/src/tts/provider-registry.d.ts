import type { OpenClawConfig } from "../config/types.js";
import type { SpeechProviderPlugin } from "../plugins/types.js";
export { normalizeSpeechProviderId } from "./provider-registry-core.js";
/** List configured speech providers using manifest/capability discovery. */
export declare const listSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** List currently loaded speech providers from the active runtime registry. */
export declare const listLoadedSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** Resolve a configured speech provider by canonical ID or alias. */
export declare const getSpeechProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderPlugin | undefined;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
export declare const canonicalizeSpeechProviderId: (providerId: string | undefined, cfg?: OpenClawConfig) => import("./provider-types.ts").SpeechProviderId | undefined;

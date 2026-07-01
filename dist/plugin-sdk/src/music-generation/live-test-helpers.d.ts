import type { OpenClawConfig } from "../config/types.js";
import { parseProviderModelMap, redactLiveApiKey } from "../media-generation/live-test-helpers.js";
/**
 * Live-test helpers for music generation providers.
 *
 * This module adapts the shared media live-test parsing/auth helpers to the
 * music-generation config key and default provider model list.
 */
export { parseProviderModelMap, redactLiveApiKey };
/** Default live model refs used when a provider is enabled but not explicitly mapped. */
export declare const DEFAULT_LIVE_MUSIC_MODELS: Record<string, string>;
/** Parse a comma-separated provider/model filter for live music tests. */
export declare function parseCsvFilter(raw?: string): Set<string> | null;
/** Resolve configured provider/model refs from the musicGenerationModel defaults. */
export declare function resolveConfiguredLiveMusicModels(cfg: OpenClawConfig): Map<string, string>;
/** Resolve whether live music tests should require auth profile keys. */
export declare function resolveLiveMusicAuthStore(params: {
    requireProfileKeys: boolean;
    hasLiveKeys: boolean;
}): import("../agents/auth-profiles.ts").AuthProfileStore | undefined;

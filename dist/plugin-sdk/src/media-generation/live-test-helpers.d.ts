import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
type LiveProviderModelConfig = string | {
    primary?: string;
    fallbacks?: readonly string[];
} | undefined;
/** Redacts live API keys while preserving enough shape for diagnostics. */
export declare function redactLiveApiKey(value: string | undefined): string;
/** Parses comma-separated live-test filters; null means "all". */
export declare function parseLiveCsvFilter(raw?: string, options?: {
    lowercase?: boolean;
}): Set<string> | null;
/** Parses provider/model refs keyed by normalized provider id. */
export declare function parseProviderModelMap(raw?: string): Map<string, string>;
/** Collects primary/fallback provider model refs from live-test config. */
export declare function resolveConfiguredLiveProviderModels(configured: LiveProviderModelConfig): Map<string, string>;
/** Returns an empty auth store only when live env keys may be used directly. */
export declare function resolveLiveAuthStore(params: {
    requireProfileKeys: boolean;
    hasLiveKeys: boolean;
}): AuthProfileStore | undefined;
export {};

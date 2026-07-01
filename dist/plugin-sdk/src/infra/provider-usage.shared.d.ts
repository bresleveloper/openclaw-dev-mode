import type { UsageProviderId } from "./provider-usage.types.js";
/** Default timeout for provider usage collection. */
export declare const DEFAULT_TIMEOUT_MS = 5000;
export declare const PROVIDER_LABELS: Record<UsageProviderId, string>;
export declare const usageProviders: UsageProviderId[];
/** Returns true for providers whose usage endpoint is only meaningful with OAuth/token auth. */
export declare function isOAuthOnlyUsageProvider(provider: UsageProviderId): boolean;
/** Maps model/provider ids and credential type into supported usage provider ids. */
export declare function resolveUsageProviderId(provider?: string | null, options?: {
    credentialType?: string | null;
}): UsageProviderId | undefined;
export declare const ignoredErrors: Set<string>;
export declare const clampPercent: (value: number) => number;
/** Resolves a promise with a fallback when usage collection exceeds the timeout. */
export declare const withTimeout: <T>(work: Promise<T>, ms: number, fallback: T) => Promise<T>;

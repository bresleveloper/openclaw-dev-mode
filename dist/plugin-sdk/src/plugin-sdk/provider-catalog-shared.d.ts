import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelProviderConfig } from "./provider-model-shared.js";
export type { ProviderCatalogContext, ProviderCatalogResult } from "../plugins/types.js";
export { buildPairedProviderApiKeyCatalog, buildSingleProviderApiKeyCatalog, findCatalogTemplate, } from "../plugins/provider-catalog.js";
/**
 * Normalized model row read from user config for provider catalog augmentation.
 */
export type ConfiguredProviderCatalogEntry = {
    /** Normalized model id as exposed through provider catalog discovery. */
    id: string;
    /** Display name from config, falling back to the normalized id. */
    name: string;
    /** Published provider id attached to this catalog entry. */
    provider: string;
    /** Optional context window copied from the configured model row when positive. */
    contextWindow?: number;
    /** Whether the configured model advertises reasoning support. */
    reasoning?: boolean;
    /** Runtime input modalities retained from the configured model row. */
    input?: Array<"text" | "image" | "audio" | "video" | "document">;
};
/**
 * Caches one live catalog load promise by stable key parts for a short TTL.
 */
export declare function getCachedLiveCatalogValue<T>(params: {
    /** Stable JSON-serializable values that identify one provider/config catalog load. */
    keyParts: readonly unknown[];
    /** Loader for the live catalog value when no fresh cache entry exists. */
    load: () => Promise<T>;
    /** Optional predicate for values that are healthy enough to retain. */
    shouldCache?: (value: T) => boolean;
    /** Cache lifetime in milliseconds; defaults to a short provider-discovery TTL. */
    ttlMs?: number;
    /** Test hook for deterministic cache expiry. */
    now?: () => number;
}): Promise<T>;
/**
 * Clears the process-local live catalog cache for tests and isolated plugin probes.
 */
export declare function clearLiveCatalogCacheForTests(): void;
/**
 * Converts a plugin manifest modelCatalog provider into runtime provider config.
 */
export declare function buildManifestModelProviderConfig(params: {
    /** Provider id that owns the manifest catalog rows. */
    providerId: string;
    /** Raw manifest modelCatalog provider block to normalize into runtime config. */
    catalog: unknown;
}): ModelProviderConfig;
/**
 * Reads user-configured provider models as catalog entries for plugin discovery output.
 */
export declare function readConfiguredProviderCatalogEntries(params: {
    /** Runtime config containing optional user-defined provider model rows. */
    config?: OpenClawConfig;
    /** Provider id used to locate configured model rows. */
    providerId: string;
    /** Provider id to publish on emitted catalog entries when it differs from lookup id. */
    publishedProviderId?: string;
}): ConfiguredProviderCatalogEntry[];
/**
 * Returns whether a provider transport can report native usage while streaming.
 */
export declare function supportsNativeStreamingUsageCompat(params: {
    /** Provider id used for transport capability lookup. */
    providerId: string;
    /** Provider endpoint URL used to detect native streaming usage behavior. */
    baseUrl: string | undefined;
}): boolean;
/**
 * Marks models as streaming-usage compatible when provider transport capabilities allow it.
 */
export declare function applyProviderNativeStreamingUsageCompat(params: {
    /** Provider id used for transport capability lookup. */
    providerId: string;
    /** Runtime provider config whose model compat flags may be filled in. */
    providerConfig: ModelProviderConfig;
}): ModelProviderConfig;

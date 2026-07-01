import type { PluginManifestRecord } from "../plugins/manifest-registry.js";
export type ModelRef = {
    provider: string;
    model: string;
};
export type ModelManifestNormalizationContext = {
    manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
/** Build the canonical provider/model key for model selection. */
export declare function modelKey(provider: string, model: string): string;
/** Return the legacy raw key when it differs from the canonical key. */
export declare function legacyModelKey(provider: string, model: string): string | null;
/** Normalize a provider ID using the shared catalog rules. */
export declare function normalizeProviderId(provider: string): string;
/** Normalize a provider ID for auth lookup. */
export declare function normalizeProviderIdForAuth(provider: string): string;
/** Find a provider value by normalized provider ID. */
export declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
/** Find the original provider key matching a normalized provider ID. */
export declare function findNormalizedProviderKey(entries: Record<string, unknown> | undefined, provider: string): string | undefined;
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
};
/** Normalize a provider/model pair into a canonical model reference. */
export declare function normalizeModelRef(provider: string, model: string, options?: ModelRefNormalizeOptions): ModelRef;
type ParseModelRefOptions = ModelRefNormalizeOptions;
/** Parse `provider/model` or bare model text using a default provider. */
export declare function parseModelRef(raw: string, defaultProvider: string, options?: ParseModelRefOptions): ModelRef | null;
export {};

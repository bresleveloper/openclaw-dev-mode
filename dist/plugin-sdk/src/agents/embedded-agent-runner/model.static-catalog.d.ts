import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../../plugins/provider-runtime-model.types.js";
/** Resolves a provider alias from plugin model-catalog metadata when the alias is unambiguous. */
export declare function canonicalizeManifestModelCatalogProviderAlias(params: {
    provider: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): string;
/** Returns whether a bundled static catalog asks runtime discovery to augment its rows. */
export declare function bundledStaticCatalogProviderUsesRuntimeAugment(params: {
    provider: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
type BundledStaticCatalogLookup = {
    provider: string;
    modelId: string;
};
type BundledStaticCatalogContext = {
    contextWindow?: number;
    contextTokens?: number;
};
type BundledProviderStaticCatalogResolverParams = {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
/**
 * Prepares a process-stable bundled manifest catalog lookup.
 * Manifest discovery runs once; provider-specific plans are cached on demand.
 */
export declare function createBundledStaticCatalogModelResolver(params?: {
    env?: NodeJS.ProcessEnv;
    includeRuntimeDiscovery?: boolean;
}): (lookup: BundledStaticCatalogLookup) => ProviderRuntimeModel | undefined;
/** Resolves one bundled static-catalog model row for provider/model lookup. */
export declare function resolveBundledStaticCatalogModel(params: BundledStaticCatalogLookup & {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includeRuntimeDiscovery?: boolean;
}): ProviderRuntimeModel | undefined;
/** Loads all enabled bundled provider static-catalog rows without live discovery or writes. */
export declare function loadBundledProviderStaticCatalogContextModels(params?: BundledProviderStaticCatalogResolverParams): Promise<ProviderRuntimeModel[]>;
/**
 * Prepares bundled provider static-catalog lookup.
 * Each provider hook runs at most once for the resolver lifetime.
 */
export declare function createBundledProviderStaticCatalogModelResolver(params?: BundledProviderStaticCatalogResolverParams): (lookup: BundledStaticCatalogLookup) => Promise<ProviderRuntimeModel | undefined>;
/**
 * Prepares context-only provider catalog lookup.
 * Nested provider refs may reuse metadata only when both providers have the same plugin owner.
 */
export declare function createBundledProviderStaticCatalogContextResolver(params?: BundledProviderStaticCatalogResolverParams): (lookup: BundledStaticCatalogLookup) => Promise<BundledStaticCatalogContext | undefined>;
/**
 * Resolves one bundled provider static-catalog model row for provider/model lookup.
 *
 * Some bundled providers expose their canonical offline rows through
 * `providerCatalogEntry` instead of manifest `modelCatalog`. This keeps the
 * skip-discovery fallback aligned with model list/inspect without running live
 * discovery or untrusted workspace plugins.
 */
export declare function resolveBundledProviderStaticCatalogModel(params: {
    provider: string;
    modelId: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<ProviderRuntimeModel | undefined>;
export {};

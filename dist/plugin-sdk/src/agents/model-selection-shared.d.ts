import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
import { type ModelManifestNormalizationContext, type ModelRef } from "./model-selection-normalize.js";
type ModelManifestPlugins = ModelManifestNormalizationContext["manifestPlugins"];
export type ModelAliasIndex = {
    byAlias: Map<string, {
        alias: string;
        ref: ModelRef;
    }>;
    byKey: Map<string, string[]>;
};
/** Infer a unique provider for a bare model from configured model rows. */
export declare function inferUniqueProviderFromConfiguredModels(params: {
    cfg: OpenClawConfig;
    model: string;
    allowManifestNormalization?: boolean;
} & ModelManifestNormalizationContext): string | undefined;
/** Infer a unique provider for a bare model from a provider catalog. */
export declare function inferUniqueProviderFromCatalog(params: {
    catalog: readonly ModelCatalogEntry[];
    model: string;
}): string | undefined;
/** Resolve the provider used when a model string omits provider/id syntax. */
export declare function resolveBareModelDefaultProvider(params: {
    cfg: OpenClawConfig;
    catalog: readonly ModelCatalogEntry[];
    model: string;
    defaultProvider: string;
} & ModelManifestNormalizationContext): string;
/** Resolve OpenRouter compatibility aliases such as openrouter:auto/free. */
export declare function resolveConfiguredOpenRouterCompatAlias(params: {
    cfg?: OpenClawConfig;
    raw: string;
    defaultProvider: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelRef | null;
/** Normalize a configured allowlist entry into the canonical provider/model key. */
export declare function resolveAllowlistModelKey(params: {
    cfg?: OpenClawConfig;
    raw: string;
    defaultProvider: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): string | null;
/** Build the exact configured model keys that constrain model visibility. */
export declare function buildConfiguredAllowlistKeys(params: {
    cfg: OpenClawConfig | undefined;
    defaultProvider: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): Set<string> | null;
type BuildModelAliasIndexParams = {
    cfg: OpenClawConfig;
    defaultProvider: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext;
/** Build lookup maps from user-facing aliases to normalized model refs. */
export declare function buildModelAliasIndex(params: BuildModelAliasIndexParams): ModelAliasIndex;
export declare function resolveModelRefFromString(params: {
    cfg?: OpenClawConfig;
    raw: string;
    defaultProvider: string;
    aliasIndex?: ModelAliasIndex;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): {
    ref: ModelRef;
    alias?: string;
} | null;
/** Resolve the default configured model ref, including aliases and fallback provider rows. */
export declare function resolveConfiguredModelRef(params: {
    cfg: OpenClawConfig;
    defaultProvider: string;
    defaultModel: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelRef;
/** Build allowed model keys/catalog entries after provider wildcards and fallbacks. */
export declare function buildAllowedModelSetWithFallbacks(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
    fallbackModels: readonly string[];
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): {
    allowAny: boolean;
    allowedCatalog: ModelCatalogEntry[];
    allowedKeys: Set<string>;
};
/** Status of a candidate model against catalog and configured allowlist state. */
export type ModelRefStatus = {
    key: string;
    inCatalog: boolean;
    allowAny: boolean;
    allowed: boolean;
};
export type ResolveAllowedModelRefResult = {
    ref: ModelRef;
    key: string;
} | {
    error: string;
};
export declare function getModelRefStatusWithFallbackModels(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    ref: ModelRef;
    defaultProvider: string;
    defaultModel?: string;
    fallbackModels: readonly string[];
} & ModelManifestNormalizationContext): ModelRefStatus;
/** Resolve a requested model string only if it is allowed by the supplied status check. */
export declare function resolveAllowedModelRefFromAliasIndex(params: {
    cfg: OpenClawConfig;
    raw: string;
    defaultProvider: string;
    aliasIndex: ModelAliasIndex;
    getStatus: (ref: ModelRef) => ModelRefStatus;
} & ModelManifestNormalizationContext): ResolveAllowedModelRefResult;
/** True when config contains provider model rows that should seed catalogs. */
export declare function hasConfiguredProviderModelRows(cfg: OpenClawConfig): boolean;
/** Build catalog entries from configured provider model rows. */
export declare function buildConfiguredModelCatalog(params: {
    cfg: OpenClawConfig;
    workspaceDir?: string;
    manifestPlugins?: ModelManifestPlugins;
}): ModelCatalogEntry[];
export declare function resolveHooksGmailModel(params: {
    cfg: OpenClawConfig;
    defaultProvider: string;
} & ModelManifestNormalizationContext): ModelRef | null;
export declare function normalizeModelSelection(value: unknown): string | undefined;
export declare function parseConfiguredModelVisibilityEntries(params: {
    cfg?: OpenClawConfig;
}): {
    exactModelRefs: string[];
    providerWildcards: Set<string>;
    hasEntries: boolean;
};
export declare function providerWildcardModelKey(provider: string): string;
export declare function isModelKeyAllowedBySet(allowedKeys: ReadonlySet<string>, key: string): boolean;
export declare function resolveAllowedModelSelection(params: {
    cfg?: OpenClawConfig;
    provider: string;
    model: string;
    allowAny: boolean;
    allowedKeys: ReadonlySet<string>;
    allowedCatalog: readonly ModelCatalogEntry[];
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelRef | null;
export type ModelVisibilityPolicy = {
    allowAny: boolean;
    allowedCatalog: ModelCatalogEntry[];
    allowedKeys: Set<string>;
    exactModelRefs: readonly string[];
    providerWildcards: ReadonlySet<string>;
    hasConfiguredEntries: boolean;
    hasProviderWildcards: boolean;
    allowsKey: (key: string) => boolean;
    allows: (ref: {
        provider: string;
        model: string;
    }) => boolean;
    resolveSelection: (ref: {
        provider: string;
        model: string;
    }) => ModelRef | null;
    visibleCatalog: (params: {
        catalog: readonly ModelCatalogEntry[];
        defaultVisibleCatalog: readonly ModelCatalogEntry[];
        view?: "default" | "configured" | "all";
    }) => ModelCatalogEntry[];
};
export declare function dedupeModelCatalogEntries(entries: readonly ModelCatalogEntry[]): ModelCatalogEntry[];
export declare function createModelVisibilityPolicyWithFallbacks(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
    fallbackModels: readonly string[];
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelVisibilityPolicy;
export {};

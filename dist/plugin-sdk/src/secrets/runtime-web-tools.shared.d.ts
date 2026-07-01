import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ResolverContext, SecretDefaults, SecretResolverWarningCode } from "./runtime-shared.js";
import type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode } from "./runtime-web-tools.types.js";
export { isRecord } from "./shared.js";
type RuntimeWebWarningCode = Extract<RuntimeWebDiagnosticCode, SecretResolverWarningCode>;
/**
 * Result of resolving one provider credential from config, SecretRef, env, or fallback.
 */
export type SecretResolutionResult<TSource extends string> = {
    value?: string;
    source: TSource;
    secretRefConfigured: boolean;
    unresolvedRefReason?: string;
    fallbackEnvVar?: string;
    fallbackUsedAfterRefFailure: boolean;
};
/**
 * Metadata fields shared by runtime web search and fetch provider selection.
 */
export type RuntimeWebProviderMetadataBase<TSource extends string> = {
    providerConfigured?: string;
    providerSource: "configured" | "auto-detect" | "none";
    selectedProvider?: string;
    selectedProviderKeySource?: TSource;
    diagnostics: RuntimeWebDiagnostic[];
};
/**
 * Parameters shared by web search/fetch provider selection after provider surface discovery.
 */
export type RuntimeWebProviderSelectionParams<TProvider extends {
    id: string;
    requiresCredential?: boolean;
}, TToolConfig extends Record<string, unknown> | undefined, TSource extends string, TMetadata extends RuntimeWebProviderMetadataBase<TSource>> = {
    scopePath: string;
    toolConfig: TToolConfig;
    enabled: boolean;
    providers: TProvider[];
    configuredProvider?: string;
    metadata: TMetadata;
    diagnostics: RuntimeWebDiagnostic[];
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    context: ResolverContext;
    defaults: SecretDefaults | undefined;
    /** Allow keyless providers to be selected when no provider is explicitly configured. */
    allowKeylessAutoSelect: boolean;
    /** Defer keyless providers until credential-bearing auto-detect candidates are exhausted. */
    deferKeylessFallback: boolean;
    fallbackUsedCode: RuntimeWebWarningCode;
    noFallbackCode: RuntimeWebWarningCode;
    autoDetectSelectedCode: RuntimeWebWarningCode;
    /** Reads the primary credential location for a provider from source config. */
    readConfiguredCredential: (params: {
        provider: TProvider;
        config: OpenClawConfig;
        toolConfig: TToolConfig;
    }) => unknown;
    readConfiguredCredentialFallback?: (params: {
        provider: TProvider;
        config: OpenClawConfig;
        toolConfig: TToolConfig;
    }) => {
        path: string;
        value: unknown;
    } | undefined;
    /** Resolves inline/env/SecretRef credentials and reports the winning source. */
    resolveSecretInput: (params: {
        value: unknown;
        path: string;
        envVars: string[];
    }) => Promise<SecretResolutionResult<TSource>>;
    /** Writes the selected credential into the resolved runtime config snapshot. */
    setResolvedCredential: (params: {
        resolvedConfig: OpenClawConfig;
        provider: TProvider;
        value: string;
    }) => void;
    inactivePathsForProvider: (provider: TProvider) => string[];
    hasConfiguredSecretRef: (value: unknown, defaults: SecretDefaults | undefined) => boolean;
    mergeRuntimeMetadata?: (params: {
        provider: TProvider;
        metadata: TMetadata;
        toolConfig: TToolConfig;
        selectedResolution?: SecretResolutionResult<TSource>;
    }) => Promise<void>;
};
/**
 * Ensures a nested config object exists and returns it for mutation.
 */
export declare function ensureObject(target: Record<string, unknown>, key: string): Record<string, unknown>;
/**
 * Returns whether a configured value or sibling ref field contains a SecretRef.
 */
export declare function hasConfiguredSecretRef(value: unknown, defaults: SecretDefaults | undefined): boolean;
/**
 * Provider set plus effective config state for one runtime web tool surface.
 */
export type RuntimeWebProviderSurface<TProvider extends {
    id: string;
}> = {
    providers: TProvider[];
    configuredProvider?: string;
    enabled: boolean;
    hasConfiguredSurface: boolean;
};
/**
 * Parameters for resolving configured/available providers before credential selection.
 */
export type ResolveRuntimeWebProviderSurfaceParams<TProvider extends {
    id: string;
    requiresCredential?: boolean;
}, TToolConfig extends Record<string, unknown> | undefined> = {
    contract: "webSearchProviders" | "webFetchProviders";
    rawProvider: string;
    providerPath: string;
    toolConfig: TToolConfig;
    diagnostics: RuntimeWebDiagnostic[];
    metadataDiagnostics: RuntimeWebDiagnostic[];
    invalidAutoDetectCode: RuntimeWebWarningCode;
    sourceConfig: OpenClawConfig;
    context: ResolverContext;
    /** Bundled plugin id already known from caller context, avoiding duplicate manifest lookup. */
    configuredBundledPluginIdHint?: string;
    resolveProviders: (params: {
        configuredBundledPluginId?: string;
    }) => Promise<TProvider[]>;
    sortProviders: (providers: TProvider[]) => TProvider[];
    readConfiguredCredential: (params: {
        provider: TProvider;
        config: OpenClawConfig;
        toolConfig: TToolConfig;
    }) => unknown;
    readConfiguredCredentialFallback?: (params: {
        provider: TProvider;
        config: OpenClawConfig;
        toolConfig: TToolConfig;
    }) => {
        path: string;
        value: unknown;
    } | undefined;
    ignoreKeylessProvidersForConfiguredSurface?: boolean;
    emptyProvidersWhenSurfaceMissing?: boolean;
    normalizeConfiguredProviderAgainstActiveProviders?: boolean;
};
/**
 * Resolves available providers, configured provider validity, and whether the surface is active.
 */
export declare function resolveRuntimeWebProviderSurface<TProvider extends {
    id: string;
    requiresCredential?: boolean;
}, TToolConfig extends Record<string, unknown> | undefined>(params: ResolveRuntimeWebProviderSurfaceParams<TProvider, TToolConfig>): Promise<RuntimeWebProviderSurface<TProvider>>;
/**
 * Selects a configured or auto-detected provider and materializes its resolved credential.
 */
export declare function resolveRuntimeWebProviderSelection<TProvider extends {
    id: string;
    requiresCredential?: boolean;
}, TToolConfig extends Record<string, unknown> | undefined, TSource extends string, TMetadata extends RuntimeWebProviderMetadataBase<TSource>>(params: RuntimeWebProviderSelectionParams<TProvider, TToolConfig, TSource, TMetadata>): Promise<void>;

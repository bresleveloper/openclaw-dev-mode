/** Path marker used to scope plugin-hosted node URLs with one-time capabilities. */
export declare const PLUGIN_NODE_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
/** Default lifetime for plugin-node capability tokens. */
export declare const DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS: number;
/** Declared plugin surface that may receive scoped node capabilities. */
export type PluginNodeCapabilitySurface = {
    surface: string;
    ttlMs?: number;
    scopeKey?: string;
};
/** Client-side storage for surface URLs and minted plugin-node capabilities. */
export type PluginNodeCapabilityClient = {
    pluginSurfaceUrls?: Record<string, string>;
    pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
    pluginNodeCapabilities?: Record<string, {
        capability: string;
        expiresAtMs: number;
    }>;
};
/** Index surfaces by normalized surface id, keeping the strictest TTL per surface. */
export declare function indexPluginNodeCapabilitySurfaces(surfaces: readonly PluginNodeCapabilitySurface[]): Record<string, PluginNodeCapabilitySurface>;
/** Parsed URL details after extracting path/query capability tokens. */
export type NormalizedPluginNodeCapabilityUrl = {
    pathname: string;
    capability?: string;
    rewrittenUrl?: string;
    scopedPath: boolean;
    malformedScopedPath: boolean;
};
/** Resolve a positive TTL for a plugin-node capability surface. */
export declare function resolvePluginNodeCapabilityTtlMs(surface: PluginNodeCapabilitySurface): number;
/** Resolve the expiration timestamp for a capability minted against a surface. */
export declare function resolvePluginNodeCapabilityExpiresAtMs(surface: PluginNodeCapabilitySurface, nowMs?: number): number | undefined;
/** Mint an opaque capability token for plugin-node surface access. */
export declare function mintPluginNodeCapabilityToken(): string;
/** Append a capability path segment to a plugin host URL. */
export declare function buildPluginNodeCapabilityScopedHostUrl(baseUrl: string, capability: string): string | undefined;
/** Replace the capability segment in an already scoped host URL. */
export declare function replacePluginNodeCapabilityInScopedHostUrl(scopedUrl: string, capability: string): string | undefined;
/** Parse and rewrite scoped capability URLs into canonical paths plus query tokens. */
export declare function normalizePluginNodeCapabilityScopedUrl(rawUrl: string): NormalizedPluginNodeCapabilityUrl;
/** Store a minted capability on a client under the surface/scope storage key. */
export declare function setClientPluginNodeCapability(params: {
    client: PluginNodeCapabilityClient;
    surface: PluginNodeCapabilitySurface;
    capability: string;
    expiresAtMs: number;
}): void;
export declare function refreshClientPluginNodeCapability(params: {
    client: PluginNodeCapabilityClient;
    surface: PluginNodeCapabilitySurface;
    nowMs?: number;
}): {
    surface: string;
    capability: string;
    expiresAtMs: number;
    scopedUrl: string;
} | undefined;
export declare function hasAuthorizedPluginNodeCapability(params: {
    clients: Iterable<PluginNodeCapabilityClient>;
    surface: PluginNodeCapabilitySurface;
    capability: string;
    nowMs?: number;
}): boolean;

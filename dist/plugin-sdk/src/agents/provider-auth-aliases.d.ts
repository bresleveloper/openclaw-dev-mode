import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.types.js";
/** Inputs that control plugin metadata and trust scope for auth alias lookup. */
export type ProviderAuthAliasLookupParams = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includeUntrustedWorkspacePlugins?: boolean;
    metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
/** Clear provider auth alias cache for tests that mutate plugin metadata. */
export declare function resetProviderAuthAliasMapCacheForTest(): void;
/** Resolve canonical auth provider aliases from plugin metadata. */
export declare function resolveProviderAuthAliasMap(params?: ProviderAuthAliasLookupParams): Record<string, string>;
/** Resolve the provider ID that should be used for credential lookup. */
export declare function resolveProviderIdForAuth(provider: string, params?: ProviderAuthAliasLookupParams): string;

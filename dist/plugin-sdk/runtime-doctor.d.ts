import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-Bm0_upwK.js";
import { t as collectProviderDangerousNameMatchingScopes } from "./dangerous-name-matching-CuJZ51RE.js";
import { c as normalizeLegacyDmAliases, i as CompatMutationResult } from "./dm-access-BLdoaTNe.js";
import { t as createPluginStateSyncKeyedStore } from "./plugin-state-store-CDXQLi__.js";
import { n as detectPluginInstallPathIssue, r as formatPluginInstallPathIssue, t as removePluginFromConfig } from "./uninstall-BCZVKB-y.js";

//#region src/config/channel-compat-normalization.d.ts
/** Resolved streaming values a channel doctor supplies while migrating legacy aliases. */
type LegacyStreamingAliasOptions = {
  resolvedMode: string;
  includePreviewChunk?: boolean;
  resolvedNativeTransport?: unknown;
  offModeLegacyNotice?: (pathPrefix: string) => string;
};
/** Account-level channel config passed to channel-specific doctor migrations. */
type NormalizeLegacyChannelAccountParams = {
  account: Record<string, unknown>;
  accountId: string;
  pathPrefix: string;
  changes: string[];
};
/** Narrows unknown config JSON values to mutable object records. */
declare function asObjectRecord(value: unknown): Record<string, unknown> | null;
/** Checks whether any account entry still carries a channel-specific legacy alias. */
declare function hasLegacyAccountStreamingAliases(value: unknown, match: (entry: unknown) => boolean): boolean;
/**
 * Moves legacy flat streaming aliases into the nested `streaming` config shape.
 *
 * Existing nested values win over legacy aliases, matching doctor migration rules
 * that preserve explicit modern config while removing stale compatibility keys.
 */
declare function normalizeLegacyStreamingAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
} & LegacyStreamingAliasOptions): CompatMutationResult;
/**
 * Runs generic channel doctor alias migration for the root entry and accounts.
 *
 * Channel plugins provide streaming resolution and optional account-specific
 * migrations so core can keep one compatibility path for all channel shapes.
 */
declare function normalizeLegacyChannelAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  normalizeDm?: boolean;
  rootDmPromoteAllowFrom?: boolean;
  normalizeAccountDm?: boolean;
  resolveStreamingOptions: (entry: Record<string, unknown>) => LegacyStreamingAliasOptions;
  normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
}): CompatMutationResult;
/** Detects legacy streaming aliases on one channel or account config entry. */
declare function hasLegacyStreamingAliases(value: unknown, options?: {
  includePreviewChunk?: boolean;
  includeNativeTransport?: boolean;
}): boolean;
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.d.ts
type DoctorSessionRouteStateOwner = {
  id: string;
  label: string;
  providerIds?: readonly string[];
  runtimeIds?: readonly string[];
  cliSessionKeys?: readonly string[];
  authProfilePrefixes?: readonly string[];
};
//#endregion
//#region src/plugins/doctor-contract-registry.d.ts
type PluginDoctorStateMigrationDetection = {
  preview: string[];
};
type PluginDoctorStateMigrationContext = {
  openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
};
type PluginDoctorStateMigration = {
  id: string;
  label: string;
  detectLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<PluginDoctorStateMigrationDetection | null> | PluginDoctorStateMigrationDetection | null;
  migrateLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<{
    changes: string[];
    warnings: string[];
  }> | {
    changes: string[];
    warnings: string[];
  };
};
//#endregion
export { type CompatMutationResult, type DoctorSessionRouteStateOwner, type LegacyStreamingAliasOptions, type NormalizeLegacyChannelAccountParams, type OpenKeyedStoreOptions, type PluginDoctorStateMigration, type PluginDoctorStateMigrationContext, type PluginStateKeyedStore, asObjectRecord, collectProviderDangerousNameMatchingScopes, createPluginStateSyncKeyedStore, detectPluginInstallPathIssue, formatPluginInstallPathIssue, hasLegacyAccountStreamingAliases, hasLegacyStreamingAliases, normalizeLegacyChannelAliases, normalizeLegacyDmAliases, normalizeLegacyStreamingAliases, removePluginFromConfig };
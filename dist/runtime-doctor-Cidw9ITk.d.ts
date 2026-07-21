import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { i as CompatMutationResult } from "./dm-access-BLdoaTNe.js";
import { r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-xAF7b0j2.js";
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
    notices?: string[];
  }> | {
    changes: string[];
    warnings: string[];
    notices?: string[];
  };
};
//#endregion
//#region src/plugins/doctor-state-migration-fs.d.ts
/** True when the legacy-state path exists and is a regular file. */
declare function legacyStateFileExists(filePath: string): Promise<boolean>;
/**
 * Renames a migrated legacy source to `<path>.migrated`, recording the outcome in the
 * doctor changes/warnings lists. Never throws: a failed archive leaves the source in
 * place so a later doctor run can retry without losing migrated data.
 */
declare function archiveLegacyStateSource(params: {
  filePath: string;
  label: string;
  changes: string[];
  warnings: string[];
}): Promise<void>;
//#endregion
export { DoctorSessionRouteStateOwner as a, asObjectRecord as c, normalizeLegacyChannelAliases as d, normalizeLegacyStreamingAliases as f, PluginDoctorStateMigrationContext as i, hasLegacyAccountStreamingAliases as l, legacyStateFileExists as n, LegacyStreamingAliasOptions as o, PluginDoctorStateMigration as r, NormalizeLegacyChannelAccountParams as s, archiveLegacyStateSource as t, hasLegacyStreamingAliases as u };
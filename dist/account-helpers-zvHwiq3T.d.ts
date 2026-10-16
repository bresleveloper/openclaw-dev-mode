import { r as OpenClawConfig, wn as ChannelAccountKeyPolicy } from "./types.openclaw-DWWUw8hA.js";
import { r as ChannelAccountSnapshot } from "./types.core-Bra2QBA5.js";
//#region src/channels/plugins/account-action-gate.d.ts
/**
 * Resolves whether an account-scoped action is enabled.
 */
type ActionGate<T extends Record<string, boolean | undefined>> = (key: keyof T, defaultValue?: boolean) => boolean;
/**
 * Creates an action gate where account-specific flags override channel-level defaults.
 */
declare function createAccountActionGate<T extends Record<string, boolean | undefined>>(params: {
  baseActions?: T;
  accountActions?: T;
}): ActionGate<T>;
//#endregion
//#region src/config/channel-account-config.d.ts
type AccountMergeOptions = {
  omitKeys?: string[];
  nestedObjectKeys?: string[];
  inheritEmptyKeys?: Record<string, "array" | "object">;
  preserveRootAllowFrom?: boolean;
};
/** Merge authored account overrides over channel defaults, with owner-selected collection rules. */
declare function mergeAccountConfig<TConfig extends Record<string, unknown>>(params: AccountMergeOptions & {
  channelConfig: TConfig | undefined;
  accountConfig: Partial<TConfig> | undefined;
}): TConfig;
/** Resolve a named account before applying the shared channel inheritance rules. */
declare function resolveMergedAccountConfig<TConfig extends Record<string, unknown>>(params: AccountMergeOptions & {
  channelConfig: TConfig | undefined;
  accounts: Record<string, Partial<TConfig>> | undefined;
  accountId: string;
  normalizeAccountId?: (accountId: string) => string;
  channelId?: string;
  accountKeyPolicy?: ChannelAccountKeyPolicy;
}): TConfig;
//#endregion
//#region src/channels/plugins/account-helpers.d.ts
declare function createAccountListHelpers<TConfig extends Record<string, unknown> = Record<string, unknown>>(channelKey: string, options?: {
  normalizeAccountId?: (id: string) => string;
  omitKeys?: Array<(keyof TConfig & string) | "defaultAccount">;
  nestedObjectKeys?: Array<keyof TConfig & string>;
  allowUnlistedDefaultAccount?: boolean;
  additionalAccountIds?: (cfg: OpenClawConfig) => Iterable<string>;
  fallbackAccountIdWhenEmpty?: string | false;
  implicitDefaultAccount?: {
    channelKeys?: readonly string[];
    envVars?: readonly string[];
  };
  hasImplicitDefaultAccount?: (cfg: OpenClawConfig) => boolean;
  resolveImplicitAccountId?: (cfg: OpenClawConfig) => string | undefined;
}): {
  listConfiguredAccountIds: (cfg: OpenClawConfig) => string[];
  listAccountIds: (cfg: OpenClawConfig) => string[];
  resolveDefaultAccountId: (cfg: OpenClawConfig) => string;
  resolveAccountConfig: (cfg: OpenClawConfig, accountId: string) => TConfig;
};
declare function hasConfiguredAccountValue(value: unknown): boolean;
declare function listCombinedAccountIds(params: {
  configuredAccountIds: Iterable<string>;
  additionalAccountIds?: Iterable<string>;
  implicitAccountId?: string | undefined;
  fallbackAccountIdWhenEmpty?: string | undefined;
}): string[];
declare function resolveListedDefaultAccountId(params: {
  accountIds: readonly string[];
  configuredDefaultAccountId?: string | undefined;
  allowUnlistedDefaultAccount?: boolean;
  ambiguousFallbackAccountId?: string | undefined;
  normalizeListedAccountId?: ((accountId: string) => string) | undefined;
}): string;
type AccountSnapshotInput = {
  accountId?: string | null;
  enabled?: boolean | null;
  name?: string | null | undefined;
};
declare function describeAccountSnapshot(params: {
  account: AccountSnapshotInput;
  configured?: boolean | undefined;
  extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
declare function describeWebhookAccountSnapshot(params: {
  account: AccountSnapshotInput;
  configured?: boolean | undefined;
  mode?: string | undefined;
  extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
//#endregion
export { listCombinedAccountIds as a, resolveMergedAccountConfig as c, hasConfiguredAccountValue as i, createAccountActionGate as l, describeAccountSnapshot as n, resolveListedDefaultAccountId as o, describeWebhookAccountSnapshot as r, mergeAccountConfig as s, createAccountListHelpers as t };
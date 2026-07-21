import { r as SecretDefaults, t as ResolverContext } from "./runtime-shared-BHhDpsUf.js";

//#region src/secrets/channel-secret-basic-runtime.d.ts
type ChannelAccountEntry = {
  accountId: string;
  account: Record<string, unknown>;
  enabled: boolean;
};
/** Resolved view of a channel config, including synthetic default-account fallback. */
type ChannelAccountSurface = {
  hasExplicitAccounts: boolean;
  channelEnabled: boolean;
  accounts: ChannelAccountEntry[];
};
/** Predicate used by channel helpers to decide whether an account-owned secret is active. */
type ChannelAccountPredicate = (entry: ChannelAccountEntry) => boolean;
/** Reads a channel config block when it exists as an object. */
declare function getChannelRecord(config: {
  channels?: Record<string, unknown>;
}, channelKey: string): Record<string, unknown> | undefined;
/** Reads a channel config and its resolved account surface in one step. */
declare function getChannelSurface(config: {
  channels?: Record<string, unknown>;
}, channelKey: string): {
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
} | null;
/** Resolves explicit channel accounts or creates a default account backed by the channel root. */
declare function resolveChannelAccountSurface(channel: Record<string, unknown>): ChannelAccountSurface;
declare function isBaseFieldActiveForChannelSurface(surface: ChannelAccountSurface, rootKey: string): boolean;
/** Normalizes optional channel secret strings before deciding whether a value is configured. */
declare function normalizeSecretStringValue(value: unknown): string;
/** Returns true when a channel value contains plaintext or a SecretRef-compatible value. */
declare function hasConfiguredSecretInputValue(value: unknown, defaults: SecretDefaults | undefined): boolean;
/** Collects a simple channel field from the channel root and explicit account overrides. */
/** Collects root/account channel field SecretRef assignments for one credential path. */
declare function collectSimpleChannelFieldAssignments(params: {
  channelKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topInactiveReason: string;
  accountInactiveReason: string;
}): void;
/** Collects a channel field whose active state depends on caller-provided account predicates. */
declare function collectConditionalChannelFieldAssignments(params: {
  channelKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topLevelActiveWithoutAccounts: boolean;
  topLevelInheritedAccountActive: ChannelAccountPredicate;
  accountActive: ChannelAccountPredicate;
  topInactiveReason: string;
  accountInactiveReason: string | ((entry: ChannelAccountEntry) => string);
}): void;
/** Collects a nested channel field from root and account-specific nested config blocks. */
declare function collectNestedChannelFieldAssignments(params: {
  channelKey: string;
  nestedKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topLevelActive: boolean;
  topInactiveReason: string;
  accountActive: ChannelAccountPredicate;
  accountInactiveReason: string | ((entry: ChannelAccountEntry) => string);
}): void;
//#endregion
export { collectNestedChannelFieldAssignments as a, getChannelSurface as c, normalizeSecretStringValue as d, resolveChannelAccountSurface as f, collectConditionalChannelFieldAssignments as i, hasConfiguredSecretInputValue as l, ChannelAccountPredicate as n, collectSimpleChannelFieldAssignments as o, ChannelAccountSurface as r, getChannelRecord as s, ChannelAccountEntry as t, isBaseFieldActiveForChannelSurface as u };
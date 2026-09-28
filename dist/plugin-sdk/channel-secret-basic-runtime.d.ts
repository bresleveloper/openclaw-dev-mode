import { c as isRecord } from "../record-coerce-Ckpz2G3R.js";
import { c as pushAssignment, i as collectSecretInputAssignment, l as pushInactiveSurfaceWarning, n as SecretDefaults, o as hasOwnProperty, s as isEnabledFlag, t as ResolverContext, u as pushWarning } from "../runtime-shared-BhZQISET.js";
import { n as SecretTargetRegistryEntry, r as SecretTargetShape, t as SecretTargetExpected } from "../target-registry-types-rt3qR_99.js";
//#region src/secrets/channel-secret-basic-runtime.d.ts
type ChannelSecretTargetPathSpec = {
  path: string;
  refPath?: string;
  targetType?: string;
  targetTypeAliases?: string[];
  secretShape?: SecretTargetShape;
  expectedResolvedValue?: SecretTargetExpected;
  accountIdPathSegmentIndex?: number;
};
export declare function createChannelSecretTargetRegistryEntries(params: {
  channelKey: string;
  account?: readonly (string | ChannelSecretTargetPathSpec)[];
  channel?: readonly (string | ChannelSecretTargetPathSpec)[];
}): SecretTargetRegistryEntry[];
/** Builds the common registry and runtime collector used by simple channel secrets. */
export declare function createSimpleChannelSecretContract(params: {
  channelKey: string;
  label: string;
  accountFields: readonly string[];
  channelFields: readonly string[];
  mode: "account-inheritance" | "channel-surface" | "channel-only" | {
    kind: "surface-inheritance";
    collectionFields: readonly string[];
  };
}): {
  secretTargetRegistryEntries: SecretTargetRegistryEntry[];
  collectRuntimeConfigAssignments: (params: {
    config: {
      channels?: Record<string, unknown>;
    };
    defaults?: SecretDefaults;
    context: ResolverContext;
  }) => void;
};
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
export declare function getChannelRecord(config: {
  channels?: Record<string, unknown>;
}, channelKey: string): Record<string, unknown> | undefined;
/** Reads a channel config and its resolved account surface in one step. */
export declare function getChannelSurface(config: {
  channels?: Record<string, unknown>;
}, channelKey: string): {
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
} | null;
/** Resolves explicit channel accounts or creates a default account backed by the channel root. */
export declare function resolveChannelAccountSurface(channel: Record<string, unknown>): ChannelAccountSurface;
export declare function isBaseFieldActiveForChannelSurface(surface: ChannelAccountSurface, rootKey: string): boolean;
/** Normalizes optional channel secret strings before deciding whether a value is configured. */
export declare function normalizeSecretStringValue(value: unknown): string;
/** Returns true when a channel value contains plaintext or a SecretRef-compatible value. */
export declare function hasConfiguredSecretInputValue(value: unknown, defaults: SecretDefaults | undefined): boolean;
/** Collects root/account channel field SecretRef assignments for one credential path. */
export declare function collectSimpleChannelFieldAssignments(params: {
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
export declare function collectConditionalChannelFieldAssignments(params: {
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
export declare function collectNestedChannelFieldAssignments(params: {
  channelKey: string;
  nestedKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topLevelActive: boolean;
  topLevelInheritedAccountActive?: ChannelAccountPredicate;
  topInactiveReason: string;
  accountActive: ChannelAccountPredicate;
  accountInactiveReason: string | ((entry: ChannelAccountEntry) => string);
}): void;
//#endregion
export { type ChannelAccountEntry, type ChannelAccountPredicate, type ChannelAccountSurface, type ChannelSecretTargetPathSpec, type ResolverContext, type SecretDefaults, type SecretTargetRegistryEntry, collectSecretInputAssignment, hasOwnProperty, isEnabledFlag, isRecord, pushAssignment, pushInactiveSurfaceWarning, pushWarning };
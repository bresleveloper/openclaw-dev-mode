import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../types-BnfxNjkF.js";
import { l as ChannelDirectoryEntry, u as ChannelDirectoryEntryKind } from "../types.core-D1MQo5ra.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { d as ChannelDirectoryAdapter } from "../types.adapters-dxHXA2rq.js";
import "../types.public-B8oQ1D30.js";
import { t as createRuntimeDirectoryLiveAdapter } from "../runtime-forwarders-B1YzHLS2.js";
//#region src/channels/plugins/directory-types.d.ts
/**
 * Shared input for channel directory lookups.
 *
 * Directory-capable plugins receive the active config plus optional account
 * scope, search text, and result limit from setup or command surfaces.
 */
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
//#endregion
//#region src/channels/read-only-account-inspect.d.ts
type ReadOnlyInspectedAccount = Record<string, unknown>;
/** Inspects channel account config without loading mutable runtime surfaces. */
export declare function inspectReadOnlyChannelAccount(params: {
  channelId: ChannelId;
  cfg: OpenClawConfig;
  accountId?: string | null;
}): Promise<ReadOnlyInspectedAccount | null>;
//#endregion
//#region src/channels/plugins/directory-adapters.d.ts
export declare const nullChannelDirectorySelf: NonNullable<ChannelDirectoryAdapter["self"]>;
export declare const emptyChannelDirectoryList: NonNullable<ChannelDirectoryAdapter["listPeers"]>;
/** Build a channel directory adapter with a null self resolver by default. */
export declare function createChannelDirectoryAdapter(params?: Omit<ChannelDirectoryAdapter, "self"> & {
  self?: ChannelDirectoryAdapter["self"];
}): ChannelDirectoryAdapter;
/** Build the common empty directory surface for channels without directory support. */
export declare function createEmptyChannelDirectoryAdapter(): ChannelDirectoryAdapter;
//#endregion
//#region src/channels/plugins/directory-config-helpers.d.ts
/**
 * Applies case-insensitive query filtering and a positive result limit to ids.
 */
export declare function applyDirectoryQueryAndLimit(ids: string[], params: {
  query?: string | null;
  limit?: number | null;
}): string[];
/**
 * Converts normalized ids into channel directory entries of one kind.
 */
export declare function toDirectoryEntries(kind: "user" | "group", ids: string[]): ChannelDirectoryEntry[];
/**
 * Collects unique normalized ids from multiple raw config sources.
 */
export declare function collectNormalizedDirectoryIds(params: {
  sources: Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): string[];
/**
 * Lists directory entries from arbitrary config sources.
 *
 * Callers supply source iterables and an id normalizer so channel-specific
 * config shapes share the same wildcard filtering, dedupe, query, and limit
 * behavior.
 */
export declare function listDirectoryEntriesFromSources(params: {
  kind: "user" | "group";
  sources: Iterable<unknown>[];
  query?: string | null;
  limit?: number | null;
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists directory entries for channels that inspect optional configured accounts.
 */
export declare function listInspectedDirectoryEntriesFromSources<InspectedAccount>(params: DirectoryConfigParams & {
  kind: "user" | "group";
  inspectAccount: (cfg: OpenClawConfig, accountId?: string | null) => InspectedAccount | null | undefined;
  resolveSources: (account: InspectedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Builds an async lister around an inspected-account directory source.
 */
export declare function createInspectedDirectoryEntriesLister<InspectedAccount>(params: {
  kind: "user" | "group";
  inspectAccount: (cfg: OpenClawConfig, accountId?: string | null) => InspectedAccount | null | undefined;
  resolveSources: (account: InspectedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
/**
 * Lists directory entries for channels whose account resolver always returns a config object.
 */
export declare function listResolvedDirectoryEntriesFromSources<ResolvedAccount>(params: DirectoryConfigParams & {
  kind: "user" | "group";
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveSources: (account: ResolvedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Builds an async lister around a required resolved-account directory source.
 */
export declare function createResolvedDirectoryEntriesLister<ResolvedAccount>(params: {
  kind: "user" | "group";
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveSources: (account: ResolvedAccount) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
/**
 * Lists user directory entries from an allowlist-style config array.
 */
export declare function listDirectoryUserEntriesFromAllowFrom(params: {
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists user entries from both direct allowlists and map-key config.
 */
export declare function listDirectoryUserEntriesFromAllowFromAndMapKeys(params: {
  allowFrom?: readonly unknown[];
  map?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists group directory entries from map-key config.
 */
export declare function listDirectoryGroupEntriesFromMapKeys(params: {
  groups?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists group entries from both map-key config and allowlist values.
 */
export declare function listDirectoryGroupEntriesFromMapKeysAndAllowFrom(params: {
  groups?: Record<string, unknown>;
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists resolved-account user entries from an allowlist selector.
 */
export declare function listResolvedDirectoryUserEntriesFromAllowFrom<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveAllowFrom: (account: ResolvedAccount) => readonly unknown[] | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
/**
 * Lists resolved-account group entries from a group-map selector.
 */
export declare function listResolvedDirectoryGroupEntriesFromMapKeys<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveGroups: (account: ResolvedAccount) => Record<string, unknown> | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
//#endregion
//#region src/plugin-sdk/directory-runtime.d.ts
export declare function resolveDirectoryAllowlistEntries<TParsed extends {
  id?: string;
}, TLookup, TResult>(params: {
  entries: readonly string[];
  lookup: readonly TLookup[];
  parseInput: (input: string) => TParsed;
  findById: (lookup: readonly TLookup[], id: string) => TLookup | undefined;
  buildIdResolved: (params: {
    input: string;
    parsed: TParsed;
    match?: TLookup;
  }) => TResult;
  resolveNonId: (params: {
    input: string;
    parsed: TParsed;
    lookup: readonly TLookup[];
  }) => TResult | undefined;
  buildUnresolved: (input: string) => TResult;
}): TResult[];
//#endregion
export { type ChannelDirectoryEntry, type ChannelDirectoryEntryKind, type DirectoryConfigParams, type ReadOnlyInspectedAccount, createRuntimeDirectoryLiveAdapter };
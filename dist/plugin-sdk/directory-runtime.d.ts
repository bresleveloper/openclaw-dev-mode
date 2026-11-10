import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { FD as ChannelDirectoryEntry, ID as ChannelDirectoryEntryKind, JE as ChannelDirectoryAdapter, mf as createRuntimeDirectoryLiveAdapter, wA as ChannelId } from "../config-contracts-CY87ANNp.js";
import { a as listDirectoryEntriesFromSources, c as listDirectoryUserEntriesFromAllowFrom, d as listResolvedDirectoryEntriesFromSources, f as listResolvedDirectoryGroupEntriesFromMapKeys, h as DirectoryConfigParams, i as createResolvedDirectoryEntriesLister, l as listDirectoryUserEntriesFromAllowFromAndMapKeys, m as toDirectoryEntries, n as collectNormalizedDirectoryIds, o as listDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom, r as createInspectedDirectoryEntriesLister, s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, t as applyDirectoryQueryAndLimit, u as listInspectedDirectoryEntriesFromSources } from "../directory-config-helpers-DUV8XqcX.js";
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
export declare function createEmptyChannelDirectoryAdapter(): ChannelDirectoryAdapter;
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
export { type ChannelDirectoryEntry, type ChannelDirectoryEntryKind, type DirectoryConfigParams, type ReadOnlyInspectedAccount, applyDirectoryQueryAndLimit, collectNormalizedDirectoryIds, createInspectedDirectoryEntriesLister, createResolvedDirectoryEntriesLister, createRuntimeDirectoryLiveAdapter, listDirectoryEntriesFromSources, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, listInspectedDirectoryEntriesFromSources, listResolvedDirectoryEntriesFromSources, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom, toDirectoryEntries };
import { Qm as createRuntimeDirectoryLiveAdapter, lj as ChannelDirectoryEntry, uj as ChannelDirectoryEntryKind, wA as ChannelDirectoryAdapter } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { m as ChannelId } from "../manifest-registry-CNNq5Vj2.js";
import { a as listDirectoryEntriesFromSources, c as listDirectoryUserEntriesFromAllowFrom, d as listResolvedDirectoryEntriesFromSources, f as listResolvedDirectoryGroupEntriesFromMapKeys, h as DirectoryConfigParams, i as createResolvedDirectoryEntriesLister, l as listDirectoryUserEntriesFromAllowFromAndMapKeys, m as toDirectoryEntries, n as collectNormalizedDirectoryIds, o as listDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom, r as createInspectedDirectoryEntriesLister, s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, t as applyDirectoryQueryAndLimit, u as listInspectedDirectoryEntriesFromSources } from "../directory-config-helpers-RgY9hW-S.js";
type ReadOnlyInspectedAccount = Record<string, unknown>;
/** Inspects channel account config without loading mutable runtime surfaces. */
export declare function inspectReadOnlyChannelAccount(params: {
  channelId: ChannelId;
  cfg: OpenClawConfig;
  accountId?: string | null;
}): Promise<ReadOnlyInspectedAccount | null>;
export declare const nullChannelDirectorySelf: NonNullable<ChannelDirectoryAdapter["self"]>;
export declare const emptyChannelDirectoryList: NonNullable<ChannelDirectoryAdapter["listPeers"]>;
/** Build a channel directory adapter with a null self resolver by default. */
export declare function createChannelDirectoryAdapter(params?: Omit<ChannelDirectoryAdapter, "self"> & {
  self?: ChannelDirectoryAdapter["self"];
}): ChannelDirectoryAdapter;
export declare function createEmptyChannelDirectoryAdapter(): ChannelDirectoryAdapter;
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
export { type ChannelDirectoryEntry, type ChannelDirectoryEntryKind, type DirectoryConfigParams, type ReadOnlyInspectedAccount, applyDirectoryQueryAndLimit, collectNormalizedDirectoryIds, createInspectedDirectoryEntriesLister, createResolvedDirectoryEntriesLister, createRuntimeDirectoryLiveAdapter, listDirectoryEntriesFromSources, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, listInspectedDirectoryEntriesFromSources, listResolvedDirectoryEntriesFromSources, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom, toDirectoryEntries };
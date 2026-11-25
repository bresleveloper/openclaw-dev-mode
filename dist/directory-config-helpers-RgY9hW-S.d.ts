import { lj as ChannelDirectoryEntry } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
type AccountDirectorySources<Account> = DirectoryConfigParams & {
  kind: "user" | "group";
  resolveSources: (account: Account) => Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
};
declare function applyDirectoryQueryAndLimit(ids: string[], params: {
  query?: string | null;
  limit?: number | null;
}): string[];
declare function toDirectoryEntries(kind: "user" | "group", ids: string[]): ChannelDirectoryEntry[];
declare function collectNormalizedDirectoryIds(params: {
  sources: Iterable<unknown>[];
  normalizeId: (entry: string) => string | null | undefined;
}): string[];
declare function listDirectoryEntriesFromSources(params: {
  kind: "user" | "group";
  sources: Iterable<unknown>[];
  query?: string | null;
  limit?: number | null;
  normalizeId: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listInspectedDirectoryEntriesFromSources<InspectedAccount>(params: AccountDirectorySources<InspectedAccount> & {
  inspectAccount: (cfg: OpenClawConfig, accountId?: string | null) => InspectedAccount | null | undefined;
}): ChannelDirectoryEntry[];
declare function createInspectedDirectoryEntriesLister<InspectedAccount>(params: Omit<Parameters<typeof listInspectedDirectoryEntriesFromSources<InspectedAccount>>[0], keyof DirectoryConfigParams>): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
declare function listResolvedDirectoryEntriesFromSources<ResolvedAccount>(params: AccountDirectorySources<ResolvedAccount> & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
}): ChannelDirectoryEntry[];
declare function createResolvedDirectoryEntriesLister<ResolvedAccount>(params: Omit<Parameters<typeof listResolvedDirectoryEntriesFromSources<ResolvedAccount>>[0], keyof DirectoryConfigParams>): (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
declare function listDirectoryUserEntriesFromAllowFrom(params: {
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listDirectoryUserEntriesFromAllowFromAndMapKeys(params: {
  allowFrom?: readonly unknown[];
  map?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listDirectoryGroupEntriesFromMapKeys(params: {
  groups?: Record<string, unknown>;
  query?: string | null;
  limit?: number | null;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listDirectoryGroupEntriesFromMapKeysAndAllowFrom(params: {
  groups?: Record<string, unknown>;
  allowFrom?: readonly unknown[];
  query?: string | null;
  limit?: number | null;
  normalizeMapKeyId?: (entry: string) => string | null | undefined;
  normalizeAllowFromId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listResolvedDirectoryUserEntriesFromAllowFrom<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveAllowFrom: (account: ResolvedAccount) => readonly unknown[] | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
declare function listResolvedDirectoryGroupEntriesFromMapKeys<ResolvedAccount>(params: DirectoryConfigParams & {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  resolveGroups: (account: ResolvedAccount) => Record<string, unknown> | undefined;
  normalizeId?: (entry: string) => string | null | undefined;
}): ChannelDirectoryEntry[];
export { listDirectoryEntriesFromSources as a, listDirectoryUserEntriesFromAllowFrom as c, listResolvedDirectoryEntriesFromSources as d, listResolvedDirectoryGroupEntriesFromMapKeys as f, DirectoryConfigParams as h, createResolvedDirectoryEntriesLister as i, listDirectoryUserEntriesFromAllowFromAndMapKeys as l, toDirectoryEntries as m, collectNormalizedDirectoryIds as n, listDirectoryGroupEntriesFromMapKeys as o, listResolvedDirectoryUserEntriesFromAllowFrom as p, createInspectedDirectoryEntriesLister as r, listDirectoryGroupEntriesFromMapKeysAndAllowFrom as s, applyDirectoryQueryAndLimit as t, listInspectedDirectoryEntriesFromSources as u };
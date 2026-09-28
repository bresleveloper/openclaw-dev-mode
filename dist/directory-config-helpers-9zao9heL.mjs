import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
//#region src/channels/plugins/directory-config-helpers.ts
/**
* Directory config helper utilities.
*
* Builds user/group directory entries from plugin config with query and limit filtering.
*/
function resolveDirectoryQuery(query) {
	return normalizeLowercaseStringOrEmpty(query);
}
function resolveDirectoryLimit(limit) {
	return typeof limit === "number" && limit > 0 ? limit : void 0;
}
/**
* Applies case-insensitive query filtering and a positive result limit to ids.
*/
function applyDirectoryQueryAndLimit(ids, params) {
	const q = resolveDirectoryQuery(params.query);
	const limit = resolveDirectoryLimit(params.limit);
	const filtered = [];
	for (const id of ids) {
		if (q && !normalizeLowercaseStringOrEmpty(id).includes(q)) continue;
		filtered.push(id);
		if (typeof limit === "number" && filtered.length >= limit) break;
	}
	return filtered;
}
/**
* Converts normalized ids into channel directory entries of one kind.
*/
function toDirectoryEntries(kind, ids) {
	const entries = [];
	for (const id of ids) entries.push({
		kind,
		id
	});
	return entries;
}
function collectDirectoryIds(values, normalizeId) {
	const ids = [];
	for (const value of values) {
		const entry = normalizeOptionalString(String(value)) ?? "";
		if (!entry || entry === "*") continue;
		const normalized = normalizeId ? normalizeId(entry) : entry;
		const id = normalizeOptionalString(normalized) ?? "";
		if (id) ids.push(id);
	}
	return ids;
}
/**
* Collects unique normalized ids from multiple raw config sources.
*/
function collectNormalizedDirectoryIds(params) {
	const ids = [];
	for (const source of params.sources) for (const value of source) {
		const raw = normalizeOptionalString(value) ?? "";
		if (!raw || raw === "*") continue;
		const normalized = params.normalizeId(raw);
		const trimmed = normalizeOptionalString(normalized) ?? "";
		if (trimmed) ids.push(trimmed);
	}
	return uniqueStrings(ids);
}
/**
* Lists directory entries from arbitrary config sources.
*
* Callers supply source iterables and an id normalizer so channel-specific
* config shapes share the same wildcard filtering, dedupe, query, and limit
* behavior.
*/
function listDirectoryEntriesFromSources(params) {
	const ids = collectNormalizedDirectoryIds({
		sources: params.sources,
		normalizeId: params.normalizeId
	});
	return toDirectoryEntries(params.kind, applyDirectoryQueryAndLimit(ids, params));
}
/**
* Lists directory entries for channels that inspect optional configured accounts.
*/
function listInspectedDirectoryEntriesFromSources(params) {
	const account = params.inspectAccount(params.cfg, params.accountId);
	if (!account) return [];
	return listDirectoryEntriesFromSources({
		kind: params.kind,
		sources: params.resolveSources(account),
		query: params.query,
		limit: params.limit,
		normalizeId: params.normalizeId
	});
}
/**
* Builds an async lister around an inspected-account directory source.
*/
function createInspectedDirectoryEntriesLister(params) {
	return async (configParams) => listInspectedDirectoryEntriesFromSources({
		...configParams,
		...params
	});
}
/**
* Lists directory entries for channels whose account resolver always returns a config object.
*/
function listResolvedDirectoryEntriesFromSources(params) {
	const account = params.resolveAccount(params.cfg, params.accountId);
	return listDirectoryEntriesFromSources({
		kind: params.kind,
		sources: params.resolveSources(account),
		query: params.query,
		limit: params.limit,
		normalizeId: params.normalizeId
	});
}
/**
* Builds an async lister around a required resolved-account directory source.
*/
function createResolvedDirectoryEntriesLister(params) {
	return async (configParams) => listResolvedDirectoryEntriesFromSources({
		...configParams,
		...params
	});
}
/**
* Lists user directory entries from an allowlist-style config array.
*/
function listDirectoryUserEntriesFromAllowFrom(params) {
	return toDirectoryEntries("user", applyDirectoryQueryAndLimit(uniqueStrings(collectDirectoryIds(params.allowFrom ?? [], params.normalizeId)), params));
}
/**
* Lists user entries from both direct allowlists and map-key config.
*/
function listDirectoryUserEntriesFromAllowFromAndMapKeys(params) {
	return toDirectoryEntries("user", applyDirectoryQueryAndLimit(uniqueStrings([...collectDirectoryIds(params.allowFrom ?? [], params.normalizeAllowFromId), ...collectDirectoryIds(Object.keys(params.map ?? {}), params.normalizeMapKeyId)]), params));
}
/**
* Lists group directory entries from map-key config.
*/
function listDirectoryGroupEntriesFromMapKeys(params) {
	return toDirectoryEntries("group", applyDirectoryQueryAndLimit(uniqueStrings(collectDirectoryIds(Object.keys(params.groups ?? {}), params.normalizeId)), params));
}
/**
* Lists group entries from both map-key config and allowlist values.
*/
function listDirectoryGroupEntriesFromMapKeysAndAllowFrom(params) {
	return toDirectoryEntries("group", applyDirectoryQueryAndLimit(uniqueStrings([...collectDirectoryIds(Object.keys(params.groups ?? {}), params.normalizeMapKeyId), ...collectDirectoryIds(params.allowFrom ?? [], params.normalizeAllowFromId)]), params));
}
/**
* Lists resolved-account user entries from an allowlist selector.
*/
function listResolvedDirectoryUserEntriesFromAllowFrom(params) {
	const account = params.resolveAccount(params.cfg, params.accountId);
	return listDirectoryUserEntriesFromAllowFrom({
		allowFrom: params.resolveAllowFrom(account),
		query: params.query,
		limit: params.limit,
		normalizeId: params.normalizeId
	});
}
/**
* Lists resolved-account group entries from a group-map selector.
*/
function listResolvedDirectoryGroupEntriesFromMapKeys(params) {
	const account = params.resolveAccount(params.cfg, params.accountId);
	return listDirectoryGroupEntriesFromMapKeys({
		groups: params.resolveGroups(account),
		query: params.query,
		limit: params.limit,
		normalizeId: params.normalizeId
	});
}
//#endregion
export { listDirectoryEntriesFromSources as a, listDirectoryUserEntriesFromAllowFrom as c, listResolvedDirectoryEntriesFromSources as d, listResolvedDirectoryGroupEntriesFromMapKeys as f, createResolvedDirectoryEntriesLister as i, listDirectoryUserEntriesFromAllowFromAndMapKeys as l, toDirectoryEntries as m, collectNormalizedDirectoryIds as n, listDirectoryGroupEntriesFromMapKeys as o, listResolvedDirectoryUserEntriesFromAllowFrom as p, createInspectedDirectoryEntriesLister as r, listDirectoryGroupEntriesFromMapKeysAndAllowFrom as s, applyDirectoryQueryAndLimit as t, listInspectedDirectoryEntriesFromSources as u };

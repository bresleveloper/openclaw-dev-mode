import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
//#region src/channels/plugins/directory-config-helpers.ts
function applyDirectoryQueryAndLimit(ids, params) {
	const q = normalizeLowercaseStringOrEmpty(params.query);
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : void 0;
	const filtered = [];
	for (const id of ids) {
		if (q && !normalizeLowercaseStringOrEmpty(id).includes(q)) continue;
		filtered.push(id);
		if (typeof limit === "number" && filtered.length >= limit) break;
	}
	return filtered;
}
function toDirectoryEntries(kind, ids) {
	return Array.from(ids, (id) => ({
		kind,
		id
	}));
}
function collectDirectoryIds(values, normalizeId, readEntry = String) {
	const ids = [];
	for (const value of values) {
		const entry = normalizeOptionalString(readEntry(value)) ?? "";
		if (!entry || entry === "*") continue;
		const normalized = normalizeId ? normalizeId(entry) : entry;
		const id = normalizeOptionalString(normalized) ?? "";
		if (id) ids.push(id);
	}
	return ids;
}
function collectNormalizedDirectoryIds(params) {
	return uniqueStrings(params.sources.flatMap((source) => collectDirectoryIds(source, params.normalizeId, normalizeOptionalString)));
}
function listDirectoryEntriesFromSources(params) {
	const ids = collectNormalizedDirectoryIds(params);
	return toDirectoryEntries(params.kind, applyDirectoryQueryAndLimit(ids, params));
}
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
function createInspectedDirectoryEntriesLister(params) {
	return async (configParams) => listInspectedDirectoryEntriesFromSources({
		...configParams,
		...params
	});
}
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
function createResolvedDirectoryEntriesLister(params) {
	return async (configParams) => listResolvedDirectoryEntriesFromSources({
		...configParams,
		...params
	});
}
function listDirectoryUserEntriesFromAllowFrom(params) {
	return toDirectoryEntries("user", applyDirectoryQueryAndLimit(uniqueStrings(collectDirectoryIds(params.allowFrom ?? [], params.normalizeId)), params));
}
function listDirectoryUserEntriesFromAllowFromAndMapKeys(params) {
	return toDirectoryEntries("user", applyDirectoryQueryAndLimit(uniqueStrings([...collectDirectoryIds(params.allowFrom ?? [], params.normalizeAllowFromId), ...collectDirectoryIds(Object.keys(params.map ?? {}), params.normalizeMapKeyId)]), params));
}
function listDirectoryGroupEntriesFromMapKeys(params) {
	return toDirectoryEntries("group", applyDirectoryQueryAndLimit(uniqueStrings(collectDirectoryIds(Object.keys(params.groups ?? {}), params.normalizeId)), params));
}
function listDirectoryGroupEntriesFromMapKeysAndAllowFrom(params) {
	return toDirectoryEntries("group", applyDirectoryQueryAndLimit(uniqueStrings([...collectDirectoryIds(Object.keys(params.groups ?? {}), params.normalizeMapKeyId), ...collectDirectoryIds(params.allowFrom ?? [], params.normalizeAllowFromId)]), params));
}
function listResolvedDirectoryUserEntriesFromAllowFrom(params) {
	const account = params.resolveAccount(params.cfg, params.accountId);
	return listDirectoryUserEntriesFromAllowFrom({
		allowFrom: params.resolveAllowFrom(account),
		query: params.query,
		limit: params.limit,
		normalizeId: params.normalizeId
	});
}
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

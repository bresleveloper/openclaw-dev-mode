import { i as resolveBuzzAccount, m as parseBuzzTarget, u as buildBuzzTarget } from "./types-CeupBG0P.mjs";
//#region extensions/buzz/src/directory-query.ts
function matchesDirectoryQuery(entry, query) {
	if (!query) return true;
	return [
		entry.id,
		entry.name,
		entry.handle
	].some((value) => value?.toLowerCase().includes(query));
}
function applyBuzzDirectoryQueryAndLimit(entries, params) {
	const query = params.query?.trim().toLowerCase() ?? "";
	const limit = typeof params.limit === "number" && params.limit > 0 ? Math.floor(params.limit) : void 0;
	const result = [];
	for (const entry of entries) {
		if (!matchesDirectoryQuery(entry, query)) continue;
		result.push(entry);
		if (limit !== void 0 && result.length >= limit) break;
	}
	return result;
}
//#endregion
//#region extensions/buzz/src/directory-config.ts
async function listBuzzDirectoryPeersFromConfig(_params) {
	return [];
}
async function listBuzzDirectoryGroupsFromConfig(params) {
	const account = resolveBuzzAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return applyBuzzDirectoryQueryAndLimit(Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([roomId]) => {
		const id = parseBuzzTarget(roomId);
		return {
			kind: "group",
			id: buildBuzzTarget(id),
			name: id,
			raw: { roomId: id }
		};
	}).toSorted((a, b) => a.id.localeCompare(b.id)), params);
}
//#endregion
export { listBuzzDirectoryPeersFromConfig as n, applyBuzzDirectoryQueryAndLimit as r, listBuzzDirectoryGroupsFromConfig as t };

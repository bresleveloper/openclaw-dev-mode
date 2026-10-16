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
export { applyBuzzDirectoryQueryAndLimit as t };

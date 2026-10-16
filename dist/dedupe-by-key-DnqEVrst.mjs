//#region src/shared/dedupe-by-key.ts
function indexFirstByKey(items, keyOf) {
	const deduped = /* @__PURE__ */ new Map();
	for (const item of items) {
		const key = keyOf(item);
		if (!deduped.has(key)) deduped.set(key, item);
	}
	return deduped;
}
function dedupeByKey(items, keyOf) {
	return [...indexFirstByKey(items, keyOf).values()];
}
//#endregion
export { indexFirstByKey as n, dedupeByKey as t };

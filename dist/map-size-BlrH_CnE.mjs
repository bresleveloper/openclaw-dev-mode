//#region src/infra/map-size.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
function pruneMapToMaxSize(map, maxSize) {
	if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) return;
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	for (const key of map.keys()) {
		if (map.size <= limit) break;
		map.delete(key);
	}
}
//#endregion
export { pruneMapToMaxSize as t };

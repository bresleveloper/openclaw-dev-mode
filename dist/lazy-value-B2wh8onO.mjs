//#region src/plugin-sdk/lazy-value.ts
/** Returns a getter that resolves the supplied value at most once. */
function createCachedLazyValueGetter(value) {
	let resolved = false;
	let cached;
	return () => {
		if (!resolved) {
			cached = typeof value === "function" ? value() : value;
			resolved = true;
		}
		return cached;
	};
}
//#endregion
export { createCachedLazyValueGetter as t };

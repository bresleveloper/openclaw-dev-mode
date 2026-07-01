//#region src/shared/lazy-promise.ts
/**
* Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
*
* Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
*/
function createLazyPromiseLoader(load, options = {}) {
	let promise;
	const createPromise = () => {
		const loaded = Promise.resolve().then(load);
		if (options.cacheRejections !== true) loaded.catch(() => {
			if (promise === loaded) promise = void 0;
		});
		return loaded;
	};
	return {
		async load() {
			promise ??= createPromise();
			return await promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
/** Convenience wrapper for dynamic-import-shaped loaders. */
function createLazyImportLoader(load, options) {
	return createLazyPromiseLoader(load, options);
}
//#endregion
export { createLazyPromiseLoader as n, createLazyImportLoader as t };

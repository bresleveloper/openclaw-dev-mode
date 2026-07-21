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
		load() {
			promise ??= createPromise();
			return promise;
		},
		peek() {
			return promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
/** Creates a reusable function that resolves one cached promise at a time. */
function createLazyPromise(load, options) {
	const loader = createLazyPromiseLoader(load, options);
	return () => loader.load();
}
/** Convenience wrapper for dynamic-import-shaped loaders. */
function createLazyImportLoader(load, options) {
	return createLazyPromiseLoader(load, options);
}
//#endregion
export { createLazyPromise as n, createLazyPromiseLoader as r, createLazyImportLoader as t };

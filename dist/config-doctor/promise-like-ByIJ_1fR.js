//#region src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
//#endregion
//#region packages/normalization-core/src/promise-like.ts
/** Canonical thenable guard; use instead of local isPromiseLike copies. */
function isPromiseLike(value) {
	if (value === null || typeof value !== "object" && typeof value !== "function") return false;
	try {
		return typeof value.then === "function";
	} catch {
		return false;
	}
}
//#endregion
export { createDeferredCore as n, isPromiseLike as t };

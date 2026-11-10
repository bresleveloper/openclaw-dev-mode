import { r as normalizeRequestInitHeadersForFetch } from "./fetch-headers-DD03wtQj.mjs";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-CSZThyLT.mjs";
//#region src/infra/net/form-data.ts
function isFormDataLike(value) {
	return typeof value === "object" && value !== null && typeof value.entries === "function" && value[Symbol.toStringTag] === "FormData";
}
//#endregion
//#region src/infra/net/runtime-fetch.ts
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
function isMockedFetch(fetchImpl) {
	if (typeof fetchImpl !== "function") return false;
	return typeof fetchImpl.mock === "object";
}
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
async function fetchWithRuntimeDispatcher(input, init) {
	return await fetchWithPreparedRuntimeDispatcher(loadUndiciRuntimeDeps(), input, init);
}
/** Uses one prepared Undici snapshot so reusable fetch wrappers stay stable. */
function fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, init) {
	const runtimeFetch = runtimeDeps.fetch;
	const normalizedInit = normalizeRequestInitHeadersForFetch(init);
	const RuntimeFormData = runtimeDeps.FormData;
	if (!init || !isFormDataLike(init.body) || typeof RuntimeFormData !== "function" || init.body instanceof RuntimeFormData) return runtimeFetch(input, normalizedInit);
	const body = new RuntimeFormData();
	for (const [key, value] of init.body.entries()) {
		const namedValue = value;
		const fileName = typeof namedValue.name === "string" && namedValue.name.trim() ? namedValue.name : void 0;
		if (fileName) body.append(key, value, fileName);
		else body.append(key, value);
	}
	const headers = new Headers(normalizedInit?.headers);
	headers.delete("content-length");
	headers.delete("content-type");
	return runtimeFetch(input, {
		...normalizedInit,
		headers,
		body
	});
}
/**
* Uses test-injected global fetch when present, otherwise preserves dispatcher
* support by routing through the undici runtime fetch.
*/
async function fetchWithRuntimeDispatcherOrMockedGlobal(input, init) {
	if (isMockedFetch(globalThis.fetch)) return await globalThis.fetch(input, init);
	return await fetchWithRuntimeDispatcher(input, init);
}
//#endregion
export { isMockedFetch as i, fetchWithRuntimeDispatcher as n, fetchWithRuntimeDispatcherOrMockedGlobal as r, fetchWithPreparedRuntimeDispatcher as t };

//#region src/plugin-sdk/memory-host-search.ts
/** Loads the active memory search manager for one agent and purpose. */
async function getActiveMemorySearchManager(params) {
	return await (await import("./memory-host-search.runtime.js")).getActiveMemorySearchManager(params);
}
/** Closes every active memory search manager for the provided config. */
async function closeActiveMemorySearchManagers(cfg) {
	await (await import("./memory-host-search.runtime.js")).closeActiveMemorySearchManagers(cfg);
}
/** Closes the active memory search manager for one agent. */
async function closeActiveMemorySearchManager(params) {
	await (await import("./memory-host-search.runtime.js")).closeActiveMemorySearchManager(params);
}
/** Opens a caller-bound neutral provider lease; close it when the operation finishes. */
async function getActiveMemoryProvider(params) {
	return await (await import("./memory-host-search.runtime.js")).getActiveMemoryProvider(params);
}
/** Reports whether the selected slot owner serves the provider-neutral runtime for an agent. */
async function isActiveMemoryProviderNative(params) {
	return (await import("./memory-host-search.runtime.js")).isActiveMemoryProviderNative(params);
}
//#endregion
export { isActiveMemoryProviderNative as a, getActiveMemorySearchManager as i, closeActiveMemorySearchManagers as n, getActiveMemoryProvider as r, closeActiveMemorySearchManager as t };

import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createPluginRuntimeStore } from "./runtime-store-pFaG-6b2.mjs";
//#region extensions/memory-core/src/memory/lifecycle.ts
const lifecycleStore = createPluginRuntimeStore({
	key: "memory-core:manager-lifecycle",
	errorMessage: "Memory manager lifecycle is not initialized"
});
const liveIndexing = resolveGlobalSingleton(Symbol.for("openclaw.memoryCore.liveIndexing"), () => ({ started: false }), (state) => {
	state.started = false;
}, "close-and-restart");
/** Records that a watched index manager ran in this process. */
function markMemoryIndexingLive() {
	liveIndexing.started = true;
}
function hasMemoryIndexingBeenLive() {
	return liveIndexing.started;
}
var MemoryManagerReloadError = class extends Error {
	constructor() {
		super("Memory provider is reloading; retry after the plugin operation completes.");
	}
};
function getMemoryManagerLifecycle() {
	let lifecycle = lifecycleStore.tryGetRuntime();
	if (!lifecycle) {
		lifecycle = {};
		lifecycleStore.setRuntime(lifecycle);
	}
	return lifecycle;
}
/** Pause new acquisition while the plugin owner replaces its adapters. */
function prepareMemoryManagerReload(change, lifecycle = getMemoryManagerLifecycle()) {
	const reload = {
		retireRuntime: change.retireRuntime,
		adapters: new Set(change.retiringEmbeddingProviders)
	};
	lifecycle.reload = reload;
	return {
		drain: lifecycle.prepare?.(reload) ?? (async () => ({ errors: [] })),
		resume() {
			lifecycle.reload = void 0;
		}
	};
}
//#endregion
export { prepareMemoryManagerReload as a, markMemoryIndexingLive as i, getMemoryManagerLifecycle as n, hasMemoryIndexingBeenLive as r, MemoryManagerReloadError as t };

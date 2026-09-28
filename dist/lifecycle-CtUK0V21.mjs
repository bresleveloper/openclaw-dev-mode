import { t as createPluginRuntimeStore } from "./runtime-store-Mt8Rbmwz.mjs";
//#region extensions/memory-core/src/memory/lifecycle.ts
const lifecycleStore = createPluginRuntimeStore({
	key: "memory-core:manager-lifecycle",
	errorMessage: "Memory manager lifecycle is not initialized"
});
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
/** Fence acquisition even before the lazy manager module has loaded. */
function prepareMemoryManagerReload(change, lifecycle = getMemoryManagerLifecycle()) {
	const reload = lifecycle.reload ?? {
		retireRuntime: false,
		adapters: /* @__PURE__ */ new Set(),
		generation: 0
	};
	reload.retireRuntime ||= change.retireRuntime;
	for (const adapter of change.retiringEmbeddingProviders) reload.adapters.add(adapter);
	const generation = ++reload.generation;
	lifecycle.reload = reload;
	return {
		drain: lifecycle.prepare?.(reload) ?? (async () => ({ errors: [] })),
		resume() {
			if (lifecycle.reload === reload && generation === reload.generation) lifecycle.reload = void 0;
		}
	};
}
//#endregion
export { getMemoryManagerLifecycle as n, prepareMemoryManagerReload as r, MemoryManagerReloadError as t };

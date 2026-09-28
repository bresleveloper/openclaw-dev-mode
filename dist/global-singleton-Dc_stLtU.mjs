//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a process-local Map singleton for keyed caches backed by globalThis. */
function resolveGlobalMap(key, reset, lifecycle) {
	return typeof reset === "string" ? resolveGlobalSingleton(key, () => /* @__PURE__ */ new Map(), (value) => value.clear(), reset) : resolveGlobalSingleton(key, () => /* @__PURE__ */ new Map(), reset, lifecycle);
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
/** Resets every opt-in singleton while preserving shared object identity for the next lifecycle. */
async function drainGlobalSingletonLifecycleState(event = "close") {
	const resets = [...resolveGlobalSingletonResetRegistry().values()].filter(({ lifecycle }) => {
		if (event === "plugin-registry") return lifecycle === "plugin-registry";
		if (lifecycle === "plugin-registry") return false;
		return event === "close" || lifecycle === "close-and-restart";
	}).map(({ reset }) => {
		try {
			return Promise.resolve(reset());
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error("Global singleton reset failed", { cause: error }));
		}
	});
	const errors = (await Promise.allSettled(resets)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Failed to reset global singleton lifecycle state");
}
//#endregion
export { resolveGlobalSingleton as i, resolveGlobalMap as n, resolveGlobalSet as r, drainGlobalSingletonLifecycleState as t };

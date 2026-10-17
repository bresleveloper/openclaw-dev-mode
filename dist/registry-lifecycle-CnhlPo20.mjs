import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { P as summarizePluginRetirementResults, S as retainPluginCacheInstance, o as getPluginCache, y as releasePluginCacheInstance } from "./plugin-cache-BABafcXD.mjs";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { c as pluginInstanceState, n as getPluginInstance, r as getPluginInstanceOwner, u as resolvePluginInstanceOwner } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/loader-cache-state.ts
/** Error thrown when one plugin registry cache key attempts nested loading. */
var PluginLoadReentryError = class extends Error {
	constructor(cacheKey) {
		super(`plugin load reentry detected for cache key: ${cacheKey}`);
		this.name = "PluginLoadReentryError";
		this.cacheKey = cacheKey;
	}
};
/** Small registry cache with reentry detection and per-key warning memory. */
var PluginLoaderCacheState = class {
	#registryCache;
	#inFlightLoads = /* @__PURE__ */ new Set();
	#openAllowlistWarningCache;
	constructor(defaultMaxEntries, onCache) {
		this.onCache = onCache;
		this.#registryCache = new LruCache(defaultMaxEntries);
		this.#openAllowlistWarningCache = new LruCache(defaultMaxEntries);
	}
	clear() {
		this.#registryCache.clear();
		this.#inFlightLoads.clear();
		this.#openAllowlistWarningCache.clear();
	}
	clearCachedRegistries() {
		this.#registryCache.clear();
		this.#openAllowlistWarningCache.clear();
	}
	get(cacheKey) {
		return this.#registryCache.get(cacheKey);
	}
	set(cacheKey, state) {
		this.#registryCache.set(cacheKey, state);
		this.onCache?.(state);
	}
	deleteValue(state) {
		this.#registryCache.deleteValue(state);
	}
	isLoadInFlight(cacheKey) {
		return this.#inFlightLoads.has(cacheKey);
	}
	beginLoad(cacheKey) {
		if (this.#inFlightLoads.has(cacheKey)) throw new PluginLoadReentryError(cacheKey);
		this.#inFlightLoads.add(cacheKey);
	}
	finishLoad(cacheKey) {
		this.#inFlightLoads.delete(cacheKey);
	}
	hasOpenAllowlistWarning(cacheKey) {
		return this.#openAllowlistWarningCache.get(cacheKey) === true;
	}
	recordOpenAllowlistWarning(cacheKey) {
		this.#openAllowlistWarningCache.set(cacheKey, true);
	}
};
//#endregion
//#region src/plugins/registry-lifecycle.ts
/** Registry handles expire at publication; unchanged plugin instances retain their own authority. */
const lifecycle = resolveGlobalSingleton(Symbol.for("openclaw.pluginRegistryLifecycle"), () => ({
	retiredRegistries: /* @__PURE__ */ new WeakSet(),
	activatedRegistries: /* @__PURE__ */ new WeakSet(),
	registryEpochs: /* @__PURE__ */ new WeakMap()
}));
const { retiredRegistries, activatedRegistries, registryEpochs } = lifecycle;
const preparation = lifecycle.preparation ??= new AsyncLocalStorage();
const loaderCaches = lifecycle.loaderCaches ??= /* @__PURE__ */ new WeakMap();
const registryLoads = lifecycle.registryLoads ??= /* @__PURE__ */ new WeakMap();
const registryResourceOwners = lifecycle.registryResourceOwners ??= /* @__PURE__ */ new WeakMap();
const registryLifetimes = lifecycle.registryLifetimes ??= /* @__PURE__ */ new WeakMap();
const gatewayOwners = lifecycle.gatewayOwners ??= /* @__PURE__ */ new WeakMap();
const gatewayChannels = lifecycle.gatewayChannels ??= /* @__PURE__ */ new WeakMap();
const borrowedRecords = lifecycle.borrowedRecords ??= /* @__PURE__ */ new WeakMap();
const loadRegistryDisposer = lifecycle.loadRegistryDisposer ??= createLazyRuntimeNamedExport(() => import("./runtime-DZJLuLMr.mjs"), "disposePluginRegistryInstances");
/** Prime the same import edge retained by cache callbacks, including copied SDK graphs. */
async function preparePluginRegistryCacheShutdown() {
	await loadRegistryDisposer();
}
/** Projection changes contributions, not custody of the loaded instances. */
function bindPluginRegistryResourceOwner(view, source) {
	const owner = getPluginRegistryResourceOwner(source);
	if (view !== owner) registryResourceOwners.set(view, owner);
	return view;
}
function getPluginRegistryResourceOwner(registry) {
	return registryResourceOwners.get(registry) ?? registry;
}
/**
* Links a registry to the Gateway owner that published it or admitted a turn
* into it. A registry claimed by two owners keeps no owner.
*/
function bindPluginRegistryGatewayOwner(registry, owner, admittedFrom) {
	const key = getPluginRegistryResourceOwner(registry);
	const existing = gatewayOwners.get(key);
	if (existing === void 0) {
		const inherited = admittedFrom && getPluginRegistryGatewayOwner(admittedFrom) === owner ? gatewayChannels.get(getPluginRegistryResourceOwner(admittedFrom)) : void 0;
		if (admittedFrom) {
			if (inherited) gatewayChannels.set(key, inherited);
		} else gatewayChannels.set(key, new Map(registry.channels.map(({ pluginId, plugin }) => [plugin.id, {
			pluginId,
			plugin
		}])));
	}
	gatewayOwners.set(key, existing === void 0 || existing === owner ? owner : null);
}
function getPluginRegistryGatewayOwner(registry) {
	return gatewayOwners.get(getPluginRegistryResourceOwner(registry)) ?? void 0;
}
/** Prepared views inherit the publication snapshot, not a successor generation. */
function isPluginRegistryGatewayViewOf(registry, published) {
	const owner = getPluginRegistryGatewayOwner(registry);
	const admitted = gatewayChannels.get(getPluginRegistryResourceOwner(registry));
	return owner !== void 0 && admitted !== void 0 && admitted === gatewayChannels.get(getPluginRegistryResourceOwner(published)) && owner === getPluginRegistryGatewayOwner(published);
}
/** Publication-time identity survives teardown; the live Gateway owner still admits every send. */
function getPluginRegistryGatewayChannelRegistration(registry, channel) {
	return gatewayChannels.get(getPluginRegistryResourceOwner(registry))?.get(channel);
}
/** The creation owner lends existing custody; lookup never takes ownership of an external host. */
function getPluginRegistryLifetime(registry) {
	return registryLifetimes.get(getPluginRegistryResourceOwner(registry));
}
function bindPluginRegistryLifetime(registry, lifetime) {
	registryLifetimes.set(getPluginRegistryResourceOwner(registry), lifetime);
}
function getPluginLoaderCacheState(cache = getPluginCache()) {
	const cached = registryLoads.get(cache);
	if (cached) return cached;
	const loads = new PluginLoaderCacheState(128, (registry) => {
		let owners = loaderCaches.get(registry);
		if (!owners) loaderCaches.set(registry, owners = /* @__PURE__ */ new Set());
		owners.add(loads);
		for (const record of registry.plugins) {
			const instance = getPluginInstance(record);
			if (instance) retainPluginCacheInstance(instance, cache);
		}
	});
	registryLoads.set(cache, loads);
	cache.retireRegistryLoads = async () => {
		loads.clearCachedRegistries();
		const registries = /* @__PURE__ */ new Set();
		for (const instance of cache.instances) {
			const owner = getPluginInstanceOwner(instance);
			if (!owner) continue;
			if (isPluginRecordActive(owner.registry, owner.record)) releasePluginCacheInstance(instance, cache);
			else if (registryEpochs.get(owner.registry)?.epoch === void 0) {
				instance.quiesce();
				registries.add(owner.registry);
			}
		}
		for (const registry of registries) quiescePluginRegistry(registry);
		if (registries.size === 0) return {
			cleanupCount: 0,
			failures: []
		};
		const disposePluginRegistryInstances = await loadRegistryDisposer();
		const results = await Promise.allSettled([...registries].map((registry) => disposePluginRegistryInstances(registry)));
		return summarizePluginRetirementResults(results, "Plugin cached registry cleanup failed");
	};
	return loads;
}
/**
* A borrowing registry lists another live registry's record without taking custody.
* Publication never adopts it, and retirement of the borrower never revokes or disposes it.
*/
function markPluginRecordBorrowed(registry, record) {
	let records = borrowedRecords.get(registry);
	if (!records) borrowedRecords.set(registry, records = /* @__PURE__ */ new WeakSet());
	records.add(record);
}
/** Projection reads the loader's borrowing fact without inferring custody from record identity. */
function isPluginRecordBorrowed(registry, record) {
	return borrowedRecords.get(getPluginRegistryResourceOwner(registry))?.has(record) === true;
}
/** Transfer exact instances at publication without reviving a removed or failed instance. */
function adoptPluginRegistryRecords(registryView) {
	const registry = registryView && getPluginRegistryResourceOwner(registryView);
	if (!registry || retiredRegistries.has(registry)) return;
	for (const record of registry.plugins) {
		const owner = resolvePluginInstanceOwner(record, registry);
		if (!owner.revoked && !borrowedRecords.get(registry)?.has(record)) owner.registry = registry;
	}
}
function closePluginRegistryAdmissions(registries, revokeRecords) {
	const instances = /* @__PURE__ */ new Set();
	const controllers = [];
	for (const registryView of registries) {
		const registry = getPluginRegistryResourceOwner(registryView);
		const previous = registryEpochs.get(registry);
		retiredRegistries.add(registry);
		registryEpochs.delete(registry);
		if (previous?.controller) controllers.push(previous.controller);
		for (const record of registry.plugins) {
			const owner = resolvePluginInstanceOwner(record, registry);
			if (owner.registry === registry) {
				if (revokeRecords || !owner.instance) owner.revoked = true;
				if (owner.instance) {
					for (const entry of registry.decisionProviders) {
						entry.host.cancelConsumer(record.id);
						if (entry.pluginId === record.id) entry.host.retire();
					}
					instances.add(owner.instance);
				}
			}
		}
		for (const cache of loaderCaches.get(registry) ?? []) cache.deleteValue(registry);
		loaderCaches.delete(registry);
	}
	for (const instance of instances) instance.quiesce();
	for (const controller of controllers) controller.abort();
}
/** Close new admission while the existing command owner joins admitted work. */
function quiescePluginRegistry(registry) {
	closePluginRegistryAdmissions(registry ? [registry] : [], false);
}
function markPluginRegistryRetired(registry) {
	closePluginRegistryAdmissions(registry ? [registry] : [], true);
}
/** Revoke all attached inspection views before any abort callback observes retirement. */
function markPluginRegistriesRetired(registries) {
	closePluginRegistryAdmissions(registries, true);
}
function markPluginRegistryActive(registryView) {
	if (!registryView) return;
	const registry = getPluginRegistryResourceOwner(registryView);
	const previous = registryEpochs.get(registry);
	activatedRegistries.add(registry);
	retiredRegistries.delete(registry);
	registryEpochs.set(registry, {
		epoch: Object.freeze({}),
		controller: new AbortController()
	});
	adoptPluginRegistryRecords(registry);
	previous?.controller?.abort();
}
function capturePluginRegistryLifecycleEpoch(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return retiredRegistries.has(registry) ? void 0 : registryEpochs.get(registry)?.epoch;
}
/** Observe an exact active epoch or explicitly scoped handle without granting activation. */
function capturePluginRegistryLifecycleSignal(registryView, epoch, options) {
	const registry = getPluginRegistryResourceOwner(registryView);
	let current = registryEpochs.get(registry);
	if (retiredRegistries.has(registry) || epoch === void 0 && options?.scopedRuntime !== true || current?.epoch !== epoch) return;
	if (!current) {
		current = {
			epoch: void 0,
			controller: new AbortController()
		};
		registryEpochs.set(registry, current);
	}
	return current.controller?.signal;
}
/** True only while the exact captured registry activation remains current. */
function isPluginRegistryLifecycleEpochActive(registryView, epoch) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return !retiredRegistries.has(registry) && registryEpochs.get(registry)?.epoch === epoch;
}
/** Resolve current contributions for a retained instance instead of its retired birth registry. */
function getPluginRecordRegistry(registry, record) {
	return getPluginRegistryResourceOwner(pluginInstanceState.records.get(record)?.registry ?? registry);
}
function isPluginRecordActive(registry, record) {
	const owner = getPluginRecordRegistry(registry, record);
	return !pluginInstanceState.records.get(record)?.revoked && getPluginInstance(record)?.acceptingCalls !== false && registryEpochs.get(owner)?.epoch !== void 0 && owner.plugins.includes(record) && record.enabled && record.status === "loaded";
}
function revokePluginRecord(registry, record) {
	resolvePluginInstanceOwner(record, registry).revoked = true;
}
function isPluginRegistryPreparing(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	const scope = preparation.getStore();
	return scope?.active === true && scope.registry === registry && !retiredRegistries.has(registry);
}
/** Replacement registration and services share bounded authority before publication. */
function withPluginRegistryPreparationScope(registryView, run) {
	const registry = getPluginRegistryResourceOwner(registryView);
	if (retiredRegistries.has(registry)) throw new Error("Cannot prepare a retired plugin registry");
	const scope = {
		registry,
		active: true
	};
	return preparation.run(scope, () => {
		let pending = false;
		try {
			const result = run();
			if (isPromiseLike(result)) {
				pending = true;
				return Promise.resolve(result).finally(() => {
					scope.active = false;
				});
			}
			return result;
		} finally {
			if (!pending) scope.active = false;
		}
	});
}
/** True after any runtime activation, including a generation retired during publication. */
function isPluginRegistryActivated(registryView) {
	return activatedRegistries.has(getPluginRegistryResourceOwner(registryView));
}
function isPluginRegistryRetired(registryView) {
	const registry = getPluginRegistryResourceOwner(registryView);
	return retiredRegistries.has(registry);
}
function capturePluginLifecycleAuthority(registryView, record, options) {
	const registry = getPluginRegistryResourceOwner(registryView);
	if (record && borrowedRecords.get(registry)?.has(record)) {
		const lent = capturePluginLifecycleAuthority(getPluginRecordRegistry(registry, record), record, options);
		return lent && (() => !retiredRegistries.has(registry) && lent());
	}
	if (record) {
		const owner = resolvePluginInstanceOwner(record, registry);
		const usable = () => {
			const registration = options?.registration ? getPluginRegistryState()?.registrationContext : void 0;
			return !owner.revoked && record.enabled && record.status === "loaded" && (options?.admittedRuntime === true && owner.registry.plugins.includes(record) && owner.instance?.hasActiveCall === true || isPluginRecordActive(registry, record) || isPluginRegistryPreparing(registry) && registry.plugins.includes(record) || registration?.registry === registry && registration.pluginId === record.id && registration.instance === owner.instance && owner.instance?.hasActiveCall === true || options?.scopedRuntime === true && registryEpochs.get(registry)?.epoch === void 0 && !retiredRegistries.has(registry) && registry.plugins.includes(record));
		};
		return owner.registry === registry && usable() ? usable : void 0;
	}
	const epoch = registryEpochs.get(registry)?.epoch;
	if (!epoch && !options?.scopedRuntime || retiredRegistries.has(registry)) return;
	return () => registryEpochs.get(registry)?.epoch === epoch && !retiredRegistries.has(registry);
}
//#endregion
export { markPluginRegistryActive as C, revokePluginRecord as D, quiescePluginRegistry as E, withPluginRegistryPreparationScope as O, markPluginRegistriesRetired as S, preparePluginRegistryCacheShutdown as T, isPluginRegistryGatewayViewOf as _, capturePluginLifecycleAuthority as a, isPluginRegistryRetired as b, getPluginLoaderCacheState as c, getPluginRegistryGatewayOwner as d, getPluginRegistryLifetime as f, isPluginRegistryActivated as g, isPluginRecordBorrowed as h, bindPluginRegistryResourceOwner as i, getPluginRecordRegistry as l, isPluginRecordActive as m, bindPluginRegistryGatewayOwner as n, capturePluginRegistryLifecycleEpoch as o, getPluginRegistryResourceOwner as p, bindPluginRegistryLifetime as r, capturePluginRegistryLifecycleSignal as s, adoptPluginRegistryRecords as t, getPluginRegistryGatewayChannelRegistration as u, isPluginRegistryLifecycleEpochActive as v, markPluginRegistryRetired as w, markPluginRecordBorrowed as x, isPluginRegistryPreparing as y };

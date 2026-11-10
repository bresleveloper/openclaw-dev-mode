import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { t as materializeErrorStack } from "./error-graph-internal-oQNz0sbj.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { a as runWithPluginExecutionFrame, i as pluginInstanceInvocation, n as createPluginExecutionFrame, r as getPluginExecutionFrame } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugins/host-hook-cleanup-result.ts
/** Terminal retirement reports failures only after all admitted cleanup has settled. */
function summarizePluginRetirementResults(results, message) {
	const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length) throw new AggregateError(failures, message);
	const completed = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
	return {
		cleanupCount: completed.reduce((count, result) => count + result.cleanupCount, 0),
		failures: completed.flatMap((result) => result.failures)
	};
}
/** Merge raw instance outcomes without duplicating their existing host or instance report. */
function appendPluginInstanceCleanupFailures(failures, pluginId, result) {
	for (const error of result.errors) {
		if (failures.some((failure) => failure.pluginId === pluginId && failure.error === error && (failure.hookId === "instance" || result.hostCleanupErrors?.includes(error)))) continue;
		failures.push({
			pluginId,
			hookId: "instance",
			error
		});
	}
}
//#endregion
//#region src/plugins/plugin-cache-sdk.ts
/** Derived SDK facts share the plugin cache lifetime; none owns a separate expiry. */
function createPluginCacheSdk() {
	return {
		hosts: /* @__PURE__ */ new Map(),
		contexts: /* @__PURE__ */ new Map(),
		packageNames: /* @__PURE__ */ new Map(),
		packageSearches: /* @__PURE__ */ new Map(),
		argvDirectories: /* @__PURE__ */ new Map(),
		devSourceRoots: /* @__PURE__ */ new Map(),
		runtimeModules: /* @__PURE__ */ new Map(),
		usableDistArtifacts: /* @__PURE__ */ new Map(),
		normalizedJitiAliases: /* @__PURE__ */ new Map(),
		aliasFacts: /* @__PURE__ */ new WeakMap(),
		native: {
			sdkProviders: /* @__PURE__ */ new Map(),
			nextSdkProviderOrder: 0,
			parents: /* @__PURE__ */ new Map(),
			aliases: /* @__PURE__ */ new Map(),
			registeredHosts: /* @__PURE__ */ new Set(),
			hostRoots: /* @__PURE__ */ new Map(),
			nearestPackageRoots: /* @__PURE__ */ new Map(),
			loaderPackageRoots: /* @__PURE__ */ new Map(),
			allowedParentRoots: /* @__PURE__ */ new Map()
		}
	};
}
function getPluginSdkHostFacts(cache, packageRoot) {
	let facts = cache.hosts.get(packageRoot);
	if (!facts) {
		facts = {
			workspaceExports: /* @__PURE__ */ new Map(),
			subpathsByOwner: /* @__PURE__ */ new Map(),
			bundledAliasesByMode: /* @__PURE__ */ new Map(),
			workspaceAliasesByMode: /* @__PURE__ */ new Map()
		};
		cache.hosts.set(packageRoot, facts);
	}
	return facts;
}
function getPluginSdkAliasFacts(sdk, aliasMap) {
	const cache = sdk.aliasFacts;
	let facts = cache.get(aliasMap);
	if (!facts) {
		facts = {};
		cache.set(aliasMap, facts);
	}
	return facts;
}
//#endregion
//#region src/plugins/plugin-instance-error.ts
/** A failed dependency link never constitutes a prepared plugin capture. */
var PluginDependencyLinkError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "PluginDependencyLinkError";
	}
};
/** A retired instance cannot admit a fresh invocation. */
var PluginInstanceUnavailableError = class extends Error {
	constructor(pluginId) {
		super(pluginId ? `Plugin ${pluginId} was reloaded or disabled; use its current tools.` : "Plugin tools changed during automation setup; use the current plugin runtime.");
		this.name = "PluginInstanceUnavailableError";
	}
};
const PluginSourceRecoveryUnavailableError = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceRecoveryUnavailableError"), () => class SourceRecoveryUnavailableError extends Error {
	constructor(cause) {
		super("Captured plugin source is missing; its previous code cannot be recovered.", { cause });
		this.name = "PluginSourceRecoveryUnavailableError";
	}
});
const PluginInstanceDrainTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceDrainTimeoutError"), () => class DrainTimeoutError extends Error {
	constructor(message, settled, options, forcedRetirement) {
		super(message, options);
		this.settled = settled;
		this.forcedRetirement = forcedRetirement;
		this.name = "PluginInstanceDrainTimeoutError";
	}
});
//#endregion
//#region src/plugins/plugin-cache.ts
const PLUGIN_CACHE_FACT_INVALIDATED = "PLUGIN_CACHE_FACT_INVALIDATED";
/** Read-scope invalidation cancels its preparation. */
var PluginCacheFactInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = PLUGIN_CACHE_FACT_INVALIDATED;
	}
};
function isPluginCacheFactInvalidatedError(error) {
	return extractErrorCode(error) === PLUGIN_CACHE_FACT_INVALIDATED;
}
const state = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
	snapshotOwners: /* @__PURE__ */ new WeakMap(),
	retirements: []
}));
const cacheRetainers = resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
const instanceCacheOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
/** Inventories retain admitted instances until transfer or successful physical disposal. */
function retainPluginCacheInstance(instance, cache = getPluginCache()) {
	cache.instances.add(instance);
	let owners = instanceCacheOwners.get(instance);
	if (!owners) instanceCacheOwners.set(instance, owners = /* @__PURE__ */ new Set());
	owners.add(cache);
}
/** A retiring inventory releases its own custody; terminal disposal releases every birth cache. */
function releasePluginCacheInstance(instance, cache) {
	const owners = instanceCacheOwners.get(instance);
	if (cache) {
		cache.instances.delete(instance);
		owners?.delete(cache);
	} else {
		for (const owner of owners ?? []) owner.instances.delete(instance);
		owners?.clear();
	}
	if (owners?.size === 0) instanceCacheOwners.delete(instance);
}
function getPluginCacheRetainers(cache) {
	let retained = cacheRetainers.get(cache);
	if (!retained) {
		retained = {
			references: /* @__PURE__ */ new Set(),
			controller: new AbortController(),
			settled: createDeferredCore()
		};
		cacheRetainers.set(cache, retained);
	}
	return retained;
}
/** Cache retirement revokes cached publications before waiting for admitted borrowers. */
function getPluginCacheRetirementSignal(cache) {
	return getPluginCacheRetainers(cache).controller.signal;
}
/** Admitted generations keep their exact prepared facts through publication replacement. */
function retainPluginCache(cache) {
	const retained = getPluginCacheRetainers(cache);
	if (cache.retirement || retained.retirement) throw new Error("Plugin inventory has retired; begin a new plugin operation.");
	if (retained.references.size === 0) retained.settled = createDeferredCore();
	const reference = {};
	retained.references.add(reference);
	return () => {
		if (retained.references.delete(reference) && retained.references.size === 0) retained.settled.resolve();
	};
}
function getPluginCacheRetention(cache) {
	const retained = cacheRetainers.get(cache);
	return retained?.references.size ? retained.settled.promise : void 0;
}
function createPluginMetadataCache() {
	return {
		current: {
			snapshot: void 0,
			owner: "operation",
			configFingerprint: void 0,
			agentWorkspaceFingerprint: void 0,
			envFingerprint: void 0,
			defaultDiscoveryCompatible: false,
			compatiblePolicyHashes: void 0,
			compatibleConfigFingerprints: void 0,
			revision: Symbol("plugin-metadata-snapshot"),
			configIdentities: /* @__PURE__ */ new WeakSet()
		},
		snapshots: /* @__PURE__ */ new Map(),
		discovery: /* @__PURE__ */ new Map(),
		sharedDiscovery: /* @__PURE__ */ new Map(),
		projections: /* @__PURE__ */ new WeakMap(),
		projectionSources: /* @__PURE__ */ new WeakMap(),
		completions: /* @__PURE__ */ new WeakMap(),
		indexFacts: /* @__PURE__ */ new WeakMap(),
		providerPolicyOwners: /* @__PURE__ */ new WeakMap(),
		channelAdapters: /* @__PURE__ */ new WeakMap(),
		bundledChannelCatalogs: /* @__PURE__ */ new Map(),
		bundledProviderPolicySurfaces: /* @__PURE__ */ new WeakMap(),
		staticCatalogStates: /* @__PURE__ */ new WeakMap(),
		modelSuppressionResolvers: /* @__PURE__ */ new WeakMap(),
		mcpAuthDeclarations: /* @__PURE__ */ new WeakMap()
	};
}
/** Invalidate discovery facts without retiring callbacks owned by this operation. */
function invalidatePluginCacheMetadata(cache) {
	cache.inspectionNativeEsmPolicy = void 0;
	cache.sourceAdmissions?.invalidate();
	cache.metadata = createPluginMetadataCache();
	cache.sdk.native.parents.clear();
	for (const root of cache.roots.values()) {
		root.files.clear();
		root.checkedEntries.clear();
		root.paths.clear();
		root.directory = void 0;
		root.artifacts.clear();
		root.runtimeArtifacts.clear();
		root.entryBoundaries.clear();
		root.entryPaths.clear();
	}
	cache.rootAliases.clear();
	cache.installRecords.clear();
	cache.persistedInstalledIndex.clear();
	cache.preparedBundledDiscoveryModes.clear();
	cache.dependencyStatus = /* @__PURE__ */ new WeakMap();
}
/** Each inventory owns its acquired facts and reusable load results; publication owns activation. */
function createPluginCache(options = {}) {
	return {
		async [Symbol.asyncDispose]() {
			await retirePluginCache(this);
		},
		kind: options.kind ?? "operation",
		roots: /* @__PURE__ */ new Map(),
		rootAliases: /* @__PURE__ */ new Map(),
		sdk: createPluginCacheSdk(),
		setupModules: /* @__PURE__ */ new Map(),
		instances: /* @__PURE__ */ new Set(),
		metadata: createPluginMetadataCache(),
		installRecords: /* @__PURE__ */ new Map(),
		persistedInstalledIndex: /* @__PURE__ */ new Map(),
		preparedBundledDiscoveryModes: /* @__PURE__ */ new Map(),
		dependencyStatus: /* @__PURE__ */ new WeakMap(),
		moduleLoaders: /* @__PURE__ */ new Map(),
		sources: /* @__PURE__ */ new Map(),
		sourceAliases: /* @__PURE__ */ new Map(),
		runtimeRecordRoots: /* @__PURE__ */ new WeakMap()
	};
}
function getProcessPluginCache() {
	return state.current ??= createPluginCache({ kind: "process" });
}
/** Startup publishes its complete owner, including facts acquired before the kernel existed. */
function adoptProcessPluginCache(cache) {
	cache.kind = "process";
	state.current = cache;
}
function getScopedPluginCache() {
	return getPluginExecutionFrame()?.cacheScope?.cache;
}
/** An explicit install refreshes its enclosing command's metadata phases. */
function getScopedPluginCaches() {
	const caches = [];
	for (let scope = getPluginExecutionFrame()?.cacheScope; scope; scope = scope.parent) caches.push(scope.cache);
	return caches;
}
function getPluginCache() {
	return getScopedPluginCache() ?? getProcessPluginCache();
}
function withPluginCache(cache, run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(createPluginExecutionFrame({
		...current,
		cacheScope: {
			cache,
			parent: current?.cacheScope
		}
	}, current), run);
}
/** Coalesce reads; an invalidated in-flight read may finish without repopulating the cache. */
async function preparePluginCacheFact(owner, facts, key, read) {
	const signal = getPluginCacheRetirementSignal(owner);
	signal.throwIfAborted();
	let current = facts.get(key);
	if (!current) {
		const release = retainPluginCache(owner);
		let reading;
		try {
			reading = read();
		} catch (error) {
			release();
			throw error;
		}
		const pending = { pending: reading.then((value) => {
			signal.throwIfAborted();
			const published = facts.get(key);
			if (published && "value" in published) return published;
			const ready = { value };
			if (published === pending) facts.set(key, ready);
			return ready;
		}).catch((error) => {
			if (facts.get(key) === pending) facts.delete(key);
			throw error;
		}).finally(release) };
		facts.set(key, pending);
		current = pending;
	}
	const ready = "pending" in current ? await current.pending : current;
	const assertCurrent = () => {
		signal.throwIfAborted();
	};
	assertCurrent();
	return {
		value: ready.value,
		assertCurrent
	};
}
function runOutsidePluginCache(run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(createPluginExecutionFrame({
		...current,
		cacheScope: void 0
	}, current), run);
}
const MAX_CACHED_PLUGIN_METADATA_SNAPSHOTS = 64;
/** Keep recently used discovery views; active scopes retain their own snapshot references. */
function readPluginMetadataSnapshotCache(key) {
	const snapshot = getPluginCache().metadata.snapshots.get(key);
	if (snapshot) cachePluginMetadataSnapshot(key, snapshot);
	return snapshot;
}
function cachePluginMetadataSnapshot(key, snapshot) {
	const snapshots = getPluginCache().metadata.snapshots;
	snapshots.delete(key);
	snapshots.set(key, snapshot);
	pruneMapToMaxSize(snapshots, 64);
}
/** Frozen views retain their producer so deferred access fills the same generation. */
function bindPluginMetadataSnapshotCache(snapshot, cache = getPluginCache()) {
	state.snapshotOwners.set(snapshot, cache);
}
function getPluginMetadataSnapshotCache(snapshot) {
	return state.snapshotOwners.get(snapshot) ?? getPluginCache();
}
/** Only the lifecycle owner retires the process cache; operation scopes remain independent. */
function resetPluginCache() {
	const previous = state.current;
	state.current = void 0;
	if (previous) {
		for (const source of previous.sources.values()) source.disposeModule?.();
		state.retirements.push({
			cache: previous,
			completion: retirePluginCache(previous).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))
		});
	}
}
/** Failed loaders retain their real completion under the cache that admitted them. */
function retirePluginCacheInstance(instance, cache = getPluginCache()) {
	retainPluginCacheInstance(instance, cache);
	const completion = pluginInstanceInvocation.exit(() => instance.dispose()).then((result) => {
		if (result.errors.length === 0) releasePluginCacheInstance(instance, cache);
	});
	completion.catch(() => {});
	return completion;
}
/** Stop new setup calls immediately; the owner awaits in-flight calls and graph cleanup. */
function retirePluginCache(cache, beforeRetire, options) {
	const retained = getPluginCacheRetainers(cache);
	if (retained.retirement) return retained.retirement;
	const completion = createDeferredCore();
	retained.retirement = completion.promise;
	const retire = async () => {
		if (retained.references.size) await retained.settled.promise;
		const work = new AsyncWorkScope();
		try {
			return await work.track(() => beginPluginCacheRetirement(cache, beforeRetire, options));
		} finally {
			await work.drain();
		}
	};
	retained.controller.abort();
	materializeErrorStack(retained.controller.signal.reason);
	runOutsideAsyncWorkScope(retire).then(completion.resolve, completion.reject);
	return completion.promise;
}
function beginPluginCacheRetirement(cache, beforeRetire, options) {
	if (cache.retirement) return cache.retirement;
	const retirement = createDeferredCore();
	cache.retirement = retirement.promise;
	const cleanup = async () => {
		beforeRetire?.();
		const registries = cache.retireRegistryLoads?.();
		const resources = /* @__PURE__ */ new Set([...cache.setupModules.values(), ...cache.instances]);
		for (const resource of resources) resource.quiesce();
		const [registry] = await Promise.allSettled([registries]);
		const outcomes = await Promise.allSettled([...resources].map(async (resource) => ({
			resource,
			result: await resource.dispose(void 0, options)
		})));
		const nativeAdmissions = cache.sourceAdmissions;
		if (nativeAdmissions) {
			const pending = outcomes.flatMap((outcome) => outcome.status === "fulfilled" ? outcome.value.result.errors.flatMap((error) => error instanceof PluginInstanceDrainTimeoutError ? [error.settled] : []) : []);
			if (pending.length > 0) Promise.allSettled(pending).then(() => nativeAdmissions.dispose()).catch((error) => process.emitWarning(`Plugin native capture cleanup failed: ${String(error)}`));
			else await nativeAdmissions.dispose();
		}
		cache.setupModules.clear();
		for (const instance of cache.instances) releasePluginCacheInstance(instance, cache);
		const unexpected = [...registry.status === "rejected" ? [registry.reason] : [], ...outcomes.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
		if (unexpected.length) throw new AggregateError(unexpected, "Plugin cache resources failed to retire");
		const host = registry.status === "fulfilled" ? registry.value : void 0;
		const failures = [...host?.failures ?? []];
		for (const outcome of outcomes) {
			if (outcome.status !== "fulfilled") continue;
			const { resource, result } = outcome.value;
			appendPluginInstanceCleanupFailures(failures, resource.pluginId, result);
		}
		return {
			cleanupCount: host?.cleanupCount ?? 0,
			failures
		};
	};
	cleanup().then(retirement.resolve, retirement.reject);
	return retirement.promise;
}
/** Consume retirements initiated by synchronous config/setup cache invalidation. */
async function waitForPluginCacheRetirement(includeBorrowed = false) {
	const ready = state.retirements.filter(({ cache }) => includeBorrowed || cache.kind !== "process" || !getPluginCacheRetention(cache));
	state.retirements = state.retirements.filter((retirement) => !ready.includes(retirement));
	return summarizePluginRetirementResults(await Promise.all(ready.map((retirement) => retirement.completion)), "Plugin cache retirement failed");
}
function getPluginCacheRoot(rootDir) {
	const cache = getPluginCache();
	const cached = cache.roots.get(cache.rootAliases.get(rootDir) ?? rootDir);
	if (cached) return cached;
	const lexical = path.resolve(rootDir);
	const key = cache.rootAliases.get(lexical) ?? lexical;
	let root = cache.roots.get(key);
	if (!root) {
		root = {
			rootDir: key,
			files: /* @__PURE__ */ new Map(),
			checkedEntries: /* @__PURE__ */ new Map(),
			paths: /* @__PURE__ */ new Map(),
			artifactLoadsInProgress: /* @__PURE__ */ new Set(),
			artifacts: /* @__PURE__ */ new Map(),
			runtimeArtifacts: /* @__PURE__ */ new Map(),
			entryBoundaries: /* @__PURE__ */ new Map(),
			entryPaths: /* @__PURE__ */ new Map()
		};
		cache.roots.set(key, root);
	}
	return root;
}
function mergeRootFacts(target, source) {
	for (const [key, value] of source) if (!target.has(key)) target.set(key, value);
}
/** Bind aliases only after a checked file establishes their shared package boundary. */
function bindPluginCacheRoot(rootDir, canonicalRoot) {
	const cache = getPluginCache();
	const lexical = path.resolve(rootDir);
	const canonical = path.resolve(canonicalRoot);
	const root = getPluginCacheRoot(lexical);
	root.rootDir = canonical;
	const existing = cache.roots.get(canonical);
	if (existing && existing !== root) {
		mergeRootFacts(root.files, existing.files);
		mergeRootFacts(root.checkedEntries, existing.checkedEntries);
		mergeRootFacts(root.paths, existing.paths);
		mergeRootFacts(root.artifacts, existing.artifacts);
		mergeRootFacts(root.runtimeArtifacts, existing.runtimeArtifacts);
		mergeRootFacts(root.entryBoundaries, existing.entryBoundaries);
		mergeRootFacts(root.entryPaths, existing.entryPaths);
		root.directory ??= existing.directory;
		root.publicSurfaceBoundary ??= existing.publicSurfaceBoundary;
		for (const artifact of existing.artifactLoadsInProgress) root.artifactLoadsInProgress.add(artifact);
		Object.assign(existing, root);
	}
	cache.roots.set(canonical, root);
	cache.rootAliases.set(lexical, canonical);
	return root;
}
function getPluginCacheSource(modulePath, cache = getPluginCache()) {
	const cached = cache.sources.get(cache.sourceAliases.get(modulePath) ?? modulePath);
	if (cached) return cached;
	const lexical = path.resolve(modulePath.startsWith("file:") ? fileURLToPath(modulePath) : modulePath);
	const key = cache.sourceAliases.get(lexical) ?? lexical;
	let source = cache.sources.get(key);
	if (!source) {
		source = {
			variants: /* @__PURE__ */ new Map(),
			validatedBoundaries: /* @__PURE__ */ new Set()
		};
		cache.sources.set(key, source);
	}
	return source;
}
//#endregion
export { PluginDependencyLinkError as A, retainPluginCache as C, runOutsidePluginCache as D, retirePluginCacheInstance as E, getPluginSdkHostFacts as F, appendPluginInstanceCleanupFailures as I, summarizePluginRetirementResults as L, PluginInstanceUnavailableError as M, PluginSourceRecoveryUnavailableError as N, waitForPluginCacheRetirement as O, getPluginSdkAliasFacts as P, resetPluginCache as S, retirePluginCache as T, invalidatePluginCacheMetadata as _, bindPluginMetadataSnapshotCache as a, readPluginMetadataSnapshotCache as b, getPluginCache as c, getPluginCacheRoot as d, getPluginCacheSource as f, getScopedPluginCaches as g, getScopedPluginCache as h, bindPluginCacheRoot as i, PluginInstanceDrainTimeoutError as j, withPluginCache as k, getPluginCacheRetention as l, getProcessPluginCache as m, PluginCacheFactInvalidatedError as n, cachePluginMetadataSnapshot as o, getPluginMetadataSnapshotCache as p, adoptProcessPluginCache as r, createPluginCache as s, MAX_CACHED_PLUGIN_METADATA_SNAPSHOTS as t, getPluginCacheRetirementSignal as u, isPluginCacheFactInvalidatedError as v, retainPluginCacheInstance as w, releasePluginCacheInstance as x, preparePluginCacheFact as y };

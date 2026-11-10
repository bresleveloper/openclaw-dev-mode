import { A as isMissingPathError, D as escapeRegExp, O as hasErrnoCode } from "./redact-tYkqLD33.mjs";
import { B as resolveGlobalSingleton, F as normalizeOptionalString, M as normalizeLowercaseStringOrEmpty, V as asNullableRecord, o as normalizeWindowsPathPreservingCase } from "./utils-c2rFzEZe.mjs";
import "./errors-CvkendJg.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.mjs";
import { i as getPluginExecutionFrame } from "./listeners-D1WzHpsK.mjs";
import { createRequire } from "node:module";
import fsSync, { fstatSync, readdirSync, realpathSync, statSync, default as openClawRootFsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileDescriptorBoundedSync, readFileWindowFullySync } from "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import "@openclaw/fs-safe/path";
import { isUtf8 } from "node:buffer";
import { realpath, stat } from "node:fs/promises";
//#region src/infra/git-root.ts
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	for (let i = 0; opts.maxDepth === void 0 || i < opts.maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function readGitMetadataFile(filePath, limit = 1048576) {
	const fd = fsSync.openSync(filePath, fsSync.constants.O_RDONLY | (fsSync.constants.O_NONBLOCK ?? 0));
	try {
		const stat = fsSync.fstatSync(fd);
		if (!stat.isFile() || stat.size > limit) throw new Error("Git metadata is not a bounded regular file");
		const bytes = readFileDescriptorBoundedSync(fd, Math.min(stat.size, limit));
		if (bytes.length !== stat.size) throw new Error("Git metadata changed during its read");
		return bytes;
	} finally {
		fsSync.closeSync(fd);
	}
}
function readGitDirectoryPointerTarget(filePath, prefix = "") {
	const bytes = readGitMetadataFile(filePath);
	const raw = bytes.toString("utf8").replace(/[\r\n]+$/u, "");
	if (!isUtf8(bytes) || !raw.startsWith(prefix) || raw.length === prefix.length || raw.includes("\0")) throw new Error("Git directory pointer is incomplete or malformed");
	const target = raw.slice(prefix.length);
	return path.isAbsolute(target) ? target : `${path.dirname(filePath)}${path.sep}${target}`;
}
function readGitDirectoryPointer(filePath, prefix = "") {
	return fsSync.realpathSync.native(readGitDirectoryPointerTarget(filePath, prefix));
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fsSync.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		return readGitDirectoryPointer(gitPath, "gitdir: ");
	} catch {
		return null;
	}
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}
/** Read at most `limit` bytes from Git or build metadata. */
function readGitMetadataPrefix(filePath, limit = 256) {
	const fd = fsSync.openSync(filePath, fsSync.constants.O_RDONLY | (fsSync.constants.O_NONBLOCK ?? 0));
	try {
		if (!fsSync.fstatSync(fd).isFile()) throw new Error("Git metadata is not a regular file");
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fsSync.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = readGitMetadataFile(headPath).toString("utf8").trim();
	if (!head.startsWith("ref:")) return {
		headPath,
		ref: null,
		value: head || null
	};
	const ref = head.replace(/^ref:\s*/i, "").trim();
	const refsBase = resolveGitRefsBase(headPath);
	return {
		headPath,
		ref,
		value: readGitRefs(refsBase, [ref]).get(ref) ?? null,
		refsBase
	};
}
function resolveGitRefsBase(headPath) {
	const gitDir = path.dirname(headPath);
	const marker = path.join(gitDir, "commondir");
	try {
		return readGitDirectoryPointer(marker);
	} catch (error) {
		if (!isMissingPathError(error) || fsSync.lstatSync(marker, { throwIfNoEntry: false })) throw error;
	}
	return gitDir;
}
/** Raw ref contents, sharing one packed inventory across the requested names. */
function readGitRefs(refsBase, refs) {
	const values = new Map(refs.map((ref) => [ref, null]));
	const missing = /* @__PURE__ */ new Set();
	for (const ref of refs) {
		const refPath = resolveRefPath(refsBase, ref);
		if (!refPath) continue;
		try {
			values.set(ref, readGitMetadataPrefix(refPath).trim());
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			missing.add(ref);
		}
	}
	if (missing.size === 0) return values;
	try {
		const packedRefs = readGitMetadataFile(path.join(refsBase, "packed-refs"), Number.MAX_SAFE_INTEGER).toString("utf8");
		const records = new RegExp(`^(?![#^])[^\\S\\r\\n]*(\\S+)[^\\S\\r\\n]+(${[...missing].map(escapeRegExp).join("|")})(?=\\s|$)`, "gm");
		for (const [, value, packedRef] of packedRefs.matchAll(records)) if (missing.delete(packedRef)) values.set(packedRef, value);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
//#endregion
//#region src/infra/error-graph-internal.ts
/** Retained errors must not keep callers alive through V8's lazy stack frames. */
function materializeErrorStack(failure) {
	let error = failure;
	const seen = /* @__PURE__ */ new Set();
	while (error instanceof Error && !seen.has(error)) {
		seen.add(error);
		try {
			error.stack = String(error.stack);
		} catch {
			error.stack = "Stack trace unavailable: custom formatter failed";
		}
		error = error.cause;
	}
}
//#endregion
//#region src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule("node:async_hooks");
const detachedAsyncContext = asyncHooks ? resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context")) : void 0;
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext ? detachedAsyncContext.runInAsyncScope(run) : run();
}
//#endregion
//#region src/shared/async-work-scope.ts
const currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
const currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
/** Joins cooperating descendants even when their caller returns a cached value first. */
var AsyncWorkScope = class AsyncWorkScope {
	constructor(failures) {
		this.failures = failures;
		this.pending = /* @__PURE__ */ new Set();
		this.controller = new AbortController();
		this.phase = "open";
	}
	get signal() {
		return this.controller.signal;
	}
	get hasPendingWork() {
		return this.pending.size > 0;
	}
	get isClosing() {
		return this.phase !== "open";
	}
	enter(run) {
		const owner = currentWorkScope.getStore();
		const ancestry = currentWorkScopeAncestry.getStore();
		const parent = owner ? ancestry?.scope === owner ? ancestry : { scope: owner } : void 0;
		return new AsyncResource("OpenClawAsyncWorkScope").runInAsyncScope(() => {
			currentWorkScope.enterWith(this);
			currentWorkScopeAncestry.enterWith({
				scope: this,
				parent
			});
			return run();
		});
	}
	/** Enters synchronous work without inspecting or assimilating its return value. */
	run(run) {
		if (this.phase === "closed") throw new Error("Async work scope is closed");
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		try {
			return this.enter(run);
		} finally {
			operation.resolve();
			this.pending.delete(operation.promise);
		}
	}
	track(run) {
		if (this.phase === "closed") return Promise.reject(/* @__PURE__ */ new Error("Async work scope is closed"));
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
			this.pending.delete(operation.promise);
			this.failures?.add(error);
		});
		try {
			operation.resolve(this.enter(run));
		} catch (error) {
			operation.reject(error);
		}
		return operation.promise;
	}
	beginClose(reason) {
		if (this.phase !== "open") return;
		this.phase = "closing";
		this.controller.abort(reason);
	}
	/** Starts the next phase in the same continuation that observes settled pending work. */
	runWhenIdle(run) {
		return AsyncWorkScope.runWhenAllIdle(() => [this], () => this.track(run));
	}
	/** Reselects owners so work admitted into a later phase is not mistaken for earlier work. */
	static async runWhenAllIdle(selectScopes, run) {
		let scopes = selectScopes();
		while (scopes.some((scope) => scope.pending.size > 0)) {
			await Promise.allSettled(scopes.flatMap((scope) => Array.from(scope.pending)));
			scopes = selectScopes();
		}
		return run();
	}
	async drain() {
		this.beginClose();
		while (this.pending.size > 0) await Promise.allSettled(this.pending);
		this.phase = "closed";
	}
};
/** Starts work its caller does not own, so the caller's scope neither waits for it nor closes under it. */
function runOutsideAsyncWorkScope(run) {
	return currentWorkScope.exit(() => currentWorkScopeAncestry.exit(run));
}
//#endregion
//#region src/plugins/host-hook-cleanup-result.ts
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
resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceRecoveryUnavailableError"), () => class SourceRecoveryUnavailableError extends Error {
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
const state = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
	snapshotOwners: /* @__PURE__ */ new WeakMap(),
	retirements: []
}));
const cacheRetainers = resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
const instanceCacheOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
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
//#endregion
//#region src/infra/openclaw-root.ts
function parsePackageName(raw) {
	const parsed = JSON.parse(raw);
	return typeof parsed.name === "string" ? parsed.name : null;
}
function readPackageNameSync(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
function findPackageRootSync(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) if (readPackageNameSync(current) === "openclaw") return current;
	return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
	let current = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		yield current;
		if (path.basename(current) === "node_modules") break;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
}
function candidateDirsFromArgv1(argv1) {
	const argv1CandidateCache = getPluginCache().sdk.argvDirectories;
	const cacheKey = path.resolve(argv1);
	const cached = argv1CandidateCache.get(cacheKey);
	if (cached) return [...cached];
	const normalized = cacheKey;
	const candidates = [];
	try {
		const resolved = openClawRootFsSync.realpathSync(normalized);
		if (resolved !== normalized) candidates.push(path.dirname(resolved));
	} catch {}
	candidates.push(path.dirname(normalized));
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		candidates.push(path.join(nodeModulesDir, binName));
	}
	const deduped = dedupeCandidates(candidates);
	argv1CandidateCache.set(cacheKey, deduped);
	return [...deduped];
}
function preparePackageRootSearch(opts, preserveInventory) {
	const candidates = buildCandidates(opts);
	const cacheKey = candidates.join("\0");
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	return {
		candidates,
		first: cached?.all ? cached.all[0] ?? null : cached?.first,
		complete(first) {
			searches.set(cacheKey, preserveInventory ? {
				...searches.get(cacheKey),
				first
			} : { first });
			return first;
		}
	};
}
function resolveOpenClawPackageRootSync(opts) {
	const search = preparePackageRootSearch(opts, false);
	if (search.first !== void 0) return search.first;
	for (const candidate of search.candidates) {
		const found = findPackageRootSync(candidate);
		if (found) return search.complete(found);
	}
	return search.complete(null);
}
function buildCandidates(opts) {
	const candidates = [];
	if (opts.moduleUrl) try {
		candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
	} catch {}
	if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
	if (opts.cwd) candidates.push(opts.cwd);
	return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
	return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
}
//#endregion
//#region src/infra/git-commit.ts
const formatCommit = (value) => {
	const match = value?.match(/[0-9a-fA-F]{7,40}/);
	return match ? normalizeLowercaseStringOrEmpty(match[0].slice(0, 7)) : null;
};
const cachedGitCommitBySearchDir = new LruCache(256);
const resolveCommitSearchDir = (options) => {
	if (options.cwd) return path.resolve(options.cwd);
	if (options.moduleUrl) try {
		return path.dirname(fileURLToPath(options.moduleUrl));
	} catch {}
	return process.cwd();
};
const cacheGitCommit = (searchDir, commit) => {
	cachedGitCommitBySearchDir.set(searchDir, commit);
	return commit;
};
const resolveGitLookupDepth = (searchDir, packageRoot) => {
	if (!packageRoot) return;
	const relative = path.relative(packageRoot, searchDir);
	if (relative.startsWith("..") || path.isAbsolute(relative)) return;
	return (relative ? relative.split(path.sep).filter(Boolean).length : 0) + 1;
};
const readCommitFromGit = (searchDir, packageRoot) => {
	const head = readGitHead(searchDir, { maxDepth: resolveGitLookupDepth(searchDir, packageRoot) });
	return head === void 0 ? void 0 : formatCommit(head.value);
};
const readCommitFromPackageJson = () => {
	try {
		const pkg = createRequire(import.meta.url)("../../package.json");
		return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
	} catch {
		return null;
	}
};
const readCommitProbe = (moduleUrl, candidates, field) => {
	try {
		for (const candidate of candidates) {
			const filePath = fileURLToPath(new URL(candidate, moduleUrl));
			let raw;
			try {
				raw = readGitMetadataPrefix(filePath, 1024);
			} catch (error) {
				if (isMissingPathError(error)) continue;
				return null;
			}
			try {
				const value = asNullableRecord(JSON.parse(raw))?.[field];
				return typeof value === "string" ? formatCommit(value) : null;
			} catch {
				return null;
			}
		}
	} catch {}
};
const readCommitFromBuildInfo = (moduleUrl = import.meta.url) => {
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit") ?? null;
};
const readLoadedCommit = (moduleUrl) => {
	const buildStamp = readCommitProbe(moduleUrl, ["../.buildstamp", "./.buildstamp"], "head");
	const runtimeStamp = readCommitProbe(moduleUrl, ["../.runtime-postbuildstamp", "./.runtime-postbuildstamp"], "head");
	if (buildStamp !== void 0 || runtimeStamp !== void 0) {
		if (buildStamp || runtimeStamp) return buildStamp && buildStamp === runtimeStamp ? buildStamp : null;
		return readCommitFromBuildInfo(moduleUrl);
	}
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit");
};
const resolveCommitHash = (options = {}) => {
	const env = options.env ?? process.env;
	const readers = options.readers ?? {};
	const readGitCommit = readers.readGitCommit ?? readCommitFromGit;
	const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
	const normalized = formatCommit(envCommit);
	if (normalized) return normalized;
	const searchDir = resolveCommitSearchDir(options);
	const cached = cachedGitCommitBySearchDir.get(searchDir);
	if (cached !== void 0) return cached;
	const packageRoot = resolveOpenClawPackageRootSync({
		cwd: options.cwd,
		moduleUrl: options.moduleUrl
	});
	try {
		const gitCommit = readGitCommit(searchDir, packageRoot);
		if (gitCommit !== void 0) return cacheGitCommit(searchDir, gitCommit);
	} catch {}
	const buildInfoCommit = readers.readBuildInfoCommit?.() ?? readCommitFromBuildInfo();
	if (buildInfoCommit) return cacheGitCommit(searchDir, buildInfoCommit);
	const pkgCommit = readers.readPackageJsonCommit?.() ?? readCommitFromPackageJson();
	if (pkgCommit) return cacheGitCommit(searchDir, pkgCommit);
	try {
		return cacheGitCommit(searchDir, readGitCommit(searchDir, packageRoot) ?? null);
	} catch {
		return cacheGitCommit(searchDir, null);
	}
};
/** Resolve the commit that produced the loaded artifact, not the checkout's current revision. */
function resolveLoadedCommitHash(options = {}) {
	const moduleUrl = options.moduleUrl ?? import.meta.url;
	const loaded = readLoadedCommit(moduleUrl);
	return loaded === void 0 ? resolveCommitHash({
		moduleUrl,
		...options.env ? { env: options.env } : {}
	}) : loaded;
}
//#endregion
//#region src/version.ts
const CORE_PACKAGE_NAME = "openclaw";
const PACKAGE_JSON_CANDIDATES = [
	"../package.json",
	"../../package.json",
	"../../../package.json",
	"./package.json"
];
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = normalizeOptionalString(parsed.version);
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function readBuildIdFromJsonCandidates(moduleUrl) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of BUILD_INFO_CANDIDATES) try {
			const parsed = require(candidate);
			const buildId = normalizeOptionalString(parsed.buildId);
			if (buildId && buildId.length <= 96) return buildId;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function readBuildIdFromBuildInfoForModuleUrl(moduleUrl) {
	return readBuildIdFromJsonCandidates(moduleUrl);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromBuildInfoForModuleUrl(moduleUrl) || readVersionFromPackageJsonForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
	return resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
const RUNTIME_SERVICE_VERSION_FALLBACK = "unknown";
function resolveUsableRuntimeVersion(version) {
	const trimmed = normalizeOptionalString(version);
	if (!trimmed || trimmed === "0.0.0") return;
	return trimmed;
}
function resolveVersionFromRuntimeSources(params) {
	return firstNonEmpty(...params.preference === "env-first" ? [params.env["OPENCLAW_VERSION"], params.runtimeVersion] : [params.runtimeVersion, params.env["OPENCLAW_VERSION"]], params.env["npm_package_version"]) ?? params.fallback;
}
readBuildIdFromBuildInfoForModuleUrl(import.meta.url);
const RUNTIME_SERVICE_COMMIT = resolveLoadedCommitHash({ moduleUrl: import.meta.url });
function resolveRuntimeServiceCommit() {
	return RUNTIME_SERVICE_COMMIT;
}
function resolveCompatibilityHostVersion(env = process.env, fallback = RUNTIME_SERVICE_VERSION_FALLBACK) {
	const explicitCompatibilityVersion = firstNonEmpty(env.OPENCLAW_COMPATIBILITY_HOST_VERSION);
	if (explicitCompatibilityVersion) return explicitCompatibilityVersion;
	return resolveVersionFromRuntimeSources({
		env,
		runtimeVersion: resolveUsableRuntimeVersion(VERSION),
		fallback,
		preference: env === process.env ? "runtime-first" : "env-first"
	});
}
const VERSION = resolveBinaryVersion({
	moduleUrl: import.meta.url,
	bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
//#endregion
//#region src/infra/sql-connection.ts
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertPostgresTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
const postgresConnectionBrand = Symbol.for("openclaw.postgres-sync-connection");
function isPostgresSqlConnection(db) {
	return postgresConnectionBrand in db && db[postgresConnectionBrand] === true;
}
/** Publications and receipts must key on the store anchor for every engine. */
function sqlPublicationAnchor(db) {
	return isPostgresSqlConnection(db) ? db.anchor : db;
}
//#endregion
//#region src/infra/sqlite-worker-identity.ts
const useDatabaseBirthtime = process.platform !== "linux" && process.platform !== "android";
function databaseFileIdentityKey(file) {
	return `${file.dev}:${file.ino}`;
}
function readDatabaseIdentityBirthtime(file) {
	return useDatabaseBirthtime ? file.birthtimeNs.toString() : "0";
}
/** Native SQLite namespaces are filesystem locators, not distinct database owners. */
function normalizeDatabasePath(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(normalized) ? location : normalized;
}
function readDatabaseFileIdentity(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("key" in value) || typeof value.key !== "string" || !/^file:(?:0|[1-9]\d{0,19}):(?:0|[1-9]\d{0,19})$/.test(value.key) || "birthtime" in value && value.birthtime !== void 0 && (typeof value.birthtime !== "string" || !/^-?(?:0|[1-9]\d{0,29})$/.test(value.birthtime))) throw new Error("SQLite snapshot requires a captured physical file identity");
	return {
		key: value.key,
		..."birthtime" in value && typeof value.birthtime === "string" ? { birthtime: value.birthtime } : {}
	};
}
function assertDatabaseFileIdentity(file, expected) {
	if (!file.isFile() || `file:${databaseFileIdentityKey(file)}` !== expected.key || expected.birthtime !== void 0 && readDatabaseIdentityBirthtime(file) !== expected.birthtime) throw new Error("SQLite database file identity changed before existing-only open");
}
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino || readDatabaseIdentityBirthtime(file) !== readDatabaseIdentityBirthtime(canonicalFile)) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${databaseFileIdentityKey(file)}`,
		canonicalPath: normalizeDatabasePath(canonicalPath),
		birthtime: readDatabaseIdentityBirthtime(file)
	};
}
function missingAncestorParent(ancestor, missing, error) {
	if (!hasErrnoCode(error, "ENOENT")) throw error;
	missing.unshift(path.basename(ancestor));
	const parent = path.dirname(ancestor);
	if (parent === ancestor) throw error;
	return parent;
}
/** In-process owner key only; never rewrite a configured or persisted database locator. */
function resolveDatabasePathKey(databasePath) {
	let ancestor = path.resolve(databasePath);
	const missing = [];
	while (true) try {
		return normalizeDatabasePath(path.join(realpathSync.native(ancestor), ...missing));
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = resolveDatabasePathKey(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const canonicalPath = resolveDatabasePathKey(resolvedPath);
	return {
		key: `path:${canonicalPath}`,
		canonicalPath
	};
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
/** Inspect retained aliases only while binding a newly observed database path. */
function findChangedDatabasePaths(paths, observed) {
	return [...paths].filter((pathname) => inspectDatabasePathIdentitySync(pathname)?.key !== observed.key);
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat(databasePath, { bigint: true }).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) try {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat(canonicalPath, { bigint: true }), canonicalPath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error("SQLite database pathname changed during admission", { cause: error });
		throw error;
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = normalizeDatabasePath(path.join(await realpath(ancestor), ...missing));
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
function assertExistingDatabaseIdentity(databasePath, expected, expectedBirthtime) {
	assertDatabaseFileIdentity(statSync(databasePath, { bigint: true }), {
		key: expected,
		birthtime: expectedBirthtime
	});
}
function isSoleDatabaseFileDescriptor(descriptor, file) {
	if (process.platform !== "linux") return false;
	try {
		for (const name of readdirSync("/proc/self/fd")) {
			if (!/^\d+$/u.test(name) || Number(name) === descriptor) continue;
			try {
				const other = fstatSync(Number(name), { bigint: true });
				if (other.dev === file.dev && other.ino === file.ino) return false;
			} catch (error) {
				if (!hasErrnoCode(error, "EBADF")) return false;
			}
		}
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { materializeErrorStack as A, getProcessPluginCache as C, AsyncWorkScope as D, invalidatePluginCacheMetadata as E, runOutsideAsyncWorkScope as O, getPluginCacheRoot as S, getScopedPluginCaches as T, resolveOpenClawPackageRootSync as _, normalizeDatabasePath as a, getPluginCache as b, readDatabasePathIdentity as c, assertSyncTransactionResult as d, isPostgresSqlConnection as f, resolveRuntimeServiceCommit as g, resolveCompatibilityHostVersion as h, isSoleDatabaseFileDescriptor as i, runInDetachedAsyncContext as k, readDatabasePathIdentitySync as l, VERSION as m, findChangedDatabasePaths as n, readDatabaseFileIdentity as o, sqlPublicationAnchor as p, inspectDatabasePathIdentitySync as r, readDatabaseIdentityBirthtime as s, assertExistingDatabaseIdentity as t, assertPostgresTransactionUsable as u, PluginCacheFactInvalidatedError as v, getScopedPluginCache as w, getPluginCacheRetirementSignal as x, bindPluginCacheRoot as y };

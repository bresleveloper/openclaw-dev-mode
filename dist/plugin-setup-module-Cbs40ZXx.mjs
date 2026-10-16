import { l as stringifyNonErrorCause, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext, c as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { D as withPluginCache, O as PluginInstanceDrainTimeoutError, k as PluginInstanceUnavailableError, o as getPluginCache, r as bindPluginCacheRoot, u as getPluginCacheSource, w as retirePluginCacheInstance, y as releasePluginCacheInstance } from "./plugin-cache-BABafcXD.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { k as walkDirectorySync, t as FsSafeError } from "./fs-safe-BUXBSN-4.mjs";
import { o as openRootFileSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-CtZdPPcK.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { a as safeRealpathSync } from "./path-safety-6KJ2Rbnw.mjs";
import { l as pluginCacheRealpathSync } from "./package-manifest-CEbdS_C4.mjs";
import { d as resolveCanonicalDistRuntimeSource, f as resolvePluginRuntimeArtifactPreference, p as resolvePluginRuntimeArtifactSelection, u as prefersBuiltPluginArtifacts } from "./bundled-dir-DkyLPnyV.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-C9pW4xqI.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-CMOJTUWl.mjs";
import { a as registerCapturedPluginModuleResolver, d as useNodeModuleHooks, i as isPluginSourceModulePath, n as clearPluginModuleRequireCache, o as resolvePluginLoaderTryNative, r as isJavaScriptModulePath, s as supportsBunRuntimeOnResolveTargets } from "./native-module-require-BX9Ubdbu.mjs";
import { c as toSafeImportPath, o as installOpenClawPluginSdkNativeResolver, s as resolvePluginNativeAliasForParent, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { n as PluginHostObject, t as PluginCallToken } from "./plugin-instance-owned-values-kZIH8zYk.mjs";
import { a as getPluginOriginalValue, c as pluginInstanceState, l as pluginInvocationContext, p as setPluginOriginalValue, r as getPluginInstanceOwner, u as resolvePluginInstanceOwner } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { i as isPluginSdkAliasSpecifier, o as preparePluginLoaderAliases } from "./sdk-alias-A9rXLURS.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { l as withPluginRuntimePluginScope, r as getPluginRegistryForContext, s as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as getPluginBunConditions, c as isPluginSourceEntry, n as inspectPluginTypeScriptExecutionFacts, r as resolvePluginPackageMapTarget, t as capturePluginGenerationArtifact } from "./plugin-generation-artifact-CHASLMSu.mjs";
import { l as getActivePluginRegistry, v as requireActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-C1yPL1Zl.mjs";
import { a as mapPluginReturnPromise, o as resolvePluginReturnPromise, r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import "./generation-scope-BNE7YdYW.mjs";
import Module, { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { AsyncResource } from "node:async_hooks";
import { types } from "node:util";
import crypto, { randomUUID } from "node:crypto";
import { isMainThread, workerData } from "node:worker_threads";
//#region src/plugins/plugin-module-loader-recovery.ts
function createRecoverySourceMap(resolve, previous) {
	return (source) => resolve(previous?.(source) ?? source);
}
function createSourceModuleRecovery(facts, recovery, bindInstance) {
	let state = "available";
	return {
		bind(instance) {
			if (state !== "available") throw new Error("Plugin module recovery has already been consumed or released");
			instance.onModuleDispose(recovery.disposeAsync);
			state = "bound";
			bindInstance({
				instance,
				origin: facts.origin,
				source: recovery.resolve(facts.source),
				rootDir: recovery.rootDir,
				devSourceRoot: facts.devSourceRoot,
				standalone: facts.standalone,
				pluginSdkResolution: facts.pluginSdkResolution,
				recoverySourceMap: createRecoverySourceMap(recovery.resolve, facts.recoverySourceMap),
				nativeRecovery: recovery.native
			});
			instance.sourceDigest = facts.sourceDigest;
		},
		dispose() {
			if (state === "available") {
				state = "disposed";
				recovery.dispose();
			}
		}
	};
}
/** Transfers a recovery snapshot to a fresh instance and maps its original entry paths. */
function preparePluginModuleLoaderRecovery(params, artifact, bindInstance) {
	const facts = {
		origin: params.origin,
		source: params.source,
		devSourceRoot: params.devSourceRoot,
		standalone: params.standalone,
		pluginSdkResolution: params.pluginSdkResolution,
		recoverySourceMap: params.recoverySourceMap
	};
	params.instance.bindModuleLoaderRecovery(() => createSourceModuleRecovery({
		...facts,
		sourceDigest: params.instance.sourceDigest
	}, artifact.captureRecoverySource(), bindInstance));
	return (load, hasSource) => {
		const mapSource = params.recoverySourceMap;
		params.instance.bindModuleLoader(mapSource ? (source) => load(mapSource(source)) : load, mapSource && hasSource ? (source) => {
			let mapped;
			try {
				mapped = mapSource(source);
			} catch {
				return false;
			}
			return hasSource(mapped);
		} : hasSource);
	};
}
//#endregion
//#region src/plugins/plugin-native-module-loader.ts
/** Native adapters acquire source through the instance's artifact without replacing evaluation. */
function bindNativePluginInstanceModuleLoader(params, cache, artifact, loader, sdkRoots, prepareEntryNativeScopes) {
	const bun = Reflect.get(globalThis, "Bun");
	const jitiJsx = process.env.JITI_JSX;
	const jsxEnabled = jitiJsx === "1" || jitiJsx === "true";
	const jsxTranspilers = /* @__PURE__ */ new Map();
	const hostSdkTarget = (request, originalParent) => {
		const target = request.startsWith("file:") ? fileURLToPath(request) : request.startsWith(".") && originalParent ? path.resolve(path.dirname(originalParent), request) : request;
		return path.isAbsolute(target) && sdkRoots.some((root) => isPathInside(root, target)) ? target : void 0;
	};
	params.instance.onModuleDispose(registerCapturedPluginModuleResolver({
		...jsxEnabled && bun ? { load(request) {
			if (params.ownsResolution && !params.ownsResolution()) return;
			if (!artifact.sourceForCaptured(request)) return;
			const sourceLoader = path.extname(request).toLowerCase() === ".jsx" ? "jsx" : "tsx";
			let transpiler = jsxTranspilers.get(sourceLoader);
			if (!transpiler) {
				transpiler = new bun.Transpiler({
					loader: sourceLoader,
					tsconfig: { compilerOptions: {
						jsx: "react",
						jsxFactory: "React.createElement",
						jsxFragmentFactory: "React.Fragment"
					} }
				});
				jsxTranspilers.set(sourceLoader, transpiler);
			}
			return {
				contents: transpiler.transformSync(fs.readFileSync(request, "utf8")),
				loader: "js"
			};
		} } : {},
		prepare(request, parent, kind) {
			if (params.ownsResolution && !params.ownsResolution()) return;
			const original = artifact.sourceForCaptured(parent);
			const sdkTarget = hostSdkTarget(request, original);
			if (sdkTarget) return sdkTarget === request ? void 0 : sdkTarget;
			if (!original && !artifact.sourceForCaptured(request)) return;
			const source = original ? parent : request;
			return withPluginCache(cache, () => {
				artifact.prepareModule(source);
				const facts = artifact.moduleFacts(parent);
				if (kind === "import-statement" && facts?.staticImports && !facts.staticImports.has(request)) return;
				if (source === parent && isPluginSdkAliasSpecifier(request)) return resolvePluginNativeAliasForParent(request, parent);
				let target;
				const conditions = [...getPluginBunConditions(kind === "require-call" || kind === "require-resolve")];
				if (source === parent && !path.isAbsolute(request) && !request.startsWith("file:") && !isBuiltin(request) && !(request.startsWith("#") && facts?.isNativeImportPattern(request))) {
					const captured = artifact.captureModule(parent, request, request.startsWith(".") && kind === "require-resolve" && !facts?.isRequireReference(request) ? [
						"node",
						"module-sync",
						"import"
					] : conditions);
					if (captured && "target" in captured) target = captured.target.search || captured.target.hash ? captured.target.href : fileURLToPath(captured.target);
					else if (captured && "retryNative" in captured) try {
						const selected = resolvePluginPackageMapTarget(request, parent, conditions);
						if (selected) {
							const capturedTarget = artifact.captureResolvedModule(fileURLToPath(selected));
							if (capturedTarget) {
								const capturedUrl = pathToFileURL(capturedTarget);
								capturedUrl.search = selected.search;
								capturedUrl.hash = selected.hash;
								target = capturedUrl.search || capturedUrl.hash ? capturedUrl.href : capturedTarget;
							}
						}
					} catch {}
				}
				target ??= source === parent && (path.isAbsolute(request) || request.startsWith("file:")) ? artifact.captureResolvedModule(request.startsWith("file:") ? fileURLToPath(request) : request) : source === request ? request : void 0;
				if (target) artifact.prepareModule(target.startsWith("file:") ? fileURLToPath(target) : target);
				if (original) artifact.prepareNativeScopes(target?.startsWith("file:") ? fileURLToPath(target) : target ?? source);
				return target;
			});
		},
		resolve(request, parent, resolve) {
			if (params.ownsResolution && !params.ownsResolution()) return;
			const original = artifact.sourceForCaptured(parent);
			if (!original || isPluginSdkAliasSpecifier(request) || isBuiltin(request)) return;
			const sdkTarget = hostSdkTarget(request, original);
			if (sdkTarget) return sdkTarget;
			return params.instance.run(() => withPluginCache(cache, () => {
				artifact.prepareModule(parent);
				const packageMap = artifact.prepareNativeModule(parent, request);
				let selected;
				try {
					selected = resolve();
				} catch (error) {
					if (packageMap || !(error instanceof Error) || !("code" in error) || error.code !== "MODULE_NOT_FOUND" && error.code !== "ERR_MODULE_NOT_FOUND") throw error;
				}
				if (selected) {
					if (hostSdkTarget(selected)) return selected;
					const captured = artifact.captureResolvedModule(selected);
					if (captured) {
						artifact.prepareModule(captured);
						artifact.prepareNativeScopes();
					}
					return captured;
				}
				const captured = artifact.captureModule(parent, request, [
					"node",
					"module-sync",
					"require"
				]);
				return captured && "target" in captured ? fileURLToPath(captured.target) : void 0;
			}));
		}
	}));
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: params.origin,
		rootDir: params.rootDir
	});
	params.bindModuleLoader((source) => withPluginCache(cache, () => {
		const captured = artifact.resolve(source, rejectHardlinks);
		artifact.prepareModule(captured);
		if (prepareEntryNativeScopes) artifact.prepareNativeScopes(captured);
		return loader(toSafeImportPath(captured));
	}), artifact.hasSource);
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-resolution.ts
/** Resolves the exact root and entry selected by the plugin runtime loader. */
function clearPluginRuntimeArtifactResolutionMemo() {
	getActivePluginRegistry()?.pluginRuntimeArtifacts.clear();
}
/** Applies both loader selection phases in their runtime order. */
function resolvePluginRuntimeArtifact(params) {
	const rootDir = resolveCanonicalDistRuntimeSource(pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir));
	const memoKey = JSON.stringify([
		params.pluginId,
		rootDir,
		params.entryKind
	]);
	const targetRegistry = params.registry ?? requireActivePluginRegistry();
	const cached = targetRegistry.pluginRuntimeArtifacts.get(memoKey);
	if (cached) return { ...cached };
	const resolved = resolvePluginRuntimeArtifactSelection(params);
	targetRegistry.pluginRuntimeArtifacts.set(memoKey, resolved);
	return { ...resolved };
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-identity.ts
/** Computes a bounded content identity for plugin-owned runtime artifacts. */
const MAX_RUNTIME_ARTIFACT_DEPTH = 64;
const MAX_RUNTIME_ARTIFACT_ENTRIES = 5e4;
const MAX_RUNTIME_ARTIFACT_FILE_BYTES = 268435456;
const MAX_RUNTIME_ARTIFACT_TOTAL_BYTES = 536870912;
const isRuntimeArtifactEntry = (name) => isPluginSourceEntry(name) && name !== ".hg" && name !== ".svn";
function loadPluginRuntimeArtifactIdentitySources(params) {
	const registry = loadPluginRegistrySnapshot(params);
	const metadata = loadPluginMetadataSnapshot({
		...params,
		index: registry
	});
	return registry.plugins.map((record) => ({
		pluginId: record.pluginId,
		origin: record.origin,
		rootDir: record.rootDir,
		source: record.source,
		packageBuild: record.packageBuild,
		sourcePreferred: metadata.byPluginId.get(record.pluginId)?.sourcePreferred
	}));
}
function normalizeRelativePath(filePath) {
	return filePath.split(path.sep).join("/");
}
function listRuntimeArtifactFiles(rootDir) {
	const scan = walkDirectorySync(rootDir, {
		maxDepth: MAX_RUNTIME_ARTIFACT_DEPTH,
		maxEntries: MAX_RUNTIME_ARTIFACT_ENTRIES,
		symlinks: "include",
		descend: (entry) => isRuntimeArtifactEntry(entry.name),
		include: (entry) => entry.kind !== "directory" && isRuntimeArtifactEntry(entry.name)
	});
	if (scan.truncated) throw new Error("plugin runtime artifact exceeds the bounded file scan");
	if ((scan.failedDirs?.length ?? 0) > 0) throw new Error("plugin runtime artifact contains an unreadable directory");
	return scan.entries.map((entry) => {
		if (entry.kind !== "file") throw new Error(`plugin runtime artifact contains unsupported ${entry.kind} entry`);
		return normalizeRelativePath(entry.relativePath);
	}).toSorted();
}
function sameOpenedFile(before, after) {
	return before.dev === after.dev && before.ino === after.ino && before.size === after.size && before.mtimeMs === after.mtimeMs && before.ctimeMs === after.ctimeMs;
}
function hashRuntimeArtifactFile(params) {
	const absolutePath = path.join(params.rootDir, params.relativePath);
	const opened = openRootFileSync({
		absolutePath,
		rootPath: params.rootDir,
		rootRealPath: params.rootRealPath,
		boundaryLabel: "plugin runtime artifact",
		maxBytes: MAX_RUNTIME_ARTIFACT_FILE_BYTES,
		rejectHardlinks: false
	});
	if (!opened.ok) throw new Error(`plugin runtime artifact file is not readable: ${params.relativePath}`);
	const changedMessage = `plugin runtime artifact file changed while reading: ${params.relativePath}`;
	try {
		const hashed = hashFileDescriptorSync(opened.fd, opened.stat.size);
		const after = fs.fstatSync(opened.fd);
		if (hashed.sizeBytes !== opened.stat.size || !sameOpenedFile(opened.stat, after)) throw new Error(changedMessage);
		return {
			hash: hashed.sha256,
			size: opened.stat.size,
			mode: opened.stat.mode
		};
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "too-large") throw new Error(changedMessage, { cause: error });
		throw error;
	} finally {
		fs.closeSync(opened.fd);
	}
}
/**
* Hashes plugin-owned files only. Dependency stores and VCS metadata are
* separate runtime owners; plugin installs/updates must replace this digest.
*/
function fingerprintPluginRuntimeArtifact(record) {
	const runtimeArtifact = record.source ? resolvePluginRuntimeArtifact({
		pluginId: record.pluginId,
		entryKind: "runtime",
		source: record.source,
		rootDir: record.rootDir,
		origin: record.origin,
		preferBuiltPluginArtifacts: prefersBuiltPluginArtifacts(resolvePluginRuntimeArtifactPreference(getPluginRuntimeLoadContextState(getPluginRegistryForContext() ?? void 0)?.preferBuiltPluginArtifacts), record.origin),
		sourcePreferred: record.sourcePreferred,
		...record.packageBuild ? { packageManifest: { build: record.packageBuild } } : {}
	}) : {
		rootDir: record.rootDir,
		source: void 0
	};
	const rootDir = path.resolve(runtimeArtifact.rootDir);
	const rootRealPath = safeRealpathSync(rootDir);
	if (!rootRealPath) throw new Error(`plugin runtime root is unavailable: ${record.pluginId}`);
	const source = runtimeArtifact.source ? path.isAbsolute(runtimeArtifact.source) ? runtimeArtifact.source : path.resolve(rootRealPath, runtimeArtifact.source) : null;
	const sourceRelativePath = source ? path.relative(rootRealPath, safeRealpathSync(source) ?? source) : null;
	if (sourceRelativePath !== null && (sourceRelativePath === ".." || sourceRelativePath.startsWith(`..${path.sep}`) || path.isAbsolute(sourceRelativePath))) throw new Error(`plugin runtime entry escapes its root: ${record.pluginId}`);
	const beforeFiles = listRuntimeArtifactFiles(rootRealPath);
	if (sourceRelativePath !== null && !beforeFiles.includes(normalizeRelativePath(sourceRelativePath))) throw new Error(`plugin runtime entry is unavailable: ${record.pluginId}`);
	const hash = crypto.createHash("sha256");
	hash.update("openclaw-plugin-runtime-artifact-v1\0");
	hash.update(sourceRelativePath ? normalizeRelativePath(sourceRelativePath) : "<no-source>");
	hash.update("\0");
	let totalBytes = 0;
	for (const relativePath of beforeFiles) {
		const file = hashRuntimeArtifactFile({
			rootDir: rootRealPath,
			rootRealPath,
			relativePath
		});
		totalBytes += file.size;
		if (totalBytes > MAX_RUNTIME_ARTIFACT_TOTAL_BYTES) throw new Error("plugin runtime artifact exceeds the bounded content scan");
		hash.update(relativePath);
		hash.update("\0");
		hash.update(String(file.mode));
		hash.update("\0");
		hash.update(String(file.size));
		hash.update("\0");
		hash.update(file.hash);
		hash.update("\0");
	}
	const afterFiles = listRuntimeArtifactFiles(rootRealPath);
	if (beforeFiles.length !== afterFiles.length || beforeFiles.some((file, i) => file !== afterFiles[i])) throw new Error("plugin runtime artifact changed while reading");
	return hash.digest("hex");
}
//#endregion
//#region src/plugins/plugin-shared-module-loader.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sharedPluginModuleIdentity"), () => ({
	sources: /* @__PURE__ */ new WeakMap(),
	warnings: /* @__PURE__ */ new WeakMap()
}));
const log$1 = createSubsystemLogger("plugins");
/** Canonical exports retain file identity across Jiti wrappers and registry replacements. */
function bindSharedPluginModuleLoader(params) {
	const { instance, cache, loader } = params;
	const root = safeRealpathSync(params.rootDir) ?? path.resolve(params.rootDir);
	let currentIdentity;
	try {
		currentIdentity = fingerprintPluginRuntimeArtifact({
			pluginId: instance.pluginId,
			origin: "bundled",
			rootDir: root
		});
	} catch (error) {
		log$1.warn(`Bundled plugin ${instance.pluginId} identity unavailable: ${formatErrorMessage(error)}`);
	}
	createSharedModuleBinding(cache, loader, root, currentIdentity)(instance);
}
function createSharedModuleBinding(cache, loader, root, currentIdentity) {
	const load = (source) => withPluginCache(cache, () => loader(toSafeImportPath(source)));
	const bind = (target) => {
		target.bindModuleLoader((source) => {
			const value = load(source);
			if ((typeof value !== "object" || value === null) && typeof value !== "function") return value;
			const exported = Reflect.get(value, "default");
			const identity = exported && (typeof exported === "object" || typeof exported === "function") ? exported : value;
			const identities = state.sources.get(identity) ?? /* @__PURE__ */ new Map();
			state.sources.set(identity, identities);
			if (!identities.has(root)) identities.set(root, currentIdentity);
			else {
				const loadedIdentity = identities.get(root);
				if (!loadedIdentity || !currentIdentity || loadedIdentity !== currentIdentity) state.warnings.set(target, !loadedIdentity || !currentIdentity ? "Bundled plugin code remains loaded and its files could not be verified. Restart the Gateway to load edited code." : "Bundled plugin code remains loaded. Restart the Gateway to load edited code.");
			}
			return value;
		});
		target.bindModuleLoaderRecovery(captureRecovery);
	};
	const captureRecovery = () => {
		let released = false;
		return {
			bind(target) {
				if (released) throw new Error("Plugin module recovery has already been consumed or released");
				released = true;
				bind(target);
			},
			dispose() {
				released = true;
			}
		};
	};
	return bind;
}
function getSharedPluginCodeReloadWarning(instance) {
	return state.warnings.get(instance);
}
//#endregion
//#region src/plugins/plugin-source-build.ts
const require = createRequire(import.meta.url);
const PLUGIN_SOURCE_RESOLVE_PREFIX = "openclaw-plugin-source-resolve:";
/** Compile captured source into a private namespace; native files stay with their capture owner. */
function buildPluginTypeScriptSource(root) {
	if (!useNodeModuleHooks()) throw new Error("Plugin source builds require Node module hooks");
	const directory = fs.mkdtempSync(path.join(path.dirname(root), ".source-"));
	const outputs = /* @__PURE__ */ new Map();
	const formats = /* @__PURE__ */ new Map();
	const failures = /* @__PURE__ */ new Map();
	const helpers = /* @__PURE__ */ new Map();
	const sources = /* @__PURE__ */ new Map();
	const included = /* @__PURE__ */ new Set();
	let disposed = false;
	const { jsx, transform } = createJiti(root, {
		fsCache: false,
		moduleCache: false,
		tsconfigPaths: false
	}).options;
	if (!transform) throw new Error("Jiti source transformer is unavailable");
	const include = (source) => {
		if (!isPathInside(root, source) || included.has(source)) return;
		included.add(source);
		if (path.relative(root, source).split(path.sep).includes("node_modules")) return;
		if (fs.lstatSync(source).isDirectory()) for (const name of fs.readdirSync(source).toSorted()) include(path.join(source, name));
		else if ((/\.[cm]?tsx?$/.test(source) || jsx && source.endsWith(".jsx")) && !/\.d\.[cm]?ts$/.test(source)) {
			const emitted = path.join(directory, `module-${outputs.size}.js`);
			outputs.set(source, emitted);
			sources.set(emitted, { source });
			fs.writeFileSync(emitted, "", {
				flag: "wx",
				mode: 384
			});
		}
	};
	const dispose = () => {
		disposed = true;
		fs.rmSync(directory, {
			recursive: true,
			force: true
		});
	};
	try {
		for (const name of fs.readdirSync(root).toSorted()) include(path.join(root, name));
		const compile = (input, destination, format) => {
			const { parse, parseExpression } = require("@babel/parser");
			const { default: traverse } = require("@babel/traverse");
			const { default: generate } = require("@babel/generator");
			const { transformSync } = require("esbuild");
			const sourceText = fs.readFileSync(input, "utf8");
			const mode = sources.get(destination)?.mode;
			const transformOptions = {
				sourcefile: input,
				loader: input.endsWith(".jsx") ? "jsx" : input.endsWith("x") ? "tsx" : "ts",
				target: "es2022",
				supported: { "import-attributes": true },
				platform: "node",
				jsx: jsx ? "transform" : "preserve",
				tsconfigRaw: { compilerOptions: {
					experimentalDecorators: true,
					useDefineForClassFields: true
				} }
			};
			const analysis = transformSync(sourceText, {
				...transformOptions,
				sourcefile: path.relative(root, input)
			}).code;
			let parsed;
			try {
				parsed = parse(analysis, {
					sourceFilename: input,
					sourceType: "unambiguous",
					allowAwaitOutsideFunction: true,
					allowReturnOutsideFunction: true,
					plugins: input.endsWith("x") ? ["jsx"] : []
				});
			} catch (error) {
				if (error instanceof SyntaxError) throw new SyntaxError(`${path.relative(root, input)}: ${error.message}`, { cause: error });
				throw error;
			}
			let usesCommonJs = false;
			let needsHelper = false;
			let explicitInterop = false;
			let wildcardExports = false;
			let loader = "";
			let factory = "";
			let namespace = "";
			const globals = [];
			traverse(parsed, {
				Program(program) {
					loader = program.scope.generateUidIdentifier("pluginRequire").name;
					factory = program.scope.generateUidIdentifier("createPluginRequire").name;
					namespace = program.scope.generateUidIdentifier("pluginNamespace").name;
				},
				ReferencedIdentifier(reference) {
					if (!reference.isIdentifier()) return;
					const name = reference.node.name;
					if (reference.scope.getBinding(name)) return;
					if (name === "module" || name === "exports") usesCommonJs = true;
					if ([
						"require",
						"__filename",
						"__dirname"
					].includes(name)) {
						globals.push(reference);
						needsHelper ||= name === "require";
					}
				},
				ImportDeclaration() {
					needsHelper = true;
				},
				ExportNamedDeclaration(declaration) {
					needsHelper ||= Boolean(declaration.node.source);
					explicitInterop ||= declaration.node.specifiers.some((specifier) => specifier.exported.type === "StringLiteral" ? specifier.exported.value === "module.exports" : specifier.exported.name === "module.exports");
				},
				ExportAllDeclaration() {
					needsHelper = true;
					wildcardExports = true;
				},
				ImportExpression() {
					needsHelper = true;
				},
				MemberExpression(member) {
					needsHelper ||= member.node.object.type === "MetaProperty" && member.node.object.meta.name === "import" && member.node.property.type === "Identifier" && member.node.property.name === "resolve";
				}
			});
			const native = mode === "native";
			const esm = native && (format === "module" || format === "module-typescript") || !(native && (format === "commonjs" || format === "commonjs-typescript")) && mode !== "sync" && (/\.mtsx?$/.test(input) || !/\.ctsx?$/.test(input) && parsed.program.sourceType === "module" && !usesCommonJs);
			formats.set(destination, esm ? "module" : "commonjs");
			const createImportHelper = () => {
				const helper = path.join(path.dirname(destination), `.import-meta-${randomUUID()}.mjs`);
				fs.writeFileSync(helper, `import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
const modules = createRequire(import.meta.url).cache;
export const bindRequire = (nativeRequire) => {
  // Only resolution can retry; evaluation below always runs once through Node.
  const select = (specifier, options) => {
    try {
      return { target: specifier, resolved: nativeRequire.resolve(specifier, options) };
    } catch (error) {
      if (!["MODULE_NOT_FOUND", "ERR_MODULE_NOT_FOUND", "ERR_PACKAGE_PATH_NOT_EXPORTED", "ERR_PACKAGE_IMPORT_NOT_DEFINED"].includes(error?.code)) throw error;
      const url = import.meta.resolve(specifier);
      const resolved = url.startsWith("file:") ? fileURLToPath(url) : url;
      return { target: resolved, resolved };
    }
  };
  const require = (specifier) => {
    const selected = select(specifier);
    const cached = modules[pathToFileURL(selected.resolved).href];
    return cached ? cached.exports : nativeRequire(selected.target);
  };
  const resolve = (specifier, options) => select(specifier, options).resolved;
  return Object.assign(require, nativeRequire, { resolve: Object.assign(resolve, nativeRequire.resolve) });
};
export const importModule = async (specifier) => {
  const resolved = import.meta.resolve(specifier);
  const cached = modules[resolved];
  const imported = cached
    ? { "openclaw:async-commonjs": await cached.exports }
    : await import(specifier);
  if (new URL(resolved).pathname.endsWith(".json")) return imported.default;
  const namespace = Object.hasOwn(imported, "openclaw:async-commonjs")
    ? imported["openclaw:async-commonjs"] : imported;
  if (namespace === null || (typeof namespace !== "object" && typeof namespace !== "function")) return namespace;
  const fallback = namespace.default;
  const delegate = (typeof fallback === "object" || typeof fallback === "function") && !(fallback instanceof Promise);
  const values = new Map();
  return new Proxy(namespace, {
    get(target, key) {
      if (values.has(key)) return values.get(key);
      let value;
      if (key === "__esModule") value = true;
      else if (key === "default") {
        value = fallback == null ? namespace
          : typeof fallback?.default === "function" && namespace.__esModule ? fallback.default : fallback;
      } else if (key in target) value = target[key];
      else if (delegate) {
        value = fallback[key];
        if (typeof value === "function") value = value.bind(fallback);
      }
      values.set(key, value);
      return value;
    },
  });
};
export const resolve = (specifier, options) => {
  if (options === undefined) return import.meta.resolve(specifier);
  const query = ${JSON.stringify(PLUGIN_SOURCE_RESOLVE_PREFIX)} + encodeURIComponent(JSON.stringify([specifier, options]));
  return JSON.parse(decodeURIComponent(import.meta.resolve(query).slice("data:application/json,".length))).value;
};
`, {
					flag: "wx",
					mode: 384
				});
				helpers.set(helper, {
					source: input,
					generated: true,
					mode: "async"
				});
				return helper;
			};
			if (mode === "sync" || mode === "async") {
				const asynchronous = mode === "async";
				const result = transform({
					source: sourceText,
					filename: input,
					ts: /\.[cm]?tsx?$/.test(input),
					jsx,
					async: asynchronous,
					interopDefault: true
				});
				const error = result.error;
				if (error) throw new SyntaxError((error instanceof Error ? error.message : stringifyNonErrorCause(error)).replaceAll(input, path.relative(root, input)));
				const helper = asynchronous || needsHelper ? createImportHelper() : void 0;
				const output = parse(result.code, {
					sourceType: "script",
					allowAwaitOutsideFunction: true,
					allowReturnOutsideFunction: true
				});
				const header = parse(`__filename = ${JSON.stringify(input)}; __dirname = ${JSON.stringify(path.dirname(input))};
          ${helper ? `require = require(${JSON.stringify(helper)}).bindRequire(require("node:module").createRequire(${JSON.stringify(pathToFileURL(input).href)}));
          const { importModule: jitiImport, resolve: jitiESMResolve } = require(${JSON.stringify(helper)});
          ${asynchronous ? "module.require = require;" : ""}` : ""}`);
				output.program.body.unshift(...header.program.body);
				const code = generate(output).code;
				const emitted = asynchronous ? `import Module, { createRequire } from "node:module";
const owner = new Module(${JSON.stringify(input)});
owner.filename = ${JSON.stringify(input)};
owner.paths = Module._nodeModulePaths(${JSON.stringify(path.dirname(input))});
const require = createRequire(import.meta.url);
// Publish partial exports before awaiting dependencies; URL keys preserve import query identity.
require.cache[import.meta.url] = owner;
let value;
try {
  await (async function(exports, require, module, __filename, __dirname) {
${code}
  })(owner.exports, require, owner);
  value = await owner.exports;
  owner.loaded = true;
} catch (error) {
  delete require.cache[import.meta.url];
  throw error;
}
export { value as "openclaw:async-commonjs" };` : code;
				if (asynchronous) formats.set(destination, "module");
				fs.writeFileSync(destination, emitted, { mode: 384 });
				return;
			}
			let needsRequire = false;
			for (const reference of globals) {
				const name = reference.node.name;
				if (name === "require" && !esm) continue;
				const replacement = name === "require" ? parseExpression(loader) : parseExpression(JSON.stringify(name === "__filename" ? input : path.dirname(input)));
				needsRequire ||= name === "require";
				if (reference.parentPath.isObjectProperty() && reference.key === "value") reference.parentPath.node.shorthand = false;
				reference.replaceWith(replacement);
			}
			if (esm) {
				const header = parse(`
          ${needsRequire ? `import { createRequire as ${factory} } from "node:module";
          const ${loader} = ${factory}(${JSON.stringify(pathToFileURL(input).href)});` : ""}
          import.meta.url = ${JSON.stringify(pathToFileURL(input).href)};
          import.meta.filename = ${JSON.stringify(input)};
          import.meta.dirname = ${JSON.stringify(path.dirname(input))};`, { sourceType: "module" });
				parsed.program.body.unshift(...header.program.body);
				if (wildcardExports && !explicitInterop) parsed.program.body.push(...parse(`import * as ${namespace} from ${JSON.stringify(pathToFileURL(destination).href)};
            export { ${namespace} as "module.exports" };`, { sourceType: "module" }).program.body);
			}
			const emitted = transformSync(generate(parsed).code, {
				...transformOptions,
				format: esm ? "esm" : "cjs"
			});
			fs.writeFileSync(destination, emitted.code, { mode: 384 });
		};
		const hooks = Module.registerHooks({ load(url, context, nextLoad) {
			const filename = url.startsWith("file:") ? fileURLToPath(url) : void 0;
			if (filename) {
				const entry = sources.get(filename);
				if (entry && !formats.has(filename) && !failures.has(filename)) try {
					if (entry.mode && entry.mode !== "native") entry.mode = context.conditions.includes("require") ? "sync" : "async";
					compile(entry.source, filename, entry.nativeFormat ?? context.format);
				} catch (error) {
					failures.set(filename, error);
				}
			}
			if (filename && failures.has(filename)) throw failures.get(filename);
			const format = filename && formats.get(filename);
			return nextLoad(url, format ? {
				...context,
				format
			} : context);
		} });
		return {
			directory,
			include: (additions) => {
				if (disposed) throw new Error("Plugin source view has been disposed");
				additions.forEach(include);
			},
			resolve: (source, mode, nativeFormat) => {
				const filename = outputs.get(source);
				const entry = filename && sources.get(filename);
				if (entry && !formats.has(filename)) {
					entry.mode = mode ?? entry.mode ?? "native";
					entry.nativeFormat = nativeFormat ?? entry.nativeFormat;
				}
				return filename ?? source;
			},
			sourceForOutput: (file) => sources.get(outputs.get(file) ?? file) ?? helpers.get(file),
			dispose: () => {
				hooks.deregister();
				dispose();
			}
		};
	} catch (error) {
		dispose();
		throw error;
	}
}
//#endregion
//#region src/plugins/plugin-instance-module-loader.ts
const retainedNativeEsmModules = resolveGlobalMap(Symbol.for("openclaw.retainedNativeEsmPluginModules"));
function retainedNativeEsmFor(params) {
	if (params.nativeRecovery || params.recoverySourceMap || isMainThread || workerData === null || typeof workerData !== "object" || !("sourceCaptureDirectory" in workerData)) return;
	const extension = path.extname(params.source).toLowerCase();
	if (extension !== ".mjs" && (extension !== ".js" || !isNativeEsmPackage(params.source))) return;
	const owner = getPluginInstanceOwner(params.instance);
	const workspace = getPluginRuntimeLoadContextState(owner?.registry)?.workspaceDir;
	const key = `${fs.realpathSync(params.source)}\0${workspace ?? ""}`;
	let retained = retainedNativeEsmModules.get(key);
	if (!retained) {
		retained = {
			builds: /* @__PURE__ */ new Map(),
			modules: /* @__PURE__ */ new Map(),
			loaded: false,
			owners: /* @__PURE__ */ new Set(),
			knownOwners: /* @__PURE__ */ new WeakSet()
		};
		retainedNativeEsmModules.set(key, retained);
	}
	return retained;
}
function isNativeEsmPackage(source) {
	let directory = path.dirname(source);
	while (true) {
		const manifest = path.join(directory, "package.json");
		if (fs.existsSync(manifest)) try {
			const parsed = JSON.parse(fs.readFileSync(manifest, "utf8"));
			return typeof parsed === "object" && parsed !== null && Object.getOwnPropertyDescriptor(parsed, "type")?.value === "module";
		} catch {
			return false;
		}
		const parent = path.dirname(directory);
		if (parent === directory) return false;
		directory = parent;
	}
}
function retainedNativeEsmOwner(retained) {
	const requested = pluginInstanceInvocation.getStore()?.instance;
	if (requested && retained.owners.has(requested)) return requested;
	if (!requested && retained.owners.size === 1) return retained.owners.values().next().value;
	throw new Error("Plugin native ESM capture has no live workspace owner for this load");
}
function createSourceOutputLookup(builds) {
	const sourceForOutput = (filename) => {
		for (const build of builds.values()) {
			const source = build.sourceForOutput(filename);
			if (source) return source;
		}
		return { source: filename };
	};
	return {
		sourceForOutput,
		moduleSource: (filename) => {
			const entry = sourceForOutput(filename);
			return entry.generated ? filename : entry.source;
		}
	};
}
function ownsNativeEsmResolution(retained, instance) {
	const requested = pluginInstanceInvocation.getStore()?.instance;
	if (!requested) return true;
	if (!retained.knownOwners.has(requested)) return false;
	if (!retained.owners.has(requested)) throw new Error("Plugin native ESM capture has no live workspace owner for this load");
	return requested === instance;
}
function retainedNativeEsmExecution(retained) {
	return (run) => retainedNativeEsmOwner(retained).run(run);
}
/** Runtime and setup share code identity policy while keeping separate instance authority. */
function bindPluginInstanceModuleLoader(params) {
	const cache = getPluginCache();
	if (params.origin === "bundled") {
		if (params.expectedSourceDigest !== void 0) throw new Error("Source digest validation is not applicable to core-bundled runtime modules");
		let loader;
		if (params.createHostModuleLoader) loader = params.createHostModuleLoader();
		else {
			installOpenClawPluginSdkNativeResolver({
				moduleUrl: import.meta.url,
				pluginModulePath: params.source,
				devSourceRoot: params.devSourceRoot,
				pluginSdkResolution: params.pluginSdkResolution
			});
			loader = getCachedPluginModuleLoader({
				modulePath: params.source,
				importerUrl: import.meta.url,
				devSourceRoot: params.devSourceRoot,
				pluginSdkResolution: params.pluginSdkResolution
			});
		}
		bindSharedPluginModuleLoader({
			instance: params.instance,
			rootDir: params.rootDir,
			cache,
			loader
		});
		return;
	}
	const retained = retainedNativeEsmFor(params);
	const sourceBuilds = retained?.builds ?? /* @__PURE__ */ new Map();
	const { sourceForOutput, moduleSource } = createSourceOutputLookup(sourceBuilds);
	retained?.owners.add(params.instance);
	retained?.knownOwners.add(params.instance);
	const reusedArtifact = retained?.artifact;
	let artifact;
	try {
		artifact = reusedArtifact ?? capturePluginGenerationArtifact(params.rootDir, params.standalone ? params.source : void 0, retained ? retainedNativeEsmExecution(retained) : (run) => params.instance.run(run), moduleSource, params.nativeRecovery);
		if (params.expectedSourceDigest !== void 0 && artifact.sourceDigest !== params.expectedSourceDigest) {
			if (!reusedArtifact) artifact.dispose();
			throw new Error(`Plugin ${params.instance.pluginId} source changed after installation; inspect it before reloading.`);
		}
	} catch (error) {
		retained?.owners.delete(params.instance);
		throw error;
	}
	if (retained) retained.artifact = artifact;
	bindPluginCacheRoot(params.rootDir, artifact.sourceRoot);
	params.instance.sourceDigest = artifact.sourceDigest;
	params.instance.onModuleDispose(() => {
		retained?.owners.delete(params.instance);
		if (retained) {
			if (retained.loaded || retained.owners.size > 0) return;
			retained.artifact = void 0;
			retained.modules.clear();
		}
		for (const build of sourceBuilds.values()) build.dispose();
		sourceBuilds.clear();
		return artifact.disposeAsync();
	});
	const bindRecoveredModuleLoader = preparePluginModuleLoaderRecovery(params, artifact, bindPluginInstanceModuleLoader);
	const capturedEntry = retained && artifact.resolve(params.source);
	const bindModuleLoader = (load, hasSource) => bindRecoveredModuleLoader(retained ? (source) => {
		const captured = artifact.resolve(source);
		if (retained.modules.has(captured)) return retained.modules.get(captured);
		const value = load(source);
		retained.modules.set(captured, value);
		retained.loaded ||= captured === capturedEntry;
		return value;
	} : load, hasSource);
	const aliases = preparePluginLoaderAliases({
		modulePath: params.source,
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		pluginSdkResolution: params.pluginSdkResolution,
		devSourceRoot: params.devSourceRoot
	});
	if (aliases.packageRoot && !reusedArtifact) artifact.linkHost(aliases.packageRoot);
	installOpenClawPluginSdkNativeResolver({
		moduleUrl: import.meta.url,
		pluginModulePath: params.source,
		devSourceRoot: params.devSourceRoot,
		allowedParentRoots: [artifact.boundaryRoot],
		pluginSdkResolution: params.pluginSdkResolution
	});
	if (!useNodeModuleHooks()) {
		const capturedSource = artifact.resolve(params.source);
		artifact.prepareModule(capturedSource);
		const bunSourceFacts = process.versions.bun && isPluginSourceModulePath(params.source) ? inspectPluginTypeScriptExecutionFacts(params.source, fs.readFileSync(params.source, "utf8"), createJiti(params.source, {
			fsCache: false,
			moduleCache: false,
			tryNative: false
		})) : void 0;
		for (const { specifier } of bunSourceFacts?.staticImports ?? []) if (path.isAbsolute(specifier) || specifier.startsWith("file:")) artifact.captureModule(capturedSource, specifier, [
			"node",
			"module-sync",
			"import"
		]);
		const bunNeedsNativeSource = Boolean(process.versions.bun) && supportsBunRuntimeOnResolveTargets() && (bunSourceFacts?.hasComputedImport === true || bunSourceFacts?.staticImports.some(({ specifier, sideEffect }) => sideEffect && /\.cjs(?:[?#].*)?$/u.test(specifier)) === true);
		const tryNative = process.env.JITI_JSX === "1" || process.env.JITI_JSX === "true" ? false : process.versions.bun && artifact.boundaryRoot.includes("\\") || bunNeedsNativeSource ? true : void 0;
		const effectiveTryNative = tryNative ?? resolvePluginLoaderTryNative(params.source);
		const loader = getCachedPluginModuleLoader({
			modulePath: params.source,
			importerUrl: import.meta.url,
			devSourceRoot: params.devSourceRoot,
			pluginSdkResolution: params.pluginSdkResolution,
			tryNative,
			aliasMap: {
				...aliases.getAliasMap(),
				...artifact.sourceAliases
			}
		});
		bindNativePluginInstanceModuleLoader({
			...params,
			bindModuleLoader,
			ownsResolution: retained ? () => ownsNativeEsmResolution(retained, params.instance) : void 0
		}, cache, artifact, loader, aliases.sdkRoots, !effectiveTryNative);
		return;
	}
	const nativeRequire = createRequire(params.source);
	const createPaths = (source, options) => ({
		resolver: createJiti(source, {
			...options,
			fsCache: false,
			moduleCache: false,
			alias: artifact.sourceAliases
		}),
		targets: /* @__PURE__ */ new Map()
	});
	const entryPaths = createPaths(params.source);
	const pathResolvers = /* @__PURE__ */ new Map([[artifact.resolve(params.source), entryPaths]]);
	const tsconfigPaths = entryPaths.resolver.options.tsconfigPaths;
	const demandedModules = /* @__PURE__ */ new Map();
	let resolvingPaths = false;
	const includeSources = (additions) => {
		for (const build of sourceBuilds.values()) build.include(additions);
	};
	const prepareSource = (filename, mode, nativeFormat) => {
		const root = artifact.moduleRoot(filename);
		if (!root) return filename;
		return params.instance.run(() => {
			let build = sourceBuilds.get(root);
			if (!build) {
				build = buildPluginTypeScriptSource(root);
				sourceBuilds.set(root, build);
			}
			return build.resolve(filename, mode, nativeFormat);
		});
	};
	const hooks = Module.registerHooks({ resolve(specifier, context, nextResolve) {
		if (retained && !ownsNativeEsmResolution(retained, params.instance)) return nextResolve(specifier, context);
		const parent = context.parentURL;
		const parentEntry = parent?.startsWith("file:") ? sourceForOutput(fileURLToPath(parent)) : void 0;
		const parentSource = parentEntry?.source;
		const parentRoot = parentSource && artifact.moduleRoot(parentSource);
		const resolverSource = parentEntry?.generated && parentSource && artifact.sourceForCaptured(parentSource);
		if (resolverSource && parentSource && parentRoot && specifier.startsWith("openclaw-plugin-source-resolve:")) return params.instance.run(() => {
			const requestJson = decodeURIComponent(specifier.slice(31));
			const [request, options] = JSON.parse(requestJson);
			const query = typeof options === "string" ? { parentURL: options } : options;
			includeSources(artifact.prepareDependency(parentSource, request));
			let paths = pathResolvers.get(parentSource);
			if (!paths) {
				paths = createPaths(resolverSource, entryPaths.resolver.options);
				pathResolvers.set(parentSource, paths);
			}
			const value = paths.resolver.esmResolve(request, {
				parentURL: pathToFileURL(parentSource),
				...query
			});
			return {
				shortCircuit: true,
				url: "data:application/json," + encodeURIComponent(JSON.stringify({ value }))
			};
		});
		const nativeContext = parentSource && parentRoot ? {
			...context,
			parentURL: pathToFileURL(parentSource).href
		} : context;
		const sourceMode = !parentRoot ? void 0 : parentEntry?.mode && parentEntry.mode !== "native" ? context.conditions.includes("require") ? "sync" : "async" : "native";
		let resolved = parentSource && parentRoot ? params.instance.run(() => withPluginCache(cache, () => {
			if (tsconfigPaths && !resolvingPaths && !isBuiltin(specifier) && !isPluginSdkAliasSpecifier(specifier) && !specifier.startsWith(".") && !specifier.startsWith("file:") && !path.isAbsolute(specifier)) {
				let paths = pathResolvers.get(parentSource);
				if (!paths) {
					const original = artifact.sourceForCaptured(parentSource);
					if (!original) return nextResolve(specifier, nativeContext);
					paths = createPaths(original, entryPaths.resolver.options);
					pathResolvers.set(parentSource, paths);
				}
				const key = JSON.stringify([specifier, context.conditions]);
				if (!paths.targets.has(key)) {
					resolvingPaths = true;
					try {
						paths.targets.set(key, paths.resolver.esmResolve(specifier, {
							parentURL: pathToFileURL(parentSource),
							conditions: [...context.conditions],
							try: true
						}));
					} finally {
						resolvingPaths = false;
					}
				}
				const target = paths.targets.get(key);
				if (target?.startsWith("file:")) {
					const filename = fileURLToPath(target);
					const captured = artifact.hasSource(filename) ? artifact.resolve(filename) : filename;
					if (artifact.sourceForCaptured(captured)) return {
						shortCircuit: true,
						url: pathToFileURL(captured).href
					};
				}
			}
			const key = JSON.stringify([
				parentSource,
				specifier,
				context.conditions
			]);
			const demanded = demandedModules.get(key);
			if (demanded) {
				if ("error" in demanded) throw demanded.error;
				return {
					shortCircuit: true,
					url: demanded.url
				};
			}
			includeSources(artifact.prepareDependency(parentSource, specifier));
			let resolutionFailure;
			try {
				const native = nextResolve(specifier, nativeContext);
				if (!(specifier.startsWith("file:") || path.isAbsolute(specifier)) || !native.url.startsWith("file:") || artifact.moduleRoot(sourceForOutput(fileURLToPath(native.url)).source) || aliases.sdkRoots.some((root) => isPathInside(root, fileURLToPath(native.url)))) return native;
				resolutionFailure = /* @__PURE__ */ new Error(`Plugin module ${specifier} was not captured`);
			} catch (error) {
				if (isBuiltin(specifier) || isPluginSdkAliasSpecifier(specifier) || !(error instanceof Error) || !("code" in error) || error.code !== "MODULE_NOT_FOUND" && error.code !== "ERR_MODULE_NOT_FOUND") throw error;
				resolutionFailure = error;
			}
			try {
				const captured = artifact.captureModule(parentSource, specifier, context.conditions);
				if (!captured) throw resolutionFailure;
				includeSources(captured.additions);
				if ("retryNative" in captured) {
					const native = nextResolve(specifier, nativeContext);
					demandedModules.set(key, { url: native.url });
					return native;
				}
				const filename = fileURLToPath(captured.target);
				const target = (isPluginSourceModulePath(filename) || filename.endsWith(".jsx")) && artifact.moduleRoot(filename) ? prepareSource(filename, sourceMode, sourceMode === "native" ? nextResolve(context.conditions.includes("require") ? filename : pathToFileURL(filename).href, nativeContext).format : void 0) : filename;
				captured.target.pathname = pathToFileURL(target).pathname;
				const url = captured.target.href;
				demandedModules.set(key, { url });
				return {
					shortCircuit: true,
					url
				};
			} catch (captureError) {
				demandedModules.set(key, { error: captureError });
				throw captureError;
			}
		})) : nextResolve(specifier, nativeContext);
		if (resolved.url.startsWith("file:")) {
			const resolvedFilename = fileURLToPath(resolved.url);
			const entry = sourceForOutput(resolvedFilename);
			const filename = entry.generated ? resolvedFilename : entry.source;
			const attributes = resolved.importAttributes ?? context.importAttributes;
			if (filename.endsWith(".json") && parentRoot && parentEntry?.mode && (resolved.format === void 0 || resolved.format === "json") && attributes && !Object.hasOwn(attributes, "type")) resolved = {
				...resolved,
				importAttributes: {
					...attributes,
					type: "json"
				}
			};
			artifact.assertModuleAvailable(filename);
			const additions = artifact.prepareModule(filename);
			includeSources(additions);
			if ((isPluginSourceModulePath(filename) || filename.endsWith(".jsx")) && artifact.moduleRoot(filename)) {
				const url = new URL(resolved.url);
				url.pathname = pathToFileURL(prepareSource(filename, sourceMode, resolved.format)).pathname;
				return {
					...resolved,
					url: url.href
				};
			}
		}
		return resolved;
	} });
	params.instance.onModuleDispose(() => hooks.deregister());
	const results = /* @__PURE__ */ new Map();
	bindModuleLoader((source) => withPluginCache(cache, () => {
		const captured = artifact.resolve(source);
		let result = results.get(captured);
		if (!result) {
			try {
				const target = isPluginSourceModulePath(captured) || captured.endsWith(".jsx") ? prepareSource(captured, "sync") : captured;
				result = { value: nativeRequire(target) };
			} catch (error) {
				result = { error };
			}
			results.set(captured, result);
		}
		if ("error" in result) throw result.error;
		return result.value;
	}), artifact.hasSource);
}
//#endregion
//#region src/plugins/plugin-instance-background.ts
/** Capture host bindings without retaining registration's request or registry generation. */
function createPluginBackgroundRunner(instance, isCleanup) {
	const spawnBroker = getSpawnBroker();
	const runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
	const resourceHost = withPluginRuntimeGatewayContextResolver(void 0, getBoundLegacyPluginSdkResourceHost, { inheritRequestScope: false });
	return (run) => {
		const current = pluginInstanceInvocation.getStore();
		const cleanup = current?.instance === instance && instance.hasActiveCall && isCleanup(current.token) ? {
			instance,
			token: current.token
		} : void 0;
		const registry = instance.owner?.registry;
		const runtime = registry && getPluginRegistryRuntime(registry);
		const resolver = runtime && getGatewayContextResolver(runtime);
		return runInDetachedAsyncContext(() => runWithSpawnBroker(spawnBroker, () => runWithReadOnlyWorkers(() => withPluginRuntimeGatewayContextResolver(resolver, () => {
			const invoke = () => cleanup ? pluginInstanceInvocation.run(cleanup, () => instance.run(run)) : instance.runInRegistry(registry, run, { joinDisposal: false });
			return !resolver && resourceHost ? resourceHost.run(invoke) : invoke();
		}))));
	};
}
//#endregion
//#region src/plugins/plugin-instance-argument-views.ts
var CallbackView = class extends PluginHostObject {
	#factory;
	constructor(value, factory) {
		super(value);
		this.#factory = factory;
	}
	static belongsTo(value, factory) {
		return #factory in value && value.#factory === factory;
	}
};
const arrayCallbacks = /* @__PURE__ */ new Set([
	"every",
	"filter",
	"find",
	"findIndex",
	"findLast",
	"findLastIndex",
	"flatMap",
	"forEach",
	"map",
	"reduce",
	"reduceRight",
	"some",
	"sort",
	"toSorted"
]);
/** Native signatures distinguish callbacks, stored callables, and function invocation helpers. */
function getPluginMethodArgumentKind(object, key) {
	const array = Array.isArray(object);
	const intrinsic = typeof object === "function" ? Function.prototype : array ? Array.prototype : types.isMap(object) ? Map.prototype : types.isSet(object) ? Set.prototype : types.isWeakMap(object) ? WeakMap.prototype : types.isWeakSet(object) ? WeakSet.prototype : void 0;
	if (!intrinsic || !Object.hasOwn(intrinsic, key)) return;
	let prototype = object;
	while (prototype && !Object.hasOwn(prototype, key)) prototype = Object.getPrototypeOf(prototype);
	const parent = prototype && Object.getPrototypeOf(prototype);
	if (!parent || Object.getPrototypeOf(parent) !== null) return;
	if (typeof object === "function") return "function";
	return key === "forEach" || array && typeof key === "string" && arrayCallbacks.has(key) ? 0 : null;
}
/** Preserves caller data and caches callback views within one instance. */
function createPluginArgumentView(bindings) {
	const restoreHandle = (value) => {
		if (value === null || typeof value !== "object") return value;
		let source = value;
		for (let original = bindings.original(source); original; original = bindings.original(source)) source = original;
		return source;
	};
	const callbacks = /* @__PURE__ */ new WeakMap();
	const factory = {};
	return (args, callbackIndex, field = "") => {
		if (callbackIndex === null || args.length === 0) return { args: args.map((value) => typeof value === "function" ? bindings.original(value) ?? value : restoreHandle(value)) };
		const callerData = callbackIndex === 0 && (field === "reduce" || field === "reduceRight") ? args.slice(1, 2) : void 0;
		return {
			args: args.map((value, index) => {
				if (typeof value !== "function" || callbackIndex !== void 0 && index !== callbackIndex) return restoreHandle(value);
				if (callbackIndex === void 0 && bindings.isWrapped(value)) return bindings.original(value) ?? value;
				let callback = callerData ? void 0 : CallbackView.belongsTo(value, factory) ? value : callbacks.get(value);
				if (!callback) {
					const invoke = (values, run) => bindings.invoke(() => run(values));
					callback = new Proxy(value, {
						apply: (target, receiver, values) => {
							const result = invoke(values, (wrapped) => Reflect.apply(target, receiver, wrapped));
							if (callerData) callerData[0] = result;
							return result;
						},
						construct: (target, values, newTarget) => invoke(values, (wrapped) => Reflect.construct(target, wrapped, newTarget === callback ? target : newTarget))
					});
					bindings.setOriginal(callback, value);
					if (!callerData) {
						callbacks.set(value, callback);
						new CallbackView(callback, factory);
					}
				}
				return callback;
			}),
			callerData
		};
	};
}
//#endregion
//#region src/plugins/plugin-instance-bindings.ts
const { values: valueInstances$1 } = pluginInstanceState;
var ExecutableBinding = class extends PluginHostObject {
	#factory;
	constructor(value, factory) {
		super(value);
		this.#factory = factory;
	}
	static belongsTo(value, factory) {
		return #factory in value && value.#factory === factory;
	}
};
const DATA_FIELDS = /* @__PURE__ */ new Set([
	"parameters",
	"schema",
	"configSchema",
	"configJsonSchema",
	"inputSchema",
	"outputSchema"
]);
function pluginMemberDescriptor(object, key) {
	let descriptor;
	for (let source = object; source && !descriptor; source = Object.getPrototypeOf(source)) descriptor = Object.getOwnPropertyDescriptor(source, key);
	return descriptor;
}
function readPluginMember(object, key, invoke, receiver = object) {
	return pluginMemberNeedsAdmission(object, key) ? invoke(() => Reflect.get(object, key, receiver)) : Reflect.get(object, key, receiver);
}
function pluginMemberNeedsAdmission(object, key, getters = true) {
	for (let source = object; source; source = Object.getPrototypeOf(source)) {
		if (types.isProxy(source)) return true;
		const descriptor = Object.getOwnPropertyDescriptor(source, key);
		if (descriptor) return getters && descriptor.get !== void 0;
	}
	return false;
}
function hasProxyPrototype(object) {
	for (let source = object; source; source = Object.getPrototypeOf(source)) if (types.isProxy(source)) return true;
	return false;
}
function isNativePluginData(value) {
	return types.isAnyArrayBuffer(value) || types.isArrayBufferView(value) || types.isDate(value) || types.isRegExp(value) || types.isNativeError(value);
}
function bindNativeReceiver(invoke) {
	return function(...args) {
		return invoke(this, args);
	};
}
/** Registration facts and captured stream scopes share the instance's lifetime. */
function createPluginInstanceBindings(bindings) {
	const { instance } = bindings;
	const factories = /* @__PURE__ */ new WeakSet();
	const admitFactory = (factory) => {
		factories.add(factory);
	};
	return {
		admitFactory,
		create(admit, admitCallback = (run) => admit(() => bindings.invoke(run))) {
			return createPluginBindings({
				...bindings,
				admitFactory,
				prepareInvocation: (token, parent) => {
					const context = pluginInvocationContext.getStore();
					const consumer = bindings.isConsumerToken(token);
					const origin = parent ?? pluginInstanceInvocation.getStore();
					const resource = bindings.enter(token, () => new AsyncResource("OpenClawPluginStream"));
					return {
						origin,
						reenter: (run) => {
							if (consumer && !bindings.hasToken(token)) throw new Error(`Plugin ${instance.pluginId} consumer is closed`);
							return resource.runInAsyncScope(() => pluginInstanceInvocation.run(origin, run));
						},
						assertCurrent: () => {
							context?.lookup(instance);
							const current = pluginInvocationContext.getStore();
							if (current !== context) current?.lookup(instance);
						},
						run: (run) => resource.runInAsyncScope(run),
						close: () => resource.emitDestroy()
					};
				},
				isFactory: (value) => {
					for (let source = value; source; source = getPluginOriginalValue(source, instance)) if (factories.has(source)) return true;
					return false;
				}
			}, admit, admitCallback);
		}
	};
}
/** Builds callable views while the exact instance continues to own admission and leases. */
function createPluginBindings(bindings, admit, admitCallback) {
	const wrapped = /* @__PURE__ */ new WeakMap();
	const factory = {};
	const originalValue = (value) => getPluginOriginalValue(value, bindings.instance);
	const derivedReceivers = /* @__PURE__ */ new WeakSet();
	const prototypeReceivers = /* @__PURE__ */ new WeakMap();
	const iterators = /* @__PURE__ */ new WeakMap();
	const wrapArguments = createPluginArgumentView({
		original: originalValue,
		setOriginal: (value, source) => setPluginOriginalValue(value, source, bindings.instance),
		isWrapped: (value) => ExecutableBinding.belongsTo(value, factory),
		invoke: admitCallback
	});
	const passResult = (value) => typeof value === "function" || value !== null && typeof value === "object" && typeof Reflect.get(value, Symbol.asyncIterator) === "function" ? wrap(value) : value;
	const bindFactoryResult = (value) => {
		if (!Array.isArray(value)) return wrap(value);
		return value.map((entry) => wrap(entry));
	};
	const wrapResult = (result, callerData, executable = false) => {
		const completion = resolvePluginReturnPromise(result);
		if (completion) {
			const pending = mapPluginReturnPromise(completion, (resolved) => executable ? bindFactoryResult(resolved) : passResult(resolved));
			if (pending.host) valueInstances$1.setHost(pending.value, bindings.instance);
			else valueInstances$1.set(pending.value, bindings.instance);
			return pending.value;
		}
		return callerData?.includes(result) ? result : executable ? bindFactoryResult(result) : passResult(result);
	};
	/** Callables retain their instance; schemas remain data for host validators. */
	const wrap = (value, field = "", callbackIndex) => {
		if ((!value || typeof value !== "object") && typeof value !== "function") return value;
		if (DATA_FIELDS.has(field) || typeof value === "object" && isNativePluginData(value)) return value;
		const object = value;
		if (ExecutableBinding.belongsTo(object, factory)) return value;
		const cached = wrapped.get(object);
		if (cached) return cached;
		const methods = /* @__PURE__ */ new Map();
		const derivedFields = /* @__PURE__ */ new Set();
		const invoke = (run) => {
			const current = iterators.get(object);
			if (current?.active) return current.invoke(run);
			return current && !current.done ? current.reenter(() => admit(run)) : admit(run);
		};
		const inspectIterable = () => pluginMemberDescriptor(object, Symbol.asyncIterator);
		const iterableDescriptor = pluginMemberNeedsAdmission(object, Symbol.asyncIterator, false) ? invoke(inspectIterable) : inspectIterable();
		const iterable = typeof iterableDescriptor?.value === "function" || iterableDescriptor?.get !== void 0;
		const reflect = (run) => types.isProxy(object) ? invoke(run) : run();
		const resolveReceiver = (key, receiver) => {
			const receivers = prototypeReceivers.get(object);
			if (receivers) {
				const original = originalValue(receiver) ?? receiver;
				return receivers.get(original) ?? original;
			}
			if (receiver !== object && receiver !== result) return originalValue(receiver) ?? receiver;
			return derivedReceivers.has(object) && (!reflect(() => Object.hasOwn(object, key)) || derivedFields.has(key)) ? result : object;
		};
		const read = (key, receiver = object) => {
			const protocol = key === "next" || key === "return" || key === "throw";
			const iteration = iterators.get(object);
			if (iteration?.done) {
				if (key === Symbol.asyncIterator) return methods.get(key)?.wrapped ?? (() => result);
				if (protocol) return (...args) => iteration.call(key, void 0, args);
			}
			const prepared = methods.get(key);
			if (protocol && iteration?.active && prepared) return prepared.wrapped;
			let resolvedReceiver = receiver;
			let property;
			try {
				resolvedReceiver = resolveReceiver(key, receiver);
				property = readPluginMember(object, key, invoke, resolvedReceiver);
			} catch (error) {
				if (protocol && iteration?.active) iteration.close();
				throw error;
			}
			if (key === "return" && iteration && typeof property !== "function") {
				if (property == null) return (...args) => iteration.call(key, void 0, args);
				if (iteration.active) iteration.close();
			}
			if (typeof property !== "function" || key === "constructor") return wrap(property, String(key));
			const cachedMethod = methods.get(key);
			if (cachedMethod?.original === property && cachedMethod.receiver === resolvedReceiver) return cachedMethod.wrapped;
			if (key === Symbol.asyncIterator || protocol && (iterable || iteration)) {
				const bound = key === Symbol.asyncIterator ? (...args) => {
					if (iterators.get(object)?.done) return result;
					return invoke(() => {
						const iterator = Reflect.apply(property, resolvedReceiver, args);
						if (!iterator || typeof iterator !== "object" && typeof iterator !== "function") throw new TypeError("Plugin async iterator factory must return an object");
						admitIterator(iterator);
						return wrap(iterator);
					});
				} : (...args) => {
					try {
						const current = iterators.get(object);
						return (current && (current.active || current.done) ? current : admitIterator(object)).call(key, property, args);
					} catch (error) {
						return Promise.resolve().then(() => {
							throw error;
						});
					}
				};
				methods.set(key, {
					original: property,
					receiver: resolvedReceiver,
					wrapped: bound
				});
				valueInstances$1.setHost(bound, bindings.instance);
				return bound;
			}
			const classify = () => getPluginMethodArgumentKind(object, key);
			const kind = hasProxyPrototype(object) ? invoke(classify) : classify();
			if (kind === "function" && !prototypeReceivers.has(object) && (key === "call" || key === "apply" || key === "bind")) {
				const bound = key === "bind" ? (...args) => admit(() => {
					const source = Reflect.apply(Function.prototype.bind, result, wrapArguments(args).args);
					if (bindings.isFactory(result)) bindings.admitFactory(source);
					return wrap(source);
				}) : wrap(Function.prototype.bind.call(Function.prototype[key], result), key);
				methods.set(key, {
					original: property,
					receiver: resolvedReceiver,
					wrapped: bound
				});
				valueInstances$1.setHost(bound, bindings.instance);
				return bound;
			}
			const bind = () => prototypeReceivers.has(object) ? new Proxy(property, { apply: (target, callReceiver, args) => Reflect.apply(target, resolveReceiver(key, callReceiver), args) }) : Function.prototype.bind.call(property, resolvedReceiver);
			const bound = wrap(!originalValue(property) && (pluginMemberNeedsAdmission(property, "length") || pluginMemberNeedsAdmission(property, "name")) ? invoke(bind) : bind(), String(key), kind === "function" ? void 0 : kind);
			setPluginOriginalValue(bound, property, bindings.instance);
			methods.set(key, {
				original: property,
				receiver: resolvedReceiver,
				wrapped: bound
			});
			return bound;
		};
		const handlers = {
			get: (target, key, receiver) => {
				const fixed = Object.getOwnPropertyDescriptor(target, key);
				return fixed?.configurable === false && "value" in fixed && !fixed.writable ? fixed.value : read(key, receiver);
			},
			has: (_target, key) => pluginMemberNeedsAdmission(object, key, false) ? invoke(() => Reflect.has(object, key)) : Reflect.has(object, key),
			getPrototypeOf: () => prototypeReceivers.has(object) ? object : reflect(() => Object.getPrototypeOf(object)),
			ownKeys: () => reflect(() => Reflect.ownKeys(object)),
			getOwnPropertyDescriptor: (target, key) => {
				const original = reflect(() => Object.getOwnPropertyDescriptor(object, key));
				if (!original) return;
				const configurable = key !== "length" || !Array.isArray(value);
				const fixed = Object.getOwnPropertyDescriptor(target, key);
				if (configurable && fixed?.configurable === false) return "value" in fixed && fixed.writable ? {
					...fixed,
					value: read(key)
				} : fixed;
				if (!configurable) Object.defineProperty(target, key, original);
				return "value" in original ? {
					...original,
					configurable,
					value: read(key)
				} : {
					...original,
					configurable,
					get: original.get ? bindNativeReceiver((receiver) => read(key, receiver)) : void 0,
					set: original.set ? bindNativeReceiver((receiver, [next]) => invoke(() => Reflect.set(object, key, next, resolveReceiver(key, receiver ?? object)))) : void 0
				};
			},
			set: (_target, key, next, receiver) => invoke(() => Reflect.set(object, key, next, pluginMemberDescriptor(object, key)?.set ? resolveReceiver(key, receiver) : receiver)),
			preventExtensions: () => false,
			defineProperty: (target, key, attributes) => invoke(() => {
				const current = handlers.getOwnPropertyDescriptor(target, key);
				if (!Reflect.defineProperty(object, key, attributes)) return false;
				derivedFields.add(key);
				if (current) Object.defineProperty(target, key, current);
				return Reflect.defineProperty(target, key, attributes);
			}),
			deleteProperty: (_target, key) => invoke(() => Reflect.deleteProperty(object, key))
		};
		let result;
		if (typeof value === "function") {
			const prototype = reflect(() => Object.getOwnPropertyDescriptor(value, "prototype")?.value);
			const receivers = prototype && typeof prototype === "object" ? prototypeReceivers.get(prototype) ?? /* @__PURE__ */ new WeakMap() : void 0;
			if (receivers) prototypeReceivers.set(prototype, receivers);
			const bind = () => Function.prototype.bind.call(value, void 0);
			result = new Proxy(pluginMemberNeedsAdmission(value, "length") || pluginMemberNeedsAdmission(value, "name") ? admit(bind) : bind(), {
				...handlers,
				apply: (_target, receiver, args) => admit(() => {
					const call = wrapArguments(args, callbackIndex, field);
					return wrapResult(Reflect.apply(value, receiver, call.args), call.callerData, bindings.isFactory(result));
				}),
				construct: (_target, args, newTarget) => admit(() => {
					const constructed = Reflect.construct(value, wrapArguments(args, callbackIndex, field).args, newTarget === result ? value : newTarget);
					receivers?.set(originalValue(constructed) ?? constructed, constructed);
					if (newTarget !== result) derivedReceivers.add(constructed);
					return wrap(constructed);
				})
			});
		} else result = new Proxy(Array.isArray(value) ? [] : Object.create(reflect(() => Object.getPrototypeOf(object))), handlers);
		wrapped.set(object, result);
		new ExecutableBinding(result, factory);
		setPluginOriginalValue(result, object, bindings.instance);
		valueInstances$1.setHost(result, bindings.instance);
		return result;
	};
	const admitIterator = (iterator) => {
		const current = iterators.get(iterator);
		if (current?.active || current?.done) return current;
		const create = () => admit(() => createIteratorAdmission(iterator, current));
		return current ? current.reenter(create) : create();
	};
	const createIteratorAdmission = (iterator, previous) => {
		const { token, release } = bindings.lease();
		let invocation;
		try {
			invocation = bindings.prepareInvocation(token, previous?.origin);
		} catch (error) {
			release();
			throw error;
		}
		let state = "open";
		let active = true;
		let pending = 0;
		let closed = false;
		const settle = () => {
			if (state === "done" && pending === 0 && !closed) {
				closed = true;
				invocation.close();
			}
			if (state !== "open" && pending === 0 && active) {
				active = false;
				return release();
			}
		};
		const releaseOperation = () => {
			pending -= 1;
			return settle();
		};
		const assertActive = () => {
			if (!active || !bindings.hasToken(token)) throw new Error(`Plugin ${bindings.instance.pluginId} stream is closed`);
		};
		const invoke = (run) => {
			pending += 1;
			try {
				try {
					assertActive();
					invocation.assertCurrent();
				} catch (error) {
					state = "done";
					throw error;
				}
				return invocation.run(() => {
					const result = run();
					const completion = resolvePluginReturnPromise(result);
					if (completion) return mapPluginReturnPromise(completion, async (value) => {
						await releaseOperation();
						return value;
					}, async (error) => {
						await releaseOperation()?.catch(() => {});
						throw error;
					}).value;
					releaseOperation();
					return result;
				});
			} catch (error) {
				releaseOperation();
				throw error;
			}
		};
		const admission = {
			origin: invocation.origin,
			reenter: (run) => {
				try {
					invocation.assertCurrent();
					return invocation.reenter(run);
				} catch (error) {
					state = "done";
					settle();
					throw error;
				}
			},
			get done() {
				return state === "done";
			},
			get active() {
				return active;
			},
			invoke,
			close: () => {
				state = "done";
				settle();
			},
			call: (key, method, args) => {
				if (state === "done" && key === "return") return Promise.resolve(args[0]).then((value) => ({
					done: true,
					value
				}));
				if (state === "done") return Promise.resolve().then(() => admit(() => {
					if (key === "throw") throw args[0];
					return {
						done: true,
						value: void 0
					};
				}));
				try {
					assertActive();
					invocation.assertCurrent();
					return invocation.run(async () => {
						pending += 1;
						try {
							if (!method) {
								if (key === "return") {
									state = "done";
									return {
										done: true,
										value: await args[0]
									};
								}
								throw new TypeError("Plugin iterator method must be callable");
							}
							const next = await Reflect.apply(method, iterator, args);
							if (next === null || typeof next !== "object" && typeof next !== "function") throw new TypeError("Plugin async iterator result must be an object");
							assertActive();
							state = Reflect.get(next, "done") ? "done" : key === "return" ? "returned" : state;
							return next;
						} catch (error) {
							state = "done";
							throw error;
						} finally {
							const completion = releaseOperation();
							if (completion) await completion;
						}
					});
				} catch (error) {
					state = "done";
					const reject = () => {
						throw error;
					};
					return Promise.resolve(settle()).then(reject, reject);
				}
			}
		};
		iterators.set(iterator, admission);
		previous?.close();
		return admission;
	};
	return wrap;
}
//#endregion
//#region src/plugins/plugin-instance-disposal.ts
var DisposalFailures = class extends Set {
	constructor(instance) {
		super();
		this.instance = instance;
		this.hostErrors = /* @__PURE__ */ new Set();
		this.instanceErrors = /* @__PURE__ */ new Set();
	}
	add(error) {
		const current = pluginInstanceInvocation.getStore();
		(current?.instance === this.instance && PluginCallToken.isHostCleanup(current.token) ? this.hostErrors : this.instanceErrors).add(error);
		return super.add(error);
	}
	result(errors) {
		const hostCleanupErrors = [...this.hostErrors].filter((error) => !this.instanceErrors.has(error));
		return {
			errors,
			...hostCleanupErrors.length ? { hostCleanupErrors } : {}
		};
	}
};
//#endregion
//#region src/plugins/plugin-instance-settlement.ts
/** Observers never revoke admitted work; cancellation removes only their waiter. */
async function waitForPluginInstanceSettlement(pluginId, waiters, settled, signal) {
	signal.throwIfAborted();
	if (settled()) return;
	await new Promise((resolve, reject) => {
		const cleanup = () => {
			waiters.delete(wake);
			signal.removeEventListener("abort", abort);
		};
		const wake = () => {
			if (settled()) {
				cleanup();
				resolve();
			}
		};
		const abort = () => {
			cleanup();
			reject(toErrorObject(signal.reason, `Plugin ${pluginId} work drain aborted`));
		};
		waiters.add(wake);
		signal.addEventListener("abort", abort, { once: true });
	});
}
//#endregion
//#region src/plugins/plugin-instance.ts
const { values: valueInstances } = pluginInstanceState;
const SHUTDOWN_TIMEOUT_MS = 5e3;
const log = createSubsystemLogger("plugins/cleanup");
var PluginInstance = class {
	constructor(pluginId, owner) {
		this.pluginId = pluginId;
		this.slots = /* @__PURE__ */ new Map();
		this.controller = new AbortController();
		this.toolRegistrationComplete = false;
		this.controlPlaneInitialized = false;
		this.accepting = true;
		this.replacementReserved = false;
		this.retainedWork = /* @__PURE__ */ new Set();
		this.calls = /* @__PURE__ */ new Map();
		this.forcedRetirement = false;
		this.consumers = /* @__PURE__ */ new Map();
		this.cleanups = /* @__PURE__ */ new Map();
		this.waiters = /* @__PURE__ */ new Set();
		this.bindings = createPluginInstanceBindings({
			instance: this,
			enter: (token, run) => this.enter(token, run),
			invoke: (run) => this.invoke(run),
			lease: () => this.lease(),
			hasToken: (token) => this.hasToken(token),
			isConsumerToken: (token) => this.consumers.has(token)
		});
		this.admitFactory = this.bindings.admitFactory;
		this.wrap = this.bindings.create((run) => this.run(run), (run) => this.runConsumer(run));
		if (owner && "record" in owner) {
			this.owner = resolvePluginInstanceOwner(owner.record, owner.registry);
			if (this.owner.instance) throw new Error(`Plugin ${pluginId} already owns a runtime instance`);
			this.owner.instance = this;
			pluginInstanceState.records.set(this, this.owner);
		} else this.setupCache = owner?.cache;
		this.lifecycle = Object.freeze({
			signal: this.controller.signal,
			onDispose: (cleanup) => this.addCleanup(cleanup, "plugin"),
			runInBackgroundContext: createPluginBackgroundRunner(this, (token) => this.calls.get(token)?.cleanup === true)
		});
	}
	addCleanup(cleanup, kind) {
		if (this.controller.signal.aborted || (!this.accepting || this.owner?.revoked) && !this.activeCall()) throw new Error(`Plugin ${this.pluginId} is retiring`);
		this.cleanups.set(cleanup, kind);
		return () => void this.cleanups.delete(cleanup);
	}
	/** Captured module resources retain physical custody after a forced logical retirement. */
	onModuleDispose(cleanup) {
		this.addCleanup(cleanup, "module");
	}
	hasToken(token) {
		return this.calls.has(token) || this.consumers.get(token)?.active === true;
	}
	activeCall(scope = pluginInstanceInvocation.getStore()) {
		return scope?.instance === this && this.hasToken(scope.token) ? scope : void 0;
	}
	get acceptingCalls() {
		return this.accepting;
	}
	get hasActiveCall() {
		return this.activeCall() !== void 0;
	}
	/** A reload has reserved this instance and is draining its admitted work. */
	get replacementPending() {
		return this.replacementReserved;
	}
	holdsPendingReplacement(token) {
		return this.replacementReserved && this.hasToken(token);
	}
	run(run) {
		const current = this.activeCall();
		if (current) return this.enter(current.token, run);
		const scoped = pluginInvocationContext.getStore()?.lookup(this);
		if (scoped) return scoped.run(run);
		if (!this.accepting || this.owner?.revoked) throw new PluginInstanceUnavailableError(this.pluginId);
		return this.invoke(run);
	}
	runInRegistry(registry, run, options) {
		const current = this.activeCall();
		if (current) return this.enter(current.token, run);
		if (!this.accepting || this.owner?.revoked) throw new PluginInstanceUnavailableError(this.pluginId);
		return this.invoke(run, this.lease({
			registry,
			joinDisposal: options?.joinDisposal
		}));
	}
	/** Associates an identity-sensitive public value without replacing it with a view. */
	adopt(value) {
		return valueInstances.adopt(value, this);
	}
	createRegistryView(registry, invoke) {
		return this.bindings.create((run) => invoke(() => this.runInRegistry(registry, run)));
	}
	/** Detached host consumption retains its completion independently of its admitting caller. */
	runConsumer(consume) {
		return this.activeCall() ? this.invoke(consume) : this.run(consume);
	}
	get hasRetainedConsumers() {
		return this.consumers.size > 0;
	}
	/** Track finite host work without granting invocation authority or joining disposal. */
	retainWork() {
		if (this.replacementReserved) throw new Error(`Plugin ${this.pluginId} replacement is in progress`);
		const token = {};
		this.retainedWork.add(token);
		return () => {
			if (this.retainedWork.delete(token)) this.waiters.forEach((wake) => wake());
		};
	}
	get retainedWorkCount() {
		return this.retainedWork.size + [...this.consumers.values()].filter(({ kind }) => kind === "work").length;
	}
	get ordinaryCallCount() {
		return [...this.calls.values()].filter((call) => !call.cleanup).length;
	}
	/** Observe admitted work without closing callbacks or idle publication custody. */
	async waitForRetainedWork(signal, { includeConsumers = true, includeCalls = false } = {}) {
		await waitForPluginInstanceSettlement(this.pluginId, this.waiters, () => (!includeCalls || this.ordinaryCallCount === 0) && (includeConsumers ? this.retainedWorkCount : this.retainedWork.size) === 0, signal);
	}
	/** Reserve replacement atomically before host owners invalidate or stop this instance. */
	reserveReplacement() {
		if (this.hasActiveCall) throw new Error(`Plugin ${this.pluginId} cannot replace itself from its own active call; retry after the call finishes.`);
		if (this.replacementReserved) throw new Error(`Plugin ${this.pluginId} replacement is in progress`);
		this.replacementReserved = true;
		let released = false;
		return () => {
			if (!released) {
				released = true;
				this.replacementReserved = false;
			}
		};
	}
	/** Retain executable use or idle donor custody through its physical completion. */
	retainConsumer(invoke, registry, kind = "work") {
		const current = this.activeCall();
		const parent = current && this.consumers.get(current.token);
		if (this.replacementReserved && parent?.kind !== "work" || (!this.accepting || this.owner?.revoked) && !parent?.active) throw new Error(`Plugin ${this.pluginId} is retiring`);
		const released = createDeferredCore();
		const token = {
			active: true,
			completion: released.promise,
			registry,
			kind
		};
		this.consumers.set(token, token);
		let closing;
		const release = () => {
			token.active = false;
			if (this.consumers.delete(token)) {
				released.resolve();
				this.waiters.forEach((wake) => wake());
			}
		};
		const run = (consume) => {
			if (!token.active) throw new Error(`Plugin ${this.pluginId} consumer is closed`);
			const call = () => this.invoke(consume, {
				token,
				release: () => void 0
			});
			return invoke ? invoke(call) : call();
		};
		return {
			run,
			wrap: this.bindings.create(run, run),
			close: (cleanup) => {
				if (!closing && this.consumers.has(token)) {
					token.active = false;
					const completion = createDeferredCore();
					closing = completion.promise.finally(release);
					try {
						completion.resolve(this.invoke(cleanup, this.lease({
							cleanup: true,
							registry: token.registry
						}), this.disposalFailures));
					} catch (error) {
						completion.reject(error);
					}
				}
				return closing ?? Promise.reject(/* @__PURE__ */ new Error(`Plugin ${this.pluginId} consumer is closed`));
			},
			release: () => {
				if (!closing) release();
			}
		};
	}
	/** Only lifecycle owners may admit teardown after ordinary calls have stopped. */
	runCleanup(run) {
		const current = this.activeCall();
		if (!current) this.controller.signal.throwIfAborted();
		return this.invoke(run, current ? {
			token: current.token,
			release: () => void 0
		} : this.lease({ cleanup: true }), this.disposalFailures);
	}
	invoke(run, { token, release } = this.lease(), cleanupFailures) {
		const cleanup = this.calls.get(token)?.cleanup === true;
		try {
			return this.enter(token, () => {
				const value = run();
				const completion = resolvePluginReturnPromise(value);
				if (completion) {
					const settled = mapPluginReturnPromise(completion, async (result) => {
						await release();
						if (this.forcedRetirement && !cleanup && !this.hasToken(token)) throw new PluginInstanceUnavailableError(this.pluginId);
						return result;
					}, async (error) => {
						cleanupFailures?.add(error);
						await release()?.catch(() => {});
						throw error;
					});
					if (settled.host) valueInstances.setHost(settled.value, this);
					else valueInstances.set(settled.value, this);
					return settled.value;
				}
				release();
				if (this.forcedRetirement && !cleanup && !this.hasToken(token)) throw new PluginInstanceUnavailableError(this.pluginId);
				return value;
			});
		} catch (error) {
			cleanupFailures?.add(error);
			release();
			throw error;
		}
	}
	enter(token, run) {
		pluginInvocationContext.getStore()?.lookup(this);
		const current = pluginInstanceInvocation.getStore();
		const call = current?.instance === this && current.token === token ? current : {
			instance: this,
			token,
			parent: current
		};
		if (!this.owner) {
			const enter = () => pluginInstanceInvocation.run(call, run);
			return this.setupCache ? withPluginCache(this.setupCache, enter) : enter();
		}
		const { record } = this.owner;
		const generation = getPluginRuntimeGenerationRegistry();
		const registry = this.consumers.get(token)?.registry ?? this.calls.get(token)?.registry ?? (generation?.plugins.includes(record) ? generation : this.owner.registry);
		return withPluginRuntimePluginScope({
			pluginId: record.id,
			pluginSource: record.source,
			pluginOrigin: record.origin,
			pluginTrustedOfficialInstall: record.trustedOfficialInstall
		}, run, registry, call);
	}
	lease(options = {}) {
		const current = this.activeCall();
		const registry = options.registry ?? (current && this.calls.get(current.token)?.registry);
		const joinDisposal = !options.cleanup && options.joinDisposal !== false;
		if (!options.registry && current && this.consumers.has(current.token)) return {
			token: current.token,
			release: () => void 0
		};
		const token = new PluginCallToken({}, options.cleanup && options.hostCleanup || current !== void 0 && PluginCallToken.isHostCleanup(current.token));
		this.calls.set(token, {
			registry,
			cleanup: options.cleanup === true || (current && this.calls.get(current.token)?.cleanup) === true
		});
		return {
			token,
			release: () => {
				this.calls.delete(token);
				const timedOut = this.timedOutCalls;
				if (timedOut?.remaining.delete(token) && timedOut.remaining.size === 0) {
					this.timedOutCalls = void 0;
					timedOut.settled.resolve();
				}
				this.waiters.forEach((wake) => wake());
				return joinDisposal && this.calls.size === 0 && !this.controller.signal.aborted ? this.disposal : void 0;
			}
		};
	}
	bindModuleLoader(load, hasSource) {
		if (this.moduleLoader) throw new Error(`Plugin ${this.pluginId} already owns its module loader`);
		this.moduleLoader = load;
		this.moduleSourceExists = hasSource;
	}
	loadModule(source) {
		return this.run(() => {
			if (!this.moduleLoader) throw new Error(`Plugin ${this.pluginId} has no captured module loader`);
			return this.wrap(this.moduleLoader(source));
		});
	}
	hasModuleSource(source) {
		return this.moduleSourceExists && this.moduleSourceExists(source);
	}
	bindModuleLoaderRecovery(capture) {
		this.captureModuleRecovery = capture;
	}
	captureModuleLoaderRecovery() {
		if (this.disposing || this.owner?.revoked || this.controller.signal.aborted) throw new PluginInstanceUnavailableError(this.pluginId);
		return this.runCleanup(() => {
			if (!this.captureModuleRecovery) throw new Error(`Plugin ${this.pluginId} has no recoverable module loader`);
			return this.captureModuleRecovery();
		});
	}
	quiesce() {
		const accepting = this.accepting;
		this.accepting = false;
		return accepting;
	}
	async drain(options) {
		this.quiesce();
		const ownToken = this.activeCall()?.token;
		try {
			await this.waitForCalls(ownToken, options?.signal);
			if (options?.includeConsumers) await waitForPluginInstanceSettlement(this.pluginId, this.waiters, () => this.consumers.size === 0, options.signal ?? new AbortController().signal);
			return { errors: [] };
		} catch (error) {
			return { errors: [error] };
		}
	}
	async waitForCalls(ownToken, signal) {
		const settled = () => [...this.calls.keys()].every((token) => token === ownToken);
		if (signal) return waitForPluginInstanceSettlement(this.pluginId, this.waiters, settled, signal);
		const deadline = new AbortController();
		const timer = setTimeout(() => {
			deadline.abort(/* @__PURE__ */ new Error(`Plugin ${this.pluginId} still has active calls after ${SHUTDOWN_TIMEOUT_MS}ms`));
		}, SHUTDOWN_TIMEOUT_MS);
		try {
			await waitForPluginInstanceSettlement(this.pluginId, this.waiters, settled, deadline.signal);
		} finally {
			clearTimeout(timer);
		}
	}
	get disposing() {
		return this.disposal !== void 0;
	}
	trackTimedOutCalls() {
		const { remaining, settled } = this.timedOutCalls ?? {
			remaining: /* @__PURE__ */ new Set(),
			settled: createDeferredCore()
		};
		for (const token of this.calls.keys()) remaining.add(token);
		if (remaining.size) this.timedOutCalls = {
			remaining,
			settled
		};
		else settled.resolve();
		return settled.promise;
	}
	resume() {
		this.accepting ||= !this.disposal && !this.controller.signal.aborted && !this.owner?.revoked;
	}
	dispose(beforeCleanup) {
		if (beforeCleanup && this.disposal) return Promise.reject(/* @__PURE__ */ new Error(`Plugin ${this.pluginId} disposal already started`));
		if (!this.disposal) {
			this.quiesce();
			const terminalFailures = this.disposalFailures = new DisposalFailures(this);
			const work = new AsyncWorkScope(terminalFailures);
			const physical = pluginInvocationContext.exit(() => this.finishDisposal(trackAsyncWork(() => this.runDisposalCleanup(work, terminalFailures, beforeCleanup)), terminalFailures));
			const settled = physical.then(() => {
				if (terminalFailures.size) throw new AggregateError(terminalFailures, `Plugin ${this.pluginId} cleanup failed`);
			});
			settled.catch(() => {});
			this.disposal = new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					const fact = {
						activeCallCount: (/* @__PURE__ */ new Set([...this.calls.keys(), ...this.timedOutCalls?.remaining ?? []])).size,
						retainedConsumerCount: this.consumers.size
					};
					this.forcedRetirement = true;
					this.trackTimedOutCalls();
					for (const [token, call] of this.calls) if (!call.cleanup) this.calls.delete(token);
					this.abortDisposal(work);
					const error = new PluginInstanceDrainTimeoutError(`Plugin ${this.pluginId} forced retirement after ${SHUTDOWN_TIMEOUT_MS}ms: ${fact.activeCallCount} still-running call(s), ${fact.retainedConsumerCount} retained consumer(s); resource cleanup remains pending.`, settled, {}, fact);
					log.warn(error.message);
					resolve(terminalFailures.result([error, ...terminalFailures]));
				}, SHUTDOWN_TIMEOUT_MS);
				physical.then(resolve, reject).finally(() => clearTimeout(timer));
			});
			this.disposal.catch(() => {});
		}
		return this.activeCall() ? Promise.resolve({ errors: [] }) : this.disposal;
	}
	abortDisposal(work) {
		if (!this.controller.signal.aborted) pluginInvocationContext.exit(() => work.run(() => this.controller.abort(/* @__PURE__ */ new Error(`Plugin ${this.pluginId} is retiring`))));
	}
	async runDisposalCleanup(cleanupWork, terminalFailures, beforeCleanup) {
		if (this.owner) this.owner.revoked = true;
		const failures = [];
		let hostFailure;
		const runCleanup = (cleanup, hostCleanup = false) => cleanupWork.track(() => this.invoke(cleanup, this.lease({
			cleanup: true,
			hostCleanup
		}), terminalFailures));
		try {
			await this.waitForCalls();
		} catch (error) {
			failures.push(new PluginInstanceDrainTimeoutError(formatErrorMessage(error), this.trackTimedOutCalls(), { cause: error }));
		}
		for (const [token, call] of this.calls) if (!call.cleanup) this.calls.delete(token);
		while (this.consumers.size > 0) await Promise.all([...this.consumers.values()].map(({ completion }) => completion));
		if (beforeCleanup) try {
			await runCleanup(beforeCleanup, true);
		} catch (error) {
			hostFailure = { error };
		}
		const deadline = Date.now() + SHUTDOWN_TIMEOUT_MS;
		this.abortDisposal(cleanupWork);
		const moduleCleanups = [];
		for (const [cleanup, kind] of Array.from(this.cleanups).toReversed()) {
			if (kind === "module") {
				moduleCleanups.push(cleanup);
				continue;
			}
			try {
				await raceWithTimeout(runCleanup(cleanup), Math.max(0, deadline - Date.now()), () => {
					throw new Error(`Plugin ${this.pluginId} cleanup did not settle`);
				});
			} catch (error) {
				failures.push(error);
			}
		}
		await cleanupWork.drain();
		return {
			failures,
			hostFailure,
			moduleCleanups
		};
	}
	async finishDisposal(cleanupCompletion, terminalFailures) {
		const { failures, hostFailure, moduleCleanups } = await cleanupCompletion;
		await this.timedOutCalls?.settled.promise;
		for (const cleanup of moduleCleanups) try {
			await this.invoke(cleanup, this.lease({ cleanup: true }));
		} catch (error) {
			failures.push(error);
			terminalFailures.add(error);
		}
		this.cleanups.clear();
		this.calls.clear();
		this.waiters.forEach((wake) => wake());
		this.moduleLoader = void 0;
		this.setupCache = void 0;
		this.captureModuleRecovery = void 0;
		this.moduleSourceExists &&= false;
		this.slots.clear();
		for (const failure of terminalFailures) if (!failures.includes(failure)) failures.push(failure);
		if (failures.length) log.warn(`Plugin ${this.pluginId} cleanup failed: ${failures.map(formatErrorMessage).join("; ")}`);
		if (hostFailure) throw hostFailure.error;
		if (failures.length === 0) releasePluginCacheInstance(this);
		return terminalFailures.result(failures);
	}
};
//#endregion
//#region src/plugins/plugin-setup-module.ts
/** Setup callbacks belong to the inventory that loaded them. */
function getPluginSetupModuleLoader(record, source, rootDir) {
	const cache = getPluginCache();
	const key = `setup:${record.id}:${source}`;
	const cached = cache.setupModules.get(key);
	if (!cached && cache.retirement) throw new Error(`Plugin ${record.id} setup inventory has retired`);
	const instance = cached ?? new PluginInstance(record.id, { cache });
	const discard = () => {
		if (instance.controlPlaneInitialized) return;
		if (cache.setupModules.get(key) === instance) cache.setupModules.delete(key);
		retirePluginCacheInstance(instance, cache).catch(() => {});
	};
	if (!cached) {
		cache.setupModules.set(key, instance);
		try {
			if (record.origin === "bundled" && isJavaScriptModulePath(source)) {
				const distribution = path.dirname(path.dirname(rootDir));
				const dependencyRoot = path.basename(path.dirname(rootDir)) === "extensions" && path.basename(distribution) === "dist" ? distribution : rootDir;
				getPluginCacheSource(source).disposeModule ??= () => clearPluginModuleRequireCache(source, dependencyRoot);
			}
			bindPluginInstanceModuleLoader({
				instance,
				origin: record.origin,
				source,
				rootDir
			});
		} catch (error) {
			discard();
			throw error;
		}
	}
	return Object.assign((entry) => {
		try {
			return instance.loadModule(entry);
		} catch (error) {
			discard();
			throw error;
		}
	}, { initialize(run) {
		try {
			const result = run();
			instance.controlPlaneInitialized = true;
			return result;
		} catch (error) {
			discard();
			throw error;
		}
	} });
}
//#endregion
export { fingerprintPluginRuntimeArtifact as a, resolvePluginRuntimeArtifact as c, getSharedPluginCodeReloadWarning as i, PluginInstance as n, loadPluginRuntimeArtifactIdentitySources as o, bindPluginInstanceModuleLoader as r, clearPluginRuntimeArtifactResolutionMemo as s, getPluginSetupModuleLoader as t };

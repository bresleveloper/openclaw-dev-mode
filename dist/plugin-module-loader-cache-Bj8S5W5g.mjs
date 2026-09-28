import { D as withPluginCache, k as getPluginSdkHostFacts, l as getPluginCacheRoot, o as getPluginCache, r as bindPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { i as isPathStrictlyInside, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { c as supportsNativeModuleAliasHooks, i as isPluginSourceModulePath, l as tryNativeRequireJavaScriptModule, n as clearPluginModuleRequireCache, o as resolvePluginLoaderTryNative, u as tryNativeRequireModule } from "./native-module-require-CFiIAPP0.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { n as openPluginRootFileSync, t as isPathInside$1 } from "./path-safety-Cc0rrc_m.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { a as listWorkspacePackageExportAliasEntries, i as isPluginSdkAliasSpecifier, n as buildPluginLoaderJitiOptions, o as preparePluginLoaderAliases, r as createPluginLoaderModuleCacheKey } from "./sdk-alias-DjyX8sAu.mjs";
import { t as resolvePluginRuntimeRecord } from "./runtime-context-khSFyWth.mjs";
import Module from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
//#region src/shared/import-specifier.ts
/**
* On Windows, Node's ESM loader requires absolute paths to be expressed as
* file:// URLs. Raw drive-letter paths like C:\... are parsed as URL schemes.
*/
function toSafeImportPath(specifier) {
	if (process.platform !== "win32") return specifier;
	if (specifier.startsWith("file://")) return specifier;
	if (path.win32.isAbsolute(specifier)) return pathToFileURL(specifier, { windows: true }).href;
	return specifier;
}
//#endregion
//#region src/plugins/plugin-sdk-native-resolver.ts
/** Installs native Node resolution aliases so plugins can import the OpenClaw SDK in dev and tests. */
const moduleWithResolver = Module;
const nodeResolveFilenameProperty = "_resolveFilename";
const INTERNAL_CORE_PACKAGE_ALIASES = [
	{
		packageName: "@openclaw/markdown-core",
		packageDir: "markdown-core",
		subpaths: [
			["", "index.ts"],
			["code-spans", "code-spans.ts"],
			["fences", "fences.ts"],
			["frontmatter", "frontmatter.ts"],
			["ir", "ir.ts"],
			["render", "render.ts"],
			["render-aware-chunking", "render-aware-chunking.ts"],
			["tables", "tables.ts"],
			["types", "types.ts"]
		]
	},
	{
		packageName: "@openclaw/ai",
		packageDir: "ai",
		subpaths: [
			["", "index.ts"],
			["providers", "providers.ts"],
			["transports", "transports.ts"],
			["diagnostics", path.join("utils", "diagnostics.ts")],
			["event-stream", path.join("utils", "event-stream.ts")],
			["types", "types.ts"],
			["validation", "validation.ts"],
			["internal/anthropic", path.join("internal", "anthropic.ts")],
			["internal/google-model-family", path.join("internal", "google-model-family.ts")],
			["internal/openai", path.join("internal", "openai.ts")],
			["internal/openai-responses-payload-policy", path.join("internal", "openai-responses-payload-policy.ts")],
			["internal/retry-after", path.join("internal", "retry-after.ts")],
			["internal/runtime", path.join("internal", "runtime.ts")],
			["internal/shared", path.join("internal", "shared.ts")],
			["internal/tool-schema", path.join("internal", "tool-schema.ts")]
		]
	},
	{
		packageName: "@openclaw/llm-core",
		packageDir: "llm-core",
		subpaths: [
			["", "index.ts"],
			["model-contracts/anthropic", path.join("model-contracts", "anthropic.ts")],
			["diagnostics", path.join("utils", "diagnostics.ts")],
			["event-stream", path.join("utils", "event-stream.ts")],
			["types", "types.ts"],
			["validation", "validation.ts"]
		]
	}
];
const INTERNAL_CORE_EXPORTED_PACKAGE_DIRS = [
	"media-core",
	"normalization-core",
	"acp-core"
];
const BUN_NATIVE_ALIAS_FILTER = new RegExp(`^(?:${[
	"openclaw/plugin-sdk",
	"@openclaw/plugin-sdk",
	...INTERNAL_CORE_PACKAGE_ALIASES.map((entry) => entry.packageName),
	...INTERNAL_CORE_EXPORTED_PACKAGE_DIRS.map((packageDir) => `@openclaw/${packageDir}`)
].map(escapeRegExp).join("|")})(?:/|$)`, "u");
let installed = false;
function resolveLoaderModulePath(options) {
	return options.modulePath ?? fileURLToPath(options.moduleUrl ?? import.meta.url);
}
function isNativeLoadableSdkTarget(targetPath) {
	switch (path.extname(targetPath)) {
		case ".cjs":
		case ".js":
		case ".mjs": return true;
		default: return isPluginSourceModulePath(targetPath);
	}
}
const normalizePathForBoundary = (targetPath) => pluginCacheRealpathSync(targetPath) ?? path.resolve(targetPath);
function findNearestPackageRoot(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const roots = getPluginCache().sdk.native.nearestPackageRoots;
	const cached = roots.get(normalizedModulePath);
	if (cached) return cached;
	let cursor = path.dirname(normalizedModulePath);
	for (let i = 0; i < 12; i += 1) {
		if (pluginCacheExistsSync(path.join(cursor, "package.json"))) {
			roots.set(normalizedModulePath, cursor);
			return cursor;
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	const fallback = path.dirname(normalizedModulePath);
	roots.set(normalizedModulePath, fallback);
	return fallback;
}
function findBundledPluginRoot(modulePath) {
	const resolvedModulePath = normalizePathForBoundary(modulePath);
	const packageRoot = normalizePathForBoundary(resolveLoaderPackageRootFromModulePath(modulePath));
	for (const relativeRoot of [
		"extensions",
		"dist/extensions",
		"dist-runtime/extensions"
	]) {
		const bundledRoot = path.join(packageRoot, relativeRoot);
		if (!isPathStrictlyInside(bundledRoot, resolvedModulePath)) continue;
		const [pluginId] = path.relative(bundledRoot, resolvedModulePath).split(path.sep);
		if (pluginId) return path.join(bundledRoot, pluginId);
	}
}
function resolveLoaderPackageRootFromModulePath(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const roots = getPluginCache().sdk.native.loaderPackageRoots;
	const cached = roots.get(normalizedModulePath);
	if (cached) return cached;
	let cursor = path.dirname(normalizedModulePath);
	for (let i = 0; i < 12; i += 1) {
		const packageJsonPath = path.join(cursor, "package.json");
		if (pluginCacheExistsSync(packageJsonPath)) {
			const facts = getPluginSdkHostFacts(getPluginCache().sdk, cursor);
			if (facts.nativePackage === void 0) try {
				const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
				facts.nativePackage = isRecord(parsed) ? {
					...typeof parsed.name === "string" ? { name: parsed.name } : {},
					hasOpenClawBin: isRecord(parsed.bin) && typeof parsed.bin.openclaw === "string"
				} : null;
			} catch {
				facts.nativePackage = null;
			}
			if (facts.nativePackage?.name === "openclaw" || facts.nativePackage?.hasOpenClawBin) {
				roots.set(normalizedModulePath, cursor);
				return cursor;
			}
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	const fallback = findNearestPackageRoot(modulePath);
	roots.set(normalizedModulePath, fallback);
	return fallback;
}
function resolveInternalCorePackageHostRoot(modulePath) {
	const normalizedModulePath = path.resolve(modulePath);
	const internalCorePackageHostRoots = getPluginCache().sdk.native.hostRoots;
	const cached = internalCorePackageHostRoots.get(normalizedModulePath);
	if (cached) return cached;
	const packageRoot = normalizePathForBoundary(resolveLoaderPackageRootFromModulePath(normalizedModulePath));
	internalCorePackageHostRoots.set(normalizedModulePath, packageRoot);
	return packageRoot;
}
function resolveAllowedParentRoot(modulePath) {
	const roots = getPluginCache().sdk.native.allowedParentRoots;
	const key = path.resolve(modulePath);
	const cached = roots.get(key);
	if (cached) return cached;
	const root = findBundledPluginRoot(modulePath) ?? findNearestPackageRoot(modulePath);
	roots.set(key, root);
	return root;
}
function resolveAllowedParentRoots(options) {
	const roots = /* @__PURE__ */ new Set();
	if (options.pluginModulePath) roots.add(normalizePathForBoundary(resolveAllowedParentRoot(options.pluginModulePath)));
	for (const root of options.allowedParentRoots ?? []) roots.add(normalizePathForBoundary(root));
	return [...roots];
}
function isWithinRoot(candidate, root) {
	return isPathInside(root, normalizePathForBoundary(candidate));
}
function resolveAliasTargetForParentUrl(request, parentUrl) {
	if (!parentUrl?.startsWith("file:") || !isPluginSdkAliasSpecifier(request) && !getPluginCache().sdk.native.aliases.has(request)) return;
	try {
		return resolveAliasTargetForParentPath(request, fileURLToPath(parentUrl));
	} catch {
		return;
	}
}
function resolveAliasTargetForParentPath(request, parentFilename) {
	const native = getPluginCache().sdk.native;
	if (parentFilename && isPluginSdkAliasSpecifier(request)) {
		let first;
		for (const [root, provider] of native.sdkProviders) {
			if (!isWithinRoot(parentFilename, root)) continue;
			provider.order ??= native.nextSdkProviderOrder++;
			const target = provider.resolveAlias(request.endsWith(".js") ? request.slice(0, -3) : request);
			if (target && isNativeLoadableSdkTarget(target) && (!first || provider.order < first.order)) first = {
				target,
				order: provider.order
			};
		}
		return first?.target;
	}
	const entries = native.aliases.get(request);
	if (!entries || !parentFilename) return;
	return entries.find((entry) => isWithinRoot(parentFilename, entry.parentRoot))?.target;
}
function listInternalCorePackageNativeAliases(packageRoot) {
	const parentRoots = [
		"src",
		"scripts",
		"packages",
		"test"
	].map((segment) => path.join(packageRoot, segment)).filter((candidate) => pluginCacheExistsSync(candidate)).map(normalizePathForBoundary);
	if (parentRoots.length === 0) return [];
	const aliases = [];
	const internalCorePackageAliases = [...INTERNAL_CORE_PACKAGE_ALIASES, ...INTERNAL_CORE_EXPORTED_PACKAGE_DIRS.map((packageDir) => ({
		packageName: `@openclaw/${packageDir}`,
		packageDir,
		subpaths: listWorkspacePackageExportAliasEntries({
			packageRoot,
			packageName: `@openclaw/${packageDir}`,
			packageDir
		}).map((entry) => [entry.subpath, entry.srcFile])
	}))];
	for (const entry of internalCorePackageAliases) for (const [subpath, srcFile] of entry.subpaths) {
		const request = subpath ? `${entry.packageName}/${subpath}` : entry.packageName;
		const target = path.join(packageRoot, "packages", entry.packageDir, "src", srcFile);
		if (pluginCacheExistsSync(target)) aliases.push({
			request,
			target,
			parentRoots
		});
	}
	return aliases;
}
function installResolver() {
	const native = getPluginCache().sdk.native;
	if (installed || !(native.aliases.size || native.sdkProviders.size)) return;
	const bun = globalThis.Bun;
	if (bun) bun.plugin({
		name: "openclaw-plugin-sdk-alias",
		setup(builder) {
			builder.onResolve({
				filter: BUN_NATIVE_ALIAS_FILTER,
				namespace: "file"
			}, ({ path: request, importer }) => {
				const target = resolveAliasTargetForParentPath(request, importer);
				return target ? {
					path: target,
					namespace: "file"
				} : void 0;
			});
		}
	});
	const previousResolveFilename = moduleWithResolver[nodeResolveFilenameProperty];
	if (!previousResolveFilename || !supportsNativeModuleAliasHooks()) {
		installed = Boolean(bun);
		return;
	}
	moduleWithResolver[nodeResolveFilenameProperty] = ((request, parent, isMain, options) => resolveAliasTargetForParentPath(request, parent?.filename) ?? previousResolveFilename(request, parent, isMain, options));
	moduleWithResolver.registerHooks?.({ resolve(specifier, context, nextResolve) {
		const aliasTarget = resolveAliasTargetForParentUrl(specifier, context.parentURL);
		const resolved = aliasTarget ? {
			shortCircuit: true,
			url: pathToFileURL(aliasTarget).href
		} : nextResolve(specifier, context);
		if (context.conditions.includes("import") && resolved.url.startsWith("file:")) {
			const filename = fileURLToPath(resolved.url);
			const sdkTarget = isPluginSdkAliasSpecifier(specifier) ? aliasTarget : Array.from(getPluginCache().sdk.contexts.values()).some(({ sdkRoots }) => sdkRoots.includes(path.dirname(filename))) ? resolveAliasTargetForParentUrl(`openclaw/plugin-sdk/${path.basename(filename, path.extname(filename))}`, context.parentURL) : void 0;
			if (sdkTarget && pathToFileURL(sdkTarget).href === resolved.url) Module.createRequire(import.meta.url)(sdkTarget);
		}
		return resolved;
	} });
	installed = true;
}
function registerNativeAlias(params) {
	const pluginSdkNativeAliases = getPluginCache().sdk.native.aliases;
	const entries = pluginSdkNativeAliases.get(params.request) ?? [];
	for (const parentRoot of params.parentRoots) {
		const existingIndex = entries.findIndex((entry) => entry.parentRoot === parentRoot);
		if (existingIndex !== -1) {
			entries[existingIndex] = {
				parentRoot,
				target: params.target
			};
			continue;
		}
		entries.push({
			parentRoot,
			target: params.target
		});
	}
	if (entries.length > 0) pluginSdkNativeAliases.set(params.request, entries);
}
function clearNativeAliasesForParentRoots(parentRoots) {
	if (parentRoots.length === 0) return;
	const parentRootSet = new Set(parentRoots);
	for (const root of parentRoots) getPluginCache().sdk.native.sdkProviders.delete(root);
	const pluginSdkNativeAliases = getPluginCache().sdk.native.aliases;
	for (const [request, entries] of pluginSdkNativeAliases) {
		const nextEntries = entries.filter((entry) => !parentRootSet.has(entry.parentRoot));
		if (nextEntries.length === 0) pluginSdkNativeAliases.delete(request);
		else pluginSdkNativeAliases.set(request, nextEntries);
	}
}
function registerInternalCorePackageNativeAliases(options) {
	const packageRoot = resolveInternalCorePackageHostRoot(resolveLoaderModulePath(options));
	const registeredInternalCorePackageHosts = getPluginCache().sdk.native.registeredHosts;
	if (registeredInternalCorePackageHosts.has(packageRoot)) return;
	for (const alias of listInternalCorePackageNativeAliases(packageRoot)) registerNativeAlias(alias);
	registeredInternalCorePackageHosts.add(packageRoot);
}
function installOpenClawPluginSdkNativeResolver(options = {}) {
	const parentRoots = resolveAllowedParentRoots(options);
	clearNativeAliasesForParentRoots(parentRoots);
	const aliases = preparePluginLoaderAliases({
		modulePath: options.pluginModulePath ?? resolveLoaderModulePath(options),
		argv1: options.argv1 ?? process.argv[1],
		moduleUrl: options.moduleUrl ?? pathToFileURL(resolveLoaderModulePath(options)).href,
		pluginSdkResolution: options.pluginSdkResolution,
		devSourceRoot: options.devSourceRoot
	});
	const native = getPluginCache().sdk.native;
	for (const parentRoot of parentRoots) native.sdkProviders.set(parentRoot, { resolveAlias: aliases.resolveAlias });
	registerInternalCorePackageNativeAliases(options);
	installResolver();
}
function installOpenClawInternalCorePackageNativeResolver(options = {}) {
	registerInternalCorePackageNativeAliases(options);
	installResolver();
	return [...getPluginCache().sdk.native.aliases.keys()].toSorted();
}
//#endregion
//#region src/plugins/plugin-module-loader-cache.ts
/** Caches plugin module loaders and native-load stats for runtime/source module imports. */
const MAX_TRACKED_SOURCE_TRANSFORM_TARGETS = 24;
const pluginModuleLoaderStats = {
	calls: 0,
	nativeHits: 0,
	nativeMisses: 0,
	sourceTransformForced: 0,
	sourceTransformFallbacks: 0,
	sourceTransformTargets: /* @__PURE__ */ new Map()
};
function recordSourceTransformTarget(target) {
	const current = pluginModuleLoaderStats.sourceTransformTargets.get(target) ?? 0;
	pluginModuleLoaderStats.sourceTransformTargets.set(target, current + 1);
	if (pluginModuleLoaderStats.sourceTransformTargets.size <= MAX_TRACKED_SOURCE_TRANSFORM_TARGETS) return;
	const [leastUsedTarget] = [...pluginModuleLoaderStats.sourceTransformTargets].reduce((least, entry) => entry[1] < least[1] ? entry : least);
	pluginModuleLoaderStats.sourceTransformTargets.delete(leastUsedTarget);
}
/** Returns process-local plugin module loader stats for diagnostics and tests. */
function getPluginModuleLoaderStats() {
	const { sourceTransformTargets, ...stats } = pluginModuleLoaderStats;
	return {
		...stats,
		topSourceTransformTargets: [...sourceTransformTargets].toSorted((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])).slice(0, 8).map(([target, count]) => ({
			target,
			count
		}))
	};
}
function toSourceTransformImportPath(specifier) {
	if (process.platform === "win32" && path.isAbsolute(specifier)) return pathToFileURL(specifier).href;
	return toSafeImportPath(specifier);
}
function resolveAutomaticJitiTsconfig(loaderFilename) {
	const enabled = process.env.JITI_TSCONFIG_PATHS;
	if (enabled !== "1" && enabled !== "true") return;
	let directory = path.dirname(loaderFilename);
	while (true) {
		const config = path.join(directory, "tsconfig.json");
		if (fs.existsSync(config)) return config;
		const parent = path.dirname(directory);
		if (parent === directory) return;
		directory = parent;
	}
}
function createBunJitiImportCachePlugin(babel) {
	return { visitor: { Program: { exit(program) {
		const calls = [];
		program.traverse({ CallExpression(call) {
			if (call.node.callee.type === "Identifier" && call.node.callee.name === "jitiImport" && !call.scope.getBinding("jitiImport")) calls.push(call);
		} });
		if (calls.length === 0) return;
		const cache = program.scope.generateUidIdentifier("openclawJitiImports");
		const load = program.scope.generateUidIdentifier("openclawJitiImport");
		for (const call of calls) call.replaceWith(babel.types.callExpression(babel.types.identifier(load.name), call.node.arguments));
		program.unshiftContainer("body", babel.template.statements.ast(`
              var ${cache.name};
              function ${load.name}(specifier, ...args) {
                let entry = ${cache.name};
                while (entry) {
                  if (entry.specifier === specifier) {
                    return entry.pending;
                  }
                  entry = entry.next;
                }
                const pending = (async () => {
                  await 0;
                  return jitiImport(specifier, ...args);
                })();
                ${cache.name} = { specifier, pending, next: ${cache.name} };
                return pending;
              }
            `));
	} } } };
}
function preserveBunJitiDynamicImportResults(loader) {
	if (!process.versions.bun || typeof loader.options?.transform !== "function") return;
	const transform = loader.options.transform;
	loader.options.transform = (options) => transform({
		...options,
		babel: {
			...options.babel,
			plugins: [...Array.isArray(options.babel?.plugins) ? options.babel.plugins : [], createBunJitiImportCachePlugin]
		}
	});
}
function resolvePluginModuleLoaderCacheEntry(params) {
	const loaderFilename = toSafeImportPath(params.loaderFilename ?? params.modulePath);
	const tryNative = params.tryNative ?? resolvePluginLoaderTryNative(params.modulePath, params);
	const explicit = params.aliasMap ? { ...params.aliasMap } : void 0;
	const aliases = explicit ? {
		cacheKey: createPluginLoaderModuleCacheKey({
			tryNative,
			aliasMap: explicit
		}),
		getAliasMap: () => explicit,
		getSourceTransformAliasMap: () => explicit,
		resolveAlias: (specifier) => explicit[specifier]
	} : preparePluginLoaderAliases({
		modulePath: params.modulePath,
		argv1: params.argvEntry ?? process.argv[1],
		moduleUrl: params.importerUrl,
		devSourceRoot: params.devSourceRoot,
		pluginSdkResolution: params.pluginSdkResolution
	});
	const moduleConfigCacheKey = `${tryNative ? "native" : "transform"}\0${aliases.cacheKey}`;
	const lazyNativeAliasFallback = tryNative && typeof Module.registerHooks !== "function";
	const scopedCacheKey = `${loaderFilename}::${params.cacheScopeKey ? `${params.cacheScopeKey}::` : ""}${moduleConfigCacheKey}`;
	return {
		loaderFilename,
		getAliasMap: aliases.getAliasMap,
		resolveAlias: aliases.resolveAlias,
		tryNative,
		sourceTransformAliasMap: lazyNativeAliasFallback ? aliases.getSourceTransformAliasMap : void 0,
		scopedCacheKey
	};
}
function createPluginModuleLoader(params) {
	let loadWithSourceTransform;
	const getLoadWithSourceTransform = () => {
		if (loadWithSourceTransform) return loadWithSourceTransform;
		const aliasMap = params.sourceTransformAliasMap?.() ?? params.getAliasMap();
		const jitiOptions = buildPluginLoaderJitiOptions(aliasMap, { modulePath: params.loaderFilename });
		const automaticTsconfig = resolveAutomaticJitiTsconfig(params.loaderFilename);
		const jitiLoader = (params.createLoader ?? createJiti)(params.loaderFilename, {
			...jitiOptions,
			...automaticTsconfig ? { tsconfigPaths: automaticTsconfig } : {},
			virtualModules: new Proxy({}, {
				has(_target, key) {
					return typeof key === "string" && isPluginSdkAliasSpecifier(key) && Boolean(params.resolveAlias(key));
				},
				get(_target, key) {
					const target = typeof key === "string" ? params.resolveAlias(key) : void 0;
					if (!target) return;
					const native = tryNativeRequireModule(target, { aliasMap: params.resolveAlias });
					if (!native.ok) throw new Error(`Unable to load host Plugin SDK natively: ${target}. Use a supported native TypeScript loader for a source host, or rebuild the host SDK.`);
					return native.moduleExport;
				}
			}),
			tryNative: false
		});
		preserveBunJitiDynamicImportResults(jitiLoader);
		loadWithSourceTransform = (target) => jitiLoader(toSourceTransformImportPath(target));
		return loadWithSourceTransform;
	};
	return (target) => {
		const source = getPluginCacheSource(target, params.cache);
		const cached = source.variants.get(params.scopedCacheKey)?.exports;
		if (cached) return cached.value;
		const loaded = withPluginCache(params.cache, () => {
			pluginModuleLoaderStats.calls += 1;
			if (params.tryNative) {
				const native = tryNativeRequireJavaScriptModule(target, {
					aliasMap: params.resolveAlias,
					fallbackOnMissingDependency: true
				});
				if (native.ok) {
					pluginModuleLoaderStats.nativeHits += 1;
					return native.moduleExport;
				}
				pluginModuleLoaderStats.nativeMisses += 1;
				pluginModuleLoaderStats.sourceTransformFallbacks += 1;
			} else pluginModuleLoaderStats.sourceTransformForced += 1;
			recordSourceTransformTarget(target);
			return getLoadWithSourceTransform()(target);
		});
		source.variants.set(params.scopedCacheKey, { exports: { value: loaded } });
		return loaded;
	};
}
function getCachedPluginModuleLoader(params) {
	const cacheEntry = resolvePluginModuleLoaderCacheEntry(params);
	const cache = getPluginCache();
	const cached = cache.moduleLoaders.get(cacheEntry.scopedCacheKey);
	if (cached) return cached;
	installOpenClawInternalCorePackageNativeResolver({ moduleUrl: params.importerUrl });
	const loader = createPluginModuleLoader({
		...cacheEntry,
		cache,
		...params.createLoader ? { createLoader: params.createLoader } : {}
	});
	cache.moduleLoaders.set(cacheEntry.scopedCacheKey, loader);
	return loader;
}
function resolvePublicSurfaceInstance(params) {
	if (!isPathInside$1(params.boundaryRoot, params.modulePath) && !isPathInside$1(getPluginCacheRoot(params.boundaryRoot).rootDir, params.modulePath)) throw new Error(`Unable to open ${params.surfaceLabel}: outside ${params.boundaryLabel}`);
	const owner = resolvePluginRuntimeRecord(params);
	const instance = owner ? getPluginInstance(owner) : void 0;
	if ((owner?.origin ?? params.origin) === "bundled" && (owner?.status !== "loaded" || instance?.hasModuleSource(params.modulePath) === void 0)) return;
	if (!owner || owner.status !== "loaded") {
		if (getPluginRuntimeGatewayRequestScope()?.pluginRegistry) throw new Error(`Plugin public surface ${params.modulePath} has no active runtime owner.`);
		return;
	}
	if (!instance) throw new Error(`Plugin ${owner.id} has no runtime module owner`);
	return instance;
}
/** Validates an entry once per generation without changing its module export shape. */
function preparePluginModule(params) {
	const cache = getPluginCache();
	let source = getPluginCacheSource(params.modulePath, cache);
	const boundaryKey = `${getPluginCacheRoot(params.boundaryRoot).rootDir}\0${params.rejectHardlinks}`;
	if (source.validatedBoundaries.has(boundaryKey)) return {
		source,
		modulePath: source.modulePath ?? params.modulePath
	};
	const opened = openPluginRootFileSync({
		filePath: params.modulePath,
		rootPath: params.boundaryRoot,
		boundaryLabel: params.boundaryLabel,
		rejectHardlinks: params.rejectHardlinks
	});
	if (!opened.ok) throw new Error(`Unable to open ${params.surfaceLabel}`, { cause: opened.error });
	fs.closeSync(opened.fd);
	if (!sameFileIdentity(opened.stat, fs.statSync(opened.path))) throw new Error(`${params.surfaceLabel} changed after validation`);
	const root = bindPluginCacheRoot(params.boundaryRoot, opened.rootRealPath);
	root.publicSurfaceBoundary ??= {
		boundaryLabel: params.boundaryLabel,
		rejectHardlinks: params.rejectHardlinks
	};
	cache.sourceAliases.set(path.resolve(params.modulePath), opened.path);
	source = getPluginCacheSource(opened.path, cache);
	source.modulePath = opened.path;
	source.validatedBoundaries.add(`${opened.rootRealPath}\0${params.rejectHardlinks}`);
	return {
		source,
		modulePath: opened.path
	};
}
/** Public artifacts and SDK facades share one validated module, including circular imports. */
function loadPluginPublicSurfaceModuleSync(params) {
	const instance = resolvePublicSurfaceInstance(params);
	if (instance) return instance.loadModule(params.modulePath);
	const { source, modulePath } = preparePluginModule(params);
	const cached = source.publicSurface?.exports;
	if (cached) return cached;
	const sentinel = {};
	const boundaryRoot = getPluginCacheRoot(params.boundaryRoot).rootDir;
	source.disposeModule ??= () => clearPluginModuleRequireCache(modulePath, boundaryRoot);
	source.publicSurface = { exports: sentinel };
	try {
		Object.assign(sentinel, params.loadModule(modulePath));
		return sentinel;
	} catch (error) {
		delete source.publicSurface;
		source.validatedBoundaries.clear();
		throw error;
	}
}
//#endregion
export { installOpenClawInternalCorePackageNativeResolver as a, preparePluginModule as i, getPluginModuleLoaderStats as n, installOpenClawPluginSdkNativeResolver as o, loadPluginPublicSurfaceModuleSync as r, toSafeImportPath as s, getCachedPluginModuleLoader as t };

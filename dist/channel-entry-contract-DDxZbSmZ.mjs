import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-A1nT2dqa.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { l as tryNativeRequireJavaScriptModule } from "./native-module-require-CFiIAPP0.mjs";
import { s as toSafeImportPath, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { s as resolveLoaderPackageRoot, t as buildPluginLoaderAliasMap } from "./sdk-alias-DjyX8sAu.mjs";
import { l as emptyChannelConfigSchema } from "./config-schema-BJ55TtqJ.mjs";
import { n as formatPluginLoadProfileLine, r as shouldProfilePluginLoader, t as createProfiler } from "./plugin-load-profile-Bo_sVzOb.mjs";
import { t as createCachedLazyValueGetter } from "./lazy-value-B2wh8onO.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugin-sdk/channel-entry-contract.ts
const disableBundledEntrySourceFallbackEnv = "OPENCLAW_DISABLE_BUNDLED_ENTRY_SOURCE_FALLBACK";
function isBundledEntrySourceFallbackDisabled(value) {
	return value !== void 0 && !/^(?:0|false)$/iu.test(value.trim());
}
function resolveSpecifierCandidates(modulePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(modulePath));
	if (ext === ".js") return [modulePath, modulePath.slice(0, -3) + ".ts"];
	if (ext === ".mjs") return [modulePath, modulePath.slice(0, -4) + ".mts"];
	if (ext === ".cjs") return [modulePath, modulePath.slice(0, -4) + ".cts"];
	return [modulePath];
}
function resolveEntryBoundaryRoot(importMetaUrl) {
	return path.dirname(fileURLToPath(importMetaUrl));
}
function resolveBundledEntryBoundaryInfo(importMetaUrl) {
	const cacheKey = `${process.argv[1] ?? ""}\0${importMetaUrl}`;
	const entryBoundaryInfoCache = getPluginCacheRoot(resolveEntryBoundaryRoot(importMetaUrl)).entryBoundaries;
	const cached = entryBoundaryInfoCache.get(cacheKey);
	if (cached) return cached;
	const importerPath = fileURLToPath(importMetaUrl);
	const importerDir = path.dirname(importerPath);
	const info = {
		importerPath,
		importerDir,
		boundaryRoot: path.dirname(importerPath),
		packageRoot: resolveLoaderPackageRoot({
			modulePath: importerPath,
			moduleUrl: importMetaUrl,
			cwd: importerDir,
			argv1: process.argv[1]
		}) ?? null
	};
	entryBoundaryInfoCache.set(cacheKey, info);
	return info;
}
function addBundledEntryCandidates(candidates, basePath, boundaryRoot) {
	for (const candidate of resolveSpecifierCandidates(basePath)) {
		if (candidates.some((entry) => entry.path === candidate && entry.boundaryRoot === boundaryRoot)) continue;
		candidates.push({
			path: candidate,
			boundaryRoot
		});
	}
}
function resolveBundledEntryModuleCandidates(importMetaUrl, specifier) {
	const { importerPath, importerDir, boundaryRoot, packageRoot } = resolveBundledEntryBoundaryInfo(importMetaUrl);
	const candidates = [];
	addBundledEntryCandidates(candidates, path.resolve(importerDir, specifier), boundaryRoot);
	const sourceRelativeSpecifier = specifier.replace(/^\.\/src\//u, "./");
	if (sourceRelativeSpecifier !== specifier) addBundledEntryCandidates(candidates, path.resolve(importerDir, sourceRelativeSpecifier), boundaryRoot);
	if (!packageRoot) return candidates;
	const distExtensionsRoot = path.join(packageRoot, "dist", "extensions") + path.sep;
	if (!importerPath.startsWith(distExtensionsRoot)) return candidates;
	if (isBundledEntrySourceFallbackDisabled(process.env[disableBundledEntrySourceFallbackEnv])) return candidates;
	const pluginDirName = path.basename(importerDir);
	const sourcePluginRoot = path.join(packageRoot, "extensions", pluginDirName);
	if (sourcePluginRoot === boundaryRoot) return candidates;
	addBundledEntryCandidates(candidates, path.resolve(sourcePluginRoot, specifier), sourcePluginRoot);
	if (sourceRelativeSpecifier !== specifier) addBundledEntryCandidates(candidates, path.resolve(sourcePluginRoot, sourceRelativeSpecifier), sourcePluginRoot);
	return candidates;
}
function formatBundledEntryUnknownError(error) {
	if (typeof error === "string") return error;
	if (error === void 0) return "boundary validation failed";
	try {
		return JSON.stringify(error);
	} catch {
		return "non-serializable error";
	}
}
function formatBundledEntryModuleOpenFailure(params) {
	const importerPath = fileURLToPath(params.importMetaUrl);
	const errorDetail = params.failure.error instanceof Error ? params.failure.error.message : formatBundledEntryUnknownError(params.failure.error);
	return [
		`bundled plugin entry "${params.specifier}" failed to open`,
		`from "${importerPath}"`,
		`(resolved "${params.resolvedPath}", plugin root "${params.boundaryRoot}",`,
		`reason "${params.failure.reason}"): ${errorDetail}`
	].join(" ");
}
function createBundledEntryModulePathCacheKey(importMetaUrl, specifier) {
	return `${isBundledEntrySourceFallbackDisabled(process.env[disableBundledEntrySourceFallbackEnv]) ? "1" : "0"}\0${importMetaUrl}\0${specifier}`;
}
function resolveBundledEntryModulePath(importMetaUrl, specifier) {
	const cacheKey = createBundledEntryModulePathCacheKey(importMetaUrl, specifier);
	const resolvedModulePaths = getPluginCacheRoot(resolveEntryBoundaryRoot(importMetaUrl)).entryPaths;
	const cached = resolvedModulePaths.get(cacheKey);
	if (cached) {
		if ("error" in cached) throw cached.error;
		return cached.path;
	}
	const candidates = resolveBundledEntryModuleCandidates(importMetaUrl, specifier);
	const fallbackCandidate = candidates[0] ?? {
		path: path.resolve(path.dirname(fileURLToPath(importMetaUrl)), specifier),
		boundaryRoot: resolveEntryBoundaryRoot(importMetaUrl)
	};
	let firstFailure = null;
	for (const candidate of candidates) {
		const opened = openRootFileSync({
			absolutePath: candidate.path,
			rootPath: candidate.boundaryRoot,
			boundaryLabel: "plugin root",
			rejectHardlinks: false,
			skipLexicalRootCheck: true
		});
		if (opened.ok) {
			fs.closeSync(opened.fd);
			resolvedModulePaths.set(cacheKey, { path: opened.path });
			return opened.path;
		}
		firstFailure ??= {
			candidate,
			failure: opened
		};
	}
	const failure = firstFailure;
	if (!failure) throw new Error(formatBundledEntryModuleOpenFailure({
		importMetaUrl,
		specifier,
		resolvedPath: fallbackCandidate.path,
		boundaryRoot: fallbackCandidate.boundaryRoot,
		failure: {
			ok: false,
			reason: "path",
			error: /* @__PURE__ */ new Error(`ENOENT: no such file or directory, lstat '${fallbackCandidate.path}'`)
		}
	}));
	const error = new Error(formatBundledEntryModuleOpenFailure({
		importMetaUrl,
		specifier,
		resolvedPath: failure.candidate.path,
		boundaryRoot: failure.candidate.boundaryRoot,
		failure: failure.failure
	}));
	resolvedModulePaths.set(cacheKey, { error });
	throw error;
}
function getSourceModuleLoader(modulePath, options) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url,
		...options.createLoaderForTest ? { createLoader: options.createLoaderForTest } : {},
		tryNative: false
	});
}
function canTryNodeRequireBuiltModule(modulePath) {
	return (modulePath.includes(`${path.sep}dist${path.sep}`) || modulePath.includes(`${path.sep}dist-runtime${path.sep}`)) && [
		".js",
		".mjs",
		".cjs"
	].includes(normalizeLowercaseStringOrEmpty(path.extname(modulePath)));
}
function loadBundledEntryModuleSync(importMetaUrl, specifier, options = {}) {
	const modulePath = resolveBundledEntryModulePath(importMetaUrl, specifier);
	const instance = pluginInstanceInvocation.getStore()?.instance;
	const captured = instance?.hasModuleSource(modulePath);
	if (captured === false) throw new Error(`Bundled companion is outside the plugin's captured module graph: ${modulePath}`);
	if (instance && captured) return instance.loadModule(modulePath);
	const source = getPluginCacheSource(modulePath);
	const cached = source.variants.get("bundled-entry")?.exports;
	if (cached) return cached.value;
	let loaded;
	const profile = shouldProfilePluginLoader();
	const loadStartMs = profile ? performance.now() : 0;
	let sourceLoaderReadyMs = 0;
	if (canTryNodeRequireBuiltModule(modulePath)) {
		const native = tryNativeRequireJavaScriptModule(modulePath, {
			aliasMap: buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url),
			fallbackOnMissingDependency: true
		});
		if (native.ok) loaded = native.moduleExport;
		else {
			const moduleLoader = getSourceModuleLoader(modulePath, options);
			sourceLoaderReadyMs = profile ? performance.now() : 0;
			loaded = moduleLoader(toSafeImportPath(modulePath));
		}
	} else {
		const moduleLoader = getSourceModuleLoader(modulePath, options);
		sourceLoaderReadyMs = profile ? performance.now() : 0;
		loaded = moduleLoader(toSafeImportPath(modulePath));
	}
	if (profile) {
		const endMs = performance.now();
		console.error(formatPluginLoadProfileLine({
			phase: "bundled-entry-module-load",
			pluginId: "(bundled-entry)",
			source: modulePath,
			elapsedMs: endMs - loadStartMs,
			extras: [["sourceLoaderCreateMs", sourceLoaderReadyMs ? sourceLoaderReadyMs - loadStartMs : 0], ["sourceLoaderCallMs", sourceLoaderReadyMs ? endMs - sourceLoaderReadyMs : 0]]
		}));
	}
	source.variants.set("bundled-entry", { exports: { value: loaded } });
	return loaded;
}
/** Loads one export from a bundled channel sidecar module through the guarded entry boundary. */
function loadBundledEntryExportSync(importMetaUrl, reference, options) {
	const loaded = loadBundledEntryModuleSync(importMetaUrl, reference.specifier, options);
	const resolved = loaded && typeof loaded === "object" && "default" in loaded ? loaded.default : loaded;
	if (!reference.exportName) return resolved;
	const record = resolved ?? loaded;
	if (!record || !(reference.exportName in record)) throw new Error(`missing export "${reference.exportName}" from bundled entry module ${reference.specifier}`);
	return record[reference.exportName];
}
/** Defines the full bundled channel entry contract used by core plugin registration. */
function defineBundledChannelEntry({ id, name, description, importMetaUrl, plugin, outbound, secrets, configSchema, runtime, accountInspect, features, registerCliMetadata, registerFull, registerCapabilities }) {
	const getConfigSchema = createCachedLazyValueGetter(configSchema ?? emptyChannelConfigSchema);
	const loadChannelPlugin = (options) => loadBundledEntryExportSync(importMetaUrl, plugin, options);
	const loadChannelOutbound = outbound ? (options) => loadBundledEntryExportSync(importMetaUrl, outbound, options) : void 0;
	const loadChannelSecrets = secrets ? (options) => loadBundledEntryExportSync(importMetaUrl, secrets, options) : void 0;
	const loadChannelAccountInspector = accountInspect ? (options) => loadBundledEntryExportSync(importMetaUrl, accountInspect, options) : void 0;
	const setChannelRuntime = runtime ? (pluginRuntime) => {
		loadBundledEntryExportSync(importMetaUrl, runtime)(pluginRuntime);
	} : void 0;
	return {
		kind: "bundled-channel-entry",
		id,
		name,
		description,
		get configSchema() {
			return getConfigSchema();
		},
		...features || accountInspect ? { features: {
			...features,
			...accountInspect ? { accountInspect: true } : {}
		} } : {},
		register(api) {
			if (api.registrationMode === "cli-metadata") {
				registerCliMetadata?.(api);
				return;
			}
			if (api.registrationMode === "tool-discovery") {
				const profile = createProfiler({
					pluginId: id,
					source: importMetaUrl
				});
				profile("bundled-register:registerFull", () => registerFull?.(api));
				profile("bundled-register:registerCapabilities", () => registerCapabilities?.(api));
				return;
			}
			const profile = createProfiler({
				pluginId: id,
				source: importMetaUrl
			});
			const channelPlugin = profile("bundled-register:loadChannelPlugin", loadChannelPlugin);
			profile("bundled-register:registerChannel", () => api.registerChannel({ plugin: channelPlugin }));
			profile("bundled-register:setChannelRuntime", () => setChannelRuntime?.(api.runtime));
			if (api.registrationMode === "discovery") {
				profile("bundled-register:registerCliMetadata", () => registerCliMetadata?.(api));
				profile("bundled-register:registerCapabilities", () => registerCapabilities?.(api));
				return;
			}
			if (api.registrationMode !== "full") return;
			profile("bundled-register:registerCliMetadata", () => registerCliMetadata?.(api));
			profile("bundled-register:registerFull", () => registerFull?.(api));
			profile("bundled-register:registerCapabilities", () => registerCapabilities?.(api));
		},
		loadChannelPlugin,
		...loadChannelOutbound ? { loadChannelOutbound } : {},
		...loadChannelSecrets ? { loadChannelSecrets } : {},
		...loadChannelAccountInspector ? { loadChannelAccountInspector } : {},
		...setChannelRuntime ? { setChannelRuntime } : {}
	};
}
/** Defines the setup-only bundled channel entry contract for onboarding and migration surfaces. */
function defineBundledChannelSetupEntry({ importMetaUrl, plugin, secrets, runtime, legacyStateMigrations, legacySessionSurface, registerSetupRuntime, features }) {
	const setChannelRuntime = runtime ? (pluginRuntime) => {
		loadBundledEntryExportSync(importMetaUrl, runtime)(pluginRuntime);
	} : void 0;
	const loadLegacyStateMigrationDetector = legacyStateMigrations ? (options) => loadBundledEntryExportSync(importMetaUrl, legacyStateMigrations, options) : void 0;
	const loadLegacySessionSurface = legacySessionSurface ? (options) => loadBundledEntryExportSync(importMetaUrl, legacySessionSurface, options) : void 0;
	return {
		kind: "bundled-channel-setup-entry",
		loadSetupPlugin: (options) => loadBundledEntryExportSync(importMetaUrl, plugin, options),
		...secrets ? { loadSetupSecrets: (options) => loadBundledEntryExportSync(importMetaUrl, secrets, options) } : {},
		...loadLegacyStateMigrationDetector ? { loadLegacyStateMigrationDetector } : {},
		...loadLegacySessionSurface ? { loadLegacySessionSurface } : {},
		...setChannelRuntime ? { setChannelRuntime } : {},
		...registerSetupRuntime ? { registerSetupRuntime } : {},
		...features ? { features } : {}
	};
}
//#endregion
export { defineBundledChannelSetupEntry as n, loadBundledEntryExportSync as r, defineBundledChannelEntry as t };

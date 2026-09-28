import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as loadPluginPublicSurfaceModuleSync, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { i as getPluginValueInstance, t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { f as readPluginCacheFile, o as parsePluginCacheJson } from "./package-manifest-C8sTeZKW.mjs";
import { s as resolveBundledPluginsDir, t as areBundledPluginsDisabled } from "./bundled-dir-BGJkK8G5.mjs";
import { s as resolveLoaderPackageRoot } from "./sdk-alias-DjyX8sAu.mjs";
import { i as resolvePluginRootPublicSurfacePath, n as resolveBundledPluginPublicSurfacePath, r as resolveBundledPluginSourcePublicSurfacePath } from "./public-surface-runtime-B_fTpq__.mjs";
import { t as normalizeManifestPlatforms } from "./manifest-platforms-Db0IXKaU.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugin-sdk/facade-resolution-shared.ts
/**
* Shared resolver for bundled plugin facade module paths and registry fallbacks.
*/
const RUNTIME_FACADE_MATCH_TIERS = [
	"id",
	"folder",
	"channel"
];
/** An executing instance wins over metadata and bundled fallbacks, including a missing surface. */
function resolveRuntimeFacadeModuleLocation(params) {
	if (params.env !== void 0 && params.env !== process.env) return;
	const records = getPluginRegistryForContext()?.plugins;
	if (!records) return;
	let owner;
	for (const tier of RUNTIME_FACADE_MATCH_TIERS) {
		for (const record of records) {
			if (record.status !== "loaded" || !record.rootDir) continue;
			if (!(tier === "id" ? record.id === params.dirName : tier === "folder" ? path.basename(record.rootDir) === params.dirName : record.channelIds.includes(params.dirName))) continue;
			if (owner) throw new Error(`Plugin public surface ${params.dirName} has ambiguous runtime ownership; use its plugin id.`);
			owner = record;
		}
		if (owner) break;
	}
	if (!owner) return;
	const modulePath = resolvePluginRootPublicSurfacePath({
		pluginRoot: owner.rootDir,
		pluginId: owner.id,
		artifactBasename: params.artifactBasename
	});
	return modulePath ? {
		modulePath,
		boundaryRoot: owner.rootDir,
		pluginId: owner.id,
		origin: owner.origin
	} : null;
}
function readBundledPluginManifestRecordFromDir(rootDir) {
	const file = readPluginCacheFile({
		rootDir,
		relativePath: "openclaw.plugin.json",
		rejectHardlinks: false
	});
	if (!file.ok) return null;
	try {
		const parsed = parsePluginCacheJson(file, { json5: true });
		if (!parsed.ok || !isRecord(parsed.value)) return null;
		const raw = parsed.value;
		const id = normalizeOptionalString(raw.id);
		if (!id) return null;
		return {
			id,
			origin: "bundled",
			enabledByDefault: raw.enabledByDefault === true,
			enabledByDefaultOnPlatforms: normalizeManifestPlatforms(raw.enabledByDefaultOnPlatforms),
			rootDir,
			channels: normalizeTrimmedStringList(raw.channels)
		};
	} catch {
		return null;
	}
}
/** Resolve bundled facade metadata without importing activation or registry runtime. */
function resolveBundledMetadataManifestRecord(params) {
	if (!params.location) return null;
	let pluginsRoot = params.sourceExtensionsRoot;
	if (!params.location.modulePath.startsWith(`${pluginsRoot}${path.sep}`)) {
		const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
		if (!bundledPluginsDir) return null;
		pluginsRoot = path.resolve(bundledPluginsDir);
		if (!params.location.modulePath.startsWith(`${pluginsRoot}${path.sep}`)) return null;
	}
	const resolvedDirName = path.relative(pluginsRoot, params.location.modulePath).split(path.sep)[0];
	return resolvedDirName ? readBundledPluginManifestRecordFromDir(path.join(pluginsRoot, resolvedDirName)) : null;
}
/** Builds the cache key for one facade lookup under the current bundled-plugin mode. */
function createFacadeResolutionKey(params) {
	const disabledKey = areBundledPluginsDisabled(params.env ?? process.env) ? "disabled" : "enabled";
	return `${params.dirName}::${params.artifactBasename}::${params.bundledPluginsDir ? path.resolve(params.bundledPluginsDir) : "<default>"}::${disabledKey}`;
}
/** Chooses the boundary root that should constrain a resolved facade module. */
function resolveFacadeBoundaryRoot(params) {
	if (!params.bundledPluginsDir) return params.packageRoot;
	const resolvedBundledPluginsDir = path.resolve(params.bundledPluginsDir);
	return params.modulePath.startsWith(`${resolvedBundledPluginsDir}${path.sep}`) ? resolvedBundledPluginsDir : params.packageRoot;
}
/** Resolves a bundled facade from source in dev and built artifacts in dist installs. */
function resolveBundledFacadeModuleLocation(params) {
	const env = params.env ?? process.env;
	if (areBundledPluginsDisabled(env)) return null;
	const preferSource = params.preferSource ?? !params.currentModulePath.includes(`${path.sep}dist${path.sep}`);
	const packageSourceRoot = path.resolve(params.packageRoot, "extensions");
	const publicSurfaceParams = {
		rootDir: params.packageRoot,
		env: params.env,
		...params.bundledPluginsDir ? {
			bundledPluginsDir: params.bundledPluginsDir,
			bundledPluginsDirMode: "explicit"
		} : {},
		dirName: params.dirName,
		artifactBasename: params.artifactBasename
	};
	const modulePath = preferSource ? resolveBundledPluginSourcePublicSurfacePath({
		dirName: params.dirName,
		artifactBasename: params.artifactBasename,
		sourceRoot: params.bundledPluginsDir ?? packageSourceRoot
	}) ?? (params.bundledPluginsDir && !areBundledPluginsDisabled(env) ? resolveBundledPluginSourcePublicSurfacePath({
		dirName: params.dirName,
		artifactBasename: params.artifactBasename,
		sourceRoot: packageSourceRoot
	}) : null) ?? resolveBundledPluginPublicSurfacePath(publicSurfaceParams) : resolveBundledPluginPublicSurfacePath(publicSurfaceParams);
	return modulePath ? {
		origin: "bundled",
		modulePath,
		boundaryRoot: resolveFacadeBoundaryRoot({
			modulePath,
			bundledPluginsDir: params.bundledPluginsDir,
			packageRoot: params.packageRoot
		})
	} : null;
}
/** Resolves a facade path from manifest registry records using id, folder, then channel matches. */
function resolveRegistryPluginModuleLocationFromRecords(params) {
	const tiers = [
		(plugin) => plugin.id === params.dirName,
		(plugin) => path.basename(plugin.rootDir) === params.dirName,
		(plugin) => plugin.channels.includes(params.dirName)
	];
	for (const matchFn of tiers) for (const record of params.registry.filter(matchFn)) {
		const rootDir = path.resolve(record.rootDir);
		const modulePath = resolvePluginRootPublicSurfacePath({
			pluginRoot: rootDir,
			pluginId: record.id,
			artifactBasename: params.artifactBasename
		});
		if (modulePath) return {
			modulePath,
			boundaryRoot: rootDir,
			...record.origin ? { origin: record.origin } : {}
		};
	}
	return null;
}
//#endregion
//#region src/plugin-sdk/facade-loader.ts
/** Error thrown when a bundled plugin public surface artifact cannot be resolved. */
var MissingPublicSurfaceError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "MissingPublicSurfaceError";
	}
};
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const loadedFacadePluginIds = /* @__PURE__ */ new Set();
function getOpenClawPackageRoot() {
	return resolveLoaderPackageRoot({
		modulePath: fileURLToPath(import.meta.url),
		moduleUrl: import.meta.url
	}) ?? fileURLToPath(new URL("../..", import.meta.url));
}
function resolveBundledPublicSurfaceLocation(params) {
	const runtime = resolveRuntimeFacadeModuleLocation(params);
	if (runtime !== void 0) return runtime;
	const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
	const key = `facade:${params.preferSource ?? "auto"}:${createFacadeResolutionKey({
		...params,
		bundledPluginsDir
	})}`;
	const artifacts = getPluginCacheRoot(getOpenClawPackageRoot()).artifacts;
	const cached = artifacts.get(key);
	if (cached !== void 0) return cached;
	const location = resolveBundledFacadeModuleLocation({
		...params,
		currentModulePath: CURRENT_MODULE_PATH,
		packageRoot: getOpenClawPackageRoot(),
		bundledPluginsDir
	});
	artifacts.set(key, location);
	return location;
}
function getModuleLoader(modulePath) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		preferBuiltDist: true,
		loaderFilename: import.meta.url
	});
}
/** Create a lazy object view over a library or the current managed facade. */
function createLazyFacadeObjectValue(load) {
	let resolvedValue;
	let managedPluginId;
	const resolve = () => {
		if (managedPluginId) {
			const current = getPluginRegistryForContext()?.plugins.find((entry) => entry.id === managedPluginId);
			if (current?.status !== "loaded" || !getPluginInstance(current)) throw new Error(`Plugin ${managedPluginId} was disabled or uninstalled; its facade is unavailable.`);
		}
		const value = resolvedValue ?? load();
		managedPluginId ??= getPluginValueInstance(value)?.pluginId;
		if (!managedPluginId) resolvedValue = value;
		return value;
	};
	const target = {};
	const syncProperty = (property) => {
		const descriptor = Reflect.getOwnPropertyDescriptor(resolve(), property);
		if (descriptor) {
			if (managedPluginId) descriptor.configurable = true;
			Object.defineProperty(target, property, descriptor);
		} else Reflect.deleteProperty(target, property);
		return descriptor;
	};
	const syncTarget = () => {
		const original = resolve();
		const descriptors = Object.getOwnPropertyDescriptors(original);
		if (managedPluginId) for (const property of Reflect.ownKeys(descriptors)) Reflect.set(Reflect.get(descriptors, property), "configurable", true);
		for (const property of Reflect.ownKeys(target)) if (!Object.hasOwn(descriptors, property)) Reflect.deleteProperty(target, property);
		Object.defineProperties(target, descriptors);
		Reflect.setPrototypeOf(target, Reflect.getPrototypeOf(original));
		if (!Reflect.isExtensible(original)) Reflect.preventExtensions(target);
	};
	return new Proxy(target, {
		defineProperty(_target, property, descriptor) {
			const original = resolve();
			if (managedPluginId && (descriptor.configurable === false || descriptor.configurable !== true && !Object.hasOwn(original, property))) return false;
			const defined = Reflect.defineProperty(original, property, descriptor);
			if (defined) syncProperty(property);
			return defined;
		},
		deleteProperty(_target, property) {
			return Reflect.deleteProperty(resolve(), property) && Reflect.deleteProperty(target, property);
		},
		get(_target, property, receiver) {
			return Reflect.get(resolve(), property, receiver);
		},
		getOwnPropertyDescriptor(_target, property) {
			return syncProperty(property);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(resolve());
		},
		has(_target, property) {
			const present = Reflect.has(resolve(), property);
			if (!present) Reflect.deleteProperty(target, property);
			return present;
		},
		isExtensible() {
			const extensible = Reflect.isExtensible(resolve());
			if (!extensible) syncTarget();
			return extensible;
		},
		ownKeys() {
			syncTarget();
			return Reflect.ownKeys(resolve());
		},
		preventExtensions() {
			const original = resolve();
			if (managedPluginId || !Reflect.preventExtensions(original)) return false;
			syncTarget();
			return true;
		},
		set(_target, property, value, receiver) {
			return Reflect.set(resolve(), property, value, receiver);
		},
		setPrototypeOf(_target, prototype) {
			return Reflect.setPrototypeOf(resolve(), prototype) && Reflect.setPrototypeOf(target, prototype);
		}
	});
}
function trackFacadeModule(modulePath, pluginId) {
	const source = getPluginCacheSource(modulePath);
	if (source.facadeTracked) return;
	source.facadeTracked = true;
	try {
		loadedFacadePluginIds.add(typeof pluginId === "function" ? pluginId() : pluginId);
	} catch (error) {
		delete source.facadeTracked;
		throw error;
	}
}
function isPathAtOrInside(target, root) {
	const resolvedRoot = path.resolve(root);
	const resolvedTarget = path.resolve(target);
	return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}
function resolveFacadeBoundaryOpenParams(boundaryRoot) {
	const checked = getPluginCacheRoot(boundaryRoot).publicSurfaceBoundary;
	if (checked) return checked;
	if (isPathAtOrInside(boundaryRoot, getOpenClawPackageRoot())) return {
		boundaryLabel: "OpenClaw package root",
		rejectHardlinks: false
	};
	const bundledDir = resolveBundledPluginsDir();
	if (bundledDir && isPathAtOrInside(boundaryRoot, bundledDir)) return {
		boundaryLabel: "bundled plugin directory",
		rejectHardlinks: false
	};
	return {
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: "global",
			rootDir: boundaryRoot
		})
	};
}
/** Load and cache a facade module after verifying it is inside its declared boundary root. */
function loadFacadeModuleAtLocationSync(params) {
	const location = params.location;
	const loaded = loadPluginPublicSurfaceModuleSync({
		...location,
		...params.boundary ?? resolveFacadeBoundaryOpenParams(location.boundaryRoot),
		surfaceLabel: params.surfaceLabel ?? `bundled plugin public surface ${location.modulePath}`,
		pluginId: params.pluginId ?? location.pluginId,
		loadModule: params.loadModule ?? ((modulePath) => getModuleLoader(modulePath)(modulePath))
	});
	if (params.trackedPluginId !== void 0) trackFacadeModule(location.modulePath, params.trackedPluginId);
	return loaded;
}
/** Resolve and synchronously load a bundled plugin public surface by plugin dir and artifact name. */
function loadBundledPluginPublicSurfaceModuleSyncCore(params) {
	const location = resolveBundledPublicSurfaceLocation(params);
	if (!location) throw new MissingPublicSurfaceError(`Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`);
	return loadFacadeModuleAtLocationSync({
		location,
		trackedPluginId: params.trackedPluginId ?? params.dirName
	});
}
/** List plugin ids whose public facades have been loaded in this process. */
function listImportedBundledPluginFacadeIds() {
	return [...loadedFacadePluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { loadFacadeModuleAtLocationSync as a, resolveBundledMetadataManifestRecord as c, loadBundledPluginPublicSurfaceModuleSyncCore as i, resolveRegistryPluginModuleLocationFromRecords as l, createLazyFacadeObjectValue as n, resolveBundledPublicSurfaceLocation as o, listImportedBundledPluginFacadeIds as r, createFacadeResolutionKey as s, MissingPublicSurfaceError as t, resolveRuntimeFacadeModuleLocation as u };

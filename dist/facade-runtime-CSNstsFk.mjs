import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-A1nT2dqa.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as isPluginSourceModulePath, u as tryNativeRequireModule } from "./native-module-require-CFiIAPP0.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { s as resolveBundledPluginsDir, t as areBundledPluginsDisabled } from "./bundled-dir-BGJkK8G5.mjs";
import { s as resolveLoaderPackageRoot } from "./sdk-alias-DjyX8sAu.mjs";
import { a as loadFacadeModuleAtLocationSync, c as resolveBundledMetadataManifestRecord, i as loadBundledPluginPublicSurfaceModuleSyncCore, o as resolveBundledPublicSurfaceLocation, s as createFacadeResolutionKey$1, u as resolveRuntimeFacadeModuleLocation } from "./facade-loader-BWw5NpKt.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugin-sdk/facade-runtime.ts
const OPENCLAW_PACKAGE_ROOT = resolveLoaderPackageRoot({
	modulePath: fileURLToPath(import.meta.url),
	moduleUrl: import.meta.url
}) ?? fileURLToPath(new URL("../..", import.meta.url));
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const OPENCLAW_SOURCE_EXTENSIONS_ROOT = path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions");
function createFacadeResolutionKey(params) {
	return createFacadeResolutionKey$1({
		...params,
		bundledPluginsDir: resolveBundledPluginsDir(params.env ?? process.env)
	});
}
function resolveFacadeModuleLocationUncached(params) {
	const env = params.env ?? process.env;
	if (!areBundledPluginsDisabled(env)) {
		const bundledLocation = resolveBundledPublicSurfaceLocation(params);
		if (bundledLocation) return bundledLocation;
	}
	return loadFacadeActivationCheckRuntime().resolveRegistryPluginModuleLocation(params);
}
function resolveFacadeModuleLocation(params) {
	const runtime = resolveRuntimeFacadeModuleLocation(params);
	if (runtime !== void 0) return runtime;
	if (params.env !== void 0 && params.env !== process.env) return resolveFacadeModuleLocationUncached(params);
	const resolutionKey = `facade-registry:${createFacadeResolutionKey(params)}`;
	const artifacts = getPluginCacheRoot(OPENCLAW_PACKAGE_ROOT).artifacts;
	const cached = artifacts.get(resolutionKey);
	if (cached !== void 0) return cached;
	const location = resolveFacadeModuleLocationUncached(params);
	artifacts.set(resolutionKey, location);
	return location;
}
function getFacadeActivationCheckRuntimeModule() {
	return getPluginCacheSource(CURRENT_MODULE_PATH).variants.get("activation-runtime")?.exports?.value;
}
function setFacadeActivationCheckRuntimeModule(module) {
	getPluginCacheSource(CURRENT_MODULE_PATH).variants.set("activation-runtime", { exports: { value: module } });
}
function throwFacadeActivationCheckRuntimeUnavailable(cause) {
	throw new Error("Unable to load facade activation check runtime", { cause });
}
function loadFacadeActivationCheckRuntime() {
	const cached = getFacadeActivationCheckRuntimeModule();
	if (cached) return cached;
	try {
		const modulePath = fileURLToPath(new URL(isPluginSourceModulePath(CURRENT_MODULE_PATH) ? "./facade-activation-check.runtime.ts" : "./facade-activation-check.runtime.js", import.meta.url));
		const native = tryNativeRequireModule(modulePath);
		if (!native.ok) throw new Error(`Host facade activation runtime requires native loading: ${modulePath}`);
		const loaded = native.moduleExport;
		setFacadeActivationCheckRuntimeModule(loaded);
		return loaded;
	} catch (error) {
		return throwFacadeActivationCheckRuntimeUnavailable(error);
	}
}
async function loadFacadeActivationCheckRuntimeAsync() {
	const module = getFacadeActivationCheckRuntimeModule() ?? await import("./facade-activation-check.runtime.js");
	setFacadeActivationCheckRuntimeModule(module);
	return module;
}
function buildFacadeActivationCheckParams(params, location = resolveFacadeModuleLocation(params)) {
	return {
		...params,
		location,
		sourceExtensionsRoot: OPENCLAW_SOURCE_EXTENSIONS_ROOT
	};
}
/** Load a bundled or registry-backed plugin public surface, tracking activation ownership. */
function loadBundledPluginPublicSurfaceModuleSync(params) {
	const location = resolveFacadeModuleLocation(params);
	const trackingParams = buildFacadeActivationCheckParams(params, location);
	const trackedPluginId = () => resolveBundledMetadataManifestRecord(trackingParams)?.id ?? loadFacadeActivationCheckRuntime().resolveTrackedFacadePluginId(trackingParams);
	if (!location) return loadBundledPluginPublicSurfaceModuleSyncCore({
		...params,
		trackedPluginId
	});
	return loadFacadeModuleAtLocationSync({
		location,
		trackedPluginId
	});
}
function wrapActivatedSurface(pluginId, loaded) {
	const owner = getPluginRegistryForContext()?.plugins.find((entry) => entry.id === pluginId);
	return owner ? getPluginInstance(owner)?.wrap(loaded) ?? loaded : loaded;
}
/** Load an activated plugin public surface or throw when activation policy blocks access. */
function loadActivatedBundledPluginPublicSurfaceModuleSync(params) {
	return wrapActivatedSurface(loadFacadeActivationCheckRuntime().resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(buildFacadeActivationCheckParams(params)).pluginId, loadBundledPluginPublicSurfaceModuleSync(params));
}
/** Load activation asynchronously; allowed public artifacts still use the synchronous loader. */
async function loadActivatedBundledPluginPublicSurfaceModule(params) {
	await loadFacadeActivationCheckRuntimeAsync().catch(throwFacadeActivationCheckRuntimeUnavailable);
	return loadActivatedBundledPluginPublicSurfaceModuleSync(params);
}
/** Load an activated plugin public surface, returning null when activation policy blocks access. */
function tryLoadActivatedBundledPluginPublicSurfaceModuleSync(params) {
	const access = loadFacadeActivationCheckRuntime().resolveBundledPluginPublicSurfaceAccess(buildFacadeActivationCheckParams(params));
	if (!access.allowed) return null;
	return wrapActivatedSurface(access.pluginId, loadBundledPluginPublicSurfaceModuleSync(params));
}
/** Async variant of tryLoadActivatedBundledPluginPublicSurfaceModuleSync for async call sites. */
async function tryLoadActivatedBundledPluginPublicSurfaceModule(params) {
	await loadFacadeActivationCheckRuntimeAsync();
	return tryLoadActivatedBundledPluginPublicSurfaceModuleSync(params);
}
//#endregion
export { tryLoadActivatedBundledPluginPublicSurfaceModuleSync as a, tryLoadActivatedBundledPluginPublicSurfaceModule as i, loadActivatedBundledPluginPublicSurfaceModuleSync as n, loadBundledPluginPublicSurfaceModuleSync as r, loadActivatedBundledPluginPublicSurfaceModule as t };

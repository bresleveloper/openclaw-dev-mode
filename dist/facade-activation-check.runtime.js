import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig, n as createPluginActivationSource } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { c as resolveBundledMetadataManifestRecord, l as resolveRegistryPluginModuleLocationFromRecords } from "./facade-loader-BWw5NpKt.mjs";
import { s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { i as configMayNeedPluginAutoEnable, t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import fs from "node:fs";
import path from "node:path";
//#endregion
//#region src/plugin-sdk/facade-activation-check.runtime.ts
/**
* Runtime boundary checks for bundled plugin public-surface facade imports.
*/
const ALWAYS_ALLOWED_RUNTIME_DIR_NAME_SET = /* @__PURE__ */ new Set(["image-generation-core"]);
const EMPTY_FACADE_BOUNDARY_CONFIG = {};
function readFacadeBoundaryConfigSafely() {
	try {
		const sourceSnapshot = getRuntimeConfigSourceSnapshot();
		if (sourceSnapshot) return sourceSnapshot;
		const runtimeSnapshot = getRuntimeConfigSnapshot();
		if (runtimeSnapshot) return runtimeSnapshot;
		const configPath = resolveConfigPath();
		if (!fs.existsSync(configPath)) return EMPTY_FACADE_BOUNDARY_CONFIG;
		const raw = fs.readFileSync(configPath, "utf8");
		const parsed = parseJsonWithJson5Fallback(raw);
		return parsed && typeof parsed === "object" ? parsed : EMPTY_FACADE_BOUNDARY_CONFIG;
	} catch {
		return EMPTY_FACADE_BOUNDARY_CONFIG;
	}
}
function getFacadeBoundaryResolvedConfig() {
	const rawConfig = readFacadeBoundaryConfigSafely();
	const autoEnabled = configMayNeedPluginAutoEnable(rawConfig, process.env) ? applyPluginAutoEnable({
		config: rawConfig,
		env: process.env
	}) : {
		config: rawConfig,
		autoEnabledReasons: {}
	};
	const config = autoEnabled.config;
	return {
		rawConfig,
		config,
		normalizedPluginsConfig: normalizePluginsConfig(config?.plugins),
		activationSource: createPluginActivationSource({ config: rawConfig }),
		autoEnabledReasons: autoEnabled.autoEnabledReasons
	};
}
function getFacadeManifestRegistry(params) {
	const envOption = params.env ? { env: params.env } : {};
	const resolved = getFacadeBoundaryResolvedConfig();
	return resolvePluginMetadataSnapshot({
		config: resolved.config,
		...envOption,
		allowWorkspaceScopedCurrent: true
	}).manifestRegistry.plugins;
}
/** Resolves the concrete plugin module location recorded in the manifest registry. */
function resolveRegistryPluginModuleLocation(params) {
	const registry = getFacadeManifestRegistry(params.env ? { env: params.env } : {});
	return resolveRegistryPluginModuleLocationFromRecords({
		registry,
		dirName: params.dirName,
		artifactBasename: params.artifactBasename
	});
}
function resolveBundledPluginManifestRecord(params) {
	const metadataRecord = resolveBundledMetadataManifestRecord(params);
	if (metadataRecord) return metadataRecord;
	const registry = getFacadeManifestRegistry(params.env ? { env: params.env } : {});
	return (params.location ? registry.find((plugin) => {
		const normalizedRootDir = path.resolve(plugin.rootDir);
		const normalizedModulePath = path.resolve(params.location.modulePath);
		return normalizedModulePath === normalizedRootDir || normalizedModulePath.startsWith(`${normalizedRootDir}${path.sep}`);
	}) : null) ?? registry.find((plugin) => plugin.id === params.dirName) ?? registry.find((plugin) => path.basename(plugin.rootDir) === params.dirName) ?? registry.find((plugin) => plugin.channels.includes(params.dirName)) ?? null;
}
/** Resolves the stable plugin id used for telemetry and error reporting. */
function resolveTrackedFacadePluginId(params) {
	return resolveBundledPluginManifestRecord(params)?.id ?? params.dirName;
}
/** Evaluates whether a bundled plugin's api/runtime-api facade is currently enabled. */
function resolveBundledPluginPublicSurfaceAccess(params) {
	if (params.artifactBasename === "runtime-api.js" && ALWAYS_ALLOWED_RUNTIME_DIR_NAME_SET.has(params.dirName)) return {
		allowed: true,
		pluginId: params.dirName
	};
	const manifestRecord = resolveBundledPluginManifestRecord(params);
	if (!manifestRecord) return {
		allowed: false,
		reason: `no bundled plugin manifest found for ${params.dirName}`
	};
	const state = getPluginRegistryState();
	const runtimeRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? (state?.runtimeSubagentMode === "gateway-bindable" ? state.activeRegistry : void 0);
	if (runtimeRegistry) {
		const record = runtimeRegistry.plugins.find((entry) => entry.id === manifestRecord.id);
		return {
			allowed: record?.status === "loaded",
			pluginId: manifestRecord.id,
			...record?.status === "loaded" ? {} : { reason: "plugin runtime is not active" }
		};
	}
	const { config, normalizedPluginsConfig, activationSource, autoEnabledReasons } = getFacadeBoundaryResolvedConfig();
	return evaluateBundledPluginPublicSurfaceAccess({
		params,
		manifestRecord,
		config,
		normalizedPluginsConfig,
		activationSource,
		autoEnabledReasons
	});
}
/** Applies normalized config and default enablement rules to one bundled manifest. */
function evaluateBundledPluginPublicSurfaceAccess(params) {
	const activationState = resolveEffectivePluginActivationState({
		id: params.manifestRecord.id,
		origin: params.manifestRecord.origin,
		channelIds: params.manifestRecord.channels,
		config: params.normalizedPluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.manifestRecord),
		activationSource: params.activationSource,
		autoEnabledReason: params.autoEnabledReasons[params.manifestRecord.id]?.[0]
	});
	if (activationState.enabled) return {
		allowed: true,
		pluginId: params.manifestRecord.id
	};
	return {
		allowed: false,
		pluginId: params.manifestRecord.id,
		reason: activationState.reason ?? "plugin runtime is not activated"
	};
}
/** Throws the public error used when a disabled bundled plugin facade is imported. */
function throwForBundledPluginPublicSurfaceAccess(params) {
	const pluginLabel = params.access.pluginId ?? params.request.dirName;
	throw new Error(`Bundled plugin public surface access blocked for "${pluginLabel}" via ${params.request.dirName}/${params.request.artifactBasename}: ${params.access.reason ?? "plugin runtime is not activated"}`);
}
/** Resolves bundled facade access and throws unless the facade is allowed to load. */
function resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(params) {
	const access = resolveBundledPluginPublicSurfaceAccess(params);
	if (!access.allowed) throwForBundledPluginPublicSurfaceAccess({
		access,
		request: params
	});
	return access;
}
//#endregion
export { evaluateBundledPluginPublicSurfaceAccess, resolveActivatedBundledPluginPublicSurfaceAccessOrThrow, resolveBundledPluginPublicSurfaceAccess, resolveRegistryPluginModuleLocation, resolveTrackedFacadePluginId, throwForBundledPluginPublicSurfaceAccess };

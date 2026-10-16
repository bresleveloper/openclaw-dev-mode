import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { p as resolveEffectivePluginActivationState, r as createPluginActivationSource, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { c as resolveBundledMetadataManifestRecord, l as resolveRegistryPluginModuleLocationFromRecords } from "./facade-loader-B-X-HqBc.mjs";
import { i as configMayNeedPluginAutoEnable, t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
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
	const registry = getFacadeManifestRegistry(params);
	return resolveRegistryPluginModuleLocationFromRecords({
		registry,
		dirName: params.dirName,
		artifactBasename: params.artifactBasename
	});
}
function resolveBundledPluginManifestRecord(params) {
	const metadataRecord = resolveBundledMetadataManifestRecord(params);
	if (metadataRecord) return metadataRecord;
	const registry = getFacadeManifestRegistry(params);
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
	const activationState = resolveEffectivePluginActivationState({
		id: manifestRecord.id,
		origin: manifestRecord.origin,
		channelIds: manifestRecord.channels,
		config: normalizedPluginsConfig,
		rootConfig: config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		activationSource,
		autoEnabledReason: autoEnabledReasons[manifestRecord.id]?.[0]
	});
	if (activationState.enabled) return {
		allowed: true,
		pluginId: manifestRecord.id
	};
	return {
		allowed: false,
		pluginId: manifestRecord.id,
		reason: activationState.reason ?? "plugin runtime is not activated"
	};
}
/** Resolves bundled facade access and throws unless the facade is allowed to load. */
function resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(params) {
	const access = resolveBundledPluginPublicSurfaceAccess(params);
	if (!access.allowed) {
		const pluginLabel = access.pluginId ?? params.dirName;
		throw new Error(`Bundled plugin public surface access blocked for "${pluginLabel}" via ${params.dirName}/${params.artifactBasename}: ${access.reason ?? "plugin runtime is not activated"}`);
	}
	return access;
}
//#endregion
export { resolveActivatedBundledPluginPublicSurfaceAccessOrThrow, resolveBundledPluginPublicSurfaceAccess, resolveRegistryPluginModuleLocation, resolveTrackedFacadePluginId };

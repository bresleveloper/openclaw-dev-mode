import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as matchRootFileOpenFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import "./utils-DgZn2dLu.mjs";
import { f as readPluginCacheFile, o as parsePluginCacheJson } from "./package-manifest-CEbdS_C4.mjs";
import { p as resolveEffectivePluginActivationState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { t as applyMergePatch } from "./merge-patch-C4XTCka4.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
//#region src/plugins/bundle-config-shared.ts
function extractBundleServerMap(raw, containerKeys) {
	if (!isRecord(raw)) return {};
	let nested = raw;
	for (const key of containerKeys) if (isRecord(raw[key])) {
		nested = raw[key];
		break;
	}
	const servers = {};
	for (const [name, value] of Object.entries(nested)) if (isRecord(value)) servers[name] = { ...value };
	return servers;
}
function readBundleJsonObject(params) {
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		rejectHardlinks: true,
		maxBytes: null
	});
	if (!file.ok && file.failurePhase !== "read") {
		if (params.allowMissing === void 0) return {
			ok: true,
			raw: {}
		};
		return matchRootFileOpenFailure(file.failure, {
			path: () => params.allowMissing ? {
				ok: true,
				raw: {}
			} : {
				ok: false,
				error: `unable to read ${params.relativePath}: path`,
				reason: "open"
			},
			fallback: (failure) => ({
				ok: false,
				error: `unable to read ${params.relativePath}: ${failure.reason}`,
				reason: "open"
			})
		});
	}
	const parsed = file.ok ? parsePluginCacheJson(file) : {
		ok: false,
		error: file.failure.error
	};
	if (!parsed.ok) return {
		ok: false,
		error: `failed to parse ${params.relativePath}: ${String(parsed.error)}`
	};
	return isRecord(parsed.value) ? {
		ok: true,
		raw: structuredClone(parsed.value)
	} : {
		ok: false,
		error: `${params.relativePath} must contain a JSON object`
	};
}
function loadEnabledBundleConfig(params) {
	const normalizedPlugins = normalizePluginsConfig(params.cfg?.plugins);
	if (!normalizedPlugins.enabled) return {
		config: params.createEmptyConfig(),
		diagnostics: []
	};
	const registry = params.manifestRegistry ?? loadPluginManifestRegistryForPluginRegistry({
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		includeDisabled: true
	});
	const diagnostics = [];
	let merged = params.createEmptyConfig();
	for (const record of registry.plugins) {
		const canLoadBundle = record.format === "bundle" && Boolean(record.bundleFormat);
		const canLoadNative = record.format !== "bundle" && params.loadNativePluginConfig !== void 0;
		if (!canLoadBundle && !canLoadNative) continue;
		if (!resolveEffectivePluginActivationState({
			id: record.id,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedPlugins,
			rootConfig: params.cfg,
			enabledByDefault: record.enabledByDefault
		}).activated) continue;
		const loaded = canLoadBundle && record.bundleFormat ? params.loadBundleConfig({
			pluginId: record.id,
			rootDir: record.rootDir,
			bundleFormat: record.bundleFormat
		}) : params.loadNativePluginConfig?.({ record });
		if (!loaded) continue;
		merged = applyMergePatch(merged, loaded.config);
		for (const message of loaded.diagnostics) diagnostics.push({
			pluginId: record.id,
			message
		});
	}
	return {
		config: merged,
		diagnostics
	};
}
//#endregion
export { loadEnabledBundleConfig as n, readBundleJsonObject as r, extractBundleServerMap as t };

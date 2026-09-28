import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { i as matchRootFileOpenFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { f as readPluginCacheFile, o as parsePluginCacheJson } from "./package-manifest-C8sTeZKW.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
//#region src/plugins/bundle-config-shared.ts
function readBundleJsonObject(params) {
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		rejectHardlinks: true,
		maxBytes: null
	});
	if (!file.ok && file.failurePhase !== "read") {
		const result = params.onOpenFailure?.(file.failure) ?? {
			ok: true,
			raw: {}
		};
		return result.ok ? result : {
			...result,
			reason: "open"
		};
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
function resolveBundleJsonOpenFailure(params) {
	return matchRootFileOpenFailure(params.failure, {
		path: () => {
			if (params.allowMissing) return {
				ok: true,
				raw: {}
			};
			return {
				ok: false,
				error: `unable to read ${params.relativePath}: path`
			};
		},
		fallback: (failure) => ({
			ok: false,
			error: `unable to read ${params.relativePath}: ${failure.reason}`
		})
	});
}
function inspectBundleServerRuntimeSupport(params) {
	const supportedServerNames = [];
	const unsupportedServerNames = [];
	let hasSupportedServer = false;
	for (const [serverName, server] of Object.entries(params.resolveServers(params.loaded.config))) {
		if (typeof server.command === "string" && server.command.trim().length > 0) {
			hasSupportedServer = true;
			supportedServerNames.push(serverName);
			continue;
		}
		unsupportedServerNames.push(serverName);
	}
	return {
		hasSupportedServer,
		supportedServerNames,
		unsupportedServerNames,
		diagnostics: params.loaded.diagnostics
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
		for (const message of loaded.diagnostics) diagnostics.push(params.createDiagnostic(record.id, message));
	}
	return {
		config: merged,
		diagnostics
	};
}
//#endregion
export { resolveBundleJsonOpenFailure as i, loadEnabledBundleConfig as n, readBundleJsonObject as r, inspectBundleServerRuntimeSupport as t };

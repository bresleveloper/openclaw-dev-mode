import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { c as normalizeBundlePathList, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH, s as mergeBundlePathLists } from "./bundle-manifest-n8JdxRJp.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { i as resolveBundleJsonOpenFailure, n as loadEnabledBundleConfig, r as readBundleJsonObject, t as inspectBundleServerRuntimeSupport } from "./bundle-config-shared-CZ-homIu.mjs";
import path from "node:path";
//#region src/plugins/bundle-lsp.ts
const MANIFEST_PATH_BY_FORMAT = { claude: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH };
function extractLspServerMap(raw) {
	if (!isRecord(raw)) return {};
	const nested = isRecord(raw.lspServers) ? raw.lspServers : raw;
	if (!isRecord(nested)) return {};
	const result = {};
	for (const [serverName, serverRaw] of Object.entries(nested)) {
		if (!isRecord(serverRaw)) continue;
		result[serverName] = { ...serverRaw };
	}
	return result;
}
function resolveBundleLspConfigPaths(params) {
	const declared = normalizeBundlePathList(params.raw.lspServers);
	const defaults = pluginCacheExistsSync(path.join(params.rootDir, ".lsp.json")) ? [".lsp.json"] : [];
	return mergeBundlePathLists(defaults, declared);
}
function loadBundleLspConfigFile(params) {
	const result = readBundleJsonObject({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		onOpenFailure: (failure) => resolveBundleJsonOpenFailure({
			failure,
			relativePath: params.relativePath,
			allowMissing: true
		})
	});
	if (!result.ok) return {
		config: { lspServers: {} },
		diagnostics: [result.reason === "open" ? result.error : `unable to read ${params.relativePath}: ${result.error}`]
	};
	return {
		config: { lspServers: extractLspServerMap(result.raw) },
		diagnostics: []
	};
}
function loadBundleLspConfig(params) {
	const manifestRelativePath = MANIFEST_PATH_BY_FORMAT[params.bundleFormat];
	if (!manifestRelativePath) return {
		config: { lspServers: {} },
		diagnostics: []
	};
	const manifestLoaded = readBundleJsonObject({
		rootDir: params.rootDir,
		relativePath: manifestRelativePath
	});
	if (!manifestLoaded.ok) return {
		config: { lspServers: {} },
		diagnostics: [manifestLoaded.error]
	};
	let merged = { lspServers: {} };
	const filePaths = resolveBundleLspConfigPaths({
		raw: manifestLoaded.raw,
		rootDir: params.rootDir
	});
	const diagnostics = [];
	for (const relativePath of filePaths) {
		const loaded = loadBundleLspConfigFile({
			rootDir: params.rootDir,
			relativePath
		});
		diagnostics.push(...loaded.diagnostics);
		merged = applyMergePatch(merged, loaded.config);
	}
	return {
		config: merged,
		diagnostics
	};
}
/** Inspects whether one plugin bundle has supported LSP runtime servers. */
function inspectBundleLspRuntimeSupport(params) {
	const support = inspectBundleServerRuntimeSupport({
		loaded: loadBundleLspConfig(params),
		resolveServers: (config) => config.lspServers
	});
	return {
		hasStdioServer: support.hasSupportedServer,
		supportedServerNames: support.supportedServerNames,
		unsupportedServerNames: support.unsupportedServerNames,
		diagnostics: support.diagnostics
	};
}
/** Loads and merges enabled bundle LSP config across plugin manifests. */
function loadEnabledBundleLspConfig(params) {
	return loadEnabledBundleConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		createEmptyConfig: () => ({ lspServers: {} }),
		loadBundleConfig: loadBundleLspConfig,
		createDiagnostic: (pluginId, message) => ({
			pluginId,
			message
		})
	});
}
//#endregion
export { loadEnabledBundleLspConfig as n, inspectBundleLspRuntimeSupport as t };

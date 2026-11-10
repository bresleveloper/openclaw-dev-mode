import { l as resolveBundleComponentPaths, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH } from "./bundle-manifest-CQDvnPXX.mjs";
import { t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { n as loadEnabledBundleConfig, r as readBundleJsonObject, t as extractBundleServerMap } from "./bundle-config-shared-Dw2g469y.mjs";
//#region src/plugins/bundle-lsp.ts
function loadBundleLspConfig(params) {
	if (params.bundleFormat !== "claude") return {
		config: { lspServers: {} },
		diagnostics: []
	};
	const manifestLoaded = readBundleJsonObject({
		rootDir: params.rootDir,
		relativePath: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH
	});
	if (!manifestLoaded.ok) return {
		config: { lspServers: {} },
		diagnostics: [manifestLoaded.error]
	};
	let merged = { lspServers: {} };
	const filePaths = resolveBundleComponentPaths(manifestLoaded.raw.lspServers, params.rootDir, [".lsp.json"]);
	const diagnostics = [];
	for (const relativePath of filePaths) {
		const result = readBundleJsonObject({
			rootDir: params.rootDir,
			relativePath,
			allowMissing: true
		});
		if (!result.ok) diagnostics.push(result.reason === "open" ? result.error : `unable to read ${relativePath}: ${result.error}`);
		merged = applyMergePatch(merged, { lspServers: result.ok ? extractBundleServerMap(result.raw, ["lspServers"]) : {} });
	}
	return {
		config: merged,
		diagnostics
	};
}
function inspectBundleLspRuntimeSupport(params) {
	const { config, diagnostics } = loadBundleLspConfig(params);
	const supportedServerNames = [];
	const unsupportedServerNames = [];
	for (const [name, server] of Object.entries(config.lspServers)) (typeof server.command === "string" && server.command.trim().length > 0 ? supportedServerNames : unsupportedServerNames).push(name);
	return {
		supportedServerNames,
		unsupportedServerNames,
		diagnostics
	};
}
function loadEnabledBundleLspConfig(params) {
	return loadEnabledBundleConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		createEmptyConfig: () => ({ lspServers: {} }),
		loadBundleConfig: loadBundleLspConfig
	});
}
//#endregion
export { loadEnabledBundleLspConfig as n, inspectBundleLspRuntimeSupport as t };

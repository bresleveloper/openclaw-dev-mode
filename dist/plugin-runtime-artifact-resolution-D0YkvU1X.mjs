import { l as pluginCacheRealpathSync } from "./package-manifest-C8sTeZKW.mjs";
import { d as resolveCanonicalDistRuntimeSource, p as resolvePluginRuntimeArtifactSelection } from "./bundled-dir-BGJkK8G5.mjs";
import { l as getActivePluginRegistry, y as requireActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import path from "node:path";
//#region src/plugins/plugin-runtime-artifact-resolution.ts
/** Resolves the exact root and entry selected by the plugin runtime loader. */
function clearPluginRuntimeArtifactResolutionMemo() {
	getActivePluginRegistry()?.pluginRuntimeArtifacts.clear();
}
/** Applies both loader selection phases in their runtime order. */
function resolvePluginRuntimeArtifact(params) {
	const rootDir = resolveCanonicalDistRuntimeSource(pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir));
	const memoKey = JSON.stringify([
		params.pluginId,
		rootDir,
		params.entryKind
	]);
	const targetRegistry = params.registry ?? requireActivePluginRegistry();
	const cached = targetRegistry.pluginRuntimeArtifacts.get(memoKey);
	if (cached) return { ...cached };
	const resolved = resolvePluginRuntimeArtifactSelection(params);
	targetRegistry.pluginRuntimeArtifacts.set(memoKey, resolved);
	return { ...resolved };
}
//#endregion
export { resolvePluginRuntimeArtifact as n, clearPluginRuntimeArtifactResolutionMemo as t };

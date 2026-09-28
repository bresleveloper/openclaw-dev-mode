import { r as loadOpenClawPlugins } from "./loader-runtime-load-DitY2Htf.mjs";
import "./active-runtime-registry-k2s7FqfS.mjs";
//#region src/plugins/loader.ts
/** Stable public facade for plugin loading and runtime-registry resolution. */
/** Loads a caller-owned registry value without changing the process-wide active registry. */
function loadPluginRegistryHandle(options = {}) {
	return loadOpenClawPlugins({
		...options,
		activate: false
	});
}
/** Collects CLI descriptors through the same validation and instance owner as runtime loading. */
async function loadOpenClawPluginCliRegistry(options = {}) {
	return loadOpenClawPlugins({
		...options,
		mode: "cli-metadata",
		activate: false
	});
}
/** Loads and installs the registry owned by a process composition root. */
function loadAndActivateRootPluginRegistry(options = {}) {
	return loadOpenClawPlugins({
		...options,
		activate: true
	});
}
//#endregion
export { loadOpenClawPluginCliRegistry as n, loadPluginRegistryHandle as r, loadAndActivateRootPluginRegistry as t };

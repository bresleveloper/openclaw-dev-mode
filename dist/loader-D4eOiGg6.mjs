import "./active-runtime-registry-DTyEuOsJ.mjs";
import { i as loadOpenClawPlugins } from "./loader-runtime-load-BQO3MsEg.mjs";
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
//#endregion
export { loadPluginRegistryHandle as n, loadOpenClawPluginCliRegistry as t };

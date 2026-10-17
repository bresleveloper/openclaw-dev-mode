import { l as getActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import "./active-runtime-registry-DTyEuOsJ.mjs";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-Dyv8bBue.mjs";
//#region src/plugins/text-transforms.runtime.ts
/** Resolves merged text transforms from the active runtime plugin registry. */
function resolveRuntimeTextTransforms() {
	const registry = getActivePluginRegistry();
	const pluginTextTransforms = Array.isArray(registry?.textTransforms) ? registry.textTransforms.map((entry) => entry.transforms) : [];
	return mergePluginTextTransforms(...pluginTextTransforms);
}
//#endregion
export { resolveRuntimeTextTransforms as t };

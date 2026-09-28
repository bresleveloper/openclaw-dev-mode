import { n as getActiveRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-CuF3jf1R.mjs";
//#region src/plugins/text-transforms.runtime.ts
/** Resolves merged text transforms from the active runtime plugin registry. */
function resolveRuntimeTextTransforms() {
	const registry = getActiveRuntimePluginRegistry();
	const pluginTextTransforms = Array.isArray(registry?.textTransforms) ? registry.textTransforms.map((entry) => entry.transforms) : [];
	return mergePluginTextTransforms(...pluginTextTransforms);
}
//#endregion
export { resolveRuntimeTextTransforms as t };

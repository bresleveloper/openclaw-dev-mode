import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-B25e5LoI.mjs";
import "./active-runtime-registry-BrXk-dcA.mjs";
//#region src/plugins/text-transforms.runtime.ts
/** Resolves merged text transforms from the active runtime plugin registry. */
function resolveRuntimeTextTransforms() {
	return mergePluginTextTransforms(...getActivePluginRegistry()?.textTransforms.map((entry) => entry.transforms) ?? []);
}
//#endregion
export { resolveRuntimeTextTransforms as t };

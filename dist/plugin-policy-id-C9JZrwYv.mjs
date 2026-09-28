import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
//#region src/plugins/plugin-policy-id.ts
/**
* Canonicalizes a plugin id for comparison against `plugins.allow`, `plugins.deny`, and
* `plugins.entries`, which are lowercase-normalized when config is normalized. A manifest declares
* its id in whatever case its author chose, so policy must compare this derived key rather than the
* declared id. The declared id itself stays untouched: the loader matches it against the plugin's
* runtime export id, and rewriting it would break plugins whose export matches a mixed-case manifest.
*/
function normalizePluginPolicyId(id) {
	return normalizeOptionalLowercaseString(id) ?? "";
}
//#endregion
export { normalizePluginPolicyId as t };

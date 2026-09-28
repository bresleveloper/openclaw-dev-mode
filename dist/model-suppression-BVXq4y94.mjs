import { t as buildManifestBuiltInModelSuppressionResolver } from "./manifest-model-suppression-CqAfy3ud.mjs";
//#region src/agents/model-suppression.ts
/** Resolves one provider-owned rule against the caller's concrete model route. */
function resolveBuiltInModelSuppressionFromManifest(params) {
	return buildManifestBuiltInModelSuppressionResolver({
		env: process.env,
		config: params.config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot
	})(params);
}
/**
* Return true only for unconditional manifest suppressions.
* Inline model entries may override conditional suppressions, but not absolute
* provider capability blocks.
*/
function shouldUnconditionallySuppress(params) {
	return resolveBuiltInModelSuppressionFromManifest({
		...params,
		unconditionalOnly: true
	})?.suppress ?? false;
}
/** Resolve the user-facing suppression error message for a built-in model. */
function buildSuppressedBuiltInModelError(params) {
	return resolveBuiltInModelSuppressionFromManifest(params)?.errorMessage;
}
/** Build a reusable suppression predicate for repeated catalog filtering. */
function buildShouldSuppressBuiltInModelCore(params) {
	const resolver = buildManifestBuiltInModelSuppressionResolver({
		env: process.env,
		...params
	});
	return (input) => resolver(input)?.suppress ?? false;
}
//#endregion
export { shouldUnconditionallySuppress as i, buildSuppressedBuiltInModelError as n, resolveBuiltInModelSuppressionFromManifest as r, buildShouldSuppressBuiltInModelCore as t };

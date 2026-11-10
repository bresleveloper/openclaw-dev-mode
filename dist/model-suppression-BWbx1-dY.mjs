import { t as buildManifestBuiltInModelSuppressionResolver } from "./manifest-model-suppression-C33pzrMr.mjs";
//#region src/agents/model-suppression.ts
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
function buildSuppressedBuiltInModelError(params) {
	return resolveBuiltInModelSuppressionFromManifest(params)?.errorMessage;
}
function buildShouldSuppressBuiltInModelCore(params) {
	const resolver = buildManifestBuiltInModelSuppressionResolver({
		env: process.env,
		...params
	});
	return (input) => resolver(input)?.suppress ?? false;
}
//#endregion
export { shouldUnconditionallySuppress as i, buildSuppressedBuiltInModelError as n, resolveBuiltInModelSuppressionFromManifest as r, buildShouldSuppressBuiltInModelCore as t };

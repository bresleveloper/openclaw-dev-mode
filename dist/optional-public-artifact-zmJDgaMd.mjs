import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-BzW1QYAL.mjs";
//#region src/channels/plugins/optional-public-artifact.ts
function loadOptionalBundledChannelPublicArtifact(params) {
	return loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.channelId.trim(),
		artifactCandidates: [params.artifactBasename]
	}) ?? void 0;
}
//#endregion
export { loadOptionalBundledChannelPublicArtifact as t };

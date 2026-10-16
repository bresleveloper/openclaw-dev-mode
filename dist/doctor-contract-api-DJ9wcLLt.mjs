import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-BzW1QYAL.mjs";
//#region src/channels/plugins/doctor-contract-api.ts
/**
* Loads a bundled channel's public doctor contract.
*/
function loadBundledChannelDoctorContractApi(channelId) {
	return loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: channelId.trim(),
		artifactCandidates: ["doctor-contract-api.js"]
	}) ?? void 0;
}
//#endregion
export { loadBundledChannelDoctorContractApi as t };

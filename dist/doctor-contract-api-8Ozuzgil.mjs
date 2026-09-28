import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-CNXp9Fm5.mjs";
//#region src/channels/plugins/doctor-contract-api.ts
/**
* Loads a bundled channel's public doctor contract.
*/
function loadBundledChannelDoctorContractApi(channelId) {
	try {
		return loadBundledPluginPublicArtifactModuleSync({
			dirName: channelId,
			artifactBasename: "doctor-contract-api.js"
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface ")) return;
		throw error;
	}
}
//#endregion
export { loadBundledChannelDoctorContractApi as t };

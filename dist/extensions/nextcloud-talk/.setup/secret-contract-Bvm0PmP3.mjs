import { createSimpleChannelSecretContract } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/nextcloud-talk/src/secret-contract.ts
const channelSecrets = createSimpleChannelSecretContract({
	channelKey: "nextcloud-talk",
	label: "Nextcloud Talk",
	accountFields: ["apiPassword", "botSecret"],
	channelFields: ["apiPassword", "botSecret"],
	mode: {
		kind: "surface-inheritance",
		collectionFields: ["botSecret", "apiPassword"]
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

import { createSimpleChannelSecretContract } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/mattermost/src/secret-contract.ts
const channelSecrets = createSimpleChannelSecretContract({
	channelKey: "mattermost",
	label: "Mattermost",
	accountFields: ["botToken"],
	channelFields: ["botToken"],
	mode: "account-inheritance"
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

//#region extensions/msteams/src/secret-contract.ts
const channelSecrets = (0, require("openclaw/plugin-sdk/channel-secret-basic-runtime").createSimpleChannelSecretContract)({
	channelKey: "msteams",
	label: "Microsoft Teams",
	accountFields: [],
	channelFields: ["appPassword"],
	mode: "channel-only"
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
Object.defineProperty(exports, "channelSecrets", {
	enumerable: true,
	get: function() {
		return channelSecrets;
	}
});
Object.defineProperty(exports, "collectRuntimeConfigAssignments", {
	enumerable: true,
	get: function() {
		return collectRuntimeConfigAssignments;
	}
});
Object.defineProperty(exports, "secretTargetRegistryEntries", {
	enumerable: true,
	get: function() {
		return secretTargetRegistryEntries;
	}
});

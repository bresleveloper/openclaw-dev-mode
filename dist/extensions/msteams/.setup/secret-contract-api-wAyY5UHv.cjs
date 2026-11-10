let openclaw_plugin_sdk_setup = require("openclaw/plugin-sdk/setup");
let openclaw_plugin_sdk_channel_secret_basic_runtime = require("openclaw/plugin-sdk/channel-secret-basic-runtime");
//#region extensions/msteams/src/secret-contract.ts
const secretTargetRegistryEntries = (0, openclaw_plugin_sdk_channel_secret_basic_runtime.createChannelSecretTargetRegistryEntries)({
	channelKey: "msteams",
	account: ["appPassword"],
	channel: ["appPassword"]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = (0, openclaw_plugin_sdk_channel_secret_basic_runtime.getChannelSurface)(params.config, "msteams");
	if (!resolved) return;
	const { channel: msteams, surface } = resolved;
	(0, openclaw_plugin_sdk_channel_secret_basic_runtime.collectSecretInputAssignment)({
		value: msteams.appPassword,
		path: "channels.msteams.appPassword",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: isRootDefaultIdentityActive(msteams, surface),
		inactiveReason: "no enabled account inherits this top-level Microsoft Teams appPassword.",
		owner: {
			ownerKind: "account",
			ownerId: "msteams:default",
			requiredForGateway: false,
			disposition: "isolate",
			contract: msteams
		},
		apply: (value) => {
			msteams.appPassword = value;
		}
	});
	if (!surface.hasExplicitAccounts) return;
	for (const { accountId, account, enabled } of surface.accounts) {
		if (!(0, openclaw_plugin_sdk_channel_secret_basic_runtime.hasOwnProperty)(account, "appPassword")) continue;
		(0, openclaw_plugin_sdk_channel_secret_basic_runtime.collectSecretInputAssignment)({
			value: account.appPassword,
			path: `channels.msteams.accounts.${accountId}.appPassword`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: enabled,
			inactiveReason: "Microsoft Teams account is disabled.",
			owner: {
				ownerKind: "account",
				ownerId: `msteams:${(0, openclaw_plugin_sdk_setup.normalizeAccountId)(accountId)}`,
				requiredForGateway: false,
				disposition: "isolate",
				contract: account
			},
			apply: (value) => {
				account.appPassword = value;
			}
		});
	}
}
function isConfiguredIdentityField(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
function isRootDefaultIdentityActive(channel, surface) {
	return ((surface.hasExplicitAccounts ? surface.accounts.find(({ accountId }) => (0, openclaw_plugin_sdk_setup.normalizeAccountId)(accountId) === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID) : void 0)?.enabled ?? surface.channelEnabled) && (isConfiguredIdentityField(channel.appId) || isConfiguredIdentityField(channel.appPassword));
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
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

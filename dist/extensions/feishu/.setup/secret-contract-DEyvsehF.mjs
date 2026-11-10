import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { collectConditionalChannelFieldAssignments, createChannelSecretContract, hasConfiguredSecretInputValue, hasOwnProperty, normalizeSecretStringValue } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/feishu/src/secret-contract.ts
const channelSecrets = createChannelSecretContract({
	channelKey: "feishu",
	account: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	],
	channel: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	],
	collect(params) {
		const { channel: feishu, surface } = params;
		if (surface.channelEnabled && hasConfiguredSecretInputValue(feishu.appId, params.defaults) && hasConfiguredSecretInputValue(feishu.appSecret, params.defaults) && surface.hasExplicitAccounts && !surface.accounts.some(({ accountId }) => normalizeAccountId(accountId) === DEFAULT_ACCOUNT_ID)) surface.accounts.push({
			accountId: "default",
			account: {},
			enabled: true
		});
		collectConditionalChannelFieldAssignments({
			...params,
			field: "appSecret",
			topLevelActiveWithoutAccounts: surface.channelEnabled,
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "appSecret"),
			accountActive: ({ enabled }) => enabled,
			topInactiveReason: "no enabled account inherits this top-level Feishu appSecret.",
			accountInactiveReason: "Feishu account is disabled."
		});
		const baseConnectionMode = normalizeSecretStringValue(feishu.connectionMode) === "webhook" ? "webhook" : "websocket";
		const resolveAccountMode = (account) => hasOwnProperty(account, "connectionMode") ? normalizeSecretStringValue(account.connectionMode) : baseConnectionMode;
		for (const field of ["encryptKey", "verificationToken"]) collectConditionalChannelFieldAssignments({
			...params,
			field,
			topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, field) && resolveAccountMode(account) === "webhook",
			accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
			topInactiveReason: `no enabled Feishu webhook-mode surface inherits this top-level ${field}.`,
			accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

import { i as hasOwnProperty, n as collectSecretInputAssignment } from "./runtime-shared-D99zx8IE.js";
import { a as getChannelSurface, c as normalizeSecretStringValue, o as hasConfiguredSecretInputValue, s as isBaseFieldActiveForChannelSurface, t as collectConditionalChannelFieldAssignments } from "./channel-secret-basic-runtime-mgLwCc8c.js";
import "./channel-secret-basic-runtime-CJu6t-Vd.js";
//#region extensions/feishu/src/secret-contract.ts
const secretTargetRegistryEntries = [
	{
		id: "channels.feishu.accounts.*.appSecret",
		targetType: "channels.feishu.accounts.*.appSecret",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.accounts.*.appSecret",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.feishu.accounts.*.encryptKey",
		targetType: "channels.feishu.accounts.*.encryptKey",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.accounts.*.encryptKey",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.feishu.accounts.*.verificationToken",
		targetType: "channels.feishu.accounts.*.verificationToken",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.accounts.*.verificationToken",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.feishu.appSecret",
		targetType: "channels.feishu.appSecret",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.appSecret",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.feishu.encryptKey",
		targetType: "channels.feishu.encryptKey",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.encryptKey",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.feishu.verificationToken",
		targetType: "channels.feishu.verificationToken",
		configFile: "openclaw.json",
		pathPattern: "channels.feishu.verificationToken",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	}
];
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "feishu");
	if (!resolved) return;
	const { channel: feishu, surface } = resolved;
	const topLevelAppSecretActive = surface.channelEnabled && hasConfiguredSecretInputValue(feishu.appId, params.defaults) && hasConfiguredSecretInputValue(feishu.appSecret, params.defaults) || isBaseFieldActiveForChannelSurface(surface, "appSecret");
	collectSecretInputAssignment({
		value: feishu.appSecret,
		path: "channels.feishu.appSecret",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: topLevelAppSecretActive,
		inactiveReason: "no enabled account inherits this top-level Feishu appSecret.",
		apply: (value) => {
			feishu.appSecret = value;
		}
	});
	if (surface.hasExplicitAccounts) for (const { accountId, account, enabled } of surface.accounts) {
		if (!hasOwnProperty(account, "appSecret")) continue;
		collectSecretInputAssignment({
			value: account.appSecret,
			path: `channels.feishu.accounts.${accountId}.appSecret`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: enabled,
			inactiveReason: "Feishu account is disabled.",
			apply: (value) => {
				account.appSecret = value;
			}
		});
	}
	const baseConnectionMode = normalizeSecretStringValue(feishu.connectionMode) === "webhook" ? "webhook" : "websocket";
	const resolveAccountMode = (account) => hasOwnProperty(account, "connectionMode") ? normalizeSecretStringValue(account.connectionMode) : baseConnectionMode;
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "encryptKey",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "encryptKey") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level encryptKey.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "verificationToken",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "verificationToken") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level verificationToken.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

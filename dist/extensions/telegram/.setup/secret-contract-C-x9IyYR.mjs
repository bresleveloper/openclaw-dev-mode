import { collectConditionalChannelFieldAssignments, createChannelSecretContract, hasConfiguredSecretInputValue, hasOwnProperty } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/telegram/src/secret-contract.ts
const channelSecrets = createChannelSecretContract({
	channelKey: "telegram",
	account: ["botToken", "webhookSecret"],
	channel: ["botToken", "webhookSecret"],
	collect(params) {
		const { channel: telegram } = params;
		const baseTokenFile = normalizeOptionalString(telegram.tokenFile) ?? "";
		const accountTokenFile = (account) => normalizeOptionalString(account.tokenFile) ?? "";
		collectConditionalChannelFieldAssignments({
			...params,
			field: "botToken",
			topLevelActiveWithoutAccounts: baseTokenFile.length === 0,
			topLevelInheritedAccountActive: ({ account, enabled }) => {
				if (!enabled || baseTokenFile.length > 0) return false;
				return !hasConfiguredSecretInputValue(account.botToken, params.defaults) && accountTokenFile(account).length === 0;
			},
			accountActive: ({ account, enabled }) => enabled && accountTokenFile(account).length === 0,
			topInactiveReason: "no enabled Telegram surface inherits this top-level botToken (tokenFile is configured).",
			accountInactiveReason: "Telegram account is disabled or tokenFile is configured."
		});
		const baseWebhookUrl = normalizeOptionalString(telegram.webhookUrl) ?? "";
		const accountWebhookUrl = (account) => hasOwnProperty(account, "webhookUrl") ? normalizeOptionalString(account.webhookUrl) ?? "" : baseWebhookUrl;
		collectConditionalChannelFieldAssignments({
			...params,
			field: "webhookSecret",
			topLevelActiveWithoutAccounts: baseWebhookUrl.length > 0,
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "webhookSecret") && accountWebhookUrl(account).length > 0,
			accountActive: ({ account, enabled }) => enabled && accountWebhookUrl(account).length > 0,
			topInactiveReason: "no enabled Telegram webhook surface inherits this top-level webhookSecret (webhook mode is not active).",
			accountInactiveReason: "Telegram account is disabled or webhook mode is not active for this account."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

import { hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-helpers";
import { collectSimpleChannelFieldAssignments, createChannelSecretContract } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/mattermost/src/secret-contract.ts
const channelSecrets = createChannelSecretContract({
	channelKey: "mattermost",
	account: ["botToken"],
	channel: ["botToken"],
	hasImplicitDefaultAccount: ({ channel, context }) => Boolean(typeof channel.baseUrl === "string" && channel.baseUrl.trim() && (hasConfiguredAccountValue(channel.botToken) || context.env.MATTERMOST_BOT_TOKEN?.trim())),
	collect(params) {
		collectSimpleChannelFieldAssignments({
			...params,
			field: "botToken",
			topInactiveReason: "no enabled account inherits this top-level Mattermost botToken.",
			accountInactiveReason: "Mattermost account is disabled."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

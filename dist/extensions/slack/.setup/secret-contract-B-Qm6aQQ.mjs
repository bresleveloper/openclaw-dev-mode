import { collectConditionalChannelFieldAssignments, collectNestedChannelFieldAssignments, collectSimpleChannelFieldAssignments, createChannelSecretContract, hasOwnProperty } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/slack/src/secret-contract.ts
const channelSecrets = createChannelSecretContract({
	channelKey: "slack",
	account: [
		"appToken",
		"relay.authToken",
		"botToken",
		"signingSecret",
		"userToken"
	],
	channel: [
		"appToken",
		"botToken",
		"relay.authToken",
		"signingSecret",
		"userToken"
	],
	collect(params) {
		const { channel: slack, surface } = params;
		const resolveMode = (value) => value === "http" || value === "socket" || value === "relay" ? value : void 0;
		const baseMode = resolveMode(slack.mode) ?? "socket";
		for (const field of ["botToken", "userToken"]) collectSimpleChannelFieldAssignments({
			...params,
			field,
			topInactiveReason: `no enabled account inherits this top-level Slack ${field}.`,
			accountInactiveReason: "Slack account is disabled."
		});
		const resolveAccountMode = (account) => resolveMode(account.mode) ?? baseMode;
		const hasNestedAuthTokenOverride = (account) => {
			const relay = account.relay;
			return relay !== null && typeof relay === "object" && !Array.isArray(relay) && hasOwnProperty(relay, "authToken");
		};
		for (const [field, mode, label] of [[
			"appToken",
			"socket",
			"socket"
		], [
			"signingSecret",
			"http",
			"HTTP"
		]]) collectConditionalChannelFieldAssignments({
			...params,
			field,
			topLevelActiveWithoutAccounts: baseMode === mode,
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, field) && resolveAccountMode(account) === mode,
			accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === mode,
			topInactiveReason: `no enabled Slack ${label}-mode surface inherits this top-level ${field}.`,
			accountInactiveReason: `Slack account is disabled or not running in ${label} mode.`
		});
		collectNestedChannelFieldAssignments({
			...params,
			nestedKey: "relay",
			field: "authToken",
			topLevelActive: surface.channelEnabled && (!surface.hasExplicitAccounts && baseMode === "relay" || surface.accounts.some(({ account, enabled }) => enabled && resolveAccountMode(account) === "relay" && !hasNestedAuthTokenOverride(account))),
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "relay" && !hasNestedAuthTokenOverride(account),
			topInactiveReason: "no enabled Slack relay-mode surface inherits this top-level relay authToken.",
			accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "relay",
			accountInactiveReason: "Slack account is disabled or not running in relay mode."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

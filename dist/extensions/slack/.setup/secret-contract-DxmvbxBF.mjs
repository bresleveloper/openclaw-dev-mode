import { collectConditionalChannelFieldAssignments, collectNestedChannelFieldAssignments, collectSimpleChannelFieldAssignments, createChannelSecretTargetRegistryEntries, getChannelSurface, hasOwnProperty } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/slack/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
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
	]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "slack");
	if (!resolved) return;
	const { channel: slack, surface } = resolved;
	const resolveMode = (value) => value === "http" || value === "socket" || value === "relay" ? value : void 0;
	const baseMode = resolveMode(slack.mode) ?? "socket";
	for (const field of ["botToken", "userToken"]) collectSimpleChannelFieldAssignments({
		channelKey: "slack",
		field,
		channel: slack,
		surface,
		defaults: params.defaults,
		context: params.context,
		topInactiveReason: `no enabled account inherits this top-level Slack ${field}.`,
		accountInactiveReason: "Slack account is disabled."
	});
	const resolveAccountMode = (account) => resolveMode(account.mode) ?? baseMode;
	const hasNestedAuthTokenOverride = (account) => {
		const relay = account.relay;
		return relay !== null && typeof relay === "object" && !Array.isArray(relay) && hasOwnProperty(relay, "authToken");
	};
	collectConditionalChannelFieldAssignments({
		channelKey: "slack",
		field: "appToken",
		channel: slack,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseMode === "socket",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "appToken") && resolveAccountMode(account) === "socket",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "socket",
		topInactiveReason: "no enabled Slack socket-mode surface inherits this top-level appToken.",
		accountInactiveReason: "Slack account is disabled or not running in socket mode."
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "slack",
		field: "signingSecret",
		channel: slack,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseMode === "http",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "signingSecret") && resolveAccountMode(account) === "http",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "http",
		topInactiveReason: "no enabled Slack HTTP-mode surface inherits this top-level signingSecret.",
		accountInactiveReason: "Slack account is disabled or not running in HTTP mode."
	});
	collectNestedChannelFieldAssignments({
		channelKey: "slack",
		nestedKey: "relay",
		field: "authToken",
		channel: slack,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActive: surface.channelEnabled && (!surface.hasExplicitAccounts && baseMode === "relay" || surface.accounts.some(({ account, enabled }) => enabled && resolveAccountMode(account) === "relay" && !hasNestedAuthTokenOverride(account))),
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "relay" && !hasNestedAuthTokenOverride(account),
		topInactiveReason: "no enabled Slack relay-mode surface inherits this top-level relay authToken.",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "relay",
		accountInactiveReason: "Slack account is disabled or not running in relay mode."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

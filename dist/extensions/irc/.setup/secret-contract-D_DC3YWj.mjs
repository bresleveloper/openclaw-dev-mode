import { collectNestedChannelFieldAssignments, collectSimpleChannelFieldAssignments, createChannelSecretTargetRegistryEntries, getChannelSurface, isBaseFieldActiveForChannelSurface, isEnabledFlag, isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/irc/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "irc",
	account: ["nickserv.password", "password"],
	channel: ["nickserv.password", "password"]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "irc");
	if (!resolved) return;
	const { channel: irc, surface } = resolved;
	collectSimpleChannelFieldAssignments({
		channelKey: "irc",
		field: "password",
		channel: irc,
		surface,
		defaults: params.defaults,
		context: params.context,
		topInactiveReason: "no enabled account inherits this top-level IRC password.",
		accountInactiveReason: "IRC account is disabled."
	});
	collectNestedChannelFieldAssignments({
		channelKey: "irc",
		nestedKey: "nickserv",
		field: "password",
		channel: irc,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "nickserv") && isRecord(irc.nickserv) && isEnabledFlag(irc.nickserv),
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !Object.hasOwn(account, "nickserv") && isEnabledFlag(irc.nickserv),
		topInactiveReason: "no enabled account inherits this top-level IRC nickserv config or NickServ is disabled.",
		accountActive: ({ account, enabled }) => enabled && isRecord(account.nickserv) && isEnabledFlag(account.nickserv),
		accountInactiveReason: "IRC account is disabled or NickServ is disabled for this account."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { collectConditionalChannelFieldAssignments, createChannelSecretTargetRegistryEntries, getChannelSurface, hasConfiguredSecretInputValue } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/clickclack/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "clickclack",
	account: ["token"],
	channel: ["token"]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "clickclack");
	if (!resolved) return;
	const { channel: clickclack, surface } = resolved;
	const baseTokenFile = normalizeOptionalString(clickclack.tokenFile) ?? "";
	const accountTokenFile = (account) => normalizeOptionalString(account.tokenFile) ?? "";
	const hasImplicitDefault = Boolean(normalizeOptionalString(clickclack.baseUrl)) && Boolean(normalizeOptionalString(clickclack.workspace));
	collectConditionalChannelFieldAssignments({
		channelKey: "clickclack",
		field: "token",
		channel: clickclack,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseTokenFile.length === 0,
		topLevelInheritedAccountActive: ({ account, enabled }) => hasImplicitDefault && baseTokenFile.length === 0 || enabled && baseTokenFile.length === 0 && accountTokenFile(account).length === 0 && !hasConfiguredSecretInputValue(account.token, params.defaults),
		accountActive: ({ account, enabled }) => enabled && accountTokenFile(account).length === 0,
		topInactiveReason: "no enabled ClickClack account inherits this top-level token (tokenFile is configured).",
		accountInactiveReason: "ClickClack account is disabled or tokenFile is configured."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

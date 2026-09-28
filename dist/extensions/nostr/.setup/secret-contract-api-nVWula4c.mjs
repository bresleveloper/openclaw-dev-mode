import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { collectSecretInputAssignment, createChannelSecretTargetRegistryEntries, getChannelRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/nostr/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "nostr",
	channel: ["privateKey"]
});
function collectRuntimeConfigAssignments(params) {
	const nostr = getChannelRecord(params.config, "nostr");
	if (!nostr) return;
	const accountId = normalizeAccountId(typeof nostr.defaultAccount === "string" ? nostr.defaultAccount : void 0);
	collectSecretInputAssignment({
		value: nostr.privateKey,
		path: "channels.nostr.privateKey",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: nostr.enabled !== false,
		inactiveReason: "Nostr channel is disabled.",
		owner: {
			ownerKind: "account",
			ownerId: `nostr:${accountId}`,
			requiredForGateway: false,
			disposition: "isolate",
			contract: nostr
		},
		apply: (value) => {
			nostr.privateKey = value;
		}
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

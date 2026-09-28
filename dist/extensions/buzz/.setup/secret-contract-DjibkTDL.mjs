import { a as resolveBuzzAccountConfig } from "./types-CeupBG0P.mjs";
import { collectSecretInputAssignment, createChannelSecretTargetRegistryEntries, getChannelRecord, isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/buzz/src/secret-contract.ts
const fields = ["privateKey", "authTag"];
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "buzz",
	account: fields,
	channel: fields
});
function collectRuntimeConfigAssignments(params) {
	const root = getChannelRecord(params.config, "buzz");
	if (!root) return;
	const collect = (accountId, account, rootIdentity = false) => {
		const resolved = resolveBuzzAccountConfig({
			cfg: params.config,
			accountId
		});
		const active = resolved.config.enabled !== false && (!rootIdentity || resolved.allowEnv);
		const configPath = rootIdentity ? "channels.buzz" : resolved.configPath;
		for (const field of fields) collectSecretInputAssignment({
			value: account[field],
			path: `${configPath}.${field}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason: "Buzz identity is disabled or replaced by accounts.default.",
			owner: {
				ownerKind: "account",
				ownerId: `buzz:${accountId}`,
				requiredForGateway: false,
				disposition: "isolate",
				contract: resolved.config
			},
			apply: (value) => {
				account[field] = value;
			}
		});
	};
	collect("default", root, true);
	if (isRecord(root.accounts)) {
		for (const [accountId, account] of Object.entries(root.accounts).toSorted(([a], [b]) => a.localeCompare(b))) if (isRecord(account)) collect(accountId, account);
	}
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

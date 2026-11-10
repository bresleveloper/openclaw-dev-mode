import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as createChannelSecretContract, n as collectNestedChannelFieldAssignments, r as collectSimpleChannelFieldAssignments } from "./channel-secret-basic-runtime-BEYtUzPu.mjs";
import { i as hasConfiguredAccountValue } from "./account-helpers-Bj9HVUkM.mjs";
import "./channel-secret-basic-runtime-B9c3FTNh.mjs";
import "./account-helpers-BE_40Efg.mjs";
//#region extensions/x/src/secret-contract.ts
const fields = [
	"clientSecret",
	"refreshToken",
	"bearerToken"
];
const channelSecrets = createChannelSecretContract({
	channelKey: "x",
	account: [...fields, "verifiedFromGitHub.token"],
	channel: [...fields, "verifiedFromGitHub.token"],
	hasImplicitDefaultAccount: ({ channel }) => [
		"userId",
		"clientId",
		"refreshToken"
	].some((key) => hasConfiguredAccountValue(channel[key])),
	collect(params) {
		for (const field of fields) collectSimpleChannelFieldAssignments({
			...params,
			field,
			topInactiveReason: `no enabled X account inherits this top-level ${field}.`,
			accountInactiveReason: "X account is disabled."
		});
		const githubConfig = (config) => isRecord(config.verifiedFromGitHub) ? config.verifiedFromGitHub : {};
		const base = githubConfig(params.channel);
		const hasRepo = (account) => Boolean(githubConfig(account).repo ?? base.repo);
		collectNestedChannelFieldAssignments({
			...params,
			nestedKey: "verifiedFromGitHub",
			field: "token",
			topLevelActive: params.surface.channelEnabled && Boolean(base.repo),
			topLevelInheritedAccountActive: ({ account, enabled }) => enabled && hasRepo(account) && !Object.hasOwn(githubConfig(account), "token"),
			accountActive: ({ account, enabled }) => enabled && hasRepo(account),
			topInactiveReason: "no enabled X account with a GitHub repository inherits this verifiedFromGitHub token.",
			accountInactiveReason: "X account is disabled or verifiedFromGitHub.repo is unset."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

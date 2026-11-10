import { hasConfiguredNextcloudAccount } from "../configured-state.js";
import { collectSimpleChannelFieldAssignments, createChannelSecretContract } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/nextcloud-talk/src/secret-contract.ts
const channelSecrets = createChannelSecretContract({
	channelKey: "nextcloud-talk",
	account: ["apiPassword", "botSecret"],
	channel: ["apiPassword", "botSecret"],
	hasImplicitDefaultAccount: ({ context }) => hasConfiguredNextcloudAccount(context.sourceConfig.channels?.["nextcloud-talk"], context.env),
	collect(params) {
		for (const field of ["botSecret", "apiPassword"]) collectSimpleChannelFieldAssignments({
			...params,
			field,
			topInactiveReason: `no enabled Nextcloud Talk surface inherits this top-level ${field}.`,
			accountInactiveReason: "Nextcloud Talk account is disabled."
		});
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

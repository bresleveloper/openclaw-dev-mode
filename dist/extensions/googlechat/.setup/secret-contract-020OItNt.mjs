import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { coerceSecretRef } from "openclaw/plugin-sdk/secret-input";
import { createChannelSecretContract, hasOwnProperty, pushAssignment, pushInactiveSurfaceWarning } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/googlechat/src/secret-contract.ts
function accountSecretOwner(accountId) {
	return {
		ownerKind: "account",
		ownerId: `googlechat:${normalizeAccountId(accountId)}`,
		requiredForGateway: false,
		disposition: "isolate"
	};
}
function collectGoogleChatAccountAssignment(params) {
	const ref = coerceSecretRef(params.target.serviceAccount, params.defaults);
	if (!ref) return;
	if (params.ownerAccountIds.length === 0) {
		pushInactiveSurfaceWarning({
			context: params.context,
			path: `${params.path}.serviceAccount`,
			details: params.inactiveReason
		});
		return;
	}
	for (const accountId of params.ownerAccountIds) pushAssignment(params.context, {
		ref,
		path: `${params.path}.serviceAccount`,
		expected: "string-or-object",
		...accountSecretOwner(accountId),
		apply: (value) => {
			params.target.serviceAccount = value;
		}
	});
}
const channelSecrets = createChannelSecretContract({
	channelKey: "googlechat",
	account: [{
		path: "serviceAccount",
		targetType: "channels.googlechat.serviceAccount",
		targetTypeAliases: ["channels.googlechat.accounts.*.serviceAccount"],
		secretShape: "secret_input",
		expectedResolvedValue: "string-or-object",
		accountIdPathSegmentIndex: 3
	}],
	channel: [{
		path: "serviceAccount",
		secretShape: "secret_input",
		expectedResolvedValue: "string-or-object"
	}],
	collect(params) {
		const { channel: googleChat, surface } = params;
		const topLevelServiceAccountOwners = !surface.channelEnabled ? [] : !surface.hasExplicitAccounts ? ["default"] : surface.accounts.filter(({ account, enabled }) => enabled && !hasOwnProperty(account, "serviceAccount")).map(({ accountId }) => accountId);
		collectGoogleChatAccountAssignment({
			target: googleChat,
			path: "channels.googlechat",
			defaults: params.defaults,
			context: params.context,
			ownerAccountIds: topLevelServiceAccountOwners,
			inactiveReason: "no enabled account inherits this top-level Google Chat serviceAccount."
		});
		if (!surface.hasExplicitAccounts) return;
		for (const { accountId, account, enabled } of surface.accounts) {
			if (!hasOwnProperty(account, "serviceAccount")) continue;
			collectGoogleChatAccountAssignment({
				target: account,
				path: `channels.googlechat.accounts.${accountId}`,
				defaults: params.defaults,
				context: params.context,
				ownerAccountIds: enabled ? [accountId] : [],
				inactiveReason: "Google Chat account is disabled."
			});
		}
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

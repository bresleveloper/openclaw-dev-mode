import { coerceSecretRef } from "openclaw/plugin-sdk/secret-input";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createChannelSecretTargetRegistryEntries, getChannelSurface, hasOwnProperty, pushAssignment, pushInactiveSurfaceWarning, resolveChannelAccountSurface } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
//#region extensions/googlechat/src/secret-contract.ts
function accountSecretOwner(accountId) {
	return {
		ownerKind: "account",
		ownerId: `googlechat:${normalizeAccountId(accountId)}`,
		requiredForGateway: false,
		disposition: "isolate"
	};
}
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
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
	}]
});
function resolveSecretInputRef(params) {
	return coerceSecretRef(params.value, params.defaults);
}
function collectGoogleChatAccountAssignment(params) {
	const ref = resolveSecretInputRef({
		value: params.target.serviceAccount,
		defaults: params.defaults
	});
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
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "googlechat");
	if (!resolved) return;
	const googleChat = resolved.channel;
	const surface = resolveChannelAccountSurface(googleChat);
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
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };

import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { s as isOperatorUiClient } from "./message-channel-j-k-Nup3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as withCommandSenderAuthority, t as getCommandSenderAuthority } from "./command-sender-authority-DZxZmstf.mjs";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-q_NaMExM.mjs";
import { n as isSyntheticGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
//#region src/gateway/server-methods/gateway-client-identity.ts
function isGatewayClientProfilePending(client) {
	return Boolean(client?.authenticatedGitHubIdentitySync && !client.authenticatedUserProfile);
}
function authenticatedProfileUnavailableError(message = "Authenticated profile verification is unavailable. Retry shortly; if this continues, contact a gateway administrator.", retryAfterMs = 1e3) {
	return errorShape(ErrorCodes.UNAVAILABLE, message, {
		retryable: true,
		retryAfterMs,
		details: { code: ConnectErrorDetailCodes.AUTHENTICATED_PROFILE_UNAVAILABLE }
	});
}
async function authorizeAuthenticatedProfileForMethod(params) {
	const requiresSessionProfile = params.sessionScope !== void 0;
	const sessionProfileError = () => {
		const actor = resolveGatewayOperatorRoleActor(params.client);
		return requiresSessionProfile && (actor?.kind !== "operator" || !actor.profileId.trim()) ? errorShape(ErrorCodes.FORBIDDEN, "Session-scoped access requires a verified user profile.") : null;
	};
	const sync = params.client?.authenticatedGitHubIdentitySync;
	if (!sync || params.client?.authenticatedUserProfile?.profileId.trim()) return sessionProfileError();
	if (!requiresSessionProfile && !params.requiresProfile()) return null;
	try {
		await sync();
	} catch {
		return authenticatedProfileUnavailableError();
	}
	return params.client?.authenticatedUserProfile?.profileId.trim() ? sessionProfileError() : authenticatedProfileUnavailableError();
}
function gatewayClientSenderFields(client) {
	if (client?.internal?.senderAttribution) return { sender: client.internal.senderAttribution };
	const profile = client?.authenticatedUserProfile;
	if (profile) return { sender: {
		id: profile.profileId,
		...!client?.internal?.syntheticClient ? { identity: {
			type: "profile",
			id: profile.profileId
		} } : {},
		...profile.displayName ? { name: profile.displayName } : {}
	} };
	if (client?.authenticatedGitHubIdentitySync) return {};
	return client?.authenticatedUserId ? { sender: { id: client.authenticatedUserId } } : {};
}
/** Returns the same durable human profile identity used for session creation attribution. */
function gatewayClientSessionCreator(client) {
	const profile = client?.authenticatedUserProfile;
	return profile ? {
		type: "human",
		id: profile.profileId,
		...profile.displayName ? { label: profile.displayName } : {}
	} : void 0;
}
/** Authenticated ingress facts shared by chat execution and its current caller controls. */
function resolveChatSendCallerContext(client, clientInfo = client?.connect?.client, originatingChannel = INTERNAL_MESSAGE_CHANNEL) {
	const synthetic = isSyntheticGatewayCaller(client ?? null);
	const commandSenderAuthority = synthetic ? void 0 : getCommandSenderAuthority(client) ?? (() => client?.authenticatedUserId && !client.invalidated && !client.connectionSignal?.aborted && !isSyntheticGatewayCaller(client) ? client.authenticatedUserProfile?.profileId : void 0);
	return withCommandSenderAuthority({
		Provider: INTERNAL_MESSAGE_CHANNEL,
		Surface: INTERNAL_MESSAGE_CHANNEL,
		OriginatingChannel: originatingChannel,
		ChatType: "direct",
		ApprovalReviewerDeviceId: normalizeOptionalString(client?.connect?.device?.id),
		...!synthetic && !isOperatorUiClient(clientInfo) ? {
			SenderId: clientInfo?.id,
			SenderName: clientInfo?.displayName,
			SenderUsername: clientInfo?.displayName
		} : {},
		GatewayClientScopes: client?.connect?.scopes ?? [],
		GatewayClientCaps: client?.connect?.caps ?? []
	}, commandSenderAuthority);
}
//#endregion
export { isGatewayClientProfilePending as a, gatewayClientSessionCreator as i, authorizeAuthenticatedProfileForMethod as n, resolveChatSendCallerContext as o, gatewayClientSenderFields as r, authenticatedProfileUnavailableError as t };

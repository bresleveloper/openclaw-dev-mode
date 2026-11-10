import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-DhaB57zU.mjs";
import { n as withCommandSenderAuthority, t as getCommandSenderAuthority } from "./command-sender-authority-DZxZmstf.mjs";
import { n as gitHubPublicApi } from "./github-public-api-Dk3IZSKx.mjs";
import { r as isSyntheticGatewayCaller } from "./gateway-personal-caller-BLfLqLHg.mjs";
//#region src/gateway/server-methods/gateway-client-identity.ts
function isGatewayClientProfilePending(client) {
	return Boolean(client?.authenticatedGitHubIdentitySync && !client.authenticatedUserProfile);
}
/** A GitHub quota failure names its cause and carries GitHub's reset deadline. */
function authenticatedProfileUnavailableError(cause) {
	const rateLimited = cause instanceof Error && cause.name === "ControlUiGitHubError" && cause instanceof gitHubPublicApi.ControlUiGitHubError && cause.statusCode === 429;
	return errorShape(ErrorCodes.UNAVAILABLE, rateLimited ? "GitHub is rate limiting profile verification. Retry shortly; if this continues, ask a gateway administrator to check the GitHub API credential." : "Authenticated profile verification is unavailable. Retry shortly; if this continues, contact a gateway administrator.", {
		retryable: true,
		retryAfterMs: rateLimited && cause.retryAfterMs || 1e3,
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
	} catch (error) {
		return authenticatedProfileUnavailableError(error);
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
	return !client?.authenticatedGitHubIdentitySync && client?.authenticatedUserId ? { sender: { id: client.authenticatedUserId } } : {};
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
	const commandSenderAuthority = synthetic ? void 0 : getCommandSenderAuthority(client) ?? (() => {
		if (!client || client.invalidated || client.connectionSignal?.aborted || isSyntheticGatewayCaller(client)) return;
		const delegated = client.internal?.remoteIngressPrincipal;
		if (delegated) {
			try {
				delegated.signal.throwIfAborted();
				delegated.assertCurrent();
			} catch {
				return;
			}
			return delegated.operatorRoleActor.kind === "operator" && client.internal?.operatorRoleActor?.kind === "operator" && delegated.operatorRoleActor.profileId === client.internal.operatorRoleActor.profileId && delegated.operatorRoleActor.profileId === client.authenticatedUserProfile?.profileId ? delegated.operatorRoleActor.profileId : void 0;
		}
		return client.authenticatedUserId ? client.authenticatedUserProfile?.profileId : void 0;
	});
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

import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { a as isDirectGatewayChatUserTurn, s as resolveGatewayChatCronCreatorAuthorityAdmission } from "./skill-library-authoring-DLJtuvj0.mjs";
import { t as handleChatSend } from "./chat-send-handler-BoIwRdj6.mjs";
//#region src/gateway/server-methods/chat-send-external-entry.ts
const externalAuthorityAdmission = {
	allowsDashboardReads: (params) => params.client?.internal?.authenticatedControlUi === true && authorizeOperatorScopesForMethod("chat.send", params.client.connect.scopes ?? []).allowed && isDirectGatewayChatUserTurn({
		...params,
		resolvedSessionKey: params.sessionKey,
		isIncognito: params.isIncognitoEntry || isIncognitoSessionKey(params.sessionKey),
		isDirectExternalUser: true
	}),
	resolve: (params) => {
		const authority = resolveGatewayChatCronCreatorAuthorityAdmission({
			...params,
			resolvedSessionKey: params.sessionKey,
			isIncognito: params.isIncognitoEntry || isIncognitoSessionKey(params.sessionKey),
			isDirectExternalUser: true
		});
		return authority ? createCronCreatorAuthorityCapability(authority.runId, authority.callerOrigin, authority.managementEntitlement, authority.isCurrent, void 0, authority.requesterOwner, authority.callerScopedCreation) : void 0;
	},
	run: (capability, run, signal) => runWithCronCreatorAuthorityCapability(capability, run, signal)
};
/** Authenticated external chat entry; internal re-entry must call handleChatSend directly. */
function handleDirectExternalChatSend(options, onAdmissionOwned) {
	return handleChatSend(options, onAdmissionOwned, externalAuthorityAdmission);
}
//#endregion
export { handleDirectExternalChatSend as t };

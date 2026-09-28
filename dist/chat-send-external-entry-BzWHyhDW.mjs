import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-DhhZn7kB.mjs";
import { n as resolveGatewayChatCronCreatorAuthorityAdmission, t as isDirectGatewayChatUserTurn } from "./cron-creator-authority-admission-CDUOlqs8.mjs";
import { t as handleChatSend } from "./chat-send-handler--coYiPWx.mjs";
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
			runId: params.runId,
			resolvedSessionKey: params.sessionKey,
			spawnedBy: params.spawnedBy,
			client: params.client,
			isCurrent: params.isCurrent,
			inputProvenance: params.inputProvenance,
			hasExplicitOrigin: params.hasExplicitOrigin,
			hasRestoredCronContinuation: params.hasRestoredCronContinuation,
			isIncognito: params.isIncognitoEntry || isIncognitoSessionKey(params.sessionKey),
			isReconnectResume: params.isReconnectResume,
			isSystemGenerated: params.isSystemGenerated,
			turnKind: params.turnKind,
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

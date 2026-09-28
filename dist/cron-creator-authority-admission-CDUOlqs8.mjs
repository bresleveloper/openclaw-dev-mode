import { s as consumeRequesterCronAuthorityAdmission, u as revokeRequesterCronAuthority } from "./requester-final-attachment-BkyW5G5X.mjs";
import { n as clientHasAdminScope } from "./agent-handler-helpers-D5WeGQeH.mjs";
//#region src/gateway/server-methods/cron-creator-authority-admission.ts
function isDirectGatewayUserTurn(params) {
	const internal = params.client?.internal;
	return params.runId.trim().length > 0 && params.client != null && Boolean(params.resolvedSessionKey?.trim()) && !params.spawnedBy?.trim() && params.inputProvenance === void 0 && !params.disallowed && internal?.syntheticClient !== true && internal?.senderAttribution === void 0 && internal?.approvalRuntime !== true && internal?.cronRunContinuation !== true && internal?.agentRuntimeIdentity === void 0 && internal?.pluginRuntimeOwnerId === void 0 && internal?.agentRunTracking === void 0 && internal?.pluginSubagentRequester === void 0 && internal?.runtimePluginToolGrant === void 0 && internal?.delegatedToolPolicyHandoffId === void 0;
}
function resolveDirectOperatorAuthority(params) {
	const internal = params.client?.internal;
	const runId = params.runId.trim();
	const isDirectTurn = isDirectGatewayUserTurn(params);
	if (isDirectTurn && params.resolvedSessionKey) revokeRequesterCronAuthority(params.resolvedSessionKey);
	return isDirectTurn && clientHasAdminScope(params.client ?? null) && (internal?.isLocalClient === true || internal?.controlUiAdmin === true) ? Object.freeze({
		runId,
		callerOrigin: internal?.isLocalClient === true ? { kind: "local" } : { kind: "unknown" },
		...internal?.controlUiAdmin === true ? { managementEntitlement: { source: "control-ui-admin" } } : {},
		...internal?.isLocalClient !== true ? { callerScopedCreation: true } : {},
		...params.isCurrent ? { isCurrent: params.isCurrent } : {}
	}) : void 0;
}
/** Mints cron authority for an admitted local operator or authenticated Control UI admin turn. */
function resolveGatewayCronCreatorAuthorityAdmission(params) {
	const request = params.request;
	if (params.client?.internal?.syntheticClient === true && !params.hasRestoredCronContinuation && !params.isOneShotModelRun && !params.isRestartRecoveryResumeRun) {
		const continuation = consumeRequesterCronAuthorityAdmission({
			runId: params.runId,
			sessionKey: params.resolvedSessionKey,
			sessionId: params.sessionId,
			inputProvenance: params.inputProvenance
		});
		if (continuation) return continuation;
	}
	return resolveDirectOperatorAuthority({
		runId: params.runId,
		resolvedSessionKey: params.resolvedSessionKey,
		spawnedBy: params.spawnedBy,
		client: params.client,
		isCurrent: params.isCurrent,
		inputProvenance: params.inputProvenance,
		disallowed: params.hasRestoredCronContinuation || params.isOneShotModelRun || params.isRestartRecoveryResumeRun || request.modelRun === true || request.acpTurnSource !== void 0 || request.internalRuntimeHandoffId !== void 0 || request.internalExecutionIdentityRetry === true || request.internalExecutionIdentityRecoveryAttempt !== void 0 || request.execApprovalFollowupExpectedSessionId !== void 0 || request.internalEvents !== void 0 || request.sessionEffects === "internal" || request.suppressPromptPersistence === true || request.swarmCollector === true || request.lane === "subagent"
	});
}
/** Current external user input, independently of the permission being admitted. */
function isDirectGatewayChatUserTurn(params) {
	return isDirectGatewayUserTurn({
		runId: params.runId,
		resolvedSessionKey: params.resolvedSessionKey,
		spawnedBy: params.spawnedBy,
		client: params.client,
		inputProvenance: params.inputProvenance,
		disallowed: !params.isDirectExternalUser || params.hasExplicitOrigin || params.hasRestoredCronContinuation || params.isSystemGenerated || params.turnKind !== "main"
	});
}
/** Mints the same authority for an admitted ordinary operator chat.send turn. */
function resolveGatewayChatCronCreatorAuthorityAdmission(params) {
	return resolveDirectOperatorAuthority({
		...params,
		disallowed: params.isIncognito || params.isReconnectResume || !isDirectGatewayChatUserTurn(params)
	});
}
//#endregion
export { resolveGatewayChatCronCreatorAuthorityAdmission as n, resolveGatewayCronCreatorAuthorityAdmission as r, isDirectGatewayChatUserTurn as t };

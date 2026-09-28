import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { D as findSwarmCollectorSession, E as findAuthorizedSwarmCollectorRequest } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { _ as shouldPreserveUserFacingSessionStateForInputProvenance, f as isMainSessionRestartRecoveryInputProvenance, h as normalizeInputProvenance, p as isProgressCardRefreshInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import "./sessions-Cesa3L0p.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-DzGhB4EH.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-C7Yo0FcH.mjs";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-sV3cxQP9.mjs";
import { t as validateStructuredOutputSchema } from "./swarm-output-schema-DNSlCvKq.mjs";
import { a as parseExecApprovalFollowupApprovalId } from "./bash-tools.exec-approval-followup-state-HII0ITe7.mjs";
import { a as resolveAgentDedupeKeys, d as resolveExpectedExistingSessionConstraint, r as readGatewayDedupeEntry } from "./agent-dedupe-CcOvz-r6.mjs";
import { a as resolveAllowModelOverrideFromClient, o as resolveCanUseCronRunContinuation, s as resolveCanUseInternalRuntimeHandoff } from "./agent-handler-helpers-D5WeGQeH.mjs";
import path from "node:path";
//#region src/gateway/agent-turn/agent-request-preflight.ts
function prepareAgentRequestPreflight(params) {
	const { request } = params;
	const cfg = params.context.getRuntimeConfig();
	const canUseInternalRuntimeHandoff = resolveCanUseInternalRuntimeHandoff(params.client);
	const requestSessionKey = request.sessionKey?.trim();
	const parsedRequestSessionKey = requestSessionKey ? parseAgentSessionKey(requestSessionKey) : void 0;
	const bareSessionAgent = requestSessionKey && !parsedRequestSessionKey ? resolveRequestedSessionAgentId(cfg, requestSessionKey, request.agentId) : void 0;
	if (bareSessionAgent && !bareSessionAgent.ok) {
		params.io.emitAcceptance([
			false,
			void 0,
			bareSessionAgent.error
		]);
		return;
	}
	const selectedAgentId = requestSessionKey ? parsedRequestSessionKey?.agentId ?? bareSessionAgent?.agentId ?? normalizeOptionalString(request.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg) : normalizeOptionalString(request.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg);
	const refusal = selectedAgentId ? readAgentDatabaseAdmissionRefusal(selectedAgentId) : void 0;
	if (refusal) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, `${refusal.reason}\n${refusal.repairHint}`, { details: refusal })
		]);
		return;
	}
	const collectorSession = findSwarmCollectorSession(requestSessionKey);
	const persistedCollectorSession = !collectorSession && requestSessionKey && isSubagentSessionKey(requestSessionKey) ? loadSessionEntry({
		...selectedAgentId ? { agentId: selectedAgentId } : {},
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: selectedAgentId }),
		sessionKey: requestSessionKey
	})?.swarmCollector === true : false;
	if (collectorSession || persistedCollectorSession || request.swarmCollector === true || request.swarmOutputSchema !== void 0) {
		const schemaError = request.swarmOutputSchema ? validateStructuredOutputSchema(request.swarmOutputSchema) : void 0;
		if (request.swarmCollector !== true || schemaError) {
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.INVALID_REQUEST, schemaError ?? "active swarm collector sessions require swarmCollector=true")
			]);
			return;
		}
		const registeredCollector = findAuthorizedSwarmCollectorRequest({
			childSessionKey: request.sessionKey,
			idempotencyKey: request.idempotencyKey,
			outputSchema: request.swarmOutputSchema
		});
		const collectorDedupe = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: resolveAgentDedupeKeys({ idempotencyKey: request.idempotencyKey })
		});
		const swarmRequesterSessionKey = registeredCollector?.swarmRequesterSessionKey ?? registeredCollector?.requesterSessionKey;
		const swarmEnabled = resolveSwarmConfig(cfg, registeredCollector?.requesterAgentId ?? (swarmRequesterSessionKey ? parseAgentSessionKey(swarmRequesterSessionKey)?.agentId ?? selectedAgentId : selectedAgentId)).enabled;
		const pendingCollectorLaunch = registeredCollector?.swarmLaunchPending === true && !registeredCollector.collectorCompletion && typeof registeredCollector.execution.endedAt !== "number";
		if (!swarmEnabled && !collectorDedupe || !canUseInternalRuntimeHandoff || request.lane !== "subagent" || !registeredCollector || !pendingCollectorLaunch && !collectorDedupe) {
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.INVALID_REQUEST, "swarm collector fields require an enabled, host-registered collector run")
			]);
			return;
		}
	}
	if (request.cwd && !path.isAbsolute(request.cwd)) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "cwd must be absolute")
		]);
		return;
	}
	if (request.cwd && !normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId)) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "cwd is reserved for plugin-owned subagent runs")
		]);
		return;
	}
	const allowModelOverride = resolveAllowModelOverrideFromClient(params.client);
	const canUseCronRunContinuation = resolveCanUseCronRunContinuation(params.client);
	const expectedSessionResult = resolveExpectedExistingSessionConstraint({
		canUseInternalRuntimeHandoff,
		expectedExistingSessionId: request.expectedExistingSessionId,
		internalRuntimeHandoffId: request.internalRuntimeHandoffId
	});
	if (!expectedSessionResult.ok) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, expectedSessionResult.error)
		]);
		return;
	}
	const requestedPromptPersistenceSuppression = request.suppressPromptPersistence === true;
	const requestedInternalSessionEffects = request.sessionEffects === "internal";
	const requestedModelOverride = Boolean(request.provider || request.model);
	const isOneShotModelRun = request.modelRun === true;
	const isRawModelRun = isOneShotModelRun || request.promptMode === "none";
	if (request.promptMode === "none" && !isOneShotModelRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "promptMode=\"none\" requires modelRun=true so the run cannot mutate a durable session.")
		]);
		return;
	}
	if (requestedModelOverride && !allowModelOverride) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "provider/model overrides are not authorized for this caller.")
		]);
		return;
	}
	if ((requestedInternalSessionEffects || requestedPromptPersistenceSuppression) && !canUseInternalRuntimeHandoff) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "internal session-effect controls are reserved for backend callers.")
		]);
		return;
	}
	const runId = request.idempotencyKey;
	const execApprovalFollowupApprovalId = parseExecApprovalFollowupApprovalId(runId);
	if (execApprovalFollowupApprovalId && !canUseInternalRuntimeHandoff) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "exec approval followup idempotency keys are reserved for backend callers.")
		]);
		return;
	}
	const inputProvenance = normalizeInputProvenance(request.inputProvenance);
	if (isProgressCardRefreshInputProvenance(inputProvenance) && !canUseInternalRuntimeHandoff) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "Progress refresh input is reserved for progressCard.refresh.")
		]);
		return;
	}
	if (inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool === "sessions_send") {
		const sourceSessionKey = inputProvenance.sourceSessionKey;
		const sourceAgentId = parseAgentSessionKey(sourceSessionKey)?.agentId;
		const sourceTarget = sourceSessionKey && sourceAgentId ? resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: sourceSessionKey,
			agentId: sourceAgentId,
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "full"
		}) : void 0;
		const sourceEntry = sourceTarget ? sourceTarget.store[sourceTarget.canonicalKey] : void 0;
		let sourceIsSubagent = Boolean(sourceTarget && isSubagentSessionFromEntry(sourceTarget.canonicalKey, sourceEntry));
		if (!sourceIsSubagent && sourceTarget && sourceEntry && (sourceEntry.parentSessionKey || sourceEntry.spawnedBy)) sourceIsSubagent = isSubagentSessionFromEntry(sourceTarget.canonicalKey, sourceEntry, readAcpSessionMetaForEntry({
			sessionKey: sourceTarget.canonicalKey,
			agentId: sourceTarget.agentId,
			cfg,
			entry: sourceEntry
		}));
		if (sourceIsSubagent) inputProvenance.sourceRole = "subagent";
		else delete inputProvenance.sourceRole;
	}
	const isRestartRecoveryResumeRun = canUseInternalRuntimeHandoff && isMainSessionRestartRecoveryInputProvenance(inputProvenance);
	if ((request.internalExecutionIdentityRetry !== void 0 || request.internalExecutionIdentityRecoveryAttempt !== void 0) && !isRestartRecoveryResumeRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "internal execution identity recovery fields are reserved for main-session restart recovery.")
		]);
		return;
	}
	if (request.forceCodeModeTools === true && !isRestartRecoveryResumeRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "forceCodeModeTools is reserved for main-session restart recovery.")
		]);
		return;
	}
	const sessionEffects = isOneShotModelRun || requestedInternalSessionEffects ? "internal" : request.sessionEffects;
	const agentDedupeKeys = resolveAgentDedupeKeys({
		idempotencyKey: runId,
		execApprovalFollowupApprovalId
	});
	return {
		request,
		cfg,
		runId,
		allowModelOverride,
		canUseInternalRuntimeHandoff,
		canUseCronRunContinuation,
		expectedSession: expectedSessionResult.constraint,
		expectedExistingSessionId: expectedSessionResult.constraint?.sessionId,
		providerOverride: allowModelOverride ? request.provider : void 0,
		modelOverride: allowModelOverride ? request.model : void 0,
		execApprovalFollowupApprovalId,
		normalizedSpawned: normalizeSpawnedRunMetadata({
			groupId: request.groupId,
			groupChannel: request.groupChannel,
			groupSpace: request.groupSpace
		}),
		inputProvenance,
		isRestartRecoveryResumeRun,
		preserveUserFacingSessionModelState: canUseInternalRuntimeHandoff && shouldPreserveUserFacingSessionStateForInputProvenance(inputProvenance),
		sessionEffects,
		suppressVisibleSessionEffects: sessionEffects === "internal",
		requestedPromptPersistenceSuppression,
		isOneShotModelRun,
		isRawModelRun,
		agentDedupeKeys
	};
}
//#endregion
export { prepareAgentRequestPreflight as t };

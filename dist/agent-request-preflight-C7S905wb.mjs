import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, s as createAgentDatabaseAdmissionErrorShape } from "./agent-database-admission-CeDA0ojh.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance, h as normalizeInputProvenance, p as isProgressCardRefreshInputProvenance, v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./sessions-CnzPI1yx.mjs";
import { a as getSwarmRunExecutionLane } from "./swarm-scheduler-CocpuN_N.mjs";
import { n as findSwarmCollectorSession, t as findAuthorizedSwarmCollectorRequest } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { o as withGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-eTFubFiU.mjs";
import { i as resolveExpectedExistingSessionConstraint } from "./agent-expected-session-DKWGh5jI.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-CIQf_kSH.mjs";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-B5FDP6Bm.mjs";
import { t as validateStructuredOutputSchema } from "./swarm-output-schema-DyYkyvww.mjs";
import { a as readGatewayDedupeEntry, s as resolveAgentDedupeKeys } from "./agent-dedupe-1ZfUSRQd.mjs";
import { a as parseExecApprovalFollowupApprovalId } from "./bash-tools.exec-approval-followup-state-BqTxtUdJ.mjs";
import path from "node:path";
//#region src/gateway/agent-turn/agent-request-preflight.ts
async function prepareAgentRequestPreflight(params) {
	const { request } = params;
	const rejectInvalidRequest = (message) => {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, message)
		]);
	};
	const cfg = params.context.getRuntimeConfig();
	const canUseInternalRuntimeHandoff = params.client?.connect?.client?.mode === GATEWAY_CLIENT_MODES.BACKEND;
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
	const selectedAgentId = parsedRequestSessionKey?.agentId ?? bareSessionAgent?.agentId ?? normalizeOptionalString(request.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg);
	const refusal = selectedAgentId ? readAgentDatabaseAdmissionRefusal(selectedAgentId) : void 0;
	if (refusal) {
		params.io.emitAcceptance([
			false,
			void 0,
			createAgentDatabaseAdmissionErrorShape(refusal)
		]);
		return;
	}
	const collectorSession = findSwarmCollectorSession(requestSessionKey, selectedAgentId);
	let swarmExecutionLane;
	const persistedCollectorSession = !collectorSession && requestSessionKey && isSubagentSessionKey(requestSessionKey) ? (await readSessionEntryReadOnlyInWorker({
		...selectedAgentId ? { agentId: selectedAgentId } : {},
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: selectedAgentId }),
		sessionKey: requestSessionKey
	}))?.swarmCollector === true : false;
	if (collectorSession || persistedCollectorSession || request.swarmCollector === true || request.swarmOutputSchema !== void 0) {
		const schemaError = request.swarmOutputSchema ? validateStructuredOutputSchema(request.swarmOutputSchema) : void 0;
		if (request.swarmCollector !== true || schemaError) return rejectInvalidRequest(schemaError ?? "active swarm collector sessions require swarmCollector=true");
		const registeredCollector = findAuthorizedSwarmCollectorRequest({
			childSessionKey: request.sessionKey,
			childAgentId: selectedAgentId,
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
		if (!swarmEnabled && !collectorDedupe || !canUseInternalRuntimeHandoff || request.lane !== "subagent" || !registeredCollector || !pendingCollectorLaunch && !collectorDedupe) return rejectInvalidRequest("swarm collector fields require an enabled, host-registered collector run");
		swarmExecutionLane = getSwarmRunExecutionLane(registeredCollector.schedulerSlotId ?? registeredCollector.runId);
	}
	if (request.cwd && !path.isAbsolute(request.cwd)) return rejectInvalidRequest("cwd must be absolute");
	if (request.cwd && !normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId)) return rejectInvalidRequest("cwd is reserved for plugin-owned subagent runs");
	const allowModelOverride = hasGatewayAdminScope(params.client) || params.client?.internal?.allowModelOverride === true;
	const canUseCronRunContinuation = params.client?.internal?.cronRunContinuation === true;
	const expectedSessionResult = resolveExpectedExistingSessionConstraint({
		canUseInternalRuntimeHandoff,
		expectedExistingSessionId: request.expectedExistingSessionId,
		expectedExistingSessionLifecycleRevision: request.expectedExistingSessionLifecycleRevision,
		internalRuntimeHandoffId: request.internalRuntimeHandoffId
	});
	if (!expectedSessionResult.ok) return rejectInvalidRequest(expectedSessionResult.error);
	const requestedPromptPersistenceSuppression = request.suppressPromptPersistence === true;
	const requestedInternalSessionEffects = request.sessionEffects === "internal";
	const requestedModelOverride = Boolean(request.provider || request.model);
	const isOneShotModelRun = request.modelRun === true;
	const isRawModelRun = isOneShotModelRun || request.promptMode === "none";
	if (request.promptMode === "none" && !isOneShotModelRun) return rejectInvalidRequest("promptMode=\"none\" requires modelRun=true so the run cannot mutate a durable session.");
	if (requestedModelOverride && !allowModelOverride) return rejectInvalidRequest("provider/model overrides are not authorized for this caller.");
	if ((requestedInternalSessionEffects || requestedPromptPersistenceSuppression) && !canUseInternalRuntimeHandoff) return rejectInvalidRequest("internal session-effect controls are reserved for backend callers.");
	const runId = request.idempotencyKey;
	const execApprovalFollowupApprovalId = parseExecApprovalFollowupApprovalId(runId);
	if (execApprovalFollowupApprovalId && !canUseInternalRuntimeHandoff) return rejectInvalidRequest("exec approval followup idempotency keys are reserved for backend callers.");
	const inputProvenance = normalizeInputProvenance(request.inputProvenance);
	if (isProgressCardRefreshInputProvenance(inputProvenance) && !canUseInternalRuntimeHandoff) return rejectInvalidRequest("Progress refresh input is reserved for progressCard.refresh.");
	if (inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool === "sessions_send") {
		const sourceSessionKey = inputProvenance.sourceSessionKey;
		const sourceAgentId = parseAgentSessionKey(sourceSessionKey)?.agentId;
		const sourceTarget = sourceSessionKey && sourceAgentId ? await withGatewaySessionStoreTarget({
			cfg,
			key: sourceSessionKey,
			agentId: sourceAgentId,
			projection: "full"
		}, (target) => target) : void 0;
		const sourceEntry = sourceTarget ? sourceTarget.store[sourceTarget.canonicalKey] : void 0;
		let sourceIsSubagent = Boolean(sourceTarget && isSubagentSessionFromEntry(sourceTarget.canonicalKey, sourceEntry));
		if (!sourceIsSubagent && sourceTarget && sourceEntry && (sourceEntry.parentSessionKey || sourceEntry.spawnedBy)) {
			const [sourceAcp] = await readAcpSessionMetaForEntries({
				entries: [{
					sessionKey: sourceTarget.canonicalKey,
					agentId: sourceTarget.agentId,
					entry: sourceEntry
				}],
				cfg
			});
			sourceIsSubagent = isSubagentSessionFromEntry(sourceTarget.canonicalKey, sourceEntry, sourceAcp);
		}
		if (sourceIsSubagent) inputProvenance.sourceRole = "subagent";
		else delete inputProvenance.sourceRole;
	}
	const isRestartRecoveryResumeRun = canUseInternalRuntimeHandoff && isMainSessionRestartRecoveryInputProvenance(inputProvenance);
	if ((request.internalExecutionIdentityRetry !== void 0 || request.internalExecutionIdentityRecoveryAttempt !== void 0) && !isRestartRecoveryResumeRun) return rejectInvalidRequest("internal execution identity recovery fields are reserved for main-session restart recovery.");
	if (request.forceCodeModeTools === true && !isRestartRecoveryResumeRun) return rejectInvalidRequest("forceCodeModeTools is reserved for main-session restart recovery.");
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
		agentDedupeKeys,
		swarmExecutionLane
	};
}
//#endregion
export { prepareAgentRequestPreflight as t };

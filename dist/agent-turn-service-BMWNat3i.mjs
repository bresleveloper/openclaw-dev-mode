import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject, l as readErrorName } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as withoutRuntimeOutput, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as bindGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as emitDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { c as normalizeAgentRunTimeoutPhase, i as classifyAgentRunTerminalOutcome, n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { i as claimAgentRunContext, j as validateAgentRunDelegatedAuthority, o as clearAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, S as isCronSessionKey, T as parseCronRunScopeSuffix, b as isAcpSessionKey, l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape } from "./src-pLJQA6J5.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation, w as runWithGatewayDetachedWorkContinuation, y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { d as hasGatewayAdminScope, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { r as isInternalNonDeliveryChannel, t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./io-DIF-KW3P.mjs";
import { o as readWithdrawnUserTurnInputId } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { c as executionIdentitySpawnAdmission, o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-C1oCXyXC.mjs";
import { c as createOperationalRunInstanceRef, s as createExecutionIdentityRecoveryAdmission, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { l as AGENT_SESSION_RESET_COMMAND_RE } from "./method-scopes-Bcx3NDQr.mjs";
import { a as isInternalMessageChannel, s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { X as createSessionResetBoundaryId, nt as buildMainSessionRecoveryClearPatch, w as buildPersistedUserTurnMessage } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { c as isTimeoutError } from "./error-Bcp4ZyOv.mjs";
import { l as isAgentRunDirectAbortReason, m as resolveAgentRunErrorLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as normalizeCronToolsAllowExecTarget, c as resolveCronToolsAllowExecTargetRecoveryError, i as normalizeCronScheduledToolPolicy, l as restoreCronPinnedExecGrant, r as normalizeCronScheduledToolCallerOrigin } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { f as withExecRequestTurn, n as adoptExecRequestSession } from "./exec-request-context-CWnK9ayt.mjs";
import { c as normalizeDeliveryContext, l as normalizeSessionDeliveryState, o as mergeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { i as resolveExplicitAgentSessionKey, r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { i as sessionDeliveryRoute, n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as setChannelSourceTurnId, i as resolveReplySourceTurnId, o as setChannelSourceTurnSameThreadRequired } from "./source-turn-id-DjBP_DbU.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { a as annotateInterSessionPromptText, h as normalizeInputProvenance, m as isSubagentCoordinationInputProvenance, u as isCompletionReportInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { l as buildSessionCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { c as resolveMaintenanceConfigFromInput, k as resolveRestartRecoveryChannelAuthority, v as hasMainSessionRecoveryClaim } from "./store-maintenance-BqMt1Twc.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-Dx1VbkI8.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity, o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { s as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { r as resetSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as resolveTerminalMainSessionTranscriptRegistryCheck } from "./lifecycle-CKc8qk3B.mjs";
import { a as resolveSessionResetPolicy, i as evaluateSessionFreshness, n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-DlE-iD9Z.mjs";
import { o as resolveChatSendCallerContext, r as gatewayClientSenderFields } from "./gateway-client-identity-DXWhtQve.mjs";
import { a as authorizeResolvedSessionMutationAsync } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { i as resolveSubagentChildAuthority } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { r as normalizeAgentRunTerminalReceipt } from "./agent-run-terminal-receipt-Cxhd8xRy.mjs";
import { r as normalizeAgentRunTerminalReplySnapshot } from "./agent-run-terminal-reply-Cj4mTBR2.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-DY0g8fGW.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import "./session-sharing-DuL10izq.mjs";
import { s as resolvePersistedOverrideModelRef } from "./model-selection-DdQ-ffuG.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-Bx2gzKtO.mjs";
import { r as repairMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-DY4r6VdX.mjs";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { n as resolveSendPolicy } from "./send-policy-D88FrugM.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-BB6L4tWc.mjs";
import { d as isEmbeddedAgentRunAbortableForRunId, j as retainEmbeddedAgentRunAbortabilityForRunId, o as clearEmbeddedAgentRunAbortabilityForRunId } from "./runs-Czr-I6_B.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as hasProviderOwnedSession } from "./entry-freshness-kcEsDHPL.mjs";
import { n as resolveSessionLifecycleTimestampsAsync } from "./lifecycle-read-BY2ebrMY.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import "./cli-session-CBCjrsL6.mjs";
import { s as transitionMainSessionRecovery, t as getMainSessionRecoveryRetryCount } from "./main-session-recovery-state-sCZeKFHp.mjs";
import "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import { i as resolveSessionKeyForRequestCore, n as resolveExistingSessionKeyForRequest, o as clearRotatedSessionMetadata } from "./session-Cb56xLxH.mjs";
import { c as hasNewGeneratedMediaTaskForSessionKey, s as getGeneratedMediaTaskIdsForSessionKey } from "./media-generation-activity-CdYWMYrm.mjs";
import { t as resolveAgentRunSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as errorShapeFromError } from "./error-shape--ChVezuW.mjs";
import { a as withPreparedModelRuntimePluginGenerationScope, i as scopePreparedModelRuntimeLease } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { h as loadPublishedGatewayReplyDispatchRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { n as readAcpSessionEntryAsync } from "./session-meta-read-C9RqVGp2.mjs";
import "./session-meta-DC-FqIqd.mjs";
import { i as deleteMediaBuffer } from "./store-BOkrav0N.mjs";
import { n as readAgentRunTerminalOutcome, t as readAgentRunTerminalError } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { a as consumeAgentRuntimeExecutionLineage, s as readAgentRuntimeExecutionLineage } from "./agent-runtime-identity-token-XE9aO4SS.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-BZGAW2Fb.mjs";
import { t as MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER } from "./main-session-recovery-admission-Chw1atkI.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CIfq4_tj.mjs";
import { a as releaseMainSessionRecoveryOwner, n as commitMainSessionRecovery } from "./main-session-recovery-store-mxhMsBp9.mjs";
import { n as runWithAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { n as completeUserTurnProcessing, r as retainsUserTurnTranscriptMedia, t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
import { u as runWithChatAbortExecution } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { i as registerChatAbortController, o as updateChatRunProvider, s as resolveAgentRunExpiresAtMs, t as abortChatRunById } from "./chat-abort-CKC_-urc.mjs";
import { d as createClosedSessionTranscriptSource, f as createResetBoundaryTranscriptSource } from "./active-sessions-shutdown-tracker-BfdUDClC.mjs";
import { r as hasGeneratedMediaCompletionEvent } from "./internal-event-contract-pF6FHp8g.mjs";
import { o as resolveExactSubagentCompletionEvent } from "./requester-tool-policy-BmPXAdVs.mjs";
import { n as resolveScheduledToolPolicyContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { o as readInProcessSubagentResume } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { r as takeInProcessFreshChildSession } from "./in-process-session-run-1xLeAqeJ.mjs";
import { n as consumeSubagentCompletionToolHandoff } from "./subagent-completion-tool-handoff-D0AAXR3P.mjs";
import { f as readSessionSendDeliveryAdmission } from "./in-process-gateway-DaAxH7mK.mjs";
import { i as resolveAgentSessionGroup, n as normalizeTrustedGroupMetadata, r as registerPluginSubagentRunFromGateway } from "./sessions-spawn-tool-DhFS9chG.mjs";
import { a as validateExpectedExistingSessionTarget, n as assertExpectedExistingSession, r as consumeExpectedSessionWorkAdmission, t as ExpectedExistingSessionChangedError } from "./agent-expected-session-DKWGh5jI.mjs";
import { t as captureRequesterCronAuthorityAdmissionAssertion } from "./requester-cron-authority-DgypcQxN.mjs";
import { a as readFollowupSuccessor, i as readFollowupRequest, t as SessionFollowupCompletion } from "./session-followup-completion-Br4aSJSb.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { n as shouldDowngradeDeliveryToSessionOnly } from "./best-effort-delivery-C0AupLCM.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-D2GvoKZ-.mjs";
import { i as assertParentSubagentResumeSuccessorCurrent, o as prepareParentSubagentResume, r as assertParentSubagentResumeCurrent } from "./sessions-send-communication-B8Ah4YOA.mjs";
import { t as recordSessionParticipantBestEffort } from "./session-participant-recording-CDq1wlt1.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-B5FDP6Bm.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import { _ as normalizeRpcAttachmentsToChatAttachments } from "./session-create-root-lHgGqSce.mjs";
import { s as withCurrentUserTurnInput } from "./user-turn-transcript-runtime-context-T4-x_GL3.mjs";
import { i as runWithCanonicalSkillWorkspace } from "./agent-end-side-effects-qwj0xulU.mjs";
import { r as buildExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-BqQWG-4m.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { n as clearCommittedSessionResetRuntimeState } from "./session-reset-cleanup-u-ZRUSad.mjs";
import { c as attachAgentCommandRecoveryAdmissionFacts, o as withAgentCommandExecutionIdentitySpawnFacts, s as attachAgentCommandAdmissionFacts } from "./agent-command-execution-identity-DsyeMX5O.mjs";
import { t as captureAgentJobSession } from "./agent-job-CU2r4FPt.mjs";
import { a as readGatewayDedupeEntry, i as isPreRegistrationAbortedAgentDedupeEntryForSession, l as setAbortedAgentDedupeEntries, n as buildAbortedAgentPayload, o as replayAgentTurnIfCached, r as isAcceptedAgentDedupePayload, t as AgentRequestReservationEndedError, u as setGatewayDedupeEntries } from "./agent-dedupe-1ZfUSRQd.mjs";
import { n as prepareAgentWaitForTurn } from "./session-request-targets-BnYco3Jn.mjs";
import { n as agentCommandFromGatewayIngress } from "./agent-command-TuJMy8YP.mjs";
import { n as resolveAgentExplicitRecipientSession, r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlanWithSessionRoute } from "./agent-delivery-DbfbUO7k.mjs";
import "./agent-BnqYTRnx.mjs";
import { i as isExecApprovalFollowupSessionRebound, n as claimExecApprovalFollowupRuntimeHandoff, r as finalizeExecApprovalFollowupRuntimeHandoff, s as releaseExecApprovalFollowupRuntimeHandoff } from "./bash-tools.exec-approval-followup-state-BqTxtUdJ.mjs";
import "./session-utils-CGx9I2of.mjs";
import { a as respondDeletedAgentSession, c as waitForCronContinuationReleaseRecovery, i as resolveAgentSessionWorkStartError, l as withoutCronRunContinuation, n as canPrepareAgentSessionWorktree, o as respondUnavailableAgentSession, r as cronContinuationHasReusableRuntime, s as shouldSuppressAgentPromptPersistence, t as CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS, u as yieldAfterAgentAcceptedAck } from "./agent-handler-helpers-BDkV_7rl.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-B-jAIf5T.mjs";
import { i as emitGatewaySessionStartPluginHook, n as performGatewaySessionReset, r as emitGatewaySessionEndPluginHook } from "./session-reset-service-UpoJ2er7.mjs";
import { a as logAttachmentFailure, i as discardPreparedInboundMedia, n as MediaOffloadError, o as parseMessageWithAttachments, s as persistInboundImagesForTranscript, t as INLINE_IMAGE_DURABLE_OMISSION_MARKER } from "./chat-attachments-Bszv8fPA.mjs";
import { c as prepareSkillLibrarySessionCreation, i as prepareSessionWorkspaceForRun } from "./session-create-project-TKtfF63d.mjs";
import { n as resolveVoiceWakeRouteByTrigger, t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-oBBZkItX.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { c as resolveGatewayCronCreatorAuthorityAdmission, i as resolveGatewayInputParticipant, l as retainGatewayOperatorRun, n as prepareGatewaySkillAuthoring } from "./skill-library-authoring-DLJtuvj0.mjs";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-tsWjcE7F.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-WjDnJd4j.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/agent-cron-continuation.ts
function createCronContinuationController(params) {
	let claim;
	let recoveryScheduled = false;
	const release = async (outcome) => {
		const activeClaim = claim;
		if (!activeClaim) return true;
		const baseSessionKey = parseCronRunScopeSuffix(activeClaim.sessionKey).baseSessionKey;
		for (let attempt = 1; attempt <= 3; attempt += 1) try {
			const released = await applySessionEntryExactReplacements({
				activeSessionKey: activeClaim.sessionKey,
				agentId: activeClaim.sessionAgentId,
				requireWriteSuccess: true,
				sessionKeys: baseSessionKey && baseSessionKey !== activeClaim.sessionKey ? [activeClaim.sessionKey, baseSessionKey] : [activeClaim.sessionKey],
				skipMaintenance: false,
				storePath: activeClaim.storePath,
				update: (entries) => {
					const entriesByKey = new Map(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
					let current = entriesByKey.get(activeClaim.sessionKey);
					const marker = current?.cronRunContinuation;
					if (!current || marker?.phase !== "continuing" || marker.ownerRunId !== params.runId || marker.ownerLifecycleGeneration !== params.lifecycleGeneration || marker.lifecycleRevision !== activeClaim.lifecycleRevision) return { result: false };
					const continuationCommittedWork = outcome?.terminalOutcome.reason === "completed" || hasNewGeneratedMediaTaskForSessionKey(activeClaim.sessionKey, activeClaim.mediaTaskIdsBefore, activeClaim.sessionAgentId);
					if (!continuationCommittedWork) current = structuredClone(activeClaim.initialEntry);
					else if (outcome?.terminalOutcome) {
						current.status = outcome.terminalOutcome.status === "ok" ? "done" : outcome.terminalOutcome.status === "timeout" ? "timeout" : "failed";
						current.endedAt = outcome.terminalOutcome.endedAt ?? Date.now();
					}
					const baseEntry = baseSessionKey ? entriesByKey.get(baseSessionKey) : void 0;
					const canPersistToBase = baseSessionKey !== void 0 && baseSessionKey !== activeClaim.sessionKey && baseEntry?.lifecycleRevision === activeClaim.lifecycleRevision;
					const replacements = [];
					if (continuationCommittedWork && canPersistToBase && baseEntry && baseSessionKey) replacements.push({
						sessionKey: baseSessionKey,
						entry: mergeSessionSnapshotChanges({
							initial: withoutCronRunContinuation(activeClaim.initialEntry),
							next: withoutCronRunContinuation(current),
							current: baseEntry
						})
					});
					const { ownerRunId: _ownerRunId, ownerLifecycleGeneration: _ownerLifecycleGeneration, ...releasedMarker } = continuationCommittedWork ? marker : activeClaim.initialEntry.cronRunContinuation ?? marker;
					const baseWasSuperseded = Boolean(baseEntry && baseEntry.lifecycleRevision !== activeClaim.lifecycleRevision);
					current.cronRunContinuation = {
						...releasedMarker,
						phase: "ready",
						basePersisted: releasedMarker.basePersisted === true || canPersistToBase || baseWasSuperseded
					};
					current.updatedAt = Date.now();
					replacements.push({
						sessionKey: activeClaim.sessionKey,
						entry: current
					});
					return {
						replacements,
						result: true
					};
				}
			});
			claim = void 0;
			if (released && baseSessionKey) emitSessionsChanged(params.context, {
				sessionKey: baseSessionKey,
				agentId: activeClaim.sessionAgentId,
				reason: "cron-continuation"
			});
			return released;
		} catch (error) {
			params.context.logGateway.warn(`failed to release cron continuation ${params.runId} (${attempt}/3): ${formatForLog(error)}`);
		}
		return false;
	};
	const releaseWithRecovery = async (outcome, onRecovered) => {
		const released = await release(outcome);
		const recoveryClaim = claim;
		if (released || !recoveryClaim || recoveryScheduled) return released;
		recoveryScheduled = true;
		runWithGatewayIndependentRootWorkContinuation(async () => {
			for (const delayMs of CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS) {
				await waitForCronContinuationReleaseRecovery(delayMs);
				if (claim !== recoveryClaim || getAgentEventLifecycleGeneration() !== params.lifecycleGeneration) return;
				if (await release(outcome)) {
					try {
						onRecovered?.();
					} catch (error) {
						params.context.logGateway.warn(`failed to refresh recovered cron continuation dedupe ${params.runId}: ${formatForLog(error)}`);
					}
					return;
				}
			}
			params.context.logGateway.warn(`cron continuation release recovery exhausted for ${params.runId}`);
		}, "cron:continuation-recovery");
		return false;
	};
	return {
		releaseWithRecovery,
		setClaim: (value) => {
			claim = value;
		}
	};
}
//#endregion
//#region src/gateway/server-methods/agent-session-reset.ts
function sessionResetAckText(reason) {
	return reason === "new" ? "✅ New session started." : "✅ Session reset.";
}
function buildBareSessionResetResult(params) {
	return {
		payloads: [{
			text: params.ackText ?? sessionResetAckText(params.reason),
			isStatusNotice: true
		}],
		meta: {
			durationMs: 0,
			...params.sessionId ? { agentMeta: { sessionId: params.sessionId } } : {}
		}
	};
}
function buildBareSessionResetResponse(params) {
	return {
		runId: params.runId,
		status: "ok",
		summary: "completed",
		result: params.result
	};
}
async function resolveBareSessionResetResult(params) {
	params.assertCurrent?.();
	if (params.request.deliver !== true) return buildBareSessionResetResult(params);
	if (resolveSendPolicy({
		cfg: params.cfg,
		entry: params.sessionEntry,
		sessionKey: params.sessionKey,
		channel: sessionDeliveryChannel(params.sessionEntry),
		chatType: params.sessionEntry?.chatType
	}) === "deny") throw new Error("send blocked by session policy");
	const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		currentSessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		requestedChannel: normalizeOptionalString(params.request.replyChannel) ?? normalizeOptionalString(params.request.channel),
		explicitTo: normalizeOptionalString(params.request.replyTo) ?? normalizeOptionalString(params.request.to),
		explicitThreadId: normalizeOptionalString(params.request.threadId),
		accountId: normalizeOptionalString(params.request.replyAccountId) ?? normalizeOptionalString(params.request.accountId),
		wantsDelivery: true,
		turnSourceChannel: normalizeOptionalString(params.request.channel),
		turnSourceTo: normalizeOptionalString(params.request.to),
		turnSourceAccountId: normalizeOptionalString(params.request.accountId),
		turnSourceThreadId: normalizeOptionalString(params.request.threadId)
	});
	params.assertCurrent?.();
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey)
	});
	const bestEffortDeliver = typeof params.request.bestEffortDeliver === "boolean" ? params.request.bestEffortDeliver : params.sessionKey === mainSessionKey || params.sessionKey === "global" ? true : void 0;
	const request = {
		...params.request,
		channel: deliveryPlan.resolvedChannel,
		to: deliveryPlan.resolvedTo ?? deliveryPlan.baseDelivery.to,
		accountId: deliveryPlan.resolvedAccountId ?? deliveryPlan.baseDelivery.accountId,
		threadId: deliveryPlan.resolvedThreadId
	};
	const originMessageChannel = params.originMessageChannel ?? deliveryPlan.resolvedChannel;
	const { deliverAgentCommandResult } = await import("./delivery.runtime.js");
	params.assertCurrent?.();
	const result = buildBareSessionResetResult(params);
	return await deliverAgentCommandResult({
		cfg: params.cfg,
		deps: params.context.deps,
		runtime: withoutRuntimeOutput(defaultRuntime),
		opts: {
			message: params.ackText ?? sessionResetAckText(params.reason),
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			sessionKey: params.sessionKey,
			deliver: true,
			replyTo: request.replyTo,
			to: request.to,
			replyChannel: request.replyChannel,
			channel: request.channel,
			replyAccountId: request.replyAccountId,
			accountId: request.accountId,
			threadId: request.threadId,
			deliveryTargetMode: deliveryPlan.deliveryTargetMode ?? deliveryPlan.baseDelivery.mode,
			bestEffortDeliver,
			runId: params.runId,
			messageChannel: originMessageChannel,
			runContext: {
				messageChannel: originMessageChannel,
				accountId: request.replyAccountId ?? request.accountId,
				currentThreadTs: request.threadId != null ? String(request.threadId) : void 0
			},
			allowModelOverride: false
		},
		outboundSession: void 0,
		sessionEntry: params.sessionEntry,
		result,
		payloads: result.payloads,
		preparedPlugin: deliveryPlan.plugin,
		assertDeliveryCurrent: params.assertCurrent
	});
}
async function loadBareSessionResetDeliverySession(params) {
	const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: readRuntimeConfig(),
		key: params.sessionKey,
		excludeInternalEffects: true,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return {
		cfg: loaded.cfg,
		entry: loaded.entry,
		agentId: resolveAgentIdFromSessionKey(params.sessionKey, params.agentId)
	};
}
function resolveSessionRuntimeCwd(params) {
	return normalizeOptionalString(params.requestedCwd ?? params.sessionEntry?.spawnedCwd);
}
//#endregion
//#region src/gateway/server-methods/agent-reset-phase.ts
async function runAgentResetPhase(params) {
	const base = {
		requestedSessionKey: params.requestedSessionKey,
		resolvedSessionId: params.resolvedSessionId,
		effectiveTranscriptInputText: params.effectiveTranscriptInputText,
		message: params.message
	};
	const resetCommandMatch = params.message.match(AGENT_SESSION_RESET_COMMAND_RE);
	if (!resetCommandMatch || !params.requestedSessionKey) return {
		...base,
		stop: false,
		accepted: false
	};
	if (params.abortForLifecycleRotation({
		sessionKey: params.requestedSessionKey,
		agentId: params.agentId
	})) return {
		...base,
		stop: true,
		accepted: true
	};
	const postResetMessage = normalizeOptionalString(resetCommandMatch[2]) ?? "";
	if (!hasGatewayAdminScope(params.client)) {
		params.respond(false, void 0, missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}));
		return {
			...base,
			stop: true,
			accepted: false
		};
	}
	const resetReason = normalizeOptionalLowercaseString(resetCommandMatch[1]) === "new" ? "new" : "reset";
	params.assertAdmissionCurrent?.();
	let resetResult;
	try {
		const creation = await prepareSkillLibrarySessionCreation(params.client, params.context.getRuntimeConfig, resolveAgentRunSessionCreation(params.client));
		resetResult = await performGatewaySessionReset({
			key: params.requestedSessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			reason: resetReason,
			commandSource: "gateway:agent",
			armSessionDiffBaselineCapture: true,
			creation,
			...params.client?.authenticatedUserProfile?.profileId ? { requestingOperatorProfileId: params.client.authenticatedUserProfile.profileId } : {},
			...params.client?.internal?.operatorRoleActor ? { operatorRoleActor: params.client.internal.operatorRoleActor } : {},
			assertCurrent: () => {
				params.assertAdmissionCurrent?.();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				assertPreparedSkillLibrarySelection(creation.skillLibrarySelections);
			},
			onCommitted: (commit) => {
				params.setCommittedResetCompletion({
					reason: resetReason,
					sessionId: commit.sessionId,
					sessionKey: commit.key,
					agentId: params.agentId,
					followUpPending: Boolean(postResetMessage)
				});
			}
		});
	} catch (err) {
		if (params.abortForLifecycleRotation({
			sessionKey: params.requestedSessionKey,
			agentId: params.agentId
		})) return {
			...base,
			stop: true,
			accepted: true
		};
		throw err;
	}
	if (!resetResult.ok) {
		params.respond(false, void 0, resetResult.error);
		return {
			...base,
			stop: true,
			accepted: false
		};
	}
	const resetSessionId = "incognitoDeleted" in resetResult ? void 0 : resetResult.entry.sessionId;
	const next = {
		...base,
		requestedSessionKey: resetResult.key,
		resolvedSessionId: resetSessionId ?? params.resolvedSessionId
	};
	const completion = {
		reason: resetReason,
		sessionId: resetSessionId,
		sessionKey: resetResult.key,
		agentId: params.agentId,
		followUpPending: Boolean(postResetMessage)
	};
	params.setCommittedResetCompletion(completion);
	params.assertAdmissionCurrent?.();
	if (postResetMessage) {
		if (params.abortForLifecycleRotation({
			sessionKey: resetResult.key,
			agentId: params.agentId
		})) return {
			...next,
			stop: true,
			accepted: true
		};
		return {
			...next,
			stop: false,
			accepted: false,
			effectiveTranscriptInputText: postResetMessage,
			message: postResetMessage
		};
	}
	try {
		const deliverySession = params.request.deliver === true ? await loadBareSessionResetDeliverySession({
			sessionKey: resetResult.key,
			...params.agentId ? { agentId: params.agentId } : {}
		}) : void 0;
		const resetAckResult = await resolveBareSessionResetResult({
			cfg: deliverySession?.cfg ?? params.cfg,
			context: params.context,
			reason: resetReason,
			sessionId: resetSessionId,
			sessionKey: resetResult.key,
			agentId: deliverySession?.agentId ?? params.agentId,
			sessionEntry: deliverySession?.entry,
			request: params.sessionKeyFromTo ? {
				...params.request,
				to: void 0
			} : params.request,
			runId: params.runId,
			assertCurrent: () => {
				params.assertAdmissionCurrent?.();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			}
		});
		params.assertAdmissionCurrent?.();
		const responsePayload = buildBareSessionResetResponse({
			runId: params.runId,
			result: resetAckResult
		});
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			entry: {
				ts: Date.now(),
				ok: true,
				payload: responsePayload
			}
		});
		params.respond(true, responsePayload, void 0, { runId: params.runId });
		emitSessionsChanged(params.context, {
			sessionKey: resetResult.key,
			...params.agentId ? { agentId: params.agentId } : {},
			reason: resetReason
		});
		return {
			...next,
			stop: true,
			accepted: true
		};
	} catch (err) {
		const error = errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err));
		if (params.request.deliver === true) params.setCommittedResetCompletion({
			...completion,
			replyError: error
		});
		if (params.abortForLifecycleRotation({
			sessionKey: resetResult.key,
			agentId: params.agentId
		})) return {
			...next,
			stop: true,
			accepted: true
		};
		params.respond(false, void 0, error);
		return {
			...next,
			stop: true,
			accepted: false
		};
	}
}
//#endregion
//#region src/gateway/server-methods/agent-session-patch.ts
/** Re-evaluate the entry from each read; callers retain admission and concurrent-rotation fencing. */
async function evaluateAgentSessionReuse(params) {
	const lifecycleTimestamps = params.freshEntry ? await resolveSessionLifecycleTimestampsAsync({
		entry: params.freshEntry,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		sessionKey: params.canonicalSessionKey
	}) : void 0;
	const skipImplicitExpiry = params.expectedExistingSessionId !== void 0 || params.hasRestoredCronContinuation || params.freshEntry?.modelSelectionLocked === true || params.resetPolicy.configured !== true && hasProviderOwnedSession(params.freshEntry);
	const freshness = params.freshEntry ? skipImplicitExpiry ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: params.freshEntry.updatedAt,
		...lifecycleTimestamps,
		now: params.now,
		policy: params.resetPolicy
	}) : void 0;
	const requestedSessionMatchesEntry = Boolean(params.requestedSessionId && params.freshEntry?.sessionId?.trim() === params.requestedSessionId);
	const terminalCheck = params.isSystemGatewayRun || requestedSessionMatchesEntry ? void 0 : resolveTerminalMainSessionTranscriptRegistryCheck({
		entry: params.freshEntry,
		sessionScope: params.cfg.session?.scope,
		sessionKey: params.canonicalSessionKey,
		agentId: params.sessionAgentId,
		mainKey: params.cfg.session?.mainKey,
		storePath: params.storePath
	});
	const failedSession = params.freshEntry?.status === "failed" && Boolean(params.freshEntry.sessionId?.trim());
	const needsMetadata = failedSession || terminalCheck !== void 0;
	const metadata = params.freshEntry && needsMetadata ? await readSessionTranscriptAnchorsAsync({
		agentId: params.sessionAgentId,
		sessionId: params.freshEntry.sessionId,
		sessionKey: params.canonicalSessionKey,
		storePath: params.storePath
	}, {
		entryIds: [],
		includeMetadata: true
	}).then((facts) => facts.metadata, () => void 0) : void 0;
	const terminalMainTranscriptNewerThanRegistry = Boolean(terminalCheck && metadata?.updatedAt != null && Number.isFinite(metadata.updatedAt) && Math.floor(metadata.updatedAt) > Math.floor(metadata.observedAt ?? terminalCheck.registryTimestampMs));
	const recoverableTerminalSession = Boolean(params.freshEntry?.sessionId) && params.visibleRequest && isRecoverableTerminalSessionStatus(params.freshEntry?.status);
	const canReuseSession = Boolean(params.freshEntry?.sessionId) && ((freshness?.fresh ?? false) || recoverableTerminalSession) && !(failedSession && !metadata?.present) && !terminalMainTranscriptNewerThanRegistry;
	const usableRequestedSessionId = params.requestedSessionId && (!params.freshEntry?.sessionId || canReuseSession) ? params.requestedSessionId : void 0;
	const automaticResetReason = !canReuseSession && !usableRequestedSessionId && !(failedSession && !metadata?.present) && !terminalMainTranscriptNewerThanRegistry ? freshness?.staleReason : void 0;
	return {
		lifecycleTimestamps,
		automaticResetReason,
		freshness,
		recoverableTerminalSession,
		canReuseSession,
		usableRequestedSessionId,
		sessionId: usableRequestedSessionId ?? (canReuseSession || automaticResetReason ? params.freshEntry?.sessionId : void 0),
		isNewSession: !params.freshEntry || !canReuseSession && !usableRequestedSessionId || Boolean(usableRequestedSessionId && params.freshEntry?.sessionId !== usableRequestedSessionId)
	};
}
async function buildAgentSessionPatch(params) {
	const reuse = await evaluateAgentSessionReuse(params);
	const automaticResetReason = reuse.automaticResetReason;
	const storedSpawnedBy = normalizeOptionalString(params.freshEntry?.spawnedBy);
	const freshSpawnedBy = storedSpawnedBy ? resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: storedSpawnedBy,
		storeAgentId: params.sessionAgentId
	}) : void 0;
	const storedGroup = normalizeTrustedGroupMetadata(params.freshEntry);
	let inheritedGroup;
	if (freshSpawnedBy && (!storedGroup.groupId || !storedGroup.groupChannel || !storedGroup.groupSpace)) try {
		const parentEntry = (await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: params.cfg,
			key: freshSpawnedBy
		})).entry;
		inheritedGroup = normalizeTrustedGroupMetadata({
			groupId: parentEntry?.groupId,
			groupChannel: parentEntry?.groupChannel,
			groupSpace: parentEntry?.space
		});
	} catch (error) {
		if (error?.code === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") throw error;
	}
	const nextGroup = resolveAgentSessionGroup({
		sessionKey: params.canonicalSessionKey,
		spawnedBy: freshSpawnedBy,
		stored: storedGroup,
		inherited: inheritedGroup,
		requested: params.normalizedSpawned
	});
	const effectiveDelivery = mergeDeliveryContext(deliveryContextFromSession(params.freshEntry), params.requestDeliveryHint);
	const delivery = normalizeSessionDeliveryState({
		route: sessionDeliveryRoute(params.freshEntry),
		context: effectiveDelivery,
		origin: sessionDeliveryOrigin(params.freshEntry)
	});
	const labelValue = normalizeOptionalString(params.requestLabel) || params.freshEntry?.label;
	const explicitSessionDisplayName = params.freshEntry === void 0 && params.visibleRequest && normalizeOptionalString(params.explicitSessionKey) && !labelValue && !isCronSessionKey(params.canonicalSessionKey) && !isSubagentSessionKey(params.canonicalSessionKey) && !isAcpSessionKey(params.canonicalSessionKey) ? parseAgentSessionKey(params.canonicalSessionKey)?.rest.trim() : void 0;
	const freshSessionRotatedSinceLoad = Boolean(params.initialEntry?.sessionId && params.freshEntry?.sessionId && params.freshEntry.sessionId !== params.initialEntry.sessionId);
	const freshSessionId = reuse.sessionId ?? params.fallbackSessionId;
	const freshRotatedSessionId = Boolean(params.freshEntry?.sessionId && params.freshEntry.sessionId !== freshSessionId);
	const patchSessionId = freshSessionRotatedSinceLoad ? params.freshEntry?.sessionId : freshSessionId;
	const shouldClearRotatedState = freshRotatedSessionId && !freshSessionRotatedSinceLoad;
	const shouldClearTerminalState = reuse.canReuseSession && reuse.recoverableTerminalSession && !hasMainSessionRecoveryClaim(params.freshEntry) && !freshSessionRotatedSinceLoad && patchSessionId === params.freshEntry?.sessionId;
	const automaticRecoveryClearPatch = shouldClearRotatedState ? buildMainSessionRecoveryClearPatch(params.freshEntry) : {};
	const patch = {
		...automaticResetReason && !freshSessionRotatedSinceLoad && params.freshEntry ? {
			...clearRotatedSessionMetadata(params.freshEntry),
			lifecycleRevision: randomUUID(),
			agentHarnessId: void 0
		} : {},
		sessionId: patchSessionId,
		updatedAt: params.now,
		...reuse.isNewSession && !freshSessionRotatedSinceLoad ? { sessionStartedAt: params.now } : params.freshEntry?.sessionStartedAt === void 0 && patchSessionId === params.freshEntry?.sessionId && reuse.lifecycleTimestamps?.sessionStartedAt !== void 0 ? { sessionStartedAt: reuse.lifecycleTimestamps.sessionStartedAt } : {},
		...params.touchInteraction ? {
			lastInteractionAt: params.now,
			agentStatus: void 0
		} : {},
		...automaticRecoveryClearPatch,
		delivery,
		...labelValue ? { label: labelValue } : {},
		...explicitSessionDisplayName ? { displayName: explicitSessionDisplayName } : {},
		...freshSpawnedBy ? { spawnedBy: freshSpawnedBy } : {},
		groupId: nextGroup.groupId,
		groupChannel: nextGroup.groupChannel,
		space: nextGroup.groupSpace,
		...params.freshEntry === void 0 && params.pluginOwnerId ? { pluginOwnerId: params.pluginOwnerId } : {},
		...shouldClearRotatedState || shouldClearTerminalState ? {
			status: void 0,
			lifecycleRunId: void 0,
			lastRunId: void 0,
			startedAt: void 0,
			endedAt: void 0,
			runtimeMs: void 0,
			abortedLastRun: void 0
		} : {}
	};
	if (shouldClearRotatedState) clearAllCliSessions(patch);
	return {
		patch,
		...automaticResetReason && !freshSessionRotatedSinceLoad ? { automaticResetReason } : {},
		spawnedBy: freshSpawnedBy,
		...nextGroup,
		freshSessionRotatedSinceLoad,
		isNewSession: reuse.isNewSession,
		rotatedSessionId: freshRotatedSessionId,
		usableRequestedSessionId: reuse.usableRequestedSessionId,
		freshness: reuse.freshness
	};
}
//#endregion
//#region src/gateway/server-methods/agent-session-prepare.ts
async function prepareAgentSession(params) {
	params.assertCurrent?.();
	const requestedSessionAgent = resolveRequestedSessionAgentId(params.cfg, params.requestedSessionKey, params.agentId);
	if (!requestedSessionAgent.ok) {
		params.respond(false, void 0, requestedSessionAgent.error);
		return;
	}
	const requestedAgentId = requestedSessionAgent.agentId;
	const freshChild = takeInProcessFreshChildSession(params.request);
	if (freshChild) return prepareAdmittedAgentSession(params, {
		cfg: params.cfg,
		storePath: freshChild.storePath,
		entry: freshChild.entry,
		canonicalKey: params.requestedSessionKey,
		storeKeys: [params.requestedSessionKey],
		legacyKey: void 0
	}, freshChild.agentId, freshChild);
	return prepareAdmittedAgentSession(params, await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: params.cfg,
		key: params.requestedSessionKey,
		agentId: requestedAgentId,
		excludeInternalEffects: true,
		assertActive: params.assertCurrent
	}), requestedAgentId);
}
async function prepareAdmittedAgentSession(params, selected, requestedAgentId, freshChild) {
	const { cfg, storePath, entry, canonicalKey, legacyKey, storeKeys } = selected;
	const canonicalSessionAgentId = parseAgentSessionKey(canonicalKey)?.agentId ?? requestedAgentId;
	if (params.expectedExistingSessionId && entry?.sessionId !== params.expectedExistingSessionId) {
		params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session "${canonicalKey}" changed before expected work could start.`));
		return;
	}
	let effectiveBootstrapContextRunKind = params.effectiveBootstrapContextRunKind;
	let restoredCronContinuationIdentity;
	if (hasGeneratedMediaCompletionEvent(params.request.internalEvents) && parseCronRunScopeSuffix(canonicalKey).runId !== void 0) {
		if (!params.canUseCronRunContinuation) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cron run completion handoffs are reserved for server-owned callers"));
			return;
		}
		const marker = entry?.cronRunContinuation;
		const continuationSessionId = normalizeOptionalString(entry?.sessionId);
		const staleClaim = marker?.phase === "continuing" && marker.ownerLifecycleGeneration !== params.lifecycleGeneration;
		if (staleClaim || marker?.phase === "ready" && marker.basePersisted !== true) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, staleClaim ? "cron run continuation owner was lost during gateway restart" : "cron run continuation base session was not persisted"));
			return;
		}
		if (!marker || marker.phase !== "ready" || !continuationSessionId) {
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation is not ready"));
			return;
		}
		if (params.requestedSessionId && params.requestedSessionId !== continuationSessionId) {
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation session changed"));
			return;
		}
		restoredCronContinuationIdentity = {
			lifecycleRevision: marker.lifecycleRevision,
			sessionId: continuationSessionId
		};
		effectiveBootstrapContextRunKind = "cron";
	}
	const sessionExistedBeforeAttachmentSetup = params.preAttachmentSession?.canonicalKey === canonicalKey ? params.preAttachmentSession : void 0;
	if (sessionExistedBeforeAttachmentSetup && (!entry || entry.sessionId !== sessionExistedBeforeAttachmentSetup.sessionId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session "${canonicalKey}" ${entry ? "changed" : "was deleted"} while starting work. Retry.`));
		return;
	}
	const deleted = respondDeletedAgentSession({
		cfg,
		canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		respond: params.respond,
		assertCurrent: params.assertCurrent
	});
	if (deleted instanceof Promise ? await deleted : deleted) return;
	const archivedSessionError = resolveAgentSessionWorkStartError(canonicalKey, entry);
	if (archivedSessionError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
		return;
	}
	const now = Date.now();
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg: cfg.session,
		resetType: resolveSessionResetType({ sessionKey: canonicalKey }),
		resetOverride: resolveChannelResetConfig({
			sessionCfg: cfg.session,
			channel: sessionDeliveryChannel(entry) ?? params.recipientChannel
		})
	});
	const isSystemGatewayRun = effectiveBootstrapContextRunKind === "cron" || effectiveBootstrapContextRunKind === "heartbeat";
	const visibleRequest = !isSystemGatewayRun && !params.request.internalEvents?.length;
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId: canonicalSessionAgentId
	});
	const reuse = freshChild ? {
		sessionId: freshChild.entry.sessionId,
		isNewSession: false,
		usableRequestedSessionId: void 0,
		freshness: { fresh: true }
	} : await evaluateAgentSessionReuse({
		freshEntry: entry,
		cfg,
		sessionAgentId: canonicalSessionAgentId,
		canonicalSessionKey: canonicalKey,
		storePath,
		expectedExistingSessionId: params.expectedExistingSessionId,
		hasRestoredCronContinuation: restoredCronContinuationIdentity !== void 0,
		resetPolicy,
		now,
		requestedSessionId: params.requestedSessionId,
		isSystemGatewayRun,
		visibleRequest
	});
	params.assertCurrent?.();
	const sessionId = reuse.sessionId ?? randomUUID();
	return {
		cfg,
		storePath,
		entry,
		canonicalKey,
		storeKeys,
		maintenanceConfig: resolveMaintenanceConfigFromInput(cfg.session?.maintenance),
		canonicalSessionAgentId,
		resetPolicy,
		now,
		freshness: reuse.freshness,
		visibleRequest,
		mainSessionKey,
		isSystemGatewayRun,
		usableRequestedSessionId: reuse.usableRequestedSessionId,
		sessionId,
		isNewSession: reuse.isNewSession,
		rotatedSessionId: Boolean(entry?.sessionId && entry.sessionId !== sessionId),
		touchInteraction: visibleRequest,
		sessionPersistedBeforeGatewayAdmission: entry !== void 0,
		effectiveBootstrapContextRunKind,
		restoredCronContinuationIdentity,
		freshChild: freshChild !== void 0
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-admission-controller.ts
function createAgentAdmissionController(params) {
	let admission;
	let admittedRunAbort;
	let postAdmissionAbort;
	let postAdmissionTimeout;
	let postAdmissionSuperseded = false;
	let lifecycleRotated = false;
	const admissionAgentId = () => {
		const resolvedSessionKey = params.getResolvedSessionKey();
		return params.getResolvedSessionAgentId() ?? (resolvedSessionKey ? params.getAgentId() : void 0);
	};
	const assertAllowed = (commitOutcome = true) => {
		params.assertAdmissionCurrent?.();
		const resolvedSessionKey = params.getResolvedSessionKey();
		const requestedSessionKey = params.getRequestedSessionKey();
		const latest = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		if (isPreRegistrationAbortedAgentDedupeEntryForSession({
			entry: latest,
			runId: params.runId,
			sessionKey: resolvedSessionKey,
			alternateSessionKeys: [params.preAcceptedReservedSessionKey, requestedSessionKey],
			agentId: admissionAgentId()
		})) {
			if (commitOutcome) postAdmissionAbort = latest;
			return;
		}
		if (params.dedupeLifecycle.isReserved()) {
			let expiresAtMs;
			if (latest) {
				if (!latest.ok || !isAcceptedAgentDedupePayload(latest.payload)) {
					if (commitOutcome) postAdmissionAbort = latest;
					return;
				}
				if (!params.dedupeLifecycle.ownsReservation()) {
					if (commitOutcome) postAdmissionSuperseded = true;
					return;
				}
				expiresAtMs = latest.payload.expiresAtMs;
			}
			if (!latest || !isFutureDateTimestampMs(expiresAtMs, { nowMs: Date.now() })) {
				if (commitOutcome) {
					postAdmissionTimeout = buildAbortedAgentPayload(params.runId, "timeout");
					setAbortedAgentDedupeEntries({
						dedupe: params.context.dedupe,
						keys: params.dedupeLifecycle.ownedReservationKeys(),
						agentId: admissionAgentId(),
						sessionKey: resolvedSessionKey,
						runId: params.runId,
						stopReason: "timeout"
					});
				}
				return;
			}
		}
		if (params.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
			if (commitOutcome) lifecycleRotated = params.dedupeLifecycle.abortForLifecycleRotation({
				sessionKey: resolvedSessionKey,
				agentId: admissionAgentId()
			});
			return;
		}
		if (!resolvedSessionKey) return;
		const latestEntry = params.getSessionEntry();
		assertExpectedExistingSession({
			constraint: params.expectedSession,
			entry: latestEntry,
			message: `Session "${resolvedSessionKey}" changed while starting expected work. Retry.`
		});
		if (params.getSessionPersisted() && !latestEntry) throw new Error(`Session "${resolvedSessionKey}" was deleted while starting work. Retry.`);
		const archivedError = resolveAgentSessionWorkStartError(resolvedSessionKey, latestEntry);
		if (archivedError) throw new Error(archivedError);
		if (commitOutcome && latestEntry?.sessionId && latestEntry.sessionId !== params.getSupersededSessionId()) params.setAdmittedSessionId(latestEntry.sessionId);
		return latestEntry;
	};
	const interrupt = (reason) => {
		if (admittedRunAbort?.controller.signal.aborted) return;
		const stopReason = isAgentRunRestartAbortReason(reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : "rpc";
		if (admittedRunAbort?.entry) admittedRunAbort.entry.abortStopReason = stopReason;
		if (admittedRunAbort) {
			const entry = admittedRunAbort.entry;
			const ownsRun = entry !== void 0 && params.context.chatAbortControllers.get(params.runId) === entry && !entry.registrationCleanupRequested;
			admittedRunAbort.controller.abort(reason);
			return ownsRun ? { runId: params.runId } : void 0;
		}
		const keys = params.dedupeLifecycle.ownedReservationKeys();
		if (keys.length) {
			setAbortedAgentDedupeEntries({
				dedupe: params.context.dedupe,
				keys,
				agentId: admissionAgentId(),
				sessionKey: params.getResolvedSessionKey(),
				runId: params.runId,
				stopReason
			});
			return { runId: params.runId };
		}
	};
	const acquire = async (scope) => {
		if (admission) return;
		const isSettling = () => admittedRunAbort?.entry?.terminalOutcomeObserved === true;
		const getAbortReason = () => admittedRunAbort?.controller.signal.reason;
		const sessionKey = params.getResolvedSessionKey();
		admission = consumeExpectedSessionWorkAdmission({
			constraint: params.expectedSession,
			scope,
			identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
			onInterrupt: interrupt,
			isSettling,
			getAbortReason
		}) ?? await beginSessionWorkAdmission({
			agentId: params.getResolvedSessionAgentId() ?? params.getAgentId(),
			scope,
			run: {
				runId: params.runId,
				sessionKey: params.getResolvedSessionKey(),
				sessionId: params.getResolvedSessionId(),
				agentId: admissionAgentId()
			},
			isSettling,
			getAbortReason,
			identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
			storeWriterIdentities: sessionKey && parseAgentSessionKey(sessionKey) && normalizeStoreSessionKey(sessionKey) === sessionKey ? [sessionKey] : void 0,
			...params.admissionOwner ? { owner: params.admissionOwner } : {},
			assertAllowed: () => {
				assertAllowed(false);
			},
			revalidateAllowed: () => {
				assertAllowed();
			},
			onInterrupt: interrupt
		});
		if (sessionKey) {
			const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
				cfg: params.context.getRuntimeConfig(),
				key: sessionKey,
				agentId: admissionAgentId(),
				excludeInternalEffects: true,
				assertActive: params.assertAdmissionCurrent
			});
			params.setSessionEntry(loaded.entry);
			assertAllowed();
		}
	};
	const respondToOutcome = () => {
		if (postAdmissionAbort || postAdmissionTimeout || postAdmissionSuperseded) {
			admission?.release();
			params.dedupeLifecycle.markAccepted(true);
			params.io.emitAcceptance(postAdmissionAbort ? [
				postAdmissionAbort.ok,
				postAdmissionAbort.payload,
				postAdmissionAbort.error
			] : [
				true,
				postAdmissionTimeout ?? {
					runId: params.runId,
					status: "in_flight"
				},
				void 0
			], {
				cached: true,
				runId: params.runId
			});
			return true;
		}
		if (lifecycleRotated) {
			admission?.release();
			return true;
		}
		return false;
	};
	return {
		admissionAgentId,
		assertAllowed,
		acquire,
		respondToOutcome,
		hasOutcome: () => Boolean(postAdmissionAbort || postAdmissionTimeout || postAdmissionSuperseded || lifecycleRotated),
		getAdmission: () => admission,
		getAdmittedRunAbort: () => admittedRunAbort,
		setAdmittedRunAbort: (value) => {
			admittedRunAbort = value;
		},
		release: () => {
			admission?.release();
		}
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-content-phase.ts
async function prepareAgentContentPhase(params) {
	const transcriptInputText = params.request.message.trim();
	let content = {
		message: params.isRawModelRun ? transcriptInputText : annotateInterSessionPromptText(transcriptInputText, params.inputProvenance),
		images: [],
		imageOrder: [],
		media: [],
		offloadedRefs: []
	};
	let supportsInlineImages;
	let agentId = params.agentId;
	let requestedSessionKey = params.requestedSessionKey;
	const isKnownGatewayChannel = (value) => isGatewayMessageChannel(value) || isInternalNonDeliveryChannel(value);
	const channelHints = normalizeTrimmedStringList([params.request.channel, params.request.replyChannel]);
	for (const rawChannel of channelHints) {
		const normalized = normalizeMessageChannel(rawChannel);
		if (normalized && normalized !== "last" && !isKnownGatewayChannel(normalized)) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown channel: ${normalized}`));
			return;
		}
	}
	if (params.normalizedAttachments.length > 0) {
		let baseProvider;
		let baseModel;
		let catalogAgentId = agentId;
		let isConfirmedAcpSession = false;
		if (params.requestedSessionKeyRaw) {
			const target = resolveSessionStoreIdentity({
				cfg: params.cfg,
				sessionKey: params.requestedSessionKeyRaw,
				agentId
			});
			const session = await readAcpSessionEntryAsync({
				cfg: params.cfg,
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				assertCurrent: params.assertAdmissionCurrent
			});
			params.assertAdmissionCurrent?.();
			catalogAgentId = target.agentId;
			const modelRef = resolveSessionModelRef(session?.cfg ?? params.cfg, session?.entry, target.agentId);
			baseProvider = modelRef.provider;
			baseModel = modelRef.model;
			isConfirmedAcpSession = params.request.acpTurnSource === "manual_spawn" && isAcpSessionKey(params.requestedSessionKeyRaw) && session?.acp != null;
		}
		supportsInlineImages = isConfirmedAcpSession ? true : await resolveGatewayModelSupportsImages({
			loadGatewayModelCatalog: params.context.loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot: params.context.loadGatewayModelCatalogSnapshot,
			agentId: catalogAgentId,
			provider: params.providerOverride || baseProvider,
			model: params.modelOverride || baseModel
		});
	}
	const voiceWakeTrigger = normalizeOptionalString(params.request.voiceWakeTrigger) ?? "";
	const replyTo = normalizeOptionalString(params.request.replyTo) ?? "";
	const recipientChannel = params.explicitRecipientSession?.channel ?? params.request.channel;
	const recipientAccountId = params.explicitRecipientSession?.accountId ?? params.request.accountId;
	const recipientThreadId = params.explicitRecipientSession?.threadId ?? params.request.threadId;
	const to = params.sessionKeyFromTo ? "" : params.explicitRecipientSession?.to ?? params.requestedToRaw ?? "";
	const canAutoRouteVoiceWake = Object.hasOwn(params.request, "voiceWakeTrigger") && !normalizeOptionalString(params.request.agentId) && !params.requestedSessionId && !replyTo && !to;
	const explicitVoiceWakeSessionTarget = canAutoRouteVoiceWake && params.requestedSessionKeyRaw ? (() => {
		const cfg = params.cfg;
		const { canonicalKey } = resolveSessionStoreIdentity({
			cfg,
			sessionKey: params.requestedSessionKeyRaw,
			...agentId ? { agentId } : {}
		});
		const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey, agentId);
		const compatibilityOwner = tryResolveSessionCompatibilityOwnerAgentId(cfg, canonicalKey);
		if (!compatibilityOwner || routedAgentId !== compatibilityOwner) return true;
		return canonicalKey !== resolveAgentMainSessionKey({
			cfg,
			agentId: routedAgentId
		});
	})() : false;
	if (canAutoRouteVoiceWake && !explicitVoiceWakeSessionTarget) try {
		const route = resolveVoiceWakeRouteByTrigger({
			trigger: voiceWakeTrigger || void 0,
			config: await loadVoiceWakeRoutingConfig()
		});
		if ("agentId" in route) {
			if (params.knownAgents.includes(route.agentId)) {
				agentId = route.agentId;
				requestedSessionKey = resolveExplicitAgentSessionKey({
					cfg: params.cfg,
					agentId
				});
			} else params.context.logGateway.warn(`voicewake routing ignored unknown agentId="${route.agentId}" trigger="${voiceWakeTrigger}"`);
		} else if ("sessionKey" in route) {
			if (classifySessionKeyShape(route.sessionKey) !== "malformed_agent") {
				const { canonicalKey } = resolveSessionStoreIdentity({
					cfg: params.cfg,
					sessionKey: route.sessionKey
				});
				const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey);
				if (params.knownAgents.includes(routedAgentId)) {
					requestedSessionKey = canonicalKey;
					agentId = routedAgentId;
				} else params.context.logGateway.warn(`voicewake routing ignored unknown session agent="${routedAgentId}" sessionKey="${canonicalKey}" trigger="${voiceWakeTrigger}"`);
			} else params.context.logGateway.warn(`voicewake routing ignored malformed sessionKey="${route.sessionKey}" trigger="${voiceWakeTrigger}"`);
		}
	} catch (err) {
		params.context.logGateway.warn(`voicewake routing load failed: ${formatForLog(err)}`);
	}
	if (params.normalizedAttachments.length > 0) {
		params.assertAdmissionCurrent?.();
		try {
			content = await parseMessageWithAttachments(content.message, params.normalizedAttachments, {
				maxBytes: resolveChatAttachmentMaxBytes(params.cfg),
				log: params.context.logGateway,
				supportsInlineImages,
				acceptNonImage: false,
				assertCurrent: params.assertAdmissionCurrent
			});
			content.message = content.message.trim();
		} catch (err) {
			if (err instanceof AgentRequestReservationEndedError) throw err;
			logAttachmentFailure(params.context.logGateway, "agent attachment parse failed", err);
			params.respond(false, void 0, err instanceof SessionMutationAuthorizationChangedError ? err.error : errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
			return;
		}
	}
	return {
		agentId,
		requestedSessionKey,
		effectiveTranscriptInputText: transcriptInputText,
		...content,
		replyTo,
		recipientChannel,
		recipientAccountId,
		recipientThreadId,
		to
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-dedupe-lifecycle.ts
function createAgentDedupeLifecycle(params) {
	let reserved = false;
	let accepted = false;
	let committedResetCompletion;
	const reservationId = randomUUID();
	const reserve = (sessionKey, dedupeAgentId) => {
		if (reserved) return;
		if (isPreRegistrationAbortedAgentDedupeEntryForSession({
			entry: readGatewayDedupeEntry({
				dedupe: params.context.dedupe,
				keys: params.agentDedupeKeys
			}),
			runId: params.runId,
			sessionKey,
			agentId: dedupeAgentId
		})) return;
		const acceptedAt = Date.now();
		const pendingTimeoutMs = resolveAgentTimeoutMs({
			cfg: params.cfg,
			overrideSeconds: params.request.timeout
		});
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			...params.privateCompletion && !params.context.chatAbortControllers.has(params.runId) ? { startNewAttempt: true } : {},
			entry: {
				ts: acceptedAt,
				ok: true,
				payload: {
					runId: params.runId,
					reservationId,
					status: "accepted",
					...sessionKey ? { sessionKey } : {},
					...dedupeAgentId ? { agentId: dedupeAgentId } : {},
					controlUiVisible: !params.suppressVisibleSessionEffects && !isSubagentCoordinationInputProvenance(params.inputProvenance),
					acceptedAt,
					dedupeKeys: params.agentDedupeKeys,
					expiresAtMs: resolveAgentRunExpiresAtMs({
						now: acceptedAt,
						timeoutMs: pendingTimeoutMs
					}),
					ownerConnId: params.ownerConnId,
					ownerDeviceId: params.ownerDeviceId
				}
			}
		});
		reserved = true;
	};
	const ownedReservationKeys = () => !reserved || accepted ? [] : params.agentDedupeKeys.filter((key) => {
		const entry = params.context.dedupe.get(key);
		return entry?.ok && isAcceptedAgentDedupePayload(entry.payload) && entry.payload.reservationId === reservationId;
	});
	const ownsReservation = () => ownedReservationKeys().length === params.agentDedupeKeys.length;
	const assertReservationCurrent = () => {
		if (!ownsReservation()) throw new AgentRequestReservationEndedError();
	};
	const handlePreparationFailure = (assertCallerCurrent) => (error) => {
		assertCallerCurrent?.();
		if (!ownsReservation() && replayAgentTurnIfCached({
			preflight: params,
			context: params.context,
			io: params.io,
			acceptedOnly: params.privateCompletion
		})) return;
		if (error instanceof AgentRequestReservationEndedError) {
			logAttachmentFailure(params.context.logGateway, "agent attachment parse failed", error);
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.INVALID_REQUEST, String(error))
			]);
			return;
		}
		throw error;
	};
	const recordCommittedReset = (completion, followUpNotice, keys = params.agentDedupeKeys) => {
		const response = completion.replyError ? [
			false,
			void 0,
			completion.replyError
		] : [
			true,
			buildBareSessionResetResponse({
				runId: params.runId,
				result: buildBareSessionResetResult({
					reason: completion.reason,
					sessionId: completion.sessionId,
					ackText: completion.followUpPending ? `${sessionResetAckText(completion.reason)} ${followUpNotice}` : void 0
				})
			}),
			void 0
		];
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys,
			entry: {
				ts: Date.now(),
				ok: response[0],
				payload: response[1],
				error: response[2]
			}
		});
		return response;
	};
	const clearUnaccepted = () => {
		const keys = ownedReservationKeys();
		if (!keys.length) return;
		if (committedResetCompletion) {
			recordCommittedReset(committedResetCompletion, "Request ended before the follow-up ran; send the follow-up message again.", keys);
			accepted = true;
			return;
		}
		for (const key of keys) params.context.dedupe.delete(key);
		reserved = false;
	};
	const bindSessionTarget = (target) => {
		const entry = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		if (!entry?.ok || !isAcceptedAgentDedupePayload(entry.payload) || entry.payload.reservationId !== reservationId) return;
		const previousKey = typeof entry.payload.sessionKey === "string" ? entry.payload.sessionKey : void 0;
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys.filter((key) => params.context.dedupe.get(key)?.payload === entry.payload),
			entry: {
				...entry,
				payload: {
					...entry.payload,
					...target,
					...previousKey && previousKey !== target.sessionKey ? { sessionKeyAliases: [previousKey] } : {}
				}
			}
		});
	};
	const abortForLifecycleRotation = (target) => {
		if (params.lifecycleGeneration === getAgentEventLifecycleGeneration()) return false;
		if (!ownsReservation()) {
			clearUnaccepted();
			if (!replayAgentTurnIfCached({
				preflight: params,
				context: params.context,
				io: params.io
			})) params.io.emitAcceptance([
				true,
				buildAbortedAgentPayload(params.runId, AGENT_RUN_RESTART_ABORT_STOP_REASON),
				void 0
			]);
			accepted = true;
			return true;
		}
		if (committedResetCompletion) {
			const completion = committedResetCompletion;
			accepted = true;
			const response = recordCommittedReset(completion, "Gateway restarted before the follow-up ran; send the follow-up message again.");
			params.io.emitAcceptance(response, { runId: params.runId });
			emitSessionsChanged(params.context, {
				sessionKey: completion.sessionKey,
				...completion.agentId ? { agentId: completion.agentId } : {},
				reason: completion.reason
			});
			return true;
		}
		accepted = true;
		setAbortedAgentDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			agentId: target?.agentId,
			sessionKey: target?.sessionKey,
			runId: params.runId,
			stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
		});
		params.io.emitAcceptance([
			true,
			buildAbortedAgentPayload(params.runId, AGENT_RUN_RESTART_ABORT_STOP_REASON),
			void 0
		], { runId: params.runId });
		return true;
	};
	return {
		reservationId,
		ownsReservation,
		ownedReservationKeys,
		assertReservationCurrent,
		handlePreparationFailure,
		reserve,
		bindSessionTarget,
		clearUnaccepted,
		abortForLifecycleRotation,
		isReserved: () => reserved,
		markAccepted: (value) => {
			accepted = value;
		},
		setCommittedResetCompletion: (value) => {
			committedResetCompletion = value;
		}
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-delivery-phase.ts
async function resolveAgentDeliveryPhase(params) {
	const isIncognito = params.sessionEntry?.incognito === true || isIncognitoSessionKey(params.resolvedSessionKey);
	const respond = (ok, payload, error) => {
		if (isIncognito && error) {
			params.respond(ok, payload, error, { errorMessage: "Incognito agent error." });
			return;
		}
		params.respond(ok, payload, error);
	};
	const activeSessionAgentId = params.resolvedSessionAgentId ? params.resolvedSessionAgentId : params.resolvedSessionKey ? resolveAgentIdFromSessionKey(params.resolvedSessionKey, params.agentId) : params.agentId;
	if (!activeSessionAgentId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent selection is required for this session"));
		return;
	}
	if (params.onRunObserved) {
		params.onRunObserved(params.runId);
		const compatibilityOwnerAgentId = params.resolvedSessionKey ? tryResolveSessionCompatibilityOwnerAgentId(params.cfgForAgent ?? params.cfg, params.resolvedSessionKey) : void 0;
		for (const [activeRunId, active] of params.context.chatAbortControllers) {
			const sameSession = active.sessionKey === params.resolvedSessionKey;
			const activeOwner = resolveChatRunOwnerAgentId({
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				defaultAgentId: compatibilityOwnerAgentId
			});
			if (activeRunId !== params.runId && sameSession && activeOwner === activeSessionAgentId) params.onRunObserved(activeRunId);
		}
	}
	const turnSourceChannel = normalizeMessageChannel(params.recipientChannel);
	const webchatClient = params.client?.connect && params.isWebchatConnect(params.client.connect);
	const requestedChannel = normalizeMessageChannel(params.request.replyChannel ?? turnSourceChannel);
	const sessionOnly = requestedChannel === "webchat" || webchatClient && (!requestedChannel || requestedChannel === "last") && !params.replyTo && !params.to;
	const wantsDelivery = params.request.deliver === true && !sessionOnly;
	const explicitThreadId = sessionOnly ? void 0 : normalizeOptionalString(params.recipientThreadId);
	const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfgForAgent ?? params.cfg,
		agentId: activeSessionAgentId,
		currentSessionKey: params.resolvedSessionKey,
		sessionEntry: sessionOnly ? void 0 : params.sessionEntry,
		requestedChannel: sessionOnly ? INTERNAL_MESSAGE_CHANNEL : requestedChannel,
		explicitTo: sessionOnly ? void 0 : params.replyTo || params.to || void 0,
		explicitThreadId,
		accountId: sessionOnly ? void 0 : params.request.replyAccountId ?? params.recipientAccountId,
		wantsDelivery,
		turnSourceChannel,
		turnSourceTo: params.to || void 0,
		turnSourceAccountId: normalizeOptionalString(params.recipientAccountId),
		turnSourceThreadId: explicitThreadId
	});
	let resolvedChannel = deliveryPlan.resolvedChannel;
	let deliveryTargetMode = deliveryPlan.deliveryTargetMode;
	const resolvedAccountId = deliveryPlan.resolvedAccountId;
	let resolvedTo = deliveryPlan.resolvedTo;
	let effectivePlan = deliveryPlan;
	let deliveryResolutionError = null;
	let deliveryTargetResolutionError = deliveryPlan.targetResolutionError;
	if (wantsDelivery && resolvedChannel === "webchat") try {
		const selection = await resolveMessageChannelSelection({ cfg: params.cfgForAgent ?? params.cfg });
		resolvedChannel = selection.channel;
		deliveryTargetMode = deliveryTargetMode ?? "implicit";
		effectivePlan = {
			...deliveryPlan,
			resolvedChannel,
			plugin: selection.plugin,
			deliveryTargetMode,
			resolvedAccountId
		};
	} catch (err) {
		if (!shouldDowngradeDeliveryToSessionOnly({
			wantsDelivery,
			bestEffortDeliver: params.bestEffortDeliver,
			resolvedChannel
		})) {
			respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, err));
			return;
		}
		deliveryResolutionError = String(err);
	}
	if (wantsDelivery && deliveryTargetResolutionError && !params.bestEffortDeliver) {
		respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, deliveryTargetResolutionError));
		return;
	}
	if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel)) {
		const fallback = await resolveAgentOutboundTarget({
			cfg: params.cfgForAgent ?? params.cfg,
			plan: effectivePlan,
			targetMode: deliveryTargetMode ?? "implicit",
			validateExplicitTarget: false
		});
		if (fallback.resolvedTarget?.ok) resolvedTo = fallback.resolvedTo;
		else if (fallback.resolvedTarget && !fallback.resolvedTarget.ok) deliveryTargetResolutionError = fallback.resolvedTarget.error;
	}
	const missingTarget = isDeliverableMessageChannel(resolvedChannel) && !resolvedTo;
	if (wantsDelivery && (missingTarget || resolvedChannel === "webchat")) {
		if (!params.bestEffortDeliver) {
			respond(false, void 0, missingTarget && deliveryTargetResolutionError ? errorShapeFromError(ErrorCodes.INVALID_REQUEST, deliveryTargetResolutionError) : errorShape(ErrorCodes.INVALID_REQUEST, missingTarget ? `delivery target is required for ${resolvedChannel}: pass --to/--reply-to or configure a default target` : "delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel"));
			return;
		}
		params.context.logGateway.info(missingTarget ? deliveryTargetResolutionError && !isIncognito ? `agent delivery target missing (bestEffortDeliver): ${String(deliveryTargetResolutionError)}` : "agent delivery target missing (bestEffortDeliver): no deliverable target" : deliveryResolutionError && !isIncognito ? `agent delivery unresolved (bestEffortDeliver); final delivery will report: ${deliveryResolutionError}` : "agent delivery unresolved (bestEffortDeliver); final delivery will report: no deliverable channel");
	}
	const turnSourceMessageChannel = turnSourceChannel && (isGatewayMessageChannel(turnSourceChannel) || isInternalNonDeliveryChannel(turnSourceChannel)) ? turnSourceChannel : void 0;
	return {
		activeSessionAgentId,
		deliveryPlan: effectivePlan,
		resolvedChannel,
		deliveryTargetMode,
		resolvedAccountId,
		resolvedTo,
		originMessageChannel: turnSourceMessageChannel ?? (webchatClient ? "webchat" : resolvedChannel !== "webchat" || deliveryPlan.baseDelivery.channel || normalizeMessageChannel(params.request.replyChannel) === "webchat" ? resolvedChannel : void 0),
		deliver: wantsDelivery,
		explicitThreadId
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-request-routing.ts
async function prepareAgentRequestRouting(params) {
	const rejectInvalidRequest = (message) => {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
	};
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.request.attachments);
	const knownAgents = listAgentIds(params.cfg);
	const agentIdRaw = normalizeOptionalString(params.request.agentId) ?? "";
	let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (agentId && !knownAgents.includes(agentId)) return rejectInvalidRequest(`invalid agent params: unknown agent id "${params.request.agentId}"`);
	const requestedSessionKeyParam = normalizeOptionalString(params.request.sessionKey);
	const requestedSessionId = normalizeOptionalString(params.request.sessionId);
	const requestedToRaw = normalizeOptionalString(params.request.to);
	const sessionKeyFromTo = !requestedSessionKeyParam && !requestedSessionId && classifySessionKeyShape(requestedToRaw) === "agent" ? requestedToRaw : void 0;
	const requestedSessionKeyRaw = requestedSessionKeyParam ?? sessionKeyFromTo;
	const agentSelectionKey = requestedSessionKeyRaw ?? (!requestedSessionId && !agentId ? "main" : void 0);
	if (agentSelectionKey) {
		const requestedSessionAgent = resolveRequestedSessionAgentId(params.cfg, agentSelectionKey, agentId);
		if (!requestedSessionAgent.ok) {
			params.respond(false, void 0, requestedSessionAgent.error);
			return;
		}
		agentId = requestedSessionAgent.agentId;
	}
	let sessionIdTarget;
	if (requestedSessionId && !requestedSessionKeyRaw) try {
		params.reserveDedupe(void 0, agentId);
		sessionIdTarget = await (params.request.createSessionIfMissing ? resolveSessionKeyForRequestCore : resolveExistingSessionKeyForRequest)({
			cfg: params.cfg,
			sessionId: requestedSessionId,
			agentId
		});
		agentId = sessionIdTarget.agentId ?? agentId;
	} catch (error) {
		params.clearDedupe();
		return rejectInvalidRequest(formatForLog(error));
	}
	const explicitRecipientChannel = normalizeMessageChannel(params.request.channel);
	const explicitRecipient = !requestedSessionKeyRaw && !requestedSessionId && agentId && explicitRecipientChannel && isDeliverableMessageChannel(explicitRecipientChannel) && requestedToRaw ? {
		agentId,
		channel: explicitRecipientChannel,
		to: requestedToRaw
	} : void 0;
	let explicitRecipientSession;
	if (explicitRecipient) {
		params.reserveDedupe(void 0, explicitRecipient.agentId);
		try {
			explicitRecipientSession = await resolveAgentExplicitRecipientSession({
				cfg: params.cfg,
				...explicitRecipient,
				accountId: normalizeOptionalString(params.request.accountId),
				threadId: params.request.threadId
			});
		} catch (error) {
			params.clearDedupe();
			return rejectInvalidRequest(formatForLog(error));
		}
	}
	if (explicitRecipientSession?.error) {
		params.clearDedupe();
		return rejectInvalidRequest(explicitRecipientSession.error.message);
	}
	const requestedSessionKey = requestedSessionKeyRaw ?? sessionIdTarget?.sessionKey ?? explicitRecipientSession?.sessionKey ?? (!requestedSessionId ? resolveExplicitAgentSessionKey({
		cfg: params.cfg,
		agentId: agentIdRaw ? agentId : void 0
	}) : void 0);
	const expectedSessionTargetError = validateExpectedExistingSessionTarget({
		constraint: params.expectedSession,
		requestedSessionId,
		requestedSessionKey
	});
	if (expectedSessionTargetError) {
		params.clearDedupe();
		return rejectInvalidRequest(expectedSessionTargetError);
	}
	let loaded;
	if (requestedSessionKey) {
		params.reserveDedupe(requestedSessionKey, agentId);
		try {
			loaded = await loadGatewaySessionEntryReadOnlyInWorker({
				cfg: params.cfg,
				key: requestedSessionKey,
				agentId,
				projection: "list",
				excludeInternalEffects: true,
				assertActive: params.assertCurrent
			});
			const unavailable = respondUnavailableAgentSession({
				loaded,
				requestedSessionId,
				isRawModelRun: params.isRawModelRun,
				respond: params.respond,
				assertCurrent: params.assertCurrent
			});
			if (unavailable instanceof Promise ? await unavailable : unavailable) {
				params.clearDedupe();
				return;
			}
		} catch (error) {
			params.clearDedupe();
			throw error;
		}
	}
	if (params.execApprovalFollowupApprovalId && requestedSessionKeyRaw) {
		const expectedSessionId = normalizeOptionalString(params.request.execApprovalFollowupExpectedSessionId);
		const currentSessionId = normalizeOptionalString(loaded?.entry?.sessionId);
		if (isExecApprovalFollowupSessionRebound({
			expectedSessionId,
			resolvedSessionId: currentSessionId
		})) {
			emitDiagnosticEvent({
				type: "exec.approval.followup_suppressed",
				approvalId: params.execApprovalFollowupApprovalId,
				reason: "session_rebound",
				phase: "gateway_preflight"
			});
			params.context.logGateway.info(`Dropping stale exec approval followup ${params.execApprovalFollowupApprovalId}: session ${requestedSessionKeyRaw} rebound (expected ${expectedSessionId}, current ${currentSessionId}) before the approval resolved`);
			const droppedPayload = {
				runId: params.runId,
				status: "ok",
				summary: "exec approval followup dropped: session was reset before the approval resolved"
			};
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.agentDedupeKeys,
				entry: {
					ts: Date.now(),
					ok: true,
					payload: droppedPayload
				}
			});
			params.respond(true, droppedPayload, void 0, { runId: params.runId });
			return;
		}
	}
	const preAcceptedReservedSessionKey = requestedSessionKey && resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: requestedSessionKey,
		storeAgentId: agentId
	}) === "global" ? "global" : requestedSessionKey;
	params.reserveDedupe(preAcceptedReservedSessionKey, agentId);
	if (loaded) params.bindDedupeSessionTarget({
		sessionKey: loaded.canonicalKey,
		agentId,
		sessionId: loaded.entry?.sessionId
	});
	return {
		normalizedAttachments,
		requestedBestEffortDeliver: params.request.bestEffortDeliver,
		knownAgents,
		agentId,
		requestedSessionId,
		requestedToRaw,
		sessionKeyFromTo,
		requestedSessionKeyRaw,
		requestedSessionKey,
		explicitRecipientSession,
		preAcceptedReservedSessionKey,
		preAttachmentSession: loaded?.entry ? {
			canonicalKey: loaded.canonicalKey,
			sessionId: loaded.entry.sessionId
		} : void 0
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-admission-model.ts
function resolveAgentRunAdmissionModel(params) {
	const effectiveProviderOverride = params.restoredCronContinuation?.provider ?? params.providerOverride;
	const effectiveModelOverride = params.restoredCronContinuation?.model ?? params.modelOverride;
	const effectiveThinking = params.restoredCronContinuation ? params.restoredCronContinuation.thinking : params.request.thinking;
	const effectiveAllowModelOverride = params.allowModelOverride || params.restoredCronContinuation !== void 0;
	const runtimeConfig = params.cfgForAgent ?? params.cfg;
	const sessionModel = resolveSessionModelRef(runtimeConfig, params.sessionEntry, params.activeSessionAgentId);
	const activeModel = effectiveModelOverride ? resolvePersistedOverrideModelRef({
		defaultProvider: effectiveProviderOverride ?? sessionModel.provider,
		overrideProvider: effectiveProviderOverride,
		overrideModel: effectiveModelOverride
	}) ?? sessionModel : {
		provider: effectiveProviderOverride ?? sessionModel.provider,
		model: sessionModel.model
	};
	return {
		effectiveProviderOverride,
		effectiveModelOverride,
		effectiveThinking,
		effectiveAllowModelOverride,
		resolvedRuntime: {
			harness: resolveEffectiveAgentRuntime({
				cfg: runtimeConfig,
				provider: activeModel.provider,
				modelId: activeModel.model,
				agentId: params.activeSessionAgentId,
				sessionKey: params.resolvedSessionKey,
				sessionEntry: params.sessionEntry
			}),
			provider: activeModel.provider,
			model: activeModel.model
		},
		lifecycleStorePath: params.lifecycleStorePath
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-user-turn.ts
function reconcileAgentRunUserTurnCompletion(userTurn, accepted, cleanupPreaccept, io) {
	const completion = userTurn.recorder?.getProcessingCompletion?.();
	if (!completion) return;
	return cleanupPreaccept().then(() => {
		io.emitAcceptance([
			true,
			{
				...accepted,
				status: completion.status,
				summary: completion.reason,
				...completion.stopReason ? { stopReason: completion.stopReason } : {},
				...completion.reason === "completed" ? { inputProcessingCompleted: true } : {}
			},
			void 0
		], { runId: accepted.runId });
	});
}
function recordAgentRunUserTurnParticipant(params, userTurn, storePath) {
	const participant = resolveGatewayInputParticipant(params.client, params.inputProvenance);
	if (participant && params.resolvedSessionKey && !params.suppressVisibleSessionEffects && !userTurn.suppressPromptPersistence) recordSessionParticipantBestEffort({
		identity: participant,
		promptedAt: params.promptedAt,
		agentId: params.activeSessionAgentId,
		sessionKey: params.resolvedSessionKey,
		storePath,
		onError: (error) => params.context.logGateway.warn(`agent participant persistence failed: ${formatForLog(error)}`)
	});
}
async function prepareAgentRunUserTurn(params) {
	const execApprovalFollowupHandoffClaimId = randomUUID();
	let claimedExecApprovalFollowupHandoffId;
	let createdMediaIds = [];
	let recorder;
	try {
		const claimFollowup = (sessionKey) => claimExecApprovalFollowupRuntimeHandoff({
			handoffId: params.request.internalRuntimeHandoffId,
			approvalId: params.execApprovalFollowupApprovalId,
			idempotencyKey: params.runId,
			sessionKey,
			claimId: execApprovalFollowupHandoffClaimId
		});
		let execApprovalFollowupRuntimeHandoff;
		if (params.canUseInternalRuntimeHandoff && params.execApprovalFollowupApprovalId) {
			execApprovalFollowupRuntimeHandoff = claimFollowup(params.resolvedSessionKey);
			if (!execApprovalFollowupRuntimeHandoff && params.requestedSessionKeyRaw && params.requestedSessionKeyRaw !== params.resolvedSessionKey) execApprovalFollowupRuntimeHandoff = claimFollowup(params.requestedSessionKeyRaw);
		}
		if (execApprovalFollowupRuntimeHandoff) claimedExecApprovalFollowupHandoffId = params.request.internalRuntimeHandoffId;
		let message = params.message;
		let effectiveTranscriptInputText = params.effectiveTranscriptInputText;
		let execApprovalContinuationPromptRange;
		if (execApprovalFollowupRuntimeHandoff?.resultText !== void 0) {
			const continuation = buildExecApprovalContinuationPrompt(execApprovalFollowupRuntimeHandoff.resultText);
			message = continuation.message;
			effectiveTranscriptInputText = continuation.message;
			execApprovalContinuationPromptRange = continuation.resultRange;
		} else if (message === "An approved async exec completed; load the authenticated completion handoff.") throw new Error("exec approval followup runtime handoff is unavailable");
		const senderIsOwner = params.restoredCronContinuation ? true : hasGatewayAdminScope(params.client);
		const settleWakeReplay = params.settleWakeReplay;
		if (settleWakeReplay && (!params.runId.startsWith("announce:") || params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_settle" || !params.inputProvenance.sourceSessionKey || !settleWakeReplay.sourceSessionKeys.includes(params.inputProvenance.sourceSessionKey))) throw new Error("Settle replay requires an exact internal frozen-cohort source");
		let inputProvenance = params.inputProvenance;
		if (params.privateCompletion && (params.request.deliver !== false || params.request.expectedExistingSessionId !== params.admittedSessionId || !params.runId.startsWith("announce:") || params.inputProvenance?.kind !== "inter_session" || !["subagent_announce", "subagent_settle"].includes(params.inputProvenance.sourceTool ?? ""))) throw new Error("Private completion requires an exact internal requester turn with delivery disabled");
		const trackRequesterCompletion = params.privateCompletion || settleWakeReplay !== void 0;
		const suppressPromptPersistence = !params.privateCompletion && (params.requestedPromptPersistenceSuppression || shouldSuppressAgentPromptPersistence({
			inputProvenance: params.inputProvenance,
			internalEvents: params.request.internalEvents
		}));
		if (params.resolvedSessionKey && !params.suppressVisibleSessionEffects && !suppressPromptPersistence) {
			const persistedMedia = await persistInboundImagesForTranscript({
				images: params.images,
				offloadedRefs: params.offloadedRefs,
				log: params.context.logGateway,
				logContext: "agent",
				assertCurrent: params.assertCurrent
			});
			createdMediaIds = persistedMedia.entries.filter((entry) => entry.imageKind === "inline").map((entry) => entry.id);
			params.assertCurrent();
			const media = persistedMedia.entries.map((entry) => entry.fact);
			const slots = persistedMedia.entries.flatMap((entry, factIndex) => entry.imageKind ? [{
				kind: entry.imageKind,
				factIndex
			}] : []);
			const input = {
				...params.privateCompletion || isCompletionReportInputProvenance(params.inputProvenance) || isSubagentCoordinationInputProvenance(params.inputProvenance) ? { display: false } : {},
				text: persistedMedia.omission === "inline-image-save-failed" ? [effectiveTranscriptInputText, INLINE_IMAGE_DURABLE_OMISSION_MARKER].filter(Boolean).join("\n") : effectiveTranscriptInputText,
				timestamp: Date.now(),
				idempotencyKey: buildRunUserTurnIdempotencyKey(params.runId),
				...gatewayClientSenderFields(params.client),
				senderIsOwner,
				...params.inputProvenance ? { provenance: params.inputProvenance } : {},
				...media.length > 0 ? { media } : {},
				...slots.length > 0 ? { mediaImageLayout: { slots } } : {}
			};
			const peerDelivery = readSessionSendDeliveryAdmission({
				runId: params.runId,
				sessionKey: params.resolvedSessionKey,
				sessionId: params.admittedSessionId,
				agentId: params.activeSessionAgentId
			});
			let peerMessage = peerDelivery?.acceptedMessage;
			if (peerDelivery && !peerMessage) {
				const original = buildPersistedUserTurnMessage(input);
				peerMessage = {
					...original,
					__openclaw: {
						...original["__openclaw"],
						sessionSendDelivery: peerDelivery.delivery
					}
				};
			}
			recorder = createUserTurnTranscriptRecorder({
				trackInputCompletion: trackRequesterCompletion || peerDelivery !== void 0,
				...peerMessage ? { message: peerMessage } : {},
				pendingInputReplaySourceSessionKeys: settleWakeReplay?.sourceSessionKeys,
				input,
				target: async () => {
					params.assertCurrent();
					const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
						cfg: params.cfgForAgent ?? params.cfg,
						key: params.resolvedSessionKey,
						agentId: params.activeSessionAgentId,
						assertActive: params.assertCurrent,
						excludeInternalEffects: true
					});
					params.assertCurrent();
					const latestEntry = loaded.entry;
					const loadedSessionId = latestEntry?.sessionId?.trim();
					if (!latestEntry || loadedSessionId !== params.admittedSessionId) return;
					return {
						sessionId: latestEntry.sessionId,
						expectedSessionId: params.admittedSessionId,
						sessionKey: params.resolvedSessionKey,
						sessionEntry: latestEntry,
						sessionStore: loaded.store,
						storePath: loaded.storePath,
						agentId: params.activeSessionAgentId,
						cwd: resolveSessionRuntimeCwd({ sessionEntry: latestEntry }),
						...params.resolvedThreadId != null ? { threadId: params.resolvedThreadId } : {},
						config: params.cfgForAgent ?? params.cfg
					};
				},
				errorContext: "gateway agent user turn transcript",
				beforeMessageWrite: (writeContext) => {
					const preparedMessage = runAgentHarnessBeforeMessageWriteHook(writeContext);
					params.assertCurrent();
					return preparedMessage;
				},
				onPersistenceError: (error) => {
					params.context.logGateway.warn(`gateway agent user transcript persistence failed: ${formatForLog(error)}`);
				}
			});
			if (!await recorder.stageApproved({
				runId: params.runId,
				assertCurrent: () => {
					params.assertCurrent();
					settleWakeReplay?.assertCurrent();
				},
				assertAdmittedCurrent: params.assertCurrent,
				assertCompletionCurrent: params.assertCompletionCurrent
			}) && !recorder.getProcessingCompletion?.()) throw new Error("agent turn was not durably admitted");
			if (settleWakeReplay) inputProvenance = normalizeInputProvenance(recorder.getPendingInputMessage?.()?.provenance);
		}
		let releaseProcessingAbortObserver;
		if (trackRequesterCompletion && recorder && !recorder.getProcessingCompletion?.()) {
			const recordAbort = () => {
				const stopReason = params.getAbortStopReason?.() ?? "rpc";
				const settle = () => {
					completeUserTurnProcessing(recorder, buildAgentRunTerminalOutcome({
						status: stopReason === "timeout" ? "timeout" : "error",
						stopReason
					})).catch((error) => {
						params.context.logGateway.warn(`requester input cancellation persistence failed: ${formatForLog(error)}`);
					});
				};
				if (stopReason === "timeout" && params.deferTimeoutCompletion?.(settle)) return;
				settle();
			};
			params.abortSignal?.addEventListener("abort", recordAbort, { once: true });
			releaseProcessingAbortObserver = () => params.abortSignal?.removeEventListener("abort", recordAbort);
			if (params.abortSignal?.aborted) recordAbort();
		}
		return {
			...params.privateCompletion ? { privateCompletion: true } : {},
			replyExpectation: params.replyExpectation,
			...releaseProcessingAbortObserver ? { releaseProcessingAbortObserver } : {},
			...execApprovalFollowupRuntimeHandoff?.bashElevated ? { bashElevated: execApprovalFollowupRuntimeHandoff.bashElevated } : {},
			...claimedExecApprovalFollowupHandoffId ? { claimedExecApprovalFollowupHandoffId } : {},
			execApprovalFollowupHandoffClaimId,
			...execApprovalContinuationPromptRange ? { execApprovalContinuationPromptRange } : {},
			message,
			inputProvenance,
			...recorder ? { recorder } : {},
			senderIsOwner,
			suppressPromptPersistence
		};
	} catch (error) {
		const mediaRetained = recorder !== void 0 && retainsUserTurnTranscriptMedia(recorder);
		if (mediaRetained) params.onUserTurnMediaPersisted();
		releaseExecApprovalFollowupRuntimeHandoff({
			handoffId: claimedExecApprovalFollowupHandoffId,
			claimId: execApprovalFollowupHandoffClaimId
		});
		if (!mediaRetained) await Promise.allSettled(createdMediaIds.map((id) => deleteMediaBuffer(id, "inbound")));
		throw error;
	}
}
function annotateAgentRunUserTurnPrompt(params) {
	const message = annotateInterSessionPromptText(params.message, params.inputProvenance);
	let execApprovalContinuationPromptRange = params.execApprovalContinuationPromptRange;
	if (execApprovalContinuationPromptRange) {
		if (!message.endsWith(params.message)) throw new Error("exec approval continuation prompt range could not be annotated");
		const offset = message.length - params.message.length;
		execApprovalContinuationPromptRange = {
			start: offset + execApprovalContinuationPromptRange.start,
			end: offset + execApprovalContinuationPromptRange.end
		};
	}
	return {
		message,
		execApprovalContinuationPromptRange
	};
}
function finalizePreparedAgentRunUserTurn(prepared) {
	const handoffId = prepared.claimedExecApprovalFollowupHandoffId;
	if (!handoffId) return;
	if (!finalizeExecApprovalFollowupRuntimeHandoff({
		handoffId,
		claimId: prepared.execApprovalFollowupHandoffClaimId
	})) throw new Error("exec approval followup runtime handoff expired before dispatch");
}
async function releaseStoppedAgentRunUserTurn(prepared, abort) {
	const stopReason = abort.entry?.abortStopReason;
	const outcome = buildAgentRunTerminalOutcome({
		status: "error",
		stopReason
	});
	await releasePreparedAgentRunUserTurn(prepared, abort.controller.signal.aborted && stopReason !== "restart" && (!prepared.privateCompletion || outcome.reason === "cancelled") ? "cancelled" : "interrupted");
}
async function releasePreparedAgentRunUserTurn(prepared, disposition = "interrupted") {
	try {
		prepared.releaseProcessingAbortObserver?.();
		prepared.recorder?.finishPendingInput?.(disposition);
	} finally {
		try {
			await prepared.recorder?.waitForPendingInputSettlement?.();
		} finally {
			releaseExecApprovalFollowupRuntimeHandoff({
				handoffId: prepared.claimedExecApprovalFollowupHandoffId,
				claimId: prepared.execApprovalFollowupHandoffClaimId
			});
		}
	}
}
/** Settles failed input while preserving both admission and settlement failures. */
async function releasePreparedAgentRunUserTurnAfterFailure(prepared, error, disposition = "cancelled") {
	try {
		await releasePreparedAgentRunUserTurn(prepared, disposition);
		return error;
	} catch (cleanupError) {
		return new AggregateError([error, cleanupError], `${formatForLog(error)}; pending input cleanup failed: ${formatForLog(cleanupError)}`);
	}
}
//#endregion
//#region src/gateway/agent-turn/agent-run-admission-revalidation.ts
/** Keep owner-provided policy failures intact across every preaccept preparation phase. */
function resolveAgentRunAdmissionError(code, error) {
	return error instanceof SessionMutationAuthorizationChangedError ? error.error : error instanceof PreparedModelRuntimePublicationSupersededError ? errorShapeFromError(ErrorCodes.UNAVAILABLE, error, {
		message: "Model runtime changed before this turn started. Retry the request.",
		retryable: true,
		retryAfterMs: 0
	}) : errorShapeFromError(code, error);
}
/** Join rejected input and preaccept cleanup without losing either failure. */
async function releaseFailedAgentRunAdmission(userTurn, error, cleanupPreaccept) {
	const failure = await releasePreparedAgentRunUserTurnAfterFailure(userTurn, error, "interrupted");
	try {
		await cleanupPreaccept();
	} catch (cleanupError) {
		throw new AggregateError([failure, cleanupError], `${formatForLog(failure)}; agent admission cleanup failed: ${formatForLog(cleanupError)}`, { cause: cleanupError });
	}
	throw failure;
}
/** Revalidate the same prepared admission after each asynchronous preparation step. */
function createAgentRunAdmissionRevalidator(options) {
	const { source: params, activeRunAbort, parentResume, rejectPreaccept, cleanupPreaccept } = options;
	const publishAborted = () => {
		if (activeRunAbort.controller.signal.aborted) setAbortedAgentDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.getOwnedAgentDedupeKeys(),
			agentId: params.admissionAgentId(),
			runId: params.runId,
			stopReason: activeRunAbort.entry?.abortStopReason ?? "rpc"
		});
	};
	return (userTurn) => {
		const disposition = parentResume ? "cancelled" : "interrupted";
		try {
			const sessionEntry = params.assertGatewayWorkAdmissionAllowed();
			if (parentResume) {
				if (params.client?.internal?.syntheticClient !== true) throw new Error("Task resume requires trusted in-process admission.");
				assertParentSubagentResumeCurrent({
					cfg: params.cfg,
					resume: parentResume,
					sessionKey: params.resolvedSessionKey,
					sessionId: params.getAdmittedSessionId(),
					sessionLifecycleRevision: sessionEntry?.lifecycleRevision
				});
			}
		} catch (err) {
			return (async () => {
				const failure = userTurn ? await releasePreparedAgentRunUserTurnAfterFailure(userTurn, err, disposition) : err;
				if (failure === err) publishAborted();
				return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.INVALID_REQUEST, failure));
			})();
		}
		if (!activeRunAbort.controller.signal.aborted && !params.hasGatewayAdmissionOutcome()) return true;
		return (async () => {
			try {
				if (userTurn) await releasePreparedAgentRunUserTurn(userTurn, disposition);
				publishAborted();
				params.assertGatewayWorkAdmissionAllowed();
			} catch (error) {
				return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.INVALID_REQUEST, error));
			}
			const admissionReleased = params.respondToGatewayAdmissionOutcome();
			await cleanupPreaccept(admissionReleased);
		})();
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-recovery-admission.ts
/** Bind durable recovery admission to the exact restoration needed if execution never starts. */
async function admitAgentRestartRecovery(params) {
	const admission = await commitMainSessionRecovery({
		command: {
			kind: "admit_recovery",
			lifecycleGeneration: params.lifecycleGeneration,
			now: Date.now(),
			runId: params.runId,
			sessionId: params.sessionId
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	if (admission.transition.kind !== "admitted_recovery") throw new Error(`Session "${params.sessionKey}" restart recovery reservation is stale; recovery was skipped.`);
	const sessionKey = admission.sessionKey ?? params.sessionKey;
	const admittedAttempt = admission.transition.admission;
	let restored = false;
	return async () => {
		if (restored) return;
		const recovery = await commitMainSessionRecovery({
			command: {
				kind: "mark_admitted_recovery_interrupted",
				...admittedAttempt,
				now: Date.now()
			},
			requireWriteSuccess: true,
			target: {
				sessionKey,
				storePath: params.storePath
			}
		});
		restored = true;
		return (recovery.transition.kind === "applied" || recovery.transition.kind === "no_change") && recovery.entry?.sessionId === params.sessionId && recovery.sessionKey ? {
			sessionId: recovery.entry.sessionId,
			sessionKey: recovery.sessionKey,
			storePath: params.storePath
		} : void 0;
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-diagnostics.ts
/** Capture privacy once for command output, failure diagnostics, and later RPC replay. */
function createAgentRunDiagnostics(sessionKey, isIncognitoEntry, log) {
	const incognito = isIncognitoEntry === true || isIncognitoSessionKey(sessionKey);
	const privateError = "Incognito agent error.";
	return {
		incognito,
		runtime: incognito ? {
			log() {},
			error() {},
			exit: defaultRuntime.exit
		} : defaultRuntime,
		warning: (message) => (error) => log.warn(`${message}: ${incognito ? privateError : formatForLog(error)}`),
		forReplay: (entry) => incognito ? {
			...entry,
			incognito: true
		} : entry,
		errorMeta: (message, includeError = true) => ({
			...message !== void 0 && includeError ? { error: incognito ? privateError : message } : {},
			...message !== void 0 && incognito ? { errorMessage: privateError } : {}
		})
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-subagent.ts
/** Native subagent registration and paused-run adoption precede Gateway acceptance. */
async function prepareGatewaySubagentRun(params) {
	const followupSuccessor = params.resolvedSessionKey ? readFollowupSuccessor(params.runId, params.resolvedSessionKey) : void 0;
	if (followupSuccessor) {
		params.assertResumeAdmissionCurrent();
		await followupSuccessor.owner.prepareSuccessor(followupSuccessor);
		params.assertResumeAdmissionCurrent();
		followupSuccessor.assertCurrent();
		return {
			pluginSubagent: false,
			reactivateSubagent: false,
			followupCompletion: followupSuccessor.owner,
			followupSuccessor
		};
	}
	const resume = readInProcessSubagentResume(params.client?.internal);
	if (resume) return {
		pluginSubagent: false,
		reactivateSubagent: false,
		adoptParentResume: await prepareParentSubagentResume({
			cfg: params.cfg,
			resume,
			sessionKey: params.resolvedSessionKey,
			getSessionId: params.getAdmittedSessionId,
			runId: params.runId,
			task: params.request.message,
			assertAdmissionCurrent: params.assertResumeAdmissionCurrent,
			onAdopted: params.onParentResumeAdopted,
			gatewayContextResolver: params.context.resolveGatewayContext
		})
	};
	const sessionKey = params.resolvedSessionKey?.trim();
	const request = sessionKey ? readFollowupRequest(params.runId, sessionKey) : void 0;
	if (request) {
		if (request.requesterSessionKey !== params.inputProvenance?.sourceSessionKey) throw new Error("Follow-up requester does not match its completion custody.");
		const completion = SessionFollowupCompletion.bind(request, params.assertResumeAdmissionCurrent);
		request.completion = completion;
		return {
			pluginSubagent: false,
			reactivateSubagent: false,
			followupCompletion: completion
		};
	}
	const internalOwner = params.client?.internal?.agentRunTracking;
	const interSession = params.inputProvenance?.kind === "inter_session";
	const pluginSubagent = Boolean(!params.isOneShotModelRun && sessionKey && (interSession ? params.inputProvenance?.sourceTool === "subagent_settle" && getLatestLiveSubagentRunByChildSessionKey(sessionKey, (entry) => entry.pauseReason === "sessions_yield", params.activeSessionAgentId) : internalOwner === "plugin_subagent"));
	params.assertResumeAdmissionCurrent();
	if (pluginSubagent && sessionKey) try {
		await registerPluginSubagentRunFromGateway({
			cfg: params.cfg,
			runId: params.runId,
			childSessionKey: sessionKey,
			childAgentId: params.activeSessionAgentId,
			task: params.request.message.trim(),
			requester: params.client?.internal?.pluginSubagentRequester,
			pluginId: normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId),
			assertCurrent: params.assertResumeAdmissionCurrent,
			gatewayContextResolver: params.context.resolveGatewayContext
		});
	} catch (error) {
		params.assertResumeAdmissionCurrent();
		params.context.logGateway.warn(`failed to register plugin subagent run ${params.runId}; rejecting untracked dispatch: ${formatForLog(error)}`);
		throw new Error("plugin subagent registry persistence failed; run was not started", { cause: error });
	}
	return {
		pluginSubagent,
		reactivateSubagent: Boolean(sessionKey && !params.isOneShotModelRun && !interSession && !pluginSubagent && internalOwner !== "native_subagent" && !isAcpSessionKey(sessionKey))
	};
}
/** Rejection may settle only the exact physical execution already adopted by this admission. */
async function settleUnstartedGatewayFollowup(params) {
	const completion = params.completion;
	if (!completion?.ownsExecution(params.runId)) return;
	try {
		await completion.settle(params.runId, {
			...params.outcome,
			endedAt: params.outcome.endedAt ?? Date.now()
		}, () => {
			const current = params.context.chatAbortControllers.get(params.runId);
			const admitted = params.admittedRunIdentity;
			const ownsRegistration = current === params.admittedRunEntry && admitted && current?.controller === admitted.controller && current.operationalRunInstance === admitted.operationalRunInstance && current.lifecycleGeneration === admitted.lifecycleGeneration && current.sessionKey === admitted.sessionKey;
			if (current && !ownsRegistration && (current === params.admittedRunEntry || current.sessionKey === completion.request.targetSessionKey)) throw new Error("Follow-up admission was replaced before cleanup.");
		});
	} catch (error) {
		completion.close(error);
		createAgentRunDiagnostics(completion.request.targetSessionKey, params.isIncognito, params.context.logGateway).warning(`failed to settle unstarted follow-up ${params.runId}`)(error);
	}
}
/** A registered subagent run passes its timeout only to the turn admitted for its own session. */
function resolveRegisteredSubagentTimeoutSeconds(params) {
	const registeredRun = params.sessionKey ? getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, void 0, params.agentId) : void 0;
	const authority = registeredRun ? resolveSubagentChildAuthority(registeredRun, params.admittedSessionEntry) : void 0;
	return registeredRun && (!registeredRun.execution.suppressSessionEffects || authority?.status === "legacy-unverified") && params.admittedSessionEntry?.sessionId === params.admittedSessionId && registeredRun.childSessionIdentity?.sessionId === params.admittedSessionId && registeredRun.childSessionIdentity?.lifecycleRevision === params.admittedSessionEntry?.lifecycleRevision && authority?.status !== "mismatch" ? registeredRun.runTimeoutSeconds ?? 0 : void 0;
}
//#endregion
//#region src/gateway/agent-turn/agent-run-admission-phase.ts
async function prepareAgentRunDispatch(params) {
	const assertRequesterCurrent = captureRequesterCronAuthorityAdmissionAssertion({
		runId: params.runId,
		sessionKey: params.resolvedSessionKey,
		sessionId: params.getAdmittedSessionId(),
		inputProvenance: params.inputProvenance
	});
	assertRequesterCurrent?.();
	const coordination = isSubagentCoordinationInputProvenance(params.inputProvenance);
	const controlUiVisible = !params.suppressVisibleSessionEffects && !coordination;
	const parentResume = readInProcessSubagentResume(params.client?.internal);
	const preRegistrationAbort = readGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		keys: params.agentDedupeKeys
	});
	if (isPreRegistrationAbortedAgentDedupeEntryForSession({
		entry: preRegistrationAbort,
		runId: params.runId,
		sessionKey: params.resolvedSessionKey,
		alternateSessionKeys: [params.preAcceptedReservedSessionKey, params.requestedSessionKey],
		agentId: params.activeSessionAgentId
	})) {
		params.markAgentRunAccepted(true);
		params.io.emitAcceptance([
			true,
			preRegistrationAbort?.payload,
			void 0
		], {
			cached: true,
			runId: params.runId
		});
		return;
	}
	if (params.abortForLifecycleRotation({
		sessionKey: params.resolvedSessionKey,
		agentId: params.activeSessionAgentId
	})) return;
	if (params.restoredCronContinuationIdentity && !params.restoredCronContinuation) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation could not be restored")
		]);
		return;
	}
	const { effectiveProviderOverride, effectiveModelOverride, effectiveThinking, effectiveAllowModelOverride, resolvedRuntime, lifecycleStorePath } = resolveAgentRunAdmissionModel(params);
	let timeoutSeconds;
	let operationalRunInstance;
	try {
		await params.acquireGatewayWorkAdmission(lifecycleStorePath);
		const admittedSessionEntry = params.assertGatewayWorkAdmissionAllowed();
		if (!params.hasGatewayAdmissionOutcome()) {
			params.context.requestEntryLifetime?.signal.throwIfAborted();
			timeoutSeconds = params.request.timeout ?? resolveRegisteredSubagentTimeoutSeconds({
				sessionKey: params.isOneShotModelRun ? void 0 : params.resolvedSessionKey,
				agentId: params.activeSessionAgentId,
				admittedSessionId: params.getAdmittedSessionId(),
				admittedSessionEntry
			});
			const timeoutMs = resolveAgentTimeoutMs({
				cfg: params.cfgForAgent ?? params.cfg,
				overrideSeconds: timeoutSeconds
			});
			operationalRunInstance = createOperationalRunInstanceRef(params.runId);
			const now = Date.now();
			params.setAdmittedRunAbort(registerChatAbortController({
				chatAbortControllers: params.context.chatAbortControllers,
				runId: params.runId,
				sessionId: params.getAdmittedSessionId(),
				sessionKey: params.resolvedSessionKey,
				agentId: params.admissionAgentId(),
				timeoutMs,
				now,
				expiresAtMs: resolveAgentRunExpiresAtMs({
					now,
					timeoutMs
				}),
				ownerConnId: params.ownerConnId,
				ownerDeviceId: params.ownerDeviceId,
				providerId: resolvedRuntime.provider,
				authProviderId: resolveProviderIdForAuth(resolvedRuntime.provider, { config: params.cfgForAgent ?? params.cfg }),
				isAbortable: () => isEmbeddedAgentRunAbortableForRunId(params.runId),
				onRemoved: () => clearEmbeddedAgentRunAbortabilityForRunId(params.runId),
				onQueueTimeout: (entry) => void abortChatRunById(createChatAbortOps(params.context), {
					runId: params.runId,
					sessionKey: entry.sessionKey,
					stopReason: "timeout"
				}),
				controlUiVisible,
				kind: "agent",
				lifecycleGeneration: params.lifecycleGeneration,
				operationalRunInstance
			}));
		}
	} catch (err) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err))
		]);
		return;
	}
	if (params.respondToGatewayAdmissionOutcome()) return;
	const activeGatewayWorkAdmission = params.getGatewayWorkAdmission();
	const activeRunAbort = activeGatewayWorkAdmission ? params.getAdmittedRunAbort() : void 0;
	if (!activeGatewayWorkAdmission || !activeRunAbort || !operationalRunInstance) {
		activeRunAbort?.cleanup();
		activeGatewayWorkAdmission?.release();
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, "agent run admission failed")
		]);
		return;
	}
	const existingRunAbort = params.context.chatAbortControllers.get(params.runId);
	if (!activeRunAbort.registered && existingRunAbort) {
		activeGatewayWorkAdmission.release();
		params.markAgentRunAccepted(existingRunAbort.kind === "agent");
		params.io.emitAcceptance([
			true,
			{
				runId: params.runId,
				status: "in_flight"
			},
			void 0
		], {
			cached: true,
			runId: params.runId
		});
		return;
	}
	const admittedRunIdentity = activeRunAbort.entry ? {
		controller: activeRunAbort.controller,
		operationalRunInstance,
		lifecycleGeneration: params.lifecycleGeneration,
		sessionKey: activeRunAbort.entry.sessionKey
	} : void 0;
	if (!activeRunAbort.registered) activeGatewayWorkAdmission.release();
	else {
		retainEmbeddedAgentRunAbortabilityForRunId(params.runId);
		if (params.pendingChatRun) params.context.addChatRun(params.runId, {
			...params.pendingChatRun,
			clientRunId: params.runId
		});
		if (params.resolvedSessionKey) claimAgentRunContext(params.runId, {
			...params.suppressVisibleSessionEffects ? {} : { sessionKey: params.resolvedSessionKey },
			agentId: activeRunAbort.entry.agentId,
			isControlUiVisible: controlUiVisible,
			...coordination ? {
				projectSessionMessages: false,
				projectSessionActive: false
			} : {},
			lifecycleGeneration: params.lifecycleGeneration,
			mainSessionRestartRecovery: params.isRestartRecoveryResumeRun ? true : void 0
		});
		params.io.emitStartOwner?.(params.runId, activeRunAbort.entry);
	}
	const workspaceOverride = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: params.sessionEntry?.spawnedBy,
		workspaceDir: params.sessionEntry?.spawnedWorkspaceDir,
		cwd: params.sessionEntry?.spawnedCwd
	});
	let preparedModelRuntimeLease;
	let dispatchRuntimeLease;
	let capturedOperator;
	let followupCompletion;
	let adoptedParentResume;
	let restoreAdmittedRestartRecoveryInterrupted;
	const cleanupPreaccept = async (admissionReleased = false, failure) => {
		const lease = preparedModelRuntimeLease;
		preparedModelRuntimeLease = void 0;
		const completion = followupCompletion;
		followupCompletion = void 0;
		let pendingRecovery;
		try {
			const adopted = adoptedParentResume;
			adoptedParentResume = void 0;
			if (adopted) await runWithGatewayDetachedWorkContinuation(async () => {
				const runtime = await import("./subagent-registry-BSZR34Tv.mjs");
				const ownsAdoption = () => isSameSubagentRunOwner(getLatestLiveSubagentRunByChildSessionKey(adopted.childSessionKey, void 0, adopted.childAgentId), adopted);
				if (!ownsAdoption()) return;
				if (!await runtime.finalizeInterruptedSubagentRun({
					runId: adopted.runId,
					expectedEntry: adopted,
					error: failure ?? "Parent resume admission ended before acceptance.",
					suppressSessionEffects: true
				}) && ownsAdoption()) throw new Error("Adopted parent resume could not be durably settled after admission rejection");
			}, "subagents:unstarted-resume");
			if (completion) await settleUnstartedGatewayFollowup({
				completion,
				runId: params.runId,
				admittedRunEntry: activeRunAbort.entry,
				admittedRunIdentity,
				context: params.context,
				isIncognito: params.sessionEntry?.incognito,
				outcome: buildAgentRunTerminalOutcome({
					status: activeRunAbort.controller.signal.aborted ? "timeout" : "error",
					stopReason: activeRunAbort.controller.signal.aborted ? activeRunAbort.entry?.abortStopReason ?? "rpc" : void 0,
					error: failure ?? "Follow-up admission ended before acceptance."
				})
			});
		} finally {
			try {
				if (restoreAdmittedRestartRecoveryInterrupted) pendingRecovery = await repairMainSessionRecoveryMutation({
					mutation: restoreAdmittedRestartRecoveryInterrupted,
					onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
					onError: (error) => params.context.logGateway.warn(`failed to restore unaccepted restart recovery: ${formatForLog(error)}`)
				});
			} finally {
				try {
					await lease?.[Symbol.asyncDispose]();
				} finally {
					try {
						capturedOperator?.release();
						activeRunAbort.cleanup();
						if (!admissionReleased) activeGatewayWorkAdmission.release();
					} finally {
						completion?.finishExecution(params.runId);
						scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
					}
				}
			}
		}
	};
	const rejectPreaccept = async (error) => {
		try {
			await cleanupPreaccept(false, error.message);
		} finally {
			params.io.emitAcceptance([
				false,
				void 0,
				error
			]);
		}
	};
	const revalidateAdmission = createAgentRunAdmissionRevalidator({
		source: params,
		activeRunAbort,
		parentResume,
		rejectPreaccept,
		cleanupPreaccept
	});
	let replyDispatchRuntime;
	let preparedModelRuntime;
	try {
		const publishedRuntime = await loadPublishedGatewayReplyDispatchRuntime({
			agentId: params.activeSessionAgentId,
			abortSignal: activeRunAbort.controller.signal,
			onRuntimeLease: (lease) => {
				dispatchRuntimeLease = scopePreparedModelRuntimeLease(lease);
				preparedModelRuntimeLease = dispatchRuntimeLease;
			}
		});
		const publishedAdmission = revalidateAdmission();
		if (publishedAdmission !== true) return publishedAdmission;
		const runtimeLease = dispatchRuntimeLease;
		if (!publishedRuntime || !runtimeLease) throw new Error(`published reply runtime missing for ${params.activeSessionAgentId}`);
		replyDispatchRuntime = publishedRuntime;
		const acquireRuntime = (workspaceDir) => runtimeLease.run(() => acquireAgentRunPreparedModelRuntime({
			config: replyDispatchRuntime.config,
			agentId: replyDispatchRuntime.agentId,
			agentDir: replyDispatchRuntime.agentDir,
			allowGatewaySubagentBinding: true,
			workspaceDir: workspaceDir ?? replyDispatchRuntime.workspaceDir,
			runtimePluginSelections: [{
				provider: resolvedRuntime.provider,
				modelId: resolvedRuntime.model,
				runtime: resolvedRuntime.harness
			}]
		}, {
			catalogMode: "static",
			pluginGeneration: replyDispatchRuntime.pluginGeneration,
			abortSignal: activeRunAbort.controller.signal
		}));
		if (canPrepareAgentSessionWorktree(params.resolvedSessionKey, params.sessionEntry)) preparedModelRuntime = {
			preparedModelRuntimeLease: runtimeLease,
			acquireWorkspaceModelRuntime: acquireRuntime
		};
		else {
			preparedModelRuntimeLease = await acquireRuntime(workspaceOverride);
			await runtimeLease[Symbol.asyncDispose]();
			preparedModelRuntime = { preparedModelRuntimeLease };
			const runtimeAdmission = revalidateAdmission();
			if (runtimeAdmission !== true) return runtimeAdmission;
			replyDispatchRuntime = Object.freeze({
				...replyDispatchRuntime,
				pluginGeneration: preparedModelRuntimeLease.pluginGeneration
			});
		}
	} catch (err) {
		const failedAdmission = revalidateAdmission();
		if (failedAdmission !== true) return failedAdmission;
		return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.UNAVAILABLE, err));
	}
	const resolvedThreadId = params.delivery.explicitThreadId ?? params.delivery.deliveryPlan.resolvedThreadId;
	let subagentAdmission;
	try {
		subagentAdmission = await prepareGatewaySubagentRun({
			cfg: params.cfg,
			client: params.client,
			resolvedSessionKey: params.resolvedSessionKey,
			activeSessionAgentId: params.activeSessionAgentId,
			inputProvenance: params.inputProvenance,
			request: params.request,
			isOneShotModelRun: params.isOneShotModelRun,
			runId: params.runId,
			getAdmittedSessionId: params.getAdmittedSessionId,
			context: params.context,
			onParentResumeAdopted: (entry) => {
				adoptedParentResume = entry;
			},
			assertResumeAdmissionCurrent: () => {
				params.assertAdmissionCurrent?.();
				const sessionEntry = params.assertGatewayWorkAdmissionAllowed();
				activeRunAbort.controller.signal.throwIfAborted();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				return sessionEntry;
			}
		});
		followupCompletion = subagentAdmission.followupCompletion;
		const registrationAdmission = revalidateAdmission();
		if (registrationAdmission !== true) return registrationAdmission;
	} catch (err) {
		return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.UNAVAILABLE, err));
	}
	const { pluginSubagent, reactivateSubagent, adoptParentResume, followupSuccessor } = subagentAdmission;
	if (params.isRestartRecoveryResumeRun) {
		const recoverySessionKey = params.resolvedSessionKey;
		if (!recoverySessionKey) return rejectPreaccept(errorShape(ErrorCodes.UNAVAILABLE, "restart recovery session target is unavailable"));
		try {
			restoreAdmittedRestartRecoveryInterrupted = await admitAgentRestartRecovery({
				lifecycleGeneration: params.lifecycleGeneration,
				runId: params.runId,
				sessionId: params.request.expectedExistingSessionId ?? params.getAdmittedSessionId(),
				sessionKey: recoverySessionKey,
				storePath: lifecycleStorePath
			});
			const recoveryRevalidation = revalidateAdmission();
			if (recoveryRevalidation !== true) return recoveryRevalidation;
		} catch (err) {
			return rejectPreaccept(errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
	let assertInputAdmissionCurrent = params.assertAdmissionCurrent;
	let resumedTaskAdopted = false;
	let userTurn;
	const assertInputOwnerCurrent = (terminal = false) => {
		assertInputAdmissionCurrent?.();
		assertRequesterCurrent?.();
		followupCompletion?.assertCurrent();
		if (followupSuccessor) {
			if (!resumedTaskAdopted) followupSuccessor.assertCurrent();
			else if (!followupSuccessor.owner.ownsExecution(params.runId)) throw new Error("Follow-up input no longer owns its admitted execution.");
		}
		if (parentResume && resumedTaskAdopted && !terminal) assertParentSubagentResumeSuccessorCurrent(parentResume, params.runId);
		assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
		const entry = params.context.chatAbortControllers.get(params.runId);
		if (entry !== activeRunAbort.entry || entry && (entry.operationalRunInstance !== operationalRunInstance || !terminal && entry.registrationCleanupRequested)) throw new Error("agent input admission no longer owns this run");
	};
	try {
		assertInputAdmissionCurrent?.();
		userTurn = await prepareAgentRunUserTurn({
			...params,
			assertCurrent: () => {
				assertInputOwnerCurrent();
				activeRunAbort.controller.signal.throwIfAborted();
			},
			assertCompletionCurrent: () => assertInputOwnerCurrent(true),
			abortSignal: activeRunAbort.controller.signal,
			getAbortStopReason: () => activeRunAbort.entry?.abortStopReason ?? "rpc",
			deferTimeoutCompletion: activeRunAbort.deferTimeoutCompletion,
			admittedSessionId: params.getAdmittedSessionId(),
			resolvedThreadId
		});
		if (userTurn.recorder) params.onUserTurnMediaPersisted();
	} catch (err) {
		return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.UNAVAILABLE, err));
	}
	const inputAdmission = revalidateAdmission(userTurn);
	if (inputAdmission !== true) return inputAdmission;
	const accepted = {
		runId: params.runId,
		sessionKey: params.resolvedSessionKey,
		agentId: params.activeSessionAgentId,
		status: "accepted",
		acceptedAt: Date.now(),
		...pluginSubagent ? { runtime: resolvedRuntime } : {},
		...parentResume ? { taskRunId: parentResume.taskRunId } : {}
	};
	const completedInput = reconcileAgentRunUserTurnCompletion(userTurn, accepted, cleanupPreaccept, params.io);
	if (completedInput) {
		await completedInput;
		return;
	}
	try {
		capturedOperator = await retainGatewayOperatorRun({
			...params,
			entry: activeRunAbort.entry,
			abortSession: params.resolvedSessionKey ? {
				cfg: params.cfg,
				storePath: params.lifecycleStorePath,
				entry: params.sessionEntry,
				canonicalKey: params.resolvedSessionKey,
				agentId: params.activeSessionAgentId
			} : void 0
		});
		const operatorAdmission = revalidateAdmission(userTurn);
		if (operatorAdmission !== true) return await operatorAdmission;
		assertInputOwnerCurrent();
		capturedOperator.authority?.assertCurrent();
	} catch (error) {
		const failure = await releasePreparedAgentRunUserTurnAfterFailure(userTurn, error);
		return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.INVALID_REQUEST, failure));
	}
	try {
		const completionEvent = resolveExactSubagentCompletionEvent({
			inputProvenance: userTurn.inputProvenance,
			internalEvents: params.request.internalEvents
		});
		const trustedInternalHandoff = params.providerOverride === void 0 && params.modelOverride === void 0 && params.restoredCronContinuation === void 0 ? consumeSubagentCompletionToolHandoff({
			handoffId: params.client?.internal?.delegatedToolPolicyHandoffId,
			sourceTool: userTurn.inputProvenance?.sourceTool,
			sourceSessionKey: userTurn.inputProvenance?.kind === "inter_session" && userTurn.inputProvenance.sourceTool === "subagent_settle" ? userTurn.inputProvenance.sourceSessionKey : completionEvent?.childSessionKey,
			sourceSessionId: completionEvent?.childSessionId,
			targetSessionKey: params.resolvedSessionKey,
			targetSessionId: params.getAdmittedSessionId(),
			idempotencyKey: params.request.idempotencyKey,
			provider: resolvedRuntime.provider,
			model: resolvedRuntime.model
		}) : void 0;
		if (followupCompletion) {
			assertInputOwnerCurrent();
			params.assertGatewayWorkAdmissionAllowed();
			activeRunAbort.controller.signal.throwIfAborted();
			if (followupSuccessor) {
				followupCompletion.adopt(followupSuccessor);
				resumedTaskAdopted = true;
			}
		}
		if (adoptParentResume) try {
			await adoptParentResume();
			resumedTaskAdopted = true;
			assertInputOwnerCurrent();
			params.assertGatewayWorkAdmissionAllowed();
			activeRunAbort.controller.signal.throwIfAborted();
			capturedOperator.authority?.assertCurrent();
		} catch (err) {
			const failure = await releasePreparedAgentRunUserTurnAfterFailure(userTurn, err);
			return rejectPreaccept(resolveAgentRunAdmissionError(ErrorCodes.UNAVAILABLE, failure));
		}
		followupCompletion?.markAccepted(params.runId);
		params.markAgentRunAccepted(true);
		adoptedParentResume = void 0;
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			entry: {
				ts: Date.now(),
				ok: true,
				payload: {
					...accepted,
					controlUiVisible,
					dedupeKeys: params.agentDedupeKeys,
					ownerConnId: params.ownerConnId,
					ownerDeviceId: params.ownerDeviceId
				}
			}
		});
		assertInputAdmissionCurrent = void 0;
		params.io.emitAcceptance([
			true,
			accepted,
			void 0
		], { runId: params.runId });
		capturedOperator.armCancellation();
		recordAgentRunUserTurnParticipant({
			...params,
			inputProvenance: userTurn.inputProvenance
		}, userTurn, lifecycleStorePath);
		const cronCreatorAuthority = resolveGatewayCronCreatorAuthorityAdmission({
			runId: params.runId,
			resolvedSessionKey: params.resolvedSessionKey,
			sessionId: params.getAdmittedSessionId(),
			spawnedBy: params.sessionEntry?.spawnedBy,
			client: params.client,
			request: params.request,
			isCurrent: params.hasCurrentClientAuthority,
			inputProvenance: userTurn.inputProvenance,
			hasRestoredCronContinuation: params.restoredCronContinuation !== void 0,
			isOneShotModelRun: params.isOneShotModelRun,
			isRestartRecoveryResumeRun: params.isRestartRecoveryResumeRun
		});
		const releaseOperatorAuthority = capturedOperator.release;
		return {
			activeGatewayWorkAdmission,
			activeRunAbort,
			...cronCreatorAuthority ? { cronCreatorAuthority } : {},
			releaseCallerAuthority: () => {
				try {
					cronCreatorAuthority?.release?.();
				} finally {
					releaseOperatorAuthority();
				}
			},
			...capturedOperator.authority ? { operatorAuthority: capturedOperator.authority } : {},
			operationalRunInstance,
			timeoutSeconds,
			effectiveProviderOverride,
			effectiveModelOverride,
			effectiveThinking,
			effectiveAllowModelOverride,
			trustedInternalHandoff,
			restoredCronContinuationLifecycleRevision: params.restoredCronContinuation?.lifecycleRevision,
			lifecycleStorePath,
			resolvedThreadId,
			reactivateSubagent,
			followupCompletion,
			...preparedModelRuntime,
			replyDispatchRuntime,
			unpersistedOffloadedRefs: userTurn.recorder ? [] : params.offloadedRefs,
			userTurn,
			workspaceOverride,
			restoreAdmittedRestartRecoveryInterrupted
		};
	} catch (error) {
		return releaseFailedAgentRunAdmission(userTurn, error, cleanupPreaccept);
	}
}
//#endregion
//#region src/gateway/server-methods/agent-run-model-selection.ts
function createAgentRunModelSelectionHandler(params) {
	return async ({ provider, model }) => {
		if (params.trustedInternalHandoff) {
			params.trustedInternalHandoff.provider = provider.trim().toLowerCase();
			params.trustedInternalHandoff.model = model.trim();
		}
		updateChatRunProvider(params.context.chatAbortControllers, {
			runId: params.runId,
			providerId: provider,
			authProviderId: resolveProviderIdForAuth(provider, { config: params.cfgForAgent ?? params.cfg })
		});
		if (!params.restoredCronContinuationLifecycleRevision || !params.resolvedSessionKey) return;
		if (!await applySessionEntryExactReplacements({
			activeSessionKey: params.resolvedSessionKey,
			requireWriteSuccess: true,
			sessionKeys: [params.resolvedSessionKey],
			skipMaintenance: false,
			storePath: params.lifecycleStorePath,
			update: (entries) => {
				const current = entries.find((entry) => entry.sessionKey === params.resolvedSessionKey)?.entry;
				const marker = current?.cronRunContinuation;
				if (!current || marker?.phase !== "continuing" || marker.ownerRunId !== params.runId || marker.lifecycleRevision !== params.restoredCronContinuationLifecycleRevision) return { result: false };
				const executionProvider = resolveCliRuntimeExecutionProvider({
					provider,
					cfg: params.cfgForAgent ?? params.cfg,
					agentId: params.activeSessionAgentId,
					modelId: model
				}) ?? provider;
				const cronRunContinuation = { ...marker };
				if (isCliProvider(executionProvider, params.cfgForAgent ?? params.cfg)) cronRunContinuation.cliExecutionProvider = executionProvider;
				else delete cronRunContinuation.cliExecutionProvider;
				return {
					replacements: [{
						sessionKey: params.resolvedSessionKey,
						entry: {
							...current,
							cronRunContinuation,
							modelProvider: provider,
							model,
							updatedAt: Date.now()
						}
					}],
					result: true
				};
			}
		})) throw new Error("cron run continuation changed before model execution");
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-restart-recovery-context.ts
/** Reconstructs source policy, presentation, and delivery facts from one exact recovery claim. */
function resolveAgentRestartRecoveryContext(params) {
	const expectedSessionId = normalizeOptionalString(params.expectedExistingSessionId);
	const entry = params.sessionEntry;
	if (!params.canUseInternalRuntimeHandoff || !expectedSessionId || !entry || expectedSessionId !== normalizeOptionalString(params.resolvedSessionId) || expectedSessionId !== normalizeOptionalString(entry.sessionId) || !normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== params.runId) return;
	if (params.isRestartRecoveryResumeRun && entry.restartRecoverySourceIngress === "control-ui") return {
		messageChannel: INTERNAL_MESSAGE_CHANNEL,
		pinnedWidgetAuthoring: true
	};
	const messageChannel = normalizeMessageChannel(entry.restartRecoveryDeliveryContext?.channel);
	if (entry.restartRecoverySourceIngress !== "channel" || !messageChannel || !isDeliverableMessageChannel(messageChannel)) return;
	const authority = resolveRestartRecoveryChannelAuthority(entry);
	return authority ? {
		messageChannel,
		channel: {
			channel: authority.deliveryContext.channel,
			currentChannelId: authority.deliveryContext.to,
			currentThreadTs: authority.deliveryContext.threadId != null ? String(authority.deliveryContext.threadId) : void 0,
			sourceTurnId: authority.sourceTurnId,
			requesterAccountId: normalizeOptionalString(entry.restartRecoveryRequesterAccountId),
			requesterSenderId: normalizeOptionalString(entry.restartRecoveryRequesterSenderId),
			sameChannelThreadRequired: entry.restartRecoverySameChannelThreadRequired === true
		}
	} : { messageChannel };
}
/** Resolve only the private token durably owned by the admitted recovery cycle. */
function resolveAgentRestartRecoveryExecutionIdentityAdmission(params) {
	if (!params.isRestartRecoveryResumeRun || !params.collectionEnabled) return;
	if (params.retryOnly === void 0) throw new Error("restart recovery execution identity admission mode is unavailable");
	const stored = params.sessionEntry?.mainRestartRecovery?.executionIdentity;
	return createExecutionIdentityRecoveryAdmission({
		...stored ? { token: parseExecutionIdentityAdmissionToken(stored) } : {},
		retryOnly: params.retryOnly,
		expectedOperationalRunId: params.runId
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-run-dispatch-execution-identity.ts
const dispatchExecutionIdentities = /* @__PURE__ */ new WeakMap();
function withAgentRunDispatchExecutionIdentity(params, facts) {
	if (!facts) return params;
	const carried = { ...params };
	dispatchExecutionIdentities.set(carried, facts);
	return carried;
}
function readAgentRunDispatchExecutionIdentity(params) {
	return dispatchExecutionIdentities.get(params);
}
//#endregion
//#region src/gateway/agent-turn/agent-run-dispatch-outcome.ts
function projectWithdrawnAgentInput(payload, pendingInputId, stopReason) {
	if (!pendingInputId || !isRecord(payload)) return payload;
	return {
		...payload,
		...stopReason ? { stopReason } : {},
		reason: "input_withdrawn_before_turn",
		pendingInputId,
		summary: `Input ${pendingInputId} was withdrawn before its turn started and was not delivered.` + ((stopReason ?? payload.stopReason) === "timeout" ? " Raise --timeout and retry." : " Resend it when ready.")
	};
}
function resolveResolvedAgentTimeoutStopReason(meta, signal) {
	if (!signal.aborted) return;
	const record = isRecord(meta) ? meta : void 0;
	if (record?.aborted !== true && record?.stopReason !== "toolUse") return;
	return resolveGatewayAgentAbortStopReason(signal) === "timeout" ? "timeout" : void 0;
}
function isGatewayAbortSignalReason(reason) {
	return reason === void 0 || isAbortError(reason) || readErrorName(reason) === "TimeoutError";
}
function isGatewayAgentAbortRejection(error, signal) {
	if (!signal.aborted) return isAgentRunDirectAbortReason(error) || resolveAgentRunErrorLifecycleFields(error, void 0).stopReason === "restart";
	if (resolveAgentRunErrorLifecycleFields(void 0, signal).stopReason === "restart") return true;
	if (readErrorName(signal.reason) === "TimeoutError") return true;
	if (!isGatewayAbortSignalReason(signal.reason)) return false;
	return isAbortError(error) || readErrorName(error) === "TimeoutError";
}
function resolveGatewayAgentAbortStopReason(signal, error) {
	const stopReason = resolveAgentRunErrorLifecycleFields(error, signal).stopReason;
	return stopReason === "restart" || stopReason === "timeout" ? stopReason : "rpc";
}
const RESOLVED_GATEWAY_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "ok",
	timeout: "timeout",
	cancellation: "timeout",
	failure: "error"
};
function projectRejectedGatewayStatus(outcome) {
	return outcome.reason === "cancelled" || outcome.reason === "superseded" || outcome.stopReason === "timeout" ? "timeout" : "error";
}
//#endregion
//#region src/gateway/agent-turn/agent-run-execution-lineage.ts
/** Consume authenticated spawn provenance once, at the child admission owner. */
function resolveExecutionIdentitySpawnFacts(identity) {
	const lineage = readAgentRuntimeExecutionLineage(identity?.sessionSpawnContext);
	if (!identity || !lineage || !consumeAgentRuntimeExecutionLineage(identity)) return;
	const parent = identity.executionIdentity;
	return {
		ingress: {
			kind: lineage.externalNativeActions === "unsupported" ? "acp" : "subagent",
			boundary: `sessions_spawn.${lineage.externalNativeActions === "unsupported" ? "acp" : "subagent"}`,
			state: "present"
		},
		invoker: {
			state: "present",
			kind: "agent",
			rawPrincipalRef: identity.agentId
		},
		applicableGrants: lineage.applicableGrantRefs.map((rawGrantRef) => ({
			rawGrantRef,
			state: "present"
		})),
		assurance: [{
			kind: "spawn-lineage",
			rawEvidenceRef: lineage.requesterRef,
			strength: "boundary-verified"
		}, ...lineage.runtimeAssuranceRefs.map((rawEvidenceRef) => ({
			kind: "runtime-binding",
			rawEvidenceRef,
			strength: "boundary-verified"
		}))],
		spawnAdmission: executionIdentitySpawnAdmission({
			operation: "serialize",
			value: {
				...parent?.contextId ? { parentContextId: parent.contextId } : {},
				...parent?.executionId ? { parentExecutionId: parent.executionId } : {},
				...parent?.runId ? { parentRunId: parent.runId } : {},
				parentAgentId: identity.agentId,
				relation: lineage.relation,
				rawRequesterRef: lineage.requesterRef,
				rawControllerRef: lineage.controllerRef,
				depth: lineage.depth,
				localPolicyRefs: lineage.localPolicyRefs,
				targetPolicyRefs: lineage.targetPolicyRefs
			},
			extra: [
				...!parent?.contextId ? ["lineage.parent-context"] : [],
				...!parent?.executionId ? ["lineage.parent-execution"] : [],
				...!parent?.runId ? ["lineage.parent-run"] : [],
				...lineage.externalNativeActions === "unsupported" ? ["acp.native-action-callback"] : []
			]
		})
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-dispatch.ts
function dispatchAgentRunFromGateway(params) {
	const diagnostics = createAgentRunDiagnostics(params.ingressOpts.sessionKey, params.isIncognito, params.context.logGateway);
	const assertSettlementCurrent = params.assertSettlementCurrent;
	const registeredRunEntry = params.admittedRunEntry;
	const jobSessionBinding = registeredRunEntry ?? params.ingressOpts;
	let runOwnerSettled = false;
	const projectInputOutcome = (payload) => projectWithdrawnAgentInput(payload, readWithdrawnUserTurnInputId(params.ingressOpts.userTurnTranscriptRecorder), registeredRunEntry?.abortStopReason);
	let pendingReplay;
	const publishReplay = (entry) => {
		if (!runOwnerSettled) {
			pendingReplay = entry;
			return;
		}
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.dedupeKeys,
			session: captureAgentJobSession(jobSessionBinding),
			entry: diagnostics.forReplay({
				...entry,
				payload: projectInputOutcome(entry.payload)
			})
		});
	};
	const registeredRunInstance = registeredRunEntry?.operationalRunInstance;
	const registeredLifecycleGeneration = registeredRunEntry?.lifecycleGeneration;
	const registeredSessionKey = registeredRunEntry?.sessionKey;
	const ownsRunRegistration = () => {
		const current = params.context.chatAbortControllers.get(params.runId);
		return !current || current === registeredRunEntry && current.controller === params.abortController && current.operationalRunInstance === registeredRunInstance && current.lifecycleGeneration === registeredLifecycleGeneration && current.sessionKey === registeredSessionKey;
	};
	const assertCurrent = () => {
		params.abortController.signal.throwIfAborted();
		params.assertCurrent?.();
		params.abortController.signal.throwIfAborted();
	};
	const followupCompletion = params.followupCompletion;
	const settleFollowup = async (reply) => {
		if (!followupCompletion?.ownsExecution(params.runId)) return;
		try {
			await followupCompletion.settle(params.runId, reply, () => {
				assertSettlementCurrent?.();
				const current = params.context.chatAbortControllers.get(params.runId);
				if (!ownsRunRegistration() && (current === registeredRunEntry || current?.sessionKey === registeredSessionKey)) throw new Error("Followup physical execution lost its Gateway registration.");
			});
		} catch (error) {
			followupCompletion.close(error);
			throw error;
		}
	};
	const settle = async (outcome) => {
		try {
			return await params.onSettled?.(outcome) ?? true;
		} catch (error) {
			diagnostics.warning(`failed to settle agent continuation ${params.runId}`)(error);
			return false;
		}
	};
	let runOwnerCleanedUp = false;
	let runOwnerCleanup;
	const cleanupRunOwner = () => {
		if (runOwnerCleanedUp) return runOwnerCleanup;
		runOwnerCleanedUp = true;
		if (ownsRunRegistration()) clearAgentRunContext(params.runId, params.ingressOpts.lifecycleGeneration);
		return runOwnerCleanup = Promise.resolve(params.cleanupAbortController()).then(() => {
			runOwnerSettled = true;
			if (pendingReplay) {
				const entry = pendingReplay;
				pendingReplay = void 0;
				publishReplay(entry);
			}
		});
	};
	const cronCreatorAuthorityCapability = params.cronCreatorAuthority ? createCronCreatorAuthorityCapability(params.cronCreatorAuthority.runId, params.cronCreatorAuthority.callerOrigin, params.cronCreatorAuthority.managementEntitlement, params.cronCreatorAuthority.isCurrent, void 0, params.cronCreatorAuthority.requesterOwner, params.cronCreatorAuthority.callerScopedCreation) : void 0;
	if (cronCreatorAuthorityCapability) params.cronCreatorAuthority?.bindRunScope?.(cronCreatorAuthorityCapability);
	const producerRunInstance = registeredRunEntry?.operationalRunInstance;
	const producerLifecycleGeneration = registeredRunEntry?.lifecycleGeneration;
	const producerSessionKey = registeredRunEntry?.sessionKey;
	const producerCompletion = createDeferredCore();
	let terminalSettlement;
	if (registeredRunEntry && params.ingressOpts.abortSignal === params.abortController.signal) registeredRunEntry.resolveTerminalProducer = () => {
		const { sessionId, sessionKey } = registeredRunEntry;
		const isCurrent = () => {
			const authority = registeredRunEntry.agentRunDelegatedAuthority;
			return !runOwnerCleanedUp && !params.abortController.signal.aborted && params.ingressOpts.abortSignal === params.abortController.signal && params.context.chatAbortControllers.get(params.runId) === registeredRunEntry && registeredRunEntry.controller === params.abortController && registeredRunEntry.operationalRunInstance === producerRunInstance && registeredRunEntry.lifecycleGeneration === producerLifecycleGeneration && registeredRunEntry.sessionId === sessionId && registeredRunEntry.sessionKey === sessionKey && sessionKey === producerSessionKey && !registeredRunEntry.registrationCleanupRequested && (!producerLifecycleGeneration || isAgentEventLifecycleGenerationCurrent(producerLifecycleGeneration)) && (!registeredRunEntry.executionStarted || authority !== void 0) && (!authority || authority.operationalRunInstance === producerRunInstance && validateAgentRunDelegatedAuthority(authority));
		};
		if (!isCurrent()) return;
		return {
			sessionId,
			sessionKey,
			handoff: (settleTranscript) => {
				if (!isCurrent()) return false;
				const settlement = settleTranscript(producerCompletion.promise);
				terminalSettlement = terminalSettlement ? Promise.all([terminalSettlement, settlement]).then(() => void 0) : settlement;
				return true;
			}
		};
	};
	const completeTerminalProducer = async (producerError) => {
		producerCompletion.resolve(producerError);
		let joined;
		do {
			joined = terminalSettlement;
			await joined;
		} while (joined !== terminalSettlement);
	};
	const activateAgent = (media) => {
		assertCurrent();
		const ingressOptsWithSpawnFacts = withAgentCommandExecutionIdentitySpawnFacts({
			...params.ingressOpts,
			...media ? { prepareAssistantTranscriptMessage: media.prepareAssistantTranscriptMessage } : {},
			beforeTerminalDelivery: async (reply, producerError) => {
				try {
					await media?.finalize(reply);
				} finally {
					await completeTerminalProducer(producerError);
				}
			},
			isTerminalOutcomeObserved: () => registeredRunEntry?.terminalOutcomeObserved === true
		}, readAgentRunDispatchExecutionIdentity(params));
		const invoke = () => runWithCanonicalSkillWorkspace(params.canonicalSkillWorkspaceDir, () => agentCommandFromGatewayIngress(cronCreatorAuthorityCapability ? {
			...ingressOptsWithSpawnFacts,
			cronCreatorAuthorityCapability
		} : ingressOptsWithSpawnFacts, diagnostics.runtime, params.context.deps, { restoreAdmittedRecovery: params.restoreAdmittedRecovery }, params.commandRuntimeContext));
		if (followupCompletion) {
			if (!registeredRunEntry || !ownsRunRegistration() || params.context.chatAbortControllers.get(params.runId) !== registeredRunEntry || registeredRunEntry.registrationCleanupRequested) throw new Error("Followup no longer owns its Gateway run registration.");
			followupCompletion.assertExecutionCurrent(params.runId);
		}
		return media ? media.run(invoke) : invoke();
	};
	const runAgent = () => {
		try {
			assertCurrent();
			return params.loadMedia ? params.loadMedia().then(activateAgent) : activateAgent();
		} catch (error) {
			const failure = toErrorObject(error, formatErrorMessage(error));
			if (!(error instanceof Error)) failure.cause = error;
			return Promise.reject(failure);
		}
	};
	const runOwnedAgent = () => withExecRequestTurn({
		identity: {
			runId: params.runId,
			sessionKey: registeredRunEntry?.sessionKey,
			sessionId: registeredRunEntry?.sessionId,
			agentId: registeredRunEntry?.agentId,
			ownerConnId: registeredRunEntry?.ownerConnId,
			ownerDeviceId: registeredRunEntry?.ownerDeviceId,
			controlUiVisible: registeredRunEntry?.controlUiVisible,
			turnKind: registeredRunEntry?.turnKind
		},
		abortSignal: params.abortController.signal
	}, runAgent);
	const agentExecution = cronCreatorAuthorityCapability ? runWithCronCreatorAuthorityCapability(cronCreatorAuthorityCapability, runOwnedAgent, params.abortController.signal) : runOwnedAgent();
	const agentRun = (async () => {
		let producerError;
		try {
			return await agentExecution;
		} catch (error) {
			producerError = error;
			throw error;
		} finally {
			await completeTerminalProducer(producerError);
		}
	})();
	let inputCompletionWriteFailed = false;
	const dispatchCompletion = agentRun.then(async (result) => {
		const recordedOutcome = readAgentRunTerminalOutcome(result);
		const signalStopReason = resolveResolvedAgentTimeoutStopReason(result?.meta, params.abortController.signal);
		const aborted = result?.meta?.aborted === true || signalStopReason !== void 0;
		const stopReason = signalStopReason ? signalStopReason : aborted ? result?.meta?.stopReason ?? "rpc" : void 0;
		const timeoutPhase = normalizeAgentRunTimeoutPhase(result?.meta?.timeoutPhase);
		const terminalError = readAgentRunTerminalError(result) ?? result?.meta?.error?.message;
		let terminalOutcome = buildAgentRunTerminalOutcome({
			status: aborted || result?.meta?.stopReason === "timeout" || timeoutPhase ? "timeout" : recordedOutcome === "failed" || result?.meta?.error || result?.meta?.stopReason === "error" ? "error" : "ok",
			error: terminalError ? formatErrorMessage(terminalError) : void 0,
			stopReason: stopReason ?? result?.meta?.stopReason,
			livenessState: result?.meta?.livenessState,
			timeoutPhase,
			providerStarted: result?.meta?.providerStarted
		});
		let recordedInputCompletion;
		try {
			recordedInputCompletion = await completeUserTurnProcessing(params.ingressOpts.userTurnTranscriptRecorder, terminalOutcome);
			terminalOutcome = recordedInputCompletion ?? terminalOutcome;
		} catch (error) {
			inputCompletionWriteFailed = true;
			throw error;
		}
		const responseStatus = RESOLVED_GATEWAY_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(terminalOutcome)];
		const terminalReply = normalizeAgentRunTerminalReplySnapshot(result?.meta?.terminalReply);
		const receipt = normalizeAgentRunTerminalReceipt(result?.meta?.agentMeta?.terminalReceipt);
		await settleFollowup({
			...terminalOutcome,
			endedAt: terminalOutcome.endedAt ?? Date.now(),
			yielded: result?.meta?.yielded === true,
			terminalReply,
			...terminalReply?.disposition === "visible" ? { replyText: result?.meta?.finalAssistantVisibleText ?? terminalReply.text } : {},
			...receipt?.runId === params.runId && receipt.sourceReplyDelivered ? { sourceReplyDelivered: true } : {}
		});
		const inputProcessingCompleted = recordedInputCompletion?.reason === "completed" && responseStatus === "ok";
		const payload = {
			runId: params.runId,
			status: responseStatus,
			summary: responseStatus === "timeout" ? "aborted" : responseStatus === "error" ? "failed" : "completed",
			...responseStatus !== "ok" && terminalOutcome.stopReason ? { stopReason: terminalOutcome.stopReason } : {},
			...responseStatus === "timeout" && terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
			...responseStatus === "timeout" && terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
			result,
			...inputProcessingCompleted ? { inputProcessingCompleted: true } : {}
		};
		const persistTerminalDedupe = () => {
			publishReplay({
				ts: Date.now(),
				ok: true,
				payload: { ...payload }
			});
		};
		const settled = await settle({
			terminalOutcome,
			onRecovered: persistTerminalDedupe
		});
		if (!settled) {
			const summary = "failed to persist cron continuation settlement";
			const error = errorShape(ErrorCodes.UNAVAILABLE, summary);
			const failedPayload = {
				runId: params.runId,
				status: "error",
				summary
			};
			publishReplay({
				ts: Date.now(),
				ok: false,
				payload: failedPayload,
				error
			});
			await cleanupRunOwner();
			params.io.emitFinal([
				false,
				failedPayload,
				error
			], {
				runId: params.runId,
				error: summary
			});
			return {
				terminalOutcome,
				settled
			};
		}
		persistTerminalDedupe();
		await cleanupRunOwner();
		params.io.emitFinal([
			true,
			projectInputOutcome(payload),
			void 0
		], { runId: params.runId });
		return {
			terminalOutcome,
			settled
		};
	}).catch(async (cause) => {
		const aborted = isGatewayAgentAbortRejection(cause, params.abortController.signal);
		const error = errorShapeFromError(ErrorCodes.UNAVAILABLE, cause);
		const renderedErr = error.message;
		const stopReason = aborted ? resolveGatewayAgentAbortStopReason(params.abortController.signal, cause) : isAbortError(cause) ? "aborted" : void 0;
		let terminalOutcome = buildAgentRunTerminalOutcome({
			status: aborted || isTimeoutError(cause) ? "timeout" : "error",
			error: renderedErr,
			stopReason,
			timeoutPhase: stopReason === "restart" ? "gateway_draining" : void 0
		});
		if (!inputCompletionWriteFailed) try {
			terminalOutcome = await completeUserTurnProcessing(params.ingressOpts.userTurnTranscriptRecorder, terminalOutcome) ?? terminalOutcome;
		} catch (completionError) {
			diagnostics.warning("input completion persistence failed")(completionError);
		}
		const responseStatus = projectRejectedGatewayStatus(terminalOutcome);
		await settleFollowup({
			...terminalOutcome,
			error: renderedErr,
			endedAt: terminalOutcome.endedAt ?? Date.now()
		});
		Object.defineProperty(error, "cause", { value: cause });
		const payload = {
			runId: params.runId,
			status: responseStatus,
			summary: aborted ? "aborted" : renderedErr,
			...aborted ? {
				stopReason,
				...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {}
			} : {}
		};
		const persistTerminalDedupe = (settlementPersisted) => {
			publishReplay({
				ts: Date.now(),
				ok: aborted && settlementPersisted,
				payload,
				...aborted ? {} : { error }
			});
		};
		const settled = await settle({
			terminalOutcome,
			onRecovered: () => persistTerminalDedupe(true)
		});
		persistTerminalDedupe(settled);
		await cleanupRunOwner();
		const responseError = aborted && settled ? void 0 : error;
		params.io.emitFinal([
			aborted && settled,
			projectInputOutcome(payload),
			responseError
		], {
			runId: params.runId,
			...diagnostics.errorMeta(responseError?.message, !aborted)
		});
		return {
			terminalOutcome,
			settled
		};
	});
	return (async () => {
		try {
			return await dispatchCompletion;
		} finally {
			try {
				await cleanupRunOwner();
			} finally {
				followupCompletion?.finishExecution(params.runId);
			}
		}
	})();
}
//#endregion
//#region src/gateway/agent-turn/agent-run-media.ts
/** Bind assistant media to the agent command before dispatch releases its run owner. */
function dispatchAgentRunWithMedia(dispatch, params) {
	const { ingressOpts, admittedRunEntry, abortController } = dispatch;
	const sessionKey = ingressOpts.sessionKey;
	if (!sessionKey) return dispatchAgentRunFromGateway(dispatch);
	const caller = params.client ? resolveChatSendCallerContext(params.client) : void 0;
	const runContext = ingressOpts.runContext;
	dispatch.loadMedia = async () => {
		const { createAssistantCommentaryMediaCustody } = await import("./chat-send-commentary-media-Douf58g4.mjs");
		const { createOutboundPayloadPlan } = await import("./payloads-8gN16gK6.mjs");
		const cfg = dispatch.commandRuntimeContext?.config ?? params.cfg;
		const mediaParams = {
			options: ingressOpts,
			incognito: dispatch.isIncognito === true,
			session: {
				agentId: params.activeSessionAgentId,
				cfg,
				storePath: params.prepared.lifecycleStorePath,
				sessionKey,
				sessionLoadOptions: { agentId: params.activeSessionAgentId }
			},
			requesterContext: {
				...caller,
				SenderId: runContext?.senderId ?? caller?.SenderId,
				GroupChannel: runContext?.groupChannel ?? ingressOpts.groupChannel ?? caller?.GroupChannel,
				GroupSpace: runContext?.groupSpace ?? ingressOpts.groupSpace ?? caller?.GroupSpace,
				Provider: runContext?.messageChannel ?? ingressOpts.messageChannel ?? caller?.Provider,
				Surface: runContext?.messageChannel ?? ingressOpts.messageChannel ?? caller?.Surface
			},
			accountId: ingressOpts.accountId,
			getRunId: () => dispatch.runId,
			isCurrent: () => {
				try {
					dispatch.assertCurrent?.();
					return Boolean(admittedRunEntry) && dispatch.context.chatAbortControllers.get(dispatch.runId) === admittedRunEntry && admittedRunEntry?.controller === abortController && !admittedRunEntry.registrationCleanupRequested && !abortController.signal.aborted;
				} catch {
					return false;
				}
			},
			abortSignal: abortController.signal,
			logGateway: dispatch.context.logGateway,
			prepareAssistantTranscriptMessage: ingressOpts.prepareAssistantTranscriptMessage
		};
		const commentary = createAssistantCommentaryMediaCustody(mediaParams);
		return {
			run: commentary.run,
			prepareAssistantTranscriptMessage: commentary.prepareAssistantTranscriptMessage,
			finalize: async (reply) => {
				if (!reply || mediaParams.incognito || ingressOpts.privateCompletion || ingressOpts.sessionEffects === "internal" || ingressOpts.deliver === true || ingressOpts.internalDeliveryMediaUrls !== void 0 || !isInternalMessageChannel(ingressOpts.channel ?? ingressOpts.messageChannel)) return;
				const plan = createOutboundPayloadPlan(reply.payloads).filter(({ payload }) => payload.sensitiveMedia !== true);
				if (!plan.some(({ parts }) => parts.mediaUrls.length > 0)) return;
				const { finalizeAgentRunMedia } = await import("./agent-run-final-media-DP8qOd1_.mjs");
				await finalizeAgentRunMedia(mediaParams, reply, plan);
			}
		};
	};
	return dispatchAgentRunFromGateway(dispatch);
}
//#endregion
//#region src/gateway/agent-turn/agent-run-execution-phase.ts
async function startAgentRunExecution(params) {
	return await runWithChatAbortExecution(params.prepared.activeRunAbort.entry, () => runWithAgentWorkspaceReadiness(void 0, () => executeAgentRun(params)), params.prepared.activeRunAbort.cleanup);
}
async function executeAgentRun(params) {
	const { prepared } = params;
	const diagnostics = createAgentRunDiagnostics(params.resolvedSessionKey, params.sessionEntry?.incognito, params.context.logGateway);
	const jobSessionBinding = prepared.activeRunAbort.entry ?? {
		sessionKey: params.resolvedSessionKey,
		sessionId: params.resolvedSessionId,
		agentId: params.activeSessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration
	};
	let unpersistedOffloadedRefs = prepared.unpersistedOffloadedRefs;
	const releaseGatewayRootContinuation = retainGatewayRootWorkAdmissionContinuation() ?? void 0;
	let finishUndispatchedFollowup = false;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const runtimeResources = _usingCtx$1.a(new AsyncDisposableStack());
			let preparedModelRuntimeLease = runtimeResources.use(prepared.preparedModelRuntimeLease);
			let replyDispatchRuntime = prepared.replyDispatchRuntime;
			let workspaceOverride = prepared.workspaceOverride;
			let leaseActive = true;
			const abortRegistration = prepared.activeRunAbort;
			const { entry: abortEntry, controller: abortController } = abortRegistration;
			const operationalRunInstance = prepared.operationalRunInstance;
			const sessionKey = abortEntry?.sessionKey;
			const admittedRunIdentity = abortEntry ? {
				controller: abortController,
				operationalRunInstance,
				lifecycleGeneration: params.lifecycleGeneration,
				sessionKey: abortEntry.sessionKey
			} : void 0;
			const assertSettlementCurrent = () => {
				params.assertContextCurrent?.();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				if (!leaseActive || abortRegistration.registered && !prepared.activeGatewayWorkAdmission.isActive()) throw new Error("Agent settlement no longer owns this Gateway run");
			};
			const assertDispatchCurrent = () => {
				params.assertContextCurrent?.();
				prepared.operatorAuthority?.assertCurrent();
				abortController.signal.throwIfAborted();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				if (!leaseActive || abortRegistration.registered && (!prepared.activeGatewayWorkAdmission.isActive() || !abortEntry || params.context.chatAbortControllers.get(params.runId) !== abortEntry || abortEntry.controller !== abortController || abortEntry.operationalRunInstance !== operationalRunInstance || abortEntry.lifecycleGeneration !== params.lifecycleGeneration || abortEntry.sessionKey !== sessionKey || abortEntry.registrationCleanupRequested)) throw new Error("agent dispatch no longer owns this Gateway run");
			};
			let mediaCleanup;
			const cleanupAdmittedRun = async () => {
				const refsToDiscard = unpersistedOffloadedRefs;
				unpersistedOffloadedRefs = [];
				try {
					await releaseStoppedAgentRunUserTurn(prepared.userTurn, prepared.activeRunAbort);
				} catch (error) {
					diagnostics.warning("failed to settle pending agent input")(error);
				}
				prepared.activeRunAbort.cleanup();
				prepared.activeGatewayWorkAdmission.release();
				leaseActive = false;
				mediaCleanup ??= discardPreparedInboundMedia(refsToDiscard, params.context.logGateway);
				if (prepared.userTurn.recorder && params.resolvedSessionKey) emitSessionsChanged(params.context, {
					sessionKey: params.resolvedSessionKey,
					agentId: params.activeSessionAgentId,
					reason: "agent.input.settled"
				}, {
					accessChanged: false,
					rowScope: "runtime"
				});
			};
			let dispatched = false;
			const dispatchAdmittedAgentRun = (dispatch) => {
				const run = () => {
					const execution = withPreparedModelRuntimePluginGenerationScope(replyDispatchRuntime.pluginGeneration, () => dispatchAgentRunWithMedia(dispatch, params), () => leaseActive ? preparedModelRuntimeLease.snapshot : void 0);
					dispatched = true;
					return execution;
				};
				return withCurrentUserTurnInput(prepared.userTurn.recorder, run);
			};
			return await prepared.activeGatewayWorkAdmission.run(async () => {
				await yieldAfterAgentAcceptedAck();
				let publishFinalAfterCleanup;
				let pendingRecovery;
				const settleUnstartedFollowup = (outcome) => !dispatched ? settleUnstartedGatewayFollowup({
					completion: prepared.followupCompletion,
					runId: params.runId,
					admittedRunEntry: abortEntry,
					admittedRunIdentity,
					context: params.context,
					isIncognito: diagnostics.incognito,
					outcome
				}) : void 0;
				const finishFailure = async (err, recordCompletion = true) => {
					const error = errorShapeFromError(ErrorCodes.UNAVAILABLE, err);
					const renderedErr = error.message;
					const outcome = buildAgentRunTerminalOutcome({
						status: "error",
						error: renderedErr
					});
					if (recordCompletion) try {
						await completeUserTurnProcessing(prepared.userTurn.recorder, outcome);
					} catch (completionError) {
						diagnostics.warning("input completion persistence failed")(completionError);
					}
					await settleUnstartedFollowup(outcome);
					const payload = {
						runId: params.runId,
						status: "error",
						summary: renderedErr
					};
					publishFinalAfterCleanup = () => {
						setGatewayDedupeEntries({
							dedupe: params.context.dedupe,
							keys: params.agentDedupeKeys,
							session: captureAgentJobSession(jobSessionBinding),
							entry: diagnostics.forReplay({
								ts: Date.now(),
								ok: false,
								payload,
								error
							})
						});
						params.io.emitFinal([
							false,
							payload,
							error
						], {
							runId: params.runId,
							...diagnostics.errorMeta(renderedErr)
						});
					};
				};
				const finishUndispatchedAbort = async () => {
					const stopReason = prepared.activeRunAbort.entry?.abortStopReason?.trim() || "rpc";
					const outcome = buildAgentRunTerminalOutcome({
						status: "timeout",
						stopReason,
						timeoutPhase: "queue",
						providerStarted: false
					});
					try {
						pendingRecovery = await prepared.restoreAdmittedRestartRecoveryInterrupted?.();
						await completeUserTurnProcessing(prepared.userTurn.recorder, outcome);
					} catch (error) {
						await finishFailure(error, false);
						return;
					}
					await settleUnstartedFollowup(outcome);
					publishFinalAfterCleanup = () => {
						const payload = projectWithdrawnAgentInput(buildAbortedAgentPayload(params.runId, stopReason, { agentId: params.activeSessionAgentId }), readWithdrawnUserTurnInputId(prepared.userTurn.recorder));
						setGatewayDedupeEntries({
							dedupe: params.context.dedupe,
							keys: params.agentDedupeKeys,
							session: captureAgentJobSession(jobSessionBinding),
							entry: diagnostics.forReplay({
								ts: Date.now(),
								ok: true,
								payload
							})
						});
						params.io.emitFinal([
							true,
							payload,
							void 0
						], { runId: params.runId });
					};
				};
				try {
					if (prepared.activeRunAbort.controller.signal.aborted) {
						await finishUndispatchedAbort();
						return;
					}
					if (prepared.acquireWorkspaceModelRuntime) {
						const entry = params.sessionEntry;
						if (!entry || !params.resolvedSessionKey || entry.sessionId !== abortEntry?.sessionId) throw new Error("Session changed before preparing its worktree.");
						await prepareSessionWorkspaceForRun({
							entry,
							cfg: params.cfgForAgent ?? params.cfg,
							agentId: params.activeSessionAgentId,
							runId: params.runId,
							sessionKey: params.resolvedSessionKey,
							storePath: prepared.lifecycleStorePath,
							context: params.context,
							signal: abortController.signal,
							assertCurrent: assertDispatchCurrent,
							runSetupScript: params.client?.connect.scopes?.includes(ADMIN_SCOPE) === true
						});
						assertDispatchCurrent();
						workspaceOverride = resolveIngressWorkspaceOverrideForSessionRun({
							spawnedBy: entry.spawnedBy,
							workspaceDir: entry.spawnedWorkspaceDir,
							cwd: entry.spawnedCwd
						});
						preparedModelRuntimeLease = runtimeResources.use(await prepared.acquireWorkspaceModelRuntime(workspaceOverride));
						assertDispatchCurrent();
						replyDispatchRuntime = Object.freeze({
							...replyDispatchRuntime,
							pluginGeneration: preparedModelRuntimeLease.pluginGeneration
						});
					}
					let message = prepared.userTurn.message;
					let execApprovalContinuationPromptRange = prepared.userTurn.execApprovalContinuationPromptRange;
					const execApprovalContinuationTranscriptPromptRange = execApprovalContinuationPromptRange;
					if (prepared.reactivateSubagent && params.resolvedSessionKey) await reactivateCompletedSubagentSession({
						sessionKey: params.resolvedSessionKey,
						runId: params.runId,
						task: message,
						gatewayContextResolver: params.context.resolveGatewayContext,
						assertCurrent: assertDispatchCurrent,
						acpSession: params
					});
					if (!params.suppressVisibleSessionEffects && params.requestedSessionKey && params.resolvedSessionKey && params.isNewSession) emitSessionsChanged(params.context, {
						sessionKey: params.resolvedSessionKey,
						agentId: params.activeSessionAgentId,
						reason: "create"
					});
					if (!params.suppressVisibleSessionEffects && params.resolvedSessionKey) emitSessionsChanged(params.context, {
						sessionKey: params.resolvedSessionKey,
						agentId: params.activeSessionAgentId,
						reason: "send"
					}, { accessChanged: false });
					if (!params.isRawModelRun) ({message, execApprovalContinuationPromptRange} = annotateAgentRunUserTurnPrompt({
						message,
						inputProvenance: params.inputProvenance,
						execApprovalContinuationPromptRange
					}));
					const ingressAgentId = params.resolvedSessionKey ? params.activeSessionAgentId : params.agentId;
					const runtimePluginToolGrant = params.client?.internal?.agentRunTracking === "plugin_subagent" && params.client.internal.pluginRuntimeOwnerId === params.client.internal.runtimePluginToolGrant?.pluginId ? params.client.internal.runtimePluginToolGrant : void 0;
					const pluginSubagentToolsAllow = params.client?.internal?.agentRunTracking === "plugin_subagent" && Array.isArray(params.client.internal.pluginSubagentToolsAllow) ? [...params.client.internal.pluginSubagentToolsAllow] : void 0;
					const executionIdentityAdmission = resolveAgentRestartRecoveryExecutionIdentityAdmission({
						collectionEnabled: isExecutionIdentityCollectionEnabled(params.cfg),
						isRestartRecoveryResumeRun: params.isRestartRecoveryResumeRun,
						retryOnly: params.request.internalExecutionIdentityRetry,
						runId: params.runId,
						sessionEntry: params.sessionEntry
					});
					const agentRuntimeIdentity = params.client?.internal?.agentRuntimeIdentity;
					const executionIdentitySpawnFacts = agentRuntimeIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(agentRuntimeIdentity) === true ? resolveExecutionIdentitySpawnFacts(agentRuntimeIdentity) : void 0;
					const restartRecoveryContext = resolveAgentRestartRecoveryContext({
						isRestartRecoveryResumeRun: params.isRestartRecoveryResumeRun,
						canUseInternalRuntimeHandoff: params.canUseInternalRuntimeHandoff,
						expectedExistingSessionId: params.request.expectedExistingSessionId,
						resolvedSessionId: params.resolvedSessionId,
						runId: params.runId,
						sessionEntry: params.sessionEntry
					});
					const restartRecoveryChannelContext = restartRecoveryContext?.channel;
					const runContext = {
						messageChannel: restartRecoveryContext?.messageChannel ?? params.delivery.originMessageChannel,
						accountId: restartRecoveryChannelContext?.requesterAccountId ?? params.delivery.resolvedAccountId,
						senderId: restartRecoveryChannelContext?.requesterSenderId,
						groupId: params.groupId,
						groupChannel: params.groupChannel,
						groupSpace: params.groupSpace,
						currentChannelId: restartRecoveryChannelContext?.currentChannelId,
						currentThreadTs: restartRecoveryChannelContext?.currentThreadTs ?? (prepared.resolvedThreadId != null ? String(prepared.resolvedThreadId) : void 0)
					};
					setChannelSourceTurnId(runContext, resolveReplySourceTurnId({
						sourceTurnId: restartRecoveryChannelContext?.sourceTurnId,
						admissionRunId: params.runId,
						ingressProvider: runContext.messageChannel,
						entry: params.sessionEntry
					}));
					setChannelSourceTurnSameThreadRequired(runContext, restartRecoveryChannelContext?.sameChannelThreadRequired);
					const localUserIngress = getGatewayLocalUserIngress(params.client);
					if (params.isRestartRecoveryResumeRun) attachAgentCommandRecoveryAdmissionFacts(runContext);
					else if (localUserIngress) attachAgentCommandAdmissionFacts(runContext, localUserIngress.facts);
					params.assertContextCurrent?.();
					const callerContext = resolveChatSendCallerContext(params.client);
					const clientCaps = [...callerContext.GatewayClientCaps];
					const gatewayUiCommandTarget = captureGatewayUiCommandTarget(params.client);
					const supportsTaskSuggestions = isOperatorUiClient(params.client?.connect.client) && params.client?.connect.scopes?.includes("operator.admin") === true && hasGatewayClientCap(clientCaps, GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS);
					const gatewayContext = params.context.resolveGatewayContext?.();
					const skillLibraryAuthoring = gatewayContext && params.resolvedSessionKey ? await prepareGatewaySkillAuthoring({
						client: params.client,
						context: gatewayContext,
						sessionMutationCommitGuard: params.assertContextCurrent
					}, params.resolvedSessionKey, !params.inputProvenance && !params.restoredCronContinuation && !params.isOneShotModelRun && !params.isRestartRecoveryResumeRun && !params.request.internalEvents && !params.request.internalRuntimeHandoffId && !params.request.internalExecutionIdentityRetry && !params.request.execApprovalFollowupExpectedSessionId && params.sessionEffects !== "internal" && !params.request.suppressPromptPersistence && !params.request.swarmCollector && params.request.lane !== "subagent") : void 0;
					finalizePreparedAgentRunUserTurn(prepared.userTurn);
					await dispatchAdmittedAgentRun(withAgentRunDispatchExecutionIdentity({
						assertCurrent: assertDispatchCurrent,
						assertSettlementCurrent,
						admittedRunEntry: abortEntry,
						commandRuntimeContext: {
							config: replyDispatchRuntime.config,
							pluginGeneration: replyDispatchRuntime.pluginGeneration
						},
						cronCreatorAuthority: prepared.cronCreatorAuthority,
						ingressOpts: {
							skillLibraryAuthoring,
							message,
							images: params.images,
							imageOrder: params.imageOrder,
							media: params.media,
							agentId: ingressAgentId,
							provider: prepared.effectiveProviderOverride,
							model: prepared.effectiveModelOverride,
							to: params.delivery.resolvedTo,
							sessionId: params.resolvedSessionId,
							sessionKey: params.resolvedSessionKey,
							thinking: prepared.effectiveThinking,
							deliver: params.delivery.deliver,
							deliveryTargetMode: params.delivery.deliveryTargetMode,
							channel: params.delivery.originMessageChannel ? params.delivery.resolvedChannel : void 0,
							accountId: params.delivery.resolvedAccountId,
							threadId: prepared.resolvedThreadId,
							runContext,
							clientCaps,
							gatewayUiCommandTarget,
							approvalReviewerDeviceId: callerContext.ApprovalReviewerDeviceId,
							taskSuggestionDeliveryMode: supportsTaskSuggestions ? "gateway" : void 0,
							...prepared.userTurn.bashElevated ? { bashElevated: prepared.userTurn.bashElevated } : {},
							...execApprovalContinuationPromptRange ? { execApprovalContinuationPromptRange } : {},
							...execApprovalContinuationTranscriptPromptRange ? { execApprovalContinuationTranscriptPromptRange } : {},
							groupId: params.groupId,
							groupChannel: params.groupChannel,
							groupSpace: params.groupSpace,
							spawnedBy: params.spawnedBy,
							timeout: prepared.timeoutSeconds?.toString(),
							bestEffortDeliver: params.bestEffortDeliver,
							messageChannel: params.delivery.originMessageChannel,
							runId: params.runId,
							lane: params.request.lane,
							swarmExecutionLane: params.swarmExecutionLane,
							modelRun: params.request.modelRun === true,
							promptMode: params.request.promptMode,
							extraSystemPrompt: params.request.extraSystemPrompt,
							bootstrapContextMode: params.request.bootstrapContextMode,
							bootstrapContextRunKind: params.effectiveBootstrapContextRunKind,
							toolsAllow: pluginSubagentToolsAllow ?? params.restoredCronContinuation?.toolsAllow,
							runtimePluginToolGrant,
							trustedInternalHandoff: prepared.trustedInternalHandoff,
							pinnedWidgetAuthoring: restartRecoveryContext?.pinnedWidgetAuthoring,
							toolsAllowIsDefault: params.restoredCronContinuation?.toolsAllowIsDefault,
							scheduledToolPolicy: params.restoredCronContinuation ? resolveScheduledToolPolicyContext({
								toolsAllow: params.restoredCronContinuation.toolsAllow,
								scheduledToolPolicy: params.restoredCronContinuation.scheduledToolPolicy,
								callerOrigin: params.restoredCronContinuation.scheduledToolCallerOrigin,
								execTarget: params.restoredCronContinuation.toolsAllowExecTarget
							}) : void 0,
							requireExplicitMessageTarget: params.restoredCronContinuation?.cliSessionBindingFacts?.requireExplicitMessageTarget,
							cliSessionBindingFacts: params.restoredCronContinuation?.cliSessionBindingFacts,
							acpTurnSource: params.request.acpTurnSource,
							internalEvents: params.request.internalEvents,
							runtimeContextFragments: params.client?.internal?.runtimeContextFragments,
							inputProvenance: params.inputProvenance,
							privateCompletion: prepared.userTurn.privateCompletion,
							replyExpectation: prepared.userTurn.replyExpectation,
							senderIsOwner: prepared.userTurn.senderIsOwner,
							sessionEffects: params.sessionEffects,
							skipInitialSessionTouch: params.skipAgentInitialSessionTouch,
							preserveUserFacingSessionModelState: params.preserveUserFacingSessionModelState && !params.restoredCronContinuation,
							sourceReplyDeliveryMode: params.restoredCronContinuation ? params.restoredCronContinuation.cliSessionBindingFacts?.sourceReplyDeliveryMode : params.request.sourceReplyDeliveryMode,
							disableMessageTool: params.request.disableMessageTool,
							swarmCollector: params.request.swarmCollector,
							swarmOutputSchema: params.request.swarmOutputSchema,
							forceRestartSafeTools: params.request.forceRestartSafeTools,
							forceCodeModeTools: params.request.forceCodeModeTools,
							...executionIdentityAdmission ? { executionIdentityAdmission } : {},
							operationalRunInstance: prepared.operationalRunInstance,
							operatorAuthority: prepared.operatorAuthority,
							onAdmittedRunContext: (admittedRunContext) => {
								skillLibraryAuthoring?.bind(admittedRunContext);
								bindGatewayContextResolver(admittedRunContext, params.context.resolveGatewayContext);
								const authority = getAdmittedRunDelegatedAuthority(admittedRunContext);
								if (!authority) throw new Error("agent run delegated authority was not admitted");
								if (prepared.activeRunAbort.registered) prepared.activeRunAbort.bindAgentRunDelegatedAuthority(authority);
							},
							internalDeliveryMediaUrls: params.client?.internal?.internalDeliveryMediaUrls,
							internalDeliverySuppressText: params.client?.internal?.internalDeliverySuppressText,
							internalDeliverySuppressErrors: params.client?.internal?.internalDeliverySuppressErrors,
							suppressPromptPersistence: prepared.userTurn.suppressPromptPersistence,
							userTurnTranscriptRecorder: prepared.userTurn.recorder,
							cleanupBundleMcpOnRunEnd: params.request.cleanupBundleMcpOnRunEnd,
							abortSignal: prepared.activeRunAbort.controller.signal,
							lifecycleGeneration: params.lifecycleGeneration,
							onExecutionStarted: () => {
								if (!prepared.activeRunAbort.markExecutionStarted()) return;
								params.io.emitExecutionStarted?.();
								if (params.resolvedSessionKey) emitSessionsChanged(params.context, {
									sessionKey: params.resolvedSessionKey,
									agentId: params.agentId,
									reason: "agent.run.started"
								}, { accessChanged: false });
							},
							onActiveModelSelected: createAgentRunModelSelectionHandler({
								context: params.context,
								runId: params.runId,
								cfg: params.cfg,
								cfgForAgent: params.cfgForAgent,
								restoredCronContinuationLifecycleRevision: prepared.restoredCronContinuationLifecycleRevision,
								resolvedSessionKey: params.resolvedSessionKey,
								lifecycleStorePath: prepared.lifecycleStorePath,
								activeSessionAgentId: params.activeSessionAgentId,
								trustedInternalHandoff: prepared.trustedInternalHandoff
							}),
							onSessionIdChanged: (sessionId) => {
								if (prepared.activeRunAbort.entry) {
									adoptExecRequestSession({
										runId: params.runId,
										previousSessionId: prepared.activeRunAbort.entry.sessionId,
										sessionId
									});
									prepared.activeRunAbort.entry.sessionId = sessionId;
								}
							},
							workspaceDir: workspaceOverride ?? replyDispatchRuntime.workspaceDir,
							cwd: resolveSessionRuntimeCwd({
								requestedCwd: params.request.cwd,
								sessionEntry: params.sessionEntry
							}),
							allowGatewaySubagentBinding: true,
							...params.mainRestartRecoveryOwnerLease ? { mainRestartRecoveryOwnerLease: params.mainRestartRecoveryOwnerLease } : {},
							...params.isRestartRecoveryResumeRun ? { mainRestartRecoveryAdmitted: true } : {},
							...params.request.internalExecutionIdentityRecoveryAttempt !== void 0 ? { mainRestartRecoveryAttempt: params.request.internalExecutionIdentityRecoveryAttempt } : {},
							allowModelOverride: prepared.effectiveAllowModelOverride
						},
						runId: params.runId,
						dedupeKeys: params.agentDedupeKeys,
						abortController: prepared.activeRunAbort.controller,
						cleanupAbortController: cleanupAdmittedRun,
						onSettled: params.restoredCronContinuation ? async ({ terminalOutcome, onRecovered }) => await params.releaseCronContinuationClaimWithRecovery({ terminalOutcome }, onRecovered) : void 0,
						io: params.io,
						context: params.context,
						isIncognito: diagnostics.incognito,
						followupCompletion: prepared.followupCompletion,
						restoreAdmittedRecovery: prepared.restoreAdmittedRestartRecoveryInterrupted,
						canonicalSkillWorkspaceDir: params.sessionEntry?.worktree?.canonicalWorkspaceDir
					}, executionIdentitySpawnFacts));
				} catch (err) {
					if (prepared.activeRunAbort.controller.signal.aborted && isAbortError(err)) {
						await finishUndispatchedAbort();
						return;
					}
					await finishFailure(err);
				} finally {
					try {
						if (!dispatched) try {
							const restoreAdmittedRecovery = prepared.restoreAdmittedRestartRecoveryInterrupted;
							if (restoreAdmittedRecovery) pendingRecovery ??= await repairMainSessionRecoveryMutation({
								mutation: restoreAdmittedRecovery,
								onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
								onError: diagnostics.warning("failed to restore undispatched restart recovery")
							});
						} finally {
							try {
								await params.releaseCronContinuationClaimWithRecovery();
							} finally {
								try {
									pendingRecovery ??= await releaseMainSessionRecoveryOwner(params.mainRestartRecoveryOwnerLease);
								} catch (err) {
									diagnostics.warning("failed to release undispatched main restart recovery owner")(err);
								} finally {
									try {
										await cleanupAdmittedRun();
									} finally {
										scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
									}
								}
							}
						}
					} finally {
						try {
							await mediaCleanup;
						} finally {
							finishUndispatchedFollowup = !dispatched;
							publishFinalAfterCleanup?.();
						}
					}
				}
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} finally {
		try {
			prepared.releaseCallerAuthority?.();
			releaseGatewayRootContinuation?.();
		} finally {
			if (finishUndispatchedFollowup) prepared.followupCompletion?.finishExecution(params.runId);
		}
	}
}
//#endregion
//#region src/gateway/agent-turn/agent-session-persist.ts
async function persistAgentSessionPhase(params) {
	let patchBuild = params.initialPatchBuild;
	const resetReason = patchBuild.automaticResetReason;
	const resetBoundaryId = resetReason ? createSessionResetBoundaryId() : void 0;
	let { sessionEntry, resolvedSessionId, sessionPersistedBeforeGatewayAdmission, supersededSessionId } = params.state;
	let restoredCronContinuation;
	let mainRestartRecoveryOwnerLease;
	let skipAgentInitialSessionTouch = false;
	let createdNewEntry = false;
	const abortForLifecycleRotation = () => params.abortForLifecycleRotation({
		sessionKey: params.canonicalSessionKey,
		agentId: params.agentId
	});
	const isDeliveryDenied = (entry) => params.request.deliver === true && resolveSendPolicy({
		cfg: params.cfg,
		entry,
		sessionKey: params.canonicalSessionKey,
		channel: sessionDeliveryChannel(entry),
		chatType: entry?.chatType
	}) === "deny";
	const rejectDelivery = () => {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
	};
	if (params.freshChild) {
		params.assertGatewayWorkAdmissionAllowed();
		if (params.respondToGatewayAdmissionOutcome() || abortForLifecycleRotation()) return;
		if (sessionEntry) params.onSessionCommitted?.(sessionEntry);
		skipAgentInitialSessionTouch = true;
	} else if (params.storePath && !params.suppressVisibleSessionEffects) {
		if (abortForLifecycleRotation()) return;
		let deniedSessionEntry;
		let persisted;
		let mutationError;
		let creationAuthorizationError;
		function rejectMutation(code, message) {
			mutationError = errorShape(code, message);
			throw new Error(message);
		}
		const buildEntry = async (freshEntry) => {
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			assertExpectedExistingSession({
				constraint: params.expectedSession,
				entry: freshEntry,
				message: `Session "${params.canonicalSessionKey}" changed before expected work could start.`
			});
			if (params.entry && !freshEntry) rejectMutation(ErrorCodes.INVALID_REQUEST, `Session "${params.canonicalSessionKey}" was deleted while starting work. Retry.`);
			const archivedError = resolveAgentSessionWorkStartError(params.canonicalSessionKey, freshEntry);
			if (archivedError) rejectMutation(ErrorCodes.INVALID_REQUEST, archivedError);
			const internalFreshEntry = freshEntry;
			if (!params.isRestartRecoveryResumeRun && internalFreshEntry && (internalFreshEntry.mainRestartRecovery?.tombstone || internalFreshEntry.abortedLastRun === true && getMainSessionRecoveryRetryCount(internalFreshEntry.mainRestartRecovery) >= 3)) rejectMutation(ErrorCodes.UNAVAILABLE, `Session "${params.canonicalSessionKey}" is quarantined after restart recovery exhaustion; use /new or /reset before starting new work.`);
			let entryForPatch = freshEntry;
			if (params.restoredCronContinuationIdentity) {
				const marker = freshEntry?.cronRunContinuation;
				const provider = normalizeOptionalString(freshEntry?.modelProvider);
				const model = normalizeOptionalString(freshEntry?.model);
				if (!(marker?.phase === "ready" && marker.basePersisted === true && marker.lifecycleRevision === params.restoredCronContinuationIdentity.lifecycleRevision && freshEntry?.sessionId === params.restoredCronContinuationIdentity.sessionId) || !freshEntry || !provider || !model) rejectMutation(ErrorCodes.UNAVAILABLE, "cron run continuation changed before admission");
				if (!cronContinuationHasReusableRuntime({
					cfg: params.cfg,
					entry: freshEntry,
					agentId: params.sessionAgentId,
					provider,
					model
				})) rejectMutation(ErrorCodes.UNAVAILABLE, "cron run continuation has no reusable native CLI session");
				const restoredCronContinuationError = resolveCronToolsAllowExecTargetRecoveryError({
					requirement: marker.toolsAllowExecTargetRequirement,
					execTarget: marker.toolsAllowExecTarget
				});
				if (restoredCronContinuationError) rejectMutation(ErrorCodes.UNAVAILABLE, restoredCronContinuationError);
				const restoredToolsAllow = restoreCronPinnedExecGrant({
					toolsAllow: marker.toolsAllow,
					requirement: marker.toolsAllowExecTargetRequirement,
					execTarget: marker.toolsAllowExecTarget
				});
				const scheduledToolPolicy = normalizeCronScheduledToolPolicy(marker.scheduledToolPolicy);
				const toolsAllowExecTarget = normalizeCronToolsAllowExecTarget(marker.toolsAllowExecTarget);
				restoredCronContinuation = {
					...params.restoredCronContinuationIdentity,
					provider,
					model,
					...freshEntry.thinkingLevel ? { thinking: freshEntry.thinkingLevel } : {},
					...restoredToolsAllow !== void 0 ? { toolsAllow: restoredToolsAllow } : {},
					...marker.toolsAllowIsDefault === true ? { toolsAllowIsDefault: true } : {},
					...scheduledToolPolicy ? { scheduledToolPolicy } : {},
					...scheduledToolPolicy?.mode === "account" ? { scheduledToolCallerOrigin: normalizeCronScheduledToolCallerOrigin(marker.scheduledToolCallerOrigin) } : {},
					...toolsAllowExecTarget ? { toolsAllowExecTarget } : {},
					...marker.cliSessionBindingFacts ? { cliSessionBindingFacts: { ...marker.cliSessionBindingFacts } } : {}
				};
				entryForPatch = {
					...freshEntry,
					cronRunContinuation: {
						...marker,
						phase: "continuing",
						ownerRunId: params.runId,
						ownerLifecycleGeneration: params.lifecycleGeneration
					}
				};
				params.setCronContinuationClaim({
					storePath: params.storePath,
					sessionKey: params.canonicalSessionKey,
					sessionAgentId: params.sessionAgentId,
					lifecycleRevision: marker.lifecycleRevision,
					initialEntry: structuredClone(entryForPatch),
					mediaTaskIdsBefore: getGeneratedMediaTaskIdsForSessionKey(params.canonicalSessionKey, params.sessionAgentId)
				});
			}
			patchBuild = await params.buildSessionPatch(entryForPatch);
			if (resetReason && (patchBuild.automaticResetReason !== resetReason || freshEntry?.sessionId !== params.entry?.sessionId || freshEntry?.lifecycleRevision !== params.entry?.lifecycleRevision)) rejectMutation(ErrorCodes.UNAVAILABLE, "Session changed before automatic reset. Retry.");
			params.assertAdmissionCurrent?.();
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			if (!freshEntry) {
				creationAuthorizationError = authorizeGatewaySessionCreation({
					cfg: params.cfg,
					agentId: params.sessionAgentId,
					...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
				});
				if (creationAuthorizationError) throw new Error(creationAuthorizationError.message);
			}
			const lifecyclePatch = patchBuild.patch;
			const previousSessionId = normalizeOptionalString(freshEntry?.sessionId);
			const nextSessionId = normalizeOptionalString(lifecyclePatch.sessionId);
			const rotationLineage = previousSessionId && nextSessionId && previousSessionId !== nextSessionId ? { previousSessionId } : {};
			const operatorRoleActor = params.operatorRoleActor;
			const delegatedCreation = !freshEntry && !params.creation.actor && params.cfg.gateway?.roles && operatorRoleActor?.kind === "operator" ? {
				...params.creation,
				actor: {
					type: "human",
					source: "profile",
					id: operatorRoleActor.profileId
				}
			} : params.creation;
			const sandbox = freshEntry ? void 0 : resolveCreatorSandbox(params.cfg, delegatedCreation);
			const effectivePatch = freshEntry ? {
				...lifecyclePatch,
				...rotationLineage
			} : {
				...lifecyclePatch,
				...buildSessionCreationStamp(sandbox ? {
					...delegatedCreation,
					sandbox
				} : params.creation)
			};
			createdNewEntry = freshEntry === void 0;
			const merged = mergeSessionEntry(entryForPatch, effectivePatch);
			const recoveryTransition = params.isRestartRecoveryResumeRun ? transitionMainSessionRecovery(merged, {
				kind: "validate_recovery",
				lifecycleGeneration: params.lifecycleGeneration,
				runId: params.runId,
				sessionId: params.request.expectedExistingSessionId ?? merged.sessionId
			}) : transitionMainSessionRecovery(merged, {
				kind: "claim_foreground",
				cycleId: randomUUID(),
				lifecycleGeneration: params.lifecycleGeneration,
				sessionId: merged.sessionId,
				sessionKey: params.canonicalSessionKey,
				claimId: mainRestartRecoveryOwnerLease?.claimId ?? randomUUID(),
				runId: params.runId
			});
			if (params.isRestartRecoveryResumeRun && recoveryTransition.kind !== "recovery_validated") rejectMutation(ErrorCodes.UNAVAILABLE, `Session "${params.canonicalSessionKey}" restart recovery reservation is stale; recovery was skipped.`);
			if (recoveryTransition.kind === "foreground_claimed") {
				mainRestartRecoveryOwnerLease = {
					...recoveryTransition.claim,
					storePath: params.storePath
				};
				params.setMainRestartRecoveryOwnerLease(mainRestartRecoveryOwnerLease);
			}
			if (isDeliveryDenied(merged)) {
				deniedSessionEntry = merged;
				return null;
			}
			return merged;
		};
		const commitGuard = composeSessionSourceAssertion([params.assertAdmissionCurrent], (assertSource) => {
			assertSource();
			if (createdNewEntry) assertPreparedSkillLibrarySelection(params.creation.skillLibrarySelections);
		});
		const target = {
			canonicalKey: params.canonicalSessionKey,
			storeKeys: params.storeKeys ?? [params.canonicalSessionKey]
		};
		try {
			if (resetReason) {
				const reset = await resetSessionEntryLifecycle({
					agentId: params.sessionAgentId,
					storePath: params.storePath,
					target,
					commitGuard,
					resetBoundary: {
						boundaryId: resetBoundaryId,
						context: "preserve-tail",
						reason: resetReason,
						cwd: params.entry?.spawnedCwd ?? resolveAgentWorkspaceDir(params.cfg, params.sessionAgentId)
					},
					buildNextEntry: async ({ currentEntry }) => {
						const next = await buildEntry(currentEntry);
						if (!next) rejectMutation(ErrorCodes.INVALID_REQUEST, "send blocked by session policy");
						return next;
					},
					afterEntryMutation: ({ nextEntry }) => params.onSessionCommitted?.(nextEntry)
				});
				persisted = reset.nextEntry;
				clearCommittedSessionResetRuntimeState({
					previousSessionEntry: reset.previousEntry,
					agentId: params.sessionAgentId,
					sessionKey: params.canonicalSessionKey,
					onError: (error) => createSubsystemLogger("gateway").warn(String(error))
				});
			} else persisted = await patchSessionEntryTarget({
				agentId: params.sessionAgentId,
				storePath: params.storePath,
				target
			}, (_currentEntry, patchContext) => buildEntry(patchContext.existingEntry), {
				fallbackEntry: params.entry ?? mergeSessionEntry(void 0, patchBuild.patch),
				onCommitted: params.onSessionCommitted,
				replaceEntry: true,
				takeCacheOwnership: true,
				maintenanceConfig: params.maintenanceConfig,
				workerGuard: { source: commitGuard }
			}) ?? void 0;
		} catch (err) {
			if (creationAuthorizationError) {
				params.respond(false, void 0, creationAuthorizationError);
				return;
			}
			if (abortForLifecycleRotation()) return;
			if (err instanceof ExpectedExistingSessionChangedError) mutationError = errorShape(ErrorCodes.UNAVAILABLE, err.message);
			if (mutationError) {
				params.respond(false, void 0, mutationError);
				return;
			}
			throw err;
		}
		if (abortForLifecycleRotation()) return;
		if (deniedSessionEntry) {
			sessionEntry = deniedSessionEntry;
			resolvedSessionId = sessionEntry.sessionId;
		} else if (persisted) {
			sessionEntry = persisted;
			resolvedSessionId = sessionEntry.sessionId;
			sessionPersistedBeforeGatewayAdmission = true;
		}
		if (patchBuild.isNewSession && params.entry?.sessionId && resolvedSessionId !== params.entry.sessionId) supersededSessionId = params.entry.sessionId;
		const admittedSessionId = resolvedSessionId ?? params.runId;
		Object.assign(params.state, {
			resolvedSessionId,
			admittedSessionId,
			supersededSessionId,
			sessionPersistedBeforeGatewayAdmission
		});
		try {
			params.assertGatewayWorkAdmissionAllowed();
		} catch (err) {
			params.respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, err));
			return;
		}
		if (params.respondToGatewayAdmissionOutcome() || abortForLifecycleRotation()) return;
		skipAgentInitialSessionTouch = params.touchInteraction;
		if (deniedSessionEntry) return rejectDelivery();
	}
	const { isNewSession, rotatedSessionId, usableRequestedSessionId, freshness } = patchBuild;
	if (createdNewEntry && sessionEntry) await recordSessionCreated(params.cfg, {
		sessionKey: params.canonicalSessionKey,
		agentId: params.sessionAgentId,
		entry: sessionEntry
	});
	if (isNewSession && params.entry?.sessionId && resolvedSessionId !== params.entry.sessionId) supersededSessionId = params.entry.sessionId;
	if (!params.suppressVisibleSessionEffects && isNewSession && resolvedSessionId && params.storePath && !patchBuild.freshSessionRotatedSinceLoad) {
		const previousSessionId = rotatedSessionId || resetReason ? params.entry?.sessionId : void 0;
		if (previousSessionId) emitGatewaySessionEndPluginHook({
			cfg: params.cfg,
			sessionKey: params.canonicalSessionKey,
			sessionId: previousSessionId,
			storePath: params.storePath,
			sessionFile: void 0,
			agentId: params.sessionAgentId,
			workspaceDir: params.entry?.spawnedWorkspaceDir,
			reason: freshness?.staleReason ?? (usableRequestedSessionId && params.entry?.sessionId !== usableRequestedSessionId ? "new" : "unknown"),
			nextSessionId: resolvedSessionId,
			nextSessionKey: params.canonicalSessionKey,
			endedTranscript: resetBoundaryId ? createResetBoundaryTranscriptSource({
				agentId: params.sessionAgentId,
				sessionId: previousSessionId,
				sessionKey: params.canonicalSessionKey,
				storePath: params.storePath
			}, resetBoundaryId) : createClosedSessionTranscriptSource({
				agentId: params.sessionAgentId,
				sessionId: previousSessionId,
				sessionKey: params.canonicalSessionKey,
				storePath: params.storePath
			})
		});
		emitGatewaySessionStartPluginHook({
			cfg: params.cfg,
			sessionKey: params.canonicalSessionKey,
			sessionId: resolvedSessionId,
			resumedFrom: previousSessionId,
			storePath: params.storePath,
			sessionFile: void 0,
			agentId: params.sessionAgentId
		});
	}
	if (isDeliveryDenied(sessionEntry)) return rejectDelivery();
	const isMainSession = !params.suppressVisibleSessionEffects && (params.canonicalSessionKey === params.mainSessionKey || params.canonicalSessionKey === "global");
	return {
		sessionEntry,
		resolvedSessionId,
		sessionPersistedBeforeGatewayAdmission,
		supersededSessionId,
		admittedSessionId: params.state.admittedSessionId,
		skipAgentInitialSessionTouch,
		isNewSession,
		spawnedBy: params.freshChild ? sessionEntry?.spawnedBy : patchBuild.spawnedBy,
		groupId: params.freshChild ? sessionEntry?.groupId : patchBuild.groupId,
		groupChannel: params.freshChild ? sessionEntry?.groupChannel : patchBuild.groupChannel,
		groupSpace: params.freshChild ? sessionEntry?.space : patchBuild.groupSpace,
		pendingChatRun: isMainSession ? {
			sessionKey: params.canonicalSessionKey,
			agentId: params.sessionAgentId
		} : void 0,
		bestEffortDeliver: isMainSession && params.requestedBestEffortDeliver === void 0 ? true : params.state.bestEffortDeliver,
		restoredCronContinuation
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-turn-service.ts
function createAgentTurnService({ context, isWebchatConnect }, assertContextCurrent) {
	const startTurn = async ({ privateCompletion, replyExpectation, settleWakeReplay, assertAdmissionCurrent, assertInputCommitAllowed, hasCurrentClientAuthority, preflight, principal, io, onRunObserved }) => {
		const promptedAt = Date.now();
		assertAdmissionCurrent?.();
		if (replayAgentTurnIfCached({
			preflight,
			context,
			io,
			acceptedOnly: privateCompletion
		})) return;
		assertInputCommitAllowed?.();
		const respond = (ok, payload, error, meta) => io.emitAcceptance([
			ok,
			payload,
			error
		], meta);
		const runFacts = { ...preflight };
		const { request, cfg, runId, canUseCronRunContinuation, expectedSession, expectedExistingSessionId, normalizedSpawned, isRestartRecoveryResumeRun, suppressVisibleSessionEffects, agentDedupeKeys } = runFacts;
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const initialSessionGroups = {
			groupId: normalizedSpawned.groupId,
			groupChannel: normalizedSpawned.groupChannel,
			groupSpace: normalizedSpawned.groupSpace
		};
		const ownerConnId = typeof principal?.connId === "string" ? principal.connId : void 0;
		const ownerDeviceId = typeof principal?.connect?.device?.id === "string" ? principal.connect.device.id : void 0;
		const dedupeLifecycle = createAgentDedupeLifecycle({
			...preflight,
			privateCompletion,
			lifecycleGeneration,
			ownerConnId,
			ownerDeviceId,
			context,
			io
		});
		const routing = await prepareAgentRequestRouting({
			...preflight,
			context,
			respond,
			reserveDedupe: dedupeLifecycle.reserve,
			bindDedupeSessionTarget: dedupeLifecycle.bindSessionTarget,
			clearDedupe: dedupeLifecycle.clearUnaccepted,
			assertCurrent: composeSessionSourceAssertion([
				assertContextCurrent,
				assertAdmissionCurrent,
				assertInputCommitAllowed
			])
		});
		if (!routing) return;
		let storageActive = true;
		let gatewayAdmissionTransferred = false;
		const assertStorageCurrent = () => {
			if (!storageActive) throw new Error("Agent session storage admission ended");
			assertContextCurrent?.();
		};
		const sessionStorage = await acquireSessionActorStorage({
			sessionKey: routing.requestedSessionKey,
			agentId: routing.agentId
		}, {
			lifetime: {
				assertCurrent: assertStorageCurrent,
				assertReadable: assertStorageCurrent
			},
			authority: {
				assertCurrent: assertStorageCurrent,
				authorize: assertStorageCurrent
			}
		}).catch((error) => {
			dedupeLifecycle.clearUnaccepted();
			throw error;
		});
		const releaseSessionStorage = async () => {
			if (!storageActive) return;
			storageActive = false;
			await sessionStorage?.actor.release();
		};
		const execute = async () => {
			const { requestedBestEffortDeliver, requestedSessionId, sessionKeyFromTo, requestedSessionKeyRaw, preAcceptedReservedSessionKey, preAttachmentSession } = routing;
			const assertRequestCurrent = composeSessionSourceAssertion([
				assertAdmissionCurrent,
				() => dedupeLifecycle.assertReservationCurrent(),
				assertInputCommitAllowed
			]);
			let agentId = routing.agentId;
			let requestedSessionKey = routing.requestedSessionKey;
			let preparedOffloadedRefs = [];
			let mainRestartRecoveryOwnerLease;
			let releaseGatewayAdmission = () => {};
			let respondToAdmissionOutcome = () => false;
			const cronContinuation = createCronContinuationController({
				runId,
				lifecycleGeneration,
				context
			});
			try {
				assertAdmissionCurrent?.();
				const content = await prepareAgentContentPhase({
					...preflight,
					...routing,
					assertAdmissionCurrent: assertRequestCurrent,
					context,
					respond,
					requestedSessionKey,
					agentId
				}).catch(dedupeLifecycle.handlePreparationFailure(assertAdmissionCurrent));
				if (!content) return;
				preparedOffloadedRefs = content.offloadedRefs;
				assertAdmissionCurrent?.();
				agentId = content.agentId;
				requestedSessionKey = content.requestedSessionKey;
				let effectiveTranscriptInputText = content.effectiveTranscriptInputText;
				let message = content.message;
				const { images, imageOrder, media, offloadedRefs, recipientChannel, recipientAccountId, recipientThreadId, to } = content;
				const session = {
					resolvedSessionId: requestedSessionId,
					sessionPersistedBeforeGatewayAdmission: false,
					bestEffortDeliver: requestedBestEffortDeliver ?? false,
					isNewSession: false,
					skipAgentInitialSessionTouch: false,
					admittedSessionId: requestedSessionId ?? runId,
					...initialSessionGroups
				};
				let effectiveBootstrapContextRunKind = request.bootstrapContextRunKind;
				let restoredCronContinuationIdentity;
				let cfgForAgent;
				let sessionStorePath;
				let resolvedSessionKey = requestedSessionKey;
				let resolvedSessionAgentId;
				const admissionController = createAgentAdmissionController({
					assertAdmissionCurrent,
					runId,
					lifecycleGeneration,
					agentDedupeKeys,
					preAcceptedReservedSessionKey,
					expectedSession,
					...isRestartRecoveryResumeRun ? { admissionOwner: MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER } : {},
					context,
					io,
					dedupeLifecycle,
					getRequestedSessionKey: () => requestedSessionKey,
					getResolvedSessionKey: () => resolvedSessionKey,
					getResolvedSessionId: () => session.resolvedSessionId,
					getSessionEntry: () => session.sessionEntry,
					setSessionEntry: (entry) => {
						session.sessionEntry = entry;
					},
					getResolvedSessionAgentId: () => resolvedSessionAgentId,
					getAgentId: () => agentId,
					getSessionPersisted: () => session.sessionPersistedBeforeGatewayAdmission,
					getSupersededSessionId: () => session.supersededSessionId,
					setAdmittedSessionId: (sessionId) => {
						session.admittedSessionId = sessionId;
					}
				});
				releaseGatewayAdmission = admissionController.release;
				respondToAdmissionOutcome = () => {
					admissionController.assertAllowed();
					return admissionController.respondToOutcome();
				};
				const resetPhase = await runAgentResetPhase({
					assertAdmissionCurrent: assertRequestCurrent,
					request,
					cfg,
					requestedSessionKey,
					resolvedSessionId: session.resolvedSessionId,
					effectiveTranscriptInputText,
					message,
					agentId,
					sessionKeyFromTo,
					lifecycleGeneration,
					runId,
					agentDedupeKeys,
					client: principal,
					context,
					respond,
					abortForLifecycleRotation: dedupeLifecycle.abortForLifecycleRotation,
					setCommittedResetCompletion: dedupeLifecycle.setCommittedResetCompletion
				});
				requestedSessionKey = resetPhase.requestedSessionKey;
				session.resolvedSessionId = resetPhase.resolvedSessionId;
				effectiveTranscriptInputText = resetPhase.effectiveTranscriptInputText;
				message = resetPhase.message;
				if (resetPhase.accepted) dedupeLifecycle.markAccepted(true);
				if (resetPhase.stop) return;
				if (requestedSessionKey) {
					const preparedSession = await prepareAgentSession({
						cfg,
						requestedSessionKey,
						requestedSessionId,
						expectedExistingSessionId,
						agentId,
						recipientChannel,
						request,
						canUseCronRunContinuation,
						lifecycleGeneration,
						effectiveBootstrapContextRunKind,
						preAttachmentSession,
						respond,
						assertCurrent: assertRequestCurrent
					});
					assertRequestCurrent();
					if (!preparedSession) return;
					const { cfg: cfgLocal, storePath, entry, canonicalKey: canonicalSessionKey, storeKeys, maintenanceConfig: sessionMaintenanceConfig, canonicalSessionAgentId: sessionAgentId, mainSessionKey, sessionId, touchInteraction } = preparedSession;
					cfgForAgent = cfgLocal;
					sessionStorePath = storePath;
					const sessionAuthorizationError = authorizeGatewaySessionCreation({
						cfg: cfgLocal,
						client: principal,
						agentId: sessionAgentId
					}) ?? await authorizeResolvedSessionMutationAsync({
						cfg: cfgLocal,
						client: principal,
						sessionKey: canonicalSessionKey,
						agentId: sessionAgentId
					});
					if (sessionAuthorizationError) {
						io.emitAcceptance([
							false,
							void 0,
							sessionAuthorizationError
						]);
						return;
					}
					effectiveBootstrapContextRunKind = preparedSession.effectiveBootstrapContextRunKind;
					restoredCronContinuationIdentity = preparedSession.restoredCronContinuationIdentity;
					session.sessionPersistedBeforeGatewayAdmission = preparedSession.sessionPersistedBeforeGatewayAdmission;
					const requestDeliveryHint = normalizeDeliveryContext({
						channel: recipientChannel?.trim(),
						to,
						accountId: recipientAccountId?.trim(),
						threadId: recipientThreadId
					});
					const explicitSessionKey = normalizeOptionalString(request.sessionKey);
					const buildSessionPatch = (freshEntry) => buildAgentSessionPatch({
						...preparedSession,
						freshEntry,
						initialEntry: entry,
						sessionAgentId,
						canonicalSessionKey,
						normalizedSpawned,
						requestDeliveryHint,
						requestLabel: request.label,
						...explicitSessionKey ? { explicitSessionKey } : {},
						pluginOwnerId: freshEntry === void 0 ? normalizeOptionalString(principal?.internal?.pluginRuntimeOwnerId) : void 0,
						expectedExistingSessionId,
						hasRestoredCronContinuation: restoredCronContinuationIdentity !== void 0,
						requestedSessionId,
						fallbackSessionId: sessionId
					});
					const patchBuild = preparedSession.freshChild ? {
						patch: {},
						spawnedBy: entry?.spawnedBy,
						groupId: entry?.groupId,
						groupChannel: entry?.groupChannel,
						groupSpace: entry?.space,
						freshSessionRotatedSinceLoad: false,
						isNewSession: false,
						rotatedSessionId: false,
						usableRequestedSessionId: void 0,
						freshness: { fresh: true }
					} : await buildSessionPatch(entry);
					assertRequestCurrent();
					session.sessionEntry = entry;
					session.resolvedSessionId = mergeSessionEntry(entry, patchBuild.patch)?.sessionId ?? sessionId;
					session.admittedSessionId = session.resolvedSessionId ?? runId;
					resolvedSessionKey = canonicalSessionKey;
					resolvedSessionAgentId = sessionAgentId;
					try {
						await admissionController.acquire(storePath ?? `agent:${sessionAgentId}`);
					} catch (err) {
						io.emitAcceptance([
							false,
							void 0,
							errorShapeFromError(ErrorCodes.INVALID_REQUEST, err)
						]);
						return;
					}
					if (admissionController.respondToOutcome()) return;
					const persistedSession = await persistAgentSessionPhase({
						freshChild: preparedSession.freshChild,
						onSessionCommitted: (committedEntry) => {
							session.sessionEntry = committedEntry;
							dedupeLifecycle.bindSessionTarget({
								sessionKey: canonicalSessionKey,
								agentId: sessionAgentId,
								sessionId: committedEntry.sessionId
							});
						},
						assertAdmissionCurrent: assertRequestCurrent,
						request,
						cfg: cfgLocal,
						storePath,
						storeKeys,
						entry,
						canonicalSessionKey,
						sessionAgentId,
						mainSessionKey,
						creation: await prepareSkillLibrarySessionCreation(principal, () => context.getRuntimeConfig(), resolveAgentRunSessionCreation(principal)),
						...principal?.authenticatedUserProfile ? { requestingOperatorProfileId: principal.authenticatedUserProfile.profileId } : {},
						...principal?.internal?.operatorRoleActor ? { operatorRoleActor: principal.internal.operatorRoleActor } : {},
						lifecycleGeneration,
						isRestartRecoveryResumeRun,
						runId,
						agentId,
						suppressVisibleSessionEffects,
						restoredCronContinuationIdentity,
						initialPatchBuild: patchBuild,
						buildSessionPatch,
						state: session,
						touchInteraction,
						requestedBestEffortDeliver,
						expectedSession,
						maintenanceConfig: sessionMaintenanceConfig,
						abortForLifecycleRotation: dedupeLifecycle.abortForLifecycleRotation,
						assertGatewayWorkAdmissionAllowed: admissionController.assertAllowed,
						respondToGatewayAdmissionOutcome: admissionController.respondToOutcome,
						setCronContinuationClaim: cronContinuation.setClaim,
						setMainRestartRecoveryOwnerLease: (lease) => {
							mainRestartRecoveryOwnerLease = lease;
						},
						respond
					});
					if (!persistedSession) return;
					Object.assign(session, persistedSession);
				}
				const delivery = await resolveAgentDeliveryPhase({
					...content,
					...session,
					request,
					cfg,
					cfgForAgent,
					resolvedSessionKey,
					resolvedSessionAgentId,
					agentId,
					runId,
					client: principal,
					context,
					respond,
					isWebchatConnect,
					onRunObserved
				});
				if (!delivery) return;
				const { activeSessionAgentId } = delivery;
				const runParams = {
					...runFacts,
					...session,
					cfgForAgent,
					resolvedSessionKey,
					requestedSessionKey,
					activeSessionAgentId,
					delivery,
					lifecycleGeneration,
					images,
					context,
					io,
					client: principal
				};
				const preparedDispatch = await prepareAgentRunDispatch({
					...runParams,
					lifecycleStorePath: sessionStorePath ?? `agent:${activeSessionAgentId}`,
					assertAdmissionCurrent: assertRequestCurrent,
					hasCurrentClientAuthority,
					promptedAt,
					requestedSessionKeyRaw,
					preAcceptedReservedSessionKey,
					restoredCronContinuationIdentity,
					getAdmittedSessionId: () => session.admittedSessionId,
					ownerConnId,
					ownerDeviceId,
					message,
					effectiveTranscriptInputText,
					offloadedRefs,
					onUserTurnMediaPersisted: () => {
						preparedOffloadedRefs = [];
					},
					privateCompletion,
					replyExpectation,
					settleWakeReplay,
					abortForLifecycleRotation: dedupeLifecycle.abortForLifecycleRotation,
					acquireGatewayWorkAdmission: admissionController.acquire,
					assertGatewayWorkAdmissionAllowed: admissionController.assertAllowed,
					hasGatewayAdmissionOutcome: admissionController.hasOutcome,
					respondToGatewayAdmissionOutcome: admissionController.respondToOutcome,
					admissionAgentId: admissionController.admissionAgentId,
					getGatewayWorkAdmission: admissionController.getAdmission,
					setAdmittedRunAbort: admissionController.setAdmittedRunAbort,
					getAdmittedRunAbort: admissionController.getAdmittedRunAbort,
					markAgentRunAccepted: dedupeLifecycle.markAccepted,
					getOwnedAgentDedupeKeys: dedupeLifecycle.ownedReservationKeys
				});
				if (!preparedDispatch) return;
				session.resolvedSessionId = session.admittedSessionId;
				preparedOffloadedRefs = [];
				gatewayAdmissionTransferred = true;
				(async () => {
					try {
						await context.trackExecution(() => startAgentRunExecution({
							...runParams,
							...session,
							assertContextCurrent,
							prepared: preparedDispatch,
							mainRestartRecoveryOwnerLease,
							agentId,
							imageOrder,
							media,
							inputProvenance: preparedDispatch.userTurn.inputProvenance,
							effectiveBootstrapContextRunKind,
							releaseCronContinuationClaimWithRecovery: cronContinuation.releaseWithRecovery
						}));
					} finally {
						await releaseSessionStorage();
					}
				})().catch((error) => {
					preparedDispatch.releaseCallerAuthority?.();
					context.logGateway.warn(`agent execution cleanup failed: ${String(error)}`);
				});
				mainRestartRecoveryOwnerLease = void 0;
			} catch (error) {
				if (!(error instanceof AgentRequestReservationEndedError)) throw error;
				if (!respondToAdmissionOutcome()) dedupeLifecycle.handlePreparationFailure(assertAdmissionCurrent)(error);
			} finally {
				try {
					if (!gatewayAdmissionTransferred) {
						let pendingRecovery = void 0;
						try {
							pendingRecovery = await releaseMainSessionRecoveryOwner(mainRestartRecoveryOwnerLease);
						} finally {
							try {
								releaseGatewayAdmission();
							} finally {
								try {
									await cronContinuation.releaseWithRecovery();
								} finally {
									scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
								}
							}
						}
					}
				} finally {
					await discardPreparedInboundMedia(preparedOffloadedRefs);
					dedupeLifecycle.clearUnaccepted();
				}
			}
		};
		try {
			await (sessionStorage ? runWithSessionActorStorage(sessionStorage, execute) : execute());
		} finally {
			if (!gatewayAdmissionTransferred) await releaseSessionStorage();
		}
	};
	const prepareWaitForTurn = (params) => prepareAgentWaitForTurn(context, params);
	const waitForTurn = async (params) => await prepareWaitForTurn(params).wait();
	return {
		startTurn,
		prepareWaitForTurn,
		waitForTurn
	};
}
//#endregion
export { createAgentTurnService as t };

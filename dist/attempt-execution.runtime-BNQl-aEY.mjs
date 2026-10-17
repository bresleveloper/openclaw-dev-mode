import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-92B-lj2w.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { a as resolveAuthProfileOrder } from "./order-B7W96aON.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-DXC5lyRk.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-B-fhY8wF.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-D1LHo5Qj.mjs";
import { a as readSessionEntryInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { o as getGeneratedMediaTaskIdsForSessionKey, s as hasNewGeneratedMediaTaskForSessionKey } from "./media-generation-activity-JkwDNUkC.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { s as resolveCliSessionClearReason, u as shouldClearFailedCliSessionBinding } from "./cli-session-BGS0cWwl.mjs";
import { a as setChannelSourceTurnId, n as readChannelSourceTurnId, o as setChannelSourceTurnSameThreadRequired, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-7n3UiKJD.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-BP0sUc83.mjs";
import { a as isTrustedSubagentCompletionHandoffForRun, i as isSubagentAnnounceCompletionHandoff, t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-DIo-5B5v.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-l7Gq7Nji.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { i as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-PqUansOZ.mjs";
import { o as resolveDelegationCapability } from "./agent-tools-CkKxECNx.mjs";
import { t as buildAgentInternalEventContext } from "./internal-events-BZWbNO1Z.mjs";
import { U as injectTimestamp, W as timestampOptsFromConfig } from "./builtin-openclaw-DPSlekTi.mjs";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-D83uJB7U.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import { n as resolveWebchatPromptCacheKey } from "./session-boundary-prompt-cache-key-Qws1--Tf.mjs";
import "./selection-CiYACV8E.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-CI14IRBZ.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-Bp4DeIrb.mjs";
import { o as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-IG1WWW6z.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-BLOPu2y0.mjs";
import { n as emitAgentAttemptRuntimeStart } from "./attempt-callbacks-n8R-aP3x.mjs";
import { s as hasCliLiveSession } from "./cli-live-session-registry-Ci6tcreu.mjs";
import { _ as resolveCommandReplyExpectation, b as sessionTranscriptHasContent, d as buildClaudeCliFallbackContextPrelude, f as claudeCliSessionTranscriptHasContent, g as rebaseExecApprovalContinuationPromptRange, h as isClaudeCliProvider, m as createAcpVisibleTextAccumulator, v as resolveCompletionToolPolicy, y as resolveFallbackRetryPrompt } from "./session-history-B7_oaIp0.mjs";
import { t as buildCliMcpDelegationCapabilityBinding } from "./mcp-grant-context-B1goWGKl.mjs";
import { n as runCliAgent } from "./cli-runner-gPc9CHyU.mjs";
import { a as emitAcpLifecycleError, c as emitAcpRuntimeEvent, i as emitAcpLifecycleEnd, l as resolveAcpLifecycleEndFields, n as createAcpToolLifecycleTracker, o as emitAcpLifecycleStart, r as emitAcpAssistantDelta, s as emitAcpPromptSubmitted, t as buildAcpResult } from "./acp-lifecycle-Du84YF-Q.mjs";
import { i as restoreCliSessionForkInStore, n as clearCliSessionInStore, t as buildCliSessionForkRunParams } from "./cli-session-store-CDlpTLDs.mjs";
import { n as withAdmittedCliCandidate, t as resolveRunEntryCliRuntime } from "./run-entry-runtime-Bno8KYb2.mjs";
import { n as persistCliTurnTranscript, r as resolveCliTranscriptReplyText, t as persistAcpTurnTranscript } from "./transcript-persistence-C-yFGU0j.mjs";
//#region src/agents/command/attempt-auth-selection.ts
function resolveHarnessAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
	if (sessionAuthProfileId) {
		const credential = ensureAuthProfileStore(params.agentDir, {
			allowKeychainPrompt: false,
			externalCliProfileIds: [sessionAuthProfileId]
		}).profiles[sessionAuthProfileId];
		return {
			authProfileId: sessionAuthProfileId,
			authProfileIdSource: params.sessionAuthProfileSource,
			authProfileProvider: credential?.provider ?? params.authProfileProvider,
			authProfileMode: credential?.type
		};
	}
	if (!params.allowHarnessAuthProfileForwarding) return { authProfileProvider: params.authProfileProvider };
	const harnessAuthProvider = buildAgentRuntimeAuthPlan({
		provider: params.provider,
		authProfileProvider: params.authProfileProvider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.providerAuthAliasesEnabled,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding
	}).harnessAuthProvider;
	if (!harnessAuthProvider) return { authProfileProvider: params.authProfileProvider };
	const store = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: [harnessAuthProvider]
	});
	const authProfileId = resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider: harnessAuthProvider
	})[0];
	return authProfileId ? {
		authProfileId,
		authProfileIdSource: "auto",
		authProfileProvider: harnessAuthProvider
	} : { authProfileProvider: params.authProfileProvider };
}
//#endregion
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
function runAgentAttempt(params) {
	const sessionAuthProfileId = params.sessionEntry?.authProfileOverride?.trim();
	const sessionAuthProfileSource = resolveCollapsedSessionAuthPinSource(params.sessionEntry);
	const selectedAuthProfile = sessionAuthProfileId && sessionAuthProfileSource !== "auto" ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : params.configuredAuthProfileId?.trim() ? {
		id: params.configuredAuthProfileId.trim(),
		source: "user"
	} : sessionAuthProfileId ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : void 0;
	const isRawModelRun = params.opts.modelRun === true || params.opts.promptMode === "none";
	const isSubagentAnnounceHandoff = isSubagentAnnounceCompletionHandoff({
		inputProvenance: params.opts.inputProvenance,
		internalEvents: params.opts.internalEvents
	});
	const trustedSubagentCompletionHandoff = isTrustedSubagentCompletionHandoffForRun({
		handoff: params.opts.trustedInternalHandoff,
		inputProvenance: params.opts.inputProvenance,
		internalEvents: params.opts.internalEvents,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		provider: params.providerOverride,
		model: params.modelOverride
	}) && hasVerifiedRequesterCompletionHandoff({
		config: params.cfg,
		sessionKey: params.sessionKey,
		inputProvenance: params.opts.inputProvenance,
		trustedInternalHandoff: params.opts.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.providerOverride,
		modelId: params.modelOverride
	});
	const trustedSubagentAnnounceHandoff = isSubagentAnnounceHandoff && trustedSubagentCompletionHandoff;
	const completionRequestsMessageDelivery = trustedSubagentAnnounceHandoff && !isRawModelRun && params.opts.disableMessageTool !== true && messageToolOwnsVisibleReply(params.opts);
	const completionSandboxStatus = completionRequestsMessageDelivery ? resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	}) : void 0;
	const completionCapabilityProfile = completionRequestsMessageDelivery ? resolveConversationCapabilityProfile({
		config: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sessionAgentId,
		senderId: params.runContext.senderId,
		modelProvider: params.providerOverride,
		modelId: params.modelOverride,
		sandboxToolPolicy: completionSandboxStatus?.sandboxed ? completionSandboxStatus.toolPolicy : void 0,
		inputProvenance: params.opts.inputProvenance,
		trustedInternalHandoff: params.opts.trustedInternalHandoff
	}) : void 0;
	const completionToolPolicies = completionCapabilityProfile ? resolveConversationToolPolicies({
		capabilityProfile: completionCapabilityProfile,
		additionalProfileAllow: ["message"],
		additionalPolicyAllow: ["message"],
		additionalInheritedAllow: ["message"]
	}) : void 0;
	const completionNeedsMessageDelivery = completionCapabilityProfile?.policy.requesterPolicySource === "completion-handoff" && completionToolPolicies !== void 0 && isToolAllowedByPolicies("message", Object.values(completionToolPolicies)) && isRuntimeToolAllowed("message", params.opts.toolsAllow);
	const claudeCliFallbackPrelude = !isRawModelRun && params.isFallbackRetry && isClaudeCliProvider(params.originalProvider) && !isClaudeCliProvider(params.providerOverride) ? buildClaudeCliFallbackContextPrelude({ cliSessionId: getCliSessionBinding(params.sessionEntry, "claude-cli")?.sessionId }) : "";
	const resolvedPrompt = resolveFallbackRetryPrompt({
		body: params.body,
		isFallbackRetry: params.isFallbackRetry,
		sessionHasHistory: params.sessionHasHistory,
		priorContextPrelude: claudeCliFallbackPrelude
	});
	const effectivePrompt = isRawModelRun ? resolvedPrompt : annotateInterSessionPromptText(resolvedPrompt, params.opts.inputProvenance);
	const embeddedExecApprovalContinuationPromptRange = rebaseExecApprovalContinuationPromptRange({
		body: params.body,
		prompt: effectivePrompt,
		range: params.opts.execApprovalContinuationPromptRange
	});
	const continuationTranscriptBody = params.opts.execApprovalContinuationPromptRange ? params.transcriptBody ?? params.body : params.transcriptBody;
	const continuationTranscriptPromptRange = params.opts.execApprovalContinuationTranscriptPromptRange ?? params.opts.execApprovalContinuationPromptRange;
	const bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.sessionEntry?.systemPromptReport);
	const requestedAgentHarnessId = isRawModelRun ? "openclaw" : void 0;
	const sessionRuntimeOverride = isRawModelRun ? void 0 : params.agentHarnessRuntimeOverride;
	const pinnedHarnessId = isRawModelRun ? void 0 : resolveSessionPinnedHarnessId(params.sessionEntry);
	const { cliExecutionProvider, useCliExecution: isCliExecutionProvider } = isRawModelRun ? {
		cliExecutionProvider: params.providerOverride,
		useCliExecution: isCliProvider(params.providerOverride, params.cfg)
	} : resolveRunEntryCliRuntime({
		config: params.cfg,
		provider: params.providerOverride,
		model: params.modelOverride,
		agentId: params.sessionAgentId,
		authProfileId: selectedAuthProfile?.id,
		sessionRuntimeOverride,
		pinnedHarnessId
	});
	const { completionRetainsRequesterTools, runtimeToolsAllow, disableTools } = resolveCompletionToolPolicy({
		run: params,
		trustedSubagentAnnounceHandoff,
		isSubagentAnnounceHandoff,
		isRawModelRun,
		isCliExecutionProvider,
		cliExecutionProvider,
		completionNeedsMessageDelivery
	});
	const cliRuntimeToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(runtimeToolsAllow, { forceToolNames: params.opts.swarmCollector && params.opts.swarmOutputSchema ? ["structured_output"] : void 0 });
	const toolContext = {
		messageChannel: params.messageChannel,
		messageProvider: params.opts.messageProvider ?? params.messageChannel,
		agentAccountId: params.runContext.accountId,
		groupId: params.runContext.groupId,
		groupChannel: params.runContext.groupChannel,
		groupSpace: params.runContext.groupSpace,
		spawnedBy: params.spawnedBy,
		currentChannelId: params.runContext.currentChannelId,
		chatId: params.runContext.chatId,
		channelContext: params.runContext.channelContext,
		currentThreadTs: params.runContext.currentThreadTs,
		currentInboundAudio: params.runContext.currentInboundAudio,
		replyToMode: params.runContext.replyToMode,
		senderId: params.runContext.senderId,
		senderIsOwner: params.opts.senderIsOwner,
		scheduledToolPolicy: params.opts.scheduledToolPolicy,
		pinnedWidgetAuthoring: params.opts.pinnedWidgetAuthoring
	};
	if (params.fallbackRuntimeState && params.fallbackRuntimeState.originRuntime === void 0) params.fallbackRuntimeState.originRuntime = !isRawModelRun && isCliExecutionProvider ? "cli" : "embedded";
	const shouldForwardImagesToEmbedded = !params.isFallbackRetry || params.fallbackRuntimeState?.originRuntime === "cli";
	const allowCliAuthProfileForwarding = isCliExecutionProvider && cliBackendAcceptsAuthProfileForwarding({
		provider: cliExecutionProvider,
		config: params.cfg,
		agentId: params.sessionAgentId
	});
	const agentHarnessPolicy = isRawModelRun ? {
		runtime: "openclaw",
		runtimeSource: "model"
	} : sessionRuntimeOverride ? {
		runtime: sessionRuntimeOverride,
		runtimeSource: "model"
	} : resolveAvailableAgentHarnessPolicy({
		provider: params.providerOverride,
		modelId: params.modelOverride,
		config: params.cfg,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey ?? params.sessionId
	});
	const harnessAuthSelection = resolveHarnessAuthProfileSelection({
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.providerOverride,
		authProfileProvider: params.authProfileProvider,
		sessionAuthProfileId: selectedAuthProfile?.id,
		sessionAuthProfileSource: selectedAuthProfile?.source,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const runtimeAuthPlan = buildAgentRuntimeAuthPlan({
		provider: params.providerOverride,
		authProfileProvider: harnessAuthSelection.authProfileProvider,
		authProfileMode: harnessAuthSelection.authProfileMode,
		sessionAuthProfileId: harnessAuthSelection.authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const cliAuthNeedsSessionBinding = allowCliAuthProfileForwarding && !isRawModelRun && (!harnessAuthSelection.authProfileId || harnessAuthSelection.authProfileIdSource === "auto");
	const authProfileId = allowCliAuthProfileForwarding && !cliAuthNeedsSessionBinding ? resolveCliExecutionAuthProfileId({
		cliExecutionProvider,
		authProfileProvider: params.authProfileProvider,
		config: params.cfg,
		agentDir: params.agentDir,
		selected: harnessAuthSelection
	}) : runtimeAuthPlan.forwardedAuthProfileId;
	const embeddedAgentProvider = resolveOpenAIRuntimeProvider({
		provider: params.providerOverride,
		harnessRuntime: agentHarnessPolicy.runtime,
		agentHarnessId: requestedAgentHarnessId,
		authProfileProvider: runtimeAuthPlan.authProfileProviderForAuth,
		authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const embeddedAgentHarnessOverride = requestedAgentHarnessId ?? sessionRuntimeOverride ?? (agentHarnessPolicy.runtime === "openclaw" && agentHarnessPolicy.runtimeSource !== "implicit" ? "openclaw" : void 0);
	const replyExpectation = resolveCommandReplyExpectation(params);
	const buildCommonRunParams = () => ({
		preparedRunAdmission: params.preparedRunAdmission,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		promptCacheKey: params.sessionEntry?.delivery?.kind === "internal" && params.sessionKey ? resolveWebchatPromptCacheKey({
			agentId: params.sessionAgentId,
			provider: params.providerOverride,
			model: params.modelOverride,
			sessionKey: params.sessionKey
		}) : void 0,
		chatType: params.sessionEntry?.chatType,
		contextWindow: params.sessionEntry?.contextWindow,
		agentId: params.sessionAgentId,
		trigger: "user",
		sessionFile: params.sessionFile,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd,
		config: params.cfg,
		modelHasVision: params.modelHasVision,
		model: params.modelOverride,
		modelRoutingProvenance: params.modelRoutingProvenance,
		thinkLevel: params.resolvedThinkLevel,
		fastMode: params.fastMode,
		fastModeStartedAtMs: params.fastModeStartedAtMs,
		fastModeAutoOnSeconds: params.fastModeAutoOnSeconds,
		timeoutMs: params.timeoutMs,
		runTimeoutOverrideMs: params.runTimeoutOverrideMs,
		runId: params.runId,
		lifecycleGeneration: params.lifecycleGeneration,
		onExecutionPhase: (info) => emitAgentAttemptRuntimeStart(info, params.onAgentEvent),
		lane: params.opts.lane,
		swarmExecutionLane: params.opts.swarmExecutionLane,
		extraSystemPrompt: params.opts.extraSystemPrompt,
		inputProvenance: params.opts.inputProvenance,
		skillLibraryAuthoring: params.opts.skillLibraryAuthoring,
		sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.opts.taskSuggestionDeliveryMode,
		clientCaps: params.opts.clientCaps,
		gatewayUiCommandTarget: params.opts.gatewayUiCommandTarget,
		media: params.opts.media,
		skillsSnapshot: params.skillsSnapshot,
		streamParams: params.opts.streamParams,
		approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
		bashElevated: params.opts.bashElevated,
		cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
		oneShotCliRun: params.opts.oneShotCliRun,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		prepareAssistantTranscriptMessage: params.opts.prepareAssistantTranscriptMessage,
		contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
		onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
		suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
		disableTools,
		terminalReplyExpectation: replyExpectation,
		silentReplyPromptMode: params.opts.silentReplyPromptMode ?? (replyExpectation === "required" ? "none" : void 0),
		bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen.at(-1)
	});
	if (!isRawModelRun && isCliExecutionProvider) {
		const expectedLifecycleRevision = params.sessionEntry?.lifecycleRevision;
		return withAdmittedCliCandidate({
			claim: {
				sessionId: params.sessionId,
				sessionKey: params.sessionKey ?? params.sessionId,
				agentId: params.sessionAgentId,
				runId: params.runId
			},
			admission: {
				preparedRunAdmission: params.preparedRunAdmission,
				lifecycleGeneration: params.lifecycleGeneration,
				isFinalFallbackAttempt: params.isFinalFallbackAttempt,
				abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal,
				trigger: "user",
				inputProvenance: params.opts.inputProvenance
			},
			provider: cliExecutionProvider,
			sessionTarget: params.sessionKey && params.storePath ? {
				agentId: params.sessionAgentId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			} : void 0,
			expectedLifecycleRevision,
			readMode: "writable",
			getSessionEntry: () => params.sessionEntry,
			classifyResult: params.classifyResult
		}, async ({ sessionEntry, cliSessionBinding, assertSettlementCurrent, settleResult }) => {
			params.sessionEntry = sessionEntry;
			const cliAuthProfileId = cliAuthNeedsSessionBinding ? resolveCliExecutionAuthProfileId({
				cliExecutionProvider,
				authProfileProvider: params.authProfileProvider,
				config: params.cfg,
				agentDir: params.agentDir,
				selected: harnessAuthSelection,
				sessionBinding: cliSessionBinding
			}) : authProfileId;
			const diagnosticOwner = params.deferredLifecycle?.handoffToCli();
			const cliProcessCwd = params.cwd ? resolveUserPath(params.cwd) : params.workspaceDir;
			const cliContinuationBody = params.opts.execApprovalContinuationPromptRange ? resizeExecApprovalContinuationPrompt({
				prompt: params.body,
				range: params.opts.execApprovalContinuationPromptRange,
				maxOutputUtf16Units: DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS
			}) : params.body;
			const cliResolvedPrompt = params.opts.execApprovalContinuationPromptRange ? resolveFallbackRetryPrompt({
				body: cliContinuationBody,
				isFallbackRetry: params.isFallbackRetry,
				sessionHasHistory: params.sessionHasHistory,
				priorContextPrelude: claudeCliFallbackPrelude
			}) : resolvedPrompt;
			const cliEffectivePrompt = params.opts.execApprovalContinuationPromptRange ? annotateInterSessionPromptText(cliResolvedPrompt, params.opts.inputProvenance) : effectivePrompt;
			const cliTranscriptPrompt = continuationTranscriptBody === void 0 || !continuationTranscriptPromptRange ? continuationTranscriptBody : resizeExecApprovalContinuationPrompt({
				prompt: continuationTranscriptBody,
				range: continuationTranscriptPromptRange,
				maxOutputUtf16Units: DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS
			});
			params.userTurnTranscriptRecorder?.replaceTextBeforePersistence?.(cliTranscriptPrompt ?? cliContinuationBody);
			const cliPrompt = params.opts.inputProvenance?.kind === "inter_session" ? cliEffectivePrompt : injectTimestamp(cliEffectivePrompt, timestampOptsFromConfig(params.cfg));
			const mutableCliSessionStore = params.sessionKey && params.sessionStore && params.storePath ? {
				agentId: params.sessionAgentId,
				sessionKey: params.sessionKey,
				sessionStore: params.sessionStore,
				storePath: params.storePath,
				expectedSessionId: params.sessionId,
				assertCommitAllowed: assertSettlementCurrent
			} : void 0;
			const prepareCliSessionBinding = async () => {
				const hasManagedClaudeLiveSession = Boolean(isClaudeCliProvider(cliExecutionProvider) && cliSessionBinding?.sessionId && hasCliLiveSession({
					backendId: cliExecutionProvider,
					agentId: params.sessionAgentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				}));
				if (!isClaudeCliProvider(cliExecutionProvider) || !cliSessionBinding?.sessionId || hasManagedClaudeLiveSession || await claudeCliSessionTranscriptHasContent({
					sessionId: cliSessionBinding.sessionId,
					workspaceDir: cliProcessCwd
				})) return;
				log.warn(`cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`);
				if (mutableCliSessionStore) params.sessionEntry = await clearCliSessionInStore({
					provider: cliExecutionProvider,
					...mutableCliSessionStore
				}) ?? params.sessionEntry;
			};
			const mediaTaskIdsBefore = getGeneratedMediaTaskIdsForSessionKey(params.sessionKey, params.sessionAgentId);
			const hasNewMediaTask = () => hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore, params.sessionAgentId);
			await prepareCliSessionBinding();
			const { internalEvents, runtimeContextFragments: supplementalContext } = params.opts;
			let result;
			try {
				const forkStoreParams = cliSessionBinding?.sessionId && mutableCliSessionStore ? {
					provider: cliExecutionProvider,
					expectedCliSessionId: cliSessionBinding.sessionId,
					...mutableCliSessionStore,
					assertCommitAllowed: () => {
						assertSettlementCurrent();
						(params.deferredLifecycle?.signal ?? params.opts.abortSignal)?.throwIfAborted();
					}
				} : void 0;
				result = await runCliAgent({
					...buildCommonRunParams(),
					diagnosticOwner,
					sessionEntry: params.sessionEntry,
					storePath: params.storePath,
					persistAssistantTranscript: params.storePath !== void 0 && params.sessionStore !== void 0,
					prompt: cliPrompt,
					runtimeContextFragments: buildAgentInternalEventContext(internalEvents, supplementalContext),
					transcriptPrompt: cliTranscriptPrompt,
					modelProvider: params.providerOverride,
					requesterModel: {
						provider: params.providerOverride,
						model: params.modelOverride
					},
					provider: cliExecutionProvider,
					trustedInternalHandoff: completionRetainsRequesterTools ? params.opts.trustedInternalHandoff : void 0,
					abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal,
					onExecutionStarted: params.opts.onExecutionStarted,
					cronCreatorCallerOrigin: params.opts.cronCreatorAuthorityCapability?.callerOrigin,
					requireExplicitMessageTarget: params.opts.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
					cliSessionBindingFacts: params.opts.cliSessionBindingFacts,
					cliSessionId: cliSessionBinding?.sessionId,
					cliSessionBinding,
					forkCliSessionOnResume: cliSessionBinding?.forkNextResume === true,
					...forkStoreParams ? buildCliSessionForkRunParams({
						...forkStoreParams,
						assertCommitAllowed: assertSettlementCurrent,
						abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal
					}, (entry) => {
						params.sessionEntry = entry;
					}) : {},
					authProfileId: cliAuthProfileId,
					imagePrompt: params.body,
					images: params.opts.images,
					imageOrder: params.opts.imageOrder,
					...toolContext,
					currentChannelId: params.runContext.currentChannelId ?? (completionNeedsMessageDelivery ? params.opts.replyTo ?? params.opts.to : void 0),
					toolsAllow: resolveCliRuntimeToolsAllow(cliRuntimeToolsAllow),
					...buildCliMcpDelegationCapabilityBinding(resolveDelegationCapability({
						fallbackActive: params.isFallbackRetry,
						inputProvenance: params.opts.inputProvenance,
						disableTools,
						toolsAllow: runtimeToolsAllow
					})),
					cleanupCliLiveSessionOnRunEnd: params.opts.cleanupCliLiveSessionOnRunEnd,
					...forkStoreParams && cliSessionBinding?.forkNextResume !== true ? { onBeforeForkedCliSessionRetry: async (retry) => {
						if (hasNewMediaTask() || retry.sessionId !== cliSessionBinding?.sessionId) return false;
						log.warn(`CLI session stalled, arming forked recovery: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${forkStoreParams.sessionKey}`);
						const armed = await restoreCliSessionForkInStore(forkStoreParams);
						params.sessionEntry = armed ?? params.sessionEntry;
						return Boolean(armed);
					} } : {},
					...mutableCliSessionStore ? { onBeforeFreshCliSessionRetry: async (retry) => {
						if (hasNewMediaTask()) return false;
						const currentEntry = await readSessionEntryInWorker({
							agentId: params.sessionAgentId,
							sessionKey: mutableCliSessionStore.sessionKey,
							storePath: mutableCliSessionStore.storePath,
							readConsistency: "latest"
						}, assertSettlementCurrent);
						assertSettlementCurrent();
						if (hasNewMediaTask() || getCliSessionBinding(currentEntry, cliExecutionProvider)?.sessionId !== retry.sessionId) return false;
						log.warn(`CLI session failed, clearing before fresh retry: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(retry.reason)}`);
						const cleared = await clearCliSessionInStore({
							provider: cliExecutionProvider,
							expectedCliSessionId: retry.sessionId,
							...mutableCliSessionStore
						});
						if (!cleared) return false;
						params.sessionEntry = cleared;
						return true;
					} } : {}
				});
			} catch (err) {
				const failedCliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
				const failedCliSessionId = failedCliSessionBinding?.sessionId;
				if (isClaudeCliProvider(cliExecutionProvider) && shouldClearFailedCliSessionBinding({
					error: err,
					binding: failedCliSessionBinding,
					bindingReplacedDuringRun: failedCliSessionId !== cliSessionBinding?.sessionId,
					hasNewGeneratedMediaTask: hasNewMediaTask()
				}) && failedCliSessionId && mutableCliSessionStore) {
					log.warn(`CLI session cleared after failed reused turn: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(resolveCliSessionClearReason(err))}`);
					params.sessionEntry = await clearCliSessionInStore({
						provider: cliExecutionProvider,
						expectedCliSessionId: failedCliSessionId,
						...mutableCliSessionStore
					}) ?? params.sessionEntry;
				}
				throw err;
			}
			return settleResult({
				result,
				expectedSession: params.sessionEntry,
				sessionStore: params.sessionStore,
				preserveBinding: params.preserveCliSessionBinding
			});
		});
	}
	const embeddedRunParams = {
		...buildCommonRunParams(),
		sandboxSessionKey: params.sessionKey,
		...toolContext,
		messageTo: params.opts.replyTo ?? params.opts.to,
		messageThreadId: params.opts.threadId,
		hasRepliedRef: params.runContext.hasRepliedRef,
		permissionMode: params.sessionEntry?.permissionMode,
		toolOverrides: params.sessionEntry?.toolOverrides,
		sessionRoot: params.sessionEntry?.sessionRoot,
		...params.pluginGeneration ? { pluginGeneration: params.pluginGeneration } : {},
		agentHarnessId: pinnedHarnessId,
		modelSelectionLocked: !isRawModelRun && params.sessionEntry?.modelSelectionLocked === true,
		agentHarnessRuntimeOverride: embeddedAgentHarnessOverride,
		agentHarnessRuntimePreparationHint: agentHarnessPolicy.runtimeSource !== "implicit" ? agentHarnessPolicy.runtime : void 0,
		prompt: effectivePrompt,
		transcriptPrompt: continuationTranscriptBody,
		images: shouldForwardImagesToEmbedded ? params.opts.images : void 0,
		imageOrder: shouldForwardImagesToEmbedded ? params.opts.imageOrder : void 0,
		clientTools: params.opts.clientTools,
		toolBindings: params.opts.toolBindings,
		provider: embeddedAgentProvider,
		requestedRouteResolution: "resolved",
		modelThinkingCapability: params.modelThinkingCapability,
		modelFallbacksOverride: params.modelFallbacksOverride,
		authProfileId,
		authProfileIdSource: authProfileId ? harnessAuthSelection.authProfileIdSource : void 0,
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		verboseLevel: params.resolvedVerboseLevel,
		execSession: params.sessionEntry,
		execApprovalContinuationPromptRange: embeddedExecApprovalContinuationPromptRange,
		execApprovalContinuationTranscriptPromptRange: continuationTranscriptPromptRange,
		suppressLiveStreamOutput: params.opts.sessionEffects === "internal" && params.opts.deliver !== true,
		abortSignal: params.opts.abortSignal,
		bootstrapContextMode: params.opts.bootstrapContextMode,
		bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
		toolsAllow: runtimeToolsAllow,
		runtimePluginToolGrant: params.opts.runtimePluginToolGrant,
		trustedInternalHandoff: trustedSubagentCompletionHandoff ? params.opts.trustedInternalHandoff : void 0,
		cronCreatorAuthorityCapability: params.opts.cronCreatorAuthorityCapability,
		internalEvents: params.opts.internalEvents,
		runtimeContextFragments: params.opts.runtimeContextFragments,
		requireExplicitMessageTarget: params.opts.requireExplicitMessageTarget,
		disableMessageTool: params.opts.disableMessageTool,
		swarmCollector: params.opts.swarmCollector,
		swarmOutputSchema: params.opts.swarmOutputSchema,
		forceRestartSafeTools: params.opts.forceRestartSafeTools,
		forceCodeModeTools: params.opts.forceCodeModeTools,
		codeModeOverride: params.opts.codeModeOverride,
		agentDir: params.agentDir,
		allowGatewaySubagentBinding: params.opts.allowGatewaySubagentBinding,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		modelRun: params.opts.modelRun,
		promptMode: params.opts.promptMode,
		onAgentEvent: params.onAgentEvent,
		deferTerminalLifecycle: params.deferTerminalLifecycle,
		onDeferredLifecycleOwner: params.deferredLifecycle?.adopt,
		onDeferredLifecycleAbort: params.deferredLifecycle?.abort,
		onRetryWait: params.deferredLifecycle?.beginRetryWait,
		assistantErrorTranscript: params.assistantErrorTranscript,
		authProfileFailurePolicy: params.authProfileFailurePolicy,
		onUserMessagePersisted: params.onUserMessagePersisted,
		onCompactionAccounting: params.onCompactionAccounting,
		onCompactionRequestBudget: params.onCompactionRequestBudget,
		onSuccessfulAuthProfile: params.onSuccessfulAuthProfile ? (successfulProfileId) => params.onSuccessfulAuthProfile?.({
			authProfileId: successfulProfileId,
			authProfileIdSource: successfulProfileId ? successfulProfileId === authProfileId ? harnessAuthSelection.authProfileIdSource : "auto" : void 0
		}) : void 0,
		onExecutionStarted: async (info) => {
			await params.opts.onExecutionStarted?.();
			if (info?.lifecycleGeneration) params.onLifecycleGenerationChanged?.(info.lifecycleGeneration);
		},
		onSessionIdChanged: params.opts.onSessionIdChanged
	};
	setChannelSourceTurnId(embeddedRunParams, readChannelSourceTurnId(params.runContext));
	setChannelSourceTurnSameThreadRequired(embeddedRunParams, readChannelSourceTurnSameThreadRequired(params.runContext));
	return runEmbeddedAgent(embeddedRunParams);
}
//#endregion
export { buildAcpResult, createAcpToolLifecycleTracker, createAcpVisibleTextAccumulator, emitAcpAssistantDelta, emitAcpLifecycleEnd, emitAcpLifecycleError, emitAcpLifecycleStart, emitAcpPromptSubmitted, emitAcpRuntimeEvent, persistAcpTurnTranscript, persistCliTurnTranscript, resolveAcpLifecycleEndFields, resolveCliTranscriptReplyText, runAgentAttempt, sessionTranscriptHasContent };

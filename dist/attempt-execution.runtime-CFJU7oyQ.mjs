import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { S as isSubagentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-BspGC-O6.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { i as emitAgentEvent, r as emitAgentAuditEvent } from "./agent-events-BOSJcayE.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { s as isCliProvider } from "./model-selection-CFnUi6iD.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-q42mVdu4.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-CNff5-1q.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DZSSnYMd.mjs";
import { t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-B-fhY8wF.mjs";
import { r as formatAcpErrorChain } from "./errors-Ks5ZnY05.mjs";
import "./errors-BeQQKpA8.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { p as resolveAgentRunAbortLifecycleFields, s as createAgentRunSupersededAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-C4tQegGN.mjs";
import { i as hasNewGeneratedMediaTaskForSessionKey, r as getGeneratedMediaTaskIdsForSessionKey } from "./task-status-access-BPrGRqBY.mjs";
import "./manager.turn-timeout-DthYDbbm.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-gZujyBo1.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { s as resolveCliSessionClearReason, u as shouldClearFailedCliSessionBinding } from "./cli-session-CeXeyPue.mjs";
import { a as setChannelSourceTurnSameThreadRequired, i as setChannelSourceTurnId, n as readChannelSourceTurnId, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-BZGK3amb.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-CIAKr89h.mjs";
import { a as isTrustedSubagentCompletionHandoffForRun, i as isSubagentAnnounceCompletionHandoff, t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-DsXmfT22.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { X as timestampOptsFromConfig, Y as injectTimestamp } from "./builtin-openclaw-BPzZzoTo.mjs";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DZWwd3xP.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-XpBChpaV.mjs";
import { i as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-lj6t0cRI.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { a as resolveDelegationCapability } from "./agent-tools-Dp5LthCP.mjs";
import "./selection-D7izV5RM.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-DlyvKtv9.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-mYH3aiyf.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-B3nZbUgX.mjs";
import { o as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-ClVy1_Um.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-DC6xVJm0.mjs";
import "./run-context-WTsljCjA.mjs";
import { s as hasCliLiveSession } from "./cli-live-session-registry-CVRY7R5X.mjs";
import { f as createAcpVisibleTextAccumulator, h as sessionTranscriptHasContent, l as buildClaudeCliFallbackContextPrelude, m as resolveFallbackRetryPrompt, p as rebaseExecApprovalContinuationPromptRange, u as claudeCliSessionTranscriptHasContent } from "./session-history-Dlx6QSWT.mjs";
import { t as buildCliMcpDelegationCapabilityBinding } from "./mcp-grant-context-BmbT_OKN.mjs";
import { n as runCliAgent } from "./cli-runner-Dca2A2Z4.mjs";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-B16MNIm3.mjs";
import { n as persistCliSessionBindingResult, t as clearCliSessionInStore } from "./cli-session-store-CDncnw5v.mjs";
import { a as restoreCliSessionForkInStore, r as persistCliSessionForkSuccessorInStore, t as consumeCliSessionForkInStore } from "./session-store-BkIwTWiX.mjs";
import { n as persistCliTurnTranscript, r as resolveCliTranscriptReplyText, t as persistAcpTurnTranscript } from "./transcript-persistence-DI6VDJYm.mjs";
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
function shouldSuppressEmbeddedLiveStreamOutput(params) {
	return params.opts.sessionEffects === "internal" && params.opts.deliver !== true;
}
function resolveProfileAuthFromStore(params) {
	const profileId = params.profileId?.trim();
	if (!profileId) return {};
	const credential = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProfileIds: [profileId]
	}).profiles[profileId];
	return {
		provider: credential?.provider,
		mode: credential?.type
	};
}
function resolveHarnessAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
	if (sessionAuthProfileId) {
		const profileAuth = resolveProfileAuthFromStore({
			agentDir: params.agentDir,
			profileId: sessionAuthProfileId
		});
		return {
			authProfileId: sessionAuthProfileId,
			authProfileIdSource: params.sessionAuthProfileSource,
			authProfileProvider: profileAuth.provider ?? params.authProfileProvider,
			authProfileMode: profileAuth.mode
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
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
function runAgentAttempt(params) {
	const onRuntimeActivity = (info) => {
		if (info.phase === "assistant_output_started" || info.phase === "tool_execution_started") params.onAgentEvent({
			stream: "lifecycle",
			data: { phase: "start" }
		});
	};
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
	const isSubagentLane = params.opts.lane === AGENT_LANE_SUBAGENT;
	const isSubagentAnnounceHandoff = isSubagentAnnounceCompletionHandoff({
		inputProvenance: params.opts.inputProvenance,
		internalEvents: params.opts.internalEvents
	});
	const trustedSubagentAnnounceHandoff = isSubagentAnnounceHandoff && isTrustedSubagentCompletionHandoffForRun({
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
	const bootstrapPromptWarningSignature = bootstrapPromptWarningSignaturesSeen.at(-1);
	const requestedAgentHarnessId = isRawModelRun ? "openclaw" : void 0;
	const sessionRuntimeOverride = isRawModelRun ? void 0 : params.agentHarnessRuntimeOverride;
	const pinnedHarnessId = isRawModelRun ? void 0 : resolveSessionPinnedHarnessId(params.sessionEntry);
	const sessionCliRuntime = sessionRuntimeOverride && !(pinnedHarnessId !== void 0 && sessionRuntimeOverride === pinnedHarnessId) && isCliProvider(sessionRuntimeOverride, params.cfg) ? sessionRuntimeOverride : void 0;
	const configuredCliRuntime = !isRawModelRun && !sessionRuntimeOverride ? resolveCliRuntimeExecutionProvider({
		provider: params.providerOverride,
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		modelId: params.modelOverride,
		authProfileId: selectedAuthProfile?.id
	}) : void 0;
	const cliExecutionProvider = isRawModelRun ? params.providerOverride : sessionCliRuntime ?? configuredCliRuntime ?? params.providerOverride;
	const isCliExecutionProvider = sessionRuntimeOverride ? sessionCliRuntime !== void 0 : isCliProvider(cliExecutionProvider, params.cfg);
	const completionRetainsRequesterTools = trustedSubagentAnnounceHandoff && !isRawModelRun && !isCliExecutionProvider && (!messageToolOwnsVisibleReply(params.opts) || completionNeedsMessageDelivery);
	const runtimeToolsAllow = isSubagentAnnounceHandoff ? completionRetainsRequesterTools ? params.opts.toolsAllow : completionNeedsMessageDelivery ? ["message"] : void 0 : params.opts.toolsAllow;
	const cliRuntimeToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(runtimeToolsAllow, { forceToolNames: params.opts.swarmCollector && params.opts.swarmOutputSchema ? ["structured_output"] : void 0 });
	const disableTools = params.opts.modelRun === true || isSubagentAnnounceHandoff && !completionRetainsRequesterTools && !completionNeedsMessageDelivery;
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
	const buildCommonRunParams = () => ({
		preparedRunAdmission: params.preparedRunAdmission,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
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
		onExecutionPhase: onRuntimeActivity,
		lane: params.opts.lane,
		extraSystemPrompt: params.opts.extraSystemPrompt,
		inputProvenance: params.opts.inputProvenance,
		skillLibraryAuthoring: params.opts.skillLibraryAuthoring,
		sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
		media: params.opts.media,
		skillsSnapshot: params.skillsSnapshot,
		streamParams: params.opts.streamParams,
		approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
		bashElevated: params.opts.bashElevated,
		cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
		oneShotCliRun: params.opts.oneShotCliRun,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
		onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
		suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
		disableTools,
		allowEmptyAssistantReplyAsSilent: isSubagentLane || isSubagentAnnounceHandoff,
		bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature
	});
	if (!isRawModelRun && isCliExecutionProvider) {
		const expectedLifecycleRevision = params.sessionEntry?.lifecycleRevision;
		return withLocalSessionPlacementTurnSettlement({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey ?? params.sessionId,
			agentId: params.sessionAgentId,
			runId: params.runId
		}, async (assertSettlementCurrent) => {
			if (params.sessionKey && params.storePath) {
				params.sessionEntry = loadSessionEntry({
					agentId: params.sessionAgentId,
					sessionKey: params.sessionKey,
					storePath: params.storePath,
					readConsistency: "latest"
				});
				if (params.sessionEntry?.sessionId !== params.sessionId || params.sessionEntry.lifecycleRevision !== expectedLifecycleRevision) throw createAgentRunSupersededAbortError();
			}
			const cliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
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
			const resolveReusableCliSessionBinding = async () => {
				const hasManagedClaudeLiveSession = Boolean(isClaudeCliProvider(cliExecutionProvider) && cliSessionBinding?.sessionId && hasCliLiveSession({
					backendId: cliExecutionProvider,
					agentAccountId: params.runContext.accountId,
					agentId: params.sessionAgentId,
					authProfileId: cliSessionBinding.authProfileId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				}));
				if (!isClaudeCliProvider(cliExecutionProvider) || !cliSessionBinding?.sessionId || hasManagedClaudeLiveSession || await claudeCliSessionTranscriptHasContent({
					sessionId: cliSessionBinding.sessionId,
					workspaceDir: cliProcessCwd
				})) return cliSessionBinding;
				log.warn(`cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`);
				if (mutableCliSessionStore) params.sessionEntry = await clearCliSessionInStore({
					provider: cliExecutionProvider,
					...mutableCliSessionStore
				}) ?? params.sessionEntry;
				return cliSessionBinding;
			};
			const mediaTaskIdsBefore = getGeneratedMediaTaskIdsForSessionKey(params.sessionKey);
			const runCliWithSession = async (nextCliSessionId, activeCliSessionBinding = cliSessionBinding) => {
				const forkCliSessionOnResume = activeCliSessionBinding?.forkNextResume === true;
				const resolvedCliBackend = resolveCliBackendConfig(cliExecutionProvider, params.cfg, { agentId: params.sessionAgentId });
				const supportsCliSessionFork = Boolean(resolvedCliBackend?.config.forkArg);
				if (forkCliSessionOnResume && !supportsCliSessionFork) throw new Error(`CLI backend "${cliExecutionProvider}" does not support session forks`);
				const forkStoreParams = supportsCliSessionFork && nextCliSessionId && mutableCliSessionStore ? {
					provider: cliExecutionProvider,
					expectedCliSessionId: nextCliSessionId,
					...mutableCliSessionStore,
					assertCommitAllowed: () => {
						assertSettlementCurrent();
						(params.deferredLifecycle?.signal ?? params.opts.abortSignal)?.throwIfAborted();
					}
				} : void 0;
				return await runCliAgent({
					...buildCommonRunParams(),
					diagnosticOwner,
					sessionEntry: params.sessionEntry,
					storePath: params.storePath,
					persistAssistantTranscript: params.storePath !== void 0 && params.sessionStore !== void 0,
					prompt: cliPrompt,
					transcriptPrompt: cliTranscriptPrompt,
					modelProvider: params.providerOverride,
					requesterModel: {
						provider: params.providerOverride,
						model: params.modelOverride
					},
					provider: cliExecutionProvider,
					abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal,
					onExecutionStarted: params.opts.onExecutionStarted,
					cronCreatorCallerOrigin: params.opts.cronCreatorAuthorityCapability?.callerOrigin,
					requireExplicitMessageTarget: params.opts.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
					cliSessionBindingFacts: params.opts.cliSessionBindingFacts,
					cliSessionId: nextCliSessionId,
					cliSessionBinding: nextCliSessionId === activeCliSessionBinding?.sessionId ? activeCliSessionBinding : void 0,
					forkCliSessionOnResume,
					...forkStoreParams ? {
						claimCliSessionFork: async () => {
							const claimed = await consumeCliSessionForkInStore(forkStoreParams);
							if (claimed) params.sessionEntry = claimed;
							return Boolean(claimed);
						},
						restoreCliSessionFork: async () => {
							const restored = await restoreCliSessionForkInStore({
								...forkStoreParams,
								assertCommitAllowed: assertSettlementCurrent
							});
							if (restored) params.sessionEntry = restored;
						},
						persistCliSessionForkSuccessor: async (successorCliSessionId) => {
							const persisted = await persistCliSessionForkSuccessorInStore({
								...forkStoreParams,
								successorCliSessionId
							});
							if (!persisted) throw new Error("CLI session fork successor could not be persisted");
							params.sessionEntry = persisted;
						}
					} : {},
					authProfileId: cliAuthProfileId,
					imagePrompt: params.body,
					images: params.opts.images,
					imageOrder: params.opts.imageOrder,
					...toolContext,
					currentChannelId: params.runContext.currentChannelId ?? (completionNeedsMessageDelivery ? params.opts.replyTo ?? params.opts.to : void 0),
					toolsAllow: resolveCliRuntimeToolsAllow(cliRuntimeToolsAllow, params.opts.toolsAllowIsDefault),
					...buildCliMcpDelegationCapabilityBinding(resolveDelegationCapability({
						fallbackActive: params.isFallbackRetry,
						inputProvenance: params.opts.inputProvenance,
						disableTools,
						toolsAllow: runtimeToolsAllow
					})),
					cleanupCliLiveSessionOnRunEnd: params.opts.cleanupCliLiveSessionOnRunEnd,
					...forkStoreParams && !forkCliSessionOnResume ? { onBeforeForkedCliSessionRetry: async (retry) => {
						if (hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore) || retry.sessionId !== activeCliSessionBinding?.sessionId) return false;
						log.warn(`CLI session stalled, arming forked recovery: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${forkStoreParams.sessionKey}`);
						const armed = await restoreCliSessionForkInStore(forkStoreParams);
						if (armed) params.sessionEntry = armed;
						return Boolean(armed);
					} } : {},
					...mutableCliSessionStore ? { onBeforeFreshCliSessionRetry: async (retry) => {
						if (hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore) || getCliSessionBinding(loadSessionEntry({
							agentId: params.sessionAgentId,
							sessionKey: mutableCliSessionStore.sessionKey,
							storePath: mutableCliSessionStore.storePath,
							readConsistency: "latest"
						}), cliExecutionProvider)?.sessionId !== retry.sessionId) return false;
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
			};
			const activeCliSessionBinding = await resolveReusableCliSessionBinding();
			let result;
			try {
				result = await runCliWithSession(activeCliSessionBinding?.sessionId, activeCliSessionBinding);
			} catch (err) {
				const failedCliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
				const failedCliSessionId = failedCliSessionBinding?.sessionId;
				if (isClaudeCliProvider(cliExecutionProvider) && shouldClearFailedCliSessionBinding({
					error: err,
					binding: failedCliSessionBinding,
					bindingReplacedDuringRun: failedCliSessionId !== activeCliSessionBinding?.sessionId,
					hasNewGeneratedMediaTask: hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore)
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
			const classification = params.classifyResult?.(result);
			if (!params.preserveCliSessionBinding && (!classification || result.meta.agentMeta?.clearCliSessionBinding === true)) return await persistCliSessionBindingResult({
				agentId: params.sessionAgentId,
				provider: cliExecutionProvider,
				result,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				sessionStore: params.sessionStore,
				expectedSession: params.sessionEntry,
				assertSettlementCurrent,
				abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal
			});
			return result;
		}, {
			preparedRunAdmission: params.preparedRunAdmission,
			lifecycleGeneration: params.lifecycleGeneration,
			isFinalFallbackAttempt: params.isFinalFallbackAttempt,
			abortSignal: params.deferredLifecycle?.signal ?? params.opts.abortSignal,
			trigger: "user",
			inputProvenance: params.opts.inputProvenance
		});
	}
	const embeddedRunParams = {
		...buildCommonRunParams(),
		sandboxSessionKey: params.sessionKey,
		terminalReplyExpectation: isSubagentLane ? "optional" : void 0,
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
		suppressLiveStreamOutput: shouldSuppressEmbeddedLiveStreamOutput(params),
		abortSignal: params.opts.abortSignal,
		bootstrapContextMode: params.opts.bootstrapContextMode,
		bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
		toolsAllow: runtimeToolsAllow,
		runtimePluginToolGrant: params.opts.runtimePluginToolGrant,
		trustedInternalHandoff: trustedSubagentAnnounceHandoff ? params.opts.trustedInternalHandoff : void 0,
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
function buildAcpResult(params) {
	const normalizedFinalPayload = normalizeReplyPayload({ text: params.payloadText });
	const payloads = normalizedFinalPayload ? [normalizedFinalPayload] : [];
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	const resultCancelled = params.resultStatus === "cancelled";
	return {
		payloads,
		meta: {
			durationMs: Date.now() - params.startedAt,
			aborted: abortFields.aborted ?? resultCancelled,
			stopReason: abortFields.stopReason ?? (resultCancelled ? "stop" : params.stopReason),
			...params.terminalReply ? { terminalReply: params.terminalReply } : {}
		}
	};
}
function acpRunIdentity(params) {
	return {
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	};
}
function emitAcpLifecycleEvent(params, data) {
	(params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
		...acpRunIdentity(params),
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data
	});
}
function emitAcpLifecycleStart(params) {
	emitAcpLifecycleEvent(params, {
		phase: "start",
		...params.completionSource ? { completionSource: params.completionSource } : {},
		startedAt: params.startedAt
	});
}
const ACP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const MAX_TRACKED_ACP_TOOLS = 4096;
function createAcpToolLifecycleTracker() {
	return {
		active: /* @__PURE__ */ new Map(),
		terminalToolCallIds: /* @__PURE__ */ new Set(),
		saturated: false
	};
}
function acpAuditToolName(kind) {
	switch (kind) {
		case "read":
		case "edit":
		case "delete":
		case "move":
		case "search":
		case "execute":
		case "fetch":
		case "switch_mode":
		case "think":
		case "other": return `acp_${kind}`;
		default: return "acp_tool";
	}
}
function resolveAcpToolTerminalReason(signal, stopReason, error, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	const normalizedStopReason = normalizeOptionalLowercaseString(stopReason);
	if (normalizedStopReason === "timeout") return "timed_out";
	if (resultStatus === "cancelled") return "cancelled";
	if (error instanceof Error && error.detailCode === "TURN_TIMEOUT") return "timed_out";
	if (normalizedStopReason === "cancel" || normalizedStopReason === "cancelled" || normalizedStopReason === "manual-cancel") return "cancelled";
	return "failed";
}
function resolveAcpLifecycleEndFields(signal, stopReason, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	const terminalReason = resolveAcpToolTerminalReason(void 0, stopReason, void 0, resultStatus);
	if (terminalReason === "timed_out") return {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	};
	if (terminalReason === "cancelled") return {
		aborted: true,
		stopReason: "stop",
		status: "cancelled"
	};
	return {};
}
function emitAcpToolExecutionEvent(params) {
	const { event } = params;
	const now = Date.now();
	const toolCallId = event.toolCallId?.trim() ? event.toolCallId : void 0;
	const activeTool = toolCallId ? params.toolTracker.active.get(toolCallId) : void 0;
	const terminalOutcome = resolveAcpToolTerminalOutcome(event.status);
	const toolName = acpAuditToolName(event.kind);
	if (toolCallId && !activeTool) {
		if (params.toolTracker.terminalToolCallIds.has(toolCallId)) return;
		const trackedIdentities = params.toolTracker.active.size + params.toolTracker.terminalToolCallIds.size;
		if (params.toolTracker.saturated || trackedIdentities >= MAX_TRACKED_ACP_TOOLS) {
			params.toolTracker.saturated = true;
			return;
		}
	}
	if (!activeTool && (toolCallId !== void 0 || toolCallId === void 0 && terminalOutcome !== void 0)) {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.started",
			...acpRunIdentity(params),
			...toolCallId ? { toolCallId } : {},
			toolName,
			toolSource: "core",
			toolOwner: "acp"
		});
		if (toolCallId) params.toolTracker.active.set(toolCallId, {
			...acpRunIdentity(params),
			toolCallId,
			toolName,
			startedAt: now
		});
	}
	if (!terminalOutcome) return;
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, void 0, terminalOutcome === "cancelled" ? "cancelled" : void 0);
	const durationMs = Math.max(0, now - (activeTool?.startedAt ?? now));
	const terminalFields = {
		...acpRunIdentity(params),
		...toolCallId ? { toolCallId } : {},
		toolName: activeTool?.toolName ?? toolName,
		toolSource: "core",
		toolOwner: "acp",
		durationMs
	};
	emitTrustedDiagnosticEvent(terminalOutcome === "completed" ? {
		type: "tool.execution.completed",
		...terminalFields
	} : {
		type: "tool.execution.error",
		...terminalFields,
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool",
		terminalReason
	});
	if (toolCallId) {
		params.toolTracker.active.delete(toolCallId);
		params.toolTracker.terminalToolCallIds.add(toolCallId);
	}
}
function finalizeAcpToolsForRun(toolTracker, runId, terminalReason) {
	const now = Date.now();
	for (const activeTool of toolTracker.active.values()) emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		runId,
		...activeTool.sessionKey ? { sessionKey: activeTool.sessionKey } : {},
		...activeTool.agentId ? { agentId: activeTool.agentId } : {},
		toolName: activeTool.toolName,
		toolSource: "core",
		toolOwner: "acp",
		toolCallId: activeTool.toolCallId,
		durationMs: Math.max(0, now - activeTool.startedAt),
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool_incomplete",
		terminalReason
	});
	toolTracker.active.clear();
	toolTracker.terminalToolCallIds.clear();
	toolTracker.saturated = false;
}
function resolvePresentProxyEnvKeys(env = process.env) {
	return ACP_PROXY_ENV_KEYS.filter((key) => Boolean(env[key]?.trim()));
}
function sanitizeAcpDiagnosticText(value) {
	return truncateUtf16Safe(redactSensitiveText(value).replace(/\s+/g, " ").trim(), 240);
}
function acpRuntimeEventDiagnostics(event) {
	if (event.type === "status" || event.type === "tool_call") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {},
		...event.type === "tool_call" ? {
			...event.status ? { status: sanitizeAcpDiagnosticText(event.status) } : {},
			...event.title ? { title: sanitizeAcpDiagnosticText(event.title) } : {},
			...event.toolCallId ? { toolCallId: sanitizeAcpDiagnosticText(event.toolCallId) } : {}
		} : {}
	};
	if (event.type === "error") return {
		eventType: event.type,
		message: sanitizeAcpDiagnosticText(event.message),
		...event.code ? { code: sanitizeAcpDiagnosticText(event.code) } : {},
		...typeof event.retryable === "boolean" ? { retryable: event.retryable } : {}
	};
	if (event.type === "done") return {
		eventType: event.type,
		...event.status ? { status: event.status } : {},
		...event.stopReason ? { stopReason: sanitizeAcpDiagnosticText(event.stopReason) } : {}
	};
	return {
		eventType: event.type,
		stream: event.stream ?? "output"
	};
}
function emitAcpPromptSubmitted(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "prompt_submitted",
			at: params.at,
			proxyEnvKeys: resolvePresentProxyEnvKeys()
		}
	});
}
function emitAcpRuntimeEvent(params) {
	if (params.event.type === "tool_call") emitAcpToolExecutionEvent({
		runId: params.runId,
		toolTracker: params.toolTracker,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		event: params.event
	});
	if (!params.auditOnly) emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		data: {
			phase: "runtime_event",
			...acpRuntimeEventDiagnostics(params.event)
		}
	});
}
function emitAcpTerminalLifecycle(params, terminal) {
	const data = {
		...terminal,
		executionSettled: true,
		...params.completionSource ? { completionSource: params.completionSource } : {}
	};
	emitAcpLifecycleEvent(params, data);
	return buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: terminal.phase,
		data,
		endedAt: terminal.endedAt
	});
}
function emitAcpLifecycleEnd(params) {
	finalizeAcpToolsForRun(params.toolTracker, params.runId, params.endFields.stopReason === "timeout" ? "timed_out" : params.endFields.aborted ? "cancelled" : "failed");
	return emitAcpTerminalLifecycle(params, {
		phase: "end",
		endedAt: Date.now(),
		...params.endFields,
		...params.terminalReply ? { terminalReply: params.terminalReply } : {}
	});
}
function emitAcpLifecycleError(params) {
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, params.error);
	finalizeAcpToolsForRun(params.toolTracker, params.runId, terminalReason);
	const lifecycleFields = params.terminalOutcome === "blocked" ? { livenessState: "blocked" } : terminalReason === "timed_out" ? {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	} : resolveAgentRunAbortLifecycleFields(params.abortSignal);
	return emitAcpTerminalLifecycle(params, {
		phase: "error",
		...!params.auditOnly ? { error: formatAcpErrorChain(params.error) } : {},
		endedAt: Date.now(),
		...lifecycleFields
	});
}
function emitAcpAssistantDelta(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "assistant",
		data: {
			text: params.text,
			delta: params.delta
		}
	});
}
//#endregion
export { buildAcpResult, createAcpToolLifecycleTracker, createAcpVisibleTextAccumulator, emitAcpAssistantDelta, emitAcpLifecycleEnd, emitAcpLifecycleError, emitAcpLifecycleStart, emitAcpPromptSubmitted, emitAcpRuntimeEvent, persistAcpTurnTranscript, persistCliTurnTranscript, resolveAcpLifecycleEndFields, resolveCliTranscriptReplyText, runAgentAttempt, sessionTranscriptHasContent };

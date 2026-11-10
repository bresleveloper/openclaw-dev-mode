import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-Bm7d8DH8.mjs";
import { a as setChannelSourceTurnId, n as readChannelSourceTurnId, o as setChannelSourceTurnSameThreadRequired, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-DjBP_DbU.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-D1LHo5Qj.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { d as readSessionEntryInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-CUqXgij4.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { s as resolveCliSessionClearReason, u as shouldClearFailedCliSessionBinding } from "./cli-session-CBCjrsL6.mjs";
import { c as hasNewGeneratedMediaTaskForSessionKey, s as getGeneratedMediaTaskIdsForSessionKey } from "./media-generation-activity-CdYWMYrm.mjs";
import { t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-tYfGdUlb.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-Cszei1X7.mjs";
import { a as isTrustedSubagentCompletionHandoffForRun, i as isSubagentAnnounceCompletionHandoff, t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-BmPXAdVs.mjs";
import { t as prepareConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { i as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { c as resolveDelegationCapability } from "./agent-tools-QGgE-Vnu.mjs";
import { a as resolveRunEntryCliRuntime } from "./sessions-spawn-tool-DhFS9chG.mjs";
import { t as buildAgentInternalEventContext } from "./internal-events-Crl175ti.mjs";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-96UImSUD.mjs";
import { _ as injectTimestamp, v as timestampOptsFromConfig } from "./attempt-system-prompt-prepare-D8zKFv2e.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { n as resolveWebchatPromptCacheKey } from "./session-boundary-prompt-cache-key-xrPTEs08.mjs";
import "./selection-2hiqqZF8.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-B8S-WtrO.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-tVbJkh67.mjs";
import { c as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-BqQWG-4m.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-Db8iWS1_.mjs";
import { n as emitAgentAttemptRuntimeStart } from "./attempt-callbacks-n8R-aP3x.mjs";
import { s as hasCliLiveSession } from "./cli-live-session-registry-dDPsvSOh.mjs";
import { _ as resolveFallbackRetryPrompt, f as createAcpVisibleTextAccumulator, g as resolveCompletionToolPolicy, h as resolveCommandReplyExpectation, l as buildClaudeCliFallbackContextPrelude, m as rebaseExecApprovalContinuationPromptRange, p as isClaudeCliProvider, u as claudeCliSessionTranscriptHasContent, v as sessionTranscriptHasContent } from "./session-history-CjZwLj4j.mjs";
import { t as buildCliMcpDelegationCapabilityBinding } from "./mcp-grant-context-CW5tETiH.mjs";
import { n as runCliAgent } from "./cli-runner-6yhPcac3.mjs";
import { a as emitAcpLifecycleError, c as emitAcpRuntimeEvent, i as emitAcpLifecycleEnd, l as resolveAcpLifecycleEndFields, n as createAcpToolLifecycleTracker, o as emitAcpLifecycleStart, r as emitAcpAssistantDelta, s as emitAcpPromptSubmitted, t as buildAcpResult } from "./acp-lifecycle-uzGHtDCB.mjs";
import { a as restoreCliSessionForkInStore, n as clearCliSessionInStore, t as buildCliSessionForkRunParams } from "./cli-session-store-BqSinGQ9.mjs";
import { t as withAdmittedCliCandidate } from "./run-entry-cli-BcxTKfy-.mjs";
import { n as persistCliTurnTranscript, r as resolveCliTranscriptReplyText, t as persistAcpTurnTranscript } from "./transcript-persistence-CNGp7zbz.mjs";
//#region src/agents/command/attempt-auth-selection.ts
function resolveCommandAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionEntry?.authProfileOverride?.trim();
	const sessionAuthProfileSource = resolveCollapsedSessionAuthPinSource(params.sessionEntry);
	return sessionAuthProfileId && sessionAuthProfileSource !== "auto" ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : params.configuredAuthProfileId?.trim() ? {
		id: params.configuredAuthProfileId.trim(),
		source: "user"
	} : sessionAuthProfileId ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : void 0;
}
async function resolveHarnessAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
	if (sessionAuthProfileId) {
		const credential = (await ensureAuthProfileStoreAsync(params.agentDir, {
			allowKeychainPrompt: false,
			externalCliProfileIds: [sessionAuthProfileId]
		})).profiles[sessionAuthProfileId];
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
	const store = await ensureAuthProfileStoreAsync(params.agentDir, {
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
//#region src/agents/command/attempt-sandbox-cli-admission.ts
/**
* Sandboxed delegated children never dispatch to host-executed CLI backends.
*
* A CLI backend spawns a local AI CLI on the gateway host; its native tools run
* with the gateway OS user outside any configured sandbox. Spawn admission
* fails closed once the resolved child model is known, but fallback candidates
* and post-spawn runtime overrides can still land on a CLI backend when the
* run starts, so the run seam owns the invariant: refuse the CLI candidate for
* any session with spawn provenance and whose sandbox classification (the
* configured sandbox mode covering this session key, or a creation-stamped
* `sandbox: "required"`) claims containment. Recovery is configuration: pick an
* API-backed child model, or change the agent's sandbox policy explicitly.
* Direct operator-chosen CLI runs on a non-delegated, unsandboxed session stay
* permitted, mirroring the cron seam guard
* (`assertCronCandidateSandboxPlacement`).
*/
function assertSandboxedDelegatedChildNotCli(params) {
	if (!params.useCliExecution) return;
	if (!(isSubagentSessionKey(params.sessionKey) || Boolean(params.sessionEntry?.spawnedBy?.trim()))) return;
	const placement = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId,
		preparedSessionEntry: params.sessionEntry ?? null
	});
	if (!placement.sandboxed && !placement.sandboxRequired) return;
	throw new AgentHarnessPreflightError(`This delegated run belongs to a sandboxed session, but resolved execution provider ${params.cliExecutionProvider} runs on the host and cannot honor the sandbox. Override agents.entries.<id>.subagents.model, agents.defaults.subagents.model, or the spawn model with an API-backed provider (and clear any pinned CLI runtime override), or change the agent's sandbox policy explicitly.`);
}
//#endregion
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
async function runAgentAttempt(params) {
	const selectedAuthProfile = resolveCommandAuthProfileSelection(params);
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
	}) && await withPreparedSessionCapabilityRead(() => hasVerifiedRequesterCompletionHandoff({
		config: params.cfg,
		sessionKey: params.sessionKey,
		inputProvenance: params.opts.inputProvenance,
		trustedInternalHandoff: params.opts.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.providerOverride,
		modelId: params.modelOverride
	}));
	const trustedSubagentAnnounceHandoff = isSubagentAnnounceHandoff && trustedSubagentCompletionHandoff;
	const completionRequestsMessageDelivery = trustedSubagentAnnounceHandoff && !isRawModelRun && params.opts.disableMessageTool !== true && messageToolOwnsVisibleReply(params.opts);
	const completionSandboxStatus = completionRequestsMessageDelivery ? resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId,
		preparedSessionEntry: params.sessionEntry ?? null
	}) : void 0;
	const completionCapabilityProfile = completionRequestsMessageDelivery ? await prepareConversationCapabilityProfile({
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
	const claudeCliFallbackPrelude = !isRawModelRun && params.isFallbackRetry && isClaudeCliProvider(params.originalProvider) && !isClaudeCliProvider(params.providerOverride) ? await buildClaudeCliFallbackContextPrelude({ cliSessionId: getCliSessionBinding(params.sessionEntry, "claude-cli")?.sessionId }) : "";
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
		pinnedHarnessId: resolveSessionPinnedHarnessId(params.sessionEntry)
	});
	assertSandboxedDelegatedChildNotCli({
		useCliExecution: isCliExecutionProvider,
		cliExecutionProvider,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		sessionAgentId: params.sessionAgentId,
		sessionEntry: params.sessionEntry
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
	const harnessAuthContext = {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		provider: params.providerOverride,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	};
	const harnessAuthSelection = await resolveHarnessAuthProfileSelection({
		...harnessAuthContext,
		agentDir: params.agentDir,
		authProfileProvider: params.authProfileProvider,
		sessionAuthProfileId: selectedAuthProfile?.id,
		sessionAuthProfileSource: selectedAuthProfile?.source
	});
	const runtimeAuthPlan = buildAgentRuntimeAuthPlan({
		...harnessAuthContext,
		authProfileProvider: harnessAuthSelection.authProfileProvider,
		authProfileMode: harnessAuthSelection.authProfileMode,
		sessionAuthProfileId: harnessAuthSelection.authProfileId
	});
	const cliAuthNeedsSessionBinding = allowCliAuthProfileForwarding && !isRawModelRun && (!harnessAuthSelection.authProfileId || harnessAuthSelection.authProfileIdSource === "auto");
	const buildCliAuthContext = () => ({
		cliExecutionProvider,
		authProfileProvider: params.authProfileProvider,
		config: params.cfg,
		agentDir: params.agentDir,
		selected: harnessAuthSelection
	});
	const authProfileId = allowCliAuthProfileForwarding && !cliAuthNeedsSessionBinding ? await resolveCliExecutionAuthProfileId(buildCliAuthContext()) : runtimeAuthPlan.forwardedAuthProfileId;
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
		toolOverrides: params.sessionEntry?.toolOverrides,
		modelHasVision: params.modelHasVision,
		model: params.modelOverride,
		modelRoutingProvenance: params.modelRoutingProvenance,
		thinkLevel: params.resolvedThinkLevel,
		thinkingExplicit: params.thinkingExplicit,
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
		extraSystemPromptTurnContext: params.opts.extraSystemPromptTurnContext,
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
		bootstrapContextMode: params.opts.bootstrapContextMode,
		bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
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
			const cliAuthProfileId = cliAuthNeedsSessionBinding ? await resolveCliExecutionAuthProfileId({
				...buildCliAuthContext(),
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
			const clearCliBinding = async (expectedCliSessionId) => {
				if (!mutableCliSessionStore) return false;
				const cleared = await clearCliSessionInStore({
					provider: cliExecutionProvider,
					...expectedCliSessionId !== void 0 ? { expectedCliSessionId } : {},
					...mutableCliSessionStore
				});
				params.sessionEntry = cleared ?? params.sessionEntry;
				return Boolean(cleared);
			};
			const prepareCliSessionBinding = async () => {
				if (!isClaudeCliProvider(cliExecutionProvider) || !cliSessionBinding?.sessionId) return;
				if (hasCliLiveSession({
					backendId: cliExecutionProvider,
					agentId: params.sessionAgentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				}) || await claudeCliSessionTranscriptHasContent({
					sessionId: cliSessionBinding.sessionId,
					workspaceDir: cliProcessCwd
				})) return;
				log.warn(`cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`);
				await clearCliBinding();
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
						return await clearCliBinding(retry.sessionId);
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
					await clearCliBinding(failedCliSessionId);
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
		sessionRoot: params.sessionEntry?.sessionRoot,
		...params.pluginGeneration ? { pluginGeneration: params.pluginGeneration } : {},
		agentHarnessId: isRawModelRun ? void 0 : resolveSessionPinnedHarnessId(params.sessionEntry),
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
		resolvedModelSelection: params.resolvedModelSelection,
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

import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as resolveMergedModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { a as modelFallbackOverrideFromAvailability, p as resolveModelFallbackAvailability } from "./agent-scope-DXrnO3F4.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as findModelInCatalog, r as modelSupportsInput } from "./model-catalog-lookup-BJKolYfz.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { r as resolveCronRunToolsAllow } from "./tools-allow-BHyxEpHd.mjs";
import { g as getReplyOperationSessionReader } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { t as getReplySystemEventContext } from "./system-event-session-key-d4mk05_u.mjs";
import { t as resolveReplyRunTrigger } from "./reply-turn-kind-TZy3-XgJ.mjs";
import { n as resolveScheduledToolPolicyContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { i as formatExecCompletionPrompt } from "./heartbeat-events-filter-BpnzoyZw.mjs";
import { n as resolveCronFallbacksOverride } from "./run-fallback-policy-ZsbPmtwE.mjs";
//#region src/auto-reply/reply/agent-runner-run-params.ts
function resolveReplyScheduledToolPolicy(run) {
	const automation = run.scheduledAutomation;
	automation?.assertCurrent();
	if (!automation || run.scheduledToolPolicy) return run.scheduledToolPolicy;
	const job = automation.job;
	const toolsAllow = resolveCronRunToolsAllow(job);
	return resolveScheduledToolPolicyContext({
		toolsAllow,
		scheduledToolPolicy: resolveCronScheduledToolPolicy({
			toolsAllow,
			scheduledToolPolicy: job.scheduledToolPolicy,
			owner: job.owner
		}),
		callerOrigin: job.toolsAllowProvenance?.callerOrigin,
		execTarget: job.toolsAllowExecTarget
	});
}
function createReplySourceReadGuard(operation, assertOperatorCurrent) {
	const readGeneration = getAgentEventLifecycleGeneration();
	const sourceReader = getReplyOperationSessionReader(operation);
	return {
		sourceReader,
		assertReadCurrent: composeSessionSourceAssertion([assertOperatorCurrent], (assertSource) => {
			assertAgentRunLifecycleGenerationCurrent(readGeneration);
			operation?.abortSignal.throwIfAborted();
			sourceReader?.assertCurrent();
			assertSource();
		})
	};
}
function resolveModelFallbackOptions(run, config = run.config) {
	const modelFallbackAvailability = resolveModelFallbackAvailability({
		cfg: config,
		agentId: run.agentId,
		sessionKey: run.sessionKey,
		modelSelectionLocked: run.modelSelectionLocked,
		...run.scheduledAutomation ? {
			hasSessionModelOverride: false,
			modelFallbacksOverride: resolveCronFallbacksOverride({
				cfg: config,
				job: run.scheduledAutomation.job,
				agentId: run.agentId,
				...run.scheduledAutomation.modelFallbackPolicy
			})
		} : {
			hasSessionModelOverride: run.hasSessionModelOverride === true,
			modelOverrideSource: run.modelOverrideSource,
			hasAutoFallbackProvenance: run.hasAutoFallbackProvenance === true,
			subagentSpawnLineage: run.subagentSpawnLineage
		}
	});
	return {
		cfg: config,
		provider: run.provider,
		model: run.model,
		requestedRouteResolution: run.requestedRouteResolution,
		agentDir: run.agentDir,
		agentId: run.agentId,
		sessionKey: run.runtimePolicySessionKey ?? run.sessionKey,
		modelFallbackAvailability,
		fallbacksOverride: modelFallbackOverrideFromAvailability(modelFallbackAvailability)
	};
}
function buildRunEntrySelection(selection, run) {
	return {
		cfg: selection.cfg,
		provider: selection.provider,
		model: selection.model,
		requestedRouteResolution: selection.requestedRouteResolution,
		agentDir: selection.agentDir,
		fallbacksOverride: selection.fallbacksOverride,
		userLockedAuthProfileId: run.scheduledAutomation ? run.scheduledAutomation.job.inferenceBinding?.source === "user" ? run.scheduledAutomation.job.inferenceBinding.profileId : void 0 : run.authProfileIdSource === "user" ? run.authProfileId : void 0
	};
}
/** Prepare the selected candidate's input before placement can bypass local model resolution. */
async function resolveRunModelHasVision(params) {
	const { run, provider, model } = params;
	const providerConfig = resolveMergedModelProviderConfig(run.config, provider);
	const configured = findConfiguredProviderModel(providerConfig, provider, model, normalizeLowercaseStringOrEmpty);
	if (configured?.input !== void 0) return modelSupportsInput(configured, "image");
	const route = {
		api: configured?.api ?? providerConfig?.api,
		baseUrl: configured?.baseUrl ?? providerConfig?.baseUrl
	};
	const prepared = findModelInCatalog(run.thinkingCatalog ?? [], provider, model);
	if (prepared?.input !== void 0 && modelTransportRoutesMatch(prepared, route)) return modelSupportsInput(prepared, "image");
	const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
	const catalog = await loadProviderScopedThinkingCatalog({
		config: run.config,
		provider,
		model,
		agentId: run.agentId,
		agentDir: run.agentDir,
		workspaceDir: run.workspaceDir,
		requiredInputRoute: route
	});
	return modelSupportsInput(findModelInCatalog(catalog, provider, model), "image");
}
/** Project prepared turn facts shared by the CLI and embedded runtime adapters. */
function buildFallbackCandidateTurnParams(params) {
	const { turn } = params;
	const provenance = turn.followupRun.run.inputProvenance;
	const prompt = provenance?.kind === "internal_system" && provenance.sourceTool === "exec" ? formatExecCompletionPrompt(turn.commandBody) : turn.commandBody;
	return {
		preparedTtsPreferences: turn.opts?.preparedTtsPreferences,
		awaitSessionDiffBaseline: turn.opts?.awaitSessionDiffBaseline,
		preparedRunAdmission: params.preparedRunAdmission,
		messageActionTurnCapability: params.messageActionTurnCapability,
		trigger: resolveReplyRunTrigger(turn),
		heartbeatEventQueueSessionKey: getReplySystemEventContext(turn.opts)?.heartbeatEventQueueSessionKey,
		lane: params.runLane,
		fastModeStartedAtMs: params.fastModeStartedAtMs,
		fastModeAutoProgressState: params.fastModeAutoProgressState,
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		resolvedModelSelection: params.resolvedModelSelection,
		modelFallbacksOverride: params.modelFallbacksOverride,
		prompt,
		finalizePromptForResolvedTools: turn.followupRun.run.scheduledAutomation?.finalizePromptForResolvedTools,
		transcriptPrompt: turn.transcriptCommandBody,
		media: turn.followupRun.media,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
		onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
		currentInboundEventKind: turn.followupRun.currentInboundEventKind,
		currentInboundContext: turn.followupRun.currentInboundContext,
		extraSystemPrompt: turn.followupRun.run.extraSystemPrompt,
		extraSystemPromptTurnContext: turn.followupRun.run.extraSystemPromptTurnContext,
		sourceReplyDeliveryMode: turn.followupRun.run.sourceReplyDeliveryMode,
		...turn.followupRun.run.scheduledAutomation ? { requireExplicitMessageTarget: true } : turn.isHeartbeat ? { requireExplicitMessageTarget: turn.opts?.requireExplicitMessageTarget ?? true } : {},
		cleanupBundleMcpOnRunEnd: turn.opts?.cleanupBundleMcpOnRunEnd,
		silentReplyPromptMode: turn.followupRun.run.silentReplyPromptMode,
		suppressNextUserMessagePersistence: params.suppressQueuedUserPersistenceForCandidate,
		onUserMessagePersisted: params.notifyUserMessagePersisted,
		prepareAssistantTranscriptMessage: turn.opts?.prepareAssistantTranscriptMessage,
		toolsAllow: turn.opts?.toolsAllow,
		disableTools: turn.opts?.disableTools,
		continuesConversation: turn.opts?.continuesConversation,
		bootstrapContextMode: turn.opts?.bootstrapContextMode,
		bootstrapContextRunKind: params.bootstrapContextRunKind,
		images: params.currentTurnImages.images,
		imageOrder: params.currentTurnImages.imageOrder,
		abortSignal: params.runAbortSignal,
		replyOperation: turn.replyOperation,
		bootstrapPromptWarningSignaturesSeen: params.bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature: params.bootstrapPromptWarningSignaturesSeen.at(-1)
	};
}
/** Carry the same session-selected facts while each adapter owns runtime and route overrides. */
function buildReplyRunStateParams(run) {
	return {
		sessionFile: run.sessionFile,
		workspaceDir: run.workspaceDir,
		cwd: run.cwd,
		toolOverrides: run.toolOverrides,
		skillsSnapshot: run.skillsSnapshot,
		ownerNumbers: run.ownerNumbers,
		inputProvenance: run.inputProvenance,
		senderIsOwner: run.senderIsOwner,
		conversationToolPolicy: run.conversationToolPolicy,
		channelContext: run.channelContext,
		approvalReviewerDeviceId: run.approvalReviewerDeviceId,
		terminalReplyExpectation: run.terminalReplyExpectation,
		clientCaps: run.clientCaps,
		bootstrapUserProfileId: run.bootstrapUserProfileId,
		gatewayUiCommandTarget: run.gatewayUiCommandTarget,
		taskSuggestionDeliveryMode: run.taskSuggestionDeliveryMode
	};
}
function buildReplyMediaContextParams({ run, originatingAccountId }, sessionKey, cfg) {
	return {
		cfg,
		agentId: run.agentId,
		sessionKey,
		workspaceDir: run.workspaceDir,
		mediaNormalizationOwner: run.mediaNormalizationOwner,
		messageProvider: run.messageProvider,
		accountId: originatingAccountId ?? run.agentAccountId,
		groupId: run.groupId,
		groupChannel: run.groupChannel,
		groupSpace: run.groupSpace,
		requesterSenderId: run.senderId,
		requesterSenderName: run.senderName,
		requesterSenderUsername: run.senderUsername,
		requesterSenderE164: run.senderE164
	};
}
//#endregion
export { createReplySourceReadGuard as a, resolveRunModelHasVision as c, buildRunEntrySelection as i, buildReplyMediaContextParams as n, resolveModelFallbackOptions as o, buildReplyRunStateParams as r, resolveReplyScheduledToolPolicy as s, buildFallbackCandidateTurnParams as t };

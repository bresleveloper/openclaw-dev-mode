import { D as freezeDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { a as calculateContextTokens, n as IMAGE_BLOCK_TOKENS } from "./compaction-CAzwgOuQ.mjs";
import { r as SAFETY_MARGIN } from "./compaction-planning-Cn8w0Co8.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import { c as normalizeAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { J as estimateJsonPayloadTokenPressure, Q as estimateToolSchemaTokens, X as estimateRenderedPromptTokens, Y as estimateMessageTokenPressure, Z as estimateStringTokenPressure } from "./resource-loader-y1fV7Six.mjs";
import { t as estimateToolResultReductionPotential } from "./tool-result-truncation-pgGJEtGq.mjs";
import { d as resolveFinalAssistantVisibleText } from "./helpers-DPomumvX.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C33rGaR3.mjs";
import { resolveCompactionReplayPressure } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.ts
/**
* Estimates prompt pressure and decides pre-prompt compaction routing.
*/
const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
const TRUNCATION_ROUTE_BUFFER_TOKENS = 512;
function isProviderContextUsageBarrier(message) {
	if (message.role !== "assistant" || !message.usage) return false;
	return message.api === "cli" && message.usage.contextUsage === void 0 || message.usage.contextUsage?.state === "unavailable" && calculateContextTokens(message.usage) === 0;
}
function resolveProviderContextBoundary(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message && isProviderContextUsageBarrier(message)) return;
		const contextUsage = message?.role === "assistant" ? message.usage?.contextUsage : void 0;
		if (contextUsage?.state === "available" && Number.isFinite(contextUsage.totalTokens) && contextUsage.totalTokens > 0) return {
			index,
			totalTokens: Math.ceil(contextUsage.totalTokens)
		};
	}
}
/** Estimates token pressure from serialized tool definitions sent alongside the prompt. */
function estimateToolSchemaTokenPressure(tools) {
	return Math.ceil(estimateToolSchemaTokens(tools) * SAFETY_MARGIN);
}
function estimateTranscriptBoundaryTokenPressure(params) {
	const replay = params.replay ? resolveCompactionReplayPressure(params.messages, params.replay.model, params.replay, {
		text: estimateStringTokenPressure,
		image: () => IMAGE_BLOCK_TOKENS,
		json: estimateJsonPayloadTokenPressure,
		toolResult: (value) => estimateStringTokenPressure(value, 4, "tool-result")
	}, params.systemPrompt) : void 0;
	const messages = replay?.messages ?? params.messages;
	const boundary = resolveProviderContextBoundary(messages);
	const measuredTokens = replay?.measuredTokens ?? boundary?.totalTokens;
	const locallyEstimatedTokens = (boundary ? messages.slice(boundary.index + 1) : messages).reduce((sum, message) => sum + estimateMessageTokenPressure(message), estimateRenderedPromptTokens(params) + (boundary ? 0 : (replay?.prefixTokens ?? 0) - (replay?.measuredTokens ?? 0)));
	const toolSchemaTokens = Math.max(0, params.toolSchemaTokens ?? 0);
	return {
		estimatedPromptTokens: (measuredTokens ?? 0) + Math.ceil(locallyEstimatedTokens * SAFETY_MARGIN) + (boundary && !replay ? 0 : toolSchemaTokens),
		source: measuredTokens !== void 0 ? "provider_context_usage" : replay ? "provider_compaction_estimate" : "transcript_estimate",
		messages,
		hasCompactionReplay: Boolean(replay)
	};
}
function estimateLlmBoundaryTokenPressure(params) {
	return estimateTranscriptBoundaryTokenPressure(params).estimatedPromptTokens;
}
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
function estimateRenderedLlmBoundaryTokenPressure(params) {
	return Math.max(0, Math.ceil(estimateRenderedPromptTokens(params) * SAFETY_MARGIN));
}
function normalizeLlmBoundaryTokenPressure(pressure) {
	if (!pressure || !Number.isFinite(pressure.estimatedPromptTokens)) return;
	return {
		estimatedPromptTokens: Math.max(0, Math.ceil(pressure.estimatedPromptTokens)),
		source: pressure.source.trim() || "rendered_llm_boundary",
		...typeof pressure.renderedChars === "number" && Number.isFinite(pressure.renderedChars) ? { renderedChars: Math.max(0, Math.ceil(pressure.renderedChars)) } : {}
	};
}
/**
* Decides whether a run should compact before submitting the prompt, and
* whether reducible tool results can avoid or follow compaction. Rendered LLM
* boundary pressure wins over local transcript estimates when supplied.
*/
function shouldPreemptivelyCompactBeforePrompt(params) {
	const llmBoundaryTokenPressure = normalizeLlmBoundaryTokenPressure(params.llmBoundaryTokenPressure);
	const transcriptTokenPressure = llmBoundaryTokenPressure && !params.replay ? void 0 : estimateTranscriptBoundaryTokenPressure({
		messages: params.messages,
		systemPrompt: params.systemPrompt,
		prompt: params.prompt,
		replay: params.replay,
		...typeof params.toolSchemaTokens === "number" ? { toolSchemaTokens: params.toolSchemaTokens } : {}
	});
	const boundaryPressure = transcriptTokenPressure?.hasCompactionReplay ? void 0 : llmBoundaryTokenPressure;
	const outgoingDecision = resolveCompactionPressureDecision({
		messages: transcriptTokenPressure?.messages ?? params.messages,
		estimatedPromptTokens: boundaryPressure?.estimatedPromptTokens ?? transcriptTokenPressure?.estimatedPromptTokens ?? 0,
		source: boundaryPressure?.source ?? transcriptTokenPressure?.source ?? "transcript_estimate"
	}, params);
	let diagnosticDecision = outgoingDecision;
	if (params.unwindowedMessages && params.unwindowedMessages !== params.messages) {
		const unwindowedTokenPressure = estimateTranscriptBoundaryTokenPressure({
			messages: params.unwindowedMessages,
			systemPrompt: params.systemPrompt,
			prompt: params.prompt,
			...typeof params.toolSchemaTokens === "number" ? { toolSchemaTokens: params.toolSchemaTokens } : {}
		});
		if (unwindowedTokenPressure.estimatedPromptTokens > outgoingDecision.estimatedPromptTokens) diagnosticDecision = resolveCompactionPressureDecision({
			...unwindowedTokenPressure,
			source: `unwindowed_${unwindowedTokenPressure.source}`
		}, params);
	}
	return {
		...diagnosticDecision,
		...transcriptTokenPressure?.hasCompactionReplay ? { compactionReplay: outgoingDecision } : {}
	};
}
function resolveCompactionPressureDecision(pressure, params) {
	const { estimatedPromptTokens } = pressure;
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	const effectiveReserveTokens = resolveEffectiveCompactionReserveTokens({
		contextTokenBudget,
		reserveTokens: params.reserveTokens
	});
	const promptBudgetBeforeReserve = Math.max(1, contextTokenBudget - effectiveReserveTokens);
	const overflowTokens = Math.max(0, estimatedPromptTokens - promptBudgetBeforeReserve);
	const toolResultPotential = estimateToolResultReductionPotential({
		messages: pressure.messages,
		contextWindowTokens: params.contextTokenBudget,
		maxCharsOverride: params.toolResultMaxChars
	});
	const overflowChars = overflowTokens * 4;
	const truncateOnlyThresholdChars = Math.max(overflowChars + TRUNCATION_ROUTE_BUFFER_TOKENS * 4, Math.ceil(overflowChars * 1.5));
	const toolResultReducibleChars = toolResultPotential.maxReducibleChars;
	let route = "fits";
	if (overflowTokens > 0) {
		if (toolResultReducibleChars <= 0) route = "compact_only";
		else if (toolResultReducibleChars >= truncateOnlyThresholdChars) route = "truncate_tool_results_only";
		else route = "compact_then_truncate";
	}
	return {
		route,
		shouldCompact: route === "compact_only" || route === "compact_then_truncate",
		estimatedPromptTokens,
		pressureSource: pressure.source,
		promptBudgetBeforeReserve,
		overflowTokens,
		toolResultReducibleChars,
		effectiveReserveTokens
	};
}
/** Formats the compact operator log line for one pre-prompt budget check. */
function formatPrePromptPrecheckLog(params) {
	const { result } = params;
	return `[context-overflow-precheck] pre-prompt check sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"} provider=${params.provider}/${params.modelId} route=${result.route} estimatedPromptTokens=${result.estimatedPromptTokens} pressureSource=${result.pressureSource ?? "unknown"} promptBudgetBeforeReserve=${result.promptBudgetBeforeReserve} overflowTokens=${result.overflowTokens} toolResultReducibleChars=${result.toolResultReducibleChars} reserveTokens=${params.reserveTokens} effectiveReserveTokens=${result.effectiveReserveTokens} contextTokenBudget=${params.contextTokenBudget} messages=${params.messageCount} unwindowedMessages=${params.unwindowedMessageCount ?? params.messageCount} sessionFile=${params.sessionFile}`;
}
/** Converts the pre-prompt decision into the persisted session context-budget status record. */
function buildPrePromptContextBudgetStatus(params) {
	const { result } = params;
	const remainingPromptBudgetTokens = Math.max(0, result.promptBudgetBeforeReserve - result.estimatedPromptTokens);
	return {
		schemaVersion: 1,
		source: "pre-prompt-estimate",
		updatedAt: params.now ?? Date.now(),
		provider: params.provider,
		model: params.modelId,
		route: result.route,
		shouldCompact: result.shouldCompact,
		estimatedPromptTokens: result.estimatedPromptTokens,
		contextTokenBudget: Math.max(1, Math.floor(params.contextTokenBudget)),
		promptBudgetBeforeReserve: result.promptBudgetBeforeReserve,
		reserveTokens: Math.max(0, Math.floor(params.reserveTokens)),
		effectiveReserveTokens: result.effectiveReserveTokens,
		remainingPromptBudgetTokens,
		overflowTokens: result.overflowTokens,
		toolResultReducibleChars: result.toolResultReducibleChars,
		messageCount: Math.max(0, Math.floor(params.messageCount)),
		unwindowedMessageCount: Math.max(0, Math.floor(params.unwindowedMessageCount ?? params.messageCount)),
		...params.sessionId ? { sessionId: params.sessionId } : {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/agent-end-context.ts
function buildEmbeddedForegroundPromptContext(run, agentDir) {
	const callerOrigin = run.cronCreatorAuthorityCapability?.callerOrigin;
	const sessionKey = run.sessionKey?.trim() || run.sessionId;
	const sandboxSessionKey = run.sandboxSessionKey?.trim() || sessionKey;
	return {
		agentId: run.agentId,
		agentDir,
		workspaceDir: run.workspaceDir,
		cwd: run.cwd,
		sandboxSessionKey,
		sandboxAgentId: run.sandboxAgentId ?? (sandboxSessionKey === sessionKey ? run.agentId : void 0),
		promptCacheKey: run.promptCacheKey,
		reasoningLevel: run.reasoningLevel,
		messageChannel: run.messageChannel,
		messageProvider: run.messageProvider,
		clientCaps: run.clientCaps,
		gatewayUiCommandTarget: run.gatewayUiCommandTarget,
		toolBindings: run.toolBindings,
		chatType: run.chatType,
		agentAccountId: run.agentAccountId,
		trigger: run.trigger,
		messageTo: run.messageTo,
		messageThreadId: run.messageThreadId,
		conversationToolPolicy: run.conversationToolPolicy,
		groupId: run.groupId,
		groupChannel: run.groupChannel,
		groupSpace: run.groupSpace,
		memberRoleIds: run.memberRoleIds,
		messageActionTurnCapability: run.messageActionTurnCapability,
		spawnedBy: run.spawnedBy,
		isCanonicalWorkspace: run.isCanonicalWorkspace,
		senderId: run.senderId,
		senderName: run.senderName,
		senderUsername: run.senderUsername,
		senderE164: run.senderE164,
		senderIsOwner: run.senderIsOwner,
		approvalReviewerDeviceId: run.approvalReviewerDeviceId,
		currentChannelId: run.currentChannelId,
		chatId: run.chatId,
		channelContext: run.channelContext,
		currentMessagingTarget: run.currentMessagingTarget,
		currentThreadTs: run.currentThreadTs,
		currentMessageId: run.currentMessageId,
		currentInboundAudio: run.currentInboundAudio,
		replyToMode: run.replyToMode,
		requireExplicitMessageTarget: run.requireExplicitMessageTarget,
		disableMessageTool: run.disableMessageTool,
		githubPublicationAvailable: run.githubPublicationAvailable,
		conversationRecall: run.conversationRecall,
		toolOverrides: run.toolOverrides,
		permissionMode: run.permissionMode,
		execOverrides: run.execOverrides,
		skillsSnapshot: run.skillsSnapshot,
		currentInboundEventKind: run.currentInboundEventKind,
		clientTools: run.clientTools,
		disableTools: run.disableTools,
		contextWindow: run.contextWindow,
		promptMode: run.promptMode,
		forceMessageTool: run.forceMessageTool,
		enableHeartbeatTool: run.enableHeartbeatTool,
		forceHeartbeatTool: run.forceHeartbeatTool,
		allowGatewaySubagentBinding: run.allowGatewaySubagentBinding,
		extraSystemPrompt: run.extraSystemPrompt,
		gitCoauthorPrompt: run.gitCoauthorPrompt,
		sourceReplyDeliveryMode: run.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: run.taskSuggestionDeliveryMode,
		silentReplyPromptMode: run.silentReplyPromptMode,
		ownerNumbers: run.ownerNumbers,
		toolsAllow: run.toolsAllow,
		runtimePluginToolGrant: run.runtimePluginToolGrant,
		inputProvenance: run.inputProvenance,
		scheduledToolPolicy: run.scheduledToolPolicy,
		modelThinkingCapability: run.modelThinkingCapability,
		modelFallbacksOverride: run.modelFallbacksOverride,
		...callerOrigin && callerOrigin.kind !== "unknown" ? { cronCreatorCallerOrigin: callerOrigin } : {}
	};
}
function buildEmbeddedAgentEndContext(params) {
	const run = params.run;
	return {
		runId: run.runId,
		trace: params.trace,
		agentId: params.agentId,
		sessionKey: run.sessionKey,
		sessionId: run.sessionId,
		workspaceDir: run.workspaceDir,
		modelProviderId: run.provider,
		modelId: run.modelId,
		modelContextWindowTokens: run.contextTokenBudget ?? run.model.contextWindow,
		foregroundPromptContext: buildEmbeddedForegroundPromptContext({
			...run,
			agentId: params.agentId
		}, params.agentDir),
		authProfileId: run.authProfileId,
		skillWorkshopAvailable: params.skillWorkshopAvailable,
		compacted: params.compacted,
		trigger: run.trigger,
		...run.config ? { config: run.config } : {},
		...buildAgentHookContextChannelFields(run),
		...buildAgentHookContextIdentityFields({
			trigger: run.trigger,
			senderId: run.senderId,
			chatId: run.chatId,
			channelContext: run.channelContext
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-run-context.ts
/**
* Builds the shared tool-run context for embedded and plugin harness attempts.
*/
function buildEmbeddedAttemptToolRunContext(params) {
	const { currentInboundAudio, replyOperation } = params;
	const runtimeToolAllowlist = mergeForcedEmbeddedAttemptToolsAllow(params.toolsAllow, {
		forceMessageTool: params.forceMessageTool,
		forceToolNames: params.swarmCollector && params.swarmOutputSchema ? ["structured_output"] : void 0
	});
	return {
		clientCaps: params.clientCaps,
		gatewayUiCommandTarget: params.gatewayUiCommandTarget,
		pinnedWidgetAuthoring: params.pinnedWidgetAuthoring,
		toolBindings: params.toolBindings,
		chatType: params.chatType,
		agentAccountId: params.agentAccountId,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		nativeChannelId: params.chatId,
		messageActionTurnCapability: params.messageActionTurnCapability,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		scheduledToolPolicy: params.scheduledToolPolicy,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		currentChannelId: params.currentChannelId,
		currentMessagingTarget: params.currentMessagingTarget,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		replyToMode: params.replyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		requesterThinkingLevel: params.thinkLevel,
		requesterModel: params.model ? {
			provider: params.model.provider,
			model: params.model.id
		} : void 0,
		trigger: params.trigger,
		jobId: params.jobId,
		memoryFlushWritePath: params.memoryFlushWritePath,
		swarmCollector: params.swarmCollector,
		swarmOutputSchema: params.swarmOutputSchema,
		currentInboundAudio,
		hasCurrentInboundAudio: () => currentInboundAudio === true || replyOperation?.acceptedSteeredInboundAudio === true,
		...runtimeToolAllowlist ? { runtimeToolAllowlist } : {},
		...params.conversationToolPolicy ? { conversationToolPolicy: params.conversationToolPolicy } : {},
		...params.trace ? { trace: freezeDiagnosticTraceContext(params.trace) } : {}
	};
}
//#endregion
//#region src/agents/harness/settled-turn-finalization-outcome.ts
/** A normally stopped finalizer exhausted its visible answer without failing or using tools. */
var EmptySettledTurnFinalizationError = class extends Error {
	constructor(result) {
		super("Settled-turn finalization completed without a visible answer");
		this.result = result;
		this.name = "EmptySettledTurnFinalizationError";
	}
};
//#endregion
//#region src/agents/harness/settled-turn-finalization-result.ts
const ALLOWED_SETTLED_FINALIZATION_RESULT_KEYS = /* @__PURE__ */ new Set([
	"assistant",
	"usage",
	"assistantTranscriptOwned",
	"assistantTranscriptIdempotencyKey",
	"assistantMessageIndex",
	"diagnosticTrace"
]);
function assistantContainsToolCall(assistant) {
	return assistant.content.some((block) => block !== null && typeof block === "object" && block.type === "toolCall");
}
/**
* Validates the deliberately narrow finalizer result before core turns it into
* a terminal reply. Capability and delivery fields cannot cross this contract.
*/
function assertSettledTurnFinalizationResult(result) {
	const unknownKey = Object.keys(result).find((key) => !ALLOWED_SETTLED_FINALIZATION_RESULT_KEYS.has(key));
	if (unknownKey) throw new Error(`Settled-turn finalization returned unsupported result field: ${unknownKey}`);
	if (!result.assistant || result.assistant.role !== "assistant") throw new Error("Settled-turn finalization did not return an assistant message");
	if (result.assistant.stopReason === "toolUse" || assistantContainsToolCall(result.assistant)) throw new Error("Settled-turn finalization returned a tool call");
	if (result.assistant.stopReason !== "stop") throw new Error(`Settled-turn finalization returned unsuccessful stop reason: ${result.assistant.stopReason}`);
	if (result.assistantMessageIndex !== void 0 && (!Number.isSafeInteger(result.assistantMessageIndex) || result.assistantMessageIndex < 0)) throw new Error("Settled-turn finalization returned an invalid assistant message index");
	resolveSettledTurnFinalizationText(result);
	return result;
}
function resolveSettledTurnFinalizationText(result) {
	const text = resolveFinalAssistantVisibleText(result.assistant);
	if (!text || isSilentReplyText(text)) throw new EmptySettledTurnFinalizationError(result);
	return text;
}
/**
* Projects a harness-owned full attempt engine into the narrow finalization
* contract, rejecting canonical failure or capability evidence first.
*/
function projectSettledTurnFinalizationAttemptResult(result) {
	if (("terminal" in result ? result.terminal : normalizeAgentRunAttemptTerminal(result)).kind !== "ok" || (result.compactionCount ?? 0) > 0 || result.promptTimeoutOutcome || result.preflightRecovery || result.beforeAgentFinalizeRevisionReason || result.codexAppServerFailure || result.cloudCodeAssistFormatError) throw new Error("Settled-turn finalization attempt did not complete successfully");
	if (result.toolMetas.length > 0 || result.itemLifecycle.startedCount > 0 || result.itemLifecycle.completedCount > 0 || result.itemLifecycle.activeCount > 0 || result.replayMetadata.hadPotentialSideEffects || !result.replayMetadata.replaySafe || result.currentAttemptReplayMetadata?.hadPotentialSideEffects || result.currentAttemptReplayMetadata && !result.currentAttemptReplayMetadata.replaySafe || (result.clientToolCalls?.length ?? 0) > 0 || (result.acceptedSessionSpawns?.length ?? 0) > 0 || result.didSendViaMessagingTool || result.didDeliverSourceReplyViaMessageTool || result.didSendDeterministicApprovalPrompt || result.messagingToolSentTexts.length > 0 || result.messagingToolSentMediaUrls.length > 0 || result.messagingToolSentTargets.length > 0 || (result.messagingToolSourceReplyPayloads?.length ?? 0) > 0 || result.heartbeatToolResponse || (result.toolMediaUrls?.length ?? 0) > 0 || (result.hostOwnedToolMediaUrls?.length ?? 0) > 0 || result.toolAudioAsVoice || result.toolTrustedLocalMedia || result.hasToolMediaBlockReply || result.lastToolError || (result.successfulCronAdds ?? 0) > 0 || result.yieldDetected) throw new Error("Settled-turn finalization attempt reported capability activity");
	const assistant = result.currentAttemptCompletedAssistant;
	if (!assistant) throw new Error("Settled-turn finalization attempt returned no completed assistant message");
	return assertSettledTurnFinalizationResult({
		assistant,
		...result.attemptUsage ? { usage: result.attemptUsage } : {},
		...result.assistantTranscriptOwned ? {
			assistantTranscriptOwned: true,
			...result.assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey: result.assistantTranscriptIdempotencyKey } : {}
		} : result.lastAssistantTextMessageIndex !== void 0 ? { assistantMessageIndex: result.lastAssistantTextMessageIndex } : {},
		...result.diagnosticTrace ? { diagnosticTrace: result.diagnosticTrace } : {}
	});
}
//#endregion
export { buildEmbeddedAttemptToolRunContext as a, PREEMPTIVE_OVERFLOW_ERROR_TEXT as c, estimateRenderedLlmBoundaryTokenPressure as d, estimateToolSchemaTokenPressure as f, EmptySettledTurnFinalizationError as i, buildPrePromptContextBudgetStatus as l, shouldPreemptivelyCompactBeforePrompt as m, projectSettledTurnFinalizationAttemptResult as n, buildEmbeddedAgentEndContext as o, formatPrePromptPrecheckLog as p, resolveSettledTurnFinalizationText as r, buildEmbeddedForegroundPromptContext as s, assertSettledTurnFinalizationResult as t, estimateLlmBoundaryTokenPressure as u };

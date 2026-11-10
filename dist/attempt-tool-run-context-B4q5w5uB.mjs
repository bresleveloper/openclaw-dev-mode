import { O as freezeDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { n as buildEmbeddedAgentHookContext } from "./transcript-policy-DzNWptYX.mjs";
//#region src/agents/embedded-agent-runner/run/shared-run-context.ts
function projectEmbeddedMessageContext(run) {
	return {
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
		replyToMode: run.replyToMode
	};
}
function projectTrajectorySessionTarget(target, omitMissing = false) {
	const sessionTarget = target?.agentId && target.sessionId && target.sessionKey && target.storePath ? {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	} : void 0;
	return omitMissing && !sessionTarget ? {} : { sessionTarget };
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
		...projectEmbeddedMessageContext(run),
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
		...buildEmbeddedAgentHookContext(run, params.agentId, params.trace),
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
		...run.config ? { config: run.config } : {}
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
		requesterThinkingExplicit: params.thinkingExplicit,
		requesterModel: params.model ? {
			provider: params.model.provider,
			model: params.model.id
		} : void 0,
		trigger: params.trigger,
		continuesConversation: params.continuesConversation,
		jobId: params.jobId,
		memoryFlushWritePath: params.memoryFlushWritePath,
		memoryFlushTools: params.memoryFlushTools,
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
export { projectTrajectorySessionTarget as a, projectEmbeddedMessageContext as i, buildEmbeddedAgentEndContext as n, buildEmbeddedForegroundPromptContext as r, buildEmbeddedAttemptToolRunContext as t };

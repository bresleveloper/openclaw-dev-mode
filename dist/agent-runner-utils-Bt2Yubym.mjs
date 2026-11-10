import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { T as selectApplicableRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { i as prepareModelRunCapabilities, n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { a as readUserTurnPromptReactionSource } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { c as resolveMessageActionTurnCapabilityLifetime, n as isTrustedMessageActionTurnIngress, r as mintMessageActionTurnCapability } from "./message-action-turn-capability-CbQswcwc.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import "./plugins-CCVkYF8m.mjs";
import { n as readChannelSourceTurnId } from "./source-turn-id-DjBP_DbU.mjs";
import "./config-B3oiWDlr.mjs";
import { a as resolveCandidateThinkingLevel, r as normalizeThinkingCatalogProviders } from "./thinking-runtime-DuxsJR5q.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { t as hasInboundAudio } from "./inbound-media-D9dVgt41.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-BwhrEsoP.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DV-G0hQT.mjs";
import { n as getAgentRuntimeOptionalCommandSecretPaths, t as getAgentRuntimeCommandSecretTargetIds, u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-C_0e9XHi.mjs";
import { t as resolveMessageSecretScope } from "./message-secret-scope-CPKk7Eg6.mjs";
import { t as isReasoningTagProvider } from "./provider-utils-COpzPMT_.mjs";
import { c as resolveRunModelHasVision, o as resolveModelFallbackOptions, r as buildReplyRunStateParams, s as resolveReplyScheduledToolPolicy } from "./agent-runner-run-params-BV7fcOwA.mjs";
//#region src/auto-reply/reply/agent-runner-auth-profile.ts
/** Keeps an auth profile only when the current provider shares the primary auth scope. */
function resolveRunAuthProfile(run, provider, params) {
	const { provider: primaryProvider, authProfileId: requestedAuthProfileId, authProfileIdSource } = run;
	const aliasParams = {
		config: params?.config ?? run.config,
		workspaceDir: run.workspaceDir
	};
	const providerId = normalizeProviderId(provider);
	const primaryProviderId = normalizeProviderId(primaryProvider);
	const authProfileId = providerId !== "" && providerId === primaryProviderId || resolveProviderIdForAuth(provider, aliasParams) === resolveProviderIdForAuth(primaryProvider, aliasParams) ? requestedAuthProfileId : void 0;
	return {
		authProfileId,
		authProfileIdSource: authProfileId ? authProfileIdSource : void 0
	};
}
/** Applies an auto-fallback probe's pinned auth to its fallback candidate. */
function resolveFallbackCandidateRun(run, provider, model) {
	const probe = run.autoFallbackPrimaryProbe;
	const isPrimaryProbeCandidate = probe && provider === probe.provider && model === probe.model;
	if (!probe || provider !== probe.fallbackProvider || isPrimaryProbeCandidate || !probe.fallbackAuthProfileId) return run;
	const candidateRun = {
		...run,
		provider,
		model,
		authProfileId: probe.fallbackAuthProfileId
	};
	if (probe.fallbackAuthProfileIdSource) candidateRun.authProfileIdSource = probe.fallbackAuthProfileIdSource;
	else delete candidateRun.authProfileIdSource;
	return candidateRun;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-utils.ts
function resolveQueuedReplyRuntimeConfig(config) {
	return selectApplicableRuntimeConfig({
		inputConfig: config,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? config;
}
async function resolveQueuedReplyExecutionConfig(config, params) {
	const runtimeConfig = resolveQueuedReplyRuntimeConfig(config);
	const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
		config: runtimeConfig,
		commandName: "reply",
		targetIds: getAgentRuntimeCommandSecretTargetIds({ config: runtimeConfig }),
		optionalActivePaths: getAgentRuntimeOptionalCommandSecretPaths(runtimeConfig)
	});
	const baseResolvedConfig = resolvedConfig ?? runtimeConfig;
	const scope = resolveMessageSecretScope({
		channel: params?.originatingChannel,
		fallbackChannel: params?.messageProvider,
		accountId: params?.originatingAccountId,
		fallbackAccountId: params?.agentAccountId
	});
	if (!scope.channel) return baseResolvedConfig;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: baseResolvedConfig,
		channel: scope.channel,
		accountId: scope.accountId
	});
	if (scopedTargets.targetIds.size === 0) return baseResolvedConfig;
	return (await resolveCommandSecretRefsViaGateway({
		config: baseResolvedConfig,
		commandName: "reply",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}
	})).resolvedConfig ?? baseResolvedConfig;
}
function buildThreadingToolContext(params) {
	const { sessionCtx, config, hasRepliedRef } = params;
	const currentMessageId = sessionCtx.InputProvenance?.kind === "internal_system" && sessionCtx.InputProvenance.sourceTool === "restart-sentinel" ? sessionCtx.ReplyToId : isInternalMessageChannel(sessionCtx.Provider ?? sessionCtx.Surface) ? void 0 : sessionCtx.MessageSidFull ?? sessionCtx.MessageSid;
	const currentSourceTurnId = readChannelSourceTurnId(sessionCtx);
	const originProvider = resolveOriginMessageProvider({
		originatingChannel: sessionCtx.OriginatingChannel,
		provider: sessionCtx.Provider
	});
	const originTo = sessionCtx.OriginatingTo ?? sessionCtx.To;
	const rawProvider = config ? normalizeOptionalLowercaseString(originProvider) : void 0;
	if (!config || !rawProvider) return {
		currentMessageId,
		currentSourceTurnId,
		replyToMode: sessionCtx.ReplyToMode
	};
	const provider = normalizeChatChannelId(rawProvider) ?? normalizeAnyChannelId(rawProvider);
	const threading = provider ? getChannelPlugin(provider)?.threading : void 0;
	const context = threading?.buildToolContext ? threading.buildToolContext({
		cfg: config,
		accountId: sessionCtx.AccountId,
		context: {
			Channel: originProvider,
			From: sessionCtx.From,
			To: originTo,
			ChatType: sessionCtx.ChatType,
			CurrentMessageId: currentMessageId,
			ReplyToMode: sessionCtx.ReplyToMode,
			ReplyToId: sessionCtx.ReplyToId,
			ReplyToIdFull: sessionCtx.ReplyToIdFull,
			ThreadLabel: sessionCtx.ThreadLabel,
			MessageThreadId: sessionCtx.MessageThreadId,
			TransportThreadId: sessionCtx.TransportThreadId,
			NativeChannelId: sessionCtx.NativeChannelId
		},
		hasRepliedRef
	}) ?? {} : {
		currentChannelId: normalizeOptionalString(originTo),
		hasRepliedRef
	};
	const hasAdapterCurrentMessageId = Object.hasOwn(context, "currentMessageId");
	return {
		...context,
		currentChannelProvider: provider ?? rawProvider,
		currentMessageId: hasAdapterCurrentMessageId ? context.currentMessageId : currentMessageId,
		currentSourceTurnId,
		replyToMode: context.replyToMode ?? sessionCtx.ReplyToMode
	};
}
function resolveFollowupCurrentMessageId(queued) {
	return queued.run.inputProvenance?.kind === "internal_system" && queued.run.inputProvenance.sourceTool === "restart-sentinel" ? queued.originatingReplyToId : queued.messageId;
}
/** Remaps the original inline request without reusing a queued model's clamped level. */
function resolveRunThinkingLevelForFallbackCandidate(params) {
	const { run, ...candidate } = params;
	return resolveCandidateThinkingLevel({
		...candidate,
		level: run.thinkLevelOverride === "default" ? run.thinkLevel : run.thinkLevelOverride ?? run.thinkLevel
	});
}
function resolveRunFastModeForFallbackCandidate(params) {
	const state = resolveFastModeState({
		cfg: params.config,
		provider: params.provider,
		model: params.model,
		agentId: params.run.agentId,
		sessionEntry: params.sessionEntry
	});
	return {
		fastMode: params.run.fastModeOverride ? params.run.fastMode : state.requestMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSecondsOverride ? params.run.fastModeAutoOnSeconds : state.fastAutoOnSeconds
	};
}
function applyReplyRouteToTemplate(params) {
	return {
		...params.sessionCtx,
		OriginatingChannel: params.replyRoute?.originatingChannel ?? params.sessionCtx.OriginatingChannel,
		OriginatingTo: params.replyRoute?.originatingTo ?? params.sessionCtx.OriginatingTo,
		AccountId: params.replyRoute?.originatingAccountId ?? params.sessionCtx.AccountId ?? params.run.agentAccountId,
		ChatType: normalizeChatType(params.replyRoute?.originatingChatType) ?? normalizeChatType(params.sessionCtx.ChatType) ?? params.run.chatType,
		MessageThreadId: params.replyRoute?.originatingThreadId ?? params.sessionCtx.MessageThreadId,
		ReplyToId: params.replyRoute?.originatingReplyToId ?? params.sessionCtx.ReplyToId,
		ReplyToMode: params.replyRoute?.originatingReplyToMode ?? params.sessionCtx.ReplyToMode
	};
}
/**
* Builds message-tool threading context for the queued reply route. Embedded
* and CLI runtimes share it so the channel adapter decides the default thread.
*/
function buildReplyRouteThreadingToolContext(params) {
	return buildThreadingToolContext({
		sessionCtx: applyReplyRouteToTemplate(params),
		config: params.run.config,
		hasRepliedRef: params.hasRepliedRef
	});
}
function buildEmbeddedContextFromTemplate(params) {
	const sessionCtx = applyReplyRouteToTemplate(params);
	return {
		sessionId: params.run.sessionId,
		sessionKey: params.run.sessionKey,
		sandboxSessionKey: params.run.runtimePolicySessionKey,
		agentId: params.run.agentId,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: sessionCtx.OriginatingChannel,
			provider: sessionCtx.Provider
		}),
		...sessionCtx.ChatType ? { chatType: sessionCtx.ChatType } : {},
		agentAccountId: sessionCtx.AccountId,
		conversationRoutePeerId: params.run.conversationRoutePeerId,
		messageTo: sessionCtx.OriginatingTo ?? sessionCtx.To,
		messageThreadId: sessionCtx.MessageThreadId ?? void 0,
		chatId: normalizeOptionalString(sessionCtx.NativeChannelId) ?? normalizeOptionalString(sessionCtx.ChatId),
		memberRoleIds: normalizeOptionalTrimmedStringList(sessionCtx.MemberRoleIds),
		...buildThreadingToolContext({
			sessionCtx,
			config: params.run.config,
			hasRepliedRef: params.hasRepliedRef
		}),
		currentInboundAudio: hasInboundAudio(sessionCtx)
	};
}
function buildTemplateSenderContext(sessionCtx) {
	return {
		senderId: normalizeOptionalString(sessionCtx.SenderId),
		channelContext: sessionCtx.ChannelContext,
		senderName: normalizeOptionalString(sessionCtx.SenderName),
		senderUsername: normalizeOptionalString(sessionCtx.SenderUsername),
		senderE164: normalizeOptionalString(sessionCtx.SenderE164)
	};
}
/** Reuse the candidate's channel and sender projection for early model routing. */
function buildModelResolveContext(params) {
	const context = {
		...buildEmbeddedContextFromTemplate(params),
		...buildTemplateSenderContext(params.sessionCtx),
		...buildReplyRunStateParams(params.run),
		trigger: params.trigger
	};
	return {
		trigger: context.trigger,
		...buildAgentHookContextChannelFields(context),
		...buildAgentHookContextIdentityFields(context)
	};
}
/** Bind either runtime to the same trusted source turn and requester. */
function mintReplyMessageActionTurnCapability(turn, runId) {
	if (turn.followupRun.run.internalEventExecution) return;
	const channelIngress = isTrustedMessageActionTurnIngress(turn.sessionCtx.Provider);
	const dashboardAdmission = turn.opts?.dashboardReadAdmission;
	if (turn.isHeartbeat || !channelIngress && turn.sessionCtx.Provider !== "webchat") return;
	const context = buildEmbeddedContextFromTemplate({
		run: turn.followupRun.run,
		replyRoute: turn.followupRun,
		sessionCtx: turn.sessionCtx,
		hasRepliedRef: turn.opts?.hasRepliedRef
	});
	const sessionKey = turn.runtimePolicySessionKey ?? context.sessionKey;
	if (!context.agentId || !sessionKey) return;
	if (!channelIngress) {
		const dashboard = dashboardAdmission?.runId === runId && dashboardAdmission.agentId === context.agentId && dashboardAdmission.sessionKey === sessionKey && dashboardAdmission.sessionId === context.sessionId ? dashboardAdmission : void 0;
		const recorder = turn.followupRun.userTurnTranscriptRecorder;
		const source = readUserTurnPromptReactionSource(recorder);
		const promptSource = source && source.agentId === context.agentId && source.sessionKey === sessionKey ? source : void 0;
		if (!dashboard && !promptSource) return;
		dashboard?.assertCurrent();
		promptSource?.assertCurrent();
		return mintMessageActionTurnCapability({
			agentId: context.agentId,
			runId,
			sessionKey,
			sessionId: context.sessionId,
			assertDashboardReadCurrent: dashboard?.assertCurrent,
			promptReactionSource: promptSource && recorder ? {
				source: promptSource,
				recorder
			} : void 0,
			expiresWithRun: true
		});
	}
	if (!context.messageProvider || !context.currentChannelId) return;
	const sender = buildTemplateSenderContext(turn.sessionCtx);
	return mintMessageActionTurnCapability({
		agentId: context.agentId,
		runId,
		sessionKey,
		sourceReplySessionKey: context.sessionKey,
		sessionId: context.sessionId,
		requesterAccountId: context.agentAccountId,
		requesterSenderId: sender.senderId,
		requesterSenderName: sender.senderName,
		requesterSenderUsername: sender.senderUsername,
		requesterSenderE164: sender.senderE164,
		toolContext: {
			currentChannelId: context.currentChannelId,
			currentChatType: context.chatType,
			currentMessagingTarget: context.currentMessagingTarget,
			currentGraphChannelId: context.currentGraphChannelId,
			currentChannelProvider: context.currentChannelProvider,
			currentThreadTs: context.currentThreadTs,
			currentMessageId: context.currentMessageId,
			currentSourceTurnId: context.currentSourceTurnId,
			replyToMode: context.replyToMode,
			hasRepliedRef: context.hasRepliedRef,
			sameChannelThreadRequired: context.sameChannelThreadRequired
		},
		...resolveMessageActionTurnCapabilityLifetime(turn.followupRun.run.timeoutMs)
	});
}
async function buildEmbeddedRunExecutionParams(params) {
	const authProfile = resolveRunAuthProfile(params.run, params.provider);
	const embeddedContext = buildEmbeddedContextFromTemplate(params);
	const senderContext = buildTemplateSenderContext(params.sessionCtx);
	const snapshot = { ...params };
	const config = snapshot.run.config;
	const automation = snapshot.run.scheduledAutomation;
	automation?.assertCurrent();
	const job = automation?.job;
	const scheduledToolPolicy = resolveReplyScheduledToolPolicy(snapshot.run);
	const { modelFallbackAvailability, fallbacksOverride: modelFallbacksOverride } = resolveModelFallbackOptions(snapshot.run);
	let modelThinkingCapability;
	if (snapshot.agentRuntime) {
		const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
		const observedCatalog = normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
			config,
			provider: snapshot.provider,
			model: snapshot.model,
			agentRuntime: snapshot.agentRuntime,
			agentId: snapshot.run.agentId,
			agentDir: snapshot.run.agentDir,
			workspaceDir: snapshot.run.workspaceDir
		}));
		const thinkingCatalog = findModelInCatalog(observedCatalog, snapshot.provider, snapshot.model) ? observedCatalog : snapshot.run.thinkingCatalog;
		modelThinkingCapability = prepareModelRunCapabilities([thinkingCatalog, []], [
			snapshot.provider,
			snapshot.model,
			snapshot.agentRuntime
		]).modelThinkingCapability;
	}
	const enforceFinalTag = !snapshot.run.skipProviderRuntimeHints && (snapshot.run.enforceFinalTag || isReasoningTagProvider(snapshot.provider, {
		config,
		workspaceDir: snapshot.run.workspaceDir,
		modelId: snapshot.model
	}));
	const modelHasVision = await resolveRunModelHasVision(snapshot);
	automation?.assertCurrent();
	return {
		...embeddedContext,
		...senderContext,
		...buildReplyRunStateParams(snapshot.run),
		providerReviewAcknowledgment: snapshot.run.providerReviewAcknowledgment,
		permissionMode: snapshot.run.permissionMode,
		sessionRoot: snapshot.run.sessionRoot,
		agentDir: snapshot.run.agentDir,
		config,
		trustedInternalHandoff: snapshot.run.trustedInternalHandoff,
		scheduledToolPolicy,
		...job ? {
			jobId: job.id,
			scheduledRuntimeAuthority: job.runtimeAuthority,
			scheduledRuntimeAuthorityRecoveryRequired: job.runtimeAuthorityRecoveryRequired === true
		} : {},
		runtimePluginToolGrant: snapshot.run.runtimePluginToolGrant,
		enforceFinalTag,
		silentExpected: snapshot.run.silentExpected,
		silentReplyPromptMode: snapshot.run.silentReplyPromptMode,
		sourceReplyDeliveryMode: snapshot.run.sourceReplyDeliveryMode,
		toolBindings: snapshot.run.toolBindings,
		skillLibraryAuthoring: snapshot.run.skillLibraryAuthoring,
		provider: snapshot.provider,
		model: snapshot.model,
		modelHasVision,
		...modelThinkingCapability ? { modelThinkingCapability } : {},
		requestedRouteResolution: "resolved",
		modelSelectionLocked: snapshot.run.modelSelectionLocked,
		modelFallbackAvailability,
		modelFallbacksOverride,
		...authProfile,
		thinkLevel: snapshot.run.thinkLevel,
		thinkingExplicit: snapshot.run.thinkingExplicit,
		fastMode: snapshot.run.fastMode,
		fastModeAutoOnSeconds: snapshot.run.fastModeAutoOnSeconds,
		verboseLevel: snapshot.run.verboseLevel,
		reasoningLevel: snapshot.run.reasoningLevel,
		execOverrides: snapshot.run.execOverrides,
		bashElevated: snapshot.run.bashElevated,
		timeoutMs: snapshot.run.timeoutMs,
		runTimeoutOverrideMs: snapshot.run.runTimeoutOverrideMs,
		runId: snapshot.runId,
		promptCacheKey: snapshot.promptCacheKey,
		allowTransientCooldownProbe: snapshot.allowTransientCooldownProbe
	};
}
//#endregion
export { mintReplyMessageActionTurnCapability as a, resolveQueuedReplyRuntimeConfig as c, resolveFallbackCandidateRun as d, resolveRunAuthProfile as f, buildThreadingToolContext as i, resolveRunFastModeForFallbackCandidate as l, buildModelResolveContext as n, resolveFollowupCurrentMessageId as o, buildReplyRouteThreadingToolContext as r, resolveQueuedReplyExecutionConfig as s, buildEmbeddedRunExecutionParams as t, resolveRunThinkingLevelForFallbackCandidate as u };

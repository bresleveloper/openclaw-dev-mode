import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { a as modelFallbackOverrideFromAvailability, m as resolveModelFallbackAvailability } from "./agent-scope-CG17uXFn.mjs";
import { a as resolveMergedModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-C5LPYz3z.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, w as selectApplicableRuntimeConfig } from "./runtime-snapshot-DYptB0Cf.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { i as prepareModelRunCapabilities, n as findModelInCatalog, r as modelSupportsInput } from "./model-catalog-lookup-vismCEk2.mjs";
import "./config-CzeZu5J_.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { i as normalizeThinkingCatalogProviders, o as resolveCandidateThinkingLevel, r as needsThinkHydration } from "./thinking-runtime-BwS3HC5I.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as hasInboundAudio } from "./inbound-media-ddGEX7sF.mjs";
import { n as readChannelSourceTurnId } from "./source-turn-id-7n3UiKJD.mjs";
import { n as mintMessageActionTurnCapability, o as resolveMessageActionTurnCapabilityLifetime, t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-BbHQ1t6i.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-yvWYa9hL.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DrqHZ423.mjs";
import { n as getAgentRuntimeOptionalCommandSecretPaths, t as getAgentRuntimeCommandSecretTargetIds, u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-CAzJsE9W.mjs";
import { t as resolveMessageSecretScope } from "./message-secret-scope-CfC2gSvy.mjs";
import { t as isReasoningTagProvider } from "./provider-utils-C9K47Jmh.mjs";
//#region src/auto-reply/reply/agent-runner-auth-profile.ts
/** Keeps an auth profile only when the current provider shares the primary auth scope. */
function resolveProviderScopedAuthProfile(params) {
	const aliasParams = {
		config: params.config,
		workspaceDir: params.workspaceDir
	};
	const providerId = normalizeProviderId(params.provider);
	const primaryProviderId = normalizeProviderId(params.primaryProvider);
	const authProfileId = providerId !== "" && providerId === primaryProviderId || resolveProviderIdForAuth(params.provider, aliasParams) === resolveProviderIdForAuth(params.primaryProvider, aliasParams) ? params.authProfileId : void 0;
	return {
		authProfileId,
		authProfileIdSource: authProfileId ? params.authProfileIdSource : void 0
	};
}
/** Resolves the auth profile override for a queued follow-up run. */
function resolveRunAuthProfile(run, provider, params) {
	return resolveProviderScopedAuthProfile({
		provider,
		primaryProvider: run.provider,
		authProfileId: run.authProfileId,
		authProfileIdSource: run.authProfileIdSource,
		config: params?.config ?? run.config,
		workspaceDir: run.workspaceDir
	});
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
//#region src/auto-reply/reply/agent-runner-run-params.ts
/** Builds embedded-agent run parameters from queued follow-up run state. */
/** Builds model fallback options for an embedded follow-up run. */
function resolveModelFallbackOptions(run, configOverride = run.config) {
	const config = configOverride;
	const modelFallbackAvailability = resolveModelFallbackAvailability({
		cfg: config,
		agentId: run.agentId,
		sessionKey: run.sessionKey,
		hasSessionModelOverride: run.hasSessionModelOverride === true,
		modelOverrideSource: run.modelOverrideSource,
		hasAutoFallbackProvenance: run.hasAutoFallbackProvenance === true,
		modelSelectionLocked: run.modelSelectionLocked,
		subagentSpawnLineage: run.subagentSpawnLineage
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
/** Builds the shared embedded-agent run params from a queued follow-up run. */
async function buildEmbeddedRunBaseParams(params) {
	const config = params.run.config;
	const { modelFallbackAvailability, fallbacksOverride: modelFallbacksOverride } = resolveModelFallbackOptions(params.run);
	let modelThinkingCapability;
	if (params.agentRuntime) {
		let thinkingCatalog = params.run.thinkingCatalog;
		if (needsThinkHydration(thinkingCatalog, params.provider, params.model, params.agentRuntime)) {
			const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
			thinkingCatalog = normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
				config,
				provider: params.provider,
				model: params.model,
				agentRuntime: params.agentRuntime,
				agentId: params.run.agentId,
				agentDir: params.run.agentDir,
				workspaceDir: params.run.workspaceDir
			}));
		}
		modelThinkingCapability = prepareModelRunCapabilities([thinkingCatalog, []], [
			params.provider,
			params.model,
			params.agentRuntime
		]).modelThinkingCapability;
	}
	const enforceFinalTag = !params.run.skipProviderRuntimeHints && (params.run.enforceFinalTag || isReasoningTagProvider(params.provider, {
		config,
		workspaceDir: params.run.workspaceDir,
		modelId: params.model
	}));
	return {
		providerReviewAcknowledgment: params.run.providerReviewAcknowledgment,
		sessionFile: params.run.sessionFile,
		workspaceDir: params.run.workspaceDir,
		cwd: params.run.cwd,
		permissionMode: params.run.permissionMode,
		sessionRoot: params.run.sessionRoot,
		agentDir: params.run.agentDir,
		config,
		toolOverrides: params.run.toolOverrides,
		skillsSnapshot: params.run.skillsSnapshot,
		ownerNumbers: params.run.ownerNumbers,
		inputProvenance: params.run.inputProvenance,
		trustedInternalHandoff: params.run.trustedInternalHandoff,
		scheduledToolPolicy: params.run.scheduledToolPolicy,
		runtimePluginToolGrant: params.run.runtimePluginToolGrant,
		senderIsOwner: params.run.senderIsOwner,
		conversationToolPolicy: params.run.conversationToolPolicy,
		channelContext: params.run.channelContext,
		approvalReviewerDeviceId: params.run.approvalReviewerDeviceId,
		enforceFinalTag,
		silentExpected: params.run.silentExpected,
		terminalReplyExpectation: params.run.terminalReplyExpectation,
		silentReplyPromptMode: params.run.silentReplyPromptMode,
		sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
		clientCaps: params.run.clientCaps,
		bootstrapUserProfileId: params.run.bootstrapUserProfileId,
		gatewayUiCommandTarget: params.run.gatewayUiCommandTarget,
		toolBindings: params.run.toolBindings,
		taskSuggestionDeliveryMode: params.run.taskSuggestionDeliveryMode,
		skillWorkshopProposalRevision: params.run.skillWorkshopProposalRevision,
		skillLibraryAuthoring: params.run.skillLibraryAuthoring,
		provider: params.provider,
		model: params.model,
		modelHasVision: await resolveRunModelHasVision(params),
		...modelThinkingCapability ? { modelThinkingCapability } : {},
		requestedRouteResolution: "resolved",
		modelSelectionLocked: params.run.modelSelectionLocked,
		modelFallbackAvailability,
		modelFallbacksOverride,
		...params.authProfile,
		thinkLevel: params.run.thinkLevel,
		fastMode: params.run.fastMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSeconds,
		verboseLevel: params.run.verboseLevel,
		reasoningLevel: params.run.reasoningLevel,
		execOverrides: params.run.execOverrides,
		bashElevated: params.run.bashElevated,
		timeoutMs: params.run.timeoutMs,
		runTimeoutOverrideMs: params.run.runTimeoutOverrideMs,
		runId: params.runId,
		promptCacheKey: params.promptCacheKey,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-utils.ts
/** Utilities for queued reply runtime config, auth, threading, and embedded run params. */
const BUN_FETCH_SOCKET_ERROR_RE = /socket connection was closed unexpectedly/i;
/** Selects the freshest runtime config usable by queued reply execution. */
function resolveQueuedReplyRuntimeConfig(config) {
	return selectApplicableRuntimeConfig({
		inputConfig: config,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? config;
}
/** Resolves command secrets for queued reply execution, scoped to the origin route. */
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
/** Builds channel threading context for message-tool replies. */
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
	if (!threading?.buildToolContext) return {
		currentChannelId: normalizeOptionalString(originTo),
		currentChannelProvider: provider ?? rawProvider,
		currentMessageId,
		currentSourceTurnId,
		replyToMode: sessionCtx.ReplyToMode,
		hasRepliedRef
	};
	const context = threading.buildToolContext({
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
	}) ?? {};
	const hasAdapterCurrentMessageId = Object.hasOwn(context, "currentMessageId");
	return {
		...context,
		currentChannelProvider: provider,
		currentMessageId: hasAdapterCurrentMessageId ? context.currentMessageId : currentMessageId,
		currentSourceTurnId,
		replyToMode: context.replyToMode ?? sessionCtx.ReplyToMode
	};
}
/** Detects Bun socket-close errors that should be formatted more clearly. */
const isBunFetchSocketError = (message) => message ? BUN_FETCH_SOCKET_ERROR_RE.test(message) : false;
/** Formats Bun socket-close errors for user-facing reply output. */
const formatBunFetchSocketError = () => "⚠️ Lost the connection to the AI service. Check the conversation before trying again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.";
/** Remaps the original inline request without reusing a queued model's clamped level. */
function resolveRunThinkingLevelForFallbackCandidate(params) {
	const { run, ...candidate } = params;
	return resolveCandidateThinkingLevel({
		...candidate,
		level: run.thinkLevelOverride === "default" ? run.thinkLevel : run.thinkLevelOverride ?? run.thinkLevel
	});
}
/** Resolves candidate-scoped fast mode after model fallback changes provider/model. */
function resolveRunFastModeForFallbackCandidate(params) {
	const state = resolveFastModeState({
		cfg: params.config,
		provider: params.provider,
		model: params.model,
		agentId: params.run.agentId,
		sessionEntry: params.sessionEntry
	});
	return {
		fastMode: params.run.fastModeOverride ? params.run.fastMode : state.mode,
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
/** Bind either runtime to the same trusted source turn and requester. */
function mintReplyMessageActionTurnCapability(turn, runId) {
	const channelIngress = isTrustedMessageActionTurnIngress(turn.sessionCtx.Provider);
	const dashboardAdmission = turn.opts?.dashboardReadAdmission;
	if (turn.isHeartbeat || !channelIngress && (turn.sessionCtx.Provider !== "webchat" || dashboardAdmission?.runId !== runId)) return;
	const context = buildEmbeddedContextFromTemplate({
		run: turn.followupRun.run,
		replyRoute: turn.followupRun,
		sessionCtx: turn.sessionCtx,
		hasRepliedRef: turn.opts?.hasRepliedRef
	});
	const sessionKey = turn.runtimePolicySessionKey ?? context.sessionKey;
	if (!context.agentId || !sessionKey) return;
	if (!channelIngress) {
		if (!dashboardAdmission || dashboardAdmission.agentId !== context.agentId || dashboardAdmission.sessionKey !== sessionKey || dashboardAdmission.sessionId !== context.sessionId) return;
		dashboardAdmission.assertCurrent();
		return mintMessageActionTurnCapability({
			agentId: context.agentId,
			runId,
			sessionKey,
			sessionId: context.sessionId,
			assertDashboardReadCurrent: dashboardAdmission.assertCurrent,
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
/** Builds execution-specific embedded run params for queued reply dispatch. */
async function buildEmbeddedRunExecutionParams(params) {
	const authProfile = resolveRunAuthProfile(params.run, params.provider);
	return {
		embeddedContext: buildEmbeddedContextFromTemplate(params),
		senderContext: buildTemplateSenderContext(params.sessionCtx),
		runBaseParams: await buildEmbeddedRunBaseParams({
			...params,
			authProfile
		})
	};
}
//#endregion
export { isBunFetchSocketError as a, resolveQueuedReplyRuntimeConfig as c, resolveModelFallbackOptions as d, resolveRunModelHasVision as f, formatBunFetchSocketError as i, resolveRunFastModeForFallbackCandidate as l, resolveRunAuthProfile as m, buildReplyRouteThreadingToolContext as n, mintReplyMessageActionTurnCapability as o, resolveFallbackCandidateRun as p, buildThreadingToolContext as r, resolveQueuedReplyExecutionConfig as s, buildEmbeddedRunExecutionParams as t, resolveRunThinkingLevelForFallbackCandidate as u };

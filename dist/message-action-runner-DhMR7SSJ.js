import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { a as shouldAttemptTtsPayload } from "./gateway-startup-speech-providers-CQCz_cL7.js";
import { a as actionHasTarget, o as actionRequiresTarget, r as applyTargetToParams } from "./channel-target-C1SvT627.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Z0pS5ykd.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./plugins-DnKj2WmH.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { m as loadSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { n as stripPlainTextToolCallBlocks } from "./payload-C252NdEX.js";
import { d as stripReasoningTagsFromText } from "./assistant-visible-text-C9MYLVs-.js";
import "./sessions-gBZPP61K.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BMyCREan.js";
import { t as parseInlineDirectives } from "./directive-tags-B64FytPi.js";
import { i as throwIfAborted } from "./deliver-ZdKYHVVL.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CBQ2d2jT.js";
import { a as hasReplyPayloadContent, c as normalizeInteractiveReply, l as normalizeMessagePresentation, n as hasMessagePresentationBlocks, t as hasInteractiveReplyBlocks } from "./payload-BCsfdv86.js";
import { T as readSnakeCaseParamRaw, b as readStringParam, g as readPositiveIntegerParam, v as readStringArrayParam } from "./common-B2QjWqqG.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-ChiBnsqP.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CLwm6Pqw.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-CV4vy0OO.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-BDdeIq2O.js";
import { u as stripUnsupportedCitationControlMarkers } from "./payloads-DE8cWmMT.js";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.js";
import { n as listConfiguredMessageChannels, r as resolveMessageChannelSelection } from "./channel-selection-DAY9l73H.js";
import { n as sendPoll, r as resolveOutboundMessageGatewayOptions, t as sendMessage } from "./message-C-f4rpm1.js";
import { n as resolveOutboundSessionRoute, t as ensureOutboundSessionEntry } from "./outbound-session-5hvmfFfz.js";
import { i as resolveChannelTarget } from "./target-resolver-BpCIOvtz.js";
import { a as normalizeSandboxMediaParams, c as readBooleanParam, i as normalizeSandboxMediaList, l as resolveAttachmentMediaPolicy, n as collectActionMediaSourceHints, o as parseInteractiveParam, r as hydrateAttachmentParamsForAction, s as parseJsonMessageParam, t as dispatchChannelMessageAction, u as resolveExtraActionMediaSourceParamKeys } from "./message-action-dispatch-Buy2liL_.js";
import { t as extractToolPayload } from "./tool-payload-DBiw68-o.js";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-ByuyydnL.js";
import { t as shouldUseInternalSourceReplySink } from "./internal-source-reply-CEDf9mNf.js";
import { i as enforceMessageActionAllowlist, n as buildCrossContextDecoration, o as resolveEffectiveMessageToolsConfig, r as enforceCrossContextPolicy, s as shouldApplyCrossContextMarker, t as applyCrossContextDecoration } from "./outbound-policy-CxvT5RkW.js";
//#region src/poll-params.ts
const SHARED_POLL_CREATION_PARAM_DEFS = {
	pollQuestion: { kind: "string" },
	pollOption: { kind: "stringArray" },
	pollDurationHours: { kind: "positiveInteger" },
	pollMulti: { kind: "boolean" }
};
const POLL_CREATION_PARAM_DEFS = SHARED_POLL_CREATION_PARAM_DEFS;
const SHARED_POLL_CREATION_PARAM_NAMES = Object.keys(SHARED_POLL_CREATION_PARAM_DEFS);
function readPollParamRaw(params, key) {
	return readSnakeCaseParamRaw(params, key);
}
const CONTENT_BEARING_SHARED_POLL_PARAM_NAMES = ["pollQuestion", "pollOption"];
function hasContentBearingPollCreationParam(params) {
	for (const key of CONTENT_BEARING_SHARED_POLL_PARAM_NAMES) {
		const def = POLL_CREATION_PARAM_DEFS[key];
		const value = readPollParamRaw(params, key);
		if (def.kind === "string" && typeof value === "string" && value.trim().length > 0) return true;
		if (def.kind === "stringArray") {
			if (Array.isArray(value) && value.some((entry) => typeof entry === "string" && entry.trim())) return true;
			if (typeof value === "string" && value.trim().length > 0) return true;
		}
	}
	return false;
}
function hasPollCreationParams(params) {
	return hasContentBearingPollCreationParam(params);
}
//#endregion
//#region src/shared/text/formatted-reasoning-message.ts
/** Strip provider-formatted Reasoning/Thinking preambles from visible text. */
function stripFormattedReasoningMessage(text) {
	const stripped = stripReasoningTagsFromText(text);
	const lines = stripped.split(/\r?\n/u);
	const prefix = lines[0]?.trim();
	if (prefix !== "Reasoning:" && !/^Thinking\.{0,3}$/u.test(prefix ?? "")) return stripped;
	if (/^Thinking\.{0,3}$/u.test(prefix ?? "")) {
		const trimmedBodyLine = lines.slice(1).find((line) => line.trim())?.trim() ?? "";
		if (!trimmedBodyLine || !(trimmedBodyLine.startsWith("_") && trimmedBodyLine.endsWith("_") && trimmedBodyLine.length >= 2)) return stripped;
	}
	let index = 1;
	while (index < lines.length) {
		const trimmed = lines[index]?.trim() ?? "";
		if (!trimmed || trimmed.startsWith("_") && trimmed.endsWith("_") && trimmed.length >= 2) {
			index += 1;
			continue;
		}
		break;
	}
	return lines.slice(index).join("\n").trim();
}
//#endregion
//#region src/infra/outbound/message-action-normalization.ts
/** Normalizes message-action args before target validation and dispatch. */
function normalizeMessageActionInput(params) {
	const normalizedArgs = { ...params.args };
	const { action, toolContext } = params;
	const explicitChannel = normalizeOptionalString(normalizedArgs.channel) ?? "";
	const inferredChannel = explicitChannel || normalizeMessageChannel(toolContext?.currentChannelProvider) || "";
	const explicitTarget = normalizeOptionalString(normalizedArgs.target) ?? "";
	const hasLegacyTargetFields = typeof normalizedArgs.to === "string" || typeof normalizedArgs.channelId === "string";
	const hasLegacyTarget = (normalizeOptionalString(normalizedArgs.to) ?? "").length > 0 || (normalizeOptionalString(normalizedArgs.channelId) ?? "").length > 0;
	if (explicitTarget && hasLegacyTargetFields) {
		delete normalizedArgs.to;
		delete normalizedArgs.channelId;
	}
	if (!explicitTarget && !hasLegacyTarget && actionRequiresTarget(action) && !actionHasTarget(action, normalizedArgs, { channel: inferredChannel })) {
		const inferredTarget = normalizeOptionalString(toolContext?.currentChannelId) ?? normalizeOptionalString(toolContext?.currentMessagingTarget);
		if (inferredTarget) normalizedArgs.target = inferredTarget;
	}
	if (!explicitTarget && actionRequiresTarget(action) && hasLegacyTarget) {
		const legacyTo = normalizeOptionalString(normalizedArgs.to) ?? "";
		const legacyChannelId = normalizeOptionalString(normalizedArgs.channelId) ?? "";
		const legacyTarget = legacyTo || legacyChannelId;
		if (legacyTarget) {
			normalizedArgs.target = legacyTarget;
			delete normalizedArgs.to;
			delete normalizedArgs.channelId;
		}
	}
	if (!explicitChannel) {
		if (inferredChannel && isDeliverableMessageChannel(inferredChannel)) normalizedArgs.channel = inferredChannel;
	}
	applyTargetToParams({
		action,
		args: normalizedArgs
	});
	if (actionRequiresTarget(action) && !actionHasTarget(action, normalizedArgs, { channel: inferredChannel })) throw new Error(`Action ${action} requires a target.`);
	return normalizedArgs;
}
//#endregion
//#region src/infra/outbound/message-action-threading.ts
function suppressesImplicitThreading(actionParams) {
	return actionParams.topLevel === true || actionParams.threadId === null;
}
/** Resolves and writes the outbound thread id used by message-action sends. */
function resolveAndApplyOutboundThreadId(actionParams, context) {
	const threadId = readStringParam(actionParams, "threadId");
	if (!threadId && suppressesImplicitThreading(actionParams)) return;
	const replyToId = readStringParam(actionParams, "replyTo");
	const autoResolvedThreadId = threadId ? void 0 : context.resolveAutoThreadId?.({
		cfg: context.cfg,
		accountId: context.accountId,
		to: context.to,
		toolContext: context.toolContext,
		replyToId
	});
	const resolvedThreadId = threadId ?? autoResolvedThreadId;
	if (autoResolvedThreadId && !actionParams.threadId) actionParams.threadId = autoResolvedThreadId;
	if (replyToId && resolvedThreadId) {
		const canonicalReplyToId = context.resolveReplyTransport?.({
			cfg: context.cfg,
			accountId: context.accountId,
			threadId: resolvedThreadId,
			replyToId,
			replyToIsExplicit: context.replyToIsExplicit
		})?.replyToId;
		if (canonicalReplyToId && replyToId !== canonicalReplyToId) actionParams.replyTo = canonicalReplyToId;
	}
	return resolvedThreadId ?? void 0;
}
function isSameConversationTarget(actionParams, channel, toolContext, matchesToolContextTarget) {
	const currentChannelId = toolContext?.currentChannelId?.trim();
	const currentMessagingTarget = toolContext?.currentMessagingTarget?.trim();
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = toolContext?.currentChannelProvider?.trim();
	if (currentChannelProvider && currentChannelProvider !== channel) return false;
	const explicitTarget = readStringParam(actionParams, "target") ?? readStringParam(actionParams, "to") ?? readStringParam(actionParams, "channelId");
	if (!explicitTarget) return true;
	const target = explicitTarget.trim();
	if (toolContext && matchesToolContextTarget?.({
		target,
		toolContext
	})) return true;
	return target === currentMessagingTarget || target === currentChannelId;
}
/** Resolves and writes reply-to metadata for same-conversation message-action sends. */
function resolveAndApplyOutboundReplyToId(actionParams, context) {
	const explicitReplyToId = readStringParam(actionParams, "replyTo");
	if (explicitReplyToId) {
		if (context.toolContext?.replyToMode === "first") {
			const hasRepliedRef = context.toolContext.hasRepliedRef;
			if (hasRepliedRef) hasRepliedRef.value = true;
		}
		return explicitReplyToId;
	}
	if (suppressesImplicitThreading(actionParams)) return;
	if (!isSameConversationTarget(actionParams, context.channel, context.toolContext, context.matchesToolContextTarget)) return;
	const currentMessageId = context.toolContext?.currentMessageId;
	if (currentMessageId == null) return;
	const mode = context.toolContext?.replyToMode ?? "off";
	if (mode === "off" || mode === "batched") return;
	if (mode === "first") {
		const hasRepliedRef = context.toolContext?.hasRepliedRef;
		if (hasRepliedRef?.value) return;
		if (hasRepliedRef) hasRepliedRef.value = true;
	}
	const resolvedReplyToId = typeof currentMessageId === "number" ? String(currentMessageId) : currentMessageId.trim();
	if (!resolvedReplyToId) return;
	actionParams.replyTo = resolvedReplyToId;
	return resolvedReplyToId;
}
/** Prepares outbound session mirroring metadata for message-action sends. */
async function prepareOutboundMirrorRoute(params) {
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params.actionParams, {
		cfg: params.cfg,
		to: params.to,
		accountId: params.accountId,
		toolContext: params.toolContext,
		resolveAutoThreadId: params.resolveAutoThreadId,
		resolveReplyTransport: params.resolveReplyTransport,
		replyToIsExplicit: params.replyToIsExplicit
	});
	const replyToId = readStringParam(params.actionParams, "replyTo");
	const outboundRoute = params.agentId && !params.dryRun ? await params.resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: params.channel,
		agentId: params.agentId,
		accountId: params.accountId,
		target: params.to,
		currentSessionKey: params.currentSessionKey,
		resolvedTarget: params.resolvedTarget,
		replyToId,
		threadId: resolvedThreadId
	}) : null;
	if (outboundRoute && params.agentId && !params.dryRun) await params.ensureOutboundSessionEntry({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		route: outboundRoute
	});
	if (outboundRoute && !params.dryRun) params.actionParams["__sessionKey"] = outboundRoute.sessionKey;
	if (params.agentId) params.actionParams["__agentId"] = params.agentId;
	return {
		resolvedThreadId,
		outboundRoute
	};
}
//#endregion
//#region src/infra/outbound/message-action-tts.ts
let ttsRuntimePromise = null;
function loadMessageActionTtsRuntime() {
	ttsRuntimePromise ??= import("./tts.runtime.js");
	return ttsRuntimePromise;
}
/** Reads the session-level TTS auto mode for a message-action send. */
function resolveMessageActionSessionTtsAuto(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		return loadSessionEntry({
			agentId: params.agentId,
			sessionKey,
			storePath
		})?.ttsAuto;
	} catch {
		return;
	}
}
/** Applies automatic TTS to a message-action send payload when config/session policy allows it. */
async function maybeApplyTtsToMessageActionSendPayload(params) {
	if (params.dryRun) return params.payload;
	const ttsAuto = resolveMessageActionSessionTtsAuto({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId ?? void 0
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await loadMessageActionTtsRuntime();
	return await maybeApplyTtsToPayload({
		payload: params.payload,
		cfg: params.cfg,
		channel: params.channel,
		kind: "final",
		inboundAudio: params.inboundAudio,
		ttsAuto,
		agentId: params.agentId,
		accountId: params.accountId ?? void 0
	});
}
//#endregion
//#region src/infra/outbound/outbound-send-service.ts
async function sendCoreMessage(params) {
	return await sendMessage({
		cfg: params.ctx.cfg,
		to: params.to,
		content: params.message,
		...params.payloads ? { payloads: params.payloads } : {},
		agentId: params.ctx.agentId,
		requesterSessionKey: params.ctx.sessionKey,
		requesterAccountId: params.ctx.requesterAccountId ?? params.ctx.accountId ?? void 0,
		requesterSenderId: params.ctx.requesterSenderId,
		requesterSenderName: params.ctx.requesterSenderName,
		requesterSenderUsername: params.ctx.requesterSenderUsername,
		requesterSenderE164: params.ctx.requesterSenderE164,
		mediaUrl: params.mediaUrl || void 0,
		mediaUrls: params.mediaUrls,
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		asVoice: params.asVoice,
		channel: params.ctx.channel || void 0,
		accountId: params.ctx.accountId ?? void 0,
		replyToId: params.replyToId,
		threadId: params.threadId,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		dryRun: params.ctx.dryRun,
		bestEffort: params.bestEffort ?? void 0,
		queuePolicy: params.queuePolicy,
		deps: params.ctx.deps,
		gateway: params.ctx.gateway,
		mirror: params.ctx.mirror,
		abortSignal: params.ctx.abortSignal,
		silent: params.ctx.silent,
		mediaAccess: params.ctx.mediaAccess
	});
}
async function tryHandleWithPluginAction(params) {
	if (params.ctx.dryRun) return null;
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg: params.ctx.cfg,
		agentId: params.ctx.agentId ?? params.ctx.mirror?.agentId,
		mediaSources: collectActionMediaSourceHints(params.ctx.params, void 0, { structuredAttachments: params.action === "send" ? "all" : void 0 }),
		sessionKey: params.ctx.sessionKey,
		messageProvider: params.ctx.sessionKey ? void 0 : params.ctx.channel,
		accountId: (params.ctx.sessionKey ? params.ctx.requesterAccountId ?? params.ctx.accountId : params.ctx.accountId) ?? void 0,
		requesterSenderId: params.ctx.requesterSenderId,
		requesterSenderName: params.ctx.requesterSenderName,
		requesterSenderUsername: params.ctx.requesterSenderUsername,
		requesterSenderE164: params.ctx.requesterSenderE164,
		mediaAccess: params.ctx.mediaAccess,
		mediaReadFile: params.ctx.mediaReadFile
	});
	const handled = await dispatchChannelMessageAction(createChannelActionContext({
		ctx: params.ctx,
		action: params.action,
		mediaAccess
	}));
	if (!handled) return null;
	await params.onHandled?.();
	return {
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled
	};
}
function createChannelActionContext(params) {
	const mediaAccess = params.mediaAccess ?? params.ctx.mediaAccess;
	return {
		channel: params.ctx.channel,
		action: params.action,
		cfg: params.ctx.cfg,
		params: params.ctx.params,
		...mediaAccess ? { mediaAccess } : {},
		mediaLocalRoots: mediaAccess?.localRoots ?? params.ctx.mediaAccess?.localRoots,
		mediaReadFile: mediaAccess?.readFile ?? params.ctx.mediaReadFile,
		accountId: params.ctx.accountId ?? void 0,
		requesterAccountId: params.ctx.requesterAccountId,
		requesterSenderId: params.ctx.requesterSenderId,
		senderIsOwner: params.ctx.senderIsOwner,
		sessionKey: params.ctx.sessionKey,
		sessionId: params.ctx.sessionId,
		inboundEventKind: params.ctx.inboundEventKind,
		agentId: params.ctx.agentId,
		gateway: params.ctx.gateway,
		toolContext: params.ctx.toolContext,
		dryRun: params.ctx.dryRun
	};
}
async function tryPreparePluginSendPayload(params) {
	const plugin = resolveOutboundChannelPlugin({
		channel: params.ctx.channel,
		cfg: params.ctx.cfg
	});
	if (!plugin?.outbound) return null;
	const prepareSendPayload = plugin?.actions?.prepareSendPayload;
	if (!prepareSendPayload) return null;
	return await prepareSendPayload({
		ctx: createChannelActionContext({
			ctx: params.ctx,
			action: "send"
		}),
		to: params.to,
		payload: params.payload,
		replyToId: params.replyToId,
		threadId: params.threadId
	}) ?? null;
}
/** Executes a message-tool send through plugin handlers or the core outbound path. */
async function executeSendAction(params) {
	throwIfAborted(params.ctx.abortSignal);
	const defaultPayload = params.payload ?? {
		text: params.message,
		mediaUrl: params.mediaUrl,
		mediaUrls: params.mediaUrls,
		audioAsVoice: params.asVoice === true
	};
	const queuePolicy = params.bestEffort === false ? "required" : "best_effort";
	const preparedPayload = await tryPreparePluginSendPayload({
		ctx: params.ctx,
		to: params.to,
		payload: defaultPayload,
		replyToId: params.replyToId,
		threadId: params.threadId
	});
	if (preparedPayload) {
		throwIfAborted(params.ctx.abortSignal);
		const result = await sendCoreMessage({
			...params,
			queuePolicy,
			payloads: [preparedPayload]
		});
		return {
			handledBy: "core",
			payload: result,
			sendResult: result
		};
	}
	const pluginHandled = await tryHandleWithPluginAction({
		ctx: params.ctx,
		action: "send",
		onHandled: async () => {
			if (!params.ctx.mirror) return;
			const mirrorText = params.ctx.mirror.text ?? params.message;
			const mirrorMediaUrls = params.ctx.mirror.mediaUrls ?? params.mediaUrls ?? (params.mediaUrl ? [params.mediaUrl] : void 0);
			await appendAssistantMessageToSessionTranscript({
				agentId: params.ctx.mirror.agentId,
				sessionKey: params.ctx.mirror.sessionKey,
				text: mirrorText,
				mediaUrls: mirrorMediaUrls,
				idempotencyKey: params.ctx.mirror.idempotencyKey,
				config: params.ctx.cfg
			});
		}
	});
	if (pluginHandled) return pluginHandled;
	throwIfAborted(params.ctx.abortSignal);
	const result = await sendCoreMessage({
		...params,
		queuePolicy
	});
	return {
		handledBy: "core",
		payload: result,
		sendResult: result
	};
}
/** Executes a message-tool poll through plugin handlers or the core poll path. */
async function executePollAction(params) {
	const pluginHandled = await tryHandleWithPluginAction({
		ctx: params.ctx,
		action: "poll"
	});
	if (pluginHandled) return pluginHandled;
	const corePoll = params.resolveCorePoll();
	const result = await sendPoll({
		cfg: params.ctx.cfg,
		to: corePoll.to,
		question: corePoll.question,
		options: corePoll.options,
		maxSelections: corePoll.maxSelections,
		durationSeconds: corePoll.durationSeconds ?? void 0,
		durationHours: corePoll.durationHours ?? void 0,
		channel: params.ctx.channel,
		accountId: params.ctx.accountId ?? void 0,
		threadId: corePoll.threadId ?? void 0,
		silent: params.ctx.silent ?? void 0,
		isAnonymous: corePoll.isAnonymous ?? void 0,
		dryRun: params.ctx.dryRun,
		gateway: params.ctx.gateway
	});
	return {
		handledBy: "core",
		payload: result,
		pollResult: result
	};
}
//#endregion
//#region src/infra/outbound/message-action-runner.ts
let messageActionGatewayRuntimePromise = null;
function loadMessageActionGatewayRuntime() {
	messageActionGatewayRuntimePromise ??= import("./message.gateway.runtime.js");
	return messageActionGatewayRuntimePromise;
}
function getToolResult(result) {
	return "toolResult" in result ? result.toolResult : void 0;
}
function resolveGatewayActionOptions(gateway) {
	return resolveOutboundMessageGatewayOptions(gateway);
}
async function callGatewayMessageAction(params) {
	const { callGatewayLeastPrivilege } = await loadMessageActionGatewayRuntime();
	const gateway = resolveGatewayActionOptions(params.gateway);
	return await callGatewayLeastPrivilege({
		url: gateway.url,
		token: gateway.token,
		method: "message.action",
		params: params.actionParams,
		timeoutMs: gateway.timeoutMs,
		clientName: gateway.clientName,
		clientDisplayName: gateway.clientDisplayName,
		mode: gateway.mode
	});
}
async function resolveGatewayActionIdempotencyKey(idempotencyKey) {
	if (idempotencyKey) return idempotencyKey;
	const { randomIdempotencyKey } = await loadMessageActionGatewayRuntime();
	return randomIdempotencyKey();
}
function applyCrossContextMessageDecoration({ params, message, decoration, preferPresentation }) {
	const applied = applyCrossContextDecoration({
		message,
		decoration,
		preferPresentation
	});
	params.message = applied.message;
	if (applied.presentation) {
		const existing = normalizeMessagePresentation(params.presentation);
		params.presentation = existing ? {
			...existing,
			blocks: [...applied.presentation.blocks, ...existing.blocks]
		} : applied.presentation;
	}
	return applied.message;
}
async function maybeApplyCrossContextMarker(params) {
	if (!shouldApplyCrossContextMarker(params.action) || !params.toolContext) return params.message;
	const decoration = await buildCrossContextDecoration({
		cfg: params.cfg,
		channel: params.channel,
		target: params.target,
		toolContext: params.toolContext,
		accountId: params.accountId ?? void 0,
		agentId: params.agentId ?? void 0
	});
	if (!decoration) return params.message;
	return applyCrossContextMessageDecoration({
		params: params.args,
		message: params.message,
		decoration,
		preferPresentation: params.preferPresentation
	});
}
async function resolveChannel(cfg, params, toolContext) {
	const selection = await resolveMessageChannelSelection({
		cfg,
		channel: readStringParam(params, "channel"),
		fallbackChannel: toolContext?.currentChannelProvider
	});
	if (selection.source === "tool-context-fallback") params.channel = selection.channel;
	return selection.channel;
}
function addCandidateAndUnprefixedAlias(candidates, value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	candidates.add(normalized);
	const unprefixed = normalized.replace(/^(channel|group|user):/i, "").trim();
	if (unprefixed && unprefixed !== normalized) candidates.add(unprefixed);
}
function normalizeTargetForAccountBinding(channel, target) {
	try {
		return normalizeTargetForProvider(channel, target);
	} catch {
		return;
	}
}
function inferPeerKindForAccountBinding(channel, target) {
	const inferred = normalizeChatType(getChannelPlugin(channel)?.messaging?.inferTargetChatType?.({ to: target }));
	if (inferred) return inferred;
	const candidates = [target, normalizeTargetForAccountBinding(channel, target)].filter((value) => Boolean(value));
	if (candidates.some((value) => /^user:/i.test(value))) return "direct";
	if (candidates.some((value) => /^(channel|group):/i.test(value))) return "channel";
}
function resolveTargetBoundAccountId(params) {
	if (!params.agentId) return;
	const target = normalizeOptionalString(params.args.to) ?? normalizeOptionalString(params.args.channelId) ?? "";
	if (!target) return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId
	});
	const candidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(candidates, target);
	addCandidateAndUnprefixedAlias(candidates, normalizeTargetForAccountBinding(params.channel, target));
	const [peerId, ...exactPeerIdAliases] = Array.from(candidates);
	return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId,
		peerId,
		exactPeerIdAliases,
		peerKind: inferPeerKindForAccountBinding(params.channel, target)
	});
}
async function resolveActionTarget(params) {
	let resolvedTarget;
	const toRaw = normalizeOptionalString(params.args.to) ?? "";
	if (toRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: toRaw,
			accountId: params.accountId ?? void 0
		});
		params.args.to = resolved.to;
		resolvedTarget = resolved;
	}
	const channelIdRaw = normalizeOptionalString(params.args.channelId) ?? "";
	if (channelIdRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: channelIdRaw,
			accountId: params.accountId ?? void 0,
			preferredKind: "group",
			validateResolvedTarget: (target) => target.kind === "user" ? `Channel id "${channelIdRaw}" resolved to a user target.` : void 0
		});
		params.args.channelId = sanitizeGroupTargetId(resolved.to);
	}
	return resolvedTarget;
}
function sanitizeGroupTargetId(target) {
	return target.replace(/^(channel|group):/i, "");
}
async function resolveResolvedTargetOrThrow(params) {
	const resolved = await resolveChannelTarget({
		cfg: params.cfg,
		channel: params.channel,
		input: params.input,
		accountId: params.accountId,
		preferredKind: params.preferredKind
	});
	if (!resolved.ok) throw resolved.error;
	const validationError = params.validateResolvedTarget?.(resolved.target);
	if (validationError) throw new Error(validationError);
	return resolved.target;
}
function updateSendPayloadPartsFromReplyPayload(parts, payload) {
	const sendable = resolveSendableOutboundReplyParts(payload);
	const mediaUrls = sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0;
	return {
		...parts,
		message: payload.text ?? "",
		payload,
		mediaUrl: mediaUrls?.[0],
		mediaUrls,
		asVoice: payload.audioAsVoice === true
	};
}
function applySendPayloadPartsToActionParams(actionParams, parts) {
	actionParams.message = parts.message;
	actionParams.media = parts.mediaUrl;
	actionParams.mediaUrl = parts.mediaUrl;
	actionParams.mediaUrls = parts.mediaUrls;
	actionParams.asVoice = parts.asVoice || void 0;
	actionParams.audioAsVoice = parts.asVoice || void 0;
}
function collectMessageAttachmentMediaHints(value) {
	if (!Array.isArray(value)) return [];
	const mediaUrls = [];
	const seen = /* @__PURE__ */ new Set();
	const pushMedia = (entry) => {
		const normalized = normalizeOptionalString(entry);
		if (!normalized || seen.has(normalized)) return;
		seen.add(normalized);
		mediaUrls.push(normalized);
	};
	for (const attachment of value) {
		if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) continue;
		const record = attachment;
		pushMedia(record.media);
		pushMedia(record.mediaUrl);
		pushMedia(record.path);
		pushMedia(record.filePath);
		pushMedia(record.fileUrl);
		pushMedia(record.url);
	}
	return mediaUrls;
}
function hasExplicitTargetParam(params) {
	for (const key of [
		"target",
		"to",
		"channelId"
	]) if (normalizeOptionalString(params[key])) return true;
	return Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value));
}
function isCurrentSourceTargetParam(input, params) {
	const currentChannelId = normalizeOptionalString(input.toolContext?.currentChannelId);
	const currentMessagingTarget = normalizeOptionalString(input.toolContext?.currentMessagingTarget);
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (explicitChannel && currentChannelProvider && explicitChannel !== currentChannelProvider) return false;
	const explicitTarget = normalizeOptionalString(params.target) ?? normalizeOptionalString(params.to) ?? normalizeOptionalString(params.channelId);
	if (!explicitTarget) return false;
	const provider = explicitChannel ?? currentChannelProvider;
	const currentCandidates = /* @__PURE__ */ new Set();
	for (const currentTarget of [currentMessagingTarget, currentChannelId]) {
		if (!currentTarget) continue;
		addCandidateAndUnprefixedAlias(currentCandidates, currentTarget);
		if (provider) addCandidateAndUnprefixedAlias(currentCandidates, normalizeTargetForAccountBinding(provider, currentTarget));
	}
	const explicitCandidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(explicitCandidates, explicitTarget);
	if (provider) addCandidateAndUnprefixedAlias(explicitCandidates, normalizeTargetForAccountBinding(provider, explicitTarget));
	return Array.from(explicitCandidates).some((candidate) => currentCandidates.has(candidate));
}
function hasExplicitNonCurrentChannelParam(input, params) {
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (!explicitChannel) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	return !currentChannelProvider || explicitChannel !== currentChannelProvider;
}
function applyImplicitSourceReplySendPolicy(input, params) {
	if (input.action !== "send" || input.sourceReplyDeliveryMode !== "message_tool_only") return;
	if (hasExplicitNonCurrentChannelParam(input, params)) return;
	if (hasExplicitTargetParam(params) && !isCurrentSourceTargetParam(input, params)) return;
	params.bestEffort = true;
}
async function runGatewayPluginMessageActionOrNull(params) {
	if (params.dryRun || !params.gateway) return null;
	const plugin = resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg
	});
	if (!plugin?.actions?.handleAction) return null;
	if ((plugin.actions.resolveExecutionMode?.({ action: params.action }) ?? "local") !== "gateway") return null;
	const payload = await callGatewayMessageAction({
		gateway: params.gateway,
		actionParams: {
			channel: params.channel,
			action: params.action,
			params: params.params,
			accountId: params.accountId ?? void 0,
			requesterAccountId: params.input.requesterAccountId ?? void 0,
			requesterSenderId: params.input.requesterSenderId ?? void 0,
			senderIsOwner: params.input.senderIsOwner,
			sessionKey: params.input.sessionKey,
			sessionId: params.input.sessionId,
			inboundTurnKind: params.input.inboundEventKind,
			agentId: params.agentId,
			toolContext: params.input.toolContext,
			idempotencyKey: await resolveGatewayActionIdempotencyKey(normalizeOptionalString(params.params.idempotencyKey))
		}
	});
	return params.result(payload);
}
function resolveGateway(input) {
	if (!input.gateway) return;
	return {
		url: input.gateway.url,
		token: input.gateway.token,
		timeoutMs: input.gateway.timeoutMs,
		clientName: input.gateway.clientName,
		clientDisplayName: input.gateway.clientDisplayName,
		mode: input.gateway.mode
	};
}
async function handleBroadcastAction(input, params) {
	throwIfAborted(input.abortSignal);
	if (!(resolveEffectiveMessageToolsConfig({
		cfg: input.cfg,
		agentId: input.agentId
	})?.broadcast?.enabled !== false)) throw new Error("Broadcast is disabled. Set tools.message.broadcast.enabled to true.");
	const rawTargets = readStringArrayParam(params, "targets", { required: true });
	if (rawTargets.length === 0) throw new Error("Broadcast requires at least one target in --targets.");
	const channelHint = readStringParam(params, "channel");
	const targetChannels = channelHint && normalizeOptionalLowercaseString(channelHint) !== "all" ? [await resolveChannel(input.cfg, { channel: channelHint }, input.toolContext)] : await (async () => {
		const configured = await listConfiguredMessageChannels(input.cfg);
		if (configured.length === 0) throw new Error("Broadcast requires at least one configured channel.");
		return configured;
	})();
	const results = [];
	const isAbortError = (err) => err instanceof Error && err.name === "AbortError";
	for (const targetChannel of targetChannels) {
		throwIfAborted(input.abortSignal);
		for (const target of rawTargets) {
			throwIfAborted(input.abortSignal);
			try {
				const resolved = await resolveResolvedTargetOrThrow({
					cfg: input.cfg,
					channel: targetChannel,
					input: target
				});
				const sendResult = await runMessageAction({
					...input,
					action: "send",
					params: {
						...params,
						channel: targetChannel,
						target: resolved.to
					}
				});
				results.push({
					channel: targetChannel,
					to: resolved.to,
					ok: true,
					payload: sendResult.kind === "send" ? sendResult.payload : void 0,
					result: sendResult.kind === "send" ? sendResult.sendResult : void 0
				});
			} catch (err) {
				if (isAbortError(err)) throw err;
				results.push({
					channel: targetChannel,
					to: target,
					ok: false,
					error: formatErrorMessage(err),
					...err && typeof err === "object" && err.sentBeforeError === true ? { sentBeforeError: true } : {}
				});
			}
		}
	}
	return {
		kind: "broadcast",
		channel: targetChannels[0] ?? normalizeOptionalLowercaseString(channelHint) ?? "unknown",
		action: "broadcast",
		handledBy: input.dryRun ? "dry-run" : "core",
		payload: { results },
		dryRun: Boolean(input.dryRun)
	};
}
async function handleInternalSourceReplySendAction(input, params) {
	throwIfAborted(input.abortSignal);
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(params, "dryRun"));
	const sourceReply = await buildSendPayloadParts({
		cfg: input.cfg,
		actionParams: params,
		input,
		agentId: input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
			sessionKey: input.sessionKey,
			config: input.cfg
		}) : void 0)
	});
	const payload = {
		status: "ok",
		deliveryStatus: dryRun ? "dry_run" : "sent",
		channel: INTERNAL_MESSAGE_CHANNEL,
		target: "current-run",
		sourceReplyDeliveryMode: input.sourceReplyDeliveryMode,
		...dryRun ? {} : { sourceReplySink: "internal-ui" },
		sourceReply: sourceReply.payload,
		...sourceReply.message ? { message: sourceReply.message } : {},
		...sourceReply.mediaUrl ? { mediaUrl: sourceReply.mediaUrl } : {},
		...sourceReply.mediaUrls?.length ? { mediaUrls: sourceReply.mediaUrls } : {},
		dryRun
	};
	return {
		kind: "send",
		channel: INTERNAL_MESSAGE_CHANNEL,
		action: "send",
		to: "current-run",
		handledBy: "internal-source",
		payload,
		toolResult: buildInternalSourceReplyToolResult(payload),
		dryRun
	};
}
function buildInternalSourceReplyToolResult(payload) {
	return {
		content: [{
			type: "text",
			text: `${payload.dryRun ? "Prepared" : "Sent"} visible reply to the current source conversation${payload.sourceReplySink ? ` via ${payload.sourceReplySink}` : ""}.`
		}],
		details: {
			status: payload.status,
			deliveryStatus: payload.deliveryStatus,
			channel: payload.channel,
			target: payload.target,
			...payload.sourceReplyDeliveryMode ? { sourceReplyDeliveryMode: payload.sourceReplyDeliveryMode } : {},
			...payload.sourceReplySink ? { sourceReplySink: payload.sourceReplySink } : {},
			sourceReply: payload.sourceReply,
			...payload.message ? { message: payload.message } : {},
			...payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {},
			...payload.mediaUrls?.length ? { mediaUrls: payload.mediaUrls } : {},
			dryRun: payload.dryRun
		}
	};
}
async function buildSendPayloadParts(params) {
	const { actionParams, input } = params;
	if (actionParams.pin === true && actionParams.delivery == null) actionParams.delivery = { pin: { enabled: true } };
	if (typeof actionParams.message !== "string" || !actionParams.message.trim()) for (const alias of [
		"SendMessage",
		"content",
		"text"
	]) {
		const value = actionParams[alias];
		if (typeof value === "string" && value.trim()) {
			actionParams.message = stripFormattedReasoningMessage(value);
			console.warn(`[message-tool] normalized alias "${alias}" to "message" for send action`);
			break;
		}
	}
	const mediaHint = readStringParam(actionParams, "media", { trim: false }) ?? readStringParam(actionParams, "mediaUrl", { trim: false }) ?? readStringParam(actionParams, "path", { trim: false }) ?? readStringParam(actionParams, "filePath", { trim: false }) ?? readStringParam(actionParams, "fileUrl", { trim: false }) ?? readStringParam(actionParams, "image", { trim: false });
	const mediaUrlHints = readStringArrayParam(actionParams, "mediaUrls") ?? [];
	const attachmentMediaHints = collectMessageAttachmentMediaHints(actionParams.attachments);
	const hasMediaHint = Boolean(mediaHint) || mediaUrlHints.length > 0 || attachmentMediaHints.length > 0;
	const hasPresentation = hasMessagePresentationBlocks(actionParams.presentation);
	const hasInteractive = hasInteractiveReplyBlocks(actionParams.interactive);
	const caption = readStringParam(actionParams, "caption", { allowEmpty: true }) ?? "";
	let message = readStringParam(actionParams, "message", {
		required: !hasMediaHint && !hasPresentation && !hasInteractive,
		allowEmpty: true
	}) ?? "";
	if (message.includes("\\n")) message = message.replaceAll("\\n", "\n");
	if (!message.trim() && caption.trim()) message = caption;
	const parsed = parseInlineDirectives(message, {
		stripAudioTag: true,
		stripReplyTags: true
	});
	const mergedMediaUrls = [];
	const seenMedia = /* @__PURE__ */ new Set();
	const pushMedia = (value) => {
		const trimmed = normalizeOptionalString(value);
		if (!trimmed || seenMedia.has(trimmed)) return;
		seenMedia.add(trimmed);
		mergedMediaUrls.push(trimmed);
	};
	pushMedia(mediaHint);
	for (const mediaUrlHint of mediaUrlHints) pushMedia(mediaUrlHint);
	for (const attachmentMediaHint of attachmentMediaHints) pushMedia(attachmentMediaHint);
	const normalizedMediaUrls = await normalizeSandboxMediaList({
		values: mergedMediaUrls,
		sandboxRoot: input.sandboxRoot
	});
	mergedMediaUrls.length = 0;
	mergedMediaUrls.push(...normalizedMediaUrls);
	message = stripPlainTextToolCallBlocks(stripUnsupportedCitationControlMarkers(parsed.text));
	actionParams.message = message;
	if (!actionParams.replyTo && parsed.replyToId) actionParams.replyTo = parsed.replyToId;
	if (!actionParams.media) actionParams.media = mergedMediaUrls[0] || void 0;
	actionParams.mediaUrls = mergedMediaUrls.length > 0 ? [...mergedMediaUrls] : void 0;
	if (params.channel && params.target) message = await maybeApplyCrossContextMarker({
		cfg: params.cfg,
		channel: params.channel,
		action: "send",
		target: params.target,
		toolContext: input.toolContext,
		accountId: params.accountId,
		agentId: params.agentId,
		args: actionParams,
		message,
		preferPresentation: true
	});
	const mediaUrl = readStringParam(actionParams, "media", { trim: false });
	if (!hasReplyPayloadContent({
		text: message,
		mediaUrl,
		mediaUrls: mergedMediaUrls,
		presentation: actionParams.presentation,
		interactive: actionParams.interactive
	})) throw new Error("send requires text or media");
	actionParams.message = message;
	const gifPlayback = readBooleanParam(actionParams, "gifPlayback") ?? false;
	const forceDocument = readBooleanParam(actionParams, "forceDocument") ?? readBooleanParam(actionParams, "asDocument") ?? false;
	const asVoice = readBooleanParam(actionParams, "asVoice") ?? readBooleanParam(actionParams, "audioAsVoice") ?? parsed.audioAsVoice;
	const bestEffort = readBooleanParam(actionParams, "bestEffort");
	const silent = readBooleanParam(actionParams, "silent");
	const mirrorMediaUrls = mergedMediaUrls.length > 0 ? mergedMediaUrls : mediaUrl ? [mediaUrl] : void 0;
	const rawDelivery = actionParams.delivery;
	const delivery = rawDelivery && typeof rawDelivery === "object" && !Array.isArray(rawDelivery) ? rawDelivery : void 0;
	const rawChannelData = actionParams.channelData;
	const channelData = rawChannelData && typeof rawChannelData === "object" && !Array.isArray(rawChannelData) ? rawChannelData : void 0;
	const presentation = normalizeMessagePresentation(actionParams.presentation);
	const interactive = normalizeInteractiveReply(actionParams.interactive);
	return {
		message,
		payload: {
			text: message,
			...mediaUrl ? { mediaUrl } : {},
			...mergedMediaUrls.length ? { mediaUrls: mergedMediaUrls } : {},
			...asVoice ? { audioAsVoice: true } : {},
			...presentation ? { presentation } : {},
			...interactive ? { interactive } : {},
			...delivery ? { delivery } : {},
			...channelData ? { channelData } : {}
		},
		...mediaUrl ? { mediaUrl } : {},
		...mirrorMediaUrls ? { mediaUrls: mirrorMediaUrls } : {},
		asVoice,
		gifPlayback,
		forceDocument,
		...bestEffort !== void 0 ? { bestEffort } : {},
		...silent !== void 0 ? { silent } : {}
	};
}
async function handleSendAction(ctx) {
	const { cfg, params, channel, accountId, dryRun, gateway, input, agentId, resolvedTarget, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "send";
	const to = readStringParam(params, "to", { required: true });
	let sendPayload = await buildSendPayloadParts({
		cfg,
		actionParams: params,
		input,
		channel,
		target: to,
		accountId,
		agentId
	});
	const replyToIsExplicit = Boolean(readStringParam(params, "replyTo"));
	resolveAndApplyOutboundReplyToId(params, {
		channel,
		toolContext: input.toolContext,
		matchesToolContextTarget: getChannelPlugin(channel)?.threading?.matchesToolContextTarget
	});
	const { resolvedThreadId, outboundRoute } = await prepareOutboundMirrorRoute({
		cfg,
		channel,
		to,
		actionParams: params,
		accountId,
		toolContext: input.toolContext,
		agentId,
		currentSessionKey: input.sessionKey,
		dryRun,
		resolvedTarget,
		resolveAutoThreadId: getChannelPlugin(channel)?.threading?.resolveAutoThreadId,
		resolveReplyTransport: getChannelPlugin(channel)?.threading?.resolveReplyTransport,
		replyToIsExplicit,
		resolveOutboundSessionRoute,
		ensureOutboundSessionEntry
	});
	const resolvedReplyToId = readStringParam(params, "replyTo");
	throwIfAborted(abortSignal);
	const ttsPayload = await maybeApplyTtsToMessageActionSendPayload({
		payload: sendPayload.payload,
		cfg,
		channel,
		accountId,
		agentId,
		sessionKey: input.sessionKey,
		inboundAudio: input.inboundAudio,
		dryRun
	});
	if (ttsPayload !== sendPayload.payload) {
		sendPayload = updateSendPayloadPartsFromReplyPayload(sendPayload, ttsPayload);
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	throwIfAborted(abortSignal);
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg,
		agentId,
		mediaSources: collectActionMediaSourceHints(params, ctx.extraActionMediaSourceParamKeys, { structuredAttachments: "all" }),
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : channel,
		accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const gatewayPluginAction = await runGatewayPluginMessageActionOrNull({
		cfg,
		params,
		channel,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "send",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	if (gatewayPluginAction) return gatewayPluginAction;
	const send = await executeSendAction({
		ctx: {
			cfg,
			channel,
			params,
			agentId,
			sessionKey: input.sessionKey,
			requesterAccountId: input.requesterAccountId ?? void 0,
			requesterSenderId: input.requesterSenderId ?? void 0,
			requesterSenderName: input.requesterSenderName ?? void 0,
			requesterSenderUsername: input.requesterSenderUsername ?? void 0,
			requesterSenderE164: input.requesterSenderE164 ?? void 0,
			senderIsOwner: input.senderIsOwner,
			mediaAccess,
			accountId: accountId ?? void 0,
			sessionId: input.sessionId,
			inboundEventKind: input.inboundEventKind,
			gateway,
			toolContext: input.toolContext,
			deps: input.deps,
			dryRun,
			mirror: outboundRoute && !dryRun ? {
				sessionKey: outboundRoute.sessionKey,
				agentId,
				text: sendPayload.message,
				mediaUrls: sendPayload.mediaUrls,
				idempotencyKey: normalizeOptionalString(params.idempotencyKey) ?? void 0
			} : void 0,
			abortSignal,
			silent: sendPayload.silent ?? void 0
		},
		to,
		message: sendPayload.message,
		payload: sendPayload.payload,
		mediaUrl: sendPayload.mediaUrl,
		mediaUrls: sendPayload.mediaUrls,
		buffer: readStringParam(params, "buffer", { trim: false }) ?? void 0,
		filename: readStringParam(params, "filename") ?? void 0,
		contentType: readStringParam(params, "contentType") ?? void 0,
		asVoice: sendPayload.asVoice,
		gifPlayback: sendPayload.gifPlayback,
		forceDocument: sendPayload.forceDocument,
		bestEffort: sendPayload.bestEffort,
		replyToId: resolvedReplyToId ?? void 0,
		threadId: resolvedThreadId ?? void 0
	});
	return {
		kind: "send",
		channel,
		action,
		to,
		handledBy: send.handledBy,
		payload: send.payload,
		toolResult: send.toolResult,
		sendResult: send.sendResult,
		dryRun
	};
}
async function handlePollAction(ctx) {
	const { cfg, params, channel, accountId, dryRun, gateway, input, agentId, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "poll";
	const to = readStringParam(params, "to", { required: true });
	const silent = readBooleanParam(params, "silent");
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params, {
		cfg,
		to,
		accountId,
		toolContext: input.toolContext,
		resolveAutoThreadId: getChannelPlugin(channel)?.threading?.resolveAutoThreadId
	});
	const base = typeof params.message === "string" ? params.message : "";
	await maybeApplyCrossContextMarker({
		cfg,
		channel,
		action,
		target: to,
		toolContext: input.toolContext,
		accountId,
		agentId,
		args: params,
		message: base,
		preferPresentation: false
	});
	const gatewayPluginAction = await runGatewayPluginMessageActionOrNull({
		cfg,
		params,
		channel,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "poll",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	if (gatewayPluginAction) return gatewayPluginAction;
	const poll = await executePollAction({
		ctx: {
			cfg,
			channel,
			params,
			accountId: accountId ?? void 0,
			agentId,
			requesterAccountId: input.requesterAccountId ?? void 0,
			requesterSenderId: input.requesterSenderId ?? void 0,
			sessionKey: input.sessionKey,
			sessionId: input.sessionId,
			inboundEventKind: input.inboundEventKind,
			gateway,
			toolContext: input.toolContext,
			dryRun,
			silent: silent ?? void 0
		},
		resolveCorePoll: () => {
			const question = readStringParam(params, "pollQuestion", { required: true });
			const options = readStringArrayParam(params, "pollOption", { required: true });
			if (options.length < 2) throw new Error("pollOption requires at least two values");
			const allowMultiselect = readBooleanParam(params, "pollMulti") ?? false;
			const durationHours = readPositiveIntegerParam(params, "pollDurationHours", { message: "pollDurationHours must be a positive integer" });
			return {
				to,
				question,
				options,
				maxSelections: resolvePollMaxSelections(options.length, allowMultiselect),
				durationHours: durationHours ?? void 0,
				threadId: resolvedThreadId ?? void 0
			};
		}
	});
	return {
		kind: "poll",
		channel,
		action,
		to,
		handledBy: poll.handledBy,
		payload: poll.payload,
		toolResult: poll.toolResult,
		pollResult: poll.pollResult,
		dryRun
	};
}
async function handlePluginAction(ctx) {
	const { cfg, params, channel, mediaAccess, accountId, dryRun, gateway, input, abortSignal, agentId } = ctx;
	throwIfAborted(abortSignal);
	const action = input.action;
	if (dryRun) return {
		kind: "action",
		channel,
		action,
		handledBy: "dry-run",
		payload: {
			ok: true,
			dryRun: true,
			channel,
			action
		},
		dryRun: true
	};
	if (!resolveOutboundChannelPlugin({
		channel,
		cfg
	})?.actions?.handleAction) throw new Error(`Channel ${channel} is unavailable for message actions (plugin not loaded).`);
	const gatewayPluginAction = await runGatewayPluginMessageActionOrNull({
		cfg,
		params,
		channel,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "action",
			channel,
			action,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	if (gatewayPluginAction) return gatewayPluginAction;
	const handled = await dispatchChannelMessageAction({
		channel,
		action,
		cfg,
		params,
		mediaAccess,
		mediaLocalRoots: mediaAccess.localRoots,
		mediaReadFile: mediaAccess.readFile,
		accountId: accountId ?? void 0,
		requesterAccountId: input.requesterAccountId ?? void 0,
		requesterSenderId: input.requesterSenderId ?? void 0,
		senderIsOwner: input.senderIsOwner,
		sessionKey: input.sessionKey,
		sessionId: input.sessionId,
		inboundEventKind: input.inboundEventKind,
		agentId,
		gateway,
		toolContext: input.toolContext,
		dryRun
	});
	if (!handled) throw new Error(`Message action ${action} not supported for channel ${channel}.`);
	return {
		kind: "action",
		channel,
		action,
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled,
		dryRun
	};
}
async function runMessageAction(input) {
	const cfg = input.cfg;
	let params = { ...input.params };
	const resolvedAgentId = input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
		sessionKey: input.sessionKey,
		config: cfg
	}) : void 0);
	parseJsonMessageParam(params, "presentation");
	parseJsonMessageParam(params, "delivery");
	parseInteractiveParam(params);
	const action = input.action;
	enforceMessageActionAllowlist({
		cfg,
		agentId: resolvedAgentId,
		action
	});
	if (action === "broadcast") return handleBroadcastAction(input, params);
	if (action === "send" && hasPollCreationParams(params)) throw new Error("Poll fields require action \"poll\"; use action \"poll\" instead of \"send\".");
	if (await shouldUseInternalSourceReplySink(input, params)) return handleInternalSourceReplySendAction({
		...input,
		agentId: resolvedAgentId
	}, params);
	applyImplicitSourceReplySendPolicy(input, params);
	params = normalizeMessageActionInput({
		action,
		args: params,
		toolContext: input.toolContext
	});
	const channel = await resolveChannel(cfg, params, input.toolContext);
	let accountId = readStringParam(params, "accountId") ?? input.defaultAccountId;
	if (!accountId && resolvedAgentId) accountId = resolveTargetBoundAccountId({
		cfg,
		channel,
		args: params,
		agentId: resolvedAgentId
	});
	if (accountId) params.accountId = accountId;
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(params, "dryRun"));
	const normalizationPolicy = resolveAttachmentMediaPolicy({
		sandboxRoot: input.sandboxRoot,
		mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, resolvedAgentId)
	});
	const extraActionMediaSourceParamKeys = resolveExtraActionMediaSourceParamKeys({
		cfg,
		action,
		args: params,
		channel,
		accountId,
		sessionKey: input.sessionKey,
		sessionId: input.sessionId,
		agentId: resolvedAgentId,
		requesterSenderId: input.requesterSenderId,
		senderIsOwner: input.senderIsOwner
	});
	const structuredAttachmentMode = action === "send" ? "all" : "selected";
	await normalizeSandboxMediaParams({
		args: params,
		mediaPolicy: normalizationPolicy,
		extraParamKeys: extraActionMediaSourceParamKeys,
		structuredAttachments: structuredAttachmentMode
	});
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg,
		agentId: resolvedAgentId,
		mediaSources: collectActionMediaSourceHints(params, extraActionMediaSourceParamKeys, { structuredAttachments: structuredAttachmentMode }),
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : channel,
		accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const mediaPolicy = resolveAttachmentMediaPolicy({
		sandboxRoot: input.sandboxRoot,
		mediaAccess
	});
	const gateway = resolveGateway(input);
	const channelPlugin = resolveOutboundChannelPlugin({
		channel,
		cfg
	});
	const preserveSendBuffer = action === "send" && Boolean(gateway) && (channelPlugin?.actions?.resolveExecutionMode?.({ action: "send" }) === "gateway" || channelPlugin?.outbound?.deliveryMode === "gateway");
	const hydrateActionAttachmentParams = () => hydrateAttachmentParamsForAction({
		cfg,
		channel,
		accountId,
		args: params,
		action,
		dryRun,
		preserveSendBuffer,
		mediaPolicy,
		extraParamKeys: extraActionMediaSourceParamKeys
	});
	if (action !== "send") await hydrateActionAttachmentParams();
	const resolvedTarget = await resolveActionTarget({
		cfg,
		channel,
		action,
		args: params,
		accountId
	});
	enforceCrossContextPolicy({
		channel,
		action,
		args: params,
		toolContext: input.toolContext,
		cfg,
		agentId: resolvedAgentId
	});
	if (action === "send") await hydrateActionAttachmentParams();
	if (action === "send") return handleSendAction({
		cfg,
		params,
		channel,
		mediaAccess,
		extraActionMediaSourceParamKeys,
		accountId,
		dryRun,
		gateway,
		input,
		agentId: resolvedAgentId,
		resolvedTarget,
		abortSignal: input.abortSignal
	});
	if (action === "poll") return handlePollAction({
		cfg,
		params,
		channel,
		mediaAccess,
		extraActionMediaSourceParamKeys,
		accountId,
		dryRun,
		gateway,
		input,
		abortSignal: input.abortSignal
	});
	return handlePluginAction({
		cfg,
		params,
		channel,
		mediaAccess,
		extraActionMediaSourceParamKeys,
		accountId,
		dryRun,
		gateway,
		input,
		agentId: resolvedAgentId,
		abortSignal: input.abortSignal
	});
}
//#endregion
export { SHARED_POLL_CREATION_PARAM_NAMES as a, POLL_CREATION_PARAM_DEFS as i, runMessageAction as n, stripFormattedReasoningMessage as r, getToolResult as t };

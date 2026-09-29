import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { p as isProgressCardRefreshInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { c as resolveCommandTurnContext, i as isExplicitCommandTurn, s as resolveCommandBody } from "./command-turn-context-a363iy71.mjs";
import { r as isControlCommandMessage } from "./command-detection-CBYe7EC-.mjs";
//#region src/agents/reply-completion.ts
/** Returns true when a lifecycle turn must not redefine session-stable reply policy. */
function isSyntheticSourceReplyTurn(params) {
	return params.isHeartbeat === true || params.inputProvenance?.kind === "inter_session" || params.inputProvenance?.kind === "internal_system";
}
/** Resolve legacy runtime inputs once; explicit host requiredness always wins. */
function resolveReplyExpectation(params) {
	return params.terminalReplyExpectation ?? (isSyntheticSourceReplyTurn(params) || (params.allowEmptyAssistantReplyAsSilent ?? (params.trigger !== void 0 && params.trigger !== "user" && params.trigger !== "manual")) ? "optional" : "required");
}
/** Reconcile host policy with output/custody facts, never with a model's silence request. */
function resolveReplyCompletion(expectation, evidence) {
	return expectation === "required" ? {
		expectation,
		outcome: evidence === "empty" ? "missing" : evidence
	} : {
		expectation,
		outcome: evidence === "empty" ? "silent" : evidence
	};
}
/** Failure to observe a send is not proof that it is safe to generate or send another reply. */
async function observeReplyDelivery(observer, minimumAssistantMessageIndex, onError) {
	try {
		return await observer?.(minimumAssistantMessageIndex) ?? "missing";
	} catch (error) {
		onError(error);
		return "pending";
	}
}
//#endregion
//#region src/shared/silent-reply-policy.ts
const DEFAULT_SILENT_REPLY_POLICY = {
	direct: "disallow",
	group: "disallow",
	internal: "allow"
};
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
function classifySilentReplyConversationType(params) {
	if (params.conversationType) return params.conversationType;
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (normalizedSessionKey.includes(":group:") || normalizedSessionKey.includes(":channel:")) return "group";
	if (normalizedSessionKey.includes(":direct:") || normalizedSessionKey.includes(":dm:")) return "direct";
	if (normalizeLowercaseStringOrEmpty(params.surface) === "webchat") return "direct";
	return "internal";
}
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
function resolveSilentReplyPolicyFromPolicies(params) {
	if (params.conversationType === "direct") return "disallow";
	return params.surfacePolicy?.[params.conversationType] ?? params.defaultPolicy?.[params.conversationType] ?? DEFAULT_SILENT_REPLY_POLICY[params.conversationType];
}
//#endregion
//#region src/config/silent-reply.ts
function resolveSilentReplyConversationContext(params) {
	const conversationType = classifySilentReplyConversationType({
		sessionKey: params.sessionKey,
		surface: params.surface,
		conversationType: params.conversationType
	});
	const normalizedSurface = normalizeLowercaseStringOrEmpty(params.surface);
	const surface = normalizedSurface ? params.cfg?.surfaces?.[normalizedSurface] : void 0;
	return {
		conversationType,
		defaultPolicy: params.cfg?.agents?.defaults?.silentReply,
		surfacePolicy: surface?.silentReply
	};
}
/** Resolves the effective silent-reply settings for a routed conversation. */
function resolveSilentReplySettings(params) {
	return { policy: resolveSilentReplyPolicyFromPolicies(resolveSilentReplyConversationContext(params)) };
}
//#endregion
//#region src/auto-reply/command-turn-detection.ts
/** Fallback command-turn detection for mixed native/text channel metadata. */
function resolveVisibleMessageBody(input) {
	if (typeof input.rawText === "string") return input.rawText;
	return normalizeOptionalString(input.RawBody) ?? normalizeOptionalString(input.Body);
}
function resolveStructuredNormalFallbackBody(input) {
	const visibleBody = resolveVisibleMessageBody(input);
	if (!/^[!/]/.test(visibleBody ?? "")) return;
	return resolveCommandBody(input) ?? visibleBody;
}
function hasCommandSourceMetadata(input) {
	return input.CommandSource === "native" || input.CommandSource === "text" || input.CommandSource === "message";
}
/** Returns true when inbound metadata or command text identifies an explicit command turn. */
function isExplicitCommandTurnContext(input, cfg) {
	if (isExplicitCommandTurn(resolveCommandTurnContext(input))) return true;
	if (input.CommandSource === "native" || input.CommandSource === "text") return false;
	const fallbackBody = input.CommandTurn !== void 0 || hasCommandSourceMetadata(input) ? resolveStructuredNormalFallbackBody(input) : resolveCommandBody(input);
	return input.CommandAuthorized === true && isControlCommandMessage(fallbackBody, cfg, { botUsername: normalizeOptionalString(input.BotUsername) });
}
//#endregion
//#region src/auto-reply/reply/source-reply-delivery-mode.ts
/** Source-reply visibility and suppression policy for auto-reply delivery. */
function toSessionStableDeliveryModeContext(ctx) {
	return {
		ChatType: ctx.ChatType,
		Provider: ctx.Provider,
		Surface: ctx.Surface,
		ExplicitDeliverRoute: ctx.ExplicitDeliverRoute
	};
}
/** Returns true when the turn explicitly invoked a source-visible command. */
function isExplicitSourceReplyCommand(ctx, cfg) {
	return isExplicitCommandTurnContext(ctx, cfg);
}
/** Returns true for text slash commands that lack authorization metadata. */
function isUnauthorizedTextSlashCommand(ctx) {
	const commandTurn = resolveCommandTurnContext(ctx);
	return commandTurn.kind === "text-slash" && !commandTurn.authorized && (commandTurn.commandName !== void 0 || commandTurn.body?.trim().startsWith("/") === true);
}
function isInternalRoomEvent(ctx) {
	return ctx.InboundEventKind === "room_event" && isInternalSourceReplyChannel(ctx);
}
/** Returns true for internal message-channel turns that should remain local. */
function isInternalSourceReplyChannel(ctx) {
	const providerChannel = normalizeMessageChannel(ctx.Provider);
	const surfaceChannel = normalizeMessageChannel(ctx.Surface);
	return (providerChannel ?? surfaceChannel) === "webchat" && (surfaceChannel === "webchat" || !surfaceChannel) && ctx.ExplicitDeliverRoute !== true;
}
/** Resolves whether normal final text should auto-deliver or require the message tool. */
function resolveSourceReplyDeliveryMode(params) {
	if (params.strictMessageToolOnly === true) return "message_tool_only";
	if (params.ctx.InboundEventKind === "room_event" && !isInternalRoomEvent(params.ctx)) return "message_tool_only";
	if (params.requested && (params.requested !== "message_tool_only" || params.messageToolAvailable !== false)) return params.requested;
	if (isExplicitSourceReplyCommand(params.ctx, params.cfg)) return "automatic";
	const chatType = normalizeChatType(params.ctx.ChatType);
	if ((chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(params.ctx)) return "message_tool_only";
	let mode;
	if (chatType === "group" || chatType === "channel") mode = (params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies) === "message_tool" ? "message_tool_only" : "automatic";
	else mode = (params.cfg.messages?.visibleReplies ?? (isInternalSourceReplyChannel(params.ctx) ? "automatic" : params.defaultVisibleReplies)) === "message_tool" ? "message_tool_only" : "automatic";
	if (mode === "message_tool_only" && params.messageToolAvailable === false) return "automatic";
	return mode;
}
/** Selects reply requiredness at admission, preserving configured ambient group silence. */
function resolveSourceReplyExpectation(params) {
	if (isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	})) return "optional";
	if (isExplicitSourceReplyCommand(params.ctx, params.cfg)) return "required";
	if (params.ctx.InboundEventKind === "room_event") return "optional";
	const chatType = normalizeChatType(params.ctx.ChatType);
	if (classifySilentReplyConversationType({
		conversationType: chatType === "group" || chatType === "channel" ? "group" : chatType,
		sessionKey: params.ctx.SessionKey,
		surface: params.ctx.Surface ?? params.ctx.Provider
	}) === "group" && params.ctx.WasMentioned !== true && resolveSilentReplySettings({
		cfg: params.cfg,
		surface: params.ctx.Surface ?? params.ctx.Provider,
		conversationType: "group"
	}).policy === "allow") return "optional";
	return "required";
}
/** Resolves source delivery, hooks, lifecycle, and typing suppression flags. */
function resolveSourceReplyVisibilityPolicy(params) {
	const sourceReplyDeliveryMode = resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: params.ctx,
		requested: params.requested,
		strictMessageToolOnly: params.strictMessageToolOnly,
		messageToolAvailable: params.messageToolAvailable,
		defaultVisibleReplies: params.defaultVisibleReplies
	});
	const sessionStableSourceReplyDeliveryMode = !isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	}) && (params.requested !== void 0 || isExplicitSourceReplyCommand(params.ctx, params.cfg)) ? sourceReplyDeliveryMode : resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: toSessionStableDeliveryModeContext(params.ctx),
		messageToolAvailable: params.sessionStableMessageToolAvailable ?? params.messageToolAvailable,
		defaultVisibleReplies: params.defaultVisibleReplies
	});
	const sendPolicyDenied = params.sendPolicy === "deny";
	const progressRefresh = isProgressCardRefreshInputProvenance(params.ctx.InputProvenance);
	const suppressAutomaticSourceDelivery = progressRefresh || sourceReplyDeliveryMode === "message_tool_only";
	const suppressDelivery = sendPolicyDenied || suppressAutomaticSourceDelivery;
	const deliverySuppressionReason = sendPolicyDenied ? "sendPolicy: deny" : progressRefresh ? "progress card refresh" : suppressAutomaticSourceDelivery ? "sourceReplyDeliveryMode: message_tool_only" : "";
	return {
		sourceReplyDeliveryMode,
		sessionStableSourceReplyDeliveryMode,
		sendPolicyDenied,
		suppressAutomaticSourceDelivery,
		suppressDelivery,
		suppressHookUserDelivery: params.suppressAcpChildUserDelivery === true || suppressDelivery,
		suppressHookReplyLifecycle: progressRefresh || sendPolicyDenied || params.suppressAcpChildUserDelivery === true || params.explicitSuppressTyping === true || params.shouldSuppressTyping === true,
		suppressTyping: progressRefresh || sendPolicyDenied || params.explicitSuppressTyping === true || params.shouldSuppressTyping === true,
		deliverySuppressionReason
	};
}
//#endregion
export { resolveSourceReplyExpectation as a, isSyntheticSourceReplyTurn as c, resolveReplyExpectation as d, resolveSourceReplyDeliveryMode as i, observeReplyDelivery as l, isInternalSourceReplyChannel as n, resolveSourceReplyVisibilityPolicy as o, isUnauthorizedTextSlashCommand as r, resolveSilentReplySettings as s, isExplicitSourceReplyCommand as t, resolveReplyCompletion as u };

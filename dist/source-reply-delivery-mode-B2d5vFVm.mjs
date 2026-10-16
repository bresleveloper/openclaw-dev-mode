import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { p as isProgressCardRefreshInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { c as resolveCommandTurnContext, i as isExplicitCommandTurn, s as resolveCommandBody } from "./command-turn-context-B-DtktkV.mjs";
import { t as isSyntheticSourceReplyTurn } from "./reply-completion-B5n1Cnxm.mjs";
import { r as isControlCommandMessage } from "./command-detection-m_VCyqpX.mjs";
import { n as classifySilentReplyConversationType, t as resolveSilentReplySettings } from "./silent-reply-D-IlSCe7.mjs";
//#region src/auto-reply/command-turn-detection.ts
/** Fallback command-turn detection for mixed native/text channel metadata. */
function resolveStructuredNormalFallbackBody(input) {
	const visibleBody = typeof input.rawText === "string" ? input.rawText : normalizeOptionalString(input.RawBody) ?? normalizeOptionalString(input.Body);
	if (!/^[!/]/.test(visibleBody ?? "")) return;
	return resolveCommandBody(input) ?? visibleBody;
}
/** Returns true when inbound metadata or command text identifies an explicit command turn. */
function isExplicitCommandTurnContext(input, cfg) {
	if (isExplicitCommandTurn(resolveCommandTurnContext(input))) return true;
	if (input.CommandSource === "native" || input.CommandSource === "text") return false;
	const fallbackBody = input.CommandTurn !== void 0 || input.CommandSource === "message" ? resolveStructuredNormalFallbackBody(input) : resolveCommandBody(input);
	return input.CommandAuthorized === true && isControlCommandMessage(fallbackBody, cfg, { botUsername: normalizeOptionalString(input.BotUsername) });
}
//#endregion
//#region src/auto-reply/reply/source-reply-delivery-mode.ts
/** Source-reply visibility and suppression policy for auto-reply delivery. */
/** Returns true for text slash commands that lack authorization metadata. */
function isUnauthorizedTextSlashCommand(ctx) {
	const commandTurn = resolveCommandTurnContext(ctx);
	return commandTurn.kind === "text-slash" && !commandTurn.authorized && (commandTurn.commandName !== void 0 || commandTurn.body?.trim().startsWith("/") === true);
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
	if (params.ctx.InboundEventKind === "room_event" && !isInternalSourceReplyChannel(params.ctx)) return "message_tool_only";
	if (params.requested && (params.requested !== "message_tool_only" || params.messageToolAvailable !== false)) return params.requested;
	if (isExplicitCommandTurnContext(params.ctx, params.cfg)) return "automatic";
	const chatType = normalizeChatType(params.ctx.ChatType);
	if ((chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(params.ctx)) return "message_tool_only";
	const mode = (chatType === "group" || chatType === "channel" ? params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies : params.cfg.messages?.visibleReplies ?? (isInternalSourceReplyChannel(params.ctx) ? "automatic" : params.defaultVisibleReplies)) === "message_tool" ? "message_tool_only" : "automatic";
	if (mode === "message_tool_only" && params.messageToolAvailable === false) return "automatic";
	return mode;
}
/** Selects reply requiredness at admission, preserving configured ambient group silence. */
function resolveSourceReplyExpectation(params) {
	if (isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	})) return "optional";
	if (isExplicitCommandTurnContext(params.ctx, params.cfg)) return "required";
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
	const sourceReplyDeliveryMode = resolveSourceReplyDeliveryMode(params);
	const sessionStableSourceReplyDeliveryMode = !isSyntheticSourceReplyTurn({
		inputProvenance: params.ctx.InputProvenance,
		isHeartbeat: params.isHeartbeat
	}) && (params.requested !== void 0 || isExplicitCommandTurnContext(params.ctx, params.cfg)) ? sourceReplyDeliveryMode : resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: {
			ChatType: params.ctx.ChatType,
			Provider: params.ctx.Provider,
			Surface: params.ctx.Surface,
			ExplicitDeliverRoute: params.ctx.ExplicitDeliverRoute
		},
		messageToolAvailable: params.sessionStableMessageToolAvailable ?? params.messageToolAvailable,
		defaultVisibleReplies: params.defaultVisibleReplies
	});
	const sendPolicyDenied = params.sendPolicy === "deny";
	const progressRefresh = isProgressCardRefreshInputProvenance(params.ctx.InputProvenance);
	const suppressAutomaticSourceDelivery = progressRefresh || sourceReplyDeliveryMode === "message_tool_only";
	const suppressDelivery = sendPolicyDenied || suppressAutomaticSourceDelivery;
	const deliverySuppressionReason = sendPolicyDenied ? "sendPolicy: deny" : progressRefresh ? "progress card refresh" : suppressAutomaticSourceDelivery ? "sourceReplyDeliveryMode: message_tool_only" : "";
	const suppressTyping = progressRefresh || sendPolicyDenied || params.explicitSuppressTyping === true || params.shouldSuppressTyping === true;
	return {
		sourceReplyDeliveryMode,
		sessionStableSourceReplyDeliveryMode,
		sendPolicyDenied,
		suppressAutomaticSourceDelivery,
		suppressDelivery,
		suppressHookUserDelivery: params.suppressAcpChildUserDelivery === true || suppressDelivery,
		suppressHookReplyLifecycle: suppressTyping || params.suppressAcpChildUserDelivery === true,
		suppressTyping,
		deliverySuppressionReason
	};
}
//#endregion
export { resolveSourceReplyVisibilityPolicy as a, resolveSourceReplyExpectation as i, isUnauthorizedTextSlashCommand as n, isExplicitCommandTurnContext as o, resolveSourceReplyDeliveryMode as r, isInternalSourceReplyChannel as t };

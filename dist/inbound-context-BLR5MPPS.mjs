import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { _ as stripLegacyMediaContextFields, g as resolveStagedMediaFacts, h as resolveMediaFacts, u as projectMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-moohSd1t.mjs";
import { t as resolveConversationLabel } from "./conversation-label-BwwCUvEq.mjs";
import { c as resolveCommandTurnContext, n as createCommandTurnContext } from "./command-turn-context-a363iy71.mjs";
import { t as normalizeInboundTextNewlines } from "./inbound-text-B6lb_yrL.mjs";
//#region src/auto-reply/reply/inbound-context.ts
const FINALIZED_INBOUND_CONTEXT = Symbol("openclaw.finalizedInboundContext");
function normalizeTextField(value) {
	if (typeof value !== "string") return;
	return normalizeInboundTextNewlines(value);
}
function isFinalizedInboundContext(ctx) {
	return ctx[FINALIZED_INBOUND_CONTEXT] === true;
}
function resolveCanonicalInboundText(ctx, opts = {}) {
	const body = ctx.Body ?? "";
	const rawTextFromAliases = ctx.RawBody ?? ctx.Transcript ?? normalizeTextField(ctx.BodyStripped) ?? body;
	const rawText = opts.forceBodyForAgent || opts.forceBodyForCommands ? rawTextFromAliases : normalizeTextField(ctx.rawText) ?? rawTextFromAliases;
	const agentText = opts.forceBodyForAgent ? body : normalizeTextField(ctx.agentText) ?? normalizeTextField(ctx.BodyForAgent) ?? ctx.CommandBody ?? rawText;
	const commandText = opts.forceBodyForCommands ? ctx.CommandBody ?? rawText : normalizeTextField(ctx.commandText) ?? normalizeTextField(ctx.BodyForCommands) ?? ctx.CommandBody ?? rawText;
	return {
		commandText: ctx.CommandInterpretationSuppressed === true ? "" : commandText,
		agentText,
		rawText
	};
}
function foldDeprecatedPromptContextFields(ctx) {
	if (ctx.ChannelPromptContext === void 0 && ctx.UntrustedContext !== void 0) ctx.ChannelPromptContext = ctx.UntrustedContext;
	delete ctx.UntrustedContext;
	if (ctx.ChannelStructuredContext === void 0 && ctx.UntrustedStructuredContext !== void 0) ctx.ChannelStructuredContext = ctx.UntrustedStructuredContext;
	delete ctx.UntrustedStructuredContext;
}
function applySupplementalContext(ctx) {
	const supplemental = ctx.SupplementalContext;
	if (!supplemental) return;
	if (supplemental.channelStructuredContext === void 0 && supplemental.untrustedContext !== void 0) supplemental.channelStructuredContext = supplemental.untrustedContext;
	delete supplemental.untrustedContext;
	const fields = {
		ReplyToId: supplemental.quote?.id,
		ReplyToIdFull: supplemental.quote?.fullId,
		ReplyToBody: supplemental.quote?.body,
		ReplyToSender: supplemental.quote?.sender,
		ReplyToIsQuote: supplemental.quote?.isQuote,
		ForwardedFrom: supplemental.forwarded?.from,
		ForwardedFromType: supplemental.forwarded?.fromType,
		ForwardedFromId: supplemental.forwarded?.fromId,
		ForwardedDate: supplemental.forwarded?.date,
		ThreadStarterBody: supplemental.thread?.starterBody,
		ThreadHistoryBody: supplemental.thread?.historyBody,
		ThreadLabel: supplemental.thread?.label,
		GroupSystemPrompt: supplemental.groupSystemPrompt,
		ChannelStructuredContext: supplemental.channelStructuredContext
	};
	for (const [key, value] of Object.entries(fields)) if (value !== void 0 && ctx[key] === void 0) ctx[key] = value;
	delete ctx.SupplementalContext;
}
function finalizeInboundContextImpl(ctx, opts, preserveLegacyMedia) {
	const normalized = ctx;
	normalizeInternalTurnContext(normalized);
	foldDeprecatedPromptContextFields(normalized);
	applySupplementalContext(normalized);
	normalized.Body = normalizeTextField(normalized.Body) ?? "";
	normalized.RawBody = normalizeTextField(normalized.RawBody);
	normalized.CommandBody = normalizeTextField(normalized.CommandBody);
	normalized.Transcript = normalizeTextField(normalized.Transcript);
	normalized.ThreadStarterBody = normalizeTextField(normalized.ThreadStarterBody);
	normalized.ThreadHistoryBody = normalizeTextField(normalized.ThreadHistoryBody);
	normalized.GroupSystemPrompt = normalizeTextField(normalized.GroupSystemPrompt);
	if (Array.isArray(normalized.ChannelPromptContext)) normalized.ChannelPromptContext = normalized.ChannelPromptContext.map((entry) => normalizeTextField(entry)).filter((entry) => Boolean(entry));
	const chatType = normalizeChatType(normalized.ChatType);
	if (chatType && (opts.forceChatType || normalized.ChatType !== chatType)) normalized.ChatType = chatType;
	Object.assign(normalized, resolveCanonicalInboundText(normalized, opts));
	normalized.BodyForAgent = normalized.agentText;
	normalized.BodyForCommands = normalized.commandText;
	const explicitLabel = normalizeOptionalString(normalized.ConversationLabel);
	if (!explicitLabel) {
		const resolved = normalizeOptionalString(resolveConversationLabel(normalized));
		if (resolved) normalized.ConversationLabel = resolved;
	} else normalized.ConversationLabel = explicitLabel;
	const suppressCommands = normalized.CommandInterpretationSuppressed === true;
	normalized.CommandAuthorized = !suppressCommands && normalized.CommandAuthorized === true;
	normalized.CommandTurn = suppressCommands ? createCommandTurnContext("message", {
		authorized: false,
		body: ""
	}) : resolveCommandTurnContext(normalized);
	if (normalized.CommandTurn.source === "native" || normalized.CommandTurn.source === "text") {
		normalized.CommandSource = normalized.CommandTurn.source;
		normalized.CommandAuthorized = normalized.CommandTurn.authorized;
	} else normalized.CommandSource = void 0;
	const media = (normalized.MediaStaged === true || normalizeOptionalString(normalized.MediaWorkspaceDir) ? resolveStagedMediaFacts(normalized) : resolveMediaFacts(normalized)).map((fact) => (fact.path || fact.url) && !fact.contentType && !fact.kind ? Object.assign(fact, { contentType: "application/octet-stream" }) : fact);
	if (media.length > 0) {
		normalized.media = media;
		if (preserveLegacyMedia) Object.assign(normalized, projectMediaFacts(media));
	}
	if (!preserveLegacyMedia) stripLegacyMediaContextFields(normalized);
	Object.defineProperty(normalized, FINALIZED_INBOUND_CONTEXT, {
		configurable: true,
		value: true
	});
	return normalized;
}
function finalizeInboundContext(ctx, opts = {}) {
	return finalizeInboundContextImpl(ctx, opts, false);
}
/** Keeps the shipped Plugin SDK return type while internal callers use the stricter type above. */
function finalizeInboundContextForSdk(ctx, opts = {}) {
	return finalizeInboundContextImpl(ctx, opts, true);
}
//#endregion
export { finalizeInboundContextForSdk as n, isFinalizedInboundContext as r, finalizeInboundContext as t };

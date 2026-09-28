import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as createHostChannelInboundEventContextBuilder } from "./host-context-builder-CFkGVEZB.mjs";
import { n as createCommandTurnContext, t as commandTurnKindToSource } from "./command-turn-context-a363iy71.mjs";
import { t as normalizeInboundTextNewlines } from "./inbound-text-B6lb_yrL.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { t as copyConversationBindingRouteFacts } from "./conversation-binding-route-facts-BzDZWweu.mjs";
import { r as shouldIncludeSupplementalContext } from "./context-visibility-C5CaKMWO.mjs";
import { t as buildChannelInboundMediaPayload } from "./media-EVtUZUR6.mjs";
//#region src/channels/inbound-event/context.ts
/**
* Channel inbound event context builder.
*
* Converts route, sender, command, media, and supplemental facts into finalized message context.
*/
function keepSupplementalContext(params) {
	if (!params.mode || params.mode === "all") return true;
	if (params.senderAllowed === void 0) return false;
	return shouldIncludeSupplementalContext({
		mode: params.mode,
		kind: params.kind,
		senderAllowed: params.senderAllowed
	});
}
function filterChannelInboundSupplementalContext(params) {
	const supplemental = params.supplemental;
	if (!supplemental) return;
	const quote = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "quote",
		senderAllowed: supplemental.quote?.senderAllowed
	}) ? supplemental.quote : void 0;
	const forwarded = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "forwarded",
		senderAllowed: supplemental.forwarded?.senderAllowed
	}) ? supplemental.forwarded : void 0;
	const thread = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "thread",
		senderAllowed: supplemental.thread?.senderAllowed
	}) ? supplemental.thread : void 0;
	return {
		...supplemental,
		quote,
		forwarded,
		thread
	};
}
/** Resolves whether a supplemental-context sender passes the active group policy. */
function resolveInboundSupplementalSenderAllowed(params) {
	if (!params.isGroup || params.groupPolicy !== "allowlist") return true;
	return params.isSenderAllowed(params.allowFrom);
}
function filterChannelInboundQuoteContext(contextVisibility, quote) {
	return filterChannelInboundSupplementalContext({
		contextVisibility,
		supplemental: quote ? { quote } : void 0
	})?.quote;
}
function definedFields(fields) {
	return Object.fromEntries(Object.entries(fields).filter((entry) => entry[1] !== void 0));
}
function stripQuoteRuntimeFields(quote) {
	const { media: _media, isSelf: _isSelf, ...stripped } = quote;
	return stripped;
}
function resolveChannelInboundSupplementalForFinalizer(params) {
	const rawSupplemental = params.supplemental;
	const filtered = filterChannelInboundSupplementalContext({
		supplemental: rawSupplemental,
		contextVisibility: params.contextVisibility
	});
	const media = [...params.media ?? []];
	if (!rawSupplemental?.quote || !filtered?.quote) return {
		rawSupplemental,
		supplemental: filtered,
		media
	};
	const quote = filtered.quote;
	const selfQuote = quote.isSelf === true;
	const suppressSelfQuoteBody = params.suppressSelfQuoteBody ?? true;
	const suppressSelfQuoteMedia = params.suppressSelfQuoteMedia ?? true;
	const finalizeQuote = (quoteMedia) => {
		if (!(selfQuote && suppressSelfQuoteMedia)) media.push(...quoteMedia ?? []);
		const stripped = stripQuoteRuntimeFields(quote);
		const visibleQuote = selfQuote && suppressSelfQuoteBody ? (({ body: _body, ...withoutBody }) => withoutBody)(stripped) : stripped;
		return {
			rawSupplemental,
			supplemental: {
				...filtered,
				quote: visibleQuote
			},
			media
		};
	};
	if (selfQuote && suppressSelfQuoteMedia) return finalizeQuote(void 0);
	if (!params.resolveSupplementalMedia) return finalizeQuote(Array.isArray(quote.media) ? quote.media : void 0);
	if (typeof quote.media !== "function") return finalizeQuote(quote.media);
	const resolved = quote.media();
	return isPromiseLike(resolved) ? resolved.then(finalizeQuote) : finalizeQuote(resolved);
}
function finalizePreparedChannelInboundContext(params) {
	const mediaPayload = params.media ? definedFields(buildChannelInboundMediaPayload([...params.media])) : {};
	const baseContext = {
		...params.originalContext,
		SupplementalContext: params.supplemental,
		...params.media ? { media: [...params.media] } : {},
		...mediaPayload
	};
	const channelStructuredContext = resolveChannelStructuredContext({
		supplemental: params.supplemental,
		extra: baseContext
	});
	const structuredContextField = channelStructuredContext.kind === "present" ? { ChannelStructuredContext: channelStructuredContext.entries } : {};
	return {
		context: (params.finalize ?? finalizeInboundContext)({
			...baseContext,
			...structuredContextField
		}, params.finalizeOptions),
		supplemental: params.supplemental,
		quoteHidden: Boolean(params.rawSupplemental?.quote && !params.supplemental?.quote),
		forwardedHidden: Boolean(params.rawSupplemental?.forwarded && !params.supplemental?.forwarded),
		threadHidden: Boolean(params.rawSupplemental?.thread && !params.supplemental?.thread)
	};
}
function finalizeChannelInboundContextValue(params) {
	const contextSupplemental = params.context.SupplementalContext;
	const prepared = resolveChannelInboundSupplementalForFinalizer({
		supplemental: params.supplemental ?? contextSupplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		resolveSupplementalMedia: params.resolveSupplementalMedia,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	});
	const finish = (result) => finalizePreparedChannelInboundContext({
		originalContext: params.context,
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		...result
	});
	if (params.resolveSupplementalMedia) return Promise.resolve(prepared).then(finish);
	return isPromiseLike(prepared) ? prepared.then(finish) : finish(prepared);
}
function finalizeChannelInboundContext(params) {
	return finalizeChannelInboundContextValue(params);
}
function resolveIngressCommandAuthorized(access) {
	return access?.commands?.authorized;
}
function normalizeUntrustedGroupPrompt(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeInboundTextNewlines(value);
	return normalized.trim().length > 0 ? normalized : void 0;
}
function resolveChannelStructuredContext(params) {
	const entries = [];
	const extraEntries = params.extra?.ChannelStructuredContext ?? params.extra?.UntrustedStructuredContext;
	if (Array.isArray(extraEntries)) entries.push(...extraEntries);
	const supplementalEntries = params.supplemental?.channelStructuredContext ?? params.supplemental?.untrustedContext;
	if (supplementalEntries !== void 0) entries.push(...supplementalEntries);
	const groupPrompt = normalizeUntrustedGroupPrompt(params.supplemental?.untrustedGroupSystemPrompt);
	if (groupPrompt) entries.push({
		label: "Group prompt context",
		type: "group_prompt_context",
		payload: { text: groupPrompt }
	});
	return extraEntries !== void 0 || supplementalEntries !== void 0 || groupPrompt !== void 0 ? {
		kind: "present",
		entries
	} : { kind: "absent" };
}
function resolveChannelCommandContext(params) {
	if (params.commandTurn) return params.commandTurn;
	const command = params.command;
	if (!command) return;
	const body = command.body ?? params.message.commandBody ?? params.message.rawBody;
	return createCommandTurnContext(commandTurnKindToSource(command.kind), {
		authorized: command.kind === "normal" ? false : command.authorized ?? resolveIngressCommandAuthorized(params.access) === true,
		commandName: command.name,
		body
	});
}
function buildChannelInboundEventContext(params) {
	return buildChannelInboundEventContextValue(params);
}
const buildHostChannelInboundEventContextValue = createHostChannelInboundEventContextBuilder(buildChannelInboundEventContextValue);
function buildHostChannelInboundEventContext(params) {
	return buildHostChannelInboundEventContextValue(params);
}
function buildChannelInboundEventContextValue(params) {
	const body = params.message.body ?? params.message.rawBody;
	const commandTurn = resolveChannelCommandContext({
		command: params.command,
		commandTurn: params.commandTurn,
		message: params.message,
		access: params.access
	});
	const context = {
		Body: body,
		InboundEventKind: params.message.inboundEventKind ?? "user_request",
		BodyForAgent: params.message.bodyForAgent ?? params.message.rawBody,
		InboundHistory: params.message.inboundHistory,
		SessionTranscriptContext: params.sessionTranscript && params.sessionTranscript.historyLimit > 0 ? params.sessionTranscript : void 0,
		SourceModality: params.message.sourceModality,
		RawBody: params.message.rawBody,
		CommandBody: params.message.commandBody ?? params.message.rawBody,
		BodyForCommands: params.message.commandBody ?? params.message.rawBody,
		From: params.from,
		To: params.reply.to,
		SessionKey: params.route.dispatchSessionKey ?? params.route.routeSessionKey,
		AgentId: params.route.agentId,
		DmScope: params.route.dmScope,
		AccountId: params.route.accountId ?? params.accountId,
		ParentSessionKey: params.route.parentSessionKey,
		ModelParentSessionKey: params.route.modelParentSessionKey,
		MessageSid: params.messageId,
		MessageSidFull: params.messageIdFull,
		ReplyToId: params.reply.replyToId,
		ReplyToIdFull: params.reply.replyToIdFull,
		ChatType: params.conversation.kind,
		ChatId: params.conversation.id,
		ConversationRoutePeerId: params.conversation.routePeer?.id,
		ConversationLabel: params.conversation.label,
		GroupSubject: params.conversation.kind !== "direct" ? params.conversation.label : void 0,
		GroupSpace: params.conversation.spaceId,
		SenderName: params.sender.name ?? params.sender.displayLabel,
		SenderId: params.sender.id,
		SenderUsername: params.sender.username,
		SenderTag: params.sender.tag,
		SenderIsBot: params.sender.isBot,
		SenderIsSelf: params.sender.isSelf === true ? true : void 0,
		MemberRoleIds: params.sender.roles,
		Timestamp: params.timestamp,
		Provider: params.provider ?? params.channel,
		Surface: params.surface ?? params.provider ?? params.channel,
		WasMentioned: params.access?.mentions?.wasMentioned,
		GroupRequireMention: params.access?.mentions?.requireMention,
		ExplicitlyMentionedBot: params.access?.mentions?.explicitlyMentionedBot,
		MentionedUserIds: params.access?.mentions?.mentionedUserIds,
		MentionedSubteamIds: params.access?.mentions?.mentionedSubteamIds,
		ImplicitMentionKinds: params.access?.mentions?.implicitMentionKinds,
		MentionSource: params.access?.mentions?.mentionSource,
		CommandAuthorized: resolveIngressCommandAuthorized(params.access) === true,
		ConversationToolPolicy: params.access?.toolPolicy,
		CommandTurn: commandTurn,
		MessageThreadId: params.reply.messageThreadId ?? params.conversation.threadId,
		NativeChannelId: params.reply.nativeChannelId ?? params.conversation.nativeChannelId,
		ConversationAvatar: params.conversation.avatar,
		ChannelContext: params.channelContext,
		OriginatingChannel: params.channel,
		OriginatingTo: params.reply.originatingTo ?? params.reply.to,
		ThreadParentId: params.reply.threadParentId ?? params.conversation.parentId,
		InboundAccessAuthorized: true,
		ConversationRouteContextObserved: params.conversation.routePeer ? true : void 0,
		...params.extra
	};
	copyConversationBindingRouteFacts(params.route, context);
	const finalizeParams = {
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		supplemental: params.supplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		context
	};
	const result = params.resolveSupplementalMedia ? finalizeChannelInboundContextValue({
		...finalizeParams,
		resolveSupplementalMedia: true,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	}) : finalizeChannelInboundContextValue(finalizeParams);
	const unwrap = (finalized) => finalized.context;
	return isPromiseLike(result) ? result.then(unwrap) : unwrap(result);
}
//#endregion
export { finalizeChannelInboundContext as a, filterChannelInboundSupplementalContext as i, buildHostChannelInboundEventContext as n, resolveInboundSupplementalSenderAllowed as o, filterChannelInboundQuoteContext as r, buildChannelInboundEventContext as t };

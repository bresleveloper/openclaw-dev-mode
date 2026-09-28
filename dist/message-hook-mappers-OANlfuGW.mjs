import { l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { D as freezeDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { r as stripChannelPrefix } from "./string-readers-Dkx3Z36w.mjs";
import { n as internalSessionConversationId } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { l as normalizeMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
//#region src/hooks/message-hook-media.ts
/** Copies runtime media into the public hook shape without internal staging/hydration flags. */
function projectMessageHookMediaFacts(media) {
	return (media ?? []).map((fact) => {
		const projected = {};
		if (fact.path !== void 0) projected.path = fact.path;
		if (fact.url !== void 0) projected.url = fact.url;
		if (fact.contentType !== void 0) projected.contentType = fact.contentType;
		if (fact.kind !== void 0) projected.kind = fact.kind;
		if (fact.transcribed === true) projected.transcribed = true;
		if (fact.messageId !== void 0) projected.messageId = fact.messageId;
		if (fact.workspaceDir !== void 0) projected.workspaceDir = fact.workspaceDir;
		return projected;
	});
}
//#endregion
//#region src/hooks/message-hook-mappers.ts
function assignRemoteMediaStagingMetadata(target, canonical) {
	const metadata = {
		mediaRemoteHost: canonical.mediaRemoteHost,
		mediaStagingPending: canonical.mediaStagingPending,
		originalMediaPath: canonical.originalMediaPath,
		originalMediaUrl: canonical.originalMediaUrl,
		originalMediaType: canonical.originalMediaType,
		originalMediaPaths: canonical.originalMediaPaths,
		originalMediaUrls: canonical.originalMediaUrls,
		originalMediaTypes: canonical.originalMediaTypes
	};
	for (const [key, value] of Object.entries(metadata)) if (value !== void 0) target[key] = value;
}
function projectHookMediaState(canonical) {
	const stagingPending = canonical.mediaStagingPending === true;
	const media = stagingPending ? void 0 : canonical.media;
	const originalMedia = canonical.originalMedia ?? (stagingPending ? canonical.media : void 0);
	return {
		...media?.length ? { media: media.map((entry) => Object.assign({}, entry)) } : {},
		...originalMedia?.length ? { originalMedia: originalMedia.map((entry) => Object.assign({}, entry)) } : {},
		...stagingPending ? { mediaStagingPending: true } : {}
	};
}
function deriveInboundMessageHookContextBase(ctx, overrides) {
	const content = overrides?.content ?? readNonBlankString(ctx.BodyForCommands) ?? readNonBlankString(ctx.RawBody) ?? readNonBlankString(ctx.Body) ?? "";
	const channelId = normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel ?? ctx.Surface ?? ctx.Provider ?? "");
	const conversationId = ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? internalSessionConversationId(channelId, ctx.SessionKey);
	const isGroup = Boolean(ctx.GroupSubject || ctx.GroupChannel);
	const media = normalizeMediaFacts(ctx.media);
	const hookMedia = projectMessageHookMediaFacts(media);
	const compact = (values) => {
		const entries = values.filter((value) => Boolean(value));
		return entries.length > 0 ? entries : void 0;
	};
	const mediaPaths = compact(media.map((fact) => fact.path));
	const mediaUrls = compact(media.map((fact) => fact.url ?? fact.path));
	const mediaTypes = compact(media.map((fact) => fact.contentType ?? fact.kind));
	const firstMedia = media[0];
	const hasLocation = typeof ctx.LocationLat === "number" && Number.isFinite(ctx.LocationLat) && typeof ctx.LocationLon === "number" && Number.isFinite(ctx.LocationLon);
	const locationSource = ctx.LocationSource === "pin" || ctx.LocationSource === "place" || ctx.LocationSource === "live" ? ctx.LocationSource : void 0;
	const providerUpdateId = normalizeOptionalString(ctx.ProviderUpdateId);
	const providerUpdateKind = normalizeOptionalString(ctx.ProviderUpdateKind);
	return {
		from: ctx.From ?? "",
		to: ctx.To,
		content,
		body: ctx.Body,
		bodyForAgent: ctx.BodyForAgent,
		transcript: ctx.Transcript,
		timestamp: typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0,
		channelId,
		accountId: ctx.AccountId,
		conversationId,
		sessionKey: ctx.SessionKey,
		agentId: ctx.AgentId,
		messageId: normalizeOptionalString(overrides?.messageId) ?? normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid) ?? normalizeOptionalString(ctx.MessageSidFirst) ?? normalizeOptionalString(ctx.MessageSidLast),
		senderId: ctx.SenderId,
		senderName: ctx.SenderName,
		senderUsername: ctx.SenderUsername,
		senderE164: ctx.SenderE164,
		replyToId: ctx.ReplyToId,
		replyToIdFull: ctx.ReplyToIdFull,
		replyToBody: ctx.ReplyToBody,
		replyToSender: ctx.ReplyToSender,
		replyToIsQuote: ctx.ReplyToIsQuote,
		provider: ctx.Provider,
		surface: ctx.Surface,
		threadId: ctx.MessageThreadId,
		threadParentId: ctx.ThreadParentId,
		...hookMedia.length > 0 ? { media: hookMedia } : {},
		mediaPath: firstMedia?.path ?? mediaPaths?.[0],
		mediaUrl: firstMedia?.url ?? firstMedia?.path ?? mediaUrls?.[0],
		mediaType: firstMedia?.contentType ?? firstMedia?.kind ?? mediaTypes?.[0],
		mediaPaths,
		mediaUrls,
		mediaTypes,
		originatingChannel: ctx.OriginatingChannel,
		originatingTo: ctx.OriginatingTo,
		guildId: ctx.GroupSpace,
		channelName: ctx.GroupChannel,
		isGroup,
		groupId: isGroup ? conversationId : void 0,
		topicName: ctx.TopicName,
		...hasLocation ? { location: {
			latitude: ctx.LocationLat,
			longitude: ctx.LocationLon,
			...typeof ctx.LocationAccuracy === "number" ? { accuracy: ctx.LocationAccuracy } : {},
			...ctx.LocationName ? { name: ctx.LocationName } : {},
			...ctx.LocationAddress ? { address: ctx.LocationAddress } : {},
			...locationSource ? { source: locationSource } : {},
			...typeof ctx.LocationIsLive === "boolean" ? { isLive: ctx.LocationIsLive } : {},
			...typeof ctx.LocationLivePeriodSeconds === "number" && Number.isFinite(ctx.LocationLivePeriodSeconds) ? { livePeriodSeconds: ctx.LocationLivePeriodSeconds } : {},
			...ctx.LocationCaption ? { caption: ctx.LocationCaption } : {}
		} } : {},
		...providerUpdateId && providerUpdateKind ? { providerUpdate: {
			id: providerUpdateId,
			kind: providerUpdateKind,
			...normalizeOptionalString(ctx.MessageSidFull ?? ctx.MessageSid) ? { messageId: normalizeOptionalString(ctx.MessageSidFull ?? ctx.MessageSid) } : {},
			...typeof ctx.ProviderMessageTimestamp === "number" && Number.isFinite(ctx.ProviderMessageTimestamp) ? { messageTimestamp: ctx.ProviderMessageTimestamp } : {},
			...typeof ctx.ProviderEditTimestamp === "number" && Number.isFinite(ctx.ProviderEditTimestamp) ? { editedTimestamp: ctx.ProviderEditTimestamp } : {}
		} } : {}
	};
}
function deriveInboundMessageHookContext(ctx, overrides) {
	return deriveInboundMessageHookContextBase(ctx, overrides);
}
function buildCanonicalSentMessageHookContext(params) {
	return {
		to: params.to,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: params.channelId,
		accountId: params.accountId,
		conversationId: params.conversationId ?? params.to,
		sessionKey: params.sessionKey,
		runId: params.runId,
		messageId: params.messageId,
		trace: params.trace,
		callDepth: params.callDepth,
		isGroup: params.isGroup,
		groupId: params.groupId
	};
}
/** Resolves the outbound hook target for a reply produced by an inbound channel turn. */
function resolveInboundReplyHookTarget(finalized, hookCtx) {
	if (typeof finalized.OriginatingTo === "string" && finalized.OriginatingTo.trim()) return finalized.OriginatingTo;
	if (hookCtx.isGroup) return hookCtx.conversationId ?? hookCtx.to ?? hookCtx.from;
	return hookCtx.from || hookCtx.conversationId || hookCtx.to || "";
}
function assignTraceFields(target, trace) {
	if (!trace) return;
	const safeTrace = freezeDiagnosticTraceContext(trace);
	target.trace = safeTrace;
	target.traceId = safeTrace.traceId;
	if (safeTrace.spanId) target.spanId = safeTrace.spanId;
	if (safeTrace.parentSpanId) target.parentSpanId = safeTrace.parentSpanId;
}
function projectHookReplyFields(canonical) {
	return {
		..."replyToId" in canonical && canonical.replyToId !== void 0 ? { replyToId: canonical.replyToId } : {},
		..."replyToIdFull" in canonical && canonical.replyToIdFull !== void 0 ? { replyToIdFull: canonical.replyToIdFull } : {},
		..."replyToBody" in canonical && canonical.replyToBody !== void 0 ? { replyToBody: canonical.replyToBody } : {},
		..."replyToSender" in canonical && canonical.replyToSender !== void 0 ? { replyToSender: canonical.replyToSender } : {},
		..."replyToIsQuote" in canonical && canonical.replyToIsQuote !== void 0 ? { replyToIsQuote: canonical.replyToIsQuote } : {}
	};
}
function toPluginMessageContext(canonical) {
	const context = {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId
	};
	if (canonical.sessionKey) context.sessionKey = canonical.sessionKey;
	if (canonical.runId) context.runId = canonical.runId;
	if (canonical.messageId) context.messageId = canonical.messageId;
	if ("senderId" in canonical && canonical.senderId) context.senderId = canonical.senderId;
	Object.assign(context, projectHookReplyFields(canonical));
	assignTraceFields(context, canonical.trace);
	if (canonical.callDepth != null) context.callDepth = canonical.callDepth;
	return context;
}
function resolveInboundConversation(canonical) {
	const channelId = normalizeChannelId(canonical.channelId);
	const pluginResolved = channelId ? getChannelPlugin(channelId)?.messaging?.resolveInboundConversation?.({
		from: canonical.from,
		to: canonical.to ?? canonical.originatingTo,
		conversationId: canonical.conversationId,
		threadId: canonical.threadId,
		threadParentId: canonical.threadParentId,
		isGroup: canonical.isGroup
	}) : void 0;
	if (pluginResolved === null) return {};
	if (pluginResolved) return {
		conversationId: normalizeOptionalString(pluginResolved.conversationId),
		parentConversationId: normalizeOptionalString(pluginResolved.parentConversationId)
	};
	return { conversationId: stripChannelPrefix(canonical.to ?? canonical.originatingTo ?? canonical.conversationId, canonical.channelId) };
}
function buildPluginInboundClaimContext(canonical, conversation) {
	const context = {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: conversation.conversationId,
		sessionKey: canonical.sessionKey,
		agentId: canonical.agentId,
		parentConversationId: conversation.parentConversationId,
		senderId: canonical.senderId,
		messageId: canonical.messageId,
		runId: canonical.runId,
		callDepth: canonical.callDepth
	};
	Object.assign(context, projectHookReplyFields(canonical));
	assignTraceFields(context, canonical.trace);
	return context;
}
function buildPluginInboundClaimEvent(canonical, context, extras) {
	const event = {
		content: canonical.content,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		transcript: canonical.transcript,
		timestamp: canonical.timestamp,
		channel: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: context.conversationId,
		parentConversationId: context.parentConversationId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		...projectHookReplyFields(canonical),
		threadId: canonical.threadId,
		messageId: canonical.messageId,
		sessionKey: canonical.sessionKey,
		runId: canonical.runId,
		isGroup: canonical.isGroup,
		commandAuthorized: extras?.commandAuthorized,
		wasMentioned: extras?.wasMentioned,
		...canonical.location ? { location: { ...canonical.location } } : {},
		...canonical.providerUpdate ? { providerUpdate: { ...canonical.providerUpdate } } : {},
		...projectHookMediaState(canonical),
		metadata: {
			from: canonical.from,
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			senderE164: canonical.senderE164,
			replyToId: canonical.replyToId,
			replyToIdFull: canonical.replyToIdFull,
			replyToBody: canonical.replyToBody,
			replyToSender: canonical.replyToSender,
			replyToIsQuote: canonical.replyToIsQuote,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			groupId: canonical.groupId,
			topicName: canonical.topicName
		}
	};
	if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
	assignTraceFields(event, canonical.trace);
	return event;
}
function toPluginInboundClaimPair(canonical, extras) {
	const context = buildPluginInboundClaimContext(canonical, resolveInboundConversation(canonical));
	return {
		context,
		event: buildPluginInboundClaimEvent(canonical, context, extras)
	};
}
function toPluginMessageReceivedEvent(canonical) {
	const event = {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		threadId: canonical.threadId,
		messageId: canonical.messageId,
		senderId: canonical.senderId,
		...projectHookReplyFields(canonical),
		sessionKey: canonical.sessionKey,
		runId: canonical.runId,
		...canonical.location ? { location: { ...canonical.location } } : {},
		...canonical.providerUpdate ? { providerUpdate: { ...canonical.providerUpdate } } : {},
		...projectHookMediaState(canonical),
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			messageId: canonical.messageId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			replyToId: canonical.replyToId,
			replyToIdFull: canonical.replyToIdFull,
			replyToBody: canonical.replyToBody,
			replyToSender: canonical.replyToSender,
			replyToIsQuote: canonical.replyToIsQuote,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			topicName: canonical.topicName
		}
	};
	if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
	assignTraceFields(event, canonical.trace);
	return event;
}
function toPluginMessageSentEvent(canonical) {
	const event = {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.messageId ? { messageId: canonical.messageId } : {},
		...canonical.sessionKey ? { sessionKey: canonical.sessionKey } : {},
		...canonical.runId ? { runId: canonical.runId } : {},
		...canonical.error ? { error: canonical.error } : {}
	};
	assignTraceFields(event, canonical.trace);
	return event;
}
function toInternalMessageReceivedContext(canonical) {
	const context = {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		...projectHookMediaState(canonical),
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
			mediaUrl: canonical.mediaStagingPending ? void 0 : canonical.mediaUrl,
			mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType,
			mediaPaths: canonical.mediaStagingPending ? void 0 : canonical.mediaPaths,
			mediaUrls: canonical.mediaStagingPending ? void 0 : canonical.mediaUrls,
			mediaTypes: canonical.mediaStagingPending ? void 0 : canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			topicName: canonical.topicName
		}
	};
	if (context.metadata) assignRemoteMediaStagingMetadata(context.metadata, canonical);
	return context;
}
function toInternalMessageTranscribedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript ?? "",
		cfg
	};
}
function toInternalMessagePreprocessedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript,
		isGroup: canonical.isGroup,
		groupId: canonical.groupId,
		cfg
	};
}
function toInternalInboundMessageHookContextBase(canonical) {
	return {
		from: canonical.from,
		to: canonical.to,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		provider: canonical.provider,
		surface: canonical.surface,
		...projectHookMediaState(canonical),
		mediaPath: canonical.mediaStagingPending ? void 0 : canonical.mediaPath,
		mediaType: canonical.mediaStagingPending ? void 0 : canonical.mediaType
	};
}
function toInternalMessageSentContext(canonical) {
	return {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.error ? { error: canonical.error } : {},
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		...canonical.isGroup != null ? { isGroup: canonical.isGroup } : {},
		...canonical.groupId ? { groupId: canonical.groupId } : {}
	};
}
//#endregion
export { toInternalMessageReceivedContext as a, toPluginInboundClaimPair as c, toPluginMessageSentEvent as d, toInternalMessagePreprocessedContext as i, toPluginMessageContext as l, deriveInboundMessageHookContext as n, toInternalMessageSentContext as o, resolveInboundReplyHookTarget as r, toInternalMessageTranscribedContext as s, buildCanonicalSentMessageHookContext as t, toPluginMessageReceivedEvent as u };

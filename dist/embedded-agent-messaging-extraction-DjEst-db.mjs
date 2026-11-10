import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation } from "./payload-qyD1vby_.mjs";
import "./plugins-CCVkYF8m.mjs";
import { a as readToolResultDetails } from "./tool-result-error-IpvGgAny.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { a as isMessagingToolTargetEvidenceAction } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { r as isDeliveredCurrentSourceReply } from "./source-reply-mirror-CTIZpZKi.mjs";
//#region src/agents/embedded-agent-messaging-extraction.ts
/** Extracts message delivery evidence from embedded-agent tool calls and results. */
function extractMessagingToolSourceReplyPayload(result) {
	const details = readToolResultDetails(result);
	if (!details || details.sourceReplySink !== "internal-ui") return;
	const status = normalizeOptionalLowercaseString(details.deliveryStatus);
	if (status && status !== "sent") return;
	return readSourceReplyPayload(asOptionalRecord(details.sourceReply) ?? details, details);
}
/**
* Reads the final reply a `canDeliverSourceReply` tool authored in `details.sourceReply`.
* Unlike internal-ui mirrors, nothing has been sent yet: the host delivers the payload
* to the current source and records it in the transcript after delivery. A reply needs
* text or media; `final: false` is not a deliverable reply, so the model continues as
* usual. Callers must already have verified the tool's capability and invocation scope.
*/
function extractToolAuthoredSourceReplyPayload(result) {
	const details = readToolResultDetails(result);
	const sourceReply = details ? asOptionalRecord(details.sourceReply) : void 0;
	if (!details || !sourceReply || sourceReply.final === false) return;
	const payload = readSourceReplyPayload(sourceReply);
	if (!payload) return;
	return Boolean(payload.text?.trim()) || resolveSourceReplyMediaUrls(payload).length > 0 ? payload : void 0;
}
/**
* The media a source reply delivers: `mediaUrls` when present, else `mediaUrl`,
* without blank entries. Delivery and tool-authored admission share it.
*/
function resolveSourceReplyMediaUrls(payload) {
	return (payload.mediaUrls?.length ? payload.mediaUrls : payload.mediaUrl ? [payload.mediaUrl] : []).filter((value) => value.trim().length > 0);
}
function readSourceReplyPayload(sourceReply, legacyDetails) {
	const payload = {};
	const copyText = (key, fallback = key) => {
		const value = readStringValue(sourceReply[key]) ?? readStringValue(legacyDetails?.[fallback]);
		if (value) payload[key] = value;
	};
	copyText("text", "message");
	copyText("mediaUrl");
	const mediaUrls = (Array.isArray(sourceReply.mediaUrls) ? sourceReply.mediaUrls : Array.isArray(legacyDetails?.mediaUrls) ? legacyDetails.mediaUrls : []).filter((value) => typeof value === "string");
	if (mediaUrls.length > 0) payload.mediaUrls = mediaUrls;
	if (Array.isArray(sourceReply.attachments)) {
		const attachments = sourceReply.attachments.flatMap((value) => {
			const attachment = asOptionalRecord(value);
			if (!attachment) return [];
			const projected = {};
			for (const key of [
				"path",
				"url",
				"mediaUrl",
				"filePath",
				"mimeType",
				"name"
			]) {
				const fieldText = readStringValue(attachment[key]);
				if (fieldText) projected[key] = fieldText;
			}
			if (typeof attachment.trustedLocalMedia === "boolean") projected.trustedLocalMedia = attachment.trustedLocalMedia;
			for (const key of [
				"durationMs",
				"width",
				"height"
			]) {
				const number = asNonNegativeFiniteNumber(attachment[key]);
				if (number !== void 0) projected[key] = number;
			}
			return [projected];
		});
		if (attachments.length > 0) payload.attachments = attachments;
	}
	if (typeof sourceReply.trustedLocalMedia === "boolean") payload.trustedLocalMedia = sourceReply.trustedLocalMedia;
	if (sourceReply.audioAsVoice === true || legacyDetails?.audioAsVoice === true) payload.audioAsVoice = true;
	const presentation = normalizeMessagePresentation(sourceReply.presentation);
	if (presentation) payload.presentation = presentation;
	const interactive = normalizeLegacyInteractiveReply(sourceReply.interactive);
	if (interactive) payload.interactive = interactive;
	const channelData = asOptionalRecord(sourceReply.channelData);
	if (channelData) payload.channelData = { ...channelData };
	copyText("idempotencyKey");
	if (legacyDetails?.sourceReplyTranscriptOwner === true) payload.transcriptOwner = true;
	return Object.keys(payload).length > 0 ? payload : void 0;
}
function resolveMessagingToolThreadEvidence(params) {
	const threading = getChannelPlugin(params.providerId)?.threading;
	const autoThreadResolver = params.allowImplicitThread ? threading?.resolveAutoThreadId : void 0;
	const replyTransport = params.replyToId ? threading?.resolveReplyTransport?.({
		cfg: params.options?.config ?? {},
		accountId: params.accountId,
		threadId: params.threadId,
		replyToId: params.replyToId
	}) : void 0;
	const transportThreadId = normalizeOptionalStringifiedId(replyTransport?.threadId);
	const replyToThreadId = replyTransport?.threadId === null ? normalizeOptionalString(replyTransport.replyToId) : void 0;
	const explicitThreadId = transportThreadId ?? replyToThreadId ?? params.threadId;
	const currentChannelId = normalizeOptionalString(params.options?.currentChannelId);
	const currentMessagingTarget = normalizeOptionalString(params.options?.currentMessagingTarget);
	const currentThreadId = normalizeOptionalString(params.options?.currentThreadId);
	const replyToMode = params.options?.replyToMode ?? (currentThreadId ? "all" : void 0);
	const canResolveCurrentThread = Boolean((currentChannelId || currentMessagingTarget) && currentThreadId);
	const resolvedCurrentThreadId = !explicitThreadId && !params.threadSuppressed && autoThreadResolver && canResolveCurrentThread ? autoThreadResolver({
		cfg: params.options?.config ?? {},
		accountId: params.accountId,
		to: params.to,
		replyToId: params.replyToId,
		toolContext: {
			currentChannelId,
			currentMessagingTarget,
			currentThreadTs: currentThreadId,
			currentMessageId: params.options?.currentMessageId,
			replyToMode,
			hasRepliedRef: params.options?.hasRepliedRef
		}
	}) : void 0;
	const threadImplicit = !explicitThreadId && !params.threadSuppressed && Boolean(autoThreadResolver) && (!canResolveCurrentThread || Boolean(resolvedCurrentThreadId));
	return {
		...explicitThreadId ?? resolvedCurrentThreadId ? { threadId: explicitThreadId ?? resolvedCurrentThreadId } : {},
		...threadImplicit ? { threadImplicit: true } : {},
		...params.threadSuppressed ? { threadSuppressed: true } : {}
	};
}
function extractMessagingToolSend(toolName, args, options) {
	const action = normalizeOptionalString(args.action) ?? "";
	const accountId = normalizeOptionalString(args.accountId);
	if (toolName === "conversations_send" || toolName === "conversations_turn") {
		const conversationRef = normalizeOptionalString(args.conversationRef);
		return conversationRef ? {
			tool: toolName,
			provider: "conversation",
			to: conversationRef
		} : void 0;
	}
	let providerId;
	let provider;
	let to;
	let resolvedAccountId;
	let threadId;
	let outboundReplyToId;
	let threadSuppressed;
	let allowImplicitThread;
	if (toolName === "message") {
		if (!isMessagingToolTargetEvidenceAction(toolName, args)) return;
		const providerRaw = normalizeOptionalString(args.provider) ?? "";
		const channelRaw = normalizeOptionalString(args.channel) ?? "";
		const providerHint = providerRaw || channelRaw;
		providerId = providerHint ? normalizeAnyChannelId(providerHint) : null;
		const currentChannelId = options?.currentChannelId;
		const currentMessagingTarget = options?.currentMessagingTarget;
		let toRaw = normalizeOptionalString(args.target) ?? normalizeOptionalString(args.to) ?? normalizeOptionalString(args.channelId);
		if (!toRaw) {
			const aliases = providerId ? getChannelPlugin(providerId)?.actions?.messageActionTargetAliases?.[action]?.deliveryTargetAliases : void 0;
			for (const alias of aliases ?? []) {
				toRaw = normalizeOptionalStringifiedId(args[alias]);
				if (toRaw) break;
			}
			toRaw ??= currentMessagingTarget ?? currentChannelId;
		}
		if (!toRaw) return;
		provider = providerId ?? normalizeOptionalLowercaseString(providerHint) ?? "message";
		const pluginExtractionArgs = {
			...args,
			to: toRaw
		};
		const pluginExtracted = providerId ? getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args: pluginExtractionArgs }) : null;
		to = normalizeTargetForProvider(provider, pluginExtracted?.to ?? toRaw);
		resolvedAccountId = normalizeOptionalString(pluginExtracted?.accountId) ?? accountId;
		threadId = normalizeOptionalString(pluginExtracted?.threadId) ?? normalizeOptionalString(args.threadId);
		const replyToId = normalizeOptionalString(args.replyTo);
		outboundReplyToId = action === "send" ? replyToId : void 0;
		threadSuppressed = pluginExtracted?.threadSuppressed === true || args.topLevel === true || args.threadId === null;
		allowImplicitThread = Boolean(to && providerId) && (!pluginExtracted || pluginExtracted.threadImplicit === true);
	} else {
		providerId = normalizeAnyChannelId(toolName);
		if (!providerId) return;
		provider = providerId;
		const extracted = getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args });
		if (!extracted?.to) return;
		to = normalizeTargetForProvider(providerId, extracted.to);
		threadId = normalizeOptionalString(extracted.threadId);
		threadSuppressed = extracted.threadSuppressed === true;
		resolvedAccountId = normalizeOptionalString(extracted.accountId) ?? accountId;
		const nativeReplyToMode = options?.replyToMode;
		const nativeSingleUseMode = nativeReplyToMode === "first" || nativeReplyToMode === "batched";
		allowImplicitThread = extracted.threadImplicit === true && nativeReplyToMode !== void 0 && (!nativeSingleUseMode || options?.hasRepliedRef !== void 0);
	}
	return to ? {
		tool: toolName,
		provider,
		accountId: resolvedAccountId,
		to,
		...providerId ? resolveMessagingToolThreadEvidence({
			providerId,
			to,
			accountId: resolvedAccountId,
			threadId,
			replyToId: outboundReplyToId,
			allowImplicitThread,
			threadSuppressed,
			options
		}) : {
			...threadId ? { threadId } : {},
			...threadSuppressed ? { threadSuppressed: true } : {}
		}
	} : void 0;
}
/** Reconciles pending send evidence with the provider's successful action result. */
function extractMessagingToolSendResult(pending, result) {
	const providerId = normalizeAnyChannelId(pending.provider);
	const extracted = providerId ? getChannelPlugin(providerId)?.actions?.extractToolSendResult?.({
		result,
		send: {
			to: pending.to ?? "",
			accountId: pending.accountId,
			threadId: pending.threadId,
			threadImplicit: pending.threadImplicit,
			threadSuppressed: pending.threadSuppressed
		}
	}) : null;
	if (!extracted?.to) return pending;
	const threadEvidence = normalizeOptionalString(extracted.threadId) != null || extracted.threadImplicit === true || extracted.threadSuppressed === true ? extracted : pending;
	return {
		...pending,
		...extracted,
		accountId: normalizeOptionalString(extracted.accountId) ?? pending.accountId,
		to: normalizeTargetForProvider(providerId ?? pending.provider, extracted.to),
		threadId: normalizeOptionalString(threadEvidence.threadId),
		threadImplicit: threadEvidence.threadImplicit === true ? true : void 0,
		threadSuppressed: threadEvidence.threadSuppressed === true ? true : void 0
	};
}
function isDeliveredMessagingToolSendToCurrentSource(params) {
	const send = params.send;
	if (!send?.to) return false;
	return isDeliveredCurrentSourceReply({
		action: "send",
		channel: send.provider,
		accountId: send.accountId,
		currentAccountId: params.currentAccountId,
		actionParams: {
			target: send.to,
			...send.threadSuppressed ? { topLevel: true } : send.threadId ? { threadId: send.threadId } : {}
		},
		cfg: params.config ?? {},
		sessionKey: params.sessionKey,
		toolContext: {
			currentChannelProvider: params.currentProvider,
			currentChannelId: params.currentChannelId,
			currentMessagingTarget: params.currentMessagingTarget,
			currentThreadTs: params.currentThreadId
		},
		deliveredPayload: params.deliveredPayload
	});
}
//#endregion
export { isDeliveredMessagingToolSendToCurrentSource as a, extractToolAuthoredSourceReplyPayload as i, extractMessagingToolSendResult as n, resolveSourceReplyMediaUrls as o, extractMessagingToolSourceReplyPayload as r, extractMessagingToolSend as t };

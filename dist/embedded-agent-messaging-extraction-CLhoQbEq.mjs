import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation } from "./payload-COvcWceu.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { r as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-CXyAxVII.mjs";
import { o as readToolResultDetails } from "./tool-result-error-CWadvCKd.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-Bh4bVQxW.mjs";
import { o as isMessagingToolTargetEvidenceAction } from "./embedded-agent-messaging-Beh3oN8O.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-z42MPFVT.mjs";
import { a as extractToolResultText } from "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import { t as stripMarkdown } from "./strip-markdown-B0Wv9_X8.mjs";
import { r as isDeliveredCurrentSourceReply } from "./source-reply-mirror-j9UtGaWj.mjs";
//#region src/agents/embedded-agent-tool-media.ts
/** Extracts and trust-filters media from embedded-agent tool results. */
function pushUniqueMessagingMediaUrl(urls, seen, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || seen.has(normalized)) return;
	seen.add(normalized);
	urls.push(normalized);
}
/** Collects messaging attachment references from tool-call arguments or result records. */
function collectMessagingMediaUrlsFromRecord(record) {
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const attachment = value;
		for (const candidate of [
			attachment.media,
			attachment.mediaUrl,
			attachment.path,
			attachment.filePath,
			attachment.fileUrl,
			attachment.url
		]) pushUniqueMessagingMediaUrl(urls, seen, candidate);
	};
	for (const candidate of [
		record.media,
		record.mediaUrl,
		record.path,
		record.filePath,
		record.fileUrl
	]) pushUniqueMessagingMediaUrl(urls, seen, candidate);
	if (Array.isArray(record.mediaUrls)) for (const mediaUrl of record.mediaUrls) pushUniqueMessagingMediaUrl(urls, seen, mediaUrl);
	if (Array.isArray(record.attachments)) for (const attachment of record.attachments) pushAttachment(attachment);
	return urls;
}
/** Collects messaging attachment references from a completed tool result. */
function collectMessagingMediaUrlsFromToolResult(result) {
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	const appendFromRecord = (value) => {
		if (!value || typeof value !== "object") return;
		for (const url of collectMessagingMediaUrlsFromRecord(value)) if (!seen.has(url)) {
			seen.add(url);
			urls.push(url);
		}
	};
	appendFromRecord(result);
	if (result && typeof result === "object") appendFromRecord(result.details);
	const outputText = extractToolResultText(result);
	if (outputText) try {
		appendFromRecord(JSON.parse(outputText));
	} catch {}
	return urls;
}
/** Extract an internal source-reply payload from a completed message tool result. */
const TRUSTED_TOOL_RESULT_MEDIA = /* @__PURE__ */ new Set([
	"agents_list",
	"apply_patch",
	"browser",
	"canvas",
	AUTOMATIONS_TOOL_NAME,
	"edit",
	"exec",
	"gateway",
	"view_image",
	"image_generate",
	"memory_get",
	"memory_search",
	"message",
	"music_generate",
	"nodes",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"sessions_send",
	"sessions_spawn",
	"subagents",
	"tts",
	"video_generate",
	"web_fetch",
	"web_search",
	"x_search",
	"write"
]);
const HTTP_URL_RE = /^https?:\/\//i;
function isCoreToolResultMediaTrustedName(toolName) {
	if (!toolName) return false;
	return TRUSTED_TOOL_RESULT_MEDIA.has(normalizeToolPolicyName(toolName));
}
function isExternalToolResult(result) {
	const details = readToolResultDetails(result);
	if (!details) return false;
	return typeof details.mcpServer === "string" || typeof details.mcpTool === "string";
}
function isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || isExternalToolResult(result)) return false;
	const registeredName = toolName.trim();
	if (registeredName && trustedLocalMediaToolNames?.has(registeredName) === true) return true;
	return isCoreToolResultMediaTrustedName(toolName);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.embeddedSubscribeToolsTestApi")] = { isToolResultMediaTrusted };
function getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || !isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) || normalizeToolPolicyName(toolName) !== "tts") return;
	const media = readToolResultDetails(result)?.media;
	if (!media || typeof media !== "object" || Array.isArray(media)) return;
	return media.trustedLocalMedia === true ? getCoreTtsToolResultMediaUrls(result) : void 0;
}
function filterToolResultMediaUrls(toolName, mediaUrls, result, trustedLocalMediaToolNames) {
	if (mediaUrls.length === 0) return mediaUrls;
	const trustedOwnedTtsMediaUrls = getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames);
	if (isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames)) {
		if (trustedLocalMediaToolNames !== void 0) {
			const registeredName = toolName?.trim();
			if (!registeredName || !trustedLocalMediaToolNames.has(registeredName)) return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()) || trustedOwnedTtsMediaUrls?.includes(url.trim()));
		}
		return mediaUrls;
	}
	return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
}
function readToolResultDetailsMedia(result) {
	const details = readToolResultDetails(result);
	return details?.media && typeof details.media === "object" && !Array.isArray(details.media) ? details.media : void 0;
}
const REPLY_ATTACHMENT_METADATA_KEYS = /* @__PURE__ */ new Set([
	"type",
	"path",
	"url",
	"mediaUrl",
	"filePath",
	"mimeType",
	"name",
	"sizeBytes",
	"durationMs",
	"width",
	"height"
]);
function collectStructuredMedia(media) {
	const mediaUrls = [];
	const seen = /* @__PURE__ */ new Set();
	const attachmentsByUrl = /* @__PURE__ */ new Map();
	const pushString = (value, attachment) => {
		pushUniqueMessagingMediaUrl(mediaUrls, seen, value);
		const normalized = typeof value === "string" ? value.trim() : "";
		if (normalized && attachment && !attachmentsByUrl.has(normalized)) attachmentsByUrl.set(normalized, attachment);
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const record = value;
		const attachment = Object.fromEntries(Object.entries(record).filter(([key, entry]) => {
			if (!REPLY_ATTACHMENT_METADATA_KEYS.has(key)) return false;
			if (key === "type") return entry === "image" || entry === "audio" || entry === "video" || entry === "file";
			if (key === "width" || key === "height") return asPositiveFiniteNumber(entry) !== void 0;
			if (key === "sizeBytes" || key === "durationMs") return asNonNegativeFiniteNumber(entry) !== void 0;
			return typeof entry === "string";
		}));
		for (const key of [
			"media",
			"path",
			"url",
			"mediaUrl",
			"filePath",
			"fileUrl"
		]) pushString(record[key], attachment);
	};
	pushString(media.media);
	pushString(media.path);
	pushString(media.url);
	pushString(media.mediaUrl);
	pushString(media.filePath);
	pushString(media.fileUrl);
	if (Array.isArray(media.mediaUrls)) for (const value of media.mediaUrls) pushString(value);
	if (Array.isArray(media.attachments)) for (const attachment of media.attachments) pushAttachment(attachment);
	return {
		mediaUrls,
		...attachmentsByUrl.size > 0 ? { attachments: mediaUrls.map((url) => attachmentsByUrl.get(url) ?? {}) } : {}
	};
}
function isNonOutboundToolResultMedia(media) {
	return media.outbound === false;
}
function hasImageContentBlock(content) {
	for (const item of content) {
		if (!item || typeof item !== "object") continue;
		if (item.type === "image") return true;
	}
	return false;
}
function extractToolResultMediaArtifact(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const detailsMedia = readToolResultDetailsMedia(record);
	if (detailsMedia) {
		if (isNonOutboundToolResultMedia(detailsMedia)) return;
		const structuredMedia = collectStructuredMedia(detailsMedia);
		if (structuredMedia.mediaUrls.length > 0) return {
			...structuredMedia,
			...detailsMedia.audioAsVoice === true ? { audioAsVoice: true } : {},
			...detailsMedia.trustedLocalMedia === true ? { trustedLocalMedia: true } : {}
		};
	}
	const content = Array.isArray(record.content) ? record.content : null;
	if (!content) return;
	if (hasImageContentBlock(content)) {
		const details = record.details;
		const p = normalizeOptionalString(details?.path) ?? "";
		if (p) return { mediaUrls: [p] };
	}
}
//#endregion
//#region src/session-cards/progress-card-channel-summary.ts
/** Projects checklist counts or readable notes through the shared Markdown owner. */
function projectProgressCardChannelUpdate(input) {
	const record = asOptionalRecord(input);
	if (!record) return;
	try {
		const normalized = normalizeProgressCardInput(record);
		const steps = normalized.steps ?? [];
		const completed = steps.filter((step) => step.status === "completed").length;
		const explanation = steps.length ? `${completed}/${steps.length} complete` : normalized.markdown ? stripMarkdown(normalized.markdown, {
			linkStyle: "label",
			stripHtml: true
		}).replace(/\s+/g, " ").trim() || "Progress updated" : void 0;
		return {
			steps,
			...explanation ? { explanation } : {},
			...!steps.length && explanation ? { explanationFormat: "plain" } : {}
		};
	} catch (error) {
		if (error instanceof ProgressCardInputError) return;
		throw error;
	}
}
//#endregion
//#region src/agents/embedded-agent-messaging-extraction.ts
/** Extracts message delivery evidence from embedded-agent tool calls and results. */
function extractMessagingToolSourceReplyPayload(result) {
	const details = readToolResultDetails(result);
	if (!details || details.sourceReplySink !== "internal-ui") return;
	const status = normalizeOptionalLowercaseString(details.deliveryStatus);
	if (status && status !== "sent") return;
	const sourceReply = asOptionalRecord(details.sourceReply) ?? details;
	const payload = {};
	const text = readStringValue(sourceReply.text) ?? readStringValue(details.message);
	if (text) payload.text = text;
	const mediaUrl = readStringValue(sourceReply.mediaUrl) ?? readStringValue(details.mediaUrl);
	if (mediaUrl) payload.mediaUrl = mediaUrl;
	const mediaUrls = (Array.isArray(sourceReply.mediaUrls) ? sourceReply.mediaUrls : Array.isArray(details.mediaUrls) ? details.mediaUrls : []).filter((value) => typeof value === "string");
	if (mediaUrls.length > 0) payload.mediaUrls = mediaUrls;
	if (Array.isArray(sourceReply.attachments)) {
		const attachments = sourceReply.attachments.flatMap((value) => {
			const attachment = asOptionalRecord(value);
			if (!attachment) return [];
			const durationMs = asNonNegativeFiniteNumber(attachment.durationMs);
			const width = asNonNegativeFiniteNumber(attachment.width);
			const height = asNonNegativeFiniteNumber(attachment.height);
			const attachmentPath = readStringValue(attachment.path);
			const attachmentUrl = readStringValue(attachment.url);
			const attachmentMediaUrl = readStringValue(attachment.mediaUrl);
			const filePath = readStringValue(attachment.filePath);
			const mimeType = readStringValue(attachment.mimeType);
			const name = readStringValue(attachment.name);
			return [{
				...attachmentPath ? { path: attachmentPath } : {},
				...attachmentUrl ? { url: attachmentUrl } : {},
				...attachmentMediaUrl ? { mediaUrl: attachmentMediaUrl } : {},
				...filePath ? { filePath } : {},
				...mimeType ? { mimeType } : {},
				...name ? { name } : {},
				...typeof attachment.trustedLocalMedia === "boolean" ? { trustedLocalMedia: attachment.trustedLocalMedia } : {},
				...durationMs !== void 0 ? { durationMs } : {},
				...width !== void 0 ? { width } : {},
				...height !== void 0 ? { height } : {}
			}];
		});
		if (attachments.length > 0) payload.attachments = attachments;
	}
	if (typeof sourceReply.trustedLocalMedia === "boolean") payload.trustedLocalMedia = sourceReply.trustedLocalMedia;
	if (sourceReply.audioAsVoice === true || details.audioAsVoice === true) payload.audioAsVoice = true;
	const presentation = normalizeMessagePresentation(sourceReply.presentation);
	if (presentation) payload.presentation = presentation;
	const interactive = normalizeLegacyInteractiveReply(sourceReply.interactive);
	if (interactive) payload.interactive = interactive;
	const channelData = asOptionalRecord(sourceReply.channelData);
	if (channelData) payload.channelData = { ...channelData };
	const idempotencyKey = readStringValue(sourceReply.idempotencyKey) ?? readStringValue(details.idempotencyKey);
	if (idempotencyKey) payload.idempotencyKey = idempotencyKey;
	if (details.sourceReplyTranscriptOwner === true) payload.transcriptOwner = true;
	return Object.keys(payload).length > 0 ? payload : void 0;
}
function resolveMessageToolTarget(params) {
	const directTarget = normalizeOptionalString(params.args.target) ?? normalizeOptionalString(params.args.to) ?? normalizeOptionalString(params.args.channelId);
	if (directTarget) return directTarget;
	const aliases = params.providerId ? getChannelPlugin(params.providerId)?.actions?.messageActionTargetAliases?.[params.action]?.deliveryTargetAliases : void 0;
	for (const alias of aliases ?? []) {
		const aliasTarget = normalizeOptionalStringifiedId(params.args[alias]);
		if (aliasTarget) return aliasTarget;
	}
	return params.currentMessagingTarget ?? params.currentChannelId;
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
	if (toolName === "message") {
		if (!isMessagingToolTargetEvidenceAction(toolName, args)) return;
		const providerRaw = normalizeOptionalString(args.provider) ?? "";
		const channelRaw = normalizeOptionalString(args.channel) ?? "";
		const providerHint = providerRaw || channelRaw;
		const providerId = providerHint ? normalizeChannelId(providerHint) : null;
		const toRaw = resolveMessageToolTarget({
			action,
			args,
			providerId,
			currentChannelId: options?.currentChannelId,
			currentMessagingTarget: options?.currentMessagingTarget
		});
		if (!toRaw) return;
		const provider = providerId ?? normalizeOptionalLowercaseString(providerHint) ?? "message";
		const pluginExtractionArgs = {
			...args,
			to: toRaw
		};
		const pluginExtracted = providerId ? getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args: pluginExtractionArgs }) : null;
		const to = normalizeTargetForProvider(provider, pluginExtracted?.to ?? toRaw);
		const resolvedAccountId = normalizeOptionalString(pluginExtracted?.accountId) ?? accountId;
		const threadId = normalizeOptionalString(pluginExtracted?.threadId) ?? normalizeOptionalString(args.threadId);
		const replyToId = normalizeOptionalString(args.replyTo);
		const outboundReplyToId = action === "send" ? replyToId : void 0;
		const threadSuppressed = pluginExtracted?.threadSuppressed === true || args.topLevel === true || args.threadId === null;
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
				allowImplicitThread: pluginExtracted ? pluginExtracted.threadImplicit === true : true,
				threadSuppressed,
				options
			}) : {
				...threadId ? { threadId } : {},
				...threadSuppressed ? { threadSuppressed: true } : {}
			}
		} : void 0;
	}
	const providerId = normalizeChannelId(toolName);
	if (!providerId) return;
	const extracted = getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args });
	if (!extracted?.to) return;
	const to = normalizeTargetForProvider(providerId, extracted.to);
	const threadId = normalizeOptionalString(extracted.threadId);
	const threadSuppressed = extracted.threadSuppressed === true;
	const extractedAccountId = normalizeOptionalString(extracted.accountId) ?? accountId;
	const nativeReplyToMode = options?.replyToMode;
	const nativeSingleUseMode = nativeReplyToMode === "first" || nativeReplyToMode === "batched";
	const canResolveNativeImplicitThread = extracted.threadImplicit === true && nativeReplyToMode !== void 0 && (!nativeSingleUseMode || options?.hasRepliedRef !== void 0);
	return to ? {
		tool: toolName,
		provider: providerId,
		accountId: extractedAccountId,
		to,
		...resolveMessagingToolThreadEvidence({
			providerId,
			to,
			accountId: extractedAccountId,
			threadId,
			allowImplicitThread: canResolveNativeImplicitThread,
			threadSuppressed,
			options
		})
	} : void 0;
}
/** Reconciles pending send evidence with the provider's successful action result. */
function extractMessagingToolSendResult(pending, result) {
	const providerId = normalizeChannelId(pending.provider);
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
export { projectProgressCardChannelUpdate as a, extractToolResultMediaArtifact as c, isDeliveredMessagingToolSendToCurrentSource as i, filterToolResultMediaUrls as l, extractMessagingToolSendResult as n, collectMessagingMediaUrlsFromRecord as o, extractMessagingToolSourceReplyPayload as r, collectMessagingMediaUrlsFromToolResult as s, extractMessagingToolSend as t, isCoreToolResultMediaTrustedName as u };

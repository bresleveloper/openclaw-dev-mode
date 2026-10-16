import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation } from "./payload-DfZ7JVGs.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-CUrXIAtg.mjs";
import { a as readToolResultDetails } from "./tool-result-error-DGhCl3TG.mjs";
import { o as isMessagingToolTargetEvidenceAction } from "./embedded-agent-messaging-DY4qtKxx.mjs";
import { r as isDeliveredCurrentSourceReply } from "./source-reply-mirror-Cq35K4yN.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-CHcSX7Wg.mjs";
import { a as extractToolResultText } from "./embedded-agent-tool-results-C0yTOgai.mjs";
//#region src/agents/harness/messaging-media.ts
const MESSAGE_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"media_url",
	"path",
	"filePath",
	"fileUrl",
	"imageUrl",
	"image_url"
];
const MESSAGE_MEDIA_ARRAY_KEYS = [
	"mediaUrls",
	"media_urls",
	"imageUrls",
	"image_urls"
];
const HARNESS_SCALAR_ALIASES = /* @__PURE__ */ new Set([
	"media_url",
	"imageUrl",
	"image_url"
]);
const ATTACHMENT_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
function mapAgentHarnessMessagingMediaValues(args, mapValue, includeHarnessAliases = true) {
	const mapString = (value) => typeof value === "string" ? mapValue(value) : value;
	const mapArray = (values, map) => {
		if (!Array.isArray(values)) return values;
		const mapped = values.map(map);
		return mapped.some((value, index) => value !== values[index]) ? mapped : values;
	};
	const mapRecord = (record, keys, message = false) => {
		let mapped = record;
		const assign = (key, value) => {
			if (value !== record[key]) {
				if (mapped === record) mapped = { ...record };
				mapped[key] = value;
			}
		};
		for (const key of keys) if (!message || includeHarnessAliases || !HARNESS_SCALAR_ALIASES.has(key)) assign(key, mapString(record[key]));
		if (message) {
			for (const key of includeHarnessAliases ? MESSAGE_MEDIA_ARRAY_KEYS : ["mediaUrls"]) assign(key, mapArray(record[key], mapString));
			assign("attachments", mapArray(record.attachments, (attachment) => isRecord(attachment) ? mapRecord(attachment, ATTACHMENT_MEDIA_KEYS) : attachment));
		}
		return mapped;
	};
	return mapRecord(args, MESSAGE_MEDIA_KEYS, true);
}
/** Ordered references for delivery evidence; repeated sources remain distinct entries. */
function collectAgentHarnessMessagingMediaUrls(record) {
	const urls = [];
	mapAgentHarnessMessagingMediaValues(record, (value) => {
		const trimmed = value.trim();
		if (trimmed) urls.push(trimmed);
		return value;
	});
	return urls;
}
//#endregion
//#region src/agents/embedded-agent-tool-media.ts
/** Extracts and trust-filters media from embedded-agent tool results. */
function pushUniqueMessagingMediaUrl(urls, value) {
	const normalized = normalizeOptionalString(value);
	if (normalized) urls.add(normalized);
}
/** Collects messaging attachment references from tool-call arguments or result records. */
function collectMessagingMediaUrlsFromRecord(record) {
	const urls = /* @__PURE__ */ new Set();
	mapAgentHarnessMessagingMediaValues(record, (value) => {
		pushUniqueMessagingMediaUrl(urls, value);
		return value;
	}, false);
	return [...urls];
}
/** Collects messaging attachment references from a completed tool result. */
function collectMessagingMediaUrlsFromToolResult(result) {
	const records = [result, asOptionalObjectRecord(result)?.details];
	const outputText = extractToolResultText(result);
	if (outputText) records.push(safeParseJson(outputText));
	return [...new Set(records.flatMap((value) => {
		const record = asOptionalObjectRecord(value);
		return record ? collectMessagingMediaUrlsFromRecord(record) : [];
	}))];
}
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
	const mediaUrls = /* @__PURE__ */ new Set();
	const attachmentsByUrl = /* @__PURE__ */ new Map();
	const pushString = (value, attachment) => {
		pushUniqueMessagingMediaUrl(mediaUrls, value);
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
		mediaUrls: [...mediaUrls],
		...attachmentsByUrl.size > 0 ? { attachments: [...mediaUrls].map((url) => attachmentsByUrl.get(url) ?? {}) } : {}
	};
}
function extractToolResultMediaArtifact(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const detailsMedia = readToolResultDetailsMedia(record);
	if (detailsMedia) {
		if (detailsMedia.outbound === false) return;
		const structuredMedia = collectStructuredMedia(detailsMedia);
		if (structuredMedia.mediaUrls.length > 0) return {
			...structuredMedia,
			...detailsMedia.audioAsVoice === true ? { audioAsVoice: true } : {},
			...detailsMedia.trustedLocalMedia === true ? { trustedLocalMedia: true } : {}
		};
	}
	const content = Array.isArray(record.content) ? record.content : null;
	if (!content) return;
	if (content.some((item) => item && typeof item === "object" && item.type === "image")) {
		const details = record.details;
		const p = normalizeOptionalString(details?.path) ?? "";
		if (p) return { mediaUrls: [p] };
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
		const providerId = providerHint ? normalizeAnyChannelId(providerHint) : null;
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
	const providerId = normalizeAnyChannelId(toolName);
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
export { collectMessagingMediaUrlsFromRecord as a, filterToolResultMediaUrls as c, mapAgentHarnessMessagingMediaValues as d, isDeliveredMessagingToolSendToCurrentSource as i, isCoreToolResultMediaTrustedName as l, extractMessagingToolSendResult as n, collectMessagingMediaUrlsFromToolResult as o, extractMessagingToolSourceReplyPayload as r, extractToolResultMediaArtifact as s, extractMessagingToolSend as t, collectAgentHarnessMessagingMediaUrls as u };

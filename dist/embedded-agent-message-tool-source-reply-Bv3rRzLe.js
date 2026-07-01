import { c as normalizeOptionalString, l as normalizeOptionalStringifiedId, p as readStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { a as redactSensitiveFieldValue, u as redactToolPayloadText } from "./redact-CQ2tlRRk.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { b as truncateUtf16Safe } from "./utils-BApvfmPs.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import "./plugins-DnKj2WmH.js";
import { m as normalizeToolName } from "./tool-policy-Cm3NCEHp.js";
import { c as normalizeInteractiveReply, l as normalizeMessagePresentation } from "./payload-BCsfdv86.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CLwm6Pqw.js";
import { i as isMessagingToolDeliveryAction, n as isMessageToolSendActionName, o as isMessagingToolTargetEvidenceAction, t as isMessageToolConversationCreateActionName } from "./embedded-agent-messaging-C11imqyu.js";
import { t as collectTextContentBlocks } from "./content-blocks-DRK0dze4.js";
//#region src/agents/tool-result-error.ts
function readToolResultDetails(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	return record.details && typeof record.details === "object" && !Array.isArray(record.details) ? record.details : void 0;
}
function readToolResultStatus(result) {
	return normalizeOptionalLowercaseString(readToolResultDetails(result)?.status);
}
function isToolResultError(result) {
	const details = readToolResultDetails(result);
	const normalized = readToolResultStatus(result);
	const explicitlySuccessful = details?.ok === true || details?.success === true;
	if (details?.ok === false || details?.success === false) return true;
	if ((normalized === "error" || normalized === "failed" || normalized === "failure" || normalized === "timeout" || normalized === "timed_out" || normalized === "blocked" || normalized === "denied" || normalized === "forbidden" || normalized === "unavailable" || normalized === "approval-unavailable" || normalized === "disabled" || normalized === "aborted" || normalized === "cancelled" || normalized === "canceled" || normalized === "killed" || normalized === "invalid") && !explicitlySuccessful) return true;
	if (details?.timedOut === true || Boolean(details?.error)) return true;
	const exitCode = details?.exitCode;
	return typeof exitCode === "number" && Number.isFinite(exitCode) && exitCode !== 0;
}
//#endregion
//#region src/agents/embedded-agent-subscribe.tools.ts
/**
* Sanitizes, extracts, and classifies embedded-agent tool execution results.
*/
const TOOL_RESULT_MAX_CHARS = 8e3;
const TOOL_ERROR_MAX_CHARS = 400;
const TOOL_DENIAL_ERROR_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
function truncateToolText(text) {
	if (text.length <= TOOL_RESULT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
function normalizeToolErrorText(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const firstLine = trimmed.split(/\r?\n/)[0]?.trim() ?? "";
	if (!firstLine) return;
	return firstLine.length > TOOL_ERROR_MAX_CHARS ? `${truncateUtf16Safe(firstLine, TOOL_ERROR_MAX_CHARS)}…` : firstLine;
}
function isErrorLikeStatus(status) {
	const normalized = normalizeOptionalLowercaseString(status);
	if (!normalized) return false;
	if (normalized === "0" || normalized === "ok" || normalized === "success" || normalized === "completed" || normalized === "running") return false;
	return /error|fail|timeout|timed[_\s-]?out|denied|cancel|invalid|forbidden/.test(normalized);
}
function readErrorCandidate(value) {
	if (typeof value === "string") return normalizeToolErrorText(value);
	if (!value || typeof value !== "object") return;
	const record = value;
	if (typeof record.message === "string") return normalizeToolErrorText(record.message);
	if (typeof record.error === "string") return normalizeToolErrorText(record.error);
}
function extractErrorField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const direct = extractDirectErrorField(record);
	if (direct) return direct;
	const status = normalizeOptionalString(record.status) ?? "";
	if (!status || !isErrorLikeStatus(status)) return;
	return normalizeToolErrorText(status);
}
function extractDirectErrorField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readErrorCandidate(record.error) ?? readErrorCandidate(record.message) ?? readErrorCandidate(record.reason);
}
function readErrorCodeField(value) {
	return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function readDenialErrorCodeFromMessage(value) {
	const message = typeof value === "string" ? normalizeOptionalString(value) : void 0;
	if (!message) return;
	for (const code of TOOL_DENIAL_ERROR_CODES) if (message === code || message.startsWith(`${code}:`)) return code;
}
function readNestedErrorCodeField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readDenialErrorCodeFromMessage(record.message) ?? readDenialErrorCodeFromMessage(record.error) ?? readErrorCodeField(record.code) ?? readErrorCodeField(record.gatewayCode);
}
function extractDirectErrorCodeField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readNestedErrorCodeField(record.error) ?? readNestedErrorCodeField(record.nodeError) ?? readErrorCodeField(record.code) ?? readErrorCodeField(record.gatewayCode);
}
function buildToolLifecycleErrorResult(error) {
	const errorRecord = asOptionalRecord(error);
	const nodeError = asOptionalRecord(asOptionalRecord(errorRecord?.details)?.nodeError);
	const gatewayCode = readErrorCodeField(errorRecord?.gatewayCode) ?? readErrorCodeField(errorRecord?.code);
	return { details: {
		status: "error",
		error: error instanceof Error ? error.message : String(error),
		...gatewayCode ? { gatewayCode } : {},
		...nodeError ? { nodeError } : {}
	} };
}
function extractAggregatedErrorField(value) {
	if (!value || typeof value !== "object") return;
	return readErrorCandidate(value.aggregated);
}
function redactStringsDeep(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") return redactToolPayloadText(value);
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		return value.map((item) => redactStringsDeep(item, seen));
	}
	if (value && typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = {};
		for (const [key, child] of Object.entries(value)) out[key] = typeof child === "string" ? redactSensitiveFieldValue(key, child) : redactStringsDeep(child, seen);
		return out;
	}
	return value;
}
function sanitizeToolArgs(args) {
	return redactStringsDeep(args);
}
function sanitizeToolResult(result) {
	if (typeof result === "string") return redactToolPayloadText(result);
	if (Array.isArray(result)) return redactStringsDeep(result);
	if (!result || typeof result !== "object") return result;
	const record = result;
	const preCleaned = { ...record };
	const originalContent = Array.isArray(record.content) ? record.content : null;
	if (originalContent) preCleaned.content = originalContent.map((item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (readStringValue(entry.type) === "image") {
			const data = readStringValue(entry.data);
			const bytes = data ? data.length : void 0;
			const cleaned = { ...entry };
			delete cleaned.data;
			return Object.assign({}, cleaned, {
				bytes,
				omitted: true
			});
		}
		return entry;
	});
	const baseline = redactStringsDeep(preCleaned);
	const out = { ...baseline };
	const content = Array.isArray(baseline.content) ? baseline.content : null;
	if (content) out.content = content.map((item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (readStringValue(entry.type) === "text" && typeof entry.text === "string") return Object.assign({}, entry, { text: truncateToolText(entry.text) });
		return entry;
	});
	return out;
}
function extractToolResultText(result) {
	if (!result || typeof result !== "object") return;
	const texts = collectTextContentBlocks(result.content).map((item) => {
		const trimmed = item.trim();
		return trimmed ? trimmed : void 0;
	}).filter((value) => Boolean(value));
	if (texts.length === 0) return;
	return texts.join("\n");
}
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
	const mediaUrls = uniqueStrings((Array.isArray(sourceReply.mediaUrls) ? sourceReply.mediaUrls : Array.isArray(details.mediaUrls) ? details.mediaUrls : []).filter((value) => typeof value === "string"));
	if (mediaUrls.length > 0) payload.mediaUrls = mediaUrls;
	if (sourceReply.audioAsVoice === true || details.audioAsVoice === true) payload.audioAsVoice = true;
	const presentation = normalizeMessagePresentation(sourceReply.presentation);
	if (presentation) payload.presentation = presentation;
	const interactive = normalizeInteractiveReply(sourceReply.interactive);
	if (interactive) payload.interactive = interactive;
	const channelData = asOptionalRecord(sourceReply.channelData);
	if (channelData) payload.channelData = { ...channelData };
	const idempotencyKey = readStringValue(sourceReply.idempotencyKey) ?? readStringValue(details.idempotencyKey);
	if (idempotencyKey) payload.idempotencyKey = idempotencyKey;
	return Object.keys(payload).length > 0 ? payload : void 0;
}
const TRUSTED_TOOL_RESULT_MEDIA = new Set([
	"agents_list",
	"apply_patch",
	"browser",
	"canvas",
	"cron",
	"edit",
	"exec",
	"gateway",
	"image",
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
	return TRUSTED_TOOL_RESULT_MEDIA.has(normalizeToolName(toolName));
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
function isTrustedOwnedTtsLocalMedia(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || !isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) || normalizeToolName(toolName) !== "tts") return false;
	const media = readToolResultDetails(result)?.media;
	if (!media || typeof media !== "object" || Array.isArray(media)) return false;
	return media.trustedLocalMedia === true;
}
function filterToolResultMediaUrls(toolName, mediaUrls, result, trustedLocalMediaToolNames) {
	if (mediaUrls.length === 0) return mediaUrls;
	const trustedOwnedTtsLocalMedia = isTrustedOwnedTtsLocalMedia(toolName, result, trustedLocalMediaToolNames);
	if (isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames)) {
		if (trustedLocalMediaToolNames !== void 0) {
			if (!trustedOwnedTtsLocalMedia) {
				const registeredName = toolName?.trim();
				if (!registeredName || !trustedLocalMediaToolNames.has(registeredName)) return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
			}
		}
		return mediaUrls;
	}
	return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
}
function readToolResultDetailsMedia(result) {
	const details = readToolResultDetails(result);
	return details?.media && typeof details.media === "object" && !Array.isArray(details.media) ? details.media : void 0;
}
function collectStructuredMediaUrls(media) {
	const urls = [];
	const pushString = (value) => {
		if (typeof value !== "string") return;
		const normalized = value.trim();
		if (normalized) urls.push(normalized);
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const attachment = value;
		pushString(attachment.media);
		pushString(attachment.path);
		pushString(attachment.url);
		pushString(attachment.mediaUrl);
		pushString(attachment.filePath);
		pushString(attachment.fileUrl);
	};
	pushString(media.media);
	pushString(media.path);
	pushString(media.url);
	pushString(media.mediaUrl);
	pushString(media.filePath);
	pushString(media.fileUrl);
	if (Array.isArray(media.mediaUrls)) for (const value of media.mediaUrls) pushString(value);
	if (Array.isArray(media.attachments)) for (const attachment of media.attachments) pushAttachment(attachment);
	return uniqueStrings(urls);
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
		const mediaUrls = collectStructuredMediaUrls(detailsMedia);
		if (mediaUrls.length > 0) return {
			mediaUrls,
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
function extractToolErrorCode(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	return extractDirectErrorCodeField(record.details) ?? extractDirectErrorCodeField(record);
}
function isToolResultTimedOut(result) {
	if (readToolResultStatus(result) === "timeout") return true;
	return readToolResultDetails(result)?.timedOut === true;
}
function extractToolErrorMessage(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const fromDetails = extractDirectErrorField(record.details);
	if (fromDetails) return fromDetails;
	const fromDetailsAggregated = extractAggregatedErrorField(record.details);
	if (fromDetailsAggregated) return fromDetailsAggregated;
	const fromRoot = extractDirectErrorField(record);
	if (fromRoot) return fromRoot;
	const text = extractToolResultText(result);
	if (text) try {
		const fromJson = extractErrorField(JSON.parse(text));
		if (fromJson) return fromJson;
	} catch {}
	const fromDetailsStatus = extractErrorField(record.details);
	if (fromDetailsStatus) return fromDetailsStatus;
	const fromRootStatus = extractErrorField(record);
	if (fromRootStatus) return fromRootStatus;
	return text ? normalizeToolErrorText(text) : void 0;
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
		const to = normalizeTargetForProvider(provider, toRaw);
		const pluginExtractionArgs = {
			...args,
			to: toRaw
		};
		const pluginExtracted = providerId ? getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args: pluginExtractionArgs }) : null;
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
//#endregion
//#region src/agents/embedded-agent-message-tool-source-reply.ts
const MESSAGE_TOOL_NAME = "message";
const SESSIONS_SEND_TOOL_NAME = "sessions_send";
const EXPLICIT_MESSAGE_ROUTE_KEYS = [
	"channel",
	"target",
	"to",
	"channelId",
	"provider"
];
const DRY_RUN_DELIVERY_STATUS = "dry_run";
const PARTIAL_FAILED_DELIVERY_STATUS = "partial_failed";
const SENT_DELIVERY_STATUS = "sent";
const NON_DELIVERY_MESSAGE_IDS = new Set(["skipped", "suppressed"]);
const RESULT_ENVELOPE_KEYS = [
	"details",
	"payload",
	"result",
	"results",
	"sendResult",
	"toolResult"
];
const BROADCAST_SEND_ENVELOPE_KEYS = [
	"payload",
	"result",
	"sendResult",
	"toolResult"
];
const PARTIAL_DELIVERY_ENVELOPE_KEYS = [
	...RESULT_ENVELOPE_KEYS,
	"error",
	"cause"
];
const SESSIONS_SEND_DELIVERY_STATUSES = new Set(["accepted", "ok"]);
const BARE_OK_DELIVERY_STATUS = "ok";
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function hasStringValue(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function hasConversationIdValue(value) {
	return hasStringValue(value) || typeof value === "number" && Number.isFinite(value);
}
function hasExplicitMessageRoute(args) {
	if (EXPLICIT_MESSAGE_ROUTE_KEYS.some((key) => hasStringValue(args[key]))) return true;
	return Array.isArray(args.targets) && args.targets.some((value) => hasStringValue(value));
}
function normalizeStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
function isBareOkDeliveryStatus(value) {
	return normalizeStatus(value) === BARE_OK_DELIVERY_STATUS;
}
function isBareSentDeliveryStatus(value) {
	return normalizeStatus(value) === SENT_DELIVERY_STATUS;
}
function parseJsonRecord(value) {
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function recordHasDeliveredMessageId(record) {
	const hasDeliveredId = (value) => {
		const normalized = normalizeStatus(value);
		return Boolean(normalized && !NON_DELIVERY_MESSAGE_IDS.has(normalized));
	};
	if (hasDeliveredId(record.messageId) || hasDeliveredId(record.pollId)) return true;
	const receipt = record.receipt;
	if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
	const receiptRecord = receipt;
	return hasDeliveredId(receiptRecord.primaryPlatformMessageId) || Array.isArray(receiptRecord.platformMessageIds) && receiptRecord.platformMessageIds.some((value) => hasDeliveredId(value));
}
function deliveryEnvelopeHasCreatedConversationId(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeHasCreatedConversationId(item, depth + 1));
	const record = value;
	if (hasConversationIdValue(record.topicId) || hasConversationIdValue(record.threadId) || hasConversationIdValue(record.messageThreadId)) return true;
	const thread = record.thread;
	if (thread && typeof thread === "object" && !Array.isArray(thread)) {
		if (hasConversationIdValue(thread.id)) return true;
	}
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeHasCreatedConversationId(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeHasCreatedConversationId(item, depth + 1))) return true;
	return PARTIAL_DELIVERY_ENVELOPE_KEYS.some((key) => deliveryEnvelopeHasCreatedConversationId(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesOk(value, depth = 0) {
	if (isBareOkDeliveryStatus(value)) return true;
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesOk(item, depth + 1));
	const record = value;
	if (record.ok === true) return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesOk(parsed, depth + 1)) return true;
		if (isBareOkDeliveryStatus(record.text)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeIndicatesOk(item, depth + 1))) return true;
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesOk(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesNonDelivery(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesNonDelivery(item, depth + 1));
	const record = value;
	const messageId = normalizeStatus(record.messageId);
	if (messageId && NON_DELIVERY_MESSAGE_IDS.has(messageId) || normalizeStatus(record.deliveryStatus) === "suppressed" || normalizeStatus(record.status) === "suppressed") return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesNonDelivery(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeIndicatesNonDelivery(item, depth + 1))) return true;
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesNonDelivery(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesNoOp(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesNoOp(item, depth + 1));
	const record = value;
	const removed = record.removed;
	if (removed === null || removed === false || removed === 0 || Array.isArray(removed) && removed.length === 0 || record.applied === false || record.changed === false || record.created === false || record.deleted === false || record.sent === false || record.updated === false) return true;
	const status = normalizeStatus(record.status);
	if (status === "noop" || status === "no_op" || status === "not_found") return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesNoOp(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeIndicatesNoOp(item, depth + 1))) return true;
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesNoOp(record[key], depth + 1));
}
function broadcastEntryHasSuccessfulBareOkSend(record, depth) {
	return BROADCAST_SEND_ENVELOPE_KEYS.some((key) => {
		const value = record[key];
		return deliveryEnvelopeIndicatesOk(value, depth + 1) && !deliveryEnvelopeIndicatesNonDelivery(value, depth + 1) && !deliveryEnvelopeIndicatesNoOp(value, depth + 1);
	});
}
function deliveryEnvelopeIndicatesSuccessfulBroadcast(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => item !== null && typeof item === "object" && !Array.isArray(item) && item.ok === true && !deliveryEnvelopeIndicatesNonDelivery(item) && !deliveryEnvelopeIndicatesNoOp(item) && (deliveryEnvelopeIndicatesDelivered(item, depth + 1) || broadcastEntryHasSuccessfulBareOkSend(item, depth + 1)));
	const record = value;
	if (deliveryEnvelopeIndicatesSuccessfulBroadcast(record.results, depth + 1)) return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesSuccessfulBroadcast(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeIndicatesSuccessfulBroadcast(item, depth + 1))) return true;
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesSuccessfulBroadcast(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesDryRun(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesDryRun(item, depth + 1));
	const record = value;
	if (record.dryRun === true || normalizeStatus(record.deliveryStatus) === DRY_RUN_DELIVERY_STATUS || normalizeStatus(record.status) === DRY_RUN_DELIVERY_STATUS) return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesDryRun(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content)) for (const item of content) {
		if (deliveryEnvelopeIndicatesDryRun(item, depth + 1)) return true;
		if (item && typeof item === "object" && !Array.isArray(item)) {
			const text = item.text;
			if (typeof text === "string") {
				const parsed = parseJsonRecord(text);
				if (parsed && deliveryEnvelopeIndicatesDryRun(parsed, depth + 1)) return true;
			}
		}
	}
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesDryRun(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesDelivered(value, depth = 0, requireReceipt = false) {
	if (!requireReceipt && isBareSentDeliveryStatus(value)) return true;
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesDelivered(item, depth + 1, requireReceipt));
	const record = value;
	if (!requireReceipt && normalizeStatus(record.deliveryStatus) === SENT_DELIVERY_STATUS || !requireReceipt && normalizeStatus(record.status) === SENT_DELIVERY_STATUS || recordHasDeliveredMessageId(record)) return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesDelivered(parsed, depth + 1, requireReceipt)) return true;
		if (!requireReceipt && isBareSentDeliveryStatus(record.text)) return true;
	}
	const content = record.content;
	if (Array.isArray(content)) for (const item of content) {
		if (deliveryEnvelopeIndicatesDelivered(item, depth + 1, requireReceipt)) return true;
		if (item && typeof item === "object" && !Array.isArray(item)) {
			const text = item.text;
			if (typeof text === "string") {
				const parsed = parseJsonRecord(text);
				if (parsed && deliveryEnvelopeIndicatesDelivered(parsed, depth + 1, requireReceipt)) return true;
			}
		}
	}
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesDelivered(record[key], depth + 1, requireReceipt));
}
/** Return true when a result envelope carries a provider message identifier. */
function hasMessagingDeliveryReceipt(value) {
	return deliveryEnvelopeIndicatesDelivered(value, 0, true);
}
function deliveryEnvelopeIndicatesSessionsSendAccepted(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesSessionsSendAccepted(item, depth + 1));
	const record = value;
	if (SESSIONS_SEND_DELIVERY_STATUSES.has(normalizeStatus(record.deliveryStatus) ?? "") || SESSIONS_SEND_DELIVERY_STATUSES.has(normalizeStatus(record.status) ?? "")) return true;
	if (typeof record.text === "string") {
		const parsed = parseJsonRecord(record.text);
		if (parsed && deliveryEnvelopeIndicatesSessionsSendAccepted(parsed, depth + 1)) return true;
	}
	const content = record.content;
	if (Array.isArray(content) && content.some((item) => deliveryEnvelopeIndicatesSessionsSendAccepted(item, depth + 1))) return true;
	return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesSessionsSendAccepted(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesPartialDelivery(value, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => deliveryEnvelopeIndicatesPartialDelivery(item, depth + 1));
	const record = value;
	if (record.sentBeforeError === true || record.visibleReplySent === true || normalizeStatus(record.deliveryStatus) === PARTIAL_FAILED_DELIVERY_STATUS || normalizeStatus(record.status) === PARTIAL_FAILED_DELIVERY_STATUS) return true;
	return PARTIAL_DELIVERY_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesPartialDelivery(record[key], depth + 1));
}
/** Return true only when a messaging tool result proves a real visible delivery. */
function isDeliveredMessagingToolResult(params) {
	const args = asRecord(params.args);
	const action = normalizeStatus(args.action);
	if (args.dryRun === true || deliveryEnvelopeIndicatesDryRun(params.result) || deliveryEnvelopeIndicatesDryRun(params.hookResult)) return false;
	if (deliveryEnvelopeIndicatesPartialDelivery(params.result) || deliveryEnvelopeIndicatesPartialDelivery(params.hookResult)) return true;
	if (action && isMessageToolConversationCreateActionName(action) && (deliveryEnvelopeHasCreatedConversationId(params.result) || deliveryEnvelopeHasCreatedConversationId(params.hookResult))) return true;
	if (action === "broadcast" && (deliveryEnvelopeIndicatesSuccessfulBroadcast(params.result) || deliveryEnvelopeIndicatesSuccessfulBroadcast(params.hookResult))) return true;
	if (params.isError || isToolResultError(params.result) || isToolResultError(params.hookResult)) return false;
	const normalizedToolName = normalizeToolName(params.toolName ?? MESSAGE_TOOL_NAME);
	if (isMessagingToolDeliveryAction(normalizedToolName, args) && action !== "broadcast" && (deliveryEnvelopeIndicatesOk(params.result) || deliveryEnvelopeIndicatesOk(params.hookResult)) && !deliveryEnvelopeIndicatesNonDelivery(params.result) && !deliveryEnvelopeIndicatesNonDelivery(params.hookResult) && !deliveryEnvelopeIndicatesNoOp(params.result) && !deliveryEnvelopeIndicatesNoOp(params.hookResult)) return true;
	if (deliveryEnvelopeIndicatesNonDelivery(params.result) || deliveryEnvelopeIndicatesNonDelivery(params.hookResult) || deliveryEnvelopeIndicatesNoOp(params.result) || deliveryEnvelopeIndicatesNoOp(params.hookResult)) return false;
	if (normalizedToolName === SESSIONS_SEND_TOOL_NAME) return deliveryEnvelopeIndicatesSessionsSendAccepted(params.result) || deliveryEnvelopeIndicatesSessionsSendAccepted(params.hookResult) || deliveryEnvelopeIndicatesDelivered(params.result) || deliveryEnvelopeIndicatesDelivered(params.hookResult);
	return deliveryEnvelopeIndicatesDelivered(params.result) || deliveryEnvelopeIndicatesDelivered(params.hookResult);
}
/**
* Only implicit-route, non-dry-run, delivered `message.send` calls qualify.
* Explicit routes and other messaging tools are outbound side effects, not source replies.
*/
function isDeliveredMessageToolOnlySourceReplyResult(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only") return false;
	if (normalizeToolName(params.toolName) !== MESSAGE_TOOL_NAME) return false;
	const args = asRecord(params.args);
	if (!isMessageToolSendActionName(args.action) || hasExplicitMessageRoute(args)) return false;
	return isDeliveredMessagingToolResult(params);
}
//#endregion
export { sanitizeToolResult as _, collectMessagingMediaUrlsFromRecord as a, extractMessagingToolSendResult as c, extractToolErrorMessage as d, extractToolResultMediaArtifact as f, sanitizeToolArgs as g, isToolResultTimedOut as h, buildToolLifecycleErrorResult as i, extractMessagingToolSourceReplyPayload as l, filterToolResultMediaUrls as m, isDeliveredMessageToolOnlySourceReplyResult as n, collectMessagingMediaUrlsFromToolResult as o, extractToolResultText as p, isDeliveredMessagingToolResult as r, extractMessagingToolSend as s, hasMessagingDeliveryReceipt as t, extractToolErrorCode as u, isToolResultError as v, readToolResultDetails as y };

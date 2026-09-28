import { i as resolveLineAccount, r as resolveDefaultLineAccountId } from "./accounts-BBEFMYbY.mjs";
import { b as normalizeAllowFrom, c as resolveLineQuestionPostback, f as buildLineQuickReplyFallbackText, g as resolveLineGroupConfigEntry, i as prepareLineReplyPayload, n as createLineQuickReply, p as getLineRuntime, s as parseLineQuestionPostbackData, x as normalizeLineAllowEntry, y as firstDefined } from "./rich-messages-d8CmBVJj.mjs";
import { D as recordLineQuoteToken, E as readLineQuoteToken, O as reportLineQuoteCarrierMissing, T as canCarryLineQuoteToken, j as buildLineMediaMessage, k as resolveLineQuoteToken, n as findLineHttpError, r as resolveLineNonDispatchRetryable, t as explainLineRefusal, w as applyLineQuoteToken } from "./send-retry-DbfiHBPd.mjs";
import { a as eventIdFor, n as LINE_WEBHOOK_SPOOL_INVALID_PAYLOAD_MESSAGE, o as laneKeyFor, r as LineWebhookPayloadError, t as LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON } from "./webhook-spool-contract-1rY8OJw8.mjs";
import { a as buildTemplateMessageFromPayload, r as processLineMessage } from "./markdown-to-line-CRfEHFs0.mjs";
import { _ as showLoadingAnimation, a as getLineGroupName, d as pushMessageLine, f as pushMessagesLine, h as replyMessageLine, n as createLocationMessage, o as getUserDisplayName, s as getUserProfile, t as createFlexMessage, v as quotesLineBotMessage } from "./send-BmsHY4WC.mjs";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { resolveChannelGroupsConfigPath } from "openclaw/plugin-sdk/channel-policy";
import { normalizeOptionalString, normalizeStringEntries, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS, bindIngressLifecycleToReplyOptions, createChannelIngressMonitor, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { buildChannelInboundEventContext, buildMentionRegexes, formatInboundEnvelope, formatInboundMediaUnavailableText, formatLocationText, hasFinalInboundReplyDispatch, implicitMentionKindWhen, isChannelPartialDeliveryError, logInboundDrop, matchesMentionPatterns, resolveInboundSessionEnvelopeContext, toInboundMediaFactsWithMetadata, toLocationContext } from "openclaw/plugin-sdk/channel-inbound";
import { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, readErrorName, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createNonExitingRuntime, danger, logVerbose, shouldLogVerbose, waitForAbortSignal, warn } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { classifyTransientNetworkErrorCode } from "openclaw/plugin-sdk/retry-runtime";
import { fetchWithRuntimeDispatcherOrMockedGlobal } from "openclaw/plugin-sdk/runtime-fetch";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { MediaFetchError } from "openclaw/plugin-sdk/media-runtime";
import { saveMediaStream } from "openclaw/plugin-sdk/media-store";
import crypto from "node:crypto";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { channelReadyPatch, channelStoppedPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { canonicalizeWebhookRouteKey, registerWebhookTargetWithPluginRoute, resolveSingleWebhookTarget, resolveWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { beginWebhookRequestPipelineOrReject, createWebhookInFlightLimiter, isRequestBodyLimitError, readRequestBodyWithLimit, requestBodyErrorToText, runDetachedWebhookWork, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { chunkMarkdownText } from "openclaw/plugin-sdk/reply-runtime";
import { resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { getRuntimeConfig, getRuntimeConfigSnapshot, getRuntimeConfigSourceSnapshot, selectApplicableRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { fanInChannelIngressLifecycles, resolveChannelImplicitMentions } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { reportChannelRoomJoin } from "openclaw/plugin-sdk/channel-join-intro-runtime";
import { hasControlCommand } from "openclaw/plugin-sdk/command-auth-native";
import { ensureConfiguredBindingRouteReady, readChannelAllowFromStore, resolveConfiguredBindingRoute, resolvePairingIdLabel, resolvePinnedMainDmOwnerFromAllowlist, resolveRuntimeConversationBindingRoute, upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { DEFAULT_GROUP_HISTORY_LIMIT, createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/line/src/download.ts
const CONTENT_READY_MAX_ATTEMPTS = 6;
const CONTENT_READY_BASE_DELAY_MS = 500;
const CONTENT_READY_MAX_DELAY_MS = 4e3;
const CONTENT_DOWNLOAD_TIMEOUT_MS = 15e3;
const LINE_CONTENT_BASE_URL = "https://api-data.line.me/v2/bot/message";
var RetryableLineMediaFetchError = class extends MediaFetchError {
	constructor(message, options) {
		super("fetch_failed", message, options);
		this.name = "RetryableLineMediaFetchError";
	}
};
function contentBackoffDelayMs(attempt) {
	return Math.min(CONTENT_READY_BASE_DELAY_MS * 2 ** attempt, CONTENT_READY_MAX_DELAY_MS);
}
function lineContentUrl(messageId) {
	return `${LINE_CONTENT_BASE_URL}/${encodeURIComponent(messageId)}/content`;
}
async function* lineResponseBodyChunks(response, messageId, signal, onComplete) {
	const body = response.body;
	if (!body) throw new RetryableLineMediaFetchError(`LINE media response for message ${messageId} had no body`);
	const reader = body.getReader();
	let completed = false;
	try {
		while (true) {
			let chunk;
			try {
				chunk = await reader.read();
			} catch (err) {
				if (signal.aborted) throw signal.reason;
				throw new RetryableLineMediaFetchError(`LINE media response stream failed for message ${messageId}`, { cause: err });
			}
			if (chunk.done) {
				completed = true;
				onComplete();
				return;
			}
			if (chunk.value.byteLength > 0) yield chunk.value;
		}
	} finally {
		if (!completed) await reader.cancel(signal.aborted ? signal.reason : void 0).catch(() => void 0);
		try {
			reader.releaseLock();
		} catch {}
	}
}
async function fetchLineContentWhenReady(messageId, channelAccessToken, signal) {
	try {
		for (let attempt = 0; attempt < CONTENT_READY_MAX_ATTEMPTS; attempt++) {
			const response = await fetchWithRuntimeDispatcherOrMockedGlobal(lineContentUrl(messageId), {
				headers: { Authorization: `Bearer ${channelAccessToken}` },
				redirect: "error",
				signal
			});
			if (response.status === 200) {
				if (!response.body) throw new RetryableLineMediaFetchError(`LINE media response for message ${messageId} had no body`);
				return response;
			}
			await response.body?.cancel().catch(() => void 0);
			if (response.status !== 202) throw new MediaFetchError("http_error", `LINE media download failed for message ${messageId} (HTTP ${response.status})`, { status: response.status });
			if (attempt < 5) await setTimeout$1(contentBackoffDelayMs(attempt), void 0, { signal });
		}
	} catch (err) {
		if (signal.aborted) throw signal.reason;
		if (err instanceof MediaFetchError) throw err;
		throw new RetryableLineMediaFetchError(`LINE media download failed for message ${messageId}`, { cause: err });
	}
	throw new MediaFetchError("http_error", `LINE media for message ${messageId} was still preparing (HTTP 202) after ${CONTENT_READY_MAX_ATTEMPTS} attempts`, { status: 202 });
}
function isRetryableLineInboundMediaError(err) {
	if (err instanceof RetryableLineMediaFetchError) return true;
	if (!(err instanceof MediaFetchError)) return false;
	if (err.code === "http_error") return err.status === 202 || err.status === 408 || err.status === 429 || typeof err.status === "number" && err.status >= 500;
	return false;
}
async function downloadLineMedia(messageId, channelAccessToken, maxBytes = 10485760, options) {
	options?.signal?.throwIfAborted();
	const deadlineAbort = new AbortController();
	const signal = options?.signal ? AbortSignal.any([options.signal, deadlineAbort.signal]) : deadlineAbort.signal;
	const deadline = setTimeout(() => {
		deadlineAbort.abort(new RetryableLineMediaFetchError(`LINE media for message ${messageId} did not download within ${CONTENT_DOWNLOAD_TIMEOUT_MS / 1e3} seconds`));
	}, CONTENT_DOWNLOAD_TIMEOUT_MS);
	deadline.unref();
	try {
		const response = await fetchLineContentWhenReady(messageId, channelAccessToken, signal);
		let saved;
		try {
			saved = await saveMediaStream(lineResponseBodyChunks(response, messageId, signal, () => clearTimeout(deadline)), response.headers.get("content-type") ?? void 0, "inbound", maxBytes, options?.originalFilename);
		} catch (err) {
			await response.body?.cancel(signal.aborted ? signal.reason : err).catch(() => void 0);
			if (signal.aborted) throw signal.reason;
			throw err;
		}
		options?.signal?.throwIfAborted();
		logVerbose(`line: persisted media ${messageId} to ${saved.path} (${saved.size} bytes)`);
		return {
			path: saved.path,
			contentType: saved.contentType,
			size: saved.size
		};
	} finally {
		clearTimeout(deadline);
	}
}
//#endregion
//#region extensions/line/src/auto-reply-delivery.ts
function toLineDeliveryError(error) {
	return error instanceof Error ? error : new Error("LINE message send failed", { cause: error });
}
function canFallbackAfterLineReplyFailure(error) {
	const httpError = findLineHttpError(error);
	if (httpError) return httpError.status >= 400 && httpError.status < 500 && httpError.status !== 408;
	const candidates = collectErrorGraphCandidates(error, (candidate) => [candidate.cause, candidate.error]);
	if (candidates.some((candidate) => readErrorName(candidate) === "AbortError" || classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "ambiguous")) return false;
	if (candidates.some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "pre-connect")) return true;
	return !candidates.some((candidate) => candidate instanceof TypeError && candidate.message === "fetch failed");
}
function markLineVisibleDeliveryError(error) {
	const deliveryError = toLineDeliveryError(error);
	if (Object.isExtensible(deliveryError)) {
		Object.assign(deliveryError, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return deliveryError;
	}
	const visibleError = new Error("LINE message send failed", { cause: deliveryError });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
async function deliverLineAutoReply(params) {
	const { payload, lineData, replyToken, accountId, to, textLimit } = params;
	let replyTokenUsed = params.replyTokenUsed;
	let visibleReplySent = false;
	const sendVisible = async (send) => {
		try {
			const result = await send();
			visibleReplySent = true;
			return result;
		} catch (error) {
			if (isChannelPartialDeliveryError(error)) visibleReplySent = true;
			if (visibleReplySent) throw markLineVisibleDeliveryError(error);
			throw error;
		}
	};
	const replyVisible = (...args) => sendVisible(() => replyMessageLine(...args));
	const failedPushSegments = /* @__PURE__ */ new WeakMap();
	const pushLineMessages = async (messages, allowFailedBatchTextRecovery, externalTail = []) => {
		if (messages.length === 0) return;
		for (let i = 0; i < messages.length; i += 5) {
			const batch = messages.slice(i, i + 5);
			try {
				await sendVisible(() => pushMessagesLine(to, batch, {
					cfg: params.cfg,
					accountId
				}));
			} catch (error) {
				if (!isChannelPartialDeliveryError(error) && typeof error === "object" && error !== null) failedPushSegments.set(error, {
					allowFailedBatchTextRecovery,
					failedBatch: batch,
					unattemptedTail: [...messages.slice(i + batch.length), ...externalTail]
				});
				throw error;
			}
		}
	};
	const sendLineMessages = async (messages, allowReplyToken) => {
		if (messages.length === 0) return;
		let remaining = messages;
		if (allowReplyToken && replyToken && !replyTokenUsed) {
			const replyBatch = remaining.slice(0, 5);
			try {
				await replyVisible(replyToken, replyBatch, {
					cfg: params.cfg,
					accountId
				});
			} catch (err) {
				if (isChannelPartialDeliveryError(err) || !canFallbackAfterLineReplyFailure(err)) throw err;
				params.onReplyError?.(err);
				await pushLineMessages(replyBatch, findLineHttpError(err)?.status === 400, remaining.slice(replyBatch.length));
			} finally {
				replyTokenUsed = true;
			}
			remaining = remaining.slice(replyBatch.length);
		}
		if (remaining.length > 0) await pushLineMessages(remaining, true);
	};
	const richMessages = [];
	const quickReplyItems = lineData.quickReplyItems?.length ? lineData.quickReplyItems : (lineData.quickReplies ?? []).map((label) => ({
		label,
		action: {
			type: "command",
			command: label
		}
	}));
	const quickReplyLabels = quickReplyItems.map((item) => item.label);
	const hasQuickReplies = quickReplyItems.length > 0;
	if (lineData.flexMessage) richMessages.push(createFlexMessage(lineData.flexMessage.altText, lineData.flexMessage.contents));
	if (lineData.templateMessage) {
		const templateMsg = buildTemplateMessageFromPayload(lineData.templateMessage);
		if (templateMsg) richMessages.push(templateMsg);
	}
	if (lineData.location) richMessages.push(createLocationMessage(lineData.location));
	const visibleText = payload.text ? sanitizeAssistantVisibleText(payload.text) : "";
	const processed = visibleText ? processLineMessage(visibleText) : {
		text: "",
		flexMessages: []
	};
	if (!processed.segments) for (const flexMsg of processed.flexMessages) richMessages.push(createFlexMessage(flexMsg.altText, flexMsg.contents));
	const orderedMessages = processed.segments?.flatMap((segment) => segment.type === "flex" ? [createFlexMessage(segment.message.altText, segment.message.contents)] : chunkMarkdownText(segment.text, textLimit).map((text) => ({
		type: "text",
		text
	})));
	const chunks = orderedMessages ? orderedMessages.flatMap((message) => message.type === "text" ? [message.text] : []) : processed.text ? chunkMarkdownText(processed.text, textLimit) : [];
	const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
	const mediaOpts = {
		mediaKind: lineData.mediaKind,
		previewImageUrl: lineData.previewImageUrl,
		durationMs: lineData.durationMs,
		trackingId: lineData.trackingId
	};
	const mediaMessages = [];
	let deliveryError;
	for (const rawUrl of mediaUrls) {
		const url = rawUrl?.trim();
		if (!url) continue;
		try {
			mediaMessages.push(await buildLineMediaMessage(url, mediaOpts, to));
		} catch (err) {
			deliveryError ??= err;
		}
	}
	const textMessages = chunks.map((text) => ({
		type: "text",
		text
	}));
	const orderedDeliveryMessages = hasQuickReplies && chunks.length === 0 ? void 0 : orderedMessages;
	const richMediaMessages = [
		...richMessages,
		...orderedDeliveryMessages ? [] : orderedMessages ?? [],
		...mediaMessages
	];
	if (hasQuickReplies && textMessages.length === 0 && richMediaMessages.length === 0) textMessages.push({
		type: "text",
		text: buildLineQuickReplyFallbackText(quickReplyLabels)
	});
	if (hasQuickReplies) {
		const targetMessages = orderedDeliveryMessages?.length ? orderedDeliveryMessages : textMessages.length > 0 ? textMessages : richMediaMessages;
		const lastIndex = targetMessages.length - 1;
		targetMessages[lastIndex] = {
			...expectDefined(targetMessages[lastIndex], "last LINE auto-reply message"),
			quickReply: createLineQuickReply(quickReplyItems)
		};
	}
	const ordered = hasQuickReplies ? [...richMediaMessages, ...orderedDeliveryMessages ?? textMessages] : [...orderedDeliveryMessages ?? textMessages, ...richMediaMessages];
	const replyQuoteToken = resolveLineQuoteToken({
		cfg: params.cfg,
		accountId,
		chatId: to,
		messageId: payload.replyToId
	});
	if (replyQuoteToken && !ordered.some(canCarryLineQuoteToken)) reportLineQuoteCarrierMissing(to);
	const messages = applyLineQuoteToken(ordered, replyQuoteToken);
	try {
		await sendLineMessages(messages, true);
	} catch (err) {
		deliveryError ??= err;
		const failedSegment = typeof err === "object" && err !== null ? failedPushSegments.get(err) : void 0;
		const httpError = findLineHttpError(err);
		const retryCandidates = failedSegment ? [...failedSegment.allowFailedBatchTextRecovery ? failedSegment.failedBatch : [], ...failedSegment.unattemptedTail] : [];
		const retryTextMessages = retryCandidates.filter((message) => message.type === "text");
		const quickRepliesNeedCarrier = hasQuickReplies && retryCandidates.some((message) => "quickReply" in message);
		const retryMessages = retryTextMessages.length > 0 ? retryTextMessages : quickRepliesNeedCarrier ? [{
			type: "text",
			text: buildLineQuickReplyFallbackText(quickReplyLabels),
			quickReply: createLineQuickReply(quickReplyItems)
		}] : [];
		if (retryMessages.length > 0 && failedSegment?.failedBatch.some((message) => message.type !== "text") && httpError?.status === 400 && resolveLineNonDispatchRetryable(err) !== void 0) {
			const lastRetryMessage = retryMessages.at(-1);
			if (quickRepliesNeedCarrier && lastRetryMessage && !lastRetryMessage.quickReply) lastRetryMessage.quickReply = createLineQuickReply(quickReplyItems);
			try {
				await sendLineMessages(retryMessages, false);
			} catch {}
		}
	}
	if (deliveryError !== void 0) {
		if (!visibleReplySent) {
			const named = toLineDeliveryError(deliveryError);
			const refusal = await explainLineRefusal({
				error: named,
				cfg: params.cfg,
				accountId
			});
			throw refusal.reason !== named.message ? new Error(refusal.reason, { cause: deliveryError }) : named;
		}
		return {
			status: "partial",
			replyTokenUsed,
			visibleReplySent: true,
			error: markLineVisibleDeliveryError(deliveryError)
		};
	}
	return {
		status: "delivered",
		replyTokenUsed,
		visibleReplySent
	};
}
//#endregion
//#region extensions/line/src/mentions.ts
function getLineMentionees(message) {
	return message.type === "text" ? message.mention?.mentionees ?? [] : [];
}
function addressesLineBot(mentionee) {
	return mentionee.type === "all" || mentionee.isSelf === true;
}
function isLineBotMentioned(message) {
	return getLineMentionees(message).some(addressesLineBot);
}
function hasAnyLineMention(message) {
	return getLineMentionees(message).length > 0;
}
/**
* Text to interpret as a command, with the mention that addressed the bot removed.
*
* LINE writes a mention as the plain channel display name, so no pattern can
* tell it apart from a member's name; `mentionees[].index`/`length` (UTF-16
* code units, the unit LINE counts text in) is the only authoritative marker.
* Leaving it in place makes a group `@<bot> /status` parse as prose, and group
* chats require the mention to reach the bot at all.
*/
function resolveLineMentionStrippedText(message) {
	const text = message.type === "text" ? message.text : "";
	const spans = getLineMentionees(message).filter(addressesLineBot).map((mentionee) => ({
		start: mentionee.index,
		end: mentionee.index + mentionee.length
	})).toSorted((left, right) => left.start - right.start);
	let stripped = "";
	let cursor = 0;
	for (const span of spans) {
		stripped += text.slice(cursor, span.start);
		if (/\S$/u.test(stripped) && /^\S/u.test(text.slice(span.end))) stripped += " ";
		cursor = Math.max(cursor, span.end);
	}
	return `${stripped}${text.slice(cursor)}`.trim();
}
//#endregion
//#region extensions/line/src/bot-message-context.ts
function getLineSourceInfo(source) {
	if (!source) return {
		userId: void 0,
		groupId: void 0,
		roomId: void 0,
		isGroup: false
	};
	return {
		userId: source.type === "user" ? source.userId : source.type === "group" ? source.userId : source.type === "room" ? source.userId : void 0,
		groupId: source.type === "group" ? source.groupId : void 0,
		roomId: source.type === "room" ? source.roomId : void 0,
		isGroup: source.type === "group" || source.type === "room"
	};
}
function buildPeerId(source) {
	if (!source) return "unknown";
	const groupKey = normalizeOptionalString(source.type === "group" ? source.groupId : void 0) ?? normalizeOptionalString(source.type === "room" ? source.roomId : void 0);
	if (groupKey) return groupKey;
	if (source.type === "user" && source.userId) return source.userId;
	return "unknown";
}
async function resolveLineInboundRoute(params) {
	recordChannelActivity({
		channel: "line",
		accountId: params.account.accountId,
		direction: "inbound"
	});
	const { userId, groupId, roomId, isGroup } = getLineSourceInfo(params.source);
	const peerId = buildPeerId(params.source);
	let route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "line",
		accountId: params.account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		}
	});
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "line",
			accountId: params.account.accountId,
			conversationId: peerId
		}
	});
	let configuredBinding = configuredRoute.bindingResolution;
	const configuredBindingSessionKey = configuredRoute.boundSessionKey ?? "";
	route = configuredRoute.route;
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route,
		conversation: {
			channel: "line",
			accountId: params.account.accountId,
			conversationId: peerId
		}
	});
	route = runtimeRoute.route;
	if (runtimeRoute.bindingRecord) {
		configuredBinding = null;
		logVerbose(runtimeRoute.boundSessionKey ? `line: routed via bound conversation ${peerId} -> ${runtimeRoute.boundSessionKey}` : `line: plugin-bound conversation ${peerId}`);
	}
	if (configuredBinding) {
		const ensured = await ensureConfiguredBindingRouteReady({
			cfg: params.cfg,
			bindingResolution: configuredBinding
		});
		if (!ensured.ok) {
			logVerbose(`line: configured ACP binding unavailable for ${peerId} -> ${configuredBindingSessionKey}: ${ensured.error}`);
			throw new Error(`Configured ACP binding unavailable: ${ensured.error}`);
		}
		logVerbose(`line: using configured ACP binding for ${peerId} -> ${configuredBindingSessionKey}`);
	}
	return {
		userId,
		groupId,
		roomId,
		isGroup,
		peerId,
		route
	};
}
/**
* Describe a sticker from what its webhook actually carries: LINE sends up to
* 15 keywords for the sticker, and a message sticker also carries the sender's
* own text. The package name is not among those facts and cannot be derived
* from the package id, so it is not part of the description.
*/
function describeLineSticker(sticker) {
	const description = readNonEmptyStringPreservingWhitespace(sticker.text) ?? normalizeStringEntries(sticker.keywords ?? []).slice(0, 3).join(", ");
	return description ? `[Sent a sticker: ${description}]` : "[Sent a sticker]";
}
function readLineTextMessageBody(message) {
	let text = message.text;
	for (const { index, length } of (message.emojis ?? []).toSorted((a, b) => b.index - a.index)) if (index >= 0 && length === 2 && text.slice(index, index + length) === "()") text = `${text.slice(0, index)}[emoji]${text.slice(index + length)}`;
	return text;
}
function extractMessageText(message) {
	if (message.type === "text") return readLineTextMessageBody(message);
	if (message.type === "location") {
		const loc = message;
		return formatLocationText({
			latitude: loc.latitude,
			longitude: loc.longitude,
			name: loc.title,
			address: loc.address
		}) ?? "";
	}
	if (message.type === "sticker") return describeLineSticker(message);
	return "";
}
function extractNativeMediaKind(message) {
	switch (message.type) {
		case "image": return "image";
		case "video": return "video";
		case "audio": return "audio";
		case "file": return "document";
		default: return;
	}
}
async function finalizeLineInboundContext(params) {
	const senderId = params.source.userId ?? "unknown";
	const clientOpts = {
		cfg: params.cfg,
		accountId: params.account.accountId,
		channelAccessToken: params.account.channelAccessToken
	};
	const [senderName, groupName] = await Promise.all([params.source.userId ? getUserProfile(params.source.userId, {
		...clientOpts,
		groupId: params.source.groupId,
		roomId: params.source.roomId
	}).then((profile) => profile?.displayName) : void 0, params.source.groupId ? getLineGroupName(params.source.groupId, clientOpts) : void 0]);
	const senderLabel = senderName ?? (params.source.userId ? `user:${params.source.userId}` : "unknown");
	const conversationLabel = params.source.isGroup ? groupName ?? (params.source.groupId ? `group:${params.source.groupId}` : params.source.roomId ? `room:${params.source.roomId}` : "unknown-group") : senderLabel;
	const address = params.source.groupId ? `line:group:${params.source.groupId}` : params.source.roomId ? `line:room:${params.source.roomId}` : `line:${params.source.userId ?? params.source.peerId}`;
	const groupConfig = params.source.isGroup ? resolveLineGroupConfigEntry(params.account.config.groups, {
		groupId: params.source.groupId,
		roomId: params.source.roomId
	}) : void 0;
	const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
		cfg: params.cfg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey
	});
	const agentBody = params.agentBody ?? params.rawBody;
	const media = params.media.length === 0 ? [] : await toInboundMediaFactsWithMetadata(params.media);
	const body = formatInboundEnvelope({
		channel: "LINE",
		from: conversationLabel,
		timestamp: params.timestamp,
		body: agentBody,
		chatType: params.source.isGroup ? "group" : "direct",
		sender: {
			id: senderId,
			name: senderName
		},
		previousTimestamp,
		envelope: envelopeOptions
	});
	const ctxPayload = (params.buildContext ?? buildChannelInboundEventContext)({
		channelIngress: params.channelIngress,
		channel: "line",
		accountId: params.route.accountId,
		messageId: params.messageSid,
		timestamp: params.timestamp,
		from: address,
		sender: {
			id: senderId,
			name: senderName
		},
		conversation: {
			kind: params.source.isGroup ? "group" : "direct",
			id: params.source.peerId,
			label: conversationLabel
		},
		route: {
			...params.route,
			routeSessionKey: params.route.sessionKey
		},
		reply: {
			to: address,
			originatingTo: address
		},
		message: {
			body,
			bodyForAgent: agentBody,
			rawBody: params.rawBody,
			commandBody: params.commandBody ?? params.rawBody,
			inboundHistory: params.inboundHistory
		},
		access: {
			commands: { authorized: params.commandAuthorized },
			mentions: params.mentions
		},
		media,
		extra: {
			...params.locationContext,
			GroupSubject: params.source.isGroup ? groupName ?? params.source.groupId ?? params.source.roomId : void 0,
			GroupSystemPrompt: normalizeOptionalString(groupConfig?.systemPrompt)
		}
	});
	const pinnedMainDmOwner = !params.source.isGroup ? resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: params.cfg.session?.dmScope,
		allowFrom: params.account.config.allowFrom,
		normalizeEntry: (entry) => normalizeAllowFrom([entry]).entries[0]
	}) : null;
	const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route: params.route,
		sessionKey: params.route.sessionKey
	});
	if (shouldLogVerbose()) {
		const preview = truncateUtf16Safe(body, 200).replace(/\n/g, "\\n");
		const mediaInfo = params.verboseLog.kind === "inbound" && (params.verboseLog.mediaCount ?? 0) > 1 ? ` mediaCount=${params.verboseLog.mediaCount}` : "";
		const label = params.verboseLog.kind === "inbound" ? "line inbound" : "line postback";
		logVerbose(`${label}: from=${ctxPayload.From} len=${body.length}${mediaInfo} preview="${preview}"`);
	}
	return {
		ctxPayload,
		replyToken: params.event.replyToken,
		skillFilter: groupConfig?.skills,
		turn: {
			storePath,
			record: {
				updateLastRoute: !params.source.isGroup ? {
					sessionKey: inboundLastRouteSessionKey,
					channel: "line",
					to: params.source.userId ?? params.source.peerId,
					accountId: params.route.accountId,
					mainDmOwnerPin: inboundLastRouteSessionKey === params.route.mainSessionKey && pinnedMainDmOwner && params.source.userId ? {
						ownerRecipient: pinnedMainDmOwner,
						senderRecipient: params.source.userId,
						onSkip: ({ ownerRecipient, senderRecipient }) => {
							logVerbose(`line: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
						}
					} : void 0
				} : void 0,
				onRecordError: (err) => {
					logVerbose(`line: failed updating session meta: ${String(err)}`);
				}
			}
		}
	};
}
async function buildLineMessageContext(params) {
	const { event, allMedia, mediaUnavailable, cfg, account, commandAuthorized, inboundHistory } = params;
	const source = event.source;
	const { userId, groupId, roomId, isGroup, peerId, route } = await resolveLineInboundRoute({
		source,
		cfg,
		account
	});
	const message = event.message;
	const messageId = message.id;
	const timestamp = event.timestamp;
	const textContent = extractMessageText(message);
	const nativeMediaKind = extractNativeMediaKind(message);
	const mediaFacts = allMedia.length > 0 ? allMedia.map((media) => ({
		...media,
		kind: nativeMediaKind
	})) : nativeMediaKind ? [{ kind: nativeMediaKind }] : [];
	const rawBody = textContent;
	const shortfallNotice = params.missingParts ? `[line: ${params.missingParts === 1 ? "1 more image in this send was" : `${params.missingParts} more images in this send were`} not delivered]` : void 0;
	const withShortfall = shortfallNotice ? formatInboundMediaUnavailableText({
		body: rawBody,
		notice: shortfallNotice
	}) : rawBody;
	const agentBody = mediaUnavailable ? formatInboundMediaUnavailableText({
		body: withShortfall,
		notice: "[line attachment unavailable]"
	}) : withShortfall;
	if (!agentBody && mediaFacts.length === 0) return null;
	recordLineQuoteToken({
		accountId: account.accountId,
		chatId: peerId,
		messageId,
		quoteToken: readLineQuoteToken(message)
	});
	let locationContext;
	if (message.type === "location") {
		const loc = message;
		locationContext = toLocationContext({
			latitude: loc.latitude,
			longitude: loc.longitude,
			name: loc.title,
			address: loc.address
		});
	}
	const finalized = await finalizeLineInboundContext({
		cfg,
		account,
		event,
		route,
		source: {
			userId,
			groupId,
			roomId,
			isGroup,
			peerId
		},
		rawBody,
		agentBody,
		commandBody: resolveLineMentionStrippedText(message) || rawBody,
		mentions: params.mentions,
		timestamp,
		messageSid: messageId,
		commandAuthorized,
		channelIngress: await params.resolveChannelIngress?.({
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			messageId,
			inboundEventKind: "user_request"
		}),
		buildContext: params.buildContext,
		media: mediaFacts,
		locationContext,
		verboseLog: {
			kind: "inbound",
			mediaCount: allMedia.length
		},
		inboundHistory
	});
	return {
		ctxPayload: finalized.ctxPayload,
		turn: finalized.turn,
		skillFilter: finalized.skillFilter,
		event,
		userId,
		groupId,
		roomId,
		isGroup,
		route,
		replyToken: event.replyToken,
		accountId: account.accountId
	};
}
async function buildLinePostbackContext(params) {
	const { event, cfg, account, commandAuthorized } = params;
	const source = event.source;
	const { userId, groupId, roomId, isGroup, peerId, route } = await resolveLineInboundRoute({
		source,
		cfg,
		account
	});
	const timestamp = event.timestamp;
	const rawBody = event.postback?.data?.trim() ?? "";
	if (!rawBody) return null;
	let agentBody = rawBody;
	if (rawBody.includes("line.action=")) {
		const searchParams = new URLSearchParams(rawBody);
		const action = searchParams.get("line.action") ?? "";
		const device = searchParams.get("line.device");
		agentBody = device ? `line action ${action} device ${device}` : `line action ${action}`;
	}
	for (const [key, value] of Object.entries(event.postback.params ?? {}).toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) {
		const picked = normalizeOptionalString(value);
		if (picked) agentBody += ` ${key}=${picked}`;
	}
	const messageSid = event.replyToken ? `postback:${event.replyToken}` : `postback:${timestamp}`;
	const finalized = await finalizeLineInboundContext({
		cfg,
		account,
		event,
		route,
		source: {
			userId,
			groupId,
			roomId,
			isGroup,
			peerId
		},
		rawBody,
		agentBody,
		timestamp,
		messageSid,
		commandAuthorized,
		channelIngress: await params.resolveChannelIngress?.({
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			messageId: messageSid,
			inboundEventKind: "user_request"
		}),
		buildContext: params.buildContext,
		media: [],
		verboseLog: { kind: "postback" }
	});
	return {
		ctxPayload: finalized.ctxPayload,
		turn: finalized.turn,
		skillFilter: finalized.skillFilter,
		event,
		userId,
		groupId,
		roomId,
		isGroup,
		route,
		replyToken: event.replyToken,
		accountId: account.accountId
	};
}
//#endregion
//#region extensions/line/src/group-history.ts
const reservedEntries = /* @__PURE__ */ new WeakSet();
function reserveLineGroupHistory(historyMap, historyKey, limit) {
	if (!historyMap || !historyKey || limit <= 0) return {
		commit: () => {},
		release: () => {}
	};
	const consumedEntries = (historyMap.get(historyKey) ?? []).filter((entry) => !reservedEntries.has(entry));
	for (const entry of consumedEntries) reservedEntries.add(entry);
	const inboundHistory = createChannelHistoryWindow({ historyMap: /* @__PURE__ */ new Map([[historyKey, consumedEntries]]) }).buildInboundHistory({
		historyKey,
		limit
	});
	let settled = false;
	const settle = () => {
		if (settled) return false;
		settled = true;
		for (const entry of consumedEntries) reservedEntries.delete(entry);
		return true;
	};
	return {
		inboundHistory,
		commit: () => {
			if (!settle() || consumedEntries.length === 0) return;
			const consumed = new Set(consumedEntries);
			const kept = (historyMap.get(historyKey) ?? []).filter((entry) => !consumed.has(entry));
			if (kept.length > 0) historyMap.set(historyKey, kept);
			else historyMap.delete(historyKey);
		},
		release: () => {
			settle();
		}
	};
}
//#endregion
//#region extensions/line/src/bot-handlers.ts
const LINE_DOWNLOADABLE_MESSAGE_TYPES = /* @__PURE__ */ new Set([
	"image",
	"video",
	"audio",
	"file"
]);
function isDownloadableLineMessageType(messageType) {
	return LINE_DOWNLOADABLE_MESSAGE_TYPES.has(messageType);
}
function normalizeLineIngressEntry(value) {
	return normalizeLineAllowEntry(value) || null;
}
/**
* Say one line back to a sender, preferring their reply token so the answer costs no
* push quota, and falling back to a push when no token is usable. A partial-delivery
* failure means the reply was seen, so it never falls back.
*/
async function sendLineHandlerText(params) {
	const { context, logLabel, text } = params;
	const sendOptions = {
		cfg: context.cfg,
		accountId: context.account.accountId,
		channelAccessToken: context.account.channelAccessToken,
		...params.authorize ? { authorize: params.authorize } : {}
	};
	if (params.replyToken) {
		if (params.authorize && !await params.authorize()) return;
		try {
			await replyMessageLine(params.replyToken, [{
				type: "text",
				text
			}], sendOptions);
			return;
		} catch (err) {
			logVerbose(`${logLabel}: ${String(err)}`);
			if (isChannelPartialDeliveryError(err)) return;
		}
	}
	if (params.authorize && !await params.authorize()) return;
	try {
		await pushMessageLine(params.pushTarget, text, sendOptions);
	} catch (err) {
		logVerbose(`${logLabel}: ${String(err)}`);
	}
}
async function sendLinePairingReply(params) {
	const { senderId, replyToken, context } = params;
	const idLabel = (() => {
		try {
			return resolvePairingIdLabel("line");
		} catch {
			return "lineUserId";
		}
	})();
	await createChannelPairingChallengeIssuer({
		channel: "line",
		accountId: context.account.accountId,
		upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
			channel: "line",
			id,
			accountId: context.account.accountId,
			meta
		})
	})({
		senderId,
		senderIdLine: `Your ${idLabel}: ${senderId}`,
		onCreated: () => {
			logVerbose(`line pairing request sender=${senderId}`);
		},
		sendPairingReply: async (text) => await sendLineHandlerText({
			context,
			text,
			replyToken,
			pushTarget: `line:${senderId}`,
			logLabel: `line pairing reply failed for ${senderId}`
		})
	});
}
function isLineEventAdmitted(access) {
	return access.senderAccess.decision === "allow" && (access.ingress.admission === "dispatch" || access.ingress.admission === "observe" || access.ingress.admission === "skip");
}
async function resolveLineEventAdmission(event, context) {
	const { cfg, account } = context;
	const { userId, groupId, roomId, isGroup } = getLineSourceInfo(event.source);
	const senderId = userId ?? "";
	const groupConfig = resolveLineGroupConfigEntry(account.config.groups, {
		groupId,
		roomId
	});
	const rawText = resolveEventRawText(event);
	const requireMention = isGroup ? groupConfig?.requireMention !== false : false;
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const { groupPolicy: runtimeGroupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.line !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	});
	const groupPolicy = runtimeGroupPolicy === "disabled" ? "disabled" : groupConfig?.allowFrom !== void 0 ? "allowlist" : runtimeGroupPolicy;
	const groupAllowFrom = normalizeStringEntries(firstDefined(groupConfig?.allowFrom, account.config.groupAllowFrom));
	const mentionFacts = (() => {
		if (!isGroup || event.type !== "message") return;
		const peerId = groupId ?? roomId ?? userId ?? "unknown";
		const { agentId } = resolveAgentRoute({
			cfg,
			channel: "line",
			accountId: account.accountId,
			peer: {
				kind: "group",
				id: peerId
			}
		});
		const mentionRegexes = buildMentionRegexes(cfg, agentId);
		const wasMentionedByNative = isLineBotMentioned(event.message);
		const wasMentionedByPattern = event.message.type === "text" ? matchesMentionPatterns(rawText, mentionRegexes) : false;
		return {
			canDetectMention: event.message.type === "text",
			wasMentioned: wasMentionedByNative || wasMentionedByPattern,
			explicitlyMentionedBot: wasMentionedByNative,
			hasAnyMention: hasAnyLineMention(event.message),
			implicitMentionKinds: implicitMentionKindWhen("quoted_bot", quotesLineBotMessage(account.accountId, resolveLineQuotedMessageId(event.message)))
		};
	})();
	const resolveAccess = async (contextBinding) => await getLineRuntime().channel.inbound.ingress.resolveStable({
		channelId: "line",
		accountId: account.accountId,
		identity: {
			key: "line-user-id",
			normalize: normalizeLineIngressEntry,
			sensitivity: "pii",
			entryIdPrefix: "line-entry"
		},
		cfg,
		readStoreAllowFrom: async () => await readChannelAllowFromStore("line", void 0, account.accountId),
		subject: event.type === "join" ? {} : { stableId: senderId },
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: (groupId ?? roomId ?? senderId) || "unknown"
		},
		...contextBinding ? { contextBinding } : {},
		...isGroup && groupConfig?.enabled === false ? { route: {
			id: "line:group-config",
			enabled: false
		} } : {},
		mentionFacts,
		event: { kind: event.type === "join" ? "system" : event.type },
		dmPolicy,
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			activation: {
				requireMention: isGroup && event.type === "message" && requireMention,
				allowTextCommands: true,
				implicitMentions: resolveChannelImplicitMentions({
					cfg,
					channel: "line",
					accountId: account.accountId
				})
			}
		},
		allowFrom: normalizeStringEntries(account.config.allowFrom),
		groupAllowFrom,
		command: {
			hasControlCommand: hasControlCommand(rawText, cfg),
			groupOwnerAllowFrom: "none"
		}
	});
	const access = await resolveAccess();
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "line",
		accountId: account.accountId,
		log: (message) => logVerbose(message)
	});
	if (event.type === "join") return groupConfig?.enabled !== false && groupPolicy !== "disabled" && (groupPolicy !== "allowlist" || access.state.allowlists.group.hasMatchableEntries) ? {
		access,
		resolveBoundAccess: resolveAccess
	} : null;
	if (isLineEventAdmitted(access)) return {
		access,
		resolveBoundAccess: resolveAccess,
		mentions: mentionFacts ? {
			...mentionFacts,
			wasMentioned: access.activationAccess.effectiveWasMentioned ?? mentionFacts.wasMentioned,
			requireMention
		} : void 0
	};
	if (access.senderAccess.decision === "allow") {
		logVerbose(`Blocked line event (${access.ingress.reasonCode})`);
		return null;
	}
	if (isGroup) {
		if (groupConfig?.enabled === false) {
			logVerbose(`Blocked line group ${groupId ?? roomId ?? "unknown"} (group disabled)`);
			return null;
		}
		if (groupConfig?.allowFrom !== void 0) {
			if (!senderId) {
				logVerbose("Blocked line group message (group allowFrom override, no sender ID)");
				return null;
			}
			if (access.senderAccess.reasonCode !== "group_policy_allowed") {
				logVerbose(`Blocked line group sender ${senderId} (group allowFrom override)`);
				return null;
			}
		}
		if (access.senderAccess.reasonCode === "group_policy_disabled") logVerbose("Blocked line group message (groupPolicy: disabled)");
		else if (!senderId && groupPolicy === "allowlist") logVerbose("Blocked line group message (no sender ID, groupPolicy: allowlist)");
		else if (access.senderAccess.reasonCode === "group_policy_empty_allowlist") logVerbose("Blocked line group message (groupPolicy: allowlist, no groupAllowFrom)");
		else logVerbose(`Blocked line group message from ${senderId} (groupPolicy: allowlist)`);
		return null;
	}
	if (access.senderAccess.reasonCode === "dm_policy_disabled") {
		logVerbose("Blocked line sender (dmPolicy: disabled)");
		return null;
	}
	if (access.senderAccess.decision === "pairing") {
		if (!senderId) {
			logVerbose("Blocked line sender (dmPolicy: pairing, no sender ID)");
			return null;
		}
		await sendLinePairingReply({
			senderId,
			replyToken: "replyToken" in event ? event.replyToken : void 0,
			context
		});
		return null;
	}
	logVerbose(`Blocked line sender ${senderId || "unknown"} (dmPolicy: ${account.config.dmPolicy ?? "pairing"})`);
	return null;
}
function resolveLineQuotedMessageId(message) {
	return message.type === "text" || message.type === "sticker" ? message.quotedMessageId : void 0;
}
function resolveEventRawText(event) {
	if (event.type === "message") {
		const msg = event.message;
		if (msg.type === "text") return readLineTextMessageBody(msg);
		return "";
	}
	if (event.type === "postback") return event.postback?.data?.trim() ?? "";
	return "";
}
async function handleMessageEvent(event, context, setParts) {
	const { cfg, account, runtime, mediaMaxBytes, processMessage } = context;
	const message = event.message;
	const decision = await resolveLineEventAdmission(event, context);
	if (!decision) return;
	const { isGroup, groupId, roomId, userId } = getLineSourceInfo(event.source);
	if (isGroup && decision.access.activationAccess.shouldSkip) {
		const rawText = message.type === "text" ? readLineTextMessageBody(message) : "";
		const historyKey = groupId ?? roomId;
		const groupsConfigPath = resolveChannelGroupsConfigPath({
			cfg,
			channel: "line",
			accountId: account.accountId,
			groups: account.config.groups
		});
		logInboundDrop({
			log: runtime.log,
			channel: "line",
			reason: "no mention",
			target: historyKey,
			onceKey: JSON.stringify([account.accountId, historyKey]),
			hint: `Mention patterns can be derived from the agent identity name. Set ${groupsConfigPath}[${JSON.stringify(historyKey)}].requireMention=false to process messages without a mention. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`
		});
		const senderId = userId ?? "unknown";
		if (historyKey && context.groupHistories) {
			const displayName = userId ? await getUserDisplayName(userId, {
				cfg,
				accountId: account.accountId,
				channelAccessToken: account.channelAccessToken,
				groupId,
				roomId
			}) : senderId;
			const sender = displayName === senderId ? senderId : `${displayName} (${senderId})`;
			createChannelHistoryWindow({ historyMap: context.groupHistories }).record({
				historyKey,
				limit: context.historyLimit ?? DEFAULT_GROUP_HISTORY_LIMIT,
				entry: {
					sender,
					body: rawText || `<${message.type}>`,
					timestamp: event.timestamp
				}
			});
		}
		return;
	}
	const groupHistoryKey = isGroup ? groupId ?? roomId : void 0;
	const historyReservation = reserveLineGroupHistory(context.groupHistories, groupHistoryKey, context.historyLimit ?? DEFAULT_GROUP_HISTORY_LIMIT);
	try {
		const allMedia = [];
		let mediaUnavailable = false;
		const abortSignal = context.turnAdoptionLifecycle?.abortSignal;
		for (const part of orderedLineSetMessages(message, setParts)) {
			if (!isDownloadableLineMessageType(part.type)) continue;
			try {
				const originalFilename = part.type === "file" ? normalizeOptionalString(part.fileName) : void 0;
				const media = await downloadLineMedia(part.id, account.channelAccessToken, mediaMaxBytes, {
					originalFilename,
					...abortSignal ? { signal: abortSignal } : {}
				});
				abortSignal?.throwIfAborted();
				allMedia.push({
					path: media.path,
					contentType: media.contentType,
					...originalFilename ? { fileName: originalFilename } : {}
				});
			} catch (err) {
				if (abortSignal?.aborted) throw abortSignal.reason;
				if (isRetryableLineInboundMediaError(err)) throw err;
				mediaUnavailable = true;
				const errMsg = String(err);
				if (errMsg.includes("exceeds") && errMsg.includes("limit")) logVerbose(`line: media exceeds size limit for message ${part.id}`);
				else runtime.error?.(danger(`line: failed to download media: ${errMsg}`));
			}
		}
		const messageContext = await buildLineMessageContext({
			event: setParts.reduce((freshest, part) => part.timestamp > freshest.timestamp ? part : freshest, event),
			allMedia: [...allMedia],
			mediaUnavailable,
			...context.missingParts === void 0 ? {} : { missingParts: context.missingParts },
			cfg,
			account,
			commandAuthorized: decision.access.commandAccess.authorized,
			resolveChannelIngress: decision.resolveBoundAccess,
			inboundHistory: historyReservation.inboundHistory,
			mentions: decision.mentions,
			buildContext: context.buildContext
		});
		if (!messageContext) logVerbose("line: skipping empty message");
		else {
			await processMessage(messageContext, {
				cfg: context.cfg,
				...context.turnAdoptionLifecycle ? { turnAdoptionLifecycle: context.turnAdoptionLifecycle } : {}
			});
			historyReservation.commit();
		}
	} finally {
		historyReservation.release();
	}
}
async function handleFollowEvent(event, _context) {
	const { userId } = getLineSourceInfo(event.source);
	logVerbose(`line: user ${userId ?? "unknown"} followed`);
}
async function handleUnfollowEvent(event, _context) {
	const { userId } = getLineSourceInfo(event.source);
	logVerbose(`line: user ${userId ?? "unknown"} unfollowed`);
}
async function handleJoinEvent(event, context) {
	const { groupId, roomId, isGroup } = getLineSourceInfo(event.source);
	const conversationId = groupId ?? roomId;
	if (!isGroup || !conversationId) return;
	logVerbose(`line: bot joined ${groupId ? `group ${groupId}` : `room ${roomId}`}`);
	const { cfg, account } = context;
	const roomAllowed = Boolean(await resolveLineEventAdmission(event, context));
	await reportChannelRoomJoin({
		cfg,
		channel: "line",
		accountId: account.accountId,
		conversationId,
		deliverTo: conversationId,
		route: resolveAgentRoute({
			cfg,
			channel: "line",
			accountId: account.accountId,
			peer: {
				kind: "group",
				id: conversationId
			}
		}),
		roomAllowed,
		resolveRoomContext: async () => {
			const roomContext = { historyUnavailable: true };
			const title = groupId ? await getLineGroupName(groupId, {
				cfg,
				accountId: account.accountId,
				channelAccessToken: account.channelAccessToken
			}) : void 0;
			return title ? {
				...roomContext,
				title
			} : roomContext;
		}
	});
}
async function handleLeaveEvent(event, _context) {
	const { groupId, roomId } = getLineSourceInfo(event.source);
	logVerbose(`line: bot left ${groupId ? `group ${groupId}` : `room ${roomId}`}`);
}
/** What a tap that did not answer the question has to tell the person who tapped. */
function lineQuestionOutcomeNotice(status) {
	if (status === "already-terminal") return "That question is no longer waiting for an answer.";
	return "Could not record that answer. Reply with the option text instead.";
}
async function handlePostbackEvent(event, context) {
	const data = event.postback.data;
	logVerbose(`line: received postback: ${data}`);
	const decision = await resolveLineEventAdmission(event, context);
	if (!decision) return;
	const question = parseLineQuestionPostbackData(data ?? "");
	if (question) {
		const { userId, groupId, roomId } = getLineSourceInfo(event.source);
		const authorize = async () => isLineEventAdmitted(await decision.resolveBoundAccess());
		const outcome = await resolveLineQuestionPostback({
			cfg: context.cfg,
			callback: question,
			accountId: context.account.accountId,
			...userId ? { senderId: userId } : {},
			authorize
		});
		const pushTarget = groupId ?? roomId ?? (userId ? `line:${userId}` : void 0);
		if (outcome.status === "answered" || outcome.status === "denied" || !pushTarget) return;
		await sendLineHandlerText({
			context,
			replyToken: event.replyToken,
			pushTarget,
			logLabel: "line: question answer notice failed",
			text: lineQuestionOutcomeNotice(outcome.status),
			authorize
		});
		return;
	}
	const postbackContext = await buildLinePostbackContext({
		event,
		cfg: context.cfg,
		account: context.account,
		commandAuthorized: decision.access.commandAccess.authorized,
		resolveChannelIngress: decision.resolveBoundAccess,
		buildContext: context.buildContext
	});
	if (!postbackContext) return;
	await context.processMessage(postbackContext, {
		cfg: context.cfg,
		...context.turnAdoptionLifecycle ? { turnAdoptionLifecycle: context.turnAdoptionLifecycle } : {}
	});
}
/** Media reads in the order the sender picked, whatever order LINE delivered. */
function orderedLineSetMessages(message, setParts) {
	const messages = [message, ...setParts.map((partEvent) => partEvent.message)];
	const indexOf = (part) => part.type === "image" ? part.imageSet?.index ?? Number.MAX_SAFE_INTEGER : 0;
	return messages.toSorted((left, right) => indexOf(left) - indexOf(right));
}
/**
* Answers one delivery as one turn. The ingress spool decides which events share
* a turn - a multi-image send is handed over as one delivery - so the first
* event is the turn's own and the rest are the set parts behind it.
*/
async function handleLineWebhookEvents(events, context) {
	const [event, ...setParts] = events;
	if (!event) return;
	try {
		await handleLineWebhookEvent(event, context, setParts);
	} catch (err) {
		context.runtime.error?.(danger(`line: event handler failed: ${String(err)}`));
		throw toErrorObject(err, "Non-Error thrown");
	}
}
async function handleLineWebhookEvent(event, context, setParts = []) {
	switch (event.type) {
		case "message":
			await handleMessageEvent(event, context, setParts.filter((part) => part.type === "message"));
			break;
		case "follow":
			await handleFollowEvent(event, context);
			break;
		case "unfollow":
			await handleUnfollowEvent(event, context);
			break;
		case "join":
			await handleJoinEvent(event, context);
			break;
		case "leave":
			await handleLeaveEvent(event, context);
			break;
		case "postback":
			await handlePostbackEvent(event, context);
			break;
		default: logVerbose(`line: unhandled event type: ${event.type}`);
	}
}
//#endregion
//#region extensions/line/src/inbound-image-set.ts
const IMAGE_SET_FLUSH_DELAY_MS = 4e3;
/**
* Ordered by the index the sender picked, falling back to arrival.
*
* `index` is optional per part in LINE's contract, so a set can arrive partly
* indexed. Choosing the key per pair would make the comparator intransitive and
* the resulting order depend on insertion; ranking unindexed parts last keeps
* one total order for every mix.
*/
function orderedParts(pending) {
	return [...pending.parts.values()].toSorted((left, right) => (left.index ?? Number.MAX_SAFE_INTEGER) - (right.index ?? Number.MAX_SAFE_INTEGER) || left.arrivedAt - right.arrivedAt);
}
/**
* Buffers the parts of a LINE image set until the set is whole.
*
* The first part becomes the set's holder: its call does not resolve until the
* set completes or its wait expires, and it is the one that delivers. Keeping
* that call open is what keeps the combined turn inside a live ingress
* adoption - a turn dispatched after every part had returned is refused by
* admission, so a set that never completes would never be delivered at all.
*/
function createLineImageSetIngressBuffer() {
	const pendingBySet = /* @__PURE__ */ new Map();
	const deliveredBySet = /* @__PURE__ */ new Map();
	const pendingKey = (laneKey, senderKey, setId) => `${laneKey}\u0000${senderKey}\u0000${setId}`;
	const laneChain = /* @__PURE__ */ new Map();
	const enterLane = async (laneKey) => {
		let release = () => {};
		const held = new Promise((resolve) => {
			release = resolve;
		});
		let entered = () => {};
		const turn = new Promise((resolve) => {
			entered = resolve;
		});
		enqueueKeyedTask({
			tails: laneChain,
			key: laneKey,
			task: async () => {
				entered();
				await held;
			}
		});
		await turn;
		return release;
	};
	const admit = async (input) => {
		const part = {
			index: input.index,
			arrivedAt: Date.now(),
			event: input.event,
			lifecycle: input.lifecycle
		};
		const key = pendingKey(input.laneKey, input.senderKey, input.setId);
		const forming = pendingBySet.get(key);
		if (forming) {
			forming.parts.set(input.messageId, part);
			forming.total ??= input.total;
			if (forming.total !== void 0 && forming.parts.size >= forming.total) {
				forming.release();
				return null;
			}
			if (forming.timer) {
				clearTimeout(forming.timer);
				forming.timer = setTimeout(forming.release, forming.flushDelayMs);
				forming.timer.unref?.();
			}
			return null;
		}
		let release = () => {};
		const whole = new Promise((resolve) => {
			release = resolve;
		});
		const pending = {
			parts: /* @__PURE__ */ new Map([[input.messageId, part]]),
			total: input.total,
			flushDelayMs: input.flushDelayMs ?? IMAGE_SET_FLUSH_DELAY_MS,
			release: () => {
				clearTimeout(pending.timer);
				release();
			}
		};
		pendingBySet.set(key, pending);
		const carried = deliveredBySet.get(key);
		if (carried) {
			clearTimeout(carried.timer);
			deliveredBySet.delete(key);
		}
		const carriedMessageIds = carried?.messageIds ?? /* @__PURE__ */ new Set();
		const releaseLane = await enterLane(input.laneKey);
		pending.timer = setTimeout(pending.release, pending.flushDelayMs);
		pending.timer.unref?.();
		if (pending.total !== void 0 && pending.parts.size >= pending.total) pending.release();
		await whole;
		pendingBySet.delete(key);
		const ordered = orderedParts(pending);
		const deliveredMessageIds = /* @__PURE__ */ new Set([...carriedMessageIds, ...pending.parts.keys()]);
		const missing = pending.total === void 0 ? 0 : pending.total - deliveredMessageIds.size;
		if (missing > 0) {
			const carry = { messageIds: deliveredMessageIds };
			carry.timer = setTimeout(() => deliveredBySet.delete(key), pending.flushDelayMs * 5);
			carry.timer.unref?.();
			deliveredBySet.set(key, carry);
		}
		return {
			events: ordered.map((entry) => entry.event),
			lifecycles: ordered.map((entry) => entry.lifecycle),
			...missing > 0 ? { missing } : {},
			finish: releaseLane
		};
	};
	return {
		admit,
		enterLane,
		isBusy: (laneKey) => laneChain.has(laneKey)
	};
}
//#endregion
//#region extensions/line/src/webhook-spool.ts
const LINE_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const LINE_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const LINE_WEBHOOK_DRAIN_SCAN_LIMIT = 100;
const LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS = 5e3;
var LineWebhookTerminalDeliveryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.reason = "delivery-side-effects-committed";
		this.name = "LineWebhookTerminalDeliveryError";
	}
};
function parseStoredEvent(rawEvent) {
	let event;
	try {
		event = JSON.parse(rawEvent);
	} catch (error) {
		throw new LineWebhookPayloadError("LINE webhook event JSON is invalid.", { cause: error });
	}
	return event;
}
function isLineAuthenticationFailure(error) {
	if (!error || typeof error !== "object") return false;
	const status = error.status;
	return status === 401 || status === 403;
}
async function waitForActiveDeliveriesBeforeDispose(activeDeliveries) {
	let timeout;
	try {
		return await Promise.race([Promise.allSettled(activeDeliveries).then(() => true), new Promise((resolve) => {
			timeout = setTimeout(() => resolve(false), LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
/** The imageSet a LINE inbound event belongs to, when it reported one. */
function senderKeyFor(event) {
	const source = event.source;
	return source && "userId" in source && source.userId ? `user:${source.userId}` : "anonymous";
}
function resolveLineInboundImageSet(event) {
	if (event.type !== "message" || event.message.type !== "image") return;
	const imageSet = event.message.imageSet;
	return imageSet?.id ? {
		setId: imageSet.id,
		senderKey: senderKeyFor(event),
		messageId: event.message.id,
		...imageSet.index === void 0 ? {} : { index: imageSet.index },
		...imageSet.total === void 0 ? {} : { total: imageSet.total }
	} : void 0;
}
function createLineWebhookSpool(options) {
	const imageSets = createLineImageSetIngressBuffer();
	const queue = options.queue ?? getLineRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const activeDeliveries = /* @__PURE__ */ new Set();
	let acceptsDeferredClaims = true;
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: ({ event }) => {
			const eventId = eventIdFor(event);
			return {
				eventId,
				laneKey: laneKeyFor(event, eventId)
			};
		},
		payload: {
			version: 1,
			serialize: ({ event, destination }) => ({
				rawEvent: JSON.stringify(event),
				destination
			}),
			deserialize: ({ rawEvent, destination }) => ({
				event: parseStoredEvent(rawEvent),
				destination
			}),
			encode: ({ version, body }) => ({
				version,
				rawEvent: body.rawEvent,
				destination: body.destination
			}),
			decode: (payload) => {
				if (typeof payload.rawEvent !== "string" || typeof payload.destination !== "string") throw new LineWebhookPayloadError(LINE_WEBHOOK_SPOOL_INVALID_PAYLOAD_MESSAGE);
				return {
					version: payload.version,
					body: {
						rawEvent: payload.rawEvent,
						destination: payload.destination
					}
				};
			},
			createClaimError: (kind) => new LineWebhookPayloadError(kind === "invalid-version" ? LINE_WEBHOOK_SPOOL_INVALID_PAYLOAD_MESSAGE : "LINE webhook event identity changed after durable admission.")
		},
		deliver: async ({ event, destination }, lifecycle) => {
			const laneKey = laneKeyFor(event, eventIdFor(event));
			const imageSet = resolveLineInboundImageSet(event);
			let turnEvents = [event];
			let turnLifecycles = [lifecycle];
			let releaseLane;
			let missingParts;
			if (imageSet) {
				if (!acceptsDeferredClaims) {
					await lifecycle.onAbandoned();
					return;
				}
				lifecycle.onDeferred();
				const set = await imageSets.admit({
					laneKey,
					setId: imageSet.setId,
					senderKey: imageSet.senderKey,
					messageId: imageSet.messageId,
					event,
					lifecycle,
					...imageSet.index === void 0 ? {} : { index: imageSet.index },
					...imageSet.total === void 0 ? {} : { total: imageSet.total }
				});
				if (!set) return;
				if (set.missing) {
					missingParts = set.missing;
					options.runtime.error?.(danger(`line: image set ${imageSet.setId} delivered ${set.events.length} of the send's parts, ${set.missing} still missing`));
				}
				turnEvents = set.events;
				turnLifecycles = set.lifecycles;
				releaseLane = set.finish;
			} else if (imageSets.isBusy(laneKey)) {
				if (!acceptsDeferredClaims) {
					await lifecycle.onAbandoned();
					return;
				}
				lifecycle.onDeferred();
				releaseLane = await imageSets.enterLane(laneKey);
			}
			const fannedIn = fanInChannelIngressLifecycles(turnLifecycles);
			const boundLifecycle = bindIngressLifecycleToReplyOptions(fannedIn.lifecycle ?? lifecycle).turnAdoptionLifecycle;
			let handedOff = false;
			const delivery = options.deliver(turnEvents, destination, {
				...missingParts === void 0 ? {} : { missingParts },
				turnAdoptionLifecycle: {
					...boundLifecycle,
					onAdopted: async () => {
						handedOff = true;
						await boundLifecycle.onAdopted();
					},
					onDeferred: () => {
						handedOff = true;
						if (!acceptsDeferredClaims) {
							Promise.resolve().then(() => boundLifecycle.onAbandoned()).catch((error) => {
								options.runtime.error?.(danger(`line: failed to abandon a late webhook delivery: ${formatErrorMessage(error)}`));
							});
							return;
						}
						boundLifecycle.onDeferred();
					},
					onAbandoned: async () => {
						handedOff = true;
						await boundLifecycle.onAbandoned();
					}
				}
			});
			activeDeliveries.add(delivery);
			try {
				await delivery;
			} catch (error) {
				await fannedIn.abandon(error);
				handedOff = true;
				throw error;
			} finally {
				activeDeliveries.delete(delivery);
				releaseLane?.();
			}
			if (!handedOff && !stopTask) {
				await fannedIn.settle();
				handedOff = true;
			}
			if (stopTask && !handedOff) {
				await fannedIn.abandon();
				return;
			}
		},
		pollIntervalMs: LINE_WEBHOOK_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedMaxEntries: 4096,
			failedMaxEntries: 4096
		},
		appendRetryDelaysMs: [0],
		waitForDeliveryIdleBeforeRepump: false,
		waitForDeliveryIdleOnStop: false,
		deferredClaims: "manual",
		runPumpTask: runDetachedWebhookWork,
		admissionMode: "durable-after-stop",
		drain: {
			adoptionStallTimeoutMs: DEFAULT_INGRESS_ADOPTION_STALL_MS,
			deferredLaneOccupancy: "release",
			orderBy: "received",
			scanLimit: LINE_WEBHOOK_DRAIN_SCAN_LIMIT,
			startLimit: LINE_WEBHOOK_MAX_CONCURRENT_DELIVERIES,
			retryPolicy: {
				maxAttempts: DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof LineWebhookPayloadError) return {
					reason: LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON,
					message: error.message
				};
				if (error instanceof LineWebhookTerminalDeliveryError) return {
					reason: error.reason,
					message: error.message
				};
				if (isLineAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(danger(`line: ${message}`))
		},
		createStoppedError: () => /* @__PURE__ */ new Error("LINE webhook spool is stopped."),
		onError: (error) => options.runtime.error?.(danger(`line: webhook spool drain failed: ${formatErrorMessage(error)}`))
	});
	let stopTask;
	return {
		accept: async (body) => {
			const events = (body.events ?? []).filter((event) => event.mode !== "standby");
			if (events.length === 0) return "ignored";
			return (await monitor.admitBatch(events.map((event) => ({
				event,
				destination: body.destination ?? ""
			})), { receivedAt: Date.now() })).some((admission) => admission.kind === "durable") ? "durable" : "ignored";
		},
		start: () => {
			if (!stopTask) monitor.start();
		},
		stop: () => {
			stopTask ??= (async () => {
				await monitor.pause();
				try {
					const deliveriesSettled = await waitForActiveDeliveriesBeforeDispose(activeDeliveries);
					if (!deliveriesSettled) options.runtime.log(warn(`line: timed out after ${LINE_WEBHOOK_ACTIVE_DELIVERY_STOP_GRACE_MS}ms waiting for active webhook deliveries; releasing drain ownership`));
					await monitor.waitForDeferredClaims();
					acceptsDeferredClaims = false;
					if (deliveriesSettled) await monitor.waitForIdle();
				} finally {
					await monitor.stop();
				}
			})();
			return stopTask;
		}
	};
}
//#endregion
//#region extensions/line/src/bot.ts
const DEFAULT_MEDIA_MAX_MB = 10;
function createLineBot(opts) {
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const startupConfig = opts.config ?? getRuntimeConfig();
	const startupRuntimeConfig = getRuntimeConfigSnapshot();
	const startupRuntimeSourceConfig = getRuntimeConfigSourceSnapshot();
	const followsRuntimeConfig = opts.config === void 0 || startupRuntimeConfig === startupConfig || startupRuntimeSourceConfig !== null && selectApplicableRuntimeConfig({
		inputConfig: startupConfig,
		runtimeConfig: startupRuntimeConfig,
		runtimeSourceConfig: startupRuntimeSourceConfig
	}) === startupRuntimeConfig;
	const resolveTurnConfig = () => (followsRuntimeConfig ? getRuntimeConfigSnapshot() : void 0) ?? startupConfig;
	const account = resolveLineAccount({
		cfg: startupConfig,
		accountId: opts.accountId
	});
	const mediaMaxBytes = ([opts.mediaMaxMb, account.config.mediaMaxMb].find((value) => typeof value === "number" && value > 0) ?? DEFAULT_MEDIA_MAX_MB) * 1024 * 1024;
	const processMessage = opts.onMessage ?? (async () => {
		logVerbose("line: no message handler configured");
	});
	const groupHistories = /* @__PURE__ */ new Map();
	const spool = createLineWebhookSpool({
		accountId: account.accountId,
		runtime,
		deliver: async (events, _destination, control) => {
			const cfg = resolveTurnConfig();
			await handleLineWebhookEvents([...events], {
				cfg,
				account,
				runtime,
				buildContext: opts.buildContext,
				mediaMaxBytes,
				processMessage,
				...control.turnAdoptionLifecycle ? { turnAdoptionLifecycle: control.turnAdoptionLifecycle } : {},
				...control.missingParts === void 0 ? {} : { missingParts: control.missingParts },
				groupHistories,
				historyLimit: resolvePromptHistoryLimit(account.config.historyLimit ?? cfg.messages?.groupChat?.historyLimit)
			});
		}
	});
	spool.start();
	return {
		handleWebhook: spool.accept,
		account,
		stop: spool.stop
	};
}
//#endregion
//#region extensions/line/src/monitor-durable.ts
function hasLineChannelData(payload) {
	const lineData = payload.channelData?.line;
	return Boolean(lineData && Object.keys(lineData).length > 0);
}
function resolveLineDurableReplyOptions(params) {
	if (params.infoKind !== "final") return false;
	if (params.replyToken && !params.replyTokenUsed) return false;
	if (hasLineChannelData(params.payload)) return false;
	const reply = resolveSendableOutboundReplyParts(params.payload);
	if (reply.hasMedia || !reply.hasText) return false;
	return { to: params.to };
}
//#endregion
//#region extensions/line/src/signature.ts
function validateLineSignature(body, signature, channelSecret) {
	const hash = crypto.createHmac("SHA256", channelSecret).update(body).digest("base64");
	return safeEqualSecret(signature, hash);
}
//#endregion
//#region extensions/line/src/webhook-utils.ts
/** Route the gateway serves when an account configures no `webhookPath`. */
const LINE_DEFAULT_WEBHOOK_PATH = "/line/webhook";
/** The route this account's monitor serves, which is the one an operator has to register
*  with LINE. Every surface resolves it here so a warning cannot name a path the gateway
*  does not answer on. Route registration canonicalizes further, and matches requests the
*  same way, so a path resolved here always reaches the route the monitor registered. */
function resolveLineWebhookPath(webhookPath) {
	return resolveWebhookPath({
		webhookPath,
		defaultPath: LINE_DEFAULT_WEBHOOK_PATH
	}) ?? LINE_DEFAULT_WEBHOOK_PATH;
}
function parseLineWebhookBody(rawBody) {
	try {
		return JSON.parse(rawBody);
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/line/src/webhook-node.ts
const LINE_WEBHOOK_MAX_BODY_BYTES = 1048576;
const LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES$1 = 65536;
const LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1 = 5e3;
async function readLineWebhookRequestBody(req, maxBytes = LINE_WEBHOOK_MAX_BODY_BYTES, timeoutMs = LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1) {
	return await readRequestBodyWithLimit(req, {
		maxBytes,
		timeoutMs,
		destroyOnLimit: false
	});
}
/**
* Answer a body-limit failure through the connection owner.
*
* The reader defers destruction for these two codes, so the connection is already fenced
* and only the owner can still write: responding directly would race the teardown and LINE
* would see a reset instead of the status.
*/
async function rejectLineWebhookRequest(req, res, error) {
	if (!isRequestBodyLimitError(error, "PAYLOAD_TOO_LARGE") && !isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) return false;
	await sendHttpRequestRejection(req, res, error.statusCode, JSON.stringify({ error: requestBodyErrorToText(error.code) }), "application/json");
	return true;
}
function createLineNodeWebhookHandler(params) {
	const maxBodyBytes = params.maxBodyBytes ?? LINE_WEBHOOK_MAX_BODY_BYTES;
	const readBody = params.readBody ?? readLineWebhookRequestBody;
	return async (req, res) => {
		if (req.method === "GET" || req.method === "HEAD") {
			if (req.method === "HEAD") {
				res.statusCode = 204;
				res.end();
				return;
			}
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/plain");
			res.end("OK");
			return;
		}
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "GET, HEAD, POST");
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ error: "Method Not Allowed" }));
			return;
		}
		try {
			const signatureHeader = req.headers["x-line-signature"];
			const signature = typeof signatureHeader === "string" ? signatureHeader.trim() : Array.isArray(signatureHeader) ? (signatureHeader[0] ?? "").trim() : "";
			if (!signature) {
				logVerbose("line: webhook missing X-Line-Signature header");
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Missing X-Line-Signature header" }));
				return;
			}
			const rawBody = await readBody(req, Math.min(maxBodyBytes, LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES$1), LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS$1);
			if (!validateLineSignature(rawBody, signature, params.channelSecret)) {
				logVerbose("line: webhook signature validation failed");
				res.statusCode = 401;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Invalid signature" }));
				return;
			}
			const body = parseLineWebhookBody(rawBody);
			if (!body) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Invalid webhook payload" }));
				return;
			}
			params.onRequestAuthenticated?.();
			if (body.events && body.events.length > 0) {
				logVerbose(`line: received ${body.events.length} webhook events`);
				await params.bot.handleWebhook(body);
			}
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ status: "ok" }));
		} catch (err) {
			if (await rejectLineWebhookRequest(req, res, err)) return;
			params.runtime.error?.(danger(`line webhook error: ${formatErrorMessage(err)}`));
			if (!res.headersSent) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ error: "Internal server error" }));
			}
		}
	};
}
//#endregion
//#region extensions/line/src/monitor.ts
const lineWebhookInFlightLimiter = createWebhookInFlightLimiter();
const LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES = 65536;
const LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS = 5e3;
async function registerLineWebhookTarget(params, bot) {
	try {
		return registerWebhookTargetWithPluginRoute(params);
	} catch (error) {
		await Promise.allSettled([bot.stop()]);
		throw error;
	}
}
const lineWebhookTargets = /* @__PURE__ */ new Map();
function startLineLoadingKeepalive(params) {
	const intervalMs = params.intervalMs ?? 18e3;
	const loadingSeconds = params.loadingSeconds ?? 20;
	let stopped = false;
	const trigger = () => {
		if (stopped) return;
		showLoadingAnimation(params.userId, {
			cfg: params.cfg,
			accountId: params.accountId,
			loadingSeconds
		}).catch(() => {});
	};
	trigger();
	const timer = setInterval(trigger, intervalMs);
	return () => {
		if (stopped) return;
		stopped = true;
		clearInterval(timer);
	};
}
async function monitorLineProvider(opts) {
	const { channelAccessToken, channelSecret, accountId, config, runtime, buildContext, abortSignal, webhookPath, statusSink } = opts;
	const resolvedAccountId = accountId ?? resolveDefaultLineAccountId(config);
	const token = channelAccessToken.trim();
	const secret = channelSecret.trim();
	if (!token) throw new Error("LINE webhook mode requires a non-empty channel access token.");
	if (!secret) throw new Error("LINE webhook mode requires a non-empty channel secret.");
	const bot = createLineBot({
		channelAccessToken: token,
		channelSecret: secret,
		accountId,
		runtime,
		buildContext,
		config,
		onMessage: async (ctx, deliveryControl) => {
			if (!ctx) return;
			const { ctxPayload, replyToken, route } = ctx;
			const turnConfig = deliveryControl.cfg;
			const stopLoading = Boolean(ctx.userId && !ctx.isGroup) ? startLineLoadingKeepalive({
				cfg: turnConfig,
				userId: ctx.userId,
				accountId: ctx.accountId
			}) : null;
			logVerbose(`line: received message from ${ctxPayload.SenderName ?? ctx.userId ?? ctxPayload.From} (${ctxPayload.From})`);
			let replyTokenUsed = false;
			let turnAdopted = false;
			const ingressLifecycle = deliveryControl.turnAdoptionLifecycle;
			const turnAbortSignal = ingressLifecycle?.abortSignal;
			const skillFilter = ctx.skillFilter;
			const blockStreaming = resolveChannelStreamingBlockEnabled(resolveLineAccount({
				cfg: turnConfig,
				accountId: route.accountId
			}).config) ?? resolveChannelStreamingBlockEnabled(turnConfig.channels?.line);
			const disableBlockStreaming = typeof blockStreaming === "boolean" ? !blockStreaming : void 0;
			const replyOptions = turnAbortSignal || skillFilter || disableBlockStreaming !== void 0 ? {
				...turnAbortSignal ? { abortSignal: turnAbortSignal } : {},
				...skillFilter ? { skillFilter } : {},
				...disableBlockStreaming !== void 0 ? { disableBlockStreaming } : {}
			} : void 0;
			try {
				const textLimit = 5e3;
				const turnResult = await getLineRuntime().channel.inbound.run({
					channel: "line",
					accountId: route.accountId,
					raw: ctx,
					turnAdoptionLifecycle: {
						...ingressLifecycle,
						admission: "exclusive",
						onAdopted: async () => {
							await ingressLifecycle?.onAdopted();
							turnAdopted = true;
						}
					},
					adapter: {
						ingest: () => ({
							id: ctxPayload.MessageSid ?? `${ctxPayload.From}:${Date.now()}`,
							rawText: ctxPayload.RawBody ?? ctxPayload.BodyForAgent ?? ""
						}),
						resolveTurn: () => ({
							cfg: turnConfig,
							channel: "line",
							accountId: route.accountId,
							route: {
								agentId: route.agentId,
								sessionKey: route.sessionKey
							},
							ctxPayload,
							record: ctx.turn.record,
							replyPipeline: {},
							dispatcherOptions: { humanDelay: resolveHumanDelayConfig(turnConfig, route.agentId) },
							...replyOptions ? { replyOptions } : {},
							delivery: {
								preparePayload: (payload) => prepareLineReplyPayload(payload, ctxPayload.From),
								durable: (payload, info) => resolveLineDurableReplyOptions({
									payload,
									infoKind: info.kind,
									to: ctxPayload.From,
									replyToken,
									replyTokenUsed
								}),
								deliver: async (payload) => {
									const lineData = payload.channelData?.line ?? {};
									if (ctx.userId && !ctx.isGroup) showLoadingAnimation(ctx.userId, {
										cfg: turnConfig,
										accountId: ctx.accountId
									}).catch(() => {});
									const deliveryResult = await deliverLineAutoReply({
										payload,
										lineData,
										to: ctxPayload.From,
										replyToken,
										replyTokenUsed,
										accountId: ctx.accountId,
										cfg: turnConfig,
										textLimit,
										onReplyError: (replyErr) => {
											logVerbose(`line: reply token failed, falling back to push: ${String(replyErr)}`);
										}
									});
									replyTokenUsed = deliveryResult.replyTokenUsed;
									if (deliveryResult.status === "partial") throw deliveryResult.error;
									return { visibleReplySent: deliveryResult.visibleReplySent };
								},
								onError: (err, info) => {
									runtime.error?.(danger(`line ${info.kind} reply failed: ${String(err)}`));
								}
							}
						})
					}
				});
				const dispatchResult = turnResult.dispatched ? turnResult.dispatchResult : void 0;
				if (!hasFinalInboundReplyDispatch(dispatchResult)) logVerbose(`line: no response generated for message from ${ctxPayload.From}`);
			} catch (err) {
				runtime.error?.(danger(`line: auto-reply failed: ${String(err)}`));
				if (turnAdopted || replyTokenUsed) throw new LineWebhookTerminalDeliveryError("LINE delivery failed after consuming the event reply token.", { cause: err });
				throw err;
			} finally {
				stopLoading?.();
			}
		}
	});
	const normalizedPath = resolveLineWebhookPath(webhookPath);
	const webhookRouteKey = canonicalizeWebhookRouteKey(normalizedPath);
	const createScopedLineWebhookHandler = (target) => createLineNodeWebhookHandler({
		channelSecret: target.channelSecret,
		bot: target.bot,
		runtime: target.runtime
	});
	const { unregister: unregisterHttp } = await registerLineWebhookTarget({
		targetsByPath: lineWebhookTargets,
		target: {
			accountId: resolvedAccountId,
			bot,
			channelSecret: secret,
			path: normalizedPath,
			runtime
		},
		route: {
			auth: "plugin",
			pluginId: "line",
			source: "line-webhook",
			accountId: resolvedAccountId,
			log: (msg) => logVerbose(msg),
			throwOnFailure: true,
			handler: async (req, res) => {
				const targets = lineWebhookTargets.get(webhookRouteKey) ?? [];
				const firstTarget = targets[0];
				if (req.method !== "POST") {
					if (!firstTarget) {
						res.statusCode = 404;
						res.end("Not Found");
						return;
					}
					await createScopedLineWebhookHandler(firstTarget)(req, res);
					return;
				}
				const requestLifecycle = beginWebhookRequestPipelineOrReject({
					req,
					res,
					inFlightLimiter: lineWebhookInFlightLimiter,
					inFlightKey: `line:${webhookRouteKey}`
				});
				if (!requestLifecycle.ok) return;
				try {
					const signatureHeader = req.headers["x-line-signature"];
					const signature = typeof signatureHeader === "string" ? signatureHeader.trim() : Array.isArray(signatureHeader) ? (signatureHeader[0] ?? "").trim() : "";
					if (!signature) {
						logVerbose("line: webhook missing X-Line-Signature header");
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Missing X-Line-Signature header" }));
						return;
					}
					const rawBody = await readLineWebhookRequestBody(req, LINE_WEBHOOK_PREAUTH_MAX_BODY_BYTES, LINE_WEBHOOK_PREAUTH_BODY_TIMEOUT_MS);
					const match = resolveSingleWebhookTarget(targets, (target) => validateLineSignature(rawBody, signature, target.channelSecret));
					if (match.kind === "none") {
						logVerbose("line: webhook signature validation failed");
						res.statusCode = 401;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Invalid signature" }));
						return;
					}
					if (match.kind === "ambiguous") {
						logVerbose("line: webhook signature matched multiple accounts");
						res.statusCode = 401;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Ambiguous webhook target" }));
						return;
					}
					const body = parseLineWebhookBody(rawBody);
					if (!body) {
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Invalid webhook payload" }));
						return;
					}
					if (body.events && body.events.length > 0) {
						logVerbose(`line: received ${body.events.length} webhook events`);
						if (await match.target.bot.handleWebhook(body) === "durable") res.setHeader("x-openclaw-delivery-accepted", "durable");
					}
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify({ status: "ok" }));
				} catch (err) {
					if (await rejectLineWebhookRequest(req, res, err)) return;
					runtime.error?.(danger(`line webhook error: ${formatErrorMessage(err)}`));
					if (!res.headersSent) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Internal server error" }));
					}
				} finally {
					requestLifecycle.release();
				}
			}
		}
	}, bot);
	logVerbose(`line: registered webhook handler at ${normalizedPath}`);
	statusSink?.(channelReadyPatch());
	let stopped = false;
	let stopPromise;
	const stopHandler = () => {
		if (stopPromise) return stopPromise;
		if (stopped) return Promise.resolve();
		stopped = true;
		logVerbose(`line: stopping provider for account ${resolvedAccountId}`);
		unregisterHttp();
		stopPromise = bot.stop().finally(() => {
			statusSink?.(channelStoppedPatch());
		});
		return stopPromise;
	};
	const stopOnAbort = () => void stopHandler();
	if (abortSignal?.aborted) await stopHandler();
	else if (abortSignal) {
		abortSignal.addEventListener("abort", stopOnAbort, { once: true });
		await waitForAbortSignal(abortSignal);
		await stopHandler();
	}
	return {
		account: bot.account,
		handleWebhook: bot.handleWebhook,
		stop: async () => {
			await stopHandler();
			abortSignal?.removeEventListener("abort", stopOnAbort);
		}
	};
}
//#endregion
export { resolveLineWebhookPath as a, parseLineWebhookBody as i, createLineNodeWebhookHandler as n, validateLineSignature as o, readLineWebhookRequestBody as r, downloadLineMedia as s, monitorLineProvider as t };

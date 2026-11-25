import { E as applyLineQuoteToken, F as normalizeLineMessagingTarget, M as withoutLineQuoteTokens, N as buildLineMediaMessage, b as normalizeLineMessage, i as runLinePushWithRetries, n as findLineHttpError, s as resolveLineChannelAccessToken, y as messageAction } from "./send-retry-D6J7bThI.mjs";
import { r as resolveLineAccount } from "./accounts-Dm_NoU7R.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { createStaleWhileRevalidateCache } from "openclaw/plugin-sdk/collection-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { HTTPFetchError, messagingApi } from "@line/bot-sdk";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { fetchWithRuntimeDispatcherOrMockedGlobal } from "openclaw/plugin-sdk/runtime-fetch";
import { randomUUID } from "node:crypto";
import lineBotSdkPackage from "@line/bot-sdk/package.json" with { type: "json" };
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
// extensions/line/src/outbound-message-log.ts
const RECENT_SENT_LIMIT = 500;
const recentSentByAccount = /* @__PURE__ */ new Map();
function recentSentFor(accountId) {
	const existing = recentSentByAccount.get(accountId);
	if (existing) return existing;
	const created = createDedupeCache({
		ttlMs: 0,
		maxSize: RECENT_SENT_LIMIT
	});
	recentSentByAccount.set(accountId, created);
	return created;
}
function recordLineSentMessages(accountId, messageIds) {
	if (messageIds.length === 0) return;
	const recentSent = recentSentFor(accountId);
	for (const messageId of messageIds) recentSent.check(messageId);
}
function quotesLineBotMessage(accountId, quotedMessageId) {
	return recentSentByAccount.get(accountId)?.peek(quotedMessageId) ?? false;
}
// extensions/line/src/send.ts
const PROFILE_CACHE_TTL_MS = 3e5;
const PROFILE_CACHE_MAX_ENTRIES = 1e3;
const profileCache = createStaleWhileRevalidateCache({
	maxEntries: PROFILE_CACHE_MAX_ENTRIES,
	ttlMs: PROFILE_CACHE_TTL_MS
});
const groupNameCache = createStaleWhileRevalidateCache({
	maxEntries: PROFILE_CACHE_MAX_ENTRIES,
	ttlMs: PROFILE_CACHE_TTL_MS
});
const LINE_FLEX_ALT_TEXT_LIMIT = 1500;
const LINE_LOCATION_LABEL_LIMIT = 100;
const LINE_PROVIDER_RESPONSE_MAX_BYTES = 16384;
function resolveLineProviderMessageIds(response, operation) {
	const sentMessages = Array.isArray(response?.sentMessages) ? response.sentMessages : [];
	const messageIds = sentMessages.flatMap((entry) => {
		const id = entry && typeof entry === "object" ? entry.id : void 0;
		const messageId = typeof id === "string" ? id.trim() : "";
		return messageId ? [messageId] : [];
	});
	const messageId = messageIds[0];
	if (!messageId || messageIds.length !== sentMessages.length) throw createChannelPartialDeliveryError(/* @__PURE__ */ new Error(`LINE ${operation} response did not include a sent message id`), {
		messageIds,
		visibleReplySent: true
	});
	return {
		messageId,
		messageIds
	};
}
function normalizeTarget(to) {
	const normalized = normalizeLineMessagingTarget(to);
	if (!normalized) throw new Error("Recipient is required for LINE sends");
	if (normalized.length >= 33 && !/^[CUR]/.test(normalized)) throw new Error(`Recipient is not a valid LINE id (case-sensitive; expected leading capital C/U/R): ${truncateUtf16Safe(normalized, 4)}…`);
	return normalized;
}
function resolveLineMessagingAccount(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "LINE send");
	const account = resolveLineAccount({
		cfg,
		accountId: opts.accountId
	});
	return {
		account,
		token: resolveLineChannelAccessToken(opts.channelAccessToken, account)
	};
}
async function sendLineProviderMessages(operation, token, request, retryKey, authorize, assertDirectAdapterHandoff) {
	try {
		return await postLineProviderMessages(operation, token, request, retryKey, authorize, assertDirectAdapterHandoff);
	} catch (error) {
		const unquoted = findLineHttpError(error)?.status === 400 ? withoutLineQuoteTokens(request.messages) : void 0;
		if (!unquoted) throw error;
		return await postLineProviderMessages(operation, token, {
			...request,
			messages: unquoted
		}, retryKey, authorize, assertDirectAdapterHandoff);
	}
}
async function postLineProviderMessages(operation, token, request, retryKey, authorize, assertDirectAdapterHandoff) {
	const effect = captureEffectAuthority();
	const requestBody = JSON.stringify(request);
	if (authorize) {
		const authorized = authorize();
		if (!(typeof authorized === "boolean" ? authorized : await authorized)) throw new Error("LINE send authorization denied");
	}
	const response = await effect.initiate(() => {
		assertDirectAdapterHandoff?.();
		return fetchWithRuntimeDispatcherOrMockedGlobal(`https://api.line.me/v2/bot/message/${operation}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				"User-Agent": `@line/bot-sdk/${lineBotSdkPackage.version}`,
				...retryKey ? { "X-Line-Retry-Key": retryKey } : {}
			},
			body: requestBody
		});
	});
	const acceptedRetryConflict = retryKey !== void 0 && response.status === 409;
	if (!response.ok && !acceptedRetryConflict) {
		const body = await readResponseTextLimited(response, LINE_PROVIDER_RESPONSE_MAX_BYTES).catch(() => "");
		const redactedBody = redactToolPayloadText(body);
		throw new HTTPFetchError(`${response.status} - ${response.statusText}`, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			body: redactedBody
		});
	}
	try {
		return await readProviderJsonResponse(response, `LINE ${operation} response`, { maxBytes: LINE_PROVIDER_RESPONSE_MAX_BYTES });
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: [],
			visibleReplySent: true
		});
	}
}
function createLocationMessage(location) {
	if (!location.title.trim() || !location.address.trim()) return {
		type: "text",
		text: [...[location.title, location.address].map((label) => truncateUtf16Safe(label.trim(), LINE_LOCATION_LABEL_LIMIT)).filter(Boolean), `${location.latitude}, ${location.longitude}`].join("\n")
	};
	return {
		type: "location",
		title: truncateUtf16Safe(location.title, LINE_LOCATION_LABEL_LIMIT),
		address: truncateUtf16Safe(location.address, LINE_LOCATION_LABEL_LIMIT),
		latitude: location.latitude,
		longitude: location.longitude
	};
}
function recordLineOutboundActivity(accountId, delivery) {
	recordLineSentMessages(accountId, delivery.messageIds);
	try {
		recordChannelActivity({
			channel: "line",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: delivery.messageIds,
			...delivery.receipt ? { receipt: delivery.receipt } : {},
			visibleReplySent: true
		});
	}
}
function resolveLineReceiptKind(messages) {
	const types = new Set(messages.map((message) => message.type));
	if (types.has("audio")) return "voice";
	if (types.has("image") || types.has("video")) return "media";
	if (types.has("flex") || types.has("template") || types.has("location")) return "card";
	if (types.has("text")) return "text";
	return "unknown";
}
async function pushLineMessages(to, messages, opts) {
	if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
	const { account, token } = resolveLineMessagingAccount(opts);
	const chatId = normalizeTarget(to);
	const normalizedMessages = applyLineQuoteToken(messages, opts.quoteToken).map(normalizeLineMessage);
	const retryKey = randomUUID();
	const { messageId, messageIds } = resolveLineProviderMessageIds(await runLinePushWithRetries(() => sendLineProviderMessages("push", token, {
		to: chatId,
		messages: normalizedMessages
	}, retryKey, opts.authorize, opts.assertDirectAdapterHandoff), "line:push"), "push");
	const result = {
		messageId,
		chatId,
		receipt: createMessageReceiptFromOutboundResults({
			results: messageIds.map((providerMessageId) => ({
				channel: "line",
				messageId: providerMessageId,
				chatId,
				conversationId: chatId,
				meta: { messageCount: messages.length }
			})),
			...chatId ? { threadId: chatId } : {},
			kind: resolveLineReceiptKind(messages)
		})
	};
	recordLineOutboundActivity(account.accountId, {
		messageIds,
		receipt: result.receipt
	});
	return result;
}
async function pushMessageLine(to, text, opts) {
	const chatId = normalizeTarget(to);
	const messages = [];
	const mediaUrl = opts.mediaUrl?.trim();
	if (mediaUrl) messages.push(await buildLineMediaMessage(mediaUrl, {
		mediaKind: opts.mediaKind,
		previewImageUrl: opts.previewImageUrl,
		durationMs: opts.durationMs,
		trackingId: opts.trackingId
	}, chatId));
	if (text?.trim()) messages.push({
		type: "text",
		text: text.trim()
	});
	return pushLineMessages(chatId, messages, opts);
}
async function replyMessageLine(replyToken, messages, opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	const { messageIds } = resolveLineProviderMessageIds(await sendLineProviderMessages("reply", token, {
		replyToken,
		messages: applyLineQuoteToken(messages, opts.quoteToken).map(normalizeLineMessage)
	}, void 0, opts.authorize, opts.assertDirectAdapterHandoff), "reply");
	recordLineOutboundActivity(account.accountId, { messageIds });
}
async function pushMessagesLine(to, messages, opts) {
	return pushLineMessages(to, messages, opts);
}
function createFlexMessage(altText, contents) {
	return {
		type: "flex",
		altText: truncateUtf16Safe(altText, LINE_FLEX_ALT_TEXT_LIMIT),
		contents
	};
}
async function pushLocationMessage(to, location, opts) {
	return pushLineMessages(to, [createLocationMessage(location)], opts);
}
async function pushFlexMessage(to, altText, contents, opts) {
	return pushLineMessages(to, [createFlexMessage(altText, contents)], opts);
}
async function pushTemplateMessage(to, template, opts) {
	return pushLineMessages(to, [template], opts);
}
async function pushTextMessageWithQuickReplies(to, text, quickReplyLabels, opts) {
	return pushLineMessages(to, [{
		type: "text",
		text,
		quickReply: createQuickReplyItems(quickReplyLabels)
	}], opts);
}
function createQuickReplyItems(labels) {
	return { items: labels.map((label) => label.trim()).filter(Boolean).slice(0, 13).map((label) => ({
		type: "action",
		action: messageAction(label, label)
	})) };
}
async function showLoadingAnimation(chatId, opts) {
	const { token } = resolveLineMessagingAccount(opts);
	const client = new messagingApi.MessagingApiClient({ channelAccessToken: token });
	try {
		await client.showLoadingAnimation({
			chatId: normalizeTarget(chatId),
			loadingSeconds: 20
		});
	} catch (err) {
		logVerbose(`line: loading animation failed (non-fatal): ${String(err)}`);
	}
}
function lineProfileCacheKey(accountId, userId, scope) {
	const conversation = scope.groupId ? ["group", scope.groupId] : scope.roomId ? ["room", scope.roomId] : ["direct"];
	return JSON.stringify([
		accountId,
		"profile",
		...conversation,
		userId
	]);
}
function fetchLineMemberProfile(client, userId, scope) {
	if (scope.groupId) return client.getGroupMemberProfile(scope.groupId, userId);
	if (scope.roomId) return client.getRoomMemberProfile(scope.roomId, userId);
	return client.getProfile(userId);
}
async function getUserProfile(userId, opts) {
	try {
		const { account, token } = resolveLineMessagingAccount(opts);
		const cacheKey = lineProfileCacheKey(account.accountId, userId, opts);
		const load = async () => {
			try {
				const profile = await fetchLineMemberProfile(new messagingApi.MessagingApiClient({ channelAccessToken: token }), userId, opts);
				return {
					displayName: profile.displayName,
					pictureUrl: profile.pictureUrl
				};
			} catch (err) {
				logVerbose(`line: failed to fetch profile for ${userId}: ${String(err)}`);
				return null;
			}
		};
		return (await profileCache.read(cacheKey, load, { allowStale: false })).value;
	} catch (err) {
		logVerbose(`line: failed to fetch profile for ${userId}: ${String(err)}`);
		return null;
	}
}
async function getUserDisplayName(userId, opts) {
	return (await getUserProfile(userId, opts))?.displayName ?? userId;
}
async function getLineGroupName(groupId, opts) {
	try {
		const { account, token } = resolveLineMessagingAccount(opts);
		const cacheKey = JSON.stringify([
			account.accountId,
			"group",
			groupId
		]);
		return (await groupNameCache.read(cacheKey, async () => {
			try {
				return (await new messagingApi.MessagingApiClient({ channelAccessToken: token }).getGroupSummary(groupId)).groupName.trim() || void 0;
			} catch (err) {
				logVerbose(`line: failed to fetch group summary for ${groupId}: ${String(err)}`);
				return;
			}
		}, { allowStale: false })).value;
	} catch (err) {
		logVerbose(`line: failed to fetch group summary for ${groupId}: ${String(err)}`);
		return;
	}
}
export { getUserDisplayName as a, pushLocationMessage as c, pushTemplateMessage as d, pushTextMessageWithQuickReplies as f, quotesLineBotMessage as h, getLineGroupName as i, pushMessageLine as l, showLoadingAnimation as m, createLocationMessage as n, getUserProfile as o, replyMessageLine as p, createQuickReplyItems as r, pushFlexMessage as s, createFlexMessage as t, pushMessagesLine as u };

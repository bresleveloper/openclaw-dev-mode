import { i as resolveLineAccount } from "./accounts-BBEFMYbY.mjs";
import { A as withoutLineQuoteTokens, g as messageAction, i as runLinePushWithRetries, j as buildLineMediaMessage, n as findLineHttpError, o as resolveLineChannelAccessToken, s as createLineSendReceipt, v as normalizeLineMessage, w as applyLineQuoteToken } from "./send-retry-DbfiHBPd.mjs";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { HTTPFetchError, messagingApi } from "@line/bot-sdk";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { fetchWithRuntimeDispatcherOrMockedGlobal } from "openclaw/plugin-sdk/runtime-fetch";
import { randomUUID } from "node:crypto";
import lineBotSdkPackage from "@line/bot-sdk/package.json" with { type: "json" };
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
//#region extensions/line/src/outbound-message-log.ts
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
//#endregion
//#region extensions/line/src/send.ts
const profileCache = {
	values: /* @__PURE__ */ new Map(),
	pending: /* @__PURE__ */ new Map()
};
const groupNameCache = {
	values: /* @__PURE__ */ new Map(),
	pending: /* @__PURE__ */ new Map()
};
const PROFILE_CACHE_TTL_MS = 3e5;
const PROFILE_CACHE_MAX_ENTRIES = 1e3;
const LINE_FLEX_ALT_TEXT_LIMIT = 1500;
const LINE_LOCATION_LABEL_LIMIT = 100;
const LINE_PROVIDER_RESPONSE_MAX_BYTES = 16384;
function rememberLineIdentity(cache, key, value) {
	const entry = {
		value,
		fetchedAt: Date.now()
	};
	cache.values.delete(key);
	cache.values.set(key, entry);
	if (cache.values.size <= PROFILE_CACHE_MAX_ENTRIES) return;
	for (const [cachedKey, cached] of cache.values) if (entry.fetchedAt - cached.fetchedAt >= PROFILE_CACHE_TTL_MS) cache.values.delete(cachedKey);
	pruneMapToMaxSize(cache.values, PROFILE_CACHE_MAX_ENTRIES);
}
async function loadLineIdentity(cache, key, load) {
	const cached = cache.values.get(key);
	if (cached && Date.now() - cached.fetchedAt < PROFILE_CACHE_TTL_MS) return cached.value;
	const pending = cache.pending.get(key);
	if (pending) return await pending;
	const lookup = load().then((value) => {
		rememberLineIdentity(cache, key, value);
		return value;
	});
	cache.pending.set(key, lookup);
	pruneMapToMaxSize(cache.pending, PROFILE_CACHE_MAX_ENTRIES);
	try {
		return await lookup;
	} finally {
		if (cache.pending.get(key) === lookup) cache.pending.delete(key);
	}
}
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
	const trimmed = to.trim();
	if (!trimmed) throw new Error("Recipient is required for LINE sends");
	const normalized = trimmed.replace(/^line:group:/i, "").replace(/^line:room:/i, "").replace(/^line:user:/i, "").replace(/^line:/i, "");
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
function createLineMessagingClient(opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		account,
		client: new messagingApi.MessagingApiClient({ channelAccessToken: token })
	};
}
function createLinePushContext(to, opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		account,
		token,
		chatId: normalizeTarget(to)
	};
}
async function sendLineProviderMessages(operation, token, request, retryKey, authorize) {
	try {
		return await postLineProviderMessages(operation, token, request, retryKey, authorize);
	} catch (error) {
		const unquoted = findLineHttpError(error)?.status === 400 ? withoutLineQuoteTokens(request.messages) : void 0;
		if (!unquoted) throw error;
		return await postLineProviderMessages(operation, token, {
			...request,
			messages: unquoted
		}, retryKey, authorize);
	}
}
async function postLineProviderMessages(operation, token, request, retryKey, authorize) {
	const requestBody = JSON.stringify(request);
	if (authorize) {
		const authorized = authorize();
		if (!(typeof authorized === "boolean" ? authorized : await authorized)) throw new Error("LINE send authorization denied");
	}
	const response = await fetchWithRuntimeDispatcherOrMockedGlobal(`https://api.line.me/v2/bot/message/${operation}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			"User-Agent": `@line/bot-sdk/${lineBotSdkPackage.version}`,
			...retryKey ? { "X-Line-Retry-Key": retryKey } : {}
		},
		body: requestBody
	});
	const acceptedRetryConflict = retryKey !== void 0 && response.status === 409;
	if (!response.ok && !acceptedRetryConflict) {
		const body = await readResponseTextLimited(response, LINE_PROVIDER_RESPONSE_MAX_BYTES).catch(() => "");
		throw new HTTPFetchError(`${response.status} - ${response.statusText}`, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			body
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
function createTextMessage(text) {
	return {
		type: "text",
		text
	};
}
function isValidLineLocation(location) {
	return location.title.trim().length > 0 && location.address.trim().length > 0;
}
function locationTextFallback(location) {
	return {
		type: "text",
		text: [...[location.title, location.address].map((label) => truncateUtf16Safe(label.trim(), LINE_LOCATION_LABEL_LIMIT)).filter(Boolean), `${location.latitude}, ${location.longitude}`].join("\n")
	};
}
function createLocationMessage(location) {
	if (!isValidLineLocation(location)) return locationTextFallback(location);
	return {
		type: "location",
		title: truncateUtf16Safe(location.title, LINE_LOCATION_LABEL_LIMIT),
		address: truncateUtf16Safe(location.address, LINE_LOCATION_LABEL_LIMIT),
		latitude: location.latitude,
		longitude: location.longitude
	};
}
function logLineHttpError(err, context) {
	if (!err || typeof err !== "object") return;
	const { status, statusText, body } = err;
	if (typeof body === "string") {
		const summary = status ? `${status} ${statusText ?? ""}`.trim() : "unknown status";
		logVerbose(`line: ${context} failed (${summary}): ${body}`);
	}
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
async function pushLineMessages(to, messages, opts, behavior = {}) {
	if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
	const { account, token, chatId } = createLinePushContext(to, opts);
	const normalizedMessages = applyLineQuoteToken(messages, opts.quoteToken).map(normalizeLineMessage);
	const retryKey = randomUUID();
	const { messageId, messageIds } = resolveLineProviderMessageIds(await runLinePushWithRetries(async () => {
		try {
			return await sendLineProviderMessages("push", token, {
				to: chatId,
				messages: normalizedMessages
			}, retryKey, opts.authorize);
		} catch (err) {
			if (behavior.errorContext) logLineHttpError(err, behavior.errorContext);
			throw err;
		}
	}, "line:push"), "push");
	const result = {
		messageId,
		chatId,
		receipt: createLineSendReceipt({
			messageId,
			messageIds,
			chatId,
			kind: resolveLineReceiptKind(messages),
			messageCount: messages.length
		})
	};
	recordLineOutboundActivity(account.accountId, {
		messageIds,
		receipt: result.receipt
	});
	if (opts.verbose) {
		const logMessage = behavior.verboseMessage?.(chatId, messages.length) ?? `line: pushed ${messages.length} messages to ${chatId}`;
		logVerbose(logMessage);
	}
	return result;
}
async function replyLineMessages(replyToken, messages, opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		...resolveLineProviderMessageIds(await sendLineProviderMessages("reply", token, {
			replyToken,
			messages: applyLineQuoteToken(messages, opts.quoteToken).map(normalizeLineMessage)
		}, void 0, opts.authorize), "reply"),
		accountId: account.accountId
	};
}
async function sendMessageLine(to, text, opts) {
	const chatId = normalizeTarget(to);
	const messages = [];
	const mediaUrl = opts.mediaUrl?.trim();
	if (mediaUrl) messages.push(await buildLineMediaMessage(mediaUrl, {
		mediaKind: opts.mediaKind,
		previewImageUrl: opts.previewImageUrl,
		durationMs: opts.durationMs,
		trackingId: opts.trackingId
	}, chatId));
	if (text?.trim()) messages.push(createTextMessage(text.trim()));
	if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
	if (opts.replyToken) {
		const { messageId, messageIds, accountId } = await replyLineMessages(opts.replyToken, messages, opts);
		const result = {
			messageId,
			chatId,
			receipt: createLineSendReceipt({
				messageId,
				messageIds,
				chatId,
				kind: resolveLineReceiptKind(messages),
				messageCount: messages.length
			})
		};
		recordLineOutboundActivity(accountId, {
			messageIds,
			receipt: result.receipt
		});
		if (opts.verbose) logVerbose(`line: replied to ${chatId}`);
		return result;
	}
	return pushLineMessages(chatId, messages, opts, { verboseMessage: (resolvedChatId) => `line: pushed message to ${resolvedChatId}` });
}
async function pushMessageLine(to, text, opts) {
	return sendMessageLine(to, text, {
		...opts,
		replyToken: void 0
	});
}
async function replyMessageLine(replyToken, messages, opts) {
	const { messageIds, accountId } = await replyLineMessages(replyToken, messages, opts);
	recordLineOutboundActivity(accountId, { messageIds });
	if (opts.verbose) logVerbose(`line: replied with ${messages.length} messages`);
}
async function pushMessagesLine(to, messages, opts) {
	return pushLineMessages(to, messages, opts, { errorContext: "push message" });
}
function createFlexMessage(altText, contents) {
	return {
		type: "flex",
		altText: truncateUtf16Safe(altText, LINE_FLEX_ALT_TEXT_LIMIT),
		contents
	};
}
async function pushImageMessage(to, originalContentUrl, previewImageUrl, opts) {
	return pushLineMessages(to, [await buildLineMediaMessage(originalContentUrl, {
		mediaKind: "image",
		previewImageUrl
	}, to)], opts, { verboseMessage: (chatId) => `line: pushed image to ${chatId}` });
}
async function pushLocationMessage(to, location, opts) {
	return pushLineMessages(to, [createLocationMessage(location)], opts, { verboseMessage: (chatId) => `line: pushed location to ${chatId}` });
}
async function pushFlexMessage(to, altText, contents, opts) {
	return pushLineMessages(to, [createFlexMessage(altText, contents)], opts, {
		errorContext: "push flex message",
		verboseMessage: (chatId) => `line: pushed flex message to ${chatId}`
	});
}
async function pushTemplateMessage(to, template, opts) {
	return pushLineMessages(to, [template], opts, { verboseMessage: (chatId) => `line: pushed template message to ${chatId}` });
}
async function pushTextMessageWithQuickReplies(to, text, quickReplyLabels, opts) {
	return pushLineMessages(to, [createTextMessageWithQuickReplies(text, quickReplyLabels)], opts, { verboseMessage: (chatId) => `line: pushed message with quick replies to ${chatId}` });
}
function createQuickReplyItems(labels) {
	return { items: labels.slice(0, 13).map((label) => ({
		type: "action",
		action: messageAction(label, label)
	})) };
}
function createTextMessageWithQuickReplies(text, quickReplyLabels) {
	return {
		type: "text",
		text,
		quickReply: createQuickReplyItems(quickReplyLabels)
	};
}
async function showLoadingAnimation(chatId, opts) {
	const { client } = createLineMessagingClient(opts);
	try {
		await client.showLoadingAnimation({
			chatId: normalizeTarget(chatId),
			loadingSeconds: opts.loadingSeconds ?? 20
		});
		logVerbose(`line: showing loading animation to ${chatId}`);
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
	const useCache = opts.useCache ?? true;
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
		if (!useCache) {
			const profile = await load();
			rememberLineIdentity(profileCache, cacheKey, profile);
			return profile;
		}
		return await loadLineIdentity(profileCache, cacheKey, load);
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
		return await loadLineIdentity(groupNameCache, cacheKey, async () => {
			try {
				return (await new messagingApi.MessagingApiClient({ channelAccessToken: token }).getGroupSummary(groupId)).groupName.trim() || void 0;
			} catch (err) {
				logVerbose(`line: failed to fetch group summary for ${groupId}: ${String(err)}`);
				return;
			}
		});
	} catch (err) {
		logVerbose(`line: failed to fetch group summary for ${groupId}: ${String(err)}`);
		return;
	}
}
//#endregion
export { showLoadingAnimation as _, getLineGroupName as a, pushFlexMessage as c, pushMessageLine as d, pushMessagesLine as f, sendMessageLine as g, replyMessageLine as h, createTextMessageWithQuickReplies as i, pushImageMessage as l, pushTextMessageWithQuickReplies as m, createLocationMessage as n, getUserDisplayName as o, pushTemplateMessage as p, createQuickReplyItems as r, getUserProfile as s, createFlexMessage as t, pushLocationMessage as u, quotesLineBotMessage as v };

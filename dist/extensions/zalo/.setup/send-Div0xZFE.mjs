import { d as resolveZaloAccount, f as resolveZaloToken } from "./setup-core-CCMLSh4Q.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/core";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { assertOkOrThrowProviderError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
//#region extensions/zalo/src/timeouts.ts
const ZALO_DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
const ZALO_OUTBOUND_MEDIA_TTL_MS = 12e4;
const ZALO_SEND_PHOTO_REQUEST_TIMEOUT_MS = 15e4;
//#endregion
//#region extensions/zalo/src/api.ts
/**
* Zalo Bot API client
* @see https://bot.zaloplatforms.com/docs
*/
const ZALO_API_BASE = "https://bot-api.zaloplatforms.com";
const ZALO_API_URL_ENV = "ZALO_API_URL";
const ZALO_MEDIA_SSRF_POLICY = {};
var ZaloApiError = class extends Error {
	constructor(message, errorCode, description) {
		super(message);
		this.errorCode = errorCode;
		this.description = description;
		this.name = "ZaloApiError";
	}
	/** True if this is a long-polling timeout (no updates available) */
	get isPollingTimeout() {
		return this.errorCode === 408;
	}
};
function resolveZaloApiUrl(apiUrl) {
	const value = apiUrl === void 0 ? process.env[ZALO_API_URL_ENV]?.trim() ?? ZALO_API_BASE : apiUrl.trim();
	if (!value) throw new Error(`${ZALO_API_URL_ENV} must not be empty.`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`${ZALO_API_URL_ENV} must be a valid URL.`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`${ZALO_API_URL_ENV} must use http:// or https://.`);
	if (parsed.search || parsed.hash) throw new Error(`${ZALO_API_URL_ENV} must not include a query string or fragment.`);
	return parsed.href.replace(/\/+$/u, "");
}
/**
* Call the Zalo Bot API
*/
async function callZaloApi(method, token, body, options) {
	const url = `${resolveZaloApiUrl(options?.apiUrl)}/bot${token}/${method}`;
	const controller = new AbortController();
	const requestTimeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, ZALO_DEFAULT_REQUEST_TIMEOUT_MS);
	const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
	const fetcher = options?.fetch ?? fetch;
	try {
		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : void 0,
			signal: controller.signal
		};
		options?.assertDirectAdapterHandoff?.();
		const response = await fetcher(url, request);
		await assertOkOrThrowProviderError(response, `zalo.${method}`);
		const data = await readProviderJsonResponse(response, `zalo.${method}`);
		if (!data.ok) throw new ZaloApiError(data.description ?? `Zalo API error: ${method}`, data.error_code, data.description);
		return data;
	} finally {
		clearTimeout(timeoutId);
	}
}
/**
* Validate bot token and get bot info
*/
async function getMe(token, timeoutMs, fetcher) {
	return callZaloApi("getMe", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Send a text message
*/
async function sendMessage(token, params, fetcher, assertDirectAdapterHandoff) {
	return callZaloApi("sendMessage", token, params, {
		fetch: fetcher,
		assertDirectAdapterHandoff
	});
}
/**
* Send a photo message
*/
async function sendPhoto(token, params, fetcher, assertDirectAdapterHandoff) {
	const photoUrl = params.photo.trim();
	let parsedPhotoUrl;
	try {
		parsedPhotoUrl = new URL(photoUrl);
	} catch {
		throw new Error("Zalo photo URL must be an absolute HTTP or HTTPS URL");
	}
	if (parsedPhotoUrl.protocol !== "http:" && parsedPhotoUrl.protocol !== "https:") throw new Error("Zalo photo URL must use HTTP or HTTPS");
	await resolvePinnedHostnameWithPolicy(parsedPhotoUrl.hostname, { policy: ZALO_MEDIA_SSRF_POLICY });
	return callZaloApi("sendPhoto", token, {
		...params,
		photo: parsedPhotoUrl.href,
		caption: params.caption === void 0 ? void 0 : truncateUtf16Safe(params.caption, 2e3)
	}, {
		timeoutMs: ZALO_SEND_PHOTO_REQUEST_TIMEOUT_MS,
		fetch: fetcher,
		assertDirectAdapterHandoff
	});
}
/**
* Send a temporary chat action such as typing.
*/
async function sendChatAction(token, params, fetcher, timeoutMs) {
	return callZaloApi("sendChatAction", token, params, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Get updates using long polling (dev/testing only)
* Note: Zalo returns a single update per call, not an array like Telegram
*/
async function getUpdates(token, params, fetcher) {
	const pollTimeoutSec = params?.timeout ?? 30;
	const timeoutMs = (pollTimeoutSec + 5) * 1e3;
	return callZaloApi("getUpdates", token, { timeout: String(pollTimeoutSec) }, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Set webhook URL for receiving updates
*/
async function setWebhook(token, params, fetcher) {
	return callZaloApi("setWebhook", token, params, { fetch: fetcher });
}
/**
* Delete webhook configuration
*/
async function deleteWebhook(token, fetcher, timeoutMs) {
	return callZaloApi("deleteWebhook", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Get current webhook info
*/
async function getWebhookInfo(token, fetcher) {
	return callZaloApi("getWebhookInfo", token, void 0, { fetch: fetcher });
}
//#endregion
//#region extensions/zalo/src/proxy.ts
const proxyCache = /* @__PURE__ */ new Map();
function resolveZaloProxyFetch(proxyUrl) {
	const trimmed = proxyUrl?.trim();
	if (!trimmed) return;
	const cached = proxyCache.get(trimmed);
	if (cached) return cached;
	const fetcher = makeProxyFetch(trimmed);
	proxyCache.set(trimmed, fetcher);
	return fetcher;
}
//#endregion
//#region extensions/zalo/src/send.ts
function createZaloSendReceipt(params) {
	const messageId = params.messageId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "zalo",
			messageId,
			chatId: params.chatId
		}] : [],
		kind: params.kind
	});
}
function toZaloSendResult(response, params) {
	if (response.ok && response.result) return {
		ok: true,
		messageId: response.result.message_id,
		receipt: createZaloSendReceipt({
			messageId: response.result.message_id,
			chatId: params.chatId,
			kind: params.kind
		})
	};
	return {
		ok: false,
		error: "Failed to send message",
		receipt: createZaloSendReceipt({
			chatId: params.chatId,
			kind: params.kind
		})
	};
}
async function runZaloSend(failureMessage, params, assertDirectAdapterHandoff, send) {
	let handoffRejected = false;
	let handoffError;
	const assertCurrent = assertDirectAdapterHandoff ? () => {
		try {
			assertDirectAdapterHandoff();
		} catch (error) {
			handoffRejected = true;
			handoffError = error;
			throw error;
		}
	} : void 0;
	try {
		const result = toZaloSendResult(await send(assertCurrent), params);
		return result.ok ? result : {
			ok: false,
			error: failureMessage,
			receipt: result.receipt
		};
	} catch (err) {
		if (handoffRejected && Object.is(handoffError, err)) throw err;
		return {
			ok: false,
			error: formatErrorMessage(err),
			receipt: createZaloSendReceipt({
				chatId: params.chatId,
				kind: params.kind
			})
		};
	}
}
function resolveSendContext(options) {
	if (options.cfg) {
		const account = resolveZaloAccount({
			cfg: options.cfg,
			accountId: options.accountId
		});
		return {
			token: options.token || account.token,
			fetcher: resolveZaloProxyFetch(options.proxy ?? account.config.proxy)
		};
	}
	const token = options.token ?? resolveZaloToken(void 0, options.accountId).token;
	const proxy = options.proxy;
	return {
		token,
		fetcher: resolveZaloProxyFetch(proxy)
	};
}
function resolveValidatedSendContext(chatId, options) {
	const { token, fetcher } = resolveSendContext(options);
	if (!token) return {
		ok: false,
		error: "No Zalo bot token configured"
	};
	const trimmedChatId = normalizeZaloSendChatId(chatId);
	if (!trimmedChatId) return {
		ok: false,
		error: "No chat_id provided"
	};
	return {
		ok: true,
		chatId: trimmedChatId,
		token,
		fetcher
	};
}
function normalizeZaloSendChatId(chatId) {
	return stripTargetKindPrefix(stripChannelTargetPrefix(chatId, "zalo", "zl"));
}
function resolveSendContextOrFailure(chatId, options) {
	const context = resolveValidatedSendContext(chatId, options);
	return context.ok ? { context } : { failure: {
		ok: false,
		error: context.error,
		receipt: createZaloSendReceipt({
			chatId,
			kind: "unknown"
		})
	} };
}
async function sendMessageZalo(chatId, text, options = {}) {
	const resolved = resolveSendContextOrFailure(chatId, options);
	if ("failure" in resolved) return resolved.failure;
	const { context } = resolved;
	if (options.mediaUrl && (options.mediaUrl.trim() || !text)) {
		const photoUrl = options.mediaUrl.trim();
		if (!photoUrl) return {
			ok: false,
			error: "No photo URL provided",
			receipt: createZaloSendReceipt({
				chatId: context.chatId,
				kind: "media"
			})
		};
		const caption = text || options.caption;
		return await runZaloSend("Failed to send photo", {
			chatId: context.chatId,
			kind: "media"
		}, options.assertDirectAdapterHandoff, (assertCurrent) => sendPhoto(context.token, {
			chat_id: context.chatId,
			photo: photoUrl,
			caption
		}, context.fetcher, assertCurrent));
	}
	return await runZaloSend("Failed to send message", {
		chatId: context.chatId,
		kind: "text"
	}, options.assertDirectAdapterHandoff, (assertCurrent) => sendMessage(context.token, {
		chat_id: context.chatId,
		text: truncateUtf16Safe(text, 2e3)
	}, context.fetcher, assertCurrent));
}
//#endregion
export { getMe as a, sendChatAction as c, setWebhook as d, ZALO_OUTBOUND_MEDIA_TTL_MS as f, deleteWebhook as i, sendMessage as l, resolveZaloProxyFetch as n, getUpdates as o, ZaloApiError as r, getWebhookInfo as s, sendMessageZalo as t, sendPhoto as u };

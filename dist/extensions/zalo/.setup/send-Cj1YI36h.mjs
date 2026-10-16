import { d as resolveZaloAccount, f as resolveZaloToken } from "./setup-core-BE-EaCnS.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/core";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { assertOkOrThrowProviderError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
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
function resolveZaloApiUrl() {
	const value = process.env[ZALO_API_URL_ENV]?.trim() ?? ZALO_API_BASE;
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
async function callZaloApi(method, token, body, options) {
	const url = `${resolveZaloApiUrl()}/bot${token}/${method}`;
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
async function getMe(token, timeoutMs, fetcher) {
	return callZaloApi("getMe", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
async function sendMessage(token, params, fetcher, assertDirectAdapterHandoff) {
	return callZaloApi("sendMessage", token, params, {
		fetch: fetcher,
		assertDirectAdapterHandoff
	});
}
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
async function sendChatAction(token, params, fetcher, timeoutMs) {
	return callZaloApi("sendChatAction", token, params, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
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
async function setWebhook(token, params, fetcher) {
	return callZaloApi("setWebhook", token, params, { fetch: fetcher });
}
async function deleteWebhook(token, fetcher, timeoutMs) {
	return callZaloApi("deleteWebhook", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
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
		const response = await send(assertCurrent);
		const messageId = response.ok && response.result ? response.result.message_id : void 0;
		const receipt = createZaloSendReceipt({
			...params,
			messageId
		});
		return response.ok && response.result ? {
			ok: true,
			messageId,
			receipt
		} : {
			ok: false,
			error: failureMessage,
			receipt
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
async function sendMessageZalo(chatId, text, options = {}) {
	const { token, fetcher } = resolveSendContext(options);
	const normalizedChatId = token ? stripTargetKindPrefix(stripChannelTargetPrefix(chatId, "zalo", "zl")) : "";
	if (!token || !normalizedChatId) return {
		ok: false,
		error: token ? "No chat_id provided" : "No Zalo bot token configured",
		receipt: createZaloSendReceipt({
			chatId,
			kind: "unknown"
		})
	};
	if (options.mediaUrl && (options.mediaUrl.trim() || !text)) {
		const photoUrl = options.mediaUrl.trim();
		if (!photoUrl) return {
			ok: false,
			error: "No photo URL provided",
			receipt: createZaloSendReceipt({
				chatId: normalizedChatId,
				kind: "media"
			})
		};
		const caption = text || options.caption;
		return await runZaloSend("Failed to send photo", {
			chatId: normalizedChatId,
			kind: "media"
		}, options.assertDirectAdapterHandoff, (assertCurrent) => sendPhoto(token, {
			chat_id: normalizedChatId,
			photo: photoUrl,
			caption
		}, fetcher, assertCurrent));
	}
	return await runZaloSend("Failed to send message", {
		chatId: normalizedChatId,
		kind: "text"
	}, options.assertDirectAdapterHandoff, (assertCurrent) => sendMessage(token, {
		chat_id: normalizedChatId,
		text: truncateUtf16Safe(text, 2e3)
	}, fetcher, assertCurrent));
}
//#endregion
export { getUpdates as a, sendMessage as c, ZALO_OUTBOUND_MEDIA_TTL_MS as d, getMe as i, sendPhoto as l, ZaloApiError as n, getWebhookInfo as o, deleteWebhook as r, sendChatAction as s, sendMessageZalo, resolveZaloProxyFetch as t, setWebhook as u };

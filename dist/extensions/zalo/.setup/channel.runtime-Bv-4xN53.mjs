import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.mjs";
import { d as resolveZaloAccount } from "./setup-core-B9x2V3Eq.mjs";
import { createAccountStatusSink, createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { runChannelProbe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { captureEffectAuthority, makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { assertOkOrThrowProviderError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/core";
// extensions/zalo/src/timeouts.ts
const ZALO_DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
const ZALO_OUTBOUND_MEDIA_TTL_MS = 12e4;
const ZALO_SEND_PHOTO_REQUEST_TIMEOUT_MS = 15e4;
// extensions/zalo/src/api.ts
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
			signal: options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal
		};
		const response = await captureEffectAuthority().initiate(() => {
			options?.assertDirectAdapterHandoff?.();
			return fetcher(url, request);
		});
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
		signal: params?.signal,
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
// extensions/zalo/src/probe.ts
function formatZaloProbeError(error, timeoutMs) {
	if (error instanceof ZaloApiError) return error.description ?? error.message;
	if (error instanceof Error) return error.name === "AbortError" ? `Request timed out after ${timeoutMs}ms` : error.message;
	return String(error);
}
async function probeZalo(token, timeoutMs = 5e3, fetcher) {
	if (!token?.trim()) return {
		ok: false,
		error: "No token provided",
		elapsedMs: 0
	};
	return await runChannelProbe(void 0, async ({ elapsedMs }) => {
		const response = await getMe(token.trim(), timeoutMs, fetcher);
		if (response.ok && response.result) return {
			ok: true,
			bot: response.result,
			elapsedMs: elapsedMs()
		};
		return {
			ok: false,
			error: "Invalid response from Zalo API",
			elapsedMs: elapsedMs()
		};
	}, (error) => ({
		ok: false,
		error: formatZaloProbeError(error, timeoutMs)
	}));
}
// extensions/zalo/src/proxy.ts
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
// extensions/zalo/src/send.ts
async function sendMessageZalo(chatId, text, options) {
	const account = resolveZaloAccount({
		cfg: options.cfg,
		accountId: options.accountId
	});
	const { token } = account;
	const fetcher = resolveZaloProxyFetch(account.config.proxy);
	const normalizedChatId = token ? stripTargetKindPrefix(stripChannelTargetPrefix(chatId, "zalo", "zl")) : "";
	if (!token || !normalizedChatId) throw new Error(token ? "No chat_id provided" : "No Zalo bot token configured");
	const photoUrl = options.mediaUrl?.trim();
	if (options.mediaUrl && !photoUrl && !text) throw new Error("No photo URL provided");
	const response = photoUrl ? await sendPhoto(token, {
		chat_id: normalizedChatId,
		photo: photoUrl,
		caption: text || void 0
	}, fetcher, options.assertDirectAdapterHandoff) : await sendMessage(token, {
		chat_id: normalizedChatId,
		text: truncateUtf16Safe(text, 2e3)
	}, fetcher, options.assertDirectAdapterHandoff);
	if (!response.result) throw new Error(photoUrl ? "Failed to send photo" : "Failed to send message");
	const messageId = response.result.message_id ?? "";
	return {
		messageId,
		receipt: createMessageReceiptFromOutboundResults({
			results: messageId.trim() ? [{
				channel: "zalo",
				messageId: messageId.trim(),
				chatId: normalizedChatId
			}] : [],
			kind: photoUrl ? "media" : "text"
		})
	};
}
// extensions/zalo/src/channel.runtime.ts
var channel_runtime_exports = /* @__PURE__ */ __exportAll({
	probeZaloAccount: () => probeZaloAccount,
	sendMessageZalo: () => sendMessageZalo,
	startZaloGatewayAccount: () => startZaloGatewayAccount
});
async function probeZaloAccount(params) {
	return await probeZalo(params.account.token, params.timeoutMs, resolveZaloProxyFetch(params.account.config.proxy));
}
async function startZaloGatewayAccount(ctx) {
	const account = ctx.account;
	const token = account.token.trim();
	const mode = account.config.webhookUrl ? "webhook" : "polling";
	let zaloBotLabel = "";
	const fetcher = resolveZaloProxyFetch(account.config.proxy);
	try {
		const probe = await probeZalo(token, 2500, fetcher);
		const name = probe.ok ? probe.bot?.account_name?.trim() : null;
		if (name) zaloBotLabel = ` (${name})`;
		if (!probe.ok) ctx.log?.warn?.(`[${account.accountId}] Zalo check failed before provider start (${String(probe.elapsedMs)}ms): ${probe.error}`);
		ctx.setStatus({
			accountId: account.accountId,
			bot: probe.bot
		});
	} catch (err) {
		ctx.log?.warn?.(`[${account.accountId}] Zalo check failed before provider start: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
	}
	const statusSink = createAccountStatusSink(ctx);
	ctx.log?.info(`[${account.accountId}] starting provider${zaloBotLabel} mode=${mode}`);
	const { monitorZaloProvider } = await import("./monitor-DpdVuTAW.mjs");
	return monitorZaloProvider({
		token,
		account,
		config: ctx.cfg,
		runtime: ctx.runtime,
		abortSignal: ctx.abortSignal,
		useWebhook: Boolean(account.config.webhookUrl),
		webhookUrl: account.config.webhookUrl,
		webhookSecret: normalizeSecretInputString(account.config.webhookSecret),
		webhookPath: account.config.webhookPath,
		fetcher,
		statusSink
	});
}
export { getUpdates as a, sendMessage as c, ZALO_OUTBOUND_MEDIA_TTL_MS as d, deleteWebhook as i, sendPhoto as l, resolveZaloProxyFetch as n, getWebhookInfo as o, probeZaloAccount, ZaloApiError as r, sendChatAction as s, sendMessageZalo, startZaloGatewayAccount, channel_runtime_exports as t, setWebhook as u };

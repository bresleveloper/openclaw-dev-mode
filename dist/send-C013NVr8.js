import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { c as redactSensitiveText } from "./redact-CQ2tlRRk.js";
import { v as parseStrictInteger } from "./number-coercion-CJQ8TR--.js";
import { a as formatUncaughtError, i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-MzBWZWSC.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { d as readConfigFileSnapshotForWrite } from "./io-BJfjPmGW.js";
import { r as replaceConfigFile } from "./config-A41fTHlt.js";
import { c as kindFromMime, s as isGifMedia } from "./mime-C8mVE2Bw.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { s as getImageMetadata } from "./image-ops-DdUL3po0.js";
import { a as loadCronStore, c as resolveCronStorePath, d as saveCronStore } from "./store-DXF66QL3.js";
import { n as probeVideoDimensions } from "./media-services-CvavqnxN.js";
import { n as loadWebMedia } from "./web-media-DnX3imnL.js";
import { c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, s as resolveChunkMode } from "./chunk-ulm_3glE.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./error-runtime-Ck1CsJM-.js";
import "./logging-core-D8iC6VAB.js";
import { g as isVoiceCompatibleAudio } from "./media-runtime-BGWQwoXi.js";
import { r as makeProxyFetch } from "./proxy-fetch-dlAuw1Au.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-env-oOti2yy7.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { o as normalizeTelegramApiRoot, r as resolveTelegramTransport } from "./fetch-BUxCG7NI.js";
import { a as isRecoverableTelegramNetworkError, d as isTelegramMisdirectedRequestError, g as tagTelegramNetworkError, m as isTelegramServerError, o as isSafeToRetrySendError, p as isTelegramRateLimitError, r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-CB0H7cNv.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BlCHMd5G.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import "./session-store-runtime-BlqMkGtn.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-DWfSLpLu.js";
import "./config-mutation-6lHNauPf.js";
import "./cron-store-runtime-CIFxbCdw.js";
import "./reply-chunking-DDVYtWXI.js";
import "./web-media--IgHJT4v.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-C6N-14Do.js";
import "./ssrf-runtime-CZi-6iMr.js";
import "./markdown-table-runtime-BLr9kTqt.js";
import "./diagnostic-runtime-BCe2Aywp.js";
import "./retry-runtime-CR3QC2e6.js";
import { o as resolveTelegramAccount } from "./accounts-BXLnoZbF.js";
import { a as parseTelegramTarget, n as normalizeTelegramChatId, r as normalizeTelegramLookupTarget } from "./targets-CDtCx0Zi.js";
import { C as buildTelegramThreadParams, at as normalizeTelegramReplyToMessageId, h as resolveTelegramMessageCacheScope, i as recordSentMessage, u as createTelegramMessageCache, w as buildTypingThreadParams } from "./sent-message-cache-DCZ3wBB-.js";
import { c as renderTelegramHtmlText, d as telegramHtmlToPlainTextFallback, l as sanitizeTelegramRichHtml, n as limitTelegramRichHtmlNesting, o as markdownToTelegramRichHtml, s as materializeTelegramRichHtmlLineBreaks, t as escapeTelegramHtml, u as splitTelegramHtmlChunks } from "./format-CHihbmMp.js";
import * as grammy from "grammy";
import { Bot, Bot as Bot$1, HttpError } from "grammy";
import { sequentialize } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
//#region extensions/telegram/src/account-throttler.ts
var GroupFairQueue = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.laneOrder = [];
		this.nextLaneIndex = 0;
		this.running = false;
	}
	enqueue(laneKey, run) {
		return new Promise((resolve, reject) => {
			const request = {
				run,
				resolve,
				reject
			};
			const existing = this.lanes.get(laneKey);
			if (existing) existing.push(request);
			else {
				this.lanes.set(laneKey, [request]);
				this.laneOrder.push(laneKey);
			}
			this.start();
		});
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.drain();
	}
	async drain() {
		try {
			while (true) {
				const request = this.takeNext();
				if (!request) return;
				try {
					request.resolve(await request.run());
				} catch (err) {
					request.reject(err);
				}
			}
		} finally {
			this.running = false;
			if (this.laneOrder.length > 0) this.start();
		}
	}
	takeNext() {
		for (let remaining = this.laneOrder.length; remaining > 0; remaining -= 1) {
			this.nextLaneIndex %= this.laneOrder.length;
			const laneKey = this.laneOrder[this.nextLaneIndex];
			const queue = this.lanes.get(laneKey);
			if (!queue || queue.length === 0) {
				this.lanes.delete(laneKey);
				this.laneOrder.splice(this.nextLaneIndex, 1);
				if (this.laneOrder.length === 0) {
					this.nextLaneIndex = 0;
					return;
				}
				continue;
			}
			const request = queue.shift();
			this.nextLaneIndex += 1;
			return request;
		}
	}
};
const throttlerByToken = /* @__PURE__ */ new Map();
function readNumericId(value) {
	return parseStrictInteger(value);
}
function readPayload(payload) {
	return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
	const chatId = readNumericId(payload.chat_id);
	return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
	const threadId = readNumericId(payload.message_thread_id);
	if (threadId !== void 0) return `topic:${threadId}`;
	const directTopicId = readNumericId(payload.direct_messages_topic_id);
	if (directTopicId !== void 0) return `direct-topic:${directTopicId}`;
	const messageId = readNumericId(payload.message_id);
	if (messageId !== void 0) return `message:${messageId}`;
	return "main";
}
function createTelegramAccountThrottler(createThrottler = apiThrottler) {
	const baseThrottler = createThrottler();
	const fairQueuesByChat = /* @__PURE__ */ new Map();
	return (prev, method, payload, signal) => {
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		if (!apiPayload || !groupChatKey) return baseThrottler(prev, method, payload, signal);
		let fairQueue = fairQueuesByChat.get(groupChatKey);
		if (!fairQueue) {
			fairQueue = new GroupFairQueue();
			fairQueuesByChat.set(groupChatKey, fairQueue);
		}
		const laneKey = resolveForumLaneKey(apiPayload);
		return fairQueue.enqueue(laneKey, () => baseThrottler(prev, method, payload, signal));
	};
}
function getOrCreateAccountThrottler(token, createThrottler = apiThrottler) {
	let throttler = throttlerByToken.get(token);
	if (!throttler) {
		throttler = createTelegramAccountThrottler(createThrottler);
		throttlerByToken.set(token, throttler);
	}
	return throttler;
}
//#endregion
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
function resolveTelegramApiLogger(runtime, logger) {
	if (logger) return logger;
	if (runtime?.error) return runtime.error;
	return (message) => fallbackLogger.error(message);
}
async function withTelegramApiErrorLogging({ operation, fn, runtime, logger, shouldLog }) {
	try {
		return await fn();
	} catch (err) {
		if (!shouldLog || shouldLog(err)) {
			const errText = formatErrorMessage(err);
			resolveTelegramApiLogger(runtime, logger)(`telegram ${operation} failed: ${errText}`);
		}
		throw err;
	}
}
function splitTelegramCaption(text) {
	const trimmed = text?.trim() ?? "";
	if (!trimmed) return {
		caption: void 0,
		followUpText: void 0
	};
	if (trimmed.length > 1024) return {
		caption: void 0,
		followUpText: trimmed
	};
	return {
		caption: trimmed,
		followUpText: void 0
	};
}
//#endregion
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
	return fetchImpl;
}
function asTelegramCompatFetch(fetchImpl) {
	return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
	return typeof value === "object" && value !== null && "aborted" in value && typeof value.aborted === "boolean" && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}
function readRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (input instanceof Request) return input.url;
	return null;
}
function extractTelegramApiMethod(input) {
	const url = readRequestUrl(input);
	if (!url) return null;
	try {
		const segments = new URL(url).pathname.split("/").filter(Boolean);
		return normalizeOptionalLowercaseString(segments.length > 0 ? segments.at(-1) ?? null : null) ?? null;
	} catch {
		return null;
	}
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = new Set([
	"deletemycommands",
	"deletewebhook",
	"getme",
	"sendchataction",
	"setmycommands",
	"setwebhook"
]);
function shouldRetryTimedOutTelegramControlRequest(method) {
	return method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method);
}
function resolveTelegramClientTimeoutSeconds(params) {
	const { value, minimum } = params;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const configured = Math.max(1, Math.floor(value));
	if (typeof minimum !== "number" || !Number.isFinite(minimum)) return configured;
	return Math.max(configured, Math.max(1, Math.floor(minimum)));
}
function resolveTelegramClientTimeoutMinimumSeconds(values) {
	let minimum;
	for (const value of values) {
		if (typeof value !== "number" || !Number.isFinite(value)) continue;
		const normalized = Math.max(1, Math.ceil(value));
		minimum = minimum === void 0 ? normalized : Math.max(minimum, normalized);
	}
	return minimum;
}
function resolveTelegramOutboundClientTimeoutFloorSeconds(timeoutSeconds) {
	const timeoutMs = resolveTelegramRequestTimeoutMs("sendmessage", timeoutSeconds);
	return timeoutMs === void 0 ? void 0 : timeoutMs / 1e3;
}
function createTelegramClientFetch(params) {
	if (!params.fetchImpl && !params.shutdownSignal) return;
	const callFetch = asTelegramCompatFetch(params.fetchImpl ?? asTelegramClientFetch(globalThis.fetch));
	const wrappedFetch = async (input, init) => {
		const method = extractTelegramApiMethod(input);
		const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
		const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal) ? params.shutdownSignal : void 0;
		const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
		const canForceTransportFallback = (reason) => !shutdownSignal?.aborted && !requestSignal?.aborted && params.transport?.forceFallback?.(reason) === true;
		const runFetch = async () => {
			const controller = new AbortController();
			const abortWith = (signal) => controller.abort(signal.reason);
			const onShutdown = () => {
				if (shutdownSignal) abortWith(shutdownSignal);
			};
			let requestTimeout;
			let onRequestAbort;
			let requestTimedOut = false;
			const timeoutError = requestTimeoutMs !== void 0 ? /* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`) : void 0;
			if (shutdownSignal?.aborted) abortWith(shutdownSignal);
			else if (shutdownSignal) shutdownSignal.addEventListener("abort", onShutdown, { once: true });
			if (requestSignal) if (requestSignal.aborted) abortWith(requestSignal);
			else {
				onRequestAbort = () => abortWith(requestSignal);
				requestSignal.addEventListener("abort", onRequestAbort);
			}
			if (requestTimeoutMs && timeoutError) {
				requestTimeout = setTimeout(() => {
					requestTimedOut = true;
					controller.abort(timeoutError);
				}, requestTimeoutMs);
				requestTimeout.unref?.();
			}
			try {
				return await callFetch(input, {
					...init,
					signal: controller.signal
				});
			} catch (err) {
				if (requestTimedOut && timeoutError) throw timeoutError;
				throw err;
			} finally {
				if (requestTimeout) clearTimeout(requestTimeout);
				shutdownSignal?.removeEventListener("abort", onShutdown);
				if (requestSignal && onRequestAbort) requestSignal.removeEventListener("abort", onRequestAbort);
			}
		};
		try {
			const response = await runFetch();
			if (response.status === 421 && canForceTransportFallback("misdirected-request")) return await runFetch();
			return response;
		} catch (err) {
			if (requestTimeoutMs && shouldRetryTimedOutTelegramControlRequest(method) && canForceTransportFallback("request-timeout")) return await runFetch();
			if (isTelegramMisdirectedRequestError(err) && canForceTransportFallback("misdirected-request")) return await runFetch();
			throw err;
		}
	};
	return (input, init) => {
		return Promise.resolve(wrappedFetch(input, init)).catch((err) => {
			try {
				tagTelegramNetworkError(err, {
					method: extractTelegramApiMethod(input),
					url: readRequestUrl(input)
				});
			} catch {}
			throw err;
		});
	};
}
//#endregion
//#region extensions/telegram/src/inline-keyboard.ts
function toInlineKeyboardButton(button) {
	if (!button?.text) return;
	if (button.url) return button.style ? {
		text: button.text,
		url: button.url,
		style: button.style
	} : {
		text: button.text,
		url: button.url
	};
	if (button.callback_data) return button.style ? {
		text: button.text,
		callback_data: button.callback_data,
		style: button.style
	} : {
		text: button.text,
		callback_data: button.callback_data
	};
	if (button.web_app?.url) return button.style ? {
		text: button.text,
		web_app: { url: button.web_app.url },
		style: button.style
	} : {
		text: button.text,
		web_app: { url: button.web_app.url }
	};
}
function buildInlineKeyboard(buttons) {
	if (!buttons?.length) return;
	const rows = buttons.map((row) => row.map(toInlineKeyboardButton).filter((button) => Boolean(button))).filter((row) => row.length > 0);
	if (rows.length === 0) return;
	return { inline_keyboard: rows };
}
//#endregion
//#region extensions/telegram/src/outbound-message-context.ts
function inferTelegramChatType(chatId) {
	return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
	const chat = params.message.chat ?? {};
	const text = params.message.text ?? params.message.caption ?? params.text;
	return {
		...params.message,
		message_id: params.messageId,
		date: typeof params.message.date === "number" && Number.isFinite(params.message.date) ? params.message.date : Math.floor(Date.now() / 1e3),
		chat: {
			id: chat.id ?? params.chatId,
			type: chat.type ?? inferTelegramChatType(params.chatId),
			...chat.title ? { title: chat.title } : {},
			...chat.username ? { username: chat.username } : {}
		},
		from: params.message.from ?? {
			id: 0,
			is_bot: true,
			first_name: params.account.name ?? "OpenClaw"
		},
		...text ? { text } : {},
		...params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}
	};
}
async function recordOutboundMessageForPromptContext(params) {
	try {
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store)) }).record({
			accountId: params.account.accountId,
			chatId: params.chatId,
			msg: buildOutboundCacheMessage(params),
			...params.messageThreadId !== void 0 ? { threadId: params.messageThreadId } : {}
		});
	} catch (error) {
		logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
	}
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
function resolveTelegramSendThreadSpec(params) {
	const messageThreadId = params.messageThreadId != null ? params.messageThreadId : params.targetMessageThreadId;
	if (messageThreadId == null) return;
	return {
		id: messageThreadId,
		scope: params.chatType === "direct" ? "dm" : "forum"
	};
}
function buildTelegramThreadReplyParams(opts) {
	const params = {};
	const threadParams = buildTelegramThreadParams(opts?.thread);
	if (threadParams) params.message_thread_id = threadParams.message_thread_id;
	const replyToMessageId = normalizeTelegramReplyToMessageId(opts?.replyToMessageId);
	if (replyToMessageId == null) return params;
	const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
	const replyQuoteTextRaw = normalizeTelegramReplyToMessageId(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) === replyToMessageId ? opts?.replyQuoteText : void 0;
	const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
	if (!replyQuoteText) {
		params.reply_to_message_id = replyToMessageId;
		params.allow_sending_without_reply = true;
		return params;
	}
	const replyParameters = {
		message_id: replyToMessageId,
		quote: replyQuoteText,
		allow_sending_without_reply: true
	};
	if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition)) replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
	if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0) replyParameters.quote_entities = opts.replyQuoteEntities;
	params.reply_parameters = replyParameters;
	return params;
}
function buildTelegramSendParams(opts) {
	const params = { ...buildTelegramThreadReplyParams(opts) };
	if (opts?.silent === true) params.disable_notification = true;
	return params;
}
function getTelegramNativeQuoteReplyMessageId(params) {
	const replyParameters = params?.reply_parameters;
	if (!replyParameters || typeof replyParameters !== "object") return;
	const messageId = replyParameters.message_id;
	return typeof messageId === "number" && Number.isFinite(messageId) ? messageId : void 0;
}
function removeTelegramNativeQuoteParam(params) {
	if (!params) return {};
	const replyMessageId = getTelegramNativeQuoteReplyMessageId(params);
	const { reply_parameters: _ignored, ...rest } = params;
	if (replyMessageId != null) {
		rest.reply_to_message_id = replyMessageId;
		rest.allow_sending_without_reply = true;
	}
	return rest;
}
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
function getTelegramRichRawApi(api) {
	const raw = api.raw;
	if (raw) return raw;
	throw new Error("Telegram rich messages require grammY api.raw");
}
function finiteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
	if (!value || typeof value !== "object") return false;
	return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
	const richParams = {};
	const messageThreadId = finiteInteger(params?.message_thread_id);
	if (messageThreadId !== void 0) richParams.message_thread_id = messageThreadId;
	if (params?.disable_notification === true) richParams.disable_notification = true;
	if (isReplyParameters(params?.reply_parameters)) {
		richParams.reply_parameters = params.reply_parameters;
		return richParams;
	}
	const replyToMessageId = finiteInteger(params?.reply_to_message_id);
	if (replyToMessageId !== void 0) richParams.reply_parameters = {
		message_id: replyToMessageId,
		allow_sending_without_reply: true
	};
	return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
	const richParams = toTelegramRichMessageContextParams(params);
	if (!richParams.reply_parameters) return richParams;
	const { quote: _quote, quote_entities: _quoteEntities, quote_parse_mode: _quoteParseMode, quote_position: _quotePosition, ...replyParameters } = richParams.reply_parameters;
	return {
		...richParams,
		reply_parameters: replyParameters
	};
}
function buildTelegramRichMarkdown(markdown, options) {
	return buildTelegramRichHtml(markdownToTelegramRichHtml(markdown, options), options);
}
function buildTelegramRichHtml(html, options) {
	const safeHtml = prepareTelegramRichHtml(html);
	return options?.skipEntityDetection === true ? {
		html: safeHtml,
		skip_entity_detection: true
	} : { html: safeHtml };
}
function buildTelegramRichMessage(text, textMode, options) {
	return textMode === "html" ? buildTelegramRichHtml(text, options) : buildTelegramRichMarkdown(text, options);
}
function prepareTelegramRichHtml(html) {
	return limitTelegramRichHtmlNesting(materializeTelegramRichHtmlLineBreaks(sanitizeTelegramRichHtml(html)), 16);
}
const TELEGRAM_RICH_HTML_CHUNK_LIMITS = {
	blockLimit: 500,
	mediaLimit: 50
};
function splitPreparedTelegramRichHtml(params) {
	try {
		const chunks = splitTelegramHtmlChunks(params.html, params.textLimit, TELEGRAM_RICH_HTML_CHUNK_LIMITS);
		if (chunks.length > 0) return chunks;
	} catch {}
	return splitTelegramHtmlChunks(escapeTelegramHtml(params.sourceFallback), params.textLimit);
}
function isTelegramRichMessageWithinStructuralLimits(message) {
	if (message.markdown !== void 0) {
		if (splitTelegramRichMarkdownBlocks(message.markdown, 500).length > 1) return false;
		return splitTelegramHtmlChunks(prepareTelegramRichHtml(markdownToTelegramRichHtml(message.markdown)), TELEGRAM_RICH_TEXT_LIMIT, TELEGRAM_RICH_HTML_CHUNK_LIMITS).length <= 1;
	}
	return splitTelegramHtmlChunks(prepareTelegramRichHtml(message.html), TELEGRAM_RICH_TEXT_LIMIT, TELEGRAM_RICH_HTML_CHUNK_LIMITS).length <= 1;
}
function parseRichMarkdownFenceSpans(markdown) {
	const spans = [];
	let open;
	let offset = 0;
	while (offset <= markdown.length) {
		const nextNewline = markdown.indexOf("\n", offset);
		const lineEnd = nextNewline === -1 ? markdown.length : nextNewline;
		const match = markdown.slice(offset, lineEnd).match(/^( {0,3})(`{3,}|~{3,})/);
		if (match) {
			const marker = match[2];
			const markerChar = marker[0];
			if (!open) open = {
				start: offset,
				markerChar,
				markerLength: marker.length
			};
			else if (open.markerChar === markerChar && marker.length >= open.markerLength) {
				spans.push({
					start: open.start,
					end: lineEnd
				});
				open = void 0;
			}
		}
		if (nextNewline === -1) break;
		offset = nextNewline + 1;
	}
	if (open) spans.push({
		start: open.start,
		end: markdown.length
	});
	return spans;
}
function isSafeRichMarkdownBlockBreak(spans, index) {
	return !spans.some((span) => index > span.start && index < span.end);
}
function findTelegramRichMarkdownBlockBreaks(markdown) {
	const breaks = [];
	for (const match of markdown.matchAll(/\n[\t ]*\n+/g)) {
		const start = match.index ?? 0;
		breaks.push({
			start,
			end: start + match[0].length,
			separator: match[0]
		});
	}
	for (const match of markdown.matchAll(/^ {0,3}#{1,6}\s+\S.*$/gm)) {
		const headingStart = match.index ?? 0;
		if (headingStart > 0 && markdown[headingStart - 1] === "\n") breaks.push({
			start: headingStart - 1,
			end: headingStart,
			separator: "\n"
		});
	}
	return breaks.toSorted((left, right) => left.start - right.start || right.end - left.end);
}
function splitTelegramRichMarkdownBlocks(markdown, blockLimit) {
	if (!markdown.trim()) return markdown ? [markdown] : [];
	const blocks = [];
	const fenceSpans = parseRichMarkdownFenceSpans(markdown);
	let lastIndex = 0;
	let separatorBefore;
	for (const blockBreak of findTelegramRichMarkdownBlockBreaks(markdown)) {
		if (blockBreak.start < lastIndex) continue;
		if (!isSafeRichMarkdownBlockBreak(fenceSpans, blockBreak.start)) continue;
		const text = markdown.slice(lastIndex, blockBreak.start);
		if (text.trim()) blocks.push({
			text,
			...separatorBefore ? { separatorBefore } : {}
		});
		separatorBefore = blockBreak.separator;
		lastIndex = blockBreak.end;
	}
	const tail = markdown.slice(lastIndex);
	if (tail.trim()) blocks.push({
		text: tail,
		...separatorBefore ? { separatorBefore } : {}
	});
	if (blocks.length <= blockLimit) return [markdown];
	const chunks = [];
	let chunk = "";
	let chunkBlocks = 0;
	for (const block of blocks) {
		if (chunkBlocks >= blockLimit) {
			chunks.push(chunk);
			chunk = "";
			chunkBlocks = 0;
		}
		const separator = chunk ? block.separatorBefore ?? "\n\n" : "";
		chunk += `${separator}${block.text}`;
		chunkBlocks += 1;
	}
	if (chunk) chunks.push(chunk);
	return chunks;
}
function splitTelegramRichMarkdownTextChunks(markdown, textLimit, chunkMode) {
	const chunks = [];
	const queue = chunkMarkdownTextWithMode(markdown, textLimit, chunkMode);
	for (let index = 0; index < queue.length; index += 1) {
		const chunk = queue[index] ?? "";
		if (chunk.length <= textLimit) {
			chunks.push(chunk);
			continue;
		}
		const nextChunks = chunkMarkdownTextWithMode(chunk, Math.max(1, Math.min(chunk.length - 1, textLimit - 16)), chunkMode);
		if (nextChunks.length <= 1) {
			chunks.push(chunk);
			continue;
		}
		queue.splice(index, 1, ...nextChunks);
		index -= 1;
	}
	return chunks;
}
function splitTelegramRichMarkdownChunks(markdown, textLimit, chunkMode) {
	if (markdown.length <= textLimit) return splitTelegramRichMarkdownBlocks(markdown, 500);
	return splitTelegramRichMarkdownTextChunks(markdown, textLimit, chunkMode).flatMap((chunk) => splitTelegramRichMarkdownBlocks(chunk, 500));
}
function splitTelegramRichMessageTextChunks(params) {
	const renderMarkdownChunk = (chunk) => prepareTelegramRichHtml(markdownToTelegramRichHtml(chunk, {
		tableMode: params.tableMode,
		skipEntityDetection: params.skipEntityDetection
	}));
	return (params.textMode === "html" ? splitPreparedTelegramRichHtml({
		html: prepareTelegramRichHtml(params.text),
		sourceFallback: params.text,
		textLimit: params.textLimit
	}) : splitTelegramRichMarkdownChunks(params.text, params.textLimit, params.chunkMode).flatMap((chunk) => splitPreparedTelegramRichHtml({
		html: renderMarkdownChunk(chunk),
		sourceFallback: chunk,
		textLimit: params.textLimit
	}))).map((chunk) => ({
		text: chunk,
		textMode: "html",
		plainText: telegramHtmlToPlainTextFallback(chunk)
	}));
}
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function asObjectRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function normalizeTelegramLookupTargetForMatch(raw) {
	const normalized = normalizeTelegramLookupTarget(raw);
	if (!normalized) return;
	return normalized.startsWith("@") ? normalizeLowercaseStringOrEmpty(normalized) : normalized;
}
function normalizeTelegramTargetForMatch(raw) {
	const parsed = parseTelegramTarget(raw);
	const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
	if (!normalized) return;
	return `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`;
}
function buildResolvedTelegramTarget(params) {
	const { raw, parsed, resolvedChatId } = params;
	if (parsed.messageThreadId == null) return resolvedChatId;
	return raw.includes(":topic:") ? `${resolvedChatId}:topic:${parsed.messageThreadId}` : `${resolvedChatId}:${parsed.messageThreadId}`;
}
function resolveLegacyRewrite(params) {
	const parsed = parseTelegramTarget(params.raw);
	if (normalizeTelegramChatId(parsed.chatId)) return null;
	const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
	if (!normalized) return null;
	return {
		matchKey: `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`,
		resolvedTarget: buildResolvedTelegramTarget({
			raw: params.raw,
			parsed,
			resolvedChatId: params.resolvedChatId
		})
	};
}
function rewriteTargetIfMatch(params) {
	if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
	const value = normalizeOptionalString(String(params.rawValue)) ?? "";
	if (!value) return null;
	if (normalizeTelegramTargetForMatch(value) !== params.matchKey) return null;
	return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
	let changed = false;
	const telegram = asObjectRecord(params.cfg.channels?.telegram);
	if (!telegram) return changed;
	const maybeReplace = (holder, key) => {
		const nextTarget = rewriteTargetIfMatch({
			rawValue: holder[key],
			matchKey: params.matchKey,
			resolvedTarget: params.resolvedTarget
		});
		if (!nextTarget) return;
		holder[key] = nextTarget;
		changed = true;
	};
	maybeReplace(telegram, "defaultTo");
	const accounts = asObjectRecord(telegram.accounts);
	if (!accounts) return changed;
	for (const accountId of Object.keys(accounts)) {
		const account = asObjectRecord(accounts[accountId]);
		if (!account) continue;
		maybeReplace(account, "defaultTo");
	}
	return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
	const raw = params.rawTarget.trim();
	if (!raw) return;
	const rewrite = resolveLegacyRewrite({
		raw,
		resolvedChatId: params.resolvedChatId
	});
	if (!rewrite) return;
	const { matchKey, resolvedTarget } = rewrite;
	const hasGatewayAdminScope = params.gatewayClientScopes?.includes(TELEGRAM_ADMIN_SCOPE) === true;
	const trustedInternalWriteback = params.gatewayClientScopes === void 0 && params.trustedInternalWriteback === true;
	if (!hasGatewayAdminScope && !trustedInternalWriteback) {
		writebackLogger.warn(`skipping Telegram target writeback for ${raw} because gateway caller is missing ${TELEGRAM_ADMIN_SCOPE}`);
		return;
	}
	try {
		const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
		const nextConfig = structuredClone(snapshot.config ?? {});
		if (replaceTelegramDefaultToTargets({
			cfg: nextConfig,
			matchKey,
			resolvedTarget
		})) {
			await replaceConfigFile({
				nextConfig,
				snapshot,
				writeOptions,
				afterWrite: { mode: "auto" }
			});
			if (params.verbose) writebackLogger.warn(`resolved Telegram defaultTo target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram defaultTo target ${raw}: ${String(err)}`);
	}
	try {
		const storePath = resolveCronStorePath(params.cfg.cron?.store);
		const store = await loadCronStore(storePath);
		let cronChanged = false;
		for (const job of store.jobs) {
			if (job.delivery?.channel !== "telegram") continue;
			const nextTarget = rewriteTargetIfMatch({
				rawValue: job.delivery.to,
				matchKey,
				resolvedTarget
			});
			if (!nextTarget) continue;
			job.delivery.to = nextTarget;
			cronChanged = true;
		}
		if (cronChanged) {
			await saveCronStore(storePath, store);
			if (params.verbose) writebackLogger.warn(`resolved Telegram cron delivery target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram cron target ${raw}: ${String(err)}`);
	}
}
//#endregion
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceDecision(opts) {
	if (!opts.wantsVoice) return { useVoice: false };
	if (isVoiceCompatibleAudio(opts)) return { useVoice: true };
	return {
		useVoice: false,
		reason: `media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"})`
	};
}
function resolveTelegramVoiceSend(opts) {
	const decision = resolveTelegramVoiceDecision(opts);
	if (decision.reason && opts.logFallback) opts.logFallback(`Telegram voice requested but ${decision.reason}; sending as audio file instead.`);
	return { useVoice: decision.useVoice };
}
//#endregion
//#region extensions/telegram/src/send.ts
const InputFileCtor = grammy.InputFile;
const MAX_TELEGRAM_PHOTO_DIMENSION_SUM = 1e4;
const MAX_TELEGRAM_PHOTO_ASPECT_RATIO = 20;
function resolveTelegramMessageIdOrThrow(result, context) {
	if (typeof result?.message_id === "number" && Number.isFinite(result.message_id)) return Math.trunc(result.message_id);
	throw new Error(`Telegram ${context} returned no message_id`);
}
function surrogateSafeChunkEnd(text, end, start) {
	const high = text.charCodeAt(end - 1);
	const low = text.charCodeAt(end);
	if (!(end > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return end;
	const clamped = end - 1;
	return clamped > start ? clamped : start + 2;
}
function splitTelegramPlainTextChunks(text, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const chunks = [];
	let start = 0;
	while (start < text.length) {
		const end = surrogateSafeChunkEnd(text, start + normalizedLimit, start);
		chunks.push(text.slice(start, end));
		start = end;
	}
	return chunks;
}
function splitTelegramPlainTextFallback(text, chunkCount, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const fixedChunks = splitTelegramPlainTextChunks(text, normalizedLimit);
	if (chunkCount <= 1 || fixedChunks.length >= chunkCount) return fixedChunks;
	const chunks = [];
	let offset = 0;
	for (let index = 0; index < chunkCount; index += 1) {
		const remainingChars = text.length - offset;
		const remainingChunks = chunkCount - index;
		const nextChunkLength = remainingChunks === 1 ? remainingChars : Math.min(normalizedLimit, Math.ceil(remainingChars / remainingChunks));
		const end = surrogateSafeChunkEnd(text, offset + nextChunkLength, offset);
		chunks.push(text.slice(offset, end));
		offset = end;
	}
	return chunks;
}
function splitTelegramPlainTextChunksForTests(text, limit) {
	return splitTelegramPlainTextChunks(text, limit);
}
function logTelegramOutboundSendOk(params) {
	const parts = [
		"telegram outbound send ok",
		`accountId=${params.accountId}`,
		`chatId=${params.chatId}`,
		`messageId=${params.messageId}`,
		`operation=${params.operation}`
	];
	if (params.deliveryKind) parts.push(`deliveryKind=${params.deliveryKind}`);
	if (typeof params.messageThreadId === "number") parts.push(`threadId=${params.messageThreadId}`);
	if (typeof params.replyToMessageId === "number") parts.push(`replyToMessageId=${params.replyToMessageId}`);
	if (params.silent === true) parts.push("silent=true");
	if (typeof params.chunkCount === "number") parts.push(`chunkCount=${params.chunkCount}`);
	sendLogger.info(parts.join(" "));
}
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity/i;
const MESSAGE_NOT_MODIFIED_RE = /400:\s*Bad Request:\s*message is not modified|MESSAGE_NOT_MODIFIED/i;
const MESSAGE_HAS_NO_TEXT_RE = /400:\s*Bad Request:\s*there is no text in the message to edit/i;
const MESSAGE_DELETE_NOOP_RE = /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger = createSubsystemLogger("telegram/send");
const diagLogger = createSubsystemLogger("telegram/diagnostic");
const telegramClientOptionsCache = /* @__PURE__ */ new Map();
const MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE = 64;
function resetTelegramClientOptionsCacheForTests() {
	telegramClientOptionsCache.clear();
}
function createTelegramHttpLogger(cfg) {
	if (!isDiagnosticFlagEnabled("telegram.http", cfg)) return () => {};
	return (label, err) => {
		if (!(err instanceof HttpError)) return;
		const detail = redactSensitiveText(formatUncaughtError(err.error ?? err));
		diagLogger.warn(`telegram http error (${label}): ${detail}`);
	};
}
function shouldUseTelegramClientOptionsCache() {
	return !process.env.VITEST && true;
}
function buildTelegramClientOptionsCacheKey(params) {
	const proxyKey = params.account.config.proxy?.trim() ?? "";
	const autoSelectFamily = params.account.config.network?.autoSelectFamily;
	const autoSelectFamilyKey = typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
	const dnsResultOrderKey = params.account.config.network?.dnsResultOrder ?? "default";
	const apiRootKey = params.account.config.apiRoot?.trim() ?? "";
	const timeoutSecondsKey = typeof params.timeoutSeconds === "number" ? String(params.timeoutSeconds) : "default";
	return `${params.account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}::${timeoutSecondsKey}`;
}
function setCachedTelegramClientOptions(cacheKey, clientOptions) {
	telegramClientOptionsCache.set(cacheKey, clientOptions);
	if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) {
		const oldestKey = telegramClientOptionsCache.keys().next().value;
		if (oldestKey !== void 0) telegramClientOptionsCache.delete(oldestKey);
	}
	return clientOptions;
}
function resolveTelegramClientOptions(account) {
	const timeoutSeconds = typeof account.config.timeoutSeconds === "number" && Number.isFinite(account.config.timeoutSeconds) ? Math.max(1, Math.floor(account.config.timeoutSeconds)) : void 0;
	const cacheKey = shouldUseTelegramClientOptionsCache() ? buildTelegramClientOptionsCacheKey({
		account,
		timeoutSeconds
	}) : null;
	if (cacheKey && telegramClientOptionsCache.has(cacheKey)) return telegramClientOptionsCache.get(cacheKey);
	const proxyUrl = normalizeOptionalString(account.config.proxy);
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	const apiRoot = normalizeOptionalString(account.config.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
	const fetchImpl = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(transport.fetch),
		timeoutSeconds,
		transport
	});
	const clientOptions = fetchImpl || timeoutSeconds || normalizedApiRoot ? {
		...fetchImpl ? { fetch: asTelegramClientFetch(fetchImpl) } : {},
		...timeoutSeconds ? { timeoutSeconds } : {},
		...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
	} : void 0;
	if (cacheKey) return setCachedTelegramClientOptions(cacheKey, clientOptions);
	return clientOptions;
}
function resolveToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.token) throw new Error(`Telegram bot token missing for account "${params.accountId}" (set channels.telegram.accounts.${params.accountId}.botToken/tokenFile or TELEGRAM_BOT_TOKEN for default).`);
	return params.token.trim();
}
async function resolveChatId(to, params) {
	const numericChatId = normalizeTelegramChatId(to);
	if (numericChatId) return numericChatId;
	const lookupTarget = normalizeTelegramLookupTarget(to);
	const getChat = params.api.getChat;
	if (!lookupTarget || typeof getChat !== "function") throw new Error("Telegram recipient must be a numeric chat ID");
	try {
		const chat = await getChat.call(params.api, lookupTarget);
		const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
		if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
		if (params.verbose) sendLogger.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
		return resolved;
	} catch (err) {
		const detail = formatErrorMessage(err);
		throw new Error(`Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`, { cause: err });
	}
}
async function resolveAndPersistChatId(params) {
	const chatId = await resolveChatId(params.lookupTarget, {
		api: params.api,
		verbose: params.verbose
	});
	await maybePersistResolvedTelegramTarget({
		cfg: params.cfg,
		rawTarget: params.persistTarget,
		resolvedChatId: chatId,
		verbose: params.verbose,
		gatewayClientScopes: params.gatewayClientScopes,
		...params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}
	});
	return chatId;
}
function normalizeMessageId(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string") {
		const value = raw.trim();
		if (!value) throw new Error("Message id is required for Telegram actions");
		const parsed = parseStrictInteger(value);
		if (parsed !== void 0) return parsed;
	}
	throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageNotModifiedError(err) {
	return MESSAGE_NOT_MODIFIED_RE.test(formatErrorMessage(err));
}
function isTelegramMessageHasNoTextError(err) {
	return MESSAGE_HAS_NO_TEXT_RE.test(formatErrorMessage(err));
}
function isTelegramMessageDeleteNoopError(err) {
	return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
function isTelegramHtmlParseError(err) {
	return PARSE_ERR_RE.test(formatErrorMessage(err));
}
async function withTelegramHtmlParseFallback(params) {
	try {
		return await params.requestHtml(params.label);
	} catch (err) {
		if (!isTelegramHtmlParseError(err)) throw err;
		if (params.verbose) sendLogger.warn(`telegram ${params.label} failed with HTML parse error, retrying as plain text: ${formatErrorMessage(err)}`);
		return await params.requestPlain(`${params.label}-plain`);
	}
}
function resolveTelegramApiContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken(opts.token, account);
	const client = resolveTelegramClientOptions(account);
	let api;
	if (opts.api) api = opts.api;
	else {
		const bot = new Bot(token, client ? { client } : void 0);
		bot.api.config.use(getOrCreateAccountThrottler(token));
		api = bot.api;
	}
	return {
		cfg,
		account,
		api
	};
}
function createTelegramRequestWithDiag(params) {
	const request = createChannelApiRetryRunner({
		retry: params.retry,
		configRetry: params.account.config.retry,
		verbose: params.verbose,
		...params.shouldRetry ? { shouldRetry: params.shouldRetry } : {},
		...params.strictShouldRetry ? { strictShouldRetry: true } : {}
	});
	const logHttpError = createTelegramHttpLogger(params.cfg);
	return (fn, label, options) => {
		const runRequest = () => request(fn, label);
		return (params.useApiErrorLogging === false ? runRequest() : withTelegramApiErrorLogging({
			operation: label ?? "request",
			fn: runRequest,
			...options?.shouldLog ? { shouldLog: options.shouldLog } : {}
		})).catch((err) => {
			logHttpError(label ?? "request", err);
			throw err;
		});
	};
}
function wrapTelegramChatNotFoundError(err, params) {
	const errorMsg = formatErrorMessage(err);
	if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg)) return new Error([
		`Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
		`Telegram API said: ${errorMsg}.`,
		"Fix: Add the bot to the channel/group, or ensure it has not been removed/blocked/kicked by the user.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
	if (!CHAT_NOT_FOUND_RE.test(errorMsg)) return err;
	return new Error([
		`Telegram send failed: chat not found (chat_id=${params.chatId}).`,
		"Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
}
function createRequestWithChatNotFound(params) {
	return async (fn, label) => params.requestWithDiag(fn, label).catch((err) => {
		throw wrapTelegramChatNotFoundError(err, {
			chatId: params.chatId,
			input: params.input
		});
	});
}
function createTelegramNonIdempotentRequestWithDiag(params) {
	return createTelegramRequestWithDiag({
		cfg: params.cfg,
		account: params.account,
		retry: params.retry,
		verbose: params.verbose,
		useApiErrorLogging: params.useApiErrorLogging,
		shouldRetry: (err) => isSafeToRetrySendError(err) || isTelegramRateLimitError(err),
		strictShouldRetry: true
	});
}
async function sendMessageTelegram(to, text, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const mediaUrl = opts.mediaUrl?.trim();
	const mediaMaxBytes = opts.maxBytes ?? (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb : 100) * 1024 * 1024;
	const replyMarkup = buildInlineKeyboard(opts.buttons);
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId,
		replyQuoteText: opts.quoteText,
		useReplyIdAsQuoteSource: true
	});
	const richThreadParams = toTelegramRichMessageContextParams(threadParams);
	const hasThreadParams = Object.keys(threadParams).length > 0;
	const hasRichThreadParams = Object.keys(richThreadParams).length > 0;
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		}),
		chatId,
		input: to
	});
	const textMode = opts.textMode ?? "markdown";
	const useRichMessages = account.config.richMessages === true;
	const tableMode = opts.tableMode ?? resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const renderHtmlText = (value) => renderTelegramHtmlText(value, {
		textMode,
		tableMode
	});
	const linkPreviewOptions = account.config.linkPreview ?? true ? void 0 : { is_disabled: true };
	const sendTelegramTextChunk = async (chunk, params) => {
		const baseParams = params ? { ...params } : {};
		if (linkPreviewOptions) baseParams.link_preview_options = linkPreviewOptions;
		const plainParams = {
			...baseParams,
			...opts.silent === true ? { disable_notification: true } : {}
		};
		const hasPlainParams = Object.keys(plainParams).length > 0;
		const requestPlain = (label) => requestWithChatNotFound(() => hasPlainParams ? api.sendMessage(chatId, chunk.plainText, plainParams) : api.sendMessage(chatId, chunk.plainText), label);
		return {
			result: !chunk.htmlText ? await requestPlain("message") : await withTelegramHtmlParseFallback({
				label: "message",
				verbose: opts.verbose,
				requestHtml: (label) => requestWithChatNotFound(() => api.sendMessage(chatId, chunk.htmlText ?? chunk.plainText, {
					parse_mode: "HTML",
					...plainParams
				}), label),
				requestPlain
			}),
			acceptedParams: params
		};
	};
	const buildTextParams = (isLastChunk) => hasThreadParams || isLastChunk && replyMarkup ? {
		...threadParams,
		...isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}
	} : void 0;
	const buildRichTextParams = (isLastChunk) => hasRichThreadParams || isLastChunk && replyMarkup ? {
		...richThreadParams,
		...isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}
	} : void 0;
	const sendTelegramTextChunks = async (chunks, context) => {
		let lastMessageId = "";
		let lastChatId = chatId;
		let lastAcceptedParams;
		let sentChunkCount = 0;
		for (let index = 0; index < chunks.length; index += 1) {
			const chunk = chunks[index];
			if (!chunk) continue;
			const { result: res, acceptedParams } = await sendTelegramTextChunk(chunk, buildTextParams(index === chunks.length - 1));
			const messageId = resolveTelegramMessageIdOrThrow(res, context);
			recordSentMessage(chatId, messageId, cfg);
			await recordOutboundMessageForPromptContext({
				cfg,
				account,
				chatId,
				message: res,
				messageId,
				text: chunk.plainText,
				...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {}
			});
			lastMessageId = String(messageId);
			lastChatId = String(res?.chat?.id ?? chatId);
			lastAcceptedParams = acceptedParams;
			sentChunkCount += 1;
		}
		if (lastMessageId) logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: lastChatId,
			messageId: lastMessageId,
			operation: "sendMessage",
			deliveryKind: "text",
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent,
			chunkCount: sentChunkCount
		});
		return {
			messageId: lastMessageId,
			chatId: lastChatId
		};
	};
	const buildChunkedTextPlan = (rawText, context) => {
		const htmlText = renderHtmlText(rawText);
		const fallbackText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : rawText;
		let htmlChunks;
		try {
			htmlChunks = splitTelegramHtmlChunks(htmlText, 4e3);
		} catch (error) {
			logVerbose(`telegram ${context} failed HTML chunk planning, retrying as plain text: ${formatErrorMessage(error)}`);
			return splitTelegramPlainTextChunks(fallbackText, 4e3).map((plainText) => ({ plainText }));
		}
		const fixedPlainTextChunks = splitTelegramPlainTextChunks(fallbackText, 4e3);
		if (fixedPlainTextChunks.length > htmlChunks.length) {
			logVerbose(`telegram ${context} plain-text fallback needs more chunks than HTML; sending plain text`);
			return fixedPlainTextChunks.map((plainText) => ({ plainText }));
		}
		const plainTextChunks = splitTelegramPlainTextFallback(fallbackText, htmlChunks.length, 4e3);
		return htmlChunks.map((htmlTextLocal, index) => ({
			htmlText: htmlTextLocal,
			plainText: plainTextChunks[index] ?? htmlTextLocal
		}));
	};
	const sendChunkedText = async (rawText, context) => useRichMessages ? await sendTelegramRichTextChunks(buildRichTextPlan(rawText), context) : await sendTelegramTextChunks(buildChunkedTextPlan(rawText, context), context);
	const buildRichTextPlan = (rawText) => {
		return splitTelegramRichMessageTextChunks({
			text: rawText,
			textLimit: Math.min(resolveTextChunkLimit(cfg, "telegram", account.accountId, { fallbackLimit: TELEGRAM_RICH_TEXT_LIMIT }), TELEGRAM_RICH_TEXT_LIMIT),
			textMode,
			chunkMode: resolveChunkMode(cfg, "telegram", account.accountId),
			tableMode,
			skipEntityDetection: account.config.linkPreview === false
		});
	};
	const sendTelegramRichTextChunks = async (chunks, context) => {
		const richRawApi = getTelegramRichRawApi(api);
		let lastMessageId = "";
		let lastChatId = chatId;
		let lastAcceptedParams;
		let sentChunkCount = 0;
		for (let index = 0; index < chunks.length; index += 1) {
			const chunk = chunks[index];
			if (!chunk) continue;
			const acceptedParams = buildRichTextParams(index === chunks.length - 1);
			const result = await requestWithChatNotFound(() => richRawApi.sendRichMessage({
				chat_id: chatId,
				rich_message: buildTelegramRichMessage(chunk.text, chunk.textMode, {
					skipEntityDetection: account.config.linkPreview === false,
					tableMode
				}),
				...acceptedParams,
				...opts.silent === true ? { disable_notification: true } : {}
			}), "richMessage");
			const messageId = resolveTelegramMessageIdOrThrow(result, context);
			recordSentMessage(chatId, messageId, cfg);
			await recordOutboundMessageForPromptContext({
				cfg,
				account,
				chatId,
				message: result,
				messageId,
				text: chunk.plainText,
				...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {}
			});
			lastMessageId = String(messageId);
			lastChatId = String(result?.chat?.id ?? chatId);
			lastAcceptedParams = acceptedParams;
			sentChunkCount += 1;
		}
		if (lastMessageId) logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: lastChatId,
			messageId: lastMessageId,
			operation: "sendRichMessage",
			deliveryKind: "text",
			messageThreadId: lastAcceptedParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent,
			chunkCount: sentChunkCount
		});
		return {
			messageId: lastMessageId,
			chatId: lastChatId
		};
	};
	async function shouldSendTelegramImageAsPhoto(buffer) {
		try {
			const metadata = await getImageMetadata(buffer);
			const width = metadata?.width;
			const height = metadata?.height;
			if (typeof width !== "number" || typeof height !== "number") {
				sendLogger.warn("Photo dimensions are unavailable. Sending as document instead.");
				return false;
			}
			const shorterSide = Math.min(width, height);
			const longerSide = Math.max(width, height);
			if (!(width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM && shorterSide > 0 && longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO)) {
				sendLogger.warn(`Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`);
				return false;
			}
			return true;
		} catch (err) {
			sendLogger.warn(`Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`);
			return false;
		}
	}
	if (mediaUrl) {
		const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
			maxBytes: mediaMaxBytes,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			optimizeImages: opts.forceDocument ? false : void 0
		}));
		const kind = kindFromMime(media.contentType ?? void 0);
		const isGif = isGifMedia({
			contentType: media.contentType,
			fileName: media.fileName
		});
		let sendImageAsPhoto = true;
		const deliveryKind = opts.forceDocument === true && (kind === "image" || kind === "video") ? "document" : kind;
		if (deliveryKind === "image" && !isGif) sendImageAsPhoto = await shouldSendTelegramImageAsPhoto(media.buffer);
		const isVideoNote = deliveryKind === "video" && opts.asVideoNote === true;
		const fileName = media.fileName ?? (isGif ? "animation.gif" : inferFilename(kind ?? "document")) ?? "file";
		const file = new InputFileCtor(media.buffer, fileName);
		let caption;
		let followUpText;
		if (isVideoNote) {
			caption = void 0;
			followUpText = text.trim() ? text : void 0;
		} else {
			const split = splitTelegramCaption(text);
			caption = split.caption;
			followUpText = split.followUpText;
		}
		const htmlCaption = caption ? renderHtmlText(caption) : void 0;
		const needsSeparateText = Boolean(followUpText);
		const baseMediaParams = {
			...hasThreadParams ? threadParams : {},
			...!needsSeparateText && replyMarkup ? { reply_markup: replyMarkup } : {}
		};
		const videoDimensions = deliveryKind === "video" && !isVideoNote ? await probeVideoDimensions(media.buffer) : void 0;
		const mediaParams = {
			...htmlCaption ? {
				caption: htmlCaption,
				parse_mode: "HTML"
			} : {},
			...baseMediaParams,
			...opts.silent === true ? { disable_notification: true } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {}
		};
		const sendMedia = async (label, sender) => await requestWithChatNotFound(() => sender(mediaParams), label);
		const mediaSender = (() => {
			if (isGif && deliveryKind !== "document") return {
				label: "animation",
				sender: (effectiveParams) => api.sendAnimation(chatId, file, effectiveParams)
			};
			if (deliveryKind === "image" && !isGif && sendImageAsPhoto) return {
				label: "photo",
				sender: (effectiveParams) => api.sendPhoto(chatId, file, effectiveParams)
			};
			if (deliveryKind === "video") {
				if (isVideoNote) return {
					label: "video_note",
					sender: (effectiveParams) => api.sendVideoNote(chatId, file, effectiveParams)
				};
				return {
					label: "video",
					sender: (effectiveParams) => api.sendVideo(chatId, file, effectiveParams)
				};
			}
			if (kind === "audio") {
				const { useVoice } = resolveTelegramVoiceSend({
					wantsVoice: opts.asVoice === true,
					contentType: media.contentType,
					fileName,
					logFallback: logVerbose
				});
				if (useVoice) return {
					label: "voice",
					sender: (effectiveParams) => api.sendVoice(chatId, file, effectiveParams)
				};
				return {
					label: "audio",
					sender: (effectiveParams) => api.sendAudio(chatId, file, effectiveParams)
				};
			}
			return {
				label: "document",
				sender: (effectiveParams) => api.sendDocument(chatId, file, opts.forceDocument ? {
					...effectiveParams,
					disable_content_type_detection: true
				} : effectiveParams)
			};
		})();
		const result = await sendMedia(mediaSender.label, mediaSender.sender);
		const mediaMessageId = resolveTelegramMessageIdOrThrow(result, "media send");
		const resolvedChatId = String(result?.chat?.id ?? chatId);
		recordSentMessage(chatId, mediaMessageId, cfg);
		await recordOutboundMessageForPromptContext({
			cfg,
			account,
			chatId,
			message: result,
			messageId: mediaMessageId,
			...caption ? { text: caption } : {},
			...mediaParams.message_thread_id !== void 0 ? { messageThreadId: mediaParams.message_thread_id } : {}
		});
		logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: resolvedChatId,
			messageId: String(mediaMessageId),
			operation: `send${mediaSender.label.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`,
			deliveryKind: mediaSender.label,
			messageThreadId: mediaParams.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent
		});
		recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
		if (needsSeparateText && followUpText) return {
			messageId: (await sendChunkedText(followUpText, "text follow-up send")).messageId,
			chatId: resolvedChatId
		};
		return {
			messageId: String(mediaMessageId),
			chatId: resolvedChatId
		};
	}
	if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
	const textResult = await sendChunkedText(text, "text send");
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return textResult;
}
async function sendTypingTelegram(to, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose
	});
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "send" })
	});
	const threadParams = buildTypingThreadParams(target.messageThreadId ?? opts.messageThreadId);
	await requestWithDiag(() => api.sendChatAction(chatId, "typing", threadParams), "typing");
	return { ok: true };
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "send" })
	});
	const remove = opts.remove === true;
	const trimmedEmoji = emoji.trim();
	const reactions = remove || !trimmedEmoji ? [] : [{
		type: "emoji",
		emoji: trimmedEmoji
	}];
	if (typeof api.setMessageReaction !== "function") throw new Error("Telegram reactions are unavailable in this bot API.");
	try {
		await requestWithDiag(() => api.setMessageReaction(chatId, messageId, reactions), "reaction");
	} catch (err) {
		const msg = formatErrorMessage(err);
		if (/REACTION_INVALID/i.test(msg)) return {
			ok: false,
			warning: `Reaction unavailable: ${trimmedEmoji}`
		};
		throw err;
	}
	return { ok: true };
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "send" })
	});
	try {
		await requestWithDiag(() => api.deleteMessage(chatId, messageId), "deleteMessage", { shouldLog: (err) => !isTelegramMessageDeleteNoopError(err) });
	} catch (err) {
		if (!isTelegramMessageDeleteNoopError(err)) throw err;
		const detail = formatErrorMessage(err);
		logVerbose(`[telegram] Delete skipped for message ${messageId} in chat ${chatId}: ${detail}`);
		return {
			ok: false,
			warning: `Message ${messageId} was not deleted: ${detail}`
		};
	}
	logVerbose(`[telegram] Deleted message ${messageId} from chat ${chatId}`);
	return { ok: true };
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	await createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	})(() => api.pinChatMessage(chatId, messageId, { disable_notification: opts.notify !== true }), "pinChatMessage");
	logVerbose(`[telegram] Pinned message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function unpinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = messageIdInput === void 0 ? void 0 : normalizeMessageId(messageIdInput);
	await createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	})(() => api.unpinChatMessage(chatId, messageId), "unpinChatMessage");
	logVerbose(`[telegram] Unpinned ${messageId != null ? `message ${messageId}` : "active message"} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		...messageId != null ? { messageId: String(messageId) } : {}
	};
}
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
	const nameProvided = opts.name !== void 0;
	const trimmedName = opts.name?.trim();
	if (nameProvided && !trimmedName) throw new Error("Telegram forum topic name is required");
	if (trimmedName && trimmedName.length > 128) throw new Error("Telegram forum topic name must be 128 characters or fewer");
	const iconProvided = opts.iconCustomEmojiId !== void 0;
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	if (iconProvided && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic icon custom emoji ID is required");
	if (!trimmedName && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(rawTarget).chatId,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageThreadId = normalizeMessageId(messageThreadIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const payload = {
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}
	};
	await requestWithDiag(() => api.editForumTopic(chatId, messageThreadId, payload), "editForumTopic");
	logVerbose(`[telegram] Edited forum topic ${messageThreadId} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		messageThreadId,
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { iconCustomEmojiId: trimmedIconCustomEmojiId } : {}
	};
}
async function renameForumTopicTelegram(chatIdInput, messageThreadIdInput, name, opts) {
	const result = await editForumTopicTelegram(chatIdInput, messageThreadIdInput, {
		...opts,
		name
	});
	return {
		ok: true,
		chatId: result.chatId,
		messageThreadId: result.messageThreadId,
		name: result.name ?? name.trim()
	};
}
async function editMessageReplyMarkupTelegram(chatIdInput, messageIdInput, buttons, opts) {
	const { cfg, account, api } = resolveTelegramApiContext({
		...opts,
		cfg: opts.cfg
	});
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const replyMarkup = buildInlineKeyboard(buttons) ?? { inline_keyboard: [] };
	try {
		await requestWithDiag(() => api.editMessageReplyMarkup(chatId, messageId, { reply_markup: replyMarkup }), "editMessageReplyMarkup", { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) });
	} catch (err) {
		if (!isTelegramMessageNotModifiedError(err)) throw err;
	}
	logVerbose(`[telegram] Edited reply markup for message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function editMessageTelegram(chatIdInput, messageIdInput, text, opts) {
	const { cfg, account, api } = resolveTelegramApiContext({
		...opts,
		cfg: opts.cfg
	});
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: rawTarget,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageId = normalizeMessageId(messageIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { allowMessageMatch: true }) || isTelegramServerError(err)
	});
	const requestWithEditShouldLog = (fn, label, shouldLog) => requestWithDiag(fn, label, shouldLog ? { shouldLog } : void 0);
	const textMode = opts.textMode ?? "markdown";
	const useRichMessages = account.config.richMessages === true;
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const htmlText = renderTelegramHtmlText(text, {
		textMode,
		tableMode
	});
	const plainText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : text;
	const richRawApi = useRichMessages ? getTelegramRichRawApi(api) : void 0;
	const richMessage = useRichMessages ? buildTelegramRichMessage(text, textMode, {
		skipEntityDetection: opts.linkPreview === false,
		tableMode
	}) : void 0;
	const shouldTouchButtons = opts.buttons !== void 0;
	const builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : void 0;
	const replyMarkup = shouldTouchButtons ? builtKeyboard ?? { inline_keyboard: [] } : void 0;
	const textEditParams = { parse_mode: "HTML" };
	if (opts.linkPreview === false) textEditParams.link_preview_options = { is_disabled: true };
	if (replyMarkup !== void 0) textEditParams.reply_markup = replyMarkup;
	const plainTextParams = {};
	if (opts.linkPreview === false) plainTextParams.link_preview_options = { is_disabled: true };
	if (replyMarkup !== void 0) plainTextParams.reply_markup = replyMarkup;
	const captionEditParams = {
		caption: htmlText,
		parse_mode: "HTML"
	};
	if (replyMarkup !== void 0) captionEditParams.reply_markup = replyMarkup;
	const plainCaptionParams = { caption: plainText };
	if (replyMarkup !== void 0) plainCaptionParams.reply_markup = replyMarkup;
	const performTextEdit = () => {
		if (richRawApi && richMessage) {
			const richEditParams = replyMarkup === void 0 ? {} : { reply_markup: replyMarkup };
			return requestWithEditShouldLog(() => richRawApi.editMessageText({
				chat_id: chatId,
				message_id: messageId,
				rich_message: richMessage,
				...richEditParams
			}), "editMessage", (err) => !isTelegramMessageNotModifiedError(err));
		}
		return withTelegramHtmlParseFallback({
			label: "editMessage",
			verbose: opts.verbose,
			requestHtml: (retryLabel) => requestWithEditShouldLog(() => api.editMessageText(chatId, messageId, htmlText, textEditParams), retryLabel, (err) => !isTelegramMessageNotModifiedError(err)),
			requestPlain: (retryLabel) => requestWithEditShouldLog(() => Object.keys(plainTextParams).length > 0 ? api.editMessageText(chatId, messageId, plainText, plainTextParams) : api.editMessageText(chatId, messageId, plainText), retryLabel, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
		});
	};
	const performCaptionEdit = () => withTelegramHtmlParseFallback({
		label: "editMessageCaption",
		verbose: opts.verbose,
		requestHtml: (retryLabel) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, captionEditParams), retryLabel, (err) => !isTelegramMessageNotModifiedError(err)),
		requestPlain: (retryLabel) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, plainCaptionParams), retryLabel, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
	});
	try {
		const editMode = opts.editMode ?? "text";
		if (editMode === "caption") await performCaptionEdit();
		else try {
			await performTextEdit();
		} catch (err) {
			if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) await performCaptionEdit();
			else throw err;
		}
	} catch (err) {
		if (isTelegramMessageNotModifiedError(err)) {} else throw err;
	}
	logVerbose(`[telegram] Edited message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
function inferFilename(kind) {
	switch (kind) {
		case "image": return "image.jpg";
		case "video": return "video.mp4";
		case "audio": return "audio.ogg";
		default: return "file.bin";
	}
}
/**
* Send a sticker to a Telegram chat by file_id.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param fileId - Telegram file_id of the sticker to send
* @param opts - Optional configuration
*/
async function sendStickerTelegram(to, fileId, opts) {
	if (!fileId?.trim()) throw new Error("Telegram sticker file_id is required");
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId
	});
	const hasThreadParams = Object.keys(threadParams).length > 0;
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose,
			useApiErrorLogging: false
		}),
		chatId,
		input: to
	});
	const stickerParams = hasThreadParams ? threadParams : void 0;
	const result = await requestWithChatNotFound(() => api.sendSticker(chatId, fileId.trim(), stickerParams), "sticker");
	const messageId = resolveTelegramMessageIdOrThrow(result, "sticker send");
	const resolvedChatId = String(result?.chat?.id ?? chatId);
	recordSentMessage(chatId, messageId, opts.cfg);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		messageId: String(messageId),
		chatId: resolvedChatId
	};
}
/**
* Send a poll to a Telegram chat.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param poll - Poll input with question, options, maxSelections, and optional durationHours
* @param opts - Optional configuration
*/
async function sendPollTelegram(to, poll, opts) {
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const target = parseTelegramTarget(to);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const normalizedPoll = normalizePollInput(poll, { maxOptions: 10 });
	const threadParams = buildTelegramThreadReplyParams({
		thread: resolveTelegramSendThreadSpec({
			targetMessageThreadId: target.messageThreadId,
			messageThreadId: opts.messageThreadId,
			chatType: target.chatType
		}),
		replyToMessageId: opts.replyToMessageId
	});
	const pollOptions = normalizedPoll.options;
	const requestWithChatNotFound = createRequestWithChatNotFound({
		requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		}),
		chatId,
		input: to
	});
	const durationSeconds = normalizedPoll.durationSeconds;
	if (durationSeconds === void 0 && normalizedPoll.durationHours !== void 0) throw new Error("Telegram poll durationHours is not supported. Use durationSeconds (5-600) instead.");
	if (durationSeconds !== void 0 && (durationSeconds < 5 || durationSeconds > 600)) throw new Error("Telegram poll durationSeconds must be between 5 and 600");
	const pollParams = {
		allows_multiple_answers: normalizedPoll.maxSelections > 1,
		is_anonymous: opts.isAnonymous ?? true,
		...durationSeconds !== void 0 ? { open_period: durationSeconds } : {},
		...Object.keys(threadParams).length > 0 ? threadParams : {},
		...opts.silent === true ? { disable_notification: true } : {}
	};
	const result = await requestWithChatNotFound(() => api.sendPoll(chatId, normalizedPoll.question, pollOptions, pollParams), "poll");
	const messageId = resolveTelegramMessageIdOrThrow(result, "poll send");
	const resolvedChatId = String(result?.chat?.id ?? chatId);
	const pollId = result?.poll?.id;
	recordSentMessage(chatId, messageId, opts.cfg);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		messageId: String(messageId),
		chatId: resolvedChatId,
		pollId
	};
}
/**
* Create a forum topic in a Telegram supergroup.
* Requires the bot to have `can_manage_topics` permission.
*
* @param chatId - Supergroup chat ID
* @param name - Topic name (1-128 characters)
* @param opts - Optional configuration
*/
async function createForumTopicTelegram(chatId, name, opts) {
	if (!name?.trim()) throw new Error("Forum topic name is required");
	const trimmedName = name.trim();
	if (trimmedName.length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
	const { cfg, account, api } = resolveTelegramApiContext(opts);
	const normalizedChatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(chatId).chatId,
		persistTarget: chatId,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const extra = {};
	if (opts.iconColor != null) extra.icon_color = opts.iconColor;
	if (opts.iconCustomEmojiId?.trim()) extra.icon_custom_emoji_id = opts.iconCustomEmojiId.trim();
	const hasExtra = Object.keys(extra).length > 0;
	const result = await requestWithDiag(() => api.createForumTopic(normalizedChatId, trimmedName, hasExtra ? extra : void 0), "createForumTopic");
	const topicId = result.message_thread_id;
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		topicId,
		name: result.name ?? trimmedName,
		chatId: normalizedChatId
	};
}
//#endregion
export { recordOutboundMessageForPromptContext as A, Bot$1 as B, removeTelegramRichNativeQuoteParam as C, buildTelegramSendParams as D, toTelegramRichMessageContextParams as E, resolveTelegramClientTimeoutSeconds as F, sequentialize as H, resolveTelegramOutboundClientTimeoutFloorSeconds as I, splitTelegramCaption as L, asTelegramClientFetch as M, createTelegramClientFetch as N, getTelegramNativeQuoteReplyMessageId as O, resolveTelegramClientTimeoutMinimumSeconds as P, withTelegramApiErrorLogging as R, isTelegramRichMessageWithinStructuralLimits as S, splitTelegramRichMessageTextChunks as T, apiThrottler as V, TELEGRAM_RICH_TEXT_LIMIT as _, editMessageTelegram as a, buildTelegramRichMessage as b, renameForumTopicTelegram as c, sendPollTelegram as d, sendStickerTelegram as f, resolveTelegramVoiceSend as g, unpinMessageTelegram as h, editMessageReplyMarkupTelegram as i, buildInlineKeyboard as j, removeTelegramNativeQuoteParam as k, resetTelegramClientOptionsCacheForTests as l, splitTelegramPlainTextChunksForTests as m, deleteMessageTelegram as n, pinMessageTelegram as o, sendTypingTelegram as p, editForumTopicTelegram as r, reactMessageTelegram as s, createForumTopicTelegram as t, sendMessageTelegram as u, buildTelegramRichHtml as v, splitTelegramRichMarkdownChunks as w, getTelegramRichRawApi as x, buildTelegramRichMarkdown as y, getOrCreateAccountThrottler as z };

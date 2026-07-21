import { n as truncateUtf16Safe } from "./utf16-slice-fWbEI5Oy.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import { g as readResponseTextLimited } from "./provider-http-errors-HGLTiqMh.js";
import { n as retryAsync, t as resolveRetryConfig } from "./retry-Cyk4Y2-A.js";
import "./number-runtime-DBLVDypr.js";
import "./text-utility-runtime-CEmCehV8.js";
import "./response-limit-runtime-B7RO3Er4.js";
import { t as resolveFetch } from "./fetch-D0nBTEZV.js";
import "./fetch-runtime-BLk-o8LM.js";
import "./provider-http-DjXS2nxd.js";
import "./retry-runtime-CJkaTZLp.js";
import { n as parseRetryAfterHeaderSeconds, t as parseDiscordRetryAfterBodySeconds } from "./retry-after-67N9bXIn.js";
//#region extensions/discord/src/error-body.ts
const DISCORD_RESPONSE_BODY_SUMMARY_MAX_CHARS = 240;
function summarizeDiscordResponseBody(body, opts = {}) {
	const summary = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim();
	if (!summary) return opts.emptyText;
	return truncateUtf16Safe(summary, DISCORD_RESPONSE_BODY_SUMMARY_MAX_CHARS);
}
function isDiscordHtmlResponseBody(body, contentType) {
	return /\bhtml\b/i.test(contentType ?? "") || /^\s*<!doctype\s+html\b/i.test(body) || /^\s*<html\b/i.test(body);
}
function isDiscordRateLimitResponseBody(body) {
	const normalized = body.toLowerCase();
	return normalized.includes("error 1015") || normalized.includes("cloudflare") || normalized.includes("rate limit");
}
//#endregion
//#region extensions/discord/src/api.ts
const DISCORD_API_BASE = "https://discord.com/api/v10";
const DISCORD_API_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 5 * 6e4,
	jitter: .1
};
const DISCORD_API_429_FALLBACK_RETRY_AFTER_SECONDS = 60;
const DISCORD_API_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const DISCORD_API_RESPONSE_BODY_LIMIT_BYTES = 4 * 1024 * 1024;
function parseDiscordApiErrorPayload(text) {
	const trimmed = text.trim();
	if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
	try {
		const payload = JSON.parse(trimmed);
		if (payload && typeof payload === "object") return payload;
	} catch {
		return null;
	}
	return null;
}
function parseRetryAfterSeconds(text, response) {
	const retryAfter = parseDiscordRetryAfterBodySeconds(parseDiscordApiErrorPayload(text)?.retry_after);
	if (retryAfter !== void 0) return retryAfter;
	const header = response.headers.get("Retry-After");
	if (!header) return;
	return parseRetryAfterHeaderSeconds(header);
}
function formatRetryAfterSeconds(value) {
	if (value === void 0 || !Number.isFinite(value) || value < 0) return;
	return `${value < 10 ? value.toFixed(1) : Math.round(value).toString()}s`;
}
function formatDiscordApiErrorText(text, response) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const payload = parseDiscordApiErrorPayload(trimmed);
	if (!payload) {
		if (trimmed.startsWith("{") && trimmed.endsWith("}")) return "unknown error";
		const summary = summarizeDiscordResponseBody(trimmed);
		if (isDiscordHtmlResponseBody(trimmed, response.headers.get("content-type"))) {
			if (!summary) return response.status === 429 ? "rate limited by Discord upstream" : void 0;
			return response.status === 429 ? `rate limited by Discord upstream: ${summary}` : summary;
		}
		return summary;
	}
	const message = typeof payload.message === "string" && payload.message.trim() ? payload.message.trim() : "unknown error";
	const retryAfter = formatRetryAfterSeconds(parseDiscordRetryAfterBodySeconds(payload.retry_after));
	return retryAfter ? `${message} (retry after ${retryAfter})` : message;
}
var DiscordApiError = class extends Error {
	constructor(message, status, retryAfter) {
		super(message);
		this.status = status;
		this.retryAfter = retryAfter;
	}
};
function getDiscordApiRetryAfterMs(err, retryConfig) {
	if (!(err instanceof DiscordApiError) || typeof err.retryAfter !== "number") return;
	return Math.min(Math.max(0, err.retryAfter * 1e3), retryConfig.maxDelayMs);
}
function normalizeDiscordRequestBody(body, headers) {
	if (body === void 0) return;
	if (typeof body === "string" || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams || body instanceof ArrayBuffer) return body;
	headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
	return JSON.stringify(body);
}
function resolveDiscordRequestSignal(options) {
	if (options.signal || typeof options.timeoutMs !== "number") return options.signal;
	return AbortSignal.timeout(resolveTimerTimeoutMs(options.timeoutMs, 1));
}
async function requestDiscord(path, token, options) {
	const fetchImpl = resolveFetch(options?.fetcher ?? fetch);
	if (!fetchImpl) throw new Error("fetch is not available");
	const retryConfig = resolveRetryConfig(DISCORD_API_RETRY_DEFAULTS, options?.retry);
	return retryAsync(async () => {
		const headers = new Headers(options?.headers);
		headers.set("Authorization", `Bot ${token}`);
		const body = normalizeDiscordRequestBody(options?.body, headers);
		const res = await fetchImpl(`${DISCORD_API_BASE}${path}`, {
			method: options?.method ?? (body === void 0 ? "GET" : "POST"),
			headers,
			body,
			signal: resolveDiscordRequestSignal(options ?? {})
		});
		if (!res.ok) {
			const text = await readResponseTextLimited(res, DISCORD_API_ERROR_BODY_LIMIT_BYTES).catch(() => "");
			const detail = formatDiscordApiErrorText(text, res);
			const suffix = detail ? `: ${detail}` : "";
			const retryAfter = res.status === 429 ? parseRetryAfterSeconds(text, res) ?? DISCORD_API_429_FALLBACK_RETRY_AFTER_SECONDS : void 0;
			throw new DiscordApiError(`Discord API ${path} failed (${res.status})${suffix}`, res.status, retryAfter);
		}
		const responseBody = await readResponseWithLimit(res, DISCORD_API_RESPONSE_BODY_LIMIT_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Discord API ${path} response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
		const text = new TextDecoder().decode(responseBody);
		if (!text.trim()) return;
		try {
			return JSON.parse(text);
		} catch {
			throw new DiscordApiError(`Discord API ${path} returned malformed JSON`, 0);
		}
	}, {
		...retryConfig,
		label: options?.label ?? path,
		shouldRetry: (err) => err instanceof DiscordApiError && err.status === 429,
		retryAfterMs: (err) => getDiscordApiRetryAfterMs(err, retryConfig)
	});
}
async function fetchDiscord(path, token, fetcher = fetch, options) {
	return await requestDiscord(path, token, {
		...options,
		fetcher,
		method: "GET"
	});
}
//#endregion
export { summarizeDiscordResponseBody as a, isDiscordRateLimitResponseBody as i, fetchDiscord as n, requestDiscord as r, DiscordApiError as t };

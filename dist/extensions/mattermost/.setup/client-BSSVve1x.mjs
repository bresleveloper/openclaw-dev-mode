import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { PlatformMessageNotDispatchedError, collectErrorGraphCandidates } from "openclaw/plugin-sdk/error-runtime";
import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
import { captureChannelReadAuthority, responseWithRelease } from "openclaw/plugin-sdk/fetch-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse, redactProviderResponseErrorText } from "openclaw/plugin-sdk/provider-http";
import { readResponseTextPrefix, readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { fetchWithSsrFGuard, ssrfPolicyFromPrivateNetworkOptIn } from "openclaw/plugin-sdk/ssrf-runtime";
import { z } from "zod";
//#region extensions/mattermost/src/mattermost/client.ts
const MATTERMOST_ERROR_BODY_LIMIT_BYTES = 8192;
const MATTERMOST_REQUEST_TIMEOUT_MS = 3e4;
const MATTERMOST_TEXT_RESPONSE_LIMIT_BYTES = 65536;
const MattermostPostSchema = z.object({
	id: z.string(),
	user_id: z.string().nullable().optional(),
	channel_id: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	file_ids: z.array(z.string()).nullable().optional(),
	type: z.string().nullable().optional(),
	root_id: z.string().nullable().optional(),
	create_at: z.number().nullable().optional(),
	props: z.record(z.string(), z.unknown()).nullable().optional()
}).passthrough();
const MattermostPostListSchema = z.object({
	order: z.array(z.string()),
	posts: z.record(z.string(), MattermostPostSchema),
	next_post_id: z.string().nullable().optional(),
	prev_post_id: z.string().nullable().optional()
}).passthrough();
function parseMattermostApiStatus(error) {
	if (!error || typeof error !== "object") return;
	const message = "message" in error && typeof error.message === "string" ? error.message : "";
	const match = /Mattermost API (\d{3})\b/.exec(message);
	if (!match) return;
	const status = Number(match[1]);
	return Number.isFinite(status) ? status : void 0;
}
function normalizeMattermostBaseUrl(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return trimmed.replace(/\/+$/, "").replace(/\/api\/v4$/i, "");
}
function buildMattermostApiUrl(baseUrl, path) {
	const normalized = normalizeMattermostBaseUrl(baseUrl);
	if (!normalized) throw new Error("Mattermost baseUrl is required");
	const pathname = (path.split(/[?#]/, 1)[0] ?? "").replace(/[\t\r\n]/g, "").replace(/\\/g, "/");
	for (const segment of pathname.split("/")) {
		let decoded;
		try {
			decoded = decodeURIComponent(segment).replace(/[\t\r\n]/g, "");
		} catch {
			throw new Error("Mattermost API path must not contain unsafe path segments");
		}
		if (decoded.split(/[\\/]/).some((part) => part === "." || part === "..")) throw new Error("Mattermost API path must not contain unsafe path segments");
	}
	return `${normalized}/api/v4${path.startsWith("/") ? path : `/${path}`}`;
}
async function readMattermostSuccessText(res, path) {
	const bytes = await readResponseWithLimit(res, MATTERMOST_TEXT_RESPONSE_LIMIT_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Mattermost API ${path}: text response exceeds ${maxBytes} bytes`) });
	return new TextDecoder().decode(bytes);
}
async function readMattermostError(res, requestHeaders) {
	const contentType = res.headers.get("content-type") ?? "";
	const { text, truncated } = await readResponseTextPrefix(res, MATTERMOST_ERROR_BODY_LIMIT_BYTES, {
		chunkTimeoutMs: 1e4,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`)
	});
	let detail = text;
	if (contentType.includes("application/json")) try {
		const data = JSON.parse(text);
		detail = data !== null && typeof data === "object" && "message" in data && typeof data.message === "string" && data.message ? data.message : JSON.stringify(data);
	} catch {}
	return redactProviderResponseErrorText(detail, requestHeaders, { sourceTruncated: truncated });
}
function createMattermostClient(params) {
	const baseUrl = normalizeMattermostBaseUrl(params.baseUrl);
	if (!baseUrl) throw new Error("Mattermost baseUrl is required");
	const apiBaseUrl = `${baseUrl}/api/v4`;
	const token = params.botToken.trim();
	const requestTimeoutMs = resolveTimerTimeoutMs(params.timeoutMs, MATTERMOST_REQUEST_TIMEOUT_MS);
	const assertSenderCurrent = params.assertRequestCurrent;
	let postDispatchStarted = false;
	const assertRequestCurrent = assertSenderCurrent ? () => {
		try {
			assertSenderCurrent();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (postDispatchStarted) throw new AggregateError([error, /* @__PURE__ */ new Error("A Mattermost post request was already dispatched")], message, { cause: error });
			throw new PlatformMessageNotDispatchedError(message, {
				cause: error,
				retryable: false
			});
		}
	} : void 0;
	const externalFetchImpl = params.fetchImpl;
	const guardedFetchImpl = async (input, init) => {
		const assertReadAuthority = captureChannelReadAuthority();
		assertReadAuthority?.();
		assertRequestCurrent?.();
		const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
		const { timeoutMs: initTimeoutMs, isMessagePost, ...requestInit } = init ?? {};
		const timeoutMs = resolveTimerTimeoutMs(initTimeoutMs, requestTimeoutMs);
		const { response, release } = await fetchWithSsrFGuard({
			url,
			init: requestInit,
			beforeRequest: () => {
				assertReadAuthority?.();
				assertRequestCurrent?.();
				if (isMessagePost) postDispatchStarted = true;
			},
			auditContext: "mattermost-api",
			policy: ssrfPolicyFromPrivateNetworkOptIn(params.allowPrivateNetwork),
			signal: requestInit.signal ?? void 0,
			timeoutMs
		});
		return responseWithRelease(response, release);
	};
	const fetchImpl = (externalFetchImpl ? async (input, init) => {
		captureChannelReadAuthority()?.();
		const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
		const { timeoutMs: initTimeoutMs, isMessagePost, ...requestInit } = init ?? {};
		const timeoutMs = resolveTimerTimeoutMs(initTimeoutMs, requestTimeoutMs);
		const { signal: timeoutSignal, cleanup } = buildTimeoutAbortSignal({
			timeoutMs,
			operation: "mattermost-api",
			url
		});
		const callerSignal = requestInit.signal ?? void 0;
		const signal = callerSignal && timeoutSignal ? AbortSignal.any([callerSignal, timeoutSignal]) : callerSignal ?? timeoutSignal;
		try {
			assertRequestCurrent?.();
			if (isMessagePost) postDispatchStarted = true;
			const response = await externalFetchImpl(input, {
				...requestInit,
				signal
			});
			return responseWithRelease(response, async () => cleanup());
		} catch (error) {
			cleanup();
			throw error;
		}
	} : void 0) ?? guardedFetchImpl;
	const request = async (path, init) => {
		const url = buildMattermostApiUrl(baseUrl, path);
		const headers = new Headers(init?.headers);
		headers.set("Authorization", `Bearer ${token}`);
		if (typeof init?.body === "string" && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
		const isMessagePost = path === "/posts" && init?.method?.toUpperCase() === "POST";
		const res = await fetchImpl(url, {
			...init,
			headers,
			isMessagePost
		});
		if (!res.ok) {
			const detail = await readMattermostError(res, headers);
			throw new Error(`Mattermost API ${res.status} ${res.statusText}: ${detail || "unknown error"}`);
		}
		if (res.status === 204) return;
		if (path === "/reactions" && init?.method?.toUpperCase() === "POST") {
			try {
				await res.body?.cancel();
			} catch {}
			return;
		}
		try {
			if ((res.headers.get("content-type") ?? "").includes("application/json")) return await readProviderJsonResponse(res, `Mattermost API ${path}`);
			return await readMattermostSuccessText(res, path);
		} catch (error) {
			if (isMessagePost) throw createChannelPartialDeliveryError(error, {
				messageIds: [],
				visibleReplySent: true
			});
			throw error;
		}
	};
	return {
		baseUrl,
		apiBaseUrl,
		token,
		request,
		fetchImpl,
		...assertRequestCurrent ? { assertRequestCurrent } : {}
	};
}
async function fetchMattermostMe(client) {
	return await client.request("/users/me");
}
async function fetchMattermostUser(client, userId) {
	return await client.request(`/users/${userId}`);
}
async function fetchMattermostUserByUsername(client, username) {
	return await client.request(`/users/username/${encodeURIComponent(username)}`);
}
async function fetchMattermostChannel(client, channelId) {
	return await client.request(`/channels/${encodeURIComponent(channelId)}`);
}
async function fetchMattermostChannelPosts(client, channelId, options = {}) {
	const before = normalizeOptionalString(options.before);
	const after = normalizeOptionalString(options.after);
	if (before && after) throw new Error("Mattermost read accepts either before or after, not both.");
	if (options.limit !== void 0 && (!Number.isSafeInteger(options.limit) || options.limit <= 0)) throw new Error("Mattermost read limit must be a positive integer.");
	const perPage = Math.min(options.limit ?? 60, 200);
	const query = new URLSearchParams({ per_page: String(perPage) });
	if (before) query.set("before", before);
	if (after) query.set("after", after);
	const response = await client.request(`/channels/${encodeURIComponent(channelId)}/posts?${query.toString()}`);
	const parsed = MattermostPostListSchema.safeParse(response);
	if (!parsed.success || parsed.data.order.some((postId) => !parsed.data.posts[postId])) throw new Error("Unexpected Mattermost channel posts response.");
	return {
		messages: parsed.data.order.map((postId) => parsed.data.posts[postId]),
		hasMore: Boolean(after ? parsed.data.next_post_id : parsed.data.prev_post_id)
	};
}
async function fetchMattermostChannelByName(client, teamId, channelName) {
	return await client.request(`/teams/${teamId}/channels/name/${encodeURIComponent(channelName)}`);
}
async function sendMattermostTyping(client, params) {
	const payload = { channel_id: params.channelId };
	const parentId = params.parentId?.trim();
	if (parentId) payload.parent_id = parentId;
	await client.request("/users/me/typing", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
async function createMattermostDirectChannel(client, userIds, signal, timeoutMs) {
	return await client.request("/channels/direct", {
		method: "POST",
		body: JSON.stringify(userIds),
		signal,
		timeoutMs
	});
}
const RETRYABLE_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	"ECONNRESET",
	"ECONNREFUSED",
	"ETIMEDOUT",
	"ESOCKETTIMEDOUT",
	"ECONNABORTED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EPIPE",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_DNS_RESOLVE_FAILED",
	"UND_ERR_CONNECT",
	"UND_ERR_SOCKET",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_BODY_TIMEOUT"
]);
const RETRYABLE_NETWORK_ERROR_NAMES = /* @__PURE__ */ new Set([
	"AbortError",
	"TimeoutError",
	"ConnectTimeoutError",
	"HeadersTimeoutError",
	"BodyTimeoutError"
]);
const RETRYABLE_NETWORK_MESSAGE_SNIPPETS = [
	"network error",
	"timeout",
	"timed out",
	"abort",
	"connection refused",
	"econnreset",
	"econnrefused",
	"etimedout",
	"enotfound",
	"socket hang up",
	"getaddrinfo"
];
/**
* Creates a Mattermost DM channel with exponential backoff retry logic.
* Retries on transient errors (429, 5xx, network errors) but not on
* client errors (4xx except 429) or permanent failures.
*/
async function createMattermostDirectChannelWithRetry(client, userIds, options = {}) {
	const { maxRetries = 3, initialDelayMs = 1e3, maxDelayMs = 1e4, timeoutMs: rawTimeoutMs = 3e4, onRetry } = options;
	const timeoutMs = resolveTimerTimeoutMs(rawTimeoutMs, 3e4);
	return await retryAsync(async () => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
		try {
			return await createMattermostDirectChannel(client, userIds, controller.signal, timeoutMs);
		} catch (err) {
			throw err instanceof Error ? err : new Error(String(err));
		} finally {
			clearTimeout(timeoutId);
		}
	}, {
		attempts: maxRetries + 1,
		minDelayMs: Math.min(initialDelayMs, maxDelayMs),
		maxDelayMs,
		jitter: "full",
		shouldRetry: (err) => isRetryableError(err),
		onRetry: (info) => onRetry?.(info.attempt, info.delayMs, info.err)
	});
}
function isRetryableError(error) {
	if (error instanceof PlatformMessageNotDispatchedError && !error.retryable) return false;
	const candidates = collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.reason,
		...Array.isArray(current.errors) ? current.errors : []
	]);
	const messages = candidates.map((candidate) => normalizeLowercaseStringOrEmpty(readErrorMessage(candidate))).filter((message) => Boolean(message));
	if (messages.some((message) => /mattermost api 5\d{2}\b/.test(message))) return true;
	if (messages.some((message) => /mattermost api 429\b/.test(message) || message.includes("too many requests"))) return true;
	for (const message of messages) {
		const clientErrorMatch = message.match(/mattermost api (4\d{2})\b/);
		if (!clientErrorMatch) continue;
		const statusCodeText = clientErrorMatch[1];
		if (!statusCodeText) continue;
		const statusCode = Number.parseInt(statusCodeText, 10);
		if (statusCode >= 400 && statusCode < 500) return false;
	}
	if (messages.some((message) => /mattermost api \d{3}\b/.test(message))) return false;
	const codes = [];
	for (const candidate of candidates) {
		const code = readErrorCode(candidate);
		if (code) codes.push(code);
	}
	if (codes.some((code) => RETRYABLE_NETWORK_ERROR_CODES.has(code))) return true;
	const names = [];
	for (const candidate of candidates) {
		const name = readErrorName(candidate);
		if (name) names.push(name);
	}
	if (names.some((name) => RETRYABLE_NETWORK_ERROR_NAMES.has(name))) return true;
	return messages.some((message) => RETRYABLE_NETWORK_MESSAGE_SNIPPETS.some((pattern) => message.includes(pattern)));
}
function readErrorMessage(error) {
	if (!error || typeof error !== "object") return;
	const message = error.message;
	return typeof message === "string" && message.trim() ? message : void 0;
}
function readErrorName(error) {
	if (!error || typeof error !== "object") return;
	const name = error.name;
	return typeof name === "string" && name.trim() ? name : void 0;
}
function readErrorCode(error) {
	if (!error || typeof error !== "object") return;
	const { code, errno } = error;
	const raw = typeof code === "string" && code.trim() ? code : errno;
	if (typeof raw === "string" && raw.trim()) return raw.trim().toUpperCase();
	if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
}
async function createMattermostPost(client, params) {
	const payload = {
		channel_id: params.channelId,
		message: params.message
	};
	if (params.rootId) payload.root_id = params.rootId;
	if (params.fileIds?.length) payload.file_ids = params.fileIds;
	if (params.props) payload.props = params.props;
	const post = await client.request("/posts", {
		method: "POST",
		body: JSON.stringify(payload)
	});
	const postId = post && typeof post === "object" ? normalizeOptionalString(post.id) : void 0;
	if (!postId) throw createChannelPartialDeliveryError(/* @__PURE__ */ new Error("Mattermost post creation response did not include a post id"), {
		messageIds: [],
		visibleReplySent: true
	});
	return postId === post.id ? post : {
		...post,
		id: postId
	};
}
async function fetchMattermostUserTeams(client, userId) {
	return await client.request(`/users/${userId}/teams`);
}
async function updateMattermostPost(client, postId, params) {
	const payload = { id: postId };
	if (params.message !== void 0) payload.message = params.message;
	if (params.props !== void 0) payload.props = params.props;
	else if (params.message !== void 0 && /\B@(channel|all|here)\b/i.test(params.message)) {
		const current = MattermostPostSchema.parse(await client.request(`/posts/${postId}`));
		if (current.id !== postId) throw new Error("Mattermost post lookup returned a different post id");
		payload.props = current.props ?? {};
	}
	return await client.request(`/posts/${postId}/patch`, {
		method: "PUT",
		body: JSON.stringify(payload)
	});
}
async function deleteMattermostPost(client, postId) {
	await client.request(`/posts/${postId}`, { method: "DELETE" });
}
async function uploadMattermostFile(client, params) {
	const form = new FormData();
	const fileName = normalizeOptionalString(params.fileName) ?? "upload";
	const blob = new Blob([bufferToBlobPart(params.buffer)], { type: params.contentType });
	form.append("files", blob, fileName);
	form.append("channel_id", params.channelId);
	const headers = { Authorization: `Bearer ${client.token}` };
	const res = await client.fetchImpl(`${client.apiBaseUrl}/files`, {
		method: "POST",
		headers,
		body: form
	});
	if (!res.ok) {
		const detail = await readMattermostError(res, headers);
		throw new Error(`Mattermost API ${res.status} ${res.statusText}: ${detail || "unknown error"}`);
	}
	const info = (await readProviderJsonResponse(res, "Mattermost API /files")).file_infos?.[0];
	if (!info?.id) throw new Error("Mattermost file upload failed");
	return info;
}
//#endregion
export { readMattermostError as _, createMattermostPost as a, uploadMattermostFile as b, fetchMattermostChannelByName as c, fetchMattermostUser as d, fetchMattermostUserByUsername as f, parseMattermostApiStatus as g, normalizeMattermostBaseUrl as h, createMattermostDirectChannelWithRetry as i, fetchMattermostChannelPosts as l, isRetryableError as m, buildMattermostApiUrl as n, deleteMattermostPost as o, fetchMattermostUserTeams as p, createMattermostClient as r, fetchMattermostChannel as s, MattermostPostSchema as t, fetchMattermostMe as u, sendMattermostTyping as v, updateMattermostPost as y };

import { t as buildHttpError } from "./event-helpers-CspuhE9k.mjs";
import { PlatformMessageNotDispatchedError } from "openclaw/plugin-sdk/error-runtime";
import { parseMediaContentLength } from "openclaw/plugin-sdk/media-runtime";
import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
import { captureChannelReadAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithRuntimeDispatcherOrMockedGlobal } from "openclaw/plugin-sdk/runtime-fetch";
import { closeDispatcher, createPinnedDispatcher, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-dispatcher";
//#region extensions/matrix/src/matrix/media-errors.ts
const MATRIX_MEDIA_SIZE_LIMIT_ERROR_MESSAGE = "Matrix media exceeds configured size limit";
var MatrixMediaSizeLimitError = class extends Error {
	constructor(message = MATRIX_MEDIA_SIZE_LIMIT_ERROR_MESSAGE, options) {
		super(message, options);
		this.code = "MATRIX_MEDIA_SIZE_LIMIT";
		this.name = "MatrixMediaSizeLimitError";
	}
};
function isMatrixMediaSizeLimitError(err) {
	if (err instanceof MatrixMediaSizeLimitError) return true;
	if (!(err instanceof Error) || err.cause === void 0) return false;
	return isMatrixMediaSizeLimitError(err.cause);
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/read-response-with-limit.ts
async function readResponseWithLimit$1(res, maxBytes, opts) {
	return await readResponseWithLimit(res, maxBytes, {
		...opts,
		onIdleTimeout: opts?.onIdleTimeout ?? (({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Matrix media download stalled: no data received for ${chunkTimeoutMs}ms`))
	});
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/transport.ts
var MatrixSdkAuthorityError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : "Matrix request authority expired", { cause });
		this.name = "AbortError";
	}
};
const MATRIX_JSON_RESPONSE_MAX_BYTES = 8388608;
const MATRIX_SDK_RESPONSE_MAX_BYTES = 67108864;
function normalizeEndpoint(endpoint) {
	if (!endpoint) return "/";
	return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}
function applyQuery(url, qs) {
	if (!qs) return;
	for (const [key, rawValue] of Object.entries(qs)) {
		if (rawValue === void 0 || rawValue === null) continue;
		if (Array.isArray(rawValue)) {
			for (const item of rawValue) {
				if (item === void 0 || item === null) continue;
				url.searchParams.append(key, String(item));
			}
			continue;
		}
		url.searchParams.set(key, String(rawValue));
	}
}
function isRedirectStatus(statusCode) {
	return statusCode >= 300 && statusCode < 400;
}
function toFetchUrl(resource) {
	if (resource instanceof URL) return resource.toString();
	if (typeof resource === "string") return resource;
	return resource.url;
}
const MATRIX_STATE_AFTER_SYNC_PARAM = "org.matrix.msc4222.use_state_after";
function withoutMatrixStateAfterSyncParam(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl);
	} catch {
		return rawUrl;
	}
	if (!url.pathname.endsWith("/sync") || !url.searchParams.has(MATRIX_STATE_AFTER_SYNC_PARAM)) return rawUrl;
	url.searchParams.delete(MATRIX_STATE_AFTER_SYNC_PARAM);
	return url.toString();
}
function buildBufferedResponse(params) {
	const response = new Response(params.body, {
		status: params.source.status,
		statusText: params.source.statusText,
		headers: new Headers(params.source.headers)
	});
	try {
		Object.defineProperty(response, "url", {
			value: params.source.url || params.url,
			configurable: true
		});
	} catch {}
	return response;
}
async function enforceDeclaredResponseSize(params) {
	const contentLength = params.response.headers.get("content-length");
	if (!contentLength) return;
	let length;
	try {
		length = parseMediaContentLength(contentLength);
	} catch (error) {
		await params.response.body?.cancel(error).catch(() => void 0);
		throw error;
	}
	if (length === null || length <= params.maxBytes) return;
	const error = params.createError(length);
	await params.response.body?.cancel(error).catch(() => void 0);
	throw error;
}
async function fetchWithMatrixDispatcher(params) {
	params.assertCurrent?.();
	params.init.signal?.throwIfAborted();
	params.onDispatch?.();
	return await fetchWithRuntimeDispatcherOrMockedGlobal(params.url, params.init);
}
async function fetchWithMatrixGuardedRedirects(params) {
	const assertDispatchCurrent = () => {
		params.assertCurrent?.();
		params.assertSendCurrent?.();
	};
	assertDispatchCurrent();
	let currentUrl = new URL(params.url);
	let method = (params.init?.method ?? "GET").toUpperCase();
	let body = params.init?.body;
	let headers = new Headers(params.init?.headers ?? {});
	const maxRedirects = 5;
	const visited = /* @__PURE__ */ new Set();
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: params.timeoutMs,
		signal: params.signal,
		operation: "matrix.guarded-redirect-fetch",
		url: params.url
	});
	let dispatched = false;
	for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
		let dispatcher;
		try {
			assertDispatchCurrent();
			signal?.throwIfAborted();
			const pinned = await resolvePinnedHostnameWithPolicy(currentUrl.hostname, {
				policy: params.ssrfPolicy,
				signal
			});
			dispatcher = createPinnedDispatcher(pinned, params.dispatcherPolicy, params.ssrfPolicy);
			assertDispatchCurrent();
			signal?.throwIfAborted();
			await params.beforeDispatch?.();
			const response = await fetchWithMatrixDispatcher({
				url: currentUrl.toString(),
				assertCurrent: assertDispatchCurrent,
				onDispatch: () => {
					dispatched = true;
				},
				init: {
					...params.init,
					method,
					body,
					headers,
					redirect: "manual",
					signal,
					dispatcher
				}
			});
			if (!isRedirectStatus(response.status)) return {
				response,
				release: async () => {
					cleanup();
					await closeDispatcher(dispatcher);
				},
				finalUrl: currentUrl.toString()
			};
			const location = response.headers.get("location");
			if (!location) {
				cleanup();
				await closeDispatcher(dispatcher);
				throw new Error(`Matrix redirect missing location header (${currentUrl.toString()})`);
			}
			const nextUrl = new URL(location, currentUrl);
			if (nextUrl.protocol !== currentUrl.protocol) {
				cleanup();
				await closeDispatcher(dispatcher);
				throw new Error(`Blocked cross-protocol redirect (${currentUrl.protocol} -> ${nextUrl.protocol})`);
			}
			const nextUrlString = nextUrl.toString();
			if (visited.has(nextUrlString)) {
				cleanup();
				await closeDispatcher(dispatcher);
				throw new Error("Redirect loop detected");
			}
			visited.add(nextUrlString);
			if (nextUrl.origin !== currentUrl.origin) {
				headers = new Headers(headers);
				headers.delete("authorization");
			}
			if (response.status === 303 || (response.status === 301 || response.status === 302) && method !== "GET" && method !== "HEAD") {
				method = "GET";
				body = void 0;
				headers = new Headers(headers);
				headers.delete("content-type");
				headers.delete("content-length");
			}
			response.body?.cancel().catch(() => void 0);
			await closeDispatcher(dispatcher);
			currentUrl = nextUrl;
		} catch (error) {
			cleanup();
			await closeDispatcher(dispatcher);
			if (!dispatched) {
				if (error instanceof PlatformMessageNotDispatchedError) throw error;
				const rejected = new PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Matrix request rejected before dispatch", { cause: error });
				if (error instanceof MatrixSdkAuthorityError) rejected.name = "AbortError";
				throw rejected;
			}
			if (error instanceof PlatformMessageNotDispatchedError) throw new AggregateError([error, /* @__PURE__ */ new Error("An earlier Matrix request crossed the fetch boundary")], error.message, { cause: error });
			throw error;
		}
	}
	cleanup();
	throw new Error(`Too many redirects while requesting ${params.url}`);
}
function createMatrixGuardedFetch(params) {
	return (async (resource, init) => {
		const authority = params.captureRequestAuthority?.() ?? captureChannelReadAuthority();
		const assertCurrent = authority ? () => {
			try {
				authority();
			} catch (error) {
				throw new MatrixSdkAuthorityError(error);
			}
		} : void 0;
		const assertSendCurrent = params.captureSendCurrentness?.(resource, init);
		assertCurrent?.();
		const url = withoutMatrixStateAfterSyncParam(toFetchUrl(resource));
		const { signal, ...requestInit } = init ?? {};
		const signals = [
			params.signal,
			signal,
			params.captureRequestSignal?.()
		].filter((candidate) => candidate != null);
		const requestSignal = signals.length > 0 ? AbortSignal.any(signals) : void 0;
		const beforeRequest = params.beforeRequest;
		const { response, release } = await fetchWithMatrixGuardedRedirects({
			url,
			init: requestInit,
			signal: requestSignal,
			assertCurrent,
			assertSendCurrent,
			ssrfPolicy: params.ssrfPolicy,
			dispatcherPolicy: params.dispatcherPolicy,
			beforeDispatch: beforeRequest ? () => beforeRequest(resource, init) : void 0
		});
		try {
			await enforceDeclaredResponseSize({
				response,
				maxBytes: MATRIX_SDK_RESPONSE_MAX_BYTES,
				createError: (length) => /* @__PURE__ */ new Error(`Matrix SDK response exceeds size limit (${length} bytes > ${MATRIX_SDK_RESPONSE_MAX_BYTES} bytes)`)
			});
			const body = await readResponseWithLimit$1(response, MATRIX_SDK_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes, size }) => /* @__PURE__ */ new Error(`Matrix SDK response exceeds size limit (${size} bytes > ${maxBytes} bytes)`) });
			assertCurrent?.();
			return buildBufferedResponse({
				source: response,
				body: Uint8Array.from(body),
				url
			});
		} finally {
			try {
				await release();
			} finally {
				assertCurrent?.();
			}
		}
	});
}
async function performMatrixRequest(params) {
	const assertCurrent = params.assertCurrent ?? captureChannelReadAuthority();
	assertCurrent?.();
	const isAbsoluteEndpoint = params.endpoint.startsWith("http://") || params.endpoint.startsWith("https://");
	if (isAbsoluteEndpoint && params.allowAbsoluteEndpoint !== true) throw new Error(`Absolute Matrix endpoint is blocked by default: ${params.endpoint}. Set allowAbsoluteEndpoint=true to opt in.`);
	const baseUrl = isAbsoluteEndpoint ? new URL(params.endpoint) : new URL(`${params.homeserver.replace(/\/+$/u, "")}${normalizeEndpoint(params.endpoint)}`);
	applyQuery(baseUrl, params.qs);
	const headers = new Headers();
	headers.set("Accept", params.raw ? "*/*" : "application/json");
	if (params.accessToken) headers.set("Authorization", `Bearer ${params.accessToken}`);
	let body;
	if (params.body !== void 0) {
		if (params.body instanceof Uint8Array || params.body instanceof ArrayBuffer || typeof params.body === "string") body = params.body;
		else {
			headers.set("Content-Type", "application/json");
			body = JSON.stringify(params.body);
		}
	}
	const { response, release } = await fetchWithMatrixGuardedRedirects({
		url: baseUrl.toString(),
		init: {
			method: params.method,
			headers,
			body
		},
		timeoutMs: params.timeoutMs,
		ssrfPolicy: params.ssrfPolicy,
		dispatcherPolicy: params.dispatcherPolicy,
		assertCurrent,
		assertSendCurrent: params.assertSendCurrent,
		signal: params.signal
	});
	try {
		if (params.raw) {
			const rawMaxBytes = params.maxBytes ?? MATRIX_SDK_RESPONSE_MAX_BYTES;
			await enforceDeclaredResponseSize({
				response,
				maxBytes: rawMaxBytes,
				createError: (length) => new MatrixMediaSizeLimitError(`Matrix media exceeds configured size limit (${length} bytes > ${rawMaxBytes} bytes)`)
			});
			const bytes = await readResponseWithLimit$1(response, rawMaxBytes, {
				onOverflow: ({ maxBytes, size }) => new MatrixMediaSizeLimitError(`Matrix media exceeds configured size limit (${size} bytes > ${maxBytes} bytes)`),
				chunkTimeoutMs: params.readIdleTimeoutMs
			});
			assertCurrent?.();
			return {
				response,
				text: bytes.toString("utf8"),
				buffer: bytes
			};
		}
		const jsonMaxBytes = params.maxBytes ?? MATRIX_JSON_RESPONSE_MAX_BYTES;
		await enforceDeclaredResponseSize({
			response,
			maxBytes: jsonMaxBytes,
			createError: (length) => /* @__PURE__ */ new Error(`Matrix JSON response exceeds configured size limit (${length} bytes > ${jsonMaxBytes} bytes)`)
		});
		const buffer = await readResponseWithLimit$1(response, jsonMaxBytes, {
			onOverflow: ({ maxBytes, size }) => /* @__PURE__ */ new Error(`Matrix JSON response exceeds configured size limit (${size} bytes > ${maxBytes} bytes)`),
			chunkTimeoutMs: params.readIdleTimeoutMs,
			onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Matrix JSON response stalled: no data received for ${chunkTimeoutMs}ms`)
		});
		assertCurrent?.();
		return {
			response,
			text: buffer.toString("utf8"),
			buffer
		};
	} finally {
		try {
			await release();
		} finally {
			assertCurrent?.();
		}
	}
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/http-client.ts
var MatrixAuthedHttpClient = class {
	constructor(params) {
		this.homeserver = params.homeserver;
		this.accessToken = params.accessToken;
		this.ssrfPolicy = params.ssrfPolicy;
		this.dispatcherPolicy = params.dispatcherPolicy;
		this.captureRequestAuthority = params.captureRequestAuthority;
		this.captureSendCurrentness = params.captureSendCurrentness;
		this.signal = params.signal;
	}
	async requestJson(params) {
		const { response, text } = await performMatrixRequest({
			homeserver: this.homeserver,
			accessToken: this.accessToken,
			method: params.method,
			endpoint: params.endpoint,
			qs: params.qs,
			body: params.body,
			timeoutMs: params.timeoutMs,
			ssrfPolicy: this.ssrfPolicy,
			dispatcherPolicy: this.dispatcherPolicy,
			allowAbsoluteEndpoint: params.allowAbsoluteEndpoint,
			assertCurrent: this.captureRequestAuthority?.(),
			assertSendCurrent: this.captureSendCurrentness?.(),
			signal: this.signal
		});
		if (!response.ok) throw buildHttpError(response.status, text);
		if ((response.headers.get("content-type") ?? "").split(";", 1)[0]?.trim().toLowerCase() === "application/json") {
			if (!text.trim()) return {};
			try {
				return JSON.parse(text);
			} catch {
				throw Object.assign(/* @__PURE__ */ new Error("Matrix homeserver returned malformed JSON"), { statusCode: response.status });
			}
		}
		return text;
	}
	async requestRaw(params) {
		const { response, buffer } = await performMatrixRequest({
			homeserver: this.homeserver,
			accessToken: this.accessToken,
			method: params.method,
			endpoint: params.endpoint,
			qs: params.qs,
			timeoutMs: params.timeoutMs,
			raw: true,
			maxBytes: params.maxBytes,
			readIdleTimeoutMs: params.readIdleTimeoutMs,
			ssrfPolicy: this.ssrfPolicy,
			dispatcherPolicy: this.dispatcherPolicy,
			allowAbsoluteEndpoint: params.allowAbsoluteEndpoint,
			assertCurrent: this.captureRequestAuthority?.(),
			assertSendCurrent: this.captureSendCurrentness?.(),
			signal: this.signal
		});
		if (!response.ok) throw buildHttpError(response.status, buffer.toString("utf8"));
		return buffer;
	}
};
//#endregion
export { isMatrixMediaSizeLimitError as i, createMatrixGuardedFetch as n, MatrixMediaSizeLimitError as r, MatrixAuthedHttpClient as t };

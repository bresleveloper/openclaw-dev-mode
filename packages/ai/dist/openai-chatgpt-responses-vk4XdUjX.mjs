import { i as formatThrownValue, n as createAssistantMessageDiagnostic, t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { r as clampPositiveTimerTimeoutMs } from "./number-coercion-V8-BhME4.mjs";
import { E as headersToRecord, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { D as supportsOpenAITemperature, h as responsesPromptObserver } from "./openai-responses-contracts-BKu8O7l4.mjs";
import { r as registerSessionResourceCleanup } from "./session-resources-D1wgDQ8C.mjs";
import { n as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-BK6E2g4Q.mjs";
import { _ as extractErrorCodeOrErrno, o as WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE, v as toErrorObject } from "./diagnostics-Caj-4RBA.mjs";
import { a as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./text-signature-CbqxIB8B.mjs";
import { parseRetryAfterHeadersSeconds } from "./internal/retry-after.mjs";
import { c as resolveOpenAIResponsesTextFormat } from "./openai-completions-compat-GMN8A0fm.mjs";
import { n as buildManagedModelFetch } from "./host-policy-BwhNNGQR.mjs";
import { S as withProviderResponseHook, b as transportAbortError, h as notifyProviderStreamOpened, n as assignTransportErrorDetails } from "./transport-stream-shared-CCR7hSW0.mjs";
import { C as stripSystemPromptCacheBoundary, n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { A as recordResponsesContextUsage, Et as createResponseModelTracker, P as convertProviderResponsesMessages, S as isInvalidEncryptedContentError, T as ResponsesStreamFailure, Tt as createOpenAIResponseHook, b as commitResponsesEncryptedContentAttempt, gt as resolveOpenAISimpleReasoningEffort, ht as resolveOpenAIRequestReasoning, i as convertResponsesToolPayload, it as suppressOpenAIResponsesCompaction, n as applyResponsesServiceTierPricing, o as readOpenAIMisalignmentReview, s as processResponsesStream, tt as buildOpenAIResponsesReasoningReplayMetadata, w as resolveNextResponsesEncryptedContentAttempt, wt as createOpenAIProviderAcceptanceHook } from "./openai-responses-shared-BMx2NAS-.mjs";
import { t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-D9ZmL_s9.mjs";
import { n as withResponsesRequestAcceptance, r as createResponsesPromptEgressObserver, t as responsesRequestLifecycle } from "./openai-responses-request-lifecycle-Dskvtz_Z.mjs";
import { t as requireApiKey } from "./required-api-key-D4kn3252.mjs";
import { n as resolveOpenAICodexAccountId } from "./openai-chatgpt-jwt-KWcgd0d_.mjs";
//#region packages/ai/src/providers/openai-chatgpt-responses-events.ts
var CodexApiError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "CodexApiError";
		this.code = options?.code;
		this.status = options?.status;
		this.payload = options?.payload;
		this.cause = options?.cause;
	}
};
function extractCodexEventError(event) {
	const nested = isRecord(event.error) ? event.error : void 0;
	return {
		code: typeof event.code === "string" ? event.code : typeof nested?.code === "string" ? nested.code : void 0,
		message: typeof event.message === "string" ? event.message : typeof nested?.message === "string" ? nested.message : void 0
	};
}
async function* mapCodexEvents(events, initialResponseHeaders, options) {
	const responseModelTracker = createResponseModelTracker();
	responseModelTracker.begin(initialResponseHeaders);
	for await (const event of withResponsesRequestAcceptance(events, responsesRequestLifecycle.get(options), options?.signal)) {
		responseModelTracker.observeEvent(event);
		const type = typeof event.type === "string" ? event.type : void 0;
		if (!type) continue;
		if (type === "error") {
			const { code, message } = extractCodexEventError(event);
			throw new CodexApiError(`Codex error: ${message || code || JSON.stringify(event)}`, {
				code,
				payload: event
			});
		}
		if (type === "response.done" || type === "response.completed" || type === "response.incomplete") {
			const response = isRecord(event.response) ? event.response : void 0;
			const normalizedResponse = response ? {
				...response,
				status: normalizeCodexStatus(response.status),
				model: responseModelTracker.resolve()
			} : response;
			yield {
				...event,
				type: type === "response.done" ? "response.completed" : type,
				response: normalizedResponse
			};
			return;
		}
		yield event;
	}
}
function normalizeCodexStatus(status) {
	switch (status) {
		case "completed":
		case "incomplete":
		case "failed":
		case "cancelled":
		case "queued":
		case "in_progress": return status;
		default: return;
	}
}
//#endregion
//#region packages/ai/src/providers/openai-chatgpt-responses-protocol.ts
const OPENAI_CHATGPT_RESPONSES_SSE_FRAME_MAX_BYTES = 16777216;
var CodexProtocolError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "CodexProtocolError";
		this.payload = options?.payload;
		this.cause = options?.cause;
	}
};
async function* parseOpenAIChatGptResponsesSse(response) {
	if (!response.body) return;
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = /* @__PURE__ */ new Uint8Array(1024);
	let size = 0;
	let lineEmpty = true;
	let skipLf = false;
	let cancelReason;
	try {
		while (true) {
			const { done, value } = await reader.read();
			for (let index = 0; index < (value?.length ?? 0) + (done ? 1 : 0); index++) {
				const byte = value?.[index];
				if (byte !== void 0) {
					const crlf = skipLf && byte === 10;
					skipLf = byte === 13;
					const lineEnding = byte === 10 || byte === 13;
					const boundary = !crlf && lineEnding && lineEmpty;
					lineEmpty = lineEnding;
					if (crlf && size === 0) continue;
					if (size >= OPENAI_CHATGPT_RESPONSES_SSE_FRAME_MAX_BYTES) throw new Error(`OpenAI ChatGPT Responses SSE frame exceeded ${OPENAI_CHATGPT_RESPONSES_SSE_FRAME_MAX_BYTES} bytes`);
					if (size === buffer.length) {
						const grown = new Uint8Array(Math.min(buffer.length * 2, OPENAI_CHATGPT_RESPONSES_SSE_FRAME_MAX_BYTES));
						grown.set(buffer);
						buffer = grown;
					}
					buffer[size++] = byte;
					if (!boundary) continue;
				}
				const chunk = decoder.decode(buffer.subarray(0, size), { stream: !done });
				size = 0;
				const data = chunk.split(/\r\n|\r|\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n").trim();
				if (!data || data === "[DONE]") continue;
				let event;
				try {
					event = JSON.parse(data);
				} catch (cause) {
					if (!(cause instanceof SyntaxError)) throw cause;
					throw new CodexProtocolError(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { cause });
				}
				yield event;
			}
			if (done) break;
		}
	} catch (error) {
		cancelReason = error;
		throw error;
	} finally {
		reader.cancel(cancelReason).catch(() => void 0);
		try {
			reader.releaseLock();
		} catch {}
	}
}
const DEFAULT_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
function resolveCodexUrl(baseUrl) {
	const normalized = (baseUrl && baseUrl.trim().length > 0 ? baseUrl : DEFAULT_CODEX_BASE_URL).replace(/\/+$/, "");
	if (normalized.endsWith("/codex/responses")) return normalized;
	if (normalized.endsWith("/codex")) return `${normalized}/responses`;
	return `${normalized}/codex/responses`;
}
function resolveCodexWebSocketUrl(baseUrl) {
	const url = new URL(resolveCodexUrl(baseUrl));
	if (url.protocol === "https:") url.protocol = "wss:";
	if (url.protocol === "http:") url.protocol = "ws:";
	return url.toString();
}
//#endregion
//#region packages/ai/src/providers/openai-chatgpt-responses-websocket-authority.ts
const OPENAI_BETA_RESPONSES_WEBSOCKETS = "responses_websockets=2026-02-06";
function createCodexWebSocketAuthority(transportHost, baseUrl, headers) {
	return {
		transportHost,
		url: resolveCodexWebSocketUrl(baseUrl),
		headers,
		normalizedHeaders: Array.from(headers.entries()).filter(([name]) => name !== "traceparent")
	};
}
function resolveCodexWebSocketAuthority(params) {
	return params.transport === "sse" ? void 0 : createCodexWebSocketAuthority(params.transportHost, params.baseUrl, params.headers());
}
function buildCodexWebSocketHeaders(baseHeaders, requestId) {
	baseHeaders.delete("accept");
	baseHeaders.delete("content-type");
	baseHeaders.delete("OpenAI-Beta");
	baseHeaders.delete("openai-beta");
	baseHeaders.set("OpenAI-Beta", OPENAI_BETA_RESPONSES_WEBSOCKETS);
	baseHeaders.set("x-client-request-id", requestId);
	baseHeaders.set("session_id", requestId);
	return baseHeaders;
}
function matchesCodexWebSocketAuthority(cached, requested) {
	return cached.transportHost === requested.transportHost && cached.url === requested.url && cached.normalizedHeaders.length === requested.normalizedHeaders.length && cached.normalizedHeaders.every(([name, value], index) => name === requested.normalizedHeaders[index]?.[0] && value === requested.normalizedHeaders[index]?.[1]);
}
const MAX_SSE_FALLBACK_AUTHORITIES_PER_SESSION = 8;
function hasCodexWebSocketSseFallback(fallbacksBySession, sessionId, authority) {
	return Boolean(sessionId && fallbacksBySession.get(sessionId)?.some((fallback) => matchesCodexWebSocketAuthority(fallback, authority)));
}
function addCodexWebSocketSseFallback(fallbacksBySession, sessionId, authority) {
	const fallbacks = fallbacksBySession.get(sessionId) ?? [];
	if (fallbacks.some((fallback) => matchesCodexWebSocketAuthority(fallback, authority))) return;
	if (fallbacks.length === MAX_SSE_FALLBACK_AUTHORITIES_PER_SESSION) fallbacks.shift();
	fallbacks.push(authority);
	if (!fallbacksBySession.has(sessionId)) fallbacksBySession.set(sessionId, fallbacks);
}
function clearCodexWebSocketSseFallback(fallbacksBySession, sessionId) {
	if (sessionId) {
		fallbacksBySession.delete(sessionId);
		return;
	}
	fallbacksBySession.clear();
}
//#endregion
//#region packages/ai/src/providers/openai-chatgpt-responses-websocket-state.ts
const SESSION_WEBSOCKET_CACHE_TTL_MS = 3e5;
const SESSION_WEBSOCKET_MAX_AGE_MS = 33e5;
const runtimeStates = /* @__PURE__ */ new WeakMap();
const runtimeStateReferences = /* @__PURE__ */ new Set();
const runtimeStateFinalizer = new FinalizationRegistry((reference) => runtimeStateReferences.delete(reference));
function getOpenAICodexWebSocketRuntimeState(transportHost) {
	let state = runtimeStates.get(transportHost);
	if (!state) {
		state = {
			sessionCache: /* @__PURE__ */ new Map(),
			sseFallbacks: /* @__PURE__ */ new Map()
		};
		runtimeStates.set(transportHost, state);
		const reference = new WeakRef(state);
		runtimeStateReferences.add(reference);
		runtimeStateFinalizer.register(state, reference, reference);
	}
	return state;
}
function closeWebSocketSilently(socket, code = 1e3, reason = "done") {
	try {
		socket.close(code, reason);
	} catch {}
}
function isWebSocketReusable(socket) {
	return socket.readyState === void 0 || socket.readyState === 1;
}
function isWebSocketSessionExpired(entry) {
	return Date.now() - entry.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
}
function deleteOwnedWebSocketSession(state, sessionId, entry) {
	if (state.sessionCache.get(sessionId) === entry) state.sessionCache.delete(sessionId);
}
function setOwnedWebSocketSession(state, sessionId, entry, expected) {
	if (state.sessionCache.get(sessionId) !== expected) return false;
	state.sessionCache.set(sessionId, entry);
	return true;
}
function scheduleSessionWebSocketExpiry(state, sessionId, entry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(() => {
		if (entry.busy) return;
		closeWebSocketSilently(entry.socket, 1e3, "idle_timeout");
		deleteOwnedWebSocketSession(state, sessionId, entry);
	}, SESSION_WEBSOCKET_CACHE_TTL_MS);
}
function closeRuntimeState(state, sessionId) {
	const closeEntry = (entry) => {
		if (entry.idleTimer) clearTimeout(entry.idleTimer);
		closeWebSocketSilently(entry.socket, 1e3, "debug_close");
	};
	if (sessionId) {
		clearCodexWebSocketSseFallback(state.sseFallbacks, sessionId);
		const entry = state.sessionCache.get(sessionId);
		if (entry) closeEntry(entry);
		state.sessionCache.delete(sessionId);
		return;
	}
	for (const entry of state.sessionCache.values()) closeEntry(entry);
	state.sessionCache.clear();
	clearCodexWebSocketSseFallback(state.sseFallbacks);
}
function closeOpenAICodexWebSocketState(transportHost, sessionId) {
	const state = runtimeStates.get(transportHost);
	if (state) closeRuntimeState(state, sessionId);
}
function closeAllOpenAICodexWebSocketStates(sessionId) {
	for (const reference of runtimeStateReferences) {
		const state = reference.deref();
		if (!state) {
			runtimeStateReferences.delete(reference);
			continue;
		}
		closeRuntimeState(state, sessionId);
	}
}
//#endregion
//#region packages/ai/src/providers/openai-chatgpt-responses.ts
const dynamicImport = (specifier) => import(specifier);
function loadNodeOs() {
	if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) return null;
	return process.getBuiltinModule?.("node:os") ?? null;
}
const os = loadNodeOs();
const REQUEST_COMPRESSION_ZSTD_LEVEL = 3;
const CODEX_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
const WEBSOCKET_TRANSPORT_ERROR_CODE = "ERR_WEBSOCKET_TRANSPORT";
const RETRYABLE_CLOSE_CODES = /* @__PURE__ */ new Set([
	1e3,
	1001,
	1005,
	1006,
	1011,
	1012,
	1013,
	1014,
	1015
]);
const WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE = 1009;
const WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE = "websocket_connection_limit_reached";
const WEBSOCKET_REPLAY_REJECTION = "Codex error: Persisted response contains hosted-tool, compaction, or unverifiable hidden reasoning state that Rustponses cannot replay. Start a new response or use the Python Responses service for this continuation.";
const OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES = 16384;
function isRequestTimeoutError(error, callerSignal, requestSignal, timeoutMs) {
	if (timeoutMs === void 0 || callerSignal?.aborted || !requestSignal?.aborted) return false;
	if (!(error instanceof Error)) return false;
	return error.name === "AbortError" || error.name === "TimeoutError" || error.message === "Request was aborted";
}
/** Local-only failure category for transport diagnostics; never provider text. */
function classifyStreamFailure(error, signal, requestTimedOut) {
	if (requestTimedOut) return "timeout";
	if (signal?.aborted) return "caller-abort";
	return error instanceof ResponsesStreamFailure || error instanceof CodexApiError ? "provider-failure" : "transport";
}
function formatRequestTimeoutError(timeoutMs, cause) {
	return new Error(`Request timed out after ${timeoutMs}ms`, { cause: cause instanceof Error ? cause : void 0 });
}
function compressRequestBodyZstd(bodyJson) {
	if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) return null;
	const zlib = process.getBuiltinModule?.("node:zlib");
	if (!zlib || typeof zlib.zstdCompressSync !== "function") return null;
	try {
		const compressed = zlib.zstdCompressSync(bodyJson, { params: { [zlib.constants.ZSTD_c_compressionLevel]: REQUEST_COMPRESSION_ZSTD_LEVEL } });
		return Uint8Array.from(compressed);
	} catch {
		return null;
	}
}
const streamOpenAICodexResponses = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const startedAt = Date.now();
		let requestTimeoutMs;
		let requestTimeoutSignal;
		let activeSignal;
		let firstEventAbort;
		const output = createAssistantOutput(model);
		try {
			const unresolvedApiKey = requireApiKey(model.provider, options?.apiKey);
			const transportHost = getAiTransportHost();
			const websocketState = getOpenAICodexWebSocketRuntimeState(transportHost);
			const apiKey = transportHost.resolveSecretSentinel(unresolvedApiKey);
			const modelHeaders = resolveAiTransportHeaderSentinels(model.headers);
			const optionHeaders = resolveAiTransportHeaderSentinels(options?.headers);
			const accountId = extractOpenAICodexAccountId(apiKey);
			const buildBody = async (replayMode) => {
				let body = buildRequestBody(model, context, options, replayMode);
				const nextBody = await options?.onPayload?.(body, model);
				if (nextBody !== void 0) body = nextBody;
				return body;
			};
			let semanticAttempt = {
				kind: "initial",
				request: await buildBody("checkpoint")
			};
			const commitSemanticAttempt = (attempt) => commitResponsesEncryptedContentAttempt(attempt, (checkpoint) => suppressOpenAIResponsesCompaction(output, model, options, checkpoint));
			const observePromptEgress = createResponsesPromptEgressObserver(options, context.systemPrompt);
			const sessionId = clampOpenAIPromptCacheKey(options?.sessionId);
			requestTimeoutMs = clampPositiveTimerTimeoutMs(options?.timeoutMs);
			requestTimeoutSignal = options?.signal;
			if (requestTimeoutMs !== void 0) {
				const timeoutSignal = AbortSignal.timeout(requestTimeoutMs);
				requestTimeoutSignal = options?.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;
			}
			firstEventAbort = createFirstStreamEventAbortController(requestTimeoutSignal);
			activeSignal = firstEventAbort.signal;
			const requestOptions = activeSignal === options?.signal ? options : {
				...options,
				signal: activeSignal
			};
			const transport = options?.transport || "auto";
			let websocketAuthority;
			if (!transportHost.requiresManagedTransport(model)) try {
				websocketAuthority = resolveCodexWebSocketAuthority({
					transport,
					transportHost,
					baseUrl: model.baseUrl,
					headers: () => buildCodexWebSocketHeaders(buildBaseCodexHeaders(modelHeaders, optionHeaders, accountId, apiKey), sessionId || createCodexRequestId())
				});
			} catch (error) {
				if (transport !== "auto") throw error;
				appendAssistantMessageDiagnostic(output, createAssistantMessageDiagnostic("provider_transport_failure", error, {
					configuredTransport: transport,
					fallbackTransport: "sse",
					eventsEmitted: false,
					phase: "before_message_stream_start"
				}));
			}
			const websocketDisabledForSession = transport === "auto" && websocketAuthority !== void 0 && hasCodexWebSocketSseFallback(websocketState.sseFallbacks, options?.sessionId, websocketAuthority);
			if (websocketAuthority && !websocketDisabledForSession) {
				let websocketStarted = false;
				let retriedWebSocketRejection = false;
				while (true) {
					const activeAttempt = semanticAttempt;
					const dispatch = {};
					websocketStarted = false;
					try {
						const terminal = await processWebSocketStream(websocketState, websocketAuthority, activeAttempt.request, output, stream, model, () => {
							websocketStarted = true;
						}, () => {
							commitSemanticAttempt(activeAttempt);
						}, requestOptions, firstEventAbort.abort, observePromptEgress, activeAttempt.kind, (request) => {
							dispatch.request = request;
						}, options?.signal);
						if (activeSignal?.aborted) throw transportAbortError(activeSignal);
						if (output.stopReason === "aborted" || output.stopReason === "error") throw new CodexApiError(output.errorMessage ?? "An unknown error occurred");
						if (terminal && activeAttempt.kind === "initial") recordResponsesContextUsage(output, model, options, activeAttempt.request, terminal.output, "provider");
						stream.push({
							type: "done",
							reason: output.stopReason,
							message: output
						});
						stream.end();
						return;
					} catch (error) {
						const aborted = activeSignal?.aborted;
						const nextSemanticAttempt = !aborted && dispatch.request && !websocketStarted && error instanceof CodexApiError && isInvalidEncryptedContentError(error) ? await resolveNextResponsesEncryptedContentAttempt(activeAttempt, error, { buildFullHistoryRequest: () => buildBody("full-history") }) : void 0;
						if (nextSemanticAttempt) {
							semanticAttempt = nextSemanticAttempt;
							retriedWebSocketRejection = false;
							continue;
						}
						const reconnectBeforeStart = !websocketStarted && isWebSocketConnectionLimitReachedError(error) || !websocketStarted && dispatch.request?.previous_response_id && error instanceof CodexApiError && error.message === WEBSOCKET_REPLAY_REJECTION;
						if (!aborted && reconnectBeforeStart && !retriedWebSocketRejection) {
							retriedWebSocketRejection = true;
							continue;
						}
						const transportError = isWebSocketConnectionLimitReachedError(error) ? Object.assign(new Error(error.message, { cause: error }), { code: WEBSOCKET_TRANSPORT_ERROR_CODE }) : error;
						if (aborted || isCodexNonTransportError(transportError)) throw transportError;
						appendAssistantMessageDiagnostic(output, createAssistantMessageDiagnostic("provider_transport_failure", transportError, {
							configuredTransport: transport,
							fallbackTransport: transport === "auto" && !websocketStarted ? "sse" : void 0,
							eventsEmitted: websocketStarted,
							phase: websocketStarted ? "after_message_stream_start" : "before_message_stream_start",
							requestBytes: new TextEncoder().encode(JSON.stringify(activeAttempt.request)).byteLength
						}));
						if (transport === "auto" && options?.sessionId) addCodexWebSocketSseFallback(websocketState.sseFallbacks, options.sessionId, websocketAuthority);
						if (websocketStarted || transport !== "auto") throw transportError;
						break;
					}
				}
			}
			let response;
			while (true) {
				const activeAttempt = semanticAttempt;
				response = void 0;
				const sseHeaders = buildSSEHeaders(modelHeaders, optionHeaders, accountId, apiKey, sessionId);
				const bodyJson = JSON.stringify(activeAttempt.request);
				const compressedBody = model.provider === "openai" && !sseHeaders.has("content-encoding") ? compressRequestBodyZstd(bodyJson) : null;
				if (compressedBody) sseHeaders.set("content-encoding", "zstd");
				const sseBody = compressedBody ?? bodyJson;
				if (activeSignal?.aborted) throw transportAbortError(activeSignal);
				observePromptEgress?.(activeAttempt.request, {
					egress: "native-codex-sse",
					payloadVariant: activeAttempt.kind
				});
				let attemptResponse;
				try {
					const lifecycle = responsesRequestLifecycle.get(options);
					if (lifecycle) {
						await lifecycle.beforeDispatch(activeSignal);
						activeSignal?.throwIfAborted();
						lifecycle.assertCurrent();
					}
					attemptResponse = await (buildManagedModelFetch(model, transportHost) ?? fetch)(resolveCodexUrl(model.baseUrl), {
						method: "POST",
						headers: sseHeaders,
						body: sseBody,
						signal: activeSignal
					});
				} catch (error) {
					if (error instanceof Error) {
						if (isRequestTimeoutError(error, options?.signal, requestTimeoutSignal, requestTimeoutMs) && requestTimeoutMs !== void 0) throw formatRequestTimeoutError(requestTimeoutMs, error);
						if (error.name === "AbortError" || error.message === "Request was aborted") throw new Error("Request was aborted", { cause: error });
						if (error.name === "TimeoutError" && requestTimeoutMs !== void 0) throw new Error(`Request timed out after ${requestTimeoutMs}ms`, { cause: error });
					}
					throw toErrorObject(error, String(error));
				}
				response = attemptResponse;
				if (attemptResponse.ok) {
					if (!attemptResponse.body) throw new Error("No response body");
					if (activeSignal?.aborted) throw transportAbortError(activeSignal);
					commitSemanticAttempt(activeAttempt);
					break;
				}
				const hookStream = withFirstStreamEventTimeout(withProviderResponseHook({
					signal: firstEventAbort.signal,
					abort: firstEventAbort.abort,
					hook: createOpenAIResponseHook(options?.onResponse, attemptResponse, model)
				}), {
					provider: model.provider,
					api: model.api,
					model: model.id,
					timeoutMs: getFirstStreamEventTimeoutMs(options) ?? 0,
					stage: "responses",
					abort: firstEventAbort.abort,
					onTimeout: getFirstStreamEventTimeoutHandler(options)
				});
				const [errorText] = await Promise.all([readChatGptResponsesErrorTextLimited(attemptResponse, activeSignal), hookStream[Symbol.asyncIterator]().next()]);
				const terminalResponseError = parseErrorResponse(errorText, attemptResponse);
				if (activeSignal?.aborted) throw transportAbortError(activeSignal);
				const nextSemanticAttempt = await resolveNextResponsesEncryptedContentAttempt(activeAttempt, terminalResponseError, { buildFullHistoryRequest: () => buildBody("full-history") });
				if (!nextSemanticAttempt) throw terminalResponseError;
				semanticAttempt = nextSemanticAttempt;
			}
			const hookedResponseStream = withProviderResponseHook({
				stream: mapCodexEvents(parseOpenAIChatGptResponsesSse(response), response.headers, requestOptions),
				signal: firstEventAbort.signal,
				abort: firstEventAbort.abort,
				hook: createOpenAIProviderAcceptanceHook(options, response, model),
				onReady: () => stream.push({
					type: "start",
					partial: output
				})
			});
			const terminal = await processResponsesStream(hookedResponseStream, output, stream, model, {
				serviceTier: options?.serviceTier,
				firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
				abortFirstEventStream: firstEventAbort.abort,
				onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
				signal: options?.signal,
				reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
					sessionId: options?.sessionId,
					authProfileId: options?.authProfileId
				}),
				resolveServiceTier: resolveCodexServiceTier,
				applyServiceTierPricing: (usage, serviceTier) => applyResponsesServiceTierPricing(usage, serviceTier, model)
			});
			if (activeSignal?.aborted) throw transportAbortError(activeSignal);
			if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
			if (terminal && semanticAttempt.kind === "initial") recordResponsesContextUsage(output, model, options, semanticAttempt.request, terminal.output, "provider");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			await responsesRequestLifecycle.get(options)?.settle().catch(() => void 0);
			const requestTimedOut = isRequestTimeoutError(error, options?.signal, requestTimeoutSignal, requestTimeoutMs) && requestTimeoutMs !== void 0;
			const normalizedError = requestTimedOut && requestTimeoutMs !== void 0 ? formatRequestTimeoutError(requestTimeoutMs, error) : error;
			for (const block of output.content) delete block.partialJson;
			const providerRefusal = readCodexProviderRefusal(normalizedError);
			if (providerRefusal) appendAssistantMessageDiagnostic(output, {
				type: "provider_refusal",
				timestamp: Date.now(),
				details: {
					provider: "openai",
					category: providerRefusal.category,
					...providerRefusal.review ? { review: providerRefusal.review } : {}
				}
			});
			const terminal = assignTransportErrorDetails(output, normalizedError, options?.signal);
			getAiTransportHost().logWarn("openai-transport", "ChatGPT Responses stream terminated", {
				provider: model.provider,
				api: model.api,
				model: model.id,
				transport: options?.transport || "auto",
				elapsedMs: Math.max(0, Date.now() - startedAt),
				stopReason: terminal.stopReason,
				failureKind: classifyStreamFailure(error, options?.signal, requestTimedOut)
			});
			stream.push({
				type: "error",
				reason: terminal.stopReason,
				error: output
			});
			stream.end();
		} finally {
			firstEventAbort?.dispose();
		}
	})();
	return stream;
};
const streamSimpleOpenAICodexResponses = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const resolvedOptions = {
		...buildBaseOptions(model, options, apiKey),
		authProfileId: options?.authProfileId,
		reasoningEffort: resolveOpenAISimpleReasoningEffort(model, options?.reasoning)
	};
	responsesPromptObserver.copy(options, resolvedOptions);
	const lifecycle = responsesRequestLifecycle.get(options);
	if (lifecycle) responsesRequestLifecycle.set(resolvedOptions, lifecycle);
	return streamOpenAICodexResponses(model, context, resolvedOptions);
};
function buildRequestBody(model, context, options, replayMode = "checkpoint") {
	const messages = convertProviderResponsesMessages(model, context, CODEX_TOOL_CALL_PROVIDERS, {
		includeSystemPrompt: false,
		replayResponsesItemIds: false,
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId,
		replayMode
	});
	const body = {
		model: model.id,
		store: false,
		stream: true,
		instructions: stripSystemPromptCacheBoundary(context.systemPrompt ?? "") || "You are a helpful assistant.",
		input: messages,
		text: { verbosity: options?.textVerbosity || "low" },
		include: ["reasoning.encrypted_content"],
		prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId)
	};
	if (options?.responseFormat !== void 0) body.text = {
		...body.text,
		format: resolveOpenAIResponsesTextFormat(options.responseFormat)
	};
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) body.temperature = options.temperature;
	if (options?.serviceTier !== void 0) body.service_tier = options.serviceTier;
	if (context.tools) {
		const tools = convertResponsesToolPayload(context.tools, { strict: false });
		if (tools.length > 0) {
			body.tools = tools;
			body.tool_choice = "auto";
			body.parallel_tool_calls = true;
		}
	}
	const effort = options?.reasoningEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, options.reasoningEffort).effort;
	if (effort !== void 0) body.reasoning = {
		effort,
		...effort === "none" ? {} : { summary: options?.reasoningSummary ?? "auto" }
	};
	return body;
}
function resolveCodexServiceTier(responseServiceTier, requestServiceTier) {
	if (responseServiceTier === "default" && (requestServiceTier === "flex" || requestServiceTier === "priority")) return requestServiceTier;
	return responseServiceTier ?? requestServiceTier;
}
/**
* Structured refusal code carried by the OpenAI Responses transport. Every
* terminal Responses path preserves it: a non-OK HTTP body parsed by
* {@link parseErrorResponse}, an SSE/WebSocket `error` event mapped by
* {@link mapCodexEvents}, and a `response.failed` event normalized into
* {@link ResponsesStreamFailure}. Only the app-server surface carries the
* `codexErrorInfo` discriminator, so both shapes must be read here.
*/
function readCodexProviderRefusal(error) {
	if (!(error instanceof ResponsesStreamFailure || error instanceof CodexApiError)) return;
	const payload = error instanceof CodexApiError ? error.payload : isRecord(error.response) ? error.response : void 0;
	const nested = isRecord(payload?.error) ? payload.error : void 0;
	const codexErrorInfo = payload?.codexErrorInfo ?? nested?.codexErrorInfo;
	if (error.code === "cyber_policy" || codexErrorInfo === "cyberPolicy") return { category: "cyber" };
	if (error.code === "misalignment_policy_violation" || codexErrorInfo === "misalignmentPolicyViolation") {
		const details = nested?.misalignment ?? payload?.misalignment;
		const review = readOpenAIMisalignmentReview(details, true);
		return {
			category: "misalignment",
			...review ? { review } : {}
		};
	}
	return (typeof payload?.message === "string" ? payload.message : typeof nested?.message === "string" ? nested.message : "").startsWith("This content was flagged for possible biological risk.") ? { category: "bio" } : void 0;
}
function isCodexNonTransportError(error) {
	return error instanceof CodexApiError || error instanceof CodexProtocolError || error instanceof ResponsesStreamFailure;
}
function isWebSocketConnectionLimitReachedError(error) {
	return error instanceof CodexApiError && error.code === WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE;
}
let cachedWebsocket = null;
function resetOpenAICodexWebSocketStateForTest() {
	cachedWebsocket = null;
}
function closeOpenAICodexWebSocketSessions(sessionId, owner) {
	if (owner) {
		closeOpenAICodexWebSocketState(owner, sessionId);
		return;
	}
	closeAllOpenAICodexWebSocketStates(sessionId);
}
registerSessionResourceCleanup(closeOpenAICodexWebSocketSessions);
async function getWebSocketConstructor() {
	if (cachedWebsocket) return cachedWebsocket;
	if (process?.versions?.bun && (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy)) {
		const getProxyForUrl = (await dynamicImport("proxy-from-env")).getProxyForUrl;
		cachedWebsocket = class extends WebSocket {
			constructor(url, options) {
				let opts;
				if (Array.isArray(options) || typeof options === "string") opts = { protocols: options };
				else opts = { ...options };
				const proxy = getProxyForUrl(url.toString().replace(/^wss:/, "https:").replace(/^ws:/, "http:"));
				super(url, {
					...opts,
					...proxy ? { proxy } : {}
				});
			}
		};
		return cachedWebsocket;
	}
	const ctor = globalThis.WebSocket;
	if (typeof ctor !== "function") return null;
	return ctor;
}
function createWebSocketTransportError(message, cause) {
	return Object.assign(new Error(message, cause ? { cause } : void 0), { code: extractErrorCodeOrErrno(cause) ?? WEBSOCKET_TRANSPORT_ERROR_CODE });
}
async function connectWebSocket(url, headers, signal) {
	const WebSocketCtor = await getWebSocketConstructor();
	if (!WebSocketCtor) throw new Error("WebSocket transport is not available in this runtime");
	const wsHeaders = headersToRecord(headers);
	delete wsHeaders["OpenAI-Beta"];
	return new Promise((resolve, reject) => {
		let settled = false;
		let socket;
		try {
			socket = new WebSocketCtor(url, { headers: wsHeaders });
		} catch (error) {
			reject(error instanceof Error ? error : new Error(String(error)));
			return;
		}
		const onOpen = () => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(socket);
		};
		const onError = (event) => {
			const error = extractWebSocketError(event);
			if (settled) return;
			settled = true;
			cleanup();
			reject(error);
		};
		const onClose = (event) => {
			const error = extractWebSocketCloseError(event);
			if (settled) return;
			settled = true;
			cleanup();
			reject(error);
		};
		const onAbort = () => {
			if (settled) return;
			settled = true;
			cleanup();
			socket.close(1e3, "aborted");
			reject(/* @__PURE__ */ new Error("Request was aborted"));
		};
		const cleanup = () => {
			socket.removeEventListener("open", onOpen);
			socket.removeEventListener("error", onError);
			socket.removeEventListener("close", onClose);
			signal?.removeEventListener("abort", onAbort);
		};
		if (signal?.aborted) {
			onAbort();
			return;
		}
		socket.addEventListener("open", onOpen);
		socket.addEventListener("error", onError);
		socket.addEventListener("close", onClose);
		signal?.addEventListener("abort", onAbort);
	});
}
async function acquireWebSocket(state, authority, sessionId, signal) {
	const { url, headers } = authority;
	const lease = (socket, entry) => ({
		socket,
		entry,
		release: ({ keep } = {}) => {
			if (!sessionId || !entry || !keep || !isWebSocketReusable(socket)) {
				closeWebSocketSilently(socket);
				if (entry?.idleTimer) clearTimeout(entry.idleTimer);
				if (sessionId && entry) deleteOwnedWebSocketSession(state, sessionId, entry);
				return;
			}
			entry.busy = false;
			scheduleSessionWebSocketExpiry(state, sessionId, entry);
		}
	});
	if (!sessionId) return lease(await connectWebSocket(url, headers, signal));
	const cached = state.sessionCache.get(sessionId);
	let expectedCacheValue = cached;
	if (cached) {
		if (cached.idleTimer) {
			clearTimeout(cached.idleTimer);
			cached.idleTimer = void 0;
		}
		if (!cached.busy && !matchesCodexWebSocketAuthority(cached.authority, authority)) {
			closeWebSocketSilently(cached.socket, 1e3, "authority_changed");
			deleteOwnedWebSocketSession(state, sessionId, cached);
			expectedCacheValue = void 0;
		} else if (!cached.busy && isWebSocketSessionExpired(cached)) {
			closeWebSocketSilently(cached.socket, 1e3, "connection_age_limit");
			deleteOwnedWebSocketSession(state, sessionId, cached);
			expectedCacheValue = void 0;
		} else if (!cached.busy && isWebSocketReusable(cached.socket)) {
			cached.busy = true;
			return lease(cached.socket, cached);
		}
		if (cached.busy) return lease(await connectWebSocket(url, headers, signal));
		if (!isWebSocketReusable(cached.socket)) {
			closeWebSocketSilently(cached.socket);
			deleteOwnedWebSocketSession(state, sessionId, cached);
			expectedCacheValue = void 0;
		}
	}
	const socket = await connectWebSocket(url, headers, signal);
	const entry = {
		socket,
		authority,
		busy: true,
		createdAt: Date.now()
	};
	return lease(socket, setOwnedWebSocketSession(state, sessionId, entry, expectedCacheValue) ? entry : void 0);
}
function extractWebSocketError(event) {
	if (event && typeof event === "object") {
		const message = "message" in event ? event.message : void 0;
		const nestedError = "error" in event ? event.error : void 0;
		const eventMessage = typeof message === "string" && message.length > 0 ? message : void 0;
		if (nestedError !== void 0) {
			const cause = toErrorObject(nestedError, eventMessage ?? "WebSocket error");
			return createWebSocketTransportError(eventMessage ?? (cause.message || "WebSocket error"), cause);
		}
		if (eventMessage) return createWebSocketTransportError(eventMessage);
	}
	return createWebSocketTransportError("WebSocket error");
}
function extractWebSocketCloseError(event) {
	if (event && typeof event === "object") {
		const code = "code" in event ? event.code : void 0;
		const reason = "reason" in event ? event.reason : void 0;
		const wasClean = "wasClean" in event ? event.wasClean : void 0;
		const codeText = typeof code === "number" ? ` ${code}` : "";
		let reasonText = typeof reason === "string" && reason.length > 0 ? ` ${reason}` : "";
		if (!reasonText && code === WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE) reasonText = " message too big";
		const message = `WebSocket closed${codeText}${reasonText}`;
		const error = typeof code === "number" && RETRYABLE_CLOSE_CODES.has(code) ? createWebSocketTransportError(message) : Object.assign(new Error(message), { code: WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE });
		return Object.assign(error, {
			name: "WebSocketCloseError",
			closeCode: typeof code === "number" ? code : void 0,
			reason: typeof reason === "string" && reason.length > 0 ? reason : void 0,
			wasClean: typeof wasClean === "boolean" ? wasClean : void 0
		});
	}
	return createWebSocketTransportError("WebSocket closed");
}
async function* parseWebSocket(socket, signal) {
	const queue = [];
	let pending = null;
	let done = false;
	let failed = null;
	let sawCompletion = false;
	const wake = () => {
		if (!pending) return;
		const resolve = pending;
		pending = null;
		resolve();
	};
	const onMessage = (event) => {
		const data = event && typeof event === "object" && "data" in event ? event.data : void 0;
		if (typeof data !== "string") {
			failed = new CodexProtocolError(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { payload: data });
			done = true;
			wake();
			return;
		}
		try {
			const parsed = JSON.parse(data);
			const type = typeof parsed.type === "string" ? parsed.type : "";
			if (type === "response.completed" || type === "response.done" || type === "response.incomplete") {
				sawCompletion = true;
				done = true;
			}
			queue.push(parsed);
			wake();
		} catch (cause) {
			failed = new CodexProtocolError(`Invalid Codex WebSocket JSON: ${formatThrownValue(cause)}`, {
				cause,
				payload: data
			});
			done = true;
			wake();
		}
	};
	const onError = (event) => {
		failed = extractWebSocketError(event);
		done = true;
		wake();
	};
	const onClose = (event) => {
		if (sawCompletion) {
			done = true;
			wake();
			return;
		}
		if (!failed) failed = extractWebSocketCloseError(event);
		done = true;
		wake();
	};
	const onAbort = () => {
		failed = /* @__PURE__ */ new Error("Request was aborted");
		done = true;
		wake();
	};
	socket.addEventListener("message", onMessage);
	socket.addEventListener("error", onError);
	socket.addEventListener("close", onClose);
	signal?.addEventListener("abort", onAbort);
	try {
		while (true) {
			if (signal?.aborted) throw transportAbortError(signal);
			const next = queue.shift();
			if (next !== void 0) {
				yield next;
				continue;
			}
			if (done) break;
			await new Promise((resolve) => {
				pending = resolve;
			});
		}
		if (failed) throw toErrorObject(failed, "Non-Error thrown");
		if (!sawCompletion) throw new Error("WebSocket stream closed before response.completed");
	} finally {
		socket.removeEventListener("message", onMessage);
		socket.removeEventListener("error", onError);
		socket.removeEventListener("close", onClose);
		signal?.removeEventListener("abort", onAbort);
	}
}
function requestBodyWithoutInput(body) {
	const { input: _input, previous_response_id: _previousResponseId, ...rest } = body;
	return rest;
}
function requestBodiesMatchExceptInput(a, b) {
	return JSON.stringify(requestBodyWithoutInput(a)) === JSON.stringify(requestBodyWithoutInput(b));
}
function getCachedWebSocketInputDelta(body, continuation) {
	if (!requestBodiesMatchExceptInput(body, continuation.lastRequestBody)) return;
	const currentInput = body.input ?? [];
	const baseline = [...continuation.lastRequestBody.input ?? [], ...continuation.lastResponseItems];
	if (currentInput.length < baseline.length) return;
	const prefix = currentInput.slice(0, baseline.length);
	if (JSON.stringify(prefix) !== JSON.stringify(baseline)) return;
	return currentInput.slice(baseline.length);
}
function buildCachedWebSocketRequestBody(entry, body) {
	const continuation = entry.continuation;
	if (!continuation) return body;
	const delta = getCachedWebSocketInputDelta(body, continuation);
	if (!delta || !continuation.lastResponseId) {
		entry.continuation = void 0;
		return body;
	}
	return {
		...body,
		previous_response_id: continuation.lastResponseId,
		input: delta
	};
}
async function* startWebSocketOutputOnFirstEvent(events, output, stream, onFirstProviderEvent, reportStreamOpened, onStart) {
	let started = false;
	for await (const event of events) {
		if (!started) {
			started = true;
			onFirstProviderEvent();
			onStart();
			await reportStreamOpened();
			stream.push({
				type: "start",
				partial: output
			});
		}
		yield event;
	}
}
async function processWebSocketStream(state, authority, body, output, stream, model, onFirstProviderEvent, onStart, options, abortFirstEventStream, observePromptEgress, payloadVariant = "initial", onRequestSent, activitySignal) {
	const { socket, entry, release } = await acquireWebSocket(state, authority, options?.sessionId, options?.signal);
	let keepConnection = true;
	const useCachedContext = options?.transport === "websocket-cached" || options?.transport === "auto";
	const fullBody = body;
	const requestBody = useCachedContext && entry ? buildCachedWebSocketRequestBody(entry, fullBody) : fullBody;
	try {
		if (options?.signal?.aborted) throw transportAbortError(options.signal);
		observePromptEgress?.(requestBody, {
			egress: "native-codex-websocket",
			payloadVariant
		});
		const lifecycle = responsesRequestLifecycle.get(options);
		if (lifecycle) {
			await lifecycle.beforeDispatch(options?.signal);
			options?.signal?.throwIfAborted();
			lifecycle.assertCurrent();
		}
		socket.send(JSON.stringify({
			type: "response.create",
			...requestBody
		}));
		onRequestSent?.(requestBody);
		const terminal = await processResponsesStream(startWebSocketOutputOnFirstEvent(mapCodexEvents(parseWebSocket(socket, options?.signal), void 0, options), output, stream, onFirstProviderEvent, () => notifyProviderStreamOpened({
			options,
			cancelStream: () => {
				keepConnection = false;
				closeWebSocketSilently(socket);
			}
		}), onStart), output, stream, model, {
			serviceTier: options?.serviceTier,
			firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
			abortFirstEventStream,
			onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
			signal: activitySignal ?? options?.signal,
			reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
				sessionId: options?.sessionId,
				authProfileId: options?.authProfileId
			}),
			resolveServiceTier: resolveCodexServiceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyResponsesServiceTierPricing(usage, serviceTier, model)
		});
		if (options?.signal?.aborted) keepConnection = false;
		else if (useCachedContext && entry && output.responseId) {
			const responseItems = convertProviderResponsesMessages(model, { messages: [output] }, CODEX_TOOL_CALL_PROVIDERS, {
				includeSystemPrompt: false,
				replayResponsesItemIds: false,
				sessionId: options?.sessionId,
				authProfileId: options?.authProfileId
			}).filter((item) => item.type !== "function_call_output");
			entry.continuation = {
				lastRequestBody: fullBody,
				lastResponseId: output.responseId,
				lastResponseItems: responseItems
			};
		}
		return terminal;
	} catch (error) {
		if (entry) entry.continuation = void 0;
		keepConnection = false;
		throw error;
	} finally {
		release({ keep: keepConnection });
	}
}
async function readChatGptResponsesErrorTextLimited(response, signal) {
	const reader = response.body?.getReader();
	if (!reader) return "";
	const decoder = new TextDecoder();
	let total = 0;
	let text = "";
	let reachedLimit = false;
	let completed = false;
	let cancelPromise;
	const cancel = () => {
		cancelPromise ??= reader.cancel(signal?.reason).catch(() => {});
		return cancelPromise;
	};
	const onAbort = () => {
		cancel();
	};
	if (signal?.aborted) onAbort();
	else signal?.addEventListener("abort", onAbort, { once: true });
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				completed = true;
				break;
			}
			if (!value || value.byteLength === 0) continue;
			const remaining = OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES - total;
			if (remaining <= 0) {
				reachedLimit = true;
				break;
			}
			const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
			total += chunk.byteLength;
			text += decoder.decode(chunk, { stream: true });
			if (total >= OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES) {
				reachedLimit = true;
				break;
			}
		}
		if (!reachedLimit) text += decoder.decode();
	} finally {
		signal?.removeEventListener("abort", onAbort);
		if (!completed) await cancel();
		try {
			reader.releaseLock();
		} catch {}
	}
	return text;
}
function parseErrorResponse(raw, response) {
	const { status, statusText } = response;
	let message = raw || statusText || "Request failed";
	let friendlyMessage;
	let code;
	let payload;
	try {
		const parsed = JSON.parse(raw);
		payload = isRecord(parsed) ? parsed : void 0;
		const err = parsed?.error;
		if (err) {
			code = err.code || err.type || void 0;
			if (/usage_limit_reached|usage_not_included|rate_limit_exceeded/i.test(code ?? "") || status === 429) {
				const plan = err.plan_type ? ` (${err.plan_type.toLowerCase()} plan)` : "";
				const mins = err.resets_at ? Math.max(0, Math.round((err.resets_at * 1e3 - Date.now()) / 6e4)) : void 0;
				friendlyMessage = `You have hit your ChatGPT usage limit${plan}.${mins !== void 0 ? ` Try again in ~${mins} min.` : ""}`.trim();
			}
			message = err.message || friendlyMessage || message;
		}
	} catch {}
	const retryAfterSeconds = parseRetryAfterHeadersSeconds(response.headers);
	const retryAfterSuffix = Number.isFinite(retryAfterSeconds) ? `; Retry-After: ${Math.ceil(retryAfterSeconds ?? 0)} seconds` : "";
	return new CodexApiError(`${friendlyMessage || message}${retryAfterSuffix}`, {
		code,
		status,
		payload
	});
}
function extractOpenAICodexAccountId(token) {
	const accountId = resolveOpenAICodexAccountId(token);
	if (accountId) return accountId;
	throw new Error("Failed to extract accountId from token");
}
function createCodexRequestId() {
	const crypto = globalThis.crypto;
	if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
	if (typeof crypto?.getRandomValues === "function") {
		const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
		return `codex_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
	}
	throw new Error("Secure random request id generation is unavailable");
}
function buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token) {
	const headers = new Headers(initHeaders);
	for (const [key, value] of Object.entries(additionalHeaders || {})) headers.set(key, value);
	headers.set("Authorization", `Bearer ${token}`);
	headers.set("chatgpt-account-id", accountId);
	headers.set("originator", "openclaw");
	const userAgent = os ? `openclaw (${os.platform()} ${os.release()}; ${os.arch()})` : "openclaw (browser)";
	headers.set("User-Agent", userAgent);
	return headers;
}
function buildSSEHeaders(initHeaders, additionalHeaders, accountId, token, sessionId) {
	const headers = buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token);
	headers.set("OpenAI-Beta", "responses=experimental");
	headers.set("accept", "text/event-stream");
	headers.set("content-type", "application/json");
	if (sessionId) {
		headers.set("session_id", sessionId);
		headers.set("x-client-request-id", sessionId);
	}
	return headers;
}
//#endregion
export { closeOpenAICodexWebSocketSessions, extractOpenAICodexAccountId, resetOpenAICodexWebSocketStateForTest, streamOpenAICodexResponses, streamSimpleOpenAICodexResponses };

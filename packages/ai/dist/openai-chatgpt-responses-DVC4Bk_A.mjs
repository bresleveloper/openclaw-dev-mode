import { n as getEnvApiKey } from "./env-api-keys-CtMlqaQ4.mjs";
import { i as formatThrownValue, n as createAssistantMessageDiagnostic, t as appendAssistantMessageDiagnostic } from "./diagnostics-COpOtRwq.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.mjs";
import { n as getAiTransportHost, r as resolveAiTransportHeaderSentinels } from "./host-4t713IeR.mjs";
import { t as headersToRecord } from "./headers-B_e4-1J0.mjs";
import { b as stripSystemPromptCacheBoundary, o as buildBaseOptions } from "./transform-messages-BhGF_fF4.mjs";
import { a as resolveResponsesReasoningEffort, i as processResponsesStream, n as convertResponsesMessages, s as convertResponsesToolPayload } from "./openai-responses-shared-sj2YUPYc.mjs";
import { i as getFirstStreamEventTimeoutMs, o as clampTimerTimeoutMs, r as getFirstStreamEventTimeoutHandler, s as resolveTimerTimeoutMs, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-RjWszj8c.mjs";
import { a as clampOpenAIPromptCacheKey } from "./openai-tool-projection-BknoV11q.mjs";
import { i as registerSessionResourceCleanup, n as resolveOpenAICodexAccountId } from "./openai-chatgpt-jwt-DhAAzLkj.mjs";
import { t as createSseByteGuard } from "./streaming-byte-guard-BrbkbwUu.mjs";
//#region packages/ai/src/providers/openai-chatgpt-responses.ts
const dynamicImport = (specifier) => import(specifier);
function loadNodeOs() {
	if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) return null;
	return process.getBuiltinModule?.("node:os") ?? null;
}
const os = loadNodeOs();
const DEFAULT_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1e3;
const REQUEST_COMPRESSION_ZSTD_LEVEL = 3;
const RETRY_AFTER_HTTP_DATE_RE = /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), \d{2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2} \d{2}:\d{2}:\d{2} GMT|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [ \d]\d \d{2}:\d{2}:\d{2} \d{4})$/;
const CODEX_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set(["openai", "opencode"]);
const WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE = 1009;
const WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE = "websocket_connection_limit_reached";
const OPENAI_CHATGPT_RESPONSES_ERROR_BODY_MAX_BYTES = 16 * 1024;
const OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES = 16 * 1024 * 1024;
const CODEX_RESPONSE_STATUSES = /* @__PURE__ */ new Set([
	"completed",
	"incomplete",
	"failed",
	"cancelled",
	"queued",
	"in_progress"
]);
function isRetryableError(status, errorText) {
	if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) return true;
	return /rate.?limit|overloaded|service.?unavailable|upstream.?connect|connection.?refused/i.test(errorText);
}
function sleep(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(/* @__PURE__ */ new Error("Request was aborted"));
			return;
		}
		const timeout = setTimeout(resolve, ms);
		signal?.addEventListener("abort", () => {
			clearTimeout(timeout);
			reject(/* @__PURE__ */ new Error("Request was aborted"));
		});
	});
}
function resolveRequestTimeoutMs(options) {
	const timeoutMs = options?.timeoutMs;
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : void 0;
}
function buildRequestSignal(baseSignal, timeoutMs) {
	if (timeoutMs === void 0) return baseSignal;
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	if (!baseSignal) return timeoutSignal;
	return AbortSignal.any([baseSignal, timeoutSignal]);
}
function isRequestTimeoutError(error, callerSignal, requestSignal, timeoutMs) {
	if (timeoutMs === void 0 || callerSignal?.aborted || !requestSignal?.aborted) return false;
	if (!(error instanceof Error)) return false;
	return error.name === "AbortError" || error.name === "TimeoutError" || error.message === "Request was aborted";
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
		let requestTimeoutMs;
		let requestTimeoutSignal;
		let activeSignal;
		let firstEventAbort;
		const output = {
			role: "assistant",
			content: [],
			api: "openai-chatgpt-responses",
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now()
		};
		try {
			const unresolvedApiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			if (!unresolvedApiKey) throw new Error(`No API key for provider: ${model.provider}`);
			const apiKey = getAiTransportHost().resolveSecretSentinel(unresolvedApiKey);
			const modelHeaders = resolveAiTransportHeaderSentinels(model.headers);
			const optionHeaders = resolveAiTransportHeaderSentinels(options?.headers);
			const accountId = extractOpenAICodexAccountId(apiKey);
			let body = buildRequestBody(model, context, options);
			const nextBody = await options?.onPayload?.(body, model);
			if (nextBody !== void 0) body = nextBody;
			const websocketRequestId = options?.sessionId || createCodexRequestId();
			const sseHeaders = buildSSEHeaders(modelHeaders, optionHeaders, accountId, apiKey, options?.sessionId);
			const websocketHeaders = buildWebSocketHeaders(modelHeaders, optionHeaders, accountId, apiKey, websocketRequestId);
			const bodyJson = JSON.stringify(body);
			requestTimeoutMs = resolveRequestTimeoutMs(options);
			requestTimeoutSignal = buildRequestSignal(options?.signal, requestTimeoutMs);
			firstEventAbort = createFirstStreamEventAbortController(requestTimeoutSignal);
			activeSignal = firstEventAbort.signal;
			const requestOptions = activeSignal === options?.signal ? options : {
				...options,
				signal: activeSignal
			};
			const transport = options?.transport || "auto";
			const websocketDisabledForSession = transport === "auto" && isWebSocketSseFallbackActive(options?.sessionId);
			if (websocketDisabledForSession) recordWebSocketSseFallback(options?.sessionId);
			if (transport !== "sse" && !websocketDisabledForSession) {
				let websocketStarted = false;
				let retriedWebSocketConnectionLimit = false;
				while (true) {
					websocketStarted = false;
					try {
						await processWebSocketStream(resolveCodexWebSocketUrl(model.baseUrl), body, websocketHeaders, output, stream, model, () => {
							websocketStarted = true;
						}, requestOptions, firstEventAbort.abort);
						if (activeSignal?.aborted) throw new Error("Request was aborted");
						stream.push({
							type: "done",
							reason: output.stopReason,
							message: output
						});
						stream.end();
						return;
					} catch (error) {
						const aborted = activeSignal?.aborted;
						const connectionLimitBeforeStart = !websocketStarted && isWebSocketConnectionLimitReachedError(error);
						if (!aborted && connectionLimitBeforeStart && !retriedWebSocketConnectionLimit) {
							retriedWebSocketConnectionLimit = true;
							continue;
						}
						if (aborted || isCodexNonTransportError(error) && !connectionLimitBeforeStart) throw error;
						appendAssistantMessageDiagnostic(output, createAssistantMessageDiagnostic("provider_transport_failure", error, {
							configuredTransport: transport,
							fallbackTransport: transport === "auto" && !websocketStarted ? "sse" : void 0,
							eventsEmitted: websocketStarted,
							phase: websocketStarted ? "after_message_stream_start" : "before_message_stream_start",
							requestBytes: new TextEncoder().encode(bodyJson).byteLength
						}));
						recordWebSocketFailure(options?.sessionId, error, { activateSseFallback: transport === "auto" });
						if (websocketStarted || transport !== "auto") throw error;
						recordWebSocketSseFallback(options?.sessionId);
						break;
					}
				}
			}
			const compressedBody = model.provider === "openai" && !sseHeaders.has("content-encoding") ? compressRequestBodyZstd(bodyJson) : null;
			if (compressedBody) sseHeaders.set("content-encoding", "zstd");
			const sseBody = compressedBody ?? bodyJson;
			let response;
			let lastError;
			for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
				if (activeSignal?.aborted) throw new Error("Request was aborted");
				try {
					response = await fetch(resolveCodexUrl(model.baseUrl), {
						method: "POST",
						headers: sseHeaders,
						body: sseBody,
						signal: activeSignal
					});
					await options?.onResponse?.({
						status: response.status,
						headers: headersToRecord(response.headers)
					}, model);
					if (response.ok) break;
					const errorText = await readChatGptResponsesErrorTextLimited(response);
					if (attempt < MAX_RETRIES && isRetryableError(response.status, errorText)) {
						let delayMs = BASE_DELAY_MS * 2 ** attempt;
						const retryAfterMs = response.headers.get("retry-after-ms");
						if (retryAfterMs !== null) {
							const trimmedRetryAfterMs = retryAfterMs.trim();
							const millis = Number(trimmedRetryAfterMs);
							if (/^\d+(?:\.\d+)?$/.test(trimmedRetryAfterMs) && Number.isFinite(millis)) delayMs = clampTimerTimeoutMs(millis, 0) ?? delayMs;
						} else {
							const retryAfter = response.headers.get("retry-after");
							if (retryAfter) {
								const trimmedRetryAfter = retryAfter.trim();
								const seconds = Number(trimmedRetryAfter);
								if (/^\d+$/.test(trimmedRetryAfter) && Number.isFinite(seconds)) delayMs = clampTimerTimeoutMs(seconds * 1e3, 0) ?? delayMs;
								else if (RETRY_AFTER_HTTP_DATE_RE.test(trimmedRetryAfter)) {
									const date = Date.parse(trimmedRetryAfter);
									if (!Number.isNaN(date)) delayMs = clampTimerTimeoutMs(date - Date.now(), 0) ?? delayMs;
								}
							}
						}
						await sleep(delayMs, activeSignal);
						continue;
					}
					const info = await parseErrorResponse(new Response(errorText, {
						status: response.status,
						statusText: response.statusText
					}));
					throw new Error(info.friendlyMessage || info.message);
				} catch (error) {
					if (error instanceof Error) {
						if (isRequestTimeoutError(error, options?.signal, requestTimeoutSignal, requestTimeoutMs) && requestTimeoutMs !== void 0) throw formatRequestTimeoutError(requestTimeoutMs, error);
						if (error.name === "AbortError" || error.message === "Request was aborted") throw new Error("Request was aborted", { cause: error });
						if (error.name === "TimeoutError" && requestTimeoutMs !== void 0) throw new Error(`Request timed out after ${requestTimeoutMs}ms`, { cause: error });
					}
					lastError = error instanceof Error ? error : new Error(String(error));
					if (attempt < MAX_RETRIES && !lastError.message.includes("usage limit")) {
						await sleep(BASE_DELAY_MS * 2 ** attempt, activeSignal);
						continue;
					}
					throw lastError;
				}
			}
			if (!response?.ok) throw lastError ?? /* @__PURE__ */ new Error("Failed after retries");
			if (!response.body) throw new Error("No response body");
			stream.push({
				type: "start",
				partial: output
			});
			await processStream(response, output, stream, model, options, firstEventAbort.abort);
			if (activeSignal?.aborted) throw new Error("Request was aborted");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			const normalizedError = isRequestTimeoutError(error, options?.signal, requestTimeoutSignal, requestTimeoutMs) && requestTimeoutMs !== void 0 ? formatRequestTimeoutError(requestTimeoutMs, error) : error;
			for (const block of output.content) delete block.partialJson;
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = normalizedError instanceof Error ? normalizedError.message : String(normalizedError);
			stream.push({
				type: "error",
				reason: output.stopReason,
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
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	return streamOpenAICodexResponses(model, context, {
		...base,
		reasoningEffort: resolveResponsesReasoningEffort(model, options?.reasoning)
	});
};
function buildRequestBody(model, context, options) {
	const messages = convertResponsesMessages(model, context, CODEX_TOOL_CALL_PROVIDERS, {
		includeSystemPrompt: false,
		replayResponsesItemIds: false
	});
	const body = {
		model: model.id,
		store: false,
		stream: true,
		instructions: stripSystemPromptCacheBoundary(context.systemPrompt ?? "") || "You are a helpful assistant.",
		input: messages,
		text: { verbosity: options?.textVerbosity || "low" },
		include: ["reasoning.encrypted_content"],
		prompt_cache_key: options?.cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId),
		tool_choice: "auto",
		parallel_tool_calls: true
	};
	if (options?.temperature !== void 0) body.temperature = options.temperature;
	if (options?.serviceTier !== void 0) body.service_tier = options.serviceTier;
	if (context.tools) {
		const converted = convertResponsesToolPayload(context.tools, { strict: null });
		if (converted.projection.inputToolCount > 0 || converted.projection.diagnostics.length > 0) {
			body.tools = converted.tools;
			if (body.tools.length === 0) {
				delete body.tools;
				delete body.tool_choice;
				delete body.parallel_tool_calls;
			}
		}
	}
	if (options?.reasoningEffort !== void 0) {
		const effort = options.reasoningEffort === "none" ? model.thinkingLevelMap?.off ?? "none" : model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
		if (effort !== null) body.reasoning = {
			effort,
			summary: options.reasoningSummary ?? "auto"
		};
	}
	return body;
}
function getServiceTierCostMultiplier(model, serviceTier) {
	switch (serviceTier) {
		case "flex": return .5;
		case "priority": return model.id === "gpt-5.5" ? 2.5 : 2;
		default: return 1;
	}
}
function applyServiceTierPricing(usage, serviceTier, model) {
	const multiplier = getServiceTierCostMultiplier(model, serviceTier);
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function resolveCodexServiceTier(responseServiceTier, requestServiceTier) {
	if (responseServiceTier === "default" && (requestServiceTier === "flex" || requestServiceTier === "priority")) return requestServiceTier;
	return responseServiceTier ?? requestServiceTier;
}
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
async function processStream(response, output, stream, model, options, abortFirstEventStream) {
	await processResponsesStream(mapCodexEvents(parseSSE(response)), output, stream, model, {
		serviceTier: options?.serviceTier,
		firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
		abortFirstEventStream,
		onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
		resolveServiceTier: resolveCodexServiceTier,
		applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
	});
}
var CodexApiError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "CodexApiError";
		this.code = options?.code;
		this.payload = options?.payload;
		this.cause = options?.cause;
	}
};
var CodexProtocolError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "CodexProtocolError";
		this.payload = options?.payload;
		this.cause = options?.cause;
	}
};
function isCodexNonTransportError(error) {
	return error instanceof CodexApiError || error instanceof CodexProtocolError;
}
function isWebSocketConnectionLimitReachedError(error) {
	return error instanceof CodexApiError && error.code === WEBSOCKET_CONNECTION_LIMIT_REACHED_CODE;
}
function extractCodexEventError(event) {
	const nested = event.error && typeof event.error === "object" ? event.error : void 0;
	return {
		code: typeof event.code === "string" ? event.code : typeof nested?.code === "string" ? nested.code : void 0,
		message: typeof event.message === "string" ? event.message : typeof nested?.message === "string" ? nested.message : void 0
	};
}
async function* mapCodexEvents(events) {
	for await (const event of events) {
		const type = typeof event.type === "string" ? event.type : void 0;
		if (!type) continue;
		if (type === "error") {
			const { code, message } = extractCodexEventError(event);
			throw new CodexApiError(`Codex error: ${message || code || JSON.stringify(event)}`, {
				code,
				payload: event
			});
		}
		if (type === "response.failed") {
			const response = event.response;
			const code = response?.error?.code;
			const message = response?.error?.message;
			throw new CodexApiError(message || "Codex response failed", {
				code,
				payload: event
			});
		}
		if (type === "response.done" || type === "response.completed" || type === "response.incomplete") {
			const response = event.response;
			const normalizedResponse = response ? {
				...response,
				status: normalizeCodexStatus(response.status)
			} : response;
			yield {
				...event,
				type: "response.completed",
				response: normalizedResponse
			};
			return;
		}
		yield event;
	}
}
function normalizeCodexStatus(status) {
	if (typeof status !== "string") return;
	return CODEX_RESPONSE_STATUSES.has(status) ? status : void 0;
}
async function* parseSSE(response) {
	if (!response.body) return;
	const reader = response.body.getReader();
	const guard = createSseByteGuard(reader, {
		maxBytes: OPENAI_CHATGPT_RESPONSES_SUCCESS_BODY_MAX_BYTES,
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`OpenAI ChatGPT Responses success body exceeded ${maxBytes} bytes (received ${size})`)
	});
	const decoder = new TextDecoder();
	let buffer = "";
	try {
		while (true) {
			const { done, value } = await guard.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			let idx = buffer.indexOf("\n\n");
			while (idx !== -1) {
				const chunk = buffer.slice(0, idx);
				buffer = buffer.slice(idx + 2);
				const dataLines = chunk.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim());
				if (dataLines.length > 0) {
					const data = dataLines.join("\n").trim();
					if (data && data !== "[DONE]") try {
						yield JSON.parse(data);
					} catch (cause) {
						throw new CodexProtocolError(`Invalid Codex SSE JSON: ${formatThrownValue(cause)}`, {
							cause,
							payload: data
						});
					}
				}
				idx = buffer.indexOf("\n\n");
			}
		}
	} finally {
		try {
			await guard.cancel();
		} catch {}
		try {
			reader.releaseLock();
		} catch {}
	}
}
const parseSSEForTest = parseSSE;
const OPENAI_BETA_RESPONSES_WEBSOCKETS = "responses_websockets=2026-02-06";
const SESSION_WEBSOCKET_CACHE_TTL_MS = 300 * 1e3;
const SESSION_WEBSOCKET_MAX_AGE_MS = 3300 * 1e3;
const websocketSessionCache = /* @__PURE__ */ new Map();
const websocketDebugStats = /* @__PURE__ */ new Map();
const websocketSseFallbackSessions = /* @__PURE__ */ new Set();
let cachedWebsocket = null;
function getOrCreateWebSocketDebugStats(sessionId) {
	let stats = websocketDebugStats.get(sessionId);
	if (!stats) {
		stats = {
			requests: 0,
			connectionsCreated: 0,
			connectionsReused: 0,
			cachedContextRequests: 0,
			storeTrueRequests: 0,
			fullContextRequests: 0,
			deltaRequests: 0,
			lastInputItems: 0,
			websocketFailures: 0,
			sseFallbacks: 0
		};
		websocketDebugStats.set(sessionId, stats);
	}
	return stats;
}
function resetOpenAICodexWebSocketDebugStats(sessionId) {
	cachedWebsocket = null;
	if (sessionId) {
		websocketDebugStats.delete(sessionId);
		websocketSseFallbackSessions.delete(sessionId);
		return;
	}
	websocketDebugStats.clear();
	websocketSseFallbackSessions.clear();
}
function closeOpenAICodexWebSocketSessions(sessionId) {
	const closeEntry = (entry) => {
		if (entry.idleTimer) clearTimeout(entry.idleTimer);
		closeWebSocketSilently(entry.socket, 1e3, "debug_close");
	};
	if (sessionId) {
		const entry = websocketSessionCache.get(sessionId);
		if (entry) closeEntry(entry);
		websocketSessionCache.delete(sessionId);
		return;
	}
	for (const entry of websocketSessionCache.values()) closeEntry(entry);
	websocketSessionCache.clear();
}
registerSessionResourceCleanup(closeOpenAICodexWebSocketSessions);
function isWebSocketSseFallbackActive(sessionId) {
	return sessionId ? websocketSseFallbackSessions.has(sessionId) : false;
}
function recordWebSocketSseFallback(sessionId) {
	if (!sessionId) return;
	const stats = getOrCreateWebSocketDebugStats(sessionId);
	stats.sseFallbacks++;
	stats.websocketFallbackActive = isWebSocketSseFallbackActive(sessionId);
}
function recordWebSocketFailure(sessionId, error, options) {
	if (!sessionId) return;
	if (options.activateSseFallback) websocketSseFallbackSessions.add(sessionId);
	const stats = getOrCreateWebSocketDebugStats(sessionId);
	stats.websocketFailures++;
	stats.lastWebSocketError = formatThrownValue(error);
	stats.websocketFallbackActive = isWebSocketSseFallbackActive(sessionId);
}
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
var WebSocketCloseError = class extends Error {
	constructor(message, options) {
		super(message);
		this.name = "WebSocketCloseError";
		this.code = options?.code;
		this.reason = options?.reason;
		this.wasClean = options?.wasClean;
	}
};
function getWebSocketReadyState(socket) {
	const readyState = socket.readyState;
	return typeof readyState === "number" ? readyState : void 0;
}
function isWebSocketReusable(socket) {
	const readyState = getWebSocketReadyState(socket);
	return readyState === void 0 || readyState === 1;
}
function isWebSocketSessionExpired(entry) {
	return Date.now() - entry.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
}
function closeWebSocketSilently(socket, code = 1e3, reason = "done") {
	try {
		socket.close(code, reason);
	} catch {}
}
function scheduleSessionWebSocketExpiry(sessionId, entry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(() => {
		if (entry.busy) return;
		closeWebSocketSilently(entry.socket, 1e3, "idle_timeout");
		websocketSessionCache.delete(sessionId);
	}, SESSION_WEBSOCKET_CACHE_TTL_MS);
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
async function acquireWebSocket(url, headers, sessionId, signal) {
	if (!sessionId) {
		const socket = await connectWebSocket(url, headers, signal);
		return {
			socket,
			reused: false,
			release: ({ keep } = {}) => {
				if (keep === false) {
					closeWebSocketSilently(socket);
					return;
				}
				closeWebSocketSilently(socket);
			}
		};
	}
	const cached = websocketSessionCache.get(sessionId);
	if (cached) {
		if (cached.idleTimer) {
			clearTimeout(cached.idleTimer);
			cached.idleTimer = void 0;
		}
		if (!cached.busy && isWebSocketSessionExpired(cached)) {
			closeWebSocketSilently(cached.socket, 1e3, "connection_age_limit");
			websocketSessionCache.delete(sessionId);
		} else if (!cached.busy && isWebSocketReusable(cached.socket)) {
			cached.busy = true;
			return {
				socket: cached.socket,
				entry: cached,
				reused: true,
				release: ({ keep } = {}) => {
					if (!keep || !isWebSocketReusable(cached.socket)) {
						closeWebSocketSilently(cached.socket);
						websocketSessionCache.delete(sessionId);
						return;
					}
					cached.busy = false;
					scheduleSessionWebSocketExpiry(sessionId, cached);
				}
			};
		}
		if (cached.busy) {
			const socket = await connectWebSocket(url, headers, signal);
			return {
				socket,
				reused: false,
				release: () => {
					closeWebSocketSilently(socket);
				}
			};
		}
		if (!isWebSocketReusable(cached.socket)) {
			closeWebSocketSilently(cached.socket);
			websocketSessionCache.delete(sessionId);
		}
	}
	const socket = await connectWebSocket(url, headers, signal);
	const entry = {
		socket,
		busy: true,
		createdAt: Date.now()
	};
	websocketSessionCache.set(sessionId, entry);
	return {
		socket,
		entry,
		reused: false,
		release: ({ keep } = {}) => {
			if (!keep || !isWebSocketReusable(entry.socket)) {
				closeWebSocketSilently(entry.socket);
				if (entry.idleTimer) clearTimeout(entry.idleTimer);
				if (websocketSessionCache.get(sessionId) === entry) websocketSessionCache.delete(sessionId);
				return;
			}
			entry.busy = false;
			scheduleSessionWebSocketExpiry(sessionId, entry);
		}
	};
}
function extractWebSocketError(event) {
	if (event && typeof event === "object") {
		const message = "message" in event ? event.message : void 0;
		if (typeof message === "string" && message.length > 0) return new Error(message);
		const nestedError = "error" in event ? event.error : void 0;
		if (nestedError instanceof Error && nestedError.message.length > 0) return nestedError;
		if (nestedError && typeof nestedError === "object" && "message" in nestedError) {
			const nestedMessage = nestedError.message;
			if (typeof nestedMessage === "string" && nestedMessage.length > 0) return new Error(nestedMessage);
		}
	}
	return /* @__PURE__ */ new Error("WebSocket error");
}
function extractWebSocketCloseError(event) {
	if (event && typeof event === "object") {
		const code = "code" in event ? event.code : void 0;
		const reason = "reason" in event ? event.reason : void 0;
		const wasClean = "wasClean" in event ? event.wasClean : void 0;
		const codeText = typeof code === "number" ? ` ${code}` : "";
		let reasonText = typeof reason === "string" && reason.length > 0 ? ` ${reason}` : "";
		if (!reasonText && code === WEBSOCKET_MESSAGE_TOO_BIG_CLOSE_CODE) reasonText = " message too big";
		return new WebSocketCloseError(`WebSocket closed${codeText}${reasonText}`.trim(), {
			code: typeof code === "number" ? code : void 0,
			reason: typeof reason === "string" && reason.length > 0 ? reason : void 0,
			wasClean: typeof wasClean === "boolean" ? wasClean : void 0
		});
	}
	return /* @__PURE__ */ new Error("WebSocket closed");
}
async function decodeWebSocketData(data) {
	if (typeof data === "string") return data;
	if (data instanceof ArrayBuffer) return new TextDecoder().decode(new Uint8Array(data));
	if (ArrayBuffer.isView(data)) {
		const view = data;
		return new TextDecoder().decode(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
	}
	if (data && typeof data === "object" && "arrayBuffer" in data) {
		const arrayBuffer = await data.arrayBuffer();
		return new TextDecoder().decode(new Uint8Array(arrayBuffer));
	}
	return null;
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
		(async () => {
			let text = null;
			try {
				if (!event || typeof event !== "object" || !("data" in event)) return;
				text = await decodeWebSocketData(event.data);
				if (!text) return;
				const parsed = JSON.parse(text);
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
					payload: text
				});
				done = true;
				wake();
			}
		})();
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
			if (signal?.aborted) throw new Error("Request was aborted");
			if (queue.length > 0) {
				yield queue.shift();
				continue;
			}
			if (done) break;
			await new Promise((resolve) => {
				pending = resolve;
			});
		}
		if (failed) throw toLintErrorObject(failed, "Non-Error thrown");
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
function responseInputsEqual(a, b) {
	return JSON.stringify(a ?? []) === JSON.stringify(b ?? []);
}
function requestBodiesMatchExceptInput(a, b) {
	return JSON.stringify(requestBodyWithoutInput(a)) === JSON.stringify(requestBodyWithoutInput(b));
}
function getCachedWebSocketInputDelta(body, continuation) {
	if (!requestBodiesMatchExceptInput(body, continuation.lastRequestBody)) return;
	const currentInput = body.input ?? [];
	const baseline = [...continuation.lastRequestBody.input ?? [], ...continuation.lastResponseItems];
	if (currentInput.length < baseline.length) return;
	if (!responseInputsEqual(currentInput.slice(0, baseline.length), baseline)) return;
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
async function* startWebSocketOutputOnFirstEvent(events, output, stream, onStart) {
	let started = false;
	for await (const event of events) {
		if (!started) {
			started = true;
			onStart();
			stream.push({
				type: "start",
				partial: output
			});
		}
		yield event;
	}
}
async function processWebSocketStream(url, body, headers, output, stream, model, onStart, options, abortFirstEventStream) {
	const { socket, entry, reused, release } = await acquireWebSocket(url, headers, options?.sessionId, options?.signal);
	let keepConnection = true;
	const useCachedContext = options?.transport === "websocket-cached" || options?.transport === "auto";
	const fullBody = body;
	const requestBody = useCachedContext && entry ? buildCachedWebSocketRequestBody(entry, fullBody) : fullBody;
	const stats = options?.sessionId ? getOrCreateWebSocketDebugStats(options.sessionId) : void 0;
	if (stats) {
		stats.requests++;
		if (reused) stats.connectionsReused++;
		else stats.connectionsCreated++;
		if (useCachedContext) stats.cachedContextRequests++;
		if (requestBody.store === true) stats.storeTrueRequests++;
		stats.lastInputItems = requestBody.input?.length ?? 0;
		if (requestBody.previous_response_id) {
			stats.deltaRequests++;
			stats.lastDeltaInputItems = requestBody.input?.length ?? 0;
			stats.lastPreviousResponseId = requestBody.previous_response_id;
		} else {
			stats.fullContextRequests++;
			stats.lastDeltaInputItems = void 0;
			stats.lastPreviousResponseId = void 0;
		}
	}
	try {
		if (options?.signal?.aborted) throw new Error("Request was aborted");
		socket.send(JSON.stringify({
			type: "response.create",
			...requestBody
		}));
		await processResponsesStream(startWebSocketOutputOnFirstEvent(mapCodexEvents(parseWebSocket(socket, options?.signal)), output, stream, onStart), output, stream, model, {
			serviceTier: options?.serviceTier,
			firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
			abortFirstEventStream,
			onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
			resolveServiceTier: resolveCodexServiceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
		});
		if (options?.signal?.aborted) keepConnection = false;
		else if (useCachedContext && entry && output.responseId) {
			const responseItems = convertResponsesMessages(model, { messages: [output] }, CODEX_TOOL_CALL_PROVIDERS, {
				includeSystemPrompt: false,
				replayResponsesItemIds: false
			}).filter((item) => item.type !== "function_call_output");
			entry.continuation = {
				lastRequestBody: fullBody,
				lastResponseId: output.responseId,
				lastResponseItems: responseItems
			};
		}
	} catch (error) {
		if (entry) entry.continuation = void 0;
		keepConnection = false;
		throw error;
	} finally {
		release({ keep: keepConnection });
	}
}
async function readChatGptResponsesErrorTextLimited(response) {
	const reader = response.body?.getReader();
	if (!reader) return "";
	const decoder = new TextDecoder();
	let total = 0;
	let text = "";
	let reachedLimit = false;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
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
		text += decoder.decode();
	} finally {
		if (reachedLimit) await reader.cancel().catch(() => {});
		try {
			reader.releaseLock();
		} catch {}
	}
	return text;
}
async function parseErrorResponse(response) {
	const raw = await readChatGptResponsesErrorTextLimited(response);
	let message = raw || response.statusText || "Request failed";
	let friendlyMessage;
	try {
		const err = JSON.parse(raw)?.error;
		if (err) {
			const code = err.code || err.type || "";
			if (/usage_limit_reached|usage_not_included|rate_limit_exceeded/i.test(code) || response.status === 429) {
				const plan = err.plan_type ? ` (${err.plan_type.toLowerCase()} plan)` : "";
				const mins = err.resets_at ? Math.max(0, Math.round((err.resets_at * 1e3 - Date.now()) / 6e4)) : void 0;
				friendlyMessage = `You have hit your ChatGPT usage limit${plan}.${mins !== void 0 ? ` Try again in ~${mins} min.` : ""}`.trim();
			}
			message = err.message || friendlyMessage || message;
		}
	} catch {}
	return {
		message,
		friendlyMessage
	};
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
function buildWebSocketHeaders(initHeaders, additionalHeaders, accountId, token, requestId) {
	const headers = buildBaseCodexHeaders(initHeaders, additionalHeaders, accountId, token);
	headers.delete("accept");
	headers.delete("content-type");
	headers.delete("OpenAI-Beta");
	headers.delete("openai-beta");
	headers.set("OpenAI-Beta", OPENAI_BETA_RESPONSES_WEBSOCKETS);
	headers.set("x-client-request-id", requestId);
	headers.set("session_id", requestId);
	return headers;
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { closeOpenAICodexWebSocketSessions, extractOpenAICodexAccountId, parseSSEForTest, resetOpenAICodexWebSocketDebugStats, streamOpenAICodexResponses, streamSimpleOpenAICodexResponses };

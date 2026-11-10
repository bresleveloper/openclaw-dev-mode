import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange, p as clampPositiveTimerTimeoutMs, x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { i as redactSecrets, u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { d as normalizeMimeType, n as detectMime, t as FILE_TYPE_SNIFF_MAX_BYTES } from "./mime-C3j3dfQb.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import { a as containsSecretSentinel, d as swapSecretSentinelsInText, l as resolveSecretSentinel, n as SECRET_SENTINEL_PATTERN } from "./sentinel-DZP_CK2t.mjs";
import { _ as summarizeProviderTransportError, g as readResponseTextLimited, t as ProviderHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { a as resolveProviderRequestCapabilities } from "./provider-attribution-Dr21G8q1.mjs";
import { a as getModelProviderRequestRouteFacts, c as mergeModelProviderRequestOverrides, f as resolveProviderRequestPolicyConfig, i as buildProviderRequestDispatcherPolicy, o as getModelProviderRequestTransport } from "./provider-request-config-WdycwKIG.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5Nd20RhP.mjs";
import { d as wrapGuardedBodyStream, i as fetchWithSsrFGuard, s as withTrustedEnvProxyGuardedFetchMode } from "./fetch-guard-DRapCKeS.mjs";
import { a as resolveDebugProxySettings } from "./env-ZuG6CRvK.mjs";
import { n as withModelProviderNetworkRemediation, t as resolveProviderTransportSsrFPolicy } from "./provider-network-policy-DGvgCdvN.mjs";
import { a as isRetryableProviderHttpStatus } from "./retry-evidence-BSh9bhDe.mjs";
import { r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-CQZW-nmd.mjs";
import { r as ensureModelProviderLocalService } from "./provider-local-service-Cze7fsuy.mjs";
import { n as getProviderTransportDispatcherPool } from "./provider-transport-dispatcher-pool-Bcu7OUIW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { configureProviderErrorRedactor, emitModelTransportDebug, emitModelTransportError, formatModelTransportDebugUrl } from "@openclaw/ai/diagnostics";
import { parseRetryAfterHeadersSeconds } from "@openclaw/ai/internal/retry-after";
import { configureAiTransportHost } from "@openclaw/ai";
import { encodedModelRequestBodyStream } from "@openclaw/ai/internal/openai";
//#region src/agents/openai-strict-tool-setting.ts
/**
* Strict tool-schema default resolution for native OpenAI-compatible routes.
*
* Compatible providers can support strict schemas without inheriting OpenAI's required default.
*/
function resolvesToNativeOpenAIStrictTools(model, transport) {
	const capabilities = getModelProviderRequestRouteFacts(model)?.capabilities ?? resolveProviderRequestCapabilities({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		capability: "llm",
		transport,
		modelId: readStringValue(model.id),
		compat: model.compat
	});
	if (!capabilities.usesKnownNativeOpenAIRoute) return false;
	return capabilities.provider === "openai" || capabilities.provider === "azure-openai" || capabilities.provider === "azure-openai-responses";
}
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
function resolveOpenAIStrictToolSetting(model, options) {
	if (resolvesToNativeOpenAIStrictTools(model, options?.transport ?? "stream")) return true;
	if (options?.supportsStrictMode) return false;
}
//#endregion
//#region src/llm/model-transport-context.ts
const modelTransportContext = new AsyncLocalStorage();
function withModelTransportContext(context, run) {
	return modelTransportContext.run(context, run);
}
function formatModelTransportContext() {
	const context = modelTransportContext.getStore();
	return context ? ` sessionKey=${JSON.stringify(context.sessionKey ?? "unknown")} runId=${JSON.stringify(context.runId ?? "unknown")} requestId=${JSON.stringify(context.requestId)} requestNumber=${context.requestId.slice(context.requestId.lastIndexOf(":") + 1)}` : "";
}
//#endregion
//#region src/agents/provider-transport-request-body.ts
function requestBodyHasStreamTrue(request, init) {
	const method = request?.method ?? init?.method;
	if (method && method.toUpperCase() !== "POST") return false;
	const contentType = (request?.headers ?? new Headers(init?.headers)).get("content-type") ?? "";
	if (contentType && !/\bapplication\/json\b/i.test(contentType)) return false;
	const preparedStream = encodedModelRequestBodyStream(init?.body);
	if (preparedStream !== void 0) return preparedStream;
	if (typeof init?.body !== "string" || !init.body) return false;
	try {
		return JSON.parse(init.body).stream === true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/agents/provider-transport-secret-egress.ts
function headersContainSecretSentinel(headers) {
	if (!headers) return false;
	const normalized = headers instanceof Headers && headers[Symbol.iterator] === Headers.prototype.entries ? headers : new Headers(headers);
	for (const value of Headers.prototype.values.call(normalized)) if (containsSecretSentinel(value)) return true;
	return false;
}
function swapSecretSentinelsInUrl(url) {
	if (!containsSecretSentinel(url)) return {
		text: url,
		unknown: []
	};
	const unknown = /* @__PURE__ */ new Set();
	return {
		text: url.replace(new RegExp(SECRET_SENTINEL_PATTERN.source, "g"), (sentinel) => {
			const value = resolveSecretSentinel(sentinel);
			if (value === void 0) {
				unknown.add(sentinel);
				return sentinel;
			}
			return encodeURIComponent(value);
		}),
		unknown: [...unknown]
	};
}
function swapSecretSentinelsForEgress(params) {
	if (!containsSecretSentinel(params.url) && !headersContainSecretSentinel(params.headers)) return { url: params.url };
	const urlSwap = swapSecretSentinelsInUrl(params.url);
	const headers = params.headers ? new Headers(params.headers) : void 0;
	const unknown = new Set(urlSwap.unknown);
	if (headers) for (const [name, value] of headers.entries()) {
		const swapped = swapSecretSentinelsInText(value);
		headers.set(name, swapped.text);
		for (const sentinel of swapped.unknown) unknown.add(sentinel);
	}
	const unresolved = unknown.values().next().value;
	if (unresolved) throw new Error(`Secret sentinel ${unresolved} is not registered in this process; refusing to send request`);
	return {
		url: urlSwap.text,
		...headers ? { headers } : {}
	};
}
//#endregion
//#region src/agents/provider-transport-sse.ts
/** Max bytes for an entire JSON body synthesized into SSE frames. Prevents OOM
*  when a hostile streaming endpoint returns a never-ending JSON response
*  without Content-Length. */
const SSE_SYNTHESIZE_JSON_MAX_BYTES = 16777216;
/** Max bytes read from a non-OK response body before truncation. */
const SSE_NONOK_BODY_MAX_BYTES = 65536;
/** Max decoded characters buffered while waiting for the next SSE event boundary. */
const SSE_SANITIZE_BUFFER_MAX_CHARS = 16777216;
function hasReadableSseData(block) {
	return block.split(/\r\n|\n|\r/).some((line) => line.startsWith("data:") && line.slice(5).trim().length > 0);
}
function findSseEventBoundary(buffer, startIndex = 0) {
	const delimiter = /\r\n\r\n|\n\n|\r\r/g;
	delimiter.lastIndex = startIndex;
	const match = delimiter.exec(buffer);
	return match ? {
		index: match.index,
		length: match[0].length
	} : void 0;
}
async function cancelReaderBestEffort(reader, reason) {
	await reader.cancel(reason).catch(() => void 0);
}
function capNonOkResponseBodyLazily(response, maxBytes) {
	const source = response.body;
	if (!source) return response;
	const reader = source.getReader();
	let total = 0;
	const capped = new ReadableStream({
		async pull(controller) {
			try {
				const chunk = await reader.read();
				if (chunk.done) {
					controller.close();
					return;
				}
				const remaining = maxBytes - total;
				if (chunk.value.byteLength > remaining) {
					if (remaining > 0) controller.enqueue(chunk.value.subarray(0, remaining));
					total = maxBytes;
					controller.close();
					cancelReaderBestEffort(reader);
					return;
				}
				total += chunk.value.byteLength;
				controller.enqueue(chunk.value);
			} catch (error) {
				controller.error(error);
				cancelReaderBestEffort(reader, error);
			}
		},
		async cancel(reason) {
			await cancelReaderBestEffort(reader, reason);
		}
	});
	return new Response(capped, response);
}
function prepareOpenAISdkSseResponse(response, options) {
	const contentType = response.headers.get("content-type") ?? "";
	if (!response.body) return response;
	if (!response.ok) return options.sanitize ? capNonOkResponseBodyLazily(response, SSE_NONOK_BODY_MAX_BYTES) : response;
	const synthesizeJson = options.sanitize && options.synthesizeJsonAsSse && isProviderJsonContentType(contentType);
	const isSse = /\btext\/event-stream\b/i.test(contentType);
	if (!synthesizeJson && !(isSse && (options.sanitize || options.onSseComment))) return response;
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	const reader = response.body.getReader();
	let buffer = "";
	let scanOffset = 0;
	let totalBytes = 0;
	let commentLine;
	const enqueueSanitized = (controller) => {
		for (;;) {
			const boundary = findSseEventBoundary(buffer, scanOffset);
			if (!boundary) {
				scanOffset = Math.max(0, buffer.length - 3);
				if (buffer.length > SSE_SANITIZE_BUFFER_MAX_CHARS) throw new Error(`SSE response exceeded max buffer size (${SSE_SANITIZE_BUFFER_MAX_CHARS} chars) without event boundary`);
				return false;
			}
			const block = buffer.slice(0, boundary.index + boundary.length);
			buffer = buffer.slice(boundary.index + boundary.length);
			scanOffset = 0;
			if (hasReadableSseData(block)) {
				controller.enqueue(encoder.encode(block));
				return true;
			}
		}
	};
	const body = new ReadableStream({
		async pull(controller) {
			try {
				for (;;) {
					if (!synthesizeJson && options.sanitize && enqueueSanitized(controller)) return;
					const chunk = await reader.read();
					if (chunk.done) {
						buffer += decoder.decode();
						if (synthesizeJson) {
							const data = buffer.trim();
							if (data) controller.enqueue(encoder.encode(`data: ${data}\n\n`));
							controller.enqueue(encoder.encode("data: [DONE]\n\n"));
						} else if (options.sanitize && hasReadableSseData(buffer)) controller.enqueue(encoder.encode(buffer));
						buffer = "";
						controller.close();
						return;
					}
					if (synthesizeJson) {
						totalBytes += chunk.value.byteLength;
						if (totalBytes > SSE_SYNTHESIZE_JSON_MAX_BYTES) throw new Error(`Streaming JSON body exceeded ${SSE_SYNTHESIZE_JSON_MAX_BYTES} bytes while synthesizing SSE frames`);
					}
					const text = decoder.decode(chunk.value, { stream: true });
					if (isSse && options.onSseComment) for (const char of text) if (char === "\n" || char === "\r") {
						if (commentLine) options.onSseComment();
						commentLine = void 0;
					} else commentLine ??= char === ":";
					if (!options.sanitize) {
						controller.enqueue(chunk.value);
						return;
					}
					buffer += text;
				}
			} catch (error) {
				cancelReaderBestEffort(reader, error);
				controller.error(error);
			}
		},
		async cancel(reason) {
			await cancelReaderBestEffort(reader, reason);
		}
	});
	const prepared = new Response(body, response);
	if (synthesizeJson) prepared.headers.set("content-type", "text/event-stream; charset=utf-8");
	return prepared;
}
function isProviderJsonContentType(contentType) {
	return /\bapplication\/json\b/i.test(contentType) || /\+json\b/i.test(contentType);
}
//#endregion
//#region src/agents/provider-transport-fetch.ts
const DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS = 60;
const OPENAI_SDK_STREAM_CONTENT_SNIFF_BYTES = 2048;
const log = createSubsystemLogger("provider-transport-fetch");
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
function shouldSanitizeOpenAISdkSseResponse(model) {
	return model.provider !== "openai" || URL.parse(model.baseUrl)?.hostname.toLowerCase() !== "api.openai.com";
}
function classifyOpenAISdkStreamBodyPrefix(text) {
	const trimmed = text.replace(/^\uFEFF/u, "").trimStart();
	if (!trimmed) return "unknown";
	if (trimmed.startsWith("<")) return "html";
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
	if (/^(?::|(?:data|event|id|retry)(?::|\r?\n|\r))/u.test(trimmed)) return "sse";
	const boundary = findSseEventBoundary(text);
	if (boundary && hasReadableSseData(text.slice(0, boundary.index))) return "sse";
	return "unknown";
}
async function classifyOpenAISdkStreamBody(response) {
	const reader = response.clone().body?.getReader();
	if (!reader) return "unknown";
	const decoder = new TextDecoder();
	let total = 0;
	let text = "";
	try {
		while (total < OPENAI_SDK_STREAM_CONTENT_SNIFF_BYTES) {
			const { value, done } = await reader.read();
			if (done) break;
			if (!value || value.byteLength === 0) continue;
			const remaining = OPENAI_SDK_STREAM_CONTENT_SNIFF_BYTES - total;
			const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
			total += chunk.byteLength;
			text += decoder.decode(chunk, { stream: true });
			const kind = classifyOpenAISdkStreamBodyPrefix(text);
			if (kind !== "unknown") return kind;
		}
		text += decoder.decode();
		return classifyOpenAISdkStreamBodyPrefix(text);
	} finally {
		cancelReaderBestEffort(reader);
	}
}
function withOpenAISdkStreamContentType(response, contentType) {
	const normalized = new Response(response.body, response);
	normalized.headers.set("content-type", contentType);
	return normalized;
}
async function normalizeOpenAISdkStreamContentType(params) {
	const contentType = params.response.headers.get("content-type") ?? "";
	if (!params.response.ok || !params.response.body) return params.response;
	if (/\btext\/event-stream\b/i.test(contentType)) return params.response;
	const isJson = isProviderJsonContentType(contentType);
	if (isJson || !contentType.trim()) {
		const kind = await classifyOpenAISdkStreamBody(params.response).catch(() => "unknown");
		if (kind === "sse") return withOpenAISdkStreamContentType(params.response, "text/event-stream; charset=utf-8");
		if (isJson) return params.response;
		if (kind === "json") return withOpenAISdkStreamContentType(params.response, "application/json; charset=utf-8");
	}
	const body = await readResponseTextLimited(params.response).catch(() => "");
	await params.release().catch(() => void 0);
	params.localServiceLease?.release();
	const hint = `OpenAI-compatible streamed responses must be text/event-stream or JSON; got ${contentType || "missing content-type"}. Check the provider baseUrl; OpenAI-compatible APIs commonly require a /v1 path prefix.`;
	throw new ProviderHttpError(`${params.model.provider}/${params.model.id}: ${hint}`, {
		status: params.response.status,
		code: "invalid_provider_content_type",
		type: "invalid_response",
		body
	});
}
function resolveMaxSdkRetryWaitSeconds() {
	const raw = process.env.OPENCLAW_SDK_RETRY_MAX_WAIT_SECONDS?.trim();
	if (!raw) return DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
	if (/^(?:0|false|off|none|disabled)$/i.test(raw)) return;
	if (!PLAIN_DECIMAL_NUMBER_RE.test(raw)) return DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
	return asFiniteNumberInRange(parseStrictFiniteNumber(raw), {
		min: 0,
		minExclusive: true,
		max: Number.MAX_SAFE_INTEGER
	}) ?? DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
}
function shouldBypassLongSdkRetry(response) {
	const maxWaitSeconds = resolveMaxSdkRetryWaitSeconds();
	if (maxWaitSeconds === void 0) return false;
	const status = response.status;
	if (!isRetryableProviderHttpStatus(status)) return false;
	const retryAfterSeconds = parseRetryAfterHeadersSeconds(response.headers, Date.now(), status);
	if (retryAfterSeconds !== void 0) return retryAfterSeconds > maxWaitSeconds;
	return status === 429;
}
function buildManagedResponse(response, release, refreshTimeout, localServiceLease) {
	const finalizeLocalServiceLease = () => {
		localServiceLease?.release();
	};
	if (!response.body) {
		release().finally(finalizeLocalServiceLease);
		return response;
	}
	const wrappedBody = wrapGuardedBodyStream({
		body: response.body,
		cleanup: async () => {
			try {
				await release().catch(() => void 0);
			} finally {
				finalizeLocalServiceLease();
			}
		},
		refreshTimeout
	});
	return new Response(wrappedBody, response);
}
function resolveModelRequestPolicy(model) {
	const debugProxy = resolveDebugProxySettings();
	const explicitDebugProxyUrl = debugProxy.enabled && debugProxy.proxyUrl && URL.parse(model.baseUrl)?.protocol === "https:" ? debugProxy.proxyUrl : void 0;
	const request = mergeModelProviderRequestOverrides(getModelProviderRequestTransport(model), { proxy: explicitDebugProxyUrl ? {
		mode: "explicit-proxy",
		url: explicitDebugProxyUrl
	} : void 0 });
	const routeFacts = getModelProviderRequestRouteFacts(model);
	return resolveProviderRequestPolicyConfig({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		...routeFacts ? { routeFacts } : {},
		capability: "llm",
		transport: "stream",
		request
	});
}
function resolveModelRequestTimeoutMs(model, timeoutMs) {
	return clampPositiveTimerTimeoutMs(timeoutMs === void 0 ? model.requestTimeoutMs : timeoutMs);
}
function buildGuardedModelFetch(model, timeoutMs, options) {
	const requestConfig = resolveModelRequestPolicy(model);
	const dispatcherPolicy = buildProviderRequestDispatcherPolicy(requestConfig);
	const requestTimeoutMs = resolveModelRequestTimeoutMs(model, timeoutMs);
	return async (input, init) => {
		const diagnosticContext = formatModelTransportContext();
		let localServiceLease;
		const request = input instanceof Request ? new Request(input, init) : void 0;
		const rawUrl = request?.url ?? (input instanceof URL ? input.toString() : typeof input === "string" ? input : (() => {
			throw new Error("Unsupported fetch input for transport-aware model request");
		})());
		const rawHeaders = request?.headers ?? init?.headers;
		const swappedEgress = swapSecretSentinelsForEgress({
			url: rawUrl,
			headers: rawHeaders
		});
		const url = swappedEgress.url;
		const policy = resolveProviderTransportSsrFPolicy({
			baseUrl: model.baseUrl,
			url,
			allowPrivateNetwork: requestConfig.allowPrivateNetwork,
			trustConfiguredBaseUrlOrigin: requestConfig.trustConfiguredBaseUrlOrigin
		});
		const baseInit = (request && {
			method: request.method,
			headers: swappedEgress.headers ?? request.headers,
			body: request.body ?? void 0,
			redirect: request.redirect,
			signal: request.signal,
			...request.body ? { duplex: "half" } : {}
		}) ?? (swappedEgress.headers && init ? {
			...init,
			headers: swappedEgress.headers
		} : init);
		const baseSignal = baseInit?.signal ?? void 0;
		const timeoutSignal = requestTimeoutMs === void 0 ? void 0 : AbortSignal.timeout(requestTimeoutMs);
		const localServiceSignal = baseSignal && timeoutSignal ? AbortSignal.any([baseSignal, timeoutSignal]) : baseSignal ?? timeoutSignal;
		const guardedFetchOptions = {
			url,
			init: baseInit,
			capture: { meta: {
				provider: model.provider,
				api: model.api,
				model: model.id
			} },
			dispatcherPolicy,
			dispatcherPool: getProviderTransportDispatcherPool(),
			timeoutMs: requestTimeoutMs,
			...baseSignal ? { signal: baseSignal } : {},
			allowCrossOriginUnsafeRedirectReplay: false,
			...policy ? { policy } : {}
		};
		let result;
		const fetchStartedAt = Date.now();
		const useEnvProxy = !dispatcherPolicy && shouldUseEnvHttpProxyForUrl(url);
		emitModelTransportDebug(log, `[model-fetch] start provider=${model.provider} api=${model.api} model=${model.id} method=${baseInit?.method ?? "GET"} url=${formatModelTransportDebugUrl(rawUrl)} timeoutMs=${requestTimeoutMs} proxy=${dispatcherPolicy ? "configured" : useEnvProxy ? "env" : "none"} policy=${policy ? "custom" : "default"}${diagnosticContext}`);
		try {
			localServiceLease = await ensureModelProviderLocalService(model, rawHeaders, localServiceSignal);
			result = await fetchWithSsrFGuard(useEnvProxy ? withTrustedEnvProxyGuardedFetchMode(guardedFetchOptions) : guardedFetchOptions);
		} catch (error) {
			const remediatedError = withModelProviderNetworkRemediation(error, {
				baseUrl: model.baseUrl,
				providerId: model.provider,
				url
			});
			emitModelTransportError(log, "model-fetch", `provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - fetchStartedAt} ${summarizeProviderTransportError(remediatedError)}${diagnosticContext}`, baseSignal);
			localServiceLease?.release();
			throw remediatedError;
		}
		let response = result.response;
		const elapsedMs = Date.now() - fetchStartedAt;
		const responseMessage = `[model-fetch] response provider=${model.provider} api=${model.api} model=${model.id} status=${response.status} elapsedMs=${elapsedMs} dispatcher=${result.dispatcherReused ? "reused" : "new"} contentType=${response.headers.get("content-type") ?? ""} httpRequestId=${response.headers.get("x-request-id") ?? "unknown"}${diagnosticContext}`;
		if (!response.ok) log.info(responseMessage);
		else emitModelTransportDebug(log, responseMessage);
		if (shouldBypassLongSdkRetry(response)) {
			const headers = new Headers(response.headers);
			headers.set("x-should-retry", "false");
			response = new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers
			});
		}
		const synthesizeJsonAsSse = options?.sanitizeSse !== false && !/\btext\/event-stream\b/i.test(response.headers.get("content-type") ?? "") && requestBodyHasStreamTrue(request, baseInit);
		if (synthesizeJsonAsSse) response = await normalizeOpenAISdkStreamContentType({
			response,
			model,
			release: result.release,
			localServiceLease
		});
		response = buildManagedResponse(response, result.release, result.refreshTimeout, localServiceLease);
		return prepareOpenAISdkSseResponse(response, {
			sanitize: options?.sanitizeSse !== false && shouldSanitizeOpenAISdkSseResponse(model),
			synthesizeJsonAsSse,
			onSseComment: options?.onSseComment
		});
	};
}
//#endregion
//#region src/media/anthropic-inline-images.ts
const ANTHROPIC_SUPPORTED_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
];
const ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES = 10485760;
const ANTHROPIC_MIME_PREFIX_BASE64_CHARS = 4 * Math.ceil(FILE_TYPE_SNIFF_MAX_BYTES / 3);
const ANTHROPIC_SUPPORTED_IMAGE_MIME_SET = new Set(ANTHROPIC_SUPPORTED_IMAGE_MIMES);
function isAnthropicSupportedImageMime(value) {
	return typeof value === "string" && ANTHROPIC_SUPPORTED_IMAGE_MIME_SET.has(value);
}
async function normalizeAnthropicInlineImage(block) {
	const canonicalData = canonicalizeBase64(block.data);
	const data = canonicalData ?? block.data.trim();
	const sniffData = canonicalData?.slice(0, ANTHROPIC_MIME_PREFIX_BASE64_CHARS) ?? data;
	const buffer = Buffer.from(sniffData, "base64");
	const declaredMime = normalizeMimeType(block.mimeType);
	const detectedMime = normalizeMimeType(await detectMime({ buffer }));
	if (isAnthropicSupportedImageMime(detectedMime)) return {
		data,
		mimeType: detectedMime
	};
	if (!detectedMime && isAnthropicSupportedImageMime(declaredMime)) return {
		data,
		mimeType: declaredMime
	};
	const convertToPng = detectedMime === "image/bmp";
	const conversionBuffer = sniffData.length === data.length ? buffer : Buffer.from(data, "base64");
	const { convertImageToJpeg, convertImageToPng } = await import("./image-ops-CQZ9MFvu.mjs");
	const normalizedBuffer = convertToPng ? await convertImageToPng(conversionBuffer) : await convertImageToJpeg(conversionBuffer);
	if (normalizedBuffer.byteLength > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Normalized Anthropic inline image exceeds the 10 MB decoded safety limit.");
	return {
		data: normalizedBuffer.toString("base64"),
		mimeType: convertToPng ? "image/png" : "image/jpeg"
	};
}
async function normalizeAnthropicInlineContentBlocks(content) {
	for (const block of content) {
		if (block.type !== "image") continue;
		if (estimateBase64DecodedBytes(block.data) > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline image exceeds the 10 MB decoded safety limit.");
	}
	const normalized = [];
	for (const block of content) {
		if (block.type !== "image") {
			normalized.push(block);
			continue;
		}
		normalized.push({
			...block,
			...await normalizeAnthropicInlineImage(block)
		});
	}
	return normalized;
}
//#endregion
//#region src/llm/ai-transport-host.ts
const transportLogBySubsystem = /* @__PURE__ */ new Map();
configureProviderErrorRedactor(redactSecrets);
function transportLog(subsystem) {
	let log = transportLogBySubsystem.get(subsystem);
	if (!log) {
		log = createSubsystemLogger(subsystem);
		transportLogBySubsystem.set(subsystem, log);
	}
	return log;
}
configureAiTransportHost({
	runInDetachedAsyncContext,
	observePendingProviderWork: (pending) => {
		trackAsyncWork(() => pending).catch(() => {});
	},
	buildModelFetch: buildGuardedModelFetch,
	unwrapModelTransportSentinels: unwrapModelHeaderSentinelsForProviderEgress,
	resolveSecretSentinel: (value) => {
		const swapped = swapSecretSentinelsInText(value);
		const unknown = swapped.unknown[0];
		if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing to construct provider client`);
		return swapped.text;
	},
	redactToolPayloadText,
	normalizeAnthropicInlineContentBlocks,
	resolveOpenAIStrictToolSetting,
	resolveModelRequestTimeoutMs: (model) => resolveModelRequestTimeoutMs(model, void 0),
	logDebug: (subsystem, build) => {
		const log = transportLog(subsystem);
		if (!log.isEnabled("debug", "any")) return;
		const entry = build();
		if (entry) log.debug(entry.message + formatModelTransportContext(), entry.data);
	},
	logInfo: (subsystem, message, data) => transportLog(subsystem).info(message + formatModelTransportContext(), data),
	logWarn: (subsystem, message, data) => transportLog(subsystem).warn(message + formatModelTransportContext(), data)
});
//#endregion
export { swapSecretSentinelsForEgress as n, withModelTransportContext as r, buildGuardedModelFetch as t };

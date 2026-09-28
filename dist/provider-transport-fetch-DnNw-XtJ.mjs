import { c as asFiniteNumberInRange, m as clampTimerTimeoutMs, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { d as isLinkLocalIpAddress, h as isRfc8215LocalUseNat64Ipv6Address, o as isCloudMetadataIpAddress, v as parseCanonicalIpAddress } from "./ip-CDH5BTTD.mjs";
import { a as containsSecretSentinel, c as resolveSecretSentinel, n as SECRET_SENTINEL_PATTERN, u as swapSecretSentinelsInText } from "./sentinel-C86v7W15.mjs";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-BwCPCI9p.mjs";
import { _ as summarizeProviderTransportError, g as readResponseTextLimited, t as ProviderHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin, m as mergeSsrFPolicies, t as SsrFBlockedError, x as ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist } from "./ssrf-BQRtcdBp.mjs";
import { c as withTrustedEnvProxyGuardedFetchMode, f as wrapGuardedBodyStream, i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { a as getModelProviderRequestRouteFacts, c as mergeModelProviderRequestOverrides, f as resolveProviderRequestPolicyConfig, i as buildProviderRequestDispatcherPolicy, o as getModelProviderRequestTransport } from "./provider-request-config-DOrVD029.mjs";
import { r as resolveDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { r as ensureModelProviderLocalService } from "./provider-local-service-Bc1IFUkA.mjs";
import { n as getProviderTransportDispatcherPool } from "./provider-transport-dispatcher-pool-FjOGDZGb.mjs";
import { emitModelTransportDebug, formatModelTransportDebugUrl } from "@openclaw/ai/diagnostics";
import { parseRetryAfterHeadersSeconds } from "@openclaw/ai/internal/retry-after";
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
//#region src/agents/provider-transport-fetch.ts
/**
* Guarded provider fetch transport utilities.
*
* Applies request timeouts, proxy/TLS overrides, SSRF policy, local-service leases, retry hints, and SSE normalization.
*/
const DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS = 60;
const SLOW_MODEL_FETCH_MS = 1e3;
const OPENAI_SDK_STREAM_CONTENT_SNIFF_BYTES = 2048;
const log = createSubsystemLogger("provider-transport-fetch");
/** Max bytes for an entire JSON body synthesized into SSE frames. Prevents OOM
*  when a hostile streaming endpoint returns a never-ending JSON response
*  without Content-Length. */
const SSE_SYNTHESIZE_JSON_MAX_BYTES = 16777216;
/** Max bytes read from a non-OK response body before truncation. */
const SSE_NONOK_BODY_MAX_BYTES = 65536;
/** Max decoded characters buffered while waiting for the next SSE event boundary. */
const SSE_SANITIZE_BUFFER_MAX_CHARS = 16777216;
const BLOCKED_EXACT_ORIGIN_TRUST_HOSTNAME_LABELS = /* @__PURE__ */ new Set(["instance-data"]);
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
function hasReadableSseData(block) {
	return block.split(/\r\n|\n|\r/).some((line) => line.startsWith("data:") && line.slice(5).trim().length > 0);
}
function findSseEventBoundary(buffer) {
	let best;
	for (const delimiter of [
		"\r\n\r\n",
		"\n\n",
		"\r\r"
	]) {
		const index = buffer.indexOf(delimiter);
		if (index === -1) continue;
		if (!best || index < best.index) best = {
			index,
			length: delimiter.length
		};
	}
	return best;
}
async function cancelReaderBestEffort(reader, reason) {
	await reader?.cancel(reason).catch(() => void 0);
}
function capNonOkResponseBodyLazily(response, maxBytes) {
	const source = response.body;
	if (!source) return response;
	let reader;
	let total = 0;
	const capped = new ReadableStream({
		start() {
			reader = source.getReader();
		},
		async pull(controller) {
			try {
				const chunk = await reader?.read();
				if (!chunk || chunk.done) {
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
function sanitizeOpenAISdkSseResponse(response, options) {
	const contentType = response.headers.get("content-type") ?? "";
	if (!response.body) return response;
	if (!response.ok) return capNonOkResponseBodyLazily(response, SSE_NONOK_BODY_MAX_BYTES);
	if (options?.synthesizeJsonAsSse === true && (/\bapplication\/json\b/i.test(contentType) || /\+json\b/i.test(contentType))) {
		const source = response.body;
		const decoder = new TextDecoder();
		const encoder = new TextEncoder();
		let reader;
		let buffer = "";
		let totalBytes = 0;
		const sseBody = new ReadableStream({
			start() {
				reader = source.getReader();
			},
			async pull(controller) {
				try {
					for (;;) {
						const chunk = await reader?.read();
						if (!chunk || chunk.done) {
							buffer += decoder.decode();
							const data = buffer.trim();
							if (data) controller.enqueue(encoder.encode(`data: ${data}\n\n`));
							controller.enqueue(encoder.encode("data: [DONE]\n\n"));
							controller.close();
							return;
						}
						const nextTotalBytes = totalBytes + chunk.value.byteLength;
						if (nextTotalBytes > SSE_SYNTHESIZE_JSON_MAX_BYTES) throw new Error(`Streaming JSON body exceeded ${SSE_SYNTHESIZE_JSON_MAX_BYTES} bytes while synthesizing SSE frames`);
						totalBytes = nextTotalBytes;
						buffer += decoder.decode(chunk.value, { stream: true });
					}
				} catch (error) {
					await cancelReaderBestEffort(reader, error);
					controller.error(error);
				}
			},
			async cancel(reason) {
				await cancelReaderBestEffort(reader, reason);
			}
		});
		const headers = new Headers(response.headers);
		headers.set("content-type", "text/event-stream; charset=utf-8");
		return new Response(sseBody, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
	if (!/\btext\/event-stream\b/i.test(contentType)) return response;
	const source = response.body;
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let reader;
	let buffer = "";
	const enqueueSanitized = (controller, text) => {
		let enqueued = 0;
		buffer += text;
		for (;;) {
			const boundary = findSseEventBoundary(buffer);
			if (!boundary) {
				if (buffer.length > SSE_SANITIZE_BUFFER_MAX_CHARS) throw new Error(`SSE response exceeded max buffer size (${SSE_SANITIZE_BUFFER_MAX_CHARS} chars) without event boundary`);
				return enqueued;
			}
			const block = buffer.slice(0, boundary.index);
			const separator = buffer.slice(boundary.index, boundary.index + boundary.length);
			buffer = buffer.slice(boundary.index + boundary.length);
			if (hasReadableSseData(block)) {
				controller.enqueue(encoder.encode(`${block}${separator}`));
				enqueued += 1;
				return enqueued;
			}
		}
	};
	const sanitizedBody = new ReadableStream({
		start() {
			reader = source.getReader();
		},
		async pull(controller) {
			try {
				for (;;) {
					if (enqueueSanitized(controller, "") > 0) return;
					const chunk = await reader?.read();
					if (!chunk || chunk.done) {
						const tail = decoder.decode();
						if (tail) enqueueSanitized(controller, tail);
						if (buffer && hasReadableSseData(buffer)) controller.enqueue(encoder.encode(buffer));
						buffer = "";
						controller.close();
						return;
					}
					if (enqueueSanitized(controller, decoder.decode(chunk.value, { stream: true })) > 0) return;
				}
			} catch (error) {
				await cancelReaderBestEffort(reader, error);
				controller.error(error);
			}
		},
		async cancel(reason) {
			await cancelReaderBestEffort(reader, reason);
		}
	});
	return new Response(sanitizedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function shouldSanitizeOpenAISdkSseResponse(model) {
	if (model.provider !== "openai") return true;
	try {
		return new URL(model.baseUrl).hostname.toLowerCase() !== "api.openai.com";
	} catch {
		return true;
	}
}
function isJsonContentType(contentType) {
	return /\bapplication\/json\b/i.test(contentType) || /\+json\b/i.test(contentType);
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
	const headers = new Headers(response.headers);
	headers.set("content-type", contentType);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
async function normalizeOpenAISdkStreamContentType(params) {
	const contentType = params.response.headers.get("content-type") ?? "";
	if (!params.response.ok || !params.response.body) return params.response;
	if (/\btext\/event-stream\b/i.test(contentType)) return params.response;
	if (isJsonContentType(contentType)) {
		if (await classifyOpenAISdkStreamBody(params.response).catch(() => "unknown") === "sse") return withOpenAISdkStreamContentType(params.response, "text/event-stream; charset=utf-8");
		return params.response;
	}
	if (!contentType.trim()) {
		const kind = await classifyOpenAISdkStreamBody(params.response).catch(() => "unknown");
		if (kind === "sse") return withOpenAISdkStreamContentType(params.response, "text/event-stream; charset=utf-8");
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
function requestBodyHasStreamTrue(request, init) {
	const method = request?.method ?? init?.method;
	if (method && method.toUpperCase() !== "POST") return false;
	const contentType = (request?.headers ?? new Headers(init?.headers)).get("content-type") ?? "";
	if (contentType && !/\bapplication\/json\b/i.test(contentType)) return false;
	let text;
	if (typeof init?.body === "string") text = init.body;
	if (!text) return false;
	try {
		return JSON.parse(text).stream === true;
	} catch {
		return false;
	}
}
function resolveMaxSdkRetryWaitSeconds() {
	const raw = process.env.OPENCLAW_SDK_RETRY_MAX_WAIT_SECONDS?.trim();
	if (!raw) return DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
	if (/^(?:0|false|off|none|disabled)$/i.test(raw)) return;
	if (!PLAIN_DECIMAL_NUMBER_RE.test(raw)) return DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
	const seconds = asFiniteNumberInRange(parseStrictFiniteNumber(raw), {
		min: 0,
		minExclusive: true,
		max: Number.MAX_SAFE_INTEGER
	});
	if (seconds !== void 0) return seconds;
	return DEFAULT_MAX_SDK_RETRY_WAIT_SECONDS;
}
function shouldBypassLongSdkRetry(response) {
	const maxWaitSeconds = resolveMaxSdkRetryWaitSeconds();
	if (maxWaitSeconds === void 0) return false;
	const status = response.status;
	if (!(status === 408 || status === 409 || status === 429 || status >= 500)) return false;
	const retryAfterSeconds = parseRetryAfterHeadersSeconds(response.headers);
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
	return new Response(wrappedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function resolveModelRequestPolicy(model) {
	const debugProxy = resolveDebugProxySettings();
	let explicitDebugProxyUrl;
	if (debugProxy.enabled && debugProxy.proxyUrl) try {
		if (new URL(model.baseUrl).protocol === "https:") explicitDebugProxyUrl = debugProxy.proxyUrl;
	} catch {}
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
	if (timeoutMs !== void 0) return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
	const modelTimeoutMs = model.requestTimeoutMs;
	return typeof modelTimeoutMs === "number" && Number.isFinite(modelTimeoutMs) && modelTimeoutMs > 0 ? clampTimerTimeoutMs(modelTimeoutMs) : void 0;
}
function buildModelRequestSignal(baseSignal, timeoutMs) {
	if (timeoutMs === void 0) return baseSignal;
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	if (!baseSignal) return timeoutSignal;
	return AbortSignal.any([baseSignal, timeoutSignal]);
}
function resolveHttpOrigin(value) {
	if (typeof value !== "string" || !value.trim()) return;
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		parsed.hostname = parsed.hostname.replace(/\.+$/, "");
		return parsed.origin.toLowerCase();
	} catch {
		return;
	}
}
function normalizeProviderOriginHostname(value) {
	if (typeof value !== "string" || !value.trim()) return;
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return parsed.hostname.trim().toLowerCase().replace(/\.+$/, "") || void 0;
	} catch {
		return;
	}
}
function canImplicitlyTrustConfiguredBaseUrlOrigin(value) {
	const hostname = normalizeProviderOriginHostname(value);
	if (!hostname) return false;
	return !hostname.split(".").filter(Boolean).some((label) => label.includes("metadata") || BLOCKED_EXACT_ORIGIN_TRUST_HOSTNAME_LABELS.has(label)) && !isLinkLocalIpAddress(hostname) && !isCloudMetadataIpAddress(hostname) && !isRfc8215LocalUseNat64Ipv6Address(hostname);
}
function canApplyFakeIpHostnamePolicy(value) {
	const hostname = normalizeProviderOriginHostname(value);
	if (!hostname) return false;
	return !hostname.split(".").filter(Boolean).some((label) => label.includes("metadata") || BLOCKED_EXACT_ORIGIN_TRUST_HOSTNAME_LABELS.has(label)) && !parseCanonicalIpAddress(hostname);
}
function resolveProviderTransportSsrFPolicy(params) {
	const baseUrl = params.baseUrl;
	const baseOrigin = resolveHttpOrigin(baseUrl);
	const requestOrigin = resolveHttpOrigin(params.url);
	const requestMatchesBaseOrigin = typeof baseUrl === "string" && Boolean(baseOrigin) && requestOrigin === baseOrigin;
	const baseUrlOriginPolicy = requestMatchesBaseOrigin && params.trustConfiguredBaseUrlOrigin && canImplicitlyTrustConfiguredBaseUrlOrigin(baseUrl) ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl) : void 0;
	const fakeIpPolicy = requestMatchesBaseOrigin && canApplyFakeIpHostnamePolicy(baseUrl) ? ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist(baseUrl) : void 0;
	return mergeSsrFPolicies(baseUrlOriginPolicy, fakeIpPolicy, params.allowPrivateNetwork ? { allowPrivateNetwork: true } : void 0);
}
function withModelProviderNetworkRemediation(error, params) {
	const baseOrigin = resolveHttpOrigin(params.baseUrl);
	const requestOrigin = resolveHttpOrigin(params.url);
	const hostname = normalizeProviderOriginHostname(params.baseUrl);
	if (!(error instanceof SsrFBlockedError) || !baseOrigin || requestOrigin !== baseOrigin || !hostname || !isRfc8215LocalUseNat64Ipv6Address(hostname)) return error;
	return new SsrFBlockedError(`Configured model provider ${params.providerId} uses local-use NAT64 origin ${baseOrigin}, which OpenClaw blocks by default. Move the provider to a loopback, LAN, or tailnet address, or set models.providers.${params.providerId}.request.allowPrivateNetwork=true only for an operator-controlled endpoint. Original block: ${error.message}`);
}
function buildGuardedModelFetch(model, timeoutMs, options) {
	const requestConfig = resolveModelRequestPolicy(model);
	const dispatcherPolicy = buildProviderRequestDispatcherPolicy(requestConfig);
	const requestTimeoutMs = resolveModelRequestTimeoutMs(model, timeoutMs);
	return async (input, init) => {
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
		const localServiceSignal = buildModelRequestSignal(baseSignal, requestTimeoutMs);
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
		emitModelTransportDebug(log, `[model-fetch] start provider=${model.provider} api=${model.api} model=${model.id} method=${baseInit?.method ?? "GET"} url=${formatModelTransportDebugUrl(rawUrl)} timeoutMs=${requestTimeoutMs} proxy=${dispatcherPolicy ? "configured" : useEnvProxy ? "env" : "none"} policy=${policy ? "custom" : "default"}`);
		try {
			localServiceLease = await ensureModelProviderLocalService(model, rawHeaders, localServiceSignal);
			result = await fetchWithSsrFGuard(useEnvProxy ? withTrustedEnvProxyGuardedFetchMode(guardedFetchOptions) : guardedFetchOptions);
		} catch (error) {
			const remediatedError = withModelProviderNetworkRemediation(error, {
				baseUrl: model.baseUrl,
				providerId: model.provider,
				url
			});
			log.warn(`[model-fetch] error provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - fetchStartedAt} ${summarizeProviderTransportError(remediatedError)}`);
			localServiceLease?.release();
			throw remediatedError;
		}
		let response = result.response;
		const elapsedMs = Date.now() - fetchStartedAt;
		const responseMessage = `[model-fetch] response provider=${model.provider} api=${model.api} model=${model.id} status=${response.status} elapsedMs=${elapsedMs} dispatcher=${result.dispatcherReused ? "reused" : "new"} contentType=${response.headers.get("content-type") ?? ""}`;
		if (!response.ok || elapsedMs >= SLOW_MODEL_FETCH_MS) log.info(responseMessage);
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
		return options?.sanitizeSse === false || !shouldSanitizeOpenAISdkSseResponse(model) ? response : sanitizeOpenAISdkSseResponse(response, { synthesizeJsonAsSse });
	};
}
//#endregion
export { resolveModelRequestTimeoutMs as n, resolveProviderTransportSsrFPolicy as r, buildGuardedModelFetch as t };

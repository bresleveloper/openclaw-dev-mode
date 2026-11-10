import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as consumeResponseBytes, t as decodeTextPrefix } from "./src-Djeo9OvP.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { F as listModelRefsFromConfigValue, P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { _ as resolveSelectedContextEnginePluginIdFromConfig, p as resolveEffectivePluginActivationState } from "./config-state-DkDfCu7E.mjs";
import "./session-key-CSDERtm3.mjs";
import "./plugin-instance-scope-BoTOTPL4.mjs";
import { v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { i as readBundledDiscoveryModeMemoized } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { n as listPotentialConfiguredChannelIds, t as listExplicitlyDisabledChannelIdsForConfig } from "./config-presence-oqIBz-8f.mjs";
import { u as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-hdzky3AO.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CYadf-lt.mjs";
import { o as resolveConfiguredTalkRealtimeProviderId } from "./talk-Brycd9Kq.mjs";
import { t as CORE_BUILT_IN_MODEL_APIS } from "./provider-config-owner-xL-mNZoa.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-Ag5B94I6.mjs";
import "./http-body-DZQjJc2J.mjs";
import { n as readResponseTextPrefix } from "./http-response-body-B70cE6fn.mjs";
import { b as redactProviderResponseErrorText, m as readProviderJsonResponse, o as createProviderHttpError$1 } from "./provider-http-errors-CjVOxCE5.mjs";
import "./provider-request-config-WdycwKIG.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5Nd20RhP.mjs";
import { h as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import { n as fetchWithRuntimeDispatcher } from "./runtime-fetch-FH7UFEsq.mjs";
import { S as resolveMemoryDreamingPluginId, b as resolveMemoryDreamingConfig, s as DEFAULT_MEMORY_DREAMING_PLUGIN_ID, x as resolveMemoryDreamingPluginConfig } from "./dreaming-D2xE6WEV.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-DW81XCVx.mjs";
import "./provider-network-policy-DGvgCdvN.mjs";
import { t as MEMORY_SEARCH_DEADLINE_CONTROL } from "./search-deadline-control-CvwcTLrz.mjs";
import "./config-contracts-DRulo8kM.mjs";
import { n as isConfigActivationValueEnabled, r as sortUniquePluginIds, t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-GphgdX8d.mjs";
//#region packages/memory-host-sdk/src/host/azure-api-version-request.ts
/** Detect Azure OpenAI-compatible embedding hosts. */
function isAzureOpenAICompatibleHost(hostname) {
	return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function resolveAzureApiVersionRequestTarget(params) {
	const { url, headers } = params;
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return params;
	}
	if (!isAzureOpenAICompatibleHost(parsed.hostname)) return params;
	const headerKey = Object.keys(headers).find((key) => key.toLowerCase() === "api-version");
	if (!headerKey) return params;
	const apiVersion = headers[headerKey]?.trim();
	const nextHeaders = { ...headers };
	delete nextHeaders[headerKey];
	if (!apiVersion) return {
		url,
		headers: nextHeaders
	};
	const existing = parsed.searchParams.get("api-version");
	if (existing === null || existing.trim() === "") parsed.searchParams.set("api-version", apiVersion);
	return {
		url: parsed.toString(),
		headers: nextHeaders
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.ts
const debugEmbeddings = [
	"true",
	"1",
	"on",
	"yes"
].includes(normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS));
/** Write embedding debug metadata when OPENCLAW_DEBUG_MEMORY_EMBEDDINGS is enabled. */
function debugEmbeddingsLog(message, meta) {
	if (!debugEmbeddings) return;
	const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
	console.warn(`${message}${suffix}`);
}
/** Only numeric HTTP metadata belongs in embedding shape diagnostics. */
function embeddingResponseLogMeta(response) {
	const bytes = Number(response.headers.get("content-length") ?? NaN);
	return {
		status: response.status,
		responseBytes: Number.isSafeInteger(bytes) && bytes >= 0 ? bytes : void 0
	};
}
/** Enrich owned response errors without changing the text used by retry policy. */
function addEmbeddingErrorContext(error, prefix, context) {
	if (!(error instanceof Error) || !error.message.startsWith(prefix) || error.message.startsWith(context)) return error;
	return Object.assign(error, {
		embeddingErrorMessage: error.message,
		message: `${context}${error.message.slice(prefix.length)}`
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-vectors.ts
/** Validate provider embeddings and restore their original request order. */
function readEmbeddingVectors(data, expectedCount, errorPrefix) {
	const invalid = (condition) => Object.assign(/* @__PURE__ */ new Error(`${errorPrefix}: ${condition}`), { code: "INVALID_EMBEDDING_RESPONSE" });
	const first = Array.isArray(data) ? asOptionalRecord(data[0]) : void 0;
	debugEmbeddingsLog("memory embeddings: remote response shape", {
		context: errorPrefix,
		vectorCount: Array.isArray(data) ? data.length : void 0,
		firstVectorDimensions: Array.isArray(first?.embedding) ? first.embedding.length : void 0,
		firstIndexType: typeof first?.index
	});
	if (!Array.isArray(data)) throw invalid("missing data array");
	if (expectedCount !== void 0 && data.length !== expectedCount) throw invalid(data.length === 0 ? `empty data array; expected ${expectedCount} vectors` : `expected ${expectedCount} vectors, got ${data.length}`);
	const vectors = [];
	let indexed;
	for (let position = 0; position < data.length; position += 1) {
		const entry = asOptionalRecord(data[position]);
		const embedding = entry?.embedding;
		const usesIndex = entry?.index !== void 0;
		if (!Array.isArray(embedding)) throw invalid(`missing embedding array at position ${position}`);
		if (embedding.length === 0) throw invalid(`empty embedding at position ${position}`);
		if (indexed !== void 0 && indexed !== usesIndex) throw invalid(`missing index at position ${usesIndex ? 0 : position} (mixed indexed and positional entries)`);
		for (const [coordinateIndex, coordinate] of embedding.entries()) if (typeof coordinate !== "number" || !Number.isFinite(coordinate)) throw invalid(`${typeof coordinate === "number" ? "non-finite" : "non-numeric"} coordinate at position ${position}, coordinate ${coordinateIndex}`);
		indexed = usesIndex;
		const index = usesIndex ? entry?.index : position;
		if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= data.length) throw invalid(`invalid index at position ${position}; expected an integer in [0, ${data.length - 1}]`);
		if (vectors[index] !== void 0) throw invalid(`duplicate index ${index} at position ${position}`);
		vectors[index] = embedding;
	}
	return vectors;
}
/** Replace invalid coordinates and L2-normalize non-empty vectors. */
function sanitizeAndNormalizeEmbedding(vec) {
	const sanitized = vec.map((value) => Number.isFinite(value) ? value : 0);
	const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
	if (magnitude < 1e-10) return sanitized;
	return sanitized.map((value) => value / magnitude);
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime-network.ts
const createProviderHttpError = async (...args) => {
	return (await import("./provider-http-errors-a-cfZLrk.mjs")).createProviderHttpError(...args);
};
//#endregion
//#region packages/memory-host-sdk/src/host/remote-http.ts
/** Proxy mode used only for URLs that the runtime classified as env-proxy safe. */
const MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE = "trusted_env_proxy";
/** Build an SSRF allow policy from a configured remote base URL. */
const buildRemoteBaseUrlPolicy = ssrfPolicyFromHttpBaseUrlAllowedHostname;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
async function withRemoteHttpResponse(params) {
	const guardedFetch = params.fetchWithSsrFGuardImpl ?? fetchWithSsrFGuard;
	const shouldUseEnvProxy = params.shouldUseEnvHttpProxyForUrlImpl ?? shouldUseEnvHttpProxyForUrl;
	const request = async (forceRefresh) => {
		params.signal?.throwIfAborted();
		let init = params.init;
		if (params.resolveRequestHeaders) {
			const authHeaders = await params.resolveRequestHeaders({
				forceRefresh,
				signal: params.signal
			});
			params.signal?.throwIfAborted();
			const headers = new Headers(init?.headers);
			for (const [name, value] of Object.entries(authHeaders)) headers.set(name, value);
			init = {
				...init,
				headers
			};
		}
		const { response, release, finalUrl } = await guardedFetch({
			url: params.url,
			fetchImpl: params.fetchImpl,
			init,
			signal: params.signal,
			policy: params.ssrfPolicy,
			auditContext: params.auditContext ?? "memory-remote",
			...shouldUseEnvProxy(params.url) ? { mode: MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE } : {}
		});
		try {
			return await params.onResponse(response, init?.headers);
		} catch (error) {
			if (!params.resolveRequestHeaders || forceRefresh || response.status !== 401 || new URL(finalUrl).origin !== new URL(params.url).origin || asOptionalRecord(error)?.code !== "token_expired") throw error;
		} finally {
			await release();
		}
		return await request(true);
	};
	return await request(false);
}
//#endregion
//#region packages/memory-host-sdk/src/host/response-snippet.ts
const DEFAULT_ERROR_BODY_MAX_BYTES = 8192;
const DEFAULT_ERROR_BODY_MAX_CHARS = 1e3;
const DEFAULT_JSON_BODY_MAX_BYTES = 67108864;
const TRUNCATED_SUFFIX = "... [truncated]";
/** Read a small collapsed text snippet from a response body. */
async function readMemoryHostResponseTextSnippet(res, options = {}) {
	const maxBytes = options.maxBytes ?? DEFAULT_ERROR_BODY_MAX_BYTES;
	const maxChars = options.maxChars ?? DEFAULT_ERROR_BODY_MAX_CHARS;
	const prefix = await readResponsePrefix(res, maxBytes, options.signal);
	if (prefix.bytes.length === 0) return "";
	const collapsed = decodeTextPrefix(prefix.bytes, { truncated: prefix.truncated }).replace(/\s+/g, " ").trim();
	if (!collapsed) return "";
	if (prefix.truncated || collapsed.length > maxChars) return `${truncateUtf16Safe(collapsed, maxChars)}${TRUNCATED_SUFFIX}`;
	return collapsed;
}
/** Read and parse JSON while enforcing a hard byte limit. */
async function readResponseJsonWithLimit(res, options) {
	const maxBytes = options.maxBytes ?? DEFAULT_JSON_BODY_MAX_BYTES;
	const contentLength = parseContentLength(res.headers.get("content-length"), options.errorPrefix);
	if (typeof contentLength === "number" && contentLength > maxBytes) {
		await cancelResponseBody(res);
		throw responseTooLarge(options.errorPrefix, contentLength, maxBytes);
	}
	const prefix = await readResponsePrefix(res, maxBytes, options.signal, options.errorPrefix);
	const text = new TextDecoder("utf-8", { fatal: true }).decode(prefix.bytes);
	try {
		return JSON.parse(text);
	} catch (cause) {
		throw new Error(`${options.errorPrefix}: malformed JSON response`, { cause });
	}
}
function toAbortError(signal, fallbackMessage) {
	return signal.reason instanceof Error ? signal.reason : new Error(fallbackMessage);
}
async function readChunkWithAbort(reader, signal, fallbackMessage) {
	if (!signal) return await reader.read();
	if (signal.aborted) {
		reader.cancel().catch(() => void 0);
		throw toAbortError(signal, fallbackMessage);
	}
	let removeAbortListener;
	const abortPromise = new Promise((_resolve, reject) => {
		const onAbort = () => {
			reject(toAbortError(signal, fallbackMessage));
			reader.cancel().catch(() => void 0);
		};
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
	});
	try {
		return await Promise.race([reader.read(), abortPromise]);
	} finally {
		removeAbortListener?.();
	}
}
async function readResponsePrefix(res, maxBytes, signal, errorPrefix) {
	const body = res.body;
	if (!body || typeof body.getReader !== "function") return {
		bytes: /* @__PURE__ */ new Uint8Array(),
		truncated: false
	};
	const reader = body.getReader();
	const chunks = [];
	let result;
	try {
		result = await consumeResponseBytes({
			maxBytes,
			stopAtLimit: errorPrefix === void 0,
			read: () => readChunkWithAbort(reader, signal, errorPrefix === void 0 ? "Response snippet body read aborted" : `${errorPrefix}: response body read aborted`),
			onChunk: (chunk) => chunks.push(chunk),
			onLimit: (size) => {
				reader.cancel().catch(() => void 0);
				if (errorPrefix !== void 0) throw responseTooLarge(errorPrefix, size, maxBytes);
			}
		});
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return {
		bytes: chunks.length === 1 ? chunks[0] : Buffer.concat(chunks),
		truncated: result.truncated
	};
}
async function cancelResponseBody(res) {
	const body = res.body;
	if (!body || typeof body.cancel !== "function") return;
	body.cancel().catch(() => void 0);
}
function parseContentLength(raw, errorPrefix) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	const value = Number(trimmed);
	if (!/^\d+$/.test(trimmed) || !Number.isSafeInteger(value)) throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
	return value;
}
function responseTooLarge(errorPrefix, size, maxBytes) {
	return /* @__PURE__ */ new Error(`${errorPrefix}: response body too large: ${size} bytes (limit: ${maxBytes} bytes)`);
}
//#endregion
//#region packages/memory-host-sdk/src/host/post-json.ts
/** POST JSON, parse bounded response JSON, and preserve provider error metadata. */
async function postJson(params) {
	return await withRemoteHttpResponse({
		url: params.url,
		ssrfPolicy: params.ssrfPolicy,
		fetchImpl: params.fetchImpl,
		resolveRequestHeaders: params.resolveRequestHeaders,
		signal: params.signal,
		init: {
			method: "POST",
			headers: params.headers,
			body: JSON.stringify(params.body)
		},
		onResponse: async (res, requestHeaders) => {
			params.onResponse?.(res);
			try {
				if (!res.ok) throw await createProviderHttpError(res, params.errorPrefix, {
					requestHeaders,
					signal: params.signal,
					maxBodyBytes: 8192
				});
				const payload = await readResponseJsonWithLimit(res, {
					errorPrefix: params.errorPrefix,
					maxBytes: params.maxResponseBytes,
					signal: params.signal
				});
				return await params.parse(payload);
			} catch (error) {
				if (params.signal?.aborted) throw error;
				throw params.mapResponseError ? params.mapResponseError(error) : error;
			}
		}
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-fetch.ts
function extractEmbeddingUsage(payload) {
	const usage = asOptionalRecord(asOptionalRecord(payload)?.usage);
	const promptTokens = normalizeUsageCount(usage?.prompt_tokens);
	const totalTokens = normalizeUsageCount(usage?.total_tokens);
	if (promptTokens === void 0 && totalTokens === void 0) return;
	return {
		promptTokens: promptTokens ?? totalTokens ?? 0,
		totalTokens: totalTokens ?? promptTokens ?? 0
	};
}
function normalizeUsageCount(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
/** POST an embedding request and return validated vectors in request order. */
async function fetchRemoteEmbeddingVectors(params) {
	const body = asOptionalRecord(params.body);
	const inputCount = Array.isArray(body?.input) ? body.input.length : void 0;
	const model = typeof body?.model === "string" ? body.model : "unknown";
	const errorPrefix = `${params.errorPrefix} (model: ${model}, batch size: ${inputCount ?? "unknown"})`;
	const context = {
		context: errorPrefix,
		inputCount
	};
	debugEmbeddingsLog("memory embeddings: remote request", context);
	const target = resolveAzureApiVersionRequestTarget(params);
	return await postJson({
		...params,
		...target,
		mapResponseError: (error) => addEmbeddingErrorContext(error, params.errorPrefix, errorPrefix),
		onResponse: (res) => {
			debugEmbeddingsLog("memory embeddings: remote response", {
				...context,
				...embeddingResponseLogMeta(res)
			});
		},
		parse: (payload) => {
			const data = asOptionalRecord(payload)?.data;
			const vectors = readEmbeddingVectors(data, inputCount, errorPrefix);
			params.onUsage?.(extractEmbeddingUsage(payload));
			return vectors;
		}
	});
}
//#endregion
//#region src/plugins/openai-compatible-embedding-provider.ts
/** Provider id for OpenAI-compatible remote embedding servers. */
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
const EMBEDDING_ERROR_BODY_MAX_BYTES = 8192;
const EMBEDDING_ERROR_BODY_MAX_CHARS = 1e3;
const EMBEDDING_ERROR_TRUNCATED_SUFFIX = "... [truncated]";
function normalizeBaseUrl(value) {
	const baseUrl = value?.trim();
	if (!baseUrl) throw new Error("openai-compatible embeddings: missing remote.baseUrl. Set it to your OpenAI-compatible embeddings server, for example http://127.0.0.1:11434/v1.");
	return baseUrl.replace(/\/+$/u, "");
}
function normalizeModel(value, providerId) {
	const model = value?.trim();
	if (!model) throw new Error("openai-compatible embeddings: missing model. Set it to the embedding model id your server expects.");
	const prefixes = new Set([
		providerId?.trim(),
		normalizeProviderId(providerId ?? ""),
		OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID
	].filter((prefix) => Boolean(prefix)).map((prefix) => `${prefix}/`));
	for (const prefix of prefixes) if (model.startsWith(prefix)) return model.slice(prefix.length);
	return model;
}
function normalizeDimensions(value) {
	if (!Number.isInteger(value) || value <= 0) throw new Error("openai-compatible embeddings: dimensions must be a positive integer.");
	return value;
}
function resolveRequestInputType(client, kind) {
	if (kind === "query") return client.queryInputType ?? client.inputType;
	if (kind === "document") return client.documentInputType ?? client.inputType;
	return client.inputType;
}
function buildHeaders(params) {
	const headers = {
		accept: "application/json",
		"content-type": "application/json"
	};
	for (const [path, extra] of [["models.providers.*.headers", params.provider], ["memory.search.remote.headers", params.remote]]) for (const [name, rawValue] of Object.entries(extra ?? {})) {
		const normalizedName = name.trim().toLowerCase();
		if (!normalizedName) continue;
		const value = normalizeResolvedSecretInputString({
			value: rawValue,
			path: `${path}.${normalizedName}`
		});
		if (value) headers[normalizedName] = value;
	}
	if (params.apiKey && !headers.authorization) headers.authorization = `Bearer ${params.apiKey}`;
	return headers;
}
function isSensitiveHeaderName(name) {
	return name === "authorization" || name === "proxy-authorization" || name.includes("api-key") || name.includes("token") || name.includes("secret");
}
function sanitizeCacheHeaders(headers) {
	const safeHeaders = Object.fromEntries(Object.entries(headers).filter(([name]) => !isSensitiveHeaderName(name)));
	return Object.keys(safeHeaders).length > 0 ? safeHeaders : void 0;
}
async function resolveConfiguredProviderApiKey(params) {
	if (params.configuredProvider?.localService) {
		const { resolveManagedLocalProviderAuth } = await import("./model-auth-runtime-BFGcmRM2.mjs");
		const auth = resolveManagedLocalProviderAuth({
			cfg: params.options.config,
			provider: params.providerId
		});
		if (auth) return auth.apiKey;
	}
	const apiKey = normalizeResolvedSecretInputString({
		value: params.configuredProvider?.apiKey,
		path: `${appendConfigPathSegment("models.providers", params.providerId)}.apiKey`
	});
	if (!apiKey) return;
	const { resolveAgentDir, tryResolveAmbientOwnerAgentId } = await import("./agent-scope-config-DdPit6I3.mjs");
	const agentId = tryResolveAmbientOwnerAgentId(params.options.config);
	const agentDir = params.options.agentDir?.trim() || (agentId ? resolveAgentDir(params.options.config, agentId) : void 0);
	if (!agentDir) return apiKey;
	const { resolveScopedAuthProfileStoreAsync, resolveProviderEntryApiKeyAuth } = await import("./model-auth-provider-mVOxH0SF.mjs");
	const authParams = {
		provider: params.providerId,
		modelApi: params.configuredProvider?.api,
		cfg: params.options.config,
		agentDir
	};
	const store = await resolveScopedAuthProfileStoreAsync(authParams);
	const auth = await resolveProviderEntryApiKeyAuth({
		...authParams,
		store
	});
	return auth ? auth.apiKey : apiKey;
}
function isOpenAICompatibleProviderConfig(id, provider) {
	return normalizeProviderId(id) === OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID || OPENAI_COMPATIBLE_MODEL_APIS.has(normalizeProviderId(provider.api ?? "")) || !provider.api && typeof provider.baseUrl === "string" && provider.baseUrl.trim().length > 0;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const normalizedProviderId = normalizeProviderId(providerId);
	const direct = providers[providerId];
	if (direct && isOpenAICompatibleProviderConfig(providerId, direct)) return {
		providerId,
		config: direct
	};
	const normalizedEntry = Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProviderId);
	if (!normalizedEntry) return;
	const [configuredProviderId, config] = normalizedEntry;
	return isOpenAICompatibleProviderConfig(configuredProviderId, config) ? {
		providerId: configuredProviderId,
		config
	} : void 0;
}
function embeddingInputToText(input) {
	if (typeof input === "string") return input;
	if (!input.parts || input.parts.length === 0) return input.text;
	const textParts = [];
	for (const part of input.parts) {
		if (part.type !== "text") throw new Error("openai-compatible embeddings only support text embedding inputs.");
		textParts.push(part.text);
	}
	return textParts.join("");
}
async function createEmbeddingHttpError(response, requestHeaders, errorPrefix) {
	const prefix = response.body && !response.bodyUsed ? await readResponseTextPrefix(response, EMBEDDING_ERROR_BODY_MAX_BYTES).catch(() => void 0) : void 0;
	const safeBody = prefix?.text ? redactProviderResponseErrorText(prefix.text, requestHeaders, { sourceTruncated: prefix.truncated }) : void 0;
	const error = await createProviderHttpError$1(new Response(safeBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	}), errorPrefix, { requestHeaders });
	let snippet = safeBody;
	if (snippet && snippet.length > EMBEDDING_ERROR_BODY_MAX_CHARS) snippet = `${truncateUtf16Safe(snippet, EMBEDDING_ERROR_BODY_MAX_CHARS)}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	else if (snippet && prefix?.truncated) snippet = `${snippet}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	error.message = `${errorPrefix}: HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`;
	return error;
}
const fetchWithCallerDeadline = (url, init) => fetchWithRuntimeDispatcher(url, {
	...init,
	dispatcher: init?.dispatcher?.compose((dispatch) => (options, handler) => dispatch({
		...options,
		headersTimeout: 0,
		bodyTimeout: 0
	}, handler))
});
async function postEmbeddingRequest(params) {
	const { client, input, callOptions } = params;
	const deadlineControl = callOptions?.[MEMORY_SEARCH_DEADLINE_CONTROL];
	const errorPrefix = "openai-compatible embeddings failed";
	const context = `${client.providerId} embeddings failed (model: ${client.model}, batch size: ${input.length})`;
	const inputType = resolveRequestInputType(client, callOptions?.inputType);
	const body = {
		model: client.model,
		input,
		...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
		...inputType ? { input_type: inputType } : {}
	};
	const localServiceLease = client.localServiceTarget && client.acquireLocalService ? await client.acquireLocalService({
		...client.localServiceTarget,
		...deadlineControl ? { onReadinessWait: (waiting) => deadlineControl.report(waiting ? "pause" : "resume") } : {}
	}, callOptions?.signal) : void 0;
	try {
		debugEmbeddingsLog("memory embeddings: remote request", {
			context,
			inputCount: input.length
		});
		const target = resolveAzureApiVersionRequestTarget({
			url: client.endpointUrl,
			headers: client.headers
		});
		return await withRemoteHttpResponse({
			url: target.url,
			init: {
				method: "POST",
				headers: target.headers,
				body: JSON.stringify(body)
			},
			signal: callOptions?.signal,
			fetchImpl: callOptions?.signal ? fetchWithCallerDeadline : void 0,
			ssrfPolicy: client.ssrfPolicy,
			auditContext: "embedding-provider:openai-compatible",
			onResponse: async (response) => {
				debugEmbeddingsLog("memory embeddings: remote response", {
					context,
					...embeddingResponseLogMeta(response)
				});
				try {
					if (!response.ok) throw await createEmbeddingHttpError(response, client.headers, errorPrefix);
					const payload = await readProviderJsonResponse(response, errorPrefix);
					const vectors = readEmbeddingVectors(asOptionalRecord(payload)?.data, input.length, context);
					callOptions?.onUsage?.(extractEmbeddingUsage(payload));
					return vectors;
				} catch (error) {
					if (callOptions?.signal?.aborted) throw error;
					throw addEmbeddingErrorContext(error, errorPrefix, context);
				}
			}
		});
	} finally {
		localServiceLease?.release();
	}
}
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
async function createOpenAICompatibleEmbeddingClient(options) {
	const resolvedProvider = resolveConfiguredProvider(options);
	const configuredProvider = resolvedProvider?.config;
	const providerId = resolvedProvider?.providerId ?? options.provider?.trim() ?? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const remoteBaseUrl = normalizeOptionalString(options.remote?.baseUrl);
	const providerBaseUrl = normalizeOptionalString(configuredProvider?.baseUrl);
	const baseUrl = normalizeBaseUrl(remoteBaseUrl ?? providerBaseUrl);
	const { embeddingProviderOwnsDestination, resolveEmbeddingEndpointUrl, resolveEmbeddingProviderSsrFPolicy } = await import("./plugin-sdk/memory-core-host-engine-embeddings.js");
	const providerOwnsDestination = providerBaseUrl !== void 0 && embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl
	});
	const model = normalizeModel(options.model, options.provider);
	const inputType = normalizeOptionalString(options.inputType);
	const queryInputType = normalizeOptionalString(options.queryInputType);
	const documentInputType = normalizeOptionalString(options.documentInputType);
	const headers = buildHeaders({
		apiKey: normalizeResolvedSecretInputString({
			value: options.remote?.apiKey,
			path: "memory.search.remote.apiKey"
		}),
		provider: providerOwnsDestination ? configuredProvider?.headers : void 0,
		remote: options.remote?.headers
	});
	if (providerOwnsDestination && !headers.authorization) {
		const providerApiKey = await resolveConfiguredProviderApiKey({
			providerId,
			options,
			configuredProvider
		});
		if (providerApiKey) headers.authorization = `Bearer ${providerApiKey}`;
	}
	const localServiceOptions = options;
	return {
		providerId,
		baseUrl,
		endpointUrl: resolveEmbeddingEndpointUrl(baseUrl, "embeddings"),
		headers,
		ssrfPolicy: resolveEmbeddingProviderSsrFPolicy({
			provider: providerId,
			api: configuredProvider?.api ?? "openai-completions",
			baseUrl,
			allowPrivateNetwork: configuredProvider?.request?.allowPrivateNetwork
		}),
		model,
		...configuredProvider?.localService && !remoteBaseUrl ? {
			localServiceTarget: {
				providerId,
				baseUrl,
				headers
			},
			acquireLocalService: localServiceOptions.acquireLocalService
		} : {},
		...options.dimensions !== void 0 ? { dimensions: normalizeDimensions(options.dimensions) } : {},
		...inputType ? { inputType } : {},
		...queryInputType ? { queryInputType } : {},
		...documentInputType ? { documentInputType } : {}
	};
}
//#endregion
//#region src/plugins/core-embedding-providers.ts
const CORE_EMBEDDING_PROVIDERS = [{
	adapter: {
		id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
		transport: "remote",
		create: async (options) => {
			const client = await createOpenAICompatibleEmbeddingClient(options);
			const embedBatch = async (inputs, callOptions) => {
				if (inputs.length === 0) return [];
				return await postEmbeddingRequest({
					client,
					input: inputs.map(embeddingInputToText),
					callOptions
				});
			};
			const cacheHeaders = sanitizeCacheHeaders(client.headers);
			return {
				provider: {
					id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
					model: client.model,
					...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
					embed: async (input, callOptions) => {
						const [embedding] = await embedBatch([input], callOptions);
						if (!embedding) throw new Error("openai-compatible embeddings failed: malformed JSON response");
						return embedding;
					},
					embedBatch
				},
				runtime: {
					id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
					inlineBatchTimeoutMs: 6e5,
					cacheKeyData: {
						provider: client.providerId,
						baseUrl: client.baseUrl,
						model: client.model,
						...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
						...client.inputType ? { inputType: client.inputType } : {},
						...client.queryInputType ? { queryInputType: client.queryInputType } : {},
						...client.documentInputType ? { documentInputType: client.documentInputType } : {},
						...cacheHeaders ? { headers: cacheHeaders } : {}
					}
				}
			};
		}
	},
	ownerPluginId: "core"
}];
function getCoreEmbeddingProvider(id) {
	return CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id);
}
//#endregion
//#region src/plugins/embedding-providers.ts
function getEmbeddingProviders() {
	return requireActivePluginRegistry().embeddingProviders.map((entry) => ({
		adapter: entry.provider,
		ownerPluginId: entry.pluginId || void 0
	}));
}
/** Looks up the registered embedding provider entry, including owner metadata. */
function getRegisteredEmbeddingProvider(id) {
	return getCoreEmbeddingProvider(id) ?? getEmbeddingProviders().find((entry) => entry.adapter.id === id);
}
/** Lists registered embedding providers with core defaults merged first. */
function listRegisteredEmbeddingProviders() {
	const merged = new Map(CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]));
	for (const entry of getEmbeddingProviders()) if (!merged.has(entry.adapter.id)) merged.set(entry.adapter.id, entry);
	return Array.from(merged.values());
}
//#endregion
//#region src/plugins/gateway-startup-plugin-providers.ts
function collectConfiguredWebSearchProviderIds(config) {
	const search = config.tools?.web?.search;
	if (search?.enabled === false || typeof search?.provider !== "string") return /* @__PURE__ */ new Set();
	const providerId = normalizeOptionalLowercaseString(search.provider);
	return providerId ? /* @__PURE__ */ new Set([providerId]) : /* @__PURE__ */ new Set();
}
/** True when web search is enabled without a pinned provider, so auto-detection picks one per call. */
function isWebSearchProviderAutoSelected(config) {
	return config.tools?.web?.search?.enabled !== false && collectConfiguredWebSearchProviderIds(config).size === 0;
}
function collectModelProviderIds(value) {
	return new Set(listModelRefsFromConfigValue(value).map((ref) => {
		const slashIndex = ref.indexOf("/");
		return slashIndex > 0 ? normalizeProviderId(ref.slice(0, slashIndex)) : "";
	}).filter((providerId) => Boolean(providerId)));
}
function buildManifestModelProviderLookup(manifestRegistry, config, modelIdsByProvider) {
	const providerFilters = [...modelIdsByProvider.keys()];
	const mergeKeyFilter = new Set([...modelIdsByProvider].flatMap(([providerId, modelIds]) => [...modelIds].map((modelId) => buildModelCatalogMergeKey(providerId, modelId))));
	return {
		modelApis: new Map(planEffectiveModelCatalogRows({
			registry: manifestRegistry,
			config,
			providerFilters,
			mergeKeyFilter
		}).rows.flatMap((row) => row.api ? [[row.mergeKey, row.api]] : [])),
		cliBackendIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.cliBackends.map(normalizeProviderId))),
		providerIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.map(normalizeProviderId)))
	};
}
function collectConfiguredAgentModelProviderIds(config, manifestRegistry) {
	const modelIdsByProvider = /* @__PURE__ */ new Map();
	const addModelProviderRefs = (value) => {
		for (const ref of listModelRefsFromConfigValue(value)) {
			const parsed = parseModelCatalogRef(ref);
			if (!parsed) continue;
			const modelIds = modelIdsByProvider.get(parsed.provider) ?? /* @__PURE__ */ new Set();
			modelIds.add(parsed.modelId);
			modelIdsByProvider.set(parsed.provider, modelIds);
		}
	};
	const addModelMapProviderIds = (models) => {
		if (!isRecord(models)) return;
		for (const modelRef of Object.keys(models)) addModelProviderRefs(modelRef);
	};
	const defaults = config.agents?.defaults;
	addModelProviderRefs(defaults?.model);
	addModelProviderRefs(defaults?.utilityModel);
	addModelMapProviderIds(defaults?.models);
	for (const agent of listAgentEntries(config)) {
		if (!isRecord(agent)) continue;
		addModelProviderRefs(agent.model);
		addModelProviderRefs(agent.utilityModel);
		addModelMapProviderIds(agent.models);
	}
	if (modelIdsByProvider.size === 0) return /* @__PURE__ */ new Set();
	const manifestModelProviders = buildManifestModelProviderLookup(manifestRegistry, config, modelIdsByProvider);
	return new Set([...modelIdsByProvider].filter(([providerId, modelIds]) => [...modelIds].some((modelId) => configuredModelProviderNeedsRuntimePlugin({
		config,
		manifestModelProviders,
		providerId,
		modelId
	}))).map(([providerId]) => providerId));
}
function configuredModelProviderNeedsRuntimePlugin(params) {
	if (params.manifestModelProviders.cliBackendIds.has(params.providerId)) return true;
	const providerConfig = params.config.models?.providers?.[params.providerId];
	const modelApi = (providerConfig?.models?.find((model) => model.id === params.modelId))?.api ?? providerConfig?.api ?? params.manifestModelProviders.modelApis.get(buildModelCatalogMergeKey(params.providerId, params.modelId));
	if (typeof modelApi === "string") return !CORE_BUILT_IN_MODEL_APIS.has(modelApi);
	return params.manifestModelProviders.providerIds.has(params.providerId);
}
function manifestOwnsConfiguredModelProvider(params) {
	if (params.configuredModelProviderIds.size === 0) return false;
	return [...params.manifest?.providers ?? [], ...params.manifest?.cliBackends ?? []].some((providerId) => params.configuredModelProviderIds.has(normalizeProviderId(providerId)));
}
function collectConfiguredGenerationProviderIds(config) {
	const defaults = config.agents?.defaults;
	return {
		imageGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.image),
		videoGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.video),
		musicGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.music)
	};
}
function collectConfiguredVoiceProviderIds(config) {
	const providerIds = collectModelProviderIds(config.agents?.defaults?.voiceModel);
	const realtimeProviderIds = new Set(providerIds);
	const talkRealtimeProviderId = resolveConfiguredTalkRealtimeProviderId(config);
	if (talkRealtimeProviderId) realtimeProviderIds.add(talkRealtimeProviderId.toLowerCase());
	return {
		speechProviders: providerIds,
		realtimeTranscriptionProviders: providerIds,
		realtimeVoiceProviders: realtimeProviderIds
	};
}
const MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS = /* @__PURE__ */ new Set(["auto", "none"]);
function normalizeExplicitMemoryEmbeddingProviderId(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(normalized) ? normalized : void 0;
}
function readMemorySearchEnabled(memorySearch) {
	const enabled = memorySearch?.enabled;
	return typeof enabled === "boolean" ? enabled : void 0;
}
/**
* Resolve a configured memory embedding provider id to the adapter id(s) a
* plugin manifest contract or runtime registry can own. Mirrors runtime
* `getConfiguredMemoryEmbeddingProvider`: the raw id maps to a direct adapter,
* and a custom `models.providers.<id>` entry additionally maps to its `api`
* owner adapter (`provider: "ollama-5080"` with `api: "ollama"` -> "ollama").
* Both candidates are returned so matching covers the direct adapter and the
* API owner without the runtime adapter registry.
*/
function resolveMemoryEmbeddingProviderOwnerIds(providerId, config) {
	const ownerIds = [providerId];
	const genericOwnerId = normalizeOptionalLowercaseString(resolveConfiguredGenericEmbeddingProviderId(providerId, config));
	if (genericOwnerId && genericOwnerId !== providerId) ownerIds.push(genericOwnerId);
	const ownerApi = normalizeOptionalLowercaseString(findNormalizedProviderValue(config.models?.providers, providerId)?.api);
	if (ownerApi && ownerApi !== providerId) ownerIds.push(ownerApi);
	return ownerIds;
}
function resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override) {
	if (!(readMemorySearchEnabled(override) ?? readMemorySearchEnabled(defaults) ?? true)) return [];
	const rawProvider = normalizeOptionalLowercaseString(override?.provider ?? defaults?.provider);
	const effectiveProvider = rawProvider === "auto" || !rawProvider ? "openai" : rawProvider;
	if (effectiveProvider === "none") return [];
	const entries = [];
	const provider = normalizeExplicitMemoryEmbeddingProviderId(rawProvider);
	if (provider) entries.push({
		configuredId: provider,
		source: "provider"
	});
	const fallback = normalizeExplicitMemoryEmbeddingProviderId(override?.fallback ?? defaults?.fallback ?? "none");
	if (fallback && fallback !== effectiveProvider) entries.push({
		configuredId: fallback,
		source: "fallback"
	});
	return entries;
}
/**
* Collect explicit memory embedding provider owners required by startup. The
* resolver mirrors runtime memory-search inheritance for enablement, primary
* provider, and fallback provider, then maps custom `models.providers` ids to
* their API-owner adapter ids.
*/
function collectConfiguredMemoryEmbeddingStartupProviderOwners(config) {
	if (normalizeOptionalLowercaseString(config.plugins?.slots?.memory) === "none") return [];
	const byConfiguredIdAndSource = /* @__PURE__ */ new Map();
	const defaultsBlock = config.memory?.search;
	const defaults = isRecord(defaultsBlock) ? defaultsBlock : void 0;
	const addEffectiveProviders = (override, agentId) => {
		for (const { configuredId, source } of resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override)) {
			const key = `${source}\0${configuredId}`;
			const existing = byConfiguredIdAndSource.get(key);
			if (existing) {
				if (agentId) existing.agentIds.add(agentId);
				continue;
			}
			byConfiguredIdAndSource.set(key, {
				configuredId,
				ownerIds: new Set(resolveMemoryEmbeddingProviderOwnerIds(configuredId, config)),
				agentIds: new Set(agentId ? [agentId] : []),
				source
			});
		}
	};
	const agentEntries = listAgentEntries(config);
	addEffectiveProviders(void 0, agentEntries.length === 0 ? listAgentIds(config)[0] : void 0);
	for (const agent of agentEntries) {
		const memory = isRecord(agent.memory) ? agent.memory : void 0;
		addEffectiveProviders(isRecord(memory?.search) ? memory.search : void 0, normalizeAgentId(agent.id));
	}
	return [...byConfiguredIdAndSource.values()];
}
function collectConfiguredMemoryEmbeddingProviderIds(config) {
	const ids = /* @__PURE__ */ new Set();
	for (const provider of collectConfiguredMemoryEmbeddingStartupProviderOwners(config)) for (const ownerId of provider.ownerIds) ids.add(ownerId);
	return ids;
}
/**
* Report configured memory embedding providers that no loaded plugin can serve.
* A provider is unregistered only when none of its resolved adapter ids (the
* configured id and its `models.providers.<id>.api` owner) was registered, so
* custom providers warn when their API-owner plugin is missing but stay quiet
* once that plugin loads.
*/
function collectUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const configured = collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config);
	if (configured.length === 0) return [];
	const registered = new Set([...params.registeredProviderIds].map((id) => normalizeOptionalLowercaseString(id)).filter((id) => Boolean(id)));
	return configured.filter((provider) => ![...provider.ownerIds].some((ownerId) => registered.has(ownerId))).map((provider) => ({
		configuredId: provider.configuredId,
		source: provider.source
	})).toSorted((left, right) => left.configuredId.localeCompare(right.configuredId) || left.source.localeCompare(right.source));
}
function collectRegisteredEmbeddingProviderIds(registry) {
	return /* @__PURE__ */ new Set([...(registry.embeddingProviders ?? []).map((entry) => entry.provider.id), ...listRegisteredEmbeddingProviders().map((entry) => entry.adapter.id)]);
}
//#endregion
//#region src/plugins/gateway-startup-plugin-config.ts
function readStartupBundledDiscoveryMode(config, env) {
	const stateMode = readBundledDiscoveryModeMemoized(env);
	if (stateMode) return stateMode;
	const legacyMode = config.plugins?.bundledDiscovery;
	if (legacyMode === "compat" || legacyMode === "allowlist") return legacyMode;
}
function listPotentialEnabledChannelIds(config, env, ambientEnvTriggers) {
	const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(config));
	const enabledSignals = [...listPotentialConfiguredChannelIds(config, env, {
		includePersistedAuthState: false,
		ambientEnvTriggers
	}), ...listExplicitConfiguredChannelIdsForConfig(config)].map((id) => normalizeOptionalLowercaseString(id) ?? "").filter((id) => id && !disabled.has(id));
	return sortUniquePluginIds(enabledSignals);
}
function blocksPluginStartup(params) {
	const policyId = normalizePluginPolicyId(params.pluginId);
	return params.pluginsConfig.deny.includes(policyId) || params.activationSourcePlugins.deny.includes(policyId) || params.pluginsConfig.entries[policyId]?.enabled === false || params.activationSourcePlugins.entries[policyId]?.enabled === false;
}
function resolveAuthorizedGatewayStartupDreamingPluginIds(params) {
	const dreamingConfig = resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(params.config),
		cfg: params.config
	});
	const dreamingSelectedPluginId = normalizeOptionalLowercaseString(resolveMemoryDreamingPluginId(params.config));
	const engineId = DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
	if (!dreamingConfig.enabled || !dreamingSelectedPluginId || dreamingSelectedPluginId === engineId || !params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return /* @__PURE__ */ new Set();
	if (!params.selectedMemoryPluginId || params.selectedMemoryPluginId !== dreamingSelectedPluginId || params.selectedMemoryPluginId === engineId || blocksPluginStartup({
		pluginId: engineId,
		pluginsConfig: params.pluginsConfig,
		activationSourcePlugins: params.activationSourcePlugins
	})) return /* @__PURE__ */ new Set();
	const selectedPlugin = params.index.plugins.find((plugin) => plugin.pluginId === params.selectedMemoryPluginId);
	const sidecarPlugin = params.index.plugins.find((plugin) => plugin.pluginId === engineId);
	if (!selectedPlugin?.startup.memory || !sidecarPlugin?.startup.memory) return /* @__PURE__ */ new Set();
	return resolveEffectivePluginActivationState({
		id: selectedPlugin.pluginId,
		origin: selectedPlugin.origin,
		channelIds: selectedPlugin.contributions?.channels,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedPlugin, params.platform),
		activationSource: params.activationSource
	}).enabled ? /* @__PURE__ */ new Set([engineId]) : /* @__PURE__ */ new Set();
}
function resolveMemorySlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.memory?.trim();
	if (configuredSlot?.toLowerCase() === "none") return;
	if (!configuredSlot) {
		const defaultSlot = activationSourcePlugins.slots.memory;
		if (typeof defaultSlot !== "string") return;
		if (activationSourcePlugins.allow.length > 0 && !activationSourcePlugins.allow.includes(defaultSlot)) return;
		return defaultSlot;
	}
	return normalizePluginId(configuredSlot);
}
function resolveContextEngineSlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.contextEngine?.trim();
	if (!configuredSlot) return;
	return resolveSelectedContextEnginePluginIdFromConfig(activationSourcePlugins, normalizePluginId(configuredSlot));
}
function shouldConsiderForGatewayStartup(params) {
	return params.manifest?.activation?.onStartup === true || params.contextEngineSlotStartupPluginId === params.plugin.pluginId || params.plugin.startup.memory && (params.startupDreamingPluginIds.has(params.plugin.pluginId) || params.memorySlotStartupPluginId === params.plugin.pluginId);
}
function hasConfiguredActivationPath(params) {
	return hasConfiguredActivationPathPatterns({
		paths: params.manifest?.activation?.onConfigPaths,
		config: params.config
	});
}
function hasConfiguredActivationPathPatterns(params) {
	const paths = params.paths;
	if (!paths?.length) return false;
	return paths.some((pathPattern) => collectPluginConfigContractMatches({
		root: params.config,
		pathPattern
	}).some((match) => isConfigActivationValueEnabled(match.value)));
}
function addConfiguredActivationPathPluginIds(target, params) {
	for (const plugin of params.index.plugins) {
		if (plugin.origin !== "bundled") continue;
		if (hasConfiguredActivationPathPatterns({
			paths: plugin.startup.configPaths,
			config: params.activationSourceConfig
		})) target.add(plugin.pluginId);
	}
}
function addPluginConfigEntryIds(target, plugins, normalizePluginId) {
	for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled !== false) target.add(normalizePluginId(pluginId));
}
function addConfiguredSlotPluginIds(target, params) {
	for (const resolveSlot of [resolveMemorySlotStartupPluginId, resolveContextEngineSlotStartupPluginId]) {
		const pluginId = resolveSlot({
			activationSourceConfig: params.activationSourceConfig,
			activationSourcePlugins: params.activationSourcePlugins,
			normalizePluginId: params.lookup.normalizePluginId
		});
		if (pluginId) target.add(pluginId);
	}
}
function collectConfiguredStartupChannelIds(params) {
	return sortUniquePluginIds(params.configs.flatMap((config) => listPotentialEnabledChannelIds(config, params.env, params.ambientEnvTriggers)));
}
function collectConfiguredProviderIds(config) {
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(config);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(config);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(config);
	return sortUniquePluginIds([
		...collectConfiguredSpeechProviderIds(config),
		...configuredWebSearchProviderIds,
		...configuredGenerationProviderIds.imageGenerationProviders,
		...configuredGenerationProviderIds.videoGenerationProviders,
		...configuredGenerationProviderIds.musicGenerationProviders,
		...configuredVoiceProviderIds.speechProviders,
		...configuredVoiceProviderIds.realtimeTranscriptionProviders,
		...configuredVoiceProviderIds.realtimeVoiceProviders,
		...collectConfiguredMemoryEmbeddingProviderIds(config)
	]);
}
function collectValidationConfiguredRefs(config) {
	const providerIds = [];
	const pushProviderId = (value) => {
		const normalized = normalizeOptionalLowercaseString(value);
		if (normalized) providerIds.push(normalized);
	};
	const profiles = config.auth?.profiles;
	if (profiles && typeof profiles === "object") {
		for (const profile of Object.values(profiles)) if (isRecord(profile)) pushProviderId(profile.provider);
	}
	const providers = config.models?.providers;
	if (providers && typeof providers === "object") for (const providerId of Object.keys(providers)) pushProviderId(providerId);
	const shorthandModelRefs = [];
	for (const ref of collectConfiguredModelRefs(config)) {
		const slashIndex = ref.value.indexOf("/");
		if (slashIndex > 0) pushProviderId(ref.value.slice(0, slashIndex));
		else if (slashIndex < 0) shorthandModelRefs.push(ref.value);
	}
	pushProviderId(config.tools?.web?.search?.provider);
	pushProviderId(config.tools?.web?.fetch?.provider);
	return {
		providerIds: sortUniquePluginIds(providerIds),
		shorthandModelRefs
	};
}
function collectValidationConfiguredShorthandModelIds(modelRefs) {
	return sortUniquePluginIds(modelRefs.map((ref) => splitTrailingAuthProfile(ref).model.trim()).filter(Boolean));
}
//#endregion
export { readMemoryHostResponseTextSnippet as A, isWebSearchProviderAutoSelected as C, getCoreEmbeddingProvider as D, listRegisteredEmbeddingProviders as E, sanitizeAndNormalizeEmbedding as F, debugEmbeddingsLog as I, buildRemoteBaseUrlPolicy as M, withRemoteHttpResponse as N, fetchRemoteEmbeddingVectors as O, createProviderHttpError as P, collectUnregisteredConfiguredMemoryEmbeddingProviders as S, getRegisteredEmbeddingProvider as T, collectConfiguredMemoryEmbeddingProviderIds as _, collectConfiguredProviderIds as a, collectConfiguredWebSearchProviderIds as b, collectValidationConfiguredShorthandModelIds as c, resolveAuthorizedGatewayStartupDreamingPluginIds as d, resolveContextEngineSlotStartupPluginId as f, collectConfiguredGenerationProviderIds as g, collectConfiguredAgentModelProviderIds as h, blocksPluginStartup as i, readResponseJsonWithLimit as j, postJson as k, hasConfiguredActivationPath as l, shouldConsiderForGatewayStartup as m, addConfiguredSlotPluginIds as n, collectConfiguredStartupChannelIds as o, resolveMemorySlotStartupPluginId as p, addPluginConfigEntryIds as r, collectValidationConfiguredRefs as s, addConfiguredActivationPathPluginIds as t, readStartupBundledDiscoveryMode as u, collectConfiguredMemoryEmbeddingStartupProviderOwners as v, manifestOwnsConfiguredModelProvider as w, collectRegisteredEmbeddingProviderIds as x, collectConfiguredVoiceProviderIds as y };

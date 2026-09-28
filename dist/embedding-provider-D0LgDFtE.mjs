import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as createProviderHttpError, p as readProviderJsonObjectResponse, y as readProviderResponseErrorText } from "./provider-http-errors-CTY_-ABT.mjs";
import { V as requireApiKey } from "./loader-runtime-load-DitY2Htf.mjs";
import { F as sanitizeAndNormalizeEmbedding, M as withRemoteHttpResponse, j as buildRemoteBaseUrlPolicy } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as providerOperationRetryConfig } from "./operation-retry-Dopl7EnK.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "./api-key-rotation-BtFWlIBW.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-BveQzsWa.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { c as embeddingProviderOwnsDestination, l as resolveEmbeddingEndpointUrl, o as debugEmbeddingsLog } from "./memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-BnUd_lfW.mjs";
import "./memory-core-host-secret-CpDjr8tN.mjs";
import { t as parseGeminiAuth } from "./gemini-auth-CGSaK1is.mjs";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-BGxuny7v.mjs";
//#region extensions/google/embedding-provider.ts
const DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MAX_INPUT_TOKENS = {
	"gemini-embedding-001": 2048,
	"gemini-embedding-2": 8192,
	"gemini-embedding-2-preview": 8192
};
const GEMINI_EMBEDDING_2_MODELS = /* @__PURE__ */ new Set(["gemini-embedding-2", "gemini-embedding-2-preview"]);
const GEMINI_EMBEDDING_2_DEFAULT_DIMENSIONS = 3072;
const GOOGLE_RETRY_INFO_TYPE = "type.googleapis.com/google.rpc.RetryInfo";
const GOOGLE_RETRY_DELAY_RE = /^(\d+)(?:\.(\d{1,9}))?s$/u;
const GOOGLE_RETRY_INFO_BODY_LIMIT_BYTES = 16384;
const GEMINI_EMBEDDING_2_TASK_PREFIXES = {
	RETRIEVAL_QUERY: "task: search result | query:",
	RETRIEVAL_DOCUMENT: "title: none | text:",
	SEMANTIC_SIMILARITY: "task: sentence similarity | query:",
	CLASSIFICATION: "task: classification | query:",
	CLUSTERING: "task: clustering | query:",
	QUESTION_ANSWERING: "task: question answering | query:",
	FACT_VERIFICATION: "task: fact checking | query:"
};
function malformedGeminiEmbeddingResponse() {
	return /* @__PURE__ */ new Error("gemini embeddings failed: malformed JSON response");
}
function unexpectedGeminiEmbeddingDimensions(expected, actual) {
	return /* @__PURE__ */ new Error(`gemini embeddings failed: expected ${expected} dimensions, received ${actual}`);
}
/** Direct and downloaded vectors share one invariant before normalization. */
function isValidGeminiEmbeddingValues(value) {
	return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === "number" && Number.isFinite(entry));
}
function readGeminiEmbeddingValues(value) {
	if (!isValidGeminiEmbeddingValues(value)) throw malformedGeminiEmbeddingResponse();
	return value;
}
function readGeminiSingleEmbedding(payload) {
	const embedding = asOptionalRecord(payload.embedding);
	if (!embedding) throw malformedGeminiEmbeddingResponse();
	return readGeminiEmbeddingValues(embedding.values);
}
function readGeminiBatchEmbeddings(payload, expectedCount) {
	if (!Array.isArray(payload.embeddings) || payload.embeddings.length !== expectedCount) throw malformedGeminiEmbeddingResponse();
	return payload.embeddings.map((entry) => {
		const embedding = asOptionalRecord(entry);
		if (!embedding) throw malformedGeminiEmbeddingResponse();
		return readGeminiEmbeddingValues(embedding.values);
	});
}
function buildGeminiEmbeddingRequest(params) {
	const input = typeof params.input === "string" ? { text: params.input } : params.input;
	const parts = input.parts?.map((part) => part.type === "text" ? { text: part.text } : { inlineData: {
		mimeType: part.mimeType,
		data: part.data
	} }) ?? [{ text: input.text }];
	const isStableEmbedding2 = normalizeGeminiModel(params.model) === "gemini-embedding-2";
	const request = { content: { parts } };
	if (isStableEmbedding2 && parts.every((part) => "text" in part)) {
		const first = parts[0];
		if (first && "text" in first) {
			const taskType = params.role === "document" && (params.taskType === "RETRIEVAL_QUERY" || params.taskType === "QUESTION_ANSWERING" || params.taskType === "FACT_VERIFICATION") ? "RETRIEVAL_DOCUMENT" : params.taskType;
			first.text = `${GEMINI_EMBEDDING_2_TASK_PREFIXES[taskType]} ${first.text}`;
		}
	} else if (!isStableEmbedding2) request.taskType = params.taskType;
	if (params.modelPath) request.model = params.modelPath;
	if (params.outputDimensionality != null) request.outputDimensionality = params.outputDimensionality;
	return request;
}
/** Returns true for Gemini Embedding 2 variants with multimodal and extended task support. */
function isGeminiEmbedding2Model(model) {
	return GEMINI_EMBEDDING_2_MODELS.has(normalizeGeminiModel(model));
}
function resolveGeminiOutputDimensionality(model, requested) {
	const isEmbedding2 = isGeminiEmbedding2Model(model);
	if (!isEmbedding2 && model !== "gemini-embedding-001") return;
	if (requested == null) return isEmbedding2 ? GEMINI_EMBEDDING_2_DEFAULT_DIMENSIONS : void 0;
	if (!Number.isInteger(requested) || requested < 128 || requested > 3072) throw new Error(`Invalid outputDimensionality ${requested} for ${model}. Use an integer between 128 and 3072.`);
	return requested;
}
function resolveRemoteApiKey(remoteApiKey) {
	return resolveMemorySecretInputString({
		value: remoteApiKey,
		path: "memory.search.remote.apiKey"
	});
}
function normalizeGeminiModel(model) {
	const trimmed = model.trim();
	if (!trimmed) return DEFAULT_GEMINI_EMBEDDING_MODEL;
	const withoutPrefix = trimmed.replace(/^models\//, "");
	if (withoutPrefix.startsWith("gemini/")) return withoutPrefix.slice(7);
	if (withoutPrefix.startsWith("google/")) return withoutPrefix.slice(7);
	return withoutPrefix;
}
/**
* Parses the delay hint from a `google.rpc.RetryInfo` detail inside a Gemini error
* body. Callers should prefer a full (bounded) body read over the 500-char
* `ProviderHttpError.errorBody` preview: real Gemini 429 payloads run ~1KB+ with
* the RetryInfo detail near the end of `error.details`, so the truncated preview
* regularly cuts the hint away.
*/
function extractGoogleRetryInfoDelayMs(errorBody) {
	if (typeof errorBody !== "string" || !errorBody) return;
	try {
		const details = asOptionalRecord(asOptionalRecord(JSON.parse(errorBody))?.error)?.details;
		if (!Array.isArray(details)) return;
		let retryAfterMs;
		for (const rawDetail of details) {
			const detail = asOptionalRecord(rawDetail);
			const retryDelay = normalizeOptionalString(detail?.retryDelay);
			const match = retryDelay ? GOOGLE_RETRY_DELAY_RE.exec(retryDelay) : void 0;
			if (normalizeOptionalString(detail?.["@type"]) !== GOOGLE_RETRY_INFO_TYPE || !match) continue;
			const delayMs = Number(match[1]) * 1e3 + (match[2] ? Math.ceil(Number(`0.${match[2]}`) * 1e3) : 0);
			if (Number.isSafeInteger(delayMs) && delayMs >= 0) retryAfterMs = Math.max(retryAfterMs ?? delayMs, delayMs);
		}
		return retryAfterMs;
	} catch {
		return;
	}
}
function sanitizeGeminiEmbedding(values, expectedDimensions) {
	if (expectedDimensions != null && values.length !== expectedDimensions) throw unexpectedGeminiEmbeddingDimensions(expectedDimensions, values.length);
	return sanitizeAndNormalizeEmbedding(values);
}
async function fetchGeminiEmbeddingPayload(params) {
	return await executeWithApiKeyRotation({
		provider: "google",
		apiKeys: params.client.apiKeys,
		transientRetry: providerOperationRetryConfig("read"),
		execute: async (apiKey) => {
			const headers = {
				...parseGeminiAuth(apiKey).headers,
				...params.client.headers
			};
			return await withRemoteHttpResponse({
				url: params.endpoint,
				ssrfPolicy: params.client.ssrfPolicy,
				signal: params.signal,
				init: {
					method: "POST",
					headers,
					body: JSON.stringify(params.body)
				},
				onResponse: async (res) => {
					if (!res.ok) {
						let errorBodyClone;
						try {
							errorBodyClone = res.clone();
						} catch {
							errorBodyClone = void 0;
						}
						try {
							const error = await createProviderHttpError(res, "gemini embeddings failed", {
								requestHeaders: headers,
								signal: params.signal
							});
							let retryInfoSource = error.errorBody;
							if (errorBodyClone) try {
								retryInfoSource = await readProviderResponseErrorText(errorBodyClone, GOOGLE_RETRY_INFO_BODY_LIMIT_BYTES, headers, params.signal);
							} catch {
								params.signal?.throwIfAborted();
								retryInfoSource = error.errorBody;
							}
							params.signal?.throwIfAborted();
							const retryAfterMs = extractGoogleRetryInfoDelayMs(retryInfoSource);
							if (retryAfterMs !== void 0) error.retryAfterMs = Math.max(retryAfterMs, error.retryAfterMs ?? 0);
							throw error;
						} finally {
							errorBodyClone?.body?.cancel().catch(() => void 0);
						}
					}
					return await readProviderJsonObjectResponse(res, "gemini embeddings failed");
				}
			});
		}
	});
}
function normalizeGeminiBaseUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return DEFAULT_GOOGLE_API_BASE_URL;
	try {
		const url = new URL(trimmed);
		url.hash = "";
		const openAiIndex = url.pathname.indexOf("/openai");
		url.pathname = (openAiIndex < 0 ? url.pathname : url.pathname.slice(0, openAiIndex)).replace(/\/+$/, "");
		if (url.origin.toLowerCase() === "https://generativelanguage.googleapis.com" && url.pathname === "/") url.pathname = "/v1beta";
		return url.search ? url.href : url.href.replace(/\/$/, "");
	} catch {
		return trimmed;
	}
}
function buildGeminiModelPath(model) {
	return model.startsWith("models/") ? model : `models/${model}`;
}
async function createGeminiEmbeddingProvider(options) {
	const client = await resolveGeminiEmbeddingClient(options);
	const embedUrl = resolveEmbeddingEndpointUrl(client.baseUrl, `${client.modelPath}:embedContent`);
	const batchUrl = resolveEmbeddingEndpointUrl(client.baseUrl, `${client.modelPath}:batchEmbedContents`);
	const outputDimensionality = client.outputDimensionality;
	const embedQuery = async (text, callOptions) => {
		if (!text.trim()) return [];
		return sanitizeGeminiEmbedding(readGeminiSingleEmbedding(await fetchGeminiEmbeddingPayload({
			client,
			endpoint: embedUrl,
			body: buildGeminiEmbeddingRequest({
				input: text,
				model: client.model,
				role: "query",
				taskType: options.taskType ?? "RETRIEVAL_QUERY",
				outputDimensionality
			}),
			signal: callOptions?.signal
		})), outputDimensionality);
	};
	const embedDocuments = async (inputs, callOptions) => {
		if (inputs.length === 0) return [];
		return readGeminiBatchEmbeddings(await fetchGeminiEmbeddingPayload({
			client,
			endpoint: batchUrl,
			body: { requests: inputs.map((input) => buildGeminiEmbeddingRequest({
				input,
				model: client.model,
				role: "document",
				modelPath: client.modelPath,
				taskType: options.taskType ?? "RETRIEVAL_DOCUMENT",
				outputDimensionality
			})) },
			signal: callOptions?.signal
		}), inputs.length).map((values) => sanitizeGeminiEmbedding(values, outputDimensionality));
	};
	return {
		provider: {
			id: "gemini",
			model: client.model,
			maxInputTokens: GEMINI_MAX_INPUT_TOKENS[client.model],
			embed: async (input, callOptions) => {
				if (callOptions?.inputType === "query") return await embedQuery(typeof input === "string" ? input : input.text, callOptions);
				return (await embedDocuments([input], callOptions))[0] ?? [];
			},
			embedBatch: async (inputs, callOptions) => callOptions?.inputType === "query" ? await Promise.all(inputs.map((input) => embedQuery(typeof input === "string" ? input : input.text, callOptions))) : await embedDocuments(inputs, callOptions)
		},
		client
	};
}
async function resolveGeminiEmbeddingClient(options) {
	const remote = options.remote;
	const remoteApiKey = resolveRemoteApiKey(remote?.apiKey);
	const remoteBaseUrl = remote?.baseUrl?.trim();
	const providerConfig = options.config.models?.providers?.google;
	const providerBaseUrl = normalizeGeminiBaseUrl(normalizeOptionalString(providerConfig?.baseUrl) || DEFAULT_GOOGLE_API_BASE_URL);
	const rawBaseUrl = remoteBaseUrl || providerBaseUrl;
	const baseUrl = normalizeGeminiBaseUrl(rawBaseUrl);
	const providerOwnsDestination = embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl
	});
	const apiKey = remoteApiKey ? remoteApiKey : providerOwnsDestination ? requireApiKey(await resolveApiKeyForProvider({
		provider: "google",
		cfg: options.config,
		agentDir: options.agentDir
	}), "google") : void 0;
	if (!apiKey) throw new Error(`Google embedding credentials are not configured for ${baseUrl}. Set memory.search.remote.apiKey for this destination.`);
	const ssrfPolicy = buildRemoteBaseUrlPolicy(baseUrl);
	const headers = {
		...Object.assign({}, providerOwnsDestination ? providerConfig?.headers : void 0, remote?.headers),
		...resolveGoogleApiClientHeaders({
			baseUrl,
			api: "google-generative-ai",
			capability: "other",
			transport: "http"
		})
	};
	const apiKeys = remoteApiKey ? [apiKey] : collectProviderApiKeysForExecution({
		provider: "google",
		primaryApiKey: apiKey
	});
	const model = normalizeGeminiModel(options.model);
	const modelPath = buildGeminiModelPath(model);
	const outputDimensionality = resolveGeminiOutputDimensionality(model, options.dimensions);
	debugEmbeddingsLog("memory embeddings: gemini client", {
		rawBaseUrl,
		baseUrl,
		model,
		modelPath,
		outputDimensionality,
		embedEndpoint: resolveEmbeddingEndpointUrl(baseUrl, `${modelPath}:embedContent`),
		batchEndpoint: resolveEmbeddingEndpointUrl(baseUrl, `${modelPath}:batchEmbedContents`)
	});
	return {
		baseUrl,
		headers,
		ssrfPolicy,
		model,
		modelPath,
		apiKeys,
		outputDimensionality
	};
}
//#endregion
export { isValidGeminiEmbeddingValues as a, isGeminiEmbedding2Model as i, buildGeminiEmbeddingRequest as n, sanitizeGeminiEmbedding as o, createGeminiEmbeddingProvider as r, DEFAULT_GEMINI_EMBEDDING_MODEL as t };

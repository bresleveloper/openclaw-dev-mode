import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, or as union } from "./schemas-BOYIvvln.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-ucCbK8nV.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { t as resolveMemorySearchConfig } from "./memory-search-DFCytBn0.mjs";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-BNAwzYkM.mjs";
import { _ as watchClientDisconnect, f as sendMissingScopeForbidden, i as parseGatewayJsonRequest, l as sendInvalidRequest, u as sendJson } from "./http-common-D3e5uEH1.mjs";
import { i as authorizeOpenAiCompatibleHttpModelOverride, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-BhzlHO9u.mjs";
import { c as isUnknownGatewayAgentError, i as isAgentSelectionRequiredError, l as resolveAgentIdForRequest, s as isOpenClawAgentModelId } from "./http-utils-B-HtYJ8A.mjs";
import { n as closeEmbeddingProvider, t as acquireEmbeddingProviderLease } from "./embeddings-provider-lifetime-D11qAjve.mjs";
import { a as handleGatewayPostJsonEndpoint, t as resolveOpenAiCompatError } from "./openai-compat-errors-CZWU3Z8z.mjs";
import { Buffer } from "node:buffer";
//#region src/gateway/embeddings-http.ts
const EmbeddingsRequestSchema = object({
	model: string().optional(),
	input: union([string(), array(string())]).optional(),
	encoding_format: _enum(["float", "base64"]).optional(),
	dimensions: number().int().positive().optional(),
	user: string().optional()
});
const DEFAULT_EMBEDDINGS_BODY_BYTES = 5242880;
const MAX_EMBEDDING_INPUTS = 128;
const MAX_EMBEDDING_INPUT_CHARS = 8192;
const MAX_EMBEDDING_TOTAL_CHARS = 65536;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function encodeEmbeddingBase64(embedding) {
	const float32 = Float32Array.from(embedding);
	return Buffer.from(float32.buffer).toString("base64");
}
function validateInputTexts(texts) {
	if (texts.length === 0 || texts.some((text) => text.length === 0)) return "`input` must contain at least one non-empty string.";
	if (texts.length > MAX_EMBEDDING_INPUTS) return `Too many inputs (max ${MAX_EMBEDDING_INPUTS}).`;
	let totalChars = 0;
	for (const text of texts) {
		if (text.length > MAX_EMBEDDING_INPUT_CHARS) return `Input too long (max ${MAX_EMBEDDING_INPUT_CHARS} chars).`;
		totalChars += text.length;
		if (totalChars > MAX_EMBEDDING_TOTAL_CHARS) return `Total input too large (max ${MAX_EMBEDDING_TOTAL_CHARS} chars).`;
	}
}
function resolveEmbeddingProviderRemoteConfig(remote) {
	return remote ? {
		baseUrl: remote.baseUrl,
		apiKey: remote.apiKey,
		headers: remote.headers
	} : void 0;
}
function isLocalEmbeddingProvider(params) {
	const providerId = params.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.provider;
	return getMemoryEmbeddingProvider(providerId, params.cfg)?.transport === "local";
}
async function createConfiguredEmbeddingProvider(params) {
	const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(() => params.cfg);
	const providerId = params.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.provider;
	const adapter = getMemoryEmbeddingProvider(providerId, params.cfg);
	if (!adapter) throw new Error(`Unknown memory embedding provider: ${providerId}`);
	const createOptions = {
		config: params.cfg,
		agentDir: params.agentDir,
		provider: providerId,
		model: params.model || adapter.defaultModel || "",
		local: params.memorySearch?.local,
		remote: resolveEmbeddingProviderRemoteConfig(params.memorySearch?.remote),
		inputType: params.memorySearch?.inputType,
		queryInputType: params.memorySearch?.queryInputType,
		documentInputType: params.memorySearch?.documentInputType,
		dimensions: params.dimensions,
		fallback: "none",
		acquireLocalService
	};
	const { provider } = await adapter.create(createOptions);
	if (!provider) throw new Error(`Memory embedding provider ${providerId} is unavailable.`);
	return provider;
}
function resolveEmbeddingsTarget(params) {
	const configuredProvider = params.configuredProvider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.configuredProvider;
	const raw = params.requestModel.trim();
	const slash = raw.indexOf("/");
	if (slash === -1) return {
		provider: configuredProvider,
		model: raw
	};
	const provider = normalizeLowercaseStringOrEmpty(raw.slice(0, slash));
	const model = raw.slice(slash + 1).trim();
	if (!model) return { errorMessage: "Unsupported embedding model reference." };
	if (provider !== configuredProvider) return { errorMessage: "This agent does not allow that embedding provider on `/v1/embeddings`." };
	return {
		provider: configuredProvider,
		model
	};
}
/** Handles OpenAI-compatible embeddings requests for the configured agent memory provider. */
async function handleOpenAiEmbeddingsHttpRequest(req, res, opts) {
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		...opts,
		pathname: "/v1/embeddings",
		requiredOperatorMethod: "chat.send",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes,
		maxBodyBytes: opts.maxBodyBytes ?? DEFAULT_EMBEDDINGS_BODY_BYTES
	});
	if (handled === false) return false;
	if (!handled) return true;
	const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
	if (!modelOverrideAuth.allowed) {
		sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
		return true;
	}
	const payload = parseGatewayJsonRequest(res, handled.body, EmbeddingsRequestSchema);
	if (!payload) return true;
	const requestModel = normalizeOptionalString(payload.model) ?? "";
	if (!requestModel) {
		sendInvalidRequest(res, "Missing `model`.");
		return true;
	}
	const cfg = getRuntimeConfig();
	if (!isOpenClawAgentModelId(requestModel)) {
		sendInvalidRequest(res, "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`.");
		return true;
	}
	const texts = typeof payload.input === "string" ? [payload.input] : payload.input;
	if (!texts) {
		sendInvalidRequest(res, "`input` must be a string or an array of strings.");
		return true;
	}
	const inputError = validateInputTexts(texts);
	if (inputError) {
		sendInvalidRequest(res, inputError);
		return true;
	}
	let agentId;
	try {
		agentId = resolveAgentIdForRequest({
			req,
			model: requestModel
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isUnknownGatewayAgentError(err)) {
			sendInvalidRequest(res, err.message);
			return true;
		}
		throw err;
	}
	const agentDir = resolveAgentDir(cfg, agentId);
	const memorySearch = resolveMemorySearchConfig(cfg, agentId);
	const configuredProvider = memorySearch?.provider ?? "openai";
	const target = resolveEmbeddingsTarget({
		requestModel: normalizeOptionalString(getHeader(req, "x-openclaw-model")) || normalizeOptionalString(memorySearch?.model) || "",
		configuredProvider
	});
	if ("errorMessage" in target) {
		sendInvalidRequest(res, target.errorMessage);
		return true;
	}
	const providerScopeKey = JSON.stringify([agentId, target.provider]);
	const requestedProviderNeedsCleanup = isLocalEmbeddingProvider({
		cfg,
		provider: target.provider
	});
	if (req.socket.destroyed || res.destroyed || res.socket?.destroyed) return true;
	const abortController = new AbortController();
	const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
	try {
		const { provider, release } = await acquireEmbeddingProviderLease(providerScopeKey, abortController.signal, async () => await createConfiguredEmbeddingProvider({
			cfg,
			agentDir,
			provider: target.provider,
			model: target.model,
			dimensions: payload.dimensions ?? memorySearch?.outputDimensionality,
			memorySearch: memorySearch ?? void 0
		}), (createdProvider) => requestedProviderNeedsCleanup || isLocalEmbeddingProvider({
			cfg,
			provider: createdProvider.id
		}));
		try {
			if (handled.requestAuth.hasCurrentClientAuthority?.() === false) {
				await handled.requestAuth.revalidate?.();
				return true;
			}
			const embeddings = await provider.embedBatch(texts, {
				signal: abortController.signal,
				inputType: "document"
			});
			if (abortController.signal.aborted) return true;
			const encodingFormat = payload.encoding_format === "base64" ? "base64" : "float";
			sendJson(res, 200, {
				object: "list",
				data: embeddings.map((embedding, index) => ({
					object: "embedding",
					index,
					embedding: encodingFormat === "base64" ? encodeEmbeddingBase64(embedding) : embedding
				})),
				model: requestModel,
				usage: {
					prompt_tokens: 0,
					total_tokens: 0
				}
			});
		} finally {
			try {
				await closeEmbeddingProvider(providerScopeKey, provider);
			} finally {
				release();
			}
		}
	} catch (err) {
		if (!abortController.signal.aborted && !res.writableEnded && !res.destroyed) {
			logWarn(`openai-compat: embeddings request failed: ${formatErrorMessage(err)}`);
			const mapped = resolveOpenAiCompatError(err);
			sendJson(res, mapped?.status ?? 500, { error: mapped?.error ?? {
				message: "internal error",
				type: "api_error"
			} });
		}
	} finally {
		stopWatchingDisconnect();
	}
	return true;
}
//#endregion
export { handleOpenAiEmbeddingsHttpRequest };

import { a as coerceSecretRef, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { p as readProviderJsonObjectResponse, y as readProviderResponseErrorText } from "./provider-http-errors-CjVOxCE5.mjs";
import { g as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-K50Tjeok.mjs";
import { r as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import { F as sanitizeAndNormalizeEmbedding } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import { t as MEMORY_SEARCH_DEADLINE_CONTROL } from "./search-deadline-control-CvwcTLrz.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import "./ssrf-runtime-internal-B1sosNZE.mjs";
import "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-http-BuV15s4V.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import "./memory-core-host-engine-embeddings-BIgAa5Te.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-c4CL7oqZ.mjs";
import "./memory-core-host-secret-BVbxGtU1.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { n as resolveConfiguredSecretInputString } from "./secret-input-runtime-D_NUng8k.mjs";
import { t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "./defaults-CDpC0pZy.mjs";
import { t as readProviderBaseUrl } from "./provider-base-url-CJ296Qbv.mjs";
import { r as normalizeOllamaWireModelId } from "./model-id-C2JO-_3r.mjs";
import { y as resolveOllamaApiBase } from "./provider-models-CAeiI0VX.mjs";
//#region extensions/ollama/src/embedding-provider.runtime.ts
const OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES = 8192;
const QUERY_INSTRUCTION_TEMPLATES = [
	{
		prefix: "qwen3-embedding",
		template: "Instruct: Given a user query, retrieve relevant memory notes and documents\nQuery:{query}"
	},
	{
		prefix: "nomic-embed-text",
		template: "search_query: {query}"
	},
	{
		prefix: "mxbai-embed-large",
		template: "Represent this sentence for searching relevant passages: {query}"
	}
];
function normalizeOllamaEmbedding(vec, outputDimensionality) {
	const selected = typeof outputDimensionality === "number" ? vec.slice(0, outputDimensionality) : vec;
	if (selected.length === 0) throw new Error("Ollama embed response contains an empty embedding");
	if (!selected.every((value) => typeof value === "number")) throw new Error("Ollama embed response contains a non-number embedding value");
	return sanitizeAndNormalizeEmbedding(selected);
}
function normalizeEmbeddingModel(model, providerId) {
	const trimmed = model.trim();
	if (!trimmed) return DEFAULT_OLLAMA_EMBEDDING_MODEL;
	return normalizeOllamaWireModelId(trimmed, providerId);
}
function applyQueryInstructionTemplate(model, queryText) {
	const normalizedModel = model.trim().toLowerCase().replace(/^.*\//, "");
	const match = QUERY_INSTRUCTION_TEMPLATES.find(({ prefix }) => normalizedModel.startsWith(prefix));
	return match ? match.template.replace("{query}", () => queryText) : queryText;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const requestedId = options.provider?.trim() || "ollama";
	const providerId = providers[requestedId] ? requestedId : findNormalizedProviderKey(providers, requestedId) ?? "ollama";
	const config = providers[providerId];
	return config ? {
		providerId,
		config
	} : void 0;
}
function resolveSourcedOllamaEmbeddingKey(params) {
	if (params.configString !== void 0) {
		if (params.resolvedSecretRef || !isNonSecretApiKeyMarker(params.configString)) return { apiKey: params.configString };
		if (!isKnownEnvApiKeyMarker(params.configString)) return "opt-out";
		const envKey = resolveEnvApiKey("ollama")?.apiKey;
		return envKey && !isNonSecretApiKeyMarker(envKey) ? { apiKey: envKey } : "opt-out";
	}
	return params.declared ? "opt-out" : "unset";
}
async function resolveConfiguredOllamaEmbeddingSecret(params) {
	if (!coerceSecretRef(params.value, params.config.secrets?.defaults)) return normalizeOptionalSecretInput(params.value);
	const resolved = await resolveConfiguredSecretInputString({
		config: params.config,
		env: process.env,
		value: params.value,
		path: params.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) throw new Error(resolved.unresolvedRefReason);
	return normalizeOptionalSecretInput(resolved.value);
}
async function resolveOllamaEmbeddingResolvedKeys(options, providerConfig, providerOwnsHost) {
	const remoteValue = options.remote?.apiKey;
	const remote = resolveSourcedOllamaEmbeddingKey({
		configString: resolveMemorySecretInputString({
			value: remoteValue,
			path: "memory.search.remote.apiKey"
		}),
		declared: hasConfiguredSecretInput(remoteValue)
	});
	const providerValue = providerConfig?.config.apiKey;
	let provider = "unset";
	if (remote === "unset" && providerOwnsHost && providerConfig) provider = resolveSourcedOllamaEmbeddingKey({
		configString: await resolveConfiguredOllamaEmbeddingSecret({
			config: options.config,
			value: providerValue,
			path: `models.providers[${JSON.stringify(providerConfig.providerId)}].apiKey`
		}),
		declared: hasConfiguredSecretInput(providerValue),
		resolvedSecretRef: Boolean(coerceSecretRef(providerValue, options.config.secrets?.defaults))
	});
	const envKey = resolveEnvApiKey("ollama")?.apiKey;
	const env = envKey && !isNonSecretApiKeyMarker(envKey) ? envKey : void 0;
	return {
		remote,
		provider,
		env
	};
}
function resolveOllamaEmbeddingBaseUrl(params) {
	const remoteBaseUrl = params.remoteBaseUrl?.trim();
	if (remoteBaseUrl) return {
		baseUrl: resolveOllamaApiBase(remoteBaseUrl),
		origin: "remote-config"
	};
	const providerBaseUrl = readProviderBaseUrl(params.providerConfig?.config);
	if (providerBaseUrl) return {
		baseUrl: resolveOllamaApiBase(providerBaseUrl),
		origin: "provider-config"
	};
	return {
		baseUrl: resolveOllamaApiBase(void 0),
		origin: "default"
	};
}
function normalizeOllamaHostKey(baseUrl) {
	const parsed = URL.parse(baseUrl);
	if (!parsed) return;
	let hostname = parsed.hostname.toLowerCase();
	if (hostname === "localhost" || hostname === "::1" || hostname === "[::1]") hostname = "127.0.0.1";
	const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
	const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
	return `${parsed.protocol}//${hostname}:${port}${path}`;
}
function areOllamaHostsEquivalent(a, b) {
	const aKey = normalizeOllamaHostKey(a);
	const bKey = normalizeOllamaHostKey(b);
	return aKey !== void 0 && bKey !== void 0 && aKey === bKey;
}
function selectOllamaEmbeddingApiKey(params) {
	if (params.resolved.remote !== "unset") return typeof params.resolved.remote === "object" ? params.resolved.remote.apiKey : void 0;
	if (params.resolved.provider !== "unset" && params.providerOwnsHost) return typeof params.resolved.provider === "object" ? params.resolved.provider.apiKey : void 0;
	if (params.resolved.env && areOllamaHostsEquivalent(params.baseUrl, "https://ollama.com")) return params.resolved.env;
}
async function resolveOllamaEmbeddingClient(options) {
	const providerConfig = resolveConfiguredProvider(options);
	const { baseUrl, origin: baseUrlOrigin } = resolveOllamaEmbeddingBaseUrl({
		remoteBaseUrl: options.remote?.baseUrl,
		providerConfig
	});
	const model = normalizeEmbeddingModel(options.model, options.provider);
	const providerOwnedHost = resolveOllamaApiBase(readProviderBaseUrl(providerConfig?.config));
	const providerOwnsHost = baseUrlOrigin !== "remote-config" || areOllamaHostsEquivalent(baseUrl, providerOwnedHost);
	const remoteHeaderNames = new Set(Object.keys(options.remote?.headers ?? {}).map((headerName) => headerName.toLowerCase()));
	const headerOverrides = {};
	if (providerOwnsHost && providerConfig?.config.headers) for (const [headerName, headerValue] of Object.entries(providerConfig.config.headers)) {
		if (remoteHeaderNames.has(headerName.toLowerCase())) continue;
		const resolvedValue = await resolveConfiguredOllamaEmbeddingSecret({
			config: options.config,
			value: headerValue,
			path: `models.providers[${JSON.stringify(providerConfig.providerId)}].headers[${JSON.stringify(headerName)}]`
		});
		if (resolvedValue) headerOverrides[headerName] = resolvedValue;
	}
	Object.assign(headerOverrides, options.remote?.headers);
	const headers = {
		"Content-Type": "application/json",
		...headerOverrides
	};
	const apiKey = Object.entries(headers).some(([name, value]) => name.toLowerCase() === "authorization" && value.trim().length > 0) ? void 0 : selectOllamaEmbeddingApiKey({
		resolved: await resolveOllamaEmbeddingResolvedKeys(options, providerConfig, providerOwnsHost),
		baseUrl,
		providerOwnsHost
	});
	if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
	const localService = providerConfig?.config.localService;
	return {
		baseUrl,
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl),
		model,
		outputDimensionality: options.dimensions,
		...localService && baseUrlOrigin !== "remote-config" ? {
			localServiceTarget: {
				providerId: providerConfig.providerId,
				baseUrl: `${baseUrl.replace(/\/+$/, "")}/v1`,
				headers
			},
			acquireLocalService: options.acquireLocalService
		} : {}
	};
}
async function createOllamaEmbeddingProvider(options) {
	const client = await resolveOllamaEmbeddingClient(options);
	const embedUrl = `${client.baseUrl.replace(/\/$/, "")}/api/embed`;
	const embedMany = async (input, callOptions) => {
		const signal = callOptions?.signal;
		const deadlineControl = callOptions?.[MEMORY_SEARCH_DEADLINE_CONTROL];
		const localServiceLease = client.localServiceTarget && client.acquireLocalService ? await client.acquireLocalService(deadlineControl ? {
			...client.localServiceTarget,
			onReadinessWait: (waiting) => deadlineControl.report(waiting ? "pause" : "resume")
		} : client.localServiceTarget, signal) : void 0;
		let json;
		try {
			const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
				url: embedUrl,
				policy: client.ssrfPolicy,
				configuredLocalOriginBaseUrl: client.baseUrl,
				auditContext: "ollama-memory-embedding",
				signal,
				init: {
					method: "POST",
					headers: client.headers,
					body: JSON.stringify({
						model: client.model,
						input
					})
				}
			});
			try {
				if (!response.ok) {
					const detail = await readProviderResponseErrorText(response, OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES, client.headers).catch(() => "unknown error");
					const recovery = response.status === 404 && /model.*not found/i.test(detail) ? ` Run \`ollama pull ${client.model}\` on the configured Ollama host.` : "";
					throw new Error(`Ollama embed HTTP ${response.status}: ${detail}${recovery}`);
				}
				json = await readProviderJsonObjectResponse(response, "Ollama embed response");
			} finally {
				await release();
			}
		} finally {
			localServiceLease?.release();
		}
		if (!Array.isArray(json.embeddings)) throw new Error("Ollama embed response missing embeddings[]");
		const expectedCount = Array.isArray(input) ? input.length : 1;
		if (json.embeddings.length !== expectedCount) throw new Error(`Ollama embed response returned ${json.embeddings.length} embeddings for ${expectedCount} inputs`);
		const embeddings = json.embeddings.map((embedding) => {
			if (!Array.isArray(embedding)) throw new Error("Ollama embed response contains a non-array embedding");
			return normalizeOllamaEmbedding(embedding, client.outputDimensionality);
		});
		const tokens = json.prompt_eval_count;
		callOptions?.onUsage?.(typeof tokens === "number" && Number.isSafeInteger(tokens) && tokens >= 0 ? {
			promptTokens: tokens,
			totalTokens: tokens
		} : void 0);
		return embeddings;
	};
	const embedQuery = async (text, callOptions) => {
		const [embedding] = await embedMany(applyQueryInstructionTemplate(client.model, text), callOptions);
		if (!embedding) throw new Error("Ollama embed response returned no embedding");
		return embedding;
	};
	const provider = {
		id: "ollama",
		model: client.model,
		embed: async (input, optionsValue) => {
			const text = typeof input === "string" ? input : input.text;
			return optionsValue?.inputType === "query" ? await embedQuery(text, optionsValue) : (await embedMany([text], optionsValue))[0] ?? [];
		},
		embedBatch: async (inputs, optionsLocal) => {
			const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
			if (texts.length === 0) return [];
			if (optionsLocal?.inputType === "query") return await Promise.all(texts.map((text) => embedQuery(text, optionsLocal)));
			return await embedMany(texts, optionsLocal);
		}
	};
	return {
		provider,
		client: {
			...client,
			embedBatch: async (texts) => {
				try {
					return await provider.embedBatch(texts, { inputType: "document" });
				} catch (err) {
					throw new Error(formatErrorMessage(err), { cause: err });
				}
			}
		}
	};
}
//#endregion
export { createOllamaEmbeddingProvider };

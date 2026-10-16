import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-CECOqf64.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { b as redactProviderResponseErrorText, g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { D as buildRemoteBaseUrlPolicy, O as withRemoteHttpResponse, j as sanitizeAndNormalizeEmbedding } from "./gateway-startup-plugin-config-CleWmmi_.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./secret-input-BXhRrpGu.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./memory-core-host-engine-embeddings-D5ue0oCU.mjs";
import { a as resolveGithubCopilotDomain } from "./domain-VvPJpQNG.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-BcPuqdRw.mjs";
import { t as COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS } from "./models-CMNYV6xY.mjs";
import { t as resolveFirstGithubToken } from "./auth-DJScNold.mjs";
import { t as CopilotRuntimeAuthError } from "./runtime-auth-error-CQZde1c0.mjs";
import { n as resolveCopilotRuntimeAuth } from "./runtime-auth-Bk7UhxKB.mjs";
//#region extensions/github-copilot/embeddings.ts
const COPILOT_EMBEDDING_PROVIDER_ID = "github-copilot";
const PREFERRED_MODELS = [
	"text-embedding-3-small",
	"text-embedding-3-large",
	"text-embedding-ada-002"
];
const COPILOT_ERROR_BODY_LIMIT_BYTES = 8192;
const COPILOT_EMBEDDINGS_RESPONSE_MAX_BYTES = 67108864;
function isCopilotSetupError(err) {
	if (err instanceof CopilotRuntimeAuthError) return true;
	if (!(err instanceof Error)) return false;
	return err.message.includes("No GitHub token available") || err.message.includes("Copilot user response") || err.message.includes("No embedding models available") || err.message.includes("GitHub Copilot model discovery") || err.message.includes("github-copilot.model-discovery") || err.message.includes("GitHub Copilot embedding model") || err.message.includes("Unexpected response from GitHub Copilot user endpoint");
}
async function discoverEmbeddingModels(params) {
	const url = `${params.baseUrl.replace(/\/$/, "")}/models`;
	const headers = {
		...params.headers,
		Authorization: `Bearer ${params.copilotToken}`
	};
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "GET",
			headers
		},
		policy: params.ssrfPolicy,
		timeoutMs: COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS,
		auditContext: "memory-remote"
	});
	try {
		if (!response.ok) {
			const detail = redactProviderResponseErrorText(await readResponseTextLimited(response, COPILOT_ERROR_BODY_LIMIT_BYTES), headers);
			throw new Error(`GitHub Copilot model discovery HTTP ${response.status}: ${detail}`);
		}
		const payload = await readProviderJsonResponse(response, "github-copilot.model-discovery");
		return (Array.isArray(payload?.data) ? payload.data ?? [] : []).flatMap((entry) => {
			const id = typeof entry.id === "string" ? entry.id.trim() : "";
			if (!id) return [];
			return filterStringEntries(entry.supported_endpoints).some((ep) => ep.includes("embeddings")) || /\bembedding/i.test(id) ? [id] : [];
		});
	} finally {
		await release();
	}
}
function normalizeCopilotEmbeddingModel(model) {
	const normalized = model.trim();
	const prefix = `${COPILOT_EMBEDDING_PROVIDER_ID}/`;
	const stripped = normalized.startsWith(prefix) ? normalized.slice(prefix.length) : normalized;
	return stripped && stripped === stripped.trim() && !stripped.startsWith(prefix) ? stripped : normalized;
}
function pickBestModel(available, userModel) {
	if (userModel) {
		const normalized = normalizeCopilotEmbeddingModel(userModel);
		if (available.length === 0) throw new Error("No embedding models available from GitHub Copilot");
		if (!available.includes(normalized)) throw new Error(`GitHub Copilot embedding model "${normalized}" is not available. Available: ${available.join(", ")}`);
		return normalized;
	}
	const firstAvailable = PREFERRED_MODELS.find((preferred) => available.includes(preferred)) ?? available[0];
	if (firstAvailable) return firstAvailable;
	throw new Error("No embedding models available from GitHub Copilot");
}
function parseGitHubCopilotEmbeddingPayload(payload, expectedCount) {
	const data = asOptionalObjectRecord(payload)?.data;
	if (!Array.isArray(data)) throw new Error("GitHub Copilot embeddings response missing data[]");
	const vectors = Array.from({ length: expectedCount });
	for (const entry of data) {
		const record = asOptionalObjectRecord(entry);
		if (!record) throw new Error("GitHub Copilot embeddings response contains an invalid entry");
		const { index: indexValue, embedding } = record;
		const index = typeof indexValue === "number" ? indexValue : NaN;
		if (!Number.isInteger(index)) throw new Error("GitHub Copilot embeddings response contains an invalid index");
		if (index < 0 || index >= expectedCount) throw new Error("GitHub Copilot embeddings response contains an out-of-range index");
		if (vectors[index] !== void 0) throw new Error("GitHub Copilot embeddings response contains duplicate indexes");
		if (!Array.isArray(embedding) || !embedding.every((value) => typeof value === "number")) throw new Error("GitHub Copilot embeddings response contains an invalid embedding");
		vectors[index] = sanitizeAndNormalizeEmbedding(embedding);
	}
	for (let index = 0; index < expectedCount; index += 1) if (vectors[index] === void 0) throw new Error("GitHub Copilot embeddings response missing vectors for some inputs");
	return vectors;
}
function createGitHubCopilotEmbeddingProvider(client) {
	const embedMany = async (input, signal) => {
		if (input.length === 0) return [];
		const url = `${client.baseUrl.replace(/\/$/, "")}/embeddings`;
		return await withRemoteHttpResponse({
			url,
			fetchImpl: client.fetchImpl,
			ssrfPolicy: buildRemoteBaseUrlPolicy(client.baseUrl),
			signal,
			init: {
				method: "POST",
				headers: client.headers,
				body: JSON.stringify({
					model: client.model,
					input
				})
			},
			onResponse: async (response) => {
				if (!response.ok) {
					const detail = redactProviderResponseErrorText(await readResponseTextLimited(response, COPILOT_ERROR_BODY_LIMIT_BYTES), client.headers);
					throw new Error(`GitHub Copilot embeddings HTTP ${response.status}: ${detail}`);
				}
				return parseGitHubCopilotEmbeddingPayload(await readProviderJsonResponse(response, "github-copilot.embeddings", { maxBytes: COPILOT_EMBEDDINGS_RESPONSE_MAX_BYTES }), input.length);
			}
		});
	};
	return {
		id: COPILOT_EMBEDDING_PROVIDER_ID,
		model: client.model,
		embed: async (input, options) => {
			const [vector] = await embedMany([typeof input === "string" ? input : input.text], options?.signal);
			return vector ?? [];
		},
		embedBatch: async (inputs, options) => {
			const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
			if (options?.inputType === "query") return await Promise.all(texts.map(async (text) => (await embedMany([text], options.signal))[0] ?? []));
			return await embedMany(texts, options?.signal);
		}
	};
}
const githubCopilotMemoryEmbeddingProviderAdapter = {
	id: COPILOT_EMBEDDING_PROVIDER_ID,
	transport: "remote",
	authProviderId: COPILOT_EMBEDDING_PROVIDER_ID,
	normalizeModel: ({ model }) => normalizeCopilotEmbeddingModel(model),
	autoSelectPriority: 15,
	allowExplicitWhenConfiguredAuto: true,
	shouldContinueAutoSelection: isCopilotSetupError,
	create: async (options) => {
		const explicitValue = normalizeResolvedSecretInputString({
			value: options.remote?.apiKey,
			path: "memory.search.remote.apiKey"
		});
		const customBaseUrl = options.remote?.baseUrl?.trim();
		const customRuntimeAuth = customBaseUrl ? (() => {
			if (!explicitValue) throw new Error("GitHub Copilot memory custom baseUrl requires an explicit memory.search.remote.apiKey");
			return {
				apiKey: explicitValue,
				baseUrl: customBaseUrl
			};
		})() : void 0;
		const profileAuth = explicitValue ? void 0 : await resolveFirstGithubToken({
			agentDir: options.agentDir,
			config: options.config,
			env: process.env
		});
		const value = explicitValue ?? profileAuth?.githubToken;
		if (!value) throw new Error("No GitHub token available for Copilot embedding provider");
		const githubDomain = resolveGithubCopilotDomain({
			env: process.env,
			explicit: profileAuth?.githubDomain,
			config: options.config
		});
		const runtimeAuth = customRuntimeAuth ?? await resolveCopilotRuntimeAuth({
			githubToken: value,
			env: process.env,
			githubDomain
		});
		const baseUrl = runtimeAuth.baseUrl || "https://api.individual.githubcopilot.com";
		const ssrfPolicy = buildRemoteBaseUrlPolicy(baseUrl);
		const headers = buildCopilotRuntimeHeaders({
			config: options.config,
			headers: {
				"Content-Type": "application/json",
				...options.remote?.headers
			}
		});
		const model = pickBestModel(await discoverEmbeddingModels({
			baseUrl,
			copilotToken: runtimeAuth.apiKey,
			headers,
			ssrfPolicy
		}), options.model?.trim() || void 0);
		return {
			provider: createGitHubCopilotEmbeddingProvider({
				baseUrl,
				fetchImpl: fetch,
				headers: {
					...headers,
					Authorization: `Bearer ${runtimeAuth.apiKey}`
				},
				model
			}),
			runtime: {
				id: COPILOT_EMBEDDING_PROVIDER_ID,
				cacheKeyData: {
					provider: COPILOT_EMBEDDING_PROVIDER_ID,
					baseUrl,
					model
				}
			}
		};
	}
};
//#endregion
export { githubCopilotMemoryEmbeddingProviderAdapter as t };

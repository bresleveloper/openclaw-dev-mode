import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { F as sanitizeAndNormalizeEmbedding, M as withRemoteHttpResponse, j as buildRemoteBaseUrlPolicy } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./logging-core-CUJDGfv-.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import { i as resolveGithubCopilotDomain } from "./domain-Bbe8oFEv.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-lRGKz0Kw.mjs";
import { t as COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS } from "./models-at_nI0o1.mjs";
import { t as resolveFirstGithubToken } from "./auth-1ypR7h6x.mjs";
import { t as CopilotRuntimeAuthError } from "./runtime-auth-error-CQZde1c0.mjs";
import { n as resolveCopilotRuntimeAuth } from "./runtime-auth-B1nEIuFA.mjs";
//#region extensions/github-copilot/embeddings.ts
const COPILOT_EMBEDDING_PROVIDER_ID = "github-copilot";
/**
* Preferred embedding models in order. The first available model wins.
*/
const PREFERRED_MODELS = [
	"text-embedding-3-small",
	"text-embedding-3-large",
	"text-embedding-ada-002"
];
const COPILOT_ERROR_BODY_LIMIT_BYTES = 8192;
const COPILOT_EMBEDDINGS_RESPONSE_MAX_BYTES = 67108864;
function buildSsrfPolicy(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return { allowedHostnames: [parsed.hostname] };
	} catch {
		return;
	}
}
function isCopilotSetupError(err) {
	if (err instanceof CopilotRuntimeAuthError) return true;
	if (!(err instanceof Error)) return false;
	return err.message.includes("No GitHub token available") || err.message.includes("Copilot user response") || err.message.includes("No embedding models available") || err.message.includes("GitHub Copilot model discovery") || err.message.includes("github-copilot.model-discovery") || err.message.includes("GitHub Copilot embedding model") || err.message.includes("Unexpected response from GitHub Copilot user endpoint");
}
async function discoverEmbeddingModels(params) {
	const url = `${params.baseUrl.replace(/\/$/, "")}/models`;
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "GET",
			headers: {
				...params.headers,
				Authorization: `Bearer ${params.copilotToken}`
			}
		},
		policy: params.ssrfPolicy,
		timeoutMs: COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS,
		auditContext: "memory-remote"
	});
	try {
		if (!response.ok) {
			const detail = redactToolPayloadText(await readResponseTextLimited(response, COPILOT_ERROR_BODY_LIMIT_BYTES));
			throw new Error(`GitHub Copilot model discovery HTTP ${response.status}: ${detail}`);
		}
		const payload = await readProviderJsonResponse(response, "github-copilot.model-discovery");
		return (Array.isArray(payload?.data) ? payload.data ?? [] : []).flatMap((entry) => {
			const id = typeof entry.id === "string" ? entry.id.trim() : "";
			if (!id) return [];
			return (Array.isArray(entry.supported_endpoints) ? entry.supported_endpoints.filter((value) => typeof value === "string") : []).some((ep) => ep.includes("embeddings")) || /\bembedding/i.test(id) ? [id] : [];
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
	for (const preferred of PREFERRED_MODELS) if (available.includes(preferred)) return preferred;
	const [firstAvailable] = available;
	if (firstAvailable) return firstAvailable;
	throw new Error("No embedding models available from GitHub Copilot");
}
function parseGitHubCopilotEmbeddingPayload(payload, expectedCount) {
	if (!payload || typeof payload !== "object") throw new Error("GitHub Copilot embeddings response missing data[]");
	const data = payload.data;
	if (!Array.isArray(data)) throw new Error("GitHub Copilot embeddings response missing data[]");
	const vectors = Array.from({ length: expectedCount });
	for (const entry of data) {
		if (!entry || typeof entry !== "object") throw new Error("GitHub Copilot embeddings response contains an invalid entry");
		const indexValue = entry.index;
		const embedding = entry.embedding;
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
					const detail = redactToolPayloadText(await readResponseTextLimited(response, COPILOT_ERROR_BODY_LIMIT_BYTES));
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
	shouldContinueAutoSelection: (err) => isCopilotSetupError(err),
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
		const ssrfPolicy = buildSsrfPolicy(baseUrl);
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

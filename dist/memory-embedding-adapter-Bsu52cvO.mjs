import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as createAsyncLock } from "./json-files-C0HSMh2Z.mjs";
import { j as buildRemoteBaseUrlPolicy } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import "./async-lock-runtime-B-1KxQa3.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { r as sanitizeEmbeddingCacheHeaders } from "./embedding-provider-adapter-utils-OHEH6tTj.mjs";
import "./logging-core-CUJDGfv-.mjs";
import { a as normalizeEmbeddingModelWithPrefixes, c as embeddingProviderOwnsDestination, n as createRemoteEmbeddingProvider } from "./memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-BnUd_lfW.mjs";
import "./memory-core-host-secret-CpDjr8tN.mjs";
import { C as resolveLmstudioCanonicalModelKey, D as resolveLmstudioServerBase, b as normalizeLmstudioConfiguredCatalogEntries, c as resolveLmstudioConfiguredApiKeyForProvider, d as resolveLmstudioRuntimeApiKey, f as sanitizeLmstudioStringHeaders, i as prepareLmstudioModelForInference, j as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, l as resolveLmstudioProviderHeaders, o as buildLmstudioAuthHeaders, p as hasLmstudioAuthorizationHeader, r as fetchLmstudioModels, w as resolveLmstudioInferenceBase, z as LMSTUDIO_PROVIDER_ID } from "./models.fetch-B8g4AjMf.mjs";
//#region extensions/lmstudio/src/embedding-provider.ts
const log = createSubsystemLogger("memory/embeddings");
const DEFAULT_LMSTUDIO_EMBEDDING_MODEL = LMSTUDIO_DEFAULT_EMBEDDING_MODEL;
/** Normalizes LM Studio embedding model refs and accepts `lmstudio/` prefix. */
function normalizeLmstudioModel(model, providerId) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
		prefixes: [`${providerId?.trim() || "lmstudio"}/`, `${LMSTUDIO_PROVIDER_ID}/`]
	});
}
/** Resolves API key (real or synthetic placeholder) from runtime/provider auth config. */
async function resolveLmstudioApiKey(options, providerId) {
	const selectedProviderId = providerId?.trim();
	const selectedApiKey = selectedProviderId && selectedProviderId !== "lmstudio" ? options.config.models?.providers?.[selectedProviderId]?.apiKey : void 0;
	if (selectedProviderId && selectedProviderId !== "lmstudio") return selectedApiKey === void 0 || selectedApiKey === null ? void 0 : await resolveLmstudioConfiguredApiKeyForProvider({
		providerId: selectedProviderId,
		config: options.config,
		env: process.env
	});
	try {
		return await resolveLmstudioRuntimeApiKey({
			config: options.config,
			agentDir: options.agentDir
		});
	} catch (error) {
		if (/LM Studio API key is required/i.test(formatErrorMessage(error))) return;
		throw error;
	}
}
function resolveEmbeddingPreloadContextLength(params) {
	const configuredModel = normalizeLmstudioConfiguredCatalogEntries(params.models).find((entry) => normalizeLmstudioModel(entry.id) === params.model);
	if (configuredModel?.contextTokens !== void 0) return configuredModel.contextTokens;
	return configuredModel?.contextWindow;
}
function resolveConfiguredLmstudioProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || "lmstudio";
	const direct = providers[providerId];
	if (direct) return {
		providerId,
		config: direct
	};
	const normalized = normalizeProviderId(providerId);
	for (const [candidateId, candidate] of Object.entries(providers)) if (normalizeProviderId(candidateId) === normalized) return {
		providerId: candidateId,
		config: candidate
	};
	const fallback = providers[LMSTUDIO_PROVIDER_ID];
	return fallback ? {
		providerId: LMSTUDIO_PROVIDER_ID,
		config: fallback
	} : void 0;
}
function resolveLmstudioLocalServiceBaseUrl(configuredBaseUrl, inferenceBaseUrl) {
	const configured = configuredBaseUrl?.trim();
	if (!configured) return inferenceBaseUrl;
	const configuredPath = configured.replace(/[?#].*$/u, "").replace(/\/+$/u, "");
	const serverBaseUrl = resolveLmstudioServerBase(configured);
	return /\/api\/v1$/iu.test(configuredPath) ? `${serverBaseUrl}/api/v1` : `${serverBaseUrl}/v1`;
}
function resolveLmstudioEmbeddingBaseUrl(configuredBaseUrl) {
	const query = configuredBaseUrl?.match(/\?[^#]*/u)?.[0] ?? "";
	return `${resolveLmstudioInferenceBase(configuredBaseUrl)}${query}`;
}
async function resolveLmstudioEmbeddingModelKey(params) {
	const discovered = await fetchLmstudioModels({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		ssrfPolicy: params.ssrfPolicy
	});
	if (!discovered.reachable || discovered.status !== void 0 && discovered.status >= 400) return params.model;
	return resolveLmstudioCanonicalModelKey({
		modelKey: params.model,
		models: discovered.models
	});
}
/** Creates the LM Studio embedding provider client and preloads the target model before return. */
async function createLmstudioEmbeddingProvider(options) {
	const resolvedProvider = resolveConfiguredLmstudioProvider(options);
	const providerConfig = resolvedProvider?.config;
	const providerBaseUrl = providerConfig?.baseUrl?.trim();
	const isFallbackActivation = options.fallback === "lmstudio" && options.provider !== "lmstudio";
	const remoteBaseUrl = options.remote?.baseUrl?.trim();
	const remoteApiKey = !isFallbackActivation ? resolveMemorySecretInputString({
		value: options.remote?.apiKey,
		path: "memory.search.remote.apiKey"
	}) : void 0;
	const baseUrlSource = !isFallbackActivation ? remoteBaseUrl : void 0;
	const baseUrl = resolveLmstudioEmbeddingBaseUrl(baseUrlSource && baseUrlSource.length > 0 ? baseUrlSource : providerBaseUrl && providerBaseUrl.length > 0 ? providerBaseUrl : void 0);
	const providerOwnedBaseUrl = resolveLmstudioEmbeddingBaseUrl(providerBaseUrl);
	const providerOwnsDestination = !baseUrlSource || embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl: providerOwnedBaseUrl
	});
	const model = normalizeLmstudioModel(options.model, resolvedProvider?.providerId);
	const providerHeaders = providerOwnsDestination ? await resolveLmstudioProviderHeaders({
		config: options.config,
		env: process.env,
		headers: providerConfig?.headers
	}) : void 0;
	const headerOverrides = Object.assign({}, providerHeaders, !isFallbackActivation ? sanitizeLmstudioStringHeaders(options.remote?.headers) : void 0);
	const apiKey = hasLmstudioAuthorizationHeader(headerOverrides) ? void 0 : !isFallbackActivation ? remoteApiKey?.trim() || (providerOwnsDestination ? await resolveLmstudioApiKey(options, resolvedProvider?.providerId) : void 0) : await resolveLmstudioApiKey(options, resolvedProvider?.providerId);
	const headers = buildLmstudioAuthHeaders({
		apiKey,
		json: true,
		headers: headerOverrides
	}) ?? {};
	const ssrfPolicy = buildRemoteBaseUrlPolicy(baseUrl);
	const client = {
		baseUrl,
		model,
		headers,
		ssrfPolicy
	};
	const requestedContextLength = resolveEmbeddingPreloadContextLength({
		model,
		models: providerConfig?.models
	});
	const localServiceTarget = providerConfig?.localService && !baseUrlSource ? {
		providerId: resolvedProvider?.providerId ?? "lmstudio",
		baseUrl: resolveLmstudioLocalServiceBaseUrl(providerBaseUrl, baseUrl),
		headers
	} : void 0;
	const acquireLocalService = options.acquireLocalService;
	const withLocalServiceLease = async (signal, action) => {
		signal?.throwIfAborted();
		const lease = localServiceTarget && acquireLocalService ? await acquireLocalService(localServiceTarget, signal) : void 0;
		try {
			signal?.throwIfAborted();
			return await action();
		} finally {
			lease?.release();
		}
	};
	const withPreloadLock = createAsyncLock();
	const preloadModel = async (signal, initializeIdentity = false) => {
		if (providerConfig?.params?.preload === false) return;
		let entered = false;
		const preparation = withPreloadLock(async () => {
			entered = true;
			signal?.throwIfAborted();
			try {
				const prepared = await prepareLmstudioModelForInference({
					baseUrl,
					apiKey,
					headers: headerOverrides,
					ssrfPolicy,
					modelKey: client.model,
					requestedContextLength,
					timeoutMs: 12e4,
					signal
				});
				if (initializeIdentity) client.model = prepared.modelKey;
				return prepared;
			} catch (error) {
				signal?.throwIfAborted();
				if (initializeIdentity && error instanceof Error && "resolvedModelKey" in error) {
					const resolvedModelKey = error.resolvedModelKey;
					if (typeof resolvedModelKey === "string" && resolvedModelKey.trim()) client.model = resolvedModelKey.trim();
				}
				const details = {
					baseUrl,
					model: client.model,
					error: formatErrorMessage(error)
				};
				if (initializeIdentity) log.warn("lmstudio embeddings warmup failed; continuing without preload", details);
				else log.debug("lmstudio embeddings preload failed; continuing without preload", details);
				return;
			}
		});
		if (!signal) return await preparation;
		return await new Promise((resolve, reject) => {
			const onAbort = () => {
				if (!entered) {
					signal.removeEventListener("abort", onAbort);
					reject(toErrorObject(signal.reason, "LM Studio preload aborted"));
				}
			};
			signal.addEventListener("abort", onAbort, { once: true });
			preparation.then((prepared) => {
				signal.removeEventListener("abort", onAbort);
				resolve(prepared);
			}, (error) => {
				signal.removeEventListener("abort", onAbort);
				reject(toErrorObject(error, "LM Studio model preload failed"));
			});
			if (signal.aborted) onAbort();
		});
	};
	if (providerConfig?.params?.preload !== false) await withLocalServiceLease(void 0, async () => await preloadModel(void 0, true));
	else if (model.includes("@")) try {
		await withLocalServiceLease(void 0, async () => {
			client.model = await resolveLmstudioEmbeddingModelKey({
				baseUrl,
				apiKey,
				headers: headerOverrides,
				ssrfPolicy,
				model
			});
		});
	} catch (error) {
		log.debug("lmstudio embedding variant discovery failed; using requested model", {
			baseUrl,
			model,
			error: formatErrorMessage(error)
		});
	}
	const remoteProvider = createRemoteEmbeddingProvider({
		id: LMSTUDIO_PROVIDER_ID,
		client,
		errorPrefix: "lmstudio embeddings failed"
	});
	const resolveRequestProvider = (prepared) => prepared?.instanceId ? createRemoteEmbeddingProvider({
		id: LMSTUDIO_PROVIDER_ID,
		client: {
			...client,
			model: prepared.instanceId
		},
		errorPrefix: "lmstudio embeddings failed"
	}) : remoteProvider;
	const embed = async (input, callOptions) => await withLocalServiceLease(callOptions?.signal, async () => {
		const prepared = await preloadModel(callOptions?.signal);
		callOptions?.signal?.throwIfAborted();
		return await resolveRequestProvider(prepared).embed(input, callOptions);
	});
	const embedBatch = async (inputs, callOptions) => {
		if (inputs.length === 0) return [];
		if (callOptions?.inputType === "query") return await Promise.all(inputs.map((input) => embed(input, callOptions)));
		return await withLocalServiceLease(callOptions?.signal, async () => {
			const prepared = await preloadModel(callOptions?.signal);
			callOptions?.signal?.throwIfAborted();
			return await resolveRequestProvider(prepared).embedBatch(inputs, callOptions);
		});
	};
	return {
		provider: {
			...remoteProvider,
			embed,
			embedBatch
		},
		client
	};
}
//#endregion
//#region extensions/lmstudio/memory-embedding-adapter.ts
const lmstudioMemoryEmbeddingProviderAdapter = {
	id: "lmstudio",
	defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "lmstudio",
	allowExplicitWhenConfiguredAuto: true,
	create: async (options) => {
		const providerId = options.provider?.trim() || "lmstudio";
		const { provider, client } = await createLmstudioEmbeddingProvider({
			...options,
			provider: providerId,
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "lmstudio",
				inlineBatchTimeoutMs: 6e5,
				cacheKeyData: {
					provider: providerId,
					baseUrl: client.baseUrl,
					model: client.model,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, ["authorization", "x-api-key"])
				}
			}
		};
	}
};
//#endregion
export { lmstudioMemoryEmbeddingProviderAdapter as t };

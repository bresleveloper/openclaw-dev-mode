import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as createAsyncLock } from "./json-files-C5mNTScg.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { D as buildRemoteBaseUrlPolicy } from "./gateway-startup-plugin-config-ClZKV71m.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./async-lock-runtime-BigJXGyZ.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import { r as sanitizeEmbeddingCacheHeaders } from "./embedding-provider-adapter-utils-B17PVn9L.mjs";
import "./logging-core-e269L3HU.mjs";
import { a as normalizeEmbeddingModelWithPrefixes, c as embeddingProviderOwnsDestination, n as createRemoteEmbeddingProvider } from "./memory-core-host-engine-embeddings-C_qi8FWC.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-Bfq9Btd3.mjs";
import "./memory-core-host-secret-gvjKiv8R.mjs";
import "./provider-model-metadata-fSBArSt7.mjs";
import { B as LMSTUDIO_PROVIDER_ID, C as resolveLmstudioCanonicalModelKey, D as resolveLmstudioServerBase, M as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, b as normalizeLmstudioConfiguredCatalogEntries, c as resolveLmstudioConfiguredApiKeyForProvider, d as resolveLmstudioRuntimeApiKey, f as sanitizeLmstudioStringHeaders, i as prepareLmstudioModelForInference, l as resolveLmstudioProviderHeaders, o as buildLmstudioAuthHeaders, p as hasLmstudioAuthorizationHeader, r as fetchLmstudioModels, w as resolveLmstudioInferenceBase } from "./models.fetch-CPNwI0Xc.mjs";
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
	if (selectedProviderId && selectedProviderId !== "lmstudio") return await resolveLmstudioConfiguredApiKeyForProvider({
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
	return configuredModel?.contextTokens ?? configuredModel?.contextWindow;
}
function resolveConfiguredLmstudioProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const requestedId = options.provider?.trim() || "lmstudio";
	const providerId = providers[requestedId] ? requestedId : findNormalizedProviderKey(providers, requestedId) ?? "lmstudio";
	const config = providers[providerId];
	return config ? {
		providerId,
		config
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
	const remoteBaseUrl = options.remote?.baseUrl?.trim();
	const remoteApiKey = resolveMemorySecretInputString({
		value: options.remote?.apiKey,
		path: "memory.search.remote.apiKey"
	});
	const baseUrl = resolveLmstudioEmbeddingBaseUrl(remoteBaseUrl || providerBaseUrl || void 0);
	const providerOwnedBaseUrl = resolveLmstudioEmbeddingBaseUrl(providerBaseUrl);
	const providerOwnsDestination = !remoteBaseUrl || embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl: providerOwnedBaseUrl
	});
	const model = normalizeLmstudioModel(options.model, resolvedProvider?.providerId);
	const providerHeaders = providerOwnsDestination ? await resolveLmstudioProviderHeaders({
		config: options.config,
		env: process.env,
		headers: providerConfig?.headers
	}) : void 0;
	const headerOverrides = Object.assign({}, providerHeaders, sanitizeLmstudioStringHeaders(options.remote?.headers));
	const apiKey = hasLmstudioAuthorizationHeader(headerOverrides) ? void 0 : remoteApiKey?.trim() || (providerOwnsDestination ? await resolveLmstudioApiKey(options, resolvedProvider?.providerId) : void 0);
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
	const localServiceTarget = providerConfig?.localService && !remoteBaseUrl ? {
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

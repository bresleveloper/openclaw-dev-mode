import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-Bxt3rk6q.mjs";
import "./memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import "./dreaming-shared-CofeOWBR.mjs";
import { t as MemoryManagerReloadError } from "./lifecycle-CtUK0V21.mjs";
import { i as createMissingLocalMemoryEmbeddingProviderError } from "./local-embedding-provider-CrD-cpyE.mjs";
//#region extensions/memory-core/src/memory/embeddings.ts
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function formatProviderError(adapter, err) {
	return adapter.formatSetupError?.(err) ?? formatErrorMessage(err);
}
function getAdapter(id, config) {
	const adapter = getMemoryEmbeddingProvider(id, config);
	if (adapter) return adapter;
	if (id === "local") throw createMissingLocalMemoryEmbeddingProviderError();
	throw new Error(`Unknown memory embedding provider: ${id}`);
}
function resolveAdapterCreateOptions(adapter, options) {
	const { outputDimensionality, createProvider: _createProvider, ...base } = options;
	const createOptions = {
		...base,
		fallback: "none",
		model: options.model.trim() || adapter.defaultModel || "",
		...typeof outputDimensionality === "number" ? { dimensions: outputDimensionality } : {}
	};
	return {
		...createOptions,
		model: adapter.normalizeModel?.(createOptions) ?? createOptions.model
	};
}
function resolveEmbeddingProviderFallbackModel(providerId, fallbackSourceModel, config) {
	return getMemoryEmbeddingProvider(providerId, config)?.defaultModel ?? fallbackSourceModel;
}
function resolveEmbeddingProviderFallbackRemote(remote) {
	if (!remote) return;
	const { baseUrl: _baseUrl, apiKey: _apiKey, headers: _headers, ...sharedRemote } = remote;
	return Object.keys(sharedRemote).length > 0 ? sharedRemote : void 0;
}
function resolveEmbeddingProviderAdapterTransport(providerId, config) {
	try {
		return getAdapter(providerId, config).transport;
	} catch {
		return;
	}
}
function resolveEmbeddingProviderIndexIdentity(options) {
	const provider = options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
	try {
		const adapter = getAdapter(provider, options.config);
		const createOptions = resolveAdapterCreateOptions(adapter, {
			...options,
			provider
		});
		const identity = adapter.resolveIndexIdentity?.(createOptions);
		return {
			provider: {
				id: adapter.id,
				model: identity?.model ?? createOptions.model
			},
			cacheKeyData: identity?.cacheKeyData,
			aliases: identity?.aliases
		};
	} catch {
		return;
	}
}
async function createWithAdapter(adapter, options) {
	const createOptions = resolveAdapterCreateOptions(adapter, options);
	const create = () => adapter.create(createOptions);
	const result = await (options.createProvider ? options.createProvider(adapter, create) : create());
	return {
		provider: result.provider,
		requestedProvider: options.provider,
		runtime: result.runtime
	};
}
async function createEmbeddingProvider(options) {
	const provider = options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
	const primaryAdapter = getAdapter(provider, options.config);
	try {
		return await createWithAdapter(primaryAdapter, {
			...options,
			provider
		});
	} catch (primaryErr) {
		if (primaryErr instanceof MemoryManagerReloadError) throw primaryErr;
		const reason = formatProviderError(primaryAdapter, primaryErr);
		if (options.fallback && options.fallback !== "none" && options.fallback !== provider) {
			const fallbackAdapter = getAdapter(options.fallback, options.config);
			try {
				return {
					...await createWithAdapter(fallbackAdapter, {
						...options,
						provider: options.fallback,
						model: resolveEmbeddingProviderFallbackModel(options.fallback, options.model, options.config),
						remote: resolveEmbeddingProviderFallbackRemote(options.remote)
					}),
					requestedProvider: provider,
					fallbackFrom: provider,
					fallbackReason: reason
				};
			} catch (fallbackErr) {
				if (fallbackErr instanceof MemoryManagerReloadError) throw fallbackErr;
				const fallbackReason = formatProviderError(fallbackAdapter, fallbackErr);
				const wrapped = /* @__PURE__ */ new Error(`${reason}\n\nFallback to ${options.fallback} failed: ${fallbackReason}`);
				wrapped.cause = primaryErr;
				throw wrapped;
			}
		}
		const wrapped = new Error(reason);
		wrapped.cause = primaryErr;
		throw wrapped;
	}
}
//#endregion
export { resolveEmbeddingProviderIndexIdentity as a, resolveEmbeddingProviderFallbackRemote as i, resolveEmbeddingProviderAdapterTransport as n, resolveEmbeddingProviderFallbackModel as r, createEmbeddingProvider as t };

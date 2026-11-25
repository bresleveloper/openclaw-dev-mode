import { E as resolveLlamaCppModelCacheDir, _ as LLAMA_CPP_PROVIDER_ID, a as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID } from "./defaults-B-3wLNsP.mjs";
import { o as resolveLlamaCppMediaModels } from "./media-config-92b6iCHm.mjs";
import { n as resolveManagedLlamaCppProviderConfig } from "./managed-provider-config-XhvrVUR1.mjs";
import { ensureLlamaCppModel, i as formatLlamaServerRuntimeError, prepareManagedLlamaServer, reconcileManagedLlamaServer } from "./managed-server-DWb1xwtP.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getEmbeddingProvider } from "openclaw/plugin-sdk/embedding-providers";
import { sanitizeAndNormalizeEmbedding } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
import { fetchConfiguredLocalOriginWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime-internal";
// extensions/llama-cpp/src/managed-server-inspection.ts
async function fetchEndpoint(url, accept) {
	try {
		const configuredLocalOriginBaseUrl = new URL(url).origin;
		const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
			url,
			configuredLocalOriginBaseUrl,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(configuredLocalOriginBaseUrl),
			timeoutMs: 2500,
			auditContext: "llama-server-inspect"
		});
		try {
			if (!response.ok) return { ok: false };
			return {
				ok: true,
				value: accept === "json" ? await readProviderJsonResponse(response, "llama-server inspection") : await readProviderTextResponse(response, "llama-server inspection")
			};
		} finally {
			await release();
		}
	} catch {
		return { ok: false };
	}
}
async function inspectLlamaServerRuntime(params) {
	const root = params.baseUrl.replace(/\/v1\/?$/u, "").replace(/\/+$/u, "");
	const query = `model=${encodeURIComponent(params.modelId)}&autoload=false`;
	const [health, models, props, metrics] = await Promise.all([
		fetchEndpoint(`${root}/health`, "json"),
		fetchEndpoint(`${root}/models`, "json"),
		fetchEndpoint(`${root}/props?${query}`, "json"),
		fetchEndpoint(`${root}/metrics?${query}`, "text")
	]);
	const propsRecord = asOptionalRecord(props.value);
	const modalities = asOptionalRecord(propsRecord?.modalities);
	const modelsRecord = asOptionalRecord(models.value);
	const selected = (Array.isArray(modelsRecord?.data) ? modelsRecord.data : []).map((row) => asOptionalRecord(row)).find((row) => row?.id === params.modelId);
	const pathValue = typeof propsRecord?.model_path === "string" ? propsRecord.model_path : typeof selected?.path === "string" ? selected.path : void 0;
	return {
		engine: "llama.cpp",
		state: health.ok && models.ok && props.ok && !params.loadError ? "ready" : "failed",
		backend: void 0,
		buildInfo: typeof propsRecord?.build_info === "string" ? propsRecord.build_info : void 0,
		model: {
			id: params.modelId,
			...pathValue ? { path: pathValue } : {}
		},
		capabilities: {
			vision: modalities?.vision === true,
			draft: false
		},
		endpoints: {
			health: health.ok ? "ready" : "unavailable",
			models: models.ok ? "ready" : "unavailable",
			props: props.ok ? "ready" : "unavailable",
			metrics: metrics.ok ? "ready" : "unavailable"
		},
		...params.loadError ? { loadError: params.loadError } : {}
	};
}
// extensions/llama-cpp/src/embedding-provider.runtime.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function resolveProviderPort(provider) {
	const port = Number(new URL(provider.baseUrl ?? "").port);
	if (!Number.isInteger(port) || port <= 0) throw new Error("Managed llama.cpp provider baseUrl must include a loopback port.");
	return port;
}
async function prepareEmbeddingServer(options, embeddingSource) {
	const provider = resolveManagedLlamaCppProviderConfig(options.config);
	const mediaModels = resolveLlamaCppMediaModels(provider);
	const cacheDir = resolveLlamaCppModelCacheDir(provider);
	const embeddingModelPath = await ensureLlamaCppModel({
		source: embeddingSource,
		cacheDir,
		download: true
	});
	await prepareManagedLlamaServer({
		chatModel: { mode: "preserve" },
		configuredChatModelIds: provider.models.map((model) => model.id),
		...mediaModels ? { mediaModels: [] } : {},
		embeddingModelPath,
		port: resolveProviderPort(provider),
		reconcileBaseUrl: provider.baseUrl,
		localService: provider.localService
	});
}
async function createLlamaCppEmbeddingProvider(options, embeddingSource, identity) {
	if (options.dimensions !== void 0 && (!Number.isInteger(options.dimensions) || options.dimensions <= 0)) throw new Error("Local embeddings dimensions must be a positive integer.");
	await prepareEmbeddingServer(options, embeddingSource);
	const genericAdapter = getEmbeddingProvider("openai-compatible", options.config);
	if (!genericAdapter) throw new Error("OpenAI-compatible embedding transport is unavailable.");
	const acquireLocalService = options.acquireLocalService;
	const result = await genericAdapter.create({
		...options,
		provider: LLAMA_CPP_PROVIDER_ID,
		model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
		remote: void 0,
		dimensions: void 0,
		...acquireLocalService ? { acquireLocalService: (...[target, signal]) => acquireLocalService({
			...target,
			reconcile: reconcileManagedLlamaServer
		}, signal) } : {}
	});
	if (!result.provider) return result;
	const provider = result.provider;
	const canonicalModel = identity.model;
	const baseUrl = resolveManagedLlamaCppProviderConfig(options.config).baseUrl ?? "";
	const dimensions = options.dimensions;
	const normalize = (vector) => {
		if (dimensions !== void 0 && vector.length < dimensions) throw Object.assign(/* @__PURE__ */ new Error(`Local embeddings expected ${dimensions} dimensions, got ${vector.length}; reduce or remove memory.search.outputDimensionality or request dimensions.`), {
			code: "INVALID_EMBEDDING_RESPONSE",
			expectedDimensions: dimensions,
			actualDimensions: vector.length
		});
		return sanitizeAndNormalizeEmbedding(dimensions === void 0 ? vector : vector.slice(0, dimensions));
	};
	let runtimeFacts;
	const refreshFacts = async (loadError) => {
		runtimeFacts = await inspectLlamaServerRuntime({
			baseUrl,
			modelId: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			loadError
		});
	};
	const withFacts = async (operation) => {
		try {
			const value = await operation();
			await refreshFacts();
			return value;
		} catch (error) {
			const failure = formatLlamaServerRuntimeError(error);
			await refreshFacts(failure.message);
			throw failure;
		}
	};
	const wrapped = {
		id: "local",
		model: canonicalModel,
		dimensions,
		maxInputTokens: provider.maxInputTokens ?? 2044,
		embed: (input, callOptions) => withFacts(async () => normalize(await provider.embed(input, callOptions))),
		embedBatch: (inputs, callOptions) => withFacts(async () => (await provider.embedBatch(inputs, callOptions)).map(normalize)),
		close: provider.close
	};
	Object.defineProperty(wrapped, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: () => runtimeFacts
	});
	return {
		provider: wrapped,
		runtime: {
			id: "local",
			inlineQueryTimeoutMs: 3e5,
			inlineBatchTimeoutMs: 6e5,
			inlineIndexConcurrency: 1,
			cacheKeyData: identity.cacheKeyData,
			...(identity.aliases?.length ?? 0) > 0 ? { indexIdentityAliases: identity.aliases } : {}
		}
	};
}
export { createLlamaCppEmbeddingProvider };

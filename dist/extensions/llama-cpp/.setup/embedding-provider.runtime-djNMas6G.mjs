import { E as resolveLlamaCppModelCacheDir, _ as LLAMA_CPP_PROVIDER_ID, a as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID } from "./defaults-DX4XN2j1.mjs";
import { o as resolveLlamaCppMediaModels } from "./media-config-CZ7CluNV.mjs";
import { n as resolveManagedLlamaCppProviderConfig } from "./managed-provider-config-BuFqNTx1.mjs";
import { ensureLlamaCppModel, prepareManagedLlamaServer, reconcileManagedLlamaServer } from "./managed-server-Bjr1c5yX.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getEmbeddingProvider } from "openclaw/plugin-sdk/embedding-providers";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
import { fetchConfiguredLocalOriginWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime-internal";
//#region extensions/llama-cpp/src/managed-server-inspection.ts
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
		backend: params.backend,
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
//#endregion
//#region extensions/llama-cpp/src/embedding-provider.runtime.ts
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
function wrapProvider(params) {
	let runtimeFacts;
	const refreshFacts = async (loadError) => {
		runtimeFacts = await inspectLlamaServerRuntime({
			baseUrl: params.baseUrl,
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
			await refreshFacts(error instanceof Error ? error.message : String(error));
			throw error;
		}
	};
	const wrapped = {
		id: "local",
		model: params.canonicalModel,
		dimensions: params.provider.dimensions,
		maxInputTokens: params.provider.maxInputTokens ?? 2044,
		embed: (input, callOptions) => withFacts(() => params.provider.embed(input, callOptions)),
		embedBatch: (inputs, callOptions) => withFacts(() => params.provider.embedBatch(inputs, callOptions)),
		close: params.provider.close
	};
	Object.defineProperty(wrapped, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: () => runtimeFacts
	});
	return wrapped;
}
async function createLlamaCppEmbeddingProvider(options, embeddingSource, identity) {
	await prepareEmbeddingServer(options, embeddingSource);
	const genericAdapter = getEmbeddingProvider("openai-compatible", options.config);
	if (!genericAdapter) throw new Error("OpenAI-compatible embedding transport is unavailable.");
	const acquireLocalService = options.acquireLocalService;
	const result = await genericAdapter.create({
		...options,
		provider: LLAMA_CPP_PROVIDER_ID,
		model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
		remote: void 0,
		...acquireLocalService ? { acquireLocalService: (...[target, signal]) => acquireLocalService({
			...target,
			reconcile: reconcileManagedLlamaServer
		}, signal) } : {}
	});
	if (!result.provider) return result;
	return {
		provider: wrapProvider({
			provider: result.provider,
			canonicalModel: identity.model,
			baseUrl: resolveManagedLlamaCppProviderConfig(options.config).baseUrl ?? ""
		}),
		runtime: {
			id: "local",
			inlineQueryTimeoutMs: 3e5,
			inlineBatchTimeoutMs: 6e5,
			cacheKeyData: identity.cacheKeyData,
			...(identity.aliases?.length ?? 0) > 0 ? { indexIdentityAliases: identity.aliases } : {}
		}
	};
}
//#endregion
export { createLlamaCppEmbeddingProvider };

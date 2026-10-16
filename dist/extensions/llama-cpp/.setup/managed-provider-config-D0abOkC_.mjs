import path from "node:path";
import os from "node:os";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/llama-cpp/src/defaults.ts
const LLAMA_CPP_PROVIDER_ID = "llama-cpp";
const LLAMA_CPP_PROVIDER_LABEL = "llama.cpp";
const LLAMA_CPP_LOCAL_AUTH_MARKER = "llama-cpp-local";
const LLAMA_CPP_DEFAULT_PORT = 19432;
const LLAMA_CPP_READY_TIMEOUT_MS = 3e4;
const LLAMA_CPP_IDLE_STOP_MS = 6e5;
const DEFAULT_LLAMA_CPP_MODEL_ID = "gemma-4-e4b-it-q4_k_m";
const DEFAULT_LLAMA_CPP_MODEL_URI = "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_MODEL_REVISION = "bfc15c382204943c3a8fff0c750b94ae2364d7a3";
const DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE = "hf_unsloth_gemma-4-E4B-it-GGUF_gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES = 4977171584;
const DEFAULT_LLAMA_CPP_MODEL_SHA256 = "85a896a047553e842f25297ee5b031d64ff30147d9c4af17b1e4b394cd1fab87";
const DEFAULT_LLAMA_CPP_CONTEXT_SIZE = 65536;
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION = "66f974f8cd48cc3b9c41c516b95508e75b4bee64";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID = "embeddinggemma-300m-qat-q8_0";
const DEFAULT_LLAMA_CPP_EMBEDDING_CONTEXT_SIZE = 2048;
const DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE = "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES = 328577056;
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256 = "6fa0c02a9c302be6f977521d399b4de3a46310a4f2621ee0063747881b673f67";
function resolveLlamaCppDataDir() {
	return path.join(resolveStateDir(), "tools", "llama.cpp");
}
function resolveLlamaCppModelCacheDir(provider) {
	const configured = provider?.params?.modelCacheDir;
	return typeof configured === "string" && configured.trim() ? resolveHomePath(configured.trim()) : path.join(resolveStateDir(), "models", "llama.cpp");
}
function resolveLegacyLlamaCppModelCacheDir() {
	return path.join(os.homedir(), ".node-llama-cpp", "models");
}
function resolveLlamaCppEmbeddingModel(local = {}) {
	const source = normalizeOptionalString(local.modelPath) ?? "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
	const cacheDir = normalizeOptionalString(local.modelCacheDir) ?? resolveLlamaCppModelCacheDir();
	const resolvedPath = /^(?:hf:|https?:\/\/)/iu.test(source) ? void 0 : path.resolve(cacheDir, source);
	return {
		source,
		cacheDir,
		isDefault: source === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf" || resolvedPath === path.resolve(cacheDir, "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf") || resolvedPath === path.resolve(resolveLegacyLlamaCppModelCacheDir(), "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf")
	};
}
function resolveHomePath(value) {
	if (value === "~") return os.homedir();
	if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
	return value;
}
function resolveLlamaCppModelSource(model) {
	const configured = model.params?.modelPath;
	if (typeof configured === "string" && configured.trim()) return resolveHomePath(configured.trim());
	return model.id === "gemma-4-e4b-it-q4_k_m" ? DEFAULT_LLAMA_CPP_MODEL_URI : resolveHomePath(model.id);
}
function resolveCachedLlamaCppModelPath(params) {
	const source = resolveLlamaCppModelSource(params.model);
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	if (source === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") return path.join(cacheDir, DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
	if (/^(?:hf:|https?:\/\/)/iu.test(source)) return null;
	return path.isAbsolute(source) ? source : path.resolve(cacheDir, source);
}
function buildLlamaCppModel(model) {
	return {
		id: model.id,
		name: model.name,
		api: "openai-completions",
		reasoning: model.reasoning ?? false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		contextTokens: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		maxTokens: model.maxTokens ?? 2048,
		params: {
			modelPath: model.source,
			contextSize: DEFAULT_LLAMA_CPP_CONTEXT_SIZE
		},
		compat: {
			supportsTools: true,
			supportsUsageInStreaming: true,
			toolSchemaProfile: "llamacpp"
		}
	};
}
function buildLlamaCppProviderConfig(params = {}) {
	const { existing, managed, modelInventory } = params;
	const defaultModel = buildLlamaCppModel({
		id: DEFAULT_LLAMA_CPP_MODEL_ID,
		name: "Gemma 4 E4B (Q4_K_M)",
		source: DEFAULT_LLAMA_CPP_MODEL_URI
	});
	const configuredModels = existing?.models ?? [];
	const models = modelInventory ?? (configuredModels.some((model) => model.id === defaultModel.id) ? configuredModels : [...configuredModels, defaultModel]);
	return {
		...existing,
		baseUrl: managed?.baseUrl ?? existing?.baseUrl ?? `http://127.0.0.1:19432/v1`,
		apiKey: existing?.apiKey ?? "llama-cpp-local",
		api: "openai-completions",
		timeoutSeconds: existing?.timeoutSeconds ?? 600,
		...managed ? { localService: {
			command: managed.command,
			args: managed.args,
			healthUrl: managed.healthUrl,
			readyTimeoutMs: LLAMA_CPP_READY_TIMEOUT_MS,
			idleStopMs: LLAMA_CPP_IDLE_STOP_MS
		} } : {},
		models
	};
}
//#endregion
//#region extensions/llama-cpp/src/managed-provider-config.ts
const MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE = "Local embeddings need the managed llama.cpp server config (llama-server). The in-process node-llama-cpp runtime was removed; semantic memory recall is degraded until setup. Run `openclaw configure`, choose llama.cpp once, then retry `openclaw memory status --deep`.";
function resolveManagedLlamaCppProviderConfig(config) {
	const provider = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (!provider?.localService || !provider.baseUrl) throw new Error(MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE);
	return provider;
}
//#endregion
export { resolveCachedLlamaCppModelPath as C, resolveLlamaCppEmbeddingModel as D, resolveLlamaCppDataDir as E, resolveLlamaCppModelCacheDir as O, buildLlamaCppProviderConfig as S, resolveLegacyLlamaCppModelCacheDir as T, LLAMA_CPP_DEFAULT_PORT as _, DEFAULT_LLAMA_CPP_EMBEDDING_CONTEXT_SIZE as a, LLAMA_CPP_PROVIDER_LABEL as b, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION as c, DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE as d, DEFAULT_LLAMA_CPP_MODEL_ID as f, DEFAULT_LLAMA_CPP_MODEL_URI as g, DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES as h, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE as i, resolveLlamaCppModelSource as k, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256 as l, DEFAULT_LLAMA_CPP_MODEL_SHA256 as m, resolveManagedLlamaCppProviderConfig as n, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL as o, DEFAULT_LLAMA_CPP_MODEL_REVISION as p, DEFAULT_LLAMA_CPP_CONTEXT_SIZE as r, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID as s, MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE as t, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES as u, LLAMA_CPP_LOCAL_AUTH_MARKER as v, resolveHomePath as w, buildLlamaCppModel as x, LLAMA_CPP_PROVIDER_ID as y };

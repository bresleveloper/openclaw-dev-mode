import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { r as isCloudModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { m as LiveModelCatalogHttpError } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import { c as OLLAMA_DEFAULT_COST, f as OLLAMA_LOCAL_CONTEXT_TOKENS, h as normalizeOllamaCloudModelId, l as OLLAMA_DEFAULT_MAX_TOKENS, o as OLLAMA_DEFAULT_BASE_URL, p as isHostedOllamaCloud, r as OLLAMA_CLOUD_DEFAULT_MODELS } from "./defaults-Dkg1KktH.mjs";
import { t as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-B-JcH6mc.mjs";
import { createHash } from "node:crypto";
//#region extensions/ollama/src/provider-models.ts
const OLLAMA_SHOW_CONCURRENCY = 8;
const OLLAMA_CONTEXT_ENRICH_LIMIT = 200;
const OLLAMA_SHOW_TIMEOUT_MS = 3e3;
const OLLAMA_TAGS_TIMEOUT_MS = 5e3;
const MAX_OLLAMA_DISCOVERY_PROBES = 800;
const MAX_OLLAMA_SHOW_CACHE_ENTRIES = 256;
const ollamaModelShowInfoCache = /* @__PURE__ */ new Map();
const OLLAMA_ALWAYS_BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set(["metadata.google.internal"]);
function buildOllamaBaseUrlSsrFPolicy(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		if (OLLAMA_ALWAYS_BLOCKED_HOSTNAMES.has(parsed.hostname)) return;
		return {
			hostnameAllowlist: [parsed.hostname],
			allowPrivateNetwork: true
		};
	} catch {
		return;
	}
}
function resolveOllamaApiBase(configuredBaseUrl) {
	if (!configuredBaseUrl) return OLLAMA_DEFAULT_BASE_URL;
	return configuredBaseUrl.replace(/\/+$/, "").replace(/\/v1$/i, "");
}
const mergeOllamaModelShowInfo = (model, info) => {
	const incomplete = info.capabilities === void 0 && model.capabilities !== void 0 && isOllamaRemoteModel(model) && !isOllamaEmbeddingOnlyModel(model);
	return {
		...model,
		...info,
		contextWindow: info.contextWindow ?? model.contextWindow ?? model.details?.context_length,
		capabilities: incomplete ? [.../* @__PURE__ */ new Set([
			...model.capabilities ?? [],
			...info.showInspectionFailed ? [] : ["tools"],
			...isReasoningModelHeuristic(model.name) ? ["thinking"] : []
		])] : info.capabilities ?? model.capabilities,
		...incomplete ? { capabilitiesFromList: true } : {}
	};
};
const OLLAMA_FAILED_SHOW_INFO = Object.freeze({ showInspectionFailed: true });
function throwIfOllamaRequestAborted(signal) {
	if (signal?.aborted) throw toErrorObject(signal.reason, "Ollama request aborted");
}
function buildOllamaModelShowCacheKey(apiBase, model, apiKey) {
	const version = model.digest?.trim() || model.modified_at?.trim();
	if (!version) return;
	const authScope = apiKey ? createHash("sha256").update(apiKey).digest("hex") : "anonymous";
	return `${resolveOllamaApiBase(apiBase)}|${model.name}|${version}|${authScope}`;
}
function setOllamaModelShowCacheEntry(key, value) {
	if (ollamaModelShowInfoCache.size >= MAX_OLLAMA_SHOW_CACHE_ENTRIES) {
		const oldestKey = ollamaModelShowInfoCache.keys().next().value;
		if (typeof oldestKey === "string") ollamaModelShowInfoCache.delete(oldestKey);
	}
	ollamaModelShowInfoCache.set(key, value);
}
function hasCachedOllamaModelShowInfo(info) {
	return typeof info.contextWindow === "number" || (info.capabilities?.length ?? 0) > 0;
}
function parseOllamaNumCtxParameter(parameters) {
	if (typeof parameters !== "string" || !parameters.trim()) return;
	let lastValue;
	for (const rawLine of parameters.split(/\r?\n/)) {
		const match = rawLine.trim().match(/^num_ctx\s+(-?\d+)\b/);
		if (!match) continue;
		const rawValue = match[1];
		if (!rawValue) continue;
		const parsed = Number.parseInt(rawValue, 10);
		if (Number.isFinite(parsed) && parsed > 0) lastValue = parsed;
	}
	return lastValue;
}
async function readOllamaModelShowInfo(apiBase, modelName, opts) {
	const normalizedApiBase = resolveOllamaApiBase(apiBase);
	const auditContext = opts?.auditContext ?? "ollama-provider-models.show";
	const headers = { "Content-Type": "application/json" };
	if (opts?.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${normalizedApiBase}/api/show`,
		init: {
			method: "POST",
			headers,
			body: JSON.stringify({ model: modelName })
		},
		timeoutMs: Math.min(opts?.timeoutMs ?? OLLAMA_SHOW_TIMEOUT_MS, OLLAMA_SHOW_TIMEOUT_MS),
		...opts?.signal ? { signal: opts.signal } : {},
		policy: buildOllamaBaseUrlSsrFPolicy(normalizedApiBase),
		auditContext
	});
	try {
		if (!response.ok) {
			response.body?.cancel().catch(() => void 0);
			throw new Error(`Ollama model inspection failed with HTTP ${response.status}`);
		}
		const data = await readProviderJsonResponse(response, auditContext);
		let contextWindow;
		if (data.model_info) {
			for (const [key, value] of Object.entries(data.model_info)) if (key.endsWith(".context_length") && typeof value === "number" && Number.isFinite(value)) {
				const ctx = Math.floor(value);
				if (ctx > 0) {
					contextWindow = ctx;
					break;
				}
			}
		}
		const paramCtx = parseOllamaNumCtxParameter(data.parameters);
		if (paramCtx !== void 0 && (contextWindow === void 0 || paramCtx > contextWindow)) contextWindow = paramCtx;
		const capabilities = Array.isArray(data.capabilities) ? data.capabilities.filter((capability) => typeof capability === "string") : void 0;
		return {
			contextWindow,
			capabilities
		};
	} finally {
		await release();
	}
}
async function queryOllamaModelShowInfo(apiBase, modelName, opts) {
	try {
		return await readOllamaModelShowInfo(apiBase, modelName, opts);
	} catch {
		throwIfOllamaRequestAborted(opts?.signal);
		return OLLAMA_FAILED_SHOW_INFO;
	}
}
async function queryOllamaModelShowInfoCached(apiBase, model, opts) {
	const normalizedApiBase = resolveOllamaApiBase(apiBase);
	const cacheKey = buildOllamaModelShowCacheKey(normalizedApiBase, model, opts?.apiKey);
	if (!cacheKey || opts?.timeoutMs !== void 0 || opts?.signal) return await queryOllamaModelShowInfo(normalizedApiBase, model.name, opts);
	const cached = ollamaModelShowInfoCache.get(cacheKey);
	if (cached) return await cached;
	const pending = queryOllamaModelShowInfo(normalizedApiBase, model.name, opts).then((result) => {
		if (!hasCachedOllamaModelShowInfo(result)) ollamaModelShowInfoCache.delete(cacheKey);
		return result;
	});
	setOllamaModelShowCacheEntry(cacheKey, pending);
	return await pending;
}
/** @deprecated Use queryOllamaModelShowInfo instead. */
async function queryOllamaContextWindow(apiBase, modelName) {
	return (await queryOllamaModelShowInfo(apiBase, modelName)).contextWindow;
}
async function enrichOllamaModelsWithContext(apiBase, models, opts) {
	const concurrency = Math.max(1, Math.floor(opts?.concurrency ?? OLLAMA_SHOW_CONCURRENCY));
	const enriched = [];
	for (let index = 0; index < models.length; index += concurrency) {
		throwIfOllamaRequestAborted(opts?.signal);
		const probes = models.slice(index, index + concurrency).map(async (model) => {
			const showInfo = await queryOllamaModelShowInfoCached(apiBase, model, opts);
			return mergeOllamaModelShowInfo(model, showInfo);
		});
		try {
			enriched.push(...await Promise.all(probes));
		} catch (error) {
			await Promise.allSettled(probes);
			throw error;
		}
	}
	return enriched;
}
async function enrichOllamaCompletionModels(apiBase, models, opts) {
	const completionModels = [];
	const probeLimit = Math.min(models.length, MAX_OLLAMA_DISCOVERY_PROBES);
	for (let index = 0; index < probeLimit && completionModels.length < OLLAMA_CONTEXT_ENRICH_LIMIT; index += OLLAMA_SHOW_CONCURRENCY) {
		throwIfOllamaRequestAborted(opts?.signal);
		const batch = await enrichOllamaModelsWithContext(apiBase, models.slice(index, Math.min(index + OLLAMA_SHOW_CONCURRENCY, probeLimit)), opts);
		for (const model of batch) {
			const canComplete = model.capabilities?.includes("completion");
			if (isOllamaEmbeddingOnlyModel(model) || !canComplete && (opts?.requireCompletionCapability || model.capabilities && !model.capabilitiesFromList)) continue;
			completionModels.push(model);
			if (completionModels.length === OLLAMA_CONTEXT_ENRICH_LIMIT) break;
		}
	}
	return completionModels;
}
function isOllamaCloudModel(modelName) {
	return isCloudModelRef(modelName);
}
function isOllamaEmbeddingOnlyModel(model) {
	return model.capabilities?.includes("embedding") === true && !model.capabilities.includes("completion");
}
function isOllamaRemoteModel(model) {
	return Boolean(model.remote_host?.trim() || model.remote_model?.trim()) || isOllamaCloudModel(model.name);
}
/**
* Cloud models are referenced both bare (`kimi-k3`) and suffixed (`kimi-k3:cloud`).
* Both spellings must reach the same known context window, or a suffixed ref silently
* falls back to the generic default whenever live inspection is unavailable.
*/
function resolveOllamaCloudDefaultModel(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return OLLAMA_CLOUD_DEFAULT_MODELS.find((model) => model.id === normalized);
}
function isReasoningModelHeuristic(modelId) {
	return /r1|reasoning|think|reason/i.test(modelId);
}
function buildOllamaModelDefinition(modelId, contextWindow, capabilities, opts) {
	return {
		id: modelId,
		name: modelId,
		reasoning: supportsOllamaCloudFullThinkingEffort(modelId) || (capabilities === void 0 ? isReasoningModelHeuristic(modelId) : capabilities.includes("thinking")),
		input: capabilities?.includes("vision") ? ["text", "image"] : ["text"],
		cost: OLLAMA_DEFAULT_COST,
		contextWindow: contextWindow ?? resolveOllamaCloudDefaultModel(modelId)?.contextWindow ?? 128e3,
		maxTokens: OLLAMA_DEFAULT_MAX_TOKENS,
		compat: {
			supportsTools: capabilities?.includes("tools") ?? opts?.showInspectionFailed !== true,
			supportsUsageInStreaming: true,
			supportsJsonSchemaResponseFormat: !isOllamaCloudModel(modelId)
		}
	};
}
function buildDefaultOllamaCloudModelDefinition(model) {
	return {
		...buildOllamaModelDefinition(model.id, model.contextWindow, [...model.capabilities]),
		compat: {
			supportsTools: true,
			supportsUsageInStreaming: true
		}
	};
}
function capLocalOllamaModelContext(model, baseUrl) {
	if (isHostedOllamaCloud(baseUrl) || isOllamaCloudModel(model.id) || typeof model.contextWindow !== "number") return model;
	return {
		...model,
		contextTokens: Math.min(OLLAMA_LOCAL_CONTEXT_TOKENS, model.contextWindow)
	};
}
function capLocalOllamaProviderContext(provider) {
	return {
		...provider,
		models: provider.models?.map((model) => capLocalOllamaModelContext(model, provider.baseUrl))
	};
}
async function fetchOllamaModelRows(params) {
	try {
		const apiBase = resolveOllamaApiBase(params.baseUrl);
		const auditContext = `ollama-provider-models.${params.endpoint}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: `${apiBase}/api/${params.endpoint}`,
			init: { headers: params.opts?.apiKey ? { Authorization: `Bearer ${params.opts.apiKey}` } : void 0 },
			timeoutMs: Math.min(params.opts?.timeoutMs ?? OLLAMA_TAGS_TIMEOUT_MS, OLLAMA_TAGS_TIMEOUT_MS),
			...params.opts?.signal ? { signal: params.opts.signal } : {},
			policy: buildOllamaBaseUrlSsrFPolicy(apiBase),
			auditContext,
			...params.deps?.fetchImpl ? { fetchImpl: params.deps.fetchImpl } : {},
			...params.deps?.lookupFn ? { lookupFn: params.deps.lookupFn } : {}
		});
		try {
			if (!response.ok) {
				response.body?.cancel().catch(() => void 0);
				if (params.opts?.discoveryMode === "strict") throw new LiveModelCatalogHttpError("ollama", response.status);
				return {
					reachable: true,
					models: []
				};
			}
			const data = await readProviderJsonResponse(response, auditContext);
			if (params.opts?.discoveryMode === "strict" && !Array.isArray(data.models)) throw new Error("Ollama model discovery response must contain models[]");
			return {
				reachable: true,
				models: Array.isArray(data.models) ? data.models : []
			};
		} finally {
			await release();
		}
	} catch (error) {
		throwIfOllamaRequestAborted(params.opts?.signal);
		if (params.opts?.discoveryMode === "strict") throw error;
		return {
			reachable: false,
			models: []
		};
	}
}
async function fetchOllamaModels(baseUrl, opts, deps) {
	const result = await fetchOllamaModelRows({
		baseUrl,
		endpoint: "tags",
		opts,
		deps
	});
	return {
		reachable: result.reachable,
		models: result.models.filter((model) => typeof model.name === "string" && Boolean(model.name))
	};
}
async function fetchLoadedOllamaModelNames(baseUrl, opts, deps) {
	const result = await fetchOllamaModelRows({
		baseUrl,
		endpoint: "ps",
		opts,
		deps
	});
	return {
		reachable: result.reachable,
		models: result.models.map((model) => typeof model.name === "string" ? model.name.trim() : "model" in model && typeof model.model === "string" ? model.model.trim() : "").filter(Boolean)
	};
}
async function buildOllamaProvider(configuredBaseUrl, opts) {
	const apiBase = resolveOllamaApiBase(configuredBaseUrl);
	const auth = opts?.apiKey ? { apiKey: opts.apiKey } : void 0;
	const { reachable, models } = await fetchOllamaModels(apiBase, opts);
	if (!reachable && !opts?.quiet) console.warn(`Ollama could not be reached at ${apiBase}.`);
	return {
		baseUrl: apiBase,
		api: "ollama",
		models: (await enrichOllamaCompletionModels(apiBase, models, auth)).map((model) => buildOllamaModelDefinition(model.name, model.contextWindow, model.capabilities, { showInspectionFailed: model.showInspectionFailed }))
	};
}
//#endregion
export { queryOllamaModelShowInfo as _, capLocalOllamaModelContext as a, throwIfOllamaRequestAborted as b, enrichOllamaModelsWithContext as c, isOllamaCloudModel as d, isOllamaEmbeddingOnlyModel as f, queryOllamaContextWindow as g, mergeOllamaModelShowInfo as h, buildOllamaProvider as i, fetchLoadedOllamaModelNames as l, isReasoningModelHeuristic as m, buildOllamaBaseUrlSsrFPolicy as n, capLocalOllamaProviderContext as o, isOllamaRemoteModel as p, buildOllamaModelDefinition as r, enrichOllamaCompletionModels as s, buildDefaultOllamaCloudModelDefinition as t, fetchOllamaModels as u, readOllamaModelShowInfo as v, resolveOllamaApiBase as y };

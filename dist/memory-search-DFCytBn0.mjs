import { i as clampNumber } from "./utils-DgZn2dLu.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./legacy-Ccc1pb1u.mjs";
import { n as normalizeConfiguredMemoryExtraPaths, o as resolveRememberAcrossConversations } from "./config-utils-DnfHy8-v.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-oevwKU3u.mjs";
import { a as isMemoryMultimodalEnabled, o as normalizeMemoryMultimodalSettings } from "./multimodal-B9eYMDXo.mjs";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-BrQ0uPWi.mjs";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-BNAwzYkM.mjs";
import { t as resolveMemorySearchSourcePolicy } from "./memory-search-source-policy-zikTNTRB.mjs";
//#region src/agents/memory-search.ts
/**
* Resolves memory-search source, sync, and ranking configuration.
*/
const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_MIN_SCORE = .35;
const DEFAULT_CACHE_ENABLED = true;
const DEFAULT_CACHE_MAX_ENTRIES = 5e4;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function getConfiguredMemoryEmbeddingProvider(providerId, cfg) {
	if (normalizeProviderId(providerId) === "none") return;
	return getMemoryEmbeddingProvider(providerId, cfg);
}
/** Resolves source and query settings without loading an embedding provider runtime. */
function resolveMemorySearchIndexConfig(cfg, agentId) {
	const defaults = cfg.memory?.search;
	const overrides = resolveAgentConfig(cfg, agentId)?.memory?.search;
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	if (!enabled) return null;
	assertSecretOwnerAvailable("capability", runtimeMemorySecretOwnerId(agentId));
	const rememberAcrossConversations = resolveRememberAcrossConversations(cfg, agentId);
	const configuredSessionMemory = overrides?.experimental?.sessionMemory ?? defaults?.experimental?.sessionMemory ?? false;
	const configuredSources = overrides?.sources ?? defaults?.sources;
	const { sessionMemory, searchSources, sources } = resolveMemorySearchSourcePolicy({
		configuredSources,
		rememberAcrossConversations,
		configuredSessionMemory
	});
	return {
		enabled,
		rememberAcrossConversations,
		sources,
		searchSources,
		extraPaths: normalizeConfiguredMemoryExtraPaths([...defaults?.extraPaths ?? [], ...overrides?.extraPaths ?? []]),
		query: {
			maxResults: overrides?.query?.maxResults ?? defaults?.query?.maxResults ?? DEFAULT_MAX_RESULTS,
			minScore: clampNumber(overrides?.query?.minScore ?? defaults?.query?.minScore ?? DEFAULT_MIN_SCORE, 0, 1),
			hybrid: {
				enabled: true,
				vectorWeight: .7,
				textWeight: .3,
				candidateMultiplier: 4,
				mmr: {
					enabled: true,
					lambda: .7
				},
				temporalDecay: {
					enabled: true,
					halfLifeDays: 30
				}
			}
		},
		experimental: { sessionMemory },
		sync: resolveSyncConfig()
	};
}
function produceMemorySearchConfig(cfg, agentId) {
	const indexConfig = resolveMemorySearchIndexConfig(cfg, agentId);
	if (!indexConfig) return null;
	const defaults = cfg.memory?.search;
	const overrides = resolveAgentConfig(cfg, agentId)?.memory?.search;
	const rawProvider = overrides?.provider ?? defaults?.provider;
	const provider = rawProvider?.trim() === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : rawProvider?.trim() || DEFAULT_MEMORY_EMBEDDING_PROVIDER;
	const primaryAdapter = getConfiguredMemoryEmbeddingProvider(provider, cfg);
	const defaultRemote = defaults?.remote;
	const overrideRemote = overrides?.remote;
	const fallback = overrides?.fallback ?? defaults?.fallback ?? "none";
	const fallbackAdapter = normalizeProviderId(provider) !== "none" && fallback && fallback !== "none" ? getConfiguredMemoryEmbeddingProvider(fallback, cfg) : void 0;
	const remote = Boolean(overrideRemote?.baseUrl || overrideRemote?.apiKey || overrideRemote?.headers || defaultRemote?.baseUrl || defaultRemote?.apiKey || defaultRemote?.headers || false) || primaryAdapter?.transport !== "local" || fallbackAdapter?.transport === "remote" ? {
		baseUrl: overrideRemote?.baseUrl ?? defaultRemote?.baseUrl,
		apiKey: overrideRemote?.apiKey ?? defaultRemote?.apiKey,
		headers: overrideRemote?.headers ?? defaultRemote?.headers,
		batch: {
			enabled: overrideRemote?.batch?.enabled ?? defaultRemote?.batch?.enabled ?? false,
			wait: true,
			concurrency: 2,
			pollIntervalMs: 2e3,
			timeoutMinutes: 60
		}
	} : void 0;
	const model = overrides?.model ?? defaults?.model ?? primaryAdapter?.defaultModel ?? "";
	const inputType = overrides?.inputType?.trim() || defaults?.inputType?.trim() || void 0;
	const queryInputType = overrides?.queryInputType?.trim() || defaults?.queryInputType?.trim() || void 0;
	const documentInputType = overrides?.documentInputType?.trim() || defaults?.documentInputType?.trim() || void 0;
	const outputDimensionality = overrides?.outputDimensionality ?? defaults?.outputDimensionality;
	const multimodal = normalizeMemoryMultimodalSettings({
		enabled: overrides?.multimodal?.enabled ?? defaults?.multimodal?.enabled,
		modalities: overrides?.multimodal?.modalities ?? defaults?.multimodal?.modalities,
		maxFileBytes: overrides?.multimodal?.maxFileBytes ?? defaults?.multimodal?.maxFileBytes
	});
	const resolved = {
		...indexConfig,
		multimodal,
		provider,
		remote,
		fallback,
		model,
		inputType,
		queryInputType,
		documentInputType,
		outputDimensionality,
		local: { modelPath: overrides?.local?.modelPath ?? defaults?.local?.modelPath },
		store: {
			driver: "sqlite",
			databasePath: resolveOpenClawAgentSqlitePath({
				agentId,
				env: process.env
			}),
			fts: { tokenizer: overrides?.store?.fts?.tokenizer ?? defaults?.store?.fts?.tokenizer ?? "unicode61" },
			vector: {
				enabled: overrides?.store?.vector?.enabled ?? defaults?.store?.vector?.enabled ?? true,
				extensionPath: overrides?.store?.vector?.extensionPath ?? defaults?.store?.vector?.extensionPath
			}
		},
		chunking: {
			tokens: 400,
			overlap: 80
		},
		cache: {
			enabled: overrides?.cache?.enabled ?? defaults?.cache?.enabled ?? DEFAULT_CACHE_ENABLED,
			maxEntries: DEFAULT_CACHE_MAX_ENTRIES
		}
	};
	const multimodalActive = isMemoryMultimodalEnabled(resolved.multimodal);
	if (multimodalActive && primaryAdapter && !(primaryAdapter.supportsMultimodalEmbeddings?.({ model: resolved.model }) ?? false)) throw new Error("memory.search.multimodal requires a provider adapter that supports multimodal embeddings for the configured model.");
	if (multimodalActive && resolved.fallback !== "none") throw new Error("memory.search.multimodal does not support memory.search.fallback. Set fallback to \"none\".");
	return resolved;
}
function resolveMemorySearchConfig(cfg, agentId) {
	return produceMemorySearchConfig(cfg, agentId);
}
function resolveSyncConfig() {
	return {
		onSessionStart: true,
		onSearch: true,
		watch: true,
		watchDebounceMs: 1500,
		intervalMinutes: 0,
		embeddingBatchTimeoutSeconds: void 0,
		sessions: {
			deltaBytes: 1e5,
			deltaMessages: 50,
			postCompactionForce: true
		}
	};
}
function resolveMemorySearchSyncConfig(cfg, agentId) {
	const defaults = cfg.memory?.search;
	if (!((resolveAgentConfig(cfg, agentId)?.memory?.search)?.enabled ?? defaults?.enabled ?? true)) return null;
	return resolveSyncConfig();
}
//#endregion
export { resolveMemorySearchIndexConfig as n, resolveMemorySearchSyncConfig as r, resolveMemorySearchConfig as t };

import { i as clampNumber } from "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { o as normalizeConfiguredMemoryExtraPaths, u as resolveRememberAcrossConversations } from "./legacy-2ovrASa7.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { a as isMemoryMultimodalEnabled, o as normalizeMemoryMultimodalSettings } from "./multimodal-BBZswXZ7.mjs";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-GODJ08xg.mjs";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-D6LrnmPK.mjs";
import { t as resolveMemorySearchSourcePolicy } from "./memory-search-source-policy-B3S1qyBP.mjs";
//#region src/agents/memory-search.ts
/**
* Resolves memory-search source, sync, and ranking configuration.
*/
const DEFAULT_CHUNK_TOKENS = 400;
const DEFAULT_CHUNK_OVERLAP = 80;
const DEFAULT_WATCH_DEBOUNCE_MS = 1500;
const DEFAULT_SESSION_DELTA_BYTES = 1e5;
const DEFAULT_SESSION_DELTA_MESSAGES = 50;
const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_MIN_SCORE = .35;
const DEFAULT_HYBRID_ENABLED = true;
const DEFAULT_HYBRID_VECTOR_WEIGHT = .7;
const DEFAULT_HYBRID_TEXT_WEIGHT = .3;
const DEFAULT_HYBRID_CANDIDATE_MULTIPLIER = 4;
const DEFAULT_MMR_ENABLED = true;
const DEFAULT_MMR_LAMBDA = .7;
const DEFAULT_TEMPORAL_DECAY_ENABLED = true;
const DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS = 30;
const DEFAULT_CACHE_ENABLED = true;
const DEFAULT_CACHE_MAX_ENTRIES = 5e4;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS = 2e3;
const DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES = 60;
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
				enabled: DEFAULT_HYBRID_ENABLED,
				vectorWeight: DEFAULT_HYBRID_VECTOR_WEIGHT,
				textWeight: DEFAULT_HYBRID_TEXT_WEIGHT,
				candidateMultiplier: DEFAULT_HYBRID_CANDIDATE_MULTIPLIER,
				mmr: {
					enabled: DEFAULT_MMR_ENABLED,
					lambda: DEFAULT_MMR_LAMBDA
				},
				temporalDecay: {
					enabled: DEFAULT_TEMPORAL_DECAY_ENABLED,
					halfLifeDays: DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS
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
	const includeRemote = Boolean(overrideRemote?.baseUrl || overrideRemote?.apiKey || overrideRemote?.headers || defaultRemote?.baseUrl || defaultRemote?.apiKey || defaultRemote?.headers || false) || primaryAdapter?.transport !== "local" || fallbackAdapter?.transport === "remote";
	const batch = {
		enabled: overrideRemote?.batch?.enabled ?? defaultRemote?.batch?.enabled ?? false,
		wait: true,
		concurrency: 2,
		pollIntervalMs: DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS,
		timeoutMinutes: DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES
	};
	const remote = includeRemote ? {
		baseUrl: overrideRemote?.baseUrl ?? defaultRemote?.baseUrl,
		apiKey: overrideRemote?.apiKey ?? defaultRemote?.apiKey,
		headers: overrideRemote?.headers ?? defaultRemote?.headers,
		batch
	} : void 0;
	const model = overrides?.model ?? defaults?.model ?? primaryAdapter?.defaultModel ?? "";
	const inputType = overrides?.inputType?.trim() || defaults?.inputType?.trim() || void 0;
	const queryInputType = overrides?.queryInputType?.trim() || defaults?.queryInputType?.trim() || void 0;
	const documentInputType = overrides?.documentInputType?.trim() || defaults?.documentInputType?.trim() || void 0;
	const outputDimensionality = overrides?.outputDimensionality ?? defaults?.outputDimensionality;
	const local = { modelPath: overrides?.local?.modelPath ?? defaults?.local?.modelPath };
	const multimodal = normalizeMemoryMultimodalSettings({
		enabled: overrides?.multimodal?.enabled ?? defaults?.multimodal?.enabled,
		modalities: overrides?.multimodal?.modalities ?? defaults?.multimodal?.modalities,
		maxFileBytes: overrides?.multimodal?.maxFileBytes ?? defaults?.multimodal?.maxFileBytes
	});
	const vector = {
		enabled: overrides?.store?.vector?.enabled ?? defaults?.store?.vector?.enabled ?? true,
		extensionPath: overrides?.store?.vector?.extensionPath ?? defaults?.store?.vector?.extensionPath
	};
	const fts = { tokenizer: overrides?.store?.fts?.tokenizer ?? defaults?.store?.fts?.tokenizer ?? "unicode61" };
	const store = {
		driver: "sqlite",
		databasePath: resolveOpenClawAgentSqlitePath({
			agentId,
			env: process.env
		}),
		fts,
		vector
	};
	const chunking = {
		tokens: DEFAULT_CHUNK_TOKENS,
		overlap: DEFAULT_CHUNK_OVERLAP
	};
	const cache = {
		enabled: overrides?.cache?.enabled ?? defaults?.cache?.enabled ?? DEFAULT_CACHE_ENABLED,
		maxEntries: DEFAULT_CACHE_MAX_ENTRIES
	};
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
		local,
		store,
		chunking,
		cache
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
		watchDebounceMs: DEFAULT_WATCH_DEBOUNCE_MS,
		intervalMinutes: 0,
		embeddingBatchTimeoutSeconds: void 0,
		sessions: {
			deltaBytes: DEFAULT_SESSION_DELTA_BYTES,
			deltaMessages: DEFAULT_SESSION_DELTA_MESSAGES,
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

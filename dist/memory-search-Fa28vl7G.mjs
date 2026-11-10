import { i as clampNumber } from "./utils-gjJ-tD2q.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./legacy-B7HUu-GS.mjs";
import { n as normalizeConfiguredMemoryExtraPaths, o as resolveRememberAcrossConversations } from "./config-utils-DvW0vXFD.mjs";
import { i as normalizeMemoryMultimodalSettings, r as isMemoryMultimodalEnabled } from "./multimodal-Di4Q334s.mjs";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-B-NANLgi.mjs";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-QhiZ6pba.mjs";
import { t as resolveMemorySearchSourcePolicy } from "./memory-search-source-policy-BukRiIGP.mjs";
//#region src/agents/memory-search.ts
/**
* Resolves memory-search source, sync, and ranking configuration.
*/
const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_MIN_SCORE = .35;
const DEFAULT_CACHE_ENABLED = true;
const DEFAULT_CACHE_MAX_ENTRIES = 5e4;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function resolveMemorySearchProviderId(provider) {
	const configured = provider?.trim();
	if (configured?.toLowerCase() === "none") return "none";
	return configured && configured.toLowerCase() !== "auto" ? configured : DEFAULT_MEMORY_EMBEDDING_PROVIDER;
}
/** Compare provider identities without collapsing distinct configured tenants into their adapter. */
function isSameMemorySearchProvider(left, right) {
	const canonical = (id) => {
		const normalized = resolveMemorySearchProviderId(normalizeProviderId(id ?? ""));
		return normalized === "google" ? "gemini" : normalized;
	};
	return canonical(left) === canonical(right);
}
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
	const { sessionMemory, ...sourcePolicy } = resolveMemorySearchSourcePolicy({
		configuredSources,
		rememberAcrossConversations,
		configuredSessionMemory
	});
	return {
		enabled,
		rememberAcrossConversations,
		...sourcePolicy,
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
	const provider = resolveMemorySearchProviderId(overrides?.provider ?? defaults?.provider);
	const primaryAdapter = getConfiguredMemoryEmbeddingProvider(provider, cfg);
	const defaultRemote = defaults?.remote;
	const overrideRemote = overrides?.remote;
	const inheritedRemote = isSameMemorySearchProvider(provider, defaults?.provider) || overrideRemote?.baseUrl === void 0 && defaultRemote?.baseUrl?.trim() ? defaultRemote : void 0;
	const configuredFallback = overrides?.fallback ?? defaults?.fallback ?? "none";
	const fallback = configuredFallback.toLowerCase() === "none" ? "none" : configuredFallback;
	const fallbackAdapter = normalizeProviderId(provider) !== "none" && fallback && fallback !== "none" ? getConfiguredMemoryEmbeddingProvider(fallback, cfg) : void 0;
	const remote = [overrideRemote, defaultRemote].some((remote) => remote?.baseUrl || remote?.apiKey || remote?.headers) || primaryAdapter?.transport !== "local" || fallbackAdapter?.transport === "remote" ? {
		baseUrl: overrideRemote?.baseUrl ?? inheritedRemote?.baseUrl,
		apiKey: overrideRemote?.apiKey ?? inheritedRemote?.apiKey,
		headers: overrideRemote?.headers ?? inheritedRemote?.headers,
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
export { resolveMemorySearchSyncConfig as a, resolveMemorySearchProviderId as i, resolveMemorySearchConfig as n, resolveMemorySearchIndexConfig as r, isSameMemorySearchProvider as t };

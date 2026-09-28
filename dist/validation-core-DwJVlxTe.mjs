import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord, n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { D as listAgentEntriesWithSource, E as listAgentEntries, O as listAgentIds, R as createModelPolicyRefValidator, b as tryResolveAmbientOwnerAgentId, d as resolveAmbientOwnerAgentId, h as resolveEffectiveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as tryGetLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { r as normalizeConfiguredProviderCatalogModelId, t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { t as isPathCaseInsensitive } from "./path-case-CAaiJQol.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import "./defaults-BbU4k6fu.mjs";
import { i as normalizeAgentModelSelectionForConfig, n as normalizeAgentModelMapForConfig } from "./model-input-DKxKaZGG.mjs";
import { n as resolveBundledProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-CDH5BTTD.mjs";
import { n as resolveSandboxScope, t as resolveSandboxDockerEnv } from "./config-contract-CFOz6uqW.mjs";
import { n as getContainerEnvFileEntryIssue } from "./container-env-file-kGWdBAgU.mjs";
import { i as isPathWithinRoot, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-I2uW2Cs8.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { i as normalizeTrustedSafeBinDirs, u as normalizeSafeBinProfileFixtures } from "./exec-safe-bin-trust-DnYaEjcb.mjs";
import { n as normalizeTalkConfig } from "./talk-CaH8Mknv.mjs";
import { O as evaluateDmPolicyAllowFromDependency, V as isBuiltInModelProviderOverlayId } from "./zod-schema.core-DyJd-bbI.mjs";
import { a as resolveChannelDmAllowFrom, o as resolveChannelDmPolicy } from "./dm-access-BjWg2ea5.mjs";
import { a as summarizeAllowedValues, i as appendAllowedValuesHint, n as validateJsonSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { a as NodeHostMcpServerNameSchema, i as McpServerNameSchema, t as OpenClawSchema } from "./zod-schema-B-u3AXjg.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/config/agent-dirs.ts
/** Error thrown when multiple configured agents resolve to the same state directory. */
var DuplicateAgentDirError = class extends Error {
	constructor(duplicates) {
		super(formatDuplicateAgentDirError(duplicates));
		this.name = "DuplicateAgentDirError";
		this.duplicates = duplicates;
	}
};
function realpathAgentDir(agentDir, seen = /* @__PURE__ */ new Set()) {
	const resolved = path.resolve(agentDir);
	if (seen.has(resolved)) return resolved;
	seen.add(resolved);
	const missingSegments = [];
	let cursor = resolved;
	for (;;) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return resolved;
		try {
			if (fs.lstatSync(cursor).isSymbolicLink()) {
				const target = path.resolve(path.dirname(cursor), fs.readlinkSync(cursor));
				return realpathAgentDir(path.join(target, ...missingSegments.toReversed()), seen);
			}
		} catch {}
		const parent = path.dirname(cursor);
		if (parent === cursor) return resolved;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
function canonicalizeAgentDir(agentDir) {
	const resolved = realpathAgentDir(agentDir);
	return isPathCaseInsensitive(resolved) ? normalizeLowercaseStringOrEmpty(resolved) : resolved;
}
function collectReferencedAgentIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const agents = listAgentEntries(cfg);
	const defaultAgentId = agents.find((agent) => agent?.default)?.id;
	if (defaultAgentId) ids.add(normalizeAgentId(defaultAgentId));
	for (const entry of agents) if (entry?.id) ids.add(normalizeAgentId(entry.id));
	const bindings = cfg.bindings;
	if (Array.isArray(bindings)) for (const binding of bindings) {
		const id = binding?.agentId;
		if (typeof id === "string" && id.trim()) ids.add(normalizeAgentId(id));
	}
	return [...ids];
}
/** Finds agent ids whose effective agentDir would share auth/session state. */
function findDuplicateAgentDirs(cfg, deps) {
	const agentIds = collectReferencedAgentIds(cfg);
	if (agentIds.length < 2) return [];
	const byDir = /* @__PURE__ */ new Map();
	for (const agentId of agentIds) {
		const agentDir = resolveEffectiveAgentDir(cfg, agentId, deps);
		const key = canonicalizeAgentDir(agentDir);
		const entry = byDir.get(key);
		if (entry) entry.agentIds.push(agentId);
		else byDir.set(key, {
			agentDir,
			agentIds: [agentId]
		});
	}
	return [...byDir.values()].filter((v) => v.agentIds.length > 1);
}
/** Formats duplicate agentDir conflicts with the remediation operators should take. */
function formatDuplicateAgentDirError(dups) {
	return [
		"Duplicate agentDir detected (multi-agent config).",
		"Each agent must have a unique agentDir; sharing it causes auth/session state collisions and token invalidation.",
		"",
		"Conflicts:",
		...dups.map((d) => `- ${d.agentDir}: ${d.agentIds.map((id) => `"${id}"`).join(", ")}`),
		"",
		"Fix: remove the shared agents.entries.*.agentDir override (or give each agent its own directory).",
		"Auth profiles live in each agent's SQLite store, so a shared agentDir is not how credentials are shared: give each agent its own directory and either leave its store empty to inherit the main agent's profiles, or log it in with `openclaw models auth login`."
	].join("\n");
}
//#endregion
//#region src/config/agent-list-projection.ts
/** Attach the non-serialized list projection used by legacy runtime consumers. */
function attachAgentListProjection(config) {
	const agents = config.agents;
	if (!agents || typeof agents !== "object" || Array.isArray(agents)) return config;
	Object.defineProperty(agents, "list", {
		configurable: true,
		enumerable: false,
		value: listAgentEntries(config),
		writable: false
	});
	return config;
}
//#endregion
//#region src/shared/gateway-tailscale-auth-policy.ts
/** True when Tailscale exposure is configured without gateway authentication. */
function isUnsafeGatewayTailscaleNoAuth(params) {
	return params.authMode === "none" && (params.tailscaleMode === "serve" || params.tailscaleMode === "funnel");
}
/** Formats the shared validation message for unsafe Tailscale no-auth exposure. */
function formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode) {
	if (tailscaleMode === "funnel") return "gateway.tailscale.mode=funnel requires gateway.auth.mode=password; auth.mode=none cannot be used when exposing the gateway through Tailscale Funnel";
	return `gateway.auth.mode=none cannot be used with gateway.tailscale.mode=${tailscaleMode}; configure token, password, or trusted-proxy auth before exposing the gateway through Tailscale`;
}
//#endregion
//#region src/config/agent-limits.ts
const MIN_AGENT_MAX_CONCURRENT = 8;
const AGENT_RUNS_PER_CPU = 4;
let defaultAgentMaxConcurrent;
function resolveDefaultAgentMaxConcurrent() {
	if (defaultAgentMaxConcurrent === void 0) {
		const availableParallelism = typeof os.availableParallelism === "function" ? os.availableParallelism() : os.cpus().length;
		defaultAgentMaxConcurrent = Math.max(MIN_AGENT_MAX_CONCURRENT, availableParallelism * AGENT_RUNS_PER_CPU);
	}
	return defaultAgentMaxConcurrent;
}
function isSubagentSpawnDepthAllowed(depth, maxSpawnDepth = 5) {
	return depth < maxSpawnDepth;
}
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
function resolveAgentMaxConcurrent(cfg) {
	const raw = cfg?.agents?.defaults?.maxConcurrent;
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
	return resolveDefaultAgentMaxConcurrent();
}
/** Resolves subagent concurrency, flooring finite values and clamping to at least one. */
function resolveSubagentMaxConcurrent(cfg) {
	const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
	return 8;
}
//#endregion
//#region src/config/model-provider-rows.ts
function getProviderModelId(model) {
	return typeof model.id === "string" && model.id.trim() ? model.id : void 0;
}
function mergeNormalizedProviderModel(existing, incoming) {
	const cost = mergeModelCost(incoming.cost, existing.cost);
	return {
		...incoming,
		...existing,
		...cost ? { cost } : {}
	};
}
/** Selects authored model rows before defaults erase field omissions. */
function materializeConfiguredProviderModelRows(provider, normalizeModelId) {
	if (!Array.isArray(provider.models) || provider.models.length === 0) return provider;
	const exactRows = /* @__PURE__ */ new Map();
	for (const model of provider.models) {
		const id = getProviderModelId(model)?.trim();
		if (id) {
			const existing = exactRows.get(id);
			exactRows.set(id, existing ? mergeNormalizedProviderModel(existing, model) : model);
		}
	}
	const normalizedIds = /* @__PURE__ */ new Map();
	const selectedRows = /* @__PURE__ */ new Map();
	for (const [id, model] of exactRows) {
		const normalized = normalizeModelId(id) || id;
		normalizedIds.set(id, normalized);
		if (!selectedRows.has(normalized)) selectedRows.set(normalized, exactRows.get(normalized) ?? model);
	}
	const seen = /* @__PURE__ */ new Set();
	const models = provider.models.flatMap((model) => {
		const rawId = getProviderModelId(model);
		if (!rawId) return [model];
		const id = normalizedIds.get(rawId.trim());
		if (seen.has(id)) return [];
		seen.add(id);
		const selected = selectedRows.get(id);
		return [selected.id === id ? selected : {
			...selected,
			id
		}];
	});
	return models.length === provider.models.length && models.every((model, index) => model === provider.models[index]) ? provider : {
		...provider,
		models
	};
}
//#endregion
//#region src/config/provider-policy.ts
/** Applies bundled provider-owned normalization to one provider config during config defaults. */
function normalizeProviderConfigForConfigDefaults(params) {
	const normalized = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry })?.normalizeConfig?.({
		provider: params.provider,
		providerConfig: params.providerConfig
	});
	return normalized && normalized !== params.providerConfig ? normalized : params.providerConfig;
}
/** Applies bundled provider-owned defaults to the full config when that provider has policy. */
function applyProviderConfigDefaultsForConfig(params) {
	return resolveBundledProviderPolicySurface(params.provider, {
		manifestRegistry: params.manifestRegistry,
		loadManifestRegistry: params.loadManifestRegistry
	})?.applyConfigDefaults?.({
		provider: params.provider,
		config: params.config,
		env: params.env
	}) ?? params.config;
}
//#endregion
//#region src/config/defaults.ts
const defaultWarnState = { warned: false };
const DEFAULT_MODEL_ALIASES = {
	opus: "anthropic/claude-opus-5",
	sonnet: "anthropic/claude-sonnet-5",
	gpt: "openai/gpt-5.4",
	"gpt-mini": "openai/gpt-5.4-mini",
	"gpt-nano": "openai/gpt-5.4-nano",
	gemini: "google/gemini-3.1-pro-preview",
	"gemini-flash": "google/gemini-3-flash-preview",
	"gemini-flash-lite": "google/gemini-3.1-flash-lite"
};
const DEFAULT_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const DEFAULT_MODEL_INPUT = ["text"];
const DEFAULT_MODEL_MAX_TOKENS = 8192;
const MISTRAL_SAFE_MAX_TOKENS_BY_MODEL = {
	"devstral-medium-latest": 32768,
	"magistral-small": 4e4,
	"mistral-large-latest": 16384,
	"mistral-medium-2508": 8192,
	"mistral-small-latest": 16384,
	"pixtral-large-latest": 32768
};
function resolveModelCost(raw) {
	return {
		input: typeof raw?.input === "number" ? raw.input : DEFAULT_MODEL_COST.input,
		output: typeof raw?.output === "number" ? raw.output : DEFAULT_MODEL_COST.output,
		cacheRead: typeof raw?.cacheRead === "number" ? raw.cacheRead : DEFAULT_MODEL_COST.cacheRead,
		cacheWrite: typeof raw?.cacheWrite === "number" ? raw.cacheWrite : DEFAULT_MODEL_COST.cacheWrite,
		...raw?.tieredPricing ? { tieredPricing: raw.tieredPricing } : {}
	};
}
function resolveNormalizedProviderModelMaxTokens(params) {
	const clamped = Math.min(params.rawMaxTokens, params.contextWindow);
	if (normalizeProviderId(params.providerId) !== "mistral") return clamped;
	const safeMaxTokens = Object.hasOwn(MISTRAL_SAFE_MAX_TOKENS_BY_MODEL, params.modelId) ? MISTRAL_SAFE_MAX_TOKENS_BY_MODEL[params.modelId] : void 0;
	if (safeMaxTokens !== void 0) return Math.min(clamped, safeMaxTokens);
	return clamped < params.contextWindow ? clamped : Math.min(DEFAULT_MODEL_MAX_TOKENS, params.contextWindow);
}
function applyMessageDefaults(cfg) {
	const messages = cfg.messages;
	if (messages?.ackReactionScope !== void 0) return cfg;
	const nextMessages = messages ? { ...messages } : {};
	nextMessages.ackReactionScope = "group-mentions";
	return {
		...cfg,
		messages: nextMessages
	};
}
function applySessionDefaults(cfg, options = {}) {
	const session = cfg.session;
	if (!session || session.mainKey === void 0) return cfg;
	const trimmed = session.mainKey.trim();
	const warn = options.warn ?? console.warn;
	const warnState = options.warnState ?? defaultWarnState;
	const next = {
		...cfg,
		session: {
			...session,
			mainKey: "main"
		}
	};
	if (trimmed && trimmed !== "main" && !warnState.warned) {
		warnState.warned = true;
		warn("session.mainKey is ignored; main session is always \"main\".");
	}
	return next;
}
/**
* Indexes plugin manifest catalog rows so configured model entries can inherit
* metadata the operator omitted. Without this, materialization would turn an
* override entry that pins only sizing fields into a text-only, non-reasoning,
* zero-cost model — silently dropping vision-gated tools downstream.
*/
function buildManifestCatalogModelLookup(manifestRegistry, policies, configuredProviderIds) {
	const plugins = manifestRegistry?.plugins;
	if (!plugins || plugins.length === 0) return () => void 0;
	let index;
	const keyFor = (providerId, modelId) => normalizeProviderId(providerId) + " " + normalizeConfiguredProviderCatalogModelId(providerId, modelId, policies).toLowerCase();
	return (providerId, modelId) => {
		if (!index) {
			index = /* @__PURE__ */ new Map();
			for (const plugin of plugins) for (const [catalogProviderId, provider] of Object.entries(plugin.modelCatalog?.providers ?? {})) {
				if (!configuredProviderIds.has(normalizeProviderId(catalogProviderId))) continue;
				for (const model of provider.models) {
					const key = keyFor(catalogProviderId, model.id);
					if (!index.has(key)) index.set(key, model);
				}
			}
		}
		return structuredClone(index.get(keyFor(providerId, modelId)));
	};
}
function applyModelDefaults(cfg, options = {}) {
	let mutated = false;
	let nextCfg = cfg;
	const providerConfig = nextCfg.models?.providers;
	if (providerConfig) {
		const manifestRegistry = options.manifestRegistry ?? options.loadManifestRegistry?.();
		const modelIdNormalizationPolicies = manifestRegistry ? collectManifestModelIdNormalizationPolicies(manifestRegistry.plugins) : void 0;
		const resolveCatalogModel = buildManifestCatalogModelLookup(manifestRegistry, modelIdNormalizationPolicies, new Set(Object.keys(providerConfig).map(normalizeProviderId)));
		const nextProviders = { ...providerConfig };
		for (const [providerId, provider] of Object.entries(providerConfig)) {
			const normalizedProvider = materializeConfiguredProviderModelRows(normalizeProviderConfigForConfigDefaults({
				provider: providerId,
				providerConfig: provider,
				manifestRegistry
			}), (modelId) => normalizeConfiguredProviderCatalogModelId(providerId, modelId, modelIdNormalizationPolicies));
			const models = normalizedProvider.models;
			if (!Array.isArray(models) || models.length === 0) {
				if (normalizedProvider !== provider) {
					nextProviders[providerId] = normalizedProvider;
					mutated = true;
				}
				continue;
			}
			const providerApi = normalizedProvider.api;
			const providerMaxTokens = asPositiveFiniteNumber(normalizedProvider.maxTokens);
			const nextProvider = normalizedProvider;
			if (nextProvider !== provider) mutated = true;
			let providerMutated = false;
			const nextModels = models.map((model) => {
				const raw = model;
				const id = raw.id;
				const catalogModel = resolveCatalogModel(providerId, id);
				const reasoning = typeof raw.reasoning === "boolean" ? raw.reasoning : catalogModel?.reasoning ?? false;
				const input = raw.input ?? catalogModel?.input ?? [...DEFAULT_MODEL_INPUT];
				const cost = resolveModelCost(mergeModelCost(catalogModel?.cost, raw.cost));
				const costMutated = !raw.cost || raw.cost.input !== cost.input || raw.cost.output !== cost.output || raw.cost.cacheRead !== cost.cacheRead || raw.cost.cacheWrite !== cost.cacheWrite || raw.cost.tieredPricing !== cost.tieredPricing;
				const contextWindow = asPositiveFiniteNumber(raw.contextWindow) ?? asPositiveFiniteNumber(catalogModel?.contextWindow);
				const contextTokens = asPositiveFiniteNumber(raw.contextTokens) ?? asPositiveFiniteNumber(catalogModel?.contextTokens);
				const maxTokenContextWindow = contextWindow ?? 2e5;
				const defaultMaxTokens = Math.min(providerMaxTokens ?? DEFAULT_MODEL_MAX_TOKENS, maxTokenContextWindow);
				const rawMaxTokens = asPositiveFiniteNumber(raw.maxTokens) ?? asPositiveFiniteNumber(catalogModel?.maxTokens) ?? defaultMaxTokens;
				const maxTokens = resolveNormalizedProviderModelMaxTokens({
					providerId,
					modelId: id,
					contextWindow: maxTokenContextWindow,
					rawMaxTokens
				});
				const api = raw.api ?? providerApi;
				const thinkingLevelMap = raw.thinkingLevelMap === void 0 && catalogModel?.thinkingLevelMap !== void 0 ? catalogModel.thinkingLevelMap : void 0;
				const compat = raw.compat === void 0 && catalogModel?.compat !== void 0 ? catalogModel.compat : void 0;
				if (!(raw.reasoning !== reasoning || raw.input === void 0 || costMutated || raw.contextWindow !== contextWindow || raw.contextTokens !== contextTokens || raw.maxTokens !== maxTokens || raw.api !== api || thinkingLevelMap !== void 0 || compat !== void 0)) return model;
				providerMutated = true;
				return Object.assign({}, raw, {
					reasoning,
					input,
					cost,
					contextWindow,
					contextTokens,
					maxTokens,
					api
				}, thinkingLevelMap !== void 0 ? { thinkingLevelMap } : {}, compat !== void 0 ? { compat } : {});
			});
			if (!providerMutated) {
				if (nextProvider !== provider) nextProviders[providerId] = nextProvider;
				continue;
			}
			nextProviders[providerId] = {
				...nextProvider,
				models: nextModels
			};
			mutated = true;
		}
		if (mutated) nextCfg = {
			...nextCfg,
			models: {
				...nextCfg.models,
				providers: nextProviders
			}
		};
	}
	let nextAgents = nextCfg.agents;
	const rawAgentList = nextAgents?.list;
	if (Array.isArray(rawAgentList)) {
		let listMutated = false;
		const agentList = rawAgentList.map((agent) => {
			if (!isRecord(agent)) return agent;
			let nextAgent = agent;
			if (Object.hasOwn(agent, "model")) {
				const normalizedModel = normalizeAgentModelSelectionForConfig(agent.model);
				if (normalizedModel !== agent.model) {
					nextAgent = {
						...nextAgent,
						model: normalizedModel
					};
					listMutated = true;
				}
			}
			if (isRecord(agent.models)) {
				const normalizedModels = normalizeAgentModelMapForConfig(agent.models);
				if (normalizedModels !== agent.models) {
					nextAgent = {
						...nextAgent,
						models: normalizedModels
					};
					listMutated = true;
				}
			}
			return nextAgent;
		});
		if (listMutated) {
			nextAgents = {
				...nextAgents,
				list: agentList
			};
			mutated = true;
		}
	}
	const existingAgent = nextAgents?.defaults;
	if (!existingAgent) {
		if (!mutated) return cfg;
		return nextAgents === nextCfg.agents ? nextCfg : {
			...nextCfg,
			agents: nextAgents
		};
	}
	let nextAgent = existingAgent;
	const normalizedModel = normalizeAgentModelSelectionForConfig(existingAgent.model);
	if (normalizedModel !== existingAgent.model) {
		nextAgent = {
			...nextAgent,
			model: normalizedModel
		};
		mutated = true;
	}
	const rawExistingModels = existingAgent.models ?? {};
	const existingModels = normalizeAgentModelMapForConfig(rawExistingModels);
	if (existingModels !== rawExistingModels) mutated = true;
	if (Object.keys(existingModels).length === 0) return mutated ? {
		...nextCfg,
		agents: {
			...nextAgents,
			defaults: nextAgent
		}
	} : cfg;
	const nextModels = { ...existingModels };
	for (const [alias, target] of Object.entries(DEFAULT_MODEL_ALIASES)) {
		const entry = nextModels[target];
		if (!entry) continue;
		if (entry.alias !== void 0) continue;
		const normalizedAlias = normalizeLowercaseStringOrEmpty(alias);
		if (Object.entries(nextModels).some(([modelRef, candidate]) => modelRef !== target && normalizeLowercaseStringOrEmpty(candidate.alias) === normalizedAlias)) continue;
		nextModels[target] = {
			...entry,
			alias
		};
		mutated = true;
	}
	if (!mutated) return cfg;
	return {
		...nextCfg,
		agents: {
			...nextAgents,
			defaults: {
				...nextAgent,
				models: nextModels
			}
		}
	};
}
function applyAgentDefaults(cfg) {
	const agents = cfg.agents;
	const defaults = agents?.defaults;
	const hasMax = typeof defaults?.maxConcurrent === "number" && Number.isFinite(defaults.maxConcurrent);
	const hasSubMax = typeof defaults?.subagents?.maxConcurrent === "number" && Number.isFinite(defaults.subagents.maxConcurrent);
	const hasSubArchive = typeof defaults?.subagents?.archiveAfterMinutes === "number" && Number.isFinite(defaults.subagents.archiveAfterMinutes);
	if (hasMax && hasSubMax && hasSubArchive) return cfg;
	const nextDefaults = defaults ? { ...defaults } : {};
	if (!hasMax) nextDefaults.maxConcurrent = resolveAgentMaxConcurrent();
	const nextSubagents = defaults?.subagents ? { ...defaults.subagents } : {};
	if (!hasSubMax) nextSubagents.maxConcurrent = 8;
	if (!hasSubArchive) nextSubagents.archiveAfterMinutes = 60;
	return {
		...cfg,
		agents: {
			...agents,
			defaults: {
				...nextDefaults,
				subagents: nextSubagents
			}
		}
	};
}
function hasAnthropicDefaultSignal(cfg, env) {
	if (env.ANTHROPIC_API_KEY?.trim() || env.ANTHROPIC_OAUTH_TOKEN?.trim()) return true;
	const profiles = cfg.auth?.profiles;
	if (profiles) for (const profile of Object.values(profiles)) {
		const provider = normalizeProviderId(profile?.provider);
		if (provider === "anthropic" || provider === "claude-cli") return true;
	}
	const order = cfg.auth?.order;
	if (!order) return false;
	return Object.keys(order).some((provider) => {
		const normalizedProvider = normalizeProviderId(provider);
		if (normalizedProvider !== "anthropic" && normalizedProvider !== "claude-cli") return false;
		return order[provider] !== void 0;
	});
}
function applyContextPruningDefaults(cfg, options = {}) {
	if (!cfg.agents?.defaults) return cfg;
	const env = options.env ?? process.env;
	if (!hasAnthropicDefaultSignal(cfg, env)) return cfg;
	return applyProviderConfigDefaultsForConfig({
		provider: "anthropic",
		config: cfg,
		env,
		manifestRegistry: options.manifestRegistry,
		loadManifestRegistry: options.loadManifestRegistry
	}) ?? cfg;
}
function applyCompactionDefaults(cfg) {
	const defaults = cfg.agents?.defaults;
	if (!defaults) return cfg;
	const compaction = defaults?.compaction;
	if (compaction?.mode) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				compaction: {
					...compaction,
					mode: "safeguard"
				}
			}
		}
	};
}
//#endregion
//#region src/config/normalize-exec-safe-bin.ts
/**
* Config normalization for exec safe-bin policy before materialized config is consumed.
* Keep this limited to persisted global/per-agent config shape; runtime trust decisions live in infra.
*/
/** Normalize exec safe-bin profiles and trusted dirs in global and per-agent config scopes. */
function normalizeExecSafeBinProfilesInConfig(cfg) {
	const normalizeExec = (exec) => {
		if (!exec || typeof exec !== "object" || Array.isArray(exec)) return;
		const typedExec = exec;
		const normalizedProfiles = normalizeSafeBinProfileFixtures(typedExec.safeBinProfiles);
		typedExec.safeBinProfiles = Object.keys(normalizedProfiles).length > 0 ? normalizedProfiles : void 0;
		const normalizedTrustedDirs = normalizeTrustedSafeBinDirs(typedExec.safeBinTrustedDirs);
		typedExec.safeBinTrustedDirs = normalizedTrustedDirs.length > 0 ? normalizedTrustedDirs : void 0;
	};
	normalizeExec(cfg.tools?.exec);
	for (const agent of listAgentEntries(cfg)) normalizeExec(agent?.tools?.exec);
}
//#endregion
//#region src/config/normalize-paths.ts
const PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
/** Normalize tilde paths in path-like config fields using the config reader's home. */
function normalizeConfigPaths(cfg, opts) {
	function normalizeAny(key, value) {
		if (typeof value === "string") return key && PATH_VALUE_RE.test(value.trim()) && (PATH_KEY_RE.test(key) || PATH_LIST_KEYS.has(key)) ? resolveUserPath(value, opts?.env, opts?.homedir) : value;
		if (Array.isArray(value)) {
			const normalizeChildren = Boolean(key && PATH_LIST_KEYS.has(key));
			return value.map((entry) => normalizeAny(typeof entry === "string" && normalizeChildren ? key : void 0, entry));
		}
		if (isPlainObject(value)) for (const [childKey, childValue] of Object.entries(value)) {
			const next = normalizeAny(childKey, childValue);
			if (next !== childValue) value[childKey] = next;
		}
		return value;
	}
	normalizeAny(void 0, cfg);
	return cfg;
}
//#endregion
//#region src/config/materialize.ts
function asResolvedSourceConfig(config) {
	return config;
}
function asRuntimeConfig(config) {
	return config;
}
function materializeRuntimeConfig(config, options = {}) {
	let next = applyMessageDefaults(config);
	next = applySessionDefaults(next);
	next = applyAgentDefaults(next);
	next = applyContextPruningDefaults(next, options);
	next = applyCompactionDefaults(next);
	next = applyModelDefaults(next, {
		manifestRegistry: options.manifestRegistry,
		loadManifestRegistry: options.loadManifestRegistry
	});
	next = normalizeTalkConfig(next);
	normalizeConfigPaths(next, options);
	normalizeExecSafeBinProfilesInConfig(next);
	return asRuntimeConfig(inheritLegacyDefaultAgentId(config, next));
}
//#endregion
//#region src/config/validation-channel-rules.ts
const bundledChannelSchemaById = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map((entry) => [entry.channelId, entry.schema]));
const bundledChannelIds = Object.freeze(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map((entry) => normalizeLowercaseStringOrEmpty(entry.channelId)).filter((channelId) => channelId.length > 0));
const bundledChannelIdSet = new Set(bundledChannelIds);
const bundledChannelAliases = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).flatMap((entry) => {
	const channelId = normalizeLowercaseStringOrEmpty(entry.channelId);
	if (!channelId) return [];
	return (entry.aliases ?? []).map((alias) => [normalizeLowercaseStringOrEmpty(alias), channelId]).filter(([alias]) => alias.length > 0);
}));
function normalizeBundledChannelId(raw) {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return null;
	const resolved = bundledChannelAliases.get(normalized) ?? normalized;
	return bundledChannelIdSet.has(resolved) ? resolved : null;
}
function formatRawChannelConfigIssueMessage(message) {
	return `invalid config: ${message}`;
}
function buildDmPolicyDependencyWarning(params) {
	const channelBase = `channels.${params.channelId}`;
	const scope = params.accountId ? `${channelBase}.accounts.${params.accountId}` : channelBase;
	const allowFromPath = `${scope}.allowFrom`;
	const inherited = params.accountId && params.allowFromSource === "inherited";
	const allowFromSubject = inherited ? `${allowFromPath} is unset and ${channelBase}.allowFrom` : allowFromPath;
	const accountInheritedTarget = inherited ? ` or ${channelBase}.allowFrom` : "";
	const accountOverrideFix = params.accountId && !inherited ? `, remove ${allowFromPath} to inherit ${channelBase}.allowFrom,` : "";
	return {
		path: allowFromPath,
		message: params.violation === "open_requires_wildcard" ? `${scope}.dmPolicy="open" but ${allowFromSubject} does not include "*"; all DMs will be dropped. Add "*" to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or set ${scope}.dmPolicy to "pairing"/"allowlist".` : `${scope}.dmPolicy="allowlist" but ${allowFromSubject} is empty; all DMs will be dropped. Add at least one sender ID to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or change ${scope}.dmPolicy.`
	};
}
const DM_POLICY_PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set([
	"defaults",
	"modelByChannel",
	"tools"
]);
function hasDefinedConfigValue(record, key) {
	return Object.hasOwn(record, key) && record[key] !== void 0;
}
function hasConfiguredDmAllowFrom(record, mode) {
	const dm = isRecord(record.dm) ? record.dm : null;
	if (mode === "nestedOnly") return dm !== null && hasDefinedConfigValue(dm, "allowFrom") || hasDefinedConfigValue(record, "allowFrom");
	return hasDefinedConfigValue(record, "allowFrom") || dm !== null && hasDefinedConfigValue(dm, "allowFrom");
}
function isConfigRecordEnabled(record) {
	return record.enabled !== false;
}
function hasChannelDmPolicyDependencyWarningCandidates(config) {
	if (!config.channels || !isRecord(config.channels)) return false;
	return Object.entries(config.channels).some(([channelId, channelValue]) => !DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) && isRecord(channelValue) && isConfigRecordEnabled(channelValue));
}
/**
* Surface dmPolicy/allowFrom dependency problems generically for every channel that
* exposes DM policy via the canonical top-level `dmPolicy`/`allowFrom` fields. These
* configs parse fine but drop every DM at runtime, so we warn (rather than reject) to
* stay consistent with `security audit`/`doctor` and avoid breaking existing-but-usable
* configs on upgrade.
*
* Resolution goes through the shared DM-access helpers so the warning matches the
* effective policy/allowFrom the runtime sees, including the legacy `dm.*` aliases and
* account->channel inheritance. `nestedOnly` channels (canonical fields under `dm.*`)
* are skipped because their config shape does not match this warning's top-level paths.
*/
function collectChannelDmPolicyDependencyWarnings(config, options = {}) {
	if (!config.channels || !isRecord(config.channels)) return [];
	const warnings = [];
	for (const [channelId, channelValue] of Object.entries(config.channels)) {
		if (DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) || !isRecord(channelValue) || !isConfigRecordEnabled(channelValue)) continue;
		const metadata = options.dmPolicyMetadata?.get(channelId);
		const mode = metadata?.dmAllowFromMode ?? "topOnly";
		const openDmRequiresAllowFromWildcard = metadata?.openDmRequiresAllowFromWildcard !== false;
		if (mode === "nestedOnly") continue;
		const channelViolation = evaluateDmPolicyAllowFromDependency({
			policy: resolveChannelDmPolicy({
				account: channelValue,
				mode
			}),
			allowFrom: resolveChannelDmAllowFrom({
				account: channelValue,
				mode
			})
		});
		if (channelViolation && (channelViolation !== "open_requires_wildcard" || openDmRequiresAllowFromWildcard)) warnings.push(buildDmPolicyDependencyWarning({
			channelId,
			violation: channelViolation
		}));
		if (!isRecord(channelValue.accounts)) continue;
		for (const [accountId, accountValue] of Object.entries(channelValue.accounts)) {
			if (!isRecord(accountValue) || !isConfigRecordEnabled(accountValue)) continue;
			const allowFromSource = hasConfiguredDmAllowFrom(accountValue, mode) ? "explicit" : "inherited";
			const accountViolation = evaluateDmPolicyAllowFromDependency({
				policy: resolveChannelDmPolicy({
					account: accountValue,
					parent: channelValue,
					mode
				}),
				allowFrom: resolveChannelDmAllowFrom({
					account: accountValue,
					parent: channelValue,
					mode
				})
			});
			if (accountViolation && (accountViolation !== "open_requires_wildcard" || openDmRequiresAllowFromWildcard)) warnings.push(buildDmPolicyDependencyWarning({
				channelId,
				accountId,
				allowFromSource,
				violation: accountViolation
			}));
		}
	}
	return warnings;
}
function collectRawBundledChannelConfigIssues(config) {
	if (!config.channels || !isRecord(config.channels)) return [];
	const issues = [];
	for (const [channelId, schema] of bundledChannelSchemaById) {
		if (!Object.hasOwn(config.channels, channelId)) continue;
		const result = validateJsonSchemaValue({
			schema,
			cacheKey: `raw-channel:${channelId}`,
			value: config.channels[channelId],
			applyDefaults: false
		});
		if (result.ok) continue;
		for (const error of result.errors) {
			const message = error.additionalProperty ? `${error.message}: "${error.additionalProperty}"` : error.message;
			const path = error.path === "<root>" ? `channels.${channelId}` : `channels.${channelId}.${error.path}`;
			issues.push({
				path,
				message: formatRawChannelConfigIssueMessage(message),
				allowedValues: error.allowedValues,
				allowedValuesHiddenCount: error.allowedValuesHiddenCount
			});
		}
	}
	return issues;
}
//#endregion
//#region src/secrets/unsupported-surface-policy.ts
/** Defines unsupported secret-ref surfaces and operator-facing policy messages. */
const CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS = [
	"hooks.token",
	"hooks.gmail.pushToken",
	"hooks.mappings[].sessionKey",
	"auth-profiles.oauth.*"
];
const CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS = [
	"hooks.token",
	"hooks.gmail.pushToken",
	"hooks.mappings[].sessionKey"
];
const bundledChannelUnsupportedSecretRefSurfacePatterns = [...new Set(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.flatMap((entry) => "unsupportedSecretRefSurfacePatterns" in entry ? entry.unsupportedSecretRefSurfacePatterns ?? [] : []))];
const unsupportedSecretRefSurfacePatterns = [...CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS, ...bundledChannelUnsupportedSecretRefSurfacePatterns];
const unsupportedSecretRefConfigCandidatePatterns = [...CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS, ...bundledChannelUnsupportedSecretRefSurfacePatterns];
const parsedPatternCache = /* @__PURE__ */ new Map();
function parseUnsupportedSecretRefSurfacePattern(pattern) {
	const cached = parsedPatternCache.get(pattern);
	if (cached) return cached;
	const parsed = pattern.split(".").filter((segment) => segment.length > 0).map((segment) => {
		if (segment === "*") return { kind: "wildcard" };
		if (segment.endsWith("[]")) return {
			kind: "array",
			key: segment.slice(0, -2)
		};
		return {
			kind: "key",
			key: segment
		};
	});
	parsedPatternCache.set(pattern, parsed);
	return parsed;
}
function collectPatternCandidates(params) {
	if (params.tokenIndex >= params.tokens.length) {
		params.candidates.push({
			path: params.pathSegments.join("."),
			value: params.current
		});
		return;
	}
	const token = params.tokens[params.tokenIndex];
	if (!token) return;
	if (token.kind === "wildcard") {
		if (Array.isArray(params.current)) {
			for (const [index, value] of params.current.entries()) collectPatternCandidates({
				...params,
				current: value,
				tokenIndex: params.tokenIndex + 1,
				pathSegments: [...params.pathSegments, String(index)]
			});
			return;
		}
		if (!isRecord(params.current)) return;
		for (const [key, value] of Object.entries(params.current)) collectPatternCandidates({
			...params,
			current: value,
			tokenIndex: params.tokenIndex + 1,
			pathSegments: [...params.pathSegments, key]
		});
		return;
	}
	if (!isRecord(params.current)) return;
	if (token.kind === "array") {
		if (!Object.hasOwn(params.current, token.key)) return;
		const value = params.current[token.key];
		if (!Array.isArray(value)) return;
		for (const [index, entry] of value.entries()) collectPatternCandidates({
			...params,
			current: entry,
			tokenIndex: params.tokenIndex + 1,
			pathSegments: [
				...params.pathSegments,
				token.key,
				String(index)
			]
		});
		return;
	}
	if (!Object.hasOwn(params.current, token.key)) return;
	collectPatternCandidates({
		...params,
		current: params.current[token.key],
		tokenIndex: params.tokenIndex + 1,
		pathSegments: [...params.pathSegments, token.key]
	});
}
/**
* Returns canonical config/auth-profile path patterns that do not support SecretRef values.
*/
function listUnsupportedSecretRefSurfacePatterns() {
	return [...unsupportedSecretRefSurfacePatterns];
}
/**
* Finds configured openclaw.json values whose surfaces currently reject SecretRef objects.
*/
function collectUnsupportedSecretRefConfigCandidates(raw) {
	if (!isRecord(raw)) return [];
	const candidates = [];
	for (const pattern of unsupportedSecretRefConfigCandidatePatterns) collectPatternCandidates({
		current: raw,
		tokens: parseUnsupportedSecretRefSurfacePattern(pattern),
		tokenIndex: 0,
		pathSegments: [],
		candidates
	});
	return candidates;
}
const unsupportedSecretRefSurfacePolicy = {
	listPatterns: listUnsupportedSecretRefSurfacePatterns,
	collectConfigCandidates: collectUnsupportedSecretRefConfigCandidates
};
//#endregion
//#region src/config/validation-issues.ts
const SECRETREF_POLICY_DOC_URL = "https://docs.openclaw.ai/reference/secretref-credential-surface";
function toConfigPathSegments(path) {
	if (!Array.isArray(path)) return [];
	return path.filter((segment) => {
		const segmentType = typeof segment;
		return segmentType === "string" || segmentType === "number";
	});
}
function formatConfigPath(segments) {
	return segments.join(".");
}
function withConfigIssuePath(issue, pathSegments) {
	Object.defineProperty(issue, "pathSegments", {
		value: [...pathSegments],
		enumerable: false
	});
	return issue;
}
function appendNumericBoundHint(message, record) {
	if ((typeof record.origin === "string" ? record.origin : "") !== "number") return message;
	const inclusive = record.inclusive === true;
	if (record.code === "too_big") {
		const maximum = typeof record.maximum === "number" ? record.maximum : void 0;
		if (maximum !== void 0) return inclusive ? `${message} (maximum: ${maximum})` : `${message} (must be less than ${maximum})`;
	}
	if (record.code === "too_small") {
		const minimum = typeof record.minimum === "number" ? record.minimum : void 0;
		if (minimum !== void 0) return inclusive ? `${message} (minimum: ${minimum})` : `${message} (must be greater than ${minimum})`;
	}
	return message;
}
function collectAllowedValuesFromIssue(issue) {
	const record = asNullableObjectRecord(issue);
	if (!record) return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const code = typeof record.code === "string" ? record.code : "";
	if (code === "invalid_value") {
		const values = record.values;
		return Array.isArray(values) ? {
			values,
			incomplete: false,
			hasValues: values.length > 0
		} : {
			values: [],
			incomplete: true,
			hasValues: false
		};
	}
	if (code === "invalid_type") return record.expected === "boolean" ? {
		values: [true, false],
		incomplete: false,
		hasValues: true
	} : {
		values: [],
		incomplete: true,
		hasValues: false
	};
	if (code !== "invalid_union") return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const nested = record.errors;
	if (!Array.isArray(nested) || nested.length === 0) return {
		values: [],
		incomplete: true,
		hasValues: false
	};
	const collected = [];
	for (const branch of nested) {
		if (!Array.isArray(branch) || branch.length === 0) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		const branchCollected = collectAllowedValuesFromIssueList(branch);
		if (branchCollected.incomplete || !branchCollected.hasValues) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		collected.push(...branchCollected.values);
	}
	return {
		values: collected,
		incomplete: false,
		hasValues: collected.length > 0
	};
}
function collectAllowedValuesFromIssueList(issues) {
	const collected = [];
	let hasValues = false;
	for (const issue of issues) {
		const branch = collectAllowedValuesFromIssue(issue);
		if (branch.incomplete) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		if (branch.hasValues) {
			hasValues = true;
			collected.push(...branch.values);
		}
	}
	return {
		values: collected,
		incomplete: false,
		hasValues
	};
}
function collectAllowedValuesFromUnknownIssue(issue) {
	const collection = collectAllowedValuesFromIssue(issue);
	return collection.incomplete || !collection.hasValues ? [] : collection.values;
}
function isBindingsIssuePath(pathSegments) {
	return pathSegments[0] === "bindings" && typeof pathSegments[1] === "number";
}
function isRouteTypeMismatchIssue(issue) {
	const issuePath = toConfigPathSegments(issue.path);
	return issuePath.length === 1 && issuePath[0] === "type" && issue.code === "invalid_value" && Array.isArray(issue.values) && issue.values.includes("route");
}
function extractBindingsSpecificUnionIssue(record, parentPathSegments) {
	if (!isBindingsIssuePath(toConfigPathSegments(record.path)) || !Array.isArray(record.errors)) return null;
	let matchingBranchIssue = null;
	let matchingBranchIsUnrecognized = false;
	let matchingBranchPathLen = -1;
	let sawRouteTypeMismatch = false;
	for (const errGroup of record.errors) {
		if (!Array.isArray(errGroup)) continue;
		const branch = errGroup.map(asNullableObjectRecord).filter(Boolean);
		if (branch.length === 0) continue;
		if (branch.some(isRouteTypeMismatchIssue)) {
			sawRouteTypeMismatch = true;
			continue;
		}
		let branchBestIssue = null;
		let branchBestIsUnrecognized = false;
		let branchBestPathLen = -1;
		for (const issue of branch) {
			const issuePathLen = toConfigPathSegments(issue.path).length;
			const issueIsUnrecognized = issue.code === "unrecognized_keys";
			if (issuePathLen > branchBestPathLen || issuePathLen === branchBestPathLen && issueIsUnrecognized && !branchBestIsUnrecognized) {
				branchBestIssue = issue;
				branchBestIsUnrecognized = issueIsUnrecognized;
				branchBestPathLen = issuePathLen;
			}
		}
		if (!branchBestIssue) continue;
		if (matchingBranchIssue) return null;
		matchingBranchIssue = branchBestIssue;
		matchingBranchIsUnrecognized = branchBestIsUnrecognized;
		matchingBranchPathLen = branchBestPathLen;
	}
	if (!sawRouteTypeMismatch || !matchingBranchIssue || matchingBranchPathLen === 0 && !matchingBranchIsUnrecognized) return null;
	const fullPathSegments = [...parentPathSegments, ...toConfigPathSegments(matchingBranchIssue.path)];
	const message = typeof matchingBranchIssue.message === "string" ? matchingBranchIssue.message : "Invalid input";
	return withConfigIssuePath({
		path: formatConfigPath(fullPathSegments),
		message
	}, fullPathSegments);
}
function mapZodIssueToConfigIssue(issue) {
	const record = asNullableObjectRecord(issue);
	const pathSegments = toConfigPathSegments(record?.path);
	const path = formatConfigPath(pathSegments);
	const message = typeof record?.message === "string" ? record.message : "Invalid input";
	const enrichedMessage = record ? appendNumericBoundHint(message, record) : message;
	const allowedValuesSummary = summarizeAllowedValues(collectAllowedValuesFromUnknownIssue(issue));
	if (record?.code === "invalid_union" && !allowedValuesSummary) {
		const betterIssue = extractBindingsSpecificUnionIssue(record, pathSegments);
		if (betterIssue) return betterIssue;
	}
	if (!allowedValuesSummary) return withConfigIssuePath({
		path,
		message: enrichedMessage
	}, pathSegments);
	return withConfigIssuePath({
		path,
		message: appendAllowedValuesHint(enrichedMessage, allowedValuesSummary),
		allowedValues: allowedValuesSummary.values,
		allowedValuesHiddenCount: allowedValuesSummary.hiddenCount
	}, pathSegments);
}
function isObjectSecretRefCandidate(value) {
	return isRecord(value) && Boolean(coerceSecretRef(value));
}
function formatUnsupportedMutableSecretRefMessage(path) {
	return [
		`SecretRef objects are not supported at ${path}.`,
		"This credential is runtime-mutable or runtime-managed and must stay a plain string value.",
		"Use a plain string (env template strings like \"${MY_VAR}\" are allowed).",
		`See ${SECRETREF_POLICY_DOC_URL}.`
	].join(" ");
}
function collectUnsupportedMutableSecretRefIssues(raw) {
	const issues = [];
	for (const candidate of unsupportedSecretRefSurfacePolicy.collectConfigCandidates(raw)) if (isObjectSecretRefCandidate(candidate.value)) issues.push({
		path: candidate.path,
		message: formatUnsupportedMutableSecretRefMessage(candidate.path)
	});
	return issues;
}
function formatFilteredUnrecognizedKeyMessage(message, keys) {
	const quotedKeys = keys.map((key) => `"${key}"`).join(", ");
	if (/must not have additional properties/i.test(message)) return `must not have additional properties: ${quotedKeys}`;
	return keys.length === 1 ? `Unrecognized key: ${quotedKeys}` : `Unrecognized keys: ${quotedKeys}`;
}
function filterUnsupportedMutableSecretRefSchemaIssue(params) {
	const { issue, policyIssue } = params;
	if (issue.path === policyIssue.path) return /expected string, received object/i.test(issue.message) ? null : issue;
	if (!issue.path || !policyIssue.path || !policyIssue.path.startsWith(`${issue.path}.`)) return issue;
	const childKey = policyIssue.path.slice(issue.path.length + 1).split(".")[0];
	if (!childKey || !/Unrecognized key|must not have additional properties/i.test(issue.message)) return issue;
	const unrecognizedKeys = [...issue.message.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
	if (!unrecognizedKeys.includes(childKey)) return issue;
	const remainingKeys = unrecognizedKeys.filter((key) => key !== void 0 && key !== childKey);
	return remainingKeys.length === 0 ? null : {
		...issue,
		message: formatFilteredUnrecognizedKeyMessage(issue.message, remainingKeys)
	};
}
function mergeUnsupportedMutableSecretRefIssues(policyIssues, schemaIssues) {
	if (policyIssues.length === 0) return schemaIssues;
	const filteredSchemaIssues = schemaIssues.flatMap((issue) => {
		let filteredIssue = issue;
		for (const policyIssue of policyIssues) {
			if (!filteredIssue) return [];
			filteredIssue = filterUnsupportedMutableSecretRefSchemaIssue({
				issue: filteredIssue,
				policyIssue
			});
		}
		return filteredIssue ? [filteredIssue] : [];
	});
	return [...policyIssues, ...filteredSchemaIssues];
}
function collectUnsupportedSecretRefPolicyIssues(raw) {
	return collectUnsupportedMutableSecretRefIssues(raw);
}
//#endregion
//#region src/config/validation-core.ts
function collectHeartbeatOwnerWarnings(config) {
	const agentEntries = listAgentEntries(config);
	return listAgentIds(config).length > 1 && !agentEntries.some((entry) => Boolean(entry.heartbeat)) && !config.agents?.defaults?.heartbeat && tryResolveAmbientOwnerAgentId(config) === void 0 ? [{
		path: "agents.defaults.heartbeat.agentId",
		message: "Multi-agent config has no ambient heartbeat owner; heartbeats stay disabled until agents.defaults.heartbeat.agentId or agents.defaults.systemAgent.agentId is set."
	}] : [];
}
function materializeBundledModelProviderOverlays(config) {
	const providers = config.models?.providers;
	if (!providers) return config;
	let nextProviders;
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (!isBuiltInModelProviderOverlayId(providerId) || providerConfig.baseUrl && Array.isArray(providerConfig.models)) continue;
		nextProviders ??= { ...providers };
		nextProviders[providerId] = {
			...providerConfig,
			baseUrl: providerConfig.baseUrl ?? "",
			models: providerConfig.models ?? []
		};
	}
	return nextProviders ? {
		...config,
		models: {
			...config.models,
			providers: nextProviders
		}
	} : config;
}
function stripPreservedLegacyRootKeysForValidation(raw, keys) {
	if (!keys || keys.length === 0 || !isRecord(raw)) return raw;
	const next = { ...raw };
	for (const key of keys) delete next[key];
	return next;
}
function collectMcpServerNameIssues(raw) {
	if (!isRecord(raw)) return [];
	const mcp = isRecord(raw.mcp) ? raw.mcp : void 0;
	const nodeHost = isRecord(raw.nodeHost) ? raw.nodeHost : void 0;
	const nodeHostMcp = isRecord(nodeHost?.mcp) ? nodeHost.mcp : void 0;
	const locations = [{
		path: ["mcp", "servers"],
		servers: isRecord(mcp?.servers) ? mcp.servers : void 0,
		schema: McpServerNameSchema
	}, {
		path: [
			"nodeHost",
			"mcp",
			"servers"
		],
		servers: isRecord(nodeHostMcp?.servers) ? nodeHostMcp.servers : void 0,
		schema: NodeHostMcpServerNameSchema
	}];
	const issues = [];
	for (const location of locations) for (const serverName of Object.keys(location.servers ?? {})) {
		const result = location.schema.safeParse(serverName);
		if (result.success) continue;
		const pathSegments = [...location.path, serverName];
		for (const issue of result.error.issues) issues.push(withConfigIssuePath({
			path: pathSegments.join("."),
			message: issue.message
		}, pathSegments));
	}
	return issues;
}
function isWorkspaceAvatarPath(value, workspaceDir) {
	const workspaceRoot = path.resolve(workspaceDir);
	const resolved = path.resolve(workspaceRoot, value);
	return isPathWithinRoot(workspaceRoot, resolved);
}
function createIdentityAvatarIssue(source, message) {
	const pathSegments = source.kind === "entries" ? [
		"agents",
		"entries",
		source.key,
		"identity",
		"avatar"
	] : [
		"agents",
		"list",
		source.index,
		"identity",
		"avatar"
	];
	return withConfigIssuePath({
		path: pathSegments.join("."),
		message
	}, pathSegments);
}
function validateIdentityAvatar(config, env) {
	const agents = listAgentEntriesWithSource(config);
	if (agents.length === 0) return [];
	const issues = [];
	for (const { entry, source } of agents) {
		const avatarRaw = entry.identity?.avatar;
		if (typeof avatarRaw !== "string") continue;
		const avatar = avatarRaw.trim();
		if (!avatar || isAvatarDataUrl(avatar) || isAvatarHttpUrl(avatar)) continue;
		if (avatar.startsWith("~")) {
			issues.push(createIdentityAvatarIssue(source, "identity.avatar must be a workspace-relative path, http(s) URL, or data URI."));
			continue;
		}
		if (hasAvatarUriScheme(avatar) && !isWindowsAbsolutePath(avatar)) {
			issues.push(createIdentityAvatarIssue(source, "identity.avatar must be a workspace-relative path, http(s) URL, or data URI."));
			continue;
		}
		if (!isWorkspaceAvatarPath(avatar, resolveAgentWorkspaceDir(config, entry.id ?? resolveAmbientOwnerAgentId(config), env))) issues.push(createIdentityAvatarIssue(source, "identity.avatar must stay within the agent workspace."));
	}
	return issues;
}
function validateGatewayTailscaleBind(config) {
	const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
	if (tailscaleMode !== "serve" && tailscaleMode !== "funnel") return [];
	const bindMode = config.gateway?.bind ?? "loopback";
	if (bindMode === "loopback") return [];
	const customBindHost = config.gateway?.customBindHost;
	if (bindMode === "custom" && isCanonicalDottedDecimalIPv4(customBindHost) && isLoopbackIpAddress(customBindHost)) return [];
	return [{
		path: "gateway.bind",
		message: `gateway.bind must resolve to loopback when gateway.tailscale.mode=${tailscaleMode} (use gateway.bind="loopback" or gateway.bind="custom" with gateway.customBindHost="127.0.0.1")`
	}];
}
function validateGatewayTailscaleAuth(config) {
	const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
	if (!isUnsafeGatewayTailscaleNoAuth({
		authMode: config.gateway?.auth?.mode,
		tailscaleMode
	})) return [];
	return [{
		path: "gateway.auth.mode",
		message: formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode)
	}];
}
function collectModelPolicyAllowIssues(config) {
	const issues = [];
	const defaultModels = config.agents?.defaults?.models;
	const validateRefs = (refs, configPath, agentModels) => {
		if (!refs?.length) return;
		const isValidRef = createModelPolicyRefValidator(defaultModels, agentModels);
		for (const [index, raw] of refs.entries()) {
			if (isValidRef(raw)) continue;
			issues.push({
				path: `${configPath}.${index}`,
				message: `invalid model policy ref: ${sanitizeForLog(JSON.stringify(raw))}. Use a configured alias, an exact "provider/model" ref, or a trailing prefix wildcard such as "provider/*" or "provider/namespace/*".`
			});
		}
	};
	validateRefs(config.agents?.defaults?.modelPolicy?.allow, "agents.defaults.modelPolicy.allow");
	for (const { entry: agent, source } of listAgentEntriesWithSource(config)) {
		const pathPrefix = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		validateRefs(agent.modelPolicy?.allow, `${pathPrefix}.modelPolicy.allow`, agent.models);
	}
	return issues;
}
function collectSandboxContainerEnvIssues(config, sourceRaw) {
	const agents = listAgentEntriesWithSource(config);
	if (!config.agents?.defaults?.sandbox?.docker?.env && !agents.some(({ entry }) => entry.sandbox?.docker?.env)) return [];
	const issues = [];
	const seen = /* @__PURE__ */ new Set();
	const authoredAgents = isRecord(sourceRaw) ? listAgentEntriesWithSource(sourceRaw) : agents;
	const authoredById = new Map(authoredAgents.map((agent) => [agent.entry.id, agent]));
	const defaultSandbox = config.agents?.defaults?.sandbox;
	const effectiveAgents = agents.length > 0 ? agents : [void 0];
	for (const agent of effectiveAgents) {
		const agentSandbox = agent?.entry.sandbox;
		const scope = resolveSandboxScope({ scope: agentSandbox?.scope ?? defaultSandbox?.scope });
		const backend = agentSandbox?.backend?.trim() || defaultSandbox?.backend?.trim() || "docker";
		if (backend !== "docker" && backend !== "podman") continue;
		const env = resolveSandboxDockerEnv({
			scope,
			globalEnv: defaultSandbox?.docker?.env,
			agentEnv: agentSandbox?.docker?.env
		});
		const authoredAgent = agent ? authoredById.get(agent.entry.id) ?? agent : void 0;
		for (const [key, value] of Object.entries(env)) {
			const reason = getContainerEnvFileEntryIssue(key, value);
			if (!reason) continue;
			const pathSegments = scope !== "shared" && authoredAgent !== void 0 && Object.hasOwn(authoredAgent.entry.sandbox?.docker?.env ?? {}, key) && authoredAgent ? authoredAgent.source.kind === "entries" ? [
				"agents",
				"entries",
				authoredAgent.source.key,
				"sandbox",
				"docker",
				"env",
				key
			] : [
				"agents",
				"list",
				authoredAgent.source.index,
				"sandbox",
				"docker",
				"env",
				key
			] : [
				"agents",
				"defaults",
				"sandbox",
				"docker",
				"env",
				key
			];
			const issuePath = pathSegments.join(".");
			const issueIdentity = JSON.stringify([issuePath, reason]);
			if (seen.has(issueIdentity)) continue;
			seen.add(issueIdentity);
			const backendName = backend === "podman" ? "Podman" : "Docker";
			const remediation = reason === "invalid-name" ? `Rename key ${JSON.stringify(key)} to use letters, digits, and underscores without a leading digit.` : `Use a single-line, non-NUL value for key ${JSON.stringify(key)}, or deliver multiline material through a mounted file or custom image.`;
			issues.push(withConfigIssuePath({
				path: issuePath,
				message: `${backendName} sandbox backend requires portable environment names and single-line, non-NUL values because the secure env-file transport is line-delimited. ${remediation} SSH/OpenShell backends may keep multiline values. Run openclaw doctor to report the invalid path; manual remediation is required.`
			}, pathSegments));
		}
	}
	return issues;
}
/**
* Validates config without applying runtime defaults.
* Use this when you need the raw validated config (e.g., for writing back to file).
*/
function validateConfigObjectRaw(raw, opts) {
	const legacyDefaultAgentId = isRecord(raw) ? tryGetLegacyDefaultAgentId(raw) : void 0;
	let normalizedRaw = stripPreservedLegacyRootKeysForValidation(raw, opts?.preservedLegacyRootKeys);
	let syntheticLegacyOwnership = false;
	if (legacyDefaultAgentId && isRecord(normalizedRaw) && isRecord(normalizedRaw.agents)) {
		const entries = normalizedRaw.agents.entries;
		if (isRecord(entries) && Object.keys(entries).length > 1 && normalizedRaw.agents.ownership === void 0) {
			normalizedRaw = {
				...normalizedRaw,
				agents: {
					...normalizedRaw.agents,
					ownership: "explicit"
				}
			};
			syntheticLegacyOwnership = true;
		}
	}
	const normalizedMcpServerNameIssueKeys = new Set(collectMcpServerNameIssues(normalizedRaw).map((issue) => JSON.stringify([issue.path, issue.message])));
	const mcpServerNameIssues = collectMcpServerNameIssues(opts?.sourceRaw).filter((issue) => !normalizedMcpServerNameIssueKeys.has(JSON.stringify([issue.path, issue.message])));
	const policyIssues = collectUnsupportedSecretRefPolicyIssues(normalizedRaw);
	const validated = OpenClawSchema.safeParse(normalizedRaw);
	if (!validated.success || mcpServerNameIssues.length > 0) return {
		ok: false,
		issues: mergeUnsupportedMutableSecretRefIssues(policyIssues, validated.success ? mcpServerNameIssues : [...mcpServerNameIssues, ...validated.error.issues.map(mapZodIssueToConfigIssue)])
	};
	let parsedConfig = validated.data;
	if (syntheticLegacyOwnership && parsedConfig.agents) {
		const agents = { ...parsedConfig.agents };
		delete agents.ownership;
		parsedConfig = {
			...parsedConfig,
			agents
		};
	}
	const validatedConfig = inheritLegacyDefaultAgentId(raw, attachAgentListProjection(materializeBundledModelProviderOverlays(parsedConfig)));
	const channelIssues = policyIssues.length > 0 || opts?.validateBundledChannels ? collectRawBundledChannelConfigIssues(validatedConfig) : [];
	if (channelIssues.length > 0) return {
		ok: false,
		issues: mergeUnsupportedMutableSecretRefIssues(policyIssues, channelIssues)
	};
	if (policyIssues.length > 0) return {
		ok: false,
		issues: policyIssues
	};
	const sandboxContainerEnvIssues = collectSandboxContainerEnvIssues(validatedConfig, opts?.sourceRaw);
	if (sandboxContainerEnvIssues.length > 0) return {
		ok: false,
		issues: sandboxContainerEnvIssues
	};
	const duplicates = findDuplicateAgentDirs(validatedConfig, opts);
	if (duplicates.length > 0) return {
		ok: false,
		issues: [{
			path: "agents.entries",
			message: formatDuplicateAgentDirError(duplicates)
		}]
	};
	const avatarIssues = validateIdentityAvatar(validatedConfig, opts?.env);
	if (avatarIssues.length > 0) return {
		ok: false,
		issues: avatarIssues
	};
	const gatewayTailscaleBindIssues = validateGatewayTailscaleBind(validatedConfig);
	if (gatewayTailscaleBindIssues.length > 0) return {
		ok: false,
		issues: gatewayTailscaleBindIssues
	};
	const gatewayTailscaleAuthIssues = validateGatewayTailscaleAuth(validatedConfig);
	if (gatewayTailscaleAuthIssues.length > 0) return {
		ok: false,
		issues: gatewayTailscaleAuthIssues
	};
	const modelPolicyAllowIssues = collectModelPolicyAllowIssues(validatedConfig);
	if (modelPolicyAllowIssues.length > 0) return {
		ok: false,
		issues: modelPolicyAllowIssues
	};
	return {
		ok: true,
		config: validatedConfig
	};
}
function validateConfigObject(raw, opts) {
	const result = validateConfigObjectRaw(migratePersistedImplicitMainRoster(raw).config, opts);
	if (!result.ok) return result;
	return {
		ok: true,
		config: attachAgentListProjection(materializeRuntimeConfig(result.config, { manifestRegistry: opts?.manifestRegistry }))
	};
}
//#endregion
export { resolveAgentMaxConcurrent as C, attachAgentListProjection as D, isUnsafeGatewayTailscaleNoAuth as E, DuplicateAgentDirError as O, isSubagentSpawnDepthAllowed as S, formatUnsafeGatewayTailscaleNoAuthMessage as T, applyProviderConfigDefaultsForConfig as _, withConfigIssuePath as a, materializeConfiguredProviderModelRows as b, formatRawChannelConfigIssueMessage as c, asResolvedSourceConfig as d, asRuntimeConfig as f, resolveNormalizedProviderModelMaxTokens as g, hasAnthropicDefaultSignal as h, collectUnsupportedSecretRefPolicyIssues as i, findDuplicateAgentDirs as k, hasChannelDmPolicyDependencyWarningCandidates as l, DEFAULT_MODEL_ALIASES as m, validateConfigObject as n, bundledChannelIds as o, materializeRuntimeConfig as p, validateConfigObjectRaw as r, collectChannelDmPolicyDependencyWarnings as s, collectHeartbeatOwnerWarnings as t, normalizeBundledChannelId as u, normalizeProviderConfigForConfigDefaults as v, resolveSubagentMaxConcurrent as w, mergeNormalizedProviderModel as x, getProviderModelId as y };

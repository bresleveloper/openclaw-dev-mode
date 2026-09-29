import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, a as resolveAgentDir, l as resolveAgentWorkspaceDir, o as resolveAgentEntry } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import "./defaults-BbU4k6fu.mjs";
import { C as resolveSubagentSpawnModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-D7hqOXrq.mjs";
import { n as resolveConfiguredModelHarnessRuntime } from "./harness-runtimes-DBwiH9TR.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { n as completeInlineProviderModel, t as buildInlineProviderModels } from "./model.inline-provider-BrhnLKm5.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-BSWa_fLA.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
//#region src/agents/prepared-model-runtime.configured.ts
/** Collects scoped config refs and optional exact selections for a read-only request. */
function collectPreparedModelRuntimeConfiguredRefs(config, agentId, runtimePluginSelections = []) {
	const entry = agentId ? resolveAgentEntry(config, agentId) : void 0;
	const refs = collectConfiguredModelRefs(agentId ? {
		...config,
		agents: {
			...config.agents?.defaults ? { defaults: config.agents.defaults } : {},
			list: entry ? [entry] : []
		}
	} : config);
	for (const [index, selection] of runtimePluginSelections.entries()) refs.push({
		path: `runtimePluginSelections.${index}`,
		value: `${selection.provider}/${selection.modelId}`,
		kind: "literal"
	});
	return refs;
}
function collectPreparedModelRuntimeProviderIds(config, credentials, includeCredentialProviders, configuredModelRefs = collectConfiguredModelRefs(config), agentId) {
	const providerIds = /* @__PURE__ */ new Set();
	const addProviderId = (value) => {
		const providerId = normalizeProviderId(value);
		if (providerId) providerIds.add(providerId);
	};
	if (includeCredentialProviders) for (const providerId of Object.keys(credentials)) addProviderId(providerId);
	for (const ref of configuredModelRefs) {
		const separator = ref.value.indexOf("/");
		if (separator > 0) addProviderId(ref.value.slice(0, separator));
		addProviderId(resolveConfiguredModelHarnessRuntime({
			config,
			modelRef: ref.value,
			modelRefKind: ref.kind,
			agentId,
			includeImplicitRuntimePreferences: false
		}) ?? "");
	}
	return [...providerIds].toSorted((left, right) => left.localeCompare(right));
}
function hasConfiguredInlineProviderModel(config, provider, modelId, matchesStaticModelId) {
	return Object.entries(config.models?.providers ?? {}).some(([providerId, providerConfig]) => normalizeProviderId(providerId) === provider && (providerConfig.models ?? []).some((model) => matchesStaticModelId({
		candidateId: model.id,
		rowProvider: providerId,
		provider,
		modelId
	})));
}
function collectConfiguredProviderIdsNeedingStaticCatalog(params) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const { value } of params.configuredModelRefs ?? collectConfiguredModelRefs(params.config)) {
		const parsed = parseModelCatalogRef(value);
		if (!parsed) continue;
		const { provider, modelId } = parsed;
		if (hasConfiguredInlineProviderModel(params.config, provider, modelId, params.matchesStaticModelId) || params.resolveStaticCatalogModel({
			provider,
			modelId
		})) continue;
		providerIds.add(provider);
	}
	return [...providerIds].toSorted((left, right) => left.localeCompare(right));
}
function prepareConfiguredRuntimeModels(params) {
	const prepared = [];
	const seen = /* @__PURE__ */ new Set();
	for (const { modelId, provider } of params.configuredModelRefs) {
		const key = buildModelCatalogMergeKey(provider, modelId);
		if (seen.has(key)) continue;
		seen.add(key);
		let model = params.resolveStaticCatalogModel({
			provider,
			modelId
		}) ?? findPreparedProviderStaticCatalogModel({
			prepared: params.preparedStaticProviderCatalog,
			metadataSnapshot: params.metadataSnapshot,
			provider,
			modelId,
			matchesStaticModelId: params.matchesStaticModelId
		}) ?? params.providerStaticModels.find((candidate) => params.matchesStaticModelId({
			candidateId: candidate.id,
			rowProvider: candidate.provider,
			provider,
			modelId
		}));
		if (!model) {
			const inlineModel = params.inlineProviderModels.find((candidate) => params.matchesStaticModelId({
				candidateId: candidate.id,
				rowProvider: candidate.provider,
				provider,
				modelId
			}));
			const providerConfig = inlineModel && findNormalizedProviderValue(params.config.models?.providers, inlineModel.provider);
			if (inlineModel?.api && providerConfig) model = completeInlineProviderModel(inlineModel, providerConfig);
		}
		if (model) prepared.push({
			provider,
			modelId,
			model
		});
	}
	return prepared;
}
/** Resolve concrete runtime capabilities once while materializing agent facts. */
function prepareRuntimeCapabilityModels(params) {
	const prepared = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of params.candidates) {
		const provider = normalizeProviderId(candidate.provider);
		const modelId = candidate.id.trim();
		if (!provider || !modelId) continue;
		const runtime = resolveEffectiveAgentRuntime({
			cfg: params.config,
			provider,
			modelId,
			modelApi: candidate.api,
			modelBaseUrl: candidate.baseUrl,
			agentId: params.agentId
		});
		if (runtime === provider || runtime === "openclaw") continue;
		const key = buildModelCatalogMergeKey(provider, modelId);
		if (seen.has(key)) continue;
		const model = params.resolveRuntimeModel({
			provider: runtime,
			modelId
		});
		if (!model) continue;
		seen.add(key);
		prepared.push({
			provider,
			modelId,
			model
		});
	}
	return prepared;
}
function findPreparedProviderStaticCatalogModel(params) {
	if (!params.prepared) return;
	for (const { providerConfigs } of params.prepared.entries) for (const [providerId, providerConfig] of Object.entries(providerConfigs)) {
		const model = (providerConfig.models ?? []).find((candidate) => params.matchesStaticModelId({
			candidateId: candidate.id,
			rowProvider: providerId,
			provider: params.provider,
			modelId: params.modelId
		}));
		if (!model) continue;
		const [resolved] = buildInlineProviderModels({ [providerId]: {
			...providerConfig,
			models: [model]
		} }, { providerMetadataOwners: params.metadataSnapshot.owners });
		if (resolved) return resolved;
	}
}
function listConfiguredOwnerInputs(config, defaultWorkspaceDir, allowGatewaySubagentBinding, preservedWorkspaceByAgentDir) {
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const inheritedAuthDir = resolveLegacyInheritedAuthDir(config);
	return listAgentIds(config).filter((agentId) => !readAgentDatabaseAdmissionRefusal(agentId)).map((agentId) => {
		const agentDir = resolveAgentDir(config, agentId);
		const launchWorkspaceDir = preservedWorkspaceByAgentDir?.get(agentId)?.get(agentDir) ?? (agentId === compatibilityAgentId ? defaultWorkspaceDir : void 0);
		const preserveWorkspaceDirOnRefresh = launchWorkspaceDir && !resolveAgentEntry(config, agentId)?.workspace?.trim();
		const input = {
			agentId,
			agentDir,
			config,
			inheritedAuthDir,
			workspaceDir: preserveWorkspaceDirOnRefresh ? launchWorkspaceDir : resolveAgentWorkspaceDir(config, agentId),
			runtimePluginSelections: resolveConfiguredRuntimePluginSelections(config, agentId)
		};
		if (allowGatewaySubagentBinding === true) input.allowGatewaySubagentBinding = true;
		if (preserveWorkspaceDirOnRefresh) input.preserveWorkspaceDirOnRefresh = true;
		return input;
	});
}
function resolveConfiguredRuntimePluginSelections(config, agentId) {
	const configured = resolveDefaultModelForAgent({
		cfg: config,
		agentId
	});
	const subagentModel = resolveSubagentConfiguredModelSelection({
		cfg: config,
		agentId,
		includeAgentPrimary: false
	});
	return resolveModelCandidateChain({
		cfg: config,
		agentId,
		manifestPlugins: [],
		provider: configured.provider || "openai",
		model: configured.model || "gpt-6-astra",
		requestedRouteResolution: "resolved",
		fallbacksOverride: [
			...resolveConfiguredModelFallbacks({
				cfg: config,
				agentId
			}),
			...subagentModel ? [subagentModel] : [],
			...resolveSubagentSpawnModelFallbacksOverride(config, agentId) ?? []
		]
	}).map((candidate) => ({
		provider: candidate.provider,
		modelId: candidate.model,
		agentId
	}));
}
//#endregion
export { prepareConfiguredRuntimeModels as a, listConfiguredOwnerInputs as i, collectPreparedModelRuntimeConfiguredRefs as n, prepareRuntimeCapabilityModels as o, collectPreparedModelRuntimeProviderIds as r, collectConfiguredProviderIdsNeedingStaticCatalog as t };

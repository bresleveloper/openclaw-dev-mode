import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, S as toAgentEntriesRecord, a as resolveAgentDir, f as resolveAgentWorkspaceDir, o as resolveAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { l as getOrLoadAgentDeletionJournalStatus } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import "./defaults-Bg930vxE.mjs";
import { x as resolveSubagentSpawnModelFallbacksOverride } from "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { n as resolveConfiguredModelHarnessRuntime } from "./harness-runtimes-C-QBCzx4.mjs";
import { n as completeInlineProviderModel, t as buildInlineProviderModels } from "./model.inline-provider-DwjZUIZW.mjs";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-DziklVcV.mjs";
//#region src/agents/prepared-model-runtime.configured.ts
/** Collects scoped config refs and optional exact selections for a read-only request. */
function collectPreparedModelRuntimeConfiguredRefs(config, agentId, runtimePluginSelections = []) {
	const entry = agentId ? resolveAgentEntry(config, agentId) : void 0;
	const refs = collectConfiguredModelRefs(agentId ? {
		...config,
		agents: {
			...config.agents?.defaults ? { defaults: config.agents.defaults } : {},
			entries: toAgentEntriesRecord(entry ? [entry] : [])
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
function collectConfiguredProviderIdsNeedingStaticCatalog(params) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const { value } of params.configuredModelRefs ?? collectConfiguredModelRefs(params.config)) {
		const parsed = parseModelCatalogRef(value);
		if (!parsed) continue;
		const { provider, modelId } = parsed;
		if (Object.entries(params.config.models?.providers ?? {}).some(([providerId, providerConfig]) => normalizeProviderId(providerId) === provider && (providerConfig.models ?? []).some((model) => params.matchesStaticModelId({
			candidateId: model.id,
			rowProvider: providerId,
			provider,
			modelId
		}))) || params.resolveStaticCatalogModel({
			provider,
			modelId
		})) continue;
		providerIds.add(provider);
	}
	return [...providerIds].toSorted((left, right) => left.localeCompare(right));
}
function prepareConfiguredRuntimeModels(params) {
	const prepared = [];
	for (const { modelId, provider } of dedupeByKey(params.configuredModelRefs, (ref) => buildModelCatalogMergeKey(ref.provider, ref.modelId))) {
		const matches = (candidate) => params.matchesStaticModelId({
			candidateId: candidate.id,
			rowProvider: candidate.provider,
			provider,
			modelId
		});
		let model = params.resolveStaticCatalogModel({
			provider,
			modelId
		}) ?? findPreparedProviderStaticCatalogModel({
			prepared: params.preparedStaticProviderCatalog,
			metadataSnapshot: params.metadataSnapshot,
			provider,
			modelId,
			matchesStaticModelId: params.matchesStaticModelId
		}) ?? params.providerStaticModels.find(matches);
		if (!model) {
			const inlineModel = params.inlineProviderModels.find(matches);
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
	const statePath = resolveOpenClawStateSqlitePath();
	return listAgentIds(config).filter((agentId) => {
		const deletion = getOrLoadAgentDeletionJournalStatus(statePath, agentId, () => void 0);
		return deletion !== "pending" && deletion !== "complete" && !readAgentDatabaseAdmissionRefusal(agentId);
	}).map((agentId) => {
		const agentDir = resolveAgentDir(config, agentId);
		const launchWorkspaceDir = preservedWorkspaceByAgentDir?.get(agentId)?.get(agentDir) ?? (agentId === compatibilityAgentId ? defaultWorkspaceDir : void 0);
		const preserveWorkspaceDirOnRefresh = launchWorkspaceDir && !resolveAgentEntry(config, agentId)?.workspace?.trim();
		const workspaceDir = preserveWorkspaceDirOnRefresh ? launchWorkspaceDir : resolveAgentWorkspaceDir(config, agentId);
		const configured = resolveDefaultModelForAgent({
			cfg: config,
			agentId
		});
		const subagentModel = resolveSubagentConfiguredModelSelection({
			cfg: config,
			agentId,
			includeAgentPrimary: false
		});
		const input = {
			agentId,
			agentDir,
			config,
			inheritedAuthDir,
			workspaceDir,
			runtimePluginSelections: resolveModelCandidateChain({
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
			}))
		};
		if (allowGatewaySubagentBinding === true) input.allowGatewaySubagentBinding = true;
		if (preserveWorkspaceDirOnRefresh) input.preserveWorkspaceDirOnRefresh = true;
		return input;
	});
}
//#endregion
export { prepareConfiguredRuntimeModels as a, listConfiguredOwnerInputs as i, collectPreparedModelRuntimeConfiguredRefs as n, prepareRuntimeCapabilityModels as o, collectPreparedModelRuntimeProviderIds as r, collectConfiguredProviderIdsNeedingStaticCatalog as t };

import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-CgZk9Ht4.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-BNwmHYLR.mjs";
import { o as discardPreparedPluginGeneration } from "./prepared-model-runtime.plugin-generation-CUjNdQbs.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { s as materializePreparedModelCatalog, u as prepareFullCatalogFacts } from "./prepared-model-runtime.full-catalog-4oGnFFN5.mjs";
import { a as prepareWorkspaceBuildGroup, t as captureModelsJsonContents } from "./prepared-model-runtime.facts-X8iUOGNf.mjs";
import { n as planOpenClawModelsJsonSource, t as ensureOpenClawModelsJson } from "./models-config-D8o8sz_D.mjs";
//#region src/agents/prepared-model-runtime.scoped-catalog.ts
const MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS = 5e3;
async function prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, catalogMode) {
	try {
		var _usingCtx$1 = _usingCtx();
		const scopedInput = input.readOnly ? input : {
			...input,
			readOnly: true
		};
		const { agentFacts, pluginGeneration } = await prepareWorkspaceBuildGroup([scopedInput], catalogMode, { providerDiscoveryProviderIds });
		_usingCtx$1.a({ [Symbol.asyncDispose]: () => discardPreparedPluginGeneration(pluginGeneration) });
		const agentFactsForInput = agentFacts[0];
		if (!agentFactsForInput) throw new Error("scoped prepared model catalog facts are missing");
		const catalogSource = await prepareAgentCatalogSource(agentFactsForInput, pluginGeneration, catalogMode, false, catalogMode === "live" ? { providerDiscoveryProviderIds } : {});
		const { modelCatalog, configuredRuntimeModels } = await prepareFullCatalogFacts(agentFactsForInput, pluginGeneration, catalogMode, catalogSource);
		return materializePreparedModelCatalog(modelCatalog, agentFactsForInput.runtimeCapabilityModels, scopedInput.config.models?.mode === "replace" ? [] : configuredRuntimeModels.map(({ model }) => modelCatalogRowToEntry(model)));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Builds a request-scoped read-only catalog without executing live provider discovery. */
function prepareScopedReadOnlyModelCatalog(input, providerDiscoveryProviderIds) {
	return prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, "static");
}
/** Builds a request-scoped read-only catalog with live discovery for selected providers. */
function prepareScopedReadOnlyLiveModelCatalog(input, providerDiscoveryProviderIds) {
	return prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, "live");
}
async function prepareAgentCatalogSource(agentFacts, pluginGeneration, catalogMode, persist = true, sourceOptions = {}) {
	const { env, input, providerIds } = agentFacts;
	const normalizeProvider = createPreparedModelCatalogProviderNormalizer(pluginGeneration.pluginMetadataSnapshot, input.config, env);
	const providerOutcomes = /* @__PURE__ */ new Map();
	const recordProviderOutcome = (outcome) => {
		const provider = normalizeProvider(outcome.provider);
		if (provider) providerOutcomes.set(`${provider}\0${outcome.profileId ?? ""}`, {
			...outcome,
			provider
		});
	};
	const resultOutcomes = () => [...providerOutcomes.values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || (left.profileId ?? "").localeCompare(right.profileId ?? ""));
	const options = {
		pluginMetadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		providerDiscoveryProviderIds: sourceOptions.providerDiscoveryProviderIds ?? providerIds,
		...pluginGeneration.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: pluginGeneration.preparedStaticProviderCatalog } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {},
		...catalogMode === "static" ? { providerDiscoveryEntriesOnly: true } : { providerDiscoveryTimeoutMs: sourceOptions.providerDiscoveryTimeoutMs ?? MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS }
	};
	const prepareSource = async () => {
		if (!persist) {
			const source = await planOpenClawModelsJsonSource(input.config, input.agentDir, {
				...options,
				...sourceOptions.authStore ? { authStore: sourceOptions.authStore } : {},
				...catalogMode === "live" ? { onProviderCatalogOutcome: recordProviderOutcome } : {}
			});
			return {
				modelsJsonContents: source.modelsJsonContents,
				pluginCatalogs: source.pluginCatalogs,
				providerOutcomes: resultOutcomes()
			};
		}
		if (!input.readOnly) await ensureOpenClawModelsJson(input.config, input.agentDir, {
			...options,
			...catalogMode === "live" ? { onProviderCatalogOutcome: recordProviderOutcome } : {}
		});
		return {
			modelsJsonContents: captureModelsJsonContents(input.agentDir),
			pluginCatalogs: loadPersistedPluginModelCatalogsReadOnly(input.agentDir),
			providerOutcomes: resultOutcomes()
		};
	};
	const { pluginMetadataSnapshot: metadataSnapshot, pluginRegistry } = pluginGeneration;
	return pluginRegistry ? withPluginRuntimeGenerationScope({
		metadataSnapshot,
		pluginRegistry
	}, prepareSource) : prepareSource();
}
//#endregion
export { prepareScopedReadOnlyLiveModelCatalog as n, prepareScopedReadOnlyModelCatalog as r, prepareAgentCatalogSource as t };

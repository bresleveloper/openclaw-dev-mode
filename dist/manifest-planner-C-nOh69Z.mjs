import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { n as normalizeModelCatalogProviderRows } from "./model-catalog-normalize-Dxe_x7wi.mjs";
//#region src/model-catalog/manifest-planner.ts
function mergeRemoteModelWithTrustedTransport(remoteModel, trustedModel) {
	return {
		...remoteModel,
		...trustedModel?.baseUrl ? { baseUrl: trustedModel.baseUrl } : {},
		...trustedModel?.headers ? { headers: trustedModel.headers } : {}
	};
}
function planManifestModelCatalogRows(params) {
	const providerFilters = Boolean(params.providerFilter) || params.providerFilters !== void 0 ? new Set(normalizeUniqueStringEntries([...params.providerFilter !== void 0 ? [params.providerFilter] : [], ...params.providerFilters ?? []].map(normalizeProviderId))) : void 0;
	const entries = [];
	for (const plugin of params.registry.plugins) {
		const providers = plugin.modelCatalog?.providers;
		if (!providers) continue;
		const aliasesByTargetProvider = buildModelCatalogProviderAliasTargets(plugin);
		for (const [provider, providerCatalog] of Object.entries(providers)) {
			const normalizedProvider = normalizeProviderId(provider);
			if (!normalizedProvider) continue;
			const providerAliases = aliasesByTargetProvider.get(normalizedProvider) ?? [];
			const plannedProviders = providerFilters ? normalizeUniqueStringEntries([normalizedProvider, ...providerAliases]).filter((candidateProvider) => providerFilters.has(candidateProvider)) : [normalizedProvider];
			if (plannedProviders.length === 0) continue;
			const remoteProvider = params.resolveRemoteProvider ? params.resolveRemoteProvider(normalizedProvider) : params.remoteOverlay?.[normalizedProvider];
			for (const plannedProvider of plannedProviders) {
				if (params.includeProvider?.(plannedProvider, plugin) === false) continue;
				const mergeKeyFilter = params.mergeKeyFilter;
				const selectModels = (models) => mergeKeyFilter ? models.filter((model) => mergeKeyFilter.has(buildModelCatalogMergeKey(plannedProvider, model.id))) : models;
				const manifestModels = selectModels(providerCatalog.models);
				const remoteModels = remoteProvider ? selectModels(remoteProvider.models) : [];
				const remoteModelIds = remoteModels.length ? new Set(remoteModels.map((model) => model.id)) : void 0;
				const providerDefaults = remoteProvider ? {
					...providerCatalog,
					...remoteProvider,
					...providerCatalog.baseUrl ? { baseUrl: providerCatalog.baseUrl } : {},
					...providerCatalog.headers ? { headers: providerCatalog.headers } : {}
				} : providerCatalog;
				let rows = normalizeModelCatalogProviderRows({
					provider: plannedProvider,
					providerCatalog: {
						...providerDefaults,
						models: remoteModelIds ? manifestModels.filter((model) => !remoteModelIds.has(model.id)) : manifestModels
					},
					source: "manifest"
				});
				if (remoteModels.length > 0) {
					const manifestModelsById = new Map(manifestModels.map((model) => [model.id, model]));
					rows = rows.concat(normalizeModelCatalogProviderRows({
						provider: plannedProvider,
						providerCatalog: {
							...providerDefaults,
							models: remoteModels.map((model) => mergeRemoteModelWithTrustedTransport(model, manifestModelsById.get(model.id)))
						},
						source: "runtime-refresh"
					}));
					rows.sort((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id));
				}
				if (rows.length === 0) continue;
				const alias = plugin.modelCatalog?.aliases?.[plannedProvider];
				entries.push({
					pluginId: plugin.id,
					provider: plannedProvider,
					discovery: plugin.modelCatalog?.discovery?.[normalizedProvider],
					rows: alias ? rows.map((row) => ({
						...row,
						...alias.api ? { api: alias.api } : {},
						...alias.baseUrl ? { baseUrl: alias.baseUrl } : {}
					})) : rows
				});
			}
		}
	}
	const seenRows = /* @__PURE__ */ new Map();
	const conflicts = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const row of entry.rows) {
		const seen = seenRows.get(row.mergeKey);
		if (seen) {
			if (!conflicts.has(row.mergeKey)) conflicts.set(row.mergeKey, {
				mergeKey: row.mergeKey,
				ref: seen.row.ref,
				provider: seen.row.provider,
				modelId: seen.row.id,
				firstPluginId: seen.pluginId,
				secondPluginId: entry.pluginId
			});
			continue;
		}
		seenRows.set(row.mergeKey, {
			pluginId: entry.pluginId,
			row,
			discovery: entry.discovery
		});
	}
	const rows = [];
	for (const { row, discovery } of seenRows.values()) {
		if (conflicts.has(row.mergeKey) || (params.selection === "static" ? discovery !== "static" : params.selection === "supplemental" && discovery === "runtime" && row.source !== "runtime-refresh")) continue;
		rows.push(row);
	}
	rows.sort((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id));
	return {
		entries,
		conflicts: [...conflicts.values()],
		rows
	};
}
function buildOwnedProviderSet(plugin) {
	return new Set(normalizeUniqueStringEntries((plugin.providers ?? []).map(normalizeProviderId)));
}
function buildModelCatalogProviderAliasTargets(plugin) {
	const ownedProviders = buildOwnedProviderSet(plugin);
	const aliasesByTargetProvider = /* @__PURE__ */ new Map();
	for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const aliasProvider = normalizeProviderId(rawAlias);
		const targetProvider = normalizeProviderId(alias.provider);
		if (!aliasProvider || !targetProvider || !ownedProviders.has(targetProvider)) continue;
		const aliases = aliasesByTargetProvider.get(targetProvider) ?? [];
		aliases.push(aliasProvider);
		aliasesByTargetProvider.set(targetProvider, aliases);
	}
	return aliasesByTargetProvider;
}
function buildModelCatalogProviderRefs(plugin) {
	const refs = new Set(buildOwnedProviderSet(plugin));
	for (const aliases of buildModelCatalogProviderAliasTargets(plugin).values()) for (const alias of aliases) refs.add(alias);
	return refs;
}
function planManifestModelCatalogSuppressions(params) {
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : void 0;
	const modelFilter = params.modelFilter ? normalizeLowercaseStringOrEmpty(params.modelFilter) : void 0;
	const suppressions = [];
	for (const plugin of params.registry.plugins) {
		let providerRefs;
		for (const suppression of plugin.modelCatalog?.suppressions ?? []) {
			const provider = normalizeProviderId(suppression.provider);
			const model = normalizeLowercaseStringOrEmpty(suppression.model);
			if (!provider || !model) continue;
			if (providerFilter && provider !== providerFilter) continue;
			if (modelFilter && model !== modelFilter) continue;
			providerRefs ??= buildModelCatalogProviderRefs(plugin);
			if (!providerRefs.has(provider)) continue;
			suppressions.push({
				pluginId: plugin.id,
				provider,
				model,
				mergeKey: buildModelCatalogMergeKey(provider, model),
				...suppression.reason ? { reason: suppression.reason } : {},
				...suppression.retirement ? { retirement: suppression.retirement } : {},
				...suppression.when ? { when: suppression.when } : {}
			});
		}
	}
	suppressions.sort((left, right) => left.provider.localeCompare(right.provider) || left.model.localeCompare(right.model) || left.pluginId.localeCompare(right.pluginId));
	return { suppressions };
}
//#endregion
export { planManifestModelCatalogRows as n, planManifestModelCatalogSuppressions as r, buildModelCatalogProviderAliasTargets as t };

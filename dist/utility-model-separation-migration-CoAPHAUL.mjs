import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { D as listAgentEntriesWithSource, k as readAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as getConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
//#region src/agents/configured-provider-fallback.ts
/**
* Chooses a configured provider/model fallback when defaults are absent from
* the user's model config.
*/
/** Resolve the first configured provider/model that can replace a missing default. */
function resolveConfiguredProviderFallback(params) {
	const configuredProviders = params.cfg.models?.providers;
	if (!configuredProviders || typeof configuredProviders !== "object") return null;
	const defaultProviderConfig = findNormalizedProviderValue(configuredProviders, params.defaultProvider);
	const defaultModel = params.defaultModel?.trim();
	const defaultProviderHasConfiguredModel = Array.isArray(defaultProviderConfig?.models) && defaultProviderConfig.models.some((model) => Boolean(model?.id));
	const defaultProviderHasDefaultModel = defaultModel !== void 0 && Array.isArray(defaultProviderConfig?.models) && defaultProviderConfig.models.some((model) => model?.id === defaultModel);
	if (defaultProviderHasConfiguredModel && (!defaultModel || defaultProviderHasDefaultModel)) return null;
	for (const [provider, providerCfg] of Object.entries(configuredProviders)) {
		const models = providerCfg?.models;
		if (!Array.isArray(models) || !models[0]?.id) continue;
		const normalizedProvider = normalizeProviderId(provider);
		const model = models.find((entry) => entry?.id && (normalizedProvider !== params.excludedModel?.provider || entry.id !== params.excludedModel.model));
		if (model) return {
			provider: normalizedProvider,
			model: model.id
		};
	}
	return null;
}
//#endregion
//#region src/config/utility-model-separation-migration.ts
function hasUtilityModelSeparationMigrationMarker(raw) {
	return isRecord(raw) && isRecord(raw.meta) && isRecord(raw.meta.migrations) && raw.meta.migrations.utilityModelSeparation === true;
}
/** The shipped implicit primary never excluded a separately configured utility model. */
function resolveLegacyImplicitPrimaryModelRef(cfg) {
	const fallback = resolveConfiguredProviderFallback({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	return fallback ? `${fallback.provider}/${fallback.model}` : `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
}
function validModelParent(model) {
	return model === void 0 || typeof model === "string" || isRecord(model) && (model.primary === void 0 || typeof model.primary === "string");
}
function canMaterialize(cfg) {
	if (!isRecord(cfg)) return false;
	const meta = cfg.meta;
	if (meta !== void 0 && !isRecord(meta)) return false;
	const migrations = meta?.migrations;
	if (migrations !== void 0 && !isRecord(migrations)) return false;
	if (migrations?.utilityModelSeparation !== void 0 && migrations.utilityModelSeparation !== true) return false;
	const agents = cfg.agents;
	if (agents !== void 0 && !isRecord(agents)) return false;
	const defaults = agents?.defaults;
	if (defaults !== void 0 && !isRecord(defaults) || !validModelParent(defaults?.model)) return false;
	const roster = readAgentRosterProperty(cfg);
	if (!roster) return true;
	if (roster.kind === "entries") return isRecord(roster.value) && Object.values(roster.value).every((entry) => isRecord(entry) && validModelParent(entry.model));
	return Array.isArray(roster.value) && roster.value.every((entry) => isRecord(entry) && typeof entry.id === "string" && validModelParent(entry.model));
}
function withPrimary(model, primary) {
	return {
		...isRecord(model) ? model : {},
		primary
	};
}
function hasCatalogRoute(config, primary) {
	return Object.entries(config.models?.providers ?? {}).some(([provider, value]) => Array.isArray(value?.models) && value.models.some((model) => typeof model?.id === "string" && `${normalizeProviderId(provider)}/${model.id}` === primary));
}
function canPinLegacyPrimary(previous, primary) {
	if (getConfigResolutionFacts(previous) !== null || primary.includes("${") || splitTrailingAuthProfile(primary).model !== primary) return false;
	return Object.values(previous.models?.providers ?? {}).every((provider) => !Array.isArray(provider?.models) || provider.models.every((model) => typeof model?.id !== "string" || !model.id.includes("${")));
}
function deferSeparation(cfg) {
	if (!hasUtilityModelSeparationMigrationMarker(cfg)) return {
		config: cfg,
		changes: []
	};
	const migrations = { ...cfg.meta?.migrations };
	delete migrations.utilityModelSeparation;
	return {
		config: {
			...cfg,
			meta: {
				...cfg.meta,
				migrations
			}
		},
		changes: []
	};
}
/** Preserve the previous config's implicit primary before separating utility selection. */
function materializeUtilityModelSeparation(cfg, previousConfig = cfg) {
	if (!canMaterialize(cfg)) return {
		config: cfg,
		changes: []
	};
	let config = cfg;
	const changes = [];
	if (isRecord(previousConfig) && !hasUtilityModelSeparationMigrationMarker(previousConfig)) {
		const previous = previousConfig;
		if (!canMaterialize(previous)) return {
			config: cfg,
			changes: []
		};
		const previousDefaults = previous.agents?.defaults;
		const hadConfiguredModel = Object.values(previous.models?.providers ?? {}).some((provider) => Array.isArray(provider?.models) && Boolean(provider.models[0]?.id));
		const previousDefaultPrimary = resolveAgentModelPrimaryValue(previousDefaults?.model);
		const nextDefaultPrimary = resolveAgentModelPrimaryValue(config.agents?.defaults?.model);
		const previousPrimary = resolveLegacyImplicitPrimaryModelRef(previous);
		const removedPreviousRoute = hasCatalogRoute(previous, previousPrimary) && !hasCatalogRoute(config, previousPrimary);
		const legacyPrimary = removedPreviousRoute ? resolveLegacyImplicitPrimaryModelRef(config) : previousPrimary;
		const previousAgents = new Map(listAgentEntriesWithSource(previous).map(({ entry }) => [normalizeAgentId(entry.id), entry]));
		if (!previousDefaultPrimary && !nextDefaultPrimary && (hadConfiguredModel || normalizeOptionalString(previousDefaults?.utilityModel) || listAgentEntriesWithSource(config).some(({ entry }) => {
			const prior = previousAgents.get(normalizeAgentId(entry.id));
			return prior && !resolveAgentModelPrimaryValue(prior.model) && !resolveAgentModelPrimaryValue(entry.model) && normalizeOptionalString(prior.utilityModel ?? previousDefaults?.utilityModel);
		})) && (!canPinLegacyPrimary(previous, legacyPrimary) || removedPreviousRoute && !canPinLegacyPrimary(config, legacyPrimary))) return deferSeparation(cfg);
		if (!previousDefaultPrimary && !nextDefaultPrimary && (hadConfiguredModel || normalizeOptionalString(previousDefaults?.utilityModel))) {
			config = {
				...config,
				agents: {
					...config.agents,
					defaults: {
						...config.agents?.defaults,
						model: withPrimary(config.agents?.defaults?.model, legacyPrimary)
					}
				}
			};
			changes.push(`Preserved the implicit primary model in agents.defaults.model.primary (${legacyPrimary}).`);
		}
		if (!previousDefaultPrimary && !resolveAgentModelPrimaryValue(config.agents?.defaults?.model)) for (const { entry, source } of listAgentEntriesWithSource(config)) {
			const prior = previousAgents.get(normalizeAgentId(entry.id));
			if (!prior || resolveAgentModelPrimaryValue(prior.model) || resolveAgentModelPrimaryValue(entry.model) || !normalizeOptionalString(prior.utilityModel ?? previousDefaults?.utilityModel)) continue;
			const model = withPrimary(entry.model, legacyPrimary);
			if (source.kind === "entries") config = {
				...config,
				agents: {
					...config.agents,
					entries: {
						...config.agents?.entries,
						[source.key]: {
							...config.agents?.entries?.[source.key],
							model
						}
					}
				}
			};
			else config = {
				...config,
				agents: {
					...config.agents,
					list: config.agents?.list?.map((agent, index) => index === source.index ? {
						...agent,
						model
					} : agent)
				}
			};
			const path = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list[${source.index}]`;
			changes.push(`Preserved the implicit primary model in ${path}.model.primary (${legacyPrimary}).`);
		}
	}
	if (!hasUtilityModelSeparationMigrationMarker(config)) config = {
		...config,
		meta: {
			...config.meta,
			migrations: {
				...config.meta?.migrations,
				utilityModelSeparation: true
			}
		}
	};
	return {
		config,
		changes
	};
}
/** Utility provider preparation must not change an implicit route whose conversion is deferred. */
function resolveUtilityModelSeparationError(config) {
	if (hasUtilityModelSeparationMigrationMarker(config)) return;
	const migrated = materializeUtilityModelSeparation(config);
	if (migrated.changes.length === 0 && hasUtilityModelSeparationMigrationMarker(migrated.config)) return;
	return "Utility-model setup cannot safely preserve the current implicit primary. Run openclaw doctor --fix to preserve it, or choose an explicit primary model in Model Setup, then retry.";
}
//#endregion
export { resolveConfiguredProviderFallback as a, resolveUtilityModelSeparationError as i, materializeUtilityModelSeparation as n, resolveLegacyImplicitPrimaryModelRef as r, hasUtilityModelSeparationMigrationMarker as t };

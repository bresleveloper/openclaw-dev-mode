import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries, o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { r as hasIncompletePluginDiscovery } from "./discovery-availability-CEoTdFoo.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-FIsucmo1.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BJ9XbGmI.mjs";
import { r as collectConfiguredProviderSelectionIds } from "./configured-provider-selection-ids-CcoBNl5w.mjs";
import { r as repairRetiredConfigModelRefs, t as createRetiredModelRefRepairResolver } from "./retired-model-ref-repair-7Iad1CLB.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/stale-agent-model-ref-repair.ts
const DEFAULT_MODEL_REF = `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
function providerFromModelRef(ref) {
	const trimmed = ref.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return;
	return normalizeProviderId(trimmed.slice(0, slash)) || void 0;
}
function collectPluginProviderIds(cfg, options) {
	let providerIds;
	if (options.pluginProviderIds) providerIds = new Set([...options.pluginProviderIds].map(normalizeProviderId).filter(Boolean));
	else {
		const defaultAgentId = tryResolveDefaultAgentId(cfg);
		const workspaceDir = defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : void 0;
		const snapshot = options.pluginMetadataSnapshot ?? resolvePluginMetadataSnapshot({
			config: cfg,
			workspaceDir: workspaceDir ?? void 0,
			env: options.env ?? process.env,
			allowWorkspaceScopedCurrent: true
		});
		if (hasIncompletePluginDiscovery(snapshot.diagnostics)) return { warnings: ["Skipped stale agent model reference repair because plugin discovery is incomplete; uninspected configuration is preserved."] };
		providerIds = new Set([
			snapshot.owners.providers,
			snapshot.owners.modelCatalogProviders,
			snapshot.owners.setupProviders,
			snapshot.owners.cliBackends
		].flatMap((owners) => [...owners.keys()].map(normalizeProviderId).filter(Boolean)));
	}
	const selectedProviderIds = collectConfiguredProviderSelectionIds(cfg);
	for (const entry of resolveProviderInstallCatalogEntries({
		config: cfg,
		env: options.env ?? process.env,
		includeUntrustedWorkspacePlugins: false
	})) {
		const entryProviderIds = [entry.providerId, ...entry.providerAliases ?? []];
		if (!entryProviderIds.some((providerId) => selectedProviderIds.has(providerId.toLowerCase()))) continue;
		for (const providerId of entryProviderIds.map(normalizeProviderId).filter(Boolean)) providerIds.add(providerId);
	}
	return {
		providerIds,
		warnings: []
	};
}
function collectPersistedProviderIds(params) {
	if (params.injected) {
		const injected = params.injected.get(params.agentId) ?? [];
		return { providerIds: new Set([...injected].map(normalizeProviderId).filter(Boolean)) };
	}
	const modelsPath = path.join(resolveAgentDir(params.cfg, params.agentId, params.env), "models.json");
	let raw;
	try {
		raw = fs.readFileSync(modelsPath, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return { providerIds: /* @__PURE__ */ new Set() };
		return { warning: `Skipped stale model reference repair for agent "${params.agentId}" because ${modelsPath} could not be read.` };
	}
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed.providers)) return { providerIds: /* @__PURE__ */ new Set() };
		return { providerIds: new Set(Object.keys(parsed.providers).map(normalizeProviderId).filter(Boolean)) };
	} catch {
		return { warning: `Skipped stale model reference repair for agent "${params.agentId}" because ${modelsPath} is invalid JSON.` };
	}
}
function repairModelMap(params) {
	if (!isRecord(params.models)) return;
	const refs = Object.keys(params.models);
	const staleRefs = refs.filter((ref) => params.isStale(ref));
	if (staleRefs.length === refs.length && staleRefs.length > 0 && !params.replacementRef) {
		params.warnings.push(`Skipped clearing ${params.path} because no available replacement model could keep the allowlist restrictive.`);
		return;
	}
	for (const ref of staleRefs) {
		const provider = params.isStale(ref);
		delete params.models[ref];
		params.changes.push(`Removed stale ${params.path} entry "${ref}" (provider "${provider}" is unavailable).`);
	}
	if (refs.length > 0 && (staleRefs.length > 0 || params.ensureReplacement === true) && params.replacementRef && !Object.hasOwn(params.models, params.replacementRef)) {
		params.models[params.replacementRef] = {};
		params.changes.push(`Added ${params.path} entry "${params.replacementRef}" to keep the repaired allowlist restrictive.`);
	}
}
function firstExplicitModelRef(cfg) {
	if (!isRecord(cfg.models?.providers)) return;
	for (const [providerId, provider] of Object.entries(cfg.models.providers)) {
		if (!isRecord(provider) || !Array.isArray(provider.models)) continue;
		const normalizedProvider = normalizeProviderId(providerId);
		const modelId = provider.models.map((model) => isRecord(model) && typeof model.id === "string" ? model.id.trim() : "").find(Boolean);
		if (normalizedProvider && modelId) return `${normalizedProvider}/${modelId}`;
	}
}
function modelPrimaryRef(model) {
	const primary = typeof model === "string" ? model : asOptionalRecord(model)?.primary;
	return typeof primary === "string" ? primary : void 0;
}
function repairStaleAgentModelRefs(cfg, options = {}) {
	if (!isRecord(cfg)) throw new TypeError("Stale agent model repair requires a config object");
	const configuredModels = asOptionalRecord(cfg.models);
	const replaceMode = configuredModels?.mode === "replace";
	const pluginProviders = replaceMode ? {
		providerIds: /* @__PURE__ */ new Set(),
		warnings: []
	} : collectPluginProviderIds(cfg, options);
	if (!pluginProviders.providerIds) return {
		config: cfg,
		changes: [],
		warnings: pluginProviders.warnings
	};
	const baseAvailableProviders = pluginProviders.providerIds;
	if (!replaceMode) baseAvailableProviders.add(normalizeProviderId(DEFAULT_PROVIDER));
	for (const providerId of Object.keys(asOptionalRecord(configuredModels?.providers) ?? {}).map(normalizeProviderId).filter(Boolean)) baseAvailableProviders.add(providerId);
	const config = structuredClone(cfg);
	const changes = [];
	const warnings = [...pluginProviders.warnings];
	const env = options.env ?? process.env;
	const availabilityForAgents = (agentIds, aggregation) => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		if (agentIds.length === 0) {
			const defaultAgentId = tryResolveDefaultAgentId(cfg);
			if (defaultAgentId) agentIds.push(defaultAgentId);
		}
		let combined;
		for (const agentId of agentIds) {
			const { providerIds, warning } = collectPersistedProviderIds({
				cfg,
				agentId,
				env,
				injected: options.persistedProviderIdsByAgentId
			});
			if (!providerIds) {
				if (warning) warnings.push(warning);
				return;
			}
			combined = combined && aggregation === "intersection" ? new Set([...combined].filter((providerId) => providerIds.has(providerId))) : /* @__PURE__ */ new Set([...combined ?? [], ...providerIds]);
		}
		for (const providerId of combined ?? []) available.add(providerId);
		return available;
	};
	const availabilityForAgent = (agentId) => availabilityForAgents([agentId], "union");
	const availabilityForDefaults = (aggregation, select) => {
		if (replaceMode) return new Set(baseAvailableProviders);
		return availabilityForAgents(listAgentEntries(cfg).map(select).filter((agentId) => agentId !== void 0), aggregation);
	};
	const makeStaleChecker = (available) => (ref) => {
		const provider = providerFromModelRef(ref);
		return provider && !available.has(provider) ? provider : void 0;
	};
	const defaults = asOptionalRecord(asOptionalRecord(config.agents)?.defaults);
	const defaultAvailability = availabilityForDefaults("intersection", (agent) => {
		if (typeof agent.id !== "string") return;
		const explicitPrimary = modelPrimaryRef(agent.model);
		if (!explicitPrimary) return agent.id;
		const agentAvailability = availabilityForAgent(agent.id);
		const provider = providerFromModelRef(explicitPrimary);
		return agentAvailability && provider && !agentAvailability.has(provider) ? agent.id : void 0;
	});
	let repairedDefaultPrimary = modelPrimaryRef(defaults?.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
	const repairModel = (owner, modelPath, isStale, agentId) => {
		const isDefault = agentId === void 0;
		const model = owner.model;
		const selector = asOptionalRecord(model);
		const primary = modelPrimaryRef(model);
		const provider = primary === void 0 ? void 0 : isStale(primary);
		let replacement;
		let changed = false;
		if (provider && primary !== void 0) {
			const primaryPath = `${modelPath}${selector ? " primary" : ""}`;
			const container = selector ?? owner;
			const key = selector ? "primary" : "model";
			const availableDefault = repairedDefaultPrimary && !isStale(repairedDefaultPrimary) ? repairedDefaultPrimary : void 0;
			if (!isDefault && defaultAvailability && availableDefault && (!replaceMode || modelPrimaryRef(defaults?.model))) {
				delete container[key];
				replacement = selector ? repairedDefaultPrimary : void 0;
				changed = true;
				changes.push(`Removed stale ${primaryPath} "${primary}" so agent "${agentId}" inherits the default model (provider "${provider}" is unavailable).`);
			} else {
				const configuredReplacement = isDefault ? replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF : availableDefault;
				const fallbacks = Array.isArray(selector?.fallbacks) ? selector.fallbacks : [];
				replacement = isDefault && !replaceMode ? configuredReplacement : fallbacks.find((fallback) => typeof fallback === "string" && !isStale(fallback)) ?? configuredReplacement;
				if (replacement) {
					container[key] = replacement;
					changed = true;
					changes.push(`Replaced stale ${primaryPath} "${primary}" with ${isDefault ? "default " : ""}"${replacement}" (provider "${provider}" is unavailable).`);
				} else if (isDefault) {
					delete container[key];
					changed = true;
					changes.push(`Removed stale ${primaryPath} "${primary}" because provider "${provider}" is unavailable and no replacement model is configured.`);
				} else warnings.push(`Skipped stale ${primaryPath} repair because no available inherited or replacement model is configured.`);
			}
		}
		if (selector) {
			if (Array.isArray(selector.fallbacks)) {
				const filtered = selector.fallbacks.filter((ref) => {
					if (typeof ref !== "string") return true;
					const fallbackProvider = isStale(ref);
					if (!fallbackProvider) return true;
					changes.push(`Removed stale ${modelPath} fallback "${ref}" (provider "${fallbackProvider}" is unavailable).`);
					return false;
				});
				selector.fallbacks = filtered;
				if (replacement && filtered.includes(replacement)) {
					const remaining = filtered.filter((ref) => ref !== replacement);
					selector.fallbacks = remaining;
					changes.push(`Removed duplicate ${modelPath} fallback "${replacement}" after selecting it as the ${isDefault ? "default primary" : "primary"}.`);
					if (remaining.length === 0) delete selector.fallbacks;
				}
			}
			if (!selector.primary && !selector.fallbacks) delete owner.model;
		}
		return changed;
	};
	let defaultPrimaryChanged = false;
	if (defaults && defaultAvailability) {
		defaultPrimaryChanged = repairModel(defaults, "agents.defaults.model", makeStaleChecker(defaultAvailability));
		repairedDefaultPrimary = modelPrimaryRef(defaults.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
		const modelMapAvailability = availabilityForDefaults("union", (agent) => isRecord(agent) && typeof agent.id === "string" && !isRecord(agent.models) ? agent.id : void 0);
		if (modelMapAvailability) repairModelMap({
			models: asOptionalRecord(defaults.models),
			path: "agents.defaults.models",
			isStale: makeStaleChecker(modelMapAvailability),
			replacementRef: repairedDefaultPrimary,
			ensureReplacement: defaultPrimaryChanged,
			changes,
			warnings
		});
	}
	for (const entry of listMutableCodexRouteAgentEntries(config)) {
		const agent = entry.agent;
		const available = availabilityForAgent(entry.agentId);
		if (!available) continue;
		const isStale = makeStaleChecker(available);
		const agentPrimaryChanged = repairModel(agent, `${entry.path}.model`, isStale, entry.agentId);
		const effectiveAgentPrimary = modelPrimaryRef(agent.model) ?? repairedDefaultPrimary;
		repairModelMap({
			models: isRecord(agent.models) ? agent.models : void 0,
			path: `${entry.path}.models`,
			isStale,
			replacementRef: effectiveAgentPrimary && !isStale(effectiveAgentPrimary) ? effectiveAgentPrimary : void 0,
			ensureReplacement: agentPrimaryChanged || !modelPrimaryRef(agent.model) && defaultPrimaryChanged,
			changes,
			warnings
		});
	}
	const retired = repairRetiredConfigModelRefs(config, createRetiredModelRefRepairResolver({
		cfg: config,
		env,
		metadataSnapshot: options.pluginMetadataSnapshot,
		warnings
	}), warnings);
	changes.push(...retired.changes);
	return {
		config: changes.length > 0 ? retired.config : cfg,
		changes,
		warnings,
		...retired.changes.length > 0 ? { retiredModelRefConfig: {
			agents: config.agents,
			models: config.models
		} } : {}
	};
}
//#endregion
export { repairStaleAgentModelRefs as t };

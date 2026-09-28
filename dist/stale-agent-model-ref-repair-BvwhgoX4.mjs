import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { A as tryResolveDefaultAgentId, E as listAgentEntries, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { u as hasIncompletePluginDiscovery } from "./discovery-D_5mAUI7.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { r as collectConfiguredProviderSelectionIds } from "./configured-provider-selection-ids-2ML-_-_L.mjs";
import { r as repairRetiredConfigModelRefs, t as createRetiredModelRefRepairResolver } from "./retired-model-ref-repair-YjdurxhR.mjs";
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
		providerIds = /* @__PURE__ */ new Set();
		for (const owners of [
			snapshot.owners.providers,
			snapshot.owners.modelCatalogProviders,
			snapshot.owners.setupProviders,
			snapshot.owners.cliBackends
		]) for (const providerId of owners.keys()) {
			const normalized = normalizeProviderId(providerId);
			if (normalized) providerIds.add(normalized);
		}
	}
	const selectedProviderIds = collectConfiguredProviderSelectionIds(cfg);
	for (const entry of resolveProviderInstallCatalogEntries({
		config: cfg,
		env: options.env ?? process.env,
		includeUntrustedWorkspacePlugins: false
	})) {
		const entryProviderIds = [entry.providerId, ...entry.providerAliases ?? []];
		if (!entryProviderIds.some((providerId) => selectedProviderIds.has(providerId.toLowerCase()))) continue;
		for (const providerId of entryProviderIds) {
			const normalized = normalizeProviderId(providerId);
			if (normalized) providerIds.add(normalized);
		}
	}
	return {
		providerIds,
		warnings: []
	};
}
function collectPersistedProviderIds(params) {
	const injected = params.injected?.get(params.agentId);
	if (injected) return { providerIds: new Set([...injected].map(normalizeProviderId).filter(Boolean)) };
	if (params.injected) return { providerIds: /* @__PURE__ */ new Set() };
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
		if (!parsed.providers || typeof parsed.providers !== "object" || Array.isArray(parsed.providers)) return { providerIds: /* @__PURE__ */ new Set() };
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
function filterFallbacks(params) {
	if (!Array.isArray(params.model.fallbacks)) return;
	params.model.fallbacks = params.model.fallbacks.filter((ref) => {
		if (typeof ref !== "string") return true;
		const provider = params.isStale(ref);
		if (!provider) return true;
		params.changes.push(`Removed stale ${params.path} fallback "${ref}" (provider "${provider}" is unavailable).`);
		return false;
	});
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
	if (typeof model === "string") return model;
	return isRecord(model) && typeof model.primary === "string" ? model.primary : void 0;
}
function repairStaleAgentModelRefs(cfg, options = {}) {
	const replaceMode = cfg.models?.mode === "replace";
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
	for (const providerId of Object.keys(cfg.models?.providers ?? {})) {
		const normalized = normalizeProviderId(providerId);
		if (normalized) baseAvailableProviders.add(normalized);
	}
	const config = structuredClone(cfg);
	const changes = [];
	const warnings = [...pluginProviders.warnings];
	const env = options.env ?? process.env;
	const persistedForAgent = (agentId) => {
		const persisted = collectPersistedProviderIds({
			cfg,
			agentId,
			env,
			injected: options.persistedProviderIdsByAgentId
		});
		if (!persisted.providerIds) {
			if (persisted.warning) warnings.push(persisted.warning);
			return;
		}
		return persisted.providerIds;
	};
	const availabilityForAgent = (agentId) => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const persisted = persistedForAgent(agentId);
		if (!persisted) return;
		for (const providerId of persisted) available.add(providerId);
		return available;
	};
	const availabilityForDefaults = () => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const inheritingAgentIds = [];
		for (const agent of listAgentEntries(cfg)) {
			if (typeof agent.id !== "string") continue;
			const explicitPrimary = modelPrimaryRef(agent.model);
			if (!explicitPrimary) {
				inheritingAgentIds.push(agent.id);
				continue;
			}
			const agentAvailability = availabilityForAgent(agent.id);
			const provider = providerFromModelRef(explicitPrimary);
			if (agentAvailability && provider && !agentAvailability.has(provider)) inheritingAgentIds.push(agent.id);
		}
		if (inheritingAgentIds.length === 0) {
			const defaultAgentId = tryResolveDefaultAgentId(cfg);
			if (defaultAgentId) inheritingAgentIds.push(defaultAgentId);
		}
		let commonPersisted;
		for (const agentId of inheritingAgentIds) {
			const persisted = persistedForAgent(agentId);
			if (!persisted) return;
			commonPersisted = commonPersisted ? new Set([...commonPersisted].filter((providerId) => persisted.has(providerId))) : new Set(persisted);
		}
		for (const providerId of commonPersisted ?? []) available.add(providerId);
		return available;
	};
	const availabilityForDefaultModelMap = () => {
		const available = new Set(baseAvailableProviders);
		if (replaceMode) return available;
		const inheritingAgentIds = listAgentEntries(cfg).filter((agent) => isRecord(agent) && typeof agent.id === "string" && !isRecord(agent.models)).map((agent) => agent.id);
		if (inheritingAgentIds.length === 0) {
			const defaultAgentId = tryResolveDefaultAgentId(cfg);
			if (defaultAgentId) inheritingAgentIds.push(defaultAgentId);
		}
		for (const agentId of inheritingAgentIds) {
			const persisted = persistedForAgent(agentId);
			if (!persisted) return;
			for (const providerId of persisted) available.add(providerId);
		}
		return available;
	};
	const makeStaleChecker = (available) => (ref) => {
		const provider = providerFromModelRef(ref);
		return provider && !available.has(provider) ? provider : void 0;
	};
	const defaults = config.agents?.defaults;
	const defaultAvailability = availabilityForDefaults();
	let repairedDefaultPrimary = modelPrimaryRef(defaults?.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
	let defaultPrimaryChanged = false;
	if (defaults && defaultAvailability) {
		const isStale = makeStaleChecker(defaultAvailability);
		const configuredReplacement = replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF;
		if (defaults.model) {
			if (typeof defaults.model === "string") {
				const provider = isStale(defaults.model);
				if (provider) {
					const staleRef = defaults.model;
					if (configuredReplacement) {
						defaults.model = configuredReplacement;
						defaultPrimaryChanged = true;
						changes.push(`Replaced stale agents.defaults.model "${staleRef}" with default "${configuredReplacement}" (provider "${provider}" is unavailable).`);
					} else {
						delete defaults.model;
						defaultPrimaryChanged = true;
						changes.push(`Removed stale agents.defaults.model "${staleRef}" because provider "${provider}" is unavailable and no replacement model is configured.`);
					}
				}
			} else if (isRecord(defaults.model)) {
				const provider = typeof defaults.model.primary === "string" ? isStale(defaults.model.primary) : void 0;
				let replacement;
				if (provider && typeof defaults.model.primary === "string") {
					const staleRef = defaults.model.primary;
					replacement = replaceMode ? (Array.isArray(defaults.model.fallbacks) ? defaults.model.fallbacks.find((fallback) => typeof fallback === "string" && !isStale(fallback)) : void 0) ?? configuredReplacement : configuredReplacement;
					if (replacement) {
						defaults.model.primary = replacement;
						defaultPrimaryChanged = true;
						changes.push(`Replaced stale agents.defaults.model primary "${staleRef}" with default "${replacement}" (provider "${provider}" is unavailable).`);
					} else {
						delete defaults.model.primary;
						defaultPrimaryChanged = true;
						changes.push(`Removed stale agents.defaults.model primary "${staleRef}" because provider "${provider}" is unavailable and no replacement model is configured.`);
					}
				}
				filterFallbacks({
					model: defaults.model,
					path: "agents.defaults.model",
					isStale,
					changes
				});
				if (replacement && Array.isArray(defaults.model.fallbacks) && defaults.model.fallbacks.includes(replacement)) {
					defaults.model.fallbacks = defaults.model.fallbacks.filter((fallback) => fallback !== replacement);
					changes.push(`Removed duplicate agents.defaults.model fallback "${replacement}" after selecting it as the default primary.`);
					if (defaults.model.fallbacks.length === 0) delete defaults.model.fallbacks;
				}
				if (!defaults.model.primary && !defaults.model.fallbacks) delete defaults.model;
			}
		}
		repairedDefaultPrimary = modelPrimaryRef(defaults.model) ?? (replaceMode ? firstExplicitModelRef(cfg) : DEFAULT_MODEL_REF);
		const modelMapAvailability = availabilityForDefaultModelMap();
		if (modelMapAvailability) repairModelMap({
			models: defaults.models,
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
		const modelPath = `${entry.path}.model`;
		const canInheritDefault = Boolean(defaultAvailability && repairedDefaultPrimary && (!replaceMode || modelPrimaryRef(defaults?.model)) && !isStale(repairedDefaultPrimary));
		let agentPrimaryChanged = false;
		if (typeof agent.model === "string") {
			const provider = isStale(agent.model);
			if (provider) {
				const staleRef = agent.model;
				if (canInheritDefault) {
					delete agent.model;
					agentPrimaryChanged = true;
					changes.push(`Removed stale ${modelPath} "${staleRef}" so agent "${entry.agentId}" inherits the default model (provider "${provider}" is unavailable).`);
				} else if (repairedDefaultPrimary && !isStale(repairedDefaultPrimary)) {
					agent.model = repairedDefaultPrimary;
					agentPrimaryChanged = true;
					changes.push(`Replaced stale ${modelPath} "${staleRef}" with "${repairedDefaultPrimary}" (provider "${provider}" is unavailable).`);
				} else warnings.push(`Skipped stale ${modelPath} repair because no available inherited or replacement model is configured.`);
			}
		} else if (isRecord(agent.model)) {
			const model = agent.model;
			const provider = typeof model.primary === "string" ? isStale(model.primary) : void 0;
			let agentReplacement;
			if (provider && typeof model.primary === "string") {
				const staleRef = model.primary;
				if (canInheritDefault) {
					delete model.primary;
					agentPrimaryChanged = true;
					agentReplacement = repairedDefaultPrimary;
					changes.push(`Removed stale ${modelPath} primary "${staleRef}" so agent "${entry.agentId}" inherits the default model (provider "${provider}" is unavailable).`);
				} else if (agentReplacement = (Array.isArray(model.fallbacks) ? model.fallbacks.find((fallback) => typeof fallback === "string" && !isStale(fallback)) : void 0) ?? (repairedDefaultPrimary && !isStale(repairedDefaultPrimary) ? repairedDefaultPrimary : void 0)) {
					model.primary = agentReplacement;
					agentPrimaryChanged = true;
					changes.push(`Replaced stale ${modelPath} primary "${staleRef}" with "${agentReplacement}" (provider "${provider}" is unavailable).`);
				} else warnings.push(`Skipped stale ${modelPath} primary repair because no available inherited or replacement model is configured.`);
			}
			filterFallbacks({
				model,
				path: modelPath,
				isStale,
				changes
			});
			if (agentReplacement && Array.isArray(model.fallbacks) && model.fallbacks.includes(agentReplacement)) {
				const filteredFallbacks = model.fallbacks.filter((fallback) => fallback !== agentReplacement);
				model.fallbacks = filteredFallbacks;
				changes.push(`Removed duplicate ${modelPath} fallback "${agentReplacement}" after selecting it as the primary.`);
				if (filteredFallbacks.length === 0) delete model.fallbacks;
			}
			if (!model.primary && !model.fallbacks) delete agent.model;
		}
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

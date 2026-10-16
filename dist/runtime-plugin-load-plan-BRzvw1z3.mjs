import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { b as normalizePluginsConfigWithResolverCore, g as resolveSelectedContextEnginePluginId, p as resolveEffectivePluginActivationState, s as isTestDefaultMemorySlotDisabled } from "./config-state-DY_WJYue.mjs";
import { t as hashJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { t as resolveManifestActivationPlan } from "./activation-planner-C14NFDc3.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { a as resolveProviderConfigApiOwnerHint } from "./provider-config-owner-2NQ6j_Jm.mjs";
import { n as addConfiguredSlotPluginIds } from "./gateway-startup-plugin-config-CleWmmi_.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BJNC949_.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-CnGRVnDe.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-DneslQx1.mjs";
import { f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, r as resolveBundledProviderCompatPluginIds } from "./providers-DQUFJKZx.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CUyk98mO.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-B4sEclNg.mjs";
//#region src/agents/harness/runtime-plugin-load-plan.ts
/** Builds deterministic plugin load plans for selected harness, memory, and context-engine owners. */
function restrictiveAllowlistOmitsPlugin(config, pluginId) {
	const allow = config?.plugins?.allow ?? [];
	return allow.length > 0 && !allow.includes(pluginId);
}
function resolveSelectedMemoryPluginIds(params) {
	if (isTestDefaultMemorySlotDisabled(params.config ?? {})) return [];
	const plugins = normalizePluginsConfigWithResolverCore(params.config?.plugins, params.metadataSnapshot.normalizePluginId);
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || restrictiveAllowlistOmitsPlugin(params.config, memorySlot)) return [];
	const plugin = params.metadataSnapshot.index.plugins.find((entry) => entry.pluginId === memorySlot);
	if (!plugin?.startup.memory) return [];
	return resolveEffectivePluginActivationState({
		id: plugin.pluginId,
		origin: plugin.origin,
		config: plugins,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).activated ? [plugin.pluginId] : [];
}
function resolveAgentRuntimePluginSelections(config, selections, configuredHarnessRuntimes = collectConfiguredAgentHarnessRuntimes(config ?? {})) {
	return [...configuredHarnessRuntimes.map((runtime) => ({
		runtime,
		provider: "",
		modelId: ""
	})), ...selections];
}
function resolveAgentRuntimeMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const pluginsConfig = normalizePluginsConfigWithResolverCore(params.config?.plugins, lookup.normalizePluginId);
	if (!pluginsConfig.enabled) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const plugin of params.index.plugins) if (plugin.startup.agentHarnesses.length) pluginIds.add(plugin.pluginId);
	lookup.addShorthandModelOwners(pluginIds, params.shorthandModelIds ?? []);
	const selections = resolveAgentRuntimePluginSelections(params.config, params.selections);
	const providerIds = normalizeUniqueStringEntries(selections.map((selection) => selection.provider));
	for (const providerId of providerIds) {
		const providerPluginIds = /* @__PURE__ */ new Set();
		lookup.addDirectProviderOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size === 0) lookup.addProviderContributionOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size !== 1) return;
		for (const pluginId of providerPluginIds) pluginIds.add(pluginId);
	}
	const runtimeIds = normalizeUniqueStringEntries(selections.map((selection) => resolveSelectedAgentHarnessRuntime(selection, params.config)).filter((runtime) => !isDefaultAgentRuntimeId(runtime) && runtime !== "openclaw"));
	if (!lookup.hasAgentHarnessOwners(runtimeIds)) return;
	lookup.addAgentHarnessOwners(pluginIds, runtimeIds);
	addConfiguredSlotPluginIds(pluginIds, {
		activationSourceConfig: params.config ?? {},
		activationSourcePlugins: pluginsConfig,
		lookup
	});
	if (!lookup.hasInstalledPluginIds(pluginIds)) return;
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Narrows cold manifest preparation to candidates needed by one selected runtime generation. */
function createAgentRuntimeMetadataPluginIdScope(params) {
	return {
		key: hashJson({
			kind: "agent-runtime",
			config: params.config ?? null,
			workspaceDir: params.workspaceDir,
			selections: params.selections,
			shorthandModelIds: params.shorthandModelIds ?? []
		}),
		resolve: ({ index }) => resolveAgentRuntimeMetadataPluginIds({
			config: params.config,
			selections: params.selections,
			shorthandModelIds: params.shorthandModelIds,
			index
		})
	};
}
function resolveSelectedProviderOwnerPluginIds(params) {
	let providerOwnerPluginIds = normalizeUniqueStringEntries(resolveOwningPluginIdsForProviderRef(params) ?? []);
	if (providerOwnerPluginIds.length === 0) {
		const apiOwnerHint = resolveProviderConfigApiOwnerHint(params);
		if (apiOwnerHint) providerOwnerPluginIds = normalizeUniqueStringEntries(resolveOwningPluginIdsForProviderRef({
			...params,
			provider: apiOwnerHint
		}) ?? []);
	}
	if (providerOwnerPluginIds.length === 0) return [];
	const safeProviderOwnerPluginIds = normalizeUniqueStringEntries([...resolveBundledProviderCompatPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: providerOwnerPluginIds,
		manifestRegistry: params.metadataSnapshot?.manifestRegistry
	}), ...resolveActivatableProviderOwnerPluginIds({
		pluginIds: providerOwnerPluginIds,
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? {
			registry: params.metadataSnapshot.index,
			manifestRegistry: params.metadataSnapshot.manifestRegistry
		} : {}
	})]);
	return providerOwnerPluginIds.filter((pluginId) => safeProviderOwnerPluginIds.includes(pluginId));
}
/** Resolve manifest owners required by one selected non-core harness runtime. */
function resolveAgentHarnessOwnerPluginIds(params) {
	const harnessPluginIds = resolveManifestActivationPlan({
		trigger: {
			kind: "agentHarness",
			runtime: params.runtime
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		requireExplicitManifestOwnerTrust: true,
		manifestRecords: params.metadataSnapshot?.plugins
	}).entries.map((entry) => entry.pluginId);
	if (harnessPluginIds.length === 0 || params.runtime !== "codex" || !harnessPluginIds.includes("codex") || restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
	const providerOwnerPluginIds = params.providerOwnerPluginIds ?? resolveSelectedProviderOwnerPluginIds(params);
	if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
	return normalizeUniqueStringEntries([...harnessPluginIds, ...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex")]);
}
function withRuntimePluginIdsAllowed(config, pluginIds, materializeAllowlist) {
	const existingAllowlist = config?.plugins?.allow ?? [];
	if (pluginIds.length === 0 || !materializeAllowlist && existingAllowlist.length === 0) return config;
	const allow = normalizeUniqueStringEntries([...existingAllowlist, ...pluginIds]);
	if (allow.length === existingAllowlist.length && allow.every((pluginId, index) => pluginId === existingAllowlist[index])) return config;
	return {
		...config,
		plugins: {
			...config?.plugins,
			allow
		}
	};
}
function resolveSelectedAgentHarnessRuntime(selection, config) {
	const requestedRuntime = normalizeOptionalAgentRuntimeId(selection.runtime);
	return requestedRuntime && !isDefaultAgentRuntimeId(requestedRuntime) ? requestedRuntime : resolveAgentHarnessPolicy({
		provider: selection.provider,
		modelId: selection.modelId,
		config,
		agentId: selection.agentId
	}).runtime;
}
function requiresAgentHarnessPluginSelection(selection, config) {
	const runtime = resolveSelectedAgentHarnessRuntime(selection, config);
	if (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw") return false;
	return runtime === "codex" || !isCliRuntimeAliasForProvider({
		runtime,
		provider: selection.provider,
		cfg: config
	});
}
/** Resolves model provider and harness owners independently of configured shared capabilities. */
function resolveAgentRuntimePluginSelectionOwners(params) {
	const config = params.config;
	const pluginIds = [];
	const forceActivatedPluginIds = [];
	for (const selection of params.selections) {
		const runtime = resolveSelectedAgentHarnessRuntime(selection, config);
		const providerOwnerPluginIds = resolveSelectedProviderOwnerPluginIds({
			provider: selection.provider,
			config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot
		});
		pluginIds.push(...providerOwnerPluginIds);
		forceActivatedPluginIds.push(...providerOwnerPluginIds);
		if (!requiresAgentHarnessPluginSelection(selection, config)) continue;
		const harnessPluginIds = resolveAgentHarnessOwnerPluginIds({
			runtime,
			provider: selection.provider,
			config,
			workspaceDir: params.workspaceDir,
			providerOwnerPluginIds,
			metadataSnapshot: params.metadataSnapshot
		});
		pluginIds.push(...harnessPluginIds);
		const allowedHarnessPluginIds = runtime === "codex" ? restrictiveAllowlistOmitsPlugin(params.config, "codex") ? [] : harnessPluginIds : harnessPluginIds.filter((pluginId) => !restrictiveAllowlistOmitsPlugin(params.config, pluginId));
		forceActivatedPluginIds.push(...allowedHarnessPluginIds);
	}
	return {
		pluginIds,
		forceActivatedPluginIds
	};
}
/** Folds selected harness, memory, and context-engine owners into one deterministic load plan. */
function resolveAgentRuntimePluginLoadPlan(params) {
	let config = params.config;
	const includeAgentOwners = params.purpose !== "model-catalog";
	const memoryPluginIds = includeAgentOwners ? resolveSelectedMemoryPluginIds({
		config: params.config,
		metadataSnapshot: params.metadataSnapshot
	}) : [];
	const contextEnginePluginId = includeAgentOwners ? resolveSelectedContextEnginePluginId(params.config) : void 0;
	const contextEnginePluginIds = contextEnginePluginId ? [contextEnginePluginId] : [];
	const basePluginIds = (params.basePluginIds ?? []).filter((pluginId) => !restrictiveAllowlistOmitsPlugin(params.config, pluginId));
	const pluginIds = [
		...basePluginIds,
		...memoryPluginIds,
		...contextEnginePluginIds
	];
	const forceActivatedPluginIds = [...memoryPluginIds, ...contextEnginePluginIds];
	if (includeAgentOwners) {
		const selection = resolveAgentRuntimePluginSelectionOwners(params);
		pluginIds.push(...selection.pluginIds);
		forceActivatedPluginIds.push(...selection.forceActivatedPluginIds);
	}
	const scopedPluginIds = normalizeUniqueStringEntries(pluginIds).toSorted((left, right) => left.localeCompare(right));
	config = withRuntimePluginIdsAllowed(config, [...basePluginIds, ...forceActivatedPluginIds], params.basePluginIds !== void 0);
	const activatedConfig = withActivatedPluginIds({
		config,
		pluginIds: forceActivatedPluginIds.toSorted()
	}) ?? config;
	if (params.basePluginIds === void 0 && (params.config?.plugins?.allow?.length ?? 0) === 0 && activatedConfig?.plugins) {
		const plugins = { ...activatedConfig.plugins };
		if (params.config?.plugins?.allow === void 0) delete plugins.allow;
		else plugins.allow = params.config.plugins.allow;
		config = {
			...activatedConfig,
			plugins
		};
	} else config = activatedConfig;
	return {
		...config ? { config } : {},
		...includeAgentOwners && params.basePluginIds === void 0 && scopedPluginIds.length === 0 ? {} : { pluginIds: scopedPluginIds }
	};
}
//#endregion
export { resolveAgentRuntimePluginSelectionOwners as a, resolveAgentRuntimePluginLoadPlan as i, requiresAgentHarnessPluginSelection as n, resolveAgentRuntimePluginSelections as o, resolveAgentHarnessOwnerPluginIds as r, resolveSelectedAgentHarnessRuntime as s, createAgentRuntimeMetadataPluginIdScope as t };

import { n as normalizePluginsConfigWithResolverCore } from "./config-normalization-shared-B7M6gfm-.mjs";
import { d as resolveEffectivePluginActivationState, m as resolveSelectedContextEnginePluginId, o as isTestDefaultMemorySlotDisabled } from "./config-state-BEAL5gWH.mjs";
import { P as hashJson } from "./discovery-D_5mAUI7.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { t as resolveManifestActivationPlan } from "./activation-planner-CtJXavAS.mjs";
import { n as addConfiguredSlotPluginIds, u as normalizePluginsConfigForInstalledIndex } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-DBwiH9TR.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-Dl4k2vJA.mjs";
import { f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, r as resolveBundledProviderCompatPluginIds } from "./providers-Bx7WoFEI.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CNegFLwh.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DZSSnYMd.mjs";
//#region src/agents/harness/runtime-plugin-load-plan.ts
function dedupePluginIds(values) {
	const result = [];
	for (const value of values) {
		const pluginId = value.trim();
		if (pluginId && !result.includes(pluginId)) result.push(pluginId);
	}
	return result;
}
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
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config?.plugins, lookup);
	if (!pluginsConfig.enabled) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const plugin of params.index.plugins) if (plugin.startup.agentHarnesses.length) pluginIds.add(plugin.pluginId);
	lookup.addShorthandModelOwners(pluginIds, params.shorthandModelIds ?? []);
	const selections = resolveAgentRuntimePluginSelections(params.config, params.selections);
	const providerIds = dedupePluginIds(selections.map((selection) => selection.provider));
	for (const providerId of providerIds) {
		const providerPluginIds = /* @__PURE__ */ new Set();
		lookup.addDirectProviderOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size === 0) lookup.addProviderContributionOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size !== 1) return;
		for (const pluginId of providerPluginIds) pluginIds.add(pluginId);
	}
	const runtimeIds = dedupePluginIds(selections.map((selection) => resolveSelectedAgentHarnessRuntime(selection, params.config)).filter((runtime) => !isDefaultAgentRuntimeId(runtime) && runtime !== "openclaw"));
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
	const providerOwnerPluginIds = dedupePluginIds(resolveOwningPluginIdsForProviderRef(params) ?? []);
	if (providerOwnerPluginIds.length === 0) return [];
	const safeProviderOwnerPluginIds = dedupePluginIds([...resolveBundledProviderCompatPluginIds({
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
	return dedupePluginIds([...harnessPluginIds, ...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex")]);
}
function withRuntimePluginIdsAllowed(config, pluginIds, materializeAllowlist) {
	const existingAllowlist = config?.plugins?.allow ?? [];
	if (pluginIds.length === 0 || !materializeAllowlist && existingAllowlist.length === 0) return config;
	const allow = dedupePluginIds([...existingAllowlist, ...pluginIds]);
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
	if (params.purpose === "model-catalog") for (const plugin of params.metadataSnapshot.plugins) for (const runtime of plugin.activation?.onAgentHarnesses ?? []) {
		const owners = resolveAgentHarnessOwnerPluginIds({
			runtime,
			provider: "",
			config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot
		});
		pluginIds.push(...owners);
		forceActivatedPluginIds.push(...owners);
	}
	for (const selection of includeAgentOwners ? params.selections : []) {
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
	const scopedPluginIds = dedupePluginIds(pluginIds).toSorted((left, right) => left.localeCompare(right));
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
export { resolveAgentRuntimePluginSelections as a, resolveAgentRuntimePluginLoadPlan as i, requiresAgentHarnessPluginSelection as n, resolveSelectedAgentHarnessRuntime as o, resolveAgentHarnessOwnerPluginIds as r, createAgentRuntimeMetadataPluginIdScope as t };

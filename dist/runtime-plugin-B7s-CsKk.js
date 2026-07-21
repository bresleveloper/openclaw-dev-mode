import { l as resolveEffectivePluginActivationState } from "./config-state-CtMlHVRM.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { _ as loadPluginRegistrySnapshot, r as normalizePluginsConfigWithRegistry } from "./plugin-registry-DPlZjBYT.js";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes-CA3PNIDt.js";
import { t as resolveManifestActivationPlan } from "./activation-planner-DZfDj2jf.js";
import { f as resolveOwningPluginIdsForProviderRef, n as resolveBundledProviderCompatPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers-DDDh9p7C.js";
import { r as withActivatedPluginIds } from "./activation-context-Ders3_KI.js";
import { r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-B1-PRucg.js";
//#region src/agents/harness/runtime-plugin.ts
function dedupePluginIds(values) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of values) {
		const pluginId = value.trim();
		if (!pluginId || seen.has(pluginId)) continue;
		seen.add(pluginId);
		result.push(pluginId);
	}
	return result;
}
function restrictiveAllowlistOmitsPlugin(config, pluginId) {
	const allow = config?.plugins?.allow ?? [];
	return allow.length > 0 && !allow.includes(pluginId);
}
function resolveSelectedMemoryPluginIds(params) {
	const registry = loadPluginRegistrySnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const plugins = normalizePluginsConfigWithRegistry(params.config?.plugins, registry);
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || memorySlot.trim().length === 0 || restrictiveAllowlistOmitsPlugin(params.config, memorySlot)) return [];
	const plugin = registry.plugins.find((entry) => entry.pluginId === memorySlot);
	if (!plugin?.startup.memory) return [];
	return resolveEffectivePluginActivationState({
		id: plugin.pluginId,
		origin: plugin.origin,
		config: plugins,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).activated ? [plugin.pluginId] : [];
}
function resolveHarnessPluginIds(params) {
	const harnessPluginIds = resolveManifestActivationPlan({
		trigger: {
			kind: "agentHarness",
			runtime: params.runtime
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		requireExplicitManifestOwnerTrust: true
	}).entries.map((entry) => entry.pluginId);
	if (harnessPluginIds.length === 0) return [];
	if (params.runtime !== "codex") return harnessPluginIds;
	if (!harnessPluginIds.includes("codex")) return harnessPluginIds;
	if (restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
	const providerOwnerPluginIds = dedupePluginIds(resolveOwningPluginIdsForProviderRef({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir
	}) ?? []);
	if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
	const safeProviderOwnerPluginIds = dedupePluginIds([...resolveBundledProviderCompatPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: providerOwnerPluginIds
	}), ...resolveActivatableProviderOwnerPluginIds({
		pluginIds: providerOwnerPluginIds,
		config: params.config,
		workspaceDir: params.workspaceDir
	})]);
	return dedupePluginIds([
		"codex",
		...harnessPluginIds,
		...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex" && safeProviderOwnerPluginIds.includes(pluginId))
	]);
}
function withRuntimePluginIdsAllowed(params) {
	if (params.pluginIds.length === 0) return params.config;
	if (restrictiveAllowlistOmitsPlugin(params.config, params.requiredPluginId)) return params.config;
	const allow = dedupePluginIds([...params.config?.plugins?.allow ?? [], ...params.pluginIds]);
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			allow
		}
	};
}
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
async function ensureSelectedAgentHarnessPlugin(params) {
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const policy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const runtime = runtimeOverride && !isDefaultAgentRuntimeId(runtimeOverride) ? runtimeOverride : policy.runtime;
	if (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw" || isCliRuntimeAliasForProvider({
		runtime,
		provider: params.provider,
		cfg: params.config
	})) return;
	const { ensurePluginRegistryLoaded } = await import("./runtime-registry-loader-C1rdLeog.js");
	const pluginIds = resolveHarnessPluginIds({
		runtime,
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	if (pluginIds.length === 0) return;
	const memoryPluginIds = resolveSelectedMemoryPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const scopedPluginIds = dedupePluginIds([...pluginIds, ...memoryPluginIds]);
	const configWithAllowedRuntimePlugins = withRuntimePluginIdsAllowed({
		config: params.config,
		requiredPluginId: runtime,
		pluginIds: scopedPluginIds
	});
	const activatedConfig = withActivatedPluginIds({
		config: configWithAllowedRuntimePlugins,
		pluginIds: scopedPluginIds
	}) ?? configWithAllowedRuntimePlugins;
	ensurePluginRegistryLoaded({
		scope: "all",
		...activatedConfig ? {
			config: activatedConfig,
			activationSourceConfig: activatedConfig
		} : {},
		workspaceDir: params.workspaceDir,
		onlyPluginIds: scopedPluginIds
	});
}
//#endregion
export { ensureSelectedAgentHarnessPlugin as t };

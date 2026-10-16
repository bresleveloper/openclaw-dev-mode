import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { f as hasNonEmptyPluginIdScope } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-BruI3Lbo.mjs";
import { n as buildPluginRuntimeLoadOptions } from "./load-context-Bf_u2yr8.mjs";
import { r as loadAndActivateRootPluginRegistry } from "./loader-runtime-load-C3He8u8Z.mjs";
import { _ as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-CleWmmi_.mjs";
import { r as resolveChannelPluginIds } from "./gateway-startup-plugin-loader-CllKNgfi.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-DneslQx1.mjs";
import "./gateway-startup-plugin-ids-DBQoHXw5.mjs";
import "./channel-plugin-ids-BIGwmSOe.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CUyk98mO.mjs";
import "./loader-vjZ2aI5b.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-CXTPIuAJ.mjs";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-C9ZIzbHW.mjs";
//#region src/plugins/runtime/runtime-registry-loader.ts
const CORE_SANDBOX_BACKEND_IDS = /* @__PURE__ */ new Set([
	"docker",
	"podman",
	"ssh"
]);
function resolveMemoryPluginIds(context) {
	const configuredProviderIds = [...collectConfiguredMemoryEmbeddingProviderIds(context.activationSourceConfig)];
	const pluginIds = /* @__PURE__ */ new Set();
	if (context.metadataSnapshot) createInstalledPluginIndexScopeLookup(context.metadataSnapshot.index).addProviderContributionOwners(pluginIds, configuredProviderIds);
	else for (const providerId of configuredProviderIds) pluginIds.add(providerId);
	const memoryPluginId = normalizePluginsConfig(context.config.plugins).slots.memory?.trim();
	if (memoryPluginId) pluginIds.add(memoryPluginId);
	return [...pluginIds].toSorted();
}
function resolveSandboxBackendPluginIds(context, persistedBackendIds = []) {
	if (!context.metadataSnapshot) return [];
	const configuredBackendIds = [
		context.activationSourceConfig.agents?.defaults?.sandbox?.backend,
		...listAgentEntries(context.activationSourceConfig).map((agent) => agent.sandbox?.backend),
		...persistedBackendIds
	];
	const lookup = createInstalledPluginIndexScopeLookup(context.metadataSnapshot.index);
	const pluginIds = /* @__PURE__ */ new Set();
	for (const backendId of configuredBackendIds) {
		const normalizedBackendId = normalizeOptionalLowercaseString(backendId);
		if (!normalizedBackendId || CORE_SANDBOX_BACKEND_IDS.has(normalizedBackendId) || !lookup.hasInstalledPluginIds([normalizedBackendId])) continue;
		pluginIds.add(lookup.normalizePluginId(normalizedBackendId));
	}
	return [...pluginIds].toSorted();
}
function resolveScopePluginIds(params) {
	if (params.scope === "configured-channels") return resolveConfiguredChannelPluginIds({
		config: params.context.config,
		activationSourceConfig: params.context.activationSourceConfig,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
	if (params.scope === "channels") return resolveChannelPluginIds({
		config: params.context.config,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
	if (params.scope === "memory") return resolveMemoryPluginIds(params.context);
	if (params.scope === "sandbox-backends") return resolveSandboxBackendPluginIds(params.context, params.persistedSandboxBackendIds);
	return resolveEffectivePluginIds({
		config: params.context.rawConfig,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
}
async function ensurePluginRegistryLoaded(options) {
	const scope = options?.scope ?? "all";
	const context = resolvePluginRuntimeLoadContext(options);
	const pluginIds = resolveScopePluginIds({
		scope,
		context,
		persistedSandboxBackendIds: options?.persistedSandboxBackendIds
	});
	const activateConfigured = scope === "configured-channels" && pluginIds.length > 0;
	const config = activateConfigured ? withActivatedPluginIds({
		config: context.config,
		pluginIds
	}) ?? context.config : context.config;
	const activationSourceConfig = activateConfigured ? withActivatedPluginIds({
		config: context.activationSourceConfig,
		pluginIds
	}) ?? context.activationSourceConfig : context.activationSourceConfig;
	await loadAndActivateRootPluginRegistry(buildPluginRuntimeLoadOptions({
		...context,
		config,
		activationSourceConfig
	}, {
		throwOnLoadError: true,
		...scope === "configured-channels" || scope === "memory" || scope === "sandbox-backends" || scope === "all" || hasNonEmptyPluginIdScope(pluginIds) ? { onlyPluginIds: pluginIds } : {}
	}));
}
//#endregion
export { ensurePluginRegistryLoaded };

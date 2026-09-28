import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { f as hasNonEmptyPluginIdScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-C83ks5im.mjs";
import { r as loadOpenClawPlugins } from "./loader-runtime-load-DitY2Htf.mjs";
import { y as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import { r as resolveChannelPluginIds } from "./gateway-startup-plugin-loader-DT9jJ8ed.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-Dl4k2vJA.mjs";
import "./gateway-startup-plugin-ids-32EoKWbn.mjs";
import "./channel-plugin-ids-5hZDJEQZ.mjs";
import { t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CNegFLwh.mjs";
import "./loader-CidXT38G.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-XdYxCzko.mjs";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-DjuZqKkD.mjs";
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
	const agents = context.activationSourceConfig.agents;
	const configuredBackendIds = [
		agents?.defaults?.sandbox?.backend,
		...Object.values(agents?.entries ?? {}).map((agent) => agent.sandbox?.backend),
		...(agents?.list ?? []).map((agent) => agent.sandbox?.backend),
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
function ensurePluginRegistryLoaded(options) {
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
	loadOpenClawPlugins(buildPluginRuntimeLoadOptions({
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

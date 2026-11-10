import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { f as hasNonEmptyPluginIdScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { p as resolveConfiguredChannelPluginIdsAsync } from "./channel-presence-policy-hdzky3AO.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as buildPluginRuntimeLoadOptions } from "./load-context-YqkPeFye.mjs";
import { r as loadAndActivateRootPluginRegistry } from "./loader-runtime-load-DzFljQbT.mjs";
import { _ as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import { r as resolveChannelPluginIds } from "./gateway-startup-plugin-loader-DrZZ8kBB.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-BspjHPkd.mjs";
import "./gateway-startup-plugin-ids-NMA5rryx.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { n as withActivatedPluginIds } from "./activation-context-ZGPJ_bJQ.mjs";
import "./loader-B8PRFJEU.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-BVnuTwnE.mjs";
import { n as resolveEffectivePluginIdsAsync } from "./effective-plugin-ids-q571zsUI.mjs";
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
async function ensurePluginRegistryLoaded(options) {
	const scope = options?.scope ?? "all";
	const context = resolvePluginRuntimeLoadContext({
		...options,
		config: options?.config ?? await captureRuntimeConfigAsyncReader()()
	});
	let pluginIds;
	switch (scope) {
		case "configured-channels":
			pluginIds = await resolveConfiguredChannelPluginIdsAsync({
				config: context.config,
				activationSourceConfig: context.activationSourceConfig,
				workspaceDir: context.workspaceDir,
				env: context.env
			});
			break;
		case "channels":
			pluginIds = resolveChannelPluginIds({
				config: context.config,
				workspaceDir: context.workspaceDir,
				env: context.env
			});
			break;
		case "memory":
			pluginIds = resolveMemoryPluginIds(context);
			break;
		case "sandbox-backends":
			pluginIds = resolveSandboxBackendPluginIds(context, options?.persistedSandboxBackendIds);
			break;
		default: pluginIds = await resolveEffectivePluginIdsAsync({
			config: context.rawConfig,
			workspaceDir: context.workspaceDir,
			env: context.env
		});
	}
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

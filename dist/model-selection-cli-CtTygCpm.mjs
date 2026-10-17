import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Zl-RSskC.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { f as getActivePluginRegistryWorkspaceDirFromStateCore } from "./model-ref-shared-KBg0y299.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
//#region src/plugins/setup-registry.runtime.ts
/** Metadata lookup helpers for plugin setup CLI backend descriptors. */
function resolveSetupCliBackendSnapshot(params = {}) {
	if (params.metadataSnapshot) return params.metadataSnapshot;
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromStateCore();
	return resolvePluginMetadataSnapshot({
		...params.config ? { config: params.config } : {},
		env,
		...workspaceDir ? { workspaceDir } : {},
		allowWorkspaceScopedCurrent: true
	});
}
function resolvePluginSetupCliBackendDescriptor(params) {
	const normalized = normalizeProviderId(params.backend);
	const snapshot = resolveSetupCliBackendSnapshot(params);
	const pluginId = snapshot.owners.cliBackends.get(normalized)?.find((id) => isInstalledPluginEnabled(snapshot.index, id, params.config, params.env));
	const plugin = pluginId ? snapshot.byPluginId.get(pluginId) : void 0;
	if (!plugin) return;
	const backendId = [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []].find((id) => normalizeProviderId(id) === normalized);
	return backendId ? {
		pluginId: plugin.id,
		backend: { id: backendId }
	} : void 0;
}
/** Resolve enabled setup CLI backend ids from one metadata snapshot. */
function resolvePluginSetupCliBackendIds(params = {}) {
	const snapshot = resolveSetupCliBackendSnapshot(params);
	return snapshot.plugins.flatMap((plugin) => {
		const ids = plugin.cliBackends.concat(plugin.setup?.cliBackends ?? []);
		return ids.length > 0 && isInstalledPluginEnabled(snapshot.index, plugin.id, params.config, params.env) ? ids : [];
	});
}
//#endregion
//#region src/agents/model-selection-cli.ts
/** Prepare one CLI-provider lookup for request paths that classify multiple models. */
function prepareCliProviderClassifier(cfg) {
	const providers = new Set([...resolveRuntimeCliBackends("metadata").map((backend) => backend.id), ...resolvePluginSetupCliBackendIds({ config: cfg })].map(normalizeProviderId));
	return (provider) => providers.has(normalizeProviderId(provider));
}
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
function isCliProvider(provider, cfg, metadataSnapshot) {
	const normalized = normalizeProviderId(provider);
	if (resolveRuntimeCliBackends("metadata").some((backend) => normalizeProviderId(backend.id) === normalized)) return true;
	return Boolean(resolvePluginSetupCliBackendDescriptor({
		backend: normalized,
		config: cfg,
		metadataSnapshot
	}));
}
//#endregion
export { prepareCliProviderClassifier as n, isCliProvider as t };

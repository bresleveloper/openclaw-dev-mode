import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { a as getReusablePluginRuntimeActivation, i as getPluginRuntimeLoadContext, o as setPluginRuntimeLoadContext, r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-BVnuTwnE.mjs";
//#region src/agents/prepared-model-runtime.plugin-context.ts
const emptyPluginDiscovery = {
	candidates: [],
	diagnostics: []
};
function prepareOwnedPluginMetadataSnapshotParams(input, env) {
	return {
		config: input.config,
		env,
		...input.workspaceDir ? {
			workspaceDir: input.workspaceDir,
			allowWorkspaceScopedCurrent: true
		} : {},
		...input.loadRuntimePlugins && input.runtimePluginSelections && input.workspaceDir ? { pluginIdScope: createAgentRuntimeMetadataPluginIdScope({
			config: input.config,
			workspaceDir: input.workspaceDir,
			selections: input.runtimePluginSelections
		}) } : {}
	};
}
/** Resolves and attaches the plugin facts owned by one prepared workspace generation. */
function prepareOwnedPluginLoadContext(input, env, registry, preparedMetadataSnapshot, preferBuiltPluginArtifacts = false, preparedRegistry) {
	const metadataSnapshot = preparedMetadataSnapshot ?? resolvePluginMetadataSnapshot(prepareOwnedPluginMetadataSnapshotParams(input, env));
	if (!registry) return metadataSnapshot;
	const { config } = input;
	const workspaceDir = metadataSnapshot.workspaceDir ?? input.workspaceDir;
	const preparedActivation = getReusablePluginRuntimeActivation(preparedRegistry ?? registry, {
		config,
		env,
		workspaceDir,
		metadataSnapshot
	});
	if (preparedActivation) {
		const targetContext = getPluginRuntimeLoadContext(registry);
		setPluginRuntimeLoadContext(registry, {
			...preparedActivation,
			rawConfig: config,
			env,
			workspaceDir,
			metadataSnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index),
			logger: targetContext?.logger ?? createPluginRuntimeLoaderLogger(),
			expectedSourceDigests: targetContext?.expectedSourceDigests,
			preferBuiltPluginArtifacts
		});
		return metadataSnapshot;
	}
	const discoverySnapshot = metadataSnapshot.discovery ? metadataSnapshot : {
		...metadataSnapshot,
		discovery: emptyPluginDiscovery
	};
	const context = {
		...resolvePluginRuntimeLoadContext({
			config,
			env,
			workspaceDir,
			metadataSnapshot: discoverySnapshot,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			preferBuiltPluginArtifacts
		}),
		metadataSnapshot
	};
	setPluginRuntimeLoadContext(registry, context);
	return metadataSnapshot;
}
//#endregion
export { prepareOwnedPluginMetadataSnapshotParams as n, prepareOwnedPluginLoadContext as t };

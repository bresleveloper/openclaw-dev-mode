import { h as collectManifestModelIdNormalizationPolicies, r as getCurrentPluginMetadataSnapshot, y as normalizeProviderModelIdWithPolicies } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-workspace-state-DrrmEIfK.js";
//#region src/plugins/manifest-model-id-normalization.ts
/** Applies manifest-declared model-id normalization policies to provider model refs. */
let cachedPolicies;
function resolveMetadataSnapshotForPolicies(params = {}) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	if (params.config === void 0) {
		const currentSnapshot = getCurrentPluginMetadataSnapshot({
			env,
			workspaceDir,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		if (currentSnapshot) return {
			plugins: currentSnapshot.plugins,
			configFingerprint: currentSnapshot.configFingerprint,
			cacheable: true
		};
	}
	const snapshot = resolvePluginMetadataSnapshot({
		config: params.config ?? {},
		env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true
	});
	return {
		plugins: snapshot.plugins,
		configFingerprint: snapshot.configFingerprint,
		cacheable: false
	};
}
function loadManifestModelIdNormalizationPolicies(params = {}) {
	if (params.plugins) return collectManifestModelIdNormalizationPolicies(params.plugins);
	const { plugins, configFingerprint, cacheable } = resolveMetadataSnapshotForPolicies(params);
	if (cacheable && configFingerprint && cachedPolicies?.configFingerprint === configFingerprint) return cachedPolicies.policies;
	const policies = collectManifestModelIdNormalizationPolicies(plugins);
	if (cacheable && configFingerprint) cachedPolicies = {
		configFingerprint,
		policies
	};
	return policies;
}
/** Normalizes a provider model id using plugin manifest-declared model-id policies. */
function normalizeProviderModelIdWithManifest(params) {
	return normalizeProviderModelIdWithPolicies({
		provider: params.provider,
		policies: loadManifestModelIdNormalizationPolicies(params),
		context: { modelId: params.context.modelId }
	});
}
//#endregion
export { normalizeProviderModelIdWithManifest as t };

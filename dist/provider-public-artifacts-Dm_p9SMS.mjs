import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as preparePluginModule } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { t as resolvePluginRuntimeRecord } from "./runtime-context-khSFyWth.mjs";
import { i as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-B_fTpq__.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { n as getCurrentPluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { i as resolveBundledProviderPolicyOwner, n as listTrustedExternalProviderPolicyOwners, t as listProviderPolicyOwners } from "./provider-policy-owners-CS5yTO36.mjs";
import { i as loadValidatedPublicSurfaceModule } from "./public-surface-loader-CNXp9Fm5.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import { n as extractProviderPolicySurface, r as resolveDirectBundledProviderPolicySurface, t as PROVIDER_POLICY_ARTIFACT } from "./provider-policy-surface-BIpBUrmO.mjs";
import path from "node:path";
//#region src/plugins/provider-public-artifacts.ts
function resolveBundledProviderPolicyPlugin(providerId, options = {}) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!normalizedProviderId) return null;
	if (!resolveBundledPluginsDir()) return null;
	const registry = options.manifestRegistry ?? options.loadManifestRegistry?.() ?? loadPluginManifestRegistryCore();
	return resolveBundledProviderPolicyOwner(normalizedProviderId, registry);
}
/** Resolves provider policy hooks for a bundled provider or its owning plugin. */
function resolveBundledProviderPolicySurface(providerId, options = {}) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!normalizedProviderId) return null;
	const directSurface = options.directSurface === void 0 ? resolveDirectBundledProviderPolicySurface(normalizedProviderId) : options.directSurface;
	if (directSurface) return directSurface;
	const ownerPlugin = resolveBundledProviderPolicyPlugin(normalizedProviderId, options);
	if (ownerPlugin) {
		const ownerSurface = resolveDirectBundledProviderPolicySurface(ownerPlugin.id);
		if (ownerSurface) return ownerSurface;
	}
	if (!ownerPlugin) return null;
	return resolveDirectBundledProviderPolicySurface(path.basename(ownerPlugin.rootDir));
}
/** Resolves provider policy hooks from bundled or trusted official plugin artifacts. */
function resolveProviderPolicySurface(providerId, options = {}) {
	if (options.config?.plugins) {
		const registry = options.manifestRegistry ?? getCurrentPluginMetadataSnapshotRuntime({
			config: options.config,
			allowScopedSnapshot: true
		})?.manifestRegistry ?? loadPluginManifestRegistryCore({ config: options.config });
		const normalizedConfig = normalizePluginsConfig(options.config.plugins);
		for (const owner of listProviderPolicyOwners(providerId, registry)) {
			if (!passesManifestOwnerBasePolicy({
				plugin: owner,
				normalizedConfig
			})) continue;
			const surface = owner.origin === "bundled" ? resolveDirectBundledProviderPolicySurface(path.basename(owner.rootDir)) : resolveProviderPolicySurfaceForOwner(owner);
			if (surface) return surface;
		}
		return null;
	}
	const bundledSurface = resolveBundledProviderPolicySurface(providerId, options);
	if (bundledSurface) return bundledSurface;
	if (!normalizeProviderId(providerId) || !options.manifestRegistry) return null;
	return loadProviderPolicyArtifacts(listTrustedExternalProviderPolicyOwners(providerId, options.manifestRegistry))?.surface ?? null;
}
/** Loads the first usable policy surface from caller-selected admitted owners. */
function loadProviderPolicyArtifacts(owners) {
	for (const owner of owners) {
		const surface = resolveProviderPolicySurfaceForOwner(owner);
		if (surface) return {
			owner,
			surface
		};
	}
	const owner = owners[0];
	return owner ? {
		owner,
		surface: null
	} : null;
}
/** Loads policy hooks from the selected bundled or host-verified official owner. */
function resolveProviderPolicySurfaceForOwner(record) {
	if (record.origin !== "bundled" && record.trustedOfficialInstall !== true) return null;
	const modulePath = resolvePluginRootPublicSurfacePath({
		pluginRoot: record.rootDir,
		pluginId: record.id,
		entrySource: record.source,
		artifactBasename: PROVIDER_POLICY_ARTIFACT
	});
	if (!modulePath) return null;
	const location = {
		modulePath,
		boundaryRoot: record.rootDir,
		surfaceLabel: `plugin public surface ${PROVIDER_POLICY_ARTIFACT}`,
		origin: record.origin,
		pluginId: record.id
	};
	if (resolvePluginRuntimeRecord({
		pluginRoot: record.rootDir,
		pluginId: record.id
	})?.status === "loaded") return extractProviderPolicySurface(loadValidatedPublicSurfaceModule(location));
	const source = preparePluginModule({
		...location,
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles(record)
	}).modulePath;
	const loader = getPluginSetupModuleLoader(record, source, record.rootDir);
	return loader.initialize(() => extractProviderPolicySurface(loader(source)));
}
//#endregion
export { resolveProviderPolicySurfaceForOwner as i, resolveBundledProviderPolicySurface as n, resolveProviderPolicySurface as r, loadProviderPolicyArtifacts as t };

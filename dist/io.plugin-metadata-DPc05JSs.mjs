import { D as withPluginCache, a as createPluginCache, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-CzkKDKkL.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync, l as preparePersistedInstalledPluginIndexCacheEntry, u as preparePluginMetadataMachineState } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { o as preparePluginRegistrySnapshotReader } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { r as getCompatibleProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { c as projectPluginMetadataSnapshot, f as resolvePluginMetadataSnapshotCacheKey, m as restorePluginMetadataSnapshot, p as resolvePluginMetadataSnapshotInput, t as buildPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
//#region src/config/io.plugin-metadata.ts
function mergeRegistries(registries) {
	const grouped = /* @__PURE__ */ new Map();
	const diagnostics = registries.flatMap((registry) => registry.diagnostics);
	for (const registry of registries) for (const plugin of registry.plugins) {
		const id = normalizePluginPolicyId(plugin.id);
		const group = grouped.get(id) ?? {
			plugin,
			sources: /* @__PURE__ */ new Set()
		};
		group.plugin = plugin;
		group.sources.add(plugin.source);
		grouped.set(id, group);
	}
	return {
		plugins: [...grouped.entries()].flatMap(([pluginId, group]) => {
			if (group.sources.size === 1) return [group.plugin];
			diagnostics.push({
				level: "error",
				pluginId,
				message: `plugin id ${JSON.stringify(pluginId)} is present in multiple agent workspaces: ${[...group.sources].toSorted().join(", ")}`
			});
			return [];
		}),
		diagnostics
	};
}
/** Read complete installed ownership for maintenance, including older partial index caches. */
function discoverConfigWidePluginManifestRegistry(params) {
	const env = params.env ?? process.env;
	const workspaceDirs = params.workspaceDir !== void 0 ? [params.workspaceDir] : params.config ? listAgentWorkspaceDirs(params.config, env) : [];
	const installRecords = loadInstalledPluginIndexInstallRecordsSync({
		env,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	return mergeRegistries((workspaceDirs.length > 0 ? workspaceDirs : [void 0]).map((workspaceDir) => loadPluginManifestRegistryCore({
		config: params.config,
		env,
		workspaceDir,
		installRecords
	})));
}
function resolveReusableGatewayPluginMetadataSnapshot(params, allowSynchronousPolicyRead = true) {
	if (params.allowCurrent === false || params.stateDir !== void 0 || params.installRecords !== void 0) return;
	return getGatewayPluginMetadataSnapshot() ?? getCompatibleProcessGatewayPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		allowWorkspaceScopedSnapshot: true,
		requireAgentWorkspaceCompatibility: true,
		allowSynchronousPolicyRead
	});
}
/** Prepare database facts asynchronously before the existing metadata derivation. */
async function resolveConfigWidePluginMetadataSnapshotAsync(params) {
	const captured = {
		...params,
		env: cloneEnvWithPlatformSemantics(params.env ?? process.env)
	};
	if (captured.allowCurrent === false && getPluginCache().kind !== "operation") return withPluginCache(createPluginCache(), () => resolveConfigWidePluginMetadataSnapshotAsync(captured));
	const current = resolveReusableGatewayPluginMetadataSnapshot(captured, false);
	if (current) return current;
	const cache = getPluginCache();
	const release = retainPluginCache(cache);
	try {
		return await withPluginCache(cache, async () => {
			const activateDiscovery = await prepareBundledDiscoveryMode(captured.env);
			activateDiscovery();
			const preparedCurrent = resolveReusableGatewayPluginMetadataSnapshot(captured);
			if (preparedCurrent) return preparedCurrent;
			const { key } = resolveConfigWideMetadataSelection(captured);
			const existing = cache.metadata.snapshots.get(key);
			if (existing) {
				activateDiscovery();
				return existing;
			}
			if (captured.installRecords === void 0) (await preparePersistedInstalledPluginIndexCacheEntry({
				env: captured.env,
				stateDir: captured.stateDir
			})).assertCurrent();
			activateDiscovery();
			return resolveConfigWidePluginMetadataSnapshot(captured);
		});
	} finally {
		release();
	}
}
function resolveConfigWideMetadataSelection(params) {
	const env = params.env ?? process.env;
	const dirs = listAgentWorkspaceDirs(params.config, env);
	const workspaceDirs = dirs.length ? dirs : [void 0];
	return {
		workspaceDirs,
		key: JSON.stringify([
			"config-wide",
			resolvePluginMetadataSnapshotCacheKey(params),
			workspaceDirs
		])
	};
}
function resolveConfigWidePluginMetadataSnapshot(params) {
	if (params.allowCurrent === false && getPluginCache().kind !== "operation") return withPluginCache(createPluginCache(), () => resolveConfigWidePluginMetadataSnapshot(params));
	const gatewaySnapshot = resolveReusableGatewayPluginMetadataSnapshot(params);
	if (gatewaySnapshot) return gatewaySnapshot;
	return withSynchronousArtifactPreservingStateSnapshot(() => resolveConfigWidePluginMetadataSnapshotInScope(params));
}
function resolveConfigWidePluginMetadataSnapshotInScope(params) {
	const env = params.env ?? process.env;
	if (params.installRecords === void 0) preparePluginMetadataMachineState({
		env,
		stateDir: params.stateDir
	});
	const { key, workspaceDirs } = resolveConfigWideMetadataSelection(params);
	const cache = getPluginCache();
	const cached = cache.metadata.snapshots.get(key);
	if (cached) return cached;
	const snapshot = resolveConfigWidePluginMetadataSnapshotImpl(params, workspaceDirs);
	cache.metadata.snapshots.set(key, snapshot);
	return snapshot;
}
function resolveConfigWidePluginMetadataSnapshotImpl(params, workspaceDirs) {
	const env = params.env ?? process.env;
	const workspaceParams = (workspaceDir) => ({
		config: params.config,
		...workspaceDir ? { workspaceDir } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		env,
		allowCurrent: params.allowCurrent,
		...params.installRecords ? { installRecords: params.installRecords } : {},
		allowWorkspaceScopedCurrent: true
	});
	if (workspaceDirs.length === 1) return resolvePluginMetadataSnapshot(workspaceParams(workspaceDirs[0]));
	const registryReader = preparePluginRegistrySnapshotReader({
		...params,
		...params.installRecords !== void 0 ? { preferPersisted: false } : {}
	});
	const firstSnapshot = resolvePluginMetadataSnapshotInput(workspaceParams(workspaceDirs[0]), registryReader);
	const snapshots = [firstSnapshot, ...workspaceDirs.slice(1).map((workspaceDir) => resolvePluginMetadataSnapshotInput(workspaceParams(workspaceDir), registryReader))];
	const manifestRegistry = mergeRegistries(snapshots.map((snapshot) => snapshot.manifestRegistry));
	const selectedPlugins = new Map(manifestRegistry.plugins.map((plugin) => [normalizePluginPolicyId(plugin.id), plugin]));
	const indexPlugins = new Map(snapshots.flatMap((snapshot) => snapshot.index.plugins.flatMap((record) => {
		const id = normalizePluginPolicyId(record.pluginId);
		const selected = selectedPlugins.get(id);
		return selected && selected.manifestPath === record.manifestPath ? [[id, record]] : [];
	})));
	const index = {
		...firstSnapshot.index,
		plugins: [...indexPlugins.values()],
		installRecords: Object.fromEntries(snapshots.flatMap((snapshot) => Object.entries(snapshot.index.installRecords))),
		diagnostics: manifestRegistry.diagnostics
	};
	const sources = new Set(manifestRegistry.plugins.map((plugin) => plugin.source));
	const discovery = snapshots.every((snapshot) => snapshot.discovery) ? {
		candidates: [...new Map(snapshots.flatMap((snapshot) => (snapshot.discovery?.candidates ?? []).filter((candidate) => sources.has(candidate.source)).map((candidate) => [`${candidate.effectivePluginId ?? candidate.idHint}\0${candidate.source}`, candidate]))).values()],
		diagnostics: snapshots.flatMap((snapshot) => snapshot.discovery?.diagnostics ?? [])
	} : void 0;
	const sumMetric = (key) => snapshots.reduce((total, snapshot) => total + snapshot.metrics[key], 0);
	return restorePluginMetadataSnapshot(buildPluginMetadataSnapshot({
		...firstSnapshot,
		index,
		discovery,
		manifestRegistry,
		registryDiagnostics: snapshots.flatMap((snapshot) => snapshot.registryDiagnostics),
		metrics: {
			registrySnapshotMs: sumMetric("registrySnapshotMs"),
			manifestRegistryMs: sumMetric("manifestRegistryMs"),
			ownerMapsMs: 0,
			totalMs: sumMetric("totalMs"),
			indexPluginCount: index.plugins.length,
			manifestPluginCount: manifestRegistry.plugins.length
		}
	}, params));
}
function resolveConfigWidePluginManifestRegistry(params) {
	const snapshot = resolveConfigWidePluginMetadataSnapshot(params);
	return projectPluginMetadataSnapshot(snapshot, params.pluginIds).manifestRegistry;
}
//#endregion
export { resolveConfigWidePluginMetadataSnapshotAsync as i, resolveConfigWidePluginManifestRegistry as n, resolveConfigWidePluginMetadataSnapshot as r, discoverConfigWidePluginManifestRegistry as t };

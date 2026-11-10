import { C as retainPluginCache, b as readPluginMetadataSnapshotCache, c as getPluginCache, k as withPluginCache, o as cachePluginMetadataSnapshot, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-BZeanw4b.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { a as preparePluginMetadataMachineState, o as preparePluginMetadataMachineStateAsync } from "./installed-plugin-index-record-state-Cr6YHbHB.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import { r as getCompatibleProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { c as projectPluginMetadataSnapshot, f as resolvePluginMetadataSnapshotCacheKey, m as restorePluginMetadataSnapshot, p as resolvePluginMetadataSnapshotInput, t as buildPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { o as preparePluginRegistrySnapshotReader } from "./plugin-registry-snapshot-CR0J8rf8.mjs";
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
			const activateDiscovery = captured.installRecords === void 0 ? await preparePluginMetadataMachineStateAsync({
				env: captured.env,
				stateDir: captured.stateDir
			}) : await prepareBundledDiscoveryMode(captured.env);
			activateDiscovery();
			const preparedCurrent = resolveReusableGatewayPluginMetadataSnapshot(captured);
			if (preparedCurrent) return preparedCurrent;
			const { key } = resolveConfigWideMetadataSelection(captured);
			const existing = readPluginMetadataSnapshotCache(key);
			if (existing) {
				activateDiscovery();
				return existing;
			}
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
	return withSynchronousArtifactPreservingStateSnapshot(() => {
		if (params.installRecords === void 0) preparePluginMetadataMachineState({
			env: params.env ?? process.env,
			stateDir: params.stateDir
		});
		const { key, workspaceDirs } = resolveConfigWideMetadataSelection(params);
		const cached = readPluginMetadataSnapshotCache(key);
		if (cached) return cached;
		const snapshot = resolveConfigWidePluginMetadataSnapshotImpl(params, workspaceDirs);
		cachePluginMetadataSnapshot(key, snapshot);
		return snapshot;
	});
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

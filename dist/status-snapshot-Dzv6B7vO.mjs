import { D as withPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { u as pluginCacheStatSync } from "./package-manifest-CEbdS_C4.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { l as createBlockedPluginDiagnosticLookup, s as tracePluginLifecyclePhase } from "./discovery-Dma3bVNk.mjs";
import { a as pluginInstallIncompleteDiagnostic, n as buildPluginDependencyStatus, o as projectPluginDependencyHealth, t as buildManagedPluginDependencyStatus } from "./status-dependencies-core-BsXgcrdk.mjs";
import { o as resolveRetainedManagedNpmInstallPackageInfo } from "./managed-npm-retention-BPamOGs_.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BSuk9I48.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-D0pq-oeY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { a as tracksPluginDependencyStatus } from "./official-external-plugin-repair-hints-M7Ed27uG.mjs";
import { a as formatPluginCapabilityConsentRequired, s as resolveAcceptedSurfaceCurrent, u as resolvePluginPackageDeclaredSurface } from "./capability-summary-4nSs_R5Q.mjs";
import path from "node:path";
//#region src/plugins/status-snapshot.ts
/** Builds plugin status reports from persisted metadata without importing full plugin runtimes. */
/** Installation health takes precedence over consent on every inventory surface. */
function projectPluginInstallHealth(registry, params) {
	const cache = getPluginMetadataSnapshotCache(params.metadata);
	return withPluginCache(cache, () => {
		const { index, byPluginId: manifests, pluginIds: scope } = params.metadata;
		const diagnostics = [...registry.diagnostics];
		const findBlockedPluginDiagnostic = createBlockedPluginDiagnosticLookup({
			diagnostics: params.metadata.diagnostics,
			config: params.config,
			env: params.env
		});
		const ownership = createInstalledPluginOwnershipResolver(index, params.env);
		const records = new Map(index.plugins.map((record) => [record.pluginId, record]));
		const installSelectors = new Map(Object.entries(index.installRecords).map(([owner, record]) => [owner, record.spec ?? record.resolvedSpec ?? (record.source === "clawhub" ? `clawhub:${record.clawhubPackage ?? owner}` : record.resolvedName ?? owner)]));
		const installTargets = /* @__PURE__ */ new Map();
		const preparedPlugins = registry.plugins.map((plugin) => {
			const record = records.get(plugin.id);
			const manifest = manifests.get(plugin.id);
			if (!record || !manifest || !tracksPluginDependencyStatus({
				...record,
				origin: plugin.origin ?? record.origin,
				packageName: plugin.packageName ?? record.packageName
			})) return plugin;
			const resolved = ownership.resolveUpdate(plugin.id);
			const installed = resolved.ok && resolved.value.kind === "package" ? resolved.value : void 0;
			const install = installed?.installRecord;
			const installPath = install?.source === "npm" && install.installPath ? resolveUserPath(install.installPath, params.env) : void 0;
			if (installed && (install?.source === "npm" || install?.source === "clawhub")) installTargets.set(plugin.id, installSelectors.get(installed.installOwner) ?? installed.installOwner);
			const rootDir = plugin.rootDir ?? record.rootDir;
			const useMetadataCache = rootDir === record.rootDir && !plugin.dependencyStatus;
			let dependencyStatus = useMetadataCache ? cache.dependencyStatus.get(manifest) : void 0;
			if (!dependencyStatus) {
				const dependencies = {
					rootDir,
					dependencies: manifest.packageDependencies,
					optionalDependencies: manifest.packageOptionalDependencies
				};
				dependencyStatus = installPath ? buildManagedPluginDependencyStatus({
					...dependencies,
					dependencyRootDir: resolveRetainedManagedNpmInstallPackageInfo(installPath)?.projectRoot ?? installPath
				}) : plugin.dependencyStatus ?? buildPluginDependencyStatus(dependencies);
				if (useMetadataCache) cache.dependencyStatus.set(manifest, dependencyStatus);
			}
			return {
				...plugin,
				dependencyStatus
			};
		});
		const plugins = new Map(preparedPlugins.map((plugin) => [plugin.id, plugin]));
		const config = normalizePluginsConfig(params.config?.plugins);
		for (const installOwner of Object.keys(index.installRecords)) {
			const installId = index.installRecords[installOwner]?.source === "path" ? null : installSelectors.get(installOwner) ?? installOwner;
			const resolved = ownership.resolveUpdate(installOwner);
			if (!resolved.ok || resolved.value.kind === "operator-managed") continue;
			if (resolved.value.kind === "orphan") {
				if (findBlockedPluginDiagnostic(installOwner)) continue;
				if ((!scope || scope.includes(installOwner)) && resolveEffectiveEnableState({
					id: installOwner,
					origin: "global",
					config,
					rootConfig: params.config
				}).enabled) diagnostics.push(pluginInstallIncompleteDiagnostic(installOwner, "plugin metadata is missing.", installId));
				continue;
			}
			const { installRecord, pluginIds } = resolved.value;
			const enabledIds = pluginIds.filter((id) => {
				const plugin = plugins.get(id);
				return plugin?.enabled && (plugin.origin ?? records.get(id)?.origin) !== "bundled";
			});
			if (enabledIds.length === 0) continue;
			const missingManifest = pluginIds.some((id) => (!scope || scope.includes(id)) && !manifests.has(id));
			const installPath = installRecord.installPath ? resolveUserPath(installRecord.installPath, params.env) : void 0;
			const project = installPath && installRecord.source === "npm" ? resolveRetainedManagedNpmInstallPackageInfo(installPath) : void 0;
			const packageRoots = installPath ? [installPath, ...project ? [project.projectRoot] : []] : [];
			const missingPackage = (installRecord.source === "npm" || installRecord.source === "clawhub" && pluginIds.some((id) => (manifests.get(id)?.format ?? records.get(id)?.format ?? (installRecord.clawhubFamily === "bundle-plugin" ? "bundle" : "openclaw")) !== "bundle")) && (!installPath || packageRoots.some((root) => !pluginCacheStatSync(path.join(root, "package.json"))?.isFile()));
			if (missingManifest || missingPackage) {
				diagnostics.push(...enabledIds.map((id) => pluginInstallIncompleteDiagnostic(id, missingManifest ? "plugin manifest is missing." : "package.json is missing.", installId)));
				continue;
			}
			if (pluginIds.some((id) => plugins.get(id)?.dependencyStatus?.requiredInstalled === false)) continue;
			const declared = resolvePluginPackageDeclaredSurface(resolved.value, manifests);
			if (!declared || resolveAcceptedSurfaceCurrent(installRecord, declared)) continue;
			for (const pluginId of enabledIds) if (!manifests.get(pluginId)?.trustedOfficialInstall) diagnostics.push({
				level: "warn",
				pluginId,
				message: formatPluginCapabilityConsentRequired(pluginId)
			});
		}
		return projectPluginDependencyHealth({
			...registry,
			plugins: preparedPlugins,
			diagnostics
		}, installTargets);
	});
}
function buildPluginRecordFromInstalledIndex(plugin, manifest) {
	const format = plugin.format ?? manifest?.format ?? "openclaw";
	const bundleFormat = plugin.bundleFormat ?? manifest?.bundleFormat;
	return {
		id: plugin.pluginId,
		name: manifest?.name ?? plugin.packageName ?? plugin.pluginId,
		...plugin.packageVersion || manifest?.version ? { version: plugin.packageVersion ?? manifest?.version } : {},
		...manifest?.description ? { description: manifest.description } : {},
		format,
		...bundleFormat ? { bundleFormat } : {},
		bundleCapabilities: manifest?.bundleCapabilities,
		...manifest?.kind ? { kind: manifest.kind } : {},
		source: plugin.source ?? plugin.manifestPath,
		rootDir: plugin.rootDir,
		origin: plugin.origin,
		trustedOfficialInstall: manifest?.trustedOfficialInstall,
		trust: manifest?.trust,
		enabled: plugin.enabled,
		compat: plugin.compat,
		syntheticAuthRefs: [...plugin.syntheticAuthRefs ?? manifest?.syntheticAuthRefs ?? []],
		status: plugin.enabled ? "loaded" : "disabled",
		toolNames: uniqueStrings(manifest?.contracts?.tools ?? []),
		hookNames: [],
		channelIds: [...manifest?.channels ?? []],
		cliBackendIds: [...manifest?.cliBackends ?? [], ...manifest?.setup?.cliBackends ?? []],
		providerIds: [...manifest?.providers ?? []],
		embeddingProviderIds: [...manifest?.contracts?.embeddingProviders ?? []],
		speechProviderIds: [...manifest?.contracts?.speechProviders ?? []],
		realtimeTranscriptionProviderIds: [...manifest?.contracts?.realtimeTranscriptionProviders ?? []],
		realtimeVoiceProviderIds: [...manifest?.contracts?.realtimeVoiceProviders ?? []],
		mediaUnderstandingProviderIds: [...manifest?.contracts?.mediaUnderstandingProviders ?? []],
		transcriptSourceProviderIds: [...manifest?.contracts?.transcriptSourceProviders ?? []],
		imageGenerationProviderIds: [...manifest?.contracts?.imageGenerationProviders ?? []],
		videoGenerationProviderIds: [...manifest?.contracts?.videoGenerationProviders ?? []],
		musicGenerationProviderIds: [...manifest?.contracts?.musicGenerationProviders ?? []],
		webFetchProviderIds: [...manifest?.contracts?.webFetchProviders ?? []],
		webSearchProviderIds: [...manifest?.contracts?.webSearchProviders ?? []],
		migrationProviderIds: [...manifest?.contracts?.migrationProviders ?? []],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [...manifest?.commandAliases?.map((alias) => alias.name) ?? []],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: Boolean(manifest?.configSchema),
		contracts: manifest?.contracts
	};
}
/** Resolves the best available plugin registry snapshot and annotates dependency status. */
function buildPluginRegistrySnapshotReport(params) {
	const config = params?.config ?? getRuntimeConfig();
	const env = params?.env ?? process.env;
	const workspace = resolvePluginControlPlaneWorkspace({
		config,
		env,
		workspaceDir: params?.workspaceDir
	});
	const metadataSnapshot = tracePluginLifecyclePhase("plugin registry snapshot", () => loadPluginMetadataSnapshot({
		config,
		env,
		workspaceDir: workspace.workspaceDir
	}), { surface: "status" });
	const { index, byPluginId: manifestByPluginId, registryDiagnostics } = metadataSnapshot;
	return projectPluginInstallHealth({
		workspaceDir: workspace.workspaceDir,
		workspaceScope: workspace.workspaceScope,
		...createEmptyPluginRegistry(),
		plugins: index.plugins.map((plugin) => buildPluginRecordFromInstalledIndex(plugin, manifestByPluginId.get(plugin.pluginId))),
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic([...index.diagnostics], workspace),
		registrySource: metadataSnapshot.registrySource ?? (registryDiagnostics.length > 0 ? "derived" : "provided"),
		registryDiagnostics
	}, {
		metadata: metadataSnapshot,
		config,
		env
	});
}
//#endregion
export { projectPluginInstallHealth as n, buildPluginRegistrySnapshotReport as t };

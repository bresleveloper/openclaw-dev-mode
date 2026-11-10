import { p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { A as withPluginRegistryPreparationScope, w as markPluginRegistryActive } from "./registry-lifecycle-CjTFYNkp.mjs";
import { l as getActivePluginRegistry, o as disposePluginRegistryInstances } from "./runtime-DkPagH0y.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { T as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import "./workspace-default-BjEaT57h.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { n as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as listAmbientOnlyConfiguredChannelIds } from "./channel-presence-policy-hdzky3AO.mjs";
import { i as resolveProviderPolicySurfaceForOwner } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { i as getPluginRuntimeLoadContext, o as setPluginRuntimeLoadContext } from "./load-context-YqkPeFye.mjs";
import "./registry-Bz-UU13h.mjs";
import { S as collectUnregisteredConfiguredMemoryEmbeddingProviders, T as getRegisteredEmbeddingProvider, v as collectConfiguredMemoryEmbeddingStartupProviderOwners, x as collectRegisteredEmbeddingProviderIds } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-DNccnd-0.mjs";
import { n as measureStartup } from "./server-startup-trace-D_q4lWuA.mjs";
import { n as listGatewayMethods } from "./server-methods-list-B1Ihr5Aw.mjs";
import { i as validateConfiguredBindings } from "./configured-binding-registry-QGs3UeEc.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-tLBMDcKE.mjs";
//#region src/gateway/server-startup-plugins.ts
/** Best-effort repair runs under the Gateway's existing post-ready maintenance lifetime. */
async function runGatewayPostReadyStartupMaintenance(params) {
	await Promise.all([
		["plugin-registry", async () => {
			if (params.pluginMetadataSnapshot?.registrySource !== "derived") return;
			const [{ withPluginLifecycleLease }, { refreshPluginRegistryAfterConfigMutation }] = await Promise.all([import("./plugin-lifecycle-lease-C4DiOvV_.mjs"), import("./registry-refresh-DOLmzo6d.mjs")]);
			await withPluginLifecycleLease({
				signal: params.signal,
				assertCurrent: () => params.signal.throwIfAborted(),
				processBound: true
			}, (lease) => refreshPluginRegistryAfterConfigMutation({
				reason: "source-changed",
				lease,
				invalidateRuntimeCache: false,
				logger: params.log
			}));
		}],
		["channels", async () => {
			const { runChannelPluginStartupMaintenance } = await import("./lifecycle-startup-BQ5DMHta.mjs");
			params.signal.throwIfAborted();
			await withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => runChannelPluginStartupMaintenance({
				cfg: params.getConfig(),
				env: process.env,
				log: params.log
			}));
		}],
		["sessions", async () => {
			const { runGatewaySessionStartupMaintenance } = await import("./server-startup-session-migration-Dge_JkbM.mjs");
			params.signal.throwIfAborted();
			await runGatewaySessionStartupMaintenance(params);
		}],
		["pairing", async () => {
			const { listLegacyPairingStoreFiles } = await import("./pairing-files-Bji8GR_0.mjs");
			params.signal.throwIfAborted();
			const files = await listLegacyPairingStoreFiles();
			if (files.length > 0) params.log.warn(`Legacy pairing stores require repair: ${files.join(", ")}. Stop the Gateway and run openclaw doctor --fix.`);
		}]
	].map(async ([name, run]) => {
		try {
			params.signal.throwIfAborted();
			await measureStartup(params.startupTrace, `startup.maintenance.${name}`, run);
		} catch (error) {
			if (!params.signal.aborted) params.log.warn(`Gateway post-ready ${name} maintenance failed: ${formatErrorMessageWithCode(error)}`);
		}
	}));
}
/** Builds plugin startup state and gateway method lists before the server binds. */
async function prepareGatewayPluginBootstrap(params) {
	const activationSourceConfig = params.activationSourceConfig ?? params.cfgAtStart;
	const gatewayPluginConfig = params.minimalTestGateway ? params.cfgAtStart : resolveGatewayStartupPluginActivationConfig({
		runtimeConfig: params.cfgAtStart,
		activationSourceConfig,
		env: process.env,
		...params.pluginMetadataSnapshot?.manifestRegistry ? { manifestRegistry: params.pluginMetadataSnapshot.manifestRegistry } : {},
		discovery: params.pluginMetadataSnapshot?.discovery,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const pluginsGloballyDisabled = gatewayPluginConfig.plugins?.enabled === false;
	const pluginWorkspaceDir = tryResolveConfiguredAgentWorkspaceDir(gatewayPluginConfig);
	const defaultWorkspaceDir = pluginWorkspaceDir ?? resolveDefaultAgentWorkspaceDir();
	const pluginLookUpTable = params.minimalTestGateway || pluginsGloballyDisabled ? void 0 : loadPluginLookUpTable({
		config: gatewayPluginConfig,
		workspaceDir: pluginWorkspaceDir,
		env: process.env,
		activationSourceConfig,
		metadataSnapshot: params.pluginMetadataSnapshot,
		workerProviderIds: params.workerProviderIds ?? [],
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const pluginManifestRecords = pluginLookUpTable?.manifestRegistry.plugins ?? params.pluginMetadataSnapshot?.manifestRegistry.plugins ?? [];
	const startupPluginIds = [...pluginLookUpTable?.startup.pluginIds ?? []];
	const ambientAutostartSuppressedChannelIds = params.ambientEnvTriggers === "suppress" ? new Set(listAmbientOnlyConfiguredChannelIds({
		config: params.cfgAtStart,
		activationSourceConfig,
		env: process.env,
		includePersistedAuthState: false,
		manifestRecords: pluginManifestRecords
	})) : /* @__PURE__ */ new Set();
	const baseMethods = listGatewayMethods();
	const emptyPluginRegistry = createEmptyPluginRegistry();
	markPluginRegistryActive(emptyPluginRegistry);
	const pluginRegistry = params.minimalTestGateway && !pluginsGloballyDisabled ? getActivePluginRegistry() ?? emptyPluginRegistry : emptyPluginRegistry;
	const metadataSnapshot = getGatewayPluginMetadataSnapshot() ?? completePluginMetadataSnapshot({
		snapshot: pluginLookUpTable ?? params.pluginMetadataSnapshot,
		config: activationSourceConfig,
		env: process.env,
		workspaceDir: defaultWorkspaceDir
	});
	setPluginRuntimeLoadContext(pluginRegistry, {
		rawConfig: params.cfgAtStart,
		config: gatewayPluginConfig,
		activationSourceConfig,
		autoEnabledReasons: {},
		workspaceDir: pluginWorkspaceDir,
		env: process.env,
		logger: params.log,
		metadataSnapshot,
		manifestRegistry: metadataSnapshot?.manifestRegistry,
		installRecords: metadataSnapshot ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index) : void 0,
		preferBuiltPluginArtifacts: true
	});
	return {
		gatewayPluginConfigAtStart: gatewayPluginConfig,
		defaultWorkspaceDir,
		pluginWorkspaceDir,
		startupPluginIds,
		pluginManifestRecords,
		pluginMetadataSnapshot: metadataSnapshot,
		pluginLookUpTable,
		baseMethods,
		pluginRegistry,
		baseGatewayMethods: baseMethods,
		ambientAutostartSuppressedChannelIds
	};
}
/**
* Warn when `memory.search.provider` selects a memory embedding provider
* that no loaded plugin registered. Without the owning plugin, `active-memory`
* cannot embed and silently falls back to keyword/FTS-only recall.
*/
function warnUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const unregistered = collectUnregisteredConfiguredMemoryEmbeddingProviders({
		config: params.config,
		registeredProviderIds: collectRegisteredEmbeddingProviderIds(params.pluginRegistry)
	});
	for (const provider of unregistered) {
		const path = `memory.search.${provider.source}`;
		params.log.warn(`${path}="${provider.configuredId}" is configured, but no loaded plugin registered a memory embedding provider that can serve "${provider.configuredId}". Semantic memory recall will fall back to keyword/FTS-only search. Check that the plugin that provides "${provider.configuredId}" is installed and enabled.`);
	}
}
async function warnConfiguredMemoryEmbeddingProviderSetup(params) {
	const manifestRegistry = getPluginRuntimeLoadContext(params.pluginRegistry)?.manifestRegistry ?? params.pluginLookUpTable?.manifestRegistry ?? { plugins: [] };
	await Promise.all(collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config).flatMap((provider) => {
		const registered = [...provider.ownerIds].map((ownerId) => getRegisteredEmbeddingProvider(ownerId)).find((entry) => entry !== void 0);
		const owner = manifestRegistry.plugins.find((plugin) => plugin.id === registered?.ownerPluginId);
		if (provider.agentIds.size === 0 || !owner) return [];
		let policy;
		try {
			policy = resolveProviderPolicySurfaceForOwner(owner);
		} catch (error) {
			params.log.warn(`Memory embedding provider "${provider.configuredId}" setup could not be checked (${String(error)}). Run "openclaw doctor" to retry.`);
			return [];
		}
		const inspectSetup = policy?.inspectEmbeddingProviderSetup;
		if (!inspectSetup) return [];
		return [...provider.agentIds].map(async (agentId) => {
			try {
				const setup = await inspectSetup({
					config: params.config,
					env: process.env,
					agentId,
					provider: provider.configuredId
				});
				if (setup) params.log.warn(`Agent "${agentId}": semantic memory recall is degraded (${provider.source}="${provider.configuredId}"). ${setup.reason}${setup.fixHint ? ` ${setup.fixHint}` : ""}`);
			} catch (error) {
				params.log.warn(`Agent "${agentId}": memory embedding setup could not be checked (${String(error)}). Run "openclaw doctor" to retry.`);
			}
		});
	}));
}
/** Loads startup plugin runtimes after the gateway listener binds. */
async function loadGatewayStartupPluginRuntime(params) {
	const { prepareGatewayPluginLoad } = await import("./server-plugin-bootstrap-BlOLeVNG.mjs");
	await params.pluginRuntimeClaim?.waitForUnblocked();
	if (params.pluginRuntimeClaim && !params.pluginRuntimeClaim.isCurrent()) {
		const currentPluginRegistry = params.getCurrentPluginRegistry?.();
		if (!currentPluginRegistry) throw new Error("superseded Gateway startup cannot resolve the current plugin runtime");
		return {
			pluginRegistry: currentPluginRegistry,
			gatewayMethods: params.baseMethods
		};
	}
	const loaded = await prepareGatewayPluginLoad({
		loadIntent: "startup",
		cfg: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		log: params.log,
		coreGatewayMethodNames: params.coreGatewayMethodNames ?? params.baseMethods,
		baseMethods: params.baseMethods,
		...params.hostServices !== void 0 && { hostServices: params.hostServices },
		pluginIds: params.startupPluginIds,
		pluginLookUpTable: params.pluginLookUpTable,
		channelPluginLoadIntent: "full",
		startupTrace: params.startupTrace,
		ambientEnvTriggers: params.ambientEnvTriggers,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
	});
	try {
		withPluginRegistryPreparationScope(loaded.pluginRegistry, () => withPluginRuntimeRegistryScope(loaded.pluginRegistry, () => validateConfiguredBindings(loaded.resolvedConfig)));
		warnUnregisteredConfiguredMemoryEmbeddingProviders({
			config: loaded.resolvedConfig,
			pluginRegistry: loaded.pluginRegistry,
			log: params.log
		});
		withPluginRuntimeRegistryScope(loaded.pluginRegistry, () => warnConfiguredMemoryEmbeddingProviderSetup({
			config: loaded.resolvedConfig,
			pluginRegistry: loaded.pluginRegistry,
			pluginLookUpTable: params.pluginLookUpTable,
			log: params.log
		})).catch((error) => {
			params.log.warn(`Memory embedding setup checks failed: ${String(error)}`);
		});
		const metadata = getPluginRuntimeLoadContext(loaded.pluginRegistry)?.metadataSnapshot;
		const { settlePluginNativeAdmissions } = await import("./plugin-native-admission-state-Cns-fhcF.mjs");
		await settlePluginNativeAdmissions(metadata ? getPluginMetadataSnapshotCache(metadata) : void 0);
		return loaded;
	} catch (error) {
		loaded.retireGatewayRuntimeBindings();
		await disposePluginRegistryInstances(loaded.pluginRegistry).catch((cleanupError) => {
			throw new AggregateError([error, cleanupError], "Startup plugin candidate cleanup failed", { cause: error });
		});
		throw error;
	}
}
//#endregion
export { loadGatewayStartupPluginRuntime, prepareGatewayPluginBootstrap, runGatewayPostReadyStartupMaintenance, warnUnregisteredConfiguredMemoryEmbeddingProviders };

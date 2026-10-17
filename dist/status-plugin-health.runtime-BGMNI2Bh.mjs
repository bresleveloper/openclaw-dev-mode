import { l as getActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { r as listLoadedRuntimePluginIds } from "./active-runtime-registry-DTyEuOsJ.mjs";
import { u as listContextEngineQuarantines } from "./registry-BIuAP_WM.mjs";
import { n as resolveReadOnlyChannelPluginsForConfig } from "./read-only-DLjFn1TE.mjs";
import { n as listPersistedRuntimeToolSchemaQuarantines } from "./tool-schema-quarantine-health-B9gol2Q6.mjs";
import { a as isChannelPluginFailureDiagnostic, n as dedupePluginDiagnostics, o as mergeStatusPluginHealthSnapshots, t as dedupeChannelPluginFailures } from "./status-plugin-health-D9gBz1V0.mjs";
//#region src/status/status-plugin-health.runtime.ts
function normalizeSnapshotPlugin(plugin) {
	return {
		id: plugin.id,
		...plugin.status !== void 0 ? { status: plugin.status } : {},
		...plugin.enabled !== void 0 ? { enabled: plugin.enabled } : {},
		...plugin.error !== void 0 ? { error: plugin.error } : {},
		...plugin.dependencyStatus !== void 0 ? { dependencyStatus: plugin.dependencyStatus } : {},
		...plugin.failurePhase !== void 0 ? { failurePhase: plugin.failurePhase } : {}
	};
}
function normalizeDiagnostic(diagnostic) {
	return {
		level: diagnostic.level,
		message: diagnostic.message,
		...diagnostic.pluginId ? { pluginId: diagnostic.pluginId } : {},
		...diagnostic.code ? { code: diagnostic.code } : {}
	};
}
function normalizeCompatibilityNotice(notice) {
	return {
		pluginId: notice.pluginId,
		severity: notice.severity,
		message: notice.message,
		...notice.code ? { code: notice.code } : {}
	};
}
function collectChannelPluginFailures(params) {
	const diagnosticFailures = (params.diagnostics ?? []).filter(isChannelPluginFailureDiagnostic).map((diagnostic) => {
		const failure = {
			channelId: diagnostic.pluginId ?? "unknown",
			message: diagnostic.message,
			source: "diagnostic"
		};
		if (diagnostic.pluginId) failure.pluginId = diagnostic.pluginId;
		return failure;
	});
	if (!params.config) return dedupeChannelPluginFailures(diagnosticFailures);
	try {
		const resolution = resolveReadOnlyChannelPluginsForConfig(params.config, {
			workspaceDir: params.workspaceDir,
			activationSourceConfig: params.config,
			includePersistedAuthState: false,
			includeSetupFallbackPlugins: true
		});
		const loadFailures = resolution.loadFailures.map((failure) => ({
			channelId: failure.channelId,
			pluginId: failure.pluginId,
			message: failure.message,
			...failure.source ? { source: failure.source } : {}
		}));
		const concreteFailures = dedupeChannelPluginFailures([...diagnosticFailures, ...loadFailures]);
		const failedChannelIds = new Set(concreteFailures.map((failure) => failure.channelId));
		return [...concreteFailures, ...resolution.missingConfiguredChannelIds.filter((channelId) => !failedChannelIds.has(channelId)).map((channelId) => ({
			channelId,
			message: "configured channel plugin is missing or unavailable"
		}))];
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return [...diagnosticFailures, {
			channelId: "unknown",
			message: `failed to inspect configured channel plugins: ${message}`
		}];
	}
}
function parsePluginOwner(owner) {
	if (!owner?.startsWith("plugin:")) return;
	const pluginId = owner.slice(7).trim();
	return pluginId.length > 0 ? pluginId : void 0;
}
function filterRuntimeToolQuarantinesForRegistry(params) {
	const loadedPluginIds = new Set(params.plugins.filter((plugin) => plugin.enabled !== false && plugin.status !== "disabled").map((plugin) => plugin.id));
	return params.quarantines.filter((quarantine) => {
		const pluginId = parsePluginOwner(quarantine.owner);
		return !pluginId || loadedPluginIds.has(pluginId);
	});
}
async function collectRuntimePluginHealthSnapshot() {
	const [contextEngineQuarantines, runtimeToolQuarantines] = await Promise.all([listContextEngineQuarantines(), listPersistedRuntimeToolSchemaQuarantines()]);
	const registry = getActivePluginRegistry();
	const diagnostics = (registry?.diagnostics ?? []).map(normalizeDiagnostic);
	const plugins = (registry?.plugins ?? []).map(normalizeSnapshotPlugin);
	const runtimeLoadedPluginIds = listLoadedRuntimePluginIds();
	return {
		plugins,
		diagnostics,
		contextEngineQuarantines,
		runtimeToolQuarantines: filterRuntimeToolQuarantinesForRegistry({
			quarantines: runtimeToolQuarantines,
			plugins
		}),
		channelPluginFailures: collectChannelPluginFailures({ diagnostics }),
		runtimeLoadedPluginIds
	};
}
async function collectInstalledPluginHealthSnapshot(params) {
	const { buildPluginCompatibilityNotices, buildPluginSnapshotReport } = await import("./status-Cka81dom.mjs");
	const runtime = await collectRuntimePluginHealthSnapshot();
	const report = buildPluginSnapshotReport({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const installedDiagnostics = report.diagnostics.map(normalizeDiagnostic);
	const channelPluginFailures = collectChannelPluginFailures({
		config: params.config,
		diagnostics: dedupePluginDiagnostics([...installedDiagnostics, ...runtime.diagnostics]),
		workspaceDir: params.workspaceDir
	});
	const runtimeRegistry = getActivePluginRegistry();
	const runtimeCompatibilityNotices = runtimeRegistry ? buildPluginCompatibilityNotices({
		config: params.config,
		workspaceDir: params.workspaceDir,
		report: runtimeRegistry
	}).map(normalizeCompatibilityNotice) : [];
	const merged = mergeStatusPluginHealthSnapshots({
		plugins: report.plugins.map(normalizeSnapshotPlugin),
		diagnostics: installedDiagnostics,
		contextEngineQuarantines: [],
		channelPluginFailures,
		compatibilityNotices: buildPluginCompatibilityNotices({
			config: params.config,
			workspaceDir: params.workspaceDir,
			report
		}).map(normalizeCompatibilityNotice)
	}, {
		...runtime,
		compatibilityNotices: runtimeCompatibilityNotices
	});
	const shouldRunPluginIds = await resolveShouldRunPluginIds(params);
	const unregisteredMemoryEmbeddingProviders = await resolveUnregisteredMemoryEmbeddingProviders({
		config: params.config,
		registry: runtimeRegistry
	});
	return {
		...merged,
		...shouldRunPluginIds ? { shouldRunPluginIds } : {},
		...unregisteredMemoryEmbeddingProviders ? { unregisteredMemoryEmbeddingProviders } : {}
	};
}
async function resolveUnregisteredMemoryEmbeddingProviders(params) {
	if (!params.config || !params.registry) return;
	try {
		const { collectRegisteredEmbeddingProviderIds, collectUnregisteredConfiguredMemoryEmbeddingProviders } = await import("./gateway-startup-plugin-ids-BDcdGIZ5.mjs");
		const unregistered = collectUnregisteredConfiguredMemoryEmbeddingProviders({
			config: params.config,
			registeredProviderIds: collectRegisteredEmbeddingProviderIds(params.registry)
		});
		return unregistered.length > 0 ? unregistered : void 0;
	} catch {
		return;
	}
}
async function resolveShouldRunPluginIds(params) {
	if (!params.config) return;
	try {
		const { loadGatewayStartupPluginPlan } = await import("./gateway-startup-plugin-ids-BDcdGIZ5.mjs");
		const { resolvePluginActivationSourceConfig } = await import("./activation-source-config-DSJeuxWW.mjs");
		const { resolveGatewayStartupPluginActivationConfig } = await import("./plugin-activation-runtime-config-SW711wZ5.mjs");
		const sourceConfig = resolvePluginActivationSourceConfig({ config: params.config });
		return [...loadGatewayStartupPluginPlan({
			config: resolveGatewayStartupPluginActivationConfig({
				runtimeConfig: params.config,
				activationSourceConfig: sourceConfig,
				env: process.env
			}),
			activationSourceConfig: sourceConfig,
			env: process.env,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
		}).pluginIds];
	} catch {
		return;
	}
}
//#endregion
export { collectInstalledPluginHealthSnapshot, collectRuntimePluginHealthSnapshot };

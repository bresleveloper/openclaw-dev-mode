import { r as listContextEngineQuarantines } from "./registry-BLZQzICr.js";
import { t as getActiveRuntimePluginRegistry } from "./active-runtime-registry-CaDgql0z.js";
import { r as resolveReadOnlyChannelPluginsForConfig } from "./read-only-F_XqecB-.js";
import { n as listPersistedRuntimeToolSchemaQuarantines } from "./tool-schema-quarantine-health-B4s8vKoC.js";
import { a as isChannelPluginFailureDiagnostic, n as dedupePluginDiagnostics, o as mergeStatusPluginHealthSnapshots, t as dedupeChannelPluginFailures } from "./status-plugin-health-CVz23luC.js";
//#region src/status/status-plugin-health.runtime.ts
function normalizeSnapshotPlugin(plugin) {
	const normalized = { id: plugin.id };
	if (plugin.status !== void 0) normalized.status = plugin.status;
	if (plugin.enabled !== void 0) normalized.enabled = plugin.enabled;
	if (plugin.error !== void 0) normalized.error = plugin.error;
	if (plugin.dependencyStatus !== void 0) normalized.dependencyStatus = plugin.dependencyStatus;
	if (plugin.failurePhase !== void 0) normalized.failurePhase = plugin.failurePhase;
	return normalized;
}
function normalizeDiagnostic(diagnostic) {
	const normalized = {
		level: diagnostic.level,
		message: diagnostic.message
	};
	if (diagnostic.pluginId) normalized.pluginId = diagnostic.pluginId;
	if (diagnostic.code) normalized.code = diagnostic.code;
	return normalized;
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
function collectRuntimePluginHealthSnapshot() {
	const registry = getActiveRuntimePluginRegistry();
	const diagnostics = (registry?.diagnostics ?? []).map(normalizeDiagnostic);
	const plugins = (registry?.plugins ?? []).map(normalizeSnapshotPlugin);
	return {
		plugins,
		diagnostics,
		contextEngineQuarantines: listContextEngineQuarantines(),
		runtimeToolQuarantines: filterRuntimeToolQuarantinesForRegistry({
			quarantines: listPersistedRuntimeToolSchemaQuarantines(),
			plugins
		}),
		channelPluginFailures: collectChannelPluginFailures({ diagnostics })
	};
}
async function collectInstalledPluginHealthSnapshot(params) {
	const { buildPluginCompatibilityNotices, buildPluginSnapshotReport } = await import("./status-BwJFIW6b.js");
	const runtime = collectRuntimePluginHealthSnapshot();
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
	const runtimeRegistry = getActiveRuntimePluginRegistry();
	const runtimeCompatibilityNotices = runtimeRegistry ? buildPluginCompatibilityNotices({
		config: params.config,
		workspaceDir: params.workspaceDir,
		report: runtimeRegistry
	}).map(normalizeCompatibilityNotice) : [];
	return mergeStatusPluginHealthSnapshots({
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
}
//#endregion
export { collectInstalledPluginHealthSnapshot, collectRuntimePluginHealthSnapshot };

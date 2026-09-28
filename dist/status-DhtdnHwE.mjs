import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { n as normalizeOpenClawVersionBase } from "./version-ByD9iTct.mjs";
import { m as withBundledPluginEnablementCompat } from "./installed-plugin-index-D0kh4WcK.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { r as hasKind } from "./slots-D4OMSTbt.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { o as tracePluginLifecyclePhase, s as tracePluginLifecyclePhaseAsync } from "./discovery-D_5mAUI7.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-KhFe5dXK.mjs";
import { r as listImportedBundledPluginFacadeIds } from "./facade-loader-BWw5NpKt.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as inspectBundleMcpRuntimeSupport, r as inspectNativePluginMcpRuntimeSupport } from "./bundle-mcp-BCbIrwKD.mjs";
import { h as listImportedRuntimePluginIds } from "./runtime-B2zZQffc.mjs";
import "./facade-runtime-CSNstsFk.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DitY2Htf.mjs";
import { s as resolveCompatibleRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import { t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { r as resolveBundledProviderCompatPluginIds } from "./providers-Bx7WoFEI.mjs";
import { r as loadPluginRegistryHandle } from "./loader-CidXT38G.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-XdYxCzko.mjs";
import { t as inspectBundleLspRuntimeSupport } from "./bundle-lsp-CaUzXSwj.mjs";
import { r as inspectDecisionProviders } from "./runtime-COFnHPEE.mjs";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-DjuZqKkD.mjs";
import { t as loadPluginMetadataRegistrySnapshot } from "./metadata-registry-loader-CbWWRZ8_.mjs";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-DdQ1VWdc.mjs";
import { n as projectPluginInstallHealth } from "./status-snapshot-p_mMqoQ0.mjs";
//#region src/plugins/inspect-shape.ts
function buildPluginCapabilityEntries(plugin, report) {
	return [
		{
			kind: "cli-backend",
			ids: plugin.cliBackendIds ?? []
		},
		{
			kind: "text-inference",
			ids: plugin.providerIds
		},
		{
			kind: "decision",
			ids: plugin.contracts?.decisionProviders ?? []
		},
		{
			kind: "embedding",
			ids: plugin.embeddingProviderIds
		},
		{
			kind: "speech",
			ids: plugin.speechProviderIds
		},
		{
			kind: "realtime-transcription",
			ids: plugin.realtimeTranscriptionProviderIds
		},
		{
			kind: "realtime-voice",
			ids: plugin.realtimeVoiceProviderIds
		},
		{
			kind: "media-understanding",
			ids: plugin.mediaUnderstandingProviderIds
		},
		{
			kind: "transcript-source",
			ids: plugin.transcriptSourceProviderIds
		},
		{
			kind: "document-extractors",
			ids: plugin.contracts?.documentExtractors ?? []
		},
		{
			kind: "image-generation",
			ids: plugin.imageGenerationProviderIds
		},
		{
			kind: "video-generation",
			ids: plugin.videoGenerationProviderIds
		},
		{
			kind: "music-generation",
			ids: plugin.musicGenerationProviderIds
		},
		{
			kind: "web-content-extractors",
			ids: plugin.contracts?.webContentExtractors ?? []
		},
		{
			kind: "web-fetch",
			ids: plugin.webFetchProviderIds
		},
		{
			kind: "web-search",
			ids: plugin.webSearchProviderIds
		},
		{
			kind: "migration-provider",
			ids: plugin.migrationProviderIds
		},
		{
			kind: "worker-provider",
			ids: plugin.contracts?.workerProviders ?? []
		},
		{
			kind: "session-catalog",
			ids: report.sessionCatalogs.filter((entry) => entry.pluginId === plugin.id).map((entry) => entry.provider.id)
		},
		{
			kind: "agent-harness",
			ids: plugin.agentHarnessIds
		},
		{
			kind: "context-engine",
			ids: plugin.status === "loaded" && hasKind(plugin.kind, "context-engine") ? plugin.contextEngineIds ?? [] : []
		},
		{
			kind: "channel",
			ids: plugin.channelIds
		},
		{
			kind: "gateway-discovery",
			ids: plugin.gatewayDiscoveryServiceIds
		}
	].filter((entry) => entry.ids.length > 0);
}
function derivePluginInspectShape({ plugin, report }, capabilityCount) {
	if (capabilityCount > 1) return "hybrid-capability";
	if (capabilityCount === 1) return "plain-capability";
	if (plugin.commands.length === 0 && plugin.cliCommands.length === 0 && plugin.services.length === 0 && plugin.httpRoutes === 0 && (report.typedHooks.some((entry) => entry.pluginId === plugin.id) || report.hooks.some((entry) => entry.pluginId === plugin.id)) && !report.tools.some((entry) => entry.pluginId === plugin.id) && !(report.gatewayMethodDescriptors ?? []).some((descriptor) => descriptor.owner.kind === "plugin" && descriptor.owner.pluginId === plugin.id)) return "hook-only";
	return "non-capability";
}
function buildPluginShapeSummary(params) {
	const capabilities = buildPluginCapabilityEntries(params.plugin, params.report);
	const capabilityCount = capabilities.length;
	return {
		shape: derivePluginInspectShape(params, capabilityCount),
		capabilityMode: capabilityCount === 0 ? "none" : capabilityCount === 1 ? "plain" : "hybrid",
		capabilityCount,
		capabilities
	};
}
//#endregion
//#region src/plugins/status.ts
function buildCompatibilityNoticesForInspect(inspect) {
	const warnings = [];
	if (inspect.shape === "hook-only") warnings.push({
		pluginId: inspect.plugin.id,
		code: "hook-only",
		compatCode: "hook-only-plugin-shape",
		severity: "info",
		message: "is hook-only. This remains a supported compatibility path, but it has not migrated to explicit capability registration yet."
	});
	if (usesRemovedSessionTranscriptFileApi(inspect)) warnings.push({
		pluginId: inspect.plugin.id,
		code: "removed-session-transcript-file-api",
		compatCode: "removed-session-transcript-file-api",
		severity: "warn",
		message: "references removed session/transcript file APIs; migrate to session identity, SessionTranscriptUpdate.target, and Gateway/runtime session helpers."
	});
	return warnings;
}
const removedSessionTranscriptFileApiMarkers = [
	"saveSessionStore",
	"resolveSessionTranscriptPathInDir",
	"resolveAndPersistSessionFile",
	"readLatestAssistantTextFromSessionTranscript",
	"SessionTranscriptUpdate.sessionFile",
	"sessionFiles",
	"transcriptPath",
	"sessionFile"
];
function usesRemovedSessionTranscriptFileApi(inspect) {
	if (inspect.plugin.origin === "bundled") return false;
	return [inspect.plugin.error, ...inspect.diagnostics.map((diagnostic) => diagnostic.message)].filter((message) => typeof message === "string" && message.length > 0).some((message) => removedSessionTranscriptFileApiMarkers.some((marker) => message.includes(marker)));
}
function resolveReportedPluginVersion(plugin, env) {
	if (plugin.origin !== "bundled") return plugin.version;
	return normalizeOpenClawVersionBase(resolveCompatibilityHostVersion(env)) ?? normalizeOpenClawVersionBase(plugin.version) ?? plugin.version;
}
function preparePluginReport(params) {
	const rawConfig = params?.config ?? getRuntimeConfig();
	const workspace = resolvePluginControlPlaneWorkspace({
		config: rawConfig,
		env: params?.env,
		workspaceDir: params?.workspaceDir
	});
	const initialWorkspaceDir = workspace.workspaceDir;
	const metadataSnapshot = params?.metadataSnapshot ?? loadPluginMetadataSnapshot({
		config: rawConfig,
		env: params?.env ?? process.env,
		workspaceDir: initialWorkspaceDir,
		...params?.onlyPluginIds !== void 0 ? { pluginIds: params.onlyPluginIds } : {}
	});
	const baseContext = resolvePluginRuntimeLoadContext({
		config: rawConfig,
		env: params?.env,
		logger: params?.logger,
		workspaceDir: initialWorkspaceDir,
		onlyPluginIds: params?.onlyPluginIds,
		metadataSnapshot
	});
	const workspaceDir = baseContext.workspaceDir ?? initialWorkspaceDir;
	const context = workspaceDir === baseContext.workspaceDir ? baseContext : {
		...baseContext,
		workspaceDir
	};
	const config = context.config;
	const bundledProviderIds = resolveBundledProviderCompatPluginIds({
		config,
		workspaceDir,
		env: params?.env,
		manifestRegistry: metadataSnapshot.manifestRegistry
	});
	const runtimeCompatConfig = withBundledPluginEnablementCompat({
		config,
		pluginIds: bundledProviderIds,
		...params?.env ? { env: params.env } : {},
		activation: "defaults"
	});
	const onlyPluginIds = params?.effectiveOnly === true ? resolveEffectivePluginIds({
		config: rawConfig,
		workspaceDir,
		env: params?.env ?? process.env,
		metadataSnapshot
	}) : params?.onlyPluginIds === void 0 ? void 0 : [...params.onlyPluginIds];
	return {
		rawConfig,
		workspace,
		workspaceDir,
		metadataSnapshot,
		context,
		runtimeCompatConfig,
		onlyPluginIds,
		runtimeLoadOptions: buildPluginRuntimeLoadOptions(context, {
			config: runtimeCompatConfig,
			activationSourceConfig: rawConfig,
			workspaceDir,
			env: params?.env,
			loadModules: true,
			cache: true,
			mode: params?.loadMode,
			onlyPluginIds,
			toolDiscovery: params?.runtimeInspection
		})
	};
}
function buildPluginReport(params, loadModules) {
	const prepared = preparePluginReport(params);
	const { rawConfig, workspaceDir, metadataSnapshot, context, runtimeCompatConfig, onlyPluginIds } = prepared;
	return projectPluginReport(loadModules ? tracePluginLifecyclePhase("runtime plugin registry load", () => loadPluginRegistryHandle(prepared.runtimeLoadOptions), {
		surface: "status",
		onlyPluginCount: onlyPluginIds?.length
	}) : tracePluginLifecyclePhase("plugin registry snapshot", () => loadPluginMetadataRegistrySnapshot({
		config: runtimeCompatConfig,
		activationSourceConfig: rawConfig,
		workspaceDir,
		env: params?.env,
		logger: params?.logger,
		loadModules: false,
		onlyPluginIds,
		manifestRegistry: metadataSnapshot.manifestRegistry,
		runtimeContext: context
	}), {
		surface: "status",
		onlyPluginCount: onlyPluginIds?.length
	}), prepared, params, loadModules);
}
function projectPluginReport(registry, prepared, params, loadModules) {
	const { workspace, workspaceDir, metadataSnapshot } = prepared;
	const importedPluginIds = /* @__PURE__ */ new Set([
		...loadModules ? registry.plugins.filter((plugin) => plugin.status === "loaded" && plugin.format !== "bundle").map((plugin) => plugin.id) : [],
		...listImportedRuntimePluginIds(),
		...listImportedBundledPluginFacadeIds()
	]);
	return projectPluginInstallHealth({
		workspaceDir,
		workspaceScope: workspace.workspaceScope,
		...registry,
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic([...registry.diagnostics], workspace),
		plugins: registry.plugins.map((plugin) => Object.assign({}, plugin, {
			imported: plugin.format !== `bundle` && importedPluginIds.has(plugin.id),
			version: resolveReportedPluginVersion(plugin, params?.env)
		}))
	}, {
		metadata: metadataSnapshot,
		config: prepared.rawConfig,
		env: params?.env
	});
}
function buildPluginSnapshotReport(params) {
	return buildPluginReport(params, false);
}
/** Complete diagnostics projection before retiring its imported plugin generation. */
async function withPluginDiagnosticsReport(params, consume) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		return await withPluginCache(cache, () => consume(buildPluginReport(params, true)));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Serializes an owned inspection before disposing its registration resources. */
async function withPluginDiagnosticsReportForInspection(params, formatReport) {
	const prepared = preparePluginReport(params);
	const inspection = await tracePluginLifecyclePhaseAsync("runtime plugin registry load", () => acquirePluginRegistryForInspection(prepared.runtimeLoadOptions), {
		surface: "status",
		onlyPluginCount: prepared.onlyPluginIds?.length
	});
	let output;
	try {
		output = formatReport(projectPluginReport(inspection.registry, prepared, params, true));
	} catch (error) {
		try {
			await inspection.release();
		} catch (disposalError) {
			throw new AggregateError([error, disposalError], "Plugin inspection report and disposal failed", { cause: disposalError });
		}
		throw error;
	}
	await inspection.release();
	return output;
}
function resolvePluginInspectContext({ report, ...params }) {
	const { config } = resolvePluginRuntimeLoadContext(params);
	return {
		report,
		entries: normalizePluginsConfig(config.plugins).entries
	};
}
function buildPluginInspectReport({ id, ...params }) {
	const context = resolvePluginInspectContext(params);
	const plugin = context.report.plugins.find((entry) => entry.id === id) ?? context.report.plugins.find((entry) => entry.name === id);
	return plugin ? buildPluginInspectRecord(plugin, context) : null;
}
function buildPluginInspectRecord(plugin, { report, entries }, rows) {
	const typedHooks = (rows?.typedHooks ?? report.typedHooks.filter((entry) => entry.pluginId === plugin.id)).map((entry) => ({
		name: entry.hookName,
		priority: entry.priority
	})).toSorted((a, b) => a.name.localeCompare(b.name));
	const customHooks = (rows?.hooks ?? report.hooks.filter((entry) => entry.pluginId === plugin.id)).map((entry) => ({
		name: entry.entry.hook.name,
		events: [...entry.events].toSorted()
	})).toSorted((a, b) => a.name.localeCompare(b.name));
	const tools = (rows?.tools ?? report.tools.filter((entry) => entry.pluginId === plugin.id)).map((entry) => ({
		names: [...entry.names],
		optional: entry.optional
	}));
	const diagnostics = rows ? [...rows.diagnostics] : report.diagnostics.filter((entry) => entry.pluginId === plugin.id);
	const policyEntry = entries[normalizePluginPolicyId(plugin.id)];
	const shapeSummary = buildPluginShapeSummary({
		plugin,
		report: rows ?? report
	});
	const shape = shapeSummary.shape;
	const gatewayMethods = (rows?.gatewayMethodDescriptors ?? (report.gatewayMethodDescriptors ?? []).filter((descriptor) => descriptor.owner.kind === "plugin" && descriptor.owner.pluginId === plugin.id)).map((descriptor) => descriptor.name);
	let mcpServers = [];
	if (plugin.rootDir) {
		const mcpSupport = plugin.format === "bundle" && plugin.bundleFormat ? inspectBundleMcpRuntimeSupport({
			pluginId: plugin.id,
			rootDir: plugin.rootDir,
			bundleFormat: plugin.bundleFormat
		}) : plugin.mcpServers ? inspectNativePluginMcpRuntimeSupport({
			rootDir: plugin.rootDir,
			mcpServers: plugin.mcpServers
		}) : void 0;
		if (mcpSupport) {
			const stdioServerNames = new Set(mcpSupport.stdioServerNames);
			mcpServers = [...mcpSupport.supportedServerNames.map((name) => ({
				name,
				hasStdioTransport: stdioServerNames.has(name)
			})), ...mcpSupport.unsupportedServerNames.map((name) => ({
				name,
				hasStdioTransport: false,
				unsupported: true
			}))];
		}
	}
	let lspServers = [];
	if (plugin.format === "bundle" && plugin.bundleFormat && plugin.rootDir) {
		const lspSupport = inspectBundleLspRuntimeSupport({
			pluginId: plugin.id,
			rootDir: plugin.rootDir,
			bundleFormat: plugin.bundleFormat
		});
		lspServers = [...lspSupport.supportedServerNames.map((name) => ({
			name,
			hasStdioTransport: true
		})), ...lspSupport.unsupportedServerNames.map((name) => ({
			name,
			hasStdioTransport: false
		}))];
	}
	const compatibility = buildCompatibilityNoticesForInspect({
		plugin,
		shape,
		diagnostics
	});
	return {
		workspaceDir: report.workspaceDir,
		plugin,
		shape,
		capabilityMode: shapeSummary.capabilityMode,
		capabilityCount: shapeSummary.capabilityCount,
		capabilities: shapeSummary.capabilities,
		typedHooks,
		customHooks,
		tools,
		commands: [...plugin.commands],
		cliCommands: [...plugin.cliCommands],
		services: [...plugin.services],
		decisions: inspectDecisionProviders(getRuntimeConfig(), report).filter((entry) => entry.pluginId === plugin.id),
		gatewayDiscoveryServices: [...plugin.gatewayDiscoveryServiceIds],
		gatewayMethods,
		mcpServers,
		lspServers,
		httpRouteCount: plugin.httpRoutes,
		bundleCapabilities: plugin.bundleCapabilities ?? [],
		diagnostics,
		policy: {
			allowPromptInjection: policyEntry?.hooks?.allowPromptInjection,
			allowConversationAccess: policyEntry?.hooks?.allowConversationAccess,
			hookTimeoutMs: policyEntry?.hooks?.timeoutMs,
			hookTimeouts: policyEntry?.hooks?.timeouts ? { ...policyEntry.hooks.timeouts } : void 0,
			allowModelOverride: policyEntry?.subagent?.allowModelOverride,
			allowedModels: [...policyEntry?.subagent?.allowedModels ?? []],
			hasAllowedModelsConfig: policyEntry?.subagent?.hasAllowedModelsConfig === true
		},
		compatibility
	};
}
function groupByPluginId(rows, getPluginId) {
	const grouped = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const pluginId = getPluginId(row);
		if (pluginId === void 0) continue;
		const group = grouped.get(pluginId);
		if (group) group.push(row);
		else grouped.set(pluginId, [row]);
	}
	return grouped;
}
function buildAllPluginInspectReports(params) {
	const context = resolvePluginInspectContext(params);
	const { report } = context;
	if (report.plugins.length < 2) return report.plugins.map((plugin) => buildPluginInspectRecord(plugin, context));
	const typedHooks = groupByPluginId(report.typedHooks, (entry) => entry.pluginId);
	const hooks = groupByPluginId(report.hooks, (entry) => entry.pluginId);
	const tools = groupByPluginId(report.tools, (entry) => entry.pluginId);
	const diagnostics = groupByPluginId(report.diagnostics, (entry) => entry.pluginId);
	const sessionCatalogs = groupByPluginId(report.sessionCatalogs, (entry) => entry.pluginId);
	const gatewayMethodDescriptors = groupByPluginId(report.gatewayMethodDescriptors ?? [], (descriptor) => descriptor.owner.kind === "plugin" ? descriptor.owner.pluginId : void 0);
	return report.plugins.map((plugin) => buildPluginInspectRecord(plugin, context, {
		typedHooks: typedHooks.get(plugin.id) ?? [],
		hooks: hooks.get(plugin.id) ?? [],
		tools: tools.get(plugin.id) ?? [],
		diagnostics: diagnostics.get(plugin.id) ?? [],
		sessionCatalogs: sessionCatalogs.get(plugin.id) ?? [],
		gatewayMethodDescriptors: gatewayMethodDescriptors.get(plugin.id) ?? []
	}));
}
function buildPluginCompatibilityWarnings(params) {
	return buildPluginCompatibilityNotices(params).map(formatPluginCompatibilityNotice);
}
function buildPluginCompatibilityNotices(params) {
	const registry = params.report;
	return registry.plugins.flatMap((plugin) => buildCompatibilityNoticesForInspect({
		plugin,
		shape: buildPluginShapeSummary({
			plugin,
			report: registry
		}).shape,
		diagnostics: registry.diagnostics.filter((entry) => entry.pluginId === plugin.id)
	}));
}
function buildPluginCompatibilitySnapshotNotices(params) {
	const report = buildPluginSnapshotReport(params);
	const context = resolvePluginRuntimeLoadContext(params);
	const runtimeRegistry = resolveCompatibleRuntimePluginRegistry(buildPluginRuntimeLoadOptions(context));
	const registeredPlugins = new Map(runtimeRegistry?.plugins.map((plugin) => [plugin.id, plugin]));
	const registrationReport = runtimeRegistry ? {
		...report,
		...runtimeRegistry,
		workspaceDir: report.workspaceDir,
		plugins: report.plugins.map((plugin) => ({
			...plugin,
			...registeredPlugins.get(plugin.id),
			imported: plugin.imported
		}))
	} : report;
	return buildPluginCompatibilityNotices({
		...params,
		report: registrationReport
	});
}
//#endregion
export { buildPluginInspectReport as a, withPluginDiagnosticsReportForInspection as c, buildPluginCompatibilityWarnings as i, buildPluginCompatibilityNotices as n, buildPluginSnapshotReport as o, buildPluginCompatibilitySnapshotNotices as r, withPluginDiagnosticsReport as s, buildAllPluginInspectReports as t };

import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-BEWeG-Rv.mjs";
import { o as tracePluginLifecyclePhase, s as tracePluginLifecyclePhaseAsync } from "./discovery-D_5mAUI7.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-KhFe5dXK.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as formatMissingPluginMessage } from "./error-format-B21fL1a_.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { n as formatPluginTrustDiagnostic } from "./plugin-trust-Czz4RpQ5.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { t as quietPluginJsonLogger } from "./plugins-json-logger-D7ZlRw7s.mjs";
import { r as formatPluginStatus, t as formatPluginBundleFormat } from "./plugins-list-format-Cf7KDhp5.mjs";
//#region src/cli/plugins-inspect-command.ts
function failPluginInspect(message, json) {
	if (json) defaultRuntime.writeJson(formatCliJsonFailure(message));
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
}
function formatGlobalPluginDiagnostics(diagnostics) {
	const lines = [];
	for (const { pluginId, level, message } of diagnostics) if (!pluginId) {
		const line = formatConsoleDiagnosticLine({
			level,
			message: shortenHomeInString(`${level.toUpperCase()}: ${message}`)
		});
		lines.push(`${line}\n`);
	}
	return lines.join("");
}
function formatInspectSection(title, lines) {
	if (lines.length === 0) return [];
	return [
		"",
		theme.muted(`${title}:`),
		...lines
	];
}
function formatCapabilityKinds(capabilities) {
	if (capabilities.length === 0) return "-";
	return capabilities.map((entry) => entry.kind).join(", ");
}
function formatHookSummary(params) {
	const parts = [];
	if (params.typedHookCount > 0) parts.push(`${params.typedHookCount} typed`);
	if (params.customHookCount > 0) parts.push(`${params.customHookCount} custom`);
	return parts.length > 0 ? parts.join(", ") : "-";
}
function formatInstallLines(install) {
	if (!install) return [];
	const lines = [`Source: ${install.source}`];
	if (install.spec) lines.push(`Spec: ${install.spec}`);
	if (install.sourcePath) lines.push(`Source path: ${shortenHomePath(install.sourcePath)}`);
	if (install.installPath) lines.push(`Install path: ${shortenHomePath(install.installPath)}`);
	if (install.version) lines.push(`Recorded version: ${install.version}`);
	if (install.clawhubPackage) lines.push(`ClawHub package: ${install.clawhubPackage}`);
	if (install.clawhubChannel) lines.push(`ClawHub channel: ${install.clawhubChannel}`);
	if (install.artifactKind) lines.push(`Artifact kind: ${install.artifactKind}`);
	if (install.artifactFormat) lines.push(`Artifact format: ${install.artifactFormat}`);
	if (install.npmIntegrity) lines.push(`Npm integrity: ${install.npmIntegrity}`);
	if (install.npmShasum) lines.push(`Npm shasum: ${install.npmShasum}`);
	if (install.npmTarballName) lines.push(`Npm tarball: ${install.npmTarballName}`);
	if (install.clawpackSha256) lines.push(`ClawPack sha256: ${install.clawpackSha256}`);
	if (install.clawpackSpecVersion !== void 0) lines.push(`ClawPack spec: ${install.clawpackSpecVersion}`);
	if (install.clawpackManifestSha256) lines.push(`ClawPack manifest sha256: ${install.clawpackManifestSha256}`);
	if (install.clawpackSize !== void 0) lines.push(`ClawPack size: ${install.clawpackSize} bytes`);
	if (install.installedAt) lines.push(`Installed at: ${install.installedAt}`);
	return lines;
}
/** Inspect one plugin or all plugins using either snapshot-only or runtime-loaded registry data. */
async function runPluginsInspectCommand(id, opts) {
	const { buildAllPluginInspectReports, withPluginDiagnosticsReportForInspection, buildPluginInspectReport, buildPluginSnapshotReport, formatPluginCompatibilityNotice } = await import("./status-DhiigEUV.mjs");
	const { loadPluginMetadataSnapshot } = await import("./plugin-metadata-snapshot-AIcOW-fO.mjs");
	const cfg = tracePluginLifecyclePhase("config read", () => getRuntimeConfig(), { command: "inspect" });
	const { workspaceDir } = resolvePluginControlPlaneWorkspace({ config: cfg });
	const metadataSnapshot = tracePluginLifecyclePhase("plugin metadata load", () => loadPluginMetadataSnapshot({
		config: cfg,
		workspaceDir
	}), { command: "inspect" });
	const ownershipResolver = createInstalledPluginOwnershipResolver(metadataSnapshot.index);
	const resolveInstallRecord = (pluginId) => {
		const ownership = ownershipResolver.resolvePackage(pluginId);
		return ownership.ok ? ownership.value.installRecord : void 0;
	};
	const loggerParams = opts.json ? { logger: quietPluginJsonLogger } : {};
	const runtimeInspect = opts.runtime === true;
	const reportParams = {
		config: cfg,
		metadataSnapshot,
		...loggerParams
	};
	const runtimeReportParams = {
		...reportParams,
		runtimeInspection: true
	};
	let globalDiagnostics = "";
	if (opts.all) {
		if (id) {
			failPluginInspect("Pass either a plugin id or --all, not both.", opts.json);
			return;
		}
		const formatReport = (report) => {
			globalDiagnostics = formatGlobalPluginDiagnostics(report.diagnostics);
			const inspectAll = buildAllPluginInspectReports({
				config: cfg,
				...loggerParams,
				report
			});
			if (opts.json) {
				const inspectAllWithInstall = inspectAll.map((inspect) => ({
					...inspect,
					install: resolveInstallRecord(inspect.plugin.id)
				}));
				return JSON.stringify(inspectAllWithInstall, null, 2);
			}
			const tableWidth = getTerminalTableWidth();
			const rows = inspectAll.map((inspect) => ({
				Name: inspect.plugin.name || inspect.plugin.id,
				ID: inspect.plugin.name && inspect.plugin.name !== inspect.plugin.id ? inspect.plugin.id : "",
				Status: formatPluginStatus(inspect.plugin, runtimeInspect),
				Shape: inspect.shape,
				Capabilities: formatCapabilityKinds(inspect.capabilities),
				Compatibility: inspect.compatibility.length > 0 ? inspect.compatibility.map((entry) => entry.severity === "warn" ? `warn:${entry.code}` : entry.code).join(", ") : "none",
				Bundle: inspect.bundleCapabilities.length > 0 ? inspect.bundleCapabilities.join(", ") : "-",
				Hooks: formatHookSummary({
					typedHookCount: inspect.typedHooks.length,
					customHookCount: inspect.customHooks.length
				})
			}));
			return renderTable({
				width: tableWidth,
				columns: [
					{
						key: "Name",
						header: "Name",
						minWidth: 14,
						flex: true
					},
					{
						key: "ID",
						header: "ID",
						minWidth: 10,
						flex: true
					},
					{
						key: "Status",
						header: "Status",
						minWidth: 10
					},
					{
						key: "Shape",
						header: "Shape",
						minWidth: 18
					},
					{
						key: "Capabilities",
						header: "Capabilities",
						minWidth: 28,
						flex: true
					},
					{
						key: "Compatibility",
						header: "Compatibility",
						minWidth: 24,
						flex: true
					},
					{
						key: "Bundle",
						header: "Bundle",
						minWidth: 14,
						flex: true
					},
					{
						key: "Hooks",
						header: "Hooks",
						minWidth: 20,
						flex: true
					}
				],
				rows
			}).trimEnd();
		};
		const output = runtimeInspect ? await tracePluginLifecyclePhaseAsync("runtime plugin registry load", () => withPluginDiagnosticsReportForInspection(runtimeReportParams, formatReport), {
			command: "inspect",
			all: true
		}) : formatReport(tracePluginLifecyclePhase("plugin registry snapshot", () => buildPluginSnapshotReport(reportParams), {
			command: "inspect",
			all: true
		}));
		process.stderr.write(globalDiagnostics);
		if (opts.json) defaultRuntime.writeStdout(output);
		else defaultRuntime.log(output);
		return;
	}
	if (!id) {
		failPluginInspect("Provide a plugin id or use --all.", opts.json);
		return;
	}
	const snapshotReport = tracePluginLifecyclePhase("plugin registry snapshot", () => buildPluginSnapshotReport(reportParams), { command: "inspect" });
	const targetPlugin = snapshotReport.plugins.find((entry) => entry.id === id) ?? snapshotReport.plugins.find((entry) => entry.name === id);
	if (!targetPlugin) {
		process.stderr.write(formatGlobalPluginDiagnostics(snapshotReport.diagnostics));
		if (id === "skill-workshop") {
			const { detectSkillWorkshopToolPolicyDiagnostic } = await import("./tool-policy-diagnostic-7e6ZBVcu.mjs");
			const agentIds = listAgentIds(cfg);
			const lines = ["Skill Workshop is built into OpenClaw, not a plugin; configure it under skills.workshop."];
			for (const agentId of agentIds.length > 0 ? agentIds : [void 0]) {
				const diagnostic = detectSkillWorkshopToolPolicyDiagnostic({
					config: cfg,
					workshopEnabled: true,
					...agentId ? { agentId } : {}
				});
				if (diagnostic) lines.push(diagnostic.message);
			}
			failPluginInspect(lines.join("\n"), opts.json);
			return;
		}
		failPluginInspect(formatMissingPluginMessage({
			id,
			includeSearch: true
		}), opts.json);
		return;
	}
	const formatReport = (report) => {
		globalDiagnostics = formatGlobalPluginDiagnostics(report.diagnostics);
		const inspect = buildPluginInspectReport({
			id: targetPlugin.id,
			config: cfg,
			...loggerParams,
			report
		});
		if (inspect) return formatPluginInspection(inspect, resolveInstallRecord(inspect.plugin.id), opts, formatPluginCompatibilityNotice);
	};
	const output = runtimeInspect ? await tracePluginLifecyclePhaseAsync("runtime plugin registry load", () => withPluginDiagnosticsReportForInspection({
		...runtimeReportParams,
		onlyPluginIds: [targetPlugin.id]
	}, formatReport), {
		command: "inspect",
		pluginId: targetPlugin.id
	}) : formatReport(snapshotReport);
	process.stderr.write(globalDiagnostics);
	if (output === void 0) failPluginInspect(formatMissingPluginMessage({
		id,
		listCommand: "openclaw plugins list --json"
	}), opts.json);
	else if (opts.json) defaultRuntime.writeStdout(output);
	else defaultRuntime.log(output);
}
function formatPluginInspection(inspect, install, opts, formatPluginCompatibilityNotice) {
	const runtimeInspect = opts.runtime === true;
	if (opts.json) return JSON.stringify({
		...inspect,
		install
	}, null, 2);
	const lines = [];
	lines.push(theme.heading(inspect.plugin.name || inspect.plugin.id));
	if (inspect.plugin.name && inspect.plugin.name !== inspect.plugin.id) lines.push(theme.muted(`id: ${inspect.plugin.id}`));
	if (inspect.plugin.description) lines.push(inspect.plugin.description);
	lines.push("");
	lines.push(`${theme.muted("Status:")} ${formatPluginStatus(inspect.plugin, runtimeInspect)}`);
	if (inspect.plugin.failurePhase) lines.push(`${theme.muted("Failure phase:")} ${inspect.plugin.failurePhase}`);
	if (inspect.plugin.failedAt) lines.push(`${theme.muted("Failed at:")} ${inspect.plugin.failedAt.toISOString()}`);
	lines.push(`${theme.muted("Format:")} ${inspect.plugin.format ?? "openclaw"}`);
	if (inspect.plugin.bundleFormat) lines.push(`${theme.muted("Bundle format:")} ${formatPluginBundleFormat(inspect.plugin.bundleFormat)}`);
	lines.push(`${theme.muted("Source:")} ${shortenHomePath(inspect.plugin.source)}`);
	lines.push(`${theme.muted("Origin:")} ${inspect.plugin.origin}`);
	if (inspect.plugin.trust) lines.push(`${theme.muted("Trust:")} ${formatPluginTrustDiagnostic(inspect.plugin.trust)}`);
	if (inspect.plugin.version) lines.push(`${theme.muted("Version:")} ${inspect.plugin.version}`);
	lines.push(`${theme.muted("Shape:")} ${inspect.shape}`);
	lines.push(`${theme.muted("Capability mode:")} ${inspect.capabilityMode}`);
	if (inspect.bundleCapabilities.length > 0) lines.push(`${theme.muted("Bundle capabilities:")} ${inspect.bundleCapabilities.join(", ")}`);
	lines.push(...formatInspectSection("Capabilities", inspect.capabilities.map((entry) => `${entry.kind}: ${entry.ids.length > 0 ? entry.ids.join(", ") : "(registered)"}`)));
	lines.push(...formatInspectSection("Typed hooks", inspect.typedHooks.map((entry) => entry.priority == null ? entry.name : `${entry.name} (priority ${entry.priority})`)));
	lines.push(...formatInspectSection("Compatibility warnings", inspect.compatibility.map(formatPluginCompatibilityNotice)));
	lines.push(...formatInspectSection("Custom hooks", inspect.customHooks.map((entry) => `${entry.name}: ${entry.events.join(", ")}`)));
	lines.push(...formatInspectSection("Tools", inspect.tools.map((entry) => {
		const names = entry.names.length > 0 ? entry.names.join(", ") : "(anonymous)";
		return entry.optional ? `${names} [optional]` : names;
	})));
	lines.push(...formatInspectSection("Commands", inspect.commands));
	lines.push(...formatInspectSection("CLI commands", inspect.cliCommands));
	lines.push(...formatInspectSection("Services", inspect.services));
	lines.push(...formatInspectSection("Gateway discovery", inspect.gatewayDiscoveryServices));
	lines.push(...formatInspectSection("Gateway methods", inspect.gatewayMethods ?? []));
	lines.push(...formatInspectSection("MCP servers", inspect.mcpServers.map((entry) => entry.unsupported ? `${entry.name} (unsupported transport)` : entry.name)));
	lines.push(...formatInspectSection("LSP servers", inspect.lspServers.map((entry) => entry.hasStdioTransport ? entry.name : `${entry.name} (unsupported transport)`)));
	if (inspect.httpRouteCount > 0) lines.push(...formatInspectSection("HTTP routes", [String(inspect.httpRouteCount)]));
	const policyLines = [];
	if (typeof inspect.policy.allowPromptInjection === "boolean") policyLines.push(`allowPromptInjection: ${inspect.policy.allowPromptInjection}`);
	if (typeof inspect.policy.allowConversationAccess === "boolean") policyLines.push(`allowConversationAccess: ${inspect.policy.allowConversationAccess}`);
	if (typeof inspect.policy.allowModelOverride === "boolean") policyLines.push(`allowModelOverride: ${inspect.policy.allowModelOverride}`);
	if (inspect.policy.hasAllowedModelsConfig) policyLines.push(`allowedModels: ${inspect.policy.allowedModels.length > 0 ? inspect.policy.allowedModels.join(", ") : "(configured but empty)"}`);
	lines.push(...formatInspectSection("Policy", policyLines));
	lines.push(...formatInspectSection("Diagnostics", inspect.diagnostics.map((entry) => `${entry.level.toUpperCase()}: ${entry.message}`)));
	lines.push(...formatInspectSection("Install", formatInstallLines(install)));
	if (inspect.plugin.error) {
		const label = inspect.plugin.status === "error" ? theme.error("Error:") : theme.muted("Reason:");
		lines.push("", `${label} ${inspect.plugin.error}`);
	}
	return lines.join("\n");
}
//#endregion
export { runPluginsInspectCommand };

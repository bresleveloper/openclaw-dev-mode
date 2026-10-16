import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-DIE6i1JG.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as tracePluginLifecyclePhaseAsync, s as tracePluginLifecyclePhase } from "./discovery-Dma3bVNk.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BSuk9I48.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { n as formatPluginTrustDiagnostic } from "./plugin-trust-DPp6imOi.mjs";
import { a as formatMissingPluginMessage } from "./error-format-BaRMqGR7.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as quietPluginJsonLogger } from "./plugins-json-logger-D7ZlRw7s.mjs";
import { r as formatPluginStatus, t as formatPluginBundleFormat } from "./plugins-list-format-wk6vj73K.mjs";
//#region src/cli/plugins-inspect-command.ts
function failPluginInspect(message, json) {
	if (json) defaultRuntime.writeJson(formatCliJsonFailure(message));
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
}
function formatGlobalPluginDiagnostics(diagnostics) {
	return diagnostics.filter(({ pluginId }) => !pluginId).map(({ level, message }) => `${formatConsoleDiagnosticLine({
		level,
		message: shortenHomeInString(`${level.toUpperCase()}: ${message}`)
	})}\n`).join("");
}
function formatInstallLines(install) {
	if (!install) return [];
	const lines = [`Source: ${install.source}`];
	for (const [label, value] of [
		["Spec", install.spec],
		["Source path", install.sourcePath ? shortenHomePath(install.sourcePath) : void 0],
		["Install path", install.installPath ? shortenHomePath(install.installPath) : void 0],
		["Recorded version", install.version],
		["ClawHub package", install.clawhubPackage],
		["ClawHub channel", install.clawhubChannel],
		["Artifact kind", install.artifactKind],
		["Artifact format", install.artifactFormat],
		["Npm integrity", install.npmIntegrity],
		["Npm shasum", install.npmShasum],
		["Npm tarball", install.npmTarballName],
		["ClawPack sha256", install.clawpackSha256],
		["ClawPack spec", install.clawpackSpecVersion === void 0 ? void 0 : String(install.clawpackSpecVersion)],
		["ClawPack manifest sha256", install.clawpackManifestSha256],
		["ClawPack size", install.clawpackSize === void 0 ? void 0 : `${install.clawpackSize} bytes`],
		["Installed at", install.installedAt]
	]) if (value) lines.push(`${label}: ${value}`);
	return lines;
}
/** Inspect one plugin or all plugins using either snapshot-only or runtime-loaded registry data. */
async function runPluginsInspectCommand(id, opts) {
	const { buildAllPluginInspectReports, withPluginDiagnosticsReportForInspection, buildPluginInspectReport, buildPluginSnapshotReport, formatPluginCompatibilityNotice } = await import("./status-Cu30gdYD.mjs");
	const { loadPluginMetadataSnapshot } = await import("./plugin-metadata-snapshot-DcoK08YM.mjs");
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
				Capabilities: inspect.capabilities.length > 0 ? inspect.capabilities.map((entry) => entry.kind).join(", ") : "-",
				Compatibility: inspect.compatibility.length > 0 ? inspect.compatibility.map((entry) => entry.severity === "warn" ? `warn:${entry.code}` : entry.code).join(", ") : "none",
				Bundle: inspect.bundleCapabilities.length > 0 ? inspect.bundleCapabilities.join(", ") : "-",
				Hooks: [inspect.typedHooks.length > 0 ? `${inspect.typedHooks.length} typed` : "", inspect.customHooks.length > 0 ? `${inspect.customHooks.length} custom` : ""].filter(Boolean).join(", ") || "-"
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
			const { detectSkillWorkshopToolPolicyDiagnostic } = await import("./tool-policy-diagnostic-BhqNgiuc.mjs");
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
	const appendSection = (title, content) => {
		if (content.length > 0) lines.push("", theme.muted(`${title}:`), ...content);
	};
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
	appendSection("Capabilities", inspect.capabilities.map((entry) => `${entry.kind}: ${entry.ids.length > 0 ? entry.ids.join(", ") : "(registered)"}`));
	appendSection("Typed hooks", inspect.typedHooks.map((entry) => entry.priority == null ? entry.name : `${entry.name} (priority ${entry.priority})`));
	appendSection("Compatibility warnings", inspect.compatibility.map(formatPluginCompatibilityNotice));
	appendSection("Custom hooks", inspect.customHooks.map((entry) => `${entry.name}: ${entry.events.join(", ")}`));
	appendSection("Tools", inspect.tools.map((entry) => {
		const names = entry.names.length > 0 ? entry.names.join(", ") : "(anonymous)";
		return entry.optional ? `${names} [optional]` : names;
	}));
	appendSection("Commands", inspect.commands);
	appendSection("CLI commands", inspect.cliCommands);
	appendSection("Services", inspect.services);
	appendSection("Gateway discovery", inspect.gatewayDiscoveryServices);
	appendSection("Gateway methods", inspect.gatewayMethods ?? []);
	appendSection("MCP servers", inspect.mcpServers.map((entry) => entry.unsupported ? `${entry.name} (unsupported transport)` : entry.name));
	appendSection("LSP servers", inspect.lspServers.map((entry) => entry.hasStdioTransport ? entry.name : `${entry.name} (unsupported transport)`));
	if (inspect.httpRouteCount > 0) appendSection("HTTP routes", [String(inspect.httpRouteCount)]);
	const policyLines = [];
	for (const key of [
		"allowPromptInjection",
		"allowConversationAccess",
		"allowModelOverride"
	]) if (typeof inspect.policy[key] === "boolean") policyLines.push(`${key}: ${inspect.policy[key]}`);
	if (inspect.policy.hasAllowedModelsConfig) policyLines.push(`allowedModels: ${inspect.policy.allowedModels.length > 0 ? inspect.policy.allowedModels.join(", ") : "(configured but empty)"}`);
	appendSection("Policy", policyLines);
	appendSection("Diagnostics", inspect.diagnostics.map((entry) => `${entry.level.toUpperCase()}: ${entry.message}`));
	appendSection("Install", formatInstallLines(install));
	if (inspect.plugin.error) {
		const label = inspect.plugin.status === "error" ? theme.error("Error:") : theme.muted("Reason:");
		lines.push("", `${label} ${inspect.plugin.error}`);
	}
	return lines.join("\n");
}
//#endregion
export { runPluginsInspectCommand };

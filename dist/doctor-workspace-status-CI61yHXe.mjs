import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { c as resolveOpenClawReleaseCohortVersion } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { i as resolvePluginVersionDriftRegistryLag, o as resolvePluginVersionDriftUpdateCommand } from "./plugin-version-drift-BsJ4AHQ4.mjs";
import { i as buildPluginCompatibilityWarnings } from "./status-D6dbcWPJ.mjs";
import { t as buildPluginRegistrySnapshotReport } from "./status-snapshot-DxVlNIA-.mjs";
//#region src/commands/doctor-workspace-status.ts
const WORKSPACE_STATUS_CHECK_ID = "core/doctor/workspace-status";
function claimPluginDiagnostic(seen, diagnostic) {
	const key = [
		diagnostic.level,
		diagnostic.pluginId ?? "",
		diagnostic.code ?? "",
		diagnostic.errorCode ?? "",
		diagnostic.source ?? "",
		diagnostic.message
	].map((value) => `${value.length}:${value}`).join("");
	if (seen.has(key)) return false;
	seen.add(key);
	return true;
}
function pluginVersionReadinessToHealthFindings(readiness) {
	if (!readiness) return [];
	if (readiness.status === "unresolved") return [{
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: "warning",
		message: `Could not check plugin restart readiness: ${readiness.reason}`,
		path: "plugins",
		requirement: "plugin-version-restart-readiness",
		fixHint: "Repair the Gateway service installation, then rerun openclaw doctor before restarting."
	}];
	const { report: drift, runningGatewayVersion } = readiness;
	if (drift.drifts.length === 0) {
		if (!isGatewayRestartPending(drift, runningGatewayVersion)) return [];
		return [{
			checkId: WORKSPACE_STATUS_CHECK_ID,
			severity: "warning",
			message: `Active official plugins match post-restart OpenClaw ${drift.gatewayVersion}, but the running Gateway is ${runningGatewayVersion}.`,
			path: "plugins",
			requirement: "plugin-version-gateway-restart",
			fixHint: formatCliCommand("openclaw gateway restart")
		}];
	}
	return drift.drifts.map((entry) => {
		const registryLag = resolvePluginVersionDriftRegistryLag(entry);
		if (registryLag) return {
			checkId: WORKSPACE_STATUS_CHECK_ID,
			severity: "info",
			message: `Plugin ${entry.pluginId} is ${entry.installedVersion} and its registry publishes no newer release (registry version ${registryLag.registryVersion}), but a Gateway restart will load OpenClaw ${drift.gatewayVersion}.${runningGatewayVersion ? ` The running Gateway is ${runningGatewayVersion}.` : ""} No plugin update can reach ${registryLag.expectedVersion}.`,
			path: `plugins.entries.${entry.pluginId}`,
			target: entry.pluginId,
			requirement: "plugin-version-drift"
		};
		const updateCommand = resolvePluginVersionDriftUpdateCommand(entry);
		const targetResolution = entry.targetResolution;
		const targetError = targetResolution?.status === "unresolved" ? targetResolution.error : "npm registry target was not resolved";
		return {
			checkId: WORKSPACE_STATUS_CHECK_ID,
			severity: "warning",
			message: `Plugin ${entry.pluginId} is ${entry.installedVersion}, but a Gateway restart will load OpenClaw ${drift.gatewayVersion}.${targetResolution?.status === "resolved" ? ` The confirmed plugin target is ${targetResolution.version}.` : ""}${runningGatewayVersion ? ` The running Gateway is ${runningGatewayVersion}.` : ""}${updateCommand ? "" : ` Repair target resolution failed: ${targetError}.`}`,
			path: `plugins.entries.${entry.pluginId}`,
			target: entry.pluginId,
			requirement: "plugin-version-drift",
			fixHint: updateCommand ? `${formatCliCommand(updateCommand)} && ${formatCliCommand("openclaw gateway restart")}` : `No install command generated; retry openclaw doctor after checking registry availability (${targetError}).`
		};
	});
}
function isGatewayRestartPending(drift, runningGatewayVersion) {
	return Boolean(runningGatewayVersion && resolveOpenClawReleaseCohortVersion(runningGatewayVersion) !== resolveOpenClawReleaseCohortVersion(drift.gatewayVersion));
}
function pluginCompatibilityWarningToHealthFinding(message) {
	return {
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: "warning",
		message,
		path: "plugins",
		requirement: "plugin-compatibility",
		fixHint: "Update or replace the plugin so it no longer depends on legacy compatibility paths."
	};
}
function pluginDiagnosticToHealthFinding(diagnostic, message = diagnostic.message) {
	return {
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: diagnostic.level === "warn" ? "warning" : diagnostic.level,
		message,
		...diagnostic.pluginId ? {
			path: `plugins.entries.${diagnostic.pluginId}`,
			target: diagnostic.pluginId
		} : {},
		...diagnostic.source ? { source: diagnostic.source } : {},
		...diagnostic.errorCode ? { errorCode: diagnostic.errorCode } : {},
		requirement: diagnostic.code || "plugin-diagnostic"
	};
}
/** Runtime failures belong to this Doctor run, independently of metadata-only inventory. */
function collectPluginLoadHealthFindings(diagnostics) {
	const seen = /* @__PURE__ */ new Set();
	return diagnostics.filter((diagnostic) => claimPluginDiagnostic(seen, diagnostic)).map((diagnostic) => pluginDiagnosticToHealthFinding(diagnostic, `Plugin ${diagnostic.pluginId}: ${diagnostic.message}${diagnostic.errorCode ? ` [${diagnostic.errorCode}]` : ""} (${diagnostic.source})`));
}
function visitWorkspacePluginStatus(cfg, options, visit) {
	const agentIds = listAgentIds(cfg);
	const scopes = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
	const reportedPluginDiagnostics = /* @__PURE__ */ new Set();
	for (const { agentId, workspaceDir } of scopes) {
		const inspect = () => {
			const registry = buildPluginRegistrySnapshotReport({
				config: cfg,
				workspaceDir
			});
			const compatibilityWarnings = buildPluginCompatibilityWarnings({
				config: cfg,
				workspaceDir,
				report: registry
			});
			visit({
				agentLabel: agentIds.length > 1 ? `Agent "${agentId}":` : "",
				registry,
				compatibilityWarnings,
				diagnostics: registry.diagnostics.filter((diagnostic) => claimPluginDiagnostic(reportedPluginDiagnostics, diagnostic))
			});
		};
		if (options.runWithPluginMetadataSnapshot) options.runWithPluginMetadataSnapshot({
			config: cfg,
			workspaceDir
		}, inspect);
		else inspect();
	}
	return scopes;
}
function collectWorkspaceStatusHealthFindings(cfg, options = {}) {
	const workspaceFindings = [];
	visitWorkspacePluginStatus(cfg, options, ({ agentLabel, compatibilityWarnings, diagnostics }) => {
		const prefix = agentLabel ? `${agentLabel} ` : "";
		workspaceFindings.push(...compatibilityWarnings.map((message) => pluginCompatibilityWarningToHealthFinding(`${prefix}${message}`)), ...diagnostics.map((diagnostic) => pluginDiagnosticToHealthFinding(diagnostic, `${prefix}${diagnostic.message}`)));
	});
	return [...pluginVersionReadinessToHealthFindings(options.pluginVersionReadiness), ...workspaceFindings];
}
function notePluginVersionReadiness(readiness) {
	if (!readiness) return;
	if (readiness.status === "unresolved") {
		const running = readiness.runningGatewayVersion ? `\nRunning Gateway: OpenClaw ${readiness.runningGatewayVersion}` : "";
		note(`${readiness.reason}${running}\nRepair the Gateway service installation, then rerun openclaw doctor before restarting.`, "Plugin restart readiness");
		return;
	}
	const drift = readiness.report;
	if (drift.drifts.length === 0) {
		if (!isGatewayRestartPending(drift, readiness.runningGatewayVersion)) return;
		note([
			`Running Gateway: OpenClaw ${readiness.runningGatewayVersion}`,
			`Active official plugins match post-restart OpenClaw ${drift.gatewayVersion}.`,
			`Fix: ${formatCliCommand("openclaw gateway restart")}.`
		].join("\n"), "Plugin restart readiness");
		return;
	}
	const singleDrift = drift.drifts.length === 1 ? drift.drifts[0] : void 0;
	const repairs = drift.drifts.map((entry) => ({
		entry,
		command: resolvePluginVersionDriftUpdateCommand(entry)
	}));
	const updateCommands = repairs.map(({ command }) => command).filter((command) => Boolean(command)).map((command) => formatCliCommand(command));
	const registryLagRepairs = repairs.filter(({ entry }) => Boolean(resolvePluginVersionDriftRegistryLag(entry)));
	const unresolvedRepairs = repairs.filter(({ entry, command }) => !command && !resolvePluginVersionDriftRegistryLag(entry));
	const lines = [
		...readiness.runningGatewayVersion ? [`Running Gateway: OpenClaw ${readiness.runningGatewayVersion}`] : [],
		`${drift.drifts.length} active official plugin${drift.drifts.length === 1 ? "" : "s"} not on post-restart OpenClaw ${drift.gatewayVersion}`,
		...drift.drifts.map((entry) => {
			const sourceLabel = entry.source === "clawhub" ? "clawhub" : "npm";
			const expectedVersion = entry.targetResolution?.status === "resolved" ? entry.targetResolution.version : drift.gatewayVersion;
			return `- ${entry.pluginId}: ${entry.installedVersion} (${sourceLabel}) -> expected ${expectedVersion}`;
		}),
		...registryLagRepairs.map(({ entry }) => {
			const registryLag = resolvePluginVersionDriftRegistryLag(entry);
			return `${entry.pluginId} already holds registry version ${registryLag?.registryVersion}; no release reaches ${registryLag?.expectedVersion} yet, so no update command applies.`;
		}),
		...unresolvedRepairs.map(({ entry }) => {
			const targetResolution = entry.targetResolution;
			const detail = targetResolution?.status === "unresolved" ? targetResolution.error : "npm registry target was not resolved";
			return `Repair target resolution failed for ${entry.pluginId}: ${detail}. No install command generated.`;
		}),
		singleDrift && updateCommands.length === 1 ? `Fix: ${updateCommands[0]} && ${formatCliCommand("openclaw gateway restart")}.` : updateCommands.length > 0 ? [
			"Fix each drifted plugin:",
			...updateCommands.map((command) => `- ${command}`),
			...unresolvedRepairs.length === 0 ? [`Then run ${formatCliCommand("openclaw gateway restart")}.`] : []
		].join("\n") : null
	];
	note(lines.filter((line) => Boolean(line)).join("\n"), "Plugin restart readiness");
}
function noteWorkspaceStatus(cfg, options = {}) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const scopes = visitWorkspacePluginStatus(cfg, options, ({ agentLabel, registry, compatibilityWarnings, diagnostics }) => {
		const prefix = agentLabel ? `${agentLabel}\n` : "";
		const errored = registry.plugins.filter((plugin) => plugin.status === "error").toSorted((a, b) => a.id.localeCompare(b.id));
		if (errored.length > 0) {
			const lines = [`${prefix}Errors: ${errored.length}`, `- ${errored.slice(0, 10).map((plugin) => plugin.id).join("\n- ")}${errored.length > 10 ? "\n- ..." : ""}`];
			note(lines.join("\n"), "Plugins");
		}
		if (compatibilityWarnings.length > 0) note(`${prefix}${compatibilityWarnings.map((line) => `- ${line}`).join("\n")}`, "Plugin compatibility");
		if (diagnostics.length > 0) {
			const lines = diagnostics.map((diag) => {
				const level = diag.level.toUpperCase();
				const plugin = diag.pluginId ? ` ${diag.pluginId}` : "";
				const source = diag.source ? ` (${diag.source})` : "";
				return `- ${level}${plugin}: ${diag.message}${source}`;
			});
			note(`${prefix}${lines.join("\n")}`, "Plugin diagnostics");
		}
	});
	notePluginVersionReadiness(options.pluginVersionReadiness);
	return { workspaceDir: scopes.find((scope) => scope.agentId === defaultAgentId)?.workspaceDir ?? scopes[0]?.workspaceDir };
}
//#endregion
export { collectPluginLoadHealthFindings, collectWorkspaceStatusHealthFindings, noteWorkspaceStatus };

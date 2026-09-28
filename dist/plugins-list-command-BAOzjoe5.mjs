import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as quietPluginJsonLogger } from "./plugins-json-logger-D7ZlRw7s.mjs";
//#region src/cli/plugins-list-command.ts
function toPluginListJsonRecord(plugin) {
	const { agentHarnessIds: _agentHarnessIds, ...record } = plugin;
	return record;
}
async function loadHumanListModules() {
	const [sourceDisplay, table, themeModule, commandFormat, listFormat] = await Promise.all([
		import("./source-display-Cr4lShAr.mjs"),
		import("./terminal-core/table.js"),
		import("./terminal-core/theme.js"),
		import("./command-format-BWFOOPTU.mjs"),
		import("./plugins-list-format-8e1CeJex.mjs")
	]);
	return {
		formatPluginLine: listFormat.formatPluginLine,
		formatPluginStatus: listFormat.formatPluginStatus,
		formatPluginSourceForTable: sourceDisplay.formatPluginSourceForTable,
		formatCliCommand: commandFormat.formatCliCommand,
		getTerminalTableWidth: table.getTerminalTableWidth,
		renderTable: table.renderTable,
		resolvePluginSourceRoots: sourceDisplay.resolvePluginSourceRoots,
		theme: themeModule.theme
	};
}
/** Render installed plugin discovery state as JSON, compact table, or verbose text. */
async function runPluginsListCommand(opts, runtime = defaultRuntime) {
	const { buildPluginRegistrySnapshotReport } = await import("./status-snapshot-DUI1-VNO.mjs");
	const cfg = getRuntimeConfig({ skipPluginValidation: true });
	const report = buildPluginRegistrySnapshotReport({
		config: cfg,
		...opts.json ? { logger: quietPluginJsonLogger } : {}
	});
	const list = opts.enabled ? report.plugins.filter((p) => p.enabled) : report.plugins;
	if (opts.json) {
		const payload = {
			workspaceDir: report.workspaceDir,
			workspaceScope: report.workspaceScope,
			registry: {
				source: report.registrySource,
				diagnostics: report.registryDiagnostics
			},
			plugins: list.map(toPluginListJsonRecord),
			diagnostics: report.diagnostics
		};
		writeRuntimeJson(runtime, payload);
		return;
	}
	const { formatCliCommand, formatPluginLine, formatPluginStatus, formatPluginSourceForTable, getTerminalTableWidth, renderTable, resolvePluginSourceRoots, theme } = await loadHumanListModules();
	const diagnostics = [...report.diagnostics, ...report.registryDiagnostics].filter((diagnostic) => diagnostic.level !== "info" && (diagnostic.level !== "error" || !list.some((plugin) => plugin.status === "error" && plugin.error === diagnostic.message)));
	for (const { level, message } of diagnostics) {
		const format = level === "error" ? theme.error : theme.warn;
		runtime.log(format(`${level === "error" ? "Error" : "Warning"}: ${message}`));
	}
	if (diagnostics.length > 0) runtime.log("");
	if (list.length === 0) {
		const message = opts.enabled && report.plugins.length > 0 ? `${cfg.plugins?.enabled === false ? "No enabled plugins found. Plugins are globally disabled." : "No enabled plugins found."} Run ${formatCliCommand("openclaw plugins list")} to inspect installed plugins.` : `No plugins found. Run ${formatCliCommand("openclaw plugins install <plugin>")} to add one, or ${formatCliCommand("openclaw plugins list --json")} to inspect raw discovery state.`;
		runtime.log(theme.muted(message));
		return;
	}
	const enabled = list.reduce((count, plugin) => count + (plugin.enabled ? 1 : 0), 0);
	runtime.log(`${theme.heading("Plugins")} ${theme.muted(`(${enabled}/${list.length} enabled)`)}`);
	if (!opts.verbose) {
		const tableWidth = getTerminalTableWidth();
		const sourceRoots = resolvePluginSourceRoots({ workspaceDir: report.workspaceDir });
		const usedRoots = /* @__PURE__ */ new Set();
		const rows = list.map((plugin) => {
			const error = plugin.status === "error" && plugin.error;
			const desc = error ? theme.error(error) : theme.muted(plugin.description ?? "");
			const formattedSource = formatPluginSourceForTable(plugin, sourceRoots);
			if (formattedSource.rootKey) usedRoots.add(formattedSource.rootKey);
			return {
				Name: plugin.name || plugin.id,
				ID: plugin.name && plugin.name !== plugin.id ? plugin.id : "",
				Format: plugin.format ?? "openclaw",
				Status: formatPluginStatus(plugin),
				Source: desc ? `${formattedSource.value}\n${desc}` : formattedSource.value,
				Version: plugin.version ?? ""
			};
		});
		if (usedRoots.size > 0) {
			runtime.log(theme.muted("Source roots:"));
			for (const key of [
				"stock",
				"workspace",
				"global"
			]) {
				if (!usedRoots.has(key)) continue;
				const dir = sourceRoots[key];
				if (!dir) continue;
				runtime.log(`  ${theme.command(`${key}:`)} ${theme.muted(dir)}`);
			}
			runtime.log("");
		}
		runtime.log(renderTable({
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
					key: "Format",
					header: "Format",
					minWidth: 9
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 10
				},
				{
					key: "Source",
					header: "Source",
					minWidth: 26,
					flex: true
				},
				{
					key: "Version",
					header: "Version",
					minWidth: 8
				}
			],
			rows
		}).trimEnd());
		return;
	}
	const lines = [];
	for (const plugin of list) {
		lines.push(formatPluginLine(plugin));
		lines.push("");
	}
	runtime.log(lines.join("\n").trim());
}
//#endregion
export { runPluginsListCommand };

import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.mjs";
//#region src/cli/plugins-marketplace-list-command.ts
/** List plugins from a configured marketplace manifest. */
async function runPluginMarketplaceListCommand(source, opts) {
	const { listMarketplacePlugins } = await import("./marketplace-Dk73jsJL.mjs");
	const { createPluginInstallLogger, quietPluginJsonLogger } = await import("./plugins-command-helpers-6qXokDsv.mjs");
	const result = await listMarketplacePlugins({
		marketplace: source,
		logger: opts.json ? quietPluginJsonLogger : createPluginInstallLogger()
	});
	if (!result.ok) {
		const message = result.error;
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	if (opts.json) return defaultRuntime.writeJson({
		source: result.sourceLabel,
		name: result.manifest.name,
		version: result.manifest.version,
		plugins: result.manifest.plugins
	});
	if (result.manifest.plugins.length === 0) {
		defaultRuntime.log(`No plugins found in marketplace ${result.sourceLabel}.`);
		return;
	}
	defaultRuntime.log(`${theme.heading("Marketplace")} ${theme.muted(result.manifest.name ?? result.sourceLabel)}`);
	for (const plugin of result.manifest.plugins) {
		const suffix = plugin.version ? theme.muted(` ${formatVersionLabel(plugin.version)}`) : "";
		const desc = plugin.description ? ` - ${theme.muted(plugin.description)}` : "";
		defaultRuntime.log(`${theme.command(plugin.name)}${suffix}${desc}`);
	}
}
//#endregion
export { runPluginMarketplaceListCommand };

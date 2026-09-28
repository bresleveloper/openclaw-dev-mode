import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.mjs";
import { t as searchInstallablePluginPackages } from "./catalog-search-CDdabHSg.mjs";
//#region src/cli/plugins-search-command.ts
function formatPackageSearchLine(entry) {
	const pkg = entry.package;
	const flags = [
		pkg.family,
		pkg.channel,
		pkg.isOfficial && pkg.channel !== "official" ? "official" : void 0,
		pkg.latestVersion ? formatVersionLabel(pkg.latestVersion) : void 0
	].filter(Boolean);
	const summary = pkg.summary ? theme.muted(` — ${pkg.summary}`) : "";
	return `${pkg.name}  ${theme.muted(flags.join(" | "))}${summary}\n  ${theme.muted(`Install: ${formatCliCommand(`openclaw plugins install clawhub:${pkg.name}`)}`)}`;
}
/** Search ClawHub for installable plugins and write JSON or terminal output. */
async function runPluginsSearchCommand(queryParts, opts = {}, runtime = defaultRuntime) {
	const query = normalizeOptionalString(Array.isArray(queryParts) ? queryParts.join(" ") : queryParts);
	if (!query) {
		const message = "Usage: openclaw plugins search <query>";
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	try {
		const results = await searchInstallablePluginPackages({
			query,
			limit: opts.limit
		});
		if (opts.json) {
			writeRuntimeJson(runtime, { results });
			return;
		}
		if (results.length === 0) {
			runtime.log("No ClawHub plugins found.");
			return;
		}
		runtime.log(`${theme.heading("ClawHub plugins")} ${theme.muted(`(${results.length})`)}`);
		runtime.log(results.map(formatPackageSearchLine).join("\n"));
	} catch (error) {
		if (opts.json) throw error;
		runtime.error(formatErrorMessage(error));
		runtime.exit(1);
	}
}
//#endregion
export { runPluginsSearchCommand };

import { a as displayPath } from "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import fs from "node:fs";
//#region src/config/logging.ts
/** Formats a config path for operator-facing log output. */
function formatConfigFilePath(path = resolveConfigPath(process.env, resolveStateDir())) {
	return displayPath(path);
}
/** Builds the config-updated log message, including backup detail only when it exists. */
function formatConfigUpdatedMessage(path, opts = {}) {
	const displayConfigPath = theme.muted(formatConfigFilePath(path));
	const suffix = opts.suffix ? ` ${opts.suffix}` : "";
	const backupPath = opts.backupPath === void 0 ? `${path}.bak` : opts.backupPath;
	const lines = [`Updated config: ${displayConfigPath}${suffix}`];
	if (backupPath && fs.existsSync(backupPath)) lines.push(`  Backup: ${theme.muted(formatConfigFilePath(backupPath))}`);
	return lines.join("\n");
}
/** Emits the standard config-updated message through the active runtime logger. */
function logConfigUpdated(runtime, opts = {}) {
	runtime.log(formatConfigUpdatedMessage(opts.path ?? resolveConfigPath(process.env, resolveStateDir()), opts));
}
//#endregion
export { formatConfigUpdatedMessage as n, logConfigUpdated as r, formatConfigFilePath as t };

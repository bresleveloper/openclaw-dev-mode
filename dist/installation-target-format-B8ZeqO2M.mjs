import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
//#region src/cli/installation-target-format.ts
/** Bind diagnostic handoffs to their installation in POSIX shells or Windows PowerShell. */
function formatInstallationTargetCommand(argv, target, options = {}) {
	const windows = process.platform === "win32";
	const quote = (value) => windows ? quotePowerShellArg(value) : `'${value.replaceAll("'", "'\\''")}'`;
	const command = formatCliCommand(argv.map((value) => windows ? /^[a-z0-9_-]+$/iu.test(value) ? value : quote(value) : quoteCliArg(value)).join(" "), options.env);
	const selectors = [
		["OPENCLAW_STATE_DIR", target.stateDir],
		["OPENCLAW_CONFIG_PATH", target.configPath],
		["OPENCLAW_WORKSPACE_DIR", target.defaultWorkspaceDir]
	];
	if (!windows) return `env ${selectors.map(([key, value]) => `${key}=${quote(value)}`).join(" ")} ${command}${options.stdinPath ? ` < ${quote(options.stdinPath)}` : ""}`;
	const saved = selectors.map(([key]) => `$env:${key}`).join(", ");
	const set = selectors.map(([key, value]) => `$env:${key}=${quote(value)};`).join(" ");
	const restore = selectors.map(([key], index) => `$env:${key}=$previousTarget[${index}];`).join(" ");
	return `& { $previousTarget=@(${saved}); try { ${set} ${options.stdinPath ? `$prompt=Get-Content -Raw -Encoding UTF8 -LiteralPath ${quote(options.stdinPath)} -ErrorAction Stop; $OutputEncoding=[System.Text.UTF8Encoding]::new(); $prompt | & ${command}` : `& ${command}`} } finally { ${restore} } }`;
}
//#endregion
export { formatInstallationTargetCommand as t };

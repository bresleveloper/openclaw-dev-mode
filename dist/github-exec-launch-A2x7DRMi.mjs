import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { fileURLToPath } from "node:url";
//#region src/agents/github-exec-launch.ts
function quotePowerShellLiteral(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
/** Carry only a selected profile path through supervision; resolve its token in the child. */
function buildGitHubExecLaunchArgv(argv, profileDir, options) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("githubExec");
	const launcher = [
		process.execPath,
		...resolveRuntimeWorkerArgv(workerUrl),
		profileDir
	];
	if (process.platform === "win32") {
		const externalShell = options?.externalCommandShell;
		const shellArgv = externalShell ? [
			externalShell.shell,
			...externalShell.args,
			`$ErrorActionPreference = 'Stop'; & ${argv.map(quotePowerShellLiteral).join(" ")}; exit $LASTEXITCODE`
		] : argv;
		const command = shellArgv.at(-1);
		if (command === void 0) throw new Error("Managed GitHub execution requires a shell command.");
		const bootstrap = [
			`Push-Location -LiteralPath ${quotePowerShellLiteral(fileURLToPath(new URL(".", workerUrl)))} -ErrorAction Stop;`,
			`try { $env:GH_TOKEN = & ${launcher.map(quotePowerShellLiteral).join(" ")};`,
			"if (-not $? -or $LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($env:GH_TOKEN)) { exit 1 }",
			"} finally { Pop-Location };",
			"$env:GITHUB_TOKEN = ''; $LASTEXITCODE = $null;",
			`& ([scriptblock]::Create(${quotePowerShellLiteral(command)}))`
		].join(" ");
		return [...shellArgv.slice(0, -1), bootstrap];
	}
	return [
		"/bin/sh",
		"-c",
		`set +x; GH_TOKEN="$(${`cd ${quoteCliArg(fileURLToPath(new URL(".", workerUrl)))} 2>/dev/null || { printf '%s\\n' 'GitHub Identity launcher is unavailable. Restart OpenClaw, then retry.' >&2; exit 1; }`}; exec ${launcher.map(quoteCliArg).join(" ")})" || exit $?; export GH_TOKEN; GITHUB_TOKEN=; export GITHUB_TOKEN; exec "$@"`,
		"openclaw-github-exec",
		...argv
	];
}
//#endregion
export { buildGitHubExecLaunchArgv as t };

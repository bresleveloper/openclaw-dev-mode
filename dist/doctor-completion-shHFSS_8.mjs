import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { a as formatCompletionReloadCommand, d as resolveCompletionProfilePath, f as resolveShellFromEnv, i as findCompletionProfileWriteError, l as resolveCompletionCachePath, n as COMPLETION_SKIP_PLUGIN_COMMANDS_ENV, o as installCompletion, p as usesSlowDynamicCompletion, r as completionCacheExists, s as isCompletionInstalled, u as resolveCompletionProfileHint } from "./completion-runtime-DXXgSrrB.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import path from "node:path";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-completion.ts
/** Doctor checks and repair effects for cached shell completion setup. */
const COMPLETION_CACHE_WRITE_TIMEOUT_MS = 3e4;
async function installCompletionForDoctor({ shell, cachePath }, cliName, action) {
	try {
		await installCompletion(shell, true, cliName);
		const reloadCommand = formatCompletionReloadCommand(shell, resolveCompletionProfileHint(shell));
		note(`Shell completion ${action}. Restart your shell or run: ${reloadCommand}`, "Shell completion");
	} catch (err) {
		const writeError = findCompletionProfileWriteError(err);
		if (!writeError) throw err;
		const failedPath = writeError.path ?? resolveCompletionProfilePath(shell);
		const command = formatCompletionReloadCommand(shell, cachePath);
		note(`Shell completion could not be ${action} (permission or read-only error at ${failedPath}). For this ${shell} session only, run:\n${command}`, "Shell completion");
	}
}
/** Generate the completion cache by spawning the CLI. */
async function generateCompletionCache(options) {
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (!root) return false;
	const args = [
		path.join(root, "openclaw.mjs"),
		"completion",
		"--write-state"
	];
	if (options.shell) args.push("--shell", options.shell);
	const env = { ...process.env };
	if (options.generationMode === "core-only") env[COMPLETION_SKIP_PLUGIN_COMMANDS_ENV] = "1";
	else delete env[COMPLETION_SKIP_PLUGIN_COMMANDS_ENV];
	return spawnSync(process.execPath, args, {
		cwd: root,
		env,
		encoding: "utf-8",
		timeout: COMPLETION_CACHE_WRITE_TIMEOUT_MS
	}).status === 0;
}
/** Check the status of shell completion for the current shell. */
async function checkShellCompletionStatus(binName = "openclaw", options = {}) {
	const shell = options.shell ?? resolveShellFromEnv();
	return {
		shell,
		profileInstalled: await isCompletionInstalled(shell, binName),
		cacheExists: await completionCacheExists(shell, binName),
		cachePath: resolveCompletionCachePath(shell, binName),
		usesSlowPattern: await usesSlowDynamicCompletion(shell, binName)
	};
}
/** Converts shell completion status into health findings shown by check flows. */
function shellCompletionStatusToHealthFindings(status) {
	const checkId = "core/doctor/shell-completion";
	const pathLocal = `shellCompletion.${status.shell}`;
	if (status.usesSlowPattern) return [{
		checkId,
		severity: "info",
		message: `Your ${status.shell} profile uses slow dynamic completion (source <(...)).`,
		path: pathLocal,
		fixHint: "Run `openclaw doctor --fix` to upgrade to cached completion."
	}];
	if (status.profileInstalled && !status.cacheExists) return [{
		checkId,
		severity: "info",
		message: `Shell completion is configured in your ${status.shell} profile but the cache is missing.`,
		path: pathLocal,
		fixHint: `Run \`openclaw completion --write-state\` or \`openclaw doctor --fix\` to regenerate ${status.cachePath}.`
	}];
	return [];
}
/** Converts shell completion status into dry-run repair effects for health check reporting. */
function shellCompletionStatusToRepairEffects(status) {
	const effects = [];
	if (status.usesSlowPattern && !status.cacheExists) effects.push({
		kind: "state",
		action: "would-generate-completion-cache",
		target: status.cachePath,
		dryRunSafe: true
	});
	if (status.usesSlowPattern) effects.push({
		kind: "file",
		action: "would-upgrade-shell-profile-completion",
		target: status.shell,
		dryRunSafe: false
	});
	else if (status.profileInstalled && !status.cacheExists) effects.push({
		kind: "state",
		action: "would-regenerate-completion-cache",
		target: status.cachePath,
		dryRunSafe: true
	});
	return effects;
}
/**
* Repairs shell completion setup when doctor runs interactively.
*
* Slow dynamic profiles are upgraded to cached completion; configured profiles with a missing
* cache regenerate it; missing completion prompts unless non-interactive mode is active.
*/
async function doctorShellCompletion(prompter, options = {}) {
	const status = await checkShellCompletionStatus(CLI_NAME);
	if (status.usesSlowPattern) {
		note(`Your ${status.shell} profile uses slow dynamic completion (source <(...)).\nUpgrading to cached completion for faster shell startup...`, "Shell completion");
		if (!status.cacheExists) {
			if (!await generateCompletionCache({ generationMode: "core-only" })) {
				note(`Failed to generate completion cache. Run \`${CLI_NAME} completion --write-state\` manually.`, "Shell completion");
				return;
			}
		}
		await installCompletionForDoctor(status, CLI_NAME, "upgraded");
		return;
	}
	if (status.profileInstalled && !status.cacheExists) {
		note(`Shell completion is configured in your ${status.shell} profile but the cache is missing.\nRegenerating cache...`, "Shell completion");
		if (await generateCompletionCache({ generationMode: "core-only" })) note(`Completion cache regenerated at ${status.cachePath}`, "Shell completion");
		else note(`Failed to regenerate completion cache. Run \`${CLI_NAME} completion --write-state\` manually.`, "Shell completion");
		return;
	}
	if (!status.profileInstalled) {
		if (options.nonInteractive) return;
		if (await prompter.confirm({
			message: `Enable ${status.shell} shell completion for openclaw?`,
			initialValue: true
		})) {
			if (!await generateCompletionCache({ generationMode: "core-only" })) {
				note(`Failed to generate completion cache. Run \`${CLI_NAME} completion --write-state\` manually.`, "Shell completion");
				return;
			}
			await installCompletionForDoctor(status, CLI_NAME, "installed");
		}
	}
}
/** Ensures the shell completion cache exists without prompting during setup/update flows. */
async function ensureCompletionCacheExists(binName, options) {
	const shell = options.shell ?? resolveShellFromEnv();
	if (await completionCacheExists(shell, binName)) return true;
	return generateCompletionCache(options);
}
//#endregion
export { shellCompletionStatusToRepairEffects as a, shellCompletionStatusToHealthFindings as i, doctorShellCompletion as n, ensureCompletionCacheExists as r, checkShellCompletionStatus as t };

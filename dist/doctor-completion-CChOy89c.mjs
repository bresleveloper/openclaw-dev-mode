import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { t as resolveRuntimeArgs } from "./runtime-worker-url-DoBSDhBS.mjs";
import { a as formatCompletionReloadCommand, d as resolveCompletionProfilePath, f as resolveShellFromEnv, i as findCompletionProfileWriteError, l as resolveCompletionCachePath, n as COMPLETION_SKIP_PLUGIN_COMMANDS_ENV, o as installCompletion, p as usesSlowDynamicCompletion, r as completionCacheExists, s as isCompletionInstalled, u as resolveCompletionProfileHint } from "./completion-runtime-D9jqWfnd.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import path from "node:path";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-completion.ts
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
async function generateCompletionCache(options) {
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (!root) return false;
	const binPath = path.join(root, "openclaw.mjs");
	const args = [
		...resolveRuntimeArgs(),
		binPath,
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
function shellCompletionStatusToHealthFindings(status) {
	if (!status.usesSlowPattern && (!status.profileInstalled || status.cacheExists)) return [];
	return [{
		checkId: "core/doctor/shell-completion",
		severity: "info",
		message: status.usesSlowPattern ? `Your ${status.shell} profile uses slow dynamic completion (source <(...)).` : `Shell completion is configured in your ${status.shell} profile but the cache is missing.`,
		path: `shellCompletion.${status.shell}`,
		fixHint: status.usesSlowPattern ? "Run `openclaw doctor --fix` to upgrade to cached completion." : `Run \`openclaw completion --write-state\` or \`openclaw doctor --fix\` to regenerate ${status.cachePath}.`
	}];
}
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
	if (status.usesSlowPattern) note(`Your ${status.shell} profile uses slow dynamic completion (source <(...)).\nUpgrading to cached completion for faster shell startup...`, "Shell completion");
	else if (status.profileInstalled) {
		if (status.cacheExists) return;
		note(`Shell completion is configured in your ${status.shell} profile but the cache is missing.\nRegenerating cache...`, "Shell completion");
		if (await generateCompletionCache({ generationMode: "core-only" })) note(`Completion cache regenerated at ${status.cachePath}`, "Shell completion");
		else note(`Failed to regenerate completion cache. Run \`${CLI_NAME} completion --write-state\` manually.`, "Shell completion");
		return;
	} else if (options.nonInteractive || !await prompter.confirm({
		message: `Enable ${status.shell} shell completion for openclaw?`,
		initialValue: true
	})) return;
	if (!status.usesSlowPattern || !status.cacheExists) {
		if (!await generateCompletionCache({ generationMode: "core-only" })) {
			note(`Failed to generate completion cache. Run \`${CLI_NAME} completion --write-state\` manually.`, "Shell completion");
			return;
		}
	}
	await installCompletionForDoctor(status, CLI_NAME, status.usesSlowPattern ? "upgraded" : "installed");
}
/** Ensures the shell completion cache exists without prompting during setup/update flows. */
async function ensureCompletionCacheExists(binName, options) {
	const shell = options.shell ?? resolveShellFromEnv();
	if (await completionCacheExists(shell, binName)) return true;
	return generateCompletionCache(options);
}
//#endregion
export { shellCompletionStatusToRepairEffects as a, shellCompletionStatusToHealthFindings as i, doctorShellCompletion as n, ensureCompletionCacheExists as r, checkShellCompletionStatus as t };

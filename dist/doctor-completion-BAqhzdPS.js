import { t as resolveOpenClawPackageRoot } from "./openclaw-root-CNp1Ofdk.js";
import { n as resolveCliName } from "./cli-name-CAJoj2J5.js";
import { t as note } from "./note-DXV6Ywsc.js";
import { a as installCompletion, c as resolveCompletionCachePath, d as usesSlowDynamicCompletion, i as formatCompletionReloadCommand, l as resolveCompletionProfilePath, o as isCompletionInstalled, r as completionCacheExists, u as resolveShellFromEnv } from "./completion-runtime-CCK6UhaB.js";
import path from "node:path";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-completion.ts
/** Doctor checks and repair effects for cached shell completion setup. */
const COMPLETION_CACHE_WRITE_TIMEOUT_MS = 3e4;
function resolveCompletionReloadPath(shell) {
	if (shell === "powershell") return resolveCompletionProfilePath("powershell");
	return `~/.${shell === "zsh" ? "zshrc" : shell === "bash" ? "bashrc" : "config/fish/config.fish"}`;
}
function formatCompletionReloadNote(shell, action) {
	return `Shell completion ${action}. Restart your shell or run: ${formatCompletionReloadCommand(shell, resolveCompletionReloadPath(shell))}`;
}
/** Generate the completion cache by spawning the CLI. */
async function generateCompletionCache(options = {}) {
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
	return spawnSync(process.execPath, args, {
		cwd: root,
		env: process.env,
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
async function doctorShellCompletion(_runtime, prompter, options = {}) {
	const cliName = resolveCliName();
	const status = await checkShellCompletionStatus(cliName);
	if (status.usesSlowPattern) {
		note(`Your ${status.shell} profile uses slow dynamic completion (source <(...)).\nUpgrading to cached completion for faster shell startup...`, "Shell completion");
		if (!status.cacheExists) {
			if (!await generateCompletionCache()) {
				note(`Failed to generate completion cache. Run \`${cliName} completion --write-state\` manually.`, "Shell completion");
				return;
			}
		}
		await installCompletion(status.shell, true, cliName);
		note(formatCompletionReloadNote(status.shell, "upgraded"), "Shell completion");
		return;
	}
	if (status.profileInstalled && !status.cacheExists) {
		note(`Shell completion is configured in your ${status.shell} profile but the cache is missing.\nRegenerating cache...`, "Shell completion");
		if (await generateCompletionCache()) note(`Completion cache regenerated at ${status.cachePath}`, "Shell completion");
		else note(`Failed to regenerate completion cache. Run \`${cliName} completion --write-state\` manually.`, "Shell completion");
		return;
	}
	if (!status.profileInstalled) {
		if (options.nonInteractive) return;
		if (await prompter.confirm({
			message: `Enable ${status.shell} shell completion for ${cliName}?`,
			initialValue: true
		})) {
			if (!await generateCompletionCache()) {
				note(`Failed to generate completion cache. Run \`${cliName} completion --write-state\` manually.`, "Shell completion");
				return;
			}
			await installCompletion(status.shell, true, cliName);
			note(formatCompletionReloadNote(status.shell, "installed"), "Shell completion");
		}
	}
}
/** Ensures the shell completion cache exists without prompting during setup/update flows. */
async function ensureCompletionCacheExists(binName = "openclaw", options = {}) {
	if (await completionCacheExists(options.shell ?? resolveShellFromEnv(), binName)) return true;
	return generateCompletionCache(options);
}
//#endregion
export { shellCompletionStatusToRepairEffects as a, shellCompletionStatusToHealthFindings as i, doctorShellCompletion as n, ensureCompletionCacheExists as r, checkShellCompletionStatus as t };

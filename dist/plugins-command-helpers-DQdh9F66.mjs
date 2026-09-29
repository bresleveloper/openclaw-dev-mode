import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as HOOK_INSTALL_ERROR_CODE } from "./install-HnYRTeEO.mjs";
//#region src/cli/plugins-command-helpers.ts
function createPluginInstallLogger(runtime = defaultRuntime) {
	return {
		info: (msg) => runtime.log(msg),
		warn: (msg) => runtime.log(msg.includes("╭─") ? msg : theme.warn(msg))
	};
}
function createHookPackInstallLogger(runtime = defaultRuntime) {
	return {
		info: (msg) => runtime.log(msg),
		warn: (msg) => runtime.log(theme.warn(msg))
	};
}
function enableInternalHookEntries(config, hookNames) {
	const entries = { ...config.hooks?.internal?.entries };
	for (const hookName of hookNames) entries[hookName] = {
		...entries[hookName],
		enabled: true
	};
	return {
		...config,
		hooks: {
			...config.hooks,
			internal: {
				...config.hooks?.internal,
				enabled: true,
				entries
			}
		}
	};
}
function formatPluginInstallWithHookFallbackError(pluginError, hookFallback) {
	const formattedPluginError = formatPluginInstallAttemptError(pluginError);
	if (/plugin already exists: .+ \(delete it first\)/.test(pluginError)) return `${formattedPluginError}\nUse \`${formatCliCommand("openclaw plugins update <id-or-npm-spec>")}\` to upgrade the tracked plugin, or rerun install with \`--force\` to replace it.`;
	if (pluginError.startsWith("Invalid extensions directory:") || pluginError === "Invalid path: must stay within extensions directory" || hookFallback.code === HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS) return formattedPluginError;
	return `${formattedPluginError}\nAlso not a valid hook pack: ${formatPluginInstallAttemptError(hookFallback.error)}`;
}
const MISSING_GIT_FOR_NPM_DEPENDENCY_HINT = "Git is required because one of this plugin's npm dependencies is fetched from a git URL, but `git` was not found on PATH. Install Git and rerun the install. On Windows, use `winget install --id Git.Git -e` or add a portable Git `bin` directory to PATH.";
function formatPluginInstallAttemptError(error) {
	if (!isMissingGitForNpmDependencyError(error)) return error;
	if (error.includes(MISSING_GIT_FOR_NPM_DEPENDENCY_HINT)) return error;
	return `${error}\n\n${MISSING_GIT_FOR_NPM_DEPENDENCY_HINT}`;
}
function isMissingGitForNpmDependencyError(error) {
	const normalized = normalizeLowercaseStringOrEmpty(error);
	return /\bspawn\s+git\b/u.test(normalized) && /\benoent\b/u.test(normalized);
}
//#endregion
export { formatPluginInstallWithHookFallbackError as i, createPluginInstallLogger as n, enableInternalHookEntries as r, createHookPackInstallLogger as t };

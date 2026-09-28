import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as pathExists } from "./utils-aKqR_F_U.mjs";
import { n as isErrno } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./errors-DnjwnOju.mjs";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-zGMz1ieM.mjs";
import { n as quotePowerShellArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { existsSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
//#region src/cli/completion-runtime.ts
const COMPLETION_SHELLS = [
	"zsh",
	"bash",
	"powershell",
	"fish"
];
const COMPLETION_SKIP_PLUGIN_COMMANDS_ENV = "OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS";
async function readCompletionProfile(profilePath, shell) {
	const buffer = await fs$1.readFile(profilePath);
	let encoding = "utf8";
	if (shell === "powershell" && process.platform === "win32") {
		const [first, second, third] = buffer;
		if (first === 255 && second === 254 || first === 254 && second === 255) encoding = first === 255 ? "utf16le" : "utf16be";
		else if (first === 239 && second === 187 && third === 191) encoding = "utf8bom";
	}
	return {
		content: encoding === "utf8" ? buffer.toString("utf8") : decodeWindowsTextFileBuffer({ buffer }),
		encoding
	};
}
function encodeCompletionProfile(content, encoding) {
	if (encoding === "utf8") return Buffer.from(content, "utf8");
	const buffer = Buffer.from(`\uFEFF${content}`, encoding === "utf8bom" ? "utf8" : "utf16le");
	return encoding === "utf16be" ? buffer.swap16() : buffer;
}
/** Narrows an arbitrary shell label to a completion shell supported by installer logic. */
function isCompletionShell(value) {
	return COMPLETION_SHELLS.includes(value);
}
function resolveShellBasename(shellPath, platform = process.platform) {
	const platformBasename = platform === "win32" ? path.win32.basename(shellPath) : path.basename(shellPath);
	const winBasename = path.win32.basename(shellPath);
	const basename = winBasename.length < platformBasename.length ? winBasename : platformBasename;
	return normalizeLowercaseStringOrEmpty(basename.replace(/\.(?:exe|cmd|bat)$/i, ""));
}
/** Resolves the active shell from environment paths, using the platform's native default. */
function resolveShellFromEnv(env = process.env, platform = process.platform) {
	const shellPath = normalizeOptionalString(env.SHELL) ?? "";
	const shellName = shellPath ? resolveShellBasename(shellPath, platform) : "";
	if (isCompletionShell(shellName)) return shellName;
	if (shellName === "pwsh") return "powershell";
	return platform === "win32" ? "powershell" : "zsh";
}
function sanitizeCompletionBasename(value) {
	const trimmed = value.trim();
	if (!trimmed) return "openclaw";
	return trimmed.replace(/[^a-zA-Z0-9._-]/g, "-");
}
function resolveCompletionCacheDir(env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	return path.join(stateDir, "completions");
}
/** Returns the per-shell cached completion script path for a sanitized CLI binary name. */
function resolveCompletionCachePath(shell, binName) {
	const basename = sanitizeCompletionBasename(binName);
	return path.join(resolveCompletionCacheDir(), `${basename}.${shell === "powershell" ? "ps1" : shell}`);
}
/** Check if the completion cache file exists for the given shell. */
async function completionCacheExists(shell, binName = "openclaw") {
	const cachePath = resolveCompletionCachePath(shell, binName);
	return pathExists(cachePath);
}
function quoteCompletionPath(shell, value) {
	if (shell === "powershell") return quotePowerShellArg(value);
	return `'${shell === "fish" ? value.replace(/[\\']/gu, "\\$&") : value.replaceAll("'", "'\\''")}'`;
}
function formatCompletionSourceLine(shell, cachePath) {
	const quotedPath = quoteCompletionPath(shell, cachePath);
	if (shell === "powershell") return `. ${quotedPath}`;
	if (shell === "fish") return `test -f ${quotedPath}; and source ${quotedPath}`;
	return `[ -f ${quotedPath} ] && source ${quotedPath}`;
}
function appendCompletionProfilePath(directory, pathApi, ...segments) {
	const nativeDirectory = pathApi.sep === "\\" ? directory.replaceAll("/", pathApi.sep) : directory;
	return `${nativeDirectory}${nativeDirectory.endsWith(pathApi.sep) ? "" : pathApi.sep}${segments.join(pathApi.sep)}`;
}
/** Formats a current-shell command to load a profile or cached completion script. */
function formatCompletionReloadCommand(shell, scriptPath) {
	if (shell === "powershell") return `. ${quoteCompletionPath(shell, scriptPath)}`;
	if (/^[a-zA-Z0-9_./~+-]+$/u.test(scriptPath)) return `source ${scriptPath}`;
	const homePrefix = scriptPath.startsWith("~/") ? "~/" : "";
	return `source ${homePrefix}${quoteCompletionPath(shell, scriptPath.slice(homePrefix.length))}`;
}
function isCompletionProfileHeader(line) {
	return line.trim() === "# OpenClaw Completion";
}
function isCompletionProfileLine(line, binName, cachePath) {
	if (isSlowDynamicCompletionLine(line, binName)) return true;
	const trimmed = line.trim();
	return trimmed === `source "${cachePath}"` || trimmed === `[ -f "${cachePath}" ] && source "${cachePath}"` || trimmed === `test -f "${cachePath}"; and source "${cachePath}"` || COMPLETION_SHELLS.some((shell) => trimmed === formatCompletionSourceLine(shell, cachePath));
}
function isPreviousCompletionSourceLine(line, currentCachePath, shell) {
	const trimmed = line.trim();
	const guarded = /^(?:\[\s+-f|test\s+-f)\s+(.+?)\s*(?:\]\s*&&|;\s*and)\s+source\s+\1$/u.exec(trimmed);
	const direct = /^(source|\.)\s+(.+)$/u.exec(trimmed);
	const quotedPath = guarded?.[1] ?? direct?.[2];
	if (!quotedPath) return false;
	const quoteShell = direct?.[1] === "." ? "powershell" : shell;
	const legacyPath = guarded ? /^"(.+)"$/u.exec(quotedPath)?.[1] : /^source\s+"([^"]+)"$/u.exec(trimmed)?.[1];
	const escapedPath = quotedPath.slice(1, -1);
	const sourcePath = legacyPath ?? (quoteShell === "powershell" ? escapedPath.replace(/(['‘-‛])\1/gu, "$1") : quoteShell === "fish" ? escapedPath.replace(/\\([\\'])/gu, "$1") : escapedPath.replaceAll("'\\''", "'"));
	const matchesLegacyPowerShellLiteral = quoteShell === "powershell" && `'${sourcePath.replaceAll("'", "''")}'` === quotedPath;
	if (!legacyPath && !matchesLegacyPowerShellLiteral && quoteCompletionPath(quoteShell, sourcePath) !== quotedPath) return false;
	const sourcePaths = sourcePath.includes("\\") ? path.win32 : path;
	return sourcePaths.isAbsolute(sourcePath) && sourcePaths.basename(sourcePaths.dirname(sourcePath)) === "completions" && sourcePaths.basename(sourcePath) === path.basename(currentCachePath);
}
const PORTABLE_HOOK_SHELLS = /* @__PURE__ */ new Set([
	"bash",
	"zsh",
	"fish"
]);
/** Characters that would change meaning if a literal shell operand were expanded or globbed. */
const PORTABLE_PATH_UNSAFE = /[\s"'`$\\|&;<>()*?[\]{}]/u;
/**
* Expands a guarded-source operand that is a portable `$HOME`-rooted path, or returns undefined
* when the operand is not one of the supported safe forms. The operand may be double-quoted or
* unquoted; single quotes prevent expansion and are never treated as portable. Expansion is
* purely textual (`${HOME}`/`$HOME` token + literal suffix); nothing is evaluated.
*/
function expandPortableHomeOperand(operand, homeDir, shell) {
	const doubleQuoted = operand.length >= 2 && operand.startsWith("\"") && operand.endsWith("\"");
	const inner = doubleQuoted ? operand.slice(1, -1) : operand;
	if (doubleQuoted ? inner.includes("\"") : /["'`]/u.test(inner)) return;
	if (!doubleQuoted && PORTABLE_PATH_UNSAFE.test(homeDir)) return;
	const token = shell === "fish" ? "$HOME" : inner.startsWith("${HOME}") ? "${HOME}" : "$HOME";
	if (!inner.startsWith(token)) return;
	const suffix = inner.slice(token.length);
	if (PORTABLE_PATH_UNSAFE.test(suffix)) return;
	return suffix.startsWith("/") ? `${homeDir}${suffix}` : void 0;
}
/**
* Recognizes a user-managed portable completion hook such as
* `[[ -f "${HOME}/.openclaw/completions/openclaw.bash" ]] && source "${HOME}/.openclaw/completions/openclaw.bash"`.
* Dotfile managers own these lines, so recognition is kept separate from rewrite ownership:
* portable hooks are never deleted or rewritten by the installer. The anchored parser only
* accepts guarded forms whose guard and source operands both expand to the current cache path;
* compound commands and mismatched paths are left alone.
*/
function isPortableCompletionSourceLine(line, shell, cachePath, homeDir) {
	if (!PORTABLE_HOOK_SHELLS.has(shell)) return false;
	const homePrefix = homeDir.endsWith(path.sep) ? homeDir : `${homeDir}${path.sep}`;
	if (!cachePath.startsWith(homePrefix)) return false;
	const suffix = cachePath.slice(homePrefix.length);
	if (PORTABLE_PATH_UNSAFE.test(suffix) || suffix === "") return false;
	const trimmed = line.replace(/^[ \t]+|[ \t]+$/gu, "");
	let guardOperand;
	let sourceOperand;
	if (shell === "fish") {
		const hook = /^test[ \t]+-f[ \t]+(.+?)[ \t]*;[ \t]*and[ \t]+source[ \t]+(.+)$/u.exec(trimmed);
		guardOperand = hook?.[1];
		sourceOperand = hook?.[2];
	} else {
		const hook = /^\[[ \t]+-f[ \t]+(.+?)[ \t]+\][ \t]*&&[ \t]+source[ \t]+(.+)$/u.exec(trimmed) ?? /^\[\[[ \t]+-f[ \t]+(.+?)[ \t]+\]\][ \t]*&&[ \t]+source[ \t]+(.+)$/u.exec(trimmed);
		guardOperand = hook?.[1];
		sourceOperand = hook?.[2];
	}
	return guardOperand !== void 0 && sourceOperand !== void 0 && expandPortableHomeOperand(guardOperand, homeDir, shell) === cachePath && expandPortableHomeOperand(sourceOperand, homeDir, shell) === cachePath;
}
function isOwnedCompletionInvocation(invocation, binName) {
	const [command, action, ...args] = invocation.trim().split(/\s+/u);
	if (command !== binName || action !== "completion") return false;
	if (args.length === 2 && (args[0] === "--shell" || args[0] === "-s")) return isCompletionShell(args[1] ?? "");
	return args.length === 0 || args.length === 1 && isCompletionShell((args[0] ?? "").replace(/^(?:--shell=|-s=?)/u, ""));
}
/** Check if a line uses an owned slow dynamic completion pattern (source <(...)). */
function isSlowDynamicCompletionLine(line, binName) {
	const trimmed = line.trim();
	const dynamicMarker = `<(${binName} completion`;
	const markerIndex = trimmed.indexOf(dynamicMarker);
	if (markerIndex >= 0) {
		const expression = trimmed.slice(markerIndex);
		return /^(?:(?:\[\s+-f\s+[^\]]+\]\s*&&\s*)?(?:source|\.))\s*$/u.test(trimmed.slice(0, markerIndex).trimEnd()) && expression.endsWith(")") && isOwnedCompletionInvocation(expression.slice(2, -1), binName);
	}
	const invocationIndex = trimmed.indexOf(`${binName} completion`);
	if (invocationIndex < 0) return false;
	const invocationPrefix = trimmed.slice(0, invocationIndex).trimEnd();
	const evalPrefix = /^eval\s+(["']?)\$\($/u.exec(invocationPrefix);
	if (evalPrefix) {
		const invocation = trimmed.slice(invocationIndex);
		const closing = `)${evalPrefix[1] ?? ""}`;
		return invocation.endsWith(closing) && isOwnedCompletionInvocation(invocation.slice(0, -closing.length), binName);
	}
	if (invocationIndex !== 0 || /[;&]/u.test(trimmed)) return false;
	const pipeline = trimmed.split("|").map((stage) => stage.trim());
	const terminal = pipeline.at(-1) ?? "";
	return isOwnedCompletionInvocation(pipeline[0] ?? "", binName) && /^(?:source|Invoke-Expression|iex)$/iu.test(terminal) && (pipeline.length === 2 || pipeline.length === 3 && /^Out-String$/iu.test(pipeline[1] ?? ""));
}
function updateCompletionProfile(content, binName, cachePath, shell, homeDir) {
	const lines = content.split("\n");
	const filtered = [];
	let hadExisting = false;
	let portableCoversCurrent = false;
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i] ?? "";
		if (isCompletionProfileHeader(line)) {
			const following = lines[i + 1] ?? "";
			if (isPortableCompletionSourceLine(following, shell, cachePath, homeDir)) {
				filtered.push(line);
				continue;
			}
			hadExisting = true;
			if (isCompletionProfileLine(following, binName, cachePath) || isPreviousCompletionSourceLine(following, cachePath, shell)) i += 1;
			continue;
		}
		if (isCompletionProfileLine(line, binName, cachePath)) {
			hadExisting = true;
			continue;
		}
		if (isPortableCompletionSourceLine(line, shell, cachePath, homeDir)) {
			hadExisting = true;
			portableCoversCurrent = true;
			filtered.push(line);
			continue;
		}
		filtered.push(line);
	}
	if (portableCoversCurrent) {
		const next = filtered.join("\n");
		return {
			next,
			changed: next !== content,
			hadExisting
		};
	}
	const trimmed = filtered.join("\n").trimEnd();
	const block = `# OpenClaw Completion\n${formatCompletionSourceLine(shell, cachePath)}`;
	const next = trimmed ? `${trimmed}\n\n${block}\n` : `${block}\n`;
	return {
		next,
		changed: next !== content,
		hadExisting
	};
}
async function resolveCompletionProfileWritePath(profilePath) {
	const profileDir = path.dirname(profilePath);
	await fs$1.mkdir(profileDir, { recursive: true });
	const canonicalDir = await fs$1.realpath(profileDir);
	try {
		return await fs$1.realpath(profilePath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	const linkTarget = await fs$1.readlink(profilePath).catch((error) => {
		const code = error.code;
		if (code === "ENOENT" || code === "EINVAL") return;
		throw error;
	});
	if (linkTarget === void 0) return path.join(canonicalDir, path.basename(profilePath));
	const targetPath = path.isAbsolute(linkTarget) ? linkTarget : `${canonicalDir}${path.sep}${linkTarget}`;
	const targetDir = path.dirname(targetPath);
	await fs$1.mkdir(targetDir, { recursive: true });
	return path.join(await fs$1.realpath(targetDir), path.basename(targetPath));
}
/** Resolves the shell startup profile path that should contain the OpenClaw completion block. */
function resolveCompletionProfilePath(shell, options = {}) {
	const env = options.env ?? process.env;
	const homeDir = options.homeDir ?? os.homedir;
	const platform = options.platform ?? process.platform;
	const pathApi = platform === "win32" ? path.win32 : path.posix;
	const home = env.HOME || homeDir();
	if (shell === "zsh") return appendCompletionProfilePath(env.ZDOTDIR === void 0 ? home : env.ZDOTDIR || pathApi.sep, pathApi, ".zshrc");
	if (shell === "bash") {
		const bashrc = appendCompletionProfilePath(home, pathApi, ".bashrc");
		return existsSync(bashrc) ? bashrc : appendCompletionProfilePath(home, pathApi, ".bash_profile");
	}
	if (shell === "fish") {
		const configuredHome = env.XDG_CONFIG_HOME;
		return appendCompletionProfilePath(configuredHome && pathApi.isAbsolute(configuredHome) ? configuredHome : appendCompletionProfilePath(home, pathApi, ".config"), pathApi, "fish", "config.fish");
	}
	if (platform === "win32") {
		const shellPath = normalizeOptionalString(env.SHELL) ?? "";
		const profileDirectory = (shellPath ? resolveShellBasename(shellPath, platform) : "") === "powershell" ? "WindowsPowerShell" : "PowerShell";
		return appendCompletionProfilePath(env.USERPROFILE || home, pathApi, "Documents", profileDirectory, "Microsoft.PowerShell_profile.ps1");
	}
	return appendCompletionProfilePath(home, pathApi, ".config", "powershell", "Microsoft.PowerShell_profile.ps1");
}
/** Formats the resolved startup profile relative to HOME when that preserves its actual location. */
function resolveCompletionProfileHint(shell) {
	const profilePath = resolveCompletionProfilePath(shell);
	if (shell === "powershell") return profilePath;
	if (!path.isAbsolute(profilePath)) return profilePath.startsWith(`.${path.sep}`) || profilePath.startsWith(`..${path.sep}`) ? profilePath : `.${path.sep}${profilePath}`;
	const home = process.env.HOME;
	return home && profilePath.startsWith(`${home}${path.sep}`) ? `~/${profilePath.slice(home.length + 1)}` : profilePath;
}
/** Returns whether a shell profile already contains an OpenClaw completion block or source line. */
async function isCompletionInstalled(shell, binName = "openclaw") {
	const profilePath = resolveCompletionProfilePath(shell);
	if (!await pathExists(profilePath)) return false;
	const cachePath = resolveCompletionCachePath(shell, binName);
	const homeDir = process.env.HOME || os.homedir();
	const { content } = await readCompletionProfile(profilePath, shell);
	return content.split("\n").some((line) => isCompletionProfileLine(line, binName, cachePath) || isPortableCompletionSourceLine(line, shell, cachePath, homeDir));
}
/**
* Check if the profile uses the slow dynamic completion pattern.
* Returns true if profile has `source <(openclaw completion ...)` instead of cached file.
*/
async function usesSlowDynamicCompletion(shell, binName = "openclaw") {
	const profilePath = resolveCompletionProfilePath(shell);
	if (!await pathExists(profilePath)) return false;
	const cachePath = resolveCompletionCachePath(shell, binName);
	const { content } = await readCompletionProfile(profilePath, shell);
	return content.split("\n").some((line) => isSlowDynamicCompletionLine(line, binName) && !line.includes(cachePath));
}
const PROFILE_WRITE_ERROR_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"EPERM",
	"EROFS"
]);
function findCompletionProfileWriteError(err) {
	if (isErrno(err) && PROFILE_WRITE_ERROR_CODES.has(err.code ?? "")) return err;
	return err instanceof Error ? findCompletionProfileWriteError(err.cause) : void 0;
}
async function installCompletion(shell, yes, binName = "openclaw") {
	if (!isCompletionShell(shell)) throw new Error(`Automated installation not supported for ${shell} yet.`);
	const cachePath = resolveCompletionCachePath(shell, binName);
	if (!await pathExists(cachePath)) throw new Error(`Completion cache not found at ${cachePath}. Run \`${binName} completion --write-state\` first.`);
	const profilePath = resolveCompletionProfilePath(shell);
	const homeDir = process.env.HOME || os.homedir();
	try {
		let content;
		let encoding = "utf8";
		try {
			({content, encoding} = await readCompletionProfile(profilePath, shell));
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			if (!yes) console.warn(`Profile not found at ${profilePath}. Creating a new one.`);
			content = "";
		}
		const update = updateCompletionProfile(content, binName, cachePath, shell, homeDir);
		if (!update.changed) {
			if (!yes) console.log(`Completion already installed in ${profilePath}`);
			return;
		}
		if (!yes) {
			const action = update.hadExisting ? "Updating" : "Installing";
			console.log(`${action} completion in ${profilePath}...`);
		}
		await publishOutputFileAtomically({
			filePath: await resolveCompletionProfileWritePath(profilePath),
			tempPrefix: ".openclaw-completion-profile",
			durable: true,
			writeTemp: async (tempPath) => {
				await fs$1.writeFile(tempPath, encodeCompletionProfile(update.next, encoding), { flag: "wx" });
			}
		});
		if (!yes) console.log(`Completion installed. Restart your shell or run: ${formatCompletionReloadCommand(shell, resolveCompletionProfileHint(shell))}`);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to install completion: ${message}`, { cause: err });
	}
}
//#endregion
export { formatCompletionReloadCommand as a, isCompletionShell as c, resolveCompletionProfilePath as d, resolveShellFromEnv as f, findCompletionProfileWriteError as i, resolveCompletionCachePath as l, COMPLETION_SKIP_PLUGIN_COMMANDS_ENV as n, installCompletion as o, usesSlowDynamicCompletion as p, completionCacheExists as r, isCompletionInstalled as s, COMPLETION_SHELLS as t, resolveCompletionProfileHint as u };

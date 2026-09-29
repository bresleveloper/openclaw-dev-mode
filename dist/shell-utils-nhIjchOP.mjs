import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { a as stripAnsiForStreamChunk, l as AnsiSequenceStripper } from "./ansi-CWsy0bu4.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-BMRdcL7i.mjs";
import { r as getBinDir } from "./config-B8b8m5IS.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/shell-utils.ts
/**
* Shell execution helpers.
*
* Resolves platform shell commands and sanitizes binary output.
*/
function createArgvShellConfig(shell, args) {
	return {
		shell,
		args,
		commandTransport: "argv"
	};
}
function resolvePowerShellPath() {
	const programFiles = process.env.ProgramFiles || process.env.PROGRAMFILES || "C:\\Program Files";
	const pwsh7 = path.join(programFiles, "PowerShell", "7", "pwsh.exe");
	if (fs.existsSync(pwsh7)) return pwsh7;
	const programW6432 = process.env.ProgramW6432;
	if (programW6432 && programW6432 !== programFiles) {
		const pwsh7Alt = path.join(programW6432, "PowerShell", "7", "pwsh.exe");
		if (fs.existsSync(pwsh7Alt)) return pwsh7Alt;
	}
	const pwshInPath = resolveShellFromPath("pwsh");
	if (pwshInPath) return pwshInPath;
	const systemRoot = process.env.SystemRoot || process.env.WINDIR;
	if (systemRoot) {
		const candidate = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
		if (fs.existsSync(candidate)) return candidate;
	}
	return "powershell.exe";
}
const NON_INTERACTIVE_SHELLS = /* @__PURE__ */ new Set(["false", "nologin"]);
function isNonInteractiveShell(shellPath) {
	if (!shellPath) return false;
	return NON_INTERACTIVE_SHELLS.has(path.basename(shellPath));
}
function getPosixShellArgs(shellPath) {
	switch (path.basename(shellPath)) {
		case "bash": return [
			"--noprofile",
			"--norc",
			"-c"
		];
		case "zsh": return ["-f", "-c"];
		case "fish": return ["--no-config", "-c"];
		default: return ["-c"];
	}
}
function resolveWindowsBashPath(env = process.env) {
	const candidates = [env.ProgramFiles, env["ProgramFiles(x86)"]].filter((dir) => Boolean(dir?.trim())).map((dir) => path.join(dir, "Git", "bin", "bash.exe"));
	for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
	return resolveShellFromPath("bash.exe", env) ?? resolveShellFromPath("bash", env);
}
const windowsGitBashUsrBinCache = /* @__PURE__ */ new Map();
let defaultWindowsGitBashUsrBinResolved = false;
let defaultWindowsGitBashUsrBin;
function resolveWindowsGitBashUsrBin(shellPath) {
	const cacheKey = path.resolve(shellPath).toLowerCase();
	if (windowsGitBashUsrBinCache.has(cacheKey)) return windowsGitBashUsrBinCache.get(cacheKey);
	const normalized = path.normalize(shellPath);
	const shellName = path.basename(normalized).toLowerCase();
	const binDir = path.dirname(normalized);
	let gitRoot;
	if ((shellName === "bash.exe" || shellName === "bash") && path.basename(binDir).toLowerCase() === "bin") {
		const parent = path.dirname(binDir);
		gitRoot = path.basename(parent).toLowerCase() === "usr" ? path.dirname(parent) : parent;
	}
	const usrBin = gitRoot ? path.join(gitRoot, "usr", "bin") : void 0;
	const resolved = gitRoot && fs.existsSync(path.join(gitRoot, "cmd", "git.exe")) && usrBin && fs.existsSync(usrBin) ? usrBin : void 0;
	pruneMapToMaxSize(windowsGitBashUsrBinCache, 15);
	windowsGitBashUsrBinCache.set(cacheKey, resolved);
	return resolved;
}
function getWindowsGitBashUsrBin(shellPath) {
	if (process.platform !== "win32") return;
	if (shellPath) return resolveWindowsGitBashUsrBin(shellPath);
	if (!defaultWindowsGitBashUsrBinResolved) {
		defaultWindowsGitBashUsrBinResolved = true;
		const resolvedShell = resolveWindowsBashPath();
		defaultWindowsGitBashUsrBin = resolvedShell ? resolveWindowsGitBashUsrBin(resolvedShell) : void 0;
	}
	return defaultWindowsGitBashUsrBin;
}
function isLegacyWslBashPath(shellPath) {
	const normalized = shellPath.replace(/\//g, "\\").toLowerCase();
	return /(?:^|\\)windows\\(?:system32|sysnative)\\bash\.exe$/.test(normalized);
}
function resolveBashCommandConfig(shell) {
	if (isLegacyWslBashPath(shell)) return {
		shell,
		args: ["-s"],
		commandTransport: "stdin"
	};
	return createArgvShellConfig(shell, process.platform === "win32" ? ["-c"] : getPosixShellArgs(shell));
}
function buildShellCommandInvocation(command, config) {
	if (config.commandTransport === "stdin") return {
		argv: [config.shell, ...config.args],
		input: command,
		stdin: "pipe"
	};
	return {
		argv: [
			config.shell,
			...config.args,
			command
		],
		stdin: "ignore"
	};
}
function getShellConfig(customShellPath) {
	if (customShellPath) {
		if (!fs.existsSync(customShellPath)) throw new Error(`Custom shell path not found: ${customShellPath}`);
		return createArgvShellConfig(customShellPath, getPosixShellArgs(customShellPath));
	}
	if (process.platform === "win32") return createArgvShellConfig(resolvePowerShellPath(), [
		"-NoProfile",
		"-NonInteractive",
		"-Command"
	]);
	const rawEnvShell = process.env.SHELL?.trim();
	const envShell = rawEnvShell && !isNonInteractiveShell(rawEnvShell) ? rawEnvShell : void 0;
	if ((envShell ? path.basename(envShell) : "") === "fish") {
		const bash = resolveShellFromPath("bash");
		if (bash) return createArgvShellConfig(bash, getPosixShellArgs(bash));
		const sh = resolveShellFromPath("sh");
		if (sh) return createArgvShellConfig(sh, getPosixShellArgs(sh));
	}
	if (envShell) return createArgvShellConfig(envShell, getPosixShellArgs(envShell));
	const shell = resolveShellFromPath("sh") ?? resolveShellFromPath("bash") ?? "sh";
	return createArgvShellConfig(shell, getPosixShellArgs(shell));
}
function getBashShellConfig(customShellPath) {
	if (customShellPath) {
		if (!fs.existsSync(customShellPath)) throw new Error(`Custom shell path not found: ${customShellPath}`);
		return resolveBashCommandConfig(customShellPath);
	}
	if (process.platform === "win32") {
		const bash = resolveWindowsBashPath();
		if (bash) return resolveBashCommandConfig(bash);
		throw new Error("No bash shell found. Install Git for Windows or add bash.exe to PATH.");
	}
	if (fs.existsSync("/bin/bash")) return resolveBashCommandConfig("/bin/bash");
	let shell = resolveShellFromPath("bash");
	if (!shell) try {
		shell = resolveExecutableFromPathEnv("bash", process.env.PATH ?? "", process.env, {
			cwd: process.cwd(),
			useCache: false
		});
	} catch {}
	return resolveBashCommandConfig(shell ?? resolveShellFromPath("sh") ?? "sh");
}
function resolveShellFromPath(name, env = process.env) {
	const envPath = env.PATH ?? "";
	if (!envPath) return;
	const entries = envPath.split(path.delimiter).filter(Boolean);
	const executableNames = process.platform === "win32" && !path.extname(name) ? [`${name}.exe`, name] : [name];
	for (const executableName of executableNames) for (const entry of entries) {
		const candidate = path.join(entry, executableName);
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			return candidate;
		} catch {}
	}
}
function normalizeShellName(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	return path.basename(trimmed).replace(/\.(exe|cmd|bat)$/i, "").replace(/[^a-zA-Z0-9_-]/g, "");
}
function detectRuntimeShell() {
	const overrideShell = process.env.OPENCLAW_SHELL?.trim();
	if (overrideShell) {
		const name = normalizeShellName(overrideShell);
		if (name) return name;
	}
	if (process.platform === "win32") {
		if (process.env.POWERSHELL_DISTRIBUTION_CHANNEL) return "pwsh";
		return "powershell";
	}
	const envShell = process.env.SHELL?.trim();
	if (envShell && !isNonInteractiveShell(envShell)) {
		const name = normalizeShellName(envShell);
		if (name) return name;
	}
	if (process.env.POWERSHELL_DISTRIBUTION_CHANNEL) return "pwsh";
	if (process.env.BASH_VERSION) return "bash";
	if (process.env.ZSH_VERSION) return "zsh";
	if (process.env.FISH_VERSION) return "fish";
	if (process.env.KSH_VERSION) return "ksh";
	if (process.env.NU_VERSION || process.env.NUSHELL_VERSION) return "nu";
}
function sanitizeBinaryOutput(text, options) {
	return sanitizeStrippedBinaryOutput(stripAnsiForStreamChunk(text, { compatibilityGrammar: options?.ansiMode === "compat" }));
}
/** Keep one ANSI parser per process stream so control sequences can span callbacks. */
function createStreamingBinaryOutputSanitizer(onCsi) {
	const ansiStripper = new AnsiSequenceStripper(onCsi);
	return (text) => sanitizeStrippedBinaryOutput(ansiStripper.write(text));
}
function sanitizeStrippedBinaryOutput(text) {
	const scrubbed = text.replace(/[\p{Format}\p{Surrogate}]/gu, "");
	if (!scrubbed) return scrubbed;
	return scrubbed.replace(/\p{Cc}/gu, (control) => control === "	" || control === "\n" || control === "\r" ? control : `\\x${control.charCodeAt(0).toString(16).padStart(2, "0")}`);
}
function getShellEnv(sourceEnv) {
	const binDir = getBinDir();
	const pathKeys = Object.keys(sourceEnv).filter((key) => key.toLowerCase() === "path");
	const sourcePathKey = process.platform === "win32" ? pathKeys.toSorted()[0] : pathKeys[0];
	const pathKey = process.platform === "win32" ? "PATH" : sourcePathKey ?? "PATH";
	const currentPath = sourcePathKey ? sourceEnv[sourcePathKey] ?? "" : "";
	const pathEntries = currentPath.split(path.delimiter).filter(Boolean);
	const updatedPath = !binDir || pathEntries.includes(binDir) ? currentPath : [binDir, currentPath].filter(Boolean).join(path.delimiter);
	const env = { ...sourceEnv };
	if (process.platform === "win32") for (const key of pathKeys) delete env[key];
	env[pathKey] = updatedPath;
	return env;
}
function getBashShellEnv(shellPath, sourceEnv = process.env) {
	const env = getShellEnv(sourceEnv);
	const usrBin = getWindowsGitBashUsrBin(shellPath);
	if (!usrBin) return env;
	const pathEntries = (env.PATH ?? "").split(path.delimiter).filter(Boolean);
	const normalizedUsrBin = usrBin.toLowerCase();
	env.PATH = [usrBin, ...pathEntries.filter((entry) => entry.toLowerCase() !== normalizedUsrBin)].join(path.delimiter);
	return env;
}
//#endregion
export { getBashShellEnv as a, getBashShellConfig as i, createStreamingBinaryOutputSanitizer as n, getShellConfig as o, detectRuntimeShell as r, sanitizeBinaryOutput as s, buildShellCommandInvocation as t };

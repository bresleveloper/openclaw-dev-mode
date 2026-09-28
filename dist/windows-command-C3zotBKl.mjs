import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { a as resolveExecutableFromPathEnv, r as isRegularFile, s as resolveExecutablePathCandidate } from "./executable-path-BMRdcL7i.mjs";
import { t as getWindowsCmdExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/process/windows-command.ts
const WINDOWS_UNSAFE_CMD_CHARS_RE = /[&|<>%\r\n]/;
function resolveNpmArgvForWindows(argv) {
	if (process.platform !== "win32" || argv.length === 0) return null;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(expectDefined(argv[0], "argv entry at 0"))).replace(/\.(cmd|exe|bat)$/, "");
	const cliName = basename === "npx" ? "npx-cli.js" : basename === "npm" ? "npm-cli.js" : null;
	if (!cliName) return null;
	const cliPath = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", cliName);
	if (fs.existsSync(cliPath)) return [
		process.execPath,
		cliPath,
		...argv.slice(1)
	];
	const command = argv[0] ?? "";
	return [normalizeLowercaseStringOrEmpty(path.extname(command)) ? command : `${command}.cmd`, ...argv.slice(1)];
}
function createWindowsCommandNotFoundError(command) {
	const error = /* @__PURE__ */ new Error(`spawn ${command} ENOENT`);
	error.code = "ENOENT";
	error.path = command;
	error.syscall = `spawn ${command}`;
	return error;
}
function resolveWindowsCommandFromCwdOrPath(params) {
	if (params.command.includes("/") || params.command.includes("\\")) {
		const candidate = resolveExecutablePathCandidate(params.command, {
			cwd: params.cwd,
			env: params.env
		});
		if (!candidate) return;
		if (path.extname(candidate)) return isRegularFile(candidate) ? candidate : void 0;
		return resolveExecutableFromPathEnv(path.basename(candidate), path.dirname(candidate), params.env, { includeExtensionless: false });
	}
	const cwd = params.cwd?.trim() || process.cwd();
	const pathEntries = (resolveEnvironmentValue(params.env, "PATH") ?? resolveEnvironmentValue(process.env, "PATH") ?? "").split(";").map((entry) => entry.replace(/^"(.*)"$/, "$1").trim()).filter(Boolean).map((entry) => path.isAbsolute(entry) ? entry : path.resolve(cwd, entry));
	return resolveExecutableFromPathEnv(params.command, pathEntries.join(";"), params.env, { includeExtensionless: false });
}
function resolveSupportedWindowsCommand(params) {
	if (process.platform !== "win32") return params.command;
	let resolved = resolveWindowsCommandFromCwdOrPath(params);
	const shimmedCommand = resolveWindowsCommandShim({
		command: params.command,
		cmdCommands: [
			"corepack",
			"pnpm",
			"yarn"
		]
	});
	if (!resolved && shimmedCommand !== params.command) resolved = resolveWindowsCommandFromCwdOrPath({
		...params,
		command: shimmedCommand
	});
	if (!resolved) throw createWindowsCommandNotFoundError(params.command);
	const extension = normalizeLowercaseStringOrEmpty(path.extname(resolved));
	if ([
		".exe",
		".com",
		".cmd",
		".bat"
	].includes(extension)) return resolved;
	throw new Error(`Unsupported Windows command extension ${JSON.stringify(extension || "<none>")} for ${JSON.stringify(params.command)}; use an explicit executable or shell wrapper.`);
}
/** Resolve one shell-free invocation before Execa can apply Windows fallbacks. */
function resolveSafeChildProcessInvocation(params) {
	const finalArgv = resolveNpmArgvForWindows(params.argv) ?? params.argv;
	const cwd = params.cwd instanceof URL ? fileURLToPath(params.cwd) : params.cwd;
	const resolvedCommand = resolveSupportedWindowsCommand({
		command: finalArgv[0] ?? "",
		cwd,
		env: params.env
	});
	const useCmdWrapper = isWindowsBatchCommand(resolvedCommand);
	return {
		command: useCmdWrapper ? resolveSupportedWindowsCommand({
			command: resolveTrustedWindowsCmdExe(),
			cwd,
			env: params.env
		}) : resolvedCommand,
		args: useCmdWrapper ? [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(resolvedCommand, finalArgv.slice(1))
		] : finalArgv.slice(1),
		usesWindowsExitCodeShim: process.platform === "win32" && (useCmdWrapper || finalArgv !== params.argv),
		windowsHide: true,
		windowsVerbatimArguments: useCmdWrapper ? true : params.windowsVerbatimArguments
	};
}
function isWindowsBatchCommand(resolvedCommand, platform = process.platform) {
	if (platform !== "win32") return false;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(resolvedCommand));
	return ext === ".cmd" || ext === ".bat";
}
function buildWindowsCmdExeCommandLine(command, args) {
	return `"${[command, ...args].map((arg) => {
		if (WINDOWS_UNSAFE_CMD_CHARS_RE.test(arg)) throw new Error(`Unsafe Windows cmd.exe argument detected: ${JSON.stringify(arg)}. Pass an explicit shell-wrapper argv at the call site instead.`);
		return `"${arg.replace(/\\+/g, (backslashes, offset) => {
			const next = arg[offset + backslashes.length];
			return next === "\"" || next === void 0 ? backslashes.repeat(2) : backslashes;
		}).replace(/"/g, "\"\"")}"`;
	}).join(" ")}"`;
}
function resolveTrustedWindowsCmdExe(platform = process.platform) {
	if (platform !== "win32") return "cmd.exe";
	return getWindowsCmdExePath();
}
/**
* Resolve package-manager commands that Windows exposes through .cmd shims.
* Explicit extensions are preserved so callers can pass already-resolved tools.
*/
function resolveWindowsCommandShim(params) {
	if ((params.platform ?? process.platform) !== "win32") return params.command;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(params.command));
	if (path.extname(basename)) return params.command;
	if (params.cmdCommands.includes(basename)) return `${params.command}.cmd`;
	return params.command;
}
//#endregion
export { resolveWindowsCommandShim as a, resolveTrustedWindowsCmdExe as i, isWindowsBatchCommand as n, resolveSafeChildProcessInvocation as r, buildWindowsCmdExeCommandLine as t };

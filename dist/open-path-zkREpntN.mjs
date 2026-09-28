import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { o as spawnCommand } from "./exec-spawn-B7redWCL.mjs";
//#region src/gateway/server-methods/open-path.ts
const OPEN_PATH_TIMEOUT_MS = 5e3;
const XDG_OPEN_STARTUP_OBSERVATION_MS = 5e3;
const XDG_OPEN_STDERR_MAX_CHARS = 4096;
function escapePowerShellSingleQuotedString(value) {
	return value.replaceAll("'", "''");
}
function resolveOpenPathCommand(targetPath, platform = process.platform) {
	if (platform === "win32") return {
		command: "powershell.exe",
		args: [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			`Start-Process -FilePath '${escapePowerShellSingleQuotedString(targetPath)}'`
		]
	};
	return {
		command: platform === "darwin" ? "open" : "xdg-open",
		args: [targetPath]
	};
}
async function observeXdgOpenStartup(command) {
	const child = spawnCommand([command.command, ...command.args], {
		buffer: false,
		cleanup: false,
		detached: true,
		reject: true,
		stdio: [
			"ignore",
			"ignore",
			"pipe"
		]
	});
	child.nodeChildProcess.unref();
	let stderrText = "";
	const stderr = child.stderr;
	stderr?.setEncoding("utf8");
	const onStderr = (chunk) => {
		if (stderrText.length >= XDG_OPEN_STDERR_MAX_CHARS) return;
		stderrText += truncateUtf16Safe(String(chunk), XDG_OPEN_STDERR_MAX_CHARS - stderrText.length);
	};
	stderr?.on("data", onStderr);
	await new Promise((resolve, reject) => {
		let observationComplete = false;
		const releaseStderr = (childSettled) => {
			stderr?.off("data", onStderr);
			if (childSettled) {
				stderr?.destroy();
				return;
			}
			stderr?.resume();
			stderr?.unref?.();
		};
		const timer = setTimeout(() => {
			observationComplete = true;
			releaseStderr(false);
			resolve();
		}, XDG_OPEN_STARTUP_OBSERVATION_MS);
		child.then(() => {
			clearTimeout(timer);
			releaseStderr(true);
			if (!observationComplete) resolve();
		}, (error) => {
			clearTimeout(timer);
			releaseStderr(true);
			if (observationComplete) return;
			const commandError = error instanceof Error ? error : new Error(String(error));
			const diagnostic = stderrText.trim();
			reject(diagnostic ? new Error(`${commandError.message}: ${diagnostic}`, { cause: commandError }) : commandError);
		});
	});
}
async function execOpenPath(command, platform = process.platform) {
	if (platform === "linux") {
		await observeXdgOpenStartup(command);
		return;
	}
	await runExec(command.command, command.args, {
		logOutput: false,
		timeoutMs: OPEN_PATH_TIMEOUT_MS
	});
}
function formatOpenPathError(error) {
	if (typeof error === "object" && error && "message" in error && typeof error.message === "string") return error.message;
	return String(error);
}
function isHeadlessOpenPathError(error, command, platform = process.platform) {
	if (platform === "linux" && command.command === "xdg-open" && extractErrorCode(error) === "ENOENT") return true;
	const message = formatOpenPathError(error);
	return message.includes("xdg-open") && message.includes("no method available");
}
function sanitizePathForLog(targetPath) {
	const sanitized = Array.from(targetPath, (char) => {
		const code = char.charCodeAt(0);
		return code < 32 || code === 127 ? "?" : char;
	}).join("");
	return sanitized.length > 120 ? `${truncateUtf16Safe(sanitized, 117)}...` : sanitized;
}
//#endregion
export { sanitizePathForLog as a, resolveOpenPathCommand as i, formatOpenPathError as n, isHeadlessOpenPathError as r, execOpenPath as t };

import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { t as killProcessTree } from "./kill-tree-kSm0C74g.js";
import { r as markOpenClawExecEnv } from "./openclaw-exec-env-48iH8Lwg.js";
import "./number-coercion-EqFmHmOw.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-C10Fw_vo.js";
import { o as shouldLogVerbose, t as danger } from "./globals-BWmHKFNH.js";
import { a as resolveCommandStdio, c as decodeWindowsOutputBuffer, i as resolveWindowsCommandShim, n as isWindowsBatchCommand, r as resolveTrustedWindowsCmdExe, t as buildWindowsCmdExeCommandLine, u as resolveWindowsConsoleEncoding } from "./windows-command-D_FPG0Kg.js";
import { n as logError, t as logDebug } from "./logger-p_Dm5cGu.js";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
//#region src/process/exec.ts
const execFileAsync = promisify(execFile);
function assignChildEnvValue(params) {
	if (params.value === void 0) return;
	if (params.platform === "win32") {
		const normalizedKey = params.key.toLowerCase();
		for (const existingKey of Object.keys(params.env)) if (existingKey.toLowerCase() === normalizedKey && existingKey !== params.key) delete params.env[existingKey];
	}
	params.env[params.key] = params.value;
}
function mergeChildEnv(params) {
	const resolvedEnv = {};
	for (const [key, value] of Object.entries(params.baseEnv)) assignChildEnvValue({
		env: resolvedEnv,
		key,
		platform: params.platform,
		value
	});
	for (const [key, value] of Object.entries(params.env ?? {})) assignChildEnvValue({
		env: resolvedEnv,
		key,
		platform: params.platform,
		value
	});
	return resolvedEnv;
}
/**
* On Windows, Node 18.20.2+ (CVE-2024-27980) rejects spawning .cmd/.bat directly
* without shell, causing EINVAL. Resolve npm/npx to node + cli script so we
* spawn node.exe instead of npm.cmd.
*/
function resolveNpmArgvForWindows(argv) {
	if (process.platform !== "win32" || argv.length === 0) return null;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(argv[0])).replace(/\.(cmd|exe|bat)$/, "");
	const cliName = basename === "npx" ? "npx-cli.js" : basename === "npm" ? "npm-cli.js" : null;
	if (!cliName) return null;
	const nodeDir = path.dirname(process.execPath);
	const cliPath = path.join(nodeDir, "node_modules", "npm", "bin", cliName);
	if (!fs.existsSync(cliPath)) {
		const command = argv[0] ?? "";
		return [normalizeLowercaseStringOrEmpty(path.extname(command)) ? command : `${command}.cmd`, ...argv.slice(1)];
	}
	return [
		process.execPath,
		cliPath,
		...argv.slice(1)
	];
}
/**
* Resolves a command for Windows compatibility.
* On Windows, non-.exe commands (like pnpm, yarn) are resolved to .cmd; npm/npx
* are handled by resolveNpmArgvForWindows to avoid spawn EINVAL (no direct .cmd).
*/
function resolveCommand(command) {
	return resolveWindowsCommandShim({
		command,
		cmdCommands: [
			"corepack",
			"pnpm",
			"yarn"
		]
	});
}
function resolveChildProcessInvocation(params) {
	const finalArgv = process.platform === "win32" ? resolveNpmArgvForWindows(params.argv) ?? params.argv : params.argv;
	const resolvedCommand = finalArgv !== params.argv ? finalArgv[0] ?? "" : resolveCommand(params.argv[0] ?? "");
	const useCmdWrapper = isWindowsBatchCommand(resolvedCommand);
	return {
		command: useCmdWrapper ? resolveTrustedWindowsCmdExe() : resolvedCommand,
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
function shouldSpawnWithShell(params) {
	return false;
}
async function runExec(command, args, opts = 1e4) {
	const options = typeof opts === "number" ? {
		timeout: resolveTimerTimeoutMs(opts, 1),
		encoding: "buffer"
	} : {
		timeout: typeof opts.timeoutMs === "number" ? resolveTimerTimeoutMs(opts.timeoutMs, 1) : void 0,
		maxBuffer: opts.maxBuffer,
		cwd: opts.cwd,
		encoding: "buffer"
	};
	try {
		const invocation = resolveChildProcessInvocation({ argv: [command, ...args] });
		const { stdout, stderr } = await execFileAsync(invocation.command, invocation.args, {
			...options,
			windowsHide: invocation.windowsHide,
			windowsVerbatimArguments: invocation.windowsVerbatimArguments
		});
		const windowsEncoding = resolveWindowsConsoleEncoding();
		const decodedStdout = decodeWindowsOutputBuffer({
			buffer: stdout,
			windowsEncoding
		});
		const decodedStderr = decodeWindowsOutputBuffer({
			buffer: stderr,
			windowsEncoding
		});
		if (shouldLogVerbose()) {
			if (decodedStdout.trim()) logDebug(decodedStdout.trim());
			if (decodedStderr.trim()) logError(decodedStderr.trim());
		}
		return {
			stdout: decodedStdout,
			stderr: decodedStderr
		};
	} catch (err) {
		const windowsEncoding = resolveWindowsConsoleEncoding();
		if (err && typeof err === "object") {
			const errorWithOutput = err;
			if (Buffer.isBuffer(errorWithOutput.stdout)) errorWithOutput.stdout = decodeWindowsOutputBuffer({
				buffer: errorWithOutput.stdout,
				windowsEncoding
			});
			if (Buffer.isBuffer(errorWithOutput.stderr)) errorWithOutput.stderr = decodeWindowsOutputBuffer({
				buffer: errorWithOutput.stderr,
				windowsEncoding
			});
		}
		if (shouldLogVerbose()) logError(danger(`Command failed: ${command} ${args.join(" ")}`));
		throw err;
	}
}
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_CLOSE_STATE_POLL_MS = 10;
const COMMAND_PROCESS_TREE_KILL_GRACE_MS = 300;
const TIMEOUT_EXIT_CODE = 124;
const DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16 * 1024 * 1024;
function normalizeMaxOutputBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_COMMAND_OUTPUT_MAX_BYTES;
	return Math.max(1, Math.floor(value));
}
function appendCapturedOutput(capture, chunk, maxBytes) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	if (buffer.byteLength >= maxBytes) {
		capture.chunks = [Buffer.from(buffer.subarray(buffer.byteLength - maxBytes))];
		capture.truncatedBytes += capture.bytes + buffer.byteLength - maxBytes;
		capture.bytes = maxBytes;
		return;
	}
	capture.chunks.push(buffer);
	capture.bytes += buffer.byteLength;
	while (capture.bytes > maxBytes && capture.chunks.length > 0) {
		const first = capture.chunks[0];
		const overflow = capture.bytes - maxBytes;
		if (first.byteLength <= overflow) {
			capture.chunks.shift();
			capture.bytes -= first.byteLength;
			capture.truncatedBytes += first.byteLength;
		} else {
			capture.chunks[0] = Buffer.from(first.subarray(overflow));
			capture.bytes -= overflow;
			capture.truncatedBytes += overflow;
		}
	}
}
function resolveProcessExitCode(params) {
	return params.explicitCode ?? params.childExitCode ?? (params.usesWindowsExitCodeShim && params.resolvedSignal == null && !params.timedOut && !params.noOutputTimedOut && !params.killIssuedByTimeout && !params.killIssuedByAbort ? 0 : null);
}
function resolveCommandEnv(params) {
	const baseEnv = params.baseEnv ?? process.env;
	const platform = params.platform ?? process.platform;
	const argv = params.argv;
	const shouldSuppressNpmFund = (() => {
		const cmd = path.basename(argv[0] ?? "");
		if (cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe") return true;
		if (cmd === "node" || cmd === "node.exe") return (argv[1] ?? "").includes("npm-cli.js");
		return false;
	})();
	const resolvedEnv = mergeChildEnv({
		baseEnv,
		env: params.env,
		platform
	});
	if (shouldSuppressNpmFund) {
		if (resolvedEnv.NPM_CONFIG_FUND == null) resolvedEnv.NPM_CONFIG_FUND = "false";
		if (resolvedEnv.npm_config_fund == null) resolvedEnv.npm_config_fund = "false";
	}
	return markOpenClawExecEnv(resolvedEnv);
}
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout } : optionsOrTimeout;
	const { timeoutMs, cwd, input, baseEnv, env, noOutputTimeoutMs, signal, killProcessTree: killProcessTree$1 } = options;
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const hasInput = input !== void 0;
	const resolvedEnv = resolveCommandEnv({
		argv,
		baseEnv,
		env
	});
	const stdio = resolveCommandStdio({
		hasInput,
		preferInherit: true
	});
	const invocation = resolveChildProcessInvocation({
		argv,
		windowsVerbatimArguments: options.windowsVerbatimArguments
	});
	if (signal?.aborted) return {
		stdout: "",
		stderr: "",
		code: null,
		signal: null,
		killed: false,
		termination: "signal",
		noOutputTimedOut: false
	};
	const child = spawn(invocation.command, invocation.args, {
		stdio,
		cwd,
		env: resolvedEnv,
		...killProcessTree$1 && process.platform !== "win32" ? { detached: true } : {},
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments,
		...shouldSpawnWithShell({
			resolvedCommand: invocation.command,
			platform: process.platform
		}) ? { shell: true } : {}
	});
	return await new Promise((resolve, reject) => {
		const stdoutCapture = {
			chunks: [],
			bytes: 0,
			truncatedBytes: 0
		};
		const stderrCapture = {
			chunks: [],
			bytes: 0,
			truncatedBytes: 0
		};
		const maxOutputBytes = normalizeMaxOutputBytes(options.maxOutputBytes);
		const windowsEncoding = resolveWindowsConsoleEncoding();
		let settled = false;
		let timedOut = false;
		let noOutputTimedOut = false;
		let killIssuedByTimeout = false;
		let killIssuedByAbort = false;
		let childExitState = null;
		let closeFallbackTimer = null;
		let processTreeForceKillTimer = null;
		let noOutputTimer = null;
		const shouldTrackOutputTimeout = typeof noOutputTimeoutMs === "number" && Number.isFinite(noOutputTimeoutMs) && noOutputTimeoutMs > 0;
		const resolvedNoOutputTimeoutMs = shouldTrackOutputTimeout ? resolveTimerTimeoutMs(noOutputTimeoutMs, 1) : void 0;
		let removeAbortListener = null;
		const clearNoOutputTimer = () => {
			if (!noOutputTimer) return;
			clearTimeout(noOutputTimer);
			noOutputTimer = null;
		};
		const clearCloseFallbackTimer = () => {
			if (!closeFallbackTimer) return;
			clearTimeout(closeFallbackTimer);
			closeFallbackTimer = null;
		};
		const clearProcessTreeForceKillTimer = () => {
			if (!processTreeForceKillTimer) return;
			clearTimeout(processTreeForceKillTimer);
			processTreeForceKillTimer = null;
		};
		const killChild = (byTimeout = true) => {
			if (settled || typeof child?.kill !== "function") return;
			if (byTimeout) killIssuedByTimeout = true;
			else killIssuedByAbort = true;
			if (killProcessTree$1 && typeof child.pid === "number" && child.pid > 0) {
				if (process.platform === "win32") {
					const taskkillPath = getWindowsSystem32ExePath("taskkill.exe");
					try {
						spawn(taskkillPath, [
							"/PID",
							String(child.pid),
							"/T"
						], {
							stdio: "ignore",
							windowsHide: true
						});
						if (!processTreeForceKillTimer) {
							processTreeForceKillTimer = setTimeout(() => {
								processTreeForceKillTimer = null;
								if (settled || childExitState != null || child.exitCode != null || child.signalCode != null) return;
								try {
									spawn(taskkillPath, [
										"/PID",
										String(child.pid),
										"/T",
										"/F"
									], {
										stdio: "ignore",
										windowsHide: true
									});
								} catch {
									child.kill("SIGKILL");
								}
							}, COMMAND_PROCESS_TREE_KILL_GRACE_MS);
							processTreeForceKillTimer.unref();
						}
						return;
					} catch {}
				}
				killProcessTree(child.pid, { graceMs: COMMAND_PROCESS_TREE_KILL_GRACE_MS });
				return;
			}
			if (process.platform === "win32" && typeof child.pid === "number" && child.pid > 0) try {
				spawn(getWindowsSystem32ExePath("taskkill.exe"), [
					"/PID",
					String(child.pid),
					"/T",
					"/F"
				], {
					stdio: "ignore",
					windowsHide: true
				});
				return;
			} catch {}
			child.kill("SIGKILL");
		};
		const armNoOutputTimer = () => {
			if (!shouldTrackOutputTimeout || settled) return;
			clearNoOutputTimer();
			noOutputTimer = setTimeout(() => {
				if (settled) return;
				noOutputTimedOut = true;
				killChild();
			}, resolvedNoOutputTimeoutMs);
		};
		const timer = setTimeout(() => {
			timedOut = true;
			killChild();
		}, resolvedTimeoutMs);
		armNoOutputTimer();
		if (signal) {
			const onAbort = () => killChild(false);
			signal.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => signal.removeEventListener("abort", onAbort);
		}
		if (hasInput && child.stdin) {
			child.stdin.on("error", () => {});
			child.stdin.write(input ?? "");
			child.stdin.end();
		}
		child.stdout?.on("data", (d) => {
			appendCapturedOutput(stdoutCapture, d, maxOutputBytes);
			armNoOutputTimer();
		});
		child.stderr?.on("data", (d) => {
			appendCapturedOutput(stderrCapture, d, maxOutputBytes);
			armNoOutputTimer();
		});
		child.on("error", (err) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			clearNoOutputTimer();
			clearCloseFallbackTimer();
			clearProcessTreeForceKillTimer();
			removeAbortListener?.();
			removeAbortListener = null;
			reject(err);
		});
		child.on("exit", (code, signalResult) => {
			childExitState = {
				code,
				signal: signalResult
			};
			clearProcessTreeForceKillTimer();
			if (settled || closeFallbackTimer) return;
			closeFallbackTimer = setTimeout(() => {
				if (settled) return;
				child.stdout?.destroy();
				child.stderr?.destroy();
			}, 250);
		});
		const resolveFromClose = (code, signalValue) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			clearNoOutputTimer();
			clearCloseFallbackTimer();
			clearProcessTreeForceKillTimer();
			removeAbortListener?.();
			removeAbortListener = null;
			const resolvedSignal = childExitState?.signal ?? signalValue ?? child.signalCode ?? null;
			const resolvedCode = resolveProcessExitCode({
				explicitCode: childExitState?.code ?? code,
				childExitCode: child.exitCode,
				resolvedSignal,
				usesWindowsExitCodeShim: invocation.usesWindowsExitCodeShim,
				timedOut,
				noOutputTimedOut,
				killIssuedByTimeout,
				killIssuedByAbort
			});
			const termination = noOutputTimedOut ? "no-output-timeout" : timedOut ? "timeout" : resolvedSignal != null || killIssuedByAbort ? "signal" : "exit";
			const normalizedCode = termination === "timeout" || termination === "no-output-timeout" ? resolvedCode == null || resolvedCode === 0 ? TIMEOUT_EXIT_CODE : resolvedCode : resolvedCode;
			resolve({
				pid: child.pid ?? void 0,
				stdout: decodeWindowsOutputBuffer({
					buffer: Buffer.concat(stdoutCapture.chunks, stdoutCapture.bytes),
					windowsEncoding
				}),
				stderr: decodeWindowsOutputBuffer({
					buffer: Buffer.concat(stderrCapture.chunks, stderrCapture.bytes),
					windowsEncoding
				}),
				stdoutTruncatedBytes: stdoutCapture.truncatedBytes || void 0,
				stderrTruncatedBytes: stderrCapture.truncatedBytes || void 0,
				code: normalizedCode,
				signal: resolvedSignal,
				killed: child.killed,
				termination,
				noOutputTimedOut
			});
		};
		child.on("close", (code, signalLocal) => {
			if (process.platform !== "win32" || childExitState != null || code != null || signalLocal != null || child.exitCode != null || child.signalCode != null) {
				resolveFromClose(code, signalLocal);
				return;
			}
			const startedAt = Date.now();
			const waitForExitState = () => {
				if (settled) return;
				if (childExitState != null || child.exitCode != null || child.signalCode != null) {
					resolveFromClose(code, signalLocal);
					return;
				}
				if (Date.now() - startedAt >= WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS) {
					resolveFromClose(code, signalLocal);
					return;
				}
				setTimeout(waitForExitState, WINDOWS_CLOSE_STATE_POLL_MS);
			};
			waitForExitState();
		});
	});
}
//#endregion
export { shouldSpawnWithShell as a, runExec as i, resolveProcessExitCode as n, runCommandWithTimeout as r, resolveCommandEnv as t };

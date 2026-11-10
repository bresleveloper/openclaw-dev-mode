import { i as signalPtySessionTree } from "./kill-tree-D8IW3UNJ.mjs";
import { r as resolveEnvironmentValue } from "./process-env-BNjOnVtu.mjs";
import { n as prepareChildProcessSpawnRecorder } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-DciDw8YG.mjs";
import { a as resolveWindowsSpawnProgram, i as resolveWindowsExecutablePath, r as materializeWindowsSpawnProgram } from "./windows-spawn-BwP7BByc.mjs";
import { n as setPtyTerminalName, t as resolvePtyTerminalName } from "./pty-terminal-name-CuAEGuda.mjs";
import path from "node:path";
//#region src/process/terminal-pty.ts
function resolveTerminalNodeExecutable(env) {
	const candidate = path.win32.basename(process.execPath).toLowerCase() === "node.exe" ? process.execPath : resolveWindowsExecutablePath("node", env);
	if (path.win32.basename(candidate).toLowerCase() === "node.exe") return candidate;
	throw new Error("A Node executable is required to launch this Windows npm wrapper; add node.exe to PATH.");
}
function resolveTerminalPtyInvocation(params) {
	if (!isWindowsBatchCommand(params.file)) return {
		file: params.file,
		args: params.args
	};
	const program = resolveWindowsSpawnProgram({
		command: params.file,
		platform: process.platform,
		env: params.env,
		execPath: process.execPath,
		allowShellFallback: true
	});
	if (program.resolution !== "shell-fallback") {
		const invocation = materializeWindowsSpawnProgram(program.resolution === "node-entrypoint" ? {
			...program,
			command: resolveTerminalNodeExecutable(params.env)
		} : program, params.args);
		return {
			file: invocation.command,
			args: invocation.argv
		};
	}
	return {
		file: resolveEnvironmentValue(params.env, "COMSPEC")?.trim() || resolveTrustedWindowsCmdExe(),
		args: `/d /s /c ${buildWindowsCmdExeCommandLine(params.file, params.args)}`
	};
}
function bunTerminalHasFlowControl() {
	return typeof globalThis.Bun?.Terminal?.prototype?.pause === "function";
}
async function spawnTerminalPty(params, lifecycle) {
	const assertCurrent = () => {
		lifecycle?.assertCurrent?.();
		if (lifecycle?.abortSignal?.aborted) throw new Error("PTY construction aborted");
	};
	if (process.versions.bun && process.platform !== "win32" && !bunTerminalHasFlowControl()) {
		const recordSpawn = prepareChildProcessSpawnRecorder(params.file, params.args);
		const { spawnNodeTerminalPty } = await import("./terminal-pty-node-Ai4Fl3E7.mjs");
		assertCurrent();
		const pty = await spawnNodeTerminalPty(params, assertCurrent, lifecycle?.initiateSpawn);
		if (pty.pid > 0) recordSpawn?.();
		return pty;
	}
	const launch = await prepareTerminalPty(params);
	assertCurrent();
	return lifecycle?.initiateSpawn ? lifecycle.initiateSpawn(launch) : launch();
}
/** Load the native backend before a remote host grants the final synchronous launch. */
async function prepareTerminalPty(params) {
	const recordSpawn = prepareChildProcessSpawnRecorder(params.file, params.args);
	const env = params.env ? { ...params.env } : void 0;
	const terminalName = resolvePtyTerminalName(params.name ?? resolveEnvironmentValue(env ?? process.env, "TERM", process.platform));
	if (env) setPtyTerminalName({
		env,
		name: terminalName,
		platform: process.platform
	});
	if (process.versions.bun && process.platform !== "win32") {
		const { spawnBunTerminalPty } = await import("./terminal-pty-bun-3a8tSy_k.mjs");
		const bunEnv = env ?? inheritedTerminalEnv(terminalName);
		bunEnv.PWD = params.cwd ?? process.cwd();
		return () => {
			const pty = spawnBunTerminalPty({
				...params,
				env: bunEnv,
				name: terminalName
			});
			if (pty.pid > 0) recordSpawn?.();
			return pty;
		};
	}
	const { spawn } = await import("@lydell/node-pty");
	const invocation = resolveTerminalPtyInvocation({
		file: params.file,
		args: params.args,
		env: env ?? process.env
	});
	return () => {
		const pty = spawn(invocation.file, invocation.args, {
			name: terminalName,
			cols: params.cols,
			rows: params.rows,
			cwd: params.cwd,
			env
		});
		if (pty.pid > 0) recordSpawn?.();
		else if (recordSpawn && process.platform === "win32") {
			let settled = false;
			const observe = (exited = false) => {
				if (settled || pty.pid <= 0 && !exited) return;
				settled = true;
				if (pty.pid > 0) recordSpawn();
				dataSubscription.dispose();
				exitSubscription.dispose();
			};
			const dataSubscription = pty.onData(() => observe());
			const exitSubscription = pty.onExit(() => observe(true));
		}
		return {
			get pid() {
				return pty.pid;
			},
			write: (data) => pty.write(data),
			resize: (cols, rows) => pty.resize(cols, rows),
			pause: () => pty.pause(),
			resume: () => pty.resume(),
			onData: (listener) => pty.onData(listener),
			onExit: (listener) => pty.onExit(listener),
			kill: (signal) => signalTerminalPtyTree(pty.pid, signal, (sig) => process.platform === "win32" ? pty.kill() : pty.kill(sig))
		};
	};
}
const HOST_TERMINAL_ENV_KEYS = /* @__PURE__ */ new Set([
	"TMUX",
	"TMUX_PANE",
	"STY",
	"WINDOW",
	"WINDOWID",
	"TERMCAP",
	"COLUMNS",
	"LINES"
]);
function inheritedTerminalEnv(terminalName) {
	const env = {};
	for (const [key, value] of Object.entries(process.env)) if (value !== void 0 && !HOST_TERMINAL_ENV_KEYS.has(key)) env[key] = value;
	env.TERM = terminalName;
	return env;
}
function signalTerminalPtyTree(pid, signal, signalDirect) {
	const sig = signal ?? "SIGKILL";
	try {
		if ((sig === "SIGKILL" || sig === "SIGTERM") && pid > 0) signalPtySessionTree(pid, sig);
		else signalDirect(sig);
	} catch {}
}
//#endregion
export { signalTerminalPtyTree as n, spawnTerminalPty as r, prepareTerminalPty as t };

import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { a as shouldSkipRespawnForArgv, o as shouldSkipStartupEnvironmentRespawnForArgv, r as isTerminalInteractiveRespawnArgv } from "./respawn-policy-XYVGlIrI.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as normalizeWindowsArgv } from "./windows-argv-YUCPtVGt.mjs";
import { t as attachChildProcessBridge } from "./child-process-bridge-b1ugIZyM.mjs";
import { r as signalProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CnxxjID9.mjs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
//#region src/process/respawn-child-runner.ts
const RESPAWN_SIGNAL_EXIT_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS = 1e3;
/** Complete only after child stdio and any failed-spawn diagnostics have settled. */
function runRespawnChildWithSignalBridge(params) {
	const { command, args, env, runtime, onError } = params;
	const stdioIsTerminal = params.stdioIsTerminal ?? (process.stdin.isTTY || process.stdout.isTTY);
	const detachForProcessTree = params.detachForProcessTree === true && process.platform !== "win32" && !stdioIsTerminal;
	const child = runtime.spawn(command, args, {
		stdio: "inherit",
		env,
		detached: detachForProcessTree,
		windowsHide: !stdioIsTerminal
	});
	let signalExitTimer;
	let signalForceKillTimer;
	let firstForwardedSignal;
	let hardKillBackstopStarted = false;
	let childExited = false;
	const clearSignalTimers = () => {
		clearTimeout(signalExitTimer);
		clearTimeout(signalForceKillTimer);
		signalExitTimer = void 0;
		signalForceKillTimer = void 0;
	};
	const signalChild = (signal) => {
		try {
			if (detachForProcessTree && typeof child.pid === "number" && child.pid > 0) signalProcessTree(child.pid, signal, { detached: true });
			else child.kill(signal === "SIGKILL" && process.platform === "win32" ? "SIGTERM" : signal);
		} catch {}
	};
	const requestChildTermination = () => {
		signalChild("SIGTERM");
		signalForceKillTimer = setTimeout(() => {
			hardKillBackstopStarted = true;
			signalChild("SIGKILL");
		}, RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS);
		signalForceKillTimer.unref?.();
	};
	const scheduleParentExit = (signal) => {
		if (childExited) return;
		firstForwardedSignal ??= signal;
		if (signalExitTimer) return;
		signalExitTimer = setTimeout(() => {
			requestChildTermination();
		}, RESPAWN_SIGNAL_EXIT_GRACE_MS);
		signalExitTimer.unref?.();
	};
	const bridge = runtime.attachChildProcessBridge(child, { onSignal: scheduleParentExit });
	child.once("exit", () => {
		childExited = true;
		if (firstForwardedSignal && detachForProcessTree) signalChild("SIGKILL");
		clearSignalTimers();
	});
	return new Promise((resolve) => {
		let failed = false;
		let reporting = Promise.resolve();
		child.on("error", (error) => {
			if (child.pid !== void 0 || failed) return;
			failed = true;
			clearSignalTimers();
			try {
				reporting = Promise.resolve(onError(error)).catch(() => void 0);
			} catch {}
		});
		child.once("close", (code, signal) => {
			childExited = true;
			clearSignalTimers();
			const signalCode = signal && os.constants.signals[signal];
			const forwardedSignalExitCode = !hardKillBackstopStarted && signal === firstForwardedSignal ? signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : void 0 : void 0;
			const exitCode = failed ? 1 : signal ? process.platform === "win32" ? forwardedSignalExitCode ?? 1 : signalCode ? 128 + signalCode : 1 : code ?? 1;
			resolve(reporting.then(() => {
				bridge.detach();
				if (!failed && signal && process.platform !== "win32") process.kill(process.pid, signal);
				return exitCode;
			}));
		});
	});
}
//#endregion
//#region src/entry.respawn.ts
const EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
const OPENCLAW_NODE_OPTIONS_READY = "OPENCLAW_NODE_OPTIONS_READY";
const OPENCLAW_NODE_EXTRA_CA_CERTS_READY = "OPENCLAW_NODE_EXTRA_CA_CERTS_READY";
const WINDOWS_STACK_SIZE_FLAG = "--stack-size=8192";
function pathModuleForPlatform(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
function resolveCliRespawnCommand(params) {
	const basename = pathModuleForPlatform(params.platform ?? process.platform).basename(params.execPath).toLowerCase();
	if (basename === "volta-shim" || basename === "volta-shim.exe") return "node";
	return params.execPath;
}
function hasExperimentalWarningSuppressed(params = {}) {
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const nodeOptions = env.NODE_OPTIONS ?? "";
	if (nodeOptions.includes(EXPERIMENTAL_WARNING_FLAG) || nodeOptions.includes("--no-warnings")) return true;
	return execArgv.some((arg) => arg === EXPERIMENTAL_WARNING_FLAG || arg === "--no-warnings");
}
function hasStackSizeConfigured(execArgv) {
	return execArgv.some((arg) => arg === "--stack-size" || arg.startsWith("--stack-size=") || arg === "--stack_size" || arg.startsWith("--stack_size="));
}
function buildCliRespawnPlan(params = {}) {
	const argv = params.argv ?? process.argv;
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const execPath = params.execPath ?? process.execPath;
	const platform = params.platform ?? process.platform;
	const normalizedArgv = platform === "win32" ? normalizeWindowsArgv(argv, {
		platform,
		execPath
	}) : argv;
	if (shouldSkipStartupEnvironmentRespawnForArgv(normalizedArgv, platform) || isTruthyEnvValue(env.OPENCLAW_NO_RESPAWN)) return null;
	const childEnv = { ...env };
	if (!readNonBlankString(childEnv.NODE_EXTRA_CA_CERTS)) delete childEnv.NODE_EXTRA_CA_CERTS;
	const childExecArgv = [...execArgv];
	let needsRespawn = false;
	if (platform === "win32") {
		if (!hasStackSizeConfigured(childExecArgv)) {
			childExecArgv.unshift(WINDOWS_STACK_SIZE_FLAG);
			needsRespawn = true;
		}
		if (!needsRespawn) return null;
		return {
			command: resolveCliRespawnCommand({
				execPath,
				platform
			}),
			argv: [...childExecArgv, ...normalizedArgv.slice(1)],
			env: childEnv,
			detachForProcessTree: false
		};
	}
	const autoNodeExtraCaCerts = params.autoNodeExtraCaCerts ?? resolveNodeStartupTlsEnvironment({
		env,
		execPath,
		includeDarwinDefaults: false
	}).NODE_EXTRA_CA_CERTS;
	if (autoNodeExtraCaCerts && !isTruthyEnvValue(env[OPENCLAW_NODE_EXTRA_CA_CERTS_READY]) && !childEnv.NODE_EXTRA_CA_CERTS) {
		childEnv.NODE_EXTRA_CA_CERTS = autoNodeExtraCaCerts;
		childEnv[OPENCLAW_NODE_EXTRA_CA_CERTS_READY] = "1";
		needsRespawn = true;
	}
	if (!shouldSkipRespawnForArgv(argv, platform) && !isTruthyEnvValue(env[OPENCLAW_NODE_OPTIONS_READY]) && !hasExperimentalWarningSuppressed({
		env,
		execArgv
	})) {
		childEnv[OPENCLAW_NODE_OPTIONS_READY] = "1";
		childExecArgv.unshift(EXPERIMENTAL_WARNING_FLAG);
		needsRespawn = true;
	}
	if (!needsRespawn) return null;
	return {
		command: resolveCliRespawnCommand({
			execPath,
			platform
		}),
		argv: [...childExecArgv, ...argv.slice(1)],
		env: childEnv,
		detachForProcessTree: !isTerminalInteractiveRespawnArgv(argv)
	};
}
async function runCliRespawnPlan(plan, runtime, writeError = (message, error) => console.error(message, error)) {
	const resolvedRuntime = runtime ?? {
		spawn,
		attachChildProcessBridge,
		writeError
	};
	process.exitCode = await runRespawnChildWithSignalBridge({
		command: plan.command,
		args: plan.argv,
		env: plan.env,
		detachForProcessTree: plan.detachForProcessTree,
		runtime: resolvedRuntime,
		onError: (error) => {
			return resolvedRuntime.writeError("[openclaw] Failed to respawn CLI:", error instanceof Error ? error.stack ?? error.message : error);
		}
	});
}
//#endregion
export { runCliRespawnPlan as n, runRespawnChildWithSignalBridge as r, buildCliRespawnPlan as t };

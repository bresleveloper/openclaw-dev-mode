import { n as getCommandPathWithRootOptions } from "./argv-IYTsfFsq.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-L1ml5gbH.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { t as normalizeWindowsArgv } from "./windows-argv-C3HwI-HD.mjs";
import { t as attachChildProcessBridge } from "./child-process-bridge-CFJsa4sQ.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CE_a1k52.mjs";
import path from "node:path";
import { spawn } from "node:child_process";
//#region src/cli/respawn-policy.ts
const INTERACTIVE_TTY_COMMANDS = /* @__PURE__ */ new Set([
	"tui",
	"terminal",
	"chat"
]);
/** Gmail owns a shutdown grace period longer than the generic respawn wrapper allows. */
function isForegroundGmailRunArgv(argv) {
	return getCommandPathWithRootOptions(argv, 3).join(" ") === "webhooks gmail run";
}
function isNativeHookRelayArgv(argv) {
	const { commandPath } = resolveCliArgvInvocation(argv);
	return commandPath[0] === "hooks" && commandPath[1] === "relay";
}
function shouldKeepNativeHookRelayInProcess(argv, platform) {
	return platform !== "win32" && isNativeHookRelayArgv(argv);
}
function isInteractiveTtyCommandArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.primary !== null && INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
function isTerminalInteractiveRespawnArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion) return false;
	return invocation.primary === null || INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
/** Returns whether CLI startup should avoid the general respawn wrapper for this argv. */
function shouldSkipRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	const isGatewayStatus = invocation.commandPath.length === 2 && invocation.commandPath[0] === "gateway" && invocation.commandPath[1] === "status";
	return invocation.hasHelpOrVersion || isInteractiveTtyCommandArgv(argv) || isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform) || isGatewayStatus || invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv);
}
/** Returns whether startup-environment respawn should be skipped without suppressing TUI respawn policy. */
function shouldSkipStartupEnvironmentRespawnForArgv(argv, platform = process.platform) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.hasHelpOrVersion || isForegroundGmailRunArgv(argv) || shouldKeepNativeHookRelayInProcess(argv, platform) || invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv);
}
//#endregion
//#region src/process/respawn-child-runner.ts
const RESPAWN_SIGNAL_EXIT_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS = 1e3;
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
	let signalHardExitTimer;
	let parentSignalReceived = false;
	let firstForwardedSignal;
	let hardKillBackstopStarted = false;
	const clearSignalTimers = () => {
		if (signalExitTimer) {
			clearTimeout(signalExitTimer);
			signalExitTimer = void 0;
		}
		if (signalForceKillTimer) {
			clearTimeout(signalForceKillTimer);
			signalForceKillTimer = void 0;
		}
		if (signalHardExitTimer) {
			clearTimeout(signalHardExitTimer);
			signalHardExitTimer = void 0;
		}
	};
	const signalChild = (signal) => {
		if (detachForProcessTree && typeof child.pid === "number" && child.pid > 0) {
			signalProcessTree(child.pid, signal, { detached: true });
			return;
		}
		child.kill(signal === "SIGKILL" && process.platform === "win32" ? "SIGTERM" : signal);
	};
	const forceKillChild = () => {
		try {
			signalChild("SIGKILL");
		} catch {}
	};
	const requestChildTermination = () => {
		try {
			signalChild("SIGTERM");
		} catch {}
		signalForceKillTimer = setTimeout(() => {
			hardKillBackstopStarted = true;
			forceKillChild();
			signalHardExitTimer = setTimeout(() => {
				runtime.exit(1);
			}, RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS);
			signalHardExitTimer.unref?.();
		}, RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS);
		signalForceKillTimer.unref?.();
	};
	const scheduleParentExit = (signal) => {
		parentSignalReceived = true;
		firstForwardedSignal ??= signal;
		if (signalExitTimer) return;
		signalExitTimer = setTimeout(() => {
			requestChildTermination();
		}, RESPAWN_SIGNAL_EXIT_GRACE_MS);
		signalExitTimer.unref?.();
	};
	runtime.attachChildProcessBridge(child, { onSignal: scheduleParentExit });
	child.once("exit", (code, signal) => {
		if (parentSignalReceived && detachForProcessTree) forceKillChild();
		clearSignalTimers();
		if (signal) {
			if (process.platform !== "win32") {
				process.kill(process.pid, signal);
				return;
			}
			const forwardedSignalExitCode = !hardKillBackstopStarted && signal === firstForwardedSignal ? signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : void 0 : void 0;
			runtime.exit(forwardedSignalExitCode ?? 1);
			return;
		}
		runtime.exit(code ?? 1);
	});
	child.on("error", (error) => {
		if (child.pid !== void 0) return;
		clearSignalTimers();
		const reporting = onError(error);
		const exit = () => runtime.exit(1);
		if (reporting) reporting.then(exit, exit);
		else exit();
	});
	return child;
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
function runCliRespawnPlan(plan, runtime, writeError = (message, error) => console.error(message, error)) {
	const resolvedRuntime = runtime ?? {
		spawn,
		attachChildProcessBridge,
		exit: process.exit.bind(process),
		writeError
	};
	return runRespawnChildWithSignalBridge({
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
export { isNativeHookRelayArgv as a, isForegroundGmailRunArgv as i, runCliRespawnPlan as n, isTerminalInteractiveRespawnArgv as o, runRespawnChildWithSignalBridge as r, shouldKeepNativeHookRelayInProcess as s, buildCliRespawnPlan as t };

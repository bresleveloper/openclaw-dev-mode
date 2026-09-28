import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { i as markOpenClawExecEnv } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as getSpawnBroker } from "./context-5XyHo0If.mjs";
import { t as BrokerChild } from "./child-C7738Y0I.mjs";
import { n as isChildProcessTreeAlive } from "./child-process-tree-Cmpyfjdc.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { n as recordChildProcessSpawn } from "./spawn-utils-BqNqLiIK.mjs";
import { r as resolveSafeChildProcessInvocation } from "./windows-command-C3zotBKl.mjs";
import process from "node:process";
import { stripVTControlCharacters } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { once } from "node:events";
import { execa } from "execa";
//#region src/process/spawn-broker/execa-message.ts
const decoder = new TextDecoder();
const commonEscapes = /* @__PURE__ */ new Map([
	[" ", " "],
	["\n", "\n"],
	["\b", "\\b"],
	["\f", "\\f"],
	["\r", "\\r"],
	["	", "\\t"]
]);
function renderOutput(output) {
	let text = typeof output === "string" ? output : decoder.decode(output);
	if (text.endsWith("\n")) text = text.slice(0, text.endsWith("\r\n") ? -2 : -1);
	return stripVTControlCharacters(text).replace(/[\p{Separator}\p{Other}]/gu, (character) => {
		const common = commonEscapes.get(character);
		if (common !== void 0) return common;
		const codepoint = character.codePointAt(0);
		const hex = codepoint.toString(16);
		return codepoint <= 65535 ? `\\u${hex.padStart(4, "0")}` : `\\U${hex}`;
	});
}
function decodeExecaMessage(encoded, output) {
	return encoded.messageOutputs ? [encoded.message, ...encoded.messageOutputs.map((stream) => renderOutput(output[stream]))].join("\n\n") : encoded.message;
}
//#endregion
//#region src/process/spawn-broker/execa-protocol.ts
function restoreError(error, output) {
	const restored = new Error(decodeExecaMessage(error, output), { cause: error.cause ? restoreError(error.cause, output) : void 0 });
	return Object.assign(restored, {
		name: error.name,
		code: error.code
	});
}
/** Failed reject:false results are still Errors, as they are with local execa. */
function restoreExecaResult(result) {
	const { error, ...received } = result;
	const properties = {
		...received,
		stdout: received.stdout,
		stderr: received.stderr,
		shortMessage: received.shortMessage,
		code: received.code
	};
	if (error) {
		const restored = restoreError(error, properties);
		return Object.assign(restored, properties, { cause: restored.cause });
	}
	return {
		...properties,
		cause: void 0
	};
}
//#endregion
//#region src/process/spawn-broker/execa-client.ts
const SERIALIZABLE_OPTIONS = /* @__PURE__ */ new Set([
	"buffer",
	"cancelSignal",
	"cwd",
	"detached",
	"encoding",
	"env",
	"extendEnv",
	"forceKillAfterDelay",
	"input",
	"killDescendants",
	"killSignal",
	"maxBuffer",
	"reject",
	"shell",
	"stderr",
	"stdin",
	"stdio",
	"stdout",
	"stripFinalNewline",
	"timeout",
	"windowsHide",
	"windowsVerbatimArguments"
]);
function isOutputOption(value) {
	return value === void 0 || value === "pipe" || value === "ignore" || value === "inherit" || typeof value === "object" && value !== null && "file" in value && typeof value.file === "string" && Object.keys(value).length === 1;
}
/** Unsupported native descriptors and independent-lifetime commands remain explicit local paths. */
function brokerExecaOptions(options) {
	if (options.ipc || options.cleanup === false || typeof options.stdin === "number") return;
	if (options.stdout === "inherit" || options.stderr === "inherit" || options.stdio === "inherit" || typeof options.stdout === "number" || typeof options.stderr === "number") return;
	if (options.stdio && typeof options.stdio !== "string" && options.stdio.some((entry, fd) => typeof entry === "number" || fd > 0 && entry === "inherit")) return;
	for (const key of Object.keys(options)) if (!SERIALIZABLE_OPTIONS.has(key)) throw new TypeError(`Unsupported spawn broker execa option: ${key}`);
	if (options.cwd !== void 0 && typeof options.cwd !== "string" || options.input !== void 0 && typeof options.input !== "string" && !(options.input instanceof Uint8Array) || options.stdin !== void 0 && options.stdin !== "pipe" && options.stdin !== "ignore" && options.stdin !== "inherit" || !isOutputOption(options.stdout) || !isOutputOption(options.stderr) || options.shell !== void 0 && options.shell !== false) throw new TypeError("Unsupported spawn broker execa stream or invocation options");
	if (options.stdio !== void 0 && typeof options.stdio === "string" && options.stdio !== "pipe" && options.stdio !== "ignore") throw new TypeError("Unsupported spawn broker execa stdio");
	if (Array.isArray(options.stdio) && (options.stdio.length !== 3 || ![
		"pipe",
		"ignore",
		"inherit"
	].includes(String(options.stdio[0])) || !isOutputOption(options.stdio[1]) || !isOutputOption(options.stdio[2]))) throw new TypeError("Unsupported spawn broker execa stdio");
	const { cancelSignal: _cancelSignal, ...serializable } = options;
	return serializable;
}
function spawnBrokerCommand(host, argv, options, prepared) {
	const remote = host.spawnExeca(argv, prepared);
	const child = remote.child;
	const closed = child.waitForClose();
	const onAbort = () => {
		child.killed = true;
		remote.cancel();
	};
	options.cancelSignal?.addEventListener("abort", onAbort, { once: true });
	if (options.cancelSignal?.aborted) onAbort();
	const promise = remote.result.then(async (result) => {
		await closed;
		const restored = restoreExecaResult(result);
		if (restored instanceof Error && (options.reject !== false || restored.code === "ERR_SPAWN_BROKER_UNAVAILABLE")) throw restored;
		return restored;
	}).finally(() => options.cancelSignal?.removeEventListener("abort", onAbort));
	promise.catch(() => {});
	once(child, "spawn").then(() => {
		setImmediate(() => {
			for (const stream of [child.stdout, child.stderr]) if (stream?.readableFlowing === null) stream.resume();
		});
	}, () => {});
	const properties = {
		nodeChildProcess: child,
		get pid() {
			return child.pid;
		},
		get stdin() {
			return child.stdin;
		},
		get stdout() {
			return child.stdout;
		},
		get stderr() {
			return child.stderr;
		},
		kill: (signal) => child.kill(signal ?? options.killSignal)
	};
	const command = Object.assign(promise, properties);
	return Object.defineProperties(command, Object.getOwnPropertyDescriptors(properties));
}
/** Remote PID and pipes arrive together before admission or stream subscription. */
async function waitForCommandSpawn(child) {
	if (child.nodeChildProcess instanceof BrokerChild) try {
		await child.nodeChildProcess.ready();
	} catch {
		await child;
	}
}
const commandProcessScope = new AsyncLocalStorage();
function resolveCommandProcessSignal(signal) {
	const inherited = commandProcessScope.getStore()?.signal;
	return inherited ? AbortSignal.any(signal ? [inherited, signal] : [inherited]) : signal;
}
/** Cleanup helpers must outlive cancellation of the commands they are settling. */
function runOutsideCommandProcessScope(run) {
	return commandProcessScope.exit(run);
}
/** Join the command owner's cleanup separately from its bounded caller result. */
function retainCommandProcessCleanup(cleanup) {
	const scope = commandProcessScope.getStore();
	if (!scope) return;
	const settled = cleanup.then((result) => {
		if (result === "uncertain") scope.failure ??= { error: new CommandProcessCleanupError() };
	}, (error) => {
		scope.failure ??= { error };
	});
	scope.cleanups.add(settled);
	settled.then(() => scope.cleanups.delete(settled));
}
/** Terminal command deadlines stop and join children before the caller permits rollback. */
async function withCommandProcessScope(run, signal) {
	const parent = commandProcessScope.getStore();
	const controller = new AbortController();
	const inherited = resolveCommandProcessSignal(signal);
	const scope = {
		signal: inherited ? AbortSignal.any([inherited, controller.signal]) : controller.signal,
		children: /* @__PURE__ */ new Set(),
		cleanups: /* @__PURE__ */ new Set()
	};
	const stop = () => {
		controller.abort();
		for (const child of scope.children) try {
			child.stop();
		} catch (error) {
			scope.failure ??= { error };
		}
	};
	let settlement;
	const settle = () => settlement ??= settleCommands();
	async function settleCommands() {
		stop();
		await Promise.all([...scope.children].map(async (child) => {
			try {
				await child.settle();
			} catch (error) {
				scope.failure ??= { error };
			}
		}));
		while (scope.cleanups.size > 0) await Promise.all(scope.cleanups);
	}
	const nested = {
		stop,
		async settle() {
			await settle();
			if (scope.failure) throw new CommandProcessCleanupError({ cause: scope.failure.error });
		}
	};
	parent?.children.add(nested);
	const completion = commandProcessScope.run(scope, async () => {
		let outcome;
		try {
			outcome = { result: await run(stop) };
		} catch (error) {
			outcome = { error };
			if (parent && hasCommandProcessCleanupError(error)) parent.failure ??= { error };
		}
		await settle();
		if (scope.failure) {
			const cause = "error" in outcome ? outcome.error === scope.failure.error ? outcome.error : new AggregateError([outcome.error, scope.failure.error], "Command and cleanup failed", { cause: outcome.error }) : scope.failure.error;
			throw new CommandProcessCleanupError({ cause });
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.result;
	});
	completion.then(() => parent?.children.delete(nested), (error) => {
		if (parent && hasCommandProcessCleanupError(error)) parent.failure ??= { error };
		parent?.children.delete(nested);
	});
	return await completion;
}
function retainCommandProcess(scope, child) {
	let pid;
	let startedAt = null;
	let stopped = false;
	const nativeChild = child.nodeChildProcess;
	let observedExit = nativeChild.exitCode != null || nativeChild.signalCode != null;
	const onExit = () => {
		observedExit = true;
	};
	nativeChild.once("exit", onExit);
	const closed = nativeChild instanceof BrokerChild ? nativeChild.waitForClose() : void 0;
	const stop = () => {
		if (stopped || pid === void 0 || process.platform === "win32") return;
		stopped = true;
		if (nativeChild.exitCode !== null || nativeChild.signalCode !== null) {
			const currentStart = getFileLockProcessStartTime(pid);
			if (currentStart !== null && currentStart !== startedAt) throw new CommandProcessCleanupError();
		}
		killProcessTree(pid, {
			detached: true,
			force: true
		});
	};
	const initialize = () => {
		pid = child.pid;
		if (pid !== void 0 && process.platform !== "win32") {
			startedAt = getFileLockProcessStartTime(pid);
			if (scope.signal.aborted) stop();
		}
	};
	const readiness = child.nodeChildProcess instanceof BrokerChild && child.pid === void 0 ? child.nodeChildProcess.ready().then(initialize) : Promise.resolve(initialize());
	const completed = Promise.resolve(child).then(() => void 0, () => void 0).then(async () => {
		await closed;
		nativeChild.removeListener("exit", onExit);
	});
	const initialized = readiness.catch((error) => {
		if (!(nativeChild instanceof BrokerChild && nativeChild.notStarted)) scope.failure ??= { error };
	});
	const owned = {
		stop,
		async settle() {
			await initialized;
			await completed;
			if (pid === void 0) {
				if (nativeChild instanceof BrokerChild && !nativeChild.notStarted) throw new CommandProcessCleanupError();
				return;
			}
			if (process.platform === "win32") {
				if (!observedExit) throw new CommandProcessCleanupError();
				return;
			}
			const deadline = Date.now() + 300;
			while (isChildProcessTreeAlive({ pid })) {
				const currentStart = getFileLockProcessStartTime(pid);
				const remaining = deadline - Date.now();
				if (currentStart !== null && currentStart !== startedAt || remaining <= 0) throw new CommandProcessCleanupError();
				await new Promise((resolve) => {
					setTimeout(resolve, Math.min(25, remaining));
				});
			}
		}
	};
	scope.children.add(owned);
	completed.then(() => {
		if (pid !== void 0 && process.platform !== "win32" && !isChildProcessTreeAlive({ pid })) scope.children.delete(owned);
	});
}
function shouldSpawnWithShell(params) {
	return false;
}
function spawnCommandWithInvocation(argv, options = {}) {
	const scope = commandProcessScope.getStore();
	if (scope?.signal.aborted) throw new Error("Command process scope is closed");
	const { baseEnv, env, windowsVerbatimArguments, cancelSignal, inheritScopeCancellation = true, ...execaOptions } = options;
	const commandEnv = resolveCommandEnv({
		argv,
		baseEnv,
		env
	});
	const invocation = resolveSafeChildProcessInvocation({
		argv,
		cwd: execaOptions.cwd,
		env: commandEnv,
		windowsVerbatimArguments
	});
	const commandOptions = {
		...execaOptions,
		cancelSignal: inheritScopeCancellation ? resolveCommandProcessSignal(cancelSignal) : cancelSignal,
		...scope ? { killDescendants: true } : {},
		env: commandEnv,
		extendEnv: false,
		shell: false,
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	};
	const broker = getSpawnBroker();
	const remoteOptions = broker ? brokerExecaOptions(commandOptions) : void 0;
	const child = broker && remoteOptions ? spawnBrokerCommand(broker, [invocation.command, ...invocation.args], commandOptions, remoteOptions) : execa(invocation.command, invocation.args, commandOptions);
	recordChildProcessSpawn(invocation.command, child.nodeChildProcess);
	if (scope) retainCommandProcess(scope, child);
	return {
		child,
		invocation
	};
}
/** Spawn through the canonical argv, environment, and Windows safety boundary. */
function spawnCommand(argv, options = {}) {
	return spawnCommandWithInvocation(argv, options).child;
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
	const resolvedEnv = mergeProcessEnv([baseEnv, params.env], platform);
	if (shouldSuppressNpmFund) {
		if (resolvedEnv.NPM_CONFIG_FUND == null) resolvedEnv.NPM_CONFIG_FUND = "false";
		if (resolvedEnv.npm_config_fund == null) resolvedEnv.npm_config_fund = "false";
	}
	return markOpenClawExecEnv(resolvedEnv);
}
//#endregion
export { shouldSpawnWithShell as a, waitForCommandSpawn as c, runOutsideCommandProcessScope as i, withCommandProcessScope as l, resolveCommandProcessSignal as n, spawnCommand as o, retainCommandProcessCleanup as r, spawnCommandWithInvocation as s, resolveCommandEnv as t };

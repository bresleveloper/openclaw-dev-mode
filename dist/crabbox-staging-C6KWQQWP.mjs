import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as resolveWindowsSystem32Path, r as resolveWindowsCmdExePath, t as buildCmdExeCommandLine } from "./windows-cmd-helpers-6q_bkE4I.mjs";
import fs, { accessSync, chmodSync, closeSync, constants, fchmodSync, fstatSync, fsyncSync, lstatSync, mkdirSync, mkdtempSync, openSync, opendirSync, readSync, readdirSync, readlinkSync, realpathSync, renameSync, rmSync, rmdirSync, statSync, writeFileSync, writeSync } from "node:fs";
import path, { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { constants as constants$1, tmpdir } from "node:os";
import { Writable } from "node:stream";
import { isUtf8 } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region scripts/lib/vitest-resource-ownership.mts
const OWNER_DIRECTORY = ".vitest-resource-owner";
const ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
function readReceipt$1(file) {
	const fd = fs.openSync(file, "r");
	try {
		const buffer = Buffer.alloc(128);
		return buffer.subarray(0, fs.readSync(fd, buffer)).toString("utf8");
	} finally {
		fs.closeSync(fd);
	}
}
function resourceOwner(root, identity) {
	const directory = path.join(root, OWNER_DIRECTORY);
	const ownerFile = path.join(directory, "owner");
	const claims = path.join(directory, "claims");
	const verifyOwner = () => {
		if (readReceipt$1(ownerFile) !== identity) throw new Error(`Vitest resource owner changed: ${root}`);
	};
	return {
		root,
		claim() {
			verifyOwner();
			const id = randomUUID();
			const claim = path.join(claims, id);
			fs.mkdirSync(claim);
			return () => {
				verifyOwner();
				fs.writeFileSync(path.join(claim, "released"), `${identity}:${id}`, { flag: "wx" });
			};
		},
		assertReleased() {
			verifyOwner();
			for (const id of fs.readdirSync(claims)) {
				const receipt = path.join(claims, id, "released");
				try {
					if (ID_PATTERN.test(id) && readReceipt$1(receipt) === `${identity}:${id}`) continue;
				} catch {}
				throw new Error(`Unreleased Vitest resource claim: ${path.join(claims, id)}`);
			}
		}
	};
}
/** Discover only explicit containing owners, including canonical TMP symlinks. */
function findVitestResourceOwner(root = tmpdir()) {
	let current = path.resolve(root);
	while (true) {
		try {
			current = fs.realpathSync(current);
			fs.lstatSync(path.join(current, OWNER_DIRECTORY));
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			const parent = path.dirname(current);
			if (parent === current) return;
			current = parent;
			continue;
		}
		const identity = readReceipt$1(path.join(current, OWNER_DIRECTORY, "owner"));
		if (!ID_PATTERN.test(identity)) throw new Error(`Invalid Vitest resource owner: ${current}`);
		return resourceOwner(current, identity);
	}
}
//#endregion
//#region scripts/lib/windows-taskkill.mjs
/**
* @param {NodeJS.ProcessEnv} [env]
* @returns {string}
*/
function resolveWindowsTaskkillPath(env = process.env) {
	return resolveWindowsSystem32Path("taskkill.exe", env);
}
//#endregion
//#region scripts/lib/managed-child-process.mts
const FORWARDED_SIGNALS = [
	"SIGINT",
	"SIGTERM",
	"SIGHUP"
];
const FORCE_KILL_DELAY_MS = 5e3;
const PROCESS_GROUP_DRAIN_TIMEOUT_MS = 5e3;
const PROCESS_GROUP_POLL_MS = 25;
const TASKKILL_TIMEOUT_MS = 1e4;
const managedChildren = /* @__PURE__ */ new Set();
const signalHandlers = /* @__PURE__ */ new Map();
const windowsJobs = /* @__PURE__ */ new WeakMap();
const windowsTerminations = /* @__PURE__ */ new WeakMap();
/** Resolve platform code before spawning so callers can attach listeners synchronously. */
function loadManagedChildSpawner(platform = process.platform) {
	if (platform !== "win32") return spawn;
	return import("./managed-windows-job-DdQBtfHJ.mjs").then(({ spawnWindowsJobChild }) => {
		function spawnManagedChild(command, args, options) {
			const owned = spawnWindowsJobChild(command, args, options);
			if (!owned) return spawn(command, args, options);
			windowsJobs.set(owned.child, owned.job);
			return owned.child;
		}
		return spawnManagedChild;
	});
}
function observeWindowsTree(child) {
	const job = windowsJobs.get(child);
	if (!job) return windowsTerminations.get(child) ?? { processTreeState: "indeterminate" };
	try {
		const survivingPids = job.inspect();
		return {
			processTreeState: survivingPids.length === 0 ? "terminated" : "indeterminate",
			survivingPids
		};
	} catch (error) {
		return {
			processTreeState: "indeterminate",
			error: error instanceof Error ? error : new Error(String(error))
		};
	}
}
/** Nested command failures retain their owner's inputs until process cleanup is verified. */
function hasUnjoinedWork(value) {
	const pending = [value];
	const seen = /* @__PURE__ */ new Set();
	for (const current of pending) {
		if (!current || typeof current !== "object" || seen.has(current)) continue;
		seen.add(current);
		if ("processTreeState" in current && current.processTreeState !== "terminated") return true;
		if (current instanceof AggregateError) for (const error of current.errors) pending.push(error);
		if ("cause" in current) pending.push(current.cause);
		if ("error" in current) pending.push(current.error);
	}
	return false;
}
/** Return the conventional shell exit code for a signal. */
function signalExitCode(signal) {
	const signalNumber = signalNumberFor(signal);
	return signalNumber ? 128 + signalNumber : 1;
}
function terminateManagedChild(child, signal = "SIGTERM", { onChildSignalError, onProcessGroupSignalError, platform = process.platform, processGroupFallback = "always", runTaskkill = spawnSync, taskkillTimeoutMs = TASKKILL_TIMEOUT_MS, useProcessGroup = platform !== "win32", useWindowsTaskkill = true } = {}) {
	if (!child.pid) {
		try {
			const delivered = child.kill(signal);
			if (platform !== "win32") return { processTreeState: delivered === false ? "terminated" : "signaled" };
		} catch (error) {
			onChildSignalError?.(error);
		}
		return platform === "win32" ? { processTreeState: "indeterminate" } : void 0;
	}
	const job = platform === "win32" ? windowsJobs.get(child) : void 0;
	job?.beginStop();
	let processGroupIsMissing = false;
	try {
		if (platform !== "win32" && useProcessGroup) {
			process.kill(-child.pid, signal);
			return { processTreeState: "signaled" };
		}
	} catch (error) {
		processGroupIsMissing = isMissingProcessError(error);
		if (!processGroupIsMissing) onProcessGroupSignalError?.(error);
		if (processGroupFallback === "never" || processGroupFallback === "nonmissing" && processGroupIsMissing) return processGroupIsMissing ? { processTreeState: "terminated" } : void 0;
	}
	if (platform !== "win32" || !useWindowsTaskkill) {
		const missingLeaderState = useProcessGroup && !processGroupIsMissing ? "indeterminate" : "terminated";
		try {
			return { processTreeState: child.kill(signal) === false ? missingLeaderState : "signaled" };
		} catch (error) {
			onChildSignalError?.(error);
			return isMissingProcessError(error) ? { processTreeState: missingLeaderState } : void 0;
		}
	}
	if (child.exitCode != null || child.signalCode != null) {
		if (job) try {
			job.stop();
		} catch (error) {
			onChildSignalError?.(error);
		}
		return observeWindowsTree(child);
	}
	const taskkillPath = resolveWindowsTaskkillPath();
	const args = [
		"/PID",
		String(child.pid),
		"/T"
	];
	if (signal === "SIGKILL") args.push("/F");
	const taskkillOptions = taskkillTimeoutMs === null ? { stdio: [
		"ignore",
		"pipe",
		"pipe"
	] } : {
		killSignal: "SIGKILL",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		timeout: taskkillTimeoutMs
	};
	const result = runTaskkill(taskkillPath, args, taskkillOptions);
	const attempts = [result];
	if ((result?.error || result?.status !== 0) && signal !== "SIGKILL" && !hasManagedChildExited(child)) attempts.push(runTaskkill(taskkillPath, [...args, "/F"], taskkillOptions));
	if (job && observeWindowsTree(child).processTreeState !== "terminated") try {
		job.stop();
	} catch (error) {
		onChildSignalError?.(error);
	}
	if (attempts.some((attempt) => !attempt?.error && attempt?.status === 0)) {
		windowsTerminations.set(child, { processTreeState: "terminated" });
		return job ? observeWindowsTree(child) : { processTreeState: "terminated" };
	}
	try {
		if (!hasManagedChildExited(child)) child.kill(signal);
	} catch (error) {
		onChildSignalError?.(error);
	}
	const taskkill = attempts.map((attempt) => ({
		status: attempt?.status ?? null,
		signal: attempt?.signal ?? null,
		stdout: attempt?.stdout?.toString() ?? "",
		stderr: attempt?.stderr?.toString() ?? "",
		error: attempt?.error?.message
	}));
	const observation = job ? observeWindowsTree(child) : { processTreeState: "indeterminate" };
	const termination = {
		...observation,
		error: Object.assign(createManagedCommandCleanupError(`Windows taskkill failed: ${JSON.stringify(taskkill)}`, child, platform, "indeterminate", observation.error), {
			taskkill,
			survivingPids: observation.survivingPids
		})
	};
	windowsTerminations.set(child, termination);
	return termination;
}
function hasManagedChildExited(child) {
	if (child.exitCode != null || child.signalCode != null) return true;
	if (child.pid) try {
		process.kill(child.pid, 0);
	} catch (error) {
		return isMissingProcessError(error);
	}
	return false;
}
function inspectManagedProcessGroup(child, { deadlineAt, errorPolicy, inspectLeaderWhenNoGroup = false, platform = process.platform, useProcessGroup = platform !== "win32" }) {
	if (platform === "win32" && !inspectLeaderWhenNoGroup) return observeWindowsTree(child).processTreeState === "terminated" ? "dead" : "indeterminate";
	if (!useProcessGroup) return inspectLeaderWhenNoGroup && child.pid && child.exitCode === null && child.signalCode === null ? "live" : "dead";
	const { pid } = child;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 1 || pid > 2147483647) return "indeterminate";
	try {
		process.kill(-pid, 0);
		if (platform === "linux" && (child.exitCode != null || child.signalCode != null)) {
			if (isLinuxZombieProcessGroup(pid, deadlineAt)) return "dead";
			process.kill(-pid, 0);
		}
		return "live";
	} catch (error) {
		if (isMissingProcessError(error)) return "dead";
		return errorPolicy === "alive-on-eperm" && hasProcessErrorCode(error, "EPERM") ? "live" : "indeterminate";
	}
}
function isLinuxZombieProcessGroup(pid, deadlineAt) {
	const timeout = deadlineAt === void 0 ? PROCESS_GROUP_DRAIN_TIMEOUT_MS : Math.min(PROCESS_GROUP_DRAIN_TIMEOUT_MS, Math.floor(deadlineAt - Date.now()));
	if (timeout <= 0) return false;
	const result = spawnSync("ps", [
		"-s",
		String(pid),
		"-L",
		"-o",
		"pgid=,state="
	], {
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		timeout,
		killSignal: "SIGKILL"
	});
	const zombie = new RegExp(`^\\s*${pid}\\s+Z\\s*$`, "u");
	return !result.error && result.status === 0 && result.stdout.trim().split("\n").every((row) => zombie.test(row));
}
/** Run a child command while forwarding termination signals to its process group. */
async function runManagedCommand({ stdio = "inherit", platform = process.platform, timeoutMs, timeoutKillGraceMs, signalKillGraceMs, timeoutForceKillOnLeaderExit = false, requireProcessTreeExit = false, runTaskkill = spawnSync, onReady, signal, abortKillGraceMs, cleanupDrainTimeoutMs, onSignal, ...commandOptions }) {
	if (platform === "win32" && requireProcessTreeExit) throw Object.assign(/* @__PURE__ */ new Error("Strict managed process-tree verification is not supported on Windows"), { code: "EPROCESS_TREE_VERIFICATION_UNSUPPORTED" });
	signal?.throwIfAborted();
	const managedStdio = stdio === "inherit" ? [
		"inherit",
		"inherit",
		"inherit"
	] : Array.isArray(stdio) ? [...stdio] : stdio;
	const forwardedOutputs = [process.stdout, process.stderr].map((target, index) => {
		if (platform !== "win32" && !target.isTTY && Array.isArray(managedStdio) && managedStdio[index + 1] === "inherit") {
			managedStdio[index + 1] = "pipe";
			return target;
		}
	});
	const commandEnv = { ...commandOptions.env ?? process.env };
	const spawnSpec = createManagedCommandSpawnSpec({
		...commandOptions,
		args: commandOptions.args?.slice(),
		cwd: commandOptions.cwd ?? process.cwd(),
		env: commandEnv,
		stdio: managedStdio,
		platform
	});
	const loading = loadManagedChildSpawner(platform);
	const spawnManagedChild = typeof loading === "function" ? loading : await loading;
	signal?.throwIfAborted();
	let releaseClaim = findVitestResourceOwner(commandEnv.TMPDIR || commandEnv.TMP || commandEnv.TEMP || tmpdir())?.claim();
	const releaseOwnership = () => {
		releaseClaim?.();
		releaseClaim = void 0;
	};
	installSignalHandlers();
	let child;
	try {
		child = spawnManagedChild(spawnSpec.command, spawnSpec.args, spawnSpec.options);
	} catch (error) {
		removeSignalHandlersIfIdle();
		releaseOwnership();
		throw error;
	}
	const ownsProcessTree = requireProcessTreeExit || windowsJobs.has(child);
	let timeoutTimer;
	let finalization;
	let cancellation;
	let notifyOutcome;
	const completion = new Promise((resolve) => {
		notifyOutcome = resolve;
	});
	const finalize = (stopSignal, forceKillDelayMs, forceKillOnLeaderExit = false) => {
		return finalization ??= finalizeManagedChild(child, stopSignal, {
			platform,
			runTaskkill,
			forceKillDelayMs,
			forceKillOnLeaderExit,
			drainTimeoutMs: cleanupDrainTimeoutMs,
			onTerminated: releaseOwnership
		}).then(() => void 0, (error) => ({
			type: "failed",
			error
		}));
	};
	const stop = (outcome, ...termination) => {
		cancellation ??= outcome;
		clearTimeout(timeoutTimer);
		const joined = finalize(...termination);
		notifyOutcome(cancellation);
		return joined;
	};
	const forwardSignal = (received) => {
		onSignal?.(received);
		stop({
			type: "signal",
			signal: received
		}, received, signalKillGraceMs);
	};
	const abort = () => {
		stop({ type: "aborted" }, "SIGTERM", abortKillGraceMs);
	};
	managedChildren.add(forwardSignal);
	try {
		child.once("error", (error) => {
			clearTimeout(timeoutTimer);
			if (windowsJobs.has(child)) stop({
				type: "failed",
				error
			}, "SIGKILL");
			else notifyOutcome({
				type: "failed",
				error
			});
		});
		child.once("close", () => clearTimeout(timeoutTimer));
		child.once(ownsProcessTree ? "exit" : "close", (status, received) => {
			notifyOutcome({
				type: "completed",
				exit: received ?? status ?? 1
			});
		});
		if (timeoutMs !== void 0) timeoutTimer = setTimeout(() => {
			stop({ type: "timeout" }, "SIGTERM", timeoutKillGraceMs, timeoutForceKillOnLeaderExit);
		}, timeoutMs);
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
		try {
			for (const [index, target] of forwardedOutputs.entries()) if (target) (index === 0 ? child.stdout : child.stderr).pipe(new Writable({ write(chunk, encoding, callback) {
				target.write(chunk, encoding, callback);
			} }));
			onReady?.(child);
		} catch (error) {
			const cleanup = await stop({
				type: "failed",
				error
			}, "SIGTERM");
			if (cleanup && cleanup.error !== error) throw createManagedCommandSetupCleanupError(error, cleanup.error);
			throw error;
		}
		let outcome = await completion;
		if (outcome.type === "completed" && ownsProcessTree) finalize(typeof outcome.exit === "string" ? outcome.exit : void 0);
		outcome = (finalization ? await finalization : void 0) ?? cancellation ?? outcome;
		if (outcome.type === "completed" && !ownsProcessTree && !cancellation && !finalization) releaseOwnership();
		if (outcome.type === "failed") throw outcome.error;
		if (outcome.type === "timeout") throw Object.assign(/* @__PURE__ */ new Error(`Managed command timed out after ${timeoutMs}ms`), { code: "ETIMEDOUT" });
		if (outcome.type === "aborted") throw Object.assign(/* @__PURE__ */ new Error("Managed command aborted"), { code: "ABORT_ERR" });
		if (outcome.type === "signal") return signalExitCode(outcome.signal);
		return typeof outcome.exit === "string" ? signalExitCode(outcome.exit) : outcome.exit;
	} finally {
		clearTimeout(timeoutTimer);
		signal?.removeEventListener("abort", abort);
		managedChildren.delete(forwardSignal);
		removeSignalHandlersIfIdle();
		if (!child.pid) releaseOwnership();
	}
}
async function finalizeManagedChild(child, signal, { platform, runTaskkill, forceKillDelayMs = FORCE_KILL_DELAY_MS, forceKillOnLeaderExit = false, drainTimeoutMs = PROCESS_GROUP_DRAIN_TIMEOUT_MS, retainOutputOnFailure = false, onTerminated = () => {} }) {
	const startedAt = Date.now();
	const forceDelay = signal ? forceKillDelayMs : 0;
	const signalErrors = [];
	const recordSignalError = (error) => {
		if (!isMissingProcessError(error)) signalErrors.push(error);
	};
	const terminationOptions = {
		platform,
		runTaskkill,
		onChildSignalError: recordSignalError,
		onProcessGroupSignalError: recordSignalError
	};
	const job = windowsJobs.get(child);
	const normalJobExit = !signal && job !== void 0;
	const outputClosed = () => [child.stdout, child.stderr].every((pipe) => !pipe || pipe.closed);
	let joined = false;
	const failures = [];
	try {
		if (normalJobExit && !outputClosed()) await new Promise((resolve) => {
			const finish = () => {
				clearTimeout(timer);
				child.off("close", finish);
				resolve();
			};
			const timer = setTimeout(finish, Math.max(0, startedAt + drainTimeoutMs / 2 - Date.now()));
			child.once("close", finish);
		});
		const termination = !signal && inspectManagedProcessGroup(child, {
			deadlineAt: startedAt + forceDelay + drainTimeoutMs,
			errorPolicy: "indeterminate",
			platform
		}) === "dead" ? { processTreeState: "terminated" } : terminateManagedChild(child, signal ?? "SIGKILL", terminationOptions);
		if (platform === "win32" && termination?.processTreeState !== "terminated" && !job) throw createManagedCommandCleanupError("Windows taskkill could not verify managed process tree exit", child, platform, "indeterminate", termination?.error);
		const forceAt = (platform === "win32" && !normalJobExit ? Date.now() : startedAt) + forceDelay;
		const deadline = forceAt + drainTimeoutMs;
		let forced = !signal || platform === "win32";
		let groupState = "indeterminate";
		let survivingPids;
		let observationError;
		let warned = false;
		while (true) {
			const exited = child.exitCode !== null || child.signalCode !== null;
			const probeDeadline = forced ? deadline : forceKillOnLeaderExit && exited ? Math.min(forceAt, Date.now()) : forceAt;
			if (platform === "win32") {
				const observed = observeWindowsTree(child);
				survivingPids = observed.survivingPids;
				observationError = observed.error;
				groupState = observed.processTreeState === "terminated" ? "dead" : "indeterminate";
				if (!warned && groupState !== "dead") {
					warned = true;
					process.emitWarning(Object.assign(createManagedCommandCleanupError(`Windows process tree unresolved: ${JSON.stringify({
						survivingPids: survivingPids ?? null,
						observationError: observed.error?.message
					})}`, child, platform, "indeterminate", termination?.error ?? observed.error), { survivingPids }));
				}
			} else groupState = inspectManagedProcessGroup(child, {
				deadlineAt: probeDeadline,
				errorPolicy: "indeterminate",
				platform
			});
			if (groupState === "dead" && exited && outputClosed()) {
				joined = true;
				if (!signal && platform !== "win32" && termination?.processTreeState !== "terminated") {
					const cleanupErrors = [termination?.error, ...signalErrors].filter((error) => error !== void 0);
					throw createManagedCommandCleanupError("Managed command exited while its process group remained active", child, platform, "terminated", cleanupErrors.length > 0 ? new AggregateError(cleanupErrors, "Managed process termination failed") : void 0);
				}
				break;
			}
			const now = Date.now();
			if (!forced && (now >= forceAt || forceKillOnLeaderExit && exited)) {
				forced = true;
				if (groupState !== "dead") terminateManagedChild(child, "SIGKILL", terminationOptions);
			}
			if (now >= deadline) break;
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(PROCESS_GROUP_POLL_MS, (forced ? deadline : forceAt) - now));
			});
		}
		if (!joined) {
			if (!retainOutputOnFailure) {
				child.stdout?.destroy();
				child.stderr?.destroy();
			}
			throw Object.assign(createManagedCommandCleanupError(`Managed command cleanup could not verify child, process group, and output closure${platform === "win32" ? `: ${JSON.stringify({ survivingPids: survivingPids ?? null })}` : ""}`, child, platform, groupState === "live" ? "live" : "indeterminate", new AggregateError([
				termination?.error,
				observationError,
				...signalErrors
			].filter((error) => error !== void 0), "Managed process termination or observation failed")), { survivingPids });
		}
	} catch (error) {
		failures.push(error);
	}
	if (job) {
		const observed = joined ? void 0 : observeWindowsTree(child);
		if (!joined && !hasUnjoinedWork(failures[0])) failures[0] = Object.assign(createManagedCommandCleanupError("Windows Job finalization remains unverified", child, platform, "indeterminate", failures[0]), { survivingPids: observed?.survivingPids });
		if (observed?.error) failures.push(observed.error);
		const receipt = {
			...observed,
			processTreeState: joined ? "terminated" : "indeterminate",
			...failures.length ? { error: new AggregateError(failures, "Managed command finalization failed") } : {}
		};
		windowsTerminations.set(child, receipt);
		try {
			job.close();
			windowsJobs.delete(child);
		} catch (error) {
			joined = false;
			failures.push(createManagedCommandCleanupError("Windows Job handle closure failed", child, platform, "indeterminate", error));
			receipt.processTreeState = "indeterminate";
			receipt.error = new AggregateError(failures, "Windows Job finalization failed");
		}
	}
	if (joined) onTerminated();
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "Managed command finalization failed");
}
function createManagedCommandSetupCleanupError(error, cleanupError) {
	return new AggregateError([error, cleanupError], "Managed command setup failed and its process tree could not be cleaned up", { cause: cleanupError });
}
function createManagedCommandCleanupError(message, child, platform, processTreeState, cause) {
	const processGroupId = platform !== "win32" && child.pid !== void 0 && Number.isSafeInteger(child.pid) && child.pid > 1 ? child.pid : void 0;
	return Object.assign(new Error(message, { cause }), {
		code: "EPROCESSGROUP_CLEANUP_FAILED",
		...platform === "win32" ? { manualRecoveryRequired: true } : {},
		...processGroupId === void 0 ? {} : { processGroupId },
		processTreeState
	});
}
function installSignalHandlers() {
	for (const signal of FORWARDED_SIGNALS) {
		if (signalHandlers.has(signal)) continue;
		const handler = () => forwardSignalToManagedChildren(signal);
		signalHandlers.set(signal, handler);
		process.on(signal, handler);
	}
}
function removeSignalHandlersIfIdle() {
	if (managedChildren.size > 0) return;
	for (const [signal, handler] of signalHandlers) process.off(signal, handler);
	signalHandlers.clear();
}
function forwardSignalToManagedChildren(signal) {
	for (const forward of managedChildren) forward(signal);
}
function createManagedCommandSpawnSpec(options) {
	const { cwd, env, stdio = "inherit", platform = process.platform } = options;
	const { args, command, ...invocationOptions } = createManagedCommandInvocation(options);
	return {
		args,
		command,
		options: {
			cwd,
			env,
			stdio,
			...invocationOptions,
			detached: platform !== "win32"
		}
	};
}
function createManagedCommandInvocation({ bin, args = [], env, platform = process.platform, shell = platform === "win32", windowsVerbatimArguments, comSpec }) {
	if (platform === "win32" && shell && args.length > 0) return {
		args: [
			"/d",
			"/s",
			"/c",
			buildCmdExeCommandLine(bin, args)
		],
		command: comSpec ?? resolveWindowsCmdExePath(env ?? process.env),
		shell: false,
		windowsVerbatimArguments: true
	};
	return {
		args,
		command: bin,
		shell,
		windowsVerbatimArguments
	};
}
function signalNumberFor(signal) {
	switch (signal) {
		case "SIGHUP": return 1;
		case "SIGINT": return 2;
		case "SIGTERM": return 15;
		default: return constants$1.signals?.[signal] ?? 0;
	}
}
function isMissingProcessError(error) {
	return hasProcessErrorCode(error, "ESRCH");
}
function hasProcessErrorCode(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region scripts/crabbox-staging-witness.mts
const objectId = /^[0-9a-f]{40}$/u;
const sourceModes = /* @__PURE__ */ new Set([
	"100644",
	"100755",
	"120000"
]);
const maxEntries$1 = 1e5;
const maxMetadataBytes = 67108864;
const maxSourceBytes = 8589934592;
const verificationBudgetMs = 12e4;
function gitEnvironment() {
	return {
		...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("GIT_"))),
		GIT_OPTIONAL_LOCKS: "0",
		GIT_NO_LAZY_FETCH: "1",
		GIT_NO_REPLACE_OBJECTS: "1",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_CONFIG_GLOBAL: "/dev/null",
		GIT_TERMINAL_PROMPT: "0"
	};
}
const gitOptions = [
	"--no-lazy-fetch",
	"--no-replace-objects",
	"-c",
	"gc.auto=0",
	"-c",
	"maintenance.auto=false",
	"-c",
	"core.fsmonitor=false",
	"-c",
	"core.commitGraph=false",
	"-c",
	"core.multiPackIndex=false"
];
function remainingTime(deadline) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new Error("source witness verification exceeded its work budget");
	return remaining;
}
function gitRead(location, args, deadline, options = {}) {
	const result = spawnSync("git", [
		...gitOptions,
		...location,
		...args
	], {
		env: gitEnvironment(),
		stdio: [
			"ignore",
			options.quiet ? "ignore" : "pipe",
			"pipe"
		],
		timeout: remainingTime(deadline),
		killSignal: "SIGKILL",
		maxBuffer: options.quiet ? 1048576 : maxMetadataBytes
	});
	if (!result.error && options.absent && result.status === 1) return;
	if (result.error || result.status !== 0) throw new Error(`source witness Git ${args[0]} could not verify local objects`);
	return result.stdout ?? Buffer.alloc(0);
}
function gitText(location, args, deadline) {
	const value = gitRead(location, args, deadline);
	if (!isUtf8(value)) throw new Error("source witness Git metadata is not UTF-8");
	return value.toString("utf8").trim();
}
function retainedRef(ref) {
	return ref.startsWith("refs/") && ref.length <= 1024 && !ref.endsWith("/HEAD") && !ref.includes("\\") && !ref.includes("\0") && !ref.split("/").some((part) => !part || part === "." || part === "..") && ![
		"refs/openclaw/source-capsule",
		"refs/bisect/",
		"refs/rewritten/",
		"refs/worktree/",
		"refs/replace/"
	].some((prefix) => ref === prefix || ref.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`));
}
function resolveRef(location, ref, deadline) {
	if (!retainedRef(ref)) throw new Error("source witness needs a named non-staging Git ref");
	gitRead(location, ["check-ref-format", ref], deadline);
	if (gitRead(location, [
		"symbolic-ref",
		"--quiet",
		ref
	], deadline, { absent: true })) throw new Error("source witness ref must name retained objects directly");
	const oid = gitText(location, [
		"rev-parse",
		"--verify",
		"--end-of-options",
		ref
	], deadline);
	const commit = gitText(location, [
		"rev-parse",
		"--verify",
		"--end-of-options",
		`${ref}^{commit}`
	], deadline);
	if (!objectId.test(oid) || !objectId.test(commit)) throw new Error("source witness requires complete SHA-1 Git identities");
	return {
		oid,
		commit
	};
}
/** Capture only an existing branch or exact ref, without searching commit history. */
function captureSourceWitness(repoRoot, sourceSha) {
	try {
		if (!objectId.test(sourceSha)) return;
		const deadline = Date.now() + 5e3;
		const location = ["-C", repoRoot];
		const gitDir = realpathSync(gitText(location, [
			"rev-parse",
			"--path-format=absolute",
			"--git-common-dir"
		], deadline));
		const symbolic = gitRead(location, [
			"symbolic-ref",
			"--quiet",
			"HEAD"
		], deadline, { absent: true });
		const refs = symbolic ? [symbolic.toString("utf8").trim()] : gitText(location, [
			"for-each-ref",
			"--count=32",
			"--format=%(refname)",
			"--points-at",
			sourceSha,
			"refs/heads",
			"refs/remotes",
			"refs/tags"
		], deadline).split("\n");
		for (const ref of refs.filter(retainedRef)) if (resolveRef(location, ref, deadline).commit === sourceSha) return {
			gitDir,
			ref,
			commit: sourceSha
		};
	} catch {}
}
/** Select an operator-owned retained ref without creating refs or copying source. */
function selectSourceWitness(repository, ref) {
	if (!retainedRef(ref)) throw new Error("Choose a full retained refs/heads, refs/remotes, or refs/tags name outside staging.");
	const deadline = Date.now() + 5e3;
	const location = ["-C", repository];
	return {
		gitDir: realpathSync(gitText(location, [
			"rev-parse",
			"--path-format=absolute",
			"--git-common-dir"
		], deadline)),
		ref,
		commit: resolveRef(location, ref, deadline).commit
	};
}
function overlaps$2(left, right) {
	const within = (parent, child) => {
		const path = relative(parent, child);
		return path === "" || !isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`);
	};
	return within(left, right) || within(right, left);
}
function sourcePath(path) {
	if (!path || path.includes("\0") || path.includes("\\") || Buffer.from(path).toString("utf8") !== path || path.split("/").some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git")) throw new Error("source witness manifest has an invalid repository path");
	return path;
}
function validateSource(source) {
	if (source.files.length + source.deleted.length > maxEntries$1) throw new Error("source witness manifest exceeds its entry budget");
	const files = /* @__PURE__ */ new Set();
	const directories = /* @__PURE__ */ new Set();
	for (const entry of source.files) {
		const path = sourcePath(entry.path);
		if (files.has(path) || !sourceModes.has(entry.mode) || !objectId.test(entry.blob)) throw new Error("source witness manifest has duplicate or invalid source entries");
		files.add(path);
		for (let slash = path.lastIndexOf("/"); slash >= 0; slash = path.lastIndexOf("/", slash - 1)) directories.add(path.slice(0, slash));
	}
	if ([...files].some((path) => directories.has(path))) throw new Error("source witness manifest has conflicting file and directory paths");
	const deleted = /* @__PURE__ */ new Set();
	for (const entry of source.deleted) {
		const path = sourcePath(entry);
		if (deleted.has(path) || files.has(path) || directories.has(path)) throw new Error("source witness manifest has conflicting deletions");
		deleted.add(path);
	}
}
/** First eligibility tier: an ordinary self-contained local object store. */
function storageIdentity(gitDir, payloadRoot, ref, deadline) {
	const digest = createHash("sha256");
	let count = 0;
	const record = (path) => {
		remainingTime(deadline);
		const stat = lstatSync(path, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!stat) {
			digest.update(`${path}\0missing\0`);
			return;
		}
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error("source witness Git storage contains a symbolic link or unsupported file kind");
		if (++count > 25e4) throw new Error("source witness object storage exceeds its inspection budget");
		digest.update(`${path}\0${stat.dev}:${stat.ino}:${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}\0`);
		return stat;
	};
	if (realpathSync(gitDir) !== gitDir || overlaps$2(gitDir, payloadRoot) || !record(gitDir)?.isDirectory()) throw new Error("source witness Git repository overlaps the disposable payload");
	for (const name of [
		"HEAD",
		"config",
		"config.worktree",
		"packed-refs",
		"commondir",
		"shallow",
		"info/grafts",
		ref
	]) {
		const parts = name.split("/");
		for (let end = 1; end < parts.length; end += 1) {
			const parent = record(join(gitDir, ...parts.slice(0, end)));
			if (parent && !parent.isDirectory()) throw new Error("source witness Git metadata has an unsupported parent path");
		}
		const stat = record(join(gitDir, name));
		if (stat && !stat.isFile()) throw new Error("source witness Git metadata is not a regular file");
		if (stat && [
			"commondir",
			"shallow",
			"info/grafts"
		].includes(name) && stat.size > 0n) throw new Error("source witness needs complete local history without redirected or truncated storage");
	}
	const walk = (directory, depth) => {
		if (depth > 4 || !record(directory)?.isDirectory()) throw new Error("source witness object storage has an unsupported directory layout");
		for (const name of readdirSync(directory).toSorted()) {
			const path = join(directory, name);
			const stat = record(path);
			if (!stat) throw new Error("source witness object storage changed during inspection");
			if (name.endsWith(".promisor")) throw new Error("source witness has promised objects; choose an independent complete store");
			if ((name === "alternates" || name === "http-alternates") && stat.size > 0n) throw new Error("source witness borrows objects; choose an independent complete store");
			if (stat.isDirectory()) walk(path, depth + 1);
		}
	};
	walk(join(gitDir, "objects"), 0);
	return digest.digest("hex");
}
async function verifyBlobs(location, blobs, deadline, signal) {
	if (blobs.length === 0) return;
	const abort = new AbortController();
	let failure;
	let header = "";
	let index = 0;
	let remaining = 0;
	let bytes = 0;
	let hash;
	const consume = (chunk) => {
		try {
			for (let offset = 0; offset < chunk.length;) {
				if (failure) return;
				if (remaining > 0) {
					const end = offset + Math.min(remaining, chunk.length - offset);
					hash.update(chunk.subarray(offset, end));
					remaining -= end - offset;
					offset = end;
				} else if (hash) {
					if (chunk[offset++] !== 10 || hash.digest("hex") !== blobs[index]) throw new Error("source witness raw blob identity mismatch");
					hash = void 0;
					index += 1;
				} else {
					const value = chunk[offset++];
					if (value !== 10) {
						header += String.fromCharCode(value);
						if (header.length > 128) throw new Error("source witness returned invalid object framing");
						continue;
					}
					const match = /^([0-9a-f]{40}) blob (0|[1-9][0-9]*)$/u.exec(header);
					if (!match || match[1] !== blobs[index]) throw new Error("source witness raw blob is missing or has the wrong type");
					remaining = Number(match[2]);
					bytes += remaining;
					if (!Number.isSafeInteger(remaining) || bytes > maxSourceBytes) throw new Error("source witness raw blobs exceed the verification byte budget");
					hash = createHash("sha1").update(`blob ${remaining}\0`);
					header = "";
				}
			}
		} catch (error) {
			failure = error instanceof Error ? error : /* @__PURE__ */ new Error("source witness blob verification failed");
			abort.abort(failure);
		}
	};
	try {
		if (await runManagedCommand({
			bin: "git",
			args: [
				...gitOptions,
				...location,
				"cat-file",
				"--batch"
			],
			env: gitEnvironment(),
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			timeoutMs: remainingTime(deadline),
			signal: signal ? AbortSignal.any([signal, abort.signal]) : abort.signal,
			requireProcessTreeExit: true,
			onReady(child) {
				child.stdout.on("data", consume);
				child.stderr.resume();
				child.stdin.on("error", () => {});
				child.stdin.end(`${blobs.join("\n")}\n`);
			}
		}) !== 0 || failure || hash || header || index !== blobs.length) throw failure ?? /* @__PURE__ */ new Error("source witness did not supply every complete raw blob");
	} catch (error) {
		if (failure && failure !== error) throw new AggregateError([failure, error], failure.message, { cause: error });
		throw error;
	}
}
/** Read-only proof of another retained copy; the stage owner still owns disposal. */
async function verifySourceWitness(params) {
	try {
		params.signal?.throwIfAborted();
		validateSource(params.source);
		const { ref: refName, commit } = params.witness;
		if (!objectId.test(commit) || !retainedRef(refName)) throw new Error("source witness needs an exact commit and named non-staging ref");
		const deadline = Date.now() + verificationBudgetMs;
		const payloadRoot = realpathSync(params.payloadRoot);
		const gitDir = realpathSync(params.witness.gitDir);
		const location = [`--git-dir=${gitDir}`];
		const before = storageIdentity(gitDir, payloadRoot, refName, deadline);
		if (gitRead(location, [
			"config",
			"--no-includes",
			"--get-regexp",
			"^(include\\.|includeif\\.|extensions\\.(partialclone|refstorage)|remote\\..*\\.promisor$|fsck\\.)"
		], deadline, { absent: true })) throw new Error("source witness uses configuration that prevents independent local verification");
		if (gitText(location, ["rev-parse", "--show-object-format"], deadline) !== "sha1") throw new Error("source witness requires a SHA-1 Git object store");
		const ref = resolveRef(location, refName, deadline);
		gitRead(location, [
			"merge-base",
			"--is-ancestor",
			commit,
			ref.commit
		], deadline);
		gitRead(location, [
			"fsck",
			"--connectivity-only",
			"--no-dangling",
			"--no-reflogs",
			"--no-progress",
			ref.oid
		], deadline, { quiet: true });
		const listing = gitRead(location, [
			"ls-tree",
			"-r",
			"-t",
			"-z",
			"--full-tree",
			commit
		], deadline);
		if (!isUtf8(listing)) throw new Error("source witness tree paths are not UTF-8");
		const entries = /* @__PURE__ */ new Map();
		for (const row of listing.toString("utf8").split("\0").filter(Boolean)) {
			const match = /^(040000 tree|100644 blob|100755 blob|120000 blob|160000 commit) ([0-9a-f]{40})\t([\s\S]+)$/u.exec(row);
			if (!match || !match[1] || !match[2] || !match[3] || entries.has(match[3])) throw new Error("source witness tree has unsupported or duplicate entries");
			entries.set(sourcePath(match[3]), {
				mode: match[1].slice(0, 6),
				blob: match[2]
			});
		}
		for (const entry of params.source.files) {
			const saved = entries.get(entry.path);
			if (saved?.mode !== entry.mode || saved.blob !== entry.blob) throw new Error(`source witness does not preserve ${JSON.stringify(entry.path)}`);
		}
		for (const path of params.source.deleted) if (entries.has(path)) throw new Error(`source witness does not preserve deletion of ${JSON.stringify(path)}`);
		await verifyBlobs(location, [...new Set(params.source.files.map((entry) => entry.blob))], deadline, params.signal);
		const revalidate = () => {
			params.signal?.throwIfAborted();
			const currentStorage = storageIdentity(gitDir, payloadRoot, refName, deadline);
			const after = resolveRef(location, refName, deadline);
			if (currentStorage !== before || after.oid !== ref.oid || after.commit !== ref.commit) throw new Error("source witness changed while preservation was being verified");
		};
		revalidate();
		return {
			ok: true,
			witness: {
				gitDir,
				ref: refName,
				commit
			},
			revalidate
		};
	} catch (error) {
		return {
			ok: false,
			reason: error instanceof Error ? error.message : "source witness could not be verified",
			error,
			...hasUnjoinedWork(error) ? { unjoined: true } : {}
		};
	}
}
//#endregion
//#region scripts/crabbox-staging-artifacts.mts
const outputNames = ["captures", "runs"];
const maxEntries = 1e5;
const sha256 = /^[a-f0-9]{64}$/u;
function artifactPath$1(path) {
	const parts = path.split("/");
	return path.length <= 4096 && !isAbsolute(path) && !path.includes("\\") && !path.includes("\0") && outputNames.some((name) => parts[0] === name) && parts.every((part) => part && part !== "." && part !== "..");
}
const crabboxArtifactIdentitySchema = strictObject({
	dev: string(),
	ino: string()
});
const entrySchema$1 = discriminatedUnion("kind", [strictObject({
	path: string().refine(artifactPath$1),
	kind: literal("directory")
}), strictObject({
	path: string().refine((path) => artifactPath$1(path) && path.includes("/")),
	kind: literal("file"),
	bytes: number().int().min(0).max(Number.MAX_SAFE_INTEGER),
	sha256: string().regex(sha256)
})]);
const evidenceFields = {
	version: literal(1),
	durable: boolean(),
	sourceIdentity: crabboxArtifactIdentitySchema,
	entries: array(entrySchema$1).max(maxEntries)
};
const crabboxArtifactEvidenceSchema = discriminatedUnion("kind", [strictObject({
	...evidenceFields,
	kind: literal("none")
}), strictObject({
	...evidenceFields,
	kind: literal("copied"),
	repository: strictObject({
		path: string(),
		identity: crabboxArtifactIdentitySchema
	}),
	parents: strictObject({
		crabbox: crabboxArtifactIdentitySchema,
		wrapperArtifacts: crabboxArtifactIdentitySchema
	}),
	destination: strictObject({
		path: string(),
		identity: crabboxArtifactIdentitySchema
	})
})]);
function identity$1(stat) {
	return {
		dev: String(stat.dev),
		ino: String(stat.ino)
	};
}
function sameIdentity$1(stat, expected) {
	return String(stat.dev) === expected.dev && String(stat.ino) === expected.ino;
}
function directory(path, expected) {
	const stat = lstatSync(path, { bigint: true });
	if (!stat.isDirectory() || expected && !sameIdentity$1(stat, expected)) throw new Error("artifact directory is missing, replaced, or not a real directory: " + path);
	return stat;
}
function optionalDirectory(path) {
	const stat = lstatSync(path, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (stat && !stat.isDirectory()) throw new Error("artifact path must be a real directory: " + path);
	return stat;
}
function sameFile(before, after) {
	return before.dev === after.dev && before.ino === after.ino && before.mode === after.mode && before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs;
}
function names(path) {
	const found = readdirSync(path, { encoding: "buffer" });
	if (found.length > maxEntries) throw new Error("artifact directory exceeds its entry limit");
	return found.map((name) => {
		if (!isUtf8(name)) throw new Error("artifact filename is not UTF-8");
		return name.toString("utf8");
	}).toSorted();
}
function privateDirectory(path) {
	mkdirSync(path, { mode: 448 });
	chmodSync(path, 448);
	return identity$1(directory(path));
}
function hashFile(path, expected, buffer, target, nondurable) {
	const input = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	let output;
	try {
		const before = fstatSync(input, { bigint: true });
		if (!before.isFile() || !sameFile(before, expected) || before.size > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("artifact file changed or is not a supported regular file: " + path);
		if (target !== void 0) {
			output = openSync(target, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 384);
			fchmodSync(output, 384);
		}
		const hash = createHash("sha256");
		let remaining = Number(before.size);
		while (remaining > 0) {
			const count = readSync(input, buffer, 0, Math.min(buffer.length, remaining), null);
			if (!count) throw new Error("artifact file became shorter while reading: " + path);
			hash.update(buffer.subarray(0, count));
			if (output !== void 0) for (let written = 0; written < count;) {
				const size = writeSync(output, buffer, written, count - written);
				if (!size) throw new Error("artifact copy made no progress: " + target);
				written += size;
			}
			remaining -= count;
		}
		if (!sameFile(before, fstatSync(input, { bigint: true })) || !sameFile(before, lstatSync(path, { bigint: true }))) throw new Error("artifact file changed while reading: " + path);
		if (output !== void 0) {
			if (!flushDescriptor(output)) nondurable?.();
		}
		return {
			bytes: Number(before.size),
			sha256: hash.digest("hex")
		};
	} finally {
		try {
			if (output !== void 0) closeSync(output);
		} finally {
			closeSync(input);
		}
	}
}
function inventory$1(root, options = {}) {
	const entries = [];
	const buffer = Buffer.alloc(65536);
	const rootStat = optionalDirectory(root);
	if (!rootStat) return entries;
	if (options.destination && process.platform !== "win32" && (rootStat.mode & 511n) !== 448n) throw new Error("preserved artifact destination permissions changed");
	if (options.destination && names(root).some((name) => !outputNames.some((output) => output === name))) throw new Error("preserved artifact destination gained an unexpected entry");
	const walk = (path, relativePath, target, depth = 0) => {
		if (depth > 128) throw new Error("artifact directory nesting exceeds its inspection limit");
		if (!artifactPath$1(relativePath) || entries.length >= maxEntries) throw new Error("artifact inventory contains an unsupported path or exceeds its entry limit");
		const before = lstatSync(path, { bigint: true });
		if (before.isDirectory()) {
			if (options.destination && process.platform !== "win32" && (before.mode & 511n) !== 448n) throw new Error("preserved artifact directory permissions changed: " + path);
			const entry = {
				path: relativePath,
				kind: "directory"
			};
			entries.push(entry);
			if (target) {
				privateDirectory(join(target.root, relativePath));
				target.copied.push(entry);
			}
			for (const name of names(path)) walk(join(path, name), relativePath + "/" + name, target, depth + 1);
			if (!sameFile(before, lstatSync(path, { bigint: true }))) throw new Error("artifact directory changed while reading: " + path);
		} else if (before.isFile()) {
			if (options.destination && process.platform !== "win32" && (before.mode & 511n) !== 384n) throw new Error("preserved artifact file permissions changed: " + path);
			const entry = {
				path: relativePath,
				kind: "file",
				...hashFile(path, before, buffer, target && join(target.root, relativePath), target?.nondurable)
			};
			entries.push(entry);
			target?.copied.push(entry);
		} else throw new Error("artifact must be a regular file or real directory: " + path);
	};
	for (const name of outputNames) {
		const path = join(root, name);
		if (optionalDirectory(path)) walk(path, name, names(path).length > 0 ? options.target?.() : void 0);
	}
	if (!sameFile(rootStat, directory(root, identity$1(rootStat)))) throw new Error("artifact root changed during inspection");
	return entries.toSorted((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
function sourceInventory(source, expected, target) {
	const before = directory(source, expected);
	const entries = inventory$1(join(source, ".crabbox"), { target });
	if (!sameFile(before, directory(source, expected))) throw new Error("artifact source checkout changed during inspection");
	return entries;
}
function copiedEntries(entries) {
	const roots = new Set(entries.filter((entry) => entry.path.includes("/")).map((entry) => entry.path.split("/")[0]));
	return entries.filter((entry) => roots.has(entry.path.split("/")[0]));
}
function sameInventory(actual, expected, allowMissing = false) {
	const recorded = new Map(expected.map((entry) => [entry.path, entry]));
	if (recorded.size !== expected.length || actual.some((entry) => JSON.stringify(recorded.get(entry.path)) !== JSON.stringify(entry)) || !allowMissing && actual.length !== expected.length) throw new Error("artifact layout or bytes do not match the preservation evidence");
}
function overlaps$1(left, right) {
	const contains = (parent, child) => {
		const path = relative(parent, child);
		return path === "" || !isAbsolute(path) && path !== ".." && !path.startsWith(".." + sep);
	};
	return contains(left, right) || contains(right, left);
}
function verifyDestination(sourceCheckout, evidence, partial = false) {
	const repository = evidence.repository.path;
	const retainedRoot = join(repository, ".crabbox", "wrapper-artifacts");
	if (!isAbsolute(repository) || realpathSync(repository) !== repository || dirname(evidence.destination.path) !== retainedRoot || !basename(evidence.destination.path).startsWith("run-") || overlaps$1(sourceCheckout, evidence.destination.path)) throw new Error("artifact preservation destination is not independent of the disposable checkout");
	directory(repository, evidence.repository.identity);
	directory(join(repository, ".crabbox"), evidence.parents.crabbox);
	directory(retainedRoot, evidence.parents.wrapperArtifacts);
	const stat = directory(evidence.destination.path, evidence.destination.identity);
	if (process.platform !== "win32" && (stat.mode & 511n) !== 448n) throw new Error("preserved artifact destination permissions changed");
	sameInventory(inventory$1(evidence.destination.path, { destination: true }), partial ? evidence.entries : copiedEntries(evidence.entries));
	directory(repository, evidence.repository.identity);
	directory(join(repository, ".crabbox"), evidence.parents.crabbox);
	directory(retainedRoot, evidence.parents.wrapperArtifacts);
	directory(evidence.destination.path, evidence.destination.identity);
}
/** Revalidate saved outputs; only missing source entries can be tolerated after partial disposal. */
function verifyPreservedCrabboxArtifacts(sourceCheckout, value, allowMissing = false) {
	const evidence = crabboxArtifactEvidenceSchema.parse(value);
	const sourceStat = optionalDirectory(sourceCheckout);
	const source = sourceStat ? realpathSync(sourceCheckout) : resolve(sourceCheckout);
	if (sourceStat && !sameIdentity$1(sourceStat, evidence.sourceIdentity)) throw new Error("artifact source checkout was replaced");
	if (evidence.kind === "none") {
		if (copiedEntries(evidence.entries).length !== 0) throw new Error("no-output evidence contains artifacts requiring preservation");
	} else verifyDestination(source, evidence);
	sameInventory(sourceStat ? sourceInventory(source, evidence.sourceIdentity) : [], evidence.entries, allowMissing);
	if (sourceStat) directory(source, evidence.sourceIdentity);
}
function flushDescriptor(fd) {
	try {
		fsyncSync(fd);
		return true;
	} catch (error) {
		if ([
			"EINVAL",
			"ENOTSUP",
			"EOPNOTSUPP",
			"ENOSYS"
		].includes(error.code ?? "")) return false;
		throw error;
	}
}
function flushDirectory(path) {
	if (process.platform === "win32") return false;
	let fd;
	try {
		fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_DIRECTORY);
		return flushDescriptor(fd);
	} catch (error) {
		if ([
			"EINVAL",
			"ENOTSUP",
			"EOPNOTSUPP",
			"ENOSYS"
		].includes(error.code ?? "")) return false;
		throw error;
	} finally {
		if (fd !== void 0) closeSync(fd);
	}
}
/** Copy only native run/capture outputs into a fresh, private original-repository destination. */
function preserveCrabboxArtifacts(sourceCheckout, repositoryRoot, expectedRepositoryIdentity) {
	if (sourceCheckout === repositoryRoot) return;
	const sourceIdentity = identity$1(directory(sourceCheckout));
	const source = realpathSync(sourceCheckout);
	const state = {};
	const completed = [];
	try {
		const entries = sourceInventory(source, sourceIdentity, () => {
			if (!state.copied) {
				const repositoryIdentity = identity$1(directory(repositoryRoot, expectedRepositoryIdentity));
				const repository = realpathSync(repositoryRoot);
				const crabbox = join(repository, ".crabbox");
				const retainedRoot = join(crabbox, "wrapper-artifacts");
				if (overlaps$1(source, retainedRoot)) throw new Error("artifact preservation destination overlaps the disposable checkout");
				for (const path of [crabbox, retainedRoot]) if (!optionalDirectory(path)) privateDirectory(path);
				const destination = mkdtempSync(join(retainedRoot, "run-"));
				chmodSync(destination, 448);
				state.copied = {
					version: 1,
					durable: process.platform !== "win32",
					kind: "copied",
					sourceIdentity,
					entries: [],
					repository: {
						path: repository,
						identity: repositoryIdentity
					},
					parents: {
						crabbox: identity$1(directory(crabbox)),
						wrapperArtifacts: identity$1(directory(retainedRoot))
					},
					destination: {
						path: destination,
						identity: identity$1(directory(destination))
					}
				};
			}
			return {
				root: state.copied.destination.path,
				copied: completed,
				nondurable: () => {
					state.copied.durable = false;
				}
			};
		});
		directory(source, sourceIdentity);
		sameInventory(sourceInventory(source, sourceIdentity), entries);
		const copied = state.copied;
		if (!copied) return {
			version: 1,
			durable: true,
			kind: "none",
			sourceIdentity,
			entries
		};
		copied.entries = entries;
		verifyDestination(source, copied);
		for (const entry of completed.toReversed()) if (entry.kind === "directory") copied.durable = flushDirectory(join(copied.destination.path, entry.path)) && copied.durable;
		for (const path of [
			copied.destination.path,
			dirname(copied.destination.path),
			join(copied.repository.path, ".crabbox"),
			copied.repository.path
		]) copied.durable = flushDirectory(path) && copied.durable;
		directory(source, sourceIdentity);
		console.error(`[crabbox] preserved temporary artifacts: ${join(source, ".crabbox")} -> ${relative(repositoryRoot, copied.destination.path)}`);
		return copied;
	} catch (error) {
		const copied = state.copied;
		if (copied) try {
			verifyDestination(source, {
				...copied,
				entries: completed
			}, true);
			rmSync(copied.destination.path, { recursive: true });
		} catch {
			throw new Error("artifact preservation failed; partial output may remain at " + copied.destination.path, { cause: error });
		}
		throw error;
	}
}
//#endregion
//#region scripts/crabbox-staging-claims.mts
const stdoutLimit = 4194304;
const stderrLimit = 65536;
const commandTimeoutMs = 5e3;
const inspectionBudgetMs = 1e4;
const pathSchema = string().min(1).max(8192).refine((path) => isAbsolute(path) && !path.includes("\0"));
const claimNamespaceSchema = strictObject({
	version: literal(1),
	platform: string(),
	cwd: pathSchema,
	directory: pathSchema,
	anchor: strictObject({
		path: pathSchema,
		dev: string(),
		ino: string()
	})
});
const inventorySchema = object({
	version: literal(1),
	source: literal("local-claims"),
	claims: array(object({
		leaseId: string().min(1).max(512),
		repoRoot: pathSchema
	})).max(1e4),
	problems: array(unknown()).max(100)
});
var ClaimInventoryHold = class extends Error {
	constructor(reason, matchingLeaseIds) {
		super(reason);
		this.matchingLeaseIds = matchingLeaseIds;
	}
};
function envValue(env, key) {
	if (process.platform !== "win32") return env[key] ?? "";
	const values = Object.entries(env).filter(([name]) => name.toUpperCase() === key.toUpperCase()).map(([, value]) => value ?? "");
	if (new Set(values).size > 1) throw new ClaimInventoryHold("The native claims environment has ambiguous location variables.");
	return values[0] ?? "";
}
function nativeLocation(cwd, env) {
	let key;
	let value = envValue(env, "XDG_STATE_HOME");
	let suffix;
	if (value !== "") {
		key = "XDG_STATE_HOME";
		suffix = ["crabbox", "claims"];
	} else if (process.platform === "win32") {
		key = "AppData";
		value = envValue(env, key);
		suffix = [
			"crabbox",
			"state",
			"claims"
		];
	} else if (process.platform === "darwin") {
		key = "HOME";
		value = envValue(env, key);
		suffix = [
			"Library",
			"Application Support",
			"crabbox",
			"state",
			"claims"
		];
	} else {
		key = "XDG_CONFIG_HOME";
		value = envValue(env, key);
		if (value !== "") {
			if (!isAbsolute(value)) throw new ClaimInventoryHold("Native claims require an absolute XDG_CONFIG_HOME.");
			suffix = [
				"crabbox",
				"state",
				"claims"
			];
		} else {
			key = "HOME";
			value = envValue(env, key);
			suffix = [
				".config",
				"crabbox",
				"state",
				"claims"
			];
		}
	}
	if (!value || value.includes("\0")) throw new ClaimInventoryHold("The native claims state location is unavailable.");
	if (process.platform === "win32" && /^[a-z]:(?:[^\\/]|$)/iu.test(value)) throw new ClaimInventoryHold("A drive-relative native claims location cannot be preserved safely.");
	const base = resolve(cwd, value);
	return {
		key,
		base,
		directory: join(base, ...suffix)
	};
}
function directoryLocation(path) {
	let ancestor = resolve(path);
	const missing = [];
	for (let depth = 0; depth < 128; depth += 1) {
		if (lstatSync(ancestor, {
			bigint: true,
			throwIfNoEntry: false
		})) {
			const physical = realpathSync(ancestor);
			const stat = statSync(physical, { bigint: true });
			if (!stat.isDirectory()) throw new ClaimInventoryHold("A native claims path is not a readable directory.");
			return {
				directory: resolve(physical, ...missing),
				anchor: {
					path: physical,
					dev: String(stat.dev),
					ino: String(stat.ino)
				},
				generation: `${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`
			};
		}
		const parent = dirname(ancestor);
		if (parent === ancestor) break;
		missing.unshift(relative(parent, ancestor));
		ancestor = parent;
	}
	throw new ClaimInventoryHold("The native claims directory cannot be established.");
}
/** Bind discovery to the original native child's location without creating state. */
function captureClaimNamespace(cwd, env = process.env) {
	const originalCwd = realpathSync(cwd);
	if (!statSync(originalCwd).isDirectory()) throw new ClaimInventoryHold("The original native working directory is unavailable.");
	const location = directoryLocation(nativeLocation(originalCwd, env).directory);
	return claimNamespaceSchema.parse({
		version: 1,
		platform: process.platform,
		cwd: originalCwd,
		directory: location.directory,
		anchor: location.anchor
	});
}
function inspectNamespace(namespace, env) {
	if (namespace.platform !== process.platform) throw new ClaimInventoryHold("The native claims namespace belongs to a different platform.");
	const anchor = lstatSync(namespace.anchor.path, { bigint: true });
	if (!anchor.isDirectory() || String(anchor.dev) !== namespace.anchor.dev || String(anchor.ino) !== namespace.anchor.ino || realpathSync(namespace.anchor.path) !== namespace.anchor.path) throw new ClaimInventoryHold("The original native claims namespace was replaced.");
	const selected = nativeLocation(namespace.cwd, env);
	const current = directoryLocation(selected.directory);
	if (current.directory !== namespace.directory) throw new ClaimInventoryHold("The native claims state location changed since staging was created.");
	return {
		selected,
		current
	};
}
function childEnvironment(env, key, base) {
	const result = { ...env };
	for (const name of Object.keys(result)) if (name === key || process.platform === "win32" && name.toUpperCase() === key.toUpperCase()) delete result[name];
	result[key] = base;
	return result;
}
function within(root, path) {
	const part = relative(root, path);
	return part === "" || !isAbsolute(part) && part !== ".." && !part.startsWith(".." + sep);
}
/** Read the native public inventory; absence is not a provider-liveness claim. */
async function verifyNoStagingClaims(params) {
	try {
		params.signal?.throwIfAborted();
		const parsedNamespace = claimNamespaceSchema.safeParse(params.namespace);
		if (!parsedNamespace.success) throw new ClaimInventoryHold("The recorded native claims namespace is invalid.");
		const namespace = parsedNamespace.data;
		const env = { ...params.env ?? process.env };
		const before = inspectNamespace(namespace, env);
		if (!isAbsolute(params.sourceRoot) || params.sourceRoot.includes("\0")) throw new ClaimInventoryHold("The staging source path must be absolute.");
		const sourceRoot = directoryLocation(params.sourceRoot).directory;
		const deadline = Date.now() + inspectionBudgetMs;
		const abort = new AbortController();
		const signal = params.signal ? AbortSignal.any([params.signal, abort.signal]) : abort.signal;
		let captureFailure;
		const output = Buffer.alloc(stdoutLimit);
		let stdoutBytes = 0;
		let stderrBytes = 0;
		const exceedLimit = () => {
			captureFailure ??= new ClaimInventoryHold("Native claim inventory exceeded its output limit.");
			abort.abort(captureFailure);
		};
		let status;
		try {
			status = await runManagedCommand({
				bin: params.binary,
				args: [
					"claims",
					"list",
					"--json"
				],
				cwd: params.cwd,
				env: childEnvironment(env, before.selected.key, before.selected.base),
				stdio: [
					"ignore",
					"pipe",
					"pipe"
				],
				timeoutMs: commandTimeoutMs,
				signal,
				requireProcessTreeExit: process.platform !== "win32",
				onReady(child) {
					if (!child.stdout || !child.stderr) throw new ClaimInventoryHold("Native claim inventory output is unavailable.");
					child.stdout.on("data", (chunk) => {
						if (captureFailure) return;
						if (stdoutBytes + chunk.length > stdoutLimit) {
							exceedLimit();
							return;
						}
						stdoutBytes += chunk.copy(output, stdoutBytes);
					});
					child.stderr.on("data", (chunk) => {
						stderrBytes += chunk.length;
						if (stderrBytes > stderrLimit) exceedLimit();
					});
				}
			});
		} catch (error) {
			if (captureFailure && captureFailure !== error) throw new AggregateError([captureFailure, error], captureFailure.message, { cause: error });
			throw error;
		}
		if (captureFailure) throw captureFailure;
		if (status !== 0) throw new ClaimInventoryHold("Native claim inventory failed or returned only partial results.");
		const bytes = output.subarray(0, stdoutBytes);
		let document;
		try {
			if (!isUtf8(bytes)) throw new Error("invalid encoding");
			document = JSON.parse(bytes.toString("utf8"));
		} catch {
			throw new ClaimInventoryHold("Native claim inventory did not return valid JSON.");
		}
		const parsed = inventorySchema.safeParse(document);
		if (!parsed.success) throw new ClaimInventoryHold("Native claim inventory has an unsupported or malformed schema.");
		if (parsed.data.problems.length > 0) throw new ClaimInventoryHold("Native claim inventory reports unreadable or invalid local records.");
		const matches = /* @__PURE__ */ new Set();
		for (const claim of parsed.data.claims) {
			if (Date.now() >= deadline) throw new ClaimInventoryHold("Native claim inventory exceeded its inspection budget.");
			if (within(sourceRoot, directoryLocation(claim.repoRoot).directory)) {
				matches.add(claim.leaseId);
				if (matches.size === 16) break;
			}
		}
		if (matches.size > 0) throw new ClaimInventoryHold("Local claims still name this staging source; stop or reclaim the matching leases before retrying.", [...matches]);
		const after = inspectNamespace(namespace, env);
		if (JSON.stringify(after.current) !== JSON.stringify(before.current)) throw new ClaimInventoryHold("The native claims namespace changed during inventory.");
		params.signal?.throwIfAborted();
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			reason: error instanceof ClaimInventoryHold ? error.message : "Native claim inventory could not be verified.",
			error,
			...hasUnjoinedWork(error) ? { unjoined: true } : {},
			...error instanceof ClaimInventoryHold && error.matchingLeaseIds ? { matchingLeaseIds: error.matchingLeaseIds } : {}
		};
	}
}
//#endregion
//#region scripts/crabbox-staging-location.mts
const stagingPrefix = "openclaw-crabbox-sync-";
const gitRoutingKeys = /* @__PURE__ */ new Set([
	"GIT_DIR",
	"GIT_WORK_TREE",
	"GIT_CEILING_DIRECTORIES",
	"GIT_DISCOVERY_ACROSS_FILESYSTEM"
]);
function prospectiveDirectory(directory) {
	let ancestor = resolve(directory);
	const missing = [];
	for (let depth = 0; depth < 128; depth += 1) try {
		const physical = realpathSync(ancestor);
		if (!statSync(physical).isDirectory()) return;
		accessSync(physical, constants.R_OK | constants.X_OK);
		return resolve(physical, ...missing);
	} catch (error) {
		if (error.code !== "ENOENT") return;
		if (lstatSync(ancestor, { throwIfNoEntry: false })) return;
		const parent = dirname(ancestor);
		if (parent === ancestor) return;
		missing.unshift(basename(ancestor));
		ancestor = parent;
	}
}
function overlaps(left, right) {
	const foldCase = process.platform === "darwin" || process.platform === "win32";
	const leftPath = foldCase ? left.toLowerCase() : left;
	const rightPath = foldCase ? right.toLowerCase() : right;
	const contains = (parent, child) => {
		const path = relative(parent, child);
		return path === "" || !isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`);
	};
	return contains(leftPath, rightPath) || contains(rightPath, leftPath);
}
/**
* Optional recovery registration; false must never prevent ordinary staging.
* This checks the selected source/workspace only. Arbitrary extra host mounts
* are not isolated by recovery registration, and no host tree is traversed.
*/
function canRecordStaging(exactProspectiveStageRoot, repository, env = process.env) {
	try {
		const source = realpathSync(repository);
		if (!statSync(source).isDirectory()) return false;
		accessSync(source, constants.R_OK | constants.X_OK);
		const stage = prospectiveDirectory(exactProspectiveStageRoot);
		if (!stage || overlaps(stage, source)) return false;
		for (const [key, value] of Object.entries(env)) {
			const upper = key.toUpperCase();
			if (value && (upper === "GIT_DIR" || upper === "GIT_WORK_TREE") && !isAbsolute(value)) return false;
		}
		const gitEnv = Object.fromEntries(Object.entries(env).filter(([key]) => {
			const upper = key.toUpperCase();
			return !upper.startsWith("GIT_") || gitRoutingKeys.has(upper);
		}));
		const result = spawnSync("git", ["rev-parse", "--show-toplevel"], {
			cwd: source,
			env: {
				...gitEnv,
				GIT_OPTIONAL_LOCKS: "0",
				GIT_TERMINAL_PROMPT: "0"
			},
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: 5e3,
			killSignal: "SIGKILL",
			maxBuffer: 1048576
		});
		if (result.error || result.status !== 0 || !isUtf8(result.stdout)) return false;
		const workspace = result.stdout.toString("utf8").replace(/\r?\n$/u, "");
		if (!isAbsolute(workspace)) return false;
		const physicalWorkspace = realpathSync(workspace);
		if (!statSync(physicalWorkspace).isDirectory()) return false;
		accessSync(physicalWorkspace, constants.R_OK | constants.X_OK);
		return !overlaps(stage, physicalWorkspace);
	} catch {
		return false;
	}
}
//#endregion
//#region scripts/crabbox-staging.mts
const prefix = stagingPrefix;
const receiptName = "staging.json";
const manifestName = "manifest.json";
const cursorName = prefix + "discovery";
const headerLimit = 32768;
const manifestLimit = 67108864;
const identitySchema = crabboxArtifactIdentitySchema;
const witnessSchema = strictObject({
	gitDir: string(),
	ref: string(),
	commit: string().regex(/^[a-f0-9]{40}$/u)
});
const receiptSchema = strictObject({
	version: literal(2),
	id: uuid(),
	ownerPid: number().int().min(2),
	ownerDomain: string().regex(/^[a-f0-9]{64}$/u).optional(),
	repository: string(),
	repositoryIdentity: identitySchema.optional(),
	claims: claimNamespaceSchema.optional(),
	leases: array(string().min(1).max(512)).max(16).optional(),
	kind: _enum(["capsule", "worktree"]),
	rootIdentity: identitySchema,
	payloadIdentity: identitySchema,
	durable: boolean(),
	users: _enum([
		"none",
		"admitted",
		"settled"
	]),
	state: _enum([
		"preparing",
		"prepared",
		"admitted",
		"settled",
		"preserved",
		"removing"
	]),
	manifest: string().regex(/^[a-f0-9]{64}$/u).optional(),
	witness: witnessSchema.optional(),
	artifactManifest: string().regex(/^[a-f0-9]{64}$/u).optional(),
	hold: _enum([
		"artifacts",
		"claims",
		"writers",
		"registration"
	]).optional()
});
const entrySchema = strictObject({
	path: string().min(1),
	kind: _enum([
		"file",
		"symlink",
		"directory"
	]),
	mode: _enum([
		"100644",
		"100755",
		"120000"
	]).optional(),
	blob: string().regex(/^[a-f0-9]{40}$/u).optional()
});
const sourceEntrySchema = strictObject({
	path: string().min(1),
	mode: _enum([
		"100644",
		"100755",
		"120000"
	]),
	blob: string().regex(/^[a-f0-9]{40}$/u)
});
const manifestSchema = strictObject({
	source: strictObject({
		files: array(sourceEntrySchema),
		deleted: array(string())
	}),
	entries: array(entrySchema),
	artifacts: crabboxArtifactEvidenceSchema.optional()
});
let cachedProcessDomain;
function processDomain() {
	if (cachedProcessDomain !== void 0) return cachedProcessDomain ?? void 0;
	try {
		let boot;
		let namespace = "";
		if (process.platform === "linux") {
			const fd = openSync("/proc/sys/kernel/random/boot_id", constants.O_RDONLY | constants.O_NONBLOCK);
			try {
				const bytes = Buffer.alloc(128);
				boot = bytes.subarray(0, readSync(fd, bytes)).toString("utf8").trim();
			} finally {
				closeSync(fd);
			}
			namespace = readlinkSync("/proc/self/ns/pid");
			if (!/^pid:\[\d+\]$/u.test(namespace)) throw new Error("Process namespace identity is unavailable.");
		} else if (process.platform === "darwin") {
			const result = spawnSync("/usr/sbin/sysctl", ["-n", "kern.bootsessionuuid"], {
				encoding: "utf8",
				env: {},
				timeout: 1e3,
				maxBuffer: 1024
			});
			if (result.error || result.status !== 0) throw new Error("Boot session identity is unavailable.");
			boot = result.stdout.trim();
		} else throw new Error("Process domain identity is unsupported.");
		if (!uuid().safeParse(boot.toLowerCase()).success) throw new Error("Boot session identity is invalid.");
		cachedProcessDomain = createHash("sha256").update(process.platform + ":" + boot.toLowerCase() + ":" + namespace).digest("hex");
	} catch {
		cachedProcessDomain = null;
	}
	return cachedProcessDomain ?? void 0;
}
function identity(path) {
	const stat = lstatSync(path, { bigint: true });
	if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("staging directory was replaced: " + path);
	return {
		dev: String(stat.dev),
		ino: String(stat.ino)
	};
}
function sameIdentity(left, right) {
	return left.dev === right.dev && left.ino === right.ino;
}
function assertIdentity(path, expected) {
	if (!sameIdentity(identity(path), expected)) throw new Error("staging directory identity changed: " + path);
}
function safeRelative(path) {
	return !isAbsolute(path) && !path.includes("\\") && !path.includes("\0") && path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}
function readBounded(path, limit) {
	const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	try {
		const before = fstatSync(fd, { bigint: true });
		if (!before.isFile() || before.size > BigInt(limit)) throw new Error("staging metadata is not a bounded regular file");
		const bytes = Buffer.alloc(Number(before.size));
		for (let offset = 0; offset < bytes.length;) {
			const count = readSync(fd, bytes, offset, bytes.length - offset, null);
			if (!count) throw new Error("staging metadata became shorter while reading");
			offset += count;
		}
		const after = fstatSync(fd, { bigint: true });
		if (before.ino !== after.ino || before.size !== after.size || before.mtimeNs !== after.mtimeNs || before.ctimeNs !== after.ctimeNs) throw new Error("staging metadata changed while reading");
		return bytes;
	} finally {
		closeSync(fd);
	}
}
function syncDirectory(path) {
	if (process.platform === "win32") return false;
	let fd;
	try {
		fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_DIRECTORY);
		fsyncSync(fd);
		return true;
	} catch (error) {
		if ([
			"EINVAL",
			"ENOTSUP",
			"EOPNOTSUPP",
			"ENOSYS"
		].includes(error.code ?? "")) return false;
		throw error;
	} finally {
		if (fd !== void 0) closeSync(fd);
	}
}
function syncFile(fd) {
	try {
		fsyncSync(fd);
		return true;
	} catch (error) {
		if ([
			"EINVAL",
			"ENOTSUP",
			"EOPNOTSUPP",
			"ENOSYS"
		].includes(error.code ?? "")) return false;
		throw error;
	}
}
function writeAtomic(root, name, bytes, durable = true) {
	const temporary = join(root, "." + name + "." + randomUUID());
	try {
		let fileDurable = false;
		const fd = openSync(temporary, "wx", 384);
		try {
			writeFileSync(fd, bytes);
			fileDurable = durable && syncFile(fd);
		} finally {
			closeSync(fd);
		}
		renameSync(temporary, join(root, name));
		return fileDurable && syncDirectory(root);
	} finally {
		rmSync(temporary, { force: true });
	}
}
function blob(path, symbolic) {
	if (symbolic) {
		const bytes = readlinkSync(path, { encoding: "buffer" });
		return createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
	}
	const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	try {
		const before = fstatSync(fd, { bigint: true });
		if (!before.isFile()) throw new Error("staging contains an unsupported file");
		const hash = createHash("sha1").update("blob " + before.size + "\0");
		const buffer = Buffer.alloc(65536);
		for (;;) {
			const count = readSync(fd, buffer);
			if (!count) break;
			hash.update(buffer.subarray(0, count));
		}
		const after = fstatSync(fd, { bigint: true });
		if (before.size !== after.size || before.mtimeNs !== after.mtimeNs || before.ctimeNs !== after.ctimeNs) throw new Error("staging content changed while reading");
		return hash.digest("hex");
	} finally {
		closeSync(fd);
	}
}
function artifactPath(path) {
	return path === "source/.crabbox" || ["source/.crabbox/runs", "source/.crabbox/captures"].some((root) => path === root || path.startsWith(root + "/"));
}
function inventory(payload, known = /* @__PURE__ */ new Map(), preservedArtifacts = false) {
	const entries = [];
	const walk = (directory, parent) => {
		for (const name of readdirSync(directory)) {
			const path = parent ? parent + "/" + name : name;
			if (preservedArtifacts && artifactPath(path) && path !== "source/.crabbox") continue;
			if (!safeRelative(path)) throw new Error("staging contains an unsupported path");
			const absolute = join(payload, path);
			const stat = lstatSync(absolute);
			if (stat.isDirectory()) {
				if (!preservedArtifacts || path !== "source/.crabbox") entries.push({
					path,
					kind: "directory"
				});
				walk(absolute, path);
			} else if (stat.isFile() || stat.isSymbolicLink()) {
				const symbolic = stat.isSymbolicLink();
				const mode = symbolic ? "120000" : stat.mode & 64 ? "100755" : "100644";
				const frozen = known.get(path);
				if (frozen && frozen.mode !== mode) throw new Error("source mode changed before sealing: " + path);
				entries.push({
					path,
					kind: symbolic ? "symlink" : "file",
					mode,
					blob: frozen?.blob ?? blob(absolute, symbolic)
				});
			} else throw new Error("staging contains an unsupported file kind: " + path);
		}
	};
	walk(payload, "");
	return entries.toSorted((a, b) => a.path.localeCompare(b.path));
}
function readReceipt(root) {
	identity(root);
	let receipt;
	try {
		receipt = receiptSchema.parse(JSON.parse(readBounded(join(root, receiptName), headerLimit).toString("utf8")));
	} catch {
		throw new Error("staging receipt has unknown or invalid metadata");
	}
	if (basename(root) !== prefix + receipt.id) throw new Error("staging generation does not match its directory");
	assertIdentity(root, receipt.rootIdentity);
	return receipt;
}
function ownerAbsent(pid) {
	try {
		process.kill(pid, 0);
		return false;
	} catch (error) {
		return error.code === "ESRCH";
	}
}
function createStaging(syncRoot, repository, kind = "capsule") {
	const id = randomUUID();
	mkdirSync(syncRoot, { recursive: true });
	const root = join(realpathSync(syncRoot), prefix + id);
	mkdirSync(root, { mode: 448 });
	const recorded = canRecordStaging(root, repository);
	const payload = join(root, "payload");
	let receipt;
	try {
		mkdirSync(payload, { mode: 448 });
		receipt = {
			version: 2,
			id,
			ownerPid: process.pid,
			ownerDomain: recorded ? processDomain() : void 0,
			repository: realpathSync(repository),
			repositoryIdentity: identity(realpathSync(repository)),
			kind,
			rootIdentity: identity(root),
			payloadIdentity: identity(payload),
			durable: recorded && syncDirectory(root) && syncDirectory(dirname(root)),
			users: "none",
			state: "preparing"
		};
		if (recorded && !writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n", receipt.durable) && receipt.durable) {
			receipt.durable = false;
			writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n", false);
		}
	} catch (error) {
		try {
			rmSync(root, {
				recursive: true,
				force: true
			});
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Staging preparation failed; allocation retained at " + root, { cause: cleanupError });
		}
		throw error;
	}
	const update = (fields) => {
		assertIdentity(root, receipt.rootIdentity);
		receipt = {
			...receipt,
			...fields
		};
		if (!recorded) return;
		if (!writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n", receipt.durable) && receipt.durable) {
			receipt.durable = false;
			writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n", false);
		}
	};
	let disposed = false;
	return {
		recorded,
		root,
		payload,
		prepared(source, witness) {
			if (!recorded) return;
			const known = new Map(source.files.map((entry) => ["source/" + entry.path, {
				...entry,
				path: "source/" + entry.path,
				kind: entry.mode === "120000" ? "symlink" : "file"
			}]));
			const manifest = {
				source,
				entries: inventory(payload, known)
			};
			const bytes = JSON.stringify(manifest) + "\n";
			if (Buffer.byteLength(bytes) > manifestLimit) throw new Error("staging manifest exceeds the recovery metadata limit");
			const durable = writeAtomic(root, manifestName, bytes, receipt.durable);
			let claims;
			try {
				claims = captureClaimNamespace(join(payload, "source"));
			} catch {}
			update({
				durable,
				claims,
				state: "prepared",
				manifest: createHash("sha256").update(bytes).digest("hex"),
				witness
			});
		},
		admitted: (claims, leases) => update({
			state: "admitted",
			users: "admitted",
			claims,
			leases
		}),
		settled: (leases) => update({
			state: "settled",
			users: "settled",
			leases: leases ?? receipt.leases
		}),
		preserved(artifacts) {
			if (!recorded) return;
			assertIdentity(root, receipt.rootIdentity);
			const saved = writeArtifactRecord(root, artifacts, receipt.durable);
			update({
				state: "preserved",
				durable: saved.durable && receipt.durable && artifacts.durable,
				artifactManifest: saved.digest
			});
		},
		hold: (hold) => update({ hold: receipt.hold === "writers" ? "writers" : hold }),
		dispose() {
			if (disposed) return;
			update({ state: "removing" });
			assertIdentity(payload, receipt.payloadIdentity);
			rmSync(payload, {
				recursive: true,
				force: true
			});
			rmSync(root, {
				recursive: true,
				force: true
			});
			disposed = true;
		}
	};
}
function readManifest(root, receipt) {
	const bytes = readBounded(join(root, manifestName), manifestLimit);
	if (createHash("sha256").update(bytes).digest("hex") !== receipt.manifest) throw new Error("staging manifest does not match its receipt");
	try {
		return manifestSchema.parse(JSON.parse(bytes.toString("utf8")));
	} catch {
		throw new Error("staging manifest has unknown or invalid metadata");
	}
}
function writeArtifactRecord(root, artifacts, durable = true) {
	const bytes = JSON.stringify(artifacts) + "\n";
	if (Buffer.byteLength(bytes) > manifestLimit) throw new Error("staging artifact evidence exceeds the recovery metadata limit");
	const digest = createHash("sha256").update(bytes).digest("hex");
	return {
		digest,
		durable: writeAtomic(root, "artifacts-" + digest + ".json", bytes, durable)
	};
}
function readArtifactRecord(root, digest) {
	const bytes = readBounded(join(root, "artifacts-" + digest + ".json"), manifestLimit);
	if (createHash("sha256").update(bytes).digest("hex") !== digest) throw new Error("staging artifact evidence does not match its recorded identity");
	try {
		return crabboxArtifactEvidenceSchema.parse(JSON.parse(bytes.toString("utf8")));
	} catch {
		throw new Error("staging artifact evidence has unknown or invalid metadata");
	}
}
function recoveryMetadata(root, source, artifacts) {
	const names = readdirSync(root).toSorted();
	if (names.length > 68) throw new Error("staging has too many metadata generations; inspect it before recovery");
	const known = /* @__PURE__ */ new Set([
		receiptName,
		manifestName,
		"payload",
		"recovery.lock"
	]);
	const sourceIdentity = lstatSync(source, { throwIfNoEntry: false }) ? identity(source) : artifacts?.sourceIdentity;
	const generations = [];
	for (const name of names) {
		if (known.has(name)) continue;
		const match = /^artifacts-([a-f0-9]{64})\.json$/u.exec(name);
		if (!match || !sourceIdentity || !sameIdentity(readArtifactRecord(root, match[1]).sourceIdentity, sourceIdentity)) throw new Error("staging has an unknown or replaced metadata sibling; preserve it before recovery");
		generations.push(name);
	}
	return generations;
}
function metadataStatus(root, receipt, explicit = false) {
	const base = {
		id: receipt.id,
		directory: root,
		ownerPid: receipt.ownerPid,
		state: receipt.state,
		users: receipt.users,
		kind: receipt.kind,
		hold: receipt.hold,
		leases: receipt.leases
	};
	if (lstatSync(join(root, "recovery.lock"), { throwIfNoEntry: false })) return {
		...base,
		status: "protected",
		reason: "Another or interrupted recovery owns this copy; inspect that operation before manual disposition."
	};
	if (!receipt.ownerDomain || receipt.ownerDomain !== processDomain()) return {
		...base,
		status: "protected",
		reason: "The producer belongs to an unknown or different boot/process namespace; this process cannot establish its absence."
	};
	if (!ownerAbsent(receipt.ownerPid)) return {
		...base,
		status: "active",
		reason: "The producer PID is live or cannot be checked; wait for its cleanup."
	};
	if (receipt.kind === "worktree") return {
		...base,
		status: "protected",
		reason: "Full-worktree preparation can run hooks or filters. Preserve its raw source and outputs, then verify this exact Git registration before manual disposition; recovery does not adopt it."
	};
	if (!receipt.durable || !receipt.manifest) return {
		...base,
		status: "protected",
		reason: "Preparation or durable recovery metadata is incomplete; preserve this copy for inspection."
	};
	if (receipt.users === "admitted" || receipt.state === "preparing") return {
		...base,
		status: "protected",
		reason: "Writer settlement was not recorded; PID absence does not authorize removal."
	};
	if (receipt.hold === "writers" || receipt.hold === "registration") return {
		...base,
		status: "protected",
		reason: "Writer or registration settlement is unverified; inspect and preserve this copy before manual disposition."
	};
	if (!explicit && (receipt.hold || receipt.users === "settled" && receipt.state === "settled")) return {
		...base,
		status: "protected",
		reason: "Claim or diagnostic preservation is incomplete; repair the named destination or lease, then run staging recover with this ID to retry."
	};
	if (![
		"prepared",
		"settled",
		"preserved",
		"removing"
	].includes(receipt.state)) return {
		...base,
		status: "protected",
		reason: "Staging state is inconsistent with recorded ownership; preserve it for inspection."
	};
	if (!receipt.claims) return {
		...base,
		status: "protected",
		reason: "The original native claims namespace was not recorded; absence in another namespace cannot authorize removal."
	};
	if (!receipt.witness) return {
		...base,
		status: "protected",
		reason: "No independent retained Git ref is recorded; preserve the snapshot in a retained repository first."
	};
	return {
		...base,
		status: "candidate",
		reason: "Source preservation and unchanged contents must still be verified before removal."
	};
}
function inspectStaging(syncRoot, options = {}) {
	const started = performance.now();
	const entries = [];
	let incomplete = false;
	let nextCursor = options.startAfter;
	let skipping = Boolean(options.startAfter);
	let directory;
	try {
		directory = opendirSync(syncRoot);
	} catch (error) {
		if (error.code === "ENOENT") return {
			entries,
			incomplete,
			nextCursor: void 0,
			elapsedMs: performance.now() - started
		};
		throw error;
	}
	try {
		for (;;) {
			if (entries.length >= (options.limit ?? 64) || performance.now() - started >= (options.budgetMs ?? 250)) {
				incomplete = true;
				break;
			}
			const entry = directory.readSync();
			if (!entry) {
				nextCursor = void 0;
				incomplete = skipping;
				break;
			}
			if (skipping) {
				skipping = entry.name !== options.startAfter;
				continue;
			}
			if (!entry.name.startsWith(prefix) || entry.name === cursorName) continue;
			nextCursor = entry.name;
			const root = join(syncRoot, entry.name);
			try {
				entries.push(metadataStatus(root, readReceipt(root)));
			} catch {
				entries.push({
					id: entry.name,
					directory: root,
					status: "protected",
					reason: "Unmarked, unknown, replaced or unreadable staging; no automatic adoption."
				});
			}
		}
	} finally {
		directory.closeSync();
	}
	return {
		entries,
		incomplete,
		nextCursor,
		elapsedMs: performance.now() - started
	};
}
const cursorSchema = strictObject({
	version: literal(1),
	rootIdentity: identitySchema,
	cursorIdentity: identitySchema,
	after: string().startsWith(prefix).max(256).optional()
});
function readCursor(syncRoot) {
	const physicalRoot = realpathSync(syncRoot);
	const root = join(physicalRoot, cursorName);
	const value = cursorSchema.parse(JSON.parse(readBounded(join(root, "position.json"), headerLimit).toString("utf8")));
	assertIdentity(physicalRoot, value.rootIdentity);
	assertIdentity(root, value.cursorIdentity);
	if (value.after && basename(value.after) !== value.after) throw new Error("staging discovery cursor is invalid");
	return value;
}
/** Metadata-only discovery; its cursor is a fairness hint, never deletion authority. */
function discoverStaging(syncRoot) {
	let startAfter;
	try {
		startAfter = readCursor(syncRoot).after;
	} catch {}
	return inspectStaging(syncRoot, { startAfter });
}
/** Advance bounded discovery and attempt at most one old candidate after normal completion. */
async function recoverDiscoveredStaging(syncRoot, discovery, options) {
	options.signal?.throwIfAborted();
	if (!discovery.entries.length && !discovery.incomplete) return;
	const physicalRoot = realpathSync(syncRoot);
	const cursor = join(physicalRoot, cursorName);
	const candidate = discovery.entries.find((entry) => entry.status === "candidate");
	try {
		if (!canRecordStaging(cursor, options.cwd)) throw new Error("This source location does not support recovery metadata.");
		if (!lstatSync(cursor, { throwIfNoEntry: false })) mkdirSync(cursor, { mode: 448 });
		else readCursor(physicalRoot);
		writeAtomic(cursor, "position.json", JSON.stringify({
			version: 1,
			rootIdentity: identity(physicalRoot),
			cursorIdentity: identity(cursor),
			after: candidate ? basename(candidate.directory) : discovery.nextCursor
		}) + "\n");
	} catch {
		options.signal?.throwIfAborted();
		console.error("[crabbox] staging discovery cursor is unavailable; retained it for inspection. Use staging inspect --after to page past protected entries.");
	}
	if (candidate) return recoverStaging(physicalRoot, candidate.id, {
		...options,
		automatic: true
	});
}
function validatePayload(root, receipt, manifest) {
	const payload = join(root, "payload");
	if (!lstatSync(payload, { throwIfNoEntry: false }) && receipt.state === "removing") return "[]";
	assertIdentity(payload, receipt.payloadIdentity);
	const entries = manifest.artifacts ? manifest.entries.filter((entry) => !artifactPath(entry.path)) : manifest.entries;
	const expected = new Map(entries.map((entry) => [entry.path, entry]));
	if (expected.size !== entries.length || [...expected.keys()].some((path) => !safeRelative(path))) throw new Error("staging manifest contains duplicate or unsafe paths");
	const actual = inventory(payload, /* @__PURE__ */ new Map(), Boolean(manifest.artifacts));
	for (const entry of actual) {
		const frozen = expected.get(entry.path);
		if (!frozen || frozen.kind !== entry.kind || frozen.mode !== entry.mode || frozen.blob !== entry.blob) throw new Error("staging contents changed or gained an entry: " + entry.path);
		expected.delete(entry.path);
	}
	if (expected.size && receipt.state !== "removing") throw new Error("staging contents are missing before disposal");
	return JSON.stringify(actual);
}
async function recoverStaging(syncRoot, id, options) {
	if (!uuid().safeParse(id).success) return {
		id,
		recovered: false,
		reason: "Choose a recorded staging ID from staging inspect."
	};
	const root = join(syncRoot, prefix + id);
	const source = join(root, "payload", "source");
	let locked = false;
	let unsettled = false;
	let lockedRoot;
	let lockedDirectory;
	const lockOwner = JSON.stringify({
		pid: process.pid,
		generation: randomUUID()
	}) + "\n";
	const lock = join(root, "recovery.lock");
	try {
		options.signal?.throwIfAborted();
		const before = readReceipt(root);
		const selectedWitness = options.witness ?? before.witness;
		const status = metadataStatus(root, {
			...before,
			witness: selectedWitness
		}, !options.automatic);
		if (status.status !== "candidate") return {
			id,
			recovered: false,
			reason: status.reason
		};
		mkdirSync(lock, { mode: 448 });
		locked = true;
		lockedRoot = identity(root);
		lockedDirectory = identity(lock);
		writeFileSync(join(lock, "owner.json"), lockOwner, {
			mode: 384,
			flag: "wx"
		});
		let receipt = readReceipt(root);
		if (JSON.stringify(receipt) !== JSON.stringify(before) || !ownerAbsent(receipt.ownerPid)) throw new Error("staging ownership changed while acquiring recovery");
		const saveReceipt = (next) => {
			assertIdentity(root, receipt.rootIdentity);
			receipt = next;
			if (!writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n")) {
				receipt.durable = false;
				writeAtomic(root, receiptName, JSON.stringify(receipt) + "\n", false);
				throw new Error("Durable recovery updates are unavailable; staging remains protected.");
			}
		};
		const checkClaims = async () => {
			const claims = await verifyNoStagingClaims({
				binary: options.binary,
				cwd: options.cwd,
				namespace: receipt.claims,
				sourceRoot: root,
				signal: options.signal
			});
			if (!claims.ok) {
				unsettled ||= claims.unjoined === true;
				if (!unsettled) saveReceipt({
					...receipt,
					hold: "claims",
					leases: claims.matchingLeaseIds ?? receipt.leases
				});
				throw new Error(claims.reason + (claims.matchingLeaseIds?.length ? " Matching leases: " + JSON.stringify(claims.matchingLeaseIds) : ""), { cause: claims.error });
			}
		};
		await checkClaims();
		let manifest = readManifest(root, receipt);
		if (receipt.artifactManifest) manifest = {
			...manifest,
			artifacts: readArtifactRecord(root, receipt.artifactManifest)
		};
		recoveryMetadata(root, source, manifest.artifacts);
		if (receipt.users === "settled") try {
			if (!manifest.artifacts) throw new Error("Diagnostic preservation was not recorded.");
			verifyPreservedCrabboxArtifacts(source, manifest.artifacts, receipt.state === "removing");
		} catch (error) {
			if (options.automatic || receipt.state === "removing") throw error;
			if (!receipt.repositoryIdentity) throw new Error("Original repository identity is unavailable; preserve diagnostics manually.", { cause: error });
			const artifacts = preserveCrabboxArtifacts(source, receipt.repository, receipt.repositoryIdentity);
			if (!artifacts?.durable) throw new Error("Durable diagnostic preservation could not be established.", { cause: error });
			manifest = {
				...manifest,
				artifacts
			};
			const saved = writeArtifactRecord(root, artifacts);
			if (!saved.durable) throw new Error("Durable artifact evidence could not be recorded.", { cause: error });
			saveReceipt({
				...receipt,
				artifactManifest: saved.digest,
				state: "preserved",
				hold: void 0
			});
		}
		const generations = recoveryMetadata(root, source, manifest.artifacts);
		const footprint = validatePayload(root, receipt, manifest);
		const witness = await verifySourceWitness({
			source: manifest.source,
			witness: selectedWitness,
			payloadRoot: root,
			signal: options.signal
		});
		if (!witness.ok) {
			unsettled ||= witness.unjoined === true;
			return {
				id,
				recovered: false,
				reason: witness.reason
			};
		}
		await checkClaims();
		options.signal?.throwIfAborted();
		if (JSON.stringify(readReceipt(root)) !== JSON.stringify(receipt) || !ownerAbsent(receipt.ownerPid)) throw new Error("staging ownership changed during preservation verification");
		if (validatePayload(root, receipt, manifest) !== footprint) throw new Error("staging changed during preservation verification");
		if (manifest.artifacts) verifyPreservedCrabboxArtifacts(source, manifest.artifacts, receipt.state === "removing");
		assertIdentity(lock, lockedDirectory);
		if (readBounded(join(lock, "owner.json"), headerLimit).toString("utf8") !== lockOwner || JSON.stringify(recoveryMetadata(root, source, manifest.artifacts)) !== JSON.stringify(generations)) throw new Error("staging metadata changed during preservation verification");
		saveReceipt({
			...receipt,
			state: "removing",
			hold: void 0,
			witness: selectedWitness
		});
		witness.revalidate();
		rmSync(join(root, "payload"), {
			recursive: true,
			force: true
		});
		rmSync(join(root, manifestName));
		for (const name of generations) rmSync(join(root, name));
		rmSync(join(root, receiptName));
		rmSync(join(lock, "owner.json"));
		rmdirSync(lock);
		locked = false;
		rmdirSync(root);
		return {
			id,
			recovered: true,
			reason: "Independent retained source, diagnostics, and native claims verified; abandoned staging removed."
		};
	} catch (error) {
		return {
			id,
			recovered: false,
			reason: error.code === "EEXIST" ? "Another or interrupted recovery owns this copy; inspect its owner before manual disposition." : error instanceof Error ? error.message : "Staging recovery could not be verified."
		};
	} finally {
		if (locked && !unsettled && lockedRoot && lockedDirectory) try {
			assertIdentity(root, lockedRoot);
			assertIdentity(lock, lockedDirectory);
			if (readBounded(join(lock, "owner.json"), headerLimit).toString("utf8") === lockOwner) {
				rmSync(join(lock, "owner.json"));
				rmdirSync(lock);
			}
		} catch {}
	}
}
async function runStagingCommand(args, syncRoot, options) {
	if (args[0] === "inspect" && (args.length === 1 || args.length === 3 && args[1] === "--after" && args[2].startsWith(prefix) && basename(args[2]) === args[2])) {
		console.log(JSON.stringify(inspectStaging(syncRoot, { startAfter: args[2] }), null, 2));
		return 0;
	}
	if (args[0] === "recover" && (args.length === 2 || args.length === 6)) try {
		let witness;
		if (args.length === 6) {
			const fields = /* @__PURE__ */ new Map([[args[2], args[3]], [args[4], args[5]]]);
			if (fields.size !== 2 || !fields.get("--witness-repo") || !fields.get("--witness-ref")) throw new Error("Supply both --witness-repo and --witness-ref, with one value each.");
			witness = selectSourceWitness(fields.get("--witness-repo"), fields.get("--witness-ref"));
		}
		const result = await recoverStaging(syncRoot, args[1], {
			...options,
			witness
		});
		console.log(JSON.stringify(result, null, 2));
		return result.recovered ? 0 : 1;
	} catch (error) {
		console.log(JSON.stringify({
			id: args[1],
			recovered: false,
			reason: error instanceof Error ? error.message : "Recovery options could not be verified."
		}, null, 2));
		return 1;
	}
	console.log("Usage: node scripts/crabbox-wrapper.mjs staging inspect [--after <nextCursor>]\n       node scripts/crabbox-wrapper.mjs staging recover <id> [--witness-repo <path> --witness-ref <full-ref>]\n\nOnly positively settled, unchanged staging with independently retained source and preserved diagnostics can be removed. Existing native claims are inspected without provider calls or claim mutation.");
	return args.length === 0 || args[0] === "--help" ? 0 : 2;
}
//#endregion
export { captureClaimNamespace as a, finalizeManagedChild as c, runStagingCommand as i, hasUnjoinedWork as l, discoverStaging as n, preserveCrabboxArtifacts as o, recoverDiscoveredStaging as r, captureSourceWitness as s, createStaging as t, loadManagedChildSpawner as u };

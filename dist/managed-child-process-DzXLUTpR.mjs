import { a as resolveWindowsSystem32Path, r as resolveWindowsCmdExePath, t as buildCmdExeCommandLine } from "./windows-cmd-helpers-6q_bkE4I.mjs";
import fs from "node:fs";
import path from "node:path";
import { constants as constants$1, tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";
//#region scripts/lib/vitest-resource-ownership.mts
const OWNER_DIRECTORY = ".vitest-resource-owner";
const ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
function readReceipt(file) {
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
		if (readReceipt(ownerFile) !== identity) throw new Error(`Vitest resource owner changed: ${root}`);
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
					if (ID_PATTERN.test(id) && readReceipt(receipt) === `${identity}:${id}`) continue;
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
		const identity = readReceipt(path.join(current, OWNER_DIRECTORY, "owner"));
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
		if ("errors" in current && Array.isArray(current.errors)) for (const error of current.errors) pending.push(error);
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
function terminateManagedChild(child, signal = "SIGTERM", { deadlineAt, onChildSignalError, onProcessGroupSignalError, platform = process.platform, processGroupFallback = "always", runTaskkill = spawnSync, taskkillTimeoutMs = TASKKILL_TIMEOUT_MS, useProcessGroup = platform !== "win32", useWindowsTaskkill = true } = {}) {
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
		if (isExitedDarwinGroup(child, platform, error, deadlineAt)) return { processTreeState: "terminated" };
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
			if (isZombieProcessGroup(pid, platform, deadlineAt)) return "dead";
			process.kill(-pid, 0);
		}
		return "live";
	} catch (error) {
		if (isMissingProcessError(error)) return "dead";
		if (isExitedDarwinGroup(child, platform, error, deadlineAt)) return "dead";
		return errorPolicy === "alive-on-eperm" && hasProcessErrorCode(error, "EPERM") ? "live" : "indeterminate";
	}
}
function isExitedDarwinGroup(child, platform, error, deadlineAt) {
	if (platform !== "darwin" || !hasProcessErrorCode(error, "EPERM") || !child.pid || child.exitCode == null && child.signalCode == null) return false;
	if (isZombieProcessGroup(child.pid, platform, deadlineAt)) return true;
	try {
		process.kill(-child.pid, 0);
	} catch (probeError) {
		return isMissingProcessError(probeError);
	}
	return false;
}
function isZombieProcessGroup(pid, platform, deadlineAt) {
	const timeout = deadlineAt === void 0 ? PROCESS_GROUP_DRAIN_TIMEOUT_MS : Math.min(PROCESS_GROUP_DRAIN_TIMEOUT_MS, Math.floor(deadlineAt - Date.now()));
	if (timeout <= 0) return false;
	const result = spawnSync("ps", [
		...platform === "darwin" ? ["-g", String(pid)] : [
			"-s",
			String(pid),
			"-L"
		],
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
	const zombie = new RegExp(`^\\s*${pid}\\s+${platform === "darwin" ? "Z[+<>AELNSsVWX]*" : "Z"}\\s*$`, "u");
	return !result.error && result.status === 0 && result.stdout.trim().split("\n").every((row) => zombie.test(row));
}
/** Run a child command while forwarding termination signals to its process group. */
async function runManagedCommand(options) {
	const { memoryLimitBytes } = options;
	if (memoryLimitBytes !== void 0) {
		if (!Number.isSafeInteger(memoryLimitBytes) || memoryLimitBytes <= 0) throw new Error("Managed command memory limit must be a positive integer");
		if ((options.platform ?? process.platform) === "linux") {
			if (Array.isArray(options.stdio) && (options.stdio.length > 3 || options.stdio.includes("ipc"))) throw new Error("Linux memory-limited commands do not support IPC or extra stdio descriptors");
			const command = {
				...options,
				args: options.args?.slice(),
				cwd: path.resolve(options.cwd ?? process.cwd()),
				env: { ...options.env ?? process.env },
				stdio: Array.isArray(options.stdio) ? [...options.stdio] : options.stdio
			};
			const { runLinuxMemoryCommand } = await import("./managed-memory-CB-_fMfr.mjs");
			const env = command.env;
			const releaseClaim = findVitestResourceOwner(env.TMPDIR || env.TMP || env.TEMP || tmpdir())?.claim();
			let joined = true;
			let leafActive = false;
			let receivedSignal;
			const rememberSignal = (received) => {
				receivedSignal ??= received;
				if (!leafActive) command.onSignal?.(received);
			};
			installSignalHandlers();
			managedChildren.add(rememberSignal);
			try {
				const status = await runLinuxMemoryCommand(command, async (scopedCommand) => {
					leafActive = true;
					try {
						return await runManagedCommandInner(scopedCommand, false);
					} finally {
						leafActive = false;
					}
				});
				if (receivedSignal) return signalExitCode(receivedSignal);
				if (command.signal?.aborted) throw Object.assign(/* @__PURE__ */ new Error("Managed command aborted"), { code: "ABORT_ERR" });
				return status;
			} catch (error) {
				joined = !hasUnjoinedWork(error);
				throw error;
			} finally {
				try {
					if (joined) releaseClaim?.();
				} finally {
					managedChildren.delete(rememberSignal);
					removeSignalHandlersIfIdle();
				}
			}
		}
		throw new Error("Semantic checks require verified kernel memory containment. Run this command through Crabbox or a memory-limited Linux VM; native containment is not qualified on this platform.");
	}
	return await runManagedCommandInner(options);
}
async function runManagedCommandInner({ stdio = "inherit", platform = process.platform, memoryLimitBytes: _memoryLimitBytes, onMemoryScope: _onMemoryScope, timeoutMs, timeoutKillGraceMs, signalKillGraceMs, timeoutForceKillOnLeaderExit = false, requireProcessTreeExit = false, runTaskkill = spawnSync, onReady, signal, abortKillGraceMs, cleanupDrainTimeoutMs, onSignal, ...commandOptions }, claimResources = true) {
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
	let releaseClaim = claimResources ? findVitestResourceOwner(commandEnv.TMPDIR || commandEnv.TMP || commandEnv.TEMP || tmpdir())?.claim() : void 0;
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
	const pendingOutputCloses = new Set([child.stdout, child.stderr].filter((pipe) => pipe != null));
	const removeOutputCloseListeners = [...pendingOutputCloses].map((pipe) => {
		const onClose = () => {
			pendingOutputCloses.delete(pipe);
		};
		pipe.once("close", onClose);
		return () => pipe.off("close", onClose);
	});
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
			areOutputPipesClosed: () => pendingOutputCloses.size === 0,
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
		for (const removeListener of removeOutputCloseListeners) removeListener();
		clearTimeout(timeoutTimer);
		signal?.removeEventListener("abort", abort);
		managedChildren.delete(forwardSignal);
		removeSignalHandlersIfIdle();
		if (!child.pid) releaseOwnership();
	}
}
async function finalizeManagedChild(child, signal, { platform, runTaskkill, forceKillDelayMs = FORCE_KILL_DELAY_MS, forceKillOnLeaderExit = false, drainTimeoutMs = PROCESS_GROUP_DRAIN_TIMEOUT_MS, retainOutputOnFailure = false, areOutputPipesClosed, onTerminated = () => {} }) {
	const startedAt = Date.now();
	const forceDelay = signal ? forceKillDelayMs : 0;
	const signalErrors = [];
	const recordSignalError = (error) => {
		if (!isMissingProcessError(error)) signalErrors.push(error);
	};
	const terminationOptions = {
		deadlineAt: signal ? startedAt : startedAt + drainTimeoutMs,
		platform,
		runTaskkill,
		onChildSignalError: recordSignalError,
		onProcessGroupSignalError: recordSignalError
	};
	const job = windowsJobs.get(child);
	const normalJobExit = !signal && job !== void 0;
	const outputClosed = areOutputPipesClosed ?? (() => [child.stdout, child.stderr].every((pipe) => !pipe || pipe.closed));
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
				if (groupState !== "dead") terminateManagedChild(child, "SIGKILL", {
					...terminationOptions,
					deadlineAt: deadline
				});
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
export { runManagedCommand as i, hasUnjoinedWork as n, loadManagedChildSpawner as r, finalizeManagedChild as t };

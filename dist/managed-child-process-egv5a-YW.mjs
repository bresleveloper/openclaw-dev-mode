import { a as resolveWindowsSystem32Path, r as resolveWindowsCmdExePath, t as buildCmdExeCommandLine } from "./windows-cmd-helpers-6q_bkE4I.mjs";
import fs, { fstatSync, writeSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { constants as constants$1, tmpdir } from "node:os";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { spawn, spawnSync } from "node:child_process";
import { Socket } from "node:net";
import { Writable } from "node:stream";
//#region scripts/lib/managed-cleanup-handoff.mts
const HANDOFF_ENV = "OPENCLAW_MANAGED_CLEANUP_PARENT";
const MAX_FRAME_BYTES = 1024;
function readParent() {
	const value = process.env[HANDOFF_ENV];
	if (!isMainThread || process.platform === "win32" || !value) return;
	const [pidText, fdText, token, extra] = value.split(":");
	const pid = Number(pidText);
	const fd = Number(fdText);
	if (extra !== void 0 || pid !== process.ppid || !Number.isSafeInteger(fd) || fd < 3 || typeof token !== "string" || !/^[0-9a-f-]{36}$/u.test(token)) return;
	try {
		if (fstatSync(fd).isSocket()) return {
			fd,
			pid,
			token
		};
	} catch {}
}
function hasManagedCleanupParent() {
	return client !== void 0 || readParent() !== void 0;
}
let client;
var ManagedCleanupCancelled = class extends Error {
	constructor(signal) {
		super("Managed cleanup parent is already cancelling");
		this.code = "ABORT_ERR";
		this.signal = signal;
	}
};
function cleanupClient() {
	if (client) return client;
	const parent = readParent();
	if (!parent) return;
	delete process.env[HANDOFF_ENV];
	return client = createCleanupClient(parent);
}
function createCleanupClient(parent) {
	const channel = new Socket({
		fd: parent.fd,
		readable: true,
		writable: true
	});
	let owned = false;
	let permanent = false;
	let operations = 0;
	let failedCleanup = false;
	let error;
	let buffer = "";
	let tail = Promise.resolve();
	let waiters = 0;
	let pending;
	const fail = (failure) => {
		error ??= failure;
		pending?.reject(error);
		pending = void 0;
		channel.destroy();
	};
	const markFailed = () => {
		if (!failedCleanup) {
			failedCleanup = true;
			if (owned && !channel.destroyed) channel.write(`failed ${parent.token}\n`);
		}
	};
	channel.unref();
	channel.setEncoding("utf8");
	channel.on("error", fail);
	channel.on("end", () => fail(/* @__PURE__ */ new Error("Managed cleanup parent closed its control channel")));
	channel.on("close", () => {
		if (pending) fail(/* @__PURE__ */ new Error("Managed cleanup parent closed before acknowledging ownership"));
	});
	channel.on("data", (chunk) => {
		buffer += chunk;
		if (Buffer.byteLength(buffer) > MAX_FRAME_BYTES) {
			fail(/* @__PURE__ */ new Error("Managed cleanup parent sent an invalid acknowledgement"));
			return;
		}
		let newline;
		while ((newline = buffer.indexOf("\n")) !== -1) {
			const frame = buffer.slice(0, newline);
			buffer = buffer.slice(newline + 1);
			const stopping = [
				"SIGINT",
				"SIGTERM",
				"SIGHUP"
			].find((signal) => frame === `stopping ${signal} ${parent.token}`);
			if (stopping) {
				fail(new ManagedCleanupCancelled(stopping));
				return;
			}
			if (!pending || frame !== `${pending.kind === "claim" ? "owned" : "released"} ${parent.token}`) {
				fail(/* @__PURE__ */ new Error("Managed cleanup parent sent an invalid acknowledgement"));
				return;
			}
			owned = pending.kind === "claim";
			const { resolve } = pending;
			pending = void 0;
			resolve();
		}
	});
	if (process.versions.bun) {
		tail = new Promise((resolve, reject) => {
			channel.once("connect", resolve);
			channel.once("error", reject);
			channel.once("close", () => reject(/* @__PURE__ */ new Error("Managed cleanup channel closed before opening")));
		});
		tail.catch(fail);
		channel.connect({ fd: parent.fd });
	}
	process.once("exit", () => {
		if ((owned || pending?.kind === "claim") && operations === 0 && !failedCleanup && !error) try {
			writeSync(parent.fd, `finished ${parent.token}\n`);
		} catch {}
	});
	const request = (kind) => {
		if (error) return Promise.reject(error);
		if (failedCleanup) return Promise.reject(Object.assign(/* @__PURE__ */ new Error("Managed cleanup ownership contains unjoined work"), {
			code: "EPROCESSGROUP_CLEANUP_FAILED",
			processTreeState: "indeterminate"
		}));
		return new Promise((resolve, reject) => {
			pending = {
				kind,
				resolve,
				reject
			};
			channel.write(`${kind} ${parent.token}\n`);
		});
	};
	const serialize = (operation) => {
		const completion = tail.then(operation);
		tail = completion.catch(() => {});
		return completion;
	};
	const ensureOwned = () => owned && !error && !failedCleanup ? Promise.resolve() : request("claim");
	const waitForAcknowledgement = async (completion, signal) => {
		waiters++;
		channel.ref();
		let abort;
		try {
			await new Promise((resolve, reject) => {
				completion.then(resolve, reject);
				if (signal) {
					abort = () => reject(Object.assign(/* @__PURE__ */ new Error("Managed command aborted"), { code: "ABORT_ERR" }));
					signal.addEventListener("abort", abort, { once: true });
					if (signal.aborted) abort();
				}
			});
		} finally {
			if (abort) signal?.removeEventListener("abort", abort);
			if (--waiters === 0) channel.unref();
		}
	};
	return {
		markFailed,
		async claim() {
			permanent = true;
			await waitForAcknowledgement(serialize(ensureOwned));
			return true;
		},
		async acquire(signal) {
			signal?.throwIfAborted();
			operations++;
			let released = false;
			const release = (joined, waitForRelease = false) => {
				if (released) return Promise.resolve();
				released = true;
				operations--;
				if (!joined) {
					markFailed();
					return Promise.resolve();
				}
				const completion = serialize(() => operations === 0 && !permanent && owned && !failedCleanup ? request("release") : Promise.resolve());
				completion.catch(fail);
				return waitForRelease ? waitForAcknowledgement(completion) : completion;
			};
			try {
				await waitForAcknowledgement(serialize(() => operations > 0 || permanent ? ensureOwned() : Promise.resolve()), signal);
			} catch (failure) {
				release(true);
				throw failure;
			}
			return release;
		}
	};
}
/** Call only after installing the implementation's lifetime cancellation owner. */
function claimManagedCleanup() {
	return cleanupClient()?.claim() ?? Promise.resolve(false);
}
function acquireManagedCleanup(signal) {
	return cleanupClient()?.acquire(signal);
}
function failManagedCleanup() {
	client?.markFailed();
}
/** Each descriptor belongs to exactly the ChildProcess passed to attach. */
function prepareManagedCleanupHandoff(stdio, env, platform) {
	delete env[HANDOFF_ENV];
	if (platform === "win32") return {
		stdio,
		attach: (_child) => void 0
	};
	const descriptors = Array.isArray(stdio) ? [...stdio] : [
		stdio,
		stdio,
		stdio
	];
	const fd = Math.max(3, descriptors.length);
	const token = randomUUID();
	while (descriptors.length < fd) descriptors.push(descriptors.length < 3 ? "pipe" : "ignore");
	descriptors.push("pipe");
	env[HANDOFF_ENV] = `${process.pid}:${fd}:${token}`;
	return {
		stdio: descriptors,
		attach(child) {
			if (!child.pid) return;
			const channel = child.stdio[fd];
			if (!(channel instanceof Socket)) return;
			let owned = false;
			let participated = false;
			let finished = false;
			let ended = false;
			let stopping;
			let error;
			let buffer = "";
			const failureListeners = /* @__PURE__ */ new Set();
			const releaseListeners = /* @__PURE__ */ new Set();
			const fail = (failure) => {
				error ??= failure;
				for (const listener of failureListeners) listener(error);
			};
			channel.unref();
			channel.setEncoding("utf8");
			channel.on("error", (failure) => {
				if (owned && !finished || buffer.length > 0) fail(failure);
			});
			const finishChannel = () => {
				if (ended) return;
				ended = true;
				if (buffer.length > 0 || owned && !finished) fail(/* @__PURE__ */ new Error("Managed cleanup owner lost its control channel before relinquishing ownership"));
			};
			channel.on("end", finishChannel);
			channel.on("close", finishChannel);
			child.once("exit", () => {
				if (!participated) channel.destroy();
			});
			channel.on("data", (chunk) => {
				buffer += chunk;
				if (Buffer.byteLength(buffer) > MAX_FRAME_BYTES) {
					fail(/* @__PURE__ */ new Error("Managed cleanup owner sent an oversized handoff"));
					return;
				}
				let newline;
				while ((newline = buffer.indexOf("\n")) !== -1) {
					const frame = buffer.slice(0, newline);
					buffer = buffer.slice(newline + 1);
					if (frame === `claim ${token}` && !owned && !finished && !error) {
						if (stopping) channel.end(`stopping ${stopping} ${token}\n`);
						else {
							owned = true;
							participated = true;
							channel.write(`owned ${token}\n`);
						}
					} else if (frame === `finished ${token}` && !finished && (owned || participated || stopping)) finished = true;
					else if (frame === `release ${token}` && owned && !finished && !error) {
						owned = false;
						channel.write(`released ${token}\n`);
						for (const listener of releaseListeners) listener();
					} else if (frame === `failed ${token}` && owned && !finished) fail(/* @__PURE__ */ new Error("Managed cleanup owner reported unjoined work"));
					else fail(/* @__PURE__ */ new Error("Managed cleanup owner sent an invalid handoff"));
				}
			});
			return {
				stop(signal) {
					stopping ??= signal;
				},
				delegated: () => owned,
				failure: () => error,
				settled: () => !participated || ended,
				waitForOwnerSettlement: (deadlineAt) => new Promise((resolve, reject) => {
					if (error) {
						reject(error);
						return;
					}
					if (!owned || child.exitCode !== null || child.signalCode !== null) {
						resolve(true);
						return;
					}
					const cleanup = () => {
						clearTimeout(timer);
						child.off("exit", onExit);
						child.off("error", onError);
						failureListeners.delete(onError);
						releaseListeners.delete(onExit);
					};
					const onExit = () => {
						cleanup();
						resolve(true);
					};
					const onError = (failure) => {
						cleanup();
						reject(failure);
					};
					const timer = setTimeout(() => {
						cleanup();
						resolve(false);
					}, Math.max(0, deadlineAt - Date.now()));
					child.once("exit", onExit);
					child.once("error", onError);
					failureListeners.add(onError);
					releaseListeners.add(onExit);
				}),
				close: () => channel.destroy()
			};
		}
	};
}
//#endregion
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
const cleanupHandoffs = /* @__PURE__ */ new WeakMap();
/** Resolve platform code before spawning so callers can attach listeners synchronously. */
function loadManagedChildSpawner(platform = process.platform) {
	if (platform !== "win32") return spawn;
	return import("./managed-windows-job-Cu1o_fOC.mjs").then(({ spawnWindowsJobChild }) => {
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
async function waitForManagedProcessGroupExit(child, timeoutMs, { clampPollToDeadline = false, pollIntervalMs = PROCESS_GROUP_POLL_MS, signal, ...groupOptions }) {
	const deadlineAt = Math.min(Date.now() + timeoutMs, groupOptions.deadlineAt ?? Infinity);
	const boundedGroupOptions = {
		...groupOptions,
		deadlineAt
	};
	while (Date.now() < deadlineAt) {
		if (signal?.aborted) return false;
		if (inspectManagedProcessGroup(child, boundedGroupOptions) === "dead") return true;
		const remainingMs = deadlineAt - Date.now();
		if (remainingMs <= 0) break;
		const waitMs = clampPollToDeadline ? Math.min(pollIntervalMs, remainingMs) : pollIntervalMs;
		await new Promise((resolve) => {
			const finish = () => {
				clearTimeout(timer);
				signal?.removeEventListener("abort", finish);
				resolve();
			};
			const timer = setTimeout(finish, waitMs);
			signal?.addEventListener("abort", finish, { once: true });
			if (signal?.aborted) finish();
		});
	}
	return !signal?.aborted && inspectManagedProcessGroup(child, boundedGroupOptions) === "dead";
}
/** Run a child command while forwarding termination signals to its process group. */
async function runManagedCommand({ waitForCleanupRelease = false, ...options }) {
	const command = {
		...options,
		args: options.args?.slice(),
		cwd: path.resolve(options.cwd ?? process.cwd()),
		env: { ...options.env ?? process.env },
		stdio: Array.isArray(options.stdio) ? [...options.stdio] : options.stdio
	};
	if (!hasManagedCleanupParent()) return runOwnedManagedCommand(command);
	command.signal?.throwIfAborted();
	let receivedSignal;
	let childStarted = false;
	let settling = false;
	const admission = new AbortController();
	const rememberSignal = (received) => {
		receivedSignal ??= received;
		if (!childStarted || settling) command.onSignal?.(received);
		if (!childStarted) admission.abort();
	};
	installSignalHandlers();
	managedChildren.add(rememberSignal);
	let releaseCleanup;
	let joined = true;
	let outcome;
	const admissionSignal = command.signal ? AbortSignal.any([command.signal, admission.signal]) : admission.signal;
	try {
		releaseCleanup = await acquireManagedCleanup(admissionSignal);
		command.signal?.throwIfAborted();
		outcome = { status: receivedSignal ? signalExitCode(receivedSignal) : await runOwnedManagedCommand({
			...command,
			signal: admissionSignal,
			onReady(child) {
				childStarted = true;
				command.onReady?.(child);
			}
		}) };
	} catch (error) {
		joined = !hasUnjoinedWork(error);
		outcome = { error };
	}
	settling = true;
	try {
		const released = releaseCleanup?.(joined, waitForCleanupRelease);
		if (waitForCleanupRelease) await released;
	} finally {
		managedChildren.delete(rememberSignal);
		removeSignalHandlersIfIdle();
	}
	if ("error" in outcome) {
		const { error } = outcome;
		if (error instanceof ManagedCleanupCancelled) {
			if (!receivedSignal) command.onSignal?.(error.signal);
			return signalExitCode(receivedSignal ?? error.signal);
		}
		if (receivedSignal && !command.signal?.aborted && hasProcessErrorCode(error, "ABORT_ERR")) return signalExitCode(receivedSignal);
		throw error;
	}
	return receivedSignal ? signalExitCode(receivedSignal) : outcome.status;
}
async function runOwnedManagedCommand(options) {
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
			const { runLinuxMemoryCommand } = await import("./managed-memory-o0HzGkvf.mjs");
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
	const handoff = prepareManagedCleanupHandoff(managedStdio, commandEnv, platform);
	const spawnSpec = createManagedCommandSpawnSpec({
		...commandOptions,
		args: commandOptions.args?.slice(),
		cwd: commandOptions.cwd ?? process.cwd(),
		env: commandEnv,
		stdio: handoff.stdio,
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
	const cleanupHandoff = handoff.attach(child);
	if (cleanupHandoff) cleanupHandoffs.set(child, cleanupHandoff);
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
	const stopController = new AbortController();
	let stopRequest;
	const stopControl = {
		signal: stopController.signal,
		getRequest: () => stopRequest
	};
	let cancellation;
	let notifyOutcome;
	const completion = new Promise((resolve) => {
		notifyOutcome = resolve;
	});
	const finalize = (stopSignal, forceKillDelayMs, forceKillOnLeaderExit = false) => {
		if (stopSignal && !stopRequest) {
			stopRequest = {
				signal: stopSignal,
				forceKillDelayMs,
				forceKillOnLeaderExit
			};
			stopController.abort();
		}
		return finalization ??= finalizeManagedChild(child, stopSignal, {
			platform,
			runTaskkill,
			forceKillDelayMs,
			forceKillOnLeaderExit,
			drainTimeoutMs: cleanupDrainTimeoutMs,
			areOutputPipesClosed: () => pendingOutputCloses.size === 0,
			onTerminated: releaseOwnership,
			stopControl
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
		if (outcome.type === "completed" && (ownsProcessTree || cleanupHandoff?.delegated() || cleanupHandoff?.failure())) finalize(typeof outcome.exit === "string" ? outcome.exit : void 0);
		outcome = (finalization ? await finalization : void 0) ?? cancellation ?? outcome;
		if (outcome.type === "completed" && !ownsProcessTree && !cancellation && !finalization) releaseOwnership();
		if (outcome.type === "failed") throw outcome.error;
		if (outcome.type === "timeout") throw Object.assign(/* @__PURE__ */ new Error(`Managed command timed out after ${timeoutMs}ms`), { code: "ETIMEDOUT" });
		if (outcome.type === "aborted") throw Object.assign(/* @__PURE__ */ new Error("Managed command aborted"), { code: "ABORT_ERR" });
		if (outcome.type === "signal") return signalExitCode(outcome.signal);
		return typeof outcome.exit === "string" ? signalExitCode(outcome.exit) : outcome.exit;
	} finally {
		cleanupHandoff?.close();
		cleanupHandoffs.delete(child);
		for (const removeListener of removeOutputCloseListeners) removeListener();
		clearTimeout(timeoutTimer);
		signal?.removeEventListener("abort", abort);
		managedChildren.delete(forwardSignal);
		removeSignalHandlersIfIdle();
		if (!child.pid) releaseOwnership();
	}
}
async function finalizeManagedChild(child, initialSignal, { platform, runTaskkill, forceKillDelayMs = FORCE_KILL_DELAY_MS, forceKillOnLeaderExit: initialForceKillOnLeaderExit = false, drainTimeoutMs = PROCESS_GROUP_DRAIN_TIMEOUT_MS, retainOutputOnFailure = false, areOutputPipesClosed, onTerminated = () => {}, stopControl }) {
	let signal = initialSignal;
	let forceKillOnLeaderExit = initialForceKillOnLeaderExit;
	const startedAt = Date.now();
	const forceDelay = signal ? forceKillDelayMs : 0;
	const naturalForceAt = startedAt + Math.floor(drainTimeoutMs / 2);
	let forceAt = startedAt + forceDelay;
	let deadline = forceAt + drainTimeoutMs;
	let forced = !signal || platform === "win32";
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
	let termination;
	let stopForwarded = false;
	let naturalCleanupRequired = false;
	const cleanupHandoff = cleanupHandoffs.get(child);
	let waitedForCleanupOwner = false;
	let delegatedOwnerFailure;
	const interruptNaturalDrain = () => {
		const request = stopControl?.getRequest();
		if (!request || signal || naturalCleanupRequired) return;
		signal = request.signal;
		cleanupHandoff?.stop(signal);
		forceKillOnLeaderExit = request.forceKillOnLeaderExit;
		forceAt = Math.min(Date.now() + (request.forceKillDelayMs ?? FORCE_KILL_DELAY_MS), naturalForceAt);
		forced = false;
		stopForwarded = true;
		termination = terminateManagedChild(child, signal, {
			...terminationOptions,
			deadlineAt: Date.now()
		});
	};
	const interruptSignal = !signal && platform !== "win32" ? stopControl?.signal : void 0;
	interruptSignal?.addEventListener("abort", interruptNaturalDrain, { once: true });
	try {
		if (signal) cleanupHandoff?.stop(signal);
		if (interruptSignal?.aborted) interruptNaturalDrain();
		if (normalJobExit && !outputClosed()) await new Promise((resolve) => {
			const finish = () => {
				clearTimeout(timer);
				child.off("close", finish);
				resolve();
			};
			const timer = setTimeout(finish, Math.max(0, startedAt + drainTimeoutMs / 2 - Date.now()));
			child.once("close", finish);
		});
		const exitedNaturally = !signal && (platform === "win32" ? inspectManagedProcessGroup(child, {
			deadlineAt: startedAt + drainTimeoutMs,
			errorPolicy: "indeterminate",
			platform
		}) === "dead" : await waitForManagedProcessGroupExit(child, Math.floor(drainTimeoutMs / 2), {
			deadlineAt: naturalForceAt,
			clampPollToDeadline: true,
			errorPolicy: "indeterminate",
			platform,
			signal: interruptSignal
		}));
		if (!stopForwarded) {
			naturalCleanupRequired = !signal && !exitedNaturally;
			termination = exitedNaturally ? { processTreeState: "terminated" } : terminateManagedChild(child, signal ?? "SIGKILL", terminationOptions);
		}
		if (platform === "win32" && termination?.processTreeState !== "terminated" && !job) throw createManagedCommandCleanupError("Windows taskkill could not verify managed process tree exit", child, platform, "indeterminate", termination?.error);
		if (platform === "win32" && !normalJobExit) {
			forceAt = Date.now() + forceDelay;
			deadline = forceAt + drainTimeoutMs;
		}
		let groupState = "indeterminate";
		let survivingPids;
		let observationError;
		let warned = false;
		while (true) {
			if (signal && cleanupHandoff?.delegated() && !waitedForCleanupOwner) {
				waitedForCleanupOwner = true;
				let ownerSettled = false;
				try {
					ownerSettled = await cleanupHandoff.waitForOwnerSettlement(deadline);
				} catch (error) {
					delegatedOwnerFailure = error;
				}
				const ownerExited = child.exitCode !== null || child.signalCode !== null;
				if (!ownerSettled && !ownerExited) {
					if (!retainOutputOnFailure) {
						for (const pipe of child.stdio) pipe?.destroy();
						if (child.connected) child.disconnect();
					} else {
						for (const pipe of child.stdio) if (pipe instanceof Socket) pipe.unref();
						child.channel?.unref();
					}
					cleanupHandoff.close();
					child.unref();
					throw createManagedCommandCleanupError(delegatedOwnerFailure ? "Managed cleanup owner lost control while retaining live custody" : "Managed cleanup owner did not relinquish live custody before the cancellation deadline", child, platform, "indeterminate", delegatedOwnerFailure);
				}
			}
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
			if (groupState === "dead" && exited && outputClosed() && cleanupHandoff?.settled() !== false) {
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
		const ownershipFailure = cleanupHandoff?.failure() ?? delegatedOwnerFailure;
		if (ownershipFailure) {
			joined = false;
			throw createManagedCommandCleanupError("Managed cleanup ownership handoff failed", child, platform, "indeterminate", ownershipFailure);
		}
	} catch (error) {
		failures.push(error);
	} finally {
		interruptSignal?.removeEventListener("abort", interruptNaturalDrain);
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
export { ManagedCleanupCancelled as a, runManagedCommand as i, hasUnjoinedWork as n, claimManagedCleanup as o, loadManagedChildSpawner as r, failManagedCleanup as s, finalizeManagedChild as t };

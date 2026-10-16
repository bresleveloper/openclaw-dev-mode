import { i as extractErrorCode, s as toErrorObject } from "./error-coercion-DKQY4wyF.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-Cnn-Mjdg.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-QXcu2VO1.mjs";
import { deserialize, serialize } from "node:v8";
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, opendirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Socket } from "node:net";
import { EventEmitter } from "node:events";
//#region src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
//#endregion
//#region src/process/spawn-broker/protocol.ts
var SpawnBrokerError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
		this.name = "SpawnBrokerError";
	}
};
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
//#endregion
//#region src/process/spawn-broker/pipe.ts
const readers = /* @__PURE__ */ new WeakMap();
const holdReadable = () => {};
/** Defer consumption and EOF until the transferred socket is ready for its caller. */
function holdPipe(socket) {
	const held = {
		read: socket.read.bind(socket),
		resumed: false,
		onResume: () => {
			held.resumed = true;
		}
	};
	readers.set(socket, held);
	socket.on("resume", held.onResume);
	socket.on("readable", holdReadable);
	socket.read = () => null;
}
/** Restore native stdin's write-only direction after Node's duplex IPC handoff. */
function restoreStdinPipe(socket) {
	const state = Reflect.get(socket, "_readableState");
	if (!state || typeof state !== "object" || [
		"ended",
		"endEmitted",
		"reading"
	].some((flag) => typeof Reflect.get(state, flag) !== "boolean")) throw new SpawnBrokerError("Spawn broker requires a Node readable state for stdin");
	stopPipeReads(socket);
	Object.assign(state, {
		readable: false,
		ended: true,
		endEmitted: true,
		reading: false
	});
}
function stopPipeReads(socket) {
	const handle = Reflect.get(socket, "_handle");
	if (!handle || typeof handle !== "object" || !("readStop" in handle) || typeof handle.readStop !== "function" || !("reading" in handle) || typeof handle.reading !== "boolean") throw new SpawnBrokerError("Spawn broker requires a transferable Node pipe handle");
	if (handle.readStop() !== 0) throw new SpawnBrokerError("Spawn broker could not stop pipe reads");
	handle.reading = false;
}
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
//#endregion
//#region src/process/spawn-broker/child.ts
/** Native pipes remain native streams; only lifecycle and IPC cross the broker. */
var BrokerChild = class extends EventEmitter {
	constructor(requestId, argv, transmit) {
		super();
		this.requestId = requestId;
		this.transmit = transmit;
		this.callbackContext = new AsyncResource("OpenClawSpawnBrokerChild");
		this.stdin = null;
		this.stdout = null;
		this.stderr = null;
		this.connected = false;
		this.killed = false;
		this.exitCode = null;
		this.signalCode = null;
		this.stdio = [
			null,
			null,
			null,
			null,
			null
		];
		this.opened = createDeferredCore();
		this.completion = createDeferredCore();
		this.pipes = /* @__PURE__ */ new Set();
		this.sends = /* @__PURE__ */ new Map();
		this.sendSequence = 0;
		this.spawnReceived = false;
		this.eventsReleased = false;
		this.pendingEventOverflow = false;
		this.pendingEvents = [];
		this.exited = false;
		this.closed = false;
		this.processNotStarted = false;
		this.spawnfile = argv[0];
		this.spawnargs = [...argv];
		this.opened.promise.catch(() => {});
		this.on("error", () => {});
	}
	/** Only the admission owner can establish that no native process was started. */
	markNotStarted() {
		this.processNotStarted = true;
	}
	get notStarted() {
		return this.processNotStarted;
	}
	ready() {
		return this.opened.promise;
	}
	emit(event, ...args) {
		return this.callbackContext.runInAsyncScope(() => super.emit(event, ...args));
	}
	/** Transport bookkeeping survives disposal of the caller's event listeners. */
	waitForClose() {
		return this.completion.promise;
	}
	attachPipe(fd, socket) {
		socket.emit = this.callbackContext.bind(socket.emit.bind(socket));
		this.stdio[fd] = socket;
		if (fd === 0) this.stdin = socket;
		if (fd === 1) this.stdout = socket;
		if (fd === 2) this.stderr = socket;
		this.pipes.add(socket);
		let acknowledged = false;
		const acknowledge = (error) => {
			if (acknowledged) return;
			acknowledged = true;
			this.transmit({
				type: "output-drained",
				id: this.requestId,
				fd,
				error: error ? serializeBrokerError(error) : void 0
			}).catch(() => {});
		};
		socket.once(fd === 0 ? "finish" : "end", () => acknowledge());
		socket.on("error", acknowledge);
		socket.once("close", () => {
			acknowledge();
			this.pipes.delete(socket);
			this.finishClose();
		});
	}
	receive(message) {
		if (message.type === "spawned") {
			if (this.spawnReceived || this.closed) return;
			this.spawnReceived = true;
			this.pid = message.pid;
			this.spawnfile = message.spawnfile;
			this.spawnargs = message.spawnargs;
			this.connected = message.connected;
			this.stdio.splice(message.stdioLength);
			while (this.stdio.length < message.stdioLength) this.stdio.push(null);
			if (this.connected) this.channel = Object.assign(new EventEmitter(), {
				ref() {},
				unref() {}
			});
			this.opened.resolve();
			setImmediate(() => {
				if (this.closed) return;
				this.emit("spawn");
				setImmediate(() => {
					for (const [fd, pipe] of this.stdio.entries()) if (fd > 0 && pipe instanceof Socket && !pipe.destroyed) releasePipe(pipe);
					this.eventsReleased = true;
					for (const event of this.pendingEvents.splice(0)) event();
				});
			});
			return;
		}
		if (!this.eventsReleased && (this.spawnReceived || message.type !== "error")) {
			this.deferEvent(() => this.emitMessage(message));
			return;
		}
		this.emitMessage(message);
	}
	deferEvent(event) {
		if (this.pendingEventOverflow) return;
		if (this.pendingEvents.length >= 64) {
			this.pendingEventOverflow = true;
			this.pendingEvents.splice(0);
			this.pendingEvents.push(() => {
				this.kill("SIGKILL");
				this.failNow(new SpawnBrokerError("Spawn broker startup event capacity exceeded"));
			});
			return;
		}
		this.pendingEvents.push(event);
	}
	emitMessage(message) {
		switch (message.type) {
			case "error": {
				const error = Object.assign(new Error(message.error.message), message.error);
				this.opened.reject(error);
				this.emit("error", error);
				if (!this.pid) {
					this.exited = true;
					this.finishClose();
				}
				break;
			}
			case "exit":
				this.exited = true;
				this.exitCode = message.code;
				this.signalCode = message.signal;
				this.stdin?.destroy();
				this.emit("exit", message.code, message.signal);
				process.nextTick(() => {
					for (const pipe of this.pipes) if (pipe.readable) pipe.resume();
				});
				this.finishClose();
				break;
			case "ipc-sent":
				this.finishSend(message.sequence, message.error ? Object.assign(new Error(message.error.message), message.error) : null);
				break;
			case "disconnect":
				this.failSends(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
				this.connected = false;
				this.channel = void 0;
				this.emit("disconnect");
				break;
			case "ipc":
				this.emit("message", message.message);
				break;
			case "closed": this.finishClose();
		}
	}
	fail(error) {
		if (this.spawnReceived && !this.eventsReleased) {
			this.deferEvent(() => this.failNow(error));
			return;
		}
		this.failNow(error);
	}
	failNow(error) {
		if (this.closed) return;
		this.opened.reject(error);
		this.failSends(error);
		const wasConnected = this.connected;
		this.connected = false;
		this.channel = void 0;
		if (wasConnected) this.emit("disconnect");
		if (!this.exited) this.emit("error", error);
		for (const pipe of this.pipes) pipe.destroy(error);
		this.exited = true;
		this.finishClose();
	}
	finishClose() {
		if (!this.exited || this.pipes.size > 0 || this.closed) return;
		this.closed = true;
		this.completion.resolve();
		this.emit("close", this.exitCode, this.signalCode);
	}
	kill(signal = "SIGTERM") {
		if (this.exited) return false;
		this.killed = true;
		this.transmit({
			type: "kill",
			id: this.requestId,
			signal
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker signal delivery failed")));
		return true;
	}
	send(message, handleOrCallback, optionsOrCallback, callback) {
		const done = typeof handleOrCallback === "function" ? handleOrCallback : typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
		if (!this.connected || this.sends.size >= 1024) {
			const error = /* @__PURE__ */ new Error(this.connected ? "Child process IPC capacity exceeded" : "Child process IPC channel is closed");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		const sequence = ++this.sendSequence;
		this.sends.set(sequence, AsyncResource.bind((error) => {
			if (done) done(error);
			else if (error) this.emit("error", error);
		}));
		const handle = typeof handleOrCallback === "function" ? void 0 : handleOrCallback;
		this.transmit({
			type: "ipc",
			id: this.requestId,
			sequence,
			message
		}, handle).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
		return true;
	}
	finishSend(sequence, error) {
		const callback = this.sends.get(sequence);
		this.sends.delete(sequence);
		callback?.(error);
	}
	failSends(error) {
		for (const sequence of this.sends.keys()) this.finishSend(sequence, error);
	}
	disconnect() {
		if (!this.connected) return;
		this.connected = false;
		this.transmit({
			type: "disconnect",
			id: this.requestId
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker disconnect failed")));
	}
	ref() {}
	unref() {}
	[Symbol.dispose]() {
		this.kill("SIGTERM");
	}
};
//#endregion
//#region packages/agent-core/src/harness/env/kill-tree.ts
const DEFAULT_GRACE_MS = 3e3;
const MAX_GRACE_MS = 6e4;
const TASKKILL_COMPLETION_TIMEOUT_MS = 3e3;
const UNIX_PROCESS_TREE_TIMEOUT_MS = 500;
const MAX_UNIX_PROCESS_TREE_PIDS = 4096;
const MAX_UNIX_PROCESS_TREE_DEPTH = 128;
/**
* Best-effort process-tree termination with graceful shutdown.
* - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
*   first (without /F), then force-kills if taskkill refuses or the process
*   survives the grace period.
* - Unix: send SIGTERM to the process group when ownership is known, wait the
*   grace period, then SIGKILL. Linux attached children are enumerated and
*   signaled descendants-first because their process group belongs to the gateway.
*
* Group kill (`process.kill(-pid, ...)`) is only used when the PID is verified
* as its own process group leader, unless `detached: true` is explicitly passed.
* This prevents accidentally signaling the gateway's process group when the
* child shares its parent's group.
*
* - `detached: false`: skip group kill unconditionally.
* - `detached: true`: use group kill unconditionally (trust caller).
* - `detached` omitted: use group kill only when PID is the group leader.
*/
function killProcessTree(pid, opts) {
	if (!Number.isFinite(pid) || pid <= 0) return;
	if (process.platform === "win32") {
		if (opts?.force === true) {
			signalProcessTreeWindowsAndWait(pid, "SIGKILL");
			return;
		}
		killProcessTreeWindows(pid, normalizeGraceMs(opts?.graceMs));
		return;
	}
	const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
	const attachedLinuxTree = opts?.detached === false && !useGroupKill && process.platform === "linux";
	const processTree = attachedLinuxTree ? collectUnixProcessTree(pid) : void 0;
	if (attachedLinuxTree && !processTree) {
		signalProcessTreeUnix(pid, opts?.force === true ? "SIGKILL" : "SIGTERM", false);
		return;
	}
	let forceRequested = false;
	const force = () => {
		if (forceRequested) return;
		forceRequested = true;
		const liveProcessTree = processTree?.filter(verifiedProcessInstanceAlive) ?? [];
		if (!(useGroupKill ? isProcessAlive(-pid) : attachedLinuxTree ? liveProcessTree.length > 0 : isProcessAlive(pid))) return;
		signalProcessTreeUnix(pid, "SIGKILL", useGroupKill, processTree ? liveProcessTree : void 0);
	};
	if (opts?.force === true) {
		if (processTree) force();
		else signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
		return;
	}
	signalProcessTreeUnix(pid, "SIGTERM", useGroupKill, processTree);
	const graceMs = normalizeGraceMs(opts?.graceMs);
	const forceTimer = setTimeout(force, graceMs);
	if (!attachedLinuxTree) forceTimer.unref();
	return { force: () => {
		clearTimeout(forceTimer);
		force();
	} };
}
function normalizeGraceMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GRACE_MS;
	return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);
	} catch (error) {
		if ((typeof error === "object" && error !== null && "code" in error ? error.code : void 0) !== "EPERM") return false;
	}
	if (pid < 0 || process.platform !== "linux") return true;
	try {
		const status = readFileSync(`/proc/${pid}/status`, "utf8");
		return !(status.match(/^State:\s+(\S)/m)?.[1] === "Z" && /^Threads:[ \t]+1[ \t]*$/m.test(status));
	} catch {
		return true;
	}
}
function parseProcessGroupId(value) {
	if (typeof value !== "string" || !/^\d+$/.test(value.trim())) return;
	const pgid = Number(value.trim());
	return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readPsOutput(args) {
	try {
		const result = spawnSync("ps", args, {
			encoding: "utf8",
			timeout: 500
		});
		return result.error || result.status !== 0 ? void 0 : result.stdout;
	} catch {
		return;
	}
}
function readProcStatFields(pid) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		return stat.slice(commEnd + 1).trim().split(/\s+/);
	} catch {
		return;
	}
}
/** Fail closed to direct-PID signaling when group ownership cannot be proved. */
function isProcessGroupLeader(pid) {
	return ((process.platform === "linux" ? parseProcessGroupId(readProcStatFields(pid)?.[2]) : void 0) ?? parseProcessGroupId(readPsOutput([
		"-p",
		String(pid),
		"-o",
		"pgid="
	]))) === pid;
}
function parsePositivePids(value) {
	if (typeof value !== "string") return [];
	return value.trim().split(/\s+/u).map((entry) => Number(entry)).filter((entry) => Number.isSafeInteger(entry) && entry > 0);
}
function readUnixProcessIdentity(pid, deadlineMs) {
	return readUnixProcessInstance(pid, deadlineMs)?.identity;
}
/** Capture identity and parent together so a recycled child PID cannot authorize a foreign tree. */
function readUnixProcessInstance(pid, deadlineMs) {
	if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return;
	if (process.platform !== "linux") return;
	const fields = readProcStatFields(pid);
	const ppid = Number(fields?.[1]);
	const starttime = fields?.[19];
	if (!starttime || !/^\d+$/u.test(starttime) || !Number.isSafeInteger(ppid)) return;
	return {
		identity: `${pid}:${starttime}`,
		ppid
	};
}
/** Missing identities are never eligible for an attached-tree signal. */
function verifiedProcessInstanceAlive(entry) {
	if (!entry.identity || !isProcessAlive(entry.pid)) return false;
	return readUnixProcessIdentity(entry.pid) === entry.identity;
}
function* readUnixProcessChildren(pid, canReadTask) {
	let tasks;
	try {
		tasks = opendirSync(`/proc/${pid}/task`);
		while (canReadTask()) {
			const task = tasks.readSync();
			if (!task) return;
			const tid = parseProcessGroupId(task.name);
			if (!tid) continue;
			try {
				yield* parsePositivePids(readFileSync(`/proc/${pid}/task/${tid}/children`, "utf8"));
			} catch {}
		}
	} catch {} finally {
		try {
			tasks?.closeSync();
		} catch {}
	}
}
/** Capture verified descendants before their parents; an unverified subtree is omitted. */
function collectUnixProcessTree(rootPid) {
	if (process.platform !== "linux") return;
	const descendants = [];
	const seen = /* @__PURE__ */ new Set([rootPid]);
	let taskReads = 0;
	const deadline = Date.now() + UNIX_PROCESS_TREE_TIMEOUT_MS;
	const rootIdentity = readUnixProcessIdentity(rootPid, deadline);
	if (!rootIdentity || Date.now() >= deadline) return;
	const withinBounds = (depth) => Date.now() < deadline && depth <= MAX_UNIX_PROCESS_TREE_DEPTH;
	const hasCapacity = () => seen.size < MAX_UNIX_PROCESS_TREE_PIDS;
	const visit = (parentPid, parentIdentity, depth) => {
		if (!withinBounds(depth) || !hasCapacity()) return;
		if (readUnixProcessIdentity(parentPid, deadline) !== parentIdentity) return;
		const children = readUnixProcessChildren(parentPid, () => withinBounds(depth) && hasCapacity() && taskReads++ < MAX_UNIX_PROCESS_TREE_PIDS && readUnixProcessIdentity(parentPid, deadline) === parentIdentity);
		for (const childPid of children) {
			if (!withinBounds(depth + 1) || !hasCapacity()) return;
			if (seen.has(childPid) || childPid === process.pid) continue;
			seen.add(childPid);
			const instance = readUnixProcessInstance(childPid, deadline);
			if (!instance || instance.ppid !== parentPid || !withinBounds(depth + 1)) continue;
			visit(childPid, instance.identity, depth + 1);
			descendants.push({
				pid: childPid,
				identity: instance.identity
			});
		}
	};
	visit(rootPid, rootIdentity, 0);
	return [...descendants, {
		pid: rootPid,
		identity: rootIdentity
	}];
}
function signalProcessTreeUnix(pid, signal, useGroupKill, processTree) {
	if (useGroupKill) {
		signalUnixTarget(-pid, signal);
		return;
	}
	const targets = processTree ?? [{ pid }];
	for (const entry of targets) {
		if (processTree && !verifiedProcessInstanceAlive(entry)) continue;
		signalUnixTarget(entry.pid, signal);
	}
}
function signalUnixTarget(pid, signal) {
	try {
		process.kill(pid, signal);
	} catch {}
}
function runTaskkill(args, onExit) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (code) => {
			if (settled) return;
			settled = true;
			clearTimeout(completionTimer);
			onExit?.(code);
			resolve();
		};
		const completionTimer = setTimeout(() => finish(null), TASKKILL_COMPLETION_TIMEOUT_MS);
		completionTimer.unref?.();
		try {
			const child = spawn("taskkill", args, {
				stdio: "ignore",
				detached: true,
				windowsHide: true
			});
			child.once("error", () => finish(null));
			child.once("close", (code) => finish(code));
		} catch {
			finish(null);
		}
	});
}
function killProcessTreeWindows(pid, graceMs) {
	let forced = false;
	let graceTimer;
	const forceKill = () => {
		if (forced) return;
		forced = true;
		if (graceTimer !== void 0) {
			clearTimeout(graceTimer);
			graceTimer = void 0;
		}
		if (!isProcessAlive(pid)) return;
		signalProcessTreeWindowsAndWait(pid, "SIGKILL");
	};
	signalProcessTreeWindowsAndWait(pid, "SIGTERM", (code) => {
		if (code !== null && code !== 0) forceKill();
	});
	graceTimer = setTimeout(forceKill, graceMs);
	graceTimer.unref();
}
function signalProcessTreeWindowsAndWait(pid, signal, onExit) {
	return runTaskkill(signal === "SIGKILL" ? [
		"/F",
		"/T",
		"/PID",
		String(pid)
	] : [
		"/T",
		"/PID",
		String(pid)
	], onExit);
}
//#endregion
//#region src/process/spawn-broker/cleanup.ts
function groupGone(pid) {
	try {
		process.kill(-pid, 0);
		return false;
	} catch (error) {
		return extractErrorCode(error) === "ESRCH";
	}
}
/** Preserve a lost broker's tree cleanup across host restart and process exit. */
function terminateLostBrokerChild(pid, detached, ownerExited) {
	const termination = killProcessTree(pid, {
		detached,
		graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
	});
	const graceEndsAt = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS;
	return {
		force: () => termination?.force(),
		settled: (async () => {
			let deadline = graceEndsAt + 2e3;
			if (ownerExited) {
				await ownerExited;
				deadline = Math.max(deadline, Date.now() + 2e3);
			}
			if (!detached && Date.now() < graceEndsAt) await setTimeout$1(graceEndsAt - Date.now());
			for (;;) {
				if (isPidDefinitelyDead(pid) && (!detached || groupGone(pid))) break;
				if (Date.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${pid}`);
				await setTimeout$1(50);
			}
		})()
	};
}
/** A broker's private group retains non-detached children before PID publication. */
function terminateBrokerProcessGroup(pgid) {
	let retired = false;
	let signalError;
	let forceTimer;
	const signal = (value) => {
		try {
			process.kill(-pgid, value);
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") signalError = error;
		}
	};
	const retire = () => {
		retired = true;
		clearTimeout(forceTimer);
	};
	const force = () => {
		if (retired) return;
		if (groupGone(pgid)) {
			retire();
			return;
		}
		clearTimeout(forceTimer);
		signal("SIGKILL");
	};
	return {
		force,
		settled: (async () => {
			if (groupGone(pgid)) {
				retire();
				return;
			}
			signal("SIGTERM");
			forceTimer = setTimeout(force, GRACEFUL_CANCEL_TIMEOUT_MS);
			const deadline = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
			try {
				while (!groupGone(pgid)) {
					if (Date.now() >= deadline) throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${pgid}`, { cause: signalError });
					await setTimeout$1(50);
				}
			} finally {
				retire();
			}
		})()
	};
}
//#endregion
//#region src/process/spawn-broker/ipc.ts
const FRAME_BYTES = 1048576;
const FRAME_KIND = "openclaw-spawn-broker-frame";
/** Frame large inputs/results while bounding both native writes and retained payloads. */
function createBrokerSender(send) {
	let bytes = 0;
	let messages = 0;
	let sequence = 0;
	let previous = Promise.resolve();
	const write = (message, handle) => new Promise((resolve, reject) => {
		try {
			send(message, handle, (error) => error ? reject(error) : resolve());
		} catch (error) {
			reject(toErrorObject(error, "Spawn broker IPC write failed"));
		}
	});
	const enqueue = (size, operation) => {
		if (bytes + size > 268435456 || messages >= 1024) return Promise.reject(new SpawnBrokerError("Spawn broker IPC capacity exceeded"));
		bytes += size;
		messages += 1;
		const completion = previous.then(operation);
		previous = completion.then(() => {}, () => {});
		return completion.finally(() => {
			bytes -= size;
			messages -= 1;
		});
	};
	const sender = (message, handle) => {
		const payload = serialize(message);
		const size = payload.byteLength;
		if (size > FRAME_BYTES && handle) return Promise.reject(new SpawnBrokerError("Spawn broker handle metadata exceeds one IPC frame"));
		const id = ++sequence;
		const operation = async () => {
			if (size <= FRAME_BYTES) {
				await write(message, handle);
				return;
			}
			for (let offset = 0; offset < size; offset += FRAME_BYTES) {
				const frame = {
					kind: FRAME_KIND,
					id,
					total: size,
					offset,
					bytes: payload.subarray(offset, offset + FRAME_BYTES)
				};
				await write(frame);
			}
		};
		return enqueue(size, operation);
	};
	return Object.assign(sender, { reserve(run) {
		return enqueue(FRAME_BYTES, async () => {
			let active = true;
			let publication;
			const publish = (message) => {
				if (!active || publication) return Promise.reject(new SpawnBrokerError("Spawn broker publication reservation is closed"));
				publication = (async () => {
					if (serialize(message).byteLength > FRAME_BYTES) throw new SpawnBrokerError("Spawn broker reserved publication exceeds one IPC frame");
					await write(message);
				})();
				publication.catch(() => {});
				return publication;
			};
			try {
				return await run(publish);
			} finally {
				active = false;
				await publication;
			}
		});
	} });
}
/** Only the version-matched private peer can supply frames on this channel. */
function createBrokerReceiver() {
	const pending = /* @__PURE__ */ new Map();
	let reserved = 0;
	return {
		receive(message) {
			if (!message || typeof message !== "object" || !("kind" in message) || message.kind !== FRAME_KIND) return message;
			const frame = message;
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > 268435456 || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending.get(frame.id);
			if (!assembly) {
				if (frame.offset !== 0 || pending.size >= 1024 || reserved + frame.total > 268435456) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
				assembly = {
					total: frame.total,
					received: 0,
					chunks: []
				};
				pending.set(frame.id, assembly);
				reserved += frame.total;
			}
			if (assembly.total !== frame.total || assembly.received !== frame.offset || assembly.received + frame.bytes.length > assembly.total) throw new SpawnBrokerError("Out-of-order spawn broker IPC frame");
			assembly.chunks.push(frame.bytes);
			assembly.received += frame.bytes.length;
			if (assembly.received < assembly.total) return;
			pending.delete(frame.id);
			reserved -= assembly.total;
			return deserialize(Buffer.concat(assembly.chunks, assembly.total));
		},
		clear() {
			pending.clear();
			reserved = 0;
		}
	};
}
//#endregion
//#region src/infra/worker-native-error.ts
const errorConstructors = new Map([
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
	Error
].map((constructor) => [constructor.name, constructor]));
function decodeNativeWorkerFailure(value) {
	const seen = /* @__PURE__ */ new Map();
	const decode = (current) => {
		if (current.kind === "value") return current.value;
		const prior = seen.get(current);
		if (prior) return prior;
		const Constructor = errorConstructors.get(current.constructorName) ?? Error;
		const error = current.constructorName === "AggregateError" ? new AggregateError([], current.message) : new Constructor(current.message);
		seen.set(current, error);
		error.name = current.name;
		error.stack = current.stack;
		for (const key of [
			"code",
			"errcode",
			"errno"
		]) if (current[key] !== void 0) Object.defineProperty(error, key, {
			value: current[key],
			writable: true,
			configurable: true,
			enumerable: true
		});
		if (current.cause) Object.defineProperty(error, "cause", {
			value: decode(current.cause),
			writable: true,
			configurable: true
		});
		if (current.errors) Object.defineProperty(error, "errors", {
			value: current.errors.map(decode),
			writable: true,
			configurable: true
		});
		return error;
	};
	return decode(value);
}
//#endregion
//#region src/process/spawn-broker/resource-protocol.ts
const SPAWN_BROKER_STARTUP_TIMEOUT_MS = 15e3;
/** The domain decoder, not a transport adapter, restores this original cleanup payload. */
var BrokerNativeResourceCloseError = class extends Error {
	constructor(payload) {
		super("Native resource cleanup failed");
		this.payload = payload;
		this.name = "BrokerNativeResourceCloseError";
	}
};
//#endregion
//#region src/process/spawn-broker/resource-host.ts
/** Captured claims are part of SpawnBrokerHost; transport loss never retires their custody. */
var BrokerResourceClaims = class {
	constructor(host) {
		this.host = host;
		this.claims = /* @__PURE__ */ new Map();
		this.bufferedBytes = 0;
		this.bufferedMessages = 0;
		this.closeSequence = 0;
		this.sealed = false;
	}
	get size() {
		return this.claims.size;
	}
	get hasOpenClaims() {
		return [...this.claims.values()].some((claim) => !claim.closed);
	}
	capture(attachment, callbacks) {
		if (this.failure || this.sealed) throw this.failure ?? new SpawnBrokerError("Native resource source is sealed");
		const serializedAttachment = serialize(attachment);
		if (serializedAttachment.length > 268435456) throw new SpawnBrokerError("Native resource input exceeds IPC capacity");
		const captured = deserialize(serializedAttachment);
		const claim = {
			attachment: captured,
			callbacks,
			inContext: AsyncLocalStorage.snapshot(),
			attached: createDeferredCore(),
			ready: false,
			created: false,
			closed: false,
			lastSequence: 0,
			ownerSequence: 0,
			ownerMessages: /* @__PURE__ */ new Map(),
			buffered: /* @__PURE__ */ new Map()
		};
		claim.attached.promise.catch(() => {});
		this.claims.set(captured.id, claim);
		this.host.refreshReference();
		const active = () => {
			if (this.claims.get(captured.id) !== claim) throw new SpawnBrokerError("Native resource claim is released");
			if (claim.failure) throw claim.failure;
		};
		return {
			attachment: captured,
			receive: (response) => {
				if (response.id !== captured.id) throw new SpawnBrokerError("Native resource response belongs to another claim");
				this.receive(response);
			},
			ownerMessage: (value) => {
				active();
				if (claim.closed) throw new SpawnBrokerError("Native resource is closed");
				const sequence = claim.ownerSequence + 1;
				if (!Number.isSafeInteger(sequence)) throw new SpawnBrokerError("Native resource owner sequence exhausted");
				const serialized = serialize({
					type: "resource-owner",
					id: captured.id,
					sequence,
					value
				});
				if (this.bufferedBytes + serialized.length > 268435456 || this.bufferedMessages >= 1024) throw new SpawnBrokerError("Native resource owner delivery capacity exceeded");
				claim.ownerSequence = sequence;
				const completion = createDeferredCore();
				completion.promise.catch(() => {});
				const request = deserialize(serialized);
				claim.ownerMessages.set(sequence, {
					request,
					size: serialized.length,
					completion
				});
				this.bufferedBytes += serialized.length;
				this.bufferedMessages++;
				(async () => {
					await claim.attached.promise;
					active();
					const pending = claim.ownerMessages.get(sequence);
					if (!claim.closed && pending) await this.host.transmit(pending.request);
				})().catch((cause) => {
					const error = toErrorObject(cause, "Native resource owner delivery failed");
					completion.reject(error);
					if (this.claims.get(captured.id) === claim && !claim.closed && !claim.failure) claim.inContext(() => claim.callbacks.failed(error));
				});
				return {
					sequence,
					result: completion.promise
				};
			},
			close: () => {
				if (claim.closed) return Promise.resolve();
				try {
					active();
				} catch (error) {
					return Promise.reject(toErrorObject(error, "Native resource is unavailable"));
				}
				if (claim.pending) return claim.pending.completion.promise;
				const requestId = --this.closeSequence;
				if (!Number.isSafeInteger(requestId)) return Promise.reject(new SpawnBrokerError("Native resource close sequence exhausted"));
				const completion = createDeferredCore();
				completion.promise.catch(() => {});
				claim.pending = {
					requestId,
					completion
				};
				(async () => {
					await claim.attached.promise;
					active();
					if (!claim.closed && claim.pending?.requestId === requestId) await this.host.transmit({
						type: "resource-close",
						id: captured.id,
						requestId
					});
				})().catch((error) => {
					if (claim.pending?.requestId === requestId) {
						claim.pending = void 0;
						completion.reject(toErrorObject(error, "Native resource close delivery failed"));
					}
				});
				return completion.promise;
			},
			release: () => {
				if (this.claims.get(captured.id) !== claim) return;
				if (!claim.closed) throw new SpawnBrokerError("Native resource must close before release");
				this.host.transmit({
					type: "resource-release",
					id: captured.id
				}).catch(() => {});
				this.remove(claim);
			},
			abandonUnattached: () => {
				if (this.claims.get(captured.id) !== claim) return;
				if (claim.ready || claim.created) throw new SpawnBrokerError("Attached native resource cannot be abandoned");
				const error = new SpawnBrokerError("Native resource was never dispatched");
				claim.attached.reject(error);
				claim.pending?.completion.reject(error);
				this.remove(claim, error);
			}
		};
	}
	receive(response) {
		const claim = this.claims.get(response.id);
		if (!claim || claim.failure && response.type !== "resource-closed") return;
		if (response.type === "resource-ready") {
			this.host.markReady(response.pid, response.generation);
			if (claim.ready) return;
			claim.ready = true;
			claim.attached.resolve();
		} else if (response.type === "resource-created") {
			if (claim.created) return;
			claim.created = true;
		} else if (response.type === "resource-owner-received" || response.type === "resource-owner-rejected") {
			const pending = claim.ownerMessages.get(response.sequence);
			if (pending) {
				claim.ownerMessages.delete(response.sequence);
				this.bufferedBytes -= pending.size;
				this.bufferedMessages--;
				if (response.type === "resource-owner-rejected") {
					const error = toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource owner callback failed");
					pending.completion.reject(error);
					claim.inContext(() => claim.callbacks.failed(error));
				} else pending.completion.resolve();
			}
			return;
		} else if (response.type === "resource-owner") {
			if (!Number.isSafeInteger(response.sequence) || response.sequence <= 0) {
				this.failClaim(claim, new SpawnBrokerError("Invalid native resource owner sequence"));
				return;
			}
			if (response.sequence <= claim.lastSequence || claim.buffered.has(response.sequence)) return;
			if (response.sequence !== claim.lastSequence + 1) {
				const size = serialize(response).length;
				if (this.bufferedBytes + size > 268435456 || this.bufferedMessages >= 1024) {
					this.failClaim(claim, new SpawnBrokerError("Native resource receive capacity exceeded"));
					return;
				}
				claim.buffered.set(response.sequence, {
					response,
					size
				});
				this.bufferedBytes += size;
				this.bufferedMessages++;
				return;
			}
			claim.lastSequence = response.sequence;
			claim.inContext(() => claim.callbacks.message(response));
			for (;;) {
				const next = claim.buffered.get(claim.lastSequence + 1);
				if (!next) break;
				claim.buffered.delete(++claim.lastSequence);
				this.bufferedBytes -= next.size;
				this.bufferedMessages--;
				claim.inContext(() => claim.callbacks.message(next.response));
			}
			return;
		} else if (response.type === "resource-closed") {
			if (claim.closed) return;
			claim.closed = true;
			this.clearOwnerMessages(claim, new SpawnBrokerError("Native resource closed before owner delivery was acknowledged"));
			claim.pending?.completion.resolve();
			claim.pending = void 0;
			this.host.refreshReference();
		} else if (response.type === "resource-close-error") {
			if (claim.pending?.requestId === response.requestId) {
				const pending = claim.pending;
				claim.pending = void 0;
				pending.completion.reject(response.resourceError ? new BrokerNativeResourceCloseError(response.error) : toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource cleanup failed"));
			}
		} else if (response.type === "resource-failed") {
			const error = toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource failed");
			claim.pending?.completion.reject(error);
			claim.pending = void 0;
			for (const pending of claim.ownerMessages.values()) pending.completion.reject(error);
			claim.inContext(() => claim.callbacks.failed(error));
			return;
		}
		claim.inContext(() => claim.callbacks.message(response));
	}
	seal() {
		if (this.sealPromise) return this.sealPromise;
		this.sealed = true;
		this.sealPromise = this.host.transmit({ type: "resource-seal" }).then(() => {
			for (const claim of this.claims.values()) claim.attached.resolve();
		});
		return this.sealPromise;
	}
	fail(error) {
		this.failure ??= error;
		const failed = [...this.claims.values()].filter((claim) => this.rejectClaim(claim, error));
		const callbackErrors = [];
		for (const claim of failed) try {
			claim.inContext(() => claim.callbacks.failed(error));
		} catch (callbackError) {
			callbackErrors.push(callbackError);
		}
		if (callbackErrors.length) throw new AggregateError(callbackErrors, "Native resource failure callback failed");
	}
	failClaim(claim, error) {
		if (this.rejectClaim(claim, error)) claim.inContext(() => claim.callbacks.failed(error));
	}
	rejectClaim(claim, error) {
		if (claim.failure || claim.closed) return false;
		claim.failure = error;
		claim.attached.reject(error);
		claim.pending?.completion.reject(error);
		for (const pending of claim.ownerMessages.values()) pending.completion.reject(error);
		claim.pending = void 0;
		this.clearBuffered(claim);
		return true;
	}
	clearBuffered(claim) {
		for (const value of claim.buffered.values()) this.bufferedBytes -= value.size;
		this.bufferedMessages -= claim.buffered.size;
		claim.buffered.clear();
	}
	clearOwnerMessages(claim, error) {
		for (const pending of claim.ownerMessages.values()) {
			this.bufferedBytes -= pending.size;
			this.bufferedMessages--;
			pending.completion.reject(error);
		}
		claim.ownerMessages.clear();
	}
	remove(claim, error) {
		this.clearBuffered(claim);
		this.clearOwnerMessages(claim, error ?? new SpawnBrokerError("Native resource released before owner delivery was acknowledged"));
		this.claims.delete(claim.attachment.id);
		this.host.refreshReference();
	}
};
//#endregion
//#region src/process/spawn-broker/host.ts
const MAX_REQUESTS = 256;
const RESTART_DELAYS = [
	100,
	250,
	500,
	1e3,
	2e3
];
const UNIX_SOCKET_PATH_BYTES = 103;
const MAX_BOOTSTRAP_BYTES = 1024;
function createNativeResourceDirectory() {
	const directory = mkdtempSync(join(tmpdir(), "oc-br-"));
	if (process.platform === "win32" || Buffer.byteLength(join(directory, "resource.sock")) <= UNIX_SOCKET_PATH_BYTES) return directory;
	rmSync(directory, {
		recursive: true,
		force: true
	});
	return mkdtempSync("/tmp/oc-br-");
}
function brokerSpawnOptions(options) {
	const stdio = options.stdio ?? "pipe";
	const entries = typeof stdio === "string" ? [
		stdio,
		stdio,
		stdio
	] : [...stdio];
	const normalized = [];
	for (let fd = 0; fd < Math.max(3, entries.length); fd += 1) {
		const entry = entries[fd] ?? (fd < 3 ? "pipe" : "ignore");
		if (entry === "inherit" && fd !== 0) return;
		if (entry !== "pipe" && entry !== "ignore" && entry !== "inherit" && entry !== "ipc") return;
		normalized.push(entry);
	}
	if (options.signal || options.timeout || options.killSignal) throw new Error("Unsupported spawn broker cancellation options");
	return {
		cwd: options.cwd instanceof URL ? fileURLToPath(options.cwd) : options.cwd,
		env: options.env ? { ...options.env } : { ...process.env },
		argv0: options.argv0,
		detached: options.detached,
		shell: options.shell,
		windowsHide: options.windowsHide,
		windowsVerbatimArguments: options.windowsVerbatimArguments,
		serialization: options.serialization,
		uid: options.uid,
		gid: options.gid,
		stdio: normalized
	};
}
var SpawnBrokerHost = class {
	constructor(options = {}) {
		this.options = options;
		this.runInContext = AsyncLocalStorage.snapshot();
		this.readiness = createDeferredCore();
		this.available = false;
		this.hasBeenReady = false;
		this.closing = false;
		this.generation = 0;
		this.consecutiveFailures = 0;
		this.sequence = 0;
		this.requests = /* @__PURE__ */ new Map();
		this.cleanups = /* @__PURE__ */ new Set();
		this.cleanupErrors = [];
		this.startupDeadline = 0;
		this.onParentExit = () => {
			if (this.process?.connected) this.process.disconnect();
			for (const cleanup of this.cleanups) cleanup.force();
		};
		this.workerUrl = options.workerUrl ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.spawnBroker);
		this.entryPath = fileURLToPath(this.workerUrl);
		if (options.nativeResources) {
			this.resourceDirectory = createNativeResourceDirectory();
			chmodSync(this.resourceDirectory, 448);
			const secret = randomBytes(32).toString("hex");
			this.resourceAuthority = {
				secret,
				endpoint: process.platform === "win32" ? `\\\\.\\pipe\\oc-br-${secret}` : join(this.resourceDirectory, "resource.sock")
			};
			this.resourceClaims = new BrokerResourceClaims({
				transmit: async (request) => {
					if (!this.available) await this.ready();
					await this.transmit(request);
				},
				markReady: (pid, generation) => {
					if (!this.markNativeReady) throw new SpawnBrokerError("Native resource broker unavailable");
					this.markNativeReady(pid, generation);
				},
				refreshReference: () => this.refreshNativeReference()
			});
		}
		this.readiness.promise.catch(() => {});
		try {
			this.start();
		} catch (error) {
			if (this.resourceDirectory) rmSync(this.resourceDirectory, {
				recursive: true,
				force: true
			});
			throw error;
		}
		process.once("exit", this.onParentExit);
	}
	get pid() {
		return this.process?.pid;
	}
	ready() {
		return this.closing ? Promise.reject(new SpawnBrokerError("Spawn broker is closing")) : this.readiness.promise;
	}
	captureNativeResource(input, callbacks) {
		if (!this.resourceClaims || !this.resourceAuthority || this.closing || this.requests.size + this.resourceClaims.size >= MAX_REQUESTS) throw new SpawnBrokerError("Native resource broker is unavailable or at capacity");
		return this.resourceClaims.capture({
			...input,
			...this.resourceAuthority,
			generation: this.generation - 1,
			startupDeadline: this.available ? void 0 : this.startupDeadline,
			id: ++this.sequence
		}, callbacks);
	}
	sealNativeResources() {
		if (this.resourceClaims && !this.available) return Promise.reject(new SpawnBrokerError("Native resource broker is not ready for cleanup"));
		return this.resourceClaims?.seal() ?? Promise.reject(new SpawnBrokerError("Native resources are disabled"));
	}
	serviceNativeResources() {
		this.serviceStartup?.();
	}
	refreshNativeReference() {
		if (!this.resourceClaims || !this.process) return;
		if (this.closing || this.resourceClaims.hasOpenClaims || this.requests.size > 0) {
			this.process.ref();
			this.process.channel?.ref?.();
		} else {
			this.process.unref();
			this.process.channel?.unref?.();
		}
	}
	spawn(command, args, options) {
		const prepared = brokerSpawnOptions(options);
		if (!prepared) throw new Error("Unsupported spawn broker stdio or process options");
		return this.admit({
			type: "spawn",
			id: ++this.sequence,
			argv: [command, ...args],
			options: prepared
		}).child;
	}
	spawnExeca(argv, options) {
		const id = ++this.sequence;
		const request = this.admit({
			type: "spawn-execa",
			id,
			argv,
			options
		});
		return {
			child: request.child,
			result: request.result.promise,
			cancel: () => {
				this.transmit({
					type: "cancel",
					id
				}).catch((error) => request.child.fail(toErrorObject(error, "Spawn broker cancellation delivery failed")));
			}
		};
	}
	admit(message) {
		const child = new BrokerChild(message.id, message.argv, (value, handle) => this.transmit(value, handle));
		const result = message.type === "spawn-execa" ? createDeferredCore() : void 0;
		if (result) result.promise.catch(() => {});
		const request = {
			child,
			result,
			childClosed: false,
			resultSettled: !result,
			detached: message.options.detached === true || message.type === "spawn-execa" && message.options.killDescendants === true
		};
		const fail = (error) => {
			result?.reject(error);
			child.fail(error);
		};
		if (!this.available || this.closing || this.requests.size + (this.resourceClaims?.size ?? 0) >= MAX_REQUESTS) {
			child.markNotStarted();
			queueMicrotask(() => fail(new SpawnBrokerError("Spawn broker is unavailable")));
			return request;
		}
		this.requests.set(message.id, request);
		this.refreshNativeReference();
		child.waitForClose().then(() => {
			request.childClosed = true;
			this.retire(message.id, request);
		});
		this.transmit(message).catch((error) => {
			this.requests.delete(message.id);
			this.refreshNativeReference();
			fail(new SpawnBrokerError("Spawn broker request delivery failed", { cause: error }));
		});
		return request;
	}
	retire(id, request) {
		if (request.childClosed && request.resultSettled) {
			this.requests.delete(id);
			this.refreshNativeReference();
		}
	}
	retainCleanup(cleanup) {
		this.cleanups.add(cleanup);
		cleanup.settled.then(() => this.cleanups.delete(cleanup), (failure) => {
			this.cleanupErrors.push(toErrorObject(failure, "Spawn broker cleanup failed"));
			this.cleanups.delete(cleanup);
		});
	}
	transmit(message, handle) {
		if (!this.available || !this.sendMessage) return Promise.reject(new SpawnBrokerError("Spawn broker is unavailable"));
		return this.sendMessage(message, handle);
	}
	start() {
		if (this.closing) return;
		const generation = this.generation++;
		const bootstrap = {
			type: "bootstrap",
			...this.resourceAuthority ? { nativeResource: {
				...this.resourceAuthority,
				generation
			} } : {}
		};
		if (serialize(bootstrap).byteLength > MAX_BOOTSTRAP_BYTES) throw new SpawnBrokerError("Spawn broker bootstrap exceeds its IPC bound");
		const child = spawn(process.execPath, resolveRuntimeWorkerArgv(this.workerUrl), {
			stdio: [
				"inherit",
				"ignore",
				"ignore",
				"ipc"
			],
			detached: true,
			serialization: "advanced"
		});
		this.process = child;
		this.brokerClosed = new Promise((resolve) => {
			child.once("close", () => resolve());
		});
		const receiver = createBrokerReceiver();
		const brokerExited = createDeferredCore();
		let ended = false;
		let ready = false;
		this.startupDeadline = Date.now() + SPAWN_BROKER_STARTUP_TIMEOUT_MS;
		const checkStartup = () => {
			if (!ended && !ready && Date.now() >= this.startupDeadline) {
				fail(/* @__PURE__ */ new Error("readiness deadline exceeded after 15000ms"));
				child.kill("SIGKILL");
			}
		};
		const startupTimer = this.resourceClaims ? void 0 : setTimeout(checkStartup, SPAWN_BROKER_STARTUP_TIMEOUT_MS);
		this.serviceStartup = checkStartup;
		const fail = (cause) => {
			if (ended) return;
			ended = true;
			clearTimeout(startupTimer);
			this.markNativeReady = void 0;
			receiver.clear();
			this.available = false;
			this.sendMessage = void 0;
			const error = new SpawnBrokerError(this.hasBeenReady ? "Spawn broker exited; command outcome is unavailable" : `Spawn broker failed before readiness: ${cause?.message ?? "channel lost"}`, { cause });
			const previousReadiness = this.readiness;
			this.readiness = createDeferredCore();
			this.readiness.promise.catch(() => {});
			previousReadiness.reject(error);
			for (const request of this.requests.values()) {
				if (request.pid && !request.childClosed) {
					const cleanup = terminateLostBrokerChild(request.pid, request.detached, this.closing ? brokerExited.promise : void 0);
					this.retainCleanup(cleanup);
				}
				request.result?.reject(error);
				request.child.fail(error);
			}
			this.requests.clear();
			this.refreshNativeReference();
			if (child.pid && process.platform !== "win32") this.retainCleanup(terminateBrokerProcessGroup(child.pid));
			if (this.resourceClaims || this.closing || !this.hasBeenReady) {
				this.readiness.reject(error);
				this.resourceClaims?.fail(error);
				return;
			}
			const delay = RESTART_DELAYS[this.consecutiveFailures++];
			if (delay === void 0) {
				this.readiness.reject(error);
				return;
			}
			this.restartTimer = setTimeout(() => this.start(), delay);
		};
		const markReady = (pid, receivedGeneration) => {
			if (ended || pid !== child.pid || receivedGeneration !== generation) throw new SpawnBrokerError("Native resource readiness does not match the captured broker");
			if (ready) return;
			ready = true;
			clearTimeout(startupTimer);
			this.hasBeenReady = true;
			this.consecutiveFailures = 0;
			this.available = true;
			this.readiness.resolve();
			this.runInContext(() => this.options.onReady?.(pid, generation > 0));
		};
		this.markNativeReady = markReady;
		child.once("error", fail);
		child.once("exit", (code, signal) => {
			brokerExited.resolve();
			fail(/* @__PURE__ */ new Error(`exited with code=${code ?? "null"} signal=${signal ?? "none"}`));
		});
		child.once("disconnect", () => fail(/* @__PURE__ */ new Error("IPC channel disconnected")));
		const abortTransport = (error) => {
			fail(error);
			if (!this.resourceClaims && child.connected) child.disconnect();
			child.kill("SIGTERM");
		};
		child.on("message", (raw, handle) => {
			if (ended || this.closing) {
				if (handle instanceof Socket) handle.destroy();
				return;
			}
			let decoded;
			try {
				decoded = receiver.receive(raw);
			} catch (error) {
				abortTransport(error instanceof Error ? error : new Error(String(error)));
				return;
			}
			if (decoded === void 0) return;
			const message = decoded;
			if (message.type === "ready") {
				markReady(message.pid, generation);
				return;
			}
			if (message.type === "resource-ready" || message.type === "resource-created" || message.type === "resource-target" || message.type === "resource-owner" || message.type === "resource-owner-received" || message.type === "resource-owner-rejected" || message.type === "resource-closed" || message.type === "resource-close-error" || message.type === "resource-failed") {
				this.resourceClaims?.receive(message);
				return;
			}
			const request = this.requests.get(message.id);
			if (!request) {
				if (handle instanceof Socket) handle.destroy();
				if (message.type === "pipe") this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
				return;
			}
			if (message.type === "owned") request.pid = message.pid;
			else if (message.type === "pipe") {
				try {
					if (message.closed && message.fd === 0) {
						const stdin = new Socket();
						request.child.attachPipe(message.fd, stdin);
						stdin.destroy();
					} else if (handle instanceof Socket) {
						if (message.fd === 0) restoreStdinPipe(handle);
						else holdPipe(handle);
						request.child.attachPipe(message.fd, handle);
					} else throw new SpawnBrokerError("Spawn broker pipe transfer failed");
				} catch (error) {
					if (handle instanceof Socket) handle.destroy();
					abortTransport(toErrorObject(error, "Spawn broker pipe setup failed"));
					return;
				}
				this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
			} else if (message.type === "pipe-prefix") {
				const pipe = request.child.stdio[message.fd];
				if (pipe instanceof Socket && message.bytes.length > 0) pipe.unshift(message.bytes);
			} else if (message.type === "execa-result") {
				if (request.pid === void 0 && message.result.failed) request.child.markNotStarted();
				request.result?.resolve(message.result);
				request.resultSettled = true;
				this.retire(message.id, request);
			} else {
				if (message.type === "error" && message.resultUnavailable && request.result) {
					request.result.reject(Object.assign(new Error(message.error.message), message.error));
					request.resultSettled = true;
				}
				request.child.receive(message);
				this.retire(message.id, request);
			}
		});
		try {
			child.send(bootstrap, (error) => {
				if (error) abortTransport(error);
			});
		} catch (error) {
			abortTransport(toErrorObject(error, "Spawn broker bootstrap delivery failed"));
		}
		if (!ended) this.sendMessage = createBrokerSender((message, handle, callback) => child.send(message, handle, { keepOpen: true }, callback));
		this.refreshNativeReference();
	}
	/** Join cleanup already retained by this host, including recorded failures. */
	async waitForCleanup() {
		await Promise.allSettled([...this.cleanups].map((cleanup) => cleanup.settled));
		if (this.cleanupErrors.length) throw new AggregateError(this.cleanupErrors, "Spawn broker cleanup did not complete");
	}
	close() {
		if (this.resourceClaims?.hasOpenClaims) return Promise.reject(new SpawnBrokerError("Native resource claims must close before broker shutdown"));
		return this.closePromise ??= this.closeInternal();
	}
	async closeInternal() {
		this.closing = true;
		this.refreshNativeReference();
		this.readiness.reject(new SpawnBrokerError("Spawn broker is closing"));
		clearTimeout(this.restartTimer);
		try {
			const child = this.process;
			if (child && child.exitCode === null && child.signalCode === null) {
				const exited = this.resourceClaims && this.brokerClosed ? this.brokerClosed : new Promise((resolve) => {
					child.once("exit", () => resolve());
				});
				const timer = setTimeout(() => child.kill("SIGKILL"), 7e3);
				try {
					if (this.resourceClaims) this.transmit({ type: "shutdown" }).catch(() => child.kill("SIGTERM"));
					else if (child.connected) child.disconnect();
					await exited;
				} finally {
					clearTimeout(timer);
				}
			}
			try {
				await this.waitForCleanup();
			} finally {
				if (this.resourceClaims) {
					await this.brokerClosed;
					if (this.resourceDirectory) rmSync(this.resourceDirectory, {
						recursive: true,
						force: true
					});
				}
			}
		} finally {
			process.removeListener("exit", this.onParentExit);
		}
	}
};
function createSpawnBrokerHost(options) {
	return new SpawnBrokerHost(options);
}
//#endregion
export { BrokerChild as a, killProcessTree as i, BrokerNativeResourceCloseError as n, decodeNativeWorkerFailure as r, createSpawnBrokerHost as t };

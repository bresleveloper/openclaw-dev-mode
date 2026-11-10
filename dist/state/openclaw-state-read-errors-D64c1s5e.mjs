import { d as extractErrorCode, p as toErrorObject, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { _ as redactToolPayloadText, c as areDiagnosticsEnabledForProcess, s as stripAnsi } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { E as normalizeLowercaseStringOrEmpty } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { a as isPidDefinitelyDead, n as getProcessInstanceStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { a as runtimeProcessEntrypoints } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import "./openclaw-state-read-service-child-group-ownership-U-XcVwb-.mjs";
import { accessSync, chmodSync, constants, mkdtempSync, opendirSync, readFileSync, rmSync } from "node:fs";
import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { Buffer as Buffer$1 } from "node:buffer";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { deserialize, serialize } from "node:v8";
import { Socket } from "node:net";
import { EventEmitter } from "node:events";
//#region packages/terminal-core/src/safe-text.ts
/**
* Normalize untrusted text for single-line terminal/log rendering.
*/
function sanitizeTerminalText(input) {
	return stripAnsi(input).replace(/\p{Cc}/gu, (control) => control === "\r" ? "\\r" : control === "\n" ? "\\n" : control === "	" ? "\\t" : "");
}
//#endregion
//#region src/infra/child-runtime-viability.ts
function accessExecutable(execPath) {
	accessSync(execPath, constants.X_OK);
}
/** Reports whether this process can still spawn children with its own Node binary. */
function readChildRuntimeViability(params) {
	const execPath = params?.execPath ?? process.execPath;
	const access = params?.access ?? accessExecutable;
	let available = true;
	try {
		access(execPath);
	} catch (error) {
		available = !(error instanceof Error && (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")));
	}
	return {
		execPath,
		available
	};
}
/** Operator text for a Gateway whose retained Node binary is gone. */
function formatMissingChildRuntimeWarning(viability) {
	if (viability.available) return;
	return `Gateway runtime is stale after Node upgrade: child workers are using ${sanitizeTerminalText(viability.execPath)}, which no longer exists. Restart the Gateway.`;
}
/** Do not mislabel missing commands or working directories as a removed Node runtime. */
function formatChildRuntimeSpawnWarning(error) {
	if (error instanceof Error && hasNodeErrorCode(error, "ENOENT") && "path" in error && error.path === process.execPath) return formatMissingChildRuntimeWarning(readChildRuntimeViability());
}
//#endregion
//#region src/utils/utf8-truncate.ts
function isContinuationByte(byte) {
	return byte !== void 0 && (byte & 192) === 128;
}
/** Keeps the longest UTF-8 suffix that fits within the byte limit. */
function truncateUtf8Suffix(value, maxBytes) {
	if (maxBytes <= 0) return "";
	if (value.length <= maxBytes && Buffer$1.byteLength(value) <= maxBytes) return value;
	const bytes = Buffer$1.from(Number.isInteger(maxBytes) ? value.slice(-maxBytes - 1) : value);
	let start = bytes.byteLength - maxBytes;
	while (start < bytes.byteLength && isContinuationByte(bytes[start])) start += 1;
	return bytes.subarray(start).toString("utf8");
}
//#endregion
//#region src/process/spawn-broker/child-completion.ts
/** Observe immediately after spawn, before this owner can disconnect or transfer pipes. */
function waitForBrokerChildCompletion(child) {
	return new Promise((resolve) => {
		let exited = child.exitCode != null || child.signalCode != null;
		let ipcClosed = !child.connected;
		let openPipes = 0;
		const finish = () => {
			if (!exited || !ipcClosed || openPipes !== 0) return;
			child.removeListener("exit", onExit);
			child.removeListener("error", onError);
			child.removeListener("disconnect", onDisconnect);
			resolve();
		};
		const onExit = () => {
			exited = true;
			finish();
		};
		const onError = () => {
			if (child.pid === void 0) {
				exited = true;
				ipcClosed = true;
				finish();
			}
		};
		const onDisconnect = () => {
			ipcClosed = true;
			finish();
		};
		child.once("exit", onExit);
		child.on("error", onError);
		child.once("disconnect", onDisconnect);
		for (const stream of child.stdio ?? []) {
			if (!stream || stream.closed) continue;
			openPipes++;
			stream.once("close", () => {
				openPipes--;
				finish();
			});
		}
		finish();
	});
}
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
	send(message, handleOrCallback, optionsOrCallback, callback, initiateSpawn) {
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
		}, handle, initiateSpawn).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
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
*
* `exited()` verifies that every retained escalation target is gone: the group,
* every captured Linux attached-tree identity, or otherwise the root. True latches,
* clears the grace timer, and prevents later `force()` calls from signaling recycled numbers.
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
	let gone = false;
	const exited = () => {
		gone ||= useGroupKill ? !isProcessAlive(-pid) : processTree ? !processTree.some(capturedProcessInstanceMayBeAlive) : !isProcessAlive(pid);
		if (gone) {
			forceRequested = true;
			clearTimeout(forceTimer);
		}
		return gone;
	};
	return {
		force: () => {
			clearTimeout(forceTimer);
			force();
		},
		exited
	};
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
/** Completion needs proof: an existing PID whose identity is unreadable may still be the captured instance. */
function capturedProcessInstanceMayBeAlive(entry) {
	if (!entry.identity || !isProcessAlive(entry.pid)) return false;
	const identity = readUnixProcessIdentity(entry.pid);
	return identity === void 0 || identity === entry.identity;
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
//#region src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
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
/** Once the original group is absent or its leader identity changes, never signal its number again. */
function isBrokerChildGroupAlive(identity) {
	if (groupGone(identity.pid)) return false;
	const current = getProcessInstanceStartTime(identity.pid);
	if (identity.isLeaderAlive) {
		if (identity.isLeaderAlive()) return identity.startedAt === null || current === null || current === identity.startedAt;
		if (!isPidDefinitelyDead(identity.pid)) return false;
		return identity.startedAt === null || current === null || current === identity.startedAt;
	}
	if (identity.startedAt === null || current === null && !isPidDefinitelyDead(identity.pid)) throw new SpawnBrokerError(`Spawn broker group leader identity is unavailable for pid=${identity.pid}`);
	return current === null || current === identity.startedAt;
}
function terminateRetainedBrokerChildGroup(identity) {
	let retired = false;
	let forced = false;
	const signal = (value) => {
		if (retired) return;
		if (!isBrokerChildGroupAlive(identity)) {
			retired = true;
			return;
		}
		try {
			process.kill(-identity.pid, value);
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") throw error;
			retired = true;
		}
	};
	const force = () => {
		if (retired || forced) return;
		forced = true;
		signal("SIGKILL");
	};
	return {
		force,
		settled: (async () => {
			const graceEndsAt = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS;
			const deadline = graceEndsAt + 2e3;
			try {
				signal("SIGTERM");
				for (;;) {
					if (retired || !isBrokerChildGroupAlive(identity)) break;
					if (performance.now() >= graceEndsAt) force();
					if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${identity.pid}`);
					await setTimeout$1(50);
				}
			} finally {
				retired = true;
			}
		})()
	};
}
/** Preserve a lost broker's tree cleanup across host restart and process exit. */
function terminateLostBrokerChild(pid, detached, groupIdentity) {
	if (detached && groupIdentity) {
		if (groupIdentity.pid !== pid) throw new SpawnBrokerError("Spawn broker cleanup identity changed");
		return terminateRetainedBrokerChildGroup(groupIdentity);
	}
	const termination = killProcessTree(pid, {
		detached,
		graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
	});
	const deadline = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
	return {
		force: () => termination?.force(),
		settled: (async () => {
			for (;;) {
				if (isPidDefinitelyDead(pid) && (!detached || groupGone(pid)) && (termination?.exited() ?? true)) break;
				if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${pid}`);
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
			const deadline = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
			try {
				while (!groupGone(pgid)) {
					if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${pgid}`, { cause: signalError });
					await setTimeout$1(50);
				}
			} finally {
				retire();
			}
		})()
	};
}
//#endregion
//#region src/process/spawn-broker/file-reads.ts
/** Request state only; the existing broker owns process startup, failure, and shutdown. */
var BrokerFileReads = class {
	constructor(host) {
		this.host = host;
		this.pending = /* @__PURE__ */ new Map();
		this.sequence = 0;
	}
	get size() {
		return this.pending.size;
	}
	async read(filePath, signal) {
		signal?.throwIfAborted();
		await this.host.ready();
		signal?.throwIfAborted();
		if (!this.host.canAdmit()) throw new SpawnBrokerError("Spawn broker cannot admit a raw file read");
		const id = ++this.sequence;
		const result = createDeferredCore();
		this.pending.set(id, {
			chunks: [],
			result
		});
		const abort = () => {
			result.reject(signal?.reason);
			this.host.send({
				type: "cancel-read-file",
				id
			}).catch(() => {});
		};
		signal?.addEventListener("abort", abort, { once: true });
		this.host.send({
			type: "read-file",
			id,
			filePath
		}).catch(result.reject);
		try {
			return await result.promise;
		} finally {
			signal?.removeEventListener("abort", abort);
			this.pending.delete(id);
		}
	}
	receive(reply) {
		if (reply.type !== "file-read-chunk" && reply.type !== "file-read-result") return false;
		const read = this.pending.get(reply.id);
		if (read) {
			if (reply.type === "file-read-chunk") read.chunks.push(reply.bytes);
			else if (reply.error) read.result.reject(Object.assign(reply.error, { code: reply.code }));
			else read.result.resolve(Buffer.concat(read.chunks));
		}
		return true;
	}
	fail(error) {
		for (const read of this.pending.values()) read.result.reject(error);
		this.pending.clear();
	}
};
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
	const write = (message, handle, initiateSpawn) => new Promise((resolve, reject) => {
		try {
			const launch = () => send(message, handle, (error) => error ? reject(error) : resolve());
			if (initiateSpawn) initiateSpawn(launch);
			else launch();
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
	const sender = (message, handle, initiateSpawn) => {
		const payload = serialize(message);
		const size = payload.byteLength;
		if (size > FRAME_BYTES && handle) return Promise.reject(new SpawnBrokerError("Spawn broker handle metadata exceeds one IPC frame"));
		const id = ++sequence;
		const operation = async () => {
			if (size <= FRAME_BYTES) {
				await write(message, handle, initiateSpawn);
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
				await write(frame, void 0, offset + FRAME_BYTES >= size ? initiateSpawn : void 0);
			}
		};
		return enqueue(size, operation);
	};
	return Object.assign(sender, { reserve(run) {
		return enqueue(FRAME_BYTES, () => run(async (message) => {
			if (serialize(message).byteLength > FRAME_BYTES) throw new SpawnBrokerError("Spawn broker reserved publication exceeds one IPC frame");
			await write(message);
		}));
	} });
}
/** Only the version-matched private peer can supply frames on this channel. */
function createBrokerReceiver() {
	let pending;
	const clear = () => {
		pending = void 0;
	};
	return {
		receive(message) {
			if (!message || typeof message !== "object" || !("kind" in message) || message.kind !== FRAME_KIND) {
				clear();
				return message;
			}
			const frame = message;
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > 268435456 || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending?.id === frame.id ? pending : void 0;
			if (!assembly) {
				if (frame.offset !== 0) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
				pending = assembly = {
					id: frame.id,
					total: frame.total,
					received: 0,
					chunks: []
				};
			}
			if (assembly.total !== frame.total || assembly.received !== frame.offset || assembly.received + frame.bytes.length > assembly.total) throw new SpawnBrokerError("Out-of-order spawn broker IPC frame");
			assembly.chunks.push(frame.bytes);
			assembly.received += frame.bytes.length;
			if (assembly.received < assembly.total) return;
			clear();
			return deserialize(Buffer.concat(assembly.chunks, assembly.total));
		},
		clear
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
		const error = current.constructorName === "AggregateError" ? new AggregateError([], current.message) : current.constructorName === "SuppressedError" ? new SuppressedError(void 0, void 0, current.message) : new Constructor(current.message);
		seen.set(current, error);
		error.name = current.name;
		error.stack = current.stack;
		const defineField = (key, fieldValue, enumerable = false) => {
			Object.defineProperty(error, key, {
				value: fieldValue,
				writable: true,
				configurable: true,
				enumerable
			});
		};
		for (const key of [
			"code",
			"errcode",
			"errno"
		]) if (current[key] !== void 0) defineField(key, current[key], true);
		if (current.cause) defineField("cause", decode(current.cause));
		if (current.errors) defineField("errors", current.errors.map(decode));
		for (const key of ["error", "suppressed"]) {
			const failure = current[key];
			if (failure) defineField(key, decode(failure));
		}
		return error;
	};
	return decode(value);
}
//#endregion
//#region src/process/spawn-broker/resource-protocol.ts
const SPAWN_BROKER_STARTUP_TIMEOUT_MS = 15e3;
const monotonic = process.hrtime.bigint.bind(process.hrtime);
/** Native startup shares the host's monotonic clock across Node contexts. */
function spawnBrokerStartupNowMs() {
	return Number(monotonic() / 1000000n);
}
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
			ownerMessages: /* @__PURE__ */ new Map()
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
			if (response.sequence <= claim.lastSequence) return;
			claim.lastSequence = response.sequence;
			claim.inContext(() => claim.callbacks.message(response));
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
	rejectClaim(claim, error) {
		if (claim.failure || claim.closed) return false;
		claim.failure = error;
		claim.attached.reject(error);
		claim.pending?.completion.reject(error);
		for (const pending of claim.ownerMessages.values()) pending.completion.reject(error);
		claim.pending = void 0;
		return true;
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
		this.clearOwnerMessages(claim, error ?? new SpawnBrokerError("Native resource released before owner delivery was acknowledged"));
		this.claims.delete(claim.attachment.id);
		this.host.refreshReference();
	}
};
const UNIX_SOCKET_PATH_BYTES = 103;
function createNativeResourceDirectory() {
	const directory = mkdtempSync(join(tmpdir(), "oc-br-"));
	if (process.platform === "win32" || Buffer.byteLength(join(directory, "resource.sock")) <= UNIX_SOCKET_PATH_BYTES) return directory;
	rmSync(directory, {
		recursive: true,
		force: true
	});
	return mkdtempSync("/tmp/oc-br-");
}
function createNativeResourceAuthority() {
	const directory = createNativeResourceDirectory();
	chmodSync(directory, 448);
	const secret = randomBytes(32).toString("hex");
	return {
		directory,
		secret,
		endpoint: process.platform === "win32" ? `\\\\.\\pipe\\oc-br-${secret}` : join(directory, "resource.sock")
	};
}
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
const MAX_BOOTSTRAP_BYTES = 1024;
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
		this.fileReads = new BrokerFileReads({
			ready: () => this.ready(),
			send: (message) => this.transmit(message),
			canAdmit: () => !this.resourceClaims && !this.closing && this.requests.size + this.fileReads.size < MAX_REQUESTS
		});
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
			const { directory, ...authority } = createNativeResourceAuthority();
			this.resourceDirectory = directory;
			this.resourceAuthority = authority;
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
	readFile(filePath, signal) {
		return this.fileReads.read(filePath, signal);
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
		const stderr = this.process.stderr instanceof Socket ? this.process.stderr : void 0;
		if (this.closing || this.resourceClaims.hasOpenClaims || this.requests.size > 0) {
			this.process.ref();
			stderr?.ref();
			this.process.channel?.ref?.();
		} else {
			this.process.unref();
			stderr?.unref();
			this.process.channel?.unref?.();
		}
	}
	spawn(command, args, options, initiateSpawn) {
		const prepared = brokerSpawnOptions(options);
		if (!prepared) throw new Error("Unsupported spawn broker stdio or process options");
		return this.admit({
			type: initiateSpawn ? "prepare-spawn" : "spawn",
			id: ++this.sequence,
			argv: [command, ...args],
			options: prepared
		}, initiateSpawn).child;
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
	admit(message, initiateSpawn) {
		const child = new BrokerChild(message.id, message.argv, (value, handle, initiate) => this.transmit(value, handle, initiate));
		const result = message.type === "spawn-execa" ? createDeferredCore() : void 0;
		if (result) result.promise.catch(() => {});
		const request = {
			child,
			initiateSpawn,
			result,
			childClosed: false,
			resultSettled: !result,
			detached: message.options.detached === true || message.type === "spawn-execa" && message.options.killDescendants === true
		};
		const fail = (error) => {
			result?.reject(error);
			child.fail(error);
		};
		if (!this.available || this.closing || this.requests.size + this.fileReads.size + (this.resourceClaims?.size ?? 0) >= MAX_REQUESTS) {
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
			if (!request.nativeInitiated) {
				if (message.type === "prepare-spawn") child.markNotStarted();
				this.requests.delete(message.id);
				this.refreshNativeReference();
			}
			fail(new SpawnBrokerError("Spawn broker request delivery failed", { cause: error }));
		});
		return request;
	}
	retire(id, request) {
		if (request.childClosed && request.resultSettled && !request.nativeInitiated) {
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
	transmit(message, handle, initiateSpawn) {
		if (!this.available || !this.sendMessage) return Promise.reject(new SpawnBrokerError("Spawn broker is unavailable"));
		return this.sendMessage(message, handle, initiateSpawn);
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
				"pipe",
				"ipc"
			],
			detached: true,
			serialization: "advanced"
		});
		this.process = child;
		let stderrTail = "";
		child.stderr?.setEncoding("utf8").on("data", (chunk) => {
			stderrTail = truncateUtf8Suffix(stderrTail + chunk, 2048);
		});
		const exitError = () => {
			const stderr = redactToolPayloadText(stderrTail).trim();
			return /* @__PURE__ */ new Error(`exited with code=${child.exitCode ?? "null"} signal=${child.signalCode ?? "none"}${stderr ? `\nstderr:\n${stderr}` : ""}`);
		};
		this.brokerClosed = waitForBrokerChildCompletion(child).then(() => {
			if (this.closing && child.pid && (child.exitCode !== 0 || child.signalCode !== null)) this.cleanupErrors.push(new SpawnBrokerError("Spawn broker shutdown failed", { cause: exitError() }));
		});
		const receiver = createBrokerReceiver();
		const brokerExited = createDeferredCore();
		let ended = false;
		let ready = false;
		this.startupDeadline = spawnBrokerStartupNowMs() + SPAWN_BROKER_STARTUP_TIMEOUT_MS;
		const checkStartup = () => {
			if (!ended && !ready && spawnBrokerStartupNowMs() >= this.startupDeadline) fail(/* @__PURE__ */ new Error("readiness deadline exceeded after 15000ms"));
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
			if (child.connected) child.disconnect();
			const error = new SpawnBrokerError(formatChildRuntimeSpawnWarning(cause) ?? (this.hasBeenReady ? "Spawn broker exited; command outcome is unavailable" : `Spawn broker failed before readiness: ${cause?.message ?? "channel lost"}`), { cause });
			const previousReadiness = this.readiness;
			this.readiness = createDeferredCore();
			this.readiness.promise.catch(() => {});
			previousReadiness.reject(error);
			this.fileReads.fail(error);
			for (const request of this.requests.values()) {
				if (request.pid && !request.childClosed) {
					const pid = request.pid;
					if (this.closing) {
						let cleanup;
						this.retainCleanup({
							force: () => cleanup?.force(),
							settled: brokerExited.promise.then(async () => {
								if (child.exitCode === 0 && child.signalCode === null) return;
								cleanup = terminateLostBrokerChild(pid, request.detached);
								await cleanup.settled;
							})
						});
					} else this.retainCleanup(terminateLostBrokerChild(pid, request.detached));
				}
				request.result?.reject(error);
				request.child.fail(error);
			}
			this.requests.clear();
			this.refreshNativeReference();
			if (child.pid && process.platform !== "win32") {
				const pgid = child.pid;
				let cleanup;
				this.retainCleanup({
					force: () => cleanup?.force(),
					settled: brokerExited.promise.then(async () => {
						cleanup = terminateBrokerProcessGroup(pgid);
						await cleanup.settled;
					})
				});
			}
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
		child.once("exit", () => {
			brokerExited.resolve();
			fail(exitError());
		});
		child.once("disconnect", () => fail(/* @__PURE__ */ new Error("IPC channel disconnected")));
		child.on("message", (raw, handle) => {
			if (ended || this.closing) {
				if (handle instanceof Socket) handle.destroy();
				return;
			}
			let decoded;
			try {
				decoded = receiver.receive(raw);
			} catch (error) {
				fail(toErrorObject(error, "Spawn broker receive failed"));
				return;
			}
			if (decoded === void 0) return;
			const message = decoded;
			if (message.type === "ready") {
				try {
					markReady(message.pid, generation);
				} catch (error) {
					fail(toErrorObject(error, "Spawn broker readiness failed"));
				}
				return;
			}
			if (message.type === "resource-ready" || message.type === "resource-created" || message.type === "resource-target" || message.type === "resource-owner" || message.type === "resource-owner-received" || message.type === "resource-owner-rejected" || message.type === "resource-closed" || message.type === "resource-close-error" || message.type === "resource-failed") {
				try {
					this.resourceClaims?.receive(message);
				} catch (error) {
					fail(toErrorObject(error, "Spawn broker native resource receive failed"));
				}
				return;
			}
			if (this.fileReads.receive(message)) return;
			const request = this.requests.get(message.id);
			if (!request) {
				if (handle instanceof Socket) handle.destroy();
				if (message.type === "pipe") this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
				else if (message.type === "prepared") this.transmit({
					type: "launch",
					id: message.id,
					allowed: false
				}).catch(fail);
				return;
			}
			if (message.type === "owned" || message.type === "error") {
				request.nativeInitiated?.resolve();
				request.nativeInitiated = void 0;
			}
			if (message.type === "prepared") {
				const initiate = request.initiateSpawn;
				request.initiateSpawn = void 0;
				const brokerClosed = this.brokerClosed;
				const nativeInitiated = initiate ? request.nativeInitiated ??= createDeferredCore() : void 0;
				const settlement = brokerClosed && nativeInitiated ? Promise.race([nativeInitiated.promise, brokerClosed]) : Promise.reject(/* @__PURE__ */ new Error("Spawn broker retirement is unavailable"));
				settlement.catch(() => {});
				this.transmit({
					type: "launch",
					id: message.id,
					allowed: true
				}, void 0, (launch) => {
					if (!initiate || !nativeInitiated || request.childClosed) throw new SpawnBrokerError("Spawn broker launch grant is unavailable");
					return initiate(launch, settlement);
				}).catch(() => {
					this.transmit({
						type: "launch",
						id: message.id,
						allowed: false
					}).catch(fail);
				});
			} else if (message.type === "owned") {
				request.pid = message.pid;
				if (request.childClosed) {
					this.retainCleanup(terminateLostBrokerChild(message.pid, request.detached));
					this.retire(message.id, request);
				}
			} else if (message.type === "pipe") {
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
					fail(toErrorObject(error, "Spawn broker pipe setup failed"));
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
				if (error) fail(error);
			});
		} catch (error) {
			fail(toErrorObject(error, "Spawn broker bootstrap delivery failed"));
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
		this.fileReads.fail(new SpawnBrokerError("Spawn broker is closing"));
		clearTimeout(this.restartTimer);
		try {
			const child = this.process;
			if (child && child.exitCode === null && child.signalCode === null) {
				if (this.resourceClaims) this.transmit({ type: "shutdown" }).catch(() => {
					if (child.connected) child.disconnect();
				});
				else if (child.connected) child.disconnect();
			}
			await this.brokerClosed;
			try {
				await this.waitForCleanup();
			} finally {
				if (this.resourceDirectory) rmSync(this.resourceDirectory, {
					recursive: true,
					force: true
				});
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
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
function getSpawnBroker() {
	return context.getStore();
}
//#endregion
//#region src/infra/shell-inline-command.ts
const POSIX_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	"-lc",
	"-c",
	"--command",
	"--commands",
	"--cmdline"
]);
[...POSIX_INLINE_COMMAND_FLAGS];
function expandPowerShellSwitchPrefixForms(match, smallestMatch) {
	const forms = [];
	for (let length = smallestMatch.length; length <= match.length; length += 1) {
		const prefix = match.slice(0, length);
		forms.push(`-${prefix}`, `--${prefix}`, `/${prefix}`);
	}
	return forms;
}
function expandPowerShellSwitchForms(names) {
	return names.flatMap((name) => {
		const normalized = normalizeLowercaseStringOrEmpty(name);
		return [
			`-${normalized}`,
			`--${normalized}`,
			`/${normalized}`
		];
	});
}
const POWERSHELL_COMMAND_FLAGS = [
	...expandPowerShellSwitchPrefixForms("command", "c"),
	...expandPowerShellSwitchPrefixForms("commandwithargs", "cwa"),
	...expandPowerShellSwitchForms(["cwa"])
];
const POWERSHELL_FILE_FLAGS = expandPowerShellSwitchPrefixForms("file", "f");
const POWERSHELL_INLINE_FILE_FLAGS = new Set(POWERSHELL_FILE_FLAGS);
new Set(expandPowerShellSwitchPrefixForms("noprofile", "nop"));
[
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchForms(["ea"]),
	...expandPowerShellSwitchPrefixForms("interactive", "i"),
	...expandPowerShellSwitchPrefixForms("login", "l"),
	...expandPowerShellSwitchPrefixForms("namedpipeservermode", "nam"),
	...expandPowerShellSwitchPrefixForms("noexit", "noe"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchForms(["pscf"]),
	...expandPowerShellSwitchPrefixForms("servermode", "s"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("socketservermode", "so"),
	...expandPowerShellSwitchPrefixForms("sshservermode", "ssh"),
	...expandPowerShellSwitchPrefixForms("v2socketservermode", "v2so")
];
const POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS = /* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms("encodedcommand", "e"), ...expandPowerShellSwitchPrefixForms("ec", "e")]);
const POWERSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	...POWERSHELL_COMMAND_FLAGS,
	...POWERSHELL_FILE_FLAGS,
	...POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS
]);
const POWERSHELL_INLINE_REST_COMMAND_FLAGS = new Set(POWERSHELL_COMMAND_FLAGS);
const POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchPrefixForms("executionpolicy", "ex"),
	...expandPowerShellSwitchPrefixForms("inputformat", "inp"),
	...expandPowerShellSwitchPrefixForms("outputformat", "o"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("token", "to"),
	...expandPowerShellSwitchPrefixForms("utctimestamp", "utc"),
	...expandPowerShellSwitchPrefixForms("version", "v"),
	...expandPowerShellSwitchPrefixForms("windowstyle", "w"),
	...expandPowerShellSwitchPrefixForms("workingdirectory", "w"),
	...expandPowerShellSwitchForms([
		"ea",
		"ep",
		"if",
		"of",
		"pscf",
		"wd"
	])
]);
const POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"-O",
	"-o",
	"+O",
	"+o"
]);
function countSeparateValueOptionChars(token) {
	let count = 0;
	for (let index = 1; index < token.length; index += 1) {
		const char = token[index];
		if (char === "o" || char === "O") count += 1;
	}
	return count;
}
function parseCombinedCommandFlag(token) {
	if (token.length < 2 || token[0] !== "-" || token[1] === "-") return null;
	const optionChars = token.slice(1);
	const commandFlagIndex = optionChars.indexOf("c");
	if (commandFlagIndex === -1 || optionChars.includes("-")) return null;
	const suffix = optionChars.slice(commandFlagIndex + 1);
	if (suffix && !/^[A-Za-z]+$/.test(suffix)) return {
		attachedCommand: suffix,
		separateValueCount: 0
	};
	return {
		attachedCommand: null,
		separateValueCount: countSeparateValueOptionChars(token)
	};
}
function combinedSeparateValueOptionCount(token) {
	if (token.length < 2 || token[0] !== "-" && token[0] !== "+" || token[1] === "-" || token.slice(1).includes("-")) return 0;
	return countSeparateValueOptionChars(token);
}
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
function advancePosixInlineOptionScan(token) {
	const combinedValueCount = combinedSeparateValueOptionCount(token);
	if (combinedValueCount > 0) return 1 + combinedValueCount;
	if (POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token)) return 2;
	return 1;
}
function isPowerShellOptionToken(token) {
	return token.startsWith("-") || /^\/[A-Za-z][A-Za-z0-9]*$/.test(token);
}
/** Find the inline command payload for a shell wrapper argv. */
function resolveInlineCommandMatch(argv, flags, options = {}) {
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower === "--") break;
		const comparableToken = options.allowCombinedC ? token : lower;
		const exact = flags.has(comparableToken);
		const combined = !exact && options.allowCombinedC ? parseCombinedCommandFlag(token) : null;
		if (exact || combined) {
			if (combined && combined.attachedCommand !== null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const commandIndex = i + 1 + (combined?.separateValueCount ?? 0);
			const valueTokenIndex = !combined && commandIndex >= argv.length ? null : commandIndex;
			const command = exact && options.restValueFlags?.has(comparableToken) ? argv.slice(i + 1).map((arg) => arg.trim()).join(" ").trim() : argv[commandIndex]?.trim();
			return {
				command: command ? command : null,
				valueTokenIndex
			};
		}
		if (options.valueOptions?.has(lower)) {
			i += 2;
			continue;
		}
		const isOptionToken = options.isOptionToken?.(token) ?? (token.startsWith("-") || token.startsWith("+"));
		if (options.stopAtFirstNonOption && !isOptionToken) break;
		if (options.allowCombinedC && !token.startsWith("-") && !token.startsWith("+")) break;
		i += options.allowCombinedC ? advancePosixInlineOptionScan(token) : 1;
	}
	return {
		command: null,
		valueTokenIndex: null
	};
}
/** Find the PowerShell inline command payload and value token index. */
function resolvePowerShellInlineCommandMatch(argv) {
	return resolveInlineCommandMatch(argv, POWERSHELL_INLINE_COMMAND_FLAGS, {
		isOptionToken: isPowerShellOptionToken,
		restValueFlags: POWERSHELL_INLINE_REST_COMMAND_FLAGS,
		stopAtFirstNonOption: true,
		valueOptions: POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES
	});
}
/** Return true when a PowerShell flag treats the next token as script file text. */
function isPowerShellInlineFileCommandFlag(token) {
	return POWERSHELL_INLINE_FILE_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
//#endregion
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
const OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT = [
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
/** Diagnostics attribute the final command without changing the wrapper's execution policy. */
function resolveOomScoreWrappedCommand(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && (args[1] === OOM_SCORE_WRAP_SCRIPT || args[1] === OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT) && args[2] ? args[2] : void 0;
}
//#endregion
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperations = /* @__PURE__ */ new Set([
	"repository.identities",
	"repository.branches",
	"checkout.revision",
	"checkout.context",
	"checkout.diff",
	"checkout.baseline",
	"pull-request.branch-facts",
	"worktree.snapshot",
	"worktree.cleanup",
	"worktree.provision",
	"worktree.inspect",
	"worktree.recovery",
	"workspace.inventory",
	"workspace.manifest",
	"workspace.result-cleanup",
	"project.clone",
	"session.materialize",
	"publication",
	"github.identity",
	"project.checkout",
	"update.inspect",
	"worktree.config",
	"worktree.maintenance",
	"workspace.sync",
	"workspace.result"
]);
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
const childOperation = resolveGlobalSingleton(Symbol.for("openclaw.childSpawnOperation"), () => new AsyncLocalStorage());
function unscopedProcessOperation(family, name, args) {
	if (args[0] === "--version" || args[0] === "-v" && (family === "node" || family === "bun" || name === "gh")) return "unscoped.version";
	if (family === "powershell" || family === "pwsh") {
		const argv = [name, ...args];
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(argv);
		return command !== null && valueTokenIndex !== null && !isPowerShellInlineFileCommandFlag(argv[valueTokenIndex - 1] ?? "") ? "unscoped.shell-command" : "unscoped.shell";
	}
	if (/^(sh|bash|zsh)$/.test(family)) return resolveInlineCommandMatch([name, ...args], POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "cmd") return args.some((arg) => /^-[a-z]*c$/.test(arg) || /^\/(?:c|k)$/i.test(arg)) ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "node" || family === "bun") return "unscoped.runtime";
	if (family === "other" && /^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(name)) return `unscoped.${name}`;
	return "unscoped.command";
}
function unscopedGitOperation(args) {
	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if ([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) i += 2;
		else if (/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(arg)) i++;
		else if ([
			"--no-pager",
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--literal-pathspecs",
			"--bare"
		].includes(arg)) i++;
		else break;
	}
	const command = args[i] ?? "";
	return /^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(command) ? `unscoped.${command}` : command === "--version" || command === "version" ? "unscoped.version" : "unscoped.other";
}
/** Preserve the admitted owner across retries, ref admission, and asynchronous spawn events. */
function withGitProcessOperation(operation, run, mode = "override") {
	return operation === void 0 || mode === "default" && gitOperation.getStore() !== void 0 ? run() : gitOperation.run(gitOperations.has(operation) ? operation : "unknown", run);
}
/** Capture attribution before native preparation; record only after a successful launch. */
function prepareChildProcessSpawnRecorder(command, args = [], sqliteOperation) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const wrappedCommand = resolveOomScoreWrappedCommand(command, args);
	const commandArgs = wrappedCommand ? args.slice(3) : args;
	const name = path.win32.basename(wrappedCommand ?? command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? childOperation.getStore() ?? unscopedGitOperation(commandArgs) : sqliteOperation ?? childOperation.getStore() ?? unscopedProcessOperation(family, name, commandArgs);
	const key = `${family}:${operation}`;
	return () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	};
}
/** Count admitted local and broker launches, excluding failed spawn attempts. */
function recordChildProcessSpawn(command, child, sqliteOperation, args = []) {
	const record = prepareChildProcessSpawnRecorder(command, args, sqliteOperation);
	if (record) child.once("spawn", record);
}
//#endregion
//#region src/agents/worktrees/errors.ts
var WorktreeRepositoryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorktreeRepositoryError";
		this.reason = options?.reason;
	}
};
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message, blockedByRun) {
		super(message);
		this.kind = kind;
		this.blockedByRun = blockedByRun;
		this.name = "WorktreeRemovalContentionError";
	}
};
var WorktreeRemovalLockError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalLockError";
	}
};
var SessionWorktreeSourceChangedError = class extends Error {};
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
//#endregion
export { WorktreeRepositoryError as a, getSpawnBroker as c, decodeNativeWorkerFailure as d, killProcessTree as f, WorktreeRemovalLockError as i, createSpawnBrokerHost as l, truncateUtf8Suffix as m, SessionWorktreeSourceChangedError as n, recordChildProcessSpawn as o, BrokerChild as p, WorktreeRemovalContentionError as r, withGitProcessOperation as s, SessionWorktreeLifecycleError as t, BrokerNativeResourceCloseError as u };

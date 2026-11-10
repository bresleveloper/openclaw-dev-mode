import { L as resolveIdentityPathViaExistingAncestorSync, Q as resolveTimerTimeoutMs, at as toErrorObject, d as hasInternalDiagnosticEventInterest, gt as normalizeLowercaseStringOrEmpty, ht as stripAnsi, o as emitTrustedDiagnosticEvent, p as redactToolPayloadText, pt as resolveGlobalSingleton, rt as extractErrorCode, wt as isRecord } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { lt as hasNodeErrorCode } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { Et as trackSqliteDatabaseAdmissionWorker, Ht as createDeferredCore, Nt as stageSqliteTransactionState, P as currentSqliteOperationTiming, St as retainSqliteDatabaseAdmissionLocation, Ut as runInDetachedAsyncContext, V as captureSqliteWorkerEnvironmentData, W as parseDiagnosticEnvFlags, kn as isPromiseLike, on as createSqliteDatabaseAdmissionCursor, pt as prepareSqliteDatabaseAdmission, rt as captureSqliteDatabaseAdmissions, sn as readSqliteDatabaseAdmissions, ut as installSqliteDatabaseAdmissions, xn as sqlPublicationAnchor } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { a as runtimeProcessEntrypoints } from "./sqlite-readonly-runtime-binary-aVOs5Y3K.mjs";
import { A as resolveRuntimeProcessEntrypointUrl, C as markWorkerRetirement, D as recordWorkerMessage, E as observeWorkerMessage, Et as runWithMainThreadTask, M as resolveRuntimeWorkerThreadExecArgv, N as resolveRuntimeWorkerUrl, O as workerMessagePayloadBytes, S as createCpuTrackedWorker, T as trackNativeWorkerForCpu, at as isPidDefinitelyDead, c as createLazyRuntimeModule, it as getProcessInstanceStartTime, j as resolveRuntimeWorkerArgv, k as captureRuntimeWorkerSource, kn as createRetainedOperation, w as receiveWorkerMemoryPort, x as attributeWorkerToPool, y as StateDatabaseAdmissionPendingError } from "./sqlite-readonly-location.worker.js";
import path, { basename, join } from "node:path";
import { setImmediate as setImmediate$1, setTimeout as setTimeout$1 } from "node:timers/promises";
import { deserialize, serialize } from "node:v8";
import { randomBytes } from "node:crypto";
import { accessSync, chmodSync, constants, mkdtempSync, opendirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { availableParallelism, tmpdir } from "node:os";
import { MessageChannel, MessagePort, SHARE_ENV, receiveMessageOnPort } from "node:worker_threads";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { Buffer as Buffer$1 } from "node:buffer";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { EventEmitter } from "node:events";
import { readProcessIdentity } from "@openclaw/proc-safe/identity";
import "node:util/types";
import { Socket } from "node:net";
import { listProcesses } from "@openclaw/proc-safe/inspect";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Normalizes string entries and lowercases each retained value. */
function normalizeStringEntriesLower(list) {
	return normalizeStringEntries(list).map((entry) => entry.toLowerCase());
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntriesLower(values) {
	return uniqueStrings(normalizeStringEntriesLower(values ? [...values] : void 0));
}
//#endregion
//#region src/infra/worker-pool-sizing.ts
function resolveWorkerComputeLimit() {
	return Math.max(1, availableParallelism() - 1);
}
/** Size once at pool creation; serial owners must never inherit host CPU fanout. */
function resolveWorkerPoolSize(kind) {
	return Math.min(kind === "reader" || kind === "file-reader" ? 2 : kind === "compute" ? 4 : 1, resolveWorkerComputeLimit());
}
function resolveStateReadWorkerCount() {
	return Math.max(2, resolveWorkerPoolSize("reader"));
}
function resolveSqliteBrokerWorkerCount() {
	return 2;
}
resolveWorkerPoolSize("reader");
//#endregion
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
const readers$1 = /* @__PURE__ */ new WeakMap();
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
	readers$1.set(socket, held);
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
	const held = readers$1.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers$1.delete(socket);
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
//#region src/process/darwin-process-inspection.ts
var DarwinProcessInspectionError = class extends Error {
	constructor(reason, options) {
		super(`Darwin process inspection ${reason}`, options);
		this.reason = reason;
		this.name = "DarwinProcessInspectionError";
		this.code = reason === "deadline" ? "ETIMEDOUT" : reason === "permission" ? "EPERM" : "EIO";
	}
};
function failure(cause) {
	if (cause instanceof DarwinProcessInspectionError) return cause;
	const code = cause && typeof cause === "object" && "code" in cause ? cause.code : void 0;
	return new DarwinProcessInspectionError(code === "ETIMEDOUT" || code === "ABORT_ERR" || code === "timeout" ? "deadline" : [
		"EACCES",
		"EPERM",
		"ERR_ACCESS_DENIED",
		"access-denied"
	].includes(String(code)) ? "permission" : "unavailable", { cause });
}
function remaining(deadline) {
	const ms = Math.floor(deadline - performance.now());
	if (ms <= 0) throw new DarwinProcessInspectionError("deadline");
	return ms;
}
const states = {
	running: "R",
	sleeping: "S",
	stopped: "T",
	zombie: "Z",
	idle: "I",
	unknown: "?"
};
function hasReadableTopology(row) {
	if (row.parentPid === void 0 || row.processGroupId === void 0 || row.state === void 0) {
		if (readProcessIdentity(row.pid) === null) return false;
		throw new DarwinProcessInspectionError("unavailable");
	}
	return true;
}
function topology(row) {
	return {
		pid: row.pid,
		ppid: row.parentPid,
		pgid: row.processGroupId,
		state: states[row.state],
		owner: row.owner
	};
}
function census(deadline, pids) {
	try {
		const rows = listProcesses({
			timeoutMs: remaining(deadline),
			...pids ? { pids } : {}
		}).filter(hasReadableTopology);
		remaining(deadline);
		return rows;
	} catch (cause) {
		remaining(deadline);
		throw failure(cause);
	}
}
/** Synchronous census for the process-group cleanup worker, without spawning ps. */
function* readDarwinProcessCensus(timeoutMs) {
	const deadline = performance.now() + timeoutMs;
	const rows = census(deadline).map(topology);
	for (const row of rows) {
		remaining(deadline);
		yield row;
	}
	remaining(deadline);
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
function readLinuxProcessUid(pid) {
	try {
		const lines = readFileSync(`/proc/${pid}/status`, "utf8").split("\n").filter((line) => line.startsWith("Uid:"));
		const ids = (lines.length === 1 ? /^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(lines[0]) : null)?.slice(1).map(Number);
		const inspectorUid = process.getuid?.();
		return ids?.every((uid) => Number.isSafeInteger(uid) && uid <= 4294967295) ? ids.find((uid) => uid === inspectorUid) ?? ids[0] : void 0;
	} catch {
		return;
	}
}
/** The caller supplies command inspection; group cleanup only reads native topology. */
function* readProcessGroupMembers(timeoutMs, commandInspection) {
	const includeCommand = commandInspection !== void 0;
	if (process.platform === "linux") {
		const startedAt = Date.now();
		const deadline = startedAt + timeoutMs;
		for (const name of readdirSync("/proc")) {
			if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			if (!/^\d+$/.test(name)) continue;
			const pid = Number(name);
			let stat;
			let argv;
			let uid;
			let opaqueForeignOwner = false;
			try {
				stat = readFileSync(`/proc/${name}/stat`, "utf8");
				if (includeCommand) {
					uid = readLinuxProcessUid(pid);
					try {
						argv = readFileSync(`/proc/${name}/cmdline`, "utf8").split("\0").filter(Boolean);
					} catch (error) {
						const inspectorUid = process.getuid?.();
						opaqueForeignOwner = uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid && ["EACCES", "EPERM"].includes(extractErrorCode(error) ?? "");
						if (!opaqueForeignOwner) throw error;
					}
				}
			} catch (error) {
				if (pid !== process.pid && ["ENOENT", "ESRCH"].includes(extractErrorCode(error) ?? "")) continue;
				throw new Error(`Could not classify PID ${pid}: process command inspection failed (${extractErrorCode(error) ?? "unavailable"}).`, { cause: error });
			}
			const match = /^(\d+) \([\s\S]*\) (\S) (\d+) (\d+)(?:\s|$)/.exec(stat);
			if (!match) throw new Error(`Process group census is unavailable: malformed stat for PID ${pid}`);
			if (Number(match[1]) !== pid) throw new Error(`Process group census is unavailable: stat PID mismatch for PID ${pid} (stat PID=${Number(match[1])})`);
			const now = Date.now();
			if (now >= deadline) throw new Error(`Process group census exceeded its deadline after reading PID ${pid} (elapsed=${now - startedAt}ms, budget=${timeoutMs}ms)`);
			if (argv?.length === 0) {
				const flags = Number(stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[6]);
				if (!(Number.isInteger(flags) && (flags & 2097152) !== 0) && !isPidDefinitelyDead(pid)) {
					const inspectorUid = process.getuid?.();
					if (uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid) {
						opaqueForeignOwner = true;
						argv = void 0;
					} else throw new Error(`Could not classify PID ${pid}: live userspace process has no readable arguments.`);
				}
			}
			yield {
				pid,
				pgid: Number(match[4]),
				state: match[2],
				...argv ? { command: {
					ppid: Number(match[3]),
					argv,
					...uid === void 0 ? {} : { uid }
				} } : opaqueForeignOwner && uid !== void 0 ? { command: {
					ppid: Number(match[3]),
					argvUnavailable: true,
					uid
				} } : {}
			};
		}
		if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
		return;
	}
	if (process.platform === "darwin") {
		for (const member of readDarwinProcessCensus(timeoutMs)) {
			const command = includeCommand ? member.state.startsWith("Z") || member.pid === 0 ? { argv: [] } : commandInspection?.readDarwinCommand(member.pid, member.owner) : void 0;
			if (includeCommand && !command) continue;
			yield {
				pid: member.pid,
				pgid: member.pgid,
				state: member.state,
				...command ? { command: {
					ppid: member.ppid,
					owner: member.owner,
					...command
				} } : {}
			};
		}
		return;
	}
	if (includeCommand) throw new Error(`Exact process command census is unavailable on ${process.platform}.`);
	const deadline = Date.now() + timeoutMs;
	const census = spawnSync("/bin/ps", [
		"-A",
		"-o",
		"pid=,pgid=,stat="
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		maxBuffer: 4194304
	});
	if (census.error || census.status !== 0) throw new Error("Process group census is unavailable");
	for (const line of census.stdout.split("\n")) {
		if (!line.trim()) continue;
		const match = /^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(line);
		if (!match) throw new Error("Process group census is unavailable");
		const pid = Number(match[1]);
		if (pid !== census.pid) yield {
			pid,
			pgid: Number(match[2]),
			state: match[3]
		};
	}
	if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
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
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
/** A deleted agent's database stays closed in this isolate until the roster admits the agent again. */
function isDeletedAgentDatabasePath(pathname) {
	return readers.deleted.has(path.resolve(pathname));
}
/** Task admission carries the parent owner's current fences into every worker generation. */
function captureDeletedAgentDatabaseFences() {
	return [...readers.deleted];
}
//#endregion
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
	const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
	const envFlags = parseDiagnosticEnvFlags(env[DIAGNOSTICS_ENV]);
	if (envFlags.disablesAll) return [];
	return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
	const enabledFlags = resolveDiagnosticFlags(cfg, env);
	const target = normalizeLowercaseStringOrEmpty(flag);
	if (!target) return false;
	for (const enabled of enabledFlags) {
		if (enabled === "*" || enabled === "all" || enabled === target) return true;
		if (enabled.endsWith(".*") && target === enabled.slice(0, -2)) return true;
		if (enabled.endsWith("*") && target.startsWith(enabled.slice(0, -1))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/sqlite-worker-request-class.ts
const operations = [
	"admit",
	"audit.events.list",
	"audit.writer.process",
	"audit.writer.prune",
	"database.domain.bind",
	"database.domain.close",
	"database.domain.publish",
	"database.inspectIdle",
	"database.prepareWrite",
	"database.walMaintenance",
	"stateLease.acquire",
	"stateLease.release",
	"stateLease.renew",
	"stateLease.verify"
];
const families = [
	"acp",
	"acpSessions",
	"agentDatabaseDeletion",
	"agentDatabaseRegistry",
	"agentDatabases",
	"agentDeletionJournal",
	"agentProvenance",
	"apns",
	"audit",
	"authProfiles",
	"backup",
	"bootstrap",
	"capture",
	"channelIngress",
	"clawProvenance",
	"claws",
	"config",
	"conversation",
	"conversationBindings",
	"database",
	"deliveryQueue",
	"deviceAuth",
	"deviceIdentity",
	"devicePairing",
	"diagnostic",
	"doctor",
	"exec-approvals",
	"execApprovals",
	"generatedHtmlProvenance",
	"githubPublication",
	"githubRepository",
	"legacyMcpOAuth",
	"localWorkspace",
	"managedImages",
	"mcpOAuth",
	"mentions",
	"modelCatalog",
	"nativeHookRelay",
	"node",
	"nodeHost",
	"nodeWorker",
	"onboardingRecommendations",
	"operator",
	"operatorApprovals",
	"pairing",
	"placementJournals",
	"placementTools",
	"placementTranscript",
	"placementTurns",
	"pluginBlob",
	"pluginModelCatalogCredentials",
	"plugins",
	"preparedPoolPresence",
	"projects",
	"promotions",
	"repositoryWorkspaces",
	"restartSentinel",
	"sandboxRegistry",
	"secrets",
	"sessionDelivery",
	"sessionGroups",
	"sessionRepositoryWorkspaces",
	"sessionState",
	"sessionUpstream",
	"skillLibrary",
	"skillUploads",
	"skills",
	"stateLease",
	"subagents",
	"telemetry",
	"tts",
	"tui",
	"updateRuns",
	"usageCache",
	"userModelAccounts",
	"userPreferences",
	"userProfiles",
	"webPush",
	"workerEnvironments",
	"workerInference",
	"workerPlacements",
	"workers",
	"workspace",
	"workshop",
	"worktrees"
];
const sqliteWorkerRequestClasses = /* @__PURE__ */ new Set([...operations, ...families]);
function classifySqliteWorkerExecute(commandType) {
	if (sqliteWorkerRequestClasses.has(commandType)) return commandType;
	const separator = commandType.indexOf(".");
	const family = separator === -1 ? commandType : commandType.slice(0, separator);
	return sqliteWorkerRequestClasses.has(family) ? family : "execute";
}
//#endregion
//#region src/infra/worker-request-diagnostics.ts
const reservations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerReservationObservation"), () => new AsyncLocalStorage());
function withSqliteWorkerReservationObservation(observation, run) {
	return reservations.run(observation, run);
}
const detailedTiming = isDiagnosticFlagEnabled("sqlite.worker-timing");
const coreCommands = /* @__PURE__ */ new Set([
	"session.actor.read",
	"session.actor.acceptInput",
	"session.actor.adoptRun",
	"session.actor.appendToolResult",
	"session.actor.appendTranscriptEvent",
	"session.actor.completeTurn",
	"session.actor.deliveryPending",
	"session.actor.deliverySettled",
	"session.actor.patch",
	"session.entry.read",
	"session.entry.patch.prepare",
	"session.entry.patch.commit",
	"session.entry.replacements.prepare",
	"session.entry.replacements.commit",
	"session.lifecycle.project",
	"session.maintenance.metadata",
	"session.maintenance.prepare",
	"session.maintenance.release",
	"session.maintenance.finalize",
	"session.maintenance.size",
	"session.rowTranscript.backfill",
	"usageCache.writeRollup",
	"usageCache.prune",
	"trajectory.events.append",
	"trajectory.retention.begin",
	"trajectory.retention.delete",
	"session.pendingInputs.read",
	"session.pendingInputs.mutate",
	"session.turn.prepare",
	"session.turn.commit",
	"transcript.prepare",
	"transcript.commit"
]);
const projectionCommands = /* @__PURE__ */ new Map([
	["preflight", "transcript-projection.preflight"],
	["sweep", "transcript-projection.sweep"],
	["claim", "transcript-projection.claim"],
	["deleteChunk", "transcript-projection.deleteChunk"],
	["appendChunk", "transcript-projection.appendChunk"],
	["finalize", "transcript-projection.finalize"]
]);
const projectionModuleSuffixes = ["/config/sessions/session-transcript-projection-publication.worker.js", "/config/sessions/session-transcript-projection-publication.worker.ts"];
const requestPrefixes = [
	["pluginState.", "plugin_state"],
	["session.history.", "transcript_read"],
	["trajectory.", "transcripts"],
	["session.transcript.", "transcripts"],
	["transcripts.", "transcripts"],
	["session.", "sessions"],
	["cron.", "cron"]
];
function classifyWorkerRequest(commandType, commandInput) {
	if (typeof commandType !== "string") return "execute";
	if (coreCommands.has(commandType)) return commandType;
	if (commandType === "auth-profile-rows") return "auth_profiles";
	if (commandType === "database.domain.execute" || commandType === "database.domain.publish") {
		const publication = isRecord(commandInput) ? commandInput : void 0;
		const inner = publication && isRecord(publication.command) ? publication.command : void 0;
		const moduleUrl = publication?.moduleUrl;
		if (commandType === "database.domain.publish" && typeof moduleUrl === "string" && typeof inner?.type === "string" && projectionModuleSuffixes.some((suffix) => moduleUrl.endsWith(suffix))) {
			const projection = projectionCommands.get(inner.type);
			if (projection) return projection;
		}
		const label = inner ? classifyWorkerRequest(inner.type) : "execute";
		return label === "execute" ? "domain_execute" : label;
	}
	for (const [prefix, requestClass] of requestPrefixes) if (commandType.startsWith(prefix)) return requestClass;
	return classifySqliteWorkerExecute(commandType);
}
const queued = resolveGlobalSingleton(Symbol.for("openclaw.workerRequestQueueDepth"), () => /* @__PURE__ */ new Map());
const requestClasses = /* @__PURE__ */ new Set([
	...coreCommands,
	...projectionCommands.values(),
	...sqliteWorkerRequestClasses,
	...requestPrefixes.map(([, requestClass]) => requestClass),
	"task",
	"open",
	"close",
	"execute",
	"domain_execute",
	"auth_profiles"
]);
/** One observation follows a request across admission retries and cancellation. */
function trackWorkerRequest(kind, requestClass, queuedSignal) {
	const label = requestClasses.has(requestClass) ? requestClass : "other";
	const reservation = kind === "sqlite_writer" ? reservations.getStore() : void 0;
	const enqueuedAt = performance.now();
	const timing = kind === "sqlite_writer" && (detailedTiming || hasInternalDiagnosticEventInterest("worker.request")) ? { enqueued: enqueuedAt } : void 0;
	let startedAt;
	let completed = false;
	const emit = (phase, durations = {}) => {
		if (!hasInternalDiagnosticEventInterest("worker.request")) return;
		emitTrustedDiagnosticEvent({
			type: "worker.request",
			kind,
			requestClass: label,
			phase,
			queueDepth: queued.get(kind) ?? 0,
			...durations,
			...phase === "completed" && timing ? { timing } : {}
		});
	};
	const dequeue = () => queued.set(kind, (queued.get(kind) ?? 0) - 1);
	queued.set(kind, (queued.get(kind) ?? 0) + 1);
	emit("queued");
	const observation = {
		timing,
		...reservation ? { recordTransactions: (count) => {
			reservation.transactionCount = (reservation.transactionCount ?? 0) + count;
		} } : {},
		started: () => {
			if (completed || startedAt !== void 0) return;
			startedAt = performance.now();
			if (reservation) reservation.operations.add(reservation.operations.has(label) || reservation.operations.size < 8 ? label : "other");
			if (timing) timing.dispatched = startedAt;
			queuedSignal?.removeEventListener("abort", observation.completed);
			dequeue();
			emit("started", { queueWaitMs: startedAt - enqueuedAt });
		},
		completed: () => {
			if (completed) return;
			completed = true;
			queuedSignal?.removeEventListener("abort", observation.completed);
			if (startedAt === void 0) dequeue();
			emit("completed", startedAt === void 0 ? {} : { durationMs: performance.now() - startedAt });
		}
	};
	queuedSignal?.addEventListener("abort", observation.completed, { once: true });
	if (queuedSignal?.aborted) observation.completed();
	return observation;
}
//#endregion
//#region src/infra/worker-native-resource.ts
/** Binds the host's original cleanup port to the same surviving spawn-owner claim. */
function bindNativeWorkerResource(options) {
	const { broker, descriptor, connection } = options;
	let disposed = false;
	const lease = broker.captureNativeResource({
		moduleUrl: descriptor.moduleUrl,
		input: descriptor.input,
		ownerPort: Boolean(connection)
	}, {
		message(response) {
			if (response.type === "resource-owner") connection?.port.postMessage(response.value, []);
			else if (response.type === "resource-closed") options.closed();
		},
		failed: (error) => options.failed(error)
	});
	const forward = (value) => {
		if (disposed) return;
		try {
			const delivery = lease.ownerMessage(value);
			if (options.supervisorAvailable()) options.postOwnerMessage(value, delivery.sequence);
		} catch (error) {
			options.failed(toErrorObject(error, "Native resource owner delivery failed"));
		}
	};
	connection?.port.on("message", forward);
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		connection?.port.off("message", forward);
		connection?.port.close();
		connection?.dispose();
	};
	return {
		attachment: lease.attachment,
		receive(response) {
			lease.receive(response);
		},
		service() {
			if (disposed || !connection) return;
			connection.service();
			for (;;) {
				const next = receiveMessageOnPort(connection.port);
				if (!next) break;
				forward(next.message);
			}
		},
		async closeAfterSupervisor() {
			try {
				await broker.sealNativeResources();
				await lease.close();
			} catch (error) {
				if (error instanceof BrokerNativeResourceCloseError && connection?.decodeCloseError) throw connection.decodeCloseError(error.payload);
				throw error;
			}
		},
		release() {
			lease.release();
			dispose();
		},
		abandonUnattached() {
			lease.abandonUnattached();
			dispose();
		}
	};
}
//#endregion
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
livePort.stack = void 0;
const portValidation = { get value() {
	throw livePort;
} };
function nativePortIsOpen(port) {
	if (process.versions.bun) {
		const referenced = port.hasRef();
		port.unref();
		port.ref();
		const open = port.hasRef();
		if (!referenced) port.unref();
		return open;
	}
	try {
		structuredClone(portValidation, { transfer: [port] });
	} catch (error) {
		if (error === livePort) return true;
		if (error instanceof DOMException && error.name === "DataCloneError") return false;
		throw error;
	}
	throw new Error("Native port validation did not abort serialization");
}
//#endregion
//#region src/infra/worker-native-task-port.ts
/** The task endpoint owns delivery only; its close never proves native execution stopped. */
var NativeWorkerTaskPort = class {
	constructor(port, callbacks) {
		this.port = port;
		this.callbacks = callbacks;
		this.pending = [];
		this.started = false;
		this.disposed = false;
		this.portClosed = false;
		this.receive = (value) => {
			observeWorkerMessage(value, "from_worker");
			this.pending.push({
				type: "message",
				value
			});
			this.drain();
		};
		this.receiveError = (error) => {
			this.pending.push({
				type: "messageerror",
				error
			});
			this.drain();
		};
		this.closed = () => {
			this.portClosed = true;
			this.drain();
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		};
		port.on("message", this.receive);
		port.on("messageerror", this.receiveError);
		port.on("close", this.closed);
		port.unref();
	}
	fail(error) {
		if (this.disposed || this.failure) return;
		this.failure = error;
		this.callbacks.unavailable();
	}
	start() {
		this.started = true;
	}
	/** Startup admission gates data even when the control owner has already failed. */
	drain() {
		if (this.disposed || !this.started) return;
		for (;;) {
			const buffered = this.pending.shift();
			if (buffered) {
				if (buffered.type === "message") this.callbacks.message(buffered.value);
				else this.callbacks.messageerror(buffered.error);
			} else {
				if (this.portClosed || this.failure) return;
				let next;
				try {
					next = runWithMainThreadTask("worker:message-decode", () => receiveMessageOnPort(this.port));
				} catch (error) {
					this.fail(toErrorObject(error, "Native worker task channel observation failed"));
					return;
				}
				if (!next) return;
				observeWorkerMessage(next.message, "from_worker");
				this.callbacks.message(next.message);
			}
			if (this.disposed) return;
		}
	}
	service() {
		this.drain();
		if (this.disposed || this.failure) return;
		if (this.portClosed) {
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
			return;
		}
		let open;
		try {
			open = nativePortIsOpen(this.port);
		} catch (error) {
			this.fail(toErrorObject(error, "Native worker task channel observation failed"));
			return;
		}
		if (!open) {
			this.portClosed = true;
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		}
	}
	assertAvailable() {
		if (this.failure) throw this.failure;
		if (this.disposed || this.portClosed) throw new Error("Native worker task channel is closed");
	}
	postMessage(value, transferList) {
		this.assertAvailable();
		const bytes = workerMessagePayloadBytes(value);
		this.port.postMessage(value, [...transferList]);
		observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
	}
	close() {
		if (this.disposed) return;
		this.disposed = true;
		this.pending.length = 0;
		this.port.off("message", this.receive);
		this.port.off("messageerror", this.receiveError);
		this.port.off("close", this.closed);
		this.port.close();
	}
};
//#endregion
//#region src/infra/worker-request-kind.ts
const standaloneKinds = {
	"catalog-page.worker.js": "catalog",
	"code-mode.worker.js": "codeMode",
	"disk-budget.worker.js": "diskBudget",
	"document-extractor.worker.js": "document",
	"manager-index.worker.js": "memoryIndex",
	"manager-search.worker.js": "memorySearch",
	"memory-index.worker.js": "memoryIndex",
	"memory-search.worker.js": "memorySearch",
	"run.worker.js": "teamReports",
	"session-history.worker.js": "sessionHistory"
};
const kinds = new Map([...Object.entries(runtimeProcessEntrypoints).map(([kind, entry]) => [basename(entry.distWorkerPath), kind]), ...Object.entries(standaloneKinds)]);
/** SDK callers may supply their own workers; never publish arbitrary paths as labels. */
function workerRequestKind(url) {
	return kinds.get(basename(url.pathname).replace(/\.(?:ts|mjs)$/, ".js")) ?? "extension";
}
//#endregion
//#region src/infra/worker-native-handle.ts
var NativeWorker = class extends EventEmitter {
	constructor(runtime, id, filename, evalSource, ownsNativeResource, resourceConnection, taskPort) {
		super();
		this.runtime = runtime;
		this.id = id;
		this.filename = filename;
		this.evalSource = evalSource;
		this.ownsNativeResource = ownsNativeResource;
		this.resourceConnection = resourceConnection;
		this.runInContext = AsyncLocalStorage.snapshot();
		this.threadId = 0;
		this.started = false;
		this.executionStopped = false;
		this.referenced = true;
		this.stopping = false;
		this.joined = false;
		this.servicingResource = false;
		this.resourceClosed = false;
		this.supervisorJoined = false;
		this.terminalObserved = false;
		this.taskPortLossReported = false;
		this.requestId = 0;
		this.stopCompletion = createRetainedOperation(() => this.service());
		this.cpuRequests = /* @__PURE__ */ new Map();
		this.heapRequests = /* @__PURE__ */ new Map();
		this.diagnosticName = `worker:${!evalSource && filename instanceof URL ? workerRequestKind(filename) : "other"}`;
		if (taskPort) this.taskPort = new NativeWorkerTaskPort(taskPort, {
			message: (value) => this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => this.emit("message", value))),
			messageerror: (error) => this.runInContext(() => this.emit("messageerror", error)),
			unavailable: () => this.observeTaskPortLoss()
		});
	}
	get needsReference() {
		return this.referenced || this.stopping || this.executionStopped && this.ownsNativeResource && !this.joined || this.cpuRequests.size > 0 || this.heapRequests.size > 0;
	}
	service() {
		this.runtime.service();
	}
	serviceTaskPort() {
		const taskPort = this.taskPort;
		if (!taskPort) return;
		runWithMainThreadTask(this.diagnosticName, () => taskPort.service());
		this.observeTaskPortLoss();
	}
	observeTaskPortLoss() {
		const failure = this.taskPort?.failure;
		if (!failure || !this.started || !this.referenced || this.taskPortLossReported || this.terminalObserved || this.stopping || this.joined || this.executionStopped || this.runtime.failure) return;
		this.taskPortLossReported = true;
		this.runInContext(() => this.emit("error", failure));
	}
	serviceResource() {
		if (!this.resourceBinding || this.servicingResource || this.joined) return;
		this.servicingResource = true;
		try {
			this.resourceBinding.service();
		} catch (error) {
			this.resourceFailed(error);
		} finally {
			this.servicingResource = false;
		}
	}
	attachResource(descriptor) {
		this.resourceBinding = bindNativeWorkerResource({
			broker: this.runtime.resourceBroker(),
			descriptor,
			connection: this.resourceConnection,
			supervisorAvailable: () => !this.runtime.failure,
			postOwnerMessage: (value, sequence) => this.runtime.post({
				type: "resource-owner",
				id: this.id,
				sequence,
				value
			}),
			closed: () => this.runInContext(() => {
				this.resourceClosed = true;
				if (this.supervisorJoined) this.finishJoined(void 0);
			}),
			failed: (error) => this.resourceFailed(error)
		});
		return {
			workerDataKey: descriptor.workerDataKey,
			attachment: this.resourceBinding.attachment
		};
	}
	abandonResource() {
		this.taskPort?.close();
		if (this.resourceBinding) this.resourceBinding.abandonUnattached();
		else this.resourceConnection?.dispose();
	}
	resourceFailed(error) {
		this.runInContext(() => {
			this.stopCompletion.reject(error);
			this.emit("error", toErrorObject(error, "Native resource observation failed"));
		});
	}
	recoverResource() {
		if (!this.resourceBinding || this.joined || this.resourceRecovery) return;
		const recovery = this.resourceBinding.closeAfterSupervisor();
		this.resourceRecovery = recovery;
		recovery.then(() => this.runInContext(() => {
			this.finishJoined(void 0);
		}), (error) => this.runInContext(() => {
			this.stopping = false;
			this.stopCompletion.reject(error);
		}));
	}
	postMessage(value, transferList = []) {
		if (this.joined || this.stopping || this.executionStopped) throw new Error("Native worker is closing");
		if (this.runtime.failure) throw this.runtime.failure;
		if (this.taskPort) {
			this.taskPort.postMessage(value, transferList);
			return;
		}
		this.runtime.post({
			type: "post",
			id: this.id,
			value,
			transferList: [...transferList]
		}, transferList);
	}
	ref() {
		if (this.runtime.failure) throw this.runtime.failure;
		this.taskPort?.assertAvailable();
		if (!this.referenced) {
			this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: true
			});
			this.referenced = true;
		}
		this.runtime.refreshReference();
		return this;
	}
	unref() {
		const wasReferenced = this.referenced;
		this.referenced = false;
		if (!this.joined) {
			if (this.runtime.failure) throw this.runtime.failure;
			if (wasReferenced) this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: false
			});
		}
		this.runtime.refreshReference();
		return this;
	}
	stop() {
		if (this.joined) {
			if (this.stopCompletion.operation.read().status !== "fulfilled") {
				this.stopCompletion = createRetainedOperation(() => this.service());
				this.stopCompletion.resolve();
			}
			return this.stopCompletion.operation;
		}
		if (this.stopCompletion.operation.read().status === "rejected") this.stopCompletion = createRetainedOperation(() => this.service());
		if (this.supervisorJoined && this.resourceBinding) {
			this.stopCompletion.reject(new Error("Native resource cleanup is still retained after supervisor loss", { cause: this.runtime.failure }));
			this.recoverResource();
			return this.stopCompletion.operation;
		}
		if (!this.stopping) {
			this.stopping = true;
			try {
				this.runtime.post({
					type: "stop",
					id: this.id
				});
			} catch (error) {
				this.stopping = false;
				this.stopCompletion.reject(error);
			}
			this.runtime.refreshReference();
		}
		return this.stopCompletion.operation;
	}
	terminate() {
		return this.stop().result;
	}
	cpuUsage(previous) {
		return this.requestSample(this.cpuRequests, {
			type: "cpu",
			previous
		});
	}
	getHeapStatistics() {
		return this.requestSample(this.heapRequests, { type: "heap" });
	}
	requestSample(requests, request) {
		if (this.joined) return Promise.reject(/* @__PURE__ */ new Error("Native worker exited"));
		const pending = createRetainedOperation(() => this.service());
		const requestId = ++this.requestId;
		requests.set(requestId, pending);
		try {
			this.runtime.post({
				...request,
				id: this.id,
				requestId
			});
		} catch (error) {
			requests.delete(requestId);
			pending.reject(error);
		}
		this.runtime.refreshReference();
		return pending.operation.result;
	}
	rejectSamples(error) {
		for (const pending of [...this.cpuRequests.values(), ...this.heapRequests.values()]) pending.reject(error);
		this.cpuRequests.clear();
		this.heapRequests.clear();
	}
	ownerFailed(error) {
		this.runInContext(() => {
			this.taskPort?.close();
			this.stopping = false;
			this.rejectSamples(error);
			this.stopCompletion.reject(error);
			this.emit("error", error);
		});
	}
	ownerJoined(error) {
		this.runInContext(() => {
			this.stopping = false;
			this.supervisorJoined = true;
			this.rejectSamples(error);
			this.finishExecution(void 0);
			if (this.ownsNativeResource) {
				if (this.resourceClosed) {
					this.finishJoined(void 0);
					return;
				}
				this.stopCompletion.reject(new Error("Native resource cleanup outcome is unavailable after owner loss", { cause: error }));
				this.recoverResource();
				return;
			}
			this.finishJoined(void 0);
		});
	}
	finishJoined(code) {
		if (this.joined) return;
		this.joined = true;
		this.taskPort?.close();
		this.threadId = -1;
		this.stopping = false;
		this.referenced = false;
		this.rejectSamples(/* @__PURE__ */ new Error("Native worker exited"));
		this.stopCompletion.resolve();
		this.runtime.handles.delete(this.id);
		if (!this.runtime.failure) this.runtime.post({
			type: "release",
			id: this.id
		});
		this.runtime.refreshReference();
		if (this.resourceBinding) this.resourceBinding.release();
		else this.resourceConnection?.dispose();
		this.finishExecution(code);
		this.emit("exit", code);
	}
	finishExecution(code) {
		if (!this.executionStopped) {
			this.taskPort?.close();
			this.executionStopped = true;
			this.emit("execution-exit", code);
		}
	}
	receive(reply) {
		this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => {
			if (reply.type === "error" || reply.type === "messageerror" || reply.type === "create-error" || reply.type === "execution-exit" || reply.type === "stopped" || reply.type === "stop-error") {
				this.terminalObserved = true;
				this.taskPort?.drain();
			}
			this.receiveOwned(reply);
		}));
	}
	receiveOwned(reply) {
		if (reply.type === "created") {
			this.started = true;
			this.threadId = reply.threadId;
			trackNativeWorkerForCpu(this, this.filename, this.evalSource);
			this.taskPort?.start();
			this.emit("started");
			this.taskPort?.drain();
			this.observeTaskPortLoss();
		} else if (reply.type === "message") this.emit("message", reply.value);
		else if (reply.type === "resource-message") this.resourceBinding?.receive(reply.response);
		else if (reply.type === "error" || reply.type === "messageerror") this.emit(reply.type, toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker failed"));
		else if (reply.type === "create-error") {
			this.joined = true;
			this.threadId = -1;
			this.referenced = false;
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker creation failed");
			this.rejectSamples(error);
			this.stopCompletion.resolve();
			this.runtime.handles.delete(this.id);
			this.runtime.refreshReference();
			this.abandonResource();
			this.emit("error", error);
		} else if (reply.type === "stopped") this.finishJoined(reply.code);
		else if (reply.type === "execution-exit") this.finishExecution(reply.code);
		else if (reply.type === "stop-error") {
			const requestedStop = this.stopping;
			this.stopping = false;
			let error;
			try {
				if (reply.resourceError) {
					if (!this.resourceConnection?.decodeCloseError) throw new Error("Native resource cleanup error decoder is unavailable", { cause: reply.error });
					error = this.resourceConnection.decodeCloseError(reply.error);
				} else error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker stop failed");
			} catch (decodeError) {
				error = toErrorObject(decodeError, "Native resource cleanup error decoding failed");
			}
			this.stopCompletion.reject(error);
			if (!requestedStop) this.emit("error", error);
		} else if (reply.type === "cpu") {
			this.cpuRequests.get(reply.requestId)?.resolve(reply.value);
			this.cpuRequests.delete(reply.requestId);
		} else if (reply.type === "heap") {
			this.heapRequests.get(reply.requestId)?.resolve(reply.value);
			this.heapRequests.delete(reply.requestId);
		} else if (reply.type === "request-error") {
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker observation failed");
			this.cpuRequests.get(reply.requestId)?.reject(error);
			this.heapRequests.get(reply.requestId)?.reject(error);
			this.cpuRequests.delete(reply.requestId);
			this.heapRequests.delete(reply.requestId);
		}
		this.runtime.refreshReference();
	}
};
//#endregion
//#region src/infra/worker-native-lifecycle.ts
const lifetime = resolveGlobalSingleton(Symbol.for("openclaw.nativeWorkerLifetimes"), () => ({
	nextId: 0,
	sources: /* @__PURE__ */ new WeakMap()
}), closeDefaultRetainedNativeWorkerSource);
/** Terminal process cleanup joins the existing unbound owner without starting another. */
async function closeDefaultRetainedNativeWorkerSource() {
	await lifetime.defaultSource?.close();
}
function forgetNativeSource(source) {
	if (source.runtimeGeneration) {
		if (lifetime.sources.get(source.runtimeGeneration) === source) lifetime.sources.delete(source.runtimeGeneration);
	} else if (lifetime.defaultSource === source) lifetime.defaultSource = void 0;
}
function nativeCleanupFailures(results) {
	return results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
}
function nativeRuntime(source) {
	if (source.closing) throw new Error("Native worker source is closing");
	const existing = source.runtime;
	if (existing) {
		if (existing.failure) throw existing.failure;
		return existing;
	}
	return runInDetachedAsyncContext(() => {
		const { port1, port2 } = new MessageChannel();
		const url = source.moduleUrl;
		let worker;
		try {
			worker = createCpuTrackedWorker(url, {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				env: SHARE_ENV,
				workerData: { port: port2 },
				transferList: [port2]
			});
		} catch (error) {
			port1.close();
			port2.close();
			throw error;
		}
		const handles = /* @__PURE__ */ new Map();
		const ownerJoined = createDeferredCore();
		ownerJoined.promise.catch(() => void 0);
		let terminating = false;
		const terminateOwner = () => {
			if (terminating) return;
			terminating = true;
			worker.ref();
			port1.ref();
			try {
				worker.terminate().catch(ownerJoined.reject);
			} catch (error) {
				ownerJoined.reject(error);
			}
		};
		const receive = (reply) => {
			observeWorkerMessage(reply, "from_worker", "lifecycle");
			handles.get(reply.id)?.receive(reply);
		};
		const runtime = {
			handles,
			service() {
				for (;;) {
					const next = runWithMainThreadTask("worker:control-decode", () => receiveMessageOnPort(port1));
					if (!next) break;
					receive(next.message);
				}
				const resourceHandles = [...handles.values()];
				for (const handle of resourceHandles) {
					handle.serviceTaskPort();
					handle.serviceResource();
				}
				if (runtime.failure) return;
				let channelOpen;
				try {
					channelOpen = nativePortIsOpen(port1);
				} catch (error) {
					fail(new Error("Native worker lifetime channel observation failed", { cause: error }));
					terminateOwner();
					return;
				}
				if (!channelOpen) {
					fail(/* @__PURE__ */ new Error("Native worker lifetime channel closed"));
					terminateOwner();
					return;
				}
				source.broker?.serviceNativeResources();
			},
			post(message, transfers = []) {
				if (runtime.failure) throw runtime.failure;
				const bytes = workerMessagePayloadBytes(message);
				port1.postMessage(message, [...transfers]);
				observeWorkerMessage(message, "to_worker", "lifecycle", bytes ?? null);
			},
			resourceBroker() {
				return source.broker ??= runInDetachedAsyncContext(() => createSpawnBrokerHost({
					nativeResources: true,
					workerUrl: source.brokerModuleUrl
				}));
			},
			refreshReference() {
				if ([...handles.values()].some((handle) => handle.needsReference)) {
					worker.ref();
					port1.ref();
				} else {
					worker.unref();
					port1.unref();
				}
			},
			close() {
				if (handles.size) return Promise.reject(/* @__PURE__ */ new Error("Native worker execution owners have not joined"));
				runtime.failure ??= /* @__PURE__ */ new Error("Native worker lifetime owner is closing");
				terminateOwner();
				return ownerJoined.promise;
			}
		};
		const fail = (error) => {
			if (runtime.failure) return;
			runtime.failure = toErrorObject(error, "Native worker lifetime owner failed");
			for (const handle of handles.values()) handle.ownerFailed(runtime.failure);
		};
		port1.on("message", receive);
		port1.on("messageerror", (error) => {
			try {
				fail(error);
			} finally {
				terminateOwner();
			}
		});
		worker.on("message", (message) => receiveWorkerMemoryPort(worker, message));
		worker.on("error", fail);
		worker.once("exit", () => {
			setImmediate(() => {
				const error = runtime.failure ?? /* @__PURE__ */ new Error("Native worker lifetime owner exited");
				runtime.failure = error;
				source.closing = true;
				for (const handle of handles.values()) handle.ownerJoined(error);
				port1.close();
				ownerJoined.resolve();
			});
		});
		source.runtime = runtime;
		runtime.refreshReference();
		return runtime;
	});
}
/** Capture before queues; explicit undefined preserves an intentionally unbound lifetime. */
function captureRetainedNativeWorkerSource(options) {
	const supervisor = resolveRuntimeProcessEntrypointUrl("workerNativeLifecycle");
	const captured = options === void 0 ? captureRuntimeWorkerSource(supervisor) : {
		moduleUrl: options.runtimeGeneration ? options.runtimeGeneration.resolve(supervisor) : supervisor,
		runtimeGeneration: options.runtimeGeneration
	};
	const existing = captured.runtimeGeneration ? lifetime.sources.get(captured.runtimeGeneration) : lifetime.defaultSource;
	if (existing) return existing;
	const source = {
		...captured,
		brokerModuleUrl: captured.runtimeGeneration ? captured.runtimeGeneration.resolve(resolveRuntimeProcessEntrypointUrl("spawnBroker")) : resolveRuntimeProcessEntrypointUrl("spawnBroker"),
		closing: false,
		get hasActiveWorkers() {
			return Boolean(source.runtime?.handles.size);
		},
		async retireIdleBroker() {
			await source.brokerClose;
			if (source.hasActiveWorkers) return false;
			const broker = source.broker;
			source.broker = void 0;
			await (source.brokerClose = broker?.close());
			source.brokerClose = void 0;
			return true;
		},
		close() {
			return closingOwners ??= Promise.resolve().then(async () => {
				const errors = nativeCleanupFailures(await Promise.allSettled([...owners.values()].map((close) => close())));
				if (errors.length) throw new AggregateError(errors, "Native worker execution owner cleanup failed");
				source.closing = true;
				await source.runtime?.close();
				await source.brokerClose;
				await source.broker?.close();
				forgetNativeSource(source);
				owners.clear();
			});
		},
		create(filename, workerOptions, resource, taskPorts) {
			try {
				return startNativeWorker(nativeRuntime(source), filename, workerOptions ?? {}, resource, taskPorts);
			} catch (error) {
				taskPorts?.host.close();
				taskPorts?.worker.close();
				throw error;
			}
		},
		captureResource(moduleUrl, workerDataKey, input, connect) {
			const inContext = AsyncLocalStorage.snapshot();
			return Object.freeze({
				moduleUrl: String(captured.runtimeGeneration?.resolve(moduleUrl) ?? moduleUrl),
				workerDataKey,
				input: input === void 0 ? void 0 : structuredClone(input),
				connect: connect ? () => inContext(() => {
					const connection = connect();
					const decode = connection.decodeCloseError?.bind(connection);
					return {
						port: connection.port,
						service: () => inContext(() => connection.service()),
						dispose: () => inContext(() => connection.dispose()),
						decodeCloseError: decode ? (payload) => inContext(() => decode(payload)) : void 0
					};
				}) : void 0
			});
		},
		retain(owner, closeOwner) {
			owners.set(owner, closeOwner);
			captured.runtimeGeneration?.retain(source, () => source.close());
		}
	};
	const owners = /* @__PURE__ */ new Map();
	let closingOwners;
	if (captured.runtimeGeneration) lifetime.sources.set(captured.runtimeGeneration, source);
	else lifetime.defaultSource = source;
	return source;
}
/** Existing execution owners retain their queues; this capability owns only physical Worker lifetime. */
function createRetainedNativeWorker(filename, options = {}, source, resource, taskPorts) {
	try {
		return (source ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 })).create(filename, options, resource, taskPorts);
	} catch (error) {
		taskPorts?.host.close();
		taskPorts?.worker.close();
		throw error;
	}
}
function startNativeWorker(runtime, filename, options, resource, taskPorts) {
	const id = ++lifetime.nextId;
	let resourceConnection;
	let handle;
	try {
		resourceConnection = resource?.connect?.();
		handle = new NativeWorker(runtime, id, filename, options.eval === true, resource !== void 0, resourceConnection, taskPorts?.host);
		const { env, transferList = [], ...captured } = options;
		runtime.handles.set(id, handle);
		const retainedResource = resource ? handle.attachResource(resource) : void 0;
		runtime.post({
			type: "create",
			id,
			filename: {
				kind: filename instanceof URL ? "url" : "path",
				value: String(filename)
			},
			environmentData: captureSqliteWorkerEnvironmentData(),
			options: {
				...captured,
				environment: { ...env === SHARE_ENV ? process.env : env ?? process.env },
				shareEnvironment: env === SHARE_ENV
			},
			transferList: [...transferList],
			resource: retainedResource,
			taskPort: taskPorts?.worker
		}, taskPorts ? [...transferList, taskPorts.worker] : transferList);
	} catch (error) {
		runtime.handles.delete(id);
		runtime.refreshReference();
		if (handle) handle.abandonResource();
		else {
			taskPorts?.host.close();
			resourceConnection?.dispose();
		}
		taskPorts?.worker.close();
		throw error;
	}
	runtime.refreshReference();
	return handle;
}
const DEFAULT_WORKER_PENDING_BYTES = 268435456;
/** Shared compute admission; database and generation workers keep their own ordering. */
function createWorkerComputeCapacity(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError("compute capacity must be a positive safe integer");
	const active = /* @__PURE__ */ new Set();
	const waiting = /* @__PURE__ */ new Set();
	let pendingTasks = 0;
	let pendingBytes = 0;
	let draining = false;
	const requestCheckpoints = () => {
		let demand = waiting.size;
		if (demand) {
			for (const permit of active) if (permit.requestCheckpoint() && --demand === 0) break;
		}
	};
	const drain = () => {
		if (draining) return;
		draining = true;
		try {
			while (active.size < limit && waiting.size) {
				const next = waiting.values().next().value;
				waiting.delete(next);
				next();
			}
		} finally {
			draining = false;
		}
		requestCheckpoints();
	};
	return {
		getSnapshot: () => ({
			limit,
			active: active.size,
			waitingPools: waiting.size,
			pendingTasks,
			pendingBytes
		}),
		admit(bytes) {
			if (pendingTasks >= 128 || pendingBytes + bytes > 268435456) return false;
			pendingTasks++;
			pendingBytes += bytes;
			return true;
		},
		finish(bytes) {
			pendingTasks--;
			pendingBytes -= bytes;
		},
		acquire(resume, requestCheckpoint) {
			if (active.size >= limit || !draining && waiting.size) {
				waiting.add(resume);
				requestCheckpoints();
				return;
			}
			const permit = { requestCheckpoint };
			active.add(permit);
			return permit;
		},
		release(permit) {
			active.delete(permit);
			drain();
		},
		remove(resume) {
			waiting.delete(resume);
		},
		requestCheckpoints
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-context.ts
function captureWorkerTaskContext() {
	const context = new AsyncResource("OpenClaw.WorkerTask");
	return (operation) => context.runInAsyncScope(operation);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-error.ts
var WorkerTaskError = class extends Error {
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = "WorkerTaskError";
	}
};
function workerTaskTimeoutError(exchange, workerUrl) {
	let callback = exchange?.sent === false ? exchange.name : void 0;
	if (callback === "unknown") callback = workerUrl.protocol === "file:" ? workerUrl.pathname.split("/").at(-1)?.slice(0, 96) || "worker" : `${workerUrl.protocol} worker`;
	const error = new WorkerTaskError(callback ? `worker task timed out waiting for host callback ${callback}` : "worker task timed out", "timeout");
	if (callback) process.emitWarning(error.message, { code: "WORKER_HOST_CALLBACK_TIMEOUT" });
	return error;
}
function workerTaskUnavailableError(slot, message, cause) {
	const task = slot.task;
	const stage = slot.ready === false ? "startup" : task?.exchange ? "exchange" : "running";
	return new WorkerTaskError(message + (task?.diagnosticLabel ? ` [task=${task.diagnosticLabel} admittedInputBytes=${task.inputBytes} exchanges=${task.exchangeSequence} stage=${stage}]` : ""), "unavailable", { cause });
}
//#endregion
//#region packages/worker-runtime/src/worker-task-host.ts
/** Capture before callbacks so nested servicing advances a fresh set of owners. */
function serviceNativeWorkerPass(host, slots) {
	const workers = [];
	for (const slot of slots) if (slot.native) workers.push(slot.native);
	host.serviceNativeWorkers(workers);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
const nativeSectionKey = Symbol.for("openclaw.workerTaskNativeSection");
const nativeSectionStore = globalThis;
nativeSectionStore[nativeSectionKey] ??= new AsyncLocalStorage();
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function waitForWorkerNativeSections(state) {
	if (areWorkerNativeSectionsSettled(state)) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
/** Cancellation must close admission before this fact permits native termination. */
function areWorkerNativeSectionsSettled(state) {
	return Atomics.load(state, 0) < SECTION;
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-bootstrap.ts
/** A failed bootstrap stops new construction until its generation is rotated. */
function createWorkerTaskPoolBootstrap(slots, queue, reject) {
	let failure;
	const admissionError = () => failure && ![...slots].some((slot) => slot.ready === true && !slot.retiring && !slot.retirementFailed) ? failure : void 0;
	const rejectQueued = () => {
		const error = admissionError();
		if (!error) return;
		const queued = queue.splice(0);
		for (const task of queued) reject(task, error);
	};
	return {
		error: () => failure,
		get admissionError() {
			return admissionError();
		},
		fail(error) {
			failure ??= error;
			rejectQueued();
		},
		rejectQueued,
		reset: () => {
			failure = void 0;
		}
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-owned.ts
function createWorkerHostExchange(task, request) {
	const name = isRecord(request) ? request.kind ?? request.type : request;
	return task.exchange = {
		id: ++task.exchangeSequence,
		name: typeof name === "string" && /^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(name) ? name : "unknown",
		pressure: new AbortController(),
		sent: false,
		onConsumed: void 0
	};
}
function dispatchOwnedWorkerRequest(task, slot, value, exchange, owner) {
	const context = {
		signal: (task.controller ??= new AbortController()).signal,
		yieldSignal: exchange.pressure.signal
	};
	const assertCurrent = () => {
		if (task.done || slot.task !== task) throw owner.closedError();
	};
	if (task.options.onRequestSync) {
		try {
			assertCurrent();
			owner.accept(task.options.onRequestSync(value, context));
		} catch (error) {
			owner.reject(error);
		}
		return;
	}
	Promise.resolve().then(() => {
		assertCurrent();
		return task.options.onRequest(value, context);
	}).then(owner.accept).catch(owner.reject);
}
async function joinOwnedWorkerTasks(closures) {
	const errors = (await Promise.allSettled(closures)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker task cleanup failed");
}
function joinOwnedWorkerTask(task, settlement, retire = false) {
	return startJoinOwnedWorkerTask(task, settlement, retire).result;
}
function startJoinOwnedWorkerTask(task, settlement, retire = false) {
	const closing = startCloseOwnedWorkerTask(task, settlement, retire);
	const observe = () => {
		const outcome = closing.read();
		if (outcome.status === "pending") return outcome;
		if (outcome.status === "rejected" && task.owner?.closing === closing) task.owner.closing = void 0;
		if (task.owner?.closed) {
			const slot = task.slot;
			task.slot = void 0;
			settlement.release(task, slot);
		}
		return outcome;
	};
	const result = closing.result.then(() => {
		observe();
	}, (error) => {
		observe();
		throw error;
	});
	result.catch(() => void 0);
	return {
		result,
		read: observe,
		service() {
			closing.service();
			observe();
		}
	};
}
function closeOwnedWorkerTask(task, settlement, retire = false) {
	return startCloseOwnedWorkerTask(task, settlement, retire).result;
}
function startCloseOwnedWorkerTask(task, settlement, retire = false) {
	const owner = task.owner;
	if (!owner || owner.closed) {
		if (owner?.closing) return owner.closing;
		const complete = createRetainedOperation(() => {});
		complete.resolve();
		return complete.operation;
	}
	owner.retire ||= retire;
	if (owner.closing) return owner.closing;
	let retirement;
	let observedPreparation;
	let advancing = false;
	const closing = createRetainedOperation(() => {
		retirement?.service();
		advance();
	});
	const advance = () => {
		if (advancing || closing.operation.read().status !== "pending") return;
		advancing = true;
		try {
			if (task.preparation) {
				if (observedPreparation !== task.preparation.promise) {
					observedPreparation = task.preparation.promise;
					observedPreparation.then(advance, closing.reject);
				}
				return;
			}
			const slot = task.slot;
			if (slot && owner.retire) {
				if (!retirement) {
					retirement = settlement.retire(slot);
					retirement.result.then(advance, advance);
				}
				const outcome = retirement.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") throw outcome.error;
			}
			settlement.detach(task);
			try {
				owner.complete?.();
			} finally {
				owner.closed = true;
				owner.complete = void 0;
				task.input = void 0;
				task.options = {};
				task.abort = () => {};
			}
			closing.resolve();
		} catch (error) {
			closing.reject(error);
		} finally {
			advancing = false;
		}
	};
	owner.closing = closing.operation;
	if (!task.done) settlement.cancel(task);
	advance();
	return closing.operation;
}
function retainWorkerTask(task, settlement, service) {
	return {
		result: task.promise,
		read: () => task.read(),
		service,
		release: (closeOptions) => {
			const closing = startJoinOwnedWorkerTask(task, settlement, closeOptions?.retire === true);
			return {
				result: closing.result,
				read: () => closing.read(),
				service: () => {
					service();
					closing.service();
				}
			};
		}
	};
}
function prepareWorkerTaskInput(task, receive, reject, prepareResources) {
	const taskInput = task.input;
	delete task.input;
	const preparation = Promise.withResolvers();
	task.preparation = preparation;
	const finishPreparation = () => {
		preparation.resolve();
		if (task.preparation === preparation) task.preparation = void 0;
	};
	const failed = (error) => {
		finishPreparation();
		reject(error);
	};
	let prepared;
	try {
		prepared = typeof taskInput === "function" ? taskInput() : taskInput;
	} catch (error) {
		failed(error);
		return;
	}
	if (prepareResources) prepared = Promise.resolve(prepared).then(async (input) => {
		await prepareResources();
		return input;
	});
	const ready = (input) => {
		finishPreparation();
		receive(input);
	};
	if (isPromiseLike(prepared)) Promise.resolve(prepared).then(ready, failed);
	else ready(prepared);
}
function armWorkerTaskTimeout(task, timeoutMs, onTimeout) {
	clearTimeout(task.timer);
	const now = performance.now();
	task.deadline = Math.min(task.options.hostTimeout !== "owner" && task.options.timeoutMs !== void 0 ? task.deadline ?? task.enqueuedAt + resolveTimerTimeoutMs(task.options.timeoutMs, 6e4) : Infinity, now + resolveTimerTimeoutMs(timeoutMs, 6e4));
	task.timer = setTimeout(onTimeout, Math.max(0, task.deadline - now));
}
function expireWorkerTasks(queue, slots, expire) {
	const now = performance.now();
	const pending = [...queue, ...[...slots].flatMap((slot) => slot.task ? [slot.task] : [])];
	for (const task of pending) if (!task.done && task.deadline !== void 0 && now >= task.deadline) expire(task);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-completion.ts
const taskDiagnostics = channel("openclaw.worker.task");
function joinWorkerTaskPreparationCleanups(completion, artifactCleanup) {
	return joinOwnedWorkerTasks([...[...completion.preparationCleanups].map(([task, cleanup]) => cleanup.finally(() => {
		if (completion.preparationCleanups.delete(task)) completion.releaseAdmission(task);
	})), artifactCleanup.then(() => void 0)]);
}
function notifyExecutionSettled(task) {
	try {
		if (!task.executionNotified) {
			task.executionNotified = true;
			task.options.onExecutionSettled?.({ retired: task.slot?.retired === true });
		}
	} catch (error) {
		return toErrorObject(error, "worker settlement receipt failed");
	}
}
function createWorkerTaskCompletion(task, completion, error, value) {
	const preparation = task.owner ? void 0 : task.preparation;
	let settlementError;
	const complete = () => {
		if (!task.owner && !preparation) completion.releaseAdmission(task);
		return completeWorkerTask(task, completion, error, value, settlementError);
	};
	if (!preparation) return complete;
	const cleanup = Promise.withResolvers();
	completion.preparationCleanups.set(task, cleanup.promise);
	cleanup.promise.catch(() => void 0);
	return () => {
		settlementError = task.runInContext(() => notifyExecutionSettled(task));
		if (error) task.reject(error);
		preparation.promise.then(() => {
			const failure = complete();
			if (failure) throw failure;
			completion.preparationCleanups.delete(task);
			completion.releaseAdmission(task);
			cleanup.resolve();
		}).catch(cleanup.reject);
	};
}
function completeWorkerTask(task, completion, error, value, settlementError) {
	return task.runInContext(() => {
		let completionError = error ?? settlementError;
		const cleanupErrors = settlementError ? [settlementError] : [];
		try {
			if (!task.inputConsumed) {
				task.inputConsumed = true;
				task.options.onInputConsumed?.();
			}
			const release = task.exchange?.onConsumed;
			task.exchange = void 0;
			release?.();
		} catch (releaseError) {
			const cleanupError = toErrorObject(releaseError, "worker input release failed");
			cleanupErrors.push(cleanupError);
			completionError ??= cleanupError;
		}
		const receiptError = notifyExecutionSettled(task);
		if (receiptError) {
			cleanupErrors.push(receiptError);
			completionError ??= receiptError;
		}
		const permit = task.computePermit;
		task.computePermit = void 0;
		if (permit) completion.releaseCompute(permit);
		if (taskDiagnostics.hasSubscribers) {
			const now = performance.now();
			taskDiagnostics.publish({
				...completion.diagnostics(),
				outcome: completionError ? "failed" : "ok",
				queueMs: (task.startedAt ?? now) - task.enqueuedAt,
				preparationMs: task.startedAt === void 0 ? 0 : (task.preparedAt ?? now) - task.startedAt,
				runMs: task.preparedAt === void 0 ? 0 : now - task.preparedAt,
				transferMs: task.transferMs,
				hostWaitMs: task.hostWaitMs
			});
		}
		const firstCleanupError = cleanupErrors[0];
		const cleanupError = cleanupErrors.length > 1 ? new AggregateError(cleanupErrors, "Worker task cleanup failed", { cause: firstCleanupError }) : firstCleanupError;
		if (task.owner) {
			if (cleanupError) throw cleanupError;
		} else if (completionError) task.reject(completionError);
		else task.resolve(value);
		return cleanupError;
	});
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-resources.ts
/** Each existing slot retains its cleanup receipt; no result Promise controls custody. */
function startCloseWorkerPoolResources(slots, resourceClosures, retire, key, options, observeReply) {
	const operations = [...slots].map((slot) => {
		if (slot.retiring) return slot.retiring;
		if (slot.native?.executionStopped) return retire(slot);
		const worker = slot.worker;
		if (!worker) {
			const complete = createRetainedOperation(() => {});
			complete.resolve();
			return complete.operation;
		}
		const closure = resourceClosures.get(worker) ?? { pending: 0 };
		closure.pending++;
		resourceClosures.set(worker, closure);
		worker.ref();
		return startCloseWorkerTaskResources(slot, worker, closure, key, options, retire, observeReply);
	});
	const completion = createRetainedOperation(() => {
		for (const operation of operations) operation.service();
		advance();
	});
	const advance = () => {
		const outcomes = operations.map((operation) => operation.read());
		if (outcomes.some((outcome) => outcome.status === "pending")) return;
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.error] : []);
		if (errors.length) completion.reject(new AggregateError(errors, "Worker resource cleanup failed"));
		else completion.resolve();
	};
	for (const operation of operations) operation.result.then(advance, advance);
	advance();
	return completion.operation;
}
/** Concurrent resource closes share one listener until their last real receipt. */
function observeResourceWorkerExit(worker, closures, finish) {
	let exit = closures.exit;
	if (!exit) {
		const waiters = /* @__PURE__ */ new Set();
		exit = {
			waiters,
			receive: () => {
				for (const waiter of waiters) waiter();
			}
		};
		closures.exit = exit;
		worker.once("exit", exit.receive);
	}
	exit.waiters.add(finish);
	return () => {
		exit.waiters.delete(finish);
		if (!exit.waiters.size) {
			worker.removeListener("exit", exit.receive);
			if (closures.exit === exit) closures.exit = void 0;
		}
	};
}
function startCloseWorkerTaskResources(slot, worker, closures, key, options, retire, observeReply) {
	const { port1, port2 } = new MessageChannel();
	const runInContext = AsyncLocalStorage.snapshot();
	let settled = false;
	let awaitingRetirement = false;
	let selectedRetirement;
	const completion = createRetainedOperation(() => {
		if (settled) return;
		slot.native?.service();
		if (slot.native?.executionStopped) {
			awaitingRetirement = true;
			selectedRetirement ??= slot.retiring ?? retire(slot);
		}
		for (;;) {
			const next = receiveMessageOnPort(port1);
			if (!next || settled) break;
			receive(next.message);
		}
		const retirement = selectedRetirement ?? slot.retiring;
		if (awaitingRetirement && retirement) {
			retirement.service();
			const stopped = retirement.read();
			if (stopped.status === "fulfilled") finish();
			else if (stopped.status === "rejected") finish(toErrorObject(stopped.error, "Worker resource cleanup retirement failed"));
		}
	});
	const finish = (error) => runInContext(() => {
		if (settled) return;
		settled = true;
		stopObservingExit();
		port1.close();
		port2.close();
		closures.pending--;
		if (!closures.pending && !slot.task && !slot.retiring) worker.unref();
		if (error) completion.reject(error);
		else completion.resolve();
	});
	const receive = (reply) => {
		observeReply?.();
		try {
			if (isRecord(reply) && reply.ok === true) {
				finish();
				return;
			}
			const error = isRecord(reply) && reply.detail !== void 0 && options?.decodeResourceError ? options.decodeResourceError(reply.detail) : new Error(isRecord(reply) && typeof reply.error === "string" ? reply.error : "Invalid worker resource cleanup receipt");
			finish(error);
		} catch (error) {
			finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded"));
		}
	};
	const stopObservingExit = observeResourceWorkerExit(worker, closures, () => finish());
	port1.once("message", receive);
	port1.once("messageerror", (error) => finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded")));
	port1.once("close", () => {
		if (settled) return;
		const retirement = slot.retiring;
		if (!retirement) {
			finish(/* @__PURE__ */ new Error("Worker resource cleanup closed without a receipt"));
			return;
		}
		awaitingRetirement = true;
		selectedRetirement = retirement;
		retirement.result.then(() => finish(), (error) => finish(toErrorObject(error, "Worker resource cleanup retirement failed")));
	});
	try {
		worker.postMessage({
			closeResource: true,
			key,
			resourcePort: port2
		}, [port2]);
	} catch (error) {
		finish(toErrorObject(error, "Worker resource cleanup could not be sent"));
	}
	return completion.operation;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-retirement.ts
const WORKER_WARM_WINDOW_MS = 3e5;
function createWorkerTaskPoolRetirement({ slots, options, runInContext, dispatch, onRotationComplete, serviceDeadlines, markWorkerRetirement, serviceHost }) {
	const artifactCleanups = /* @__PURE__ */ new Map();
	let lastIdleRetirementAt = -Infinity;
	let warmSlot;
	let rotation;
	let rotationFailed = false;
	const setTimeoutFn = setTimeout;
	const clearTimeoutFn = clearTimeout;
	const now = performance.now.bind(performance);
	const clearIdle = (slot) => clearTimeoutFn(slot.idleTimer);
	const isBurstSlot = (slot) => {
		if (options.burstIdleTimeoutMs !== void 0) {
			for (const available of slots) if (!available.retiring && !available.retirementFailed) return available !== slot;
		}
		return false;
	};
	function startRotate() {
		if (rotation) return rotation;
		const runRotation = AsyncLocalStorage.snapshot();
		let retirements;
		let artifacts;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			serviceNativeWorkerPass(serviceHost, rotationSlots);
			serviceDeadlines();
			for (const retiring of retirements ?? []) retiring.service();
			artifacts?.service();
			advance();
		});
		rotation = completion.operation;
		rotationFailed = false;
		const rotationSlots = [...slots];
		const tasks = rotationSlots.flatMap((slot) => slot.task ? [slot.task] : []);
		const advance = () => runRotation(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (tasks.some((task) => task.read().status === "pending")) return;
				if (!retirements) {
					retirements = rotationSlots.map((slot) => startRetire(slot, "rotation"));
					for (const retiring of retirements) retiring.result.then(advance, advance);
				}
				for (const retiring of retirements) {
					const stopped = retiring.read();
					if (stopped.status === "rejected") throw stopped.error;
					if (stopped.status === "pending") return;
				}
				if (!artifacts) {
					artifacts = startJoinArtifacts();
					artifacts.result.then(advance, advance);
				}
				const cleaned = artifacts.read();
				if (cleaned.status === "pending") return;
				if (cleaned.status === "rejected") throw cleaned.error;
				rotation = void 0;
				onRotationComplete();
				completion.resolve();
				dispatch();
			} catch (error) {
				rotation = void 0;
				rotationFailed = true;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		for (const task of tasks) task.promise.then(advance, advance);
		advance();
		return completion.operation;
	}
	function startRetire(slot, reason = "closed") {
		if (reason === "idle_timeout" && !isBurstSlot(slot)) lastIdleRetirementAt = now();
		else if (reason === "rotation") lastIdleRetirementAt = -Infinity;
		if (warmSlot === slot) warmSlot = void 0;
		if (slot.worker) markWorkerRetirement(slot.worker, reason);
		clearIdle(slot);
		cancelWorkerNativeSections(slot.nativeSections);
		if (slot.retiring) return slot.retiring;
		const runRetirement = AsyncLocalStorage.snapshot();
		let nativeStop;
		let observingSection = false;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			nativeStop?.service();
			advance();
		});
		const advance = () => runRetirement(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (slot.creating) return;
				if (!areWorkerNativeSectionsSettled(slot.nativeSections)) {
					if (!observingSection) {
						observingSection = true;
						Promise.resolve(waitForWorkerNativeSections(slot.nativeSections)).then(advance, completion.reject);
					}
					return;
				}
				if (slot.worker && !nativeStop) {
					markWorkerRetirement(slot.worker, reason);
					if (slot.native) nativeStop = slot.native.stop();
					else {
						const stopped = createRetainedOperation(() => {});
						nativeStop = stopped.operation;
						Promise.resolve().then(() => slot.worker.terminate()).then(() => stopped.resolve(), stopped.reject);
					}
					nativeStop.result.then(advance, advance);
				}
				const stopped = nativeStop?.read();
				if (stopped?.status === "pending") return;
				if (stopped?.status === "rejected") throw stopped.error;
				slot.retired = true;
				const releaseResources = slot.releaseResources;
				if (releaseResources) runInContext(() => {
					const cleanup = (async () => {
						try {
							await releaseResources();
						} catch (error) {
							try {
								process.emitWarning(`Worker task resource release failed: ${String(error)}`);
							} catch {}
						}
					})();
					const settled = createRetainedOperation(() => {});
					artifactCleanups.set(cleanup, settled.operation);
					cleanup.then(() => {
						artifactCleanups.delete(cleanup);
						settled.resolve();
					}, settled.reject);
				});
				slot.worker?.removeAllListeners();
				slots.delete(slot);
				for (const complete of slot.completions ?? []) complete();
				slot.completions = void 0;
				dispatch();
				completion.resolve();
			} catch (error) {
				try {
					Promise.resolve(options.onRetirementFailure?.(error)).catch(() => void 0);
				} catch {}
				slot.retirementFailed = true;
				slot.retiring = void 0;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		slot.retiring = completion.operation;
		Promise.resolve().then(advance);
		return completion.operation;
	}
	function retire(slot, reason) {
		return startRetire(slot, reason).result;
	}
	function startJoinArtifacts() {
		const pending = [...artifactCleanups.values()];
		const joined = createRetainedOperation(() => {
			for (const operation of pending) operation.service();
			advance();
		});
		const advance = () => {
			const outcomes = pending.map((operation) => operation.read());
			const failure = outcomes.find((outcome) => outcome.status === "rejected");
			if (failure?.status === "rejected") joined.reject(failure.error);
			else if (outcomes.every((outcome) => outcome.status === "fulfilled")) joined.resolve();
		};
		for (const operation of pending) operation.result.then(advance, advance);
		advance();
		return joined.operation;
	}
	/** Join failed native retirements without interrupting healthy tasks. */
	async function retryFailedRetirements() {
		const outcomes = await Promise.allSettled([...slots].filter((slot) => slot.retirementFailed).map((slot) => retire(slot)));
		outcomes.push(...await Promise.allSettled(artifactCleanups.keys()));
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [toErrorObject(outcome.reason, "worker retirement retry failed")] : []);
		const firstError = errors[0];
		if (firstError) throw errors.length === 1 ? firstError : new AggregateError(errors, "Worker retirement retries failed", { cause: firstError });
	}
	function idle(slot, elapsedIdleMs = 0) {
		const burst = isBurstSlot(slot);
		const idleMs = (burst ? options.burstIdleTimeoutMs : options.idleTimeoutMs) ?? 6e4;
		if (idleMs <= 0) return;
		if (!burst && !warmSlot && now() - lastIdleRetirementAt < WORKER_WARM_WINDOW_MS) warmSlot = slot;
		const startedAt = burst ? now() : 0;
		const timeoutMs = warmSlot === slot ? Math.max(idleMs, WORKER_WARM_WINDOW_MS) : idleMs;
		slot.idleTimer = runInContext(() => setTimeoutFn(() => {
			if (burst && !isBurstSlot(slot)) {
				idle(slot, now() - startedAt);
				return;
			}
			retire(slot, "idle_timeout").catch(() => void 0);
		}, Math.max(0, timeoutMs - elapsedIdleMs)));
		slot.idleTimer.unref();
	}
	return {
		get dispatchAllowed() {
			return rotation === void 0 && !rotationFailed;
		},
		startRotate,
		retire,
		startRetire,
		service() {
			const current = [...slots];
			for (const slot of current) slot.retiring?.service();
			rotation?.service();
		},
		clearIdle,
		idle,
		retireIdle(resourceClosures) {
			for (const slot of slots) if (!slot.task && !slot.retiring && !slot.retirementFailed && slot.worker && !resourceClosures.get(slot.worker)?.pending) retire(slot, "memory_pressure").catch(() => void 0);
		},
		retryFailedRetirements,
		joinArtifacts: () => startJoinArtifacts().result
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-worker.ts
function postWorkerTaskInput(worker, slot, task, input, transferList, taskContext) {
	const transferStartedAt = performance.now();
	worker.postMessage({
		input,
		taskId: task.id,
		interactive: Boolean(task.options.onRequest || task.options.onRequestSync || task.options.onNotification),
		nativeSections: slot.nativeSections.buffer,
		taskContext,
		sampleMemory: true
	}, transferList);
	task.transferMs += performance.now() - transferStartedAt;
}
function sendWorkerTaskInput(params) {
	const { slot, task, input } = params;
	if (task.done) return;
	task.diagnosticLabel = params.host.describeTask?.(params.workerUrl, input);
	task.preparedAt = performance.now();
	const bootstrapError = params.bootstrapError();
	if (bootstrapError && !slot.worker) {
		params.refuse(bootstrapError);
		return;
	}
	try {
		let worker = slot.worker;
		if (!worker) {
			slot.creating = true;
			try {
				worker = params.createWorker();
			} catch (error) {
				params.fail(error, true);
				return;
			} finally {
				slot.creating = false;
			}
		}
		const transferList = task.options.transferList?.(input);
		if (!task.done) {
			const context = params.host.captureTaskContext(worker);
			postWorkerTaskInput(worker, slot, task, input, [...transferList ?? [], ...params.host.taskContextTransferList?.(context) ?? []], context);
		}
	} catch (error) {
		params.fail(error);
	}
}
/** Physical construction and listeners share the pool's detached creation scope. */
function createWorkerTaskPoolWorker(params) {
	const { slot, options } = params;
	const worker = params.runInContext(() => {
		const prepared = options.prepareWorker?.();
		slot.releaseResources = prepared?.releaseResources;
		const temporaryDirectory = prepared?.temporaryDirectory;
		if (temporaryDirectory) {
			const cleanup = params.host.prepareResources();
			const releaseResources = slot.releaseResources;
			slot.releaseResources = async () => {
				try {
					await cleanup;
					await params.host.releaseTemporaryDirectory(temporaryDirectory);
				} finally {
					await releaseResources?.();
				}
			};
		}
		const workerUrl = options.workerUrl;
		const workerOptions = {
			...options.workerOptions,
			...prepared?.options
		};
		if (slot.retiring) throw params.unavailableError("worker creation closed during preparation");
		const bootstrapError = params.bootstrapError();
		if (bootstrapError) throw bootstrapError;
		if (params.host.requiresReady) slot.ready = false;
		const created = params.host.createWorker(workerUrl, workerOptions);
		slot.native = created.native;
		return created.worker;
	});
	let counted = false;
	const started = () => {
		if (counted) return;
		counted = true;
		params.onStarted(worker);
	};
	if (slot.native) {
		slot.native.on("started", started);
		slot.native.on("execution-exit", (code) => {
			releaseWorkerNativeSectionsOnExit(slot.nativeSections);
			if (!slot.retiring) params.onFailure(params.unavailableError(`worker exited with code ${code}`), true);
		});
	} else started();
	slot.worker = worker;
	worker.on("message", (message) => {
		if (params.host.receiveMessage(worker, message)) return;
		if (slot.ready === false) {
			if (isRecord(message) && message.status === "ready") slot.ready = true;
			else params.onFailure(params.unavailableError("worker task server did not become ready"), true);
			return;
		}
		const task = slot.task;
		if (task) task.runInContext(() => params.onMessage(message));
		else params.onMessage(message);
	});
	worker.on("error", (error) => params.onFailure(params.unavailableError(String(error), error), true));
	worker.on("messageerror", (error) => params.onFailure(params.unavailableError(String(error), error)));
	worker.once("exit", (code) => {
		releaseWorkerNativeSectionsOnExit(slot.nativeSections);
		const wasCounted = counted;
		counted = false;
		params.onExit(code, wasCounted);
	});
	return worker;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-core.ts
const runInWorkerPoolContext = AsyncLocalStorage.snapshot();
/** Bounded execution workers; each worker accepts one task at a time. */
var WorkerTaskPoolCore = class {
	constructor(options, host, publicDispatch, ownerOptions = {}) {
		this.options = options;
		this.host = host;
		this.publicDispatch = publicDispatch;
		this.ownerOptions = ownerOptions;
		this.slots = /* @__PURE__ */ new Set();
		this.ownedTasks = /* @__PURE__ */ new Set();
		this.resourceClosures = /* @__PURE__ */ new WeakMap();
		this.ownedSettlement = {
			cancel: (task) => this.cancel(task, new WorkerTaskError("worker task closed", "unavailable")),
			detach: (task) => {
				if (task.slot?.task === task) {
					task.slot.task = void 0;
					this.activeTasks--;
				}
			},
			retire: (slot) => this.retirement.startRetire(slot),
			release: (task, slot) => {
				if (!this.ownedTasks.delete(task)) return;
				this.releaseAdmission(task);
				task.runInContext = runInWorkerPoolContext;
				this.dispatch();
				if (slot && !task.owner?.retire && !slot.task && !slot.retiring) this.idle(slot);
			}
		};
		this.completion = {
			preparationCleanups: /* @__PURE__ */ new Map(),
			releaseAdmission: (task) => this.releaseAdmission(task),
			releaseCompute: (permit) => this.computeCapacity.release(permit),
			diagnostics: () => ({
				worker: this.options.workerUrl.pathname.split("/").at(-1),
				...this.publicDispatch?.getSnapshot() ?? this.getSnapshot(),
				pendingBytes: this.pendingBytes
			})
		};
		this.queue = [];
		this.bootstrap = createWorkerTaskPoolBootstrap(this.slots, this.queue, (task, error) => this.finish(task, error));
		this.pendingTasks = 0;
		this.pendingBytes = 0;
		this.workers = 0;
		this.workersCreated = 0;
		this.activeTasks = 0;
		this.resumeCompute = () => this.dispatch();
		this.nextTaskId = 0;
		this.retireIdleOnPressure = () => this.retirement.retireIdle(this.resourceClosures);
		this.expireTasks = () => expireWorkerTasks(this.queue, this.slots, (task) => this.timeout(task));
		this.retryFailedRetirements = () => this.retirement.retryFailedRetirements();
		this.observeTask = host.createTaskObserver?.(options.workerUrl);
		this.maxWorkers = host.maxWorkers ?? options.maxWorkers ?? availableParallelism();
		this.maxPendingTasks = options.maxPendingTasks ?? 128;
		this.maxPendingBytes = options.maxPendingBytes ?? 268435456;
		for (const [name, value] of Object.entries({
			maxWorkers: this.maxWorkers,
			maxPendingTasks: this.maxPendingTasks,
			maxPendingBytes: this.maxPendingBytes
		})) if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
		this.computeCapacity = options.sharedCompute ? host.computeCapacity : void 0;
		this.retirement = createWorkerTaskPoolRetirement({
			slots: this.slots,
			options,
			runInContext: runInWorkerPoolContext,
			dispatch: () => this.dispatch(),
			onRotationComplete: this.bootstrap.reset,
			serviceDeadlines: this.expireTasks,
			markWorkerRetirement: (worker, reason) => host.workerRetiring(worker, reason),
			serviceHost: host
		});
		host.pools.register(this);
	}
	run(input, options) {
		if (this.closedError) return Promise.reject(this.closedError);
		const inputBytes = options.inputBytes ?? 0;
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) return Promise.reject(/* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
		return this.enqueue(input, options, false, inputBytes).promise;
	}
	runTask(input, options) {
		const task = this.enqueue(input, options, true);
		return {
			result: task.promise,
			close: (closeOptions) => joinOwnedWorkerTask(task, this.ownedSettlement, closeOptions?.retire === true)
		};
	}
	startTask(input, options) {
		if (!this.ownerOptions.retainedTransport) throw new WorkerTaskError("Retained tasks require their native lifetime transport", "unavailable");
		return retainWorkerTask(this.enqueue(input, options, true), this.ownedSettlement, () => this.service());
	}
	service() {
		serviceNativeWorkerPass(this.host, this.slots);
		this.expireTasks();
		this.retirement.service();
		const tasks = [...this.ownedTasks];
		for (const task of tasks) task.owner?.closing?.service();
		this.dispatch();
	}
	enqueue(input, options, owned = false, inputBytes = options.inputBytes ?? 0) {
		const completion = createRetainedOperation(() => this.service(), { observeRejection: this.ownerOptions.retainedTransport === true });
		const task = {
			promise: completion.operation.result,
			resolve: completion.resolve,
			reject: completion.reject,
			read: () => completion.operation.read(),
			id: ++this.nextTaskId,
			runInContext: captureWorkerTaskContext(),
			controller: void 0,
			inputConsumed: false,
			executionNotified: false,
			exchangeSequence: 0,
			input,
			options: { ...options },
			abort: () => this.cancel(task, toErrorObject(options.signal?.reason, "worker task aborted")),
			done: false,
			admitted: false,
			...owned ? { owner: {
				closed: false,
				retire: false
			} } : {},
			inputBytes,
			enqueuedAt: performance.now(),
			transferMs: 0,
			hostWaitMs: 0
		};
		if (owned) this.ownedTasks.add(task);
		const unavailable = this.closedError ?? this.bootstrap.admissionError;
		if (unavailable || !Number.isSafeInteger(inputBytes) || inputBytes < 0) {
			this.finish(task, unavailable ?? /* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
			return task;
		}
		if (this.pendingTasks >= this.maxPendingTasks || this.pendingBytes + inputBytes > this.maxPendingBytes || this.computeCapacity && !this.computeCapacity.admit(inputBytes)) {
			this.finish(task, new WorkerTaskError("worker task capacity reached", "overloaded"));
			return task;
		}
		task.admitted = true;
		this.pendingTasks++;
		this.pendingBytes += inputBytes;
		task.observation = this.observeTask?.(task.options.diagnosticOperation);
		if (options.timeoutMs !== void 0) armWorkerTaskTimeout(task, options.timeoutMs, () => this.timeout(task));
		options.signal?.addEventListener("abort", task.abort, { once: true });
		this.queue.push(task);
		if (options.signal?.aborted) task.abort();
		else this.dispatch();
		return task;
	}
	get isClosed() {
		return this.closedError !== void 0;
	}
	getSnapshot() {
		return {
			maxWorkers: this.maxWorkers,
			workers: this.workers,
			workersCreated: this.workersCreated,
			activeTasks: this.activeTasks,
			pendingTasks: this.pendingTasks
		};
	}
	startCloseResources(key) {
		return startCloseWorkerPoolResources(this.slots, this.resourceClosures, (slot) => this.ownedSettlement.retire(slot), key, this.ownerOptions, this.host.observeResourceReply);
	}
	/** Pause dispatch, settle current work and join native exit before restarting the queue. */
	rotate() {
		return this.startRotate().result;
	}
	startRotate() {
		this.computeCapacity?.remove(this.resumeCompute);
		return this.retirement.startRotate();
	}
	close(error = new WorkerTaskError("worker task pool closed", "unavailable")) {
		this.closedError ??= error;
		channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		this.computeCapacity?.remove(this.resumeCompute);
		for (const task of this.queue.splice(0)) this.finish(task, this.closedError);
		for (const slot of this.slots) {
			if (slot.worker) this.host.workerRetiring(slot.worker, "closed");
			if (slot.task && !slot.task.owner) this.finish(slot.task, this.closedError, void 0, true);
		}
		const tasks = [...this.ownedTasks];
		const ownedSlots = new Set(tasks.flatMap((task) => task.slot?.task === task ? [task.slot] : []));
		const owned = tasks.map((task) => joinOwnedWorkerTask(task, this.ownedSettlement, true));
		const unowned = [...this.slots].filter((slot) => !ownedSlots.has(slot));
		const closures = [...owned, ...unowned.map((slot) => this.retirement.retire(slot))];
		return this.host.pools.close(this, closures, () => joinWorkerTaskPreparationCleanups(this.completion, this.retirement.joinArtifacts()));
	}
	dispatch() {
		if (!this.slots.size) channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		if (!this.queue.length || this.closedError || !this.retirement.dispatchAllowed) this.computeCapacity?.remove(this.resumeCompute);
		while (!this.closedError && this.retirement.dispatchAllowed && this.queue.length) {
			let slot = [...this.slots].find((entry) => !entry.task && !entry.retiring && !entry.retirementFailed && (!this.bootstrap.error() || entry.worker));
			if (!slot) {
				const constructionBlocked = this.bootstrap.error();
				if (constructionBlocked) this.bootstrap.rejectQueued();
				if (constructionBlocked || this.slots.size >= this.maxWorkers) {
					let contenders = this.queue.length;
					for (const occupied of this.slots) if (occupied.task?.exchange && !occupied.task.exchange.sent && !occupied.task.exchange.pressure.signal.aborted && contenders-- > 0) occupied.task.exchange.pressure.abort();
					return;
				}
			}
			const nextTask = this.queue[0];
			if (this.computeCapacity) {
				const permit = this.computeCapacity.acquire(this.resumeCompute, () => {
					if (nextTask.exchange && !nextTask.exchange.sent && !nextTask.exchange.pressure.signal.aborted) {
						nextTask.runInContext(() => nextTask.exchange?.pressure.abort());
						return true;
					}
					return false;
				});
				if (!permit) return;
				nextTask.computePermit = permit;
			}
			if (!slot) {
				slot = { nativeSections: createWorkerNativeSectionState() };
				this.slots.add(slot);
			}
			this.retirement.clearIdle(slot);
			const task = this.queue.shift();
			slot.task = task;
			this.activeTasks++;
			task.slot = slot;
			task.startedAt = performance.now();
			task.observation?.started();
			task.runInContext(() => {
				try {
					slot.worker?.ref();
				} catch (error) {
					this.fail(slot, toErrorObject(error, "worker reference failed"));
					return;
				}
				prepareWorkerTaskInput(task, (input) => sendWorkerTaskInput({
					workerUrl: this.options.workerUrl,
					slot,
					task,
					input,
					host: this.host,
					bootstrapError: this.bootstrap.error,
					createWorker: () => this.createWorker(slot),
					fail: (error, nativeFailure) => this.fail(slot, workerTaskUnavailableError(slot, String(error), error), nativeFailure),
					refuse: (error) => this.finish(task, error, void 0, true)
				}), (error) => this.finish(task, toErrorObject(error, "worker task preparation failed")), !slot.worker && this.options.prepareWorker ? () => runInWorkerPoolContext(() => this.host.prepareResources()) : void 0);
			});
		}
	}
	createWorker(slot) {
		if ((this.options.idleTimeoutMs ?? 6e4) > 0) {
			const pressure = channel("openclaw.memory.critical");
			pressure.unsubscribe(this.retireIdleOnPressure);
			pressure.subscribe(this.retireIdleOnPressure);
		}
		return createWorkerTaskPoolWorker({
			slot,
			options: this.options,
			host: this.host,
			bootstrapError: this.bootstrap.error,
			runInContext: runInWorkerPoolContext,
			unavailableError: (message, cause) => workerTaskUnavailableError(slot, message, cause),
			onStarted: (worker) => {
				this.workers++;
				this.workersCreated++;
				this.host.workerStarted(worker, this);
			},
			onMessage: (message) => this.receive(slot, message),
			onFailure: (error, nativeFailure) => this.fail(slot, error, nativeFailure),
			onExit: (code, counted) => {
				if (counted) this.workers--;
				this.fail(slot, workerTaskUnavailableError(slot, `worker exited with code ${code}`), true);
			}
		});
	}
	receive(slot, message) {
		if (slot.retiring) return;
		const task = slot.task;
		if (task && isRecord(message) && (message.status === "request" || message.status === "consumed" || message.status === "notification")) {
			try {
				this.receiveExchange(slot, task, message);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker consumption callback failed"));
			}
			return;
		}
		if (!task || !isRecord(message) || (task.options.onRequest || task.options.onRequestSync || message.taskId !== void 0) && message.taskId !== task.id || message.status !== "ok" && message.status !== "failed") {
			this.fail(slot, new WorkerTaskError("invalid worker task response", "unavailable"));
			return;
		}
		const reply = message;
		const retainInput = Boolean(task.exchange || task.options.onInputConsumed && !task.inputConsumed);
		if (reply.status === "failed") {
			this.finish(task, new WorkerTaskError(reply.error, "failed"), void 0, retainInput);
			return;
		}
		try {
			this.options.validateResult?.(reply.value);
		} catch (error) {
			this.fail(slot, toErrorObject(error, "worker result validation failed"));
			return;
		}
		this.finish(task, void 0, reply.value, retainInput);
	}
	receiveExchange(slot, task, message) {
		if (message.taskId !== task.id) {
			this.fail(slot, new WorkerTaskError("stale worker exchange", "unavailable"));
			return;
		}
		if (message.status === "notification") {
			task.options.onNotification?.(message.value);
			return;
		}
		if (message.status === "consumed") {
			if (message.id === 0 && !task.inputConsumed) {
				task.inputConsumed = true;
				const release = task.options.onInputConsumed;
				task.options.onInputConsumed = void 0;
				release?.();
			} else if (task.exchange?.sent && message.id === task.exchange.id) {
				const release = task.exchange.onConsumed;
				task.exchange = void 0;
				release?.();
			} else this.fail(slot, new WorkerTaskError("invalid worker consumption receipt", "unavailable"));
			return;
		}
		if (!task.options.onRequest && !task.options.onRequestSync || task.exchange || !Number.isSafeInteger(message.id) || message.id !== task.exchangeSequence + 1) {
			this.fail(slot, new WorkerTaskError("invalid worker exchange", "unavailable"));
			return;
		}
		if (task.options.hostTimeout === "owner") {
			clearTimeout(task.timer);
			task.deadline = void 0;
		}
		const exchange = createWorkerHostExchange(task, message.value);
		task.hostWaitStartedAt = performance.now();
		this.dispatch();
		this.computeCapacity?.requestCheckpoints();
		const accept = (response) => {
			if (!task.done && task.deadline !== void 0 && performance.now() >= task.deadline) this.timeout(task);
			if (task.done || slot.task !== task || slot.retiring) {
				const release = () => {
					try {
						task.runInContext(() => response.onConsumed?.());
					} catch {}
				};
				if (this.slots.has(slot)) (slot.completions ??= []).push(release);
				else release();
				return;
			}
			this.finishHostWait(task);
			exchange.onConsumed = response.onConsumed;
			exchange.sent = true;
			armWorkerTaskTimeout(task, response.timeoutMs, () => this.timeout(task));
			try {
				slot.worker.postMessage({
					taskId: task.id,
					responseId: exchange.id,
					input: response.input
				}, response.transferList);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker response delivery failed"));
			}
		};
		const reject = (error) => {
			if (!task.done && slot.task === task) this.fail(slot, toErrorObject(error, "worker host exchange failed"));
		};
		dispatchOwnedWorkerRequest(task, slot, message.value, exchange, {
			accept,
			reject,
			closedError: () => new WorkerTaskError("worker task closed before host dispatch", "unavailable")
		});
	}
	timeout(task) {
		if (task.done) return;
		this.cancel(task, workerTaskTimeoutError(task.exchange, this.options.workerUrl));
	}
	cancel(task, error) {
		if (task.done) return;
		if (task.slot) {
			if (task.slot.worker) this.host.workerRetiring(task.slot.worker, "cancelled");
			if (task.owner) this.finish(task, error, void 0, true);
			else this.fail(task.slot, error);
		} else {
			this.queue.splice(this.queue.indexOf(task), 1);
			this.finish(task, error);
		}
	}
	fail(slot, error, nativeFailure) {
		if (slot.retiring) return;
		if (nativeFailure && slot.ready === false) this.bootstrap.fail(error);
		if (slot.worker) this.host.workerRetiring(slot.worker, "failure");
		if (slot.task?.owner) {
			if (slot.task.done) {
				if (!slot.task.owner.retire) closeOwnedWorkerTask(slot.task, this.ownedSettlement, true).catch(() => void 0);
			} else this.finish(slot.task, error, void 0, true);
		} else if (this.options.restartOnError === false) (this.publicDispatch?.close(error) ?? this.close(error)).catch(() => void 0);
		else if (slot.task) this.finish(slot.task, error, void 0, true);
		else this.retirement.retire(slot).catch(() => void 0);
	}
	finishHostWait(task) {
		const startedAt = task.hostWaitStartedAt;
		if (startedAt !== void 0) {
			task.hostWaitStartedAt = void 0;
			task.hostWaitMs += performance.now() - startedAt;
		}
	}
	finish(task, error, value, retire = false) {
		if (task.done) return;
		this.finishHostWait(task);
		task.done = true;
		task.observation?.completed();
		task.observation = void 0;
		task.runInContext(() => task.controller?.abort(error));
		clearTimeout(task.timer);
		task.deadline = void 0;
		task.options.signal?.removeEventListener("abort", task.abort);
		const complete = createWorkerTaskCompletion(task, this.completion, error, value);
		if (task.owner) {
			task.owner.complete = complete;
			task.owner.retire ||= retire || Boolean(error && task.slot && task.preparedAt !== void 0);
			if (error) task.reject(error);
			else task.resolve(value);
			if (error || retire) closeOwnedWorkerTask(task, this.ownedSettlement).catch(() => void 0);
			return;
		}
		const slot = task.slot;
		if (slot) {
			slot.task = void 0;
			this.activeTasks--;
			if (retire) {
				(slot.completions ??= []).push(complete);
				this.retirement.retire(slot, "failure").catch((failure) => {
					task.reject(error ? new AggregateError([error, failure], `Worker retirement failed: ${toErrorObject(failure, "worker retirement failed").message}; task failed: ${error.message}`, { cause: failure }) : failure);
				});
				return;
			}
		}
		complete();
		this.dispatch();
		if (slot && !slot.task && !slot.retiring) this.idle(slot);
	}
	releaseAdmission(task) {
		if (task.admitted) {
			task.admitted = false;
			this.pendingTasks--;
			this.pendingBytes -= task.inputBytes;
			this.computeCapacity?.finish(task.inputBytes);
		}
	}
	idle(slot) {
		if (slot.worker && !this.resourceClosures.get(slot.worker)?.pending) slot.worker.unref();
		this.retirement.idle(slot);
	}
};
//#endregion
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(resolveWorkerComputeLimit()));
}
//#endregion
//#region src/infra/sqlite-worker-contract.ts
const processMonotonicClock = process.hrtime;
/** Monotonic nanoseconds for deadlines measured within the calling thread. */
function readSqliteWorkerMonotonicNs() {
	return processMonotonicClock.bigint();
}
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
/** Only the factory's admission before agent open may certify this refusal. */
const SqliteWorkerOpenRefusedError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
const SqliteWorkerAdmissionTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerAdmissionTimeoutError"), () => class AdmissionTimeoutError extends Error {
	constructor() {
		super("SQLite host admission timed out; retry after transaction rollback");
		this.code = "admission-timeout";
		this.name = "SqliteWorkerAdmissionTimeoutError";
	}
});
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
//#endregion
//#region src/infra/sqlite-worker-database-admission-relay.ts
const REQUESTED$2 = 0;
const GRANTED$2 = 1;
const admissionUpstream = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionUpstream"), () => ({}));
function getSqliteDatabaseAdmissionUpstream() {
	return admissionUpstream.connection;
}
function exchangeDatabaseAdmissions(port, admissions, location, create) {
	const { port1, port2 } = new MessageChannel();
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const timing = currentSqliteOperationTiming();
	const startedAt = Date.now();
	try {
		port.postMessage({
			kind: "sqlite-database-admissions",
			admissions,
			location,
			create,
			port: port2,
			decision: decision.buffer
		}, [port2]);
		while (Atomics.load(decision, 0) === REQUESTED$2) Atomics.wait(decision, 0, REQUESTED$2);
		const outcome = Atomics.load(decision, 0);
		if (outcome === 4 && location && create === true) throw new StateDatabaseAdmissionPendingError(location, `OpenClaw state at ${location} is undergoing schema admission; retry when it finishes.`);
		if (outcome !== GRANTED$2) throw new SqliteWorkerError("SQLite admission facts exchange failed", "unavailable");
		const reply = readSqliteDatabaseAdmissions(receiveMessageOnPort(port1)?.message);
		if (!reply) throw new SqliteWorkerError("SQLite admission facts reply is unavailable", "unavailable");
		return reply;
	} finally {
		if (timing) timing.databaseAdmissionWaitMs += Date.now() - startedAt;
		port1.close();
		port2.close();
	}
}
//#endregion
//#region src/infra/sqlite-worker-operation-settlement.ts
function readNativeCommitReceipt(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence) || value.sequence < 1 || !Object.hasOwn(value, "facts")) return;
	return {
		version: 1,
		sequence: value.sequence,
		facts: value.facts
	};
}
const nativeCommitReceipts = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerNativeCommitReceipts"), () => /* @__PURE__ */ new WeakMap());
function deferSqliteWorkerNativeCommitReceipt(owner, database, facts, delivery) {
	const payloadBytes = serialize(facts).byteLength;
	if (payloadBytes > 33554432) throw new SqliteWorkerError("SQLite worker commit receipt exceeds the transport limit", "overloaded");
	const captured = structuredClone(facts);
	const anchor = sqlPublicationAnchor(database);
	const counts = owner.sourceReservations ? owner.pendingReceipts ??= /* @__PURE__ */ new Map() : void 0;
	const pending = (delta) => {
		if (!counts) return;
		const count = (counts.get(anchor) ?? 0) + delta;
		if (count === 0) counts.delete(anchor);
		else counts.set(anchor, count);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage: () => pending(1),
		rollback: () => pending(-1),
		commit() {
			pending(-1);
			const receipt = {
				version: 1,
				sequence: (nativeCommitReceipts.get(owner)?.receipt.sequence ?? 0) + 1,
				facts: captured
			};
			const retained = {
				receipt,
				payloadBytes,
				delivered: false
			};
			nativeCommitReceipts.set(owner, retained);
			owner.committed = { facts: captured };
			if (delivery === "commit") {
				owner.port.postMessage({
					kind: "native-commit",
					committed: receipt,
					payloadBytes
				}, []);
				retained.delivered = true;
			}
		}
	})) throw new Error("SQLite worker receipt requires a transaction publication owner");
}
const currentSqliteWorkerOperationAdmission = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
//#endregion
//#region src/state/openclaw-agent-execution-authority.ts
const OPEN = 0;
const CLOSING = 1;
const REVOKED = 2;
const RETIRED$1 = 3;
/** Each logical owner, native generation and borrower keeps its original cell. */
var AgentDatabaseExecutionLifetime = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	}
	get open() {
		return Atomics.load(this.state, 0) === OPEN;
	}
	close() {
		Atomics.compareExchange(this.state, 0, OPEN, CLOSING);
	}
	reopen() {
		Atomics.compareExchange(this.state, 0, CLOSING, OPEN);
	}
	revoke() {
		Atomics.store(this.state, 0, REVOKED);
	}
	retire() {
		Atomics.store(this.state, 0, RETIRED$1);
	}
};
function readAgentDatabaseExecutionAuthority(authority) {
	return Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN && Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN;
}
//#endregion
//#region src/infra/sqlite-worker-request-custody.ts
const ACTIVE = 1;
const DISPATCHED = 2;
const POST_ATTEMPTED = 4;
const CANCELED = 8;
const RETIRED = 16;
function active(state) {
	return (state & ACTIVE) !== 0 && (state & 24) === 0;
}
/** Exact buffers retain generations; request IDs never identify authority. */
function readSqliteWorkerRequestCustody(descriptor) {
	return Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0)) && Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0));
}
var SqliteWorkerSlotCustody = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
		Atomics.store(this.state, 0, 1);
	}
	createRequest() {
		return new SqliteWorkerRequestCustody(this.state);
	}
	retire() {
		Atomics.store(this.state, 0, 0);
	}
};
var SqliteWorkerRequestCustody = class {
	constructor(slot) {
		this.descriptor = {
			slot,
			request: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))
		};
	}
	activate() {
		if (Atomics.compareExchange(this.descriptor.request, 0, 0, ACTIVE) !== 0) throw new SqliteWorkerError("SQLite worker request custody was already used", "closed");
	}
	assertCurrent() {
		if (!readSqliteWorkerRequestCustody(this.descriptor)) throw new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	}
	get dispatched() {
		return (Atomics.load(this.descriptor.request, 0) & DISPATCHED) !== 0;
	}
	get postAttempted() {
		return (Atomics.load(this.descriptor.request, 0) & POST_ATTEMPTED) !== 0;
	}
	accept() {
		this.assertCurrent();
		Atomics.or(this.descriptor.request, 0, DISPATCHED);
	}
	post() {
		Atomics.or(this.descriptor.request, 0, POST_ATTEMPTED);
	}
	cancel() {
		if (!this.dispatched) Atomics.or(this.descriptor.request, 0, CANCELED);
	}
	retire() {
		Atomics.or(this.descriptor.request, 0, RETIRED);
	}
};
//#endregion
//#region src/infra/sqlite-writer-admission-client.ts
const REQUESTED$1 = 0;
const GRANTED$1 = 1;
const TIMED_OUT$1 = 3;
function assertRequestCustody(owner) {
	if (owner.requestCustody && !readSqliteWorkerRequestCustody(owner.requestCustody)) {
		const refusal = new SqliteWorkerError("SQLite worker request custody is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
	if (owner.executionAuthority && !readAgentDatabaseExecutionAuthority(owner.executionAuthority)) {
		const refusal = new SqliteWorkerError("SQLite execution authority is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
}
/** Ask the live host owner for a native stage; preparation precedes writer-lock acquisition. */
function requestSqliteWorkerOperationAdmission(request, transferList = []) {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	if (scope.owner.sourceReservations) throw new SqliteWorkerError("SQLite source reservations prohibit host admission", "closed");
	assertRequestCustody(scope.owner);
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const startedAt = Date.now();
	const deadlineNs = request.deadlineMs === void 0 ? void 0 : readSqliteWorkerMonotonicNs() + BigInt(request.deadlineMs) * 1000000n;
	scope.port.postMessage({
		...request,
		decision: decision.buffer,
		ports: transferList.filter((value) => value instanceof MessagePort)
	}, transferList);
	while (Atomics.load(decision, 0) === REQUESTED$1) {
		const remainingMs = deadlineNs === void 0 ? void 0 : Number(deadlineNs - readSqliteWorkerMonotonicNs()) / 1e6;
		if (remainingMs !== void 0 && remainingMs <= 0) Atomics.compareExchange(decision, 0, REQUESTED$1, TIMED_OUT$1);
		else Atomics.wait(decision, 0, REQUESTED$1, remainingMs);
	}
	const timing = currentSqliteOperationTiming();
	if (timing) timing.hostAdmissionWaitMs += Date.now() - startedAt;
	const outcome = Atomics.load(decision, 0);
	if (outcome === 4 && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string") {
		const databasePath = request.facts.databasePath;
		throw new StateDatabaseAdmissionPendingError(databasePath, `OpenClaw state at ${databasePath} is undergoing schema admission; retry when it finishes.`);
	}
	if (outcome !== GRANTED$1) {
		const refusal = outcome === TIMED_OUT$1 ? new SqliteWorkerAdmissionTimeoutError() : new SqliteWorkerError("SQLite transaction admission was refused", "closed");
		scope.owner.refusal = refusal;
		throw refusal;
	}
	assertRequestCustody(scope.owner);
}
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
const TIMED_OUT = 3;
const commitObserverBindings = /* @__PURE__ */ new WeakMap();
const executionAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerExecutionAuthorities"), () => /* @__PURE__ */ new WeakMap());
function bindSqliteWorkerExecutionAuthority(admission, authority) {
	if (executionAuthorities.has(admission)) throw new SqliteWorkerError("SQLite execution authority is already bound", "closed");
	executionAuthorities.set(admission, Object.freeze(authority));
}
function readSqliteWorkerExecutionAuthority(admission) {
	return executionAuthorities.get(admission);
}
/** The optional continuation runs under live host authority before releasing the native writer. */
const createSqliteWorkerOperationAdmission = (admit, attachment) => createOperationAdmission(admit, attachment);
/** Task lifetime channels relay a broker's creation grant without acquiring database authority. */
function createSqliteDatabaseAdmissionRelay(assertCurrent) {
	return createOperationAdmission(() => {
		throw new Error("Worker format facts do not grant database authority");
	}, void 0, assertCurrent);
}
function createOperationAdmission(admit, attachment, assertRelayCurrent) {
	const { port1, port2 } = new MessageChannel();
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const databaseAdmissionCursor = createSqliteDatabaseAdmissionCursor();
	const cleanupFailures = [];
	let closed = false;
	let started = false;
	let observeRequest;
	const commitObservers = [];
	let observingCommit = false;
	let failure;
	let committed;
	let nativeReceipt;
	let settlement;
	let databaseAuthority;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const recordFailure = (error, source) => {
		if (!failure || failure.source === "domain" && source !== "domain") failure = {
			error,
			source
		};
	};
	const refuse = (decision, error, source) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			recordFailure(error, source);
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const invalidProtocol = (kind, code = "outcome-unknown") => recordFailure(new SqliteWorkerError(`SQLite worker ${kind} is invalid`, code), "protocol");
	const installCommitted = (receipt) => {
		if (nativeReceipt && receipt.sequence <= nativeReceipt.sequence) return;
		nativeReceipt = receipt;
		const publication = { facts: receipt.facts };
		committed = publication;
		observingCommit = true;
		try {
			inOwnerContext(() => {
				for (const observer of commitObservers) observer(publication);
			});
		} catch (error) {
			recordFailure(Object.assign(new SqliteWorkerError("SQLite committed facts publication failed", "outcome-unknown"), { cause: error }), "protocol");
		} finally {
			observingCommit = false;
		}
	};
	const receive = (message) => {
		recordWorkerMessage(isRecord(message) && message.kind === "sqlite-database-admissions" ? "admission" : "authority", "from_worker", isRecord(message) && typeof message.payloadBytes === "number" ? message.payloadBytes : void 0);
		started = true;
		if (isRecord(message) && message.kind === "sqlite-database-admissions") {
			if (!(message.port instanceof MessagePort) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.location !== void 0 && typeof message.location !== "string" || message.create !== void 0 && typeof message.create !== "boolean" && message.create !== "admitted") {
				recordFailure(new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable"), "protocol");
				return;
			}
			const decision = new Int32Array(message.decision);
			let coldOpenPath;
			try {
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const assertRelayCreation = message.create === "admitted" ? assertRelayCurrent : void 0;
				if (message.create === "admitted" && !assertRelayCreation) throw new SqliteWorkerError("SQLite creation relay is not admitted", "closed");
				const admissions = readSqliteDatabaseAdmissions(message.admissions);
				if (!admissions) throw new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable");
				installSqliteDatabaseAdmissions(admissions);
				let location = message.location;
				let create = false;
				if (message.location && message.create && !prepareSqliteDatabaseAdmission(message.location)) {
					location = resolveIdentityPathViaExistingAncestorSync(message.location);
					const creationLocation = location;
					const authority = databaseAuthority;
					const assertCreate = authority?.assertCreate?.bind(authority);
					if (message.create === "admitted") create = true;
					else if (authority && assertCreate) {
						if (authority.coldOpenPath && resolveIdentityPathViaExistingAncestorSync(authority.coldOpenPath) === creationLocation) coldOpenPath = authority.coldOpenPath;
						inOwnerContext(() => {
							authority.assertRequest?.();
							authority.assertAccess();
							assertCreate(creationLocation);
						});
						coldOpenPath = void 0;
						create = true;
					}
				}
				if (create) assertRelayCreation?.();
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const upstream = getSqliteDatabaseAdmissionUpstream();
				if (upstream) {
					if (upstream.closed) throw new SqliteWorkerError("SQLite admission upstream is closed", "closed");
					installSqliteDatabaseAdmissions(exchangeDatabaseAdmissions(upstream.port, admissions, location, create ? "admitted" : void 0));
				} else if (location) try {
					if (create) prepareSqliteDatabaseAdmission(location, { create: true });
					retainSqliteDatabaseAdmissionLocation(location);
				} catch (error) {
					if (!isRecord(error) || error.code !== "ENOENT") throw error;
				}
				const scope = message.location === void 0 ? void 0 : {
					location: message.location,
					admissions
				};
				const reply = captureSqliteDatabaseAdmissions(databaseAdmissionCursor, scope);
				message.port.postMessage(reply, []);
				recordWorkerMessage("admission", "to_worker");
				Atomics.store(decision, 0, GRANTED);
			} catch (error) {
				if (error instanceof StateDatabaseAdmissionPendingError && error.databasePath === coldOpenPath) Atomics.store(decision, 0, 4);
				else {
					recordFailure(error, "protocol");
					Atomics.store(decision, 0, REFUSED);
				}
			} finally {
				message.port.close();
				Atomics.notify(decision, 0);
			}
			return;
		}
		if (isRecord(message) && message.kind === "native-commit") {
			const receipt = readNativeCommitReceipt(message.committed);
			if (!receipt) {
				invalidProtocol("commit receipt");
				return;
			}
			installCommitted(receipt);
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			const receipt = isRecord(value) ? readNativeCommitReceipt(value.committed) : void 0;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !receipt) {
				invalidProtocol("native settlement");
				return;
			}
			if (receipt) installCommitted(receipt);
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			invalidProtocol("admission request", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		const deadlineNs = typeof message.deadlineMs === "number" && Number.isFinite(message.deadlineMs) ? readSqliteWorkerMonotonicNs() + BigInt(Math.max(0, Math.ceil(message.deadlineMs))) * 1000000n : void 0;
		const expired = () => {
			if (deadlineNs !== void 0 && readSqliteWorkerMonotonicNs() >= deadlineNs) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT) === REQUESTED) Atomics.notify(decision, 0);
			}
			if (Atomics.load(decision, 0) !== TIMED_OUT) return false;
			if (Array.isArray(message.ports)) {
				for (const port of message.ports) if (port instanceof MessagePort) port.close();
			}
			return true;
		};
		if (expired()) return;
		decisions.add(decision);
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		try {
			inOwnerContext(() => observeRequest?.(request));
		} catch (error) {
			refuse(decision, error, "domain");
			return;
		}
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			return;
		}
		const grant = (beforeRelease) => {
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			try {
				inOwnerContext(() => databaseAuthority?.assertAccess());
			} catch (error) {
				refuse(decision, error, "authority");
				return false;
			}
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			beforeRelease?.();
			if (expired()) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		let source = "authority";
		try {
			inOwnerContext(() => {
				databaseAuthority?.assertRequest?.();
				databaseAuthority?.assertAccess();
			});
			if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance") {
				const authority = databaseAuthority;
				if (!authority || typeof request.facts.databasePath !== "string" || resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) !== authority.databasePath) throw new SqliteWorkerError("SQLite schema maintenance target differs from its admitted database", "closed");
				inOwnerContext(() => {
					authority.lease ??= authority.acquireSchema();
					authority.lease.assertCurrent();
					grant();
				});
			} else {
				source = "domain";
				inOwnerContext(admit, request, grant);
			}
		} catch (error) {
			if (error instanceof StateDatabaseAdmissionPendingError && databaseAuthority?.coldOpenPath === error.databasePath && !databaseAuthority.lease && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string" && resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) === databaseAuthority.databasePath) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, 4) === REQUESTED) Atomics.notify(decision, 0);
			} else refuse(decision, error, source);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"), "domain");
	};
	port1.on("message", receive).unref();
	const service = () => {
		if (observingCommit) return;
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	const admission = {
		port: port2,
		attachment: attachment === void 0 ? void 0 : { value: attachment },
		observeRequests(observer) {
			if (closed || observeRequest) throw new SqliteWorkerError("SQLite request observation is already bound or closed", "closed");
			observeRequest = observer;
		},
		bindDatabaseAuthority(authority) {
			if (closed || databaseAuthority) throw new SqliteWorkerError("SQLite database authority is already bound or closed", "closed");
			databaseAuthority = { ...authority };
		},
		get failure() {
			return failure?.error;
		},
		get failureSource() {
			return failure?.source;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure.error, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			port1.close();
			port2.close();
			if (databaseAuthority?.lease) try {
				databaseAuthority.lease.release();
				databaseAuthority.lease = void 0;
			} catch (error) {
				cleanupFailures.push(error);
			}
		}
	};
	commitObserverBindings.set(admission, (observer) => {
		if (closed || started) throw new SqliteWorkerError("SQLite commit observation is closed or started", "closed");
		commitObservers.push(observer);
	});
	return admission;
}
/** Record facts only after the real transaction commits, before native settlement is announced. */
function deferSqliteWorkerCommitReceipt(database, facts, delivery = "commit") {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite receipt requires its retained admission", "unavailable");
	deferSqliteWorkerNativeCommitReceipt(scope.owner, database, facts, delivery);
}
/** Schema work borrows live host authority through the same retained job port. */
function requestSqliteWorkerSchemaMaintenance(databasePath) {
	if (!currentSqliteWorkerOperationAdmission.getStore()) return false;
	requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: {
			kind: "schema-maintenance",
			databasePath
		}
	});
	return true;
}
//#endregion
//#region src/shared/store-writer-queue.ts
const MAX_WRITERS_PER_TURN = 4;
const WRITER_TURN_BUDGET_MS = 4;
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
const writerTurn = resolveGlobalSingleton(Symbol.for("openclaw.storeWriterTurn"), () => ({
	started: 0,
	startedAt: 0,
	reset: void 0,
	wait: void 0
}));
function claimStoreWriterTurn(immediate) {
	const now = performance$1.now();
	if (!writerTurn.reset) {
		writerTurn.started = 0;
		writerTurn.startedAt = now;
		writerTurn.reset = setImmediate$1().then(() => {
			writerTurn.reset = void 0;
		});
	}
	if (!immediate && (writerTurn.wait || writerTurn.started >= MAX_WRITERS_PER_TURN || now - writerTurn.startedAt >= WRITER_TURN_BUDGET_MS)) return writerTurn.wait ??= setImmediate$1().then(() => {
		writerTurn.wait = void 0;
	});
	writerTurn.started++;
}
function isActiveStoreWriter(queues, storePath, keys) {
	if (!queues.has(storePath)) return false;
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) {
			const heldKeys = active.keys;
			if (heldKeys && (!keys || [...keys].some((key) => !heldKeys.has(key)))) throw new Error("Cannot expand an active store writer's keys");
			return true;
		}
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn, timing, keys) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath,
		keys
	};
	if (timing) {
		timing.reentrant = false;
		timing.startedAt = performance$1.now();
	}
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		if (timing) timing.finishedAt = performance$1.now();
		writer.active = false;
	}
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue || queue.drainPromise) return;
	const drain = createDeferredCore();
	queue.drainPromise = drain.promise;
	const heldKeys = /* @__PURE__ */ new Set();
	let active = 0;
	let changed = createDeferredCore();
	queue.wake = () => changed.resolve();
	let first = true;
	try {
		while (queue.pending.length > 0 || active > 0) {
			const blocked = /* @__PURE__ */ new Set();
			let task;
			for (const pending of queue.pending) {
				const keys = pending.keys;
				if (!keys) {
					if (active === 0 && blocked.size === 0) task = pending;
					break;
				}
				if (![...keys].some((key) => heldKeys.has(key) || blocked.has(key))) {
					task = pending;
					break;
				}
				for (const key of keys) blocked.add(key);
			}
			if (!task) {
				await changed.promise;
				changed = createDeferredCore();
				continue;
			}
			let wait;
			while (wait = claimStoreWriterTurn(first)) await wait;
			first = false;
			const index = queue.pending.indexOf(task);
			if (index < 0) continue;
			queue.pending.splice(index, 1);
			if (!task.keys) {
				await task.fn().then(task.resolve, task.reject);
				continue;
			}
			const keys = task.keys;
			for (const key of keys) heldKeys.add(key);
			active++;
			const finish = () => {
				for (const key of keys) heldKeys.delete(key);
				active--;
				queue.wake?.();
			};
			task.fn().then((value) => {
				finish();
				task.resolve(value);
			}, (error) => {
				finish();
				task.reject(error);
			});
		}
	} finally {
		queue.drainPromise = null;
		queue.wake = void 0;
		queues.delete(storePath);
		drain.resolve();
	}
}
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	params.signal?.throwIfAborted();
	const keys = params.keys?.length ? new Set(params.keys) : void 0;
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath, keys)) {
		if (params.timing) {
			params.timing.reentrant = true;
			params.timing.startedAt = performance$1.now();
		}
		try {
			return await params.fn();
		} finally {
			if (params.timing) params.timing.finishedAt = performance$1.now();
		}
	}
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	let existingQueue = params.queues.get(params.storePath);
	if (!existingQueue) {
		existingQueue = {
			pending: [],
			drainPromise: null
		};
		params.queues.set(params.storePath, existingQueue);
	}
	const queue = existingQueue;
	let detach = () => {};
	const completion = new Promise((resolve, reject) => {
		detach = () => params.signal?.removeEventListener("abort", abort);
		const abort = () => {
			const index = queue.pending.indexOf(task);
			if (index !== -1) {
				queue.pending.splice(index, 1);
				task.reject(params.signal?.reason);
				queue.wake?.();
			}
		};
		const task = {
			keys,
			fn: async () => {
				detach();
				return await runInAsyncContext(runActiveStoreWriter, params.queues, params.storePath, params.fn, params.timing, keys);
			},
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		queue.wake?.();
		params.signal?.addEventListener("abort", abort, { once: true });
		runInDetachedAsyncContext(() => void drainStoreWriterQueue(params.queues, params.storePath));
	});
	if (params.signal) completion.then(detach, detach);
	return await completion;
}
//#endregion
//#region src/state/openclaw-agent-write-admission-state.ts
const agentDatabaseWriteAdmissionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({ queues: /* @__PURE__ */ new Map() }));
agentDatabaseWriteAdmissionState.queues;
//#endregion
//#region src/infra/worker-task-pool-registry.ts
const livePools = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
const liveWorkerTaskPools = {
	register(pool) {
		livePools.add(pool);
		return pool;
	},
	async close(pool, closures, finish) {
		await joinOwnedWorkerTasks(closures);
		await finish();
		livePools.delete(pool);
	}
};
//#endregion
//#region src/infra/worker-task-host.ts
const diagnosticTaskKinds = /* @__PURE__ */ new Set([
	"prepare",
	"prepare-session",
	"transcript-stats",
	"session-entry",
	"session-entries",
	"session-cleanup",
	"session-memory-capture",
	"history-page",
	"historical-eviction-candidates",
	"usage-cost",
	"model-context",
	"context-messages",
	"transcript-search"
]);
const prepareResources = createLazyRuntimeModule(() => import("./sqlite-readonly-temp-artifact-cleanup-pslN9iy0.mjs"));
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskDatabaseAdmissionChannels"), () => /* @__PURE__ */ new Map());
function createWorkerTaskHost(owner = {}, workerClass) {
	const boundedHeap = workerClass && workerClass !== "writer" && workerClass !== "singleton";
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		maxWorkers: workerClass ? resolveWorkerPoolSize(workerClass) : void 0,
		requiresReady: owner.retainedTransport,
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (boundedHeap) {
				const limits = workerOptions.resourceLimits;
				workerOptions.resourceLimits = {
					maxOldGenerationSizeMb: limits?.maxOldGenerationSizeMb ?? 512,
					maxYoungGenerationSizeMb: limits?.maxYoungGenerationSizeMb,
					codeRangeSizeMb: limits?.codeRangeSizeMb,
					stackSizeMb: limits?.stackSizeMb
				};
			}
			if (owner.retainedTransport) {
				const { port1, port2 } = new MessageChannel();
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource, {
					host: port1,
					worker: port2
				});
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		serviceNativeWorkers(workers) {
			for (const { owner: admission } of admissions.values()) admission.service();
			workers[0]?.service();
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext(worker) {
			let admission = admissions.get(worker);
			if (!admission) {
				admission = {
					owner: runInDetachedAsyncContext(() => createSqliteDatabaseAdmissionRelay(() => {
						if (admissions.get(worker)?.retiring !== false) throw new Error("SQLite creation relay's task worker is retiring");
					})),
					sent: false,
					retiring: false
				};
				admissions.set(worker, admission);
				const retained = admission;
				worker.once("exit", () => {
					retained.owner.finish();
					admissions.delete(worker);
				});
			}
			const context = {
				deletedAgentDatabaseFences: captureDeletedAgentDatabaseFences(),
				...!admission.sent ? { databaseAdmissionPort: admission.owner.port } : {}
			};
			admission.sent = true;
			return context;
		},
		taskContextTransferList(context) {
			const captured = context;
			return captured.databaseAdmissionPort ? [captured.databaseAdmissionPort] : [];
		},
		createTaskObserver(url) {
			const kind = workerRequestKind(url);
			return (operation) => trackWorkerRequest(kind, operation === void 0 ? "task" : classifyWorkerRequest(operation));
		},
		describeTask(url, input) {
			const kind = input !== null && typeof input === "object" ? Object.getOwnPropertyDescriptor(input, "kind")?.value : void 0;
			const operation = typeof kind === "string" && diagnosticTaskKinds.has(kind) ? kind : "task";
			return `${workerRequestKind(url)}.${operation}`;
		},
		receiveMessage: receiveWorkerMemoryPort,
		observeResourceReply: () => recordWorkerMessage("resource", "from_worker"),
		workerStarted(worker, pool) {
			if (owner.databaseAccess !== "read-only") trackSqliteDatabaseAdmissionWorker(worker);
			attributeWorkerToPool(worker, pool);
		},
		workerRetiring(worker, reason) {
			const admission = admissions.get(worker);
			if (admission) admission.retiring = true;
			markWorkerRetirement(worker, reason);
		},
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Internal resource owners can retain task custody or use settled ordinary reads. */
function createOwnedWorkerTaskPool(options, ownerOptions) {
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions, options.workerClass), void 0, ownerOptions);
	return {
		run: (input, taskOptions) => core.run(input, taskOptions),
		rotate: () => core.rotate(),
		runTask: (input, taskOptions) => core.runTask(input, taskOptions),
		startTask: (input, taskOptions) => core.startTask(input, taskOptions),
		closeResources: (key) => core.startCloseResources(key).result,
		startCloseResources: (key) => core.startCloseResources(key),
		startRotate: () => core.startRotate(),
		getSnapshot: () => core.getSnapshot(),
		close: (error) => core.close(error)
	};
}
//#endregion
export { resolveSqliteBrokerWorkerCount as A, trackWorkerRequest as C, registerAgentDatabaseReaderCloser as D, matchesAgentDatabaseReadCandidatePath as E, readProcessGroupMembers as O, classifyWorkerRequest as S, isDeletedAgentDatabasePath as T, SqliteWorkerOpenRefusedError as _, createSqliteWorkerOperationAdmission as a, DEFAULT_WORKER_PENDING_BYTES as b, requestSqliteWorkerSchemaMaintenance as c, readSqliteWorkerRequestCustody as d, AgentDatabaseExecutionLifetime as f, SqliteWorkerError as g, SqliteWorkerAdmissionTimeoutError as h, bindSqliteWorkerExecutionAuthority as i, resolveStateReadWorkerCount as j, BrokerChild as k, requestSqliteWorkerOperationAdmission as l, SQLITE_WORKER_MAX_MESSAGE_BYTES as m, agentDatabaseWriteAdmissionState as n, deferSqliteWorkerCommitReceipt as o, currentSqliteWorkerOperationAdmission as p, runQueuedStoreWrite as r, readSqliteWorkerExecutionAuthority as s, createOwnedWorkerTaskPool as t, SqliteWorkerSlotCustody as u, retainSqliteWorkerErrorCode as v, withSqliteWorkerReservationObservation as w, captureRetainedNativeWorkerSource as x, WorkerTaskError as y };

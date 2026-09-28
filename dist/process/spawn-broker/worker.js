import { spawn, spawnSync } from "node:child_process";
import { Socket, createConnection, createServer } from "node:net";
import fsSync, { opendirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { stripVTControlCharacters } from "node:util";
import { execa } from "execa";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { Transform } from "node:stream";
import { deserialize, serialize } from "node:v8";
//#region packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
}
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
			signalProcessTreeWindows(pid, "SIGKILL");
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
		return true;
	} catch {
		return false;
	}
}
function parseProcessGroupId(value) {
	if (typeof value !== "string" || !/^\d+$/.test(value.trim())) return;
	const pgid = Number(value.trim());
	return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readProcessGroupIdFromPs(pid) {
	try {
		const res = spawnSync("ps", [
			"-p",
			String(pid),
			"-o",
			"pgid="
		], {
			encoding: "utf8",
			timeout: 500
		});
		if (res.error || res.status !== 0) return;
		return parseProcessGroupId(res.stdout);
	} catch {
		return;
	}
}
function readProcessGroupIdFromProc(pid) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		return parseProcessGroupId(stat.slice(commEnd + 1).trim().split(/\s+/)[2]);
	} catch {
		return;
	}
}
/** Fail closed to direct-PID signaling when group ownership cannot be proved. */
function isProcessGroupLeader(pid) {
	return ((process.platform === "linux" ? readProcessGroupIdFromProc(pid) : void 0) ?? readProcessGroupIdFromPs(pid)) === pid;
}
function parsePositivePids(value) {
	if (typeof value !== "string") return [];
	return value.trim().split(/\s+/u).map((entry) => Number(entry)).filter((entry) => Number.isSafeInteger(entry) && entry > 0);
}
/**
* Read a stable process-instance identity for `pid`. Linux `starttime` from
* `/proc/<pid>/stat` distinguishes recycled PIDs. Other Unix platforms do not
* expose a sufficiently precise portable identity, so attached snapshots stay
* disabled there rather than authorizing a stale signal.
*/
function readUnixProcessIdentity(pid, deadlineMs) {
	return readUnixProcessInstance(pid, deadlineMs)?.identity;
}
/**
* Read a process-instance identity and its current parent PID from
* `/proc/<pid>/stat`. The `ppid` lets the caller revalidate that a numeric PID
* reported by `/proc/<parent>/children` still belongs to the verified parent at
* capture time, so a PID reused between the children read and this read cannot
* be admitted as an authorized descendant.
*/
function readUnixProcessInstance(pid, deadlineMs) {
	if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return;
	if (process.platform !== "linux") return;
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		const fields = stat.slice(commEnd + 1).trim().split(/\s+/);
		const ppid = Number(fields[1]);
		const starttime = fields[19];
		if (!starttime || !/^\d+$/u.test(starttime) || !Number.isSafeInteger(ppid)) return;
		return {
			identity: `${pid}:${starttime}`,
			ppid
		};
	} catch {
		return;
	}
}
/**
* True when the captured process instance is still alive at the same identity.
* Missing identities are never eligible for an attached-tree signal.
*/
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
/**
* Capture an attached process tree before signaling its root.
* Descendants are returned first so they retain their parent relationship.
*
* Each entry carries a stable process-instance identity captured at discovery
* time so delayed grace-period signals can be verified against the original
* instance instead of a numeric PID that may have been recycled. A descendant
* whose identity cannot be captured is omitted (fail-closed for that subtree)
* rather than retained as an identity-less PID that a delayed signal could
* target after reuse. The supervisor-owned root PID is always trusted as the
* caller's direct child, so the snapshot always contains it once the root's own
* identity verifies, even when every descendant probe fails.
*/
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
		try {
			process.kill(entry.pid, signal);
		} catch {}
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
		signalProcessTreeWindows(pid, "SIGKILL");
	};
	signalProcessTreeWindows(pid, "SIGTERM", (code) => {
		if (code !== null && code !== 0) forceKill();
	});
	graceTimer = setTimeout(forceKill, graceMs);
	graceTimer.unref();
}
function signalProcessTreeWindows(pid, signal, onExit) {
	signalProcessTreeWindowsAndWait(pid, signal, onExit);
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
//#region src/shared/pid-alive.ts
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Check if every thread has exited by reading Linux /proc/<pid>/status.
* Returns false on non-Linux platforms or if the proc file can't be read.
*/
function isZombieProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fsSync.readFileSync(`/proc/${pid}/status`, "utf8");
		return status.match(/^State:\s+(\S)/m)?.[1] === "Z" && /^Threads:[ \t]+1[ \t]*$/m.test(status);
	} catch {
		return false;
	}
}
/** Returns true only when the PID is invalid, missing, or known to be a Linux zombie. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (err) {
		return err.code === "ESRCH";
	}
	return isZombieProcess(pid);
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
/** The caller supplies native command inspection; the standalone group worker stays dependency-free. */
function* readProcessGroupMembers(timeoutMs, commandInspection) {
	const includeCommand = commandInspection !== void 0;
	if (process.platform === "linux") {
		const deadline = Date.now() + timeoutMs;
		for (const name of readdirSync("/proc")) {
			if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			if (!/^\d+$/.test(name)) continue;
			const pid = Number(name);
			let stat;
			let argv;
			try {
				stat = readFileSync(`/proc/${name}/stat`, "utf8");
				if (includeCommand) argv = readFileSync(`/proc/${name}/cmdline`, "utf8").split("\0").filter(Boolean);
			} catch (error) {
				if (pid !== process.pid && ["ENOENT", "ESRCH"].includes(extractErrorCode(error) ?? "")) continue;
				throw error;
			}
			const match = /^(\d+) \([\s\S]*\) (\S) (\d+) (\d+)(?:\s|$)/.exec(stat);
			if (!match || Number(match[1]) !== pid || Date.now() >= deadline) throw new Error("Process group census is unavailable");
			if (argv?.length === 0) {
				const flags = Number(stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[6]);
				if (!(Number.isInteger(flags) && (flags & 2097152) !== 0) && !isPidDefinitelyDead(pid)) throw new Error(`Cannot identify live process ${pid}`);
			}
			yield {
				pid,
				pgid: Number(match[4]),
				state: match[2],
				...argv ? { command: {
					ppid: Number(match[3]),
					argv
				} } : {}
			};
		}
		if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
		return;
	}
	if (includeCommand && process.platform !== "darwin") throw new Error(`Exact process command census is unavailable on ${process.platform}.`);
	const deadline = Date.now() + timeoutMs;
	const census = spawnSync("/bin/ps", [
		"-A",
		"-o",
		includeCommand ? "pid=,pgid=,stat=,ppid=,uid=" : "pid=,pgid=,stat="
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		maxBuffer: 4194304
	});
	if (census.error || census.status !== 0) throw new Error("Process group census is unavailable");
	for (const line of census.stdout.split("\n")) {
		if (!line.trim()) continue;
		const match = includeCommand ? /^\s*(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(-?\d+)\s*$/.exec(line) : /^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(line);
		if (!match) throw new Error("Process group census is unavailable");
		const pid = Number(match[1]);
		if (pid !== census.pid) {
			if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			const command = includeCommand ? match[3].startsWith("Z") || pid === 0 ? { argv: [] } : commandInspection?.readDarwinCommand(pid, Number(match[5]) >>> 0) : void 0;
			if (includeCommand && !command) continue;
			yield {
				pid,
				pgid: Number(match[2]),
				state: match[3],
				...command ? { command: {
					ppid: Number(match[4]),
					...command
				} } : {}
			};
		}
	}
	if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
}
/** Advisory retirement timing only; the host owns kernel group-disappearance proof. */
function hasLiveOwnedProcessGroupMembers(timeoutMs = 1e3) {
	let observedOwner = false;
	try {
		for (const { pid, pgid, state } of readProcessGroupMembers(Math.max(1, Math.min(1e3, timeoutMs)))) if (pid === process.pid) {
			if (pgid !== process.pid) return;
			observedOwner = true;
		} else if (pgid === process.pid && (!state.startsWith("Z") || process.platform === "linux" && !isPidDefinitelyDead(pid))) return true;
	} catch {
		return;
	}
	return observedOwner ? false : void 0;
}
//#endregion
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
/** Keep the authoritative prefix and replace only exactly matching output suffixes. */
function encodeExecaMessage(message, output) {
	const outputs = [];
	let end = message.length;
	for (const stream of ["stdout", "stderr"]) {
		const rendered = renderOutput(output[stream]);
		if (!rendered) continue;
		const start = end - rendered.length;
		if (start < 2 || !message.endsWith(rendered, end) || message.slice(start - 2, start) !== "\n\n") return { message };
		outputs.unshift(stream);
		end = start - 2;
	}
	return outputs.length > 0 ? {
		message: message.slice(0, end),
		messageOutputs: outputs
	} : { message };
}
//#endregion
//#region src/process/spawn-broker/execa-protocol.ts
function serializeExecaError(error, output = {}) {
	return {
		name: error.name,
		...encodeExecaMessage(error.message, output),
		..."code" in error && typeof error.code === "string" ? { code: error.code } : {},
		...error.cause instanceof Error ? { cause: serializeExecaError(error.cause) } : {}
	};
}
//#endregion
//#region src/process/spawn-broker/execa-output.ts
/** Execa retains its reader; the Gateway receives a separate native output socket. */
async function createExecaOutput() {
	const directory = await mkdtemp(path.join(tmpdir(), "oc-spawn-"));
	const server = createServer({ pauseOnConnect: true });
	let writer;
	let receiver;
	try {
		const socketPath = path.join(directory, "out");
		server.listen(socketPath);
		await once(server, "listening");
		const accepted = new Promise((resolve) => {
			server.once("connection", resolve);
		});
		receiver = createConnection(socketPath);
		[writer] = await Promise.all([accepted, once(receiver, "connect")]);
		const destination = writer;
		const transform = new Transform({
			transform(chunk, _encoding, callback) {
				destination.write(chunk, (error) => callback(error, chunk));
			},
			flush(callback) {
				destination.end(callback);
			},
			destroy(error, callback) {
				destination.destroy();
				callback(error);
			}
		});
		destination.on("error", (error) => transform.destroy(error));
		destination.once("close", () => {
			if (!destination.writableFinished) transform.destroy();
		});
		return {
			receiver,
			transform
		};
	} catch (error) {
		writer?.destroy();
		receiver?.destroy();
		throw error;
	} finally {
		server.close();
		await rm(directory, {
			recursive: true,
			force: true
		});
	}
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
/** Stop the sender's libuv reader before Node detaches the socket for IPC. */
function holdPipeForTransfer(socket) {
	stopPipeReads(socket);
	holdPipe(socket);
}
function stopPipeReads(socket) {
	const handle = Reflect.get(socket, "_handle");
	if (!handle || typeof handle !== "object" || !("readStop" in handle) || typeof handle.readStop !== "function" || !("reading" in handle) || typeof handle.reading !== "boolean") throw new SpawnBrokerError("Spawn broker requires a transferable Node pipe handle");
	if (handle.readStop() !== 0) throw new SpawnBrokerError("Spawn broker could not stop pipe reads");
	handle.reading = false;
}
/** Called after send's callback, when keepOpen:false has detached the native handle. */
function takePipePrefix(socket) {
	const held = readers.get(socket);
	if (!held) throw new Error("Spawn broker pipe was not held for handoff");
	const buffered = held.read.call(socket, socket.readableLength);
	restoreReader(socket);
	if (buffered === null) return Buffer.alloc(0);
	if (!Buffer.isBuffer(buffered)) throw new Error("Spawn broker pipe must contain bytes");
	return buffered;
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
//#region src/process/spawn-broker/execa-worker.ts
function outputOption(options, fd) {
	const explicit = fd === 1 ? options.stdout : options.stderr;
	if (explicit !== void 0) return explicit;
	return typeof options.stdio === "string" ? options.stdio : options.stdio?.[fd] ?? "pipe";
}
/** Spawn only after preparing bounded output paths, before the command can produce bytes. */
async function startBrokerExeca(argv, options, assertCurrent) {
	const controller = new AbortController();
	const outputs = /* @__PURE__ */ new Map();
	try {
		for (const fd of [1, 2]) {
			const name = fd === 1 ? "stdout" : "stderr";
			const buffered = typeof options.buffer === "boolean" ? options.buffer : options.buffer?.[name];
			if (outputOption(options, fd) === "pipe" && buffered !== false) outputs.set(fd, await createExecaOutput());
		}
		assertCurrent();
		const { encoding, ...processOptions } = options;
		const spawnOptions = {
			...processOptions,
			...outputs.has(1) ? { stdout: {
				transform: outputs.get(1).transform,
				objectMode: false
			} } : {},
			...outputs.has(2) ? { stderr: {
				transform: outputs.get(2).transform,
				objectMode: false
			} } : {},
			cancelSignal: controller.signal
		};
		const subprocess = encoding === void 0 || encoding === "utf8" || encoding === "utf16le" ? execa(argv[0], argv.slice(1), {
			...spawnOptions,
			encoding
		}) : execa(argv[0], argv.slice(1), {
			...spawnOptions,
			encoding
		});
		const child = subprocess.nodeChildProcess;
		const stdio = [
			0,
			1,
			2
		].map((fd) => {
			if (fd === 0 && options.input !== void 0) return null;
			if (fd > 0 && outputOption(options, fd === 1 ? 1 : 2) !== "pipe") return null;
			const stream = outputs.get(fd)?.receiver ?? child.stdio[fd];
			if (!(stream instanceof Socket)) return null;
			if (fd > 0) holdPipeForTransfer(stream);
			return stream;
		});
		const result = subprocess.then(serializeResult, (error) => {
			if (error instanceof Error && "failed" in error && error.failed === true) return serializeResult(error);
			throw error;
		});
		result.catch(() => {});
		return {
			child,
			stdio,
			result,
			cancel: () => controller.abort(),
			kill: (signal) => subprocess.kill(signal),
			outputDrained(fd, error) {
				const output = outputs.get(fd);
				if (output) {
					output.receiver.destroy();
					if (error) output.transform.destroy(error);
					return;
				}
				if (fd === 0 && !error) {
					child.stdin?.end();
					return;
				}
				child.stdio[fd]?.destroy(error);
			}
		};
	} catch (error) {
		for (const output of outputs.values()) {
			output.transform.destroy();
			output.receiver.destroy();
		}
		throw error;
	}
}
function serializeResult(result) {
	const output = {
		stdout: byteOrTextOutput(result.stdout),
		stderr: byteOrTextOutput(result.stderr)
	};
	return {
		...output,
		exitCode: result.exitCode,
		signal: result.signal,
		failed: result.failed,
		timedOut: result.timedOut,
		isCanceled: result.isCanceled,
		isGracefullyCanceled: result.isGracefullyCanceled,
		isMaxBuffer: result.isMaxBuffer,
		isTerminated: result.isTerminated,
		isForcefullyTerminated: result.isForcefullyTerminated,
		shortMessage: result.shortMessage,
		originalMessage: result.originalMessage,
		code: result.code,
		command: result.command,
		escapedCommand: result.escapedCommand,
		cwd: result.cwd,
		durationMs: result.durationMs,
		signalDescription: result.signalDescription,
		...result instanceof Error ? { error: serializeExecaError(result, output) } : {}
	};
}
function byteOrTextOutput(output) {
	if (output === void 0 || typeof output === "string" || output instanceof Uint8Array) return output;
	throw new TypeError("Spawn broker execa output must contain bytes or text");
}
//#endregion
//#region src/process/spawn-broker/ipc.ts
const FRAME_BYTES = 1048576;
const MAX_PENDING_BYTES = 268435456;
const MAX_PENDING_MESSAGES = 1024;
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
		if (bytes + size > MAX_PENDING_BYTES || messages >= MAX_PENDING_MESSAGES) return Promise.reject(new SpawnBrokerError("Spawn broker IPC capacity exceeded"));
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
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > MAX_PENDING_BYTES || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending.get(frame.id);
			if (!assembly) {
				if (frame.offset !== 0 || pending.size >= MAX_PENDING_MESSAGES || reserved + frame.total > MAX_PENDING_BYTES) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
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
//#region src/process/spawn-broker/worker-sender.ts
/** A receipt keeps Node's internal handle queue empty before inspecting the next socket. */
function createWorkerSender(send) {
	let pending;
	let closed;
	const finish = (pipe, error) => {
		if (pending !== pipe) return;
		pending = void 0;
		pipe.callback(error);
	};
	const sender = createBrokerSender((message, handle, callback) => {
		if (closed) {
			callback(closed);
			return;
		}
		if (!(handle instanceof Socket) || !message || typeof message !== "object" || !("type" in message) || message.type !== "pipe" || !("id" in message) || typeof message.id !== "number" || !("fd" in message) || typeof message.fd !== "number") {
			send(message, handle, callback);
			return;
		}
		const pipe = {
			id: message.id,
			fd: message.fd,
			written: false,
			received: false,
			callback
		};
		pending = pipe;
		const stdinClosed = message.fd === 0 && handle.destroyed;
		try {
			send(stdinClosed ? {
				...message,
				closed: true
			} : message, stdinClosed ? void 0 : handle, (error) => {
				if (error) {
					finish(pipe, error);
					return;
				}
				pipe.written = true;
				if (pipe.received) finish(pipe, null);
			});
		} catch (error) {
			pending = void 0;
			throw error;
		}
	});
	return {
		send: sender,
		reserve(run) {
			return sender.reserve(async (publish) => {
				if (closed) throw closed;
				return await run(publish);
			});
		},
		acknowledge(id, fd) {
			if (!pending || pending.id !== id || pending.fd !== fd) return;
			pending.received = true;
			if (pending.written) finish(pending, null);
		},
		close(error) {
			closed = error;
			if (pending) finish(pending, error);
		}
	};
}
//#endregion
//#region src/process/spawn-broker/worker.ts
const owned = /* @__PURE__ */ new Map();
const receiver = createBrokerReceiver();
let stopping = false;
const starting = /* @__PURE__ */ new Map();
const sender = createWorkerSender((message, handle, callback) => {
	if (!process.send || !process.connected) {
		callback(/* @__PURE__ */ new Error("Spawn broker parent disconnected"));
		return;
	}
	process.send(message, handle, { keepOpen: false }, callback);
});
function report(message, handle) {
	return sender.send(message, handle).catch((error) => {
		shutdown();
		throw error;
	});
}
function forget(id, entry) {
	if (entry.announced && entry.exited && entry.resultSettled && entry.openPipes.size === 0) owned.delete(id);
}
function shutdown() {
	if (stopping) return;
	stopping = true;
	sender.close(/* @__PURE__ */ new Error("Spawn broker parent disconnected"));
	receiver.clear();
	const terminations = [];
	for (const entry of owned.values()) {
		if (entry.child.connected) entry.child.disconnect();
		if (entry.child.pid) terminations.push(killProcessTree(entry.child.pid, {
			detached: entry.detached,
			graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
		}));
	}
	const signalGroup = (signal) => {
		try {
			process.kill(-process.pid, signal);
		} catch {}
	};
	const finish = () => {
		for (const termination of terminations) termination?.force();
		signalGroup("SIGKILL");
		process.exit(0);
	};
	signalGroup("SIGTERM");
	if (owned.size === 0 && starting.size === 0 && hasLiveOwnedProcessGroupMembers() === false) {
		finish();
		return;
	}
	setTimeout(finish, 5250);
}
function disposeFailedChild(child) {
	if (!child) return;
	child.once("error", () => {});
	if (child.pid) child.kill("SIGKILL");
	if (child.connected) child.disconnect();
	for (const stream of child.stdio ?? []) stream?.destroy();
}
async function launch(message) {
	if (stopping || owned.size + starting.size >= 256) {
		const error = new SpawnBrokerError("Spawn broker request capacity exceeded");
		await report({
			type: "execa-result",
			id: message.id,
			result: {
				failed: true,
				code: error.code,
				timedOut: false,
				isCanceled: false,
				isGracefullyCanceled: false,
				isMaxBuffer: false,
				isTerminated: false,
				isForcefullyTerminated: false,
				command: "",
				escapedCommand: "",
				cwd: process.cwd(),
				durationMs: 0,
				error: serializeExecaError(error)
			}
		});
		await report({
			type: "error",
			id: message.id,
			error: serializeBrokerError(error),
			resultUnavailable: true
		});
		return;
	}
	const pending = {};
	starting.set(message.id, pending);
	let spawnedChild;
	const assertActive = () => {
		if (stopping || !process.connected) throw new Error("Spawn broker is stopping");
	};
	try {
		const admission = await sender.reserve(async (publish) => {
			assertActive();
			const execa = message.type === "spawn-execa" ? await startBrokerExeca(message.argv, message.options, assertActive) : void 0;
			const child = execa?.child ?? (message.type === "spawn" ? spawn(message.argv[0], message.argv.slice(1), message.options) : void 0);
			spawnedChild = child;
			if (!child) throw new Error("Spawn broker command did not start");
			if (!execa) {
				if (child.stdio === void 0) {
					const closed = new Promise((resolve) => {
						child.once("close", () => resolve());
					});
					const error = await new Promise((resolve) => {
						child.once("error", resolve);
					});
					await closed;
					throw error;
				}
				for (const [fd, stream] of child.stdio.entries()) if (fd > 0 && stream instanceof Socket) holdPipeForTransfer(stream);
			}
			if (execa && !child.pid) {
				for (const [fd] of execa.stdio.entries()) execa.outputDrained(fd);
				disposeFailedChild(child);
				return {
					type: "failed",
					execa
				};
			}
			const current = {
				child,
				detached: message.options.detached === true || message.type === "spawn-execa" && message.options.killDescendants === true,
				execa,
				announced: false,
				events: [],
				exited: false,
				resultSettled: !execa,
				openPipes: new Set((execa?.stdio ?? child.stdio).flatMap((stream, fd) => stream instanceof Socket ? [fd] : []))
			};
			owned.set(message.id, current);
			if (pending.canceled) execa?.cancel();
			if (pending.signal !== void 0) (execa?.kill ?? child.kill.bind(child))(pending.signal);
			const event = (value) => {
				if (current.announced) report(value).catch(() => {});
				else if (current.events.length < 32) current.events.push(value);
				else {
					child.kill("SIGKILL");
					shutdown();
				}
			};
			child.on("error", (error) => event({
				type: "error",
				id: message.id,
				error: serializeBrokerError(error)
			}));
			child.on("message", (payload) => event({
				type: "ipc",
				id: message.id,
				message: payload
			}));
			child.once("disconnect", () => event({
				type: "disconnect",
				id: message.id
			}));
			child.once("exit", (code, signal) => event({
				type: "exit",
				id: message.id,
				code,
				signal
			}));
			child.once("close", () => {
				event({
					type: "closed",
					id: message.id
				});
				current.exited = true;
				forget(message.id, current);
			});
			if (execa) execa.result.then(async (result) => {
				event({
					type: "execa-result",
					id: message.id,
					result
				});
				current.resultSettled = true;
				forget(message.id, current);
			}).catch((error) => {
				event({
					type: "error",
					id: message.id,
					error: serializeBrokerError(toErrorObject(error, "Spawn broker execa result failed")),
					resultUnavailable: true
				});
				current.resultSettled = true;
				forget(message.id, current);
			});
			if (!execa) await new Promise((resolve, reject) => {
				child.once("spawn", resolve);
				child.once("error", reject);
			});
			if (!child.pid) throw new Error("Spawn broker command has no process identifier");
			await publish({
				type: "owned",
				id: message.id,
				pid: child.pid
			});
			return {
				type: "started",
				entry: current
			};
		});
		if (admission.type === "failed") {
			const result = await admission.execa.result;
			await report({
				type: "execa-result",
				id: message.id,
				result
			});
			await report({
				type: "error",
				id: message.id,
				error: {
					message: result.error?.message ?? result.shortMessage ?? "Command could not be spawned",
					code: result.code
				}
			});
			return;
		}
		const current = admission.entry;
		const { child, execa } = current;
		if (stopping) {
			if (child.connected) child.disconnect();
			if (child.pid) killProcessTree(child.pid, {
				detached: current.detached,
				graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
			});
			return;
		}
		const streams = execa?.stdio ?? child.stdio;
		for (const [fd, stream] of streams.entries()) {
			if (!(stream instanceof Socket)) continue;
			stream.pause();
			await report({
				type: "pipe",
				id: message.id,
				fd
			}, stream);
			if (fd > 0) await report({
				type: "pipe-prefix",
				id: message.id,
				fd,
				bytes: takePipePrefix(stream)
			});
			if (!execa) stream.destroy();
		}
		if (!child.pid) throw new Error("Spawn broker command has no process identifier");
		await report({
			type: "spawned",
			id: message.id,
			pid: child.pid,
			spawnfile: child.spawnfile,
			spawnargs: child.spawnargs,
			connected: child.connected,
			stdioLength: streams.length
		});
		for (;;) {
			const value = current.events.shift();
			if (value === void 0) break;
			await report(value);
		}
		current.announced = true;
		forget(message.id, current);
	} catch (error) {
		disposeFailedChild(spawnedChild);
		owned.delete(message.id);
		if (!stopping) await report({
			type: "error",
			id: message.id,
			error: serializeBrokerError(error instanceof Error ? error : new Error(String(error))),
			resultUnavailable: true
		});
	} finally {
		starting.delete(message.id);
	}
}
process.once("disconnect", shutdown);
const onSupervisorSignal = () => {
	if (!process.connected) shutdown();
};
process.on("SIGTERM", onSupervisorSignal);
process.on("SIGINT", onSupervisorSignal);
process.on("message", (raw, handle) => {
	let decoded;
	try {
		decoded = receiver.receive(raw);
	} catch {
		shutdown();
		return;
	}
	if (decoded === void 0) return;
	const message = decoded;
	if (message.type === "shutdown") {
		shutdown();
		return;
	}
	if (message.type === "pipe-received") {
		sender.acknowledge(message.id, message.fd);
		return;
	}
	if (message.type === "spawn" || message.type === "spawn-execa") {
		launch(message).catch(shutdown);
		return;
	}
	const entry = owned.get(message.id);
	if (!entry) {
		const pending = starting.get(message.id);
		if (pending && message.type === "cancel") pending.canceled = true;
		if (pending && message.type === "kill") pending.signal = message.signal;
		if (message.type === "ipc") report({
			type: "ipc-sent",
			id: message.id,
			sequence: message.sequence,
			error: { message: "Child process IPC channel is closed" }
		}).catch(() => {});
		return;
	}
	if (message.type === "kill") (entry.execa?.kill ?? entry.child.kill.bind(entry.child))(message.signal);
	else if (message.type === "cancel") entry.execa?.cancel();
	else if (message.type === "output-drained") {
		entry.execa?.outputDrained(message.fd, message.error ? Object.assign(new Error(message.error.message), message.error) : void 0);
		entry.openPipes.delete(message.fd);
		forget(message.id, entry);
	} else if (message.type === "disconnect" && entry.child.connected) entry.child.disconnect();
	else if (message.type === "ipc") {
		const acknowledge = (error) => {
			report({
				type: "ipc-sent",
				id: message.id,
				sequence: message.sequence,
				...error ? { error: serializeBrokerError(error) } : {}
			}).catch(() => {});
		};
		if (!entry.child.connected) acknowledge(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
		else try {
			entry.child.send(message.message, handle, { keepOpen: true }, acknowledge);
		} catch (error) {
			acknowledge(error instanceof Error ? error : new Error(String(error)));
		}
	}
});
report({
	type: "ready",
	pid: process.pid
}).catch(shutdown);
//#endregion
export {};

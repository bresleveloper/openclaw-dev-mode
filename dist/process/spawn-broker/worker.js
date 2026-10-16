import { Socket, createConnection, createServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import fs, { opendirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { isDeepStrictEqual, stripVTControlCharacters } from "node:util";
import { execa } from "execa";
import { EventEmitter, once } from "node:events";
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
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
}
//#endregion
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
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
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
[
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
function isWrapped(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && args[1] === OOM_SCORE_WRAP_SCRIPT;
}
/** Only small spawn owners may temporarily raise their score; never call from the Gateway. */
function spawnWithInheritedOomScore(command, args, options) {
	if (process.platform !== "linux" || !isWrapped(command, args) || !args[2] || options.shell || options.argv0 !== void 0) return spawn(command, args, options);
	let scoreFd;
	let original;
	try {
		scoreFd = fs.openSync("/proc/self/oom_score_adj", "r+");
		original = fs.readFileSync(scoreFd, "utf8").trim();
		fs.writeSync(scoreFd, "1000", 0, "utf8");
	} catch {
		if (scoreFd !== void 0) fs.closeSync(scoreFd);
		return spawn(command, args, options);
	}
	try {
		return spawn(args[2], args.slice(3), options);
	} finally {
		try {
			fs.writeSync(scoreFd, original, 0, "utf8");
		} catch {
			process.emitWarning("Could not restore spawn owner's Linux OOM score");
		} finally {
			fs.closeSync(scoreFd);
		}
	}
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
* Check whether a Linux task is terminal and has no live sibling threads.
* Missing or reaped procfs snapshots require a fresh existence probe.
*/
function isExitedLinuxProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fs.readFileSync(`/proc/${pid}/status`, "utf8");
		const state = status.match(/^State:\s+(\S)/m)?.[1];
		const threads = status.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];
		if (threads !== "0") return (state === "Z" || state === "X") && threads === "1";
	} catch {}
	try {
		process.kill(pid, 0);
	} catch (error) {
		return error.code === "ESRCH";
	}
	return false;
}
/** Returns true only when the PID is invalid, missing, or a known terminal Linux task. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (err) {
		return err.code === "ESRCH";
	}
	return isExitedLinuxProcess(pid);
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
			if (!match || Number(match[1]) !== pid || Date.now() >= deadline) throw new Error("Process group census is unavailable");
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
					...command,
					uid: Number(match[5]) >>> 0
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
//#region src/process/process-deadline.ts
/** Let pending child exit and output notifications run before accepting a deadline. */
function setProcessTimeout(callback, delayMs) {
	let decision;
	const timer = setTimeout(() => {
		decision = setTimeout(callback, 0);
	}, delayMs);
	return {
		clear() {
			clearTimeout(timer);
			clearTimeout(decision);
		},
		refresh() {
			clearTimeout(decision);
			decision = void 0;
			timer.refresh();
		}
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
		const { encoding, executionDeadlineMs, ...processOptions } = options;
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
		const start = () => encoding === void 0 || encoding === "utf8" || encoding === "utf16le" ? execa(argv[0], argv.slice(1), {
			...spawnOptions,
			encoding
		}) : execa(argv[0], argv.slice(1), {
			...spawnOptions,
			encoding
		});
		let subprocess;
		try {
			subprocess = start();
		} catch (error) {
			throw await adoptAbandonedSpawnError(error);
		}
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
		let executionTimedOut = false;
		const deadline = executionDeadlineMs === void 0 ? void 0 : setProcessTimeout(() => {
			if (child.exitCode === null && child.signalCode === null) {
				executionTimedOut = true;
				subprocess.kill();
			}
		}, executionDeadlineMs);
		const clearDeadline = () => deadline?.clear();
		child.once("exit", clearDeadline);
		const result = subprocess.then((value) => serializeResult(value, executionTimedOut), (error) => {
			if (error instanceof Error && "failed" in error && error.failed === true) return serializeResult(error, executionTimedOut);
			throw error;
		}).finally(() => {
			clearDeadline();
			child.removeListener("exit", clearDeadline);
		});
		result.catch(() => {});
		return {
			child,
			stdio,
			result,
			cancel() {
				clearDeadline();
				controller.abort();
			},
			kill(signal) {
				clearDeadline();
				return subprocess.kill(signal);
			},
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
function isDescriptorSpawnError(error) {
	if (!(error instanceof Error)) return false;
	const syscall = "syscall" in error ? error.syscall : void 0;
	const code = "code" in error ? error.code : void 0;
	return typeof syscall === "string" && syscall.startsWith("spawn") && (code === "EMFILE" || code === "ENFILE");
}
async function adoptAbandonedSpawnError(thrown) {
	if (!(thrown instanceof TypeError)) return thrown;
	return await new Promise((resolve) => {
		const settle = (error) => {
			process.off("uncaughtException", onUncaught);
			clearImmediate(deadline);
			resolve(error);
		};
		const onUncaught = (error) => {
			if (isDescriptorSpawnError(error)) {
				settle(error);
				return;
			}
			settle(thrown);
			process.nextTick(() => {
				throw error;
			});
		};
		process.on("uncaughtException", onUncaught);
		const deadline = setImmediate(() => settle(thrown));
	});
}
function serializeResult(result, executionTimedOut) {
	const output = {
		stdout: byteOrTextOutput(result.stdout),
		stderr: byteOrTextOutput(result.stderr)
	};
	const error = result instanceof Error ? result : executionTimedOut ? /* @__PURE__ */ new Error("Command timed out") : void 0;
	return {
		...output,
		exitCode: result.exitCode,
		signal: result.signal,
		failed: result.failed || executionTimedOut,
		timedOut: result.timedOut || executionTimedOut,
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
		...error ? { error: serializeExecaError(error, output) } : {}
	};
}
function byteOrTextOutput(output) {
	if (output === void 0 || typeof output === "string" || output instanceof Uint8Array) return output;
	throw new TypeError("Spawn broker execa output must contain bytes or text");
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
/** Node's Worker error events use prototype-only Errors that a second clone would erase. */
function encodeNativeWorkerFailure(value) {
	const seen = /* @__PURE__ */ new Map();
	const encode = (current) => {
		if (!(current instanceof Error)) return {
			kind: "value",
			value: current
		};
		const prior = seen.get(current);
		if (prior) return prior;
		const node = {
			kind: "error",
			constructorName: current instanceof AggregateError ? "AggregateError" : [...errorConstructors].find(([, Constructor]) => current instanceof Constructor)?.[0] ?? "Error",
			name: current.name,
			message: current.message,
			stack: current.stack
		};
		seen.set(current, node);
		const code = Object.getOwnPropertyDescriptor(current, "code")?.value;
		if (typeof code === "string" || typeof code === "number") node.code = code;
		for (const key of ["errcode", "errno"]) {
			const field = Object.getOwnPropertyDescriptor(current, key)?.value;
			if (typeof field === "number") node[key] = field;
		}
		if (Object.hasOwn(current, "cause")) node.cause = encode(current.cause);
		const errors = Object.getOwnPropertyDescriptor(current, "errors")?.value;
		if (Array.isArray(errors)) node.errors = errors.map(encode);
		return node;
	};
	return encode(value);
}
//#endregion
//#region src/process/spawn-broker/resource-port.ts
/** A logical resource port; closing it does not assert anything about a native child. */
var BrokerResourcePort = class extends EventEmitter {
	constructor(send) {
		super();
		this.send = send;
		this.closed = false;
	}
	postMessage(value) {
		if (this.closed) throw new Error("Native resource message port is closed");
		this.send(value);
	}
	receive(value) {
		if (!this.closed) this.emit("message", value);
	}
	close() {
		if (!this.closed) {
			this.closed = true;
			this.emit("close");
		}
	}
};
//#endregion
//#region src/process/spawn-broker/resource-protocol.ts
const SPAWN_BROKER_STARTUP_TIMEOUT_MS = 15e3;
//#endregion
//#region src/process/spawn-broker/resource-socket.ts
/** Byte transport only: socket closure says nothing about a resource's native lifetime. */
function createBrokerResourceSocket(socket, handlers) {
	const receiver = createBrokerReceiver();
	const header = Buffer.alloc(4);
	let headerBytes = 0;
	let body;
	let bodyBytes = 0;
	let stopped = false;
	let failure;
	let pendingWrite;
	const stop = (error) => {
		if (stopped) return;
		stopped = true;
		failure = error;
		receiver.clear();
		body = void 0;
		pendingWrite?.(error ?? new SpawnBrokerError("Spawn broker resource socket closed"));
		socket.destroy();
	};
	const sender = createBrokerSender((message, _handle, callback) => {
		if (stopped || socket.destroyed) {
			callback(failure ?? new SpawnBrokerError("Spawn broker resource socket closed"));
			return;
		}
		const payload = serialize(message);
		if (payload.length > 268435456) {
			callback(new SpawnBrokerError("Spawn broker resource frame exceeds capacity"));
			return;
		}
		const packet = Buffer.allocUnsafe(4 + payload.length);
		packet.writeUInt32BE(payload.length);
		payload.copy(packet, 4);
		const complete = (error) => {
			if (pendingWrite !== complete) return;
			pendingWrite = void 0;
			callback(error);
			if (error) stop(error);
		};
		pendingWrite = complete;
		try {
			socket.write(packet, (error) => complete(error ?? null));
		} catch (error) {
			complete(toErrorObject(error, "Spawn broker resource write failed"));
		}
	});
	socket.on("data", (chunk) => {
		try {
			let offset = 0;
			while (offset < chunk.length) {
				if (stopped) break;
				if (!body) {
					const count = Math.min(4 - headerBytes, chunk.length - offset);
					chunk.copy(header, headerBytes, offset, offset + count);
					headerBytes += count;
					offset += count;
					if (headerBytes !== 4) continue;
					const length = header.readUInt32BE();
					if (length === 0 || length > 268435456) throw new SpawnBrokerError("Invalid spawn broker resource frame length");
					body = Buffer.allocUnsafe(length);
					headerBytes = 0;
				}
				const count = Math.min(body.length - bodyBytes, chunk.length - offset);
				chunk.copy(body, bodyBytes, offset, offset + count);
				bodyBytes += count;
				offset += count;
				if (bodyBytes !== body.length) continue;
				const decoded = receiver.receive(deserialize(body));
				body = void 0;
				bodyBytes = 0;
				if (decoded !== void 0) {
					if (!decoded || typeof decoded !== "object" || !("value" in decoded)) throw new SpawnBrokerError("Invalid spawn broker resource message");
					handlers.message(decoded.value);
				}
			}
		} catch (error) {
			stop(toErrorObject(error, "Spawn broker resource read failed"));
		}
	});
	socket.once("end", () => stop(body || headerBytes ? new SpawnBrokerError("Spawn broker resource socket ended during a frame") : void 0));
	socket.once("error", stop);
	socket.once("close", () => {
		stop();
		handlers.close(failure);
	});
	return {
		async send(value) {
			if (stopped || socket.destroyed) throw failure ?? new SpawnBrokerError("Spawn broker resource socket closed");
			await sender({ value });
		},
		close: () => stop()
	};
}
//#endregion
//#region src/process/spawn-broker/resource-server.ts
/** The broker retains resource owners independently of their submitting Worker's socket. */
async function createBrokerNativeResourceServer(options) {
	const resources = /* @__PURE__ */ new Map();
	const connections = /* @__PURE__ */ new Set();
	let available = true;
	let sourceSealed = false;
	let ownerBufferedBytes = 0;
	let ownerBufferedMessages = 0;
	const live = () => available && process.connected;
	const publishParent = (message) => {
		options.reportParent(message).catch(() => disconnect());
	};
	const publishSocket = (resource, message) => {
		const socket = resource.socket;
		if (socket) socket.send(message).catch(() => socket.close());
	};
	const publish = (resource, message) => {
		publishSocket(resource, message);
		publishParent(message);
	};
	const failed = (resource, error) => {
		publish(resource, {
			type: "resource-failed",
			id: resource.attachment.id,
			error: encodeNativeWorkerFailure(error)
		});
	};
	const seal = (resource, ports) => {
		for (const port of ports) try {
			port?.close();
		} catch (error) {
			if (live()) failed(resource, error);
		}
	};
	const closeError = (resource, requestId, error) => {
		const fields = {
			type: "resource-close-error",
			id: resource.attachment.id,
			requestId
		};
		let reply;
		try {
			if (resource.owner?.encodeCloseError) reply = {
				...fields,
				error: resource.owner.encodeCloseError(error),
				resourceError: true
			};
			else reply = {
				...fields,
				error: encodeNativeWorkerFailure(error),
				resourceError: false
			};
		} catch (encodingError) {
			reply = {
				...fields,
				error: encodeNativeWorkerFailure(new AggregateError([error, encodingError], "Native resource cleanup error encoding failed", { cause: error })),
				resourceError: false
			};
		}
		publish(resource, reply);
	};
	const closeResource = async (resource, requestId) => {
		if (resource.closed) {
			publish(resource, {
				type: "resource-closed",
				id: resource.attachment.id,
				requestId
			});
			return;
		}
		const origin = requestId > 0 ? "worker" : "parent";
		if (resource.closing) {
			const existing = resource.closeObservers[origin];
			if (existing !== void 0 && existing !== requestId) closeError(resource, requestId, /* @__PURE__ */ new Error("Native resource close observer capacity exceeded"));
			else resource.closeObservers[origin] = requestId;
			return;
		}
		resource.closeObservers[origin] = requestId;
		resource.closing = true;
		let outcome;
		try {
			await new Promise((resolve) => {
				if (sourceSealed) {
					resolve();
					return;
				}
				resource.finishInitializationWait = resolve;
				resource.initialized.then(resolve);
			});
			resource.finishInitializationWait = void 0;
			if (!live()) return;
			if (!resource.closed) {
				await resource.owner?.close();
				resource.closed = true;
				seal(resource, [resource.target, resource.ownerPort]);
			}
			outcome = { ok: true };
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		} finally {
			const observers = resource.closeObservers;
			resource.closeObservers = {};
			resource.finishInitializationWait = void 0;
			resource.closing = false;
			if (live() && outcome) for (const observer of [observers.worker, observers.parent]) {
				if (observer === void 0) continue;
				if (outcome.ok) publish(resource, {
					type: "resource-closed",
					id: resource.attachment.id,
					requestId: observer
				});
				else closeError(resource, observer, outcome.error);
			}
		}
	};
	const receiveOwner = (resource, request) => {
		const acknowledge = (sequence) => publish(resource, resource.ownerFailures.get(sequence)?.response ?? {
			type: "resource-owner-received",
			id: resource.attachment.id,
			sequence
		});
		if (!Number.isSafeInteger(request.sequence) || request.sequence <= 0) throw new Error("Invalid native resource owner sequence");
		if (request.sequence <= resource.ownerSequence) {
			acknowledge(request.sequence);
			return;
		}
		if (!resource.ownerPort || resource.closed || !resource.created) throw new Error("Native resource owner port is unavailable");
		const ownerPort = resource.ownerPort;
		const apply = (sequence, value) => {
			resource.ownerSequence = sequence;
			try {
				ownerPort.receive(value);
			} catch (error) {
				try {
					const response = {
						type: "resource-owner-rejected",
						id: resource.attachment.id,
						sequence,
						error: encodeNativeWorkerFailure(error)
					};
					const size = serialize(response).length;
					if (ownerBufferedBytes + size > 268435456 || ownerBufferedMessages >= 1024) throw new Error("Native resource owner receipt capacity exceeded", { cause: error });
					resource.ownerFailures.set(sequence, {
						response,
						size
					});
					ownerBufferedBytes += size;
					ownerBufferedMessages++;
				} catch (receiptError) {
					failed(resource, receiptError);
					disconnect();
					return false;
				}
			}
			acknowledge(sequence);
			return true;
		};
		if (request.sequence !== resource.ownerSequence + 1) {
			if (resource.ownerMessages.has(request.sequence)) return;
			const size = serialize(request).length;
			if (ownerBufferedBytes + size > 268435456 || ownerBufferedMessages >= 1024) throw new Error("Native resource owner receive capacity exceeded");
			resource.ownerMessages.set(request.sequence, {
				value: request.value,
				size
			});
			ownerBufferedBytes += size;
			ownerBufferedMessages++;
			return;
		}
		if (!apply(request.sequence, request.value)) return;
		for (;;) {
			const next = resource.ownerMessages.get(resource.ownerSequence + 1);
			if (!next) return;
			resource.ownerMessages.delete(++resource.ownerSequence);
			ownerBufferedBytes -= next.size;
			ownerBufferedMessages--;
			if (!apply(resource.ownerSequence, next.value)) return;
		}
	};
	const receive = (request) => {
		if (!live()) return;
		if (request.type === "resource-seal") {
			sourceSealed = true;
			for (const resource of resources.values()) resource.finishInitializationWait?.();
			return;
		}
		if (request.type === "resource-close" && (!Number.isSafeInteger(request.requestId) || request.requestId === 0)) {
			publishParent({
				type: "resource-failed",
				id: request.id,
				error: encodeNativeWorkerFailure(/* @__PURE__ */ new Error("Invalid native resource close request ID"))
			});
			return;
		}
		const resource = resources.get(request.id);
		if (!resource) {
			if (sourceSealed && request.type === "resource-close") {
				publishParent({
					type: "resource-closed",
					id: request.id,
					requestId: request.requestId
				});
				return;
			}
			publishParent({
				type: "resource-failed",
				id: request.id,
				error: encodeNativeWorkerFailure(/* @__PURE__ */ new Error("Native resource owner is unavailable"))
			});
			return;
		}
		if (request.type === "resource-owner") try {
			receiveOwner(resource, request);
		} catch (error) {
			failed(resource, error);
		}
		else if (request.type === "resource-close") closeResource(resource, request.requestId);
		else if (request.type === "resource-release") {
			if (!resource.closed) {
				failed(resource, /* @__PURE__ */ new Error("Native resource must close before release"));
				return;
			}
			resources.delete(request.id);
			for (const pending of resource.ownerMessages.values()) {
				ownerBufferedBytes -= pending.size;
				ownerBufferedMessages--;
			}
			resource.ownerMessages.clear();
			for (const outcome of resource.ownerFailures.values()) {
				ownerBufferedBytes -= outcome.size;
				ownerBufferedMessages--;
			}
			resource.ownerFailures.clear();
			resource.socket?.close();
		} else if (!resource.created || resource.closed || (resource.closing || sourceSealed) && request.type === "resource-target") failed(resource, /* @__PURE__ */ new Error("Native resource is not accepting messages"));
		else try {
			if (resource.targetSealed) throw new Error("Native resource target port is closed");
			resource.target.receive(request.value);
		} catch (error) {
			failed(resource, error);
		}
	};
	const server = createServer((socket) => {
		let attached;
		const transport = createBrokerResourceSocket(socket, {
			message(value) {
				if (!live() || !value || typeof value !== "object" || !("type" in value)) {
					transport.close();
					return;
				}
				const request = value;
				if (request.type === "resource-seal") {
					transport.close();
					return;
				}
				if (request.type !== "resource-attach") {
					if (!attached || request.id !== attached.attachment.id || ![
						"resource-target",
						"resource-owner",
						"resource-close",
						"resource-release"
					].includes(request.type)) {
						transport.close();
						return;
					}
					receive(request);
					return;
				}
				const attachment = request.attachment;
				if (sourceSealed || attached || !attachment || attachment.secret !== options.secret || attachment.generation !== options.generation || attachment.endpoint !== options.endpoint || !Number.isSafeInteger(attachment.id) || attachment.id <= 0 || typeof attachment.moduleUrl !== "string" || typeof attachment.ownerPort !== "boolean") {
					transport.close();
					return;
				}
				let resource = resources.get(attachment.id);
				const fresh = resource === void 0;
				if (resource) {
					if (resource.socket || resource.attachment.moduleUrl !== attachment.moduleUrl || resource.attachment.ownerPort !== attachment.ownerPort || !isDeepStrictEqual(resource.attachment.input, attachment.input)) {
						transport.close();
						return;
					}
				} else {
					if (!options.canAdmit()) {
						transport.send({
							type: "resource-failed",
							id: attachment.id,
							error: encodeNativeWorkerFailure(/* @__PURE__ */ new Error("Spawn broker request capacity exceeded"))
						}).finally(() => transport.close()).catch(() => {});
						return;
					}
					const current = {
						attachment,
						target: new BrokerResourcePort((message) => {
							publishSocket(current, {
								type: "resource-target",
								id: attachment.id,
								value: message
							});
						}),
						initialized: Promise.resolve(),
						created: false,
						targetSealed: false,
						closing: false,
						closeObservers: {},
						closed: false,
						sequence: 0,
						ownerSequence: 0,
						ownerMessages: /* @__PURE__ */ new Map(),
						ownerFailures: /* @__PURE__ */ new Map()
					};
					if (attachment.ownerPort) current.ownerPort = new BrokerResourcePort((message) => {
						publish(current, {
							type: "resource-owner",
							id: attachment.id,
							sequence: ++current.sequence,
							value: message
						});
					});
					resource = current;
					resources.set(attachment.id, current);
				}
				attached = resource;
				resource.socket = transport;
				socket.setTimeout(0);
				const ready = {
					type: "resource-ready",
					id: attachment.id,
					pid: process.pid,
					generation: options.generation
				};
				const readySent = transport.send(ready);
				publishParent(ready);
				if (resource.created) readySent.then(() => transport.send({
					type: "resource-created",
					id: attachment.id
				})).catch(() => transport.close());
				else if (fresh) {
					const current = resource;
					current.initialized = (async () => {
						await readySent;
						if (!live() || sourceSealed) return;
						const module = await import(attachment.moduleUrl);
						if (!live() || sourceSealed) return;
						current.owner = module.createNativeWorkerResource(current.target, attachment.input, current.ownerPort);
						current.created = true;
						publish(current, {
							type: "resource-created",
							id: attachment.id
						});
					})().catch((error) => {
						current.initializationFailure = encodeNativeWorkerFailure(error);
						failed(current, error);
					});
				} else {
					const current = resource;
					readySent.then(async () => {
						await current.initialized;
						if (current.initializationFailure) await transport.send({
							type: "resource-failed",
							id: attachment.id,
							error: current.initializationFailure
						});
					}).catch(() => transport.close());
				}
			},
			close() {
				connections.delete(transport);
				if (attached?.socket === transport) {
					attached.socket = void 0;
					attached.targetSealed = true;
					seal(attached, [attached.target]);
				}
			}
		});
		connections.add(transport);
		socket.setTimeout(SPAWN_BROKER_STARTUP_TIMEOUT_MS, () => transport.close());
		if (!live()) transport.close();
	});
	server.maxConnections = 256;
	function disconnect() {
		if (!available) return;
		available = false;
		server.close();
		for (const connection of connections) connection.close();
		for (const resource of resources.values()) seal(resource, [resource.target, resource.ownerPort]);
	}
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(options.endpoint, () => {
			server.off("error", reject);
			server.on("error", disconnect);
			resolve();
		});
	});
	return {
		receive,
		disconnect,
		get size() {
			return resources.size;
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
let resources;
let startup = "waiting";
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
	resources?.disconnect();
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
	if (owned.size === 0 && starting.size === 0 && !resources?.size && hasLiveOwnedProcessGroupMembers() === false) {
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
	if (stopping || owned.size + starting.size + (resources?.size ?? 0) >= 256) {
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
			const child = execa?.child ?? (message.type === "spawn" ? spawnWithInheritedOomScore(message.argv[0], message.argv.slice(1), message.options) : void 0);
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
	if (startup === "waiting") {
		startup = "initializing";
		initialize(raw).catch(shutdown);
		return;
	}
	if (startup !== "ready") {
		shutdown();
		return;
	}
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
	if (message.type === "resource-seal" || message.type === "resource-target" || message.type === "resource-owner" || message.type === "resource-close" || message.type === "resource-release") {
		resources?.receive(message);
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
async function initialize(raw) {
	if (!isRecord(raw) || raw.type !== "bootstrap") throw new Error("Invalid spawn broker bootstrap");
	if (stopping || !process.connected) return;
	if (raw.nativeResource !== void 0) {
		const authority = raw.nativeResource;
		if (!isRecord(authority) || typeof authority.endpoint !== "string" || !authority.endpoint || typeof authority.secret !== "string" || !authority.secret || typeof authority.generation !== "number" || !Number.isSafeInteger(authority.generation) || authority.generation < 0) throw new Error("Invalid native resource bootstrap authority");
		resources = await createBrokerNativeResourceServer({
			endpoint: authority.endpoint,
			secret: authority.secret,
			generation: authority.generation,
			reportParent: report,
			canAdmit: () => !stopping && owned.size + starting.size + (resources?.size ?? 0) < 256
		});
		if (stopping) {
			resources.disconnect();
			return;
		}
	}
	startup = "ready";
	await report({
		type: "ready",
		pid: process.pid
	});
}
//#endregion
export {};

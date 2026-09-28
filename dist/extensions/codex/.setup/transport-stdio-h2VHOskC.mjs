import { r as normalizeCodexAppServerArgs } from "./launch-args-DbFCehO7.mjs";
import { i as resolveManagedCodexNativeCommand } from "./managed-binary-BnshlFag.mjs";
import { i as recordCodexAppServerSpawnFailure, r as getCodexAppServerSpawnFailure } from "./spawn-error-CL3n6MAa.mjs";
import { createHash, randomUUID } from "node:crypto";
import { stripVTControlCharacters } from "node:util";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { z } from "zod";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
import { closeSync, constants, openSync, readSync } from "node:fs";
import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { once } from "node:events";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { execFile, spawn } from "node:child_process";
import { setImmediate } from "node:timers/promises";
import { finished } from "node:stream/promises";
//#region extensions/codex/src/app-server/transport-process-snapshot.ts
/** A zombie leader can still own running threads, reported by the ps-style l flag. */
function isDeadProcessState(state) {
	return state.startsWith("Z") && !state.includes("l");
}
const PROCESS_COLUMNS = "pid=,ppid=,pgid=,stat=,lstart=";
const MAX_PROCESS_CONTAINMENT_MS$1 = 2e3;
const PROCESS_INSPECTION_MAX_BYTES = 8388608;
const PROCFS_COMMAND_PERMISSION_EXIT = 77;
const PROCFS_COMMAND_READER = `
const fs = require("node:fs");
const [pid, maxBytes] = process.argv.slice(-2).map(Number);
try {
  const fd = fs.openSync("/proc/" + pid + "/cmdline", "r");
  const buffer = Buffer.alloc(4096);
  const chunks = [];
  let bytes = 0;
  try {
    for (;;) {
      const count = fs.readSync(fd, buffer, 0, Math.min(buffer.length, maxBytes - bytes + 1), null);
      if (count === 0) break;
      bytes += count;
      if (bytes > maxBytes) throw new Error("Command byte limit exceeded");
      chunks.push(Buffer.from(buffer.subarray(0, count)));
    }
  } finally {
    fs.closeSync(fd);
  }
  process.stdout.end(Buffer.concat(chunks, bytes));
} catch (error) {
  process.exitCode = ["EACCES", "EPERM", "ERR_ACCESS_DENIED"].includes(error?.code)
    ? ${PROCFS_COMMAND_PERMISSION_EXIT} : 1;
}
`;
var ProcessInspectionError = class extends Error {
	constructor(reason) {
		const detail = {
			deadline: "Process inspection exceeded its deadline. Retry when the host is responsive.",
			permission: "Check process inspection permissions (/proc on Linux, ps on macOS), then retry.",
			unavailable: "Process identity is unavailable or invalid. Check /proc on Linux or ps on macOS, then retry."
		}[reason];
		super(`Cannot inspect Codex processes. ${detail}`);
		this.reason = reason;
		this.name = "ProcessInspectionError";
	}
};
function inspectionFailure(error) {
	if (error instanceof ProcessInspectionError) return error;
	const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
	return new ProcessInspectionError(code === "ABORT_ERR" ? "deadline" : code === "EACCES" || code === "EPERM" || code === "ERR_ACCESS_DENIED" ? "permission" : "unavailable");
}
async function readCodexAppServerProcessSnapshot(deadline = Date.now() + MAX_PROCESS_CONTAINMENT_MS$1, pids) {
	const selected = pids === void 0 ? void 0 : [.../* @__PURE__ */ new Set([process.pid, ...pids])];
	const rows = process.platform === "linux" ? await readLinuxProcesses(selected, deadline) : await readProcesses(selected ? [
		"-o",
		PROCESS_COLUMNS,
		"-p",
		selected.join(",")
	] : ["-axo", PROCESS_COLUMNS], deadline, selected !== void 0);
	if (selected && !rows.some((row) => row.pid === process.pid)) throw new ProcessInspectionError("unavailable");
	return rows;
}
async function readCodexAppServerProcess(pid, deadline) {
	return (process.platform === "linux" ? await readLinuxProcesses([pid], deadline) : await readProcesses([
		"-o",
		PROCESS_COLUMNS,
		"-p",
		String(pid)
	], deadline)).find((row) => row.pid === pid);
}
async function readCodexAppServerProcessCommand(observed, deadline) {
	let output;
	if (process.platform === "linux") {
		let pending = false;
		do {
			if (deadline - Date.now() <= 0) throw new ProcessInspectionError("deadline");
			const command = await readProcessOutput({
				kind: "procfs-command",
				pid: observed.pid
			}, deadline);
			if (!command || pending) {
				const current = await readCodexAppServerProcess(observed.pid, deadline);
				if (!current || current.startedAt !== observed.startedAt || current.ppid !== observed.ppid || current.pgid !== observed.pgid || current.state.startsWith("Z")) throw new ProcessInspectionError("unavailable");
			}
			output = command.split("\0").join(" ").trim();
			pending = command.length === 0;
			if (pending) await setImmediate();
		} while (pending);
	} else output = (await readProcessOutput({
		kind: "ps",
		args: [
			"-o",
			"command=",
			"-p",
			String(observed.pid)
		]
	}, deadline)).split("\n")[0]?.trim() ?? "";
	if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
	if (!output) throw new ProcessInspectionError("unavailable");
	return output;
}
async function readProcesses(args, deadline, selected = false) {
	return parseProcesses(await readProcessOutput({
		kind: "ps",
		args
	}, deadline), selected);
}
async function readProcessOutput(command, deadline) {
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) throw new ProcessInspectionError("deadline");
	return await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (output) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			if (output instanceof ProcessInspectionError) reject(output);
			else resolve(output);
		};
		const procfs = command.kind === "procfs-command";
		const inspector = execFile(procfs ? process.execPath : "ps", procfs ? [
			...process.versions.bun ? ["--no-env-file", "--config=/dev/null"] : [],
			"-e",
			PROCFS_COMMAND_READER,
			String(command.pid),
			String(PROCESS_INSPECTION_MAX_BYTES)
		] : command.args, {
			encoding: "utf8",
			maxBuffer: PROCESS_INSPECTION_MAX_BYTES,
			cwd: procfs ? "/" : void 0,
			env: procfs ? {} : {
				...process.env,
				LC_ALL: "C",
				TZ: "UTC"
			}
		}, (error, stdout) => {
			settle(Date.now() >= deadline ? new ProcessInspectionError("deadline") : error ? procfs && error.code === PROCFS_COMMAND_PERMISSION_EXIT ? new ProcessInspectionError("permission") : inspectionFailure(error) : stdout);
		});
		const timer = setTimeout(() => {
			settle(new ProcessInspectionError("deadline"));
			inspector.stdout?.destroy();
			inspector.stderr?.destroy();
			inspector.kill("SIGKILL");
			inspector.unref();
		}, Math.max(1, remainingMs));
		timer.unref?.();
	}).catch((error) => {
		throw inspectionFailure(error);
	});
}
function parseProcesses(output, selected) {
	const rows = [];
	for (const line of output.split("\n")) {
		const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.+?)\s*$/.exec(line);
		if (!match) {
			if (selected && line.trim()) throw new ProcessInspectionError("unavailable");
			continue;
		}
		const pid = Number(match[1] ?? "");
		const ppid = Number(match[2] ?? "");
		const pgid = Number(match[3] ?? "");
		const startedAt = (match[5] ?? "").trim().replace(/\s+/g, " ");
		if (![
			pid,
			ppid,
			pgid
		].every(Number.isSafeInteger) || pid <= 0 || ppid < 0 || pgid <= 0 || !startedAt) {
			if (selected) throw new ProcessInspectionError("unavailable");
			continue;
		}
		rows.push({
			pid,
			ppid,
			pgid,
			state: match[4] ?? "",
			startedAt
		});
	}
	return rows;
}
async function readLinuxProcesses(selected, deadline) {
	if (selected !== void 0) return readSelectedLinuxProcesses(selected, deadline);
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) throw new ProcessInspectionError("deadline");
	const options = {
		encoding: "utf8",
		signal: AbortSignal.timeout(remainingMs)
	};
	try {
		const bootId = parseLinuxBootId(await readFile("/proc/sys/kernel/random/boot_id", options));
		const pids = await readdir("/proc");
		const rows = [];
		let bytes = 0;
		for (const entry of pids) {
			if (!/^\d+$/.test(entry)) continue;
			if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
			const stat = await readFile(`/proc/${entry}/stat`, options).catch((error) => {
				if (error && typeof error === "object" && "code" in error && (error.code === "ENOENT" || error.code === "ESRCH")) return;
				throw error;
			});
			if (stat === void 0) continue;
			bytes += stat.length;
			if (bytes > PROCESS_INSPECTION_MAX_BYTES) throw new ProcessInspectionError("unavailable");
			const row = parseLinuxProcess(stat, entry, bootId, false);
			if (row) rows.push(row);
		}
		if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
		return rows;
	} catch (error) {
		throw inspectionFailure(error);
	}
}
function parseLinuxBootId(value) {
	const bootId = value.trim();
	if (!/^[a-f0-9-]{36}$/.test(bootId)) throw new ProcessInspectionError("unavailable");
	return bootId;
}
function parseLinuxProcess(stat, entry, bootId, selected) {
	const commEnd = stat.lastIndexOf(")");
	const fields = stat.slice(commEnd + 1).trim().split(/\s+/);
	const ppid = Number(fields[1]);
	const pgid = Number(fields[2]);
	const startTicks = fields[19];
	if (commEnd < 0 || ![ppid, pgid].every(Number.isSafeInteger) || selected && (pgid <= 0 || ppid < 0) || !/^\d+$/.test(startTicks ?? "")) throw new ProcessInspectionError("unavailable");
	if (pgid > 0) {
		const threads = Number(fields[17]);
		if (!/^[1-9]\d*$/.test(fields[17] ?? "") || !Number.isSafeInteger(threads)) throw new ProcessInspectionError("unavailable");
		return {
			pid: Number(entry),
			ppid,
			pgid,
			state: `${fields[0]}${threads > 1 ? "l" : ""}`,
			startedAt: `${bootId}:${startTicks}`
		};
	}
}
/** Known procfs identities must not queue behind unrelated libuv filesystem work. */
function readSelectedProcFile(file, deadline, maxBytes = PROCESS_INSPECTION_MAX_BYTES) {
	if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
	const fd = openSync(file, constants.O_RDONLY | constants.O_NONBLOCK);
	const chunks = [];
	const buffer = Buffer.alloc(Math.min(4096, maxBytes + 1));
	let bytes = 0;
	try {
		for (;;) {
			if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
			const count = readSync(fd, buffer, {
				offset: 0,
				length: Math.min(buffer.length, maxBytes - bytes + 1),
				position: null
			});
			if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
			if (count === 0) return Buffer.concat(chunks, bytes);
			bytes += count;
			if (bytes > maxBytes) throw new ProcessInspectionError("unavailable");
			chunks.push(Buffer.from(buffer.subarray(0, count)));
		}
	} finally {
		closeSync(fd);
	}
}
function readSelectedLinuxProcesses(selected, deadline) {
	try {
		const bootId = parseLinuxBootId(readSelectedProcFile("/proc/sys/kernel/random/boot_id", deadline).toString("utf8"));
		const rows = [];
		let bytes = 0;
		for (const entry of selected.map(String)) {
			if (!/^\d+$/.test(entry)) continue;
			let stat;
			try {
				stat = readSelectedProcFile(`/proc/${entry}/stat`, deadline, PROCESS_INSPECTION_MAX_BYTES - bytes);
			} catch (error) {
				if (error && typeof error === "object" && "code" in error && (error.code === "ENOENT" || error.code === "ESRCH")) continue;
				throw error;
			}
			bytes += stat.length;
			const row = parseLinuxProcess(stat.toString("utf8"), entry, bootId, true);
			if (row) rows.push(row);
		}
		if (Date.now() >= deadline) throw new ProcessInspectionError("deadline");
		return rows;
	} catch (error) {
		throw inspectionFailure(error);
	}
}
//#endregion
//#region extensions/codex/src/app-server/transport-process-containment.ts
const MAX_CONTAINED_PROCESSES = 512;
const MAX_PROCESS_CONTAINMENT_MS = 2e3;
const MAX_PROCESS_QUIESCE_PASSES = 16;
/** Discharges the registered root obligation, including an already-obsolete PID. */
async function terminateCodexAppServerOrphan(expected) {
	const deadline = Date.now() + MAX_PROCESS_CONTAINMENT_MS;
	const initial = (await readCodexAppServerProcessSnapshot(deadline, [expected.pid])).find((row) => row.pid === expected.pid);
	if (!initial || !hasSameIdentity(initial, expected) || isDeadProcessState(initial.state)) return true;
	const result = await terminateCodexAppServerDescendants({
		pid: expected.pid,
		kill: (signal) => signalProcess(expected.pid, signal ?? "SIGTERM")
	}, expected, deadline);
	const contained = result === "exited" ? void 0 : result;
	let gone = false;
	try {
		if (contained) {
			const current = await readCodexAppServerProcess(expected.pid, deadline).catch(() => void 0);
			if (current && isSameLiveRoot(current, contained.root, true)) signalProcess(current.pgid === current.pid ? -current.pid : current.pid, "SIGKILL");
		}
		while (Date.now() < deadline) {
			const snapshot = await readCodexAppServerProcessSnapshot(deadline, [expected.pid]).catch(() => void 0);
			if (!snapshot?.some((row) => row.pid === process.pid)) return false;
			const current = snapshot.find((row) => row.pid === expected.pid);
			if (!current || !hasSameIdentity(current, expected) || isDeadProcessState(current.state)) {
				gone = true;
				return true;
			}
			if (!contained) return false;
			await new Promise((resolve) => {
				setTimeout(resolve, 20);
			});
		}
		return false;
	} finally {
		if (contained && !gone) await signalSameRoot(contained.root, "SIGCONT", Date.now() + MAX_PROCESS_CONTAINMENT_MS);
	}
}
async function terminateCodexAppServerDescendants(child, expected, deadline = Date.now() + MAX_PROCESS_CONTAINMENT_MS) {
	const rootPid = child.pid;
	if (hasExited(child)) return "exited";
	if (process.platform === "win32" || !rootPid || !child.kill) return;
	const snapshot = await readCodexAppServerProcessSnapshot(deadline).catch(() => void 0);
	if (!snapshot || Date.now() >= deadline) return;
	const root = snapshot.find((row) => row.pid === rootPid);
	if (!expected && (!root || isDeadProcessState(root.state))) return "exited";
	if (!root || !(expected ? isSameLiveProcess(root, expected) : root.ppid === process.pid) || isDeadProcessState(root.state)) return;
	const initialDescendants = collectDescendants(snapshot, [rootPid]);
	if (initialDescendants.length > MAX_CONTAINED_PROCESSES) return;
	const stoppedDescendants = /* @__PURE__ */ new Map();
	if (!await signalSameRoot(root, "SIGSTOP", deadline)) return;
	let resumeRootOnUnwind = true;
	try {
		const descendants = await quiesceDescendants(root, initialDescendants, stoppedDescendants, deadline);
		if (!descendants) return;
		for (const descendant of descendants.toReversed()) {
			if (Date.now() >= deadline) return;
			if (!isDeadProcessState(descendant.state)) {
				if (!await signalSameProcess(descendant, "SIGKILL", deadline) || Date.now() >= deadline) return;
			}
		}
		const remaining = new Map(descendants.map((row) => [row.pid, row]));
		while (remaining.size > 0) {
			const terminationSnapshot = await readCodexAppServerProcessSnapshot(deadline, [root.pid, ...remaining.keys()]).catch(() => void 0);
			if (!terminationSnapshot || Date.now() >= deadline) return;
			const currentRoot = terminationSnapshot.find((row) => row.pid === root.pid);
			if (!currentRoot || !isSameLiveRoot(currentRoot, root, true)) return;
			const currentByPid = new Map(terminationSnapshot.map((row) => [row.pid, row]));
			for (const [pid, retained] of remaining) {
				const current = currentByPid.get(pid);
				if (!current || !hasSameIdentity(current, retained) || isDeadProcessState(current.state)) remaining.delete(pid);
			}
			if (remaining.size > 0) await new Promise((resolve) => {
				setTimeout(resolve, 20);
			});
		}
		resumeRootOnUnwind = false;
		let resumed = false;
		return {
			root,
			resume: () => {
				if (resumed) return;
				resumed = true;
				resumeTransportRoot(child, root, false);
			}
		};
	} finally {
		if (resumeRootOnUnwind) {
			if (expected) {
				const releaseDeadline = Date.now() + MAX_PROCESS_CONTAINMENT_MS;
				for (const descendant of stoppedDescendants.values()) await signalSameProcess(descendant, "SIGCONT", releaseDeadline);
				await signalSameRoot(root, "SIGCONT", releaseDeadline);
			} else {
				for (const descendant of stoppedDescendants.values()) signalProcess(descendant.pid, "SIGCONT");
				resumeTransportRoot(child, root, true);
			}
		}
	}
}
async function quiesceDescendants(root, initialDescendants, stopped, deadline) {
	const provenByPid = new Map(initialDescendants.map((descendant) => [descendant.pid, descendant]));
	const stopFailures = /* @__PURE__ */ new Map();
	for (let pass = 0; pass < MAX_PROCESS_QUIESCE_PASSES; pass += 1) {
		if (Date.now() >= deadline) return;
		const snapshot = await readCodexAppServerProcessSnapshot(deadline).catch(() => void 0);
		if (!snapshot || Date.now() >= deadline) return;
		const currentRoot = snapshot.find((row) => row.pid === root.pid);
		if (!currentRoot || !isSameLiveRoot(currentRoot, root)) return;
		if (!isSameLiveRoot(currentRoot, root, true)) {
			if (!await signalSameRoot(root, "SIGSTOP", deadline) || Date.now() >= deadline) return;
			continue;
		}
		const snapshotByPid = new Map(snapshot.map((process) => [process.pid, process]));
		const liveProven = [];
		for (const proven of provenByPid.values()) {
			const current = snapshotByPid.get(proven.pid);
			if (!current) {
				provenByPid.delete(proven.pid);
				stopped.delete(identityKey(proven));
				continue;
			}
			if (!hasSameIdentity(proven, current)) return;
			provenByPid.set(current.pid, current);
			const key = identityKey(current);
			if (stopped.has(key)) stopped.set(key, current);
			liveProven.push(current);
		}
		const descendants = collectDescendants(snapshot, [root.pid, ...liveProven.map(({ pid }) => pid)]);
		for (const descendant of descendants) {
			const proven = provenByPid.get(descendant.pid);
			if (proven && !hasSameIdentity(proven, descendant)) return;
			provenByPid.set(descendant.pid, descendant);
		}
		if (provenByPid.size > MAX_CONTAINED_PROCESSES) return;
		const quiescenceTargets = new Map(liveProven.map((process) => [process.pid, process]));
		for (const descendant of descendants) quiescenceTargets.set(descendant.pid, descendant);
		let allStopped = true;
		for (const descendant of quiescenceTargets.values()) {
			if (Date.now() >= deadline) return;
			if (isStoppedState(descendant.state)) continue;
			const stopQueued = await signalSameProcess(descendant, "SIGSTOP", deadline);
			if (Date.now() >= deadline) return;
			if (stopQueued) {
				stopFailures.delete(identityKey(descendant));
				stopped.set(identityKey(descendant), descendant);
			} else {
				const key = identityKey(descendant);
				const failures = (stopFailures.get(key) ?? 0) + 1;
				if (failures >= 2) return;
				stopFailures.set(key, failures);
			}
			if (!isUninterruptibleState(descendant.state) || !stopQueued) allStopped = false;
		}
		if (allStopped) return [...provenByPid.values()];
	}
}
function collectDescendants(snapshot, rootPids) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const row of snapshot) {
		const children = childrenByParent.get(row.ppid) ?? [];
		children.push(row);
		childrenByParent.set(row.ppid, children);
	}
	const descendants = [];
	const pending = [...new Set(rootPids)];
	const seen = new Set(pending);
	for (const parentPid of pending) for (const child of childrenByParent.get(parentPid) ?? []) {
		if (seen.has(child.pid)) continue;
		seen.add(child.pid);
		descendants.push(child);
		pending.push(child.pid);
	}
	return descendants;
}
function isStoppedState(state) {
	return state.startsWith("T") || state.startsWith("t") || isDeadProcessState(state);
}
function isQuiescedState(state) {
	return isStoppedState(state) || isUninterruptibleState(state);
}
function isUninterruptibleState(state) {
	return state.startsWith("D") || state.startsWith("U");
}
function isSameLiveProcess(current, expected) {
	return current.pgid === expected.pgid && !isDeadProcessState(current.state) && hasSameIdentity(current, expected);
}
function isSameLiveRoot(current, expected, requireStopped = false) {
	return current.ppid === expected.ppid && (!requireStopped || isQuiescedState(current.state)) && isSameLiveProcess(current, expected);
}
async function signalSameRoot(root, signal, deadline) {
	const current = await readCodexAppServerProcess(root.pid, deadline).catch(() => void 0);
	return Boolean(current && isSameLiveRoot(current, root) && signalProcess(current.pid, signal));
}
function resumeTransportRoot(child, root, allowSynchronousPidFallback) {
	try {
		if (child.kill) {
			child.kill("SIGCONT");
			return;
		}
	} catch {
		if (!allowSynchronousPidFallback) return;
	}
	if (allowSynchronousPidFallback) signalProcess(root.pid, "SIGCONT");
}
async function signalSameProcess(expected, signal, deadline) {
	const current = await readCodexAppServerProcess(expected.pid, deadline).catch(() => void 0);
	return Boolean(current && isSameLiveProcess(current, expected) && signalProcess(current.pid, signal));
}
function hasSameIdentity(left, right) {
	return identityKey(left) === identityKey(right);
}
function identityKey(row) {
	return `${row.pid}\0${row.startedAt}`;
}
function hasExited(child) {
	return child.exitCode != null || child.signalCode != null;
}
function signalProcess(pid, signal) {
	try {
		process.kill(pid, signal);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/transport-process-registration.ts
const PROCESS_REGISTRATION_INSPECTION_MS = 1e4;
const processIdentity = z.object({
	pid: z.number().int().positive().safe(),
	pgid: z.number().int().positive().safe(),
	startedAt: z.string().min(1).max(64)
});
const childIdentity = processIdentity.extend({ commandFingerprint: z.string().regex(/^[a-f0-9]{64}$/).optional() });
const registrationSchema = z.object({
	parent: processIdentity,
	child: childIdentity
}).strict();
const registrationCleanup = /* @__PURE__ */ new WeakMap();
const processReaper = resolveGlobalSingleton(Symbol.for("openclaw.codexAppServerProcessReaper"), () => new KeyedAsyncQueue());
/** Join bookkeeping after the transport owner has observed physical exit. */
async function waitForCodexAppServerProcessRegistrationCleanup(child) {
	await registrationCleanup.get(child);
}
function fingerprintProcessCommand(command) {
	return createHash("sha256").update(command).digest("hex");
}
async function openProcessRegistrationStore() {
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: resolveStateDir()
	};
	const { createPluginStateKeyedStore } = await import("openclaw/plugin-sdk/plugin-state-store-runtime");
	return createPluginStateKeyedStore("codex", {
		namespace: "app-server-processes",
		maxEntries: 512,
		overflowPolicy: "reject-new",
		env
	});
}
async function reapRegisteredCodexAppServerOrphans() {
	const store = await openProcessRegistrationStore();
	await processReaper.enqueue("orphans", () => sweepRegisteredCodexAppServerOrphans(store));
	return store;
}
async function sweepRegisteredCodexAppServerOrphans(store) {
	const entries = await store.entries();
	const deadline = Date.now() + PROCESS_REGISTRATION_INSPECTION_MS;
	for (const entry of entries) {
		if (Date.now() >= deadline) throw new Error("Codex orphan cleanup exceeded its startup budget. Retry to finish cleanup.");
		const registration = registrationSchema.parse(entry.value);
		const snapshot = await readCodexAppServerProcessSnapshot(deadline, [registration.parent.pid, registration.child.pid]);
		const parent = snapshot.find((row) => row.pid === registration.parent.pid);
		if (parent?.startedAt === registration.parent.startedAt && !isDeadProcessState(parent.state)) continue;
		const child = snapshot.find((row) => row.pid === registration.child.pid);
		if (registration.child.commandFingerprint !== void 0 && child?.startedAt === registration.child.startedAt && !isDeadProcessState(child.state)) {
			let command;
			try {
				command = await readCodexAppServerProcessCommand(child, deadline);
			} catch (error) {
				const current = (await readCodexAppServerProcessSnapshot(deadline, [registration.child.pid])).find((row) => row.pid === registration.child.pid);
				if (current?.startedAt === registration.child.startedAt && !isDeadProcessState(current.state)) throw error;
			}
			if (command !== void 0 && fingerprintProcessCommand(command) !== registration.child.commandFingerprint) {
				await store.delete(entry.key);
				continue;
			}
		}
		if (!await terminateCodexAppServerOrphan(registration.child)) throw new Error(`Cannot reap registered Codex process ${registration.child.pid}. Stop it before retrying.`);
		await store.delete(entry.key);
	}
}
function createCodexAppServerProcessReaperService() {
	let pendingSweep;
	return {
		id: "codex-app-server-process-reaper",
		start(ctx) {
			if (process.platform === "win32") return;
			pendingSweep = (async () => {
				try {
					await reapRegisteredCodexAppServerOrphans();
				} catch (error) {
					ctx.logger.warn(`Codex app-server orphan cleanup failed: ${String(error)}`);
				}
			})();
		},
		async stop() {
			await pendingSweep;
		}
	};
}
/** Reap previous owners before spawn; commit this child's identity before initialization. */
async function prepareCodexAppServerProcessRegistration() {
	if (process.platform === "win32") return async (child) => {
		await once(child, "spawn");
	};
	const store = await reapRegisteredCodexAppServerOrphans();
	return async (child) => {
		await once(child, "spawn");
		if (!child.pid) throw new ProcessInspectionError("unavailable");
		const deadline = Date.now() + PROCESS_REGISTRATION_INSPECTION_MS;
		const snapshot = await readCodexAppServerProcessSnapshot(deadline, [child.pid]);
		const parent = snapshot.find((row) => row.pid === process.pid);
		const spawned = snapshot.find((row) => row.pid === child.pid);
		if (!parent || !spawned || spawned.ppid !== process.pid) throw new Error("Cannot register the Codex child process: its direct-parent identity is unavailable. Retry.");
		const command = await readCodexAppServerProcessCommand(spawned, deadline);
		if (child.exitCode !== null || child.signalCode !== null) throw new Error("Cannot register the Codex child process command: the child exited during inspection. Retry.");
		const key = randomUUID();
		const value = {
			parent: processIdentity.parse(parent),
			child: childIdentity.parse({
				...spawned,
				commandFingerprint: fingerprintProcessCommand(command)
			})
		};
		const exited = new Promise((resolve) => {
			child.once("exit", () => resolve());
		});
		const registered = store.register(key, value);
		const cleanup = (async () => {
			await exited;
			await registered.catch(() => void 0);
			try {
				await store.delete(key);
			} catch {}
		})();
		registrationCleanup.set(child, cleanup);
		await registered;
		if (child.exitCode !== null || child.signalCode !== null) {
			await cleanup;
			throw new Error("Cannot register the Codex child process: the child exited during registration. Retry.");
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/managed-launcher-failure.ts
/** The official npm launcher prints Node's native spawn error and exits before initialization. */
function observeManagedCodexLauncherFailure(child, nativeCommand) {
	let prefix = "";
	let launchCode;
	const startupFailure = { complete() {
		child.stderr.off("data", onData);
		child.off("exit", onExit);
		prefix = "";
	} };
	const onData = (chunk) => {
		if (launchCode || prefix.length >= 16384) return;
		prefix = (prefix + stripVTControlCharacters(chunk.toString())).slice(0, 16384);
		if (/\bError: spawn\b/u.test(prefix) && /syscall: ['"]spawn(?: [^'"\r\n]*)?['"]/u.test(prefix)) launchCode = /\bcode: ['"](ENOENT|EACCES|EBADARCH|Unknown system error -86)['"]/u.exec(prefix)?.[1];
		else if (/Error: Missing optional dependency @openai\/codex-[\w-]+\. Reinstall Codex:/u.test(prefix)) launchCode = "ENOENT";
	};
	const onExit = (code) => {
		startupFailure.complete();
		if (code !== 1 || !launchCode) return;
		const described = recordCodexAppServerSpawnFailure(Object.assign(/* @__PURE__ */ new Error(`spawn ${launchCode}`), {
			code: launchCode,
			syscall: "spawn"
		}), nativeCommand, nativeCommand);
		if (described instanceof Error) startupFailure.error = described;
	};
	child.stderr.on("data", onData);
	child.once("exit", onExit);
	Object.assign(child, { startupFailure });
}
//#endregion
//#region extensions/codex/src/app-server/transport.ts
/**
* Shared transport lifecycle helpers for stdio and WebSocket Codex app-server
* connections.
*/
const CODEX_APP_SERVER_TRANSPORT_CLOSES = /* @__PURE__ */ new WeakMap();
/** True only after bounded settlement proves an exit that cleanup did not cause. */
function hasCodexAppServerNaturalExit(child) {
	return CODEX_APP_SERVER_TRANSPORT_CLOSES.get(child)?.naturalExit === true;
}
/** Starts graceful transport shutdown and schedules a force kill fallback. */
function closeCodexAppServerTransport(child, options = {}) {
	beginCodexAppServerTransportClose(child, options).closing;
}
function beginCodexAppServerTransportClose(child, options) {
	const current = CODEX_APP_SERVER_TRANSPORT_CLOSES.get(child);
	if (current) return current;
	let forced = false;
	const forceKill = () => {
		forced = true;
		signalCodexAppServerTransport(child, "SIGKILL");
	};
	const closure = {
		closing: (async () => {
			if (hasCodexAppServerTransportExited(child)) return "natural";
			if (process.platform === "win32" || !child.pid || !child.kill) {
				finishCodexAppServerTransportClose(child, options, forceKill);
				return "uncertain";
			}
			let contained;
			try {
				contained = await terminateCodexAppServerDescendants(child);
			} catch {
				contained = void 0;
			}
			if (contained === "exited") return "natural";
			try {
				finishCodexAppServerTransportClose(child, options, forceKill, contained?.resume);
			} catch {
				forceKill();
			}
			return contained ? "contained" : "uncertain";
		})(),
		naturalExit: false,
		wasForced: () => forced
	};
	CODEX_APP_SERVER_TRANSPORT_CLOSES.set(child, closure);
	return closure;
}
function finishCodexAppServerTransportClose(child, options, killTransport, resumeRoot) {
	const forceKillDelayMs = options.forceKillDelayMs ?? 1e3;
	const forceKill = setTimeout(() => {
		if (hasCodexAppServerTransportExited(child)) return;
		killTransport();
	}, Math.max(1, forceKillDelayMs));
	forceKill.unref?.();
	child.once("exit", () => {
		clearTimeout(forceKill);
		if (!options.drainStdio) {
			child.stdout.destroy?.();
			child.stderr.destroy?.();
		}
	});
	try {
		child.stdin.end?.();
		child.stdin.destroy?.();
	} finally {
		resumeRoot?.();
	}
	child.unref?.();
	child.stdout.unref?.();
	child.stderr.unref?.();
	child.stdin.unref?.();
}
/** Reports physical settlement separately from confirmed process cleanup. */
async function closeCodexAppServerTransportAndWait(child, options = {}) {
	const drained = options.drainStdio ? Promise.all([child.stdout, child.stderr].map((stream) => finished(stream, { cleanup: true }))).then(() => true, () => false) : void 0;
	const closure = beginCodexAppServerTransportClose(child, options);
	const containment = await closure.closing;
	const settled = await waitForCodexAppServerTransportExit(child, options.exitTimeoutMs ?? 2e3, drained);
	if (settled) await waitForCodexAppServerProcessRegistrationCleanup(child);
	closure.naturalExit = containment === "natural" && settled;
	if (options.drainStdio) {
		child.stdout.destroy?.();
		child.stderr.destroy?.();
	}
	return settled ? {
		exited: true,
		cleanup: containment === "contained" && !closure.wasForced() && child.signalCode == null ? "closed" : "uncertain"
	} : {
		exited: false,
		cleanup: "uncertain"
	};
}
function hasCodexAppServerTransportExited(child) {
	return child.exitCode !== null && child.exitCode !== void 0 ? true : child.signalCode !== null && child.signalCode !== void 0;
}
async function waitForCodexAppServerTransportExit(child, timeoutMs, drained) {
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (exited) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			child.off?.("exit", onExit);
			resolve(exited);
		};
		const onExit = () => {
			if (drained) drained.then(finish);
			else finish(true);
		};
		const timeout = setTimeout(() => finish(false), Math.max(1, timeoutMs));
		child.once("exit", onExit);
		if (hasCodexAppServerTransportExited(child)) onExit();
	});
}
function signalCodexAppServerTransport(child, signal) {
	if (child.pid && process.platform !== "win32") try {
		process.kill(-child.pid, signal);
		return;
	} catch {}
	child.kill?.(signal);
}
//#endregion
//#region extensions/codex/src/app-server/transport-stdio.ts
/**
* Creates and configures stdio-backed Codex app-server transports, including
* Windows spawn normalization and environment filtering.
*/
const UNSAFE_ENVIRONMENT_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const RUNTIME_INJECTION_ENVIRONMENT_KEYS = /* @__PURE__ */ new Set([
	"NODE_PATH",
	"LD_AUDIT",
	"LD_LIBRARY_PATH",
	"LD_PRELOAD"
]);
const QA_PARENT_PID_ENV = "OPENCLAW_QA_PARENT_PID";
/** Resolves the concrete command/argv/shell settings used to spawn Codex app-server. */
function resolveCodexAppServerSpawnInvocation(options, env) {
	if (options.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
	const program = resolveWindowsSpawnProgram({
		command: options.command,
		platform: process.platform,
		env,
		execPath: process.execPath,
		packageName: "@openai/codex"
	});
	const args = normalizeCodexAppServerArgs(options.args);
	const resolved = materializeWindowsSpawnProgram(program, args);
	if (options.commandSource === "resolved-managed" && resolved.resolution === "direct" && [
		".cjs",
		".js",
		".mjs"
	].includes(path.extname(resolved.command).toLowerCase())) return {
		...resolved,
		command: process.execPath,
		argv: [resolved.command, ...resolved.argv],
		resolution: "node-entrypoint"
	};
	return resolved;
}
/** Merges app-server environment overrides while honoring clearEnv and unsafe key filtering. */
function resolveCodexAppServerSpawnEnv(options, baseEnv = process.env, platform = process.platform) {
	const env = Object.create(null);
	copySafeEnvironmentEntries(env, baseEnv);
	copySafeEnvironmentEntries(env, options.env ?? {});
	const keysToClear = normalizedEnvironmentKeys(options.clearEnv ?? []);
	if (platform === "win32") {
		const lowerCaseKeysToClear = new Set(keysToClear.map((key) => key.toLowerCase()));
		for (const candidate of Object.keys(env)) if (lowerCaseKeysToClear.has(candidate.toLowerCase())) delete env[candidate];
	} else for (const key of keysToClear) delete env[key];
	for (const key of Object.keys(env)) if (isCodexRuntimeInjectionEnvironmentKey(key)) delete env[key];
	return env;
}
function isCodexRuntimeInjectionEnvironmentKey(rawKey) {
	const key = rawKey.toUpperCase();
	return RUNTIME_INJECTION_ENVIRONMENT_KEYS.has(key) || key.startsWith("DYLD_");
}
/** Keeps QA-owned app-server processes inside the gateway process-group cleanup boundary. */
function resolveCodexAppServerDetachedMode(env, platform = process.platform) {
	return platform !== "win32" && !env[QA_PARENT_PID_ENV]?.trim();
}
function normalizedEnvironmentKeys(rawKeys) {
	const keys = [];
	for (const rawKey of rawKeys) {
		const key = rawKey.trim();
		if (key.length > 0) keys.push(key);
	}
	return keys;
}
function copySafeEnvironmentEntries(target, source) {
	for (const [key, value] of Object.entries(source)) {
		if (UNSAFE_ENVIRONMENT_KEYS.has(key)) continue;
		target[key] = value;
	}
}
/** Spawns the Codex app-server process and returns the shared transport interface. */
async function createStdioTransport(options, baseEnv = process.env, assertCurrent, onSpawn) {
	const env = resolveCodexAppServerSpawnEnv(options, baseEnv);
	const invocation = resolveCodexAppServerSpawnInvocation(options, env);
	const nativeCommand = options.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(options.command, { pathExists: () => true }) : void 0;
	const launchKey = JSON.stringify([
		invocation.command,
		options.cwd ?? process.cwd(),
		nativeCommand ?? null,
		path.isAbsolute(invocation.command) ? null : env.PATH ?? env.Path
	]);
	const previousFailure = getCodexAppServerSpawnFailure(launchKey) ?? (nativeCommand ? getCodexAppServerSpawnFailure(nativeCommand) : void 0);
	if (previousFailure) throw previousFailure;
	const register = await prepareCodexAppServerProcessRegistration();
	assertCurrent?.();
	embeddedAgentLog.debug("Codex app-server spawn", {
		command: invocation.command,
		launcher: options.command,
		...options.cwd ? { cwd: options.cwd } : {},
		...nativeCommand ? { nativeCommand } : {},
		platform: process.platform,
		arch: process.arch
	});
	let child;
	try {
		child = spawn(invocation.command, invocation.argv, {
			...options.cwd !== void 0 ? { cwd: options.cwd } : {},
			env,
			detached: resolveCodexAppServerDetachedMode(env),
			shell: invocation.shell,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			windowsHide: invocation.windowsHide
		});
	} catch (error) {
		throw recordCodexAppServerSpawnFailure(error, invocation.command, launchKey);
	}
	try {
		if (nativeCommand && invocation.resolution === "node-entrypoint") observeManagedCodexLauncherFailure(child, nativeCommand);
		onSpawn?.(child);
		await register(child);
		assertCurrent?.();
		return child;
	} catch (error) {
		await closeCodexAppServerTransportAndWait(child, { drainStdio: true });
		assertCurrent?.();
		throw child.startupFailure?.error ?? recordCodexAppServerSpawnFailure(error, invocation.command, launchKey);
	}
}
//#endregion
export { closeCodexAppServerTransportAndWait as a, closeCodexAppServerTransport as i, resolveCodexAppServerSpawnEnv as n, hasCodexAppServerNaturalExit as o, resolveCodexAppServerSpawnInvocation as r, createCodexAppServerProcessReaperService as s, createStdioTransport as t };

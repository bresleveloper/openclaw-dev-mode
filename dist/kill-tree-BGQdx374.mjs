import { opendirSync, readFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
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
function signalProcessTree(pid, signal, opts) {
	if (!Number.isFinite(pid) || pid <= 0) {
		opts?.onComplete?.();
		return;
	}
	if (process.platform === "win32") {
		signalProcessTreeWindowsAndWait(pid, signal).then(opts?.onComplete);
		return;
	}
	const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
	const attachedLinuxTree = opts?.detached === false && !useGroupKill && process.platform === "linux";
	const processTree = attachedLinuxTree ? collectUnixProcessTree(pid) : void 0;
	if (attachedLinuxTree && !processTree) {
		signalProcessTreeUnix(pid, signal, false);
		opts?.onComplete?.();
		return;
	}
	signalProcessTreeUnix(pid, signal, useGroupKill, processTree);
	opts?.onComplete?.();
}
/** Capture the group selected by signalProcessTree while its leader still exists. */
function readUnixProcessGroupMembers(pid) {
	if (process.platform === "win32" || !isProcessGroupLeader(pid)) return [pid];
	try {
		const result = spawnSync("ps", ["-axo", "pid=,pgid="], {
			encoding: "utf8",
			timeout: 500
		});
		if (result.error || result.status !== 0) return [pid];
		const members = /* @__PURE__ */ new Set([pid]);
		for (const line of result.stdout.split("\n")) {
			const [memberText, groupText] = line.trim().split(/\s+/);
			const member = parseProcessGroupId(memberText);
			if (member && parseProcessGroupId(groupText) === pid) members.add(member);
		}
		return [...members];
	} catch {
		return [pid];
	}
}
/** Signals every process group and process still owned by one forkpty session. */
function signalPtySessionTree(pid, signal) {
	if (!Number.isFinite(pid) || pid <= 0) return;
	if (process.platform === "win32") {
		signalProcessTreeWindowsAndWait(pid, signal);
		return;
	}
	const darwinTty = process.platform === "darwin" ? readDarwinPtyTty(pid) : void 0;
	if (process.platform === "darwin" && !darwinTty) {
		signalUnixTarget(-pid, signal);
		return;
	}
	const members = readProcessSessionMembers(pid, darwinTty);
	if (!members) {
		signalUnixTarget(-pid, signal);
		return;
	}
	const signalMembers = (snapshot) => {
		const groups = new Set(snapshot.map((member) => member.pgid));
		groups.delete(pid);
		for (const pgid of groups) signalUnixTarget(-pgid, signal);
		for (const member of snapshot) if (member.pid !== pid) signalUnixTarget(member.pid, signal);
	};
	signalMembers(members);
	const remaining = readProcessSessionMembers(pid, darwinTty);
	if (remaining) signalMembers(remaining);
	signalUnixTarget(-pid, signal);
	signalUnixTarget(pid, signal);
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
function readDarwinPtyTty(sessionLeaderPid) {
	try {
		const leader = spawnSync("ps", [
			"-p",
			String(sessionLeaderPid),
			"-o",
			"tty="
		], {
			encoding: "utf8",
			timeout: 500
		});
		const tty = leader.stdout.trim();
		if (leader.error || leader.status !== 0 || !tty || tty === "?" || tty === "??") return;
		return tty;
	} catch {
		return;
	}
}
function readProcessSessionMembers(sessionId, darwinTty) {
	try {
		const expectedSession = darwinTty ?? String(sessionId);
		const result = spawnSync("ps", darwinTty ? [
			"-t",
			darwinTty,
			"-o",
			"pid=,pgid="
		] : ["-axo", "pid=,pgid=,sid="], {
			encoding: "utf8",
			timeout: 500
		});
		if (result.error || result.status !== 0) return;
		const members = [];
		for (const line of result.stdout.split("\n")) {
			const [pidText, pgidText, session] = line.trim().split(/\s+/);
			const pid = parseProcessGroupId(pidText);
			const pgid = parseProcessGroupId(pgidText);
			if (pid && pgid && (darwinTty || session === expectedSession)) members.push({
				pid,
				pgid
			});
		}
		return members;
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
export { signalPtySessionTree as i, readUnixProcessGroupMembers as n, signalProcessTree as r, killProcessTree as t };

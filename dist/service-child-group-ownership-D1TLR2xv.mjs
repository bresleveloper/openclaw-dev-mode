import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { a as isPidDefinitelyDead } from "./pid-alive-dd7OR8F6.mjs";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readProcessIdentity } from "@openclaw/proc-safe/identity";
import { listProcesses, readProcessCommand } from "@openclaw/proc-safe/inspect";
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
function startIdentity(identity) {
	if (!identity) throw new DarwinProcessInspectionError("permission");
	const date = /* @__PURE__ */ new Date(Math.floor(identity.startTimeMicros / 1e6) * 1e3);
	if (!Number.isFinite(date.getTime()) || identity.startTimeMicros <= 0) throw new DarwinProcessInspectionError("unavailable");
	const [day, dayOfMonth, month, year, time] = date.toUTCString().split(" ");
	return `${day.slice(0, -1)} ${month} ${Number(dayOfMonth)} ${time} ${year}`;
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
/** Complete census, or selected identities. Missing PIDs are omitted; inspection errors throw. */
async function readDarwinProcessSnapshot(deadline, pids) {
	if (pids?.some((pid) => !Number.isInteger(pid) || pid <= 0 || pid > 2147483647)) throw new DarwinProcessInspectionError("unavailable");
	if (pids?.length === 0) return [];
	const rows = census(deadline, pids).map((row) => Object.assign(topology(row), { startedAt: startIdentity(row.identity) }));
	remaining(deadline);
	return rows;
}
/** Inspect a complete lineage without requiring start-time access to unrelated users. */
async function readDarwinProcessTree(deadline, roots) {
	const tree = census(deadline).map((row) => ({
		process: topology(row),
		identity: row.identity
	}));
	const selected = new Set(roots);
	const pending = [...roots];
	for (const parent of pending) for (const { process: row } of tree) if (row.ppid === parent && !selected.has(row.pid)) {
		selected.add(row.pid);
		pending.push(row.pid);
	}
	selected.add(process.pid);
	const result = tree.filter(({ process: row }) => selected.has(row.pid)).map(({ process: row, identity }) => Object.assign(row, { startedAt: startIdentity(identity) }));
	remaining(deadline);
	return result;
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
/** Arguments only: never request or return process environment values. */
async function readDarwinProcessCommandLine(pid, deadline) {
	remaining(deadline);
	try {
		const command = readProcessCommand(pid);
		remaining(deadline);
		return command?.argv.join(" ") ?? "";
	} catch (cause) {
		remaining(deadline);
		throw failure(cause);
	}
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
/** Reject a known unsupported legacy contract before launching application work. */
function assertProcessGroupControl() {
	if (process.platform !== "linux") return;
	try {
		process.kill(0, 0);
	} catch (cause) {
		throw new Error("Process-group ownership is unavailable; use a matching Node host and worker with native process ownership. Cleanup cannot fall back to transport-only execution.", { cause });
	}
}
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
/** Only kernel absence, observed outside the owned group, confirms extinction. */
function isOwnedProcessGroupGone(pgid) {
	try {
		process.kill(-pgid, 0);
		return false;
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ESRCH") return true;
		if (code === "EPERM") return false;
		throw error;
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
export { readDarwinProcessCommandLine as a, DarwinProcessInspectionError as i, isOwnedProcessGroupGone as n, readDarwinProcessSnapshot as o, readProcessGroupMembers as r, readDarwinProcessTree as s, assertProcessGroupControl as t };

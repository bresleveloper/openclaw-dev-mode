import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-CXdZEzr_.mjs";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
//#region src/process/supervisor/service-child-group-ownership.ts
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
export { isOwnedProcessGroupGone as n, readProcessGroupMembers as r, hasLiveOwnedProcessGroupMembers as t };

import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
//#region src/process/scoped-child-reaper.ts
const require = createRequire(import.meta.url);
const scheduledChildren = /* @__PURE__ */ new WeakSet();
const POLL_INTERVAL_MS = 25;
const CLEANUP_DEADLINE_MS = 3e4;
const WNOHANG = 1;
let waitPid;
function loadWaitPid() {
	if (waitPid !== void 0) return waitPid;
	try {
		waitPid = require("koffi").load(null).func("int waitpid(int pid, int *status, int options)");
	} catch {
		waitPid = null;
	}
	return waitPid;
}
function readGroupMembers(groupId) {
	let entries;
	try {
		entries = readdirSync("/proc");
	} catch {
		return [];
	}
	const members = [];
	for (const entry of entries) {
		if (!/^\d+$/u.test(entry)) continue;
		let stat;
		try {
			stat = readFileSync(`/proc/${entry}/stat`, "utf8");
		} catch {
			continue;
		}
		const fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
		if (Number(fields[2]) === groupId) members.push({
			pid: Number(entry),
			ppid: Number(fields[1]),
			state: fields[0]
		});
	}
	return members;
}
function retainAdoptedCleanup(rootPid) {
	const wait = loadWaitPid();
	if (!wait) return;
	const deadline = performance.now() + CLEANUP_DEADLINE_MS;
	let quietScans = 0;
	const tick = () => {
		if (performance.now() >= deadline) return;
		let remaining = false;
		for (const member of readGroupMembers(rootPid)) {
			if (member.pid === rootPid) continue;
			if (member.ppid === process.pid && member.state === "Z" && wait(member.pid, null, WNOHANG) === member.pid) continue;
			remaining = true;
		}
		quietScans = remaining ? 0 : quietScans + 1;
		if (quietScans < 2) schedule();
	};
	const schedule = () => {
		setTimeout(tick, POLL_INTERVAL_MS).unref();
	};
	schedule();
}
/** Retain only the terminated group's adopted children after libuv consumes root exit. */
function scheduleAdoptedChildZombieReapAfterExit(child, usedProcessGroup) {
	if (process.platform !== "linux" || !usedProcessGroup || child.pid === void 0 || scheduledChildren.has(child)) return;
	const rootPid = child.pid;
	scheduledChildren.add(child);
	const start = () => retainAdoptedCleanup(rootPid);
	if (child.exitCode !== null || child.signalCode !== null) start();
	else child.once("exit", start);
}
//#endregion
export { scheduleAdoptedChildZombieReapAfterExit as t };

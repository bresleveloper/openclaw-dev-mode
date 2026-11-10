import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import "./runtime-worker-url-CvMrvFI1.mjs";
import { a as isPidDefinitelyDead, n as getProcessInstanceStartTime } from "./pid-alive-dd7OR8F6.mjs";
import "./worker-cpu-c5lFIb1t.mjs";
import "./service-child-group-ownership-D1TLR2xv.mjs";
import "./linux-oom-score-BCVNjaDp.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { t as readDarwinProcessCommand } from "./darwin-process-command-DP1kTZWX.mjs";
import "./exec-Bf6uhUA7.mjs";
import "./exec-spawn-Cn2m7YAI.mjs";
import "./child-DngHEd7s.mjs";
import "./owned-stdio-CtvrdfBc.mjs";
import "./worker-task-server-sMsYUF1K.mjs";
import "./supervisor-markers-D4rfU3wJ.mjs";
import "./terminal-pty-AuGVyE64.mjs";
import { realpathSync } from "node:fs";
import { execFileSync } from "node:child_process";
//#region src/process/orphaned-process.ts
function readProcessCwd(pid) {
	const paths = execFileSync("/usr/sbin/lsof", [
		"-a",
		"-p",
		String(pid),
		"-d",
		"cwd",
		"-F0n"
	], {
		encoding: "utf8",
		timeout: 5e3,
		maxBuffer: 65536,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	}).split("\0").filter((field) => field.startsWith("n"));
	if (paths.length !== 1 || !paths[0]) throw new Error(`Cannot inspect orphaned process ${pid}'s working directory; inspect it before retrying.`);
	return paths[0].slice(1);
}
function readProcesses(pid) {
	let output;
	try {
		output = execFileSync("/bin/ps", [
			...pid === void 0 ? ["-A"] : ["-p", String(pid)],
			"-o",
			"pid=,ppid=,uid=,comm="
		], {
			encoding: "utf8",
			timeout: 5e3,
			maxBuffer: 4194304,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		});
	} catch (error) {
		if (pid !== void 0 && isPidDefinitelyDead(pid)) return [];
		throw error;
	}
	return output.split("\n").flatMap((line) => {
		const [, processId, parentPid, uid, command] = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.+)$/.exec(line) ?? [];
		return command ? [{
			pid: Number(processId),
			parentPid: Number(parentPid),
			uid: Number(uid),
			command: command.trim()
		}] : [];
	});
}
function captureProcess(row, command, matchesArguments, cwd) {
	if (row.uid !== process.getuid?.() || row.command !== command) return;
	try {
		const startedAt = getProcessInstanceStartTime(row.pid);
		const observed = readDarwinProcessCommand(row.pid, "same");
		if (!observed || !("argv" in observed) || observed.executable !== command || observed.argv[0] !== command || matchesArguments && !matchesArguments(observed.argv)) return;
		if (cwd !== void 0 && readProcessCwd(row.pid) !== cwd) return;
		if (startedAt === null) throw new Error(`Cannot verify orphaned process ${row.pid}; stop it manually before retrying.`);
		if (getProcessInstanceStartTime(row.pid) !== startedAt) return;
		return {
			...row,
			startedAt,
			argv: observed.argv
		};
	} catch (error) {
		if (isPidDefinitelyDead(row.pid)) return;
		throw error;
	}
}
function isCapturedProcessAlive(target) {
	if (isPidDefinitelyDead(target.pid)) return false;
	const current = getProcessInstanceStartTime(target.pid);
	return current === null || current === target.startedAt;
}
/** Reclaim a launchd-adopted tree while its captured executable and birth still match. */
async function reapOrphanedProcesses(params) {
	params.signal?.throwIfAborted();
	if (process.platform !== "darwin" || getProcessInstanceStartTime(process.pid) === null) return [];
	const cwd = params.cwd === void 0 ? void 0 : realpathSync(params.cwd);
	const rows = readProcesses();
	const roots = rows.filter((row) => row.parentPid === 1 && row.pid !== process.pid).map((row) => captureProcess(row, params.command, params.matchesArguments, cwd)).filter((row) => row !== void 0);
	const reaped = [];
	for (const root of roots) {
		const captured = /* @__PURE__ */ new Map([[root.pid, root]]);
		for (let size = 0; size !== captured.size;) {
			size = captured.size;
			for (const row of rows) {
				const parent = captured.get(row.parentPid);
				if (captured.has(row.pid) || !parent || !isCapturedProcessAlive(parent)) continue;
				const current = readProcesses(row.pid)[0];
				const child = current?.parentPid === parent.pid && captureProcess(current, params.command);
				if (child && getProcessInstanceStartTime(parent.pid) === parent.startedAt) captured.set(child.pid, child);
			}
		}
		const canSignal = (target) => {
			if (!isCapturedProcessAlive(target)) return false;
			const row = readProcesses(target.pid)[0];
			const current = row && captureProcess(row, params.command, void 0, target.pid === root.pid ? cwd : void 0);
			if (!isCapturedProcessAlive(target)) return false;
			if (!current || current.startedAt !== target.startedAt || current.argv.length !== target.argv.length || current.argv.some((value, index) => value !== target.argv[index]) || current.parentPid !== target.parentPid && current.parentPid !== 1 || target.pid === root.pid && !params.matchesArguments(current.argv)) throw new Error(`Orphaned process ${target.pid} changed identity; refusing to signal it.`);
			return true;
		};
		const failures = [];
		let signalAttempted = false;
		const signalCaptured = (target, signal) => {
			try {
				if (canSignal(target)) {
					if (!signalAttempted) params.signal?.throwIfAborted();
					signalAttempted = true;
					process.kill(target.pid, signal);
				}
			} catch (error) {
				if (!signalAttempted) throw error;
				if (!hasErrnoCode(error, "ESRCH")) failures.push(error);
			}
		};
		const alive = () => [...captured.values()].filter(isCapturedProcessAlive);
		const waitForExit = async () => {
			const deadline = performance.now() + 5e3;
			while (alive().length > 0 && performance.now() < deadline) await sleepWithAbort(Math.min(25, deadline - performance.now()));
		};
		params.signal?.throwIfAborted();
		params.onReap?.(root.pid);
		params.signal?.throwIfAborted();
		signalCaptured(root, "SIGTERM");
		if (!signalAttempted) continue;
		for (const target of captured.values()) if (target.pid !== root.pid) signalCaptured(target, "SIGTERM");
		await waitForExit();
		for (const target of alive()) signalCaptured(target, "SIGKILL");
		await waitForExit();
		if (alive().length > 0) failures.push(/* @__PURE__ */ new Error(`Orphaned process tree ${root.pid} did not stop; stop it manually.`));
		if (failures.length > 0) throw new AggregateError(failures, `Could not safely stop orphaned process tree ${root.pid}.`);
		reaped.push(root.pid);
		params.signal?.throwIfAborted();
	}
	return reaped;
}
//#endregion
export { reapOrphanedProcesses as t };

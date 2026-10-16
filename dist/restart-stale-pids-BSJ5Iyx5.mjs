import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { b as uniqueValues } from "./string-normalization-CECOqf64.mjs";
import { n as readUnixProcessGroupMembers, r as signalProcessTree } from "./kill-tree-ecObdMeW.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { a as isPidAlive, l as readWindowsProcessAncestorsSync, n as getFileLockProcessStartTime, o as isPidDefinitelyDead, t as collectProcessAncestorPids } from "./pid-alive-CPS_shDt.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as getWindowsInstallRoots } from "./windows-install-roots-Qi4d52Il.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-DMAY-YPv.mjs";
import { a as readGatewayLockProcessCmdline, c as readWindowsListeningPidsResultSync, d as readWindowsProcessArgsSync, r as readGatewayOwnerLease, s as readWindowsListeningPidsOnPortSync, u as readWindowsProcessArgsResultSync } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { n as resolveLsofCommandSync } from "./ports-lsof-Rgl6w06g.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
//#region src/infra/spawn-ps.ts
/** Run a bounded ps probe without letting an ignored SIGTERM extend the synchronous wait. */
function spawnPsSync(args, timeoutMs) {
	return spawnSync("ps", args, {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: timeoutMs
	});
}
//#endregion
//#region src/infra/restart-stale-pids.ts
const INITIAL_LSOF_TIMEOUT_MS = 5e3;
const PROCESS_INSPECTION_TIMEOUT_MS = 2e3;
const STALE_SIGTERM_WAIT_MS = 600;
const STALE_SIGKILL_WAIT_MS = 400;
const PORT_FREE_POLL_INTERVAL_MS = 50;
const PORT_FREE_TIMEOUT_MS = 2e3;
const POLL_SPAWN_TIMEOUT_MS = 400;
const restartLog = createSubsystemLogger("restart");
/** Terminate externally discovered stale gateway processes and allow cleanup to settle. */
async function terminateStaleGatewayPids(pids, options = {}) {
	const ownerContext = { env: options.env };
	if (readGatewayOwnerLease(ownerContext)) return [];
	const targets = Array.from(new Set(pids.filter((pid) => Number.isSafeInteger(pid) && pid > 0))).map((pid) => ({
		pid,
		startedAt: getFileLockProcessStartTime(pid, options.env)
	}));
	const canSignal = (target) => {
		if (target.startedAt === null || isPidDefinitelyDead(target.pid) || getFileLockProcessStartTime(target.pid, options.env) !== target.startedAt || readGatewayOwnerLease(ownerContext)) return false;
		options.assertCurrent?.();
		return true;
	};
	const signal = (pid, value, detached) => new Promise((resolve) => {
		signalProcessTree(pid, value, {
			detached,
			onComplete: resolve
		});
	});
	const signaled = [];
	for (const target of targets) {
		const members = readUnixProcessGroupMembers(target.pid).map((pid) => pid === target.pid ? target : {
			pid,
			startedAt: getFileLockProcessStartTime(pid, options.env)
		});
		const currentMembers = new Set(readUnixProcessGroupMembers(target.pid));
		if (canSignal(target)) {
			await signal(target.pid, "SIGTERM");
			signaled.push({
				target,
				members: members.filter(({ pid }) => currentMembers.has(pid))
			});
		}
	}
	if (signaled.length > 0) {
		await sleep(300);
		for (const { members } of signaled) for (const member of members) if (canSignal(member)) await signal(member.pid, "SIGKILL", false);
		await sleep(200);
	}
	return signaled.map(({ target }) => target.pid);
}
function sleepSync(ms) {
	const timeoutMs = Math.max(0, Math.floor(ms));
	if (timeoutMs <= 0) return;
	try {
		const lock = new Int32Array(new SharedArrayBuffer(4));
		Atomics.wait(lock, 0, 0, timeoutMs);
	} catch {
		const start = Date.now();
		while (Date.now() - start < timeoutMs);
	}
}
/** An unreadable /proc hop truncates the best-effort ancestor walk. */
function readParentPidFromProc(pid) {
	try {
		const match = readFileSync(`/proc/${pid}/status`, "utf8").match(/^PPid:\s*(\d+)/m);
		if (!match) return null;
		const parsed = Number.parseInt(match[1] ?? "", 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
	} catch {
		return null;
	}
}
function readParentPidFromPs(pid, spawnTimeoutMs) {
	try {
		const res = spawnPsSync([
			"-o",
			"ppid=",
			"-p",
			String(pid)
		], spawnTimeoutMs);
		if (res.error || res.status !== 0 || !res.stdout.trim()) return null;
		return parseStrictPositiveInteger(res.stdout.trim()) ?? null;
	} catch {
		return null;
	}
}
/**
* Protect the caller and its ancestors from cleanup that would cascade-kill the caller.
* Include PID 1 for container Gateways. process.ppid is always available; transitive
* ancestry is best effort through /proc, ps, or one Windows process snapshot.
*/
function inspectSelfAndAncestorPidsSync(spawnTimeoutMs = PROCESS_INSPECTION_TIMEOUT_MS, options = {}) {
	const pids = /* @__PURE__ */ new Set([process.pid]);
	const immediateParent = process.ppid;
	if (!Number.isFinite(immediateParent) || immediateParent <= 0) return {
		pids,
		complete: process.platform !== "win32" && pids.has(1)
	};
	if (process.platform !== "win32" || !options.requireVerifiedParent) pids.add(immediateParent);
	if (process.platform === "win32") {
		const ancestry = readWindowsProcessAncestorsSync(process.pid, 32, spawnTimeoutMs);
		for (const pid of ancestry.pids) pids.add(pid);
		return {
			pids,
			complete: ancestry.complete
		};
	}
	const readTransitiveParent = process.platform === "linux" ? readParentPidFromProc : process.platform === "darwin" ? (pid) => readParentPidFromPs(pid, spawnTimeoutMs) : null;
	if (!readTransitiveParent) return {
		pids,
		complete: pids.has(1)
	};
	const ancestors = collectProcessAncestorPids(immediateParent, readTransitiveParent);
	return {
		pids: ancestors,
		complete: ancestors.has(1)
	};
}
/** Cleanup protects every observed ancestor, even when the remaining chain is unknown. */
function getSelfAndAncestorPidsSync(spawnTimeoutMs = PROCESS_INSPECTION_TIMEOUT_MS, options = {}) {
	return inspectSelfAndAncestorPidsSync(spawnTimeoutMs, options).pids;
}
function getExcludedGatewayPidsSync(spawnTimeoutMs, protectedPid) {
	const excluded = getSelfAndAncestorPidsSync(spawnTimeoutMs);
	if (typeof protectedPid === "number" && Number.isSafeInteger(protectedPid) && protectedPid > 0) excluded.add(protectedPid);
	return excluded;
}
function parsePsCommandLine(raw) {
	const args = [];
	for (const match of raw.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)) {
		const value = match[1] ?? match[2] ?? match[3];
		if (value) args.push(value);
	}
	return args;
}
function readUnixProcessArgsSync(pid, spawnTimeoutMs) {
	const args = readGatewayLockProcessCmdline(pid, process.platform, spawnTimeoutMs);
	if (args?.length || process.platform === "darwin") return args;
	const res = spawnPsSync([
		"-ww",
		"-p",
		String(pid),
		"-o",
		"command="
	], spawnTimeoutMs);
	if (res.error || res.status !== 0 || !res.stdout.trim()) return null;
	return parsePsCommandLine(res.stdout.trim());
}
function verifyGatewayPidByArgvSync(pid, spawnTimeoutMs) {
	const args = readUnixProcessArgsSync(pid, spawnTimeoutMs);
	return args != null && classifyOpenClawArgv(args, {
		command: "gateway",
		pid
	}).kind === "openclaw";
}
function parsePidsFromLsofOutput(stdout, spawnTimeoutMs, protectedPid) {
	const excluded = getExcludedGatewayPidsSync(spawnTimeoutMs, protectedPid);
	const pids = [];
	for (const line of stdout.split(/\r?\n/)) {
		const pid = line.startsWith("p") ? parseStrictPositiveInteger(line.slice(1)) : void 0;
		if (!pid || excluded.has(pid)) continue;
		if (verifyGatewayPidByArgvSync(pid, spawnTimeoutMs)) pids.push(pid);
	}
	return uniqueValues(pids);
}
function verifyWindowsGatewayArgv(pid, args) {
	if (!args) return false;
	const identity = classifyOpenClawArgv(args, {
		command: "gateway",
		pid
	});
	if (identity.kind === "unclassified") restartLog.warn(`Could not classify PID ${pid}: ${identity.reason}; leaving listener running.`);
	return identity.kind === "openclaw";
}
function filterVerifiedWindowsGatewayPids(rawPids, protectedPid) {
	const excluded = getExcludedGatewayPidsSync(PROCESS_INSPECTION_TIMEOUT_MS, protectedPid);
	return uniqueValues(rawPids).filter((pid) => Number.isFinite(pid) && pid > 0 && !excluded.has(pid)).filter((pid) => verifyWindowsGatewayArgv(pid, readWindowsProcessArgsSync(pid)));
}
function filterVerifiedWindowsGatewayPidsResult(rawPids, processArgsResult, protectedPid) {
	const excluded = getExcludedGatewayPidsSync(PROCESS_INSPECTION_TIMEOUT_MS, protectedPid);
	const verified = [];
	for (const pid of uniqueValues(rawPids)) {
		if (!Number.isFinite(pid) || pid <= 0 || excluded.has(pid)) continue;
		const argsResult = processArgsResult(pid);
		if (!argsResult.ok) return {
			ok: false,
			permanent: argsResult.permanent
		};
		if (verifyWindowsGatewayArgv(pid, argsResult.args)) verified.push(pid);
	}
	return {
		ok: true,
		pids: verified
	};
}
function resolveProtectedPidAfterEnumeration(options) {
	return options?.resolveProtectedPid ? options.resolveProtectedPid() : options?.protectedPid;
}
function findVerifiedWindowsGatewayPidsOnPortSync(port, options) {
	return filterVerifiedWindowsGatewayPids(readWindowsListeningPidsOnPortSync(port), resolveProtectedPidAfterEnumeration(options));
}
function findVerifiedWindowsGatewayPidsOnPortResultSync(port, options) {
	const result = readWindowsListeningPidsResultSync(port);
	if (!result.ok) return result;
	return filterVerifiedWindowsGatewayPidsResult(result.pids, (pid) => readWindowsProcessArgsResultSync(pid), resolveProtectedPidAfterEnumeration(options));
}
function findGatewayPidsOnPortWithProtectedPidSync(port, lsofTimeoutMs, processInspectionTimeoutMs, options) {
	if (process.platform === "win32") return findVerifiedWindowsGatewayPidsOnPortSync(port, options);
	const lsof = resolveLsofCommandSync();
	const res = spawnSync(lsof, [
		"-nP",
		`-iTCP:${port}`,
		"-sTCP:LISTEN",
		"-Fpc"
	], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: lsofTimeoutMs
	});
	if (res.error) {
		const code = res.error.code;
		if (code === "ENOENT") return [];
		const detail = code && code.trim().length > 0 ? code : res.error instanceof Error ? res.error.message : "unknown error";
		restartLog.warn(`lsof failed during initial stale-pid scan for port ${port}: ${detail}`);
		return [];
	}
	if (res.status === 1) return [];
	if (res.status !== 0) {
		restartLog.warn(`lsof exited with status ${res.status} during initial stale-pid scan for port ${port}; skipping stale pid check`);
		return [];
	}
	return parsePidsFromLsofOutput(res.stdout, processInspectionTimeoutMs, resolveProtectedPidAfterEnumeration(options));
}
/**
* Find PIDs of gateway processes listening on the given port using synchronous lsof.
* Returns only PIDs that belong to openclaw gateway processes (not the current process).
*/
function findGatewayPidsOnPortSync(port, spawnTimeoutMs) {
	return findGatewayPidsOnPortWithProtectedPidSync(port, spawnTimeoutMs ?? INITIAL_LSOF_TIMEOUT_MS, spawnTimeoutMs ?? PROCESS_INSPECTION_TIMEOUT_MS);
}
function pollPortOnce(port) {
	if (process.platform === "win32") return pollPortOnceWindows(port);
	try {
		const lsof = resolveLsofCommandSync();
		const res = spawnSync(lsof, [
			"-nP",
			`-iTCP:${port}`,
			"-sTCP:LISTEN",
			"-Fpc"
		], {
			env: resolveDiagnosticProcessEnv(),
			encoding: "utf8",
			timeout: POLL_SPAWN_TIMEOUT_MS
		});
		if (res.error) {
			const code = res.error.code;
			return {
				free: null,
				permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
			};
		}
		if (res.status === 1) return res.stdout.trim() ? { free: false } : { free: true };
		if (res.status !== 0) return {
			free: null,
			permanent: false
		};
		return { free: false };
	} catch {
		return {
			free: null,
			permanent: false
		};
	}
}
function pollPortOnceWindows(port) {
	try {
		const result = readWindowsListeningPidsResultSync(port, POLL_SPAWN_TIMEOUT_MS);
		if (!result.ok) return {
			free: null,
			permanent: result.permanent
		};
		return result.pids.length === 0 ? { free: true } : { free: false };
	} catch {
		return {
			free: null,
			permanent: false
		};
	}
}
/**
* Synchronously terminate stale gateway processes.
* Callers must pass a non-empty pids array.
*
* On Unix: sends SIGTERM, waits briefly, then SIGKILL for survivors.
* On Windows: uses taskkill (graceful first, then /F for force-kill).
*/
function terminateStaleProcessesSync(pids, canSignal) {
	if (process.platform === "win32") return terminateStaleProcessesWindows(pids, canSignal);
	const killed = [];
	for (const pid of pids) {
		if (!canSignal()) break;
		if (trySignalStaleProcess(pid, "SIGTERM")) killed.push(pid);
	}
	if (killed.length === 0) return killed;
	sleepSync(STALE_SIGTERM_WAIT_MS);
	for (const pid of killed) if (isPidAlive(pid)) {
		if (!canSignal()) break;
		trySignalStaleProcess(pid, "SIGKILL");
	}
	sleepSync(STALE_SIGKILL_WAIT_MS);
	return killed;
}
function trySignalStaleProcess(pid, signal) {
	try {
		process.kill(pid, signal);
		return true;
	} catch (error) {
		if (!hasErrnoCode(error, "ESRCH")) restartLog.warn(`failed to send ${signal} to stale gateway process ${pid}: ${formatErrorMessage(error)}`);
		return false;
	}
}
/**
* Windows-specific process termination using taskkill.
* Sends a graceful taskkill first (/T for tree), waits, then escalates to /F.
*/
function terminateStaleProcessesWindows(pids, canSignal) {
	const taskkillPath = path.win32.join(getWindowsInstallRoots().systemRoot, "System32", "taskkill.exe");
	const killed = [];
	for (const pid of pids) {
		if (!canSignal()) break;
		const graceful = spawnSync(taskkillPath, [
			"/T",
			"/PID",
			String(pid)
		], {
			stdio: "ignore",
			timeout: 5e3,
			windowsHide: true
		});
		if (!(graceful.error != null || (graceful.status ?? 0) !== 0) && !isPidAlive(pid)) {
			killed.push(pid);
			continue;
		}
		sleepSync(STALE_SIGTERM_WAIT_MS);
		if (!isPidAlive(pid)) {
			killed.push(pid);
			continue;
		}
		if (!canSignal()) break;
		const forced = spawnSync(taskkillPath, [
			"/F",
			"/T",
			"/PID",
			String(pid)
		], {
			stdio: "ignore",
			timeout: 5e3,
			windowsHide: true
		});
		if (forced.error != null || (forced.status ?? 0) !== 0) continue;
		sleepSync(STALE_SIGKILL_WAIT_MS);
		if (!isPidAlive(pid)) killed.push(pid);
	}
	return killed;
}
/** Wait for a free port, a permanent inspection failure, or the wall-clock deadline. */
function waitForPortFreeSync(port) {
	const deadline = Date.now() + PORT_FREE_TIMEOUT_MS;
	while (Date.now() < deadline) {
		const result = pollPortOnce(port);
		if (result.free === true) return;
		if (result.free === null && result.permanent) return;
		sleepSync(PORT_FREE_POLL_INTERVAL_MS);
	}
	restartLog.warn(`port ${port} still in use after ${PORT_FREE_TIMEOUT_MS}ms; proceeding anyway`);
}
/**
* Inspect the gateway port and kill any stale gateway processes holding it.
* Blocks until the port is confirmed free (or the poll budget expires) so
* the supervisor (systemd / launchctl) does not race a zombie process for
* the port and enter an EADDRINUSE restart loop.
*
* Called before service restart commands to prevent port conflicts.
*/
function cleanStaleGatewayProcessesSync(portOverride, options) {
	try {
		const ownerContext = { env: options?.env };
		if (readGatewayOwnerLease(ownerContext)) return [];
		const port = typeof portOverride === "number" && Number.isFinite(portOverride) && portOverride > 0 ? Math.floor(portOverride) : resolveGatewayPort(void 0, options?.env ?? process.env);
		const stalePids = process.platform === "win32" ? (() => {
			const result = findVerifiedWindowsGatewayPidsOnPortResultSync(port, options);
			if (result.ok) return result.pids;
			waitForPortFreeSync(port);
			return [];
		})() : findGatewayPidsOnPortWithProtectedPidSync(port, INITIAL_LSOF_TIMEOUT_MS, PROCESS_INSPECTION_TIMEOUT_MS, options);
		if (stalePids.length === 0 || readGatewayOwnerLease(ownerContext)) return [];
		restartLog.warn(`killing ${stalePids.length} stale gateway process(es) before restart: ${stalePids.join(", ")}`);
		const killed = terminateStaleProcessesSync(stalePids, () => {
			options?.assertCurrent?.();
			return readGatewayOwnerLease(ownerContext) === void 0;
		});
		waitForPortFreeSync(port);
		return killed;
	} catch {
		return [];
	}
}
//#endregion
export { terminateStaleGatewayPids as a, inspectSelfAndAncestorPidsSync as i, findGatewayPidsOnPortSync as n, spawnPsSync as o, getSelfAndAncestorPidsSync as r, cleanStaleGatewayProcessesSync as t };

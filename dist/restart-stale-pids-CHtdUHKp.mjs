import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { b as uniqueValues } from "./string-normalization-D6DKCpwE.mjs";
import { n as readUnixProcessGroupMembers, r as signalProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage$1 } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { a as isPidDefinitelyDead, i as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-BLh8C227.mjs";
import { n as getWindowsInstallRoots } from "./windows-install-roots-BWNEWHjx.mjs";
import { a as readGatewayLockProcessCmdline, c as readWindowsListeningPidsResultSync, d as readWindowsProcessArgsSync, r as readGatewayOwnerLease, s as readWindowsListeningPidsOnPortSync, u as readWindowsProcessArgsResultSync } from "./gateway-owner-lease-KxvFWleW.mjs";
import { n as resolveLsofCommandSync } from "./ports-lsof-Rgl6w06g.mjs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readProcessAncestry } from "@openclaw/proc-safe/identity";
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
/** Protect the caller and every known ancestor, including an unreadable parent, from cleanup. */
function inspectSelfAndAncestorPidsSync(_spawnTimeoutMs = PROCESS_INSPECTION_TIMEOUT_MS, options = {}) {
	const pids = /* @__PURE__ */ new Set([process.pid]);
	const immediateParent = process.ppid;
	if (!options.requireVerifiedParent && Number.isSafeInteger(immediateParent) && immediateParent > 0) pids.add(immediateParent);
	if (process.pid === 1) return {
		pids,
		complete: true
	};
	try {
		const ancestry = readProcessAncestry(process.pid, {
			maxDepth: 34,
			...options.throughPid === void 0 ? {} : { throughPid: options.throughPid }
		});
		if (!ancestry) return {
			pids,
			complete: false
		};
		for (const identity of ancestry.chain) pids.add(identity.pid);
		const parentPid = ancestry.chain.at(-1)?.parentPid;
		if (parentPid === 1 || !options.requireVerifiedParent && ancestry.stoppedBy === "unreadable-parent" && parentPid) pids.add(parentPid);
		return {
			pids,
			complete: ancestry.complete
		};
	} catch {
		return {
			pids,
			complete: false
		};
	}
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
function parsePidsFromLsofOutput(stdout, spawnTimeoutMs, protectedPid) {
	const excluded = getExcludedGatewayPidsSync(spawnTimeoutMs, protectedPid);
	const pids = [];
	for (const line of stdout.split(/\r?\n/)) {
		const pid = line.startsWith("p") ? parseStrictPositiveInteger(line.slice(1)) : void 0;
		if (!pid || excluded.has(pid)) continue;
		const args = readUnixProcessArgsSync(pid, spawnTimeoutMs);
		if (args != null && classifyOpenClawArgv(args, {
			command: "gateway",
			pid
		}).kind === "openclaw") pids.push(pid);
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
function findVerifiedWindowsGatewayPidsOnPortResultSync(port, options) {
	const result = readWindowsListeningPidsResultSync(port);
	if (!result.ok) return result;
	return filterVerifiedWindowsGatewayPidsResult(result.pids, (pid) => readWindowsProcessArgsResultSync(pid), resolveProtectedPidAfterEnumeration(options));
}
function scanListeningPort(port, timeout) {
	const lsof = resolveLsofCommandSync();
	return spawnSync(lsof, [
		"-nP",
		`-iTCP:${port}`,
		"-sTCP:LISTEN",
		"-Fpc"
	], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout
	});
}
function findGatewayPidsOnPortWithProtectedPidSync(port, lsofTimeoutMs, processInspectionTimeoutMs, options) {
	if (process.platform === "win32") return filterVerifiedWindowsGatewayPids(readWindowsListeningPidsOnPortSync(port), resolveProtectedPidAfterEnumeration(options));
	const res = scanListeningPort(port, lsofTimeoutMs);
	if (res.error) {
		const code = res.error.code;
		if (code === "ENOENT") return [];
		const detail = code && code.trim().length > 0 ? code : res.error.message;
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
	try {
		if (process.platform === "win32") {
			const result = readWindowsListeningPidsResultSync(port, POLL_SPAWN_TIMEOUT_MS);
			return result.ok ? { free: result.pids.length === 0 } : {
				free: null,
				permanent: result.permanent
			};
		}
		const res = scanListeningPort(port, POLL_SPAWN_TIMEOUT_MS);
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
		if (!hasErrnoCode(error, "ESRCH")) restartLog.warn(`failed to send ${signal} to stale gateway process ${pid}: ${formatErrorMessage$1(error)}`);
		return false;
	}
}
/**
* Windows-specific process termination using taskkill.
* Sends a graceful taskkill first (/T for tree), waits, then escalates to /F.
*/
function terminateStaleProcessesWindows(pids, canSignal) {
	const taskkillPath = path.win32.join(getWindowsInstallRoots().systemRoot, "System32", "taskkill.exe");
	const taskkill = (args) => spawnSync(taskkillPath, args, {
		stdio: "ignore",
		timeout: 5e3,
		windowsHide: true
	});
	const killed = [];
	for (const pid of pids) {
		if (!canSignal()) break;
		const graceful = taskkill([
			"/T",
			"/PID",
			String(pid)
		]);
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
		const forced = taskkill([
			"/F",
			"/T",
			"/PID",
			String(pid)
		]);
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
	} catch (error) {
		restartLog.warn(`stale gateway process cleanup failed: ${formatErrorMessage(error)}`);
		return [];
	}
}
//#endregion
export { terminateStaleGatewayPids as a, inspectSelfAndAncestorPidsSync as i, findGatewayPidsOnPortSync as n, spawnPsSync as o, getSelfAndAncestorPidsSync as r, cleanStaleGatewayProcessesSync as t };

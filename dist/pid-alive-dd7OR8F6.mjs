import { n as resolveDiagnosticProcessEnv, r as resolveEnvironmentValue } from "./process-env-BNjOnVtu.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import childProcess, { spawnSync } from "node:child_process";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { readProcessIdentity } from "@openclaw/proc-safe/identity";
//#region src/infra/windows-process-start.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_PROCESS_START_TIMEOUT_MS = 1e4;
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
function readNativeProcessStartTime(pid) {
	if (process.platform !== "win32" || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity && !identity.exited ? Math.floor(identity.startTimeMicros / 1e3) : null;
	} catch {
		return;
	}
}
function windowsSystemRoot(env) {
	const configured = resolveEnvironmentValue(env, "SystemRoot", "win32") ?? resolveEnvironmentValue(env, "WINDIR", "win32");
	if (!configured) return DEFAULT_WINDOWS_SYSTEM_ROOT;
	const normalized = path.win32.normalize(configured);
	return /^[A-Za-z]:\\/.test(normalized) && !normalized.startsWith("\\\\") ? normalized : DEFAULT_WINDOWS_SYSTEM_ROOT;
}
function windowsPowerShellPath(env) {
	return path.win32.join(windowsSystemRoot(env), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
}
function windowsWmicPath(env) {
	return path.win32.join(windowsSystemRoot(env), "System32", "wbem", "wmic.exe");
}
function decodeWindowsProcessOutput(output) {
	if (!Buffer.isBuffer(output)) return output;
	return output.length >= 2 && output[0] === 255 && output[1] === 254 ? output.toString("utf16le") : output.toString("utf8");
}
function parseWindowsProcessStartTime(raw) {
	const lines = decodeWindowsProcessOutput(raw).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
	const value = lines.find((line) => line.toLowerCase().startsWith("creationdate="))?.slice(13).trim() ?? lines.find((line) => line.toLowerCase() !== "creationdate") ?? "";
	const parsedIso = Date.parse(value);
	if (Number.isFinite(parsedIso)) return parsedIso;
	const dmtf = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);
	if (!dmtf) return null;
	const [, year, month, day, hour, minute, second, microseconds, offsetSign, offset] = dmtf;
	return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Math.floor(Number(microseconds) / 1e3)) - Number(offset) * 6e4 * (offsetSign === "+" ? 1 : -1);
}
/** Read a stable Windows process creation time for lock-owner identity checks. */
function readWindowsProcessStartTimeSync(pid, timeoutMs = DEFAULT_PROCESS_START_TIMEOUT_MS, env = process.env) {
	if (!Number.isInteger(pid) || pid <= 0 || pid > 4294967295) return null;
	const deadline = Date.now() + timeoutMs;
	const nativeStartTime = readNativeProcessStartTime(pid);
	if (nativeStartTime !== void 0) return nativeStartTime;
	const powershellBudgetMs = deadline - Date.now();
	if (powershellBudgetMs <= 0) return null;
	const powershell = spawnSync(windowsPowerShellPath(env), [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		`$process = [System.Diagnostics.Process]::GetProcessById(${pid}); try { [Console]::Out.Write($process.StartTime.ToUniversalTime().ToString("o")) } finally { $process.Dispose() }`
	], {
		encoding: "utf8",
		env: resolveDiagnosticProcessEnv(env, "win32"),
		timeout: Math.min(powershellBudgetMs, DEFAULT_TIMEOUT_MS),
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const startTime = parseWindowsProcessStartTime(powershell.stdout);
		if (startTime !== null) return startTime;
	}
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) return null;
	const wmic = spawnSync(windowsWmicPath(env), [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CreationDate",
		"/value"
	], {
		env: resolveDiagnosticProcessEnv(env, "win32"),
		timeout: remainingMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	return !wmic.error && wmic.status === 0 ? parseWindowsProcessStartTime(wmic.stdout) : null;
}
//#endregion
//#region src/shared/freebsd-process-identity-native.ts
let identity;
/** Normal installations use the dependency's public loader. */
function loadFreeBsdProcessIdentityNative() {
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("FreeBSD process identity is unavailable in this sealed runtime");
	if (!identity) identity = createRequire(import.meta.url)("@openclaw/proc-safe/identity");
	return identity;
}
//#endregion
//#region src/shared/freebsd-process-identity.ts
/** Read the kernel's monotonic process start time in microseconds. */
function readFreeBsdProcessStartTime(pid) {
	if (process.platform !== "freebsd" || !Number.isInteger(pid) || pid <= 0 || pid > 2147483647) return null;
	try {
		return loadFreeBsdProcessIdentityNative().readProcessIdentity(pid)?.startTimeSinceBootMicros ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/shared/pid-alive.ts
const PROCESS_START_TIMEOUT_MS = 1e3;
function readDarwinNativeIdentity(pid) {
	if (process.platform !== "darwin" || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity && !identity.exited ? {
			startedAt: Math.floor(identity.startTimeMicros / 1e6),
			startTimeMicros: identity.startTimeMicros
		} : null;
	} catch {
		return;
	}
}
/** Unknown observations never prove death; Linux keeps its thread-aware procfs policy. */
function readNativeLiveness(pid) {
	if (![
		"darwin",
		"win32",
		"freebsd"
	].includes(process.platform) || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity !== null && !identity.exited;
	} catch (error) {
		if (error instanceof ProcSafeError && (error.code === "helper-unavailable" || error.code === "unsupported-platform")) return;
		return true;
	}
}
let selfStartTime = null;
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Reject recycled worker TIDs and terminal leaders without live sibling threads.
* Missing or reaped procfs snapshots require a fresh existence probe.
*/
function isExitedLinuxProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fs.readFileSync(`/proc/${pid}/status`, "utf8");
		const state = status.match(/^State:\s+(\S)/m)?.[1];
		const threads = status.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];
		if (threads !== "0") {
			const tgid = status.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];
			return tgid !== void 0 && Number(tgid) !== pid || (state === "Z" || state === "X") && threads === "1";
		}
	} catch {}
	try {
		process.kill(pid, 0);
	} catch (error) {
		return error.code === "ESRCH";
	}
	return false;
}
/** Returns true only when a positive PID exists and is not a known terminal task. */
function isPidAlive(pid) {
	if (!isValidPid(pid)) return false;
	try {
		process.kill(pid, 0);
	} catch (error) {
		const code = error.code;
		if (code !== "EPERM") return code === "ESRCH" ? readNativeLiveness(pid) ?? false : false;
	}
	return readNativeLiveness(pid) ?? !isExitedLinuxProcess(pid);
}
/** Returns true only when the PID is invalid, missing, or a known terminal task. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (error) {
		if (error.code !== "ESRCH") return false;
		const native = readNativeLiveness(pid);
		return native === void 0 ? process.platform !== "freebsd" : !native;
	}
	const native = readNativeLiveness(pid);
	return native === void 0 ? isExitedLinuxProcess(pid) : !native;
}
function getDarwinProcessStartTime(pid, env, timeoutMs) {
	const started = performance.now();
	const native = readDarwinNativeIdentity(pid);
	if (native !== void 0) return native?.startedAt ?? null;
	const remainingMs = timeoutMs === void 0 ? PROCESS_START_TIMEOUT_MS : Math.ceil(timeoutMs - (performance.now() - started));
	if (remainingMs <= 0) return null;
	try {
		const startedAt = childProcess.execFileSync("/bin/ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...resolveDiagnosticProcessEnv(env),
				LC_ALL: "C",
				TZ: "UTC"
			},
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: remainingMs,
			killSignal: "SIGKILL"
		}).trim();
		const startedAtMs = Date.parse(`${startedAt} UTC`);
		return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
	} catch {
		return null;
	}
}
/** Read the Linux procfs start identity used by Linux-owned runtime state. */
function getProcessStartTime(pid) {
	if (!isValidPid(pid) || process.platform !== "linux") return null;
	try {
		const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEndIndex = stat.lastIndexOf(")");
		if (commEndIndex < 0) return null;
		const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
		const starttime = Number(fields[19]);
		return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
	} catch {
		return null;
	}
}
/** Custody recovery needs native birth precision rather than the shipped lease timestamp format. */
function getProcessInstanceStartTime(pid) {
	if (!isValidPid(pid)) return null;
	if (process.platform === "linux") {
		const startedAt = getProcessStartTime(pid);
		return Number.isSafeInteger(startedAt) ? startedAt : null;
	}
	const native = readDarwinNativeIdentity(pid);
	if (!native) return null;
	const startedAt = native.startTimeMicros;
	return Number.isSafeInteger(startedAt) ? startedAt : null;
}
/** Read a cross-platform process identity for filesystem lock ownership. */
function getFileLockProcessStartTime(pid, env = process.env, timeoutMs) {
	if (!isValidPid(pid)) return null;
	const isSelf = pid === process.pid;
	if (isSelf && selfStartTime !== null) return selfStartTime;
	const startTime = process.platform === "darwin" ? getDarwinProcessStartTime(pid, env, timeoutMs) : process.platform === "win32" ? readWindowsProcessStartTimeSync(pid, timeoutMs, env) : process.platform === "freebsd" ? readFreeBsdProcessStartTime(pid) : getProcessStartTime(pid);
	if (isSelf && startTime !== null) selfStartTime = startTime;
	return startTime;
}
//#endregion
export { isPidDefinitelyDead as a, isPidAlive as i, getProcessInstanceStartTime as n, decodeWindowsProcessOutput as o, getProcessStartTime as r, readWindowsProcessStartTimeSync as s, getFileLockProcessStartTime as t };

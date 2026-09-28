import { n as resolveDiagnosticProcessEnv, r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import childProcess, { spawnSync } from "node:child_process";
import { endianness } from "node:os";
//#region src/infra/windows-process-start.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_PROCESS_START_TIMEOUT_MS = 1e4;
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
let nativeProcessStartTime;
function loadNativeProcessStartTime() {
	const kernel32 = createRequire(import.meta.url)("koffi").load("kernel32.dll");
	const openProcess = kernel32.func("void * __stdcall OpenProcess(uint32_t access, int32_t inheritHandle, uint32_t processId)");
	const getProcessTimes = kernel32.func("int32_t __stdcall GetProcessTimes(void *process, void *creation, void *exit, void *kernel, void *user)");
	const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
	return (pid) => {
		const handle = openProcess(4096, 0, pid);
		if (handle === null) return null;
		try {
			const creation = Buffer.alloc(8);
			if (!getProcessTimes(handle, creation, Buffer.alloc(8), Buffer.alloc(8), Buffer.alloc(8))) return null;
			const ticks = creation.readBigUInt64LE();
			if (ticks === 0n) return null;
			return Number(ticks / 10000n - 11644473600000n);
		} finally {
			closeHandle(handle);
		}
	};
}
function readNativeProcessStartTime(pid) {
	if (process.platform !== "win32" || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return null;
	try {
		nativeProcessStartTime ??= loadNativeProcessStartTime();
		return nativeProcessStartTime(pid);
	} catch {
		return null;
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
	if (nativeStartTime !== null) return nativeStartTime;
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
/** Read one process snapshot; a reused parent PID must not extend the ancestry. */
function readWindowsProcessAncestorsSync(pid, maxDepth, timeoutMs, env = process.env) {
	try {
		const result = spawnSync(windowsPowerShellPath(env), [
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			[
				"ConvertTo-Json -Compress -InputObject @(Get-CimInstance Win32_Process",
				"-Property ProcessId,ParentProcessId,CreationDate -ErrorAction Stop | ForEach-Object {",
				"if ($null -ne $_.CreationDate) { [pscustomobject]@{ pid = $_.ProcessId; parentPid = $_.ParentProcessId;",
				"startedAt = $_.CreationDate.ToUniversalTime().Ticks.ToString() } } })"
			].join(" ")
		], {
			encoding: "utf8",
			env: resolveDiagnosticProcessEnv(env, "win32"),
			timeout: timeoutMs,
			maxBuffer: 1048576,
			windowsHide: true
		});
		if (result.error || result.status !== 0) return [];
		const parsed = JSON.parse(result.stdout);
		if (!Array.isArray(parsed)) return [];
		const rows = parsed;
		const processes = /* @__PURE__ */ new Map();
		for (const row of rows) {
			if (!row || typeof row !== "object" || !("pid" in row) || typeof row.pid !== "number" || !Number.isSafeInteger(row.pid) || row.pid <= 0 || !("parentPid" in row) || typeof row.parentPid !== "number" || !Number.isSafeInteger(row.parentPid) || row.parentPid < 0 || !("startedAt" in row) || typeof row.startedAt !== "string" || !/^[1-9]\d{0,18}$/.test(row.startedAt)) continue;
			if (processes.has(row.pid)) return [];
			processes.set(row.pid, {
				parentPid: row.parentPid,
				startedAt: BigInt(row.startedAt)
			});
		}
		const ancestors = /* @__PURE__ */ new Set();
		let current = processes.get(pid);
		for (let depth = 0; current && depth < maxDepth; depth++) {
			const parentPid = current.parentPid;
			const parent = processes.get(parentPid);
			if (!parent || parentPid === pid || ancestors.has(parentPid) || parent.startedAt > current.startedAt) break;
			ancestors.add(parentPid);
			current = parent;
		}
		return [...ancestors];
	} catch {
		return [];
	}
}
//#endregion
//#region src/shared/freebsd-process-identity-native.ts
/** Normal installations use the dependency's public loader. */
function loadFreeBsdProcessIdentityNative() {
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("FreeBSD process identity is unavailable in this sealed runtime");
	return createRequire(import.meta.url)("koffi/indirect");
}
//#endregion
//#region src/shared/freebsd-process-identity.ts
let native;
function getSysctl() {
	if (!native) {
		const library = loadFreeBsdProcessIdentityNative().load(null);
		native = {
			library,
			sysctl: library.func("int sysctl(const int *name, unsigned int namelen, _Out_ void *oldp, _Inout_ size_t *oldlenp, const void *newp, size_t newlen)")
		};
	}
	return native.sysctl;
}
function readTimeval(bytes, offset) {
	const seconds = bytes.readBigInt64LE(offset);
	const microseconds = bytes.readBigInt64LE(offset + 8);
	if (seconds < 0n || microseconds < 0n || microseconds >= 1000000n) throw new Error("Invalid FreeBSD process identity timeval");
	return seconds * 1000000n + microseconds;
}
/** Read the kernel's monotonic process start time in microseconds. */
function readFreeBsdProcessStartTime(pid) {
	if (process.platform !== "freebsd" || process.arch !== "x64" && process.arch !== "arm64" || endianness() !== "LE" || !Number.isInteger(pid) || pid <= 0 || pid > 2147483647) return null;
	try {
		const sysctl = getSysctl();
		const bytes = Buffer.alloc(1120);
		for (const [mib, offset, length] of [
			[
				[1, 21],
				0,
				16
			],
			[
				[
					1,
					14,
					1,
					pid
				],
				16,
				1088
			],
			[
				[1, 21],
				1104,
				16
			]
		]) {
			const actual = [length];
			if (sysctl(mib, mib.length, bytes.subarray(offset, offset + length), actual, null, 0) !== 0 || actual[0] !== length) return null;
		}
		if (bytes.readInt32LE(16) !== 1088 || bytes.readInt32LE(20) !== 0 || bytes.readInt32LE(88) !== pid || !bytes.subarray(0, 16).equals(bytes.subarray(1104))) return null;
		const start = readTimeval(bytes, 352) - readTimeval(bytes, 0);
		return start >= 0n && start <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(start) : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/shared/pid-alive.ts
const PROCESS_START_TIMEOUT_MS = 1e3;
let selfStartTime = null;
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Check if every thread has exited by reading Linux /proc/<pid>/status.
* Returns false on non-Linux platforms or if the proc file can't be read.
*/
function isZombieProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fs.readFileSync(`/proc/${pid}/status`, "utf8");
		return status.match(/^State:\s+(\S)/m)?.[1] === "Z" && /^Threads:[ \t]+1[ \t]*$/m.test(status);
	} catch {
		return false;
	}
}
/** Returns true only when a positive PID exists and is not a Linux zombie process. */
function isPidAlive(pid) {
	if (!isValidPid(pid)) return false;
	try {
		process.kill(pid, 0);
	} catch (err) {
		if (err.code !== "EPERM") return false;
	}
	return !isZombieProcess(pid);
}
/** Returns true only when the PID is invalid, missing, or known to be a Linux zombie. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (err) {
		return err.code === "ESRCH";
	}
	return isZombieProcess(pid);
}
function getDarwinProcessStartTime(pid, env) {
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
			timeout: PROCESS_START_TIMEOUT_MS,
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
/** Read a cross-platform process identity for filesystem lock ownership. */
function getFileLockProcessStartTime(pid, env = process.env, windowsTimeoutMs) {
	if (!isValidPid(pid)) return null;
	const isSelf = pid === process.pid;
	if (isSelf && selfStartTime !== null) return selfStartTime;
	const startTime = process.platform === "darwin" ? getDarwinProcessStartTime(pid, env) : process.platform === "win32" ? readWindowsProcessStartTimeSync(pid, windowsTimeoutMs, env) : process.platform === "freebsd" ? readFreeBsdProcessStartTime(pid) : getProcessStartTime(pid);
	if (isSelf && startTime !== null) selfStartTime = startTime;
	return startTime;
}
//#endregion
export { decodeWindowsProcessOutput as a, isPidDefinitelyDead as i, getProcessStartTime as n, readWindowsProcessAncestorsSync as o, isPidAlive as r, readWindowsProcessStartTimeSync as s, getFileLockProcessStartTime as t };

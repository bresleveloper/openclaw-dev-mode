import { _ as extractErrorCode } from "./subsystem-CkEsEQPK.js";
import { createRequire } from "node:module";
import path from "node:path";
import fs, { readFileSync, readdirSync } from "node:fs";
import "@openclaw/fs-safe/durability";
import "node:crypto";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { listProcesses } from "@openclaw/proc-safe/inspect";
import childProcess, { spawnSync } from "node:child_process";
import { readProcessIdentity } from "@openclaw/proc-safe/identity";
//#region src/infra/process-env.ts
/** Read one environment value using the same Windows key precedence as child_process. */
function resolveEnvironmentValue(env, name, platform = process.platform) {
	if (!env) return;
	if (platform !== "win32") return env[name] ?? (name === "PATH" ? env.Path : void 0);
	const normalizedName = name.toUpperCase();
	const key = Object.keys(env).toSorted().find((candidate) => candidate.toUpperCase() === normalizedName);
	return key === void 0 ? void 0 : env[key];
}
/** Merge child environments while preserving Node's platform-specific key semantics. */
function mergeProcessEnv(sources, platform = process.platform) {
	const merged = Object.create(null);
	const mergedKeys = /* @__PURE__ */ new Map();
	for (const source of sources) {
		if (!source) continue;
		const keys = Object.keys(source);
		const sourceKeys = /* @__PURE__ */ new Set();
		for (const key of platform === "win32" ? keys.toSorted() : keys) {
			const normalizedKey = platform === "win32" ? key.toUpperCase() : void 0;
			if (normalizedKey !== void 0) {
				if (sourceKeys.has(normalizedKey)) continue;
				sourceKeys.add(normalizedKey);
				const previousKey = mergedKeys.get(normalizedKey);
				if (previousKey !== void 0) delete merged[previousKey];
				mergedKeys.delete(normalizedKey);
			}
			const value = source[key];
			if (value === void 0) delete merged[key];
			else {
				merged[key] = value;
				if (normalizedKey !== void 0 && Object.hasOwn(merged, key)) mergedKeys.set(normalizedKey, key);
			}
		}
	}
	return merged;
}
const DIAGNOSTIC_PROCESS_ENV_KEYS = /* @__PURE__ */ new Set([
	"PATH",
	"Path",
	"HOME",
	"USER",
	"LOGNAME",
	"TMPDIR",
	"TMP",
	"TEMP",
	"LANG",
	"LANGUAGE",
	"TZ",
	"LC_ALL",
	"LC_COLLATE",
	"LC_CTYPE",
	"LC_MESSAGES",
	"LC_MONETARY",
	"LC_NUMERIC",
	"LC_TIME",
	"LC_ADDRESS",
	"LC_IDENTIFICATION",
	"LC_MEASUREMENT",
	"LC_NAME",
	"LC_PAPER",
	"LC_TELEPHONE",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT",
	"SYSTEMDRIVE",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"USERNAME",
	"USERDOMAIN",
	"APPDATA",
	"LOCALAPPDATA",
	"PROGRAMDATA",
	"ALLUSERSPROFILE",
	"PROGRAMFILES",
	"PROGRAMFILES(X86)",
	"PROGRAMW6432",
	"COMMONPROGRAMFILES",
	"COMMONPROGRAMFILES(X86)",
	"COMMONPROGRAMW6432",
	"PSMODULEANALYSISCACHEPATH"
]);
/** Project only native port/process diagnostic context; never mutate the parent environment. */
function resolveDiagnosticProcessEnv(env = process.env, platform = process.platform) {
	return Object.fromEntries(Object.entries(mergeProcessEnv([env], platform)).filter(([key]) => DIAGNOSTIC_PROCESS_ENV_KEYS.has(platform === "win32" ? key.toUpperCase() : key)));
}
//#endregion
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
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
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
export { mergeProcessEnv as a, isPidDefinitelyDead as i, getFileLockProcessStartTime as n, resolveDiagnosticProcessEnv as o, isPidAlive as r, readProcessGroupMembers as t };

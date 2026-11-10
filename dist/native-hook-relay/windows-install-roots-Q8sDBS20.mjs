import { D as escapeRegExp } from "./redact-tYkqLD33.mjs";
import { M as normalizeLowercaseStringOrEmpty } from "./utils-c2rFzEZe.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fsSync from "node:fs";
import path from "node:path";
//#region src/infra/windows-appcontainer-spawn.ts
var AppContainerSpawnUnsupportedError = class extends Error {
	constructor(uvVersion) {
		super(`AppContainer: libuv ${uvVersion} cannot create child pipes; 1.53.0+ required. Run OpenClaw outside the AppContainer or use a Node build with libuv >= 1.53.0.`);
		this.code = "APPCONTAINER_SPAWN_UNSUPPORTED";
		this.name = "AppContainerSpawnUnsupportedError";
	}
};
let checked = false;
let unsupported;
/** libuv before 1.53 loops forever creating child pipes in an AppContainer. */
function assertAppContainerSpawnSupported(stdio) {
	if (process.platform !== "win32") return;
	if (stdio === "ignore" || stdio === "inherit" || Array.isArray(stdio) && stdio.length >= 3 && stdio.every((entry) => entry !== void 0 && entry !== null && entry !== "pipe" && entry !== "overlapped" && entry !== "ipc" && !(typeof entry === "number" && entry < 0))) return;
	if (!checked) {
		checked = true;
		try {
			const { readCurrentAppContainerSid } = createRequire(import.meta.url)("@openclaw/proc-safe/windows-token");
			const sid = readCurrentAppContainerSid();
			const uv = process.versions.uv;
			const major = Number(uv.split(".")[0]);
			const minor = Number(uv.split(".")[1]);
			if (sid !== null && (major < 1 || major === 1 && minor < 53)) unsupported = new AppContainerSpawnUnsupportedError(uv);
		} catch (error) {
			import("./subsystem-zKEeg6EH.mjs").then(({ createSubsystemLogger }) => {
				createSubsystemLogger("process").debug("AppContainer token probe failed; allowing spawn", { error: String(error) });
			}).catch(() => {});
		}
	}
	if (unsupported) throw unsupported;
}
//#endregion
//#region src/infra/windows-install-roots.ts
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
const DEFAULT_PROGRAM_FILES = "C:\\Program Files";
const DEFAULT_PROGRAM_FILES_X86 = "C:\\Program Files (x86)";
const WINDOWS_NT_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
const WINDOWS_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion";
const REG_QUERY_TIMEOUT_MS = 5e3;
let cachedProcessRoots = null;
function locateWindowsRegExe() {
	const filePath = path.win32.join(DEFAULT_WINDOWS_SYSTEM_ROOT, "System32", "reg.exe");
	try {
		fsSync.accessSync(filePath, fsSync.constants.R_OK);
		return filePath;
	} catch {
		return null;
	}
}
function trimTrailingSeparators(value) {
	const parsed = path.win32.parse(value);
	let trimmed = value;
	while (trimmed.length > parsed.root.length && /[\\/]/.test(trimmed.at(-1) ?? "")) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
/**
* Windows install roots should be local absolute directories, not drive-relative
* paths, UNC shares, or PATH-like lists that could widen trust unexpectedly.
*/
function normalizeWindowsInstallRoot(raw) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n") || trimmed.includes(";")) return null;
	const normalized = trimTrailingSeparators(path.win32.normalize(trimmed));
	if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
	const parsed = path.win32.parse(normalized);
	if (!/^[A-Za-z]:\\$/.test(parsed.root)) return null;
	if (normalized.length <= parsed.root.length) return null;
	return normalized;
}
function getEnvValueCaseInsensitive(env, expectedKey) {
	const direct = env[expectedKey];
	if (direct !== void 0) return direct;
	const upper = expectedKey.toUpperCase();
	const actualKey = Object.keys(env).find((key) => key.toUpperCase() === upper);
	return actualKey ? env[actualKey] : void 0;
}
/** Queries one Windows registry string value via reg.exe; null when absent or unreadable. */
function queryWindowsRegistryValue(key, valueName, deadlineMs) {
	const regExe = locateWindowsRegExe();
	if (!regExe) return null;
	for (const viewArgs of [["/reg:64"], []]) {
		const timeoutMs = deadlineMs === void 0 ? REG_QUERY_TIMEOUT_MS : Math.min(REG_QUERY_TIMEOUT_MS, Math.ceil(deadlineMs - performance.now()));
		if (timeoutMs <= 0) return null;
		assertAppContainerSpawnSupported();
		try {
			const stdout = execFileSync(regExe, [
				"query",
				key,
				"/v",
				valueName,
				...viewArgs
			], {
				env: resolveDiagnosticProcessEnv(),
				encoding: "utf8",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				],
				timeout: timeoutMs,
				windowsHide: true
			});
			const pattern = new RegExp(`^\\s*${escapeRegExp(valueName)}\\s+REG_[A-Z0-9_]+\\s+(.+)$`, "im");
			const parsed = stdout.match(pattern)?.[1]?.trim();
			if (parsed) return parsed;
		} catch {}
	}
	return null;
}
function getRegistryProgramFilesRoots() {
	const readRoot = (valueName) => normalizeWindowsInstallRoot(queryWindowsRegistryValue(WINDOWS_CURRENT_VERSION_KEY, valueName) ?? void 0) ?? void 0;
	return {
		programFiles: readRoot("ProgramFilesDir"),
		programFilesX86: readRoot("ProgramFilesDir (x86)"),
		programW6432: readRoot("ProgramW6432Dir")
	};
}
function buildWindowsInstallRoots(env, registryRoots = {}) {
	const envProgramW6432 = normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramW6432"));
	const programW6432 = registryRoots.programW6432 ?? envProgramW6432 ?? null;
	return {
		systemRoot: registryRoots.systemRoot ?? resolveSystemRootFromEnv(env),
		programFiles: registryRoots.programFiles ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramFiles")) ?? programW6432 ?? DEFAULT_PROGRAM_FILES,
		programFilesX86: registryRoots.programFilesX86 ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramFiles(x86)")) ?? DEFAULT_PROGRAM_FILES_X86,
		programW6432
	};
}
function resolveSystemRootFromEnv(env) {
	return normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ?? DEFAULT_WINDOWS_SYSTEM_ROOT;
}
function getProcessRoots(deadlineMs) {
	if (!cachedProcessRoots) {
		const env = {};
		for (const key of [
			"SystemRoot",
			"WINDIR",
			"ProgramFiles",
			"ProgramFiles(x86)",
			"ProgramW6432"
		]) env[key] = getEnvValueCaseInsensitive(process.env, key);
		const roots = {
			env,
			systemRoot: normalizeWindowsInstallRoot(queryWindowsRegistryValue(WINDOWS_NT_CURRENT_VERSION_KEY, "SystemRoot", deadlineMs) ?? void 0) ?? resolveSystemRootFromEnv(env)
		};
		if (deadlineMs !== void 0 && performance.now() >= deadlineMs) return roots;
		cachedProcessRoots = roots;
	}
	return cachedProcessRoots;
}
function getWindowsSystemRoot(env, deadlineMs) {
	if (env !== process.env) return resolveSystemRootFromEnv(env);
	const roots = getProcessRoots(deadlineMs);
	return roots.installRoots?.systemRoot ?? roots.systemRoot;
}
function getWindowsInstallRoots(env = process.env) {
	if (env === process.env) {
		const roots = getProcessRoots();
		roots.installRoots ??= buildWindowsInstallRoots(roots.env, {
			...getRegistryProgramFilesRoots(),
			systemRoot: roots.systemRoot
		});
		return roots.installRoots;
	}
	return buildWindowsInstallRoots(env);
}
function getWindowsProgramFilesRoots(env = process.env) {
	const roots = getWindowsInstallRoots(env);
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of [
		roots.programW6432,
		roots.programFiles,
		roots.programFilesX86
	]) {
		if (!value) continue;
		const key = normalizeLowercaseStringOrEmpty(value);
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(value);
	}
	return result;
}
function getWindowsCmdExePath(env = process.env) {
	return getWindowsSystem32ExePath("cmd.exe", env);
}
function getWindowsSystem32ExePath(executableName, env = process.env) {
	if (path.win32.basename(executableName) !== executableName || !/^[A-Za-z0-9_.-]+\.exe$/u.test(executableName)) throw new Error(`Invalid Windows System32 executable name: ${executableName}`);
	return path.win32.join(getWindowsSystemRoot(env), "System32", executableName);
}
function getWindowsPowerShellExePath(env = process.env, deadlineMs) {
	return path.win32.join(getWindowsSystemRoot(env, deadlineMs), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
}
function getWindowsWmicExePath(env = process.env, deadlineMs) {
	return path.win32.join(getWindowsSystemRoot(env, deadlineMs), "System32", "wbem", "wmic.exe");
}
//#endregion
export { getWindowsSystem32ExePath as a, getWindowsProgramFilesRoots as i, getWindowsInstallRoots as n, getWindowsWmicExePath as o, getWindowsPowerShellExePath as r, assertAppContainerSpawnSupported as s, getWindowsCmdExePath as t };

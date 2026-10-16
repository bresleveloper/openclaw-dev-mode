import { n as createAbortError, o as sleepWithAbort, r as racePromiseWithAbortSignal } from "./src-DTVzOLXp.mjs";
import { m as isAbortError } from "./utils-BfTq4rUg.mjs";
import { b as parseTcpPort, it as pruneMapToMaxSize, j as isErrno } from "./redact-TLu2QTmL.mjs";
import { i as normalizeStringEntries } from "./string-normalization-C9v1UMOm.mjs";
import { t as formatErrorMessage } from "./errors-BwnhmTMH.mjs";
import "./subsystem-M2sQt_up.mjs";
import { i as getWindowsProgramFilesRoots, n as getWindowsInstallRoots } from "./windows-install-roots-DqZZsEhJ.mjs";
import { i as theme } from "./logger-CzdVvCtS.mjs";
import { n as probeTcpListener, r as tryListenOnPort } from "./ports-probe-CXbhZtRc.mjs";
import { spawn } from "node:child_process";
import fsSync from "node:fs";
import path from "node:path";
theme.success;
theme.warn;
theme.info;
theme.error;
//#endregion
//#region src/infra/ports.ts
var PortInUseError = class extends Error {
	constructor(port, details) {
		super(`Port ${port} is already in use.`);
		this.name = "PortInUseError";
		this.port = port;
		this.details = details;
	}
};
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
async function ensurePortAvailable(port, host, signal) {
	try {
		const probe = {
			port,
			...host ? { host } : {},
			...signal ? { signal } : {}
		};
		await tryListenOnPort(probe);
	} catch (err) {
		if (isErrno(err) && err.code === "EADDRINUSE") throw new PortInUseError(port);
		throw err;
	}
}
//#endregion
//#region src/infra/resolve-system-bin.ts
const UNIX_BASE_TRUSTED_DIRS = [
	"/usr/bin",
	"/bin",
	"/usr/sbin",
	"/sbin"
];
const DARWIN_STANDARD_DIRS = ["/opt/homebrew/bin", "/usr/local/bin"];
const LINUX_STANDARD_DIRS = ["/usr/local/bin"];
const WIN_PATHEXT = [
	".exe",
	".cmd",
	".bat",
	".com"
];
const WINDOWS_PROGRAM_FILES_TOOL_DIR_PREFIXES = ["ImageMagick-", "GraphicsMagick-"];
const WINDOWS_PROGRAM_FILES_TOOL_DIRS = ["ImageMagick", "GraphicsMagick"];
const RESOLVED_BIN_CACHE_LIMIT = 512;
const resolvedCacheStrict = /* @__PURE__ */ new Map();
const resolvedCacheStandard = /* @__PURE__ */ new Map();
function cacheResolvedSystemBin(cache, name, candidate) {
	cache.set(name, candidate);
	pruneMapToMaxSize(cache, RESOLVED_BIN_CACHE_LIMIT);
}
function isExecutable(filePath) {
	try {
		fsSync.accessSync(filePath, process.platform === "win32" ? fsSync.constants.R_OK : fsSync.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function collectWindowsProgramFilesToolDirs(programFilesRoot) {
	const dirs = WINDOWS_PROGRAM_FILES_TOOL_DIRS.map((dir) => path.win32.join(programFilesRoot, dir));
	try {
		for (const entry of fsSync.readdirSync(programFilesRoot, { withFileTypes: true })) if (entry.isDirectory() && WINDOWS_PROGRAM_FILES_TOOL_DIR_PREFIXES.some((prefix) => entry.name.startsWith(prefix))) dirs.push(path.win32.join(programFilesRoot, entry.name));
	} catch {}
	return dirs;
}
/**
* Build the trusted-dir list for Windows. Only system-managed directories
* are included; user-profile paths like %LOCALAPPDATA% are excluded.
*/
function buildWindowsTrustedDirs() {
	const dirs = [];
	const { systemRoot } = getWindowsInstallRoots();
	dirs.push(path.win32.join(systemRoot, "System32"));
	dirs.push(path.win32.join(systemRoot, "SysWOW64"));
	dirs.push(path.win32.join(systemRoot, "System32", "WindowsPowerShell", "v1.0"));
	for (const programFilesRoot of getWindowsProgramFilesRoots()) {
		dirs.push(path.win32.join(programFilesRoot, "OpenSSL-Win64", "bin"));
		dirs.push(path.win32.join(programFilesRoot, "OpenSSL", "bin"));
		dirs.push(path.win32.join(programFilesRoot, "ffmpeg", "bin"));
	}
	return dirs;
}
function buildWindowsStandardDirs() {
	const { systemRoot } = getWindowsInstallRoots();
	const systemDriveRoot = path.win32.parse(systemRoot).root;
	const dirs = [path.win32.join(systemDriveRoot, "ProgramData", "chocolatey", "bin")];
	for (const programFilesRoot of getWindowsProgramFilesRoots()) dirs.push(...collectWindowsProgramFilesToolDirs(programFilesRoot));
	return dirs;
}
function buildUnixTrustedDirs(trust) {
	const dirs = [...UNIX_BASE_TRUSTED_DIRS];
	const platform = process.platform;
	if (platform === "linux") {
		dirs.push("/run/current-system/sw/bin");
		dirs.push("/snap/bin");
	}
	if (trust === "standard") {
		if (platform === "darwin") dirs.push(...DARWIN_STANDARD_DIRS);
		else if (platform === "linux") dirs.push(...LINUX_STANDARD_DIRS);
	}
	return dirs;
}
const trustedDirs = {};
function getTrustedDirs(trust) {
	return trustedDirs[trust] ??= process.platform !== "win32" ? buildUnixTrustedDirs(trust) : trust === "strict" ? buildWindowsTrustedDirs() : [...getTrustedDirs("strict"), ...buildWindowsStandardDirs()];
}
/**
* Resolve a binary name to an absolute path by searching only trusted system
* directories. Returns `null` when the binary is not found. Results are cached
* for the lifetime of the process.
*
* This MUST be used instead of bare binary names in `execFile`/`spawn` calls
* for internal infrastructure binaries (ffmpeg, ffprobe, openssl, etc.) to
* prevent PATH-hijack attacks via user-writable directories.
*/
function resolveSystemBin(name, opts) {
	const trust = opts?.trust ?? "strict";
	const hasExtra = (opts?.extraDirs?.length ?? 0) > 0;
	const cache = trust === "standard" ? resolvedCacheStandard : resolvedCacheStrict;
	if (!hasExtra) {
		const cached = cache.get(name);
		if (cached !== void 0) {
			cache.delete(name);
			cache.set(name, cached);
			return cached;
		}
	}
	const dirs = [...getTrustedDirs(trust), ...opts?.extraDirs ?? []];
	const isWin = process.platform === "win32";
	const hasExt = isWin && path.win32.extname(name).length > 0;
	for (const dir of dirs) {
		const candidates = isWin && !hasExt ? WIN_PATHEXT.map((ext) => path.win32.join(dir, name + ext)) : [path.join(dir, name)];
		for (const candidate of candidates) if (isExecutable(candidate)) {
			if (!hasExtra) cacheResolvedSystemBin(cache, name, candidate);
			return candidate;
		}
	}
	return null;
}
//#endregion
//#region src/infra/ssh-client.ts
function resolveSshClient() {
	if (process.platform !== "win32") return resolveSystemBin("ssh", { trust: "strict" });
	const { systemRoot } = getWindowsInstallRoots();
	return resolveSystemBin("ssh", {
		trust: "strict",
		extraDirs: [path.win32.join(systemRoot, "System32", "OpenSSH")]
	});
}
//#endregion
//#region src/infra/ssh-tunnel.ts
function hasControlOrWhitespace(value) {
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code <= 31 || code === 127 || /\s/.test(char)) return true;
	}
	return false;
}
function isSafeSshTargetUser(user) {
	return !hasControlOrWhitespace(user) && !user.startsWith("-");
}
function isSafeSshTargetHost(host) {
	return !hasControlOrWhitespace(host) && !host.startsWith("-") && !host.startsWith(":") && !host.endsWith(":") && !host.includes("@");
}
function parseSshTarget(raw) {
	const trimmed = raw.trim().replace(/^ssh\s+/, "");
	if (!trimmed) return null;
	const at = trimmed.indexOf("@");
	const user = at === -1 ? void 0 : trimmed.slice(0, at).trim() || void 0;
	let host = at === -1 ? trimmed : trimmed.slice(at + 1).trim();
	let port = 22;
	const colonIdx = host.lastIndexOf(":");
	if (colonIdx > 0 && colonIdx < host.length - 1) {
		port = parseTcpPort(host.slice(colonIdx + 1).trim());
		host = host.slice(0, colonIdx).trim();
	}
	if (!host || port === null || !isSafeSshTargetHost(host) || user !== void 0 && !isSafeSshTargetUser(user)) return null;
	return {
		user,
		host,
		port
	};
}
async function waitForLocalListener(port, timeoutMs, signal, childPid, isChildActive) {
	const startedAt = performance.now();
	while (performance.now() - startedAt < timeoutMs) {
		if (await probeTcpListener(port, "127.0.0.1", signal) === "busy") {
			const { inspectPortUsage } = await import("./ports-inspect-B6watmwd.mjs");
			const usage = await inspectPortUsage(port, {
				probeHosts: ["127.0.0.1"],
				signal
			});
			if (!isChildActive()) throw new Error("ssh exited before tunnel listener ownership was verified");
			if (childPid === void 0 || usage.listeners.length === 0 || usage.listeners.some((listener) => listener.pid !== childPid)) throw new Error(`cannot verify SSH tunnel listener ownership on 127.0.0.1:${port} for SSH process ${childPid ?? "unknown"}; stop any conflicting listener or enable process inspection, then retry`);
			return;
		}
		await sleepWithAbort(50, signal);
	}
	throw new Error(`ssh tunnel did not start listening on localhost:${port}`);
}
async function startSshPortForward(opts) {
	const parsed = parseSshTarget(opts.target);
	if (!parsed) throw new Error(`invalid SSH target: ${opts.target}`);
	const sshPath = resolveSshClient();
	if (!sshPath) throw new Error("trusted SSH client not found in system directories");
	let localPort = opts.localPortPreferred;
	try {
		await ensurePortAvailable(localPort, "127.0.0.1");
	} catch (err) {
		if (err instanceof PortInUseError || isErrno(err) && (err.code === "EADDRINUSE" || err.code === "EACCES" || err.code === "EPERM")) localPort = await tryListenOnPort({
			port: 0,
			host: "127.0.0.1"
		});
		else throw err;
	}
	const userHost = parsed.user ? `${parsed.user}@${parsed.host}` : parsed.host;
	const args = [
		"-N",
		"-L",
		`127.0.0.1:${localPort}:127.0.0.1:${opts.remotePort}`,
		.../:\d+$/.test(opts.target.trim()) ? ["-p", String(parsed.port)] : [],
		"-o",
		"ExitOnForwardFailure=yes",
		"-o",
		"BatchMode=yes",
		"-o",
		"ControlMaster=no",
		"-o",
		"ControlPath=none",
		"-o",
		"ControlPersist=no",
		"-o",
		"ForkAfterAuthentication=no",
		...opts.hostKeyPolicy === "openssh" ? [] : ["-o", "StrictHostKeyChecking=yes"],
		"-o",
		"UpdateHostKeys=yes",
		"-o",
		"ConnectTimeout=5",
		"-o",
		"ServerAliveInterval=15",
		"-o",
		"ServerAliveCountMax=3"
	];
	if (opts.identity?.trim()) args.push("-i", opts.identity.trim());
	args.push("--", userHost);
	if (opts.signal?.aborted) throw createAbortError("SSH tunnel start aborted", { cause: opts.signal.reason });
	const stderr = [];
	const child = spawn(sshPath, args, { stdio: [
		"ignore",
		"ignore",
		"pipe"
	] });
	const stderrStream = child.stderr;
	stderrStream?.on("error", () => {});
	stderrStream?.setEncoding("utf8");
	stderrStream?.on("data", (chunk) => stderr.push(chunk));
	let active = true;
	const exited = new Promise((resolve) => {
		const onExit = () => {
			active = false;
			resolve();
		};
		child.once("exit", onExit);
		child.once("close", onExit);
	});
	let onAbort;
	const detachAbort = () => {
		if (onAbort) {
			opts.signal?.removeEventListener("abort", onAbort);
			onAbort = void 0;
		}
	};
	let stopping;
	const stop = () => stopping ??= (async () => {
		detachAbort();
		const timer = setTimeout(() => child.kill("SIGKILL"), 1500);
		try {
			child.kill("SIGTERM");
			await exited;
		} finally {
			clearTimeout(timer);
		}
	})();
	const readinessController = new AbortController();
	const readiness = waitForLocalListener(localPort, Math.max(250, opts.timeoutMs), readinessController.signal, child.pid, () => active && !stopping);
	try {
		try {
			await racePromiseWithAbortSignal(Promise.race([readiness, new Promise((_, reject) => {
				child.once("error", (err) => reject(err));
				child.once("exit", (code, signal) => {
					reject(/* @__PURE__ */ new Error(`ssh exited (${code ?? "null"}${signal ? `/${signal}` : ""})`));
				});
			})]), opts.signal);
		} finally {
			readinessController.abort();
			await readiness.catch(() => {});
		}
	} catch (err) {
		await stop();
		if (isAbortError(err)) throw err;
		const lines = normalizeStringEntries(stderr.join("").split("\n"));
		const suffix = lines.length > 0 ? `\n${lines.join("\n")}` : "";
		throw new Error(`${formatErrorMessage(err)}${suffix}`, { cause: err });
	}
	if (opts.signal) {
		onAbort = () => void stop().catch(() => {});
		opts.signal.addEventListener("abort", onAbort, { once: true });
		if (opts.signal.aborted) {
			onAbort();
			await stop();
			throw createAbortError("SSH tunnel start aborted", { cause: opts.signal.reason });
		}
	}
	exited.then(detachAbort);
	return {
		localPort,
		pid: typeof child.pid === "number" ? child.pid : null,
		closed: exited,
		isActive: () => active && !stopping,
		stop
	};
}
//#endregion
export { startSshPortForward };

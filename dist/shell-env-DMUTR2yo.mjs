import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-CP2HPhgU.mjs";
import { s as sanitizeHostExecEnv } from "./host-env-security-BgpkByrc.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, spawn } from "node:child_process";
//#region src/infra/shell-env.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_MAX_BUFFER_BYTES = 2097152;
const DEFAULT_SHELL = "/bin/sh";
const LOGIN_SHELL_ENV_COMMAND = "printf '\\0'; env -0";
let lastAppliedKeys = [];
let cachedShellPath;
let cachedEtcShells;
let nextExecCacheId = 1;
const loginShellEnvProbeCache = new LruCache(64);
const pendingShellPathProbes = /* @__PURE__ */ new Map();
const execCacheIds = /* @__PURE__ */ new WeakMap();
function resolveShellExecEnv(env) {
	const execEnv = sanitizeHostExecEnv({ baseEnv: env });
	const home = os.homedir().trim();
	if (home) execEnv.HOME = home;
	else delete execEnv.HOME;
	delete execEnv.ZDOTDIR;
	return execEnv;
}
function resolveTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS, 0);
}
function readEtcShells() {
	if (cachedEtcShells !== void 0) return cachedEtcShells;
	try {
		const entries = fs.readFileSync("/etc/shells", "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#") && path.isAbsolute(line));
		cachedEtcShells = new Set(entries);
	} catch {
		cachedEtcShells = null;
	}
	return cachedEtcShells;
}
function isTrustedShellPath(shell) {
	if (!path.isAbsolute(shell)) return false;
	if (path.normalize(shell) !== shell) return false;
	return readEtcShells()?.has(shell) === true;
}
function resolveShell(env) {
	const shell = env.SHELL?.trim();
	if (shell && isTrustedShellPath(shell)) return shell;
	return DEFAULT_SHELL;
}
function createLoginShellExecSpec(params) {
	const args = params.purpose === "environment-import" && path.basename(params.shell) === "bash" ? ["-lic", LOGIN_SHELL_ENV_COMMAND] : [
		"-l",
		"-c",
		LOGIN_SHELL_ENV_COMMAND
	];
	const options = {
		encoding: "buffer",
		timeout: params.timeoutMs,
		maxBuffer: DEFAULT_MAX_BUFFER_BYTES,
		env: params.env,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		detached: true
	};
	return {
		shell: params.shell,
		args,
		options
	};
}
function execLoginShellEnvZero(params) {
	const { shell, args, options } = createLoginShellExecSpec(params);
	return params.exec(shell, args, options);
}
function execLoginShellEnvZeroAsync(params) {
	const { shell, args, options } = createLoginShellExecSpec(params);
	return new Promise((resolve, reject) => {
		const deadline = options.timeout > 0 ? performance.now() + options.timeout : void 0;
		let outputTimeout;
		const child = spawn(shell, args, options);
		const discardOutput = () => {
			child.stdout.destroy();
			child.stderr.destroy();
		};
		const stdout = [];
		let outputBytes = 0;
		let overflow = false;
		const checkBuffer = (bytes) => {
			outputBytes += bytes;
			if (!overflow && outputBytes > options.maxBuffer) {
				overflow = true;
				discardOutput();
				child.kill();
			}
		};
		child.stdout.on("data", (chunk) => {
			checkBuffer(chunk.length);
			if (!overflow) stdout.push(chunk);
		});
		child.stderr.on("data", (chunk) => {
			checkBuffer(chunk.length);
		});
		child.once("error", (error) => {
			clearTimeout(outputTimeout);
			discardOutput();
			reject(error);
		});
		child.once("exit", () => {
			if (child.killed) discardOutput();
			else if (deadline !== void 0) outputTimeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error("Login-shell environment probe timed out"));
				discardOutput();
			}, Math.max(0, deadline - performance.now()));
		});
		child.once("close", (code, signal) => {
			clearTimeout(outputTimeout);
			if (overflow || child.killed || signal || code !== 0) reject(/* @__PURE__ */ new Error("Login-shell environment probe failed"));
			else resolve(Buffer.concat(stdout));
		});
	});
}
function parseShellEnv(stdout) {
	const shellEnv = /* @__PURE__ */ new Map();
	const frameEnd = stdout.indexOf(0);
	if (frameEnd < 0) return shellEnv;
	const parts = stdout.subarray(frameEnd + 1).toString("utf8").split("\0");
	for (const part of parts) {
		const eq = part.indexOf("=");
		if (eq <= 0) continue;
		shellEnv.set(part.slice(0, eq), part.slice(eq + 1));
	}
	return shellEnv;
}
function resolveExecCacheId(exec) {
	if (!exec) return "default";
	let id = execCacheIds.get(exec);
	if (!id) {
		id = nextExecCacheId;
		nextExecCacheId += 1;
		execCacheIds.set(exec, id);
	}
	return `exec:${id}`;
}
function createLoginShellEnvCacheKey(params) {
	const startupEnvEntries = Object.entries(params.execEnv).filter(([key]) => {
		if (key === "HOME" || key === "PATH" || key === "TERM" || key === "LANG" || key === "LC_ALL" || key === "LC_CTYPE" || key === "USER" || key === "LOGNAME" || key === "TMPDIR") return true;
		return key.startsWith("XDG_") || key.startsWith("OPENCLAW_");
	}).toSorted(([left], [right]) => left.localeCompare(right));
	return JSON.stringify([
		params.shell,
		params.timeoutMs,
		params.purpose,
		resolveExecCacheId(params.exec),
		startupEnvEntries
	]);
}
function probeLoginShellEnv(params) {
	if ((params.platform ?? process.platform) === "win32") return {
		ok: true,
		shellEnv: /* @__PURE__ */ new Map()
	};
	const exec = params.exec ?? execFileSync;
	const timeoutMs = resolveTimeoutMs(params.timeoutMs);
	const shell = resolveShell(params.env);
	const execEnv = resolveShellExecEnv(params.env);
	const cacheKey = createLoginShellEnvCacheKey({
		shell,
		timeoutMs,
		exec: params.exec,
		execEnv,
		purpose: params.purpose
	});
	const cached = loginShellEnvProbeCache.get(cacheKey);
	if (cached) return {
		ok: true,
		shellEnv: new Map(cached)
	};
	try {
		const shellEnv = parseShellEnv(execLoginShellEnvZero({
			shell,
			env: execEnv,
			exec,
			timeoutMs,
			purpose: params.purpose
		}));
		loginShellEnvProbeCache.set(cacheKey, [...shellEnv.entries()]);
		return {
			ok: true,
			shellEnv
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
function loadShellEnvFallback(opts) {
	const logger = opts.logger ?? console;
	if (!opts.enabled) {
		lastAppliedKeys = [];
		return {
			ok: true,
			applied: [],
			skippedReason: "disabled"
		};
	}
	const missingExpectedKeys = opts.expectedKeys.filter((key) => !Object.hasOwn(opts.env, key));
	if (missingExpectedKeys.length === 0) {
		lastAppliedKeys = [];
		return {
			ok: true,
			applied: [],
			skippedReason: "already-has-keys"
		};
	}
	const probe = probeLoginShellEnv({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec,
		platform: opts.platform,
		purpose: "environment-import"
	});
	if (!probe.ok) {
		logger.warn(`[openclaw] shell env fallback failed: ${probe.error}`);
		lastAppliedKeys = [];
		return {
			ok: false,
			error: probe.error,
			applied: []
		};
	}
	const applied = [];
	for (const key of missingExpectedKeys) {
		const value = probe.shellEnv.get(key);
		if (!value?.trim()) continue;
		opts.env[key] = value;
		applied.push(key);
	}
	lastAppliedKeys = applied;
	return {
		ok: true,
		applied
	};
}
function shouldEnableShellEnvFallback(env) {
	return isTruthyEnvValue(env.OPENCLAW_LOAD_SHELL_ENV);
}
function shouldDeferShellEnvFallback(env) {
	return isTruthyEnvValue(env.OPENCLAW_DEFER_SHELL_ENV_FALLBACK);
}
function resolveShellEnvFallbackTimeoutMs(env) {
	const raw = env.OPENCLAW_SHELL_ENV_TIMEOUT_MS?.trim();
	if (!raw) return DEFAULT_TIMEOUT_MS;
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed === void 0) return DEFAULT_TIMEOUT_MS;
	return resolveTimeoutMs(parsed);
}
function getShellPathFromLoginShell(opts) {
	if (cachedShellPath !== void 0) return cachedShellPath;
	const platform = opts.platform ?? process.platform;
	if (platform === "win32") {
		cachedShellPath = null;
		return cachedShellPath;
	}
	const probe = probeLoginShellEnv({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec,
		platform,
		purpose: "path"
	});
	if (!probe.ok) return null;
	cachedShellPath = probe.shellEnv.get("PATH")?.trim() || null;
	return cachedShellPath;
}
/** Prepare the synchronous executable resolvers without blocking their async caller. */
function prepareShellPathFromLoginShell(opts) {
	if (cachedShellPath !== void 0) return Promise.resolve(cachedShellPath);
	if ((opts.platform ?? process.platform) === "win32") {
		cachedShellPath = null;
		return Promise.resolve(null);
	}
	const timeoutMs = resolveTimeoutMs(opts.timeoutMs);
	const shell = resolveShell(opts.env);
	const execEnv = resolveShellExecEnv(opts.env);
	const cacheKey = createLoginShellEnvCacheKey({
		shell,
		timeoutMs,
		execEnv,
		purpose: "path"
	});
	const pending = pendingShellPathProbes.get(cacheKey);
	if (pending) return pending;
	const cached = loginShellEnvProbeCache.peek(cacheKey);
	const result = (cached ? Promise.resolve(new Map(cached)) : execLoginShellEnvZeroAsync({
		shell,
		env: execEnv,
		timeoutMs,
		purpose: "path"
	}).then(parseShellEnv)).then((shellEnv) => {
		loginShellEnvProbeCache.set(cacheKey, [...shellEnv.entries()]);
		if (cachedShellPath === void 0) cachedShellPath = shellEnv.get("PATH")?.trim() || null;
		return cachedShellPath;
	}).catch(() => cachedShellPath ?? null).finally(() => pendingShellPathProbes.delete(cacheKey));
	pendingShellPathProbes.set(cacheKey, result);
	return result;
}
function resolveExecutableFromUserShellPath(executable, opts) {
	const direct = resolveExecutableFromPathEnv(executable, opts.pathEnv ?? opts.env.PATH ?? opts.env.Path ?? "", opts.env, { includeExtensionless: opts.includeExtensionless });
	if (direct && opts.strategy === "fallback") return { executable: direct };
	const shellPath = getShellPathFromLoginShell({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec,
		platform: opts.platform
	});
	if (!shellPath) return direct ? { executable: direct } : void 0;
	const resolved = resolveExecutableFromPathEnv(executable, shellPath, opts.env, { includeExtensionless: opts.includeExtensionless });
	if (resolved) return {
		executable: resolved,
		pathEnv: shellPath
	};
	return direct ? { executable: direct } : void 0;
}
function getShellEnvAppliedKeys() {
	return [...lastAppliedKeys];
}
function clearShellEnvAppliedKeys(keys) {
	const removed = new Set(keys);
	lastAppliedKeys = lastAppliedKeys.filter((key) => !removed.has(key));
}
//#endregion
export { prepareShellPathFromLoginShell as a, shouldDeferShellEnvFallback as c, loadShellEnvFallback as i, shouldEnableShellEnvFallback as l, getShellEnvAppliedKeys as n, resolveExecutableFromUserShellPath as o, getShellPathFromLoginShell as r, resolveShellEnvFallbackTimeoutMs as s, clearShellEnvAppliedKeys as t };

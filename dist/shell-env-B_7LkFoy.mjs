import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as sanitizeHostExecEnv } from "./host-env-security-D7wdDMke.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-BMRdcL7i.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";
//#region src/infra/shell-env.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_MAX_BUFFER_BYTES = 2097152;
const DEFAULT_SHELL = "/bin/sh";
const LOGIN_SHELL_ENV_COMMAND = "printf '\\0'; env -0";
let lastAppliedKeys = [];
let cachedShellPath;
let cachedEtcShells;
let nextExecCacheId = 1;
const loginShellEnvProbeCache = /* @__PURE__ */ new Map();
const LOGIN_SHELL_ENV_CACHE_LIMIT = 64;
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
function execLoginShellEnvZero(params) {
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
	return params.exec(params.shell, args, options);
}
function parseShellEnv(stdout) {
	const shellEnv = /* @__PURE__ */ new Map();
	const frameEnd = stdout.indexOf(0);
	if (frameEnd < 0) return shellEnv;
	const parts = stdout.subarray(frameEnd + 1).toString("utf8").split("\0");
	for (const part of parts) {
		if (!part) continue;
		const eq = part.indexOf("=");
		if (eq <= 0) continue;
		const key = part.slice(0, eq);
		const value = part.slice(eq + 1);
		if (!key) continue;
		shellEnv.set(key, value);
	}
	return shellEnv;
}
function resolveExecCacheId(exec) {
	if (!exec) return "default";
	const key = exec;
	let id = execCacheIds.get(key);
	if (!id) {
		id = nextExecCacheId;
		nextExecCacheId += 1;
		execCacheIds.set(key, id);
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
	if (cached) {
		loginShellEnvProbeCache.delete(cacheKey);
		loginShellEnvProbeCache.set(cacheKey, cached);
		return {
			ok: true,
			shellEnv: new Map(cached)
		};
	}
	try {
		const shellEnv = parseShellEnv(execLoginShellEnvZero({
			shell,
			env: execEnv,
			exec,
			timeoutMs,
			purpose: params.purpose
		}));
		loginShellEnvProbeCache.set(cacheKey, [...shellEnv.entries()]);
		pruneMapToMaxSize(loginShellEnvProbeCache, LOGIN_SHELL_ENV_CACHE_LIMIT);
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
function hasExplicitEnvBinding(env, key) {
	return Object.hasOwn(env, key);
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
	const missingExpectedKeys = opts.expectedKeys.filter((key) => !hasExplicitEnvBinding(opts.env, key));
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
	const shellPath = probe.shellEnv.get("PATH")?.trim();
	cachedShellPath = shellPath && shellPath.length > 0 ? shellPath : null;
	return cachedShellPath;
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
export { resolveExecutableFromUserShellPath as a, shouldEnableShellEnvFallback as c, loadShellEnvFallback as i, getShellEnvAppliedKeys as n, resolveShellEnvFallbackTimeoutMs as o, getShellPathFromLoginShell as r, shouldDeferShellEnvFallback as s, clearShellEnvAppliedKeys as t };

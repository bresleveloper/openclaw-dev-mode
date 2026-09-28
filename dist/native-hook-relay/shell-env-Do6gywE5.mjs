import { t as formatErrorMessage } from "./errors-Cy4ii9Fo.mjs";
import { A as resolveTimerTimeoutMs, E as parseStrictNonNegativeInteger } from "./utils-C25eiuh1.mjs";
import { et as pruneMapToMaxSize } from "./redact-0yyk4gHy.mjs";
import { c as isTruthyEnvValue, i as sanitizeHostExecEnv } from "./host-env-security-DFM0cQIV.mjs";
import { execFileSync } from "node:child_process";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/infra/shell-env.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_MAX_BUFFER_BYTES = 2097152;
const DEFAULT_SHELL = "/bin/sh";
const LOGIN_SHELL_ENV_COMMAND = "printf '\\0'; env -0";
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
		const entries = fsSync.readFileSync("/etc/shells", "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#") && path.isAbsolute(line));
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
	if (!opts.enabled) return {
		ok: true,
		applied: [],
		skippedReason: "disabled"
	};
	const missingExpectedKeys = opts.expectedKeys.filter((key) => !hasExplicitEnvBinding(opts.env, key));
	if (missingExpectedKeys.length === 0) return {
		ok: true,
		applied: [],
		skippedReason: "already-has-keys"
	};
	const probe = probeLoginShellEnv({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec,
		platform: opts.platform,
		purpose: "environment-import"
	});
	if (!probe.ok) {
		logger.warn(`[openclaw] shell env fallback failed: ${probe.error}`);
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
//#endregion
export { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback };

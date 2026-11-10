import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveSafeChildProcessInvocation } from "./windows-command-DciDw8YG.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { safeStatSync } from "@openclaw/fs-safe/path";
//#region src/infra/npm-command.ts
const require = createRequire(import.meta.url);
var BundledNpmCliNotFoundError = class extends Error {
	constructor(cliPath, cause) {
		super(`Bundled npm CLI is missing: ${cliPath}. Reinstall OpenClaw to restore npm/bin/npm-cli.js.`, { cause });
		this.code = "BUNDLED_NPM_CLI_NOT_FOUND";
		this.name = "BundledNpmCliNotFoundError";
	}
};
/** Runs the packaged npm CLI with the current JavaScript runtime. */
function resolveBundledNpmCommand(args) {
	let cliPath = "npm/bin/npm-cli.js";
	try {
		cliPath = path.join(path.dirname(require.resolve("npm/package.json")), "bin", "npm-cli.js");
		if (!fs.statSync(cliPath).isFile()) throw new Error("Not a regular file");
	} catch (cause) {
		throw new BundledNpmCliNotFoundError(cliPath, cause);
	}
	return [
		process.execPath,
		cliPath,
		...args
	];
}
/** Bun must run the packaged CLI directly; npm's executable requires Node. */
function resolveNpmCommand(args) {
	return process.versions.bun ? resolveBundledNpmCommand(args) : ["npm", ...args];
}
//#endregion
//#region src/infra/update-network-budget.ts
const UPDATE_NETWORK_TIMEOUT_MS = 3e5;
//#endregion
//#region src/infra/npm-install-env.ts
const NPM_CONFIG_SCRIPT_SHELL_KEYS = ["NPM_CONFIG_SCRIPT_SHELL", "npm_config_script_shell"];
const NPM_CONFIG_KEYS_TO_RESET = /* @__PURE__ */ new Set([
	"npm_config_cache",
	"npm_config_dry_run",
	"npm_config_global",
	"npm_config_include_workspace_root",
	"npm_config_ignore_scripts",
	"npm_config_location",
	"npm_config_legacy_peer_deps",
	"npm_config_prefix",
	"npm_config_strict_peer_deps",
	"npm_config_workspace",
	"npm_config_workspaces"
]);
const NPM_FRESHNESS_BYPASS_KEYS = [
	"NPM_CONFIG_BEFORE",
	"npm_config_before",
	"NPM_CONFIG_MIN_RELEASE_AGE",
	"npm_config_min_release_age",
	"NPM_CONFIG_MIN-RELEASE-AGE",
	"npm_config_min-release-age"
];
const NPM_CONFIG_PATH_PROBE_PARENT_ENV_KEYS = [
	"PATH",
	"Path",
	"PATHEXT",
	"SystemRoot",
	"ComSpec"
];
const NPM_GLOBAL_CONFIG_PATH_CACHE = /* @__PURE__ */ new Map();
const NPM_GLOBAL_CONFIG_PATH_CACHE_ENV_KEYS = [
	...NPM_CONFIG_PATH_PROBE_PARENT_ENV_KEYS,
	"NPM_CONFIG_GLOBALCONFIG",
	"npm_config_globalconfig",
	"NPM_CONFIG_PREFIX",
	"npm_config_prefix",
	"NPM_CONFIG_USERCONFIG",
	"npm_config_userconfig",
	"HOME",
	"PREFIX",
	"USERPROFILE"
];
function resolveEnvPath(env, name) {
	const raw = env[`NPM_CONFIG_${name}`]?.trim() || env[`npm_config_${name.toLowerCase()}`]?.trim();
	return raw ? resolveNpmConfigPath(raw, env) : null;
}
function resolveHomeNpmrc(env) {
	const home = env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
	return path.join(home, ".npmrc");
}
function replaceNpmEnvRefs(value, env) {
	return value.replace(/(?<!\\)(\\*)\$\{([^${}?]+)(\?)?\}/gu, (original, escapes, name, modifier) => {
		const fallback = modifier === "?" ? "" : `\${${name}}`;
		const resolved = env[name] !== void 0 ? env[name] : fallback;
		if (escapes.length % 2) return original.slice((escapes.length + 1) / 2);
		return `${escapes.slice(escapes.length / 2)}${resolved}`;
	});
}
function resolveNpmConfigPath(rawPath, env) {
	const expanded = replaceNpmEnvRefs(rawPath, env);
	const home = env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
	return (process.platform === "win32" ? /^~(\/|\\)/u : /^~\//u).test(expanded) && home ? path.resolve(home, expanded.slice(2)) : path.resolve(expanded);
}
function createNpmConfigPathProbeEnv(env, scope) {
	const probeEnv = { ...env };
	for (const key of NPM_FRESHNESS_BYPASS_KEYS) delete probeEnv[key];
	for (const key of NPM_CONFIG_PATH_PROBE_PARENT_ENV_KEYS) if (probeEnv[key] == null && process.env[key] != null) probeEnv[key] = process.env[key];
	if (scope.npmConfigPrefix) probeEnv.npm_config_prefix = scope.npmConfigPrefix;
	return probeEnv;
}
function runNpmConfigProbe(params) {
	const invocation = resolveSafeChildProcessInvocation({
		argv: resolveNpmCommand(params.args),
		cwd: params.cwd,
		env: params.env
	});
	const result = spawnSync(invocation.command, invocation.args, {
		cwd: params.cwd,
		encoding: "utf-8",
		env: params.env,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		timeout: params.timeoutMs,
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	if (result.error) throw result.error;
	if (result.status !== 0) throw new Error(`npm config check exited with status ${result.status ?? "unknown"}`);
	return result.stdout;
}
function readNpmGlobalConfigPath(env, scope) {
	const scopedGlobalConfig = resolveScopedGlobalNpmrc(scope);
	if (scopedGlobalConfig) return scopedGlobalConfig;
	const configuredGlobalConfig = resolveEnvPath(env, "GLOBALCONFIG");
	if (configuredGlobalConfig) return configuredGlobalConfig;
	const configuredPrefix = resolveEnvPath(env, "PREFIX");
	if (configuredPrefix) return path.join(configuredPrefix, "etc", "npmrc");
	const cacheKey = buildNpmGlobalConfigPathCacheKey(env, scope);
	if (NPM_GLOBAL_CONFIG_PATH_CACHE.has(cacheKey)) return NPM_GLOBAL_CONFIG_PATH_CACHE.get(cacheKey) ?? null;
	try {
		const raw = runNpmConfigProbe({
			args: [
				"config",
				"get",
				"globalconfig"
			],
			env: createNpmConfigPathProbeEnv(env, scope),
			timeoutMs: 2e3
		}).trim();
		const resolved = raw && raw !== "null" && raw !== "undefined" ? raw : null;
		NPM_GLOBAL_CONFIG_PATH_CACHE.set(cacheKey, resolved);
		return resolved;
	} catch {
		NPM_GLOBAL_CONFIG_PATH_CACHE.set(cacheKey, null);
		return null;
	}
}
function buildNpmGlobalConfigPathCacheKey(env, scope) {
	const configFiles = resolveNpmConfigFiles(env, scope);
	return JSON.stringify({
		cwd: scope.npmConfigCwd?.trim() || tryProcessCwd() || "",
		prefix: scope.npmConfigPrefix?.trim() ?? "",
		env: Object.fromEntries(NPM_GLOBAL_CONFIG_PATH_CACHE_ENV_KEYS.map((key) => [key, env[key] ?? process.env[key] ?? ""])),
		configFiles: configFiles.map((filePath) => {
			const stat = safeStatSync(filePath);
			return {
				path: filePath,
				signature: stat ? `${stat.mtimeMs}:${stat.size}` : "missing"
			};
		})
	});
}
function resolveScopedProjectNpmrc(scope) {
	const cwd = scope.npmConfigCwd?.trim() || tryProcessCwd();
	return cwd ? path.join(cwd, ".npmrc") : null;
}
function resolveScopedGlobalNpmrc(scope) {
	const prefix = scope.npmConfigPrefix?.trim();
	return prefix ? path.join(prefix, "etc", "npmrc") : null;
}
function resolveNpmConfigFiles(env, scope, includeProbedGlobal = false) {
	const files = [
		resolveScopedProjectNpmrc(scope),
		resolveEnvPath(env, "USERCONFIG") ?? resolveHomeNpmrc(env),
		resolveEnvPath(env, "GLOBALCONFIG"),
		resolveScopedGlobalNpmrc(scope),
		...includeProbedGlobal ? [readNpmGlobalConfigPath(env, scope)] : []
	];
	return uniqueStrings(files.filter((file) => Boolean(file)));
}
function hasNpmrcConfigKey(filePath, key) {
	try {
		const raw = fs.readFileSync(filePath, "utf-8");
		const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		return new RegExp(`^\\s*${escapedKey}\\s*=`, "imu").test(raw);
	} catch {
		return false;
	}
}
function hasNpmEnvConfigKey(env, key) {
	return Object.entries(env).some(([envKey, value]) => {
		if (!/^npm_config_/iu.test(envKey) || !value?.trim()) return false;
		return envKey.slice(11).replace(/(?!^)_/gu, "-").toLowerCase() === key;
	});
}
/** Finds keys npm resolves from explicit config layers rather than built-in defaults. */
function findExplicitNpmConfigKeys(env, keys, scope = {}) {
	const found = new Set(keys.filter((key) => hasNpmEnvConfigKey(env, key)));
	const remaining = keys.filter((key) => !found.has(key));
	if (remaining.length === 0) return found;
	const cwd = scope.npmConfigCwd?.trim() || tryProcessCwd() || void 0;
	const probeEnv = createNpmConfigPathProbeEnv(env, scope);
	try {
		const raw = runNpmConfigProbe({
			args: [
				"config",
				"list",
				"--location=project",
				"--json=false",
				"--long=false"
			],
			cwd,
			env: probeEnv,
			timeoutMs: 5e3
		});
		const installConfig = raw.split(/^; "publishConfig" from /mu, 1)[0] ?? raw;
		for (const key of remaining) {
			const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
			if (new RegExp(`^${escapedKey}\\s*=`, "mu").test(installConfig)) found.add(key);
		}
	} catch {
		for (const key of remaining) found.add(key);
	}
	return found;
}
function resolveNpmFreshnessBypassMode(env, scope) {
	if (process.platform === "win32") return "before";
	const hasRawKey = (key) => resolveNpmConfigFiles(env, scope, true).some((file) => hasNpmrcConfigKey(file, key));
	if (hasRawKey("min-release-age")) return "min-release-age";
	return hasRawKey("before") ? "before" : "min-release-age";
}
/**
* Builds npm args that bypass host freshness policies for OpenClaw-managed installs.
* Existing npmrc policy decides whether `before` or `min-release-age` is safer.
*/
function createNpmFreshnessBypassArgs(env = process.env, now = /* @__PURE__ */ new Date(), scope = {}) {
	if (resolveNpmFreshnessBypassMode(env, scope) === "min-release-age") return ["--min-release-age=0"];
	return [`--before=${now.toISOString()}`];
}
function applyNpmFreshnessBypassEnv(env, now = /* @__PURE__ */ new Date(), scope = {}) {
	const before = resolveNpmFreshnessBypassMode(env, scope) === "before" ? now.toISOString() : void 0;
	for (const key of NPM_FRESHNESS_BYPASS_KEYS) {
		if (process.platform === "win32" && key.includes("-")) {
			delete env[key];
			continue;
		}
		env[key] = "";
	}
	if (before !== void 0) env.npm_config_before = before;
	else env.npm_config_min_release_age = "0";
}
/**
* Creates npm env for project-local installs, clearing global/workspace config
* and adding fetch, freshness, cache, and POSIX script-shell defaults.
*/
function createNpmProjectInstallEnv(env, options = {}, now = /* @__PURE__ */ new Date()) {
	const nextEnv = { ...env };
	for (const key of Object.keys(nextEnv)) if (NPM_CONFIG_KEYS_TO_RESET.has(key.toLowerCase())) delete nextEnv[key];
	for (const [key, fallback] of Object.entries({
		npm_config_fetch_retries: "5",
		npm_config_fetch_retry_maxtimeout: "120000",
		npm_config_fetch_retry_mintimeout: "10000",
		npm_config_fetch_timeout: String(UPDATE_NETWORK_TIMEOUT_MS)
	})) if (!Object.entries(nextEnv).some(([name, value]) => name.toLowerCase() === key && value !== void 0)) nextEnv[key] = fallback;
	const installEnv = {
		...nextEnv,
		npm_config_dry_run: "false",
		npm_config_global: "false",
		npm_config_location: "project",
		npm_config_package_lock: "false",
		npm_config_save: "false",
		...options.cacheDir ? { npm_config_cache: options.cacheDir } : {}
	};
	applyNpmFreshnessBypassEnv(installEnv, now, options);
	applyPosixNpmScriptShellEnv(installEnv);
	return installEnv;
}
/** Sets npm's script-shell env only when the caller has not configured one. */
function applyPosixNpmScriptShellEnv(env) {
	if (NPM_CONFIG_SCRIPT_SHELL_KEYS.some((key) => Boolean(env[key]?.trim())) || process.platform === "win32") return;
	if (fs.existsSync("/bin/sh")) env.NPM_CONFIG_SCRIPT_SHELL = "/bin/sh";
	else {
		const shell = env.SHELL?.trim();
		if (shell && path.isAbsolute(shell) && fs.existsSync(shell)) env.NPM_CONFIG_SCRIPT_SHELL = shell;
	}
}
//#endregion
export { findExplicitNpmConfigKeys as a, createNpmProjectInstallEnv as i, applyPosixNpmScriptShellEnv as n, UPDATE_NETWORK_TIMEOUT_MS as o, createNpmFreshnessBypassArgs as r, resolveNpmCommand as s, applyNpmFreshnessBypassEnv as t };

import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as resolveGatewayWindowsTaskName, m as resolveGatewaySystemdServiceName, n as GATEWAY_SERVICE_KIND, r as GATEWAY_SERVICE_MARKER, u as resolveGatewayLaunchAgentLabel, v as resolveNodeServiceIdentityEnvironment } from "./constants-BLghGsId.mjs";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CnxxjID9.mjs";
import { n as resolveGatewayStateDir } from "./paths-DMJOvLwv.mjs";
import { a as resolveGatewayHeapNodeOptions } from "./gateway-heap-DTqeZ8TX.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/daemon/service-env.ts
/** Builds minimal, portable environment blocks for managed daemon services. */
const SERVICE_PROXY_ENV_KEYS = [
	"OPENCLAW_PROXY_URL",
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"NO_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"no_proxy",
	"all_proxy"
];
function readServiceSqliteEnvironment(env, platform, runtime) {
	if (platform !== "darwin" || runtime !== "bun" && !normalizeOptionalString(env.OPENCLAW_WRAPPER)) return {};
	const library = normalizeOptionalString(env.OPENCLAW_SQLITE_LIBRARY);
	const prefix = normalizeOptionalString(env.HOMEBREW_PREFIX);
	return {
		...library ? { OPENCLAW_SQLITE_LIBRARY: library } : {},
		...prefix && path.posix.isAbsolute(prefix) ? { HOMEBREW_PREFIX: prefix } : {}
	};
}
function readServiceProxyEnvironment(env) {
	const proxyUrl = normalizeOptionalString(env.OPENCLAW_PROXY_URL);
	return proxyUrl ? { OPENCLAW_PROXY_URL: proxyUrl } : {};
}
function normalizeServicePathDir(dir) {
	const trimmed = dir?.trim();
	if (!trimmed || !path.posix.isAbsolute(trimmed)) return;
	return path.posix.normalize(trimmed);
}
function realpathServicePathDir(dir) {
	try {
		return path.posix.normalize(fs.realpathSync.native(dir));
	} catch {
		return;
	}
}
function realpathExistingServicePathDir(dir) {
	const parts = [];
	let current = dir;
	while (true) {
		const realCurrent = realpathServicePathDir(current);
		if (realCurrent) return path.posix.join(realCurrent, ...parts.toReversed());
		const parent = path.posix.dirname(current);
		if (!current || current === parent) return;
		parts.push(path.posix.basename(current));
		current = parent;
	}
}
function isSameOrChildPath(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}/`);
}
function isWorkspaceDerivedPath(dir, options) {
	if (isSameOrChildPath(dir, "/proc")) return true;
	const cwd = normalizeServicePathDir(options.cwd ?? process.cwd());
	if (!cwd) return false;
	const home = normalizeServicePathDir(options.home);
	if (home && cwd === home) return false;
	if (isSameOrChildPath(dir, cwd)) return true;
	const realDir = realpathExistingServicePathDir(dir);
	const realCwd = realpathServicePathDir(cwd);
	const realHome = home ? realpathServicePathDir(home) : void 0;
	return Boolean(realDir && realCwd && realHome !== realCwd && isSameOrChildPath(realDir, realCwd));
}
function addEnvConfiguredBinDir(dirs, dir, options) {
	const normalized = normalizeServicePathDir(dir);
	if (!normalized || isWorkspaceDerivedPath(normalized, options)) return;
	dirs.push(normalized);
}
function appendSubdir(base, subdir) {
	if (!base) return;
	return base.endsWith(`/${subdir}`) ? base : path.posix.join(base, subdir);
}
function addExistingDir(dirs, candidate, existsSync) {
	if (existsSync(candidate)) dirs.push(candidate);
}
function addNixProfileBinDirs(dirs, home, env, options, includeMissingDefault, existsSync) {
	const nixProfiles = env?.NIX_PROFILES?.trim();
	if (nixProfiles) for (const profile of nixProfiles.split(/\s+/).toReversed()) addEnvConfiguredBinDir(dirs, appendSubdir(profile, "bin"), options);
	else {
		const defaultProfileBin = `${home}/.nix-profile/bin`;
		if (includeMissingDefault) dirs.push(defaultProfileBin);
		else addExistingDir(dirs, defaultProfileBin, existsSync);
	}
}
function resolveSystemPathDirs(platform) {
	if (platform === "darwin") return [
		"/opt/homebrew/bin",
		"/opt/homebrew/sbin",
		"/usr/local/bin",
		"/usr/bin",
		"/bin",
		"/usr/sbin",
		"/sbin"
	];
	if (platform === "linux") return [
		"/usr/local/bin",
		"/usr/bin",
		"/bin"
	];
	return [];
}
/** Resolve Linux user bin directories after trusted system directories. */
function resolveUserBinDirs(home, env, existsSync = fs.existsSync, options = {}) {
	if (!home) return [];
	const dirs = [];
	const pathOptions = {
		...options,
		home
	};
	const includeMissingUserBinDefaults = options.includeMissingUserBinDefaults ?? true;
	addEnvConfiguredBinDir(dirs, env?.PNPM_HOME, pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.PNPM_HOME, "bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.NPM_CONFIG_PREFIX, "bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.BUN_INSTALL, "bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.VOLTA_HOME, "bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.ASDF_DATA_DIR, "shims"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.NVM_DIR, "current/bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "aliases/default/bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "current/bin"), pathOptions);
	for (const directory of [
		".local/bin",
		".npm-global/bin",
		"bin"
	]) {
		const candidate = `${home}/${directory}`;
		if (includeMissingUserBinDefaults || existsSync(candidate)) dirs.push(candidate);
	}
	for (const directory of [
		".volta/bin",
		".asdf/shims",
		".bun/bin"
	]) addExistingDir(dirs, `${home}/${directory}`, existsSync);
	addNixProfileBinDirs(dirs, home, env, pathOptions, includeMissingUserBinDefaults, existsSync);
	for (const directory of [
		".nvm/current/bin",
		".local/share/fnm/aliases/default/bin",
		".local/share/fnm/current/bin",
		".fnm/aliases/default/bin",
		".fnm/current/bin",
		".local/share/pnpm/bin",
		".local/share/pnpm"
	]) addExistingDir(dirs, `${home}/${directory}`, existsSync);
	return dirs;
}
function getMinimalServicePathPartsFromEnv(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	if (platform === "win32") return [];
	const extraDirs = options.extraDirs ?? [];
	const systemDirs = resolveSystemPathDirs(platform);
	const existsSync = options.existsSync ?? fs.existsSync;
	const userDirs = platform === "linux" ? resolveUserBinDirs(options.home ?? env.HOME, env, existsSync, options) : [];
	return [...new Set([
		...extraDirs,
		...systemDirs,
		...userDirs
	].filter(Boolean))];
}
function resolveGatewaySystemdUnitEnv(env) {
	const override = normalizeOptionalString(env.OPENCLAW_SYSTEMD_UNIT);
	if (override) return override.endsWith(".service") ? override : `${override}.service`;
	return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
function buildServiceEnvironment(params) {
	const { env, port, launchdLabel, extraPathDirs } = params;
	const platform = params.platform ?? process.platform;
	const commonEnvironment = buildCommonServiceEnvironment(env, platform, extraPathDirs, params.execPath);
	const profile = env.OPENCLAW_PROFILE;
	const wrapperPath = normalizeOptionalString(env.OPENCLAW_WRAPPER);
	const resolvedLaunchdLabel = launchdLabel || (platform === "darwin" ? resolveGatewayLaunchAgentLabel(profile) : void 0);
	const systemdUnit = resolveGatewaySystemdUnitEnv(env);
	return {
		...commonEnvironment,
		...readServiceSqliteEnvironment(env, platform, params.runtime),
		NODE_OPTIONS: resolveGatewayHeapNodeOptions(params.existingNodeOptions, wrapperPath ? void 0 : params.runtime),
		OPENCLAW_PROFILE: profile,
		...env.OPENCLAW_CONFIG_READONLY !== void 0 ? { OPENCLAW_CONFIG_READONLY: env.OPENCLAW_CONFIG_READONLY } : {},
		OPENCLAW_WRAPPER: wrapperPath,
		OPENCLAW_GATEWAY_PORT: String(port),
		OPENCLAW_LAUNCHD_LABEL: resolvedLaunchdLabel,
		OPENCLAW_SYSTEMD_UNIT: systemdUnit,
		OPENCLAW_WINDOWS_TASK_NAME: resolveGatewayWindowsTaskName(profile),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_SERVICE_MARKER: GATEWAY_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: GATEWAY_SERVICE_KIND
	};
}
function buildNodeServiceEnvironment(params) {
	const { env, extraPathDirs } = params;
	const platform = params.platform ?? process.platform;
	return {
		...buildCommonServiceEnvironment(env, platform, extraPathDirs, params.execPath),
		...readServiceSqliteEnvironment(env, platform, params.runtime),
		OPENCLAW_GATEWAY_TOKEN: normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN),
		OPENCLAW_GATEWAY_PASSWORD: normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD),
		CF_ACCESS_CLIENT_ID: normalizeOptionalString(env.CF_ACCESS_CLIENT_ID),
		CF_ACCESS_CLIENT_SECRET: normalizeOptionalString(env.CF_ACCESS_CLIENT_SECRET),
		OPENCLAW_ALLOW_INSECURE_PRIVATE_WS: normalizeOptionalString(env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS),
		NODE_DISABLE_COMPILE_CACHE: platform === "darwin" ? "1" : void 0,
		...resolveNodeServiceIdentityEnvironment()
	};
}
function resolveServiceTmpDir(env, platform) {
	if (platform === "darwin") try {
		return path.join(resolveGatewayStateDir(env), "tmp");
	} catch {}
	return env.TMPDIR?.trim() || os.tmpdir();
}
function buildCommonServiceEnvironment(env, platform, extraPathDirs, execPath) {
	const tmpDir = resolveServiceTmpDir(env, platform);
	const startupTlsEnv = resolveNodeStartupTlsEnvironment({
		env,
		platform,
		execPath
	});
	const minimalPath = platform === "win32" ? void 0 : getMinimalServicePathPartsFromEnv({
		env,
		platform,
		extraDirs: extraPathDirs
	}).join(path.posix.delimiter);
	return {
		HOME: env.HOME,
		TMPDIR: tmpDir,
		NODE_EXTRA_CA_CERTS: startupTlsEnv.NODE_EXTRA_CA_CERTS,
		NODE_USE_SYSTEM_CA: startupTlsEnv.NODE_USE_SYSTEM_CA,
		OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR,
		OPENCLAW_CONFIG_PATH: env.OPENCLAW_CONFIG_PATH,
		...readServiceProxyEnvironment(env),
		...minimalPath ? { PATH: minimalPath } : {}
	};
}
//#endregion
export { getMinimalServicePathPartsFromEnv as i, buildNodeServiceEnvironment as n, buildServiceEnvironment as r, SERVICE_PROXY_ENV_KEYS as t };

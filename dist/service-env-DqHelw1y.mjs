import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { g as resolveNodeServiceIdentityEnvironment, l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, n as GATEWAY_SERVICE_KIND, p as resolveGatewaySystemdServiceName, r as GATEWAY_SERVICE_MARKER } from "./constants-CJCmIHb-.mjs";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CE_a1k52.mjs";
import { n as resolveGatewayStateDir } from "./paths-B1MX98Zs.mjs";
import { a as resolveGatewayHeapNodeOptions } from "./gateway-heap-9PZ2gCSQ.mjs";
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
	while (current && current !== path.posix.dirname(current)) {
		const realCurrent = realpathServicePathDir(current);
		if (realCurrent) return path.posix.normalize(path.posix.join(realCurrent, ...parts.toReversed()));
		parts.push(path.posix.basename(current));
		current = path.posix.dirname(current);
	}
	const realRoot = realpathServicePathDir(current);
	return realRoot ? path.posix.normalize(path.posix.join(realRoot, ...parts.toReversed())) : void 0;
}
function isSameOrChildPath(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}/`);
}
function isUnsafeProcPath(candidate) {
	return candidate === "/proc" || candidate.startsWith("/proc/");
}
function isWorkspaceDerivedPath(dir, options) {
	if (isUnsafeProcPath(dir)) return true;
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
function addCommonUserBinDirs(dirs, home, existsSync, includeMissingDefaults) {
	const addDefault = includeMissingDefaults ? (candidate) => dirs.push(candidate) : (candidate) => addExistingDir(dirs, candidate, existsSync);
	addDefault(`${home}/.local/bin`);
	addDefault(`${home}/.npm-global/bin`);
	addDefault(`${home}/bin`);
	addExistingDir(dirs, `${home}/.volta/bin`, existsSync);
	addExistingDir(dirs, `${home}/.asdf/shims`, existsSync);
	addExistingDir(dirs, `${home}/.bun/bin`, existsSync);
}
function addCommonEnvConfiguredBinDirs(dirs, env, options) {
	addEnvConfiguredBinDir(dirs, env?.PNPM_HOME, options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.PNPM_HOME, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.NPM_CONFIG_PREFIX, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.BUN_INSTALL, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.VOLTA_HOME, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.ASDF_DATA_DIR, "shims"), options);
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
/** Resolve common user bin directories while preserving platform-specific manager roots. */
function resolveUserBinDirs(home, platform, env, existsSync = fs.existsSync, options = {}) {
	if (!home) return [];
	const dirs = [];
	const pathOptions = {
		...options,
		home
	};
	const includeMissingUserBinDefaults = options.includeMissingUserBinDefaults ?? true;
	addCommonEnvConfiguredBinDirs(dirs, env, pathOptions);
	addEnvConfiguredBinDir(dirs, platform === "darwin" ? env?.NVM_DIR : appendSubdir(env?.NVM_DIR, "current/bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "aliases/default/bin"), pathOptions);
	if (platform === "linux") addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "current/bin"), pathOptions);
	addCommonUserBinDirs(dirs, home, existsSync, includeMissingUserBinDefaults);
	addNixProfileBinDirs(dirs, home, env, pathOptions, includeMissingUserBinDefaults, existsSync);
	const managerDirs = platform === "darwin" ? [
		"Library/Application Support/fnm/aliases/default/bin",
		".fnm/aliases/default/bin",
		"Library/pnpm/bin",
		"Library/pnpm",
		".local/share/pnpm/bin",
		".local/share/pnpm"
	] : [
		".nvm/current/bin",
		".local/share/fnm/aliases/default/bin",
		".local/share/fnm/current/bin",
		".fnm/aliases/default/bin",
		".fnm/current/bin",
		".local/share/pnpm/bin",
		".local/share/pnpm"
	];
	for (const directory of managerDirs) addExistingDir(dirs, `${home}/${directory}`, existsSync);
	return dirs;
}
function getMinimalServicePathParts(options = {}) {
	const platform = options.platform ?? process.platform;
	if (platform === "win32") return [];
	const extraDirs = options.extraDirs ?? [];
	const systemDirs = resolveSystemPathDirs(platform);
	const includeUserDirs = options.includeUserDirs ?? platform !== "darwin";
	const existsSync = options.existsSync ?? fs.existsSync;
	const userDirs = includeUserDirs && (platform === "linux" || platform === "darwin") ? resolveUserBinDirs(options.home, platform, options.env, existsSync, options) : [];
	return [...new Set([
		...extraDirs,
		...systemDirs,
		...userDirs
	].filter(Boolean))];
}
function getMinimalServicePathPartsFromEnv(options = {}) {
	const env = options.env ?? process.env;
	return getMinimalServicePathParts({
		...options,
		home: options.home ?? env.HOME,
		env
	});
}
function buildMinimalServicePath(options = {}) {
	const env = options.env ?? process.env;
	return getMinimalServicePathPartsFromEnv({
		...options,
		env
	}).join(path.posix.delimiter);
}
function resolveGatewaySystemdUnitEnv(env) {
	const override = normalizeOptionalString(env.OPENCLAW_SYSTEMD_UNIT);
	if (override) return override.endsWith(".service") ? override : `${override}.service`;
	return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
function buildServiceEnvironment(params) {
	const { env, port, launchdLabel, extraPathDirs } = params;
	const platform = params.platform ?? process.platform;
	const sharedEnv = resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, params.execPath);
	const profile = env.OPENCLAW_PROFILE;
	const wrapperPath = normalizeOptionalString(env.OPENCLAW_WRAPPER);
	const resolvedLaunchdLabel = launchdLabel || (platform === "darwin" ? resolveGatewayLaunchAgentLabel(profile) : void 0);
	const systemdUnit = resolveGatewaySystemdUnitEnv(env);
	return {
		...buildCommonServiceEnvironment(env, sharedEnv),
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
	const sharedEnv = resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, params.execPath);
	const gatewayToken = normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN);
	const gatewayPassword = normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD);
	const cloudflareAccessClientId = normalizeOptionalString(env.CF_ACCESS_CLIENT_ID);
	const cloudflareAccessClientSecret = normalizeOptionalString(env.CF_ACCESS_CLIENT_SECRET);
	const allowInsecurePrivateWs = normalizeOptionalString(env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS);
	return {
		...buildCommonServiceEnvironment(env, sharedEnv),
		...readServiceSqliteEnvironment(env, platform, params.runtime),
		OPENCLAW_GATEWAY_TOKEN: gatewayToken,
		OPENCLAW_GATEWAY_PASSWORD: gatewayPassword,
		CF_ACCESS_CLIENT_ID: cloudflareAccessClientId,
		CF_ACCESS_CLIENT_SECRET: cloudflareAccessClientSecret,
		OPENCLAW_ALLOW_INSECURE_PRIVATE_WS: allowInsecurePrivateWs,
		NODE_DISABLE_COMPILE_CACHE: platform === "darwin" ? "1" : void 0,
		...resolveNodeServiceIdentityEnvironment()
	};
}
function buildCommonServiceEnvironment(env, sharedEnv) {
	const serviceEnv = {
		HOME: env.HOME,
		TMPDIR: sharedEnv.tmpDir,
		NODE_EXTRA_CA_CERTS: sharedEnv.nodeCaCerts,
		NODE_USE_SYSTEM_CA: sharedEnv.nodeUseSystemCa,
		OPENCLAW_STATE_DIR: sharedEnv.stateDir,
		OPENCLAW_CONFIG_PATH: sharedEnv.configPath,
		...sharedEnv.proxyEnv
	};
	if (sharedEnv.minimalPath) serviceEnv.PATH = sharedEnv.minimalPath;
	return serviceEnv;
}
function resolveServiceTmpDir(env, platform) {
	if (platform === "darwin") try {
		return path.join(resolveGatewayStateDir(env), "tmp");
	} catch {
		return env.TMPDIR?.trim() || os.tmpdir();
	}
	return env.TMPDIR?.trim() || os.tmpdir();
}
function resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, execPath) {
	const stateDir = env.OPENCLAW_STATE_DIR;
	const configPath = env.OPENCLAW_CONFIG_PATH;
	const tmpDir = resolveServiceTmpDir(env, platform);
	const startupTlsEnv = resolveNodeStartupTlsEnvironment({
		env,
		platform,
		execPath
	});
	return {
		stateDir,
		configPath,
		tmpDir,
		minimalPath: platform === "win32" ? void 0 : buildMinimalServicePath({
			env,
			platform,
			extraDirs: extraPathDirs
		}),
		proxyEnv: readServiceProxyEnvironment(env),
		nodeCaCerts: startupTlsEnv.NODE_EXTRA_CA_CERTS,
		nodeUseSystemCa: startupTlsEnv.NODE_USE_SYSTEM_CA
	};
}
//#endregion
export { getMinimalServicePathPartsFromEnv as i, buildNodeServiceEnvironment as n, buildServiceEnvironment as r, SERVICE_PROXY_ENV_KEYS as t };

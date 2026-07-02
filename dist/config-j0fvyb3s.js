import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CJQ8TR--.js";
import { f as resolveGatewayPort } from "./paths-DyelItkH.js";
import { a as normalizeOptionalTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { d as resolveExistingPathsWithinRoot, m as resolveStrictExistingPathsWithinRoot } from "./fs-safe-aqmM_n6V.js";
import { m as resolveUserPath, t as CONFIG_DIR } from "./utils-BApvfmPs.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { i as isLoopbackHost } from "./net-DQvRbvSK.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-config-snapshot-BJVEWeUQ.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./text-utility-runtime-hurZUKRN.js";
import "./core-BbmhFA6e.js";
import "./plugin-config-runtime-DWfSLpLu.js";
import "./config-mutation-6lHNauPf.js";
import { t as parseBrowserHttpUrl } from "./browser-config-BPzc9xWq.js";
import "./sdk-security-runtime-DUaKWlYv.js";
import { G as DEFAULT_OPENCLAW_BROWSER_COLOR, H as DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS, R as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, V as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS, q as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME } from "./cdp.helpers-DjkDekqM.js";
import "./tmp-openclaw-dir-Md827g-c.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region extensions/browser/src/sdk-config.ts
/**
* Browser-local SDK config bridge plus Browser-specific default port helpers.
*/
const DEFAULT_BROWSER_CDP_PORT_RANGE_START$1 = 18800;
const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN = DEFAULT_BROWSER_CDP_PORT_RANGE_END - DEFAULT_BROWSER_CDP_PORT_RANGE_START$1;
/** Default loopback port for the Browser control server. */
const DEFAULT_BROWSER_CONTROL_PORT = 18791;
function isValidPort(port) {
	return Number.isFinite(port) && port > 0 && port <= 65535;
}
function clampPort(port, fallback) {
	return isValidPort(port) ? port : fallback;
}
function derivePort(base, offset, fallback) {
	return clampPort(base + offset, fallback);
}
/** Derives the Browser control port from the gateway port. */
function deriveDefaultBrowserControlPort(gatewayPort) {
	return derivePort(gatewayPort, 2, DEFAULT_BROWSER_CONTROL_PORT);
}
/** Derives the managed Chrome CDP port range from the Browser control port. */
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
	const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START$1);
	const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
	if (end <= 65535) return {
		start,
		end
	};
	return {
		start: DEFAULT_BROWSER_CDP_PORT_RANGE_START$1,
		end: DEFAULT_BROWSER_CDP_PORT_RANGE_END
	};
}
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
function matchesBooleanToken(value, tokens) {
	return tokens.includes(value);
}
/** Parses common string booleans with optional custom truthy/falsy tokens. */
function parseBooleanValue(value, options = {}) {
	if (typeof value === "boolean") return value;
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	const candidates = [[true, options.truthy ?? DEFAULT_TRUTHY], [false, options.falsy ?? DEFAULT_FALSY]];
	for (const [parsed, tokens] of candidates) if (matchesBooleanToken(normalized, tokens)) return parsed;
}
//#endregion
//#region extensions/browser/src/browser/paths.ts
/**
* Browser filesystem path helpers.
*
* Defines browser output roots and resolves upload/media references while
* enforcing root-scoped path access for Browser tool file inputs.
*/
const DEFAULT_FALLBACK_BROWSER_TMP_DIR = "/tmp/openclaw";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
const DEFAULT_BROWSER_TMP_DIR = canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : DEFAULT_FALLBACK_BROWSER_TMP_DIR;
/** Default root directory for browser trace files. */
const DEFAULT_TRACE_DIR = DEFAULT_BROWSER_TMP_DIR;
/** Default root directory for browser downloads. */
const DEFAULT_DOWNLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "downloads");
/** Default root directory for browser upload inputs. */
const DEFAULT_UPLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "uploads");
/** Default root directory for managed inbound media references. */
const DEFAULT_INBOUND_MEDIA_DIR = path.join(CONFIG_DIR, "media", "inbound");
function normalizeUploadPathSource(source) {
	const trimmed = source.trim();
	if (/^media:\/\//i.test(trimmed)) return trimmed;
	return trimmed.replace(/^\s*MEDIA\s*:\s*/i, "").trim();
}
function decodeInboundMediaId(value, source) {
	let id;
	try {
		id = decodeURIComponent(value);
	} catch {
		return {
			ok: false,
			error: `Invalid media reference: ${source}`
		};
	}
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) return {
		ok: false,
		error: `Invalid media reference: ${source}`
	};
	return {
		ok: true,
		path: id
	};
}
function resolveManagedInboundMediaRef(source, inboundMediaDir) {
	const normalizedSource = normalizeUploadPathSource(source);
	if (!normalizedSource) return null;
	if (/^media:\/\//i.test(normalizedSource)) {
		const rawPath = /^media:\/\/[^/?#]*([^?#]*)/iu.exec(normalizedSource)?.[1] ?? "";
		let parsed;
		try {
			parsed = new URL(normalizedSource);
		} catch {
			return {
				ok: false,
				error: `Invalid media reference: ${normalizedSource}`
			};
		}
		if (parsed.hostname !== "inbound") return {
			ok: false,
			error: `Unsupported media reference location: ${parsed.hostname || "(missing)"}`
		};
		if (!rawPath.startsWith("/") || rawPath.slice(1).includes("/") || rawPath.includes("\\")) return {
			ok: false,
			error: `Invalid media reference: ${normalizedSource}`
		};
		const decoded = decodeInboundMediaId(rawPath.slice(1), normalizedSource);
		return decoded?.ok ? {
			ok: true,
			path: path.join(inboundMediaDir, decoded.path),
			uploadRootPrecedence: false
		} : decoded;
	}
	const relativeMatch = /^(?:\.\/)?media\/inbound\/([^/\\]+)$/u.exec(normalizedSource);
	if (!relativeMatch?.[1]) return null;
	const decoded = decodeInboundMediaId(relativeMatch[1], normalizedSource);
	return decoded?.ok ? {
		ok: true,
		path: path.join(inboundMediaDir, decoded.path),
		uploadRootPrecedence: true
	} : decoded;
}
async function isDirectInboundMediaFile(params) {
	let inboundRoot;
	try {
		inboundRoot = await fs.realpath(params.inboundMediaDir);
	} catch {
		inboundRoot = path.resolve(params.inboundMediaDir);
	}
	const relativePath = path.relative(inboundRoot, params.resolvedPath);
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath) && !relativePath.includes("/") && !relativePath.includes("\\");
}
async function resolveDirectInboundMediaPath(params) {
	const inboundPathsResult = params.strict ? await resolveStrictExistingPathsWithinRoot({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	}) : await resolveExistingPathsWithinRoot({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	});
	if (!inboundPathsResult.ok) return inboundPathsResult;
	const resolvedPath = inboundPathsResult.paths[0] ?? params.requestedPath;
	if (!await isDirectInboundMediaFile({
		inboundMediaDir: params.inboundMediaDir,
		resolvedPath
	})) return {
		ok: false,
		error: `Invalid media reference: must be a direct child of inbound media directory (${params.inboundMediaDir})`
	};
	return inboundPathsResult;
}
/** Resolve upload paths and managed media references into existing file paths. */
async function resolveExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = managedMediaPathResult?.uploadRootPrecedence === true ? await resolveStrictExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			}) : await resolveExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			});
			if (uploadPathsResult.ok) {
				paths.push(uploadPathsResult.paths[0] ?? requestedPath);
				continue;
			}
		}
		const inboundPathsResult = await resolveDirectInboundMediaPath({
			inboundMediaDir,
			requestedPath: managedMediaPathResult?.path ?? requestedPath,
			strict: false
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
/** Strictly resolve upload paths under the upload root only. */
async function resolveStrictExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = await resolveStrictExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			});
			if (uploadPathsResult.ok) {
				paths.push(uploadPathsResult.paths[0] ?? requestedPath);
				continue;
			}
		}
		const inboundPathsResult = await resolveDirectInboundMediaPath({
			inboundMediaDir,
			requestedPath: managedMediaPathResult?.path ?? requestedPath,
			strict: true
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
//#endregion
//#region extensions/browser/src/browser/config.ts
/**
* Browser config resolution.
*
* Normalizes raw browser config into resolved runtime defaults, profile
* records, SSRF policy, timeouts, headless mode, and managed Chrome settings.
*/
const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
const MAX_BROWSER_STARTUP_TIMEOUT_MS = 12e4;
/** Environment variable that overrides managed Chrome headless mode. */
const OPENCLAW_BROWSER_HEADLESS_ENV = "OPENCLAW_BROWSER_HEADLESS";
function normalizeHexColor(raw) {
	const value = (raw ?? "").trim();
	if (!value) return DEFAULT_OPENCLAW_BROWSER_COLOR;
	const normalized = value.startsWith("#") ? value : `#${value}`;
	if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return DEFAULT_OPENCLAW_BROWSER_COLOR;
	return normalized.toUpperCase();
}
function normalizeTimeoutMs(raw, fallback) {
	const value = typeof raw === "number" && Number.isFinite(raw) ? Math.floor(raw) : fallback;
	return value < 0 ? fallback : value;
}
function normalizeStartupTimeoutMs(raw, fallback) {
	const value = typeof raw === "number" && Number.isFinite(raw) ? Math.floor(raw) : fallback;
	if (value <= 0) return fallback;
	return Math.min(value, MAX_BROWSER_STARTUP_TIMEOUT_MS);
}
function normalizeNonNegativeInteger(raw, fallback) {
	const value = typeof raw === "number" && Number.isFinite(raw) ? Math.floor(raw) : fallback;
	return value < 0 ? fallback : value;
}
function normalizePositiveInteger(raw, fallback) {
	const value = typeof raw === "number" && Number.isFinite(raw) ? Math.floor(raw) : fallback;
	return value <= 0 ? fallback : value;
}
const MAX_BROWSER_TIMER_MINUTES = Math.floor(MAX_TIMER_TIMEOUT_MS / 6e4);
function normalizeNonNegativeTimerMinutes(raw, fallback) {
	return Math.min(normalizeNonNegativeInteger(raw, fallback), MAX_BROWSER_TIMER_MINUTES);
}
function normalizePositiveTimerMinutes(raw, fallback) {
	return Math.min(normalizePositiveInteger(raw, fallback), MAX_BROWSER_TIMER_MINUTES);
}
function normalizeExecutablePath(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	if (!/^~(?=$|[\\/])/.test(value)) return value;
	return path.resolve(value.replace(/^~(?=$|[\\/])/, os.homedir()));
}
function normalizeExistingSessionCdpUrl(raw, profileName) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`browser.profiles.${profileName}.cdpUrl must be a valid URL.`);
	}
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(parsed.protocol)) throw new Error(`browser.profiles.${profileName}.cdpUrl must use http, https, ws, or wss.`);
	return {
		cdpUrl: parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString().replace(/\/$/, "") : parsed.toString(),
		cdpHost: parsed.hostname,
		cdpIsLoopback: isLoopbackHost(parsed.hostname)
	};
}
function hasLinuxDisplay(env) {
	return Boolean(env.DISPLAY?.trim() || env.WAYLAND_DISPLAY?.trim());
}
function isLocalManagedProfile(profile) {
	return profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly;
}
function resolveBrowserTabCleanupConfig(cfg) {
	const raw = cfg?.tabCleanup;
	return {
		enabled: raw?.enabled ?? true,
		idleMinutes: normalizeNonNegativeTimerMinutes(raw?.idleMinutes, 120),
		maxTabsPerSession: normalizeNonNegativeInteger(raw?.maxTabsPerSession, 8),
		sweepMinutes: normalizePositiveTimerMinutes(raw?.sweepMinutes, 5)
	};
}
function resolveCdpPortRangeStart(rawStart, fallbackStart, rangeSpan) {
	const start = typeof rawStart === "number" && Number.isFinite(rawStart) ? Math.floor(rawStart) : fallbackStart;
	if (start < 1 || start > 65535) throw new Error(`browser.cdpPortRangeStart must be between 1 and 65535, got: ${start}`);
	const maxStart = 65535 - rangeSpan;
	if (start > maxStart) throw new Error(`browser.cdpPortRangeStart (${start}) is too high for a ${rangeSpan + 1}-port range; max is ${maxStart}.`);
	return start;
}
const normalizeStringList = normalizeOptionalTrimmedStringList;
function resolveBrowserSsrFPolicy(cfg) {
	const rawPolicy = cfg?.ssrfPolicy;
	const allowPrivateNetwork = rawPolicy?.allowPrivateNetwork;
	const dangerouslyAllowPrivateNetwork = rawPolicy?.dangerouslyAllowPrivateNetwork;
	const allowedHostnames = normalizeStringList(rawPolicy?.allowedHostnames);
	const hostnameAllowlist = normalizeStringList(rawPolicy?.hostnameAllowlist);
	const hasExplicitPrivateSetting = allowPrivateNetwork !== void 0 || dangerouslyAllowPrivateNetwork !== void 0;
	const resolvedAllowPrivateNetwork = dangerouslyAllowPrivateNetwork === true || allowPrivateNetwork === true;
	if (!resolvedAllowPrivateNetwork && !hasExplicitPrivateSetting && !allowedHostnames && !hostnameAllowlist) return {};
	return {
		...resolvedAllowPrivateNetwork || dangerouslyAllowPrivateNetwork === false || allowPrivateNetwork === false ? { dangerouslyAllowPrivateNetwork: resolvedAllowPrivateNetwork } : {},
		...allowedHostnames ? { allowedHostnames } : {},
		...hostnameAllowlist ? { hostnameAllowlist } : {}
	};
}
function ensureDefaultProfile(profiles, defaultColor, legacyCdpPort, derivedDefaultCdpPort, legacyCdpUrl) {
	const result = { ...profiles };
	if (!result["openclaw"]) result[DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME] = {
		cdpPort: legacyCdpPort ?? derivedDefaultCdpPort ?? DEFAULT_BROWSER_CDP_PORT_RANGE_START,
		color: defaultColor,
		...legacyCdpUrl ? { cdpUrl: legacyCdpUrl } : {}
	};
	return result;
}
function ensureDefaultUserBrowserProfile(profiles) {
	const result = { ...profiles };
	if (result.user) return result;
	result.user = {
		driver: "existing-session",
		attachOnly: true,
		color: "#00AA00"
	};
	return result;
}
function applyLegacyCdpUrlToExistingSessionDefaultProfile(profiles, defaultProfile, legacyCdpUrl) {
	if (!legacyCdpUrl) return profiles;
	const profile = profiles[defaultProfile];
	if (!profile || profile.driver !== "existing-session" || normalizeOptionalString(profile.cdpUrl)) return profiles;
	return {
		...profiles,
		[defaultProfile]: {
			...profile,
			cdpUrl: legacyCdpUrl
		}
	};
}
/** Resolve raw browser config into runtime browser defaults. */
function resolveBrowserConfig(cfg, rootConfig) {
	const enabled = cfg?.enabled ?? true;
	const evaluateEnabled = cfg?.evaluateEnabled ?? true;
	const controlPort = deriveDefaultBrowserControlPort(resolveGatewayPort(rootConfig) ?? 18791);
	const defaultColor = normalizeHexColor(cfg?.color);
	const remoteCdpTimeoutMs = normalizeTimeoutMs(cfg?.remoteCdpTimeoutMs, 1500);
	const remoteCdpHandshakeTimeoutMs = normalizeTimeoutMs(cfg?.remoteCdpHandshakeTimeoutMs, Math.max(2e3, remoteCdpTimeoutMs * 2));
	const localLaunchTimeoutMs = normalizeStartupTimeoutMs(cfg?.localLaunchTimeoutMs, DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS);
	const localCdpReadyTimeoutMs = normalizeStartupTimeoutMs(cfg?.localCdpReadyTimeoutMs, DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS);
	const actionTimeoutMs = normalizeTimeoutMs(cfg?.actionTimeoutMs, DEFAULT_BROWSER_ACTION_TIMEOUT_MS);
	const derivedCdpRange = deriveDefaultBrowserCdpPortRange(controlPort);
	const cdpRangeSpan = derivedCdpRange.end - derivedCdpRange.start;
	const cdpPortRangeStart = resolveCdpPortRangeStart(cfg?.cdpPortRangeStart, derivedCdpRange.start, cdpRangeSpan);
	const cdpPortRangeEnd = cdpPortRangeStart + cdpRangeSpan;
	const rawCdpUrl = (cfg?.cdpUrl ?? "").trim();
	let cdpInfo;
	if (rawCdpUrl) cdpInfo = parseBrowserHttpUrl(rawCdpUrl, "browser.cdpUrl");
	else {
		const derivedPort = controlPort + 1;
		if (derivedPort > 65535) throw new Error(`Derived CDP port (${derivedPort}) is too high; check gateway port configuration.`);
		const derived = new URL(`http://127.0.0.1:${derivedPort}`);
		cdpInfo = {
			parsed: derived,
			port: derivedPort,
			normalized: derived.toString().replace(/\/$/, "")
		};
	}
	const headless = cfg?.headless === true;
	const headlessSource = typeof cfg?.headless === "boolean" ? "config" : "default";
	const noSandbox = cfg?.noSandbox === true;
	const attachOnly = cfg?.attachOnly === true;
	const executablePath = normalizeExecutablePath(cfg?.executablePath);
	const defaultProfileFromConfig = normalizeOptionalString(cfg?.defaultProfile);
	const legacyCdpPort = rawCdpUrl ? cdpInfo.port : void 0;
	const isWsUrl = cdpInfo.parsed.protocol === "ws:" || cdpInfo.parsed.protocol === "wss:";
	const legacyCdpUrl = rawCdpUrl && isWsUrl ? cdpInfo.normalized : void 0;
	let profiles = ensureDefaultUserBrowserProfile(ensureDefaultProfile(cfg?.profiles, defaultColor, legacyCdpPort, cdpPortRangeStart, legacyCdpUrl));
	const cdpProtocol = cdpInfo.parsed.protocol === "https:" ? "https" : "http";
	const defaultProfile = defaultProfileFromConfig ?? (profiles["openclaw"] ? "openclaw" : profiles["openclaw"] ? "openclaw" : "user");
	profiles = applyLegacyCdpUrlToExistingSessionDefaultProfile(profiles, defaultProfile, rawCdpUrl ? cdpInfo.normalized : void 0);
	const extraArgs = Array.isArray(cfg?.extraArgs) ? cfg.extraArgs.filter((value) => typeof value === "string" && value.trim().length > 0) : [];
	return {
		enabled,
		evaluateEnabled,
		controlPort,
		cdpPortRangeStart,
		cdpPortRangeEnd,
		cdpProtocol,
		cdpHost: cdpInfo.parsed.hostname,
		cdpIsLoopback: isLoopbackHost(cdpInfo.parsed.hostname),
		remoteCdpTimeoutMs,
		remoteCdpHandshakeTimeoutMs,
		localLaunchTimeoutMs,
		localCdpReadyTimeoutMs,
		actionTimeoutMs,
		color: defaultColor,
		executablePath,
		headless,
		headlessSource,
		noSandbox,
		attachOnly,
		defaultProfile,
		profiles,
		tabCleanup: resolveBrowserTabCleanupConfig(cfg),
		ssrfPolicy: resolveBrowserSsrFPolicy(cfg),
		extraArgs
	};
}
/** Resolve one configured browser profile by name. */
function resolveProfile(resolved, profileName) {
	const profile = resolved.profiles[profileName];
	if (!profile) return null;
	const rawProfileUrl = profile.cdpUrl?.trim() ?? "";
	let cdpHost = resolved.cdpHost;
	let cdpPort = profile.cdpPort ?? 0;
	let cdpUrl;
	const driver = profile.driver === "existing-session" ? "existing-session" : "openclaw";
	const headless = profile.headless ?? resolved.headless;
	const headlessSource = typeof profile.headless === "boolean" ? "profile" : resolved.headlessSource;
	const executablePath = normalizeExecutablePath(profile.executablePath) ?? resolved.executablePath;
	if (driver === "existing-session") {
		const existingSessionCdp = normalizeExistingSessionCdpUrl(rawProfileUrl, profileName);
		return {
			name: profileName,
			cdpPort: 0,
			cdpUrl: existingSessionCdp?.cdpUrl ?? "",
			cdpHost: existingSessionCdp?.cdpHost ?? "",
			cdpIsLoopback: existingSessionCdp?.cdpIsLoopback ?? true,
			userDataDir: resolveUserPath(profile.userDataDir?.trim() || "") || void 0,
			mcpCommand: normalizeOptionalString(profile.mcpCommand),
			mcpArgs: normalizeStringList(profile.mcpArgs) ?? void 0,
			color: profile.color,
			driver,
			executablePath,
			headless,
			headlessSource,
			attachOnly: true
		};
	}
	if (rawProfileUrl !== "" && cdpPort > 0 && /^wss?:\/\//i.test(rawProfileUrl) && /\/devtools\/browser\//i.test(rawProfileUrl)) {
		cdpHost = new URL(rawProfileUrl).hostname;
		cdpUrl = `${resolved.cdpProtocol}://${cdpHost}:${cdpPort}`;
	} else if (rawProfileUrl) {
		const parsed = parseBrowserHttpUrl(rawProfileUrl, `browser.profiles.${profileName}.cdpUrl`);
		cdpHost = parsed.parsed.hostname;
		if (parsed.hasExplicitPort) {
			cdpPort = parsed.port;
			cdpUrl = parsed.normalizedWithPort;
		} else if (cdpPort) {
			const rebuilt = new URL(rawProfileUrl);
			rebuilt.port = String(cdpPort);
			cdpUrl = rebuilt.toString().replace(/\/$/, "");
		} else {
			cdpPort = parsed.port;
			cdpUrl = parsed.normalized;
		}
	} else if (cdpPort) cdpUrl = `${resolved.cdpProtocol}://${resolved.cdpHost}:${cdpPort}`;
	else throw new Error(`Profile "${profileName}" must define cdpPort or cdpUrl.`);
	return {
		name: profileName,
		cdpPort,
		cdpUrl,
		cdpHost,
		cdpIsLoopback: isLoopbackHost(cdpHost),
		color: profile.color,
		driver,
		executablePath,
		headless,
		headlessSource,
		attachOnly: profile.attachOnly ?? resolved.attachOnly
	};
}
/** Resolve effective headless mode for a managed browser profile. */
function resolveManagedBrowserHeadlessMode(resolved, profile, params = {}) {
	if (!isLocalManagedProfile(profile)) return {
		headless: profile.headless,
		source: profile.headlessSource ?? "default"
	};
	if (typeof params.headlessOverride === "boolean") return {
		headless: params.headlessOverride,
		source: "request"
	};
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const envHeadless = parseBooleanValue(env[OPENCLAW_BROWSER_HEADLESS_ENV]);
	if (envHeadless !== void 0) return {
		headless: envHeadless,
		source: "env"
	};
	const profileHeadlessSource = profile.headlessSource ?? "default";
	if (profileHeadlessSource !== "default") return {
		headless: profile.headless,
		source: profileHeadlessSource
	};
	if (platform === "linux" && !hasLinuxDisplay(env)) return {
		headless: true,
		source: "linux-display-fallback"
	};
	return {
		headless: resolved.headless,
		source: "default"
	};
}
/** Return a Linux display error for headed managed Chrome when no display exists. */
function getManagedBrowserMissingDisplayError(resolved, profile, params = {}) {
	if (!isLocalManagedProfile(profile)) return null;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	if (platform !== "linux" || hasLinuxDisplay(env)) return null;
	const mode = resolveManagedBrowserHeadlessMode(resolved, profile, {
		env,
		platform
	});
	if (mode.headless) return null;
	const sourceHint = mode.source === "request" ? "request override" : mode.source === "env" ? `${OPENCLAW_BROWSER_HEADLESS_ENV}=0` : mode.source === "profile" ? `browser.profiles.${profile.name}.headless=false` : "browser.headless=false";
	return `Headed browser start requested for profile "${profile.name}" via ${sourceHint}, but no Linux display server was detected (\$DISPLAY/\$WAYLAND_DISPLAY unset). Set ${OPENCLAW_BROWSER_HEADLESS_ENV}=1, remove the headed override, or launch under Xvfb.`;
}
//#endregion
export { DEFAULT_DOWNLOAD_DIR as a, resolveExistingUploadPaths as c, parseBooleanValue as d, resolveProfile as i, resolveStrictExistingUploadPaths as l, resolveBrowserConfig as n, DEFAULT_TRACE_DIR as o, resolveManagedBrowserHeadlessMode as r, DEFAULT_UPLOAD_DIR as s, getManagedBrowserMissingDisplayError as t, deriveDefaultBrowserCdpPortRange as u };

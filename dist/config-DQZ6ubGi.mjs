import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { d as mergeSsrFPolicies } from "./ssrf-v45DW-yR.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./ssrf-policy-CWFvb6PK.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./gateway-config-runtime-CFClkPZC.mjs";
import { t as parseBrowserHttpUrl } from "./browser-cdp-DgJ98Oxl.mjs";
import { c as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS, f as DEFAULT_OPENCLAW_BROWSER_COLOR, i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, l as DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS, m as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME } from "./constants-C-i9f6FL.mjs";
import { n as normalizeChromeMcpOptions } from "./chrome-mcp-options-BBANJrqD.mjs";
import { n as resolveBrowserEngine } from "./registry-PTTKe2-a.mjs";
import path from "node:path";
import os from "node:os";
//#region extensions/browser/src/config/port-defaults.ts
const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN = 99;
const DEFAULT_BROWSER_CONTROL_PORT = 18791;
function derivePort(base, offset, fallback) {
	const port = base + offset;
	return Number.isFinite(port) && port > 0 && port <= 65535 ? port : fallback;
}
function deriveDefaultBrowserControlPort(gatewayPort) {
	return derivePort(gatewayPort, 2, DEFAULT_BROWSER_CONTROL_PORT);
}
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
	const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START);
	const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
	if (end <= 65535) return {
		start,
		end
	};
	return {
		start: DEFAULT_BROWSER_CDP_PORT_RANGE_START,
		end: DEFAULT_BROWSER_CDP_PORT_RANGE_END
	};
}
//#endregion
//#region extensions/browser/src/browser/config.ts
/** Read a named browser profile without falling through to inherited object keys. */
function getOwnBrowserProfile(profiles, name) {
	return profiles && Object.hasOwn(profiles, name) ? profiles[name] : void 0;
}
const DEFAULT_BROWSER_REMOTE_CDP_TIMEOUT_MS = 1500;
const DEFAULT_BROWSER_REMOTE_CDP_HANDSHAKE_TIMEOUT_MS = 3e3;
const EXTENSION_RELAY_PORT_OFFSET = 8;
/** Username half of the process-only internal relay credential. */
const EXTENSION_RELAY_CDP_USER = "openclaw-internal";
const BROWSER_HEADLESS_ENV_KEY = "OPENCLAW_BROWSER_HEADLESS";
function normalizeExecutablePath(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	if (!/^~(?=$|[\\/])/.test(value)) return value;
	return path.resolve(value.replace(/^~(?=$|[\\/])/, () => os.homedir()));
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
	return resolveBrowserEngine(profile.engine).descriptor.launchMode !== "attach-only" && profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly;
}
function resolveBrowserTabCleanupConfig(cfg) {
	return {
		enabled: (cfg?.tabCleanup)?.enabled ?? true,
		idleMinutes: 120,
		maxTabsPerSession: 8,
		sweepMinutes: 5
	};
}
function resolveBrowserSsrFPolicy(cfg) {
	const rawPolicy = cfg?.ssrfPolicy;
	const dangerouslyAllowPrivateNetwork = rawPolicy?.dangerouslyAllowPrivateNetwork;
	const resolved = mergeSsrFPolicies({
		...rawPolicy,
		allowPrivateNetwork: false,
		allowedHostnames: normalizeOptionalTrimmedStringList(rawPolicy?.allowedHostnames)
	});
	if (dangerouslyAllowPrivateNetwork !== void 0) return {
		...resolved,
		dangerouslyAllowPrivateNetwork
	};
	return resolved ?? {};
}
/**
* Assign a distinct loopback relay port to each extension-driver profile that
* does not pin its own cdpPort. Ports count down from the default (controlPort+8)
* — below the managed CDP allocation band (controlPort+9..) — so extension
* relays and managed Chrome never contend, and two extension profiles never
* share one port. Deterministic (sorted names) so restarts keep the same URLs.
*/
function resolveExtensionRelayPorts(profiles, defaultPort) {
	const names = Object.entries(profiles).filter(([, profile]) => profile.driver === "extension" && profile.cdpPort == null).map(([name]) => name).toSorted();
	const reservedPorts = new Set(Object.values(profiles).map((profile) => profile.cdpPort).filter((port) => typeof port === "number"));
	const ports = {};
	const minimumPort = defaultPort - EXTENSION_RELAY_PORT_OFFSET;
	let nextPort = defaultPort;
	for (const name of names) {
		while (nextPort > minimumPort && reservedPorts.has(nextPort)) nextPort -= 1;
		if (nextPort <= minimumPort) throw new Error("No available extension relay ports in the reserved browser relay port range");
		ports[name] = nextPort;
		reservedPorts.add(nextPort);
		nextPort -= 1;
	}
	return ports;
}
function assertDedicatedEngineEndpoints(profiles) {
	const endpoints = /* @__PURE__ */ new Map();
	for (const [name, profile] of Object.entries(profiles)) {
		const endpoint = profile.cdpUrl ? URL.parse(profile.cdpUrl) : null;
		if (!endpoint) continue;
		const key = endpoint.toString().replace(/\/$/, "");
		const previous = endpoints.get(key);
		const adapter = resolveBrowserEngine(profile.engine);
		const dedicated = adapter.requiresDedicatedEndpoint ? adapter : previous && resolveBrowserEngine(previous.engine);
		if (previous && dedicated?.requiresDedicatedEndpoint) throw new Error(`${dedicated.descriptor.label} requires a dedicated CDP endpoint; profiles "${previous.name}" and "${name}" share one.`);
		endpoints.set(key, {
			name,
			engine: profile.engine
		});
	}
}
function resolveBrowserConfig(cfg, rootConfig) {
	const controlPort = deriveDefaultBrowserControlPort(resolveGatewayPort(rootConfig) ?? 18791);
	const derivedCdpRange = deriveDefaultBrowserCdpPortRange(controlPort);
	const rawCdpUrl = (cfg?.cdpUrl ?? "").trim();
	const derivedPort = controlPort + 1;
	if (!rawCdpUrl && derivedPort > 65535) throw new Error(`Derived CDP port (${derivedPort}) is too high; check gateway port configuration.`);
	const cdpInfo = parseBrowserHttpUrl(rawCdpUrl || `http://127.0.0.1:${derivedPort}`, "browser.cdpUrl");
	const executablePath = normalizeExecutablePath(cfg?.executablePath);
	const defaultProfile = normalizeOptionalString(cfg?.defaultProfile) ?? "openclaw";
	const isWsUrl = cdpInfo.parsed.protocol === "ws:" || cdpInfo.parsed.protocol === "wss:";
	const profiles = { ...cfg?.profiles };
	profiles[DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME] ||= {
		cdpPort: rawCdpUrl ? cdpInfo.port : derivedCdpRange.start,
		...rawCdpUrl && isWsUrl ? { cdpUrl: cdpInfo.normalized } : {}
	};
	profiles.user ||= {
		driver: "existing-session",
		attachOnly: true
	};
	profiles.chrome ||= { driver: "extension" };
	const selectedProfile = getOwnBrowserProfile(profiles, defaultProfile);
	if (rawCdpUrl && selectedProfile?.driver === "existing-session" && !normalizeOptionalString(selectedProfile.cdpUrl)) profiles[defaultProfile] = {
		...selectedProfile,
		cdpUrl: cdpInfo.normalized
	};
	const extraArgs = Array.isArray(cfg?.extraArgs) ? cfg.extraArgs.filter((value) => typeof value === "string" && value.trim().length > 0) : [];
	assertDedicatedEngineEndpoints(profiles);
	return {
		enabled: cfg?.enabled ?? true,
		evaluateEnabled: cfg?.evaluateEnabled ?? true,
		controlPort,
		cdpPortRangeStart: derivedCdpRange.start,
		cdpPortRangeEnd: derivedCdpRange.end,
		cdpProtocol: cdpInfo.parsed.protocol === "https:" ? "https" : "http",
		cdpHost: cdpInfo.parsed.hostname,
		cdpIsLoopback: isLoopbackHost(cdpInfo.parsed.hostname),
		remoteCdpTimeoutMs: DEFAULT_BROWSER_REMOTE_CDP_TIMEOUT_MS,
		remoteCdpHandshakeTimeoutMs: DEFAULT_BROWSER_REMOTE_CDP_HANDSHAKE_TIMEOUT_MS,
		localLaunchTimeoutMs: DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS,
		localCdpReadyTimeoutMs: DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS,
		actionTimeoutMs: DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		executablePath,
		headless: cfg?.headless === true,
		headlessSource: typeof cfg?.headless === "boolean" ? "config" : "default",
		noSandbox: cfg?.noSandbox === true,
		attachOnly: cfg?.attachOnly === true,
		defaultProfile,
		profiles,
		tabCleanup: resolveBrowserTabCleanupConfig(cfg),
		ssrfPolicy: resolveBrowserSsrFPolicy(cfg),
		extraArgs,
		extensionRelayDefaultPort: controlPort + EXTENSION_RELAY_PORT_OFFSET,
		extensionRelayPorts: resolveExtensionRelayPorts(profiles, controlPort + EXTENSION_RELAY_PORT_OFFSET),
		extensionRelay: { allowLegacyAuth: cfg?.extensionRelay?.allowLegacyAuth ?? true },
		extensionRelayInternalTokens: {}
	};
}
/** Selector-free extension pairing follows configuration order, independently of defaultProfile. */
function resolveFirstExtensionProfileName(resolved) {
	return Object.entries(resolved.profiles).find(([, profile]) => profile.driver === "extension")?.[0];
}
function resolveProfile(resolved, profileName) {
	const profile = getOwnBrowserProfile(resolved.profiles, profileName);
	if (!profile) return null;
	const adapter = resolveBrowserEngine(profile.engine);
	const engine = adapter.descriptor.id;
	if (adapter.resolveExternalProfile) return adapter.resolveExternalProfile(profileName, profile);
	const rawProfileUrl = profile.cdpUrl?.trim() ?? "";
	let cdpHost = resolved.cdpHost;
	let cdpPort = profile.cdpPort ?? 0;
	let cdpUrl;
	const driver = profile.driver === "existing-session" || profile.driver === "extension" ? profile.driver : "openclaw";
	const headless = profile.headless ?? resolved.headless;
	const headlessSource = typeof profile.headless === "boolean" ? "profile" : resolved.headlessSource;
	const executablePath = normalizeExecutablePath(profile.executablePath) ?? resolved.executablePath;
	const common = {
		name: profileName,
		engine,
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		driver,
		executablePath
	};
	if (driver === "extension") {
		const relayPort = profile.cdpPort ?? resolved.extensionRelayPorts[profileName] ?? resolved.extensionRelayDefaultPort;
		const token = resolved.extensionRelayInternalTokens[profileName];
		const relayCdpUrl = token ? `http://${EXTENSION_RELAY_CDP_USER}:${encodeURIComponent(token)}@127.0.0.1:${relayPort}` : `http://127.0.0.1:${relayPort}`;
		return {
			...common,
			cdpPort: relayPort,
			cdpUrl: relayCdpUrl,
			cdpHost: "127.0.0.1",
			cdpIsLoopback: true,
			headless: false,
			headlessSource: "default",
			attachOnly: true
		};
	}
	if (driver === "existing-session") {
		const mcpArgs = normalizeOptionalTrimmedStringList(profile.mcpArgs) ?? void 0;
		const existingSessionCdp = normalizeExistingSessionCdpUrl(normalizeChromeMcpOptions({
			...profile,
			mcpArgs
		}).browserUrl, profileName);
		return {
			...common,
			cdpPort: 0,
			cdpUrl: existingSessionCdp?.cdpUrl ?? "",
			cdpHost: existingSessionCdp?.cdpHost ?? "",
			cdpIsLoopback: existingSessionCdp?.cdpIsLoopback ?? true,
			userDataDir: resolveUserPath(profile.userDataDir?.trim() || "") || void 0,
			mcpCommand: normalizeOptionalString(profile.mcpCommand),
			mcpArgs,
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
		...common,
		cdpPort,
		cdpUrl,
		cdpHost,
		cdpIsLoopback: isLoopbackHost(cdpHost),
		headless,
		headlessSource,
		attachOnly: profile.attachOnly ?? resolved.attachOnly
	};
}
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
	const envHeadless = parseBooleanValue(env[BROWSER_HEADLESS_ENV_KEY]);
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
function getManagedBrowserMissingDisplayError(resolved, profile, params = {}) {
	if (!isLocalManagedProfile(profile)) return null;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	if (platform !== "linux" || hasLinuxDisplay(env)) return null;
	const mode = resolveManagedBrowserHeadlessMode(resolved, profile, {
		...params,
		env,
		platform
	});
	if (mode.headless || mode.source === "linux-display-fallback") return null;
	const sourceHint = mode.source === "request" ? "request override" : mode.source === "env" ? `${BROWSER_HEADLESS_ENV_KEY}=0` : mode.source === "profile" ? `browser.profiles.${profile.name}.headless=false` : "browser.headless=false";
	return {
		message: `Headed browser start requested for profile "${profile.name}" via ${sourceHint}, but no Linux display server was detected (\$DISPLAY/\$WAYLAND_DISPLAY unset). Set ${BROWSER_HEADLESS_ENV_KEY}=1, remove the headed override, or launch under Xvfb.`,
		headlessSource: mode.source
	};
}
//#endregion
export { resolveFirstExtensionProfileName as a, resolveBrowserConfig as i, getOwnBrowserProfile as n, resolveManagedBrowserHeadlessMode as o, isLocalManagedProfile as r, resolveProfile as s, getManagedBrowserMissingDisplayError as t };

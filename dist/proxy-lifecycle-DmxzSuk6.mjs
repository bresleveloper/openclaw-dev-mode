import { f as isLoopbackIpAddress } from "./ip-jvtZlu_y.mjs";
import { i as isWebSocketUrl, n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { i as logWarn, r as logInfo } from "./logger-DskmrSVa.mjs";
import { a as stopActiveManagedProxyRegistration, i as registerActiveManagedProxyUrl, r as getActiveManagedProxyUrl, t as getActiveManagedProxyLoopbackMode } from "./active-proxy-state-fUgx64cL.mjs";
import { a as resolveManagedProxyCaFileForUrl, i as loadManagedProxyTlsOptionsSync, r as loadManagedProxyTlsOptions } from "./managed-proxy-undici-Dp2zTdjV.mjs";
import { a as forceResetGlobalDispatcher } from "./undici-global-dispatcher-DH6sagj7.mjs";
import { t as loadProxyline } from "./proxyline-runtime-Df2Nb5Zp.mjs";
//#region src/infra/net/proxy/proxy-lifecycle.ts
const PROXY_ENV_KEYS = [
	"http_proxy",
	"https_proxy",
	"HTTP_PROXY",
	"HTTPS_PROXY"
];
const NO_PROXY_ENV_KEYS = ["no_proxy", "NO_PROXY"];
const LOOPBACK_NO_PROXY = "127.0.0.1,localhost,localhost.,::1,[::1],127.0.0.0/8";
const managedLoopbackBypassPolicy = ({ url }) => getActiveManagedProxyLoopbackMode() === "gateway-only" && isLoopbackProxyUrl(url);
const PROXY_ACTIVE_KEYS = [
	"OPENCLAW_PROXY_ACTIVE",
	"OPENCLAW_PROXY_LOOPBACK_MODE",
	"OPENCLAW_PROXY_CA_FILE"
];
const ALL_PROXY_ENV_KEYS = [
	...PROXY_ENV_KEYS,
	...NO_PROXY_ENV_KEYS,
	...PROXY_ACTIVE_KEYS
];
let baseProxyEnvSnapshot = null;
let proxylineHandle = null;
const MANAGED_PROXY_UNDICI_OPTIONS = Object.freeze({ allowH2: false });
function captureProxyEnv() {
	return {
		http_proxy: process.env["http_proxy"],
		https_proxy: process.env["https_proxy"],
		HTTP_PROXY: process.env["HTTP_PROXY"],
		HTTPS_PROXY: process.env["HTTPS_PROXY"],
		no_proxy: process.env["no_proxy"],
		NO_PROXY: process.env["NO_PROXY"],
		OPENCLAW_PROXY_ACTIVE: process.env["OPENCLAW_PROXY_ACTIVE"],
		OPENCLAW_PROXY_LOOPBACK_MODE: process.env["OPENCLAW_PROXY_LOOPBACK_MODE"],
		OPENCLAW_PROXY_CA_FILE: process.env["OPENCLAW_PROXY_CA_FILE"]
	};
}
function applyProxyEnv(proxyUrl, loopbackMode, proxyCaFile) {
	for (const key of PROXY_ENV_KEYS) process.env[key] = proxyUrl;
	process.env["OPENCLAW_PROXY_ACTIVE"] = "1";
	process.env["OPENCLAW_PROXY_LOOPBACK_MODE"] = loopbackMode;
	if (proxyCaFile) process.env["OPENCLAW_PROXY_CA_FILE"] = proxyCaFile;
	else delete process.env["OPENCLAW_PROXY_CA_FILE"];
	for (const key of NO_PROXY_ENV_KEYS) process.env[key] = loopbackMode === "gateway-only" ? LOOPBACK_NO_PROXY : "";
}
function restoreProxyEnv(snapshot) {
	for (const key of ALL_PROXY_ENV_KEYS) {
		const value = snapshot[key];
		if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
}
function restoreInactiveProxyRuntime(snapshot) {
	try {
		proxylineHandle?.stop();
	} catch (err) {
		logWarn(`proxy: failed to stop Proxyline: ${String(err)}`);
	}
	proxylineHandle = null;
	restoreProxyEnv(snapshot);
	forceResetGlobalDispatcher();
	ensureInheritedManagedProxyRoutingActive();
}
function stopActiveProxyRegistration(registration) {
	if (registration.stopped) return;
	stopActiveManagedProxyRegistration(registration);
	if (getActiveManagedProxyUrl()) return;
	const restoreSnapshot = baseProxyEnvSnapshot ?? captureProxyEnv();
	baseProxyEnvSnapshot = null;
	restoreInactiveProxyRuntime(restoreSnapshot);
}
function createProxyHandle(proxyUrl, registration) {
	return {
		proxyUrl,
		stop: async () => stopActiveProxyRegistration(registration),
		kill: () => stopActiveProxyRegistration(registration)
	};
}
function resolveProxyUrl(config) {
	const candidate = config?.proxyUrl?.trim() || process.env["OPENCLAW_PROXY_URL"]?.trim();
	if (!candidate) throw new Error("proxy: enabled but no HTTP proxy URL is configured; set proxy.proxyUrl or OPENCLAW_PROXY_URL to an http:// or https:// forward proxy.");
	if (!isHttpUrl(candidate)) throw new Error("proxy: enabled but proxy URL is invalid; set proxy.proxyUrl or OPENCLAW_PROXY_URL to an http:// or https:// forward proxy.");
	return candidate;
}
function redactProxyUrlForLog(value) {
	try {
		return new URL(value).origin;
	} catch {
		return "<invalid proxy URL>";
	}
}
/** Reinstalls Proxyline routing in child processes that inherited active proxy env. */
function ensureInheritedManagedProxyRoutingActive() {
	if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
	const proxyUrl = process.env["HTTP_PROXY"];
	if (!proxyUrl || !isHttpUrl(proxyUrl)) return;
	const proxyCaFile = resolveManagedProxyCaFileForUrl({
		proxyUrl,
		caFileOverride: process.env["OPENCLAW_PROXY_CA_FILE"]
	});
	const proxyTls = loadManagedProxyTlsOptionsSync(proxyCaFile);
	applyProxyEnv(proxyUrl, getActiveManagedProxyLoopbackMode() ?? "gateway-only", proxyCaFile);
	proxylineHandle = loadProxyline().installGlobalProxy({
		mode: "managed",
		proxyUrl,
		...proxyTls ? { proxyTls } : {},
		ifActive: "reuse-compatible",
		bypassPolicy: managedLoopbackBypassPolicy,
		undici: MANAGED_PROXY_UNDICI_OPTIONS
	});
	forceResetGlobalDispatcher({ preserveProxylineManaged: true });
}
/** Starts process-wide managed proxy routing and returns the owner stop handle. */
async function startProxy(config) {
	if (config?.enabled === false || !config?.proxyUrl?.trim() && !process.env["OPENCLAW_PROXY_URL"]?.trim()) return null;
	const proxyUrl = resolveProxyUrl(config);
	const loopbackMode = config?.loopbackMode ?? "gateway-only";
	const proxyCaFile = resolveManagedProxyCaFileForUrl({
		proxyUrl,
		config
	});
	const proxyTls = await loadManagedProxyTlsOptions(proxyCaFile);
	if (getActiveManagedProxyUrl()) return createProxyHandle(proxyUrl, registerActiveManagedProxyUrl(new URL(proxyUrl), {
		loopbackMode,
		proxyTls
	}));
	baseProxyEnvSnapshot ??= captureProxyEnv();
	const lifecycleBaseEnvSnapshot = baseProxyEnvSnapshot;
	let registration = null;
	try {
		applyProxyEnv(proxyUrl, loopbackMode, proxyCaFile);
		proxylineHandle = loadProxyline().installGlobalProxy({
			mode: "managed",
			proxyUrl,
			...proxyTls ? { proxyTls } : {},
			ifActive: "replace",
			bypassPolicy: managedLoopbackBypassPolicy,
			undici: MANAGED_PROXY_UNDICI_OPTIONS
		});
		forceResetGlobalDispatcher({ preserveProxylineManaged: true });
		registration = registerActiveManagedProxyUrl(new URL(proxyUrl), {
			loopbackMode,
			proxyTls
		});
	} catch (err) {
		if (registration) stopActiveManagedProxyRegistration(registration);
		restoreInactiveProxyRuntime(lifecycleBaseEnvSnapshot);
		baseProxyEnvSnapshot = null;
		throw new Error(`proxy: failed to activate external proxy routing: ${String(err)}`, { cause: err });
	}
	logInfo(`proxy: routing process HTTP traffic through external proxy ${redactProxyUrlForLog(proxyUrl)}`);
	return createProxyHandle(proxyUrl, registration);
}
/** Stops a managed proxy handle if one was started. */
async function stopProxy(handle) {
	if (!handle) return;
	await handle.stop();
}
function isLoopbackProxyUrl(value) {
	try {
		const url = new URL(value);
		const hostname = url.hostname.toLowerCase().replace(/\.+$/, "");
		return (isHttpUrl(url) || isWebSocketUrl(url)) && (hostname === "localhost" || isLoopbackIpAddress(hostname));
	} catch {
		return false;
	}
}
function assertManagedProxyAllowsLoopback(url, surface) {
	if (isLoopbackProxyUrl(url) && getActiveManagedProxyLoopbackMode() === "block") throw new Error(`proxy: ${surface} connections are blocked by proxy.loopbackMode; run openclaw config set proxy.loopbackMode gateway-only to allow local runtime traffic.`);
}
function registerManagedProxyGatewayLoopbackBypass(url) {
	assertManagedProxyAllowsLoopback(url, "Gateway loopback control-plane");
}
function registerManagedProxyBrowserCdpBypass(url) {
	assertManagedProxyAllowsLoopback(url, "Browser loopback CDP");
}
//#endregion
export { stopProxy as a, startProxy as i, registerManagedProxyBrowserCdpBypass as n, registerManagedProxyGatewayLoopbackBypass as r, ensureInheritedManagedProxyRoutingActive as t };

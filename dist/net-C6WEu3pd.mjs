import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { _ as normalizeIpAddress, f as isLoopbackIpAddress, h as isRfc8215LocalUseNat64Ipv6Address, i as isCanonicalDottedDecimalIPv4, p as isPrivateOrLoopbackIpAddress, s as isIpInCidr } from "./ip-jvtZlu_y.mjs";
import { o as parseHostForAddressChecks } from "./client-address-utils-BafGwQBm.mjs";
import { n as pickMatchingExternalInterfaceAddress, r as safeNetworkInterfaces } from "./network-interfaces-5_nTDEn5.mjs";
import { n as pickPrimaryTailnetIPv4 } from "./tailnet-CMDED3Fa.mjs";
import { t as firstHeaderValue } from "./http-header-value-BM79-5V8.mjs";
import { t as normalizeWebSocketProtocol } from "./websocket-protocol-MDxbNIbL.mjs";
import os from "node:os";
import net from "node:net";
//#region src/gateway/net.ts
/** Pick the primary non-internal IPv4 address, preferring common LAN interface names. */
function pickPrimaryLanIPv4() {
	return pickMatchingExternalInterfaceAddress(os.networkInterfaces(), {
		family: "IPv4",
		preferredNames: ["en0", "eth0"]
	});
}
/** Normalize a raw Host header for gateway origin and local-request checks. */
function normalizeHostHeader(hostHeader) {
	return normalizeLowercaseStringOrEmpty(hostHeader);
}
/** Extract hostname from a Host header while preserving unbracketed IPv6 hosts. */
function resolveHostName(hostHeader) {
	const host = normalizeHostHeader(hostHeader);
	if (!host) return "";
	if (host.startsWith("[")) {
		const end = host.indexOf("]");
		if (end !== -1) return host.slice(1, end);
	}
	if (net.isIP(host) === 6) return host;
	const [name] = host.split(":");
	return name ?? "";
}
function isLoopbackAddress(ip) {
	return isLoopbackIpAddress(ip);
}
/** Detect forwarded/proxy headers that make loopback requests ineligible for direct-local auth. */
function hasForwardedRequestHeaders(req) {
	if (!req) return false;
	const headers = req.headers ?? {};
	return Object.keys(headers).some((header) => {
		const normalized = normalizeLowercaseStringOrEmpty(header);
		return normalized === "forwarded" || normalized === "x-real-ip" || normalized.startsWith("x-forwarded-");
	});
}
/** Return whether a request is a clean loopback request without forwarded identity headers. */
function isLocalDirectRequest(req) {
	return Boolean(req && !hasForwardedRequestHeaders(req) && isLoopbackAddress(req.socket?.remoteAddress));
}
function resolveLocalInterfaceAddressMatch(ip, snapshot) {
	const normalized = normalizeIpAddress(ip);
	if (!normalized) return false;
	const effectiveSnapshot = arguments.length >= 2 ? snapshot : safeNetworkInterfaces();
	if (!effectiveSnapshot) return;
	for (const entries of Object.values(effectiveSnapshot)) for (const entry of entries ?? []) if (normalizeIpAddress(entry.address) === normalized) return true;
	return false;
}
/**
* Returns true if the IP belongs to a private or loopback network range.
* Private ranges: RFC1918, link-local, ULA IPv6, and CGNAT (100.64/10), plus loopback.
* Excludes RFC8215 local-use NAT64: SSRF policy blocks that allocation, but
* Gateway trust decisions cannot infer a private mapped destination from it.
*/
function isPrivateOrLoopbackAddress(ip) {
	return isPrivateOrLoopbackIpAddress(ip) && !isRfc8215LocalUseNat64Ipv6Address(ip);
}
function stripOptionalPort(ip) {
	if (ip.startsWith("[")) {
		const end = ip.indexOf("]");
		if (end !== -1) return ip.slice(1, end);
	}
	if (net.isIP(ip)) return ip;
	const lastColon = ip.lastIndexOf(":");
	if (lastColon > -1 && ip.includes(".") && ip.indexOf(":") === lastColon) {
		const candidate = ip.slice(0, lastColon);
		if (net.isIP(candidate) === 4) return candidate;
	}
	return ip;
}
function parseIpLiteral(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	const stripped = stripOptionalPort(trimmed);
	const normalized = normalizeIpAddress(stripped);
	if (!normalized || net.isIP(normalized) === 0) return;
	return normalized;
}
function resolveForwardedClientIp(params) {
	const { forwardedFor, trustedProxies } = params;
	if (!trustedProxies?.length) return;
	const forwardedChain = [];
	for (const entry of forwardedFor?.split(",") ?? []) {
		const normalized = parseIpLiteral(entry);
		if (normalized) forwardedChain.push(normalized);
	}
	if (forwardedChain.length === 0) return;
	for (let index = forwardedChain.length - 1; index >= 0; index -= 1) {
		const hop = forwardedChain[index];
		if (isLoopbackAddress(hop)) continue;
		if (!isTrustedProxyAddress(hop, trustedProxies)) return hop;
	}
}
function isTrustedProxyAddress(ip, trustedProxies) {
	const normalized = normalizeIpAddress(ip);
	if (!normalized || !trustedProxies || trustedProxies.length === 0) return false;
	return trustedProxies.some((proxy) => {
		const candidate = proxy.trim();
		if (!candidate) return false;
		return isIpInCidr(normalized, candidate);
	});
}
function resolveClientIp(params) {
	const remote = normalizeIpAddress(params.remoteAddr);
	if (!remote) return;
	if (!isTrustedProxyAddress(remote, params.trustedProxies)) return remote;
	const forwardedIp = resolveForwardedClientIp({
		forwardedFor: params.forwardedFor,
		trustedProxies: params.trustedProxies
	});
	if (forwardedIp) return forwardedIp;
	if (params.allowRealIpFallback) return parseIpLiteral(params.realIp);
}
function resolveRequestClientIpFromHeaders(req, trustedProxies, allowRealIpFallback = false) {
	if (!req) return;
	return resolveClientIp({
		remoteAddr: req.socket?.remoteAddress ?? "",
		forwardedFor: firstHeaderValue(req.headers?.["x-forwarded-for"]),
		realIp: firstHeaderValue(req.headers?.["x-real-ip"]),
		trustedProxies,
		allowRealIpFallback
	});
}
/** Resolve the requested bind host; startup validates unavailable custom addresses. */
async function resolveGatewayBindHost(bind, customHost) {
	const mode = bind ?? "loopback";
	if (mode === "loopback") return "127.0.0.1";
	if (mode === "tailnet") {
		const tailnetIP = pickPrimaryTailnetIPv4();
		if (tailnetIP && await canBindToHost(tailnetIP)) return tailnetIP;
	}
	if (mode === "tailnet" || mode === "auto" && !isContainerEnvironment()) return await canBindToHost("127.0.0.1") ? "127.0.0.1" : "0.0.0.0";
	if (mode === "custom") {
		const host = customHost?.trim();
		if (host && isValidIPv4(host) && await canBindToHost(host)) return host;
	}
	return "0.0.0.0";
}
/**
* Returns the effective default bind mode when `gateway.bind` is not explicitly
* configured. Inside a detected container environment the default is `"auto"`
* (which resolves to `0.0.0.0` for port-forwarding compatibility); on bare-metal
* / VM hosts the default remains `"loopback"`.
*
* When {@link tailscaleMode} is `"serve"` or `"funnel"`, the function always
* returns `"loopback"` because Tailscale serve/funnel architecturally requires
* a loopback bind — container auto-detection must never override this.
*
* Use this only in gateway startup codepaths that execute in the same
* environment as the eventual bind decision. Host-side diagnostics should keep
* their own explicit defaults instead of inferring from the caller process.
*/
function defaultGatewayBindMode(tailscaleMode) {
	if (tailscaleMode && tailscaleMode !== "off") return "loopback";
	return isContainerEnvironment() ? "auto" : "loopback";
}
async function canBindToHost(host) {
	return new Promise((resolve) => {
		const testServer = net.createServer();
		const timeout = setTimeout(() => finish(false), 3e3);
		const finish = (canBind) => {
			clearTimeout(timeout);
			testServer.close();
			resolve(canBind);
		};
		testServer.once("error", () => finish(false));
		testServer.once("listening", () => finish(true));
		try {
			testServer.listen(0, host);
		} catch {
			finish(false);
		}
	});
}
async function resolveGatewayListenHosts(bindHost, opts) {
	const requiredHosts = resolveGatewayRequiredListenHosts(bindHost);
	if (bindHost !== "127.0.0.1") return requiredHosts;
	if (process.platform === "win32") return [bindHost];
	if (await (opts?.canBindToHost ?? canBindToHost)("::1")) return [bindHost, "::1"];
	return [bindHost];
}
/** Returns every address whose bind must succeed for Gateway startup to succeed. */
function resolveGatewayRequiredListenHosts(bindHost) {
	if (!isValidIPv4(bindHost) || bindHost === "0.0.0.0" || bindHost === "127.0.0.1") return [bindHost];
	return [bindHost, "127.0.0.1"];
}
function isValidIPv4(host) {
	return isCanonicalDottedDecimalIPv4(host);
}
/**
* Check if a hostname or IP refers to the local machine.
* Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
* Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
*/
function isLoopbackHost(host) {
	const parsed = typeof host === "string" ? parseHostForAddressChecks(host) : null;
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	return isLoopbackAddress(parsed.unbracketedHost);
}
function isLoopbackGatewayUrl(rawUrl) {
	try {
		const hostname = new URL(rawUrl).hostname.toLowerCase();
		const unbracketed = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
		return unbracketed === "localhost" || isLoopbackIpAddress(unbracketed);
	} catch {
		return false;
	}
}
/**
* Local-facing host check for inbound requests:
* - loopback hosts (localhost/127.x/::1 and mapped forms)
* - Tailscale Serve/Funnel hostnames (*.ts.net)
*/
function isLocalishHost(hostHeader) {
	const host = resolveHostName(hostHeader);
	if (!host) return false;
	return isLoopbackHost(host) || host.endsWith(".ts.net");
}
/**
* Check if a hostname or IP refers to a private or loopback address.
* Handles the same hostname formats as isLoopbackHost, but also accepts
* RFC 1918, link-local, CGNAT, and IPv6 ULA/link-local addresses.
*/
function isPrivateOrLoopbackHost(host) {
	const parsed = typeof host === "string" ? parseHostForAddressChecks(host) : null;
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const normalized = normalizeIpAddress(parsed.unbracketedHost);
	if (!normalized || !isPrivateOrLoopbackAddress(normalized)) return false;
	if (net.isIP(normalized) === 6) {
		if (normalized.startsWith("ff")) return false;
		if (normalized === "::") return false;
	}
	return true;
}
/**
* Security check for WebSocket URLs (CWE-319: Cleartext Transmission of Sensitive Information).
*
* Returns true if the URL is secure for transmitting data:
* - wss:// (TLS) is always secure
* - ws:// is secure for loopback, private IP literals, .local, and Tailnet hosts
* - optional break-glass: other private-DNS ws:// hostnames can be enabled for trusted networks
*
* All other ws:// URLs are considered insecure because both credentials
* AND chat/conversation data would be exposed to network interception.
*/
function isSecureWebSocketUrl(url, opts) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackHost(parsed.hostname)) return true;
	if (isTrustedPlaintextWebSocketHost(parsed.hostname)) return true;
	if (opts?.allowPrivateWs) {
		const hostForIpCheck = parsed.hostname.startsWith("[") && parsed.hostname.endsWith("]") ? parsed.hostname.slice(1, -1) : parsed.hostname;
		return net.isIP(hostForIpCheck) === 0;
	}
	return false;
}
function isTrustedPlaintextWebSocketHost(hostname) {
	if (isPrivateOrLoopbackHost(hostname)) return true;
	const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
//#endregion
export { resolveGatewayListenHosts as _, isLoopbackAddress as a, resolveLocalInterfaceAddressMatch as b, isPrivateOrLoopbackAddress as c, isTrustedProxyAddress as d, isValidIPv4 as f, resolveGatewayBindHost as g, resolveClientIp as h, isLocalishHost as i, isPrivateOrLoopbackHost as l, pickPrimaryLanIPv4 as m, hasForwardedRequestHeaders as n, isLoopbackGatewayUrl as o, normalizeHostHeader as p, isLocalDirectRequest as r, isLoopbackHost as s, defaultGatewayBindMode as t, isSecureWebSocketUrl as u, resolveGatewayRequiredListenHosts as v, resolveRequestClientIpFromHeaders as x, resolveHostName as y };

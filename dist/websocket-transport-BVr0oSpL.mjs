import { f as isLoopbackIpAddress } from "./ip-CDH5BTTD.mjs";
import { a as isWssUrl } from "./url-protocol-OU3K-ySz.mjs";
import { a as parseGatewayIpAddress, i as normalizeTlsFingerprint, o as parseHostForAddressChecks } from "./client-address-utils-BDJ8WbNc.mjs";
import { TLSSocket } from "node:tls";
//#region packages/gateway-client/src/websocket-transport.ts
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const PRIVATE_OR_LOOPBACK_IPV6_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"deprecatedSiteLocal"
]);
function isPrivateOrLoopbackIpAddress(address) {
	return (address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES).has(address.range());
}
function isGatewayLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	return Boolean(parsed && (parsed.isLocalhost || isLoopbackIpAddress(parsed.unbracketedHost)));
}
function isPrivateOrLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const address = parseGatewayIpAddress(parsed.unbracketedHost);
	return Boolean(address && isPrivateOrLoopbackIpAddress(address));
}
function isTrustedPlaintextWebSocketHost(hostname) {
	if (isPrivateOrLoopbackHost(hostname)) return true;
	const normalized = hostname.toLowerCase().trim().replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
	try {
		const url = new URL(rawUrl);
		const protocol = url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
		if (protocol === "wss:") return true;
		if (protocol !== "ws:") return false;
		if (isGatewayLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) return true;
		if (options?.allowPrivateWs === true) {
			const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
			return isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === void 0;
		}
		return false;
	} catch {
		return false;
	}
}
var GatewayWebSocketTransportConfigurationError = class extends Error {};
var GatewayWebSocketTlsPinError = class extends Error {};
function resolveGatewayWebSocketTransport(params) {
	const usesTls = isWssUrl(params.url);
	if (params.tlsFingerprint && !usesTls) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint requires wss:// gateway url");
	const allowPrivateWs = (params.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
	if (!isSecureWebSocketUrl(params.url, { allowPrivateWs })) {
		let displayHost = params.url;
		try {
			displayHost = new URL(params.url).hostname || params.url;
		} catch {}
		throw new GatewayWebSocketTransportConfigurationError(`SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` + (allowPrivateWs ? "" : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") + "Run `openclaw doctor --fix` for guidance.");
	}
	const normalize = params.normalizeTlsFingerprint ?? normalizeTlsFingerprint;
	const expectedFingerprint = params.tlsFingerprint ? normalizeTlsFingerprint(params.tlsFingerprint) : void 0;
	if (params.tlsFingerprint && !expectedFingerprint) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint must be a SHA-256 fingerprint");
	const options = { ...params.options };
	if (usesTls && expectedFingerprint) applyGatewayWebSocketTlsPin(options, expectedFingerprint, normalize);
	return { options };
}
function applyGatewayWebSocketTlsPin(options, expectedFingerprint, normalize = normalizeTlsFingerprint) {
	options.rejectUnauthorized = false;
	const headers = { ...options.headers };
	const deferredHeaders = Object.entries(headers).filter(([key]) => key.toLowerCase() === "expect");
	for (const [key] of deferredHeaders) delete headers[key];
	options.headers = headers;
	options.finishRequest = (request) => {
		request.once("socket", (socket) => {
			if (!(socket instanceof TLSSocket)) {
				request.destroy(new GatewayWebSocketTlsPinError("gateway tls fingerprint unavailable"));
				return;
			}
			const validatePin = () => {
				if (request.destroyed) return;
				const canonicalFingerprint = normalizeTlsFingerprint(socket.getPeerCertificate()?.fingerprint256);
				const fingerprint = canonicalFingerprint ? normalize(canonicalFingerprint) : "";
				if (!fingerprint || fingerprint !== normalize(expectedFingerprint)) {
					request.destroy(new GatewayWebSocketTlsPinError(fingerprint ? "gateway tls fingerprint mismatch" : "gateway tls fingerprint unavailable"));
					return;
				}
				for (const [key, value] of deferredHeaders) if (value !== void 0) request.setHeader(key, value);
				request.end();
			};
			if (socket.secureConnecting) {
				socket.once("secureConnect", validatePin);
				request.once("close", () => socket.off("secureConnect", validatePin));
			} else validatePin();
		});
	};
}
//#endregion
export { resolveGatewayWebSocketTransport as a, isGatewayLoopbackHost as i, GatewayWebSocketTransportConfigurationError as n, applyGatewayWebSocketTlsPin as r, GatewayWebSocketTlsPinError as t };

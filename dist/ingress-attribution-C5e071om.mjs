import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as isLoopbackAddress, d as isTrustedProxyAddress, h as resolveClientIp, n as hasForwardedRequestHeaders, x as resolveRequestClientIpFromHeaders } from "./net-DU4aWKLv.mjs";
import { s as readTailscaleWhoisIdentity } from "./tailscale-BRIsmHIP.mjs";
//#region src/gateway/ingress-attribution.ts
const PROXY_ATTRIBUTION_REQUIRED_REASON = "proxy_attribution_required";
const PROXY_ATTRIBUTION_GUIDANCE = "Configure gateway.trustedProxies narrowly and make the proxy overwrite or safely rebuild forwarded client headers.";
const requestTransport = /* @__PURE__ */ new WeakMap();
const preparedAttribution = /* @__PURE__ */ new WeakMap();
/** Records listener-owned provenance before any request-time policy runs. */
function markGatewayIngressTransport(req, transport) {
	const existing = requestTransport.get(req);
	if (existing) {
		if (existing.kind !== transport.kind || existing.kind === "managed-tailscale" && transport.kind === "managed-tailscale" && existing.mode !== transport.mode) throw new Error("Gateway ingress transport was already assigned");
		return;
	}
	requestTransport.set(req, transport);
}
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function unattributableProxy(remoteAddress) {
	return {
		kind: "unattributable-proxy",
		reason: PROXY_ATTRIBUTION_REQUIRED_REASON,
		guidance: PROXY_ATTRIBUTION_GUIDANCE,
		remoteAddress
	};
}
function attributed(kind, clientIp) {
	return {
		kind,
		clientIp,
		rateLimit: {
			subject: { key: clientIp },
			resetOnSuccess: true
		}
	};
}
function hasTailscaleProxyHeaders(req) {
	const headers = req.headers ?? {};
	return Boolean(headers["x-forwarded-for"] && headers["x-forwarded-proto"] && headers["x-forwarded-host"]);
}
function hasTailscaleOwnedHeaders(req) {
	const headers = req.headers ?? {};
	return [
		"tailscale-funnel-request",
		"tailscale-headers-info",
		"tailscale-user-login",
		"tailscale-user-name",
		"tailscale-user-profile-pic"
	].some((name) => headers[name] !== void 0);
}
function resolveTailscaleClientIp(req) {
	return resolveClientIp({
		remoteAddr: req.socket?.remoteAddress,
		forwardedFor: headerValue(req.headers?.["x-forwarded-for"]),
		trustedProxies: ["127.0.0.1", "::1"]
	});
}
function resolveManagedTailscaleIngress(params) {
	const { req, mode, remoteAddress, tailscaleWhois } = params;
	if (!isLoopbackAddress(remoteAddress) || !hasTailscaleProxyHeaders(req)) return unattributableProxy(remoteAddress);
	const clientIp = resolveTailscaleClientIp(req);
	if (!clientIp || isLoopbackAddress(clientIp)) return unattributableProxy(remoteAddress);
	const funnelMarker = headerValue(req.headers?.["tailscale-funnel-request"]);
	if (mode === "funnel") return !funnelMarker || funnelMarker === "?1" ? attributed("tailscale-funnel", clientIp) : unattributableProxy(remoteAddress);
	if (funnelMarker) return unattributableProxy(remoteAddress);
	const headerLogin = normalizeOptionalString(req.headers?.["tailscale-user-login"]);
	const headerName = normalizeOptionalString(req.headers?.["tailscale-user-name"]);
	const profilePic = normalizeOptionalString(req.headers?.["tailscale-user-profile-pic"]);
	let identityPromise;
	const verifyIdentity = () => {
		if (!headerLogin) return Promise.resolve(void 0);
		identityPromise ??= (async () => {
			try {
				const whois = await tailscaleWhois(clientIp);
				if (!whois?.login || whois.login.toLowerCase() !== headerLogin.toLowerCase()) return;
				return {
					login: whois.login,
					name: whois.name ?? headerName ?? whois.login,
					...profilePic ? { profilePic } : {}
				};
			} catch {
				return;
			}
		})();
		return identityPromise;
	};
	return {
		...attributed("tailscale-serve", clientIp),
		verifyIdentity
	};
}
function resolveGatewayIngressAttribution(params) {
	const { req } = params;
	const remoteAddress = resolveClientIp({ remoteAddr: req.socket?.remoteAddress }) ?? req.socket?.remoteAddress ?? "unknown";
	const transport = requestTransport.get(req) ?? { kind: "ordinary" };
	if (transport.kind === "managed-tailscale") return resolveManagedTailscaleIngress({
		req,
		mode: transport.mode,
		remoteAddress,
		tailscaleWhois: params.tailscaleWhois ?? readTailscaleWhoisIdentity
	});
	const hasProxyHeaders = hasForwardedRequestHeaders(req);
	const hasTailscaleHeaders = hasTailscaleOwnedHeaders(req);
	if (isLoopbackAddress(remoteAddress) && !hasProxyHeaders && !hasTailscaleHeaders) return attributed("direct-local", remoteAddress);
	if (isTrustedProxyAddress(remoteAddress, params.trustedProxies)) {
		const clientIp = resolveRequestClientIpFromHeaders(req, params.trustedProxies, params.allowRealIpFallback === true);
		if (!clientIp || isLoopbackAddress(clientIp)) return unattributableProxy(remoteAddress);
		return {
			...attributed("trusted-proxy", clientIp),
			...headerValue(req.headers?.["tailscale-funnel-request"]) === "?1" ? { externalTailscaleExposure: "funnel" } : {}
		};
	}
	if (hasProxyHeaders || hasTailscaleHeaders) return unattributableProxy(remoteAddress);
	return attributed("direct-remote", remoteAddress);
}
function prepareGatewayIngressAttribution(params) {
	const existing = preparedAttribution.get(params.req);
	if (existing) return existing;
	const prepared = resolveGatewayIngressAttribution(params);
	preparedAttribution.set(params.req, prepared);
	return prepared;
}
function readPreparedGatewayIngressAttribution(req) {
	return preparedAttribution.get(req);
}
/** Emits one actionable warning per runtime without attacker-controlled log growth. */
function createGatewayUnattributableProxyReporter(log) {
	let emitted = false;
	return (attribution) => {
		if (emitted) return;
		emitted = true;
		log.warn(`gateway: observed unattributable proxy-shaped traffic from ${attribution.remoteAddress}; Gateway-authenticated routes reject it, while plugin-authenticated routes ignore forwarded claims. ${attribution.guidance}`);
	};
}
//#endregion
export { prepareGatewayIngressAttribution as a, markGatewayIngressTransport as i, PROXY_ATTRIBUTION_REQUIRED_REASON as n, readPreparedGatewayIngressAttribution as o, createGatewayUnattributableProxyReporter as r, PROXY_ATTRIBUTION_GUIDANCE as t };

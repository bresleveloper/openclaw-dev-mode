import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDedupeCache } from "./dedupe-5aqLNx3Q.mjs";
import { t as firstHeaderValue } from "./http-header-value-BM79-5V8.mjs";
import { a as isLoopbackAddress, d as isTrustedProxyAddress, h as resolveClientIp, n as hasForwardedRequestHeaders, x as resolveRequestClientIpFromHeaders } from "./net-CjQwRK-V.mjs";
import { s as readTailscaleWhoisIdentity } from "./tailscale-DIe8yR1S.mjs";
//#region src/gateway/ingress-attribution.ts
const PROXY_ATTRIBUTION_REQUIRED_REASON = "proxy_attribution_required";
const PROXY_ATTRIBUTION_GUIDANCE = "Configure gateway.trustedProxies narrowly and make the proxy overwrite or safely rebuild forwarded client headers.";
const UNATTRIBUTABLE_PROXY_WARNING_WINDOW_MS = 3e5;
const UNATTRIBUTABLE_PROXY_WARNING_MAX_SOURCES = 16;
const requestTransport = /* @__PURE__ */ new WeakMap();
const preparedAttribution = /* @__PURE__ */ new WeakMap();
/** Records listener-owned provenance before any request-time policy runs. */
function markGatewayIngressTransport(req, transport) {
	const existing = requestTransport.get(req);
	if (existing) {
		if (existing.kind !== transport.kind || existing.kind === "remote-forwarded" && transport.kind === "remote-forwarded" && existing.context !== transport.context || existing.kind === "managed-tailscale" && transport.kind === "managed-tailscale" && existing.mode !== transport.mode) throw new Error("Gateway ingress transport was already assigned");
		return;
	}
	if (preparedAttribution.has(req)) throw new Error("Gateway ingress policy already prepared before transport assignment");
	requestTransport.set(req, Object.freeze({ ...transport }));
}
function readGatewayIngressTransport(req) {
	return requestTransport.get(req);
}
function getRemoteControlUiIngressContext(req) {
	const transport = readGatewayIngressTransport(req);
	return transport?.kind === "remote-forwarded" ? transport.context : void 0;
}
function assertRemoteControlUiIngressCurrent(context) {
	context?.signal.throwIfAborted();
	context?.assertCurrent();
}
function hasCurrentRemoteControlUiIngress(context) {
	try {
		assertRemoteControlUiIngressCurrent(context);
		return true;
	} catch {
		return false;
	}
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
		forwardedFor: firstHeaderValue(req.headers?.["x-forwarded-for"]),
		trustedProxies: ["127.0.0.1", "::1"]
	});
}
function resolveManagedTailscaleIngress(params) {
	const { req, mode, remoteAddress, tailscaleWhois } = params;
	if (!isLoopbackAddress(remoteAddress) || !hasTailscaleProxyHeaders(req)) return unattributableProxy(remoteAddress);
	const clientIp = resolveTailscaleClientIp(req);
	if (!clientIp || isLoopbackAddress(clientIp)) return unattributableProxy(remoteAddress);
	const funnelMarker = firstHeaderValue(req.headers?.["tailscale-funnel-request"]);
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
	if (transport.kind === "remote-forwarded") return Object.freeze({
		kind: "remote-forwarded",
		clientIp: remoteAddress,
		rateLimit: Object.freeze({
			subject: Object.freeze({ key: `remote-control-ui:${transport.context.pluginId}` }),
			resetOnSuccess: true
		})
	});
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
			...firstHeaderValue(req.headers?.["tailscale-funnel-request"]) === "?1" ? { externalTailscaleExposure: "funnel" } : {}
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
/** Emits bounded, per-source warnings so one rejected peer cannot hide every later peer. */
function createGatewayUnattributableProxyReporter(log) {
	const reportedSources = createDedupeCache({
		ttlMs: UNATTRIBUTABLE_PROXY_WARNING_WINDOW_MS,
		maxSize: 32
	});
	let windowStartedAt = Date.now();
	let lastObservedAt = windowStartedAt;
	let emittedInWindow = 0;
	return (attribution) => {
		const now = Date.now();
		if (now < lastObservedAt || now - windowStartedAt >= UNATTRIBUTABLE_PROXY_WARNING_WINDOW_MS) {
			windowStartedAt = now;
			emittedInWindow = 0;
			if (now < lastObservedAt) reportedSources.clear();
		}
		lastObservedAt = now;
		if (emittedInWindow >= UNATTRIBUTABLE_PROXY_WARNING_MAX_SOURCES || reportedSources.peek(attribution.remoteAddress, now)) return;
		reportedSources.check(attribution.remoteAddress, now);
		emittedInWindow += 1;
		log.warn(`gateway: observed unattributable proxy-shaped traffic from ${attribution.remoteAddress}; Gateway-authenticated routes reject it, while plugin-authenticated routes ignore forwarded claims. ${attribution.guidance}`);
	};
}
//#endregion
export { getRemoteControlUiIngressContext as a, prepareGatewayIngressAttribution as c, createGatewayUnattributableProxyReporter as i, readGatewayIngressTransport as l, PROXY_ATTRIBUTION_REQUIRED_REASON as n, hasCurrentRemoteControlUiIngress as o, assertRemoteControlUiIngressCurrent as r, markGatewayIngressTransport as s, PROXY_ATTRIBUTION_GUIDANCE as t, readPreparedGatewayIngressAttribution as u };

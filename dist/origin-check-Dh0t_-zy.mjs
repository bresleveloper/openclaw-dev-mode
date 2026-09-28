import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { c as isPrivateOrLoopbackAddress, p as normalizeHostHeader, r as isLocalDirectRequest, s as isLoopbackHost, y as resolveHostName } from "./net-DU4aWKLv.mjs";
import net from "node:net";
//#region src/gateway/origin-check.ts
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
/** Gather the canonical Gateway browser-origin policy inputs for one HTTP request. */
function resolveBrowserOriginPolicy(params) {
	return {
		requestHost: headerValue(params.req.headers.host),
		origin: headerValue(params.req.headers.origin),
		fetchSite: headerValue(params.req.headers["sec-fetch-site"]),
		allowedOrigins: params.cfg?.gateway?.controlUi?.allowedOrigins,
		allowHostHeaderOriginFallback: params.cfg?.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true
	};
}
function parseOrigin(originRaw) {
	const trimmed = (originRaw ?? "").trim();
	if (!trimmed || trimmed === "null") return null;
	if (!/^[a-z][a-z0-9+.-]*:\/\/[^/?#\\]+\/?$/i.test(trimmed)) return null;
	try {
		const url = new URL(trimmed);
		if (url.username || url.password || !url.protocol || !url.host) return null;
		const origin = url.origin === "null" ? `${url.protocol}//${url.host}` : url.origin;
		return {
			origin: normalizeLowercaseStringOrEmpty(origin),
			protocol: normalizeLowercaseStringOrEmpty(url.protocol),
			host: normalizeLowercaseStringOrEmpty(url.host),
			hostname: normalizeLowercaseStringOrEmpty(url.hostname)
		};
	} catch {
		return null;
	}
}
/** Whether a browser document was loaded from the Gateway's advertised HTTP host. */
function isGatewayHostBrowserOrigin(params) {
	const parsedOrigin = parseOrigin(params.origin);
	const requestHost = normalizeHostHeader(params.requestHost);
	return Boolean(parsedOrigin && requestHost && parsedOrigin.host === requestHost);
}
/** Return a canonical Chrome extension origin for pairing-bound authorization. */
function normalizeChromeExtensionOrigin(originRaw) {
	const parsed = parseOrigin(originRaw);
	return parsed?.protocol === "chrome-extension:" && /^[a-p]{32}$/u.test(parsed.hostname) ? parsed.origin : void 0;
}
/** Validate a browser Origin against explicit allowlist, same-host, and local dev rules. */
function checkBrowserOrigin(params) {
	const parsedOrigin = parseOrigin(params.origin);
	if (!parsedOrigin) return {
		ok: false,
		reason: "origin missing or invalid"
	};
	const allowlist = new Set((params.allowedOrigins ?? []).map((value) => normalizeOptionalLowercaseString(value)).filter(Boolean));
	if (allowlist.has("*") || allowlist.has(parsedOrigin.origin)) return {
		ok: true,
		matchedBy: "allowlist"
	};
	const requestHost = normalizeHostHeader(params.requestHost);
	if (params.allowHostHeaderOriginFallback === true && requestHost && parsedOrigin.host === requestHost) return {
		ok: true,
		matchedBy: "host-header-fallback"
	};
	if (requestHost && parsedOrigin.host === requestHost && isTrustedSameOriginHost(requestHost, params.isLocalClient)) return {
		ok: true,
		matchedBy: "private-same-origin"
	};
	if (params.isLocalClient && isLoopbackHost(parsedOrigin.hostname)) return {
		ok: true,
		matchedBy: "local-loopback"
	};
	return {
		ok: false,
		reason: "origin not allowed"
	};
}
/** Return the request Origin only when the Gateway's canonical browser policy accepts it. */
function resolveAcceptedBrowserOrigin(params) {
	const policy = resolveBrowserOriginPolicy(params);
	const origin = policy.origin?.trim();
	if (!origin) return;
	return checkBrowserOrigin({
		...policy,
		origin,
		isLocalClient: isLocalDirectRequest(params.req)
	}).ok ? origin : void 0;
}
function isTrustedSameOriginHost(hostHeader, isLocalClient) {
	const hostname = resolveHostName(hostHeader);
	if (!hostname) return false;
	if (isLoopbackHost(hostname)) return isLocalClient !== false;
	if (net.isIP(hostname) !== 0) return isPrivateOrLoopbackAddress(hostname);
	return hostname.endsWith(".local") || hostname.endsWith(".ts.net");
}
//#endregion
export { resolveBrowserOriginPolicy as a, resolveAcceptedBrowserOrigin as i, isGatewayHostBrowserOrigin as n, normalizeChromeExtensionOrigin as r, checkBrowserOrigin as t };

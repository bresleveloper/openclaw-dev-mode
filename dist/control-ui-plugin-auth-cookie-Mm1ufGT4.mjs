import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { f as isOperatorScope } from "./operator-scopes-BO7_XQCg.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { r as isLocalDirectRequest, s as isLoopbackHost, y as resolveHostName } from "./net-CjQwRK-V.mjs";
import { a as getRemoteControlUiIngressContext, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { n as resolvePluginRoutePathContext } from "./path-context-B0Rya5D6.mjs";
import { c as controlUiPluginAssetPrefix, d as CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE, f as CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY, p as CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY, u as CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS } from "./control-ui-plugin-tabs-y8H4PDI0.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { TLSSocket } from "node:tls";
//#region src/gateway/control-ui-plugin-auth-cookie.ts
const CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX = `__openclaw_plugin_tab_auth_${randomBytes(8).toString("hex")}`;
const CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE = "plugin-tab";
const controlUiPluginAuthCookieSecret = randomBytes(32);
const ingressCookieGenerations = /* @__PURE__ */ new WeakMap();
function requestCookieGeneration(generation, req) {
	const ingress = req && getRemoteControlUiIngressContext(req);
	if (!ingress) return generation;
	let binding = ingressCookieGenerations.get(ingress.resolvePrincipal);
	if (!binding) {
		binding = randomBytes(32).toString("base64url");
		ingressCookieGenerations.set(ingress.resolvePrincipal, binding);
	}
	return createHash("sha256").update(`${generation}\0${binding}`).digest("base64url");
}
/** Forward only this host process's core-issued read-cookie namespace; verification stays at its owner. */
function filterRemoteControlUiPluginReadCookies(header) {
	const prefix = `${CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX}_`;
	const cookies = header.split(";").map((entry) => entry.trimStart()).filter((entry) => {
		const separator = entry.indexOf("=");
		if (separator < 0) return false;
		const name = entry.slice(0, separator);
		const value = entry.slice(separator + 1);
		return name.startsWith(prefix) && /^[a-f0-9]{64}$/.test(name.slice(prefix.length)) && /^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
	});
	return cookies.length ? cookies.join("; ") : void 0;
}
function signPayload(encodedPayload) {
	return createHmac("sha256", controlUiPluginAuthCookieSecret).update(encodedPayload).digest("base64url");
}
function readCookieHeaderValues(header, namePrefix) {
	const raw = Array.isArray(header) ? header.join(";") : header;
	const values = [];
	for (const part of raw?.split(";") ?? []) {
		const index = part.indexOf("=");
		if (index <= 0) continue;
		const key = part.slice(0, index).trim();
		const value = part.slice(index + 1).trim();
		if (key.startsWith(`${namePrefix}_`)) values.push(value);
	}
	return values;
}
function cookieNameForPlugin(pluginId) {
	const pluginKey = createHash("sha256").update(pluginId).digest("hex");
	return `${CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX}_${pluginKey}`;
}
function normalizeCookiePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes(";") || containsAsciiControlCharacter(path)) return;
	return URL.parse(path, "http://localhost")?.pathname === path ? path : void 0;
}
function createControlUiPluginAuthCookie(grant, params) {
	const path = normalizeCookiePath(grant.path);
	if (!path || !grant.pluginId || !params.generation) return;
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return;
	const exp = asDateTimestampMs(now + CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS);
	if (exp === void 0) return;
	const payload = {
		scope: CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE,
		pluginId: grant.pluginId,
		scopes: grant.scopes.filter(isOperatorScope),
		path,
		match: grant.match,
		generation: requestCookieGeneration(params.generation, params.request),
		exp,
		...params.profileId ? { profileId: params.profileId } : {}
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	const sig = signPayload(encodedPayload);
	const isNativeAsset = grant.match === "prefix" && path === controlUiPluginAssetPrefix(grant.pluginId, params.basePath);
	const req = params.request;
	const allowInsecureNativeAssets = req && !(req.socket instanceof TLSSocket) && isLocalDirectRequest(req) && isLoopbackHost(resolveHostName(req.headers.host));
	const secure = !isNativeAsset || !allowInsecureNativeAssets;
	const name = cookieNameForPlugin(grant.pluginId);
	const value = `v1.${encodedPayload}.${sig}`;
	const maxAgeSeconds = Math.ceil(CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS / 1e3);
	return {
		serialized: `${name}=${value}; Path=${path}; HttpOnly;${secure ? " Secure;" : ""} SameSite=${isNativeAsset ? "Strict" : "None"}; Max-Age=${maxAgeSeconds}`,
		metadata: {
			name,
			value,
			path,
			maxAgeSeconds,
			kind: isNativeAsset ? "native-assets" : "iframe-read"
		}
	};
}
const issuedReadCookies = /* @__PURE__ */ new WeakMap();
/** Only cookies signed and marked by the core read-grant owner can cross remote ingress. */
function readGatewayPluginReadCookies(res) {
	return issuedReadCookies.get(res) ?? [];
}
function setControlUiPluginAuthCookie(res, grants, params) {
	assertRemoteControlUiIngressCurrent(params.request ? getRemoteControlUiIngressContext(params.request) : void 0);
	const issuedGrants = [];
	const metadata = [];
	const cookiesToAdd = grants.flatMap((grant) => {
		const cookie = createControlUiPluginAuthCookie(grant, params);
		if (!cookie) return [];
		issuedGrants.push(grant);
		metadata.push(Object.freeze(cookie.metadata));
		return [cookie.serialized];
	});
	if (cookiesToAdd.length === 0) return issuedGrants;
	const existing = typeof res.getHeader === "function" ? res.getHeader("Set-Cookie") : void 0;
	const cookies = Array.isArray(existing) ? [...existing, ...cookiesToAdd] : typeof existing === "string" ? [existing, ...cookiesToAdd] : cookiesToAdd;
	res.setHeader("Set-Cookie", cookies);
	issuedReadCookies.set(res, Object.freeze([...readGatewayPluginReadCookies(res), ...metadata]));
	return issuedGrants;
}
function grantPathMatchesRequest(grantPath, match, requestPath) {
	if (match === "exact") return requestPath === grantPath;
	return requestPath === grantPath || requestPath.startsWith(grantPath) && (grantPath.endsWith("/") || requestPath.at(grantPath.length) === "/");
}
function resolveControlUiPluginAuthCookieGrants(req, params) {
	const ingress = getRemoteControlUiIngressContext(req);
	assertRemoteControlUiIngressCurrent(ingress);
	const principal = ingress?.resolvePrincipal();
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return [];
	const requestPath = normalizeCookiePath(params.requestPath);
	if (!requestPath || !params.generation) return [];
	const requestPathContext = resolvePluginRoutePathContext(requestPath);
	if (requestPathContext.malformedEncoding || requestPathContext.decodePassLimitReached) return [];
	const grants = [];
	for (const value of readCookieHeaderValues(req.headers.cookie, CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX)) {
		const parts = value.split(".");
		if (parts.length !== 3 || parts[0] !== "v1") continue;
		const [, encodedPayload, sig] = parts;
		if (!encodedPayload || !sig || !safeEqualSecret(sig, signPayload(encodedPayload))) continue;
		try {
			const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
			if (payload?.scope !== CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE || payload.exp <= now || payload.generation !== requestCookieGeneration(params.generation, req) || typeof payload.pluginId !== "string" || payload.pluginId.length === 0 || payload.profileId !== void 0 && (typeof payload.profileId !== "string" || payload.profileId.length === 0) || principal && payload.profileId !== principal.authenticatedUserProfile.profileId || !Array.isArray(payload.scopes) || typeof payload.path !== "string" || normalizeCookiePath(payload.path) !== payload.path || payload.match !== "exact" && payload.match !== "prefix") continue;
			const grantPathContext = resolvePluginRoutePathContext(payload.path);
			if (grantPathContext.malformedEncoding || grantPathContext.decodePassLimitReached || !grantPathMatchesRequest(grantPathContext.canonicalPath, payload.match, requestPathContext.canonicalPath)) continue;
			const scopes = payload.scopes.filter(isOperatorScope);
			const grant = {
				pluginId: payload.pluginId,
				path: payload.path,
				match: payload.match,
				scopes: principal ? intersectOperatorScopes(scopes, principal.scopes).filter(isOperatorScope) : scopes,
				...payload.profileId ? { profileId: payload.profileId } : {}
			};
			grants.push(grant);
		} catch {
			continue;
		}
	}
	return grants.toSorted((left, right) => right.path.length - left.path.length);
}
/**
* Confirms that the browser actually sent a grant from inside the opaque
* sandbox. Secure contexts can still block third-party cookies, so bootstrap
* acknowledgement alone is not enough to mount the plugin frame.
*/
function respondControlUiPluginAuthCookieProbe(req, res) {
	const ingress = getRemoteControlUiIngressContext(req);
	assertRemoteControlUiIngressCurrent(ingress);
	const url = new URL(req.url ?? "/", "http://localhost");
	const nonce = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY);
	if (nonce === null) return false;
	const targetOrigin = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY);
	const parsedOrigin = targetOrigin ? URL.parse(targetOrigin) : null;
	const validTargetOrigin = parsedOrigin?.origin === targetOrigin && (parsedOrigin?.protocol === "https:" || parsedOrigin?.protocol === "http:");
	if (!/^[a-zA-Z0-9_-]{16,128}$/.test(nonce) || !validTargetOrigin) {
		res.statusCode = 400;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Invalid plugin frame auth check");
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", `default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors ${ingress ? [ingress.publicOrigin, ...ingress.frameAncestors].join(" ") : "'self'"}`);
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
	const message = JSON.stringify({
		type: CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE,
		nonce
	});
	res.end(`<!doctype html><script>parent.postMessage(${message}, ${JSON.stringify(targetOrigin)})<\/script>`);
	return true;
}
//#endregion
export { setControlUiPluginAuthCookie as a, respondControlUiPluginAuthCookieProbe as i, readGatewayPluginReadCookies as n, resolveControlUiPluginAuthCookieGrants as r, filterRemoteControlUiPluginReadCookies as t };

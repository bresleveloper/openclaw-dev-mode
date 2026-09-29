import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import { d as isOperatorScope, f as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { r as isLocalDirectRequest, s as isLoopbackHost, y as resolveHostName } from "./net-DU4aWKLv.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN } from "./auth-rate-limit-DuWYneOU.mjs";
import { a as prepareGatewayIngressAttribution } from "./ingress-attribution-C5e071om.mjs";
import { a as resolveBrowserOriginPolicy } from "./origin-check-Dh0t_-zy.mjs";
import { t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { n as authorizeControlUiReadHttpGatewayConnect, r as authorizeHttpGatewayConnect } from "./auth-CRxiLJL8.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as authorizeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-C7g7eSZh.mjs";
import { R as readUserProfileAliasRevision } from "./user-profiles-internal-BxQLnWfo.mjs";
import { t as getUserProfileDisplay } from "./user-profile-list-B5pNqyXa.mjs";
import { i as getUserProfileListItem } from "./user-profiles-BA6bh7Le.mjs";
import { i as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-DKvRoWkW.mjs";
import { c as readOperatorRolePolicyRevision, f as resolveOperatorRolePolicyForAssignment, p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BNrKHiJ3.mjs";
import { a as hasGatewayOperatorAccessPolicies, i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, o as resolveGatewayOperatorAccessAuthority, t as GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE } from "./operator-access-policy-Dh1MoHMy.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { n as resolveGatewayAuthPolicyGeneration, t as isGatewayAuthPolicyCurrent } from "./auth-policy-BO43FSUR.mjs";
import { c as CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS, d as CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY, l as CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE, r as listControlUiPluginTabAuthGrants, u as CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY } from "./control-ui-plugin-tabs-DjZIdZqM.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { i as listDevicePairing } from "./device-pairing-DbLfxuuq.mjs";
import { n as verifyPairingToken } from "./pairing-token-CzXJ-1-p.mjs";
import { i as verifyDeviceToken } from "./device-pairing-tokens-ET3TWOUZ.mjs";
import { t as controlUiPluginAssetPrefix } from "./control-ui-plugin-assets-contract-BEmf5f0r.mjs";
import { a as resolvePluginRoutePathContext } from "./route-match-3ODu6iRN.mjs";
import { n as shouldUseGatewayOwnerProfile, r as resolveHostAccountName, t as createAuthenticatedGitHubIdentitySync } from "./github-user-identity-C4GCEFfK.mjs";
import { n as ensureCanonicalUserProfileForEmail, r as ensureCanonicalUserProfileForTailscaleIdentity, t as ensureCanonicalGatewayOwnerProfile } from "./user-profile-writes-ColUfz03.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { n as getHeader, t as getBearerToken } from "./http-header-value-Be14tJQx.mjs";
import { c as sendJson, f as sendUnauthorized, o as sendGatewayAuthFailure, u as sendMissingScopeForbidden } from "./http-common-Ckbyca3h.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-DTv5-s0n.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { TLSSocket } from "node:tls";
//#region src/gateway/control-ui-plugin-auth-cookie.ts
const CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX = `__openclaw_plugin_tab_auth_${randomBytes(8).toString("hex")}`;
const CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE = "plugin-tab";
const controlUiPluginAuthCookieSecret = randomBytes(32);
function signPayload(encodedPayload) {
	return createHmac("sha256", controlUiPluginAuthCookieSecret).update(encodedPayload).digest("base64url");
}
function safeEqual(a, b) {
	const left = createHash("sha256").update(a).digest();
	const right = createHash("sha256").update(b).digest();
	return timingSafeEqual(left, right);
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
function hasInvalidCookiePathCharacter(path) {
	for (const character of path) {
		const code = character.charCodeAt(0);
		if (character === ";" || code <= 31 || code === 127) return true;
	}
	return false;
}
function normalizeCookiePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || hasInvalidCookiePathCharacter(path)) return;
	try {
		const normalized = new URL(path, "http://localhost").pathname;
		return normalized === path ? normalized : void 0;
	} catch {
		return;
	}
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
		generation: params.generation,
		exp,
		...params.profileId ? { profileId: params.profileId } : {}
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	const sig = signPayload(encodedPayload);
	const isNativeAsset = grant.match === "prefix" && path === controlUiPluginAssetPrefix(grant.pluginId, params.basePath);
	const req = params.request;
	const allowInsecureNativeAssets = req && !(req.socket instanceof TLSSocket) && isLocalDirectRequest(req) && isLoopbackHost(resolveHostName(req.headers.host));
	const secure = !isNativeAsset || !allowInsecureNativeAssets;
	return `${cookieNameForPlugin(grant.pluginId)}=v1.${encodedPayload}.${sig}; Path=${path}; HttpOnly;${secure ? " Secure;" : ""} SameSite=${isNativeAsset ? "Strict" : "None"}; Max-Age=${Math.ceil(CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS / 1e3)}`;
}
function setControlUiPluginAuthCookie(res, grants, params) {
	const issuedGrants = [];
	const cookiesToAdd = grants.flatMap((grant) => {
		const cookie = createControlUiPluginAuthCookie(grant, params);
		if (!cookie) return [];
		issuedGrants.push(grant);
		return [cookie];
	});
	if (cookiesToAdd.length === 0) return issuedGrants;
	const existing = typeof res.getHeader === "function" ? res.getHeader("Set-Cookie") : void 0;
	const cookies = Array.isArray(existing) ? [...existing, ...cookiesToAdd] : typeof existing === "string" ? [existing, ...cookiesToAdd] : cookiesToAdd;
	res.setHeader("Set-Cookie", cookies);
	return issuedGrants;
}
function grantPathMatchesRequest(grantPath, match, requestPath) {
	if (match === "exact") return requestPath === grantPath;
	return requestPath === grantPath || requestPath.startsWith(grantPath) && (grantPath.endsWith("/") || requestPath.at(grantPath.length) === "/");
}
function resolveControlUiPluginAuthCookieGrants(req, params) {
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
		if (!encodedPayload || !sig || !safeEqual(sig, signPayload(encodedPayload))) continue;
		try {
			const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
			if (payload?.scope !== CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE || payload.exp <= now || payload.generation !== params.generation || typeof payload.pluginId !== "string" || payload.pluginId.length === 0 || payload.profileId !== void 0 && (typeof payload.profileId !== "string" || payload.profileId.length === 0) || !Array.isArray(payload.scopes) || typeof payload.path !== "string" || normalizeCookiePath(payload.path) !== payload.path || payload.match !== "exact" && payload.match !== "prefix") continue;
			const grantPathContext = resolvePluginRoutePathContext(payload.path);
			if (grantPathContext.malformedEncoding || grantPathContext.decodePassLimitReached || !grantPathMatchesRequest(grantPathContext.canonicalPath, payload.match, requestPathContext.canonicalPath)) continue;
			const grant = {
				pluginId: payload.pluginId,
				path: payload.path,
				match: payload.match,
				scopes: payload.scopes.filter(isOperatorScope),
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
	const url = new URL(req.url ?? "/", "http://localhost");
	const nonce = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY);
	if (nonce === null) return false;
	const targetOrigin = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY);
	let validTargetOrigin = false;
	if (targetOrigin) try {
		const parsedOrigin = new URL(targetOrigin);
		validTargetOrigin = parsedOrigin.origin === targetOrigin && (parsedOrigin.protocol === "https:" || parsedOrigin.protocol === "http:");
	} catch {
		validTargetOrigin = false;
	}
	if (!/^[a-zA-Z0-9_-]{16,128}$/.test(nonce) || !validTargetOrigin) {
		res.statusCode = 400;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Invalid plugin frame auth probe");
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'");
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
//#region src/gateway/http-auth-user-profile.ts
const profileLog = createSubsystemLogger("gateway/user-profiles");
function failedHttpProfileAuthentication(error) {
	return {
		ok: false,
		authResult: {
			ok: false,
			reason: error instanceof GatewayOperatorAccessDeniedError ? "operator_access_denied" : "user_profile_unavailable"
		}
	};
}
async function checkAuthenticatedHttpUserProfile(params) {
	try {
		return {
			ok: true,
			profile: await resolveAuthenticatedHttpUserProfile(params)
		};
	} catch (error) {
		return failedHttpProfileAuthentication(error);
	}
}
/** A signed cookie retains one exact profile reference; current policy still governs its admission. */
function checkHttpCookieUserProfile(cfg, profileIds) {
	const profileId = profileIds[0];
	if (profileIds.some((candidate) => candidate !== profileId) || !profileId && (cfg.gateway?.roles || hasGatewayOperatorAccessPolicies(cfg))) return failedHttpProfileAuthentication();
	if (!profileId) return {
		ok: true,
		profile: {}
	};
	try {
		return {
			ok: true,
			profile: resolveHttpProfile(profileId, getUserProfileListItem(profileId).updatedAt, cfg)
		};
	} catch (error) {
		return failedHttpProfileAuthentication(error);
	}
}
function usesSharedSecretGatewayMethod(method) {
	return method === "token" || method === "password";
}
async function resolveAuthenticatedHttpUserProfile(params) {
	const readAdmissionPolicy = (cfg) => {
		return {
			auth: cfg.gateway?.auth,
			roles: cfg.gateway?.roles,
			trustedProxies: cfg.gateway?.trustedProxies,
			allowRealIpFallback: cfg.gateway?.allowRealIpFallback,
			browserOrigin: resolveBrowserOriginPolicy({
				req: params.req,
				cfg
			})
		};
	};
	const admissionPolicy = structuredClone(readAdmissionPolicy(params.cfg));
	const assertCurrent = () => {
		if (params.req.aborted || params.req.socket?.destroyed || params.res?.destroyed || params.res?.writableEnded || !isDeepStrictEqual(admissionPolicy, readAdmissionPolicy(params.getRuntimeConfig?.() ?? getRuntimeConfig()))) throw new Error("HTTP profile acquisition authority expired");
	};
	assertCurrent();
	const options = { assertCurrent };
	const authenticatedUserId = normalizeOptionalString(params.authResult.user);
	const rolesConfigured = Boolean(params.cfg.gateway?.roles);
	const accessPoliciesConfigured = hasGatewayOperatorAccessPolicies(params.cfg);
	if (!authenticatedUserId) {
		if (shouldUseGatewayOwnerProfile({
			role: "operator",
			authenticatedUserId,
			authMethod: params.authResult.method,
			rolesConfigured
		})) try {
			const displayName = await resolveHostAccountName();
			assertCurrent();
			const profile = await ensureCanonicalGatewayOwnerProfile(displayName, options);
			return await prepareHttpProfile(profile.id, profile.updatedAt, assertCurrent);
		} catch (error) {
			assertCurrent();
			profileLog.warn(`owner profile resolution failed: ${formatForLog(error)}`);
			return {};
		}
		throw new Error("operator role policies require a verified durable user profile");
	}
	try {
		const syncGitHubIdentity = createAuthenticatedGitHubIdentitySync({
			authResult: params.authResult,
			authConfig: params.cfg.gateway?.auth,
			requestHeaders: params.req.headers,
			assertCurrent
		});
		const profile = syncGitHubIdentity ? await syncGitHubIdentity() : params.authResult.tailscaleIdentity ? await ensureCanonicalUserProfileForTailscaleIdentity(params.authResult.tailscaleIdentity, options) : await ensureCanonicalUserProfileForEmail(authenticatedUserId, options);
		return await prepareHttpProfile("profileId" in profile ? profile.profileId : profile.id, profile.updatedAt, assertCurrent, usesSharedSecretGatewayMethod(params.authResult.method) ? void 0 : params.cfg);
	} catch (error) {
		assertCurrent();
		if (rolesConfigured || accessPoliciesConfigured) throw error;
		return {};
	}
}
async function prepareHttpProfile(profileId, updatedAt, assertCurrent, cfg) {
	assertCurrent();
	const authority = await prepareUserProfileRoleAuthority(profileId);
	assertCurrent();
	if (!authority?.isCurrent()) throw new Error("HTTP profile authority changed during acquisition");
	const display = authority.display;
	const operatorRolePolicy = cfg ? resolveOperatorRolePolicyForAssignment(display.id, authority.role, cfg) : void 0;
	const operatorAccessAuthority = cfg ? resolveGatewayOperatorAccessAuthority(profileId, cfg) : void 0;
	assertCurrent();
	if (!authority.isCurrent()) throw new Error("HTTP profile authority changed during acquisition");
	return projectHttpProfile(display, updatedAt, operatorRolePolicy, operatorAccessAuthority);
}
/** Cookie and media disclosure retain their existing synchronous final policy check. */
function resolveHttpProfile(profileId, updatedAt, cfg) {
	const display = getUserProfileDisplay(profileId);
	return projectHttpProfile(display, updatedAt, cfg ? resolveOperatorRolePolicyForProfile(display.id, cfg) : void 0, cfg ? resolveGatewayOperatorAccessAuthority(profileId, cfg) : void 0);
}
function projectHttpProfile(display, updatedAt, operatorRolePolicy, operatorAccessAuthority) {
	return {
		authenticatedUserProfile: {
			profileId: display.id,
			displayName: display.displayName,
			avatarRevision: display.avatarRevision,
			hasAvatar: display.hasAvatar,
			updatedAt
		},
		...operatorRolePolicy ? { operatorRolePolicy } : {},
		...operatorAccessAuthority !== void 0 ? { operatorAccessAuthority } : {}
	};
}
function applyHttpOperatorRoleScopeCeiling(scopes, auth) {
	const allowedScopes = auth?.operatorRolePolicy?.scopes;
	return allowedScopes ? intersectOperatorScopes(scopes, allowedScopes) : scopes;
}
//#endregion
//#region src/gateway/http-operator-access.ts
function sendGatewayHttpAuthFailure(res, authResult) {
	if (authResult.reason !== "operator_access_denied") {
		sendGatewayAuthFailure(res, authResult);
		return;
	}
	sendJson(res, 403, { error: {
		message: GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE,
		type: "forbidden"
	} });
}
/** The listener belongs to this response, never to a reusable keep-alive socket. */
function bindHttpOperatorAccessAuthority(res, authority) {
	if (!authority) return true;
	if (!hasCurrentGatewayOperatorAccess(authority)) {
		if (!res.writableEnded && !res.destroyed) sendGatewayHttpAuthFailure(res, {
			ok: false,
			reason: "operator_access_denied"
		});
		return false;
	}
	if (res.writableEnded || res.destroyed) return false;
	const release = () => {
		authority.signal.removeEventListener("abort", revoke);
		res.off("finish", release);
		res.off("close", release);
	};
	const revoke = () => {
		release();
		if (!res.writableEnded && !res.destroyed) res.destroy();
	};
	authority.signal.addEventListener("abort", revoke, { once: true });
	res.once("finish", release);
	res.once("close", release);
	return true;
}
//#endregion
//#region src/gateway/http-auth-plugin-cookie.ts
function resolveControlUiPluginAuthCookieGeneration(authGeneration, cfg) {
	return authGeneration ? sha256Base64Url(`${authGeneration}\0${resolveGatewayAuthPolicyGeneration(cfg)}`) : void 0;
}
function authorizeControlUiPluginCookieRequest(req, params) {
	if (getBearerToken(req) || req.method !== "GET" && req.method !== "HEAD") return null;
	const cfg = getRuntimeConfig();
	const grants = resolveControlUiPluginAuthCookieGrants(req, {
		requestPath: params.requestPath,
		generation: resolveControlUiPluginAuthCookieGeneration(params.authGeneration, cfg)
	});
	if (grants.length === 0) return null;
	const profileAuth = checkHttpCookieUserProfile(cfg, grants.map((grant) => grant.profileId));
	if (!profileAuth.ok) {
		if (profileAuth.authResult.reason === "operator_access_denied" && params.res) sendGatewayHttpAuthFailure(params.res, profileAuth.authResult);
		return null;
	}
	const authenticatedProfile = profileAuth.profile;
	for (const grant of grants) grant.scopes = normalizeOperatorScopeList(applyHttpOperatorRoleScopeCeiling(grant.scopes, authenticatedProfile)) ?? [];
	if (params.res && !bindHttpOperatorAccessAuthority(params.res, authenticatedProfile.operatorAccessAuthority)) return null;
	return {
		requestAuth: {
			trustDeclaredOperatorScopes: false,
			controlUiPluginGrants: grants,
			...authenticatedProfile
		},
		operatorScopes: []
	};
}
function bindControlUiPluginCookieRequestAuthority(cookieAuth, params) {
	const hasCurrentClientAuthority = () => !params.res.writableEnded && !params.res.destroyed && params.hasCurrentClientAuthority() && hasCurrentGatewayOperatorAccess(cookieAuth.requestAuth.operatorAccessAuthority);
	const revalidate = async () => {
		if (params.res.writableEnded || params.res.destroyed) throw new Error("HTTP request authority expired");
		cookieAuth.requestAuth.operatorAccessAuthority?.assertCurrent();
		const current = authorizeControlUiPluginCookieRequest(params.req, {
			requestPath: params.requestPath,
			authGeneration: resolveSharedGatewaySessionGeneration(params.getResolvedAuth?.() ?? params.auth, params.trustedProxies ?? getRuntimeConfig().gateway?.trustedProxies)
		});
		const currentGrants = current?.requestAuth.controlUiPluginGrants ?? [];
		if (!hasCurrentClientAuthority() || !isDeepStrictEqual(current?.requestAuth.operatorRolePolicy, cookieAuth.requestAuth.operatorRolePolicy) || !cookieAuth.requestAuth.controlUiPluginGrants.every((admitted) => currentGrants.some((grant) => grant.pluginId === admitted.pluginId && grant.path === admitted.path && grant.match === admitted.match && grant.profileId === admitted.profileId && roleScopesAllow({
			role: "operator",
			requestedScopes: admitted.scopes,
			allowedScopes: grant.scopes
		})))) {
			sendUnauthorized(params.res);
			throw new Error("Unauthorized");
		}
	};
	return {
		...cookieAuth,
		requestAuth: {
			...cookieAuth.requestAuth,
			hasCurrentClientAuthority,
			revalidate
		}
	};
}
//#endregion
//#region src/gateway/http-request-authority.ts
function assertGatewayHttpRequestCurrent(requestAuth) {
	if (requestAuth.hasCurrentClientAuthority?.() === false) throw new ToolAuthorizationError("Gateway requester authority changed");
}
function captureHttpRequestAuthority(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const generation = resolveGatewayAuthPolicyGeneration(cfg);
	const authGeneration = resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies ?? cfg.gateway?.trustedProxies);
	const roleRevision = cfg.gateway?.roles ? readOperatorRolePolicyRevision() : void 0;
	const aliasRevision = readUserProfileAliasRevision();
	return () => {
		const current = params.getRuntimeConfig?.() ?? getRuntimeConfig();
		return !params.req.socket?.destroyed && isGatewayAuthPolicyCurrent(generation, current) && (roleRevision === void 0 || roleRevision === readOperatorRolePolicyRevision()) && aliasRevision === readUserProfileAliasRevision() && authGeneration === resolveSharedGatewaySessionGeneration(params.getResolvedAuth?.() ?? params.auth, params.trustedProxies ?? current.gateway?.trustedProxies);
	};
}
function bindHttpResponseAuthority(auth, res, hasCurrentClientAuthority) {
	const assertCurrent = () => {
		if (res.writableEnded || res.destroyed) throw new Error("HTTP request authority expired");
		if (!hasCurrentGatewayOperatorAccess(auth.operatorAccessAuthority)) throw new GatewayOperatorAccessDeniedError();
		if (!hasCurrentClientAuthority()) {
			res.removeHeader("Set-Cookie");
			sendUnauthorized(res);
			throw new Error("Unauthorized");
		}
	};
	return {
		...auth,
		hasCurrentClientAuthority: () => !res.writableEnded && !res.destroyed && hasCurrentClientAuthority() && hasCurrentGatewayOperatorAccess(auth.operatorAccessAuthority),
		assertCurrent,
		revalidate: async () => assertCurrent()
	};
}
//#endregion
//#region src/gateway/http-auth-utils.ts
const CONTROL_UI_OPERATOR_READ_SCOPE = "operator.read";
const CONTROL_UI_OPERATOR_ROLE = "operator";
function resolveHttpBrowserOriginPolicy(req, cfg = getRuntimeConfig()) {
	return resolveBrowserOriginPolicy({
		req,
		cfg
	});
}
function resolveControlUiReadAuthToken(req, allowQueryToken) {
	const bearer = getBearerToken(req);
	if (bearer || !allowQueryToken || !req.url) return bearer;
	try {
		return normalizeOptionalString(new URL(req.url, "http://localhost").searchParams.get("token"));
	} catch {
		return;
	}
}
async function verifyHttpOperatorDeviceToken(token, requiredSharedGatewaySessionGeneration, requiredScopes = []) {
	const pairing = await listDevicePairing();
	for (const device of pairing.paired) {
		const operatorToken = device.tokens?.[CONTROL_UI_OPERATOR_ROLE];
		if (!operatorToken || operatorToken.revokedAtMs || !verifyPairingToken(token, operatorToken.token)) continue;
		return (await verifyDeviceToken({
			deviceId: device.deviceId,
			token,
			role: CONTROL_UI_OPERATOR_ROLE,
			scopes: [
				CONTROL_UI_OPERATOR_READ_SCOPE,
				...operatorToken.scopes,
				...requiredScopes
			],
			requiredSharedGatewaySessionGeneration
		})).ok ? [...operatorToken.scopes] : null;
	}
	return null;
}
function resolveControlUiReadOperatorScopes(req, authMethod, deviceScopes, authenticatedRequest) {
	if (authMethod === "device-token") return applyHttpOperatorRoleScopeCeiling(deviceScopes ?? [], authenticatedRequest);
	if (authMethod === "trusted-proxy" || authMethod === "tailscale") return resolveTrustedHttpOperatorScopes(req, {
		trustDeclaredOperatorScopes: true,
		...authenticatedRequest
	});
	return authMethod === "bootstrap-token" ? [] : [...CLI_DEFAULT_OPERATOR_SCOPES];
}
async function checkHttpOperatorCredentials(params, authorizeConnect) {
	const { auth, token } = params;
	const ingressAttribution = prepareGatewayIngressAttribution({
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback
	});
	if (ingressAttribution.kind === "unattributable-proxy") return { authResult: {
		ok: false,
		reason: ingressAttribution.reason
	} };
	const clientIp = ingressAttribution.rateLimit.subject.key;
	const canUseDeviceTokenFallback = Boolean(token) && auth.mode !== "trusted-proxy" && auth.mode !== "none";
	const run = async () => {
		const authResult = await authorizeConnect({
			auth,
			connectAuth: token ? {
				token,
				password: token
			} : null,
			req: params.req,
			browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req, params.cfg),
			trustedProxies: params.trustedProxies,
			allowRealIpFallback: params.allowRealIpFallback,
			rateLimiter: params.rateLimiter,
			clientIp,
			rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET,
			deferRateLimitFailure: canUseDeviceTokenFallback
		});
		const authGeneration = resolveSharedGatewaySessionGeneration(auth, params.trustedProxies);
		let resolvedAuthResult = authResult;
		let deviceScopes;
		if (!authResult.ok && authResult.reason !== "proxy_attribution_required" && canUseDeviceTokenFallback && token) {
			const recordSharedSecretFailure = async () => {
				if (authResult.reason === "token_mismatch" || authResult.reason === "password_mismatch") await params.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
			};
			const deviceRateCheck = params.rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
			if (deviceRateCheck && !deviceRateCheck.allowed) {
				await recordSharedSecretFailure();
				resolvedAuthResult = {
					ok: false,
					reason: "rate_limited",
					rateLimited: true,
					retryAfterMs: deviceRateCheck.retryAfterMs
				};
			} else {
				const verifiedScopes = await verifyHttpOperatorDeviceToken(token, authGeneration, params.requiredDeviceScopes);
				if (verifiedScopes) {
					deviceScopes = verifiedScopes;
					params.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
					resolvedAuthResult = {
						ok: true,
						method: "device-token"
					};
				} else {
					await recordSharedSecretFailure();
					await params.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
				}
			}
		}
		return {
			authResult: resolvedAuthResult,
			authGeneration,
			...deviceScopes ? { deviceOperatorScopes: deviceScopes } : {}
		};
	};
	if (!canUseDeviceTokenFallback || !params.rateLimiter) return await run();
	return await withSerializedCredentialFallbackAttempt({
		limiter: params.rateLimiter,
		ip: clientIp,
		run
	});
}
/** Authorize a read-only same-origin Control UI request, including paired devices. */
async function authorizeControlUiReadRequestOrReply(params) {
	const auth = params.auth;
	const cfg = params.cfg ?? getRuntimeConfig();
	const hasCurrentClientAuthority = captureHttpRequestAuthority({
		...params,
		auth: auth ?? {
			mode: "none",
			allowTailscale: false
		}
	});
	if (!auth) {
		params.onPluginFrameGrants?.([]);
		return bindHttpResponseAuthority({
			authMethod: "none",
			operatorScopes: [...CLI_DEFAULT_OPERATOR_SCOPES]
		}, params.res, hasCurrentClientAuthority);
	}
	const token = resolveControlUiReadAuthToken(params.req, params.allowQueryToken);
	const { authResult, authGeneration, deviceOperatorScopes } = await checkHttpOperatorCredentials({
		...params,
		cfg,
		auth,
		token,
		rateLimiter: token ? params.rateLimiter : void 0
	}, authorizeControlUiReadHttpGatewayConnect);
	if (!authResult.ok) {
		sendGatewayAuthFailure(params.res, authResult);
		return null;
	}
	const profileAuth = await checkAuthenticatedHttpUserProfile({
		authResult,
		cfg,
		getRuntimeConfig: params.getRuntimeConfig,
		req: params.req,
		res: params.res
	});
	if (!profileAuth.ok) {
		sendGatewayHttpAuthFailure(params.res, profileAuth.authResult);
		return null;
	}
	const authenticatedProfile = profileAuth.profile;
	if (!bindHttpOperatorAccessAuthority(params.res, authenticatedProfile.operatorAccessAuthority)) return null;
	if (!hasCurrentClientAuthority()) {
		sendUnauthorized(params.res);
		return null;
	}
	const authMethod = authResult.method ?? "none";
	const trustDeclaredOperatorScopes = authMethod === "trusted-proxy" || authMethod === "tailscale";
	const operatorScopes = resolveControlUiReadOperatorScopes(params.req, authMethod, deviceOperatorScopes, authenticatedProfile);
	params.onPluginFrameGrants?.(setControlUiPluginAuthCookieForRequest(params.req, params.res, authMethod, trustDeclaredOperatorScopes, authGeneration, cfg, operatorScopes, authenticatedProfile.authenticatedUserProfile?.profileId));
	const scopeAuth = authorizeOperatorScopesForMethod(params.requiredOperatorMethod ?? "assistant.media.get", operatorScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(params.res, scopeAuth.missingScope);
		return null;
	}
	return bindHttpResponseAuthority({
		authMethod,
		operatorScopes,
		...authenticatedProfile
	}, params.res, hasCurrentClientAuthority);
}
/**
* Session byte routes cannot apply the client-specific `sessions.list` filter.
* Require its read scope plus admin, whose owner view is not narrowed by that filter.
*/
async function authorizeControlUiSessionOwnerReadRequestOrReply(params) {
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...params,
		requiredOperatorMethod: "sessions.list"
	});
	if (!requestAuth || requestAuth.operatorScopes.includes("operator.admin")) return requestAuth;
	sendJson(params.res, 403, {
		ok: false,
		error: {
			message: "owner access required",
			type: "forbidden"
		}
	});
	return null;
}
async function authorizeGatewayHttpRequestOrReply(params, allowDeviceToken = false) {
	const result = await checkGatewayHttpRequestAuth(params, allowDeviceToken);
	if (!result.ok) {
		sendGatewayHttpAuthFailure(params.res, result.authResult);
		return null;
	}
	if (!bindHttpOperatorAccessAuthority(params.res, result.requestAuth.operatorAccessAuthority)) return null;
	return bindHttpResponseAuthority(result.requestAuth, params.res, result.requestAuth.hasCurrentClientAuthority);
}
function setControlUiPluginAuthCookieForRequest(req, res, authMethod, trustDeclaredOperatorScopes, authGeneration, cfg, authenticatedScopes, authenticatedProfileId) {
	const scopes = authenticatedScopes ?? (usesSharedSecretGatewayMethod(authMethod) ? [...CLI_DEFAULT_OPERATOR_SCOPES] : authMethod === "trusted-proxy" || authMethod === "tailscale" ? resolveTrustedHttpOperatorScopes(req, { trustDeclaredOperatorScopes }) : []);
	const grants = listControlUiPluginTabAuthGrants(scopes);
	if (grants.length > 0) return setControlUiPluginAuthCookie(res, grants, {
		generation: resolveControlUiPluginAuthCookieGeneration(authGeneration, cfg),
		basePath: cfg.gateway?.controlUi?.basePath,
		request: req,
		...authenticatedProfileId ? { profileId: authenticatedProfileId } : {}
	});
	return [];
}
async function authorizePluginGatewayHttpRequestOrReply(params) {
	const authGeneration = resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies);
	const hasCurrentClientAuthority = captureHttpRequestAuthority(params);
	const cookieAuth = authorizeControlUiPluginCookieRequest(params.req, {
		requestPath: params.requestPath,
		authGeneration,
		res: params.res
	});
	if (cookieAuth) return bindControlUiPluginCookieRequestAuthority(cookieAuth, {
		...params,
		hasCurrentClientAuthority
	});
	if (params.res.writableEnded || params.res.destroyed) return null;
	const requestAuth = await authorizeGatewayHttpRequestOrReply(params, true);
	if (requestAuth?.authMethod === "device-token") {
		const token = getBearerToken(params.req);
		const requiredDeviceScopes = [...requestAuth.deviceOperatorScopes ?? []];
		const revalidate = requestAuth.revalidate;
		requestAuth.revalidate = async () => {
			await revalidate();
			const { authResult } = await checkHttpOperatorCredentials({
				...params,
				auth: params.getResolvedAuth?.() ?? params.auth,
				token,
				requiredDeviceScopes,
				rateLimiter: void 0
			}, authorizeHttpGatewayConnect);
			await revalidate();
			if (!authResult.ok || authResult.method !== "device-token") {
				sendUnauthorized(params.res);
				throw new Error("Unauthorized");
			}
		};
	}
	return requestAuth ? {
		requestAuth,
		operatorScopes: params.resolveOperatorScopes(params.req, requestAuth)
	} : null;
}
async function checkGatewayHttpRequestAuth(params, allowDeviceToken = false) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const hasCurrentClientAuthority = captureHttpRequestAuthority(params);
	const token = getBearerToken(params.req);
	const { authResult, deviceOperatorScopes } = allowDeviceToken ? await checkHttpOperatorCredentials({
		...params,
		cfg,
		token
	}, authorizeHttpGatewayConnect) : { authResult: await authorizeHttpGatewayConnect({
		auth: params.auth,
		connectAuth: token ? {
			token,
			password: token
		} : null,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: params.rateLimiter,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req, cfg)
	}) };
	if (!authResult.ok) return {
		ok: false,
		authResult
	};
	if (!hasCurrentClientAuthority()) return {
		ok: false,
		authResult: {
			ok: false,
			reason: "unauthorized"
		}
	};
	const profileAuth = await checkAuthenticatedHttpUserProfile({
		authResult,
		cfg,
		getRuntimeConfig: params.getRuntimeConfig,
		req: params.req,
		res: params.res
	});
	if (!profileAuth.ok) return profileAuth;
	const authenticatedProfile = profileAuth.profile;
	if (!hasCurrentClientAuthority()) return {
		ok: false,
		authResult: {
			ok: false,
			reason: "unauthorized"
		}
	};
	return {
		ok: true,
		requestAuth: {
			hasCurrentClientAuthority: () => hasCurrentClientAuthority() && hasCurrentGatewayOperatorAccess(authenticatedProfile.operatorAccessAuthority),
			authMethod: authResult.method,
			...authResult.user ? { user: authResult.user } : {},
			trustDeclaredOperatorScopes: authResult.method !== "device-token" && !usesSharedSecretGatewayMethod(authResult.method),
			...deviceOperatorScopes ? { deviceOperatorScopes: applyHttpOperatorRoleScopeCeiling(deviceOperatorScopes, authenticatedProfile) } : {},
			...usesSharedSecretGatewayMethod(authResult.method) ? { operatorRoleActor: { kind: "system" } } : {},
			...authenticatedProfile
		}
	};
}
async function authorizeScopedGatewayHttpRequestOrReply(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...params,
		cfg,
		trustedProxies: params.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback
	});
	if (!requestAuth) return null;
	const operatorScopes = params.resolveOperatorScopes(params.req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForMethod(params.operatorMethod, operatorScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(params.res, scopeAuth.missingScope);
		return null;
	}
	return {
		cfg,
		requestAuth,
		operatorScopes
	};
}
function resolveTrustedHttpOperatorScopes(req, requestAuth) {
	if (!requestAuth.trustDeclaredOperatorScopes) return [];
	const headerValue = getHeader(req, "x-openclaw-scopes");
	return applyHttpOperatorRoleScopeCeiling(headerValue === void 0 ? [...CLI_DEFAULT_OPERATOR_SCOPES] : headerValue.split(",").map((scope) => scope.trim()).filter((scope) => scope.length > 0), requestAuth);
}
function resolveSharedSecretHttpOperatorScopes(req, requestAuth) {
	if (usesSharedSecretGatewayMethod(requestAuth.authMethod)) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	return resolveTrustedHttpOperatorScopes(req, requestAuth);
}
function resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth) {
	return resolveSharedSecretHttpOperatorScopes(req, requestAuth).includes(ADMIN_SCOPE);
}
function authorizeOpenAiCompatibleHttpModelOverride(req, requestAuth) {
	if (!normalizeOptionalString(getHeader(req, "x-openclaw-model")) || resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth)) return { allowed: true };
	return {
		allowed: false,
		missingScope: ADMIN_SCOPE
	};
}
//#endregion
export { respondControlUiPluginAuthCookieProbe as _, authorizePluginGatewayHttpRequestOrReply as a, resolveHttpBrowserOriginPolicy as c, resolveTrustedHttpOperatorScopes as d, setControlUiPluginAuthCookieForRequest as f, resolveHttpProfile as g, applyHttpOperatorRoleScopeCeiling as h, authorizeOpenAiCompatibleHttpModelOverride as i, resolveOpenAiCompatibleHttpSenderIsOwner as l, authorizeControlUiPluginCookieRequest as m, authorizeControlUiSessionOwnerReadRequestOrReply as n, authorizeScopedGatewayHttpRequestOrReply as o, assertGatewayHttpRequestCurrent as p, authorizeGatewayHttpRequestOrReply as r, checkGatewayHttpRequestAuth as s, authorizeControlUiReadRequestOrReply as t, resolveSharedSecretHttpOperatorScopes as u };

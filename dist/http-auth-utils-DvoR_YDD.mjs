import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { p as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as authorizeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-Bcx3NDQr.mjs";
import { n as getBearerToken, r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { c as projectUserProfileDisplay } from "./user-profiles-internal-CBUpoSHj.mjs";
import { c as prepareUserProfileCatalog, t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
import { p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN } from "./auth-rate-limit-ByL4y2DQ.mjs";
import { a as getRemoteControlUiIngressContext, c as prepareGatewayIngressAttribution, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { o as resolveBrowserOriginPolicy } from "./origin-check-DI_7InMd.mjs";
import { t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-BtnsIW6U.mjs";
import { n as authorizeControlUiReadHttpGatewayConnect, r as authorizeHttpGatewayConnect } from "./auth-fv7y-hds.mjs";
import { o as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { t as shouldUseGatewayOwnerProfile } from "./gateway-owner-profile-XemZih0r.mjs";
import { a as hasGatewayOperatorAccessPolicies, i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, o as resolveGatewayOperatorAccessAuthority } from "./operator-access-policy-D9L4Y9uO.mjs";
import { r as listControlUiPluginTabAuthGrants } from "./control-ui-plugin-tabs-y8H4PDI0.mjs";
import { i as listDevicePairing } from "./device-pairing-_Xo0MHGf.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as captureGatewayAuthPolicy } from "./auth-policy-BnNZPB_e.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { c as sendGatewayAuthFailure, f as sendMissingScopeForbidden, m as sendUnauthorized, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { c as sendGatewayHttpAuthFailure, i as captureHttpRequestAuthority, r as bindHttpResponseAuthority, s as bindHttpOperatorAccessAuthority, t as GatewayHttpRequestAuthorityError } from "./http-request-authority-Dyt1S0uG.mjs";
import { n as ensureCanonicalUserProfileForEmail, r as ensureCanonicalUserProfileForTailscaleIdentity, t as ensureCanonicalGatewayOwnerProfile } from "./user-profile-writes-DOkiscfg.mjs";
import { t as createAuthenticatedGitHubIdentitySync } from "./github-user-identity-PqDuRpmc.mjs";
import { n as verifyPairingToken } from "./pairing-token-CzXJ-1-p.mjs";
import { i as verifyDeviceToken } from "./device-pairing-tokens-CSqQ4lre.mjs";
import { a as setControlUiPluginAuthCookie, r as resolveControlUiPluginAuthCookieGrants } from "./control-ui-plugin-auth-cookie-Mm1ufGT4.mjs";
import { t as resolveHostAccountName } from "./host-account-name-BnggJSH4.mjs";
import { isDeepStrictEqual } from "node:util";
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
function checkHttpCookieUserProfile(cfg, profileId) {
	if (!profileId && (cfg.gateway?.roles || hasGatewayOperatorAccessPolicies(cfg))) return failedHttpProfileAuthentication();
	if (!profileId) return {
		ok: true,
		profile: {}
	};
	try {
		return {
			ok: true,
			profile: resolveHttpProfile(profileId, cfg)
		};
	} catch (error) {
		return failedHttpProfileAuthentication(error);
	}
}
/** Response disclosure retains the existing profile owner through its last synchronous check. */
async function prepareHttpUserProfileCatalog(res) {
	if (res.writableEnded || res.destroyed) return false;
	let catalog;
	try {
		catalog = await prepareUserProfileCatalog();
	} catch {
		return false;
	}
	const release = () => {
		res.off("finish", release);
		res.off("close", release);
		catalog.release();
	};
	if (res.writableEnded || res.destroyed) {
		release();
		return false;
	}
	res.once("finish", release);
	res.once("close", release);
	return true;
}
function usesSharedSecretGatewayMethod(method) {
	return method === "token" || method === "password";
}
async function resolveAuthenticatedHttpUserProfile(params) {
	const ingress = getRemoteControlUiIngressContext(params.req);
	if (ingress) {
		assertRemoteControlUiIngressCurrent(ingress);
		const principal = ingress.resolvePrincipal();
		return {
			authenticatedUserProfile: principal.authenticatedUserProfile,
			operatorRolePolicy: principal.operatorRolePolicy,
			operatorRoleActor: principal.operatorRoleActor,
			operatorAccessAuthority: principal.operatorAccessAuthority
		};
	}
	const readAdmissionPolicy = (cfg) => ({
		auth: {
			...cfg.gateway?.auth,
			identityScopes: void 0
		},
		roles: cfg.gateway?.roles,
		trustedProxies: cfg.gateway?.trustedProxies,
		allowRealIpFallback: cfg.gateway?.allowRealIpFallback,
		browserOrigin: resolveBrowserOriginPolicy({
			req: params.req,
			cfg
		})
	});
	const admissionPolicy = structuredClone(readAdmissionPolicy(params.cfg));
	const assertCurrent = () => {
		if (params.req.aborted || params.req.socket?.destroyed || params.res?.destroyed || params.res?.writableEnded || !isDeepStrictEqual(admissionPolicy, readAdmissionPolicy(params.getRuntimeConfig?.() ?? readRuntimeConfig()))) throw new Error("HTTP profile acquisition authority expired");
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
	if (cfg && hasGatewayOperatorAccessPolicies(cfg)) {
		(await prepareUserProfileCatalog()).release();
		assertCurrent();
	}
	const authority = await prepareUserProfileRoleAuthority(profileId);
	assertCurrent();
	if (!authority?.isCurrent()) throw new Error("HTTP profile authority changed during acquisition");
	const display = authority.display;
	const operatorRolePolicy = cfg ? resolveOperatorRolePolicyForAssignment(display.id, authority.role, cfg, authority.githubLogin ?? null) : void 0;
	const operatorAccessAuthority = cfg ? resolveGatewayOperatorAccessAuthority(profileId, cfg) : void 0;
	assertCurrent();
	if (!authority.isCurrent()) throw new Error("HTTP profile authority changed during acquisition");
	return {
		...projectHttpProfile(display, updatedAt, operatorRolePolicy, operatorAccessAuthority),
		...cfg ? { preparedSessionProfile: {
			profileId: authority.profileId,
			aliases: new Set(authority.aliases),
			role: authority.role,
			githubLogin: authority.githubLogin
		} } : {}
	};
}
/** Cookie and media disclosure retain their existing synchronous final policy check. */
function resolveHttpProfile(profileId, cfg) {
	const profile = captureResidentUserProfileAccess(profileId).assertCurrent();
	const display = projectUserProfileDisplay(profile);
	const operatorRolePolicy = cfg ? resolveOperatorRolePolicyForAssignment(profile.id, profile.role ?? null, cfg, profile.githubLogin ?? null) : void 0;
	const operatorAccessAuthority = cfg ? resolveGatewayOperatorAccessAuthority(profileId, cfg) : void 0;
	return projectHttpProfile(display, profile.updated_at, operatorRolePolicy, operatorAccessAuthority);
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
//#region src/gateway/http-auth-plugin-cookie.ts
function resolveControlUiPluginAuthCookieGeneration(authGeneration, cfg) {
	return authGeneration ? sha256Base64Url(`${authGeneration}\0${captureGatewayAuthPolicy(cfg, null).generation}`) : void 0;
}
function readControlUiPluginCookieRequest(req, params) {
	const ingress = getRemoteControlUiIngressContext(req);
	assertRemoteControlUiIngressCurrent(ingress);
	if (getBearerToken(req) || req.method !== "GET" && req.method !== "HEAD") return null;
	const cfg = readRuntimeConfig();
	const grants = resolveControlUiPluginAuthCookieGrants(req, {
		requestPath: params.requestPath,
		generation: resolveControlUiPluginAuthCookieGeneration(params.authGeneration, cfg)
	});
	if (grants.length === 0) return null;
	const profileId = grants[0]?.profileId;
	if (grants.some((grant) => grant.profileId !== profileId)) return null;
	return {
		cfg,
		grants,
		profileId
	};
}
async function prepareControlUiPluginCookieRequest(req, params) {
	const selected = readControlUiPluginCookieRequest(req, params);
	if (!getRemoteControlUiIngressContext(req) && selected?.profileId && !await prepareHttpUserProfileCatalog(params.res)) return null;
	return authorizeControlUiPluginCookieRequest(req, params);
}
function authorizeControlUiPluginCookieRequest(req, params) {
	const selected = readControlUiPluginCookieRequest(req, params);
	if (!selected) return null;
	const { cfg, grants, profileId } = selected;
	const principal = getRemoteControlUiIngressContext(req)?.resolvePrincipal();
	const profileAuth = principal ? {
		ok: true,
		profile: {
			authenticatedUserProfile: principal.authenticatedUserProfile,
			operatorRolePolicy: principal.operatorRolePolicy,
			operatorRoleActor: principal.operatorRoleActor,
			operatorAccessAuthority: principal.operatorAccessAuthority
		}
	} : checkHttpCookieUserProfile(cfg, profileId);
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
	const requestAuth = bindHttpResponseAuthority(cookieAuth.requestAuth, params.res, params.hasCurrentClientAuthority);
	const revalidate = async () => {
		requestAuth.assertCurrent();
		const current = authorizeControlUiPluginCookieRequest(params.req, {
			requestPath: params.requestPath,
			authGeneration: resolveSharedGatewaySessionGeneration(params.getResolvedAuth?.() ?? params.auth, params.trustedProxies ?? readRuntimeConfig().gateway?.trustedProxies)
		});
		const currentGrants = current?.requestAuth.controlUiPluginGrants ?? [];
		requestAuth.assertCurrent();
		if (!isDeepStrictEqual(current?.requestAuth.operatorRolePolicy, cookieAuth.requestAuth.operatorRolePolicy) || !cookieAuth.requestAuth.controlUiPluginGrants.every((admitted) => currentGrants.some((grant) => grant.pluginId === admitted.pluginId && grant.path === admitted.path && grant.match === admitted.match && grant.profileId === admitted.profileId && roleScopesAllow({
			role: "operator",
			requestedScopes: admitted.scopes,
			allowedScopes: grant.scopes
		})))) {
			sendUnauthorized(params.res);
			throw new GatewayHttpRequestAuthorityError("Unauthorized");
		}
	};
	return {
		...cookieAuth,
		requestAuth: {
			...requestAuth,
			revalidate
		}
	};
}
//#endregion
//#region src/gateway/http-auth-utils.ts
const CONTROL_UI_OPERATOR_READ_SCOPE = "operator.read";
const CONTROL_UI_OPERATOR_ROLE = "operator";
function resolveHttpBrowserOriginPolicy(req, cfg = readRuntimeConfig()) {
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
	if (authMethod === "remote-ingress") return getRemoteControlUiIngressContext(req)?.resolvePrincipal().scopes ?? [];
	if (authMethod === "device-token") return applyHttpOperatorRoleScopeCeiling(deviceScopes ?? [], authenticatedRequest);
	if (authMethod === "trusted-proxy" || authMethod === "tailscale") return resolveTrustedHttpOperatorScopes(req, {
		trustDeclaredOperatorScopes: true,
		...authenticatedRequest
	});
	return authMethod === "bootstrap-token" ? [] : [...CLI_DEFAULT_OPERATOR_SCOPES];
}
async function checkHttpOperatorCredentials(params, authorizeConnect) {
	const { auth, token } = params;
	const remoteIngress = getRemoteControlUiIngressContext(params.req);
	if (remoteIngress) {
		assertRemoteControlUiIngressCurrent(remoteIngress);
		return {
			authResult: token ? {
				ok: false,
				reason: "unauthorized"
			} : {
				ok: true,
				method: "remote-ingress"
			},
			authGeneration: resolveSharedGatewaySessionGeneration(auth, params.trustedProxies)
		};
	}
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
	const auth = params.getResolvedAuth?.() ?? params.auth;
	const cfg = params.cfg ?? readRuntimeConfig();
	const hasCurrentClientAuthority = captureHttpRequestAuthority({
		...params,
		auth: auth ?? {
			mode: "none",
			allowTailscale: false
		}
	});
	if (!auth) {
		if (getRemoteControlUiIngressContext(params.req)) {
			sendUnauthorized(params.res);
			return null;
		}
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
		if (params.replyOnFailure !== false) sendGatewayAuthFailure(params.res, authResult);
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
		if (params.replyOnFailure !== false) sendGatewayHttpAuthFailure(params.res, profileAuth.authResult);
		return null;
	}
	const authenticatedProfile = profileAuth.profile;
	if (!bindHttpOperatorAccessAuthority(params.res, authenticatedProfile.operatorAccessAuthority, params.replyOnFailure)) return null;
	if (!hasCurrentClientAuthority()) {
		if (params.replyOnFailure !== false) sendUnauthorized(params.res);
		return null;
	}
	const authMethod = authResult.method ?? "none";
	const operatorScopes = resolveControlUiReadOperatorScopes(params.req, authMethod, deviceOperatorScopes, authenticatedProfile);
	const scopeAuth = authorizeOperatorScopesForMethod(params.requiredOperatorMethod ?? "assistant.media.get", operatorScopes);
	if (!scopeAuth.allowed) {
		if (params.replyOnFailure !== false) sendMissingScopeForbidden(params.res, scopeAuth.missingScope);
		return null;
	}
	const requestAuth = bindHttpResponseAuthority({
		authMethod,
		operatorScopes,
		...authenticatedProfile
	}, params.res, hasCurrentClientAuthority);
	if (authMethod === "device-token" && token) {
		const verifyCurrentDeviceToken = () => verifyHttpOperatorDeviceToken(token, authGeneration, deviceOperatorScopes);
		if (!await verifyCurrentDeviceToken() || !requestAuth.hasCurrentClientAuthority()) {
			if (params.replyOnFailure !== false) {
				requestAuth.assertCurrent();
				sendUnauthorized(params.res);
			}
			return null;
		}
		const assertCurrent = requestAuth.assertCurrent;
		requestAuth.revalidate = async () => {
			assertCurrent();
			const scopes = await verifyCurrentDeviceToken();
			assertCurrent();
			if (!scopes) {
				sendUnauthorized(params.res);
				throw new GatewayHttpRequestAuthorityError("Unauthorized");
			}
		};
	}
	params.onPluginFrameGrants?.(setControlUiPluginAuthCookieForRequest(params.req, params.res, authGeneration, cfg, operatorScopes, authenticatedProfile.authenticatedUserProfile?.profileId));
	return requestAuth;
}
/**
* Session byte routes cannot apply the client-specific `sessions.list` filter.
* Require its read scope plus an unfiltered owner view. Locally approved ingress
* grants retain that view without acquiring admin scope.
*/
async function authorizeControlUiSessionOwnerReadRequestOrReply(params) {
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...params,
		requiredOperatorMethod: "sessions.list"
	});
	if (!requestAuth || requestAuth.operatorScopes.includes("operator.admin") || getRemoteControlUiIngressContext(params.req) && requestAuth.authenticatedUserProfile?.profileId === "gateway-owner") return requestAuth;
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
function setControlUiPluginAuthCookieForRequest(req, res, authGeneration, cfg, authenticatedScopes, authenticatedProfileId) {
	const grants = listControlUiPluginTabAuthGrants(authenticatedScopes);
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
	const cookieAuth = await prepareControlUiPluginCookieRequest(params.req, {
		requestPath: params.requestPath,
		authGeneration,
		res: params.res
	});
	if (cookieAuth) {
		if (!hasCurrentClientAuthority()) {
			sendUnauthorized(params.res);
			return null;
		}
		return bindControlUiPluginCookieRequestAuthority(cookieAuth, {
			...params,
			hasCurrentClientAuthority
		});
	}
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
				throw new GatewayHttpRequestAuthorityError("Unauthorized");
			}
		};
	}
	return requestAuth ? {
		requestAuth,
		operatorScopes: params.resolveOperatorScopes(params.req, requestAuth)
	} : null;
}
async function checkGatewayHttpRequestAuth(params, allowDeviceToken = false) {
	const cfg = params.cfg ?? readRuntimeConfig();
	const hasCurrentClientAuthority = captureHttpRequestAuthority(params);
	const token = getBearerToken(params.req);
	const { authResult, deviceOperatorScopes } = allowDeviceToken || getRemoteControlUiIngressContext(params.req) ? await checkHttpOperatorCredentials({
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
	const cfg = params.cfg ?? readRuntimeConfig();
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...params,
		cfg,
		trustedProxies: params.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback
	});
	if (!requestAuth) return null;
	const operatorScopes = resolveSharedSecretHttpOperatorScopes(params.req, requestAuth);
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
	const ingress = getRemoteControlUiIngressContext(req);
	if (ingress) {
		const scopes = ingress.resolvePrincipal().scopes;
		const header = getHeader(req, "x-openclaw-scopes");
		return header === void 0 ? scopes : intersectOperatorScopes(scopes, header.split(",").map((scope) => scope.trim()).filter(Boolean));
	}
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
export { resolveHttpProfile as _, authorizePluginGatewayHttpRequestOrReply as a, resolveHttpBrowserOriginPolicy as c, resolveTrustedHttpOperatorScopes as d, setControlUiPluginAuthCookieForRequest as f, prepareHttpUserProfileCatalog as g, applyHttpOperatorRoleScopeCeiling as h, authorizeOpenAiCompatibleHttpModelOverride as i, resolveOpenAiCompatibleHttpSenderIsOwner as l, prepareControlUiPluginCookieRequest as m, authorizeControlUiSessionOwnerReadRequestOrReply as n, authorizeScopedGatewayHttpRequestOrReply as o, authorizeControlUiPluginCookieRequest as p, authorizeGatewayHttpRequestOrReply as r, checkGatewayHttpRequestAuth as s, authorizeControlUiReadRequestOrReply as t, resolveSharedSecretHttpOperatorScopes as u };

import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { a as isLoopbackAddress, b as resolveLocalInterfaceAddressMatch, d as isTrustedProxyAddress, r as isLocalDirectRequest, x as resolveRequestClientIpFromHeaders } from "./net-C6WEu3pd.mjs";
import "./auth-resolve-BmUDP1m_.mjs";
import { r as isInvalidGatewaySecret, t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BLCyfEDY.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { t as checkBrowserOrigin } from "./origin-check-BATVw76z.mjs";
import "./auth-rate-limit-CnTz49S4.mjs";
import { a as prepareGatewayIngressAttribution, n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-BJWxHT2f.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-C-bwOG0P.mjs";
//#region src/gateway/auth.ts
const LEGACY_OPENCLAW_ENV_NOTE = " Legacy CLAWDBOT_* and MOLTBOT_* environment variables are ignored; use OPENCLAW_* names.";
function resolveGatewayAuthRequestContext(params) {
	const { req, trustedProxies } = params;
	const authSurface = params.authSurface ?? "http";
	const attributed = params.ingressAttribution?.kind === "unattributable-proxy" ? void 0 : params.ingressAttribution;
	const fallbackIp = attributed?.clientIp ?? resolveRequestClientIpFromHeaders(req, trustedProxies, params.allowRealIpFallback === true) ?? req?.socket?.remoteAddress;
	const localDirect = attributed ? attributed.kind === "direct-local" : isLocalDirectRequest(req);
	return {
		authSurface,
		limiter: params.rateLimiter,
		subject: attributed && !localDirect ? attributed.rateLimit.subject.key : params.clientIp ?? attributed?.rateLimit.subject.key ?? fallbackIp,
		rateLimitScope: params.rateLimitScope ?? "shared-secret",
		localDirect,
		resetOnSuccess: attributed?.rateLimit.resetOnSuccess ?? true,
		ingressAttribution: params.ingressAttribution
	};
}
function hasExplicitSharedSecretAuth(connectAuth) {
	return Boolean(normalizeOptionalString(connectAuth?.token) || normalizeOptionalString(connectAuth?.password));
}
function resolveConnectSecret(mode, connectAuth) {
	return connectAuth?.[mode] ?? connectAuth?.[mode === "token" ? "password" : "token"];
}
/** Validate that the selected gateway auth mode has the required resolved credentials/config. */
function assertGatewayAuthConfigured(auth, rawAuthConfig) {
	if ((auth.mode === "token" || auth.mode === "password") && isRedactedSecretValue(auth[auth.mode])) assertGatewayAuthNotKnownWeak(auth);
	if (auth.mode === "token" && isInvalidGatewaySecret(auth.token)) throw new Error("Gateway token must not be blank or the literal string undefined/null. Run `openclaw doctor --fix --generate-gateway-token` for an inline token, or rotate its external secret source.");
	if (auth.mode === "token" && !auth.token) {
		if (auth.allowTailscale) return;
		throw new Error(`gateway auth mode is token, but no token was configured (set gateway.auth.token or OPENCLAW_GATEWAY_TOKEN).${LEGACY_OPENCLAW_ENV_NOTE}`);
	}
	if (auth.mode === "password" && !auth.password) {
		if (rawAuthConfig?.password != null && typeof rawAuthConfig.password !== "string") throw new Error("gateway auth mode is password, but gateway.auth.password contains a provider reference object instead of a resolved string — bootstrap secrets (gateway.auth.password) must be plaintext strings or set via the OPENCLAW_GATEWAY_PASSWORD environment variable because the secrets provider system has not initialised yet at gateway startup");
		throw new Error(`gateway auth mode is password, but no password was configured.${LEGACY_OPENCLAW_ENV_NOTE}`);
	}
	if (auth.mode === "trusted-proxy") {
		if (!auth.trustedProxy) throw new Error("gateway auth mode is trusted-proxy, but no trustedProxy config was provided (set gateway.auth.trustedProxy)");
		if (!auth.trustedProxy.userHeader || auth.trustedProxy.userHeader.trim() === "") throw new Error("gateway auth mode is trusted-proxy, but trustedProxy.userHeader is empty (set gateway.auth.trustedProxy.userHeader)");
		if (auth.token) throw new Error("gateway auth mode is trusted-proxy, but a shared token is also configured; remove gateway.auth.token / OPENCLAW_GATEWAY_TOKEN because trusted-proxy and token auth are mutually exclusive");
	}
}
/**
* Check if the request came from a trusted proxy and extract user identity.
* Returns the user identity if valid, or null with a reason if not.
*/
function authorizeTrustedProxy(params) {
	const { req, trustedProxies, trustedProxyConfig } = params;
	if (!req) return { reason: "trusted_proxy_no_request" };
	const remoteAddr = req.socket?.remoteAddress;
	if (!remoteAddr || !isTrustedProxyAddress(remoteAddr, trustedProxies)) return { reason: "trusted_proxy_untrusted_source" };
	const remoteIsLoopback = isLoopbackAddress(remoteAddr);
	if (remoteIsLoopback && trustedProxyConfig.allowLoopback !== true) return { reason: "trusted_proxy_loopback_source" };
	if (!remoteIsLoopback) {
		const localInterfaceMatch = resolveLocalInterfaceAddressMatch(remoteAddr);
		if (localInterfaceMatch === void 0) return { reason: "trusted_proxy_local_interface_check_failed" };
		if (localInterfaceMatch) return { reason: "trusted_proxy_local_interface_source" };
	}
	const requiredHeaders = trustedProxyConfig.requiredHeaders ?? [];
	for (const header of requiredHeaders) {
		const value = getHeader(req, header);
		if (!value || value.trim() === "") return { reason: `trusted_proxy_missing_header_${header}` };
	}
	const userHeaderValue = getHeader(req, trustedProxyConfig.userHeader);
	if (!userHeaderValue || userHeaderValue.trim() === "") return { reason: "trusted_proxy_user_missing" };
	const user = userHeaderValue.trim();
	const allowUsers = trustedProxyConfig.allowUsers ?? [];
	if (allowUsers.length > 0 && !allowUsers.includes(user)) return { reason: "trusted_proxy_user_not_allowed" };
	return { user };
}
function shouldAllowTailscaleHeaderAuth(authSurface) {
	return authSurface === "ws-control-ui" || authSurface === "http-control-ui-read";
}
function authorizeHttpBrowserOrigin(params) {
	if (params.authSurface === "ws-control-ui") return null;
	const origin = params.browserOriginPolicy?.origin?.trim();
	if (!origin) return params.requireSameOriginFetchWithoutOrigin && normalizeLowercaseStringOrEmpty(params.browserOriginPolicy?.fetchSite) !== "same-origin" ? {
		ok: false,
		reason: params.reason
	} : null;
	return checkBrowserOrigin({
		requestHost: params.browserOriginPolicy?.requestHost,
		origin,
		allowedOrigins: params.allowWildcardOrigin === false ? params.browserOriginPolicy?.allowedOrigins?.filter((candidate) => normalizeLowercaseStringOrEmpty(candidate) !== "*") : params.browserOriginPolicy?.allowedOrigins,
		allowHostHeaderOriginFallback: params.browserOriginPolicy?.allowHostHeaderOriginFallback,
		isLocalClient: params.isLocalClient
	}).ok ? null : {
		ok: false,
		reason: params.reason
	};
}
function authorizeTrustedProxyBrowserOrigin(params) {
	return authorizeHttpBrowserOrigin({
		...params,
		isLocalClient: false,
		reason: "trusted_proxy_origin_not_allowed"
	});
}
async function authorizeSharedSecretAuth(params) {
	if (params.method === "password" && isRedactedSecretValue(params.configuredSecret)) return {
		ok: false,
		reason: "password_redacted_config"
	};
	if (!params.configuredSecret || params.method === "token" && isInvalidGatewaySecret(params.configuredSecret)) return {
		ok: false,
		reason: `${params.method}_missing_config`
	};
	if (!params.providedSecret) return {
		ok: false,
		reason: `${params.method}_missing`
	};
	if (!safeEqualSecret(params.providedSecret, params.configuredSecret)) {
		if (!params.deferRateLimitFailure) await params.limiter?.recordFailureAndDelay(params.ip, params.rateLimitScope);
		return {
			ok: false,
			reason: `${params.method}_mismatch`
		};
	}
	if (params.resetOnSuccess !== false) params.limiter?.reset(params.ip, params.rateLimitScope);
	return {
		ok: true,
		method: params.method
	};
}
function rejectIfRateLimited(params) {
	if (!params.limiter) return;
	const rlCheck = params.limiter.check(params.ip, params.rateLimitScope);
	if (rlCheck.allowed) return;
	return {
		ok: false,
		reason: "rate_limited",
		rateLimited: true,
		retryAfterMs: rlCheck.retryAfterMs
	};
}
/** Authorize a gateway connection, including rate-limit handling around shared-secret failures. */
async function authorizeGatewayConnect(params) {
	const { auth } = params;
	if ((auth.mode === "token" || auth.mode === "password") && isRedactedSecretValue(auth[auth.mode])) return {
		ok: false,
		reason: `${auth.mode}_redacted_config`
	};
	if (auth.mode === "trusted-proxy") {
		if (!auth.trustedProxy) return {
			ok: false,
			reason: "trusted_proxy_config_missing"
		};
		if (!params.trustedProxies || params.trustedProxies.length === 0) return {
			ok: false,
			reason: "trusted_proxy_no_proxies_configured"
		};
	}
	const ingressAttribution = params.ingressAttribution ?? (params.req ? prepareGatewayIngressAttribution({
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		tailscaleWhois: params.tailscaleWhois
	}) : void 0);
	if (ingressAttribution?.kind === "unattributable-proxy") return {
		ok: false,
		reason: PROXY_ATTRIBUTION_REQUIRED_REASON
	};
	const preparedParams = ingressAttribution ? {
		...params,
		ingressAttribution
	} : params;
	const { authSurface, limiter, subject, rateLimitScope } = resolveGatewayAuthRequestContext(preparedParams);
	if (limiter && shouldAllowTailscaleHeaderAuth(authSurface) && auth.allowTailscale && ingressAttribution?.kind === "tailscale-serve") return await withSerializedRateLimitAttempt({
		ip: subject,
		scope: rateLimitScope,
		run: async () => await authorizeGatewayConnectCore(preparedParams)
	});
	return await authorizeGatewayConnectCore(preparedParams);
}
async function authorizeGatewayConnectCore(params) {
	const { auth, connectAuth, req, trustedProxies } = params;
	const { authSurface, limiter, subject, rateLimitScope, localDirect, resetOnSuccess, ingressAttribution } = resolveGatewayAuthRequestContext(params);
	const allowTailscaleHeaderAuth = shouldAllowTailscaleHeaderAuth(authSurface);
	const explicitSharedSecretAuth = hasExplicitSharedSecretAuth(connectAuth);
	if (authSurface === "http-control-ui-read" && auth.allowTailscale && !localDirect && !explicitSharedSecretAuth) {
		const originResult = authorizeHttpBrowserOrigin({
			authSurface,
			browserOriginPolicy: params.browserOriginPolicy,
			isLocalClient: localDirect,
			reason: "origin_not_allowed",
			requireSameOriginFetchWithoutOrigin: true,
			allowWildcardOrigin: false
		});
		if (originResult) return originResult;
	}
	if (auth.mode === "trusted-proxy") {
		if (!auth.trustedProxy) return {
			ok: false,
			reason: "trusted_proxy_config_missing"
		};
		const result = authorizeTrustedProxy({
			req,
			trustedProxies,
			trustedProxyConfig: auth.trustedProxy
		});
		if ("user" in result) {
			if (ingressAttribution?.kind !== "trusted-proxy") return {
				ok: false,
				reason: PROXY_ATTRIBUTION_REQUIRED_REASON
			};
			const originResult = authorizeTrustedProxyBrowserOrigin({
				authSurface,
				browserOriginPolicy: params.browserOriginPolicy
			});
			if (originResult) return originResult;
			return {
				ok: true,
				method: "trusted-proxy",
				user: result.user
			};
		}
		if (localDirect && auth.password && connectAuth?.password) {
			const rateLimitResult = rejectIfRateLimited({
				limiter,
				ip: subject,
				rateLimitScope
			});
			if (rateLimitResult) return rateLimitResult;
			return await authorizeSharedSecretAuth({
				method: "password",
				configuredSecret: auth.password,
				providedSecret: connectAuth.password,
				limiter,
				ip: subject,
				rateLimitScope,
				deferRateLimitFailure: params.deferRateLimitFailure,
				resetOnSuccess
			});
		}
		return {
			ok: false,
			reason: result.reason
		};
	}
	if (auth.mode === "none") {
		if (ingressAttribution?.kind === "trusted-proxy" && ingressAttribution.externalTailscaleExposure === "funnel") return {
			ok: false,
			reason: "gateway_auth_required"
		};
		const originResult = authorizeHttpBrowserOrigin({
			authSurface,
			browserOriginPolicy: params.browserOriginPolicy,
			isLocalClient: localDirect,
			reason: "origin_not_allowed"
		});
		if (originResult) return originResult;
		return {
			ok: true,
			method: "none"
		};
	}
	if (allowTailscaleHeaderAuth && auth.allowTailscale && !localDirect && ingressAttribution?.kind === "tailscale-serve" && !explicitSharedSecretAuth) {
		const verifiedTailscaleUser = await ingressAttribution.verifyIdentity();
		if (verifiedTailscaleUser) {
			limiter?.reset(subject, rateLimitScope);
			return {
				ok: true,
				method: "tailscale",
				user: verifiedTailscaleUser.login,
				tailscaleIdentity: verifiedTailscaleUser
			};
		}
	}
	const rateLimitResult = rejectIfRateLimited({
		limiter,
		ip: subject,
		rateLimitScope
	});
	if (rateLimitResult) return rateLimitResult;
	if (auth.mode === "token" || auth.mode === "password") return await authorizeSharedSecretAuth({
		method: auth.mode,
		configuredSecret: auth[auth.mode],
		providedSecret: resolveConnectSecret(auth.mode, connectAuth),
		limiter,
		ip: subject,
		rateLimitScope,
		deferRateLimitFailure: params.deferRateLimitFailure,
		resetOnSuccess
	});
	await limiter?.recordFailureAndDelay(subject, rateLimitScope);
	return {
		ok: false,
		reason: "unauthorized"
	};
}
/** Authorize an HTTP gateway request with Tailscale forwarded-header auth disabled. */
async function authorizeHttpGatewayConnect(params) {
	return authorizeGatewayConnect({
		...params,
		authSurface: "http"
	});
}
/** Authorize a read-only Control UI HTTP request, including verified Tailscale identity. */
async function authorizeControlUiReadHttpGatewayConnect(params) {
	return authorizeGatewayConnect({
		...params,
		authSurface: "http-control-ui-read"
	});
}
/** Authorize a Control UI websocket request with the WS-specific auth surface. */
async function authorizeWsControlUiGatewayConnect(params) {
	return authorizeGatewayConnect({
		...params,
		authSurface: "ws-control-ui"
	});
}
//#endregion
export { authorizeWsControlUiGatewayConnect as i, authorizeControlUiReadHttpGatewayConnect as n, authorizeHttpGatewayConnect as r, assertGatewayAuthConfigured as t };

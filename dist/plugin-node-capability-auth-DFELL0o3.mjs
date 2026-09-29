import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET } from "./auth-rate-limit-DuWYneOU.mjs";
import { a as prepareGatewayIngressAttribution, n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-C5e071om.mjs";
import { t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { r as authorizeHttpGatewayConnect } from "./auth-CRxiLJL8.mjs";
import { a as hasAuthorizedPluginNodeCapability } from "./plugin-node-capability-BUbmEXwy.mjs";
import { c as resolveHttpBrowserOriginPolicy } from "./http-auth-utils-BJQtuB_7.mjs";
import { t as getBearerToken } from "./http-header-value-Be14tJQx.mjs";
//#region src/gateway/server/plugin-node-capability-auth.ts
/**
* Authorizes plugin HTTP routes that can be reached by node-issued capabilities.
*/
async function authorizePluginNodeCapabilityRequest(params) {
	const { req, auth, trustedProxies, allowRealIpFallback, clients, nodeCapability, capability, malformedScopedPath, rateLimiter } = params;
	if (malformedScopedPath) return {
		ok: false,
		reason: "unauthorized"
	};
	const attribution = prepareGatewayIngressAttribution({
		req,
		trustedProxies,
		allowRealIpFallback
	});
	if (attribution.kind === "unattributable-proxy") return {
		ok: false,
		reason: PROXY_ATTRIBUTION_REQUIRED_REASON
	};
	const token = getBearerToken(req);
	const run = async () => {
		let lastAuthFailure = null;
		if (token) {
			const authResult = await authorizeHttpGatewayConnect({
				auth: {
					...auth,
					allowTailscale: false
				},
				connectAuth: {
					token,
					password: token
				},
				req,
				trustedProxies,
				allowRealIpFallback,
				rateLimiter,
				deferRateLimitFailure: Boolean(capability),
				browserOriginPolicy: resolveHttpBrowserOriginPolicy(req)
			});
			if (authResult.ok) return authResult;
			lastAuthFailure = authResult;
		}
		if (capability && hasAuthorizedPluginNodeCapability({
			clients,
			surface: nodeCapability,
			capability
		})) return { ok: true };
		if (capability && (lastAuthFailure?.reason === "token_mismatch" || lastAuthFailure?.reason === "password_mismatch")) await rateLimiter?.recordFailureAndDelay(attribution.rateLimit.subject.key, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
		return lastAuthFailure ?? {
			ok: false,
			reason: "unauthorized"
		};
	};
	return token && capability && rateLimiter ? await withSerializedCredentialFallbackAttempt({
		limiter: rateLimiter,
		ip: attribution.rateLimit.subject.key,
		run
	}) : await run();
}
//#endregion
export { authorizePluginNodeCapabilityRequest };

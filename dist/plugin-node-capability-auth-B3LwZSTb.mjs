import { n as getBearerToken } from "./http-header-value-BM79-5V8.mjs";
import { a as hasAuthorizedPluginNodeCapability } from "./plugin-node-capability-BlHl5bub.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET } from "./auth-rate-limit-CnTz49S4.mjs";
import { a as prepareGatewayIngressAttribution, n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-BJWxHT2f.mjs";
import { t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-C-bwOG0P.mjs";
import { r as authorizeHttpGatewayConnect } from "./auth-DS7WgSf9.mjs";
import { c as resolveHttpBrowserOriginPolicy } from "./http-auth-utils-Bk1YwS0V.mjs";
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

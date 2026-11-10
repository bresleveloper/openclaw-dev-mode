import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { h as normalizeRateLimitClientIp, m as isAuthRateLimitClientExempt } from "./auth-rate-limit-ByL4y2DQ.mjs";
//#region src/gateway/rate-limit-attempt-serialization.ts
const pendingAttempts = new KeyedAsyncQueue();
/** Shared queue scope for auth attempts that evaluate shared and device credentials together. */
const AUTH_CREDENTIAL_FALLBACK_SERIALIZATION_SCOPE = "credential-fallback";
async function withSerializedRateLimitAttempt(params) {
	const scope = (params.scope ?? "default").trim() || "default";
	return await pendingAttempts.enqueue(`${scope}:${normalizeRateLimitClientIp(params.ip)}`, params.run);
}
/** Serialize terminal credential fallbacks unless this limiter exempts the identity. */
async function withSerializedCredentialFallbackAttempt(params) {
	if (isAuthRateLimitClientExempt(params.limiter, params.ip)) return await params.run();
	return await withSerializedRateLimitAttempt({
		ip: params.ip,
		scope: AUTH_CREDENTIAL_FALLBACK_SERIALIZATION_SCOPE,
		run: params.run
	});
}
//#endregion
export { withSerializedRateLimitAttempt as n, withSerializedCredentialFallbackAttempt as t };

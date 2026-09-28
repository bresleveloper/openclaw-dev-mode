import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { h as normalizeRateLimitClientIp, m as isAuthRateLimitClientExempt } from "./auth-rate-limit-DuWYneOU.mjs";
//#region src/gateway/rate-limit-attempt-serialization.ts
const pendingAttempts = new KeyedAsyncQueue();
/** Shared queue scope for auth attempts that evaluate shared and device credentials together. */
const AUTH_CREDENTIAL_FALLBACK_SERIALIZATION_SCOPE = "credential-fallback";
function normalizeScope(scope) {
	return (scope ?? "default").trim() || "default";
}
function buildSerializationKey(ip, scope) {
	return `${normalizeScope(scope)}:${normalizeRateLimitClientIp(ip)}`;
}
/** Runs one rate-limit attempt after prior attempts for the same IP/scope finish. */
async function withSerializedRateLimitAttempt(params) {
	return await pendingAttempts.enqueue(buildSerializationKey(params.ip, params.scope), params.run);
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

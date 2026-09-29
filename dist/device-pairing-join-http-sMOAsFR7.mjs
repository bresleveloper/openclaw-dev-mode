import { r as AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN } from "./auth-rate-limit-DuWYneOU.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { c as sendJson } from "./http-common-Ckbyca3h.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
import { t as redeemDevicePairingJoinCode } from "./device-pairing-join-code-BU807yc0.mjs";
//#region src/gateway/device-pairing-join-http.ts
const NOT_FOUND_BODY = { error: "not_found" };
function sendJoinNotFound(res) {
	sendJson(res, 404, NOT_FOUND_BODY);
}
/** Handle the core-owned /j namespace before hooks, plugins, and the Control UI SPA. */
async function handleDevicePairingJoinHttpRequest(params) {
	const parsed = URL.parse(params.req.url ?? "/", "http://localhost");
	params.res.setHeader("Cache-Control", "no-store");
	await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN,
		run: async () => {
			const rateCheck = params.rateLimiter?.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN);
			if (rateCheck && !rateCheck.allowed) {
				if (rateCheck.retryAfterMs > 0) params.res.setHeader("Retry-After", String(Math.ceil(rateCheck.retryAfterMs / 1e3)));
				sendJson(params.res, 429, { error: "rate_limited" });
				return;
			}
			const payload = params.req.method === "GET" && !parsed?.search && isDevicePairingJoinCode(params.shortcode) ? redeemDevicePairingJoinCode({ shortcode: params.shortcode }) : null;
			if (!payload) {
				params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN);
				sendJoinNotFound(params.res);
				return;
			}
			params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN);
			sendJson(params.res, 200, payload);
		}
	});
	return true;
}
//#endregion
export { handleDevicePairingJoinHttpRequest };

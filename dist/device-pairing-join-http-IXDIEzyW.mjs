import { r as AUTH_RATE_LIMIT_SCOPE_DEVICE_JOIN } from "./auth-rate-limit-CnTz49S4.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-C-bwOG0P.mjs";
import { u as sendJson } from "./http-common-D3e5uEH1.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
import { t as redeemDevicePairingJoinCode } from "./device-pairing-join-code-BeZViTt6.mjs";
//#region src/gateway/device-pairing-join-http.ts
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
				sendJson(params.res, 404, { error: "not_found" });
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

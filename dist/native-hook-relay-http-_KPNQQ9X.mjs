import { t as dispatchNativeHookRelayHttpCallback } from "./native-hook-relay-CCP-M3P6.mjs";
//#region src/gateway/native-hook-relay-http.ts
/** Independent capability auth: forwarded operator identity is never accepted. */
async function handleNativeHookRelayHttpRequest(options) {
	const { req, res, clientIp, rateLimiter } = options;
	const scope = "native-hook-callback";
	if (rateLimiter && !rateLimiter.check(clientIp, scope).allowed) {
		res.writeHead(429).end();
		return true;
	}
	await dispatchNativeHookRelayHttpCallback(req, res);
	if (res.statusCode === 403) rateLimiter?.recordFailure(clientIp, scope);
	return true;
}
//#endregion
export { handleNativeHookRelayHttpRequest };

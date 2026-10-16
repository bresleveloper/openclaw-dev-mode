import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/plugins/http-legacy-listener.ts
const forwardedRequests = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpLegacyListenerRequests"), () => /* @__PURE__ */ new WeakMap());
/** Host-owned attribution; forwarded headers never select a legacy account endpoint. */
function markPluginHttpLegacyListener(req, endpoint) {
	forwardedRequests.set(req, Object.freeze({
		port: endpoint.port,
		...endpoint.host !== void 0 ? { host: endpoint.host } : {}
	}));
}
/** Configured endpoint accepting this request, or undefined on the ordinary Gateway listener. */
function getWebhookLegacyListener(req) {
	return forwardedRequests.get(req);
}
function hasEndpoint(endpoints, endpoint) {
	return endpoints?.some((candidate) => candidate.port === endpoint.port && candidate.host === endpoint.host) === true;
}
function isLegacyPluginRouteHandoff(req, route) {
	const endpoint = getWebhookLegacyListener(req);
	return endpoint !== void 0 && hasEndpoint(route.legacyListenerHandoffs, endpoint);
}
function permitsLegacyPluginRoute(req, route) {
	const endpoint = getWebhookLegacyListener(req);
	return !endpoint || route.auth === "plugin" && hasEndpoint(route.legacyListeners, endpoint);
}
//#endregion
export { permitsLegacyPluginRoute as i, isLegacyPluginRouteHandoff as n, markPluginHttpLegacyListener as r, getWebhookLegacyListener as t };

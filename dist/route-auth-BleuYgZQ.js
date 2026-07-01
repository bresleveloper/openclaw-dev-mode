import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, t as findMatchingPluginHttpRoutes } from "./route-match-8qJEViW9.js";
//#region src/gateway/server/plugins-http/route-auth.ts
/**
* Gateway-auth decisions for plugin HTTP routes.
*/
function matchedPluginRoutesRequireGatewayAuth(routes) {
	return routes.some((route) => route.auth === "gateway");
}
/** Returns true when a plugin path must pass gateway auth before routing. */
function shouldEnforceGatewayAuthForPluginPath(registry, pathnameOrContext) {
	const pathContext = typeof pathnameOrContext === "string" ? resolvePluginRoutePathContext(pathnameOrContext) : pathnameOrContext;
	if (pathContext.malformedEncoding || pathContext.decodePassLimitReached) return true;
	if (isProtectedPluginRoutePathFromContext(pathContext)) return true;
	return matchedPluginRoutesRequireGatewayAuth(findMatchingPluginHttpRoutes(registry, pathContext));
}
//#endregion
export { shouldEnforceGatewayAuthForPluginPath as n, matchedPluginRoutesRequireGatewayAuth as t };

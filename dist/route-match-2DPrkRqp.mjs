import { t as prefixMatchPath } from "./http-path-prefix-BmPCnu1x.mjs";
import { t as getPluginHttpRouteCanonicalPath } from "./http-path-utbm8n9N.mjs";
import { n as resolvePluginRoutePathContext } from "./path-context-D7IHOCQE.mjs";
//#region src/gateway/server/plugins-http/route-match.ts
/** Finds matching plugin routes with exact matches ordered before prefix matches. */
function findMatchingPluginHttpRoutes(registry, context) {
	const routes = registry.httpRoutes ?? [];
	if (routes.length === 0) return [];
	const exactMatches = [];
	const prefixMatches = [];
	for (const route of routes) {
		const routePath = getPluginHttpRouteCanonicalPath(route);
		const prefix = route.match === "prefix";
		if (context.candidates.some((candidate) => prefix ? prefixMatchPath(candidate, routePath) : candidate === routePath)) (prefix ? prefixMatches : exactMatches).push(route);
	}
	exactMatches.sort((a, b) => b.path.length - a.path.length);
	prefixMatches.sort((a, b) => b.path.length - a.path.length);
	return [...exactMatches, ...prefixMatches];
}
/** Returns the first registered plugin HTTP route for a raw request path. */
function findRegisteredPluginHttpRoute(registry, pathname) {
	return findMatchingPluginHttpRoutes(registry, resolvePluginRoutePathContext(pathname))[0];
}
//#endregion
export { findRegisteredPluginHttpRoute as n, findMatchingPluginHttpRoutes as t };

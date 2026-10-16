import { t as prefixMatchPath } from "./http-path-prefix-BmPCnu1x.mjs";
import { t as getPluginHttpRouteCanonicalPath } from "./http-path-utbm8n9N.mjs";
//#region src/plugins/http-route-overlap.ts
/** Detects conflicting plugin HTTP routes before Gateway registration accepts them. */
/** Resolves the collision classes shared by static and lifecycle route registration. */
function findPluginHttpRouteRegistrationConflicts(routes, candidate) {
	const canonicalCandidatePath = getPluginHttpRouteCanonicalPath(candidate);
	let authOverlap;
	const canonicalMatches = [];
	for (const route of routes) {
		const routePath = getPluginHttpRouteCanonicalPath(route);
		if (!authOverlap && route.auth !== candidate.auth && (routePath === canonicalCandidatePath || route.match === "prefix" && prefixMatchPath(canonicalCandidatePath, routePath) || candidate.match === "prefix" && prefixMatchPath(routePath, canonicalCandidatePath))) authOverlap = route;
		if (route.match === candidate.match && routePath === canonicalCandidatePath) canonicalMatches.push(route);
	}
	return {
		authOverlap,
		canonicalMatches
	};
}
//#endregion
export { findPluginHttpRouteRegistrationConflicts as t };

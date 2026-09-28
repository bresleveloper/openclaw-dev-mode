import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as canonicalizePathVariant } from "./security-path-y4_rzTXB.mjs";
//#region src/plugins/http-path.ts
/** Normalizes plugin HTTP paths to leading-slash form with optional fallback. */
function normalizePluginHttpPath(path, fallback) {
	const trimmed = normalizeOptionalString(path);
	if (!trimmed) {
		const fallbackTrimmed = normalizeOptionalString(fallback);
		if (!fallbackTrimmed) return null;
		return fallbackTrimmed.startsWith("/") ? fallbackTrimmed : `/${fallbackTrimmed}`;
	}
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
//#endregion
//#region src/plugins/http-route-overlap.ts
/** Detects conflicting plugin HTTP routes before Gateway registration accepts them. */
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
function doPluginHttpRoutesOverlap(a, b) {
	const aPath = canonicalizePathVariant(a.path);
	const bPath = canonicalizePathVariant(b.path);
	if (a.match === "exact" && b.match === "exact") return aPath === bPath;
	if (a.match === "prefix" && b.match === "prefix") return prefixMatchPath(aPath, bPath) || prefixMatchPath(bPath, aPath);
	const prefixRoute = a.match === "prefix" ? a : b;
	const exactRoute = a.match === "exact" ? a : b;
	return prefixMatchPath(canonicalizePathVariant(exactRoute.path), canonicalizePathVariant(prefixRoute.path));
}
/** Resolves the collision classes shared by static and lifecycle route registration. */
function findPluginHttpRouteRegistrationConflicts(routes, candidate) {
	const canonicalCandidatePath = canonicalizePathVariant(candidate.path);
	let authOverlap;
	const canonicalMatches = [];
	for (const route of routes) {
		if (!authOverlap && route.auth !== candidate.auth && doPluginHttpRoutesOverlap(route, candidate)) authOverlap = route;
		if (route.match === candidate.match && canonicalizePathVariant(route.path) === canonicalCandidatePath) canonicalMatches.push(route);
	}
	return {
		authOverlap,
		canonicalMatches
	};
}
//#endregion
export { normalizePluginHttpPath as n, findPluginHttpRouteRegistrationConflicts as t };

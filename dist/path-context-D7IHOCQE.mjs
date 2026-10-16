import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as canonicalizePathForSecurity, t as PROTECTED_PLUGIN_ROUTE_PREFIXES } from "./security-path-Bqx-bb-A.mjs";
import { t as prefixMatchPath } from "./http-path-prefix-BmPCnu1x.mjs";
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
//#endregion
export { resolvePluginRoutePathContext as n, isProtectedPluginRoutePathFromContext as t };

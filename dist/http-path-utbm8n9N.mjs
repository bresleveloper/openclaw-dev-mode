import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as canonicalizePathVariant } from "./security-path-Bqx-bb-A.mjs";
//#region src/plugins/http-path.ts
const canonicalPaths = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteCanonicalPaths"), () => /* @__PURE__ */ new WeakMap());
function getPluginHttpRouteCanonicalPath(route) {
	let prepared = canonicalPaths.get(route);
	if (!prepared || prepared.path !== route.path) {
		prepared = {
			path: route.path,
			canonicalPath: canonicalizePathVariant(route.path)
		};
		canonicalPaths.set(route, prepared);
	}
	return prepared.canonicalPath;
}
/** Normalizes plugin HTTP paths to leading-slash form with optional fallback. */
function normalizePluginHttpPath(path, fallback) {
	const trimmed = normalizeOptionalString(path) ?? normalizeOptionalString(fallback);
	if (!trimmed) return null;
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
//#endregion
export { normalizePluginHttpPath as n, getPluginHttpRouteCanonicalPath as t };

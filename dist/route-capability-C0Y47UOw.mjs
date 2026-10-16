import { m as resolvePluginNodeCapabilityTtlMs } from "./plugin-node-capability-BlHl5bub.mjs";
import { t as findMatchingPluginHttpRoutes } from "./route-match-2DPrkRqp.mjs";
//#region src/gateway/server/plugins-http/route-capability.ts
function hasNodeCapabilityRoute(route) {
	return Boolean(route.nodeCapability?.surface?.trim());
}
function resolvePluginNodeCapabilityRouteSurface(route) {
	const surface = route.nodeCapability.surface.trim();
	const owner = route.pluginId?.trim() || route.source?.trim();
	return {
		...route.nodeCapability,
		surface,
		...owner ? { scopeKey: `${owner}:${surface}` } : {}
	};
}
/** Returns the highest-priority node-capability route for a plugin HTTP path. */
function findMatchingPluginNodeCapabilityRoute(registry, context) {
	const route = findMatchingPluginHttpRoutes(registry, context).find(hasNodeCapabilityRoute);
	return route ? {
		...route,
		nodeCapability: resolvePluginNodeCapabilityRouteSurface(route)
	} : void 0;
}
/** Lists unique node-capability surfaces, preferring the shortest TTL per surface. */
function listPluginNodeCapabilities(registry) {
	const surfaces = /* @__PURE__ */ new Map();
	for (const route of registry.httpRoutes ?? []) if (hasNodeCapabilityRoute(route)) {
		const next = resolvePluginNodeCapabilityRouteSurface(route);
		const existing = surfaces.get(next.surface);
		if (!existing || resolvePluginNodeCapabilityTtlMs(next) < resolvePluginNodeCapabilityTtlMs(existing)) surfaces.set(next.surface, next);
	}
	return [...surfaces.values()].toSorted((a, b) => a.surface.localeCompare(b.surface));
}
//#endregion
export { listPluginNodeCapabilities as n, findMatchingPluginNodeCapabilityRoute as t };

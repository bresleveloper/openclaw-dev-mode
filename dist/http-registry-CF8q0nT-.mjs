import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { c as pluginInstanceState, m as wrapCurrentPluginInstance, r as getPluginInstanceOwner, u as resolvePluginInstanceOwner } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { b as isPluginRegistryRetired } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { A as isPluginHttpRouteVisible, F as respondPluginHttpRouteHandoff, P as replacePluginHttpRoutes, j as notifyPluginHttpRoutesChanged, k as getPluginHttpRouteViews, v as requireActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { n as normalizePluginHttpPath } from "./http-path-utbm8n9N.mjs";
import { t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-BwLyACPn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/http-registry.ts
const pluginHttpRouteRegistryScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteRegistryScope"), () => new AsyncLocalStorage());
const routeOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteRetentionOwners"), () => /* @__PURE__ */ new WeakMap());
const leasedRoutes = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteLeaseRetentions"), () => /* @__PURE__ */ new WeakMap());
const noopUnregister = () => {};
function removeOwnedRoute(owner, successor) {
	owner.removeRoute();
	for (const [handoff, endpoints] of owner.handoffs) {
		handoff.delete(owner);
		if (successor) {
			handoff.add(successor);
			successor.handoffs.set(handoff, endpoints);
		}
	}
	owner.handoffs.clear();
	routeOwners.delete(owner.entry);
	if (successor) updateLegacyListeners(successor);
}
function retireUnheldRoute(owner) {
	if (owner.holders.size > 0) return;
	if (owner.handoffs.size === 0 || !isPluginHttpRouteVisible(owner.entry)) removeOwnedRoute(owner);
	else if (!owner.entry.handoff) {
		const previous = owner.entry;
		owner.entry = {
			...previous,
			handoff: true,
			handleUpgrade: void 0,
			handler: respondPluginHttpRouteHandoff
		};
		owner.removeRoute = replacePluginHttpRoutes(owner.registry, owner.entry, [previous], true);
		routeOwners.delete(previous);
		routeOwners.set(owner.entry, owner);
	}
}
/** Keep retired ingress retryable until a successor claims it or every replacement ends. */
function createPluginHttpRouteHandoff() {
	const routes = /* @__PURE__ */ new Set();
	return {
		park(lease) {
			for (const { owner, legacyListener } of leasedRoutes.get(lease) ?? []) if (isPluginHttpRouteVisible(owner.entry)) {
				routes.add(owner);
				const endpoints = owner.handoffs.get(routes) ?? [];
				owner.handoffs.set(routes, legacyListener && !endpoints.includes(legacyListener) ? [...endpoints, legacyListener] : endpoints);
			}
		},
		release() {
			for (const owner of routes) {
				owner.handoffs.delete(routes);
				updateLegacyListeners(owner);
				retireUnheldRoute(owner);
			}
			routes.clear();
		}
	};
}
function updateLegacyListeners(owner) {
	const handoffs = new Map([...owner.handoffs.values()].flat().map((endpoint) => [`${endpoint.host ?? "<unspecified>"}:${endpoint.port}`, endpoint]));
	const listeners = new Map(handoffs);
	for (const endpoint of owner.holders.values()) if (endpoint) {
		const key = `${endpoint.host ?? "<unspecified>"}:${endpoint.port}`;
		listeners.set(key, endpoint);
		handoffs.delete(key);
	}
	if (listeners.size) owner.entry.legacyListeners = [...listeners.values()];
	else delete owner.entry.legacyListeners;
	if (handoffs.size) owner.entry.legacyListenerHandoffs = [...handoffs.values()];
	else delete owner.entry.legacyListenerHandoffs;
	notifyPluginHttpRoutesChanged();
}
function hasSameRouteOwner(left, right) {
	return left.auth === right.auth && normalizeOptionalString(left.pluginId) === normalizeOptionalString(right.pluginId) && normalizeOptionalString(left.source) === normalizeOptionalString(right.source);
}
function adoptPluginHttpRouteHandoffs(previous, next) {
	if (previous === next) return;
	const transfers = previous.httpRoutes.flatMap((entry) => {
		const owner = routeOwners.get(entry);
		if (!owner || !entry.handoff) return [];
		const conflicts = findPluginHttpRouteRegistrationConflicts(next.httpRoutes, entry);
		if (conflicts.authOverlap || conflicts.canonicalMatches.some((route) => !hasSameRouteOwner(route, entry))) throw new Error(`plugin reload cannot replace HTTP route ownership at ${entry.path}`);
		return [{
			owner,
			replacement: conflicts.canonicalMatches[0]
		}];
	});
	for (const { owner, replacement } of transfers) {
		if (replacement === owner.entry) continue;
		if (replacement) removeOwnedRoute(owner, routeOwners.get(replacement));
		else {
			owner.removeRoute();
			owner.registry = next;
			owner.removeRoute = replacePluginHttpRoutes(next, owner.entry);
		}
	}
}
function retainPluginHttpRoute(params) {
	const owner = routeOwners.get(params.entry);
	if (!owner) return noopUnregister;
	const retention = {
		owner,
		legacyListener: params.legacyListener
	};
	const leaseReleases = [];
	const release = () => {
		if (!owner.holders.delete(release)) return;
		for (const lease of params.leases) leasedRoutes.get(lease)?.delete(retention);
		for (const releaseLease of leaseReleases.splice(0)) releaseLease();
		updateLegacyListeners(owner);
		retireUnheldRoute(owner);
	};
	owner.holders.set(release, params.legacyListener);
	updateLegacyListeners(owner);
	for (const lease of params.leases) {
		let retentions = leasedRoutes.get(lease);
		if (!retentions) {
			retentions = /* @__PURE__ */ new Set();
			leasedRoutes.set(lease, retentions);
		}
		retentions.add(retention);
		leaseReleases.push(lease.retain(release));
	}
	return release;
}
function withPluginHttpRouteRegistry(registry, run, lease) {
	const inherited = pluginHttpRouteRegistryScope.getStore()?.leases ?? [];
	const leases = lease && !inherited.includes(lease) ? [...inherited, lease] : inherited;
	return pluginHttpRouteRegistryScope.run({
		registry,
		leases
	}, run);
}
function registerPluginHttpRoute(params) {
	const scope = pluginHttpRouteRegistryScope.getStore();
	let registry = params.registry ?? scope?.registry ?? requireActivePluginRegistry();
	const instance = pluginInstanceInvocation.getStore()?.instance ?? pluginInstanceState.values.get(params.handler);
	const record = instance ? getPluginInstanceOwner(instance)?.record : registry.plugins.find((entry) => entry.id === params.pluginId);
	const instanceOwner = record ? resolvePluginInstanceOwner(record, registry) : void 0;
	if (instanceOwner) registry = instanceOwner.registry;
	const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
	const rejectRegistration = (message) => {
		params.log?.(message);
		if (params.throwOnFailure) throw new Error(message);
		return noopUnregister;
	};
	if (params.legacyListener && params.auth !== "plugin") return rejectRegistration("legacy webhook listeners require plugin authentication");
	if (scope?.leases.some((lease) => !lease.isActive())) return rejectRegistration("plugin runtime HTTP route lease is no longer active");
	if (instanceOwner?.revoked || isPluginRegistryRetired(registry)) return rejectRegistration("plugin HTTP route owner is no longer active");
	const routes = [...new Set(getPluginHttpRouteViews(registry, params.pluginId, instance).flatMap((view) => view.httpRoutes))];
	const normalizedPath = normalizePluginHttpPath(params.path, params.fallbackPath);
	if (!normalizedPath) return rejectRegistration(`plugin: webhook path missing${suffix}`);
	const routeMatch = params.match ?? "exact";
	const candidate = {
		path: normalizedPath,
		match: routeMatch,
		auth: params.auth
	};
	const { authOverlap, canonicalMatches } = findPluginHttpRouteRegistrationConflicts(routes, candidate);
	if (authOverlap) return rejectRegistration(`plugin: route overlap denied at ${normalizedPath} (${routeMatch}, ${params.auth})${suffix}; overlaps ${authOverlap.path} (${authOverlap.match}, ${authOverlap.auth}) owned by ${authOverlap.pluginId ?? "unknown-plugin"} (${authOverlap.source ?? "unknown-source"})`);
	const listener = params.legacyListener;
	if (listener) for (const route of routes) {
		if (params.replaceExisting && canonicalMatches.includes(route)) continue;
		if (route.legacyListeners?.find((existing) => existing.port === listener.port && existing.host === listener.host && !route.legacyListenerHandoffs?.includes(existing) && (existing.health?.path !== listener.health?.path || existing.health?.contentType !== listener.health?.contentType || existing.timeouts?.headers !== listener.timeouts?.headers || existing.timeouts?.request !== listener.timeouts?.request || existing.timeouts?.socket !== listener.timeouts?.socket))) return rejectRegistration(`plugin: conflicting legacy webhook health or timeout profile at ${listener.host ?? "<unspecified>"}:${listener.port}${suffix}; registrations sharing a port must use the same profile`);
	}
	const entry = {
		path: normalizedPath,
		handler: wrapCurrentPluginInstance(params.handler),
		auth: params.auth,
		match: routeMatch,
		...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
		pluginId: params.pluginId,
		source: params.source
	};
	const existing = canonicalMatches[0];
	if (existing) {
		const requestedOwner = normalizeOptionalString(params.pluginId);
		const requestedSource = normalizeOptionalString(params.source);
		const mismatchedOwner = canonicalMatches.find((route) => !hasSameRouteOwner(route, params));
		const replaceExisting = params.replaceExisting || !mismatchedOwner && canonicalMatches.every((route) => route.handoff);
		if (!replaceExisting && params.reuseExistingSameOwner) {
			if (requestedOwner !== void 0 && requestedSource !== void 0 && !mismatchedOwner) {
				params.log?.(`plugin: reusing existing webhook path ${normalizedPath} (${routeMatch}) (${requestedOwner}/${requestedSource})`);
				return retainPluginHttpRoute({
					entry: existing,
					leases: scope?.leases ?? [],
					legacyListener: params.legacyListener
				});
			}
			const conflictingOwner = mismatchedOwner ?? existing;
			return rejectRegistration(`plugin: route reuse denied for ${normalizedPath} (${routeMatch})${suffix}; owned by ${conflictingOwner.pluginId ?? "unknown-plugin"} (${conflictingOwner.source ?? "unknown-source"})`);
		}
		if (!replaceExisting) return rejectRegistration(`plugin: route conflict at ${normalizedPath} (${routeMatch})${suffix}; owned by ${existing.pluginId ?? "unknown-plugin"} (${existing.source ?? "unknown-source"})`);
		const incompatibleReplacement = canonicalMatches.find((route) => normalizeOptionalString(route.pluginId) !== requestedOwner || requestedOwner !== void 0 && normalizeOptionalString(route.source) !== requestedSource);
		if (incompatibleReplacement) return rejectRegistration(`plugin: route replacement denied for ${normalizedPath} (${routeMatch})${suffix}; owned by ${incompatibleReplacement.pluginId ?? "unknown-plugin"} (${incompatibleReplacement.source ?? "unknown-source"})`);
		const pluginHint = params.pluginId ? ` (${params.pluginId})` : "";
		params.log?.(`plugin: replacing stale webhook path ${normalizedPath} (${routeMatch})${suffix}${pluginHint}`);
	}
	const successor = {
		entry,
		registry,
		removeRoute: replacePluginHttpRoutes(registry, entry, canonicalMatches),
		holders: /* @__PURE__ */ new Map(),
		handoffs: /* @__PURE__ */ new Map()
	};
	for (const route of canonicalMatches.toReversed()) {
		const owner = routeOwners.get(route);
		if (owner) removeOwnedRoute(owner, successor);
	}
	routeOwners.set(entry, successor);
	return retainPluginHttpRoute({
		entry,
		leases: scope?.leases ?? [],
		legacyListener: params.legacyListener
	});
}
//#endregion
export { withPluginHttpRouteRegistry as i, createPluginHttpRouteHandoff as n, registerPluginHttpRoute as r, adoptPluginHttpRouteHandoffs as t };

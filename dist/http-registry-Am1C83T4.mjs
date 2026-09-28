import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as pluginInstanceState, n as getPluginInstanceOwner, s as resolvePluginInstanceOwner, u as wrapCurrentPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-xdpzLZzd.mjs";
import { y as requireActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { i as replacePluginHttpRoutes, n as isPluginHttpRouteVisible, t as getPluginHttpRouteViews } from "./http-route-owner-CyFsFlZs.mjs";
import { n as normalizePluginHttpPath, t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-CYyCb1q8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/http-registry.ts
const pluginHttpRouteRegistryScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteRegistryScope"), () => new AsyncLocalStorage());
const routeOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteRetentionOwners"), () => /* @__PURE__ */ new WeakMap());
const leasedRoutes = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteLeaseRetentions"), () => /* @__PURE__ */ new WeakMap());
const noopUnregister = () => {};
function removeOwnedRoute(owner, successor) {
	owner.removeRoute();
	for (const handoff of owner.handoffs) {
		handoff.delete(owner);
		if (successor) {
			handoff.add(successor);
			successor.handoffs.add(handoff);
		}
	}
	owner.handoffs.clear();
	routeOwners.delete(owner.entry);
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
			handler: (_req, res) => {
				res.statusCode = 503;
				res.setHeader("Retry-After", "1");
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("plugin route is restarting; retry");
				return true;
			}
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
			for (const { owner } of leasedRoutes.get(lease) ?? []) if (isPluginHttpRouteVisible(owner.entry)) {
				routes.add(owner);
				owner.handoffs.add(routes);
			}
		},
		release() {
			for (const owner of routes) {
				owner.handoffs.delete(routes);
				retireUnheldRoute(owner);
			}
			routes.clear();
		}
	};
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
	const retention = { owner };
	const leaseReleases = [];
	const release = () => {
		if (!owner.holders.delete(release)) return;
		for (const lease of params.leases) leasedRoutes.get(lease)?.delete(retention);
		for (const releaseLease of leaseReleases.splice(0)) releaseLease();
		retireUnheldRoute(owner);
	};
	owner.holders.add(release);
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
					leases: scope?.leases ?? []
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
		holders: /* @__PURE__ */ new Set(),
		handoffs: /* @__PURE__ */ new Set()
	};
	for (const route of canonicalMatches.toReversed()) {
		const owner = routeOwners.get(route);
		if (owner) removeOwnedRoute(owner, successor);
	}
	routeOwners.set(entry, successor);
	return retainPluginHttpRoute({
		entry,
		leases: scope?.leases ?? []
	});
}
//#endregion
export { withPluginHttpRouteRegistry as i, createPluginHttpRouteHandoff as n, registerPluginHttpRoute as r, adoptPluginHttpRouteHandoffs as t };

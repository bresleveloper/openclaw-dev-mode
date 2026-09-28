import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { a as pluginInstanceState, i as getPluginValueInstance, n as getPluginInstanceOwner } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { r as withPluginRuntimeGenerationRegistryScope } from "./generation-state-Mkqqbxs_.mjs";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-xdpzLZzd.mjs";
//#region src/plugins/http-route-owner.ts
const registryViews = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteOwners"), () => /* @__PURE__ */ new WeakMap());
const entryViews = resolveGlobalSingleton(Symbol.for("openclaw.pluginHttpRouteEntryOwners"), () => /* @__PURE__ */ new WeakMap());
function resolveOwner(registry, pluginId, instance) {
	const record = registry.plugins.find((entry) => entry.id === pluginId);
	return instance ?? (record && pluginInstanceState.records.get(record)?.instance) ?? pluginId;
}
function resolveEntryOwner(registry, entry) {
	const captured = entryViews.get(entry);
	return captured ? captured.owner : resolveOwner(registry, entry.pluginId, pluginInstanceState.values.get(entry.handler));
}
/** Shared raw callbacks keep the exact owner captured when their route was registered. */
function runPluginHttpRoute(registry, entry, value, run) {
	if (entry.handoff) return run();
	const owner = entryViews.get(entry)?.owner;
	const instance = (owner && typeof owner !== "string" ? getPluginInstanceOwner(owner)?.instance : void 0) ?? getPluginValueInstance(value);
	return instance ? withPluginRuntimeGenerationRegistryScope(registry, () => instance.runConsumer(run)) : run();
}
function viewsByOwner(registry) {
	let owners = registryViews.get(registry);
	if (!owners) registryViews.set(registry, owners = /* @__PURE__ */ new Map());
	return owners;
}
function ownerViews(registry, owner) {
	const owners = viewsByOwner(registry);
	let views = owners.get(owner);
	if (!views) owners.set(owner, views = /* @__PURE__ */ new Set([new WeakRef(registry)]));
	return views;
}
function liveViews(views) {
	const registries = [];
	for (const ref of views) {
		const registry = ref.deref();
		if (!registry || isPluginRegistryRetired(registry)) views.delete(ref);
		else registries.push(registry);
	}
	return registries;
}
/** A retained instance owns route mutations in both its published and prepared registries. */
function getPluginHttpRouteViews(registry, pluginId, instance = pluginInstanceInvocation.getStore()?.instance) {
	return liveViews(ownerViews(registry, resolveOwner(registry, pluginId, instance)));
}
function isPluginHttpRouteVisible(entry) {
	const views = entryViews.get(entry)?.views;
	return views ? liveViews(views).some((view) => view.httpRoutes.includes(entry)) : false;
}
/** Exact records own routes even when registration fails before registry insertion. */
function projectPluginHttpRoutes(source, record, target) {
	const owner = pluginInstanceState.records.get(record)?.instance ?? record.id;
	const views = ownerViews(source, owner);
	const owns = (route) => resolveEntryOwner(source, route) === owner;
	if (target) {
		target.httpRoutes.push(...source.httpRoutes.filter(owns));
		viewsByOwner(target).set(owner, views);
		if (!liveViews(views).includes(target)) views.add(new WeakRef(target));
	} else {
		source.httpRoutes = source.httpRoutes.filter((route) => !owns(route));
		viewsByOwner(source).delete(owner);
		for (const ref of views) if (ref.deref() === source) views.delete(ref);
	}
}
function removeRoute(entry, views) {
	for (const view of liveViews(entryViews.get(entry)?.views ?? views)) {
		const index = view.httpRoutes.indexOf(entry);
		if (index >= 0) view.httpRoutes.splice(index, 1);
	}
}
/** Mutate at the owner so cleanup during drain also removes already projected routes. */
function replacePluginHttpRoutes(registry, entry, previous = [], keepPosition = false) {
	const owner = resolveEntryOwner(registry, entry.handoff ? previous[0] ?? entry : entry);
	const views = ownerViews(registry, owner);
	const placements = liveViews(views).map((view) => ({
		routes: view.httpRoutes,
		index: keepPosition && previous.length ? view.httpRoutes.indexOf(previous[0]) : -1
	}));
	for (const route of previous) removeRoute(route, views);
	for (const { routes, index } of placements) routes.splice(index >= 0 ? index : routes.length, 0, entry);
	entryViews.set(entry, {
		owner,
		views
	});
	return () => removeRoute(entry, views);
}
//#endregion
export { runPluginHttpRoute as a, replacePluginHttpRoutes as i, isPluginHttpRouteVisible as n, projectPluginHttpRoutes as r, getPluginHttpRouteViews as t };

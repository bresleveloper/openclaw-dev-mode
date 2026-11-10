import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
//#region src/plugins/provider-owner-index.ts
/** Captures declared receivers independently from plugins triggered by a provider. */
function buildDeclaredProviderOwnerIndex(manifests) {
	const winners = /* @__PURE__ */ new Map();
	for (const plugin of manifests) if (!winners.has(plugin.id)) winners.set(plugin.id, plugin);
	const owners = /* @__PURE__ */ new Map();
	for (const phase of ["runtime", "setup"]) {
		const runtimeRefs = new Set(owners.keys());
		for (const plugin of winners.values()) {
			const refs = phase === "runtime" ? plugin.providers : plugin.setup?.providers?.map((entry) => entry.id) ?? [];
			for (const ref of refs) {
				const normalized = normalizeProviderId(ref);
				if (phase === "setup" && runtimeRefs.has(normalized)) continue;
				const ids = owners.get(normalized) ?? /* @__PURE__ */ new Set();
				ids.add(plugin.id);
				owners.set(normalized, ids);
			}
		}
	}
	return owners;
}
function matchesDeclaredProviderOwner(owners, provider, pluginId) {
	return owners?.get(normalizeProviderId(provider))?.has(pluginId) ?? true;
}
const providerOwnerIndexes = /* @__PURE__ */ new WeakMap();
function getProviderOwnerIndex(registry) {
	const cached = providerOwnerIndexes.get(registry);
	if (cached) return cached;
	const providers = /* @__PURE__ */ new Map();
	const cliBackends = /* @__PURE__ */ new Map();
	const append = (map, ref, pluginId) => {
		const ids = map.get(ref);
		if (ids) {
			if (!ids.includes(pluginId)) ids.push(pluginId);
		} else map.set(ref, [pluginId]);
	};
	for (const plugin of registry.plugins) {
		const declared = new Set(plugin.providers.map(normalizeProviderId));
		for (const ref of declared) append(providers, ref, plugin.id);
		const appendAlias = (alias, target) => {
			const receiver = normalizeProviderId(target);
			if (receiver && declared.has(receiver)) append(providers, normalizeProviderId(alias), plugin.id);
		};
		for (const [alias, target] of Object.entries(plugin.providerAuthAliases ?? {})) if (typeof target === "string") appendAlias(alias, target);
		for (const [alias, target] of Object.entries(plugin.modelCatalog?.aliases ?? {})) appendAlias(alias, target.provider);
		for (const ref of [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []]) append(cliBackends, normalizeProviderId(ref), plugin.id);
	}
	for (const map of [providers, cliBackends]) for (const [ref, ids] of map) {
		const sorted = ids.toSorted((a, b) => a.localeCompare(b));
		Object.freeze(sorted);
		map.set(ref, sorted);
	}
	const index = {
		providers,
		refs: new Map([...cliBackends, ...providers])
	};
	providerOwnerIndexes.set(registry, index);
	return index;
}
//#endregion
export { getProviderOwnerIndex as n, matchesDeclaredProviderOwner as r, buildDeclaredProviderOwnerIndex as t };

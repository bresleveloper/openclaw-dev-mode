import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
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
/** Runtime aliases require a provider declared by the same plugin. */
function pluginOwnsProviderRef(plugin, normalizedProvider) {
	if (plugin.providers.length === 0) return false;
	if (plugin.providers.some((providerId) => normalizeProviderId(providerId) === normalizedProvider)) return true;
	for (const [rawAlias, target] of Object.entries(plugin.providerAuthAliases ?? {})) {
		if (typeof target !== "string") continue;
		const alias = normalizeProviderId(rawAlias);
		const targetProvider = normalizeProviderId(target);
		if (alias === normalizedProvider && targetProvider && plugin.providers.some((providerId) => normalizeProviderId(providerId) === targetProvider)) return true;
	}
	for (const [rawAlias, target] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const alias = normalizeProviderId(rawAlias);
		const targetProvider = normalizeProviderId(target.provider);
		if (alias === normalizedProvider && targetProvider && plugin.providers.some((providerId) => normalizeProviderId(providerId) === targetProvider)) return true;
	}
	return false;
}
//#endregion
export { matchesDeclaredProviderOwner as n, pluginOwnsProviderRef as r, buildDeclaredProviderOwnerIndex as t };

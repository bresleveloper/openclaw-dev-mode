import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
//#region src/plugins/provider-registry-shared.ts
/** A full snapshot retains shared-root scope; narrowed views may still use the ambient workspace. */
function resolveProviderRuntimeWorkspaceDir(params, ambientWorkspaceDir) {
	return params.workspaceDir ?? (params.pluginMetadataSnapshot && Object.hasOwn(params.pluginMetadataSnapshot, "workspaceDir") ? params.pluginMetadataSnapshot.workspaceDir : ambientWorkspaceDir);
}
/** Normalizes provider ids used by capability-provider registries. */
function normalizeCapabilityProviderId(providerId) {
	const normalized = normalizeOptionalLowercaseString(providerId);
	return normalized && !isBlockedObjectKey(normalized) ? normalized : void 0;
}
function findCapabilityProviderEntry(entries, providerId) {
	const normalizedProviderId = normalizeCapabilityProviderId(providerId);
	if (!normalizedProviderId) return;
	return entries.find(({ provider }) => isRecord(provider) && normalizeCapabilityProviderId(provider.id) === normalizedProviderId) ?? entries.find(({ provider }) => isRecord(provider) && Array.isArray(provider.aliases) && provider.aliases.some((alias) => typeof alias === "string" && normalizeCapabilityProviderId(alias) === normalizedProviderId));
}
function matchesProviderPluginRef(provider, providerId) {
	const normalized = normalizeProviderId(providerId);
	return Boolean(normalized && (normalizeProviderId(provider.id) === normalized || [...provider.aliases ?? [], ...provider.hookAliases ?? []].some((alias) => normalizeProviderId(alias) === normalized)));
}
/** Preserves ordered alias overrides, including aliases of replaced canonical entries. */
function buildCapabilityProviderIndex(providers, mode) {
	const index = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		const id = normalizeCapabilityProviderId(provider.id);
		if (!id) continue;
		index.set(id, provider);
		if (mode === "canonical") continue;
		for (const alias of provider.aliases ?? []) {
			const normalizedAlias = normalizeCapabilityProviderId(alias);
			if (normalizedAlias) index.set(normalizedAlias, provider);
		}
	}
	return index;
}
//#endregion
export { resolveProviderRuntimeWorkspaceDir as a, normalizeCapabilityProviderId as i, findCapabilityProviderEntry as n, matchesProviderPluginRef as r, buildCapabilityProviderIndex as t };

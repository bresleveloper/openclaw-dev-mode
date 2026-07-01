import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as isBlockedObjectKey } from "./prototype-keys-D2nJOZIy.js";
//#region src/plugins/provider-registry-shared.ts
/** Normalizes provider ids used by capability-provider registries. */
function normalizeCapabilityProviderId(providerId) {
	const normalized = normalizeOptionalLowercaseString(providerId);
	return normalized && !isBlockedObjectKey(normalized) ? normalized : void 0;
}
/** Builds canonical and alias lookup maps for capability providers. */
function buildCapabilityProviderMaps(providers, normalizeId = normalizeCapabilityProviderId) {
	const canonical = /* @__PURE__ */ new Map();
	const aliases = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		const id = normalizeId(provider.id);
		if (!id) continue;
		canonical.set(id, provider);
		aliases.set(id, provider);
		for (const alias of provider.aliases ?? []) {
			const normalizedAlias = normalizeId(alias);
			if (normalizedAlias) aliases.set(normalizedAlias, provider);
		}
	}
	return {
		canonical,
		aliases
	};
}
//#endregion
export { normalizeCapabilityProviderId as n, buildCapabilityProviderMaps as t };

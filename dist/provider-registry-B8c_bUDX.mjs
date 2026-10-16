import { a as resolvePluginCapabilityProviders } from "./capability-provider-runtime-BdPgXENb.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-BZvihdyi.mjs";
import { t as resolveImageCapableConfigProviderIds } from "./config-provider-models-CKwImwcW.mjs";
//#region src/media-understanding/provider-registry.ts
function mergeProviderIntoRegistry(registry, provider, registryKey = provider.id) {
	const normalizedKey = normalizeMediaProviderId(registryKey);
	const existing = registry.get(normalizedKey);
	const merged = existing ? {
		...existing,
		...provider,
		capabilities: provider.capabilities ?? existing.capabilities,
		defaultModels: provider.defaultModels ?? existing.defaultModels,
		autoPriority: provider.autoPriority ?? existing.autoPriority,
		nativeDocumentInputs: provider.nativeDocumentInputs ?? existing.nativeDocumentInputs,
		documentModels: provider.documentModels ?? existing.documentModels
	} : provider;
	registry.set(normalizedKey, merged);
}
/** Builds the media-understanding provider registry from plugin capabilities and config providers. */
function buildMediaUnderstandingRegistry(overrides, cfg, preparedProviders) {
	const registry = /* @__PURE__ */ new Map();
	const providers = preparedProviders ?? resolvePluginCapabilityProviders({
		key: "mediaUnderstandingProviders",
		cfg
	});
	for (const provider of providers) mergeProviderIntoRegistry(registry, provider);
	for (const normalizedKey of resolveImageCapableConfigProviderIds(cfg)) if (!registry.has(normalizedKey)) mergeProviderIntoRegistry(registry, {
		id: normalizedKey,
		capabilities: ["image"]
	});
	if (overrides) for (const [key, provider] of Object.entries(overrides)) mergeProviderIntoRegistry(registry, provider, key);
	return registry;
}
/** Looks up a media-understanding provider using the same id normalization as registry builds. */
function getMediaUnderstandingProvider(id, registry) {
	return registry.get(normalizeMediaProviderId(id));
}
//#endregion
export { getMediaUnderstandingProvider as n, buildMediaUnderstandingRegistry as t };

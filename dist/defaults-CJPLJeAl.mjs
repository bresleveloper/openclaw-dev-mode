import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import "./defaults.constants-Cof2g8lZ.mjs";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-DSbuCFIb.mjs";
import { n as resolveDefaultMediaModelFromRegistry, t as resolveAutoMediaKeyProvidersFromRegistry } from "./provider-registry-metadata-DJ4b90EB.mjs";
//#region src/media-understanding/manifest-metadata.ts
const registriesByManifest = /* @__PURE__ */ new WeakMap();
/** Builds a media provider registry from trusted manifest metadata without loading plugin code. */
function buildMediaUnderstandingManifestMetadataRegistry(cfg, workspaceDir) {
	const snapshot = loadManifestMetadataSnapshot({
		config: cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	});
	const cached = registriesByManifest.get(snapshot.manifestRegistry);
	if (cached) return cached;
	const registry = /* @__PURE__ */ new Map();
	for (const plugin of snapshot.plugins) {
		const declaredProviders = new Set((plugin.contracts?.mediaUnderstandingProviders ?? []).map((providerId) => normalizeMediaProviderId(providerId)));
		for (const [providerId, metadata] of Object.entries(plugin.mediaUnderstandingProviderMetadata ?? {})) {
			const normalizedProviderId = normalizeMediaProviderId(providerId);
			if (!normalizedProviderId || !declaredProviders.has(normalizedProviderId)) continue;
			registry.set(normalizedProviderId, {
				id: normalizedProviderId,
				capabilities: metadata.capabilities,
				defaultModels: metadata.defaultModels,
				autoPriority: metadata.autoPriority,
				nativeDocumentInputs: metadata.nativeDocumentInputs,
				documentModels: metadata.documentModels
			});
		}
	}
	registriesByManifest.set(snapshot.manifestRegistry, registry);
	return registry;
}
//#endregion
//#region src/media-understanding/defaults.ts
function resolveConfiguredImageProviderModel(params) {
	const normalizedProviderId = normalizeMediaProviderId(params.providerId);
	const providers = params.cfg?.models?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const [providerKey, providerCfg] of Object.entries(providers)) {
		if (normalizeMediaProviderId(providerKey) !== normalizedProviderId) continue;
		const match = (providerCfg?.models ?? []).find((model) => Boolean(normalizeOptionalString(model?.id)) && Array.isArray(model?.input) && model.input.includes("image"));
		return normalizeOptionalString(match?.id);
	}
}
function resolveConfiguredImageProviderIds(cfg) {
	const providers = cfg?.models?.providers;
	if (!providers || typeof providers !== "object") return [];
	const configured = [];
	for (const [providerKey, providerCfg] of Object.entries(providers)) {
		const normalizedProviderId = normalizeMediaExecutionProviderId(providerKey);
		if (!normalizedProviderId || configured.includes(normalizedProviderId)) continue;
		if ((providerCfg?.models ?? []).some((model) => Array.isArray(model?.input) && model.input.includes("image"))) configured.push(normalizedProviderId);
	}
	return configured;
}
function isExecutionAliasProvider(providerId) {
	return normalizeMediaProviderId(providerId) !== providerId;
}
function insertConfiguredImageProviders(params) {
	const merged = [...params.prioritized];
	for (const providerId of params.configured.filter(isExecutionAliasProvider)) {
		const canonicalProviderId = normalizeMediaProviderId(providerId);
		const canonicalIndex = merged.indexOf(canonicalProviderId);
		if (canonicalIndex >= 0) merged.splice(canonicalIndex, 0, providerId);
		else merged.unshift(providerId);
	}
	for (const providerId of params.configured.filter((id) => !isExecutionAliasProvider(id))) merged.push(providerId);
	return uniqueStrings(merged);
}
/** Resolves the default provider model for a media capability from config or manifest metadata. */
function resolveDefaultMediaModel(params) {
	if (!params.providerRegistry && params.includeConfiguredImageModels !== false) {
		const configuredImageModel = params.capability === "image" ? resolveConfiguredImageProviderModel({
			cfg: params.cfg,
			providerId: params.providerId
		}) : void 0;
		if (configuredImageModel) return configuredImageModel;
	}
	const registry = params.providerRegistry ?? buildMediaUnderstandingManifestMetadataRegistry(params.cfg, params.workspaceDir);
	return resolveDefaultMediaModelFromRegistry({
		providerId: params.providerId,
		capability: params.capability,
		providerRegistry: registry
	});
}
/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
function resolveAutoMediaKeyProviders(params) {
	const registry = params.providerRegistry ?? buildMediaUnderstandingManifestMetadataRegistry(params.cfg, params.workspaceDir);
	const prioritized = resolveAutoMediaKeyProvidersFromRegistry({
		capability: params.capability,
		providerRegistry: registry
	});
	if (params.providerRegistry || params.capability !== "image") return prioritized;
	return insertConfiguredImageProviders({
		prioritized,
		configured: resolveConfiguredImageProviderIds(params.cfg)
	});
}
/** Returns whether provider metadata declares native PDF document input support. */
function providerSupportsNativePdfDocument(params) {
	return (params.providerRegistry ?? buildMediaUnderstandingManifestMetadataRegistry(params.cfg, params.workspaceDir)).get(normalizeMediaProviderId(params.providerId))?.nativeDocumentInputs?.includes("pdf") ?? false;
}
/** Resolves provider-specific document model hints, preserving explicit unsupported markers. */
function resolveDocumentMediaModel(params) {
	const value = (params.providerRegistry ?? buildMediaUnderstandingManifestMetadataRegistry(params.cfg, params.workspaceDir)).get(normalizeMediaProviderId(params.providerId))?.documentModels?.[params.document]?.[params.mode];
	if (value === false) return false;
	return normalizeOptionalString(value);
}
//#endregion
export { resolveDocumentMediaModel as i, resolveAutoMediaKeyProviders as n, resolveDefaultMediaModel as r, providerSupportsNativePdfDocument as t };

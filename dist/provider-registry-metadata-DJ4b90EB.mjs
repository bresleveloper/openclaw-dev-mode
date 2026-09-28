import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.mjs";
//#region packages/media-understanding-common/src/provider-supports.ts
/** Image providers can use shared model dispatch; audio/video require registered methods. */
function providerSupportsCapability(provider, capability) {
	if (!provider) return false;
	if (capability === "audio") return Boolean(provider.transcribeAudioWithContext || provider.transcribeAudio);
	if (capability === "image") return Boolean(provider.describeImage || provider.capabilities?.includes("image"));
	return Boolean(provider.describeVideo);
}
//#endregion
//#region src/media-understanding/provider-registry-metadata.ts
function resolveDefaultMediaModelFromRegistry(params) {
	const provider = params.providerRegistry.get(normalizeMediaProviderId(params.providerId));
	return normalizeOptionalString(provider?.defaultModels?.[params.capability]);
}
function resolveAutoMediaKeyProvidersFromRegistry(params) {
	return [...params.providerRegistry.values()].filter((provider) => provider.capabilities?.includes(params.capability) ?? providerSupportsCapability(provider, params.capability)).map((provider) => {
		const priority = provider.autoPriority?.[params.capability];
		return typeof priority === "number" && Number.isFinite(priority) ? {
			provider,
			priority
		} : null;
	}).filter((entry) => entry !== null).toSorted((left, right) => {
		if (left.priority !== right.priority) return left.priority - right.priority;
		return left.provider.id.localeCompare(right.provider.id);
	}).map((entry) => normalizeMediaProviderId(entry.provider.id)).filter(Boolean);
}
//#endregion
export { resolveDefaultMediaModelFromRegistry as n, providerSupportsCapability as r, resolveAutoMediaKeyProvidersFromRegistry as t };

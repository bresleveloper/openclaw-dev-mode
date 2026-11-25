import { DEEPINFRA_VIDEO_ASPECT_RATIOS, DEEPINFRA_VIDEO_DURATIONS } from "./media-models.js";
import { discoverDeepInfraSurfaces } from "./provider-models.js";
// extensions/deepinfra/surface-model-catalogs.ts
const PROVIDER_ID = "deepinfra";
function buildDeepInfraVideoModelCapabilities() {
	return {
		providerOptions: {
			seed: "number",
			negative_prompt: "string",
			negativePrompt: "string",
			style: "string"
		},
		generate: {
			maxVideos: 1,
			maxDurationSeconds: 8,
			supportedDurationSeconds: [...DEEPINFRA_VIDEO_DURATIONS],
			supportsAspectRatio: true,
			aspectRatios: [...DEEPINFRA_VIDEO_ASPECT_RATIOS]
		},
		imageToVideo: { enabled: false },
		videoToVideo: { enabled: false }
	};
}
async function listDeepInfraGenerationCatalog(ctx, kind) {
	const { discoveryApiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
	if (!discoveryApiKey) return null;
	const catalog = await discoverDeepInfraSurfaces({
		hasApiKey: true,
		env: ctx.env
	});
	if (!catalog) return null;
	const models = kind === "image_generation" ? catalog.imageGen : catalog.videoGen;
	if (models.length === 0) return null;
	return models.map((model) => {
		const entry = {
			kind,
			provider: PROVIDER_ID,
			model: model.id,
			source: "live",
			label: model.name
		};
		if (kind === "video_generation") entry.capabilities = buildDeepInfraVideoModelCapabilities();
		return entry;
	});
}
function listDeepInfraImageGenCatalog(ctx) {
	return listDeepInfraGenerationCatalog(ctx, "image_generation");
}
function listDeepInfraVideoGenCatalog(ctx) {
	return listDeepInfraGenerationCatalog(ctx, "video_generation");
}
export { buildDeepInfraVideoModelCapabilities, listDeepInfraImageGenCatalog, listDeepInfraVideoGenCatalog };

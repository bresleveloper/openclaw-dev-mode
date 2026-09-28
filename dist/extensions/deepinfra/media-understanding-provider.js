import { DEEPINFRA_BASE_URL, DEEPINFRA_STT_FALLBACK_MODELS, DEEPINFRA_VLM_FALLBACK_MODELS } from "./media-models.js";
import { describeImageWithModel, describeImagesWithModel, transcribeOpenAiCompatibleAudio } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/deepinfra/media-understanding-provider.ts
function resolveDefault(surfaceModels, fallback) {
	return surfaceModels?.[0]?.id ?? fallback[0] ?? "";
}
async function transcribeDeepInfraAudio(params) {
	return await transcribeOpenAiCompatibleAudio({
		...params,
		provider: "deepinfra",
		defaultBaseUrl: DEEPINFRA_BASE_URL,
		defaultModel: resolveDefault(void 0, DEEPINFRA_STT_FALLBACK_MODELS)
	});
}
function buildDeepInfraMediaUnderstandingProvider(options) {
	return {
		id: "deepinfra",
		capabilities: ["image", "audio"],
		defaultModels: {
			image: resolveDefault(options?.vlmModels, DEEPINFRA_VLM_FALLBACK_MODELS),
			audio: resolveDefault(options?.sttModels, DEEPINFRA_STT_FALLBACK_MODELS)
		},
		autoPriority: {
			image: 45,
			audio: 45
		},
		transcribeAudio: transcribeDeepInfraAudio,
		describeImage: describeImageWithModel,
		describeImages: describeImagesWithModel
	};
}
const deepinfraMediaUnderstandingProvider = buildDeepInfraMediaUnderstandingProvider();
//#endregion
export { buildDeepInfraMediaUnderstandingProvider, deepinfraMediaUnderstandingProvider };

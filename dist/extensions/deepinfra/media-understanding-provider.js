import { DEEPINFRA_BASE_URL, DEEPINFRA_STT_FALLBACK_MODELS, DEEPINFRA_VLM_FALLBACK_MODELS } from "./media-models.js";
import { describeImageWithModel, describeImagesWithModel, transcribeOpenAiCompatibleAudio } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/deepinfra/media-understanding-provider.ts
function buildDeepInfraMediaUnderstandingProvider(options) {
	return {
		id: "deepinfra",
		capabilities: ["image", "audio"],
		defaultModels: {
			image: options?.vlmModels?.[0]?.id ?? DEEPINFRA_VLM_FALLBACK_MODELS[0],
			audio: options?.sttModels?.[0]?.id ?? DEEPINFRA_STT_FALLBACK_MODELS[0]
		},
		autoPriority: {
			image: 45,
			audio: 45
		},
		transcribeAudio: (params) => transcribeOpenAiCompatibleAudio({
			...params,
			provider: "deepinfra",
			defaultBaseUrl: DEEPINFRA_BASE_URL,
			defaultModel: DEEPINFRA_STT_FALLBACK_MODELS[0]
		}),
		describeImage: describeImageWithModel,
		describeImages: describeImagesWithModel
	};
}
const deepinfraMediaUnderstandingProvider = buildDeepInfraMediaUnderstandingProvider();
//#endregion
export { buildDeepInfraMediaUnderstandingProvider, deepinfraMediaUnderstandingProvider };

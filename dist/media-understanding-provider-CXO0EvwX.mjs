import { n as OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL } from "./default-models-DOFL1mMC.mjs";
//#region extensions/openai/media-understanding-provider.ts
const openaiMediaUnderstandingProvider = {
	id: "openai",
	capabilities: ["image", "audio"],
	defaultModels: {
		image: "gpt-6-astra",
		audio: OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL
	},
	autoPriority: {
		image: 20,
		audio: 20
	},
	async describeImage(req) {
		const { describeImageWithModel } = await import("./plugin-sdk/media-understanding.js");
		return describeImageWithModel(req);
	},
	async describeImages(req) {
		const { describeImagesWithModel } = await import("./plugin-sdk/media-understanding.js");
		return describeImagesWithModel(req);
	},
	async transcribeAudio(req) {
		const { transcribeOpenAiAudio } = await import("./extensions/openai/audio-transcription.js");
		return transcribeOpenAiAudio(req);
	},
	async transcribeAudioWithContext(context) {
		const { transcribeOpenAiAudioWithContext } = await import("./extensions/openai/audio-transcription.js");
		return transcribeOpenAiAudioWithContext(context);
	}
};
//#endregion
export { openaiMediaUnderstandingProvider as t };

import { S as QWEN_STANDARD_GLOBAL_BASE_URL } from "./.setup/models-DIZ7f-Lx.mjs";
import { describeOpenAiCompatibleVideo } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/qwen/media-understanding-provider.ts
const DEFAULT_QWEN_MEDIA_MODEL = "qwen3.6-plus";
const DEFAULT_QWEN_VIDEO_PROMPT = "Describe the video in detail.";
function describeQwenVideo(params) {
	return describeOpenAiCompatibleVideo({
		...params,
		defaultBaseUrl: QWEN_STANDARD_GLOBAL_BASE_URL,
		defaultModel: DEFAULT_QWEN_MEDIA_MODEL,
		defaultPrompt: DEFAULT_QWEN_VIDEO_PROMPT,
		provider: "qwen",
		providerLabel: "Qwen"
	});
}
function buildQwenMediaUnderstandingProvider() {
	return {
		id: "qwen",
		capabilities: ["image", "video"],
		defaultModels: {
			image: DEFAULT_QWEN_MEDIA_MODEL,
			video: DEFAULT_QWEN_MEDIA_MODEL
		},
		autoPriority: { video: 15 },
		describeImage: void 0,
		describeImages: void 0,
		describeVideo: describeQwenVideo
	};
}
//#endregion
export { buildQwenMediaUnderstandingProvider };

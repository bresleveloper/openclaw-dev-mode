import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CZNy9Kfm.mjs";
import { MOONSHOT_BASE_URL } from "./provider-policy-api.js";
import "./provider-catalog.js";
import { describeOpenAiCompatibleVideo } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/moonshot/media-understanding-provider.ts
const DEFAULT_MOONSHOT_IMAGE_MODEL = openclaw_plugin_default.mediaUnderstandingProviderMetadata.moonshot.defaultModels.image;
const DEFAULT_MOONSHOT_VIDEO_MODEL = openclaw_plugin_default.mediaUnderstandingProviderMetadata.moonshot.defaultModels.video;
const DEFAULT_MOONSHOT_VIDEO_PROMPT = "Describe the video.";
async function describeMoonshotVideo(params) {
	return describeOpenAiCompatibleVideo({
		...params,
		defaultBaseUrl: MOONSHOT_BASE_URL,
		defaultModel: DEFAULT_MOONSHOT_VIDEO_MODEL,
		defaultPrompt: DEFAULT_MOONSHOT_VIDEO_PROMPT,
		provider: "moonshot",
		providerLabel: "Moonshot"
	});
}
const moonshotMediaUnderstandingProvider = {
	id: "moonshot",
	capabilities: ["image", "video"],
	defaultModels: {
		image: DEFAULT_MOONSHOT_IMAGE_MODEL,
		video: DEFAULT_MOONSHOT_VIDEO_MODEL
	},
	autoPriority: { video: 20 },
	describeImage: void 0,
	describeImages: void 0,
	describeVideo: describeMoonshotVideo
};
//#endregion
export { moonshotMediaUnderstandingProvider };

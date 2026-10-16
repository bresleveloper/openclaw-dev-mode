import { DEFAULT_VYDRA_VIDEO_MODEL } from "./defaults.js";
import { runVydraGeneration } from "./shared.js";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/vydra/video-generation-provider.ts
const VYDRA_KLING_MODEL = "kling";
const DEFAULT_VYDRA_VIDEO_TIMEOUT_MS = 12e4;
function buildVydraVideoGenerationProvider() {
	return {
		id: "vydra",
		label: "Vydra",
		defaultModel: DEFAULT_VYDRA_VIDEO_MODEL,
		models: [DEFAULT_VYDRA_VIDEO_MODEL, VYDRA_KLING_MODEL],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "vydra",
			...ctx
		}),
		capabilities: {
			generate: { maxVideos: 1 },
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("Vydra video generation does not support video reference inputs.");
			const model = req.model?.trim() || "veo3";
			const body = { prompt: req.prompt };
			if (model === VYDRA_KLING_MODEL) {
				const imageUrl = req.inputImages?.[0]?.url?.trim();
				if (!imageUrl) throw new Error("Vydra kling currently requires a remote image URL reference.");
				body.image_url = imageUrl;
				body.video_url = imageUrl;
			} else if ((req.inputImages?.length ?? 0) > 0) throw new Error(`Vydra ${model} does not support image reference inputs in the Vydra plugin.`);
			const generated = await runVydraGeneration({
				cfg: req.cfg,
				agentDir: req.agentDir,
				authStore: req.authStore,
				kind: "video",
				model,
				body,
				deadlineTimeoutMs: req.timeoutMs ?? DEFAULT_VYDRA_VIDEO_TIMEOUT_MS
			});
			return {
				videos: [generated.asset],
				model,
				metadata: {
					jobId: generated.jobId,
					videoUrl: generated.resultUrl,
					status: generated.status
				}
			};
		}
	};
}
//#endregion
export { buildVydraVideoGenerationProvider };

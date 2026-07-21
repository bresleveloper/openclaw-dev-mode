import { i as assertOkOrThrowProviderError, m as readProviderJsonResponse } from "../../provider-http-errors-HGLTiqMh.js";
import { r as describeImagesWithModel, t as describeImageWithModel } from "../../image-runtime-D7nHkmgM.js";
import "../../media-understanding-B717fhuK.js";
import { c as postJsonRequest } from "../../shared-CZMxJ_eJ.js";
import "../../provider-http-DjXS2nxd.js";
import { n as normalizeGoogleModelId } from "../../model-id-CAmKILzd.js";
import { t as DEFAULT_GOOGLE_API_BASE_URL } from "../../google-api-base-url-D6BJ2-C8.js";
import { t as resolveGoogleGenerativeAiHttpRequestConfig } from "../../api-DZwribfD.js";
import "../../runtime-api-BJpwD9Qa.js";
//#region extensions/google/media-understanding-provider.ts
const DEFAULT_GOOGLE_AUDIO_MODEL = "gemini-3-flash-preview";
const DEFAULT_GOOGLE_VIDEO_MODEL = "gemini-3-flash-preview";
const DEFAULT_GOOGLE_AUDIO_PROMPT = "Transcribe the audio.";
const DEFAULT_GOOGLE_VIDEO_PROMPT = "Describe the video.";
async function generateGeminiInlineDataText(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const model = (() => {
		const trimmed = params.model?.trim();
		if (!trimmed) return params.defaultModel;
		return normalizeGoogleModelId(trimmed);
	})();
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveGoogleGenerativeAiHttpRequestConfig({
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		headers: params.headers,
		request: params.request,
		capability: params.defaultMime.startsWith("audio/") ? "audio" : "video",
		transport: "media-understanding"
	});
	const { response: res, release } = await postJsonRequest({
		url: `${baseUrl ?? params.defaultBaseUrl}/models/${model}:generateContent`,
		headers,
		body: { contents: [{
			role: "user",
			parts: [{ text: (() => {
				return params.prompt?.trim() || params.defaultPrompt;
			})() }, { inline_data: {
				mime_type: params.mime ?? params.defaultMime,
				data: params.buffer.toString("base64")
			} }]
		}] },
		timeoutMs: params.timeoutMs,
		fetchFn,
		allowPrivateNetwork,
		dispatcherPolicy
	});
	try {
		await assertOkOrThrowProviderError(res, params.httpErrorLabel);
		const text = ((await readProviderJsonResponse(res, params.httpErrorLabel)).candidates?.[0]?.content?.parts ?? []).map((part) => part?.text?.trim()).filter(Boolean).join("\n");
		if (!text) throw new Error(params.missingTextError);
		return {
			text,
			model
		};
	} finally {
		await release();
	}
}
async function transcribeGeminiAudio(params) {
	const { text, model } = await generateGeminiInlineDataText({
		...params,
		defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		defaultModel: DEFAULT_GOOGLE_AUDIO_MODEL,
		defaultPrompt: DEFAULT_GOOGLE_AUDIO_PROMPT,
		defaultMime: "audio/wav",
		httpErrorLabel: "Audio transcription failed",
		missingTextError: "Audio transcription response missing text"
	});
	return {
		text,
		model
	};
}
async function describeGeminiVideo(params) {
	const { text, model } = await generateGeminiInlineDataText({
		...params,
		defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		defaultModel: DEFAULT_GOOGLE_VIDEO_MODEL,
		defaultPrompt: DEFAULT_GOOGLE_VIDEO_PROMPT,
		defaultMime: "video/mp4",
		httpErrorLabel: "Video description failed",
		missingTextError: "Video description response missing text"
	});
	return {
		text,
		model
	};
}
const googleMediaUnderstandingProvider = {
	id: "google",
	capabilities: [
		"image",
		"audio",
		"video"
	],
	defaultModels: {
		image: DEFAULT_GOOGLE_VIDEO_MODEL,
		audio: DEFAULT_GOOGLE_AUDIO_MODEL,
		video: DEFAULT_GOOGLE_VIDEO_MODEL
	},
	autoPriority: {
		image: 30,
		audio: 40,
		video: 10
	},
	nativeDocumentInputs: ["pdf"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel,
	transcribeAudio: transcribeGeminiAudio,
	describeVideo: describeGeminiVideo
};
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };

import { m as readProviderJsonResponse, r as assertOkOrThrowProviderError } from "../../provider-http-errors-CTY_-ABT.mjs";
import { l as postJsonRequest } from "../../shared-BLFkM12I.mjs";
import "../../provider-http-Dn9NddwC.mjs";
import { n as normalizeGoogleModelId } from "../../model-id-CAmKILzd.mjs";
import { f as createGoogleMediaUnderstandingProviderMetadata, o as GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS } from "../../generation-provider-metadata-B7IbWlRp.mjs";
import { t as resolveGoogleGenerativeAiHttpRequestConfig } from "../../api-hbN_YyfC.mjs";
import "../../runtime-api-DdRIh2Zx.mjs";
//#region extensions/google/media-understanding-provider.ts
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
	const url = `${baseUrl}/models/${model}:generateContent`;
	const body = { contents: [{
		role: "user",
		parts: [{ text: (() => {
			return params.prompt?.trim() || params.defaultPrompt;
		})() }, { inline_data: {
			mime_type: params.mime ?? params.defaultMime,
			data: params.buffer.toString("base64")
		} }]
	}] };
	const { response: res, release } = await postJsonRequest({
		url,
		headers,
		body,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
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
		defaultModel: GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS.audio,
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
		defaultModel: GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS.video,
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
	...createGoogleMediaUnderstandingProviderMetadata(),
	transcribeAudio: transcribeGeminiAudio,
	describeVideo: describeGeminiVideo
};
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };

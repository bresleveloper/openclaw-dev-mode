import { m as readProviderJsonResponse, r as assertOkOrThrowProviderError } from "../../provider-http-errors-DmewLLH7.mjs";
import { n as normalizeGooglePreviewModelId } from "../../provider-model-id-normalize-Bx8UgVVS.mjs";
import { d as postJsonRequest } from "../../shared-DcnGQdHV.mjs";
import "../../provider-http-CuRGJD0L.mjs";
import "../../model-id-CPDOOOMu.mjs";
import { f as createGoogleMediaUnderstandingProviderMetadata, o as GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS } from "../../generation-provider-metadata-CkICOOMz.mjs";
import { t as resolveGoogleGenerativeAiHttpRequestConfig } from "../../http-request-Bp4RpyLy.mjs";
//#region extensions/google/media-understanding-provider.ts
const DEFAULT_GOOGLE_AUDIO_PROMPT = "Transcribe the audio.";
const DEFAULT_GOOGLE_VIDEO_PROMPT = "Describe the video.";
async function generateGeminiInlineDataText(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const requestedModel = params.model?.trim();
	const model = requestedModel ? normalizeGooglePreviewModelId(requestedModel) : params.defaultModel;
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
		parts: [{ text: params.prompt?.trim() || params.defaultPrompt }, { inline_data: {
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
	return await generateGeminiInlineDataText({
		...params,
		defaultModel: GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS.audio,
		defaultPrompt: DEFAULT_GOOGLE_AUDIO_PROMPT,
		defaultMime: "audio/wav",
		httpErrorLabel: "Audio transcription failed",
		missingTextError: "Audio transcription response missing text"
	});
}
async function describeGeminiVideo(params) {
	return await generateGeminiInlineDataText({
		...params,
		defaultModel: GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS.video,
		defaultPrompt: DEFAULT_GOOGLE_VIDEO_PROMPT,
		defaultMime: "video/mp4",
		httpErrorLabel: "Video description failed",
		missingTextError: "Video description response missing text"
	});
}
const googleMediaUnderstandingProvider = {
	...createGoogleMediaUnderstandingProviderMetadata(),
	transcribeAudio: transcribeGeminiAudio,
	describeVideo: describeGeminiVideo
};
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };

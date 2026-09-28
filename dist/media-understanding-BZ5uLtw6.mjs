import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError, p as readProviderJsonObjectResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { d as requireTranscriptionText, l as postJsonRequest, n as buildOpenAiCompatibleAuthHeaders, p as resolveProviderHttpRequestConfig, t as buildAudioTranscriptionFormData, u as postMultipartRequest } from "./shared-BLFkM12I.mjs";
import { t as OPENAI_AUDIO_TRANSCRIPTIONS_API } from "./openai-audio-api-CZK5TvIV.mjs";
import "./image-runtime-CgM_qz8p.mjs";
//#region packages/media-understanding-common/src/openai-compatible-video.ts
/** Trim optional strings, falling back when empty. */
function resolveMediaUnderstandingString(value, fallback) {
	return value?.trim() || fallback;
}
/** Coerce text from OpenAI-compatible content or reasoning fields. */
function coerceOpenAiCompatibleVideoText(payload) {
	const message = payload.choices?.[0]?.message;
	if (!message) return null;
	if (typeof message.content === "string" && message.content.trim()) return message.content.trim();
	if (Array.isArray(message.content)) {
		const text = message.content.map((part) => part.text?.trim() ?? "").filter(Boolean).join("\n");
		if (text) return text;
	}
	if (typeof message.reasoning_content === "string" && message.reasoning_content.trim()) return message.reasoning_content.trim();
	return null;
}
/** Build an OpenAI-compatible request body with an inline data URL video. */
function buildOpenAiCompatibleVideoRequestBody(params) {
	return {
		model: params.model,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: params.prompt
			}, {
				type: "video_url",
				video_url: { url: `data:${params.mime};base64,${params.buffer.toString("base64")}` }
			}]
		}]
	};
}
//#endregion
//#region src/media-understanding/openai-compatible-video.ts
/** Describe a video through an OpenAI-compatible chat-completions endpoint. */
async function describeOpenAiCompatibleVideo(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const model = resolveMediaUnderstandingString(params.model, params.defaultModel);
	const mime = resolveMediaUnderstandingString(params.mime, "video/mp4");
	const prompt = resolveMediaUnderstandingString(params.prompt, params.defaultPrompt);
	const errorPrefix = `${params.providerLabel} video description`;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: params.baseUrl,
		defaultBaseUrl: params.defaultBaseUrl,
		headers: params.headers,
		request: params.request,
		defaultHeaders: {
			"content-type": "application/json",
			...buildOpenAiCompatibleAuthHeaders(params)
		},
		provider: params.provider,
		api: "openai-completions",
		capability: "video",
		transport: "media-understanding"
	});
	const { response, release } = await postJsonRequest({
		url: `${baseUrl}/chat/completions`,
		headers,
		body: buildOpenAiCompatibleVideoRequestBody({
			model,
			prompt,
			mime,
			buffer: params.buffer
		}),
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn,
		allowPrivateNetwork,
		dispatcherPolicy
	});
	try {
		await assertOkOrThrowHttpError(response, `${errorPrefix} failed`, { requestHeaders: headers });
		const text = coerceOpenAiCompatibleVideoText(await readProviderJsonResponse(response, `${errorPrefix} failed`, { requestHeaders: headers }));
		if (!text) throw new Error(`${errorPrefix} response missing content`);
		return {
			text,
			model
		};
	} finally {
		await release();
	}
}
//#endregion
//#region src/media-understanding/openai-compatible-audio.ts
function resolveModel(model, fallback) {
	return model?.trim() || fallback;
}
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
async function transcribeOpenAiCompatibleAudio(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: params.baseUrl,
		defaultBaseUrl: params.defaultBaseUrl,
		headers: params.headers,
		request: params.request,
		defaultHeaders: buildOpenAiCompatibleAuthHeaders(params),
		provider: params.provider,
		api: OPENAI_AUDIO_TRANSCRIPTIONS_API,
		capability: "audio",
		transport: "media-understanding"
	});
	const url = `${baseUrl}/audio/transcriptions`;
	const model = resolveModel(params.model, params.defaultModel);
	const form = buildAudioTranscriptionFormData({
		buffer: params.buffer,
		fileName: params.fileName,
		mime: params.mime,
		fields: {
			model,
			language: params.language,
			prompt: params.prompt
		}
	});
	const { response: res, release } = await postMultipartRequest({
		url,
		headers,
		body: form,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn,
		pinDns: false,
		allowPrivateNetwork,
		dispatcherPolicy
	});
	try {
		await assertOkOrThrowHttpError(res, "Audio transcription failed", { requestHeaders: headers });
		const payload = await readProviderJsonObjectResponse(res, "Audio transcription failed", { requestHeaders: headers });
		return {
			text: requireTranscriptionText(typeof payload.text === "string" ? payload.text : void 0, "Audio transcription response missing text"),
			model
		};
	} finally {
		await release();
	}
}
//#endregion
export { resolveMediaUnderstandingString as a, coerceOpenAiCompatibleVideoText as i, describeOpenAiCompatibleVideo as n, buildOpenAiCompatibleVideoRequestBody as r, transcribeOpenAiCompatibleAudio as t };

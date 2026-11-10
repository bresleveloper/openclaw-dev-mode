import { t as XAI_BASE_URL } from "./model-definitions-Jk921z8H.mjs";
import { l as createXaiMediaUnderstandingProviderMetadata } from "./capability-provider-metadata-factory-Dd0r_YMX.mjs";
import "./capability-provider-metadata-n00NVxSt.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assertOkOrThrowHttpError, buildAudioTranscriptionFormData, postTranscriptionRequest, readProviderJsonObjectResponse, requireTranscriptionText, resolveProviderHttpRequestConfig } from "openclaw/plugin-sdk/provider-http";
//#region extensions/xai/stt.ts
function resolveXaiSttBaseUrl(value) {
	return normalizeOptionalString(value ?? process.env.XAI_BASE_URL) ?? XAI_BASE_URL;
}
async function transcribeXaiAudio(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: resolveXaiSttBaseUrl(params.baseUrl),
		defaultBaseUrl: XAI_BASE_URL,
		headers: params.headers,
		request: params.request,
		defaultHeaders: { Authorization: `Bearer ${params.apiKey}` },
		provider: "xai",
		api: "xai-stt",
		capability: "audio",
		transport: "media-understanding"
	});
	const language = normalizeOptionalString(params.language);
	const form = buildAudioTranscriptionFormData({
		buffer: params.buffer,
		fileName: params.fileName,
		mime: params.mime,
		fields: { language }
	});
	const { response, release } = await postTranscriptionRequest({
		url: `${baseUrl}/stt`,
		headers,
		body: form,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn,
		allowPrivateNetwork,
		dispatcherPolicy,
		auditContext: "xai stt"
	});
	try {
		await assertOkOrThrowHttpError(response, "xAI audio transcription failed");
		const payload = await readProviderJsonObjectResponse(response, "xai.stt");
		return { text: requireTranscriptionText(payload.text, "xAI transcription response missing text") };
	} finally {
		await release();
	}
}
function buildXaiMediaUnderstandingProvider() {
	return {
		...createXaiMediaUnderstandingProviderMetadata(),
		transcribeAudio: transcribeXaiAudio
	};
}
//#endregion
export { buildXaiMediaUnderstandingProvider };

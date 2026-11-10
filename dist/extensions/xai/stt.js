import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { n as assertOkOrThrowHttpError, p as readProviderJsonObjectResponse } from "../../provider-http-errors-CjVOxCE5.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { f as postMultipartRequest, h as resolveProviderHttpRequestConfig, p as requireTranscriptionText, t as buildAudioTranscriptionFormData } from "../../shared-BMUa_P4s.mjs";
import "../../provider-http-BuV15s4V.mjs";
import { t as XAI_BASE_URL } from "../../model-definitions-Bv0caRc4.mjs";
import { l as createXaiMediaUnderstandingProviderMetadata } from "../../capability-provider-metadata-factory-Cs1Hgti5.mjs";
import "../../capability-provider-metadata-D94p50HJ.mjs";
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
	const { response, release } = await postMultipartRequest({
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

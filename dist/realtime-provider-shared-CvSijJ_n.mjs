import { A as resolveExpiresAtMsFromEpochSeconds } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
//#region extensions/openai/realtime-provider-shared.ts
const OPENAI_REALTIME_API_BASE_URL = "https://api.openai.com/v1";
const OPENAI_REALTIME_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true,
	hostnameAllowlist: [new URL(OPENAI_REALTIME_API_BASE_URL).hostname]
};
const OPENAI_REALTIME_CLIENT_SECRET_REQUEST_TIMEOUT_MS = 3e4;
function readRealtimeErrorDetail(error) {
	if (typeof error === "string" && error) return error;
	const message = asOptionalRecord(error)?.message;
	if (typeof message === "string" && message) return message;
	return "Unknown error";
}
function resolveOpenAIProviderConfigRecord(config) {
	const providers = asOptionalRecord(config.providers);
	return asOptionalRecord(providers?.openai) ?? asOptionalRecord(config.openai) ?? asOptionalRecord(config);
}
function captureOpenAIRealtimeWsClose(params, captureWsEvent) {
	captureWsEvent({
		url: params.url,
		direction: "local",
		kind: "ws-close",
		flowId: params.flowId,
		closeCode: typeof params.code === "number" ? params.code : void 0,
		meta: {
			provider: "openai",
			capability: params.capability,
			reason: Buffer.isBuffer(params.reasonBuffer) && params.reasonBuffer.length > 0 ? params.reasonBuffer.toString("utf8") : void 0
		}
	});
}
async function createOpenAIRealtimeSecret(params, { createProviderHttpError, readProviderJsonResponse, resolveProviderRequestHeaders, fetchWithSsrFGuard }) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		init: {
			method: "POST",
			headers: resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: params.url,
				capability: "audio",
				transport: "http",
				defaultHeaders: {
					Authorization: `Bearer ${params.authToken}`,
					"Content-Type": "application/json"
				}
			}) ?? {
				Authorization: `Bearer ${params.authToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(params.body)
		},
		policy: OPENAI_REALTIME_SSRF_POLICY,
		timeoutMs: OPENAI_REALTIME_CLIENT_SECRET_REQUEST_TIMEOUT_MS,
		auditContext: params.auditContext
	});
	const payload = await (async () => {
		try {
			if (!response.ok) {
				const error = await createProviderHttpError(response, params.errorMessage);
				if (response.status === 401 && params.authRejectedMessage) error.message = params.authRejectedMessage;
				throw error;
			}
			return await readProviderJsonResponse(response, "openai.realtime-session");
		} finally {
			await release();
		}
	})();
	const nestedSecret = payload && typeof payload === "object" ? payload.client_secret : void 0;
	const clientSecret = normalizeOptionalString(asOptionalRecord(payload)?.value) ?? normalizeOptionalString(asOptionalRecord(nestedSecret)?.value);
	if (!clientSecret) throw new Error(params.missingValueMessage);
	const expiresAt = payload && typeof payload === "object" ? payload.expires_at : void 0;
	const expiresAtMs = resolveExpiresAtMsFromEpochSeconds(expiresAt);
	return {
		value: clientSecret,
		...expiresAtMs === void 0 ? {} : { expiresAt: expiresAtMs }
	};
}
async function createOpenAIRealtimeClientSecret(params, runtime) {
	const url = `${OPENAI_REALTIME_API_BASE_URL}/realtime/client_secrets`;
	return createOpenAIRealtimeSecret({
		...params,
		url,
		body: { session: params.session },
		errorMessage: "OpenAI Realtime client secret failed",
		missingValueMessage: "OpenAI Realtime client secret response did not include a value"
	}, runtime);
}
async function createOpenAIRealtimeTranscriptionClientSecret(params, runtime) {
	const url = `${OPENAI_REALTIME_API_BASE_URL}/realtime/client_secrets`;
	return createOpenAIRealtimeSecret({
		...params,
		url,
		body: { session: params.session },
		errorMessage: "OpenAI Realtime transcription client secret failed",
		missingValueMessage: "OpenAI Realtime transcription client secret response did not include a value"
	}, runtime);
}
//#endregion
export { resolveOpenAIProviderConfigRecord as a, readRealtimeErrorDetail as i, createOpenAIRealtimeClientSecret as n, createOpenAIRealtimeTranscriptionClientSecret as r, captureOpenAIRealtimeWsClose as t };

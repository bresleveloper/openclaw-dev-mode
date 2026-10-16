import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { A as resolveExpiresAtMsFromEpochSeconds } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./number-runtime-CgyXj1A5.mjs";
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
async function createOpenAIRealtimeClientSecret(params, { createProviderHttpError, readProviderJsonResponse, resolveProviderRequestHeaders, fetchWithSsrFGuard }, label = "OpenAI Realtime") {
	const url = `${OPENAI_REALTIME_API_BASE_URL}/realtime/client_secrets`;
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "POST",
			headers: resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: url,
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
			body: JSON.stringify({ session: params.session })
		},
		policy: OPENAI_REALTIME_SSRF_POLICY,
		timeoutMs: OPENAI_REALTIME_CLIENT_SECRET_REQUEST_TIMEOUT_MS,
		auditContext: params.auditContext
	});
	let payload;
	try {
		if (!response.ok) {
			const error = await createProviderHttpError(response, `${label} client secret failed`);
			if (response.status === 401 && params.authRejectedMessage) error.message = params.authRejectedMessage;
			throw error;
		}
		payload = await readProviderJsonResponse(response, "openai.realtime-session");
	} finally {
		await release();
	}
	const record = asOptionalObjectRecord(payload);
	const nestedSecret = record?.client_secret;
	const clientSecret = normalizeOptionalString(asOptionalRecord(payload)?.value) ?? normalizeOptionalString(asOptionalRecord(nestedSecret)?.value);
	if (!clientSecret) throw new Error(`${label} client secret response did not include a value`);
	const expiresAtMs = resolveExpiresAtMsFromEpochSeconds(record?.expires_at);
	return {
		value: clientSecret,
		...expiresAtMs === void 0 ? {} : { expiresAt: expiresAtMs }
	};
}
//#endregion
export { readRealtimeErrorDetail as n, resolveOpenAIProviderConfigRecord as r, createOpenAIRealtimeClientSecret as t };

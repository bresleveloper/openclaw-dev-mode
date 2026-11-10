import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { n as assertOkOrThrowHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-WdycwKIG.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as executeProviderOperationWithRetry } from "./operation-retry-B2m6H7IT.mjs";
import { c as fetchWithTimeoutGuarded, h as resolveProviderHttpRequestConfig } from "./shared-BMUa_P4s.mjs";
import "./provider-http-BuV15s4V.mjs";
//#region extensions/minimax/media-provider-runtime.ts
const DEFAULT_MINIMAX_MEDIA_BASE_URL = "https://api.minimax.io";
function resolveMinimaxMediaBaseUrl(cfg, providerId) {
	const configured = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
	return URL.parse(configured ?? "")?.origin ?? DEFAULT_MINIMAX_MEDIA_BASE_URL;
}
function resolveMinimaxMediaRequestConfig(params) {
	return resolveProviderHttpRequestConfig({
		baseUrl: params.baseUrl ?? resolveMinimaxMediaBaseUrl(params.cfg, params.providerId),
		defaultBaseUrl: DEFAULT_MINIMAX_MEDIA_BASE_URL,
		defaultHeaders: {
			Authorization: `Bearer ${params.apiKey}`,
			...params.capability !== "audio" ? { "Content-Type": "application/json" } : {}
		},
		provider: params.providerId,
		capability: params.capability,
		transport: "http",
		request: sanitizeConfiguredModelProviderRequest(params.cfg?.models?.providers?.[params.providerId]?.request)
	});
}
function assertMinimaxBaseResp(value, context) {
	const baseResp = asOptionalRecord(value);
	if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) throw new Error(`${context} (${baseResp.status_code}): ${readStringField(baseResp, "status_msg") ?? "unknown error"}`);
}
function normalizeMinimaxHexAudio(data, label) {
	const normalized = data.trim();
	if (!/^[0-9a-f]+$/iu.test(normalized) || normalized.length % 2 !== 0) throw new Error(`${label} returned malformed hex audio`);
	return normalized;
}
function resolveMinimaxGuardedRequestOptions(policy) {
	return policy.allowPrivateNetwork || policy.dispatcherPolicy ? {
		...policy.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
		...policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {}
	} : void 0;
}
async function fetchMinimaxResponse(params) {
	return await executeProviderOperationWithRetry({
		provider: "minimax",
		stage: params.stage,
		operation: async () => {
			const timeoutMs = typeof params.timeoutMs === "function" ? params.timeoutMs() : params.timeoutMs;
			const result = await fetchWithTimeoutGuarded(params.url, params.init ?? {}, typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : void 0, params.fetchFn, resolveMinimaxGuardedRequestOptions(params.policy));
			try {
				await assertOkOrThrowHttpError(result.response, params.requestFailedMessage);
			} catch (error) {
				await result.release();
				throw error;
			}
			return result;
		}
	});
}
//#endregion
export { resolveMinimaxMediaRequestConfig as i, fetchMinimaxResponse as n, normalizeMinimaxHexAudio as r, assertMinimaxBaseResp as t };

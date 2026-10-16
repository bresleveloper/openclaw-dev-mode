import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as executeProviderOperationWithRetry } from "./operation-retry-Ci68Y-og.mjs";
import { c as fetchWithTimeoutGuarded } from "./shared-DcnGQdHV.mjs";
import "./provider-http-CuRGJD0L.mjs";
//#region extensions/minimax/media-provider-runtime.ts
const DEFAULT_MINIMAX_MEDIA_BASE_URL = "https://api.minimax.io";
function resolveMinimaxMediaBaseUrl(cfg, providerId) {
	const configured = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
	return URL.parse(configured ?? "")?.origin ?? "https://api.minimax.io";
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
		retry: params.retry,
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
export { resolveMinimaxMediaBaseUrl as a, normalizeMinimaxHexAudio as i, assertMinimaxBaseResp as n, fetchMinimaxResponse as r, DEFAULT_MINIMAX_MEDIA_BASE_URL as t };

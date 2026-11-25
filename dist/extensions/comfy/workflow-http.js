import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { assertOkOrThrowHttpError, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/comfy/workflow-http.ts
async function readJsonResponse(params) {
	const { errorPrefix, deadline, timeoutMs, ...request } = params;
	const remainingMs = () => resolveComfyRemainingMs(deadline, timeoutMs);
	const { response, release } = await fetchWithSsrFGuard({
		...request,
		timeoutMs: remainingMs()
	});
	try {
		const requestHeaders = params.init?.headers;
		await assertOkOrThrowHttpError(response, errorPrefix, {
			requestHeaders,
			bodyTimeoutMs: remainingMs,
			onBodyTimeout: () => createComfyTimeoutError(timeoutMs)
		});
		return await readProviderJsonResponse(response, errorPrefix, {
			requestHeaders,
			timeoutMs: remainingMs,
			onTimeout: () => createComfyTimeoutError(timeoutMs)
		});
	} finally {
		await release();
	}
}
function createComfyTimeoutError(timeoutMs) {
	return /* @__PURE__ */ new Error(`Comfy workflow did not finish within ${Math.ceil(timeoutMs / 1e3)}s`);
}
function resolveComfyRemainingMs(deadline, timeoutMs, defaultTimeoutMs = timeoutMs) {
	const defaultMs = resolvePositiveTimerTimeoutMs(defaultTimeoutMs, 1);
	const remainingMs = deadline - performance.now();
	if (remainingMs <= 0) throw createComfyTimeoutError(timeoutMs);
	return Math.max(1, Math.min(defaultMs, remainingMs));
}
export { createComfyTimeoutError, readJsonResponse, resolveComfyRemainingMs };

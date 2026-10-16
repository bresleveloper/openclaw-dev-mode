import { c as fetchWithTimeoutGuarded } from "./shared-DcnGQdHV.mjs";
import "./provider-http-CuRGJD0L.mjs";
//#region extensions/openrouter/video-http.ts
function headersForOpenRouterGet(url, baseUrl, requestHeaders) {
	const origin = URL.parse(url)?.origin;
	if (origin === void 0 || origin !== URL.parse(baseUrl)?.origin) return new Headers();
	const headers = new Headers(requestHeaders);
	headers.delete("content-type");
	return headers;
}
function resolveOpenRouterVideoUrl(url, baseUrl) {
	return new URL(url, `${baseUrl}/`).href;
}
async function fetchOpenRouterVideoGet(params) {
	const url = resolveOpenRouterVideoUrl(params.url, params.baseUrl);
	return await fetchWithTimeoutGuarded(url, {
		method: "GET",
		headers: headersForOpenRouterGet(url, params.baseUrl, params.headers)
	}, params.timeoutMs, fetch, {
		...params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
		...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
		auditContext: params.auditContext
	});
}
//#endregion
export { resolveOpenRouterVideoUrl as n, fetchOpenRouterVideoGet as t };

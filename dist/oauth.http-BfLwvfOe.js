import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-Bf6oQCTF.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-D9flCs6F.js";
import "./response-limit-runtime-B7RO3Er4.js";
import { t as withTrustedEnvProxyGuardedFetchMode } from "./fetch-runtime-BLk-o8LM.js";
import "./ssrf-runtime-CyXpgbLM.js";
import { a as DEFAULT_FETCH_TIMEOUT_MS } from "./oauth.shared-BD6M390i.js";
//#region extensions/google/oauth.http.ts
const GOOGLE_OAUTH_BODY_MAX_BYTES = 16 * 1024 * 1024;
async function fetchWithTimeout(url, init, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
	const guardedOptions = {
		url,
		init,
		timeoutMs
	};
	const { response, release } = await fetchWithSsrFGuard(shouldUseEnvHttpProxyForUrl(url) ? withTrustedEnvProxyGuardedFetchMode(guardedOptions) : guardedOptions);
	try {
		const body = await readResponseWithLimit(response, GOOGLE_OAUTH_BODY_MAX_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`google HTTP fetch: body exceeds ${maxBytes} bytes (got ${size})`) });
		const bodyBytes = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
		return new Response(bodyBytes, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} finally {
		await release();
	}
}
//#endregion
export { fetchWithTimeout as t };

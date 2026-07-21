import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-HGLTiqMh.js";
import { t as resolveFetch } from "./fetch-D0nBTEZV.js";
import "./fetch-runtime-BLk-o8LM.js";
import "./provider-http-DjXS2nxd.js";
//#region extensions/discord/src/pluralkit.ts
const PLURALKIT_API_BASE = "https://api.pluralkit.me/v2";
const PLURALKIT_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
async function fetchPluralKitMessageInfo(params) {
	if (!params.config?.enabled) return null;
	const fetchImpl = resolveFetch(params.fetcher);
	if (!fetchImpl) return null;
	const headers = {};
	if (params.config.token?.trim()) headers.Authorization = params.config.token.trim();
	const res = await fetchImpl(`${PLURALKIT_API_BASE}/messages/${params.messageId}`, { headers });
	if (res.status === 404) return null;
	if (!res.ok) {
		const text = await readResponseTextLimited(res, PLURALKIT_ERROR_BODY_LIMIT_BYTES).catch(() => "");
		const detail = text.trim() ? `: ${text.trim()}` : "";
		throw new Error(`PluralKit API failed (${res.status})${detail}`);
	}
	return await readProviderJsonResponse(res, "PluralKit message");
}
//#endregion
export { fetchPluralKitMessageInfo as t };

import { r as THEME_ARTWORK_ID_PATTERN, w as THEME_LOCAL_ID_PATTERN } from "./theme-BshtYPJX.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import { r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { d as sendMethodNotAllowed } from "./http-common-DyL3AdjD.mjs";
import { t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { o as resolveHttpImageRepresentation, s as sendHttpImageResponse } from "./http-image-response-W_WEsC5b.mjs";
import { n as resolvePluginThemeArtwork } from "./theme-catalog-DFDsjmkQ.mjs";
//#region src/gateway/plugin-theme-art-http.ts
/** Serves published theme artwork without reopening plugin-owned files. */
async function handlePluginThemeArtHttpRequest(req, res, opts) {
	const pathname = req.url ? new URL(req.url, "http://localhost").pathname : void 0;
	const request = parseControlUiResourcePath("pluginThemeArt", pathname, opts.basePath);
	if (!request.matched) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	if (!await authorizeControlUiReadRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	const [themeId, kind, artId] = request.segments ?? [];
	if (!request.value || !themeId || !THEME_LOCAL_ID_PATTERN.test(themeId) || kind !== "icon" && kind !== "hat" && kind !== "critter" || !artId || !THEME_ARTWORK_ID_PATTERN.test(artId)) {
		respondNotFound(res);
		return true;
	}
	const svg = resolvePluginThemeArtwork(request.value, themeId, kind, artId);
	const image = svg ? await resolveHttpImageRepresentation("theme-art.svg", Buffer.from(svg, "utf8")) : void 0;
	if (!image) {
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image,
		filename: "plugin-theme-art.svg"
	});
	return true;
}
//#endregion
export { handlePluginThemeArtHttpRequest };

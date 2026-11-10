import { a as resolveControlUiAllowedOrigins } from "./gateway-control-ui-origins-Di731Cdm.mjs";
//#region src/gateway/control-ui-image-cors.ts
function resolveControlUiImageCorsOrigin(req, cfg) {
	const rawOrigin = typeof req.headers.origin === "string" ? req.headers.origin.trim() : "";
	if (!rawOrigin) return;
	let origin;
	try {
		const parsed = new URL(rawOrigin);
		if (parsed.origin !== rawOrigin || parsed.username || parsed.password) return;
		origin = parsed.origin;
	} catch {
		return;
	}
	return resolveControlUiAllowedOrigins(cfg).some((candidate) => candidate.trim() === "*" || candidate.trim() === origin) ? origin : void 0;
}
function setControlUiImageCorsHeaders(req, res, cfg) {
	res.setHeader("Vary", "Origin, Authorization, Cookie");
	if (!req.headers.origin) return true;
	const origin = resolveControlUiImageCorsOrigin(req, cfg);
	if (!origin) {
		res.removeHeader("Access-Control-Allow-Origin");
		res.removeHeader("Access-Control-Allow-Credentials");
		return false;
	}
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	return true;
}
//#endregion
export { setControlUiImageCorsHeaders as t };

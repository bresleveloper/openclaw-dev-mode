import { t as isSelfContainedSvg } from "./svg-image-1iOdCRUI.mjs";
import { d as normalizeMimeType } from "./mime-1zBUMwu6.mjs";
import { n as matchesHttpIfNoneMatch } from "./http-conditional-vOFTJV-M.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/http-image-response.ts
/** Authenticated UI images are deliberately small, bounded presentation assets. */
const HTTP_IMAGE_MAX_BYTES = 524288;
/** Vector images are markup the renderer must parse, so they get a tighter cap. */
const HTTP_SVG_MAX_BYTES = 65536;
const SVG_MIME_TYPE = "image/svg+xml";
const ICO_MIME_TYPE = "image/x-icon";
/** Image types accepted by the authenticated Control UI image routes. */
const ALLOWED_HTTP_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	SVG_MIME_TYPE,
	"image/webp",
	ICO_MIME_TYPE
]);
function resolveHttpImageMimeType(value) {
	const normalized = normalizeMimeType(value);
	const contentType = normalized === "image/vnd.microsoft.icon" ? ICO_MIME_TYPE : normalized;
	return contentType && ALLOWED_HTTP_IMAGE_MIME_TYPES.has(contentType) ? contentType : void 0;
}
/** Hash final, validated response bytes once when their cached representation is created. */
function createHttpImageRepresentation(body, contentType) {
	return {
		body,
		contentType,
		etag: `"${createHash("sha256").update(body).digest("base64url")}"`
	};
}
/** Sniffs and validates bytes before they become a browser image response. */
async function resolveHttpImageRepresentation(sourceName, body) {
	if (body.byteLength === 0 || body.byteLength > 524288) return;
	let contentType;
	if (path.extname(sourceName).toLowerCase() === ".svg") contentType = body.byteLength <= 65536 && isSelfContainedSvg(body.toString("utf8")) ? SVG_MIME_TYPE : void 0;
	else contentType = resolveHttpImageMimeType((await fileTypeFromBuffer(body))?.mime);
	if (!contentType) return;
	return createHttpImageRepresentation(body, contentType);
}
/** Prevent image documents from executing scripts or making cross-origin requests. */
function applyHttpImageContentSecurityPolicy(res) {
	res.setHeader("content-security-policy", "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; sandbox");
}
/** Writes the shared private-cache and document-sandbox policy for image bytes. */
function sendHttpImageResponse(params) {
	const { req, res, image } = params;
	res.setHeader("etag", image.etag);
	res.setHeader("cache-control", params.cacheControl ?? "private, max-age=3600");
	res.setHeader("cross-origin-resource-policy", "same-origin");
	res.setHeader("x-content-type-options", "nosniff");
	applyHttpImageContentSecurityPolicy(res);
	res.setHeader("content-disposition", `attachment; filename="${params.filename}"`);
	if (matchesHttpIfNoneMatch(req.headers["if-none-match"], image.etag)) {
		res.statusCode = 304;
		res.end();
		return;
	}
	res.statusCode = 200;
	res.setHeader("content-type", image.contentType);
	res.setHeader("content-length", String(image.body.byteLength));
	res.end(req.method === "HEAD" ? void 0 : image.body);
}
//#endregion
export { resolveHttpImageMimeType as a, createHttpImageRepresentation as i, HTTP_SVG_MAX_BYTES as n, resolveHttpImageRepresentation as o, applyHttpImageContentSecurityPolicy as r, sendHttpImageResponse as s, HTTP_IMAGE_MAX_BYTES as t };

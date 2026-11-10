import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { t as parseControlUiUserBackgroundPath } from "./control-ui-user-background-route-eOz68x04.mjs";
import { d as sendMethodNotAllowed, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import { n as getUserBackgroundImage } from "./user-background-CyqAn0ug.mjs";
import { t as setControlUiImageCorsHeaders } from "./control-ui-image-cors-HzC6M67L.mjs";
//#region src/gateway/user-background-http.ts
/** Private bytes are never authorized by an asset ID, avatar visibility, or a query token. */
async function handleUserBackgroundHttpRequest(req, res, pathname, options) {
	const parsed = parseControlUiUserBackgroundPath(pathname, options.basePath);
	if (!parsed.matched) return false;
	res.setHeader("Cache-Control", "private, no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	const corsAllowed = setControlUiImageCorsHeaders(req, res, options.cfg ?? options.getRuntimeConfig?.() ?? readRuntimeConfig());
	if (req.method === "OPTIONS") {
		if (!corsAllowed) {
			sendJson(res, 403, { error: { type: "origin_not_allowed" } });
			return true;
		}
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
		res.setHeader("Access-Control-Allow-Headers", "Authorization");
		res.setHeader("Access-Control-Max-Age", "600");
		res.writeHead(204);
		res.end();
		return true;
	}
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const auth = await authorizeControlUiReadRequestOrReply({
		req,
		res,
		...options,
		requiredOperatorMethod: "users.background.get",
		allowQueryToken: false
	});
	if (!auth) return true;
	setControlUiImageCorsHeaders(req, res, options.getRuntimeConfig?.() ?? readRuntimeConfig());
	const profileId = auth.authenticatedUserProfile?.profileId;
	if (!profileId || !parsed.assetId) {
		auth.assertCurrent();
		sendJson(res, 404, { error: { type: "not_found" } });
		return true;
	}
	for (;;) {
		const prepared = await getUserBackgroundImage(profileId, parsed.assetId, {
			assertCurrent: auth.assertCurrent,
			includeBytes: req.method !== "HEAD"
		});
		await auth.revalidate();
		if (!prepared.isCurrent()) continue;
		setControlUiImageCorsHeaders(req, res, options.getRuntimeConfig?.() ?? readRuntimeConfig());
		auth.assertCurrent();
		const image = prepared.image;
		if (prepared.byteLength === void 0) {
			sendJson(res, 404, { error: { type: "not_found" } });
			return true;
		}
		res.writeHead(200, {
			"Content-Type": "image/jpeg",
			"Content-Length": prepared.byteLength
		});
		res.end(req.method === "HEAD" ? void 0 : image);
		return true;
	}
}
//#endregion
export { handleUserBackgroundHttpRequest };

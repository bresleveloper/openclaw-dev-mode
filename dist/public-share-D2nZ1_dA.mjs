import { r as normalizeControlUiBasePath } from "./grammar-Dp605oVy.mjs";
//#region packages/session-url-contract/src/public-share.ts
const CONTROL_UI_PUBLIC_SESSION_SHARE_TOKEN_MAX_LENGTH = 7e3;
function isSyntacticallyValidPublicSessionToken(token) {
	const encoded = token.startsWith("v1.") ? token.slice(3) : "";
	return token.length <= 7e3 && encoded.length > 0 && encoded.length % 4 !== 1 && /^[A-Za-z0-9_-]+$/u.test(encoded);
}
function buildControlUiPublicSessionSharePath(params) {
	if (!isSyntacticallyValidPublicSessionToken(params.token)) throw new Error("invalid public session token");
	return `${normalizeControlUiBasePath(params.basePath)}/share/session?${new URLSearchParams({ token: params.token })}`;
}
function parseControlUiPublicSessionShareUrl(url, basePath) {
	if (url.href.length > 8192 || url.pathname !== `${normalizeControlUiBasePath(basePath)}/share/session` || url.searchParams.getAll("token").length !== 1 || [...url.searchParams.keys()].some((key) => key !== "token" && key !== "offset")) return null;
	const token = url.searchParams.get("token") ?? "";
	return isSyntacticallyValidPublicSessionToken(token) ? { token } : null;
}
//#endregion
export { buildControlUiPublicSessionSharePath as n, parseControlUiPublicSessionShareUrl as r, CONTROL_UI_PUBLIC_SESSION_SHARE_TOKEN_MAX_LENGTH as t };

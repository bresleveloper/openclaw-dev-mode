import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./security-runtime-6domDoE8.mjs";
//#region extensions/browser/src/browser/http-auth.ts
function firstHeader(value) {
	return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
function parseBearerToken(authorization) {
	if (!normalizeLowercaseStringOrEmpty(authorization).startsWith("bearer ")) return;
	return authorization.slice(7).trim() || void 0;
}
function parseBasicPassword(authorization) {
	if (!normalizeLowercaseStringOrEmpty(authorization).startsWith("basic ")) return;
	const encoded = authorization.slice(6).trim();
	if (!encoded) return;
	try {
		const decoded = Buffer.from(encoded, "base64").toString("utf8");
		const sep = decoded.indexOf(":");
		if (sep < 0) return;
		return decoded.slice(sep + 1).trim() || void 0;
	} catch {
		return;
	}
}
function isAuthorizedBrowserRequest(req, auth) {
	const authorization = firstHeader(req.headers.authorization).trim();
	if (auth.token) {
		const bearer = parseBearerToken(authorization);
		if (bearer && safeEqualSecret(bearer, auth.token)) return true;
	}
	if (auth.password) {
		const passwordHeader = firstHeader(req.headers["x-openclaw-password"]).trim();
		if (passwordHeader && safeEqualSecret(passwordHeader, auth.password)) return true;
		const basicPassword = parseBasicPassword(authorization);
		if (basicPassword && safeEqualSecret(basicPassword, auth.password)) return true;
	}
	return false;
}
//#endregion
export { isAuthorizedBrowserRequest as n, firstHeader as t };

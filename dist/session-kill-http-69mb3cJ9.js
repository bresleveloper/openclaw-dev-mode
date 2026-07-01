import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-D5SEXRvS.js";
import { u as loadSessionEntry } from "./session-utils-CWlrm3MP.js";
import { i as killSubagentRunAdmin } from "./subagent-control-HIkA0fhI.js";
import { a as sendJson, i as sendInvalidRequest, o as sendMethodNotAllowed, s as sendMissingScopeForbidden } from "./http-common-BrhLjURO.js";
import { p as resolveTrustedHttpOperatorScopes, t as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-Dtz5EuuO.js";
import "./http-utils-B4rluHM7.js";
//#region src/gateway/session-kill-http.ts
function resolveSessionKeyFromPath(pathname) {
	const match = pathname.match(/^\/sessions\/([^/]+)\/kill$/);
	if (!match) return { matched: false };
	try {
		const decoded = decodeURIComponent(match[1] ?? "").trim();
		if (!decoded) return {
			error: "invalid-session-key",
			matched: true
		};
		return {
			matched: true,
			sessionKey: decoded
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
async function handleSessionKillHttpRequest(req, res, opts) {
	const cfg = getRuntimeConfig();
	const sessionKeyResolution = resolveSessionKeyFromPath(new URL(req.url ?? "/", "http://localhost").pathname);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	});
	if (!requestAuth) return true;
	const scopeAuth = authorizeOperatorScopesForMethod("sessions.delete", resolveTrustedHttpOperatorScopes(req, requestAuth));
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const { entry, canonicalKey } = loadSessionEntry(sessionKey);
	if (!entry) {
		sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		return true;
	}
	sendJson(res, 200, {
		ok: true,
		killed: (await killSubagentRunAdmin({
			cfg,
			sessionKey: canonicalKey
		})).killed
	});
	return true;
}
//#endregion
export { handleSessionKillHttpRequest };

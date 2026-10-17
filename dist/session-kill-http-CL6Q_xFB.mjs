import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DrLraxiU.mjs";
import { r as killSubagentRunAdmin } from "./subagent-control-kill-BZhM9KRs.mjs";
import "./subagent-control-BQtcfH-V.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, l as sendInvalidRequest, u as sendJson } from "./http-common-D3e5uEH1.mjs";
import { d as resolveTrustedHttpOperatorScopes, r as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-BhzlHO9u.mjs";
import "./http-utils-B-HtYJ8A.mjs";
//#region src/gateway/session-kill-http.ts
async function handleSessionKillHttpRequest(req, res, opts) {
	const cfg = opts.cfg ?? getRuntimeConfig();
	const url = new URL(req.url ?? "/", "http://localhost");
	const match = url.pathname.match(/^\/sessions\/([^/]+)\/kill$/);
	if (!match) return false;
	let sessionKey;
	try {
		sessionKey = decodeURIComponent(match[1] ?? "").trim();
	} catch {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	if (!sessionKey) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		cfg,
		trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback
	});
	if (!requestAuth) return true;
	const requestedScopes = resolveTrustedHttpOperatorScopes(req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, requestedScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, url.searchParams.get("agentId") ?? void 0);
	if (!requestedAgent.ok) {
		sendInvalidRequest(res, requestedAgent.error.message);
		return true;
	}
	const { entry, canonicalKey } = loadGatewaySessionEntry(sessionKey, { agentId: requestedAgent.agentId });
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
	const result = await killSubagentRunAdmin({
		cfg,
		sessionKey: canonicalKey,
		agentId: requestedAgent.agentId
	}, { assertCurrent: requestAuth.assertCurrent });
	if (result.found && result.error) {
		sendJson(res, 503, {
			ok: false,
			error: {
				type: "unavailable",
				message: result.error
			}
		});
		return true;
	}
	sendJson(res, 200, {
		ok: true,
		killed: result.killed
	});
	return true;
}
//#endregion
export { handleSessionKillHttpRequest };

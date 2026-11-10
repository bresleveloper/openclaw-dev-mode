import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CSDERtm3.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, l as sendInvalidRequest, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { r as killSubagentRunAdmin } from "./subagent-control-kill-ByoDJlho.mjs";
import "./subagent-control-WFcqo9OA.mjs";
import { d as resolveTrustedHttpOperatorScopes, r as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
//#region src/gateway/session-kill-http.ts
async function handleSessionKillHttpRequest(req, res, opts) {
	const cfg = opts.cfg ?? readRuntimeConfig();
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
	const capturedKey = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
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
	const kill = async (entry, canonicalKey, assertCurrent) => {
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
		}, { assertCurrent });
		assertCurrent();
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
	};
	if (isIncognitoSessionKey(capturedKey)) return await withSessionActorStorage({
		sessionKey: capturedKey,
		agentId: requestedAgent.agentId
	}, {
		lifetime: {
			assertCurrent: requestAuth.assertCurrent,
			assertReadable: requestAuth.assertCurrent
		},
		authority: {
			assertCurrent: requestAuth.assertCurrent,
			authorize: () => requestAuth.assertCurrent()
		}
	}, async (memory) => {
		const entry = memory.actor.snapshot(memory.authority)?.entry;
		return kill(entry, capturedKey, () => {
			requestAuth.assertCurrent();
			memory.actor.assertReadable();
		});
	}) ?? kill(void 0, capturedKey, requestAuth.assertCurrent);
	const { entry, canonicalKey } = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg,
		key: sessionKey,
		agentId: requestedAgent.agentId,
		assertActive: requestAuth.assertCurrent,
		excludeInternalEffects: true
	});
	return kill(entry, canonicalKey, requestAuth.assertCurrent);
}
//#endregion
export { handleSessionKillHttpRequest };

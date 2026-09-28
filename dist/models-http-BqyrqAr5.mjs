import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DnAyBVQj.mjs";
import { c as sendJson, f as sendUnauthorized, l as sendMethodNotAllowed, s as sendInvalidRequest, u as sendMissingScopeForbidden } from "./http-common-oJ4rIoMl.mjs";
import { n as OPENCLAW_MODEL_ID, s as isOpenClawAgentModelId, t as OPENCLAW_DEFAULT_MODEL_ID, u as resolveAgentIdFromModel } from "./http-utils-B5XpnbIs.mjs";
//#region src/gateway/models-http.ts
function toOpenAiModel(id) {
	return {
		id,
		object: "model",
		created: 0,
		owned_by: "openclaw",
		permission: []
	};
}
function loadAgentModelIds() {
	const cfg = getRuntimeConfig();
	const ids = /* @__PURE__ */ new Set([OPENCLAW_MODEL_ID, OPENCLAW_DEFAULT_MODEL_ID]);
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	if (compatibilityAgentId) ids.add(`openclaw/${compatibilityAgentId}`);
	for (const agentId of listAgentIds(cfg)) ids.add(`openclaw/${agentId}`);
	return Array.from(ids);
}
function resolveRequestPath(req) {
	return new URL(req.url ?? "/", "http://localhost").pathname;
}
/** Handle OpenAI-compatible model list/detail requests, returning false for unrelated paths. */
async function handleOpenAiModelsHttpRequest(req, res, opts) {
	const requestPath = resolveRequestPath(req);
	if (requestPath !== "/v1/models" && !requestPath.startsWith("/v1/models/")) return false;
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	if (!requestAuth.hasCurrentClientAuthority()) {
		sendUnauthorized(res);
		return true;
	}
	const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForMethod("models.list", requestedScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const ids = loadAgentModelIds();
	if (requestPath === "/v1/models") {
		sendJson(res, 200, {
			object: "list",
			data: ids.map(toOpenAiModel)
		});
		return true;
	}
	const encodedId = requestPath.slice(11);
	if (!encodedId) {
		sendInvalidRequest(res, "Missing model id.");
		return true;
	}
	let decodedId;
	try {
		decodedId = decodeURIComponent(encodedId);
	} catch {
		sendInvalidRequest(res, "Invalid model id encoding.");
		return true;
	}
	if (!isOpenClawAgentModelId(decodedId)) {
		sendInvalidRequest(res, "Invalid model id.");
		return true;
	}
	const normalizedModelId = decodedId.trim().toLowerCase();
	if (normalizedModelId !== "openclaw" && normalizedModelId !== "openclaw/default") {
		const cfg = getRuntimeConfig();
		const agentId = resolveAgentIdFromModel(decodedId, cfg);
		if (!agentId || !listAgentIds(cfg).includes(agentId)) {
			sendJson(res, 404, { error: {
				message: `Model '${decodedId}' not found.`,
				type: "invalid_request_error"
			} });
			return true;
		}
	}
	if (!ids.includes(decodedId)) {
		sendJson(res, 404, { error: {
			message: `Model '${decodedId}' not found.`,
			type: "invalid_request_error"
		} });
		return true;
	}
	sendJson(res, 200, toOpenAiModel(decodedId));
	return true;
}
//#endregion
export { handleOpenAiModelsHttpRequest };

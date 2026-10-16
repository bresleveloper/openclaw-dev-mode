import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as READ_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, l as sendInvalidRequest, m as sendUnauthorized, u as sendJson } from "./http-common-DJ7rKVvj.mjs";
import { r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-Bk1YwS0V.mjs";
import { n as OPENCLAW_MODEL_ID, s as isOpenClawAgentModelId, t as OPENCLAW_DEFAULT_MODEL_ID, u as resolveAgentIdFromModel } from "./http-utils-yY7ta13a.mjs";
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
/** Handle OpenAI-compatible model list/detail requests, returning false for unrelated paths. */
async function handleOpenAiModelsHttpRequest(req, res, opts) {
	const requestPath = new URL(req.url ?? "/", "http://localhost").pathname;
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
	if (!operatorScopeSatisfied("operator.read", requestedScopes)) {
		sendMissingScopeForbidden(res, READ_SCOPE);
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
	let configured = true;
	if (normalizedModelId !== "openclaw" && normalizedModelId !== "openclaw/default") {
		const cfg = getRuntimeConfig();
		const agentId = resolveAgentIdFromModel(decodedId, cfg);
		configured = Boolean(agentId && listAgentIds(cfg).includes(agentId));
	}
	if (!configured || !ids.includes(decodedId)) {
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

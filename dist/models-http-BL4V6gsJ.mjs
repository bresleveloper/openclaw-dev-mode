import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as READ_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, l as sendInvalidRequest, m as sendUnauthorized, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DvoR_YDD.mjs";
import { d as resolveAgentIdFromModel, i as canonicalizeOpenClawAgentModelId, n as OPENCLAW_MODEL_ID, t as OPENCLAW_DEFAULT_MODEL_ID } from "./http-utils-C7PagBsR.mjs";
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
	const cfg = readRuntimeConfig();
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
	const modelId = canonicalizeOpenClawAgentModelId(decodedId);
	if (!modelId) {
		sendInvalidRequest(res, "Invalid model id.");
		return true;
	}
	const normalizedModelId = decodedId.trim().toLowerCase();
	let configured = true;
	if (normalizedModelId !== "openclaw" && normalizedModelId !== "openclaw/default") {
		const cfg = readRuntimeConfig();
		const agentId = resolveAgentIdFromModel(decodedId, cfg);
		configured = Boolean(agentId && listAgentIds(cfg).includes(agentId));
	}
	if (!configured || !ids.includes(modelId)) {
		sendJson(res, 404, { error: {
			message: `Model '${decodedId}' not found.`,
			type: "invalid_request_error"
		} });
		return true;
	}
	sendJson(res, 200, toOpenAiModel(modelId));
	return true;
}
//#endregion
export { handleOpenAiModelsHttpRequest };

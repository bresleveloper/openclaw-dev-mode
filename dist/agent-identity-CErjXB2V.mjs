import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as classifySessionKeyShape } from "./session-key-CSDERtm3.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, t as validateAgentIdentityParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-B5Z875Ch.mjs";
import { i as resolveGatewayAssistantAvatar, s as resolveAssistantIdentity } from "./assistant-avatar-DB_cUu5U.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
//#region src/gateway/server-methods/agent-identity.ts
const agentIdentityGetHandler = async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateAgentIdentityParams, "agent.identity.get", respond)) return;
	const agentIdRaw = normalizeOptionalString(params.agentId) ?? "";
	const sessionKeyRaw = normalizeOptionalString(params.sessionKey) ?? "";
	const cfg = context.getRuntimeConfig();
	let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (sessionKeyRaw && classifySessionKeyShape(sessionKeyRaw) === "malformed_agent") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: malformed session key "${sessionKeyRaw}"`));
		return;
	}
	if (sessionKeyRaw || !agentId) {
		const resolved = resolveRequestedSessionAgentId(cfg, sessionKeyRaw || "main", agentId);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		agentId = resolved.agentId;
	}
	const authority = readGatewayRequestMutationAuthority(options);
	const identity = await resolveAssistantIdentity({
		cfg,
		agentId
	});
	const avatarProjection = await resolveGatewayAssistantAvatar({
		cfg,
		identity,
		httpBasePath: client?.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI ? cfg.gateway?.controlUi?.basePath ?? "" : void 0
	});
	authority.assertCurrent();
	const avatarResolution = avatarProjection.resolution;
	respond(true, {
		...identity,
		avatar: avatarProjection.avatar,
		avatarSource: avatarResolution ? resolvePublicAgentAvatarSource(avatarResolution) : void 0,
		avatarStatus: avatarResolution?.kind,
		avatarReason: avatarResolution?.kind === "none" ? avatarResolution.reason : void 0
	}, void 0);
};
const agentIdentityHandlers = { "agent.identity.get": agentIdentityGetHandler };
//#endregion
export { agentIdentityHandlers };

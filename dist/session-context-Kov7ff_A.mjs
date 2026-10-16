import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as parseSessionDeliveryRoute } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
//#region src/infra/outbound/session-context.ts
/** Builds the outbound delivery session context, omitting empty policy fields. */
function buildOutboundSessionContext(params) {
	const key = normalizeOptionalString(params.sessionKey);
	const policyKey = normalizeOptionalString(params.policySessionKey);
	const deliveryRoute = parseSessionDeliveryRoute(policyKey ?? key);
	const declaredChatType = normalizeChatType(params.conversationType ?? void 0);
	const groupChatType = params.isGroup === true ? "group" : params.isGroup === false ? "direct" : void 0;
	const conversationKind = declaredChatType ?? groupChatType;
	const normalizedChatType = declaredChatType ?? normalizeChatType(deliveryRoute?.peerKind) ?? groupChatType;
	const conversationType = normalizedChatType === "channel" ? "group" : normalizedChatType;
	const explicitAgentId = normalizeOptionalString(params.agentId);
	const agentId = key ? resolveSessionAgentId({
		sessionKey: key,
		config: params.cfg,
		agentId: explicitAgentId
	}) : explicitAgentId;
	const context = {
		...key ? { key } : {},
		...policyKey ? { policyKey } : {},
		...conversationType ? { conversationType } : {},
		...conversationKind ? { conversationKind } : {},
		...agentId ? { agentId } : {}
	};
	for (const field of [
		"requesterAccountId",
		"requesterSenderId",
		"requesterSenderName",
		"requesterSenderUsername",
		"requesterSenderE164"
	]) {
		const value = normalizeOptionalString(params[field]);
		if (value) context[field] = value;
	}
	return Object.keys(context).length > 0 ? context : void 0;
}
//#endregion
export { buildOutboundSessionContext as t };

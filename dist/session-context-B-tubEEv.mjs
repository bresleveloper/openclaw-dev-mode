import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { T as parseSessionDeliveryRoute } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
//#region src/infra/outbound/session-context.ts
/** Builds the outbound delivery session context, omitting empty policy fields. */
function buildOutboundSessionContext(params) {
	const key = normalizeOptionalString(params.sessionKey);
	const policyKey = normalizeOptionalString(params.policySessionKey);
	const deliveryRoute = parseSessionDeliveryRoute(policyKey ?? key);
	const declaredChatType = normalizeChatType(params.conversationType ?? void 0);
	const normalizedChatType = declaredChatType ?? normalizeChatType(deliveryRoute?.peerKind);
	const conversationKind = declaredChatType ?? (params.isGroup === true ? "group" : params.isGroup === false ? "direct" : void 0);
	const conversationType = normalizedChatType === "group" || normalizedChatType === "channel" ? "group" : normalizedChatType === "direct" ? "direct" : params.isGroup === true ? "group" : params.isGroup === false ? "direct" : void 0;
	const explicitAgentId = normalizeOptionalString(params.agentId);
	const requesterAccountId = normalizeOptionalString(params.requesterAccountId);
	const requesterSenderId = normalizeOptionalString(params.requesterSenderId);
	const requesterSenderName = normalizeOptionalString(params.requesterSenderName);
	const requesterSenderUsername = normalizeOptionalString(params.requesterSenderUsername);
	const requesterSenderE164 = normalizeOptionalString(params.requesterSenderE164);
	const agentId = key ? resolveSessionAgentId({
		sessionKey: key,
		config: params.cfg,
		agentId: explicitAgentId
	}) : explicitAgentId;
	if (!key && !policyKey && !conversationType && !conversationKind && !agentId && !requesterAccountId && !requesterSenderId && !requesterSenderName && !requesterSenderUsername && !requesterSenderE164) return;
	return {
		...key ? { key } : {},
		...policyKey ? { policyKey } : {},
		...conversationType ? { conversationType } : {},
		...conversationKind ? { conversationKind } : {},
		...agentId ? { agentId } : {},
		...requesterAccountId ? { requesterAccountId } : {},
		...requesterSenderId ? { requesterSenderId } : {},
		...requesterSenderName ? { requesterSenderName } : {},
		...requesterSenderUsername ? { requesterSenderUsername } : {},
		...requesterSenderE164 ? { requesterSenderE164 } : {}
	};
}
//#endregion
export { buildOutboundSessionContext as t };

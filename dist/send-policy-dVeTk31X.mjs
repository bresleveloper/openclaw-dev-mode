import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-DlD4zNx-.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { n as hasAmbiguousCanonicalSessionPeerShape, r as parseCanonicalSessionPeerShape, t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-BzwKnB1m.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
//#region src/sessions/session-chat-type.ts
function collectLegacyChatTypeCandidatePluginIds(scopedSessionKey) {
	const ids = /* @__PURE__ */ new Set();
	const firstToken = scopedSessionKey.split(":").find(Boolean);
	if (firstToken) ids.add(firstToken);
	if (scopedSessionKey.includes("@g.us")) ids.add("whatsapp");
	return Array.from(ids);
}
function deriveSessionChatType(sessionKey) {
	return deriveSessionChatTypeFromKey(sessionKey, [(scopedSessionKey) => {
		for (const pluginId of collectLegacyChatTypeCandidatePluginIds(scopedSessionKey)) {
			const deriveLegacySessionChatType = getBootstrapChannelPlugin(pluginId)?.messaging?.deriveLegacySessionChatType;
			const derived = deriveLegacySessionChatType?.(scopedSessionKey);
			if (derived) return derived;
		}
	}]);
}
//#endregion
//#region src/sessions/send-policy.ts
/** Normalizes raw send-policy text into a decision. */
function normalizeSendPolicy(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	return value === "allow" || value === "deny" ? value : void 0;
}
function stripAgentSessionKeyPrefix(key) {
	if (!key) return;
	const parts = key.split(":");
	if (parts[0] === "agent") {
		if (parts.length < 3 || !parts[1] || !parts[2]) return;
		return parts.slice(2).join(":");
	}
	return key;
}
function deriveChatTypeFromKey(normalizedKey) {
	if (!normalizedKey || normalizedKey.startsWith("agent:")) return;
	const derived = deriveSessionChatType(normalizedKey);
	return derived !== "unknown" ? derived : void 0;
}
/** Resolves whether a session send is allowed by entry override and config rules. */
function resolveSendPolicy(params) {
	const override = normalizeSendPolicy(params.entry?.sendPolicy);
	if (override) return override;
	const policy = params.cfg.session?.sendPolicy;
	if (!policy) return "allow";
	const rawSessionKey = params.sessionKey ?? "";
	const strippedSessionKey = stripAgentSessionKeyPrefix(rawSessionKey) ?? "";
	const rawSessionKeyNorm = normalizeLowercaseStringOrEmpty(rawSessionKey);
	const strippedSessionKeyNorm = normalizeLowercaseStringOrEmpty(strippedSessionKey);
	if (strippedSessionKeyNorm && hasAmbiguousCanonicalSessionPeerShape(strippedSessionKeyNorm)) return "deny";
	let channel;
	let chatType;
	const getChannel = () => {
		channel ??= normalizeOptionalLowercaseString(params.channel) ?? normalizeOptionalLowercaseString(sessionDeliveryChannel(params.entry)) ?? normalizeOptionalLowercaseString(parseCanonicalSessionPeerShape(strippedSessionKey)?.channel);
		return channel;
	};
	const getChatType = () => {
		chatType ??= normalizeChatType(params.chatType ?? params.entry?.chatType) ?? normalizeChatType(deriveChatTypeFromKey(strippedSessionKeyNorm));
		return chatType;
	};
	let allowedMatch = false;
	for (const rule of policy.rules ?? []) {
		if (!rule) continue;
		const action = normalizeSendPolicy(rule.action) ?? "allow";
		const match = rule.match ?? {};
		const matchChannel = normalizeOptionalLowercaseString(match.channel);
		const matchChatType = normalizeChatType(match.chatType);
		const matchPrefix = normalizeOptionalLowercaseString(match.keyPrefix);
		const matchRawPrefix = normalizeOptionalLowercaseString(match.rawKeyPrefix);
		if (matchChannel && matchChannel !== getChannel()) continue;
		if (matchChatType && matchChatType !== getChatType()) continue;
		if (matchRawPrefix && !rawSessionKeyNorm.startsWith(matchRawPrefix)) continue;
		if (matchPrefix && !rawSessionKeyNorm.startsWith(matchPrefix) && !strippedSessionKeyNorm.startsWith(matchPrefix)) continue;
		if (action === "deny") return "deny";
		allowedMatch = true;
	}
	if (allowedMatch) return "allow";
	return normalizeSendPolicy(policy.default) ?? "allow";
}
//#endregion
export { resolveSendPolicy as n, normalizeSendPolicy as t };

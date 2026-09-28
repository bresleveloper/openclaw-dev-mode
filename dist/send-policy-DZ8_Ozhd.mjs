import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-Rvdo_TFm.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as hasAmbiguousCanonicalSessionPeerShape, r as parseCanonicalSessionPeerShape, t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
//#region src/sessions/session-chat-type.ts
function resolveScopedSessionKey(sessionKey) {
	const raw = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!raw) return "";
	return parseAgentSessionKey(raw)?.rest ?? raw;
}
function collectLegacyChatTypeCandidatePluginIds(scopedSessionKey) {
	const ids = /* @__PURE__ */ new Set();
	const firstToken = scopedSessionKey.split(":").find(Boolean);
	if (firstToken) ids.add(firstToken);
	if (scopedSessionKey.includes("@g.us")) ids.add("whatsapp");
	return Array.from(ids);
}
function deriveSessionChatType(sessionKey) {
	const builtInType = deriveSessionChatTypeFromKey(sessionKey);
	if (builtInType !== "unknown") return builtInType;
	const scopedSessionKey = resolveScopedSessionKey(sessionKey);
	for (const pluginId of collectLegacyChatTypeCandidatePluginIds(scopedSessionKey)) {
		const deriveLegacySessionChatType = getBootstrapChannelPlugin(pluginId)?.messaging?.deriveLegacySessionChatType;
		const derived = deriveLegacySessionChatType?.(scopedSessionKey);
		if (derived) return derived;
	}
	return "unknown";
}
//#endregion
//#region src/sessions/send-policy.ts
/** Normalizes raw send-policy text into a decision. */
function normalizeSendPolicy(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (value === "allow") return "allow";
	if (value === "deny") return "deny";
}
function normalizeMatchValue(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	return value ? value : void 0;
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
function deriveChannelFromKey(key) {
	const normalizedKey = stripAgentSessionKeyPrefix(key);
	if (!normalizedKey) return;
	return normalizeMatchValue(parseCanonicalSessionPeerShape(normalizedKey)?.channel);
}
function deriveChatTypeFromKey(key) {
	const normalizedKey = normalizeOptionalLowercaseString(stripAgentSessionKeyPrefix(key));
	if (!normalizedKey || normalizedKey.startsWith("agent:")) return;
	const derived = deriveSessionChatType(normalizedKey);
	if (derived !== "unknown") return derived;
}
function hasAmbiguousPeerShape(key) {
	const normalizedKey = normalizeOptionalLowercaseString(stripAgentSessionKeyPrefix(key));
	return normalizedKey ? hasAmbiguousCanonicalSessionPeerShape(normalizedKey) : false;
}
/** Resolves whether a session send is allowed by entry override and config rules. */
function resolveSendPolicy(params) {
	const override = normalizeSendPolicy(params.entry?.sendPolicy);
	if (override) return override;
	const policy = params.cfg.session?.sendPolicy;
	if (!policy) return "allow";
	if (hasAmbiguousPeerShape(params.sessionKey)) return "deny";
	const rawSessionKey = params.sessionKey ?? "";
	const strippedSessionKey = stripAgentSessionKeyPrefix(rawSessionKey) ?? "";
	const rawSessionKeyNorm = normalizeLowercaseStringOrEmpty(rawSessionKey);
	const strippedSessionKeyNorm = normalizeLowercaseStringOrEmpty(strippedSessionKey);
	let channel;
	let chatType;
	const getChannel = () => {
		channel ??= normalizeMatchValue(params.channel) ?? normalizeMatchValue(sessionDeliveryChannel(params.entry)) ?? deriveChannelFromKey(params.sessionKey);
		return channel;
	};
	const getChatType = () => {
		chatType ??= normalizeChatType(params.chatType ?? params.entry?.chatType) ?? normalizeChatType(deriveChatTypeFromKey(params.sessionKey));
		return chatType;
	};
	let allowedMatch = false;
	for (const rule of policy.rules ?? []) {
		if (!rule) continue;
		const action = normalizeSendPolicy(rule.action) ?? "allow";
		const match = rule.match ?? {};
		const matchChannel = normalizeMatchValue(match.channel);
		const matchChatType = normalizeChatType(match.chatType);
		const matchPrefix = normalizeMatchValue(match.keyPrefix);
		const matchRawPrefix = normalizeMatchValue(match.rawKeyPrefix);
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

import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as normalizeMainKey, n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, i as buildAgentPeerSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
//#region src/auto-reply/reply/runtime-policy-session-key.ts
function resolvePolicyChannel(ctx) {
	const channel = normalizeLowercaseStringOrEmpty(ctx?.OriginatingChannel ?? ctx?.Provider ?? ctx?.Surface);
	return channel && channel !== "webchat" ? channel : void 0;
}
function resolvePolicyDirectPeerId(ctx) {
	return normalizeOptionalString(ctx?.NativeDirectUserId ?? ctx?.SenderId ?? ctx?.SenderE164 ?? ctx?.SenderUsername ?? ctx?.OriginatingTo ?? ctx?.From ?? ctx?.To);
}
function isMainSessionAlias(params) {
	const raw = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (!raw) return false;
	const agentId = normalizeAgentId(params.agentId);
	const mainKey = normalizeMainKey(params.cfg?.session?.mainKey);
	const agentMainSessionKey = buildAgentMainSessionKey({
		agentId,
		mainKey
	});
	const agentMainAliasKey = buildAgentMainSessionKey({
		agentId,
		mainKey: "main"
	});
	return raw === "main" || raw === mainKey || raw === agentMainSessionKey || raw === agentMainAliasKey || raw === buildAgentMainSessionKey({
		agentId: "main",
		mainKey
	}) || raw === buildAgentMainSessionKey({
		agentId: "main",
		mainKey: "main"
	}) || params.cfg?.session?.scope === "global" && raw === "global";
}
function resolveRuntimePolicySessionKey(params) {
	const explicitPolicySessionKey = normalizeOptionalString(params.ctx?.RuntimePolicySessionKey);
	if (explicitPolicySessionKey) return explicitPolicySessionKey;
	const sessionKey = normalizeOptionalString(params.sessionKey ?? params.ctx?.CommandTargetSessionKey ?? params.ctx?.SessionKey);
	if (!sessionKey) return;
	const agentId = params.cfg ? resolveSessionAgentId({
		config: params.cfg,
		sessionKey,
		agentId: params.agentId ?? normalizeOptionalString(params.ctx?.AgentId)
	}) : parseAgentSessionKey(sessionKey)?.agentId ?? normalizeOptionalString(params.agentId) ?? normalizeOptionalString(params.ctx?.AgentId);
	if (!agentId || !isMainSessionAlias({
		cfg: params.cfg,
		agentId,
		sessionKey
	}) || normalizeChatType(params.ctx?.ChatType) !== "direct") return sessionKey;
	const channel = resolvePolicyChannel(params.ctx);
	const peerId = resolvePolicyDirectPeerId(params.ctx);
	if (!channel || !peerId) return sessionKey;
	return buildAgentPeerSessionKey({
		agentId,
		channel,
		accountId: params.ctx?.AccountId,
		peerKind: "direct",
		peerId,
		dmScope: "per-account-channel-peer",
		identityLinks: params.cfg?.session?.identityLinks
	});
}
//#endregion
export { resolveRuntimePolicySessionKey as t };

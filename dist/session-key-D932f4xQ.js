import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeE164 } from "./utils-CRO4LGEB.js";
import { o as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-utils-A-JGvyXu.js";
import { d as normalizeMainKey, i as buildAgentMainSessionKey, t as DEFAULT_AGENT_ID, u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { V as resolveGroupSessionKey } from "./store-Cvp82S16.js";
import { i as listChannelPlugins, n as getLoadedChannelPlugin } from "./registry-CWdFCyWd.js";
import "./plugins-Cgf2sDSU.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-s5PUEeqJ.js";
import "./message-channel-CB9y2CYk.js";
//#region src/config/sessions/explicit-session-key-normalization.ts
function resolveExplicitSessionKeyNormalizerCandidates(sessionKey, ctx) {
	const normalizedProvider = normalizeOptionalLowercaseString(ctx.Provider);
	const normalizedSurface = normalizeOptionalLowercaseString(ctx.Surface);
	const normalizedFrom = normalizeLowercaseStringOrEmpty(ctx.From);
	const candidates = /* @__PURE__ */ new Set();
	const maybeAdd = (value) => {
		const normalized = normalizeMessageChannel(value);
		if (normalized) candidates.add(normalized);
	};
	maybeAdd(normalizedSurface);
	maybeAdd(normalizedProvider);
	maybeAdd(normalizedFrom.split(":", 1)[0]);
	for (const plugin of listChannelPlugins()) {
		const pluginId = normalizeMessageChannel(plugin.id);
		if (!pluginId) continue;
		if (sessionKey.startsWith(`${pluginId}:`) || sessionKey.includes(`:${pluginId}:`)) candidates.add(pluginId);
	}
	return [...candidates];
}
/** Normalizes caller-supplied session keys through the matching channel plugin when available. */
function normalizeExplicitSessionKey(sessionKey, ctx) {
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
	for (const channelId of resolveExplicitSessionKeyNormalizerCandidates(normalized, ctx)) {
		const normalize = getLoadedChannelPlugin(channelId)?.messaging?.normalizeExplicitSessionKey;
		const next = normalize?.({
			sessionKey: normalized,
			ctx
		});
		if (typeof next === "string" && next.trim()) return normalizeSessionKeyPreservingOpaquePeerIds(next);
	}
	return normalized;
}
//#endregion
//#region src/config/sessions/session-key.ts
/**
* Derives the raw session bucket from message context before agent/main-key normalization.
*
* Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
* sender routing entirely.
*/
function deriveSessionKey(scope, ctx) {
	if (scope === "global") return "global";
	const resolvedGroup = resolveGroupSessionKey(ctx);
	if (resolvedGroup) return resolvedGroup.key;
	return (ctx.From ? normalizeE164(ctx.From) : "") || "unknown";
}
/**
* Resolves the persisted session-store key for an inbound message.
*
* Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
* agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
*/
function resolveSessionKey(scope, ctx, mainKey, agentId = DEFAULT_AGENT_ID) {
	const explicit = ctx.SessionKey?.trim();
	if (explicit) return normalizeExplicitSessionKey(explicit, ctx);
	const raw = deriveSessionKey(scope, ctx);
	if (scope === "global") return raw;
	const canonicalAgentId = normalizeAgentId(agentId);
	const canonical = buildAgentMainSessionKey({
		agentId: canonicalAgentId,
		mainKey: normalizeMainKey(mainKey)
	});
	if (!(raw.includes(":group:") || raw.includes(":channel:"))) return canonical;
	return `agent:${canonicalAgentId}:${raw}`;
}
//#endregion
export { resolveSessionKey as n, normalizeExplicitSessionKey as r, deriveSessionKey as t };

import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { E as parseRawSessionConversationRef, O as parseThreadSessionSuffix } from "./session-key-C09ow4h0.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { a as tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-B-yS8AQL.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
//#region src/channels/plugins/session-conversation.ts
const SESSION_KEY_API_ARTIFACT_BASENAME = "session-key-api.js";
function normalizeResolvedChannel(channel) {
	return normalizeAnyChannelId(channel) ?? normalizeChatChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? "";
}
function getLoadedSessionChannelPlugin(channel) {
	const normalizedChannel = normalizeResolvedChannel(channel);
	try {
		return getLoadedChannelPlugin(normalizedChannel);
	} catch {
		return;
	}
}
function buildGenericConversationResolution(rawId) {
	const trimmed = rawId.trim();
	if (!trimmed) return null;
	const parsed = parseThreadSessionSuffix(trimmed);
	const id = (parsed.baseSessionKey ?? trimmed).trim();
	if (!id) return null;
	return {
		id,
		threadId: parsed.threadId,
		baseConversationId: id,
		parentConversationCandidates: normalizeUniqueSingleOrTrimmedStringList(parsed.threadId ? [parsed.baseSessionKey] : [])
	};
}
function normalizeSessionConversationResolution(resolved) {
	if (!resolved?.id?.trim()) return null;
	const parentConversationCandidates = normalizeUniqueSingleOrTrimmedStringList(resolved.parentConversationCandidates ?? []);
	return {
		id: resolved.id.trim(),
		threadId: normalizeOptionalString(resolved.threadId),
		baseConversationId: normalizeOptionalString(resolved.baseConversationId) ?? parentConversationCandidates.at(-1) ?? resolved.id.trim(),
		parentConversationCandidates,
		hasExplicitParentConversationCandidates: Object.hasOwn(resolved, "parentConversationCandidates")
	};
}
function resolveBundledSessionConversationFallback(params) {
	if (isBundledSessionConversationFallbackDisabled(params.channel)) return null;
	const dirName = normalizeResolvedChannel(params.channel);
	let loaded;
	try {
		loaded = tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
			dirName,
			artifactBasename: SESSION_KEY_API_ARTIFACT_BASENAME
		});
	} catch {
		return null;
	}
	const resolveSessionConversationLocal = loaded?.resolveSessionConversation;
	if (typeof resolveSessionConversationLocal !== "function") return null;
	return normalizeSessionConversationResolution(resolveSessionConversationLocal({
		kind: params.kind,
		rawId: params.rawId
	}));
}
function isBundledSessionConversationFallbackDisabled(channel) {
	const snapshot = getRuntimeConfigSnapshot();
	if (!snapshot?.plugins) return false;
	if (snapshot.plugins.enabled === false) return true;
	const entry = snapshot.plugins.entries?.[normalizeResolvedChannel(channel)];
	return Boolean(entry) && typeof entry === "object" && entry.enabled === false;
}
function resolveSessionConversation(params) {
	const rawId = params.rawId.trim();
	if (!rawId) return null;
	const channelPlugin = getLoadedSessionChannelPlugin(params.channel);
	const messaging = channelPlugin?.messaging;
	const pluginResolved = normalizeSessionConversationResolution(messaging?.resolveSessionConversation?.({
		kind: params.kind,
		rawId
	}));
	const shouldTryBundledFallback = params.bundledFallback !== false && !channelPlugin && rawId.includes(":");
	const resolved = pluginResolved ?? (shouldTryBundledFallback ? resolveBundledSessionConversationFallback({
		channel: params.channel,
		kind: params.kind,
		rawId
	}) : null) ?? buildGenericConversationResolution(rawId);
	if (!resolved) return null;
	if (!pluginResolved?.hasExplicitParentConversationCandidates) {
		const legacyParents = messaging?.resolveParentConversationCandidates?.({
			kind: params.kind,
			rawId
		});
		if (legacyParents != null) resolved.parentConversationCandidates = normalizeUniqueSingleOrTrimmedStringList(legacyParents);
	}
	resolved.baseConversationId = resolved.parentConversationCandidates.at(-1) ?? resolved.baseConversationId ?? resolved.id;
	return resolved;
}
function resolveSessionConversationRef(sessionKey, opts = {}) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return null;
	const resolved = resolveSessionConversation({
		...raw,
		bundledFallback: opts.bundledFallback
	});
	if (!resolved) return null;
	return {
		channel: normalizeResolvedChannel(raw.channel),
		kind: raw.kind,
		rawId: raw.rawId,
		id: resolved.id,
		threadId: resolved.threadId,
		baseSessionKey: `${raw.prefix}:${resolved.id}`,
		baseConversationId: resolved.baseConversationId,
		parentConversationCandidates: resolved.parentConversationCandidates
	};
}
function resolveSessionThreadInfo(sessionKey, opts = {}) {
	const resolved = resolveSessionConversationRef(sessionKey, opts);
	if (!resolved) return parseThreadSessionSuffix(sessionKey);
	return {
		baseSessionKey: resolved.threadId ? resolved.baseSessionKey : normalizeOptionalString(sessionKey),
		threadId: resolved.threadId
	};
}
function resolveSessionParentSessionKey(sessionKey) {
	const { baseSessionKey, threadId } = resolveSessionThreadInfo(sessionKey);
	if (!threadId) return null;
	return baseSessionKey ?? null;
}
//#endregion
export { resolveSessionThreadInfo as i, resolveSessionConversationRef as n, resolveSessionParentSessionKey as r, resolveSessionConversation as t };

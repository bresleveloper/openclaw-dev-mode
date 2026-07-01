import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { f as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { l as parseRawSessionConversationRef, u as parseThreadSessionSuffix } from "./session-key-utils-C7uT9A4s.js";
import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import { o as normalizeChannelId } from "./registry-B5Y8tTE-.js";
import { a as tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-Dj-RntJ4.js";
import { a as normalizeChannelId$1, n as getLoadedChannelPlugin } from "./registry-Ba1KQQW12.js";
//#region src/channels/plugins/session-conversation.ts
/**
* Session conversation key helpers.
*
* Resolves threaded channel session keys through plugin hooks and generic parsing.
*/
const SESSION_KEY_API_ARTIFACT_BASENAME = "session-key-api.js";
function normalizeResolvedChannel(channel) {
	return normalizeChannelId$1(channel) ?? normalizeChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? "";
}
function getMessagingAdapter(channel) {
	const normalizedChannel = normalizeResolvedChannel(channel);
	try {
		return getLoadedChannelPlugin(normalizedChannel)?.messaging;
	} catch {
		return;
	}
}
function dedupeConversationIds(values) {
	return normalizeUniqueSingleOrTrimmedStringList(values);
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
		parentConversationCandidates: dedupeConversationIds(parsed.threadId ? [parsed.baseSessionKey] : [])
	};
}
function normalizeSessionConversationResolution(resolved) {
	if (!resolved?.id?.trim()) return null;
	return {
		id: resolved.id.trim(),
		threadId: normalizeOptionalString(resolved.threadId),
		baseConversationId: normalizeOptionalString(resolved.baseConversationId) ?? dedupeConversationIds(resolved.parentConversationCandidates ?? []).at(-1) ?? resolved.id.trim(),
		parentConversationCandidates: dedupeConversationIds(resolved.parentConversationCandidates ?? []),
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
function shouldProbeBundledSessionConversationFallback(rawId) {
	return rawId.includes(":");
}
function resolveSessionConversationResolution(params) {
	const rawId = params.rawId.trim();
	if (!rawId) return null;
	const messaging = getMessagingAdapter(params.channel);
	const pluginResolved = normalizeSessionConversationResolution(messaging?.resolveSessionConversation?.({
		kind: params.kind,
		rawId
	}));
	const shouldTryBundledFallback = params.bundledFallback !== false && !messaging && shouldProbeBundledSessionConversationFallback(rawId);
	const resolved = pluginResolved ?? (shouldTryBundledFallback ? resolveBundledSessionConversationFallback({
		channel: params.channel,
		kind: params.kind,
		rawId
	}) : null) ?? buildGenericConversationResolution(rawId);
	if (!resolved) return null;
	const parentConversationCandidates = dedupeConversationIds(pluginResolved?.hasExplicitParentConversationCandidates ? resolved.parentConversationCandidates : messaging?.resolveParentConversationCandidates?.({
		kind: params.kind,
		rawId
	}) ?? resolved.parentConversationCandidates);
	const baseConversationId = parentConversationCandidates.at(-1) ?? resolved.baseConversationId ?? resolved.id;
	return {
		...resolved,
		baseConversationId,
		parentConversationCandidates
	};
}
/**
* Resolves one raw channel conversation id into base/thread conversation metadata.
*/
function resolveSessionConversation(params) {
	return resolveSessionConversationResolution(params);
}
function buildBaseSessionKey(raw, id) {
	return `${raw.prefix}:${id}`;
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
		baseSessionKey: buildBaseSessionKey(raw, resolved.id),
		baseConversationId: resolved.baseConversationId,
		parentConversationCandidates: resolved.parentConversationCandidates
	};
}
/**
* Resolves thread suffix metadata from a session key, using channel hooks when available.
*/
function resolveSessionThreadInfo(sessionKey, opts = {}) {
	const resolved = resolveSessionConversationRef(sessionKey, opts);
	if (!resolved) return parseThreadSessionSuffix(sessionKey);
	return {
		baseSessionKey: resolved.threadId ? resolved.baseSessionKey : normalizeOptionalString(sessionKey),
		threadId: resolved.threadId
	};
}
/**
* Resolves the parent session key for a threaded child session.
*/
function resolveSessionParentSessionKey(sessionKey) {
	const { baseSessionKey, threadId } = resolveSessionThreadInfo(sessionKey);
	if (!threadId) return null;
	return baseSessionKey ?? null;
}
//#endregion
export { resolveSessionThreadInfo as i, resolveSessionConversationRef as n, resolveSessionParentSessionKey as r, resolveSessionConversation as t };

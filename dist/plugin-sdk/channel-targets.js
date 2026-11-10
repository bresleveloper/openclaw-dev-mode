import { o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { t as normalizeAnyChannelId } from "../registry-normalize-DKVgg-js.mjs";
import { a as resolveChannelEntryMatchWithFallback, i as resolveChannelEntryMatch, n as buildChannelKeyCandidates, o as resolveChannelMatchConfig, r as normalizeChannelSlug, s as resolveNestedAllowlistDecision, t as applyChannelMatchMeta } from "../channel-config-B_ubM5Go.mjs";
import { a as resolveServicePrefixedAllowTarget, c as resolveServicePrefixedTarget, i as parseChatTargetPrefixesOrThrow, o as resolveServicePrefixedChatTarget, r as parseChatAllowTargetPrefixes, s as resolveServicePrefixedOrChatAllowTarget, t as createAllowedChatSenderMatcher } from "../chat-target-prefixes-CkuKSHyK.mjs";
import { n as resolveTargetsWithOptionalToken, t as buildUnresolvedTargetResults } from "../target-resolvers-jIUvVrPN.mjs";
//#region src/channels/targets.ts
/**
* Shared messaging-target parsing primitives for channel plugins and SDK consumers.
* Channel-specific grammars stay in plugins; this file owns common target shapes and parse order.
*/
function buildMessagingTarget(kind, id, raw) {
	return {
		kind,
		id,
		raw,
		normalized: normalizeLowercaseStringOrEmpty(`${kind}:${id}`)
	};
}
function ensureTargetId(params) {
	if (!params.pattern.test(params.candidate)) throw new Error(params.errorMessage);
	return params.candidate;
}
/** Tries mention, explicit prefixes, then @user shorthand in deterministic order. */
function parseMentionPrefixOrAtUserTarget(params) {
	const match = params.raw.match(params.mentionPattern);
	if (match?.[1]) return buildMessagingTarget("user", match[1], params.raw);
	for (const { prefix, kind } of params.prefixes) if (params.raw.startsWith(prefix)) {
		const id = params.raw.slice(prefix.length).trim();
		if (id) return buildMessagingTarget(kind, id, params.raw);
	}
	if (!params.raw.startsWith("@")) return;
	return buildMessagingTarget("user", ensureTargetId({
		candidate: params.raw.slice(1).trim(),
		pattern: params.atUserPattern,
		errorMessage: params.atUserErrorMessage
	}), params.raw);
}
function requireTargetKind(params) {
	const kindLabel = params.kind;
	if (!params.target) throw new Error(`${params.platform} ${kindLabel} id is required.`);
	if (params.target.kind !== params.kind) throw new Error(`${params.platform} ${kindLabel} id is required (use ${kindLabel}:<id>).`);
	return params.target.id;
}
//#endregion
export { applyChannelMatchMeta, buildChannelKeyCandidates, buildMessagingTarget, buildUnresolvedTargetResults, createAllowedChatSenderMatcher, ensureTargetId, normalizeAnyChannelId as normalizeChannelId, normalizeChannelSlug, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, parseMentionPrefixOrAtUserTarget, requireTargetKind, resolveChannelEntryMatch, resolveChannelEntryMatchWithFallback, resolveChannelMatchConfig, resolveNestedAllowlistDecision, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget, resolveServicePrefixedTarget, resolveTargetsWithOptionalToken };

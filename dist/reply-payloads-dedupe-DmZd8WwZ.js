import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as normalizeOptionalAccountId } from "./account-id-5IgE9UKY.js";
import { a as normalizeAnyChannelId } from "./registry-B5Y8tTE-.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-HLWc9ssO.js";
import { h as stringifyRouteThreadId, o as channelRouteTargetsMatchExact } from "./channel-route-BhPKCG_0.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import { t as getLoadedChannelPluginForRead } from "./registry-loaded-read-kWBL-Dpo.js";
import "./plugins-DnKj2WmH.js";
import { a as isMessagingToolDuplicate } from "./embedded-agent-helpers-D_zioqUQ.js";
//#region src/auto-reply/reply/reply-payloads-dedupe.ts
/** De-duplicates assistant reply payloads against message-tool sends on the same route. */
/** Removes text payloads already sent by message tools. */
function filterMessagingToolDuplicates(params) {
	const { payloads, sentTexts } = params;
	if (sentTexts.length === 0) return payloads;
	return payloads.filter((payload) => {
		if (payload.mediaUrl || payload.mediaUrls?.length) return true;
		return !isMessagingToolDuplicate(payload.text ?? "", sentTexts);
	});
}
/** Removes media payload URLs already sent by message tools. */
function filterMessagingToolMediaDuplicates(params) {
	const { payloads, sentMediaUrls } = params;
	if (sentMediaUrls.length === 0) return payloads;
	const sentSet = /* @__PURE__ */ new Set();
	for (const sentMediaUrl of sentMediaUrls) {
		const normalized = normalizeMediaForDedupe(sentMediaUrl);
		if (normalized) sentSet.add(normalized);
	}
	if (sentSet.size === 0) return payloads;
	let nextPayloads;
	for (let index = 0; index < payloads.length; index++) {
		const payload = payloads[index];
		const mediaUrl = payload.mediaUrl;
		const mediaUrls = payload.mediaUrls;
		const stripSingle = mediaUrl && sentSet.has(normalizeMediaForDedupe(mediaUrl));
		let filteredUrls;
		let strippedMediaUrls = false;
		if (mediaUrls?.length) for (let mediaIndex = 0; mediaIndex < mediaUrls.length; mediaIndex++) {
			const url = mediaUrls[mediaIndex];
			if (sentSet.has(normalizeMediaForDedupe(url))) {
				strippedMediaUrls = true;
				if (!filteredUrls) filteredUrls = mediaUrls.slice(0, mediaIndex);
				continue;
			}
			if (filteredUrls) filteredUrls.push(url);
		}
		if (!stripSingle && !strippedMediaUrls) {
			if (nextPayloads) nextPayloads.push(payload);
			continue;
		}
		const nextPayload = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrl: stripSingle ? void 0 : mediaUrl,
			mediaUrls: filteredUrls?.length ? filteredUrls : void 0
		});
		if (!nextPayloads) nextPayloads = payloads.slice(0, index);
		nextPayloads.push(nextPayload);
	}
	return nextPayloads ?? payloads;
}
function normalizeMediaForDedupe(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("file://")) return trimmed;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "file:") return decodeURIComponent(parsed.pathname || "");
	} catch {}
	return trimmed.replace(/^file:\/\//i, "");
}
function normalizeProviderForComparison(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	const normalizedChannel = normalizeAnyChannelId(trimmed);
	if (normalizedChannel) return normalizedChannel;
	return lowered;
}
function normalizeThreadIdForComparison(value) {
	return stringifyRouteThreadId(value);
}
function normalizeTargetForDedupe(provider, rawTarget) {
	const fallback = normalizeOptionalString(rawTarget);
	if (!fallback) return;
	const providerId = normalizeProviderForComparison(provider);
	return normalizeOptionalString((providerId ? getLoadedChannelPluginForRead(providerId)?.messaging?.normalizeTarget : void 0)?.(rawTarget ?? "") ?? fallback);
}
function resolveTargetProviderForComparison(params) {
	const targetProvider = normalizeProviderForComparison(params.targetProvider);
	if (!targetProvider || targetProvider === "message") return params.currentProvider;
	return targetProvider;
}
function normalizeRouteTargetForDedupe(params) {
	const to = normalizeTargetForDedupe(params.provider, params.rawTarget);
	if (!to) return null;
	return {
		channel: params.provider,
		to,
		...params.accountId ? { accountId: params.accountId } : {},
		...params.threadId != null ? { threadId: params.threadId } : {}
	};
}
function targetsMatchForDedupe(params) {
	const pluginMatch = getChannelPlugin(params.provider)?.outbound?.targetsMatchForReplySuppression;
	if (pluginMatch) return pluginMatch({
		originTarget: params.originTarget,
		targetKey: params.targetKey,
		targetThreadId: normalizeThreadIdForComparison(params.targetThreadId)
	});
	return params.targetKey === params.originTarget;
}
function resolveOriginThreadIdForPayload(params) {
	const originThreadId = normalizeThreadIdForComparison(params.originatingThreadId);
	if (originThreadId && !params.replyToIsExplicit) return originThreadId;
	const replyToId = normalizeThreadIdForComparison(params.replyToId);
	const resolveReplyTransport = getChannelPlugin(params.provider)?.threading?.resolveReplyTransport;
	if (!replyToId || !params.config || !resolveReplyTransport) return originThreadId;
	const transport = resolveReplyTransport({
		cfg: params.config,
		accountId: params.accountId,
		threadId: originThreadId,
		replyToId,
		replyToIsExplicit: params.replyToIsExplicit,
		replyDelivery: params.replyDelivery
	});
	if (transport?.threadId != null) return normalizeThreadIdForComparison(transport.threadId) ?? originThreadId;
	if (transport?.threadId === null) return normalizeThreadIdForComparison(transport.replyToId);
	return originThreadId;
}
/** Returns true when message-tool route evidence says source replies should be deduped. */
function shouldDedupeMessagingToolRepliesForRoute(params) {
	return getMatchingMessagingToolReplyTargets(params).length > 0;
}
/** Finds message-tool sends that target the same channel/account/thread as the source reply. */
function getMatchingMessagingToolReplyTargets(params) {
	const provider = normalizeProviderForComparison(params.messageProvider);
	if (!provider) return [];
	const originRawTarget = normalizeOptionalString(params.originatingTo);
	const originAccount = normalizeOptionalAccountId(params.accountId);
	const sentTargets = params.messagingToolSentTargets ?? [];
	if (sentTargets.length === 0) return [];
	const originThreadId = resolveOriginThreadIdForPayload({
		provider,
		config: params.config,
		accountId: originAccount,
		originatingThreadId: params.originatingThreadId,
		replyToId: params.replyToId,
		replyToIsExplicit: params.replyToIsExplicit,
		replyDelivery: params.replyDelivery
	});
	return sentTargets.filter((target) => {
		const targetProvider = resolveTargetProviderForComparison({
			currentProvider: provider,
			targetProvider: target?.provider
		});
		if (targetProvider !== provider) return false;
		const targetAccount = normalizeOptionalAccountId(target.accountId);
		if (originAccount && targetAccount && originAccount !== targetAccount) return false;
		const targetRaw = normalizeOptionalString(target.to);
		const routeAccount = originAccount ?? targetAccount;
		const originRoute = normalizeRouteTargetForDedupe({
			provider,
			rawTarget: originRawTarget,
			accountId: routeAccount,
			threadId: originThreadId
		});
		if (!originRoute) return false;
		const targetRoute = normalizeRouteTargetForDedupe({
			provider: targetProvider,
			rawTarget: targetRaw,
			accountId: routeAccount,
			threadId: target.threadId ?? (target.threadImplicit ? originThreadId : void 0)
		});
		if (!targetRoute) return false;
		if (channelRouteTargetsMatchExact({
			left: originRoute,
			right: targetRoute
		})) return true;
		if (!Boolean(getChannelPlugin(provider)?.outbound?.targetsMatchForReplySuppression) && (originRoute.threadId != null || targetRoute.threadId != null)) return false;
		return targetsMatchForDedupe({
			provider,
			originTarget: originRoute.to,
			targetKey: targetRoute.to,
			targetThreadId: target.threadId
		});
	});
}
/** Resolves whether and how to dedupe final payloads against message-tool sends. */
function resolveMessagingToolPayloadDedupe(params) {
	const sentTargets = params.messagingToolSentTargets ?? [];
	const matchingTargets = getMatchingMessagingToolReplyTargets({
		config: params.config,
		messageProvider: params.messageProvider,
		messagingToolSentTargets: sentTargets,
		originatingTo: params.originatingTo,
		originatingThreadId: params.originatingThreadId,
		replyToId: params.replyToId,
		replyToIsExplicit: params.replyToIsExplicit,
		replyDelivery: params.replyDelivery,
		accountId: params.accountId
	});
	const matchingRoute = matchingTargets.length > 0;
	const routeSentTexts = matchingTargets.flatMap((target) => typeof target.text === "string" && target.text.trim() ? [target.text] : []);
	const routeSentMediaUrls = matchingTargets.flatMap((target) => Array.isArray(target.mediaUrls) ? target.mediaUrls.filter((url) => typeof url === "string" && Boolean(url.trim())) : []);
	const hasTargetTextEvidence = sentTargets.some((target) => typeof target.text === "string" && Boolean(target.text.trim()));
	const hasTargetMediaUrlEvidence = sentTargets.some((target) => Array.isArray(target.mediaUrls) && target.mediaUrls.some((url) => typeof url === "string" && Boolean(url.trim())));
	return {
		shouldDedupePayloads: matchingRoute || sentTargets.length === 0,
		matchingRoute,
		routeSentTexts,
		routeSentMediaUrls,
		useGlobalSentTextEvidenceFallback: matchingRoute && !hasTargetTextEvidence,
		useGlobalSentMediaUrlEvidenceFallback: matchingRoute && !hasTargetMediaUrlEvidence
	};
}
//#endregion
export { shouldDedupeMessagingToolRepliesForRoute as i, filterMessagingToolMediaDuplicates as n, resolveMessagingToolPayloadDedupe as r, filterMessagingToolDuplicates as t };

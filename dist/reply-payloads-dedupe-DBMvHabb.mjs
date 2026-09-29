import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { f as stringifyRouteThreadId, i as channelRouteTargetsMatchExact } from "./channel-route-Czo5mOSj.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-gZujyBo1.mjs";
import "./embedded-agent-helpers-DGdaNc6w.mjs";
import { t as isMessagingToolDuplicate } from "./messaging-dedupe-DzadpKaR.mjs";
//#region src/auto-reply/reply/reply-payloads-dedupe.ts
/** De-duplicates assistant reply payloads against message-tool sends on the same route. */
/** Removes media payload URLs already sent by message tools. */
function filterMessagingToolMediaDuplicates(params) {
	const { payloads, sentMediaUrls } = params;
	if (sentMediaUrls.length === 0) return payloads;
	const sentSet = /* @__PURE__ */ new Set();
	for (const sentMediaUrl of sentMediaUrls) {
		const normalized = normalizeMediaReferenceForComparison(sentMediaUrl);
		if (normalized) sentSet.add(normalized);
	}
	if (sentSet.size === 0) return payloads;
	let nextPayloads;
	for (const [index, payload] of payloads.entries()) {
		if (hasEnabledDeliveryOperation(payload)) {
			if (nextPayloads) nextPayloads.push(payload);
			continue;
		}
		const mediaUrl = payload.mediaUrl;
		const mediaUrls = payload.mediaUrls;
		const stripSingle = mediaUrl && sentSet.has(normalizeMediaReferenceForComparison(mediaUrl));
		let filteredUrls;
		let strippedMediaUrls = false;
		if (mediaUrls?.length) for (const [mediaIndex, url] of mediaUrls.entries()) {
			if (sentSet.has(normalizeMediaReferenceForComparison(url))) {
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
		const nextMediaUrl = stripSingle ? void 0 : mediaUrl;
		const nextMediaUrls = strippedMediaUrls ? filteredUrls : mediaUrls;
		const nextPayload = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrl: nextMediaUrl,
			mediaUrls: nextMediaUrls?.length ? nextMediaUrls : void 0,
			...payload.audioAsVoice === true && !nextMediaUrl && !nextMediaUrls?.length ? { audioAsVoice: void 0 } : {}
		});
		if (!nextPayloads) nextPayloads = payloads.slice(0, index);
		nextPayloads.push(nextPayload);
	}
	return nextPayloads ?? payloads;
}
function hasEnabledDeliveryOperation(payload) {
	const pin = payload.delivery?.pin;
	return pin === true || typeof pin === "object" && pin.enabled;
}
function normalizeProviderForComparison(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return normalizeAnyChannelId(trimmed) || normalizeLowercaseStringOrEmpty(trimmed);
}
function normalizeThreadIdForComparison(value) {
	return stringifyRouteThreadId(value);
}
function normalizeTargetForDedupe(provider, rawTarget) {
	const fallback = normalizeOptionalString(rawTarget);
	if (!fallback) return;
	const providerId = normalizeProviderForComparison(provider);
	const normalizer = providerId ? getLoadedChannelPluginForRead(providerId)?.messaging?.normalizeTarget : void 0;
	return normalizeOptionalString(normalizer?.(rawTarget ?? "") ?? fallback);
}
function resolveTargetProviderForComparison(params) {
	const targetProvider = normalizeProviderForComparison(params.targetProvider);
	return targetProvider && targetProvider !== "message" ? targetProvider : params.currentProvider;
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
	const replyToId = normalizeThreadIdForComparison(params.replyToId);
	const resolveReplyTransport = getChannelPlugin(params.provider)?.threading?.resolveReplyTransport;
	if (!params.config || !resolveReplyTransport) return originThreadId;
	const transport = resolveReplyTransport({
		cfg: params.config,
		accountId: params.accountId,
		threadId: originThreadId,
		replyToId,
		replyToIsExplicit: params.replyToIsExplicit,
		replyToCurrent: params.replyToCurrent,
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
		replyToCurrent: params.replyToCurrent,
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
		...params,
		messagingToolSentTargets: sentTargets
	});
	const matchingRoute = matchingTargets.length > 0;
	const routeSentTexts = matchingTargets.flatMap((target) => typeof target.text === "string" && target.text.trim() ? [target.text] : []);
	const routeSentMediaUrls = matchingTargets.flatMap((target) => Array.isArray(target.mediaUrls) ? target.mediaUrls.filter((url) => typeof url === "string" && Boolean(url.trim())) : []);
	const hasTargetTextEvidence = sentTargets.some((target) => typeof target.text === "string" && Boolean(target.text.trim()));
	const hasTargetMediaUrlEvidence = sentTargets.some((target) => Array.isArray(target.mediaUrls) && target.mediaUrls.some((url) => typeof url === "string" && Boolean(url.trim())));
	const allTargetsMatchRoute = matchingRoute && matchingTargets.length === sentTargets.length;
	return {
		shouldDedupePayloads: matchingRoute || sentTargets.length === 0,
		matchingRoute,
		routeSentTexts,
		routeSentMediaUrls,
		useGlobalSentTextEvidenceFallback: allTargetsMatchRoute && !hasTargetTextEvidence,
		useGlobalSentMediaUrlEvidenceFallback: allTargetsMatchRoute && !hasTargetMediaUrlEvidence
	};
}
function filterMessagingToolReplyPayload(params) {
	const metadata = getReplyPayloadMetadata(params.payload);
	const decision = resolveMessagingToolPayloadDedupe({
		...params,
		replyToId: params.payload.replyToId,
		replyToIsExplicit: Boolean(metadata?.replyToIdExplicit || params.payload.replyToTag || params.payload.replyToCurrent),
		replyToCurrent: params.payload.replyToCurrent,
		replyDelivery: metadata?.replyDelivery
	});
	if (!decision.shouldDedupePayloads) {
		const payloads = [params.payload];
		return params.normalizeSentMediaUrls ? Promise.resolve(payloads) : payloads;
	}
	const sentMediaUrls = decision.matchingRoute && !decision.useGlobalSentMediaUrlEvidenceFallback ? decision.routeSentMediaUrls : params.sentMediaUrls ?? [];
	const sentTexts = decision.matchingRoute && !decision.useGlobalSentTextEvidenceFallback ? decision.routeSentTexts : params.sentTexts ?? [];
	const filterPayload = (normalizedSentMediaUrls) => {
		const payloads = filterMessagingToolMediaDuplicates({
			payloads: [params.payload],
			sentMediaUrls: normalizedSentMediaUrls
		});
		const remaining = sentTexts.length === 0 ? payloads : payloads.filter((payload) => !isMessagingToolDuplicate(payload.text ?? "", sentTexts) || hasReplyPayloadContent({
			...payload,
			text: void 0
		}, { extraContent: hasEnabledDeliveryOperation(payload) || payload.location != null }));
		if (params.onDeliveredTerminalDuplicate && decision.matchingRoute && remaining.length === 0 && isReplyPayloadTerminalContent(params.payload) && normalizeReplyPayload(params.payload, { applyChannelTransforms: false }) !== null) params.onDeliveredTerminalDuplicate();
		return remaining;
	};
	return params.normalizeSentMediaUrls ? params.normalizeSentMediaUrls(sentMediaUrls).then(filterPayload) : filterPayload(sentMediaUrls);
}
//#endregion
export { shouldDedupeMessagingToolRepliesForRoute as a, resolveMessagingToolPayloadDedupe as i, filterMessagingToolReplyPayload as n, hasEnabledDeliveryOperation as r, filterMessagingToolMediaDuplicates as t };

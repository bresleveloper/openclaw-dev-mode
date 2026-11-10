import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { d as stringifyRouteThreadId, i as channelRouteTargetsMatchExact } from "./channel-route-2bD3dZs2.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, s as formatBtwTextForExternalDelivery, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import "./plugins-CCVkYF8m.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-Bw7WQh_g.mjs";
import "./embedded-agent-helpers-CRUmVsjM.mjs";
import { r as normalizeTextForComparison, t as isMessagingToolDuplicate } from "./messaging-dedupe-D188k2i5.mjs";
//#region src/auto-reply/reply/reply-payloads-dedupe.ts
function filterMessagingToolMediaDuplicates(params) {
	const { payloads, sentMediaUrls } = params;
	if (sentMediaUrls.length === 0) return payloads;
	const sentSet = new Set(sentMediaUrls.map(normalizeMediaReferenceForComparison).filter(Boolean));
	if (sentSet.size === 0) return payloads;
	let nextPayloads;
	for (const [index, payload] of payloads.entries()) {
		if (hasEnabledDeliveryOperation(payload)) {
			nextPayloads?.push(payload);
			continue;
		}
		const mediaUrl = payload.mediaUrl;
		const mediaUrls = payload.mediaUrls;
		const stripSingle = mediaUrl && sentSet.has(normalizeMediaReferenceForComparison(mediaUrl));
		const filteredUrls = mediaUrls?.filter((url) => !sentSet.has(normalizeMediaReferenceForComparison(url)));
		const strippedUrls = filteredUrls?.length !== mediaUrls?.length;
		if (!stripSingle && !strippedUrls) {
			nextPayloads?.push(payload);
			continue;
		}
		const nextMediaUrl = stripSingle ? void 0 : mediaUrl;
		const nextMediaUrls = strippedUrls ? filteredUrls : mediaUrls;
		const nextPayload = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrl: nextMediaUrl,
			mediaUrls: nextMediaUrls?.length ? nextMediaUrls : void 0,
			...payload.audioAsVoice === true && !nextMediaUrl && !nextMediaUrls?.length ? { audioAsVoice: void 0 } : {}
		});
		nextPayloads ??= payloads.slice(0, index);
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
	return trimmed ? normalizeAnyChannelId(trimmed) || normalizeLowercaseStringOrEmpty(trimmed) : void 0;
}
function normalizeTargetForDedupe(provider, target) {
	if (!target) return;
	const normalizer = getLoadedChannelPluginForRead(provider)?.messaging?.normalizeTarget;
	return normalizeOptionalString(normalizer?.(target) ?? target);
}
function resolveOriginThreadIdForPayload(params) {
	const originThreadId = stringifyRouteThreadId(params.originatingThreadId);
	const replyToId = stringifyRouteThreadId(params.replyToId);
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
	if (transport?.threadId != null) return stringifyRouteThreadId(transport.threadId) ?? originThreadId;
	if (transport?.threadId === null) return stringifyRouteThreadId(transport.replyToId);
	return originThreadId;
}
function getMatchingMessagingToolReplyTargets(params) {
	const provider = normalizeProviderForComparison(params.messageProvider);
	if (!provider) return [];
	const originRawTarget = normalizeOptionalString(params.originatingTo);
	const originAccount = normalizeOptionalAccountId(params.accountId);
	const sentTargets = params.messagingToolSentTargets ?? [];
	if (sentTargets.length === 0) return [];
	const originThreadId = resolveOriginThreadIdForPayload({
		...params,
		provider,
		accountId: originAccount
	});
	return sentTargets.filter((target) => {
		const targetProvider = normalizeProviderForComparison(target.provider);
		if (targetProvider && targetProvider !== "message" && targetProvider !== provider) return false;
		const targetAccount = normalizeOptionalAccountId(target.accountId);
		if (originAccount && targetAccount && originAccount !== targetAccount) return false;
		const targetRaw = normalizeOptionalString(target.to);
		const routeAccount = originAccount ?? targetAccount;
		const originTo = normalizeTargetForDedupe(provider, originRawTarget);
		if (!originTo) return false;
		const targetTo = normalizeTargetForDedupe(provider, targetRaw);
		if (!targetTo) return false;
		const originRoute = {
			channel: provider,
			to: originTo,
			accountId: routeAccount,
			threadId: originThreadId
		};
		const targetRoute = {
			...originRoute,
			to: targetTo,
			threadId: target.threadId ?? (target.threadImplicit ? originThreadId : void 0)
		};
		if (channelRouteTargetsMatchExact({
			left: originRoute,
			right: targetRoute
		})) return true;
		const match = getChannelPlugin(provider)?.outbound?.targetsMatchForReplySuppression;
		if (!match && (originRoute.threadId != null || targetRoute.threadId != null)) return false;
		return match ? match({
			originTarget: originRoute.to,
			targetKey: targetRoute.to,
			targetThreadId: stringifyRouteThreadId(target.threadId)
		}) : targetRoute.to === originRoute.to;
	});
}
function resolveMessagingToolPayloadDedupe(params) {
	const sentTargets = params.messagingToolSentTargets ?? [];
	const matchingTargets = getMatchingMessagingToolReplyTargets(params);
	const matchingRoute = matchingTargets.length > 0;
	const routeSentTexts = matchingTargets.flatMap((target) => typeof target.text === "string" && target.text.trim() ? [target.text] : []);
	const routeSentMediaUrls = matchingTargets.flatMap((target) => Array.isArray(target.mediaUrls) ? target.mediaUrls.filter((url) => typeof url === "string" && Boolean(url.trim())) : []);
	const allTargetsMatchRoute = matchingRoute && matchingTargets.length === sentTargets.length;
	return {
		shouldDedupePayloads: matchingRoute || sentTargets.length === 0,
		matchingRoute,
		routeSentTexts,
		routeSentMediaUrls,
		useGlobalSentTextEvidenceFallback: allTargetsMatchRoute && routeSentTexts.length === 0,
		useGlobalSentMediaUrlEvidenceFallback: allTargetsMatchRoute && routeSentMediaUrls.length === 0
	};
}
function isMessagingToolReplyDuplicate(payload, sentTexts) {
	if (!payload.btw?.question.trim()) return isMessagingToolDuplicate(payload.text ?? "", sentTexts);
	const rendered = normalizeTextForComparison(formatBtwTextForExternalDelivery(payload) ?? "");
	return Boolean(rendered) && sentTexts.some((text) => normalizeTextForComparison(text) === rendered);
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
		const remaining = sentTexts.length === 0 ? payloads : payloads.filter((payload) => !isMessagingToolReplyDuplicate(payload, sentTexts) || hasReplyPayloadContent({
			...payload,
			text: void 0
		}, { extraContent: hasEnabledDeliveryOperation(payload) || payload.location != null }));
		if (params.onDeliveredTerminalDuplicate && decision.matchingRoute && remaining.length === 0 && isReplyPayloadTerminalContent(params.payload) && normalizeReplyPayload(params.payload, { applyChannelTransforms: false }) !== null) params.onDeliveredTerminalDuplicate();
		return remaining;
	};
	return params.normalizeSentMediaUrls ? params.normalizeSentMediaUrls(sentMediaUrls).then(filterPayload) : filterPayload(sentMediaUrls);
}
//#endregion
export { resolveMessagingToolPayloadDedupe as i, filterMessagingToolReplyPayload as n, hasEnabledDeliveryOperation as r, filterMessagingToolMediaDuplicates as t };

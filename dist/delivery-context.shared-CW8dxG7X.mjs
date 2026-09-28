import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { l as normalizeChannelRouteRef, o as channelRouteThreadId, r as channelRouteTarget, t as channelRouteCompactKey, u as normalizeChannelRouteTarget } from "./channel-route-Czo5mOSj.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel, t as isNormalizedMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
//#region src/utils/delivery-context.shared.ts
/**
* Delivery-context normalization and projection helpers.
*
* Persisted sessions expose one closed delivery state. Compatibility
* projections are derived from that state at public boundaries.
*/
/** Normalizes a delivery context into canonical channel route fields, dropping invalid routes. */
function normalizeDeliveryContext(context) {
	if (!context) return;
	const route = normalizeChannelRouteTarget({
		channel: typeof context.channel === "string" ? normalizeMessageChannel(context.channel) ?? context.channel.trim() : void 0,
		to: context.to,
		accountId: context.accountId,
		threadId: context.threadId
	});
	if (!route) return;
	const normalized = {
		channel: route.channel,
		to: channelRouteTarget(route),
		accountId: normalizeOptionalAccountId(route.accountId)
	};
	const threadId = channelRouteThreadId(route);
	if (threadId != null) normalized.threadId = threadId;
	return normalized;
}
/** Checks raw channel/to presence only; does not normalize or validate deliverability. */
function hasDeliveryTargetFields(context) {
	return Boolean(context?.channel && context?.to);
}
/** Normalizes an unknown channel route payload from persisted session/plugin metadata. */
function normalizeDeliveryChannelRoute(route) {
	if (!route || typeof route !== "object" || Array.isArray(route)) return;
	const candidate = route;
	return normalizeChannelRouteRef({
		channel: candidate.channel,
		to: candidate.target?.to,
		rawTo: candidate.target?.rawTo,
		chatType: candidate.target?.chatType,
		accountId: candidate.accountId,
		threadId: candidate.thread?.id,
		threadKind: candidate.thread?.kind,
		threadSource: candidate.thread?.source
	});
}
/** Converts a normalized channel route reference into a delivery context. */
function deliveryContextFromChannelRoute(route) {
	const normalized = normalizeDeliveryChannelRoute(route);
	return normalizeDeliveryContext({
		channel: normalized?.channel,
		to: channelRouteTarget(normalized),
		accountId: normalized?.accountId,
		threadId: channelRouteThreadId(normalized)
	});
}
/** Converts delivery context fields into the SDK channel route reference shape. */
function channelRouteFromDeliveryContext(context) {
	return normalizeChannelRouteTarget(normalizeDeliveryContext(context));
}
function mergeRouteMetadataWithDeliveryContext(route, context) {
	if (!route) return channelRouteFromDeliveryContext(context);
	return normalizeChannelRouteRef({
		channel: route.channel ?? context.channel,
		to: route.target?.to ?? context.to,
		rawTo: route.target?.rawTo,
		chatType: route.target?.chatType,
		accountId: route.accountId ?? context.accountId,
		threadId: route.thread?.id ?? context.threadId,
		threadKind: route.thread?.kind,
		threadSource: route.thread?.source
	});
}
function isInternalRouteContext(context) {
	const channel = context?.channel;
	return Boolean(channel && (channel === "webchat" || isInternalNonDeliveryChannel(channel)));
}
function hasExternalDeliveryTarget(context) {
	const channel = context?.channel;
	return Boolean(channel && isNormalizedMessageChannel(channel) && !isInternalNonDeliveryChannel(channel) && context?.to);
}
function mergeExternalDeliveryContextOverInternalRoute(deliveryContext, internalContext) {
	return normalizeDeliveryContext({
		channel: deliveryContext?.channel,
		to: deliveryContext?.to,
		accountId: deliveryContext?.accountId ?? internalContext?.accountId,
		threadId: deliveryContext?.threadId ?? internalContext?.threadId
	});
}
function isCanonicalSessionDeliveryState(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const candidate = value;
	if (candidate.kind === "none" || candidate.kind === "internal") return true;
	return candidate.kind === "external" && Boolean(candidate.route && typeof candidate.route === "object") && Boolean(candidate.context && typeof candidate.context === "object") && Boolean(candidate.origin && typeof candidate.origin === "object");
}
/** Builds one canonical delivery state from current turn routing facts. */
function normalizeSessionDeliveryState(params) {
	if (!params) return { kind: "none" };
	const normalizedRoute = normalizeDeliveryChannelRoute(params.route);
	const routeContext = deliveryContextFromChannelRoute(normalizedRoute);
	const originContext = normalizeDeliveryContext({
		channel: params.origin?.provider,
		to: params.origin?.to,
		accountId: params.origin?.accountId,
		threadId: params.origin?.threadId
	});
	const context = normalizeDeliveryContext(params.context);
	const fallbackContext = mergeDeliveryContext(context, originContext);
	const routeIsInternalFallback = isInternalRouteContext(routeContext) && hasExternalDeliveryTarget(context);
	const merged = routeIsInternalFallback ? mergeExternalDeliveryContextOverInternalRoute(context, mergeDeliveryContext(routeContext, originContext)) : mergeDeliveryContext(routeContext, fallbackContext);
	if (!merged) return { kind: "none" };
	if (isInternalRouteContext(merged)) return { kind: "internal" };
	const route = mergeRouteMetadataWithDeliveryContext(routeIsInternalFallback ? void 0 : normalizedRoute, merged);
	if (!route) return { kind: "none" };
	const origin = { ...params.origin };
	origin.provider ??= merged.channel;
	origin.to ??= merged.to;
	origin.accountId ??= merged.accountId;
	origin.threadId ??= merged.threadId;
	origin.chatType ??= route.target?.chatType;
	return {
		kind: "external",
		route,
		context: merged,
		origin
	};
}
/** Projects compatibility fields without persisting duplicate delivery state. */
function projectSessionDeliveryFields(delivery) {
	if (delivery?.kind !== "external") return {};
	return {
		route: delivery.route,
		deliveryContext: delivery.context,
		origin: delivery.origin,
		channel: delivery.context.channel ?? delivery.origin.provider,
		lastChannel: delivery.context.channel,
		lastTo: delivery.context.to,
		lastAccountId: delivery.context.accountId,
		lastThreadId: delivery.context.threadId
	};
}
/** Merges delivery contexts without mixing target/account/thread fields across route owners. */
function mergeDeliveryContext(primary, fallback) {
	const normalizedPrimary = normalizeDeliveryContext(primary);
	const normalizedFallback = normalizeDeliveryContext(fallback);
	if (!normalizedPrimary && !normalizedFallback) return;
	const channelsConflict = normalizedPrimary?.channel && normalizedFallback?.channel && normalizedPrimary.channel !== normalizedFallback.channel;
	const accountsConflict = normalizedPrimary?.accountId && normalizedFallback?.accountId && normalizedPrimary.accountId !== normalizedFallback.accountId;
	const routesConflict = channelsConflict || accountsConflict;
	return normalizeDeliveryContext({
		channel: accountsConflict ? normalizedPrimary?.channel : normalizedPrimary?.channel ?? normalizedFallback?.channel,
		to: routesConflict ? normalizedPrimary?.to : normalizedPrimary?.to ?? normalizedFallback?.to,
		accountId: routesConflict ? normalizedPrimary?.accountId : normalizedPrimary?.accountId ?? normalizedFallback?.accountId,
		threadId: routesConflict ? normalizedPrimary?.threadId : normalizedPrimary?.threadId ?? normalizedFallback?.threadId
	});
}
/** Builds a compact stable key for a routable delivery context. */
function deliveryContextKey(context) {
	return channelRouteCompactKey(normalizeDeliveryContext(context));
}
//#endregion
export { mergeDeliveryContext as a, normalizeSessionDeliveryState as c, isCanonicalSessionDeliveryState as i, projectSessionDeliveryFields as l, deliveryContextKey as n, normalizeDeliveryChannelRoute as o, hasDeliveryTargetFields as r, normalizeDeliveryContext as s, deliveryContextFromChannelRoute as t };

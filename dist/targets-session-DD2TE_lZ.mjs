import { d as normalizeOptionalThreadValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeMessageChannel, t as isNormalizedMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { c as channelRoutesShareConversation, u as normalizeChannelRouteTarget } from "./channel-route-BIxMkFzo.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-DIR59G50.mjs";
//#region src/infra/outbound/targets-session.ts
function resolveRouteTarget(params) {
	const route = normalizeChannelRouteTarget(params);
	return route?.channel && route.target ? route : void 0;
}
/**
* Resolves the effective outbound target for a session-scoped delivery request.
*/
function resolveSessionDeliveryTarget(params) {
	const context = deliveryContextFromSession(params.entry);
	const sessionLastChannel = context?.channel && isNormalizedMessageChannel(context.channel) ? context.channel : void 0;
	const parsedSessionTarget = sessionLastChannel ? resolveRouteTarget({
		channel: sessionLastChannel,
		accountId: context?.accountId,
		to: context?.to,
		threadId: context?.threadId
	}) : null;
	const hasTurnSourceChannel = params.turnSourceChannel != null;
	const parsedTurnSourceTarget = hasTurnSourceChannel && params.turnSourceChannel ? resolveRouteTarget({
		channel: params.turnSourceChannel,
		accountId: params.turnSourceAccountId,
		to: params.turnSourceTo,
		threadId: params.turnSourceThreadId
	}) : null;
	const hasTurnSourceThreadId = parsedTurnSourceTarget?.thread?.id != null;
	const lastChannel = hasTurnSourceChannel ? params.turnSourceChannel : sessionLastChannel;
	const lastTo = hasTurnSourceChannel ? parsedTurnSourceTarget?.target?.to ?? params.turnSourceTo : parsedSessionTarget?.target?.to ?? context?.to;
	const lastAccountId = hasTurnSourceChannel ? params.turnSourceAccountId : context?.accountId;
	const turnToMatchesSession = !params.turnSourceTo || !context?.to || params.turnSourceChannel === sessionLastChannel && channelRoutesShareConversation({
		left: parsedTurnSourceTarget,
		right: parsedSessionTarget
	});
	const lastThreadId = hasTurnSourceThreadId ? parsedTurnSourceTarget?.thread?.id : hasTurnSourceChannel && (params.turnSourceChannel !== sessionLastChannel || !turnToMatchesSession) ? void 0 : parsedSessionTarget?.thread?.id;
	const rawRequested = params.requestedChannel ?? "last";
	const requested = rawRequested === "last" ? "last" : normalizeMessageChannel(rawRequested);
	const requestedChannel = requested === "last" ? "last" : requested && isNormalizedMessageChannel(requested) ? requested : void 0;
	const explicitTo = normalizeOptionalString(params.explicitTo);
	const explicitPrefixedChannel = requestedChannel === "last" ? resolveTargetPrefixedChannel(explicitTo) : void 0;
	let channel = explicitPrefixedChannel && isNormalizedMessageChannel(explicitPrefixedChannel) ? explicitPrefixedChannel : requestedChannel === "last" ? lastChannel : requestedChannel;
	if (!channel && params.fallbackChannel && isNormalizedMessageChannel(params.fallbackChannel)) channel = params.fallbackChannel;
	const explicitThreadId = normalizeOptionalThreadValue(params.explicitThreadId);
	const explicitThreadIdSource = explicitThreadId != null ? "explicit" : void 0;
	let to = explicitTo;
	if (!to && lastTo && (channel && channel === lastChannel || params.allowMismatchedLastTo)) to = lastTo;
	const mode = params.mode ?? (explicitTo ? "explicit" : "implicit");
	const accountId = channel && channel === lastChannel ? lastAccountId : void 0;
	const threadId = channel && channel === lastChannel ? mode === "heartbeat" ? hasTurnSourceThreadId ? params.turnSourceThreadId : void 0 : lastThreadId : void 0;
	return {
		channel,
		to,
		accountId,
		threadId: explicitThreadId ?? threadId,
		threadIdSource: explicitThreadIdSource ?? (threadId != null ? hasTurnSourceThreadId ? "turn-source" : "session" : void 0),
		mode,
		lastChannel,
		lastTo,
		lastAccountId,
		lastThreadId
	};
}
//#endregion
export { resolveSessionDeliveryTarget as t };

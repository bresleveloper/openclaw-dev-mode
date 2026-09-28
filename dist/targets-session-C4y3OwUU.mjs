import { d as normalizeOptionalThreadValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as channelRouteTargetsShareConversation } from "./channel-route-Czo5mOSj.mjs";
import { n as normalizeMessageChannel, t as isNormalizedMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
//#region src/infra/outbound/targets-session.ts
function resolveRouteTarget(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel);
	const rawTo = normalizeOptionalString(params.rawTarget);
	if (!channel || !rawTo) return null;
	const threadId = normalizeOptionalThreadValue(params.fallbackThreadId);
	return {
		channel,
		accountId: params.accountId,
		rawTo,
		to: rawTo,
		...threadId != null ? { threadId } : {}
	};
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
		rawTarget: context?.to,
		fallbackThreadId: context?.threadId
	}) : null;
	const hasTurnSourceChannel = params.turnSourceChannel != null;
	const parsedTurnSourceTarget = hasTurnSourceChannel && params.turnSourceChannel ? resolveRouteTarget({
		channel: params.turnSourceChannel,
		accountId: params.turnSourceAccountId,
		rawTarget: params.turnSourceTo,
		fallbackThreadId: params.turnSourceThreadId
	}) : null;
	const hasTurnSourceThreadId = parsedTurnSourceTarget?.threadId != null;
	const lastChannel = hasTurnSourceChannel ? params.turnSourceChannel : sessionLastChannel;
	const lastTo = hasTurnSourceChannel ? parsedTurnSourceTarget?.to ?? params.turnSourceTo : parsedSessionTarget?.to ?? context?.to;
	const lastAccountId = hasTurnSourceChannel ? params.turnSourceAccountId : context?.accountId;
	const turnToMatchesSession = !params.turnSourceTo || !context?.to || params.turnSourceChannel === sessionLastChannel && channelRouteTargetsShareConversation({
		left: parsedTurnSourceTarget,
		right: parsedSessionTarget
	});
	const lastThreadId = hasTurnSourceThreadId ? parsedTurnSourceTarget?.threadId : hasTurnSourceChannel && (params.turnSourceChannel !== sessionLastChannel || !turnToMatchesSession) ? void 0 : parsedSessionTarget?.threadId;
	const rawRequested = params.requestedChannel ?? "last";
	const requested = rawRequested === "last" ? "last" : normalizeMessageChannel(rawRequested);
	const requestedChannel = requested === "last" ? "last" : requested && isNormalizedMessageChannel(requested) ? requested : void 0;
	const rawExplicitTo = typeof params.explicitTo === "string" && params.explicitTo.trim() ? params.explicitTo.trim() : void 0;
	const explicitPrefixedChannel = requestedChannel === "last" ? resolveTargetPrefixedChannel(rawExplicitTo) : void 0;
	let channel = explicitPrefixedChannel && isNormalizedMessageChannel(explicitPrefixedChannel) ? explicitPrefixedChannel : requestedChannel === "last" ? lastChannel : requestedChannel;
	if (!channel && params.fallbackChannel && isNormalizedMessageChannel(params.fallbackChannel)) channel = params.fallbackChannel;
	const explicitTarget = channel && rawExplicitTo ? resolveRouteTarget({
		channel,
		rawTarget: rawExplicitTo,
		fallbackThreadId: params.explicitThreadId
	}) : null;
	const explicitTo = explicitTarget?.to ?? rawExplicitTo;
	const explicitThreadId = normalizeOptionalThreadValue(explicitTarget?.threadId ?? params.explicitThreadId);
	const explicitThreadIdSource = explicitThreadId != null ? "explicit" : void 0;
	let to = explicitTo;
	if (!to && lastTo) {
		if (channel && channel === lastChannel) to = lastTo;
		else if (params.allowMismatchedLastTo) to = lastTo;
	}
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

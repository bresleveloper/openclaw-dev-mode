import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import "./errors-DPfGDWk1.mjs";
//#region src/channels/ack-reactions.ts
function shouldAckReaction(params) {
	const scope = params.scope ?? "group-mentions";
	if (scope === "off" || scope === "none") return false;
	if (params.inboundEventKind === "room_event" && scope !== "all") return false;
	if (scope === "all") return true;
	if (scope === "direct") return params.isDirect;
	if (scope === "group-all") return params.isGroup;
	if (scope === "group-mentions") {
		if (!params.isMentionableGroup || !params.canDetectMention) return false;
		return params.effectiveWasMentioned || params.shouldBypassMention === true;
	}
	return false;
}
function createAckReactionHandle(params) {
	const ackReactionValue = params.ackReactionValue.trim();
	if (!ackReactionValue) return null;
	let sendPromise;
	try {
		sendPromise = params.send();
	} catch (err) {
		sendPromise = Promise.reject(toErrorObject(err, "Non-Error rejection"));
	}
	return {
		ackReactionPromise: sendPromise.then(() => true, (err) => {
			params.onSendError?.(err);
			return false;
		}),
		ackReactionValue,
		remove: params.remove
	};
}
function removeAckReactionAfterReply(params) {
	if (!params.removeAfterReply || !params.ackReactionPromise || !params.ackReactionValue) return;
	params.ackReactionPromise.then((didAck) => {
		if (!didAck) return;
		params.remove().catch((err) => params.onError?.(err));
	});
}
function removeAckReactionHandleAfterReply(params) {
	removeAckReactionAfterReply({
		removeAfterReply: params.removeAfterReply,
		ackReactionPromise: params.ackReaction?.ackReactionPromise ?? null,
		ackReactionValue: params.ackReaction?.ackReactionValue ?? null,
		remove: params.ackReaction?.remove ?? (async () => {}),
		onError: params.onError
	});
}
//#endregion
export { shouldAckReaction as i, removeAckReactionAfterReply as n, removeAckReactionHandleAfterReply as r, createAckReactionHandle as t };

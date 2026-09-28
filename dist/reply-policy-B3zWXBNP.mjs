import { g as isReplyPayloadTargetSuppressed } from "./reply-payload-B2ZQhznY.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DtUaHKzS.mjs";
//#region src/infra/outbound/reply-policy.ts
function normalizeOutboundReplyFacts(params) {
	const reply = params.reply;
	if (reply?.source === "explicit") return reply;
	const replyToId = reply?.replyToId ?? params.replyToId ?? void 0;
	const mode = reply?.mode ?? params.replyToMode ?? "all";
	return replyToId && mode !== "off" ? {
		source: "implicit",
		replyToId,
		mode: mode === "all" ? "all" : "first"
	} : void 0;
}
/** Creates a reply-to supplier that consumes implicit single-use reply ids once. */
function createReplyToFanout(params) {
	const replyToId = params.replyToId ?? void 0;
	if (!replyToId) return () => void 0;
	if (!(params.replyToIdSource !== "explicit" && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode))) return () => replyToId;
	let current = replyToId;
	return () => {
		const value = current;
		current = void 0;
		return value;
	};
}
/** Builds per-payload reply routing policy for outbound delivery batches. */
function createReplyToDeliveryPolicy(params) {
	const reply = normalizeOutboundReplyFacts(params);
	const singleUseReplyTo = reply?.source === "implicit" && isSingleUseReplyToMode(reply.mode);
	let replyToConsumed = false;
	const resolveCurrentReplyTo = (payload) => {
		if (isReplyPayloadTargetSuppressed(payload)) return {};
		if (payload.replyToId != null) return payload.replyToId ? {
			replyToId: payload.replyToId,
			source: "explicit"
		} : {};
		if (!reply) return {};
		if (reply.source === "explicit" || !singleUseReplyTo) return {
			replyToId: reply.replyToId,
			source: reply.source
		};
		return replyToConsumed ? {} : {
			replyToId: reply.replyToId,
			source: "implicit"
		};
	};
	const applyReplyToConsumption = (overrides, options) => {
		if (!options?.consumeImplicitReply || !overrides.replyToId || !singleUseReplyTo) return overrides;
		if (replyToConsumed) return {
			...overrides,
			replyToId: void 0
		};
		replyToConsumed = true;
		return overrides;
	};
	return {
		resolveCurrentReplyTo,
		applyReplyToConsumption
	};
}
//#endregion
export { createReplyToFanout as n, normalizeOutboundReplyFacts as r, createReplyToDeliveryPolicy as t };

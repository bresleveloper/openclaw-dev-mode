import { v as isReplyPayloadTargetSuppressed } from "./reply-payload-BLX_BF2U.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-CLjC4hNl.mjs";
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
	let current = params.replyToId || void 0;
	const singleUse = params.replyToIdSource !== "explicit" && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode);
	return () => {
		const value = current;
		if (singleUse) current = void 0;
		return value;
	};
}
/** Builds per-payload reply routing policy for outbound delivery batches. */
function createReplyToDeliveryPolicy(params) {
	let reply = normalizeOutboundReplyFacts(params);
	const singleUseReplyTo = reply?.source === "implicit" && isSingleUseReplyToMode(reply.mode);
	const resolveCurrentReplyTo = (payload) => {
		if (isReplyPayloadTargetSuppressed(payload)) return {};
		if (payload.replyToId != null) return payload.replyToId ? {
			replyToId: payload.replyToId,
			source: "explicit"
		} : {};
		if (!reply) return {};
		return {
			replyToId: reply.replyToId,
			source: reply.source
		};
	};
	const applyReplyToConsumption = (overrides) => {
		if (overrides.replyToIdSource !== "implicit" || !overrides.replyToId || !singleUseReplyTo) return overrides;
		if (!reply) return {
			...overrides,
			replyToId: void 0
		};
		reply = void 0;
		return overrides;
	};
	return {
		resolveCurrentReplyTo,
		applyReplyToConsumption
	};
}
//#endregion
export { createReplyToFanout as n, normalizeOutboundReplyFacts as r, createReplyToDeliveryPolicy as t };

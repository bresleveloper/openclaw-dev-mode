import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
//#region src/channels/message/capabilities.ts
function hasMediaPayload(payload) {
	return Boolean(payload.mediaUrl?.trim()) || Array.isArray(payload.mediaUrls) && payload.mediaUrls.some((url) => typeof url === "string" && url.trim().length > 0);
}
/** Derives the adapter capabilities core needs before it can require durable final delivery. */
function deriveDurableFinalDeliveryRequirements(params) {
	const requirements = {};
	const requested = [
		["text", true],
		["media", hasMediaPayload(params.payload)],
		["replyTo", params.replyToId != null || params.payload.replyToId != null],
		["thread", params.threadId != null],
		["silent", params.silent],
		["messageSendingHooks", params.messageSendingHooks !== false],
		["payload", params.payloadTransport],
		["batch", params.batch],
		["reconcileUnknownSend", params.reconcileUnknownSend],
		["afterSendSuccess", params.afterSendSuccess],
		["afterCommit", params.afterCommit],
		...Object.entries(params.extraCapabilities ?? {})
	];
	for (const [capability, required] of requested) if (required === true) requirements[capability] = true;
	return requirements;
}
/** Matches the structured-payload branch selected by core delivery. */
function payloadRequiresDurablePayloadTransport(payload, options) {
	return payload.isError === true && options?.sendTextOnlyErrorPayloads === true || hasReplyPayloadContent({
		presentation: payload.presentation,
		interactive: payload.interactive,
		channelData: payload.channelData,
		location: payload.location
	}, { extraContent: payload.location != null }) || payload.audioAsVoice === true || payload.videoAsNote === true;
}
/** Derives the union of required capabilities from the final concrete batch. */
function deriveDurableFinalDeliveryRequirementsForBatch(params) {
	const requirements = params.reconcileUnknownSend && params.payloads.length > 0 ? { reconcileUnknownSend: true } : {};
	for (const payload of params.payloads) {
		const current = deriveDurableFinalDeliveryRequirements({
			payload,
			replyToId: params.replyToId,
			threadId: params.threadId,
			silent: params.silent,
			payloadTransport: payloadRequiresDurablePayloadTransport(payload),
			batch: params.payloads.length > 1,
			reconcileUnknownSend: params.reconcileUnknownSend
		});
		Object.assign(requirements, current);
	}
	return requirements;
}
//#endregion
export { deriveDurableFinalDeliveryRequirementsForBatch as n, payloadRequiresDurablePayloadTransport as r, deriveDurableFinalDeliveryRequirements as t };

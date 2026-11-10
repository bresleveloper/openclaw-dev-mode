import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { i as serializeDurableMessagePayloadOutcomes } from "./send-Ccg5tbzy.mjs";
import "./runtime-DV2_kfTG.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-CSe-71lq.mjs";
//#region src/agents/command/delivery-result.ts
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function buildDeliveryResult(params) {
	const successfulCronAdds = params.result.successfulCronAdds;
	const hasSuccessfulCronAdds = typeof successfulCronAdds === "number" && Number.isFinite(successfulCronAdds) && successfulCronAdds > 0;
	return {
		payloads: params.payloads,
		meta: params.meta,
		...params.result.didSendViaMessagingTool === true ? { didSendViaMessagingTool: true } : {},
		...params.result.didDeliverSourceReplyViaMessageTool === true ? { didDeliverSourceReplyViaMessageTool: true } : {},
		...params.result.sourceReplyDelivered ? { sourceReplyDelivered: true } : {},
		...params.result.sourceReplyDeliveryState !== void 0 ? { sourceReplyDeliveryState: params.result.sourceReplyDeliveryState } : {},
		...hasNonEmptyArray(params.result.messagingToolSourceReplyPayloads) ? { messagingToolSourceReplyPayloads: params.result.messagingToolSourceReplyPayloads } : {},
		...hasAnyNonEmptyString(params.result.messagingToolSentTexts) ? { messagingToolSentTexts: params.result.messagingToolSentTexts } : {},
		...hasAnyNonEmptyString(params.result.messagingToolSentMediaUrls) ? { messagingToolSentMediaUrls: params.result.messagingToolSentMediaUrls } : {},
		...hasNonEmptyArray(params.result.messagingToolSentTargets) ? { messagingToolSentTargets: params.result.messagingToolSentTargets } : {},
		...params.result.didSendDeterministicApprovalPrompt === true ? { didSendDeterministicApprovalPrompt: true } : {},
		...hasNonEmptyArray(params.result.acceptedSessionSpawns) ? { acceptedSessionSpawns: params.result.acceptedSessionSpawns } : {},
		...params.result.requesterContinuationSettled === true ? { requesterContinuationSettled: true } : {},
		...hasSuccessfulCronAdds ? { successfulCronAdds } : {},
		...params.deliverySucceeded !== void 0 ? { deliverySucceeded: params.deliverySucceeded } : {},
		...params.deliveryStatus ? { deliveryStatus: params.deliveryStatus } : {}
	};
}
function deliveryStatusFromDurableSend(send) {
	const payloadOutcomes = serializeDurableMessagePayloadOutcomes(send.payloadOutcomes, { includeHookEffect: true });
	const status = {
		requested: true,
		attempted: true,
		status: send.status
	};
	switch (send.status) {
		case "sent":
		case "suppressed": return {
			...status,
			succeeded: true,
			...send.status === "suppressed" ? { reason: send.reason } : {},
			resultCount: send.status === "sent" ? send.results.length : 0,
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
		case "partial_failed":
		case "failed": return {
			...status,
			succeeded: send.status === "partial_failed" ? "partial" : false,
			error: true,
			errorMessage: formatErrorMessage(send.error),
			...send.status === "partial_failed" ? {
				resultCount: send.results.length,
				sentBeforeError: true
			} : send.stage ? { reason: send.stage } : {},
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
	}
	return send;
}
function preDeliveryFailureStatus(reason) {
	return {
		requested: true,
		attempted: false,
		status: "failed",
		succeeded: false,
		error: true,
		reason
	};
}
function noVisiblePayloadStatus(reason) {
	return {
		requested: true,
		attempted: false,
		status: "suppressed",
		succeeded: true,
		reason: reason === "channel_transform" ? reason : "no_visible_payload",
		resultCount: 0
	};
}
/**
* Payloads the source may receive. A tool-only source gets only host-granted ones
* (diagnostics, media); a host-owned turn may also keep runtime error payloads out of it.
*/
function selectSourceDeliverablePayloads(payloads, opts) {
	const deliverable = opts.internalDeliverySuppressErrors ? payloads.filter((payload) => payload.isError !== true) : payloads;
	return opts.sourceReplyDeliveryMode === "message_tool_only" ? deliverable.filter((payload) => getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true) : deliverable;
}
//#endregion
export { selectSourceDeliverablePayloads as a, preDeliveryFailureStatus as i, deliveryStatusFromDurableSend as n, noVisiblePayloadStatus as r, buildDeliveryResult as t };

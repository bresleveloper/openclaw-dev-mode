//#region src/channels/message/types.ts
/** Capability names a channel must advertise before core can rely on durable final delivery. */
const durableFinalDeliveryCapabilities = [
	"text",
	"media",
	"poll",
	"payload",
	"silent",
	"replyTo",
	"thread",
	"nativeQuote",
	"messageSendingHooks",
	"batch",
	"reconcileUnknownSend",
	"afterSendSuccess",
	"afterCommit"
];
/** Concrete send shapes an adapter can reconcile after an unknown platform outcome. */
const unknownSendReconciliationKinds = [
	"text",
	"media",
	"payload",
	"poll",
	"batch"
];
const channelMessageLiveCapabilities = [
	"draftPreview",
	"previewFinalization",
	"progressUpdates",
	"nativeStreaming",
	"quietFinalization"
];
const livePreviewFinalizerCapabilities = [
	"finalEdit",
	"normalFallback",
	"discardPending",
	"previewReceipt",
	"retainOnAmbiguousFailure"
];
const channelMessageReceiveAckPolicies = [
	"after_receive_record",
	"after_agent_dispatch",
	"after_durable_send",
	"manual"
];
//#endregion
export { unknownSendReconciliationKinds as a, livePreviewFinalizerCapabilities as i, channelMessageReceiveAckPolicies as n, durableFinalDeliveryCapabilities as r, channelMessageLiveCapabilities as t };

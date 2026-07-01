//#region src/utils/message-channel-constants.ts
const INTERNAL_MESSAGE_CHANNEL = "webchat";
const INTERNAL_NON_DELIVERY_CHANNELS = [
	"heartbeat",
	"cron",
	"webhook",
	"voice",
	"sessions_send"
];
function isInternalNonDeliveryChannel(value) {
	return INTERNAL_NON_DELIVERY_CHANNELS.includes(value);
}
const NATIVE_APPROVAL_CHANNELS = [
	"webchat",
	"discord",
	"googlechat",
	"imessage",
	"matrix",
	"qqbot",
	"signal",
	"slack",
	"telegram",
	"whatsapp"
];
function isNativeApprovalChannel(value) {
	if (typeof value !== "string") return false;
	return NATIVE_APPROVAL_CHANNELS.includes(value);
}
//#endregion
export { isInternalNonDeliveryChannel as n, isNativeApprovalChannel as r, INTERNAL_MESSAGE_CHANNEL as t };

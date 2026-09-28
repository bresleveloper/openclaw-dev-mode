import { t as isStringOption } from "./string-readers-Dkx3Z36w.mjs";
//#region src/utils/message-channel-constants.ts
const INTERNAL_MESSAGE_CHANNEL = "webchat";
function internalSessionConversationId(channelId, sessionKey) {
	return channelId === "webchat" ? sessionKey : void 0;
}
const INTERNAL_NON_DELIVERY_CHANNELS = [
	"heartbeat",
	"cron",
	"webhook",
	"voice",
	"sessions_send"
];
function isInternalNonDeliveryChannel(value) {
	return isStringOption(value, INTERNAL_NON_DELIVERY_CHANNELS);
}
//#endregion
export { internalSessionConversationId as n, isInternalNonDeliveryChannel as r, INTERNAL_MESSAGE_CHANNEL as t };

import { t as getOptionalWhatsAppChannelRuntime } from "./runtime-BLlToOi6.mjs";
import { getChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
//#region extensions/whatsapp/src/connection-controller-runtime-context.ts
const WHATSAPP_CONNECTION_CONTROLLER_CAPABILITY = "connection-controller";
const WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY = "connection-owner-pending";
function getWhatsAppConnectionController(accountId) {
	return getChannelRuntimeContext({
		channelRuntime: getOptionalWhatsAppChannelRuntime() ?? void 0,
		channelId: "whatsapp",
		accountId,
		capability: "connection-controller"
	}) ?? null;
}
function hasPendingWhatsAppConnectionOwner(accountId) {
	return Boolean(getChannelRuntimeContext({
		channelRuntime: getOptionalWhatsAppChannelRuntime() ?? void 0,
		channelId: "whatsapp",
		accountId,
		capability: WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY
	}));
}
//#endregion
export { hasPendingWhatsAppConnectionOwner as i, WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY as n, getWhatsAppConnectionController as r, WHATSAPP_CONNECTION_CONTROLLER_CAPABILITY as t };

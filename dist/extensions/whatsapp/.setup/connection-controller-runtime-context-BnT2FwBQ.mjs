import { t as getOptionalWhatsAppChannelRuntime } from "./runtime-C5kM4SuW.mjs";
import { getChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
// extensions/whatsapp/src/connection-controller-runtime-context.ts
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
export { hasPendingWhatsAppConnectionOwner as i, WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY as n, getWhatsAppConnectionController as r, WHATSAPP_CONNECTION_CONTROLLER_CAPABILITY as t };

import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/whatsapp/src/runtime.ts
const runtimeStore = createPluginRuntimeStore({
	pluginId: "whatsapp",
	errorMessage: "WhatsApp runtime not initialized"
});
const channelRuntimeStore = createPluginRuntimeStore({
	key: "plugin-runtime:whatsapp:channel-context-owner",
	errorMessage: "WhatsApp channel runtime not initialized"
});
/** Injects current helpers while preserving the process-lifetime channel context owner. */
function setWhatsAppRuntime(next) {
	if (!channelRuntimeStore.tryGetRuntime()) channelRuntimeStore.setRuntime(next.channel);
	runtimeStore.setRuntime(next);
}
const getWhatsAppRuntime = runtimeStore.getRuntime;
const getOptionalWhatsAppRuntime = runtimeStore.tryGetRuntime;
const getWhatsAppChannelRuntime = channelRuntimeStore.getRuntime;
const getOptionalWhatsAppChannelRuntime = channelRuntimeStore.tryGetRuntime;
//#endregion
export { setWhatsAppRuntime as a, getWhatsAppRuntime as i, getOptionalWhatsAppRuntime as n, getWhatsAppChannelRuntime as r, getOptionalWhatsAppChannelRuntime as t };

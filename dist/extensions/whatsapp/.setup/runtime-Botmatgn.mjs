import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/whatsapp/src/runtime.ts
const runtimeStore = createPluginRuntimeStore({
	pluginId: "whatsapp",
	errorMessage: "WhatsApp runtime not initialized"
});
const setWhatsAppRuntime = runtimeStore.setRuntime;
const getWhatsAppRuntime = runtimeStore.getRuntime;
const getOptionalWhatsAppRuntime = runtimeStore.tryGetRuntime;
const getOptionalWhatsAppChannelRuntime = () => getOptionalWhatsAppRuntime()?.channel;
const getWhatsAppChannelRuntime = () => {
	const channel = getOptionalWhatsAppChannelRuntime();
	if (!channel) throw new Error("WhatsApp channel runtime not initialized");
	return channel;
};
//#endregion
export { setWhatsAppRuntime as a, getWhatsAppRuntime as i, getOptionalWhatsAppRuntime as n, getWhatsAppChannelRuntime as r, getOptionalWhatsAppChannelRuntime as t };

import { t as createPluginRuntimeStore } from "./runtime-store-pFaG-6b2.mjs";
//#region extensions/telegram/src/runtime.ts
const { setRuntime: setTelegramRuntime, getRuntime: getTelegramRuntime, tryGetRuntime: getOptionalTelegramRuntime } = createPluginRuntimeStore({
	pluginId: "telegram",
	errorMessage: "Telegram runtime not initialized"
});
//#endregion
export { getTelegramRuntime as n, setTelegramRuntime as r, getOptionalTelegramRuntime as t };

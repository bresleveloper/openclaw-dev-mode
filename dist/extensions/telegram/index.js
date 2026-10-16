import { t as defineBundledChannelEntry } from "../../channel-entry-contract-C_-pMc2_.mjs";
import { t as registerTelegramMiniApp } from "../../miniapp-api-U89MCogQ.mjs";
//#region extensions/telegram/index.ts
var telegram_default = defineBundledChannelEntry({
	id: "telegram",
	name: "Telegram",
	description: "Telegram channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "telegramPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setTelegramRuntime"
	},
	accountInspect: {
		specifier: "./account-inspect-api.js",
		exportName: "inspectTelegramReadOnlyAccount"
	},
	registerFull: registerTelegramMiniApp
});
//#endregion
export { telegram_default as default };
